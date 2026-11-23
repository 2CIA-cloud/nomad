/* === [ARQUIVO: js/dados-e-sw.js] === */
/* === [SECAO: REGISTRO DO SERVICE WORKER] === */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

/* === [SECAO: CARREGAMENTO DAS BASES JSON AZIMUTE] === */
const AZIMUTE_DATA_FILES = [
    'dados.json',
    'base_qth_bh.json',
    'batalhao_22.json',
    'bsc_1bpm.json',
    'deplan_1bpm.json',
    'hospitais_1bpm.json',
    'unidades_1bpm.json'
];

let azimuteLoadedBases = {};

async function loadAzimuteJsonBases() {
    for (const fileName of AZIMUTE_DATA_FILES) {
        try {
            const resp = await fetch(`./${fileName}`, { cache: 'no-store' });
            if (resp.ok) {
                azimuteLoadedBases[fileName] = await resp.json();
            }
        } catch (e) {}
    }
    if (typeof window.registerExternalBasesInSearch === 'function') {
        window.registerExternalBasesInSearch(azimuteLoadedBases);
    }
}

/* === [SECAO: BUSCA DE ENDERECO E NUMERACAO DE RUAS / PORTAS] === */
window.searchStreetAndDoorNumber = async function(rawAddressText) {
    const queryText = (rawAddressText || document.getElementById('streetDoorSearchInput')?.value || '').trim();
    const outBox = document.getElementById('streetDoorSearchResult');
    if (!queryText) {
        if (outBox) outBox.textContent = 'Digite rua e numero para consultar.';
        return null;
    }

    const numMatch = queryText.match(/\b(\d{1,6})\b/);
    const doorNumber = numMatch ? numMatch[1] : 'S/N';

    let localHits = [];
    const normQ = typeof normalizeSearchText === 'function' ? normalizeSearchText(queryText) : queryText.toLowerCase();

    Object.entries(azimuteLoadedBases).forEach(([srcName, payload]) => {
        const textBlob = JSON.stringify(payload || {});
        if (textBlob && normQ.length >= 3) {
            const normBlob = typeof normalizeSearchText === 'function' ? normalizeSearchText(textBlob) : textBlob.toLowerCase();
            if (normBlob.includes(normQ.replace(/\d+/g, '').trim()) || (doorNumber !== 'S/N' && normBlob.includes(doorNumber))) {
                localHits.push(srcName);
            }
        }
    });

    let coords = null;
    let displayAddr = queryText;

    if (navigator.onLine !== false) {
        try {
            const qEnc = encodeURIComponent(`${queryText}, Belo Horizonte, Minas Gerais, Brasil`);
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=br&q=${qEnc}`;
            const r = await fetch(url);
            if (r.ok) {
                const arr = await r.json();
                if (Array.isArray(arr) && arr.length > 0) {
                    coords = { lat: parseFloat(arr[0].lat), lon: parseFloat(arr[0].lon) };
                    displayAddr = arr[0].display_name || queryText;
                }
            }
        } catch (e) {}
    }

    const baseInfo = localHits.length ? `Bases locais: ${localHits.join(', ')}` : 'Bases locais: sem correspondencia direta';
    const coordInfo = coords ? `Lat ${coords.lat.toFixed(6)}, Lon ${coords.lon.toFixed(6)}` : 'Coordenadas offline/indisponiveis';
    const summary = `Logradouro: ${queryText} | Porta/Num: ${doorNumber} | ${coordInfo} | ${baseInfo}`;

    if (outBox) {
        outBox.innerHTML = `<div class="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#C5A869]/40 text-xs text-gray-200 space-y-1">
            <div><strong class="text-pmmg-khaki">Numero / Porta:</strong> ${escapeHtmlSafe ? escapeHtmlSafe(doorNumber) : doorNumber}</div>
            <div><strong class="text-pmmg-khaki">Endereco:</strong> ${escapeHtmlSafe ? escapeHtmlSafe(displayAddr) : displayAddr}</div>
            <div class="font-mono text-[11px] text-gray-400">${escapeHtmlSafe ? escapeHtmlSafe(coordInfo) : coordInfo}</div>
            <div class="text-[11px] text-pmmg-khaki">${escapeHtmlSafe ? escapeHtmlSafe(baseInfo) : baseInfo}</div>
        </div>`;
    }

    if (coords && typeof azimuteMapInstance !== 'undefined' && azimuteMapInstance) {
        azimuteMapInstance.setView([coords.lat, coords.lon], 18, { animate: true });
    }

    return { queryText, doorNumber, coords, localHits };
};

document.addEventListener('DOMContentLoaded', () => {
    loadAzimuteJsonBases();
});
