/* AZIMUTE — js/modules/drones-reports.js (Modo Drone, orbita/sobrevoo, marcadores permanentes, simulador leve, Gamepad API e relatorio estruturado) */
        // ================= CHECKLIST PRÉ-VOO NA ABA DRONES (FECHADO POR PADRÃO + BOTÕES SALVAR E LIMPAR) =================
        const AZIMUTE_RPAS_CHECKLIST_IDS = [
            'chkRpas-helices',
            'chkRpas-baterias',
            'chkRpas-gimbal',
            'chkRpas-sd',
            'chkRpas-imu',
            'chkRpas-espaco'
        ];

        window.toggleRpasFlightParamsBox = function(forceOpen = null) {
            const body = document.getElementById('rpasFlightParamsExpandableBody');
            const lbl = document.getElementById('lblRpasFlightParamsToggle');
            const icon = document.getElementById('iconRpasFlightParamsChevron');
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

        window.toggleRpasChecklistBox = function(forceOpen = null) {
            const body = document.getElementById('rpasChecklistExpandableBody');
            const lbl = document.getElementById('lblRpasChecklistToggle');
            const icon = document.getElementById('iconRpasChecklistChevron');
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

        window.switchRpasInternalSubtab = function(subtab) {
            if (subtab === 'checklist') {
                window.toggleRpasChecklistBox(true);
            }
        };

        window.updateRpasPreflightChecklist = function() {
            let checkedCount = 0;
            const total = AZIMUTE_RPAS_CHECKLIST_IDS.length;
            const stateObj = {};

            AZIMUTE_RPAS_CHECKLIST_IDS.forEach(id => {
                const el = document.getElementById(id);
                const keySuffix = id.replace('chkRpas-', '');
                const lbl = document.getElementById('lblChkRpas-' + keySuffix);
                const isChecked = !!(el && el.checked);
                stateObj[id] = isChecked;
                if (isChecked) {
                    checkedCount++;
                    if (lbl) lbl.className = 'bg-emerald-950/35 p-3.5 rounded-xl border-2 border-emerald-500/70 flex items-start gap-3 cursor-pointer transition-all select-none';
                } else {
                    if (lbl) lbl.className = 'bg-pmmg-dark hover:bg-pmmg-cardHover p-3.5 rounded-xl border border-pmmg-border flex items-start gap-3 cursor-pointer transition-all select-none';
                }
            });

            const pct = Math.round((checkedCount / total) * 100);
            const countTxt = document.getElementById('rpasChecklistCountText');
            const pctTxt = document.getElementById('rpasChecklistPctText');
            const progBar = document.getElementById('rpasChecklistProgressBar');
            const miniBadge = document.getElementById('rpasTabChecklistMiniBadge');
            const statusTxt = document.getElementById('rpasChecklistFinalStatusText');

            if (countTxt) countTxt.textContent = `Progresso: ${checkedCount} de ${total} itens marcados`;
            if (pctTxt) pctTxt.textContent = pct + '%';
            if (progBar) progBar.style.width = pct + '%';
            if (miniBadge) miniBadge.textContent = pct + '%';
            if (statusTxt) {
                statusTxt.textContent = pct === 100
                    ? '6 de 6 itens conferidos (100%)'
                    : `${checkedCount} de ${total} itens conferidos (${pct}%)`;
                statusTxt.className = pct === 100
                    ? 'font-mono font-extrabold text-emerald-400 uppercase'
                    : 'font-mono font-bold text-gray-300 uppercase';
            }

            try {
                localStorage.setItem('azimute_rpas_preflight_checklist', JSON.stringify(stateObj));
            } catch (e) {}
        };

        window.saveRpasPreflightChecklist = function() {
            const stateObj = {};
            AZIMUTE_RPAS_CHECKLIST_IDS.forEach(id => {
                const el = document.getElementById(id);
                stateObj[id] = !!(el && el.checked);
            });
            try {
                localStorage.setItem('azimute_rpas_preflight_checklist', JSON.stringify(stateObj));
            } catch (e) {}
            window.updateRpasPreflightChecklist();
            if (typeof showToast === 'function') showToast('Checklist Pré-Voo salvo no dispositivo!');
        };

        window.resetRpasPreflightChecklist = function() {
            AZIMUTE_RPAS_CHECKLIST_IDS.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = false;
            });
            try { localStorage.removeItem('azimute_rpas_preflight_checklist'); } catch (e) {}
            window.updateRpasPreflightChecklist();
            if (typeof showToast === 'function') showToast('Checklist Pré-Voo limpo!');
        };

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

        // ================= AVALIAÇÃO TÉCNICA DE VOO RPAS (AERONAVE ÚNICA FIXA DA UNIDADE) =================
        const AZIMUTE_FIXED_RPAS_LIMITS = {
            name: 'DJI Mavic 3 Enterprise (M3E / M3T)',
            maxWindKmh: 43,
            minTempC: -10,
            maxTempC: 40,
            maxRainMm: 0.0,
            maxRainProbPct: 40
        };

        let azimuteRpasAudioMuted = true;
        let azimuteRpasLastWeatherSnapshot = null;
        let azimuteRpasPeriodicIntervalId = null;

        function playRpasWeatherAlertBeep() {
            if (azimuteRpasAudioMuted) return;
            try {
                const ctx = getAzimuteAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const pattern = [
                    { freq: 1040, start: 0.0, dur: 0.11 },
                    { freq: 1480, start: 0.14, dur: 0.11 },
                    { freq: 1040, start: 0.32, dur: 0.11 },
                    { freq: 1480, start: 0.46, dur: 0.16 }
                ];
                pattern.forEach(p => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(p.freq, now + p.start);
                    gain.gain.setValueAtTime(0.001, now + p.start);
                    gain.gain.exponentialRampToValueAtTime(0.42, now + p.start + 0.015);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + p.start + p.dur);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + p.start);
                    osc.stop(now + p.start + p.dur + 0.01);
                });
            } catch (e) {}
        }

        const AZIMUTE_RPAS_FLEET_CATALOG = [
            {
                id: 'm3e_pp373745025',
                modelo: 'DJI Mavic 3 Enterprise (M3E)',
                sigla: 'M3E',
                numeroSerie: '1581F5FHD233T00DH581',
                prefixo: 'PP-373745025',
                alcanceTransmissao: 'O3 Enterprise: até 15 km (FCC) / 8 km (CE)',
                capacidadeZoom: 'Câmera Tele: Zoom híbrido até 56x e óptico de 7x',
                resistenciaVento: '12 m/s (~43 km/h)',
                resistenciaChuva: 'Sem proteção IP contra chuva — não operar sob precipitação',
                autonomiaMaxima: 'Até 45 min (em condições ideais)',
                manualUrl: 'https://dl.djicdn.com/downloads/DJI_Mavic_3_Enterprise/20250916/DJI_Mavic_3_Enterprise_Series_User_Manual_PT.pdf',
                limits: {
                    maxWindKmh: 43,
                    minTempC: -10,
                    maxTempC: 40,
                    maxRainMm: 0,
                    maxRainProbPct: 40,
                    minVisibilityKm: 3.0
                }
            }
        ];

        let azimuteRpasHasExplicitSelection = false;

        window.isRpasAutoFleetRecEnabled = function() {
            const s = typeof getAzimuteUiSettings === 'function' ? getAzimuteUiSettings() : { enableRpasAutoFleetRec: true };
            return s.enableRpasAutoFleetRec !== false;
        };

        window.getSelectedRpasAircraft = function() {
            const sel = document.getElementById('rpasFleetSelectInput');
            const selectedId = sel ? sel.value : '';
            if (!selectedId || selectedId === '__auto__') {
                return AZIMUTE_RPAS_FLEET_CATALOG[0];
            }
            return AZIMUTE_RPAS_FLEET_CATALOG.find(item => item.id === selectedId) || AZIMUTE_RPAS_FLEET_CATALOG[0];
        };

        window.evaluateSingleRpasAgainstSnapshot = function(rpa, snapshot) {
            const limits = (rpa && rpa.limits) ? rpa.limits : AZIMUTE_FIXED_RPAS_LIMITS;
            const minVisKm = typeof limits.minVisibilityKm === 'number' ? limits.minVisibilityKm : 3.0;
            const reasons = [];

            if (snapshot.windKmh > limits.maxWindKmh) {
                reasons.push(`<strong>Vento sustentado a 10m excedido:</strong> ${snapshot.windKmh} km/h ultrapassa o limite técnico da aeronave (${limits.maxWindKmh} km/h).`);
            }
            if (typeof snapshot.wind80mKmh === 'number' && !isNaN(snapshot.wind80mKmh) && snapshot.wind80mKmh > limits.maxWindKmh) {
                reasons.push(`<strong>Vento em altitude (80m) excedido:</strong> ${snapshot.wind80mKmh} km/h ultrapassa o limite máximo de resistência (${limits.maxWindKmh} km/h).`);
            }
            if (snapshot.gustsKmh > limits.maxWindKmh) {
                reasons.push(`<strong>Rajadas de vento excedidas:</strong> ${snapshot.gustsKmh} km/h ultrapassam o teto de resistência da aeronave (${limits.maxWindKmh} km/h).`);
            }
            if (snapshot.tempC > limits.maxTempC) {
                reasons.push(`<strong>Temperatura máxima excedida:</strong> ${snapshot.tempC} °C acima do limite técnico da aeronave/bateria (${limits.maxTempC} °C).`);
            } else if (snapshot.tempC < limits.minTempC) {
                reasons.push(`<strong>Temperatura mínima excedida:</strong> ${snapshot.tempC} °C abaixo do limite mínimo técnico (${limits.minTempC} °C).`);
            }
            if (snapshot.precipMm > limits.maxRainMm) {
                reasons.push(`<strong>Precipitação ativa detectada:</strong> ${snapshot.precipMm} mm excede o limite de proteção (${limits.maxRainMm} mm).`);
            }
            if (limits.maxRainMm === 0 && snapshot.weatherCode >= 51) {
                reasons.push(`<strong>Condição adversa (${snapshot.conditionText}):</strong> Aeronave sem proteção IP contra chuva/garoa/trovoada.`);
            }
            if (snapshot.rainProbPct > limits.maxRainProbPct) {
                reasons.push(`<strong>Probabilidade de chuva elevada:</strong> ${snapshot.rainProbPct}% excede o limite de segurança (${limits.maxRainProbPct}%).`);
            }
            if (typeof snapshot.visibilityKm === 'number' && !isNaN(snapshot.visibilityKm) && snapshot.visibilityKm < minVisKm) {
                reasons.push(`<strong>Visibilidade reduzida:</strong> ${snapshot.visibilityKm.toFixed(1)} km está abaixo do mínimo recomendado (${minVisKm.toFixed(1)} km) para operação VLOS.`);
            }

            return {
                apt: reasons.length === 0,
                reasons
            };
        };

        window.renderRpasAutoFleetRecommendation = function(snapshot) {
            const panel = document.getElementById('rpasAutoFleetRecommendationPanel');
            const listEl = document.getElementById('rpasAutoFleetRecommendationList');
            const countBadge = document.getElementById('rpasAutoRecFleetCountBadge');
            if (!panel || !listEl) return;

            const fleetCount = AZIMUTE_RPAS_FLEET_CATALOG.length;
            const autoEnabled = window.isRpasAutoFleetRecEnabled();
            const sel = document.getElementById('rpasFleetSelectInput');
            const isUnselectedMode = !azimuteRpasHasExplicitSelection || (sel && sel.value === '__auto__');

            // Exibir lista comparativa SOMENTE quando houver > 1 drone cadastrado, opção ativa em Configurações e sem escolha prévia
            if (!autoEnabled || fleetCount <= 1 || !isUnselectedMode || !snapshot || !snapshot.hasValidWeather) {
                panel.classList.add('hidden');
                return;
            }

            panel.classList.remove('hidden');
            if (countBadge) countBadge.textContent = `${fleetCount} Aeronaves Avaliadas`;

            listEl.innerHTML = AZIMUTE_RPAS_FLEET_CATALOG.map(rpa => {
                const evalRes = window.evaluateSingleRpasAgainstSnapshot(rpa, snapshot);
                if (evalRes.apt) {
                    return `
                        <div class="bg-emerald-950/30 border-2 border-emerald-500 rounded-xl p-3.5 space-y-2">
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <span class="text-[10px] font-mono font-bold text-emerald-300 uppercase">Prefixo ${rpa.prefixo}</span>
                                    <h5 class="text-base font-military text-white uppercase tracking-wide leading-none mt-0.5">${rpa.modelo}</h5>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-emerald-600 text-pmmg-black font-extrabold text-[10px] uppercase shrink-0">APTA PARA VOO</span>
                            </div>
                            <p class="text-[11px] text-emerald-200 leading-relaxed">
                                Clima local dentro dos limites técnicos deste modelo (Vento máx: ${rpa.limits.maxWindKmh} km/h).
                            </p>
                            <div class="flex justify-end pt-1">
                                <button type="button" onclick="selectRpasAircraftFromFleet('${rpa.id}', true)" class="px-3 py-1.5 rounded-lg bg-[#0D0D0D] hover:bg-pmmg-cardHover text-emerald-300 border border-emerald-500/60 text-[10.5px] font-extrabold uppercase cursor-pointer">
                                    Selecionar Esta Aeronave
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="bg-red-950/35 border-2 border-red-500 rounded-xl p-3.5 space-y-2">
                            <div class="flex items-center justify-between gap-2">
                                <div>
                                    <span class="text-[10px] font-mono font-bold text-red-300 uppercase">Prefixo ${rpa.prefixo}</span>
                                    <h5 class="text-base font-military text-white uppercase tracking-wide leading-none mt-0.5">${rpa.modelo}</h5>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase shrink-0">NÃO APTA</span>
                            </div>
                            <ul class="list-disc pl-4 space-y-1 text-[11px] text-gray-200">
                                ${evalRes.reasons.map(r => `<li>${r}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                }
            }).join('');
        };

        window.toggleRpasSpecsDetailsSubtab = function(forceOpen = null) {
            const box = document.getElementById('rpasSpecsDetailsBody');
            const lbl = document.getElementById('lblRpasSpecsDetailsToggle');
            const icon = document.getElementById('iconRpasSpecsDetailsChevron');
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Ocultar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Saiba mais';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleRpasFleetSelectorBox = function(forceOpen = null) {
            const box = document.getElementById('rpasFleetSelectorExpandableBody');
            const lbl = document.getElementById('lblRpasFleetSelectorToggle');
            const icon = document.getElementById('iconRpasFleetSelectorChevron');
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleRpasPilotMaterialsBox = function(forceOpen = null) {
            const box = document.getElementById('rpasPilotMaterialsExpandableBody');
            const lbl = document.getElementById('lblRpasPilotMaterialsToggle');
            const icon = document.getElementById('iconRpasPilotMaterialsChevron');
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.renderRpasFleetSelector = function() {
            const sel = document.getElementById('rpasFleetSelectInput');
            const countBadge = document.getElementById('rpasFleetCountBadge');
            if (!sel) return;

            const fleetCount = AZIMUTE_RPAS_FLEET_CATALOG.length;
            const autoEnabled = window.isRpasAutoFleetRecEnabled();

            if (fleetCount > 1 && autoEnabled && !azimuteRpasHasExplicitSelection) {
                sel.innerHTML = `<option value="__auto__" selected>Automático (Comparar toda a frota pelo clima local)</option>` +
                    AZIMUTE_RPAS_FLEET_CATALOG.map(rpa =>
                        `<option value="${rpa.id}">${rpa.modelo} • Prefixo: ${rpa.prefixo}</option>`
                    ).join('');
            } else {
                const currentVal = (sel.value && sel.value !== '__auto__') ? sel.value : AZIMUTE_RPAS_FLEET_CATALOG[0].id;
                sel.innerHTML = AZIMUTE_RPAS_FLEET_CATALOG.map(rpa =>
                    `<option value="${rpa.id}">${rpa.modelo} • Prefixo: ${rpa.prefixo}</option>`
                ).join('');
                sel.value = AZIMUTE_RPAS_FLEET_CATALOG.some(r => r.id === currentVal) ? currentVal : AZIMUTE_RPAS_FLEET_CATALOG[0].id;
            }

            if (countBadge) {
                countBadge.textContent = fleetCount === 1
                    ? '1 Aeronave Cadastrada'
                    : `${fleetCount} Aeronaves Cadastradas`;
            }
            window.selectRpasAircraftFromFleet(sel.value, false);
        };

        window.selectRpasAircraftFromFleet = function(rpaId, isUserAction = true) {
            if (isUserAction) {
                azimuteRpasHasExplicitSelection = (rpaId !== '__auto__');
                const sel = document.getElementById('rpasFleetSelectInput');
                if (sel && rpaId && sel.value !== rpaId) sel.value = rpaId;
            }
            const rpa = window.getSelectedRpasAircraft();
            if (!rpa) return;
            const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setTxt('rpasFleetHeaderBadge', rpa.prefixo);
            setTxt('rpasFlightHeaderModelBadge', `${rpa.sigla || 'M3E'} • GPS x Clima`);
            setTxt('rpasSelectedModelText', rpa.modelo);
            setTxt('rpasSelectedSerialText', rpa.numeroSerie);
            setTxt('rpasSelectedPrefixText', rpa.prefixo);
            setTxt('rpasSpecBadge', `Ficha Técnica • Prefixo ${rpa.prefixo}`);
            setTxt('rpasSpecTitle', rpa.modelo);
            setTxt('rpasSpecSerialBadge', `S/N: ${rpa.numeroSerie}`);
            setTxt('rpasSpecTransmission', rpa.alcanceTransmissao);
            setTxt('rpasSpecZoom', rpa.capacidadeZoom);
            setTxt('rpasSpecWind', rpa.resistenciaVento);
            setTxt('rpasSpecRain', rpa.resistenciaChuva);
            setTxt('rpasSpecAutonomy', rpa.autonomiaMaxima);
            const manualBtn = document.getElementById('rpasSpecManualBtn');
            if (manualBtn && rpa.manualUrl) manualBtn.href = rpa.manualUrl;
            if (azimuteRpasLastWeatherSnapshot && azimuteRpasLastWeatherSnapshot.hasValidWeather) {
                renderRpasEvaluationResult(azimuteRpasLastWeatherSnapshot, false);
            }
        };

        window.toggleRpasAircraftDataBox = function(forceOpen = null) {
            const box = document.getElementById('rpasAircraftDataExpandableBody');
            const lbl = document.getElementById('lblRpasAircraftDataToggle');
            const icon = document.getElementById('iconRpasAircraftDataChevron');
            if (!box) return;
            const willOpen = forceOpen !== null ? forceOpen : box.classList.contains('hidden');
            if (willOpen) {
                box.classList.remove('hidden');
                if (lbl) lbl.textContent = 'Fechar';
                if (icon) icon.style.transform = 'rotate(180deg)';
            } else {
                box.classList.add('hidden');
                if (lbl) lbl.textContent = 'Abrir';
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        };

        window.toggleRpasSoundAlertMute = function() {
            azimuteRpasAudioMuted = !azimuteRpasAudioMuted;
            const txt = document.getElementById('txtRpasAudioMute');
            const btn = document.getElementById('btnRpasAudioMute');
            const icon = document.getElementById('iconRpasAudioMute');
            if (txt) txt.textContent = azimuteRpasAudioMuted ? 'Áudio Alerta: MUDO' : 'Áudio Alerta: ON';
            if (icon) icon.setAttribute('data-lucide', azimuteRpasAudioMuted ? 'volume-x' : 'volume-2');
            if (btn) {
                btn.className = azimuteRpasAudioMuted
                    ? 'px-2.5 py-1.5 rounded-lg bg-[#0D0D0D] hover:bg-pmmg-border text-gray-400 border border-pmmg-border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer'
                    : 'px-2.5 py-1.5 rounded-lg bg-[#0D0D0D] hover:bg-pmmg-border text-pmmg-gold border border-pmmg-gold/60 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer';
            }
            if (!azimuteRpasAudioMuted) {
                getAzimuteAudioContext();
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.triggerRpasWeatherChangeAlert = function(reasonsArray, forceSound) {
            const banner = document.getElementById('rpasWeatherChangeAlertBanner');
            const listEl = document.getElementById('rpasWeatherChangeAlertList');
            if (banner && listEl && Array.isArray(reasonsArray) && reasonsArray.length > 0) {
                listEl.innerHTML = reasonsArray.map(r => `<li>${r}</li>`).join('');
                banner.classList.remove('hidden');
            }
            if (!azimuteRpasAudioMuted && typeof window.playDroneWeatherAudio === 'function') {
                window.playDroneWeatherAudio(false);
            }
        };

        window.acknowledgeRpasWeatherAlert = function() {
            const banner = document.getElementById('rpasWeatherChangeAlertBanner');
            if (banner) banner.classList.add('hidden');
        };

        function getRpasConfiguredLimits() {
            const rpa = typeof window.getSelectedRpasAircraft === 'function' ? window.getSelectedRpasAircraft() : null;
            return (rpa && rpa.limits) ? rpa.limits : AZIMUTE_FIXED_RPAS_LIMITS;
        }

        // Verifica proximidade de aeródromos, CTRs, helipontos hospitalares e corredores aéreos via GPS ou local em foco
        function evaluateRpasAirspaceCautionZones(lat, lon) {
            const cautionAlerts = [];
            const activeUnitText = (document.getElementById('activeUnitName')?.textContent || '').toLowerCase();
            const qthText = (document.getElementById('statusBarQth')?.textContent || '').toLowerCase();
            const hudAreaText = (document.getElementById('hudUnitArea')?.textContent || '').toLowerCase();
            const combinedContext = `${activeUnitText} ${qthText} ${hudAreaText}`;

            // Pontos de referência de tráfego aéreo intenso / aeródromos / helipontos na RMBH
            const airspaceZones = [
                {
                    id: 'sbbh_pampulha',
                    nome: 'Aeroporto da Pampulha (SBBH) / Região do Mineirão & Lagoa',
                    lat: -19.8519,
                    lon: -43.9506,
                    raioKm: 5.5,
                    keywords: ['pampulha', 'mineirão', 'mineirao', 'são josé', 'sao jose', 'aeroporto', '34º bpm', '34 bpm', 'carlos luz', 'abrahao caram', 'abrahão caram'],
                    aviso: 'Área sob influência direta da CTR Pampulha (SBBH) e entorno do Mineirão: fluxo intenso de aeronaves comerciais, executivas e helicópteros (Pégaso PMMG / Arcanjo). Autorização prévia obrigatória no SARPAS (DECEA) e coordenação permanente com o tráfego aéreo tripulado.'
                },
                {
                    id: 'sbcf_confins',
                    nome: 'Aeroporto Internacional de Confins (SBCF)',
                    lat: -19.6244,
                    lon: -43.9719,
                    raioKm: 9.0,
                    keywords: ['confins', 'aeroporto internacional', 'tancredo neves', 'lagoa santa'],
                    aviso: 'Proximidade da zona de aproximação e decolagem do Aeroporto Internacional de Confins (SBCF): espaço aéreo controlado com tráfego pesado de aeronaves. Autorização SARPAS (DECEA) indispensável.'
                },
                {
                    id: 'sbpr_carlos_prates',
                    nome: 'Aeródromo Carlos Prates / Eixo Noroeste BH',
                    lat: -19.9089,
                    lon: -43.9892,
                    raioKm: 3.0,
                    keywords: ['carlos prates', 'padre eustáquio', 'padre eustaquio', 'caiçara', 'caicara'],
                    aviso: 'Corredor de aeronaves leves e helicópteros na região Noroeste de Belo Horizonte. Verifique restrições de altitude e protocolo SARPAS.'
                },
                {
                    id: 'heliponto_joao_xxiii',
                    nome: 'Heliponto Hospital João XXIII / Área Hospitalar (Santa Efigênia)',
                    lat: -19.9242,
                    lon: -43.9317,
                    raioKm: 2.5,
                    keywords: ['joão xxiii', 'joao xxiii', 'santa efigênia', 'santa efigenia', 'área hospitalar', 'area hospitalar', 'alfredo balena', 'hpm', 'contorno'],
                    aviso: 'Proximidade imediata do Heliponto do Hospital João XXIII e Área Hospitalar: rota frequente de pouso e decolagem de helicópteros aeromédicos e policiais (Arcanjo / Pégaso). Autorização SARPAS obrigatória e atenção redobrada.'
                },
                {
                    id: 'heliponto_risoleta',
                    nome: 'Heliponto Hospital Risoleta Tolentino Neves (Venda Nova)',
                    lat: -19.8195,
                    lon: -43.9535,
                    raioKm: 2.0,
                    keywords: ['risoleta', 'vila clóris', 'vila cloris', 'venda nova', '49º bpm'],
                    aviso: 'Proximidade do Heliponto do Hospital Risoleta Neves: rota de aproximação de aeronaves de resgate aeromédico. Mantenha autorização SARPAS e escuta/observação visual.'
                },
                {
                    id: 'heliponto_hmc_contagem',
                    nome: 'Heliponto Hospital Municipal de Contagem (HMC)',
                    lat: -19.9322,
                    lon: -44.0758,
                    raioKm: 2.0,
                    keywords: ['hospital municipal de contagem', 'hmc', 'chácaras cotia', 'chacaras cotia'],
                    aviso: 'Proximidade do Heliponto do Hospital Municipal de Contagem (HMC): atenção ao fluxo de helicópteros de resgate e segurança pública. Verifique SARPAS.'
                },
                {
                    id: 'corredor_arena_mrv',
                    nome: 'Entorno Arena MRV / Corredor Via Expressa & Anel Rodoviário',
                    lat: -19.9301,
                    lon: -44.0156,
                    raioKm: 1.8,
                    keywords: ['arena mrv', 'cristina maria de assis', 'califórnia', 'california'],
                    aviso: 'Corredor aéreo de acompanhamento policial sobre a Via Expressa / Anel Rodoviário e entorno da Arena MRV. Solicite autorização SARPAS (DECEA).'
                },
                {
                    id: 'corredor_independencia',
                    nome: 'Entorno Arena Independência / Corredor Leste (Av. dos Andradas)',
                    lat: -19.9083,
                    lon: -43.9178,
                    raioKm: 1.8,
                    keywords: ['independência', 'independencia', 'pitangui', 'horto', 'ismênia', 'ismenia'],
                    aviso: 'Corredor aéreo do vale da Av. dos Andradas rumo à Área Hospitalar e malha urbana adensada do Horto. Requer autorização SARPAS (DECEA).'
                }
            ];

            const calcKm = typeof haversineKm === 'function' ? haversineKm : function(lat1, lon1, lat2, lon2) {
                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
            };

            airspaceZones.forEach(zone => {
                let matchedByGps = false;
                let distKm = null;
                if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
                    distKm = calcKm(lat, lon, zone.lat, zone.lon);
                    if (distKm <= zone.raioKm) {
                        matchedByGps = true;
                    }
                }
                const matchedByContext = zone.keywords.some(kw => combinedContext.includes(kw));

                if (matchedByGps || matchedByContext) {
                    const distTag = matchedByGps && distKm !== null ? ` (~${distKm.toFixed(1)} km da posição GPS)` : ' (área selecionada)';
                    cautionAlerts.push(`<strong>${zone.nome}${distTag}:</strong> ${zone.aviso}`);
                }
            });

            return cautionAlerts;
        }

        // Renderiza o painel nos 3 estados obrigatórios:
        // 1. VERDE: "CONDIÇÕES TÉCNICAS DENTRO DOS LIMITES"
        // 2. VERMELHO: "VOO NÃO RECOMENDADO (LIMITE EXCEDIDO)" + motivo técnico
        // 3. CINZA/AMARELO: "AVALIAÇÃO INDETERMINADA" (quando faltarem dados de GPS ou clima)
        function setRpasPanelIndeterminate(reasonMsg) {
            const box = document.getElementById('rpasEvaluationStateBox');
            const iconBadge = document.getElementById('rpasEvalIconBadge');
            const titleEl = document.getElementById('rpasEvalStateTitle');
            const reasonsBox = document.getElementById('rpasEvalReasonsContainer');
            const tsBadge = document.getElementById('rpasEvalTimestampBadge');

            if (box) {
                box.className = 'bg-amber-950/30 border-2 border-amber-500/70 border-l-8 border-l-amber-400 rounded-2xl p-4 sm:p-5 space-y-3 transition-all';
            }
            if (iconBadge) {
                iconBadge.className = 'p-2.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/50';
                iconBadge.innerHTML = '<i data-lucide="alert-circle"class="w-6 h-6"></i>';
            }
            if (titleEl) {
                titleEl.textContent = 'AVALIAÇÃO INDETERMINADA';
                titleEl.className = 'text-xl sm:text-2xl font-military uppercase tracking-wider text-amber-300 leading-none mt-0.5';
            }
            if (reasonsBox) {
                reasonsBox.innerHTML = `<p class="font-semibold text-amber-200"> ${reasonMsg || 'Faltam dados confirmados de GPS ou de meteorologia local para emitir avaliação técnica.'}</p>`;
            }
            if (tsBadge) {
                tsBadge.textContent = 'Dados incompletos (GPS / Clima)';
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function renderRpasEvaluationResult(snapshot, isPeriodicCheck) {
            const limits = getRpasConfiguredLimits();
            const minVisKm = typeof limits.minVisibilityKm === 'number' ? limits.minVisibilityKm : 3.0;

            const limW = document.getElementById('rpasMetricLimitWind');
            const limT = document.getElementById('rpasMetricLimitTemp');
            const limR = document.getElementById('rpasMetricLimitRain');
            const limV = document.getElementById('rpasMetricLimitVis');
            if (limW) limW.textContent = `Máx: ${limits.maxWindKmh} km/h`;
            if (limT) limT.textContent = `${limits.minTempC}°C a ${limits.maxTempC}°C`;
            if (limR) limR.textContent = `Máx: ${limits.maxRainMm}mm / ${limits.maxRainProbPct}%`;
            if (limV) limV.textContent = `Mín: ${minVisKm.toFixed(1)} km`;

            if (!snapshot || !snapshot.hasValidGps || !snapshot.hasValidWeather) {
                const missingParts = [];
                if (!snapshot || !snapshot.hasValidGps) missingParts.push('coordenada GPS ativa do dispositivo');
                if (!snapshot || !snapshot.hasValidWeather) missingParts.push('telemetria climática local (Open-Meteo)');
                setRpasPanelIndeterminate(`Não foi possível obter ${missingParts.join(' e ')}. Ative o GPS e verifique a conexão para cruzar os parâmetros.`);
                return;
            }

            const gpsBadge = document.getElementById('rpasTelemetryGpsBadge');
            const coordsEl = document.getElementById('rpasTelemetryCoords');
            const altEl = document.getElementById('rpasTelemetryAltitude');
            const windEl = document.getElementById('rpasTelemetryWind');
            const wind80El = document.getElementById('rpasTelemetryWind80m');
            const tempEl = document.getElementById('rpasTelemetryTemp');
            const rainEl = document.getElementById('rpasTelemetryRain');
            const condEl = document.getElementById('rpasTelemetryCond');
            const visEl = document.getElementById('rpasTelemetryVis');
            const tsBadge = document.getElementById('rpasEvalTimestampBadge');

            if (gpsBadge) {
                gpsBadge.textContent = snapshot.isLiveGps ? 'GPS SATÉLITE' : 'GPS CACHE';
                gpsBadge.className = snapshot.isLiveGps
                    ? 'px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold bg-amber-950 text-amber-300 border border-amber-500/40';
            }
            if (coordsEl) coordsEl.textContent = `${snapshot.lat.toFixed(5)}, ${snapshot.lon.toFixed(5)}`;
            if (altEl) altEl.textContent = `Altitude local: ${snapshot.elevation !== null ? Math.round(snapshot.elevation) + 'm' : '-- m'}`;
            if (windEl) windEl.textContent = `${snapshot.windKmh} km/h (Raj: ${snapshot.gustsKmh} km/h)`;
            if (wind80El) wind80El.textContent = `Vento 80m: ${typeof snapshot.wind80mKmh === 'number' && !isNaN(snapshot.wind80mKmh) ? snapshot.wind80mKmh + ' km/h' : '-- km/h'}`;
            if (tempEl) tempEl.textContent = `${snapshot.tempC} °C`;
            if (rainEl) rainEl.textContent = `${snapshot.precipMm} mm • Prob: ${snapshot.rainProbPct}%`;
            if (condEl) condEl.textContent = `Condição: ${snapshot.conditionText}`;
            if (visEl) visEl.textContent = typeof snapshot.visibilityKm === 'number' && !isNaN(snapshot.visibilityKm) ? `${snapshot.visibilityKm.toFixed(1)} km` : '-- km';
            if (tsBadge) tsBadge.textContent = `Alta Res. • ${snapshot.timeStr}`;

            const selectedRpa = typeof window.getSelectedRpasAircraft === 'function' ? window.getSelectedRpasAircraft() : null;
            const singleEval = window.evaluateSingleRpasAgainstSnapshot(selectedRpa, snapshot);
            const exceededReasons = singleEval.reasons;

            const cardWind = document.getElementById('rpasMetricCardWind');
            const statusWind = document.getElementById('rpasMetricStatusWind');
            const maxMeasuredWind = Math.max(
                snapshot.windKmh,
                snapshot.gustsKmh,
                typeof snapshot.wind80mKmh === 'number' && !isNaN(snapshot.wind80mKmh) ? snapshot.wind80mKmh : 0
            );
            if (maxMeasuredWind > limits.maxWindKmh) {
                if (cardWind) cardWind.className = 'bg-red-950/40 p-3 rounded-xl border-2 border-red-500 space-y-1';
                if (statusWind) {
                    statusWind.textContent = 'LIMITE DE VENTO EXCEDIDO';
                    statusWind.className = 'text-[10px] font-mono text-red-400 font-extrabold block';
                }
            } else {
                if (cardWind) cardWind.className = 'bg-[#161616] p-3 rounded-xl border border-emerald-500/40 space-y-1';
                if (statusWind) {
                    statusWind.textContent = `Margem: ${(limits.maxWindKmh - maxMeasuredWind).toFixed(1)} km/h`;
                    statusWind.className = 'text-[10px] font-mono text-emerald-400 font-bold block';
                }
            }

            const cardTemp = document.getElementById('rpasMetricCardTemp');
            const statusTemp = document.getElementById('rpasMetricStatusTemp');
            if (snapshot.tempC > limits.maxTempC || snapshot.tempC < limits.minTempC) {
                if (cardTemp) cardTemp.className = 'bg-red-950/40 p-3 rounded-xl border-2 border-red-500 space-y-1';
                if (statusTemp) {
                    statusTemp.textContent = 'FORA DA FAIXA TÉRMICA';
                    statusTemp.className = 'text-[10px] font-mono text-red-400 font-extrabold block';
                }
            } else {
                if (cardTemp) cardTemp.className = 'bg-[#161616] p-3 rounded-xl border border-emerald-500/40 space-y-1';
                if (statusTemp) {
                    statusTemp.textContent = 'Faixa térmica segura';
                    statusTemp.className = 'text-[10px] font-mono text-emerald-400 font-bold block';
                }
            }

            const cardRain = document.getElementById('rpasMetricCardRain');
            const isRainWmo = snapshot.weatherCode >= 51;
            const rainExceeded = (snapshot.precipMm > limits.maxRainMm) || (limits.maxRainMm === 0 && isRainWmo) || (snapshot.rainProbPct > limits.maxRainProbPct);
            if (rainExceeded) {
                if (cardRain) cardRain.className = 'bg-red-950/40 p-3 rounded-xl border-2 border-red-500 space-y-1';
            } else {
                if (cardRain) cardRain.className = 'bg-[#161616] p-3 rounded-xl border border-emerald-500/40 space-y-1';
            }

            const cardVis = document.getElementById('rpasMetricCardVis');
            const statusVis = document.getElementById('rpasMetricStatusVis');
            const visExceeded = typeof snapshot.visibilityKm === 'number' && !isNaN(snapshot.visibilityKm) && snapshot.visibilityKm < minVisKm;
            if (visExceeded) {
                if (cardVis) cardVis.className = 'bg-red-950/40 p-3 rounded-xl border-2 border-red-500 space-y-1';
                if (statusVis) {
                    statusVis.textContent = 'VISIBILIDADE BAIXA';
                    statusVis.className = 'text-[10px] font-mono text-red-400 font-extrabold block';
                }
            } else {
                if (cardVis) cardVis.className = 'bg-[#161616] p-3 rounded-xl border border-emerald-500/40 space-y-1';
                if (statusVis) {
                    statusVis.textContent = 'VLOS adequado';
                    statusVis.className = 'text-[10px] font-mono text-emerald-400 font-bold block';
                }
            }

            window.renderRpasAutoFleetRecommendation(snapshot);

            const airspaceCautionReasons = evaluateRpasAirspaceCautionZones(snapshot.lat, snapshot.lon);
            const rpaLabel = selectedRpa ? `${selectedRpa.modelo} (${selectedRpa.prefixo})` : 'DJI Mavic 3 Enterprise (M3E)';

            const box = document.getElementById('rpasEvaluationStateBox');
            const iconBadge = document.getElementById('rpasEvalIconBadge');
            const titleEl = document.getElementById('rpasEvalStateTitle');
            const reasonsBox = document.getElementById('rpasEvalReasonsContainer');

            if (exceededReasons.length > 0) {
                if (box) {
                    box.className = 'bg-red-950/35 border-2 border-red-500 border-l-8 border-l-red-500 rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-[0_0_25px_rgba(220,38,38,0.25)]';
                }
                if (iconBadge) {
                    iconBadge.className = 'p-2.5 rounded-xl bg-red-600 text-white border border-red-400 shadow';
                    iconBadge.innerHTML = '<i data-lucide="octagon-alert" class="w-6 h-6"></i>';
                }
                if (titleEl) {
                    titleEl.textContent = 'VOO NÃO RECOMENDADO (LIMITE EXCEDIDO)';
                    titleEl.className = 'text-xl sm:text-2xl font-military uppercase tracking-wider text-red-400 leading-none mt-0.5';
                }
                if (reasonsBox) {
                    reasonsBox.innerHTML = `
                        <div class="text-red-300 font-extrabold uppercase text-[11px] mb-1">Aeronave: ${rpaLabel} • Motivo(s) Técnico(s) de Restrição:</div>
                        <ul class="list-disc pl-5 space-y-1 text-xs text-gray-100">
                            ${exceededReasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    `;
                }
            } else if (airspaceCautionReasons.length > 0) {
                if (box) {
                    box.className = 'bg-amber-950/35 border-2 border-amber-400 border-l-8 border-l-[#C5A869] rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)]';
                }
                if (iconBadge) {
                    iconBadge.className = 'p-2.5 rounded-xl bg-amber-500 text-pmmg-black border border-[#C5A869] shadow';
                    iconBadge.innerHTML = '<i data-lucide="alert-triangle" class="w-6 h-6"></i>';
                }
                if (titleEl) {
                    titleEl.textContent = 'VOE COM CUIDADO';
                    titleEl.className = 'text-xl sm:text-2xl font-military uppercase tracking-wider text-amber-300 leading-none mt-0.5';
                }
                if (reasonsBox) {
                    reasonsBox.innerHTML = `
                        <div class="text-amber-300 font-extrabold uppercase text-[11px] mb-1">
                            Aeronave: ${rpaLabel} • Clima Favorável, mas Área de Atenção de Tráfego Aéreo / Heliponto Detectada:
                        </div>
                        <ul class="list-disc pl-5 space-y-1 text-xs text-gray-100 mb-2">
                            ${airspaceCautionReasons.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                        <p class="text-[11px] text-pmmg-khaki font-semibold">
                            Meteorologia local dentro dos limites (Vento 10m: ${snapshot.windKmh} km/h, Vento 80m: ${snapshot.wind80mKmh ?? '--'} km/h, Rajadas: ${snapshot.gustsKmh} km/h, Temp: ${snapshot.tempC}°C, Chuva: ${snapshot.precipMm} mm, Visib.: ${snapshot.visibilityKm ? snapshot.visibilityKm.toFixed(1) + ' km' : '--'}). Exige autorização SARPAS (DECEA) ativa e vigilância constante de aeronaves tripuladas.
                        </p>
                    `;
                }
            } else {
                if (box) {
                    box.className = 'bg-emerald-950/30 border-2 border-emerald-500/80 border-l-8 border-l-emerald-400 rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.18)]';
                }
                if (iconBadge) {
                    iconBadge.className = 'p-2.5 rounded-xl bg-emerald-600 text-pmmg-black border border-emerald-300 shadow';
                    iconBadge.innerHTML = '<i data-lucide="check-circle-2" class="w-6 h-6"></i>';
                }
                if (titleEl) {
                    titleEl.textContent = 'VOO RECOMENDADO';
                    titleEl.className = 'text-xl sm:text-2xl font-military uppercase tracking-wider text-emerald-400 leading-none mt-0.5';
                }
                if (reasonsBox) {
                    reasonsBox.innerHTML = `
                        <p class="text-emerald-300 font-bold text-xs">
                            Aeronave: ${rpaLabel} • Todos os parâmetros meteorológicos de alta resolução na coordenada GPS atual (Vento 10m: ${snapshot.windKmh} km/h, Vento 80m: ${snapshot.wind80mKmh ?? '--'} km/h, Rajadas: ${snapshot.gustsKmh} km/h, Temp: ${snapshot.tempC}°C, Chuva: ${snapshot.precipMm} mm / ${snapshot.rainProbPct}%, Visibilidade: ${snapshot.visibilityKm ? snapshot.visibilityKm.toFixed(1) + ' km' : '--'}) estão dentro dos limites técnicos e fora de zonas críticas de aeródromo/heliponto. Mantenha verificação visual constante e protocolo SARPAS.
                        </p>
                    `;
                }
            }

            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Reproduz feedback de áudio meteorológico (Mavic 3 / RPAS) via controlador centralizado J.A.R.V.I.S.
        window.playDroneWeatherAudio = function(isFavorable) {
            try {
                if (typeof azimuteRpasAudioMuted !== 'undefined' && azimuteRpasAudioMuted) return;
                const clipKey = isFavorable
                    ? 'condicoes-meteorologicas-favoraveis'
                    : 'alerta-meteorologico-rajadas-vento';
                if (window.AzVoiceJarvis && typeof window.AzVoiceJarvis.speak === 'function') {
                    window.AzVoiceJarvis.speak('', clipKey, { noSynthFallback: true });
                    return;
                }
                const stealthBtn = document.getElementById('azHudStealthBtn');
                const isMuted = Boolean(
                    (window.azimuteTacState && window.azimuteTacState.stealthSilent) ||
                    (stealthBtn && stealthBtn.classList.contains('is-active')) ||
                    localStorage.getItem('az_stealth_silent_v1') === 'true'
                );
                if (isMuted) return;
                if (window._azRpasWeatherAudio) {
                    try {
                        window._azRpasWeatherAudio.pause();
                        window._azRpasWeatherAudio.currentTime = 0;
                    } catch (_) {}
                }
                const audio = new Audio('audio/jarvis/' + clipKey + '.mp3');
                window._azRpasWeatherAudio = audio;
                const p = audio.play();
                if (p && typeof p.catch === 'function') p.catch(function(err) { console.warn('[AZIMUTE][JARVIS]', err); });
            } catch (err) {
                console.warn('[AZIMUTE][JARVIS]', err);
            }
        };

        // Busca clima de alta confiabilidade e atualização em tempo real (Open-Meteo API com vento 10m/80m, rajadas, precipitação e visibilidade)
        window.evaluateRpasFlightConditions = async function(isManualTrigger) {
            const spinner = document.getElementById('rpasSyncSpinnerIcon');
            if (spinner) spinner.classList.add('animate-spin');

            let lat = azimuteLastGeoLat;
            let lon = azimuteLastGeoLon;
            let isLiveGps = (typeof azimuteLastGeoLat === 'number' && typeof azimuteLastGeoLon === 'number');

            if (!isLiveGps) {
                try {
                    const cLat = parseFloat(localStorage.getItem('azimute_last_lat'));
                    const cLon = parseFloat(localStorage.getItem('azimute_last_lon'));
                    if (!isNaN(cLat) && !isNaN(cLon)) {
                        lat = cLat;
                        lon = cLon;
                    }
                } catch (e) {}
            }

            if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
                if (spinner) spinner.classList.remove('animate-spin');
                setRpasPanelIndeterminate('Coordenada GPS ainda não disponível. Permita o acesso à localização do dispositivo para cruzar com o clima local.');
                return;
            }

            if (navigator.onLine === false) {
                if (spinner) spinner.classList.remove('animate-spin');
                setRpasPanelIndeterminate('Dispositivo offline sem telemetria meteorológica em tempo real. Não é possível validar vento, rajadas, chuva e visibilidade atuais.');
                return;
            }

            try {
                // Consulta Open-Meteo focada exclusivamente no objeto current (tempo real no minuto atual)
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(6)}&longitude=${lon.toFixed(6)}&models=best_match&current=temperature_2m,precipitation,rain,showers,weather_code,wind_speed_10m,wind_gusts_10m,visibility&wind_speed_unit=kmh&timezone=America%2FSao_Paulo&_cb=${Date.now()}`;
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) throw new Error('Falha HTTP Open-Meteo');
                const data = await res.json();

                if (!data || !data.current) {
                    throw new Error('Payload meteorológico incompleto');
                }

                const cur = data.current;
                let visibilityMeters = typeof cur.visibility === 'number' ? cur.visibility : null;
                const visibilityKm = visibilityMeters !== null && !isNaN(visibilityMeters) ? Number((visibilityMeters / 1000).toFixed(1)) : null;

                // Verificação estrita baseada EXCLUSIVAMENTE no clima atual (tempo real)
                const precipCurrent = Number(cur.precipitation || 0);
                const rainCurrent = Number(cur.rain || 0);
                const showersCurrent = Number(cur.showers || 0);
                const wCode = Number(cur.weather_code || 0);
                
                // WMO weather codes que indicam chuva/tempestade ativa AGORA (ex: 51-67, 80-82, 95-99)
                const isRainingNow = (precipCurrent > 0) || (rainCurrent > 0) || (showersCurrent > 0) || (wCode >= 51 && wCode <= 67) || (wCode >= 80 && wCode <= 82) || (wCode >= 95);
                const currentRainProbApprox = isRainingNow ? 100 : 0;

                const newSnapshot = {
                    hasValidGps: true,
                    hasValidWeather: true,
                    isLiveGps,
                    lat,
                    lon,
                    elevation: typeof data.elevation === 'number' ? data.elevation : null,
                    tempC: Number(cur.temperature_2m),
                    windKmh: Number(cur.wind_speed_10m),
                    wind80mKmh: null,
                    gustsKmh: Number(cur.wind_gusts_10m !== undefined ? cur.wind_gusts_10m : cur.wind_speed_10m),
                    precipMm: precipCurrent,
                    rainProbPct: currentRainProbApprox,
                    visibilityKm,
                    weatherCode: wCode,
                    conditionText: typeof decodeWmoWeather === 'function' ? decodeWmoWeather(wCode) : 'Monitorado',
                    timeStr: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                };

                const limits = getRpasConfiguredLimits();
                const alertReasons = [];
                const prev = azimuteRpasLastWeatherSnapshot;

                if (prev && prev.hasValidWeather) {
                    const windDelta = newSnapshot.windKmh - prev.windKmh;
                    const gustDelta = newSnapshot.gustsKmh - prev.gustsKmh;
                    if (windDelta >= 7) {
                        alertReasons.push(`Aumento brusco de vento sustentado: subiu +${windDelta.toFixed(1)} km/h (de ${prev.windKmh} para ${newSnapshot.windKmh} km/h).`);
                    }
                    if (gustDelta >= 8) {
                        alertReasons.push(`Aumento brusco de rajadas: subiu +${gustDelta.toFixed(1)} km/h (de ${prev.gustsKmh} para ${newSnapshot.gustsKmh} km/h).`);
                    }
                }

                const peakWind = Math.max(newSnapshot.windKmh, newSnapshot.gustsKmh, 0);
                if (peakWind > limits.maxWindKmh) {
                    alertReasons.push(`Vento/Rajada atual (${peakWind} km/h) acima do limite técnico da aeronave (${limits.maxWindKmh} km/h).`);
                }
                // Validação de chuva estritamente no momento atual (ignorando previsões noturnas ou futuras)
                if (newSnapshot.precipMm > 0 || (newSnapshot.weatherCode >= 51 && newSnapshot.weatherCode <= 67) || (newSnapshot.weatherCode >= 80 && newSnapshot.weatherCode <= 82) || (newSnapshot.weatherCode >= 95)) {
                    alertReasons.push(`Chuva/Precipitação ativa detectada no momento atual (${newSnapshot.precipMm} mm • ${newSnapshot.conditionText}). Voo não recomendado com precipitação ativa.`);
                }

                azimuteRpasLastWeatherSnapshot = newSnapshot;
                renderRpasEvaluationResult(newSnapshot, !isManualTrigger);

                try {
                    const selectedRpaAudio = typeof window.getSelectedRpasAircraft === 'function' ? window.getSelectedRpasAircraft() : null;
                    const singleEvalAudio = typeof window.evaluateSingleRpasAgainstSnapshot === 'function'
                        ? window.evaluateSingleRpasAgainstSnapshot(selectedRpaAudio, newSnapshot)
                        : { reasons: [] };
                    const isFavorableWeather = (!singleEvalAudio || !singleEvalAudio.reasons || singleEvalAudio.reasons.length === 0) && alertReasons.length === 0;
                    if (typeof window.playDroneWeatherAudio === 'function') {
                        window.playDroneWeatherAudio(isFavorableWeather);
                    }
                } catch (_) {}

                const viewRpas = document.getElementById('view-rpas');
                if (viewRpas && !viewRpas.classList.contains('hidden') && alertReasons.length > 0) {
                    window.triggerRpasWeatherChangeAlert(alertReasons, false);
                }
            } catch (err) {
                setRpasPanelIndeterminate('Não foi possível consultar a telemetria meteorológica local no momento. Verifique a conexão de dados.');
            } finally {
                if (spinner) spinner.classList.remove('animate-spin');
            }
        };

        // Desativa polling automático de clima na aba RPAS: busca apenas sob demanda ao clicar no botão
        function manageRpasPeriodicWeatherMonitor() {
            if (azimuteRpasPeriodicIntervalId) {
                clearInterval(azimuteRpasPeriodicIntervalId);
                azimuteRpasPeriodicIntervalId = null;
            }
        }

        (function initRpasModuleObserver() {
            document.addEventListener('DOMContentLoaded', () => {
                const viewRpas = document.getElementById('view-rpas');
                if (viewRpas && typeof MutationObserver !== 'undefined') {
                    const obs = new MutationObserver(() => {
                        manageRpasPeriodicWeatherMonitor();
                    });
                    obs.observe(viewRpas, { attributes: true, attributeFilter: ['class'] });
                }
            });
        })();

        

        function saveDroneNotes(showNotification = false) {
            const fields = [
                { id: 'droneNotepadMineirao', key: 'pmmg_mineirao_drone_notes' },
                { id: 'droneHeightMineirao', key: 'pmmg_mineirao_drone_height' },
                { id: 'droneSignalMineirao', key: 'pmmg_mineirao_drone_signal' },
                { id: 'droneCollisionMineirao', key: 'pmmg_mineirao_drone_collision' },
                { id: 'droneDifficultiesMineirao', key: 'pmmg_mineirao_drone_difficulties' },
                { id: 'droneNotepadArenaMrv', key: 'pmmg_arenamrv_drone_notes' },
                { id: 'droneHeightArenaMrv', key: 'pmmg_arenamrv_drone_height' },
                { id: 'droneSignalArenaMrv', key: 'pmmg_arenamrv_drone_signal' },
                { id: 'droneCollisionArenaMrv', key: 'pmmg_arenamrv_drone_collision' },
                { id: 'droneDifficultiesArenaMrv', key: 'pmmg_arenamrv_drone_difficulties' },
                { id: 'droneNotepadIndependencia', key: 'pmmg_independencia_drone_notes' },
                { id: 'droneHeightIndependencia', key: 'pmmg_independencia_drone_height' },
                { id: 'droneSignalIndependencia', key: 'pmmg_independencia_drone_signal' },
                { id: 'droneCollisionIndependencia', key: 'pmmg_independencia_drone_collision' },
                { id: 'droneDifficultiesIndependencia', key: 'pmmg_independencia_drone_difficulties' }
            ];
            fields.forEach(f => {
                const el = document.getElementById(f.id);
                if (el) {
                    try { localStorage.setItem(f.key, el.value); } catch (e) {}
                }
            });
            if (typeof window.syncAllNotesToCloud === 'function') {
                window.syncAllNotesToCloud();
            }
            const statusEl = document.getElementById('droneNoteStatus');
            const paramsStatusEl = document.getElementById('droneParamsSaveStatus');
            if (statusEl) statusEl.textContent = 'Observações de voo salvas na nuvem.';
            if (paramsStatusEl) paramsStatusEl.textContent = 'Dados salvos na nuvem.';
            if (showNotification) {
                showToast('Informações de Drone (RPAS) salvas na nuvem!');
            }
        }

        function loadDroneNotes() {
            const fields = [
                { id: 'droneNotepadMineirao', key: 'pmmg_mineirao_drone_notes' },
                { id: 'droneHeightMineirao', key: 'pmmg_mineirao_drone_height' },
                { id: 'droneSignalMineirao', key: 'pmmg_mineirao_drone_signal' },
                { id: 'droneCollisionMineirao', key: 'pmmg_mineirao_drone_collision' },
                { id: 'droneDifficultiesMineirao', key: 'pmmg_mineirao_drone_difficulties' },
                { id: 'droneNotepadArenaMrv', key: 'pmmg_arenamrv_drone_notes' },
                { id: 'droneHeightArenaMrv', key: 'pmmg_arenamrv_drone_height' },
                { id: 'droneSignalArenaMrv', key: 'pmmg_arenamrv_drone_signal' },
                { id: 'droneCollisionArenaMrv', key: 'pmmg_arenamrv_drone_collision' },
                { id: 'droneDifficultiesArenaMrv', key: 'pmmg_arenamrv_drone_difficulties' },
                { id: 'droneNotepadIndependencia', key: 'pmmg_independencia_drone_notes' },
                { id: 'droneHeightIndependencia', key: 'pmmg_independencia_drone_height' },
                { id: 'droneSignalIndependencia', key: 'pmmg_independencia_drone_signal' },
                { id: 'droneCollisionIndependencia', key: 'pmmg_independencia_drone_collision' },
                { id: 'droneDifficultiesIndependencia', key: 'pmmg_independencia_drone_difficulties' }
            ];
            fields.forEach(f => {
                const saved = localStorage.getItem(f.key);
                const el = document.getElementById(f.id);
                if (saved && el) el.value = saved;
            });
        }


        // NOTIFICAÇÃO DE RUA NA TELA BLOQUEADA DO CELULAR (LOCK SCREEN)
        window.toggleLockScreenStreetNotify = async function toggleLockScreenStreetNotify() {
            if (!('Notification'in window)) {
                alert('Seu navegador não suporta notificações na tela bloqueada.');
                return;
            }
            if (!lockScreenNotifyEnabled) {
                const perm = await Notification.requestPermission();
                if (perm === 'granted') {
                    lockScreenNotifyEnabled = true;
                    document.getElementById('lblLockNotify').textContent = 'Tela Bloq. ATIVA';
                    document.getElementById('btnLockScreenNotify').className = 'py-2 px-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/60 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow transition-all';
                    sendStreetLockNotification();
                    if (typeof showToast === 'function') showToast('Nome da rua aparecerá na tela de bloqueio!');
                } else {
                    alert('Permita as notificações no navegador para ver a rua na tela bloqueada.');
                }
            } else {
                lockScreenNotifyEnabled = false;
                document.getElementById('lblLockNotify').textContent = 'Rua na Tela Bloq.';
                document.getElementById('btnLockScreenNotify').className = 'py-2 px-2.5 rounded-xl bg-pmmg-dark hover:bg-pmmg-border text-pmmg-khaki border border-pmmg-khaki/40 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow transition-all';
            }
        }

        function sendStreetLockNotification() {
            if (!lockScreenNotifyEnabled || Notification.permission !== 'granted') return;
            const street = document.getElementById('hudCurrentStreet').textContent;
            const radio = document.getElementById('hudRadioChannel').textContent;
            const hosp = document.getElementById('hudClosestHospital').textContent;
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(reg => {
                    reg.showNotification(' ' + street, {
                        body: radio + ' | Socorro: ' + hosp,
                        tag: 'azimute-qth-live',
                        renotify: false,
                        silent: true
                    });
                });
            }
        }

        // MONITORAMENTO DE CLIMA E ALERTA DE VIAS DE ALAGAMENTO (OPEN-METEO GRATUITO SEM CHAVE)
        window.checkWeatherAndFloodRisk = async function checkWeatherAndFloodRisk() {
            const banner = document.getElementById('weatherFloodBanner');
            const txt = document.getElementById('weatherForecastText');
            const list = document.getElementById('floodZonesList');
            banner.classList.remove('hidden');

            const lat = azimuteLastGeoLat || -19.9162;
            const lon = azimuteLastGeoLon || -44.0809;

            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain&hourly=precipitation_probability,rain&forecast_days=1&timezone=America%2FSao_Paulo`;
                const res = await fetch(url);
                const data = await res.json();
                const temp = data.current ? data.current.temperature_2m : '--';
                const rainNow = data.current ? data.current.precipitation : 0;
                const probs = data.hourly ? data.hourly.precipitation_probability.slice(0, 6) : [];
                const maxProb = probs.length ? Math.max(...probs) : 0;

                txt.innerHTML = `<strong>Temperatura Atual:</strong> ${temp}°C • <strong>Chuva Agora:</strong> ${rainNow} mm • <strong>Probabilidade próx. horas:</strong> <span class="${maxProb >= 60 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}">${maxProb}%</span>`;

                const zonas = (AZIMUTE_DB && AZIMUTE_DB.zonas_alagamento_chuva) ? AZIMUTE_DB.zonas_alagamento_chuva : [
                    { via: "Av. Vilarinho / Av. Álvaro Camargos (49º BPM)", risco: "CRÍTICO", alternativa: "Evitar fundo de vale; usar Rua Padre Pedro Pinto." },
                    { via: "Av. Tereza Cristina - Córrego Ferrugem/Arrudas (5º/39º BPM)", risco: "CRÍTICO", alternativa: "Desviar pela Via Expressa ou Av. Amazonas." },
                    { via: "Av. General David Sarnoff / Praça da Cemig (39º BPM)", risco: "ALTO", alternativa: "Usar vias superiores do Eldorado." }
                ];

                list.innerHTML = `<strong class="text-amber-300 block mt-1">Vias Críticas para Evitar em Chuva Forte:</strong>` +
                    zonas.map(z => `<div class="bg-pmmg-dark p-2 rounded border border-red-500/30 text-[11px]">
                        <strong class="text-red-400">${z.via} (${z.risco}):</strong> <span class="text-gray-300">${z.alternativa}</span>
                    </div>`).join('');
            } catch (e) {
                txt.textContent = 'Modo Offline: Exibindo carta preventiva de pontos críticos de alagamento na RMBH.';
            }
        };

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
  const calcDistAndBearing = Az.calcDistAndBearing;
  const renderEdgeIndicators = Az.renderEdgeIndicators;
  const SVG_ICONS = Az.SVG_ICONS;
  const calcTraceDistanceMeters = Az.calcTraceDistanceMeters;
  const canDrawOnMap = Az.canDrawOnMap;
  const clearBloodhoundMarker = Az.clearBloodhoundMarker;
  const openPinEditorModal = Az.openPinEditorModal;
  const renderTerrainTracesOnMaps = Az.renderTerrainTracesOnMaps;
  const saveTerrainTracesToStorage = Az.saveTerrainTracesToStorage;
  const scanAndCaptureExistingMaps = Az.scanAndCaptureExistingMaps;
  const setBloodhoundTarget = Az.setBloodhoundTarget;
  const togglePegadasForUid = Az.togglePegadasForUid;
  const toggleSatelliteMode = Az.toggleSatelliteMode;
  const upsertTacticalPin = Az.upsertTacticalPin;

  // ==================== ORBITAR GLOBO (CONTROLE POR ÍCONES: SENTIDO, VELOCIDADE, PARAR/CONTINUAR/FECHAR) ====================
  function bindInstantTap(el, handler) {
    if (!el) return;
    let lastTouchTs = 0;
    el.addEventListener("pointerdown", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      lastTouchTs = Date.now();
      handler(ev);
    });
    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (Date.now() - lastTouchTs < 380) return;
      handler(ev);
    });
  }

  function syncOrbitControlUi() {
    const ccw = document.getElementById("azOrbitDirCcwBtn");
    const cw = document.getElementById("azOrbitDirCwBtn");
    const dir = tac._orbitDir === -1 ? -1 : 1;
    if (ccw) ccw.classList.toggle("is-active", dir === -1);
    if (cw) cw.classList.toggle("is-active", dir === 1);

    const spd = Number(tac._orbitSpeedDeg) || 26;
    document.querySelectorAll("#azOrbitStopPill [data-orbit-speed]").forEach(function (b) {
      const val = Number(b.getAttribute("data-orbit-speed"));
      b.classList.toggle("is-active", val === spd);
    });

    const pauseBtn = document.getElementById("azOrbitPauseBtn");
    const resumeBtn = document.getElementById("azOrbitResumeBtn");
    const isPaused = Boolean(tac._orbitPaused);
    if (pauseBtn) pauseBtn.classList.toggle("is-active", tac._orbitActive && isPaused);
    if (resumeBtn) resumeBtn.classList.toggle("is-run", tac._orbitActive && !isPaused);
  }

  let _orbitWaitUntilTs = 0;
  function runOrbitLoop(delayMs) {
    if (tac._orbitRaf) {
      cancelAnimationFrame(tac._orbitRaf);
      tac._orbitRaf = 0;
    }
    const m = getActiveMap();
    const center = tac._orbitCenter;
    if (!m || !center || typeof m.jumpTo !== "function") return;
    let curBearing = typeof m.getBearing === "function" ? m.getBearing() : 0;
    let lastTs = performance.now();
    _orbitWaitUntilTs = lastTs + (delayMs || 0);
    function stepOrbit(now) {
      if (!tac._orbitActive || tac._orbitPaused) {
        tac._orbitRaf = 0;
        return;
      }
      const dt = Math.min(0.08, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;
      if (now >= _orbitWaitUntilTs) {
        const dir = tac._orbitDir === -1 ? -1 : 1;
        const spd = Number(tac._orbitSpeedDeg) || 26;
        curBearing = ((curBearing + dt * spd * dir) % 360 + 360) % 360;
        try {
          m.jumpTo({ center: [center.lng, center.lat], bearing: curBearing, pitch: 58 });
        } catch (_) {}
      } else {
        curBearing = typeof m.getBearing === "function" ? m.getBearing() : curBearing;
      }
      tac._orbitRaf = requestAnimationFrame(stepOrbit);
    }
    tac._orbitRaf = requestAnimationFrame(stepOrbit);
  }

  function pauseMapOrbit() {
    if (!tac._orbitActive) return;
    if (tac._orbitRaf) {
      cancelAnimationFrame(tac._orbitRaf);
      tac._orbitRaf = 0;
    }
    tac._orbitPaused = true;
    syncOrbitControlUi();
  }

  function resumeMapOrbit() {
    if (!tac._orbitActive || !tac._orbitCenter) return;
    tac._orbitPaused = false;
    const m = getActiveMap();
    if (m && typeof m.easeTo === "function") {
      try { m.easeTo({ center: [tac._orbitCenter.lng, tac._orbitCenter.lat], pitch: 58, duration: 220 }); } catch (_) {}
    }
    syncOrbitControlUi();
    runOrbitLoop(230);
  }

  function stopMapOrbit(restorePitch) {
    if (tac._orbitRaf) {
      cancelAnimationFrame(tac._orbitRaf);
      tac._orbitRaf = 0;
    }
    const wasActive = Boolean(tac._orbitActive);
    tac._orbitActive = false;
    tac._orbitPaused = false;
    tac._orbitCenter = null;
    const pill = document.getElementById("azOrbitStopPill");
    if (pill) pill.classList.remove("is-open");
    syncOrbitControlUi();
    if (wasActive && restorePitch !== false) {
      const m = getActiveMap();
      if (m && typeof m.easeTo === "function") {
        try { m.easeTo({ pitch: tac._orbitPrevPitch || 0, duration: 420 }); } catch (_) {}
      }
    }
  }

  function startMapOrbitAround(lng, lat) {
    const m = getActiveMap();
    if (!m || typeof m.jumpTo !== "function") return;
    stopMapOrbit(false);
    tac._orbitPrevPitch = typeof m.getPitch === "function" ? m.getPitch() : 0;
    tac._orbitCenter = { lng: lng, lat: lat };
    tac._orbitActive = true;
    tac._orbitPaused = false;
    if (tac._orbitDir !== -1 && tac._orbitDir !== 1) tac._orbitDir = 1;
    if (![10, 26, 60].includes(Number(tac._orbitSpeedDeg))) tac._orbitSpeedDeg = 26;

    const pill = document.getElementById("azOrbitStopPill");
    if (pill) pill.classList.add("is-open");
    syncOrbitControlUi();

    const targetZoom = Math.max(typeof m.getZoom === "function" ? m.getZoom() : 17, 17.5);
    if (typeof m.easeTo === "function") {
      m.easeTo({ center: [lng, lat], zoom: targetZoom, pitch: 58, duration: 360 });
    }
    runOrbitLoop(380);
    showToast("Órbita ativa em torno do ponto fixo.");
  }

  (function bindOrbitBarControls() {
    const pill = document.getElementById("azOrbitStopPill");
    if (pill) {
      pill.addEventListener("pointerdown", function (ev) { ev.stopPropagation(); });
      pill.addEventListener("touchstart", function (ev) { ev.stopPropagation(); }, { passive: true });
      pill.addEventListener("click", function (ev) { ev.stopPropagation(); });
    }
    bindInstantTap(document.getElementById("azOrbitDirCcwBtn"), function () {
      tac._orbitDir = -1;
      _orbitWaitUntilTs = 0;
      syncOrbitControlUi();
    });
    bindInstantTap(document.getElementById("azOrbitDirCwBtn"), function () {
      tac._orbitDir = 1;
      _orbitWaitUntilTs = 0;
      syncOrbitControlUi();
    });
    document.querySelectorAll("#azOrbitStopPill [data-orbit-speed]").forEach(function (btn) {
      bindInstantTap(btn, function () {
        const spd = Number(btn.getAttribute("data-orbit-speed"));
        if (spd > 0) {
          tac._orbitSpeedDeg = spd;
          _orbitWaitUntilTs = 0;
          syncOrbitControlUi();
        }
      });
    });
    bindInstantTap(document.getElementById("azOrbitPauseBtn"), pauseMapOrbit);
    bindInstantTap(document.getElementById("azOrbitResumeBtn"), resumeMapOrbit);
    bindInstantTap(document.getElementById("azOrbitCloseBtn"), function () {
      stopMapOrbit(true);
    });
  })();
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && tac._orbitActive) stopMapOrbit(true);
  });

  // ==================== MODO DRONE COMPLETO (ÁUDIO DJI, STICKS, BARRA EDITÁVEL E GIMBAL) ====================
  const droneSticks = { leftX: 0, leftY: 0, rightX: 0, rightY: 0 };
  const DRONE_CFG_KEY = "az_tac_drone_cfg_v1";
  const DRONE_BAR_KEY = "az_tac_drone_bar_v1";
  const DRONE_DEFAULT_CFG = { soundOn: true, humOn: true, flightMode: 2, altSens: 1.0, yawSens: 1.0, pitchSens: 1.0, rollSens: 1.0 };
  const DRONE_SHORTCUT_CATALOG = [
    { id: "pin", label: "+ PIN" },
    { id: "sat", label: "SATÉLITE" },
    { id: "hospitals", label: "HOSPITAIS" },
    { id: "batalhoes", label: "BATALHÕES" },
    { id: "deplans", label: "DEPLAN" },
    { id: "radar", label: "CLIMA" },
    { id: "enlace", label: "ENLACE" },
    { id: "comms", label: "EQUIPE/PTT" }
  ];

  function loadDroneCfg() {
    try {
      const raw = localStorage.getItem(DRONE_CFG_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return Object.assign({}, DRONE_DEFAULT_CFG, parsed || {});
    } catch (_) {
      return Object.assign({}, DRONE_DEFAULT_CFG);
    }
  }
  let droneCfg = loadDroneCfg();
  function saveDroneCfg() {
    try { localStorage.setItem(DRONE_CFG_KEY, JSON.stringify(droneCfg)); } catch (_) {}
  }

  function loadDroneBarShortcuts() {
    try {
      const raw = localStorage.getItem(DRONE_BAR_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(function (id) {
        return DRONE_SHORTCUT_CATALOG.some(function (c) { return c.id === id; });
      }) : [];
    } catch (_) {
      return [];
    }
  }
  let droneBarShortcuts = loadDroneBarShortcuts();
  function saveDroneBarShortcuts() {
    try { localStorage.setItem(DRONE_BAR_KEY, JSON.stringify(droneBarShortcuts)); } catch (_) {}
  }

  // Síntese Web Audio API 100% Offline (Som característico DJI RC-N1/RC230, isolado do PTT)
  let _azDroneAudioCtx = null;
  function getDroneAudioCtx() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!_azDroneAudioCtx) _azDroneAudioCtx = new Ctx();
      if (_azDroneAudioCtx.state === "suspended" && typeof _azDroneAudioCtx.resume === "function") {
        _azDroneAudioCtx.resume().catch(function () {});
      }
      return _azDroneAudioCtx;
    } catch (_) {
      return null;
    }
  }

  // ==================== CENTRAL DE VOZ TÁTICA J.A.R.V.I.S. + MODO FURTIVO ====================
  const JARVIS_NATO = {
    A:"Alfa",B:"Bravo",C:"Charlie",D:"Delta",E:"Eco",F:"Foxtrot",G:"Golf",H:"Hotel",
    I:"India",J:"Juliet",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",
    Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",
    X:"X-Ray",Y:"Yankee",Z:"Zulu"
  };
  const JARVIS_SPRITE_URL = "AUDIO JARVIS/AUDIO JARVIS 21 FALAS.mp3";
  const JARVIS_SPRITE_CLIPS = {
    "drone-no-ar": [0.0, 0.92],
    "iniciando-reconhecimento-perimetro": [0.95, 3.08],
    "recon_start": [0.0, 3.08],
    "recon_divergent": [3.45, 9.15],
    "recon_done": [9.15, 13.05],
    "recon_bg_done": [13.05, 16.25],
    "domo_limit": [16.25, 19.05],
    "domo_on": [19.05, 22.05],
    "domo_out": [22.05, 25.15],
    "domo_in": [25.15, 27.35],
    "ponto_alfa": [27.35, 29.35],
    "ponto_bravo": [29.35, 31.35],
    "ponto_charlie": [31.35, 33.35],
    "ponto_delta": [33.35, 35.15],
    "ponto_eco": [35.15, 36.75],
    "nova_msg": [36.75, 38.65],
    "condicoes-meteorologicas-favoraveis": [38.65, 42.45],
    "alerta-meteorologico-rajadas-vento": [42.45, 51.55],
    "rota_aprox": [51.55, 55.55],
    "exposicao_visual": [55.55, 59.5]
  };
  window.AzVoiceJarvis = {
    enabled: localStorage.getItem("az_jarvis_voice_v1") !== "false",
    _activeAudio: null,
    _activeSource: null,
    _spriteCtx: null,
    _spriteBuffer: null,
    _spriteLoading: null,
    _spriteStopTimer: null,
    _isSpeaking: false,
    _radioActive: false,
    _savedSecondaryState: null,
    isRadioPriorityActive: function () {
      return Boolean(this._radioActive || (typeof tac !== "undefined" && tac.isRecordingPtt));
    },
    _pauseSecondarySounds: function () {
      try {
        const humWasActive = Boolean(
          (typeof _azAvataAudioEl !== "undefined" && _azAvataAudioEl) ||
          (typeof _azDroneHumNodes !== "undefined" && _azDroneHumNodes)
        );
        if (!this._savedSecondaryState) {
          this._savedSecondaryState = { humWasActive: humWasActive };
        } else if (humWasActive) {
          this._savedSecondaryState.humWasActive = true;
        }
        if (typeof stopDroneRotorHum === "function") stopDroneRotorHum();
      } catch (err) {
        console.warn("[AZIMUTE][JARVIS] Falha ao pausar sons secundários:", err);
      }
    },
    _resumeSecondarySoundsIfAllowed: function () {
      try {
        if (this._isSpeaking || this.isRadioPriorityActive()) return;
        if (typeof tac !== "undefined" && (tac.stealthSilent || tac.audioMuted)) return;
        if (this._savedSecondaryState && this._savedSecondaryState.humWasActive) {
          this._savedSecondaryState = null;
          if (typeof tac !== "undefined" && tac.droneMode && typeof startDroneRotorHum === "function") {
            startDroneRotorHum();
          }
        }
      } catch (err) {
        console.warn("[AZIMUTE][JARVIS] Falha ao retomar sons secundários:", err);
      }
    },
    _loadSpriteBuffer: function () {
      const self = this;
      if (self._spriteBuffer) return Promise.resolve(self._spriteBuffer);
      if (self._spriteLoading) return self._spriteLoading;
      self._spriteLoading = (async function () {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return null;
          if (!self._spriteCtx) self._spriteCtx = new AudioCtx();
          if (self._spriteCtx.state === "suspended") {
            try { await self._spriteCtx.resume(); } catch (_) {}
          }
          const resp = await fetch(encodeURI(JARVIS_SPRITE_URL));
          if (!resp.ok) return null;
          const arrBuf = await resp.arrayBuffer();
          self._spriteBuffer = await self._spriteCtx.decodeAudioData(arrBuf);
          return self._spriteBuffer;
        } catch (err) {
          console.warn("[AZIMUTE][JARVIS] Sprite WebAudio indisponível:", err);
          return null;
        } finally {
          self._spriteLoading = null;
        }
      })();
      return self._spriteLoading;
    },
    stop: function (keepSecondaryPaused) {
      try {
        if (this._spriteStopTimer) {
          clearTimeout(this._spriteStopTimer);
          this._spriteStopTimer = null;
        }
        if (this._activeSource) {
          try { this._activeSource.onended = null; this._activeSource.stop(); } catch (_) {}
          this._activeSource = null;
        }
        if (this._activeAudio) {
          this._activeAudio.onended = null;
          this._activeAudio.onerror = null;
          this._activeAudio.pause();
          this._activeAudio.currentTime = 0;
          this._activeAudio = null;
        }
        if (window.speechSynthesis) {
          try { window.speechSynthesis.cancel(); } catch (_) {}
        }
      } catch (err) {
        console.warn("[AZIMUTE][JARVIS] Falha ao parar áudio:", err);
      }
      this._isSpeaking = false;
      if (!keepSecondaryPaused) this._resumeSecondarySoundsIfAllowed();
    },
    setRadioActive: function (active) {
      this._radioActive = Boolean(active);
      if (this._radioActive) {
        this._pauseSecondarySounds();
        this.stop(true);
      } else {
        this._resumeSecondarySoundsIfAllowed();
      }
    },
    setEnabled: function (on) {
      this.enabled = Boolean(on);
      try { localStorage.setItem("az_jarvis_voice_v1", this.enabled ? "true" : "false"); } catch (_) {}
      if (!this.enabled) this.stop(false);
    },
    toNatoPhonetic: function (text) {
      return String(text || "").replace(/\b(Ponto|B|A)\s*([A-Z])\b/gi, function (_, pfx, ch) {
        const nato = JARVIS_NATO[ch.toUpperCase()] || ch;
        return pfx + " " + nato;
      }).replace(/\b([A-Z])(\d+)\b/g, function (_, ch, num) {
        return (JARVIS_NATO[ch.toUpperCase()] || ch) + " " + num;
      });
    },
    speak: function (rawText, clipKey, opts) {
      try {
        if ((typeof tac !== "undefined" && (tac.stealthSilent || tac.audioMuted)) || !this.enabled || this.isRadioPriorityActive()) return;
        const self = this;
        const text = this.toNatoPhonetic(rawText);
        const noSynth = Boolean(opts && opts.noSynthFallback);

        this.stop(true);
        this._pauseSecondarySounds();
        this._isSpeaking = true;

        const finishSpeech = function () {
          if (self._spriteStopTimer) {
            clearTimeout(self._spriteStopTimer);
            self._spriteStopTimer = null;
          }
          self._isSpeaking = false;
          self._activeAudio = null;
          self._activeSource = null;
          self._resumeSecondarySoundsIfAllowed();
        };

        const fallbackSynth = function () {
          if (noSynth || !text || self.isRadioPriorityActive()) {
            finishSpeech();
            return;
          }
          try {
            if (!("speechSynthesis" in window)) {
              finishSpeech();
              return;
            }
            const u = new SpeechSynthesisUtterance(text);
            u.lang = "pt-BR";
            u.rate = 0.98;
            u.pitch = 0.85;
            const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            const ptMale = voices.find(function (v) { return /pt/i.test(v.lang) && /daniel|felipe|google/i.test(v.name); })
              || voices.find(function (v) { return /pt/i.test(v.lang); });
            if (ptMale) u.voice = ptMale;
            u.onend = finishSpeech;
            u.onerror = finishSpeech;
            window.speechSynthesis.speak(u);
          } catch (err) {
            console.warn("[AZIMUTE][JARVIS] Falha na síntese de voz:", err);
            finishSpeech();
          }
        };

        const playSpriteHtmlFallback = function (range) {
          try {
            const aud = new Audio(encodeURI(JARVIS_SPRITE_URL));
            aud.volume = 0.9;
            self._activeAudio = aud;
            const durMs = Math.max(250, (range[1] - range[0]) * 1000);
            aud.addEventListener("loadedmetadata", function () {
              try {
                if (self.isRadioPriorityActive()) { self.stop(true); return; }
                aud.currentTime = range[0];
                const p = aud.play();
                if (p && typeof p.catch === "function") p.catch(fallbackSynth);
                self._spriteStopTimer = setTimeout(function () {
                  try { aud.pause(); } catch (_) {}
                  finishSpeech();
                }, durMs);
              } catch (_) { fallbackSynth(); }
            }, { once: true });
            aud.onerror = fallbackSynth;
          } catch (_) { fallbackSynth(); }
        };

        const spriteRange = clipKey && JARVIS_SPRITE_CLIPS[clipKey];
        if (spriteRange) {
          self._loadSpriteBuffer().then(function (buf) {
            if (self.isRadioPriorityActive() || !self._isSpeaking) return;
            if (buf && self._spriteCtx) {
              try {
                if (self._spriteCtx.state === "suspended") self._spriteCtx.resume();
                const src = self._spriteCtx.createBufferSource();
                src.buffer = buf;
                const gain = self._spriteCtx.createGain();
                gain.gain.value = 0.92;
                src.connect(gain);
                gain.connect(self._spriteCtx.destination);
                self._activeSource = src;
                const offset = Math.max(0, spriteRange[0]);
                const dur = Math.max(0.2, Math.min(buf.duration - offset, spriteRange[1] - offset));
                src.onended = finishSpeech;
                src.start(0, offset, dur);
                return;
              } catch (err) {
                console.warn("[AZIMUTE][JARVIS] Falha WebAudio sprite:", err);
              }
            }
            playSpriteHtmlFallback(spriteRange);
          }).catch(function () {
            playSpriteHtmlFallback(spriteRange);
          });
          return;
        }

        if (clipKey) {
          try {
            const aud = new Audio("audio/jarvis/" + clipKey + ".mp3");
            aud.volume = 0.88;
            this._activeAudio = aud;
            aud.onended = finishSpeech;
            aud.onerror = function (err) {
              console.warn("[AZIMUTE][JARVIS] Clipe ausente ou bloqueado:", clipKey, err);
              fallbackSynth();
            };
            const p = aud.play();
            if (p && typeof p.catch === "function") {
              p.catch(function (err) {
                console.warn("[AZIMUTE][JARVIS] Reprodução bloqueada/ausente:", clipKey, err);
                fallbackSynth();
              });
            }
            return;
          } catch (err) {
            console.warn("[AZIMUTE][JARVIS] Erro ao carregar clipe:", clipKey, err);
          }
        }
        fallbackSynth();
      } catch (err) {
        console.warn("[AZIMUTE][JARVIS] Erro no controlador de voz:", err);
        this._isSpeaking = false;
      }
    }
  };

  tac.stealthSilent = localStorage.getItem("az_stealth_silent_v1") === "true";
  function syncStealthUi() {
    const btn = document.getElementById("azHudStealthBtn");
    const waves = document.getElementById("azStealthSoundWaves");
    const muteX = document.getElementById("azStealthMuteX");
    const muted = Boolean(tac.stealthSilent);
    if (waves) waves.style.display = muted ? "none" : "inline";
    if (muteX) muteX.style.display = muted ? "inline" : "none";
    if (btn) {
      btn.classList.toggle("is-active", muted);
      btn.title = muted ? "Áudio MUDO (Toque para reativar)" : "Áudio ATIVO (Toque para mutar)";
    }
  }
  syncStealthUi();
  onClick("azHudStealthBtn", function () {
    tac.stealthSilent = !tac.stealthSilent;
    try { localStorage.setItem("az_stealth_silent_v1", tac.stealthSilent ? "true" : "false"); } catch (_) {}
    if (tac.stealthSilent) {
      stopDroneRotorHum();
      if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (_) {} }
      tac.audioMuted = true;
      showToast("Modo Furtivo ATIVO — Silêncio Total.");
    } else {
      tac.audioMuted = false;
      if (tac.droneMode) startDroneRotorHum();
      showToast("Áudio reativado.");
    }
    syncStealthUi();
  });

  function playDjiArpeggio(freqs) {
    if (tac.stealthSilent || !droneCfg.soundOn) return;
    const ctx = getDroneAudioCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + 0.01;
      let offset = 0;
      freqs.forEach(function (freq, idx) {
        const dur = idx === freqs.length - 1 ? 0.13 : 0.08;
        const start = now + offset;
        const end = start + dur;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.11, start + 0.008);
        gain.gain.setValueAtTime(0.11, Math.max(start + 0.01, end - 0.012));
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        gain.connect(ctx.destination);

        const oscMain = ctx.createOscillator();
        oscMain.type = "triangle";
        oscMain.frequency.setValueAtTime(freq, start);
        oscMain.connect(gain);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.28, start);
        subGain.connect(gain);
        const oscHarm = ctx.createOscillator();
        oscHarm.type = "sine";
        oscHarm.frequency.setValueAtTime(freq * 2, start);
        oscHarm.connect(subGain);

        oscMain.start(start);
        oscHarm.start(start);
        oscMain.stop(end + 0.01);
        oscHarm.stop(end + 0.01);
        offset += dur + 0.02;
      });
    } catch (_) {}
  }

  function triggerDroneVibrate(pattern) {
    try {
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(pattern);
      }
    } catch (_) {}
  }

  function playDronePowerOnSound() {
    triggerDroneVibrate([45, 40, 85]);
    if (window.AzVoiceJarvis && typeof window.AzVoiceJarvis.speak === "function") {
      window.AzVoiceJarvis.speak("", "drone-no-ar", { noSynthFallback: true });
    }
  }

  function playDronePowerOffSound() {
    triggerDroneVibrate([85, 40, 45]);
    playDjiArpeggio([2960, 2489, 1976]);
  }

  function playDroneReturnBeep() {
    playDjiArpeggio([2489, 2960, 3520]);
  }

  function playDroneTargetFoundBeep() {
    if (tac.stealthSilent || !droneCfg.soundOn) return;
    playDjiArpeggio([1760, 2217, 2637]);
  }

  let _azDroneHumNodes = null;
  let _azAvataAudioEl = null;
  function stopDroneRotorHum() {
    if (_azAvataAudioEl) {
      try { _azAvataAudioEl.pause(); _azAvataAudioEl.currentTime = 0; } catch (_) {}
      _azAvataAudioEl = null;
    }
    if (!_azDroneHumNodes) return;
    try {
      const ctx = _azDroneHumNodes.ctx;
      const master = _azDroneHumNodes.master;
      if (ctx && master) master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06);
      const nodes = _azDroneHumNodes;
      _azDroneHumNodes = null;
      setTimeout(function () {
        try { nodes.osc1.stop(); } catch (_) {}
        try { nodes.osc2.stop(); } catch (_) {}
        try { nodes.osc3.stop(); } catch (_) {}
        try { nodes.lfo.stop(); } catch (_) {}
      }, 180);
    } catch (_) {
      _azDroneHumNodes = null;
    }
  }

  function updateDroneAvataPitch(speedFactor) {
    const sf = Math.max(0.7, Math.min(1.6, Number(speedFactor) || 1.0));
    if (_azAvataAudioEl) {
      try { _azAvataAudioEl.playbackRate = sf; } catch (_) {}
    }
    if (_azDroneHumNodes && _azDroneHumNodes.ctx) {
      try {
        const t = _azDroneHumNodes.ctx.currentTime;
        _azDroneHumNodes.osc1.frequency.setTargetAtTime(590 * sf, t, 0.08);
        _azDroneHumNodes.osc2.frequency.setTargetAtTime(1180 * sf, t, 0.08);
        _azDroneHumNodes.osc3.frequency.setTargetAtTime(1770 * sf, t, 0.08);
      } catch (_) {}
    }
  }

  function startAvataSynthFallback() {
    const ctx = getDroneAudioCtx();
    if (!ctx || _azDroneHumNodes) return;
    try {
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1450, ctx.currentTime);
      filter.Q.setValueAtTime(2.1, ctx.currentTime);
      filter.connect(master);
      master.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(590, ctx.currentTime);
      osc1.connect(filter);

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1180, ctx.currentTime);
      osc2.connect(filter);

      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(1770, ctx.currentTime);
      osc3.connect(filter);

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(34, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.0045, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);

      osc1.start(); osc2.start(); osc3.start(); lfo.start();
      _azDroneHumNodes = { ctx: ctx, master: master, osc1: osc1, osc2: osc2, osc3: osc3, lfo: lfo };
    } catch (_) {}
  }

  function startDroneRotorHum() {
    if (tac.stealthSilent || !droneCfg.soundOn || !droneCfg.humOn || _azDroneHumNodes || _azAvataAudioEl) return;
    if (window.AzVoiceJarvis && (window.AzVoiceJarvis._isSpeaking || window.AzVoiceJarvis.isRadioPriorityActive())) {
      window.AzVoiceJarvis._savedSecondaryState = { humWasActive: true };
      return;
    }
    try {
      const aud = new Audio("audio/avata-loop.mp3");
      aud.loop = true;
      aud.volume = 0.28;
      _azAvataAudioEl = aud;
      aud.play().catch(function () {
        _azAvataAudioEl = null;
        startAvataSynthFallback();
      });
    } catch (_) {
      _azAvataAudioEl = null;
      startAvataSynthFallback();
    }
  }

  function updateDroneStickAxisLabels() {
    const mode = Number(droneCfg.flightMode) || 2;
    const setTxt = function (id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };
    if (mode === 1) {
      setTxt("azDroneLTop", "FRENTE"); setTxt("azDroneLBot", "TRÁS");
      setTxt("azDroneLLeft", "↺"); setTxt("azDroneLRight", "↻");
      setTxt("azDroneRTop", "ALT +"); setTxt("azDroneRBot", "ALT -");
      setTxt("azDroneRLeft", "◀"); setTxt("azDroneRRight", "▶");
    } else if (mode === 3) {
      setTxt("azDroneLTop", "FRENTE"); setTxt("azDroneLBot", "TRÁS");
      setTxt("azDroneLLeft", "◀"); setTxt("azDroneLRight", "▶");
      setTxt("azDroneRTop", "ALT +"); setTxt("azDroneRBot", "ALT -");
      setTxt("azDroneRLeft", "↺"); setTxt("azDroneRRight", "↻");
    } else {
      setTxt("azDroneLTop", "ALT +"); setTxt("azDroneLBot", "ALT -");
      setTxt("azDroneLLeft", "↺"); setTxt("azDroneLRight", "↻");
      setTxt("azDroneRTop", "FRENTE"); setTxt("azDroneRBot", "TRÁS");
      setTxt("azDroneRLeft", "◀"); setTxt("azDroneRRight", "▶");
    }
    const layer = document.getElementById("azDroneSticksLayer");
    if (layer) layer.setAttribute("aria-label", `Sticks Virtuais Modo 0${mode}`);
    document.querySelectorAll("#azDroneSettingsPopover [data-drone-mode]").forEach(function (btn) {
      btn.classList.toggle("is-active", Number(btn.getAttribute("data-drone-mode")) === mode);
    });
  }

  function closeAllDronePopovers(exceptId) {
    ["azDroneSettingsPopover", "azDroneShortcutsPopover", "azDronePegadasPopover"].forEach(function (id) {
      if (id === exceptId) return;
      const el = document.getElementById(id);
      if (el) el.classList.remove("is-open");
    });
  }

  function executeDroneShortcutAction(actId) {
    if (actId === "pin") {
      const m = getActiveMap();
      if (!m || typeof m.getCenter !== "function") return;
      const c = m.getCenter();
      openPinEditorModal(null, { lng: c.lng, lat: c.lat }, "custom");
      return;
    }
    if (actId === "sat") {
      if (typeof toggleSatelliteMode === "function") toggleSatelliteMode();
      return;
    }
    if (actId === "enlace") {
      const tile = document.getElementById("azGridEnlaceTile") || document.getElementById("azDockEnlaceBtn");
      if (tile) tile.click();
      return;
    }
    if (actId === "comms") {
      const btn = document.getElementById("azOpenTeamCommsBtn") || document.querySelector('[data-grid-act="comms"]');
      if (btn) btn.click();
      return;
    }
    const gridBtn = document.querySelector('[data-grid-act="' + actId + '"]');
    if (gridBtn) gridBtn.click();
  }

  function renderDroneCustomShortcuts() {
    const wrap = document.getElementById("azDroneCustomShortcutsWrap");
    if (!wrap) return;
    wrap.innerHTML = "";
    droneBarShortcuts.forEach(function (actId) {
      const item = DRONE_SHORTCUT_CATALOG.find(function (c) { return c.id === actId; });
      if (!item) return;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "az-drone-pill-btn";
      b.textContent = item.label;
      b.title = "Atalho: " + item.label;
      b.addEventListener("click", function () { executeDroneShortcutAction(actId); });
      wrap.appendChild(b);
    });
  }

  function renderDroneShortcutsEditorList() {
    const list = document.getElementById("azDroneShortcutsList");
    if (!list) return;
    list.innerHTML = "";
    const orderedIds = droneBarShortcuts.concat(
      DRONE_SHORTCUT_CATALOG.map(function (c) { return c.id; }).filter(function (id) {
        return !droneBarShortcuts.includes(id);
      })
    );
    orderedIds.forEach(function (actId) {
      const item = DRONE_SHORTCUT_CATALOG.find(function (c) { return c.id === actId; });
      if (!item) return;
      const activeIdx = droneBarShortcuts.indexOf(actId);
      const isAdded = activeIdx >= 0;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#111318;";
      row.innerHTML = `<span style="font-size:11px;font-weight:700;color:#E2E8F0;">${item.label}</span><div style="display:flex;gap:4px;"></div>`;
      const actions = row.lastElementChild;
      if (isAdded) {
        const upBtn = document.createElement("button");
        upBtn.type = "button"; upBtn.className = "az-drone-pill-btn"; upBtn.textContent = "▲";
        upBtn.disabled = activeIdx === 0;
        upBtn.addEventListener("click", function () {
          if (activeIdx <= 0) return;
          const tmp = droneBarShortcuts[activeIdx - 1];
          droneBarShortcuts[activeIdx - 1] = droneBarShortcuts[activeIdx];
          droneBarShortcuts[activeIdx] = tmp;
          saveDroneBarShortcuts(); renderDroneCustomShortcuts(); renderDroneShortcutsEditorList();
        });
        const dnBtn = document.createElement("button");
        dnBtn.type = "button"; dnBtn.className = "az-drone-pill-btn"; dnBtn.textContent = "▼";
        dnBtn.disabled = activeIdx === droneBarShortcuts.length - 1;
        dnBtn.addEventListener("click", function () {
          if (activeIdx >= droneBarShortcuts.length - 1) return;
          const tmp = droneBarShortcuts[activeIdx + 1];
          droneBarShortcuts[activeIdx + 1] = droneBarShortcuts[activeIdx];
          droneBarShortcuts[activeIdx] = tmp;
          saveDroneBarShortcuts(); renderDroneCustomShortcuts(); renderDroneShortcutsEditorList();
        });
        actions.appendChild(upBtn);
        actions.appendChild(dnBtn);
      }
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
      toggleBtn.className = "az-drone-pill-btn " + (isAdded ? "is-danger" : "is-sky");
      toggleBtn.textContent = isAdded ? "REMOVER" : "ADICIONAR";
      toggleBtn.addEventListener("click", function () {
        if (isAdded) {
          droneBarShortcuts = droneBarShortcuts.filter(function (x) { return x !== actId; });
        } else {
          droneBarShortcuts.push(actId);
        }
        saveDroneBarShortcuts(); renderDroneCustomShortcuts(); renderDroneShortcutsEditorList();
      });
      actions.appendChild(toggleBtn);
      list.appendChild(row);
    });
  }

  function renderDronePegadasPopoverList() {
    const list = document.getElementById("azDronePegadasList");
    if (!list) return;
    list.innerHTML = "";
    const entries = [{ uid: tac.myUid || "__SELF__", qra: (tac.myQra || "VOCÊ") + " (VOCÊ)", colorId: tac.myColorId, isSelf: true }];
    Object.values(tac.teammates || {}).forEach(function (mate) {
      if (!mate || !mate.uid) return;
      entries.push({ uid: mate.uid, qra: mate.qra || mate.uid, colorId: mate.colorId, isSelf: false });
    });
    entries.forEach(function (ent) {
      const isOn = Boolean(tac.pegadasActive && tac.pegadasActive[ent.uid]);
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 8px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#111318;";
      const nameSpan = document.createElement("span");
      nameSpan.style.cssText = "font-size:11px;font-weight:700;color:#E2E8F0;";
      nameSpan.textContent = ent.qra;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "az-drone-pill-btn " + (isOn ? "is-active" : "is-sky");
      btn.textContent = isOn ? "OCULTAR 2KM" : "VER 2KM";
      btn.addEventListener("click", function () {
        if (typeof togglePegadasForUid === "function") {
          togglePegadasForUid(ent.uid, ent.qra, ent.colorId);
        }
        if (!ent.isSelf && tac.roomCode && tac.pegadasActive && tac.pegadasActive[ent.uid]) {
          broadcastPacket({ kind: "PEDIR_RASTRO", targetUid: ent.uid });
        }
        renderDronePegadasPopoverList();
      });
      row.appendChild(nameSpan);
      row.appendChild(btn);
      list.appendChild(row);
    });
  }

  function syncGimbalReadout() {
    const m = getActiveMap();
    const pitch = m && typeof m.getPitch === "function" ? Math.round(m.getPitch()) : 52;
    const clamped = Math.max(0, Math.min(65, pitch));
    const slider = document.getElementById("azGimbalPitchSlider");
    const valEl = document.getElementById("azGimbalPitchVal");
    if (slider) slider.value = String(clamped);
    if (valEl) valEl.textContent = `${clamped}°`;
  }

  function refreshDroneTargetsSelect() {
    const sel = document.getElementById("azDroneTargetSelect");
    if (!sel) return;
    const prevVal = tac.droneFollowUid || "__FREE__";
    const mode = Number(droneCfg.flightMode) || 2;
    let html = `<option value="__FREE__">VOAR LIVRE (MODO 0${mode})</option>`;
    html += `<option value="__TEAM_CENTER__">CENTRO DA EQUIPE</option>`;
    html += `<option value="__SELF__">VOCÊ • ${tac.myQra || "SEU ÍCONE"}</option>`;
    Object.values(tac.teammates || {}).forEach(function (mate) {
      if (!mate || !mate.uid) return;
      html += `<option value="${mate.uid}">OPERADOR • ${(mate.qra || mate.uid).replace(/</g, "&lt;")}</option>`;
    });
    sel.innerHTML = html;
    if (Array.from(sel.options).some(function (o) { return o.value === prevVal; })) {
      sel.value = prevVal;
    } else {
      sel.value = "__FREE__";
      tac.droneFollowUid = "__FREE__";
    }
  }

  function getDroneFollowTargetObj() {
    const uid = tac.droneFollowUid;
    if (!uid || uid === "__FREE__") return null;
    if (uid === "__TEAM_CENTER__") {
      const pts = [];
      if (tac.myPos && typeof tac.myPos.lat === "number") pts.push({ lat: tac.myPos.lat, lng: tac.myPos.lng });
      Object.values(tac.teammates || {}).forEach(function (m) {
        if (m && typeof m.lat === "number" && typeof m.lng === "number") pts.push({ lat: m.lat, lng: m.lng });
      });
      if (!pts.length) return null;
      const sum = pts.reduce(function (acc, p) { return { lat: acc.lat + p.lat, lng: acc.lng + p.lng }; }, { lat: 0, lng: 0 });
      return { id: "__TEAM_CENTER__", label: "CENTRO DA EQUIPE", lat: sum.lat / pts.length, lng: sum.lng / pts.length, isSelf: false };
    }
    if (uid === "__SELF__") {
      if (!tac.myPos || typeof tac.myPos.lat !== "number") return null;
      return { id: "__SELF__", label: tac.myQra || "VOCÊ", lat: tac.myPos.lat, lng: tac.myPos.lng, isSelf: true };
    }
    const mate = tac.teammates && tac.teammates[uid];
    if (mate && typeof mate.lat === "number" && typeof mate.lng === "number") {
      return { id: mate.uid, label: mate.qra || mate.uid, lat: mate.lat, lng: mate.lng, isSelf: false };
    }
    return null;
  }

  function followDroneTargetNow(animate) {
    if (!tac.droneMode || tac.droneFreeFlight) return;
    const tgt = getDroneFollowTargetObj();
    const m = getActiveMap();
    if (!tgt || !m) return;
    try {
      const z = Math.max(typeof m.getZoom === "function" ? m.getZoom() : 16.5, 16.5);
      if (animate && typeof m.easeTo === "function") {
        m.easeTo({ center: [tgt.lng, tgt.lat], zoom: z, duration: 420 });
      } else if (typeof m.jumpTo === "function") {
        m.jumpTo({ center: [tgt.lng, tgt.lat] });
      }
    } catch (_) {}
  }

  function syncDroneUi() {
    const bar = document.getElementById("azDroneHudBar");
    const ret = document.getElementById("azDroneReticle");
    const sticks = document.getElementById("azDroneSticksLayer");
    const dType = tac.droneType || "tatico";
    if (bar) {
      bar.classList.toggle("is-open", Boolean(tac.droneMode));
      if (!tac.droneMode) {
        bar.classList.remove("is-pick-hidden", "is-collapsed");
        bar.style.display = "";
        const confirmBar = document.getElementById("azReconConfirmAreaBar");
        if (confirmBar) confirmBar.style.display = "none";
      }
      bar.setAttribute("data-drone-type", dType);
    }
    const typeSel = document.getElementById("azDroneTypeSelect");
    if (typeSel && typeSel.value !== dType) typeSel.value = dType;
    if (ret) ret.classList.toggle("is-open", Boolean(tac.droneMode));
    if (sticks) sticks.classList.toggle("is-open", Boolean(tac.droneMode && tac.droneFreeFlight && dType === "tatico"));

    const ctrlBtn = document.getElementById("azDroneControlToggleBtn");
    if (ctrlBtn) {
      ctrlBtn.style.display = dType === "recon" ? "none" : "";
      ctrlBtn.textContent = tac.droneFreeFlight ? "SEGUIR" : "ASSUMIR";
      ctrlBtn.classList.toggle("is-active", Boolean(tac.droneFreeFlight));
      ctrlBtn.classList.toggle("is-sky", !tac.droneFreeFlight);
    }
    const tgtSel = document.getElementById("azDroneTargetSelect");
    if (tgtSel) tgtSel.style.display = dType === "recon" ? "none" : "";
    const qsBtn = document.getElementById("azDroneQuickSoundBtn");
    if (qsBtn) {
      const isOn = Boolean(droneCfg.soundOn);
      qsBtn.textContent = isOn ? "SOM: ON" : "SOM: OFF";
      qsBtn.classList.toggle("is-active", isOn);
      qsBtn.classList.toggle("is-danger", !isOn);
    }
    syncGimbalReadout();
    updateDroneStickAxisLabels();
  }

  let _azGamepadActive = false;
  function readGamepadAxesWithDeadzone() {
    try {
      if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") return null;
      const pads = navigator.getGamepads();
      if (!pads) return null;
      for (let i = 0; i < pads.length; i++) {
        const gp = pads[i];
        if (!gp || !gp.connected || !gp.axes || gp.axes.length < 2) continue;
        const dz = function (v) {
          const n = Number(v) || 0;
          if (Math.abs(n) < 0.12) return 0;
          return Math.sign(n) * ((Math.abs(n) - 0.12) / 0.88);
        };
        return {
          lx: dz(gp.axes[0]),
          ly: dz(gp.axes[1]),
          rx: gp.axes.length > 2 ? dz(gp.axes[2]) : 0,
          ry: gp.axes.length > 3 ? dz(gp.axes[3]) : 0
        };
      }
    } catch (_) {}
    return null;
  }
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("gamepadconnected", function () {
      _azGamepadActive = true;
      if (tac.droneMode) showToast("Controle Gamepad conectado ao Modo Drone.");
    });
    window.addEventListener("gamepaddisconnected", function () {
      _azGamepadActive = false;
      if (tac.droneMode) showToast("Controle Gamepad desconectado.");
    });
  }

  function stepDroneFlightLoop() {
    if (tac.droneRaf) {
      cancelAnimationFrame(tac.droneRaf);
      tac.droneRaf = 0;
    }
    if (!tac.droneMode || !tac.droneFreeFlight) return;
    let lastTs = performance.now();
    const knobL = document.getElementById("azDroneKnobLeft");
    const knobR = document.getElementById("azDroneKnobRight");
    let wasGpMoving = false;
    function tick(now) {
      if (!tac.droneMode || !tac.droneFreeFlight) {
        tac.droneRaf = 0;
        return;
      }
      const dt = Math.min(0.08, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;
      const curveStick = function (v) { return Math.sign(v) * Math.pow(Math.abs(v), 1.22); };
      const gpAxes = readGamepadAxesWithDeadzone();
      let rawLx = droneSticks.leftX;
      let rawLy = droneSticks.leftY;
      let rawRx = droneSticks.rightX;
      let rawRy = droneSticks.rightY;
      const touchIdle = Math.abs(rawLx) < 0.01 && Math.abs(rawLy) < 0.01 && Math.abs(rawRx) < 0.01 && Math.abs(rawRy) < 0.01;
      if (gpAxes && touchIdle) {
        const gpMoving = Math.abs(gpAxes.lx) > 0 || Math.abs(gpAxes.ly) > 0 || Math.abs(gpAxes.rx) > 0 || Math.abs(gpAxes.ry) > 0;
        if (gpMoving || wasGpMoving) {
          rawLx = gpAxes.lx;
          rawLy = gpAxes.ly;
          rawRx = gpAxes.rx;
          rawRy = gpAxes.ry;
          if (knobL) knobL.style.transform = `translate(${(rawLx * 24).toFixed(1)}px, ${(rawLy * 24).toFixed(1)}px)`;
          if (knobR) knobR.style.transform = `translate(${(rawRx * 24).toFixed(1)}px, ${(rawRy * 24).toFixed(1)}px)`;
          wasGpMoving = gpMoving;
        }
      } else if (wasGpMoving) {
        if (knobL) knobL.style.transform = "";
        if (knobR) knobR.style.transform = "";
        wasGpMoving = false;
      }
      const lx = curveStick(rawLx);
      const ly = curveStick(rawLy);
      const rx = curveStick(rawRx);
      const ry = curveStick(rawRy);
      if (Math.abs(lx) > 0.005 || Math.abs(ly) > 0.005 || Math.abs(rx) > 0.005 || Math.abs(ry) > 0.005) {
        if (tac._orbitActive) stopMapOrbit(false);
        const m = getActiveMap();
        if (m && typeof m.getCenter === "function" && typeof m.jumpTo === "function") {
          try {
            const c = m.getCenter();
            let bearing = typeof m.getBearing === "function" ? m.getBearing() : 0;
            let zoom = typeof m.getZoom === "function" ? m.getZoom() : 17;
            const mode = Number(droneCfg.flightMode) || 2;

            let yawIn = lx;
            let altIn = ly;
            let pitchIn = ry;
            let rollIn = rx;
            if (mode === 1) {
              yawIn = lx; pitchIn = ly; rollIn = rx; altIn = ry;
            } else if (mode === 3) {
              rollIn = lx; pitchIn = ly; yawIn = rx; altIn = ry;
            }

            const sAlt = Number(droneCfg.altSens) || 1.0;
            const sYaw = Number(droneCfg.yawSens) || 1.0;
            const sPitch = Number(droneCfg.pitchSens) || 1.0;
            const sRoll = Number(droneCfg.rollSens) || 1.0;

            bearing = ((bearing + yawIn * 44 * sYaw * dt) % 360 + 360) % 360;
            zoom = Math.max(11.5, Math.min(20.0, zoom + altIn * 1.35 * sAlt * dt));

            const forwardSpeedMps = Math.max(14, Math.min(480, 34 * Math.pow(2, 17 - zoom)));
            const fwd = -pitchIn * forwardSpeedMps * sPitch * dt;
            const strafe = rollIn * forwardSpeedMps * sRoll * dt;
            const bRad = (bearing * Math.PI) / 180;
            const sRad = ((bearing + 90) * Math.PI) / 180;
            const northM = Math.cos(bRad) * fwd + Math.cos(sRad) * strafe;
            const eastM = Math.sin(bRad) * fwd + Math.sin(sRad) * strafe;
            const cosLat = Math.max(0.2, Math.cos((c.lat * Math.PI) / 180));
            const nextLat = c.lat + northM / 111320;
            const nextLng = c.lng + eastM / (111320 * cosLat);
            m.jumpTo({ center: [nextLng, nextLat], bearing: bearing, zoom: zoom });
            if (typeof window.updateDroneCraftOnMap === "function") {
              window.updateDroneCraftOnMap(nextLng, nextLat, bearing, true);
            }
          } catch (_) {}
        }
      }
      tac.droneRaf = requestAnimationFrame(tick);
    }
    tac.droneRaf = requestAnimationFrame(tick);
  }

  function openDroneMode(targetUid, initialCoords) {
    scanAndCaptureExistingMaps();
    const m = getActiveMap();
    if (!m) { showToast("Mapa ainda carregando."); return; }
    if (tac._orbitActive) stopMapOrbit(false);
    if (!tac.droneMode) {
      tac.dronePrevPitch = typeof m.getPitch === "function" ? m.getPitch() : 0;
      playDronePowerOnSound();
      if (tac.allyFlyoverAlerted && typeof tac.allyFlyoverAlerted.clear === "function") {
        tac.allyFlyoverAlerted.clear();
      } else {
        tac.allyFlyoverAlerted = new Set();
      }
    }
    tac.droneMode = true;
    if (!tac.droneType) tac.droneType = "tatico";
    const picked = targetUid || (tac.droneType === "escolta" ? "__TEAM_CENTER__" : "__FREE__");
    tac.droneFollowUid = picked;
    tac.droneFreeFlight = tac.droneType === "tatico" && picked === "__FREE__";
    refreshDroneTargetsSelect();
    renderDroneCustomShortcuts();
    if (typeof startAllyFlyoverMonitor === "function") startAllyFlyoverMonitor();

    if (typeof m.easeTo === "function") {
      if (!tac.droneFreeFlight && tac.droneType !== "recon") {
        const tgt = getDroneFollowTargetObj();
        if (tgt) {
          m.easeTo({ center: [tgt.lng, tgt.lat], zoom: Math.max(m.getZoom(), 17), pitch: 58, duration: 480 });
        } else {
          showToast(`Alvo sem GPS ainda — assumindo controle Modo 0${droneCfg.flightMode}.`);
          tac.droneFreeFlight = true;
        }
      } else if (initialCoords && typeof initialCoords.lng === "number") {
        m.easeTo({ center: [initialCoords.lng, initialCoords.lat], zoom: Math.max(m.getZoom(), 17), pitch: 58, duration: 480 });
      } else if (m.getPitch() < 20) {
        m.easeTo({ pitch: tac.droneType === "recon" ? 42 : 58, duration: 400 });
      }
    }
    if (typeof window.updateDroneCraftOnMap === "function" && typeof m.getCenter === "function") {
      const mc = m.getCenter();
      window.updateDroneCraftOnMap(mc.lng, mc.lat, typeof m.getBearing === "function" ? m.getBearing() : 0, true);
    }
    startDroneRotorHum();
    syncDroneUi();
    if (tac.droneFreeFlight) stepDroneFlightLoop();
    showToast(tac.droneFreeFlight ? `Modo Drone: Voo Livre (Modo 0${droneCfg.flightMode}).` : `Modo Drone (${tac.droneType.toUpperCase()}).`);
  }

  function closeDroneMode(restorePitch) {
    if (tac.droneMode) playDronePowerOffSound();
    stopDroneRotorHum();
    tac.droneMode = false;
    tac.droneFreeFlight = false;
    if (tac.droneRaf) {
      cancelAnimationFrame(tac.droneRaf);
      tac.droneRaf = 0;
    }
    if (typeof stopReconFlight === "function") stopReconFlight(true);
    if (typeof window.restoreReconTempLayer === "function") window.restoreReconTempLayer();
    if (typeof stopAllyFlyoverMonitor === "function") stopAllyFlyoverMonitor();
    if (typeof window.updateDroneCraftOnMap === "function") window.updateDroneCraftOnMap(0, 0, 0, false);
    if (tac.roomCode && typeof broadcastPacket === "function") {
      broadcastPacket({ kind: "drone_pos", active: false });
    }
    const lbl = document.querySelector("#azDroneBadgeExpand span");
    if (lbl) lbl.textContent = "DRONE";
    const mClear = getActiveMap();
    if (mClear && typeof mClear.getSource === "function" && mClear.getSource("az-recon-transit-src")) {
      mClear.getSource("az-recon-transit-src").setData({ type: "FeatureCollection", features: [] });
    }
    if (tac.allyFlyoverAlerted && typeof tac.allyFlyoverAlerted.clear === "function") {
      tac.allyFlyoverAlerted.clear();
    }
    droneSticks.leftX = 0; droneSticks.leftY = 0;
    droneSticks.rightX = 0; droneSticks.rightY = 0;
    closeAllDronePopovers(null);
    const secPanel = document.getElementById("azSectorAnalysisPanel");
    if (secPanel) secPanel.classList.remove("is-open");
    const flyBanner = document.getElementById("azAllyFlyoverBanner");
    if (flyBanner) flyBanner.classList.remove("is-open");
    const pulsePill = document.getElementById("azReconPulsePill");
    if (pulsePill) pulsePill.classList.remove("is-open");
    const bar = document.getElementById("azDroneHudBar");
    if (bar) {
      bar.classList.remove("is-collapsed");
      bar.classList.remove("is-gimbal");
    }
    syncDroneUi();
    if (restorePitch !== false) {
      const m = getActiveMap();
      if (m && typeof m.easeTo === "function") {
        try { m.easeTo({ pitch: tac.dronePrevPitch || 0, duration: 380 }); } catch (_) {}
      }
    }
    showToast("Modo Drone encerrado.");
  }

  (function bindDroneControlsAndSticks() {
    function wireStick(padEl, knobEl, isLeft) {
      if (!padEl || !knobEl) return;
      let activePid = null;
      const maxR = 34;
      function updateFromEvent(ev) {
        const r = padEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        let dx = ev.clientX - cx;
        let dy = ev.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxR) {
          dx = (dx / dist) * maxR;
          dy = (dy / dist) * maxR;
        }
        knobEl.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        let nx = dx / maxR;
        let ny = dy / maxR;
        if (Math.abs(nx) < 0.12) nx = 0;
        if (Math.abs(ny) < 0.12) ny = 0;
        if (isLeft) { droneSticks.leftX = nx; droneSticks.leftY = ny; }
        else { droneSticks.rightX = nx; droneSticks.rightY = ny; }
      }
      function releaseStick(ev) {
        if (activePid === null || (ev && ev.pointerId !== activePid)) return;
        activePid = null;
        padEl.classList.remove("is-active");
        knobEl.style.transform = "translate(0px, 0px)";
        if (isLeft) { droneSticks.leftX = 0; droneSticks.leftY = 0; }
        else { droneSticks.rightX = 0; droneSticks.rightY = 0; }
      }
      padEl.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (activePid !== null) return;
        activePid = ev.pointerId;
        padEl.classList.add("is-active");
        try { padEl.setPointerCapture(ev.pointerId); } catch (_) {}
        updateFromEvent(ev);
      });
      padEl.addEventListener("pointermove", function (ev) {
        if (ev.pointerId !== activePid) return;
        ev.preventDefault();
        ev.stopPropagation();
        updateFromEvent(ev);
      });
      padEl.addEventListener("pointerup", releaseStick);
      padEl.addEventListener("pointercancel", releaseStick);
    }

    wireStick(document.getElementById("azDroneStickLeft"), document.getElementById("azDroneKnobLeft"), true);
    wireStick(document.getElementById("azDroneStickRight"), document.getElementById("azDroneKnobRight"), false);

    renderDroneCustomShortcuts();
    updateDroneStickAxisLabels();

    const sel = document.getElementById("azDroneTargetSelect");
    if (sel) {
      sel.addEventListener("change", function () {
        tac.droneFollowUid = this.value || "__FREE__";
        if (tac.droneFollowUid === "__FREE__") {
          tac.droneFreeFlight = true;
          syncDroneUi();
          stepDroneFlightLoop();
        } else {
          const tgt = getDroneFollowTargetObj();
          if (!tgt) {
            showToast("Alvo ainda sem coordenadas GPS.");
            tac.droneFreeFlight = true;
          } else {
            tac.droneFreeFlight = false;
            followDroneTargetNow(true);
            showToast(`Drone seguindo: ${tgt.label}`);
          }
          syncDroneUi();
        }
      });
    }

    onClick("azDroneControlToggleBtn", function () {
      if (!tac.droneMode) return;
      if (tac._orbitActive) stopMapOrbit(false);
      if (tac.droneFreeFlight) {
        if (tac.droneFollowUid === "__FREE__") {
          const mates = Object.values(tac.teammates || {});
          tac.droneFollowUid = mates[0] ? mates[0].uid : "__SELF__";
          refreshDroneTargetsSelect();
        }
        const tgt = getDroneFollowTargetObj();
        if (!tgt) {
          showToast("Selecione um operador online ou ative seu GPS.");
          return;
        }
        tac.droneFreeFlight = false;
        followDroneTargetNow(true);
        showToast(`Seguindo ${tgt.label}`);
      } else {
        tac.droneFreeFlight = true;
        stepDroneFlightLoop();
        showToast(`Controle assumido (Modo 0${droneCfg.flightMode}).`);
      }
      syncDroneUi();
    });

    // Barra recolhível (sem sobrepor HUD e com reabertura garantida)
    onClick("azDroneCollapseBtn", function () {
      const bar = document.getElementById("azDroneHudBar");
      if (bar) bar.classList.add("is-collapsed");
      const lbl = document.querySelector("#azDroneBadgeExpand span");
      if (lbl) lbl.textContent = "ABRIR DRONE";
      closeAllDronePopovers(null);
    });
    onClick("azDroneBadgeExpand", function () {
      const bar = document.getElementById("azDroneHudBar");
      if (!bar) return;
      const isCol = bar.classList.contains("is-collapsed");
      bar.classList.toggle("is-collapsed", !isCol);
      const lbl = document.querySelector("#azDroneBadgeExpand span");
      if (lbl) lbl.textContent = !isCol ? "ABRIR DRONE" : "DRONE";
    });

    // Ponto Vermelho Tático rápido na mira central
    onClick("azDroneRedDotBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.getCenter !== "function") return;
      const c = m.getCenter();
      tac.droneRedDotCounter = (Number(tac.droneRedDotCounter) || 0) + 1;
      const label = "A" + tac.droneRedDotCounter;
      upsertTacticalPin({
        id: "rd_" + Date.now(),
        type: "red_dot",
        label: label,
        rawTitle: label,
        colorHex: "#EF4444",
        iconId: "red_dot",
        lng: c.lng,
        lat: c.lat
      }, false);
      showToast(`Ponto ${label} marcado na mira.`);
    });

    // Pegadas 2 km rápido
    onClick("azDronePegadasBtn", function () {
      const pop = document.getElementById("azDronePegadasPopover");
      if (!pop) return;
      const willOpen = !pop.classList.contains("is-open");
      closeAllDronePopovers(willOpen ? "azDronePegadasPopover" : null);
      if (willOpen) {
        renderDronePegadasPopoverList();
        pop.classList.add("is-open");
      } else {
        pop.classList.remove("is-open");
      }
    });
    onClick("azDronePegadasCloseBtn", function () { closeAllDronePopovers(null); });

    // K9 e Órbita
    onClick("azDroneK9Btn", function () {
      const tgt = !tac.droneFreeFlight ? getDroneFollowTargetObj() : null;
      if (tgt && !tgt.isSelf) {
        setBloodhoundTarget({ type: "mate", id: tgt.id, label: tgt.label, lat: tgt.lat, lng: tgt.lng });
        showToast(`Cão de Busca travado em ${tgt.label}.`);
      } else {
        const m = getActiveMap();
        if (!m || typeof m.getCenter !== "function") return;
        const c = m.getCenter();
        setBloodhoundTarget({ type: "point", id: "bh_drone_" + Date.now(), label: "DRONE MIRA", lat: c.lat, lng: c.lng });
        showToast("Cão de Busca travado na mira do Drone.");
      }
    });

    onClick("azDroneOrbitBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.getCenter !== "function") return;
      tac.droneFreeFlight = false;
      syncDroneUi();
      const tgt = getDroneFollowTargetObj();
      const pt = tgt || m.getCenter();
      startMapOrbitAround(pt.lng, pt.lat);
    });

    // Sub-tela integrada de GIMBAL (jumpTo contínuo 60fps, easeTo no Recentralizar)
    onClick("azDroneGimbalBtn", function () {
      const bar = document.getElementById("azDroneHudBar");
      if (bar) bar.classList.toggle("is-gimbal");
      closeAllDronePopovers(null);
      syncGimbalReadout();
    });
    onClick("azGimbalBackBtn", function () {
      const bar = document.getElementById("azDroneHudBar");
      if (bar) bar.classList.remove("is-gimbal");
    });

    const gimbalSlider = document.getElementById("azGimbalPitchSlider");
    if (gimbalSlider) {
      gimbalSlider.addEventListener("input", function () {
        const m = getActiveMap();
        const p = Math.max(0, Math.min(65, Number(this.value) || 0));
        if (m && typeof m.jumpTo === "function") {
          try { m.jumpTo({ pitch: p }); } catch (_) {}
        }
        const valEl = document.getElementById("azGimbalPitchVal");
        if (valEl) valEl.textContent = `${Math.round(p)}°`;
      });
    }

    function wireHoldRepeat(btnId, stepFn) {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      let timerId = 0;
      const stop = function () {
        if (timerId) { clearInterval(timerId); timerId = 0; }
      };
      btn.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        stepFn();
        stop();
        timerId = setInterval(stepFn, 40);
      });
      btn.addEventListener("pointerup", stop);
      btn.addEventListener("pointercancel", stop);
      btn.addEventListener("pointerleave", stop);
    }

    wireHoldRepeat("azGimbalPitchDownBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const nextP = Math.max(0, (typeof m.getPitch === "function" ? m.getPitch() : 0) - 2);
      m.jumpTo({ pitch: nextP });
      syncGimbalReadout();
    });
    wireHoldRepeat("azGimbalPitchUpBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const nextP = Math.min(65, (typeof m.getPitch === "function" ? m.getPitch() : 0) + 2);
      m.jumpTo({ pitch: nextP });
      syncGimbalReadout();
    });
    wireHoldRepeat("azGimbalYawLeftBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const b = typeof m.getBearing === "function" ? m.getBearing() : 0;
      m.jumpTo({ bearing: ((b - 3) % 360 + 360) % 360 });
    });
    wireHoldRepeat("azGimbalYawRightBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const b = typeof m.getBearing === "function" ? m.getBearing() : 0;
      m.jumpTo({ bearing: (b + 3) % 360 });
    });
    wireHoldRepeat("azGimbalZoomOutBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const z = typeof m.getZoom === "function" ? m.getZoom() : 17;
      m.jumpTo({ zoom: Math.max(11.5, z - 0.12) });
    });
    wireHoldRepeat("azGimbalZoomInBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      const z = typeof m.getZoom === "function" ? m.getZoom() : 17;
      m.jumpTo({ zoom: Math.min(20.0, z + 0.12) });
    });

    onClick("azGimbalResetBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.easeTo !== "function") return;
      const tgt = getDroneFollowTargetObj();
      const c = tgt ? [tgt.lng, tgt.lat] : m.getCenter();
      m.easeTo({ center: c, pitch: 0, duration: 360 });
      setTimeout(syncGimbalReadout, 380);
    });

    // Editor de Atalhos (+)
    onClick("azDroneAddShortcutBtn", function () {
      const pop = document.getElementById("azDroneShortcutsPopover");
      if (!pop) return;
      const willOpen = !pop.classList.contains("is-open");
      closeAllDronePopovers(willOpen ? "azDroneShortcutsPopover" : null);
      if (willOpen) {
        renderDroneShortcutsEditorList();
        pop.classList.add("is-open");
      } else {
        pop.classList.remove("is-open");
      }
    });
    onClick("azDroneShortcutsCloseBtn", function () { closeAllDronePopovers(null); });

    // Ajustes do Drone (Som DJI, Modos de Voo, Sensibilidade 4 eixos)
    function syncSettingsUi() {
      const soundChk = document.getElementById("azDroneSoundChk");
      if (soundChk) soundChk.checked = Boolean(droneCfg.soundOn);
      const humChk = document.getElementById("azDroneHumChk");
      if (humChk) humChk.checked = Boolean(droneCfg.humOn !== false);
      const mapIds = [
        ["azDroneSensAlt", "azDroneSensAltVal", "altSens"],
        ["azDroneSensYaw", "azDroneSensYawVal", "yawSens"],
        ["azDroneSensPitch", "azDroneSensPitchVal", "pitchSens"],
        ["azDroneSensRoll", "azDroneSensRollVal", "rollSens"]
      ];
      mapIds.forEach(function (entry) {
        const inp = document.getElementById(entry[0]);
        const lbl = document.getElementById(entry[1]);
        const val = Number(droneCfg[entry[2]]) || 1.0;
        if (inp) inp.value = val.toFixed(1);
        if (lbl) lbl.textContent = val.toFixed(1) + "x";
      });
      updateDroneStickAxisLabels();
    }

    onClick("azDroneSettingsBtn", function () {
      const pop = document.getElementById("azDroneSettingsPopover");
      if (!pop) return;
      const willOpen = !pop.classList.contains("is-open");
      closeAllDronePopovers(willOpen ? "azDroneSettingsPopover" : null);
      if (willOpen) {
        syncSettingsUi();
        pop.classList.add("is-open");
      } else {
        pop.classList.remove("is-open");
      }
    });
    onClick("azDroneSettingsCloseBtn", function () { closeAllDronePopovers(null); });

    onClick("azDroneQuickSoundBtn", function () {
      droneCfg.soundOn = !Boolean(droneCfg.soundOn);
      saveDroneCfg();
      const soundChk = document.getElementById("azDroneSoundChk");
      if (soundChk) soundChk.checked = droneCfg.soundOn;
      if (!droneCfg.soundOn) {
        stopDroneRotorHum();
      } else if (tac.droneMode) {
        startDroneRotorHum();
      }
      syncDroneUi();
      showToast(droneCfg.soundOn ? "Efeitos sonoros do Drone ativados." : "Efeitos sonoros do Drone desativados.");
    });

    const soundChk = document.getElementById("azDroneSoundChk");
    if (soundChk) {
      soundChk.addEventListener("change", function () {
        droneCfg.soundOn = Boolean(this.checked);
        saveDroneCfg();
        if (!droneCfg.soundOn) stopDroneRotorHum();
        else if (tac.droneMode) { playDronePowerOnSound(); startDroneRotorHum(); }
        syncDroneUi();
      });
    }
    const humChk = document.getElementById("azDroneHumChk");
    if (humChk) {
      humChk.addEventListener("change", function () {
        droneCfg.humOn = Boolean(this.checked);
        saveDroneCfg();
        if (!droneCfg.humOn) stopDroneRotorHum();
        else if (tac.droneMode) startDroneRotorHum();
      });
    }

    document.querySelectorAll("#azDroneSettingsPopover [data-drone-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const m = Number(this.getAttribute("data-drone-mode")) || 2;
        droneCfg.flightMode = m;
        saveDroneCfg();
        updateDroneStickAxisLabels();
        refreshDroneTargetsSelect();
        showToast(`Modo de voo alterado para Modo 0${m}.`);
      });
    });

    [
      ["azDroneSensAlt", "azDroneSensAltVal", "altSens"],
      ["azDroneSensYaw", "azDroneSensYawVal", "yawSens"],
      ["azDroneSensPitch", "azDroneSensPitchVal", "pitchSens"],
      ["azDroneSensRoll", "azDroneSensRollVal", "rollSens"]
    ].forEach(function (entry) {
      const inp = document.getElementById(entry[0]);
      const lbl = document.getElementById(entry[1]);
      if (!inp) return;
      inp.addEventListener("input", function () {
        const val = Math.max(0.2, Math.min(2.5, Number(this.value) || 1.0));
        droneCfg[entry[2]] = val;
        if (lbl) lbl.textContent = val.toFixed(1) + "x";
        saveDroneCfg();
      });
    });

    onClick("azDroneSensResetBtn", function () {
      droneCfg = Object.assign({}, DRONE_DEFAULT_CFG);
      saveDroneCfg();
      syncSettingsUi();
      refreshDroneTargetsSelect();
      showToast("Ajustes do Drone restaurados para o padrão (Modo 02).");
    });

    onClick("azDroneCloseBtn", function () {
      closeDroneMode(true);
    });
  })();

  // ==================== BIPE DE SOBREVOÔ ALIADO + TIPOS DE DRONE + RECONHECIMENTO + ANÁLISE ====================
  function playDroneAllyBeep() {
    if (!droneCfg.soundOn) return;
    const ctx = getDroneAudioCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + 0.01;
      [2350, 2800].forEach(function (freq, idx) {
        const start = now + idx * 0.075;
        const end = start + 0.045;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(0.095, start + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        gain.connect(ctx.destination);
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        osc.connect(gain);
        osc.start(start);
        osc.stop(end + 0.01);
      });
    } catch (_) {}
  }

  let _allyFlyoverTimer = 0;
  let _allyBannerHideTimer = 0;
  function stopAllyFlyoverMonitor() {
    if (_allyFlyoverTimer) { clearInterval(_allyFlyoverTimer); _allyFlyoverTimer = 0; }
    if (_allyBannerHideTimer) { clearTimeout(_allyBannerHideTimer); _allyBannerHideTimer = 0; }
  }
  function startAllyFlyoverMonitor() {
    stopAllyFlyoverMonitor();
    if (!tac.allyFlyoverAlerted) tac.allyFlyoverAlerted = new Set();
    _allyFlyoverTimer = setInterval(function () {
      if (!tac.droneMode) return;
      const m = getActiveMap();
      if (!m || typeof m.getCenter !== "function") return;
      const c = m.getCenter();
      const mates = Object.values(tac.teammates || {});
      for (let i = 0; i < mates.length; i++) {
        const mate = mates[i];
        if (!mate || !mate.uid || typeof mate.lat !== "number" || typeof mate.lng !== "number") continue;
        if (tac.allyFlyoverAlerted.has(mate.uid)) continue;
        const d = calcDistAndBearing(c.lat, c.lng, mate.lat, mate.lng).dist;
        if (d <= 55) {
          tac.allyFlyoverAlerted.add(mate.uid);
          playDroneAllyBeep();
          const ban = document.getElementById("azAllyFlyoverBanner");
          if (ban) {
            ban.textContent = `SOBREVOO ALIADO: ${mate.qra || mate.uid}`;
            ban.classList.add("is-open");
            if (_allyBannerHideTimer) clearTimeout(_allyBannerHideTimer);
            _allyBannerHideTimer = setTimeout(function () { ban.classList.remove("is-open"); }, 2400);
          }
          break;
        }
      }
    }, 250);
  }

  (function initDroneTypesAndReconEngine() {
    const RECON_CFG_KEY = "az_tac_recon_cfg_v1";
    const RECON_DEFAULT_CFG = {
      autoScan: true,
      drawMode: "live",
      animMaster: true,
      animTransit: true,
      animInspect: true,
      carRoute: true
    };
    let reconCfg = Object.assign({}, RECON_DEFAULT_CFG);
    try {
      const saved = JSON.parse(localStorage.getItem(RECON_CFG_KEY) || "{}");
      if (saved && typeof saved === "object") reconCfg = Object.assign({}, RECON_DEFAULT_CFG, saved);
    } catch (_) {}
    function saveReconCfg() {
      try { localStorage.setItem(RECON_CFG_KEY, JSON.stringify(reconCfg)); } catch (_) {}
    }

    const SPEEDS = [0.25, 0.5, 1, 2, 3, 5];
    const RECON_DEPTH_KEY = "az_tac_recon_depth_v1";
    const DEPTH_PRESETS = {
      superficial: { malhaCompleta: false, becosEscadas: false, semSaida: false, cercoBloqueio: false, raioXTopologico: false, vozJarvis: true },
      tatica: { malhaCompleta: true, becosEscadas: true, semSaida: true, cercoBloqueio: true, raioXTopologico: false, vozJarvis: true },
      minuciosa: { malhaCompleta: true, becosEscadas: true, semSaida: true, cercoBloqueio: true, raioXTopologico: true, vozJarvis: true }
    };
    const state = {
      shapeMode: "circle",
      pickStep: 0,
      center: null,
      radiusM: 500,
      rectCornerA: null,
      rectCornerB: null,
      polygonRing: null,
      destLabel: "",
      targetQuery: "",
      depthLevel: localStorage.getItem(RECON_DEPTH_KEY) || "tatica",
      criteria: Object.assign({}, DEPTH_PRESETS[localStorage.getItem(RECON_DEPTH_KEY) || "tatica"] || DEPTH_PRESETS.tatica),
      execMode: "live",
      waypoints: [],
      wpIdx: 0,
      speedMult: 1,
      paused: false,
      pattern: "sweep",
      manualZoomUntil: 0,
      targetZoom: 16.95,
      targetPitch: 42,
      inspectUntil: 0,
      inspectSpin: false,
      rthAdded: false,
      pendingFeatures: [],
      revealedFeatures: [],
      matchedTargets: [],
      alertedTargetKeys: new Set(),
      featuresVisible: true,
      analysis: {
        profile: "BAIRRO RESIDENCIAL",
        neighborhoods: [],
        avenidas: [],
        ruas: [],
        becos: [],
        escadarias: [],
        semSaida: [],
        pontosBloqueio: [],
        raioX: [],
        becosPorRua: {},
        unnamedCount: 0,
        becos: [],
        escadarias: [],
        itinerario: [],
        carDistKm: 0,
        carDurMin: 0,
        shopsCount: 0,
        complexity: "Média"
      },
      activeTab: "avenidas",
      mapClickHandler: null,
      mapDragHandler: null,
      abortCtrl: null
    };

    function normalizeStr(s) {
      return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function getTargetTerms() {
      const inp = document.getElementById("azReconTargetInput");
      const raw = inp ? inp.value : state.targetQuery;
      state.targetQuery = raw || "";
      return state.targetQuery.split(",").map(normalizeStr).filter(Boolean);
    }

    function setReconStatus(phaseTxt, etaTxt) {
      const ph = document.getElementById("azReconPhaseBadge");
      const et = document.getElementById("azReconEtaBadge");
      if (ph && typeof phaseTxt === "string") ph.textContent = phaseTxt;
      if (et && typeof etaTxt === "string") et.textContent = etaTxt;
    }

    function formatEtaSec(sec) {
      const s = Math.max(0, Math.round(sec));
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return "~" + mm + ":" + ss;
    }

    function getSectorAreaKm2() {
      if (state.shapeMode === "circle") {
        const rKm = state.radiusM / 1000;
        return Math.PI * rKm * rKm;
      }
      if (state.rectCornerA && state.rectCornerB) {
        const midLat = (state.rectCornerA.lat + state.rectCornerB.lat) / 2;
        const cosLat = Math.max(0.2, Math.cos((midLat * Math.PI) / 180));
        const hKm = Math.abs(state.rectCornerB.lat - state.rectCornerA.lat) * 111.32;
        const wKm = Math.abs(state.rectCornerB.lng - state.rectCornerA.lng) * 111.32 * cosLat;
        return hKm * wKm;
      }
      return 0;
    }

    function updateReconEtaEstimate() {
      if (!reconCfg.animMaster) {
        setReconStatus(null, "~00:03");
        return;
      }
      const wps = generateReconWaypoints(state.pattern || "sweep");
      let totalDist = 0;
      for (let i = 1; i < wps.length; i++) {
        totalDist += calcDistAndBearing(wps[i - 1].lat, wps[i - 1].lng, wps[i].lat, wps[i].lng).dist;
      }
      if (reconCfg.animTransit && tac.myPos && typeof tac.myPos.lat === "number" && wps[0]) {
        const dOp = calcDistAndBearing(tac.myPos.lat, tac.myPos.lng, wps[0].lat, wps[0].lng).dist;
        if (dOp > 40) totalDist += dOp * 2;
      }
      const avgSpeed = 48 * (Number(state.speedMult) || 1);
      const estSec = Math.max(4, totalDist / Math.max(12, avgSpeed));
      setReconStatus(null, formatEtaSec(estSec));
    }

    function makeRealisticDroneSvg(colorHex) {
      const col = colorHex || "#C5A869";
      return `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 40 40" fill="none"><circle cx="9" cy="9" r="6.2" fill="rgba(13,13,13,0.45)" stroke="${col}" stroke-width="1.4" stroke-dasharray="6 2.5"/><circle cx="31" cy="9" r="6.2" fill="rgba(13,13,13,0.45)" stroke="${col}" stroke-width="1.4" stroke-dasharray="6 2.5"/><circle cx="9" cy="31" r="6.2" fill="rgba(13,13,13,0.45)" stroke="${col}" stroke-width="1.4" stroke-dasharray="6 2.5"/><circle cx="31" cy="31" r="6.2" fill="rgba(13,13,13,0.45)" stroke="${col}" stroke-width="1.4" stroke-dasharray="6 2.5"/><path d="M9.5 9.5L17 17M30.5 9.5L23 17M9.5 30.5L17 23M30.5 30.5L23 23" stroke="#1E293B" stroke-width="3.2" stroke-linecap="round"/><path d="M9.5 9.5L17 17M30.5 9.5L23 17M9.5 30.5L17 23M30.5 30.5L23 23" stroke="${col}" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="9" r="2.1" fill="${col}"/><circle cx="31" cy="9" r="2.1" fill="${col}"/><circle cx="9" cy="31" r="2.1" fill="${col}"/><circle cx="31" cy="31" r="2.1" fill="${col}"/><path d="M17 12.5C17 11.2 18.3 10.5 20 10.5C21.7 10.5 23 11.2 23 12.5V26.5C23 28 21.7 29 20 29C18.3 29 17 28 17 26.5V12.5Z" fill="#0D0D0D" stroke="${col}" stroke-width="1.8"/><rect x="18.2" y="13.5" width="3.6" height="5" rx="1" fill="${col}" opacity="0.85"/><circle cx="20" cy="10.2" r="2" fill="#38BDF8" stroke="#0D0D0D" stroke-width="0.9"/><circle cx="17.8" cy="27.2" r="1.1" fill="#EF4444"/><circle cx="22.2" cy="27.2" r="1.1" fill="#22C55E"/></svg>`;
    }

    function registerSvgImageOnMap(map, name, svg, size) {
      if (!map || typeof map.hasImage !== "function" || typeof map.addImage !== "function" || map.hasImage(name)) return;
      try {
        const img = new Image(size, size);
        img.onload = function () {
          try { if (!map.hasImage(name)) map.addImage(name, img); } catch (_) {}
        };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      } catch (_) {}
    }

    function ensureReconMapImages(map) {
      if (!map || typeof map.hasImage !== "function" || typeof map.addImage !== "function") return;
      registerSvgImageOnMap(
        map,
        "az-recon-ico-escada",
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5" fill="#0D0D0D" stroke="#F59E0B" stroke-width="1.6"/><path d="M6 17h3v-3h3v-3h3V8h3"/><path d="M6 12.5l7.5-7.5"/></svg>',
        28
      );
      registerSvgImageOnMap(
        map,
        "az-recon-ico-beco",
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5" fill="#0D0D0D" stroke="#38BDF8" stroke-width="1.6"/><path d="M7 18c0-4.5 5-3 5-7.5S17 7.5 17 6"/><path d="M10.5 18c0-3.5 4-2 4-6.5s4-2 4-5.5" stroke-dasharray="2 2"/></svg>',
        28
      );
      const myCol = typeof getColorHex === "function" ? getColorHex(tac.myColorId) : "#C5A869";
      const myIcoName = "az-drone-craft-" + myCol.replace("#", "");
      registerSvgImageOnMap(map, myIcoName, makeRealisticDroneSvg(myCol), 52);
    }

    function ensureReconLayers(map) {
      if (!canDrawOnMap(map)) return;
      ensureReconMapImages(map);
      const emptyGeo = { type: "FeatureCollection", features: [] };
      if (!map.getSource("az-recon-sector-src")) {
        map.addSource("az-recon-sector-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-sector-fill", type: "fill", source: "az-recon-sector-src", paint: { "fill-color": "#C5A869", "fill-opacity": 0.08 } });
        map.addLayer({ id: "az-recon-sector-line", type: "line", source: "az-recon-sector-src", paint: { "line-color": "#C5A869", "line-width": 2.2, "line-dasharray": [3, 2] } });
      }
      if (!map.getSource("az-recon-handles-src")) {
        map.addSource("az-recon-handles-src", { type: "geojson", data: emptyGeo });
        map.addLayer({
          id: "az-recon-handles-layer",
          type: "circle",
          source: "az-recon-handles-src",
          paint: {
            "circle-radius": 8,
            "circle-color": "#C5A869",
            "circle-stroke-color": "#0D0D0D",
            "circle-stroke-width": 2.5
          }
        });
      }
      if (!map.getSource("az-recon-qmarks-src")) {
        map.addSource("az-recon-qmarks-src", { type: "geojson", data: emptyGeo });
        map.addLayer({
          id: "az-recon-qmarks-bg",
          type: "circle",
          source: "az-recon-qmarks-src",
          paint: {
            "circle-radius": 11,
            "circle-color": "#0D0D0D",
            "circle-stroke-color": "#C5A869",
            "circle-stroke-width": 2
          }
        });
        map.addLayer({
          id: "az-recon-qmarks-lbl",
          type: "symbol",
          source: "az-recon-qmarks-src",
          layout: {
            "text-field": ["coalesce", ["get", "symbol"], "?"],
            "text-size": 12,
            "text-allow-overlap": true,
            "text-ignore-placement": true
          },
          paint: { "text-color": "#C5A869" }
        });
      }
      if (!map.getSource("az-recon-transit-src")) {
        map.addSource("az-recon-transit-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-transit-line", type: "line", source: "az-recon-transit-src", paint: { "line-color": "#38BDF8", "line-width": 2.6, "line-dasharray": [2.5, 1.5], "line-opacity": 0.85 } });
      }
      if (!map.getSource("az-recon-features-src")) {
        map.addSource("az-recon-features-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-escada-base", type: "line", source: "az-recon-features-src", filter: ["==", ["get", "kind"], "escada"], layout: { "line-cap": "butt", "line-join": "round" }, paint: { "line-color": "#F59E0B", "line-width": 2.2 } });
        map.addLayer({ id: "az-recon-escada-steps", type: "line", source: "az-recon-features-src", filter: ["==", ["get", "kind"], "escada"], paint: { "line-color": "#F59E0B", "line-width": 8.5, "line-dasharray": [0.35, 0.9] } });
        map.addLayer({ id: "az-recon-beco-bg", type: "line", source: "az-recon-features-src", filter: ["==", ["get", "kind"], "beco"], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#38BDF8", "line-width": 7, "line-opacity": 0.25 } });
        map.addLayer({ id: "az-recon-beco-dash", type: "line", source: "az-recon-features-src", filter: ["==", ["get", "kind"], "beco"], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#38BDF8", "line-width": 3, "line-dasharray": [2.2, 1.3] } });
      }
      if (!map.getSource("az-recon-pins-src")) {
        map.addSource("az-recon-pins-src", { type: "geojson", data: emptyGeo });
        map.addLayer({
          id: "az-recon-pins-layer",
          type: "symbol",
          source: "az-recon-pins-src",
          layout: {
            "icon-image": ["match", ["get", "kind"], "escada", "az-recon-ico-escada", "az-recon-ico-beco"],
            "icon-size": 0.95,
            "icon-rotate": ["get", "angle"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "text-field": ["get", "label"],
            "text-size": 9,
            "text-offset": [0, 1.4],
            "text-optional": true
          },
          paint: { "text-color": "#F8FAFC", "text-halo-color": "#0D0D0D", "text-halo-width": 1.4 }
        });
      }
      if (!map.getSource("az-recon-target-src")) {
        map.addSource("az-recon-target-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-target-glow", type: "line", source: "az-recon-target-src", paint: { "line-color": "#22C55E", "line-width": 9, "line-opacity": 0.38 } });
        map.addLayer({ id: "az-recon-target-core", type: "line", source: "az-recon-target-src", paint: { "line-color": "#FACC15", "line-width": 3.8 } });
      }
      if (!map.getSource("az-recon-highlight-src")) {
        map.addSource("az-recon-highlight-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-highlight-line", type: "line", source: "az-recon-highlight-src", paint: { "line-color": "#4ADE80", "line-width": 6, "line-opacity": 0.9 } });
      }
      if (!map.getSource("az-drone-craft-src")) {
        map.addSource("az-drone-craft-src", { type: "geojson", data: emptyGeo });
        map.addLayer({
          id: "az-drone-craft-layer",
          type: "symbol",
          source: "az-drone-craft-src",
          layout: {
            "icon-image": ["get", "ico"],
            "icon-size": 1.0,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true
          }
        });
      }
      if (!map.getSource("az-teammates-drones-src")) {
        map.addSource("az-teammates-drones-src", { type: "geojson", data: emptyGeo });
        map.addLayer({
          id: "az-teammates-drones-layer",
          type: "symbol",
          source: "az-teammates-drones-src",
          layout: {
            "icon-image": ["get", "ico"],
            "icon-size": 0.9,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "text-field": ["get", "qra"],
            "text-size": 9,
            "text-offset": [0, 1.8]
          },
          paint: { "text-color": "#F8FAFC", "text-halo-color": "#0D0D0D", "text-halo-width": 1.5 }
        });
      }
      if (!map.getSource("az-geo-search-line-src")) {
        map.addSource("az-geo-search-line-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-geo-search-line-casing", type: "line", source: "az-geo-search-line-src", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#0F172A", "line-width": 9, "line-opacity": 0.7 } });
        map.addLayer({ id: "az-geo-search-line-core", type: "line", source: "az-geo-search-line-src", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#2D8CFF", "line-width": 5, "line-opacity": 0.96 } });
      }
      if (!map.getSource("az-geo-search-poly-src")) {
        map.addSource("az-geo-search-poly-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-geo-search-poly-fill", type: "fill", source: "az-geo-search-poly-src", paint: { "fill-color": "#E53935", "fill-opacity": 0.08 } });
        map.addLayer({ id: "az-geo-search-poly-line", type: "line", source: "az-geo-search-poly-src", paint: { "line-color": "#E53935", "line-width": 2.6, "line-opacity": 0.92 } });
      }
      if (!map.getSource("az-recon-blockade-src")) {
        map.addSource("az-recon-blockade-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-blockade-circle", type: "circle", source: "az-recon-blockade-src", paint: { "circle-radius": 9, "circle-color": "#EF4444", "circle-stroke-color": "#FFFFFF", "circle-stroke-width": 2 } });
        map.addLayer({ id: "az-recon-blockade-lbl", type: "symbol", source: "az-recon-blockade-src", layout: { "text-field": ["get", "code"], "text-size": 9, "text-allow-overlap": true }, paint: { "text-color": "#FFFFFF" } });
      }
      if (!map.getSource("az-recon-xray-pts-src")) {
        map.addSource("az-recon-xray-pts-src", { type: "geojson", data: emptyGeo });
        map.addLayer({ id: "az-recon-xray-pts-circle", type: "circle", source: "az-recon-xray-pts-src", paint: { "circle-radius": 6.5, "circle-color": ["get", "col"], "circle-stroke-color": "#0D0D0D", "circle-stroke-width": 1.8 } });
        map.addLayer({ id: "az-recon-xray-pts-lbl", type: "symbol", source: "az-recon-xray-pts-src", layout: { "text-field": ["get", "tag"], "text-size": 8.5, "text-offset": [0, -1.4], "text-allow-overlap": true }, paint: { "text-color": "#FACC15", "text-halo-color": "#0D0D0D", "text-halo-width": 1.4 } });
      }
    }

    let _lastSearchPolyOpt = null;
    let _searchLineTimer = 0;
    window.azShowGeoSearchGeometry = function (opt) {
      const m = getActiveMap();
      if (!m || !opt) return;
      ensureReconLayers(m);
      const lineSrc = m.getSource("az-geo-search-line-src");
      const polySrc = m.getSource("az-geo-search-poly-src");
      const reconBtn = document.getElementById("azGeoSearchReconBtn");
      if (lineSrc) lineSrc.setData({ type: "FeatureCollection", features: [] });
      if (polySrc) polySrc.setData({ type: "FeatureCollection", features: [] });
      if (reconBtn) reconBtn.style.display = "none";
      if (_searchLineTimer) { clearTimeout(_searchLineTimer); _searchLineTimer = 0; }

      const g = opt.geojson;
      if (!g || !g.type) return;
      if (g.type === "LineString" || g.type === "MultiLineString") {
        if (lineSrc) lineSrc.setData({ type: "FeatureCollection", features: [{ type: "Feature", geometry: g, properties: {} }] });
        _searchLineTimer = setTimeout(function () {
          const ls = m.getSource("az-geo-search-line-src");
          if (ls) ls.setData({ type: "FeatureCollection", features: [] });
        }, 9000);
      } else if (g.type === "Polygon" || g.type === "MultiPolygon") {
        if (polySrc) polySrc.setData({ type: "FeatureCollection", features: [{ type: "Feature", geometry: g, properties: {} }] });
        _lastSearchPolyOpt = opt;
        if (reconBtn) reconBtn.style.display = "inline-flex";
      }
    };

    onClick("azGeoSearchReconBtn", function () {
      if (!_lastSearchPolyOpt || !_lastSearchPolyOpt.geojson) return;
      const g = _lastSearchPolyOpt.geojson;
      let ring = null;
      if (g.type === "Polygon" && Array.isArray(g.coordinates[0])) ring = g.coordinates[0];
      else if (g.type === "MultiPolygon" && g.coordinates[0] && Array.isArray(g.coordinates[0][0])) ring = g.coordinates[0][0];
      if (!ring || ring.length < 3) return;
      state.shapeMode = "polygon";
      state.polygonRing = ring;
      state.destLabel = _lastSearchPolyOpt.title || "Bairro";
      state.center = { lng: _lastSearchPolyOpt.lng, lat: _lastSearchPolyOpt.lat };
      if (!tac.droneMode) openDroneMode("__FREE__", state.center);
      tac.droneType = "recon";
      tac.droneFreeFlight = false;
      const typeSel = document.getElementById("azDroneTypeSelect");
      if (typeSel) typeSel.value = "recon";
      syncDroneUi();
      drawReconSectorBoundary();
      applySmartDepthRecommendation();
      const reconBtn = document.getElementById("azGeoSearchReconBtn");
      if (reconBtn) reconBtn.style.display = "none";
      showToast(`Polígono de ${state.destLabel} carregado no Drone Recon.`);
    });

    let _lastDroneMqttTx = 0;
    window.updateDroneCraftOnMap = function (lng, lat, bearingDeg, show) {
      const m = getActiveMap();
      if (!m) return;
      ensureReconLayers(m);
      const src = m.getSource("az-drone-craft-src");
      if (!src) return;
      if (!show || typeof lng !== "number" || typeof lat !== "number") {
        src.setData({ type: "FeatureCollection", features: [] });
        return;
      }
      const myCol = typeof getColorHex === "function" ? getColorHex(tac.myColorId) : "#C5A869";
      const icoName = "az-drone-craft-" + myCol.replace("#", "");
      registerSvgImageOnMap(m, icoName, makeRealisticDroneSvg(myCol), 52);
      src.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] }, properties: { bearing: Number(bearingDeg) || 0, ico: icoName } }]
      });
      const now = Date.now();
      if (tac.roomCode && typeof broadcastPacket === "function" && now - _lastDroneMqttTx > 700) {
        _lastDroneMqttTx = now;
        broadcastPacket({ kind: "drone_pos", active: true, lng: lng, lat: lat, bearing: Number(bearingDeg) || 0, colorHex: myCol, qra: tac.myQra || "OP" });
      }
    };

    window.renderTeammateDronesOnMaps = function () {
      const drones = Object.values(tac.teammateDrones || {});
      tac.maps.forEach(function (map) {
        if (!canDrawOnMap(map)) return;
        ensureReconLayers(map);
        const feats = [];
        drones.forEach(function (d) {
          const col = d.colorHex || "#38BDF8";
          const icoName = "az-drone-craft-" + col.replace("#", "");
          registerSvgImageOnMap(map, icoName, makeRealisticDroneSvg(col), 52);
          feats.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [d.lng, d.lat] },
            properties: { bearing: Number(d.bearing) || 0, ico: icoName, qra: "DRONE " + (d.qra || "") }
          });
        });
        const src = map.getSource("az-teammates-drones-src");
        if (src) src.setData({ type: "FeatureCollection", features: feats });
      });
    };

    function updateReconGeoJsonLayers() {
      const m = getActiveMap();
      if (!m) return;
      ensureReconLayers(m);
      const vis = state.featuresVisible ? "visible" : "none";
      ["az-recon-escada-base", "az-recon-escada-steps", "az-recon-beco-bg", "az-recon-beco-dash", "az-recon-pins-layer", "az-recon-target-glow", "az-recon-target-core"].forEach(function (lid) {
        if (m.getLayer(lid)) m.setLayoutProperty(lid, "visibility", vis);
      });
      const lineFeats = [];
      const pinFeats = [];
      state.revealedFeatures.forEach(function (f) {
        if (!f || !Array.isArray(f.coords) || f.coords.length < 2) return;
        const c0 = f.coords[0];
        const c1 = f.coords[1];
        const angle = calcDistAndBearing(c0[1], c0[0], c1[1], c1[0]).bearing || 0;
        lineFeats.push({ type: "Feature", geometry: { type: "LineString", coordinates: f.coords }, properties: { id: f.id, kind: f.kind } });
        pinFeats.push({ type: "Feature", geometry: { type: "Point", coordinates: c0 }, properties: { id: f.id, kind: f.kind, angle: angle, label: f.name || (f.kind === "escada" ? "ESCADA" : "BECO") } });
      });
      const targetFeats = state.matchedTargets.filter(function (t) { return Array.isArray(t.coords) && t.coords.length >= 2; }).map(function (t) {
        return { type: "Feature", geometry: { type: "LineString", coordinates: t.coords }, properties: { name: t.name } };
      });
      if (m.getSource("az-recon-features-src")) m.getSource("az-recon-features-src").setData({ type: "FeatureCollection", features: lineFeats });
      if (m.getSource("az-recon-pins-src")) m.getSource("az-recon-pins-src").setData({ type: "FeatureCollection", features: pinFeats });
      if (m.getSource("az-recon-target-src")) m.getSource("az-recon-target-src").setData({ type: "FeatureCollection", features: targetFeats });
    }

    function pointInPoly(lng, lat, ring) {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0], yi = ring[i][1];
        const xj = ring[j][0], yj = ring[j][1];
        const intersect = ((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / ((yj - yi) || 1e-12) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }

    function isPointInsideSector(lng, lat) {
      if (state.shapeMode === "polygon" && Array.isArray(state.polygonRing) && state.polygonRing.length >= 3) {
        return pointInPoly(lng, lat, state.polygonRing);
      }
      if (state.shapeMode === "circle" && state.center) {
        return calcDistAndBearing(state.center.lat, state.center.lng, lat, lng).dist <= state.radiusM;
      }
      if (state.shapeMode === "rect" && state.rectCornerA && state.rectCornerB) {
        const minLng = Math.min(state.rectCornerA.lng, state.rectCornerB.lng);
        const maxLng = Math.max(state.rectCornerA.lng, state.rectCornerB.lng);
        const minLat = Math.min(state.rectCornerA.lat, state.rectCornerB.lat);
        const maxLat = Math.max(state.rectCornerA.lat, state.rectCornerB.lat);
        return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
      }
      return true;
    }

    function getSectorPolygonCoords() {
      if (state.shapeMode === "polygon" && Array.isArray(state.polygonRing) && state.polygonRing.length >= 3) {
        return state.polygonRing;
      }
      if (state.shapeMode === "circle" && state.center) {
        const pts = [];
        const cosLat = Math.max(0.2, Math.cos((state.center.lat * Math.PI) / 180));
        for (let i = 0; i <= 48; i++) {
          const ang = (i / 48) * Math.PI * 2;
          const dLat = (Math.sin(ang) * state.radiusM) / 111320;
          const dLng = (Math.cos(ang) * state.radiusM) / (111320 * cosLat);
          pts.push([state.center.lng + dLng, state.center.lat + dLat]);
        }
        return pts;
      }
      if (state.shapeMode === "rect" && state.rectCornerA && state.rectCornerB) {
        const minLng = Math.min(state.rectCornerA.lng, state.rectCornerB.lng);
        const maxLng = Math.max(state.rectCornerA.lng, state.rectCornerB.lng);
        const minLat = Math.min(state.rectCornerA.lat, state.rectCornerB.lat);
        const maxLat = Math.max(state.rectCornerA.lat, state.rectCornerB.lat);
        return [[minLng, minLat], [maxLng, minLat], [maxLng, maxLat], [minLng, maxLat], [minLng, minLat]];
      }
      return null;
    }

    function getSectorBbox() {
      const poly = getSectorPolygonCoords();
      if (!poly || !poly.length) return null;
      let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
      poly.forEach(function (pt) {
        if (pt[0] < minLng) minLng = pt[0];
        if (pt[0] > maxLng) maxLng = pt[0];
        if (pt[1] < minLat) minLat = pt[1];
        if (pt[1] > maxLat) maxLat = pt[1];
      });
      return { minLat: minLat, minLng: minLng, maxLat: maxLat, maxLng: maxLng };
    }

    function drawReconSectorBoundary() {
      const m = getActiveMap();
      if (!m) return;
      ensureReconLayers(m);
      const isSat = Boolean(tac.satMode);
      try {
        if (m.getLayer("az-recon-sector-fill")) {
          m.setPaintProperty("az-recon-sector-fill", "fill-color", isSat ? "#38BDF8" : "#DC2626");
          m.setPaintProperty("az-recon-sector-fill", "fill-opacity", isSat ? 0.14 : 0.10);
        }
        if (m.getLayer("az-recon-sector-line")) {
          m.setPaintProperty("az-recon-sector-line", "line-color", isSat ? "#F59E0B" : "#B45309");
        }
      } catch (_) {}
      const poly = getSectorPolygonCoords();
      const src = m.getSource("az-recon-sector-src");
      if (src) {
        src.setData(!poly ? { type: "FeatureCollection", features: [] } : {
          type: "FeatureCollection",
          features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [poly] }, properties: {} }]
        });
      }
      const hSrc = m.getSource("az-recon-handles-src");
      if (hSrc) {
        const hFeats = [];
        if (state.shapeMode === "circle" && state.center) {
          const cosLat = Math.max(0.2, Math.cos((state.center.lat * Math.PI) / 180));
          const edgeLng = state.center.lng + state.radiusM / (111320 * cosLat);
          hFeats.push({ type: "Feature", geometry: { type: "Point", coordinates: [state.center.lng, state.center.lat] }, properties: { handleKind: "center" } });
          hFeats.push({ type: "Feature", geometry: { type: "Point", coordinates: [edgeLng, state.center.lat] }, properties: { handleKind: "radius" } });
        } else if (state.shapeMode === "rect" && state.rectCornerA && state.rectCornerB) {
          hFeats.push({ type: "Feature", geometry: { type: "Point", coordinates: [state.rectCornerA.lng, state.rectCornerA.lat] }, properties: { handleKind: "cornerA" } });
          hFeats.push({ type: "Feature", geometry: { type: "Point", coordinates: [state.rectCornerB.lng, state.rectCornerB.lat] }, properties: { handleKind: "cornerB" } });
        }
        hSrc.setData({ type: "FeatureCollection", features: hFeats });
      }
      if (typeof applySmartDepthRecommendation === "function") applySmartDepthRecommendation();
      updateReconEtaEstimate();
    }

    function clampPointInsideSector(lng, lat) {
      if (state.shapeMode === "circle" && state.center) {
        const d = calcDistAndBearing(state.center.lat, state.center.lng, lat, lng);
        const maxR = Math.max(20, state.radiusM * 0.98);
        if (d.dist <= maxR) return { lng: lng, lat: lat };
        const cosLat = Math.max(0.2, Math.cos((state.center.lat * Math.PI) / 180));
        const ratio = maxR / d.dist;
        return {
          lng: state.center.lng + (lng - state.center.lng) * ratio,
          lat: state.center.lat + (lat - state.center.lat) * ratio
        };
      }
      if (state.shapeMode === "rect" && state.rectCornerA && state.rectCornerB) {
        const minLng = Math.min(state.rectCornerA.lng, state.rectCornerB.lng);
        const maxLng = Math.max(state.rectCornerA.lng, state.rectCornerB.lng);
        const minLat = Math.min(state.rectCornerA.lat, state.rectCornerB.lat);
        const maxLat = Math.max(state.rectCornerA.lat, state.rectCornerB.lat);
        return {
          lng: Math.max(minLng, Math.min(maxLng, lng)),
          lat: Math.max(minLat, Math.min(maxLat, lat))
        };
      }
      const bbox = getSectorBbox();
      if (bbox) {
        return {
          lng: Math.max(bbox.minLng, Math.min(bbox.maxLng, lng)),
          lat: Math.max(bbox.minLat, Math.min(bbox.maxLat, lat))
        };
      }
      return { lng: lng, lat: lat };
    }

    function applySmartDepthRecommendation() {
      const areaKm2 = getSectorAreaKm2();
      let rec = "tatica";
      if (areaKm2 <= 1.5) rec = "minuciosa";
      else if (areaKm2 <= 5.0) rec = "tatica";
      else rec = "superficial";
      if (!state.depthManualOverride) {
        state.depthLevel = rec;
        applyDepthPresetToCriteria(rec);
      }
      const warnEl = document.getElementById("azReconConfirmInfo");
      if (warnEl && state.depthLevel === "minuciosa" && areaKm2 > 5.0) {
        warnEl.textContent = `Área ${areaKm2.toFixed(1)} km² — Minuciosa pode demorar`;
      }
    }

    function applyDepthPresetToCriteria(level) {
      const presets = {
        superficial: { malha: false, becos: false, semSaida: false, cerco: false, raioX: false, voz: true },
        tatica:      { malha: true,  becos: true,  semSaida: true,  cerco: true,  raioX: false, voz: true },
        minuciosa:   { malha: true,  becos: true,  semSaida: true,  cerco: true,  raioX: true,  voz: true }
      };
      const p = presets[level] || presets.tatica;
      state.criteria = Object.assign({}, p);
      try { localStorage.setItem("az_recon_depth_v1", level); } catch (_) {}
      const mapIds = {
        azReconCritMalha: p.malha,
        azReconCritBecos: p.becos,
        azReconCritSemSaida: p.semSaida,
        azReconCritCerco: p.cerco,
        azReconCritRaioX: p.raioX,
        azReconCritVoz: p.voz
      };
      Object.keys(mapIds).forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.checked = Boolean(mapIds[id]);
      });
      document.querySelectorAll("[data-recon-depth]").forEach(function (btn) {
        btn.classList.toggle("is-active", btn.getAttribute("data-recon-depth") === level);
      });
    }

    function checkDivergentNeighborhood() {
      const typed = String(state.destLabel || (document.getElementById("azReconDestInput")?.value) || "").trim();
      if (!typed) return { divergent: false };
      const normTyped = typed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const bbox = getSectorBbox();
      if (!bbox) return { divergent: false };
      const cLat = (bbox.minLat + bbox.maxLat) / 2;
      const cLng = (bbox.minLng + bbox.maxLng) / 2;
      let nearestUnit = null, minD = Infinity;
      try {
        const unidades = (window.AZ_GEO_DATASETS && window.AZ_GEO_DATASETS.unidades) || [];
        for (let i = 0; i < unidades.length; i++) {
          const u = unidades[i];
          if (typeof u.lat !== "number" || typeof u.lng !== "number") continue;
          const d = calcDistAndBearing(cLat, cLng, u.lat, u.lng).dist;
          if (d < minD) { minD = d; nearestUnit = u; }
        }
      } catch (_) {}
      if (nearestUnit && nearestUnit.bairro) {
        const normNear = String(nearestUnit.bairro).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (normNear && !normNear.includes(normTyped) && !normTyped.includes(normNear) && minD < 2500) {
          return { divergent: true, typed: typed, actual: nearestUnit.bairro };
        }
      }
      return { divergent: false };
    }

    window.initReconSectorAtOrigin = function () {
      const m = getActiveMap();
      if (!m) return;
      const origin = (tac.myPos && typeof tac.myPos.lat === "number" && typeof tac.myPos.lng === "number")
        ? { lng: tac.myPos.lng, lat: tac.myPos.lat }
        : m.getCenter();
      state.shapeMode = "circle";
      state.center = { lng: origin.lng, lat: origin.lat };
      state.rectCornerA = null;
      state.rectCornerB = null;
      drawReconSectorBoundary();
    };

    function generateReconWaypoints(pattern) {
      const bbox = getSectorBbox();
      if (!bbox) return [];
      if (pattern === "perim") {
        const poly = getSectorPolygonCoords() || [];
        return poly.map(function (pt) { return { lng: pt[0], lat: pt[1] }; });
      }
      const midLat = (bbox.minLat + bbox.maxLat) / 2;
      const cosLat = Math.max(0.2, Math.cos((midLat * Math.PI) / 180));
      const heightM = (bbox.maxLat - bbox.minLat) * 111320;
      const laneStepM = Math.max(85, Math.min(550, Math.round(heightM / 12)));
      const numLanes = Math.max(2, Math.min(16, Math.ceil(heightM / laneStepM)));
      const wps = [];
      for (let i = 0; i <= numLanes; i++) {
        const t = 0.04 + (i / numLanes) * 0.92;
        const lat = bbox.minLat + t * (bbox.maxLat - bbox.minLat);
        let minX = bbox.minLng, maxX = bbox.maxLng;
        if (state.shapeMode === "circle" && state.center) {
          const dy = (lat - state.center.lat) * 111320;
          const halfW = Math.sqrt(Math.max(0, state.radiusM * state.radiusM - dy * dy)) * 0.94;
          const dLng = halfW / (111320 * cosLat);
          minX = state.center.lng - dLng;
          maxX = state.center.lng + dLng;
        }
        if (i % 2 === 0) {
          wps.push({ lng: minX, lat: lat, laneTurn: i > 0 });
          wps.push({ lng: maxX, lat: lat });
        } else {
          wps.push({ lng: maxX, lat: lat, laneTurn: i > 0 });
          wps.push({ lng: minX, lat: lat });
        }
      }
      return wps;
    }

    function resolveBairroForPoint(lat, lng, tags) {
      if (tags) {
        const direct = (tags["addr:suburb"] || tags.suburb || tags.neighbourhood || "").trim();
        if (direct) return direct;
      }
      const pts = state.neighborhoodPoints || [];
      if (pts.length > 0 && typeof lat === "number" && typeof lng === "number") {
        let best = pts[0].name;
        let bestDist = Infinity;
        for (let i = 0; i < pts.length; i++) {
          const d = calcDistAndBearing(lat, lng, pts[i].lat, pts[i].lng).dist;
          if (d < bestDist) { bestDist = d; best = pts[i].name; }
        }
        return best;
      }
      return state.destLabel || (state.analysis && state.analysis.neighborhoods && state.analysis.neighborhoods[0]) || "";
    }

    function classifyAndBuildSectorAnalysis(elements) {
      const neighborhoods = new Set();
      const nbPts = [];
      if (state.destLabel) neighborhoods.add(state.destLabel);
      elements.forEach(function (el) {
        const tags = el.tags || {};
        const nb = (tags.suburb || tags.neighbourhood || tags["addr:suburb"] || "").trim();
        if (nb) neighborhoods.add(nb);
        if (tags.place === "suburb" || tags.place === "neighbourhood" || tags.place === "quarter") {
          if (tags.name) {
            neighborhoods.add(tags.name);
            if (typeof el.lat === "number" && typeof el.lon === "number") {
              nbPts.push({ name: tags.name, lat: el.lat, lng: el.lon });
            } else if (Array.isArray(el.coords) && el.coords[0]) {
              nbPts.push({ name: tags.name, lat: el.coords[0][1], lng: el.coords[0][0] });
            }
          }
        }
      });
      state.neighborhoodPoints = nbPts;

      const avMap = new Map();
      const ruaMap = new Map();
      const becoMap = new Map();
      const escMap = new Map();
      const targetTerms = getTargetTerms();
      const matched = [];
      const vehicularWays = [];
      const pedWays = [];
      const blockadePts = [];
      let unnamedCount = 0;
      let shopsCount = 0;
      let greenCount = 0;
      let indCount = 0;

      const isPlaceholderName = function (nm) {
        return !nm || /#|unnamed|sem nome|s\/n/i.test(nm);
      };

      const mergeWay = function (mapObj, name, bairro, coords, mid, kind) {
        const lenM = calcTraceDistanceMeters(coords);
        const normKey = normalizeStr(name);
        if (mapObj.has(normKey)) {
          const ex = mapObj.get(normKey);
          ex.lengthM += lenM;
          ex.segments.push(coords);
          return ex;
        }
        const obj = {
          name: name,
          bairro: bairro,
          coords: coords,
          segments: [coords],
          lengthM: lenM,
          lat: mid[1],
          lng: mid[0],
          kind: kind
        };
        mapObj.set(normKey, obj);
        return obj;
      };

      elements.forEach(function (el) {
        const tags = el.tags || {};
        if (tags.shop || tags.amenity) shopsCount++;
        if (tags.landuse === "industrial" || tags.building === "warehouse" || tags.building === "industrial") indCount++;
        if (tags.landuse === "forest" || tags.leisure === "park" || tags.natural === "wood") greenCount++;

        const coords = Array.isArray(el.coords) ? el.coords : [];
        if (coords.length < 2) return;
        const mid = coords[Math.floor(coords.length / 2)];
        const name = (tags.name || "").trim();
        const hw = tags.highway || "";
        const svc = tags.service || "";
        const fw = tags.footway || "";
        const widthNum = parseFloat(String(tags.width || "").replace(",", "."));
        const isNarrowPhys = tags.narrow === "yes" || tags.motor_vehicle === "no" || (Number.isFinite(widthNum) && widthNum > 0 && widthNum < 4);

        const isEscada = hw === "steps" || /escada|escadaria/i.test(name);
        const isBeco = !isEscada && (
          hw === "alley" || svc === "alley" || /beco|viela|travessa/i.test(name) ||
          ((hw === "footway" || hw === "path" || hw === "pedestrian") && fw !== "sidewalk" && fw !== "crossing") ||
          (hw === "living_street" && isNarrowPhys) ||
          (isNarrowPhys && !/primary|secondary|trunk|motorway/.test(hw))
        );
        const isVehicular = !isEscada && !isBeco && Boolean(hw) && hw !== "footway" && hw !== "path" && hw !== "cycleway";

        // 5. Pontos Automáticos de Cerco e Bloqueio (cruzamentos na borda do perímetro)
        if (isVehicular && state.criteria.cercoBloqueio) {
          for (let ci = 1; ci < coords.length; ci++) {
            const pA = coords[ci - 1];
            const pB = coords[ci];
            const inA = isPointInsideSector(pA[0], pA[1]);
            const inB = isPointInsideSector(pB[0], pB[1]);
            if (inA !== inB) {
              const bx = (pA[0] + pB[0]) / 2;
              const by = (pA[1] + pB[1]) / 2;
              if (!blockadePts.some(function (bp) { return calcDistAndBearing(by, bx, bp.lat, bp.lng).dist < 25; })) {
                blockadePts.push({
                  code: "B" + (blockadePts.length + 1),
                  via: isPlaceholderName(name) ? "Acesso viário" : name,
                  lat: by,
                  lng: bx
                });
              }
            }
          }
        }

        // Filtro geométrico rigoroso: somente itens dentro da área colorida
        if (!isPointInsideSector(mid[0], mid[1]) && !isPointInsideSector(coords[0][0], coords[0][1])) return;

        const bairro = resolveBairroForPoint(mid[1], mid[0], tags);
        let itemObj = null;

        if (isEscada) {
          pedWays.push({ coords: coords, name: name || "Escadaria", kind: "escada" });
          const brEsc = (bairro && !/setor mapeado/i.test(bairro)) ? bairro : (state.destLabel || "Setor");
          const keyLabel = !isPlaceholderName(name) ? name : (`Escadaria #${escMap.size + 1} (${brEsc})`);
          itemObj = mergeWay(escMap, keyLabel, brEsc, coords, mid, "escada");
        } else if (isBeco) {
          pedWays.push({ coords: coords, name: name || "Passagem", kind: "beco" });
          const brBeco = (bairro && !/setor mapeado/i.test(bairro)) ? bairro : (state.destLabel || "Setor");
          const keyLabel = !isPlaceholderName(name) ? name : (`Passagem s/ denominação #${becoMap.size + 1} (${brBeco})`);
          itemObj = mergeWay(becoMap, keyLabel, brBeco, coords, mid, "beco");
        } else if (isVehicular) {
          vehicularWays.push({ coords: coords, name: isPlaceholderName(name) ? "Via local" : name, hw: hw });
          if (isPlaceholderName(name)) {
            unnamedCount++;
          } else if (/^(motorway|trunk|primary|secondary)/.test(hw) || /^av\.?|^avenida|^rod\.?|^via\s/i.test(name)) {
            itemObj = mergeWay(avMap, name, bairro, coords, mid, "avenida");
          } else {
            itemObj = mergeWay(ruaMap, name, bairro, coords, mid, "rua");
          }
        }

        if (itemObj && name && targetTerms.length > 0) {
          const normName = normalizeStr(name);
          if (targetTerms.some(function (t) { return normName.includes(t); })) {
            if (!matched.some(function (m) { return m.name === itemObj.name; })) matched.push(itemObj);
          }
        }
      });

      // 3. Topologia de Ruas Sem Saída
      const semSaida = [];
      if (state.criteria.semSaida && vehicularWays.length > 0) {
        const nodeDeg = new Map();
        const nodeKey = function (pt) { return pt[0].toFixed(5) + "," + pt[1].toFixed(5); };
        vehicularWays.forEach(function (vw) {
          vw.coords.forEach(function (pt, idx) {
            const k = nodeKey(pt);
            const cur = nodeDeg.get(k) || { pt: pt, count: 0, wayNames: new Set() };
            cur.count += (idx === 0 || idx === vw.coords.length - 1) ? 1 : 2;
            cur.wayNames.add(vw.name);
            nodeDeg.set(k, cur);
          });
        });
        nodeDeg.forEach(function (nd) {
          if (nd.count !== 1) return;
          const pt = nd.pt;
          if (!isPointInsideSector(pt[0], pt[1])) return;
          // Ignora pontas muito próximas da borda (cortadas pelo polígono)
          if (state.shapeMode === "circle" && state.center) {
            if (calcDistAndBearing(state.center.lat, state.center.lng, pt[1], pt[0]).dist > state.radiusM - 18) return;
          }
          let hasFootEscape = false;
          for (let pi = 0; pi < pedWays.length; pi++) {
            const pc = pedWays[pi].coords;
            for (let pj = 0; pj < pc.length; pj++) {
              if (calcDistAndBearing(pt[1], pt[0], pc[pj][1], pc[pj][0]).dist <= 16) {
                hasFootEscape = true;
                break;
              }
            }
            if (hasFootEscape) break;
          }
          const viaName = Array.from(nd.wayNames)[0] || "Via local";
          if (!semSaida.some(function (s) { return s.name === viaName; })) {
            semSaida.push({
              name: viaName,
              tipo: hasFootEscape ? "Sem saída p/ viatura (fuga a pé)" : "Bolsão totalmente fechado",
              lat: pt[1],
              lng: pt[0],
              coords: [pt]
            });
          }
        });
      }

      // 4. Análise Topológica de Becos, Vielas e Escadarias + Pontos de Inspeção (?)
      const raioX = [];
      const becosPorRua = {};
      const qMarks = [];
      const addQuestionMark = function (lat, lng, motivo, viaRef) {
        if (!isPointInsideSector(lng, lat) || qMarks.length >= 10) return null;
        if (qMarks.some(function (q) { return calcDistAndBearing(lat, lng, q.lat, q.lng).dist < 35; })) return null;
        const qId = "qm_" + (qMarks.length + 1);
        const obj = { id: qId, lat: lat, lng: lng, motivo: motivo, vinculoVia: viaRef || "", status: "Pendente", orbited: false };
        qMarks.push(obj);
        return obj;
      };
      const findNearestStreet = function (pt) {
        let best = "";
        let bestD = 18;
        for (let vi = 0; vi < vehicularWays.length; vi++) {
          const vw = vehicularWays[vi];
          for (let vj = 0; vj < vw.coords.length; vj++) {
            const d = calcDistAndBearing(pt[1], pt[0], vw.coords[vj][1], vw.coords[vj][0]).dist;
            if (d <= bestD) { bestD = d; best = vw.name; }
          }
        }
        return best;
      };
      const findEnvAtEnd = function (pt) {
        let bestEnv = "";
        for (let ei = 0; ei < elements.length; ei++) {
          const el = elements[ei];
          const tg = el.tags || {};
          let eLat = el.lat, eLng = el.lon;
          if (Array.isArray(el.coords) && el.coords[0]) { eLng = el.coords[0][0]; eLat = el.coords[0][1]; }
          if (typeof eLat !== "number" || typeof eLng !== "number") continue;
          if (calcDistAndBearing(pt[1], pt[0], eLat, eLng).dist > 45) continue;
          if (tg.waterway) { bestEnv = "Margem de córrego (" + (tg.name || "curso d'água") + ")"; break; }
          if (tg.landuse === "forest" || tg.natural === "wood" || tg.natural === "scrub") { bestEnv = "Área de mata"; break; }
          if (tg.landuse === "brownfield" || tg.landuse === "greenfield") { bestEnv = "Terreno baldio"; break; }
        }
        return bestEnv;
      };
      const allAlleys = Array.from(becoMap.values()).concat(Array.from(escMap.values()));
      allAlleys.forEach(function (al) {
        const pStart = al.coords[0];
        const pEnd = al.coords[al.coords.length - 1];
        const iniRua = findNearestStreet(pStart) || "Acesso local";
        let fimRua = findNearestStreet(pEnd);
        let qLink = null;
        if (!fimRua) {
          const envOut = findEnvAtEnd(pEnd);
          if (envOut) {
            fimRua = envOut;
            qLink = addQuestionMark(pEnd[1], pEnd[0], `${al.name} termina junto a ${envOut.toLowerCase()}`, al.name);
          } else {
            const qm = addQuestionMark(pEnd[1], pEnd[0], `${al.name}: saída não consta na base`, al.name);
            qLink = qm;
            fimRua = "Saída não mapeada na base" + (qm ? ` (vinculada ao marcador ? #${qMarks.length})` : "");
          }
        }
        let bifurc = 0;
        pedWays.forEach(function (pw) {
          if (pw.coords === al.coords) return;
          for (let k = 1; k < al.coords.length - 1; k++) {
            const pt = al.coords[k];
            if (calcDistAndBearing(pt[1], pt[0], pw.coords[0][1], pw.coords[0][0]).dist <= 12) {
              bifurc++;
              break;
            }
          }
        });
        let cls = "Sem saída mapeada";
        if (bifurc >= 2) cls = `Ramificado (${bifurc} bif.)`;
        else if (iniRua !== "Acesso local" && !/não mapeada/i.test(fimRua) && iniRua !== fimRua) {
          cls = "Vazado / Travessia";
        }
        al.inicioRua = iniRua;
        al.terminoRua = fimRua;
        al.qMarkId = qLink ? qLink.id : null;
        const ficha = {
          name: al.name,
          kind: al.kind,
          inicioRua: iniRua,
          terminoRua: fimRua,
          comprimentoM: al.lengthM,
          classificacao: cls,
          qMarkId: al.qMarkId,
          coords: al.coords,
          lat: al.lat,
          lng: al.lng
        };
        if (state.criteria.raioXTopologico) {
          raioX.push(ficha);
        }
        if (!becosPorRua[iniRua]) becosPorRua[iniRua] = [];
        becosPorRua[iniRua].push(ficha);
      });

      // Estruturas/edificações sem identificação clara na área -> marcador ?
      elements.forEach(function (el) {
        if (qMarks.length >= 10) return;
        const tg = el.tags || {};
        if ((tg.building && !tg.name && !tg.amenity && !tg.shop) || (tg.highway && !tg.name && /track|path/.test(tg.highway))) {
          let eLat = el.lat, eLng = el.lon;
          if (Array.isArray(el.coords) && el.coords[0]) { eLng = el.coords[0][0]; eLat = el.coords[0][1]; }
          if (typeof eLat === "number" && typeof eLng === "number") {
            addQuestionMark(eLat, eLng, tg.building ? "Edificação/estrutura sem identificação na base" : "Passagem atípica sem nome", "");
          }
        }
      });
      state.questionMarks = qMarks;
      if (typeof updateReconQuestionMarksLayer === "function") updateReconQuestionMarksLayer();

      const becos = Array.from(becoMap.values());
      const escadarias = Array.from(escMap.values());
      const avenidas = Array.from(avMap.values());
      const ruas = Array.from(ruaMap.values());
      const totalAlleys = becos.length + escadarias.length;
      const totalRoads = avenidas.length + ruas.length;

      let profile = "BAIRRO RESIDENCIAL";
      if (totalAlleys >= 6 && totalAlleys >= totalRoads * 0.45) profile = "AGLOMERADO / VILA";
      else if (totalAlleys >= 3 && shopsCount >= 5) profile = "ZONA MISTA (RESIDENCIAL + AGLOMERADO)";
      else if (shopsCount >= 10 || (avenidas.length >= 2 && shopsCount >= 6)) profile = "ÁREA COMERCIAL / CENTRAL";
      else if (indCount >= 3) profile = "INDUSTRIAL / GALPÕES";
      else if (greenCount >= 4 && totalRoads <= 3) profile = "ÁREA VERDE / MATA";
      else if (shopsCount >= 4 && ruas.length >= 3) profile = "ZONA MISTA (RESIDENCIAL + COMERCIAL)";

      let complexity = "Baixa";
      if (totalAlleys >= 7 || (totalAlleys + totalRoads) >= 24) complexity = "Alta";
      else if (totalAlleys >= 2 || (totalAlleys + totalRoads) >= 10) complexity = "Média";

      state.matchedTargets = matched;
      // 6. Enriquecimento viário (distância, azimute do operador, classificação funcional, sem saída)
      const opRef = (tac.myPos && typeof tac.myPos.lat === "number") ? tac.myPos : (state.center || { lat: -19.9191, lng: -43.9386 });
      const semSaidaSet = new Set(semSaida.map(function (s) { return normalizeStr(s.name); }));
      const enrichRoadItem = function (item, clsFunc) {
        const db = calcDistAndBearing(opRef.lat, opRef.lng, item.lat, item.lng);
        item.distOpM = Math.round(db.dist);
        item.azimuteOp = Math.round((db.bearing + 360) % 360);
        item.classificacaoFuncional = clsFunc;
        item.isSemSaida = semSaidaSet.has(normalizeStr(item.name));
        return item;
      };
      avenidas.forEach(function (it) { enrichRoadItem(it, "Avenida arterial"); });
      ruas.forEach(function (it) { enrichRoadItem(it, "Rua local"); });
      becos.forEach(function (it) { enrichRoadItem(it, "Beco / Passagem"); });
      escadarias.forEach(function (it) { enrichRoadItem(it, "Escadaria"); });

      // 7. Unidade / Companhia responsável (via dados.json / base local mais próxima)
      let unidadeResp = "Não identificada na base local";
      let minUnitD = Infinity;
      try {
        const localUnits = (window.AZ_GEO_DATASETS && window.AZ_GEO_DATASETS.unidades) || [];
        const cPt = state.center || opRef;
        localUnits.forEach(function (u) {
          if (typeof u.lat !== "number" || typeof u.lng !== "number") return;
          const d = calcDistAndBearing(cPt.lat, cPt.lng, u.lat, u.lng).dist;
          if (d < minUnitD) {
            minUnitD = d;
            unidadeResp = (u.name || u.unidade || "Unidade PMMG") + (u.subtitle ? " (" + u.subtitle + ")" : "");
          }
        });
      } catch (_) {}

      // 8. Detecção Exata Condicional (SOMENTE itens reais dentro da área dentre as 10 categorias)
      const condCategories = ["Escola", "Hospital", "Batalhão", "Lagoa", "Lago", "Córrego", "Mata", "Terreno baldio", "Aterro", "Presídio"];
      const condBuckets = {};
      condCategories.forEach(function (c) { condBuckets[c] = []; });
      const pushCond = function (cat, nome, lat, lng, extPorte) {
        if (!condBuckets[cat] || !isPointInsideSector(lng, lat)) return;
        const cleanNome = String(nome || cat).trim();
        if (condBuckets[cat].some(function (x) { return normalizeStr(x.nome) === normalizeStr(cleanNome) && calcDistAndBearing(lat, lng, x.lat, x.lng).dist < 60; })) return;
        const dOp = Math.round(calcDistAndBearing(opRef.lat, opRef.lng, lat, lng).dist);
        condBuckets[cat].push({ nome: cleanNome, tipo: cat, lat: lat, lng: lng, distOpM: dOp, extensaoPorte: extPorte || "Localizado na área" });
      };

      elements.forEach(function (el) {
        const tg = el.tags || {};
        const nm = (tg.name || "").trim();
        let ptLat = el.lat, ptLng = el.lon;
        let lenM = 0;
        if (Array.isArray(el.coords) && el.coords.length > 0) {
          const mid = el.coords[Math.floor(el.coords.length / 2)];
          ptLng = mid[0]; ptLat = mid[1];
          if (el.coords.length >= 2) lenM = calcTraceDistanceMeters(el.coords);
        }
        if (typeof ptLat !== "number" || typeof ptLng !== "number") return;
        const porteStr = lenM > 0 ? (lenM + " m") : "Área demarcada";

        if (tg.amenity === "school" || /escola|col[eé]gio|emef|ee\s/i.test(nm)) pushCond("Escola", nm || "Escola", ptLat, ptLng, porteStr);
        if (tg.amenity === "hospital" || tg.amenity === "clinic" || tg.healthcare === "hospital" || /hospital|upa|pronto.?socorro/i.test(nm)) pushCond("Hospital", nm || "Hospital / Unidade de Saúde", ptLat, ptLng, porteStr);
        if (tg.amenity === "police" || tg.military || tg.landuse === "military" || /batalh[aã]o|bpm|cia\s*pm|companhia/i.test(nm)) pushCond("Batalhão", nm || "Unidade Policial / Militar", ptLat, ptLng, porteStr);
        if (tg.amenity === "prison" || /pres[ií]dio|penitenci[aá]ria|ceresp|cadeia/i.test(nm)) pushCond("Presídio", nm || "Unidade Prisional", ptLat, ptLng, porteStr);
        if (tg.water === "lagoon" || /lagoa/i.test(nm)) pushCond("Lagoa", nm || "Lagoa", ptLat, ptLng, porteStr);
        else if (tg.natural === "water" || tg.water === "lake" || tg.water === "pond" || tg.water === "reservoir" || /\blago\b/i.test(nm)) pushCond("Lago", nm || "Lago / Espelho d'água", ptLat, ptLng, porteStr);
        if (tg.waterway === "stream" || tg.waterway === "river" || tg.waterway === "canal" || tg.waterway === "drain" || /c[oó]rrego|ribeir[aã]o/i.test(nm)) pushCond("Córrego", nm || "Córrego / Curso d'água", ptLat, ptLng, lenM > 0 ? (lenM + " m no setor") : "Curso d'água");
        if (tg.landuse === "forest" || tg.natural === "wood" || tg.natural === "scrub" || /\bmata\b|bosque/i.test(nm)) pushCond("Mata", nm || "Área de Mata / Vegetação densa", ptLat, ptLng, porteStr);
        if (tg.landuse === "brownfield" || tg.landuse === "greenfield" || /terreno baldio|lote vago/i.test(nm)) pushCond("Terreno baldio", nm || "Terreno baldio", ptLat, ptLng, porteStr);
        if (tg.landuse === "landfill" || /aterro/i.test(nm)) pushCond("Aterro", nm || "Aterro", ptLat, ptLng, porteStr);
      });

      try {
        const ds = window.AZ_GEO_DATASETS || {};
        (ds.hospitais || []).forEach(function (h) { if (typeof h.lat === "number") pushCond("Hospital", h.name, h.lat, h.lng, "Base local"); });
        (ds.unidades || []).forEach(function (u) { if (typeof u.lat === "number") pushCond("Batalhão", u.name, u.lat, u.lng, u.subtitle || "Base local"); });
      } catch (_) {}

      const condicionais = [];
      condCategories.forEach(function (cat) {
        if (condBuckets[cat].length > 0) {
          condicionais.push({ categoria: cat, itens: condBuckets[cat] });
        }
      });

      const bbox = getSectorBbox();
      let dimTexto = getSectorAreaKm2().toFixed(2) + " km²";
      if (state.shapeMode === "circle") {
        dimTexto = `Raio ${state.radiusM}m (${getSectorAreaKm2().toFixed(2)} km²)`;
      } else if (bbox) {
        const midLat = (bbox.minLat + bbox.maxLat) / 2;
        const wM = Math.round((bbox.maxLng - bbox.minLng) * 111320 * Math.max(0.2, Math.cos((midLat * Math.PI) / 180)));
        const hM = Math.round((bbox.maxLat - bbox.minLat) * 111320);
        dimTexto = `${wM}m x ${hM}m (${getSectorAreaKm2().toFixed(2)} km²)`;
      }
      const nivelMap = { superficial: "Superficial", tatica: "Detalhada", minuciosa: "Minuciosa" };
      const brLista = Array.from(neighborhoods).filter(function (b) { return b && !/setor mapeado/i.test(b); });
      const brNome = brLista.length ? brLista.join(", ") : (state.destLabel || "Bairro em identificação");
      const avPrincipais = avenidas.slice(0, 3).map(function (v) { return `${v.name} (${v.distOpM}m, ${v.azimuteOp}°)`; }).join(", ");
      const corCursos = condBuckets["Córrego"] ? condBuckets["Córrego"].length : 0;
      const sinteseParts = [
        `Área de perfil ${profile.toLowerCase()} em ${brNome}.`,
        avPrincipais ? `Principais acessos arteriais: ${avPrincipais}.` : `Circulação predominante por ${ruas.length} via(s) local(is).`,
        escadarias.length > 0 ? `Desníveis e escadarias identificados (${escadarias.length} trecho(s) de escadaria).` : "",
        corCursos > 0 ? `Presença de ${corCursos} curso(s) d'água com pontos de gargalo/travessia.` : "",
        blockadePts.length > 0 ? `${blockadePts.length} ponto(s) de contenção perimetral mapeados.` : ""
      ].filter(Boolean).join(" ");

      state.analysis = Object.assign({}, state.analysis, {
        profile: profile,
        neighborhoods: brLista,
        unidadeResponsavel: unidadeResp,
        dimensoesTexto: dimTexto,
        nivelTexto: nivelMap[state.depthLevel] || "Detalhada",
        sinteseTerreno: sinteseParts,
        condicionais: condicionais,
        avenidas: avenidas,
        ruas: ruas,
        becos: becos,
        escadarias: escadarias,
        semSaida: semSaida,
        pontosBloqueio: blockadePts,
        raioX: raioX,
        becosPorRua: becosPorRua,
        unnamedCount: unnamedCount,
        shopsCount: shopsCount,
        complexity: complexity
      });

      // Atualiza marcadores de Cerco (B1, B2...) na GPU
      const m = getActiveMap();
      if (m && m.getSource("az-recon-blockade-src")) {
        m.getSource("az-recon-blockade-src").setData({
          type: "FeatureCollection",
          features: blockadePts.map(function (bp) {
            return { type: "Feature", geometry: { type: "Point", coordinates: [bp.lng, bp.lat] }, properties: { code: bp.code, via: bp.via } };
          })
        });
      }
      renderSectorAnalysisPanel();
    }

    function saveReconReportForStage2() {
      try {
        const a = state.analysis || {};
        const report = {
          id: "recon_" + Date.now(),
          dataHora: new Date().toISOString(),
          municipio: "Belo Horizonte / RMBH",
          bairro: state.destLabel || (a.neighborhoods && a.neighborhoods[0]) || "Setor Mapeado",
          areaKm2: Number(getSectorAreaKm2().toFixed(2)),
          criteriosSelecionados: Object.assign({ depthLevel: state.depthLevel }, state.criteria),
          viasUnicas: (a.avenidas || []).concat(a.ruas || []).map(function (v) {
            return { nome: v.name, bairro: v.bairro, tipo: v.kind, extensaoM: v.lengthM || 0 };
          }),
          becosEscadarias: (a.becos || []).concat(a.escadarias || []).map(function (b) {
            return { nome: b.name, tipo: b.kind, extensaoM: b.lengthM || 0 };
          }),
          raioXTopologico: a.raioX || [],
          ruasSemSaida: a.semSaida || [],
          pontosBloqueio: a.pontosBloqueio || [],
          coordenadaCentral: state.center || null,
          poligono: getSectorPolygonCoords() || null
        };
        const arr = JSON.parse(localStorage.getItem("az_recon_reports_v1") || "[]");
        arr.unshift(report);
        if (arr.length > 12) arr.length = 12;
        localStorage.setItem("az_recon_reports_v1", JSON.stringify(arr));
      } catch (_) {}
    }

    function focusSectorItem(item) {
      if (!item) return;
      state.paused = true;
      const pb = document.getElementById("azReconPauseBtn");
      if (pb) pb.textContent = "RETOMAR";
      const m = getActiveMap();
      if (!m) return;
      ensureReconLayers(m);
      if (Array.isArray(item.coords) && item.coords.length >= 2) {
        if (m.getSource("az-recon-highlight-src")) {
          m.getSource("az-recon-highlight-src").setData({
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "LineString", coordinates: item.coords }, properties: {} }]
          });
        }
        if (m.getSource("az-recon-xray-pts-src")) {
          const pIni = item.coords[0];
          const pFim = item.coords[item.coords.length - 1];
          m.getSource("az-recon-xray-pts-src").setData({
            type: "FeatureCollection",
            features: [
              { type: "Feature", geometry: { type: "Point", coordinates: pIni }, properties: { tag: "INÍCIO", color: "#22C55E" } },
              { type: "Feature", geometry: { type: "Point", coordinates: pFim }, properties: { tag: "FIM", color: "#EF4444" } }
            ]
          });
        }
      } else if (m.getSource("az-recon-xray-pts-src")) {
        m.getSource("az-recon-xray-pts-src").setData({ type: "FeatureCollection", features: [] });
      }
      if (typeof m.easeTo === "function") {
        m.easeTo({ center: [item.lng, item.lat], zoom: 17.6, pitch: 48, duration: 480 });
      }
    }

    function renderSectorAnalysisPanel() {
      const tgtBox = document.getElementById("azSectorTargetsBox");
      const sumEl = document.getElementById("azSectorSummaryBox");
      const listEl = document.getElementById("azSectorListBox");
      if (!sumEl || !listEl) return;
      const a = state.analysis;

      if (tgtBox) {
        if (state.matchedTargets.length > 0) {
          tgtBox.style.display = "block";
          tgtBox.innerHTML = `<div style="font-size:9.5px;font-weight:900;color:#4ADE80;margin-bottom:4px;">ALVO(S) LOCALIZADO(S)</div>`;
          state.matchedTargets.forEach(function (mt) {
            const r = document.createElement("div");
            r.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:3px;";
            const sp = document.createElement("span");
            sp.style.cssText = "font-size:10.5px;font-weight:800;color:#FACC15;";
            sp.textContent = mt.name;
            const btns = document.createElement("div");
            btns.style.cssText = "display:flex;gap:4px;";
            const fBtn = document.createElement("button");
            fBtn.type = "button"; fBtn.className = "az-drone-pill-btn"; fBtn.textContent = "Focar";
            fBtn.addEventListener("click", function () { focusSectorItem(mt); });
            const rBtn = document.createElement("button");
            rBtn.type = "button"; rBtn.className = "az-drone-pill-btn is-sky"; rBtn.textContent = "Gerar Rota";
            rBtn.addEventListener("click", function () {
              if (typeof window.azimuteGeoRouteTo === "function") window.azimuteGeoRouteTo(mt.lat, mt.lng, mt.name, false);
            });
            btns.appendChild(fBtn); btns.appendChild(rBtn);
            r.appendChild(sp); r.appendChild(btns);
            tgtBox.appendChild(r);
          });
        } else {
          tgtBox.style.display = "none";
          tgtBox.innerHTML = "";
        }
      }

      const bairrosStr = a.neighborhoods.length ? a.neighborhoods.join(", ") : (state.destLabel || "Identificação por coordenada");
      const areaStr = a.dimensoesTexto || (getSectorAreaKm2().toFixed(2) + " km²");
      const nivelStr = a.nivelTexto || "Detalhada";
      const unitStr = a.unidadeResponsavel || "Base local";
      const carLine = a.carDistKm > 0 ? ` • <b>Viatura:</b> ${a.carDistKm} km (${a.carDurMin} min)` : "";
      const semSaidaN = Array.isArray(a.semSaida) ? a.semSaida.length : 0;
      const cercoN = Array.isArray(a.pontosBloqueio) ? a.pontosBloqueio.length : 0;
      const qList = Array.isArray(state.questionMarks) ? state.questionMarks : [];
      const pendingQ = qList.filter(function (q) { return q.status === "Pendente"; });

      let becosDescHtml = "";
      const becoEscAll = (a.becos || []).concat(a.escadarias || []);
      if (becoEscAll.length > 0) {
        becosDescHtml = `<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(197,168,105,0.22);">` +
          `<div style="font-weight:900;color:#C5A869;margin-bottom:2px;">ANÁLISE DE BECOS, VIELAS E ESCADARIAS</div>` +
          becoEscAll.slice(0, 6).map(function (b) {
            return `<div style="color:#E5E7EB;"><b>${b.name}</b> (${b.distOpM || 0}m • ${b.lengthM || 0}m): inicia em <i>${b.inicioRua || "acesso local"}</i> e desemboca em <i>${b.terminoRua || "saída não mapeada"}</i>.</div>`;
          }).join("") +
          `</div>`;
      }

      let qMarksHtml = "";
      if (pendingQ.length > 0) {
        qMarksHtml = `<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(197,168,105,0.22);">` +
          `<div style="font-weight:900;color:#C5A869;margin-bottom:2px;">PONTOS MARCADOS (?) PENDENTES (${pendingQ.length})</div>` +
          pendingQ.slice(0, 5).map(function (q, idx) {
            return `<div style="color:#FDE68A;"><b>? #${idx + 1}:</b> ${q.motivo} (${q.lat.toFixed(5)}, ${q.lng.toFixed(5)})</div>`;
          }).join("") +
          `</div>`;
      }

      let condHtml = "";
      if (Array.isArray(a.condicionais) && a.condicionais.length > 0) {
        condHtml = `<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(197,168,105,0.28);">` +
          `<div style="font-weight:900;color:#C5A869;margin-bottom:2px;">OCORRÊNCIAS CONFIRMADAS NA ÁREA</div>` +
          a.condicionais.map(function (grp) {
            const itensTxt = grp.itens.slice(0, 4).map(function (it) {
              return `${it.nome} (${it.distOpM}m • ${it.extensaoPorte})`;
            }).join("; ");
            return `<div style="color:#F3F4F6;"><b>${grp.categoria} (${grp.itens.length}):</b> ${itensTxt}</div>`;
          }).join("") +
          `</div>`;
      }
      sumEl.innerHTML =
        `<div style="font-weight:900;color:#C5A869;margin-bottom:3px;">a) IDENTIFICAÇÃO REAL: ${bairrosStr}</div>` +
        `<div><b>Unidade/Cia:</b> ${unitStr}</div>` +
        `<div><b>Dimensões:</b> ${areaStr} • <b>Nível:</b> ${nivelStr}${carLine}</div>` +
        `<div style="margin-top:4px;padding-top:4px;border-top:1px solid rgba(197,168,105,0.22);"><b>b) SÍNTESE DO TERRENO E CIRCULAÇÃO:</b> ${a.sinteseTerreno || "Varredura em processamento."}</div>` +
        `<div style="color:#94A3B8;margin-top:2px;"><b>Vias:</b> ${a.avenidas.length} art. / ${a.ruas.length} loc. • <b>Becos/Escadas:</b> ${becoEscAll.length} • <b>Sem Saída:</b> ${semSaidaN} • <b>Cerco:</b> ${cercoN}</div>` +
        becosDescHtml +
        qMarksHtml +
        condHtml;

      const items = a[state.activeTab] || [];
      listEl.innerHTML = "";
      if (!items.length) {
        listEl.innerHTML = `<div style="font-size:10px;color:#94A3B8;padding:8px;">Nenhum registro nesta aba para o setor atual.</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      items.forEach(function (item) {
        const row = document.createElement("div");
        row.className = "az-sector-item";
        const title = document.createElement("span");
        title.style.cssText = "font-size:10.5px;font-weight:700;color:#E2E8F0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
        const brTag = item.bairro ? ` • ${item.bairro}` : "";
        const lenTag = item.lengthM ? ` • ${item.lengthM}m` : "";
        const opTag = (typeof item.distOpM === "number") ? ` • ${item.distOpM}m (${item.azimuteOp || 0}°)` : "";
        const ssTag = item.isSemSaida ? " • Sem saída" : "";
        const clsTag = item.classificacaoFuncional ? ` [${item.classificacaoFuncional}]` : "";
        if (state.activeTab === "raioX") {
          title.textContent = `${item.name} (${item.inicioRua || "?"} → ${item.terminoRua || "?"}) • ${item.comprimentoM || 0}m • ${item.classificacao || ""}`;
        } else if (state.activeTab === "pontosBloqueio") {
          title.textContent = `${item.id || "B"}: ${item.name} (${item.tipo || "Cerco"})`;
        } else if (state.activeTab === "semSaida") {
          title.textContent = `${item.name} (${item.tipo || "Sem saída"})${brTag}`;
        } else {
          title.textContent = item.label || (`${item.name}${clsTag}${lenTag}${opTag}${ssTag}`);
        }
        const routeBtn = document.createElement("button");
        routeBtn.type = "button";
        routeBtn.className = "az-drone-pill-btn is-sky";
        routeBtn.textContent = "Gerar Rota";
        routeBtn.addEventListener("click", function (ev) {
          ev.stopPropagation();
          state.paused = true;
          const pauseBtn = document.getElementById("azReconPauseBtn");
          if (pauseBtn) pauseBtn.textContent = "RETOMAR";
          if (typeof window.azimuteGeoRouteTo === "function") {
            window.azimuteGeoRouteTo(item.lat, item.lng, item.name, false);
          }
        });
        row.addEventListener("click", function () { focusSectorItem(item); });
        row.appendChild(title);
        row.appendChild(routeBtn);
        frag.appendChild(row);
      });
      listEl.appendChild(frag);
    }

    async function fetchWithTimeout(url, opts, timeoutMs, parentSignal) {
      const ctrl = new AbortController();
      const timer = setTimeout(function () { try { ctrl.abort(); } catch (_) {} }, timeoutMs || 6000);
      const onParentAbort = function () { try { ctrl.abort(); } catch (_) {} };
      if (parentSignal) {
        if (parentSignal.aborted) { clearTimeout(timer); ctrl.abort(); }
        else parentSignal.addEventListener("abort", onParentAbort, { once: true });
      }
      try {
        return await fetch(url, Object.assign({}, opts || {}, { signal: ctrl.signal }));
      } finally {
        clearTimeout(timer);
        if (parentSignal) parentSignal.removeEventListener("abort", onParentAbort);
      }
    }

    async function fetchCarItinerary(orig, dest, signal) {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${orig.lng},${orig.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetchWithTimeout(url, {}, 4500, signal);
        if (!res.ok) return null;
        const json = await res.json();
        const route = json && json.routes && json.routes[0];
        if (!route || !route.geometry || !Array.isArray(route.geometry.coordinates)) return null;
        const steps = [];
        const legs = route.legs || [];
        legs.forEach(function (lg) {
          (lg.steps || []).forEach(function (st) {
            const nm = (st.name || "").trim();
            if (!nm) return;
            const loc = st.maneuver && st.maneuver.location;
            if (!loc) return;
            const dStr = st.distance >= 1000 ? (st.distance / 1000).toFixed(1) + " km" : Math.round(st.distance) + " m";
            steps.push({ name: nm, label: `${nm} (${dStr})`, lat: loc[1], lng: loc[0], coords: route.geometry.coordinates });
          });
        });
        return {
          coords: route.geometry.coordinates,
          distKm: Number((route.distance / 1000).toFixed(1)),
          durMin: Math.max(1, Math.round(route.duration / 60)),
          steps: steps
        };
      } catch (_) {
        return null;
      }
    }

    async function fetchSectorOsmOrOffline(signal) {
      const bbox = getSectorBbox();
      if (!bbox) return;
      const cacheKey = `${bbox.minLat.toFixed(4)},${bbox.minLng.toFixed(4)},${bbox.maxLat.toFixed(4)},${bbox.maxLng.toFixed(4)}|${state.shapeMode}|${state.radiusM}`;
      if (state.osmCacheKey === cacheKey && Array.isArray(state.cachedElements)) {
        classifyAndBuildSectorAnalysis(state.cachedElements);
        return;
      }
      if (!reconCfg.animMaster) setReconStatus("MAPEANDO...", null);
      const areaKm2 = getSectorAreaKm2();
      const terms = getTargetTerms();
      const targetRegex = terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|");
      const targetClause = targetRegex ? `way["name"~"${targetRegex}",i](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});` : "";
      const condClause = `nwr["amenity"~"^(school|hospital|clinic|prison|police)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});nwr["landuse"~"^(military|forest|brownfield|landfill|greenfield)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});nwr["natural"~"^(water|wood|scrub)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});way["waterway"~"^(stream|river|canal|drain)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});`;

      let query = "";
      if (areaKm2 > 3) {
        query = `[out:json][timeout:14];(way["highway"~"^(steps|alley|motorway|trunk|primary|secondary|tertiary|residential|living_street|unclassified|road|.*_link)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});way["service"="alley"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});${targetClause}${condClause}node["place"~"^(suburb|neighbourhood|quarter)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}););out body geom;`;
      } else {
        query = `[out:json][timeout:14];(way["highway"~"^(steps|alley|footway|path|pedestrian|motorway|trunk|primary|secondary|tertiary|residential|living_street|unclassified|road|service|.*_link)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});way["service"="alley"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});${targetClause}${condClause}node["shop"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});node["amenity"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});way["landuse"~"^(industrial|forest)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng});node["place"~"^(suburb|neighbourhood|quarter)$"](${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}););out body geom;`;
      }

      const endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
      ];
      let elements = null;
      for (let i = 0; i < endpoints.length; i++) {
        if (signal && signal.aborted) return;
        try {
          const res = await fetchWithTimeout(endpoints[i], {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: "data=" + encodeURIComponent(query)
          }, 11000, signal);
          if (res && res.ok) {
            const json = await res.json();
            if (json && Array.isArray(json.elements)) {
              elements = json.elements.map(function (el) {
                return {
                  tags: el.tags || {},
                  lat: el.lat,
                  lon: el.lon,
                  coords: Array.isArray(el.geometry) ? el.geometry.map(function (g) { return [g.lon, g.lat]; }) : []
                };
              });
              break;
            }
          }
        } catch (err) {
          if (signal && signal.aborted) return;
        }
      }

      if (!elements) {
        showToast("Leitura local (offline)");
        const m = getActiveMap();
        elements = [];
        if (m && typeof m.queryRenderedFeatures === "function") {
          try {
            const feats = m.queryRenderedFeatures();
            feats.forEach(function (f) {
              if (!f || !f.geometry) return;
              const props = f.properties || {};
              let coords = [];
              if (f.geometry.type === "LineString") coords = f.geometry.coordinates;
              else if (f.geometry.type === "MultiLineString" && f.geometry.coordinates[0]) coords = f.geometry.coordinates[0];
              elements.push({
                tags: { highway: props.class || props.subclass || props.type || "", name: props.name || "" },
                coords: coords
              });
            });
          } catch (_) {}
        }
      }

      state.osmCacheKey = cacheKey;
      state.cachedElements = elements;
      classifyAndBuildSectorAnalysis(elements);

      // Geocodificação reversa leve se o nome real do bairro ainda não constar na base
      if ((!state.analysis.neighborhoods || state.analysis.neighborhoods.length === 0) && !state.destLabel) {
        try {
          const cLat = (bbox.minLat + bbox.maxLat) / 2;
          const cLng = (bbox.minLng + bbox.maxLng) / 2;
          const revRes = await fetchWithTimeout(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${cLat.toFixed(5)}&lon=${cLng.toFixed(5)}&zoom=16`, {}, 4500, signal);
          if (revRes && revRes.ok) {
            const revJson = await revRes.json();
            const ad = revJson && revJson.address;
            const realNb = ad && (ad.suburb || ad.neighbourhood || ad.quarter || ad.city_district || ad.town);
            if (realNb) {
              state.destLabel = realNb;
              classifyAndBuildSectorAnalysis(elements);
            }
          }
        } catch (_) {}
      }

      const scanItems = [];
      state.analysis.escadarias.forEach(function (e, idx) {
        scanItems.push({ id: "rec_e_" + idx, kind: "escada", name: e.name, coords: e.coords, mid: { lat: e.lat, lng: e.lng } });
      });
      state.analysis.becos.forEach(function (b, idx) {
        scanItems.push({ id: "rec_b_" + idx, kind: "beco", name: b.name, coords: b.coords, mid: { lat: b.lat, lng: b.lng } });
      });

      if (!reconCfg.autoScan) {
        state.pendingFeatures = [];
        state.revealedFeatures = [];
      } else if (!reconCfg.animMaster || reconCfg.drawMode === "background") {
        state.pendingFeatures = [];
        state.revealedFeatures = scanItems;
      } else {
        state.pendingFeatures = scanItems;
        state.revealedFeatures = [];
      }
      updateReconGeoJsonLayers();
    }

    async function searchReconDestination() {
      const inp = document.getElementById("azReconDestInput");
      const q = (inp ? inp.value : "").trim();
      if (!q) { showToast("Digite o nome de um bairro ou setor."); return; }
      if (state.abortCtrl) { try { state.abortCtrl.abort(); } catch (_) {} }
      state.abortCtrl = new AbortController();
      setReconStatus("BUSCANDO...", null);
      let hit = null;
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(q + ", Belo Horizonte, MG, Brasil")}`;
        const r1 = await fetch(nomUrl, { signal: state.abortCtrl.signal });
        if (r1.ok) {
          const j1 = await r1.json();
          if (Array.isArray(j1) && j1[0]) hit = { lat: Number(j1[0].lat), lng: Number(j1[0].lon), label: q };
        }
      } catch (_) {}
      if (!hit) {
        try {
          const phUrl = `https://photon.komoot.io/api/?limit=3&lat=-19.9191&lon=-43.9386&q=${encodeURIComponent(q + " Belo Horizonte")}`;
          const r2 = await fetch(phUrl, { signal: state.abortCtrl.signal });
          if (r2.ok) {
            const j2 = await r2.json();
            const f = j2 && j2.features && j2.features[0];
            if (f && f.geometry && Array.isArray(f.geometry.coordinates)) {
              hit = { lng: Number(f.geometry.coordinates[0]), lat: Number(f.geometry.coordinates[1]), label: q };
            }
          }
        } catch (_) {}
      }
      if (!hit) {
        setReconStatus("PRONTO", null);
        showToast("Bairro/Setor não encontrado.");
        return;
      }
      state.destLabel = hit.label;
      state.shapeMode = "circle";
      state.center = { lng: hit.lng, lat: hit.lat };
      state.rectCornerA = null;
      state.rectCornerB = null;
      drawReconSectorBoundary();
      const m = getActiveMap();
      if (m && typeof m.easeTo === "function") {
        m.easeTo({ center: [hit.lng, hit.lat], zoom: 15.6, pitch: 42, duration: 500 });
      }
      state.pattern = "perim";
      if (tac.droneMode && tac.droneType !== "recon" && typeof startMapOrbitAround === "function") {
        startMapOrbitAround(hit.lng, hit.lat);
      }
      setReconStatus("SETOR MARCADO", null);
      showToast(`Área posicionada em ${hit.label}. Sobrevoo/órbita pronto para iniciar.`);
    }

    function setReconSectorActiveColor(isScanning) {
      const m = getActiveMap();
      if (!m) return;
      try {
        if (m.getLayer("az-recon-sector-fill")) {
          m.setPaintProperty("az-recon-sector-fill", "fill-color", isScanning ? "#38BDF8" : "#C5A869");
          m.setPaintProperty("az-recon-sector-fill", "fill-opacity", isScanning ? 0.16 : 0.06);
        }
        if (m.getLayer("az-recon-sector-line")) {
          m.setPaintProperty("az-recon-sector-line", "line-color", isScanning ? "#38BDF8" : "#C5A869");
        }
      } catch (_) {}
    }

    let _reconSwitchedSat = false;
    function applyReconTempLayer() {
      if (tac.satMode && typeof toggleSatelliteMode === "function") {
        _reconSwitchedSat = true;
        toggleSatelliteMode();
      }
    }
    window.restoreReconTempLayer = function () {
      if (_reconSwitchedSat && !tac.satMode && typeof toggleSatelliteMode === "function") {
        _reconSwitchedSat = false;
        toggleSatelliteMode();
      } else {
        _reconSwitchedSat = false;
      }
    };

    async function startReconFlight(pattern) {
      const m = getActiveMap();
      if (!m) return;
      if (!state.center && !state.rectCornerB && !state.customPolygon) window.initReconSectorAtOrigin();

      const divCheck = checkDivergentNeighborhood();
      if (divCheck.divergent) {
        if (window.AzVoiceJarvis && state.criteria?.voz !== false) {
          window.AzVoiceJarvis.speak("Atenção: perímetro divergente do bairro selecionado.", "recon_divergent");
        }
        const okDiv = window.confirm(`Atenção: o perímetro marcado está próximo de "${divCheck.actual}", mas o bairro digitado foi "${divCheck.typed}". Deseja continuar mesmo assim?`);
        if (!okDiv) return;
      }

      if (state.abortCtrl) { try { state.abortCtrl.abort(); } catch (_) {} }
      state.abortCtrl = new AbortController();
      const sig = state.abortCtrl.signal;

      const execSel = document.getElementById("azReconExecModeSelect");
      state.execMode = execSel ? execSel.value : (state.execMode || "live");

      state.pattern = pattern || "sweep";
      state.alertedTargetKeys = new Set();
      state.analysis.itinerario = [];
      state.analysis.carDistKm = 0;
      state.analysis.carDurMin = 0;

      if (window.AzVoiceJarvis && state.criteria?.voz !== false) {
        window.AzVoiceJarvis.speak("Drone no ar. Iniciando reconhecimento.", "recon_start");
      }

      // Modo Segundo Plano Real (desacoplado da câmera, com barra de progresso contínua)
      if (state.execMode === "bg") {
        const bgBar = document.getElementById("azReconBgProgressBar");
        const bgTxt = document.getElementById("azReconBgProgressText");
        if (bgBar) bgBar.style.display = "flex";
        if (bgTxt) bgTxt.textContent = "RECON EM SEGUNDO PLANO: 25%";
        setReconStatus("2º PLANO", "...");
        closeDroneMode(true);
        try {
          await fetchSectorOsmOrOffline(sig);
          if (sig.aborted) { if (bgBar) bgBar.style.display = "none"; return; }
          if (bgTxt) bgTxt.textContent = "RECON EM SEGUNDO PLANO: 85%";
          saveReconReportForStage2();
          triggerReconPdfDownload();
          if (bgTxt) bgTxt.textContent = "RECON EM SEGUNDO PLANO: 100%";
          setTimeout(function () { if (bgBar) bgBar.style.display = "none"; }, 1800);
          const pEl = document.getElementById("azSectorAnalysisPanel");
          if (pEl) { pEl.classList.add("is-open"); renderSectorAnalysisPanel(); }
          if (window.AzVoiceJarvis && state.criteria?.voz !== false) {
            window.AzVoiceJarvis.speak("Análise territorial concluída. Relatório pronto.", "recon_done");
          }
          showToast("Recon em segundo plano concluído — PDF e dados salvos.");
        } catch (_) {
          if (bgBar) bgBar.style.display = "none";
        }
        return;
      }

      const sectorWps = generateReconWaypoints(state.pattern);
      let transitCoords = [];
      let rthCoords = [];

      // Verifica deslocamento remoto (ex.: Prado -> Serra) e rota de carro OSRM se ligada
      const opOrigin = (tac.myPos && typeof tac.myPos.lat === "number" && typeof tac.myPos.lng === "number")
        ? { lng: tac.myPos.lng, lat: tac.myPos.lat }
        : null;
      const distFromOp = (opOrigin && sectorWps[0])
        ? calcDistAndBearing(opOrigin.lat, opOrigin.lng, sectorWps[0].lat, sectorWps[0].lng).dist
        : 0;

      if (opOrigin && distFromOp > 80 && sectorWps[0]) {
        if (reconCfg.carRoute) {
          setReconStatus("ROTA CARRO...", null);
          const car = await fetchCarItinerary(opOrigin, sectorWps[0], sig);
          if (car && car.coords.length >= 2) {
            state.analysis.itinerario = car.steps;
            state.analysis.carDistKm = car.distKm;
            state.analysis.carDurMin = car.durMin;
            transitCoords = car.coords.map(function (pt) { return { lng: pt[0], lat: pt[1], isTransit: true }; });
            rthCoords = car.coords.slice().reverse().map(function (pt) { return { lng: pt[0], lat: pt[1], isRth: true }; });
            ensureReconLayers(m);
            if (m.getSource("az-recon-transit-src")) {
              m.getSource("az-recon-transit-src").setData({
                type: "FeatureCollection",
                features: [{ type: "Feature", geometry: { type: "LineString", coordinates: car.coords }, properties: {} }]
              });
            }
          }
        }
        if (!transitCoords.length) {
          transitCoords = [{ lng: sectorWps[0].lng, lat: sectorWps[0].lat, isTransit: true }];
          rthCoords = [{ lng: opOrigin.lng, lat: opOrigin.lat, isRth: true }];
          ensureReconLayers(m);
          if (m.getSource("az-recon-transit-src")) {
            m.getSource("az-recon-transit-src").setData({
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry: { type: "LineString", coordinates: [[opOrigin.lng, opOrigin.lat], [sectorWps[0].lng, sectorWps[0].lat]] }, properties: {} }]
            });
          }
        }
      }

      // Modo Animações DESLIGADAS: consulta, salva PDF automaticamente e encerra busca
      if (!reconCfg.animMaster) {
        await fetchSectorOsmOrOffline(sig);
        if (sig.aborted) return;
        setReconStatus("CONCLUÍDO", "~00:00");
        playDroneTargetFoundBeep();
        saveReconReportForStage2();
        triggerReconPdfDownload();
        closeDroneMode(true);
        const pEl = document.getElementById("azSectorAnalysisPanel");
        if (pEl) { pEl.classList.add("is-open"); renderSectorAnalysisPanel(); }
        if (window.AzVoiceJarvis && state.criteria?.voz !== false) {
          window.AzVoiceJarvis.speak("Análise territorial concluída. Relatório pronto.", "recon_done");
        }
        showToast("Busca encerrada — PDF salvo automaticamente.");
        return;
      }

      // Modo Animações LIGADAS: decola imediatamente e consulta Overpass em paralelo (sem travar)
      fetchSectorOsmOrOffline(sig).catch(function () {});

      // Monta missão completa com animações ligadas
      state.waypoints = (reconCfg.animTransit && transitCoords.length)
        ? transitCoords.concat(sectorWps)
        : sectorWps.slice();
      state.rthWps = (reconCfg.animTransit && rthCoords.length) ? rthCoords : [];
      state.wpIdx = 0;
      state.paused = false;
      state.targetZoom = 16.95;
      state.targetPitch = 42;
      state.inspectUntil = 0;
      state.inspectSpin = false;
      state.rthAdded = false;

      applyReconTempLayer();
      setReconSectorActiveColor(true);

      const startPos = (reconCfg.animTransit && opOrigin && distFromOp > 80) ? opOrigin : (state.waypoints[0] || m.getCenter());
      const pauseBtn = document.getElementById("azReconPauseBtn");
      if (pauseBtn) pauseBtn.textContent = "PAUSAR";
      if (tac.reconRaf) { cancelAnimationFrame(tac.reconRaf); tac.reconRaf = 0; }

      if (typeof m.jumpTo === "function") {
        m.jumpTo({ center: [startPos.lng, startPos.lat], zoom: (state.waypoints[0] && state.waypoints[0].isTransit) ? 15.8 : 16.95, pitch: 42 });
      }
      if (typeof window.updateDroneCraftOnMap === "function") {
        window.updateDroneCraftOnMap(startPos.lng, startPos.lat, m.getBearing ? m.getBearing() : 0, true);
      }

      if (!state.mapDragHandler && typeof m.on === "function") {
        state.mapDragHandler = function () {
          if (tac.droneMode && tac.droneType === "recon" && !state.paused) {
            state.paused = true;
            const pb = document.getElementById("azReconPauseBtn");
            if (pb) pb.textContent = "RETOMAR";
            setReconStatus("PAUSADO", null);
          }
        };
        m.on("dragstart", state.mapDragHandler);
      }

      let lastTs = performance.now();
      let lastEtaTs = 0;
      function tickRecon(now) {
        if (!tac.droneMode || tac.droneType !== "recon") { tac.reconRaf = 0; return; }
        const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
        lastTs = now;
        if (!state.paused && state.waypoints.length > 0 && state.wpIdx < state.waypoints.length) {
          const c = m.getCenter();
          const wp = state.waypoints[state.wpIdx];
          const info = calcDistAndBearing(c.lat, c.lng, wp.lat, wp.lng);

          // Interpolação contínua suave de zoom e pitch (60fps)
          let curZ = typeof m.getZoom === "function" ? m.getZoom() : 16.95;
          let curP = typeof m.getPitch === "function" ? m.getPitch() : 42;
          let curB = typeof m.getBearing === "function" ? m.getBearing() : 0;

          if ((reconCfg.animInspect || state.depthLevel === "minuciosa" || state.depthLevel === "tatica") && state.inspectUntil && now < state.inspectUntil) {
            state.targetZoom = 17.75;
            state.targetPitch = 52;
            const nextZ = curZ + (state.targetZoom - curZ) * Math.min(1, dt * 3.5);
            const nextP = curP + (state.targetPitch - curP) * Math.min(1, dt * 3.5);
            const nextB = state.inspectSpin ? (curB + 65 * dt) % 360 : curB;
            let orbLng = c.lng, orbLat = c.lat;
            if (state.inspectCenter && state.inspectSpin) {
              state.inspectAngle = ((state.inspectAngle || 0) + 155 * dt) % 360;
              const radDegLat = 22 / 111320;
              const radDegLng = 22 / (111320 * Math.max(0.2, Math.cos((state.inspectCenter.lat * Math.PI) / 180)));
              const angRad = (state.inspectAngle * Math.PI) / 180;
              orbLng = state.inspectCenter.lng + Math.cos(angRad) * radDegLng;
              orbLat = state.inspectCenter.lat + Math.sin(angRad) * radDegLat;
            }
            const clampedHold = (!wp.isTransit && !wp.isRth) ? clampPointInsideSector(orbLng, orbLat) : { lng: orbLng, lat: orbLat };
            if (typeof m.jumpTo === "function") m.jumpTo({ center: [clampedHold.lng, clampedHold.lat], zoom: nextZ, pitch: nextP, bearing: nextB });
            if (typeof window.updateDroneCraftOnMap === "function") window.updateDroneCraftOnMap(clampedHold.lng, clampedHold.lat, nextB, true);
            tac.reconRaf = requestAnimationFrame(tickRecon);
            return;
          }
          state.inspectCenter = null;

          // Dispara breve órbita circular ao passar próximo de marcador ? pendente
          if (!wp.isTransit && !wp.isRth && Array.isArray(state.questionMarks) && state.questionMarks.length > 0 && state.depthLevel !== "superficial") {
            for (let qi = 0; qi < state.questionMarks.length; qi++) {
              const qm = state.questionMarks[qi];
              if (!qm.orbited && qm.status === "Pendente" && calcDistAndBearing(c.lat, c.lng, qm.lat, qm.lng).dist <= 135) {
                qm.orbited = true;
                state.inspectCenter = { lng: qm.lng, lat: qm.lat };
                state.inspectAngle = 0;
                state.inspectUntil = now + 2200;
                state.inspectSpin = true;
                setReconStatus("ÓRBITA ?", null);
                break;
              }
            }
          }

          const baseSpeed = (wp.isTransit || wp.isRth) ? Math.max(60, Math.min(300, info.dist * 0.25)) : 44;
          const stepM = baseSpeed * state.speedMult * dt;
          let nextLat = c.lat, nextLng = c.lng;
          if (info.dist <= Math.max(10, stepM)) {
            nextLat = wp.lat; nextLng = wp.lng;
            state.wpIdx++;
            if (wp.laneTurn && (reconCfg.animInspect || state.depthLevel === "minuciosa")) {
              state.inspectUntil = now + 900;
              state.inspectSpin = false;
            }
            if (state.wpIdx >= state.waypoints.length) {
              if (state.pattern === "perim" && !state.rthAdded) {
                state.wpIdx = 0;
              } else if (!state.rthAdded && state.rthWps && state.rthWps.length > 0) {
                state.rthAdded = true;
                setReconSectorActiveColor(false);
                window.restoreReconTempLayer();
                state.waypoints = state.waypoints.concat(state.rthWps);
                setReconStatus("RETORNO RTH", null);
              } else {
                state.paused = true;
                setReconSectorActiveColor(false);
                window.restoreReconTempLayer();
                setReconStatus("CONCLUÍDO", "~00:00");
                playDroneReturnBeep();
                saveReconReportForStage2();
                triggerReconPdfDownload();
                closeDroneMode(true);
                const pEl = document.getElementById("azSectorAnalysisPanel");
                if (pEl) { pEl.classList.add("is-open"); renderSectorAnalysisPanel(); }
                if (window.AzVoiceJarvis && state.criteria?.voz !== false) {
                  window.AzVoiceJarvis.speak("Análise territorial concluída. Relatório pronto.", "recon_done");
                }
                showToast("Busca encerrada — PDF salvo automaticamente.");
                return;
              }
            }
          } else {
            const ratio = stepM / info.dist;
            nextLat = c.lat + (wp.lat - c.lat) * ratio;
            nextLng = c.lng + (wp.lng - c.lng) * ratio;
          }

          // Contenção estrita: drone nunca sai de dentro da área fixada durante a varredura
          if (!wp.isTransit && !wp.isRth) {
            const clamped = clampPointInsideSector(nextLng, nextLat);
            nextLng = clamped.lng;
            nextLat = clamped.lat;
          }

          const bgBar = document.getElementById("azReconBgProgressBar");
          if (bgBar && bgBar.style.display !== "none" && state.waypoints.length > 0) {
            const pct = Math.min(99, Math.max(5, Math.round((state.wpIdx / state.waypoints.length) * 100)));
            const bgTxt = document.getElementById("azReconBgProgressText");
            const bgFill = document.getElementById("azReconBgFill");
            if (bgTxt) bgTxt.textContent = `RECON EM ANDAMENTO: ${pct}%`;
            if (bgFill) bgFill.style.width = pct + "%";
          }

          if (typeof window.updateDroneCraftOnMap === "function") {
            window.updateDroneCraftOnMap(nextLng, nextLat, info.bearing, true);
          }

          // Amostragem contínua em tempo real das ruas/becos/escadas na viewport durante o voo
          if (!wp.isTransit && !wp.isRth && now - lastEtaTs > 350 && typeof m.queryRenderedFeatures === "function") {
            try {
              const vFeats = m.queryRenderedFeatures();
              let vChanged = false;
              const a = state.analysis;
              const pushUniq = function (arr, name, coords, lat, lng, kind, vp) {
                if (arr.some(function (it) { return it.name === name; })) return false;
                const br = resolveBairroForPoint(lat, lng, vp);
                arr.push({ name: name, bairro: br, coords: coords, lat: lat, lng: lng, kind: kind });
                return true;
              };
              for (let vi = 0; vi < vFeats.length; vi++) {
                const vf = vFeats[vi];
                if (!vf || !vf.geometry) continue;
                const vp = vf.properties || {};
                const cls = String(vp.class || vp.subclass || vp.type || "");
                const nm = String(vp.name || vp["name:pt"] || "").trim();
                if (vf.geometry.type !== "LineString" && vf.geometry.type !== "MultiLineString") continue;
                const coords = vf.geometry.type === "LineString" ? vf.geometry.coordinates : (vf.geometry.coordinates[0] || []);
                if (coords.length < 2) continue;
                const mid = coords[Math.floor(coords.length / 2)];
                if (!isPointInsideSector(mid[0], mid[1])) continue;
                const isEsc = cls === "steps" || /escada|escadaria/i.test(nm);
                const isBeco = !isEsc && (cls === "alley" || /beco|viela|travessa/i.test(nm));
                if (isEsc && nm) {
                  if (pushUniq(a.escadarias, nm, coords, mid[1], mid[0], "escada", vp)) vChanged = true;
                } else if (isBeco && nm) {
                  if (pushUniq(a.becos, nm, coords, mid[1], mid[0], "beco", vp)) vChanged = true;
                } else if ((/^(motorway|trunk|primary|secondary)/.test(cls) || /^av\.?|^avenida/i.test(nm)) && nm) {
                  if (pushUniq(a.avenidas, nm, coords, mid[1], mid[0], "avenida", vp)) vChanged = true;
                } else if (nm && (cls || vf.layer && /road|street|highway|transport/i.test(vf.layer.id || ""))) {
                  if (pushUniq(a.ruas, nm, coords, mid[1], mid[0], "rua", vp)) vChanged = true;
                }
              }
              if (vChanged) {
                const pEl = document.getElementById("azSectorAnalysisPanel");
                if (pEl && pEl.classList.contains("is-open")) renderSectorAnalysisPanel();
              }
            } catch (_) {}
          }

          // Alvos nominais (ex.: "Arauto"): bipe + pausa breve ao sobrevoar
          if (!wp.isTransit && !wp.isRth && state.matchedTargets.length > 0) {
            state.matchedTargets.forEach(function (mt) {
              if (state.alertedTargetKeys.has(mt.name)) return;
              if (calcDistAndBearing(nextLat, nextLng, mt.lat, mt.lng).dist <= 160) {
                state.alertedTargetKeys.add(mt.name);
                playDroneTargetFoundBeep();
                if (reconCfg.animInspect) {
                  state.inspectUntil = now + 1600;
                  state.inspectSpin = true;
                }
                showToast(`Alvo localizado: ${mt.name}`);
              }
            });
          }

          // Revelação progressiva ao vivo + pausas de leitura de beco/escadaria
          if (!wp.isTransit && !wp.isRth && reconCfg.autoScan && reconCfg.drawMode === "live" && state.pendingFeatures.length > 0) {
            let newlyRevealed = 0;
            const remaining = [];
            state.pendingFeatures.forEach(function (pf) {
              const df = calcDistAndBearing(nextLat, nextLng, pf.mid.lat, pf.mid.lng).dist;
              if (df <= 145) {
                state.revealedFeatures.push(pf);
                newlyRevealed++;
              } else {
                remaining.push(pf);
              }
            });
            if (newlyRevealed > 0) {
              state.pendingFeatures = remaining;
              updateReconGeoJsonLayers();
              if (reconCfg.animInspect) {
                state.inspectUntil = now + 1100;
                state.inspectSpin = newlyRevealed >= 2;
              }
            }
          }

          // ETA e fase dentro da barra (sem sobrepor mapa)
          if (now - lastEtaTs > 350) {
            lastEtaTs = now;
            let remDist = info.dist;
            for (let k = state.wpIdx; k < state.waypoints.length - 1; k++) {
              remDist += calcDistAndBearing(state.waypoints[k].lat, state.waypoints[k].lng, state.waypoints[k + 1].lat, state.waypoints[k + 1].lng).dist;
            }
            const etaSec = remDist / Math.max(15, 44 * state.speedMult);
            const destTxt = state.destLabel ? (" → " + state.destLabel.toUpperCase()) : "";
            const tag = wp.isRth ? "RETORNO RTH" : (wp.isTransit ? ("TRÂNSITO" + destTxt) : "VARREDURA");
            setReconStatus(tag, formatEtaSec(etaSec));
          }

          // Auto-Altitude suave (60fps lerp)
          if (Date.now() > state.manualZoomUntil) {
            let nearbyAlleys = 0;
            state.revealedFeatures.concat(state.pendingFeatures).forEach(function (rf) {
              if (calcDistAndBearing(nextLat, nextLng, rf.mid.lat, rf.mid.lng).dist <= 95) nearbyAlleys++;
            });
            state.targetZoom = (wp.isTransit || wp.isRth) ? 15.8 : (nearbyAlleys >= 2 ? 17.55 : 16.75);
            state.targetPitch = (wp.isTransit || wp.isRth) ? 35 : (nearbyAlleys >= 2 ? 48 : 40);
            curZ = curZ + (state.targetZoom - curZ) * Math.min(1, dt * 1.8);
            curP = curP + (state.targetPitch - curP) * Math.min(1, dt * 1.8);
          }

          if (typeof m.jumpTo === "function") {
            m.jumpTo({ center: [nextLng, nextLat], zoom: curZ, pitch: curP });
          }
          if (typeof window.updateDroneAvataPitch === "function") {
            window.updateDroneAvataPitch(0.85 + state.speedMult * 0.14);
          }
        }
        tac.reconRaf = requestAnimationFrame(tickRecon);
      }
      tac.reconRaf = requestAnimationFrame(tickRecon);
    }

    window.stopReconFlight = function (clearPickHandler) {
      if (tac.reconRaf) { cancelAnimationFrame(tac.reconRaf); tac.reconRaf = 0; }
      if (state.abortCtrl) { try { state.abortCtrl.abort(); } catch (_) {} state.abortCtrl = null; }
      state.paused = true;
      setReconSectorActiveColor(false);
      const m = getActiveMap();
      if (clearPickHandler && m && typeof m.off === "function") {
        if (state.mapClickHandler) { m.off("click", state.mapClickHandler); state.mapClickHandler = null; }
        if (state.mapDragHandler) { m.off("dragstart", state.mapDragHandler); state.mapDragHandler = null; }
      }
    };

    function setHudCollapsedForPick(collapsed) {
      const hudBar = document.getElementById("azDroneHudBar");
      const confirmBar = document.getElementById("azReconConfirmAreaBar");
      if (hudBar) hudBar.classList.toggle("is-pick-hidden", Boolean(collapsed));
      if (confirmBar) confirmBar.style.display = collapsed ? "flex" : "none";
    }

    function armSectorPick(mode) {
      const m = getActiveMap();
      if (!m || typeof m.on !== "function") return;
      state.shapeMode = mode;
      state.customPolygon = null;
      state.pickStep = 0;
      if (state.mapClickHandler) { m.off("click", state.mapClickHandler); state.mapClickHandler = null; }
      const rWrap = document.getElementById("azReconRadiusWrap");
      if (rWrap) rWrap.style.display = mode === "circle" ? "inline-flex" : "none";
      const floatR = document.getElementById("azReconFloatRadius");
      if (floatR) floatR.style.display = mode === "circle" ? "inline-block" : "none";
      const infoEl = document.getElementById("azReconConfirmInfo");
      if (infoEl) infoEl.textContent = mode === "circle" ? "Toque no mapa para cravar o centro" : "Toque 2 cantos opostos";
      setHudCollapsedForPick(true);
      showToast(mode === "circle" ? "Toque no mapa para definir o centro do círculo." : "Toque 2 cantos opostos no mapa (até 50 km²).");
      state.mapClickHandler = function (ev) {
        if (!tac.droneMode || tac.droneType !== "recon") return;
        const pt = { lng: ev.lngLat.lng, lat: ev.lngLat.lat };
        if (mode === "circle") {
          state.center = pt;
          m.off("click", state.mapClickHandler); state.mapClickHandler = null;
          drawReconSectorBoundary();
          if (infoEl) infoEl.textContent = `Área: ${getSectorAreaKm2().toFixed(1)} km²`;
        } else {
          if (state.pickStep === 0) {
            state.rectCornerA = pt;
            state.pickStep = 1;
            if (infoEl) infoEl.textContent = "Toque no canto oposto";
            showToast("Toque no canto oposto do quadrante.");
          } else {
            state.rectCornerB = pt;
            const areaKm2 = getSectorAreaKm2();
            if (areaKm2 > 50) {
              const scale = Math.sqrt(50 / areaKm2);
              state.rectCornerB = {
                lng: state.rectCornerA.lng + (pt.lng - state.rectCornerA.lng) * scale,
                lat: state.rectCornerA.lat + (pt.lat - state.rectCornerA.lat) * scale
              };
              showToast("Área ajustada para o limite máximo de 50 km².");
            }
            m.off("click", state.mapClickHandler); state.mapClickHandler = null;
            drawReconSectorBoundary();
            if (infoEl) infoEl.textContent = `Área: ${getSectorAreaKm2().toFixed(1)} km²`;
          }
        }
      };
      m.on("click", state.mapClickHandler);
    }

    onClick("azReconConfirmOkBtn", function () {
      setHudCollapsedForPick(false);
      applySmartDepthRecommendation();
      if (!state.abortCtrl) state.abortCtrl = new AbortController();
      fetchSectorOsmOrOffline(state.abortCtrl.signal).catch(function () {});
      showToast("Área fixada. Escolha o nível e inicie o reconhecimento.");
    });

    function adjustConfirmSectorScale(deltaMeters, scaleFactor) {
      if (state.shapeMode === "circle" && state.center) {
        state.radiusM = Math.max(100, Math.min(3990, state.radiusM + deltaMeters));
        const mainRad = document.getElementById("azReconRadiusSlider");
        if (mainRad) mainRad.value = String(state.radiusM);
        const fRad = document.getElementById("azReconFloatRadius");
        if (fRad) fRad.value = String(state.radiusM);
        const valEl = document.getElementById("azReconRadiusVal");
        const areaStr = getSectorAreaKm2().toFixed(1) + "km²";
        const rStr = state.radiusM >= 1000 ? (state.radiusM / 1000).toFixed(1) + "km" : state.radiusM + "m";
        if (valEl) valEl.textContent = `${rStr} (${areaStr})`;
        const infoEl = document.getElementById("azReconConfirmInfo");
        if (infoEl) infoEl.textContent = `Raio: ${rStr} (${areaStr})`;
        drawReconSectorBoundary();
      } else if (state.shapeMode === "rect" && state.rectCornerA && state.rectCornerB) {
        const cLng = (state.rectCornerA.lng + state.rectCornerB.lng) / 2;
        const cLat = (state.rectCornerA.lat + state.rectCornerB.lat) / 2;
        const nextA = { lng: cLng + (state.rectCornerA.lng - cLng) * scaleFactor, lat: cLat + (state.rectCornerA.lat - cLat) * scaleFactor };
        const nextB = { lng: cLng + (state.rectCornerB.lng - cLng) * scaleFactor, lat: cLat + (state.rectCornerB.lat - cLat) * scaleFactor };
        state.rectCornerA = nextA;
        state.rectCornerB = nextB;
        if (getSectorAreaKm2() > 50) {
          const s = Math.sqrt(50 / getSectorAreaKm2());
          state.rectCornerA = { lng: cLng + (nextA.lng - cLng) * s, lat: cLat + (nextA.lat - cLat) * s };
          state.rectCornerB = { lng: cLng + (nextB.lng - cLng) * s, lat: cLat + (nextB.lat - cLat) * s };
        }
        drawReconSectorBoundary();
        const infoEl = document.getElementById("azReconConfirmInfo");
        if (infoEl) infoEl.textContent = `Área: ${getSectorAreaKm2().toFixed(1)} km²`;
      }
    }
    onClick("azReconFloatMinusBtn", function () { adjustConfirmSectorScale(-100, 0.85); });
    onClick("azReconFloatPlusBtn", function () { adjustConfirmSectorScale(100, 1.15); });

    // Arraste interativo das alças (bolinhas) da geometria no mapa
    (function bindReconHandleDrag() {
      const m = getActiveMap();
      if (!m || typeof m.on !== "function" || m._azReconHandleBound) return;
      m._azReconHandleBound = true;
      let dragKind = null;
      const startDrag = function (ev) {
        if (!tac.droneMode || tac.droneType !== "recon" || !m.getLayer("az-recon-handles-layer")) return;
        const feats = m.queryRenderedFeatures(ev.point, { layers: ["az-recon-handles-layer"] });
        if (!feats || !feats.length) return;
        dragKind = feats[0].properties && feats[0].properties.handleKind;
        if (!dragKind) return;
        if (ev.preventDefault) ev.preventDefault();
        if (m.dragPan && m.dragPan.disable) m.dragPan.disable();
      };
      const moveDrag = function (ev) {
        if (!dragKind || !ev.lngLat) return;
        const pt = { lng: ev.lngLat.lng, lat: ev.lngLat.lat };
        if (dragKind === "center" && state.shapeMode === "circle") {
          state.center = pt;
          drawReconSectorBoundary();
        } else if (dragKind === "radius" && state.shapeMode === "circle" && state.center) {
          const d = calcDistAndBearing(state.center.lat, state.center.lng, pt.lat, pt.lng).dist;
          state.radiusM = Math.max(100, Math.min(3990, Math.round(d / 10) * 10));
          drawReconSectorBoundary();
          const infoEl = document.getElementById("azReconConfirmInfo");
          if (infoEl) infoEl.textContent = `Raio: ${state.radiusM}m (${getSectorAreaKm2().toFixed(1)} km²)`;
        } else if (dragKind === "cornerA" && state.shapeMode === "rect") {
          state.rectCornerA = pt;
          drawReconSectorBoundary();
        } else if (dragKind === "cornerB" && state.shapeMode === "rect") {
          state.rectCornerB = pt;
          drawReconSectorBoundary();
        }
      };
      const endDrag = function () {
        if (!dragKind) return;
        dragKind = null;
        if (m.dragPan && m.dragPan.enable && !tac.mapLocked) m.dragPan.enable();
      };
      m.on("mousedown", startDrag);
      m.on("touchstart", startDrag);
      m.on("mousemove", moveDrag);
      m.on("touchmove", moveDrag);
      m.on("mouseup", endDrag);
      m.on("touchend", endDrag);
    })();

    const floatRad = document.getElementById("azReconFloatRadius");
    if (floatRad) {
      floatRad.addEventListener("input", function () {
        state.radiusM = Math.max(100, Math.min(3990, Number(this.value) || 500));
        const mainRad = document.getElementById("azReconRadiusSlider");
        if (mainRad) mainRad.value = String(state.radiusM);
        const valEl = document.getElementById("azReconRadiusVal");
        const areaStr = getSectorAreaKm2().toFixed(1) + "km²";
        const rStr = state.radiusM >= 1000 ? (state.radiusM / 1000).toFixed(1) + "km" : state.radiusM + "m";
        if (valEl) valEl.textContent = `${rStr} (${areaStr})`;
        const infoEl = document.getElementById("azReconConfirmInfo");
        if (infoEl) infoEl.textContent = `Raio: ${rStr} (${areaStr})`;
        if (state.shapeMode === "circle" && state.center) drawReconSectorBoundary();
      });
    }

    function saveQMarksToStorage() {
      try {
        localStorage.setItem("az_recon_qmarks_v1", JSON.stringify(Array.isArray(state.questionMarks) ? state.questionMarks : []));
      } catch (_) {}
    }

    function updateReconQuestionMarksLayer() {
      const m = getActiveMap();
      if (!m) return;
      ensureReconLayers(m);
      const qSrc = m.getSource("az-recon-qmarks-src");
      if (!qSrc) return;
      const list = Array.isArray(state.questionMarks) ? state.questionMarks : [];
      qSrc.setData({
        type: "FeatureCollection",
        features: list.map(function (q) {
          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [q.lng, q.lat] },
            properties: { id: q.id, symbol: q.status === "Pendente" ? "?" : "OK" }
          };
        })
      });
      saveQMarksToStorage();
    }

    // Restaura marcadores ? permanentes ao carregar o mapa (mesmo fora do Modo Drone)
    try {
      const savedQ = JSON.parse(localStorage.getItem("az_recon_qmarks_v1") || "[]");
      if (Array.isArray(savedQ) && savedQ.length > 0) {
        state.questionMarks = savedQ;
        setTimeout(updateReconQuestionMarksLayer, 1200);
      }
    } catch (_) {}

    (function bindReconQMarkInteractions() {
      const m = getActiveMap();
      let activeQmId = null;
      const card = document.getElementById("azReconQMarkCard");
      const meta = document.getElementById("azReconQMarkMeta");
      const editInp = document.getElementById("azReconQMarkEditInput");
      const openQMarkCard = function (qmId) {
        const qm = (state.questionMarks || []).find(function (q) { return q.id === qmId; });
        if (!qm || !card || !meta) return;
        activeQmId = qm.id;
        const opRef = (tac.myPos && typeof tac.myPos.lat === "number") ? tac.myPos : (state.center || { lat: qm.lat, lng: qm.lng });
        const db = calcDistAndBearing(opRef.lat, opRef.lng, qm.lat, qm.lng);
        const criterioTxt = qm.criterio || qm.motivo || "Ponto sem classificação";
        meta.innerHTML =
          `<div><b>Critério da marcação:</b> ${criterioTxt}</div>` +
          `<div><b>Coord:</b> ${qm.lat.toFixed(5)}, ${qm.lng.toFixed(5)}</div>` +
          `<div><b>Distância:</b> ${Math.round(db.dist)}m • Azimute ${Math.round((db.bearing + 360) % 360)}° • <b>Status:</b> ${qm.status}</div>`;
        if (editInp) editInp.value = criterioTxt;
        card.style.display = "flex";
      };
      if (m && typeof m.on === "function" && !m._azQMarkClickBound) {
        m._azQMarkClickBound = true;
        m.on("click", "az-recon-qmarks-bg", function (ev) {
          const f = ev && ev.features && ev.features[0];
          if (f && f.properties && f.properties.id) openQMarkCard(f.properties.id);
        });
      }
      onClick("azReconQMarkCloseBtn", function () { if (card) card.style.display = "none"; });
      onClick("azReconQMarkSaveBtn", function () {
        const qm = (state.questionMarks || []).find(function (q) { return q.id === activeQmId; });
        if (!qm || !editInp) return;
        const nextTxt = editInp.value.trim();
        if (nextTxt) {
          qm.criterio = nextTxt;
          qm.motivo = nextTxt;
        }
        updateReconQuestionMarksLayer();
        renderSectorAnalysisPanel();
        openQMarkCard(qm.id);
        showToast("Critério da marcação atualizado.");
      });
      document.querySelectorAll("[data-qm-class]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const qm = (state.questionMarks || []).find(function (q) { return q.id === activeQmId; });
          if (!qm) return;
          qm.status = btn.getAttribute("data-qm-class") || "Confirmado";
          if (editInp && editInp.value.trim()) {
            qm.criterio = editInp.value.trim();
            qm.motivo = qm.criterio;
          }
          updateReconQuestionMarksLayer();
          renderSectorAnalysisPanel();
          if (card) card.style.display = "none";
          showToast(`Ponto classificado como: ${qm.status}`);
        });
      });
      onClick("azReconQMarkRemoveBtn", function () {
        state.questionMarks = (state.questionMarks || []).filter(function (q) { return q.id !== activeQmId; });
        updateReconQuestionMarksLayer();
        renderSectorAnalysisPanel();
        if (card) card.style.display = "none";
        showToast("Marcador ? removido.");
      });
    })();

    const execModeSelEl = document.getElementById("azReconExecModeSelect");
    if (execModeSelEl) {
      execModeSelEl.addEventListener("change", function () {
        const nextMode = this.value || "live";
        state.execMode = nextMode;
        const bgBar = document.getElementById("azReconBgProgressBar");
        if (tac.reconRaf && nextMode === "bg") {
          setHudCollapsedForPick(true);
          const confirmBar = document.getElementById("azReconConfirmAreaBar");
          if (confirmBar) confirmBar.style.display = "none";
          if (bgBar) bgBar.style.display = "flex";
        } else if (nextMode === "live" && tac.reconRaf) {
          setHudCollapsedForPick(false);
          if (bgBar) bgBar.style.display = "none";
        }
      });
    }

    const DEPTH_DESCRIPTIONS = {
      superficial: "Superficial: visão geral rápida de vias principais, clima e área.",
      tatica: "Detalhada: análise intermediária de vias, becos, sem saída e cerco.",
      minuciosa: "Minuciosa: leitura aprofundada com paradas de inspeção e raio-X."
    };
    document.querySelectorAll("[data-recon-depth]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const lvl = btn.getAttribute("data-recon-depth") || "tatica";
        state.depthManualOverride = true;
        state.depthLevel = lvl;
        applyDepthPresetToCriteria(lvl);
        const descEl = document.getElementById("azReconDepthDesc");
        if (descEl) descEl.textContent = DEPTH_DESCRIPTIONS[lvl] || DEPTH_DESCRIPTIONS.tatica;
        if (lvl === "minuciosa" && getSectorAreaKm2() > 5.0) {
          showToast("Atenção: área > 5 km² no modo Minucioso pode levar mais tempo.");
        }
      });
    });

    document.querySelectorAll("[data-recon-speed]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const sp = Number(btn.getAttribute("data-recon-speed")) || 1;
        state.speedMult = sp;
        const lbl = document.getElementById("azReconSpeedLabel");
        if (lbl) lbl.textContent = sp + "x";
        document.querySelectorAll("[data-recon-speed]").forEach(function (b) {
          b.classList.toggle("is-active", Number(b.getAttribute("data-recon-speed")) === sp);
        });
        updateReconEtaEstimate();
      });
    });

    [["azReconCritMalha", "malha"], ["azReconCritBecos", "becos"], ["azReconCritSemSaida", "semSaida"], ["azReconCritCerco", "cerco"], ["azReconCritRaioX", "raioX"], ["azReconCritVoz", "voz"]].forEach(function (pair) {
      const el = document.getElementById(pair[0]);
      if (el) {
        el.addEventListener("change", function () {
          state.criteria[pair[1]] = Boolean(el.checked);
        });
      }
    });

    onClick("azGeoSearchReconBtn", function () {
      const poly = window._azLastGeoSearchPolygon;
      if (!poly || !poly.length) { showToast("Nenhum polígono de bairro selecionado na busca."); return; }
      const btn = document.getElementById("azGeoSearchReconBtn");
      if (btn) btn.style.display = "none";
      if (!tac.droneMode && typeof window.openDroneMode === "function") window.openDroneMode();
      const typeSelEl = document.getElementById("azDroneTypeSelect");
      if (typeSelEl && typeSelEl.value !== "recon") {
        typeSelEl.value = "recon";
        typeSelEl.dispatchEvent(new Event("change"));
      }
      state.shapeMode = "polygon";
      state.customPolygon = poly;
      state.destLabel = window._azLastGeoSearchName || state.destLabel;
      const dInp = document.getElementById("azReconDestInput");
      if (dInp && state.destLabel) dInp.value = state.destLabel;
      drawReconSectorBoundary();
      showToast(`Polígono de "${state.destLabel || "setor"}" carregado no Drone Recon.`);
    });

    const typeSel = document.getElementById("azDroneTypeSelect");
    if (typeSel) {
      typeSel.addEventListener("change", function () {
        const nextType = this.value || "tatico";
        tac.droneType = nextType;
        if (nextType === "tatico") {
          window.stopReconFlight(true);
          tac.droneFreeFlight = (tac.droneFollowUid === "__FREE__");
          if (tac.droneFreeFlight) stepDroneFlightLoop();
        } else if (nextType === "escolta") {
          window.stopReconFlight(true);
          if (!tac.droneFollowUid || tac.droneFollowUid === "__FREE__") tac.droneFollowUid = "__TEAM_CENTER__";
          tac.droneFreeFlight = false;
          refreshDroneTargetsSelect();
          followDroneTargetNow(true);
        } else if (nextType === "recon") {
          tac.droneFreeFlight = false;
          if (tac.droneRaf) { cancelAnimationFrame(tac.droneRaf); tac.droneRaf = 0; }
          window.initReconSectorAtOrigin();
          const m = getActiveMap();
          if (m && typeof m.easeTo === "function") m.easeTo({ zoom: 15.8, pitch: 35, duration: 420 });
        }
        syncDroneUi();
      });
    }

    // Escolta controls
    onClick("azEscoltaAltUpBtn", function () {
      const m = getActiveMap();
      if (m && typeof m.easeTo === "function") m.easeTo({ zoom: Math.max(14.5, m.getZoom() - 0.6), duration: 240 });
    });
    onClick("azEscoltaAltDownBtn", function () {
      const m = getActiveMap();
      if (m && typeof m.easeTo === "function") m.easeTo({ zoom: Math.min(18.8, m.getZoom() + 0.6), duration: 240 });
    });
    onClick("azEscoltaOrbitTeamBtn", function () {
      const tgt = getDroneFollowTargetObj();
      const m = getActiveMap();
      const pt = tgt || (m && m.getCenter());
      if (pt) startMapOrbitAround(pt.lng, pt.lat);
    });

    // Recon controls
    onClick("azReconDestSearchBtn", searchReconDestination);
    const destInp = document.getElementById("azReconDestInput");
    if (destInp) destInp.addEventListener("keydown", function (ev) { if (ev.key === "Enter") searchReconDestination(); });
    onClick("azReconCircleBtn", function () { armSectorPick("circle"); });
    onClick("azReconRectBtn", function () { armSectorPick("rect"); });
    const radSlider = document.getElementById("azReconRadiusSlider");
    if (radSlider) {
      radSlider.addEventListener("input", function () {
        state.radiusM = Math.max(100, Math.min(3990, Number(this.value) || 500));
        const valEl = document.getElementById("azReconRadiusVal");
        const areaStr = getSectorAreaKm2().toFixed(1) + "km²";
        const rStr = state.radiusM >= 1000 ? (state.radiusM / 1000).toFixed(1) + "km" : state.radiusM + "m";
        if (valEl) valEl.textContent = `${rStr} (${areaStr})`;
        if (state.shapeMode === "circle" && state.center) drawReconSectorBoundary();
      });
    }
    onClick("azReconSweepBtn", function () { startReconFlight("sweep"); });
    onClick("azReconOrbitPerimBtn", function () { startReconFlight("perim"); });
    onClick("azReconOrbitPtBtn", function () {
      state.paused = true;
      const pb = document.getElementById("azReconPauseBtn");
      if (pb) pb.textContent = "RETOMAR";
      const m = getActiveMap();
      if (m && typeof m.getCenter === "function") {
        const c = m.getCenter();
        startMapOrbitAround(c.lng, c.lat);
      }
    });
    onClick("azReconPauseBtn", function () {
      state.paused = !state.paused;
      const pb = document.getElementById("azReconPauseBtn");
      if (pb) pb.textContent = state.paused ? "RETOMAR" : "PAUSAR";
      setReconStatus(state.paused ? "PAUSADO" : "VARREDURA", null);
    });
    onClick("azReconSpeedDownBtn", function () {
      const idx = SPEEDS.indexOf(state.speedMult);
      state.speedMult = SPEEDS[Math.max(0, (idx < 0 ? 2 : idx) - 1)];
      const lbl = document.getElementById("azReconSpeedLabel");
      if (lbl) lbl.textContent = state.speedMult + "x";
      updateReconEtaEstimate();
    });
    onClick("azReconSpeedUpBtn", function () {
      const idx = SPEEDS.indexOf(state.speedMult);
      state.speedMult = SPEEDS[Math.min(SPEEDS.length - 1, (idx < 0 ? 2 : idx) + 1)];
      const lbl = document.getElementById("azReconSpeedLabel");
      if (lbl) lbl.textContent = state.speedMult + "x";
      updateReconEtaEstimate();
    });
    onClick("azReconRthBtn", function () {
      if (!tac.myPos || typeof tac.myPos.lat !== "number") { showToast("GPS indisponível para retorno."); return; }
      state.rthAdded = true;
      state.paused = false;
      setReconSectorActiveColor(false);
      window.restoreReconTempLayer();
      const pb = document.getElementById("azReconPauseBtn");
      if (pb) pb.textContent = "PAUSAR";
      const rthList = (state.rthWps && state.rthWps.length) ? state.rthWps : [{ lng: tac.myPos.lng, lat: tac.myPos.lat, isRth: true }];
      state.waypoints = rthList;
      state.wpIdx = 0;
      setReconStatus("RETORNO RTH", null);
    });
    onClick("azReconAltUpBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      state.manualZoomUntil = Date.now() + 8000;
      m.jumpTo({ zoom: Math.max(15.0, m.getZoom() - 0.35) });
    });
    onClick("azReconAltDownBtn", function () {
      const m = getActiveMap();
      if (!m || typeof m.jumpTo !== "function") return;
      state.manualZoomUntil = Date.now() + 8000;
      m.jumpTo({ zoom: Math.min(18.5, m.getZoom() + 0.35) });
    });

    // Settings checkboxes
    function wireReconChk(id, key, onChange) {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = Boolean(reconCfg[key]);
      el.addEventListener("change", function () {
        reconCfg[key] = Boolean(this.checked);
        saveReconCfg();
        if (onChange) onChange();
        updateReconEtaEstimate();
      });
    }
    wireReconChk("azReconAnimMasterChk", "animMaster");
    wireReconChk("azReconCarRouteChk", "carRoute");
    wireReconChk("azReconAnimTransitChk", "animTransit");
    wireReconChk("azReconAnimInspectChk", "animInspect");
    wireReconChk("azReconAutoScanChk", "autoScan");

    const drawModeSel = document.getElementById("azReconDrawModeSelect");
    if (drawModeSel) {
      drawModeSel.value = reconCfg.drawMode || "live";
      drawModeSel.addEventListener("change", function () {
        reconCfg.drawMode = this.value === "background" ? "background" : "live";
        saveReconCfg();
      });
    }
    onClick("azReconToggleVisBtn", function () {
      state.featuresVisible = !state.featuresVisible;
      this.textContent = state.featuresVisible ? "Ocultar Marcações" : "Mostrar Marcações";
      updateReconGeoJsonLayers();
    });
    onClick("azReconClearBtn", function () {
      state.pendingFeatures = [];
      state.revealedFeatures = [];
      state.matchedTargets = [];
      updateReconGeoJsonLayers();
      showToast("Marcações da varredura limpas.");
    });
    onClick("azReconPinSaveBtn", function () {
      const all = state.revealedFeatures.concat(state.pendingFeatures);
      if (!all.length) { showToast("Nenhum beco/escadaria detectado para fixar."); return; }
      if (!Array.isArray(tac.terrainTraces)) tac.terrainTraces = [];
      all.forEach(function (f) {
        if (tac.terrainTraces.some(function (t) { return t.id === "pin_" + f.id; })) return;
        tac.terrainTraces.push({
          id: "pin_" + f.id,
          kind: f.kind,
          label: f.name,
          coords: f.coords,
          color: f.kind === "escada" ? "#F59E0B" : "#38BDF8",
          tags: ["RECON"],
          notes: "Detectado pelo Drone de Reconhecimento"
        });
      });
      if (typeof saveTerrainTracesToStorage === "function") saveTerrainTracesToStorage();
      if (typeof renderTerrainTracesOnMaps === "function") renderTerrainTracesOnMaps(true);
      showToast(`${all.length} acesso(s) fixado(s) no mapa permanente.`);
    });

    // Painel Análise do Setor + Exportação PDF Offline
    function buildSimplePdfBlob(lines) {
      const cleanAscii = function (str) {
        return String(str || "")
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\x20-\x7E]/g, " ")
          .replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
      };
      const pages = [];
      const perPage = 44;
      for (let i = 0; i < lines.length; i += perPage) {
        pages.push(lines.slice(i, i + perPage));
      }
      if (!pages.length) pages.push(["ANALISE TERRITORIAL - AZIMUTE"]);

      const objs = [];
      objs.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
      const pageKids = pages.map(function (_, idx) { return (4 + idx * 2) + " 0 R"; }).join(" ");
      objs.push(`2 0 obj << /Type /Pages /Kids [ ${pageKids} ] /Count ${pages.length} >> endobj`);
      objs.push("3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");

      pages.forEach(function (pgLines, idx) {
        const pageObjNum = 4 + idx * 2;
        const contObjNum = 5 + idx * 2;
        let stream = "BT\n/F1 10 Tf\n44 770 Td\n15 TL\n";
        pgLines.forEach(function (ln, li) {
          stream += (li === 0 ? "" : "T* ") + `(${cleanAscii(ln)}) Tj\n`;
        });
        stream += "ET";
        objs.push(`${pageObjNum} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contObjNum} 0 R >> endobj`);
        objs.push(`${contObjNum} 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream\nendobj`);
      });

      let pdf = "%PDF-1.4\n";
      const offsets = [0];
      objs.forEach(function (o) {
        offsets.push(pdf.length);
        pdf += o + "\n";
      });
      const xrefPos = pdf.length;
      pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
      for (let i = 1; i < offsets.length; i++) {
        pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
      }
      pdf += `trailer << /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
      return new Blob([pdf], { type: "application/pdf" });
    }

    function triggerReconPdfDownload() {
      const a = state.analysis || {};
      const bairro = (a.neighborhoods && a.neighborhoods.length) ? a.neighborhoods.join(", ") : "Setor Mapeado";
      const lines = [
        "AZIMUTE PMMG - ANALISE TERRITORIAL",
        "BAIRRO / SETOR: " + bairro,
        "PERFIL: " + (a.profile || "BAIRRO RESIDENCIAL"),
        "COMPLEXIDADE VIARIA: " + (a.complexity || "Media"),
        "DATA/HORA: " + new Date().toLocaleString("pt-BR"),
        "------------------------------------------------------------",
        `Avenidas: ${(a.avenidas || []).length} | Ruas: ${(a.ruas || []).length} | Becos: ${(a.becos || []).length} | Escadarias: ${(a.escadarias || []).length} | Comercios: ${a.shopsCount || 0}`,
        "------------------------------------------------------------"
      ];
      if (state.matchedTargets.length) {
        lines.push("ALVOS LOCALIZADOS:");
        state.matchedTargets.forEach(function (mt) { lines.push(" * " + mt.name); });
      }
      if ((a.itinerario || []).length) {
        lines.push(`ITINERARIO DE ACESSO (VIATURA: ${a.carDistKm} km / ${a.carDurMin} min):`);
        a.itinerario.forEach(function (it) { lines.push(" -> " + it.label); });
      }
      lines.push("AVENIDAS:");
      (a.avenidas || []).forEach(function (it) { lines.push(" - " + it.name + (it.bairro ? " • " + it.bairro : "")); });
      lines.push("RUAS:");
      (a.ruas || []).forEach(function (it) { lines.push(" - " + it.name + (it.bairro ? " • " + it.bairro : "")); });
      lines.push("BECOS / VIELAS:");
      (a.becos || []).forEach(function (it) { lines.push(" - " + it.name + (it.bairro ? " • " + it.bairro : "")); });
      lines.push("ESCADARIAS:");
      (a.escadarias || []).forEach(function (it) { lines.push(" - " + it.name + (it.bairro ? " • " + it.bairro : "")); });

      const blob = buildSimplePdfBlob(lines);
      const url = URL.createObjectURL(blob);
      const aEl = document.createElement("a");
      aEl.href = url;
      const safeName = bairro.replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 32) || "Setor";
      aEl.download = "Analise_Territorial_" + safeName + ".pdf";
      document.body.appendChild(aEl);
      aEl.click();
      setTimeout(function () {
        try { document.body.removeChild(aEl); URL.revokeObjectURL(url); } catch (_) {}
      }, 600);
      showToast("PDF da Análise Territorial salvo!");
    }

    onClick("azSectorPdfBtn", triggerReconPdfDownload);

    window.clearReconMapDrawings = function () {
      state.pendingFeatures = [];
      state.revealedFeatures = [];
      state.matchedTargets = [];
      state.center = null;
      state.rectCornerA = null;
      state.rectCornerB = null;
      const emptyGeo = { type: "FeatureCollection", features: [] };
      const m = getActiveMap();
      if (m && typeof m.getSource === "function") {
        ["az-recon-sector-src", "az-recon-transit-src", "az-recon-features-src", "az-recon-pins-src", "az-recon-target-src", "az-recon-highlight-src", "az-drone-craft-src"].forEach(function (sid) {
          const s = m.getSource(sid);
          if (s && typeof s.setData === "function") s.setData(emptyGeo);
        });
      }
      setReconStatus("PRONTO", "~00:00");
    };

    onClick("azSectorClearMapBtn", function () {
      window.clearReconMapDrawings();
      if (typeof setBloodhoundTarget === "function") setBloodhoundTarget(null);
      if (typeof clearBloodhoundMarker === "function") clearBloodhoundMarker();
      showToast("Desenhos do Drone e Cão apagados da tela.");
    });

    const secPanelEl = document.getElementById("azSectorAnalysisPanel");
    if (secPanelEl) {
      secPanelEl.addEventListener("pointerdown", function (ev) { ev.stopPropagation(); });
      secPanelEl.addEventListener("touchstart", function (ev) { ev.stopPropagation(); }, { passive: true });
    }

    onClick("azReconAnalysisBtn", function () {
      const p = document.getElementById("azSectorAnalysisPanel");
      if (p) {
        const willOpen = !p.classList.contains("is-open");
        p.classList.toggle("is-open", willOpen);
        if (willOpen) {
          const a = state.analysis;
          if (a.avenidas.length + a.ruas.length + a.becos.length === 0 && (state.center || state.rectCornerB)) {
            fetchSectorOsmOrOffline(state.abortCtrl ? state.abortCtrl.signal : null).catch(function () {});
          }
          renderSectorAnalysisPanel();
        }
      }
    });
    onClick("azSectorMinBtn", function () {
      const p = document.getElementById("azSectorAnalysisPanel");
      if (p) p.classList.toggle("is-minimized");
    });
    onClick("azSectorCloseBtn", function () {
      const p = document.getElementById("azSectorAnalysisPanel");
      if (p) p.classList.remove("is-open");
    });
    document.querySelectorAll("#azSectorAnalysisPanel [data-sector-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        state.activeTab = this.getAttribute("data-sector-tab") || "avenidas";
        document.querySelectorAll("#azSectorAnalysisPanel [data-sector-tab]").forEach(function (b) {
          b.classList.toggle("is-active", b === tab);
        });
        renderSectorAnalysisPanel();
      });
    });
  })();


  window._azStartMapOrbitAround = startMapOrbitAround;
  window._azOpenDroneMode = openDroneMode;
  window._azSyncStealthUi = syncStealthUi;
})();