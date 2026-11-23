/* === [ARQUIVO: js/equipe-mapa.js] === */
/* === [SECAO: ESTADO DE EQUIPE, PTT E CORES] === */
const AZIMUTE_TEAM_STORAGE_KEY = 'azimute_team_session_v1';
const AZIMUTE_TEAM_COLORS = [
    '#C5A869',
    '#38BDF8',
    '#34D399',
    '#F59E0B',
    '#A78BFA',
    '#F97316',
    '#22D3EE',
    '#EAB308'
];

let azimuteTeamState = {
    roomCode: 'PMMG01',
    qra: '',
    color: '#C5A869',
    connected: false,
    pttActive: false,
    mediaRecorder: null,
    audioChunks: [],
    members: [],
    messages: [],
    ghostPin: null
};

let azimuteMapInstance = null;
let azimuteMapLocked = false;
let azimuteOrbitTimerId = null;
let azimuteOrbitAngleDeg = 0;
let azimuteOrbitCenter = null;
let azimuteTacticalPins = [];
let azimuteUndoStack = [];
let azimuteRedoStack = [];

/* === [SECAO: COR UNICA SEM ROSA E SALA DA EQUIPE] === */
function sanitizeTeamColor(hex) {
    const clean = String(hex || '').trim().toUpperCase();
    const forbiddenPink = ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#DB2777', '#EC4899', '#F472B6', '#F9A8D4', '#FDA4AF', '#FB7185'];
    if (!clean || forbiddenPink.includes(clean) || clean.includes('FF69') || clean.includes('EC48') || clean.includes('F472')) {
        return '#C5A869';
    }
    return clean;
}

function assignUniqueOperatorColor(qraName, usedColorsSet) {
    const preferred = sanitizeTeamColor(azimuteTeamState.color);
    if (!usedColorsSet.has(preferred)) return preferred;
    for (let i = 0; i < AZIMUTE_TEAM_COLORS.length; i++) {
        const candidate = sanitizeTeamColor(AZIMUTE_TEAM_COLORS[i]);
        if (!usedColorsSet.has(candidate)) return candidate;
    }
    return '#C5A869';
}

function saveTeamSessionLocal() {
    try {
        localStorage.setItem(AZIMUTE_TEAM_STORAGE_KEY, JSON.stringify({
            roomCode: azimuteTeamState.roomCode,
            qra: azimuteTeamState.qra,
            color: sanitizeTeamColor(azimuteTeamState.color),
            messages: azimuteTeamState.messages.slice(-40),
            ghostPin: azimuteTeamState.ghostPin
        }));
    } catch (e) {}
}

function loadTeamSessionLocal() {
    try {
        const raw = localStorage.getItem(AZIMUTE_TEAM_STORAGE_KEY);
        if (!raw) return;
        const p = JSON.parse(raw);
        if (p && typeof p === 'object') {
            azimuteTeamState.roomCode = (p.roomCode || 'PMMG01').toUpperCase();
            azimuteTeamState.qra = p.qra || '';
            azimuteTeamState.color = sanitizeTeamColor(p.color || '#C5A869');
            azimuteTeamState.messages = Array.isArray(p.messages) ? p.messages : [];
            azimuteTeamState.ghostPin = p.ghostPin || null;
        }
    } catch (e) {}
}

window.connectAzimuteTeamRoom = function() {
    const roomInp = document.getElementById('teamRoomCodeInput');
    const qraInp = document.getElementById('teamQraInput');
    const colorInp = document.getElementById('teamColorInput');

    const room = ((roomInp ? roomInp.value : azimuteTeamState.roomCode) || 'PMMG01').trim().toUpperCase();
    const qra = ((qraInp ? qraInp.value : azimuteTeamState.qra) || '').trim().toUpperCase();
    if (!qra) {
        if (typeof showToast === 'function') showToast('Informe seu QRA antes de entrar na sala.');
        return;
    }

    const usedColors = new Set(
        azimuteTeamState.members
            .filter(m => m.qra !== qra)
            .map(m => sanitizeTeamColor(m.color))
    );
    const lockedColor = assignUniqueOperatorColor(colorInp ? colorInp.value : azimuteTeamState.color, usedColors);

    azimuteTeamState.roomCode = room;
    azimuteTeamState.qra = qra;
    azimuteTeamState.color = lockedColor;
    azimuteTeamState.connected = true;
    azimuteTeamState.ghostPin = null;

    if (colorInp) colorInp.value = lockedColor;
    if (!azimuteTeamState.members.some(m => m.qra === qra)) {
        azimuteTeamState.members.push({
            id: 'op_' + qra,
            qra,
            color: lockedColor,
            online: true,
            lastSeen: 'AGORA'
        });
    } else {
        azimuteTeamState.members.forEach(m => {
            if (m.qra === qra) { m.color = lockedColor; m.online = true; m.lastSeen = 'AGORA'; }
        });
    }

    saveTeamSessionLocal();
    renderTeamMembersList();
    appendTeamSystemMessage(`${qra} conectado na sala ${room}.`);
    if (typeof showToast === 'function') showToast(`Sala ${room} ativa como ${qra}.`);
};

window.disconnectAzimuteTeamRoom = function() {
    const qra = azimuteTeamState.qra || 'OPERADOR';
    const lat = typeof azimuteLastGeoLat === 'number' ? azimuteLastGeoLat : -19.9162;
    const lon = typeof azimuteLastGeoLon === 'number' ? azimuteLastGeoLon : -44.0809;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    azimuteTeamState.ghostPin = {
        qra,
        color: sanitizeTeamColor(azimuteTeamState.color),
        lat,
        lon,
        lastSeen: hora,
        label: `[OFF] ${qra} (${hora})`
    };
    azimuteTeamState.connected = false;
    azimuteTeamState.members.forEach(m => {
        if (m.qra === qra) { m.online = false; m.lastSeen = hora; }
    });

    saveTeamSessionLocal();
    renderTeamMembersList();
    renderGhostMarkerOnMap();
    appendTeamSystemMessage(`${qra} desconectado. Marcador fantasma salvo as ${hora}.`);
    if (typeof showToast === 'function') showToast('Sessao encerrada com marcador fantasma.');
};

function appendTeamSystemMessage(text) {
    azimuteTeamState.messages.push({
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        sender: 'SISTEMA',
        color: '#C5A869',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text
    });
    saveTeamSessionLocal();
    renderTeamMessagesFeed();
}

window.sendAzimuteTeamMessage = function() {
    const inp = document.getElementById('teamChatMessageInput');
    const text = (inp ? inp.value : '').trim();
    if (!text) return;
    const sender = azimuteTeamState.qra || 'OPERADOR';
    azimuteTeamState.messages.push({
        id: 'msg_' + Date.now(),
        sender,
        color: sanitizeTeamColor(azimuteTeamState.color),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text
    });
    if (inp) inp.value = '';
    saveTeamSessionLocal();
    renderTeamMessagesFeed();
};

/* === [SECAO: FOTO COM DESENHO / TELESTRACAO E PTT] === */
window.handleTeamPhotoAttachment = function(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('teamTelestrationCanvas');
            if (!canvas) return;
            canvas.width = Math.min(img.width, 900);
            const ratio = canvas.width / img.width;
            canvas.height = Math.round(img.height * ratio);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            enableTelestrationDrawing(canvas, ctx);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

function enableTelestrationDrawing(canvas, ctx) {
    let drawing = false;
    const getPos = (ev) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = ev.touches && ev.touches[0] ? ev.touches[0].clientX : ev.clientX;
        const clientY = ev.touches && ev.touches[0] ? ev.touches[0].clientY : ev.clientY;
        return {
            x: ((clientX - rect.left) / rect.width) * canvas.width,
            y: ((clientY - rect.top) / rect.height) * canvas.height
        };
    };
    const start = (ev) => { ev.preventDefault(); drawing = true; const p = getPos(ev); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (ev) => {
        if (!drawing) return;
        ev.preventDefault();
        const p = getPos(ev);
        ctx.strokeStyle = sanitizeTeamColor(azimuteTeamState.color);
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };
    const end = () => { drawing = false; };

    canvas.onmousedown = start;
    canvas.onmousemove = move;
    window.addEventListener('mouseup', end);
    canvas.ontouchstart = start;
    canvas.ontouchmove = move;
    window.addEventListener('touchend', end);
}

window.sendTelestratedPhotoToTeam = function() {
    const canvas = document.getElementById('teamTelestrationCanvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
    azimuteTeamState.messages.push({
        id: 'img_' + Date.now(),
        sender: azimuteTeamState.qra || 'OPERADOR',
        color: sanitizeTeamColor(azimuteTeamState.color),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        text: 'Imagem marcada enviada para a equipe.',
        imageDataUrl: dataUrl
    });
    saveTeamSessionLocal();
    renderTeamMessagesFeed();
    if (typeof showToast === 'function') showToast('Foto com marcacao enviada.');
};

window.startTeamPtt = async function() {
    if (azimuteTeamState.pttActive) return;
    azimuteTeamState.pttActive = true;
    const badge = document.getElementById('teamPttStatusLabel');
    if (badge) badge.textContent = 'TRANSMITINDO PTT';
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            azimuteTeamState.audioChunks = [];
            const rec = new MediaRecorder(stream);
            rec.ondataavailable = e => { if (e.data && e.data.size > 0) azimuteTeamState.audioChunks.push(e.data); };
            rec.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(azimuteTeamState.audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(blob);
                azimuteTeamState.messages.push({
                    id: 'ptt_' + Date.now(),
                    sender: azimuteTeamState.qra || 'OPERADOR',
                    color: sanitizeTeamColor(azimuteTeamState.color),
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    text: 'Audio PTT gravado',
                    audioUrl
                });
                saveTeamSessionLocal();
                renderTeamMessagesFeed();
            };
            azimuteTeamState.mediaRecorder = rec;
            rec.start();
        }
    } catch (e) {}
};

window.stopTeamPtt = function() {
    if (!azimuteTeamState.pttActive) return;
    azimuteTeamState.pttActive = false;
    const badge = document.getElementById('teamPttStatusLabel');
    if (badge) badge.textContent = 'PTT PRONTO';
    try {
        if (azimuteTeamState.mediaRecorder && azimuteTeamState.mediaRecorder.state !== 'inactive') {
            azimuteTeamState.mediaRecorder.stop();
        }
    } catch (e) {}
};

function renderTeamMembersList() {
    const el = document.getElementById('teamOnlineMembersList');
    if (!el) return;
    if (!azimuteTeamState.members.length) {
        el.innerHTML = '<span class="text-xs text-gray-400">Nenhum operador conectado.</span>';
        return;
    }
    el.innerHTML = azimuteTeamState.members.map(m => {
        const cor = sanitizeTeamColor(m.color);
        return `<div class="px-2.5 py-1.5 rounded-lg bg-[#0D0D0D] border border-pmmg-border flex items-center gap-2 text-xs">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${cor}"></span>
            <strong class="text-white font-mono">${escapeHtmlSafe(m.qra)}</strong>
            <span class="text-[10px] text-gray-400">${m.online ? 'ONLINE' : 'OFF ' + escapeHtmlSafe(m.lastSeen || '')}</span>
        </div>`;
    }).join('');
}

function renderTeamMessagesFeed() {
    const el = document.getElementById('teamChatFeed');
    if (!el) return;
    el.innerHTML = azimuteTeamState.messages.slice(-25).map(msg => {
        const cor = sanitizeTeamColor(msg.color);
        return `<div class="p-2.5 rounded-xl bg-[#0D0D0D] border border-pmmg-border text-xs space-y-1">
            <div class="flex items-center justify-between gap-2">
                <strong class="font-mono" style="color:${cor}">${escapeHtmlSafe(msg.sender)}</strong>
                <span class="text-[10px] font-mono text-gray-400">${escapeHtmlSafe(msg.time)}</span>
            </div>
            <p class="text-gray-200">${escapeHtmlSafe(msg.text)}</p>
            ${msg.imageDataUrl ? `<img src="${msg.imageDataUrl}" alt="Marcacao" class="w-full max-h-48 object-contain rounded-lg border border-pmmg-border mt-1">` : ''}
            ${msg.audioUrl ? `<audio controls src="${msg.audioUrl}" class="w-full h-8 mt-1"></audio>` : ''}
        </div>`;
    }).join('');
}

/* === [SECAO: MAPA, ORBE RADIAL, ESPECTRO E CAMERA ORBITAR] === */
function initAzimuteTacticalMap() {
    const mapContainer = document.getElementById('azimuteTacticalMapCanvas');
    if (!mapContainer || typeof L === 'undefined') return;
    if (azimuteMapInstance) return;

    const lat = typeof azimuteLastGeoLat === 'number' ? azimuteLastGeoLat : -19.9162;
    const lon = typeof azimuteLastGeoLon === 'number' ? azimuteLastGeoLon : -44.0809;

    azimuteMapInstance = L.map(mapContainer, {
        center: [lat, lon],
        zoom: 16,
        zoomControl: true
    });

    setAzimuteMapLayer('dark');
    renderGhostMarkerOnMap();
}

window.setAzimuteMapLayer = function(layerKey) {
    if (!azimuteMapInstance || typeof L === 'undefined') return;
    if (window._azimuteBaseLayer) {
        azimuteMapInstance.removeLayer(window._azimuteBaseLayer);
    }
    const urls = {
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    };
    const chosen = urls[layerKey] || urls.dark;
    window._azimuteBaseLayer = L.tileLayer(chosen, { maxZoom: 19 }).addTo(azimuteMapInstance);
    if (typeof showToast === 'function') showToast('Camada do mapa: ' + layerKey.toUpperCase());
};

window.toggleAzimuteMapLock = function() {
    if (!azimuteMapInstance) return;
    azimuteMapLocked = !azimuteMapLocked;
    const handlers = ['dragging', 'touchZoom', 'doubleClickZoom', 'scrollWheelZoom', 'boxZoom', 'keyboard'];
    handlers.forEach(h => {
        if (!azimuteMapInstance[h]) return;
        if (azimuteMapLocked) azimuteMapInstance[h].disable();
        else azimuteMapInstance[h].enable();
    });
    const lbl = document.getElementById('lblMapLockState');
    if (lbl) lbl.textContent = azimuteMapLocked ? 'Mapa Travado' : 'Mapa Livre';
    if (typeof showToast === 'function') showToast(azimuteMapLocked ? 'Mapa travado.' : 'Mapa liberado.');
};

window.runOrbeRadarSweep = function() {
    initAzimuteTacticalMap();
    if (!azimuteMapInstance) return;
    const center = azimuteMapInstance.getCenter();
    if (window._azimuteOrbeCircle) azimuteMapInstance.removeLayer(window._azimuteOrbeCircle);
    window._azimuteOrbeCircle = L.circle([center.lat, center.lng], {
        radius: 350,
        color: '#C5A869',
        fillColor: '#C5A869',
        fillOpacity: 0.14,
        weight: 2
    }).addTo(azimuteMapInstance);
    if (typeof showToast === 'function') showToast('ORBE: varredura radial de 350m ativa.');
};

window.analyzeEspectroElevation = function() {
    const out = document.getElementById('espectroElevationReadout');
    const c = azimuteMapInstance ? azimuteMapInstance.getCenter() : { lat: azimuteLastGeoLat || -19.9162, lon: azimuteLastGeoLon || -44.0809 };
    const altBase = document.getElementById('detAltitude')?.textContent || '850m';
    if (out) {
        out.textContent = `ESPECTRO • Centro ${c.lat.toFixed(5)}, ${c.lon.toFixed(5)} • Cota base: ${altBase}`;
    }
    if (typeof showToast === 'function') showToast('ESPECTRO: perfil de elevacao atualizado.');
};

window.addTacticalPin = function(labelText, toolType = 'pin') {
    initAzimuteTacticalMap();
    if (!azimuteMapInstance) return;
    azimuteUndoStack.push([...azimuteTacticalPins]);
    azimuteRedoStack = [];

    const c = azimuteMapInstance.getCenter();
    const title = (labelText || document.getElementById('tacticalPinLabelInput')?.value || 'Ponto Tatico').trim();
    const cor = sanitizeTeamColor(azimuteTeamState.color);
    const marker = L.circleMarker([c.lat, c.lng], {
        radius: 8,
        color: cor,
        fillColor: cor,
        fillOpacity: 0.85,
        weight: 2
    }).addTo(azimuteMapInstance).bindPopup(`<strong>${escapeHtmlSafe(title)}</strong><br><span>${escapeHtmlSafe(toolType.toUpperCase())}</span>`);

    azimuteTacticalPins.push({ id: 'pin_' + Date.now(), title, toolType, lat: c.lat, lon: c.lng, marker });
    if (typeof showToast === 'function') showToast('Marcador adicionado: ' + title);
};

window.undoTacticalAction = function() {
    if (!azimuteUndoStack.length) return;
    azimuteRedoStack.push([...azimuteTacticalPins]);
    azimuteTacticalPins.forEach(p => { if (p.marker && azimuteMapInstance) azimuteMapInstance.removeLayer(p.marker); });
    const prev = azimuteUndoStack.pop();
    azimuteTacticalPins = [];
    prev.forEach(p => {
        if (azimuteMapInstance) {
            const m = L.circleMarker([p.lat, p.lon], { radius: 8, color: sanitizeTeamColor(azimuteTeamState.color), fillOpacity: 0.85 }).addTo(azimuteMapInstance);
            azimuteTacticalPins.push({ ...p, marker: m });
        }
    });
    if (typeof showToast === 'function') showToast('Acao desfeita.');
};

window.redoTacticalAction = function() {
    if (!azimuteRedoStack.length) return;
    azimuteUndoStack.push([...azimuteTacticalPins]);
    azimuteTacticalPins.forEach(p => { if (p.marker && azimuteMapInstance) azimuteMapInstance.removeLayer(p.marker); });
    const next = azimuteRedoStack.pop();
    azimuteTacticalPins = [];
    next.forEach(p => {
        if (azimuteMapInstance) {
            const m = L.circleMarker([p.lat, p.lon], { radius: 8, color: sanitizeTeamColor(azimuteTeamState.color), fillOpacity: 0.85 }).addTo(azimuteMapInstance);
            azimuteTacticalPins.push({ ...p, marker: m });
        }
    });
    if (typeof showToast === 'function') showToast('Acao refeita.');
};

function renderGhostMarkerOnMap() {
    if (!azimuteMapInstance || !azimuteTeamState.ghostPin) return;
    if (window._azimuteGhostLayer) azimuteMapInstance.removeLayer(window._azimuteGhostLayer);
    const g = azimuteTeamState.ghostPin;
    window._azimuteGhostLayer = L.circleMarker([g.lat, g.lon], {
        radius: 9,
        color: sanitizeTeamColor(g.color),
        fillColor: '#0D0D0D',
        fillOpacity: 0.75,
        dashArray: '4,4',
        weight: 2.5
    }).addTo(azimuteMapInstance).bindPopup(escapeHtmlSafe(g.label));
}

/* === [SECAO: CAMERA ORBITAR SOBRE ENDERECO] === */
window.startOrbitCameraOnAddress = async function() {
    initAzimuteTacticalMap();
    if (!azimuteMapInstance) return;

    const addrInput = document.getElementById('orbitAddressInput');
    const rawQuery = (addrInput ? addrInput.value : '').trim();
    let targetLat = azimuteMapInstance.getCenter().lat;
    let targetLon = azimuteMapInstance.getCenter().lng;

    if (rawQuery && navigator.onLine !== false) {
        try {
            const q = encodeURIComponent(rawQuery + ', Minas Gerais, Brasil');
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=${q}`);
            if (res.ok) {
                const arr = await res.json();
                if (Array.isArray(arr) && arr.length > 0) {
                    targetLat = parseFloat(arr[0].lat);
                    targetLon = parseFloat(arr[0].lon);
                }
            }
        } catch (e) {}
    }

    stopOrbitCamera();
    azimuteOrbitCenter = { lat: targetLat, lon: targetLon };
    azimuteOrbitAngleDeg = 0;
    azimuteMapInstance.setView([targetLat, targetLon], 17, { animate: true });

    if (window._azimuteOrbitTargetMarker) {
        azimuteMapInstance.removeLayer(window._azimuteOrbitTargetMarker);
    }
    window._azimuteOrbitTargetMarker = L.circleMarker([targetLat, targetLon], {
        radius: 7,
        color: '#C5A869',
        fillColor: '#C5A869',
        fillOpacity: 0.9,
        weight: 2
    }).addTo(azimuteMapInstance).bindPopup(escapeHtmlSafe(rawQuery || 'Alvo em Orbita')).openPopup();

    const radiusDeg = 0.0011;
    azimuteOrbitTimerId = setInterval(() => {
        if (!azimuteMapInstance || !azimuteOrbitCenter) return;
        azimuteOrbitAngleDeg = (azimuteOrbitAngleDeg + 6) % 360;
        const rad = (azimuteOrbitAngleDeg * Math.PI) / 180;
        const nextLat = azimuteOrbitCenter.lat + Math.sin(rad) * radiusDeg;
        const nextLon = azimuteOrbitCenter.lon + Math.cos(rad) * radiusDeg;
        azimuteMapInstance.panTo([nextLat, nextLon], { animate: true, duration: 0.25 });
    }, 260);

    const statusEl = document.getElementById('orbitCameraStatusLabel');
    if (statusEl) statusEl.textContent = `ORBITANDO: ${rawQuery || (targetLat.toFixed(5) + ', ' + targetLon.toFixed(5))}`;
    if (typeof showToast === 'function') showToast('Camera ORBITAR iniciada.');
};

window.stopOrbitCamera = function() {
    if (azimuteOrbitTimerId) {
        clearInterval(azimuteOrbitTimerId);
        azimuteOrbitTimerId = null;
    }
    const statusEl = document.getElementById('orbitCameraStatusLabel');
    if (statusEl) statusEl.textContent = 'ORBITAR PARADA';
};

document.addEventListener('DOMContentLoaded', () => {
    loadTeamSessionLocal();
    renderTeamMembersList();
    renderTeamMessagesFeed();
    setTimeout(() => {
        if (document.getElementById('azimuteTacticalMapCanvas')) {
            initAzimuteTacticalMap();
        }
    }, 300);
});
