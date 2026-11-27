/* AZIMUTE — js/core/storage-state.js (Persistencia local, estado global, SW/FOUC e bridge modular) */

window.AzCore = window.AzCore || {};

window.AzGeo = window.AzGeo || {};

window.AzTac = window.AzTac || {};

      (function () {
        try {
          if (window.screen && window.screen.orientation && typeof window.screen.orientation.unlock === "function") {
            try { window.screen.orientation.unlock(); } catch (_) {}
          }
          window.addEventListener("load", function () {
            try {
              if (window.screen && window.screen.orientation && typeof window.screen.orientation.unlock === "function") {
                window.screen.orientation.unlock();
              }
            } catch (_) {}
          });
          var mLink = document.getElementById("azimuteManifestLink");
          if (mLink && location.protocol.indexOf("http") === 0 && typeof Blob !== "undefined" && URL && URL.createObjectURL) {
            fetch("./manifest.webmanifest", { cache: "no-store" }).then(function (r) {
              return r.ok ? r.json() : null;
            }).then(function (m) {
              if (!m || typeof m !== "object") return;
              m.orientation = "any";
              if (m.start_url) { try { m.start_url = new URL(m.start_url, location.href).href; } catch (_) {} }
              if (m.scope) { try { m.scope = new URL(m.scope, location.href).href; } catch (_) {} }
              if (Array.isArray(m.icons)) {
                m.icons = m.icons.map(function (ic) {
                  var copy = Object.assign({}, ic);
                  try { if (copy.src) copy.src = new URL(copy.src, location.href).href; } catch (_) {}
                  return copy;
                });
              }
              var blob = new Blob([JSON.stringify(m)], { type: "application/manifest+json" });
              mLink.setAttribute("href", URL.createObjectURL(blob));
            }).catch(function () {});
          }
        } catch (_) {}
      })();

        (function () {
            var root = document.documentElement;
            root.classList.add('az-fouc-pending');
            var revealed = false;
            window.__azimuteRevealUI = function () {
                if (revealed) return;
                revealed = true;
                root.classList.remove('az-fouc-pending');
                root.classList.add('az-fouc-ready');
            };
            setTimeout(window.__azimuteRevealUI, 1200);
        })();

        window.azimuteTailwindConfig = {
            theme: {
                extend: {
                    colors: {
                        pmmg: {
                            black: '#0D0D0D',
                            dark: '#161616',
                            card: '#161616',
                            cardHover: '#1f1e1b',
                            border: '#2e2b24',
                            khaki: '#C5A869',
                            khakiHover: '#d4bc84',
                            khakiDark: '#8B7E52',
                            khakiLight: '#f4efe0',
                            khakiBadge: '#26231c',
                            gold: '#C5A869',
                            red: '#dc2626'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        military: ['Teko', 'sans-serif']
                    }
                }
            }
        }

        window.toggleAzimutePasswordEye = function() {
            const pEl = document.getElementById('loginPass');
            const eyeOpen = document.getElementById('svgEyeOpen');
            const eyeClosed = document.getElementById('svgEyeClosed');
            if (!pEl) return;
            if (pEl.type === 'password') {
                pEl.type = 'text';
                if (eyeOpen) eyeOpen.classList.add('hidden');
                if (eyeClosed) eyeClosed.classList.remove('hidden');
            } else {
                pEl.type = 'password';
                if (eyeOpen) eyeOpen.classList.remove('hidden');
                if (eyeClosed) eyeClosed.classList.add('hidden');
            }
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
                        document.cookie = "azimute_auth=authenticated; max-age=31536000; path=/; SameSite=Lax";
                    } else {
                        localStorage.removeItem('azimute_auth');
                        localStorage.removeItem('azimute_saved_user');
                        localStorage.removeItem('azimute_saved_pass');
                        localStorage.setItem('azimute_remember', 'false');
                        document.cookie = "azimute_auth=; max-age=0; path=/; SameSite=Lax";
                    }
                } catch (e) {}
                if (errDiv) errDiv.classList.add('hidden');
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    modal.style.setProperty('display', 'none', 'important');
                }
                if (typeof showToast === 'function') showToast('Acesso liberado! Bem-vindo ao AZIMUTE.');
            } else {
                if (errDiv) {
                    errDiv.classList.remove('hidden');
                    setTimeout(() =>errDiv.classList.add('hidden'), 4000);
                }
            }
        };

        (function() {
            const uEl = document.getElementById('loginUser');
            const pEl = document.getElementById('loginPass');
            const remEl = document.getElementById('loginRememberMe');
            try {
                const savedUser = localStorage.getItem('azimute_saved_user');
                const savedPass = localStorage.getItem('azimute_saved_pass');
                const savedRem = localStorage.getItem('azimute_remember');
                if (savedUser && uEl) uEl.value = savedUser;
                if (savedPass && pEl) pEl.value = savedPass;
                if (savedRem === 'false' && remEl) remEl.checked = false;

                const hasCookieAuth = document.cookie.split(';').some(c =>c.trim().startsWith('azimute_auth=authenticated'));
                const isRemembered = localStorage.getItem('azimute_auth') === 'authenticated' || hasCookieAuth;
                const isSessionAuth = sessionStorage.getItem('azimute_session_auth') === 'authenticated';

                if (isRemembered || isSessionAuth) {
                    const modal = document.getElementById('azimuteLoginModal');
                    if (modal) {
                        modal.classList.remove('flex');
                        modal.classList.add('hidden');
                        modal.style.setProperty('display', 'none', 'important');
                    }
                }
            } catch (e) {}
            [uEl, pEl].forEach(el => {
                if (el) {
                    el.addEventListener('keydown', function(ev) {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            window.handleAzimuteLogin();
                        }
                    });
                }
            });
        })();

        function saveLastValidQthToCache(qthObj) {
            try {
                localStorage.setItem('azimute_last_valid_qth', JSON.stringify(qthObj));
            } catch (e) {}
        }

        function loadLastValidQthFromCache() {
            try {
                const raw = localStorage.getItem('azimute_last_valid_qth');
                if (!raw) return null;
                const saved = JSON.parse(raw);
                if (saved && saved.street) {
                    azimuteLastStreet = saved.street;
                    azimuteLastGeoLat = saved.lat || -19.9162;
                    azimuteLastGeoLon = saved.lon || -44.0809;

                    const stEl = document.getElementById('hudCurrentStreet');
                    const subEl = document.getElementById('hudCurrentSuburb');
                    const tsEl = document.getElementById('hudLastSavedTimestamp');
                    const coordsEl = document.getElementById('detailExactCoords');
                    const mapsBtn = document.getElementById('btnOpenCurrentInMaps');

                    const cleanCachedSuburb = (saved.cepVerified === true)
                        ? (saved.suburb || '')
                        : String(saved.suburb || '').replace(/\s*•\s*CEP:.*$/i, '');
                    const cachedParts = String(cleanCachedSuburb || '').split('•').map(p => p.trim()).filter(Boolean);
                    azimuteCurrentSuburb = saved.suburbRaw || (cachedParts[0] || '');
                    azimuteCurrentCity = saved.cityRaw || (cachedParts[1] && !/^CEP:/i.test(cachedParts[1]) ? cachedParts[1] : '');
                    if (stEl) stEl.textContent = saved.street;
                    if (subEl) subEl.textContent = cleanCachedSuburb;
                    const hQth = document.getElementById('homeQuickQth');
                    const hSub = document.getElementById('homeQuickSuburb');
                    const sbQth = document.getElementById('statusBarQth');
                    if (hQth) hQth.textContent = saved.street;
                    if (hSub) hSub.textContent = saved.suburb || '';
                    if (sbQth) sbQth.textContent = formatFullStatusBarQth(saved.street, saved.suburb);
                    const gQth = document.getElementById('gridCenterQth');
                    const gSub = document.getElementById('gridCenterSuburb');
                    const gCoords = document.getElementById('gridCenterCoords');
                    const gMapBtn = document.getElementById('gridBtnExactMap');
                    if (gQth) gQth.textContent = saved.street;
                    if (gSub) gSub.textContent = saved.suburb || '';
                    if (gCoords && saved.lat && saved.lon) gCoords.textContent = saved.lat.toFixed(5) + ', ' + saved.lon.toFixed(5);
                    if (gMapBtn && saved.lat && saved.lon) gMapBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + saved.lat + ',' + saved.lon;
                    if (tsEl && saved.timestamp) tsEl.textContent = 'Último QTH registrado: ' + saved.timestamp;
                    if (coordsEl && saved.lat && saved.lon) coordsEl.textContent = saved.lat.toFixed(6) + ', ' + saved.lon.toFixed(6);
                    if (mapsBtn && saved.lat && saved.lon) {
                        mapsBtn.href = 'https://www.google.com/maps/search/?api=1&query=' + saved.lat + ',' + saved.lon;
                    }
                    const cachedAlt = saved.alt || localStorage.getItem('azimute_last_altitude');
                    if (cachedAlt) {
                        const altEl = document.getElementById('detAltitude');
                        const altQuick = document.getElementById('hudAltitudeQuickBadge');
                        if (altEl) altEl.textContent = cachedAlt;
                        if (altQuick) altQuick.textContent = 'Altitude: ' + cachedAlt;
                    }
                    updateOfflineProximityData(azimuteLastGeoLat, azimuteLastGeoLon, saved.acc || 15);
                }
                return saved;
            } catch (e) {
                return null;
            }
        }

        // Hospitais de Referência para Trauma e Emergência Grave (HPM excluído por não ser referência de trauma grave)

        // Registra o Service Worker (Modo Avião e Atualização Automática)
        if ('serviceWorker'in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => {});
            });
        }

        // Persistência de armazenamento: evita que o Android limpe o cache de mapas automaticamente
        window.addEventListener('load', () => {
            try {
                if (navigator.storage && typeof navigator.storage.persist === 'function') {
                    navigator.storage.persisted().then(already => {
                        if (!already) return navigator.storage.persist();
                    }).catch(() => {});
                }
            } catch (e) {}
        });

        // Comunicação com o Service Worker: estatísticas e limpeza do cache de mapas
        function azSwRequest(msg) {
            return new Promise((resolve, reject) => {
                try {
                    const sw = navigator.serviceWorker && navigator.serviceWorker.controller;
                    if (!sw) { reject(new Error('sem-sw')); return; }
                    const ch = new MessageChannel();
                    const timer = setTimeout(() => reject(new Error('timeout')), 15000);
                    ch.port1.onmessage = (ev) => { clearTimeout(timer); resolve(ev.data); };
                    sw.postMessage(msg, [ch.port2]);
                } catch (e) { reject(e); }
            });
        }