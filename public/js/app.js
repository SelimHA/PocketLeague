import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import { FIREBASE_CONFIG } from "./config.js";
import {
  DEFAULT_META,
  MODE_CONFIGS,
  ROLES,
  VISUAL_CONSTANTS,
  PhysicsHost,
  compactState,
  defaultBindings,
  inputFromKeys,
  maxHumansFor,
  makeInitialState,
  serialiseMeta,
  getArenaSize,
  defaultRoleForSlot
} from "./physics.js";

const $ = sel => document.querySelector(sel);
const LOCAL_UID = "LOCAL_PLAYER";
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ui = {
  setup: $("#setup-card"), lobby: $("#lobby-card"), firebaseWarning: $("#firebase-warning"),
  name: $("#player-name"), single: $("#single-player"), create: $("#create-lobby"), joinCode: $("#join-code"), join: $("#join-lobby"),
  connection: $("#connection-status"), lobbyCode: $("#lobby-code-label"), lobbyStatus: $("#lobby-status"), copy: $("#copy-code"),
  mode: $("#mode-select"), teamSize: $("#team-size-select"), difficulty: $("#difficulty-select"), playstyle: $("#playstyle-select"),
  maxHumans: $("#max-humans-label"), team: $("#team-select"), role: $("#role-select"), ready: $("#ready-btn"),
  leaveLobby: $("#leave-lobby"), blueList: $("#blue-team-list"), orangeList: $("#orange-team-list"),
  hud: $("#hud"), scoreBlue: $("#score-blue"), scoreOrange: $("#score-orange"), clock: $("#clock"), leaveGame: $("#leave-game"),
  boostLabel: $("#boost-label"), boostBox: $("#boost-container"), boostFill: $("#boost-fill"),
  controlsHint: $("#controls-hint"), camState: $("#cam-state"),
  mobile: $("#mobile-controls"), stickZone: $("#stick-zone"), stickKnob: $("#stick-knob"),
  mobileBoostButton: document.querySelector('[data-action="boost"]')
};

const canvas = $("#game");
let initializeApp, getAuth, signInAnonymously, onAuthStateChanged, getDatabase, ref, get, set, update, onValue, remove, onDisconnect, serverTimestamp;
let firebaseBootPromise = null;
let firebaseBootDone = false;
let firebaseBootError = null;
let firebaseReady = false;
let auth = null;
let db = null;
let uid = null;
let playerName = localStorage.getItem("rlcss_online_name") || localStorage.getItem("pl_online_name") || "Player";
let lobbyCode = null;
let currentLobby = null;
let currentMeta = null;
let currentPlayers = {};
let latestState = null;
let latestInputs = {};
let isSinglePlayer = false;
let singlePlayerId = null;
let hostSim = null;
let hostRaf = 0;
let unsubLobby = null;
let unsubInputs = null;
let unsubState = null;
let inputTimer = 0;
let localBallCam = (localStorage.getItem("rlcss_ball_cam") ?? localStorage.getItem("pl_ball_cam")) === "1";
const keys = {};
const bindings = defaultBindings();
const mobileInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, reset: false };
let mobileDriftTimer = 0;
let mobileDriftCooldownTimer = 0;
let camKeyLatch = false;
let touchDevice = matchMedia("(pointer: coarse)").matches;

ui.name.value = playerName;

function activePlayerId() {
  return isSinglePlayer ? singlePlayerId : uid;
}

function hasPlaceholderConfig(config) {
  return !config || Object.values(config).some(v => typeof v === "string" && (v.includes("PASTE") || v.includes("YOUR_PROJECT")));
}

async function bootFirebase() {
  firebaseBootDone = false;
  firebaseBootError = null;
  if (hasPlaceholderConfig(FIREBASE_CONFIG)) {
    ui.firebaseWarning.classList.remove("hidden");
    ui.connection.textContent = "Single player is available. Add Firebase config to enable online multiplayer.";
    firebaseBootDone = true;
    return false;
  }
  try {
    ui.connection.textContent = "Connecting to online services… single player is ready now.";
    const [appMod, authMod, dbMod] = await withTimeout(Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js")
    ]), 12000, "Loading Firebase SDK");
    ({ initializeApp } = appMod);
    ({ getAuth, signInAnonymously, onAuthStateChanged } = authMod);
    ({ getDatabase, ref, get, set, update, onValue, remove, onDisconnect, serverTimestamp } = dbMod);
    const app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getDatabase(app);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Firebase sign-in timed out. Check Anonymous Auth and Authorized Domains.")), 12000);
      onAuthStateChanged(auth, user => {
        if (user) {
          clearTimeout(timer);
          uid = user.uid;
          firebaseReady = true;
          ui.connection.textContent = "Connected. Create a lobby or join with a code.";
          ui.create.disabled = false;
          ui.join.disabled = false;
          resolve();
        }
      });
      signInAnonymously(auth).catch(err => {
        clearTimeout(timer);
        reject(err);
      });
    });
    firebaseBootDone = true;
    return true;
  } catch (err) {
    console.error(err);
    firebaseReady = false;
    firebaseBootDone = true;
    firebaseBootError = err;
    ui.connection.textContent = `Online error: ${err.message}. Single player still works.`;
    // Keep the buttons enabled so a tap gives a useful retry/error message instead of appearing dead.
    ui.create.disabled = false;
    ui.join.disabled = false;
    return false;
  }
}

async function ensureFirebaseReady() {
  if (firebaseReady && uid && db) return true;
  if (!firebaseBootPromise) firebaseBootPromise = bootFirebase();
  if (!firebaseBootDone) {
    ui.connection.textContent = "Connecting to Firebase… try Single Player now, or wait for online.";
    await firebaseBootPromise;
  }
  if (firebaseReady && uid && db) return true;
  const reason = firebaseBootError ? firebaseBootError.message : "Firebase is not ready yet.";
  ui.connection.textContent = `Online multiplayer is not ready: ${reason}`;
  if (firebaseBootError) firebaseBootPromise = null;
  return false;
}

function sanitizeName(name) {
  return (name || "Player").replace(/[^a-z0-9 _-]/gi, "").trim().slice(0, 18) || "Player";
}

function lobbyRef(code, path = "") {
  return ref(db, path ? `lobbies/${code}/${path}` : `lobbies/${code}`);
}

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function currentSoloMetaPatch() {
  return {
    mode: ui.mode?.value || DEFAULT_META.mode,
    teamSize: Number(ui.teamSize?.value || DEFAULT_META.teamSize),
    difficulty: ui.difficulty?.value || DEFAULT_META.difficulty,
    playstyle: ui.playstyle?.value || DEFAULT_META.playstyle
  };
}

async function createLobby() {
  isSinglePlayer = false;
  ui.create.disabled = true;
  try {
    if (!(await ensureFirebaseReady())) return;
    playerName = sanitizeName(ui.name.value);
    localStorage.setItem("rlcss_online_name", playerName);

    let code = randomCode();
    ui.lobbyCode.textContent = code;
    setStatus(`Creating lobby ${code}…`);
    for (let i = 0; i < 6; i++) {
      try {
        const snap = await withTimeout(get(lobbyRef(code)), 6500, "Checking lobby code");
        if (!snap.exists()) break;
        code = randomCode();
        ui.lobbyCode.textContent = code;
        setStatus(`Creating lobby ${code}…`);
      } catch (err) {
        console.warn("Could not pre-check lobby code; attempting direct create.", err);
        break;
      }
    }

    const meta = {
      ...DEFAULT_META,
      ...currentSoloMetaPatch(),
      hostId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "waiting"
    };
    const player = { name: playerName, team: ui.team.value || "blue", role: ui.role.value || "midfield", ready: false, joinedAt: serverTimestamp(), isHost: true };

    // Write granularly instead of one large root write. This works with stricter
    // Realtime Database rules and gives clearer failure messages on phones.
    await withTimeout(set(lobbyRef(code, "meta"), meta), 10000, "Writing lobby settings");
    await withTimeout(set(lobbyRef(code, `players/${uid}`), player), 10000, "Adding host player");

    await enterLobby(code);
    setStatus(`Lobby ${code} created. Share code ${code}.`);
  } catch (err) {
    console.error(err);
    setStatus(`Create lobby failed: ${err.message}. Check Anonymous Auth and Realtime Database rules.`);
  } finally {
    ui.create.disabled = false;
  }
}

async function joinLobby() {
  isSinglePlayer = false;
  ui.join.disabled = true;
  try {
    if (!(await ensureFirebaseReady())) return;
    playerName = sanitizeName(ui.name.value);
    localStorage.setItem("rlcss_online_name", playerName);
    const code = ui.joinCode.value.trim().toUpperCase();
    if (!code) return setStatus("Enter a lobby code first.");
    setStatus(`Joining lobby ${code}…`);
    const snap = await withTimeout(get(lobbyRef(code)), 10000, "Loading lobby");
    if (!snap.exists()) return setStatus("Lobby not found.");
    const data = snap.val();
    const meta = serialiseMeta(data.meta || {});
    if ((data.meta || {}).status !== "waiting") return setStatus("That match has already started.");
    const humans = Object.keys(data.players || {}).length;
    const maxHumans = maxHumansFor(meta.mode, meta.teamSize);
    if (humans >= maxHumans) return setStatus(`Lobby is full for ${MODE_CONFIGS[meta.mode].label}.`);
    const counts = countTeams(data.players || {});
    const team = counts.blue <= counts.orange ? "blue" : "orange";
    await withTimeout(set(lobbyRef(code, `players/${uid}`), { name: playerName, team, role: "midfield", ready: false, joinedAt: serverTimestamp(), isHost: false }), 12000, "Joining lobby");
    await enterLobby(code);
    setStatus(`Joined lobby ${code}.`);
  } catch (err) {
    console.error(err);
    setStatus(`Join lobby failed: ${err.message}.`);
  } finally {
    ui.join.disabled = false;
  }
}

function startSinglePlayer() {
  cleanupLobbyListeners();
  isSinglePlayer = true;
  singlePlayerId = LOCAL_UID;
  playerName = sanitizeName(ui.name.value);
  localStorage.setItem("rlcss_online_name", playerName);
  lobbyCode = "SOLO";
  currentMeta = serialiseMeta({
    ...DEFAULT_META,
    ...currentSoloMetaPatch(),
    hostId: singlePlayerId,
    status: "waiting",
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  currentPlayers = {
    [singlePlayerId]: {
      name: playerName,
      team: ui.team.value || "blue",
      role: ui.role.value || "midfield",
      ready: true,
      joinedAt: Date.now(),
      isHost: true,
      local: true
    }
  };
  currentLobby = { meta: currentMeta, players: currentPlayers, inputs: {}, state: null };
  latestState = null;
  latestInputs = { [singlePlayerId]: localInput() };
  hostSim = null;

  document.body.classList.remove("game-running");
  ui.setup.classList.add("hidden");
  ui.lobby.classList.remove("hidden");
  ui.lobby.classList.add("solo");
  ui.lobbyCode.textContent = "SOLO";
  renderLobby();
  updateGameVisibility();
  if (ui.lobbyStatus) ui.lobbyStatus.textContent = "Solo setup: configure teams, modes and AI, then start.";
  setStatus("Solo setup opened. Configure the match, then press Start Match.");
}

function startSoloMatch() {
  if (!isSinglePlayer || !currentMeta || !currentPlayers) return;
  const localId = activePlayerId();
  currentPlayers[localId] = {
    ...(currentPlayers[localId] || {}),
    name: sanitizeName(ui.name.value),
    team: ui.team.value || currentPlayers[localId]?.team || "blue",
    role: ui.role.value || currentPlayers[localId]?.role || "midfield",
    ready: true
  };
  currentMeta = serialiseMeta({ ...currentMeta, status: "running", startedAt: Date.now(), updatedAt: Date.now() });
  const initial = makeInitialState(currentMeta, currentPlayers);
  initial.kickoffTimer = 0.45;
  latestInputs = { [localId]: localInput() };
  latestState = compactState(initial);
  currentLobby = { meta: currentMeta, players: currentPlayers, inputs: latestInputs, state: latestState };
  hostSim = new PhysicsHost(currentMeta, currentPlayers);
  hostSim.state = initial;
  ui.setup.classList.add("hidden");
  ui.lobby.classList.add("hidden");
  document.body.classList.add("game-running");
  startHostLoop();
  updateGameVisibility();
}

function setStatus(text) {
  ui.connection.textContent = text;
}

async function enterLobby(code) {
  cleanupLobbyListeners();
  isSinglePlayer = false;
  lobbyCode = code;
  ui.setup.classList.add("hidden");
  ui.lobby.classList.remove("hidden");
  ui.lobby.classList.remove("solo");
  ui.lobbyCode.textContent = code;
  onDisconnect(lobbyRef(code, `players/${uid}`)).remove().catch(() => {});
  onDisconnect(lobbyRef(code, `inputs/${uid}`)).remove().catch(() => {});
  unsubLobby = onValue(lobbyRef(code), snap => {
    currentLobby = snap.val();
    if (!currentLobby) {
      leaveToMenu("Lobby closed.");
      return;
    }
    currentMeta = serialiseMeta(currentLobby.meta || {});
    currentPlayers = currentLobby.players || {};
    renderLobby();
    maybeAutoStart();
    updateGameVisibility();
  });
  unsubInputs = onValue(lobbyRef(code, "inputs"), snap => { latestInputs = snap.val() || {}; });
  unsubState = onValue(lobbyRef(code, "state"), snap => { if (snap.exists()) latestState = snap.val(); });
  clearInterval(inputTimer);
  inputTimer = setInterval(sendInput, 33);
}

function cleanupLobbyListeners() {
  if (typeof unsubLobby === "function") unsubLobby();
  if (typeof unsubInputs === "function") unsubInputs();
  if (typeof unsubState === "function") unsubState();
  unsubLobby = unsubInputs = unsubState = null;
  if (inputTimer) clearInterval(inputTimer);
  inputTimer = 0;
  stopHostLoop();
}

function countTeams(players) {
  const counts = { blue: 0, orange: 0 };
  for (const p of Object.values(players || {})) counts[p.team === "orange" ? "orange" : "blue"]++;
  return counts;
}

function renderLobby() {
  if (!currentLobby || !currentMeta) return;
  const localId = activePlayerId();
  const isHost = isSinglePlayer || currentMeta.hostId === localId;
  const local = currentPlayers[localId] || {};
  ui.mode.value = currentMeta.mode;
  ui.teamSize.value = String(currentMeta.teamSize);
  ui.difficulty.value = currentMeta.difficulty;
  ui.playstyle.value = currentMeta.playstyle;
  ui.team.value = local.team || "blue";
  ui.role.value = local.role || "midfield";
  ui.ready.classList.toggle("not-ready", !isSinglePlayer && !!local.ready);
  ui.ready.textContent = isSinglePlayer ? "Start Match" : (local.ready ? "Unready" : "Ready");
  ui.mode.disabled = ui.teamSize.disabled = ui.difficulty.disabled = ui.playstyle.disabled = !isHost || currentMeta.status !== "waiting";
  ui.copy.disabled = isSinglePlayer;
  ui.copy.textContent = isSinglePlayer ? "Solo" : "Copy Code";
  const maxHumans = maxHumansFor(currentMeta.mode, currentMeta.teamSize);
  const humanCount = Object.keys(currentPlayers).length;
  ui.maxHumans.textContent = isSinglePlayer
    ? `Solo mode · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`
    : `Max humans in this mode: ${maxHumans} · Humans joined: ${humanCount}/${maxHumans} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`;
  const allReady = humanCount > 0 && Object.values(currentPlayers).every(p => p.ready);
  if (currentMeta.status === "waiting") {
    ui.lobbyStatus.textContent = isSinglePlayer
      ? "Solo setup: configure teams, modes and AI, then start."
      : (allReady && humanCount <= maxHumans ? "Everyone is ready — starting…" : "Waiting for players to ready up.");
  } else if (currentMeta.status === "running") {
    ui.lobbyStatus.textContent = "Match in progress.";
  } else {
    ui.lobbyStatus.textContent = currentMeta.status || "Lobby";
  }
  renderTeamList("blue", ui.blueList);
  renderTeamList("orange", ui.orangeList);
}

function renderTeamList(team, root) {
  const meta = currentMeta || DEFAULT_META;
  const teamHumans = Object.entries(currentPlayers || {}).filter(([,p]) => (p.team || "blue") === team);
  let html = "";
  for (let i = 0; i < meta.teamSize; i++) {
    const entry = teamHumans[i];
    if (entry) {
      const [id, p] = entry;
      html += `<div class="slot ${team}"><span class="dot"></span><div><div class="name">${escapeHtml(p.name || "Player")}${id === activePlayerId() ? " (you)" : ""}</div><div class="meta">${roleLabel(p.role)}${id === meta.hostId ? " · Host" : ""}</div></div><span class="ready-pill">${p.ready ? "READY" : "NOT READY"}</span></div>`;
    } else {
      const role = meta.aiRoles?.[team]?.[i] || defaultRoleForSlot(i, meta.teamSize);
      const isHost = (isSinglePlayer || meta.hostId === activePlayerId()) && meta.status === "waiting";
      const roleUi = isHost
        ? `<select class="ai-role-select" data-team="${team}" data-slot="${i}">${ROLES.map(r => `<option value="${r}" ${r === role ? "selected" : ""}>${roleLabel(r)}</option>`).join("")}</select>`
        : roleLabel(role);
      html += `<div class="slot ${team}"><span class="dot"></span><div><div class="name">AI ${i + 1}</div><div class="meta">${roleUi}</div></div><span class="ready-pill ai-pill">AI</span></div>`;
    }
  }
  root.innerHTML = html;
}

function roleLabel(role) {
  return role === "goalkeeper" ? "Goalkeeper" : role === "defence" ? "Back / Defence" : role === "midfield" ? "Midfield" : "Attack";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
}

async function updateMetaPatch(patch) {
  const localId = activePlayerId();
  if (!lobbyCode || !currentMeta || (currentMeta.hostId !== localId && !isSinglePlayer)) return;
  if (isSinglePlayer) {
    currentMeta = serialiseMeta({ ...currentMeta, ...patch, status: "waiting", updatedAt: Date.now() });
    currentLobby = { ...(currentLobby || {}), meta: currentMeta, players: currentPlayers, state: null };
    latestState = null;
    renderLobby();
    updateGameVisibility();
    return;
  }
  await update(lobbyRef(lobbyCode, "meta"), { ...patch, updatedAt: serverTimestamp() });
}

async function updateLocalPlayer(patch) {
  const localId = activePlayerId();
  if (!lobbyCode || !localId) return;
  if (isSinglePlayer) {
    currentPlayers[localId] = { ...(currentPlayers[localId] || {}), ...patch, ready: true };
    currentLobby = { ...(currentLobby || {}), meta: currentMeta, players: currentPlayers };
    renderLobby();
    updateGameVisibility();
    return;
  }
  await update(lobbyRef(lobbyCode, `players/${uid}`), patch);
}

function readyStateAllowsStart() {
  if (!currentMeta || !currentPlayers) return false;
  const players = Object.values(currentPlayers);
  if (!players.length) return false;
  if (!players.every(p => p.ready)) return false;
  if (players.length > maxHumansFor(currentMeta.mode, currentMeta.teamSize)) return false;
  return currentMeta.status === "waiting";
}

async function maybeAutoStart() {
  const localId = activePlayerId();
  if (!currentMeta || (currentMeta.hostId !== localId && !isSinglePlayer) || !readyStateAllowsStart()) return;
  const initial = makeInitialState(currentMeta, currentPlayers);
  if (isSinglePlayer) return;
  await withTimeout(set(lobbyRef(lobbyCode, "state"), compactState(initial)), 12000, "Writing initial match state");
  await withTimeout(update(lobbyRef(lobbyCode, "meta"), { status: "running", startedAt: serverTimestamp(), updatedAt: serverTimestamp() }), 12000, "Starting match");
  hostSim = new PhysicsHost(currentMeta, currentPlayers);
  startHostLoop();
}

function updateGameVisibility() {
  const running = currentMeta && currentMeta.status === "running";
  document.body.classList.toggle("game-running", !!running);
  ui.hud.classList.toggle("hidden", !running);
  ui.leaveGame.classList.toggle("hidden", !running);
  ui.boostLabel.classList.toggle("hidden", !running);
  ui.boostBox.classList.toggle("hidden", !running);
  ui.controlsHint.classList.toggle("hidden", !running || isPhonePortrait());
  if (isSinglePlayer) {
    ui.setup.classList.add("hidden");
    ui.lobby.classList.toggle("hidden", running);
  } else {
    ui.setup.classList.toggle("hidden", !!lobbyCode);
    ui.lobby.classList.toggle("hidden", running || !lobbyCode);
  }
  ui.mobile.classList.toggle("hidden", !running || !isPhonePortrait());
  if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
  if (running && (isSinglePlayer || currentMeta?.hostId === activePlayerId()) && !hostSim) {
    hostSim = new PhysicsHost(currentMeta, currentPlayers);
    if (currentLobby?.state) hostSim.state = currentLobby.state;
    startHostLoop();
  }
}

function startHostLoop() {
  if (hostRaf) return;
  let last = performance.now();
  let acc = 0;
  const fixed = 1 / 120;
  const loop = now => {
    hostRaf = requestAnimationFrame(loop);
    if (!hostSim || !currentMeta || currentMeta.status !== "running" || (!isSinglePlayer && currentMeta.hostId !== activePlayerId())) return;
    const dt = Math.min(0.08, (now - last) / 1000);
    last = now;
    acc += dt;
    let shouldWrite = false;
    while (acc >= fixed) {
      hostSim.syncMeta(currentMeta, currentPlayers);
      const localId = activePlayerId();
      if (isSinglePlayer && localId) latestInputs = { [localId]: localInput() };
      hostSim.setInputs(latestInputs);
      shouldWrite = hostSim.step(fixed, currentPlayers) || shouldWrite;
      acc -= fixed;
    }
    latestState = compactState(hostSim.state);
    if (shouldWrite && !isSinglePlayer) set(lobbyRef(lobbyCode, "state"), latestState);
    if (hostSim.state.ended) {
      if (isSinglePlayer) {
        currentMeta = serialiseMeta({ ...currentMeta, status: "ended", endedAt: Date.now() });
        currentLobby = { ...(currentLobby || {}), meta: currentMeta, players: currentPlayers, state: latestState };
        updateGameVisibility();
      } else {
        update(lobbyRef(lobbyCode, "meta"), { status: "ended", endedAt: serverTimestamp() });
      }
    }
  };
  hostRaf = requestAnimationFrame(loop);
}

function stopHostLoop() {
  if (hostRaf) cancelAnimationFrame(hostRaf);
  hostRaf = 0;
  hostSim = null;
}

async function leaveToMenu(message = "") {
  if (!isSinglePlayer && lobbyCode && uid && db) {
    await remove(lobbyRef(lobbyCode, `players/${uid}`)).catch(() => {});
    await remove(lobbyRef(lobbyCode, `inputs/${uid}`)).catch(() => {});
  }
  cleanupLobbyListeners();
  isSinglePlayer = false;
  singlePlayerId = null;
  lobbyCode = null; currentLobby = null; currentMeta = null; currentPlayers = {}; latestState = null; latestInputs = {};
  ui.lobby.classList.remove("solo");
  document.body.classList.remove("game-running");
  ui.setup.classList.remove("hidden");
  ui.lobby.classList.add("hidden");
  ui.hud.classList.add("hidden");
  ui.leaveGame.classList.add("hidden");
  ui.boostLabel.classList.add("hidden");
  ui.boostBox.classList.add("hidden");
  ui.controlsHint.classList.add("hidden");
  ui.mobile.classList.add("hidden");
  if (message) ui.connection.textContent = message;
}

function localInput() {
  const k = inputFromKeys(keys, bindings);
  const combined = {
    throttle: clamp(k.throttle + mobileInput.throttle, -1, 1),
    steer: clamp(k.steer + mobileInput.steer, -1, 1),
    boost: k.boost || mobileInput.boost,
    jump: k.jump || mobileInput.jump,
    drift: k.drift || mobileInput.drift,
    cam: localBallCam,
    reset: k.reset || mobileInput.reset
  };
  return combined;
}

async function sendInput() {
  if (isSinglePlayer) return;
  if (!lobbyCode || !uid || !db || !currentMeta || currentMeta.status !== "running") return;
  const inp = localInput();
  await set(lobbyRef(lobbyCode, `inputs/${uid}`), { ...inp, t: Date.now() }).catch(() => {});
}

function safeUi(handler, label) {
  return event => {
    try {
      const result = handler(event);
      if (result && typeof result.catch === "function") {
        result.catch(err => {
          console.error(label, err);
          setStatus(`${label} failed: ${err.message || err}`);
        });
      }
    } catch (err) {
      console.error(label, err);
      setStatus(`${label} failed: ${err.message || err}`);
    }
  };
}

// UI events
ui.single.addEventListener("click", safeUi(startSinglePlayer, "Single player setup"));
ui.create.addEventListener("click", safeUi(createLobby, "Create lobby"));
ui.join.addEventListener("click", safeUi(joinLobby, "Join lobby"));
ui.joinCode.addEventListener("input", () => ui.joinCode.value = ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
ui.copy.addEventListener("click", () => { if (!isSinglePlayer) navigator.clipboard?.writeText(lobbyCode || ""); });
ui.leaveLobby.addEventListener("click", safeUi(() => leaveToMenu("Left lobby."), "Leave lobby"));
ui.leaveGame.addEventListener("click", safeUi(() => leaveToMenu("Left match."), "Leave match"));
ui.ready.addEventListener("click", () => {
  if (isSinglePlayer) startSoloMatch();
  else updateLocalPlayer({ ready: !(currentPlayers[activePlayerId()]?.ready) });
});
ui.team.addEventListener("change", () => updateLocalPlayer({ team: ui.team.value, ready: false }));
ui.role.addEventListener("change", () => updateLocalPlayer({ role: ui.role.value, ready: false }));
ui.mode.addEventListener("change", () => updateMetaPatch({ mode: ui.mode.value }));
ui.teamSize.addEventListener("change", () => updateMetaPatch({ teamSize: Number(ui.teamSize.value) }));
ui.difficulty.addEventListener("change", () => updateMetaPatch({ difficulty: ui.difficulty.value }));
ui.playstyle.addEventListener("change", () => updateMetaPatch({ playstyle: ui.playstyle.value }));

[ui.blueList, ui.orangeList].forEach(root => {
  root.addEventListener("change", e => {
    const sel = e.target.closest(".ai-role-select");
    if (!sel || !currentMeta || (!isSinglePlayer && currentMeta.hostId !== activePlayerId())) return;
    const team = sel.dataset.team;
    const slot = Number(sel.dataset.slot);
    const roles = JSON.parse(JSON.stringify(currentMeta.aiRoles || { blue: {}, orange: {} }));
    if (!roles[team]) roles[team] = {};
    roles[team][slot] = sel.value;
    updateMetaPatch({ aiRoles: roles });
  });
});

window.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (e.code === bindings.cam && !camKeyLatch) {
    camKeyLatch = true;
    localBallCam = !localBallCam;
    localStorage.setItem("rlcss_ball_cam", localBallCam ? "1" : "0");
    if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
  }
});
window.addEventListener("keyup", e => {
  keys[e.code] = false;
  if (e.code === bindings.cam) camKeyLatch = false;
});

// Mobile/touch controls
function isPhonePortrait() {
  return touchDevice && window.matchMedia("(orientation: portrait)").matches;
}

function setupMobileControls() {
  const zone = ui.stickZone;
  const knob = ui.stickKnob;
  if (!zone || !knob) return;
  let activeId = null;
  function setStick(clientX, clientY) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = Math.max(48, Math.min(rect.width, rect.height) * 0.34);
    const rawDx = clientX - cx;
    const rawDy = clientY - cy;
    const mag = Math.hypot(rawDx, rawDy);
    const scale = mag > max ? max / mag : 1;
    const dx = rawDx * scale;
    const dy = rawDy * scale;
    const nx = dx / max;
    const ny = dy / max;
    // Mobile stick is screen-relative: dragging right should turn the car right.
    // Physics yaw uses the opposite sign from the DOM X-axis, so invert here only.
    mobileInput.steer = clamp(-nx, -1, 1);
    mobileInput.throttle = clamp(-ny, -1, 1);
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    zone.classList.add("active");
  }
  function resetStick() {
    activeId = null;
    mobileInput.steer = 0;
    mobileInput.throttle = 0;
    knob.style.transform = "translate(-50%, -50%)";
    zone.classList.remove("active");
  }
  zone.addEventListener("pointerdown", e => {
    e.preventDefault();
    activeId = e.pointerId;
    zone.setPointerCapture(activeId);
    setStick(e.clientX, e.clientY);
  });
  zone.addEventListener("pointermove", e => { if (e.pointerId === activeId) setStick(e.clientX, e.clientY); });
  zone.addEventListener("pointerup", e => { if (e.pointerId === activeId) resetStick(); });
  zone.addEventListener("pointercancel", e => { if (e.pointerId === activeId) resetStick(); });

  function triggerMobileDrift(btn) {
    if (mobileDriftTimer || mobileDriftCooldownTimer) return;
    mobileInput.drift = true;
    btn.disabled = true;
    btn.classList.add("drift-latched");
    mobileDriftTimer = window.setTimeout(() => {
      mobileInput.drift = false;
      mobileDriftTimer = 0;
      btn.classList.remove("drift-latched");
      btn.classList.add("drift-cooling");
      mobileDriftCooldownTimer = window.setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove("drift-cooling");
        mobileDriftCooldownTimer = 0;
      }, 260);
    }, 850);
  }

  document.querySelectorAll(".touch-btn").forEach(btn => {
    const action = btn.dataset.action;
    btn.addEventListener("pointerdown", e => {
      e.preventDefault();
      btn.setPointerCapture(e.pointerId);
      btn.classList.add("active");
      if (action === "cam") {
        localBallCam = !localBallCam;
        localStorage.setItem("rlcss_ball_cam", localBallCam ? "1" : "0");
        if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
      } else if (action === "drift") {
        triggerMobileDrift(btn);
      } else if (action in mobileInput) {
        mobileInput[action] = true;
      }
    });
    const up = () => {
      btn.classList.remove("active");
      if (action in mobileInput && !["jump", "reset", "drift"].includes(action)) mobileInput[action] = false;
      if (action === "jump" || action === "reset") setTimeout(() => { mobileInput[action] = false; }, 80);
    };
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
  });
}

// Three.js renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070912);
scene.fog = new THREE.FogExp2(0x070912, 0.0038);
const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1200);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambient = new THREE.AmbientLight(0xffffff, 0.58);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(40, 75, 35);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const world = new THREE.Group();
scene.add(world);
let arenaSignature = "";
let ballMesh = null;
const carMeshes = new Map();
const boostPadMeshes = new Map();
const nameSprites = new Map();

function resizeRenderer() {
  const rect = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / Math.max(1, rect.height);
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resizeRenderer);
resizeRenderer();

function makeFieldTexture(mode, arena) {
  const cnv = document.createElement("canvas");
  cnv.width = 1024; cnv.height = 1024;
  const ctx = cnv.getContext("2d");
  const base = mode === "ice" ? [185, 230, 255] : mode === "snooker" ? [16, 92, 50] : mode === "flying" ? [34, 40, 72] : [30, 84, 54];
  ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = `rgba(255,255,255,${i % 2 ? 0.045 : 0.02})`;
    ctx.fillRect(0, i * 60, 1024, 30);
  }
  ctx.strokeStyle = mode === "ice" ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.52)";
  ctx.lineWidth = 7;
  ctx.strokeRect(68, 68, 888, 888);
  ctx.beginPath(); ctx.moveTo(68, 512); ctx.lineTo(956, 512); ctx.stroke();
  ctx.beginPath(); ctx.arc(512, 512, 90, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024;
    ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(x, y, 1, 1);
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(arena.w / 60, arena.l / 100);
  return tex;
}

function buildArena(state) {
  const sig = `${state.mode}:${state.arena.w}:${state.arena.l}:${state.arena.goalW}`;
  if (sig === arenaSignature) return;
  arenaSignature = sig;
  while (world.children.length) world.remove(world.children[0]);
  ballMesh = null;
  carMeshes.clear();
  boostPadMeshes.clear();
  nameSprites.clear();

  const arena = state.arena;
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(arena.w, arena.l),
    new THREE.MeshStandardMaterial({ map: makeFieldTexture(state.mode, arena), roughness: state.mode === "ice" ? 0.28 : 0.84, metalness: 0.0 })
  );
  field.rotation.x = -Math.PI / 2;
  field.receiveShadow = true;
  world.add(field);

  const wallMat = new THREE.MeshStandardMaterial({ color: state.mode === "ice" ? 0xa6ddff : 0x1d2438, transparent: true, opacity: 0.48, roughness: 0.4 });
  const trimBlue = new THREE.MeshStandardMaterial({ color: 0x12b9ff, emissive: 0x12b9ff, emissiveIntensity: 0.45 });
  const trimOrange = new THREE.MeshStandardMaterial({ color: 0xff8a1f, emissive: 0xff8a1f, emissiveIntensity: 0.45 });
  const neutralTrim = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x4466ff, emissiveIntensity: 0.16 });

  function box(w, h, d, x, y, z, mat = wallMat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    world.add(m);
    return m;
  }

  function buildGoal(side, frameMat) {
    const goalLineZ = side * arena.l / 2;
    const backZ = side * (arena.l / 2 + arena.goalD);
    const midZ = (goalLineZ + backZ) / 2;
    const halfW = arena.goalW / 2;
    const post = 0.62;
    // Real goal frame: posts touch the ground, crossbar sits at goal height,
    // and rails/nets extend backwards into the goal depth.
    box(post, arena.goalH, post, -halfW, arena.goalH / 2, goalLineZ, frameMat);
    box(post, arena.goalH, post,  halfW, arena.goalH / 2, goalLineZ, frameMat);
    box(arena.goalW + post, post, post, 0, arena.goalH, goalLineZ, frameMat);
    box(arena.goalW + post, 0.42, post, 0, 0.21, goalLineZ, frameMat);
    box(post * 0.72, arena.goalH, post * 0.72, -halfW, arena.goalH / 2, backZ, frameMat);
    box(post * 0.72, arena.goalH, post * 0.72,  halfW, arena.goalH / 2, backZ, frameMat);
    box(arena.goalW + post, post * 0.72, post * 0.72, 0, arena.goalH, backZ, frameMat);
    box(post * 0.72, post * 0.72, arena.goalD, -halfW, arena.goalH, midZ, frameMat);
    box(post * 0.72, post * 0.72, arena.goalD,  halfW, arena.goalH, midZ, frameMat);
    box(post * 0.58, post * 0.58, arena.goalD, -halfW, 0.32, midZ, frameMat);
    box(post * 0.58, post * 0.58, arena.goalD,  halfW, 0.32, midZ, frameMat);

    const netMat = new THREE.MeshBasicMaterial({ color: frameMat.color || new THREE.Color(0xffffff), wireframe: true, transparent: true, opacity: 0.26, side: THREE.DoubleSide });
    const back = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalW, arena.goalH), netMat);
    back.position.set(0, arena.goalH / 2, backZ);
    world.add(back);
    const left = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalD, arena.goalH), netMat);
    left.rotation.y = Math.PI / 2;
    left.position.set(-halfW, arena.goalH / 2, midZ);
    world.add(left);
    const right = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalD, arena.goalH), netMat);
    right.rotation.y = Math.PI / 2;
    right.position.set(halfW, arena.goalH / 2, midZ);
    world.add(right);
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalW, arena.goalD), netMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.set(0, arena.goalH, midZ);
    world.add(roof);
  }

  box(1.2, 13, arena.l, -arena.w / 2, 6.5, 0);
  box(1.2, 13, arena.l, arena.w / 2, 6.5, 0);
  const sideW = (arena.w - arena.goalW) / 2;
  box(sideW, 13, 1.2, -arena.w / 2 + sideW / 2, 6.5, -arena.l / 2);
  box(sideW, 13, 1.2, arena.w / 2 - sideW / 2, 6.5, -arena.l / 2);
  box(sideW, 13, 1.2, -arena.w / 2 + sideW / 2, 6.5, arena.l / 2);
  box(sideW, 13, 1.2, arena.w / 2 - sideW / 2, 6.5, arena.l / 2);
  box(arena.goalW, 13 - arena.goalH, 1.2, 0, arena.goalH + (13 - arena.goalH) / 2, -arena.l / 2, trimBlue);
  box(arena.goalW, 13 - arena.goalH, 1.2, 0, arena.goalH + (13 - arena.goalH) / 2, arena.l / 2, trimOrange);
  buildGoal(-1, trimBlue);
  buildGoal(1, trimOrange);
  box(arena.w + 2, 0.8, 0.8, 0, 0.45, -arena.l / 2, trimBlue);
  box(arena.w + 2, 0.8, 0.8, 0, 0.45, arena.l / 2, trimOrange);
  box(0.8, 0.8, arena.l + 2, -arena.w / 2, 0.45, 0, neutralTrim);
  box(0.8, 0.8, arena.l + 2, arena.w / 2, 0.45, 0, neutralTrim);

  const standsMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const stand = box(arena.w + 20 + i * 5, 2.2, 4, 0, 3 + i * 2.2, side * (arena.l / 2 + 10 + i * 3), standsMat);
      stand.rotation.x = side * 0.08;
    }
    const light = new THREE.PointLight(side < 0 ? 0x12b9ff : 0xff8a1f, 1.25, arena.w * 1.4);
    light.position.set(0, 18, side * (arena.l / 2 + 8));
    world.add(light);
  }
  for (const x of [-arena.w / 2 - 13, arena.w / 2 + 13]) {
    const light = new THREE.PointLight(0xffffff, 0.82, arena.l * 0.9);
    light.position.set(x, 24, 0);
    world.add(light);
  }

  ballMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(VISUAL_CONSTANTS.BALL_RADIUS, 3),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.06, emissive: 0x101018 })
  );
  ballMesh.castShadow = true;
  world.add(ballMesh);
}


function createBoostPadMesh(pad) {
  const g = new THREE.Group();
  const diskMat = new THREE.MeshStandardMaterial({
    color: 0xffb000,
    emissive: 0xff8a00,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.74,
    roughness: 0.35
  });
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(pad.radius || 2.15, pad.radius || 2.15, 0.18, 28), diskMat);
  disk.position.y = 0.09;
  disk.receiveShadow = true;
  const ring = new THREE.Mesh(new THREE.TorusGeometry((pad.radius || 2.15) * 0.92, 0.08, 8, 32), new THREE.MeshBasicMaterial({ color: 0xfff2a8 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.26;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), new THREE.MeshBasicMaterial({ color: 0xffd55a }));
  orb.position.y = 1.02;
  const halo = new THREE.PointLight(0xffa000, 0.55, 9);
  halo.position.y = 1.2;
  g.add(disk, ring, orb, halo);
  g.position.set(pad.x, 0, pad.z);
  g.userData = { orb, ring, disk, halo };
  world.add(g);
  boostPadMeshes.set(pad.id, g);
  return g;
}

function updateBoostPadVisuals(state) {
  const pads = state.boostPads || [];
  const live = new Set(pads.map(p => p.id));
  for (const [id, mesh] of boostPadMeshes.entries()) {
    if (!live.has(id)) { world.remove(mesh); boostPadMeshes.delete(id); }
  }
  const t = performance.now() * 0.004;
  for (const pad of pads) {
    const mesh = boostPadMeshes.get(pad.id) || createBoostPadMesh(pad);
    mesh.position.set(pad.x, 0, pad.z);
    const active = pad.active !== false;
    mesh.visible = true;
    mesh.userData.disk.visible = active;
    mesh.userData.ring.visible = active;
    mesh.userData.orb.visible = active;
    mesh.userData.halo.visible = active;
    if (active) {
      const pulse = 1 + Math.sin(t * 2.5 + pad.x * 0.07 + pad.z * 0.03) * 0.12;
      mesh.userData.orb.position.y = 1.03 + Math.sin(t + pad.x) * 0.18;
      mesh.userData.orb.scale.setScalar(pulse);
      mesh.userData.ring.rotation.z += 0.035;
      mesh.userData.halo.intensity = 0.45 + pulse * 0.18;
    }
  }
}

function carMaterial(team, human) {
  const color = team === "blue" ? 0x0a91ff : 0xff6a00;
  return new THREE.MeshStandardMaterial({ color, roughness: human ? 0.35 : 0.55, metalness: human ? 0.18 : 0.06 });
}

function createCarMesh(car, state) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.9, 3.7), carMaterial(car.team, car.human));
  body.position.y = 0.45; body.castShadow = true;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.75, 1.55), new THREE.MeshStandardMaterial({ color: 0x10141e, roughness: 0.22, metalness: 0.4 }));
  cabin.position.set(0, 1.15, 0.18); cabin.castShadow = true;
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.32, 0.25), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: car.team === "blue" ? 0x0044aa : 0xaa3300, emissiveIntensity: 0.25 }));
  nose.position.set(0, 0.72, 1.95);
  const flameGeo = new THREE.ConeGeometry(0.58, 2.2, 14).rotateX(-Math.PI / 2);
  const flame = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({ color: 0xff8a00, transparent: true, opacity: 0.88 }));
  flame.position.set(0, 0.48, -2.45);
  flame.visible = false;
  g.userData.flame = flame;
  g.add(body, cabin, nose, flame);
  if (state.mode === "snooker") {
    const cueMat = new THREE.MeshStandardMaterial({ color: 0xd8b47a, roughness: 0.4 });
    const cue = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.19, 4.6, 12), cueMat);
    cue.rotation.x = Math.PI / 2;
    cue.position.set(0, 0.7, 3.05);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf7f0da, emissive: 0x665522, emissiveIntensity: 0.1 }));
    tip.position.set(0, 0.7, 5.32);
    g.add(cue, tip);
  }
  world.add(g);
  carMeshes.set(car.id, g);
  return g;
}

function updateVisuals(state) {
  if (!state) return;
  buildArena(state);
  const live = new Set(Object.keys(state.cars || {}));
  for (const [id, mesh] of carMeshes.entries()) {
    if (!live.has(id)) { world.remove(mesh); carMeshes.delete(id); }
  }
  if (ballMesh) {
    ballMesh.position.set(state.ball.x, state.ball.y, state.ball.z);
    ballMesh.rotation.set(state.ball.rx, 0, state.ball.rz);
  }
  updateBoostPadVisuals(state);
  for (const car of Object.values(state.cars || {})) {
    const mesh = carMeshes.get(car.id) || createCarMesh(car, state);
    mesh.position.set(car.x, car.y, car.z);
    mesh.rotation.set(car.pitch || 0, car.yaw, car.roll || 0, "YXZ");
    const scale = car.cueCooldown > 0 ? 1 + car.cueCooldown * 0.45 : 1;
    mesh.scale.set(1, 1, scale);
    if (mesh.userData.flame) {
      const boosting = !!car.boosting && (car.boost || 0) > 0;
      mesh.userData.flame.visible = boosting;
      if (boosting) {
        const f = 0.85 + Math.random() * 0.45;
        mesh.userData.flame.scale.set(1, f, 1 + Math.random() * 0.22);
      }
    }
  }
  updateHud(state);
  updateCamera(state);
}

function updateHud(state) {
  ui.scoreBlue.textContent = `BLUE ${state.score?.blue ?? 0}`;
  ui.scoreOrange.textContent = `${state.score?.orange ?? 0} ORANGE`;
  const t = Math.max(0, Math.ceil(state.timeLeft || 0));
  ui.clock.textContent = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  const localCar = state.cars?.[activePlayerId()];
  const boostPct = localCar ? Math.max(0, Math.min(100, Math.round(localCar.boost || 0))) : 0;
  if (ui.boostFill) ui.boostFill.style.width = `${boostPct}%`;
  // Desktop: show a small numeric boost counter over the normal boost bar.
  if (ui.boostBox) {
    ui.boostBox.dataset.boost = `${boostPct}`;
    ui.boostBox.style.setProperty("--boost-pct", `${boostPct}%`);
  }
  if (ui.boostLabel) ui.boostLabel.textContent = `BOOST ${boostPct}`;
  // Phone: the BOOST button itself shows the amount and its fill drains live.
  if (ui.mobileBoostButton) {
    ui.mobileBoostButton.style.setProperty("--boost-pct", `${boostPct}%`);
    ui.mobileBoostButton.innerHTML = `<span class="boost-btn-title">BOOST</span><span class="boost-btn-value">${boostPct}</span>`;
    ui.mobileBoostButton.classList.toggle("boost-empty", boostPct <= 0);
  }
}

function updateCamera(state) {
  const localCar = state.cars?.[activePlayerId()];
  if (!localCar) {
    camera.position.lerp(new THREE.Vector3(0, Math.max(70, state.arena.l * 0.56), state.arena.l * 0.72), 0.04);
    camera.lookAt(0, 0, 0);
    return;
  }
  let yaw = localCar.yaw;
  if (localBallCam && state.ball) {
    yaw = Math.atan2(state.ball.x - localCar.x, state.ball.z - localCar.z);
  }
  const offset = new THREE.Vector3(0, localBallCam ? 8 : 6.8, localBallCam ? -20 : -18);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const desired = new THREE.Vector3(localCar.x, localCar.y + 1.6, localCar.z).add(offset);
  camera.position.lerp(desired, 0.16);
  let look;
  if (localBallCam) {
    const toBall = new THREE.Vector3(state.ball.x - localCar.x, 0, state.ball.z - localCar.z).normalize();
    look = new THREE.Vector3(localCar.x + toBall.x * 14, localCar.y + 2.4, localCar.z + toBall.z * 14);
  } else {
    const fwd = new THREE.Vector3(Math.sin(localCar.yaw), 0, Math.cos(localCar.yaw));
    look = new THREE.Vector3(localCar.x + fwd.x * 24, localCar.y + 2.2, localCar.z + fwd.z * 24);
  }
  camera.lookAt(look);
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  if (latestState) updateVisuals(latestState);
  resizeRenderer();
  renderer.render(scene, camera);
}

setupMobileControls();
firebaseBootPromise = bootFirebase();
renderLoop();
