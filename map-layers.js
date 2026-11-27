/* AZIMUTE — js/modules/map-layers.js (MapLibre, camadas, transicao leve sem blur, controles e interacoes do mapa) */

    window.azimuteToggleGeoDrawer = function () {
      const body = document.getElementById("azGeoDrawerBody");
      const btn = document.getElementById("azGeoDrawerToggle");
      const arrow = document.getElementById("azGeoDrawerArrow");
      if (!body) return;
      const open = body.classList.toggle("is-open");
      if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (arrow) arrow.textContent = open ? "FECHAR -" : "ABRIR +";
      if (open && !document.body.classList.contains("az-map-expanded") && typeof window.azEnsureReducedLightMap === "function") {
        window.azEnsureReducedLightMap();
      }
      if (window.azimuteUpdateRadarHudVisibility) {
        window.azimuteUpdateRadarHudVisibility();
      }
      if (open && window.azimuteGeoInvalidate) {
        window.azimuteGeoInvalidate();
      }
    };

function initAzimuteGeo() {
  const mapEl = document.getElementById("azGeoMap");
  if (!mapEl) return;
if (window.__azimuteGeoInitialized) {
  if (window.azGeoMap && typeof window.azGeoMap.resize === "function") {
    window.azGeoMap.resize();
  }
  return;
}
  if (typeof maplibregl === "undefined") {
  let maplibreScript = document.getElementById("az-maplibre-loader");
  if (!maplibreScript) {
    maplibreScript = document.createElement("script");
    maplibreScript.id = "az-maplibre-loader";
    maplibreScript.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
    maplibreScript.onload = () => initAzimuteGeo();
    document.head.appendChild(maplibreScript);
  }
    return;
  }
  if (mapEl.dataset.azReady === "1") return;
  mapEl.dataset.azReady = "1";

  if (!document.getElementById("azGeoSmoothStyle")) {
    const st = document.createElement("style");
    st.id = "azGeoSmoothStyle";
    st.textContent = `
      .az-smooth-marker {
        position: relative;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .az-smooth-pulse {
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(197, 168, 105, 0.28);
        border: 1px solid rgba(197, 168, 105, 0.6);
        animation: azMarkerRipple 2.2s ease-out infinite;
      }
      .az-smooth-svg {
        position: relative;
        z-index: 2;
        display: block;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.92));
      }
      @keyframes azMarkerRipple {
        0% { transform: scale(0.75); opacity: 0.85; }
        100% { transform: scale(1.75); opacity: 0; }
      }
    `;
    document.head.appendChild(st);
  }

  const STYLE_URLS = {
    dark: "https://tiles.openfreemap.org/styles/dark",
    light: "https://tiles.openfreemap.org/styles/liberty",
    satellite: "https://tiles.openfreemap.org/styles/dark",
    mono: "https://tiles.openfreemap.org/styles/dark"
  };

  const OVERPASS_MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  const LAYER_META = {
    unidades: { label: "Unidade", color: "#C5A869" },
    hospitais: { label: "Hospital", color: "#EF4444" },
    bscs: { label: "BSC", color: "#38BDF8" },
    deplans: { label: "Deplan", color: "#4ADE80" },
    extra: { label: "Ponto", color: "#F2F0EA" }
  };

  let mapTheme = localStorage.getItem("az_geo_map_theme") || "light";

  const searchInput = document.getElementById("azGeoSearchInput");
  const searchBtn = document.getElementById("azGeoSearchBtn");
  const searchResultsEl = document.getElementById("azGeoSearchResults");
  const centerFab = document.getElementById("azGeoCenterFab");
  const northBadge = document.getElementById("azGeoNorthBadge");
  const tiltBadge = document.getElementById("azGeoTiltBadge");
  const lockBadge = document.getElementById("azGeoLockBadge");
  const zoomInBtn = document.getElementById("azGeoZoomInBtn");
  const zoomOutBtn = document.getElementById("azGeoZoomOutBtn");
  const stageEl = document.getElementById("azGeoStage");
  const followBtn = document.getElementById("azGeoFollowBtn");
  const headingUpBtn = document.getElementById("azGeoHeadingUpBtn");
  const elevToggleBtn = document.getElementById("azGeoElevToggleBtn");
  const clearBtn = document.getElementById("azGeoClearBtn");
  const addPinBtn = document.getElementById("azGeoAddPinBtn");
  const incursionBtn = document.getElementById("azGeoIncursionBtn");
  const layersToggleBtn = document.getElementById("azGeoLayersToggleBtn");
  const layersBox = document.getElementById("azGeoLayersBox");
  const layerChipsWrap = document.getElementById("azGeoLayerChips");
  const munToggleBtn = document.getElementById("azGeoMunToggleBtn");
  const cfgToggleBtn = document.getElementById("azGeoCfgToggleBtn");
  const munBox = document.getElementById("azGeoMunBox");
  const cfgBox = document.getElementById("azGeoCfgBox");
  const routeBox = document.getElementById("azGeoRouteBox");
  const tbtBar = document.getElementById("azGeoTbtBar");
  const tbtNextEl = document.getElementById("azGeoTbtNext");
  const tbtCurrentEl = document.getElementById("azGeoTbtCurrent");
  const stopRouteBtn = document.getElementById("azGeoStopRouteBtn");

  const pinForm = document.getElementById("azGeoPinForm");
  const pinCoordsLabel = document.getElementById("azGeoPinCoordsLabel");
  const pinTitleInput = document.getElementById("azGeoPinTitle");
  const pinNoteInput = document.getElementById("azGeoPinNote");
  const pinColorSelect = document.getElementById("azGeoPinColor");
  const savePinBtn = document.getElementById("azGeoSavePinBtn");
  const cancelPinBtn = document.getElementById("azGeoCancelPinBtn");
  const exportPinsBtn = document.getElementById("azGeoExportPinsBtn");
  const importPinsBtn = document.getElementById("azGeoImportPinsBtn");
  const importPinsInput = document.getElementById("azGeoImportPinsInput");
  const routeNowBtn = document.getElementById("azGeoRouteNowBtn");
  const startNavBtn = document.getElementById("azGeoStartNavBtn");
  const statusEl = document.getElementById("azGeoStatus");
  const targetEl = document.getElementById("azGeoTarget");
  const citiesWrap = document.getElementById("azGeoCities");
  const citiesLeft = document.getElementById("azGeoCitiesLeft");
  const citiesRight = document.getElementById("azGeoCitiesRight");
  const modesWrap = document.getElementById("azGeoModes");
  const themesWrap = document.getElementById("azGeoMapThemes");
  const colorsWrap = document.getElementById("azGeoArrowColors");

  const calScreenBadge = document.getElementById("azCalScreenBadge");
  const calRawDegEl = document.getElementById("azCalRawDeg");
  const calOffsetDegEl = document.getElementById("azCalOffsetDeg");
  const calFinalDegEl = document.getElementById("azCalFinalDeg");
  const calButtonsWrap = document.getElementById("azCalButtons");
  const calAlignFrontBtn = document.getElementById("azCalAlignFrontBtn");
  const calLockToggleBtn = document.getElementById("azCalLockToggleBtn");

  const incOverlay = document.getElementById("azIncursionOverlay");
  const incCloseBtn = document.getElementById("azIncCloseBtn");
  const incMapSlot = document.getElementById("azIncMapSlot");
  const incTelemetryEl = document.getElementById("azIncTelemetry");
  const incAltLabelEl = document.getElementById("azIncAltLabel");
  const incReliefCanvas = document.getElementById("azIncReliefCanvas");
  const incPinsListEl = document.getElementById("azIncPinsList");
  const incPinCountEl = document.getElementById("azIncPinCount");
  const incQuickPinBtn = document.getElementById("azIncQuickPinBtn");

  const terrainModal = document.getElementById("azTerrainModal");
  const terrainHeaderInfo = document.getElementById("azTerrainHeaderInfo");
  const terrainCenterAlt = document.getElementById("azTerrainCenterAlt");
  const canvas3d = document.getElementById("azTerrain3dCanvas");
  const canvasSide = document.getElementById("azTerrainSideCanvas");

  const radarHud = document.getElementById("azRadarHud");
  const radarExpandBtn = document.getElementById("azRadarExpandBtn");
  const radarNextStepEl = document.getElementById("azRadarNextStep");
  const radarCurrentViaEl = document.getElementById("azRadarCurrentVia");

  const map = new maplibregl.Map({
    container: "azGeoMap",
    style: STYLE_URLS[mapTheme] || STYLE_URLS.dark,
    center: [-43.9386, -19.9191],
    zoom: 13,
    bearing: 0,
    pitch: 0,
    maxPitch: 65,
    antialias: true,
    fadeDuration: 0,
    maxTileCacheSize: 180,
    maxTileCacheZoomLevels: 4,
    pixelRatio: window.devicePixelRatio || 1,
    touchPitch: true,
    pitchWithRotate: true,
    attributionControl: false
  });
  window.azGeoMap = map;
  window.__azimuteGeoInitialized = true;

  function syncTiltBadgeUi() {
    if (!tiltBadge) return;
    const is3d = map.getPitch() >= 20;
    tiltBadge.textContent = is3d ? "3D" : "2D";
    tiltBadge.classList.toggle("is-3d", is3d);
  }

  if (tiltBadge) {
    tiltBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      const nextPitch = map.getPitch() >= 20 ? 0 : 56;
      map.easeTo({ pitch: nextPitch, duration: 350 });
    });
  }
  map.on("pitch", syncTiltBadgeUi);
  map.on("pitchend", syncTiltBadgeUi);

  function instantResizeMap() {
    requestAnimationFrame(() => {
      map.resize();
    });
  }

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    if (stageEl) ro.observe(stageEl);
    if (incMapSlot) ro.observe(incMapSlot);
    ro.observe(mapEl);
  }
  document.addEventListener("fullscreenchange", instantResizeMap);
  document.addEventListener("webkitfullscreenchange", instantResizeMap);
  window.addEventListener("resize", instantResizeMap);

  if (zoomInBtn) zoomInBtn.addEventListener("click", () => map.zoomIn());
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => map.zoomOut());

  let radarMap = null;
  let radarGpsMarker = null;
  let radarArrowSvg = null;
  if (document.getElementById("azRadarMiniMap")) {
    radarMap = new maplibregl.Map({
      container: "azRadarMiniMap",
      style: STYLE_URLS[mapTheme] || STYLE_URLS.dark,
      center: [-43.9386, -19.9191],
      zoom: 16,
      bearing: 0,
      fadeDuration: 0,
      maxTileCacheSize: 60,
      maxTileCacheZoomLevels: 3,
      pixelRatio: 1,
      interactive: false,
      attributionControl: false
    });
  }

  let lastPos = null;
  let prevTrackPos = null;
  let lastMainGpsKey = "";
  let lastAltitude = null;
  let lastAccuracy = null;
  let lastSpeed = 0;
  let lastGpsHeading = null;
  let computedGpsCourse = null;
  let lastMoveTimestamp = 0;

  let compassSamples = [];
  let rawCompassHeading = 0;
  let stableHeading = 0;
  let hasAbsoluteCompass = false;
  let userTouchPauseUntil = 0;
  let lastMapBearingApplied = 0;

  let calOffsetPortrait = parseInt(localStorage.getItem("az_cal_offset_portrait") || "0", 10) || 0;
  let calOffsetLandscape = parseInt(localStorage.getItem("az_cal_offset_landscape") || "0", 10) || 0;
  let isHeadingManuallyLocked = false;
  let handlingFreezeUntil = 0;
  let calToastTimer = null;

  let lastQuadHeading = null;
  let lastQuadUpdateTime = 0;
  let lastQuadStreetSource = "";

  let animCurrentPos = null;
  let animStartPos = null;
  let animTargetPos = null;
  let animPosStartTime = 0;
  let animPosDuration = 700;
  let animVisualAngle = 0;
  let animLoopRunning = false;

  let gpsMarker = null;
  let gpsArrowEl = null;
  let gpsArrowSvg = null;
  let gpsArrowPoly = null;
  let gpsPulseEl = null;
  let destMarker = null;
  let pinMarkers = [];
  let followGps = true;
  let headingUpMode = true;
  let firstGpsFix = true;
  let localPoints = [];

  let datasetPoints = {
    unidades: [],
    hospitais: [],
    bscs: [],
    deplans: []
  };
  let activeLayers = {
    unidades: localStorage.getItem("az_layer_unidades") !== "0",
    hospitais: localStorage.getItem("az_layer_hospitais") !== "0",
    bscs: localStorage.getItem("az_layer_bscs") !== "0",
    deplans: localStorage.getItem("az_layer_deplans") !== "0"
  };

  let currentTravelMode = "carro";
  let currentDestination = null;
  let activeRouteDest = null;
  let activeRouteSteps = [];
  let activeRouteCoords = [];
  let isNavigationStarted = false;
  let lastRerouteTimestamp = 0;

  let arrowColor = localStorage.getItem("az_geo_arrow_color") || "#C5A869";
  let showElevation = localStorage.getItem("az_geo_elev_enabled") !== "0";

  let savedPins = [];
  try {
    savedPins = JSON.parse(localStorage.getItem("az_geo_pins_v1") || "[]");
    if (!Array.isArray(savedPins)) savedPins = [];
  } catch (e) {
    savedPins = [];
  }

  let pinDropMode = false;
  let pendingPinCoords = null;

  let lastStreetsFetchPos = null;
  let fetchingStreets = false;
  let retryStreetsTimer = null;
  let cachedCurrentStreet = "Via atual";
  let cachedNearbyStreets = [];
  let cachedVectorSegments = [];
  let cachedSectors = { front: null, right: null, rear: null, left: null };
  let cached8Sectors = [null, null, null, null, null, null, null, null];

  let elevationGrid5x5 = null;
  let espectroAnimRunning = false;
  let espectroAnimPhase = 0;

  function prepareHiDpiCanvas(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(10, Math.round(rect.width || canvas.clientWidth || 340));
    const cssH = Math.max(10, Math.round(rect.height || canvas.clientHeight || 220));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssW, h: cssH };
  }

  window.azimuteToggleIncursionMode = function (forceOpen) {
    if (!incOverlay || !incMapSlot || !stageEl) return;
    const willOpen = typeof forceOpen === "boolean" ? forceOpen : !incOverlay.classList.contains("is-open");

    if (willOpen) {
      const isHalf = incOverlay.classList.contains("is-halfscreen");
      incOverlay.classList.add("is-open");
      if (isHalf) {
        document.body.classList.remove("az-incursion-fullscreen");
        document.body.classList.add("az-incursion-halfscreen");
        // Mantém o mapa ativo visível em #azGeoStage (nunca tela preta)
        if (mapEl.parentElement !== stageEl) stageEl.insertBefore(mapEl, stageEl.firstChild);
        if (northBadge && northBadge.parentElement !== stageEl) stageEl.appendChild(northBadge);
        if (tiltBadge && tiltBadge.parentElement !== stageEl) stageEl.appendChild(tiltBadge);
        if (lockBadge && lockBadge.parentElement !== stageEl) stageEl.appendChild(lockBadge);
        if (centerFab && centerFab.parentElement !== stageEl) stageEl.appendChild(centerFab);
      } else {
        document.body.classList.remove("az-incursion-halfscreen");
        document.body.classList.add("az-incursion-fullscreen");
        if (mapEl.parentElement !== incMapSlot) {
          incMapSlot.insertBefore(mapEl, incMapSlot.firstChild);
        }
        if (northBadge && northBadge.parentElement !== incMapSlot) {
          incMapSlot.appendChild(northBadge);
        }
        if (tiltBadge && tiltBadge.parentElement !== incMapSlot) {
          incMapSlot.appendChild(tiltBadge);
        }
        if (lockBadge && lockBadge.parentElement !== incMapSlot) {
          incMapSlot.appendChild(lockBadge);
        }
        if (centerFab && centerFab.parentElement !== incMapSlot) {
          incMapSlot.appendChild(centerFab);
        }
      }
      map.resize();
      requestAnimationFrame(() => map.resize());
      recomputeQuadranteSectors(true);
      renderIncursionPinsList();
      startEspectro3dLoop();
    } else {
      document.body.classList.remove("az-incursion-fullscreen");
      document.body.classList.remove("az-incursion-halfscreen");
      incOverlay.classList.remove("is-open");
      incOverlay.classList.remove("is-halfscreen");
      if (mapEl.parentElement !== stageEl) {
        stageEl.insertBefore(mapEl, stageEl.firstChild);
      }
      if (northBadge && northBadge.parentElement !== stageEl) {
        stageEl.appendChild(northBadge);
      }
      if (tiltBadge && tiltBadge.parentElement !== stageEl) {
        stageEl.appendChild(tiltBadge);
      }
      if (lockBadge && lockBadge.parentElement !== stageEl) {
        stageEl.appendChild(lockBadge);
      }
      if (centerFab && centerFab.parentElement !== stageEl) {
        stageEl.appendChild(centerFab);
      }
      map.resize();
      requestAnimationFrame(() => map.resize());
    }
  };

  if (incursionBtn) {
    incursionBtn.addEventListener("click", () => {
      try { requestCompassPermissionIfNeeded(); } catch (_) {}
      if (incOverlay) incOverlay.classList.remove("is-halfscreen");
      window.azimuteToggleIncursionMode(true);
    });
  }
  if (incCloseBtn) {
    incCloseBtn.addEventListener("click", () => {
      if (incOverlay) incOverlay.classList.remove("is-halfscreen");
      window.azimuteToggleIncursionMode(false);
    });
  }

  [
    { id: "azIncEdgeFront", key: "front", label: "Frente" },
    { id: "azIncEdgeRear", key: "rear", label: "Retaguarda" },
    { id: "azIncEdgeLeft", key: "left", label: "Esquerda" },
    { id: "azIncEdgeRight", key: "right", label: "Direita" }
  ].forEach(({ id, key, label }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", () => {
      const st = cachedSectors[key];
      if (!st) return;
      userTouchPauseUntil = Date.now() + 3500;
      map.easeTo({ center: [st.lng, st.lat], zoom: 17.5, duration: 320 });
      new maplibregl.Popup({ offset: 12 })
        .setLngLat([st.lng, st.lat])
        .setHTML(buildPopupHtml(`${label}: ${st.name}`, `${Math.round(st.distKm * 1000)} m de distância`, st.lat, st.lng, null, null))
        .addTo(map);
    });
  });

  if (incQuickPinBtn) {
    incQuickPinBtn.addEventListener("click", () => {
      if (!lastPos) return;
      const idx = savedPins.length + 1;
      savedPins.push({
        id: "pin_" + Date.now(),
        title: `Ponto ${idx} (${cachedCurrentStreet.slice(0, 18)})`,
        note: "Marcado no Modo Incursão",
        color: "#C5A869",
        lat: lastPos[0],
        lng: lastPos[1]
      });
      persistPins();
      renderSavedPins();
      renderIncursionPinsList();
      if (navigator.vibrate) navigator.vibrate(35);
    });
  }

  function renderIncursionPinsList() {
    if (!incPinsListEl) return;
    if (incPinCountEl) incPinCountEl.textContent = String(savedPins.length);

    if (!savedPins.length) {
      incPinsListEl.innerHTML = `<div style="font-size:11px; color:#9E9A8F; text-align:center; padding:12px 4px;">Nenhum alfinete marcado</div>`;
      return;
    }

    const enriched = savedPins.map((p) => {
      const distM = lastPos ? Math.round(calcDistanceKm(lastPos[0], lastPos[1], p.lat, p.lng) * 1000) : null;
      return { ...p, distM };
    });

    enriched.sort((a, b) => (a.distM ?? 999999) - (b.distM ?? 999999));

    incPinsListEl.innerHTML = "";
    enriched.forEach((p) => {
      const row = document.createElement("div");
      row.className = "az-inc-pin-row";
      const distStr = p.distM === null ? "---" : p.distM < 1000 ? `${p.distM} m` : `${(p.distM / 1000).toFixed(1)} km`;
      row.innerHTML = `
        <span class="az-inc-pin-name"><span style="color:${p.color || "#C5A869"};">●</span> ${p.title}</span>
        <span class="az-inc-pin-dist">${distStr}</span>
      `;
      row.addEventListener("click", () => {
        userTouchPauseUntil = Date.now() + 4000;
        map.easeTo({ center: [p.lng, p.lat], zoom: 17.5, duration: 320 });
      });
      incPinsListEl.appendChild(row);
    });
  }

  function normalizeAngle(deg) {
    return ((deg % 360) + 360) % 360;
  }

  function shortestAngleDiff(fromDeg, toDeg) {
    let diff = (toDeg - fromDeg) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  }

  function getNativeScreenAngle() {
    if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === "number") {
      return normalizeAngle(window.screen.orientation.angle);
    }
    if (typeof window.orientation === "number") {
      return normalizeAngle(window.orientation);
    }
    return 0;
  }

  function isLandscapeMode() {
    const ang = getNativeScreenAngle();
    if (ang === 90 || ang === 270) return true;
    return window.innerWidth > window.innerHeight;
  }

  function getActiveCalibrationOffset() {
    return isLandscapeMode() ? calOffsetLandscape : calOffsetPortrait;
  }

  function setActiveCalibrationOffset(val) {
    let clean = ((val + 180) % 360 + 360) % 360 - 180;
    if (isLandscapeMode()) {
      calOffsetLandscape = clean;
      localStorage.setItem("az_cal_offset_landscape", String(clean));
    } else {
      calOffsetPortrait = clean;
      localStorage.setItem("az_cal_offset_portrait", String(clean));
    }
    updateCalibratorReadout();
    refreshStabilizedHeading(true);
  }

  function notifyCalibratorSaved(customLabel) {
    const off = getActiveCalibrationOffset();
    const offTxt = `${off >= 0 ? "+" : ""}${off}°`;
    if (calAlignFrontBtn) {
      calAlignFrontBtn.classList.remove("subtle");
      calAlignFrontBtn.classList.add("green");
      calAlignFrontBtn.textContent = customLabel || `✓ Salvo (${offTxt})`;
      clearTimeout(calToastTimer);
      calToastTimer = setTimeout(() => {
        calAlignFrontBtn.classList.remove("green");
        calAlignFrontBtn.classList.add("subtle");
        calAlignFrontBtn.textContent = "Gravar Frente Atual";
      }, 1800);
    }
    if (navigator.vibrate) navigator.vibrate(35);
    if (statusEl) statusEl.textContent = `Calibração salva (${offTxt})`;
  }

  function updateCalibratorReadout() {
    const landscape = isLandscapeMode();
    const off = getActiveCalibrationOffset();
    if (calScreenBadge) {
      calScreenBadge.textContent = landscape ? "Modo: Horizontal (GRID)" : "Modo: Vertical (Em pé)";
    }
    if (calRawDegEl) {
      calRawDegEl.textContent = `${String(Math.round(rawCompassHeading)).padStart(3, "0")}°`;
    }
    if (calOffsetDegEl) {
      calOffsetDegEl.textContent = `${off >= 0 ? "+" : ""}${off}°`;
    }
    if (calFinalDegEl) {
      calFinalDegEl.textContent = `${String(Math.round(stableHeading)).padStart(3, "0")}°`;
    }
  }

  function setHeadingLockState(locked) {
    isHeadingManuallyLocked = !!locked;
    if (lockBadge) {
      lockBadge.classList.toggle("is-locked", isHeadingManuallyLocked);
      lockBadge.innerHTML = isHeadingManuallyLocked ? "<span>RUMO TRAVADO</span>" : "<span>RUMO LIVRE</span>";
    }
    if (calLockToggleBtn) {
      calLockToggleBtn.textContent = isHeadingManuallyLocked ? "Destravar Rumo" : "Travar Rumo ao Digitar";
      calLockToggleBtn.classList.toggle("active", isHeadingManuallyLocked);
      calLockToggleBtn.classList.toggle("subtle", !isHeadingManuallyLocked);
    }
  }

  if (lockBadge) {
    lockBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      setHeadingLockState(!isHeadingManuallyLocked);
    });
  }
  if (calLockToggleBtn) {
    calLockToggleBtn.addEventListener("click", () => {
      setHeadingLockState(!isHeadingManuallyLocked);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      handlingFreezeUntil = Date.now() + 8000;
    });
  }

  if (calButtonsWrap) {
    calButtonsWrap.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.hasAttribute("data-cal-reset")) {
          setActiveCalibrationOffset(0);
          notifyCalibratorSaved("✓ Zerado (0°)");
          return;
        }
        const delta = parseInt(btn.getAttribute("data-cal-delta") || "0", 10);
        setActiveCalibrationOffset(getActiveCalibrationOffset() + delta);
        notifyCalibratorSaved();
      });
    });
  }

  if (calAlignFrontBtn) {
    calAlignFrontBtn.classList.add("subtle");
    calAlignFrontBtn.addEventListener("click", () => {
      const baseSensor = normalizeAngle(rawCompassHeading + getNativeScreenAngle());
      const diffToCurrentMap = Math.round(shortestAngleDiff(baseSensor, getMapBearing()));
      setActiveCalibrationOffset(diffToCurrentMap);
      notifyCalibratorSaved();
    });
  }

  function pushSmoothedCompass(newDeg) {
    compassSamples.push(newDeg);
    if (compassSamples.length > 10) compassSamples.shift();
    let sinSum = 0;
    let cosSum = 0;
    compassSamples.forEach((d) => {
      const r = (d * Math.PI) / 180;
      sinSum += Math.sin(r);
      cosSum += Math.cos(r);
    });
    return normalizeAngle((Math.atan2(sinSum, cosSum) * 180) / Math.PI);
  }

  function getMapBearing() {
    return normalizeAngle(map.getBearing());
  }

  function getQuadranteReferenceHeading() {
    const drawerOpen = document.getElementById("azGeoDrawerBody")?.classList.contains("is-open");
    const incOpen = incOverlay?.classList.contains("is-open");
    if ((drawerOpen || incOpen) && map) {
      return getMapBearing();
    }
    return stableHeading;
  }

  function applyMapHeadingUp(headingDeg, forceInstant) {
    if (!forceInstant && (Date.now() < userTouchPauseUntil || Date.now() < handlingFreezeUntil || isHeadingManuallyLocked)) {
      return;
    }
    const clean = normalizeAngle(headingDeg);
    const diffFromLast = Math.abs(shortestAngleDiff(lastMapBearingApplied, clean));
    if (!forceInstant && diffFromLast < 14) return;

    lastMapBearingApplied = clean;
    if (forceInstant) {
      map.stop();
      map.setBearing(clean);
    } else {
      map.easeTo({
        bearing: clean,
        duration: 450,
        easing: (t) => 1 - Math.pow(1 - t, 3)
      });
    }
    if (northBadge) {
      northBadge.style.transform = `rotate(${-clean}deg)`;
    }
  }

  function isMovingCourseActive() {
    const recentlyMoved = Date.now() - lastMoveTimestamp < 7000 && computedGpsCourse !== null;
    const hasSpeed =
      lastSpeed >= 1.2 &&
      (computedGpsCourse !== null || (typeof lastGpsHeading === "number" && !Number.isNaN(lastGpsHeading)));
    return recentlyMoved || hasSpeed;
  }

  function getTargetHeading() {
    if (isMovingCourseActive()) {
      if (typeof lastGpsHeading === "number" && !Number.isNaN(lastGpsHeading) && lastSpeed >= 1.4) {
        return normalizeAngle(lastGpsHeading);
      }
      if (computedGpsCourse !== null) {
        return normalizeAngle(computedGpsCourse);
      }
    }
    return normalizeAngle(rawCompassHeading + getNativeScreenAngle() + getActiveCalibrationOffset());
  }

  function refreshStabilizedHeading(forceSnap) {
    if (!forceSnap && (isHeadingManuallyLocked || Date.now() < handlingFreezeUntil)) {
      updateCalibratorReadout();
      return;
    }

    const moving = isMovingCourseActive();
    const target = getTargetHeading();
    const diff = shortestAngleDiff(stableHeading, target);
    const deadzone = moving ? 3 : 18;

    if (forceSnap || Math.abs(diff) >= deadzone) {
      const factor = forceSnap ? 1 : moving ? 0.55 : 0.4;
      stableHeading = normalizeAngle(stableHeading + diff * factor);
      if (headingUpMode) {
        applyMapHeadingUp(stableHeading, !!forceSnap);
      }
      updateDirectionalIcons(!!forceSnap);
    }
    updateCalibratorReadout();
  }

  function handleScreenOrientationChange() {
    compassSamples = [];
    handlingFreezeUntil = Date.now() + 1800;
    updateCalibratorReadout();
    instantResizeMap();
    setTimeout(() => {
      instantResizeMap();
      if (Date.now() >= handlingFreezeUntil) {
        refreshStabilizedHeading(true);
      }
    }, 1850);
  }
  window.addEventListener("orientationchange", handleScreenOrientationChange);
  if (window.screen && window.screen.orientation && typeof window.screen.orientation.addEventListener === "function") {
    window.screen.orientation.addEventListener("change", handleScreenOrientationChange);
  }

  function buildArrowSvg(color, deg, size) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" style="transform: rotate(${deg}deg); display:block; filter: drop-shadow(0 1px 4px rgba(0,0,0,0.95));">
        <polygon points="16,2 27,28 16,22 5,28" fill="${color}" stroke="#0D0D0D" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    `;
  }

  function buildPinSvg(color) {
    return `
      <svg width="26" height="32" viewBox="0 0 26 32" style="display:block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.85));">
        <path d="M13 1C6.9 1 2 5.9 2 12c0 8.2 11 19 11 19s11-10.8 11-19c0-6.1-4.9-11-11-11z" fill="${color}" stroke="#0D0D0D" stroke-width="2"/>
        <circle cx="13" cy="12" r="4" fill="#0D0D0D"/>
      </svg>
    `;
  }

  function createFluidGpsMarker(lng, lat) {
    gpsArrowEl = document.createElement("div");
    gpsArrowEl.className = "az-smooth-marker";
    gpsArrowEl.style.cursor = "pointer";
    gpsArrowEl.style.pointerEvents = "auto";
    gpsArrowEl.title = "Toque para mudar seu status";
    gpsArrowEl.innerHTML = `
      <div class="az-smooth-pulse"></div>
      <svg class="az-smooth-svg" width="30" height="30" viewBox="0 0 32 32">
        <polygon points="16,2 27,28 16,22 5,28" fill="${arrowColor}" stroke="#0D0D0D" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      <div class="az-self-status-badge" id="azSelfStatusMapBadge" style="display:none;"></div>
    `;
    gpsPulseEl = gpsArrowEl.querySelector(".az-smooth-pulse");
    gpsArrowSvg = gpsArrowEl.querySelector(".az-smooth-svg");
    gpsArrowPoly = gpsArrowEl.querySelector("polygon");

    gpsArrowEl.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (typeof window.azOpenMyStatusModal === "function") window.azOpenMyStatusModal();
    });

    gpsMarker = new maplibregl.Marker({ element: gpsArrowEl, anchor: "center" })
      .setLngLat([lng, lat])
      .addTo(map);
  }

  window.azUpdateSelfStatusBadge = function (label, colHex) {
    const b = document.getElementById("azSelfStatusMapBadge");
    if (!b) return;
    if (!label || label === "EM PATRULHA") {
      b.style.display = "none";
      b.textContent = "";
      return;
    }
    b.textContent = label;
    b.style.borderColor = colHex || "#C5A869";
    b.style.display = "inline-block";
  };

  window.azimuteApplyMyArrowColor = function (hex) {
    if (!hex) return;
    arrowColor = hex;
    try { localStorage.setItem("az_geo_arrow_color", hex); } catch (_) {}
    if (gpsArrowPoly) gpsArrowPoly.setAttribute("fill", hex);
    if (radarArrowSvg) radarArrowSvg.setAttribute("fill", hex);
    if (gpsPulseEl) {
      gpsPulseEl.style.borderColor = hex;
      gpsPulseEl.style.background = hex + "38";
    }
  };
  (function syncInitialGroupColor() {
    const tacMap = { azul: "#3B82F6", verde: "#22C55E", laranja: "#F97316", ciano: "#06B6D4", roxo: "#C084FC", amarelo: "#EAB308", safira: "#6366F1", branco: "#F8FAFC" };
    const cid = localStorage.getItem("az_tac_my_color");
    if (cid && tacMap[cid]) {
      window.azimuteApplyMyArrowColor(tacMap[cid]);
    }
  })();

  function startFluidMarkerLoop() {
    if (animLoopRunning) return;
    animLoopRunning = true;

    function tick(now) {
      if (gpsMarker && animCurrentPos && animTargetPos) {
        const elapsed = now - animPosStartTime;
        const t = Math.min(1, Math.max(0, elapsed / animPosDuration));
        const eased = 1 - Math.pow(1 - t, 3);

        const curLat = animStartPos[0] + (animTargetPos[0] - animStartPos[0]) * eased;
        const curLng = animStartPos[1] + (animTargetPos[1] - animStartPos[1]) * eased;
        animCurrentPos = [curLat, curLng];

        gpsMarker.setLngLat([curLng, curLat]);
        if (radarGpsMarker) {
          radarGpsMarker.setLngLat([curLng, curLat]);
        }
      }

      if (gpsArrowSvg) {
        const targetVisual = normalizeAngle(stableHeading - getMapBearing());
        const diff = shortestAngleDiff(animVisualAngle, targetVisual);
        if (Math.abs(diff) > 0.8) {
          animVisualAngle = normalizeAngle(animVisualAngle + diff * 0.18);
          gpsArrowSvg.style.transform = `rotate(${animVisualAngle.toFixed(1)}deg)`;
        }
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function setFluidMarkerTarget(lat, lng) {
    const now = performance.now();
    if (!animCurrentPos) {
      animCurrentPos = [lat, lng];
      animStartPos = [lat, lng];
      animTargetPos = [lat, lng];
      animPosStartTime = now;
    } else {
      const distKm = calcDistanceKm(animCurrentPos[0], animCurrentPos[1], lat, lng);
      if (distKm > 0.25) {
        animCurrentPos = [lat, lng];
        animStartPos = [lat, lng];
        animTargetPos = [lat, lng];
        animPosStartTime = now;
      } else {
        animStartPos = [animCurrentPos[0], animCurrentPos[1]];
        animTargetPos = [lat, lng];
        animPosStartTime = now;
        animPosDuration = distKm > 0.03 ? 850 : 620;
      }
    }

    if (!gpsMarker) {
      createFluidGpsMarker(lng, lat);
    }
    if (radarMap && !radarGpsMarker) {
      const rEl = document.createElement("div");
      rEl.style.width = "24px";
      rEl.style.height = "24px";
      rEl.innerHTML = buildArrowSvg(arrowColor, 0, 24);
      radarArrowSvg = rEl.querySelector("polygon");
      radarGpsMarker = new maplibregl.Marker({ element: rEl, anchor: "center" })
        .setLngLat([lng, lat])
        .addTo(radarMap);
    }

    startFluidMarkerLoop();
  }

  function updateDirectionalIcons(forceQuad) {
    const deg = stableHeading;
    const refDeg = getQuadranteReferenceHeading();

    if (gpsArrowPoly) {
      gpsArrowPoly.setAttribute("fill", arrowColor);
    }
    if (gpsPulseEl) {
      gpsPulseEl.style.borderColor = arrowColor;
    }
    if (radarArrowSvg) {
      radarArrowSvg.setAttribute("fill", arrowColor);
    }
    if (radarMap && radarMap.isStyleLoaded()) {
      radarMap.setBearing(deg);
    }

    if (incTelemetryEl) {
      const gpsTxt = typeof lastAccuracy === "number" ? `GPS ±${Math.round(lastAccuracy)}m` : "GPS ATIVO";
      incTelemetryEl.textContent = `${String(Math.round(refDeg)).padStart(3, "0")}° • ${gpsTxt}`;
    }

    if (terrainHeaderInfo) {
      const srcTag = isMovingCourseActive() ? "GPS RUMO" : hasAbsoluteCompass ? "BÚSSOLA" : "MAPA";
      terrainHeaderInfo.textContent = `ESPECTRO • ALTIMETRIA ${String(Math.round(refDeg)).padStart(3, "0")}° (${srcTag})`;
    }

    recomputeQuadranteSectors(!!forceQuad);
  }

  function ensureSatelliteAnd3dLayers(targetMap, isSat) {
    if (!targetMap || !targetMap.isStyleLoaded()) return;
    const style = targetMap.getStyle();
    if (!style || !Array.isArray(style.layers)) return;

    const firstSymbol = style.layers.find((l) => l.type === "symbol");
    const beforeId = firstSymbol ? firstSymbol.id : undefined;

    if (isSat) {
      try {
        if (!targetMap.getSource("az-sat-src")) {
          targetMap.addSource("az-sat-src", {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            maxzoom: 18
          });
        }
        if (!targetMap.getLayer("az-sat-layer")) {
          targetMap.addLayer(
            {
              id: "az-sat-layer",
              type: "raster",
              source: "az-sat-src",
              paint: {
                "raster-opacity": 1,
                "raster-contrast": 0.22,
                "raster-saturation": 0.14,
                "raster-brightness-min": 0.03,
                "raster-brightness-max": 0.94,
                "raster-fade-duration": 0
              }
            },
            beforeId
          );
        }
        style.layers.forEach((l) => {
          if (l.id !== "az-sat-layer" && (l.type === "fill" || l.type === "background" || l.type === "raster")) {
            try { targetMap.setLayoutProperty(l.id, "visibility", "none"); } catch (e) {}
          }
        });
      } catch (e) {}
    }

    // Extrusao 3D volumetrica para edificacoes apenas em zoom alto (60fps)
    try {
      const bldLayer = style.layers.find(
        (l) => (l["source-layer"] || "").toLowerCase().includes("building") && l.source
      );
      if (bldLayer && !targetMap.getLayer("az-3d-buildings")) {
        targetMap.addLayer(
          {
            id: "az-3d-buildings",
            source: bldLayer.source,
            "source-layer": bldLayer["source-layer"],
            type: "fill-extrusion",
            minzoom: 15.8,
            paint: {
              "fill-extrusion-color": isSat ? "#C5A869" : "#161616",
              "fill-extrusion-height": ["coalesce", ["get", "render_height"], ["get", "height"], 10],
              "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
              "fill-extrusion-opacity": isSat ? 0.32 : 0.72
            }
          },
          beforeId
        );
      }
    } catch (e) {}
  }

  function enhanceMapReadability(targetMap, themeMode) {
    const style = targetMap.getStyle();
    if (!style || !Array.isArray(style.layers)) return;
    const isDark = themeMode === "dark";
    const isSat = themeMode === "satellite";

    if (isSat) {
      ensureSatelliteAnd3dLayers(targetMap, true);
    }

    style.layers.forEach((layer) => {
      const id = (layer.id || "").toLowerCase();
      const srcLayer = (layer["source-layer"] || "").toLowerCase();

      if (isDark) {
        if (layer.type === "background") {
          try { targetMap.setPaintProperty(layer.id, "background-color", "#0D0D0D"); } catch (e) {}
        } else if (layer.type === "fill") {
          if (srcLayer.includes("water") || id.includes("water") || id.includes("river") || id.includes("lake")) {
            try { targetMap.setPaintProperty(layer.id, "fill-color", "#0F2942"); } catch (e) {}
          } else if (
            srcLayer.includes("park") ||
            srcLayer.includes("landcover") ||
            id.includes("park") ||
            id.includes("wood") ||
            id.includes("forest") ||
            id.includes("grass") ||
            id.includes("green")
          ) {
            try {
              targetMap.setPaintProperty(layer.id, "fill-color", "#142E1D");
              targetMap.setPaintProperty(layer.id, "fill-opacity", 0.85);
            } catch (e) {}
          } else if (srcLayer.includes("building") || id.includes("building")) {
            try { targetMap.setPaintProperty(layer.id, "fill-color", "#161616"); } catch (e) {}
          }
        } else if (layer.type === "line") {
          if (srcLayer.includes("water") || id.includes("water") || id.includes("river") || id.includes("stream")) {
            try { targetMap.setPaintProperty(layer.id, "line-color", "#1D4ED8"); } catch (e) {}
          } else if (
            srcLayer.includes("transportation") ||
            id.includes("road") ||
            id.includes("street") ||
            id.includes("highway")
          ) {
            try {
              if (id.includes("casing")) {
                targetMap.setPaintProperty(layer.id, "line-color", "#080808");
              } else if (id.includes("motorway") || id.includes("trunk") || id.includes("primary")) {
                targetMap.setPaintProperty(layer.id, "line-color", "#C5A869");
              } else if (id.includes("secondary") || id.includes("tertiary")) {
                targetMap.setPaintProperty(layer.id, "line-color", "#9CA3AF");
              } else {
                targetMap.setPaintProperty(layer.id, "line-color", "#6B7280");
              }
            } catch (e) {}
          }
        }
      } else if (isSat && layer.type === "line") {
        if (srcLayer.includes("transportation") || id.includes("road") || id.includes("street") || id.includes("highway")) {
          try {
            if (id.includes("casing")) {
              targetMap.setPaintProperty(layer.id, "line-color", "#080808");
              targetMap.setPaintProperty(layer.id, "line-opacity", 0.85);
            } else if (id.includes("motorway") || id.includes("trunk") || id.includes("primary")) {
              targetMap.setPaintProperty(layer.id, "line-color", "#FBBF24");
              targetMap.setPaintProperty(layer.id, "line-opacity", 0.92);
              targetMap.setPaintProperty(layer.id, "line-width", ["interpolate", ["linear"], ["zoom"], 11, 2.2, 15, 4.2, 18, 6.2]);
            } else {
              targetMap.setPaintProperty(layer.id, "line-color", "#F8FAFC");
              targetMap.setPaintProperty(layer.id, "line-opacity", 0.72);
            }
          } catch (e) {}
        }
      } else if (!isSat && layer.type === "line") {
        if (srcLayer.includes("transportation") || id.includes("road") || id.includes("street") || id.includes("highway")) {
          try {
            if (id.includes("casing")) targetMap.setPaintProperty(layer.id, "line-color", "#64748B");
            else if (id.includes("motorway") || id.includes("trunk") || id.includes("primary")) targetMap.setPaintProperty(layer.id, "line-color", "#F59E0B");
            else targetMap.setPaintProperty(layer.id, "line-color", "#FFFFFF");
          } catch (e) {}
        }
      }

      if (layer.type === "raster" && id !== "az-sat-layer") {
        try { targetMap.setLayoutProperty(layer.id, "visibility", "none"); } catch (e) {}
      }

      if (layer.type === "symbol") {
        const isRoadText =
          srcLayer.includes("transportation_name") ||
          id.includes("highway") ||
          id.includes("road") ||
          id.includes("street") ||
          id.includes("transport");

        const isMajor =
          id.includes("motorway") ||
          id.includes("trunk") ||
          id.includes("primary") ||
          id.includes("major");

        try {
          targetMap.setLayoutProperty(layer.id, "visibility", "visible");
          if (isSat) {
            targetMap.setPaintProperty(layer.id, "text-color", isMajor ? "#FDE047" : "#FFFFFF");
            targetMap.setPaintProperty(layer.id, "text-halo-color", "#000000");
            targetMap.setPaintProperty(layer.id, "text-halo-width", 2.8);
            targetMap.setPaintProperty(layer.id, "text-halo-blur", 0);
            targetMap.setPaintProperty(layer.id, "text-opacity", 1);
          } else if (isDark) {
            targetMap.setPaintProperty(layer.id, "text-color", isMajor ? "#C5A869" : "#F3F4F6");
            targetMap.setPaintProperty(layer.id, "text-halo-color", "#0D0D0D");
            targetMap.setPaintProperty(layer.id, "text-halo-width", 2.6);
            targetMap.setPaintProperty(layer.id, "text-halo-blur", 0);
            targetMap.setPaintProperty(layer.id, "text-opacity", 1);
          } else {
            targetMap.setPaintProperty(layer.id, "text-color", "#0D0D0D");
            targetMap.setPaintProperty(layer.id, "text-halo-color", "#FFFFFF");
            targetMap.setPaintProperty(layer.id, "text-halo-width", 2.6);
            targetMap.setPaintProperty(layer.id, "text-halo-blur", 0);
            targetMap.setPaintProperty(layer.id, "text-opacity", 1);
          }

          if (isRoadText) {
            targetMap.setLayoutProperty(layer.id, "text-size", [
              "interpolate",
              ["linear"],
              ["zoom"],
              11, 12.5,
              14, 14.5,
              17, 17.5
            ]);
          }
        } catch (e) {}
      }
    });

    if (!isSat) {
      ensureSatelliteAnd3dLayers(targetMap, false);
    }
  }

  function ensureRouteLayers(targetMap, srcId, outlineId, lineId, lineWidth) {
    if (!targetMap || !targetMap.isStyleLoaded()) return false;
    try {
      if (!targetMap.getSource(srcId)) {
        targetMap.addSource(srcId, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }
      if (outlineId && !targetMap.getLayer(outlineId)) {
        targetMap.addLayer({
          id: outlineId,
          type: "line",
          source: srcId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": mapTheme === "light" ? "#1E3A8A" : "#0B1120",
            "line-width": lineWidth + 4.5,
            "line-opacity": 0.95
          }
        });
      }
      if (!targetMap.getLayer(lineId)) {
        targetMap.addLayer({
          id: lineId,
          type: "line",
          source: srcId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": mapTheme === "light" ? "#2563EB" : "#38BDF8",
            "line-width": lineWidth,
            "line-opacity": 1
          }
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function ensureLocalLayers() {
    if (!map.isStyleLoaded()) return false;
    try {
      if (!map.getSource("az-local-src")) {
        map.addSource("az-local-src", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }
      if (!map.getLayer("az-local-circles")) {
        map.addLayer({
          id: "az-local-circles",
          type: "circle",
          source: "az-local-src",
          filter: ["!=", ["get", "category"], "hospitais"],
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 5.5, 16, 8.5],
            "circle-color": ["get", "color"],
            "circle-stroke-color": "#0D0D0D",
            "circle-stroke-width": 2
          }
        });

        if (!map.getLayer("az-local-hosp-circles")) {
          map.addLayer({
            id: "az-local-hosp-circles",
            type: "circle",
            source: "az-local-src",
            filter: ["==", ["get", "category"], "hospitais"],
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 11, 8.5, 16, 11.5],
              "circle-color": "#EF4444",
              "circle-stroke-color": "#FFFFFF",
              "circle-stroke-width": 2
            }
          });
        }

        if (!map.getLayer("az-local-hosp-h")) {
          try {
            map.addLayer({
              id: "az-local-hosp-h",
              type: "symbol",
              source: "az-local-src",
              filter: ["==", ["get", "category"], "hospitais"],
              layout: {
                "text-field": "H",
                "text-size": ["interpolate", ["linear"], ["zoom"], 11, 9.5, 16, 13],
                "text-anchor": "center",
                "text-allow-overlap": true,
                "text-ignore-placement": true
              },
              paint: {
                "text-color": "#FFFFFF"
              }
            });
          } catch (_) {}
        }

        map.addLayer({
          id: "az-local-labels",
          type: "symbol",
          source: "az-local-src",
          minzoom: 13.5,
          layout: {
            "text-field": ["get", "shortName"],
            "text-size": 11,
            "text-offset": [0, 1.45],
            "text-anchor": "top",
            "text-max-width": 12
          },
          paint: {
            "text-color": mapTheme === "light" ? "#0D0D0D" : "#F2F0EA",
            "text-halo-color": mapTheme === "light" ? "#FFFFFF" : "#0D0D0D",
            "text-halo-width": 2.2
          }
        });

        ["az-local-circles", "az-local-hosp-circles"].forEach((layerId) => {
          map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "";
          });
          map.on("click", layerId, (e) => {
            if (!e.features || !e.features.length) return;
            const f = e.features[0];
            const [lng, lat] = f.geometry.coordinates;
            const props = f.properties || {};
            new maplibregl.Popup({ offset: 14 })
              .setLngLat([lng, lat])
              .setHTML(buildPopupHtml(props.name || "Ponto", props.subtitle || "", lat, lng, null, props.category || "extra"))
              .addTo(map);
          });
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function updateRouteSources() {
    const geojson = {
      type: "FeatureCollection",
      features: activeRouteCoords.length >= 2
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: activeRouteCoords.map(([lat, lng]) => [lng, lat])
              }
            }
          ]
        : []
    };

    if (ensureRouteLayers(map, "az-route-src", "az-route-outline", "az-route-line", 6)) {
      map.getSource("az-route-src").setData(geojson);
    } else {
      map.once("idle", updateRouteSources);
    }

    if (radarMap) {
      if (ensureRouteLayers(radarMap, "az-radar-route-src", null, "az-radar-route-line", 4.5)) {
        radarMap.getSource("az-radar-route-src").setData(geojson);
      } else {
        radarMap.once("idle", updateRouteSources);
      }
    }
  }

  function setupCustomMapLayers() {
    const curStyle = map.getStyle && map.getStyle();
    if (curStyle && map._azLastSetupStyle === curStyle) return;
    if (curStyle) map._azLastSetupStyle = curStyle;
    enhanceMapReadability(map, mapTheme);
    ensureLocalLayers();
    ensureRouteLayers(map, "az-route-src", "az-route-outline", "az-route-line", 6);
    if (activeRouteCoords.length) updateRouteSources();
    refreshAllMapMarkersLayer();
  }

  map.on("style.load", setupCustomMapLayers);
  map.on("idle", () => {
    if (lastPos && (lastQuadStreetSource === "" || lastQuadStreetSource === "photon")) {
      const fromTiles = extractStreetsFromMapLibre(lastPos[0], lastPos[1]);
      if (fromTiles.list.length >= 2) {
        applyStreetsListToQuadrante(lastPos[0], lastPos[1], fromTiles, "vector");
      }
    }
  });
  if (map.isStyleLoaded()) setupCustomMapLayers();

  if (radarMap) {
    radarMap.on("style.load", () => {
      enhanceMapReadability(radarMap, mapTheme);
      ensureRouteLayers(radarMap, "az-radar-route-src", null, "az-radar-route-line", 4.5);
      if (activeRouteCoords.length) updateRouteSources();
    });
  }

  function syncThemeButtons() {
    if (!themesWrap) return;
    themesWrap.querySelectorAll("button[data-theme]").forEach((b) => {
      const match = b.getAttribute("data-theme") === mapTheme;
      b.classList.toggle("active", match);
      b.classList.toggle("subtle", !match);
    });
  }
  syncThemeButtons();

  window.azApplyMapTheme = function (nextTheme) {
    if (!nextTheme || nextTheme === mapTheme) return;
    mapTheme = nextTheme;
    localStorage.setItem("az_geo_map_theme", mapTheme);
    if (typeof syncThemeButtons === "function") syncThemeButtons();
    if (typeof window.azFlashMapLayerTransition === "function") window.azFlashMapLayerTransition();
    map.setStyle(STYLE_URLS[mapTheme] || STYLE_URLS.dark);
    map.once("style.load", () => {
      if (mapTheme === "mono" && typeof window.azToggleMonoTechMap === "function") {
        tac.monoTechMode = false;
        window.azToggleMonoTechMap();
      } else {
        tac.monoTechMode = false;
      }
      if (typeof window.azimuteRefreshGrgTheme === "function") window.azimuteRefreshGrgTheme();
    });
    if (radarMap) {
      radarMap.setStyle(STYLE_URLS[mapTheme] || STYLE_URLS.dark);
    }
  };
  window.azToggleMapLightDark = function () {
    const next = (mapTheme === "dark") ? "light" : "dark";
    window.azApplyMapTheme(next);
    if (typeof showToast === "function") {
      showToast(next === "dark" ? "Modo Escuro do Mapa ATIVADO" : "Modo Claro do Mapa ATIVADO", 2000);
    }
  };
  window.azEnsureReducedLightMap = function () {
    if (mapTheme !== "light" && !tac.satMode) {
      window.azApplyMapTheme("light");
    }
  };

  if (themesWrap) {
    themesWrap.querySelectorAll("button[data-theme]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.azApplyMapTheme(btn.getAttribute("data-theme") || "dark");
      });
    });
  }

  function classifyRecordCategory(rawObj, fallbackCat) {
    const props = rawObj.properties || rawObj;
    const blob = [
      props.categoria,
      props.tipo,
      props.type,
      props.grupo,
      props.nome,
      props.name,
      props.unidade,
      props.titulo
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (
      blob.includes("hospital") ||
      blob.includes("hosp.") ||
      /\bhosp\b/.test(blob) ||
      blob.includes("upa") ||
      blob.includes("pronto socorro") ||
      blob.includes("pronto-socorro") ||
      blob.includes("policlinica") ||
      blob.includes("policlínica") ||
      blob.includes("maternidade") ||
      blob.includes("saude") ||
      blob.includes("saúde") ||
      blob.includes("hps")
    ) {
      return "hospitais";
    }
    if (blob.includes("bsc") || blob.includes("base comunit") || blob.includes("base de segur")) {
      return "bscs";
    }
    if (
      blob.includes("deplan") ||
      blob.includes("delegacia") ||
      blob.includes("ceflan") ||
      blob.includes("policia civil") ||
      blob.includes("polícia civil")
    ) {
      return "deplans";
    }
    if (
      blob.includes("bpm") ||
      blob.includes("cia") ||
      blob.includes("batalhao") ||
      blob.includes("batalhão") ||
      blob.includes("pelotao") ||
      blob.includes("pelotão") ||
      blob.includes("rpm") ||
      blob.includes("rotam") ||
      blob.includes("bope") ||
      blob.includes("gepar")
    ) {
      return "unidades";
    }
    return fallbackCat || "unidades";
  }

  function extractClassifiedRecords(raw, defaultCat) {
    const buckets = { unidades: [], hospitais: [], bscs: [], deplans: [] };
    const seen = new Set();

    function walk(node, hintCat) {
      if (!node || typeof node !== "object" || seen.has(node)) return;
      seen.add(node);

      if (Array.isArray(node)) {
        node.forEach((item) => walk(item, hintCat));
        return;
      }

      const lat = parseFloat(
        node.lat ?? node.latitude ?? node.y ?? node.coordenadas?.lat ?? node.coordenadas?.latitude ?? node.geometry?.coordinates?.[1]
      );
      const lng = parseFloat(
        node.lng ?? node.lon ?? node.longitude ?? node.x ?? node.coordenadas?.lng ?? node.coordenadas?.lon ?? node.coordenadas?.longitude ?? node.geometry?.coordinates?.[0]
      );

      if (!Number.isNaN(lat) && !Number.isNaN(lng) && Math.abs(lat) > 1 && Math.abs(lng) > 1) {
        const props = node.properties || node;
        const name = String(
          props.nome || props.name || props.unidade || props.titulo || props.hospital || props.bsc || props.deplan || props.cia || ""
        ).trim();
        const addr = String(props.endereco || props.address || props.logradouro || props.bairro || props.municipio || "").trim();
        const phone = String(props.telefone || props.tel || props.fone || props.contato || "").trim();
        const sub = [addr, phone].filter(Boolean).join(" • ");

        if (name) {
          const cat = classifyRecordCategory(node, hintCat);
          if (buckets[cat]) {
            buckets[cat].push({ name, subtitle: sub, lat, lng });
          }
        }
      }

      Object.entries(node).forEach(([k, v]) => {
        const kl = k.toLowerCase();
        let nextHint = hintCat;
        if (kl.includes("hosp") || kl.includes("upa") || kl.includes("saude")) nextHint = "hospitais";
        else if (kl.includes("bsc")) nextHint = "bscs";
        else if (kl.includes("deplan") || kl.includes("deleg")) nextHint = "deplans";
        else if (kl.includes("unid") || kl.includes("bpm")) nextHint = "unidades";
        walk(v, nextHint);
      });
    }

    walk(raw, defaultCat);
    return buckets;
  }

  function dedupeLayerPoints(arr) {
    const mapUnique = new Map();
    arr.forEach((p) => {
      const key = `${p.name.toLowerCase()}_${p.lat.toFixed(4)}_${p.lng.toFixed(4)}`;
      if (!mapUnique.has(key)) mapUnique.set(key, p);
    });
    return Array.from(mapUnique.values());
  }

  function updateLayerCountersUi() {
    const cUni = document.getElementById("azCntUnidades");
    const cHosp = document.getElementById("azCntHospitais");
    const cBsc = document.getElementById("azCntBscs");
    const cDep = document.getElementById("azCntDeplans");
    if (cUni) cUni.textContent = String(datasetPoints.unidades.length);
    if (cHosp) cHosp.textContent = String(datasetPoints.hospitais.length);
    if (cBsc) cBsc.textContent = String(datasetPoints.bscs.length);
    if (cDep) cDep.textContent = String(datasetPoints.deplans.length);
  }

  function refreshAllMapMarkersLayer() {
    if (!ensureLocalLayers()) {
      map.once("idle", refreshAllMapMarkersLayer);
      return;
    }

    const merged = [];
    ["unidades", "hospitais", "bscs", "deplans"].forEach((cat) => {
      if (!activeLayers[cat]) return;
      const meta = LAYER_META[cat];
      datasetPoints[cat].forEach((p) => {
        merged.push({
          ...p,
          category: cat,
          color: meta.color
        });
      });
    });

    localPoints.forEach((p) => {
      if (typeof p.lat === "number" && typeof p.lng === "number") {
        const cat = classifyRecordCategory(p, p.category || "extra");
        const meta = LAYER_META[cat] || LAYER_META.extra;
        merged.push({
          name: p.name || "Ponto",
          subtitle: p.subtitle || "",
          lat: p.lat,
          lng: p.lng,
          category: cat,
          color: p.color || meta.color
        });
      }
    });

    const features = merged.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: {
        name: p.name,
        shortName: p.name.length > 26 ? p.name.slice(0, 24) + "…" : p.name,
        subtitle: p.subtitle || "",
        category: p.category,
        color: p.color
      }
    }));

    map.getSource("az-local-src").setData({ type: "FeatureCollection", features });
    ["az-local-circles", "az-local-hosp-circles", "az-local-hosp-h", "az-local-labels"].forEach((lid) => {
      try {
        if (map.getLayer(lid)) {
          map.setLayoutProperty(lid, "visibility", "visible");
          map.moveLayer(lid);
        }
      } catch (_) {}
    });
  }

  function mergeBucketsIntoDatasets(buckets) {
    ["unidades", "hospitais", "bscs", "deplans"].forEach((cat) => {
      if (buckets[cat] && buckets[cat].length) {
        datasetPoints[cat] = dedupeLayerPoints([...datasetPoints[cat], ...buckets[cat]]);
      }
    });
  }

  async function loadRepositoryGeoDatasets() {
    const sources = [
      { file: "dados.json", cat: "unidades" },
      { file: "unidades_1bpm.json", cat: "unidades" },
      { file: "batalhao_22.json", cat: "unidades" },
      { file: "hospitais.json", cat: "hospitais" },
      { file: "hospitais_1bpm.json", cat: "hospitais" },
      { file: "saude.json", cat: "hospitais" },
      { file: "bsc.json", cat: "bscs" },
      { file: "bsc_1bpm.json", cat: "bscs" },
      { file: "deplan.json", cat: "deplans" },
      { file: "deplan_1bpm.json", cat: "deplans" },
      { file: "apoio.json", cat: "deplans" }
    ];

    await Promise.all(
      sources.map(async ({ file, cat }) => {
        try {
          const res = await fetch(file);
          if (!res.ok) return;
          const json = await res.json();
          const buckets = extractClassifiedRecords(json, cat);
          mergeBucketsIntoDatasets(buckets);
        } catch (e) {}
      })
    );

    try {
      if (typeof AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS !== "undefined" && Array.isArray(AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS)) {
        mergeBucketsIntoDatasets(extractClassifiedRecords(AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS, "hospitais"));
      }
      if (typeof AZIMUTE_HOSPITAIS_RMBH !== "undefined" && Array.isArray(AZIMUTE_HOSPITAIS_RMBH)) {
        mergeBucketsIntoDatasets(extractClassifiedRecords(AZIMUTE_HOSPITAIS_RMBH, "hospitais"));
      }
      if (typeof AZIMUTE_UNIDADES_POLICIAIS !== "undefined" && Array.isArray(AZIMUTE_UNIDADES_POLICIAIS)) {
        mergeBucketsIntoDatasets(extractClassifiedRecords(AZIMUTE_UNIDADES_POLICIAIS, "unidades"));
      }
      if (typeof AZIMUTE_DB !== "undefined" && AZIMUTE_DB) {
        mergeBucketsIntoDatasets(extractClassifiedRecords(AZIMUTE_DB, "unidades"));
      }
      if (typeof UNIDADES_1RPM !== "undefined" && UNIDADES_1RPM && Object.keys(UNIDADES_1RPM).length) {
        mergeBucketsIntoDatasets(extractClassifiedRecords(UNIDADES_1RPM, "unidades"));
      }
      Object.keys(window).forEach((k) => {
        if (!/hospital|unidade|bpm|bsc|deplan|saude|dados|apoio/i.test(k)) return;
        const val = window[k];
        if (val && typeof val === "object" && (Array.isArray(val) || Object.keys(val).length)) {
          const buckets = extractClassifiedRecords(val, "unidades");
          mergeBucketsIntoDatasets(buckets);
        }
      });
    } catch (e) {}

    updateLayerCountersUi();
    refreshAllMapMarkersLayer();
  }
  window.azimuteGetGeoDatasets = () => datasetPoints;
  window.azimuteRefreshGeoDatasets = loadRepositoryGeoDatasets;
  loadRepositoryGeoDatasets();

  const plusFiltersBtn = document.getElementById("azGeoPlusFiltersBtn");
  if (plusFiltersBtn && layersBox) {
    plusFiltersBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const open = layersBox.classList.toggle("is-open");
      plusFiltersBtn.classList.toggle("is-active", open);
    });
  }
  if (layersToggleBtn && layersBox) {
    layersToggleBtn.addEventListener("click", () => {
      const open = layersBox.classList.toggle("is-open");
      layersToggleBtn.classList.toggle("active", open);
      layersToggleBtn.classList.toggle("subtle", !open);
    });
  }

  if (layerChipsWrap) {
    layerChipsWrap.querySelectorAll("button[data-layer]").forEach((chip) => {
      const cat = chip.getAttribute("data-layer");
      chip.classList.toggle("is-on", !!activeLayers[cat]);
      chip.addEventListener("click", () => {
        activeLayers[cat] = !activeLayers[cat];
        localStorage.setItem(`az_layer_${cat}`, activeLayers[cat] ? "1" : "0");
        chip.classList.toggle("is-on", activeLayers[cat]);
        refreshAllMapMarkersLayer();
      });
    });
  }

  function setQuadFetchIndicator(state, text) {
    const badge = document.getElementById("azQuadFetchBadge");
    if (!badge) return;
    if (state === "searching") {
      badge.className = "az-quad-inline-hint az-quad-searching";
      badge.innerHTML = `<span class="az-quad-pulse-dot"></span><span>${text || "Buscando..."}</span>`;
    } else if (state === "error") {
      badge.className = "az-quad-inline-hint az-quad-searching";
      badge.innerHTML = `<span class="az-quad-pulse-dot" style="background:#F87171;"></span><span>${text || "Reconectando..."}</span>`;
    } else {
      badge.className = "az-quad-inline-hint";
      badge.textContent = text || "PRONTO";
    }
  }

  function ensureQuadranteCardMounted() {
    if (document.getElementById("azQuadInlineCard")) return;

    const card = document.createElement("div");
    card.id = "azQuadInlineCard";
    card.className = "az-quad-inline-card";
    card.title = "Toque para abrir ESPECTRO (malha altimetrica 3D das vias)";
    card.innerHTML = `
      <div class="az-quad-inline-head">
        <span class="az-quad-inline-title">ORBE • 360° (130M)</span>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" id="azOrbeRecenterBtn" class="az-orbe-sonar-btn" title="Emitir pulso e recentralizar ORBE">
            <span class="az-orbe-sonar-dot"></span>
            <span>PULSO</span>
          </button>
          <span class="az-quad-inline-hint az-quad-searching" id="azQuadFetchBadge">
            <span class="az-quad-pulse-dot"></span><span>Buscando...</span>
          </span>
        </div>
      </div>
      <div id="azQuadCornerBanner" class="az-quad-corner-banner"></div>
      <div class="az-quad-ring-wrap">
        <canvas id="azQuadRingCanvas"></canvas>
        <div class="az-quad-ring-legend">
          <span><i style="background:#4ADE80;"></i> Aclive</span>
          <span><i style="background:#C5A869;"></i> Nível</span>
          <span><i style="background:#F87171;"></i> Declive</span>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target && e.target.closest("#azOrbeRecenterBtn")) return;
      window.azimuteToggleTerrainModal(true);
    });

    const hudStreetEl = document.getElementById("hudCurrentStreet");
    if (hudStreetEl) {
      const innerCard = hudStreetEl.closest(".rounded-xl");
      if (innerCard) {
        const btnGrid = innerCard.querySelector(".grid");
        if (btnGrid) {
          innerCard.insertBefore(card, btnGrid);
        } else {
          innerCard.appendChild(card);
        }
        bindOrbeRecenterButton();
        drawOrbeVectorAndRing();
        return;
      }
    }

    const geoModule = document.getElementById("az-geo-module");
    if (geoModule && geoModule.parentElement) {
      geoModule.parentElement.insertBefore(card, geoModule);
    }
    bindOrbeRecenterButton();
    drawOrbeVectorAndRing();
  }

  let orbePingWaveRadius = 0;
  let orbePingAnimId = null;

  function triggerOrbeSonarAnimation() {
    orbePingWaveRadius = 8;
    if (orbePingAnimId) cancelAnimationFrame(orbePingAnimId);
    function step() {
      orbePingWaveRadius += 3.2;
      drawOrbeVectorAndRing();
      if (orbePingWaveRadius < 110) {
        orbePingAnimId = requestAnimationFrame(step);
      } else {
        orbePingWaveRadius = 0;
        drawOrbeVectorAndRing();
      }
    }
    orbePingAnimId = requestAnimationFrame(step);
  }

  function bindOrbeRecenterButton() {
    const recBtn = document.getElementById("azOrbeRecenterBtn");
    if (!recBtn || recBtn.dataset.bound === "1") return;
    recBtn.dataset.bound = "1";
    recBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      recBtn.classList.add("is-pinging");
      setTimeout(() => recBtn.classList.remove("is-pinging"), 1400);
      triggerOrbeSonarAnimation();

      compassSamples = [];
      handlingFreezeUntil = 0;
      setHeadingLockState(false);
      refreshStabilizedHeading(true);
      syncFromMainAzimuteGps(true);
      if (lastPos) {
        fetchNearbyStreets(lastPos[0], lastPos[1], true);
      }
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
    });
  }
  ensureQuadranteCardMounted();

  function readSyncedStreetFromLocationCard() {
    const hudStreetEl = document.getElementById("hudCurrentStreet");
    if (!hudStreetEl) return null;
    const txt = (hudStreetEl.textContent || "").trim();
    if (!txt || txt.length < 3) return null;
    const up = txt.toUpperCase();
    if (up.includes("SINCRONIZANDO") || up.includes("AGUARDANDO") || up.includes("BUSCANDO")) {
      return null;
    }
    return txt;
  }

  function readMainAzimuteGpsCoords() {
    if (window.azimuteCurrentGps && typeof window.azimuteCurrentGps.lat === "number" && typeof window.azimuteCurrentGps.lng === "number") {
      return {
        latitude: window.azimuteCurrentGps.lat,
        longitude: window.azimuteCurrentGps.lng,
        accuracy: window.azimuteCurrentGps.accuracy || 15,
        altitude: window.azimuteCurrentGps.altitude
      };
    }

    const sources = [
      document.getElementById("detailExactCoords")?.textContent,
      document.getElementById("gridCenterCoords")?.textContent,
      document.getElementById("btnOpenCurrentInMaps")?.getAttribute("href")
    ];

    for (const raw of sources) {
      if (!raw) continue;
      const m = raw.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
      if (!m) continue;
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
      if (Math.abs(lat - -19.9162) < 0.00005 && Math.abs(lng - -44.0809) < 0.00005) {
        continue;
      }
      return { latitude: lat, longitude: lng, accuracy: 18 };
    }
    return null;
  }

  function syncFromMainAzimuteGps(forceQuadrante) {
    const mainCoords = readMainAzimuteGpsCoords();
    if (!mainCoords) return;

    const key = `${mainCoords.latitude.toFixed(6)},${mainCoords.longitude.toFixed(6)}`;
    if (key !== lastMainGpsKey || forceQuadrante) {
      lastMainGpsKey = key;
      handleIncomingGpsCoords(mainCoords, true);
      if (forceQuadrante || !cachedNearbyStreets.length) {
        fetchNearbyStreets(mainCoords.latitude, mainCoords.longitude, true);
      }
    }
  }

  function setFollowState(enabled) {
    followGps = !!enabled;
    if (followBtn) {
      followBtn.textContent = followGps ? "Ativado" : "Desativado";
      followBtn.classList.toggle("active", followGps);
      followBtn.classList.toggle("subtle", !followGps);
    }
  }

  function setHeadingUpState(enabled) {
    headingUpMode = !!enabled;
    if (headingUpBtn) {
      headingUpBtn.textContent = headingUpMode ? "Ativado" : "Desativado";
      headingUpBtn.classList.toggle("active", headingUpMode);
      headingUpBtn.classList.toggle("subtle", !headingUpMode);
    }
    if (centerFab) {
      centerFab.classList.toggle("is-heading-up", headingUpMode);
    }
    if (headingUpMode) {
      applyMapHeadingUp(stableHeading, true);
    } else {
      applyMapHeadingUp(0, true);
    }
    updateDirectionalIcons(true);
  }

  function clearCityHighlight() {
    if (!citiesWrap) return;
    citiesWrap.querySelectorAll("button[data-lat]").forEach((b) => {
      b.classList.remove("active");
      b.classList.add("subtle");
    });
  }

  function hideSearchResults() {
    if (!searchResultsEl) return;
    searchResultsEl.classList.remove("is-open");
    searchResultsEl.innerHTML = "";
  }

  function calcDistanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function pointToSegmentClosest(pLat, pLng, aLat, aLng, bLat, bLng) {
    const cosLat = Math.cos((pLat * Math.PI) / 180);
    const ax = (aLng - pLng) * cosLat;
    const ay = aLat - pLat;
    const bx = (bLng - pLng) * cosLat;
    const by = bLat - pLat;

    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    let t = 0;
    if (lenSq > 0) {
      t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / lenSq));
    }
    const cLat = aLat + t * (bLat - aLat);
    const cLng = aLng + t * (bLng - aLng);
    const distKm = calcDistanceKm(pLat, pLng, cLat, cLng);
    return { distKm, lat: cLat, lng: cLng };
  }

  function calcBearingDeg(lat1, lng1, lat2, lng2) {
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const dLambda = ((lng2 - lng1) * Math.PI) / 180;
    const y = Math.sin(dLambda) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
    return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
  }

  function buildPopupHtml(title, subtitle, lat, lng, pinId, category) {
    const gmaps = `https://www.google.com/maps?q=${lat},${lng}`;
    const waze = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    const safeTitle = (title || "Destino").replace(/'/g, "");
    const meta = category && LAYER_META[category] ? LAYER_META[category] : null;
    const badgeHtml = meta
      ? `<span class="az-geo-popup-badge" style="color:${meta.color};">${meta.label}</span><br/>`
      : "";
    const saveBtnHtml = !pinId
      ? `<button type="button" style="grid-column: span 2;" onclick="window.azimuteOpenPinForm(${lat}, ${lng}, '${safeTitle}')">Salvar Alfinete</button>`
      : "";
    const delBtnHtml = pinId
      ? `<button type="button" class="danger" onclick="window.azimuteDeletePin('${pinId}')">Excluir Alfinete</button>`
      : "";
    return `
      <div class="az-geo-popup-card">
        ${badgeHtml}
        <strong>${title}</strong>
        ${subtitle ? `<div style="font-size:11px; color:#9E9A8F; margin-top:2px;">${subtitle}</div>` : ""}
        <div class="az-geo-popup-actions">
          <button type="button" class="primary-route" onclick="window.azimuteGeoRouteTo(${lat}, ${lng}, '${safeTitle}', false)">Traçar Rota</button>
          <button type="button" class="start-nav" onclick="window.azimuteGeoRouteTo(${lat}, ${lng}, '${safeTitle}', true)">Iniciar</button>
          ${saveBtnHtml}
          <a href="${gmaps}" target="_blank" rel="noopener">Maps</a>
          <a href="${waze}" target="_blank" rel="noopener">Waze</a>
          ${delBtnHtml}
        </div>
      </div>
    `;
  }

  function showDestinationOnMap(title, subtitle, lat, lng) {
    firstGpsFix = false;
    isNavigationStarted = false;
    setFollowState(false);
    setHeadingUpState(false);
    clearCityHighlight();
    hideSearchResults();

    currentDestination = { title, subtitle, lat, lng };
    if (routeBox) routeBox.classList.add("is-open");
    if (startNavBtn) startNavBtn.style.display = "none";

    if (destMarker) destMarker.remove();
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      buildPopupHtml(title, subtitle, lat, lng, null, null)
    );
    destMarker = new maplibregl.Marker({ color: "#C5A869" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    map.resize();

    if (lastPos) {
      const km = calcDistanceKm(lastPos[0], lastPos[1], lat, lng).toFixed(1);
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([lastPos[1], lastPos[0]]);
      bounds.extend([lng, lat]);
      map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
      targetEl.innerHTML = `Destino: <strong>${title} (${km} km)</strong>`;
      statusEl.textContent = "Toque em Traçar Rota ou Iniciar";
    } else {
      map.flyTo({ center: [lng, lat], zoom: 16 });
      targetEl.innerHTML = `Destino: <strong>${title}</strong>`;
      statusEl.textContent = "Destino localizado";
    }

    destMarker.togglePopup();
    drawOrbeVectorAndRing();
  }

  if (northBadge) {
    northBadge.addEventListener("click", (e) => {
      e.stopPropagation();
      isNavigationStarted = false;
      map.easeTo({ pitch: 0, duration: 250 });
      setHeadingUpState(false);
      statusEl.textContent = "Mapa alinhado ao Norte";
    });
  }

  map.on("touchstart", () => {
    userTouchPauseUntil = Date.now() + 5000;
  });
  map.on("mousedown", () => {
    userTouchPauseUntil = Date.now() + 5000;
  });

  map.on("touchstart", () => { document.body.classList.add("az-map-interacting"); });
  map.on("touchend", () => { document.body.classList.remove("az-map-interacting"); });
  map.on("touchcancel", () => { document.body.classList.remove("az-map-interacting"); });
  let _azRotateRaf = 0;
  map.on("rotate", () => {
    if (_azRotateRaf) return;
    _azRotateRaf = requestAnimationFrame(() => {
      _azRotateRaf = 0;
      const b = getMapBearing();
      if (northBadge) {
        northBadge.style.transition = "none";
        northBadge.style.transform = `rotate(${-b}deg)`;
      }
    });
  });

  map.on("rotateend", () => {
    document.body.classList.remove("az-map-interacting");
    recomputeQuadranteSectors(false);
  });

  if (centerFab) {
    centerFab.addEventListener("click", (e) => {
      e.stopPropagation();
      centerFab.classList.add("is-pulse");
      setTimeout(() => centerFab.classList.remove("is-pulse"), 180);
      triggerCenterOnMyPosition();
    });
  }

  function triggerCenterOnMyPosition() {
    clearCityHighlight();
    try { requestCompassPermissionIfNeeded(); } catch (_) {}
    userTouchPauseUntil = 0;
    handlingFreezeUntil = 0;
    setHeadingLockState(false);
    syncFromMainAzimuteGps(false);

    if (lastPos) {
      map.stop();
      map.resize();
      setFollowState(true);
      setHeadingUpState(true);
      refreshStabilizedHeading(true);
      map.easeTo({
        center: [lastPos[1], lastPos[0]],
        zoom: isNavigationStarted ? 18 : 17.5,
        bearing: stableHeading,
        pitch: isNavigationStarted ? 52 : map.getPitch(),
        duration: 400
      });
      statusEl.textContent = "Centralizado na sua posicao";
    } else if ("geolocation" in navigator) {
      statusEl.textContent = "Buscando sinal GPS...";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleIncomingGpsCoords(pos.coords, false);
          if (lastPos) {
            map.stop();
            map.resize();
            setFollowState(true);
            setHeadingUpState(true);
            refreshStabilizedHeading(true);
            map.easeTo({
              center: [lastPos[1], lastPos[0]],
              zoom: 17.5,
              bearing: stableHeading,
              duration: 400
            });
          }
        },
        (err) => {
          statusEl.textContent = "Permita o GPS (" + (err.message || "bloqueado") + ")";
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    }
  }

  if (munToggleBtn && munBox) {
    munToggleBtn.addEventListener("click", () => {
      const open = munBox.classList.toggle("is-open");
      munToggleBtn.classList.toggle("active", open);
      munToggleBtn.classList.toggle("subtle", !open);
    });
  }

  if (cfgToggleBtn && cfgBox) {
    cfgToggleBtn.addEventListener("click", () => {
      const open = cfgBox.classList.toggle("is-open");
      cfgToggleBtn.classList.toggle("active", open);
      cfgToggleBtn.classList.toggle("subtle", !open);
      if (open) updateCalibratorReadout();
    });
  }

  if (modesWrap) {
    modesWrap.querySelectorAll("button[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTravelMode = btn.getAttribute("data-mode");
        modesWrap.querySelectorAll("button").forEach((b) => {
          b.classList.remove("active");
          b.classList.add("subtle");
        });
        btn.classList.add("active");
        btn.classList.remove("subtle");

        if (activeRouteDest) {
          window.azimuteGeoRouteTo(activeRouteDest.lat, activeRouteDest.lng, activeRouteDest.name, isNavigationStarted);
        }
      });
    });
  }

  if (routeNowBtn) {
    routeNowBtn.addEventListener("click", () => {
      if (currentDestination) {
        window.azimuteGeoRouteTo(currentDestination.lat, currentDestination.lng, currentDestination.title, false);
      }
    });
  }

  window.azimuteStartActiveNavigation = function () {
    if (!activeRouteDest && currentDestination) {
      window.azimuteGeoRouteTo(currentDestination.lat, currentDestination.lng, currentDestination.title, true);
      return;
    }
    if (!activeRouteDest) return;

    isNavigationStarted = true;
    userTouchPauseUntil = 0;
    handlingFreezeUntil = 0;
    setHeadingLockState(false);
    try { requestCompassPermissionIfNeeded(); } catch (_) {}
    setFollowState(true);
    setHeadingUpState(true);
    refreshStabilizedHeading(true);
    updateRouteSources();

    if (destMarker && destMarker.getPopup()?.isOpen()) {
      destMarker.togglePopup();
    }

    if (lastPos) {
      map.stop();
      map.flyTo({
        center: [lastPos[1], lastPos[0]],
        zoom: 18,
        pitch: 52,
        bearing: stableHeading,
        duration: 550
      });
    }

    if (tbtBar) tbtBar.classList.add("is-active");
    if (startNavBtn) {
      startNavBtn.innerHTML = `<span>Em Navegação</span>`;
    }
    updateTurnByTurnProgress();
    window.azimuteUpdateRadarHudVisibility();
    statusEl.textContent = "Navegação ativa em tempo real";
  };

  if (startNavBtn) {
    startNavBtn.style.touchAction = "manipulation";
    startNavBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      window.azimuteStartActiveNavigation();
    });
  }

  function formatManeuverPt(step) {
    const m = step.maneuver || {};
    const type = m.type || "";
    const mod = m.modifier || "";
    const road = step.name ? ` na ${step.name}` : "";

    if (type === "arrive") return "Chegada ao destino";
    if (type === "depart") return `Siga${road || " em frente"}`;
    if (mod.includes("left")) return `Vire à esquerda${road}`;
    if (mod.includes("right")) return `Vire à direita${road}`;
    if (mod.includes("uturn")) return `Faça o retorno${road}`;
    return `Siga em frente${road}`;
  }

  function checkOffRouteAndRecalculate() {
    if (!isNavigationStarted || !activeRouteDest || !lastPos || activeRouteCoords.length < 2) return;
    if (Date.now() - lastRerouteTimestamp < 12000) return;

    let minDistKm = Infinity;
    for (let i = 0; i < activeRouteCoords.length - 1; i++) {
      const seg = pointToSegmentClosest(
        lastPos[0],
        lastPos[1],
        activeRouteCoords[i][0],
        activeRouteCoords[i][1],
        activeRouteCoords[i + 1][0],
        activeRouteCoords[i + 1][1]
      );
      if (seg.distKm < minDistKm) minDistKm = seg.distKm;
    }

    if (minDistKm > 0.045) {
      lastRerouteTimestamp = Date.now();
      statusEl.textContent = "Recalculando rota...";
      window.azimuteGeoRouteTo(activeRouteDest.lat, activeRouteDest.lng, activeRouteDest.name, true);
    }
  }

  function updateTurnByTurnProgress() {
    if (!activeRouteDest || !lastPos || !activeRouteSteps.length) return;

    const distToDestKm = calcDistanceKm(lastPos[0], lastPos[1], activeRouteDest.lat, activeRouteDest.lng);
    if (distToDestKm <= 0.03) {
      if (tbtNextEl) tbtNextEl.textContent = "Você chegou ao destino!";
      if (radarNextStepEl) radarNextStepEl.textContent = "Chegada ao destino";
      statusEl.textContent = "Destino alcançado";
      return;
    }

    let bestIdx = 0;
    let bestDist = Infinity;
    activeRouteSteps.forEach((st, idx) => {
      const loc = st.maneuver && st.maneuver.location;
      if (!loc) return;
      const d = calcDistanceKm(lastPos[0], lastPos[1], loc[1], loc[0]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });

    const nextStep = activeRouteSteps[Math.min(bestIdx + 1, activeRouteSteps.length - 1)];
    const nLoc = nextStep && nextStep.maneuver && nextStep.maneuver.location;
    let distMeters = 0;
    if (nLoc) {
      distMeters = Math.round(calcDistanceKm(lastPos[0], lastPos[1], nLoc[1], nLoc[0]) * 1000);
    }

    const actionText = formatManeuverPt(nextStep);
    const nextLabel = distMeters > 0 ? `Em ${distMeters} m • ${actionText}` : actionText;
    const syncedVia = readSyncedStreetFromLocationCard() || cachedCurrentStreet || "Via atual";

    if (tbtNextEl) tbtNextEl.textContent = nextLabel;
    if (tbtCurrentEl) tbtCurrentEl.textContent = `Via atual: ${syncedVia}`;
    if (radarNextStepEl) radarNextStepEl.textContent = nextLabel;
    if (radarCurrentViaEl) radarCurrentViaEl.textContent = syncedVia;
  }

  window.azimuteUpdateRadarHudVisibility = function () {
    if (!radarHud) return;
    const drawerOpen = document.getElementById("azGeoDrawerBody")?.classList.contains("is-open");
    const incOpen = incOverlay?.classList.contains("is-open");
    const shouldShow = (isNavigationStarted || !!activeRouteDest) && !drawerOpen && !incOpen;
    radarHud.classList.toggle("is-visible", shouldShow);
    if (shouldShow && radarMap) {
      setTimeout(() => {
        radarMap.resize();
        if (lastPos) radarMap.setCenter([lastPos[1], lastPos[0]]);
      }, 80);
    }
  };

  if (radarExpandBtn) {
    radarExpandBtn.addEventListener("click", () => {
      const body = document.getElementById("azGeoDrawerBody");
      if (body && !body.classList.contains("is-open")) {
        window.azimuteToggleGeoDrawer();
      }
      document.getElementById("az-geo-module")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (stopRouteBtn) {
    stopRouteBtn.addEventListener("click", () => {
      activeRouteDest = null;
      activeRouteSteps = [];
      activeRouteCoords = [];
      isNavigationStarted = false;
      updateRouteSources();
      map.easeTo({ pitch: 0, zoom: 16, duration: 300 });
      if (tbtBar) tbtBar.classList.remove("is-active");
      if (startNavBtn) startNavBtn.style.display = "none";
      window.azimuteUpdateRadarHudVisibility();
      statusEl.textContent = "Rota encerrada";
      drawOrbeVectorAndRing();
    });
  }

  async function fetchOsrmRoute(origLat, origLng, destLat, destLng, isWalking) {
    const endpoints = isWalking
      ? [
          `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`,
          `https://router.project-osrm.org/route/v1/foot/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`
        ]
      : [
          `https://router.project-osrm.org/route/v1/driving/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`,
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${origLng},${origLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`
        ];

    for (const url of endpoints) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        const data = await res.json();
        if (data && Array.isArray(data.routes) && data.routes.length) {
          return data.routes[0];
        }
      } catch (e) {}
    }
    return null;
  }

  window.azimuteGeoRouteTo = async function (destLat, destLng, destName, autoStartNav) {
    if (!lastPos) {
      syncFromMainAzimuteGps(false);
    }
    if (!lastPos) {
      statusEl.textContent = "Aguardando sua posicao GPS para tracar rota...";
      return;
    }

    activeRouteDest = { lat: destLat, lng: destLng, name: destName };
    if (routeBox) routeBox.classList.add("is-open");
    statusEl.textContent = "Calculando rota (" + currentTravelMode + ")...";

    const [origLat, origLng] = lastPos;
    const isWalking = currentTravelMode === "pe";
    const route = await fetchOsrmRoute(origLat, origLng, destLat, destLng, isWalking);

    if (!route || !route.geometry || !Array.isArray(route.geometry.coordinates)) {
      statusEl.textContent = "Nao foi possivel calcular a rota (verifique conexao)";
      return;
    }

    activeRouteCoords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    activeRouteSteps = (route.legs && route.legs[0] && route.legs[0].steps) || [];
    updateRouteSources();
    drawOrbeVectorAndRing();

    if (destMarker && destMarker.getPopup()?.isOpen()) {
      destMarker.togglePopup();
    }

    const km = (route.distance / 1000).toFixed(1);
    let durationSec = route.duration;
    if (currentTravelMode === "moto") {
      durationSec = durationSec * 0.75;
    }

    const min = Math.max(1, Math.round(durationSec / 60));
    const modeLabel = currentTravelMode === "pe" ? "A pe" : currentTravelMode === "moto" ? "Moto" : "Carro";

    targetEl.innerHTML = `Destino: <strong>${destName} [${modeLabel}: ${km} km / ${min} min]</strong>`;

    if (startNavBtn) {
      startNavBtn.style.display = "inline-flex";
      startNavBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 20,12 5,21"/></svg><span>Iniciar</span>`;
    }

    if (autoStartNav) {
      window.azimuteStartActiveNavigation();
    } else {
      isNavigationStarted = false;
      setFollowState(false);
      setHeadingUpState(false);
      const bounds = new maplibregl.LngLatBounds();
      activeRouteCoords.forEach(([lat, lng]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, { padding: 48, pitch: 0, maxZoom: 16 });
      if (tbtBar) tbtBar.classList.add("is-active");
      updateTurnByTurnProgress();
      window.azimuteUpdateRadarHudVisibility();
      statusEl.textContent = `Rota pronta (${km} km • ~${min} min). Toque em Iniciar.`;
    }
  };

  function syncColorSwatches() {
    if (!colorsWrap) return;
    colorsWrap.querySelectorAll("button[data-color]").forEach((b) => {
      b.classList.toggle("is-selected", b.getAttribute("data-color") === arrowColor);
    });
  }
  syncColorSwatches();

  if (colorsWrap) {
    colorsWrap.querySelectorAll("button[data-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        arrowColor = btn.getAttribute("data-color") || "#C5A869";
        localStorage.setItem("az_geo_arrow_color", arrowColor);
        syncColorSwatches();
        updateDirectionalIcons(true);
      });
    });
  }

  if (headingUpBtn) {
    headingUpBtn.addEventListener("click", () => {
      userTouchPauseUntil = 0;
      setHeadingUpState(!headingUpMode);
      if (headingUpMode) refreshStabilizedHeading(true);
    });
  }

  if (followBtn) {
    followBtn.addEventListener("click", () => {
      setFollowState(!followGps);
      if (followGps && lastPos) {
        clearCityHighlight();
        map.resize();
        map.flyTo({ center: [lastPos[1], lastPos[0]], zoom: 17 });
      }
    });
  }

  function syncElevButton() {
    if (!elevToggleBtn) return;
    elevToggleBtn.textContent = showElevation ? "Ativado" : "Desativado";
    elevToggleBtn.classList.toggle("active", showElevation);
    elevToggleBtn.classList.toggle("subtle", !showElevation);
  }
  syncElevButton();

  if (elevToggleBtn) {
    elevToggleBtn.addEventListener("click", () => {
      showElevation = !showElevation;
      localStorage.setItem("az_geo_elev_enabled", showElevation ? "1" : "0");
      syncElevButton();
      recomputeQuadranteSectors(true);
    });
  }

  function persistPins() {
    localStorage.setItem("az_geo_pins_v1", JSON.stringify(savedPins));
  }

  function renderSavedPins() {
    pinMarkers.forEach((m) => m.remove());
    pinMarkers = [];

    savedPins.forEach((pin) => {
      const el = document.createElement("div");
      el.innerHTML = buildPinSvg(pin.color || "#C5A869");
      el.style.cursor = "pointer";

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        buildPopupHtml(pin.title, pin.note || "", pin.lat, pin.lng, pin.id, null)
      );

      const m = new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map);
      pinMarkers.push(m);
    });

    renderIncursionPinsList();
    drawOrbeVectorAndRing();
  }
  renderSavedPins();

  if (exportPinsBtn) {
    exportPinsBtn.addEventListener("click", () => {
      const payload = {
        app: "AZIMUTE",
        exportedAt: new Date().toISOString(),
        pins: savedPins
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `azimute_pacote_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (statusEl) statusEl.textContent = `Pacote exportado (${savedPins.length} alfinetes)`;
    });
  }

  if (importPinsBtn && importPinsInput) {
    importPinsBtn.addEventListener("click", () => {
      importPinsInput.click();
    });
    importPinsInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));
          const incoming = Array.isArray(parsed) ? parsed : Array.isArray(parsed.pins) ? parsed.pins : [];
          let added = 0;
          incoming.forEach((item) => {
            if (typeof item.lat === "number" && typeof item.lng === "number") {
              savedPins.push({
                id: "pin_" + Date.now() + "_" + added,
                title: String(item.title || "Ponto Importado"),
                note: String(item.note || ""),
                color: String(item.color || "#C5A869"),
                lat: item.lat,
                lng: item.lng
              });
              added++;
            }
          });
          persistPins();
          renderSavedPins();
          if (statusEl) statusEl.textContent = `${added} alfinetes importados ao mapa`;
        } catch (err) {
          if (statusEl) statusEl.textContent = "Arquivo JSON inválido";
        }
        importPinsInput.value = "";
      };
      reader.readAsText(file);
    });
  }

  window.azimuteOpenPinForm = function (lat, lng, defaultTitle) {
    pendingPinCoords = { lat, lng };
    if (pinCoordsLabel) {
      pinCoordsLabel.textContent = `Novo Alfinete (${lat.toFixed(5)}, ${lng.toFixed(5)})`;
    }
    if (pinTitleInput) pinTitleInput.value = defaultTitle || "";
    if (pinNoteInput) pinNoteInput.value = "";
    if (pinForm) pinForm.classList.add("is-open");
  };

  window.azimuteDeletePin = function (pinId) {
    savedPins = savedPins.filter((p) => p.id !== pinId);
    persistPins();
    renderSavedPins();
    statusEl.textContent = "Alfinete removido";
  };

  if (addPinBtn) {
    addPinBtn.addEventListener("click", () => {
      pinDropMode = !pinDropMode;
      addPinBtn.classList.toggle("active", pinDropMode);
      addPinBtn.classList.toggle("subtle", !pinDropMode);
      statusEl.textContent = pinDropMode
        ? "Toque no ponto do mapa para fixar o alfinete"
        : "Modo alfinete cancelado";
    });
  }

  map.on("click", (e) => {
    if (!pinDropMode) return;
    pinDropMode = false;
    if (addPinBtn) {
      addPinBtn.classList.remove("active");
      addPinBtn.classList.add("subtle");
    }
    window.azimuteOpenPinForm(e.lngLat.lat, e.lngLat.lng, "");
  });

  if (savePinBtn) {
    savePinBtn.addEventListener("click", () => {
      if (!pendingPinCoords) return;
      const title = (pinTitleInput?.value || "").trim() || "Alfinete";
      const note = (pinNoteInput?.value || "").trim();
      const color = pinColorSelect?.value || "#C5A869";

      savedPins.push({
        id: "pin_" + Date.now(),
        title,
        note,
        color,
        lat: pendingPinCoords.lat,
        lng: pendingPinCoords.lng
      });
      persistPins();
      renderSavedPins();
      pendingPinCoords = null;
      if (pinForm) pinForm.classList.remove("is-open");
      statusEl.textContent = "Alfinete salvo: " + title;
    });
  }

  if (cancelPinBtn) {
    cancelPinBtn.addEventListener("click", () => {
      pendingPinCoords = null;
      if (pinForm) pinForm.classList.remove("is-open");
    });
  }

  if (citiesLeft && citiesWrap) {
    citiesLeft.addEventListener("click", () => {
      citiesWrap.scrollBy({ left: -160, behavior: "smooth" });
    });
  }
  if (citiesRight && citiesWrap) {
    citiesRight.addEventListener("click", () => {
      citiesWrap.scrollBy({ left: 160, behavior: "smooth" });
    });
  }

  if (citiesWrap) {
    citiesWrap.querySelectorAll("button[data-lat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        firstGpsFix = false;
        isNavigationStarted = false;
        setFollowState(false);
        setHeadingUpState(false);
        hideSearchResults();
        clearCityHighlight();
        btn.classList.add("active");
        btn.classList.remove("subtle");

        const lat = parseFloat(btn.getAttribute("data-lat"));
        const lng = parseFloat(btn.getAttribute("data-lng"));
        const zoom = parseInt(btn.getAttribute("data-zoom"), 10) || 13;

        map.resize();
        map.flyTo({ center: [lng, lat], zoom, pitch: 0 });
        statusEl.textContent = "Visualizando " + btn.textContent.trim();
      });
    });
  }

  map.on("dragstart", () => {
    if (followGps) setFollowState(false);
  });

  if (clearBtn) clearBtn.addEventListener("click", () => {
    if (destMarker) {
      destMarker.remove();
      destMarker = null;
    }
    hideSearchResults();
    searchInput.value = "";
    currentDestination = null;
    activeRouteDest = null;
    activeRouteSteps = [];
    activeRouteCoords = [];
    isNavigationStarted = false;
    updateRouteSources();
    map.easeTo({ pitch: 0, duration: 250 });
    if (routeBox) routeBox.classList.remove("is-open");
    if (startNavBtn) startNavBtn.style.display = "none";
    if (tbtBar) tbtBar.classList.remove("is-active");
    window.azimuteUpdateRadarHudVisibility();
    targetEl.innerHTML = "Destino: <strong>Nenhum</strong>";
    statusEl.textContent = lastPos ? "GPS ativo" : "Aguardando GPS...";
    drawOrbeVectorAndRing();
  });

  function normalizeSearchText(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function formatPhotonItem(feat, fallbackQuery) {
    const props = (feat && feat.properties) || {};
    const coords = (feat && feat.geometry && Array.isArray(feat.geometry.coordinates)) ? feat.geometry.coordinates : [];
    const lng = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    const road = props.street || props.name || fallbackQuery;
    const number = props.housenumber ? `, ${props.housenumber}` : "";
    const title = `${road}${number}`;
    const bairro = props.district || props.suburb || props.locality || "";
    const cidade = props.city || props.county || "";
    const uf = props.state && String(props.state).toLowerCase().includes("minas gerais") ? "MG" : (props.state || "");
    const parts = [bairro, cidade, uf].filter(Boolean);
    return {
      title,
      subtitle: parts.join(" — "),
      lat,
      lng
    };
  }

  function isLikelyRmbhOrMg(props) {
    if (!props) return true;
    const cc = String(props.countrycode || "").toUpperCase();
    if (cc && cc !== "BR") return false;
    const st = normalizeSearchText(props.state || "");
    if (st && !st.includes("minas gerais") && st !== "mg") return false;
    return true;
  }

  function dedupeGeoSearchOptions(list) {
    const seen = new Set();
    const out = [];
    list.forEach((opt) => {
      if (!opt || typeof opt.lat !== "number" || typeof opt.lng !== "number" || Number.isNaN(opt.lat) || Number.isNaN(opt.lng)) return;
      const key = `${normalizeSearchText(opt.title)}|${opt.lat.toFixed(3)}|${opt.lng.toFixed(3)}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(opt);
    });
    return out;
  }

  function formatNominatimItem(item, fallbackQuery) {
    const addr = item.address || {};
    const road = addr.road || addr.pedestrian || addr.footway || addr.path || item.name || fallbackQuery;
    const number = addr.house_number ? `, ${addr.house_number}` : "";
    const title = `${road}${number}`;

    const bairro = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || "";
    const cidade = addr.city || addr.town || addr.municipality || "";
    const parts = [bairro, cidade].filter(Boolean);
    const subtitle = parts.length ? parts.join(" — ") : (item.display_name || "");

    return {
      title,
      subtitle,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      geojson: item.geojson || null,
      osmCategory: item.category || item.class || "",
      osmType: item.type || ""
    };
  }

  function formatDistEtaLabel(km, min, isEstimate) {
    const kmStr = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;
    const minStr = `${Math.max(1, Math.round(min))} min`;
    return `${isEstimate ? "~" : ""}${kmStr} • ${minStr}`;
  }

  function renderSearchOptions(options) {
    if (!searchResultsEl) return;
    searchResultsEl.innerHTML = "";

    options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "az-geo-result-item";
      btn.dataset.optIdx = String(idx);

      let distBadgeHtml = "";
      if (typeof opt.roadKm === "number" && typeof opt.roadMin === "number") {
        distBadgeHtml = `<span class="az-geo-result-dist">${formatDistEtaLabel(opt.roadKm, opt.roadMin, false)}</span>`;
      } else if (typeof opt.estKm === "number") {
        distBadgeHtml = `<span class="az-geo-result-dist">${formatDistEtaLabel(opt.estKm, opt.estMin, true)}</span>`;
      }

      const isAreaHit = Boolean(
        opt.osmCategory === "boundary" ||
        opt.osmCategory === "place" ||
        /suburb|neighbourhood|quarter|city|town|administrative/i.test(opt.osmType || "") ||
        (opt.geojson && /Polygon/i.test(opt.geojson.type || ""))
      );

      btn.innerHTML = `
        <div class="az-geo-result-info">
          <span class="az-geo-result-title">${opt.title}</span>
          ${opt.subtitle ? `<span class="az-geo-result-sub">${opt.subtitle}</span>` : ""}
        </div>
        ${isAreaHit ? `<span class="az-geo-result-recon-tag" style="font-size:9px;font-weight:900;color:#0D0D0D;background:#C5A869;padding:2px 6px;border-radius:6px;margin-right:4px;white-space:nowrap;">VOAR RECON</span>` : ""}
        ${distBadgeHtml}
      `;
      const reconTag = btn.querySelector(".az-geo-result-recon-tag");
      if (reconTag) {
        reconTag.addEventListener("click", (ev) => {
          ev.stopPropagation();
          showDestinationOnMap(opt.title, opt.subtitle, opt.lat, opt.lng);
          if (typeof window.azShowGeoSearchGeometry === "function") window.azShowGeoSearchGeometry(opt);
          const rb = document.getElementById("azGeoSearchReconBtn");
          if (rb) rb.click();
        });
      }
      btn.addEventListener("click", () => {
        showDestinationOnMap(opt.title, opt.subtitle, opt.lat, opt.lng);
        if (typeof window.azShowGeoSearchGeometry === "function") {
          window.azShowGeoSearchGeometry(opt);
        }
      });
      searchResultsEl.appendChild(btn);
    });

    searchResultsEl.classList.add("is-open");
    statusEl.textContent = `Ordenado por proximidade (${options.length} encontrados)`;
  }

  async function enrichSearchOptionsWithRoadMatrix(options) {
    if (!lastPos || !options.length) return;
    const coords = [`${lastPos[1]},${lastPos[0]}`, ...options.map((o) => `${o.lng},${o.lat}`)].join(";");
    const url = `https://router.project-osrm.org/table/v1/driving/${coords}?sources=0&annotations=distance,duration`;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) return;
      const data = await res.json();
      const dists = data && data.distances && data.distances[0];
      const durs = data && data.durations && data.durations[0];
      if (!Array.isArray(dists) || !Array.isArray(durs)) return;

      options.forEach((opt, i) => {
        const dMeters = dists[i + 1];
        const dSecs = durs[i + 1];
        if (typeof dMeters === "number" && typeof dSecs === "number") {
          opt.roadKm = dMeters / 1000;
          opt.roadMin = dSecs / 60;
          opt.sortKey = opt.roadKm;
        }
      });

      options.sort((a, b) => (a.sortKey ?? 9999) - (b.sortKey ?? 9999));
      if (searchResultsEl && searchResultsEl.classList.contains("is-open")) {
        renderSearchOptions(options);
      }
    } catch (e) {}
  }

  async function runSearch() {
    const q = (searchInput.value || "").trim();
    if (!q) return;

    statusEl.textContent = "Buscando opcoes proximas...";
    hideSearchResults();
    const qNorm = normalizeSearchText(q);
    const rawOptions = [];

    ["unidades", "hospitais", "bscs", "deplans"].forEach((cat) => {
      const tag = LAYER_META[cat].label;
      datasetPoints[cat].forEach((p) => {
        if (
          normalizeSearchText(p.name).includes(qNorm) ||
          normalizeSearchText(p.subtitle).includes(qNorm)
        ) {
          rawOptions.push({
            title: p.name,
            subtitle: `[${tag}] ${p.subtitle || ""}`.trim(),
            lat: p.lat,
            lng: p.lng
          });
        }
      });
    });

    localPoints.forEach((p) => {
      if (
        normalizeSearchText(p.name).includes(qNorm) ||
        normalizeSearchText(p.subtitle).includes(qNorm)
      ) {
        rawOptions.push({
          title: p.name || q,
          subtitle: p.subtitle || "Ponto AZIMUTE",
          lat: p.lat,
          lng: p.lng
        });
      }
    });

    const refLat = lastPos ? lastPos[0] : -19.9191;
    const refLng = lastPos ? lastPos[1] : -43.9386;

    const fetchWithTimeout = async (url, opts) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5500);
      try {
        const res = await fetch(url, Object.assign({}, opts || {}, { signal: ctrl.signal }));
        if (!res.ok) throw new Error("HTTP " + res.status);
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    };

    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${refLat.toFixed(4)}&lon=${refLng.toFixed(4)}&limit=8`;
    const fullQuery = qNorm.includes("minas gerais") || qNorm.includes(" mg") ? q : `${q}, Minas Gerais, Brasil`;
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_geojson=1&limit=8&countrycodes=br&viewbox=-44.55,-19.45,-43.45,-20.30&q=${encodeURIComponent(fullQuery)}`;

    const settled = await Promise.allSettled([
      fetchWithTimeout(photonUrl),
      fetchWithTimeout(nomUrl, { headers: { "Accept-Language": "pt-BR" } })
    ]);

    let networkOk = false;
    if (settled[0].status === "fulfilled" && settled[0].value && Array.isArray(settled[0].value.features)) {
      networkOk = true;
      settled[0].value.features.forEach((feat) => {
        if (!isLikelyRmbhOrMg(feat.properties)) return;
        const fmt = formatPhotonItem(feat, q);
        if (fmt) rawOptions.push(fmt);
      });
    }
    if (settled[1].status === "fulfilled" && Array.isArray(settled[1].value)) {
      networkOk = true;
      settled[1].value.forEach((item) => {
        rawOptions.push(formatNominatimItem(item, q));
      });
    }

    if (!rawOptions.length && !qNorm.includes("belo horizonte") && !qNorm.includes("mg")) {
      try {
        const fbData = await fetchWithTimeout(`https://photon.komoot.io/api/?q=${encodeURIComponent(q + " Belo Horizonte MG")}&lat=${refLat.toFixed(4)}&lon=${refLng.toFixed(4)}&limit=6`);
        networkOk = true;
        if (fbData && Array.isArray(fbData.features)) {
          fbData.features.forEach((feat) => {
            if (!isLikelyRmbhOrMg(feat.properties)) return;
            const fmt = formatPhotonItem(feat, q);
            if (fmt) rawOptions.push(fmt);
          });
        }
      } catch (_) {}
    }

    if (!rawOptions.length && !networkOk) {
      statusEl.textContent = "Erro na busca (verifique conexao)";
      return;
    }

    const options = dedupeGeoSearchOptions(rawOptions);
    if (!options.length) {
      statusEl.textContent = "Endereco nao encontrado";
      return;
    }

    options.forEach((opt) => {
      const lineKm = calcDistanceKm(refLat, refLng, opt.lat, opt.lng);
      opt.sortKey = lineKm;
      if (lastPos) {
        opt.estKm = lineKm * 1.25;
        opt.estMin = (opt.estKm / 30) * 60;
      }
    });
    options.sort((a, b) => a.sortKey - b.sortKey);

    if (options.length === 1) {
      showDestinationOnMap(options[0].title, options[0].subtitle, options[0].lat, options[0].lng);
    } else {
      renderSearchOptions(options);
      enrichSearchOptionsWithRoadMatrix(options);
    }
  }

  searchBtn.addEventListener("click", runSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  });

  let compassListening = false;
  let lastOrientationTickMs = 0;
  function handleOrientationEvent(e, isAbsolute) {
    const nowMs = performance.now();
    if (nowMs - lastOrientationTickMs < 65) return;

    let incomingHeading = null;
    if (typeof e.webkitCompassHeading === "number" && !Number.isNaN(e.webkitCompassHeading)) {
      hasAbsoluteCompass = true;
      incomingHeading = normalizeAngle(e.webkitCompassHeading);
    } else if ((isAbsolute || e.absolute === true) && typeof e.alpha === "number" && !Number.isNaN(e.alpha)) {
      hasAbsoluteCompass = true;
      incomingHeading = normalizeAngle(360 - e.alpha);
    } else {
      return;
    }

    lastOrientationTickMs = nowMs;
    const prevRaw = rawCompassHeading;
    rawCompassHeading = pushSmoothedCompass(incomingHeading);
    if (Math.abs(shortestAngleDiff(prevRaw, rawCompassHeading)) >= 3) {
      refreshStabilizedHeading(false);
    }
  }

  function startCompassListeners() {
    if (compassListening) return;
    compassListening = true;
    window.addEventListener("deviceorientationabsolute", (e) => handleOrientationEvent(e, true), true);
    window.addEventListener("deviceorientation", (e) => handleOrientationEvent(e, false), true);
  }

  function requestCompassPermissionIfNeeded() {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === "granted") startCompassListeners();
        })
        .catch(() => {});
    } else {
      startCompassListeners();
    }
  }
  startCompassListeners();

  function extractStreetsFromMapLibre(lat, lng) {
    if (!map || !map.isStyleLoaded()) return { list: [], segments: [] };
    try {
      const features = map.queryRenderedFeatures();
      const byName = new Map();
      const segments = [];

      for (let i = 0; i < features.length; i++) {
        const f = features[i];
        const srcLayer = (f.sourceLayer || "").toLowerCase();
        if (!srcLayer.includes("transport")) continue;
        const name = f.properties && (f.properties.name || f.properties["name:pt"]);
        if (!name || typeof name !== "string" || name.length < 3) continue;

        let coords = [];
        if (f.geometry && f.geometry.type === "LineString") {
          coords = f.geometry.coordinates;
        } else if (f.geometry && f.geometry.type === "MultiLineString") {
          coords = f.geometry.coordinates.flat();
        } else {
          continue;
        }
        if (coords.length < 2) continue;

        let bestDist = Infinity;
        let bestPt = { lat: coords[0][1], lng: coords[0][0] };
        const clipped = [];

        for (let j = 0; j < coords.length - 1; j++) {
          const aLat = coords[j][1];
          const aLng = coords[j][0];
          const bLat = coords[j + 1][1];
          const bLng = coords[j + 1][0];
          const seg = pointToSegmentClosest(lat, lng, aLat, aLng, bLat, bLng);
          if (seg.distKm <= 0.145) {
            clipped.push([
              [aLat, aLng],
              [bLat, bLng]
            ]);
          }
          if (seg.distKm < bestDist) {
            bestDist = seg.distKm;
            bestPt = { lat: seg.lat, lng: seg.lng };
          }
        }

        if (clipped.length) {
          segments.push({ name, lines: clipped });
        }

        if (bestDist > 0.13) continue;
        const prev = byName.get(name);
        if (!prev || bestDist < prev.distKm) {
          byName.set(name, { name, distKm: bestDist, lat: bestPt.lat, lng: bestPt.lng, elevation: null, deltaElev: null });
        }
      }
      return {
        list: Array.from(byName.values()).sort((a, b) => a.distKm - b.distKm),
        segments
      };
    } catch (e) {
      return { list: [], segments: [] };
    }
  }

  async function queryOverpassGet(lat, lng) {
    const query = `[out:json][timeout:6];way(around:130,${lat.toFixed(6)},${lng.toFixed(6)})["highway"]["name"];out geom;`;
    const encoded = encodeURIComponent(query);

    for (const mirror of OVERPASS_MIRRORS) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5500);
        const res = await fetch(`${mirror}?data=${encoded}`, { signal: ctrl.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        const data = await res.json();
        const elements = Array.isArray(data.elements) ? data.elements : [];
        if (!elements.length) continue;

        const byName = new Map();
        const segments = [];

        elements.forEach((el) => {
          const name = el.tags && el.tags.name;
          const geom = el.geometry;
          if (!name || !Array.isArray(geom) || geom.length < 2) return;

          let bestDist = Infinity;
          let bestPt = { lat: geom[0].lat, lng: geom[0].lon };
          const clipped = [];

          for (let i = 0; i < geom.length - 1; i++) {
            const aLat = geom[i].lat;
            const aLng = geom[i].lon;
            const bLat = geom[i + 1].lat;
            const bLng = geom[i + 1].lon;
            const seg = pointToSegmentClosest(lat, lng, aLat, aLng, bLat, bLng);
            if (seg.distKm <= 0.145) {
              clipped.push([
                [aLat, aLng],
                [bLat, bLng]
              ]);
            }
            if (seg.distKm < bestDist) {
              bestDist = seg.distKm;
              bestPt = { lat: seg.lat, lng: seg.lng };
            }
          }

          if (clipped.length) {
            segments.push({ name, lines: clipped });
          }

          if (bestDist > 0.13) return;
          const prev = byName.get(name);
          if (!prev || bestDist < prev.distKm) {
            byName.set(name, { name, distKm: bestDist, lat: bestPt.lat, lng: bestPt.lng, elevation: null, deltaElev: null });
          }
        });
        return {
          list: Array.from(byName.values()).sort((a, b) => a.distKm - b.distKm),
          segments
        };
      } catch (e) {}
    }
    return { list: [], segments: [] };
  }

  async function queryPhotonNearbyStreets(lat, lng) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4500);
      const url = `https://photon.komoot.io/reverse?lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&limit=15&radius=0.13`;
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) return [];
      const data = await res.json();
      const feats = Array.isArray(data.features) ? data.features : [];
      const byName = new Map();

      feats.forEach((f) => {
        const props = f.properties || {};
        const name = (props.street || props.name || "").trim();
        const coords = f.geometry && f.geometry.coordinates;
        if (!name || !Array.isArray(coords) || coords.length < 2) return;
        const pLat = coords[1];
        const pLng = coords[0];
        const distKm = calcDistanceKm(lat, lng, pLat, pLng);
        if (distKm > 0.13) return;

        const prev = byName.get(name);
        if (!prev || distKm < prev.distKm) {
          byName.set(name, { name, distKm, lat: pLat, lng: pLng, elevation: null, deltaElev: null });
        }
      });
      return Array.from(byName.values()).sort((a, b) => a.distKm - b.distKm);
    } catch (e) {
      return [];
    }
  }

  async function enrichStreetsAndGridElevation(centerLat, centerLng, streetsList) {
    const sample = streetsList.slice(0, 8);
    const cosLat = Math.cos((centerLat * Math.PI) / 180);
    const stepDegLat = 0.065 / 111.32;
    const stepDegLng = 0.065 / (111.32 * cosLat);

    const gridCoords = [];
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        gridCoords.push({
          lat: centerLat - r * stepDegLat,
          lng: centerLng + c * stepDegLng
        });
      }
    }

    const allPts = [
      { lat: centerLat, lng: centerLng },
      ...sample.map((s) => ({ lat: s.lat, lng: s.lng })),
      ...gridCoords
    ];

    const lats = allPts.map((p) => p.lat.toFixed(5)).join(",");
    const lngs = allPts.map((p) => p.lng.toFixed(5)).join(",");

    let elevations = null;

    try {
      const locs = allPts.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|");
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(`https://api.opentopodata.org/v1/srtm30m?locations=${locs}`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        const d = await res.json();
        if (d && Array.isArray(d.results) && d.results.length === allPts.length) {
          elevations = d.results.map((item) => item.elevation);
        }
      }
    } catch (e) {}

    if (!elevations) {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`);
        const data = await res.json();
        if (Array.isArray(data.elevation) && data.elevation.length === allPts.length) {
          elevations = data.elevation;
        }
      } catch (e) {}
    }

    if (!elevations || !elevations.length) return;

    const centerElev = elevations[0];
    if (typeof centerElev === "number" && !Number.isNaN(centerElev)) {
      lastAltitude = centerElev;
    }

    sample.forEach((st, idx) => {
      const elVal = elevations[idx + 1];
      if (typeof elVal === "number" && !Number.isNaN(elVal)) {
        st.elevation = elVal;
        st.deltaElev = Math.round((elVal - centerElev) * 10) / 10;
      }
    });

    const gridStart = 1 + sample.length;
    const matrix = [];
    for (let r = 0; r < 5; r++) {
      const row = [];
      for (let c = 0; c < 5; c++) {
        const val = elevations[gridStart + r * 5 + c];
        row.push(typeof val === "number" && !Number.isNaN(val) ? val - centerElev : 0);
      }
      matrix.push(row);
    }
    elevationGrid5x5 = matrix;

    recomputeQuadranteSectors(true);
  }

  function applyStreetsListToQuadrante(lat, lng, payload, sourceTag) {
    const list = Array.isArray(payload) ? payload : payload.list || [];
    const segments = Array.isArray(payload) ? [] : payload.segments || [];
    if (!list.length) return;

    lastStreetsFetchPos = [lat, lng];
    lastQuadStreetSource = sourceTag || "overpass";
    if (segments.length) {
      cachedVectorSegments = segments;
    }

    const syncedLocStreet = readSyncedStreetFromLocationCard();
    if (syncedLocStreet) {
      cachedCurrentStreet = syncedLocStreet;
      const normSynced = syncedLocStreet.toLowerCase();
      cachedNearbyStreets = list.filter((st) => st.name.toLowerCase() !== normSynced);
    } else {
      cachedCurrentStreet = list[0].name;
      cachedNearbyStreets = list.slice(1);
    }
    setQuadFetchIndicator("idle", "ESPECTRO");
    recomputeQuadranteSectors(true);
    enrichStreetsAndGridElevation(lat, lng, cachedNearbyStreets);
  }

  async function fetchNearbyStreets(lat, lng, force) {
    if (fetchingStreets) return;
    if (!force && lastStreetsFetchPos && cachedNearbyStreets.length > 0) {
      const movedKm = calcDistanceKm(lastStreetsFetchPos[0], lastStreetsFetchPos[1], lat, lng);
      if (movedKm < 0.015) return;
    }

    fetchingStreets = true;
    if (retryStreetsTimer) {
      clearTimeout(retryStreetsTimer);
      retryStreetsTimer = null;
    }
    setQuadFetchIndicator("searching", "Buscando...");

    try {
      const mapData = extractStreetsFromMapLibre(lat, lng);
      if (mapData.list.length >= 2) {
        applyStreetsListToQuadrante(lat, lng, mapData, "vector");
      }

      const overpassData = await queryOverpassGet(lat, lng);
      if (overpassData.list.length >= 2) {
        applyStreetsListToQuadrante(lat, lng, overpassData, "overpass");
      } else if (!cachedNearbyStreets.length) {
        const photonList = await queryPhotonNearbyStreets(lat, lng);
        if (photonList.length >= 2) {
          applyStreetsListToQuadrante(lat, lng, { list: photonList, segments: [] }, "photon");
        } else {
          setQuadFetchIndicator("error", "Tentando novamente...");
          retryStreetsTimer = setTimeout(() => {
            if (lastPos) fetchNearbyStreets(lastPos[0], lastPos[1], true);
          }, 6000);
        }
      }
    } catch (err) {
      if (!cachedNearbyStreets.length) {
        setQuadFetchIndicator("error", "Reconectando...");
        retryStreetsTimer = setTimeout(() => {
          if (lastPos) fetchNearbyStreets(lastPos[0], lastPos[1], true);
        }, 6000);
      }
    } finally {
      fetchingStreets = false;
    }
  }

  function syncIncursionEdgesUi(sectors) {
    const pairs = [
      { st: sectors.front, txtId: "azIncTxtFront", dotId: "azIncDotFront" },
      { st: sectors.rear, txtId: "azIncTxtRear", dotId: "azIncDotRear" },
      { st: sectors.left, txtId: "azIncTxtLeft", dotId: "azIncDotLeft" },
      { st: sectors.right, txtId: "azIncTxtRight", dotId: "azIncDotRight" }
    ];

    pairs.forEach(({ st, txtId, dotId }) => {
      const txtEl = document.getElementById(txtId);
      const dotEl = document.getElementById(dotId);
      if (!st) {
        if (txtEl) txtEl.textContent = "Sem via próxima";
        if (dotEl) dotEl.className = "az-inc-dot";
        return;
      }
      const m = Math.max(5, Math.round(st.distKm * 1000));
      let elevTag = "";
      if (typeof st.deltaElev === "number") {
        const dRound = Math.round(st.deltaElev);
        if (dRound >= 2) elevTag = ` ▲+${dRound}m`;
        else if (dRound <= -2) elevTag = ` ▼${dRound}m`;
      }
      if (txtEl) txtEl.textContent = `${st.name} • ${m}m${elevTag}`;
      if (dotEl) {
        dotEl.className = "az-inc-dot" + (st.deltaElev >= 2 ? " up" : st.deltaElev <= -2 ? " down" : "");
      }
    });
  }

  function drawOrbeVectorAndRing() {
    const canvas = document.getElementById("azQuadRingCanvas");
    const prep = prepareHiDpiCanvas(canvas);
    if (!prep) return;
    const { ctx, w, h } = prep;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = Math.min(w * 0.25, h * 0.34, 78);
    const refHeading = getQuadranteReferenceHeading();
    const refRad = (refHeading * Math.PI) / 180;

    ctx.strokeStyle = "#1E1D17";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR * 0.5, 0, Math.PI * 2);
    ctx.stroke();

    if (lastPos && cachedVectorSegments.length) {
      const cosLat = Math.cos((lastPos[0] * Math.PI) / 180);
      const scalePxPerKm = outerR / 0.13;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, outerR - 3, 0, Math.PI * 2);
      ctx.clip();

      cachedVectorSegments.forEach((segGroup) => {
        const isCurrent = segGroup.name.toLowerCase() === (cachedCurrentStreet || "").toLowerCase();
        ctx.strokeStyle = isCurrent ? "rgba(197, 168, 105, 0.72)" : "rgba(158, 154, 143, 0.38)";
        ctx.lineWidth = isCurrent ? 3.2 : 2;
        ctx.lineCap = "round";

        segGroup.lines.forEach(([ptA, ptB]) => {
          const dxA = (ptA[1] - lastPos[1]) * 111.32 * cosLat;
          const dyA = (ptA[0] - lastPos[0]) * 111.32;
          const dxB = (ptB[1] - lastPos[1]) * 111.32 * cosLat;
          const dyB = (ptB[0] - lastPos[0]) * 111.32;

          const rxA = dxA * Math.cos(refRad) - dyA * Math.sin(refRad);
          const ryA = dxA * Math.sin(refRad) + dyA * Math.cos(refRad);
          const rxB = dxB * Math.cos(refRad) - dyB * Math.sin(refRad);
          const ryB = dxB * Math.sin(refRad) + dyB * Math.cos(refRad);

          ctx.beginPath();
          ctx.moveTo(cx + rxA * scalePxPerKm, cy - ryA * scalePxPerKm);
          ctx.lineTo(cx + rxB * scalePxPerKm, cy - ryB * scalePxPerKm);
          ctx.stroke();
        });
      });

      ctx.restore();
    }

    if (orbePingWaveRadius > 0) {
      const alpha = Math.max(0, 1 - orbePingWaveRadius / 110);
      ctx.strokeStyle = `rgba(74, 222, 128, ${alpha.toFixed(2)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(outerR + 8, orbePingWaveRadius), 0, Math.PI * 2);
      ctx.stroke();
    }

    const sectorTags = ["FRENTE", "F-DIR", "DIREITA", "R-DIR", "RETAG.", "R-ESQ", "ESQUERDA", "F-ESQ"];

    for (let i = 0; i < 8; i++) {
      const st = cached8Sectors[i];
      const centerDeg = i * 45;
      const startRad = ((centerDeg - 20.5 - 90) * Math.PI) / 180;
      const endRad = ((centerDeg + 20.5 - 90) * Math.PI) / 180;

      let arcColor = "#24231C";
      let arcWidth = 4.5;
      if (st) {
        arcWidth = 7.5;
        if (showElevation && typeof st.deltaElev === "number") {
          if (st.deltaElev >= 2) arcColor = "#4ADE80";
          else if (st.deltaElev <= -2) arcColor = "#F87171";
          else arcColor = "#C5A869";
        } else {
          arcColor = "#C5A869";
        }
      }

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startRad, endRad);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = arcWidth;
      ctx.lineCap = "round";
      ctx.stroke();

      const radMid = ((centerDeg - 90) * Math.PI) / 180;
      if (st) {
        const labelR = outerR + 14;
        const lx = cx + Math.cos(radMid) * labelR;
        const ly = cy + Math.sin(radMid) * labelR;

        let align = "center";
        if (i === 1 || i === 2 || i === 3) align = "left";
        else if (i === 5 || i === 6 || i === 7) align = "right";

        ctx.textAlign = align;
        ctx.textBaseline = i === 0 ? "bottom" : i === 4 ? "top" : "middle";

        const meters = Math.max(5, Math.round(st.distKm * 1000));
        let elevTxt = "";
        if (showElevation && typeof st.deltaElev === "number" && Math.abs(Math.round(st.deltaElev)) >= 2) {
          const dR = Math.round(st.deltaElev);
          elevTxt = dR > 0 ? ` ▲+${dR}m` : ` ▼${dR}m`;
        }

        const shortVia = st.name.length > 17 ? st.name.slice(0, 16) + "…" : st.name;
        const yOffset = i === 0 ? -12 : i === 4 ? 12 : -5;

        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "#F2F0EA";
        ctx.fillText(shortVia, lx, ly + yOffset);

        ctx.font = "bold 8.5px monospace";
        ctx.fillStyle = arcColor;
        ctx.fillText(`${sectorTags[i]} • ${meters}m${elevTxt}`, lx, ly + yOffset + 11);
      } else {
        const dotX = cx + Math.cos(radMid) * (outerR + 8);
        const dotY = cy + Math.sin(radMid) * (outerR + 8);
        ctx.fillStyle = "#3A382E";
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const activeTarget = activeRouteDest || currentDestination;
    if (lastPos && activeTarget) {
      const targetBearing = calcBearingDeg(lastPos[0], lastPos[1], activeTarget.lat, activeTarget.lng);
      const relTargetRad = ((normalizeAngle(targetBearing - refHeading) - 90) * Math.PI) / 180;
      const bx = cx + Math.cos(relTargetRad) * (outerR - 6);
      const by = cy + Math.sin(relTargetRad) * (outerR - 6);

      ctx.strokeStyle = "#38BDF8";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 6);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#38BDF8";
      ctx.beginPath();
      ctx.arc(bx, by, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, cy - 7);
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(9, 9);
    ctx.lineTo(0, 4.5);
    ctx.lineTo(-9, 9);
    ctx.closePath();
    ctx.fillStyle = arrowColor;
    ctx.fill();
    ctx.strokeStyle = "#0D0D0D";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    const viaAtual = cachedCurrentStreet || "Via atual";
    const viaShort = viaAtual.length > 18 ? viaAtual.slice(0, 17) + "…" : viaAtual;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 9.5px sans-serif";
    ctx.fillStyle = "#C5A869";
    ctx.fillText(viaShort, cx, cy + 16);
  }

  function updateCornerBannerDetection() {
    const banner = document.getElementById("azQuadCornerBanner");
    if (!banner) return;

    const frontCandidates = [cached8Sectors[7], cached8Sectors[0], cached8Sectors[1]].filter(Boolean);
    const uniqueByName = [];
    const seen = new Set();
    frontCandidates.forEach((st) => {
      const k = st.name.toLowerCase();
      if (!seen.has(k) && st.distKm <= 0.085) {
        seen.add(k);
        uniqueByName.push(st);
      }
    });

    if (uniqueByName.length >= 2) {
      uniqueByName.sort((a, b) => a.distKm - b.distKm);
      const v1 = uniqueByName[0].name;
      const v2 = uniqueByName[1].name;
      const distM = Math.max(5, Math.round(uniqueByName[0].distKm * 1000));
      banner.textContent = `ESQUINA À FRENTE (${distM}m): ${v1} × ${v2}`;
      banner.classList.add("is-visible");
    } else {
      banner.classList.remove("is-visible");
    }
  }

  function recomputeQuadranteSectors(forceUpdate) {
    ensureQuadranteCardMounted();
    const syncedLocStreet = readSyncedStreetFromLocationCard();
    if (syncedLocStreet) cachedCurrentStreet = syncedLocStreet;

    if (!lastPos || !cachedNearbyStreets.length) {
      drawOrbeVectorAndRing();
      return;
    }

    if (!forceUpdate && (isHeadingManuallyLocked || Date.now() < handlingFreezeUntil)) {
      return;
    }

    const refHeading = getQuadranteReferenceHeading();
    const now = Date.now();

    if (!forceUpdate && lastQuadHeading !== null) {
      const angDiff = Math.abs(shortestAngleDiff(lastQuadHeading, refHeading));
      if (angDiff < 18 || now - lastQuadUpdateTime < 1300) {
        return;
      }
    }

    lastQuadHeading = refHeading;
    lastQuadUpdateTime = now;

    const octants = [null, null, null, null, null, null, null, null];
    cachedNearbyStreets.forEach((st) => {
      const absBearing = calcBearingDeg(lastPos[0], lastPos[1], st.lat, st.lng);
      const rel = normalizeAngle(absBearing - refHeading);
      const idx = Math.floor(normalizeAngle(rel + 22.5) / 45) % 8;
      if (!octants[idx] || st.distKm < octants[idx].distKm) {
        octants[idx] = st;
      }
    });
    cached8Sectors = octants;

    const sectors = { front: null, right: null, rear: null, left: null };
    cachedNearbyStreets.forEach((st) => {
      const absBearing = calcBearingDeg(lastPos[0], lastPos[1], st.lat, st.lng);
      const rel = normalizeAngle(absBearing - refHeading);

      let key = "front";
      if (rel >= 45 && rel < 135) key = "right";
      else if (rel >= 135 && rel < 225) key = "rear";
      else if (rel >= 225 && rel < 315) key = "left";

      if (!sectors[key] || st.distKm < sectors[key].distKm) {
        sectors[key] = st;
      }
    });
    cachedSectors = sectors;

    updateCornerBannerDetection();
    drawOrbeVectorAndRing();
    syncIncursionEdgesUi(sectors);
  }

  function renderAnimatedEspectroMesh(targetCanvas, cotaLabelEl, phase) {
    const prep = prepareHiDpiCanvas(targetCanvas);
    if (!prep) return;
    const { ctx, w, h } = prep;
    ctx.clearRect(0, 0, w, h);

    const cotaBase = typeof lastAltitude === "number" ? Math.round(lastAltitude) : null;
    if (cotaLabelEl) {
      cotaLabelEl.textContent = cotaBase !== null ? `Cota: ${cotaBase} m` : "Cota: ---";
    }

    const cx = w / 2;
    const cy = h * 0.56;
    const refDeg = getQuadranteReferenceHeading();
    const yawRad = ((refDeg + Math.sin(phase) * 14) * Math.PI) / 180;
    const tilt = 0.52;
    const scaleX = Math.min(w * 0.16, 44);
    const scaleY = scaleX * tilt;
    const elevScale = Math.min(h * 0.018, 3.2);

    const grid = elevationGrid5x5 || [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ];

    function projectNode(r, c) {
      const gx = c - 2;
      const gy = r - 2;
      const z = grid[r][c];
      const rx = gx * Math.cos(yawRad) - gy * Math.sin(yawRad);
      const ry = gx * Math.sin(yawRad) + gy * Math.cos(yawRad);
      return {
        x: cx + rx * scaleX,
        y: cy + ry * scaleY - z * elevScale,
        z
      };
    }

    const proj = [];
    for (let r = 0; r < 5; r++) {
      const row = [];
      for (let c = 0; c < 5; c++) {
        row.push(projectNode(r, c));
      }
      proj.push(row);
    }

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const p = proj[r][c];
        const avgZ = p.z;
        const strokeCol =
          avgZ >= 1.8 ? "rgba(74, 222, 128, 0.78)" : avgZ <= -1.8 ? "rgba(248, 113, 113, 0.78)" : "rgba(197, 168, 105, 0.52)";

        if (c < 4) {
          const pRight = proj[r][c + 1];
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = r === 2 ? 1.8 : 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pRight.x, pRight.y);
          ctx.stroke();
        }
        if (r < 4) {
          const pDown = proj[r + 1][c];
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = c === 2 ? 1.8 : 1.1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pDown.x, pDown.y);
          ctx.stroke();
        }
      }
    }

    const scanNorm = (Math.sin(phase * 1.4) + 1) / 2;
    const scanY = h * 0.22 + scanNorm * (h * 0.62);
    const grad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12);
    grad.addColorStop(0, "rgba(197, 168, 105, 0)");
    grad.addColorStop(0.5, "rgba(197, 168, 105, 0.22)");
    grad.addColorStop(1, "rgba(197, 168, 105, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(8, scanY - 12, w - 16, 24);

    const centerPt = proj[2][2];
    ctx.fillStyle = arrowColor;
    ctx.beginPath();
    ctx.arc(centerPt.x, centerPt.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0D0D0D";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const callouts = [
      { st: cachedSectors.front, dx: 0, dy: -h * 0.34 },
      { st: cachedSectors.rear, dx: 0, dy: h * 0.32 },
      { st: cachedSectors.left, dx: -w * 0.31, dy: -4 },
      { st: cachedSectors.right, dx: w * 0.31, dy: 4 }
    ];

    callouts.forEach(({ st, dx, dy }) => {
      if (!st) return;
      const dVal = typeof st.deltaElev === "number" ? Math.round(st.deltaElev) : 0;
      const col = dVal >= 2 ? "#4ADE80" : dVal <= -2 ? "#F87171" : "#C5A869";
      const tx = cx + dx;
      const ty = cy + dy;

      ctx.textAlign = "center";
      ctx.font = "bold 9.5px sans-serif";
      ctx.fillStyle = "#F2F0EA";
      ctx.fillText(st.name.slice(0, 18), tx, ty);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = col;
      const sign = dVal > 0 ? "+" : "";
      ctx.fillText(`${Math.round(st.distKm * 1000)}m (${sign}${dVal}m)`, tx, ty + 11);
    });
  }

  function drawTerrainSideProfile() {
    const prep = prepareHiDpiCanvas(canvasSide);
    if (!prep) return;
    const { ctx: sctx, w: sw, h: sh } = prep;
    sctx.clearRect(0, 0, sw, sh);

    const baseLineY = sh * 0.56;
    sctx.strokeStyle = "#28271F";
    sctx.setLineDash([3, 3]);
    sctx.beginPath();
    sctx.moveTo(16, baseLineY);
    sctx.lineTo(sw - 16, baseLineY);
    sctx.stroke();
    sctx.setLineDash([]);

    const rearSt = cachedSectors.rear;
    const frontSt = cachedSectors.front;
    const rearDelta = rearSt && typeof rearSt.deltaElev === "number" ? rearSt.deltaElev : 0;
    const frontDelta = frontSt && typeof frontSt.deltaElev === "number" ? frontSt.deltaElev : 0;

    const rearY = Math.max(24, Math.min(sh - 26, baseLineY - rearDelta * 1.6));
    const frontY = Math.max(24, Math.min(sh - 26, baseLineY - frontDelta * 1.6));

    const pLeft = { x: 54, y: rearY };
    const pMid = { x: sw / 2, y: baseLineY };
    const pRight = { x: sw - 54, y: frontY };

    sctx.fillStyle = "rgba(197, 168, 105, 0.14)";
    sctx.beginPath();
    sctx.moveTo(pLeft.x, sh - 12);
    sctx.lineTo(pLeft.x, pLeft.y);
    sctx.lineTo(pMid.x, pMid.y);
    sctx.lineTo(pRight.x, pRight.y);
    sctx.lineTo(pRight.x, sh - 12);
    sctx.closePath();
    sctx.fill();

    sctx.strokeStyle = "#C5A869";
    sctx.lineWidth = 2.5;
    sctx.beginPath();
    sctx.moveTo(pLeft.x, pLeft.y);
    sctx.lineTo(pMid.x, pMid.y);
    sctx.lineTo(pRight.x, pRight.y);
    sctx.stroke();

    [
      { pt: pLeft, st: rearSt, tag: "RETAGUARDA" },
      { pt: pMid, st: { name: cachedCurrentStreet || "Via atual", deltaElev: 0 }, tag: "VOCÊ" },
      { pt: pRight, st: frontSt, tag: "FRENTE" }
    ].forEach((item) => {
      sctx.fillStyle = item.tag === "VOCÊ" ? arrowColor : "#C5A869";
      sctx.beginPath();
      sctx.arc(item.pt.x, item.pt.y, 4.5, 0, Math.PI * 2);
      sctx.fill();

      sctx.fillStyle = "#9E9A8F";
      sctx.font = "bold 9px sans-serif";
      sctx.textAlign = "center";
      sctx.fillText(item.tag, item.pt.x, 14);

      if (item.st) {
        sctx.fillStyle = "#F2F0EA";
        sctx.font = "bold 10px sans-serif";
        sctx.fillText(item.st.name.slice(0, 20), item.pt.x, sh - 18);
        if (item.tag !== "VOCÊ" && typeof item.st.deltaElev === "number") {
          const d = Math.round(item.st.deltaElev);
          sctx.fillStyle = d >= 2 ? "#4ADE80" : d <= -2 ? "#F87171" : "#9E9A8F";
          sctx.fillText(`${d >= 0 ? "+" : ""}${d}m`, item.pt.x, sh - 6);
        }
      }
    });
  }

  function startEspectro3dLoop() {
    if (espectroAnimRunning) return;
    espectroAnimRunning = true;

    function frame() {
      const modalOpen = terrainModal && terrainModal.classList.contains("is-open");
      const incOpen = incOverlay && incOverlay.classList.contains("is-open");

      if (!modalOpen && !incOpen) {
        espectroAnimRunning = false;
        return;
      }

      if (!document.hidden) {
        espectroAnimPhase += 0.035;
        if (modalOpen) {
          renderAnimatedEspectroMesh(canvas3d, terrainCenterAlt, espectroAnimPhase);
        }
        if (incOpen) {
          renderAnimatedEspectroMesh(incReliefCanvas, incAltLabelEl, espectroAnimPhase);
        }
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  window.azimuteToggleTerrainModal = function (forceState) {
    if (!terrainModal) return;
    try { requestCompassPermissionIfNeeded(); } catch (_) {}
    const willOpen = typeof forceState === "boolean" ? forceState : !terrainModal.classList.contains("is-open");
    terrainModal.classList.toggle("is-open", willOpen);
    if (willOpen) {
      updateDirectionalIcons(true);
      if (lastPos) {
        fetchNearbyStreets(lastPos[0], lastPos[1], false);
      }
      drawTerrainSideProfile();
      startEspectro3dLoop();
    }
  };

  function handleIncomingGpsCoords(coords, fromMainEngine) {
    if (!coords || typeof coords.latitude !== "number" || typeof coords.longitude !== "number") return;
    const { latitude, longitude, accuracy, altitude, speed, heading } = coords;

    lastPos = [latitude, longitude];
    if (typeof accuracy === "number" && !Number.isNaN(accuracy)) {
      lastAccuracy = accuracy;
    }
    if (typeof altitude === "number" && !Number.isNaN(altitude)) {
      lastAltitude = altitude;
    }
    if (typeof speed === "number" && !Number.isNaN(speed)) {
      lastSpeed = speed;
    }
    if (typeof heading === "number" && !Number.isNaN(heading)) {
      lastGpsHeading = heading;
    }

    if (!accuracy || accuracy <= 30) {
      if (!prevTrackPos) {
        prevTrackPos = [latitude, longitude];
      } else {
        const movedKm = calcDistanceKm(prevTrackPos[0], prevTrackPos[1], latitude, longitude);
        if (movedKm >= 0.012) {
          computedGpsCourse = calcBearingDeg(prevTrackPos[0], prevTrackPos[1], latitude, longitude);
          prevTrackPos = [latitude, longitude];
          lastMoveTimestamp = Date.now();
        }
      }
    }

    setFluidMarkerTarget(latitude, longitude);

    if (radarMap && (isNavigationStarted || activeRouteDest)) {
      radarMap.easeTo({ center: [longitude, latitude], duration: 500 });
    }

    const modeTag = isMovingCourseActive() ? "Rumo GPS" : "Bússola";
    const srcLabel = fromMainEngine ? "GPS AZIMUTE" : `GPS ±${Math.round(accuracy || 0)}m`;
    if (statusEl) {
      statusEl.textContent = `${srcLabel} • ${modeTag}`;
    }

    refreshStabilizedHeading(false);
    updateTurnByTurnProgress();
    checkOffRouteAndRecalculate();
    if (incOverlay && incOverlay.classList.contains("is-open")) {
      renderIncursionPinsList();
    }

    if (fromMainEngine || !accuracy || accuracy <= 150) {
      fetchNearbyStreets(latitude, longitude, false);
    } else {
      recomputeQuadranteSectors(false);
    }

    if (firstGpsFix) {
      firstGpsFix = false;
      map.resize();
      map.jumpTo({ center: [longitude, latitude], zoom: 17 });
      if (headingUpMode) applyMapHeadingUp(stableHeading, true);
    } else if (followGps && Date.now() >= userTouchPauseUntil) {
      map.easeTo({
        center: [longitude, latitude],
        pitch: isNavigationStarted ? 52 : map.getPitch(),
        duration: 680,
        easing: (t) => 1 - Math.pow(1 - t, 2)
      });
    }
  }

  syncFromMainAzimuteGps(true);
  setInterval(() => { if (!document.hidden) syncFromMainAzimuteGps(false); }, 3500);

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        handleIncomingGpsCoords(pos.coords, false);
      },
      () => {
        syncFromMainAzimuteGps(false);
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 }
    );
  }

  window.azimuteGeoInvalidate = function () {
    requestAnimationFrame(() => {
      map.resize();
      updateCalibratorReadout();
      recomputeQuadranteSectors(true);
    });
  };

  window.azimuteGeoSetPoints = function (pointsArray) {
    localPoints = Array.isArray(pointsArray) ? pointsArray : [];
    refreshAllMapMarkersLayer();
  };

  let locObsTimer = null;
  const locObserver = new MutationObserver(() => {
    if (locObsTimer) return;
    locObsTimer = setTimeout(() => {
      locObsTimer = null;
      ensureQuadranteCardMounted();
      syncFromMainAzimuteGps(false);
      const synced = readSyncedStreetFromLocationCard();
      if (synced && synced !== cachedCurrentStreet) {
        cachedCurrentStreet = synced;
        recomputeQuadranteSectors(true);
      }
    }, 650);
  });
  const hudLocTarget = document.getElementById("azimuteLiveGpsHud") || document.body;
  locObserver.observe(hudLocTarget, { childList: true, subtree: true, characterData: true });

  if (document.getElementById("azGeoDrawerBody")?.classList.contains("is-open")) {
    map.resize();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof azimuteCurrentViewId !== "undefined" && azimuteCurrentViewId === "gps") {
      initAzimuteGeo();
    }
  });
} else if (typeof azimuteCurrentViewId !== "undefined" && azimuteCurrentViewId === "gps") {
  initAzimuteGeo();
}

(function () {
  "use strict";

  function onClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  }

  const SVG_ICONS = {
    fine_tune: '<svg viewBox="0 0 24 24"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    route: '<svg viewBox="0 0 24 24"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
    bloodhound: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="2"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    photo: '<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    prio: '<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    circle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
  };

  const TEAM_PALETTE = [
    { id: "azul", name: "AZUL", hex: "#3B82F6" },
    { id: "verde", name: "VERDE", hex: "#22C55E" },
    { id: "laranja", name: "LARANJA", hex: "#F97316" },
    { id: "ciano", name: "CIANO", hex: "#06B6D4" },
    { id: "roxo", name: "ROXO", hex: "#C084FC" },
    { id: "amarelo", name: "AMARELO", hex: "#EAB308" },
    { id: "safira", name: "SAFIRA", hex: "#6366F1" },
    { id: "branco", name: "BRANCO", hex: "#F8FAFC" }
  ];

  const ALL_WHEEL_ACTIONS = [
    { id: "fine_tune", svg: SVG_ICONS.fine_tune, label: "AJUSTE" },
    { id: "trash", svg: SVG_ICONS.trash, label: "LIXEIRA", cls: "is-trash" },
    { id: "route", svg: SVG_ICONS.route, label: "ROTA" },
    { id: "bloodhound", svg: SVG_ICONS.bloodhound, label: "CÃO BUSCA", cls: "is-hunt" },
    { id: "edit", svg: SVG_ICONS.edit, label: "EDITAR" },
    { id: "photo", svg: SVG_ICONS.photo, label: "FOTO" }
  ];

  const ALL_MAP_WHEEL_FAVORITES = [
    { id: "new_pin", label: "PIN", svg: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' },
    { id: "new_prio", label: "PRIO", cls: "is-trash", svg: SVG_ICONS.prio },
    { id: "new_photo", label: "FOTO", svg: SVG_ICONS.photo },
    { id: "new_bloodhound", label: "CÃO K9", cls: "is-hunt", svg: SVG_ICONS.bloodhound },
    { id: "trail_tool", label: "PEGADAS", svg: '<svg viewBox="0 0 24 24"><path d="M7 11c-1.4 0-2.4-1.3-2.4-3.3C4.6 5.5 5.8 4 7.3 4s2.5 1.3 2.5 3.3c0 1.9-1.1 3.7-2.8 3.7z"/><path d="M16.7 15c-1.4 0-2.4-1.3-2.4-3.3 0-2.2 1.2-3.7 2.7-3.7s2.5 1.3 2.5 3.3c0 1.9-1.1 3.7-2.8 3.7z"/></svg>' },
    { id: "new_circle", label: "DOMO", svg: SVG_ICONS.circle },
    { id: "new_flag", label: "BANDEIRA", svg: '<svg viewBox="0 0 24 24"><path d="M4 21V4"/><path d="M4 4h11l-1.5 4L15 12H4"/></svg>' },
    { id: "draw_free", label: "CANETA", svg: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>' },
    { id: "toggle_ruler", label: "RÉGUA", svg: '<svg viewBox="0 0 24 24"><path d="M21.3 8.7L8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4z"/></svg>' },
    { id: "trace_escada", label: "ESCADA", svg: '<svg viewBox="0 0 24 24"><path d="M4 20h4v-4h4v-4h4V8h4V4"/><path d="M4 14l10-10"/></svg>' },
    { id: "trace_beco", label: "BECO", svg: '<svg viewBox="0 0 24 24"><path d="M5 20c0-6 6-4 6-10s6-4 6-6"/><path d="M9 20c0-5 5-3 5-9s5-3 5-6" stroke-dasharray="2 2"/></svg>' },
    { id: "planta_tool", label: "PLANTA", svg: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 11h8v9"/><path d="M15 4v7h6"/></svg>' },
    { id: "wasp_tool", label: "WASP", svg: '<svg viewBox="0 0 24 24"><path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>' },
    { id: "radio_conv_tool", label: "RÁDIO", svg: '<svg viewBox="0 0 24 24"><rect x="6" y="7" width="12" height="14" rx="2"/><path d="M9 7V2"/><rect x="9" y="10" width="6" height="4"/></svg>' },
    { id: "copy_qth", label: "QTH", svg: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>' },
    { id: "route_here", label: "ROTA", svg: SVG_ICONS.route },
    { id: "clear_route", label: "APG ROTA", cls: "is-trash", svg: '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><path d="M8.5 16.5L13 12"/><line x1="15" y1="5" x2="21" y2="11"/><line x1="21" y1="5" x2="15" y2="11"/></svg>' },
    { id: "orbit_point", label: "ORBITAR", svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="3.6" y1="9" x2="20.4" y2="9"/><line x1="3.6" y1="15" x2="20.4" y2="15"/><path d="M12 3a13 13 0 0 1 0 18"/><path d="M12 3a13 13 0 0 0 0 18"/></svg>' },
    { id: "drone_mode", label: "DRONE", svg: '<svg viewBox="0 0 24 24"><circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7 7l3 3"/><path d="M17 7l-3 3"/><path d="M7 17l3-3"/><path d="M17 17l-3-3"/><rect x="10" y="10" width="4" height="4" rx="1"/></svg>' }
  ];

  const DEFAULT_MAP_WHEEL_FAVS = ["new_pin", "new_prio", "new_photo", "new_circle", "new_flag", "orbit_point"];
  let savedMapWheelFavIds = (function () {
    try {
      const raw = JSON.parse(localStorage.getItem("az_tac_wheel_map_favs_v1") || "null");
      if (Array.isArray(raw)) {
        const valid = raw.filter(function (id) { return ALL_MAP_WHEEL_FAVORITES.some(function (a) { return a.id === id; }); });
        if (valid.length >= 3) return valid.slice(0, 9);
      }
    } catch (_) {}
    return DEFAULT_MAP_WHEEL_FAVS.slice();
  })();

  const savedWheelIds = JSON.parse(localStorage.getItem("az_tac_wheel_items") || "null") ||
    ["fine_tune", "trash", "route", "bloodhound", "edit", "photo"];

  const savedQra = (localStorage.getItem("az_tac_my_qra") || "").trim();
  const cleanQra = savedQra.toUpperCase() === "SGT PABLO" ? "" : savedQra;
  if (!cleanQra) localStorage.removeItem("az_tac_my_qra");

  const tac = {
    maps: [],
    myId: localStorage.getItem("az_tac_uid") || ("u_" + Math.random().toString(36).slice(2, 8)),
    myQra: cleanQra,
    myColorId: localStorage.getItem("az_tac_my_color") || "azul",
    roomCode: localStorage.getItem("az_tac_room") || "",
    firebaseUrl: localStorage.getItem("az_tac_fb_url") || "",
    ghostEnabled: localStorage.getItem("az_tac_ghost_exit") !== "0",
    wheelEnabledIds: savedWheelIds,
    wheelMapFavIds: savedMapWheelFavIds,
    dockOrganizeMode: false,
    penWidth: Math.max(2, Math.min(16, parseInt(localStorage.getItem("az_tac_pen_width_v1") || "4", 10) || 4)),
    editingStrokeId: null,
    pttEngine: localStorage.getItem("az_tac_ptt_engine") || "pcm_binary", // webm_blocks | pcm_binary | webrtc_p2p
    satMode: false,
    teammates: {},
    selectedMateUid: "",
    toolMode: null,
    rulerActive: false,
    rulerCoords: [],
    drawActive: false,
    drawStrokes: [],
    eraserActive: false,
    crumbRouteActive: false,
    breadcrumbs: [],
    crumbMarkers: [],
    activeCrumbIndex: -1,
    hasActiveRoute: false,
    circleCenter: null,
    circleRadius: 150,
    bloodhoundTarget: null,
    bloodhoundList: [],
    grgConfig: null,
    grgHomeCode: localStorage.getItem("az_tac_grg_home") || "",
    trailActive: false,
    trailScope: "local",
    myTrailCoords: [],
    mateTrails: {},
    myPassivePegadas: (function () {
      try {
        const arr = JSON.parse(localStorage.getItem("az_tac_passive_pegadas_v1") || "[]");
        return Array.isArray(arr) ? arr : [];
      } catch (_) { return []; }
    })(),
    matePassivePegadas: {},
    visiblePegadasUids: {},
    pegadasTimeMarkers: [],
    waspItems: [],
    waspCounter: 0,
    tacticalGeoms: [],
    geomHandles: [],
    terrainTraces: [],
    traceVertexHandles: [],
    activeTraceId: null,
    activeTraceKind: null,
    editingDetailTraceId: null,
    editingWaspId: null,
    traceCounter: 0,
    floorplans: [],
    floorplanHandles: [],
    activeFloorplanId: null,
    editingFloorplanId: null,
    flags: [],
    flagMarkers: [],
    flagCounter: 0,
    activeFlag: null,
    photoTargetFlag: null,
    mapTexts: [],
    textMarkers: [],
    textSizePx: 14,
    textAngleDeg: 0,
    textColorHex: "",
    textBgColor: "",
    editingTextObj: null,
    pendingTextCoords: null,
    editingPinColorHex: "",
    editingPinIconId: "padrao",
    editingPinCamAngle: 0,
    pinIconCatFilter: "ALL",
    myManualStatus: localStorage.getItem("az_tac_my_status") || "EM PATRULHA",
    geofenceInsideMap: {},
    pins: [],
    undoHistory: [],
    redoHistory: [],
    pendingPinCoords: null,
    pendingPinType: "custom",
    editingPinObj: null,
    activePin: null,
    fineTunePin: null,
    fineTuneTarget: null,
    fineTuneStartPos: null,
    fineTuneStepM: 2,
    wheelMode: "new_press",
    ws: null,
    roomJoined: false,
    floatPttPos: null,
    enlaceActivePing: null,
    activePinnedPoll: null,
    _pinnedAutoCloseTimer: null,
    _enlaceHeartbeatTimer: null,
    _enlaceEchoTimeout: null,
    _pendingHbEchoId: "",
    bc: ("BroadcastChannel" in window) ? new BroadcastChannel("azimute_tac_sync") : null,
    myPos: null,
    prevPos: null,
    myBatteryPct: null,
    lastRunAlert: 0,
    lastGeocodeKey: "",
    resolvedAddress: "",
    dockOpen: false,
    audioMuted: false,
    audioCtx: null,
    // Motor 1: WebM Blocks
    pttStream: null,
    pttSegmentTimer: null,
    activeSegmentRec: null,
    isRecordingPtt: false,
    pttAutoStopTimer: null,
    rxAudioQueue: [],
    rxPlaying: false,
    rxAudioEl: null,
    // Motor 2: AudioContext PCM 16kHz Binário
    pcmProcessor: null,
    pcmSource: null,
    pcmNextPlayTime: 0,
    // Motor 3: WebRTC P2P
    rtcPeers: {},
    rtcLocalStream: null,
    audioBlockedUids: new Set(),
    _orbitActive: false,
    _orbitPaused: false,
    _orbitRaf: 0,
    _orbitDir: 1,
    _orbitSpeedDeg: 26,
    _orbitCenter: null,
    droneMode: false,
    droneFollowUid: "__FREE__",
    droneFreeFlight: false,
    dronePrevPitch: 0,
    droneRaf: 0,
    hasTelestrationBase: false,
    mapLocked: false
  };
  window.azTacState = tac;
  localStorage.setItem("az_tac_uid", tac.myId);

  function getColorHex(id) {
    const f = TEAM_PALETTE.find(function (c) { return c.id === id; });
    return f ? f.hex : "#C5A869";
  }

  function isLocalOnlineInRoom() {
    return Boolean(tac.roomCode && (tac.roomJoined || (tac.ws && tac.ws.readyState === 1)));
  }

  function getRoomOnlineCount() {
    const mateCount = Object.keys(tac.teammates || {}).length;
    return isLocalOnlineInRoom() ? (1 + mateCount) : mateCount;
  }

  function hexToRgb(hex) {
    let h = String(hex || "").trim().replace(/^#/, "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  function getRelativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0.5;
    const ch = rgb.map(function (v) {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  function calcContrastRatio(lumA, lumB) {
    const hi = Math.max(lumA, lumB);
    const lo = Math.min(lumA, lumB);
    return (hi + 0.05) / (lo + 0.05);
  }

  function isCurrentViewerDarkBg() {
    const theme = localStorage.getItem("az_geo_map_theme") || "light";
    return Boolean(tac.satMode || theme !== "light");
  }

  function getUsedTeamHexSet() {
    const used = new Set();
    used.add(getColorHex(tac.myColorId).toUpperCase());
    Object.values(tac.teammates || {}).forEach(function (m) {
      if (m && m.colorId) used.add(getColorHex(m.colorId).toUpperCase());
    });
    return used;
  }

  function isColorNearUsed(candidateHex, usedSet) {
    const candUp = String(candidateHex || "").toUpperCase();
    if (usedSet.has(candUp)) return true;
    const cRgb = hexToRgb(candUp);
    if (!cRgb) return false;
    let conflict = false;
    usedSet.forEach(function (uHex) {
      const uRgb = hexToRgb(uHex);
      if (!uRgb) return;
      const dist = Math.hypot(cRgb[0] - uRgb[0], cRgb[1] - uRgb[1], cRgb[2] - uRgb[2]);
      if (dist < 42) conflict = true;
    });
    return conflict;
  }

  // Preserva sempre a cor escolhida do operador (Azul, Verde, Dourado, etc.) nos marcadores, ícones e linhas;
  // ajusta apenas quando a cor ficaria praticamente invisível contra o fundo (ex.: branco no claro / preto no escuro).
  function resolveSmartDisplayColor(origHex, role) {
    const raw = (origHex || "#C5A869").trim();
    const rgb = hexToRgb(raw);
    if (!rgb) return raw;
    const isDarkBg = isCurrentViewerDarkBg();
    const bgLum = isDarkBg ? 0.035 : 0.78;
    const colLum = getRelativeLuminance(raw);
    const ratio = calcContrastRatio(colLum, bgLum);
    const minRatio = role === "grg" ? 2.8 : 1.28;
    if (ratio >= minRatio) return raw;

    const lightBgSafe = ["#1D4ED8", "#991B1B", "#047857", "#6B21A8", "#9A3412", "#831843", "#0F766E", "#B45309"];
    const darkBgSafe = ["#38BDF8", "#F8FAFC", "#FDE047", "#FB7185", "#A78BFA", "#4ADE80", "#FB923C", "#2DD4BF"];
    const pool = isDarkBg ? darkBgSafe : lightBgSafe;
    const used = getUsedTeamHexSet();

    for (let i = 0; i < pool.length; i++) {
      if (!isColorNearUsed(pool[i], used)) return pool[i];
    }
    for (let i = 0; i < pool.length; i++) {
      if (!used.has(pool[i].toUpperCase())) return pool[i];
    }
    return pool[0];
  }

  function cloneTacData(obj) {
    try { return JSON.parse(JSON.stringify(obj)); } catch (_) { return obj; }
  }

  function showToast(msg, ms, isAlert) {
    const el = document.getElementById("azTacHudToast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("is-alert", Boolean(isAlert));
    el.style.display = "block";
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.display = "none"; }, ms || 3400);
  }

  function vibratePattern(pat) {
    if (navigator.vibrate) { try { navigator.vibrate(pat); } catch (_) {} }
  }

  function formatDistance(meters) {
    if (meters >= 1000) return (meters / 1000).toFixed(2) + " km";
    return Math.round(meters) + " m";
  }

  function closeDock() {
    tac.dockOpen = false;
    document.getElementById("azAtakRightDock").classList.remove("is-open");
    document.getElementById("azAtakHamburgerBtn").classList.remove("is-active");
    if (typeof syncSinglePttMode === "function") syncSinglePttMode();
  }

  function syncHamburgerAndDockToolsUi() {
    const anyArmed = Boolean(
      tac.drawActive || tac.eraserActive || tac.rulerActive || tac.crumbRouteActive || tac.toolMode
    );
    const hBtn = document.getElementById("azAtakHamburgerBtn");
    if (hBtn) hBtn.classList.toggle("has-armed-tool", anyArmed);

    const tileStates = {
      draw_free: Boolean(tac.drawActive),
      eraser_tool: Boolean(tac.eraserActive),
      toggle_ruler: Boolean(tac.rulerActive),
      draw_route: Boolean(tac.crumbRouteActive),
      trail_tool: Boolean(tac.trailActive),
      wasp_tool: tac.toolMode === "wasp_pick",
      flag_tool: tac.toolMode === "flag_pick",
      text_tool: tac.toolMode === "text_pick",
      gpe: tac.toolMode === "gpe",
      pin_edit: tac.toolMode === "pin_edit",
      vtr_pin: tac.toolMode === "vtr_pin",
      circle_tool: tac.toolMode === "circle_pick",
      bloodhound_pick: tac.toolMode === "bloodhound_pick",
      trace_escada: tac.toolMode === "trace_escada",
      trace_beco: tac.toolMode === "trace_beco",
      trace_cerca: tac.toolMode === "trace_cerca",
      trace_barricada: tac.toolMode === "trace_barricada",
      planta_tool: Boolean(tac.editingFloorplanId || document.getElementById("azPlantaModal")?.classList.contains("is-open"))
    };
    Object.keys(tileStates).forEach(function (actKey) {
      const tile = document.querySelector(`[data-grid-act="${actKey}"]`);
      if (tile) tile.classList.toggle("is-on", tileStates[actKey]);
    });
    const undoBtn = document.getElementById("azDockUndoBtn");
    const redoBtn = document.getElementById("azDockRedoBtn");
    if (undoBtn) {
      const hasU = Array.isArray(tac.undoHistory) && tac.undoHistory.length > 0;
      undoBtn.style.opacity = hasU ? "1" : "0.45";
    }
    if (redoBtn) {
      const hasR = Array.isArray(tac.redoHistory) && tac.redoHistory.length > 0;
      redoBtn.style.opacity = hasR ? "1" : "0.45";
    }
  }

  // Garante exclusividade estrita: apenas UMA ferramenta armada por vez
  function disarmAllTacticalTools(exceptAct) {
    if (exceptAct !== "draw_free") tac.drawActive = false;
    if (exceptAct !== "eraser_tool") tac.eraserActive = false;
    if (exceptAct !== "toggle_ruler") tac.rulerActive = false;
    if (exceptAct !== "draw_route") tac.crumbRouteActive = false;
    const toolMap = {
      wasp_tool: "wasp_pick",
      flag_tool: "flag_pick",
      text_tool: "text_pick",
      gpe: "gpe",
      pin_edit: "pin_edit",
      vtr_pin: "vtr_pin",
      circle_tool: "circle_pick",
      bloodhound_pick: "bloodhound_pick",
      grg_home_pick: "grg_home_pick",
      trace_escada: "trace_escada",
      trace_beco: "trace_beco",
      trace_cerca: "trace_cerca",
      trace_barricada: "trace_barricada"
    };
    if (!exceptAct || toolMap[exceptAct] !== tac.toolMode) {
      tac.toolMode = null;
      if (tac.activeTraceId && (!exceptAct || !String(exceptAct).startsWith("trace_"))) {
        tac.activeTraceId = null;
        tac.activeTraceKind = null;
        if (typeof renderTerrainTracesOnMaps === "function") renderTerrainTracesOnMaps(true);
      }
    }
    tac.maps.forEach(function (m) {
      if (m && m.dragPan) {
        if (tac.drawActive || tac.eraserActive || tac.mapLocked) m.dragPan.disable();
        else m.dragPan.enable();
      }
    });
  }

  function refreshLeftControls() {
    const row = document.getElementById("azLeftControlsRow");
    if (row) row.classList.remove("is-visible");
    const routePill = document.getElementById("azActiveRouteClearPill");
    if (routePill) {
      const hasAnyRoute = Boolean(tac.hasActiveRoute || (Array.isArray(tac.breadcrumbs) && tac.breadcrumbs.length > 0));
      routePill.classList.toggle("is-open", hasAnyRoute);
    }
    syncHamburgerAndDockToolsUi();
    if (typeof syncWaspHudBar === "function") syncWaspHudBar();
  }

  /* =====================================================================
     VOZ DE RECEPÇÃO (SOMENTE QUEM RECEBE A MENSAGEM OUVE)
     ===================================================================== */
  const TTS_STORAGE_KEY = "az_tac_tts_voice_uri";
  let ttsVoices = [];

  function loadTtsVoices() {
    if (!("speechSynthesis" in window)) return;
    ttsVoices = window.speechSynthesis.getVoices() || [];
    const sel = document.getElementById("azTtsVoiceSelect");
    if (!sel || !ttsVoices.length) return;
    const saved = localStorage.getItem(TTS_STORAGE_KEY) || "";
    const sorted = ttsVoices.slice().sort(function (a, b) {
      const aPt = /pt/i.test(a.lang) ? 0 : 1;
      const bPt = /pt/i.test(b.lang) ? 0 : 1;
      return aPt - bPt || a.name.localeCompare(b.name);
    });
    sel.innerHTML = sorted.map(function (v) {
      return `<option value="${v.voiceURI}" ${v.voiceURI === saved ? "selected" : ""}>${v.name}</option>`;
    }).join("");
  }

  function speakReceivedTacticalText(text) {
    if (!text || tac.audioMuted || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const uri = localStorage.getItem(TTS_STORAGE_KEY) || "";
      const v = ttsVoices.find(function (item) { return item.voiceURI === uri; });
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "pt-BR"; }
      u.rate = 1.1;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  if ("speechSynthesis" in window) {
    loadTtsVoices();
    window.speechSynthesis.onvoiceschanged = loadTtsVoices;
  }

  function reconnectWhenResuming() {
    if (!tac.roomCode || !tac.myQra) return;
    if (!tac.ws || tac.ws.readyState !== 1) connectLiveRoom();
    monitorGps();
  }

  window.addEventListener("online", reconnectWhenResuming);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") reconnectWhenResuming();
  });
  window.addEventListener("pageshow", reconnectWhenResuming);
  window.addEventListener("focus", reconnectWhenResuming);

  /* =====================================================================
     MOTORES DE RÁDIO PTT (3 OPÇÕES ISOLADAS: WEBM | PCM 16KHZ | WEBRTC P2P)
     ===================================================================== */
  function unlockAudioOutput() {
    if (!tac.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) tac.audioCtx = new AudioCtx();
    }
    if (tac.audioCtx && tac.audioCtx.state === "suspended") {
      tac.audioCtx.resume().catch(function () {});
    }
    if (!tac.rxAudioEl) {
      tac.rxAudioEl = new Audio();
      tac.rxAudioEl.preload = "auto";
    }
  }
  document.addEventListener("pointerdown", unlockAudioOutput, { passive: true });

  function playTone(f1, f2, dur, vol) {
    if (tac.audioMuted) return;
    try {
      unlockAudioOutput();
      const ctx = tac.audioCtx;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      gain.gain.value = vol || 0.2;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(f1, now);
      if (f2) osc.frequency.setValueAtTime(f2, now + dur / 2);
      osc.start(now);
      osc.stop(now + dur);
    } catch (_) {}
  }

  function setSpeakerBanner(qra, show) {
    const b = document.getElementById("azActiveSpeakerBanner");
    const t = document.getElementById("azActiveSpeakerText");
    if (!b || !t) return;
    if (show && qra) { t.textContent = `${qra} TRANSMITINDO`; b.classList.add("is-on"); }
    else b.classList.remove("is-on");
  }

  function updateEngineHint() {
    const hint = document.getElementById("azPttEngineHint");
    if (!hint) return;
    if (tac.pttEngine === "pcm_binary") {
      hint.textContent = "Modo 2 ativo: 16kHz mono binário MQTT (~250ms delay, sem cortes).";
    } else if (tac.pttEngine === "webrtc_p2p") {
      hint.textContent = "Modo 3 ativo: WebRTC P2P direto (<150ms, sujeito a CGNAT 4G/5G).";
    } else {
      hint.textContent = "Modo 1 ativo: blocos curtos WebM/Opus (padrão).";
    }
  }

  function syncPttUi() {
    const fb = document.getElementById("azFloatingMapPttBtn");
    const db = document.getElementById("azPttHoldBtn");
    const wb = document.getElementById("azWaPttBtn");
    if (fb) { fb.classList.toggle("is-tx", tac.isRecordingPtt); fb.textContent = tac.isRecordingPtt ? "TX ATIVO" : "PTT"; }
    if (db) { db.classList.toggle("is-tx", tac.isRecordingPtt); db.textContent = tac.isRecordingPtt ? "NO AR • CLIQUE P/ ENCERRAR" : "TRANSMITIR PTT (OU FONE P2)"; }
    if (wb) { wb.classList.toggle("is-tx", tac.isRecordingPtt); wb.textContent = tac.isRecordingPtt ? "TX ATIVO" : "PTT"; }
    if (window.AzVoiceJarvis && typeof window.AzVoiceJarvis.setRadioActive === "function") {
      window.AzVoiceJarvis.setRadioActive(Boolean(tac.isRecordingPtt));
    }
  }

  // --- MOTOR 1: BLOCOS WEBM (ATUAL) ---
  function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "audio/webm";
    const bin = atob(parts[1]);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function enqueueWebmChunk(dataUrl, qra, uid) {
    if (tac.audioMuted || !dataUrl) return;
    if (uid && tac.audioBlockedUids && tac.audioBlockedUids.has(uid)) return;
    tac.rxAudioQueue.push({ dataUrl: dataUrl, qra: qra });
    drainWebmQueue();
  }

  async function drainWebmQueue() {
    if (tac.rxPlaying || tac.rxAudioQueue.length === 0) return;
    tac.rxPlaying = true;
    const item = tac.rxAudioQueue.shift();
    setSpeakerBanner(item.qra, true);
    let objUrl = null;
    try {
      unlockAudioOutput();
      const blob = dataUrlToBlob(item.dataUrl);
      objUrl = URL.createObjectURL(blob);
      const player = tac.rxAudioEl || new Audio();
      player.src = objUrl;
      player.volume = 1.0;
      await new Promise(function (resolve) {
        const done = function () { player.onended = null; player.onerror = null; resolve(); };
        player.onended = done;
        player.onerror = done;
        const p = player.play();
        if (p && typeof p.catch === "function") p.catch(done);
      });
    } catch (_) {}
    if (objUrl) try { URL.revokeObjectURL(objUrl); } catch (_) {}
    tac.rxPlaying = false;
    if (tac.rxAudioQueue.length > 0) drainWebmQueue();
    else setSpeakerBanner("", false);
  }

  function recordSingleWebmSegment() {
    if (!tac.isRecordingPtt || !tac.pttStream) return;
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");
    const rec = mime ? new MediaRecorder(tac.pttStream, { mimeType: mime, audioBitsPerSecond: 16000 }) : new MediaRecorder(tac.pttStream);
    const chunks = [];
    tac.activeSegmentRec = rec;

    rec.ondataavailable = function (e) { if (e.data && e.data.size > 0) chunks.push(e.data); };
    rec.onstop = function () {
      if (tac.isRecordingPtt) recordSingleWebmSegment();
      const blob = new Blob(chunks, { type: rec.mimeType || mime || "audio/webm" });
      if (blob.size > 160) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const dataUrl = String(reader.result || "");
          if (dataUrl) broadcastPacket({ kind: "ptt_chunk", audio: dataUrl });
        };
        reader.readAsDataURL(blob);
      }
    };
    rec.start();
    clearTimeout(tac.pttSegmentTimer);
    tac.pttSegmentTimer = setTimeout(function () {
      if (rec.state !== "inactive") { try { rec.stop(); } catch (_) {} }
    }, 480);
  }

  // --- MOTOR 2: AUDIOCONTEXT 16KHZ MONO BINÁRIO MQTT ---
  function downsampleTo16kInt16(float32Buf, inSampleRate) {
    const outRate = 16000;
    const ratio = inSampleRate / outRate;
    const newLen = Math.round(float32Buf.length / ratio);
    const result = new Int16Array(newLen);
    let offsetResult = 0, offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0, count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < float32Buf.length; i++) {
        accum += float32Buf[i];
        count++;
      }
      const s = Math.max(-1, Math.min(1, count > 0 ? accum / count : 0));
      result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return new Uint8Array(result.buffer);
  }

  function broadcastBinaryPcmFrame(pcmBytes) {
    if (!tac.roomCode) return;
    // Cabeçalho binário leve: [16 bytes uid] + [16 bytes qra] + [pcm Int16 16kHz]
    const header = new Uint8Array(32);
    const enc = new TextEncoder();
    header.set(enc.encode(tac.myId.slice(0, 16)), 0);
    header.set(enc.encode((tac.myQra || "OPERADOR").slice(0, 16)), 16);
    const frame = new Uint8Array(32 + pcmBytes.length);
    frame.set(header, 0);
    frame.set(pcmBytes, 32);

    if (tac.bc) {
      tac.bc.postMessage({ room: tac.roomCode.toUpperCase(), pcmFrame: frame });
    }
    if (tac.ws && tac.ws.readyState === 1) {
      const pcmTopic = "azimute/pmmg/pcm/" + roomTopicHash(tac.roomCode);
      const body = [...mqttEncodeStr(pcmTopic), ...frame];
      tac.ws.send(new Uint8Array([0x30, ...mqttEncodeVarLen(body.length), ...body]));
    }
  }

  function playBinaryPcmFrame(frameBytes) {
    if (tac.audioMuted || !frameBytes || frameBytes.length <= 34) return;
    const dec = new TextDecoder();
    const senderUid = dec.decode(frameBytes.slice(0, 16)).replace(/\0/g, "").trim();
    if (!senderUid || senderUid === tac.myId) return;
    if (tac.audioBlockedUids && tac.audioBlockedUids.has(senderUid)) return;
    const senderQra = dec.decode(frameBytes.slice(16, 32)).replace(/\0/g, "").trim() || "OPERADOR";

    const pcmRaw = frameBytes.slice(32);
    const alignedLen = pcmRaw.byteLength - (pcmRaw.byteLength % 2);
    if (alignedLen <= 0) return;
    const view = new DataView(pcmRaw.buffer, pcmRaw.byteOffset, alignedLen);
    const samples = alignedLen / 2;

    unlockAudioOutput();
    const ctx = tac.audioCtx;
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }

    const audioBuf = ctx.createBuffer(1, samples, 16000);
    const ch = audioBuf.getChannelData(0);
    for (let i = 0; i < samples; i++) {
      ch[i] = view.getInt16(i * 2, true) / 32768;
    }

    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    src.connect(ctx.destination);

    const now = ctx.currentTime;
    if (!tac.pcmNextPlayTime || tac.pcmNextPlayTime < now || tac.pcmNextPlayTime > now + 1.5) {
      tac.pcmNextPlayTime = now + 0.04;
    }
    src.start(tac.pcmNextPlayTime);
    tac.pcmNextPlayTime += audioBuf.duration;

    setSpeakerBanner(senderQra, true);
    clearTimeout(tac._pcmBannerTimer);
    tac._pcmBannerTimer = setTimeout(function () { setSpeakerBanner("", false); }, 550);
  }

  async function startPcmBinaryStream() {
    unlockAudioOutput();
    const ctx = tac.audioCtx;
    if (!ctx) throw new Error("AudioContext indisponível");
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (_) {}
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
    tac.pttStream = stream;
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;

    processor.onaudioprocess = function (ev) {
      if (!tac.isRecordingPtt) return;
      const input = ev.inputBuffer.getChannelData(0);
      const pcmBytes = downsampleTo16kInt16(input, ctx.sampleRate);
      broadcastBinaryPcmFrame(pcmBytes);
    };

    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(ctx.destination);
    tac.pcmSource = source;
    tac.pcmProcessor = processor;
    tac.pcmSilentGain = silentGain;
  }

  function stopPcmBinaryStream() {
    if (tac.pcmProcessor) { try { tac.pcmProcessor.disconnect(); } catch (_) {} tac.pcmProcessor = null; }
    if (tac.pcmSource) { try { tac.pcmSource.disconnect(); } catch (_) {} tac.pcmSource = null; }
    if (tac.pcmSilentGain) { try { tac.pcmSilentGain.disconnect(); } catch (_) {} tac.pcmSilentGain = null; }
  }

  // --- MOTOR 3: WEBRTC P2P (TEMPO REAL DIRETO) ---
  function closeAllRtcPeers() {
    Object.values(tac.rtcPeers).forEach(function (pc) { try { pc.close(); } catch (_) {} });
    tac.rtcPeers = {};
    if (tac.rtcLocalStream) {
      try { tac.rtcLocalStream.getTracks().forEach(function (t) { t.stop(); }); } catch (_) {}
      tac.rtcLocalStream = null;
    }
  }

  async function ensureRtcLocalStream() {
    if (!tac.rtcLocalStream) {
      tac.rtcLocalStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
    }
    return tac.rtcLocalStream;
  }

  function getOrCreateRtcPeer(remoteUid, remoteQra) {
    if (tac.rtcPeers[remoteUid]) return tac.rtcPeers[remoteUid];
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }]
    });
    tac.rtcPeers[remoteUid] = pc;

    pc.onicecandidate = function (ev) {
      if (ev.candidate) {
        broadcastPacket({ kind: "rtc_ice", targetUid: remoteUid, candidate: ev.candidate });
      }
    };

    pc.ontrack = function (ev) {
      if (tac.audioMuted) return;
      if (tac.audioBlockedUids && tac.audioBlockedUids.has(remoteUid)) return;
      const remoteAudio = new Audio();
      remoteAudio.srcObject = ev.streams[0];
      remoteAudio.autoplay = true;
      remoteAudio.play().catch(function () {});
      setSpeakerBanner(remoteQra || "ALIADO P2P", true);
    };

    return pc;
  }

  async function startWebRtcPtt() {
    const stream = await ensureRtcLocalStream();
    stream.getAudioTracks().forEach(function (t) { t.enabled = true; });
    const mates = Object.values(tac.teammates).filter(function (m) {
      return m && !(tac.audioBlockedUids && tac.audioBlockedUids.has(m.uid));
    });
    for (let i = 0; i < mates.length; i++) {
      const m = mates[i];
      const pc = getOrCreateRtcPeer(m.uid, m.qra);
      if (pc.getSenders().length === 0) {
        stream.getTracks().forEach(function (tr) { pc.addTrack(tr, stream); });
      }
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      broadcastPacket({ kind: "rtc_offer", targetUid: m.uid, sdp: offer });
    }
    broadcastPacket({ kind: "rtc_tx_state", speaking: true });
  }

  function stopWebRtcPtt() {
    if (tac.rtcLocalStream) {
      tac.rtcLocalStream.getAudioTracks().forEach(function (t) { t.enabled = false; });
    }
    broadcastPacket({ kind: "rtc_tx_state", speaking: false });
  }

  // --- CONTROLADOR UNIFICADO DO BOTÃO PTT ---
  async function startSelectedPtt() {
    if (tac.isRecordingPtt) return;
    unlockAudioOutput();
    if (!tac.roomCode) { showToast("Entre na equipe antes de acionar o PTT."); return; }
    if (!tac.ws || tac.ws.readyState !== 1) {
      connectLiveRoom();
      showToast("Rede desconectada — reconectando sala...", 2600, true);
      return;
    }

    try {
      tac.isRecordingPtt = true;
      syncPttUi();
      setSpeakerBanner(`${tac.myQra || "VOCÊ"}`, true);
      vibratePattern(35);

      if (tac.pttEngine === "pcm_binary") {
        await startPcmBinaryStream();
      } else if (tac.pttEngine === "webrtc_p2p") {
        await startWebRtcPtt();
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        });
        tac.pttStream = stream;
        recordSingleWebmSegment();
      }

      tac.pttAutoStopTimer = setTimeout(stopSelectedPtt, 25000);
    } catch (err) {
      tac.isRecordingPtt = false;
      syncPttUi();
      setSpeakerBanner("", false);
      const errName = (err && err.name) || "";
      let msg = "Microfone indisponível.";
      if (!window.isSecureContext) msg = "Microfone exige acesso seguro (HTTPS).";
      else if (errName === "NotAllowedError" || errName === "PermissionDeniedError") msg = "Permissão de microfone negada no navegador.";
      else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") msg = "Nenhum microfone encontrado no aparelho.";
      showToast(msg, 3400, true);
    }
  }

  function stopSelectedPtt() {
    if (!tac.isRecordingPtt) return;
    tac.isRecordingPtt = false;
    clearTimeout(tac.pttSegmentTimer);
    clearTimeout(tac.pttAutoStopTimer);

    if (tac.pttEngine === "pcm_binary") {
      stopPcmBinaryStream();
    } else if (tac.pttEngine === "webrtc_p2p") {
      stopWebRtcPtt();
    } else if (tac.activeSegmentRec && tac.activeSegmentRec.state !== "inactive") {
      try { tac.activeSegmentRec.stop(); } catch (_) {}
    }
    tac.activeSegmentRec = null;

    if (tac.pttStream) {
      try { tac.pttStream.getTracks().forEach(function (t) { t.stop(); }); } catch (_) {}
      tac.pttStream = null;
    }
    syncPttUi();
    setSpeakerBanner("", false);
    vibratePattern(20);
  }

  /* =====================================================================
     CAMADAS DO MAPA, CANETA MULTI-TRAÇO, BORRACHA & MIGALHAS DE PÃO
     ===================================================================== */
  function canDrawOnMap(m) {
    return Boolean(m && typeof m.getStyle === "function" && m.getStyle());
  }

  function applySatelliteLayer(map, enable) {
    if (!canDrawOnMap(map)) return;
    const srcId = "az-sat-src";
    const layerId = "az-sat-layer";
    const lblSrcId = "az-sat-lbl-src";
    const lblLayerId = "az-sat-lbl-layer";
    if (enable) {
      if (!map.getSource(srcId)) {
        map.addSource(srcId, {
          type: "raster",
          tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"],
          tileSize: 256,
          maxzoom: 19
        });
      }
      if (!map.getLayer(layerId)) {
        const layers = (map.getStyle() && map.getStyle().layers) || [];
        const sym = layers.find(function (l) { return l.type === "symbol"; });
        map.addLayer({
          id: layerId,
          type: "raster",
          source: srcId,
          paint: {
            "raster-opacity": 0.98,
            "raster-contrast": 0.22,
            "raster-saturation": 0.14,
            "raster-brightness-min": 0.03,
            "raster-brightness-max": 0.94,
            "raster-fade-duration": 0
          }
        }, sym ? sym.id : undefined);
      } else {
        map.setLayoutProperty(layerId, "visibility", "visible");
        map.setPaintProperty(layerId, "raster-opacity", 0.98);
        map.setPaintProperty(layerId, "raster-contrast", 0.22);
        map.setPaintProperty(layerId, "raster-saturation", 0.14);
        map.setPaintProperty(layerId, "raster-brightness-min", 0.03);
        map.setPaintProperty(layerId, "raster-brightness-max", 0.94);
        map.setPaintProperty(layerId, "raster-fade-duration", 0);
      }
      // Camada raster de rótulos borrados desativada: mantém exclusivamente rótulos vetoriais nítidos da GPU
      if (map.getLayer(lblLayerId)) {
        map.setLayoutProperty(lblLayerId, "visibility", "none");
      }
      const allLayers = (map.getStyle() && map.getStyle().layers) || [];
      allLayers.forEach(function (l) {
        if (l.type === "raster" && l.id !== layerId) {
          try { map.setLayoutProperty(l.id, "visibility", "none"); } catch (_) {}
        }
      });
    } else {
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, "visibility", "none");
      if (map.getLayer(lblLayerId)) map.setLayoutProperty(lblLayerId, "visibility", "none");
    }
  }

  function toggleSatelliteMode() {
    tac.satMode = !tac.satMode;
    tac.maps.forEach(function (m) {
      applySatelliteLayer(m, tac.satMode);
      const style = m.getStyle && m.getStyle();
      if (style && Array.isArray(style.layers)) {
        style.layers.forEach(function (layer) {
          const lid = (layer.id || "").toLowerCase();
          const sLayer = (layer["source-layer"] || "").toLowerCase();
          if (layer.type === "symbol" && layer.id !== "az-local-hosp-h") {
            try {
              m.setPaintProperty(layer.id, "text-color", tac.satMode ? "#FFFFFF" : "#000000");
              m.setPaintProperty(layer.id, "text-halo-color", tac.satMode ? "#000000" : "#FFFFFF");
              m.setPaintProperty(layer.id, "text-halo-width", 2.8);
              m.setPaintProperty(layer.id, "text-halo-blur", 0);
            } catch (_) {}
          } else if (tac.satMode && layer.type === "line" && (sLayer.includes("transportation") || lid.includes("road") || lid.includes("street") || lid.includes("highway"))) {
            try {
              if (lid.includes("casing")) {
                m.setPaintProperty(layer.id, "line-color", "#080808");
                m.setPaintProperty(layer.id, "line-opacity", 0.85);
              } else if (lid.includes("motorway") || lid.includes("trunk") || lid.includes("primary")) {
                m.setPaintProperty(layer.id, "line-color", "#FBBF24");
                m.setPaintProperty(layer.id, "line-opacity", 0.92);
              } else {
                m.setPaintProperty(layer.id, "line-color", "#F8FAFC");
                m.setPaintProperty(layer.id, "line-opacity", 0.72);
              }
            } catch (_) {}
          }
        });
      }
    });
    if (tac.grgConfig) renderGrgGridOnMaps(tac.grgConfig);
    if (typeof window.azimuteRefreshTacticalThemeColors === "function") window.azimuteRefreshTacticalThemeColors();
    const satBtn = document.getElementById("azSatToggleBtn");
    if (satBtn) satBtn.classList.toggle("is-active", tac.satMode);
    const satTile = document.getElementById("azGridSatTile");
    if (satTile) satTile.classList.toggle("is-on", tac.satMode);
    if (typeof window.azFlashMapLayerTransition === "function") window.azFlashMapLayerTransition();
    showToast(tac.satMode ? "Camada Satélite Híbrido ATIVADA" : "Mapa Padrão ATIVADO", 2200);
  }

  window.azFlashMapLayerTransition = function () {
    const veil = document.getElementById("azMapTransitionVeil");
    const sweep = document.getElementById("azMapSweepLine");
    if (veil) {
      veil.classList.add("is-flash");
      setTimeout(function () { veil.classList.remove("is-flash"); }, 180);
    }
    if (sweep && typeof requestAnimationFrame === "function") {
      const t0 = performance.now();
      const dur = 210;
      const h = window.innerHeight || 720;
      sweep.style.opacity = "0.9";
      const stepSweep = function (now) {
        const p = Math.min(1, (now - t0) / dur);
        sweep.style.transform = `translate3d(0, ${Math.round(p * h)}px, 0)`;
        if (p < 1) {
          requestAnimationFrame(stepSweep);
        } else {
          sweep.style.opacity = "0";
          sweep.style.transform = "translate3d(0, -10px, 0)";
        }
      };
      requestAnimationFrame(stepSweep);
    }
  };
  window.azToggleMonoTechMap = function () {
    window.azFlashMapLayerTransition();
    tac.monoTechMode = !tac.monoTechMode;
    tac.maps.forEach(function (m) {
      const style = m.getStyle && m.getStyle();
      if (!style || !Array.isArray(style.layers)) return;
      style.layers.forEach(function (layer) {
        const lid = (layer.id || "").toLowerCase();
        const sl = (layer["source-layer"] || "").toLowerCase();
        try {
          if (tac.monoTechMode) {
            if (layer.type === "background") m.setPaintProperty(layer.id, "background-color", "#0D0D0D");
            else if (layer.type === "fill" && (sl.includes("building") || lid.includes("building"))) m.setPaintProperty(layer.id, "fill-color", "#161616");
            else if (layer.type === "fill") m.setPaintProperty(layer.id, "fill-color", "#111111");
            else if (layer.type === "line" && (sl.includes("transportation") || lid.includes("road") || lid.includes("street"))) {
              m.setPaintProperty(layer.id, "line-color", (lid.includes("motorway") || lid.includes("primary")) ? "#C5A869" : "#737373");
            } else if (layer.type === "symbol") {
              m.setPaintProperty(layer.id, "text-color", "#F2F0EA");
              m.setPaintProperty(layer.id, "text-halo-color", "#0D0D0D");
            }
          }
        } catch (_) {}
      });
    });
    if (!tac.monoTechMode && typeof setupCustomMapLayers === "function") {
      try {
        const gm = window.azGeoMap;
        if (gm) gm._azLastSetupStyle = null;
        setupCustomMapLayers();
      } catch (_) {}
    }
    showToast(tac.monoTechMode ? "Camada Técnica Monocromática ATIVADA" : "Camada Padrão Restaurada", 2000);
  };

  function buildCircleGeoJson(lng, lat, rMeters) {
    const pts = 48, coords = [];
    const dLat = rMeters / 111320;
    const dLng = rMeters / (111320 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      coords.push([lng + Math.cos(a) * dLng, lat + Math.sin(a) * dLat]);
    }
    return { type: "Feature", geometry: { type: "Polygon", coordinates: [coords] } };
  }

  function renderCircleOnMaps(lng, lat, rMeters, fromSync, skipHistory) {
    if (!fromSync && !skipHistory) {
      const prevCircle = tac.circleCenter ? { center: { lng: tac.circleCenter.lng, lat: tac.circleCenter.lat }, radius: tac.circleRadius } : null;
      const nextCircle = { center: { lng: lng, lat: lat }, radius: rMeters };
      const topUndo = tac.undoHistory[tac.undoHistory.length - 1];
      if (topUndo && topUndo.type === "circle" && Date.now() - (topUndo._ts || 0) < 1200) {
        topUndo.next = nextCircle;
        topUndo._ts = Date.now();
      } else {
        pushUndoAction({ type: "circle", prev: prevCircle, next: nextCircle, _ts: Date.now() });
      }
    }
    tac.circleCenter = { lng: lng, lat: lat };
    tac.circleRadius = rMeters;
    const gj = buildCircleGeoJson(lng, lat, rMeters);
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource("az-tac-circle")) m.getSource("az-tac-circle").setData(gj);
      else {
        m.addSource("az-tac-circle", { type: "geojson", data: gj });
        m.addLayer({ id: "az-tac-circle-fill", type: "fill", source: "az-tac-circle", paint: { "fill-color": "#EF4444", "fill-opacity": 0.16 } });
        m.addLayer({ id: "az-tac-circle-line", type: "line", source: "az-tac-circle", paint: { "line-color": "#EF4444", "line-width": 2.5 } });
      }
    });
    refreshLeftControls();
    if (typeof checkGeofenceProximityAlerts === "function") checkGeofenceProximityAlerts();
    if (!fromSync) broadcastPacket({ kind: "circle", lng: lng, lat: lat, radius: rMeters });
  }

  function clearCircleFromMaps(fromSync, skipHistory) {
    if (!fromSync && !skipHistory && tac.circleCenter) {
      pushUndoAction({
        type: "del_circle",
        circle: { center: { lng: tac.circleCenter.lng, lat: tac.circleCenter.lat }, radius: tac.circleRadius }
      });
    }
    tac.circleCenter = null;
    tac._suppressGeofenceSoundUntil = Date.now() + 800;
    if (tac.geofenceInsideMap) {
      Object.keys(tac.geofenceInsideMap).forEach(function (gk) {
        if (gk.indexOf("circle_main::") === 0) delete tac.geofenceInsideMap[gk];
      });
    }
    document.getElementById("azCircleRadiusPad").classList.remove("is-open");
    const gj = { type: "Feature", geometry: { type: "Polygon", coordinates: [[]] } };
    tac.maps.forEach(function (m) {
      if (m.getSource && m.getSource("az-tac-circle")) m.getSource("az-tac-circle").setData(gj);
    });
    refreshLeftControls();
    if (!fromSync) broadcastPacket({ kind: "clear_circle" });
  }

  function renderLineOnMaps(sourceId, layerId, coords, colorHex, dashed, labelText, syncKind, widthPx) {
    const displayCol = resolveSmartDisplayColor(colorHex, "line");
    const gj = { type: "Feature", geometry: { type: "LineString", coordinates: coords || [] } };
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource(sourceId)) {
        m.getSource(sourceId).setData(gj);
        if (m.getLayer(layerId)) { try { m.setPaintProperty(layerId, "line-color", displayCol); } catch (_) {} }
      } else if (coords && coords.length > 0) {
        m.addSource(sourceId, { type: "geojson", data: gj });
        const paint = { "line-color": displayCol, "line-width": widthPx || 3.8 };
        if (dashed) paint["line-dasharray"] = [2, 1.5];
        m.addLayer({ id: layerId, type: "line", source: sourceId, paint: paint });
      }
    });
    if (labelText) showToast(labelText, 3600);
    if (syncKind) broadcastPacket({ kind: syncKind, coords: coords });
    refreshLeftControls();
  }

  const STROKES_STORAGE_KEY = "az_tac_strokes_v1";

  function saveDrawStrokesToStorage() {
    try {
      localStorage.setItem(STROKES_STORAGE_KEY, JSON.stringify(tac.drawStrokes || []));
    } catch (_) {}
  }

  function restoreDrawStrokesFromStorage() {
    if (tac.drawStrokes && tac.drawStrokes.length > 0) {
      renderFreehandStrokes(true);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(STROKES_STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length > 0) {
        tac.drawStrokes = saved;
        renderFreehandStrokes(true);
      }
    } catch (_) {}
  }

  function renderFreehandStrokes(fromSync, skipBroadcast) {
    const fallbackColor = getColorHex(tac.myColorId);
    const validStrokes = [];
    (tac.drawStrokes || []).forEach(function (s, idx) {
      const c = Array.isArray(s) ? s : (s && Array.isArray(s.coords) ? s.coords : null);
      if (!c || c.length === 0) return;
      if (Array.isArray(s)) {
        const obj = { id: "stk_legacy_" + idx + "_" + c.length, coords: s, color: fallbackColor, width: 4, strokeWidth: 4 };
        tac.drawStrokes[idx] = obj;
        validStrokes.push(obj);
      } else {
        if (!s.id) s.id = "stk_" + Date.now() + "_" + idx;
        const w = Math.max(2, Math.min(16, Number(s.width || s.strokeWidth) || 4));
        s.width = w;
        s.strokeWidth = w;
        validStrokes.push(s);
      }
    });
    const features = validStrokes.map(function (s) {
      const rawCol = s.color || fallbackColor;
      const dispCol = resolveSmartDisplayColor(rawCol, "stroke");
      return {
        type: "Feature",
        geometry: { type: "LineString", coordinates: s.coords },
        properties: { id: s.id, color: dispCol, width: s.width || 4 }
      };
    });
    const gj = { type: "FeatureCollection", features: features };
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource("az-tac-draw")) {
        m.getSource("az-tac-draw").setData(gj);
        if (m.getLayer("az-tac-draw-line")) {
          try { m.setPaintProperty("az-tac-draw-line", "line-width", ["coalesce", ["get", "width"], 4]); } catch (_) {}
        }
      } else if (features.length > 0) {
        m.addSource("az-tac-draw", { type: "geojson", data: gj });
        m.addLayer({
          id: "az-tac-draw-line",
          type: "line",
          source: "az-tac-draw",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#F59E0B"],
            "line-width": ["coalesce", ["get", "width"], 4]
          }
        });
      }
    });
    if (!fromSync) saveDrawStrokesToStorage();
    if (!fromSync && !skipBroadcast) broadcastPacket({ kind: "draw_strokes", strokes: validStrokes });
    refreshLeftControls();
  }

  function openStrokeEditPopover(strokeObj) {
    if (!strokeObj || !strokeObj.id) return;
    tac.editingStrokeId = strokeObj.id;
    const pop = document.getElementById("azStrokeEditPopover");
    const rng = document.getElementById("azStrokeWidthRange");
    const rd = document.getElementById("azStrokeWidthReadout");
    const w = Math.max(2, Math.min(16, Number(strokeObj.width || strokeObj.strokeWidth) || 4));
    if (rng) rng.value = String(w);
    if (rd) rd.textContent = `${w}px`;
    document.querySelectorAll("[data-st-preset]").forEach(function (btn) {
      btn.classList.toggle("is-active", parseInt(btn.getAttribute("data-st-preset"), 10) === w);
    });
    const colUp = String(strokeObj.color || getColorHex(tac.myColorId)).toUpperCase();
    document.querySelectorAll("[data-st-color]").forEach(function (btn) {
      btn.classList.toggle("is-active", (btn.getAttribute("data-st-color") || "").toUpperCase() === colUp);
    });
    if (pop) pop.classList.add("is-open");
  }

  function syncPenDockUi() {
    const panel = document.getElementById("azPenDockPanel");
    const bar = document.getElementById("azPenActiveChipBar");
    const btn = document.getElementById("azPenQuickToggleBtn");
    const rd = document.getElementById("azPenWidthReadout");
    const barRd = document.getElementById("azPenBarReadout");
    const rng = document.getElementById("azPenWidthRange");
    const barRng = document.getElementById("azPenBarRange");
    const prev = document.getElementById("azPenWidthPreview");
    const barPrev = document.getElementById("azPenBarPreview");
    const w = Math.max(2, Math.min(16, Number(tac.penWidth) || 4));
    const col = getColorHex(tac.myColorId);
    if (panel) panel.classList.toggle("is-pen-on", Boolean(tac.drawActive));
    if (bar) bar.classList.toggle("is-open", Boolean(tac.drawActive));
    if (btn) {
      btn.textContent = tac.drawActive ? "PARAR" : "ATIVAR";
      btn.classList.toggle("is-active", Boolean(tac.drawActive));
    }
    if (rd) rd.textContent = `${w}px`;
    if (barRd) barRd.textContent = `${w}px`;
    if (rng) rng.value = String(w);
    if (barRng) barRng.value = String(w);
    if (prev) { prev.style.height = `${w}px`; prev.style.background = col; }
    if (barPrev) { barPrev.style.height = `${w}px`; barPrev.style.background = col; }
    document.querySelectorAll("[data-pen-preset]").forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-pen-preset"), 10) === w);
    });
  }

  function setCanetaMode(enable) {
    if (enable) disarmAllTacticalTools("draw_free");
    tac.drawActive = Boolean(enable);
    const tile = document.getElementById("azGridDrawTile");
    if (tile) tile.classList.toggle("is-on", tac.drawActive);
    tac.maps.forEach(function (m) {
      if (m && m.dragPan) {
        if (tac.drawActive || tac.eraserActive || tac.mapLocked) m.dragPan.disable();
        else m.dragPan.enable();
      }
    });
    syncPenDockUi();
    refreshLeftControls();
  }

  function setEraserMode(enable) {
    if (enable) disarmAllTacticalTools("eraser_tool");
    tac.eraserActive = Boolean(enable);
    const eTile = document.getElementById("azGridEraserTile");
    if (eTile) eTile.classList.toggle("is-on", tac.eraserActive);
    tac.maps.forEach(function (m) {
      if (m && m.dragPan) {
        if (tac.eraserActive || tac.drawActive || tac.mapLocked) m.dragPan.disable();
        else m.dragPan.enable();
      }
    });
    refreshLeftControls();
  }

  // Borracha seletiva com registro completo no Desfazer/Refazer
  function eraseAtMapPoint(map, screenX, screenY, lngLat) {
    const HIT_PX = 24;
    const removedBatch = {
      type: "erase_batch",
      pins: [],
      strokes: [],
      crumbs: [],
      circle: null,
      geoms: [],
      flags: [],
      wasps: [],
      texts: []
    };
    let erasedSomething = false;

    // 1. Verifica marcadores (pins) próximos ao toque
    for (let i = tac.pins.length - 1; i >= 0; i--) {
      const p = tac.pins[i];
      if (p.isGhost) continue;
      const pt = map.project([p.lng, p.lat]);
      if (Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX) {
        removedBatch.pins.push({
          id: p.id, type: p.type, label: p.label, rawTitle: p.rawTitle,
          colorHex: p.colorHex, iconId: p.iconId || "padrao", camAngleDeg: p.camAngleDeg || 0,
          photoUrl: p.photoUrl || "", lng: p.lng, lat: p.lat
        });
        deletePinById(p.id, true);
        erasedSomething = true;
      }
    }

    // 2. Verifica traços da caneta próximos ao toque
    const keptStrokes = [];
    tac.drawStrokes.forEach(function (stroke, sIdx) {
      const coords = Array.isArray(stroke) ? stroke : (stroke && stroke.coords) || [];
      const hit = coords.some(function (coord) {
        const pt = map.project(coord);
        return Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX;
      });
      if (hit) {
        removedBatch.strokes.push({ idx: sIdx, stroke: cloneTacData(stroke) });
      } else {
        keptStrokes.push(stroke);
      }
    });
    if (removedBatch.strokes.length > 0) {
      tac.drawStrokes = keptStrokes;
      renderFreehandStrokes(false);
      erasedSomething = true;
    }

    // 3. Verifica migalhas de rota próximas ao toque
    const keptCrumbs = [];
    tac.breadcrumbs.forEach(function (c, cIdx) {
      const pt = map.project([c.lng, c.lat]);
      if (Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX) {
        removedBatch.crumbs.push({ idx: cIdx, crumb: cloneTacData(c) });
      } else {
        keptCrumbs.push(c);
      }
    });
    if (removedBatch.crumbs.length > 0) {
      tac.breadcrumbs = keptCrumbs;
      renderBreadcrumbRoute(false);
      erasedSomething = true;
    }

    // 4. Verifica perímetro (círculo) se tocar na borda ou centro
    if (tac.circleCenter && lngLat) {
      const d = calcDistAndBearing(lngLat.lat, lngLat.lng, tac.circleCenter.lat, tac.circleCenter.lng).dist;
      if (d <= 25 || Math.abs(d - tac.circleRadius) <= 25) {
        removedBatch.circle = { center: { lng: tac.circleCenter.lng, lat: tac.circleCenter.lat }, radius: tac.circleRadius };
        clearCircleFromMaps(false, true);
        erasedSomething = true;
      }
    }

    // 5. Verifica formas geométricas táticas (dentro, no centro ou na borda)
    if (tac.tacticalGeoms.length > 0 && lngLat) {
      const keptGeoms = [];
      tac.tacticalGeoms.forEach(function (g) {
        const cpt = map.project([g.lng, g.lat]);
        let hit = Math.hypot(cpt.x - screenX, cpt.y - screenY) <= HIT_PX;
        if (!hit) {
          const dLatM = Math.abs(lngLat.lat - g.lat) * 111320;
          const dLngM = Math.abs(lngLat.lng - g.lng) * 111320 * Math.max(0.2, Math.cos((g.lat * Math.PI) / 180));
          if (g.shape === "circle") {
            const r = g.widthM || 150;
            hit = Math.hypot(dLatM, dLngM) <= r + 15;
          } else {
            const halfH = (g.heightM || 150) / 2;
            const halfW = (g.widthM || 250) / 2;
            hit = dLatM <= halfH + 15 && dLngM <= halfW + 15;
          }
        }
        if (hit) removedBatch.geoms.push(cloneTacData(g));
        else keptGeoms.push(g);
      });
      if (removedBatch.geoms.length > 0) {
        tac.tacticalGeoms = keptGeoms;
        renderTacticalGeomsOnMaps();
        if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
        erasedSomething = true;
      }
    }

    // 6. Verifica bandeiras próximas ao toque
    if (Array.isArray(tac.flags) && tac.flags.length > 0) {
      const keptFlags = [];
      tac.flags.forEach(function (f) {
        const pt = map.project([f.lng, f.lat]);
        if (Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX) {
          removedBatch.flags.push(cloneTacData(f));
        } else {
          keptFlags.push(f);
        }
      });
      if (removedBatch.flags.length > 0) {
        tac.flags = keptFlags;
        renderFlagsOnMaps(false);
        erasedSomething = true;
      }
    }

    // 7. Verifica textos no mapa próximos ao toque
    if (Array.isArray(tac.mapTexts) && tac.mapTexts.length > 0) {
      const keptTexts = [];
      tac.mapTexts.forEach(function (t) {
        const pt = map.project([t.lng, t.lat]);
        if (Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX + 10) {
          removedBatch.texts.push(cloneTacData(t));
        } else {
          keptTexts.push(t);
        }
      });
      if (removedBatch.texts.length > 0) {
        tac.mapTexts = keptTexts;
        if (typeof renderMapTextsOnMaps === "function") renderMapTextsOnMaps(false);
        erasedSomething = true;
      }
    }

    // 8. Verifica rastro GPS próximo ao toque
    if (Array.isArray(tac.myTrailCoords) && tac.myTrailCoords.length >= 2) {
      const hitTrail = tac.myTrailCoords.some(function (coord) {
        const pt = map.project(coord);
        return Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX;
      });
      if (hitTrail) {
        removedBatch.trail = cloneTacData(tac.myTrailCoords);
        tac.myTrailCoords = [];
        renderTrailsOnMaps(false);
        erasedSomething = true;
      }
    }

    // 9. Verifica traçados articulados (Escada, Beco, Cerca, Barricada)
    if (Array.isArray(tac.terrainTraces) && tac.terrainTraces.length > 0) {
      removedBatch.traces = [];
      const keptTraces = [];
      const ptToSegPx = function (px, py, x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        let t = len2 > 0 ? ((px - x1) * dx + (py - y1) * dy) / len2 : 0;
        t = Math.max(0, Math.min(1, t));
        return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
      };
      tac.terrainTraces.forEach(function (tr) {
        const cs = tr.coords || [];
        let hit = false;
        for (let i = 0; i < cs.length; i++) {
          const pA = map.project(cs[i]);
          if (Math.hypot(pA.x - screenX, pA.y - screenY) <= HIT_PX) { hit = true; break; }
          if (i > 0) {
            const pPrev = map.project(cs[i - 1]);
            if (ptToSegPx(screenX, screenY, pPrev.x, pPrev.y, pA.x, pA.y) <= HIT_PX) { hit = true; break; }
          }
        }
        if (hit) removedBatch.traces.push(cloneTacData(tr));
        else keptTraces.push(tr);
      });
      if (removedBatch.traces.length > 0) {
        tac.terrainTraces = keptTraces;
        if (tac.activeTraceId && !keptTraces.some(function (x) { return x.id === tac.activeTraceId; })) {
          tac.activeTraceId = null;
        }
        renderTerrainTracesOnMaps(false);
        erasedSomething = true;
      }
    }

    // 10. Verifica marcadores WASP próximos ao toque
    if (Array.isArray(tac.waspItems) && tac.waspItems.length > 0) {
      const keptWasps = [];
      tac.waspItems.forEach(function (w) {
        const pt = map.project([w.lng, w.lat]);
        if (Math.hypot(pt.x - screenX, pt.y - screenY) <= HIT_PX + 6) {
          removedBatch.wasps.push({
            id: w.id, code: w.code, lat: w.lat, lng: w.lng, state: w.state,
            note: w.note || "", qra: w.qra || "", updatedAtStr: w.updatedAtStr || "",
            floorplanId: w.floorplanId || ""
          });
          (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} });
        } else {
          keptWasps.push(w);
        }
      });
      if (removedBatch.wasps.length > 0) {
        tac.waspItems = keptWasps;
        if (typeof saveWaspsToStorage === "function") saveWaspsToStorage();
        if (tac.roomCode && typeof serializeWaspItems === "function") {
          broadcastPacket({ kind: "wasp_sync_all", items: serializeWaspItems() });
        }
        erasedSomething = true;
      }
    }

    if (erasedSomething) {
      pushUndoAction(removedBatch);
      refreshLeftControls();
      vibratePattern(25);
    }
  }

  /* =====================================================================
     FUNÇÃO DESENHAR ROTA (MIGALHAS DE PÃO CLICÁVEIS PARA SEGUIR)
     ===================================================================== */
  function clearCrumbMarkers() {
    tac.crumbMarkers.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    tac.crumbMarkers = [];
  }

  function renderBreadcrumbRoute(fromSync) {
    clearCrumbMarkers();
    const lineCoords = tac.breadcrumbs.map(function (c) { return [c.lng, c.lat]; });
    renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", lineCoords, "#38BDF8", false, null, null, 3.8);

    if (window.maplibregl) {
      tac.maps.forEach(function (m) {
        tac.breadcrumbs.forEach(function (pt, idx) {
          const el = document.createElement("div");
          el.className = "az-crumb-pin" + (tac.activeCrumbIndex === idx ? " is-active" : "");
          el.textContent = `M${idx + 1}`;
          el.title = `Toque para iniciar rota pela migalha M${idx + 1}`;
          el.addEventListener("click", function (ev) {
            ev.stopPropagation();
            if (tac.eraserActive) {
              const removedCrumb = cloneTacData(tac.breadcrumbs[idx]);
              tac.breadcrumbs.splice(idx, 1);
              pushUndoAction({ type: "del_crumbs", crumbs: [{ idx: idx, crumb: removedCrumb }] });
              renderBreadcrumbRoute(false);
              return;
            }
            followBreadcrumbsFromIndex(idx);
          });
          const mk = new window.maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([pt.lng, pt.lat]).addTo(m);
          tac.crumbMarkers.push(mk);
        });
      });
    }

    if (!fromSync) broadcastPacket({ kind: "crumb_route", crumbs: tac.breadcrumbs });
    refreshLeftControls();
  }

  async function followBreadcrumbsFromIndex(startIdx) {
    if (startIdx < 0 || startIdx >= tac.breadcrumbs.length) return;
    tac.activeCrumbIndex = startIdx;
    renderBreadcrumbRoute(true);

    const map = getActiveMap();
    const oLat = tac.myPos ? tac.myPos.lat : (map ? map.getCenter().lat : tac.breadcrumbs[startIdx].lat);
    const oLng = tac.myPos ? tac.myPos.lng : (map ? map.getCenter().lng : tac.breadcrumbs[startIdx].lng);

    const chain = [[oLng, oLat]];
    for (let i = startIdx; i < tac.breadcrumbs.length; i++) {
      chain.push([tac.breadcrumbs[i].lng, tac.breadcrumbs[i].lat]);
    }

    tac.hasActiveRoute = true;
    refreshLeftControls();

    try {
      const waypoints = chain.map(function (p) { return `${p[0]},${p[1]}`; }).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;
      const d = await (await fetch(url)).json();
      if (d && d.routes && d.routes[0]) {
        const r = d.routes[0];
        renderLineOnMaps("az-tac-route", "az-tac-route-line", r.geometry.coordinates, "#22C55E", false, `ROTA MIGALHAS (M${startIdx + 1}→M${tac.breadcrumbs.length}): ${formatDistance(r.distance)}`, null, 4.5);
        return;
      }
    } catch (_) {}

    renderLineOnMaps("az-tac-route", "az-tac-route-line", chain, "#22C55E", true, `SEGUINDO MIGALHAS M${startIdx + 1} → M${tac.breadcrumbs.length}`, null, 4.5);
  }

  function calcDistAndBearing(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const p1 = (lat1 * Math.PI) / 180, p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180, dl = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    const dist = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const y = Math.sin(dl) * Math.cos(p2);
    const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return { dist: Math.round(dist), bearing: Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) };
  }

  function clearBloodhoundMarker() {
    if (tac.bloodhoundMarker && Array.isArray(tac.bloodhoundMarker)) {
      tac.bloodhoundMarker.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.bloodhoundMarker = null;
  }

  function renderBloodhoundTargetMarker(lat, lng, label) {
    clearBloodhoundMarker();
    if (typeof maplibregl === "undefined") return;
    const list = (tac.bloodhoundList || []).filter(function (t) { return t && t.type !== "mate" && typeof t.lat === "number" && typeof t.lng === "number"; });
    if (!list.length && typeof lat === "number" && typeof lng === "number") {
      list.push({ lat: lat, lng: lng, label: label || "ALVO", color: "#F97316" });
    }
    if (!list.length) return;
    tac.bloodhoundMarker = [];
    list.forEach(function (t) {
      const c = t.color || "#F97316";
      tac.maps.forEach(function (m) {
        try {
          const el = document.createElement("div");
          el.style.cssText = `width:22px;height:22px;border-radius:50%;border:2.5px solid ${c};background:rgba(249,115,22,0.22);box-shadow:0 0 0 3px rgba(13,13,13,0.85);display:flex;align-items:center;justify-content:center;pointer-events:none;`;
          el.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:${c};"></div>`;
          const mk = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([t.lng, t.lat]).addTo(m);
          tac.bloodhoundMarker.push(mk);
        } catch (_) {}
      });
    });
  }

  function setBloodhoundTarget(targetObj) {
    if (!targetObj) {
      tac.bloodhoundTarget = null;
      tac.bloodhoundList = [];
      clearBloodhoundMarker();
    } else {
      const obj = Object.assign({}, targetObj);
      if (obj.type === "mate" && tac.teammates[obj.id]) {
        const mate = tac.teammates[obj.id];
        obj.lat = mate.lat;
        obj.lng = mate.lng;
        obj.label = mate.qra || obj.label;
        obj.color = getColorHex(mate.colorId);
      } else if (obj.type === "pin") {
        const pinRef = tac.pins.find(function (p) { return p.id === obj.id; });
        if (pinRef && !obj.color) obj.color = pinRef.colorHex || "#F97316";
      }
      if (!obj.color) obj.color = "#F97316";
      const idx = tac.bloodhoundList.findIndex(function (t) { return t.id === obj.id; });
      if (idx === -1) tac.bloodhoundList.push(obj);
      else tac.bloodhoundList[idx] = obj;
      tac.bloodhoundTarget = tac.bloodhoundList[tac.bloodhoundList.length - 1];
      renderBloodhoundTargetMarker();
    }
    updateBloodhoundVector();
  }

  function removeBloodhoundTargetById(targetId) {
    if (!Array.isArray(tac.bloodhoundList)) tac.bloodhoundList = [];
    tac.bloodhoundList = tac.bloodhoundList.filter(function (t) { return t.id !== targetId; });
    tac.bloodhoundTarget = tac.bloodhoundList.length ? tac.bloodhoundList[tac.bloodhoundList.length - 1] : null;
    renderBloodhoundTargetMarker();
    updateBloodhoundVector();
  }

  function renderEdgeIndicators() {
    const layer = document.getElementById("azEdgeIndicatorsLayer");
    if (!layer) return;
    const vis = isMapTabVisible() && !document.body.classList.contains("az-map-clean-eye");
    layer.classList.toggle("is-visible", vis);
    if (!vis) return;
    const map = getActiveMap();
    if (!map || typeof map.project !== "function") { layer.innerHTML = ""; return; }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padX = 38, padTop = 64, padBottom = 92;
    const cx = vw / 2, cy = vh / 2;
    const items = [];

    Object.values(tac.teammates).forEach(function (m) {
      if (typeof m.lat === "number" && typeof m.lng === "number") {
        items.push({ id: m.uid, label: m.qra || "ALIADO", lat: m.lat, lng: m.lng, color: getColorHex(m.colorId) });
      }
    });
    (tac.bloodhoundList || []).forEach(function (bt) {
      if (bt && bt.type !== "mate" && typeof bt.lat === "number" && typeof bt.lng === "number") {
        items.push({ id: bt.id, label: bt.label || "ALVO", lat: bt.lat, lng: bt.lng, color: bt.color || "#F97316" });
      }
    });

    const pills = [];
    items.forEach(function (it) {
      const pt = map.project([it.lng, it.lat]);
      if (pt.x >= 16 && pt.x <= vw - 16 && pt.y >= 54 && pt.y <= vh - 78) return;
      const dx = pt.x - cx, dy = pt.y - cy;
      const angle = Math.atan2(dy, dx);
      const halfW = (vw / 2) - padX;
      const halfHTop = cy - padTop;
      const halfHBot = (vh - padBottom) - cy;
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const tx = cos !== 0 ? Math.abs(halfW / cos) : 1e9;
      const ty = sin > 0 ? Math.abs(halfHBot / sin) : (sin < 0 ? Math.abs(halfHTop / sin) : 1e9);
      const t = Math.min(tx, ty);
      const ex = Math.max(padX, Math.min(vw - padX, cx + cos * t));
      const ey = Math.max(padTop, Math.min(vh - padBottom, cy + sin * t));
      const deg = Math.round((angle * 180) / Math.PI) + 90;
      const refLat = tac.myPos ? tac.myPos.lat : map.getCenter().lat;
      const refLng = tac.myPos ? tac.myPos.lng : map.getCenter().lng;
      const distStr = formatDistance(calcDistAndBearing(refLat, refLng, it.lat, it.lng).dist);
      pills.push(`<button type="button" class="az-edge-arrow-pill" data-edge-lat="${it.lat}" data-edge-lng="${it.lng}" style="left:${ex.toFixed(0)}px;top:${ey.toFixed(0)}px;border-color:${it.color};"><span style="display:inline-block;transform:rotate(${deg}deg);color:${it.color};">▲</span><span>${it.label} ${distStr}</span></button>`);
    });

    layer.innerHTML = pills.join("");
    layer.querySelectorAll("[data-edge-lat]").forEach(function (b) {
      b.addEventListener("click", function () {
        const lat = parseFloat(b.getAttribute("data-edge-lat"));
        const lng = parseFloat(b.getAttribute("data-edge-lng"));
        map.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 16), essential: true });
      });
    });
  }

  function getGrgContrastColors() {
    const isDarkBg = isCurrentViewerDarkBg();
    const baseLine = isDarkBg ? "#F8FAFC" : "#0F172A";
    const smartLine = resolveSmartDisplayColor(baseLine, "grg");
    return isDarkBg
      ? { line: smartLine, text: smartLine, halo: "#0D0D0D" }
      : { line: smartLine, text: smartLine, halo: "#FFFFFF" };
  }

  function getGrgCellBoundsByCode(cfg, code) {
    if (!cfg || !code) return null;
    const m = String(code).trim().toUpperCase().match(/^([A-Z])(\d+)$/);
    if (!m) return null;
    const r = m[1].charCodeAt(0) - 65;
    const c = parseInt(m[2], 10) - 1;
    if (r < 0 || r >= cfg.dim || c < 0 || c >= cfg.dim) return null;
    const dLat = cfg.cellMeters / 111320;
    const dLng = cfg.cellMeters / (111320 * Math.max(0.2, Math.cos((cfg.centerLat * Math.PI) / 180)));
    const startLat = cfg.centerLat + (cfg.dim / 2) * dLat;
    const startLng = cfg.centerLng - (cfg.dim / 2) * dLng;
    return {
      code: m[1] + (c + 1),
      north: startLat - r * dLat,
      south: startLat - (r + 1) * dLat,
      west: startLng + c * dLng,
      east: startLng + (c + 1) * dLng
    };
  }

  function findGrgCodeAtLatLng(cfg, lat, lng) {
    if (!cfg) return "";
    const dLat = cfg.cellMeters / 111320;
    const dLng = cfg.cellMeters / (111320 * Math.max(0.2, Math.cos((cfg.centerLat * Math.PI) / 180)));
    const startLat = cfg.centerLat + (cfg.dim / 2) * dLat;
    const startLng = cfg.centerLng - (cfg.dim / 2) * dLng;
    const r = Math.floor((startLat - lat) / dLat);
    const c = Math.floor((lng - startLng) / dLng);
    if (r < 0 || r >= cfg.dim || c < 0 || c >= cfg.dim) return "";
    return String.fromCharCode(65 + r) + (c + 1);
  }

  function isLatLngInGrgHome(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number") return false;
    if (tac.grgConfig && tac.grgHomeCode) {
      const b = getGrgCellBoundsByCode(tac.grgConfig, tac.grgHomeCode);
      if (b && lat <= b.north && lat >= b.south && lng >= b.west && lng <= b.east) return true;
    }
    return false;
  }

  function getEffectiveMyStatus() {
    if (tac.myPos && isLatLngInGrgHome(tac.myPos.lat, tac.myPos.lng)) {
      return "DENTRO DO LOCAL";
    }
    return tac.myManualStatus || "EM PATRULHA";
  }

  function syncGrgHomeSelectOptions(cfg) {
    const sel = document.getElementById("azGrgHomeSelect");
    if (!sel) return;
    const prevVal = tac.grgHomeCode || "";
    const dim = (cfg && cfg.dim) || parseInt((document.getElementById("azGrgDimSelect") || {}).value, 10) || 6;
    let html = '<option value="">Nenhum (Sem QTH Casa)</option>';
    for (let r = 0; r < dim; r++) {
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 0; c < dim; c++) {
        const code = rowChar + (c + 1);
        html += `<option value="${code}">${code} (CASA)</option>`;
      }
    }
    sel.innerHTML = html;
    sel.value = prevVal;
  }

  function renderTrailsOnMaps(fromSync) {
    const features = [];
    if (Array.isArray(tac.myTrailCoords) && tac.myTrailCoords.length >= 2) {
      features.push({
        type: "Feature",
        geometry: { type: "LineString", coordinates: tac.myTrailCoords },
        properties: { color: resolveSmartDisplayColor(getColorHex(tac.myColorId), "line") }
      });
    }
    Object.values(tac.mateTrails || {}).forEach(function (tr) {
      if (tr && Array.isArray(tr.coords) && tr.coords.length >= 2) {
        features.push({
          type: "Feature",
          geometry: { type: "LineString", coordinates: tr.coords },
          properties: { color: resolveSmartDisplayColor(tr.colorHex || "#38BDF8", "line") }
        });
      }
    });
    const gj = { type: "FeatureCollection", features: features };
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource("az-tac-trails-src")) m.getSource("az-tac-trails-src").setData(gj);
      else if (features.length > 0) {
        m.addSource("az-tac-trails-src", { type: "geojson", data: gj });
        m.addLayer({
          id: "az-tac-trails-line",
          type: "line",
          source: "az-tac-trails-src",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: { "line-color": ["coalesce", ["get", "color"], "#C5A869"], "line-width": 3.5, "line-opacity": 0.9 }
        });
      }
    });
    if (!fromSync && tac.trailScope === "team" && tac.roomCode) {
      broadcastPacket({ kind: "trail_sync", coords: tac.myTrailCoords, colorHex: getColorHex(tac.myColorId) });
    }
  }

  function renderGrgGridOnMaps(cfg) {
    tac.grgConfig = cfg || null;
    syncGrgHomeSelectOptions(cfg);
    const pal = getGrgContrastColors();
    const gridFeatures = [];
    const labelFeatures = [];
    const homeFeatures = [];
    if (cfg) {
      const n = cfg.dim;
      const stepM = cfg.cellMeters;
      const dLat = stepM / 111320;
      const dLng = stepM / (111320 * Math.max(0.2, Math.cos((cfg.centerLat * Math.PI) / 180)));
      const startLat = cfg.centerLat + (n / 2) * dLat;
      const startLng = cfg.centerLng - (n / 2) * dLng;
      for (let r = 0; r <= n; r++) {
        const lat = startLat - r * dLat;
        gridFeatures.push({ type: "Feature", geometry: { type: "LineString", coordinates: [[startLng, lat], [startLng + n * dLng, lat]] } });
      }
      for (let c = 0; c <= n; c++) {
        const lng = startLng + c * dLng;
        gridFeatures.push({ type: "Feature", geometry: { type: "LineString", coordinates: [[lng, startLat], [lng, startLat - n * dLat]] } });
      }
      for (let r = 0; r < n; r++) {
        const rowChar = String.fromCharCode(65 + r);
        for (let c = 0; c < n; c++) {
          const code = rowChar + (c + 1);
          const isHome = tac.grgHomeCode && tac.grgHomeCode.toUpperCase() === code;
          if (isHome) {
            const topLat = startLat - r * dLat;
            const botLat = startLat - (r + 1) * dLat;
            const lLng = startLng + c * dLng;
            const rLng = startLng + (c + 1) * dLng;
            homeFeatures.push({
              type: "Feature",
              geometry: { type: "Polygon", coordinates: [[[lLng, topLat], [rLng, topLat], [rLng, botLat], [lLng, botLat], [lLng, topLat]]] }
            });
          }
          labelFeatures.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [startLng + (c + 0.5) * dLng, startLat - (r + 0.5) * dLat] },
            properties: { code: isHome ? code + " • CASA" : code }
          });
        }
      }
    }
    const gridGeo = { type: "FeatureCollection", features: gridFeatures };
    const lblGeo = { type: "FeatureCollection", features: labelFeatures };
    const homeGeo = { type: "FeatureCollection", features: homeFeatures };
    const homeCol = resolveSmartDisplayColor("#22C55E", "geom");
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (map.getSource("az-grg-home-src")) {
        map.getSource("az-grg-home-src").setData(homeGeo);
        if (map.getLayer("az-grg-home-fill")) map.setPaintProperty("az-grg-home-fill", "fill-color", homeCol);
        if (map.getLayer("az-grg-home-line")) map.setPaintProperty("az-grg-home-line", "line-color", homeCol);
      } else if (homeFeatures.length > 0) {
        map.addSource("az-grg-home-src", { type: "geojson", data: homeGeo });
        map.addLayer({ id: "az-grg-home-fill", type: "fill", source: "az-grg-home-src", paint: { "fill-color": homeCol, "fill-opacity": 0.24 } });
        map.addLayer({ id: "az-grg-home-line", type: "line", source: "az-grg-home-src", paint: { "line-color": homeCol, "line-width": 2.6 } });
      }
      if (map.getSource("az-grg-grid-src")) {
        map.getSource("az-grg-grid-src").setData(gridGeo);
        if (map.getLayer("az-grg-grid-line")) map.setPaintProperty("az-grg-grid-line", "line-color", pal.line);
      } else {
        map.addSource("az-grg-grid-src", { type: "geojson", data: gridGeo });
        map.addLayer({ id: "az-grg-grid-line", type: "line", source: "az-grg-grid-src", paint: { "line-color": pal.line, "line-width": 1.8, "line-opacity": 0.9 } });
      }
      if (map.getSource("az-grg-lbl-src")) {
        map.getSource("az-grg-lbl-src").setData(lblGeo);
        if (map.getLayer("az-grg-lbl-sym")) {
          map.setPaintProperty("az-grg-lbl-sym", "text-color", pal.text);
          map.setPaintProperty("az-grg-lbl-sym", "text-halo-color", pal.halo);
        }
      } else {
        map.addSource("az-grg-lbl-src", { type: "geojson", data: lblGeo });
        map.addLayer({
          id: "az-grg-lbl-sym",
          type: "symbol",
          source: "az-grg-lbl-src",
          layout: { "text-field": ["get", "code"], "text-size": 12, "text-allow-overlap": true },
          paint: { "text-color": pal.text, "text-halo-color": pal.halo, "text-halo-width": 2 }
        });
      }
    });
    const tile = document.getElementById("azGridGrgTile");
    if (tile) tile.classList.toggle("is-on", Boolean(cfg));
    if (typeof window.azUpdateSelfStatusBadge === "function") {
      window.azUpdateSelfStatusBadge(getEffectiveMyStatus(), getColorHex(tac.myColorId));
    }
  }
  window.azimuteRefreshTacticalThemeColors = function () {
    if (tac.grgConfig) renderGrgGridOnMaps(tac.grgConfig);
    renderFreehandStrokes(true);
    renderTrailsOnMaps(true);
    if (typeof renderPegadasOnMaps === "function") renderPegadasOnMaps();
    if (typeof updateTerrainTracesGeoJsonOnly === "function") updateTerrainTracesGeoJsonOnly();
    updateTacticalGeomsGeoJsonOnly();
    renderFlagsOnMaps(true);
    if (typeof renderMapTextsOnMaps === "function") renderMapTextsOnMaps(true);
    tac.pins.forEach(function (p) {
      const disp = resolveSmartDisplayColor(p.colorHex || "#C5A869", "pin");
      const txtC = getRelativeLuminance(disp) > 0.42 ? "#0D0D0D" : "#FFFFFF";
      (p.markers || []).forEach(function (it) {
        if (it.el) {
          it.el.style.setProperty("--pin-color", disp);
          it.el.style.setProperty("--pin-text-color", txtC);
          if (p.iconId === "camera") it.el.innerHTML = buildPinVisualHtml(p, disp);
        }
      });
    });
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
    if (tac.breadcrumbs && tac.breadcrumbs.length > 0) {
      const lineCoords = tac.breadcrumbs.map(function (c) { return [c.lng, c.lat]; });
      renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", lineCoords, "#38BDF8", false, null, null, 3.8);
    }
    if (tac.rulerCoords && tac.rulerCoords.length > 0) {
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, null, null);
    }
    updateBloodhoundVector();
  };
  window.azimuteRefreshGrgTheme = function () {
    window.azimuteRefreshTacticalThemeColors();
  };

  const WASPS_STORAGE_KEY = "az_tac_wasps_v1";
  const WASP_STATES = [
    {
      id: "pending", label: "A VERIFICAR", short: "VERIF", color: "#94A3B8",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9" stroke-dasharray="3 2"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.8.8c0 1.6-2.3 2-2.3 3.4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    },
    {
      id: "progress", label: "EM VARREDURA", short: "VARR", color: "#38BDF8",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/></svg>'
    },
    {
      id: "clear", label: "LIMPO / VERIFICADO", short: "LIMPO", color: "#22C55E",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="9"/><polyline points="8.5 12.5 11 15 16 9.5"/></svg>'
    },
    {
      id: "locked", label: "TRANCADO / OBSTRUÍDO", short: "TRANC", color: "#F59E0B",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
    },
    {
      id: "alert", label: "PERIGO / CONTATO", short: "PERIGO", color: "#EF4444",
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    }
  ];

  function serializeWaspItems() {
    return (tac.waspItems || []).map(function (w) {
      return {
        id: w.id,
        code: w.code || "W?",
        lat: w.lat,
        lng: w.lng,
        state: w.state || "pending",
        note: w.note || "",
        qra: w.qra || "",
        updatedAtStr: w.updatedAtStr || "",
        floorplanId: w.floorplanId || ""
      };
    });
  }

  function saveWaspsToStorage() {
    try {
      localStorage.setItem(WASPS_STORAGE_KEY, JSON.stringify(serializeWaspItems()));
    } catch (_) {}
  }

  function restoreWaspsFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem(WASPS_STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length > 0) {
        saved.forEach(function (it) { upsertWaspMarker(it, true); });
        syncWaspHudBar();
      }
    } catch (_) {}
  }

  function formatWaspStampNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function buildWaspPinInnerHtml(item, stObj) {
    const safeCode = (item.code || "W?").replace(/</g, "&lt;");
    const subParts = [];
    if (stObj.id === "clear" && item.qra) subParts.push(`${item.qra} ${item.updatedAtStr || ""}`.trim());
    else if (item.note) subParts.push(item.note);
    else if (item.qra && item.updatedAtStr) subParts.push(`${item.qra} ${item.updatedAtStr}`);
    const subHtml = subParts.length ? `<div class="az-wasp-sub">${subParts[0].replace(/</g, "&lt;")}</div>` : "";
    return `
      <div class="az-wasp-pill" style="border-color:${stObj.color};">
        <span style="color:${stObj.color};display:inline-flex;align-items:center;">${stObj.svg}</span>
        <span>${safeCode} • ${stObj.short}</span>
        <button type="button" class="az-wasp-edit-dot" title="Nota e detalhes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
      </div>
      ${subHtml}`;
  }

  function syncWaspHudBar() {
    const bar = document.getElementById("azWaspHudBar");
    if (!bar) return;
    const isPick = tac.toolMode === "wasp_pick";
    const items = tac.waspItems || [];
    const fpOpen = document.getElementById("azPlantaAdjustBar")?.classList.contains("is-open");
    if ((!isPick && items.length === 0) || fpOpen) {
      bar.classList.remove("is-open");
      return;
    }
    bar.classList.add("is-open");
    const counts = { pending: 0, progress: 0, clear: 0, locked: 0, alert: 0 };
    items.forEach(function (w) {
      counts[w.state] = (counts[w.state] || 0) + 1;
    });
    const total = items.length;
    const pct = total > 0 ? Math.round((counts.clear / total) * 100) : 0;
    const sumEl = document.getElementById("azWaspSummaryText");
    const fillEl = document.getElementById("azWaspProgressFill");
    const brkEl = document.getElementById("azWaspBreakdownText");
    const armBtn = document.getElementById("azWaspToggleArmBtn");
    if (sumEl) {
      const alertTxt = counts.alert > 0 ? ` • ${counts.alert} PERIGO` : "";
      const lockTxt = counts.locked > 0 ? ` • ${counts.locked} TRANC.` : "";
      sumEl.textContent = `WASP: ${counts.clear}/${total} LIMPOS (${pct}%)${lockTxt}${alertTxt}`;
      sumEl.style.color = counts.alert > 0 ? "#EF4444" : (total > 0 && counts.clear === total ? "#4ADE80" : "#C5A869");
    }
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
      fillEl.style.background = counts.alert > 0 ? "#EF4444" : "#22C55E";
    }
    if (brkEl) {
      brkEl.innerHTML = isPick
        ? `<span style="color:#4ADE80;">TOQUE NO MAPA/PLANTA PARA MARCAR • 1 TOQUE AVANÇA STATUS</span>`
        : `<span>Varredura: ${counts.progress} em curso • ${counts.pending} pendentes • ${counts.locked} trancados</span>`;
    }
    if (armBtn) {
      armBtn.textContent = isPick ? "SAIR MODO" : "+ MARCAR";
      armBtn.classList.toggle("is-active", isPick);
    }
  }

  function removeWaspMarkerById(id, fromSync) {
    const idx = (tac.waspItems || []).findIndex(function (w) { return w.id === id; });
    if (idx === -1) return null;
    const w = tac.waspItems[idx];
    const snap = {
      id: w.id, code: w.code, lat: w.lat, lng: w.lng, state: w.state,
      note: w.note || "", qra: w.qra || "", updatedAtStr: w.updatedAtStr || "",
      floorplanId: w.floorplanId || ""
    };
    (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} });
    tac.waspItems.splice(idx, 1);
    saveWaspsToStorage();
    syncWaspHudBar();
    if (!fromSync && tac.roomCode) {
      broadcastPacket({ kind: "wasp_sync", item: { id: id, deleted: true } });
    }
    return snap;
  }

  function openWaspDetailModal(waspObj) {
    if (!waspObj) return;
    tac.editingWaspId = waspObj.id;
    const titleEl = document.getElementById("azWaspModalTitle");
    const auditEl = document.getElementById("azWaspAuditInfo");
    const codeInp = document.getElementById("azWaspCodeInput");
    const noteInp = document.getElementById("azWaspNoteInput");
    const gridEl = document.getElementById("azWaspStateGrid");
    if (titleEl) titleEl.textContent = `PONTO WASP • ${waspObj.code || "SETOR"}`;
    if (auditEl) {
      auditEl.textContent = waspObj.qra
        ? `Última marca: ${waspObj.qra} às ${waspObj.updatedAtStr || "--:--"}`
        : "Toque em um estado ou adicione nota curta.";
    }
    if (codeInp) codeInp.value = waspObj.code || "";
    if (noteInp) noteInp.value = waspObj.note || "";
    if (gridEl) {
      gridEl.innerHTML = WASP_STATES.map(function (st) {
        const act = waspObj.state === st.id ? " is-active" : "";
        return `<button type="button" class="az-wasp-st-btn${act}" data-wasp-pick-st="${st.id}" style="border-color:${waspObj.state === st.id ? st.color : "#2A2A24"};color:${st.color};"><span style="width:13px;height:13px;display:inline-flex;">${st.svg}</span><span>${st.label}</span></button>`;
      }).join("");
      gridEl.querySelectorAll("[data-wasp-pick-st]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const pickedId = btn.getAttribute("data-wasp-pick-st");
          gridEl.setAttribute("data-selected-state", pickedId);
          gridEl.querySelectorAll("[data-wasp-pick-st]").forEach(function (b) {
            const bid = b.getAttribute("data-wasp-pick-st");
            const bSt = WASP_STATES.find(function (x) { return x.id === bid; });
            b.classList.toggle("is-active", bid === pickedId);
            b.style.borderColor = bid === pickedId && bSt ? bSt.color : "#2A2A24";
          });
        });
      });
      gridEl.setAttribute("data-selected-state", waspObj.state || "pending");
    }
    document.getElementById("azWaspDetailModal").classList.add("is-open");
  }

  function upsertWaspMarker(item, fromSync) {
    scanAndCaptureExistingMaps();
    if (!item || !item.id || tac.maps.length === 0 || typeof window.maplibregl === "undefined") return;
    if (item.deleted) {
      removeWaspMarkerById(item.id, true);
      return;
    }
    let ex = tac.waspItems.find(function (w) { return w.id === item.id; });
    const stObj = WASP_STATES.find(function (s) { return s.id === item.state; }) || WASP_STATES[0];
    if (ex) {
      ex.code = item.code || ex.code;
      ex.state = stObj.id;
      if (typeof item.note === "string") ex.note = item.note;
      if (typeof item.qra === "string") ex.qra = item.qra;
      if (typeof item.updatedAtStr === "string") ex.updatedAtStr = item.updatedAtStr;
      if (typeof item.floorplanId === "string") ex.floorplanId = item.floorplanId;
      ex.markers.forEach(function (mk) {
        mk.el.innerHTML = buildWaspPinInnerHtml(ex, stObj);
      });
    } else {
      ex = Object.assign({ note: "", qra: "", updatedAtStr: "", floorplanId: "" }, item, { state: stObj.id, markers: [] });
      tac.maps.forEach(function (m) {
        const el = document.createElement("div");
        el.className = "az-wasp-pin";
        el.innerHTML = buildWaspPinInnerHtml(ex, stObj);
        let holdTimer = null;
        let heldOpen = false;
        el.addEventListener("pointerdown", function (ev) {
          if (ev.target && ev.target.closest && ev.target.closest(".az-wasp-edit-dot")) return;
          heldOpen = false;
          holdTimer = setTimeout(function () {
            heldOpen = true;
            openWaspDetailModal(ex);
          }, 420);
        });
        function cancelHold() {
          if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
        }
        el.addEventListener("pointerup", cancelHold);
        el.addEventListener("pointercancel", cancelHold);
        el.addEventListener("pointermove", cancelHold);

        el.addEventListener("click", function (ev) {
          ev.stopPropagation();
          if (heldOpen) { heldOpen = false; return; }
          if (tac.eraserActive) {
            const snapWasp = removeWaspMarkerById(ex.id, false);
            if (snapWasp) {
              pushUndoAction({ type: "del_wasps", wasps: [snapWasp] });
              refreshLeftControls();
            }
            return;
          }
          if (ev.target && ev.target.closest && ev.target.closest(".az-wasp-edit-dot")) {
            openWaspDetailModal(ex);
            return;
          }
          const prevSnap = {
            id: ex.id, code: ex.code, lat: ex.lat, lng: ex.lng, state: ex.state,
            note: ex.note || "", qra: ex.qra || "", updatedAtStr: ex.updatedAtStr || "",
            floorplanId: ex.floorplanId || ""
          };
          const idx = WASP_STATES.findIndex(function (s) { return s.id === ex.state; });
          const nextSt = WASP_STATES[(idx + 1) % WASP_STATES.length];
          const stampQra = tac.myQra || "OP";
          const stampHr = formatWaspStampNow();
          upsertWaspMarker({
            id: ex.id, code: ex.code, lat: ex.lat, lng: ex.lng, state: nextSt.id,
            note: ex.note || "", qra: stampQra, updatedAtStr: stampHr, floorplanId: ex.floorplanId || ""
          }, false);
          pushUndoAction({
            type: "wasp_edit", waspId: ex.id, prev: prevSnap,
            next: Object.assign({}, prevSnap, { state: nextSt.id, qra: stampQra, updatedAtStr: stampHr })
          });
          vibratePattern(25);
          showToast(`${ex.code}: ${nextSt.label}${nextSt.id === "clear" ? " (" + stampQra + " " + stampHr + ")" : ""}`);
        });
        const marker = new window.maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([ex.lng, ex.lat]).addTo(m);
        ex.markers.push({ marker: marker, el: el });
      });
      tac.waspItems.push(ex);
    }
    if (!fromSync) saveWaspsToStorage();
    syncWaspHudBar();
    if (!fromSync && tac.roomCode) {
      broadcastPacket({
        kind: "wasp_sync",
        item: {
          id: ex.id, code: ex.code, lat: ex.lat, lng: ex.lng, state: ex.state,
          note: ex.note || "", qra: ex.qra || "", updatedAtStr: ex.updatedAtStr || "",
          floorplanId: ex.floorplanId || ""
        }
      });
    }
  }

  function clearGeomHandles() {
    if (Array.isArray(tac.geomHandles)) {
      tac.geomHandles.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.geomHandles = [];
  }

  function updateTacticalGeomsGeoJsonOnly() {
    const polyFeatures = [];
    const lblFeatures = [];
    tac.tacticalGeoms.forEach(function (g) {
      const steps = g.shape === "rect" ? 4 : 40;
      const dLat = (g.heightM / (g.shape === "circle" ? 1 : 2)) / 111320;
      const dLng = (g.widthM / (g.shape === "circle" ? 1 : 2)) / (111320 * Math.max(0.2, Math.cos((g.lat * Math.PI) / 180)));
      let ring = [];
      if (g.shape === "rect") {
        ring = [
          [g.lng - dLng, g.lat + dLat],
          [g.lng + dLng, g.lat + dLat],
          [g.lng + dLng, g.lat - dLat],
          [g.lng - dLng, g.lat - dLat],
          [g.lng - dLng, g.lat + dLat]
        ];
      } else {
        const rx = g.shape === "circle" ? (g.widthM / 111320) / Math.max(0.2, Math.cos((g.lat * Math.PI) / 180)) : dLng;
        const ry = g.shape === "circle" ? (g.widthM / 111320) : dLat;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          ring.push([g.lng + Math.cos(a) * rx, g.lat + Math.sin(a) * ry]);
        }
      }
      polyFeatures.push({
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [ring] },
        properties: { color: resolveSmartDisplayColor(g.color || "#38BDF8", "geom") }
      });
      lblFeatures.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [g.lng, g.lat] },
        properties: { label: g.label || "ÁREA" }
      });
    });
    const polyGeo = { type: "FeatureCollection", features: polyFeatures };
    const lblGeo = { type: "FeatureCollection", features: lblFeatures };
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (map.getSource("az-tac-geom-src")) map.getSource("az-tac-geom-src").setData(polyGeo);
      else {
        map.addSource("az-tac-geom-src", { type: "geojson", data: polyGeo });
        map.addLayer({ id: "az-tac-geom-fill", type: "fill", source: "az-tac-geom-src", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.18 } });
        map.addLayer({ id: "az-tac-geom-line", type: "line", source: "az-tac-geom-src", paint: { "line-color": ["get", "color"], "line-width": 2.2 } });
      }
      if (map.getSource("az-tac-geom-lbl-src")) map.getSource("az-tac-geom-lbl-src").setData(lblGeo);
      else {
        map.addSource("az-tac-geom-lbl-src", { type: "geojson", data: lblGeo });
        map.addLayer({
          id: "az-tac-geom-lbl-sym",
          type: "symbol",
          source: "az-tac-geom-lbl-src",
          layout: { "text-field": ["get", "label"], "text-size": 11, "text-offset": [0, 1.3], "text-allow-overlap": true },
          paint: { "text-color": "#FFFFFF", "text-halo-color": "#0D0D0D", "text-halo-width": 2 }
        });
      }
    });
  }

  function renderTacticalGeomsOnMaps() {
    updateTacticalGeomsGeoJsonOnly();
    clearGeomHandles();
    if (!window.maplibregl || !tac.tacticalGeoms.length) return;

    tac.maps.forEach(function (map) {
      tac.tacticalGeoms.forEach(function (g) {
        const cosLat = Math.max(0.2, Math.cos((g.lat * Math.PI) / 180));
        const dLat = (g.heightM / (g.shape === "circle" ? 1 : 2)) / 111320;
        const dLng = (g.widthM / (g.shape === "circle" ? 1 : 2)) / (111320 * cosLat);
        const rLat = (g.widthM || 150) / 111320;
        const rLng = rLat / cosLat;

        const handleSpecs = [];
        if (g.shape === "rect") {
          handleSpecs.push({ role: "nw", lng: g.lng - dLng, lat: g.lat + dLat });
          handleSpecs.push({ role: "ne", lng: g.lng + dLng, lat: g.lat + dLat });
          handleSpecs.push({ role: "se", lng: g.lng + dLng, lat: g.lat - dLat });
          handleSpecs.push({ role: "sw", lng: g.lng - dLng, lat: g.lat - dLat });
        } else if (g.shape === "ellipse") {
          handleSpecs.push({ role: "n", lng: g.lng, lat: g.lat + dLat });
          handleSpecs.push({ role: "s", lng: g.lng, lat: g.lat - dLat });
          handleSpecs.push({ role: "e", lng: g.lng + dLng, lat: g.lat });
          handleSpecs.push({ role: "w", lng: g.lng - dLng, lat: g.lat });
        } else {
          handleSpecs.push({ role: "r_e", lng: g.lng + rLng, lat: g.lat });
          handleSpecs.push({ role: "r_n", lng: g.lng, lat: g.lat + rLat });
        }

        const extMarkers = [];
        const placeExt = function (spec) {
          const el = document.createElement("div");
          el.className = "az-geom-handle";
          el.title = "Arraste o ponto branco para ajustar forma";
          const mk = new window.maplibregl.Marker({ element: el, anchor: "center", draggable: true })
            .setLngLat([spec.lng, spec.lat])
            .addTo(map);
          let snapBefore = null;
          mk.on("dragstart", function () {
            snapBefore = { lat: g.lat, lng: g.lng, widthM: g.widthM, heightM: g.heightM };
          });
          mk.on("drag", function () {
            const ll = mk.getLngLat();
            if (!ll) return;
            const cLat = Math.max(0.2, Math.cos((g.lat * Math.PI) / 180));
            if (g.shape === "circle") {
              const nr = Math.max(20, Math.round(calcDistAndBearing(g.lat, g.lng, ll.lat, ll.lng).dist));
              g.widthM = nr;
              g.heightM = nr;
            } else {
              if (spec.role.includes("n") || spec.role.includes("s")) {
                g.heightM = Math.max(20, Math.round(Math.abs(ll.lat - g.lat) * 111320 * 2));
              }
              if (spec.role.includes("e") || spec.role.includes("w")) {
                g.widthM = Math.max(20, Math.round(Math.abs(ll.lng - g.lng) * 111320 * cLat * 2));
              }
            }
            updateTacticalGeomsGeoJsonOnly();
          });
          mk.on("dragend", function () {
            if (snapBefore) {
              pushUndoAction({ type: "geom_edit", id: g.id, prev: snapBefore, next: { lat: g.lat, lng: g.lng, widthM: g.widthM, heightM: g.heightM } });
            }
            renderTacticalGeomsOnMaps();
            if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
          });
          tac.geomHandles.push(mk);
          extMarkers.push({ mk: mk, spec: spec });
        };
        handleSpecs.forEach(placeExt);

        // Centro arrastável para MOVER a geometria inteira
        const mEl = document.createElement("div");
        mEl.className = "az-geom-move-grip";
        mEl.title = "Arraste para mover geometria";
        mEl.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>';
        const moveMk = new window.maplibregl.Marker({ element: mEl, anchor: "center", draggable: true })
          .setLngLat([g.lng, g.lat])
          .addTo(map);
        let moveBefore = null;
        moveMk.on("dragstart", function () {
          moveBefore = { lat: g.lat, lng: g.lng, widthM: g.widthM, heightM: g.heightM };
        });
        moveMk.on("drag", function () {
          const ll = moveMk.getLngLat();
          if (!ll) return;
          const dLa = ll.lat - g.lat;
          const dLn = ll.lng - g.lng;
          g.lat = ll.lat;
          g.lng = ll.lng;
          extMarkers.forEach(function (em) {
            const p = em.mk.getLngLat();
            em.mk.setLngLat([p.lng + dLn, p.lat + dLa]);
          });
          updateTacticalGeomsGeoJsonOnly();
        });
        moveMk.on("dragend", function () {
          if (moveBefore) {
            pushUndoAction({ type: "geom_edit", id: g.id, prev: moveBefore, next: { lat: g.lat, lng: g.lng, widthM: g.widthM, heightM: g.heightM } });
          }
          renderTacticalGeomsOnMaps();
          if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
        });
        tac.geomHandles.push(moveMk);
      });
    });
    if (typeof checkGeofenceProximityAlerts === "function") checkGeofenceProximityAlerts();
  }

  /* =====================================================================
     TRAÇADOS ARTICULADOS EDITÁVEIS (ESCADAS, BECOS, CERCAS E BARRICADAS)
     ===================================================================== */
  const TERRAIN_TRACE_META = {
    escada: { prefix: "ESCADA", defaultCol: "#F59E0B", tags: ["ÍNGREME", "ILUMINADA", "ESCORREGADIA", "ESCURA", "ESTREITA", "LANCES LONGOS"] },
    beco: { prefix: "BECO", defaultCol: "#38BDF8", tags: ["COM SAÍDA", "SEM SAÍDA", "PASSA MOTO", "SÓ A PÉ", "ESCURO", "ALAGADO"] },
    cerca: { prefix: "CERCA", defaultCol: "#C084FC", tags: ["MURO ALTO", "ALAMBRADO", "CERCA ELÉTRICA", "CONCERTINA", "ARROMBADA", "VAZADA"] },
    barricada: { prefix: "BARRICADA", defaultCol: "#EF4444", tags: ["VIA TOTAL", "MEIA PISTA", "FOGO / ENTULHO", "ARAME / TRONCO", "TRANSPONÍVEL"] }
  };

  function calcTraceDistanceMeters(coords) {
    if (!Array.isArray(coords) || coords.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      total += calcDistAndBearing(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]).dist;
    }
    return Math.round(total);
  }

  function clearTraceVertexHandles() {
    if (Array.isArray(tac.traceVertexHandles)) {
      tac.traceVertexHandles.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.traceVertexHandles = [];
  }

  function saveTerrainTracesToStorage() {
    try {
      const compact = (tac.terrainTraces || []).map(function (t) {
        return {
          id: t.id, kind: t.kind, label: t.label, coords: t.coords,
          distanceM: t.distanceM || 0, color: t.color, tags: t.tags || [], notes: t.notes || ""
        };
      });
      localStorage.setItem("az_tac_terrain_traces_v1", JSON.stringify(compact));
    } catch (_) {}
  }

  function restoreTerrainTracesFromStorage() {
    if (tac._tracesRestoredOnce) return;
    tac._tracesRestoredOnce = true;
    try {
      const arr = JSON.parse(localStorage.getItem("az_tac_terrain_traces_v1") || "[]");
      if (Array.isArray(arr) && arr.length > 0) {
        tac.terrainTraces = arr.filter(function (t) { return t && t.id && Array.isArray(t.coords); });
        renderTerrainTracesOnMaps(true);
      }
    } catch (_) {}
  }

  function updateTerrainTracesGeoJsonOnly() {
    const lineFeatures = [];
    const lblFeatures = [];
    const pal = getGrgContrastColors();

    (tac.terrainTraces || []).forEach(function (t) {
      if (!Array.isArray(t.coords) || t.coords.length === 0) return;
      t.distanceM = calcTraceDistanceMeters(t.coords);
      const meta = TERRAIN_TRACE_META[t.kind] || TERRAIN_TRACE_META.beco;
      const dispCol = resolveSmartDisplayColor(t.color || meta.defaultCol, "line");

      if (t.coords.length >= 2) {
        lineFeatures.push({
          type: "Feature",
          geometry: { type: "LineString", coordinates: t.coords },
          properties: { id: t.id, kind: t.kind || "beco", color: dispCol }
        });
      }
      const midIdx = Math.floor(t.coords.length / 2);
      const midCoord = t.coords[midIdx] || t.coords[0];
      const tagStr = (Array.isArray(t.tags) && t.tags.length > 0) ? (" [" + t.tags[0] + "]") : "";
      lblFeatures.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: midCoord },
        properties: { id: t.id, text: `${t.label || meta.prefix} • ${t.distanceM}m${tagStr}` }
      });
    });

    const lineGeo = { type: "FeatureCollection", features: lineFeatures };
    const lblGeo = { type: "FeatureCollection", features: lblFeatures };

    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (map.getSource("az-trc-src")) {
        map.getSource("az-trc-src").setData(lineGeo);
      } else {
        map.addSource("az-trc-src", { type: "geojson", data: lineGeo });
        map.addLayer({ id: "az-trc-escada-base", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "escada"], layout: { "line-cap": "butt", "line-join": "round" }, paint: { "line-color": ["get", "color"], "line-width": 2.2 } });
        map.addLayer({ id: "az-trc-escada-steps", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "escada"], paint: { "line-color": ["get", "color"], "line-width": 8.5, "line-dasharray": [0.35, 0.9] } });

        map.addLayer({ id: "az-trc-beco-bg", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "beco"], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": ["get", "color"], "line-width": 7, "line-opacity": 0.25 } });
        map.addLayer({ id: "az-trc-beco-dash", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "beco"], layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": ["get", "color"], "line-width": 3, "line-dasharray": [2.2, 1.3] } });

        map.addLayer({ id: "az-trc-cerca-base", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "cerca"], paint: { "line-color": ["get", "color"], "line-width": 2.4 } });
        map.addLayer({ id: "az-trc-cerca-posts", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "cerca"], paint: { "line-color": ["get", "color"], "line-width": 7.5, "line-dasharray": [0.22, 1.35] } });

        map.addLayer({ id: "az-trc-barricada-bg", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "barricada"], paint: { "line-color": "#0D0D0D", "line-width": 6.5, "line-opacity": 0.85 } });
        map.addLayer({ id: "az-trc-barricada-top", type: "line", source: "az-trc-src", filter: ["==", ["get", "kind"], "barricada"], paint: { "line-color": ["get", "color"], "line-width": 4.2, "line-dasharray": [1.4, 1.0] } });
      }
      if (map.getSource("az-trc-lbl-src")) {
        map.getSource("az-trc-lbl-src").setData(lblGeo);
        if (map.getLayer("az-trc-lbl-sym")) {
          map.setPaintProperty("az-trc-lbl-sym", "text-color", pal.text);
          map.setPaintProperty("az-trc-lbl-sym", "text-halo-color", pal.halo);
        }
      } else {
        map.addSource("az-trc-lbl-src", { type: "geojson", data: lblGeo });
        map.addLayer({
          id: "az-trc-lbl-sym",
          type: "symbol",
          source: "az-trc-lbl-src",
          layout: { "text-field": ["get", "text"], "text-size": 10.5, "text-offset": [0, -1.2], "text-allow-overlap": true },
          paint: { "text-color": pal.text, "text-halo-color": pal.halo, "text-halo-width": 2 }
        });
      }
    });
  }

  function renderTerrainTracesOnMaps(skipPersist, fromSync) {
    updateTerrainTracesGeoJsonOnly();
    clearTraceVertexHandles();
    if (!skipPersist) saveTerrainTracesToStorage();
    if (!fromSync && !skipPersist && tac.roomCode) {
      broadcastPacket({ kind: "traces_sync_all", traces: tac.terrainTraces });
    }
    if (!window.maplibregl || !tac.activeTraceId) return;

    const trace = (tac.terrainTraces || []).find(function (t) { return t.id === tac.activeTraceId; });
    if (!trace || !Array.isArray(trace.coords)) return;

    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      trace.coords.forEach(function (coord, idx) {
        const el = document.createElement("div");
        el.className = "az-geom-handle";
        el.title = `Vértice ${idx + 1} (arraste p/ mover • toque 2x p/ remover)`;
        const mk = new window.maplibregl.Marker({ element: el, anchor: "center", draggable: true })
          .setLngLat(coord)
          .addTo(map);
        let prevCoordsSnap = null;
        mk.on("dragstart", function () {
          prevCoordsSnap = cloneTacData(trace.coords);
        });
        mk.on("drag", function () {
          const ll = mk.getLngLat();
          if (!ll) return;
          trace.coords[idx] = [ll.lng, ll.lat];
          updateTerrainTracesGeoJsonOnly();
        });
        mk.on("dragend", function () {
          if (prevCoordsSnap) {
            pushUndoAction({ type: "trace_edit", id: trace.id, prev: { coords: prevCoordsSnap }, next: { coords: cloneTacData(trace.coords) } });
          }
          renderTerrainTracesOnMaps(false);
          showToast(`${trace.label}: ${trace.distanceM}m`);
        });
        el.addEventListener("dblclick", function (ev) {
          ev.stopPropagation();
          if (trace.coords.length > 2) {
            const beforeC = cloneTacData(trace.coords);
            trace.coords.splice(idx, 1);
            pushUndoAction({ type: "trace_edit", id: trace.id, prev: { coords: beforeC }, next: { coords: cloneTacData(trace.coords) } });
            renderTerrainTracesOnMaps(false);
            showToast(`Vértice removido • ${trace.distanceM}m`);
          }
        });
        tac.traceVertexHandles.push(mk);

        // Ponto médio para inserir curva suave entre vértices
        if (idx < trace.coords.length - 1) {
          const nxt = trace.coords[idx + 1];
          const mid = [(coord[0] + nxt[0]) / 2, (coord[1] + nxt[1]) / 2];
          const mEl = document.createElement("div");
          mEl.className = "az-trace-mid-handle";
          mEl.title = "Toque para inserir ponto de curva";
          const mMk = new window.maplibregl.Marker({ element: mEl, anchor: "center" }).setLngLat(mid).addTo(map);
          mEl.addEventListener("click", function (ev) {
            ev.stopPropagation();
            const beforeC = cloneTacData(trace.coords);
            trace.coords.splice(idx + 1, 0, mid);
            pushUndoAction({ type: "trace_edit", id: trace.id, prev: { coords: beforeC }, next: { coords: cloneTacData(trace.coords) } });
            renderTerrainTracesOnMaps(false);
            showToast(`Curva adicionada (${trace.coords.length} pts • ${trace.distanceM}m)`);
          });
          tac.traceVertexHandles.push(mMk);
        }
      });
    });
  }

  function openTraceDetailModal(trace) {
    if (!trace) return;
    tac.editingDetailTraceId = trace.id;
    const meta = TERRAIN_TRACE_META[trace.kind] || TERRAIN_TRACE_META.beco;
    trace.distanceM = calcTraceDistanceMeters(trace.coords);

    const titleEl = document.getElementById("azTraceModalTitle");
    const distEl = document.getElementById("azTraceDistReadout");
    const lblInp = document.getElementById("azTraceLabelInput");
    const notesInp = document.getElementById("azTraceNotesInput");
    const tagsWrap = document.getElementById("azTraceTagsWrap");
    const editVBtn = document.getElementById("azEditTraceVerticesBtn");

    if (titleEl) titleEl.textContent = `${meta.prefix} • FICHA TÁTICA`;
    if (distEl) distEl.textContent = `Distância total: ${trace.distanceM} m (${(trace.coords || []).length} pontos)`;
    if (lblInp) lblInp.value = trace.label || meta.prefix;
    if (notesInp) notesInp.value = trace.notes || "";
    if (editVBtn) {
      editVBtn.textContent = tac.activeTraceId === trace.id ? "CONCLUIR VÉRTICES" : "EDITAR VÉRTICES";
    }
    if (tagsWrap) {
      const selected = Array.isArray(trace.tags) ? trace.tags : [];
      tagsWrap.innerHTML = (meta.tags || []).map(function (tg) {
        const act = selected.includes(tg) ? " is-active" : "";
        return `<button type="button" class="az-trace-tag-chip${act}" data-trc-tag="${tg}">${tg}</button>`;
      }).join("");
      tagsWrap.querySelectorAll("[data-trc-tag]").forEach(function (ch) {
        ch.addEventListener("click", function () {
          ch.classList.toggle("is-active");
        });
      });
    }
    document.getElementById("azTraceDetailModal").classList.add("is-open");
  }

  // ==================== BLOCO 4: PLANTA BAIXA / CROQUI SOBREPOSTO (RUBBER SHEET ATAK) ====================
  const FLOORPLANS_STORAGE_KEY = "az_tac_floorplans_v1";

  function saveFloorplansToStorage() {
    try {
      const compact = (tac.floorplans || []).map(function (fp) {
        return {
          id: fp.id,
          label: fp.label || "PLANTA",
          dataUrl: fp.dataUrl,
          origDataUrl: fp.origDataUrl || fp.dataUrl,
          tintColor: fp.tintColor || "orig",
          centerLng: fp.centerLng,
          centerLat: fp.centerLat,
          halfW_m: fp.halfW_m,
          halfH_m: fp.halfH_m,
          angleDeg: fp.angleDeg || 0,
          opacity: typeof fp.opacity === "number" ? fp.opacity : 0.65,
          locked: Boolean(fp.locked),
          visible: fp.visible !== false,
          aspect: fp.aspect || 1.4
        };
      });
      localStorage.setItem(FLOORPLANS_STORAGE_KEY, JSON.stringify(compact));
    } catch (_) {
      showToast("Armazenamento local cheio para plantas. Remova plantas antigas.", 3200, true);
    }
  }

  function restoreFloorplansFromStorage() {
    if (tac.floorplans && tac.floorplans.length > 0) {
      renderFloorplansOnMaps(true, true);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem(FLOORPLANS_STORAGE_KEY) || "[]");
      if (Array.isArray(saved) && saved.length > 0) {
        tac.floorplans = saved;
        renderFloorplansOnMaps(true, true);
      }
    } catch (_) {}
  }

  function computeFloorplanCorners(fp) {
    const cLat = Number(fp.centerLat) || -19.9245;
    const cLng = Number(fp.centerLng) || -43.9352;
    const hw = Math.max(2, Number(fp.halfW_m) || 22);
    const hh = Math.max(2, Number(fp.halfH_m) || 16);
    const rad = ((Number(fp.angleDeg) || 0) * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const mPerLat = 111320;
    const mPerLng = Math.max(1000, 111320 * Math.cos((cLat * Math.PI) / 180));
    function toLngLat(dx, dy) {
      const rx = dx * cosA + dy * sinA;
      const ry = -dx * sinA + dy * cosA;
      return [cLng + rx / mPerLng, cLat + ry / mPerLat];
    }
    // MapLibre image source: [top-left(NW), top-right(NE), bottom-right(SE), bottom-left(SW)]
    return [toLngLat(-hw, hh), toLngLat(hw, hh), toLngLat(hw, -hh), toLngLat(-hw, -hh)];
  }

  function clearFloorplanHandles() {
    if (Array.isArray(tac.floorplanHandles)) {
      tac.floorplanHandles.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.floorplanHandles = [];
  }

  function getFloorplanBeforeLayerId(map) {
    const tacOrder = [
      "az-tac-flag-fill", "az-tac-geom-fill", "az-tac-circle-fill",
      "az-trc-escada-base", "az-tac-draw-line", "az-tac-crumbs-line", "az-tac-ruler-line"
    ];
    return tacOrder.find(function (lid) { return Boolean(map.getLayer(lid)); });
  }

  function updateFloorplanSourceFast(fp) {
    if (!fp) return;
    const coords = computeFloorplanCorners(fp);
    const sId = "az-fp-src-" + fp.id;
    const lId = "az-fp-lyr-" + fp.id;
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      const src = map.getSource(sId);
      if (src && typeof src.setCoordinates === "function") {
        try { src.setCoordinates(coords); } catch (_) {}
      }
      if (map.getLayer(lId)) {
        const op = fp.visible === false ? 0 : Math.max(0.1, Math.min(1, Number(fp.opacity) || 0.65));
        try { map.setPaintProperty(lId, "raster-opacity", op); } catch (_) {}
      }
      const boxSrc = map.getSource("az-fp-box-src");
      if (boxSrc) {
        const ring = coords.concat([coords[0]]);
        boxSrc.setData({ type: "FeatureCollection", features: [{ type: "Feature", geometry: { type: "LineString", coordinates: ring } }] });
      }
      if (typeof map.triggerRepaint === "function") map.triggerRepaint();
    });
    if (tac._activeFpHandles && tac._activeFpHandles.fpId === fp.id) {
      try {
        if (tac._activeFpHandles.moveMk && !tac._activeFpHandles.draggingMove) {
          tac._activeFpHandles.moveMk.setLngLat([fp.centerLng, fp.centerLat]);
        }
        if (tac._activeFpHandles.scaleMk && !tac._activeFpHandles.draggingScale) {
          tac._activeFpHandles.scaleMk.setLngLat(coords[2]);
        }
        if (tac._activeFpHandles.rotMk && !tac._activeFpHandles.draggingRot && typeof tac._activeFpHandles.computeRot === "function") {
          tac._activeFpHandles.rotMk.setLngLat(tac._activeFpHandles.computeRot(fp));
        }
      } catch (_) {}
    }
  }

  function syncFloorplanAdjustBar() {
    const bar = document.getElementById("azPlantaAdjustBar");
    if (!bar) return;
    const fp = (tac.floorplans || []).find(function (x) { return x.id === tac.activeFloorplanId; });
    if (!fp || (!tac.editingFloorplanId && fp.locked)) {
      if (!tac.editingFloorplanId) {
        bar.classList.remove("is-open");
        return;
      }
    }
    const targetFp = (tac.floorplans || []).find(function (x) {
      return x.id === (tac.editingFloorplanId || tac.activeFloorplanId);
    });
    if (!targetFp) {
      bar.classList.remove("is-open");
      return;
    }
    const titleEl = document.getElementById("azFpBarTitle");
    const opRange = document.getElementById("azFpOpacityRange");
    const opVal = document.getElementById("azFpOpacityVal");
    const angRange = document.getElementById("azFpAngleRange");
    const angVal = document.getElementById("azFpAngleVal");
    const lockBtn = document.getElementById("azFpLockToggleBtn");
    const pct = Math.round((typeof targetFp.opacity === "number" ? targetFp.opacity : 0.65) * 100);
    const deg = Math.round(((Number(targetFp.angleDeg) || 0) % 360 + 360) % 360);
    if (titleEl) titleEl.textContent = `${targetFp.label || "PLANTA"} ${targetFp.locked ? "• TRAVADA" : "• AJUSTE"}`;
    if (opRange) opRange.value = String(pct);
    if (opVal) opVal.textContent = `${pct}%`;
    if (angRange) angRange.value = String(deg);
    if (angVal) angVal.textContent = `${deg}°`;
    if (lockBtn) {
      lockBtn.textContent = targetFp.locked ? "DESTRAVAR PLANTA" : "TRAVAR PLANTA";
      lockBtn.classList.toggle("is-active", !targetFp.locked);
    }
    const activeTint = targetFp.tintColor || "orig";
    document.querySelectorAll("[data-fp-tint]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-fp-tint") === activeTint);
    });
  }

  function renderFloorplansListModal() {
    const wrap = document.getElementById("azPlantaListWrap");
    if (!wrap) return;
    const list = tac.floorplans || [];
    if (!list.length) {
      wrap.innerHTML = '<div style="padding:14px;text-align:center;font-size:10px;color:#9E9A8F;background:#0D0D0D;border:1px dashed #2A2A24;border-radius:8px;">Nenhuma planta ou croqui ancorado no mapa.<br>Use os botões abaixo para subir foto ou desenhar.</div>';
      return;
    }
    wrap.innerHTML = list.map(function (fp) {
      const sel = fp.id === tac.activeFloorplanId ? " is-selected" : "";
      const pct = Math.round((typeof fp.opacity === "number" ? fp.opacity : 0.65) * 100);
      const stTxt = fp.locked ? "TRAVADA" : "EDITÁVEL";
      const stCol = fp.locked ? "#4ADE80" : "#F59E0B";
      const visTxt = fp.visible === false ? "MOSTRAR" : "OCULTAR";
      return `
        <div class="az-planta-list-item${sel}" data-fp-row="${fp.id}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <span style="font-size:10px;font-weight:900;color:#C5A869;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(fp.label || "PLANTA").replace(/</g, "&lt;")}</span>
            <span style="font-size:8.5px;font-weight:900;color:${stCol};">${stTxt} • ${pct}%</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
            <button type="button" class="az-atak-tool-btn" data-fp-act="focus" data-fp-id="${fp.id}" style="height:25px;font-size:8.5px;">FOCAR</button>
            <button type="button" class="az-atak-tool-btn is-active" data-fp-act="adjust" data-fp-id="${fp.id}" style="height:25px;font-size:8.5px;">AJUSTAR</button>
            <button type="button" class="az-atak-tool-btn" data-fp-act="toggle_vis" data-fp-id="${fp.id}" style="height:25px;font-size:8.5px;">${visTxt}</button>
            <button type="button" class="az-atak-tool-btn is-danger" data-fp-act="delete" data-fp-id="${fp.id}" style="height:25px;font-size:8.5px;">EXCLUIR</button>
          </div>
        </div>`;
    }).join("");

    wrap.querySelectorAll("[data-fp-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const fpId = btn.getAttribute("data-fp-id");
        const act = btn.getAttribute("data-fp-act");
        const fp = (tac.floorplans || []).find(function (x) { return x.id === fpId; });
        if (!fp) return;
        if (act === "focus") {
          tac.activeFloorplanId = fp.id;
          const m = getActiveMap();
          if (m) m.flyTo({ center: [fp.centerLng, fp.centerLat], zoom: Math.max(m.getZoom(), 18.2), duration: 480 });
          document.getElementById("azPlantaModal").classList.remove("is-open");
          document.getElementById("azPlantaAdjustBar").classList.add("is-open");
          syncFloorplanAdjustBar();
        } else if (act === "adjust") {
          const prevSnap = cloneTacData(fp);
          fp.visible = true;
          fp.locked = false;
          tac.activeFloorplanId = fp.id;
          tac.editingFloorplanId = fp.id;
          pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prevSnap, next: cloneTacData(fp) });
          renderFloorplansOnMaps(false);
          document.getElementById("azPlantaModal").classList.remove("is-open");
          document.getElementById("azPlantaAdjustBar").classList.add("is-open");
          syncFloorplanAdjustBar();
          const m = getActiveMap();
          if (m) m.flyTo({ center: [fp.centerLng, fp.centerLat], zoom: Math.max(m.getZoom(), 18.2), duration: 420 });
          showToast("Arraste as alças (centro, escala, rotação) para alinhar sobre o telhado.");
        } else if (act === "toggle_vis") {
          const prevSnap = cloneTacData(fp);
          fp.visible = fp.visible === false;
          pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prevSnap, next: cloneTacData(fp) });
          renderFloorplansOnMaps(false);
          renderFloorplansListModal();
        } else if (act === "delete") {
          const removed = cloneTacData(fp);
          tac.floorplans = (tac.floorplans || []).filter(function (x) { return x.id !== fp.id; });
          if (tac.activeFloorplanId === fp.id) tac.activeFloorplanId = null;
          if (tac.editingFloorplanId === fp.id) tac.editingFloorplanId = null;
          pushUndoAction({ type: "del_fps", fps: [removed] });
          renderFloorplansOnMaps(false);
          renderFloorplansListModal();
          syncFloorplanAdjustBar();
          showToast("Planta removida (use DESFAZER para recuperar).");
        }
      });
    });
  }

  function renderFloorplansOnMaps(skipPersist, fromSync) {
    if (!skipPersist) saveFloorplansToStorage();
    if (!fromSync && !skipPersist && tac.roomCode) {
      broadcastPacket({ kind: "floorplans_sync_all", floorplans: tac.floorplans || [] });
    }
    clearFloorplanHandles();

    const activeIds = new Set((tac.floorplans || []).map(function (fp) { return fp.id; }));
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (Array.isArray(map._azFpIds)) {
        map._azFpIds.forEach(function (oldId) {
          if (!activeIds.has(oldId)) {
            if (map.getLayer("az-fp-lyr-" + oldId)) try { map.removeLayer("az-fp-lyr-" + oldId); } catch (_) {}
            if (map.getSource("az-fp-src-" + oldId)) try { map.removeSource("az-fp-src-" + oldId); } catch (_) {}
          }
        });
      }
      map._azFpIds = (tac.floorplans || []).map(function (fp) { return fp.id; });

      const beforeId = getFloorplanBeforeLayerId(map);
      (tac.floorplans || []).forEach(function (fp) {
        const sId = "az-fp-src-" + fp.id;
        const lId = "az-fp-lyr-" + fp.id;
        const coords = computeFloorplanCorners(fp);
        const op = fp.visible === false ? 0 : Math.max(0.1, Math.min(1, Number(fp.opacity) || 0.65));
        const existingSrc = map.getSource(sId);
        if (existingSrc) {
          try {
            if (existingSrc._azFpUrl !== fp.dataUrl && typeof existingSrc.updateImage === "function") {
              existingSrc.updateImage({ url: fp.dataUrl, coordinates: coords });
              existingSrc._azFpUrl = fp.dataUrl;
            } else if (typeof existingSrc.setCoordinates === "function") {
              existingSrc.setCoordinates(coords);
            }
          } catch (_) {}
        } else {
          try {
            map.addSource(sId, { type: "image", url: fp.dataUrl, coordinates: coords });
            const newSrc = map.getSource(sId);
            if (newSrc) newSrc._azFpUrl = fp.dataUrl;
          } catch (_) {}
        }
        if (!map.getLayer(lId) && map.getSource(sId)) {
          try {
            map.addLayer({
              id: lId,
              type: "raster",
              source: sId,
              paint: { "raster-opacity": op, "raster-fade-duration": 0 }
            }, beforeId);
          } catch (_) {}
        } else if (map.getLayer(lId)) {
          try { map.setPaintProperty(lId, "raster-opacity", op); } catch (_) {}
        }
      });

      const editFp = (tac.floorplans || []).find(function (fp) {
        return fp.id === tac.editingFloorplanId && !fp.locked && fp.visible !== false;
      });
      const boxGeo = editFp
        ? {
            type: "FeatureCollection",
            features: [{
              type: "Feature",
              geometry: { type: "LineString", coordinates: computeFloorplanCorners(editFp).concat([computeFloorplanCorners(editFp)[0]]) }
            }]
          }
        : { type: "FeatureCollection", features: [] };

      if (map.getSource("az-fp-box-src")) {
        map.getSource("az-fp-box-src").setData(boxGeo);
      } else {
        map.addSource("az-fp-box-src", { type: "geojson", data: boxGeo });
        map.addLayer({
          id: "az-fp-box-line",
          type: "line",
          source: "az-fp-box-src",
          paint: { "line-color": "#C5A869", "line-width": 2, "line-dasharray": [2, 1.5], "line-opacity": 0.9 }
        }, beforeId);
      }
    });

    const editFp = (tac.floorplans || []).find(function (fp) {
      return fp.id === tac.editingFloorplanId && !fp.locked && fp.visible !== false;
    });
    if (editFp && window.maplibregl && tac.maps[0]) {
      const m0 = tac.maps[0];
      const corners = computeFloorplanCorners(editFp);
      // 1. Centro (Mover)
      const moveEl = document.createElement("div");
      moveEl.className = "az-fp-handle";
      moveEl.title = "Arrastar para posicionar planta sobre o imóvel";
      moveEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>';
      let movePrev = null;
      const moveMk = new window.maplibregl.Marker({ element: moveEl, draggable: true })
        .setLngLat([editFp.centerLng, editFp.centerLat])
        .addTo(m0);
      moveMk.on("dragstart", function () {
        movePrev = cloneTacData(editFp);
        if (tac._activeFpHandles) tac._activeFpHandles.draggingMove = true;
      });
      moveMk.on("drag", function () {
        const ll = moveMk.getLngLat();
        editFp.centerLng = ll.lng;
        editFp.centerLat = ll.lat;
        updateFloorplanSourceFast(editFp);
      });
      moveMk.on("dragend", function () {
        if (tac._activeFpHandles) tac._activeFpHandles.draggingMove = false;
        if (movePrev) pushUndoAction({ type: "fp_edit", fpId: editFp.id, prev: movePrev, next: cloneTacData(editFp) });
        renderFloorplansOnMaps(false);
        refreshLeftControls();
      });

      // 2. Canto SE (Escalar mantendo proporção)
      const scaleEl = document.createElement("div");
      scaleEl.className = "az-fp-handle is-scale";
      scaleEl.title = "Arrastar para redimensionar planta";
      scaleEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
      let scalePrev = null;
      const scaleMk = new window.maplibregl.Marker({ element: scaleEl, draggable: true })
        .setLngLat(corners[2])
        .addTo(m0);
      scaleMk.on("dragstart", function () {
        scalePrev = cloneTacData(editFp);
        if (tac._activeFpHandles) tac._activeFpHandles.draggingScale = true;
      });
      scaleMk.on("drag", function () {
        const ll = scaleMk.getLngLat();
        const mPerLat = 111320;
        const mPerLng = Math.max(1000, 111320 * Math.cos((editFp.centerLat * Math.PI) / 180));
        const dx = (ll.lng - editFp.centerLng) * mPerLng;
        const dy = (ll.lat - editFp.centerLat) * mPerLat;
        const dist = Math.max(4, Math.hypot(dx, dy));
        const asp = Math.max(0.25, Math.min(4, Number(editFp.aspect) || (editFp.halfW_m / Math.max(1, editFp.halfH_m))));
        const newHalfH = Math.max(3, Math.min(900, dist / Math.hypot(asp, 1)));
        editFp.halfH_m = Number(newHalfH.toFixed(2));
        editFp.halfW_m = Number((newHalfH * asp).toFixed(2));
        updateFloorplanSourceFast(editFp);
      });
      scaleMk.on("dragend", function () {
        if (tac._activeFpHandles) tac._activeFpHandles.draggingScale = false;
        if (scalePrev) pushUndoAction({ type: "fp_edit", fpId: editFp.id, prev: scalePrev, next: cloneTacData(editFp) });
        renderFloorplansOnMaps(false);
        refreshLeftControls();
      });

      // 3. Alça Superior (Rotação 0-360° direta por Pointer Capture para funcionar suave no Android)
      function computeRotHandleLngLat(fpObj) {
        const rad = ((Number(fpObj.angleDeg) || 0) * Math.PI) / 180;
        const mPerLat = 111320;
        const mPerLng = Math.max(1000, 111320 * Math.cos((fpObj.centerLat * Math.PI) / 180));
        const topDist = (fpObj.halfH_m || 16) * 1.25;
        const rx = topDist * Math.sin(rad);
        const ry = topDist * Math.cos(rad);
        return [fpObj.centerLng + rx / mPerLng, fpObj.centerLat + ry / mPerLat];
      }
      const rotEl = document.createElement("div");
      rotEl.className = "az-fp-handle is-rotate";
      rotEl.title = "Arrastar para rotacionar 0°–360°";
      rotEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>';
      const rotMk = new window.maplibregl.Marker({ element: rotEl, draggable: false })
        .setLngLat(computeRotHandleLngLat(editFp))
        .addTo(m0);
      tac._activeFpHandles = { fpId: editFp.id, moveMk: moveMk, scaleMk: scaleMk, rotMk: rotMk, computeRot: computeRotHandleLngLat, draggingMove: false, draggingScale: false, draggingRot: false };
      let rotPrev = null;
      let isRotating = false;
      rotEl.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        isRotating = true;
        tac._activeFpHandles.draggingRot = true;
        rotPrev = cloneTacData(editFp);
        if (m0.dragPan) m0.dragPan.disable();
        try { rotEl.setPointerCapture(ev.pointerId); } catch (_) {}
      });
      rotEl.addEventListener("pointermove", function (ev) {
        if (!isRotating) return;
        ev.preventDefault();
        ev.stopPropagation();
        const r = m0.getContainer().getBoundingClientRect();
        const ll = m0.unproject([ev.clientX - r.left, ev.clientY - r.top]);
        if (!ll) return;
        const mPerLat = 111320;
        const mPerLng = Math.max(1000, 111320 * Math.cos((editFp.centerLat * Math.PI) / 180));
        const dx = (ll.lng - editFp.centerLng) * mPerLng;
        const dy = (ll.lat - editFp.centerLat) * mPerLat;
        let deg = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
        deg = ((deg % 360) + 360) % 360;
        editFp.angleDeg = deg;
        rotMk.setLngLat(computeRotHandleLngLat(editFp));
        scaleMk.setLngLat(computeFloorplanCorners(editFp)[2]);
        updateFloorplanSourceFast(editFp);
        syncFloorplanAdjustBar();
      });
      function finishRotDrag(ev) {
        if (!isRotating) return;
        if (ev) ev.stopPropagation();
        isRotating = false;
        if (tac._activeFpHandles) tac._activeFpHandles.draggingRot = false;
        if (m0.dragPan && !tac.drawActive && !tac.eraserActive && !tac.mapLocked) m0.dragPan.enable();
        if (rotPrev) pushUndoAction({ type: "fp_edit", fpId: editFp.id, prev: rotPrev, next: cloneTacData(editFp) });
        rotPrev = null;
        renderFloorplansOnMaps(false);
        refreshLeftControls();
      }
      rotEl.addEventListener("pointerup", finishRotDrag);
      rotEl.addEventListener("pointercancel", finishRotDrag);

      tac.floorplanHandles.push(moveMk, scaleMk, rotMk);
    } else if (window.maplibregl && tac.maps[0]) {
      (tac.floorplans || []).forEach(function (fp) {
        if (!fp.locked || fp.visible === false) return;
        const corners = computeFloorplanCorners(fp);
        const chip = document.createElement("div");
        chip.className = "az-fp-lock-chip";
        chip.textContent = `${fp.label || "PLANTA"}`;
        const mk = new window.maplibregl.Marker({ element: chip, anchor: "bottom" })
          .setLngLat(corners[0])
          .addTo(tac.maps[0]);
        tac.floorplanHandles.push(mk);
      });
    }
    syncFloorplanAdjustBar();
    renderFloorplansListModal();
  }

  function clearFlagMarkers() {
    if (Array.isArray(tac.flagMarkers)) {
      tac.flagMarkers.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.flagMarkers = [];
  }

  function openFlagActionModal(flagObj) {
    if (!flagObj) return;
    tac.activeFlag = flagObj;
    const titleEl = document.getElementById("azFlagActionTitle");
    if (titleEl) titleEl.textContent = flagObj.label || "BANDEIRA";
    const rad = flagObj.radiusM || 45;
    const slider = document.getElementById("azFlagRadiusSlider");
    const valEl = document.getElementById("azFlagRadiusVal");
    if (slider) slider.value = String(rad);
    if (valEl) valEl.textContent = `${rad}m`;

    const imgEl = document.getElementById("azFlagPhotoPreview");
    const capEl = document.getElementById("azFlagPhotoCapView");
    const photoBtn = document.getElementById("azFlagPhotoBtn");
    if (imgEl && capEl) {
      if (flagObj.photoUrl) {
        imgEl.src = flagObj.photoUrl;
        imgEl.style.display = "block";
        capEl.textContent = flagObj.photoCaption || "";
        capEl.style.display = flagObj.photoCaption ? "block" : "none";
      } else {
        imgEl.style.display = "none";
        capEl.style.display = "none";
      }
    }
    if (photoBtn) {
      photoBtn.lastChild.nodeValue = flagObj.photoUrl ? " TROCAR FOTO" : " INCLUIR FOTO";
    }
    document.getElementById("azFlagActionModal").classList.add("is-open");
  }

  function updateFlagRingsGeoJsonOnly() {
    const ringFeatures = (tac.flags || []).map(function (f) {
      const poly = buildCircleGeoJson(f.lng, f.lat, f.radiusM || 45);
      poly.properties = { color: resolveSmartDisplayColor(f.color || "#C5A869", "flag") };
      return poly;
    });
    const gj = { type: "FeatureCollection", features: ringFeatures };
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (map.getSource("az-tac-flags-src")) map.getSource("az-tac-flags-src").setData(gj);
      else {
        map.addSource("az-tac-flags-src", { type: "geojson", data: gj });
        map.addLayer({ id: "az-tac-flags-fill", type: "fill", source: "az-tac-flags-src", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.14 } });
        map.addLayer({ id: "az-tac-flags-line", type: "line", source: "az-tac-flags-src", paint: { "line-color": ["get", "color"], "line-width": 2, "line-dasharray": [2, 1.5] } });
      }
    });
  }

  function renderFlagsOnMaps(fromSync) {
    clearFlagMarkers();
    updateFlagRingsGeoJsonOnly();
    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      if (window.maplibregl) {
        (tac.flags || []).forEach(function (f) {
          const dispCol = resolveSmartDisplayColor(f.color || "#C5A869", "flag");
          const el = document.createElement("div");
          el.className = "az-flag-pin";
          el.style.setProperty("--flag-color", dispCol);
          const photoBadge = f.photoUrl ? " [FOTO]" : "";
          el.innerHTML =
            `<div class="az-flag-badge">${f.label} (${f.radiusM || 45}m)${photoBadge}</div>` +
            `<svg width="20" height="20" viewBox="0 0 24 24" fill="${dispCol}" stroke="#0D0D0D" stroke-width="2"><path d="M5 21V4"/><path d="M5 4h11l-1.5 4L16 12H5"/></svg>`;
          const isBeingFineTuned = tac.fineTuneTarget && tac.fineTuneTarget.kind === "flag" && tac.fineTuneTarget.ref && tac.fineTuneTarget.ref.id === f.id;
          const mk = new window.maplibregl.Marker({ element: el, anchor: "bottom", draggable: Boolean(isBeingFineTuned) }).setLngLat([f.lng, f.lat]).addTo(map);
          mk.on("drag", function () {
            const ll = mk.getLngLat();
            if (!ll) return;
            f.lat = ll.lat;
            f.lng = ll.lng;
            tac.flagMarkers.forEach(function (m2) {
              if (m2._flagId === f.id && m2 !== mk) m2.setLngLat([f.lng, f.lat]);
            });
            updateFlagRingsGeoJsonOnly();
            updateRemoteCoordReadout();
          });
          mk.on("dragend", function () {
            if (tac.fineTuneTarget && tac.fineTuneTarget.kind === "flag" && tac.fineTuneTarget.ref === f) {
              updateRemoteCoordReadout();
            }
            checkGeofenceProximityAlerts();
          });
          mk._flagId = f.id;
          el.addEventListener("click", function (ev) {
            ev.stopPropagation();
            if (tac.eraserActive) {
              const removedFlag = cloneTacData(f);
              tac.flags = tac.flags.filter(function (x) { return x.id !== f.id; });
              pushUndoAction({ type: "del_flags", flags: [removedFlag] });
              renderFlagsOnMaps(false);
              refreshLeftControls();
              return;
            }
            openFlagActionModal(f);
          });
          tac.flagMarkers.push(mk);
        });
      }
    });
    checkGeofenceProximityAlerts();
    if (!fromSync && tac.roomCode) broadcastPacket({ kind: "flags_sync_all", flags: tac.flags });
  }

  function isPointInsideGeomZone(lat, lng, g) {
    const cosLat = Math.max(0.2, Math.cos((g.lat * Math.PI) / 180));
    const dLatM = (lat - g.lat) * 111320;
    const dLngM = (lng - g.lng) * 111320 * cosLat;
    if (g.shape === "circle") {
      const r = Math.max(10, g.widthM || 150);
      return Math.hypot(dLatM, dLngM) <= r;
    }
    const halfH = Math.max(10, (g.heightM || 150) / 2);
    const halfW = Math.max(10, (g.widthM || 250) / 2);
    if (g.shape === "rect") {
      return Math.abs(dLatM) <= halfH && Math.abs(dLngM) <= halfW;
    }
    const norm = Math.pow(dLngM / halfW, 2) + Math.pow(dLatM / halfH, 2);
    return norm <= 1.0;
  }

  function checkGeofenceProximityAlerts() {
    const zones = [];
    (tac.flags || []).forEach(function (f) {
      zones.push({ zKey: "flag_" + f.id, kind: "BANDEIRA", name: f.label || "BANDEIRA", shape: "circle", lat: f.lat, lng: f.lng, radius: f.radiusM || 45 });
    });
    if (tac.circleCenter && typeof tac.circleCenter.lat === "number") {
      zones.push({ zKey: "circle_main", kind: "PERÍMETRO", name: "PERÍMETRO", shape: "circle", lat: tac.circleCenter.lat, lng: tac.circleCenter.lng, radius: tac.circleRadius || 150 });
    }
    (tac.tacticalGeoms || []).forEach(function (g) {
      zones.push({ zKey: "geom_" + g.id, kind: "GEOMETRIA", name: g.label || "SETOR", shape: g.shape || "rect", lat: g.lat, lng: g.lng, widthM: g.widthM || 250, heightM: g.heightM || 150, geomRef: g });
    });

    const operators = [];
    if (tac.myPos && typeof tac.myPos.lat === "number") {
      operators.push({ uid: tac.myId, name: tac.myQra || "VOCÊ", lat: tac.myPos.lat, lng: tac.myPos.lng });
    }
    Object.values(tac.teammates || {}).forEach(function (m) {
      if (typeof m.lat === "number" && typeof m.lng === "number") {
        operators.push({ uid: m.uid, name: m.qra || "ALIADO", lat: m.lat, lng: m.lng });
      }
    });

    zones.forEach(function (z) {
      operators.forEach(function (op) {
        const k = z.zKey + "::" + op.uid;
        let inside = false;
        let distInfo = "";
        if (z.geomRef) {
          inside = isPointInsideGeomZone(op.lat, op.lng, z.geomRef);
        } else {
          const d = calcDistAndBearing(op.lat, op.lng, z.lat, z.lng).dist;
          inside = d <= z.radius;
          distInfo = ` (${Math.round(d)}m)`;
        }
        const wasInside = tac.geofenceInsideMap[k] === true;
        if (inside && !wasInside) {
          tac.geofenceInsideMap[k] = true;
          const supAudio = tac._suppressGeofenceSoundUntil && Date.now() < tac._suppressGeofenceSoundUntil;
          if (!tac.stealthSilent && !supAudio) {
            vibratePattern([280, 100, 280, 100, 320]);
            try { playTone(880, 1360, 0.24, 0.18); } catch (_) {}
            if (window.AzVoiceJarvis) window.AzVoiceJarvis.speak(`${op.name} entrou no perímetro.`, "domo_in");
          }
          showToast(`CHEGOU EM ${z.kind}: ${op.name} → ${z.name}${distInfo}`, 4200, true);
        } else if (!inside && wasInside) {
          let outsideConfirm = true;
          if (!z.geomRef) {
            const dOut = calcDistAndBearing(op.lat, op.lng, z.lat, z.lng).dist;
            outsideConfirm = dOut > (z.radius + 8);
          }
          if (outsideConfirm) {
            tac.geofenceInsideMap[k] = false;
            if (!tac.stealthSilent) {
              vibratePattern([180, 80, 180, 80, 260]);
              try { playTone(1040, 520, 0.26, 0.18); } catch (_) {}
              if (window.AzVoiceJarvis) window.AzVoiceJarvis.speak(`${op.name} saiu do perímetro.`, "domo_out");
            }
            showToast(`SAIU DE ${z.kind}: ${op.name} deixou ${z.name}`, 4200, true);
          }
        }
      });
    });
  }

  function exportGrgTacticalPng() {
    if (!tac.grgConfig) { showToast("Gere uma grade GRG antes de exportar."); return; }
    const n = tac.grgConfig.dim;
    const size = 760, pad = 60, cell = (size - pad * 2) / n;
    const cv = document.createElement("canvas");
    cv.width = size; cv.height = size + 64;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#C5A869";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`AZIMUTE GRG ${n}x${n} (${tac.grgConfig.cellMeters}m/quad)`, 24, 34);
    ctx.fillStyle = "#9E9A8F";
    ctx.font = "12px monospace";
    ctx.fillText(`CENTRO: ${tac.grgConfig.centerLat.toFixed(5)}, ${tac.grgConfig.centerLng.toFixed(5)} | N ↑`, 24, 54);
    ctx.strokeStyle = "#C5A869";
    ctx.lineWidth = 2;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(pad, pad + 40 + i * cell); ctx.lineTo(size - pad, pad + 40 + i * cell); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad + i * cell, pad + 40); ctx.lineTo(pad + i * cell, size - pad + 40); ctx.stroke();
    }
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        ctx.fillText(String.fromCharCode(65 + r) + (c + 1), pad + (c + 0.5) * cell, pad + 40 + (r + 0.5) * cell);
      }
    }
    const a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = `AZIMUTE_GRG_${n}x${n}.png`;
    a.click();
    showToast("Grade GRG exportada em imagem PNG.");
  }
  window.azimuteSetBloodhoundTarget = function (label, lat, lng, type, id) {
    if (typeof lat !== "number" || typeof lng !== "number" || isNaN(lat) || isNaN(lng)) return;
    if (typeof window.showView === "function") window.showView("gps");
    scanAndCaptureExistingMaps();
    setBloodhoundTarget({
      type: type || "point",
      id: id || ("bh_" + Date.now()),
      label: (label || "ALVO").toString().toUpperCase(),
      lat: lat,
      lng: lng
    });
    showToast("CÃO DE BUSCA travado: " + (label || "ALVO"));
  };

  function appendPointToPegadasBuffer(arr, lat, lng, ts) {
    if (!Array.isArray(arr) || typeof lat !== "number" || typeof lng !== "number") return false;
    const tStamp = ts || Date.now();
    if (arr.length > 0) {
      const last = arr[arr.length - 1];
      const d = calcDistAndBearing(last[0], last[1], lat, lng).dist;
      if (d < 15) return false;
    }
    arr.push([Number(lat.toFixed(6)), Number(lng.toFixed(6)), tStamp]);
    // Mantém buffer circular dos últimos 2.000 metros (2 km)
    while (arr.length > 2) {
      let totalM = 0;
      for (let i = 1; i < arr.length; i++) {
        totalM += calcDistAndBearing(arr[i - 1][0], arr[i - 1][1], arr[i][0], arr[i][1]).dist;
      }
      if (totalM <= 2000) break;
      arr.shift();
    }
    return true;
  }

  function clearPegadasTimeMarkers() {
    if (Array.isArray(tac.pegadasTimeMarkers)) {
      tac.pegadasTimeMarkers.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.pegadasTimeMarkers = [];
  }

  function formatPegadaAgeLabel(ts, isLast) {
    if (isLast) return "último ponto";
    const diffMin = Math.max(0, Math.round((Date.now() - (ts || Date.now())) / 60000));
    if (diffMin < 1) return "agora";
    return `há ${diffMin} min`;
  }

  function renderPegadasOnMaps() {
    clearPegadasTimeMarkers();
    const features = [];
    const markerSamples = [];

    Object.keys(tac.visiblePegadasUids || {}).forEach(function (uid) {
      if (!tac.visiblePegadasUids[uid]) return;
      let pts = [];
      let colorId = tac.myColorId;
      let labelOwner = tac.myQra || "VOCÊ";

      if (uid === tac.myId) {
        pts = tac.myPassivePegadas || [];
      } else {
        const mate = tac.teammates[uid];
        const mirror = tac.matePassivePegadas[uid];
        pts = (mirror && Array.isArray(mirror.points)) ? mirror.points : [];
        colorId = (mate && mate.colorId) || (mirror && mirror.colorId) || "ciano";
        labelOwner = (mate && mate.qra) || (mirror && mirror.qra) || "ALIADO";
      }

      if (pts.length >= 2) {
        const col = resolveSmartDisplayColor(getColorHex(colorId), "line");
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: pts.map(function (p) { return [p[1], p[0]]; })
          },
          properties: { color: col, uid: uid }
        });

        const idxs = [0];
        if (pts.length >= 5) idxs.push(Math.floor(pts.length / 2));
        idxs.push(pts.length - 1);
        idxs.forEach(function (pi, idxPos) {
          const p = pts[pi];
          const isLast = pi === pts.length - 1;
          markerSamples.push({
            lat: p[0],
            lng: p[1],
            col: col,
            text: (idxPos === 0 ? `${labelOwner} • ` : "") + formatPegadaAgeLabel(p[2], isLast)
          });
        });
      }
    });

    const gj = { type: "FeatureCollection", features: features };
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource("az-pegadas-src")) m.getSource("az-pegadas-src").setData(gj);
      else if (features.length > 0) {
        m.addSource("az-pegadas-src", { type: "geojson", data: gj });
        m.addLayer({
          id: "az-pegadas-line",
          type: "line",
          source: "az-pegadas-src",
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#C5A869"],
            "line-width": 3.4,
            "line-dasharray": [2, 1.5],
            "line-opacity": 0.92
          }
        });
      }
      if (window.maplibregl) {
        markerSamples.forEach(function (ms) {
          const el = document.createElement("div");
          el.className = "az-pegada-time-pin";
          el.style.setProperty("--peg-col", ms.col);
          el.textContent = ms.text;
          const mk = new window.maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([ms.lng, ms.lat]).addTo(m);
          tac.pegadasTimeMarkers.push(mk);
        });
      }
    });
  }

  function togglePegadasForUid(uid, qra, colorId) {
    if (!uid) return;
    const next = !tac.visiblePegadasUids[uid];
    if (next) tac.visiblePegadasUids[uid] = true;
    else delete tac.visiblePegadasUids[uid];

    if (next && uid !== tac.myId && tac.roomCode) {
      if (!tac.matePassivePegadas[uid]) {
        tac.matePassivePegadas[uid] = { qra: qra || "ALIADO", colorId: colorId || "ciano", points: [] };
      }
      broadcastPacket({ kind: "PEDIR_RASTRO", targetUid: uid });
    }
    renderPegadasOnMaps();
    if (typeof renderK9PopoverList === "function") renderK9PopoverList();

    const ptsLen = uid === tac.myId
      ? (tac.myPassivePegadas || []).length
      : ((tac.matePassivePegadas[uid] && tac.matePassivePegadas[uid].points.length) || 0);
    if (next) {
      showToast(ptsLen >= 2
        ? `Pegadas (2 km) de ${qra || "OPERADOR"} visíveis (${ptsLen} pts).`
        : `Solicitando Pegadas (2 km) de ${qra || "OPERADOR"}...`);
    } else {
      showToast(`Pegadas de ${qra || "OPERADOR"} ocultadas.`);
    }
  }

  function clearAllVisiblePegadas() {
    tac.visiblePegadasUids = {};
    renderPegadasOnMaps();
    if (typeof renderK9PopoverList === "function") renderK9PopoverList();
    showToast("Pegadas ocultadas do mapa.");
  }

  function renderBloodhoundLinesOnMaps(features) {
    const gj = { type: "FeatureCollection", features: features || [] };
    tac.maps.forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      if (m.getSource("az-bloodhound-src")) {
        m.getSource("az-bloodhound-src").setData(gj);
      } else if (features && features.length > 0) {
        m.addSource("az-bloodhound-src", { type: "geojson", data: gj });
        m.addLayer({
          id: "az-bloodhound-line",
          type: "line",
          source: "az-bloodhound-src",
          paint: {
            "line-color": ["coalesce", ["get", "color"], "#F97316"],
            "line-width": 4.2,
            "line-dasharray": [2, 1.5]
          }
        });
      }
    });
  }

  function renderK9PopoverList() {
    const listEl = document.getElementById("azK9PopoverList");
    if (!listEl) return;
    const list = Array.isArray(tac.bloodhoundList) ? tac.bloodhoundList : [];
    if (!list.length) {
      listEl.innerHTML = '<div class="az-k9-empty">Nenhum alvo K9 ativo. Toque em "+ PONTO" ou em um aliado/pino.</div>';
      return;
    }
    const map = getActiveMap();
    const oLat = tac.myPos ? tac.myPos.lat : (map ? map.getCenter().lat : list[0].lat);
    const oLng = tac.myPos ? tac.myPos.lng : (map ? map.getCenter().lng : list[0].lng);

    listEl.innerHTML = list.map(function (t) {
      const db = calcDistAndBearing(oLat, oLng, t.lat, t.lng);
      const azStr = String(Math.round(db.bearing)).padStart(3, "0") + "°";
      const distStr = formatDistance(db.dist);
      const col = t.color || "#F97316";
      const safeName = String(t.label || "ALVO").replace(/</g, "&lt;");
      return `<div class="az-k9-item">
        <div class="az-k9-item-main">
          <span class="az-k9-swatch" style="background:${col};"></span>
          <div class="az-k9-meta">
            <span class="az-k9-name">${safeName}</span>
            <span class="az-k9-stats">AZ ${azStr} • ${distStr}</span>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          ${t.type === "mate" ? `<button type="button" class="az-k9-mini-btn" data-k9-peg="${t.id}" style="${tac.visiblePegadasUids && tac.visiblePegadasUids[t.id] ? "border-color:#38BDF8;color:#38BDF8;" : ""}" title="Ver Pegadas (2 km)">2KM</button>` : ""}
          <button type="button" class="az-k9-mini-btn" data-k9-focus="${t.id}" title="Ver no mapa">VER</button>
          <button type="button" class="az-k9-mini-btn is-danger" data-k9-del="${t.id}" title="Remover rastreamento">✕</button>
        </div>
      </div>`;
    }).join("");

    listEl.querySelectorAll("[data-k9-focus]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const tid = b.getAttribute("data-k9-focus");
        const t = (tac.bloodhoundList || []).find(function (x) { return x.id === tid; });
        const m = getActiveMap();
        if (!t || !m) return;
        if (tac.myPos && typeof maplibregl !== "undefined") {
          const bounds = new maplibregl.LngLatBounds();
          bounds.extend([tac.myPos.lng, tac.myPos.lat]);
          bounds.extend([t.lng, t.lat]);
          m.fitBounds(bounds, { padding: 70, maxZoom: 17, duration: 500 });
        } else {
          m.flyTo({ center: [t.lng, t.lat], zoom: 16, essential: true });
        }
      });
    });

    listEl.querySelectorAll("[data-k9-peg]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const tid = b.getAttribute("data-k9-peg");
        const m = tac.teammates[tid];
        const t = (tac.bloodhoundList || []).find(function (x) { return x.id === tid; });
        togglePegadasForUid(tid, (m && m.qra) || (t && t.label), m && m.colorId);
      });
    });

    listEl.querySelectorAll("[data-k9-del]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        removeBloodhoundTargetById(b.getAttribute("data-k9-del"));
      });
    });
  }

  function updateBloodhoundVector() {
    const banner = document.getElementById("azBloodhoundBanner");
    if (banner) banner.classList.remove("is-open");

    if (!Array.isArray(tac.bloodhoundList)) tac.bloodhoundList = [];
    if (tac.bloodhoundTarget && !tac.bloodhoundList.some(function (t) { return t.id === tac.bloodhoundTarget.id; })) {
      tac.bloodhoundList.push(Object.assign({}, tac.bloodhoundTarget));
    }

    const k9Btn = document.getElementById("azK9HudBtn");
    const k9Badge = document.getElementById("azK9CountBadge");

    if (tac.bloodhoundList.length === 0) {
      tac.bloodhoundTarget = null;
      clearBloodhoundMarker();
      renderBloodhoundLinesOnMaps([]);
      if (k9Btn) { k9Btn.classList.remove("has-targets"); k9Btn.classList.remove("is-open"); }
      if (k9Badge) { k9Badge.style.display = "none"; k9Badge.textContent = "0"; }
      const popEmpty = document.getElementById("azK9Popover");
      if (popEmpty) popEmpty.classList.remove("is-open");
      renderK9PopoverList();
      return;
    }

    let needsMarkerRefresh = false;
    const map = getActiveMap();
    const first = tac.bloodhoundList[0];
    const oLat = tac.myPos ? tac.myPos.lat : (map ? map.getCenter().lat : first.lat);
    const oLng = tac.myPos ? tac.myPos.lng : (map ? map.getCenter().lng : first.lng);
    const features = [];

    tac.bloodhoundList.forEach(function (t) {
      if (t.type === "mate" && tac.teammates[t.id]) {
        const mate = tac.teammates[t.id];
        t.lat = mate.lat;
        t.lng = mate.lng;
        if (mate.qra) t.label = mate.qra;
        t.color = getColorHex(mate.colorId);
      } else if (t.type === "pin") {
        const pinRef = tac.pins.find(function (p) { return p.id === t.id; });
        if (pinRef) {
          if (pinRef.lat !== t.lat || pinRef.lng !== t.lng) needsMarkerRefresh = true;
          t.lat = pinRef.lat;
          t.lng = pinRef.lng;
          if (pinRef.label) t.label = pinRef.label;
        }
      }
      if (!t.color) t.color = "#F97316";
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[oLng, oLat], [t.lng, t.lat]]
        },
        properties: {
          id: t.id,
          color: resolveSmartDisplayColor(t.color, "line")
        }
      });
    });

    tac.bloodhoundTarget = tac.bloodhoundList[tac.bloodhoundList.length - 1];
    if (needsMarkerRefresh || !tac.bloodhoundMarker) renderBloodhoundTargetMarker();
    renderBloodhoundLinesOnMaps(features);

    if (k9Btn) k9Btn.classList.add("has-targets");
    if (k9Badge) {
      k9Badge.textContent = String(tac.bloodhoundList.length);
      k9Badge.style.display = "inline-block";
    }
    const pop = document.getElementById("azK9Popover");
    if (pop && pop.classList.contains("is-open")) {
      renderK9PopoverList();
    }
  }

  async function generateRouteToTarget(tLat, tLng, name) {
    const map = getActiveMap();
    if (!map) return;
    const oLat = tac.myPos ? tac.myPos.lat : map.getCenter().lat;
    const oLng = tac.myPos ? tac.myPos.lng : map.getCenter().lng;
    tac.hasActiveRoute = true;
    refreshLeftControls();
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${tLng},${tLat}?overview=full&geometries=geojson`;
      const d = await (await fetch(url)).json();
      if (d && d.routes && d.routes[0]) {
        const r = d.routes[0];
        renderLineOnMaps("az-tac-route", "az-tac-route-line", r.geometry.coordinates, "#38BDF8", false, `ROTA → ${name}: ${formatDistance(r.distance)}`);
        return;
      }
    } catch (_) {}
    renderLineOnMaps("az-tac-route", "az-tac-route-line", [[oLng, oLat], [tLng, tLat]], "#38BDF8", true, `AZIMUTE → ${name}`);
  }

  function clearRouteFromMaps() {
    tac.hasActiveRoute = false;
    tac.activeCrumbIndex = -1;
    if (tac.breadcrumbs.length > 0) renderBreadcrumbRoute(true);
    renderLineOnMaps("az-tac-route", "az-tac-route-line", [], "#38BDF8", false);
    refreshLeftControls();
  }

  /* =====================================================================
     MENU RADIAL ATAK (MENU FAVORITOS ATÉ 9 ITENS + CLAMPING)
     ===================================================================== */
  function getWheelGeometry(count) {
    let radius = 78;
    let slotSize = 50;
    let fontSize = 9;
    if (count >= 9) { radius = 96; slotSize = 44; fontSize = 8.2; }
    else if (count === 8) { radius = 94; slotSize = 45; fontSize = 8.4; }
    else if (count === 7) { radius = 90; slotSize = 46; fontSize = 8.6; }
    else if (count === 6) { radius = 86; slotSize = 48; fontSize = 8.8; }
    const diameter = (radius * 2) + slotSize + 16;
    return { radius: radius, slotSize: slotSize, fontSize: fontSize, diameter: diameter };
  }

  function buildRadialWheelSlots(mode) {
    const wheel = document.getElementById("azRadialWheel");
    if (!wheel) return null;
    wheel.innerHTML = "";

    let items = [];
    if (mode === "new_press") {
      const favIds = (Array.isArray(tac.wheelMapFavIds) && tac.wheelMapFavIds.length >= 3)
        ? tac.wheelMapFavIds.slice(0, 9)
        : DEFAULT_MAP_WHEEL_FAVS.slice();
      favIds.forEach(function (fid) {
        const def = ALL_MAP_WHEEL_FAVORITES.find(function (a) { return a.id === fid; });
        if (def) items.push(def);
      });
      if (items.length === 0) items = ALL_MAP_WHEEL_FAVORITES.slice(0, 6);
    } else {
      items = ALL_WHEEL_ACTIONS.filter(function (a) { return tac.wheelEnabledIds.includes(a.id); });
      if (items.length === 0) items = ALL_WHEEL_ACTIONS.slice(0, 4);
    }

    const size = 280;
    const cx = 140, cy = 140, rIn = 46, rOut = 132, rMid = 90;
    wheel.style.width = size + "px";
    wheel.style.height = size + "px";
    wheel.style.marginLeft = -(size / 2) + "px";
    wheel.style.marginTop = -(size / 2) + "px";

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 280 280");
    svg.setAttribute("width", "280");
    svg.setAttribute("height", "280");
    svg.style.display = "block";

    const outerRing = document.createElementNS(ns, "circle");
    outerRing.setAttribute("cx", cx); outerRing.setAttribute("cy", cy); outerRing.setAttribute("r", rOut);
    outerRing.setAttribute("fill", "none"); outerRing.setAttribute("stroke", "#C5A869"); outerRing.setAttribute("stroke-width", "1.4");
    svg.appendChild(outerRing);

    const n = items.length;
    const stepDeg = 360 / n;
    const polar = function (r, deg) {
      const rad = (deg * Math.PI) / 180;
      return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };

    items.forEach(function (it, idx) {
      const a0 = -90 - stepDeg / 2 + stepDeg * idx;
      const a1 = a0 + stepDeg;
      const aMid = (a0 + a1) / 2;
      const p1 = polar(rOut, a0), p2 = polar(rOut, a1);
      const p3 = polar(rIn, a1), p4 = polar(rIn, a0);
      const largeArc = stepDeg > 180 ? 1 : 0;
      const d = `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} L ${p3[0].toFixed(2)} ${p3[1].toFixed(2)} A ${rIn} ${rIn} 0 ${largeArc} 0 ${p4[0].toFixed(2)} ${p4[1].toFixed(2)} Z`;

      const g = document.createElementNS(ns, "g");
      g.setAttribute("class", "az-radial-slice");
      const path = document.createElementNS(ns, "path");
      path.setAttribute("class", "az-slice-bg");
      path.setAttribute("d", d);
      g.appendChild(path);

      const midPt = polar(rMid, aMid);
      const fo = document.createElementNS(ns, "foreignObject");
      fo.setAttribute("x", String(midPt[0] - 28));
      fo.setAttribute("y", String(midPt[1] - 20));
      fo.setAttribute("width", "56");
      fo.setAttribute("height", "40");
      fo.style.pointerEvents = "none";
      const wrap = document.createElement("div");
      wrap.style.cssText = "width:56px;height:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#F2F0EA;text-align:center;";
      wrap.innerHTML = `${it.svg}<span style="font-size:11px;font-weight:800;margin-top:2px;line-height:1.05;white-space:nowrap;max-width:54px;overflow:hidden;text-overflow:ellipsis;">${it.label}</span>`;
      const svgIco = wrap.querySelector("svg");
      if (svgIco) { svgIco.style.width = "16px"; svgIco.style.height = "16px"; svgIco.style.stroke = "#C5A869"; svgIco.style.fill = "none"; svgIco.style.strokeWidth = "2"; }
      fo.appendChild(wrap);
      g.appendChild(fo);

      g.addEventListener("click", function (e) {
        e.stopPropagation();
        wheel.classList.remove("is-open");
        executeWheelSlotAction(it.id);
      });
      svg.appendChild(g);
    });

    // Disco central abre CONFIGURAÇÕES (nunca fechar)
    const centerCfg = document.createElementNS(ns, "g");
    centerCfg.setAttribute("class", "az-radial-center-btn");
    const cCircle = document.createElementNS(ns, "circle");
    cCircle.setAttribute("cx", cx); cCircle.setAttribute("cy", cy); cCircle.setAttribute("r", "40");
    centerCfg.appendChild(cCircle);
    const gearFo = document.createElementNS(ns, "foreignObject");
    gearFo.setAttribute("x", String(cx - 32));
    gearFo.setAttribute("y", String(cy - 22));
    gearFo.setAttribute("width", "64");
    gearFo.setAttribute("height", "44");
    gearFo.style.pointerEvents = "none";
    const gearWrap = document.createElement("div");
    gearWrap.style.cssText = "width:64px;height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#C5A869;";
    gearWrap.innerHTML = `${SVG_ICONS.gear}<span style="font-size:10px;font-weight:900;margin-top:2px;letter-spacing:0.04em;color:#F2F0EA;">CONFIG</span>`;
    const gSvg = gearWrap.querySelector("svg");
    if (gSvg) { gSvg.style.width = "16px"; gSvg.style.height = "16px"; gSvg.style.stroke = "#C5A869"; }
    gearFo.appendChild(gearWrap);
    centerCfg.appendChild(gearFo);
    centerCfg.addEventListener("click", function (e) {
      e.stopPropagation();
      wheel.classList.remove("is-open");
      openWheelConfigModal();
    });
    svg.appendChild(centerCfg);

    wheel.appendChild(svg);
    return { radius: rOut, slotSize: 48, fontSize: 11, diameter: size };
  }

  function openRadialWheelAt(clientX, clientY, mode) {
    const geom = buildRadialWheelSlots(mode);
    const w = document.getElementById("azRadialWheel");
    if (!w || !geom) return;
    const margin = Math.max(geom.radius + 36, Math.ceil(geom.diameter / 2) + 8);
    const maxX = Math.max(margin, window.innerWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - margin);
    const cx = Math.min(maxX, Math.max(margin, clientX));
    const cy = Math.min(maxY, Math.max(margin, clientY));
    w.style.left = `${cx}px`;
    w.style.top = `${cy}px`;
    w.classList.add("is-open");
  }

  function executeWheelSlotAction(actId) {
    if (actId === "wheel_cfg") {
      openWheelConfigModal();
      return;
    }
    if (tac.wheelMode === "new_press" && tac.pendingPinCoords) {
      const c = tac.pendingPinCoords;
      if (actId === "new_prio") upsertTacticalPin({ id: "gpe_" + Date.now(), type: "gpe", label: "[PRIO] PRIORIDADE", rawTitle: "PRIORIDADE", colorHex: getColorHex(tac.myColorId), lng: c.lng, lat: c.lat }, false);
      else if (actId === "new_pin") { openPinEditorModal(null, c, "custom"); }
      else if (actId === "new_photo") openPhotoModal(c, null);
      else if (actId === "new_circle") { renderCircleOnMaps(c.lng, c.lat, tac.circleRadius, false); document.getElementById("azCircleRadiusPad").classList.add("is-open"); }
      else if (actId === "new_bloodhound") {
        setBloodhoundTarget({ type: "point", id: "bh_" + Date.now(), label: `${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`, lat: c.lat, lng: c.lng });
        showToast("Cão de Busca travado no ponto.");
      } else if (actId === "trail_tool") {
        openTrailModal();
      } else if (actId === "new_flag") {
        tac.flagCounter = (tac.flagCounter || 0) + 1;
        const newFlag = { id: "flag_" + Date.now(), label: "BANDEIRA " + tac.flagCounter, lat: c.lat, lng: c.lng, radiusM: 45, color: getColorHex(tac.myColorId) };
        tac.flags.push(newFlag);
        pushUndoAction({ type: "flag", flag: newFlag });
        renderFlagsOnMaps(false);
        refreshLeftControls();
        showToast(`${newFlag.label} fixada.`);
      } else if (actId === "draw_free") {
        setCanetaMode(!tac.drawActive);
        showToast(tac.drawActive ? "Caneta livre ATIVA" : "Caneta desativada.");
      } else if (actId === "toggle_ruler") {
        disarmAllTacticalTools("toggle_ruler");
        tac.rulerActive = true;
        tac.rulerCoords = [[c.lng, c.lat]];
        pushUndoAction({ type: "ruler_pt", coord: [c.lng, c.lat] });
        refreshLeftControls();
        showToast("Régua: Ponto 1 fixado. Toque no destino.");
      } else if (actId === "trace_escada" || actId === "trace_beco") {
        const kind = actId.slice(6);
        const meta = TERRAIN_TRACE_META[kind] || TERRAIN_TRACE_META.beco;
        disarmAllTacticalTools(actId);
        tac.toolMode = actId;
        tac.traceCounter = (tac.traceCounter || 0) + 1;
        const trc = { id: "trc_" + Date.now() + "_" + tac.traceCounter, kind: kind, label: meta.prefix + " " + tac.traceCounter, coords: [[c.lng, c.lat]], distanceM: 0, color: getColorHex(tac.myColorId), tags: [], notes: "" };
        tac.terrainTraces.push(trc);
        tac.activeTraceId = trc.id;
        pushUndoAction({ type: "trace", trace: cloneTacData(trc) });
        renderTerrainTracesOnMaps(false);
        refreshLeftControls();
        showToast(`${trc.label} iniciado. Toque nos próximos pontos.`);
      } else if (actId === "planta_tool") {
        disarmAllTacticalTools();
        renderFloorplansListModal();
        document.getElementById("azPlantaModal").classList.add("is-open");
        refreshLeftControls();
      } else if (actId === "wasp_tool") {
        disarmAllTacticalTools("wasp_tool");
        (tac.floorplans || []).forEach(function (fp) { fp.locked = true; });
        tac.editingFloorplanId = null;
        renderFloorplansOnMaps(true, true);
        tac.toolMode = "wasp_pick";
        tac.waspCounter = (tac.waspCounter || 0) + 1;
        const wCode = "W" + tac.waspCounter;
        const cw = { id: "wasp_" + Date.now() + "_" + tac.waspCounter, code: wCode, lat: c.lat, lng: c.lng, state: "pending", note: "", qra: tac.myQra || "OP", updatedAtStr: formatWaspStampNow(), floorplanId: tac.activeFloorplanId || "" };
        upsertWaspMarker(cw, false);
        pushUndoAction({ type: "wasp_add", wasp: cloneTacData(cw) });
        refreshLeftControls();
        showToast(`${wCode} marcado • Modo WASP ativo.`);
      } else if (actId === "radio_conv_tool") {
        if (typeof openTeamCommsModal === "function") window.AzTac.openTeamCommsModal();
      } else if (actId === "copy_qth") {
        const txt = `${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).catch(function () {});
        }
        showToast("QTH copiado: " + txt);
      } else if (actId === "route_here") {
        generateRouteToTarget(c.lat, c.lng, "ALVO NO MAPA");
      } else if (actId === "clear_route") {
        clearAllRoutesAction();
      } else if (actId === "orbit_point") {
        window.AzTac.startMapOrbitAround(c.lng, c.lat);
      } else if (actId === "drone_mode") {
        if (typeof openDroneMode === "function") window.AzTac.openDroneMode("__FREE__", c);
      }
      return;
    }
    if (tac.wheelMode === "existing_pin" && tac.activePin) {
      const p = tac.activePin;
      if (actId === "fine_tune") openRemoteFineTune(p);
      else if (actId === "trash") deletePinById(p.id);
      else if (actId === "route") generateRouteToTarget(p.lat, p.lng, p.label);
      else if (actId === "bloodhound") {
        setBloodhoundTarget({ type: "pin", id: p.id, label: p.label, lat: p.lat, lng: p.lng });
        showToast(`CÃO DE BUSCA: ${p.label}`);
      } else if (actId === "edit") {
        openPinEditorModal(p, { lng: p.lng, lat: p.lat }, p.type || "custom");
      } else if (actId === "photo") {
        openPhotoModal({ lat: p.lat, lng: p.lng }, null);
      }
    }
  }

  let draftMapFavOrder = [];
  function renderWheelMapFavEditor() {
    const listEl = document.getElementById("azWheelMapFavList");
    const cntEl = document.getElementById("azWheelMapCountBadge");
    if (!listEl) return;
    const selectedSet = new Set(draftMapFavOrder);
    if (cntEl) {
      cntEl.textContent = `${draftMapFavOrder.length} / 9`;
      cntEl.style.color = draftMapFavOrder.length >= 3 && draftMapFavOrder.length <= 9 ? "#4ADE80" : "#EF4444";
    }
    const orderedDefs = [];
    draftMapFavOrder.forEach(function (id) {
      const d = ALL_MAP_WHEEL_FAVORITES.find(function (a) { return a.id === id; });
      if (d) orderedDefs.push(d);
    });
    ALL_MAP_WHEEL_FAVORITES.forEach(function (d) {
      if (!selectedSet.has(d.id)) orderedDefs.push(d);
    });
    listEl.innerHTML = orderedDefs.map(function (a) {
      const on = selectedSet.has(a.id);
      const posIdx = draftMapFavOrder.indexOf(a.id);
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;background:#0D0D0D;padding:5px 7px;border-radius:6px;border:1px solid ${on ? "#C5A869" : "#28271F"};">
        <label style="display:flex;align-items:center;gap:7px;flex:1;cursor:pointer;">
          <input type="checkbox" data-map-fav="${a.id}" ${on ? "checked" : ""}>
          <span style="display:inline-flex;width:14px;height:14px;color:${on ? "#C5A869" : "#9E9A8F"};">${a.svg}</span>
          <span>${a.label}</span>
        </label>
        ${on ? `<div style="display:flex;gap:3px;">
          <button type="button" class="az-org-mini-btn" data-fav-move="-1" data-fav-id="${a.id}" ${posIdx === 0 ? "disabled" : ""}>↑</button>
          <button type="button" class="az-org-mini-btn" data-fav-move="1" data-fav-id="${a.id}" ${posIdx === draftMapFavOrder.length - 1 ? "disabled" : ""}>↓</button>
        </div>` : ""}
      </div>`;
    }).join("");

    listEl.querySelectorAll("[data-map-fav]").forEach(function (chk) {
      chk.addEventListener("change", function () {
        const fid = chk.getAttribute("data-map-fav");
        if (chk.checked) {
          if (draftMapFavOrder.length >= 9) {
            chk.checked = false;
            showToast("Máximo de 9 favoritos no Menu.");
            return;
          }
          if (!draftMapFavOrder.includes(fid)) draftMapFavOrder.push(fid);
        } else {
          if (draftMapFavOrder.length <= 3) {
            chk.checked = true;
            showToast("Mínimo de 3 favoritos no Menu.");
            return;
          }
          draftMapFavOrder = draftMapFavOrder.filter(function (x) { return x !== fid; });
        }
        renderWheelMapFavEditor();
      });
    });

    listEl.querySelectorAll("[data-fav-move]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const fid = btn.getAttribute("data-fav-id");
        const delta = parseInt(btn.getAttribute("data-fav-move"), 10);
        const i = draftMapFavOrder.indexOf(fid);
        const ni = i + delta;
        if (i !== -1 && ni >= 0 && ni < draftMapFavOrder.length) {
          const tmp = draftMapFavOrder[i];
          draftMapFavOrder[i] = draftMapFavOrder[ni];
          draftMapFavOrder[ni] = tmp;
          renderWheelMapFavEditor();
        }
      });
    });
  }

  function openWheelConfigModal() {
    draftMapFavOrder = (Array.isArray(tac.wheelMapFavIds) ? tac.wheelMapFavIds : DEFAULT_MAP_WHEEL_FAVS).slice(0, 9);
    renderWheelMapFavEditor();
    const box = document.getElementById("azWheelCfgCheckboxes");
    if (!box) return;
    box.innerHTML = ALL_WHEEL_ACTIONS.map(function (a) {
      const checked = tac.wheelEnabledIds.includes(a.id) ? "checked" : "";
      return `<label style="display:flex;align-items:center;gap:8px;background:#0D0D0D;padding:5px 8px;border-radius:6px;border:1px solid #28271F;">
        <input type="checkbox" value="${a.id}" ${checked}> <span style="display:inline-flex;width:15px;height:15px;">${a.svg}</span> <span>${a.label}</span>
      </label>`;
    }).join("");
    document.getElementById("azWheelConfigModal").classList.add("is-open");
  }

  /* =====================================================================
     TEXTOS NO MAPA (LÁPIS: TEXTO COM TAMANHO E COR)
     ===================================================================== */
  function clearMapTextMarkers() {
    if (Array.isArray(tac.textMarkers)) {
      tac.textMarkers.forEach(function (mk) { try { mk.remove(); } catch (_) {} });
    }
    tac.textMarkers = [];
  }

  function renderMapTextsOnMaps(fromSync) {
    clearMapTextMarkers();
    if (!window.maplibregl) return;
    const isDarkBg = isCurrentViewerDarkBg();
    const defaultBgChip = isDarkBg ? "rgba(13, 13, 13, 0.72)" : "rgba(255, 255, 255, 0.84)";

    tac.maps.forEach(function (map) {
      if (!canDrawOnMap(map)) return;
      (tac.mapTexts || []).forEach(function (t) {
        const dispCol = resolveSmartDisplayColor(t.color || getColorHex(tac.myColorId), "text");
        const hasCustomBg = Boolean(t.bgColor && t.bgColor !== "transparent");
        const bgCss = hasCustomBg ? t.bgColor : defaultBgChip;
        const textShadowCss = hasCustomBg
          ? (getRelativeLuminance(t.bgColor) > 0.45 ? "0 1px 1px rgba(255,255,255,0.65)" : "0 1px 2px rgba(0,0,0,0.85)")
          : (isDarkBg ? "0 1px 3px #000000, 0 0 4px #000000" : "0 1px 2px #FFFFFF, 0 0 3px #FFFFFF");
        const angle = typeof t.angleDeg === "number" ? t.angleDeg : 0;

        const el = document.createElement("div");
        el.className = "az-map-text-pin";
        const inner = document.createElement("div");
        inner.className = "az-map-text-inner";
        inner.style.color = dispCol;
        inner.style.fontSize = (t.sizePx || 14) + "px";
        inner.style.background = bgCss;
        inner.style.border = "1px solid " + dispCol;
        inner.style.textShadow = textShadowCss;
        inner.style.transform = `rotate(${angle}deg)`;
        inner.textContent = t.text || "TEXTO";
        inner.title = "Toque para editar texto, girar, aumentar, fundo ou mover";
        el.appendChild(inner);

        el.addEventListener("click", function (ev) {
          ev.stopPropagation();
          if (tac.eraserActive) {
            const removedTxt = cloneTacData(t);
            tac.mapTexts = tac.mapTexts.filter(function (x) { return x.id !== t.id; });
            pushUndoAction({ type: "del_texts", texts: [removedTxt] });
            renderMapTextsOnMaps(false);
            refreshLeftControls();
            return;
          }
          openMapTextComposer({ lat: t.lat, lng: t.lng }, ev.clientX, ev.clientY, t);
        });

        const isFt = tac.fineTuneTarget && tac.fineTuneTarget.kind === "text" && tac.fineTuneTarget.ref === t;
        const mk = new window.maplibregl.Marker({ element: el, anchor: "center", draggable: Boolean(isFt) })
          .setLngLat([t.lng, t.lat])
          .addTo(map);
        mk.on("drag", function () {
          const ll = mk.getLngLat();
          if (!ll) return;
          t.lat = ll.lat;
          t.lng = ll.lng;
          tac.textMarkers.forEach(function (m2) {
            if (m2._textId === t.id && m2 !== mk) m2.setLngLat([t.lng, t.lat]);
          });
          updateRemoteCoordReadout();
        });
        mk.on("dragend", function () {
          updateRemoteCoordReadout();
        });
        mk._textId = t.id;
        tac.textMarkers.push(mk);
      });
    });
    if (!fromSync && tac.roomCode) broadcastPacket({ kind: "texts_sync_all", texts: tac.mapTexts });
  }

  function populateTextComposerColors(selectedHex, selectedBgHex) {
    const row = document.getElementById("azTextColorRow");
    const bgRow = document.getElementById("azTextBgColorRow");
    const palette = [
      getColorHex(tac.myColorId),
      "#F8FAFC", "#0D0D0D", "#C5A869", "#EF4444", "#22C55E", "#3B82F6", "#EAB308", "#F97316", "#C084FC"
    ].filter(function (c, i, arr) {
      return arr.findIndex(function (x) { return x.toUpperCase() === c.toUpperCase(); }) === i;
    });

    if (row) {
      const cur = (selectedHex || getColorHex(tac.myColorId)).toUpperCase();
      row.innerHTML = palette.map(function (hex) {
        const act = hex.toUpperCase() === cur ? " is-active" : "";
        return `<button type="button" class="az-text-color-swatch${act}" data-txt-col="${hex}" style="background:${hex};" title="${hex}"></button>`;
      }).join("");
      row.querySelectorAll("[data-txt-col]").forEach(function (sw) {
        sw.addEventListener("click", function (ev) {
          ev.stopPropagation();
          tac.textColorHex = sw.getAttribute("data-txt-col");
          row.querySelectorAll(".az-text-color-swatch").forEach(function (s2) {
            s2.classList.toggle("is-active", s2 === sw);
          });
        });
      });
    }

    if (bgRow) {
      const bgPalette = ["transparent", "#0D0D0D", "#FFFFFF", "#C5A869", "#EF4444", "#22C55E", "#3B82F6", "#EAB308", "#1E293B"];
      const curBg = (selectedBgHex || "transparent").toUpperCase();
      bgRow.innerHTML = bgPalette.map(function (hex) {
        const act = hex.toUpperCase() === curBg ? " is-active" : "";
        const styleBg = hex === "transparent"
          ? "background:repeating-linear-gradient(45deg,#1f1f1f,#1f1f1f 4px,#3a3a3a 4px,#3a3a3a 8px);"
          : `background:${hex};`;
        const ttl = hex === "transparent" ? "Fundo padrão/sutil" : hex;
        return `<button type="button" class="az-text-color-swatch${act}" data-txt-bg="${hex}" style="${styleBg}" title="${ttl}"></button>`;
      }).join("");
      bgRow.querySelectorAll("[data-txt-bg]").forEach(function (sw) {
        sw.addEventListener("click", function (ev) {
          ev.stopPropagation();
          tac.textBgColor = sw.getAttribute("data-txt-bg");
          bgRow.querySelectorAll(".az-text-color-swatch").forEach(function (s2) {
            s2.classList.toggle("is-active", s2 === sw);
          });
        });
      });
    }
  }

  function syncTextSizeUi(sz) {
    tac.textSizePx = Math.max(10, Math.min(44, parseInt(sz, 10) || 14));
    const lbl = document.getElementById("azTextSizeVal");
    const slider = document.getElementById("azTextSizeSlider");
    if (lbl) lbl.textContent = tac.textSizePx + "px";
    if (slider) slider.value = String(tac.textSizePx);
    document.querySelectorAll("#azTextSizeRow [data-txt-size]").forEach(function (b) {
      b.classList.toggle("is-active", parseInt(b.getAttribute("data-txt-size"), 10) === tac.textSizePx);
    });
  }

  function syncTextAngleUi(deg) {
    let a = parseInt(deg, 10) || 0;
    while (a > 180) a -= 360;
    while (a < -180) a += 360;
    tac.textAngleDeg = a;
    const lbl = document.getElementById("azTextAngleVal");
    const slider = document.getElementById("azTextAngleSlider");
    if (lbl) lbl.textContent = a + "°";
    if (slider) slider.value = String(a);
  }

  function openMapTextComposer(coords, screenX, screenY, editObj) {
    const box = document.getElementById("azMapTextComposer");
    const inp = document.getElementById("azMapTextInput");
    const delBtn = document.getElementById("azDeleteMapTextBtn");
    const moveBtn = document.getElementById("azMoveMapTextBtn");
    const titleEl = document.getElementById("azMapTextComposerTitle");
    if (!box || !inp) return;

    tac.editingTextObj = editObj || null;
    tac.pendingTextCoords = coords ? { lat: coords.lat, lng: coords.lng } : (editObj ? { lat: editObj.lat, lng: editObj.lng } : null);
    tac.textColorHex = (editObj && editObj.color) || getColorHex(tac.myColorId);
    tac.textBgColor = (editObj && editObj.bgColor) || "transparent";
    syncTextSizeUi((editObj && editObj.sizePx) || tac.textSizePx || 14);
    syncTextAngleUi((editObj && typeof editObj.angleDeg === "number") ? editObj.angleDeg : 0);

    if (titleEl) titleEl.textContent = editObj ? "EDITAR TEXTO NO MAPA" : "ESCREVER NO MAPA";
    inp.value = editObj ? (editObj.text || "") : "";
    if (delBtn) delBtn.style.display = editObj ? "inline-flex" : "none";
    if (moveBtn) moveBtn.style.display = editObj ? "inline-flex" : "none";

    populateTextComposerColors(tac.textColorHex, tac.textBgColor);

    const safeLeft = Math.min(Math.max(8, (screenX || window.innerWidth / 2) - 129), Math.max(8, window.innerWidth - 266));
    const safeTop = Math.min(Math.max(50, (screenY || window.innerHeight / 2) - 90), Math.max(50, window.innerHeight - 360));
    box.style.left = safeLeft + "px";
    box.style.top = safeTop + "px";
    box.classList.add("is-open");
    setTimeout(function () { try { inp.focus(); inp.select(); } catch (_) {} }, 40);
  }

  const PIN_SVG_LIBRARY = [
    { id: "padrao", cat: "imoveis", label: "Padrão", svg: "" },
    { id: "casa", cat: "imoveis", label: "Casa/Imóvel", svg: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>' },
    { id: "portao", cat: "imoveis", label: "Portão", svg: '<rect x="3" y="5" width="18" height="14" rx="1"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="7.5" y1="5" x2="7.5" y2="19"/><line x1="16.5" y1="5" x2="16.5" y2="19"/>' },
    { id: "laje", cat: "imoveis", label: "Laje/Alto", svg: '<path d="M4 19h16"/><path d="M6 19V11h12v8"/><path d="M9 11V7l3-3 3 3v4"/>' },
    { id: "galpao", cat: "imoveis", label: "Galpão", svg: '<path d="M2 10l10-5 10 5v10H2z"/><line x1="8" y1="20" x2="8" y2="13"/><line x1="16" y1="20" x2="16" y2="13"/><line x1="8" y1="13" x2="16" y2="13"/>' },
    { id: "fuga", cat: "imoveis", label: "Rota Fuga", svg: '<path d="M5 12h12"/><polyline points="12 6 18 12 12 18"/><line x1="4" y1="5" x2="4" y2="19"/>' },
    { id: "carro", cat: "veiculos", label: "Carro", svg: '<path d="M5 13l2-5h10l2 5"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>' },
    { id: "moto", cat: "veiculos", label: "Moto", svg: '<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M9 16.5l3-6h4l2 6"/><path d="M12 10.5l-2-3.5H8"/>' },
    { id: "utilitario", cat: "veiculos", label: "Caminhão", svg: '<rect x="2" y="7" width="13" height="9" rx="1"/><path d="M15 10h4l3 3v3h-7z"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="18.5" cy="17.5" r="1.5"/>' },
    { id: "camera", cat: "vigilancia", label: "Câmera", svg: '<path d="M3 9h11l5-3v10l-5-3H3z"/><circle cx="8" cy="11" r="1.5"/><path d="M8 15v4"/>' },
    { id: "cao", cat: "vigilancia", label: "Cão/Alerta", svg: '<path d="M5 18v-5l-2-2 2-4 3 1 3-3 2 3h4l2 3-2 2v5"/><line x1="9" y1="18" x2="9" y2="14"/><line x1="15" y1="18" x2="15" y2="14"/>' },
    { id: "olheiro", cat: "vigilancia", label: "Olheiro", svg: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/>' },
    { id: "escuro", cat: "vigilancia", label: "Ponto Escuro", svg: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8 14a5 5 0 1 1 8 0c-.6.7-1 1.5-1 2.2H9c0-.7-.4-1.5-1-2.2z"/><line x1="3" y1="3" x2="21" y2="21"/>' },
    { id: "eletrico", cat: "vigilancia", label: "Risco Elétr.", svg: '<polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/>' },
    { id: "lixeira", cat: "urbano", label: "Caçamba", svg: '<polyline points="4 7 20 7"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>' },
    { id: "abrigo", cat: "urbano", label: "Abrigo", svg: '<path d="M3 12l9-7 9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>' },
    { id: "bueiro", cat: "urbano", label: "Bueiro", svg: '<circle cx="12" cy="12" r="8"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="7" y1="15" x2="17" y2="15"/>' },
    { id: "material", cat: "urbano", label: "Material/POI", svg: '<polygon points="12 3 21 8 21 16 12 21 3 16 3 8"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="21" y1="8" x2="12" y2="12"/><line x1="3" y1="8" x2="12" y2="12"/>' }
  ];

  function getPinIconDef(iconId) {
    return PIN_SVG_LIBRARY.find(function (ic) { return ic.id === iconId; }) || PIN_SVG_LIBRARY[0];
  }

  function buildPinVisualHtml(pinObj, smartCol) {
    if (pinObj && (pinObj.type === "red_dot" || pinObj.iconId === "red_dot")) {
      return `<div class="az-tac-pin-badge" style="background:rgba(13,13,13,0.92);color:#FCA5A5;border:1px solid rgba(239,68,68,0.65);">${pinObj.label || "A1"}</div><div class="az-tac-pin-dot" style="background:#EF4444;width:14px;height:14px;border:2px solid #FFFFFF;border-radius:50%;box-shadow:0 0 8px rgba(239,68,68,0.85);"></div>`;
    }
    const iconId = (pinObj && pinObj.iconId) || "padrao";
    const def = getPinIconDef(iconId);
    let innerIcon = '<div class="az-tac-pin-dot"></div>';
    if (def && def.svg) {
      innerIcon = `<div class="az-tac-pin-icon-wrap"><svg viewBox="0 0 24 24">${def.svg}</svg></div>`;
    }
    return `<div class="az-tac-pin-badge">${pinObj.label}</div>${innerIcon}`;
  }

  function buildCameraFovFeature(lng, lat, angleDeg, colorHex, spreadDeg, rangeM) {
    const ang = Number.isFinite(Number(angleDeg)) ? Number(angleDeg) : 0;
    const spread = Number.isFinite(Number(spreadDeg)) ? Number(spreadDeg) : 54;
    const dist = Number.isFinite(Number(rangeM)) ? Number(rangeM) : 120;
    const half = spread / 2;
    const steps = 18;
    const cosLat = Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    const ring = [[lng, lat]];
    for (let i = 0; i <= steps; i++) {
      const bearing = ang - half + (spread * i) / steps;
      const rad = (bearing * Math.PI) / 180;
      const dLat = (Math.cos(rad) * dist) / 111320;
      const dLng = (Math.sin(rad) * dist) / (111320 * cosLat);
      ring.push([lng + dLng, lat + dLat]);
    }
    ring.push([lng, lat]);
    return {
      type: "Feature",
      properties: { color: colorHex || "#22C55E" },
      geometry: { type: "Polygon", coordinates: [ring] }
    };
  }

  function updateCameraConesGeoJsonOnly() {
    const features = [];
    const pinModal = document.getElementById("azPinEditorModal");
    const isEditingCamInModal = Boolean(pinModal && pinModal.classList.contains("is-open") && tac.editingPinIconId === "camera");
    let handledEditingId = false;

    (tac.pins || []).forEach(function (p) {
      if (!p || p.isGhost || typeof p.lng !== "number" || typeof p.lat !== "number") return;
      const isTargetEdit = isEditingCamInModal && tac.editingPinObj && tac.editingPinObj.id === p.id;
      if (p.iconId !== "camera" && !isTargetEdit) return;
      const ang = isTargetEdit ? (tac.editingPinCamAngle || 0) : (p.camAngleDeg || 0);
      const rawCol = isTargetEdit ? (tac.editingPinColorHex || p.colorHex || "#C5A869") : (p.colorHex || "#C5A869");
      const dispCol = resolveSmartDisplayColor(rawCol, "pin");
      if (isTargetEdit) handledEditingId = true;
      features.push(buildCameraFovFeature(p.lng, p.lat, ang, dispCol, 54, 120));
    });

    if (isEditingCamInModal && !handledEditingId && tac.pendingPinCoords && typeof tac.pendingPinCoords.lng === "number" && typeof tac.pendingPinCoords.lat === "number") {
      const prevCol = resolveSmartDisplayColor(tac.editingPinColorHex || getColorHex(tac.myColorId), "pin");
      features.push(buildCameraFovFeature(tac.pendingPinCoords.lng, tac.pendingPinCoords.lat, tac.editingPinCamAngle || 0, prevCol, 54, 120));
    }

    const fc = { type: "FeatureCollection", features: features };
    (tac.maps || []).forEach(function (m) {
      if (!canDrawOnMap(m)) return;
      try {
        if (m.getSource("az-tac-cam-cones-src")) {
          m.getSource("az-tac-cam-cones-src").setData(fc);
        } else {
          m.addSource("az-tac-cam-cones-src", { type: "geojson", data: fc });
          m.addLayer({
            id: "az-tac-cam-cones-fill",
            type: "fill",
            source: "az-tac-cam-cones-src",
            paint: { "fill-color": ["coalesce", ["get", "color"], "#22C55E"], "fill-opacity": 0.34 }
          });
          m.addLayer({
            id: "az-tac-cam-cones-line",
            type: "line",
            source: "az-tac-cam-cones-src",
            paint: { "line-color": ["coalesce", ["get", "color"], "#22C55E"], "line-width": 1.6, "line-opacity": 0.8 }
          });
        }
      } catch (_) {}
    });
  }

  function savePinsToStorage() {
    try {
      const compact = (tac.pins || []).filter(function (p) { return p && !p.isGhost; }).map(function (p) {
        return {
          id: p.id, type: p.type, label: p.label, rawTitle: p.rawTitle,
          colorHex: p.colorHex, iconId: p.iconId || "padrao", camAngleDeg: p.camAngleDeg || 0,
          photoUrl: p.photoUrl || "", lng: p.lng, lat: p.lat
        };
      });
      localStorage.setItem("az_tac_saved_pins_v1", JSON.stringify(compact));
    } catch (_) {}
  }

  function restoreSavedPinsFromStorage() {
    if (tac._pinsRestoredOnce) return;
    tac._pinsRestoredOnce = true;
    try {
      const arr = JSON.parse(localStorage.getItem("az_tac_saved_pins_v1") || "[]");
      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach(function (p) {
          if (p && p.id && typeof p.lat === "number" && typeof p.lng === "number") {
            upsertTacticalPin(p, true, true);
          }
        });
      }
    } catch (_) {}
  }

  function renderPinIconPickerGrid() {
    const grid = document.getElementById("azPinIconPickerGrid");
    const camBox = document.getElementById("azPinCamAngleBox");
    const camSlider = document.getElementById("azPinCamAngleSlider");
    const camVal = document.getElementById("azPinCamAngleVal");
    if (!grid) return;

    const cat = tac.pinIconCatFilter || "ALL";
    const previewHex = resolveSmartDisplayColor(tac.editingPinColorHex || getColorHex(tac.myColorId), "pin");
    const items = PIN_SVG_LIBRARY.filter(function (ic) { return cat === "ALL" || ic.id === "padrao" || ic.cat === cat; });
    grid.innerHTML = items.map(function (ic) {
      const act = ic.id === (tac.editingPinIconId || "padrao") ? " is-active" : "";
      const iconSvg = ic.svg
        ? `<svg viewBox="0 0 24 24" style="color:${previewHex};">${ic.svg}</svg>`
        : `<svg viewBox="0 0 24 24" style="color:${previewHex};"><circle cx="12" cy="12" r="5" fill="currentColor"/></svg>`;
      return `<button type="button" class="az-pin-icon-opt${act}" data-pick-pin-icon="${ic.id}">${iconSvg}<span>${ic.label}</span></button>`;
    }).join("");

    grid.querySelectorAll("[data-pick-pin-icon]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        tac.editingPinIconId = btn.getAttribute("data-pick-pin-icon") || "padrao";
        if (tac.editingPinIconId !== "padrao") {
          const inp = document.getElementById("azPinCustomNameInput");
          if (inp && !inp.value.trim()) {
            const def = getPinIconDef(tac.editingPinIconId);
            if (def) inp.value = def.label.toUpperCase();
          }
        }
        renderPinIconPickerGrid();
      });
    });

    if (camBox) {
      const isCam = tac.editingPinIconId === "camera";
      camBox.style.display = isCam ? "flex" : "none";
      if (isCam) {
        const deg = ((tac.editingPinCamAngle || 0) % 360 + 360) % 360;
        if (camSlider) camSlider.value = String(deg);
        if (camVal) camVal.textContent = `${deg}°`;
      }
    }
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
  }

  function openPinEditorModal(editObj, coords, defaultType) {
    tac.editingPinObj = editObj || null;
    tac.pendingPinCoords = coords || (editObj ? { lng: editObj.lng, lat: editObj.lat } : null);
    tac.pendingPinType = (editObj && editObj.type) || defaultType || "custom";
    tac.editingPinColorHex = (editObj && editObj.colorHex) || getColorHex(tac.myColorId);
    tac.editingPinIconId = (editObj && editObj.iconId) || (tac.pendingPinType === "vtr" ? "carro" : "padrao");
    tac.editingPinCamAngle = (editObj && typeof editObj.camAngleDeg === "number") ? editObj.camAngleDeg : 0;

    const hdr = document.getElementById("azPinModalHeader");
    const inp = document.getElementById("azPinCustomNameInput");
    const typeSel = document.getElementById("azPinTypeSelect");
    const delBtn = document.getElementById("azDeletePinEditorBtn");
    const colRow = document.getElementById("azPinColorRow");

    if (hdr) hdr.textContent = editObj ? "EDITAR MARCADOR / PIN" : (tac.pendingPinType === "vtr" ? "MARCAR VIATURA" : "MARCADOR TÁTICO");
    if (inp) inp.value = editObj ? (editObj.rawTitle || editObj.label || "") : "";
    if (typeSel) typeSel.value = ["custom", "gpe", "vtr", "photo_pin"].includes(tac.pendingPinType) ? tac.pendingPinType : "custom";
    if (delBtn) delBtn.style.display = editObj ? "inline-flex" : "none";

    if (colRow) {
      const opts = [getColorHex(tac.myColorId), "#EF4444", "#C5A869", "#3B82F6", "#22C55E", "#F97316", "#C084FC", "#F8FAFC"]
        .filter(function (c, i, a) { return a.findIndex(function (x) { return x.toUpperCase() === c.toUpperCase(); }) === i; });
      const curHex = (tac.editingPinColorHex || getColorHex(tac.myColorId)).toUpperCase();
      colRow.innerHTML = opts.map(function (hex) {
        const act = hex.toUpperCase() === curHex ? " is-active" : "";
        return `<button type="button" class="az-text-color-swatch${act}" data-pin-col="${hex}" style="background:${hex};width:24px;height:24px;" title="${hex}"></button>`;
      }).join("");
      colRow.querySelectorAll("[data-pin-col]").forEach(function (sw) {
        sw.addEventListener("click", function (ev) {
          ev.stopPropagation();
          tac.editingPinColorHex = sw.getAttribute("data-pin-col");
          colRow.querySelectorAll(".az-text-color-swatch").forEach(function (s2) {
            s2.classList.toggle("is-active", s2 === sw);
          });
          renderPinIconPickerGrid();
        });
      });
    }
    renderPinIconPickerGrid();
    document.getElementById("azPinEditorModal").classList.add("is-open");
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
  }

  function closeMapTextComposer() {
    const box = document.getElementById("azMapTextComposer");
    if (box) box.classList.remove("is-open");
    tac.editingTextObj = null;
    tac.pendingTextCoords = null;
  }

  /* =====================================================================
     AJUSTE FINO QUADRADO (8 DIREÇÕES INCLUINDO DIAGONAIS)
     ===================================================================== */
  function updateRemoteCoordReadout() {
    const el = document.getElementById("azRemoteCoordReadout");
    if (!el) return;
    const tgt = tac.fineTuneTarget;
    if (tgt && (tgt.kind === "flag" || tgt.kind === "text") && tgt.ref) {
      el.textContent = `${tgt.ref.lat.toFixed(6)}, ${tgt.ref.lng.toFixed(6)}`;
    } else if (tgt && tgt.kind === "circle" && tac.circleCenter) {
      el.textContent = `${tac.circleCenter.lat.toFixed(6)}, ${tac.circleCenter.lng.toFixed(6)}`;
    } else if (tac.fineTunePin) {
      el.textContent = `${tac.fineTunePin.lat.toFixed(6)}, ${tac.fineTunePin.lng.toFixed(6)}`;
    }
  }

  function setRemoteFineTunePart(partNum) {
    const p1 = document.getElementById("azRemotePart1Pane");
    const p2 = document.getElementById("azRemotePart2Pane");
    const t1 = document.getElementById("azRemoteTab1Btn");
    const t2 = document.getElementById("azRemoteTab2Btn");
    const isP2 = String(partNum) === "2";
    if (p1) p1.style.display = isP2 ? "none" : "block";
    if (p2) p2.style.display = isP2 ? "flex" : "none";
    if (t1) t1.classList.toggle("is-active", !isP2);
    if (t2) t2.classList.toggle("is-active", isP2);
    if (isP2) renderRemoteFineTunePart2();
  }

  function renderRemoteFineTunePart2() {
    const body = document.getElementById("azRemotePart2Body");
    const tgt = tac.fineTuneTarget;
    if (!body || !tgt) return;

    if (tgt.kind === "pin" && tac.fineTunePin) {
      const p = tac.fineTunePin;
      const curHex = String(p.colorHex || getColorHex(tac.myColorId)).toUpperCase();
      const swatches = [getColorHex(tac.myColorId), "#3B82F6", "#22C55E", "#EF4444", "#C5A869", "#F97316", "#C084FC", "#F8FAFC"]
        .filter(function (c, i, a) { return a.findIndex(function (x) { return x.toUpperCase() === c.toUpperCase(); }) === i; })
        .map(function (hex) {
          const act = hex.toUpperCase() === curHex ? " is-active" : "";
          return `<button type="button" class="az-text-color-swatch${act}" data-ft-pin-col="${hex}" style="background:${hex};width:20px;height:20px;"></button>`;
        }).join("");
      const camHtml = p.iconId === "camera"
        ? `<div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">
             <span style="color:#9E9A8F;">LENTE (<strong id="azFtCamAngVal" style="color:#38BDF8;">${p.camAngleDeg || 0}°</strong>)</span>
             <div style="display:flex;gap:3px;">
               <button type="button" class="az-remote-mini-btn" data-ft-cam="-15">-15°</button>
               <button type="button" class="az-remote-mini-btn" data-ft-cam="15">+15°</button>
               <button type="button" class="az-remote-mini-btn" data-ft-cam="90">↻90°</button>
             </div>
           </div>`
        : "";
      body.innerHTML = `
        <div style="font-size:8.5px;color:#9E9A8F;font-weight:800;">COR DO MARCADOR:</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">${swatches}</div>
        ${camHtml}
        <button type="button" id="azFtOpenPinModalBtn" class="az-atak-tool-btn" style="width:100%;height:26px;font-size:8.5px;">TROCAR ÍCONE / RÓTULO</button>`;

      body.querySelectorAll("[data-ft-pin-col]").forEach(function (sw) {
        sw.addEventListener("click", function () {
          p.colorHex = sw.getAttribute("data-ft-pin-col");
          const disp = resolveSmartDisplayColor(p.colorHex, "pin");
          const txtC = getRelativeLuminance(disp) > 0.42 ? "#0D0D0D" : "#FFFFFF";
          p.markers.forEach(function (it) {
            if (it.el) {
              it.el.style.setProperty("--pin-color", disp);
              it.el.style.setProperty("--pin-text-color", txtC);
              if (p.iconId === "camera") it.el.innerHTML = buildPinVisualHtml(p, disp);
            }
          });
          updateCameraConesGeoJsonOnly();
          renderRemoteFineTunePart2();
        });
      });
      body.querySelectorAll("[data-ft-cam]").forEach(function (b) {
        b.addEventListener("click", function () {
          const d = parseInt(b.getAttribute("data-ft-cam"), 10) || 0;
          p.camAngleDeg = (((Number(p.camAngleDeg) || 0) + d) % 360 + 360) % 360;
          const disp = resolveSmartDisplayColor(p.colorHex || "#C5A869", "pin");
          p.markers.forEach(function (it) { if (it.el) it.el.innerHTML = buildPinVisualHtml(p, disp); });
          updateCameraConesGeoJsonOnly();
          const av = document.getElementById("azFtCamAngVal");
          if (av) av.textContent = `${p.camAngleDeg}°`;
        });
      });
      onClick("azFtOpenPinModalBtn", function () {
        closeRemoteFineTune(true);
        openPinEditorModal(p, { lng: p.lng, lat: p.lat }, p.type || "custom");
      });
    } else if ((tgt.kind === "flag" && tgt.ref) || tgt.kind === "circle") {
      const curR = tgt.kind === "flag" ? (tgt.ref.radiusM || 45) : (tac.circleRadius || 150);
      body.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#9E9A8F;font-weight:800;">RAIO DE ALERTA:</span>
          <strong id="azFtRadVal" style="color:#4ADE80;">${curR} m</strong>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;">
          <button type="button" class="az-remote-mini-btn" data-ft-rad="-25">-25m</button>
          <button type="button" class="az-remote-mini-btn" data-ft-rad="-5">-5m</button>
          <button type="button" class="az-remote-mini-btn" data-ft-rad="5">+5m</button>
          <button type="button" class="az-remote-mini-btn" data-ft-rad="25">+25m</button>
        </div>`;
      body.querySelectorAll("[data-ft-rad]").forEach(function (b) {
        b.addEventListener("click", function () {
          const delta = parseInt(b.getAttribute("data-ft-rad"), 10) || 0;
          if (tgt.kind === "flag" && tgt.ref) {
            tgt.ref.radiusM = Math.max(10, Math.min(1000, (tgt.ref.radiusM || 45) + delta));
            updateFlagRingsGeoJsonOnly();
            const el = document.getElementById("azFtRadVal");
            if (el) el.textContent = `${tgt.ref.radiusM} m`;
          } else {
            tac.circleRadius = Math.max(20, Math.min(3000, (tac.circleRadius || 150) + delta));
            if (tac.circleCenter) renderCircleOnMaps(tac.circleCenter.lng, tac.circleCenter.lat, tac.circleRadius, true, true);
            const el = document.getElementById("azFtRadVal");
            if (el) el.textContent = `${tac.circleRadius} m`;
          }
        });
      });
    } else if (tgt.kind === "text" && tgt.ref) {
      const tx = tgt.ref;
      body.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#9E9A8F;">GIRO (${tx.angleDeg || 0}°)</span>
          <div style="display:flex;gap:4px;">
            <button type="button" class="az-remote-mini-btn" data-ft-tang="-15">-15°</button>
            <button type="button" class="az-remote-mini-btn" data-ft-tang="15">+15°</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:#9E9A8F;">TAMANHO (${tx.sizePx || 14}px)</span>
          <div style="display:flex;gap:4px;">
            <button type="button" class="az-remote-mini-btn" data-ft-tsize="-2">-2px</button>
            <button type="button" class="az-remote-mini-btn" data-ft-tsize="2">+2px</button>
          </div>
        </div>`;
      body.querySelectorAll("[data-ft-tang]").forEach(function (b) {
        b.addEventListener("click", function () {
          tx.angleDeg = (((Number(tx.angleDeg) || 0) + parseInt(b.getAttribute("data-ft-tang"), 10)) % 360 + 360) % 360;
          renderMapTextsOnMaps(true);
          renderRemoteFineTunePart2();
        });
      });
      body.querySelectorAll("[data-ft-tsize]").forEach(function (b) {
        b.addEventListener("click", function () {
          tx.sizePx = Math.max(10, Math.min(36, (Number(tx.sizePx) || 14) + parseInt(b.getAttribute("data-ft-tsize"), 10)));
          renderMapTextsOnMaps(true);
          renderRemoteFineTunePart2();
        });
      });
    }
  }

  function openRemoteFineTuneTarget(kind, refObj) {
    if ((kind === "pin" || kind === "flag" || kind === "text") && !refObj) return;
    if (kind === "circle" && !tac.circleCenter) return;

    tac.fineTuneTarget = { kind: kind, ref: refObj || tac.circleCenter };
    if (kind === "pin") {
      tac.fineTunePin = refObj;
      tac.fineTuneStartPos = { lat: refObj.lat, lng: refObj.lng, colorHex: refObj.colorHex, camAngleDeg: refObj.camAngleDeg || 0 };
      document.getElementById("azRemoteTargetLabel").textContent = `AJUSTE: ${refObj.label}`;
      refObj.markers.forEach(function (it) {
        if (it.marker && it.marker.setDraggable) it.marker.setDraggable(true);
      });
    } else if (kind === "flag") {
      tac.fineTunePin = null;
      tac.fineTuneStartPos = { lat: refObj.lat, lng: refObj.lng, radiusM: refObj.radiusM || 45 };
      document.getElementById("azRemoteTargetLabel").textContent = `AJUSTE: ${refObj.label}`;
      tac.flagMarkers.forEach(function (mk) {
        if (mk && mk._flagId === refObj.id && mk.setDraggable) mk.setDraggable(true);
      });
    } else if (kind === "text") {
      tac.fineTunePin = null;
      tac.fineTuneStartPos = { lat: refObj.lat, lng: refObj.lng, angleDeg: refObj.angleDeg || 0, sizePx: refObj.sizePx || 14 };
      document.getElementById("azRemoteTargetLabel").textContent = `AJUSTE: TEXTO`;
      tac.textMarkers.forEach(function (mk) {
        if (mk && mk._textId === refObj.id && mk.setDraggable) mk.setDraggable(true);
      });
    } else if (kind === "circle") {
      tac.fineTunePin = null;
      tac.fineTuneStartPos = { lat: tac.circleCenter.lat, lng: tac.circleCenter.lng, radius: tac.circleRadius };
      document.getElementById("azRemoteTargetLabel").textContent = `AJUSTE: PERÍMETRO (${tac.circleRadius}m)`;
    }

    setRemoteFineTunePart(1);
    updateRemoteCoordReadout();
    document.getElementById("azRemoteFineTunePad").classList.add("is-open");
  }

  function openRemoteFineTune(pinObj) {
    openRemoteFineTuneTarget("pin", pinObj);
  }

  function closeRemoteFineTune(commit) {
    const tgt = tac.fineTuneTarget;
    const p = tac.fineTunePin;

    if (tgt && tgt.kind === "text" && tgt.ref) {
      const tx = tgt.ref;
      if (!commit && tac.fineTuneStartPos) {
        tx.lat = tac.fineTuneStartPos.lat;
        tx.lng = tac.fineTuneStartPos.lng;
      } else if (commit && tac.fineTuneStartPos && (tac.fineTuneStartPos.lat !== tx.lat || tac.fineTuneStartPos.lng !== tx.lng)) {
        pushUndoAction({
          type: "text_edit",
          id: tx.id,
          prev: { lat: tac.fineTuneStartPos.lat, lng: tac.fineTuneStartPos.lng },
          next: { lat: tx.lat, lng: tx.lng }
        });
      }
      document.getElementById("azRemoteFineTunePad").classList.remove("is-open");
      tac.fineTuneTarget = null;
      tac.fineTunePin = null;
      tac.fineTuneStartPos = null;
      renderMapTextsOnMaps(!commit);
      if (commit) showToast("Texto reposicionado.");
      refreshLeftControls();
      return;
    }

    if (tgt && tgt.kind === "flag" && tgt.ref) {
      const f = tgt.ref;
      if (!commit && tac.fineTuneStartPos) {
        f.lat = tac.fineTuneStartPos.lat;
        f.lng = tac.fineTuneStartPos.lng;
      } else if (commit && tac.fineTuneStartPos && (tac.fineTuneStartPos.lat !== f.lat || tac.fineTuneStartPos.lng !== f.lng)) {
        pushUndoAction({
          type: "flag_edit",
          id: f.id,
          prev: { lat: tac.fineTuneStartPos.lat, lng: tac.fineTuneStartPos.lng, radiusM: f.radiusM, photoUrl: f.photoUrl, photoCaption: f.photoCaption },
          next: { lat: f.lat, lng: f.lng, radiusM: f.radiusM, photoUrl: f.photoUrl, photoCaption: f.photoCaption }
        });
      }
      document.getElementById("azRemoteFineTunePad").classList.remove("is-open");
      tac.fineTuneTarget = null;
      tac.fineTunePin = null;
      tac.fineTuneStartPos = null;
      renderFlagsOnMaps(!commit);
      if (commit) showToast(`${f.label} reposicionada.`);
      renderEdgeIndicators();
      return;
    }

    if (tgt && tgt.kind === "circle") {
      if (!commit && tac.fineTuneStartPos) {
        renderCircleOnMaps(tac.fineTuneStartPos.lng, tac.fineTuneStartPos.lat, tac.fineTuneStartPos.radius || tac.circleRadius, true, true);
      } else if (commit && tac.circleCenter && tac.fineTuneStartPos) {
        pushUndoAction({
          type: "circle",
          prev: { center: { lng: tac.fineTuneStartPos.lng, lat: tac.fineTuneStartPos.lat }, radius: tac.fineTuneStartPos.radius || tac.circleRadius },
          next: { center: { lng: tac.circleCenter.lng, lat: tac.circleCenter.lat }, radius: tac.circleRadius },
          _ts: Date.now()
        });
        renderCircleOnMaps(tac.circleCenter.lng, tac.circleCenter.lat, tac.circleRadius, false, true);
        showToast("Perímetro reposicionado.");
      }
      document.getElementById("azRemoteFineTunePad").classList.remove("is-open");
      tac.fineTuneTarget = null;
      tac.fineTunePin = null;
      tac.fineTuneStartPos = null;
      renderEdgeIndicators();
      return;
    }

    if (!commit && p && tac.fineTuneStartPos) {
      p.lat = tac.fineTuneStartPos.lat;
      p.lng = tac.fineTuneStartPos.lng;
      if (tac.fineTuneStartPos.colorHex) p.colorHex = tac.fineTuneStartPos.colorHex;
      if (typeof tac.fineTuneStartPos.camAngleDeg === "number") p.camAngleDeg = tac.fineTuneStartPos.camAngleDeg;
      upsertTacticalPin(p, true, true);
    }
    if (p) {
      p.markers.forEach(function (it) { if (it.marker && it.marker.setDraggable) it.marker.setDraggable(false); });
    }
    document.getElementById("azRemoteFineTunePad").classList.remove("is-open");
    tac.fineTuneTarget = null;
    tac.fineTunePin = null;
    tac.fineTuneStartPos = null;
    if (commit && p) {
      upsertTacticalPin(p, false);
    } else if (p && tac.bloodhoundTarget && tac.bloodhoundTarget.type === "pin" && tac.bloodhoundTarget.id === p.id) {
      updateBloodhoundVector();
    }
    renderEdgeIndicators();
  }

  function pushUndoAction(entry) {
    if (!Array.isArray(tac.undoHistory)) tac.undoHistory = [];
    tac.undoHistory.push(entry);
    tac.redoHistory = [];
  }

  /* =====================================================================
     DESFAZER & REFAZER (GERENCIAR EDIÇÃO) + EXCLUSÃO
     ===================================================================== */
  function deletePinById(pinId, skipHistory) {
    const idx = tac.pins.findIndex(function (p) { return p.id === pinId; });
    if (idx === -1) return;
    const removedPin = tac.pins[idx];
    tac.pins[idx].markers.forEach(function (i) { i.marker.remove(); });
    tac.pins.splice(idx, 1);
    if (!skipHistory && removedPin && !removedPin.isGhost) {
      pushUndoAction({
        type: "del_pin",
        pin: {
          id: removedPin.id,
          type: removedPin.type,
          label: removedPin.label,
          rawTitle: removedPin.rawTitle,
          colorHex: removedPin.colorHex,
          iconId: removedPin.iconId || "padrao",
          camAngleDeg: removedPin.camAngleDeg || 0,
          photoUrl: removedPin.photoUrl || "",
          lng: removedPin.lng,
          lat: removedPin.lat
        }
      });
    }
    if (Array.isArray(tac.bloodhoundList) && tac.bloodhoundList.some(function (t) { return t.id === pinId; })) {
      removeBloodhoundTargetById(pinId);
    }
    savePinsToStorage();
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
    broadcastPacket({ kind: "del_pin", pinId: pinId });
    refreshLeftControls();
    renderEdgeIndicators();
    if (!skipHistory) showToast("Marcador removido.");
  }

  function undoLastTacticalAction() {
    if (!Array.isArray(tac.undoHistory)) tac.undoHistory = [];
    if (!Array.isArray(tac.redoHistory)) tac.redoHistory = [];

    const entry = tac.undoHistory.pop();
    if (!entry) {
      if (tac.drawStrokes.length > 0) {
        const st = tac.drawStrokes.pop();
        tac.redoHistory.push({ type: "stroke", stroke: st });
        renderFreehandStrokes(false);
        showToast("Traço desfeito.");
        return;
      }
      if (tac.rulerCoords.length > 0) {
        const rp = tac.rulerCoords.pop();
        tac.redoHistory.push({ type: "ruler_pt", coord: rp });
        renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, null, "ruler");
        showToast("Ponto da régua desfeito.");
        return;
      }
      if (tac.breadcrumbs.length > 0) {
        const cb = tac.breadcrumbs.pop();
        tac.redoHistory.push({ type: "crumb", crumb: cb });
        renderBreadcrumbRoute(false);
        showToast("Migalha desfeita.");
        return;
      }
      if (tac.tacticalGeoms.length > 0) {
        const gm = tac.tacticalGeoms.pop();
        tac.redoHistory.push({ type: "geom", geom: gm });
        renderTacticalGeomsOnMaps();
        if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
        refreshLeftControls();
        showToast("Geometria desfeita.");
        return;
      }
      showToast("Nada para desfazer.");
      refreshLeftControls();
      return;
    }

    if (entry.type === "pin") {
      const targetId = entry.pinId || (entry.pin && entry.pin.id);
      const found = tac.pins.find(function (p) { return p.id === targetId; });
      if (found) {
        entry.pin = {
          id: found.id, type: found.type, label: found.label, rawTitle: found.rawTitle,
          colorHex: found.colorHex, photoUrl: found.photoUrl || "", lng: found.lng, lat: found.lat
        };
        deletePinById(found.id, true);
      }
      tac.redoHistory.push(entry);
      showToast("Marcador desfeito.");
    } else if (entry.type === "pin_edit" && entry.prev) {
      upsertTacticalPin(cloneTacData(entry.prev), false, true);
      tac.redoHistory.push(entry);
      showToast("Edição de marcador desfeita.");
    } else if (entry.type === "del_trail" && Array.isArray(entry.trail)) {
      tac.myTrailCoords = cloneTacData(entry.trail);
      renderTrailsOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Rastro restaurado.");
    } else if (entry.type === "trace" && entry.trace) {
      tac.terrainTraces = tac.terrainTraces.filter(function (t) { return t.id !== entry.trace.id; });
      if (tac.activeTraceId === entry.trace.id) tac.activeTraceId = null;
      renderTerrainTracesOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Traçado desfeito.");
    } else if (entry.type === "del_traces" && Array.isArray(entry.traces)) {
      entry.traces.forEach(function (tr) {
        if (tr && !tac.terrainTraces.some(function (x) { return x.id === tr.id; })) tac.terrainTraces.push(cloneTacData(tr));
      });
      renderTerrainTracesOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Traçado restaurado.");
    } else if (entry.type === "trace_edit" && entry.prev) {
      const tr = tac.terrainTraces.find(function (x) { return x.id === (entry.traceId || entry.id); });
      if (tr) Object.assign(tr, cloneTacData(entry.prev));
      renderTerrainTracesOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Edição de traçado desfeita.");
    } else if (entry.type === "fp_add" && entry.fp) {
      tac.floorplans = (tac.floorplans || []).filter(function (x) { return x.id !== entry.fp.id; });
      if (tac.activeFloorplanId === entry.fp.id) tac.activeFloorplanId = null;
      if (tac.editingFloorplanId === entry.fp.id) tac.editingFloorplanId = null;
      renderFloorplansOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Planta adicionada desfeita.");
    } else if (entry.type === "del_fps" && Array.isArray(entry.fps)) {
      entry.fps.forEach(function (fp) {
        if (fp && !tac.floorplans.some(function (x) { return x.id === fp.id; })) tac.floorplans.push(cloneTacData(fp));
      });
      renderFloorplansOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Planta restaurada.");
    } else if (entry.type === "fp_edit" && entry.prev) {
      const fp = (tac.floorplans || []).find(function (x) { return x.id === (entry.fpId || entry.prev.id); });
      if (fp) {
        Object.assign(fp, cloneTacData(entry.prev));
        if (!fp.locked) tac.editingFloorplanId = fp.id;
      }
      renderFloorplansOnMaps(false);
      tac.redoHistory.push(entry);
      showToast("Ajuste de planta desfeito.");
    } else if (entry.type === "del_pin" && entry.pin) {
      upsertTacticalPin(entry.pin, false, true);
      tac.redoHistory.push(entry);
      showToast("Marcador restaurado.");
    } else if (entry.type === "stroke") {
      const idx = tac.drawStrokes.lastIndexOf(entry.stroke);
      if (idx !== -1) tac.drawStrokes.splice(idx, 1);
      else if (tac.drawStrokes.length > 0) entry.stroke = tac.drawStrokes.pop();
      tac.redoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Traço desfeito.");
    } else if (entry.type === "stroke_edit" && entry.prev) {
      const st = (tac.drawStrokes || []).find(function (s) { return s && s.id === entry.strokeId; });
      if (st) Object.assign(st, cloneTacData(entry.prev));
      tac.redoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Edição de traço desfeita.");
    } else if (entry.type === "del_strokes" && Array.isArray(entry.strokes)) {
      entry.strokes.forEach(function (it) {
        const st = it && it.stroke ? cloneTacData(it.stroke) : cloneTacData(it);
        if (typeof it.idx === "number" && it.idx <= tac.drawStrokes.length) tac.drawStrokes.splice(it.idx, 0, st);
        else tac.drawStrokes.push(st);
      });
      tac.redoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Traço restaurado.");
    } else if (entry.type === "ruler_pt") {
      if (tac.rulerCoords.length > 0) entry.coord = tac.rulerCoords.pop();
      tac.redoHistory.push(entry);
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, null, "ruler");
      showToast("Ponto da régua desfeito.");
    } else if (entry.type === "crumb") {
      if (tac.breadcrumbs.length > 0) entry.crumb = tac.breadcrumbs.pop();
      tac.redoHistory.push(entry);
      renderBreadcrumbRoute(false);
      showToast("Migalha desfeita.");
    } else if (entry.type === "del_crumbs" && Array.isArray(entry.crumbs)) {
      entry.crumbs.forEach(function (it) {
        const cb = it && it.crumb ? cloneTacData(it.crumb) : cloneTacData(it);
        if (typeof it.idx === "number" && it.idx <= tac.breadcrumbs.length) tac.breadcrumbs.splice(it.idx, 0, cb);
        else tac.breadcrumbs.push(cb);
      });
      tac.redoHistory.push(entry);
      renderBreadcrumbRoute(false);
      showToast("Migalha restaurada.");
    } else if (entry.type === "geom" && entry.geom) {
      tac.tacticalGeoms = tac.tacticalGeoms.filter(function (g) { return g.id !== entry.geom.id; });
      tac.redoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Geometria desfeita.");
    } else if (entry.type === "del_geoms" && Array.isArray(entry.geoms)) {
      entry.geoms.forEach(function (gm) {
        if (gm && !tac.tacticalGeoms.some(function (x) { return x.id === gm.id; })) {
          tac.tacticalGeoms.push(cloneTacData(gm));
        }
      });
      tac.redoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Geometria restaurada.");
    } else if (entry.type === "geom_edit" && entry.prev) {
      const g = tac.tacticalGeoms.find(function (x) { return x.id === entry.id; });
      if (g) Object.assign(g, entry.prev);
      tac.redoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Ajuste de geometria desfeito.");
    } else if (entry.type === "circle") {
      if (entry.prev && entry.prev.center) {
        renderCircleOnMaps(entry.prev.center.lng, entry.prev.center.lat, entry.prev.radius, false, true);
      } else {
        clearCircleFromMaps(false, true);
      }
      tac.redoHistory.push(entry);
      showToast("Perímetro desfeito.");
    } else if (entry.type === "del_circle" && entry.circle && entry.circle.center) {
      renderCircleOnMaps(entry.circle.center.lng, entry.circle.center.lat, entry.circle.radius || 150, false, true);
      tac.redoHistory.push(entry);
      showToast("Perímetro restaurado.");
    } else if (entry.type === "flag" && entry.flag) {
      tac.flags = tac.flags.filter(function (f) { return f.id !== entry.flag.id; });
      tac.redoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Bandeira desfeita.");
    } else if (entry.type === "del_flags" && Array.isArray(entry.flags)) {
      entry.flags.forEach(function (fl) {
        if (fl && !tac.flags.some(function (x) { return x.id === fl.id; })) tac.flags.push(cloneTacData(fl));
      });
      tac.redoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Bandeira restaurada.");
    } else if (entry.type === "flag_edit" && entry.prev) {
      const fl = tac.flags.find(function (x) { return x.id === entry.id; });
      if (fl) Object.assign(fl, entry.prev);
      tac.redoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Edição de bandeira desfeita.");
    } else if (entry.type === "wasp_add" && entry.wasp) {
      removeWaspMarkerById(entry.wasp.id, false);
      tac.redoHistory.push(entry);
      showToast("Ponto WASP desfeito.");
    } else if (entry.type === "wasp_edit" && entry.prev) {
      upsertWaspMarker(cloneTacData(entry.prev), false);
      tac.redoHistory.push(entry);
      showToast("Status WASP desfeito.");
    } else if (entry.type === "del_wasps" && Array.isArray(entry.wasps)) {
      entry.wasps.forEach(function (w) { upsertWaspMarker(cloneTacData(w), false); });
      tac.redoHistory.push(entry);
      showToast("WASP restaurado.");
    } else if (entry.type === "text" && entry.text) {
      tac.mapTexts = tac.mapTexts.filter(function (t) { return t.id !== entry.text.id; });
      tac.redoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Texto desfeito.");
    } else if (entry.type === "del_texts" && Array.isArray(entry.texts)) {
      entry.texts.forEach(function (tx) {
        if (tx && !tac.mapTexts.some(function (x) { return x.id === tx.id; })) tac.mapTexts.push(cloneTacData(tx));
      });
      tac.redoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Texto restaurado.");
    } else if (entry.type === "text_edit" && entry.prev) {
      const tx = tac.mapTexts.find(function (x) { return x.id === entry.id; });
      if (tx) Object.assign(tx, entry.prev);
      tac.redoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Edição de texto desfeita.");
    } else if (entry.type === "erase_batch") {
      (entry.pins || []).forEach(function (pn) { upsertTacticalPin(cloneTacData(pn), false, true); });
      (entry.strokes || []).forEach(function (it) {
        const st = it && it.stroke ? cloneTacData(it.stroke) : cloneTacData(it);
        tac.drawStrokes.push(st);
      });
      if ((entry.strokes || []).length > 0) renderFreehandStrokes(false);
      (entry.crumbs || []).forEach(function (it) {
        const cb = it && it.crumb ? cloneTacData(it.crumb) : cloneTacData(it);
        tac.breadcrumbs.push(cb);
      });
      if ((entry.crumbs || []).length > 0) renderBreadcrumbRoute(false);
      if (entry.circle && entry.circle.center) {
        renderCircleOnMaps(entry.circle.center.lng, entry.circle.center.lat, entry.circle.radius || 150, false, true);
      }
      (entry.geoms || []).forEach(function (gm) {
        if (gm && !tac.tacticalGeoms.some(function (x) { return x.id === gm.id; })) tac.tacticalGeoms.push(cloneTacData(gm));
      });
      if ((entry.geoms || []).length > 0) {
        renderTacticalGeomsOnMaps();
        if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      }
      (entry.flags || []).forEach(function (fl) {
        if (fl && !tac.flags.some(function (x) { return x.id === fl.id; })) tac.flags.push(cloneTacData(fl));
      });
      if ((entry.flags || []).length > 0) renderFlagsOnMaps(false);
      (entry.texts || []).forEach(function (tx) {
        if (tx && !tac.mapTexts.some(function (x) { return x.id === tx.id; })) tac.mapTexts.push(cloneTacData(tx));
      });
      if ((entry.texts || []).length > 0) renderMapTextsOnMaps(false);
      if (Array.isArray(entry.trail) && entry.trail.length >= 2) {
        tac.myTrailCoords = cloneTacData(entry.trail);
        renderTrailsOnMaps(false);
      }
      if (Array.isArray(entry.traces) && entry.traces.length > 0) {
        entry.traces.forEach(function (tr) {
          if (tr && !tac.terrainTraces.some(function (x) { return x.id === tr.id; })) tac.terrainTraces.push(cloneTacData(tr));
        });
        renderTerrainTracesOnMaps(false);
      }
      tac.redoHistory.push(entry);
      showToast("Item apagado restaurado.");
    } else if (entry.type === "clear_snapshot" && entry.prev) {
      const snap = entry.prev;
      (snap.pins || []).forEach(function (pn) { upsertTacticalPin(cloneTacData(pn), false, true); });
      tac.drawStrokes = cloneTacData(snap.drawStrokes || []);
      renderFreehandStrokes(false);
      tac.breadcrumbs = cloneTacData(snap.breadcrumbs || []);
      renderBreadcrumbRoute(false);
      if (snap.circle && snap.circle.center) {
        renderCircleOnMaps(snap.circle.center.lng, snap.circle.center.lat, snap.circle.radius || 150, false, true);
      }
      tac.tacticalGeoms = cloneTacData(snap.tacticalGeoms || []);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      tac.flags = cloneTacData(snap.flags || []);
      renderFlagsOnMaps(false);
      tac.mapTexts = cloneTacData(snap.mapTexts || []);
      renderMapTextsOnMaps(false);
      tac.myTrailCoords = cloneTacData(snap.myTrailCoords || []);
      renderTrailsOnMaps(false);
      tac.terrainTraces = cloneTacData(snap.terrainTraces || []);
      renderTerrainTracesOnMaps(false);
      tac.floorplans = cloneTacData(snap.floorplans || []);
      renderFloorplansOnMaps(false);
      if (Array.isArray(snap.wasps) && snap.wasps.length > 0) {
        snap.wasps.forEach(function (w) { upsertWaspMarker(cloneTacData(w), true); });
        saveWaspsToStorage();
        if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: serializeWaspItems() });
      }
      syncWaspHudBar();
      tac.rulerCoords = cloneTacData(snap.rulerCoords || []);
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, null, "ruler");
      tac.redoHistory.push(entry);
      showToast("Mapa restaurado antes da limpeza.");
    }
    refreshLeftControls();
    renderEdgeIndicators();
  }

  function redoLastTacticalAction() {
    if (!Array.isArray(tac.redoHistory) || tac.redoHistory.length === 0) {
      showToast("Nada para refazer.");
      refreshLeftControls();
      return;
    }
    const entry = tac.redoHistory.pop();
    if (!Array.isArray(tac.undoHistory)) tac.undoHistory = [];

    if (entry.type === "pin" && entry.pin) {
      upsertTacticalPin(entry.pin, false, true);
      tac.undoHistory.push(entry);
      showToast("Marcador refeito.");
    } else if (entry.type === "pin_edit" && entry.next) {
      upsertTacticalPin(cloneTacData(entry.next), false, true);
      tac.undoHistory.push(entry);
      showToast("Edição de marcador refeita.");
    } else if (entry.type === "del_trail") {
      tac.myTrailCoords = [];
      renderTrailsOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Remoção de rastro refeita.");
    } else if (entry.type === "trace" && entry.trace) {
      if (!tac.terrainTraces.some(function (t) { return t.id === entry.trace.id; })) {
        tac.terrainTraces.push(cloneTacData(entry.trace));
      }
      renderTerrainTracesOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Traçado refeito.");
    } else if (entry.type === "del_traces" && Array.isArray(entry.traces)) {
      const trIds = entry.traces.map(function (t) { return t.id; });
      tac.terrainTraces = tac.terrainTraces.filter(function (t) { return !trIds.includes(t.id); });
      renderTerrainTracesOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Remoção de traçado refeita.");
    } else if (entry.type === "trace_edit" && entry.next) {
      const tr = tac.terrainTraces.find(function (x) { return x.id === (entry.traceId || entry.id); });
      if (tr) Object.assign(tr, cloneTacData(entry.next));
      renderTerrainTracesOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Edição de traçado refeita.");
    } else if (entry.type === "fp_add" && entry.fp) {
      if (!(tac.floorplans || []).some(function (x) { return x.id === entry.fp.id; })) {
        tac.floorplans.push(cloneTacData(entry.fp));
      }
      tac.activeFloorplanId = entry.fp.id;
      if (!entry.fp.locked) tac.editingFloorplanId = entry.fp.id;
      renderFloorplansOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Planta refeita.");
    } else if (entry.type === "del_fps" && Array.isArray(entry.fps)) {
      const fpIds = entry.fps.map(function (f) { return f.id; });
      tac.floorplans = (tac.floorplans || []).filter(function (f) { return !fpIds.includes(f.id); });
      if (fpIds.includes(tac.activeFloorplanId)) tac.activeFloorplanId = null;
      if (fpIds.includes(tac.editingFloorplanId)) tac.editingFloorplanId = null;
      renderFloorplansOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Remoção de planta refeita.");
    } else if (entry.type === "fp_edit" && entry.next) {
      const fp = (tac.floorplans || []).find(function (x) { return x.id === (entry.fpId || entry.next.id); });
      if (fp) {
        Object.assign(fp, cloneTacData(entry.next));
        if (!fp.locked) tac.editingFloorplanId = fp.id;
        else if (tac.editingFloorplanId === fp.id) tac.editingFloorplanId = null;
      }
      renderFloorplansOnMaps(false);
      tac.undoHistory.push(entry);
      showToast("Ajuste de planta refeito.");
    } else if (entry.type === "del_pin" && entry.pin) {
      deletePinById(entry.pin.id, true);
      tac.undoHistory.push(entry);
      showToast("Remoção refeita.");
    } else if (entry.type === "stroke" && entry.stroke) {
      tac.drawStrokes.push(entry.stroke);
      tac.undoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Traço refeito.");
    } else if (entry.type === "stroke_edit" && entry.next) {
      const st = (tac.drawStrokes || []).find(function (s) { return s && s.id === entry.strokeId; });
      if (st) Object.assign(st, cloneTacData(entry.next));
      tac.undoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Edição de traço refeita.");
    } else if (entry.type === "del_strokes" && Array.isArray(entry.strokes)) {
      entry.strokes.forEach(function (it) {
        const ref = it && it.stroke ? it.stroke : it;
        const pos = tac.drawStrokes.findIndex(function (s) { return JSON.stringify(s) === JSON.stringify(ref); });
        if (pos !== -1) tac.drawStrokes.splice(pos, 1);
      });
      tac.undoHistory.push(entry);
      renderFreehandStrokes(false);
      showToast("Remoção de traço refeita.");
    } else if (entry.type === "ruler_pt" && entry.coord) {
      tac.rulerCoords.push(entry.coord);
      tac.undoHistory.push(entry);
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, null, "ruler");
      showToast("Ponto da régua refeito.");
    } else if (entry.type === "crumb" && entry.crumb) {
      tac.breadcrumbs.push(entry.crumb);
      tac.undoHistory.push(entry);
      renderBreadcrumbRoute(false);
      showToast("Migalha refeita.");
    } else if (entry.type === "del_crumbs" && Array.isArray(entry.crumbs)) {
      entry.crumbs.forEach(function (it) {
        const ref = it && it.crumb ? it.crumb : it;
        const pos = tac.breadcrumbs.findIndex(function (c) { return c.lat === ref.lat && c.lng === ref.lng; });
        if (pos !== -1) tac.breadcrumbs.splice(pos, 1);
      });
      tac.undoHistory.push(entry);
      renderBreadcrumbRoute(false);
      showToast("Remoção de migalha refeita.");
    } else if (entry.type === "geom" && entry.geom) {
      if (!tac.tacticalGeoms.some(function (g) { return g.id === entry.geom.id; })) {
        tac.tacticalGeoms.push(entry.geom);
      }
      tac.undoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Geometria refeita.");
    } else if (entry.type === "del_geoms" && Array.isArray(entry.geoms)) {
      const ids = entry.geoms.map(function (g) { return g.id; });
      tac.tacticalGeoms = tac.tacticalGeoms.filter(function (g) { return !ids.includes(g.id); });
      tac.undoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Remoção de geometria refeita.");
    } else if (entry.type === "geom_edit" && entry.next) {
      const g = tac.tacticalGeoms.find(function (x) { return x.id === entry.id; });
      if (g) Object.assign(g, entry.next);
      tac.undoHistory.push(entry);
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      showToast("Ajuste de geometria refeito.");
    } else if (entry.type === "circle") {
      if (entry.next && entry.next.center) {
        renderCircleOnMaps(entry.next.center.lng, entry.next.center.lat, entry.next.radius, false, true);
      } else {
        clearCircleFromMaps(false, true);
      }
      tac.undoHistory.push(entry);
      showToast("Perímetro refeito.");
    } else if (entry.type === "del_circle") {
      clearCircleFromMaps(false, true);
      tac.undoHistory.push(entry);
      showToast("Remoção de perímetro refeita.");
    } else if (entry.type === "flag" && entry.flag) {
      if (!tac.flags.some(function (f) { return f.id === entry.flag.id; })) {
        tac.flags.push(entry.flag);
      }
      tac.undoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Bandeira refeita.");
    } else if (entry.type === "del_flags" && Array.isArray(entry.flags)) {
      const fIds = entry.flags.map(function (f) { return f.id; });
      tac.flags = tac.flags.filter(function (f) { return !fIds.includes(f.id); });
      tac.undoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Remoção de bandeira refeita.");
    } else if (entry.type === "flag_edit" && entry.next) {
      const fl = tac.flags.find(function (x) { return x.id === entry.id; });
      if (fl) Object.assign(fl, entry.next);
      tac.undoHistory.push(entry);
      renderFlagsOnMaps(false);
      showToast("Edição de bandeira refeita.");
    } else if (entry.type === "wasp_add" && entry.wasp) {
      upsertWaspMarker(cloneTacData(entry.wasp), false);
      tac.undoHistory.push(entry);
      showToast("Ponto WASP refeito.");
    } else if (entry.type === "wasp_edit" && entry.next) {
      upsertWaspMarker(cloneTacData(entry.next), false);
      tac.undoHistory.push(entry);
      showToast("Status WASP refeito.");
    } else if (entry.type === "del_wasps" && Array.isArray(entry.wasps)) {
      const wIds = entry.wasps.map(function (w) { return w.id; });
      wIds.forEach(function (wid) { removeWaspMarkerById(wid, true); });
      if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: serializeWaspItems() });
      tac.undoHistory.push(entry);
      showToast("Remoção WASP refeita.");
    } else if (entry.type === "text" && entry.text) {
      if (!tac.mapTexts.some(function (t) { return t.id === entry.text.id; })) {
        tac.mapTexts.push(entry.text);
      }
      tac.undoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Texto refeito.");
    } else if (entry.type === "del_texts" && Array.isArray(entry.texts)) {
      const tIds = entry.texts.map(function (t) { return t.id; });
      tac.mapTexts = tac.mapTexts.filter(function (t) { return !tIds.includes(t.id); });
      tac.undoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Remoção de texto refeita.");
    } else if (entry.type === "text_edit" && entry.next) {
      const tx = tac.mapTexts.find(function (x) { return x.id === entry.id; });
      if (tx) Object.assign(tx, entry.next);
      tac.undoHistory.push(entry);
      renderMapTextsOnMaps(false);
      showToast("Edição de texto refeita.");
    } else if (entry.type === "erase_batch") {
      (entry.pins || []).forEach(function (pn) { deletePinById(pn.id, true); });
      (entry.strokes || []).forEach(function (it) {
        const ref = it && it.stroke ? it.stroke : it;
        const pos = tac.drawStrokes.findIndex(function (s) { return JSON.stringify(s) === JSON.stringify(ref); });
        if (pos !== -1) tac.drawStrokes.splice(pos, 1);
      });
      if ((entry.strokes || []).length > 0) renderFreehandStrokes(false);
      (entry.crumbs || []).forEach(function (it) {
        const ref = it && it.crumb ? it.crumb : it;
        const pos = tac.breadcrumbs.findIndex(function (c) { return c.lat === ref.lat && c.lng === ref.lng; });
        if (pos !== -1) tac.breadcrumbs.splice(pos, 1);
      });
      if ((entry.crumbs || []).length > 0) renderBreadcrumbRoute(false);
      if (entry.circle) clearCircleFromMaps(false, true);
      if ((entry.geoms || []).length > 0) {
        const gIds = entry.geoms.map(function (g) { return g.id; });
        tac.tacticalGeoms = tac.tacticalGeoms.filter(function (g) { return !gIds.includes(g.id); });
        renderTacticalGeomsOnMaps();
        if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: tac.tacticalGeoms });
      }
      if ((entry.flags || []).length > 0) {
        const fIds = entry.flags.map(function (f) { return f.id; });
        tac.flags = tac.flags.filter(function (f) { return !fIds.includes(f.id); });
        renderFlagsOnMaps(false);
      }
      if ((entry.texts || []).length > 0) {
        const tIds = entry.texts.map(function (t) { return t.id; });
        tac.mapTexts = tac.mapTexts.filter(function (t) { return !tIds.includes(t.id); });
        renderMapTextsOnMaps(false);
      }
      if (Array.isArray(entry.trail) && entry.trail.length >= 2) {
        tac.myTrailCoords = [];
        renderTrailsOnMaps(false);
      }
      if (Array.isArray(entry.traces) && entry.traces.length > 0) {
        const trIds = entry.traces.map(function (t) { return t.id; });
        tac.terrainTraces = tac.terrainTraces.filter(function (t) { return !trIds.includes(t.id); });
        renderTerrainTracesOnMaps(false);
      }
      if (Array.isArray(entry.wasps) && entry.wasps.length > 0) {
        entry.wasps.forEach(function (w) { removeWaspMarkerById(w.id, true); });
        if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: serializeWaspItems() });
      }
      tac.undoHistory.push(entry);
      showToast("Exclusão refeita.");
    } else if (entry.type === "clear_snapshot") {
      tac.pins.forEach(function (p) { p.markers.forEach(function (i) { i.marker.remove(); }); });
      tac.pins = [];
      tac.drawStrokes = [];
      tac.breadcrumbs = []; tac.activeCrumbIndex = -1;
      clearCrumbMarkers();
      tac.tacticalGeoms = [];
      renderTacticalGeomsOnMaps();
      if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: [] });
      tac.flags = [];
      renderFlagsOnMaps(false);
      tac.mapTexts = [];
      renderMapTextsOnMaps(false);
      tac.myTrailCoords = [];
      renderTrailsOnMaps(false);
      tac.terrainTraces = [];
      tac.activeTraceId = null;
      renderTerrainTracesOnMaps(false);
      tac.floorplans = [];
      tac.activeFloorplanId = null;
      tac.editingFloorplanId = null;
      renderFloorplansOnMaps(false);
      (tac.waspItems || []).forEach(function (w) { (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} }); });
      tac.waspItems = [];
      saveWaspsToStorage();
      syncWaspHudBar();
      if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: [] });
      clearCircleFromMaps(false, true);
      tac.rulerCoords = [];
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", [], "#22C55E", true, null, "ruler");
      renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", [], "#38BDF8", false);
      renderFreehandStrokes(false);
      tac.undoHistory.push(entry);
      showToast("Limpeza do mapa refeita.");
    }
    refreshLeftControls();
    renderEdgeIndicators();
  }

  /* =====================================================================
     FOTO + CANETA TELESTRATION
     ===================================================================== */
  function loadImageToCanvas(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = new Image();
      img.onload = function () {
        const c = document.getElementById("azPhotoTelestrateCanvas");
        if (!c) return;
        const sc = Math.min(420 / img.width, 260 / img.height);
        c.width = Math.round(img.width * sc);
        c.height = Math.round(img.height * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        c.style.display = "block";
        tac.hasTelestrationBase = true;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  (function () {
    const c = document.getElementById("azPhotoTelestrateCanvas");
    if (!c) return;
    let down = false;
    c.addEventListener("pointerdown", function (e) {
      down = true;
      const r = c.getBoundingClientRect();
      const ctx = c.getContext("2d");
      ctx.strokeStyle = getColorHex(tac.myColorId); ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo((e.clientX - r.left) * (c.width / r.width), (e.clientY - r.top) * (c.height / r.height));
    });
    c.addEventListener("pointermove", function (e) {
      if (!down) return;
      const r = c.getBoundingClientRect();
      const ctx = c.getContext("2d");
      ctx.lineTo((e.clientX - r.left) * (c.width / r.width), (e.clientY - r.top) * (c.height / r.height));
      ctx.stroke();
    });
    c.addEventListener("pointerup", function () { down = false; });
    c.addEventListener("pointercancel", function () { down = false; });
  })();

  function openPhotoModal(coords, flagRef) {
    tac.photoTargetFlag = flagRef || null;
    tac.hasTelestrationBase = false;
    document.getElementById("azPhotoTelestrateCanvas").style.display = "none";
    document.getElementById("azPhotoCaptionInput").value = flagRef && flagRef.photoCaption ? flagRef.photoCaption : "";
    const cInp = document.getElementById("azPhotoCoordInput");
    if (flagRef) cInp.value = `${flagRef.lat.toFixed(6)}, ${flagRef.lng.toFixed(6)}`;
    else if (coords) cInp.value = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    else if (tac.myPos) cInp.value = `${tac.myPos.lat.toFixed(6)}, ${tac.myPos.lng.toFixed(6)}`;
    else cInp.value = "";
    document.getElementById("azPhotoPinModal").classList.add("is-open");
  }

  /* =====================================================================
     MAPA, CANETA, BORRACHA & MIGALHAS DE PÃO
     ===================================================================== */
  function registerCapturedMap(mapInst) {
    if (!mapInst || typeof mapInst.unproject !== "function" || typeof mapInst.getContainer !== "function") return;
    if (!tac.maps.includes(mapInst)) {
      tac.maps.push(mapInst);
      bindSingleMap(mapInst);
      if (tac.satMode) applySatelliteLayer(mapInst, true);
      tac.pins.forEach(function (p) { attachPinToMap(p, mapInst); });
      Object.values(tac.teammates).forEach(function (m) { renderMateOnMap(m, mapInst); });
      if (tac.breadcrumbs.length > 0) renderBreadcrumbRoute(true);
      if (tac.flags.length > 0) renderFlagsOnMaps(true);
      if (tac.mapTexts && tac.mapTexts.length > 0) renderMapTextsOnMaps(true);
      restoreSavedPinsFromStorage();
      if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
      restoreDrawStrokesFromStorage();
      restoreTerrainTracesFromStorage();
      restoreFloorplansFromStorage();
      restoreWaspsFromStorage();
      if (!mapInst._azTraceClickBound) {
        mapInst._azTraceClickBound = true;
        mapInst.on("click", function (e) {
          if (tac.drawActive || tac.eraserActive || tac.rulerActive || tac.crumbRouteActive || tac.toolMode) return;
          const trcLayers = ["az-trc-escada-base", "az-trc-escada-steps", "az-trc-beco-bg", "az-trc-beco-dash", "az-trc-cerca-base", "az-trc-cerca-posts", "az-trc-barricada-bg", "az-trc-barricada-top"].filter(function (lid) { return Boolean(mapInst.getLayer(lid)); });
          if (trcLayers.length > 0) {
            const feats = mapInst.queryRenderedFeatures(e.point, { layers: trcLayers });
            if (feats && feats.length > 0 && feats[0].properties && feats[0].properties.id) {
              const trcId = feats[0].properties.id;
              const trc = (tac.terrainTraces || []).find(function (x) { return x.id === trcId; });
              if (trc) {
                if (typeof openTraceDetailModal === "function") {
                  openTraceDetailModal(trc);
                } else {
                  tac.activeTraceId = tac.activeTraceId === trc.id ? null : trc.id;
                  renderTerrainTracesOnMaps(true);
                  showToast(`${trc.label} • ${trc.distanceM}m (${tac.activeTraceId ? "vértices liberados" : "edição fechada"})`);
                }
                return;
              }
            }
          }
          // Toque em traço existente da Caneta -> Popover de espessura/cor/exclusão
          if (Array.isArray(tac.drawStrokes) && tac.drawStrokes.length > 0 && e.point) {
            let hitStroke = null;
            if (mapInst.getLayer("az-tac-draw-line")) {
              const sFeats = mapInst.queryRenderedFeatures(e.point, { layers: ["az-tac-draw-line"] });
              if (sFeats && sFeats.length > 0 && sFeats[0].properties && sFeats[0].properties.id) {
                hitStroke = tac.drawStrokes.find(function (s) { return s && s.id === sFeats[0].properties.id; }) || null;
              }
            }
            if (!hitStroke) {
              const sx = e.point.x, sy = e.point.y;
              const distSeg = function (px, py, x1, y1, x2, y2) {
                const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
                const t = l2 > 0 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2)) : 0;
                return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
              };
              let bestD = 16;
              tac.drawStrokes.forEach(function (s) {
                const cs = Array.isArray(s) ? s : (s && s.coords) || [];
                for (let i = 0; i < cs.length; i++) {
                  const p1 = mapInst.project(cs[i]);
                  const dPt = Math.hypot(p1.x - sx, p1.y - sy);
                  if (dPt < bestD) { bestD = dPt; hitStroke = s; }
                  if (i > 0) {
                    const p0 = mapInst.project(cs[i - 1]);
                    const dS = distSeg(sx, sy, p0.x, p0.y, p1.x, p1.y);
                    if (dS < bestD) { bestD = dS; hitStroke = s; }
                  }
                }
              });
            }
            if (hitStroke && typeof openStrokeEditPopover === "function") {
              openStrokeEditPopover(hitStroke);
              return;
            }
          }
          const pop = document.getElementById("azStrokeEditPopover");
          if (pop && pop.classList.contains("is-open")) {
            pop.classList.remove("is-open");
            tac.editingStrokeId = null;
          }
        });
      }
    }
  }

  function scanAndCaptureExistingMaps() {
    if (window.maplibregl && window.maplibregl.Map && !window.maplibregl.Map.prototype._azHooked) {
      const proto = window.maplibregl.Map.prototype;
      proto._azHooked = true;
      ["resize", "setCenter", "flyTo", "jumpTo"].forEach(function (fn) {
        if (typeof proto[fn] === "function") {
          const orig = proto[fn];
          proto[fn] = function () { registerCapturedMap(this); return orig.apply(this, arguments); };
        }
      });
    }
    if (tac.maps.length > 0) return;
    for (const k of Object.keys(window)) {
      try {
        const v = window[k];
        if (v && typeof v === "object" && typeof v.unproject === "function" && typeof v.getCanvas === "function") registerCapturedMap(v);
      } catch (_) {}
    }
  }

  function getActiveMap() { return tac.maps[0] || null; }

  function bindSingleMap(map) {
    if (!map || map._azMapBound) return;
    map._azMapBound = true;
    const container = map.getContainer();

    let holdTimer = null, holdReady = false, sx = 0, sy = 0, downLngLat = null, isFreeDrawing = false, isErasing = false;
    const activePointers = new Set();
    const cancelHold = function () {
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      holdReady = false;
    };

    container.addEventListener("touchstart", function (ev) {
      if (ev.touches && ev.touches.length > 1) cancelHold();
    }, { passive: true, capture: true });
    container.addEventListener("contextmenu", function (ev) {
      ev.preventDefault();
    });
    if (typeof map.on === "function") {
      map.on("zoomstart", cancelHold);
      map.on("rotatestart", cancelHold);
      let _edgeRaf = 0;
      let _lastEdgeTs = 0;
      map.on("move", function () {
        const nowTs = Date.now();
        if (_edgeRaf || nowTs - _lastEdgeTs < 150) return;
        _edgeRaf = requestAnimationFrame(function () {
          _edgeRaf = 0;
          _lastEdgeTs = Date.now();
          renderEdgeIndicators();
        });
      });
    }

    container.addEventListener("pointerdown", function (ev) {
      activePointers.add(ev.pointerId);
      if (activePointers.size > 1 || ev.isPrimary === false) {
        cancelHold();
        return;
      }
      const r = container.getBoundingClientRect();
      const px = ev.clientX - r.left;
      const py = ev.clientY - r.top;
      const ll = map.unproject([px, py]);

      // Borracha ativa: apaga o que estiver sob o dedo
      if (tac.eraserActive) {
        ev.preventDefault();
        ev.stopPropagation();
        isErasing = true;
        eraseAtMapPoint(map, px, py, ll);
        return;
      }

      if (ev.target && ev.target.closest && ev.target.closest(".az-tac-pin, .az-crumb-pin, .az-flag-pin, .az-map-text-pin, .az-fp-handle, .az-wasp-pin, .az-geom-handle, .az-trace-mid-handle")) return;
      document.getElementById("azRadialWheel").classList.remove("is-open");
      if (!ll) return;

      if (tac.toolMode === "text_pick") {
        ev.preventDefault();
        ev.stopPropagation();
        tac.toolMode = null;
        refreshLeftControls();
        openMapTextComposer({ lat: ll.lat, lng: ll.lng }, ev.clientX, ev.clientY, null);
        return;
      }

      if (tac.toolMode && tac.toolMode.startsWith("trace_")) {
        const kind = tac.toolMode.slice(6);
        const meta = TERRAIN_TRACE_META[kind] || TERRAIN_TRACE_META.beco;
        let trc = tac.activeTraceId ? (tac.terrainTraces || []).find(function (t) { return t.id === tac.activeTraceId; }) : null;
        if (!trc || trc.kind !== kind) {
          tac.traceCounter = (tac.traceCounter || 0) + 1;
          trc = {
            id: "trc_" + Date.now() + "_" + tac.traceCounter,
            kind: kind,
            label: meta.prefix + " " + tac.traceCounter,
            coords: [[ll.lng, ll.lat]],
            distanceM: 0,
            color: kind === "barricada" ? "#EF4444" : getColorHex(tac.myColorId),
            tags: [],
            notes: ""
          };
          tac.terrainTraces.push(trc);
          tac.activeTraceId = trc.id;
          pushUndoAction({ type: "trace", trace: cloneTacData(trc) });
        } else {
          trc.coords.push([ll.lng, ll.lat]);
        }
        renderTerrainTracesOnMaps(false);
        refreshLeftControls();
        showToast(`${trc.label}: ${trc.coords.length} pts • ${trc.distanceM}m (abra o menu p/ soltar)`);
        return;
      }

      // Caneta livre: inicia novo traço separado na cor e grossura selecionadas
      if (tac.drawActive) {
        ev.preventDefault();
        ev.stopPropagation();
        isFreeDrawing = true;
        const wPx = Math.max(2, Math.min(16, Number(tac.penWidth) || 4));
        tac.drawStrokes.push({
          id: "stk_" + Date.now() + "_" + Math.random().toString(36).slice(2, 5),
          coords: [[ll.lng, ll.lat]],
          color: getColorHex(tac.myColorId),
          width: wPx,
          strokeWidth: wPx
        });
        renderFreehandStrokes(false, true);
        return;
      }

      // Desenhar Rota (Migalhas de Pão)
      if (tac.crumbRouteActive) {
        const crumbObj = { lng: ll.lng, lat: ll.lat };
        tac.breadcrumbs.push(crumbObj);
        pushUndoAction({ type: "crumb", crumb: crumbObj });
        renderBreadcrumbRoute(false);
        showToast(`Migalha M${tac.breadcrumbs.length} marcada`);
        return;
      }

      if (tac.toolMode === "flag_pick") {
        tac.toolMode = null;
        tac.flagCounter = (tac.flagCounter || 0) + 1;
        const newFlag = {
          id: "flag_" + Date.now(),
          label: "BANDEIRA " + tac.flagCounter,
          lat: ll.lat,
          lng: ll.lng,
          radiusM: 45,
          color: getColorHex(tac.myColorId)
        };
        tac.flags.push(newFlag);
        pushUndoAction({ type: "flag", flag: newFlag });
        renderFlagsOnMaps(false);
        refreshLeftControls();
        showToast(`${newFlag.label} fixada (vibra ao passar em ${newFlag.radiusM}m).`);
        return;
      }

      if (tac.toolMode === "grg_home_pick") {
        tac.toolMode = null;
        refreshLeftControls();
        if (!tac.grgConfig) {
          showToast("Gere uma grade GRG primeiro.");
          return;
        }
        const pickedCode = findGrgCodeAtLatLng(tac.grgConfig, ll.lat, ll.lng);
        if (!pickedCode) {
          showToast("Toque dentro de um quadrante da grade GRG.");
          return;
        }
        tac.grgHomeCode = pickedCode;
        localStorage.setItem("az_tac_grg_home", pickedCode);
        renderGrgGridOnMaps(tac.grgConfig);
        if (tac.roomCode) broadcastPacket({ kind: "grg_sync", cfg: tac.grgConfig, homeCode: tac.grgHomeCode });
        showToast(`Quadrante ${pickedCode} definido como CASA (DENTRO DO LOCAL).`);
        return;
      }

      if (tac.toolMode === "pin_edit" || tac.toolMode === "vtr_pin") {
        const defType = tac.toolMode === "vtr_pin" ? "vtr" : "custom";
        tac.toolMode = null;
        refreshLeftControls();
        openPinEditorModal(null, { lng: ll.lng, lat: ll.lat }, defType);
        return;
      }
      if (tac.toolMode === "wasp_pick") {
        tac.waspCounter = (tac.waspCounter || 0) + 1;
        const wCode = "W" + tac.waspCounter;
        const createdWasp = {
          id: "wasp_" + Date.now() + "_" + tac.waspCounter,
          code: wCode,
          lat: ll.lat,
          lng: ll.lng,
          state: "pending",
          note: "",
          qra: tac.myQra || "OP",
          updatedAtStr: formatWaspStampNow(),
          floorplanId: tac.activeFloorplanId || ""
        };
        upsertWaspMarker(createdWasp, false);
        pushUndoAction({ type: "wasp_add", wasp: cloneTacData(createdWasp) });
        refreshLeftControls();
        vibratePattern(30);
        showToast(`${wCode} marcado (1 toque muda status • lápis abre nota).`);
        return;
      }
      if (tac.toolMode === "bloodhound_pick") {
        tac.toolMode = null;
        refreshLeftControls();
        setBloodhoundTarget({
          type: "point",
          id: "bh_" + Date.now(),
          label: `${ll.lat.toFixed(5)}, ${ll.lng.toFixed(5)}`,
          lat: ll.lat,
          lng: ll.lng
        });
        showToast("K9 travado no ponto.");
        return;
      }
      if (tac.toolMode === "gpe") {
        tac.toolMode = null;
        refreshLeftControls();
        upsertTacticalPin({ id: "gpe_" + Date.now(), type: "gpe", label: "[PRIO] PRIORIDADE", rawTitle: "PRIORIDADE", colorHex: getColorHex(tac.myColorId), lng: ll.lng, lat: ll.lat }, false);
        return;
      }
      if (tac.toolMode === "circle_pick") {
        tac.toolMode = null;
        refreshLeftControls();
        renderCircleOnMaps(ll.lng, ll.lat, tac.circleRadius, false);
        document.getElementById("azCircleRadiusPad").classList.add("is-open");
        return;
      }
      if (tac.rulerActive) {
        const rPt = [ll.lng, ll.lat];
        tac.rulerCoords.push(rPt);
        pushUndoAction({ type: "ruler_pt", coord: rPt });
        if (tac.rulerCoords.length >= 2) {
          let total = 0;
          for (let i = 1; i < tac.rulerCoords.length; i++) {
            total += calcDistAndBearing(tac.rulerCoords[i - 1][1], tac.rulerCoords[i - 1][0], tac.rulerCoords[i][1], tac.rulerCoords[i][0]).dist;
          }
          renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", tac.rulerCoords, "#22C55E", true, `RÉGUA: ${formatDistance(total)}`, "ruler");
        } else {
          refreshLeftControls();
          showToast("Régua: Ponto 1 fixado.");
        }
        return;
      }

      holdReady = false;
      sx = ev.clientX; sy = ev.clientY; downLngLat = ll;
      const clientXSnap = ev.clientX;
      const clientYSnap = ev.clientY;
      holdTimer = setTimeout(function () {
        holdTimer = null;
        if (activePointers.size > 1) return;
        holdReady = true;
        vibratePattern(40);
        tac.wheelMode = "new_press";
        tac.pendingPinCoords = { lng: downLngLat.lng, lat: downLngLat.lat };
        openRadialWheelAt(clientXSnap, clientYSnap, "new_press");
      }, 420);
    }, true);

    container.addEventListener("pointermove", function (ev) {
      if (isErasing && tac.eraserActive) {
        ev.preventDefault();
        ev.stopPropagation();
        const r = container.getBoundingClientRect();
        const px = ev.clientX - r.left;
        const py = ev.clientY - r.top;
        eraseAtMapPoint(map, px, py, map.unproject([px, py]));
        return;
      }
      if (isFreeDrawing && tac.drawActive) {
        ev.preventDefault();
        ev.stopPropagation();
        const r = container.getBoundingClientRect();
        const ll = map.unproject([ev.clientX - r.left, ev.clientY - r.top]);
        if (ll && tac.drawStrokes.length > 0) {
          const curStroke = tac.drawStrokes[tac.drawStrokes.length - 1];
          if (Array.isArray(curStroke)) curStroke.push([ll.lng, ll.lat]);
          else if (curStroke && Array.isArray(curStroke.coords)) curStroke.coords.push([ll.lng, ll.lat]);
          renderFreehandStrokes(false, true);
        }
        return;
      }
      if (activePointers.size > 1 || (holdTimer && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 20)) {
        cancelHold();
      }
    }, true);

    container.addEventListener("pointerup", function (ev) {
      activePointers.delete(ev.pointerId);
      if (isErasing) { isErasing = false; return; }
      if (isFreeDrawing) {
        isFreeDrawing = false;
        if (tac.drawStrokes.length > 0) {
          pushUndoAction({ type: "stroke", stroke: tac.drawStrokes[tac.drawStrokes.length - 1] });
        }
        renderFreehandStrokes(false);
        return;
      }
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      if (activePointers.size > 0) { holdReady = false; return; }
      holdReady = false;
    }, true);

    container.addEventListener("pointercancel", function (ev) {
      activePointers.delete(ev.pointerId);
      isErasing = false;
      isFreeDrawing = false;
      cancelHold();
    }, true);
  }

  function attachPinToMap(pinObj, mapInst) {
    if (!mapInst || !window.maplibregl) return;
    const el = document.createElement("div");
    el.className = "az-tac-pin" + (pinObj.type === "gpe" ? " is-gpe" : pinObj.type === "photo_pin" ? " is-photo-pin" : "") + (pinObj.isGhost ? " is-ghost" : "");
    const initSmartPin = resolveSmartDisplayColor(pinObj.colorHex || "#C5A869", "pin");
    el.style.setProperty("--pin-color", initSmartPin);
    el.style.setProperty("--pin-text-color", getRelativeLuminance(initSmartPin) > 0.42 ? "#0D0D0D" : "#FFFFFF");
    el.innerHTML = buildPinVisualHtml(pinObj, initSmartPin);
    const marker = new window.maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([pinObj.lng, pinObj.lat]).addTo(mapInst);
    pinObj.markers.push({ marker: marker, el: el });

    function syncDraggedPin(isEnd) {
      const ll = marker.getLngLat();
      if (!ll) return;
      pinObj.lat = ll.lat;
      pinObj.lng = ll.lng;
      pinObj.markers.forEach(function (it) {
        if (it.marker && it.marker !== marker) it.marker.setLngLat([pinObj.lng, pinObj.lat]);
      });
      if (tac.fineTunePin === pinObj) updateRemoteCoordReadout();
      if (tac.bloodhoundTarget && tac.bloodhoundTarget.type === "pin" && tac.bloodhoundTarget.id === pinObj.id) {
        updateBloodhoundVector();
      }
      if (isEnd) renderEdgeIndicators();
    }
    marker.on("drag", function () { syncDraggedPin(false); });
    marker.on("dragend", function () { syncDraggedPin(true); });

    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (tac.eraserActive && !pinObj.isGhost) {
        deletePinById(pinObj.id);
        return;
      }
      if (pinObj.isGhost) {
        showToast(`Última posição: ${pinObj.lat.toFixed(5)}, ${pinObj.lng.toFixed(5)} • ${pinObj.lastSeenStr || ""}`, 4500);
        return;
      }
      if (pinObj.type === "photo_pin") {
        tac.activePin = pinObj;
        document.getElementById("azPhotoViewerTitle").textContent = pinObj.label;
        document.getElementById("azPhotoViewerCaption").textContent = pinObj.rawTitle || "";
        document.getElementById("azPhotoViewerCoords").textContent = `${pinObj.lat.toFixed(6)}, ${pinObj.lng.toFixed(6)}`;
        const img = document.getElementById("azPhotoViewerImg");
        if (pinObj.photoUrl) { img.src = pinObj.photoUrl; img.style.display = "block"; } else img.style.display = "none";
        document.getElementById("azPhotoViewerModal").classList.add("is-open");
        return;
      }
      tac.activePin = pinObj;
      tac.wheelMode = "existing_pin";
      openRadialWheelAt(ev.clientX, ev.clientY, "existing_pin");
    });
  }

  function upsertTacticalPin(data, fromSync, skipHistory) {
    scanAndCaptureExistingMaps();
    if (tac.maps.length === 0 || !window.maplibregl) return;
    const ex = tac.pins.find(function (p) { return p.id === data.id; });
    if (ex) {
      Object.assign(ex, data);
      const smartCol = resolveSmartDisplayColor(ex.colorHex || "#C5A869", "pin");
      const smartTxtCol = getRelativeLuminance(smartCol) > 0.42 ? "#0D0D0D" : "#FFFFFF";
      ex.markers.forEach(function (i) {
        i.marker.setLngLat([data.lng, data.lat]);
        if (i.el) {
          i.el.className = "az-tac-pin" + (ex.type === "gpe" ? " is-gpe" : ex.type === "photo_pin" ? " is-photo-pin" : "") + (ex.isGhost ? " is-ghost" : "");
          i.el.style.setProperty("--pin-color", smartCol);
          i.el.style.setProperty("--pin-text-color", smartTxtCol);
          i.el.innerHTML = buildPinVisualHtml(ex, smartCol);
        }
      });
    } else {
      const obj = Object.assign({}, data, { markers: [] });
      tac.maps.forEach(function (m) { attachPinToMap(obj, m); });
      tac.pins.push(obj);
      if (!data.isGhost && !fromSync && !skipHistory) pushUndoAction({ type: "pin", pinId: data.id });
    }
    savePinsToStorage();
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
    refreshLeftControls();
    if (Array.isArray(tac.bloodhoundList)) {
      const bhItem = tac.bloodhoundList.find(function (t) { return t.id === data.id; });
      if (bhItem) {
        bhItem.lat = data.lat;
        bhItem.lng = data.lng;
        if (data.label) bhItem.label = data.label;
      }
    }
    if (tac.bloodhoundTarget && tac.bloodhoundTarget.type === "pin" && tac.bloodhoundTarget.id === data.id) {
      updateBloodhoundVector();
    }
    renderEdgeIndicators();
    if (fromSync) {
      vibratePattern([180, 90, 180]);
      showToast(`PONTO: ${data.label}`, 3400, data.type === "gpe");
    } else {
      vibratePattern(35);
      broadcastPacket({ kind: "pin", pin: { id: data.id, type: data.type, label: data.label, rawTitle: data.rawTitle, colorHex: data.colorHex, iconId: data.iconId || "padrao", camAngleDeg: data.camAngleDeg || 0, photoUrl: data.photoUrl || "", lng: data.lng, lat: data.lat } });
      showToast(`Marcado: ${data.label}`);
    }
  }

  function removeGhostForUid(uid) {
    if (!uid) return;
    for (let i = tac.pins.length - 1; i >= 0; i--) {
      const p = tac.pins[i];
      if (p && p.isGhost && p.id === "ghost_" + uid) {
        p.markers.forEach(function (it) { it.marker.remove(); });
        tac.pins.splice(i, 1);
      }
    }
  }

  function getSignalVisuals(mate) {
    const ageSec = Math.max(0, Math.round((Date.now() - (mate.ts || Date.now())) / 1000));
    if (ageSec < 12) return { color: "#4ADE80", opacity: "0.95", speed: "1.1s", label: "FORTE (3 ONDAS)" };
    if (ageSec < 35) return { color: "#F59E0B", opacity: "0.65", speed: "1.7s", label: "MÉDIO (2 ONDAS)" };
    return { color: "#EF4444", opacity: "0.35", speed: "2.4s", label: "FRACO (1 ONDA)" };
  }

  function renderMateOnMap(mate, mapInst) {
    if (!mapInst || !window.maplibregl) return;
    removeGhostForUid(mate.uid);
    const hex = getColorHex(mate.colorId);
    const heading = typeof mate.heading === "number" ? mate.heading : 0;
    const sig = getSignalVisuals(mate);
    const effStatus = isLatLngInGrgHome(mate.lat, mate.lng) ? "DENTRO DO LOCAL" : (mate.status || "EM PATRULHA");
    const showPill = effStatus && effStatus !== "EM PATRULHA";
    let ex = mate.markers.find(function (i) { return i.map === mapInst; });
    if (ex) {
      ex.marker.setLngLat([mate.lng, mate.lat]);
      ex.el.style.setProperty("--mate-heading", `${heading}deg`);
      ex.el.style.setProperty("--sig-color", sig.color);
      ex.el.style.setProperty("--sig-opacity", sig.opacity);
      ex.el.style.setProperty("--sig-speed", sig.speed);
      const pillEl = ex.el.querySelector(".az-mate-status-pill");
      if (pillEl) {
        pillEl.textContent = effStatus;
        pillEl.style.display = showPill ? "block" : "none";
      }
      return;
    }
    const el = document.createElement("div");
    el.className = "az-tac-pin";
    el.style.setProperty("--pin-color", hex);
    el.style.setProperty("--pin-text-color", getRelativeLuminance(hex) > 0.42 ? "#0D0D0D" : "#FFFFFF");
    el.style.setProperty("--mate-heading", `${heading}deg`);
    el.style.setProperty("--sig-color", sig.color);
    el.style.setProperty("--sig-opacity", sig.opacity);
    el.style.setProperty("--sig-speed", sig.speed);
    el.innerHTML =
      `<div class="az-tac-pin-badge">${mate.qra}<span class="az-mate-status-pill" style="display:${showPill ? "block" : "none"};">${effStatus}</span></div>` +
      `<div class="az-mate-arrow-wrap">` +
        `<div class="az-sig-wave"></div>` +
        `<div class="az-sig-wave is-w2"></div>` +
        `<div class="az-sig-wave is-w3"></div>` +
        `<div class="az-mate-arrow-svg"></div>` +
      `</div>`;
    el.addEventListener("click", function (ev) {
      ev.stopPropagation();
      openMateInspector(mate);
    });
    const marker = new window.maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([mate.lng, mate.lat]).addTo(mapInst);
    mate.markers.push({ map: mapInst, marker: marker, el: el });
  }

  // Inspeção do Aliado com Status Operacional, Distância em m/km, Bateria e Sinal
  function renderMateInspectorContent() {
    const modal = document.getElementById("azMateInspectModal");
    const body = document.getElementById("azMateInspectBody");
    if (!modal || !body || !modal.classList.contains("is-open")) return;
    const mate = tac.teammates[tac.selectedMateUid];
    if (!mate) return;

    const ageSec = Math.max(0, Math.round((Date.now() - (mate.ts || Date.now())) / 1000));
    const staticSec = Math.max(0, Math.round((Date.now() - (mate.staticSince || mate.ts || Date.now())) / 1000));
    const sig = getSignalVisuals(mate);
    const batStr = typeof mate.batteryPct === "number" ? `${mate.batteryPct}%` : "Aguardando leitura...";
    const mateStatus = isLatLngInGrgHome(mate.lat, mate.lng) ? "DENTRO DO LOCAL" : (mate.status || "EM PATRULHA");
    const stCol = mateStatus === "ABORDANDO" ? "#EF4444" : (mateStatus === "DENTRO DO LOCAL" ? "#4ADE80" : "#C5A869");

    let distStr = "Aguardando seu GPS...";
    if (tac.myPos) {
      const db = calcDistAndBearing(tac.myPos.lat, tac.myPos.lng, mate.lat, mate.lng);
      distStr = `${formatDistance(db.dist)} (${db.bearing}°)`;
    }

    document.getElementById("azMateInspectTitle").textContent = `OPERADOR • ${mate.qra}`;
    body.innerHTML =
      `Status: <strong style="color:${stCol};">${mateStatus}</strong><br>` +
      `Distância: <strong>${distStr}</strong><br>` +
      `Sinal: <strong>${sig.label}</strong> (${ageSec}s)<br>` +
      `Bateria real: <strong>${batStr}</strong><br>` +
      `Estático há: <strong>${staticSec}s</strong><br>` +
      `Coord: <code>${mate.lat.toFixed(5)}, ${mate.lng.toFixed(5)}</code>`;
    const audioBtn = document.getElementById("azMateRemoveAudioBtn");
    if (audioBtn) {
      const blk = tac.audioBlockedUids && tac.audioBlockedUids.has(mate.uid);
      audioBtn.textContent = blk ? "READMITIR NO CANAL DE ÁUDIO" : "REMOVER DO CANAL DE ÁUDIO";
      audioBtn.classList.toggle("is-danger", !blk);
      audioBtn.classList.toggle("is-active", blk);
    }
  }

  function openMateInspector(mate) {
    tac.selectedMateUid = mate.uid;
    document.getElementById("azMateInspectModal").classList.add("is-open");
    renderMateInspectorContent();
  }

  /* =====================================================================
     REDE MQTT + BATERIA REAL + PACOTES JSON E BINÁRIOS
     ===================================================================== */
  function xorCipher(s, k) {
    if (!k) return s;
    let o = "";
    for (let i = 0; i < s.length; i++) o += String.fromCharCode(s.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    return o;
  }
  function encodePayload(obj, k) { return btoa(xorCipher(unescape(encodeURIComponent(JSON.stringify(obj))), k || "AZIMUTE")); }
  function decodePayload(b64, k) { try { return JSON.parse(decodeURIComponent(escape(xorCipher(atob(b64), k || "AZIMUTE")))); } catch (_) { return null; } }
  function roomTopicHash(room) {
    let h = 2166136261;
    const s = "AZIMUTE_PMMG_" + room.toUpperCase().trim();
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16);
  }
  function mqttEncodeStr(str) { const enc = new TextEncoder().encode(str); return [enc.length >> 8, enc.length & 0xff, ...enc]; }
  function mqttEncodeVarLen(len) { const out = []; do { let b = len % 128; len = Math.floor(len / 128); if (len > 0) b |= 128; out.push(b); } while (len > 0); return out; }

  function renderOnlineMembersList() {
    const list = document.getElementById("azOnlineRosterList");
    const badge = document.getElementById("azLiveCountBadge");
    const mates = Object.values(tac.teammates).filter(function (m) {
      return m && !(tac.audioBlockedUids && tac.audioBlockedUids.has(m.uid));
    });
    const totalOnline = getRoomOnlineCount();
    if (badge) badge.textContent = `${totalOnline} ONLINE`;
    if (typeof syncSinglePttMode === "function") syncSinglePttMode();
    if (!list) return;
    if (mates.length === 0) {
      list.innerHTML = isLocalOnlineInRoom()
        ? `<div class="az-member-row" style="border-color:${getColorHex(tac.myColorId)};"><span>${tac.myQra || "VOCÊ"} (VOCÊ)</span><span>ONLINE</span></div>`
        : `<div style="font-size:9px;color:#78746A;">Nenhum membro online.</div>`;
      return;
    }
    list.innerHTML = mates.map(function (m) {
      const distBadge = tac.myPos ? formatDistance(calcDistAndBearing(tac.myPos.lat, tac.myPos.lng, m.lat, m.lng).dist) : "";
      const bat = typeof m.batteryPct === "number" ? `BAT ${m.batteryPct}%` : "";
      return `<div class="az-member-row" data-inspect-uid="${m.uid}" style="border-color:${getColorHex(m.colorId)};"><span>${m.qra}</span><span>${distBadge} ${bat}</span></div>`;
    }).join("");
    list.querySelectorAll("[data-inspect-uid]").forEach(function (el) {
      el.addEventListener("click", function () {
        const m = tac.teammates[el.getAttribute("data-inspect-uid")];
        if (m) openMateInspector(m);
      });
    });
  }

  function pruneStaleTeammates() {
    const now = Date.now();
    let changed = false;
    Object.keys(tac.teammates).forEach(function (uid) {
      const m = tac.teammates[uid];
      if (!m || (now - (m.ts || 0)) > 180000) {
        if (m && m.markers) {
          m.markers.forEach(function (item) { try { item.marker.remove(); } catch (_) {} });
        }
        delete tac.teammates[uid];
        changed = true;
      }
    });
    if (changed) {
      renderOnlineMembersList();
      if (typeof renderWaOnlineMembers === "function") renderWaOnlineMembers();
    }
  }
  setInterval(pruneStaleTeammates, 30000);

  function handleZombieSocketDetected(statusLabel) {
    clearTimeout(tac._enlaceEchoTimeout);
    tac._enlaceEchoTimeout = null;
    tac._pendingHbEchoId = "";
    tac.roomJoined = false;
    const st = document.getElementById("azLiveNetStatus");
    if (st) {
      st.textContent = statusLabel || "LINK TRAVADO / RECONECTANDO";
      st.style.color = "#EF4444";
    }
    if (tac.ws) {
      const dead = tac.ws;
      tac.ws = null;
      try { dead._manualClose = true; dead.close(); } catch (_) {}
    }
    renderOnlineMembersList();
    if (typeof syncWaGroupHeaderAndMembers === "function") window.AzTac.syncWaGroupHeaderAndMembers();
    syncSinglePttMode();

    const tries = Math.min((tac._mqttRetryCount || 0) + 1, 5);
    tac._mqttRetryCount = tries;
    const delay = Math.min(8000, tries * 1200);
    clearTimeout(tac._mqttReconnectTimer);
    tac._mqttReconnectTimer = setTimeout(function () {
      if (tac.roomCode && (!tac.ws || tac.ws.readyState !== 1)) connectLiveRoom();
    }, delay);
  }

  function runSilentHeartbeatEcho() {
    if (!tac.roomCode || !tac.ws || tac.ws.readyState !== 1) return;
    if (tac._enlaceEchoTimeout) return;
    const echoId = "hb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    tac._pendingHbEchoId = echoId;
    const okSent = broadcastPacket({ kind: "hb_echo", echoId: echoId });
    if (!okSent) {
      handleZombieSocketDetected("LINK TRAVADO / RECONECTANDO");
      return;
    }
    tac._enlaceEchoTimeout = setTimeout(function () {
      tac._enlaceEchoTimeout = null;
      if (tac._pendingHbEchoId === echoId) {
        handleZombieSocketDetected("LINK TRAVADO / RECONECTANDO");
      }
    }, 3800);
  }

  function connectLiveRoom() {
    if (!tac.roomCode) return;
    clearTimeout(tac._mqttReconnectTimer);
    clearInterval(tac._mqttPingTimer);
    clearInterval(tac._enlaceHeartbeatTimer);
    clearTimeout(tac._enlaceEchoTimeout);
    tac._enlaceEchoTimeout = null;
    tac._pendingHbEchoId = "";
    removeGhostForUid(tac.myId);
    if (tac.ws) {
      try { tac.ws._manualClose = true; tac.ws.close(); } catch (_) {}
      tac.ws = null;
    }
    const st = document.getElementById("azLiveNetStatus");
    if (st) { st.textContent = "CONECTANDO..."; st.style.color = "#F59E0B"; }
    const hash = roomTopicHash(tac.roomCode);
    const jsonTopic = "azimute/pmmg/turno/" + hash;
    const pcmTopic = "azimute/pmmg/pcm/" + hash;
    const clientId = "az_" + tac.myId + "_" + Math.floor(Math.random() * 999);
    try {
      const ws = new WebSocket("wss://broker.emqx.io:8084/mqtt", "mqtt");
      ws.binaryType = "arraybuffer";
      tac.ws = ws;
      ws.onopen = function () {
        tac._mqttRetryCount = 0;
        const rem = [0x00, 0x04, 77, 81, 84, 84, 0x04, 0x02, 0x00, 0x3c].concat(mqttEncodeStr(clientId));
        ws.send(new Uint8Array([0x10, ...mqttEncodeVarLen(rem.length), ...rem]));
        setTimeout(function () {
          if (ws.readyState !== 1) return;
          const sub1 = [0x00, 0x01, ...mqttEncodeStr(jsonTopic), 0x00];
          ws.send(new Uint8Array([0x82, ...mqttEncodeVarLen(sub1.length), ...sub1]));
          const sub2 = [0x00, 0x02, ...mqttEncodeStr(pcmTopic), 0x00];
          ws.send(new Uint8Array([0x82, ...mqttEncodeVarLen(sub2.length), ...sub2]));

          clearInterval(tac._mqttPingTimer);
          tac._mqttPingTimer = setInterval(function () {
            if (tac.ws && tac.ws.readyState === 1) {
              try { tac.ws.send(new Uint8Array([0xC0, 0x00])); } catch (_) {}
            }
          }, 25000);

          clearInterval(tac._enlaceHeartbeatTimer);
          tac._enlaceHeartbeatTimer = setInterval(runSilentHeartbeatEcho, 20000);

          tac.roomJoined = true;
          if (st) { st.textContent = `AO VIVO: ${tac.roomCode}`; st.style.color = "#4ADE80"; }
          renderOnlineMembersList();
          if (typeof syncWaGroupHeaderAndMembers === "function") window.AzTac.syncWaGroupHeaderAndMembers();
          if (typeof syncSinglePttMode === "function") syncSinglePttMode();
          if (tac.myPos) {
            broadcastPacket({ kind: "pos", lat: tac.myPos.lat, lng: tac.myPos.lng, colorId: tac.myColorId, batteryPct: tac.myBatteryPct, status: getEffectiveMyStatus() });
          }
          setTimeout(runSilentHeartbeatEcho, 900);
        }, 120);
      };
      ws.onmessage = function (ev) {
        const buf = new Uint8Array(ev.data);
        if (buf.length < 4 || (buf[0] & 0xf0) !== 0x30) return;
        let idx = 1; while (idx < buf.length && (buf[idx] & 0x80)) idx++; idx++;
        if (idx + 2 > buf.length) return;
        const tLen = (buf[idx] << 8) | buf[idx + 1];
        const topicStr = new TextDecoder().decode(buf.slice(idx + 2, idx + 2 + tLen));
        idx += 2 + tLen;
        if ((buf[0] & 0x06) > 0) idx += 2;
        if (idx >= buf.length) return;

        const payloadBytes = buf.slice(idx);
        if (topicStr.indexOf("/pcm/") !== -1) {
          playBinaryPcmFrame(payloadBytes);
          return;
        }
        const pkt = decodePayload(new TextDecoder().decode(payloadBytes), tac.roomCode);
        if (pkt) {
          if (pkt.uid === tac.myId) {
            if (pkt.kind === "hb_echo" && pkt.echoId && pkt.echoId === tac._pendingHbEchoId) {
              clearTimeout(tac._enlaceEchoTimeout);
              tac._enlaceEchoTimeout = null;
              tac._pendingHbEchoId = "";
              const netEl = document.getElementById("azLiveNetStatus");
              if (netEl && tac.roomCode) { netEl.textContent = `AO VIVO: ${tac.roomCode}`; netEl.style.color = "#4ADE80"; }
            } else if (pkt.kind === "enlace_ping" && tac.enlaceActivePing && pkt.pingId === tac.enlaceActivePing.pingId) {
              tac.enlaceActivePing.selfEchoMs = Math.max(1, Date.now() - tac.enlaceActivePing.sentAt);
              clearTimeout(tac.enlaceActivePing.selfTimer);
              if (typeof renderEnlaceResultsList === "function") renderEnlaceResultsList();
            }
            return;
          }
          handleIncomingPacket(pkt);
        }
      };
      ws.onerror = function () {
        if (st) { st.textContent = "OSCILAÇÃO DE REDE"; st.style.color = "#F87171"; }
      };
      ws.onclose = function () {
        clearInterval(tac._mqttPingTimer);
        clearInterval(tac._enlaceHeartbeatTimer);
        clearTimeout(tac._enlaceEchoTimeout);
        tac._enlaceEchoTimeout = null;
        tac.roomJoined = false;
        renderOnlineMembersList();
        if (typeof syncWaGroupHeaderAndMembers === "function") window.AzTac.syncWaGroupHeaderAndMembers();
        if (typeof syncSinglePttMode === "function") syncSinglePttMode();
        if (ws._manualClose || !tac.roomCode) return;
        if (st) { st.textContent = "RECONECTANDO..."; st.style.color = "#F59E0B"; }
        const tries = Math.min((tac._mqttRetryCount || 0) + 1, 5);
        tac._mqttRetryCount = tries;
        const delay = Math.min(15000, tries * 2500);
        clearTimeout(tac._mqttReconnectTimer);
        tac._mqttReconnectTimer = setTimeout(function () {
          if (tac.roomCode && (!tac.ws || tac.ws.readyState !== 1)) connectLiveRoom();
        }, delay);
      };
    } catch (_) {
      if (st) { st.textContent = "ERRO NA REDE"; st.style.color = "#F87171"; }
    }
  }
  window.addEventListener("online", function () {
    if (!tac.roomCode) return;
    if (!tac.ws || tac.ws.readyState !== 1) connectLiveRoom();
    else setTimeout(runSilentHeartbeatEcho, 250);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (tac.droneRaf) { cancelAnimationFrame(tac.droneRaf); tac.droneRaf = 0; }
      if (tac.reconRaf) { cancelAnimationFrame(tac.reconRaf); tac.reconRaf = 0; }
      if (tac._orbitRaf) { cancelAnimationFrame(tac._orbitRaf); tac._orbitRaf = 0; }
      return;
    }
    if (tac.droneMode && tac.droneFreeFlight && typeof stepDroneFlightLoop === "function") stepDroneFlightLoop();
    if (!tac.roomCode) return;
    if (!tac.ws || tac.ws.readyState !== 1) connectLiveRoom();
    else setTimeout(runSilentHeartbeatEcho, 250);
  });

  function broadcastPacket(pkt) {
    pkt.uid = tac.myId; pkt.qra = tac.myQra || "OPERADOR"; pkt.ts = Date.now();
    let sent = false;
    if (tac.bc && tac.roomCode) { tac.bc.postMessage({ room: tac.roomCode.toUpperCase(), data: encodePayload(pkt, tac.roomCode) }); sent = true; }
    if (tac.ws && tac.ws.readyState === 1 && tac.roomCode) {
      const topic = "azimute/pmmg/turno/" + roomTopicHash(tac.roomCode);
      const body = [...mqttEncodeStr(topic), ...new TextEncoder().encode(encodePayload(pkt, tac.roomCode))];
      tac.ws.send(new Uint8Array([0x30, ...mqttEncodeVarLen(body.length), ...body]));
      sent = true;
    }
    return sent;
  }

  async function handleIncomingPacket(pkt) {
    if (!pkt || pkt.uid === tac.myId) return;
    if (pkt.kind === "pos" && typeof pkt.lat === "number") {
      removeGhostForUid(pkt.uid);
      const prev = tac.teammates[pkt.uid];
      let heading = prev ? prev.heading : 0;
      let staticSince = prev ? prev.staticSince : Date.now();
      if (prev) {
        const d = calcDistAndBearing(prev.lat, prev.lng, pkt.lat, pkt.lng);
        if (d.dist > 2) { heading = d.bearing; staticSince = Date.now(); }
      }
      tac.teammates[pkt.uid] = {
        uid: pkt.uid,
        qra: pkt.qra,
        colorId: pkt.colorId || "ciano",
        lat: pkt.lat,
        lng: pkt.lng,
        heading: heading,
        status: pkt.status || (prev && prev.status) || "EM PATRULHA",
        staticSince: staticSince,
        batteryPct: typeof pkt.batteryPct === "number" ? pkt.batteryPct : (prev ? prev.batteryPct : null),
        ts: Date.now(),
        markers: prev ? prev.markers : []
      };
      tac.maps.forEach(function (m) { renderMateOnMap(tac.teammates[pkt.uid], m); });
      if (!tac.matePassivePegadas[pkt.uid]) {
        tac.matePassivePegadas[pkt.uid] = { qra: pkt.qra, colorId: pkt.colorId || "ciano", points: [] };
      } else {
        tac.matePassivePegadas[pkt.uid].qra = pkt.qra;
        tac.matePassivePegadas[pkt.uid].colorId = pkt.colorId || tac.matePassivePegadas[pkt.uid].colorId;
      }
      const addedMirror = appendPointToPegadasBuffer(tac.matePassivePegadas[pkt.uid].points, pkt.lat, pkt.lng, pkt.ts || Date.now());
      if (addedMirror && tac.visiblePegadasUids[pkt.uid]) renderPegadasOnMaps();
      renderOnlineMembersList();
      renderMateInspectorContent();
      updateBloodhoundVector();
      checkGeofenceProximityAlerts();
      if (typeof refreshDroneTargetsSelect === "function" && tac.droneMode) refreshDroneTargetsSelect();
      if (typeof followDroneTargetNow === "function" && tac.droneMode && !tac.droneFreeFlight && tac.droneFollowUid === pkt.uid) followDroneTargetNow(false);
    } else if (pkt.kind === "PEDIR_RASTRO") {
      if (!pkt.targetUid || pkt.targetUid === tac.myId) {
        broadcastPacket({
          kind: "DADOS_RASTRO",
          targetUid: pkt.uid,
          colorId: tac.myColorId,
          points: (tac.myPassivePegadas || []).slice(-160)
        });
      }
    } else if (pkt.kind === "DADOS_RASTRO" && Array.isArray(pkt.points)) {
      if (!pkt.targetUid || pkt.targetUid === tac.myId) {
        const cleanPts = pkt.points.filter(function (p) {
          return Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number";
        });
        tac.matePassivePegadas[pkt.uid] = {
          qra: pkt.qra || (tac.teammates[pkt.uid] && tac.teammates[pkt.uid].qra) || "ALIADO",
          colorId: pkt.colorId || (tac.teammates[pkt.uid] && tac.teammates[pkt.uid].colorId) || "ciano",
          points: cleanPts
        };
        if (tac.visiblePegadasUids[pkt.uid]) renderPegadasOnMaps();
        showToast(`Pegadas recebidas: ${cleanPts.length} pontos de ${tac.matePassivePegadas[pkt.uid].qra}`);
      }
    } else if (pkt.kind === "status_update") {
      if (tac.teammates[pkt.uid]) {
        tac.teammates[pkt.uid].status = pkt.status || "EM PATRULHA";
        tac.maps.forEach(function (m) { renderMateOnMap(tac.teammates[pkt.uid], m); });
        renderMateInspectorContent();
      }
    } else if (pkt.kind === "trail_sync" && Array.isArray(pkt.coords)) {
      tac.mateTrails[pkt.uid] = {
        coords: pkt.coords,
        colorHex: pkt.colorHex || getColorHex(pkt.colorId)
      };
      renderTrailsOnMaps(true);
    } else if (pkt.kind === "drone_pos") {
      if (!tac.teammateDrones) tac.teammateDrones = {};
      if (pkt.active && typeof pkt.lng === "number" && typeof pkt.lat === "number") {
        tac.teammateDrones[pkt.uid] = {
          uid: pkt.uid,
          qra: pkt.qra || pkt.uid,
          colorHex: pkt.colorHex || getColorHex(pkt.colorId),
          lng: pkt.lng,
          lat: pkt.lat,
          bearing: Number(pkt.bearing) || 0,
          ts: Date.now()
        };
      } else {
        delete tac.teammateDrones[pkt.uid];
      }
      if (typeof window.renderTeammateDronesOnMaps === "function") window.renderTeammateDronesOnMaps();
    } else if (pkt.kind === "grg_sync") {
      if (typeof pkt.homeCode === "string") {
        tac.grgHomeCode = pkt.homeCode;
        localStorage.setItem("az_tac_grg_home", tac.grgHomeCode);
      }
      renderGrgGridOnMaps(pkt.cfg || null);
    } else if (pkt.kind === "enlace_ping" && pkt.pingId) {
      const audioReady = Boolean(tac.audioCtx && tac.audioCtx.state === "running") && !tac.audioMuted;
      broadcastPacket({
        kind: "enlace_ack",
        pingId: pkt.pingId,
        targetUid: pkt.uid,
        colorId: tac.myColorId,
        batteryPct: tac.myBatteryPct,
        audioReady: audioReady
      });
    } else if (pkt.kind === "enlace_ack" && tac.enlaceActivePing && pkt.pingId === tac.enlaceActivePing.pingId) {
      const latMs = Math.max(1, Date.now() - tac.enlaceActivePing.sentAt);
      tac.enlaceActivePing.acks[pkt.uid] = {
        uid: pkt.uid,
        qra: pkt.qra || "ALIADO",
        colorId: pkt.colorId || (tac.teammates[pkt.uid] && tac.teammates[pkt.uid].colorId) || "ciano",
        latencyMs: latMs,
        batteryPct: typeof pkt.batteryPct === "number" ? pkt.batteryPct : (tac.teammates[pkt.uid] ? tac.teammates[pkt.uid].batteryPct : null),
        audioReady: Boolean(pkt.audioReady)
      };
      if (typeof renderEnlaceResultsList === "function") renderEnlaceResultsList();
    } else if (pkt.kind === "pinned_poll_start" && pkt.poll) {
      clearTimeout(tac._pinnedAutoCloseTimer);
      tac.activePinnedPoll = Object.assign({}, pkt.poll, { votes: pkt.poll.votes || {} });
      if (typeof renderPinnedPollBanner === "function") renderPinnedPollBanner();
      vibratePattern([160, 70, 160]);
      try { playTone(760, 1020, 0.15, 0.12); } catch (_) {}
      showToast(`MSG. FIXADA DE ${pkt.poll.authorQra || pkt.qra}: ${pkt.poll.question}`, 3800, true);
    } else if (pkt.kind === "pinned_poll_vote" && tac.activePinnedPoll && pkt.pollId === tac.activePinnedPoll.pollId) {
      tac.activePinnedPoll.votes[pkt.uid] = {
        uid: pkt.uid,
        qra: pkt.qra || "ALIADO",
        colorId: pkt.colorId || (tac.teammates[pkt.uid] && tac.teammates[pkt.uid].colorId) || "ciano",
        choice: pkt.choice
      };
      if (typeof renderPinnedPollBanner === "function") renderPinnedPollBanner();
      if (typeof checkPinnedPollAutoComplete === "function") checkPinnedPollAutoComplete();
    } else if (pkt.kind === "pinned_poll_close" && tac.activePinnedPoll && pkt.pollId === tac.activePinnedPoll.pollId) {
      if (typeof finalizeAndClosePinnedPoll === "function") finalizeAndClosePinnedPoll("remote_close");
    } else if (pkt.kind === "ptt_chunk" && pkt.audio) {
      enqueueWebmChunk(pkt.audio, pkt.qra, pkt.uid);
    } else if (pkt.kind === "rtc_offer" && pkt.targetUid === tac.myId && pkt.sdp) {
      if (tac.audioBlockedUids && tac.audioBlockedUids.has(pkt.uid)) return;
      try {
        const pc = getOrCreateRtcPeer(pkt.uid, pkt.qra);
        await pc.setRemoteDescription(new RTCSessionDescription(pkt.sdp));
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        broadcastPacket({ kind: "rtc_answer", targetUid: pkt.uid, sdp: ans });
      } catch (_) {}
    } else if (pkt.kind === "rtc_answer" && pkt.targetUid === tac.myId && pkt.sdp) {
      try {
        const pc = tac.rtcPeers[pkt.uid];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(pkt.sdp));
      } catch (_) {}
    } else if (pkt.kind === "rtc_ice" && pkt.targetUid === tac.myId && pkt.candidate) {
      try {
        const pc = tac.rtcPeers[pkt.uid];
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(pkt.candidate));
      } catch (_) {}
    } else if (pkt.kind === "rtc_tx_state") {
      if (tac.audioBlockedUids && tac.audioBlockedUids.has(pkt.uid)) return;
      setSpeakerBanner(pkt.qra, Boolean(pkt.speaking));
    } else if (pkt.kind === "audio_kick" && pkt.targetUid === tac.myId) {
      if (pkt.kicked) {
        if (tac.isRecordingPtt) stopSelectedPtt();
        if (tac.rtcPeers && tac.rtcPeers[pkt.uid]) {
          try { tac.rtcPeers[pkt.uid].close(); } catch (_) {}
          delete tac.rtcPeers[pkt.uid];
        }
        if (tac.audioBlockedUids) tac.audioBlockedUids.add(pkt.uid);
        showToast(`${pkt.qra || "OPERADOR"} removeu você do canal de áudio.`, 4000, true);
      } else {
        if (tac.audioBlockedUids) tac.audioBlockedUids.delete(pkt.uid);
        showToast(`${pkt.qra || "OPERADOR"} liberou seu canal de áudio.`);
      }
    } else if (pkt.kind === "run") {
      vibratePattern([180, 90, 180]);
      showToast(`ALERTA: ${pkt.qra} EM DESLOCAMENTO RÁPIDO (≥7 km/h)`, 3800);
    } else if (pkt.kind === "pin" && pkt.pin) {
      upsertTacticalPin(pkt.pin, true);
    } else if (pkt.kind === "wasp_sync" && pkt.item) {
      upsertWaspMarker(pkt.item, true);
      saveWaspsToStorage();
    } else if (pkt.kind === "wasp_sync_all" && Array.isArray(pkt.items)) {
      (tac.waspItems || []).forEach(function (w) { (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} }); });
      tac.waspItems = [];
      pkt.items.forEach(function (it) { upsertWaspMarker(it, true); });
      saveWaspsToStorage();
      syncWaspHudBar();
    } else if (pkt.kind === "geom_sync" && pkt.geom) {
      if (!pkt.targetUid || pkt.targetUid === "ALL" || pkt.targetUid === tac.myId) {
        tac.tacticalGeoms.push(pkt.geom);
        renderTacticalGeomsOnMaps();
        showToast(`GEOMETRIA RECEBIDA: ${pkt.geom.label}`);
      }
    } else if (pkt.kind === "geom_sync_all" && Array.isArray(pkt.geoms)) {
      tac.tacticalGeoms = pkt.geoms;
      renderTacticalGeomsOnMaps();
    } else if (pkt.kind === "flags_sync_all" && Array.isArray(pkt.flags)) {
      tac.flags = pkt.flags;
      renderFlagsOnMaps(true);
    } else if (pkt.kind === "texts_sync_all" && Array.isArray(pkt.texts)) {
      tac.mapTexts = pkt.texts;
      renderMapTextsOnMaps(true);
    } else if (pkt.kind === "traces_sync_all" && Array.isArray(pkt.traces)) {
      tac.terrainTraces = pkt.traces;
      saveTerrainTracesToStorage();
      renderTerrainTracesOnMaps(true, true);
    } else if (pkt.kind === "floorplans_sync_all" && Array.isArray(pkt.floorplans)) {
      tac.floorplans = pkt.floorplans;
      saveFloorplansToStorage();
      renderFloorplansOnMaps(true, true);
    } else if (pkt.kind === "del_pin" && pkt.pinId) {
      deletePinById(pkt.pinId, true);
    } else if (pkt.kind === "circle") {
      renderCircleOnMaps(pkt.lng, pkt.lat, pkt.radius, true);
    } else if (pkt.kind === "clear_circle") {
      clearCircleFromMaps(true);
    } else if (pkt.kind === "ruler") {
      renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", pkt.coords || [], "#22C55E", true);
    } else if (pkt.kind === "draw_strokes") {
      tac.drawStrokes = Array.isArray(pkt.strokes) ? pkt.strokes : [];
      renderFreehandStrokes(true);
    } else if (pkt.kind === "crumb_route") {
      tac.breadcrumbs = Array.isArray(pkt.crumbs) ? pkt.crumbs : [];
      renderBreadcrumbRoute(true);
    } else if (pkt.kind === "msg" && pkt.text) {
      vibratePattern([180, 80, 180]);
      showToast(`[${pkt.qra}]: ${pkt.text}`, 4200);
      speakReceivedTacticalText(`${pkt.qra}: ${pkt.text}`);
    } else if (pkt.kind === "leave") {
      const mate = tac.teammates[pkt.uid];
      if (mate) {
        mate.markers.forEach(function (i) { i.marker.remove(); });
        delete tac.teammates[pkt.uid];
        renderOnlineMembersList();
        if (tac.ghostEnabled && typeof mate.lat === "number") {
          const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          upsertTacticalPin({ id: "ghost_" + mate.uid, type: "ghost", isGhost: true, lastSeenStr: nowStr, label: `[OFF] ${mate.qra}`, rawTitle: mate.qra, colorHex: "#9CA3AF", lng: mate.lng, lat: mate.lat }, true);
        }
      }
    }
  }

  if (tac.bc) {
    tac.bc.onmessage = function (ev) {
      if (!ev.data || !tac.roomCode || ev.data.room !== tac.roomCode.toUpperCase()) return;
      if (ev.data.pcmFrame) {
        playBinaryPcmFrame(ev.data.pcmFrame);
        return;
      }
      const pkt = decodePayload(ev.data.data, tac.roomCode);
      if (pkt) handleIncomingPacket(pkt);
    };
  }

  /* =====================================================================
     GPS CONTÍNUO & CONTENÇÃO ESTRITA DO BOTÃO AZUL NA GEOLOCALIZAÇÃO
     ===================================================================== */
  function readLocalBattery() {
    if (!navigator.getBattery) return;
    navigator.getBattery().then(function (b) {
      tac.myBatteryPct = Math.round((b.level || 0) * 100);
    }).catch(function () {});
  }

  function disableIncursionCompletely() {
    const inc = document.getElementById("azIncursionOverlay");
    if (inc) { inc.classList.remove("is-open"); inc.style.display = "none"; }
    if (!tac._incBtnChecked) {
      tac._incBtnChecked = true;
      document.querySelectorAll("button").forEach(function (btn) {
        if ((btn.textContent || "").trim().toUpperCase() === "INCURSÃO") btn.style.display = "none";
      });
    }
  }

  function isMapTabVisible() {
    const geo = document.getElementById("azGeoMap");
    if (!geo) return false;
    let cur = geo;
    while (cur && cur !== document.body) {
      const cs = window.getComputedStyle(cur);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
      cur = cur.parentElement;
    }
    return true;
  }

  // Controle Único Inteligente de PTT: NUNCA dois botões PTT visíveis ao mesmo tempo
  function syncSinglePttMode() {
    const group = document.getElementById("azFloatingPttGroup");
    const stage = document.getElementById("azGeoStage");
    const dockPtt = document.getElementById("azPttHoldBtn");
    const waModal = document.getElementById("azWhatsappGroupModal");
    const waPtt = document.getElementById("azWaPttBtn");
    const waOpen = Boolean(waModal && waModal.style.display === "flex");
    const dockOpen = Boolean(tac.dockOpen);
    const mapVis = isMapTabVisible();
    const onlineCount = getRoomOnlineCount();

    if (waOpen) {
      if (group) { group.classList.remove("is-visible"); group.classList.remove("is-global-float"); }
      if (dockPtt) dockPtt.style.display = "none";
      if (waPtt) waPtt.style.display = "";
      return;
    }
    if (dockOpen) {
      if (group) { group.classList.remove("is-visible"); group.classList.remove("is-global-float"); }
      if (dockPtt) dockPtt.style.display = "block";
      if (waPtt) waPtt.style.display = "none";
      return;
    }

    if (dockPtt) dockPtt.style.display = "none";
    if (waPtt) waPtt.style.display = "none";
    if (!group) return;

    if (mapVis) {
      if (stage && group.parentElement !== stage) stage.appendChild(group);
      group.classList.remove("is-global-float");
      group.style.left = "";
      group.style.top = "";
      group.style.right = "";
      group.style.bottom = "";
      group.classList.add("is-visible");
    } else if (onlineCount >= 2) {
      if (group.parentElement !== document.body) document.body.appendChild(group);
      group.classList.add("is-global-float");
      group.classList.add("is-visible");
      const vvW = window.innerWidth || document.documentElement.clientWidth || 360;
      const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const gW = group.offsetWidth || 96;
      const gH = group.offsetHeight || 38;
      const defX = 12;
      const defY = Math.max(56, Math.round(vvH - gH - 76));
      const pos = tac.floatPttPos || { left: defX, top: defY };
      const safeLeft = Math.min(Math.max(8, pos.left), Math.max(8, vvW - gW - 8));
      const safeTop = Math.min(Math.max(48, pos.top), Math.max(48, vvH - gH - 64));
      tac.floatPttPos = { left: safeLeft, top: safeTop };
      group.style.left = safeLeft + "px";
      group.style.top = safeTop + "px";
      group.style.right = "auto";
      group.style.bottom = "auto";
    } else {
      if (stage && group.parentElement !== stage) stage.appendChild(group);
      group.classList.remove("is-global-float");
      group.classList.remove("is-visible");
    }
  }

  const _hudDomCache = {
    topShell: null, topSlot: null, lockBtn: null, centerFab: null, stage: null,
    redeText: null, unitLine: null, streetLine: null,
    lastVis: null, lastUnitText: "", lastStreetText: ""
  };
  function updateHud() {
    disableIncursionCompletely();
    const vis = isMapTabVisible();
    const visChanged = _hudDomCache.lastVis !== vis;
    _hudDomCache.lastVis = vis;
    document.body.classList.toggle("az-map-fullscreen", vis);
    const topShell = _hudDomCache.topShell || (_hudDomCache.topShell = document.getElementById("azTopHudShell"));
    const topSlot = _hudDomCache.topSlot || (_hudDomCache.topSlot = document.getElementById("azTopHudSlot"));
    if (topShell) {
      if (document.body.classList.contains("az-map-expanded")) {
        if (topShell.parentElement !== document.body) document.body.appendChild(topShell);
      } else if (topSlot && topShell.parentElement !== topSlot) {
        topSlot.appendChild(topShell);
      }
      topShell.classList.toggle("is-visible", vis);
    }
    const lockBtn = _hudDomCache.lockBtn || (_hudDomCache.lockBtn = document.getElementById("azLockMapDrawBtn"));
    if (lockBtn) lockBtn.classList.toggle("is-visible", vis);
    syncSinglePttMode();
    renderEdgeIndicators();

    // Contém #azGeoCenterFab estritamente dentro do mapa (#azGeoStage)
    const centerFab = _hudDomCache.centerFab || (_hudDomCache.centerFab = document.getElementById("azGeoCenterFab"));
    if (centerFab) {
      const stage = _hudDomCache.stage || (_hudDomCache.stage = document.getElementById("azGeoStage"));
      if (stage && centerFab.parentElement !== stage) stage.appendChild(centerFab);
      centerFab.style.setProperty("display", vis ? "inline-flex" : "none", "important");
    }
    if (!vis) closeDock();

    const redeEl = _hudDomCache.redeText || (_hudDomCache.redeText = document.getElementById("statusBarRedeText"));
    const unitEl = _hudDomCache.unitLine || (_hudDomCache.unitLine = document.getElementById("azHudUnitNetLine"));
    const streetEl = _hudDomCache.streetLine || (_hudDomCache.streetLine = document.getElementById("azHudStreetLine"));
    const redeBtnText = (redeEl?.textContent || "").trim() || "Aguardando GPS";
    const nowDt = new Date();
    const dtCompact = nowDt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " " + nowDt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const nextUnit = (tac.roomCode ? `${redeBtnText} • TURNO ${tac.roomCode}` : redeBtnText) + " • " + dtCompact;
    if (unitEl && _hudDomCache.lastUnitText !== nextUnit) {
      _hudDomCache.lastUnitText = nextUnit;
      unitEl.textContent = nextUnit;
    }
    const qthStreet = (typeof azimuteLastStreet === "string" && azimuteLastStreet && !/Sincronizando/i.test(azimuteLastStreet))
      ? (azimuteLastStreet + (typeof azimuteCurrentSuburb === "string" && azimuteCurrentSuburb ? " • " + azimuteCurrentSuburb : ""))
      : (tac.resolvedAddress || "");
    if (streetEl && qthStreet && _hudDomCache.lastStreetText !== qthStreet) {
      _hudDomCache.lastStreetText = qthStreet;
      streetEl.textContent = qthStreet;
    }
    if (typeof window.azSyncExpandedViewportVars === "function") window.azSyncExpandedViewportVars();

    if (vis && visChanged && window.azGeoMap && typeof window.azGeoMap.resize === "function") {
      window.azGeoMap.resize();
    }
    tac.maps.forEach(function (m) {
      Object.values(tac.teammates).forEach(function (mate) { renderMateOnMap(mate, m); });
    });
    renderMateInspectorContent();
    updateBloodhoundVector();
  }

  async function resolveAddr(lat, lng) {
    const k = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    if (k === tac.lastGeocodeKey && tac.resolvedAddress) return;
    tac.lastGeocodeKey = k;
    tac.resolvedAddress = `LAT ${lat.toFixed(5)}, LNG ${lng.toFixed(5)}`;
    try {
      const d = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18`)).json();
      if (d && d.address && d.address.road) tac.resolvedAddress = d.address.road + (d.address.suburb ? ` • ${d.address.suburb}` : "");
    } catch (_) {}
  }

  function onNewPosition(pos) {
    const now = Date.now();
    const lat = pos.coords.latitude, lng = pos.coords.longitude;
    let speedKmh = typeof pos.coords.speed === "number" && pos.coords.speed >= 0 ? pos.coords.speed * 3.6 : 0;
    if (!speedKmh && tac.prevPos) {
      const dt = (now - tac.prevPos.ts) / 1000;
      if (dt >= 2 && dt <= 15) speedKmh = (calcDistAndBearing(tac.prevPos.lat, tac.prevPos.lng, lat, lng).dist / dt) * 3.6;
    }
    if (speedKmh >= 7.0 && speedKmh <= 26.0 && now - tac.lastRunAlert > 25000) {
      tac.lastRunAlert = now;
      broadcastPacket({ kind: "run" });
    }
    tac.prevPos = { lat: lat, lng: lng, ts: now };
    tac.myPos = { lat: lat, lng: lng };
    if (typeof pos.coords.accuracy !== "number" || pos.coords.accuracy <= 45) {
      const addedPeg = appendPointToPegadasBuffer(tac.myPassivePegadas, lat, lng, now);
      if (addedPeg) {
        if (!window._azPegSaveTimer) {
          window._azPegSaveTimer = setTimeout(function () {
            window._azPegSaveTimer = 0;
            try { localStorage.setItem("az_tac_passive_pegadas_v1", JSON.stringify(tac.myPassivePegadas)); } catch (_) {}
          }, 6000);
        }
        if (tac.visiblePegadasUids && tac.visiblePegadasUids[tac.myId]) renderPegadasOnMaps();
      }
    }
    if (tac.trailActive) {
      const lastPt = tac.myTrailCoords[tac.myTrailCoords.length - 1];
      const stepDist = lastPt ? calcDistAndBearing(lastPt[1], lastPt[0], lat, lng).dist : 999;
      if (stepDist >= 4) {
        tac.myTrailCoords.push([lng, lat]);
        renderTrailsOnMaps(false);
      }
    }
    resolveAddr(lat, lng);
    updateBloodhoundVector();
    checkGeofenceProximityAlerts();
    if (typeof followDroneTargetNow === "function" && tac.droneMode && !tac.droneFreeFlight && tac.droneFollowUid === "__SELF__") followDroneTargetNow(false);
    const myEffStatus = getEffectiveMyStatus();
    if (typeof window.azUpdateSelfStatusBadge === "function") {
      window.azUpdateSelfStatusBadge(myEffStatus, getColorHex(tac.myColorId));
    }
    renderOnlineMembersList();
    if (tac.roomCode) {
      broadcastPacket({ kind: "pos", lat: lat, lng: lng, colorId: tac.myColorId, batteryPct: tac.myBatteryPct, status: myEffStatus });
    }
  }

  function monitorGps() {
    readLocalBattery();
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(onNewPosition, function () {}, { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 });
  }

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(onNewPosition, function () {}, { enableHighAccuracy: true, maximumAge: 1500 });
  }

  // Sincronia de Viewport Real + Altura Segura do Cabeçalho em Paisagem/Tela Cheia
  (function () {
    const group = document.getElementById("azFloatingPttGroup");
    const dragHandle = document.getElementById("azPttDragHandle");
    function clampFloatingPttIntoViewport() {
      if (!group) return;
      if (group.classList.contains("is-global-float")) {
        syncSinglePttMode();
        return;
      }
      group.style.left = "";
      group.style.top = "";
      group.style.right = "";
      group.style.bottom = "";
    }
    if (group && dragHandle) {
      let dragging = false, startX = 0, startY = 0, origL = 0, origT = 0;
      dragHandle.addEventListener("pointerdown", function (ev) {
        if (!group.classList.contains("is-global-float")) return;
        ev.preventDefault(); ev.stopPropagation();
        dragging = true;
        const r = group.getBoundingClientRect();
        startX = ev.clientX; startY = ev.clientY;
        origL = r.left; origT = r.top;
        try { dragHandle.setPointerCapture(ev.pointerId); } catch (_) {}
      });
      dragHandle.addEventListener("pointermove", function (ev) {
        if (!dragging) return;
        const vvW = window.innerWidth || 360;
        const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const gW = group.offsetWidth || 96;
        const gH = group.offsetHeight || 38;
        const nx = Math.min(Math.max(8, origL + (ev.clientX - startX)), Math.max(8, vvW - gW - 8));
        const ny = Math.min(Math.max(48, origT + (ev.clientY - startY)), Math.max(48, vvH - gH - 64));
        tac.floatPttPos = { left: nx, top: ny };
        group.style.left = nx + "px";
        group.style.top = ny + "px";
      });
      function endPttDrag() { dragging = false; }
      dragHandle.addEventListener("pointerup", endPttDrag);
      dragHandle.addEventListener("pointercancel", endPttDrag);
    }
    function syncExpandedViewportVars() {
      const vvH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty("--az-vv-h", Math.round(vvH) + "px");
      const topShell = document.getElementById("azTopHudShell");
      let hudSafe = 58;
      if (document.body.classList.contains("az-map-expanded") && topShell) {
        const rect = topShell.getBoundingClientRect();
        if (rect.height > 0) hudSafe = Math.max(58, Math.ceil(rect.bottom + 14));
      }
      document.documentElement.style.setProperty("--az-top-hud-safe", hudSafe + "px");
      clampFloatingPttIntoViewport();
    }
    window.azSyncExpandedViewportVars = syncExpandedViewportVars;
    syncExpandedViewportVars();
    window.addEventListener("resize", syncExpandedViewportVars);
    window.addEventListener("orientationchange", function () {
      setTimeout(function () {
        syncExpandedViewportVars();
        if (window.azGeoMap && typeof window.azGeoMap.resize === "function") window.azGeoMap.resize();
        renderEdgeIndicators();
      }, 180);
    });

    function syncKbLandscape() {
      syncExpandedViewportVars();
    }
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncKbLandscape);
      window.visualViewport.addEventListener("scroll", syncKbLandscape);
    }
    document.addEventListener("focusin", function (ev) {
      const t = ev.target;
      if (!t || (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA")) return;
      document.body.classList.add("kb-landscape-active");
      syncKbLandscape();
      setTimeout(function () {
        try { t.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (_) {}
      }, 150);
    });
    document.addEventListener("focusout", function () {
      setTimeout(function () {
        const ae = document.activeElement;
        if (!ae || (ae.tagName !== "INPUT" && ae.tagName !== "TEXTAREA")) {
          document.body.classList.remove("kb-landscape-active");
          clampFloatingPttIntoViewport();
        }
      }, 120);
    });
  })();

  // Municípios de MG personalizados (+ Adicionar município com persistência no localStorage)
  (function () {
    const KEY = "az_custom_cities_v1";
    const box = document.getElementById("azGeoCities");
    const inp = document.getElementById("azAddMunInput");
    const btn = document.getElementById("azAddMunBtn");
    if (!box) return;
    function loadCustom() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (_) { return []; } }
    function saveCustom(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (_) {} }
    function renderCustomButtons() {
      box.querySelectorAll("[data-custom-city]").forEach(function (n) { n.remove(); });
      loadCustom().forEach(function (c, idx) {
        const wrap = document.createElement("div");
        wrap.setAttribute("data-custom-city", "1");
        wrap.style.cssText = "display:flex;gap:3px;align-items:stretch;";
        const b = document.createElement("button");
        b.type = "button";
        b.className = "az-geo-btn subtle";
        b.style.cssText = "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
        b.textContent = c.name;
        b.addEventListener("click", function () {
          const m = getActiveMap();
          if (m) m.flyTo({ center: [c.lng, c.lat], zoom: 13, essential: true });
          document.getElementById("azGeoMunBox")?.classList.remove("is-open");
        });
        const del = document.createElement("button");
        del.type = "button";
        del.className = "az-geo-btn subtle";
        del.style.cssText = "padding:0 7px;color:#F87171;";
        del.textContent = "✕";
        del.title = "Remover município";
        del.addEventListener("click", function () {
          const arr = loadCustom();
          arr.splice(idx, 1);
          saveCustom(arr);
          renderCustomButtons();
        });
        wrap.appendChild(b);
        wrap.appendChild(del);
        box.appendChild(wrap);
      });
    }
    renderCustomButtons();
    if (btn && inp) {
      btn.addEventListener("click", async function () {
        const q = (inp.value || "").trim();
        if (!q) return;
        btn.disabled = true; btn.textContent = "...";
        try {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ", Minas Gerais, Brazil")}&limit=1`;
          const res = await (await fetch(url)).json();
          if (res && res[0]) {
            const arr = loadCustom();
            const shortN = (res[0].display_name || q).split(",")[0].trim();
            arr.push({ name: shortN, lat: parseFloat(res[0].lat), lng: parseFloat(res[0].lon) });
            saveCustom(arr);
            renderCustomButtons();
            inp.value = "";
            showToast(`Município "${shortN}" adicionado.`);
          } else {
            showToast("Município não encontrado em MG.");
          }
        } catch (_) {
          showToast("Erro ao buscar município.");
        } finally {
          btn.disabled = false; btn.textContent = "+ Adicionar";
        }
      });
    }
  })();

  // Inicialização
  document.getElementById("azMyQraInput").value = tac.myQra;
  document.getElementById("azRoomCodeInput").value = tac.roomCode;
  document.getElementById("azFirebaseUrlInput").value = tac.firebaseUrl;
  document.getElementById("azToggleGhostExitBtn").textContent = tac.ghostEnabled ? "MARCADOR DE SAÍDA: ATIVADO" : "MARCADOR DE SAÍDA: DESATIVADO";

  const pttSel = document.getElementById("azPttEngineSelect");
  if (pttSel) {
    pttSel.value = tac.pttEngine;
    updateEngineHint();
    pttSel.addEventListener("change", function () {
      if (tac.isRecordingPtt) stopSelectedPtt();
      closeAllRtcPeers();
      tac.pttEngine = this.value;
      localStorage.setItem("az_tac_ptt_engine", tac.pttEngine);
      updateEngineHint();
    });
  }
  renderOnlineMembersList();

  // Travar Mapa (ícone de cadeado abaixo do 2D/3D)
  onClick("azLockMapDrawBtn", function () {
    tac.mapLocked = !tac.mapLocked;
    this.classList.toggle("is-locked", tac.mapLocked);
    this.title = tac.mapLocked ? "Mapa travado (toque para destravar)" : "Travar / Destravar movimento do mapa";
    const ico = document.getElementById("azLockMapIcon");
    if (ico) {
      ico.innerHTML = tac.mapLocked
        ? '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
        : '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>';
    }
    tac.maps.forEach(function (m) {
      ["dragPan", "scrollZoom", "doubleClickZoom", "touchZoomRotate", "boxZoom"].forEach(function (h) {
        if (m[h]) (tac.mapLocked || (h === "dragPan" && (tac.drawActive || tac.eraserActive))) ? m[h].disable() : m[h].enable();
      });
    });
    showToast(tac.mapLocked ? "Mapa travado." : "Mapa destravado.");
  });

  // PTT + Testar Som + Voz de Recepção
  ["azFloatingMapPttBtn", "azPttHoldBtn"].forEach(function (id) {
    onClick(id, function (e) { e.preventDefault(); e.stopPropagation(); tac.isRecordingPtt ? stopSelectedPtt() : startSelectedPtt(); });
  });
  onClick("azTestSpeakerBtn", function () { unlockAudioOutput(); playTone(660, 990, 0.28, 0.24); showToast("Áudio de teste emitido.", 2000); });
  document.getElementById("azTtsVoiceSelect").addEventListener("change", function () {
    localStorage.setItem(TTS_STORAGE_KEY, this.value || "");
    speakReceivedTacticalText("Voz configurada.");
  });
  onClick("azTestTtsVoiceBtn", function () { speakReceivedTacticalText("Atenção, apoio solicitado. No visual."); });

  // Lupa Busca
  onClick("azHudSearchToggleBtn", function () {
    const ov = document.getElementById("azMapSearchOverlay");
    const open = ov.classList.toggle("is-open");
    this.classList.toggle("is-active", open);
    if (open) document.getElementById("azMapAddressInput").focus();
  });
  onClick("azCloseAddressSearchBtn", function () {
    document.getElementById("azMapSearchOverlay").classList.remove("is-open");
    document.getElementById("azHudSearchToggleBtn").classList.remove("is-active");
  });
  const hudAddrInpEl = document.getElementById("azMapAddressInput");
  if (hudAddrInpEl) {
    hudAddrInpEl.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        ev.preventDefault();
        const btn = document.getElementById("azRunAddressSearchBtn");
        if (btn) btn.click();
      }
    });
  }
  onClick("azRunAddressSearchBtn", async function () {
    const q = (document.getElementById("azMapAddressInput").value || "").trim();
    const list = document.getElementById("azAddressResultsList");
    if (!q) return;
    const cm = q.match(/-?\d{1,3}\.\d+/g);
    if (cm && cm.length >= 2) {
      const lat = parseFloat(cm[0]), lng = parseFloat(cm[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        const m = getActiveMap();
        if (m) m.flyTo({ center: [lng, lat], zoom: 17, essential: true });
        document.getElementById("azMapSearchOverlay").classList.remove("is-open");
        return;
      }
    }
    list.innerHTML = `<div style="font-size:9.5px;color:#C5A869;">Buscando na RMBH/MG...</div>`;
    const refLat = tac.myPos ? tac.myPos.lat : -19.9191;
    const refLng = tac.myPos ? tac.myPos.lng : -43.9386;
    const qNorm = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const fetchJsonTimeout = async (url, opts) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5500);
      try {
        const r = await fetch(url, Object.assign({}, opts || {}, { signal: ctrl.signal }));
        if (!r.ok) throw new Error("HTTP " + r.status);
        return await r.json();
      } finally {
        clearTimeout(t);
      }
    };
    try {
      const fullQ = qNorm.includes("minas gerais") || qNorm.includes(" mg") ? q : `${q}, Minas Gerais, Brasil`;
      const pUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${refLat.toFixed(4)}&lon=${refLng.toFixed(4)}&limit=6`;
      const nUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=br&viewbox=-44.55,-19.45,-43.45,-20.30&q=${encodeURIComponent(fullQ)}`;
      const settled = await Promise.allSettled([
        fetchJsonTimeout(pUrl),
        fetchJsonTimeout(nUrl, { headers: { "Accept-Language": "pt-BR" } })
      ]);
      const items = [];
      const pushLocalMatch = (name, sub, la, lo, tag) => {
        if (!name || isNaN(la) || isNaN(lo)) return;
        const nName = String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const nSub = String(sub || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (nName.includes(qNorm) || nSub.includes(qNorm)) {
          items.push({
            lat: String(la),
            lon: String(lo),
            shortName: name,
            display_name: `[${tag}] ${name}${sub ? " — " + sub : ""}`
          });
        }
      };
      if (typeof window.azimuteGetGeoDatasets === "function") {
        const ds = window.azimuteGetGeoDatasets() || {};
        const tagMap = { unidades: "Unidade", hospitais: "Hospital", bscs: "BSC", deplans: "Deplan" };
        Object.keys(tagMap).forEach((cat) => {
          (ds[cat] || []).forEach((p) => pushLocalMatch(p.name, p.subtitle, p.lat, p.lng, tagMap[cat]));
        });
      }
      if (typeof AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS !== "undefined" && Array.isArray(AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS)) {
        AZIMUTE_HOSPITAIS_REFERENCIA_PRINCIPAIS.forEach((h) => pushLocalMatch(h.nome, h.endereco, h.lat, h.lon, "Hospital"));
      }
      if (typeof AZIMUTE_UNIDADES_POLICIAIS !== "undefined" && Array.isArray(AZIMUTE_UNIDADES_POLICIAIS)) {
        AZIMUTE_UNIDADES_POLICIAIS.forEach((u) => pushLocalMatch(u.nome, u.endereco, u.lat, u.lon, u.tipo === "bsc" ? "BSC" : "Unidade"));
      }
      if (settled[0].status === "fulfilled" && settled[0].value && Array.isArray(settled[0].value.features)) {
        settled[0].value.features.forEach(function (f) {
          const pr = f.properties || {};
          const cc = String(pr.countrycode || "").toUpperCase();
          const st = String(pr.state || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          if (cc && cc !== "BR") return;
          if (st && !st.includes("minas gerais") && st !== "mg") return;
          const coords = (f.geometry && f.geometry.coordinates) || [];
          const lon = parseFloat(coords[0]), lat = parseFloat(coords[1]);
          if (isNaN(lat) || isNaN(lon)) return;
          const head = [pr.street || pr.name, pr.housenumber].filter(Boolean).join(", ");
          const tail = [pr.district || pr.suburb || pr.locality, pr.city || pr.county].filter(Boolean).join(" - ");
          items.push({ lat: String(lat), lon: String(lon), shortName: head || q, display_name: [head, tail].filter(Boolean).join(", ") || q });
        });
      }
      if (settled[1].status === "fulfilled" && Array.isArray(settled[1].value)) {
        settled[1].value.forEach(function (it) {
          items.push({ lat: it.lat, lon: it.lon, shortName: (it.display_name || "ALVO").split(",")[0], display_name: it.display_name });
        });
      }
      const seen = new Set();
      const res = [];
      items.forEach(function (it) {
        const la = parseFloat(it.lat), lo = parseFloat(it.lon);
        if (isNaN(la) || isNaN(lo)) return;
        const k = la.toFixed(3) + "|" + lo.toFixed(3);
        if (seen.has(k)) return;
        seen.add(k);
        const db = calcDistAndBearing(refLat, refLng, la, lo);
        it._dist = db.dist;
        res.push(it);
      });
      res.sort(function (a, b) { return a._dist - b._dist; });
      if (!res.length) {
        list.innerHTML = `<div style="font-size:9.5px;color:#9E9A8F;">Nenhum endereço encontrado na RMBH/MG.</div>`;
        return;
      }
      list.innerHTML = res.slice(0, 6).map(function (it, i) {
        const eta = tac.myPos ? ` (${formatDistance(it._dist)} • ~${Math.max(1, Math.round((it._dist / 1000) * 2.2))} min)` : "";
        return `<div style="display:flex;gap:4px;align-items:stretch;">
          <button type="button" class="az-search-res-item" data-sr="${i}" style="flex:1;">${it.display_name}${eta}</button>
          <button type="button" class="az-atak-tool-btn is-active" data-sr-bh="${i}" style="height:auto !important;padding:0 8px !important;border-color:#F97316 !important;color:#F97316 !important;" title="Travar Cão de Busca">ALVO</button>
        </div>`;
      }).join("");
      list.querySelectorAll("[data-sr]").forEach(function (b) {
        b.addEventListener("click", function () {
          const it = res[parseInt(b.getAttribute("data-sr"), 10)];
          const m = getActiveMap();
          if (m && it) m.flyTo({ center: [parseFloat(it.lon), parseFloat(it.lat)], zoom: 17, essential: true });
          document.getElementById("azMapSearchOverlay").classList.remove("is-open");
        });
      });
      list.querySelectorAll("[data-sr-bh]").forEach(function (b) {
        b.addEventListener("click", function () {
          const it = res[parseInt(b.getAttribute("data-sr-bh"), 10)];
          if (it) {
            const shortName = it.shortName || (it.display_name || "ALVO").split(",")[0];
            setBloodhoundTarget({ type: "point", id: "bh_" + Date.now(), label: shortName.toUpperCase(), lat: parseFloat(it.lat), lng: parseFloat(it.lon) });
            const m = getActiveMap();
            if (m) m.flyTo({ center: [parseFloat(it.lon), parseFloat(it.lat)], zoom: 16, essential: true });
            showToast("CÃO DE BUSCA travado: " + shortName);
          }
          document.getElementById("azMapSearchOverlay").classList.remove("is-open");
        });
      });
    } catch (_) { list.innerHTML = `<div style="font-size:9.5px;color:#EF4444;">Falha na busca.</div>`; }
  });

  // Satélite + Hospital + Menu
  onClick("azSatToggleBtn", toggleSatelliteMode);
  onClick("azHudEyeToggleBtn", function () {
    const clean = document.body.classList.toggle("az-map-clean-eye");
    this.classList.toggle("is-active", clean);
    const ico = document.getElementById("azHudEyeIcon");
    if (ico) {
      ico.innerHTML = clean
        ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
        : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
    const visVal = clean ? "none" : "visible";
    ["az-tac-freehand-line", "az-tac-circle-fill", "az-tac-circle-line", "az-tac-crumbs-line", "az-tac-ruler-line"].forEach(function (lid) {
      tac.maps.forEach(function (m) {
        try { if (m.getLayer(lid)) m.setLayoutProperty(lid, "visibility", visVal); } catch (_) {}
      });
    });
    if (clean) closeDock();
    showToast(clean ? "Modo Tela Limpa: camadas ocultas" : "Camadas táticas restauradas");
  });
  onClick("azQuickHospitalRouteBtn", function () { generateRouteToTarget(-19.9277, -43.9317, "HPS João XXIII"); });
  onClick("azAtakHamburgerBtn", function () {
    scanAndCaptureExistingMaps();
    renderOnlineMembersList();
    if (typeof renderAllTeamColorSwatches === "function") window.AzTac.renderAllTeamColorSwatches();
    const endBtn = document.getElementById("azEndSessionBtn");
    if (endBtn) endBtn.style.display = tac.roomCode ? "flex" : "none";
    tac.dockOpen = !tac.dockOpen;
    document.getElementById("azAtakRightDock").classList.toggle("is-open", tac.dockOpen);
    this.classList.toggle("is-active", tac.dockOpen);
    syncSinglePttMode();
  });
  onClick("azCloseDockXBtn", closeDock);

  onClick("azDockUndoBtn", function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    undoLastTacticalAction();
  });
  onClick("azDockRedoBtn", function (e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    redoLastTacticalAction();
  });

  // Grade 3x3 (Controla armar e soltar ferramentas diretamente pelo Menu Hambúrguer - 1 por vez)
  document.querySelectorAll("[data-grid-act]").forEach(function (tile) {
    tile.addEventListener("click", function () {
      if (tac.dockOrganizeMode) return;
      const act = tile.getAttribute("data-grid-act");
      scanAndCaptureExistingMaps();
      closeDock();
      if (act === "gpe") {
        const arm = tac.toolMode !== "gpe";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "gpe" : null;
        refreshLeftControls();
        showToast(arm ? "Prioridade armada: toque no mapa." : "Prioridade desativada.");
      } else if (act === "pin_edit") {
        const arm = tac.toolMode !== "pin_edit";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "pin_edit" : null;
        refreshLeftControls();
        showToast(arm ? "Marcador armado: toque no mapa." : "Marcador desativado.");
      } else if (act === "vtr_pin") {
        const arm = tac.toolMode !== "vtr_pin";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "vtr_pin" : null;
        refreshLeftControls();
        showToast(arm ? "Viatura armada: toque no mapa." : "Viatura desativada.");
      } else if (act === "draw_free") {
        setCanetaMode(!tac.drawActive);
        showToast(tac.drawActive ? "Caneta livre ATIVA" : "Caneta finalizada.");
      } else if (act === "eraser_tool") {
        setEraserMode(!tac.eraserActive);
        showToast(tac.eraserActive ? "Borracha ATIVA: toque ou deslize sobre o que deseja apagar" : "Borracha desativada.");
      } else if (act === "draw_route") {
        const arm = !tac.crumbRouteActive;
        disarmAllTacticalTools();
        tac.crumbRouteActive = arm;
        refreshLeftControls();
        showToast(arm ? "Desenhar Rota ATIVO: clique nos pontos para lançar migalhas" : "Rota de migalhas concluída.");
      } else if (act === "clear_route_tool") {
        disarmAllTacticalTools();
        clearAllRoutesAction();
      } else if (act === "trail_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        openTrailModal();
      } else if (act === "photo_coord_pin") {
        disarmAllTacticalTools();
        refreshLeftControls();
        openPhotoModal(null, null);
      } else if (act === "flag_tool") {
        const arm = tac.toolMode !== "flag_pick";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "flag_pick" : null;
        refreshLeftControls();
        showToast(arm ? "Bandeira armada: toque no mapa para fixar ponto." : "Bandeira desativada.");
      } else if (act === "text_tool") {
        const arm = tac.toolMode !== "text_pick";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "text_pick" : null;
        refreshLeftControls();
        showToast(arm ? "Lápis de Texto ATIVO: toque no mapa para escrever." : "Lápis de Texto desativado.");
      } else if (act === "circle_tool") {
        const arm = tac.toolMode !== "circle_pick";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "circle_pick" : null;
        refreshLeftControls();
        showToast(arm ? "Toque no centro do Perímetro no mapa." : "Perímetro desativado.");
      } else if (act === "bloodhound_pick") {
        const arm = tac.toolMode !== "bloodhound_pick";
        disarmAllTacticalTools();
        tac.toolMode = arm ? "bloodhound_pick" : null;
        refreshLeftControls();
        showToast(arm ? "Toque no mapa para adicionar alvo K9." : "Seleção K9 desativada.");
      } else if (act === "grg_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        document.getElementById("azGrgModal").classList.add("is-open");
      } else if (act === "wasp_tool") {
        const arm = tac.toolMode !== "wasp_pick";
        disarmAllTacticalTools();
        if (arm) {
          (tac.floorplans || []).forEach(function (fp) { fp.locked = true; });
          tac.editingFloorplanId = null;
          const fpBar = document.getElementById("azPlantaAdjustBar");
          if (fpBar) fpBar.classList.remove("is-open");
          renderFloorplansOnMaps(true, true);
        }
        tac.toolMode = arm ? "wasp_pick" : null;
        refreshLeftControls();
        showToast(arm ? "Modo Varredura WASP ATIVO: toque nos cômodos/edificações para marcar." : "Modo Varredura WASP encerrado.");
      } else if (act === "geom_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        const sel = document.getElementById("azGeomTargetSelect");
        if (sel) {
          sel.innerHTML = '<option value="ALL">Toda a Sala (Todos)</option>' +
            Object.values(tac.teammates).map(function (m) {
              return `<option value="${m.uid}">${m.qra || m.uid}</option>`;
            }).join("");
        }
        document.getElementById("azGeomModal").classList.add("is-open");
      } else if (act === "toggle_sat") { toggleSatelliteMode(); }
      else if (act === "drone_mode") {
        disarmAllTacticalTools();
        refreshLeftControls();
        if (typeof openDroneMode === "function") window.AzTac.openDroneMode(tac.droneFollowUid || "__FREE__");
      }
      else if (act === "toggle_ruler") {
        const arm = !tac.rulerActive;
        disarmAllTacticalTools();
        tac.rulerActive = arm;
        if (!tac.rulerActive && tac.rulerCoords.length < 2) {
          tac.rulerCoords = [];
          renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", [], "#22C55E", true, null, "ruler");
        }
        refreshLeftControls();
        showToast(tac.rulerActive ? "Régua ATIVADA: toque nos pontos do mapa" : "Régua desativada.");
      } else if (act === "wheel_settings") {
        openWheelConfigModal();
      } else if (act === "enlace_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        runEnlaceTest();
      } else if (act === "pinned_poll_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        openPinnedComposerModal();
      } else if (act === "radio_conv_tool") {
        disarmAllTacticalTools();
        refreshLeftControls();
        if (typeof openTeamCommsModal === "function") window.AzTac.openTeamCommsModal();
      } else if (act === "planta_tool") {
        disarmAllTacticalTools();
        renderFloorplansListModal();
        document.getElementById("azPlantaModal").classList.add("is-open");
        refreshLeftControls();
      } else if (act && act.startsWith("trace_")) {
        const arm = tac.toolMode !== act;
        disarmAllTacticalTools(arm ? act : null);
        if (arm) {
          tac.toolMode = act;
          tac.activeTraceId = null;
          const labelMap = { trace_escada: "Escada", trace_beco: "Beco/Viela", trace_cerca: "Cerca/Muro", trace_barricada: "Barricada" };
          showToast(`${labelMap[act] || "Traçado"} ativo: toque nos pontos no mapa para traçar curvas.`);
        } else {
          const prevTrc = tac.activeTraceId ? (tac.terrainTraces || []).find(function (t) { return t.id === tac.activeTraceId; }) : null;
          tac.toolMode = null;
          tac.activeTraceId = null;
          renderTerrainTracesOnMaps(false);
          if (prevTrc && typeof openTraceDetailModal === "function" && prevTrc.coords.length >= 2) {
            openTraceDetailModal(prevTrc);
          } else {
            showToast("Traçado concluído.");
          }
        }
        refreshLeftControls();
      } else if (act === "clear_all") {
        const hasAnyData = Boolean(
          tac.pins.some(function (p) { return !p.isGhost; }) ||
          tac.drawStrokes.length || tac.breadcrumbs.length || tac.tacticalGeoms.length ||
          tac.flags.length || (tac.mapTexts && tac.mapTexts.length) ||
          (tac.terrainTraces && tac.terrainTraces.length) || (tac.floorplans && tac.floorplans.length) ||
          (tac.waspItems && tac.waspItems.length) || tac.circleCenter || tac.rulerCoords.length
        );
        if (hasAnyData) {
          pushUndoAction({
            type: "clear_snapshot",
            prev: {
              pins: tac.pins.filter(function (p) { return !p.isGhost; }).map(function (p) {
                return { id: p.id, type: p.type, label: p.label, rawTitle: p.rawTitle, colorHex: p.colorHex, iconId: p.iconId || "padrao", camAngleDeg: p.camAngleDeg || 0, photoUrl: p.photoUrl || "", lng: p.lng, lat: p.lat };
              }),
              drawStrokes: cloneTacData(tac.drawStrokes),
              breadcrumbs: cloneTacData(tac.breadcrumbs),
              tacticalGeoms: cloneTacData(tac.tacticalGeoms),
              flags: cloneTacData(tac.flags),
              mapTexts: cloneTacData(tac.mapTexts || []),
              terrainTraces: cloneTacData(tac.terrainTraces || []),
              floorplans: cloneTacData(tac.floorplans || []),
              wasps: serializeWaspItems(),
              myTrailCoords: cloneTacData(tac.myTrailCoords || []),
              circle: tac.circleCenter ? { center: { lng: tac.circleCenter.lng, lat: tac.circleCenter.lat }, radius: tac.circleRadius } : null,
              rulerCoords: cloneTacData(tac.rulerCoords)
            }
          });
        }
        disarmAllTacticalTools();
        tac.pins.forEach(function (p) { p.markers.forEach(function (i) { i.marker.remove(); }); });
        tac.pins = [];
        savePinsToStorage();
        if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
        tac.rulerCoords = [];
        tac.drawStrokes = [];
        tac.breadcrumbs = []; tac.activeCrumbIndex = -1;
        clearCrumbMarkers();
        tac.tacticalGeoms = [];
        renderTacticalGeomsOnMaps();
        if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: [] });
        tac.flags = [];
        tac.geofenceInsideMap = {};
        renderFlagsOnMaps(false);
        tac.mapTexts = [];
        renderMapTextsOnMaps(false);
        tac.terrainTraces = [];
        tac.activeTraceId = null;
        renderTerrainTracesOnMaps(false);
        tac.floorplans = [];
        tac.activeFloorplanId = null;
        tac.editingFloorplanId = null;
        renderFloorplansOnMaps(false);
        (tac.waspItems || []).forEach(function (w) { (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} }); });
        tac.waspItems = [];
        saveWaspsToStorage();
        syncWaspHudBar();
        if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: [] });
        tac.myTrailCoords = [];
        renderTrailsOnMaps(false);
        setBloodhoundTarget(null);
        clearBloodhoundMarker();
        if (typeof window.clearReconMapDrawings === "function") window.clearReconMapDrawings();
        clearCircleFromMaps(false, true);
        clearRouteFromMaps();
        renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", [], "#22C55E", true, null, "ruler");
        renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", [], "#38BDF8", false);
        renderFreehandStrokes(false);
        refreshLeftControls();
        showToast("Mapa limpo (use DESFAZER para recuperar).");
      }
    });
  });

  // Controles K9 Popover
  onClick("azK9HudBtn", function (ev) {
    ev.stopPropagation();
    const pop = document.getElementById("azK9Popover");
    if (!pop) return;
    const isOpen = pop.classList.toggle("is-open");
    this.classList.toggle("is-open", isOpen);
    if (isOpen) renderK9PopoverList();
  });
  onClick("azK9ClosePopoverBtn", function (ev) {
    ev.stopPropagation();
    const pop = document.getElementById("azK9Popover");
    const btn = document.getElementById("azK9HudBtn");
    if (pop) pop.classList.remove("is-open");
    if (btn) btn.classList.remove("is-open");
  });
  onClick("azK9PickPointBtn", function (ev) {
    ev.stopPropagation();
    const pop = document.getElementById("azK9Popover");
    const btn = document.getElementById("azK9HudBtn");
    if (pop) pop.classList.remove("is-open");
    if (btn) btn.classList.remove("is-open");
    disarmAllTacticalTools();
    tac.toolMode = "bloodhound_pick";
    refreshLeftControls();
    showToast("Toque no mapa para adicionar alvo K9.");
  });
  onClick("azK9ClearAllBtn", function (ev) {
    ev.stopPropagation();
    setBloodhoundTarget(null);
    showToast("Todos os rastreamentos K9 removidos.");
  });
  onClick("azK9MyPegadasBtn", function (ev) {
    ev.stopPropagation();
    togglePegadasForUid(tac.myId, tac.myQra || "VOCÊ", tac.myColorId);
  });
  onClick("azK9ClearPegadasBtn", function (ev) {
    ev.stopPropagation();
    clearAllVisiblePegadas();
  });

  // Controles inferiores
  onClick("azUndoStepBtn", undoLastTacticalAction);
  onClick("azFinishRulerBtn", function () {
    tac.rulerActive = false;
    tac.rulerCoords = [];
    document.getElementById("azGridRulerTile").classList.remove("is-on");
    renderLineOnMaps("az-tac-ruler", "az-tac-ruler-line", [], "#22C55E", true, null, "ruler");
    refreshLeftControls();
    showToast("Régua encerrada e apagada.");
  });
  onClick("azFinishDrawBtn", function () {
    setCanetaMode(false);
    showToast("Caneta finalizada.");
  });
  onClick("azFinishEraserBtn", function () {
    setEraserMode(false);
    showToast("Borracha desativada.");
  });
  onClick("azFinishCrumbRouteBtn", function () {
    tac.crumbRouteActive = false;
    document.getElementById("azGridCrumbRouteTile").classList.remove("is-on");
    refreshLeftControls();
    showToast("Rota de migalhas pronta. Toque em M1, M2... para seguir.");
  });
  onClick("azClearCrumbRouteBtn", function () {
    tac.breadcrumbs = [];
    tac.crumbRouteActive = false;
    tac.activeCrumbIndex = -1;
    clearCrumbMarkers();
    renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", [], "#38BDF8", false);
    broadcastPacket({ kind: "crumb_route", crumbs: [] });
    clearRouteFromMaps();
    refreshLeftControls();
    showToast("Migalhas removidas.");
  });
  onClick("azClearRouteBtn", function () { clearRouteFromMaps(); showToast("Rota encerrada."); });
  onClick("azClearCircleBtn", function () { clearCircleFromMaps(false); showToast("Perímetro removido."); });
  onClick("azFinishWaspBtn", function () {
    tac.toolMode = null;
    document.getElementById("azGridWaspTile").classList.remove("is-on");
    this.style.display = "none";
    refreshLeftControls();
    showToast("Modo Varredura WASP encerrado.");
  });
  onClick("azCloseGeomModalBtn", function () { document.getElementById("azGeomModal").classList.remove("is-open"); });
  function plotTacticalGeomAt(lat, lng) {
    const shape = document.getElementById("azGeomShapeSelect").value || "rect";
    const label = (document.getElementById("azGeomLabelInput").value || "SETOR").trim().toUpperCase();
    const widthM = Math.max(20, parseInt(document.getElementById("azGeomWidthInput").value, 10) || 250);
    const heightM = Math.max(20, parseInt(document.getElementById("azGeomHeightInput").value, 10) || 150);
    const targetUid = document.getElementById("azGeomTargetSelect").value || "ALL";
    const g = { id: "geom_" + Date.now(), shape: shape, label: label, widthM: widthM, heightM: heightM, lat: lat, lng: lng, color: getColorHex(tac.myColorId) };
    tac.tacticalGeoms.push(g);
    pushUndoAction({ type: "geom", geom: g });
    renderTacticalGeomsOnMaps();
    refreshLeftControls();
    if (tac.roomCode) broadcastPacket({ kind: "geom_sync", targetUid: targetUid, geom: g });
    document.getElementById("azGeomModal").classList.remove("is-open");
    showToast(`Geometria "${label}" plotada (arraste o centro ou pontos brancos).`);
  }
  onClick("azGeomPlotCenterBtn", function () {
    const m = getActiveMap();
    const c = m ? m.getCenter() : (tac.myPos ? { lat: tac.myPos.lat, lng: tac.myPos.lng } : { lat: -19.9245, lng: -43.9352 });
    plotTacticalGeomAt(c.lat, c.lng);
  });
  onClick("azGeomPlotGpsBtn", function () {
    if (!tac.myPos) { showToast("Aguardando posição GPS..."); return; }
    plotTacticalGeomAt(tac.myPos.lat, tac.myPos.lng);
  });
  onClick("azGeomClearBtn", function () {
    if (tac.tacticalGeoms.length > 0) {
      pushUndoAction({ type: "del_geoms", geoms: cloneTacData(tac.tacticalGeoms) });
    }
    tac.tacticalGeoms = [];
    renderTacticalGeomsOnMaps();
    if (tac.roomCode) broadcastPacket({ kind: "geom_sync_all", geoms: [] });
    document.getElementById("azGeomModal").classList.remove("is-open");
    refreshLeftControls();
    showToast("Geometrias removidas.");
  });
  onClick("azCycleBloodhoundBtn", function () {
    if (!tac.bloodhoundList || tac.bloodhoundList.length < 2) return;
    const curIdx = tac.bloodhoundList.findIndex(function (t) { return tac.bloodhoundTarget && t.id === tac.bloodhoundTarget.id; });
    const next = tac.bloodhoundList[(curIdx + 1) % tac.bloodhoundList.length];
    tac.bloodhoundTarget = next;
    if (next.type !== "mate") renderBloodhoundTargetMarker(next.lat, next.lng, next.label);
    else clearBloodhoundMarker();
    updateBloodhoundVector();
  });
  onClick("azCloseGrgModalBtn", function () { document.getElementById("azGrgModal").classList.remove("is-open"); });
  const grgHomeSel = document.getElementById("azGrgHomeSelect");
  if (grgHomeSel) {
    syncGrgHomeSelectOptions(tac.grgConfig);
    grgHomeSel.addEventListener("change", function () {
      tac.grgHomeCode = (this.value || "").trim().toUpperCase();
      localStorage.setItem("az_tac_grg_home", tac.grgHomeCode);
      if (tac.grgConfig) {
        renderGrgGridOnMaps(tac.grgConfig);
        if (tac.roomCode) broadcastPacket({ kind: "grg_sync", cfg: tac.grgConfig, homeCode: tac.grgHomeCode });
      }
      showToast(tac.grgHomeCode ? `Quadrante ${tac.grgHomeCode} definido como CASA.` : "Quadrante CASA removido.");
    });
  }
  onClick("azGrgPickHomeMapBtn", function () {
    if (!tac.grgConfig) { showToast("Gere uma grade GRG antes."); return; }
    document.getElementById("azGrgModal").classList.remove("is-open");
    disarmAllTacticalTools();
    tac.toolMode = "grg_home_pick";
    refreshLeftControls();
    showToast("Toque no quadrante da grade GRG para definir CASA.");
  });
  onClick("azGrgGenCenterBtn", function () {
    const m = getActiveMap();
    const c = m ? m.getCenter() : (tac.myPos ? { lat: tac.myPos.lat, lng: tac.myPos.lng } : { lat: -19.9245, lng: -43.9352 });
    const dim = parseInt(document.getElementById("azGrgDimSelect").value, 10) || 6;
    const cellMeters = parseInt(document.getElementById("azGrgCellMetersSelect").value, 10) || 100;
    const selHome = document.getElementById("azGrgHomeSelect");
    if (selHome) { tac.grgHomeCode = (selHome.value || "").trim().toUpperCase(); localStorage.setItem("az_tac_grg_home", tac.grgHomeCode); }
    renderGrgGridOnMaps({ dim: dim, cellMeters: cellMeters, centerLat: c.lat, centerLng: c.lng });
    if (tac.roomCode) broadcastPacket({ kind: "grg_sync", cfg: tac.grgConfig, homeCode: tac.grgHomeCode });
    document.getElementById("azGrgModal").classList.remove("is-open");
    showToast(`Grade GRG ${dim}×${dim} (${cellMeters}m) gerada.`);
  });
  onClick("azGrgGenGpsBtn", function () {
    if (!tac.myPos) { showToast("Aguardando posição GPS..."); return; }
    const dim = parseInt(document.getElementById("azGrgDimSelect").value, 10) || 6;
    const cellMeters = parseInt(document.getElementById("azGrgCellMetersSelect").value, 10) || 100;
    const selHome = document.getElementById("azGrgHomeSelect");
    if (selHome) { tac.grgHomeCode = (selHome.value || "").trim().toUpperCase(); localStorage.setItem("az_tac_grg_home", tac.grgHomeCode); }
    renderGrgGridOnMaps({ dim: dim, cellMeters: cellMeters, centerLat: tac.myPos.lat, centerLng: tac.myPos.lng });
    if (tac.roomCode) broadcastPacket({ kind: "grg_sync", cfg: tac.grgConfig, homeCode: tac.grgHomeCode });
    document.getElementById("azGrgModal").classList.remove("is-open");
    showToast(`Grade GRG ${dim}×${dim} gerada no seu GPS.`);
  });
  onClick("azGrgExportPngBtn", exportGrgTacticalPng);
  onClick("azGrgCopyDataBtn", function () {
    if (!tac.grgConfig) { showToast("Gere uma grade GRG antes."); return; }
    const txt = `AZIMUTE GRG ${tac.grgConfig.dim}x${tac.grgConfig.dim} (${tac.grgConfig.cellMeters}m) | Centro: ${tac.grgConfig.centerLat.toFixed(5)}, ${tac.grgConfig.centerLng.toFixed(5)}`;
    if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(function () {});
    showToast("Dados da grade GRG copiados.");
  });
  onClick("azGrgClearBtn", function () {
    renderGrgGridOnMaps(null);
    document.getElementById("azGrgModal").classList.remove("is-open");
    showToast("Grade GRG removida.");
  });
  onClick("azFitBloodhoundBtn", function () {
    const m = getActiveMap();
    if (!m || !tac.bloodhoundTarget) return;
    if (tac.myPos && typeof maplibregl !== "undefined") {
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend([tac.myPos.lng, tac.myPos.lat]);
      bounds.extend([tac.bloodhoundTarget.lng, tac.bloodhoundTarget.lat]);
      m.fitBounds(bounds, { padding: 70, maxZoom: 17, duration: 500 });
    } else {
      m.flyTo({ center: [tac.bloodhoundTarget.lng, tac.bloodhoundTarget.lat], zoom: 16, essential: true });
    }
  });
  onClick("azStopBloodhoundBtn", function () { setBloodhoundTarget(null); showToast("CÃO DE BUSCA encerrado."); });

  // Slider e Mover de Perímetro (Círculo)
  document.getElementById("azCircleRadiusSlider").addEventListener("input", function () {
    const r = parseInt(this.value, 10) || 150;
    document.getElementById("azCircleRadiusVal").textContent = `${r}m`;
    if (tac.circleCenter) renderCircleOnMaps(tac.circleCenter.lng, tac.circleCenter.lat, r, false);
  });
  onClick("azMoveCircleBtn", function () {
    if (!tac.circleCenter) { showToast("Nenhum perímetro ativo para mover."); return; }
    document.getElementById("azCircleRadiusPad").classList.remove("is-open");
    openRemoteFineTuneTarget("circle", tac.circleCenter);
  });
  onClick("azConfirmCircleBtn", function () {
    document.getElementById("azCircleRadiusPad").classList.remove("is-open");
    showToast(`Perímetro de ${tac.circleRadius}m fixado.`);
  });

  // Ajuste Fino Quadrado (8 Direções para Marcador, Bandeira e Perímetro)
  document.querySelectorAll("[data-remote-dir]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      const tgt = tac.fineTuneTarget;
      const coordObj = tgt && (tgt.kind === "flag" || tgt.kind === "text") && tgt.ref
        ? tgt.ref
        : (tgt && tgt.kind === "circle" && tac.circleCenter ? tac.circleCenter : tac.fineTunePin);
      if (!coordObj) return;

      const stepMeters = tac.fineTuneStepM || 2;
      const dir = btn.getAttribute("data-remote-dir") || "";
      let dirX = 0, dirY = 0;
      if (dir.includes("E")) dirX += 1;
      if (dir.includes("W")) dirX -= 1;
      if (dir.includes("N")) dirY += 1;
      if (dir.includes("S")) dirY -= 1;
      const norm = Math.hypot(dirX, dirY) || 1;
      const ux = dirX / norm;
      const uy = dirY / norm;

      const activeM = getActiveMap();
      let moved = false;
      if (activeM && typeof activeM.project === "function" && typeof activeM.unproject === "function") {
        try {
          const pt = activeM.project([coordObj.lng, coordObj.lat]);
          const gRight = activeM.unproject([pt.x + 24, pt.y]);
          const gUp = activeM.unproject([pt.x, pt.y - 24]);
          const rMeters = calcDistAndBearing(coordObj.lat, coordObj.lng, gRight.lat, gRight.lng).dist;
          const uMeters = calcDistAndBearing(coordObj.lat, coordObj.lng, gUp.lat, gUp.lng).dist;
          if (rMeters > 0.01 && uMeters > 0.01) {
            const sr = (ux * stepMeters) / rMeters;
            const su = (uy * stepMeters) / uMeters;
            coordObj.lat += sr * (gRight.lat - coordObj.lat) + su * (gUp.lat - coordObj.lat);
            coordObj.lng += sr * (gRight.lng - coordObj.lng) + su * (gUp.lng - coordObj.lng);
            moved = true;
          }
        } catch (_) {}
      }
      if (!moved) {
        const dLat = (stepMeters * uy) / 111320;
        const dLng = (stepMeters * ux) / (111320 * Math.max(0.2, Math.cos((coordObj.lat * Math.PI) / 180)));
        coordObj.lat += dLat;
        coordObj.lng += dLng;
      }

      if (tgt && tgt.kind === "flag" && tgt.ref) {
        tac.flagMarkers.forEach(function (mk) {
          if (mk && mk._flagId === coordObj.id) mk.setLngLat([coordObj.lng, coordObj.lat]);
        });
        updateFlagRingsGeoJsonOnly();
        checkGeofenceProximityAlerts();
      } else if (tgt && tgt.kind === "text" && tgt.ref) {
        tac.textMarkers.forEach(function (mk) {
          if (mk && mk._textId === coordObj.id) mk.setLngLat([coordObj.lng, coordObj.lat]);
        });
      } else if (tgt && tgt.kind === "circle") {
        renderCircleOnMaps(coordObj.lng, coordObj.lat, tac.circleRadius, true, true);
      } else if (tac.fineTunePin) {
        tac.fineTunePin.markers.forEach(function (it) { if (it.marker) it.marker.setLngLat([coordObj.lng, coordObj.lat]); });
        if (tac.bloodhoundTarget && tac.bloodhoundTarget.type === "pin" && tac.bloodhoundTarget.id === tac.fineTunePin.id) {
          updateBloodhoundVector();
        }
      }
      updateRemoteCoordReadout();
      renderEdgeIndicators();
    });
  });
  onClick("azRemoteStepBtn", function (e) {
    e.preventDefault(); e.stopPropagation();
    const steps = [0.5, 1, 2, 5, 15];
    tac.fineTuneStepM = steps[(steps.indexOf(tac.fineTuneStepM) + 1) % steps.length];
    this.textContent = `${tac.fineTuneStepM}m`;
  });
  document.querySelectorAll("[data-ft-part]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault(); e.stopPropagation();
      setRemoteFineTunePart(b.getAttribute("data-ft-part"));
    });
  });
  onClick("azRemoteOkBtn", function (e) { e.preventDefault(); e.stopPropagation(); closeRemoteFineTune(true); });
  onClick("azRemotePart2OkBtn", function (e) { e.preventDefault(); e.stopPropagation(); closeRemoteFineTune(true); });
  onClick("azRemoteCancelBtn", function (e) { e.preventDefault(); e.stopPropagation(); closeRemoteFineTune(false); });

  function clearAllRoutesAction() {
    if (Array.isArray(tac.breadcrumbs) && tac.breadcrumbs.length > 0) {
      pushUndoAction({ type: "del_crumbs", crumbs: tac.breadcrumbs.map(function (c, i) { return { idx: i, crumb: cloneTacData(c) }; }) });
    }
    tac.breadcrumbs = [];
    tac.activeCrumbIndex = -1;
    clearCrumbMarkers();
    renderLineOnMaps("az-tac-crumbs", "az-tac-crumbs-line", [], "#38BDF8", false);
    if (tac.roomCode) broadcastPacket({ kind: "crumb_route", crumbs: [] });
    clearRouteFromMaps();
    refreshLeftControls();
    showToast("Rota e migalhas apagadas.");
  }
  onClick("azActiveRouteClearPill", clearAllRoutesAction);

  // Personalizar Opções da Roda
  onClick("azCloseWheelCfgBtn", function () { document.getElementById("azWheelConfigModal").classList.remove("is-open"); });
  onClick("azSaveWheelCfgBtn", function () {
    if (Array.isArray(draftMapFavOrder) && draftMapFavOrder.length >= 3) {
      tac.wheelMapFavIds = draftMapFavOrder.slice(0, 9);
      localStorage.setItem("az_tac_wheel_map_favs_v1", JSON.stringify(tac.wheelMapFavIds));
    }
    const checks = Array.from(document.querySelectorAll("#azWheelCfgCheckboxes input:checked")).map(function (c) { return c.value; });
    if (checks.length > 0) {
      tac.wheelEnabledIds = checks;
      localStorage.setItem("az_tac_wheel_items", JSON.stringify(checks));
    }
    document.getElementById("azWheelConfigModal").classList.remove("is-open");
    showToast(`Menu salvo (${(tac.wheelMapFavIds || []).length} favoritos).`);
  });

  // Modal Pin / Editar
  document.querySelectorAll("[data-pin-preset]").forEach(function (b) { b.addEventListener("click", function () { document.getElementById("azPinCustomNameInput").value = b.getAttribute("data-pin-preset"); }); });
  onClick("azClosePinEditorBtn", function () {
    tac.editingPinObj = null;
    tac.pendingPinCoords = null;
    document.getElementById("azPinEditorModal").classList.remove("is-open");
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
  });
  onClick("azDeletePinEditorBtn", function () {
    const ed = tac.editingPinObj;
    tac.editingPinObj = null;
    tac.pendingPinCoords = null;
    document.getElementById("azPinEditorModal").classList.remove("is-open");
    if (ed) deletePinById(ed.id);
  });
  document.querySelectorAll("#azPinIconCatsRow [data-pin-cat]").forEach(function (b) {
    b.addEventListener("click", function (ev) {
      ev.stopPropagation();
      tac.pinIconCatFilter = b.getAttribute("data-pin-cat") || "ALL";
      document.querySelectorAll("#azPinIconCatsRow [data-pin-cat]").forEach(function (x) {
        x.classList.toggle("is-active", x === b);
      });
      renderPinIconPickerGrid();
    });
  });
  function syncPinCamAngle(deg) {
    tac.editingPinCamAngle = ((parseInt(deg, 10) || 0) % 360 + 360) % 360;
    const s = document.getElementById("azPinCamAngleSlider");
    const v = document.getElementById("azPinCamAngleVal");
    if (s) s.value = String(tac.editingPinCamAngle);
    if (v) v.textContent = `${tac.editingPinCamAngle}°`;
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
  }
  const pinCamSlider = document.getElementById("azPinCamAngleSlider");
  if (pinCamSlider) pinCamSlider.addEventListener("input", function () { syncPinCamAngle(this.value); });
  onClick("azPinCamMinusBtn", function (ev) { ev.stopPropagation(); syncPinCamAngle((tac.editingPinCamAngle || 0) - 45); });
  onClick("azPinCamPlusBtn", function (ev) { ev.stopPropagation(); syncPinCamAngle((tac.editingPinCamAngle || 0) + 45); });

  onClick("azConfirmPinSaveBtn", function () {
    const txt = (document.getElementById("azPinCustomNameInput").value || "MARCADOR").trim().toUpperCase();
    const chosenType = (document.getElementById("azPinTypeSelect") && document.getElementById("azPinTypeSelect").value) || "custom";
    const chosenCol = tac.editingPinColorHex || getColorHex(tac.myColorId);
    const chosenIcon = tac.editingPinIconId || "padrao";
    const chosenCamAng = chosenIcon === "camera" ? (tac.editingPinCamAngle || 0) : 0;
    const fmtLabel = function (tp, name) {
      if (tp === "vtr") return name.startsWith("[VTR]") ? name : `[VTR] ${name}`;
      if (tp === "gpe") return name.startsWith("[PRIO]") ? name : `[PRIO] ${name}`;
      if (tp === "photo_pin") return name.startsWith("[FOTO]") ? name : `[FOTO] ${name}`;
      return name;
    };
    if (tac.editingPinObj) {
      const ed = tac.editingPinObj;
      const prevSnap = {
        id: ed.id, type: ed.type, label: ed.label, rawTitle: ed.rawTitle,
        colorHex: ed.colorHex, iconId: ed.iconId || "padrao", camAngleDeg: ed.camAngleDeg || 0,
        photoUrl: ed.photoUrl || "", lng: ed.lng, lat: ed.lat
      };
      const nextSnap = {
        id: ed.id,
        type: chosenType,
        label: fmtLabel(chosenType, txt),
        rawTitle: txt,
        colorHex: chosenCol,
        iconId: chosenIcon,
        camAngleDeg: chosenCamAng,
        photoUrl: ed.photoUrl || "",
        lng: ed.lng,
        lat: ed.lat
      };
      pushUndoAction({ type: "pin_edit", id: ed.id, prev: prevSnap, next: nextSnap });
      upsertTacticalPin(nextSnap, false, true);
      tac.editingPinObj = null;
      tac.pendingPinCoords = null;
    } else if (tac.pendingPinCoords) {
      const tp = chosenType || tac.pendingPinType || "custom";
      upsertTacticalPin({
        id: (tp === "vtr" ? "vtr_" : (tp === "gpe" ? "gpe_" : (tp === "photo_pin" ? "photo_" : "pin_"))) + Date.now(),
        type: tp,
        label: fmtLabel(tp, txt),
        rawTitle: txt,
        colorHex: chosenCol,
        iconId: chosenIcon,
        camAngleDeg: chosenCamAng,
        lng: tac.pendingPinCoords.lng,
        lat: tac.pendingPinCoords.lat
      }, false);
      tac.pendingPinCoords = null;
    }
    document.getElementById("azPinEditorModal").classList.remove("is-open");
    if (typeof updateCameraConesGeoJsonOnly === "function") updateCameraConesGeoJsonOnly();
  });

  // Modal Foto + Caneta
  onClick("azClosePhotoPinModalBtn", function () {
    tac.photoTargetFlag = null;
    document.getElementById("azPhotoPinModal").classList.remove("is-open");
  });
  onClick("azModalTakePhotoBtn", function () { document.getElementById("azNativeCameraInput").click(); });
  onClick("azModalPickGalleryBtn", function () { document.getElementById("azNativeGalleryInput").click(); });
  document.getElementById("azNativeCameraInput").addEventListener("change", function () { if (this.files[0]) loadImageToCanvas(this.files[0]); this.value = ""; });
  document.getElementById("azNativeGalleryInput").addEventListener("change", function () { if (this.files[0]) loadImageToCanvas(this.files[0]); this.value = ""; });
  onClick("azClearTelestrateBtn", function () { const c = document.getElementById("azPhotoTelestrateCanvas"); if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height); });
  onClick("azPasteCoordBtn", async function () { try { document.getElementById("azPhotoCoordInput").value = (await navigator.clipboard.readText()).trim(); } catch (_) {} });
  onClick("azUseMyGpsCoordBtn", function () { if (tac.myPos) document.getElementById("azPhotoCoordInput").value = `${tac.myPos.lat.toFixed(6)}, ${tac.myPos.lng.toFixed(6)}`; });
  onClick("azConfirmPhotoPinSaveBtn", function () {
    const cap = (document.getElementById("azPhotoCaptionInput").value || "REGISTRO FOTO").trim().toUpperCase();
    const c = document.getElementById("azPhotoTelestrateCanvas");
    const photoUrl = tac.hasTelestrationBase && c ? c.toDataURL("image/jpeg", 0.62) : "";
    if (tac.photoTargetFlag) {
      const f = tac.photoTargetFlag;
      const prevSnap = { lat: f.lat, lng: f.lng, radiusM: f.radiusM, photoUrl: f.photoUrl || "", photoCaption: f.photoCaption || "" };
      if (photoUrl) f.photoUrl = photoUrl;
      f.photoCaption = cap;
      const nextSnap = { lat: f.lat, lng: f.lng, radiusM: f.radiusM, photoUrl: f.photoUrl || "", photoCaption: f.photoCaption || "" };
      pushUndoAction({ type: "flag_edit", id: f.id, prev: prevSnap, next: nextSnap });
      tac.photoTargetFlag = null;
      renderFlagsOnMaps(false);
      refreshLeftControls();
      document.getElementById("azPhotoPinModal").classList.remove("is-open");
      showToast(`Foto vinculada à ${f.label}.`);
      return;
    }
    const m = (document.getElementById("azPhotoCoordInput").value || "").match(/-?\d{1,3}\.\d+/g);
    if (!m || m.length < 2) { showToast("Informe ou cole coordenadas válidas."); return; }
    const lat = parseFloat(m[0]), lng = parseFloat(m[1]);
    upsertTacticalPin({ id: "photo_" + Date.now(), type: "photo_pin", label: `[FOTO] ${cap}`, rawTitle: cap, photoUrl: photoUrl, colorHex: getColorHex(tac.myColorId), lng: lng, lat: lat }, false);
    document.getElementById("azPhotoPinModal").classList.remove("is-open");
  });

  // Controles do Menu da Bandeira
  onClick("azCloseFlagActionBtn", function () {
    tac.activeFlag = null;
    document.getElementById("azFlagActionModal").classList.remove("is-open");
  });
  const flagRadSlider = document.getElementById("azFlagRadiusSlider");
  if (flagRadSlider) {
    flagRadSlider.addEventListener("input", function () {
      const rv = parseInt(this.value, 10) || 45;
      const lbl = document.getElementById("azFlagRadiusVal");
      if (lbl) lbl.textContent = `${rv}m`;
    });
  }
  document.querySelectorAll("[data-flag-rad]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      const rv = parseInt(chip.getAttribute("data-flag-rad"), 10) || 45;
      const s = document.getElementById("azFlagRadiusSlider");
      const v = document.getElementById("azFlagRadiusVal");
      if (s) s.value = String(rv);
      if (v) v.textContent = `${rv}m`;
    });
  });
  onClick("azFlagApplyRadiusBtn", function () {
    const f = tac.activeFlag;
    if (!f) return;
    const nextRad = Math.max(10, parseInt(document.getElementById("azFlagRadiusSlider").value, 10) || 45);
    const prevSnap = { lat: f.lat, lng: f.lng, radiusM: f.radiusM, photoUrl: f.photoUrl, photoCaption: f.photoCaption };
    f.radiusM = nextRad;
    const nextSnap = { lat: f.lat, lng: f.lng, radiusM: f.radiusM, photoUrl: f.photoUrl, photoCaption: f.photoCaption };
    pushUndoAction({ type: "flag_edit", id: f.id, prev: prevSnap, next: nextSnap });
    renderFlagsOnMaps(false);
    refreshLeftControls();
    document.getElementById("azFlagActionModal").classList.remove("is-open");
    showToast(`${f.label}: perímetro definido para ${nextRad}m.`);
  });
  onClick("azFlagMoveBtn", function () {
    const f = tac.activeFlag;
    document.getElementById("azFlagActionModal").classList.remove("is-open");
    if (f) openRemoteFineTuneTarget("flag", f);
  });
  onClick("azFlagPhotoBtn", function () {
    const f = tac.activeFlag;
    document.getElementById("azFlagActionModal").classList.remove("is-open");
    if (f) openPhotoModal({ lat: f.lat, lng: f.lng }, f);
  });
  onClick("azFlagDeleteBtn", function () {
    const f = tac.activeFlag;
    document.getElementById("azFlagActionModal").classList.remove("is-open");
    tac.activeFlag = null;
    if (!f) return;
    const snap = cloneTacData(f);
    tac.flags = tac.flags.filter(function (x) { return x.id !== f.id; });
    pushUndoAction({ type: "del_flags", flags: [snap] });
    renderFlagsOnMaps(false);
    refreshLeftControls();
    showToast(`${f.label} apagada.`);
  });

  // Controles do Compositor de Texto no Mapa (Tamanho contínuo, Girar no centro, Fundo, Cor e Mover)
  onClick("azCloseTextComposerBtn", closeMapTextComposer);
  document.querySelectorAll("#azTextSizeRow [data-txt-size]").forEach(function (b) {
    b.addEventListener("click", function () {
      syncTextSizeUi(parseInt(b.getAttribute("data-txt-size"), 10) || 14);
    });
  });
  onClick("azTextSizeMinusBtn", function () { syncTextSizeUi((tac.textSizePx || 14) - 2); });
  onClick("azTextSizePlusBtn", function () { syncTextSizeUi((tac.textSizePx || 14) + 2); });
  const txtSzSlider = document.getElementById("azTextSizeSlider");
  if (txtSzSlider) txtSzSlider.addEventListener("input", function () { syncTextSizeUi(this.value); });

  onClick("azTextRotLeftBtn", function () { syncTextAngleUi((tac.textAngleDeg || 0) - 15); });
  onClick("azTextRotZeroBtn", function () { syncTextAngleUi(0); });
  onClick("azTextRotRightBtn", function () { syncTextAngleUi((tac.textAngleDeg || 0) + 15); });
  const txtAngSlider = document.getElementById("azTextAngleSlider");
  if (txtAngSlider) txtAngSlider.addEventListener("input", function () { syncTextAngleUi(this.value); });

  function saveMapTextFromComposer() {
    const raw = (document.getElementById("azMapTextInput").value || "").trim();
    if (!raw) { showToast("Digite o texto para fixar no mapa."); return; }
    const col = tac.textColorHex || getColorHex(tac.myColorId);
    const bgCol = tac.textBgColor || "transparent";
    const sz = tac.textSizePx || 14;
    const ang = tac.textAngleDeg || 0;
    if (tac.editingTextObj) {
      const ed = tac.editingTextObj;
      const prevSnap = { text: ed.text, sizePx: ed.sizePx, angleDeg: ed.angleDeg || 0, color: ed.color, bgColor: ed.bgColor || "transparent" };
      ed.text = raw;
      ed.sizePx = sz;
      ed.angleDeg = ang;
      ed.color = col;
      ed.bgColor = bgCol;
      pushUndoAction({ type: "text_edit", id: ed.id, prev: prevSnap, next: { text: raw, sizePx: sz, angleDeg: ang, color: col, bgColor: bgCol } });
      renderMapTextsOnMaps(false);
      refreshLeftControls();
      closeMapTextComposer();
      showToast("Texto atualizado.");
      return;
    }
    if (!tac.pendingTextCoords) return;
    const newTxt = {
      id: "txt_" + Date.now(),
      text: raw,
      lat: tac.pendingTextCoords.lat,
      lng: tac.pendingTextCoords.lng,
      sizePx: sz,
      angleDeg: ang,
      color: col,
      bgColor: bgCol
    };
    tac.mapTexts.push(newTxt);
    pushUndoAction({ type: "text", text: cloneTacData(newTxt) });
    renderMapTextsOnMaps(false);
    refreshLeftControls();
    closeMapTextComposer();
    showToast("Texto plotado no mapa.");
  }
  onClick("azSaveMapTextBtn", saveMapTextFromComposer);
  onClick("azMoveMapTextBtn", function () {
    const ed = tac.editingTextObj;
    closeMapTextComposer();
    if (ed) openRemoteFineTuneTarget("text", ed);
  });
  const txtInpEl = document.getElementById("azMapTextInput");
  if (txtInpEl) {
    txtInpEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); saveMapTextFromComposer(); }
    });
  }
  onClick("azDeleteMapTextBtn", function () {
    const ed = tac.editingTextObj;
    if (!ed) return;
    const snap = cloneTacData(ed);
    tac.mapTexts = tac.mapTexts.filter(function (x) { return x.id !== ed.id; });
    pushUndoAction({ type: "del_texts", texts: [snap] });
    renderMapTextsOnMaps(false);
    refreshLeftControls();
    closeMapTextComposer();
    showToast("Texto removido.");
  });

  // Meu Status Operacional (Ao clicar no meu ícone)
  function applySelfStatus(stText) {
    const clean = (stText || "EM PATRULHA").trim().toUpperCase();
    tac.myManualStatus = clean;
    localStorage.setItem("az_tac_my_status", clean);
    const eff = getEffectiveMyStatus();
    if (typeof window.azUpdateSelfStatusBadge === "function") {
      window.azUpdateSelfStatusBadge(eff, getColorHex(tac.myColorId));
    }
    if (tac.roomCode) broadcastPacket({ kind: "status_update", status: eff });
    showToast(`Seu status: ${eff}`);
  }
  window.azOpenMyStatusModal = function () {
    const cur = getEffectiveMyStatus();
    const note = document.getElementById("azMyStatusCurrentNote");
    if (note) {
      const inCasa = tac.myPos && isLatLngInGrgHome(tac.myPos.lat, tac.myPos.lng);
      note.textContent = inCasa
        ? `Atual: ${cur} (Quadrante CASA ${tac.grgHomeCode})`
        : `Atual: ${cur}`;
    }
    document.querySelectorAll("#azMyStatusChips [data-self-status]").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-self-status") === tac.myManualStatus);
    });
    const ci = document.getElementById("azMyStatusCustomInput");
    if (ci) ci.value = "";
    document.getElementById("azMyStatusModal").classList.add("is-open");
  };
  onClick("azCloseMyStatusBtn", function () { document.getElementById("azMyStatusModal").classList.remove("is-open"); });
  document.querySelectorAll("#azMyStatusChips [data-self-status]").forEach(function (b) {
    b.addEventListener("click", function () {
      applySelfStatus(b.getAttribute("data-self-status"));
      document.getElementById("azMyStatusModal").classList.remove("is-open");
    });
  });
  onClick("azSaveCustomStatusBtn", function () {
    const v = (document.getElementById("azMyStatusCustomInput").value || "").trim();
    if (!v) return;
    applySelfStatus(v);
    document.getElementById("azMyStatusModal").classList.remove("is-open");
  });

  // Modal Função Rastro
  function openTrailModal() {
    const info = document.getElementById("azTrailStatusInfo");
    const stopBtn = document.getElementById("azStopTrailBtn");
    if (info) {
      info.textContent = tac.trailActive
        ? `Gravando (${tac.trailScope === "team" ? "Equipe toda" : "Só para mim"}) • ${tac.myTrailCoords.length} pontos.`
        : `Parado (${tac.myTrailCoords.length} pontos no mapa). Escolha quem visualiza:`;
    }
    if (stopBtn) stopBtn.style.display = tac.trailActive ? "block" : "none";
    document.getElementById("azTrailModal").classList.add("is-open");
  }
  onClick("azCloseTrailModalBtn", function () { document.getElementById("azTrailModal").classList.remove("is-open"); });
  onClick("azStartTrailLocalBtn", function () {
    tac.trailScope = "local";
    tac.trailActive = true;
    if (tac.myPos && tac.myTrailCoords.length === 0) tac.myTrailCoords.push([tac.myPos.lng, tac.myPos.lat]);
    renderTrailsOnMaps(true);
    refreshLeftControls();
    document.getElementById("azTrailModal").classList.remove("is-open");
    showToast("Rastro ativo: SÓ PARA MIM.");
  });
  onClick("azStartTrailTeamBtn", function () {
    tac.trailScope = "team";
    tac.trailActive = true;
    if (tac.myPos && tac.myTrailCoords.length === 0) tac.myTrailCoords.push([tac.myPos.lng, tac.myPos.lat]);
    renderTrailsOnMaps(false);
    refreshLeftControls();
    document.getElementById("azTrailModal").classList.remove("is-open");
    showToast("Rastro ativo: VISÍVEL PARA EQUIPE.");
  });
  onClick("azStopTrailBtn", function () {
    tac.trailActive = false;
    refreshLeftControls();
    document.getElementById("azTrailModal").classList.remove("is-open");
    showToast("Gravação de rastro pausada.");
  });
  onClick("azClearTrailBtn", function () {
    if (tac.myTrailCoords.length > 0) {
      pushUndoAction({ type: "del_trail", trail: cloneTacData(tac.myTrailCoords) });
    }
    tac.trailActive = false;
    tac.myTrailCoords = [];
    renderTrailsOnMaps(false);
    refreshLeftControls();
    document.getElementById("azTrailModal").classList.remove("is-open");
    showToast("Meu rastro apagado.");
  });

  // Diagnóstico de ENLACE (Sinal Real + Áudio Desbloqueado)
  function renderEnlaceResultsList() {
    const selfEl = document.getElementById("azEnlaceSelfStatus");
    const listEl = document.getElementById("azEnlaceList");
    const state = tac.enlaceActivePing;
    if (!state || !listEl || !selfEl) return;

    const myAudioOk = Boolean(tac.audioCtx && tac.audioCtx.state === "running") && !tac.audioMuted;
    if (state.selfFailed) {
      selfEl.textContent = "SEU LINK ESTÁ SEM RETORNO — RECONECTANDO";
      selfEl.style.color = "#FCA5A5";
      selfEl.style.borderColor = "#EF4444";
    } else if (typeof state.selfEchoMs === "number") {
      selfEl.textContent = `SEU LINK OK (${state.selfEchoMs}ms) • Áudio: ${myAudioOk ? "PRONTO" : "TOQUE NA TELA"}`;
      selfEl.style.color = myAudioOk ? "#4ADE80" : "#FBBF24";
      selfEl.style.borderColor = myAudioOk ? "#22C55E" : "#F59E0B";
    } else {
      selfEl.textContent = "Testando retorno no servidor (eco próprio)...";
      selfEl.style.color = "#CBD5E1";
      selfEl.style.borderColor = "#2A2A24";
    }

    const mates = Object.values(tac.teammates || {});
    if (mates.length === 0) {
      listEl.innerHTML = `<div style="font-size:9.5px;color:#9E9A8F;text-align:center;padding:8px;">Nenhum outro operador listado na sala.</div>`;
      return;
    }

    listEl.innerHTML = mates.map(function (m) {
      const ack = state.acks[m.uid];
      const safeName = String(m.qra || "ALIADO").replace(/</g, "&lt;");
      const colHex = getColorHex(m.colorId);
      if (ack) {
        const batStr = typeof ack.batteryPct === "number" ? ` • ${ack.batteryPct}%` : "";
        if (ack.audioReady) {
          return `<div class="az-enlace-row" style="border-left:3px solid ${colHex};"><div><strong>${safeName}</strong><div style="font-size:8.5px;color:#9E9A8F;">${ack.latencyMs}ms${batStr}</div></div><span class="az-enlace-badge is-green">ENLACE OK</span></div>`;
        }
        return `<div class="az-enlace-row" style="border-left:3px solid ${colHex};"><div><strong>${safeName}</strong><div style="font-size:8.5px;color:#9E9A8F;">${ack.latencyMs}ms • Sem áudio${batStr}</div></div><span class="az-enlace-badge is-amber">SÓ DADOS / ÁUDIO BLOQ.</span></div>`;
      }
      if (state.finished) {
        return `<div class="az-enlace-row" style="border-left:3px solid ${colHex};"><div><strong>${safeName}</strong><div style="font-size:8.5px;color:#9E9A8F;">Sem eco em 4.5s</div></div><span class="az-enlace-badge is-red">SEM RESPOSTA</span></div>`;
      }
      return `<div class="az-enlace-row" style="border-left:3px solid ${colHex};"><div><strong>${safeName}</strong><div style="font-size:8.5px;color:#9E9A8F;">Aguardando ACK...</div></div><span class="az-enlace-badge is-wait">TESTANDO...</span></div>`;
    }).join("");
  }

  function runEnlaceTest() {
    if (!tac.roomCode) {
      showToast("Entre em uma sala/equipe antes de testar o ENLACE.");
      return;
    }
    unlockAudioOutput();
    if (tac.enlaceActivePing) {
      clearTimeout(tac.enlaceActivePing.selfTimer);
      clearTimeout(tac.enlaceActivePing.finishTimer);
    }
    const pingId = "enl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    const sentAt = Date.now();
    tac.enlaceActivePing = {
      pingId: pingId,
      sentAt: sentAt,
      selfEchoMs: null,
      selfFailed: false,
      finished: false,
      acks: {},
      selfTimer: null,
      finishTimer: null
    };
    document.getElementById("azEnlaceModal").classList.add("is-open");
    renderEnlaceResultsList();

    const sent = broadcastPacket({ kind: "enlace_ping", pingId: pingId });
    if (!sent) {
      tac.enlaceActivePing.selfFailed = true;
      tac.enlaceActivePing.finished = true;
      renderEnlaceResultsList();
      handleZombieSocketDetected("LINK TRAVADO / RECONECTANDO");
      return;
    }

    tac.enlaceActivePing.selfTimer = setTimeout(function () {
      if (!tac.enlaceActivePing || tac.enlaceActivePing.pingId !== pingId) return;
      if (typeof tac.enlaceActivePing.selfEchoMs !== "number") {
        tac.enlaceActivePing.selfFailed = true;
        renderEnlaceResultsList();
        showToast("SEU LINK ESTÁ SEM RETORNO — RECONECTANDO", 4200, true);
        handleZombieSocketDetected("LINK TRAVADO / RECONECTANDO");
      }
    }, 3000);

    tac.enlaceActivePing.finishTimer = setTimeout(function () {
      if (!tac.enlaceActivePing || tac.enlaceActivePing.pingId !== pingId) return;
      tac.enlaceActivePing.finished = true;
      renderEnlaceResultsList();
    }, 4500);
  }

  onClick("azCloseEnlaceModalBtn", function () {
    document.getElementById("azEnlaceModal").classList.remove("is-open");
  });
  onClick("azEnlaceRetestBtn", runEnlaceTest);
  onClick("azDockEnlaceBtn", function () {
    closeDock();
    runEnlaceTest();
  });
  onClick("azWaEnlaceBtn", runEnlaceTest);

  // Mensagem Fixada (Checklist / Enquete Tática com Auto-Fechamento)
  function renderPinnedPollBanner() {
    const banner = document.getElementById("azPinnedPollBanner");
    const poll = tac.activePinnedPoll;
    if (!banner) return;
    if (!poll) {
      banner.classList.remove("is-open");
      return;
    }
    const isAuthor = poll.authorUid === tac.myId;
    const authorEl = document.getElementById("azPinnedPollAuthor");
    const qEl = document.getElementById("azPinnedPollQuestionText");
    const voteGrid = document.getElementById("azPinnedPollVoteGrid");
    const closeBtn = document.getElementById("azPinnedPollCloseAuthorBtn");
    const rosterEl = document.getElementById("azPinnedPollRoster");
    const footEl = document.getElementById("azPinnedPollFootNote");

    const authorCol = getColorHex(poll.authorColorId);
    if (authorEl) {
      authorEl.textContent = `MSG. FIXADA • ${poll.authorQra || "OPERADOR"}`;
      authorEl.style.color = authorCol;
    }
    if (qEl) qEl.textContent = poll.question || "CONFIRMAÇÃO TÁTICA";
    if (voteGrid) {
      voteGrid.style.display = isAuthor ? "none" : "grid";
      const myChoice = poll.votes && poll.votes[tac.myId] ? poll.votes[tac.myId].choice : "";
      voteGrid.querySelectorAll("[data-pinned-choice]").forEach(function (b) {
        b.classList.toggle("is-chosen", b.getAttribute("data-pinned-choice") === myChoice);
      });
    }
    if (closeBtn) closeBtn.style.display = isAuthor ? "inline-flex" : "none";

    const participants = [];
    const seen = new Set();
    if (!isAuthor) {
      seen.add(tac.myId);
      const mv = poll.votes[tac.myId];
      participants.push({
        uid: tac.myId,
        qra: tac.myQra || "VOCÊ",
        colorId: tac.myColorId,
        choice: mv ? mv.choice : "PENDENTE"
      });
    }
    Object.values(tac.teammates || {}).forEach(function (m) {
      if (!m || m.uid === poll.authorUid || seen.has(m.uid)) return;
      seen.add(m.uid);
      const v = poll.votes[m.uid];
      participants.push({
        uid: m.uid,
        qra: m.qra || "ALIADO",
        colorId: m.colorId,
        choice: v ? v.choice : "PENDENTE"
      });
    });
    Object.keys(poll.votes || {}).forEach(function (uid) {
      if (uid === poll.authorUid || seen.has(uid)) return;
      seen.add(uid);
      const v = poll.votes[uid];
      participants.push({
        uid: uid,
        qra: v.qra || "ALIADO",
        colorId: v.colorId || "ciano",
        choice: v.choice || "PENDENTE"
      });
    });

    if (rosterEl) {
      if (participants.length === 0) {
        rosterEl.innerHTML = `<span style="font-size:9px;color:#9E9A8F;">Nenhum outro operador na sala.</span>`;
      } else {
        rosterEl.innerHTML = participants.map(function (pt) {
          const cHex = getColorHex(pt.colorId);
          const safeQ = String(pt.qra || "").replace(/</g, "&lt;");
          const stCol = pt.choice === "SIM" ? "#4ADE80"
            : (pt.choice === "NÃO" ? "#FCA5A5"
              : (pt.choice === "AGUARDE" ? "#FBBF24"
                : (pt.choice === "IMPOSSIBILITADO" ? "#C4B5FD" : "#9E9A8F")));
          return `<span class="az-pinned-chip" style="border-color:${cHex};"><strong style="color:${cHex};">${safeQ}:</strong> <span style="color:${stCol};">${pt.choice}</span></span>`;
        }).join("");
      }
    }

    const totalExpected = participants.length;
    const totalAnswered = participants.filter(function (pt) { return pt.choice && pt.choice !== "PENDENTE"; }).length;
    if (footEl) {
      if (totalExpected > 0 && totalAnswered >= totalExpected) {
        footEl.textContent = "TODOS RESPONDERAM — ENCERRANDO...";
        footEl.style.color = "#4ADE80";
      } else {
        footEl.textContent = `Respostas: ${totalAnswered}/${totalExpected}`;
        footEl.style.color = "#9E9A8F";
      }
    }
    banner.classList.add("is-open");
  }

  function finalizeAndClosePinnedPoll(reason) {
    clearTimeout(tac._pinnedAutoCloseTimer);
    tac._pinnedAutoCloseTimer = null;
    const poll = tac.activePinnedPoll;
    if (!poll) return;

    const voteParts = Object.values(poll.votes || {}).map(function (v) {
      return `${v.qra || "ALIADO"}: ${v.choice}`;
    });
    const summaryText = `CHECKLIST "${poll.question}" — ` + (voteParts.length ? voteParts.join(" | ") : "Encerrada sem respostas.");
    if (typeof appendWaChatMessage === "function") {
      appendWaChatMessage({
        uid: poll.authorUid,
        qra: poll.authorQra || "EQUIPE",
        colorId: poll.authorColorId || tac.myColorId,
        text: summaryText,
        ts: Date.now()
      });
    }
    if (reason === "author" && tac.roomCode) {
      broadcastPacket({ kind: "pinned_poll_close", pollId: poll.pollId });
    }
    tac.activePinnedPoll = null;
    renderPinnedPollBanner();
    showToast(reason === "auto" ? "Todos responderam! Resumo salvo no grupo." : "Mensagem Fixada encerrada.");
  }

  function checkPinnedPollAutoComplete() {
    const poll = tac.activePinnedPoll;
    if (!poll) return;
    const expectedUids = [];
    if (poll.authorUid !== tac.myId) expectedUids.push(tac.myId);
    Object.keys(tac.teammates || {}).forEach(function (uid) {
      if (uid !== poll.authorUid && !expectedUids.includes(uid)) expectedUids.push(uid);
    });
    if (expectedUids.length === 0) return;
    const allAnswered = expectedUids.every(function (uid) {
      return Boolean(poll.votes && poll.votes[uid] && poll.votes[uid].choice);
    });
    if (allAnswered) {
      renderPinnedPollBanner();
      clearTimeout(tac._pinnedAutoCloseTimer);
      tac._pinnedAutoCloseTimer = setTimeout(function () {
        finalizeAndClosePinnedPoll("auto");
      }, 2000);
    }
  }

  function openPinnedComposerModal() {
    if (!tac.roomCode) {
      showToast("Entre em uma sala/equipe antes de fixar uma mensagem.");
      return;
    }
    const inp = document.getElementById("azPinnedQuestionInput");
    if (inp && !inp.value) inp.value = "TODOS PRONTOS?";
    document.getElementById("azPinnedComposerModal").classList.add("is-open");
    setTimeout(function () { if (inp) try { inp.focus(); inp.select(); } catch (_) {} }, 40);
  }

  onClick("azClosePinnedComposerBtn", function () {
    document.getElementById("azPinnedComposerModal").classList.remove("is-open");
  });
  document.querySelectorAll("[data-pinned-preset]").forEach(function (b) {
    b.addEventListener("click", function () {
      const inp = document.getElementById("azPinnedQuestionInput");
      if (inp) inp.value = b.getAttribute("data-pinned-preset") || "";
    });
  });
  onClick("azSendPinnedPollBtn", function () {
    if (!tac.roomCode) { showToast("Entre em uma sala/equipe."); return; }
    const q = (document.getElementById("azPinnedQuestionInput").value || "TODOS PRONTOS?").trim().toUpperCase();
    clearTimeout(tac._pinnedAutoCloseTimer);
    const poll = {
      pollId: "poll_" + Date.now() + "_" + Math.random().toString(36).slice(2, 5),
      authorUid: tac.myId,
      authorQra: tac.myQra || "OPERADOR",
      authorColorId: tac.myColorId,
      question: q,
      votes: {},
      createdAt: Date.now()
    };
    tac.activePinnedPoll = poll;
    document.getElementById("azPinnedComposerModal").classList.remove("is-open");
    renderPinnedPollBanner();
    broadcastPacket({ kind: "pinned_poll_start", poll: poll });
    showToast("Mensagem Fixada enviada à sala.");
  });
  document.querySelectorAll("[data-pinned-choice]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const poll = tac.activePinnedPoll;
      if (!poll || poll.authorUid === tac.myId) return;
      const choice = btn.getAttribute("data-pinned-choice");
      poll.votes[tac.myId] = {
        uid: tac.myId,
        qra: tac.myQra || "VOCÊ",
        colorId: tac.myColorId,
        choice: choice
      };
      renderPinnedPollBanner();
      broadcastPacket({ kind: "pinned_poll_vote", pollId: poll.pollId, choice: choice, colorId: tac.myColorId });
      checkPinnedPollAutoComplete();
      showToast(`Resposta enviada: ${choice}`);
    });
  });
  onClick("azPinnedPollCloseAuthorBtn", function () {
    if (tac.activePinnedPoll && tac.activePinnedPoll.authorUid === tac.myId) {
      finalizeAndClosePinnedPoll("author");
    }
  });
  onClick("azWaPinnedPollBtn", function () {
    openPinnedComposerModal();
  });

  // Conversor de Rádio Motorola <-> Baofeng UV-5R (100% Offline)
  (function initRadioConverter() {
    const CHANNELS = {
      1: "462.5625", 2: "462.5875", 3: "462.6125", 4: "462.6375", 5: "462.6625",
      6: "462.6875", 7: "462.7125", 8: "467.5625", 9: "467.5875", 10: "467.6125",
      11: "467.6375", 12: "467.6625", 13: "467.6875", 14: "467.7125", 15: "462.5500",
      16: "462.5750", 17: "462.6000", 18: "462.6250", 19: "462.6500", 20: "462.6750",
      21: "462.7000", 22: "462.7250", 23: "467.5500", 24: "467.5750", 25: "467.6000",
      26: "467.6250"
    };
    const CTCSS = [
      "OFF", "67.0", "71.9", "74.4", "77.0", "79.7", "82.5", "85.4", "88.5", "91.5",
      "94.8", "97.4", "100.0", "103.5", "107.2", "110.9", "114.8", "118.8", "123.0", "127.3",
      "131.8", "136.5", "141.3", "146.2", "151.4", "156.7", "162.2", "167.9", "173.8", "179.9",
      "186.2", "192.8", "203.5", "210.7", "218.1", "225.7", "233.6", "241.8", "250.3"
    ];
    const DCS = [
      "D023N", "D025N", "D026N", "D031N", "D032N", "D043N", "D047N", "D051N", "D054N", "D065N",
      "D071N", "D072N", "D073N", "D074N", "D114N", "D115N", "D116N", "D125N", "D131N", "D132N",
      "D134N", "D143N", "D152N", "D155N", "D156N", "D162N", "D165N", "D172N", "D174N", "D205N",
      "D223N", "D226N", "D243N", "D244N", "D245N", "D251N", "D261N", "D263N", "D265N", "D271N",
      "D306N", "D311N", "D315N", "D331N", "D343N", "D346N", "D351N", "D364N", "D365N", "D371N",
      "D411N", "D412N", "D413N", "D423N", "D431N", "D432N", "D445N", "D464N", "D465N", "D466N",
      "D503N", "D506N", "D516N", "D532N", "D546N", "D565N", "D606N", "D612N", "D624N", "D627N",
      "D631N", "D632N", "D654N", "D662N", "D664N", "D703N", "D712N", "D723N", "D731N", "D732N",
      "D734N", "D743N", "D754N"
    ];

    function describeCode(code) {
      const c = Math.max(0, Math.min(121, parseInt(code, 10) || 0));
      if (c === 0) return { type: "OFF", val: "OFF", detail: "SEM SUBTOM — OFF (Menus 10–13: OFF)" };
      if (c <= 38) {
        const hz = CTCSS[c] || "67.0";
        return { type: "CTCSS", val: hz + " Hz", detail: `CTCSS ${hz} Hz — Menus 11 R-CTCS e 13 T-CTCS` };
      }
      const dcs = DCS[c - 39] || "D023N";
      return { type: "DCS", val: dcs, detail: `DCS ${dcs} — Menus 10 R-DCS e 12 T-DCS` };
    }

    const chSel = document.getElementById("azRadioChanSelect");
    const cdSel = document.getElementById("azRadioCodeSelect");
    const fqSel = document.getElementById("azRadioFreqSelect");
    const sbSel = document.getElementById("azRadioSubtoneSelect");
    const quickInp = document.getElementById("azRadioMotoQuickInput");
    const fqCustom = document.getElementById("azRadioFreqCustomInput");
    const outPrimLbl = document.getElementById("azRadioOutPrimaryLabel");
    const outPrimVal = document.getElementById("azRadioOutPrimaryVal");
    const outSubLbl = document.getElementById("azRadioOutSubLabel");
    const outSubVal = document.getElementById("azRadioOutSubVal");

    if (!chSel || !cdSel || !fqSel || !sbSel) return;

    let chHtml = "";
    for (let i = 1; i <= 26; i++) {
      const ext = i >= 23 ? " (BR)" : "";
      chHtml += `<option value="${i}">Canal ${i}${ext} • ${CHANNELS[i]}</option>`;
    }
    chSel.innerHTML = chHtml;
    chSel.value = "1";

    let cdHtml = `<option value="0">0 • SEM SUBTOM (OFF)</option>`;
    for (let i = 1; i <= 38; i++) cdHtml += `<option value="${i}">${i} • CTCSS ${CTCSS[i]} Hz</option>`;
    for (let i = 39; i <= 121; i++) cdHtml += `<option value="${i}">${i} • DCS ${DCS[i - 39]}</option>`;
    cdSel.innerHTML = cdHtml;
    cdSel.value = "9";

    let fqHtml = "";
    for (let i = 1; i <= 26; i++) fqHtml += `<option value="${CHANNELS[i]}">${CHANNELS[i]} MHz (Ch ${i})</option>`;
    fqSel.innerHTML = fqHtml;
    sbSel.innerHTML = cdHtml;

    let radioMode = "M2B";

    function renderM2B(ch, code) {
      const c = Math.max(1, Math.min(26, parseInt(ch, 10) || 1));
      const d = Math.max(0, Math.min(121, parseInt(code, 10) || 0));
      const freq = CHANNELS[c] || "462.5625";
      const sub = describeCode(d);
      outPrimLbl.textContent = `FREQUÊNCIA NO BAOFENG (MOTOROLA ${c}.${d})`;
      outPrimVal.textContent = `${freq} MHz`;
      outPrimVal.style.color = "#4ADE80";
      outSubLbl.textContent = "TIPO E VALOR DO SUBTOM";
      outSubVal.textContent = sub.detail;
    }

    function renderB2M() {
      const rawCustom = (fqCustom.value || "").trim().replace(",", ".");
      const freqNum = parseFloat(rawCustom || fqSel.value);
      const code = Math.max(0, Math.min(121, parseInt(sbSel.value, 10) || 0));
      const sub = describeCode(code);

      let matchedCh = null;
      if (!isNaN(freqNum)) {
        for (let i = 1; i <= 26; i++) {
          if (Math.abs(parseFloat(CHANNELS[i]) - freqNum) <= 0.0025) {
            matchedCh = i;
            break;
          }
        }
      }

      if (matchedCh) {
        outPrimLbl.textContent = "CÓDIGO NO MOTOROLA / INTELBRAS";
        outPrimVal.textContent = `CANAL ${matchedCh}.${code}`;
        outPrimVal.style.color = "#C5A869";
        outSubLbl.textContent = `REFERÊNCIA (${CHANNELS[matchedCh]} MHz)`;
        outSubVal.textContent = `Canal ${matchedCh} • Código ${code} (${sub.type === "OFF" ? "Sem Subtom" : sub.type + " " + sub.val})`;
      } else {
        outPrimLbl.textContent = "CÓDIGO NO MOTOROLA / INTELBRAS";
        outPrimVal.textContent = "FORA DA TABELA FRS";
        outPrimVal.style.color = "#FCA5A5";
        outSubLbl.textContent = "VERIFICAÇÃO";
        outSubVal.textContent = "Use uma frequência UHF padrão FRS/GMRS dos canais 1 a 26.";
      }
    }

    function syncQuickFromSelects() {
      const c = parseInt(chSel.value, 10) || 1;
      const d = parseInt(cdSel.value, 10) || 0;
      if (quickInp) quickInp.value = `${c}.${d}`;
      if (radioMode === "M2B") renderM2B(c, d);
    }

    if (quickInp) {
      quickInp.addEventListener("input", function () {
        const cleaned = (this.value || "").trim().replace(/[-_\s]+/g, ".");
        const parts = cleaned.split(".");
        const ch = parseInt(parts[0], 10);
        const code = parts.length > 1 && parts[1] !== "" ? parseInt(parts[1], 10) : 0;
        if (!isNaN(ch) && ch >= 1 && ch <= 26) {
          chSel.value = String(ch);
          const safeCode = (!isNaN(code) && code >= 0 && code <= 121) ? code : 0;
          cdSel.value = String(safeCode);
          if (radioMode === "M2B") renderM2B(ch, safeCode);
        }
      });
    }
    chSel.addEventListener("change", syncQuickFromSelects);
    cdSel.addEventListener("change", syncQuickFromSelects);
    fqSel.addEventListener("change", function () { if (fqCustom) fqCustom.value = ""; if (radioMode === "B2M") renderB2M(); });
    if (fqCustom) fqCustom.addEventListener("input", function () { if (radioMode === "B2M") renderB2M(); });
    sbSel.addEventListener("change", function () { if (radioMode === "B2M") renderB2M(); });

    function setRadioMode(nextMode) {
      radioMode = nextMode;
      const bM2B = document.getElementById("azRadioModeM2B");
      const bB2M = document.getElementById("azRadioModeB2M");
      const boxM = document.getElementById("azRadioM2BBox");
      const boxB = document.getElementById("azRadioB2MBox");
      if (bM2B) bM2B.classList.toggle("is-active", nextMode === "M2B");
      if (bB2M) bB2M.classList.toggle("is-active", nextMode === "B2M");
      if (boxM) boxM.style.display = nextMode === "M2B" ? "flex" : "none";
      if (boxB) boxB.style.display = nextMode === "B2M" ? "flex" : "none";
      if (nextMode === "M2B") syncQuickFromSelects();
      else renderB2M();
    }

    onClick("azRadioModeM2B", function () { setRadioMode("M2B"); });
    onClick("azRadioModeB2M", function () { setRadioMode("B2M"); });
    onClick("azCloseRadioConvBtn", function () {
      document.getElementById("azRadioConvModal").classList.remove("is-open");
    });
    window.azOpenRadioConvModal = function () {
      setRadioMode(radioMode);
      document.getElementById("azRadioConvModal").classList.add("is-open");
    };
    renderM2B(1, 9);
  })();
  onClick("azClosePhotoViewerBtn", function () { document.getElementById("azPhotoViewerModal").classList.remove("is-open"); });
  onClick("azPhotoViewerRouteBtn", function () { document.getElementById("azPhotoViewerModal").classList.remove("is-open"); if (tac.activePin) generateRouteToTarget(tac.activePin.lat, tac.activePin.lng, tac.activePin.label); });
  onClick("azPhotoViewerEditBtn", function () {
    document.getElementById("azPhotoViewerModal").classList.remove("is-open");
    if (tac.activePin) openPinEditorModal(tac.activePin, { lng: tac.activePin.lng, lat: tac.activePin.lat }, tac.activePin.type || "photo_pin");
  });
  onClick("azPhotoViewerMoveBtn", function () {
    document.getElementById("azPhotoViewerModal").classList.remove("is-open");
    if (tac.activePin) openRemoteFineTune(tac.activePin);
  });
  onClick("azPhotoViewerDeleteBtn", function () { document.getElementById("azPhotoViewerModal").classList.remove("is-open"); if (tac.activePin) deletePinById(tac.activePin.id); });

  // Inspeção do Aliado
  onClick("azCloseMateInspectBtn", function () { document.getElementById("azMateInspectModal").classList.remove("is-open"); });
  onClick("azMateInspectBloodhoundBtn", function () {
    document.getElementById("azMateInspectModal").classList.remove("is-open");
    const mate = tac.teammates[tac.selectedMateUid];
    if (mate) {
      setBloodhoundTarget({
        type: "mate",
        id: mate.uid,
        label: mate.qra || "ALIADO",
        lat: mate.lat,
        lng: mate.lng,
        color: getColorHex(mate.colorId)
      });
      showToast("CÃO DE BUSCA rastreando aliado: " + (mate.qra || "ALIADO"));
    }
  });
  onClick("azMateInspectPegadasBtn", function () {
    document.getElementById("azMateInspectModal").classList.remove("is-open");
    const uid = tac.selectedMateUid;
    const mate = tac.teammates[uid] || (tac.matePassivePegadas && tac.matePassivePegadas[uid]);
    if (uid) {
      togglePegadasForUid(uid, (mate && mate.qra) || "ALIADO", mate && mate.colorId);
    }
  });
  onClick("azMateInspectRouteBtn", function () {
    document.getElementById("azMateInspectModal").classList.remove("is-open");
    const mate = tac.teammates[tac.selectedMateUid];
    if (mate) generateRouteToTarget(mate.lat, mate.lng, mate.qra);
  });
  onClick("azMateFollowDroneBtn", function () {
    document.getElementById("azMateInspectModal").classList.remove("is-open");
    const uid = tac.selectedMateUid;
    if (uid && typeof openDroneMode === "function") window.AzTac.openDroneMode(uid);
  });
  onClick("azMateRemoveAudioBtn", function () {
    const uid = tac.selectedMateUid;
    const mate = tac.teammates[uid];
    if (!uid || !mate) return;
    const isBlocked = tac.audioBlockedUids && tac.audioBlockedUids.has(uid);
    if (isBlocked) restoreUidToAudioChannel(uid, mate.qra);
    else removeUidFromAudioChannel(uid, mate.qra);
    renderMateInspectorContent();
  });

  // Conexão, Mensagens Rápidas (SEM SOM para quem emite) & Encerrar
  onClick("azConnectNetBtn", function () {
    unlockAudioOutput();
    const qra = (document.getElementById("azMyQraInput").value || "").trim().toUpperCase();
    const room = (document.getElementById("azRoomCodeInput").value || "").trim().toUpperCase();
    if (!qra || !room) { showToast("Preencha QRA e Equipe."); return; }
    tac.myQra = qra; tac.roomCode = room;
    localStorage.setItem("az_tac_my_qra", qra);
    localStorage.setItem("az_tac_room", room);
    removeGhostForUid(tac.myId);
    connectLiveRoom();
  });

  document.querySelectorAll("[data-quick-msg]").forEach(function (b) {
    b.addEventListener("click", function () {
      const txt = b.getAttribute("data-quick-msg");
      broadcastPacket({ kind: "msg", text: txt });
      showToast(`Enviado: ${txt}`);
    });
  });

  onClick("azSendSilentMsgBtn", function () {
    const inp = document.getElementById("azSilentMsgInput");
    const txt = (inp.value || "").trim();
    if (!txt) return;
    broadcastPacket({ kind: "msg", text: txt });
    inp.value = "";
    showToast(`Enviado: ${txt}`);
  });

  onClick("azAudioMuteToggleBtn", function () {
    tac.audioMuted = !tac.audioMuted;
    this.textContent = tac.audioMuted ? "ÁUDIO MUDO" : "ÁUDIO ATIVO";
    this.style.color = tac.audioMuted ? "#EF4444" : "#4ADE80";
  });

  onClick("azToggleGhostExitBtn", function () {
    tac.ghostEnabled = !tac.ghostEnabled;
    localStorage.setItem("az_tac_ghost_exit", tac.ghostEnabled ? "1" : "0");
    this.textContent = tac.ghostEnabled ? "MARCADOR DE SAÍDA: ATIVADO" : "MARCADOR DE SAÍDA: DESATIVADO";
  });

  onClick("azSaveFirebaseBtn", function () {
    tac.firebaseUrl = (document.getElementById("azFirebaseUrlInput").value || "").trim();
    localStorage.setItem("az_tac_fb_url", tac.firebaseUrl);
    showToast("Configuração salva.");
  });

  onClick("azNavChevronToggleBtn", function () {
    document.body.classList.toggle("az-nav-hidden");
  });

  onClick("azEndSessionBtn", function () {
    if (!window.confirm("Deseja realmente sair?")) return;
    if (window.confirm("Salvar mapas e coordenadas?")) {
      const geojson = {
        type: "FeatureCollection",
        features: tac.pins.map(function (p) {
          return {
            type: "Feature",
            geometry: { type: "Point", coordinates: [p.lng, p.lat] },
            properties: { id: p.id, type: p.type, label: p.label, caption: p.rawTitle || "", exportedAt: new Date().toISOString() }
          };
        })
      };
      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/geo+json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `azimute_turno_${tac.roomCode || "mapa"}_${Date.now()}.geojson`;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    if (tac.isRecordingPtt) stopSelectedPtt();
    closeAllRtcPeers();
    if (tac.roomCode) broadcastPacket({ kind: "leave" });
    if (tac.ws) { try { tac.ws.close(); } catch (_) {} tac.ws = null; }

    const lastPos = tac.myPos;
    const lastQra = tac.myQra || "OPERADOR";
    tac.pins.forEach(function (p) { p.markers.forEach(function (i) { i.marker.remove(); }); });
    tac.pins = [];
    tac.undoHistory = [];
    tac.bloodhoundTarget = null;
    updateBloodhoundVector();
    clearCircleFromMaps(false);
    clearRouteFromMaps();

    if (tac.ghostEnabled && lastPos) {
      const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      upsertTacticalPin({
        id: "ghost_" + tac.myId,
        type: "ghost",
        isGhost: true,
        lastSeenStr: nowStr,
        label: `[OFF] ${lastQra}`,
        rawTitle: lastQra,
        colorHex: "#9CA3AF",
        lng: lastPos.lng,
        lat: lastPos.lat
      }, true);
    }

    tac.roomCode = "";
    tac.roomJoined = false;
    localStorage.removeItem("az_tac_room");
    document.getElementById("azRoomCodeInput").value = "";
    document.getElementById("azLiveNetStatus").textContent = "SESSÃO ENCERRADA";
    document.getElementById("azLiveNetStatus").style.color = "#EF4444";
    renderOnlineMembersList();
    if (typeof syncWaGroupHeaderAndMembers === "function") window.AzTac.syncWaGroupHeaderAndMembers();
    syncSinglePttMode();
    closeDock();
    showToast("Sessão encerrada.");
  });

  // ================= ROLAGEM LATERAL NA GEOLOCALIZAÇÃO =================
  let azGeoScrolledDown = false;
  window.toggleAzGeoQuickScroll = function () {
    const icon = document.getElementById("azGeoQuickScrollIcon");
    const lbl = document.getElementById("azGeoQuickScrollLbl");
    if (!azGeoScrolledDown) {
      const target = document.getElementById("localWeatherSummaryCard") || document.getElementById("azimuteLiveGpsHud");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      azGeoScrolledDown = true;
      if (icon) icon.setAttribute("data-lucide", "chevrons-up");
      if (lbl) lbl.textContent = "Subir";
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      azGeoScrolledDown = false;
      if (icon) icon.setAttribute("data-lucide", "chevrons-down");
      if (lbl) lbl.textContent = "Descer";
    }
    if (typeof lucide !== "undefined") lucide.createIcons();
  };

  onClick("azExpandMapScreenBtn", function () {
    const expanded = document.body.classList.toggle("az-map-expanded");
    this.classList.toggle("is-active", expanded);
    this.title = expanded ? "Sair da Tela Cheia" : "Expandir Mapa";
    const topShell = document.getElementById("azTopHudShell");
    const topSlot = document.getElementById("azTopHudSlot");
    if (topShell) {
      if (expanded) {
        if (topShell.parentElement !== document.body) document.body.appendChild(topShell);
      } else if (topSlot && topShell.parentElement !== topSlot) {
        topSlot.appendChild(topShell);
      }
    }
    if (typeof window.azSyncExpandedViewportVars === "function") window.azSyncExpandedViewportVars();
    const doResize = function () {
      if (typeof window.azSyncExpandedViewportVars === "function") window.azSyncExpandedViewportVars();
      if (window.azGeoMap && typeof window.azGeoMap.resize === "function") window.azGeoMap.resize();
      renderEdgeIndicators();
    };
    setTimeout(doResize, 60);
    setTimeout(doResize, 260);
  });


  // ==================== CONTROLES DE MODAL, UPLOAD E CROQUI DE PLANTA (BLOCO 4) ====================
  (function initPlantaRubberSheetUi() {
    let rawUploadCanvas = null;
    let uploadFilterMode = "orig";
    let sketchTool = "free";
    let sketchColor = "#FFFFFF";
    let sketchWidth = 4;
    let sketchHistory = [];

    function switchPlantaTab(tabId) {
      const panes = { list: "azPlantaPaneList", upload: "azPlantaPaneUpload", sketch: "azPlantaPaneSketch" };
      Object.keys(panes).forEach(function (k) {
        const el = document.getElementById(panes[k]);
        if (el) el.style.display = k === tabId ? "flex" : "none";
      });
      document.querySelectorAll("[data-fp-tab]").forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-fp-tab") === tabId);
      });
      if (tabId === "list") renderFloorplansListModal();
    }

    document.querySelectorAll("[data-fp-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () { switchPlantaTab(btn.getAttribute("data-fp-tab")); });
    });
    onClick("azPlantaGoUploadBtn", function () { switchPlantaTab("upload"); });
    onClick("azPlantaGoSketchBtn", function () { switchPlantaTab("sketch"); });
    onClick("azClosePlantaModalBtn", function () {
      const m = document.getElementById("azPlantaModal");
      if (m) m.classList.remove("is-open");
      refreshLeftControls();
    });

    function canvasToCompactFloorplanUrl(cv, hasAlpha) {
      let cur = cv;
      for (let attempt = 0; attempt < 2; attempt++) {
        const url = hasAlpha ? cur.toDataURL("image/png") : cur.toDataURL("image/jpeg", attempt === 0 ? 0.76 : 0.62);
        if (url.length <= 290000 || attempt === 1) return url;
        const small = document.createElement("canvas");
        const sc = 0.72;
        small.width = Math.max(120, Math.round(cur.width * sc));
        small.height = Math.max(90, Math.round(cur.height * sc));
        const sctx = small.getContext("2d");
        sctx.drawImage(cur, 0, 0, small.width, small.height);
        cur = small;
      }
      return cur.toDataURL("image/png");
    }

    function applyUploadFilterPreview() {
      const pv = document.getElementById("azPlantaPreviewCanvas");
      const emptyEl = document.getElementById("azPlantaPreviewEmpty");
      const anchorBtn = document.getElementById("azPlantaAnchorUploadBtn");
      if (!pv || !rawUploadCanvas) return;
      pv.width = rawUploadCanvas.width;
      pv.height = rawUploadCanvas.height;
      const pctx = pv.getContext("2d");
      pctx.clearRect(0, 0, pv.width, pv.height);
      pctx.drawImage(rawUploadCanvas, 0, 0);

      if (uploadFilterMode === "transp" || uploadFilterMode === "contrast") {
        const imgData = pctx.getImageData(0, 0, pv.width, pv.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          const isPaper = luma > 188 && (mx - mn) < 42;
          if (uploadFilterMode === "transp") {
            if (isPaper) {
              d[i + 3] = 0;
            } else if (luma > 158 && (mx - mn) < 42) {
              d[i + 3] = Math.round(((188 - luma) / 30) * d[i + 3]);
            }
          } else {
            // Alto contraste p/ satélite: fundo claro vira transparente e traços ficam brancos nítidos
            if (luma > 165 && (mx - mn) < 45) {
              d[i + 3] = 0;
            } else {
              d[i] = 248; d[i + 1] = 250; d[i + 2] = 252;
              d[i + 3] = 255;
            }
          }
        }
        pctx.putImageData(imgData, 0, 0);
      }
      if (emptyEl) emptyEl.style.display = "none";
      if (anchorBtn) anchorBtn.disabled = false;
    }

    document.querySelectorAll("[data-fp-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        uploadFilterMode = btn.getAttribute("data-fp-filter") || "orig";
        document.querySelectorAll("[data-fp-filter]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        applyUploadFilterPreview();
      });
    });

    onClick("azPlantaPickFileBtn", function () {
      const inp = document.getElementById("azPlantaFileInput");
      if (inp) { inp.value = ""; inp.click(); }
    });

    const fileInp = document.getElementById("azPlantaFileInput");
    if (fileInp) {
      fileInp.addEventListener("change", function (e) {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          const img = new Image();
          img.onload = function () {
            const MAX_PX = 960;
            let w = img.naturalWidth || img.width || 600;
            let h = img.naturalHeight || img.height || 400;
            if (w > MAX_PX || h > MAX_PX) {
              const sc = MAX_PX / Math.max(w, h);
              w = Math.max(120, Math.round(w * sc));
              h = Math.max(90, Math.round(h * sc));
            }
            const c = document.createElement("canvas");
            c.width = w; c.height = h;
            c.getContext("2d").drawImage(img, 0, 0, w, h);
            rawUploadCanvas = c;
            const nameInp = document.getElementById("azPlantaUploadName");
            if (nameInp && !nameInp.value.trim()) {
              nameInp.value = `PLANTA ${(tac.floorplans || []).length + 1}`;
            }
            applyUploadFilterPreview();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(f);
      });
    }

    function anchorFloorplanOnMap(rawName, dataUrl, aspectRatio) {
      const m = getActiveMap();
      const c = m ? m.getCenter() : (tac.myPos ? { lng: tac.myPos.lng, lat: tac.myPos.lat } : { lng: -43.9352, lat: -19.9245 });
      let halfH = 16;
      if (m && typeof m.getBounds === "function") {
        const b = m.getBounds();
        const spanLatM = Math.abs(b.getNorth() - b.getSouth()) * 111320;
        halfH = Math.max(6, Math.min(280, Number((spanLatM * 0.22).toFixed(2))));
      }
      const asp = Math.max(0.25, Math.min(4, Number(aspectRatio) || 1.4));
      const fp = {
        id: "fp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 5),
        label: (rawName || "").trim().toUpperCase() || `PLANTA ${(tac.floorplans || []).length + 1}`,
        dataUrl: dataUrl,
        centerLng: Number(c.lng.toFixed(7)),
        centerLat: Number(c.lat.toFixed(7)),
        halfH_m: halfH,
        halfW_m: Number((halfH * asp).toFixed(2)),
        angleDeg: 0,
        opacity: 0.68,
        locked: false,
        visible: true,
        aspect: asp
      };
      tac.floorplans = tac.floorplans || [];
      tac.floorplans.push(fp);
      tac.activeFloorplanId = fp.id;
      tac.editingFloorplanId = fp.id;
      pushUndoAction({ type: "fp_add", fp: cloneTacData(fp) });
      renderFloorplansOnMaps(false);
      document.getElementById("azPlantaModal").classList.remove("is-open");
      document.getElementById("azPlantaAdjustBar").classList.add("is-open");
      syncFloorplanAdjustBar();
      refreshLeftControls();
      showToast(`"${fp.label}" ancorada! Arraste as alças sobre o telhado e toque em TRAVAR PLANTA.`);
    }

    onClick("azPlantaAnchorUploadBtn", function () {
      const pv = document.getElementById("azPlantaPreviewCanvas");
      if (!pv || !rawUploadCanvas) { showToast("Escolha uma imagem primeiro."); return; }
      const nameVal = document.getElementById("azPlantaUploadName")?.value || "";
      const hasAlpha = uploadFilterMode !== "orig";
      const dataUrl = canvasToCompactFloorplanUrl(pv, hasAlpha);
      anchorFloorplanOnMap(nameVal, dataUrl, pv.width / Math.max(1, pv.height));
    });

    // Canvas de Croqui Rápido Transparente
    const skCv = document.getElementById("azPlantaSketchCanvas");
    if (skCv) {
      const sctx = skCv.getContext("2d");
      let drawing = false;
      let startX = 0, startY = 0;
      let snapBeforeShape = null;

      function saveSketchSnapshot() {
        try {
          sketchHistory.push(sctx.getImageData(0, 0, skCv.width, skCv.height));
          if (sketchHistory.length > 25) sketchHistory.shift();
        } catch (_) {}
      }

      function getSkPt(ev) {
        const r = skCv.getBoundingClientRect();
        const cx = (ev.touches && ev.touches[0] ? ev.touches[0].clientX : ev.clientX);
        const cy = (ev.touches && ev.touches[0] ? ev.touches[0].clientY : ev.clientY);
        return {
          x: ((cx - r.left) / Math.max(1, r.width)) * skCv.width,
          y: ((cy - r.top) / Math.max(1, r.height)) * skCv.height
        };
      }

      function setupCtxStyle() {
        sctx.lineCap = "round";
        sctx.lineJoin = "round";
        sctx.lineWidth = sketchTool === "erase" ? Math.max(14, sketchWidth * 3) : sketchWidth;
        if (sketchTool === "erase") {
          sctx.globalCompositeOperation = "destination-out";
          sctx.strokeStyle = "rgba(0,0,0,1)";
        } else {
          sctx.globalCompositeOperation = "source-over";
          sctx.strokeStyle = sketchColor;
        }
      }

      skCv.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        try { skCv.setPointerCapture(ev.pointerId); } catch (_) {}
        saveSketchSnapshot();
        const pt = getSkPt(ev);
        startX = pt.x; startY = pt.y;
        drawing = true;
        setupCtxStyle();
        if (sketchTool === "free" || sketchTool === "erase") {
          sctx.beginPath();
          sctx.moveTo(pt.x, pt.y);
          sctx.lineTo(pt.x + 0.1, pt.y + 0.1);
          sctx.stroke();
        } else {
          snapBeforeShape = sctx.getImageData(0, 0, skCv.width, skCv.height);
        }
      });

      skCv.addEventListener("pointermove", function (ev) {
        if (!drawing) return;
        ev.preventDefault();
        const pt = getSkPt(ev);
        setupCtxStyle();
        if (sketchTool === "free" || sketchTool === "erase") {
          sctx.lineTo(pt.x, pt.y);
          sctx.stroke();
        } else if (snapBeforeShape) {
          sctx.putImageData(snapBeforeShape, 0, 0);
          sctx.beginPath();
          if (sketchTool === "line") {
            sctx.moveTo(startX, startY);
            sctx.lineTo(pt.x, pt.y);
          } else if (sketchTool === "rect") {
            sctx.strokeRect(startX, startY, pt.x - startX, pt.y - startY);
          } else if (sketchTool === "door") {
            const rad = Math.max(8, Math.hypot(pt.x - startX, pt.y - startY));
            const ang = Math.atan2(pt.y - startY, pt.x - startX);
            sctx.moveTo(startX, startY);
            sctx.lineTo(startX + Math.cos(ang) * rad, startY + Math.sin(ang) * rad);
            sctx.moveTo(startX, startY);
            sctx.arc(startX, startY, rad, ang, ang + Math.PI * 0.5);
          }
          sctx.stroke();
        }
      });

      function endSk() {
        drawing = false;
        snapBeforeShape = null;
        sctx.globalCompositeOperation = "source-over";
      }
      skCv.addEventListener("pointerup", endSk);
      skCv.addEventListener("pointercancel", endSk);

      onClick("azSketchUndoBtn", function () {
        if (!sketchHistory.length) { showToast("Nada para desfazer no croqui."); return; }
        const prev = sketchHistory.pop();
        sctx.putImageData(prev, 0, 0);
      });

      onClick("azSketchClearBtn", function () {
        saveSketchSnapshot();
        sctx.clearRect(0, 0, skCv.width, skCv.height);
      });

      onClick("azPlantaAnchorSketchBtn", function () {
        const px = sctx.getImageData(0, 0, skCv.width, skCv.height).data;
        let hasInk = false;
        for (let i = 3; i < px.length; i += 4) {
          if (px[i] > 10) { hasInk = true; break; }
        }
        if (!hasInk) { showToast("Desenhe o croqui antes de ancorar no mapa."); return; }
        const nameVal = document.getElementById("azPlantaSketchName")?.value || `CROQUI ${(tac.floorplans || []).length + 1}`;
        const url = canvasToCompactFloorplanUrl(skCv, true);
        anchorFloorplanOnMap(nameVal, url, skCv.width / skCv.height);
      });
    }

    document.querySelectorAll("[data-sk-tool]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sketchTool = btn.getAttribute("data-sk-tool") || "free";
        document.querySelectorAll("[data-sk-tool]").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      });
    });
    document.querySelectorAll("[data-sk-color]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sketchColor = btn.getAttribute("data-sk-color") || "#FFFFFF";
        document.querySelectorAll("[data-sk-color]").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      });
    });
    document.querySelectorAll("[data-sk-width]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        sketchWidth = parseInt(btn.getAttribute("data-sk-width"), 10) || 4;
        document.querySelectorAll("[data-sk-width]").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      });
    });

    // Barra Flutuante de Ajuste Rubber Sheet
    function getBarTargetFp() {
      const id = tac.editingFloorplanId || tac.activeFloorplanId;
      return (tac.floorplans || []).find(function (x) { return x.id === id; }) || null;
    }

    const opSlider = document.getElementById("azFpOpacityRange");
    if (opSlider) {
      let opPrev = null;
      opSlider.addEventListener("pointerdown", function () {
        const fp = getBarTargetFp();
        opPrev = fp ? cloneTacData(fp) : null;
      });
      opSlider.addEventListener("input", function () {
        const fp = getBarTargetFp();
        if (!fp) return;
        fp.opacity = Math.max(0.1, Math.min(1, parseInt(this.value, 10) / 100));
        const valEl = document.getElementById("azFpOpacityVal");
        if (valEl) valEl.textContent = `${Math.round(fp.opacity * 100)}%`;
        updateFloorplanSourceFast(fp);
      });
      opSlider.addEventListener("change", function () {
        const fp = getBarTargetFp();
        if (!fp) return;
        if (opPrev) pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: opPrev, next: cloneTacData(fp) });
        opPrev = null;
        renderFloorplansOnMaps(false);
      });
    }

    const angSlider = document.getElementById("azFpAngleRange");
    if (angSlider) {
      let angPrev = null;
      angSlider.addEventListener("pointerdown", function () {
        const fp = getBarTargetFp();
        angPrev = fp ? cloneTacData(fp) : null;
      });
      angSlider.addEventListener("input", function () {
        const fp = getBarTargetFp();
        if (!fp) return;
        fp.angleDeg = ((parseInt(this.value, 10) || 0) % 360 + 360) % 360;
        const valEl = document.getElementById("azFpAngleVal");
        if (valEl) valEl.textContent = `${fp.angleDeg}°`;
        updateFloorplanSourceFast(fp);
      });
      angSlider.addEventListener("change", function () {
        const fp = getBarTargetFp();
        if (!fp) return;
        if (angPrev) pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: angPrev, next: cloneTacData(fp) });
        angPrev = null;
        renderFloorplansOnMaps(false);
      });
    }

    function stepFloorplanAngle(delta) {
      const fp = getBarTargetFp();
      if (!fp) return;
      const prev = cloneTacData(fp);
      fp.angleDeg = (((Number(fp.angleDeg) || 0) + delta) % 360 + 360) % 360;
      pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prev, next: cloneTacData(fp) });
      renderFloorplansOnMaps(false);
    }
    onClick("azFpAngleMinusBtn", function () { stepFloorplanAngle(-5); });
    onClick("azFpAnglePlusBtn", function () { stepFloorplanAngle(5); });
    onClick("azFpRot90Btn", function () { stepFloorplanAngle(90); });

    document.querySelectorAll("[data-fp-tint]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const fp = getBarTargetFp();
        if (!fp) return;
        const tint = btn.getAttribute("data-fp-tint") || "orig";
        if (!fp.origDataUrl) fp.origDataUrl = fp.dataUrl;
        if (tint === "orig") {
          const prev = cloneTacData(fp);
          fp.dataUrl = fp.origDataUrl;
          fp.tintColor = "orig";
          pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prev, next: cloneTacData(fp) });
          renderFloorplansOnMaps(false);
          showToast("Cor original da planta restaurada.");
          return;
        }
        const img = new Image();
        img.onload = function () {
          const cv = document.createElement("canvas");
          cv.width = img.naturalWidth || img.width || 520;
          cv.height = img.naturalHeight || img.height || 340;
          const ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
          const idata = ctx.getImageData(0, 0, cv.width, cv.height);
          const d = idata.data;
          let hasAlpha = false;
          for (let i = 3; i < d.length; i += 4) {
            if (d[i] < 235) { hasAlpha = true; break; }
          }
          const rgb = hexToRgb(tint) || [255, 255, 255];
          for (let i = 0; i < d.length; i += 4) {
            if (hasAlpha) {
              if (d[i + 3] > 18) {
                d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2];
              }
            } else {
              const r = d[i], g = d[i + 1], b = d[i + 2];
              const luma = 0.299 * r + 0.587 * g + 0.114 * b;
              const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
              if (luma > 165 && (mx - mn) < 45) {
                d[i + 3] = 0;
              } else {
                d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = 255;
              }
            }
          }
          ctx.putImageData(idata, 0, 0);
          const prev = cloneTacData(fp);
          fp.dataUrl = canvasToCompactFloorplanUrl(cv, true);
          fp.tintColor = tint;
          pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prev, next: cloneTacData(fp) });
          renderFloorplansOnMaps(false);
          showToast("Cor do croqui atualizada no mapa.");
        };
        img.src = fp.origDataUrl;
      });
    });

    function scaleFloorplanFactor(factor) {
      const fp = getBarTargetFp();
      if (!fp) return;
      const prev = cloneTacData(fp);
      fp.halfW_m = Math.max(3, Math.min(900, Number((fp.halfW_m * factor).toFixed(2))));
      fp.halfH_m = Math.max(3, Math.min(900, Number((fp.halfH_m * factor).toFixed(2))));
      pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prev, next: cloneTacData(fp) });
      renderFloorplansOnMaps(false);
    }
    onClick("azFpScaleMinusBtn", function () { scaleFloorplanFactor(0.9); });
    onClick("azFpScalePlusBtn", function () { scaleFloorplanFactor(1.1); });

    onClick("azFpLockToggleBtn", function () {
      const fp = getBarTargetFp();
      if (!fp) return;
      const prev = cloneTacData(fp);
      fp.locked = !fp.locked;
      if (fp.locked) {
        tac.editingFloorplanId = null;
        showToast("Planta travada sobre o imóvel. Toques passam direto para o mapa e WASP.");
      } else {
        tac.editingFloorplanId = fp.id;
        showToast("Planta destravada: ajuste posição, escala e rotação.");
      }
      pushUndoAction({ type: "fp_edit", fpId: fp.id, prev: prev, next: cloneTacData(fp) });
      renderFloorplansOnMaps(false);
      refreshLeftControls();
    });

    onClick("azFpOpenWaspBtn", function () {
      const fp = getBarTargetFp();
      if (fp && !fp.locked) {
        fp.locked = true;
        tac.editingFloorplanId = null;
        renderFloorplansOnMaps(false);
      }
      document.getElementById("azPlantaAdjustBar").classList.remove("is-open");
      disarmAllTacticalTools("wasp_tool");
      tac.toolMode = "wasp_pick";
      refreshLeftControls();
      showToast("Planta travada! Modo Varredura WASP ATIVO: toque nos cômodos para marcar.");
    });

    onClick("azFpCenterMapBtn", function () {
      const fp = getBarTargetFp();
      const m = getActiveMap();
      if (fp && m) m.flyTo({ center: [fp.centerLng, fp.centerLat], zoom: Math.max(m.getZoom(), 18.2), duration: 420 });
    });

    onClick("azFpOpenListBtn", function () {
      renderFloorplansListModal();
      document.getElementById("azPlantaModal").classList.add("is-open");
      switchPlantaTab("list");
    });

    onClick("azFpCloseBarBtn", function () {
      const fp = getBarTargetFp();
      if (fp && !fp.locked) {
        fp.locked = true;
        tac.editingFloorplanId = null;
        renderFloorplansOnMaps(false);
      }
      document.getElementById("azPlantaAdjustBar").classList.remove("is-open");
      refreshLeftControls();
    });
  })();

  // ==================== CONTROLES WASP INTEGRADO (BLOCO 5) ====================
  onClick("azWaspToggleArmBtn", function () {
    const arm = tac.toolMode !== "wasp_pick";
    disarmAllTacticalTools(arm ? "wasp_tool" : null);
    if (arm) {
      (tac.floorplans || []).forEach(function (fp) { fp.locked = true; });
      tac.editingFloorplanId = null;
      const fpBar = document.getElementById("azPlantaAdjustBar");
      if (fpBar) fpBar.classList.remove("is-open");
      renderFloorplansOnMaps(true, true);
    }
    tac.toolMode = arm ? "wasp_pick" : null;
    refreshLeftControls();
    showToast(arm ? "Modo WASP ativo: toque nos cômodos para marcar." : "Marcação WASP pausada (toque nos marcadores para avançar status).");
  });

  onClick("azWaspClearAllBtn", function () {
    if (!Array.isArray(tac.waspItems) || tac.waspItems.length === 0) return;
    const snap = serializeWaspItems();
    tac.waspItems.forEach(function (w) { (w.markers || []).forEach(function (it) { try { it.marker.remove(); } catch (_) {} }); });
    tac.waspItems = [];
    saveWaspsToStorage();
    pushUndoAction({ type: "del_wasps", wasps: snap });
    if (tac.roomCode) broadcastPacket({ kind: "wasp_sync_all", items: [] });
    refreshLeftControls();
    showToast("Marcadores WASP limpos (use DESFAZER para recuperar).");
  });

  onClick("azCloseWaspDetailBtn", function () {
    const m = document.getElementById("azWaspDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingWaspId = null;
  });

  onClick("azSaveWaspDetailBtn", function () {
    const w = (tac.waspItems || []).find(function (x) { return x.id === tac.editingWaspId; });
    if (!w) return;
    const prevSnap = {
      id: w.id, code: w.code, lat: w.lat, lng: w.lng, state: w.state,
      note: w.note || "", qra: w.qra || "", updatedAtStr: w.updatedAtStr || "",
      floorplanId: w.floorplanId || ""
    };
    const newCode = (document.getElementById("azWaspCodeInput")?.value || "").trim().toUpperCase() || w.code;
    const newNote = (document.getElementById("azWaspNoteInput")?.value || "").trim();
    const pickedSt = document.getElementById("azWaspStateGrid")?.getAttribute("data-selected-state") || w.state;
    const stampQra = tac.myQra || "OP";
    const stampHr = formatWaspStampNow();
    const nextObj = {
      id: w.id,
      code: newCode,
      lat: w.lat,
      lng: w.lng,
      state: pickedSt,
      note: newNote,
      qra: stampQra,
      updatedAtStr: stampHr,
      floorplanId: w.floorplanId || ""
    };
    upsertWaspMarker(nextObj, false);
    pushUndoAction({ type: "wasp_edit", waspId: w.id, prev: prevSnap, next: cloneTacData(nextObj) });
    refreshLeftControls();
    const m = document.getElementById("azWaspDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingWaspId = null;
    const stObj = WASP_STATES.find(function (s) { return s.id === pickedSt; }) || WASP_STATES[0];
    showToast(`${newCode}: ${stObj.label}`);
  });

  onClick("azDeleteWaspPointBtn", function () {
    const id = tac.editingWaspId;
    if (!id) return;
    const snap = removeWaspMarkerById(id, false);
    if (snap) pushUndoAction({ type: "del_wasps", wasps: [snap] });
    refreshLeftControls();
    const m = document.getElementById("azWaspDetailModal");
    if (m) m.classList.remove("is-open");
    tac.editingWaspId = null;
    showToast("Ponto WASP removido (use DESFAZER para recuperar).");
  });

  // ==================== MENU HAMBÚRGUER EM CAIXAS PERSONALIZÁVEIS (COR / ORDEM / OCULTAS) ====================
  (function initModularHamburgerDock() {
    const DOCK_STORAGE_KEY = "az_tac_dock_layout_v3";
    const DEFAULT_BOX_DEFS = [
      { id: "box_markers", name: "Marcadores & Alvos", collapsed: false, items: ["gpe", "pin_edit", "vtr_pin", "photo_coord_pin", "flag_tool", "bloodhound_pick", "wasp_tool"] },
      { id: "box_draw", name: "Desenho & Terreno", collapsed: false, items: ["draw_free", "eraser_tool", "text_tool", "geom_tool", "circle_tool", "trace_escada", "trace_beco", "trace_cerca", "trace_barricada", "planta_tool"] },
      { id: "box_nav", name: "Navegação & Rota", collapsed: false, items: ["draw_route", "clear_route_tool", "trail_tool", "toggle_ruler", "toggle_sat", "grg_tool", "drone_mode"] },
      { id: "box_comms", name: "Comunicação & Equipe", collapsed: false, items: ["radio_conv_tool", "enlace_tool", "pinned_poll_tool"] },
      { id: "box_sys", name: "Sistema", collapsed: false, items: ["wheel_settings", "clear_all"] }
    ];

    const dockEl = document.getElementById("azAtakRightDock");
    const mainGrid = document.getElementById("azDockMainGrid");
    const foldersWrap = document.getElementById("azDockFoldersWrap");
    const hiddenDrawer = document.getElementById("azDockHiddenDrawer");
    if (!dockEl || !mainGrid || !foldersWrap || !hiddenDrawer) return;

    const tileByAct = {};
    const defaultOrder = [];
    Array.from(mainGrid.querySelectorAll("button[data-grid-act]")).forEach(function (btn) {
      const act = btn.getAttribute("data-grid-act");
      if (act && !tileByAct[act]) {
        tileByAct[act] = btn;
        defaultOrder.push(act);
      }
    });

    function buildDefaultGridLayout() {
      return {
        mainOrder: defaultOrder.slice(),
        hiddenIds: [],
        folders: [],
        hiddenCollapsed: true
      };
    }

    function buildGroupedByTypeLayout(preserveHiddenIds) {
      const hiddenSet = new Set(Array.isArray(preserveHiddenIds) ? preserveHiddenIds.filter(function (id) { return Boolean(tileByAct[id]); }) : []);
      const used = new Set(hiddenSet);
      const folders = DEFAULT_BOX_DEFS.map(function (b) {
        const valid = b.items.filter(function (id) {
          if (tileByAct[id] && !used.has(id)) { used.add(id); return true; }
          return false;
        });
        return { id: b.id, name: b.name, collapsed: Boolean(b.collapsed), items: valid };
      });
      const leftovers = [];
      defaultOrder.forEach(function (id) {
        if (!used.has(id)) { used.add(id); leftovers.push(id); }
      });
      if (leftovers.length > 0 && folders.length > 0) {
        folders[folders.length - 1].items = folders[folders.length - 1].items.concat(leftovers);
      }
      return {
        mainOrder: [],
        hiddenIds: Array.from(hiddenSet),
        folders: folders,
        hiddenCollapsed: true
      };
    }

    function loadDockLayout() {
      const base = buildDefaultGridLayout();
      try {
        const raw = JSON.parse(localStorage.getItem(DOCK_STORAGE_KEY) || "null");
        if (!raw || typeof raw !== "object") return base;
        const used = new Set();
        const cleanMain = (Array.isArray(raw.mainOrder) ? raw.mainOrder : []).filter(function (id) {
          if (tileByAct[id] && !used.has(id)) { used.add(id); return true; }
          return false;
        });
        const cleanFolders = (Array.isArray(raw.folders) ? raw.folders : []).map(function (fld, fIdx) {
          const items = (Array.isArray(fld.items) ? fld.items : []).filter(function (id) {
            if (tileByAct[id] && !used.has(id)) { used.add(id); return true; }
            return false;
          });
          return {
            id: fld.id || ("box_" + Date.now() + "_" + fIdx),
            name: (String(fld.name || "Pasta").trim() || "Pasta").slice(0, 22),
            collapsed: Boolean(fld.collapsed),
            items: items
          };
        });
        const cleanHidden = (Array.isArray(raw.hiddenIds) ? raw.hiddenIds : []).filter(function (id) {
          if (tileByAct[id] && !used.has(id)) { used.add(id); return true; }
          return false;
        });
        // Auto-anexa novas ferramentas futuras sem perder nenhuma
        defaultOrder.forEach(function (id) {
          if (!used.has(id)) {
            used.add(id);
            if (cleanMain.length === 0 && cleanFolders.length > 0) cleanFolders[cleanFolders.length - 1].items.push(id);
            else cleanMain.push(id);
          }
        });
        return {
          mainOrder: cleanMain,
          hiddenIds: cleanHidden,
          folders: cleanFolders,
          hiddenCollapsed: raw.hiddenCollapsed !== false
        };
      } catch (_) {
        return base;
      }
    }

    let layout = loadDockLayout();
    let folderFormMode = null;

    function saveDockLayout() {
      try { localStorage.setItem(DOCK_STORAGE_KEY, JSON.stringify(layout)); } catch (_) {}
    }

    function removeActEverywhere(act) {
      layout.mainOrder = layout.mainOrder.filter(function (x) { return x !== act; });
      layout.hiddenIds = layout.hiddenIds.filter(function (x) { return x !== act; });
      layout.folders.forEach(function (f) {
        f.items = f.items.filter(function (x) { return x !== act; });
      });
    }

    function moveActToContainer(act, targetLoc, beforeAct) {
      if (!tileByAct[act]) return;
      removeActEverywhere(act);
      let arr = layout.mainOrder;
      if (targetLoc === "hidden") arr = layout.hiddenIds;
      else if (targetLoc !== "main") {
        const fld = layout.folders.find(function (f) { return f.id === targetLoc; });
        if (fld) arr = fld.items;
      }
      if (beforeAct && beforeAct !== act) {
        const idx = arr.indexOf(beforeAct);
        if (idx !== -1) { arr.splice(idx, 0, act); saveDockLayout(); renderDockLayout(); return; }
      }
      arr.push(act);
      saveDockLayout();
      renderDockLayout();
    }

    function stepActInList(arr, act, delta) {
      const idx = arr.indexOf(act);
      const next = idx + delta;
      if (idx === -1 || next < 0 || next >= arr.length) return;
      const tmp = arr[idx];
      arr[idx] = arr[next];
      arr[next] = tmp;
      saveDockLayout();
      renderDockLayout();
    }

    function attachTouchReorderGrip(gripEl, act, locId) {
      let dragging = false;
      let overTarget = null;
      gripEl.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        dragging = true;
        const card = gripEl.closest(".az-org-tile-wrap");
        if (card) card.classList.add("is-dragging");
        try { gripEl.setPointerCapture(ev.pointerId); } catch (_) {}
      });
      gripEl.addEventListener("pointermove", function (ev) {
        if (!dragging) return;
        ev.preventDefault();
        document.querySelectorAll(".az-org-tile-wrap.is-drag-over, .az-dock-folder.is-drag-over, #azDockMainGrid.is-drag-over").forEach(function (el) {
          el.classList.remove("is-drag-over");
        });
        const hit = document.elementFromPoint(ev.clientX, ev.clientY);
        const tileTarget = hit && hit.closest ? hit.closest(".az-org-tile-wrap[data-org-act]") : null;
        const folderTarget = !tileTarget && hit && hit.closest ? hit.closest("[data-org-folder]") : null;
        overTarget = tileTarget || folderTarget || null;
        if (overTarget) overTarget.classList.add("is-drag-over");
      });
      function finishDrag() {
        if (!dragging) return;
        dragging = false;
        document.querySelectorAll(".az-org-tile-wrap.is-dragging, .az-org-tile-wrap.is-drag-over, .az-dock-folder.is-drag-over, #azDockMainGrid.is-drag-over").forEach(function (el) {
          el.classList.remove("is-dragging", "is-drag-over");
        });
        if (overTarget) {
          const targetAct = overTarget.getAttribute("data-org-act");
          const targetLoc = overTarget.getAttribute("data-org-loc") || overTarget.getAttribute("data-org-folder");
          if (targetAct && targetAct !== act && targetLoc) {
            moveActToContainer(act, targetLoc, targetAct);
          } else if (targetLoc && targetLoc !== locId) {
            moveActToContainer(act, targetLoc, null);
          }
        }
        overTarget = null;
      }
      gripEl.addEventListener("pointerup", finishDrag);
      gripEl.addEventListener("pointercancel", finishDrag);
    }

    function buildOrganizeCard(act, arrRef, locId) {
      const tileBtn = tileByAct[act];
      if (!tileBtn) return null;
      const wrap = document.createElement("div");
      wrap.className = "az-org-tile-wrap";
      wrap.setAttribute("data-org-act", act);
      wrap.setAttribute("data-org-loc", locId);
      wrap.appendChild(tileBtn);

      const ctrlRow = document.createElement("div");
      ctrlRow.className = "az-org-ctrl-row";

      const grip = document.createElement("button");
      grip.type = "button";
      grip.className = "az-org-drag-grip";
      grip.title = "Segurar e arrastar";
      grip.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg>';
      attachTouchReorderGrip(grip, act, locId);

      const leftBtn = document.createElement("button");
      leftBtn.type = "button"; leftBtn.className = "az-org-mini-btn"; leftBtn.textContent = "◀";
      leftBtn.title = "Mover antes";
      leftBtn.addEventListener("click", function () { stepActInList(arrRef, act, -1); });

      const rightBtn = document.createElement("button");
      rightBtn.type = "button"; rightBtn.className = "az-org-mini-btn"; rightBtn.textContent = "▶";
      rightBtn.title = "Mover depois";
      rightBtn.addEventListener("click", function () { stepActInList(arrRef, act, 1); });

      const eyeBtn = document.createElement("button");
      eyeBtn.type = "button"; eyeBtn.className = "az-org-mini-btn is-hide";
      const isHidden = locId === "hidden";
      eyeBtn.title = isHidden ? "Restaurar para Grade/Pasta" : "Ocultar para Arquivadas";
      eyeBtn.innerHTML = isHidden
        ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      eyeBtn.addEventListener("click", function () {
        const restoreLoc = (layout.mainOrder.length > 0 || !layout.folders || layout.folders.length === 0) ? "main" : layout.folders[0].id;
        moveActToContainer(act, isHidden ? restoreLoc : "hidden", null);
      });

      ctrlRow.appendChild(grip);
      ctrlRow.appendChild(leftBtn);
      ctrlRow.appendChild(rightBtn);
      ctrlRow.appendChild(eyeBtn);
      wrap.appendChild(ctrlRow);

      const sel = document.createElement("select");
      sel.className = "az-org-move-sel";
      sel.innerHTML =
        `<option value="main"${locId === "main" ? " selected" : ""}>Grade 3×3</option>` +
        layout.folders.map(function (f) {
          return `<option value="${f.id}"${locId === f.id ? " selected" : ""}>Pasta: ${f.name.replace(/</g, "&lt;")}</option>`;
        }).join("") +
        `<option value="hidden"${locId === "hidden" ? " selected" : ""}>Ocultas</option>`;
      sel.addEventListener("change", function () {
        moveActToContainer(act, this.value, null);
      });
      wrap.appendChild(sel);
      return wrap;
    }

    function renderDockLayout() {
      const isOrg = Boolean(tac.dockOrganizeMode);
      dockEl.classList.toggle("is-organizing", isOrg);
      const eyeTopBtn = document.getElementById("azDockOrganizeEyeBtn");
      if (eyeTopBtn) eyeTopBtn.classList.toggle("is-active", isOrg);

      // 1. Grade principal 3x3 (como tela inicial ou área livre do menu)
      mainGrid.innerHTML = "";
      mainGrid.setAttribute("data-org-folder", "main");
      if (layout.mainOrder.length === 0 && !isOrg) {
        mainGrid.style.display = "none";
      } else {
        mainGrid.style.display = "grid";
        mainGrid.className = isOrg ? "az-org-grid" : "az-atak-grid-3x3";
        if (layout.mainOrder.length === 0 && isOrg) {
          mainGrid.innerHTML = '<div style="grid-column:1/-1;font-size:8.5px;color:#9E9A8F;text-align:center;padding:8px;border:1px dashed #2E2D24;border-radius:8px;">Grade 3×3 principal — arraste ou mova ferramentas para cá</div>';
        } else {
          layout.mainOrder.forEach(function (act) {
            const btn = tileByAct[act];
            if (!btn) return;
            if (isOrg) {
              const card = buildOrganizeCard(act, layout.mainOrder, "main");
              if (card) mainGrid.appendChild(card);
            } else {
              mainGrid.appendChild(btn);
            }
          });
        }
      }

      // 2. Pastas / Caixas neutras estilo tela do celular (sem cores)
      foldersWrap.innerHTML = "";
      layout.folders.forEach(function (fld, fIdx) {
        const box = document.createElement("div");
        box.className = "az-dock-folder";
        box.setAttribute("data-org-folder", fld.id);

        const head = document.createElement("div");
        head.className = "az-dock-folder-head";
        const title = document.createElement("div");
        title.className = "az-dock-folder-title";
        title.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><span>${fld.name.replace(/</g, "&lt;")} (${fld.items.length})</span>`;
        head.appendChild(title);

        if (isOrg) {
          const btns = document.createElement("div");
          btns.style.display = "flex";
          btns.style.gap = "3px";

          const upB = document.createElement("button");
          upB.type = "button"; upB.className = "az-org-mini-btn"; upB.textContent = "▲";
          upB.title = "Subir pasta";
          upB.addEventListener("click", function (ev) {
            ev.stopPropagation();
            if (fIdx > 0) {
              const t = layout.folders[fIdx]; layout.folders[fIdx] = layout.folders[fIdx - 1]; layout.folders[fIdx - 1] = t;
              saveDockLayout(); renderDockLayout();
            }
          });

          const dnB = document.createElement("button");
          dnB.type = "button"; dnB.className = "az-org-mini-btn"; dnB.textContent = "▼";
          dnB.title = "Descer pasta";
          dnB.addEventListener("click", function (ev) {
            ev.stopPropagation();
            if (fIdx < layout.folders.length - 1) {
              const t = layout.folders[fIdx]; layout.folders[fIdx] = layout.folders[fIdx + 1]; layout.folders[fIdx + 1] = t;
              saveDockLayout(); renderDockLayout();
            }
          });

          const renB = document.createElement("button");
          renB.type = "button"; renB.className = "az-org-mini-btn";
          renB.title = "Renomear pasta";
          renB.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
          renB.addEventListener("click", function (ev) {
            ev.stopPropagation();
            openFolderInlineForm({ kind: "rename", folderId: fld.id }, fld.name);
          });

          const delB = document.createElement("button");
          delB.type = "button"; delB.className = "az-org-mini-btn is-danger"; delB.textContent = "✕";
          delB.title = "Excluir pasta (devolve ferramentas)";
          delB.addEventListener("click", function (ev) {
            ev.stopPropagation();
            fld.items.forEach(function (act) {
              if (!layout.mainOrder.includes(act)) layout.mainOrder.push(act);
            });
            layout.folders = layout.folders.filter(function (x) { return x.id !== fld.id; });
            saveDockLayout();
            renderDockLayout();
            showToast(`Pasta "${fld.name}" removida; ferramentas devolvidas à grade.`);
          });

          btns.appendChild(upB);
          btns.appendChild(dnB);
          btns.appendChild(renB);
          btns.appendChild(delB);
          head.appendChild(btns);
        } else {
          const chev = document.createElement("span");
          chev.style.fontSize = "9px";
          chev.style.fontWeight = "900";
          chev.style.color = "#9E9A8F";
          chev.textContent = fld.collapsed ? "▸" : "▾";
          head.appendChild(chev);
        }

        head.addEventListener("click", function () {
          fld.collapsed = !fld.collapsed;
          saveDockLayout();
          renderDockLayout();
        });
        box.appendChild(head);

        if (!fld.collapsed || isOrg) {
          const fGrid = document.createElement("div");
          fGrid.className = isOrg ? "az-org-grid" : "az-atak-grid-3x3";
          if (fld.items.length === 0) {
            fGrid.innerHTML = '<div style="grid-column:1/-1;font-size:8.5px;color:#9E9A8F;text-align:center;padding:6px;">Pasta vazia — arraste ou mova ícones para cá</div>';
          } else {
            fld.items.forEach(function (act) {
              const btn = tileByAct[act];
              if (!btn) return;
              if (isOrg) {
                const card = buildOrganizeCard(act, fld.items, fld.id);
                if (card) fGrid.appendChild(card);
              } else {
                fGrid.appendChild(btn);
              }
            });
          }
          box.appendChild(fGrid);
        }
        foldersWrap.appendChild(box);
      });

      // 3. Gaveta Ocultas (Arquivadas)
      hiddenDrawer.innerHTML = "";
      if (layout.hiddenIds.length === 0 && !isOrg) {
        hiddenDrawer.style.display = "none";
      } else {
        hiddenDrawer.style.display = "flex";
        const hHead = document.createElement("div");
        hHead.className = "az-dock-hidden-head";
        hHead.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>Ocultas (${layout.hiddenIds.length})</span><span>${(isOrg || !layout.hiddenCollapsed) ? "▾" : "▸"}</span>`;
        hHead.addEventListener("click", function () {
          layout.hiddenCollapsed = !layout.hiddenCollapsed;
          saveDockLayout();
          renderDockLayout();
        });
        hiddenDrawer.appendChild(hHead);

        if (isOrg || !layout.hiddenCollapsed) {
          const hGrid = document.createElement("div");
          hGrid.className = isOrg ? "az-org-grid" : "az-atak-grid-3x3";
          if (layout.hiddenIds.length === 0) {
            hGrid.innerHTML = '<div style="grid-column:1/-1;font-size:8.5px;color:#9E9A8F;text-align:center;padding:5px;">Nenhuma ferramenta arquivada.</div>';
          } else {
            layout.hiddenIds.forEach(function (act) {
              const btn = tileByAct[act];
              if (!btn) return;
              if (isOrg) {
                const card = buildOrganizeCard(act, layout.hiddenIds, "hidden");
                if (card) hGrid.appendChild(card);
              } else {
                const itemWrap = document.createElement("div");
                itemWrap.className = "az-dock-hidden-item";
                itemWrap.appendChild(btn);
                const unhideBtn = document.createElement("button");
                unhideBtn.type = "button";
                unhideBtn.className = "az-org-mini-btn";
                unhideBtn.style.width = "100%";
                unhideBtn.style.fontSize = "7.5px";
                unhideBtn.textContent = "Restaurar";
                unhideBtn.addEventListener("click", function (ev) {
                  ev.stopPropagation();
                  const restoreLoc = (layout.mainOrder.length > 0 || !layout.folders || layout.folders.length === 0) ? "main" : layout.folders[0].id;
                  moveActToContainer(act, restoreLoc, null);
                });
                itemWrap.appendChild(unhideBtn);
                hGrid.appendChild(itemWrap);
              }
            });
          }
          hiddenDrawer.appendChild(hGrid);
        }
      }
      syncHamburgerAndDockToolsUi();
    }

    function openFolderInlineForm(mode, prefill) {
      folderFormMode = mode;
      const row = document.getElementById("azDockFolderFormRow");
      const inp = document.getElementById("azDockFolderNameInput");
      if (row) row.style.display = "flex";
      if (inp) {
        inp.value = prefill || "";
        inp.focus();
      }
    }

    function closeFolderInlineForm() {
      folderFormMode = null;
      const row = document.getElementById("azDockFolderFormRow");
      if (row) row.style.display = "none";
    }

    onClick("azDockOrganizeEyeBtn", function () {
      tac.dockOrganizeMode = !tac.dockOrganizeMode;
      closeFolderInlineForm();
      renderDockLayout();
    });
    onClick("azDockDoneOrgBtn", function () {
      tac.dockOrganizeMode = false;
      closeFolderInlineForm();
      renderDockLayout();
    });
    onClick("azDockNewFolderBtn", function () {
      openFolderInlineForm({ kind: "new" }, "");
    });
    onClick("azDockFolderCancelBtn", closeFolderInlineForm);
    onClick("azDockFolderConfirmBtn", function () {
      const inp = document.getElementById("azDockFolderNameInput");
      const nm = (inp && inp.value || "").trim().slice(0, 22);
      if (!nm) { showToast("Digite um nome para a pasta."); return; }
      if (folderFormMode && folderFormMode.kind === "rename") {
        const fld = layout.folders.find(function (f) { return f.id === folderFormMode.folderId; });
        if (fld) fld.name = nm;
      } else {
        layout.folders.push({ id: "box_" + Date.now(), name: nm, collapsed: false, items: [] });
      }
      saveDockLayout();
      closeFolderInlineForm();
      renderDockLayout();
    });
    onClick("azDockGroupByTypeBtn", function () {
      layout = buildGroupedByTypeLayout(layout.hiddenIds);
      saveDockLayout();
      closeFolderInlineForm();
      renderDockLayout();
      showToast("Ferramentas agrupadas em pastas neutras por tipo.");
    });
    onClick("azDockResetLayoutBtn", function () {
      layout = buildDefaultGridLayout();
      saveDockLayout();
      closeFolderInlineForm();
      renderDockLayout();
      showToast("Menu restaurado para grade 3×3.");
    });

    renderDockLayout();
  })();

  // ==================== CONTROLES DE ESPESSURA DA CANETA (ANTES E DEPOIS) ====================
  (function initPenAndStrokeControls() {
    function setPreferredPenWidth(px) {
      const w = Math.max(2, Math.min(16, parseInt(px, 10) || 4));
      tac.penWidth = w;
      try { localStorage.setItem("az_tac_pen_width_v1", String(w)); } catch (_) {}
      syncPenDockUi();
    }

    document.querySelectorAll("[data-pen-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setPreferredPenWidth(btn.getAttribute("data-pen-preset"));
      });
    });

    const penRange = document.getElementById("azPenWidthRange");
    if (penRange) {
      penRange.addEventListener("input", function () {
        setPreferredPenWidth(this.value);
      });
    }
    const penBarRange = document.getElementById("azPenBarRange");
    if (penBarRange) {
      penBarRange.addEventListener("input", function () {
        setPreferredPenWidth(this.value);
      });
    }
    onClick("azPenBarCloseBtn", function () {
      setCanetaMode(false);
      showToast("Caneta finalizada.");
    });

    onClick("azPenQuickToggleBtn", function () {
      setCanetaMode(!tac.drawActive);
      if (tac.drawActive) {
        closeDock();
        showToast(`Caneta ativa (${tac.penWidth}px): risque sobre o mapa.`);
      } else {
        showToast("Caneta desativada.");
      }
    });

    // Popover de Edição de Traço Existente (Depois de Desenhar)
    function getEditingStroke() {
      if (!tac.editingStrokeId) return null;
      return (tac.drawStrokes || []).find(function (s) { return s && s.id === tac.editingStrokeId; }) || null;
    }

    function applyStrokeWidthLive(wPx, commitPrev) {
      const st = getEditingStroke();
      if (!st) return;
      const w = Math.max(2, Math.min(16, parseInt(wPx, 10) || 4));
      st.width = w;
      st.strokeWidth = w;
      const rd = document.getElementById("azStrokeWidthReadout");
      const rng = document.getElementById("azStrokeWidthRange");
      if (rd) rd.textContent = `${w}px`;
      if (rng) rng.value = String(w);
      document.querySelectorAll("[data-st-preset]").forEach(function (btn) {
        btn.classList.toggle("is-active", parseInt(btn.getAttribute("data-st-preset"), 10) === w);
      });
      if (commitPrev) {
        pushUndoAction({ type: "stroke_edit", strokeId: st.id, prev: commitPrev, next: cloneTacData(st) });
        renderFreehandStrokes(false);
      } else {
        renderFreehandStrokes(false, true);
      }
    }

    document.querySelectorAll("[data-st-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const st = getEditingStroke();
        if (!st) return;
        const prev = cloneTacData(st);
        applyStrokeWidthLive(btn.getAttribute("data-st-preset"), prev);
      });
    });

    const stRange = document.getElementById("azStrokeWidthRange");
    if (stRange) {
      let stPrev = null;
      stRange.addEventListener("pointerdown", function () {
        const st = getEditingStroke();
        stPrev = st ? cloneTacData(st) : null;
      });
      stRange.addEventListener("input", function () {
        applyStrokeWidthLive(this.value, null);
      });
      stRange.addEventListener("change", function () {
        const st = getEditingStroke();
        if (!st) return;
        if (stPrev) pushUndoAction({ type: "stroke_edit", strokeId: st.id, prev: stPrev, next: cloneTacData(st) });
        stPrev = null;
        renderFreehandStrokes(false);
      });
    }

    document.querySelectorAll("[data-st-color]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const st = getEditingStroke();
        if (!st) return;
        const prev = cloneTacData(st);
        const col = btn.getAttribute("data-st-color") || "#FFFFFF";
        st.color = col;
        document.querySelectorAll("[data-st-color]").forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
        pushUndoAction({ type: "stroke_edit", strokeId: st.id, prev: prev, next: cloneTacData(st) });
        renderFreehandStrokes(false);
      });
    });

    onClick("azDeleteStrokeBtn", function () {
      const idx = (tac.drawStrokes || []).findIndex(function (s) { return s && s.id === tac.editingStrokeId; });
      if (idx === -1) return;
      const removed = cloneTacData(tac.drawStrokes[idx]);
      tac.drawStrokes.splice(idx, 1);
      pushUndoAction({ type: "del_strokes", strokes: [{ idx: idx, stroke: removed }] });
      renderFreehandStrokes(false);
      const pop = document.getElementById("azStrokeEditPopover");
      if (pop) pop.classList.remove("is-open");
      tac.editingStrokeId = null;
      showToast("Traço removido (use DESFAZER para recuperar).");
    });

    onClick("azCloseStrokeEditBtn", function () {
      const pop = document.getElementById("azStrokeEditPopover");
      if (pop) pop.classList.remove("is-open");
      tac.editingStrokeId = null;
    });

    syncPenDockUi();
  })();


  window.AzTac = Object.assign(window.AzTac || {}, {
    tac: tac,
    onClick: onClick,
    showToast: showToast,
    getColorHex: getColorHex,
    getActiveMap: getActiveMap,
    broadcastPacket: broadcastPacket,
    updateHud: updateHud,
    syncSinglePttMode: syncSinglePttMode,
    renderMateOnMap: renderMateOnMap,
    handleIncomingPacket: handleIncomingPacket,
    calcDistAndBearing: calcDistAndBearing,
    renderEdgeIndicators: renderEdgeIndicators,
    SVG_ICONS: SVG_ICONS,
    playTone: playTone,
    unlockAudioOutput: unlockAudioOutput,
    startSelectedPtt: startSelectedPtt,
    stopSelectedPtt: stopSelectedPtt,
    isMapTabVisible: isMapTabVisible,
    cloneTacData: cloneTacData,
    pushUndoAction: pushUndoAction,
    refreshLeftControls: refreshLeftControls,
    renderTerrainTracesOnMaps: renderTerrainTracesOnMaps,
    calcTraceDistanceMeters: calcTraceDistanceMeters,
    TERRAIN_TRACE_META: TERRAIN_TRACE_META,
    connectLiveRoom: connectLiveRoom,
    formatDistance: formatDistance,
    getEffectiveMyStatus: getEffectiveMyStatus,
    getRoomOnlineCount: getRoomOnlineCount,
    isLocalOnlineInRoom: isLocalOnlineInRoom,
    monitorGps: monitorGps,
    openMateInspector: openMateInspector,
    openPinnedComposerModal: openPinnedComposerModal,
    removeGhostForUid: removeGhostForUid,
    runEnlaceTest: runEnlaceTest,
    savePinsToStorage: savePinsToStorage,
    scanAndCaptureExistingMaps: scanAndCaptureExistingMaps,
    syncPenDockUi: syncPenDockUi,
    TEAM_PALETTE: TEAM_PALETTE,
    canDrawOnMap: canDrawOnMap,
    clearBloodhoundMarker: clearBloodhoundMarker,
    openPinEditorModal: openPinEditorModal,
    saveTerrainTracesToStorage: saveTerrainTracesToStorage,
    setBloodhoundTarget: setBloodhoundTarget,
    togglePegadasForUid: togglePegadasForUid,
    toggleSatelliteMode: toggleSatelliteMode,
    upsertTacticalPin: upsertTacticalPin,
    renderAllTeamColorSwatches: function () { if (typeof window._azRenderAllTeamColorSwatches === 'function') window._azRenderAllTeamColorSwatches(); },
    syncWaGroupHeaderAndMembers: function () { if (typeof window._azSyncWaGroupHeaderAndMembers === 'function') window._azSyncWaGroupHeaderAndMembers(); },
    openTeamCommsModal: function () { if (typeof window._azOpenTeamCommsModal === 'function') window._azOpenTeamCommsModal(); },
    startMapOrbitAround: function (lng, lat) { if (typeof window._azStartMapOrbitAround === 'function') window._azStartMapOrbitAround(lng, lat); },
    openDroneMode: function (uid, coords) { if (typeof window._azOpenDroneMode === 'function') window._azOpenDroneMode(uid, coords); },
    syncStealthUi: function () { if (typeof window._azSyncStealthUi === 'function') window._azSyncStealthUi(); }
  });

  // ==================== MODO PERFORMANCE (SEM BLUR) + SUSPENSÃO DE TRANSIÇÃO NO ARRASTE ====================
  (function initPerfNoBlurMode() {
    const PERF_KEY = "az_perf_noblur_v1";
    let enabled = true;
    try {
      const saved = localStorage.getItem(PERF_KEY);
      if (saved === "false") enabled = false;
    } catch (_) {}

    function applyPerfClass(on) {
      document.body.classList.toggle("az-perf-noblur", Boolean(on));
    }
    applyPerfClass(enabled);

    const chk = document.getElementById("azPerfNoBlurChk");
    if (chk) {
      chk.checked = enabled;
      chk.addEventListener("change", function () {
        enabled = Boolean(this.checked);
        try { localStorage.setItem(PERF_KEY, enabled ? "true" : "false"); } catch (_) {}
        applyPerfClass(enabled);
      });
    }

    function wireMapDragPerf(map) {
      if (!map || map._azPerfBound || typeof map.on !== "function") return;
      map._azPerfBound = true;
      const onStart = function () { document.body.classList.add("az-map-interacting"); };
      const onEnd = function () { document.body.classList.remove("az-map-interacting"); };
      map.on("dragstart", onStart);
      map.on("rotatestart", onStart);
      map.on("movestart", onStart);
      map.on("dragend", onEnd);
      map.on("rotateend", onEnd);
      map.on("moveend", onEnd);
    }
    (tac.maps || []).forEach(wireMapDragPerf);
    setInterval(function () { (tac.maps || []).forEach(wireMapDragPerf); }, 3500);
  })();

  setInterval(monitorGps, 4500);
})();