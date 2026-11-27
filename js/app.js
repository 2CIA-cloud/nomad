/* AZIMUTE — js/app.js (Inicializacao, roteamento entre telas/abas, busca global, clima/CEP e ligacao leve entre modulos) */

        const AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS = [
            {
                id: 'joao23',
                nome: 'Hospital João XXIII',
                selo: 'REFERÊNCIA MÁXIMA • POLITRAUMA & EMERGÊNCIA GRAVE',
                endereco: 'Av. Prof. Alfredo Balena, 400 - Santa Efigênia, Belo Horizonte/MG (Lat: -19.9242, Lng: -43.9317)',
                telefone: '(31) 3239-9200',
                lat: -19.9242,
                lon: -43.9317,
                isMaxReference: true,
                routeUrl: 'https://www.google.com/maps/dir/?api=1&destination=-19.9242,-43.9317&travelmode=driving'
            },
            {
                id: 'hmc',
                nome: 'Hospital Municipal de Contagem (HMC)',
                selo: 'Referência 2ª RPM • Contagem',
                endereco: 'Av. Geraldo Rocha, 3220 - Chácaras Cotia, Contagem/MG',
                telefone: '(31) 3356-6000',
                lat: -19.9322,
                lon: -44.0758
            },
            {
                id: 'odilon',
                nome: 'Hospital Municipal Odilon Behrens',
                selo: 'Referência Urgência & Trauma • Noroeste / BH',
                endereco: 'Rua Formiga, 50 - São Cristóvão, Belo Horizonte/MG',
                telefone: '(31) 3277-6100',
                lat: -19.9048,
                lon: -43.9482
            },
            {
                id: 'risoleta',
                nome: 'Hospital Risoleta Tolentino Neves',
                selo: 'Referência Trauma • Eixo Norte / Venda Nova',
                endereco: 'Rua das Gabirobas, 1 - Vila Clóris, Belo Horizonte/MG',
                telefone: '(31) 3459-3200',
                lat: -19.8195,
                lon: -43.9535
            },
            {
                id: 'jk',
                nome: 'Hospital Júlia Kubitschek',
                selo: 'Referência Urgência • Barreiro / Ibirité',
                endereco: 'Av. Dr. Cristiano Rezende, 2745 - Milionários, Belo Horizonte/MG',
                telefone: '(31) 3389-7800',
                lat: -19.9897,
                lon: -44.0114
            },
            {
                id: 'betim',
                nome: 'Hospital Regional de Betim',
                selo: 'Referência Trauma • Betim (2ª RPM)',
                endereco: 'Av. Edméia Mattos Lazzarotti, 3800 - Jardim Brasília, Betim/MG',
                telefone: '(31) 3539-8100',
                lat: -19.9567,
                lon: -44.1925
            }
        ];

        // ================= PROTOCOLOS APH 100% OFFLINE (6 PROTOCOLOS OBJETIVOS) & ASSISTENTE NOTEBOOKLM =================
        window.toggleSaudeSmartHospitalBox = function(forceOpen = null) {
            const body = document.getElementById('saudeSmartHospitalExpandableBody');
            const lbl = document.getElementById('lblSaudeSmartHospitalToggle');
            const icon = document.getElementById('iconSaudeSmartHospitalChevron');
            if (!body) return;
            const shouldOpen = forceOpen !== null ? forceOpen : body.classList.contains('hidden');
            if (shouldOpen) {
                body.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleSaudeAssistantIaBox = function(forceOpen = null) {
            const body = document.getElementById('saudeAssistantIaExpandableBody');
            const lbl = document.getElementById('lblSaudeAssistantIaToggle');
            const icon = document.getElementById('iconSaudeAssistantIaChevron');
            if (!body) return;
            const shouldOpen = forceOpen !== null ? forceOpen : body.classList.contains('hidden');
            if (shouldOpen) {
                body.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleSaudeHospitalNetworkListBox = function(forceOpen = null) {
            const body = document.getElementById('saudeHospitalNetworkListExpandableBody');
            const lbl = document.getElementById('lblSaudeHospitalNetworkListToggle');
            const icon = document.getElementById('iconSaudeHospitalNetworkListChevron');
            if (!body) return;
            const shouldOpen = forceOpen !== null ? forceOpen : body.classList.contains('hidden');
            if (shouldOpen) {
                body.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleAphMarchProtocolBox = function(forceOpen = null) {
            const box = document.getElementById('aphMarchProtocolExpandableBody');
            const lbl = document.getElementById('lblAphMarchProtocolToggle');
            const ico = document.getElementById('icoAphMarchProtocolChevron');
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (ico) ico.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (ico) ico.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleOfflineAphGuideBox = function(forceOpen = null) {
            const body = document.getElementById('offlineAphGuideExpandableBody');
            const lbl = document.getElementById('lblOfflineAphGuideToggle');
            const icon = document.getElementById('iconOfflineAphGuideChevron');
            if (!body) return;
            const shouldOpen = forceOpen !== null ? forceOpen : body.classList.contains('hidden');
            if (shouldOpen) {
                body.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleRcpMetronomeModuleBox = function(forceOpen = null) {
            const body = document.getElementById('rcpMetronomeExpandableBody');
            const lbl = document.getElementById('lblRcpMetronomeModuleToggle');
            const icon = document.getElementById('iconRcpMetronomeModuleChevron');
            if (!body) return;
            const shouldOpen = forceOpen !== null ? forceOpen : body.classList.contains('hidden');
            if (shouldOpen) {
                body.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                body.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        const AZIMUTE_APH_OFFLINE_PROTOCOLS = {
            hemorragia: {
                badge: 'GUIA DE APH OFFLINE',
                title: '1. Hemorragia / Torniquete',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            },
            vias_aereas: {
                badge: 'GUIA DE APH OFFLINE',
                title: '2. Vias Aéreas',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            },
            queimaduras: {
                badge: 'GUIA DE APH OFFLINE',
                title: '3. Queimaduras',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            },
            rcp: {
                badge: 'GUIA DE APH OFFLINE',
                title: '4. RCP',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            },
            ovace: {
                badge: 'GUIA DE APH OFFLINE',
                title: '5. Desengasgamento (OVACE)',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            },
            parto: {
                badge: 'GUIA DE APH OFFLINE',
                title: '6. Gestantes / Parto de Emergência',
                source: 'Aguardando dados dos arquivos oficiais',
                html: `<div class="bg-pmmg-card p-5 rounded-xl border border-pmmg-border text-xs text-gray-400 text-center font-mono">Estrutura limpa pronta para receber os dados dos arquivos oficiais.</div>`
            }
        };

        window.openOfflineAphProtocol = function(protocolKey) {
            const modal = document.getElementById('offlineAphProtocolModal');
            const badgeEl = document.getElementById('aphModalBadge');
            const titleEl = document.getElementById('aphModalTitle');
            const bodyEl = document.getElementById('aphModalBody');
            const sourceEl = document.getElementById('aphModalSourceFooter');
            const proto = AZIMUTE_APH_OFFLINE_PROTOCOLS[protocolKey];
            if (!modal || !proto) return;

            if (badgeEl) badgeEl.textContent = proto.badge;
            if (titleEl) titleEl.textContent = proto.title;
            if (bodyEl) bodyEl.innerHTML = proto.html;
            if (sourceEl) sourceEl.textContent = proto.source;

            ['hemorragia', 'vias_aereas', 'queimaduras', 'rcp', 'ovace', 'parto'].forEach(k => {
                const pill = document.getElementById('aph-pill-' + k);
                if (!pill) return;
                pill.className = (k === protocolKey)
                    ? 'px-2.5 py-1 rounded-lg font-extrabold border border-pmmg-khaki bg-pmmg-khaki text-pmmg-black shrink-0'
                    : 'px-2.5 py-1 rounded-lg font-bold border border-pmmg-border bg-pmmg-card text-gray-300 hover:text-white shrink-0';
            });

            modal.classList.remove('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.closeOfflineAphProtocol = function() {
            const modal = document.getElementById('offlineAphProtocolModal');
            if (modal) modal.classList.add('hidden');
        };

        const DEFAULT_APH_NOTEBOOKLM_URL = 'https://notebook.google.com/notebook/1a62ae4d-eed3-405b-bfb7-f3cdf3fd961e';

        window.toggleConfigNotebookLmUrl = function() {
            const box = document.getElementById('notebookLmUrlConfigBox');
            const inp = document.getElementById('inputNotebookLmAphUrl');
            if (!box) return;
            box.classList.toggle('hidden');
            if (!box.classList.contains('hidden') && inp) {
                try {
                    inp.value = localStorage.getItem('azimute_notebooklm_aph_url_v2') || DEFAULT_APH_NOTEBOOKLM_URL;
                } catch (e) {}
            }
        };

        window.saveNotebookLmAphUrl = function() {
            const inp = document.getElementById('inputNotebookLmAphUrl');
            const btn = document.getElementById('btnOpenNotebookLmAph');
            const box = document.getElementById('notebookLmUrlConfigBox');
            if (!inp || !btn) return;
            const url = (inp.value || '').trim() || DEFAULT_APH_NOTEBOOKLM_URL;
            btn.href = url;
            try { localStorage.setItem('azimute_notebooklm_aph_url_v2', url); } catch (e) {}
            if (box) box.classList.add('hidden');
            if (typeof showToast === 'function') showToast('Link do Assistente NotebookLM salvo!');
        };

        (function initSavedNotebookLmUrl() {
            try {
                const savedUrl = localStorage.getItem('azimute_notebooklm_aph_url_v2') || DEFAULT_APH_NOTEBOOKLM_URL;
                document.addEventListener('DOMContentLoaded', () => {
                    const btn = document.getElementById('btnOpenNotebookLmAph');
                    if (btn) btn.href = savedUrl;
                });
            } catch (e) {}
        })();


        // ================= SEÇÃO "VIATURAS" NA ABA APOIO (APENAS ASSISTENTE NOTEBOOKLM DE MANUTENÇÃO) =================
        window.openViaturasManutencaoSubpage = function() {
            const modal = document.getElementById('viaturasManutencaoSubpage');
            if (!modal) return;
            modal.classList.remove('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.closeViaturasManutencaoSubpage = function() {
            const modal = document.getElementById('viaturasManutencaoSubpage');
            if (modal) modal.classList.add('hidden');
        };

        window.toggleConfigNotebookLmManutencaoUrl = function() {
            const box = document.getElementById('notebookLmManutencaoUrlConfigBox');
            const inp = document.getElementById('inputNotebookLmManutencaoUrl');
            if (!box) return;
            box.classList.toggle('hidden');
            if (!box.classList.contains('hidden') && inp) {
                try {
                    inp.value = localStorage.getItem('azimute_notebooklm_manutencao_url') || 'https://notebooklm.google.com/';
                } catch (e) {}
            }
        };

        window.saveNotebookLmManutencaoUrl = function() {
            const inp = document.getElementById('inputNotebookLmManutencaoUrl');
            const btn = document.getElementById('btnOpenNotebookLmManutencao');
            const box = document.getElementById('notebookLmManutencaoUrlConfigBox');
            if (!inp || !btn) return;
            const url = (inp.value || '').trim() || 'https://notebooklm.google.com/';
            btn.href = url;
            try { localStorage.setItem('azimute_notebooklm_manutencao_url', url); } catch (e) {}
            if (box) box.classList.add('hidden');
            if (typeof showToast === 'function') showToast('Link do Assistente de Manutenção NotebookLM salvo!');
        };

        (function initChecklistAndViaturasStorage() {
            document.addEventListener('DOMContentLoaded', () => {
                // Restaura estado do Checklist Pré-Voo se salvo
                try {
                    const savedChk = localStorage.getItem('azimute_rpas_preflight_checklist');
                    if (savedChk) {
                        const parsed = JSON.parse(savedChk);
                        AZIMUTE_RPAS_CHECKLIST_IDS.forEach(id => {
                            const el = document.getElementById(id);
                            if (el && parsed[id]) el.checked = true;
                        });
                        window.updateRpasPreflightChecklist();
                    }
                } catch (e) {}

                // Restaura link do NotebookLM de Manutenção se salvo
                try {
                    const savedManutUrl = localStorage.getItem('azimute_notebooklm_manutencao_url');
                    if (savedManutUrl) {
                        const btn = document.getElementById('btnOpenNotebookLmManutencao');
                        if (btn) btn.href = savedManutUrl;
                    }
                } catch (e) {}
            });
        })();


        // ================= FERRAMENTAS E ENDEREÇOS PERSONALIZADOS DO CARD APOIO MAIS PRÓXIMO =================
        const AZIMUTE_SUPPORT_PREFS_KEY = 'azimute_nearest_support_prefs_v1';
        const AZIMUTE_SUPPORT_PLACES_KEY = 'azimute_nearest_support_custom_places_v1';

        function getNearestSupportPrefs() {
            const defaults = { showPolice: true, showHospital: true, showSaved: true, showFuel: true };
            try {
                const raw = localStorage.getItem(AZIMUTE_SUPPORT_PREFS_KEY);
                if (!raw) return defaults;
                const parsed = JSON.parse(raw);
                return {
                    showPolice: parsed.showPolice !== false,
                    showHospital: parsed.showHospital !== false,
                    showSaved: parsed.showSaved !== false,
                    showFuel: parsed.showFuel !== false
                };
            } catch (e) {
                return defaults;
            }
        }

        function applyNearestSupportPrefsToDom() {
            const prefs = getNearestSupportPrefs();
            const cPol = document.getElementById('chkSupportShowPolice');
            const cHosp = document.getElementById('chkSupportShowHospital');
            const cSaved = document.getElementById('chkSupportShowSaved');
            const cFuel = document.getElementById('chkSupportShowFuel');
            if (cPol) cPol.checked = prefs.showPolice;
            if (cHosp) cHosp.checked = prefs.showHospital;
            if (cSaved) cSaved.checked = prefs.showSaved;
            if (cFuel) cFuel.checked = prefs.showFuel;

            const cardPol = document.getElementById('homeSupportPoliceCard');
            const cardHosp = document.getElementById('homeSupportHospitalCard');
            const cardFuel = document.getElementById('homeSupportFuelCard');
            const boxSaved = document.getElementById('homeSupportCustomPlacesContainer');

            if (cardPol) cardPol.classList.toggle('hidden', !prefs.showPolice);
            if (cardHosp) cardHosp.classList.toggle('hidden', !prefs.showHospital);
            if (cardFuel) cardFuel.classList.toggle('hidden', !prefs.showFuel);
            if (boxSaved) boxSaved.classList.toggle('hidden', !prefs.showSaved);
        }

        function saveNearestSupportPrefs() {
            const cPol = document.getElementById('chkSupportShowPolice');
            const cHosp = document.getElementById('chkSupportShowHospital');
            const cSaved = document.getElementById('chkSupportShowSaved');
            const cFuel = document.getElementById('chkSupportShowFuel');
            const prefs = {
                showPolice: cPol ? cPol.checked : true,
                showHospital: cHosp ? cHosp.checked : true,
                showSaved: cSaved ? cSaved.checked : true,
                showFuel: cFuel ? cFuel.checked : true
            };
            try {
                localStorage.setItem(AZIMUTE_SUPPORT_PREFS_KEY, JSON.stringify(prefs));
            } catch (e) {}
            applyNearestSupportPrefsToDom();
        }

        function toggleHomeNearestSupportTools(forceState) {
            const panel = document.getElementById('homeNearestSupportToolsPanel');
            if (!panel) return;
            const willOpen = typeof forceState === 'boolean' ? forceState : panel.classList.contains('hidden');
            panel.classList.toggle('hidden', !willOpen);
            if (willOpen) {
                applyNearestSupportPrefsToDom();
                renderCustomSupportSavedManagerList();
                if (typeof renderRastreamentoCategoriesManagerList === 'function') {
                    renderRastreamentoCategoriesManagerList();
                }
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function getSavedCustomSupportPlaces() {
            try {
                const raw = localStorage.getItem(AZIMUTE_SUPPORT_PLACES_KEY);
                const list = raw ? JSON.parse(raw) : [];
                return Array.isArray(list) ? list : [];
            } catch (e) {
                return [];
            }
        }

        function setSavedCustomSupportPlaces(list) {
            try {
                localStorage.setItem(AZIMUTE_SUPPORT_PLACES_KEY, JSON.stringify(list));
            } catch (e) {}
        }

        function fillCustomSupportPlaceWithCurrentGps() {
            const addrInput = document.getElementById('inputCustomSupportAddr');
            const nameInput = document.getElementById('inputCustomSupportName');
            let lat = azimuteLastGeoLat;
            let lon = azimuteLastGeoLon;
            if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
                try {
                    lat = parseFloat(localStorage.getItem('azimute_last_lat'));
                    lon = parseFloat(localStorage.getItem('azimute_last_lon'));
                } catch (e) {}
            }
            if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
                if (addrInput) addrInput.value = lat.toFixed(6) + ', ' + lon.toFixed(6);
                if (nameInput && !nameInput.value.trim()) nameInput.focus();
                if (typeof showToast === 'function') showToast('Coordenada GPS atual preenchida!');
            } else {
                if (typeof showToast === 'function') showToast('Aguardando sinal GPS para capturar coordenada.');
            }
        }

        async function addCustomSupportPlace() {
            const nameEl = document.getElementById('inputCustomSupportName');
            const addrEl = document.getElementById('inputCustomSupportAddr');
            const btnEl = document.getElementById('btnAddCustomSupportPlace');
            const nome = (nameEl ? nameEl.value : '').trim();
            const rawAddr = (addrEl ? addrEl.value : '').trim();

            if (!nome || !rawAddr) {
                if (typeof showToast === 'function') showToast('Preencha o nome e o endereço/coordenada do local.');
                return;
            }

            if (btnEl) btnEl.disabled = true;

            let lat = null;
            let lon = null;
            let resolvedAddr = rawAddr;

            // 1. Verifica se o militar digitou "Lat, Lon" diretamente
            const coordMatch = rawAddr.match(/^(-?\d{1,2}\.\d+)\s*[,;\s]\s*(-?\d{1,3}\.\d+)$/);
            if (coordMatch) {
                lat = parseFloat(coordMatch[1]);
                lon = parseFloat(coordMatch[2]);
                const qthCurr = document.getElementById('statusBarQth');
                if (qthCurr && qthCurr.textContent && qthCurr.textContent !== '--' && typeof azimuteLastGeoLat === 'number' && Math.abs(azimuteLastGeoLat - lat) < 0.0005) {
                    resolvedAddr = qthCurr.textContent.trim();
                } else {
                    resolvedAddr = 'Coord: ' + lat.toFixed(5) + ', ' + lon.toFixed(5);
                }
            } else if (navigator.onLine !== false) {
                // 2. Geocodifica o endereço digitado na RMBH / Minas Gerais via Nominatim
                try {
                    const q = encodeURIComponent(rawAddr + ', Minas Gerais, Brasil');
                    const res = await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=' + q);
                    if (res.ok) {
                        const arr = await res.json();
                        if (Array.isArray(arr) && arr.length > 0) {
                            lat = parseFloat(arr[0].lat);
                            lon = parseFloat(arr[0].lon);
                        }
                    }
                } catch (e) {}
            }

            // 3. Fallback para GPS atual caso sem internet ou endereço genérico
            if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
                if (typeof azimuteLastGeoLat === 'number' && typeof azimuteLastGeoLon === 'number') {
                    lat = azimuteLastGeoLat;
                    lon = azimuteLastGeoLon;
                } else {
                    try {
                        const cLat = parseFloat(localStorage.getItem('azimute_last_lat'));
                        const cLon = parseFloat(localStorage.getItem('azimute_last_lon'));
                        if (!isNaN(cLat) && !isNaN(cLon)) {
                            lat = cLat;
                            lon = cLon;
                        }
                    } catch (e) {}
                }
            }

            const list = getSavedCustomSupportPlaces();
            list.push({
                id: 'custom_sup_' + Date.now(),
                nome: nome,
                endereco: resolvedAddr,
                lat: lat,
                lon: lon
            });
            setSavedCustomSupportPlaces(list);

            if (nameEl) nameEl.value = '';
            if (addrEl) addrEl.value = '';
            if (btnEl) btnEl.disabled = false;

            renderCustomSupportSavedManagerList();
            renderHomeNearestSupportCustomPlaces(azimuteLastGeoLat, azimuteLastGeoLon);
            if (typeof showToast === 'function') showToast('Endereço "' + nome + '" salvo no Apoio Mais Próximo!');
        }

        function removeCustomSupportPlace(id) {
            const list = getSavedCustomSupportPlaces().filter(item => item.id !== id);
            setSavedCustomSupportPlaces(list);
            renderCustomSupportSavedManagerList();
            renderHomeNearestSupportCustomPlaces(azimuteLastGeoLat, azimuteLastGeoLon);
            if (typeof showToast === 'function') showToast('Endereço removido.');
        }

        function renderCustomSupportSavedManagerList() {
            const container = document.getElementById('customSupportSavedManagerList');
            if (!container) return;
            const list = getSavedCustomSupportPlaces();
            if (!list.length) {
                container.innerHTML = '<p class="text-[11px] text-gray-500 italic">Nenhum endereço personalizado salvo ainda.</p>';
                return;
            }
            container.innerHTML = list.map(item => `
                <div class="bg-pmmg-dark px-2.5 py-1.5 rounded-lg border border-pmmg-border flex items-center justify-between gap-2 text-xs">
                    <div class="min-w-0 flex-1">
                        <strong class="text-pmmg-khaki font-bold block truncate">${escapeHtmlSafe(item.nome)}</strong>
                        <span class="text-[10px] text-gray-400 block truncate">${escapeHtmlSafe(item.endereco)}</span>
                    </div>
                    <button type="button" onclick="removeCustomSupportPlace('${item.id}')" class="p-1.5 rounded bg-pmmg-black hover:bg-red-950 text-gray-400 hover:text-red-400 border border-pmmg-border transition-colors cursor-pointer shrink-0" title="Excluir endereço salvo">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            `).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function escapeHtmlSafe(str) {
            return String(str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
        }

        function renderHomeNearestSupportCustomPlaces(refLat, refLon) {
            const container = document.getElementById('homeSupportCustomPlacesContainer');
            if (!container) return;
            const list = getSavedCustomSupportPlaces();
            if (!list.length) {
                container.innerHTML = '';
                return;
            }

            let lat = typeof refLat === 'number' && !isNaN(refLat) ? refLat : null;
            let lon = typeof refLon === 'number' && !isNaN(refLon) ? refLon : null;
            if (lat === null || lon === null) {
                try {
                    const cLat = parseFloat(localStorage.getItem('azimute_last_lat'));
                    const cLon = parseFloat(localStorage.getItem('azimute_last_lon'));
                    if (!isNaN(cLat) && !isNaN(cLon)) {
                        lat = cLat;
                        lon = cLon;
                    }
                } catch (e) {}
            }

            container.innerHTML = list.map(item => {
                const hasCoords = typeof item.lat === 'number' && typeof item.lon === 'number' && !isNaN(item.lat) && !isNaN(item.lon);
                let distBadge = '-- km';
                if (hasCoords && lat !== null && lon !== null && typeof azimuteCalcDistKm === 'function' && typeof calcEstimatedDriveMinutes === 'function') {
                    const d = azimuteCalcDistKm(lat, lon, item.lat, item.lon);
                    const est = calcEstimatedDriveMinutes(d);
                    distBadge = '~' + est.roadKm + 'km • ~' + est.mins + 'min';
                }
                const routeHref = hasCoords
                    ? 'https://www.google.com/maps/dir/?api=1&destination=' + item.lat + ',' + item.lon + '&travelmode=driving'
                    : 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(item.endereco) + '&travelmode=driving';

                return `
                    <div class="bg-pmmg-dark p-2.5 rounded-xl border border-pmmg-border border-l-4 border-l-sky-400 flex items-center justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-[10px] font-bold uppercase text-sky-400">Ponto Salvo</span>
                                <span class="text-[10px] font-mono font-extrabold bg-pmmg-card text-pmmg-gold px-1.5 py-0.5 rounded border border-pmmg-gold/40 shrink-0">${distBadge}</span>
                            </div>
                            <strong class="text-xs sm:text-sm font-extrabold text-white block truncate mt-0.5">${escapeHtmlSafe(item.nome)}</strong>
                            <span class="text-[10px] text-gray-400 block truncate">${escapeHtmlSafe(item.endereco)}</span>
                        </div>
                        <a href="${routeHref}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-2 bg-pmmg-dark hover:bg-pmmg-border text-sky-300 border border-sky-500/50 font-extrabold rounded-lg text-[11px] flex items-center gap-1 shrink-0 shadow transition-all active:scale-95" title="Traçar rota para ${escapeHtmlSafe(item.nome)}">
                            <i data-lucide="navigation" class="w-3.5 h-3.5"></i> <span>Rota</span>
                        </a>
                    </div>
                `;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }


        // ================= FUNÇÃO "RASTREAMENTO" CONTÍNUO POR GPS (OVERPASS API / OSM) =================
        const AZIMUTE_RASTREAMENTO_STORAGE_KEY = 'azimute_gps_rastreamento_categories_v1';
        const AZIMUTE_RASTREAMENTO_CACHE_KEY = 'azimute_gps_rastreamento_cache_v1';

        let azimuteRastreamentoLastFetchLat = null;
        let azimuteRastreamentoLastFetchLon = null;
        let azimuteRastreamentoLastFetchTs = 0;
        let azimuteRastreamentoLastSignature = '';
        let azimuteRastreamentoInFlight = false;
        let azimuteRastreamentoResultsMap = {};

        try {
            const cachedRas = localStorage.getItem(AZIMUTE_RASTREAMENTO_CACHE_KEY);
            if (cachedRas) {
                const parsedCache = JSON.parse(cachedRas);
                if (parsedCache && typeof parsedCache === 'object') {
                    azimuteRastreamentoResultsMap = parsedCache;
                }
            }
        } catch (e) {}

        function getRastreamentoCategories() {
            try {
                const raw = localStorage.getItem(AZIMUTE_RASTREAMENTO_STORAGE_KEY);
                const list = raw ? JSON.parse(raw) : [];
                if (!Array.isArray(list)) return [];
                return list.map(item => ({
                    id: String(item.id || ('ras_' + Math.random().toString(36).slice(2, 9))),
                    term: String(item.term || '').trim(),
                    enabled: item.enabled !== false
                })).filter(item => item.term.length > 0);
            } catch (e) {
                return [];
            }
        }

        function setRastreamentoCategories(list) {
            try {
                localStorage.setItem(AZIMUTE_RASTREAMENTO_STORAGE_KEY, JSON.stringify(list));
            } catch (e) {}
        }

        function addRastreamentoCategory() {
            const inputEl = document.getElementById('inputRastreamentoCategoria');
            const term = (inputEl ? inputEl.value : '').trim();
            if (!term) {
                if (typeof showToast === 'function') showToast('Digite uma categoria de comércio ou serviço.');
                return;
            }
            const list = getRastreamentoCategories();
            const exists = list.some(x => x.term.toLowerCase() === term.toLowerCase());
            if (exists) {
                list.forEach(x => {
                    if (x.term.toLowerCase() === term.toLowerCase()) x.enabled = true;
                });
            } else {
                list.push({
                    id: 'ras_' + Date.now(),
                    term: term,
                    enabled: true
                });
            }
            setRastreamentoCategories(list);
            if (inputEl) inputEl.value = '';
            renderRastreamentoCategoriesManagerList();

            const coords = getCurrentRastreamentoCoords();
            renderHomeSupportRastreamentoCards(coords.lat, coords.lon);
            if (coords.lat !== null && coords.lon !== null) {
                updateAzimuteGpsRastreamento(coords.lat, coords.lon, true);
            }
            if (typeof showToast === 'function') showToast('Rastreamento ativado: "' + term + '"');
        }

        function toggleRastreamentoCategoryEnabled(id) {
            const list = getRastreamentoCategories();
            const target = list.find(x => x.id === id);
            if (!target) return;
            target.enabled = !target.enabled;
            setRastreamentoCategories(list);
            renderRastreamentoCategoriesManagerList();

            const coords = getCurrentRastreamentoCoords();
            renderHomeSupportRastreamentoCards(coords.lat, coords.lon);
            if (target.enabled && coords.lat !== null && coords.lon !== null) {
                updateAzimuteGpsRastreamento(coords.lat, coords.lon, true);
            }
        }

        function removeRastreamentoCategory(id) {
            const list = getRastreamentoCategories();
            const target = list.find(x => x.id === id);
            const updated = list.filter(x => x.id !== id);
            setRastreamentoCategories(updated);
            if (target) {
                delete azimuteRastreamentoResultsMap[target.term.toLowerCase()];
                try {
                    localStorage.setItem(AZIMUTE_RASTREAMENTO_CACHE_KEY, JSON.stringify(azimuteRastreamentoResultsMap));
                } catch (e) {}
            }
            renderRastreamentoCategoriesManagerList();
            const coords = getCurrentRastreamentoCoords();
            renderHomeSupportRastreamentoCards(coords.lat, coords.lon);
            if (typeof showToast === 'function') showToast('Categoria removida do rastreamento.');
        }

        function getCurrentRastreamentoCoords() {
            let lat = typeof azimuteLastGeoLat === 'number' && !isNaN(azimuteLastGeoLat) ? azimuteLastGeoLat : null;
            let lon = typeof azimuteLastGeoLon === 'number' && !isNaN(azimuteLastGeoLon) ? azimuteLastGeoLon : null;
            if (lat === null || lon === null) {
                try {
                    const cLat = parseFloat(localStorage.getItem('azimute_last_lat'));
                    const cLon = parseFloat(localStorage.getItem('azimute_last_lon'));
                    if (!isNaN(cLat) && !isNaN(cLon)) {
                        lat = cLat;
                        lon = cLon;
                    }
                } catch (e) {}
            }
            return { lat, lon };
        }

        function renderRastreamentoCategoriesManagerList() {
            const listEl = document.getElementById('rastreamentoCategoriesManagerList');
            const badgeEl = document.getElementById('rastreamentoActiveCountBadge');
            const list = getRastreamentoCategories();
            const activeCount = list.filter(x => x.enabled).length;

            if (badgeEl) {
                badgeEl.textContent = activeCount + (activeCount === 1 ? ' ativo' : ' ativos');
            }
            if (!listEl) return;

            if (!list.length) {
                listEl.innerHTML = '<p class="text-[11px] text-gray-500 italic">Nenhuma categoria cadastrada no rastreamento.</p>';
                return;
            }

            listEl.innerHTML = list.map(item => `
                <div class="bg-[#161616] px-2.5 py-2 rounded-lg border ${item.enabled ? 'border-[#C5A869]/60' : 'border-pmmg-border opacity-70'} flex items-center justify-between gap-2 text-xs min-w-0">
                    <label class="flex items-center gap-2 cursor-pointer select-none min-w-0 flex-1">
                        <input type="checkbox" ${item.enabled ? 'checked' : ''} onchange="toggleRastreamentoCategoryEnabled('${item.id}')" class="w-3.5 h-3.5 accent-[#C5A869] cursor-pointer shrink-0">
                        <span class="font-bold ${item.enabled ? 'text-white' : 'text-gray-400'} truncate">${escapeHtmlSafe(item.term)}</span>
                    </label>
                    <button type="button" onclick="removeRastreamentoCategory('${item.id}')" class="p-1.5 rounded bg-[#0D0D0D] hover:bg-red-950 text-gray-400 hover:text-red-400 border border-pmmg-border transition-colors cursor-pointer shrink-0" title="Excluir categoria">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            `).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function buildOverpassTagClausesForTerm(rawTerm, radiusMeters, lat, lon) {
            const norm = rawTerm.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
            const around = `(around:${radiusMeters},${lat},${lon})`;
            const tagPairs = [];

            if (/farmac|drogari|remedio|medicament/.test(norm)) {
                tagPairs.push(['amenity', 'pharmacy'], ['shop', 'chemist']);
            } else if (/borrach|pneu/.test(norm)) {
                tagPairs.push(['shop', 'tyres'], ['craft', 'tyre_repair'], ['shop', 'car_repair']);
            } else if (/chaveir|chave/.test(norm)) {
                tagPairs.push(['craft', 'locksmith'], ['shop', 'locksmith']);
            } else if (/padari|panific|pao/.test(norm)) {
                tagPairs.push(['shop', 'bakery']);
            } else if (/supermercad|mercad|hipermercad|merceari/.test(norm)) {
                tagPairs.push(['shop', 'supermarket'], ['shop', 'convenience'], ['shop', 'grocery']);
            } else if (/oficin|mecanic|auto eletric|auto pecas|autopecas/.test(norm)) {
                tagPairs.push(['shop', 'car_repair'], ['shop', 'car_parts'], ['craft', 'car_repair']);
            } else if (/posto|combustiv|gasolin|etanol|diesel/.test(norm)) {
                tagPairs.push(['amenity', 'fuel']);
            } else if (/banco|caixa|agencia|loteric/.test(norm)) {
                tagPairs.push(['amenity', 'bank'], ['amenity', 'atm'], ['shop', 'lottery']);
            } else if (/hospital|upa|pronto socorro|clinica|medico|saude/.test(norm)) {
                tagPairs.push(['amenity', 'hospital'], ['amenity', 'clinic'], ['healthcare', 'hospital']);
            } else if (/dentist|odonto/.test(norm)) {
                tagPairs.push(['amenity', 'dentist']);
            } else if (/restaurant|almoco|jantar|comida/.test(norm)) {
                tagPairs.push(['amenity', 'restaurant']);
            } else if (/lanchonet|lanche|hamburg|pizz|fast food/.test(norm)) {
                tagPairs.push(['amenity', 'fast_food'], ['amenity', 'cafe']);
            } else if (/cafe|cafeteri/.test(norm)) {
                tagPairs.push(['amenity', 'cafe']);
            } else if (/hotel|pousad|hospedag/.test(norm)) {
                tagPairs.push(['tourism', 'hotel'], ['tourism', 'motel'], ['tourism', 'guest_house']);
            } else if (/pet|veterinar|racao/.test(norm)) {
                tagPairs.push(['shop', 'pet'], ['amenity', 'veterinary']);
            } else if (/ferrag|construc|material|eletric|hidraulic/.test(norm)) {
                tagPairs.push(['shop', 'hardware'], ['shop', 'doityourself']);
            } else if (/lavajato|lava jato|lava rapido|lavagem/.test(norm)) {
                tagPairs.push(['amenity', 'car_wash']);
            } else if (/estacionament|garagem/.test(norm)) {
                tagPairs.push(['amenity', 'parking']);
            } else if (/papelari|livrari|copia|xerox/.test(norm)) {
                tagPairs.push(['shop', 'stationery'], ['shop', 'books'], ['shop', 'copyshop']);
            } else if (/acoug|carne/.test(norm)) {
                tagPairs.push(['shop', 'butcher']);
            } else if (/hortifrut|sacolao|verdura|fruta/.test(norm)) {
                tagPairs.push(['shop', 'greengrocer']);
            } else if (/otic|oculos/.test(norm)) {
                tagPairs.push(['shop', 'optician']);
            } else if (/barbear|cabeleireir|salao/.test(norm)) {
                tagPairs.push(['shop', 'hairdresser']);
            } else if (/polici|delegaci|batalhao|cia pm/.test(norm)) {
                tagPairs.push(['amenity', 'police']);
            } else if (/bombeir/.test(norm)) {
                tagPairs.push(['amenity', 'fire_station']);
            }

            const safeRegex = rawTerm.replace(/[\^$.*+?()[\]{}|]/g, '\$&');
            const clauses = [];
            tagPairs.forEach(([k, v]) => {
                clauses.push(`nwr["${k}"="${v}"]${around};`);
            });
            clauses.push(`nwr["name"~"${safeRegex}",i]${around};`);
            return clauses.join('');
        }

        function formatOverpassElementAddress(tags) {
            if (!tags) return 'Proximidades da posição GPS';
            const street = tags['addr:street'] || tags['addr:place'] || '';
            const num = tags['addr:housenumber'] || '';
            const suburb = tags['addr:suburb'] || tags['addr:neighbourhood'] || tags['addr:district'] || '';
            const city = tags['addr:city'] || '';
            const parts = [];
            if (street) parts.push(num ? `${street}, ${num}` : street);
            if (suburb) parts.push(suburb);
            if (city && !suburb) parts.push(city);
            return parts.length ? parts.join(' - ') : 'Localizado via GPS / OpenStreetMap';
        }

        function formatRastreamentoDistanceLabel(distKm) {
            if (typeof distKm !== 'number' || isNaN(distKm)) return '--';
            if (distKm < 1.0) {
                const meters = Math.max(10, Math.round(distKm * 1000));
                return `${meters} m`;
            }
            return `${distKm.toFixed(1).replace('.', ',')} km`;
        }

        async function queryOverpassSingleCategory(term, lat, lon, radiusMeters) {
            const bodyClauses = buildOverpassTagClausesForTerm(term, radiusMeters, lat, lon);
            const ql = `[out:json][timeout:12];(${bodyClauses});out center 25;`;
            const endpoints = [
                'https://overpass-api.de/api/interpreter',
                'https://overpass.kumi.systems/api/interpreter'
            ];

            for (let i = 0; i < endpoints.length; i++) {
                try {
                    const controller = new AbortController();
                    const timer = setTimeout(() => controller.abort(), 11000);
                    const res = await fetch(endpoints[i], {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        body: 'data=' + encodeURIComponent(ql),
                        signal: controller.signal
                    });
                    clearTimeout(timer);
                    if (!res.ok) continue;
                    const data = await res.json();
                    const elements = Array.isArray(data && data.elements) ? data.elements : [];
                    if (!elements.length) return null;

                    let best = null;
                    let bestDist = Infinity;

                    elements.forEach(el => {
                        const elLat = typeof el.lat === 'number' ? el.lat : (el.center && typeof el.center.lat === 'number' ? el.center.lat : null);
                        const elLon = typeof el.lon === 'number' ? el.lon : (el.center && typeof el.center.lon === 'number' ? el.center.lon : null);
                        if (elLat === null || elLon === null) return;
                        const d = typeof azimuteCalcDistKm === 'function' ? azimuteCalcDistKm(lat, lon, elLat, elLon) : 0;
                        const tags = el.tags || {};
                        const hasName = Boolean(tags.name || tags.brand);
                        const scoreDist = hasName ? d : d + 0.15;
                        if (scoreDist < bestDist) {
                            bestDist = scoreDist;
                            best = {
                                name: tags.name || tags.brand || (term + ' (OSM)'),
                                address: formatOverpassElementAddress(tags),
                                lat: elLat,
                                lon: elLon,
                                distKm: d,
                                updatedAt: Date.now()
                            };
                        }
                    });
                    return best;
                } catch (e) {}
            }
            return null;
        }

        async function updateAzimuteGpsRastreamento(lat, lon, forceImmediate = false) {
            if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return;

            const activeCategories = getRastreamentoCategories().filter(x => x.enabled);
            renderHomeSupportRastreamentoCards(lat, lon);

            if (!activeCategories.length) return;
            if (navigator.onLine === false) return;

            const signature = activeCategories.map(x => x.term.toLowerCase()).sort().join('|');
            const now = Date.now();
            let movedKm = Infinity;
            if (azimuteRastreamentoLastFetchLat !== null && azimuteRastreamentoLastFetchLon !== null && typeof azimuteCalcDistKm === 'function') {
                movedKm = azimuteCalcDistKm(azimuteRastreamentoLastFetchLat, azimuteRastreamentoLastFetchLon, lat, lon);
            }

            const needsFetch = forceImmediate
                || signature !== azimuteRastreamentoLastSignature
                || movedKm >= 0.12
                || (now - azimuteRastreamentoLastFetchTs) >= 25000;

            if (!needsFetch || azimuteRastreamentoInFlight) return;

            azimuteRastreamentoInFlight = true;
            azimuteRastreamentoLastFetchLat = lat;
            azimuteRastreamentoLastFetchLon = lon;
            azimuteRastreamentoLastFetchTs = now;
            azimuteRastreamentoLastSignature = signature;

            try {
                await Promise.all(activeCategories.map(async (cat) => {
                    const key = cat.term.toLowerCase();
                    let found = await queryOverpassSingleCategory(cat.term, lat, lon, 3500);
                    if (!found) {
                        found = await queryOverpassSingleCategory(cat.term, lat, lon, 9000);
                    }
                    if (found) {
                        azimuteRastreamentoResultsMap[key] = found;
                    } else if (!azimuteRastreamentoResultsMap[key]) {
                        azimuteRastreamentoResultsMap[key] = {
                            notFound: true,
                            updatedAt: Date.now()
                        };
                    }
                }));

                try {
                    localStorage.setItem(AZIMUTE_RASTREAMENTO_CACHE_KEY, JSON.stringify(azimuteRastreamentoResultsMap));
                } catch (e) {}
            } finally {
                azimuteRastreamentoInFlight = false;
                const latest = getCurrentRastreamentoCoords();
                renderHomeSupportRastreamentoCards(latest.lat !== null ? latest.lat : lat, latest.lon !== null ? latest.lon : lon);
            }
        }

        function toggleHomeQuickCommerceBar(forceOpen = null) {
            const bar = document.getElementById('homeQuickCommerceBar');
            if (!bar) return;
            const shouldOpen = forceOpen !== null ? forceOpen : bar.classList.contains('hidden');
            if (shouldOpen) {
                bar.classList.remove('hidden');
                const inp = document.getElementById('inputHomeQuickCommerce');
                if (inp) setTimeout(() => inp.focus(), 50);
            } else {
                bar.classList.add('hidden');
            }
        }

        function addHomeQuickCommerceCategory() {
            const inp = document.getElementById('inputHomeQuickCommerce');
            const term = (inp ? inp.value : '').trim();
            if (!term) {
                if (typeof showToast === 'function') showToast('Digite o nome do comércio ou serviço.');
                return;
            }
            const list = getRastreamentoCategories();
            const exists = list.some(x => x.term.toLowerCase() === term.toLowerCase());
            if (exists) {
                list.forEach(x => {
                    if (x.term.toLowerCase() === term.toLowerCase()) x.enabled = true;
                });
            } else {
                list.push({
                    id: 'ras_' + Date.now(),
                    term: term,
                    enabled: true
                });
            }
            setRastreamentoCategories(list);
            if (inp) inp.value = '';
            toggleHomeQuickCommerceBar(false);
            if (typeof renderRastreamentoCategoriesManagerList === 'function') renderRastreamentoCategoriesManagerList();

            const coords = getCurrentRastreamentoCoords();
            renderHomeSupportRastreamentoCards(coords.lat, coords.lon);
            if (coords.lat !== null && coords.lon !== null) {
                updateAzimuteGpsRastreamento(coords.lat, coords.lon, true);
            }
            if (typeof showToast === 'function') showToast('Comércio salvo: "' + term + '"');
        }

        function buildNativeGeoSearchUrl(term, refLat, refLon) {
            const cleanTerm = String(term || '').trim();
            const encodedTerm = encodeURIComponent(cleanTerm);
            const hasCoords = (typeof refLat === 'number' && typeof refLon === 'number' && !isNaN(refLat) && !isNaN(refLon));
            if (hasCoords) {
                const latStr = refLat.toFixed(6);
                const lonStr = refLon.toFixed(6);
                const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
                if (isMobile) {
                    return 'geo:0,0?q=' + encodedTerm + encodeURIComponent('@' + latStr + ',' + lonStr);
                }
                return 'https://www.google.com/maps/search/' + encodedTerm + '/@' + latStr + ',' + lonStr + ',15z';
            }
            return 'geo:0,0?q=' + encodedTerm;
        }

        function renderHomeSupportRastreamentoCards(refLat, refLon) {
            const container = document.getElementById('homeSupportRastreamentoContainer');
            if (!container) return;

            const activeCategories = getRastreamentoCategories().filter(x => x.enabled);
            if (!activeCategories.length) {
                container.innerHTML = '';
                return;
            }

            const coords = (typeof refLat === 'number' && typeof refLon === 'number' && !isNaN(refLat) && !isNaN(refLon))
                ? { lat: refLat, lon: refLon }
                : getCurrentRastreamentoCoords();

            container.innerHTML = activeCategories.map(cat => {
                const key = cat.term.toLowerCase();
                const hit = azimuteRastreamentoResultsMap[key];
                const geoHref = buildNativeGeoSearchUrl(cat.term, coords.lat, coords.lon);

                let subtitleHtml = '<span class="text-[10px] text-gray-400 block truncate">Busca direta por GPS atual</span>';
                let badgeHtml = '';
                if (hit && !hit.notFound && hit.name) {
                    let liveDistKm = hit.distKm;
                    if (coords.lat !== null && coords.lon !== null && typeof azimuteCalcDistKm === 'function') {
                        liveDistKm = azimuteCalcDistKm(coords.lat, coords.lon, hit.lat, hit.lon);
                    }
                    const distText = formatRastreamentoDistanceLabel(liveDistKm);
                    badgeHtml = `<span class="text-[10px] font-mono font-extrabold bg-pmmg-card text-pmmg-khaki px-1.5 py-0.5 rounded border border-pmmg-khaki/40 shrink-0">${escapeHtmlSafe(distText)}</span>`;
                    subtitleHtml = `<span class="text-[10px] text-gray-300 block truncate">${escapeHtmlSafe(hit.name)}</span>`;
                }

                return `
                    <div class="bg-pmmg-dark p-2.5 rounded-xl border border-pmmg-border border-l-4 border-l-[#C5A869] flex items-center justify-between gap-2 min-w-0 overflow-hidden">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-[10px] font-bold uppercase text-pmmg-khaki truncate">Comércio • ${escapeHtmlSafe(cat.term)}</span>
                                ${badgeHtml}
                            </div>
                            <strong class="text-xs sm:text-sm font-extrabold text-white block truncate mt-0.5">${escapeHtmlSafe(cat.term)}</strong>
                            ${subtitleHtml}
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <a href="${geoHref}" class="px-2.5 py-2 bg-[#161616] hover:bg-pmmg-cardHover text-pmmg-khaki border border-[#C5A869] font-extrabold rounded-lg text-[10.5px] uppercase flex items-center gap-1 shrink-0 shadow transition-all active:scale-95" title="Abrir ${escapeHtmlSafe(cat.term)} no Maps / Waze centrado no GPS atual">
                                <i data-lucide="search" class="w-3.5 h-3.5 text-pmmg-gold shrink-0"></i>
                                <span>Buscar Mais Próximo</span>
                            </a>
                            <button type="button" onclick="removeRastreamentoCategory('${cat.id}')" class="p-1.5 rounded-lg bg-[#161616] hover:bg-red-950 text-gray-400 hover:text-red-300 border border-pmmg-border cursor-pointer shrink-0" title="Remover comércio">
                                <i data-lucide="x" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        let azimuteAudioCtx = null;

        function getAzimuteAudioContext() {
            if (!azimuteAudioCtx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    azimuteAudioCtx = new AudioCtx();
                }
            }
            if (azimuteAudioCtx && azimuteAudioCtx.state === 'suspended') {
                azimuteAudioCtx.resume();
            }
            return azimuteAudioCtx;
        }

        const azimuteRcpMetronomes = {
            adult: {
                running: false,
                bpm: 110,
                targetRatio: 30,
                beatInCycle: 0,
                totalBeats: 0,
                secondsLeft: 120,
                cycleNumber: 1,
                beatIntervalId: null,
                timerIntervalId: null
            },
            pediatric: {
                running: false,
                bpm: 110,
                targetRatio: 15,
                beatInCycle: 0,
                totalBeats: 0,
                secondsLeft: 120,
                cycleNumber: 1,
                beatIntervalId: null,
                timerIntervalId: null
            }
        };

        // Emite o bipe sonoro de cada compressão via Web Audio API (100% offline)
        function playRcpCompressionBeep(type, isCycleEndBeat) {
            try {
                const ctx = getAzimuteAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                // Frequência audível e nítida em ambiente externo; tom levemente mais agudo no fechamento do subciclo (30 ou 15)
                if (type === 'adult') {
                    osc.frequency.setValueAtTime(isCycleEndBeat ? 1180 : 880, now);
                } else {
                    osc.frequency.setValueAtTime(isCycleEndBeat ? 1320 : 980, now);
                }
                osc.type = 'triangle';

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(0.45, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } catch (e) {}
        }

        // Emite som diferenciado (alarme triplo ascendente) ao fechar cada ciclo de 2 minutos
        function playRcpTwoMinuteCycleAlarm() {
            try {
                const ctx = getAzimuteAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const notes = [660, 880, 1320, 1760];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const startT = now + idx * 0.14;
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, startT);

                    gain.gain.setValueAtTime(0.001, startT);
                    gain.gain.exponentialRampToValueAtTime(0.5, startT + 0.015);
                    gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.12);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(startT);
                    osc.stop(startT + 0.13);
                });
            } catch (e) {}
        }

        // Gera o pulso luminoso na tela sincronizado com o bipe sonoro
        function triggerRcpVisualPulse(type, beatInCycle, targetRatio) {
            const orb = document.getElementById('rcpPulseOrb-' + type);
            const flashBox = document.getElementById('rcpVisualFlashBox-' + type);
            const card = document.getElementById('rcpMetroCard-' + type);
            const beatCounter = document.getElementById('rcpBeatCounter-' + type);

            if (beatCounter) {
                beatCounter.textContent = beatInCycle + '/' + targetRatio;
            }

            if (type === 'adult') {
                if (orb) {
                    orb.className = 'w-12 h-12 rounded-2xl bg-rose-500 text-white border-2 border-white flex flex-col items-center justify-center transition-all duration-75 scale-110 shadow-[0_0_22px_#f43f5e]';
                }
                if (flashBox) {
                    flashBox.className = 'bg-rose-950/90 p-3 rounded-xl border-2 border-rose-400 flex flex-col justify-between transition-all duration-75 shadow-[0_0_15px_rgba(244,63,94,0.45)]';
                }
                if (card) {
                    card.className = 'bg-pmmg-dark p-4 rounded-2xl border-2 border-rose-400 flex flex-col justify-between space-y-4 transition-all duration-75 relative overflow-hidden shadow-[0_0_25px_rgba(244,63,94,0.3)]';
                }
            } else {
                if (orb) {
                    orb.className = 'w-12 h-12 rounded-2xl bg-sky-400 text-pmmg-black border-2 border-white flex flex-col items-center justify-center transition-all duration-75 scale-110 shadow-[0_0_22px_#38bdf8]';
                }
                if (flashBox) {
                    flashBox.className = 'bg-sky-950/90 p-3 rounded-xl border-2 border-sky-300 flex flex-col justify-between transition-all duration-75 shadow-[0_0_15px_rgba(56,189,248,0.45)]';
                }
                if (card) {
                    card.className = 'bg-pmmg-dark p-4 rounded-2xl border-2 border-sky-300 flex flex-col justify-between space-y-4 transition-all duration-75 relative overflow-hidden shadow-[0_0_25px_rgba(56,189,248,0.3)]';
                }
            }

            setTimeout(() => {
                if (type === 'adult') {
                    if (orb) orb.className = 'w-12 h-12 rounded-2xl bg-pmmg-card border-2 border-rose-500/50 flex flex-col items-center justify-center transition-all duration-75 shadow-inner';
                    if (flashBox) flashBox.className = 'bg-pmmg-card p-3 rounded-xl border border-pmmg-border flex flex-col justify-between transition-all duration-75';
                    if (card) card.className = 'bg-pmmg-dark p-4 rounded-2xl border-2 border-rose-500/50 flex flex-col justify-between space-y-4 transition-all duration-100 relative overflow-hidden';
                } else {
                    if (orb) orb.className = 'w-12 h-12 rounded-2xl bg-pmmg-card border-2 border-sky-500/50 flex flex-col items-center justify-center transition-all duration-75 shadow-inner';
                    if (flashBox) flashBox.className = 'bg-pmmg-card p-3 rounded-xl border border-pmmg-border flex flex-col justify-between transition-all duration-75';
                    if (card) card.className = 'bg-pmmg-dark p-4 rounded-2xl border-2 border-sky-500/50 flex flex-col justify-between space-y-4 transition-all duration-100 relative overflow-hidden';
                }
            }, 135);
        }

        function formatRcpSeconds(sec) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        }

        window.triggerRcpReevaluationAlert = function(type) {
            playRcpTwoMinuteCycleAlarm();
            const banner = document.getElementById('rcpCycleAlertBanner-' + type);
            if (banner) banner.classList.remove('hidden');
            if (typeof showToast === 'function') {
                showToast('MOMENTO DE REAVALIAÇÃO / TROCAR SOCORRISTA');
            }
        };

        window.acknowledgeRcpAlert = function(type) {
            const banner = document.getElementById('rcpCycleAlertBanner-' + type);
            if (banner) banner.classList.add('hidden');
        };

        function executeRcpBeatTick(type) {
            const st = azimuteRcpMetronomes[type];
            if (!st || !st.running) return;
            st.beatInCycle = (st.beatInCycle % st.targetRatio) + 1;
            st.totalBeats += 1;
            const isEndBeat = (st.beatInCycle === st.targetRatio);
            playRcpCompressionBeep(type, isEndBeat);
            triggerRcpVisualPulse(type, st.beatInCycle, st.targetRatio);
        }

        function startRcpMetronomeLoops(type) {
            const st = azimuteRcpMetronomes[type];
            if (!st) return;
            if (st.beatIntervalId) clearInterval(st.beatIntervalId);
            if (st.timerIntervalId) clearInterval(st.timerIntervalId);

            const intervalMs = Math.round(60000 / st.bpm);
            // Primeira batida imediata ao iniciar
            executeRcpBeatTick(type);
            st.beatIntervalId = setInterval(() => {
                executeRcpBeatTick(type);
            }, intervalMs);

            st.timerIntervalId = setInterval(() => {
                if (!st.running) return;
                st.secondsLeft -= 1;
                if (st.secondsLeft <= 0) {
                    // Fechou ciclo de 2 minutos: emite som diferenciado e alerta visual obrigatório
                    window.triggerRcpReevaluationAlert(type);
                    st.cycleNumber += 1;
                    st.secondsLeft = 120;
                    const cycEl = document.getElementById('rcpCycleCount-' + type);
                    if (cycEl) cycEl.textContent = 'Ciclo #' + st.cycleNumber;
                }
                const tDisp = document.getElementById('rcpTimerDisplay-' + type);
                if (tDisp) tDisp.textContent = formatRcpSeconds(st.secondsLeft);
            }, 1000);
        }

        window.toggleRcpMetronome = function(type) {
            const otherType = (type === 'adult') ? 'pediatric' : 'adult';
            if (azimuteRcpMetronomes[otherType] && azimuteRcpMetronomes[otherType].running) {
                stopRcpMetronomeInternal(otherType);
            }

            const st = azimuteRcpMetronomes[type];
            if (!st) return;

            if (st.running) {
                stopRcpMetronomeInternal(type);
            } else {
                getAzimuteAudioContext();
                st.running = true;
                updateRcpMetronomeControlsUi(type);
                startRcpMetronomeLoops(type);
            }
        };

        function stopRcpMetronomeInternal(type) {
            const st = azimuteRcpMetronomes[type];
            if (!st) return;
            st.running = false;
            if (st.beatIntervalId) {
                clearInterval(st.beatIntervalId);
                st.beatIntervalId = null;
            }
            if (st.timerIntervalId) {
                clearInterval(st.timerIntervalId);
                st.timerIntervalId = null;
            }
            updateRcpMetronomeControlsUi(type);
        }

        function updateRcpMetronomeControlsUi(type) {
            const st = azimuteRcpMetronomes[type];
            const btn = document.getElementById('btnToggleMetro-' + type);
            const txt = document.getElementById('txtToggleMetro-' + type);
            const stateLbl = document.getElementById('rcpStateLabel-' + type);

            if (st.running) {
                if (stateLbl) {
                    stateLbl.textContent = 'ATIVO • PULSANDO';
                    stateLbl.className = 'text-[10px] font-mono font-extrabold uppercase text-emerald-400 animate-pulse';
                }
                if (btn) {
                    btn.className = 'col-span-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-95 text-pmmg-black font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider transition-all cursor-pointer';
                }
                if (txt) {
                    txt.textContent = (type === 'adult') ? 'PARAR METRÔNOMO ADULTO' : 'PARAR METRÔNOMO PEDIÁTRICO';
                }
            } else {
                if (stateLbl) {
                    stateLbl.textContent = 'PARADO';
                    stateLbl.className = 'text-[10px] font-mono font-bold uppercase text-gray-400';
                }
                if (btn) {
                    btn.className = (type === 'adult')
                        ? 'col-span-2 py-3 px-4 bg-pmmg-dark hover:bg-pmmg-border active:scale-95 text-pmmg-khaki border border-pmmg-gold/60 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider transition-all cursor-pointer'
                        : 'col-span-2 py-3 px-4 bg-pmmg-dark hover:bg-pmmg-border active:scale-95 text-pmmg-khaki border border-pmmg-gold/60 font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg uppercase tracking-wider transition-all cursor-pointer';
                }
                if (txt) {
                    txt.textContent = (type === 'adult') ? 'INICIAR METRÔNOMO ADULTO' : 'INICIAR METRÔNOMO PEDIÁTRICO';
                }
            }
        }

        window.setRcpMetronomeBpm = function(type, newBpm) {
            const st = azimuteRcpMetronomes[type];
            if (!st) return;
            const clamped = Math.min(120, Math.max(100, parseInt(newBpm, 10) || 110));
            st.bpm = clamped;

            const slider = document.getElementById('rcpBpmSlider-' + type);
            const readout = document.getElementById('rcpBpmReadout-' + type);
            if (slider) slider.value = clamped;
            if (readout) {
                const colorClass = (type === 'adult') ? 'text-rose-400' : 'text-sky-400';
                readout.innerHTML = `${clamped} <span class="text-xs font-normal ${colorClass}">BPM</span>`;
            }

            if (st.running) {
                if (st.beatIntervalId) clearInterval(st.beatIntervalId);
                const intervalMs = Math.round(60000 / st.bpm);
                st.beatIntervalId = setInterval(() => {
                    executeRcpBeatTick(type);
                }, intervalMs);
            }
        };

        window.stepRcpMetronomeBpm = function(type, delta) {
            const st = azimuteRcpMetronomes[type];
            if (!st) return;
            window.setRcpMetronomeBpm(type, st.bpm + delta);
        };

        window.resetRcpMetronome = function(type) {
            stopRcpMetronomeInternal(type);
            const st = azimuteRcpMetronomes[type];
            if (!st) return;
            st.beatInCycle = 0;
            st.totalBeats = 0;
            st.secondsLeft = 120;
            st.cycleNumber = 1;

            const beatCounter = document.getElementById('rcpBeatCounter-' + type);
            const tDisp = document.getElementById('rcpTimerDisplay-' + type);
            const cycEl = document.getElementById('rcpCycleCount-' + type);
            const banner = document.getElementById('rcpCycleAlertBanner-' + type);

            if (beatCounter) beatCounter.textContent = '0/' + st.targetRatio;
            if (tDisp) tDisp.textContent = '02:00';
            if (cycEl) cycEl.textContent = 'Ciclo #1';
            if (banner) banner.classList.add('hidden');
        };

        window.setPediatricCycleRatio = function(ratioNum) {
            const st = azimuteRcpMetronomes.pediatric;
            if (!st) return;
            st.targetRatio = (ratioNum === 30) ? 30 : 15;
            st.beatInCycle = 0;

            const b15 = document.getElementById('btnPedRatio15');
            const b30 = document.getElementById('btnPedRatio30');
            const beatCounter = document.getElementById('rcpBeatCounter-pediatric');

            if (b15 && b30) {
                if (st.targetRatio === 15) {
                    b15.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-pmmg-dark text-pmmg-khaki border border-pmmg-gold/60 border border-sky-400';
                    b30.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pmmg-card text-gray-300 border border-pmmg-border hover:text-white';
                } else {
                    b30.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-pmmg-dark text-pmmg-khaki border border-pmmg-gold/60 border border-sky-400';
                    b15.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pmmg-card text-gray-300 border border-pmmg-border hover:text-white';
                }
            }
            if (beatCounter) beatCounter.textContent = '0/' + st.targetRatio;
        };

        // Calcula a lista ordenada de hospitais de referência e aplica a regra de prioridade máxima do Hospital João XXIII (margem de até 3 km)

        function decodeWmoWeather(code) {
            const map = {
                0: 'Céu Limpo ',
                1: 'Predom. Limpo ',
                2: 'Parc. Nublado ',
                3: 'Encoberto ',
                45: 'Neblina ',
                48: 'Nevoeiro ',
                51: 'Garoa Leve ',
                53: 'Garoa Moderada ',
                55: 'Garoa Densa ',
                61: 'Chuva Leve ',
                63: 'Chuva Moderada ',
                65: 'Chuva Forte ',
                80: 'Pancadas de Chuva ',
                81: 'Pancadas Fortes ',
                82: 'Tempestade ',
                95: 'Trovoadas ',
                96: 'Trovoadas c/ Granizo '
            };
            return map[code] || 'Instável ';
        }

        async function fetchRealtimeWeatherDetails(lat, lon) {
            const useLat = lat || azimuteLastGeoLat || -19.9162;
            const useLon = lon || azimuteLastGeoLon || -44.0809;
            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${useLat}&longitude=${useLon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&forecast_days=7&timezone=America%2FSao_Paulo`;
                const res = await fetch(url);
                const data = await res.json();
                if (data) {
                    if (typeof data.elevation === 'number') {
                        const elevStr = Math.round(data.elevation) + 'm';
                        const detAlt = document.getElementById('detAltitude');
                        if (detAlt) detAlt.textContent = elevStr;
                        const altQuick = document.getElementById('hudAltitudeQuickBadge');
                        if (altQuick) altQuick.textContent = 'Altitude: ' + elevStr;
                        try { localStorage.setItem('azimute_last_altitude', elevStr); } catch (e) {}
                    }
                    if (data.current) {
                        const tStr = data.current.temperature_2m + ' °C';
                        const hStr = data.current.relative_humidity_2m + ' %';
                        const wStr = data.current.wind_speed_10m + 'km/h';
                        const gStr = (data.current.wind_gusts_10m !== undefined && data.current.wind_gusts_10m !== null)
                            ? data.current.wind_gusts_10m + 'km/h'
                            : wStr;
                        const cStr = decodeWmoWeather(data.current.weather_code);

                        const detTemp = document.getElementById('detTemp');
                        const detHum = document.getElementById('detHumidity');
                        const detWind = document.getElementById('detWind');
                        const detGusts = document.getElementById('detWindGusts');
                        const detCond = document.getElementById('detCondition');
                        const detUpd = document.getElementById('detWeatherUpdatedAt');
                        if (detTemp) detTemp.textContent = tStr;
                        if (detHum) detHum.textContent = hStr;
                        if (detWind) detWind.textContent = wStr;
                        if (detGusts) detGusts.textContent = gStr;
                        if (detCond) detCond.textContent = cStr;
                        if (detUpd) detUpd.textContent = 'Atualizado às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                        // Atualiza o Cabeçalho Inteligente e o Corpo de "CLIMA LOCAL" na aba Geolocalização
                        const lcTemp = document.getElementById('localClimateTemp');
                        const lcCond = document.getElementById('localClimateCond');
                        const lcWind = document.getElementById('localClimateWind');
                        const lcHdrCond = document.getElementById('localClimateHeaderCond');
                        const lcHdrTemp = document.getElementById('localClimateHeaderTemp');
                        const cleanCondStr = cStr.trim();
                        if (lcTemp) lcTemp.textContent = tStr;
                        if (lcCond) lcCond.textContent = cleanCondStr;
                        if (lcWind) lcWind.textContent = wStr;
                        if (lcHdrCond) lcHdrCond.textContent = cleanCondStr;
                        if (lcHdrTemp) lcHdrTemp.textContent = tStr;

                        // Atualiza também o Modal de Clima do Modo GRID
                        const gmTemp = document.getElementById('gridModalTemp');
                        const gmCond = document.getElementById('gridModalCond');
                        const gmWind = document.getElementById('gridModalWind');
                        const gmHum = document.getElementById('gridModalHum');
                        const gmAlt = document.getElementById('gridModalAlt');
                        const gMiniW = document.getElementById('gridCenterWeatherMini');
                        if (gmTemp) gmTemp.textContent = tStr;
                        if (gmCond) gmCond.textContent = cStr;
                        if (gmWind) gmWind.textContent = wStr;
                        if (gmHum) gmHum.textContent = hStr;
                        if (gmAlt && typeof data.elevation === 'number') gmAlt.textContent = Math.round(data.elevation) + 'm';
                        if (gMiniW) gMiniW.textContent = tStr + ' • ' + cStr;
                    }

                    // Chance de chuva atual + Previsão para as Próximas Horas (8 horas à frente)
                    if (data.hourly && Array.isArray(data.hourly.time)) {
                        const nowMs = Date.now();
                        let startIdx = 0;
                        for (let i = 0; i < data.hourly.time.length; i++) {
                            const tMs = new Date(data.hourly.time[i]).getTime();
                            if (tMs >= nowMs - 3600000) {
                                startIdx = i;
                                break;
                            }
                        }

                        if (data.hourly.precipitation_probability) {
                            const probs = data.hourly.precipitation_probability.slice(startIdx, startIdx + 4);
                            const maxProb = probs.length ? Math.max(...probs) : (data.hourly.precipitation_probability[0] || 0);
                            const detRain = document.getElementById('detRainProb');
                            const gmRain = document.getElementById('gridModalRain');
                            if (detRain) detRain.textContent = maxProb + ' %';
                            if (gmRain) gmRain.textContent = maxProb + ' %';
                        }

                        const hourlyGrid = document.getElementById('geoHourlyForecastGrid');
                        if (hourlyGrid) {
                            let hHtml = '';
                            const sliceEnd = Math.min(startIdx + 8, data.hourly.time.length);
                            for (let i = startIdx; i < sliceEnd; i++) {
                                const rawTime = data.hourly.time[i] || '';
                                const hourLabel = rawTime.includes('T') ? rawTime.split('T')[1].slice(0, 5) : rawTime;
                                const hTemp = (data.hourly.temperature_2m && data.hourly.temperature_2m[i] !== undefined) ? Math.round(data.hourly.temperature_2m[i]) + '°C' : '--';
                                const hRain = (data.hourly.precipitation_probability && data.hourly.precipitation_probability[i] !== undefined) ? data.hourly.precipitation_probability[i] + '%' : '0%';
                                const hWind = (data.hourly.wind_speed_10m && data.hourly.wind_speed_10m[i] !== undefined) ? Math.round(data.hourly.wind_speed_10m[i]) + 'km/h' : '--';
                                const hCond = (data.hourly.weather_code && data.hourly.weather_code[i] !== undefined) ? decodeWmoWeather(data.hourly.weather_code[i]) : '';
                                hHtml += `
                                    <div class="bg-pmmg-card p-2.5 rounded-xl border border-pmmg-border flex flex-col justify-between space-y-1 text-center">
                                        <span class="text-[10px] font-mono font-extrabold text-pmmg-khaki">${i === startIdx ? 'Agora (' + hourLabel + ')' : hourLabel}</span>
                                        <strong class="text-sm font-mono text-white font-extrabold">${hTemp}</strong>
                                        <span class="text-[10px] text-sky-300 truncate"title="${hCond}">${hCond}</span>
                                        <div class="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-pmmg-border/60">
                                            <span class="text-amber-400"title="Chance de chuva"> ${hRain}</span>
                                            <span class="text-gray-300"title="Vento"> ${hWind}</span>
                                        </div>
                                    </div>
                                `;
                            }
                            if (hHtml) hourlyGrid.innerHTML = hHtml;
                        }
                    }

                    // Previsão para os Próximos Dias (Daily via Open-Meteo)
                    if (data.daily && Array.isArray(data.daily.time)) {
                        const dailyGrid = document.getElementById('geoDailyForecastGrid');
                        if (dailyGrid) {
                            const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                            let dHtml = '';
                            const maxDays = Math.min(6, data.daily.time.length);
                            for (let j = 0; j < maxDays; j++) {
                                const dateStr = data.daily.time[j];
                                const parts = dateStr.split('-');
                                const dObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                                const dayName = j === 0 ? 'Hoje' : (j === 1 ? 'Amanhã' : diasSemana[dObj.getDay()]);
                                const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
                                const tMax = (data.daily.temperature_2m_max && data.daily.temperature_2m_max[j] !== undefined) ? Math.round(data.daily.temperature_2m_max[j]) + '°C' : '--';
                                const tMin = (data.daily.temperature_2m_min && data.daily.temperature_2m_min[j] !== undefined) ? Math.round(data.daily.temperature_2m_min[j]) + '°C' : '--';
                                const rMax = (data.daily.precipitation_probability_max && data.daily.precipitation_probability_max[j] !== undefined) ? data.daily.precipitation_probability_max[j] + '%' : '0%';
                                const wMax = (data.daily.wind_speed_10m_max && data.daily.wind_speed_10m_max[j] !== undefined) ? Math.round(data.daily.wind_speed_10m_max[j]) + 'km/h' : '--';
                                const dCond = (data.daily.weather_code && data.daily.weather_code[j] !== undefined) ? decodeWmoWeather(data.daily.weather_code[j]) : '--';

                                dHtml += `
                                    <div class="bg-pmmg-card p-3 rounded-xl border border-pmmg-border flex items-center justify-between gap-2">
                                        <div class="min-w-0">
                                            <span class="text-xs font-extrabold text-white block">${dayName} <span class="text-[10px] font-mono text-pmmg-khaki font-normal">(${shortDate})</span></span>
                                            <span class="text-[11px] text-sky-300 font-semibold block truncate mt-0.5">${dCond}</span>
                                        </div>
                                        <div class="text-right shrink-0 space-y-0.5 font-mono">
                                            <div class="text-xs font-extrabold">
                                                <span class="text-sky-300">${tMin}</span>
                                                <span class="text-gray-500 mx-0.5">/</span>
                                                <span class="text-pmmg-gold">${tMax}</span>
                                            </div>
                                            <div class="text-[10px] text-gray-300 flex items-center justify-end gap-2">
                                                <span class="text-amber-400"> ${rMax}</span>
                                                <span> ${wMax}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }
                            if (dHtml) dailyGrid.innerHTML = dHtml;
                        }
                    }
                }
            } catch (e) {}
        }


        async function resolveExactStreetCep(roadName, suburbName, cityName, stateCode, nominatimData) {
            if (!roadName || roadName === 'Via / Logradouro local') return '';
            const norm = s => (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
            const stripStreetPrefix = s => (s || '').replace(/^(Rua|Avenida|Av\.?|Praça|Pç\.?|Alameda|Travessa|Tv\.?|Rodovia|Rod\.?|Beco|Viela|Largo|Estrada|Est\.?|Via)\s+/i, '').trim();
            const expandPtAbbr = s => (s || '')
                .replace(/\bDr\.?\b/gi, 'Doutor')
                .replace(/\bDra\.?\b/gi, 'Doutora')
                .replace(/\bProf\.?\b/gi, 'Professor')
                .replace(/\bProfa\.?\b/gi, 'Professora')
                .replace(/\bPres\.?\b/gi, 'Presidente')
                .replace(/\bCel\.?\b/gi, 'Coronel')
                .replace(/\bGen\.?\b/gi, 'General')
                .replace(/\bMal\.?\b/gi, 'Marechal')
                .replace(/\bSgt\.?\b/gi, 'Sargento')
                .replace(/\bTen\.?\b/gi, 'Tenente')
                .replace(/\bCap\.?\b/gi, 'Capitao')
                .replace(/\bMaj\.?\b/gi, 'Major')
                .replace(/\bDep\.?\b/gi, 'Deputado')
                .replace(/\bGov\.?\b/gi, 'Governador')
                .replace(/\bPref\.?\b/gi, 'Prefeito')
                .replace(/\bSta\.?\b/gi, 'Santa')
                .replace(/\bSto\.?\b/gi, 'Santo')
                .replace(/\bN\.?\s*Sra\.?\b/gi, 'Nossa Senhora')
                .trim();

            const isValidSpecificCep = cepStr => {
                const digits = (cepStr || '').replace(/\D/g, '');
                return digits.length === 8 && !digits.endsWith('000');
            };
            const formatCep = cepStr => {
                const d = (cepStr || '').replace(/\D/g, '');
                return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : '';
            };

            const uf = (stateCode || 'MG').trim().toUpperCase();
            const cleanCity = (cityName || '').trim();
            const coreRoadRaw = stripStreetPrefix(roadName);
            const expandedRoad = expandPtAbbr(coreRoadRaw);

            // Não inventa CEP: exige retorno exato daquela via na base oficial ViaCEP (ou tag explícita da própria via no OSM)
            if (cleanCity && expandedRoad.length >= 3 && navigator.onLine !== false) {
                const queryCandidates = [expandedRoad];
                if (coreRoadRaw !== expandedRoad && coreRoadRaw.length >= 3) {
                    queryCandidates.push(coreRoadRaw);
                }
                const words = expandedRoad.split(/\s+/).filter(w => w.length >= 3);
                if (words.length >= 3) {
                    queryCandidates.push(words.slice(-2).join(' '));
                }

                const normFullTarget = norm(expandPtAbbr(roadName));
                const normCoreTarget = norm(expandedRoad);
                const normSuburb = norm(suburbName);

                for (const qStreet of queryCandidates) {
                    try {
                        const vcCtrl = new AbortController();
                        const vcTimer = setTimeout(() => vcCtrl.abort(), 3500);
                        const vcUrl = `https://viacep.com.br/ws/${encodeURIComponent(uf)}/${encodeURIComponent(cleanCity)}/${encodeURIComponent(qStreet)}/json/`;
                        const vcRes = await fetch(vcUrl, { signal: vcCtrl.signal });
                        clearTimeout(vcTimer);

                        if (vcRes.ok) {
                            const list = await vcRes.json();
                            if (Array.isArray(list) && list.length > 0) {
                                const streetMatches = list.filter(item => {
                                    if (!item || !isValidSpecificCep(item.cep)) return false;
                                    const itemFull = norm(expandPtAbbr(item.logradouro));
                                    const itemCore = norm(stripStreetPrefix(expandPtAbbr(item.logradouro)));
                                    return (itemFull && itemFull === normFullTarget) || (itemCore && itemCore === normCoreTarget);
                                });

                                if (streetMatches.length > 0) {
                                    const uniqueAll = [...new Set(streetMatches.map(m => formatCep(m.cep)))];
                                    if (uniqueAll.length === 1) {
                                        return ' • CEP: ' + uniqueAll[0];
                                    }

                                    if (normSuburb) {
                                        const suburbMatches = streetMatches.filter(m => {
                                            const nb = norm(m.bairro);
                                            return nb && (nb === normSuburb || nb.includes(normSuburb) || normSuburb.includes(nb));
                                        });
                                        const uniqueSub = [...new Set(suburbMatches.map(m => formatCep(m.cep)))];
                                        if (uniqueSub.length === 1) {
                                            return ' • CEP: ' + uniqueSub[0];
                                        }
                                        const nomCep = nominatimData?.address?.postcode ? formatCep(nominatimData.address.postcode) : '';
                                        if (nomCep && uniqueSub.includes(nomCep)) {
                                            return ' • CEP: ' + nomCep;
                                        }
                                    }

                                    const nomCepGlobal = nominatimData?.address?.postcode ? formatCep(nominatimData.address.postcode) : '';
                                    if (nomCepGlobal && uniqueAll.includes(nomCepGlobal)) {
                                        return ' • CEP: ' + nomCepGlobal;
                                    }
                                    // Via possui múltiplos CEPs por faixa de numeração sem identificação exata do trecho -> oculta CEP
                                    return '';
                                }
                            }
                        }
                    } catch (eVc) {}
                }
            }

            // Fallback estrito offline: aceita apenas se a própria way da rua no OSM tiver tag postal_code / addr:postcode específica
            const extraCep = nominatimData?.extratags?.['addr:postcode'] || nominatimData?.extratags?.['postal_code'];
            if (nominatimData?.osm_type === 'way' && isValidSpecificCep(extraCep)) {
                return ' • CEP: ' + formatCep(extraCep);
            }

            // Sem retorno exato confirmado para aquela rua: oculta o CEP
            return '';
        }

        window.toggleGeoWeatherBox = function(forceOpen = null) {
            const box = document.getElementById('localWeatherExpandableBody');
            const icon = document.getElementById('iconGeoWeatherChevron');
            if (!box) return;
            const shouldOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (shouldOpen) {
                box.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
                fetchRealtimeWeatherDetails(azimuteLastGeoLat, azimuteLastGeoLon);
            } else {
                box.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.openGeoWeatherSubpage = function() {
            const card = document.getElementById('geoDetailsCard');
            if (card) {
                card.classList.remove('hidden');
                fetchRealtimeWeatherDetails(azimuteLastGeoLat, azimuteLastGeoLon);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        };

        window.toggleGeoConnectivityBox = function(forceOpen = null) {
            const box = document.getElementById('localConnectivityExpandableBody');
            const icon = document.getElementById('iconGeoConnectivityChevron');
            if (!box) return;
            const shouldOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (shouldOpen) {
                box.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        function toggleGeoWeatherDetails() {
            window.toggleGeoWeatherBox();
        }

        window.closeGeoWeatherSubpage = function() {
            const card = document.getElementById('geoDetailsCard');
            if (card) card.classList.add('hidden');
        };

        // ================= MÓDULO DE CONECTIVIDADE E DIAGNÓSTICO REAL VIA REQUISIÇÃO =================
        let azimuteConnTestRunning = false;

        function detectNetworkTechnologyLabel() {
            if (navigator.onLine === false) {
                return { label: 'Offline', detail: 'Sem conexão ativa' };
            }
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                const rawType = (conn.type || '').toLowerCase();
                const effType = (conn.effectiveType || '').toLowerCase();
                if (rawType === 'wifi') {
                    return { label: 'Wi-Fi', detail: effType ? 'Wi-Fi (' + effType.toUpperCase() + ')' : 'Rede sem fio Wi-Fi' };
                }
                if (rawType === 'ethernet') {
                    return { label: 'Ethernet / Cabo', detail: 'Conexão cabeada' };
                }
                if (rawType === 'cellular') {
                    if (effType === '4g') return { label: '4G / 5G Móvel', detail: 'Rede celular de alta velocidade' };
                    if (effType === '3g') return { label: '3G Móvel', detail: 'Rede celular intermediária' };
                    if (effType === '2g' || effType === 'slow-2g') return { label: '2G Móvel', detail: 'Rede celular baixa velocidade' };
                    return { label: '4G / 5G Móvel', detail: 'Dados móveis ativos' };
                }
                if (effType === '4g') {
                    const isMobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
                    return {
                        label: isMobileUa ? '4G / 5G / Wi-Fi' : 'Wi-Fi / Banda Larga',
                        detail: 'Perfil efetivo: ' + effType.toUpperCase()
                    };
                }
                if (effType === '3g' || effType === '2g' || effType === 'slow-2g') {
                    return { label: effType.toUpperCase() + 'Móvel', detail: 'Perfil efetivo: ' + effType.toUpperCase() };
                }
            }
            const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
            return {
                label: isMobile ? '4G / 5G / Wi-Fi' : 'Wi-Fi / Rede Local',
                detail: 'Conexão de dados ativa'
            };
        }

        // Aplica um dos 4 estados visuais mantendo o resumo direto no cabeçalho da caixa fechada
        function applyConnectivityVisualState(stateKey) {
            const summaryCard = document.getElementById('localConnectivitySummaryCard');
            const summaryIcon = document.getElementById('connSummaryIconBox');
            const summaryBadge = document.getElementById('connSummaryStateBadge');
            const summaryStatusTxt = document.getElementById('connSummaryStatusText');
            const modalBadge = document.getElementById('connModalStateBadge');

            if (stateKey === 'good') {
                if (summaryCard) summaryCard.className = 'bg-pmmg-card/90 backdrop-blur-sm border border-emerald-500/55 rounded-2xl overflow-hidden shadow-xl transition-all';
                if (summaryIcon) summaryIcon.className = 'p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/50 transition-colors shrink-0';
                if (summaryBadge) {
                    summaryBadge.textContent = 'Bom';
                    summaryBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/60 transition-all';
                }
                if (summaryStatusTxt) {
                    summaryStatusTxt.textContent = 'Bom';
                    summaryStatusTxt.className = 'text-xs sm:text-sm font-mono text-emerald-400 font-extrabold block mt-0.5 truncate';
                }
                if (modalBadge) {
                    modalBadge.textContent = 'BOM';
                    modalBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/60';
                }
            } else if (stateKey === 'moderate') {
                if (summaryCard) summaryCard.className = 'bg-pmmg-card/90 backdrop-blur-sm border border-amber-500/55 rounded-2xl overflow-hidden shadow-xl transition-all';
                if (summaryIcon) summaryIcon.className = 'p-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/50 transition-colors shrink-0';
                if (summaryBadge) {
                    summaryBadge.textContent = 'Moderado';
                    summaryBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-500/60 transition-all';
                }
                if (summaryStatusTxt) {
                    summaryStatusTxt.textContent = 'Moderado';
                    summaryStatusTxt.className = 'text-xs sm:text-sm font-mono text-amber-300 font-extrabold block mt-0.5 truncate';
                }
                if (modalBadge) {
                    modalBadge.textContent = 'MODERADO';
                    modalBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-500/60';
                }
            } else if (stateKey === 'bad') {
                if (summaryCard) summaryCard.className = 'bg-pmmg-card/90 backdrop-blur-sm border border-red-500/55 rounded-2xl overflow-hidden shadow-xl transition-all';
                if (summaryIcon) summaryIcon.className = 'p-2 rounded-lg bg-red-950 text-red-400 border border-red-500/50 transition-colors shrink-0';
                if (summaryBadge) {
                    summaryBadge.textContent = 'Ruim';
                    summaryBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-red-950 text-red-400 border border-red-500/60 transition-all';
                }
                if (summaryStatusTxt) {
                    summaryStatusTxt.textContent = 'Ruim';
                    summaryStatusTxt.className = 'text-xs sm:text-sm font-mono text-red-400 font-extrabold block mt-0.5 truncate';
                }
                if (modalBadge) {
                    modalBadge.textContent = 'RUIM';
                    modalBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-extrabold uppercase bg-red-950 text-red-400 border border-red-500/60';
                }
            } else {
                if (summaryCard) summaryCard.className = 'bg-pmmg-card/90 backdrop-blur-sm border border-gray-500/50 rounded-2xl overflow-hidden shadow-xl transition-all';
                if (summaryIcon) summaryIcon.className = 'p-2 rounded-lg bg-gray-800 text-gray-300 border border-gray-500/40 transition-colors shrink-0';
                if (summaryBadge) {
                    summaryBadge.textContent = 'Sem medição';
                    summaryBadge.className = 'px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-gray-800 text-gray-300 border border-gray-500/50 transition-all';
                }
                if (summaryStatusTxt) {
                    summaryStatusTxt.textContent = 'Sem medição';
                    summaryStatusTxt.className = 'text-xs sm:text-sm font-mono text-gray-300 font-extrabold block mt-0.5 truncate';
                }
                if (modalBadge) {
                    modalBadge.textContent = 'SEM MEDIÇÃO';
                    modalBadge.className = 'px-2.5 py-0.5 rounded text-xs font-mono font-extrabold uppercase bg-gray-800 text-gray-300 border border-gray-500/60';
                }
            }
        }

        window.openGeoConnectivitySubpage = function() {
            const modal = document.getElementById('geoConnectivitySubpage');
            if (modal) {
                modal.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        };

        window.closeGeoConnectivitySubpage = function() {
            const modal = document.getElementById('geoConnectivitySubpage');
            if (modal) modal.classList.add('hidden');
        };

        window.runRealConnectivityDiagnostic = async function() {
            if (azimuteConnTestRunning) return;
            azimuteConnTestRunning = true;

            const btn = document.getElementById('btnRunConnectivityTest');
            const txtBtn = document.getElementById('txtRunConnTest');
            const iconBtn = document.getElementById('iconRunConnTest');
            const sumBtn = document.getElementById('btnSummaryRunConnTest');
            const sumTxt = document.getElementById('txtSummaryConnTest');
            const sumIcon = document.getElementById('iconSummaryConnTest');
            const sumBadge = document.getElementById('connSummaryStateBadge');
            const sumStatus = document.getElementById('connSummaryStatusText');
            const progBox = document.getElementById('connTestProgressBox');
            const progBar = document.getElementById('connTestProgressBar');
            const progStep = document.getElementById('connTestStepText');
            const progPct = document.getElementById('connTestPercentText');

            if (btn) btn.disabled = true;
            if (txtBtn) txtBtn.textContent = 'Medindo rede...';
            if (iconBtn) iconBtn.classList.add('animate-spin');
            if (sumBtn) sumBtn.disabled = true;
            if (sumTxt) sumTxt.textContent = 'Medindo...';
            if (sumIcon) sumIcon.classList.add('animate-spin');
            if (sumBadge) sumBadge.textContent = 'MEDINDO...';
            if (sumStatus) sumStatus.textContent = 'MEDINDO...';
            if (progBox) progBox.classList.remove('hidden');

            const setProg = (pct, msg) => {
                if (progBar) progBar.style.width = pct + '%';
                if (progPct) progPct.textContent = pct + '%';
                if (progStep) progStep.textContent = msg;
            };

            const techInfo = detectNetworkTechnologyLabel();
            const nowStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + new Date().toLocaleDateString('pt-BR') + ')';

            // Verifica se o navegador está totalmente offline
            if (navigator.onLine === false) {
                setProg(100, 'Dispositivo sem conexão de rede (Offline).');
                applyConnectivityVisualState('bad');
                document.getElementById('connDiagDownload').textContent = '0.0 Mbps';
                document.getElementById('connDiagUpload').textContent = '0.0 Mbps';
                document.getElementById('connDiagPing').textContent = 'Sem resposta';
                document.getElementById('connDiagJitter').textContent = '-- ms';
                document.getElementById('connDiagPacketLoss').textContent = '100 %';
                document.getElementById('connDiagTech').textContent = techInfo.label;
                document.getElementById('connDiagTechSub').textContent = techInfo.detail;
                document.getElementById('connDiagLastTime').textContent = 'Horário do último teste: ' + nowStr;
                document.getElementById('connSummaryDownPing').textContent = '0.0 Mbps / Offline';
                document.getElementById('connSummaryTech').textContent = techInfo.label;

                setTimeout(() => {
                    if (progBox) progBox.classList.add('hidden');
                    if (btn) btn.disabled = false;
                    if (txtBtn) txtBtn.textContent = 'Executar novo teste';
                    if (iconBtn) iconBtn.classList.remove('animate-spin');
                    if (sumBtn) sumBtn.disabled = false;
                    if (sumTxt) sumTxt.textContent = 'Novo Teste';
                    if (sumIcon) sumIcon.classList.remove('animate-spin');
                    azimuteConnTestRunning = false;
                }, 600);
                return;
            }

            // ETAPA 1: 5 Sondagens reais de Ping, Jitter e Perda de Pacotes via requisição HTTP sem cache
            const totalProbes = 5;
            const rtts = [];
            let failedProbes = 0;
            const latUse = azimuteLastGeoLat || -19.9162;
            const lonUse = azimuteLastGeoLon || -44.0809;

            for (let i = 0; i < totalProbes; i++) {
                setProg(Math.round(((i + 1) / (totalProbes + 2)) * 100), `Medindo Ping e pacotes (${i + 1}/${totalProbes})...`);
                const probeUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latUse}&longitude=${lonUse}&current=temperature_2m&_cb=${Date.now()}_${i}`;
                const ctrl = new AbortController();
                const timer = setTimeout(() =>ctrl.abort(), 4500);
                const t0 = performance.now();
                try {
                    const res = await fetch(probeUrl, { cache: 'no-store', signal: ctrl.signal });
                    clearTimeout(timer);
                    if (res.ok) {
                        await res.text();
                        const rtt = Math.max(1, Math.round(performance.now() - t0));
                        rtts.push(rtt);
                    } else {
                        failedProbes++;
                    }
                } catch (eProbe) {
                    clearTimeout(timer);
                    failedProbes++;
                }
            }

            const packetLossPct = Math.round((failedProbes / totalProbes) * 100);
            let avgPing = null;
            let jitterMs = null;

            if (rtts.length >0) {
                const sumRtt = rtts.reduce((a, b) =>a + b, 0);
                avgPing = Math.round(sumRtt / rtts.length);
                if (rtts.length >= 2) {
                    let diffSum = 0;
                    for (let k = 1; k < rtts.length; k++) {
                        diffSum += Math.abs(rtts[k] - rtts[k - 1]);
                    }
                    jitterMs = Math.round(diffSum / (rtts.length - 1));
                } else {
                    jitterMs = 0;
                }
            }

            // ETAPA 2: Medição real de Download (Mbps) baixando carga de dados real sem cache
            setProg(82, 'Medindo velocidade real de Download (Mbps)...');
            let measuredDownMbps = 0;
            try {
                const dlCtrl = new AbortController();
                const dlTimer = setTimeout(() =>dlCtrl.abort(), 7000);
                const dlUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latUse}&longitude=${lonUse}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,surface_pressure,cloud_cover&forecast_days=16&_cb=${Date.now()}`;
                const tStartDl = performance.now();
                const dlRes = await fetch(dlUrl, { cache: 'no-store', signal: dlCtrl.signal });
                if (dlRes.ok) {
                    const buf = await dlRes.arrayBuffer();
                    const elapsedSec = Math.max(0.005, (performance.now() - tStartDl) / 1000);
                    clearTimeout(dlTimer);
                    const bytes = buf.byteLength || 48000;
                    // Desconta metade de um RTT (handshake/TTFB) quando disponível para refletir a taxa de transferência pura do payload
                    const transferSec = avgPing ? Math.max(0.004, elapsedSec - (avgPing / 2000)) : elapsedSec;
                    measuredDownMbps = (bytes * 8) / (transferSec * 1000000);
                } else {
                    clearTimeout(dlTimer);
                }
            } catch (eDl) {}

            // ETAPA 3: Estimativa técnica de Upload (Mbps) via requisição + perfil de latência/link
            setProg(95, 'Calculando Upload estimado e consolidando diagnóstico...');
            let estimatedUpMbps = 0;
            if (measuredDownMbps >0) {
                const isMobileConn = techInfo.label.includes('4G') || techInfo.label.includes('3G') || techInfo.label.includes('2G');
                const upRatio = isMobileConn ? 0.38 : 0.52;
                const jitterPenalty = (jitterMs && jitterMs >50) ? 0.85 : 1.0;
                estimatedUpMbps = Math.max(0.1, measuredDownMbps * upRatio * jitterPenalty);
            }

            setProg(100, 'Diagnóstico concluído!');

            // Determinação do Estado Visual calibrada para rede móvel 4G/5G e Wi-Fi
            let finalState = 'bad';
            if (rtts.length === 0 || packetLossPct > 50 || measuredDownMbps < 0.6 || (avgPing !== null && avgPing > 650)) {
                finalState = 'bad';
            } else if (measuredDownMbps >= 1.8 && avgPing <= 320 && packetLossPct <= 20) {
                finalState = 'good';
            } else {
                finalState = 'moderate';
            }

            applyConnectivityVisualState(finalState);

            const downFmt = measuredDownMbps >0 ? measuredDownMbps.toFixed(1) + 'Mbps' : '0.0 Mbps';
            const upFmt = estimatedUpMbps >0 ? estimatedUpMbps.toFixed(1) + 'Mbps' : '0.0 Mbps';
            const pingFmt = avgPing !== null ? avgPing + 'ms' : 'Falha';
            const jitterFmt = jitterMs !== null ? jitterMs + 'ms' : '-- ms';
            const lossFmt = packetLossPct + ' %';

            document.getElementById('connDiagDownload').textContent = downFmt;
            document.getElementById('connDiagUpload').textContent = upFmt;
            document.getElementById('connDiagPing').textContent = pingFmt;
            document.getElementById('connDiagJitter').textContent = jitterFmt;
            document.getElementById('connDiagPacketLoss').textContent = lossFmt;
            document.getElementById('connDiagTech').textContent = techInfo.label;
            document.getElementById('connDiagTechSub').textContent = techInfo.detail;
            document.getElementById('connDiagLastTime').textContent = 'Horário do último teste: ' + nowStr;

            // Atualiza também o Card Resumido na tela principal da aba Geolocalização
            document.getElementById('connSummaryDownPing').textContent = (measuredDownMbps >0 ? measuredDownMbps.toFixed(1) + 'Mbps' : '-- Mbps') + ' / ' + pingFmt;
            document.getElementById('connSummaryTech').textContent = techInfo.label;

            if (false && typeof showToast === 'function') {
                const labelMap = { good: 'Conectividade BOA', moderate: 'Conectividade MODERADA', bad: 'Conectividade RUIM' };
                showToast(`${labelMap[finalState]} (${downFmt} • ${pingFmt})`);
            }

            setTimeout(() => {
                if (progBox) progBox.classList.add('hidden');
                if (btn) btn.disabled = false;
                if (txtBtn) txtBtn.textContent = 'Executar novo teste';
                if (iconBtn) iconBtn.classList.remove('animate-spin');
                azimuteConnTestRunning = false;
            }, 500);
        };

        window.openGridWeatherModal = function() {
            const modal = document.getElementById('gridQuickWeatherModal');
            if (modal) {
                modal.classList.remove('hidden');
                fetchRealtimeWeatherDetails(azimuteLastGeoLat, azimuteLastGeoLon);
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        };

        window.closeGridWeatherModal = function() {
            const modal = document.getElementById('gridQuickWeatherModal');
            if (modal) modal.classList.add('hidden');
        };

        function copyExactCoordinates() {
            const coords = document.getElementById('detailExactCoords') ? document.getElementById('detailExactCoords').textContent : '';
            if (typeof copyToClipboard === 'function') {
                copyToClipboard(coords);
            } else {
                navigator.clipboard.writeText(coords);
            }
        }

        function copyCurrentQth() {
            const street = document.getElementById('hudCurrentStreet').textContent;
            const sub = document.getElementById('hudCurrentSuburb').textContent;
            const coords = document.getElementById('detailExactCoords') ? document.getElementById('detailExactCoords').textContent : '';
            const radio = document.getElementById('hudRadioChannel').textContent;
            const fullQth = 'QTH: ' + street + ' (' + sub + ') | Coords: ' + coords + ' | ' + radio;
            if (typeof copyToClipboard === 'function') {
                copyToClipboard(fullQth);
            } else {
                navigator.clipboard.writeText(fullQth);
            }
        }

        function openPrioritySosModal() {
            document.getElementById('prioritySosModal').classList.remove('hidden');
            if (azimuteWatchId === null) startAzimuteLiveGps();
        }

        function closePrioritySosModal() {
            document.getElementById('prioritySosModal').classList.add('hidden');
        }

        // ABRE O MODAL COM DADOS DETALHADOS DO BATALHÃO / CIAS / BAIRROS AO CLICAR NA REDE NA BARRA DE STATUS

        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // FUNÇÃO PARA BAIXAR MAPA OFFLINE DE CADA ESTÁDIO (SVG/IMAGEM OFFLINE)
        window.downloadStadiumMap = function(stadiumId) {
            const mapMeta = {
                mineirao: { containerId: 'sub-min-mapa', filename: 'Mapa--Mineirao-AZIMUTE.svg', label: 'Mineirão' },
                arenamrv: { containerId: 'sub-mrv-mapa', filename: 'Mapa--ArenaMRV-AZIMUTE.svg', label: 'Arena MRV' },
                independencia: { containerId: 'sub-ind-mapa', filename: 'Mapa--Independencia-AZIMUTE.svg', label: 'Independência' }
            };
            const cfg = mapMeta[stadiumId];
            if (!cfg) return;
            const container = document.getElementById(cfg.containerId);
            const svgEl = container ? container.querySelector('svg') : null;
            if (!svgEl) {
                if (typeof showToast === 'function') showToast('Mapa não encontrado.');
                return;
            }
            const clone = svgEl.cloneNode(true);
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            const svgData = '<?xml version="1.0"encoding="UTF-8"?>\n' + clone.outerHTML;
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = cfg.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() =>URL.revokeObjectURL(url), 1500);
            if (typeof showToast === 'function') showToast('Mapa do ' + cfg.label + 'baixado para uso offline!');
        };

        // ALTERNADOR DOS 3 MODOS DE VISUALIZAÇÃO E PERSONALIZAÇÃO TOTAL (LOCALSTORAGE)
        const AZIMUTE_UI_SETTINGS_STORAGE_KEY = 'azimute_ui_settings_v3';

        const AZIMUTE_FOOTER_MIN_ACTIVE = 3;
        const AZIMUTE_FOOTER_MAX_ACTIVE = 7;

        const AZIMUTE_FOOTER_NAV_CATALOG = [
            { id: 'home', label: 'Início', icon: 'home', defaultEnabled: true },
            { id: 'regioes', label: 'Unid.', icon: 'shield', defaultEnabled: true },
            { id: 'gps', label: 'Mapa', icon: 'locate-fixed', defaultEnabled: true },
            { id: 'saude', label: 'APH', icon: 'cross', defaultEnabled: true },
            { id: 'estadios', label: 'Estád.', icon: 'trophy', defaultEnabled: true },
            { id: 'atalhos', label: 'Funções', icon: 'folder', defaultEnabled: true },
            { id: 'configuracoes', label: 'Ajustes', icon: 'settings', defaultEnabled: true }
        ];

        function getDefaultFooterButtonsConfig() {
            return AZIMUTE_FOOTER_NAV_CATALOG.map(item => ({
                id: item.id,
                enabled: item.defaultEnabled
            }));
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
                normalized.push({
                    id: entry.id,
                    enabled: Boolean(entry.enabled)
                });
            });
            AZIMUTE_FOOTER_NAV_CATALOG.forEach(c => {
                if (!seen.has(c.id)) {
                    normalized.push({ id: c.id, enabled: c.defaultEnabled });
                }
            });

            // Garante mínimo de 3 botões ativos e máximo de 7 botões ativos
            let activeCount = normalized.filter(x => x.enabled).length;
            if (activeCount < AZIMUTE_FOOTER_MIN_ACTIVE) {
                for (let i = 0; i < normalized.length && activeCount < AZIMUTE_FOOTER_MIN_ACTIVE; i++) {
                    if (!normalized[i].enabled) {
                        normalized[i].enabled = true;
                        activeCount++;
                    }
                }
            } else if (activeCount > AZIMUTE_FOOTER_MAX_ACTIVE) {
                for (let i = normalized.length - 1; i >= 0 && activeCount > AZIMUTE_FOOTER_MAX_ACTIVE; i--) {
                    if (normalized[i].enabled) {
                        normalized[i].enabled = false;
                        activeCount--;
                    }
                }
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
                    homeBlocksOrder: (function() {
                        const valid = ['search_box', 'quick_access', 'nearest_support'];
                        if (Array.isArray(parsed.homeBlocksOrder)) {
                            const filtered = parsed.homeBlocksOrder.filter(k => valid.includes(k));
                            // Se ainda não tinha 'search_box' salvo (migração da versão de 2 blocos), insere 'search_box' no TOPO (1º lugar)
                            if (!filtered.includes('search_box')) {
                                filtered.unshift('search_box');
                            }
                            valid.forEach(k => { if (!filtered.includes(k)) filtered.push(k); });
                            if (filtered.length === 3) return filtered;
                        }
                        return def.homeBlocksOrder;
                    })(),
                    enableRpasAutoFleetRec: parsed.enableRpasAutoFleetRec !== undefined ? Boolean(parsed.enableRpasAutoFleetRec) : def.enableRpasAutoFleetRec,
                    footerButtons: normalizeFooterButtonsConfig(parsed.footerButtons)
                };
            } catch (e) {
                return def;
            }
        }

        function saveAzimuteUiSettingsToStorage(settingsObj) {
            try {
                localStorage.setItem(AZIMUTE_UI_SETTINGS_STORAGE_KEY, JSON.stringify(settingsObj));
            } catch (e) {}
        }

        function getFooterCatIconHtml(item) {
            if (item.icon === 'settings') {
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-pmmg-gold shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
            }
            if (item.icon === 'cross') {
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-pmmg-gold shrink-0"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/></svg>`;
            }
            if (item.icon === 'drone') {
                return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-pmmg-gold shrink-0"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 9 5.5 5.5"/><path d="M15 9l3.5-3.5"/><path d="M9 15l-3.5 3.5"/><path d="M15 15l3.5 3.5"/><circle cx="4.5" cy="4.5" r="2.5"/><circle cx="19.5" cy="4.5" r="2.5"/><circle cx="4.5" cy="19.5" r="2.5"/><circle cx="19.5" cy="19.5" r="2.5"/></svg>`;
            }
            return `<i data-lucide="${item.icon}" class="w-4 h-4 text-pmmg-gold shrink-0"></i>`;
        }

        window.toggleAjustesSectionBox = function(secKey, forceOpen = null) {
            const boxEl = document.getElementById(`boxAjustesSec-${secKey}`);
            const lblEl = document.getElementById(`lblAjustesSec-${secKey}`);
            const icoEl = document.getElementById(`icoAjustesSec-${secKey}`);
            if (!boxEl) return;
            const willOpen = forceOpen !== null ? forceOpen : boxEl.classList.contains('hidden');
            if (willOpen) {
                boxEl.classList.remove('hidden');
                if (lblEl) lblEl.textContent = 'Fechar';
                if (icoEl) icoEl.style.transform = 'rotate(180deg)';
                if (secKey === 'acesso_rapido' && typeof renderQuickAccessCustomizerList === 'function') {
                    renderQuickAccessCustomizerList();
                } else if (secKey === 'rodape_topo' && typeof window.renderFooterButtonsCustomizerList === 'function') {
                    window.renderFooterButtonsCustomizerList();
                } else if (secKey === 'mapcache' && typeof window.azRefreshMapCacheStats === 'function') {
                    window.azRefreshMapCacheStats();
                }
            } else {
                boxEl.classList.add('hidden');
                if (lblEl) lblEl.textContent = 'Abrir';
                if (icoEl) icoEl.style.transform = 'rotate(0deg)';
            }
        };

        window.closeAllAjustesSectionBoxes = function() {
            ['drones', 'acesso_rapido', 'rodape_topo', 'modo_exibicao', 'mapcache', 'acordeao_global'].forEach(secKey => {
                window.toggleAjustesSectionBox(secKey, false);
            });
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
            if (badgeEl) {
                badgeEl.textContent = `${activeCount}/${AZIMUTE_FOOTER_MAX_ACTIVE} ativos (mín. ${AZIMUTE_FOOTER_MIN_ACTIVE} • máx. ${AZIMUTE_FOOTER_MAX_ACTIVE})`;
            }

            listEl.innerHTML = cfg.map((entry, idx) => {
                const item = catalogMap[entry.id];
                if (!item) return '';
                const isFirst = idx === 0;
                const isLast = idx === cfg.length - 1;
                const blockUncheck = entry.enabled && atMinLimit;
                const blockCheck = !entry.enabled && atMaxLimit;
                const isDisabled = blockUncheck || blockCheck;
                const lockHint = blockUncheck
                    ? ' (Mín. 3)'
                    : (blockCheck ? ' (Máx. 7)' : '');

                return `
                    <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl border ${entry.enabled ? 'bg-pmmg-black/90 border-pmmg-gold/50' : 'bg-pmmg-black/40 border-pmmg-border opacity-70'} transition-all">
                        <label class="flex items-center gap-2.5 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} select-none min-w-0 flex-1">
                            <input type="checkbox" ${entry.enabled ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} onchange="toggleFooterButtonEnabled('${item.id}')" class="w-4 h-4 rounded border-pmmg-border bg-pmmg-black text-pmmg-khaki focus:ring-pmmg-khaki accent-[#C5A869] ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} shrink-0">
                            <span class="text-[10px] font-mono text-gray-400 w-5 shrink-0">${idx + 1}º</span>
                            ${getFooterCatIconHtml(item)}
                            <span class="text-xs font-bold ${entry.enabled ? 'text-white' : 'text-gray-400'} truncate">${item.label}<span class="text-[10px] font-mono text-pmmg-khaki">${lockHint}</span></span>
                        </label>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveFooterButtonItem(${idx}, -1)" ${isFirst ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" title="Mover para esquerda">
                                ↑
                            </button>
                            <button type="button" onclick="moveFooterButtonItem(${idx}, 1)" ${isLast ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" title="Mover para direita">
                                ↓
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.toggleFooterButtonEnabled = function(btnId) {
            const s = getAzimuteUiSettings();
            const cfg = normalizeFooterButtonsConfig(s.footerButtons);
            const target = cfg.find(x => x.id === btnId);
            if (!target) return;

            const activeCount = cfg.filter(x => x.enabled).length;
            if (target.enabled && activeCount <= AZIMUTE_FOOTER_MIN_ACTIVE) {
                if (typeof showToast === 'function') {
                    showToast('Mínimo obrigatório de 3 botões ativos no rodapé.');
                }
                window.renderFooterButtonsCustomizerList();
                return;
            }
            if (!target.enabled && activeCount >= AZIMUTE_FOOTER_MAX_ACTIVE) {
                if (typeof showToast === 'function') {
                    showToast('Máximo permitido de 7 botões ativos no rodapé.');
                }
                window.renderFooterButtonsCustomizerList();
                return;
            }

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
            const temp = cfg[index];
            cfg[index] = cfg[newIdx];
            cfg[newIdx] = temp;
            s.footerButtons = cfg;
            saveAzimuteUiSettingsToStorage(s);
            window.applyAzimuteUiSettings();
            window.renderFooterButtonsCustomizerList();
        };

        window.toggleApoioCategoryBox = function(catKey, forceOpen = null) {
            const boxEl = document.getElementById(`boxApoioCat-${catKey}`);
            const lblEl = document.getElementById(`lblApoioCat-${catKey}`);
            const icoEl = document.getElementById(`icoApoioCat-${catKey}`);
            if (!boxEl) return;
            const willOpen = forceOpen !== null ? forceOpen : boxEl.classList.contains('hidden');
            if (willOpen) {
                boxEl.classList.remove('hidden');
                if (lblEl) lblEl.textContent = 'Fechar';
                if (icoEl) icoEl.style.transform = 'rotate(180deg)';
            } else {
                boxEl.classList.add('hidden');
                if (lblEl) lblEl.textContent = 'Abrir';
                if (icoEl) icoEl.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleApoioQcodeInnerBox = function(forceOpen = null) {
            const boxEl = document.getElementById('boxApoioQcodeInner');
            const lblEl = document.getElementById('lblApoioQcodeInner');
            const icoEl = document.getElementById('icoApoioQcodeInner');
            if (!boxEl) return;
            const willOpen = forceOpen !== null ? forceOpen : boxEl.classList.contains('hidden');
            if (willOpen) {
                boxEl.classList.remove('hidden');
                if (lblEl) lblEl.textContent = 'Fechar';
                if (icoEl) icoEl.style.transform = 'rotate(180deg)';
            } else {
                boxEl.classList.add('hidden');
                if (lblEl) lblEl.textContent = 'Abrir';
                if (icoEl) icoEl.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleApoioAjustesBox = function(forceOpen = null) {
            const bodyEl = document.getElementById('configuracoesMainContainer') || document.getElementById('apoioAjustesExpandableBody');
            const lblEl = document.getElementById('lblApoioAjustesToggle');
            const iconEl = document.getElementById('iconApoioAjustesChevron');
            if (!bodyEl) return;
            const willOpen = forceOpen !== null ? forceOpen : bodyEl.classList.contains('hidden');
            if (willOpen) {
                bodyEl.classList.remove('hidden');
                if (lblEl) lblEl.textContent = 'Fechar';
                if (iconEl) iconEl.style.transform = 'rotate(180deg)';
                window.syncAjustesInputsFromStorage();
                window.renderFooterButtonsCustomizerList();
                if (typeof renderQuickAccessCustomizerList === 'function') renderQuickAccessCustomizerList();
            } else {
                bodyEl.classList.add('hidden');
                if (lblEl) lblEl.textContent = 'Abrir';
                if (iconEl) iconEl.style.transform = 'rotate(0deg)';
            }
        };

        window.syncAjustesInputsFromStorage = function() {
            const s = getAzimuteUiSettings();
            const badgeMode = document.getElementById('ajustesCurrentModeBadge');
            if (badgeMode) {
                const modeLabel = s.manualMode === 'grid' ? 'GRID' : (s.manualMode === 'web' ? 'PC' : 'App');
                badgeMode.textContent = 'Modo Ativo: ' + modeLabel;
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

            const orderLbl = document.getElementById('lblHomeBlocksOrderStatus');
            if (orderLbl) {
                const firstIsQa = s.homeBlocksOrder[0] !== 'nearest_support';
                orderLbl.textContent = firstIsQa
                    ? 'Ordem: 1º Acesso Rápido • 2º Apoio (GPS)'
                    : 'Ordem: 1º Apoio (GPS) • 2º Acesso Rápido';
            }
        };

        window.applyAzimuteUiSettings = function() {
            const s = getAzimuteUiSettings();
            const isHome = (typeof azimuteCurrentViewId === 'undefined' || azimuteCurrentViewId === 'home');

            // 1. Botão Recarregar (Ícone no topo)
            const btnReload = document.getElementById('headerBtnReloadPage');
            if (btnReload) {
                btnReload.style.display = s.showReloadBtn ? '' : 'none';
            }

            // 2. Botão Tela Cheia (Ícone no topo)
            const btnFull = document.getElementById('btnHeaderFullscreen');
            if (btnFull) {
                btnFull.style.display = s.showFullscreenBtn ? '' : 'none';
            }

            // 3. Rede do Batalhão no Topo ("| 5º BPM A")
            const redeBtn = document.getElementById('statusBarBtnRede');
            const redePipe = document.getElementById('headerRedePipe');
            if (redeBtn) redeBtn.style.display = s.showHeaderRede ? '' : 'none';
            if (redePipe) redePipe.style.display = s.showHeaderRede ? '' : 'none';

            // 4. Botão Cruz Vermelha no Topo
            const hospBtn = document.getElementById('statusBarBtnHosp');
            if (hospBtn) hospBtn.style.display = s.showHeaderHospBtn ? '' : 'none';

            // 5. Barra de Localização (GPS | QTH)
            const statusBar = document.getElementById('operationalStatusBar');
            if (statusBar) {
                if (isHome && s.showStatusBarQth) {
                    statusBar.classList.remove('hidden');
                    statusBar.style.removeProperty('display');
                } else {
                    statusBar.classList.add('hidden');
                    statusBar.style.setProperty('display', 'none', 'important');
                }
            }

            // 6. Caixa de Pesquisa Global + Posição Dinâmica nos Blocos da Tela Inicial
            const searchBox = document.getElementById('homeSearchBoxContainer');
            const searchSlot = document.getElementById('homeSearchBlockSlot');
            if (searchBox) {
                if (isHome && s.showSearchBox) {
                    searchBox.classList.remove('hidden');
                    searchBox.style.removeProperty('display');
                } else {
                    searchBox.classList.add('hidden');
                    searchBox.style.setProperty('display', 'none', 'important');
                }
            }

            // 7. Blocos da Tela Inicial (Barra de Pesquisa, Acesso Rápido e Card de Proximidade/Apoio) + Ordem de Exibição
            const homeView = document.getElementById('view-home');
            const qaSection = document.getElementById('homeQuickAccessSection');
            const nsSection = document.getElementById('homeNearestSupportSection');
            const gridQaCard = document.getElementById('gridQuickAccessBlockCard');
            const gridNsCard = document.getElementById('gridNearestSupportBlockCard');

            if (qaSection) {
                qaSection.style.display = s.showQuickAccessBlock ? '' : 'none';
                qaSection.classList.add('w-full');
            }
            if (nsSection) {
                nsSection.style.display = s.showNearestSupportBlock ? '' : 'none';
                nsSection.classList.add('w-full');
            }
            if (searchSlot) {
                searchSlot.style.display = (isHome && s.showSearchBox) ? '' : 'none';
                if (searchBox && searchSlot && searchBox.parentElement !== searchSlot) {
                    searchSlot.appendChild(searchBox);
                }
            }
            if (gridQaCard) gridQaCard.style.display = s.showQuickAccessBlock ? '' : 'none';
            if (gridNsCard) gridNsCard.style.display = s.showNearestSupportBlock ? '' : 'none';

            const blockMap = {
                search_box: searchSlot,
                quick_access: qaSection,
                nearest_support: nsSection
            };
       const orderArr = ['search_box', ...(Array.isArray(s.homeBlockOrder) ? s.homeBlockOrder.filter(k => k !== 'search_box') : ['quick_access', 'nearest_support'])];
            if (homeView) {
                orderArr.forEach((key, idx) => {
                    const el = blockMap[key];
                    if (el) {
                        el.style.setProperty('order', String(idx + 1), 'important');
                        homeView.appendChild(el);
                    }
                });
            }

            const firstIsQa = orderArr.indexOf('quick_access') < orderArr.indexOf('nearest_support');
            const gridCol3 = document.getElementById('gridCol3Container');
            if (gridCol3 && gridQaCard && gridNsCard) {
                if (firstIsQa) {
                    gridCol3.insertBefore(gridQaCard, gridNsCard);
                } else {
                    gridCol3.insertBefore(gridNsCard, gridQaCard);
                }
            }

            if (typeof window.renderHomeBlocksOrderCustomizerList === 'function') {
                window.renderHomeBlocksOrderCustomizerList();
            }

            // 8. Botões do Rodapé (#mobileBottomNavGrid) — Visibilidade, Ordem Exata e Largura Autoajustável (3 a 7 botões)
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
                        btnEl.style.setProperty('display', 'flex', 'important');
                        btnEl.style.setProperty('width', '100%', 'important');
                        btnEl.style.setProperty('min-width', '0', 'important');
                        visibleCount++;
                    } else {
                        btnEl.classList.add('hidden');
                        btnEl.style.setProperty('display', 'none', 'important');
                    }
                });
                const cols = Math.min(AZIMUTE_FOOTER_MAX_ACTIVE, Math.max(AZIMUTE_FOOTER_MIN_ACTIVE, visibleCount));
                bottomGrid.style.setProperty('display', 'grid', 'important');
                bottomGrid.style.setProperty('width', '100%', 'important');
                bottomGrid.style.setProperty('grid-template-columns', `repeat(${cols}, minmax(0, 1fr))`, 'important');
            }

            window.syncAjustesInputsFromStorage();
        };

        window.updateAzimuteUiPreferenceFromInputs = function() {
            const s = getAzimuteUiSettings();
            const getChk = (id, fallback) => {
                const el = document.getElementById(id);
                return el ? Boolean(el.checked) : fallback;
            };
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
            const tmp = arr[index];
            arr[index] = arr[target];
            arr[target] = tmp;
            s.homeBlocksOrder = arr;
            saveAzimuteUiSettingsToStorage(s);
            window.applyAzimuteUiSettings();
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof showToast === 'function') showToast('Ordem dos blocos da Tela Inicial atualizada!');
        };

        window.toggleHomeBlockVisibilityByKey = function(key) {
            const s = getAzimuteUiSettings();
            if (key === 'search_box') s.showSearchBox = !s.showSearchBox;
            if (key === 'quick_access') s.showQuickAccessBlock = !s.showQuickAccessBlock;
            if (key === 'nearest_support') s.showNearestSupportBlock = !s.showNearestSupportBlock;
            saveAzimuteUiSettingsToStorage(s);
            window.syncAjustesInputsFromStorage();
            window.applyAzimuteUiSettings();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.renderHomeBlocksOrderCustomizerList = function() {
            const container = document.getElementById('ajustesHomeBlocksOrderList');
            const badge = document.getElementById('lblHomeBlocksOrderStatus');
            const s = getAzimuteUiSettings();
            const meta = {
                search_box: {
                    label: 'Barra de Pesquisa Global',
                    desc: 'Campo "Buscar rua, bairro, drone..."',
                    visible: s.showSearchBox
                },
                quick_access: {
                    label: 'Acesso Rápido',
                    desc: 'Grade de atalhos rápidos configuráveis',
                    visible: s.showQuickAccessBlock
                },
                nearest_support: {
                    label: 'Card de Proximidade / Apoio (GPS)',
                    desc: 'Unidade Policial, Hospital, Abastecimento e Comércios',
                    visible: s.showNearestSupportBlock
                }
            };
            const orderArr = Array.isArray(s.homeBlocksOrder) ? s.homeBlocksOrder : ['search_box', 'quick_access', 'nearest_support'];
            if (badge) {
                const shortNames = { search_box: 'Pesquisa', quick_access: 'Acesso Rápido', nearest_support: 'Apoio (GPS)' };
                badge.textContent = orderArr.map((k, i) => `${i + 1}º ${shortNames[k] || k}`).join(' • ');
            }
            if (!container) return;
            container.innerHTML = orderArr.map((key, idx) => {
                const info = meta[key] || { label: key, desc: '', visible: true };
                const isFirst = idx === 0;
                const isLast = idx === orderArr.length - 1;
                return `
                    <div class="bg-pmmg-black/85 p-3 rounded-xl border ${info.visible ? 'border-[#C5A869]/50' : 'border-pmmg-border opacity-70'} flex items-center justify-between gap-2.5">
                        <label class="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer select-none">
                            <input type="checkbox" ${info.visible ? 'checked' : ''} onchange="toggleHomeBlockVisibilityByKey('${key}')" class="w-4 h-4 rounded border-pmmg-border bg-pmmg-dark text-pmmg-khaki accent-[#C5A869] cursor-pointer shrink-0">
                            <div class="min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <span class="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#161616] text-pmmg-gold border border-[#C5A869]/40">${idx + 1}º</span>
                                    <strong class="text-xs font-extrabold text-white truncate">${info.label}</strong>
                                </div>
                                <span class="text-[10.5px] text-gray-400 block truncate mt-0.5">${info.desc}</span>
                            </div>
                        </label>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveHomeBlockOrder(${idx}, -1)" ${isFirst ? 'disabled' : ''} class="p-1.5 rounded-lg bg-[#161616] hover:bg-pmmg-cardHover disabled:opacity-30 text-pmmg-khaki border border-pmmg-border cursor-pointer" title="Subir posição">
                                <i data-lucide="arrow-up" class="w-3.5 h-3.5"></i>
                            </button>
                            <button type="button" onclick="moveHomeBlockOrder(${idx}, 1)" ${isLast ? 'disabled' : ''} class="p-1.5 rounded-lg bg-[#161616] hover:bg-pmmg-cardHover disabled:opacity-30 text-pmmg-khaki border border-pmmg-border cursor-pointer" title="Descer posição">
                                <i data-lucide="arrow-down" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        };

        window.invertHomeBlocksOrder = function() {
            window.moveHomeBlockOrder(0, 1);
        };

        window.saveAllAzimuteSettings = function(notify = true) {
            window.updateAzimuteUiPreferenceFromInputs();
            const s = getAzimuteUiSettings();
            saveAzimuteUiSettingsToStorage(s);
            const qaCfg = getQuickAccessConfig();
            saveQuickAccessConfig(qaCfg);
            renderQuickAccessGrid();
            renderQuickAccessCustomizerList();
            window.renderFooterButtonsCustomizerList();
            window.applyAzimuteUiSettings();
            if (typeof window.renderRpasFleetSelector === 'function') {
                window.renderRpasFleetSelector();
            }
            if (notify && typeof showToast === 'function') {
                showToast('Ajustes salvos permanentemente no aparelho!');
            }
        };

        window.resetAllAzimuteSettings = function() {
            const def = getDefaultAzimuteUiSettings();
            saveAzimuteUiSettingsToStorage(def);
            try {
                localStorage.removeItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY);
                localStorage.setItem('azimute_layout_mode', 'app');
            } catch (e) {}
            window.setLayoutMode('app', false);
            window.syncAjustesInputsFromStorage();
            window.applyAzimuteUiSettings();
            window.renderFooterButtonsCustomizerList();
            renderQuickAccessGrid();
            renderQuickAccessCustomizerList();
            if (typeof window.renderRpasFleetSelector === 'function') {
                window.renderRpasFleetSelector();
            }
            if (typeof showToast === 'function') {
                showToast('Todas as configurações foram restauradas para o padrão!');
            }
        };

        window.setLayoutMode = function(mode, notify = true) {
            const body = document.body;
            const btnApp = document.getElementById('btn-mode-app');
            const btnGrid = document.getElementById('btn-mode-grid');
            const btnWeb = document.getElementById('btn-mode-web');
            const topApp = document.getElementById('top-btn-mode-app');
            const topGrid = document.getElementById('top-btn-mode-grid');
            const topWeb = document.getElementById('top-btn-mode-web');
            const topActive = 'px-1.5 py-1 rounded font-extrabold bg-pmmg-card text-pmmg-khaki border border-pmmg-gold cursor-pointer';
            const topInactive = 'px-1.5 py-1 rounded font-semibold text-gray-400 hover:text-gray-200 border border-transparent cursor-pointer';
            if (topApp) topApp.className = mode === 'app' ? topActive : topInactive;
            if (topGrid) topGrid.className = mode === 'grid' ? topActive : topInactive;
            if (topWeb) topWeb.className = mode === 'web' ? topActive : topInactive;

            const inactiveCls = 'px-3 py-1.5 rounded-lg font-semibold text-gray-400 border border-transparent hover:text-gray-200 transition-all cursor-pointer';
            const activeCls = 'px-3 py-1.5 rounded-lg font-extrabold bg-pmmg-dark text-pmmg-khaki border border-pmmg-gold shadow-sm transition-all cursor-pointer';

            body.classList.remove('mode-app', 'mode-grid', 'mode-web');
            if (btnApp) btnApp.className = inactiveCls;
            if (btnGrid) btnGrid.className = inactiveCls;
            if (btnWeb) btnWeb.className = inactiveCls;

            const s = getAzimuteUiSettings();
            s.manualMode = mode;
            saveAzimuteUiSettingsToStorage(s);
            try {
                localStorage.setItem('azimute_layout_mode', mode);
            } catch (e) {}

            if (mode === 'web') {
                body.classList.add('mode-web');
                body.classList.remove('pc-sidebar-closed');
                if (btnWeb) btnWeb.className = activeCls;
                if (notify && typeof showToast === 'function') showToast('Modo PC ativado!');
            } else if (mode === 'grid') {
                body.classList.remove('pc-sidebar-closed', 'pc-sidebar-collapsed');
                body.classList.add('mode-grid');
                if (btnGrid) btnGrid.className = activeCls;
                if (typeof syncGridCockpitVisibility === 'function') syncGridCockpitVisibility(azimuteCurrentViewId || 'home');
                if (typeof renderQuickAccessGrid === 'function') renderQuickAccessGrid();
                window.dispatchEvent(new Event('resize'));
                if (notify && typeof showToast === 'function') showToast('Modo GRID ativado!');
            } else {
                body.classList.remove('pc-sidebar-closed', 'pc-sidebar-collapsed');
                body.classList.add('mode-app');
                if (btnApp) btnApp.className = activeCls;
                if (notify && typeof showToast === 'function') showToast('Modo App ativado!');
            }

            window.syncAjustesInputsFromStorage();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        // DATA E HORA EM TEMPO REAL DISCRETA QUANDO EM MODO TELA CHEIA
        function updateAzimuteFullscreenClock() {
            const now = new Date();
            const d = String(now.getDate()).padStart(2, '0');
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const y = now.getFullYear();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');

            const dEl = document.getElementById('fullscreenDateText');
            const tEl = document.getElementById('fullscreenTimeText');
            if (dEl) dEl.textContent = `${d}/${m}/${y}`;
            if (tEl) tEl.textContent = `${hh}:${mm}`;
        }
        setInterval(updateAzimuteFullscreenClock, 1000);

        let azimuteImmersiveMode = false;

        // MODO TELA CHEIA INSTANTÂNEO VIA CSS (SEM AVISO PRETO DO NAVEGADOR E SEM ATRASO)
        function isAzimuteCurrentlyFullscreen() {
            return azimuteImmersiveMode || !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
        }

        function updateFullscreenButtonsUi() {
            const isFull = isAzimuteCurrentlyFullscreen();
            document.body.classList.toggle('is-fullscreen', isFull);
            updateAzimuteFullscreenClock();

            const btnTop = document.getElementById('btnHeaderFullscreen');
            const iconTop = document.getElementById('iconHeaderFullscreen');
            if (iconTop) {
                iconTop.setAttribute('data-lucide', isFull ? 'minimize' : 'maximize');
            }
            if (btnTop) {
                btnTop.className = isFull
                    ? 'w-8 h-8 bg-pmmg-card hover:bg-pmmg-border text-pmmg-gold border border-pmmg-gold rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-sm'
                    : 'w-8 h-8 bg-pmmg-black hover:bg-pmmg-card text-pmmg-khaki border border-pmmg-border hover:border-pmmg-gold/50 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        document.addEventListener('DOMContentLoaded', () => {
            window.applyAzimuteUiSettings();
            const s = getAzimuteUiSettings();
            window.setLayoutMode(s.manualMode || 'app', false);
            updateAzimuteFullscreenClock();
            updateFullscreenButtonsUi();
        });

        let _azNativeFsActive = false;
        window.toggleAzimuteFullscreen = function(ev) {
            if (ev && typeof ev.stopPropagation === 'function') {
                ev.stopPropagation();
            }
            azimuteImmersiveMode = !azimuteImmersiveMode;
            try {
                if (azimuteImmersiveMode) {
                    const el = document.documentElement;
                    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                        if (el.requestFullscreen) el.requestFullscreen().then(() => { _azNativeFsActive = true; }).catch(() => {});
                        else if (el.webkitRequestFullscreen) { _azNativeFsActive = true; el.webkitRequestFullscreen(); }
                    }
                } else if (document.fullscreenElement || document.webkitFullscreenElement) {
                    _azNativeFsActive = false;
                    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                }
            } catch (e) {}
            updateFullscreenButtonsUi();
        };

        function handleNativeFullscreenChange() {
            const hasNative = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
            if (hasNative) {
                _azNativeFsActive = true;
                azimuteImmersiveMode = true;
            } else if (_azNativeFsActive) {
                _azNativeFsActive = false;
                azimuteImmersiveMode = false;
            }
            updateFullscreenButtonsUi();
        }
        document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);

        window.toggleGpsClosestHospitalBox = function(forceOpen = null) {
            const box = document.getElementById('gpsClosestHospitalExpandableBody');
            const lbl = document.getElementById('lblGpsClosestHospitalToggle');
            const icon = document.getElementById('iconGpsClosestHospitalChevron');
            if (!box) return;
            const shouldOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (shouldOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleOfflineMapsGuideBox = function(forceOpen = null) {
            const box = document.getElementById('offlineMapsGuideContent');
            const lbl = document.getElementById('lblOfflineMapsToggle');
            const icon = document.getElementById('iconOfflineMapsChevron');
            if (!box) return;
            const shouldOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (shouldOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };
        let compassInfoTipTimer = null;


        // ================= PERSONALIZAÇÃO DO ACESSO RÁPIDO (SALVO NO LOCALSTORAGE) =================
        const AZIMUTE_QUICK_ACCESS_STORAGE_KEY = 'azimute_quick_access_config_v1';

        const AZIMUTE_QUICK_ACCESS_CATALOG = [
            {
                id: 'geolocalizacao',
                label: 'Mapa',
                defaultEnabled: true,
                type: 'action',
                onClick: "showView('gps')",
                iconType: 'lucide',
                icon: 'locate-fixed'
            },
            {
                id: 'reds',
                label: 'REDS',
                defaultEnabled: true,
                type: 'link',
                href: 'https://api-sso.sids.mg.gov.br/authenticationendpoint/login.do?client_id=kT8uHiArnyXY4UrLHxYwEcaJsIUa&commonAuthCallerPath=%2Foauth2%2Fauthorize&forceAuth=false&passiveAuth=false&redirect_uri=https%3A%2F%2Fweb.sids.mg.gov.br%2Freds%2Findex.do&response_type=code&scope=openid&tenantDomain=carbon.super&sessionDataKey=0d7a6245-ae7c-4816-a15e-68d8167dfe8d&relyingParty=kT8uHiArnyXY4UrLHxYwEcaJsIUa&type=oidc&sp=REDS&isSaaSApp=false&authenticators=BasicAuthenticator%3ALOCAL',
                iconType: 'lucide',
                icon: 'file-text'
            },
            {
                id: 'imei',
                label: 'Consultar IMEI',
                defaultEnabled: true,
                type: 'link',
                href: 'https://www.consultaaparelhoimpedido.com.br/public-web/home?cid=174624',
                iconType: 'lucide',
                icon: 'smartphone'
            },
            {
                id: 'aph',
                label: 'APH',
                defaultEnabled: true,
                type: 'action',
                onClick: "showView('saude')",
                iconType: 'aph_svg'
            },
            {
                id: 'drones',
                label: 'Drones',
                defaultEnabled: true,
                type: 'action',
                onClick: "showView('rpas')",
                iconType: 'drone_svg'
            },
            {
                id: 'bnmp',
                label: 'BNMP',
                defaultEnabled: false,
                type: 'link',
                href: 'https://portalbnmp.cnj.jus.br/#/captcha/%2Fpesquisa-peca',
                iconType: 'lucide',
                icon: 'scale'
            },
            {
                id: 'codigos_q',
                label: 'Códigos Q',
                defaultEnabled: false,
                type: 'action',
                onClick: "toggleQCodeModal()",
                iconType: 'lucide',
                icon: 'radio'
            },
            {
                id: 'unidades',
                label: 'Unidades',
                defaultEnabled: false,
                type: 'action',
                onClick: "showView('regioes')",
                iconType: 'lucide',
                icon: 'shield'
            },
            {
                id: 'estadios',
                label: 'Estádios',
                defaultEnabled: false,
                type: 'action',
                onClick: "showView('estadios')",
                iconType: 'lucide',
                icon: 'trophy'
            },
            {
                id: 'ementario',
                label: 'Ementário',
                defaultEnabled: false,
                type: 'link',
                href: 'https://ementario.policiamilitar.mg.gov.br/principal',
                iconType: 'lucide',
                icon: 'book-open'
            },
            {
                id: 'viaturas',
                label: 'Viaturas',
                defaultEnabled: false,
                type: 'action',
                onClick: "showView('atalhos'); openViaturasManutencaoSubpage();",
                iconType: 'lucide',
                icon: 'wrench'
            },
            {
                id: 'assistente_reds',
                label: 'Assistente REDS',
                defaultEnabled: false,
                type: 'link',
                href: 'https://chatgpt.com/g/g-68a72c60b49081918fe5a2dbb207baae-policial-assistente-reds-pmmg',
                iconType: 'lucide',
                icon: 'pen-tool'
            },
            {
                id: 'sarpas',
                label: 'SARPAS',
                defaultEnabled: false,
                type: 'link',
                href: 'https://sarpas.decea.mil.br/login?expired=true',
                iconType: 'lucide',
                icon: 'plane'
            },
            {
                id: 'apoio',
                label: 'Apoio',
                defaultEnabled: false,
                type: 'action',
                onClick: "showView('atalhos')",
                iconType: 'lucide',
                icon: 'folder'
            }
        ];

        function getQuickAccessConfig() {
            const defaultList = AZIMUTE_QUICK_ACCESS_CATALOG.map(item => ({
                id: item.id,
                enabled: item.defaultEnabled
            }));
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
                        merged.push({
                            id: entry.id,
                            enabled: Boolean(entry.enabled)
                        });
                    }
                });

                AZIMUTE_QUICK_ACCESS_CATALOG.forEach(catItem => {
                    if (!seen.has(catItem.id)) {
                        merged.push({
                            id: catItem.id,
                            enabled: catItem.defaultEnabled
                        });
                    }
                });

                return merged;
            } catch (e) {
                return defaultList;
            }
        }

        function saveQuickAccessConfig(cfgList) {
            try {
                localStorage.setItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY, JSON.stringify(cfgList));
            } catch (e) {}
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
            AZIMUTE_QUICK_ACCESS_CATALOG.forEach(c => {
                if (c.id !== 'bussola') catalogMap[c.id] = c;
            });

            const enabledItems = cfg
                .filter(entry => entry.enabled && catalogMap[entry.id])
                .map(entry => catalogMap[entry.id]);

            if (enabledItems.length === 0) {
                const emptyHtml = `
                    <div class="bg-pmmg-dark border border-pmmg-border rounded-xl p-2.5 text-center text-xs text-gray-400">
                        Nenhum atalho ativo. Toque em <strong class="text-pmmg-khaki cursor-pointer underline" onclick="toggleQuickAccessCustomizer(true)">Personalizar</strong>.
                    </div>
                `;
                if (gridEl) { gridEl.className = 'grid grid-cols-1 gap-2'; gridEl.innerHTML = emptyHtml; }
                if (gridModeEl) { gridModeEl.className = 'grid grid-cols-1 gap-1.5'; gridModeEl.innerHTML = emptyHtml; }
                return;
            }

            const colCount = Math.min(Math.max(enabledItems.length, 1), 5);

            if (gridEl) {
                gridEl.className = `grid grid-cols-${colCount} gap-2 sm:gap-3`;
                const btnCls = 'aspect-square sm:aspect-auto sm:py-3.5 bg-pmmg-dark hover:bg-pmmg-card border border-pmmg-gold/40 hover:border-pmmg-gold rounded-xl flex flex-col items-center justify-center p-2 text-center transition-all active:scale-95 cursor-pointer group shadow';
                gridEl.innerHTML = enabledItems.map(item => {
                    const iconHtml = getQuickAccessIconHtml(item, false);
                    const labelHtml = `<span class="text-[9.5px] sm:text-xs font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full">${item.label}</span>`;
                    if (item.type === 'link') {
                        return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="${btnCls}">${iconHtml}${labelHtml}</a>`;
                    }
                    return `<button type="button" onclick="${item.onClick}" class="${btnCls}">${iconHtml}${labelHtml}</button>`;
                }).join('');
            }

            if (gridModeEl) {
                gridModeEl.className = `grid grid-cols-${colCount} gap-1.5`;
                const compactCls = 'py-2 px-1 bg-[#161616] hover:bg-pmmg-cardHover border border-[#C5A869]/40 hover:border-[#C5A869] rounded-lg flex flex-col items-center justify-center text-center transition-all active:scale-95 cursor-pointer group';
                gridModeEl.innerHTML = enabledItems.map(item => {
                    const iconHtml = getQuickAccessIconHtml(item, true);
                    const labelHtml = `<span class="text-[9px] font-bold text-gray-200 group-hover:text-pmmg-khaki leading-tight truncate w-full mt-1">${item.label}</span>`;
                    if (item.type === 'link') {
                        return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="${compactCls}">${iconHtml}${labelHtml}</a>`;
                    }
                    return `<button type="button" onclick="${item.onClick}" class="${compactCls}">${iconHtml}${labelHtml}</button>`;
                }).join('');
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
                const isFirst = idx === 0;
                const isLast = idx === cfg.length - 1;
                return `
                    <div class="flex items-center justify-between gap-2 p-2 rounded-xl border ${entry.enabled ? 'bg-pmmg-black/90 border-pmmg-gold/50' : 'bg-pmmg-black/40 border-pmmg-border opacity-70'} transition-all">
                        <label class="flex items-center gap-2.5 cursor-pointer select-none min-w-0 flex-1">
                            <input type="checkbox" ${entry.enabled ? 'checked' : ''} onchange="toggleQuickAccessItemEnabled('${item.id}')" class="w-4 h-4 rounded border-pmmg-border bg-pmmg-black text-pmmg-khaki focus:ring-pmmg-khaki accent-[#C5A869] cursor-pointer shrink-0">
                            <span class="text-[10px] font-mono text-gray-400 w-5 shrink-0">${idx + 1}º</span>
                            ${getQuickAccessIconHtml(item, true)}
                            <span class="text-xs font-bold ${entry.enabled ? 'text-white' : 'text-gray-400'} truncate">${item.label}</span>
                        </label>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveQuickAccessItem(${idx}, -1)" ${isFirst ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" title="Mover para cima / esquerda">
                                ↑
                            </button>
                            <button type="button" onclick="moveQuickAccessItem(${idx}, 1)" ${isLast ? 'disabled' : ''} class="px-2 py-1 rounded bg-pmmg-card hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-border text-[10px] font-extrabold ${isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}" title="Mover para baixo / direita">
                                ↓
                            </button>
                        </div>
                    </div>
                `;
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
            if (shouldOpen) {
                renderQuickAccessCustomizerList();
                panel.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
            } else {
                panel.classList.add('hidden');
                if (lbl) lbl.textContent = 'Personalizar';
            }
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
            const temp = cfg[index];
            cfg[index] = cfg[newIndex];
            cfg[newIndex] = temp;
            saveQuickAccessConfig(cfg);
            renderQuickAccessGrid();
            renderQuickAccessCustomizerList();
        };

        window.resetQuickAccessConfig = function() {
            try {
                localStorage.removeItem(AZIMUTE_QUICK_ACCESS_STORAGE_KEY);
            } catch (e) {}
            renderQuickAccessGrid();
            renderQuickAccessCustomizerList();
            if (typeof showToast === 'function') showToast('Acesso Rápido restaurado para o padrão.');
        };

        document.addEventListener('DOMContentLoaded', () => {
            renderQuickAccessGrid();
        });
        let azimuteCurrentViewId = 'home';

        function syncGridCockpitVisibility(viewId) {
            const gridCockpit = document.getElementById('gridModeTacticalCockpit');
            if (!gridCockpit) return;
            if (viewId === 'home') {
                gridCockpit.classList.add('grid-cockpit-active');
                gridCockpit.classList.remove('hidden');
                gridCockpit.style.removeProperty('display');
            } else {
                gridCockpit.classList.remove('grid-cockpit-active');
                gridCockpit.classList.add('hidden');
                gridCockpit.style.setProperty('display', 'none', 'important');
            }
        }

        function showView(viewId) {
            if (viewId === 'unidades') viewId = 'regioes';
            azimuteCurrentViewId = viewId;
if (viewId === 'gps' && window.azimuteGeoInvalidate) window.azimuteGeoInvalidate();
            // No Modo GRID (e geral), exibe os blocos superiores de Telemetria, Orientação e Copiar QTH (#gridModeTacticalCockpit) SOMENTE na Tela Início ('home')
            syncGridCockpitVisibility(viewId);

            // Exibe o cabeçalho superior e a barra GPS/QTH/Pesquisa SOMENTE na Tela Início ('home'), respeitando as preferências de Ajustes
            const mainTopHdr = document.getElementById('mainTopHeader');
            const topStatusBar = document.getElementById('operationalStatusBar');
            const searchContainer = document.getElementById('homeSearchBoxContainer');
            document.body.classList.toggle('has-home-header', viewId === 'home');
            if (!document.body.classList.contains('pwa-standalone') && ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true)) {
                document.body.classList.add('pwa-standalone');
            }
            if (viewId === 'home') {
                if (mainTopHdr) {
                    mainTopHdr.classList.remove('hidden');
                    mainTopHdr.style.removeProperty('display');
                }
                if (typeof window.applyAzimuteUiSettings === 'function') {
                    window.applyAzimuteUiSettings();
                } else {
                    if (topStatusBar) { topStatusBar.classList.remove('hidden'); topStatusBar.style.removeProperty('display'); }
                    if (searchContainer) { searchContainer.classList.remove('hidden'); searchContainer.style.removeProperty('display'); }
                }
            } else {
                if (mainTopHdr) {
                    mainTopHdr.classList.add('hidden');
                    mainTopHdr.style.setProperty('display', 'none', 'important');
                }
                if (topStatusBar) {
                    topStatusBar.classList.add('hidden');
                    topStatusBar.style.setProperty('display', 'none', 'important');
                }
                if (searchContainer) {
                    searchContainer.classList.add('hidden');
                    searchContainer.style.setProperty('display', 'none', 'important');
                }
            }
            const views = ['home', 'regioes', 'rpm1', 'rpm2', 'rpm3', 'especializadas', 'estadios', 'rpas', 'atalhos', 'saude', 'skeleton', '18bpm', 'gps', 'configuracoes'];
            views.forEach(v => {
                const el = document.getElementById(`view-${v}`);
                if (el) {
                    el.classList.add('hidden');
                    el.classList.remove('azimute-active-view', 'app-screen-animate');
                    el.style.setProperty('display', 'none', 'important');
                }
            });

            // Fecha subpáginas/modais flutuantes ao trocar de aba principal
            ['geoDetailsCard', 'geoConnectivitySubpage', 'offlineAphProtocolModal', 'viaturasManutencaoSubpage', 'gridQuickWeatherModal'].forEach(mId => {
                const mEl = document.getElementById(mId);
                if (mEl) mEl.classList.add('hidden');
            });

            // Garante que o HUD de GPS apareça exclusivamente na aba 'gps'
            const gpsHud = document.getElementById('azimuteLiveGpsHud');
            if (gpsHud) {
                if (viewId === 'gps') {
                    gpsHud.classList.remove('hidden');
                    // Mantém TODAS as caixas de Mapa fechadas por padrão ao abrir a aba
                    const geoBody = document.getElementById('azGeoDrawerBody');
                    const geoBtn = document.getElementById('azGeoDrawerToggle');
                    const geoArr = document.getElementById('azGeoDrawerArrow');
                    if (geoBody && !document.body.classList.contains('az-map-expanded')) {
                        geoBody.classList.remove('is-open');
                        if (geoBtn) geoBtn.setAttribute('aria-expanded', 'false');
                        if (geoArr) geoArr.textContent = 'ABRIR +';
                    }
                    if (typeof window.toggleGeoWeatherBox === 'function') window.toggleGeoWeatherBox(false);
                    if (typeof window.toggleGeoConnectivityBox === 'function') window.toggleGeoConnectivityBox(false);
                    if (typeof window.toggleGpsClosestHospitalBox === 'function') window.toggleGpsClosestHospitalBox(false);
                    if (typeof window.toggleDigitalCompassBox === 'function') window.toggleDigitalCompassBox(false);
                    if (typeof window.toggleOfflineMapsGuideBox === 'function') window.toggleOfflineMapsGuideBox(false);
                    if (typeof window.azScheduleAutoSectorPrecache === 'function') window.azScheduleAutoSectorPrecache();
                } else {
                    gpsHud.classList.add('hidden');
                }
            }

            if (viewId === 'regioes' || viewId === 'rpm1' || viewId === 'rpm2' || viewId === 'rpm3' || viewId === 'especializadas') {
                window._azLastUnitListView = viewId;
                if (viewId === 'rpm1' && typeof window.azSyncRpm1BattalionCards === 'function') {
                    window.azSyncRpm1BattalionCards();
                }
            }
            if (viewId === 'saude') {
                if (typeof window.toggleSaudeSmartHospitalBox === 'function') window.toggleSaudeSmartHospitalBox(false);
                if (typeof window.toggleOfflineAphGuideBox === 'function') window.toggleOfflineAphGuideBox(false);
                if (typeof window.toggleAphMarchProtocolBox === 'function') window.toggleAphMarchProtocolBox(false);
                if (typeof window.toggleRcpMetronomeModuleBox === 'function') window.toggleRcpMetronomeModuleBox(false);
                if (typeof window.toggleSaudeAssistantIaBox === 'function') window.toggleSaudeAssistantIaBox(false);
                if (typeof window.toggleSaudeHospitalNetworkListBox === 'function') window.toggleSaudeHospitalNetworkListBox(false);
            } else if (viewId === 'rpas') {
                if (typeof window.renderRpasFleetSelector === 'function') window.renderRpasFleetSelector();
                if (typeof window.toggleRpasFleetSelectorBox === 'function') window.toggleRpasFleetSelectorBox(false);
                if (typeof window.toggleRpasSpecsDetailsSubtab === 'function') window.toggleRpasSpecsDetailsSubtab(false);
                if (typeof window.toggleRpasAircraftDataBox === 'function') window.toggleRpasAircraftDataBox(false);
                if (typeof window.toggleRpasFlightParamsBox === 'function') window.toggleRpasFlightParamsBox(false);
                if (typeof window.toggleRpasChecklistBox === 'function') window.toggleRpasChecklistBox(false);
                if (typeof window.toggleRpasPilotMaterialsBox === 'function') window.toggleRpasPilotMaterialsBox(false);
            } else if (viewId === 'configuracoes') {
                if (typeof window.closeAllAjustesSectionBoxes === 'function') window.closeAllAjustesSectionBoxes();
                if (typeof window.syncAjustesInputsFromStorage === 'function') window.syncAjustesInputsFromStorage();
                if (typeof window.renderFooterButtonsCustomizerList === 'function') window.renderFooterButtonsCustomizerList();
                if (typeof renderQuickAccessCustomizerList === 'function') renderQuickAccessCustomizerList();
            }

            const target = document.getElementById(`view-${viewId}`);
            if (target) {
                target.classList.remove('hidden');
                target.classList.add('azimute-active-view');
                target.style.setProperty('display', 'block', 'important');
                void target.offsetWidth;
                target.classList.add('app-screen-animate');
            }
            if (viewId === 'gps' && typeof initAzimuteGeo === 'function') {
                setTimeout(function () {
                    initAzimuteGeo();
                    ['azGeoLayersBox', 'azGeoMunBox', 'azGeoCfgBox', 'azGeoRouteBox'].forEach(function (bid) {
                        const bx = document.getElementById(bid);
                        if (bx) bx.classList.remove('is-open');
                    });
                    const gm = window.azGeoMap;
                    const tPos = window.azimuteTacState && window.azimuteTacState.myPos;
                    const latC = (tPos && typeof tPos.lat === 'number') ? tPos.lat : (typeof azimuteLastGeoLat === 'number' ? azimuteLastGeoLat : null);
                    const lngC = (tPos && typeof tPos.lng === 'number') ? tPos.lng : (typeof azimuteLastGeoLon === 'number' ? azimuteLastGeoLon : null);
                    if (gm && latC !== null && lngC !== null && typeof gm.jumpTo === 'function') {
                        gm.jumpTo({ center: [lngC, latC], zoom: Math.max(gm.getZoom ? gm.getZoom() : 14, 15.2) });
                    }
                }, 30);
            }

            const isRegiaoSub = ['regioes', 'rpm1', 'rpm2', 'rpm3', '18bpm', 'skeleton', 'especializadas'].includes(viewId);

            // Atualiza Barra de Navegação Superior (#topNavBar) com visual escuro/sóbrio e bordas finas em dourado/cáqui
            const topNavMap = {
                home: 'nav-btn-home',
                regioes: 'nav-btn-regioes',
                saude: 'nav-btn-saude',
                rpas: 'nav-btn-rpas',
                atalhos: 'nav-btn-atalhos',
                gps: 'nav-btn-gps',
                especializadas: 'nav-btn-especializadas',
                estadios: 'nav-btn-estadios',
                configuracoes: 'nav-btn-configuracoes'
            };
            Object.entries(topNavMap).forEach(([k, btnId]) => {
                const btn = document.getElementById(btnId);
                if (!btn) return;
                const active = (k === viewId) || (k === 'regioes' && ['regioes', 'rpm1', 'rpm2', 'rpm3', '18bpm', 'skeleton'].includes(viewId));
                btn.className = active
                    ? 'px-3 py-1.5 rounded-md bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-1.5 shadow-sm'
                    : 'px-3 py-1.5 rounded-md bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-semibold flex items-center gap-1.5';
            });

            // Atualiza o Menu Global Inferior de 7 Abas (Início, Regiões, Geolocalização, Estádios, Saúde/APH, Drones, Apoio) - Escuro/Sóbrio sem blocos chapados
            ['home', 'regioes', 'gps', 'estadios', 'saude', 'atalhos', 'configuracoes'].forEach(id => {
                const bBtn = document.getElementById(`bnav-${id}`);
                if (!bBtn) return;
                const isActive = (id === viewId) || (id === 'regioes' && isRegiaoSub);
                if (isActive) {
                    bBtn.classList.add('bnav-active');
                } else {
                    bBtn.classList.remove('bnav-active');
                }
            });

            const activeBadge = document.getElementById('activeUnitBadge');
            const activeName = document.getElementById('activeUnitName');

            if (viewId === 'home') {
                if (activeBadge) activeBadge.classList.add('hidden');
            } else if (isRegiaoSub) {
                if (viewId === '18bpm') {
                    if (activeBadge) activeBadge.classList.remove('hidden');
                    if (activeName) activeName.textContent = '18º BPM (Contagem)';
                    switch18Tab('cias');
                } else {
                    if (activeBadge) activeBadge.classList.add('hidden');
                }
            } else if (viewId === 'saude') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'APH';
            } else if (viewId === 'gps') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'Mapa';
                const dBody = document.getElementById('azGeoDrawerBody');
                const dArrow = document.getElementById('azGeoDrawerArrow');
                if (dBody && !dBody.classList.contains('is-open')) {
                    dBody.classList.add('is-open');
                    if (dArrow) dArrow.textContent = 'FECHAR -';
                }
                if (window.azimuteGeoInvalidate) setTimeout(window.azimuteGeoInvalidate, 80);
            } else if (viewId === 'estadios') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'Estádios';
                backToEstadiosLobby();
            } else if (viewId === 'rpas') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'Drones / RPAS';
                if (typeof window.toggleRpasFlightParamsBox === 'function') window.toggleRpasFlightParamsBox(false);
                if (typeof window.toggleRpasChecklistBox === 'function') window.toggleRpasChecklistBox(false);
                if (typeof window.toggleRpasAircraftDataBox === 'function') window.toggleRpasAircraftDataBox(false);
            } else if (viewId === 'atalhos') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'Funções';
                if (typeof window.toggleApoioCategoryBox === 'function') {
                    window.toggleApoioCategoryBox('abordagem', false);
                    window.toggleApoioCategoryBox('registro', false);
                    window.toggleApoioCategoryBox('gestao', false);
                    window.toggleApoioCategoryBox('viaturas', false);
                }
                if (typeof window.toggleApoioQcodeInnerBox === 'function') {
                    window.toggleApoioQcodeInnerBox(false);
                }
                if (typeof window.syncAjustesInputsFromStorage === 'function') {
                    window.syncAjustesInputsFromStorage();
                }
            } else if (viewId === 'configuracoes') {
                if (activeBadge) activeBadge.classList.remove('hidden');
                if (activeName) activeName.textContent = 'Ajustes';
                if (typeof window.syncAjustesInputsFromStorage === 'function') {
                    window.syncAjustesInputsFromStorage();
                }
                if (typeof window.renderFooterButtonsCustomizerList === 'function') {
                    window.renderFooterButtonsCustomizerList();
                }
                if (typeof renderQuickAccessCustomizerList === 'function') {
                    renderQuickAccessCustomizerList();
                }
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }

            // Atualiza estado visual dos itens na Sidebar do Modo PC (#pcSidebar) - Escuro e sóbrio com linha fina dourada/cáqui
            const pcItems = ['home', 'saude', 'rpas', 'atalhos', 'gps', 'estadios'];
            pcItems.forEach(id => {
                const btn = document.getElementById(`pcsb-btn-${id}`);
                if (!btn) return;
                if (id === viewId) {
                    btn.className = 'pc-sb-item w-full px-3 py-2.5 rounded-xl bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-3 transition-all';
                } else {
                    btn.className = 'pc-sb-item w-full px-3 py-2.5 rounded-xl bg-pmmg-dark hover:bg-pmmg-card text-gray-300 border border-pmmg-border font-bold flex items-center gap-3 transition-all';
                }
            });

            const grpRegioes = document.getElementById('pcsb-group-regioes');
            const subRpm1 = document.getElementById('pcsb-sub-rpm1');
            const subRpm2 = document.getElementById('pcsb-sub-rpm2');
            const subEsp = document.getElementById('pcsb-sub-especializadas');

            if (grpRegioes) {
                grpRegioes.className = isRegiaoSub
                    ? 'flex items-center rounded-xl bg-pmmg-card border border-pmmg-gold overflow-hidden transition-all'
                    : 'flex items-center rounded-xl bg-pmmg-dark border border-pmmg-border overflow-hidden transition-all';
            }
            if (subRpm1) {
                subRpm1.className = (viewId === 'rpm1')
                    ? 'flex-1 px-2.5 py-2 text-left text-[11px] font-extrabold text-pmmg-khaki flex items-center gap-2 truncate'
                    : 'flex-1 px-2.5 py-2 text-left text-[11px] font-bold text-gray-300 hover:text-pmmg-khaki flex items-center gap-2 truncate';
            }
            if (subRpm2) {
                subRpm2.className = (viewId === 'rpm2' || viewId === '18bpm')
                    ? 'flex-1 px-2.5 py-2 text-left text-[11px] font-extrabold text-pmmg-gold flex items-center gap-2 truncate'
                    : 'flex-1 px-2.5 py-2 text-left text-[11px] font-bold text-gray-300 hover:text-pmmg-gold flex items-center gap-2 truncate';
            }
            if (subEsp) {
                subEsp.className = (viewId === 'especializadas')
                    ? 'w-full px-2.5 py-2 rounded-lg bg-pmmg-card border border-pmmg-gold text-left text-[11px] font-extrabold text-pmmg-khaki flex items-center gap-2 transition-all'
                    : 'w-full px-2.5 py-2 rounded-lg bg-pmmg-dark/90 border border-pmmg-border/80 hover:border-pmmg-khaki/50 text-left text-[11px] font-bold text-gray-300 hover:text-pmmg-khaki flex items-center gap-2 transition-all';
            }

            const sbActiveUnit = document.getElementById('pcSidebarActiveUnit');
            if (sbActiveUnit) {
                sbActiveUnit.textContent = (activeName && !activeBadge?.classList.contains('hidden')) ? activeName.textContent : 'Painel Geral';
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // FUNÇÕES DE CONTROLE DO MENU LATERAL RETRÁTIL (MODO PC) E ACORDEÃO DE SUBPASTAS
        window.togglePcSidebarCollapse = function() {
            const body = document.body;
            body.classList.remove('pc-sidebar-closed');
            body.classList.toggle('pc-sidebar-collapsed');
            const isCollapsed = body.classList.contains('pc-sidebar-collapsed');
            const icon = document.getElementById('iconPcSidebarToggle');
            const txt = document.getElementById('txtPcSidebarToggle');
            if (icon) {
                icon.setAttribute('data-lucide', isCollapsed ? 'panel-left-open' : 'panel-left-close');
            }
            if (txt) {
                txt.textContent = isCollapsed ? 'Expandir' : 'Recolher';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.closePcSidebarCompletely = function() {
            const body = document.body;
            body.classList.remove('pc-sidebar-collapsed');
            body.classList.add('pc-sidebar-closed');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.openPcSidebarCompletely = function() {
            const body = document.body;
            body.classList.remove('pc-sidebar-closed', 'pc-sidebar-collapsed');
            const icon = document.getElementById('iconPcSidebarToggle');
            const txt = document.getElementById('txtPcSidebarToggle');
            if (icon) icon.setAttribute('data-lucide', 'panel-left-close');
            if (txt) txt.textContent = 'Recolher';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.togglePcRegioesAccordion = function(ev) {
            if (ev) ev.stopPropagation();
            if (document.body.classList.contains('pc-sidebar-collapsed')) {
                document.body.classList.remove('pc-sidebar-collapsed');
            }
            const sub = document.getElementById('pcsb-regioes-subfolders');
            const arrow = document.getElementById('pcsb-regioes-arrow');
            if (!sub) return;
            sub.classList.toggle('hidden');
            if (arrow) {
                arrow.style.transform = sub.classList.contains('hidden') ? 'rotate(-90deg)' : 'rotate(0deg)';
            }
        };

        window.handlePcSidebarRegioesClick = function() {
            if (document.body.classList.contains('pc-sidebar-collapsed')) {
                document.body.classList.remove('pc-sidebar-collapsed');
            }
            const sub = document.getElementById('pcsb-regioes-subfolders');
            const arrow = document.getElementById('pcsb-regioes-arrow');
            if (sub && sub.classList.contains('hidden')) {
                sub.classList.remove('hidden');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
            showView('regioes');
        };

        window.togglePcSubfolderUnits = function(rpmKey, ev) {
            if (ev) ev.stopPropagation();
            const listEl = document.getElementById(`pcsb-units-${rpmKey}`);
            const arrowEl = document.getElementById(`pcsb-arrow-${rpmKey}`);
            if (!listEl) return;
            listEl.classList.toggle('hidden');
            if (arrowEl) {
                arrowEl.style.transform = listEl.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        };

        // ABRE O ESTÁDIO EM UMA NOVA TELA (COMO NOS BATALHÕES) PARA NÃO PARECER ESTÁTICO NO CELULAR
        window.toggleStadiumCollapsibleBox = function(boxKey, forceOpen = null) {
            const box = document.getElementById('box-stag-' + boxKey);
            const lbl = document.getElementById('lbl-stag-' + boxKey);
            const ico = document.getElementById('ico-stag-' + boxKey);
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (ico) ico.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (ico) ico.style.transform = 'rotate(0deg)';
            }
        };

        function closeAllStadiumInternalBoxes() {
            ['fluxo-mineirao', 'fluxo-arenamrv', 'fluxo-independencia'].forEach(k => {
                window.toggleStadiumCollapsibleBox(k, false);
            });
            ['min', 'mrv', 'ind'].forEach(prefix => {
                document.querySelectorAll(`.sub-${prefix}-content`).forEach(el => el.classList.add('hidden'));
                document.querySelectorAll(`.nav-${prefix}-tab`).forEach(el => {
                    el.className = `nav-${prefix}-tab px-4 py-2 rounded-lg bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-medium flex items-center gap-1.5`;
                });
            });
        }

        function openStadiumScreen(stadiumId) {
            const lobby = document.getElementById('estadios-lobby-screen');
            const topbar = document.getElementById('estadios-detail-topbar');
            if (lobby) lobby.classList.add('hidden');
            if (topbar) topbar.classList.remove('hidden');

            document.querySelectorAll('.estadio-panel').forEach(el => {
                el.classList.add('hidden');
                el.classList.remove('app-screen-animate');
            });

            // Mantém o card Fluxo de Torcedores e todas as sub-abas fechados por padrão ao abrir o estádio
            closeAllStadiumInternalBoxes();

            const target = document.getElementById(`estadio-content-${stadiumId}`);
            if (target) {
                target.classList.remove('hidden');
                void target.offsetWidth;
                target.classList.add('app-screen-animate');
            }

            const pMin = document.getElementById('pill-estadio-mineirao');
            const pMrv = document.getElementById('pill-estadio-arenamrv');
            const pInd = document.getElementById('pill-estadio-independencia');
            if (pMin) pMin.className = stadiumId === 'mineirao' ? 'px-2.5 py-1.5 rounded-lg text-xs font-extrabold border border-pmmg-gold bg-pmmg-card text-pmmg-khaki shadow-sm' : 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-pmmg-border bg-pmmg-dark text-gray-400';
            if (pMrv) pMrv.className = stadiumId === 'arenamrv' ? 'px-2.5 py-1.5 rounded-lg text-xs font-extrabold border border-pmmg-gold bg-pmmg-card text-pmmg-khaki shadow-sm' : 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-pmmg-border bg-pmmg-dark text-gray-400';
            if (pInd) pInd.className = stadiumId === 'independencia' ? 'px-2.5 py-1.5 rounded-lg text-xs font-extrabold border border-pmmg-gold bg-pmmg-card text-pmmg-khaki shadow-sm' : 'px-2.5 py-1.5 rounded-lg text-xs font-medium border border-pmmg-border bg-pmmg-dark text-gray-400';

            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function backToEstadiosLobby() {
            const lobby = document.getElementById('estadios-lobby-screen');
            const topbar = document.getElementById('estadios-detail-topbar');
            document.querySelectorAll('.estadio-panel').forEach(el =>el.classList.add('hidden'));
            if (topbar) topbar.classList.add('hidden');
            if (lobby) {
                lobby.classList.remove('hidden');
                void lobby.offsetWidth;
                lobby.classList.add('app-screen-animate');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function switchEstadio(stadiumId) {
            openStadiumScreen(stadiumId);
        }

        function selectStadium(stadiumId) {
            openStadiumScreen(stadiumId);
        }

        function switchMineiraoTab(tabId, forceOpen = null) {
            const target = document.getElementById(`sub-min-${tabId}`);
            const isCurrentlyOpen = target && !target.classList.contains('hidden');
            const shouldOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

            document.querySelectorAll('.sub-min-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-min-tab').forEach(el => {
                el.className = 'nav-min-tab px-4 py-2 rounded-lg bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-medium flex items-center gap-1.5';
            });

            if (shouldOpen && target) {
                target.classList.remove('hidden');
                const activeBtn = document.getElementById(`tab-min-${tabId}`);
                if (activeBtn) {
                    activeBtn.className = 'nav-min-tab px-4 py-2 rounded-lg bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-1.5';
                }
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function switchArenaMrvTab(tabId, forceOpen = null) {
            const target = document.getElementById(`sub-mrv-${tabId}`);
            const isCurrentlyOpen = target && !target.classList.contains('hidden');
            const shouldOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

            document.querySelectorAll('.sub-mrv-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-mrv-tab').forEach(el => {
                el.className = 'nav-mrv-tab px-4 py-2 rounded-lg bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-medium flex items-center gap-1.5';
            });

            if (shouldOpen && target) {
                target.classList.remove('hidden');
                const activeBtn = document.getElementById(`tab-mrv-${tabId}`);
                if (activeBtn) {
                    activeBtn.className = 'nav-mrv-tab px-4 py-2 rounded-lg bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-1.5';
                }
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function switchIndependenciaTab(tabId, forceOpen = null) {
            const target = document.getElementById(`sub-ind-${tabId}`);
            const isCurrentlyOpen = target && !target.classList.contains('hidden');
            const shouldOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

            document.querySelectorAll('.sub-ind-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.nav-ind-tab').forEach(el => {
                el.className = 'nav-ind-tab px-4 py-2 rounded-lg bg-pmmg-dark text-gray-400 border border-pmmg-border hover:text-gray-200 font-medium flex items-center gap-1.5';
            });

            if (shouldOpen && target) {
                target.classList.remove('hidden');
                const activeBtn = document.getElementById(`tab-ind-${tabId}`);
                if (activeBtn) {
                    activeBtn.className = 'nav-ind-tab px-4 py-2 rounded-lg bg-pmmg-card text-pmmg-khaki border border-pmmg-gold font-extrabold flex items-center gap-1.5';
                }
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }


        // ============================================================================
        // MOTOR DE BUSCA INTELIGENTE, SEMÂNTICO E AUTO-ATUALIZÁVEL (INDEXAÇÃO DO DOM)
        // ============================================================================

        // Normaliza texto removendo acentos e caracteres especiais para comparação precisa
        function normalizeSearchText(str) {
            return (str || '')
                .toString()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim();
        }

        // Dicionário inteligente de sinônimos gerais (associa intenção do policial aos termos técnicos)
        const SMART_SYNONYM_GROUPS = [
            {
                label: 'Abastecimento & Combustível',
                triggers: ['gasolina', 'combustivel', 'diesel', 'etanol', 'alcool', 'posto', 'abastecer', 'abastecimento', 'bomba', 'tanque', 'frota'],
                expandTo: ['abastecimento', 'posto', 'frota', 'rotam', '2º bbm', '18º bpm']
            },
            {
                label: 'Drones / Aeronaves Remotamente Pilotadas (RPAS)',
                triggers: ['drone', 'drones', 'rpas', 'arp', 'mavic', 'dji', 'voo', 'voar', 'piloto', 'sarpas', 'decea', 'aeronave', 'espaco aereo', 'altura', 'sinal', 'colisao'],
                expandTo: ['drone', 'rpas', 'aeronaves remotamente pilotadas', 'sarpas', 'mavic', 'pilotos', 'fluxo aereo']
            },
            {
                label: 'BNMP • Mandados de Prisão',
                triggers: ['bn', 'bnmp', 'mandado', 'prisao', 'foragido', 'captura', 'alvara', 'cnj'],
                expandTo: ['bnmp', 'mandados de prisao', 'cnj']
            },
            {
                label: 'Consulta IMEI • Aparelho Celular',
                triggers: ['imei', 'celular', 'aparelho', 'telefone roubado', 'impedido', 'anatel', '*#06#', '06#'],
                expandTo: ['consulta imei', 'aparelhos impedidos', '*#06#', 'anatel']
            },
            {
                label: 'Sistema REDS & Assistente de Histórico',
                triggers: ['reds', 'bo', 'b.o', 'boletim', 'ocorrencia', 'sids', 'historico', 'redacao', 'ia', 'gpt'],
                expandTo: ['sistema reds', 'assistente reds', 'boletim de ocorrencia', 'sids']
            },
            {
                label: 'Sistemas PMMG (Intranet, SIGOP, Hélios, Stelecom, Ementário, DIAO)',
                triggers: ['intranet', 'sigop', 'escala', 'helios', 'placa', 'lpr', 'camera', 'stelecom', 'ramal', 'ementario', 'natureza', 'diao'],
                expandTo: ['intranet', 'sigop', 'helios', 'stelecom', 'ementario', 'diao']
            },
            {
                label: 'Unidades Especializadas (GER, ROTAM, BOPE, Choque, ROCCA, BEPE, Cavalaria, Rodoviária, Meio Ambiente)',
                triggers: ['ger', 'rotam', 'bope', 'choque', 'bpchq', 'rocca', 'cao', 'caes', 'cachorro', 'canil', 'faro', 'bepe', 'cavalaria', 'rcat', 'cavalo', 'rodoviaria', 'bpmrv', 'meio ambiente', 'ambiental', 'mamb', 'bpgd', 'guarda'],
                expandTo: ['batalhao ger', 'batalhao rotam', 'bope', 'bpchq', 'rocca', 'bepe', 'rcat', 'bpmrv', 'bpm mamb', 'bpgd']
            },
            {
                label: 'Estádios & Futebol (Mineirão, Arena MRV, Independência)',
                triggers: ['estadio', 'estadios', 'mineirao', 'cruzeiro', 'arena mrv', 'mrv', 'galo', 'atletico', 'independencia', 'indepa', 'america', 'coelho', 'jogo', 'torcida', 'visitante', 'mandante', 'camarote', 'esplanada'],
                expandTo: ['mineirao', 'arena mrv', 'independencia', 'estadio', 'torcida visitante', 'camarotes']
            },
            {
                label: 'Concessionárias & Emergência (CEMIG, COPASA, Bombeiros, SAMU, Defesa Civil)',
                triggers: ['luz', 'energia', 'fio', 'poste', 'cemig', 'agua', 'esgoto', 'vazamento', 'copasa', 'bombeiro', 'bombeiros', 'incendio', '193', 'samu', '192', 'ambulancia', 'defesa civil', '199', 'transcon', '118', 'conselho tutelar', 'prefeitura'],
                expandTo: ['cemig', 'copasa', 'cbmmg', 'samu', 'defesa civil', 'transcon', 'conselho tutelar', 'prefeitura']
            },
            {
                label: 'Hospitais, UPAs & Delegacias (PCMG)',
                triggers: ['hospital', 'hmc', 'upa', 'medico', 'socorro', 'delegacia', 'pc', 'pcmg', 'plantao', 'flagrante', 'ceflan', 'dp', '197'],
                expandTo: ['hospital municipal', 'upa', 'delegacia de policia civil', 'plantao']
            },
            {
                label: 'Cerco Bloqueio & Divisas',
                triggers: ['cerco', 'bloqueio', 'fuga', 'divisa', 'divisas', 'limite'],
                expandTo: ['cerco bloqueio', 'divisas territoriais']
            }
        ];

        // Constrói o índice varrendo dinamicamente todo o DOM do aplicativo.
        // Qualquer dado, rua, bairro, contato ou cartão adicionado no HTML entra automaticamente!
        function buildDynamicSearchIndex() {
            const index = [];

            // 1. ATALHOS PRINCIPAIS DE NAVEGAÇÃO E ABAS GERAIS
            index.push({
                title: 'Unidades PMMG (1ª RPM, 2ª RPM, Especializadas e 3ª RPM)',
                category: 'Aba Principal • Unidades',
                badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40',
                keywords: 'unidades regioes rpm 1 rpm 2 rpm 3 rpm especializadas batalhoes companhias',
                snippet: 'Acesso a todas as Unidades, Batalhões e Companhias Independentes.',
                execute: () => showView('unidades')
            });
            index.push({
                title: 'Aeronaves Remotamente Pilotadas (RPAS / Drones)',
                category: 'Aba Principal • Aeronaves Remotamente Pilotadas',
                badgeColor: 'bg-sky-950 text-sky-400 border-sky-500/40',
                keywords: 'drone drones rpas arp mavic manual materiais para pilotos sarpas voo',
                snippet: 'Manuais Técnicos de Aeronaves (DJI Mavic 3 Enterprise), Materiais para Pilotos (EAD) e SARPAS.',
                execute: () =>showView('rpas')
            });

            index.push({
                title: 'Pontos de Abastecimento Oficial (1ª e 2ª RPM)',
                category: '18º BPM • Apoio & Abastecimento',
                badgeColor: 'bg-pmmg-khakiBadge text-pmmg-gold border-pmmg-gold/40',
                keywords: 'abastecimento gasolina combustivel diesel etanol posto frota 18 bpm 40 bpm 2 bbm rotam',
                snippet: 'Relação completa de postos de abastecimento da PMMG na 2ª RPM (Contagem/Neves) e 1ª RPM (BH).',
                execute: () => { showView('18bpm'); switch18Tab('apoio'); }
            });

            // 2. VARREDURA DINÂMICA DE ATALHOS & SISTEMAS (#view-atalhos) E RPAS (#view-rpas)
            document.querySelectorAll('#view-atalhos a, #view-rpas a').forEach(linkEl => {
                const isRpas = linkEl.closest('#view-rpas') !== null;
                const titleEl = linkEl.querySelector('h3');
                const descEl = linkEl.querySelector('p');
                const badgeEl = linkEl.querySelector('span');
                const title = titleEl ? titleEl.innerText.trim() : linkEl.innerText.trim();
                const desc = descEl ? descEl.innerText.trim() : '';
                const badge = badgeEl ? badgeEl.innerText.trim() : (isRpas ? 'RPAS / Drones' : 'Atalho');
                const href = linkEl.getAttribute('href');

                index.push({
                    title: title,
                    category: isRpas ? `Drones / RPAS • ${badge}` : `Atalhos & Sistemas • ${badge}`,
                    badgeColor: isRpas ? 'bg-sky-950 text-sky-400 border-sky-500/40' : 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40',
                    keywords: `${title} ${desc} ${badge} ${isRpas ? 'drone rpas aeronave piloto manual' : 'atalho sistema link'}`,
                    snippet: desc,
                    externalUrl: href,
                    element: linkEl,
                    execute: () => {
                        showView(isRpas ? 'rpas' : 'atalhos');
                        highlightAndScrollTo(linkEl);
                    }
                });
            });

            // 3. VARREDURA DINÂMICA DE COMPANHIAS DO 18º BPM (RUAS, BAIRROS, SEDES, ZQC, BASES)
            document.querySelectorAll('#sub18-cias .bg-pmmg-card').forEach(cardEl => {
                const headingEl = cardEl.querySelector('h3, h4');
                const subEl = cardEl.querySelector('p');
                const title = headingEl ? headingEl.innerText.trim() : 'Companhia 18º BPM';
                const subtitle = subEl ? subEl.innerText.trim() : '';

                // Extrai todos os bairros e ruas clicáveis dentro do cartão da Cia
                const clickableItems = Array.from(cardEl.querySelectorAll('a')).map(a =>a.innerText.trim()).filter(Boolean);
                const fullCardText = cardEl.innerText.replace(/\s+/g, ' ').trim();

                index.push({
                    title: `${title}${subtitle ? ' — ' + subtitle : ''}`,
                    category: '18º BPM • Companhias e Patrulhamento',
                    badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40',
                    keywords: `${fullCardText} ${clickableItems.join(' ')} cia patrulhamento bairro rua avenida`,
                    snippet: subtitle || fullCardText.slice(0, 120),
                    clickablePlaces: clickableItems,
                    element: cardEl,
                    execute: (rawQuery) => {
                        showView('18bpm');
                        switch18Tab('cias');
                        highlightAndScrollTo(cardEl, rawQuery);
                    }
                });
            });

            // 4. VARREDURA DINÂMICA DE ABASTECIMENTO, APOIO, DIVISAS, CERCO E ÓRGÃOS DO 18º BPM
            const sub18Configs = [
                { id: 'apoio', label: '18º BPM • Apoio & Abastecimento', extraKeys: 'abastecimento gasolina combustivel diesel posto apoio base bsc' },
                { id: 'divisas', label: '18º BPM • Divisas & Cerco Bloqueio', extraKeys: 'divisa cerco bloqueio fuga limite' },
                { id: 'orgaos', label: '18º BPM • Saúde, Delegacias & Órgãos', extraKeys: 'saude hospital upa delegacia policia civil bombeiros cemig copasa samu transcon prefeitura conselho tutelar' }
            ];

            sub18Configs.forEach(cfg => {
                const container = document.getElementById(`sub18-${cfg.id}`);
                if (!container) return;
                container.querySelectorAll('.bg-pmmg-card, .bg-pmmg-dark').forEach(itemEl => {
                    // Evita duplicar sub-blocos muito pequenos se não tiverem título próprio
                    const heading = itemEl.querySelector('h4, h5, strong');
                    if (!heading) return;
                    const title = heading.innerText.trim();
                    if (title.length < 3) return;
                    const fullText = itemEl.innerText.replace(/\s+/g, ' ').trim();

                    index.push({
                        title: title,
                        category: cfg.label,
                        badgeColor: 'bg-pmmg-dark text-pmmg-khaki border-pmmg-border',
                        keywords: `${fullText} ${cfg.extraKeys}`,
                        snippet: fullText.replace(title, '').trim().slice(0, 130),
                        element: itemEl,
                        execute: (rawQuery) => {
                            showView('18bpm');
                            switch18Tab(cfg.id);
                            highlightAndScrollTo(itemEl, rawQuery);
                        }
                    });
                });
            });

            // 5. VARREDURA DINÂMICA DA TABELA DE CONTATOS / RAMAIS DO 18º BPM (#sub18-contatos)
            document.querySelectorAll('#sub18-contatos tbody tr').forEach(rowEl => {
                const cells = rowEl.querySelectorAll('td');
                if (cells.length >= 2) {
                    const localName = cells[0].innerText.trim();
                    const phoneNum = cells[1].innerText.trim();
                    index.push({
                        title: `${localName} — ${phoneNum}`,
                        category: '18º BPM • Contatos & Ramais',
                        badgeColor: 'bg-pmmg-dark text-gray-300 border-pmmg-border',
                        keywords: `${localName} ${phoneNum} telefone ramal contato ligar sou p2 p3 sadm`,
                        snippet: `Telefone / Ramal direto: ${phoneNum}`,
                        element: rowEl,
                        execute: () => {
                            showView('18bpm');
                            switch18Tab('contatos');
                            highlightAndScrollTo(rowEl);
                        }
                    });
                }
            });

            // 6. VARREDURA DINÂMICA DE UNIDADES ESPECIALIZADAS (#view-especializadas)
            document.querySelectorAll('#view-especializadas .bg-pmmg-card').forEach(cardEl => {
                const h3 = cardEl.querySelector('h3');
                const p = cardEl.querySelector('p');
                const title = h3 ? h3.innerText.trim() : 'Unidade Especializada';
                const fullText = cardEl.innerText.replace(/\s+/g, ' ').trim();

                index.push({
                    title: `${title}${p ? ' — ' + p.innerText.trim() : ''}`,
                    category: 'Unidades Especializadas PMMG',
                    badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/40',
                    keywords: `${fullText} especializada recobrimento cme cpe`,
                    snippet: fullText.replace(title, '').trim().slice(0, 130),
                    element: cardEl,
                    execute: () => {
                        showView('especializadas');
                        highlightAndScrollTo(cardEl);
                    }
                });
            });

            // 7. VARREDURA DINÂMICA DOS 3 ESTÁDIOS E SUAS 4 SUB-ABAS (EXTERNA, INTERNA, MAPA, AÉREO/DRONES)
            const stadiumsMeta = [
                { id: 'mineirao', name: 'Mineirão (34º BPM)', prefix: 'min', switchFn: switchMineiraoTab, extra: 'cruzeiro pampulha caram catalao mineirinho 34 bpm' },
                { id: 'arenamrv', name: 'Arena MRV (5º BPM)', prefix: 'mrv', switchFn: switchArenaMrvTab, extra: 'galo atletico california via expressa 5 bpm' },
                { id: 'independencia', name: 'Arena Independência (16º BPM)', prefix: 'ind', switchFn: switchIndependenciaTab, extra: 'america coelho horto pitangui ismenia 16 bpm' }
            ];

            stadiumsMeta.forEach(st => {
                // Entrada principal do Estádio
                const stPanel = document.getElementById(`estadio-content-${st.id}`);
                if (!stPanel) return;

                index.push({
                    title: `Estádio: ${st.name}`,
                    category: 'Estádios • Painel Principal',
                    badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
                    keywords: `${st.name} ${st.extra} estadio eventos futebol portoes setores`,
                    snippet: `Fluxo de Torcedores, Vias de Acesso, Separação de Torcidas, Portões e Croqui.`,
                    execute: () => {
                        showView('estadios');
                        openStadiumScreen(st.id);
                    }
                });

                // Sub-abas de cada estádio (Externa, Interna, Mapa, Aéreo/Drones)
                const subTabs = [
                    { tab: 'externa', label: '1. Área Externa, Vias & Acessos Mandante x Visitante', keys: 'externa vias ruas estacionamento visitante mandante acesso' },
                    { tab: 'interna', label: '2. Área Interna, Portões & Camarotes VIP', keys: 'interna portao portoes setores camarotes vip jecrim imprensa' },
                    { tab: 'mapa', label: '3. Mapa Ilustrado (Croqui do Estádio)', keys: 'mapa croqui ilustracao desenho setores ruas' },
                    { tab: 'aereo', label: '4. Fluxo Aéreo & Drones (RPAS)', keys: 'drone drones rpas fluxo aereo altura sarpas perda de sinal colisao operador' }
                ];

                subTabs.forEach(stTab => {
                    const subEl = document.getElementById(`sub-${st.prefix}-${stTab.tab}`);
                    if (!subEl) return;
                    const subText = subEl.innerText.replace(/\s+/g, ' ').trim();

                    index.push({
                        title: `${st.name} • ${stTab.label}`,
                        category: `Estádios • ${st.name}`,
                        badgeColor: stTab.tab === 'aereo' ? 'bg-sky-950 text-sky-400 border-sky-500/40' : 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
                        keywords: `${st.name} ${st.extra} ${stTab.label} ${stTab.keys} ${subText}`,
                        snippet: subText.slice(0, 135) + '...',
                        element: subEl,
                        execute: (rawQuery) => {
                            showView('estadios');
                            openStadiumScreen(st.id);
                            st.switchFn(stTab.tab);
                            highlightAndScrollTo(subEl, rawQuery);
                        }
                    });
                });
            });

            // 8. VARREDURA DINÂMICA DOS BATALHÕES DA 1ª RPM E 2ª RPM
            document.querySelectorAll('#view-rpm1 .bg-pmmg-card, #view-rpm2 .bg-pmmg-card').forEach(cardEl => {
                const isRpm1 = cardEl.closest('#view-rpm1') !== null;
                const h3 = cardEl.querySelector('h3');
                const p = cardEl.querySelector('p');
                if (!h3) return;
                const title = h3.innerText.trim();
                const desc = p ? p.innerText.trim() : '';

                index.push({
                    title: `${title} (${isRpm1 ? '1ª RPM - BH' : '2ª RPM - RMBH'})`,
                    category: isRpm1 ? '1ª RPM • Capital' : '2ª RPM • Região Metropolitana',
                    badgeColor: 'bg-pmmg-dark text-pmmg-khaki border-pmmg-border',
                    keywords: `${title} ${desc} ${cardEl.innerText} batalhao rpm`,
                    snippet: desc,
                    element: cardEl,
                    execute: () => {
                        if (title.includes('18º BPM')) {
                            showView('18bpm');
                        } else {
                            showView(isRpm1 ? 'rpm1' : 'rpm2');
                            highlightAndScrollTo(cardEl);
                        }
                    }
                });
            });

            // 9. VARREDURA DINÂMICA DOS CÓDIGOS Q E ALFABETO FONÉTICO
            document.querySelectorAll('#qcodeModal .bg-pmmg-dark').forEach(qEl => {
                const text = qEl.innerText.trim();
                if (!text) return;
                index.push({
                    title: `Código / Fonético: ${text}`,
                    category: 'Códigos Q & Alfabeto Fonético',
                    badgeColor: 'bg-pmmg-khakiBadge text-pmmg-khaki border-pmmg-khaki/30',
                    keywords: `${text} codigo q radio fonetico comunicacao`,
                    snippet: 'Referência rápida de comunicação de rádio PMMG.',
                    execute: () => {
                        const modal = document.getElementById('qcodeModal');
                        if (modal && modal.classList.contains('hidden')) {
                            toggleQCodeModal();
                        }
                        highlightAndScrollTo(qEl);
                    }
                });
            });

            return index;
        }

        // Destaca visualmente o cartão encontrado e, se houver um bairro/rua específico, destaca a caixinha dele também!
        function highlightAndScrollTo(targetEl, rawQuery = '') {
            if (!targetEl) return;
            setTimeout(() => {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.classList.add('ring-2', 'ring-pmmg-gold', 'shadow-2xl');

                // Se o policial digitou o nome de uma rua ou bairro (ex: "joao gomes"), destaca também a tag exata da rua/bairro
                if (rawQuery && rawQuery.length >= 2) {
                    const normQ = normalizeSearchText(rawQuery);
                    targetEl.querySelectorAll('a, span, strong, p').forEach(sub => {
                        if (sub.children.length === 0 && normalizeSearchText(sub.innerText).includes(normQ)) {
                            sub.classList.add('ring-2', 'ring-pmmg-gold', 'bg-pmmg-khaki/30', 'text-white');
                            setTimeout(() => {
                                sub.classList.remove('ring-2', 'ring-pmmg-gold', 'bg-pmmg-khaki/30', 'text-white');
                            }, 4000);
                        }
                    });
                }

                setTimeout(() => {
                    targetEl.classList.remove('ring-2', 'ring-pmmg-gold', 'shadow-2xl');
                }, 3500);
            }, 120);
        }

        let currentSearchResults = [];

        function azimuteRefreshIcons(rootEl) {
            if (typeof lucide === 'undefined' || !lucide.createIcons) return;
            try {
                if (rootEl) {
                    lucide.createIcons({ root: rootEl });
                } else {
                    lucide.createIcons();
                }
            } catch (e) {
                lucide.createIcons();
            }
        }

        function azimuteDebounce(fn, waitMs) {
            let timerId = null;
            return function(...args) {
                clearTimeout(timerId);
                timerId = setTimeout(() => fn.apply(this, args), waitMs);
            };
        }

        const debouncedGlobalSearch = azimuteDebounce(() => handleGlobalSearch(), 180);
        const debouncedSyncUnitsSearchWithGlobal = azimuteDebounce((val, localDropId) => {
            window.syncUnitsSearchWithGlobal(val, localDropId);
        }, 180);
        const debouncedFilter18AndSync = azimuteDebounce((val) => {
            filter18BpmContent();
            window.syncUnitsSearchWithGlobal(val, 'internal18GlobalDropdown');
        }, 180);

        function handleGlobalSearch() {
            const inputEl = document.getElementById('globalSearch');
            const dropdown = document.getElementById('globalSearchDropdown');
            const clearBtn = document.getElementById('clearGlobalSearchBtn');
            if (!inputEl || !dropdown) return;

            const rawQuery = inputEl.value.trim();
            const normQuery = normalizeSearchText(rawQuery);

            if (rawQuery.length === 0) {
                clearBtn.classList.add('hidden');
                dropdown.classList.add('hidden');
                return;
            }

            clearBtn.classList.remove('hidden');

            // Permite pesquisas a partir de 2 letras (ex: "bn"para BNMP, "p2", "vp", etc.)
            if (normQuery.length < 2) {
                dropdown.innerHTML = `
                    <div class="p-3 text-xs text-gray-400 flex items-center gap-2">
                        <i data-lucide="info"class="w-4 h-4 text-pmmg-khaki"></i>
                        <span>Digite pelo menos 2 caracteres (ex: <strong>bn</strong>, <strong>drone</strong>, <strong>joao gomes</strong>, <strong>gasolina</strong>)...</span>
                    </div>
                `;
                dropdown.classList.remove('hidden');
                azimuteRefreshIcons(dropdown);
                return;
            }

            // Verifica se o termo digitado aciona algum grupo de sinônimos inteligentes
            const queryTokens = normQuery.split(/\s+/).filter(Boolean);
            let expandedTerms = [];
            let matchedSynonymLabel = '';

            SMART_SYNONYM_GROUPS.forEach(group => {
                const triggered = group.triggers.some(trig => {
                    const normTrig = normalizeSearchText(trig);
                    return normQuery.includes(normTrig) || (normQuery.length >= 2 && normTrig.startsWith(normQuery));
                });
                if (triggered) {
                    expandedTerms.push(...group.expandTo.map(normalizeSearchText));
                    if (!matchedSynonymLabel) matchedSynonymLabel = group.label;
                }
            });

            // Constrói o índice atualizado a partir do DOM atual
            const allItems = buildDynamicSearchIndex();
            const scoredResults = [];

            allItems.forEach(item => {
                const normTitle = normalizeSearchText(item.title);
                const normKeywords = normalizeSearchText(item.keywords);
                const normCategory = normalizeSearchText(item.category);

                let score = 0;
                let matchedPlace = '';

                // 1. Correspondência direta com o que o usuário digitou
                const allTokensMatchDirect = queryTokens.every(t =>normTitle.includes(t) || normKeywords.includes(t));
                if (allTokensMatchDirect) {
                    score += 50;
                    if (normTitle.startsWith(normQuery)) score += 60;
                    else if (normTitle.includes(normQuery)) score += 35;
                    if (normKeywords.includes(normQuery)) score += 20;
                }

                // 2. Verifica se bateu exatamente com alguma rua ou bairro clicável de uma Cia
                if (item.clickablePlaces && item.clickablePlaces.length >0) {
                    const foundPlace = item.clickablePlaces.find(p =>normalizeSearchText(p).includes(normQuery));
                    if (foundPlace) {
                        score += 80;
                        matchedPlace = foundPlace;
                    }
                }

                // 3. Correspondência via Sinônimos Inteligentes (ex: "gasolina" -> "abastecimento")
                if (expandedTerms.length >0) {
                    expandedTerms.forEach(expTerm => {
                        if (normTitle.includes(expTerm)) score += 45;
                        else if (normKeywords.includes(expTerm) || normCategory.includes(expTerm)) score += 25;
                    });
                }

                if (score >0) {
                    scoredResults.push({ item, score, matchedPlace });
                }
            });

            // Ordena pelos resultados mais relevantes
            scoredResults.sort((a, b) =>b.score - a.score);
            currentSearchResults = scoredResults.slice(0, 18);

            // Renderiza o dropdown de resultados
            if (currentSearchResults.length === 0) {
                dropdown.innerHTML = `
                    <div class="p-4 text-center space-y-1">
                        <p class="text-xs text-gray-300 font-bold">Nenhum resultado encontrado para "${rawQuery}"</p>
                        <p class="text-[11px] text-gray-500">Tente buscar por rua, bairro, batalhão, estádio, "drone", "gasolina", "bnmp", "reds"...</p>
                    </div>
                `;
            } else {
                let headerHtml = `
                    <div class="px-3 py-2 bg-pmmg-black/90 flex items-center justify-between text-[11px] sticky top-0 z-10 border-b border-pmmg-border">
                        <span class="text-pmmg-khaki font-bold flex items-center gap-1.5">
                            <i data-lucide="sparkles"class="w-3.5 h-3.5 text-pmmg-gold"></i>
                            ${currentSearchResults.length} resultado(s) encontrado(s)
                        </span>
                        ${matchedSynonymLabel ? `<span class="bg-pmmg-khakiBadge text-pmmg-gold px-2 py-0.5 rounded text-[10px] font-bold border border-pmmg-gold/30">${matchedSynonymLabel}</span>` : ''}
                    </div>
                `;

                const itemsHtml = currentSearchResults.map((entry, idx) => {
                    const { item, matchedPlace } = entry;
                    return `
                        <div onclick="triggerSearchResult(${idx})"class="p-3 hover:bg-pmmg-cardHover cursor-pointer transition-colors flex items-start justify-between gap-3 group">
                            <div class="space-y-1 min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="text-[9.5px] font-bold px-2 py-0.5 rounded border uppercase ${item.badgeColor}">${item.category}</span>
                                    ${matchedPlace ? `<span class="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1"><i data-lucide="map-pin"class="w-3 h-3"></i> ${matchedPlace}</span>` : ''}
                                </div>
                                <h4 class="text-xs sm:text-sm font-bold text-white group-hover:text-pmmg-khaki transition-colors truncate">${item.title}</h4>
                                ${item.snippet ? `<p class="text-[11px] text-gray-400 line-clamp-2 leading-snug">${item.snippet}</p>` : ''}
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0 self-center">
                                ${item.externalUrl ? `
                                    <a href="${item.externalUrl}"target="_blank"onclick="event.stopPropagation()"class="px-2.5 py-1.5 bg-pmmg-khaki text-pmmg-black rounded-lg text-[10px] font-bold hover:bg-pmmg-khakiHover flex items-center gap-1 shadow"title="Abrir Sistema / Link Direto">
                                        <span>Abrir</span>
                                        <i data-lucide="external-link"class="w-3 h-3"></i>
                                    </a>
                                ` : `
                                    <span class="p-1.5 bg-pmmg-card text-pmmg-khaki border border-pmmg-border rounded-lg group-hover:bg-pmmg-khaki group-hover:text-pmmg-black transition-colors">
                                        <i data-lucide="arrow-right"class="w-4 h-4"></i>
                                    </span>
                                `}
                            </div>
                        </div>
                    `;
                }).join('');

                dropdown.innerHTML = headerHtml + itemsHtml;
            }

            dropdown.classList.remove('hidden');
            azimuteRefreshIcons(dropdown);
        }

        function triggerSearchResult(index) {
            const entry = currentSearchResults[index];
            if (!entry) return;
            const rawQuery = document.getElementById('globalSearch').value.trim();
            document.getElementById('globalSearchDropdown').classList.add('hidden');
            entry.item.execute(rawQuery);
        }

        function clearGlobalSearch() {
            const inputEl = document.getElementById('globalSearch');
            const dropdown = document.getElementById('globalSearchDropdown');
            const clearBtn = document.getElementById('clearGlobalSearchBtn');
            if (inputEl) inputEl.value = '';
            if (dropdown) dropdown.classList.add('hidden');
            if (clearBtn) clearBtn.classList.add('hidden');
        }

        // Fecha a lista de resultados ao clicar fora da barra de pesquisa
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('globalSearchDropdown');
            const inputEl = document.getElementById('globalSearch');
            if (!dropdown || !inputEl) return;
            if (!dropdown.contains(e.target) && e.target !== inputEl) {
                dropdown.classList.add('hidden');
            }
        });

        function copyToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch (err) {}
            document.body.removeChild(textArea);
            showToast(`"${text}"copiado!`);
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toastText').textContent = message;
            toast.classList.remove('hidden');
            setTimeout(() => { toast.classList.add('hidden'); }, 2200);
        }

        function saveNotepadContent() {
            const text = document.getElementById('notepad18').value;
            try { localStorage.setItem('pmmg_18bpm_notepad', text); } catch (e) {}
            if (typeof window.syncAllNotesToCloud === 'function') {
                window.syncAllNotesToCloud();
            }
            document.getElementById('saveStatus18').textContent = 'Salvo na nuvem automaticamente.';
        }

        function loadNotepadContent() {
            const saved = localStorage.getItem('pmmg_18bpm_notepad');
            if (saved) {
                document.getElementById('notepad18').value = saved;
                document.getElementById('saveStatus18').textContent = 'Nota recarregada.';
            }
        }

        function copyNotepadContent() {
            const text = document.getElementById('notepad18').value;
            if (text.trim()) copyToClipboard(text);
        }

        function clearNotepadContent() {
            document.getElementById('notepad18').value = '';
            localStorage.removeItem('pmmg_18bpm_notepad');
            document.getElementById('saveStatus18').textContent = 'Rascunho apagado.';
            showToast('Rascunho limpo!');
        }


        function toggleQCodeModal() {
            document.getElementById('qcodeModal').classList.toggle('hidden');
        }

        function saveProjectIdeas(showNotification = false) {
            const el = document.getElementById('projectIdeasInput');
            if (el) {
                try { localStorage.setItem('azimute_project_ideas', el.value); } catch (e) {}
                try {
                    const wn = window.name ? JSON.parse(window.name) : {};
                    wn.azimute_project_ideas = el.value;
                    window.name = JSON.stringify(wn);
                } catch (e) {}
            }
            const statusEl = document.getElementById('ideasSaveStatus');
            if (statusEl) {
                statusEl.textContent = 'Salvando na nuvem...';
            }
            if (typeof window.syncAllNotesToCloud === 'function') {
                window.syncAllNotesToCloud(showNotification);
            } else if (showNotification) {
                showToast('Ideias salvas com sucesso!');
            }
        }

        function copyIdeasToClipboard() {
            const el = document.getElementById('projectIdeasInput');
            if (el && el.value.trim()) {
                copyToClipboard(el.value);
            } else {
                showToast('A caixa de ideias está vazia.');
            }
        }

        function loadProjectIdeas() {
            const el = document.getElementById('projectIdeasInput');
            if (!el) return;
            let saved = '';
            try { saved = localStorage.getItem('azimute_project_ideas') || ''; } catch (e) {}
            if (!saved) {
                try {
                    const wn = window.name ? JSON.parse(window.name) : {};
                    if (wn.azimute_project_ideas) saved = wn.azimute_project_ideas;
                } catch (e) {}
            }
            if (saved && !el.value) {
                el.value = saved;
            }
        }

        window.onload = function() {
            if (typeof handleAutoOrientationMode === 'function') {
                handleAutoOrientationMode();
            }
            loadNotepadContent();
            loadDroneNotes();
            loadProjectIdeas();
            showView('home');
        };
    </script>