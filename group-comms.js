/* AZIMUTE — js/modules/group-comms.js (Grupo, envio de fotos, Nome: no lugar de QRA, conversor de radio e comunicacao) */
        // ================= FECHADOR AUTOMÁTICO DE CAIXAS (ACORDEÃO GLOBAL) =================
        (function initAzimuteGlobalAutoCloseBoxes() {
            function isAutoCloseBoxesEnabled() {
                try {
                    const raw = localStorage.getItem('azimute_ui_settings_v3');
                    if (!raw) return true;
                    const parsed = JSON.parse(raw);
                    return parsed.autoCloseBoxes !== false;
                } catch (e) {
                    return true;
                }
            }

            const ACCORDION_GROUPS = [
                // 1. Aba Ajustes
                [
                    { box: 'boxAjustesSec-drones', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('drones', false) },
                    { box: 'boxAjustesSec-acesso_rapido', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('acesso_rapido', false) },
                    { box: 'boxAjustesSec-rodape_topo', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('rodape_topo', false) },
                    { box: 'boxAjustesSec-modo_exibicao', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('modo_exibicao', false) },
                    { box: 'boxAjustesSec-mapcache', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('mapcache', false) },
                    { box: 'boxAjustesSec-acordeao_global', close: () => window.toggleAjustesSectionBox && window.toggleAjustesSectionBox('acordeao_global', false) }
                ],
                // 2. Aba Geolocalização
                [
                    { box: 'localWeatherExpandableBody', close: () => window.toggleGeoWeatherBox && window.toggleGeoWeatherBox(false) },
                    { box: 'localConnectivityExpandableBody', close: () => window.toggleGeoConnectivityBox && window.toggleGeoConnectivityBox(false) },
                    { box: 'digitalCompassExpandableBody', close: () => window.toggleDigitalCompassBox && window.toggleDigitalCompassBox(false) },
                    { box: 'offlineMapsGuideContent', close: () => window.toggleOfflineMapsGuideBox && window.toggleOfflineMapsGuideBox(false) },
                    { box: 'gpsClosestHospitalExpandableBody', close: () => window.toggleGpsClosestHospitalBox && window.toggleGpsClosestHospitalBox(false) }
                ],
                // 3. Aba APH / Saúde
                [
                    { box: 'saudeSmartHospitalExpandableBody', close: () => window.toggleSaudeSmartHospitalBox && window.toggleSaudeSmartHospitalBox(false) },
                    { box: 'offlineAphGuideExpandableBody', close: () => window.toggleOfflineAphGuideBox && window.toggleOfflineAphGuideBox(false) },
                    { box: 'aphMarchProtocolExpandableBody', close: () => window.toggleAphMarchProtocolBox && window.toggleAphMarchProtocolBox(false) },
                    { box: 'rcpMetronomeExpandableBody', close: () => window.toggleRcpMetronomeModuleBox && window.toggleRcpMetronomeModuleBox(false) },
                    { box: 'saudeAssistantIaExpandableBody', close: () => window.toggleSaudeAssistantIaBox && window.toggleSaudeAssistantIaBox(false) },
                    { box: 'saudeHospitalNetworkListExpandableBody', close: () => window.toggleSaudeHospitalNetworkListBox && window.toggleSaudeHospitalNetworkListBox(false) }
                ],
                // 4. Aba Drones / RPAS
                [
                    { box: 'rpasFleetSelectorExpandableBody', close: () => window.toggleRpasFleetSelectorBox && window.toggleRpasFleetSelectorBox(false) },
                    { box: 'rpasFlightParamsExpandableBody', close: () => window.toggleRpasFlightParamsBox && window.toggleRpasFlightParamsBox(false) },
                    { box: 'rpasChecklistExpandableBody', close: () => window.toggleRpasChecklistBox && window.toggleRpasChecklistBox(false) },
                    { box: 'rpasPilotMaterialsExpandableBody', close: () => window.toggleRpasPilotMaterialsBox && window.toggleRpasPilotMaterialsBox(false) }
                ],
                // 5. Aba Funções / Apoio
                [
                    { box: 'boxApoioCat-abordagem', close: () => window.toggleApoioCategoryBox && window.toggleApoioCategoryBox('abordagem', false) },
                    { box: 'boxApoioCat-gestao', close: () => window.toggleApoioCategoryBox && window.toggleApoioCategoryBox('gestao', false) },
                    { box: 'boxApoioCat-transito', close: () => window.toggleApoioCategoryBox && window.toggleApoioCategoryBox('transito', false) },
                    { box: 'boxApoioCat-manutencao', close: () => window.toggleApoioCategoryBox && window.toggleApoioCategoryBox('manutencao', false) }
                ],
                // 6. Tela Início (Painéis retráteis)
                [
                    { box: 'quickAccessCustomizerPanel', close: () => typeof toggleQuickAccessCustomizer === 'function' && toggleQuickAccessCustomizer(false) },
                    { box: 'homeNearestSupportToolsPanel', close: () => typeof toggleHomeNearestSupportTools === 'function' && toggleHomeNearestSupportTools(false) }
                ],
                // 7. Estádios (Fluxo de Torcedores)
                [
                    { box: 'box-stag-fluxo-mineirao', close: () => window.toggleStadiumCollapsibleBox && window.toggleStadiumCollapsibleBox('fluxo-mineirao', false) },
                    { box: 'box-stag-fluxo-arenamrv', close: () => window.toggleStadiumCollapsibleBox && window.toggleStadiumCollapsibleBox('fluxo-arenamrv', false) },
                    { box: 'box-stag-fluxo-independencia', close: () => window.toggleStadiumCollapsibleBox && window.toggleStadiumCollapsibleBox('fluxo-independencia', false) }
                ]
            ];

            let isClosingOthers = false;
            const prevOpenState = new Map();

            function syncAccordionGroups() {
                if (isClosingOthers) return;
                const enabled = isAutoCloseBoxesEnabled();

                ACCORDION_GROUPS.forEach(group => {
                    let newlyOpenedItem = null;
                    group.forEach(item => {
                        const el = document.getElementById(item.box);
                        if (!el) return;
                        const isOpenNow = !el.classList.contains('hidden');
                        const wasOpen = prevOpenState.get(item.box) || false;
                        if (isOpenNow && !wasOpen) {
                            newlyOpenedItem = item;
                        }
                        prevOpenState.set(item.box, isOpenNow);
                    });

                    if (enabled && newlyOpenedItem) {
                        isClosingOthers = true;
                        try {
                            group.forEach(item => {
                                if (item.box !== newlyOpenedItem.box) {
                                    const el = document.getElementById(item.box);
                                    if (el && !el.classList.contains('hidden')) {
                                        item.close();
                                        prevOpenState.set(item.box, false);
                                    }
                                }
                            });
                        } finally {
                            isClosingOthers = false;
                        }
                    }
                });
            }

            document.addEventListener('DOMContentLoaded', () => {
                syncAccordionGroups();
                const observer = new MutationObserver(() => {
                    syncAccordionGroups();
                });
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
            });
        })();
        // === MOTOR DE TRADUÇÃO DE GPS PARA QTH (BASE PBH OFFLINE) ===
let BASE_QTH_BH = [];

window.carregarBaseQTH = async function () {
  try {
    const cacheLocal = localStorage.getItem('azimute_base_qth_v1');
    if (cacheLocal) {
      BASE_QTH_BH = JSON.parse(cacheLocal);
    }
    const resp = await fetch('./base_qth_bh.json');
    if (resp.ok) {
      BASE_QTH_BH = await resp.json();
      try {
        localStorage.setItem('azimute_base_qth_v1', JSON.stringify(BASE_QTH_BH));
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Falha ao carregar base QTH:', err);
  }
};

window.obterQTHProximo = function (lat, lng) {
  if (!BASE_QTH_BH.length) return 'Base QTH carregando...';

  let melhorVia = null;
  let distVia = Infinity;
  let melhorMarco = null;
  let distMarco = Infinity;

  for (let i = 0; i < BASE_QTH_BH.length; i++) {
    const item = BASE_QTH_BH[i];
    const dLat = (item.lat - lat) * 111320;
    const dLng = (item.lng - lng) * 104600;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);

    if (item.c === 'VIA') {
      if (dist < distVia) {
        distVia = dist;
        melhorVia = item;
      }
    } else {
      if (dist < distMarco) {
        distMarco = dist;
        melhorMarco = item;
      }
    }
  }

  const partes = [];
  if (melhorVia && distVia <= 150) {
    partes.push(`${melhorVia.n} (~${Math.round(distVia)}m)`);
  }
  if (melhorMarco && distMarco <= 250) {
    const detalhe = melhorMarco.b ? ` - ${melhorMarco.b}` : '';
    partes.push(`Ref.: ${melhorMarco.n}${detalhe} (~${Math.round(distMarco)}m)`);
  }

  return partes.length
    ? partes.join(' | ')
    : `Coordenada isolada (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
};

carregarBaseQTH();
        // === BASE DE BATALHÕES E COMPANHIAS (1º, 22º E 34º BPM) ===
let UNIDADES_1RPM = {};

window.carregarUnidades1RPM = async function () {
  try {
    const cache = localStorage.getItem('azimute_unidades_1rpm_v1');
    if (cache) UNIDADES_1RPM = JSON.parse(cache);

    const resp = await fetch('./unidades_1rpm.json');
    if (resp.ok) {
      UNIDADES_1RPM = await resp.json();
      try {
        localStorage.setItem('azimute_unidades_1rpm_v1', JSON.stringify(UNIDADES_1RPM));
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Falha ao carregar unidades_1rpm.json:', err);
  }
};

window.buscarUnidadePorBairro = function (termo) {
  if (!termo || !Object.keys(UNIDADES_1RPM).length) return [];
  const norm = (s) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const alvo = norm(termo);
  const resultados = [];

  Object.values(UNIDADES_1RPM).forEach((bpm) => {
    (bpm.companhias || []).forEach((cia) => {
      const matchBairro = (cia.bairros || []).some((b) => norm(b).includes(alvo));
      const matchCorredor = (cia.corredores || []).some((c) => norm(c).includes(alvo));
      if (matchBairro || matchCorredor) {
        resultados.push({
          batalhao: bpm.unidade,
          companhia: cia.cia,
          nomeCia: cia.nome,
          sedeCia: cia.sede,
          telefones: cia.telefones,
          deplan: bpm.delegacias_apoio?.[0] || null
        });
      }
    });
  });

  return resultados;
};

carregarUnidades1RPM();

(function () {
  "use strict";
  const Az = window.AzTac || {};
  const tac = Az.tac;
  const onClick = Az.onClick;
  const showToast = Az.showToast;
  const getColorHex = Az.getColorHex;
  const getActiveMap = Az.getActiveMap;
  const broadcastPacket = Az.broadcastPacket;
  const updateHud = Az.updateHud;
  const syncSinglePttMode = Az.syncSinglePttMode;
  let handleIncomingPacket = Az.handleIncomingPacket;
  const playTone = Az.playTone;
  const unlockAudioOutput = Az.unlockAudioOutput;
  const startSelectedPtt = Az.startSelectedPtt;
  const stopSelectedPtt = Az.stopSelectedPtt;
  const isMapTabVisible = Az.isMapTabVisible;
  const cloneTacData = Az.cloneTacData;
  const pushUndoAction = Az.pushUndoAction;
  const refreshLeftControls = Az.refreshLeftControls;
  const renderTerrainTracesOnMaps = Az.renderTerrainTracesOnMaps;
  const calcTraceDistanceMeters = Az.calcTraceDistanceMeters;
  const TERRAIN_TRACE_META = Az.TERRAIN_TRACE_META;
  const calcDistAndBearing = Az.calcDistAndBearing;
  const connectLiveRoom = Az.connectLiveRoom;
  const formatDistance = Az.formatDistance;
  const getEffectiveMyStatus = Az.getEffectiveMyStatus;
  const getRoomOnlineCount = Az.getRoomOnlineCount;
  const isLocalOnlineInRoom = Az.isLocalOnlineInRoom;
  const monitorGps = Az.monitorGps;
  const openMateInspector = Az.openMateInspector;
  const openPinnedComposerModal = Az.openPinnedComposerModal;
  const removeGhostForUid = Az.removeGhostForUid;
  const runEnlaceTest = Az.runEnlaceTest;
  const savePinsToStorage = Az.savePinsToStorage;
  const scanAndCaptureExistingMaps = Az.scanAndCaptureExistingMaps;
  const syncPenDockUi = Az.syncPenDockUi;
  const TEAM_PALETTE = Az.TEAM_PALETTE;

  // ================= MENU DE GRUPO ESTILO WHATSAPP =================
  const waChatHistory = [];

  function applyOperatorColorChoice(cid) {
    const usedColors = new Set(Object.values(tac.teammates).map(function (m) { return m.colorId; }));
    if (usedColors.has(cid) && cid !== tac.myColorId) {
      showToast("Cor já em uso por outro operador da equipe.");
      return;
    }
    const oldHex = getColorHex(tac.myColorId).toUpperCase();
    tac.myColorId = cid;
    localStorage.setItem("az_tac_my_color", cid);
    const pickedHex = getColorHex(cid);
    localStorage.setItem("az_geo_arrow_color", pickedHex);
    (tac.pins || []).forEach(function (p) {
      if (!p || p.isGhost) return;
      const pHex = String(p.colorHex || "").toUpperCase();
      if (!pHex || pHex === oldHex || pHex === "#0F172A" || pHex === "#0D0D0D") {
        p.colorHex = pickedHex;
      }
    });
    if (typeof savePinsToStorage === "function") savePinsToStorage();
    if (typeof window.azimuteApplyMyArrowColor === "function") window.azimuteApplyMyArrowColor(pickedHex);
    if (typeof window.azUpdateSelfStatusBadge === "function") window.azUpdateSelfStatusBadge(getEffectiveMyStatus(), pickedHex);
    if (typeof window.azimuteRefreshTacticalThemeColors === "function") window.azimuteRefreshTacticalThemeColors();
    if (tac.roomCode && tac.myPos) {
      broadcastPacket({ kind: "pos", lat: tac.myPos.lat, lng: tac.myPos.lng, colorId: tac.myColorId, batteryPct: tac.myBatteryPct, status: getEffectiveMyStatus() });
    }
    renderAllTeamColorSwatches();
    if (typeof syncPenDockUi === "function") syncPenDockUi();
    showToast("Sua cor foi alterada para " + (TEAM_PALETTE.find(function (x) { return x.id === cid; }) || { name: cid }).name + ".");
  }

  function renderSwatchesIntoContainer(wrapId, sizePx) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    const usedColors = new Set(Object.values(tac.teammates).map(function (m) { return m.colorId; }));
    wrap.innerHTML = TEAM_PALETTE.map(function (c) {
      const taken = usedColors.has(c.id) && c.id !== tac.myColorId;
      const selected = c.id === tac.myColorId;
      const title = taken ? c.name + " (Em uso por aliado)" : c.name;
      return `<button type="button" data-op-color="${c.id}" ${taken ? "disabled" : ""} title="${title}" style="width:${sizePx}px;height:${sizePx}px;border-radius:50%;background:${c.hex};border:${selected ? "2.5px solid #FFFFFF" : "1.5px solid rgba(255,255,255,0.42)"};box-shadow:${selected ? "0 0 0 2px #C5A869" : "none"};opacity:${taken ? "0.22" : "1"};cursor:${taken ? "not-allowed" : "pointer"};"></button>`;
    }).join("");

    wrap.querySelectorAll("[data-op-color]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        applyOperatorColorChoice(btn.getAttribute("data-op-color"));
      });
    });
  }

  function renderAllTeamColorSwatches() {
    renderSwatchesIntoContainer("azDockColorSwatches", 22);
    renderSwatchesIntoContainer("azCommsColorSwatches", 22);
  }

  function renderWaColorSwatches() {
    renderAllTeamColorSwatches();
  }

  function appendWaChatMessage(msgObj) {
    waChatHistory.push(msgObj);
    if (waChatHistory.length > 80) waChatHistory.shift();
    const box = document.getElementById("azWaChatMessages");
    if (!box) return;

    const isMine = msgObj.uid === tac.myId;
    const hex = getColorHex(msgObj.colorId);
    const timeStr = new Date(msgObj.ts || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const bubble = document.createElement("div");
    bubble.style.cssText = isMine
      ? "align-self:flex-end;max-width:82%;background:#1C1A14;border:1px solid #C5A869;border-radius:12px 12px 2px 12px;padding:7px 10px;font-size:11.5px;"
      : `align-self:flex-start;max-width:82%;background:#161616;border:1px solid ${hex};border-radius:12px 12px 12px 2px;padding:7px 10px;font-size:11.5px;`;

    const coordLink = (typeof msgObj.lat === "number" && typeof msgObj.lng === "number")
      ? `<button type="button" data-focus-lat="${msgObj.lat}" data-focus-lng="${msgObj.lng}" style="margin-top:4px;display:inline-block;background:#0D0D0D;color:#C5A869;border:1px solid #C5A869;border-radius:6px;padding:2px 7px;font-size:9.5px;font-weight:800;cursor:pointer;">VER NO MAPA (${msgObj.lat.toFixed(4)}, ${msgObj.lng.toFixed(4)})</button>`
      : "";

    const photoHtml = msgObj.dataUrl
      ? `<div style="margin-top:4px;"><img src="${msgObj.dataUrl}" alt="Foto" style="max-width:100%;max-height:185px;border-radius:8px;border:1px solid rgba(197,168,105,0.45);display:block;object-fit:cover;" /></div>`
      : "";

    bubble.innerHTML =
      `<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:2px;">` +
        `<strong style="font-size:10.5px;color:${isMine ? "#C5A869" : hex};">Nome: ${isMine ? (tac.myQra || "VOCÊ") : msgObj.qra}</strong>` +
        `<span style="font-size:9.5px;color:#9E9A8F;font-family:monospace;">${timeStr}</span>` +
      `</div>` +
      (msgObj.text ? `<div style="color:#F2F0EA;line-height:1.35;word-break:break-word;">${msgObj.text}</div>` : "") +
      photoHtml +
      coordLink;

    const mapBtn = bubble.querySelector("[data-focus-lat]");
    if (mapBtn) {
      mapBtn.addEventListener("click", function () {
        const lat = parseFloat(mapBtn.getAttribute("data-focus-lat"));
        const lng = parseFloat(mapBtn.getAttribute("data-focus-lng"));
        document.getElementById("azWhatsappGroupModal").style.display = "none";
        syncSinglePttMode();
        const m = getActiveMap();
        if (m) m.flyTo({ center: [lng, lat], zoom: 17, essential: true });
      });
    }

    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  function syncWaGroupHeaderAndMembers() {
    const mates = Object.values(tac.teammates).filter(function (m) {
      return m && !(tac.audioBlockedUids && tac.audioBlockedUids.has(m.uid));
    });
    const totalOnline = getRoomOnlineCount();
    const topBadge = document.getElementById("azTopGroupBadge");
    if (topBadge) topBadge.textContent = tac.roomCode ? `${tac.roomCode} (${totalOnline})` : "GRUPO";

    const waModal = document.getElementById("azWhatsappGroupModal");
    if (!waModal || (!waModal.classList.contains("is-open") && waModal.style.display !== "flex")) return;

    const pill = document.getElementById("azWaOnlinePill");
    const title = document.getElementById("azWaGroupTitle");
    const sub = document.getElementById("azWaGroupSubtitle");
    const chips = document.getElementById("azWaMembersChips");

    if (pill) pill.textContent = `${totalOnline} ONLINE`;
    if (title) title.textContent = tac.roomCode ? `GRUPO • ${tac.roomCode}` : "GRUPO AZIMUTE";
    if (sub) {
      sub.textContent = mates.length > 0
        ? "Online: " + (tac.myQra ? tac.myQra + " (VOCÊ), " : "") + mates.map(function (m) { return m.qra; }).join(", ")
        : (isLocalOnlineInRoom() ? `${tac.myQra || "VOCÊ"} conectado (1 online) — aguardando colegas...` : (tac.roomCode ? "Conectando à sala..." : "Informe seu Nome e código da sala"));
    }
    if (chips) {
      chips.innerHTML = mates.map(function (m) {
        const dStr = tac.myPos ? " • " + formatDistance(calcDistAndBearing(tac.myPos.lat, tac.myPos.lng, m.lat, m.lng).dist) : "";
        return `<button type="button" data-wa-mate="${m.uid}" style="background:#0D0D0D;border:1px solid ${getColorHex(m.colorId)};color:#F2F0EA;border-radius:999px;padding:3px 9px;font-size:9.5px;font-weight:800;white-space:nowrap;cursor:pointer;">${m.qra}${dStr}</button>`;
      }).join("");
      chips.querySelectorAll("[data-wa-mate]").forEach(function (b) {
        b.addEventListener("click", function () {
          const m = tac.teammates[b.getAttribute("data-wa-mate")];
          if (m) {
            document.getElementById("azWhatsappGroupModal").style.display = "none";
            syncSinglePttMode();
            openMateInspector(m);
          }
        });
      });
    }
    renderWaColorSwatches();
  }

  const _origHandleIncoming = handleIncomingPacket;
  handleIncomingPacket = async function (pkt) {
    await _origHandleIncoming(pkt);
    if (pkt && pkt.uid !== tac.myId) {
      if (pkt.kind === "msg" && pkt.text) {
        appendWaChatMessage({ uid: pkt.uid, qra: pkt.qra, colorId: pkt.colorId || "ciano", text: pkt.text, lat: pkt.lat, lng: pkt.lng, ts: pkt.ts });
      } else if (pkt.kind === "photo_msg" && pkt.dataUrl) {
        appendWaChatMessage({ uid: pkt.uid, qra: pkt.qra, colorId: pkt.colorId || "ciano", text: pkt.text || "Foto enviada", dataUrl: pkt.dataUrl, ts: pkt.ts });
      }
      syncWaGroupHeaderAndMembers();
    }
  };

  onClick("azWhatsappGroupOpenBtn", function () {
    const modal = document.getElementById("azWhatsappGroupModal");
    if (!modal) return;
    document.getElementById("azWaQraInput").value = tac.myQra || "";
    document.getElementById("azWaRoomInput").value = tac.roomCode || "PMMG01";
    syncWaGroupHeaderAndMembers();
    modal.classList.add("is-halfscreen");
    const toggleBtn = document.getElementById("azWaToggleFullBtn");
    if (toggleBtn) toggleBtn.textContent = "TELA CHEIA";
    modal.style.display = "flex";
    syncSinglePttMode();
  });

  onClick("azWaToggleFullBtn", function () {
    const modal = document.getElementById("azWhatsappGroupModal");
    if (!modal) return;
    const isHalf = modal.classList.toggle("is-halfscreen");
    this.textContent = isHalf ? "TELA CHEIA" : "MEIA TELA";
  });

  onClick("azCloseWaGroupBtn", function () {
    const modal = document.getElementById("azWhatsappGroupModal");
    if (modal) {
      modal.classList.remove("is-halfscreen");
      modal.style.display = "none";
    }
    syncSinglePttMode();
  });

  // Gaveta de Controles do Mapa Expandido (mesma mecânica ▲/▼ do rodapé)
  onClick("azMapControlsDrawerBtn", function () {
    const col = document.getElementById("azGeoLeftOverlayCol");
    if (!col) return;
    const collapsed = col.classList.toggle("az-controls-collapsed");
    this.textContent = collapsed ? "▼" : "▲";
  });

  // Helper de Press & Hold reutilizável (60fps, sem poluir clique curto)
  function bindAzPressAndHold(el, onHold, onTap) {
    if (!el) return;
    let holdTimer = null;
    let didHold = false;
    const clearT = function () {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    };
    el.addEventListener("pointerdown", function (ev) {
      if (ev.button && ev.button !== 0) return;
      didHold = false;
      clearT();
      holdTimer = setTimeout(function () {
        didHold = true;
        try { onHold(); } catch (_) {}
      }, 450);
    }, { passive: true });
    el.addEventListener("pointerup", clearT, { passive: true });
    el.addEventListener("pointercancel", clearT, { passive: true });
    el.addEventListener("pointerleave", clearT, { passive: true });
    el.addEventListener("click", function (ev) {
      if (didHold) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        didHold = false;
        return;
      }
      if (typeof onTap === "function") onTap.call(this, ev);
    }, true);
  }

  // Camadas: toque curto = Satélite/Comum, Press & Hold = Claro/Escuro
  bindAzPressAndHold(document.getElementById("azSatToggleBtn"), function () {
    if (typeof window.azToggleMapLightDark === "function") window.azToggleMapLightDark();
  });
  bindAzPressAndHold(document.getElementById("azSlimLayersBtn"), function () {
    if (typeof window.azToggleMapLightDark === "function") window.azToggleMapLightDark();
  }, function () {
    const sat = document.getElementById("azSatToggleBtn");
    if (sat) sat.click();
  });

  // Centralizar: Press & Hold abre o ORBE em meia tela sobre o mapa
  bindAzPressAndHold(document.getElementById("azGeoCenterFab"), function () {
    const inc = document.getElementById("azIncursionOverlay");
    if (inc) inc.classList.add("is-halfscreen");
    const tBtn = document.getElementById("azIncToggleFullBtn");
    if (tBtn) tBtn.textContent = "Tela Cheia";
    if (typeof window.azimuteToggleIncursionMode === "function") {
      window.azimuteToggleIncursionMode(true);
    }
  });
  onClick("azIncToggleFullBtn", function () {
    const inc = document.getElementById("azIncursionOverlay");
    if (!inc) return;
    const isHalf = inc.classList.toggle("is-halfscreen");
    this.textContent = isHalf ? "Tela Cheia" : "Meia Tela";
    if (typeof window.azimuteToggleIncursionMode === "function") {
      window.azimuteToggleIncursionMode(true);
    }
  });

  // Atualiza PTT único e HUD imediatamente ao trocar de aba principal
  if (typeof window.showView === "function" && !window.showView._azPttWrapped) {
    const _origShowView = window.showView;
    window.showView = function () {
      const r = _origShowView.apply(this, arguments);
      setTimeout(function () {
        updateHud();
      }, 20);
      return r;
    };
    window.showView._azPttWrapped = true;
  }

  onClick("azWaJoinBtn", function () {
    unlockAudioOutput();
    const qra = (document.getElementById("azWaQraInput").value || "").trim().toUpperCase();
    const room = (document.getElementById("azWaRoomInput").value || "").trim().toUpperCase();
    if (!qra || !room) { showToast("Preencha QRA e Sala."); return; }
    tac.myQra = qra;
    tac.roomCode = room;
    document.getElementById("azMyQraInput").value = qra;
    document.getElementById("azRoomCodeInput").value = room;
    localStorage.setItem("az_tac_my_qra", qra);
    localStorage.setItem("az_tac_room", room);
    connectLiveRoom();
    const myHex = getColorHex(tac.myColorId);
    localStorage.setItem("az_geo_arrow_color", myHex);
    if (typeof window.azimuteApplyMyArrowColor === "function") window.azimuteApplyMyArrowColor(myHex);
    syncWaGroupHeaderAndMembers();
    showToast(`Conectado na sala ${room}`);
  });

  function sendWaGroupText(customText, includeCoords) {
    const inp = document.getElementById("azWaMsgInput");
    const txt = (customText !== undefined ? customText : (inp ? inp.value : "")).trim();
    if (!txt) return;
    if (!tac.roomCode) { showToast("Entre na sala antes de enviar."); return; }
    const payload = { kind: "msg", text: txt, colorId: tac.myColorId };
    if (includeCoords && tac.myPos) {
      payload.lat = tac.myPos.lat;
      payload.lng = tac.myPos.lng;
    }
    broadcastPacket(payload);
    appendWaChatMessage({ uid: tac.myId, qra: tac.myQra || "VOCÊ", colorId: tac.myColorId, text: txt, lat: payload.lat, lng: payload.lng, ts: Date.now() });
    if (inp && customText === undefined) inp.value = "";
  }

  onClick("azWaSendTextBtn", function () { sendWaGroupText(); });
  // Envio leve de fotos no chat de Especializadas (redimensionamento cliente <= 720px para 60fps e baixa memória)
  let _waPendingPhotoDataUrl = null;
  onClick("azWaPhotoBtn", function () {
    const fi = document.getElementById("azWaPhotoInput");
    if (fi) { fi.value = ""; fi.click(); }
  });
  const waPhotoInp = document.getElementById("azWaPhotoInput");
  if (waPhotoInp) {
    waPhotoInp.addEventListener("change", function () {
      const file = waPhotoInp.files && waPhotoInp.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.onload = function () {
          try {
            const maxDim = 720;
            const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
            const cv = document.createElement("canvas");
            cv.width = Math.max(1, Math.round(img.width * scale));
            cv.height = Math.max(1, Math.round(img.height * scale));
            cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
            _waPendingPhotoDataUrl = cv.toDataURL("image/jpeg", 0.72);
            const pvBar = document.getElementById("azWaPhotoPreviewBar");
            const pvImg = document.getElementById("azWaPhotoPreviewImg");
            const pvMeta = document.getElementById("azWaPhotoPreviewMeta");
            if (pvImg) pvImg.src = _waPendingPhotoDataUrl;
            if (pvMeta) pvMeta.textContent = `${file.name} (${cv.width}x${cv.height})`;
            if (pvBar) pvBar.style.display = "flex";
          } catch (_) {}
        };
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }
  onClick("azWaPhotoCancelBtn", function () {
    _waPendingPhotoDataUrl = null;
    const pvBar = document.getElementById("azWaPhotoPreviewBar");
    if (pvBar) pvBar.style.display = "none";
  });
  onClick("azWaPhotoSendBtn", function () {
    if (!_waPendingPhotoDataUrl) return;
    if (!tac.roomCode) { showToast("Entre na sala antes de enviar foto."); return; }
    const cap = (document.getElementById("azWaMsgInput")?.value || "").trim();
    broadcastPacket({ kind: "photo_msg", dataUrl: _waPendingPhotoDataUrl, text: cap || "Registro fotográfico", colorId: tac.myColorId });
    appendWaChatMessage({ uid: tac.myId, qra: tac.myQra || "VOCÊ", colorId: tac.myColorId, text: cap || "Registro fotográfico", dataUrl: _waPendingPhotoDataUrl, ts: Date.now() });
    _waPendingPhotoDataUrl = null;
    const pvBar = document.getElementById("azWaPhotoPreviewBar");
    if (pvBar) pvBar.style.display = "none";
    const mInp = document.getElementById("azWaMsgInput");
    if (mInp) mInp.value = "";
  });
  const waInpEl = document.getElementById("azWaMsgInput");
  if (waInpEl) {
    waInpEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); sendWaGroupText(); }
    });
  }
  document.querySelectorAll("[data-wa-quick]").forEach(function (b) {
    b.addEventListener("click", function () {
      sendWaGroupText(b.getAttribute("data-wa-quick"), false);
    });
  });
  onClick("azWaShareQthBtn", function () {
    if (!tac.myPos) { showToast("Aguardando sinal GPS..."); return; }
    const street = document.getElementById("azHudStreetLine")?.textContent || "Posição atual";
    sendWaGroupText(`QTH ATUAL: ${street}`, true);
  });
  onClick("azWaPttBtn", function (e) {
    e.preventDefault();
    tac.isRecordingPtt ? stopSelectedPtt() : startSelectedPtt();
  });

  // Suporte a botão físico de Volume / Fone P2 para PTT quando não estiver digitando
  document.addEventListener("keydown", function (ev) {
    const tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (ev.key === "AudioVolumeUp" || ev.key === "AudioVolumeDown" || ev.key === "MediaPlayPause") {
      if (tac.roomCode && (isMapTabVisible() || document.getElementById("azWhatsappGroupModal")?.style.display === "flex")) {
        ev.preventDefault();
        if (!tac.isRecordingPtt) startSelectedPtt();
      }
    }
  });
  document.addEventListener("keyup", function (ev) {
    if (ev.key === "AudioVolumeUp" || ev.key === "AudioVolumeDown") {
      if (tac.isRecordingPtt) stopSelectedPtt();
    }
  });

  // Handlers do Modal de Detalhes de Traçado Articulado (Bloco 3)
  onClick("azCloseTraceDetailBtn", function () {
    const m = document.getElementById("azTraceDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingDetailTraceId = null;
  });

  onClick("azSaveTraceMetaBtn", function () {
    const trc = (tac.terrainTraces || []).find(function (t) { return t.id === tac.editingDetailTraceId; });
    if (!trc) return;
    const prevSnap = cloneTacData(trc);
    const meta = TERRAIN_TRACE_META[trc.kind] || TERRAIN_TRACE_META.beco;
    const lblVal = (document.getElementById("azTraceLabelInput")?.value || "").trim() || meta.prefix;
    const notesVal = (document.getElementById("azTraceNotesInput")?.value || "").trim();
    const tags = [];
    document.querySelectorAll("#azTraceTagsWrap .az-trace-tag-chip.is-active").forEach(function (btn) {
      const tg = btn.getAttribute("data-trc-tag");
      if (tg) tags.push(tg);
    });
    trc.label = lblVal;
    trc.notes = notesVal;
    trc.tags = tags;
    trc.distanceM = calcTraceDistanceMeters(trc.coords);
    pushUndoAction({ type: "trace_edit", traceId: trc.id, prev: prevSnap, next: cloneTacData(trc) });
    renderTerrainTracesOnMaps(false);
    refreshLeftControls();
    const m = document.getElementById("azTraceDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingDetailTraceId = null;
    showToast(`${meta.prefix} atualizado (${trc.distanceM} m).`);
  });

  onClick("azEditTraceVerticesBtn", function () {
    const trc = (tac.terrainTraces || []).find(function (t) { return t.id === tac.editingDetailTraceId; });
    if (!trc) return;
    tac.activeTraceId = tac.activeTraceId === trc.id ? null : trc.id;
    const m = document.getElementById("azTraceDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingDetailTraceId = null;
    renderTerrainTracesOnMaps(true);
    if (tac.activeTraceId) {
      showToast("Arraste os vértices brancos ou pontos médios (+) para ajustar curvas. Duplo clique num vértice remove.");
    } else {
      showToast("Edição de vértices concluída.");
    }
  });

  onClick("azDeleteTraceBtn", function () {
    const idx = (tac.terrainTraces || []).findIndex(function (t) { return t.id === tac.editingDetailTraceId; });
    if (idx === -1) return;
    const removed = cloneTacData(tac.terrainTraces[idx]);
    tac.terrainTraces.splice(idx, 1);
    if (tac.activeTraceId === removed.id) tac.activeTraceId = null;
    pushUndoAction({ type: "del_traces", traces: [removed] });
    renderTerrainTracesOnMaps(false);
    refreshLeftControls();
    const m = document.getElementById("azTraceDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingDetailTraceId = null;
    showToast("Traçado removido (use DESFAZER para recuperar).");
  });


  // ==================== HUB COMUNICAÇÃO DA EQUIPE & CANAL DE ÁUDIO ====================
  function removeUidFromAudioChannel(uid, qra) {
    if (!uid) return;
    if (!tac.audioBlockedUids) tac.audioBlockedUids = new Set();
    tac.audioBlockedUids.add(uid);
    if (tac.rtcPeers && tac.rtcPeers[uid]) {
      try { tac.rtcPeers[uid].close(); } catch (_) {}
      delete tac.rtcPeers[uid];
    }
    if (tac.roomCode) broadcastPacket({ kind: "audio_kick", targetUid: uid, kicked: true });
    if (typeof renderTeamCommsModal === "function") renderTeamCommsModal();
    showToast(`${qra || "Operador"} removido do canal de áudio.`);
  }

  function restoreUidToAudioChannel(uid, qra) {
    if (!uid) return;
    if (tac.audioBlockedUids) tac.audioBlockedUids.delete(uid);
    if (tac.roomCode) broadcastPacket({ kind: "audio_kick", targetUid: uid, kicked: false });
    if (typeof renderTeamCommsModal === "function") renderTeamCommsModal();
    showToast(`${qra || "Operador"} readmitido no canal de áudio.`);
  }

  function renderTeamCommsModal() {
    const stEl = document.getElementById("azCommsStatusText");
    const cntEl = document.getElementById("azCommsOnlineCount");
    const qraInp = document.getElementById("azCommsQraInput");
    const rmInp = document.getElementById("azCommsRoomInput");
    const pttSel = document.getElementById("azCommsPttSelect");
    const muteBtn = document.getElementById("azCommsMuteBtn");
    const roster = document.getElementById("azCommsAudioRoster");
    const online = isLocalOnlineInRoom();
    if (stEl) {
      stEl.textContent = online ? `SALA ATIVA: ${tac.roomCode}` : "FORA DE SALA";
      stEl.style.color = online ? "#4ADE80" : "#F59E0B";
    }
    if (cntEl) cntEl.textContent = `${getRoomOnlineCount()} ONLINE`;
    if (qraInp) qraInp.value = tac.myQra || "";
    if (rmInp) rmInp.value = tac.roomCode || "";
    if (pttSel) pttSel.value = tac.pttEngine || "pcm_binary";
    if (muteBtn) {
      muteBtn.textContent = tac.audioMuted ? "ÁUDIO MUDO" : "ÁUDIO ATIVO";
      muteBtn.style.color = tac.audioMuted ? "#EF4444" : "#4ADE80";
    }
    if (roster) {
      const mates = Object.values(tac.teammates || {});
      if (mates.length === 0) {
        roster.innerHTML = `<div style="font-size:9px;color:#9E9A8F;background:#0D0D0D;border:1px solid #28271F;border-radius:7px;padding:8px;text-align:center;">${online ? "Você está na sala (1 online). Aguardando outros operadores." : "Entre em uma sala para gerenciar o canal de áudio da equipe."}</div>`;
      } else {
        roster.innerHTML = mates.map(function (m) {
          const blk = tac.audioBlockedUids && tac.audioBlockedUids.has(m.uid);
          const hex = getColorHex(m.colorId);
          return `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;background:#0D0D0D;border:1px solid ${blk ? "#7F1D1D" : "#28271F"};border-radius:7px;padding:6px 8px;">
            <div style="display:flex;align-items:center;gap:6px;min-width:0;">
              <span style="width:9px;height:9px;border-radius:50%;background:${hex};flex-shrink:0;"></span>
              <div style="min-width:0;">
                <div style="font-size:9.5px;font-weight:900;color:#FFFFFF;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(m.qra || "ALIADO").replace(/</g, "&lt;")}</div>
                <div style="font-size:7.5px;font-weight:800;color:${blk ? "#FCA5A5" : "#4ADE80"};">${blk ? "REMOVIDO DO ÁUDIO" : "NO CANAL DE ÁUDIO"}</div>
              </div>
            </div>
            <button type="button" class="az-atak-tool-btn ${blk ? "is-active" : "is-danger"}" data-comms-audio-uid="${m.uid}" style="height:24px !important;padding:0 7px !important;font-size:8px !important;flex-shrink:0;">${blk ? "READMITIR" : "REMOVER ÁUDIO"}</button>
          </div>`;
        }).join("");
        roster.querySelectorAll("[data-comms-audio-uid]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            const uid = btn.getAttribute("data-comms-audio-uid");
            const m = tac.teammates[uid];
            if (!m) return;
            if (tac.audioBlockedUids && tac.audioBlockedUids.has(uid)) restoreUidToAudioChannel(uid, m.qra);
            else removeUidFromAudioChannel(uid, m.qra);
          });
        });
      }
    }
  }

  function openTeamCommsModal() {
    renderTeamCommsModal();
    document.getElementById("azTeamCommsModal").classList.add("is-open");
  }

  onClick("azCloseTeamCommsBtn", function () {
    document.getElementById("azTeamCommsModal").classList.remove("is-open");
  });
  onClick("azCommsJoinBtn", function () {
    unlockAudioOutput();
    const qra = (document.getElementById("azCommsQraInput")?.value || "").trim().toUpperCase();
    const room = (document.getElementById("azCommsRoomInput")?.value || "").trim().toUpperCase();
    if (!qra || !room) { showToast("Preencha seu QRA e o nome da sala."); return; }
    tac.myQra = qra;
    tac.roomCode = room;
    localStorage.setItem("az_tac_my_qra", qra);
    localStorage.setItem("az_tac_room", room);
    const q1 = document.getElementById("azMyQraInput"); if (q1) q1.value = qra;
    const r1 = document.getElementById("azRoomCodeInput"); if (r1) r1.value = room;
    removeGhostForUid(tac.myId);
    connectLiveRoom();
    renderTeamCommsModal();
  });
  const commsPttSel = document.getElementById("azCommsPttSelect");
  if (commsPttSel) {
    commsPttSel.addEventListener("change", function () {
      tac.pttEngine = this.value;
      localStorage.setItem("az_tac_ptt_engine", tac.pttEngine);
      const dockSel = document.getElementById("azPttEngineSelect");
      if (dockSel) dockSel.value = tac.pttEngine;
      showToast("Motor de áudio atualizado.");
    });
  }
  onClick("azCommsMuteBtn", function () {
    tac.audioMuted = !tac.audioMuted;
    const dockMute = document.getElementById("azMuteAudioBtn");
    if (dockMute) {
      dockMute.textContent = tac.audioMuted ? "ÁUDIO MUDO" : "ÁUDIO ATIVO";
      dockMute.style.color = tac.audioMuted ? "#EF4444" : "#4ADE80";
    }
    renderTeamCommsModal();
  });
  onClick("azCommsEnlaceBtn", function () {
    document.getElementById("azTeamCommsModal").classList.remove("is-open");
    runEnlaceTest();
  });
  onClick("azCommsOpenGroupBtn", function () {
    document.getElementById("azTeamCommsModal").classList.remove("is-open");
    if (typeof syncWaGroupHeaderAndMembers === "function") syncWaGroupHeaderAndMembers();
    document.getElementById("azWhatsappGroupModal").classList.add("is-open");
  });
  onClick("azCommsPinnedPollBtn", function () {
    document.getElementById("azTeamCommsModal").classList.remove("is-open");
    openPinnedComposerModal();
  });
  onClick("azCommsLeaveBtn", function () {
    document.getElementById("azTeamCommsModal").classList.remove("is-open");
    const endBtn = document.getElementById("azEndSessionBtn");
    if (endBtn) endBtn.click();
  });

  const initMyHex = getColorHex(tac.myColorId);
  localStorage.setItem("az_geo_arrow_color", initMyHex);
  if (typeof window.azimuteApplyMyArrowColor === "function") window.azimuteApplyMyArrowColor(initMyHex);
  if (typeof renderAllTeamColorSwatches === "function") renderAllTeamColorSwatches();
  const redeSpan = document.getElementById("statusBarRedeText");
  if (redeSpan && typeof MutationObserver !== "undefined") {
    new MutationObserver(function () { updateHud(); }).observe(redeSpan, { childList: true, characterData: true, subtree: true });
  }
  if (tac.roomCode && tac.myQra) connectLiveRoom();
  scanAndCaptureExistingMaps();
  updateHud();
  monitorGps();
  setInterval(function () {
    if (tac.maps.length === 0) scanAndCaptureExistingMaps();
    updateHud();
    syncWaGroupHeaderAndMembers();
  }, 3500);

  window._azRenderAllTeamColorSwatches = renderAllTeamColorSwatches;
  window._azSyncWaGroupHeaderAndMembers = syncWaGroupHeaderAndMembers;
  window._azOpenTeamCommsModal = openTeamCommsModal;
})();