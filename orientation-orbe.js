/* AZIMUTE — js/modules/orientation-orbe.js (Modulo isolado de orientacao, bussola, direcao do mapa e ORBE) */

window.AzOrbeConfig = { minTickMs: 65, rawDeadzoneDeg: 3, visualDeadzoneDeg: 0.8 };

        // ================= BÚSSOLA DIGITAL REAL (DeviceOrientationEvent) =================
        let azimuteCompassActive = false;
        let azimuteCompassLastValidTime = 0;
        let azimuteCompassListenersAttached = false;

        const AZIMUTE_CARDINAIS_PT = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
        const AZIMUTE_CARDINAIS_NOMES_PT = {
            'N': 'Norte (0°)',
            'NE': 'Nordeste (45°)',
            'L': 'Leste (90°)',
            'SE': 'Sudeste (135°)',
            'S': 'Sul (180°)',
            'SO': 'Sudoeste (225°)',
            'O': 'Oeste (270°)',
            'NO': 'Noroeste (315°)'
        };

        // Obtém o ângulo de compensação da tela quando na horizontal / Modo GRID
        function getAzimuteScreenOrientationOffset() {
            let angle = 0;
            if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
                angle = window.screen.orientation.angle;
            } else if (typeof window.orientation === 'number') {
                angle = window.orientation;
            } else if (document.body.classList.contains('mode-grid') || window.innerWidth >window.innerHeight) {
                angle = 90;
            }
            // Se o modo GRID estiver ativo manualmente em tela horizontal e o ângulo reportado for 0, aplica +90°
            if (angle === 0 && (document.body.classList.contains('mode-grid') && window.innerWidth >window.innerHeight)) {
                angle = 90;
            }
            const badge = document.getElementById('compassAxisCompBadge');
            if (badge) {
                if (angle !== 0 || document.body.classList.contains('mode-grid')) {
                    badge.textContent = 'Eixo: Horizontal Compensado (' + (angle >= 0 ? '+' + angle : angle) + '°)';
                    badge.className = 'text-[10px] font-mono bg-pmmg-khakiBadge text-pmmg-gold px-2.5 py-1 rounded-lg border border-pmmg-gold/40';
                } else {
                    badge.textContent = 'Eixo: Vertical Padrão (0°)';
                    badge.className = 'text-[10px] font-mono bg-pmmg-dark text-gray-300 px-2.5 py-1 rounded-lg border border-pmmg-border';
                }
            }
            return angle;
        }

        function setCompassSensorUnavailable(reasonText) {
            azimuteCompassActive = false;
            const stateBadge = document.getElementById('compassSensorStateBadge');
            const unavailBox = document.getElementById('compassUnavailableAlert');
            const unavailSub = document.getElementById('compassUnavailableSubtext');
            const activeBox = document.getElementById('compassActiveReadout');
            const dialSvg = document.getElementById('compassDialSvg');

            if (stateBadge) {
                stateBadge.textContent = 'SENSOR INDISPONÍVEL';
                stateBadge.className = 'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-950 text-red-400 border border-red-500/50';
            }
            if (unavailBox) unavailBox.classList.remove('hidden');
            if (activeBox) activeBox.classList.add('hidden');
            if (unavailSub && reasonText) unavailSub.textContent = reasonText;
            if (dialSvg) dialSvg.style.transform = 'rotate(0deg)';
        }

        function updateCompassUiWithValidHeading(headingDeg) {
            azimuteCompassActive = true;
            azimuteCompassLastValidTime = Date.now();

            const normDeg = ((headingDeg % 360) + 360) % 360;
            const roundedDeg = Math.round(normDeg) % 360;
            const idx = Math.round(normDeg / 45) % 8;
            const cardinalPt = AZIMUTE_CARDINAIS_PT[idx];
            const cardinalFull = AZIMUTE_CARDINAIS_NOMES_PT[cardinalPt] || cardinalPt;

            const stateBadge = document.getElementById('compassSensorStateBadge');
            const unavailBox = document.getElementById('compassUnavailableAlert');
            const activeBox = document.getElementById('compassActiveReadout');
            const degEl = document.getElementById('compassDegreeValue');
            const cardEl = document.getElementById('compassCardinalPt');
            const fullEl = document.getElementById('compassCardinalFullPt');
            const dialSvg = document.getElementById('compassDialSvg');

            if (stateBadge) {
                stateBadge.textContent = 'SENSOR ATIVO';
                stateBadge.className = 'px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/50';
            }
            if (unavailBox) unavailBox.classList.add('hidden');
            if (activeBox) activeBox.classList.remove('hidden');
            if (degEl) degEl.textContent = roundedDeg + '°';
            if (cardEl) cardEl.textContent = cardinalPt;
            const compHdrLbl = document.getElementById('lblDigitalCompassToggle');
            if (compHdrLbl) compHdrLbl.textContent = roundedDeg + '° ' + cardinalPt;
            if (fullEl) fullEl.textContent = 'Direção: ' + cardinalFull;
            if (dialSvg) dialSvg.style.transform = 'rotate(' + (-normDeg).toFixed(1) + 'deg)';
        }

        function handleAzimuteDeviceOrientation(ev) {
            let rawHeading = null;

            // 1. iOS (webkitCompassHeading)
            if (typeof ev.webkitCompassHeading === 'number' && !isNaN(ev.webkitCompassHeading)) {
                rawHeading = ev.webkitCompassHeading;
            }
            // 2. Android / Padrão W3C (alpha válido)
            else if (ev.alpha !== null && ev.alpha !== undefined && typeof ev.alpha === 'number' && !isNaN(ev.alpha)) {
                // Se usarmos tanto deviceorientationabsolute quanto deviceorientation, prioriza absoluto quando disponível
                if (ev.type === 'deviceorientation' && window._azimuteHasAbsoluteOrientation) {
                    return;
                }
                if (ev.type === 'deviceorientationabsolute' || ev.absolute === true) {
                    window._azimuteHasAbsoluteOrientation = true;
                }
                rawHeading = (360 - ev.alpha) % 360;
            }

            if (rawHeading === null || isNaN(rawHeading)) {
                if (!azimuteCompassActive) {
                    setCompassSensorUnavailable('Dispositivo sem magnetômetro ativo ou leitura inválida.');
                }
                return;
            }

            // Aplica compensação automática quando a tela estiver na horizontal (Modo GRID / Landscape)
            const screenOffset = getAzimuteScreenOrientationOffset();
            const compensatedHeading = (rawHeading + screenOffset + 360) % 360;
            updateCompassUiWithValidHeading(compensatedHeading);
        }

        function attachAzimuteCompassListeners() {
            if (typeof window.DeviceOrientationEvent === 'undefined') {
                setCompassSensorUnavailable('Este navegador/dispositivo não suporta DeviceOrientationEvent.');
                return;
            }
            if (!azimuteCompassListenersAttached) {
                azimuteCompassListenersAttached = true;
                if ('ondeviceorientationabsolute'in window) {
                    window.addEventListener('deviceorientationabsolute', handleAzimuteDeviceOrientation, true);
                }
                window.addEventListener('deviceorientation', handleAzimuteDeviceOrientation, true);
            }
            // Verifica após 2.5s se alguma leitura real chegou; caso contrário, mantém o aviso claro SENSOR INDISPONÍVEL
            setTimeout(() => {
                if (!azimuteCompassActive) {
                    setCompassSensorUnavailable('Nenhuma leitura magnética recebida do hardware (Sensor Indisponível neste aparelho).');
                }
            }, 2500);
        }

        window.requestAzimuteCompassPermission = async function() {
            getAzimuteScreenOrientationOffset();
            if (typeof window.DeviceOrientationEvent === 'undefined') {
                setCompassSensorUnavailable('Dispositivo sem suporte ao sensor de bússola.');
                if (typeof showToast === 'function') showToast('SENSOR INDISPONÍVEL neste aparelho.');
                return;
            }
            // iOS 13+ exige solicitação explícita de permissão via gesto do usuário
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                try {
                    const permState = await DeviceOrientationEvent.requestPermission();
                    if (permState === 'granted') {
                        attachAzimuteCompassListeners();
                        if (typeof showToast === 'function') showToast('Permissão de sensor concedida! Gire o aparelho.');
                    } else {
                        setCompassSensorUnavailable('Permissão negada pelo sistema para leitura do sensor.');
                        if (typeof showToast === 'function') showToast('Permissão do sensor negada.');
                    }
                } catch (err) {
                    setCompassSensorUnavailable('Não foi possível ativar o sensor (requer HTTPS ou sensor ausente).');
                }
            } else {
                // Android e demais navegadores
                attachAzimuteCompassListeners();
                if (azimuteCompassActive) {
                    if (typeof showToast === 'function') showToast('Bússola digital ativa e calibrada!');
                } else {
                    if (typeof showToast === 'function') showToast('Verificando sensor magnético do aparelho...');
                }
            }
        };

        window.addEventListener('orientationchange', () =>setTimeout(getAzimuteScreenOrientationOffset, 150));
        window.addEventListener('resize', getAzimuteScreenOrientationOffset);

        // Inicia o GPS continuamente e mantém somente busca de Hospitais em segundo plano (Clima/Conectividade sob demanda)
        document.addEventListener('DOMContentLoaded', () => {
            updateOfflineProximityData(azimuteLastGeoLat || -19.9162, azimuteLastGeoLon || -44.0809, 15);
            setInterval(() => {
                updateOfflineProximityData(azimuteLastGeoLat || -19.9162, azimuteLastGeoLon || -44.0809, 15);
            }, 30000);
            startAzimuteLiveGps();
            getAzimuteScreenOrientationOffset();
            if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission !== 'function') {
                attachAzimuteCompassListeners();
            } else {
                setCompassSensorUnavailable('Toque em "Ativar / Permitir Sensor"para habilitar a bússola.');
            }
        });

        window.toggleDigitalCompassBox = function(forceOpen = null) {
            const body = document.getElementById('digitalCompassExpandableBody');
            const lbl = document.getElementById('lblDigitalCompassToggle');
            const icon = document.getElementById('iconDigitalCompassChevron');
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

        window.showCompassHorizontalInfoTip = function(ev) {
            if (ev && typeof ev.stopPropagation === 'function') {
                ev.stopPropagation();
            }
            const tipEl = document.getElementById('compassHorizontalInfoToast');
            if (!tipEl) return;
            tipEl.classList.remove('hidden');
            if (compassInfoTipTimer) clearTimeout(compassInfoTipTimer);
            compassInfoTipTimer = setTimeout(() => {
                tipEl.classList.add('hidden');
            }, 5000);
        };
