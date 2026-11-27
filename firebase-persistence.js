/* AZIMUTE — js/core/firebase-persistence.js (Persistencia em nuvem opcional) */

        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        const ALL_PERSISTENT_FIELD_IDS = [
            'projectIdeasInput',
            'notepad18',
            'droneNotepadMineirao',
            'droneHeightMineirao',
            'droneSignalMineirao',
            'droneCollisionMineirao',
            'droneDifficultiesMineirao',
            'droneNotepadArenaMrv',
            'droneHeightArenaMrv',
            'droneSignalArenaMrv',
            'droneCollisionArenaMrv',
            'droneDifficultiesArenaMrv',
            'droneNotepadIndependencia',
            'droneHeightIndependencia',
            'droneSignalIndependencia',
            'droneCollisionIndependencia',
            'droneDifficultiesIndependencia'
        ];

        let db = null;
        let auth = null;
        let currentUser = null;
        let saveTimeout = null;
        let isApplyingRemote = false;
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'azimute-pmmg-app';

        async function initCloudPersistence() {
            try {
                if (typeof __firebase_config === 'undefined' || !__firebase_config) return;
                const firebaseConfig = JSON.parse(__firebase_config);
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);

                // REGRA 3: Autenticar ANTES de qualquer consulta
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
                currentUser = auth.currentUser;
                if (!currentUser) return;

                // REGRA 1: Caminho estrito para persistência contínua entre recarregamentos da Prévia
                const sharedDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'azimute_workspace_data', 'main_state');

                // Busca imediata ao abrir a pré-visualização
                const snap = await getDoc(sharedDocRef);
                if (snap.exists()) {
                    applyCloudDataToFields(snap.data());
                } else {
                    // Se ainda não existe na nuvem, salva o que estiver preenchido localmente
                    await pushFieldsToCloud(false);
                }

                // Escuta em tempo real com callback de erro obrigatório
                onSnapshot(
                    sharedDocRef,
                    (docSnap) => {
                        if (docSnap.exists()) {
                            applyCloudDataToFields(docSnap.data());
                        }
                    },
                    (err) => {
                        console.warn('Aviso de leitura em nuvem:', err);
                    }
                );
            } catch (e) {
                console.warn('Persistência local ativa:', e);
            }
        }

        function applyCloudDataToFields(data) {
            if (!data) return;
            isApplyingRemote = true;
            ALL_PERSISTENT_FIELD_IDS.forEach(fieldId => {
                const el = document.getElementById(fieldId);
                if (el && typeof data[fieldId] === 'string') {
                    // Não sobrescreve se o usuário estiver digitando neste exato campo agora
                    if (document.activeElement !== el || !el.value) {
                        el.value = data[fieldId];
                    }
                }
            });
            const statusEl = document.getElementById('ideasSaveStatus');
            if (statusEl) statusEl.textContent = 'Sincronizado na Nuvem';
            isApplyingRemote = false;
        }

        async function pushFieldsToCloud(notifyUser = false) {
            if (!db || !currentUser || isApplyingRemote) return;
            try {
                const payload = { updatedAt: Date.now() };
                ALL_PERSISTENT_FIELD_IDS.forEach(fieldId => {
                    const el = document.getElementById(fieldId);
                    if (el) {
                        payload[fieldId] = el.value || '';
                    }
                });

                const sharedDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'azimute_workspace_data', 'main_state');
                await setDoc(sharedDocRef, payload, { merge: true });

                const statusEl = document.getElementById('ideasSaveStatus');
                if (statusEl) statusEl.textContent = 'Salvo na Nuvem ';
                if (notifyUser && typeof showToast === 'function') {
                    showToast('Salvo na nuvem! Não será apagado nas próximas atualizações.');
                }
            } catch (err) {
                const statusEl = document.getElementById('ideasSaveStatus');
                if (statusEl) statusEl.textContent = 'Salvo no navegador';
            }
        }

        window.syncAllNotesToCloud = function(immediateNotify = false) {
            if (saveTimeout) clearTimeout(saveTimeout);
            if (immediateNotify) {
                pushFieldsToCloud(true);
            } else {
                saveTimeout = setTimeout(() => {
                    pushFieldsToCloud(false);
                }, 400);
            }
        };

        
        // LOGIN HANDLING (BEPE / COLISEU) - Exposto no escopo global window
        window.handleAzimuteLogin = window.handleAzimuteLogin || function() {
            const u = document.getElementById('loginUser').value.trim().toUpperCase();
            const p = document.getElementById('loginPass').value.trim().toUpperCase();
            const errDiv = document.getElementById('loginErrorMsg');
            const modal = document.getElementById('azimuteLoginModal');

            if (u === 'BEPE' && p === 'COLISEU') {
                localStorage.setItem('azimute_auth', 'authenticated');
                if (modal) {
                    modal.classList.remove('flex');
                    modal.classList.add('hidden');
                    modal.style.setProperty('display', 'none', 'important');
                }
                if (typeof showToast === 'function') showToast('Acesso liberado! Bem-vindo ao AZIMUTE.');
            } else {
                errDiv.classList.remove('hidden');
                setTimeout(() =>errDiv.classList.add('hidden'), 4000);
            }
        };

        // Check auth on load
        document.addEventListener('DOMContentLoaded', () => {
            const isAuth = localStorage.getItem('azimute_auth');
            if (isAuth === 'authenticated') {
                const modal = document.getElementById('azimuteLoginModal');
                if (modal) modal.classList.add('hidden');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // WHATSAPP SHARE LOCATION BUTTON
        window.shareLocationViaWhatsApp = function shareLocationViaWhatsApp() {
            const street = document.getElementById('hudCurrentStreet') ? document.getElementById('hudCurrentStreet').textContent : 'Localização atual';
            const sub = document.getElementById('hudCurrentSuburb') ? document.getElementById('hudCurrentSuburb').textContent : '';
            const radio = document.getElementById('hudRadioChannel') ? document.getElementById('hudRadioChannel').textContent : '';
            const hosp = document.getElementById('hudClosestHospital') ? document.getElementById('hudClosestHospital').textContent : '';

            const text = ` *STATUS ATUAL - AZIMUTE PMMG*\n` +
                         ` *QTH:* ${street}\n` +
                         ` *Região:* ${sub}\n` +
                         ` *Canaleta:* ${radio}\n` +
                         ` *Socorro Ref.:* ${hosp}\n` +
                         ` *Enviado via AZIMUTE PMMG*`;

            const url = `https://wa.me/?text=` + encodeURIComponent(text);
            window.open(url, '_blank');
        }

        // VOICE COMMANDS (SPEECH RECOGNITION)
        window.startVoiceCommand = function startVoiceCommand() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                if (typeof showToast === 'function') showToast('Seu navegador não suporta comandos de voz.');
                return;
            }
            const recognition = new SpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            if (typeof showToast === 'function') showToast('Ouvindo comando de voz... Fale o batalhão ou rua.');

            recognition.onresult = function(event) {
                const speechResult = event.results[0][0].transcript.toLowerCase();
                if (typeof showToast === 'function') showToast('Comando: "' + speechResult + '"');

                const searchInput = document.getElementById('globalSearch');
                if (searchInput) {
                    searchInput.value = speechResult;
                    handleGlobalSearch();
                }

                if (speechResult.includes('estádio') || speechResult.includes('mineirão') || speechResult.includes('estadio')) {
                    showView('estadios');
                } else if (speechResult.includes('drone') || speechResult.includes('rpas')) {
                    showView('rpas');
                } else if (speechResult.includes('18') || speechResult.includes('batalhão 18')) {
                    showView('18bpm');
                } else if (speechResult.includes('atalho') || speechResult.includes('reds') || speechResult.includes('sistema')) {
                    showView('atalhos');
                }
            };

            recognition.onerror = function() {
                if (typeof showToast === 'function') showToast('Não foi possível reconhecer a voz.');
            };

            try {
                recognition.start();
            } catch (_) {
                if (typeof showToast === 'function') showToast('Não foi possível iniciar o comando de voz.');
            }
        }
