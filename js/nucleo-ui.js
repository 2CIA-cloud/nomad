/* === [ARQUIVO: js/nucleo-ui.js] === */
/* === [SECAO: ESTADO E CONSTANTES DE UI] === */
const AZIMUTE_UI_SETTINGS_STORAGE_KEY = 'azimute_ui_settings_v3';
const AZIMUTE_QUICK_ACCESS_STORAGE_KEY = 'azimute_quick_access_config_v1';
const AZIMUTE_FOOTER_MIN_ACTIVE = 3;
const AZIMUTE_FOOTER_MAX_ACTIVE = 7;

const AZIMUTE_FOOTER_NAV_CATALOG = [
    { id: 'home', label: 'Inicio', icon: 'home', defaultEnabled: true },
    { id: 'regioes', label: 'Unidades', icon: 'shield', defaultEnabled: true },
    { id: 'gps', label: 'Geolocalizacao', icon: 'locate-fixed', defaultEnabled: true },
    { id: 'saude', label: 'APH', icon: 'cross', defaultEnabled: true },
    { id: 'estadios', label: 'Estadios', icon: 'trophy', defaultEnabled: true },
    { id: 'atalhos', label: 'Funcoes', icon: 'folder', defaultEnabled: true },
    { id: 'configuracoes', label: 'Ajustes', icon: 'settings', defaultEnabled: true }
];

const AZIMUTE_QUICK_ACCESS_CATALOG = [
    { id: 'geolocalizacao', label: 'Geolocalizacao', defaultEnabled: true, type: 'action', onClick: "showView('gps')", iconType: 'lucide', icon: 'locate-fixed' },
    { id: 'reds', label: 'REDS', defaultEnabled: true, type: 'link', href: 'https://api-sso.sids.mg.gov.br/authenticationendpoint/login.do?client_id=kT8uHiArnyXY4UrLHxYwEcaJsIUa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fweb.sids.mg.gov.br%2Freds%2Findex.do&response_type=code&scope=openid&tenantDomain=carbon.super&sessionDataKey=0d7a6245-ae7c-4816-a15e-68d8167dfe8d&relyingParty=kT8uHiArnyXY4UrLHxYwEcaJsIUa&type=oidc&sp=REDS&isSaaSApp=false&authenticators=BasicAuthenticator%3ALOCAL', iconType: 'lucide', icon: 'file-text' },
    { id: 'imei', label: 'Consultar IMEI', defaultEnabled: true, type: 'link', href: 'https://www.consultaaparelhoimpedido.com.br/public-web/home?cid=174624', iconType: 'lucide', icon: 'smartphone' },
    { id: 'aph', label: 'APH', defaultEnabled: true, type: 'action', onClick: "showView('saude')", iconType: 'aph_svg' },
    { id: 'drones', label: 'Drones', defaultEnabled: true, type: 'action', onClick: "showView('rpas')", iconType: 'drone_svg' },
    { id: 'bnmp', label: 'BNMP', defaultEnabled: false, type: 'link', href: 'https://portalbnmp.cnj.jus.br/#/captcha/%2Fpesquisa-peca', iconType: 'lucide', icon: 'scale' },
    { id: 'codigos_q', label: 'Codigos Q', defaultEnabled: false, type: 'action', onClick: "toggleQCodeModal()", iconType: 'lucide', icon: 'radio' },
    { id: 'unidades', label: 'Unidades', defaultEnabled: false, type: 'action', onClick: "showView('regioes')", iconType: 'lucide', icon: 'shield' },
    { id: 'estadios', label: 'Estadios', defaultEnabled: false, type: 'action', onClick: "showView('estadios')", iconType: 'lucide', icon: 'trophy' },
    { id: 'ementario', label: 'Ementario', defaultEnabled: false, type: 'link', href: 'https://ementario.policiamilitar.mg.gov.br/principal', iconType: 'lucide', icon: 'book-open' },
    { id: 'viaturas', label: 'Viaturas', defaultEnabled: false, type: 'action', onClick: "showView('atalhos'); openViaturasManutencaoSubpage();", iconType: 'lucide', icon: 'wrench' },
    { id: 'assistente_reds', label: 'Assistente REDS', defaultEnabled: false, type: 'link', href: 'https://chatgpt.com/g/g-68a72c60b49081918fe5a2dbb207baae-policial-assistente-reds-pmmg', iconType: 'lucide', icon: 'pen-tool' },
    { id: 'sarpas', label: 'SARPAS', defaultEnabled: false, type: 'link', href: 'https://sarpas.decea.mil.br/login?expired=true', iconType: 'lucide', icon: 'plane' },
    { id: 'apoio', label: 'Apoio', defaultEnabled: false, type: 'action', onClick: "showView('atalhos')", iconType: 'lucide', icon: 'folder' }
];

let azimuteCurrentViewId = 'home';
let azimuteCachedSearchIndex = null;
let azimuteSearchDebounceTimer = null;
let currentSearchResults = [];
let compassInfoTipTimer = null;

/* === [SECAO: TOAST E UTILITARIOS DE TEXTO] === */
function showToast(message) {
    const toast = document.getElementById('toast');
    const txt = document.getElementById('toastText');
    if (!toast || !txt) return;
    txt.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(window._azimuteToastTimer);
    window._azimuteToastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2200);
}

function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
    showToast('Copiado para a area de transferencia.');
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
}

function normalizeSearchText(str) {
    return (str || '')
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function escapeHtmlSafe(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}

/* === [SECAO: LOGIN UNIFICADO] === */
window.toggleAzimutePasswordEye = function() {
    const pEl = document.getElementById('loginPass');
    const eyeOpen = document.getElementById('svgEyeOpen');
    const eyeClosed = document.getElementById('svgEyeClosed');
    if (!pEl) return;
    const isPass = pEl.type === 'password';
    pEl.type = isPass ? 'text' : 'password';
    if (eyeOpen) eyeOpen.classList.toggle('hidden', isPass);
    if (eyeClosed) eyeClosed.classList.toggle('hidden', !isPass);
};

window.handleAzimuteLogin = function() {
    const uEl = document.getElementById('loginUser');
    const pEl = document.getElementById('loginPass');
    const remEl = document.getElementById('loginRememberMe');
    const errDiv = document.getElementById('loginErrorMsg');
    const modal = document.getElementById('azimuteLoginModal');

    const u = (uEl ? uEl.value : '').trim().toUpperCase();
    const p = (pEl ? pEl.value : '').trim().toUpperCase();
    const remember = remEl ? remEl.checked : true;

    if ((u === 'BEPE' || u === 'PMMG' || u === 'AZIMUTE') && p === 'COLISEU') {
        try {
            sessionStorage.setItem('azimute_session_auth', 'authenticated');
            if (remember) {
                localStorage.setItem('azimute_auth', 'authenticated');
                localStorage.setItem('azimute_saved_user', u);
                localStorage.setItem('azimute_saved_pass', p);
                localStorage.setItem('azimute_remember', 'true');
                document.cookie = 'azimute_auth=authenticated; max-age=31536000; path=/; SameSite=Lax';
            } else {
                localStorage.removeItem('azimute_auth');
                localStorage.removeItem('azimute_saved_user');
                localStorage.removeItem('azimute_saved_pass');
                localStorage.setItem('azimute_remember', 'false');
                document.cookie = 'azimute_auth=; max-age=0; path=/; SameSite=Lax';
            }
        } catch (e) {}
        if (errDiv) errDiv.classList.add('hidden');
        if (modal) {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
        showToast('Acesso liberado.');
    } else if (errDiv) {
        errDiv.classList.remove('hidden');
        setTimeout(() => errDiv.classList.add('hidden'), 4000);
    }
};

/* === [SECAO: CONFIGURACOES DE UI, RODAPE E ACESSO RAPIDO] === */
function getDefaultFooterButtonsConfig() {
    return AZIMUTE_FOOTER_NAV_CATALOG.map(item => ({ id: item.id, enabled: item.defaultEnabled }));
}

function normalizeFooterButtonsConfig(rawList) {
    const def = getDefaultFooterButtonsConfig();
    if (!Array.isArray(rawList) || rawList.length === 0) return def;
    const validIds = new Set(AZIMUTE_FOOTER_NAV_CATALOG.map(c => c.id));
    const seen = new Set();
    const normalized = [];

    rawList.forEach(entry => {
        if (!entry || !validIds.has(entry.id) || seen.has(entry.id)) return;
        seen.add(entry.id);
        normalized.push({ id: entry.id, enabled: Boolean(entry.enabled) });
    });
    AZIMUTE_FOOTER_NAV_CATALOG.forEach(c => {
        if (!seen.has(c.id)) normalized.push({ id: c.id, enabled: c.defaultEnabled });
    });

    let activeCount = normalized.filter(x => x.enabled).length;
    for (let i = 0; i < normalized.length && activeCount < AZIMUTE_FOOTER_MIN_ACTIVE; i++) {
        if (!normalized[i].enabled) { normalized[i].enabled = true; activeCount++; }
    }
    for (let i = normalized.length - 1; i >= 0 && activeCount > AZIMUTE_FOOTER_MAX_ACTIVE; i--) {
        if (normalized[i].enabled) { normalized[i].enabled = false; activeCount--; }
    }
    return normalized;
}

function getDefaultAzimuteUiSettings() {
    return {
        manualMode: 'app',
        showReloadBtn: true,
        showFullscreenBtn: true,
        showHeaderRede: true,
        showHeaderHospBtn: true,
        showStatusBarQth: true,
        showSearchBox: true,
        showQuickAccessBlock: true,
        showNearestSupportBlock: true,
        homeBlocksOrder: ['search_box', 'quick_access', 'nearest_support'],
        enableRpasAutoFleetRec: true,
        autoCloseBoxes: true,
        footerButtons: getDefaultFooterButtonsConfig()
    };
}

function getAzimuteUiSettings() {
    const def = getDefaultAzimuteUiSettings();
    try {
        const raw = localStorage.getItem(AZIMUTE_UI_SETTINGS_STORAGE_KEY);
        if (!raw) return def;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return def;
        const validBlocks = ['search_box', 'quick_access', 'nearest_support'];
        let order = def.homeBlocksOrder;
        if (Array.isArray(parsed.homeBlocksOrder)) {
            const filtered = parsed.homeBlocksOrder.filter(k => validBlocks.includes(k));
            if (!filtered.includes('search_box')) filtered.unshift('search_box');
            validBlocks.forEach(k => { if (!filtered.includes(k)) filtered.push(k); });
            if (filtered.length === 3) order = filtered;
        }
        return {
            manualMode: ['app', 'grid', 'web'].includes(parsed.manualMode) ? parsed.manualMode : def.manualMode,
            showReloadBtn: parsed.showReloadBtn !== undefined ? Boolean(parsed.showReloadBtn) : def.showReloadBtn,
            showFullscreenBtn: parsed.showFullscreenBtn !== undefined ? Boolean(parsed.showFullscreenBtn) : def.showFullscreenBtn,
            showHeaderRede: parsed.showHeaderRede !== undefined ? Boolean(parsed.showHeaderRede) : def.showHeaderRede,
            showHeaderHospBtn: parsed.showHeaderHospBtn !== undefined ? Boolean(parsed.showHeaderHospBtn) : def.showHeaderHospBtn,
            showStatusBarQth: parsed.showStatusBarQth !== undefined ? Boolean(parsed.showStatusBarQth) : def.showStatusBarQth,
            showSearchBox: parsed.showSearchBox !== undefined ? Boolean(parsed.showSearchBox) : def.showSearchBox,
            showQuickAccessBlock: parsed.showQuickAccessBlock !== undefined ? Boolean(parsed.showQuickAccessBlock) : def.showQuickAccessBlock,
            showNearestSupportBlock: parsed.showNearestSupportBlock !== undefined ? Boolean(parsed.showNearestSupportBlock) : def.showNearestSupportBlock,
            homeBlocksOrder: order,
            enableRpasAutoFleetRec: parsed.enableRpasAutoFleetRec !== undefined ? Boolean(parsed.enableRpasAutoFleetRec) : def.enableRpasAutoFleetRec,
            autoCloseBoxes: parsed.autoCloseBoxes !== undefined ? Boolean(parsed.autoCloseBoxes) : def.autoCloseBoxes,
            footerButtons: normalizeFooterButtonsConfig(parsed.footerButtons)
        };
    } catch (e) {
        return def;
    }
}

function saveAzimuteUiSettingsToStorage(settingsObj) {
    try { localStorage.setItem(AZIMUTE_UI_SETTINGS_STORAGE_KEY, JSON.stringify(settingsObj)); } catch (e) {}
}

function getQuickAccessConfig() {
    const defaultList = AZIMUTE_QUICK_ACCESS_CATALOG.map(item => ({ id: item.id, enabled: item.defaultEnabled }));
    try {
        const raw = localStorage.getItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY);
        if (!raw) return defaultList;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return defaultList;
        const validIds = new Set(AZIMUTE_QUICK_ACCESS_CATALOG.map(c => c.id));
        const seen = new Set();
        const merged = [];
        parsed.forEach(entry => {
            if (entry && validIds.has(entry.id) && !seen.has(entry.id)) {
                seen.add(entry.id);
                merged.push({ id: entry.id, enabled: Boolean(entry.enabled) });
            }
        });
        AZIMUTE_QUICK_ACCESS_CATALOG.forEach(catItem => {
            if (!seen.has(catItem.id)) merged.push({ id: catItem.id, enabled: catItem.defaultEnabled });
        });
        return merged;
    } catch (e) {
        return defaultList;
    }
}

function saveQuickAccessConfig(cfgList) {
    try { localStorage.setItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY, JSON.stringify(cfgList)); } catch (e) {}
}

function getQuickAccessIconHtml(catItem, small = false) {
    const sizeCls = small ? 'w-4 h-4 text-pmmg-gold shrink-0' : 'w-5 h-5 sm:w-6 sm:h-6 text-pmmg-gold mb-1.5 group-hover:scale-105 transition-transform';
    if (catItem.iconType === 'aph_svg') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="${sizeCls}"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/></svg>`;
    }
    if (catItem.iconType === 'drone_svg') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="${sizeCls}"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 9 5.5 5.5"/><path d="M15 9l3.5-3.5"/><path d="M9 15l-3.5 3.5"/><path d="M15 15l3.5 3.5"/><circle cx="4.5" cy="4.5" r="2.5"/><circle cx="19.5" cy="4.5" r="2.5"/><circle cx="4.5" cy="19.5" r="2.5"/><circle cx="19.5" cy="19.5" r="2.5"/></svg>`;
    }
    return `<i data-lucide="${catItem.icon}" stroke-width="1.5" class="${sizeCls}"></i>`;
}

function renderQuickAccessGrid() {
    const gridEl = document.getElementById('homeQuickAccessGrid');
    const gridModeEl = document.getElementById('gridQuickAccessGrid');
    const cfg = getQuickAccessConfig().filter(entry => entry.id !== 'bussola');
    const catalogMap = {};
    AZIMUTE_QUICK_ACCESS_CATALOG.forEach(c => { if (c.id !== 'bussola') catalogMap[c.id] = c; });
    const enabledItems = cfg.filter(entry => entry.enabled && catalogMap[entry.id]).map(entry => catalogMap[entry.id]);

    if (!enabledItems.length) {
        const emptyHtml = `<div class="bg-pmmg-dark border border-pmmg-border rounded-xl p-2.5 text-center text-xs text-gray-400">Nenhum atalho ativo. Toque em <strong class="text-pmmg-khaki cursor-pointer underline" onclick="toggleQuickAccessCustomizer(true)">Personalizar</strong>.</div>`;
        if (gridEl) { gridEl.className = 'grid grid-cols-1 gap-2'; gridEl.innerHTML = emptyHtml; }
        if (gridModeEl) { gridModeEl.className = 'grid grid-cols-1 gap-1.5'; gridModeEl.innerHTML = emptyHtml; }
        return;
    }

    const colCount = Math.min(Math.max(enabledItems.length, 1), 5);
    if (gridEl) {
        gridEl.className = `grid grid-cols-${colCount} gap-2 sm:gap-3`;
        const btnCls = 'aspect-square sm:aspect-auto sm:py-3.5 bg-pmmg-dark hover:bg-pmmg-card border border-pmmg-gold/40 hover:border-pmmg-gold rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all active:scale-95 cursor-pointer group shadow';
        gridEl.innerHTML = enabledItems.map(item => item.type === 'link'
            ? `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="${btnCls}">${getQuickAccessIconHtml(item, false)}<span class="text-[9.5px] sm:text-xs font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full">${item.label}</span></a>`
            : `<button type="button" onclick="${item.onClick}" class="${btnCls}">${getQuickAccessIconHtml(item, false)}<span class="text-[9.5px] sm:text-xs font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full">${item.label}</span></button>`
        ).join('');
    }
    if (gridModeEl) {
        gridModeEl.className = `grid grid-cols-${colCount} gap-1.5`;
        const compactCls = 'py-2 px-1 bg-[#161616] hover:bg-pmmg-cardHover border border-[#C5A869]/40 hover:border-[#C5A869] rounded-lg flex flex-col items-center justify-center text-center transition-all active:scale-95 cursor-pointer group';
        gridModeEl.innerHTML = enabledItems.map(item => item.type === 'link'
            ? `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="${compactCls}">${getQuickAccessIconHtml(item, true)}<span class="text-[9px] font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full mt-1">${item.label}</span></a>`
            : `<button type="button" onclick="${item.onClick}" class="${compactCls}">${getQuickAccessIconHtml(item, true)}<span class="text-[9px] font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full mt-1">${item.label}</span></button>`
        ).join('');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderQuickAccessCustomizerList() {
    const listEl = document.getElementById('quickAccessCustomizerList');
    const ajustesListEl = document.getElementById('ajustesQuickAccessList');
    if (!listEl && !ajustesListEl) return;
    const cfg = getQuickAccessConfig();
    const catalogMap = {};
    AZIMUTE_QUICK_ACCESS_CATALOG.forEach(c => { catalogMap[c.id] = c; });
    const htmlItems = cfg.map((entry, idx) => {
        const item = catalogMap[entry.id];
        if (!item) return '';
        return `
            <div class="flex items-center justify-between gap-2 p-2 rounded-xl border ${entry.enabled ? 'bg-pmmg-black/90 border-pmmg-gold/50' : 'bg-pmmg-black/40 border-pmmg-border opacity-70'}">
                <label class="flex items-center gap-2.5 cursor-pointer select-none min-w-0 flex-1">
                    <input type="checkbox" ${entry.enabled ? 'checked' : ''} onchange="toggleQuickAccessItemEnabled('${item.id}')" class="w-4 h-4 accent-[#C5A869] cursor-pointer shrink-0">
                    <span class="text-[10px] font-mono text-gray-400 w-5 shrink-0">${idx + 1}o</span>
                    ${getQuickAccessIconHtml(item, true)}
                    <span class="text-xs font-bold ${entry.enabled ? 'text-white' : 'text-gray-400'} truncate">${item.label}</span>
                </label>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="moveQuickAccessItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">^</button>
                    <button type="button" onclick="moveQuickAccessItem(${idx}, 1)" ${idx === cfg.length - 1 ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${idx === cfg.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">v</button>
                </div>
            </div>`;
    }).join('');
    if (listEl) listEl.innerHTML = htmlItems;
    if (ajustesListEl) ajustesListEl.innerHTML = htmlItems;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.toggleQuickAccessCustomizer = function(forceState = null) {
    const panel = document.getElementById('quickAccessCustomizerPanel');
    const lbl = document.getElementById('lblQuickAccessCustomizerBtn');
    if (!panel) return;
    const shouldOpen = forceState !== null ? forceState : panel.classList.contains('hidden');
    if (shouldOpen) renderQuickAccessCustomizerList();
    panel.classList.toggle('hidden', !shouldOpen);
    if (lbl) lbl.textContent = shouldOpen ? 'Fechar' : 'Personalizar';
    azimuteCloseSiblingBoxes('quickAccessCustomizerPanel');
};

window.toggleQuickAccessItemEnabled = function(itemId) {
    const cfg = getQuickAccessConfig();
    const target = cfg.find(c => c.id === itemId);
    if (!target) return;
    target.enabled = !target.enabled;
    saveQuickAccessConfig(cfg);
    renderQuickAccessGrid();
    renderQuickAccessCustomizerList();
};

window.moveQuickAccessItem = function(index, delta) {
    const cfg = getQuickAccessConfig();
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= cfg.length) return;
    const tmp = cfg[index];
    cfg[index] = cfg[newIndex];
    cfg[newIndex] = tmp;
    saveQuickAccessConfig(cfg);
    renderQuickAccessGrid();
    renderQuickAccessCustomizerList();
};

window.resetQuickAccessConfig = function() {
    try { localStorage.removeItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY); } catch (e) {}
    renderQuickAccessGrid();
    renderQuickAccessCustomizerList();
    showToast('Acesso Rapido restaurado.');
};

window.renderFooterButtonsCustomizerList = function() {
    const listEl = document.getElementById('ajustesFooterButtonsList');
    if (!listEl) return;
    const s = getAzimuteUiSettings();
    const cfg = normalizeFooterButtonsConfig(s.footerButtons);
    const catalogMap = {};
    AZIMUTE_FOOTER_NAV_CATALOG.forEach(c => { catalogMap[c.id] = c; });
    const activeCount = cfg.filter(x => x.enabled).length;
    const atMinLimit = activeCount <= AZIMUTE_FOOTER_MIN_ACTIVE;
    const atMaxLimit = activeCount >= AZIMUTE_FOOTER_MAX_ACTIVE;
    const badgeEl = document.getElementById('ajustesFooterCountBadge');
    if (badgeEl) badgeEl.textContent = `${activeCount}/${AZIMUTE_FOOTER_MAX_ACTIVE} ativos`;

    listEl.innerHTML = cfg.map((entry, idx) => {
        const item = catalogMap[entry.id];
        if (!item) return '';
        const isDisabled = (entry.enabled && atMinLimit) || (!entry.enabled && atMaxLimit);
        return `
            <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl border ${entry.enabled ? 'bg-pmmg-black/90 border-pmmg-gold/50' : 'bg-pmmg-black/40 border-pmmg-border opacity-70'}">
                <label class="flex items-center gap-2.5 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} select-none min-w-0 flex-1">
                    <input type="checkbox" ${entry.enabled ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} onchange="toggleFooterButtonEnabled('${item.id}')" class="w-4 h-4 accent-[#C5A869] shrink-0">
                    <span class="text-[10px] font-mono text-gray-400 w-5 shrink-0">${idx + 1}o</span>
                    <span class="text-xs font-bold ${entry.enabled ? 'text-white' : 'text-gray-400'} truncate">${item.label}</span>
                </label>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="moveFooterButtonItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">^</button>
                    <button type="button" onclick="moveFooterButtonItem(${idx}, 1)" ${idx === cfg.length - 1 ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${idx === cfg.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">v</button>
                </div>
            </div>`;
    }).join('');
};

window.toggleFooterButtonEnabled = function(btnId) {
    const s = getAzimuteUiSettings();
    const cfg = normalizeFooterButtonsConfig(s.footerButtons);
    const target = cfg.find(x => x.id === btnId);
    if (!target) return;
    const activeCount = cfg.filter(x => x.enabled).length;
    if (target.enabled && activeCount <= AZIMUTE_FOOTER_MIN_ACTIVE) { showToast('Minimo de 3 botoes ativos.'); return; }
    if (!target.enabled && activeCount >= AZIMUTE_FOOTER_MAX_ACTIVE) { showToast('Maximo de 7 botoes ativos.'); return; }
    target.enabled = !target.enabled;
    s.footerButtons = cfg;
    saveAzimuteUiSettingsToStorage(s);
    window.applyAzimuteUiSettings();
    window.renderFooterButtonsCustomizerList();
};

window.moveFooterButtonItem = function(index, direction) {
    const s = getAzimuteUiSettings();
    const cfg = normalizeFooterButtonsConfig(s.footerButtons);
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= cfg.length) return;
    const tmp = cfg[index];
    cfg[index] = cfg[newIdx];
    cfg[newIdx] = tmp;
    s.footerButtons = cfg;
    saveAzimuteUiSettingsToStorage(s);
    window.applyAzimuteUiSettings();
    window.renderFooterButtonsCustomizerList();
};
window.forcarModoAppMobile = function() {
    if (window.innerWidth < 768) {
        try {
            const s = typeof getAzimuteUiSettings === 'function' ? getAzimuteUiSettings() : {};
            s.manualMode = 'app';
            s.pcSidebarOpen = false;
            if (typeof saveAzimuteUiSettingsToStorage === 'function') {
                saveAzimuteUiSettingsToStorage(s);
            }
        } catch (e) {}

        document.body.classList.remove('mode-web', 'pc-sidebar-open', 'pc-sidebar-collapsed');
        document.body.classList.add('mode-app', 'pc-sidebar-closed');

        ['btn-mode-app', 'btn-mode-grid', 'btn-mode-web'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const isApp = id === 'btn-mode-app';
            el.className = isApp
                ? 'px-3 py-1.5 rounded-lg font-extrabold bg-pmmg-dark text-pmmg-khaki border border-pmmg-gold shadow-sm transition-all cursor-pointer'
                : 'px-3 py-1.5 rounded-lg font-semibold text-gray-400 border border-transparent hover:text-gray-200 transition-all cursor-pointer';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.forcarModoAppMobile();
    setTimeout(() => window.forcarModoAppMobile(), 400);
});
window.syncAjustesInputsFromStorage = function() {
    const s = getAzimuteUiSettings();
    const badgeMode = document.getElementById('ajustesCurrentModeBadge');
    if (badgeMode) {
        badgeMode.textContent = 'Modo: ' + (s.manualMode === 'grid' ? 'GRID' : (s.manualMode === 'web' ? 'PC' : 'App'));
    }
    const mapChecks = {
        chkShowReloadBtn: s.showReloadBtn,
        chkShowFullscreenBtn: s.showFullscreenBtn,
        chkShowHeaderRede: s.showHeaderRede,
        chkShowHeaderHospBtn: s.showHeaderHospBtn,
        chkShowStatusBarQth: s.showStatusBarQth,
        chkShowSearchBox: s.showSearchBox,
        chkShowQuickAccessBlock: s.showQuickAccessBlock,
        chkShowNearestSupportBlock: s.showNearestSupportBlock,
        chkEnableRpasAutoFleetRec: s.enableRpasAutoFleetRec,
        chkAutoCloseBoxes: s.autoCloseBoxes !== false
    };
    Object.entries(mapChecks).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(val);
    });
};

window.applyAzimuteUiSettings = function() {
    const s = getAzimuteUiSettings();
    const isHome = azimuteCurrentViewId === 'home';

    const toggleDisp = (id, show) => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? '' : 'none';
    };
    toggleDisp('headerBtnReloadPage', s.showReloadBtn);
    toggleDisp('btnHeaderFullscreen', s.showFullscreenBtn);
    toggleDisp('statusBarBtnRede', s.showHeaderRede);
    toggleDisp('headerRedePipe', s.showHeaderRede);
    toggleDisp('statusBarBtnHosp', s.showHeaderHospBtn);

    const statusBar = document.getElementById('operationalStatusBar');
    if (statusBar) {
        statusBar.classList.toggle('hidden', !(isHome && s.showStatusBarQth));
        statusBar.style.display = (isHome && s.showStatusBarQth) ? '' : 'none';
    }

    const searchBox = document.getElementById('homeSearchBoxContainer');
    const searchSlot = document.getElementById('homeSearchBlockSlot');
    if (searchBox) {
        searchBox.classList.toggle('hidden', !(isHome && s.showSearchBox));
        searchBox.style.display = (isHome && s.showSearchBox) ? '' : 'none';
    }

    const homeView = document.getElementById('view-home');
    const qaSection = document.getElementById('homeQuickAccessSection');
    const nsSection = document.getElementById('homeNearestSupportSection');
    if (qaSection) qaSection.style.display = s.showQuickAccessBlock ? '' : 'none';
    if (nsSection) nsSection.style.display = s.showNearestSupportBlock ? '' : 'none';
    if (searchSlot) {
        searchSlot.style.display = (isHome && s.showSearchBox) ? '' : 'none';
        if (searchBox && searchSlot && searchBox.parentElement !== searchSlot) searchSlot.appendChild(searchBox);
    }

    const blockMap = { search_box: searchSlot, quick_access: qaSection, nearest_support: nsSection };
    if (homeView && Array.isArray(s.homeBlocksOrder)) {
        s.homeBlocksOrder.forEach((key, idx) => {
            const el = blockMap[key];
            if (el) { el.style.order = String(idx + 1); homeView.appendChild(el); }
        });
    }

    const bottomGrid = document.getElementById('mobileBottomNavGrid');
    if (bottomGrid) {
        const footerCfg = normalizeFooterButtonsConfig(s.footerButtons);
        let visibleCount = 0;
        footerCfg.forEach(entry => {
            const btnEl = document.getElementById(`bnav-${entry.id}`);
            if (!btnEl) return;
            bottomGrid.appendChild(btnEl);
            if (entry.enabled) {
                btnEl.classList.remove('hidden');
                btnEl.style.display = 'flex';
                visibleCount++;
            } else {
                btnEl.classList.add('hidden');
                btnEl.style.display = 'none';
            }
        });
        const cols = Math.min(AZIMUTE_FOOTER_MAX_ACTIVE, Math.max(AZIMUTE_FOOTER_MIN_ACTIVE, visibleCount));
        bottomGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    }

    if (typeof window.renderHomeBlocksOrderCustomizerList === 'function') window.renderHomeBlocksOrderCustomizerList();
    window.syncAjustesInputsFromStorage();
};

window.updateAzimuteUiPreferenceFromInputs = function() {
    const s = getAzimuteUiSettings();
    const getChk = (id, fb) => { const el = document.getElementById(id); return el ? Boolean(el.checked) : fb; };
    s.showReloadBtn = getChk('chkShowReloadBtn', s.showReloadBtn);
    s.showFullscreenBtn = getChk('chkShowFullscreenBtn', s.showFullscreenBtn);
    s.showHeaderRede = getChk('chkShowHeaderRede', s.showHeaderRede);
    s.showHeaderHospBtn = getChk('chkShowHeaderHospBtn', s.showHeaderHospBtn);
    s.showStatusBarQth = getChk('chkShowStatusBarQth', s.showStatusBarQth);
    s.showSearchBox = getChk('chkShowSearchBox', s.showSearchBox);
    s.showQuickAccessBlock = getChk('chkShowQuickAccessBlock', s.showQuickAccessBlock);
    s.showNearestSupportBlock = getChk('chkShowNearestSupportBlock', s.showNearestSupportBlock);
    s.enableRpasAutoFleetRec = getChk('chkEnableRpasAutoFleetRec', s.enableRpasAutoFleetRec);
    s.autoCloseBoxes = getChk('chkAutoCloseBoxes', s.autoCloseBoxes !== false);
    saveAzimuteUiSettingsToStorage(s);
    window.applyAzimuteUiSettings();
};

window.moveHomeBlockOrder = function(index, delta) {
    const s = getAzimuteUiSettings();
    const arr = [...s.homeBlocksOrder];
    const target = index + delta;
    if (target < 0 || target >= arr.length) return;
    const tmp = arr[index]; arr[index] = arr[target]; arr[target] = tmp;
    s.homeBlocksOrder = arr;
    saveAzimuteUiSettingsToStorage(s);
    window.applyAzimuteUiSettings();
};

window.toggleHomeBlockVisibilityByKey = function(key) {
    const s = getAzimuteUiSettings();
    if (key === 'search_box') s.showSearchBox = !s.showSearchBox;
    if (key === 'quick_access') s.showQuickAccessBlock = !s.showQuickAccessBlock;
    if (key === 'nearest_support') s.showNearestSupportBlock = !s.showNearestSupportBlock;
    saveAzimuteUiSettingsToStorage(s);
    window.applyAzimuteUiSettings();
};

window.renderHomeBlocksOrderCustomizerList = function() {
    const container = document.getElementById('ajustesHomeBlocksOrderList');
    if (!container) return;
    const s = getAzimuteUiSettings();
    const meta = {
        search_box: { label: 'Barra de Pesquisa', visible: s.showSearchBox },
        quick_access: { label: 'Acesso Rapido', visible: s.showQuickAccessBlock },
        nearest_support: { label: 'Apoio Mais Proximo', visible: s.showNearestSupportBlock }
    };
    container.innerHTML = s.homeBlocksOrder.map((key, idx) => {
        const info = meta[key] || { label: key, visible: true };
        return `
            <div class="bg-pmmg-black/85 p-3 rounded-xl border ${info.visible ? 'border-[#C5A869]/50' : 'border-pmmg-border opacity-70'} flex items-center justify-between gap-2.5">
                <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none">
                    <input type="checkbox" ${info.visible ? 'checked' : ''} onchange="toggleHomeBlockVisibilityByKey('${key}')" class="w-4 h-4 accent-[#C5A869] shrink-0">
                    <strong class="text-xs font-extrabold text-white truncate">${idx + 1}o - ${info.label}</strong>
                </label>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="moveHomeBlockOrder(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} class="p-1.5 rounded-lg bg-[#161616] text-pmmg-khaki border border-pmmg-border text-xs ${idx === 0 ? 'opacity-30' : 'cursor-pointer'}">^</button>
                    <button type="button" onclick="moveHomeBlockOrder(${idx}, 1)" ${idx === s.homeBlocksOrder.length - 1 ? 'disabled' : ''} class="p-1.5 rounded-lg bg-[#161616] text-pmmg-khaki border border-pmmg-border text-xs ${idx === s.homeBlocksOrder.length - 1 ? 'opacity-30' : 'cursor-pointer'}">v</button>
                </div>
            </div>`;
    }).join('');
};

window.saveAllAzimuteSettings = function(notify = true) {
    window.updateAzimuteUiPreferenceFromInputs();
    saveQuickAccessConfig(getQuickAccessConfig());
    renderQuickAccessGrid();
    renderQuickAccessCustomizerList();
    window.renderFooterButtonsCustomizerList();
    window.applyAzimuteUiSettings();
    if (typeof window.renderRpasFleetSelector === 'function') window.renderRpasFleetSelector();
    if (notify) showToast('Ajustes salvos.');
};

window.resetAllAzimuteSettings = function() {
    saveAzimuteUiSettingsToStorage(getDefaultAzimuteUiSettings());
    try { localStorage.removeItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY); } catch (e) {}
    window.setLayoutMode('app', false);
    window.applyAzimuteUiSettings();
    window.renderFooterButtonsCustomizerList();
    renderQuickAccessGrid();
    renderQuickAccessCustomizerList();
    showToast('Padrao restaurado.');
};

/* === [SECAO: MODOS DE EXIBICAO, TELA CHEIA E ACORDEAO LEVE] === */
window.setLayoutMode = function(mode, notify = true) {
    const body = document.body;
    const validMode = ['app', 'grid', 'web'].includes(mode) ? mode : (window.innerWidth < 768 ? 'app' : 'web');
    const inactiveCls = 'px-3 py-1.5 rounded-lg font-semibold text-gray-400 border border-transparent hover:text-gray-200 transition-all cursor-pointer';
    const activeCls = 'px-3 py-1.5 rounded-lg font-extrabold bg-pmmg-dark text-pmmg-khaki border border-pmmg-gold shadow-sm transition-all cursor-pointer';

    body.classList.remove('mode-app', 'mode-grid', 'mode-web');
    ['app', 'grid', 'web'].forEach(m => {
        const b = document.getElementById('btn-mode-' + m);
        if (b) b.className = (m === validMode) ? activeCls : inactiveCls;
    });
    body.classList.add('mode-' + validMode);
    body.classList.remove('pc-sidebar-closed', 'pc-sidebar-collapsed');

    const s = getAzimuteUiSettings();
    s.manualMode = validMode;
    saveAzimuteUiSettingsToStorage(s);

    if (validMode === 'grid') {
        if (typeof syncGridCockpitVisibility === 'function') syncGridCockpitVisibility(azimuteCurrentViewId || 'home');
        renderQuickAccessGrid();
    }
    window.syncAjustesInputsFromStorage();
    if (notify) showToast('Modo ' + validMode.toUpperCase() + ' ativo.');
};
    window.syncAjustesInputsFromStorage();
    if (notify) showToast('Modo ' + mode.toUpperCase() + ' ativo.');
};

function updateAzimuteFullscreenClock() {
    const now = new Date();
    const dEl = document.getElementById('fullscreenDateText');
    const tEl = document.getElementById('fullscreenTimeText');
    if (dEl) dEl.textContent = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    if (tEl) tEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function isAzimuteCurrentlyFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function updateFullscreenButtonsUi() {
    const isFull = isAzimuteCurrentlyFullscreen();
    document.body.classList.toggle('is-fullscreen', isFull);
    updateAzimuteFullscreenClock();
    const iconTop = document.getElementById('iconHeaderFullscreen');
    if (iconTop) iconTop.setAttribute('data-lucide', isFull ? 'minimize' : 'maximize');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.toggleAzimuteFullscreen = function(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const docEl = document.documentElement;
    if (!isAzimuteCurrentlyFullscreen()) {
        if (docEl.requestFullscreen) docEl.requestFullscreen().then(updateFullscreenButtonsUi).catch(() => {});
        else if (docEl.webkitRequestFullscreen) { docEl.webkitRequestFullscreen(); setTimeout(updateFullscreenButtonsUi, 100); }
    } else {
        if (document.exitFullscreen) document.exitFullscreen().then(updateFullscreenButtonsUi).catch(() => {});
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); setTimeout(updateFullscreenButtonsUi, 100); }
    }
};

const AZIMUTE_ACCORDION_GROUPS = [
    ['boxAjustesSec-drones', 'boxAjustesSec-acesso_rapido', 'boxAjustesSec-rodape_topo', 'boxAjustesSec-modo_exibicao', 'boxAjustesSec-acordeao_global'],
    ['localWeatherExpandableBody', 'localConnectivityExpandableBody', 'digitalCompassExpandableBody', 'offlineMapsGuideContent', 'gpsClosestHospitalExpandableBody'],
    ['saudeSmartHospitalExpandableBody', 'offlineAphGuideExpandableBody', 'aphMarchProtocolExpandableBody', 'rcpMetronomeModuleExpandableBody', 'saudeAssistantIaExpandableBody'],
    ['rpasFleetSelectorExpandableBody', 'rpasFlightParamsExpandableBody', 'rpasChecklistExpandableBody', 'rpasPilotMaterialsExpandableBody'],
    ['boxApoioCat-abordagem', 'boxApoioCat-registro', 'boxApoioCat-gestao', 'boxApoioCat-viaturas'],
    ['quickAccessCustomizerPanel', 'homeNearestSupportToolsPanel'],
    ['box-stag-fluxo-mineirao', 'box-stag-fluxo-arenamrv', 'box-stag-fluxo-independencia']
];

function azimuteCloseSiblingBoxes(openedBoxId) {
    const s = getAzimuteUiSettings();
    if (s.autoCloseBoxes === false) return;
    AZIMUTE_ACCORDION_GROUPS.forEach(group => {
        if (!group.includes(openedBoxId)) return;
        group.forEach(id => {
            if (id === openedBoxId) return;
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) el.classList.add('hidden');
        });
    });
}

function toggleGenericBox(boxId, lblId, icoId, forceOpen = null) {
    const box = document.getElementById(boxId);
    if (!box) return;
    const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
    box.classList.toggle('hidden', !willOpen);
    const lbl = lblId ? document.getElementById(lblId) : null;
    const ico = icoId ? document.getElementById(icoId) : null;
    if (lbl) lbl.textContent = willOpen ? 'Fechar' : 'Abrir';
    if (ico) ico.style.transform = willOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    if (willOpen) azimuteCloseSiblingBoxes(boxId);
}

window.toggleAjustesSectionBox = (secKey, forceOpen = null) => toggleGenericBox(`boxAjustesSec-${secKey}`, `lblAjustesSec-${secKey}`, `icoAjustesSec-${secKey}`, forceOpen);
window.closeAllAjustesSectionBoxes = () => ['drones', 'acesso_rapido', 'rodape_topo', 'modo_exibicao', 'acordeao_global'].forEach(k => window.toggleAjustesSectionBox(k, false));
window.toggleApoioCategoryBox = (catKey, forceOpen = null) => toggleGenericBox(`boxApoioCat-${catKey}`, `lblApoioCat-${catKey}`, `icoApoioCat-${catKey}`, forceOpen);
window.toggleApoioQcodeInnerBox = (forceOpen = null) => toggleGenericBox('boxApoioQcodeInner', 'lblApoioQcodeInner', 'icoApoioQcodeInner', forceOpen);
window.toggleGpsClosestHospitalBox = (forceOpen = null) => toggleGenericBox('gpsClosestHospitalExpandableBody', 'lblGpsClosestHospitalToggle', 'iconGpsClosestHospitalChevron', forceOpen);
window.toggleOfflineMapsGuideBox = (forceOpen = null) => toggleGenericBox('offlineMapsGuideContent', 'lblOfflineMapsToggle', 'iconOfflineMapsChevron', forceOpen);
window.toggleDigitalCompassBox = (forceOpen = null) => toggleGenericBox('digitalCompassExpandableBody', 'lblDigitalCompassToggle', 'iconDigitalCompassChevron', forceOpen);
window.toggleStadiumCollapsibleBox = (boxKey, forceOpen = null) => toggleGenericBox(`box-stag-fluxo-${boxKey}`, `lbl-stag-fluxo-${boxKey}`, `ico-stag-fluxo-${boxKey}`, forceOpen);
window.toggleQCodeModal = () => { const m = document.getElementById('qcodeModal'); if (m) m.classList.toggle('hidden'); };

window.showCompassHorizontalInfoTip = function(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const tipEl = document.getElementById('compassHorizontalInfoToast');
    if (!tipEl) return;
    tipEl.classList.remove('hidden');
    clearTimeout(compassInfoTipTimer);
    compassInfoTipTimer = setTimeout(() => tipEl.classList.add('hidden'), 5000);
};

/* === [SECAO: NAVEGACAO ENTRE TELAS E SIDEBAR PC] === */
function syncGridCockpitVisibility(viewId) {
    const gridCockpit = document.getElementById('gridModeTacticalCockpit');
    if (!gridCockpit) return;
    const active = viewId === 'home';
    gridCockpit.classList.toggle('grid-cockpit-active', active);
    gridCockpit.classList.toggle('hidden', !active);
    gridCockpit.style.display = active ? '' : 'none';
}

function showView(viewId) {
    if (viewId === 'unidades') viewId = 'regioes';
    azimuteCurrentViewId = viewId;
    syncGridCockpitVisibility(viewId);

    const mainTopHdr = document.getElementById('mainTopHeader');
    const topStatusBar = document.getElementById('operationalStatusBar');
    const searchContainer = document.getElementById('homeSearchBoxContainer');
    document.body.classList.toggle('has-home-header', viewId === 'home');

    if (viewId === 'home') {
        if (mainTopHdr) { mainTopHdr.classList.remove('hidden'); mainTopHdr.style.display = ''; }
        window.applyAzimuteUiSettings();
    } else {
        [mainTopHdr, topStatusBar, searchContainer].forEach(el => {
            if (el) { el.classList.add('hidden'); el.style.display = 'none'; }
        });
    }

    const views = ['home', 'regioes', 'rpm1', 'rpm2', 'rpm3', 'especializadas', 'estadios', 'rpas', 'atalhos', 'saude', 'skeleton', '18bpm', 'gps', 'configuracoes'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (!el) return;
        const isTarget = v === viewId;
        el.classList.toggle('hidden', !isTarget);
        el.classList.toggle('azimute-active-view', isTarget);
        el.classList.remove('app-screen-animate');
        el.style.display = isTarget ? 'block' : 'none';
        if (isTarget) { void el.offsetWidth; el.classList.add('app-screen-animate'); }
    });

    ['geoDetailsCard', 'geoConnectivitySubpage', 'offlineAphProtocolModal', 'viaturasManutencaoSubpage', 'gridQuickWeatherModal'].forEach(id => {
        const m = document.getElementById(id);
        if (m) m.classList.add('hidden');
    });

    const gpsHud = document.getElementById('azimuteLiveGpsHud');
    if (gpsHud) {
        gpsHud.classList.toggle('hidden', viewId !== 'gps');
        if (viewId === 'gps' && typeof window.runRealConnectivityDiagnostic === 'function') {
            window.runRealConnectivityDiagnostic();
        }
    }

    const isRegiaoSub = ['regioes', 'rpm1', 'rpm2', 'rpm3', '18bpm', 'skeleton', 'especializadas'].includes(viewId);
    ['home', 'regioes', 'gps', 'estadios', 'saude', 'atalhos', 'configuracoes'].forEach(id => {
        const bBtn = document.getElementById(`bnav-${id}`);
        if (bBtn) bBtn.classList.toggle('bnav-active', id === viewId || (id === 'regioes' && isRegiaoSub));
    });

    const activeBadge = document.getElementById('activeUnitBadge');
    const activeName = document.getElementById('activeUnitName');
    const labels = {
        '18bpm': '18o BPM (Contagem)',
        saude: 'APH',
        gps: 'Geolocalizacao',
        estadios: 'Estadios',
        rpas: 'Drones / RPAS',
        atalhos: 'Funcoes',
        configuracoes: 'Ajustes'
    };
    if (activeBadge && activeName) {
        if (labels[viewId]) {
            activeBadge.classList.remove('hidden');
            activeName.textContent = labels[viewId];
        } else {
            activeBadge.classList.add('hidden');
        }
    }

    if (viewId === '18bpm' && typeof switch18Tab === 'function') switch18Tab('cias');
    if (viewId === 'estadios' && typeof backToEstadiosLobby === 'function') backToEstadiosLobby();
    if (viewId === 'rpas' && typeof window.renderRpasFleetSelector === 'function') window.renderRpasFleetSelector();
    if (viewId === 'configuracoes') {
        window.syncAjustesInputsFromStorage();
        window.renderFooterButtonsCustomizerList();
        renderQuickAccessCustomizerList();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

window.togglePcSidebarCollapse = function() {
    const body = document.body;
    body.classList.remove('pc-sidebar-closed');
    body.classList.toggle('pc-sidebar-collapsed');
    if (typeof lucide !== 'undefined') lucide.createIcons();
};
window.closePcSidebarCompletely = function() {
    document.body.classList.remove('pc-sidebar-collapsed');
    document.body.classList.add('pc-sidebar-closed');
};
window.openPcSidebarCompletely = function() {
    document.body.classList.remove('pc-sidebar-closed', 'pc-sidebar-collapsed');
};
window.togglePcRegioesAccordion = function(ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const sub = document.getElementById('pcsb-regioes-subfolders');
    if (sub) sub.classList.toggle('hidden');
};
window.handlePcSidebarRegioesClick = function() {
    const sub = document.getElementById('pcsb-regioes-subfolders');
    if (sub) sub.classList.remove('hidden');
    showView('regioes');
};
window.togglePcSubfolderUnits = function(rpmKey, ev) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    const listEl = document.getElementById(`pcsb-units-${rpmKey}`);
    if (listEl) listEl.classList.toggle('hidden');
};

/* === [SECAO: BUSCA RAPIDA INDEXADA] === */
const SMART_SYNONYM_GROUPS = [
    { label: 'Abastecimento', triggers: ['gasolina', 'combustivel', 'diesel', 'posto', 'abastecer', 'frota'], expandTo: ['abastecimento', 'posto', '18 bpm', 'rotam'] },
    { label: 'Drones / RPAS', triggers: ['drone', 'drones', 'rpas', 'mavic', 'dji', 'voo', 'sarpas'], expandTo: ['drone', 'rpas', 'sarpas', 'mavic'] },
    { label: 'Mandados / BNMP', triggers: ['bn', 'bnmp', 'mandado', 'prisao', 'foragido'], expandTo: ['bnmp', 'mandados'] },
    { label: 'IMEI', triggers: ['imei', 'celular', 'aparelho', 'impedido'], expandTo: ['consulta imei', 'impedido'] },
    { label: 'REDS', triggers: ['reds', 'bo', 'boletim', 'ocorrencia', 'sids'], expandTo: ['reds', 'assistente reds', 'diao'] },
    { label: 'Estadios', triggers: ['estadio', 'mineirao', 'cruzeiro', 'arena mrv', 'galo', 'independencia', 'america'], expandTo: ['mineirao', 'arena mrv', 'independencia', 'estadio'] },
    { label: 'Emergencia / Orgaos', triggers: ['cemig', 'copasa', 'bombeiro', '193', 'samu', '192', 'defesa civil', '199', 'transcon', 'hospital', 'upa', 'delegacia'], expandTo: ['cemig', 'copasa', 'cbmmg', 'samu', 'defesa civil', 'transcon', 'hospital', 'upa', 'delegacia'] }
];

function buildSearchIndexOnce() {
    if (azimuteCachedSearchIndex) return azimuteCachedSearchIndex;
    const index = [];

    index.push({ title: 'Unidades (1a RPM, 2a RPM, Especializadas e 3a RPM)', category: 'Unidades', badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40', keywords: 'unidades regioes rpm 1 rpm 2 rpm 3 rpm especializadas batalhoes companhias', snippet: 'Acesso a todas as Unidades, Batalhoes e Companhias.', execute: () => showView('unidades') });
    index.push({ title: 'Aeronaves Remotamente Pilotadas (RPAS / Drones)', category: 'Drones', badgeColor: 'bg-sky-950 text-sky-400 border-sky-500/40', keywords: 'drone drones rpas mavic manual pilotos sarpas voo', snippet: 'Especificacoes, checklist e materiais para pilotos.', execute: () => showView('rpas') });
    index.push({ title: 'Pontos de Abastecimento Oficial (1a e 2a RPM)', category: '18o BPM', badgeColor: 'bg-pmmg-khakiBadge text-pmmg-gold border-pmmg-gold/40', keywords: 'abastecimento gasolina combustivel diesel posto frota 18 bpm 40 bpm rotam', snippet: 'Postos de abastecimento na 2a RPM e 1a RPM.', execute: () => { showView('18bpm'); if (typeof switch18Tab === 'function') switch18Tab('apoio'); } });

    document.querySelectorAll('#view-atalhos a, #view-rpas a').forEach(linkEl => {
        const isRpas = linkEl.closest('#view-rpas') !== null;
        const title = (linkEl.querySelector('h3')?.innerText || linkEl.innerText || '').trim();
        const desc = (linkEl.querySelector('p')?.innerText || '').trim();
        index.push({ title, category: isRpas ? 'Drones / RPAS' : 'Funcoes', badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40', keywords: `${title} ${desc}`, snippet: desc, externalUrl: linkEl.getAttribute('href'), execute: () => showView(isRpas ? 'rpas' : 'atalhos') });
    });

    document.querySelectorAll('#sub18-cias .bg-pmmg-card').forEach(cardEl => {
        const title = (cardEl.querySelector('h3, h4')?.innerText || 'Companhia 18o BPM').trim();
        const fullText = cardEl.innerText.replace(/\s+/g, ' ').trim();
        index.push({ title, category: '18o BPM • Companhias', badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40', keywords: fullText, snippet: fullText.slice(0, 120), execute: () => { showView('18bpm'); if (typeof switch18Tab === 'function') switch18Tab('cias'); } });
    });

    document.querySelectorAll('#sub18-contatos tbody tr').forEach(rowEl => {
        const cells = rowEl.querySelectorAll('td');
        if (cells.length >= 2) {
            const localName = cells[0].innerText.trim();
            const phoneNum = cells[1].innerText.trim();
            index.push({ title: `${localName} — ${phoneNum}`, category: '18o BPM • Contatos', badgeColor: 'bg-pmmg-dark text-gray-300 border-pmmg-border', keywords: `${localName} ${phoneNum} telefone ramal`, snippet: `Telefone: ${phoneNum}`, execute: () => { showView('18bpm'); if (typeof switch18Tab === 'function') switch18Tab('contatos'); } });
        }
    });

    document.querySelectorAll('#view-especializadas .bg-pmmg-card, #view-rpm1 .bg-pmmg-card, #view-rpm2 .bg-pmmg-card').forEach(cardEl => {
        const title = (cardEl.querySelector('h3')?.innerText || '').trim();
        if (!title) return;
        const desc = (cardEl.querySelector('p')?.innerText || '').trim();
        index.push({ title, category: 'Unidades', badgeColor: 'bg-pmmg-dark text-pmmg-khaki border-pmmg-border', keywords: `${title} ${desc} ${cardEl.innerText}`, snippet: desc, execute: () => { if (title.includes('18o BPM')) showView('18bpm'); else showView('regioes'); } });
    });

    ['mineirao', 'arenamrv', 'independencia'].forEach(stId => {
        const names = { mineirao: 'Mineirao', arenamrv: 'Arena MRV', independencia: 'Arena Independencia' };
        index.push({ title: `Estadio: ${names[stId]}`, category: 'Estadios', badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40', keywords: `${names[stId]} estadio portoes setores fluxo`, snippet: 'Fluxo de torcedores, portoes, croqui e fluxo aereo.', execute: () => { showView('estadios'); if (typeof openStadiumScreen === 'function') openStadiumScreen(stId); } });
    });

    azimuteCachedSearchIndex = index;
    return index;
}

function handleGlobalSearch() {
    clearTimeout(azimuteSearchDebounceTimer);
    azimuteSearchDebounceTimer = setTimeout(runGlobalSearchImmediate, 90);
}

function runGlobalSearchImmediate() {
    const inputEl = document.getElementById('globalSearch');
    const dropdown = document.getElementById('globalSearchDropdown');
    const clearBtn = document.getElementById('clearGlobalSearchBtn');
    if (!inputEl || !dropdown) return;

    const rawQuery = inputEl.value.trim();
    const normQuery = normalizeSearchText(rawQuery);
    if (!rawQuery.length) {
        if (clearBtn) clearBtn.classList.add('hidden');
        dropdown.classList.add('hidden');
        return;
    }
    if (clearBtn) clearBtn.classList.remove('hidden');

    if (normQuery.length < 2) {
        dropdown.innerHTML = `<div class="p-3 text-xs text-gray-400">Digite pelo menos 2 caracteres.</div>`;
        dropdown.classList.remove('hidden');
        return;
    }

    const tokens = normQuery.split(/\s+/).filter(Boolean);
    const expanded = [];
    let synLabel = '';
    SMART_SYNONYM_GROUPS.forEach(g => {
        if (g.triggers.some(t => normQuery.includes(normalizeSearchText(t)) || normalizeSearchText(t).startsWith(normQuery))) {
            expanded.push(...g.expandTo.map(normalizeSearchText));
            if (!synLabel) synLabel = g.label;
        }
    });

    const scored = [];
    buildSearchIndexOnce().forEach(item => {
        const nTitle = normalizeSearchText(item.title);
        const nKw = normalizeSearchText(item.keywords);
        let score = 0;
        if (tokens.every(t => nTitle.includes(t) || nKw.includes(t))) {
            score += 50 + (nTitle.startsWith(normQuery) ? 40 : (nTitle.includes(normQuery) ? 20 : 0));
        }
        expanded.forEach(exp => { if (nTitle.includes(exp) || nKw.includes(exp)) score += 25; });
        if (score > 0) scored.push({ item, score });
    });

    scored.sort((a, b) => b.score - a.score);
    currentSearchResults = scored.slice(0, 15);

    if (!currentSearchResults.length) {
        dropdown.innerHTML = `<div class="p-4 text-xs text-gray-300 text-center">Nenhum resultado para "${escapeHtmlSafe(rawQuery)}".</div>`;
    } else {
        const header = `<div class="px-3 py-2 bg-pmmg-black/90 flex items-center justify-between text-[11px] border-b border-pmmg-border"><span class="text-pmmg-khaki font-bold">${currentSearchResults.length} resultado(s)</span>${synLabel ? `<span class="text-[10px] text-pmmg-gold font-bold">${escapeHtmlSafe(synLabel)}</span>` : ''}</div>`;
        dropdown.innerHTML = header + currentSearchResults.map((entry, idx) => `
            <div onclick="triggerSearchResult(${idx})" class="p-3 hover:bg-pmmg-cardHover cursor-pointer flex items-center justify-between gap-2">
                <div class="min-w-0 flex-1">
                    <span class="text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase ${entry.item.badgeColor}">${escapeHtmlSafe(entry.item.category)}</span>
                    <h4 class="text-xs sm:text-sm font-bold text-white truncate mt-1">${escapeHtmlSafe(entry.item.title)}</h4>
                    ${entry.item.snippet ? `<p class="text-[11px] text-gray-400 truncate">${escapeHtmlSafe(entry.item.snippet)}</p>` : ''}
                </div>
                <span class="text-xs font-mono text-pmmg-khaki shrink-0">&gt;</span>
            </div>`).join('');
    }
    dropdown.classList.remove('hidden');
}

function triggerSearchResult(index) {
    const entry = currentSearchResults[index];
    if (!entry) return;
    const dd = document.getElementById('globalSearchDropdown');
    if (dd) dd.classList.add('hidden');
    entry.item.execute();
}

function clearGlobalSearch() {
    const inp = document.getElementById('globalSearch');
    const dd = document.getElementById('globalSearchDropdown');
    const btn = document.getElementById('clearGlobalSearchBtn');
    if (inp) inp.value = '';
    if (dd) dd.classList.add('hidden');
    if (btn) btn.classList.add('hidden');
}

/* === [SECAO: NOTAS, ESTADIOS E INICIALIZACAO] === */
function saveNotepadContent() {
    const text = document.getElementById('notepad18')?.value || '';
    try { localStorage.setItem('pmmg_18bpm_notepad', text); } catch (e) {}
    if (typeof window.syncAllNotesToCloud === 'function') window.syncAllNotesToCloud();
    const st = document.getElementById('saveStatus18');
    if (st) st.textContent = 'Salvo no dispositivo.';
}

function loadNotepadContent() {
    const saved = localStorage.getItem('pmmg_18bpm_notepad');
    const el = document.getElementById('notepad18');
    if (saved && el) el.value = saved;
}

function copyNotepadContent() {
    const text = document.getElementById('notepad18')?.value || '';
    if (text.trim()) copyToClipboard(text);
    else showToast('Rascunho vazio.');
}

function clearNotepadContent() {
    const el = document.getElementById('notepad18');
    if (el) el.value = '';
    try { localStorage.removeItem('pmmg_18bpm_notepad'); } catch (e) {}
    showToast('Rascunho limpo.');
}

function filter18BpmContent() {
    const query = (document.getElementById('internalSearch18')?.value || '').toLowerCase().trim();
    const clearBtn = document.getElementById('clear18SearchBtn');
    const stats = document.getElementById('internal18Stats');
    const statsText = document.getElementById('internal18StatsText');
    if (!query.length) {
        if (clearBtn) clearBtn.classList.add('hidden');
        if (stats) stats.classList.add('hidden');
        document.querySelectorAll('#view-18bpm .bg-pmmg-card').forEach(c => c.classList.remove('hidden'));
        return;
    }
    if (clearBtn) clearBtn.classList.remove('hidden');
    document.querySelectorAll('#view-18bpm .sub18-content').forEach(el => el.classList.remove('hidden'));
    let count = 0;
    document.querySelectorAll('#view-18bpm .bg-pmmg-card').forEach(card => {
        const match = card.innerText.toLowerCase().includes(query);
        card.classList.toggle('hidden', !match);
        if (match) count++;
    });
    if (stats) stats.classList.remove('hidden');
    if (statsText) statsText.textContent = `${count} item(ns)`;
}

window.toggleCiaMoreBairros = function(ciaId) {
    const box = document.getElementById('moreBairros-' + ciaId);
    const btn = document.getElementById('btnMoreBairros-' + ciaId);
    if (!box) return;
    const isHidden = box.classList.contains('hidden');
    box.classList.toggle('hidden', !isHidden);
    box.classList.toggle('flex', isHidden);
    if (btn) btn.textContent = isHidden ? 'Ver menos' : 'Ver mais';
};

window.syncUnitsSearchWithGlobal = function(val, localDropId) {
    const gInp = document.getElementById('globalSearch');
    const gDrop = document.getElementById('globalSearchDropdown');
    const localDrop = document.getElementById(localDropId);
    if (!gInp || !localDrop) return;
    const q = (val || '').trim();
    if (q.length < 2) { localDrop.classList.add('hidden'); localDrop.innerHTML = ''; return; }
    gInp.value = q;
    runGlobalSearchImmediate();
    if (gDrop && !gDrop.classList.contains('hidden')) {
        localDrop.innerHTML = gDrop.innerHTML;
        localDrop.classList.remove('hidden');
        gDrop.classList.add('hidden');
    } else {
        localDrop.classList.add('hidden');
    }
};

window.clearUnitsLocalSearch = function(inputId, localDropId) {
    const inp = document.getElementById(inputId);
    const drop = document.getElementById(localDropId);
    if (inp) inp.value = '';
    if (drop) { drop.classList.add('hidden'); drop.innerHTML = ''; }
};

function openStadiumScreen(stadiumId) {
    const lobby = document.getElementById('estadios-lobby-screen');
    const topbar = document.getElementById('estadios-detail-topbar');
    if (lobby) lobby.classList.add('hidden');
    if (topbar) topbar.classList.remove('hidden');
    document.querySelectorAll('.estadio-panel').forEach(el => { el.classList.add('hidden'); el.classList.remove('app-screen-animate'); });
    const target = document.getElementById(`estadio-content-${stadiumId}`);
    if (target) { target.classList.remove('hidden'); void target.offsetWidth; target.classList.add('app-screen-animate'); }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function backToEstadiosLobby() {
    const lobby = document.getElementById('estadios-lobby-screen');
    const topbar = document.getElementById('estadios-detail-topbar');
    document.querySelectorAll('.estadio-panel').forEach(el => el.classList.add('hidden'));
    if (topbar) topbar.classList.add('hidden');
    if (lobby) lobby.classList.remove('hidden');
}

function switch18Tab(subId) {
    document.querySelectorAll('.sub18-content').forEach(el => el.classList.add('hidden'));
    const targetSub = document.getElementById(`sub18-${subId}`);
    if (targetSub) targetSub.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const uEl = document.getElementById('loginUser');
        const pEl = document.getElementById('loginPass');
        const remEl = document.getElementById('loginRememberMe');
        const savedUser = localStorage.getItem('azimute_saved_user');
        const savedPass = localStorage.getItem('azimute_saved_pass');
        const savedRem = localStorage.getItem('azimute_remember');
        if (savedUser && uEl) uEl.value = savedUser;
        if (savedPass && pEl) pEl.value = savedPass;
        if (savedRem === 'false' && remEl) remEl.checked = false;
        const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('azimute_auth=authenticated'));
        if (localStorage.getItem('azimute_auth') === 'authenticated' || hasCookie || sessionStorage.getItem('azimute_session_auth') === 'authenticated') {
            const modal = document.getElementById('azimuteLoginModal');
            if (modal) { modal.classList.remove('flex'); modal.classList.add('hidden'); modal.style.display = 'none'; }
        }
    } catch (e) {}

    loadNotepadContent();
    renderQuickAccessGrid();
    window.applyAzimuteUiSettings();
    const s = getAzimuteUiSettings();
    window.setLayoutMode(s.manualMode || 'app', false);
    updateFullscreenButtonsUi();
    setInterval(updateAzimuteFullscreenClock, 60000);

    document.addEventListener('click', e => {
        const dd = document.getElementById('globalSearchDropdown');
        const inp = document.getElementById('globalSearch');
        if (dd && inp && !dd.contains(e.target) && e.target !== inp) dd.classList.add('hidden');
    });
    document.addEventListener('fullscreenchange', updateFullscreenButtonsUi);
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
