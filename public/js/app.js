import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue, remove, onDisconnect, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
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
const ui = {
  setup: $("#setup-card"), lobby: $("#lobby-card"), firebaseWarning: $("#firebase-warning"),
  name: $("#player-name"), create: $("#create-lobby"), joinCode: $("#join-code"), join: $("#join-lobby"),
  connection: $("#connection-status"), lobbyCode: $("#lobby-code-label"), lobbyStatus: $("#lobby-status"), copy: $("#copy-code"),
  mode: $("#mode-select"), teamSize: $("#team-size-select"), difficulty: $("#difficulty-select"), playstyle: $("#playstyle-select"),
  maxHumans: $("#max-humans-label"), team: $("#team-select"), role: $("#role-select"), ready: $("#ready-btn"),
  leaveLobby: $("#leave-lobby"), blueList: $("#blue-team-list"), orangeList: $("#orange-team-list"),
  hud: $("#hud"), scoreBlue: $("#score-blue"), scoreOrange: $("#score-orange"), clock: $("#clock"), leaveGame: $("#leave-game"),
  mobile: $("#mobile-controls"), stickZone: $("#stick-zone"), stickKnob: $("#stick-knob")
};

const canvas = $("#game");
let firebaseReady = false;
let auth = null;
let db = null;
let uid = null;
let playerName = localStorage.getItem("pl_online_name") || "Player";
let lobbyCode = null;
let currentLobby = null;
let currentMeta = null;
let currentPlayers = {};
let latestState = null;
let latestInputs = {};
let hostSim = null;
let hostRaf = 0;
let unsubLobby = null;
let unsubInputs = null;
let unsubState = null;
let inputTimer = 0;
let localBallCam = localStorage.getItem("pl_ball_cam") === "1";
const keys = {};
const bindings = defaultBindings();
const mobileInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, reset: false };
let mobileCamPulse = false;
let camKeyLatch = false;
let touchDevice = matchMedia("(pointer: coarse)").matches;

ui.name.value = playerName;

function hasPlaceholderConfig(config) {
  return !config || Object.values(config).some(v => typeof v === "string" && (v.includes("PASTE") || v.includes("YOUR_PROJECT")));
}

async function bootFirebase() {
  if (hasPlaceholderConfig(FIREBASE_CONFIG)) {
    ui.firebaseWarning.classList.remove("hidden");
    ui.connection.textContent = "Firebase config required before online multiplayer can connect.";
    ui.create.disabled = true;
    ui.join.disabled = true;
    return;
  }
  try {
    const app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getDatabase(app);
    onAuthStateChanged(auth, user => {
      if (user) {
        uid = user.uid;
        firebaseReady = true;
        ui.connection.textContent = "Connected. Create a lobby or join with a code.";
        ui.create.disabled = false;
        ui.join.disabled = false;
      }
    });
    await signInAnonymously(auth);
  } catch (err) {
    console.error(err);
    ui.connection.textContent = `Firebase error: ${err.message}`;
    ui.create.disabled = true;
    ui.join.disabled = true;
  }
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

async function createLobby() {
  if (!firebaseReady) return;
  playerName = sanitizeName(ui.name.value);
  localStorage.setItem("pl_online_name", playerName);
  let code = randomCode();
  for (let i = 0; i < 8; i++) {
    const snap = await get(lobbyRef(code));
    if (!snap.exists()) break;
    code = randomCode();
  }
  const meta = { ...DEFAULT_META, hostId: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), status: "waiting" };
  const player = { name: playerName, team: "blue", role: "midfield", ready: false, joinedAt: serverTimestamp(), isHost: true };
  await set(lobbyRef(code), { meta, players: { [uid]: player }, inputs: {}, state: null });
  await enterLobby(code);
}

async function joinLobby() {
  if (!firebaseReady) return;
  playerName = sanitizeName(ui.name.value);
  localStorage.setItem("pl_online_name", playerName);
  const code = ui.joinCode.value.trim().toUpperCase();
  if (!code) return setStatus("Enter a lobby code first.");
  const snap = await get(lobbyRef(code));
  if (!snap.exists()) return setStatus("Lobby not found.");
  const data = snap.val();
  const meta = serialiseMeta(data.meta || {});
  if ((data.meta || {}).status !== "waiting") return setStatus("That match has already started.");
  const humans = Object.keys(data.players || {}).length;
  const maxHumans = maxHumansFor(meta.mode, meta.teamSize);
  if (humans >= maxHumans) return setStatus(`Lobby is full for ${MODE_CONFIGS[meta.mode].label}.`);
  const counts = countTeams(data.players || {});
  const team = counts.blue <= counts.orange ? "blue" : "orange";
  await set(lobbyRef(code, `players/${uid}`), { name: playerName, team, role: "midfield", ready: false, joinedAt: serverTimestamp(), isHost: false });
  await enterLobby(code);
}

function setStatus(text) {
  ui.connection.textContent = text;
}

async function enterLobby(code) {
  cleanupLobbyListeners();
  lobbyCode = code;
  ui.setup.classList.add("hidden");
  ui.lobby.classList.remove("hidden");
  ui.lobbyCode.textContent = code;
  onDisconnect(lobbyRef(code, `players/${uid}`)).remove();
  onDisconnect(lobbyRef(code, `inputs/${uid}`)).remove();
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
  const isHost = currentMeta.hostId === uid;
  const local = currentPlayers[uid] || {};
  ui.mode.value = currentMeta.mode;
  ui.teamSize.value = String(currentMeta.teamSize);
  ui.difficulty.value = currentMeta.difficulty;
  ui.playstyle.value = currentMeta.playstyle;
  ui.team.value = local.team || "blue";
  ui.role.value = local.role || "midfield";
  ui.ready.classList.toggle("not-ready", !!local.ready);
  ui.ready.textContent = local.ready ? "Unready" : "Ready";
  ui.mode.disabled = ui.teamSize.disabled = ui.difficulty.disabled = ui.playstyle.disabled = !isHost || currentMeta.status !== "waiting";
  const maxHumans = maxHumansFor(currentMeta.mode, currentMeta.teamSize);
  const humanCount = Object.keys(currentPlayers).length;
  ui.maxHumans.textContent = `Max humans in this mode: ${maxHumans} · Humans joined: ${humanCount}/${maxHumans} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`;
  const allReady = humanCount > 0 && Object.values(currentPlayers).every(p => p.ready);
  if (currentMeta.status === "waiting") {
    ui.lobbyStatus.textContent = allReady && humanCount <= maxHumans ? "Everyone is ready — starting…" : "Waiting for players to ready up.";
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
      html += `<div class="slot ${team}"><span class="dot"></span><div><div class="name">${escapeHtml(p.name || "Player")}${id === uid ? " (you)" : ""}</div><div class="meta">${roleLabel(p.role)}${id === meta.hostId ? " · Host" : ""}</div></div><span class="ready-pill">${p.ready ? "READY" : "NOT READY"}</span></div>`;
    } else {
      const role = meta.aiRoles?.[team]?.[i] || defaultRoleForSlot(i, meta.teamSize);
      const isHost = meta.hostId === uid && meta.status === "waiting";
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
  if (!lobbyCode || !currentMeta || currentMeta.hostId !== uid) return;
  await update(lobbyRef(lobbyCode, "meta"), { ...patch, updatedAt: serverTimestamp() });
}

async function updateLocalPlayer(patch) {
  if (!lobbyCode || !uid) return;
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
  if (!currentMeta || currentMeta.hostId !== uid || !readyStateAllowsStart()) return;
  const initial = makeInitialState(currentMeta, currentPlayers);
  await update(lobbyRef(lobbyCode), {
    meta: { ...currentLobby.meta, status: "running", startedAt: serverTimestamp(), updatedAt: serverTimestamp() },
    state: compactState(initial)
  });
  hostSim = new PhysicsHost(currentMeta, currentPlayers);
  startHostLoop();
}

function updateGameVisibility() {
  const running = currentMeta && currentMeta.status === "running";
  ui.hud.classList.toggle("hidden", !running);
  ui.leaveGame.classList.toggle("hidden", !running);
  ui.lobby.classList.toggle("hidden", running);
  ui.mobile.classList.toggle("hidden", !running || !isPhonePortrait());
  if (running && currentMeta?.hostId === uid && !hostSim) {
    hostSim = new PhysicsHost(currentMeta, currentPlayers);
    if (currentLobby?.state) hostSim.state = currentLobby.state;
    startHostLoop();
  }
}

function startHostLoop() {
  if (hostRaf) return;
  let last = performance.now();
  let acc = 0;
  const fixed = 1 / 60;
  const loop = now => {
    hostRaf = requestAnimationFrame(loop);
    if (!hostSim || !currentMeta || currentMeta.status !== "running" || currentMeta.hostId !== uid) return;
    const dt = Math.min(0.08, (now - last) / 1000);
    last = now;
    acc += dt;
    let shouldWrite = false;
    while (acc >= fixed) {
      hostSim.syncMeta(currentMeta, currentPlayers);
      hostSim.setInputs(latestInputs);
      shouldWrite = hostSim.step(fixed, currentPlayers) || shouldWrite;
      acc -= fixed;
    }
    latestState = compactState(hostSim.state);
    if (shouldWrite) set(lobbyRef(lobbyCode, "state"), latestState);
    if (hostSim.state.ended) update(lobbyRef(lobbyCode, "meta"), { status: "ended", endedAt: serverTimestamp() });
  };
  hostRaf = requestAnimationFrame(loop);
}

function stopHostLoop() {
  if (hostRaf) cancelAnimationFrame(hostRaf);
  hostRaf = 0;
  hostSim = null;
}

async function leaveToMenu(message = "") {
  if (lobbyCode && uid && db) {
    await remove(lobbyRef(lobbyCode, `players/${uid}`)).catch(() => {});
    await remove(lobbyRef(lobbyCode, `inputs/${uid}`)).catch(() => {});
  }
  cleanupLobbyListeners();
  lobbyCode = null; currentLobby = null; currentMeta = null; currentPlayers = {}; latestState = null;
  ui.setup.classList.remove("hidden");
  ui.lobby.classList.add("hidden");
  ui.hud.classList.add("hidden");
  ui.leaveGame.classList.add("hidden");
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
  if (!lobbyCode || !uid || !db || !currentMeta || currentMeta.status !== "running") return;
  const inp = localInput();
  await set(lobbyRef(lobbyCode, `inputs/${uid}`), { ...inp, t: Date.now() }).catch(() => {});
}

// UI events
ui.create.addEventListener("click", createLobby);
ui.join.addEventListener("click", joinLobby);
ui.joinCode.addEventListener("input", () => ui.joinCode.value = ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
ui.copy.addEventListener("click", () => navigator.clipboard?.writeText(lobbyCode || ""));
ui.leaveLobby.addEventListener("click", () => leaveToMenu("Left lobby."));
ui.leaveGame.addEventListener("click", () => leaveToMenu("Left match."));
ui.ready.addEventListener("click", () => updateLocalPlayer({ ready: !(currentPlayers[uid]?.ready) }));
ui.team.addEventListener("change", () => updateLocalPlayer({ team: ui.team.value, ready: false }));
ui.role.addEventListener("change", () => updateLocalPlayer({ role: ui.role.value, ready: false }));
ui.mode.addEventListener("change", () => updateMetaPatch({ mode: ui.mode.value }));
ui.teamSize.addEventListener("change", () => updateMetaPatch({ teamSize: Number(ui.teamSize.value) }));
ui.difficulty.addEventListener("change", () => updateMetaPatch({ difficulty: ui.difficulty.value }));
ui.playstyle.addEventListener("change", () => updateMetaPatch({ playstyle: ui.playstyle.value }));

[ui.blueList, ui.orangeList].forEach(root => {
  root.addEventListener("change", e => {
    const sel = e.target.closest(".ai-role-select");
    if (!sel || !currentMeta || currentMeta.hostId !== uid) return;
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
    localStorage.setItem("pl_ball_cam", localBallCam ? "1" : "0");
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
  let activeId = null;
  function setStick(clientX, clientY) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const max = Math.min(rect.width, rect.height) * 0.32;
    const dx = clamp(clientX - cx, -max, max);
    const dy = clamp(clientY - cy, -max, max);
    const nx = dx / max;
    const ny = dy / max;
    mobileInput.steer = clamp(nx, -1, 1);
    mobileInput.throttle = clamp(-ny, -1, 1);
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }
  function resetStick() {
    activeId = null;
    mobileInput.steer = 0; mobileInput.throttle = 0;
    knob.style.transform = "translate(-50%, -50%)";
  }
  zone.addEventListener("pointerdown", e => { activeId = e.pointerId; zone.setPointerCapture(activeId); setStick(e.clientX, e.clientY); });
  zone.addEventListener("pointermove", e => { if (e.pointerId === activeId) setStick(e.clientX, e.clientY); });
  zone.addEventListener("pointerup", e => { if (e.pointerId === activeId) resetStick(); });
  zone.addEventListener("pointercancel", e => { if (e.pointerId === activeId) resetStick(); });

  document.querySelectorAll(".touch-btn").forEach(btn => {
    const action = btn.dataset.action;
    btn.addEventListener("pointerdown", e => {
      e.preventDefault(); btn.setPointerCapture(e.pointerId); btn.classList.add("active");
      if (action === "cam") {
        localBallCam = !localBallCam;
        localStorage.setItem("pl_ball_cam", localBallCam ? "1" : "0");
      } else if (action in mobileInput) {
        mobileInput[action] = true;
      }
    });
    const up = e => {
      btn.classList.remove("active");
      if (action in mobileInput && action !== "jump" && action !== "reset") mobileInput[action] = false;
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
  box(1.2, 13, arena.l, -arena.w / 2, 6.5, 0);
  box(1.2, 13, arena.l, arena.w / 2, 6.5, 0);
  const sideW = (arena.w - arena.goalW) / 2;
  box(sideW, 13, 1.2, -arena.w / 2 + sideW / 2, 6.5, -arena.l / 2);
  box(sideW, 13, 1.2, arena.w / 2 - sideW / 2, 6.5, -arena.l / 2);
  box(sideW, 13, 1.2, -arena.w / 2 + sideW / 2, 6.5, arena.l / 2);
  box(sideW, 13, 1.2, arena.w / 2 - sideW / 2, 6.5, arena.l / 2);
  box(arena.goalW, 13 - arena.goalH, 1.2, 0, arena.goalH + (13 - arena.goalH) / 2, -arena.l / 2, trimBlue);
  box(arena.goalW, 13 - arena.goalH, 1.2, 0, arena.goalH + (13 - arena.goalH) / 2, arena.l / 2, trimOrange);
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
  g.add(body, cabin, nose);
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
  for (const car of Object.values(state.cars || {})) {
    const mesh = carMeshes.get(car.id) || createCarMesh(car, state);
    mesh.position.set(car.x, car.y - VISUAL_CONSTANTS.CAR_RADIUS + 0.08, car.z);
    mesh.rotation.y = car.yaw;
    const scale = car.cueCooldown > 0 ? 1 + car.cueCooldown * 0.45 : 1;
    mesh.scale.set(1, 1, scale);
  }
  updateHud(state);
  updateCamera(state);
}

function updateHud(state) {
  ui.scoreBlue.textContent = `BLUE ${state.score?.blue ?? 0}`;
  ui.scoreOrange.textContent = `${state.score?.orange ?? 0} ORANGE`;
  const t = Math.max(0, Math.ceil(state.timeLeft || 0));
  ui.clock.textContent = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function updateCamera(state) {
  const localCar = state.cars?.[uid];
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
bootFirebase();
renderLoop();
