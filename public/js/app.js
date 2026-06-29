import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import { FIREBASE_CONFIG } from "./config.js";
import {
  DEFAULT_META,
  MODE_CONFIGS,
  ROLES,
  STADIUM_THEMES,
  VEHICLE_CONFIGS,
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
  setup: $("#setup-card"), lobby: $("#lobby-card"), accountCard: $("#account-card"), leaderboardCard: $("#leaderboard-card"), firebaseWarning: $("#firebase-warning"),
  name: $("#player-name"), single: $("#single-player"), create: $("#create-lobby"), joinCode: $("#join-code"), join: $("#join-lobby"),
  accountStatus: $("#account-status"), openAccount: $("#open-account"), closeAccount: $("#close-account"), accountUsername: $("#account-username"), accountPassword: $("#account-password"), createAccount: $("#create-account"), signInAccount: $("#sign-in-account"), signOutAccount: $("#sign-out-account"), accountMessage: $("#account-message"),
  openLeaderboard: $("#open-leaderboard"), closeLeaderboard: $("#close-leaderboard"), leaderboardList: $("#leaderboard-list"),
  connection: $("#connection-status"), lobbyCode: $("#lobby-code-label"), lobbyStatus: $("#lobby-status"), copy: $("#copy-code"),
  mode: $("#mode-select"), theme: $("#theme-select"), teamSize: $("#team-size-select"), difficulty: $("#difficulty-select"), playstyle: $("#playstyle-select"), chatScope: $("#chat-scope-select"),
  maxHumans: $("#max-humans-label"), team: $("#team-select"), role: $("#role-select"), vehicle: $("#vehicle-select"), ready: $("#ready-btn"),
  leaveLobby: $("#leave-lobby"), blueList: $("#blue-team-list"), orangeList: $("#orange-team-list"),
  hud: $("#hud"), scoreBlue: $("#score-blue"), scoreOrange: $("#score-orange"), clock: $("#clock"), countdown: $("#round-countdown"), leaveGame: $("#leave-game"), pauseGame: $("#pause-game"), toggleChat: $("#toggle-chat"), pauseOverlay: $("#pause-overlay"),
  boostLabel: $("#boost-label"), boostBox: $("#boost-container"), boostFill: $("#boost-fill"),
  controlsHint: $("#controls-hint"), camState: $("#cam-state"),
  mobile: $("#mobile-controls"), stickZone: $("#stick-zone"), stickKnob: $("#stick-knob"),
  mobileActionPad: $("#mobile-action-pad"),
  mobileBoostButton: document.querySelector('[data-action="boost"]'),
  chatPanel: $("#chat-panel"), chatMessages: $("#chat-messages"), chatForm: $("#chat-form"), chatInput: $("#chat-input"), chatMute: $("#chat-mute"), chatGameTab: $("#chat-game-tab"), chatTeamTab: $("#chat-team-tab"),
  vehiclePreview: $("#vehicle-preview"), vehiclePreviewName: $("#vehicle-preview-name"), vehiclePreviewDesc: $("#vehicle-preview-desc")
};


// ---------------------------------------------------------------------------
// Procedural sound effects, adapted from the HTML-only V10 build. Browsers only
// unlock WebAudio after a tap/key press, so resume() is called from UI events.
// ---------------------------------------------------------------------------
const SFX = (() => {
  let ctx = null;
  let master = null;
  let engineOsc = null;
  let engineGain = null;
  let boostNoise = null;
  let boostGain = null;
  let skidNoise = null;
  let skidGain = null;
  let startedLoops = false;
  let muted = false;
  let seed = 7331;

  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  function init() {
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.72;
    master.connect(ctx.destination);

    engineOsc = ctx.createOscillator();
    engineOsc.type = "sawtooth";
    const engineFilter = ctx.createBiquadFilter();
    engineFilter.type = "lowpass";
    engineFilter.frequency.value = 360;
    engineGain = ctx.createGain();
    engineGain.gain.value = 0;
    engineOsc.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(master);

    boostNoise = ctx.createBufferSource();
    boostNoise.buffer = noiseBuffer(1.4);
    boostNoise.loop = true;
    const boostFilter = ctx.createBiquadFilter();
    boostFilter.type = "bandpass";
    boostFilter.frequency.value = 1450;
    boostFilter.Q.value = 0.88;
    boostGain = ctx.createGain();
    boostGain.gain.value = 0;
    boostNoise.connect(boostFilter);
    boostFilter.connect(boostGain);
    boostGain.connect(master);

    skidNoise = ctx.createBufferSource();
    skidNoise.buffer = noiseBuffer(1.2);
    skidNoise.loop = true;
    const skidFilter = ctx.createBiquadFilter();
    skidFilter.type = "highpass";
    skidFilter.frequency.value = 1750;
    skidGain = ctx.createGain();
    skidGain.gain.value = 0;
    skidNoise.connect(skidFilter);
    skidFilter.connect(skidGain);
    skidGain.connect(master);
  }

  function noiseBuffer(seconds) {
    const rate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(rate * seconds)), rate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = rand() * 2 - 1;
      last = last * 0.82 + white * 0.18;
      data[i] = last;
    }
    return buffer;
  }

  function resume() {
    init();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    if (!startedLoops) {
      engineOsc.start();
      boostNoise.start();
      skidNoise.start();
      startedLoops = true;
    }
  }

  function ready() { return ctx && master && !muted; }

  function tone(freq, duration, volume = 0.08, type = "sine", when = 0, bend = 1) {
    if (!ready()) return;
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (bend !== 1) osc.frequency.exponentialRampToValueAtTime(Math.max(24, freq * bend), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + duration + 0.04);
  }

  function noiseBurst(duration, volume = 0.08, filterType = "bandpass", freq = 1000, q = 0.8, when = 0) {
    if (!ready()) return;
    const t = ctx.currentTime + when;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer(duration + 0.04);
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start(t);
    source.stop(t + duration + 0.05);
  }

  function ui(freq = 680) { resume(); tone(freq, 0.06, 0.042, "triangle", 0, 1.16); }
  function countdown(n = 3) { resume(); tone(n <= 1 ? 880 : 520, 0.10, 0.072, "square", 0, 1.08); }
  function kickoff() { resume(); tone(330, 0.08, 0.07, "square", 0, 1.25); tone(660, 0.16, 0.065, "triangle", 0.09, 1.18); noiseBurst(0.24, 0.045, "bandpass", 980, 0.6, 0.06); }
  function jump(double = false) { resume(); tone(double ? 255 : 190, 0.11, double ? 0.07 : 0.055, "triangle", 0, double ? 1.75 : 1.50); noiseBurst(0.10, double ? 0.06 : 0.04, "highpass", double ? 1300 : 900, 0.55); }
  function ballHit(impulse = 20) { resume(); const g = clamp(impulse / 36, 0.20, 1.05); tone(145 + impulse * 4.2, 0.11, 0.075 * g, "triangle", 0, 0.62); noiseBurst(0.10, 0.085 * g, "bandpass", 720 + impulse * 16, 0.9); }
  function wallHit(speed = 8) { resume(); const g = clamp(speed / 28, 0.12, 0.82); tone(110, 0.11, 0.05 * g, "sine", 0, 0.58); noiseBurst(0.10, 0.075 * g, "bandpass", 580, 0.75); }
  function bounce(speed = 8) { resume(); const g = clamp(speed / 24, 0.10, 0.72); tone(125 + speed * 5, 0.07, 0.04 * g, "triangle", 0, 0.72); }
  function boostPad(big = false) { resume(); tone(big ? 260 : 360, 0.08, big ? 0.064 : 0.052, "triangle", 0, 1.65); tone(big ? 520 : 720, 0.11, big ? 0.050 : 0.038, "triangle", 0.04, 1.20); noiseBurst(big ? 0.22 : 0.12, big ? 0.080 : 0.045, "highpass", big ? 1250 : 1700, 0.60); }
  function carBump(impact = 8) { resume(); const g = clamp(impact / 26, 0.14, 0.88); tone(82, 0.14, 0.06 * g, "square", 0, 0.60); noiseBurst(0.11, 0.065 * g, "lowpass", 360, 0.75); }
  function goal(team = "blue") { resume(); const base = team === "blue" ? 330 : 294; tone(base, 0.20, 0.095, "sawtooth", 0, 1.5); tone(base * 1.5, 0.24, 0.08, "sawtooth", 0.13, 1.3); tone(base * 2, 0.40, 0.085, "triangle", 0.28, 1.08); noiseBurst(0.85, 0.13, "bandpass", 1050, 0.42, 0.06); }

  function update(state, playerId) {
    if (!ctx || !startedLoops || !state?.cars || !playerId) return;
    const car = state.cars[playerId];
    if (!car) return;
    const t = ctx.currentTime;
    const speed = Math.hypot(car.vx || 0, car.vz || 0);
    const targetEngine = muted || !document.body.classList.contains("game-running") ? 0 : (0.022 + clamp(speed / 55, 0, 1) * 0.050 + (Math.abs(mobileInput.throttle) > 0.05 ? 0.014 : 0));
    const targetFreq = 78 + speed * 6.0 + (car.boosting ? 76 : 0);
    engineOsc.frequency.setTargetAtTime(targetFreq, t, 0.045);
    engineGain.gain.setTargetAtTime(targetEngine, t, 0.08);
    boostGain.gain.setTargetAtTime(muted ? 0 : (car.boosting ? 0.135 : 0), t, car.boosting ? 0.018 : 0.06);
    const skid = car.grounded && car.drifting && speed > 8 ? clamp(speed / 34, 0, 1) : 0;
    skidGain.gain.setTargetAtTime(muted ? 0 : skid * 0.070, t, 0.045);
  }

  return { resume, ui, countdown, kickoff, jump, ballHit, wallHit, bounce, boostPad, carBump, goal, update };
})();

const canvas = $("#game");
let initializeApp, getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, getDatabase, ref, get, set, push, update, onValue, remove, onDisconnect, serverTimestamp, query, orderByChild, limitToLast, runTransaction;
let firebaseBootPromise = null;
let firebaseBootDone = false;
let firebaseBootError = null;
let firebaseReady = false;
let auth = null;
let db = null;
let uid = null;
let authUser = null;
let accountProfile = null;
let leaderboardUnsub = null;
let leaderboardLoaded = false;
let lastLeaderboardMatchKey = "";
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
let unsubChat = null;
let inputTimer = 0;
let currentChat = {};
let chatChannel = localStorage.getItem("rlcss_chat_channel") || "game";
let chatMuted = localStorage.getItem("rlcss_chat_muted") === "1";
let chatOpen = localStorage.getItem("rlcss_chat_open") === "1";
let chatOpenPreferenceSet = localStorage.getItem("rlcss_chat_open") !== null;
let chatRenderKey = "";
let localBallCam = (localStorage.getItem("rlcss_ball_cam") ?? localStorage.getItem("pl_ball_cam")) === "1";
const keys = {};
const bindings = defaultBindings();
const mobileInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, reset: false };
let mobileDriftTimer = 0;
let mobileDriftCooldownTimer = 0;
let camKeyLatch = false;
let touchDevice = matchMedia("(pointer: coarse)").matches;

ui.name.value = playerName;
populateChoiceSelects();

function populateChoiceSelects() {
  fillSelect(ui.theme, STADIUM_THEMES, DEFAULT_META.theme);
  fillSelect(ui.vehicle, VEHICLE_CONFIGS, "default");
}

function fillSelect(select, configs, fallback) {
  if (!select) return;
  const current = select.value || fallback;
  select.innerHTML = Object.entries(configs)
    .map(([key, cfg]) => `<option value="${key}">${escapeHtml(cfg.label || key)}</option>`)
    .join("");
  select.value = configs[current] ? current : fallback;
}

function vehicleLabel(model) {
  return (VEHICLE_CONFIGS[model] || VEHICLE_CONFIGS.default).label;
}

function themeLabel(theme) {
  return (STADIUM_THEMES[theme] || STADIUM_THEMES.v10).label;
}

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
    ({ getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } = authMod);
    ({ getDatabase, ref, get, set, push, update, onValue, remove, onDisconnect, serverTimestamp, query, orderByChild, limitToLast, runTransaction } = dbMod);
    const app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getDatabase(app);
    await new Promise((resolve, reject) => {
      let settled = false;
      let triedAnonymous = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          reject(new Error("Firebase sign-in timed out. Check Anonymous Auth, Email/Password Auth and Authorized Domains."));
        }
      }, 12000);
      onAuthStateChanged(auth, user => {
        authUser = user || null;
        if (user) {
          clearTimeout(timer);
          uid = user.uid;
          firebaseReady = true;
          refreshAccountProfile().finally(() => updateAccountUi());
          startLeaderboardListener();
          ui.connection.textContent = "Connected. Create a lobby or join with a code.";
          ui.create.disabled = false;
          ui.join.disabled = false;
          if (!settled) {
            settled = true;
            resolve();
          }
        } else {
          accountProfile = null;
          updateAccountUi();
          if (!triedAnonymous) {
            triedAnonymous = true;
            signInAnonymously(auth).catch(err => {
              clearTimeout(timer);
              if (!settled) {
                settled = true;
                reject(err);
              }
            });
          }
        }
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

function normalizeUsername(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 18);
}

function usernameToEmail(username) {
  return `${normalizeUsername(username)}@rlcss.local`;
}

function isAccountUser() {
  return !!authUser && !authUser.isAnonymous && !!accountProfile?.username;
}

function accountName() {
  return accountProfile?.displayName || accountProfile?.username || sanitizeName(ui.name?.value || playerName);
}

function updateAccountUi() {
  const signedIn = isAccountUser();
  const anon = !!authUser?.isAnonymous;
  if (ui.accountStatus) {
    ui.accountStatus.textContent = signedIn
      ? `Signed in: ${accountName()}`
      : (anon ? "Playing as guest" : "Offline / guest only");
  }
  if (ui.accountMessage && !signedIn && !ui.accountMessage.dataset.busy) {
    ui.accountMessage.textContent = authUser
      ? "Guest play works. Create or sign in to save leaderboard stats."
      : "Connect Firebase to create accounts and save leaderboard stats.";
  }
  if (ui.signOutAccount) ui.signOutAccount.classList.toggle("hidden", !signedIn);
  if (signedIn) {
    playerName = sanitizeName(accountName());
    localStorage.setItem("rlcss_online_name", playerName);
    if (ui.name && (!ui.name.value || ui.name.value === "Player" || ui.name.value !== playerName)) ui.name.value = playerName;
  }
}

function profileRef(id = uid) {
  return ref(db, `profiles/${id}`);
}

function leaderboardRef(id = uid) {
  return ref(db, `leaderboard/${id}`);
}

async function refreshAccountProfile() {
  if (!db || !uid || !authUser || authUser.isAnonymous) {
    accountProfile = null;
    updateAccountUi();
    return null;
  }
  try {
    const snap = await get(profileRef(uid));
    accountProfile = snap.exists() ? snap.val() : null;
  } catch (err) {
    console.warn("Profile load failed", err);
    accountProfile = null;
  }
  updateAccountUi();
  return accountProfile;
}

async function saveProfile(username) {
  const clean = normalizeUsername(username);
  const displayName = sanitizeName(username);
  if (!clean || clean.length < 3) throw new Error("Username must be 3–18 letters, numbers, _ or -.");
  const payload = {
    username: clean,
    displayName,
    updatedAt: serverTimestamp(),
    createdAt: accountProfile?.createdAt || serverTimestamp()
  };
  await set(profileRef(uid), payload);
  await set(ref(db, `usernames/${clean}`), uid).catch(err => console.warn("Username map write failed", err));
  accountProfile = { ...payload, createdAt: Date.now(), updatedAt: Date.now() };
  playerName = displayName;
  localStorage.setItem("rlcss_online_name", playerName);
  if (ui.name) ui.name.value = playerName;
  updateAccountUi();
}

function setAccountMessage(text, busy = false) {
  if (!ui.accountMessage) return;
  ui.accountMessage.dataset.busy = busy ? "1" : "";
  ui.accountMessage.textContent = text;
}

async function createAccount() {
  if (!(await ensureFirebaseReady())) return;
  const username = normalizeUsername(ui.accountUsername?.value || ui.name?.value);
  const password = String(ui.accountPassword?.value || "");
  if (!username || username.length < 3) return setAccountMessage("Choose a username with 3–18 letters, numbers, _ or -.");
  if (password.length < 6) return setAccountMessage("Password must be at least 6 characters.");
  setAccountMessage("Creating account…", true);
  const nameSnap = await get(ref(db, `usernames/${username}`)).catch(() => null);
  if (nameSnap?.exists()) return setAccountMessage("That username is already taken.");
  const cred = await createUserWithEmailAndPassword(auth, usernameToEmail(username), password);
  authUser = cred.user;
  uid = cred.user.uid;
  await saveProfile(username);
  await initialiseOwnLeaderboard(username);
  setAccountMessage(`Signed in as ${username}. Leaderboard stats will now save.`);
  startLeaderboardListener();
}

async function signInAccount() {
  if (!(await ensureFirebaseReady())) return;
  const username = normalizeUsername(ui.accountUsername?.value || ui.name?.value);
  const password = String(ui.accountPassword?.value || "");
  if (!username || username.length < 3) return setAccountMessage("Enter your username.");
  if (!password) return setAccountMessage("Enter your password.");
  setAccountMessage("Signing in…", true);
  const cred = await signInWithEmailAndPassword(auth, usernameToEmail(username), password);
  authUser = cred.user;
  uid = cred.user.uid;
  await refreshAccountProfile();
  if (!accountProfile?.username) await saveProfile(username);
  await initialiseOwnLeaderboard(username);
  setAccountMessage(`Signed in as ${accountName()}.`);
  startLeaderboardListener();
}

async function signOutAccount() {
  if (!auth || !signOut) return;
  setAccountMessage("Signing out…", true);
  await signOut(auth);
  accountProfile = null;
  uid = null;
  authUser = null;
  updateAccountUi();
  await signInAnonymously(auth);
  setAccountMessage("Signed out. Back to guest mode.");
}

async function initialiseOwnLeaderboard(username = accountName()) {
  if (!db || !uid || !isAccountUser()) return;
  const snap = await get(leaderboardRef(uid)).catch(() => null);
  if (snap?.exists()) return;
  await set(leaderboardRef(uid), {
    uid,
    username: normalizeUsername(username),
    displayName: sanitizeName(username),
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    games: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    updatedAt: serverTimestamp()
  }).catch(err => console.warn("Leaderboard init failed", err));
}

function startLeaderboardListener() {
  if (!db || !query || !orderByChild || !limitToLast || leaderboardUnsub) return;
  const q = query(ref(db, "leaderboard"), orderByChild("points"), limitToLast(25));
  leaderboardUnsub = onValue(q, snap => {
    leaderboardLoaded = true;
    const rows = [];
    snap.forEach(child => rows.push({ uid: child.key, ...(child.val() || {}) }));
    rows.sort((a, b) => (Number(b.points || 0) - Number(a.points || 0)) || (Number(b.wins || 0) - Number(a.wins || 0)) || String(a.displayName || a.username).localeCompare(String(b.displayName || b.username)));
    renderLeaderboard(rows);
  }, err => {
    console.warn("Leaderboard listener failed", err);
    if (ui.leaderboardList) ui.leaderboardList.textContent = `Leaderboard unavailable: ${err.message}`;
  });
}

function renderLeaderboard(rows = []) {
  if (!ui.leaderboardList) return;
  if (!rows.length) {
    ui.leaderboardList.innerHTML = '<div class="empty-board">No ranked matches yet.</div>';
    return;
  }
  ui.leaderboardList.innerHTML = rows.slice(0, 20).map((row, i) => {
    const mine = row.uid === uid ? " mine" : "";
    return `<div class="leaderboard-row${mine}"><span class="rank">#${i + 1}</span><span class="lb-name">${escapeHtml(row.displayName || row.username || "Player")}</span><span class="lb-points">${Number(row.points || 0)} pts</span><span class="lb-record">${Number(row.wins || 0)}W ${Number(row.draws || 0)}D ${Number(row.losses || 0)}L</span></div>`;
  }).join("");
}

async function recordLeaderboardResult(state) {
  if (!state?.ended || !isAccountUser() || !db || !uid) return;
  const matchKey = `${lobbyCode || "solo"}:${currentMeta?.startedAt || "run"}:${state.score?.blue || 0}-${state.score?.orange || 0}`;
  if (matchKey === lastLeaderboardMatchKey) return;
  const local = currentPlayers?.[activePlayerId()] || {};
  const team = local.team === "orange" ? "orange" : "blue";
  const blue = Number(state.score?.blue || 0);
  const orange = Number(state.score?.orange || 0);
  const gf = team === "blue" ? blue : orange;
  const ga = team === "blue" ? orange : blue;
  const win = gf > ga;
  const draw = gf === ga;
  const loss = gf < ga;
  lastLeaderboardMatchKey = matchKey;
  const lbRef = leaderboardRef(uid);
  if (runTransaction) {
    await runTransaction(lbRef, current => {
      const base = current || { uid, username: accountProfile.username, displayName: accountName(), points: 0, wins: 0, draws: 0, losses: 0, games: 0, goalsFor: 0, goalsAgainst: 0 };
      return {
        ...base,
        uid,
        username: accountProfile.username,
        displayName: accountName(),
        points: Number(base.points || 0) + (win ? 3 : draw ? 1 : 0),
        wins: Number(base.wins || 0) + (win ? 1 : 0),
        draws: Number(base.draws || 0) + (draw ? 1 : 0),
        losses: Number(base.losses || 0) + (loss ? 1 : 0),
        games: Number(base.games || 0) + 1,
        goalsFor: Number(base.goalsFor || 0) + gf,
        goalsAgainst: Number(base.goalsAgainst || 0) + ga,
        lastResult: `${gf}-${ga}`,
        updatedAt: Date.now()
      };
    });
  } else {
    const snap = await get(lbRef);
    const base = snap.exists() ? snap.val() : {};
    await set(lbRef, {
      ...base, uid, username: accountProfile.username, displayName: accountName(),
      points: Number(base.points || 0) + (win ? 3 : draw ? 1 : 0),
      wins: Number(base.wins || 0) + (win ? 1 : 0), draws: Number(base.draws || 0) + (draw ? 1 : 0), losses: Number(base.losses || 0) + (loss ? 1 : 0),
      games: Number(base.games || 0) + 1, goalsFor: Number(base.goalsFor || 0) + gf, goalsAgainst: Number(base.goalsAgainst || 0) + ga, lastResult: `${gf}-${ga}`, updatedAt: serverTimestamp()
    });
  }
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
    theme: ui.theme?.value || DEFAULT_META.theme,
    teamSize: Number(ui.teamSize?.value || DEFAULT_META.teamSize),
    difficulty: ui.difficulty?.value || DEFAULT_META.difficulty,
    playstyle: ui.playstyle?.value || DEFAULT_META.playstyle,
    chatScope: ui.chatScope?.value || DEFAULT_META.chatScope
  };
}

async function createLobby() {
  isSinglePlayer = false;
  ui.create.disabled = true;
  try {
    if (!(await ensureFirebaseReady())) return;
    playerName = sanitizeName(isAccountUser() ? accountName() : ui.name.value);
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
    const player = { name: playerName, team: ui.team.value || "blue", role: ui.role.value || "midfield", model: ui.vehicle?.value || "default", ready: false, joinedAt: serverTimestamp(), isHost: true };

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
    playerName = sanitizeName(isAccountUser() ? accountName() : ui.name.value);
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
    await withTimeout(set(lobbyRef(code, `players/${uid}`), { name: playerName, team, role: "midfield", model: ui.vehicle?.value || "default", ready: false, joinedAt: serverTimestamp(), isHost: false }), 12000, "Joining lobby");
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
  playerName = sanitizeName(isAccountUser() ? accountName() : ui.name.value);
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
      model: ui.vehicle?.value || "default",
      ready: true,
      joinedAt: Date.now(),
      isHost: true,
      local: true
    }
  };
  currentChat = {};
  currentLobby = { meta: currentMeta, players: currentPlayers, inputs: {}, state: null, chat: currentChat };
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
    name: sanitizeName(isAccountUser() ? accountName() : ui.name.value),
    team: ui.team.value || currentPlayers[localId]?.team || "blue",
    role: ui.role.value || currentPlayers[localId]?.role || "midfield",
    model: ui.vehicle?.value || currentPlayers[localId]?.model || "default",
    ready: true
  };
  currentMeta = serialiseMeta({ ...currentMeta, status: "running", startedAt: Date.now(), updatedAt: Date.now() });
  const initial = makeInitialState(currentMeta, currentPlayers);
  initial.kickoffTimer = 5;
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
  unsubChat = onValue(lobbyRef(code, "chat"), snap => { currentChat = snap.val() || {}; renderChat(); });
  clearInterval(inputTimer);
  inputTimer = setInterval(sendInput, 33);
}

function cleanupLobbyListeners() {
  if (typeof unsubLobby === "function") unsubLobby();
  if (typeof unsubInputs === "function") unsubInputs();
  if (typeof unsubState === "function") unsubState();
  if (typeof unsubChat === "function") unsubChat();
  unsubLobby = unsubInputs = unsubState = unsubChat = null;
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
  if (ui.theme) ui.theme.value = currentMeta.theme || DEFAULT_META.theme;
  ui.teamSize.value = String(currentMeta.teamSize);
  ui.difficulty.value = currentMeta.difficulty;
  ui.playstyle.value = currentMeta.playstyle;
  if (ui.chatScope) ui.chatScope.value = currentMeta.chatScope || DEFAULT_META.chatScope;
  ui.team.value = local.team || "blue";
  ui.role.value = local.role || "midfield";
  if (ui.vehicle) ui.vehicle.value = (VEHICLE_CONFIGS[local.model] ? local.model : "default");
  updateVehiclePreview(false);
  ui.ready.classList.toggle("not-ready", !isSinglePlayer && !!local.ready);
  ui.ready.textContent = isSinglePlayer ? "Start Match" : (local.ready ? "Unready" : "Ready");
  ui.mode.disabled = ui.teamSize.disabled = ui.difficulty.disabled = ui.playstyle.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.chatScope) ui.chatScope.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.theme) ui.theme.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.vehicle) ui.vehicle.disabled = currentMeta.status !== "waiting";
  ui.copy.disabled = isSinglePlayer;
  ui.copy.textContent = isSinglePlayer ? "Solo" : "Copy Code";
  const maxHumans = maxHumansFor(currentMeta.mode, currentMeta.teamSize);
  const humanCount = Object.keys(currentPlayers).length;
  const chatCopy = (currentMeta.chatScope || "all") === "team" ? "Game chat: same-team" : "Game chat: everyone";
  ui.maxHumans.textContent = isSinglePlayer
    ? `Solo mode · ${themeLabel(currentMeta.theme)} · ${chatCopy} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`
    : `Lobby theme: ${themeLabel(currentMeta.theme)} · ${chatCopy} · Max humans: ${maxHumans} · Humans joined: ${humanCount}/${maxHumans} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`;
  const allReady = humanCount > 0 && Object.values(currentPlayers).every(p => p.ready);
  if (currentMeta.status === "waiting") {
    ui.lobbyStatus.textContent = isSinglePlayer
      ? "Solo setup: configure teams, modes and AI, then start."
      : (allReady && humanCount <= maxHumans ? "Everyone is ready — starting…" : "Waiting for players to ready up.");
  } else if (currentMeta.status === "running") {
    ui.lobbyStatus.textContent = currentMeta.paused ? "Match paused by host." : "Match in progress.";
  } else {
    ui.lobbyStatus.textContent = currentMeta.status || "Lobby";
  }
  renderTeamList("blue", ui.blueList);
  renderTeamList("orange", ui.orangeList);
  renderChat();
}

function renderTeamList(team, root) {
  const meta = currentMeta || DEFAULT_META;
  const teamHumans = Object.entries(currentPlayers || {}).filter(([,p]) => (p.team || "blue") === team);
  let html = "";
  for (let i = 0; i < meta.teamSize; i++) {
    const entry = teamHumans[i];
    if (entry) {
      const [id, p] = entry;
      html += `<div class="slot ${team}"><span class="dot"></span><div><div class="name">${escapeHtml(p.name || "Player")}${id === activePlayerId() ? " (you)" : ""}</div><div class="meta">${roleLabel(p.role)} · ${vehicleLabel(p.model || "default")}${id === meta.hostId ? " · Host" : ""}</div></div><span class="ready-pill">${p.ready ? "READY" : "NOT READY"}</span></div>`;
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
  if (running) {
    if (ui.accountCard) ui.accountCard.classList.add("hidden");
    if (ui.leaderboardCard) ui.leaderboardCard.classList.add("hidden");
  }
  ui.hud.classList.toggle("hidden", !running);
  ui.leaveGame.classList.toggle("hidden", !running);
  const isHostPlayer = running && (isSinglePlayer || currentMeta?.hostId === activePlayerId());
  if (ui.pauseGame) {
    ui.pauseGame.classList.toggle("hidden", !isHostPlayer);
    ui.pauseGame.textContent = currentMeta?.paused ? "Resume" : "Pause";
  }
  if (ui.pauseOverlay) ui.pauseOverlay.classList.toggle("hidden", !running || !currentMeta?.paused);
  if (running && !chatOpenPreferenceSet && !isPhonePortrait()) chatOpen = true;
  if (ui.toggleChat) {
    ui.toggleChat.classList.toggle("hidden", !running);
    ui.toggleChat.textContent = chatOpen ? "Hide Chat" : "Chat";
    ui.toggleChat.setAttribute("aria-expanded", chatOpen ? "true" : "false");
  }
  if (ui.chatPanel) ui.chatPanel.classList.toggle("hidden", !running || !chatOpen);
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
  applyRenderPerformanceMode();
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
    if (currentMeta.paused) {
      latestState = hostSim?.state ? compactState(hostSim.state) : latestState;
      return;
    }
    acc += dt;
    let shouldWrite = false;
    let steps = 0;
    const maxSteps = isPhonePortrait() ? 5 : 8;
    while (acc >= fixed && steps < maxSteps) {
      hostSim.syncMeta(currentMeta, currentPlayers);
      const localId = activePlayerId();
      if (isSinglePlayer && localId) latestInputs = { [localId]: localInput() };
      hostSim.setInputs(latestInputs);
      shouldWrite = hostSim.step(fixed, currentPlayers) || shouldWrite;
      acc -= fixed;
      steps++;
    }
    if (steps >= maxSteps) acc = Math.min(acc, fixed);
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
  lobbyCode = null; currentLobby = null; currentMeta = null; currentPlayers = {}; currentChat = {}; latestState = null; latestInputs = {};
  ui.lobby.classList.remove("solo");
  document.body.classList.remove("game-running");
  ui.setup.classList.remove("hidden");
  if (ui.accountCard) ui.accountCard.classList.add("hidden");
  if (ui.leaderboardCard) ui.leaderboardCard.classList.add("hidden");
  ui.lobby.classList.add("hidden");
  ui.hud.classList.add("hidden");
  ui.leaveGame.classList.add("hidden");
  if (ui.pauseGame) ui.pauseGame.classList.add("hidden");
  if (ui.pauseOverlay) ui.pauseOverlay.classList.add("hidden");
  if (ui.chatPanel) ui.chatPanel.classList.add("hidden");
  if (ui.toggleChat) ui.toggleChat.classList.add("hidden");
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
  if (!lobbyCode || !uid || !db || !currentMeta || currentMeta.status !== "running" || currentMeta.paused) return;
  const inp = localInput();
  await set(lobbyRef(lobbyCode, `inputs/${uid}`), { ...inp, t: Date.now() }).catch(() => {});
}


function setChatOpen(open, persist = true) {
  chatOpen = !!open;
  if (persist) {
    chatOpenPreferenceSet = true;
    localStorage.setItem("rlcss_chat_open", chatOpen ? "1" : "0");
  }
  updateGameVisibility();
  renderChat();
  if (chatOpen && ui.chatInput && !isPhonePortrait()) ui.chatInput.focus();
}

function toggleChatOpen() {
  setChatOpen(!chatOpen);
}

function canLocalHostControl() {
  return !!currentMeta && (isSinglePlayer || currentMeta.hostId === activePlayerId());
}

async function togglePause() {
  if (!currentMeta || currentMeta.status !== "running" || !canLocalHostControl()) return;
  const nextPaused = !currentMeta.paused;
  SFX.ui(nextPaused ? 360 : 720);
  if (isSinglePlayer) {
    currentMeta = serialiseMeta({ ...currentMeta, paused: nextPaused, pausedBy: nextPaused ? activePlayerId() : null, updatedAt: Date.now() });
    currentLobby = { ...(currentLobby || {}), meta: currentMeta, players: currentPlayers, state: latestState, chat: currentChat };
    updateGameVisibility();
    renderChat();
    return;
  }
  await update(lobbyRef(lobbyCode, "meta"), { paused: nextPaused, pausedBy: nextPaused ? activePlayerId() : null, updatedAt: serverTimestamp() });
}

function cleanChatText(text) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, 140);
}

function visibleChatMessages() {
  const local = currentPlayers?.[activePlayerId()] || {};
  const localTeam = local.team || "blue";
  const scope = currentMeta?.chatScope || "all";
  return Object.entries(currentChat || {})
    .map(([id, msg]) => ({ id, ...(msg || {}) }))
    .filter(msg => {
      const channel = msg.channel === "team" ? "team" : "game";
      const team = msg.team === "orange" ? "orange" : "blue";
      if (channel === "team") return team === localTeam;
      if (scope === "team") return team === localTeam;
      return true;
    })
    .sort((a, b) => Number(a.clientTime || a.createdAt || 0) - Number(b.clientTime || b.createdAt || 0))
    .slice(-50);
}

function renderChat() {
  if (!ui.chatPanel || !ui.chatMessages) return;
  ui.chatPanel.classList.toggle("chat-muted", chatMuted);
  if (ui.chatMute) ui.chatMute.textContent = chatMuted ? "Unmute" : "Mute";
  if (ui.chatGameTab) ui.chatGameTab.classList.toggle("active", chatChannel === "game");
  if (ui.chatTeamTab) ui.chatTeamTab.classList.toggle("active", chatChannel === "team");
  if (ui.chatInput) ui.chatInput.placeholder = chatChannel === "team" ? "Team message…" : ((currentMeta?.chatScope || "all") === "team" ? "Game message to your team…" : "Game message…");
  const messages = visibleChatMessages();
  const localTeam = currentPlayers?.[activePlayerId()]?.team || "blue";
  const key = `${chatMuted}:${chatChannel}:${currentMeta?.chatScope || "all"}:${localTeam}:${messages.map(m => `${m.id}:${m.text}`).join("|")}`;
  if (key === chatRenderKey) return;
  chatRenderKey = key;
  ui.chatMessages.innerHTML = messages.map(msg => {
    const team = msg.team === "orange" ? "orange" : "blue";
    const channel = msg.channel === "team" ? "TEAM" : "GAME";
    const name = escapeHtml(msg.name || "Player");
    const text = escapeHtml(msg.text || "");
    return `<div class="chat-message ${team}"><div class="chat-meta"><span>${name}</span><span>${channel}</span></div><div class="chat-text">${text}</div></div>`;
  }).join("");
  ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;
}

async function sendChatMessage(text) {
  const clean = cleanChatText(text);
  if (!clean || !currentMeta || !lobbyCode) return;
  const localId = activePlayerId();
  const local = currentPlayers?.[localId] || {};
  const payload = {
    from: localId,
    name: sanitizeName(local.name || playerName || ui.name?.value),
    team: local.team === "orange" ? "orange" : "blue",
    channel: chatChannel === "team" ? "team" : "game",
    text: clean,
    clientTime: Date.now()
  };
  if (isSinglePlayer || !db || !uid) {
    const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    currentChat = { ...(currentChat || {}), [id]: payload };
    renderChat();
    return;
  }
  const msgRef = push(lobbyRef(lobbyCode, "chat"));
  await set(msgRef, { ...payload, createdAt: serverTimestamp() });
}

function safeUi(handler, label) {
  return event => {
    SFX.resume();
    try {
      const result = handler(event);
      if (result && typeof result.catch === "function") {
        result.catch(err => {
          console.error(label, err);
          const msg = err?.code === "auth/email-already-in-use" ? "That username already exists." : (err.message || err);
          if (label.toLowerCase().includes("account")) setAccountMessage(String(msg));
          else setStatus(`${label} failed: ${msg}`);
        });
      }
    } catch (err) {
      console.error(label, err);
      const msg = err?.code === "auth/email-already-in-use" ? "That username already exists." : (err.message || err);
      if (label.toLowerCase().includes("account")) setAccountMessage(String(msg));
      else setStatus(`${label} failed: ${msg}`);
    }
  };
}

function showMenuPanel(which = "setup") {
  const showAccount = which === "account";
  const showLeaderboard = which === "leaderboard";
  if (ui.setup) ui.setup.classList.toggle("hidden", showAccount || showLeaderboard || !!lobbyCode);
  if (ui.accountCard) ui.accountCard.classList.toggle("hidden", !showAccount);
  if (ui.leaderboardCard) ui.leaderboardCard.classList.toggle("hidden", !showLeaderboard);
  if (showLeaderboard) {
    if (!leaderboardLoaded && ui.leaderboardList) ui.leaderboardList.textContent = firebaseReady ? "Loading leaderboard…" : "Connect Firebase to load the leaderboard.";
    startLeaderboardListener();
  }
  if (showAccount && ui.accountUsername && !ui.accountUsername.value) ui.accountUsername.value = normalizeUsername(ui.name?.value || accountProfile?.username || "");
  if (showAccount) updateAccountUi();
}

// UI events
ui.single.addEventListener("click", safeUi(startSinglePlayer, "Single player setup"));
ui.create.addEventListener("click", safeUi(createLobby, "Create lobby"));
ui.join.addEventListener("click", safeUi(joinLobby, "Join lobby"));
ui.joinCode.addEventListener("input", () => ui.joinCode.value = ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
if (ui.openAccount) ui.openAccount.addEventListener("click", () => showMenuPanel("account"));
if (ui.closeAccount) ui.closeAccount.addEventListener("click", () => showMenuPanel("setup"));
if (ui.openLeaderboard) ui.openLeaderboard.addEventListener("click", () => showMenuPanel("leaderboard"));
if (ui.closeLeaderboard) ui.closeLeaderboard.addEventListener("click", () => showMenuPanel("setup"));
if (ui.createAccount) ui.createAccount.addEventListener("click", safeUi(createAccount, "Create account"));
if (ui.signInAccount) ui.signInAccount.addEventListener("click", safeUi(signInAccount, "Sign in account"));
if (ui.signOutAccount) ui.signOutAccount.addEventListener("click", safeUi(signOutAccount, "Sign out account"));
if (ui.accountUsername) ui.accountUsername.addEventListener("input", () => { ui.accountUsername.value = normalizeUsername(ui.accountUsername.value); });
ui.copy.addEventListener("click", () => { if (!isSinglePlayer) navigator.clipboard?.writeText(lobbyCode || ""); });
ui.leaveLobby.addEventListener("click", safeUi(() => leaveToMenu("Left lobby."), "Leave lobby"));
ui.leaveGame.addEventListener("click", safeUi(() => leaveToMenu("Left match."), "Leave match"));
if (ui.pauseGame) ui.pauseGame.addEventListener("click", safeUi(togglePause, "Toggle pause"));
if (ui.toggleChat) ui.toggleChat.addEventListener("click", safeUi(toggleChatOpen, "Toggle chat"));
ui.ready.addEventListener("click", () => {
  if (isSinglePlayer) startSoloMatch();
  else updateLocalPlayer({ ready: !(currentPlayers[activePlayerId()]?.ready) });
});
ui.team.addEventListener("change", () => updateLocalPlayer({ team: ui.team.value, ready: false }));
ui.role.addEventListener("change", () => updateLocalPlayer({ role: ui.role.value, ready: false }));
if (ui.vehicle) ui.vehicle.addEventListener("change", () => { updateVehiclePreview(true); updateLocalPlayer({ model: ui.vehicle.value, ready: false }); });
ui.mode.addEventListener("change", () => updateMetaPatch({ mode: ui.mode.value }));
if (ui.theme) ui.theme.addEventListener("change", () => updateMetaPatch({ theme: ui.theme.value }));
ui.teamSize.addEventListener("change", () => updateMetaPatch({ teamSize: Number(ui.teamSize.value) }));
ui.difficulty.addEventListener("change", () => updateMetaPatch({ difficulty: ui.difficulty.value }));
ui.playstyle.addEventListener("change", () => updateMetaPatch({ playstyle: ui.playstyle.value }));
if (ui.chatScope) ui.chatScope.addEventListener("change", () => updateMetaPatch({ chatScope: ui.chatScope.value }));
if (ui.chatForm) ui.chatForm.addEventListener("submit", safeUi(async e => {
  e.preventDefault();
  const text = ui.chatInput?.value || "";
  if (ui.chatInput) ui.chatInput.value = "";
  await sendChatMessage(text);
}, "Send chat"));
if (ui.chatMute) ui.chatMute.addEventListener("click", () => {
  chatMuted = !chatMuted;
  localStorage.setItem("rlcss_chat_muted", chatMuted ? "1" : "0");
  renderChat();
});
document.querySelectorAll("[data-chat-channel]").forEach(btn => btn.addEventListener("click", () => {
  chatChannel = btn.dataset.chatChannel === "team" ? "team" : "game";
  localStorage.setItem("rlcss_chat_channel", chatChannel);
  renderChat();
  ui.chatInput?.focus();
}));

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
  const tag = (e.target?.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  SFX.resume();
  if (e.code === "KeyP") {
    togglePause();
    return;
  }
  if (e.code === "KeyT") {
    toggleChatOpen();
    return;
  }
  if (e.code === "Enter" && currentMeta?.status === "running") {
    if (!chatOpen) setChatOpen(true);
    ui.chatInput?.focus();
    return;
  }
  keys[e.code] = true;
  if (e.code === bindings.cam && !camKeyLatch) {
    camKeyLatch = true;
    localBallCam = !localBallCam;
    localStorage.setItem("rlcss_ball_cam", localBallCam ? "1" : "0");
    if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
    SFX.ui(localBallCam ? 860 : 520);
  }
});
window.addEventListener("keyup", e => {
  const tag = (e.target?.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  keys[e.code] = false;
  if (e.code === bindings.cam) camKeyLatch = false;
});
["pointerdown", "touchstart", "click"].forEach(type => window.addEventListener(type, () => SFX.resume(), { passive: true }));

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

  const actionPad = ui.mobileActionPad;
  const actionZones = actionPad ? Array.from(actionPad.querySelectorAll("[data-action]")) : Array.from(document.querySelectorAll(".touch-btn[data-action]"));
  let actionPointerId = null;
  let activeAction = null;

  function zoneForPoint(clientX, clientY) {
    for (const el of actionZones) {
      const r = el.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return el;
    }
    return null;
  }

  function pulseMobileAction(action, ms = 82) {
    if (!(action in mobileInput)) return;
    mobileInput[action] = true;
    window.setTimeout(() => { mobileInput[action] = false; }, ms);
  }

  function toggleBallCamFromTouch() {
    localBallCam = !localBallCam;
    localStorage.setItem("rlcss_ball_cam", localBallCam ? "1" : "0");
    if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
    SFX.ui(localBallCam ? 860 : 520);
  }

  document.querySelectorAll("[data-mobile-tap]").forEach(btn => {
    if (btn.dataset.boundMobileTap === "1") return;
    btn.dataset.boundMobileTap = "1";
    const action = btn.dataset.mobileTap;
    const trigger = e => {
      e.preventDefault();
      btn.classList.add("active");
      if (action === "cam") toggleBallCamFromTouch();
      else if (action === "reset") pulseMobileAction("reset", 95);
    };
    const release = () => btn.classList.remove("active");
    btn.addEventListener("pointerdown", trigger);
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointercancel", release);
    btn.addEventListener("pointerleave", release);
  });

  function clearHeldAction() {
    mobileInput.boost = false;
    mobileInput.drift = false;
    activeAction = null;
    actionZones.forEach(el => el.classList.remove("active"));
  }

  function setActionFromPoint(clientX, clientY, force = false) {
    const zoneEl = zoneForPoint(clientX, clientY);
    const next = zoneEl?.dataset.action || null;
    if (!force && next === activeAction) return;

    mobileInput.boost = false;
    mobileInput.drift = false;
    actionZones.forEach(el => el.classList.toggle("active", el === zoneEl));
    activeAction = next;

    if (next === "boost") mobileInput.boost = true;
    else if (next === "drift") mobileInput.drift = true;
    else if (next === "jump") pulseMobileAction("jump");
    else if (next === "reset") pulseMobileAction("reset", 95);
    else if (next === "cam") toggleBallCamFromTouch();
  }

  if (actionPad && actionZones.length) {
    actionPad.addEventListener("pointerdown", e => {
      e.preventDefault();
      actionPointerId = e.pointerId;
      actionPad.setPointerCapture(actionPointerId);
      setActionFromPoint(e.clientX, e.clientY, true);
    });
    actionPad.addEventListener("pointermove", e => {
      if (e.pointerId === actionPointerId) setActionFromPoint(e.clientX, e.clientY);
    });
    const endAction = e => {
      if (e.pointerId !== actionPointerId) return;
      clearHeldAction();
      actionPointerId = null;
    };
    actionPad.addEventListener("pointerup", endAction);
    actionPad.addEventListener("pointercancel", endAction);
  } else {
    // Fallback for older markup: still allow sliding over the existing separate buttons.
    actionZones.forEach(btn => {
      const action = btn.dataset.action;
      btn.addEventListener("pointerdown", e => {
        e.preventDefault();
        actionPointerId = e.pointerId;
        btn.setPointerCapture(actionPointerId);
        setActionFromPoint(e.clientX, e.clientY, true);
      });
      btn.addEventListener("pointermove", e => { if (e.pointerId === actionPointerId) setActionFromPoint(e.clientX, e.clientY); });
      const up = e => { if (e.pointerId === actionPointerId) { clearHeldAction(); actionPointerId = null; } };
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
    });
  }
}

// Three.js renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070912);
scene.fog = new THREE.FogExp2(0x070912, 0.0038);
const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1200);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(desiredPixelRatio());
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const ambient = new THREE.AmbientLight(0xffffff, 0.58);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(40, 75, 35);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

function desiredPixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  // V24 phone crispness: V23's 1.15 cap looked blocky on modern phones.
  // Keep desktop fully crisp, and give phones a sharper buffer while still
  // avoiding the 2x/3x DPR cost that caused earlier mobile stutter.
  return isPhonePortrait() ? Math.min(Math.max(dpr, 1.35), 1.65) : Math.min(dpr, 1.45);
}

function applyRenderPerformanceMode() {
  const mobile = isPhonePortrait();
  renderer.setPixelRatio(desiredPixelRatio());
  renderer.shadowMap.enabled = !mobile;
  sun.castShadow = !mobile;
  document.body.classList.toggle("mobile-performance", mobile);
}

const world = new THREE.Group();
scene.add(world);
let arenaSignature = "";
let ballMesh = null;
const carMeshes = new Map();
const boostPadMeshes = new Map();
const nameSprites = new Map();

let lastRenderSize = { w: 0, h: 0, dpr: 0, mobile: null };
function resizeRenderer(force = false) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = desiredPixelRatio();
  const mobile = isPhonePortrait();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  if (!force && lastRenderSize.w === w && lastRenderSize.h === h && lastRenderSize.dpr === dpr && lastRenderSize.mobile === mobile) return;
  lastRenderSize = { w, h, dpr, mobile };
  applyRenderPerformanceMode();
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(1, h);
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resizeRenderer);
resizeRenderer(true);

function themeForState(state) {
  return STADIUM_THEMES[state?.theme] || STADIUM_THEMES.v10;
}

function modeFieldColor(mode, theme) {
  if (mode === "ice") return theme.iceField || [185, 230, 255];
  if (mode === "snooker") return theme.snookerField || [16, 92, 50];
  if (mode === "flying") return theme.flyingField || [34, 40, 72];
  return theme.field || [30, 84, 54];
}

function applySceneTheme(theme) {
  scene.background = new THREE.Color(theme.background ?? 0x070912);
  scene.fog = new THREE.FogExp2(theme.fog ?? theme.background ?? 0x070912, theme.fogDensity ?? 0.0065);
  ambient.color.setHex(theme.ambient ?? 0xffffff);
  ambient.intensity = theme.ambientIntensity ?? 0.5;
  sun.color.setHex(theme.sun ?? 0xffffff);
  sun.intensity = theme.sunIntensity ?? 0.95;
  const pos = theme.sunPosition || [40, 75, 35];
  sun.position.set(pos[0], pos[1], pos[2]);
}

function makeFieldTexture(mode, arena, theme) {
  const cnv = document.createElement("canvas");
  const texSize = isPhonePortrait() ? 1024 : 1024;
  cnv.width = texSize; cnv.height = texSize;
  const ctx = cnv.getContext("2d");
  const base = modeFieldColor(mode, theme);
  ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
  ctx.fillRect(0, 0, texSize, texSize);

  const cssHex = value => `#${(Number(value ?? 0xffffff) >>> 0).toString(16).padStart(6, "0").slice(-6)}`;
  const glowA = cssHex(theme.fieldGlowA ?? theme.accentA ?? 0x16c7ff);
  const glowB = cssHex(theme.fieldGlowB ?? theme.accentB ?? 0xff9a2b);
  const identityAlpha = theme.style === "classic" ? 0.045 : 0.115;
  ctx.globalAlpha = identityAlpha;
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, texSize, texSize * 0.075);
  ctx.fillRect(0, texSize * 0.46, texSize, texSize * 0.035);
  ctx.fillStyle = glowB;
  ctx.fillRect(0, texSize * 0.925, texSize, texSize * 0.075);
  ctx.save();
  ctx.translate(texSize * 0.5, texSize * 0.5);
  ctx.rotate(-Math.PI * 0.08);
  ctx.fillStyle = theme.style === "neon" ? glowB : glowA;
  ctx.fillRect(-texSize * 0.55, -texSize * 0.025, texSize * 1.1, texSize * 0.05);
  ctx.restore();
  ctx.globalAlpha = 1;

  for (let i = 0; i < 18; i++) {
    const alpha = i % 2 ? (theme.stripeAlpha ?? 0.045) : Math.max(0.018, (theme.stripeAlpha ?? 0.045) * 0.45);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(0, i * (texSize / 17), texSize, Math.max(12, texSize / 34));
  }
  if (mode === "ice") {
    ctx.strokeStyle = "rgba(255,255,255,0.78)";
  } else {
    ctx.strokeStyle = `rgba(255,255,255,${theme.lineAlpha ?? 0.56})`;
  }
  ctx.lineWidth = 7;
  const m = texSize * 0.066;
  const mid = texSize / 2;
  ctx.strokeRect(m, m, texSize - m * 2, texSize - m * 2);
  ctx.beginPath(); ctx.moveTo(m, mid); ctx.lineTo(texSize - m, mid); ctx.stroke();
  ctx.beginPath(); ctx.arc(mid, mid, texSize * 0.088, 0, Math.PI * 2); ctx.stroke();

  // Subtle deterministic turf/ice grain. This avoids the field looking flat
  // while keeping the selected lobby theme stable for every client.
  let seed = (arena.w * 31 + arena.l * 17 + (base[0] << 8) + base[1]) >>> 0;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  ctx.globalAlpha = mode === "ice" ? 0.12 : 0.18;
  for (let i = 0; i < (isPhonePortrait() ? 1100 : 1200); i++) {
    const x = rand() * texSize, y = rand() * texSize;
    ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(x, y, 1, 1);
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = isPhonePortrait() ? 2 : 4;
  // The canvas already draws a full pitch. Stretch it over the current arena
  // instead of repeating it, so 3v3-5v5 looks like one larger field rather
  // than several mini football pitches tiled together.
  tex.repeat.set(1, 1);
  return tex;
}

function buildArena(state) {
  const theme = themeForState(state);
  const mobilePerf = isPhonePortrait();
  const sig = `${state.mode}:${state.theme || "v10"}:${state.arena.w}:${state.arena.l}:${state.arena.goalW}:${mobilePerf ? "mobile" : "desktop"}`;
  if (sig === arenaSignature) return;
  arenaSignature = sig;
  while (world.children.length) world.remove(world.children[0]);
  ballMesh = null;
  carMeshes.clear();
  boostPadMeshes.clear();
  nameSprites.clear();
  applySceneTheme(theme);

  const arena = state.arena;
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(arena.w, arena.l),
    new THREE.MeshStandardMaterial({ map: makeFieldTexture(state.mode, arena, theme), roughness: state.mode === "ice" ? 0.24 : (arena.floorRoughness ?? 0.74), metalness: state.mode === "ice" ? 0.12 : (arena.floorMetalness ?? 0.03) })
  );
  field.rotation.x = -Math.PI / 2;
  field.receiveShadow = true;
  world.add(field);

  const wallColor = state.mode === "ice" ? 0xa6ddff : (theme.wall ?? 0x1d2438);
  const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, transparent: true, opacity: theme.wallOpacity ?? 0.48, roughness: 0.4 });
  const blueLight = theme.lightBlue ?? 0x12b9ff;
  const orangeLight = theme.lightOrange ?? 0xff8a1f;
  const trimBlue = new THREE.MeshStandardMaterial({ color: blueLight, emissive: blueLight, emissiveIntensity: 0.48, transparent: true, opacity: 0.66, depthWrite: false });
  const trimOrange = new THREE.MeshStandardMaterial({ color: orangeLight, emissive: orangeLight, emissiveIntensity: 0.48, transparent: true, opacity: 0.66, depthWrite: false });
  const lightenHex = (hex, amount = 0.38) => {
    const c = new THREE.Color(hex);
    return c.lerp(new THREE.Color(0xffffff), amount).getHex();
  };
  const goalBlueColor = lightenHex(blueLight, 0.42);
  const goalOrangeColor = lightenHex(orangeLight, 0.34);
  const goalBlue = new THREE.MeshStandardMaterial({ color: goalBlueColor, emissive: blueLight, emissiveIntensity: 0.62, transparent: true, opacity: 0.30, depthWrite: false });
  const goalOrange = new THREE.MeshStandardMaterial({ color: goalOrangeColor, emissive: orangeLight, emissiveIntensity: 0.62, transparent: true, opacity: 0.30, depthWrite: false });
  const neutralTrim = new THREE.MeshStandardMaterial({ color: theme.trim ?? 0xffffff, emissive: blueLight, emissiveIntensity: 0.16 });

  function box(w, h, d, x, y, z, mat = wallMat) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    // V28 performance: arena boxes receive shadows, but do not cast.
    // Cars/ball keep shadows; hundreds of static box shadow-casters were the main PC cost.
    m.castShadow = false; m.receiveShadow = true;
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

  function addExteriorProps() {
    const propShadow = false;
    const trim = theme.trim ?? 0xffffff;
    const blueLight = theme.lightBlue ?? 0x12b9ff;
    const orangeLight = theme.lightOrange ?? 0xff8a1f;
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x263247, roughness: 0.58, metalness: 0.18 });
    const darkMat = new THREE.MeshStandardMaterial({ color: theme.stands ?? 0x111827, roughness: 0.86 });
    const glowBlue = new THREE.MeshStandardMaterial({ color: blueLight, emissive: blueLight, emissiveIntensity: 0.55, roughness: 0.34 });
    const glowOrange = new THREE.MeshStandardMaterial({ color: orangeLight, emissive: orangeLight, emissiveIntensity: 0.55, roughness: 0.34 });
    const adWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0x111827, emissiveIntensity: 0.08, roughness: 0.42 });

    function propBox(w, h, d, x, y, z, mat, rotY = 0) {
      const m = box(w, h, d, x, y, z, mat);
      m.rotation.y = rotY;
      m.castShadow = propShadow;
      m.receiveShadow = propShadow;
      return m;
    }
    function cyl(r, h, x, y, z, mat, seg = mobilePerf ? 8 : 12) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
      m.position.set(x, y, z);
      m.castShadow = propShadow;
      m.receiveShadow = propShadow;
      world.add(m);
      return m;
    }

    const adCount = mobilePerf ? 6 : 8;
    for (const side of [-1, 1]) {
      for (let i = 0; i < adCount; i++) {
        const x = -arena.w / 2 + (i + 0.5) * (arena.w / adCount);
        const mat = i % 3 === 0 ? glowBlue : i % 3 === 1 ? glowOrange : adWhite;
        propBox(Math.max(4.6, arena.w / adCount - 1.2), 1.35, 0.28, x, 1.0, side * (arena.l / 2 + 2.2), mat);
      }
    }
    const endCount = mobilePerf ? 3 : 4;
    for (const side of [-1, 1]) {
      for (let i = 0; i < endCount; i++) {
        const x = (i - (endCount - 1) / 2) * (arena.goalW / Math.max(1, endCount - 1));
        const mat = side < 0 ? glowBlue : glowOrange;
        propBox(4.2, 1.25, 0.28, x, 1.0, side * (arena.l / 2 + arena.goalD + 1.4), mat);
      }
    }

    // Goal-end stands and entry tunnels make the arena feel enclosed without affecting collisions.
    for (const side of [-1, 1]) {
      propBox((arena.w - arena.goalW) * 0.46, 3.0, 8.0, -arena.w * 0.34, 2.1, side * (arena.l / 2 + arena.goalD + 6), darkMat);
      propBox((arena.w - arena.goalW) * 0.46, 3.0, 8.0,  arena.w * 0.34, 2.1, side * (arena.l / 2 + arena.goalD + 6), darkMat);
      propBox(arena.goalW * 0.62, 3.2, 5.2, 0, 2.2, side * (arena.l / 2 + arena.goalD + 7.5), steelMat);
      propBox(arena.goalW * 0.45, 2.0, 0.42, 0, 3.15, side * (arena.l / 2 + arena.goalD + 4.8), side < 0 ? glowBlue : glowOrange);
    }

    const cornerXs = [-arena.w / 2 - 16, arena.w / 2 + 16];
    const cornerZs = [-arena.l / 2 - 16, arena.l / 2 + 16];
    for (const x of cornerXs) {
      for (const z of cornerZs) {
        cyl(0.38, 19, x, 9.5, z, steelMat, mobilePerf ? 8 : 14);
        const bank = propBox(5.8, 1.1, 1.0, x, 19.4, z, adWhite, Math.atan2(-x, -z));
        bank.castShadow = false;
        // V28 performance: decorative point lights are expensive on desktop GPUs;
        // the emissive lamp meshes keep the same look at a fraction of the cost.
      }
    }

    // Roof trusses / flags along the long sides. Very low geometry, high stadium payoff.
    const trussCount = mobilePerf ? 4 : 5;
    for (const side of [-1, 1]) {
      for (let i = 0; i < trussCount; i++) {
        const x = -arena.w / 2 + (i + 0.5) * (arena.w / trussCount);
        propBox(0.45, 0.45, 11.5, x, 16.2, side * (arena.l / 2 + 18), steelMat);
        if (!mobilePerf || i % 2 === 0) {
          const flagMat = new THREE.MeshBasicMaterial({ color: i % 2 ? orangeLight : blueLight, side: THREE.DoubleSide });
          const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.1), flagMat);
          flag.position.set(x + 0.7, 18.0, side * (arena.l / 2 + 19.4));
          flag.rotation.y = side < 0 ? 0 : Math.PI;
          world.add(flag);
        }
      }
    }

    // V24: more deliberate outside-stadium level dressing. These are all
    // non-colliding, low-poly static props, so they improve arena atmosphere
    // without changing the pitch or gameplay.
    const concourseMat = new THREE.MeshStandardMaterial({ color: 0x121826, roughness: 0.88, metalness: 0.02 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x10233b, emissive: blueLight, emissiveIntensity: mobilePerf ? 0.07 : 0.14, roughness: 0.28, metalness: 0.18, transparent: true, opacity: 0.78 });
    const warmGlassMat = new THREE.MeshStandardMaterial({ color: 0x2b1a12, emissive: orangeLight, emissiveIntensity: mobilePerf ? 0.06 : 0.13, roughness: 0.32, metalness: 0.12, transparent: true, opacity: 0.76 });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x080b12, roughness: 0.92 });
    const bannerMat = new THREE.MeshBasicMaterial({ color: trim, transparent: true, opacity: 0.76, side: THREE.DoubleSide });

    // Outer apron/roads make the arena read as part of a bigger venue.
    propBox(arena.w + 42, 0.12, 4.6, 0, 0.08, -arena.l / 2 - 25.5, roadMat);
    propBox(arena.w + 42, 0.12, 4.6, 0, 0.08,  arena.l / 2 + 25.5, roadMat);
    propBox(4.6, 0.12, arena.l + 42, -arena.w / 2 - 25.5, 0.08, 0, roadMat);
    propBox(4.6, 0.12, arena.l + 42,  arena.w / 2 + 25.5, 0.08, 0, roadMat);

    // Side concourse blocks and glass suites behind the stands.
    const suiteCount = mobilePerf ? 4 : 5;
    for (const side of [-1, 1]) {
      propBox(arena.w + 32, 1.2, 7.0, 0, 0.7, side * (arena.l / 2 + 26.5), concourseMat);
      for (let i = 0; i < suiteCount; i++) {
        const x = -arena.w / 2 + (i + 0.5) * (arena.w / suiteCount);
        const suiteMat = i % 2 ? glassMat : warmGlassMat;
        propBox(Math.max(5.0, arena.w / suiteCount - 1.1), 3.0, 1.0, x, 7.9, side * (arena.l / 2 + 24.0), suiteMat);
        if (!mobilePerf || i % 2 === 0) {
          propBox(Math.max(4.0, arena.w / suiteCount - 2.2), 0.28, 0.46, x, 9.65, side * (arena.l / 2 + 23.35), i % 2 ? glowBlue : glowOrange);
        }
      }
    }

    // Exterior corner buildings / stair towers with team-colour accents.
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.76, metalness: 0.04 });
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const x = sx * (arena.w / 2 + 30.5);
        const z = sz * (arena.l / 2 + 30.5);
        propBox(6.4, 8.5, 6.4, x, 4.3, z, towerMat, Math.PI * 0.25);
        propBox(5.0, 0.42, 5.0, x, 8.85, z, sz < 0 ? glowBlue : glowOrange, Math.PI * 0.25);
        if (!mobilePerf) {
          propBox(3.2, 3.4, 0.26, x, 5.0, z - sz * 3.32, glassMat);
          propBox(0.26, 3.4, 3.2, x - sx * 3.32, 5.0, z, warmGlassMat);
        }
      }
    }

    // Sponsor totems / wayfinding signs visible on phones too.
    const signCount = mobilePerf ? 4 : 6;
    for (let i = 0; i < signCount; i++) {
      const side = i % 2 ? 1 : -1;
      const t = signCount === 1 ? 0.5 : i / (signCount - 1);
      const z = -arena.l / 2 + t * arena.l;
      const x = side * (arena.w / 2 + 10.2);
      propBox(0.45, 3.4, 0.45, x, 1.9, z, steelMat);
      propBox(0.55, 1.9, 3.8, x, 3.25, z, i % 3 === 0 ? glowBlue : i % 3 === 1 ? glowOrange : adWhite);
    }

    // Hanging banners across the end approaches; flat planes are cheap and add depth.
    const bannerCount = mobilePerf ? 3 : 4;
    for (const side of [-1, 1]) {
      for (let i = 0; i < bannerCount; i++) {
        const x = (i - (bannerCount - 1) / 2) * (arena.w / Math.max(1, bannerCount));
        const banner = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.25), bannerMat.clone());
        banner.material.color.setHex(i % 2 ? orangeLight : blueLight);
        banner.position.set(x, 13.6 + (i % 2) * 0.7, side * (arena.l / 2 + 17.8));
        banner.rotation.y = side < 0 ? 0 : Math.PI;
        world.add(banner);
      }
    }

    // Small parked display cars outside the side roads on desktop; very sparse on phone.
    const parkedCount = mobilePerf ? 2 : 4;
    const parkedMatA = new THREE.MeshStandardMaterial({ color: blueLight, roughness: 0.42, metalness: 0.16, emissive: blueLight, emissiveIntensity: 0.08 });
    const parkedMatB = new THREE.MeshStandardMaterial({ color: orangeLight, roughness: 0.42, metalness: 0.16, emissive: orangeLight, emissiveIntensity: 0.08 });
    for (let i = 0; i < parkedCount; i++) {
      const side = i % 2 ? 1 : -1;
      const z = -arena.l * 0.36 + i * (arena.l * 0.72 / Math.max(1, parkedCount - 1));
      const x = side * (arena.w / 2 + 34.5);
      propBox(2.4, 0.62, 4.0, x, 0.48, z, i % 2 ? parkedMatA : parkedMatB, side * Math.PI * 0.5);
      propBox(1.55, 0.52, 1.25, x, 1.02, z - side * 0.12, darkMat, side * Math.PI * 0.5);
    }

    // V25: make each stadium theme read as a genuinely different arena,
    // not just the same props with a tint. These are decorative only.
    function addThemeIdentityProps() {
      const style = theme.style || "classic";
      const accentA = theme.accentA ?? blueLight;
      const accentB = theme.accentB ?? orangeLight;
      const accentC = theme.accentC ?? trim;
      const brightA = new THREE.MeshStandardMaterial({ color: accentA, emissive: accentA, emissiveIntensity: mobilePerf ? 0.42 : 0.78, roughness: 0.28, metalness: 0.12 });
      const brightB = new THREE.MeshStandardMaterial({ color: accentB, emissive: accentB, emissiveIntensity: mobilePerf ? 0.42 : 0.78, roughness: 0.28, metalness: 0.12 });
      const brightC = new THREE.MeshStandardMaterial({ color: accentC, emissive: accentC, emissiveIntensity: mobilePerf ? 0.28 : 0.58, roughness: 0.34, metalness: 0.08 });
      const flatA = new THREE.MeshBasicMaterial({ color: accentA, transparent: true, opacity: 0.84, side: THREE.DoubleSide });
      const flatB = new THREE.MeshBasicMaterial({ color: accentB, transparent: true, opacity: 0.84, side: THREE.DoubleSide });
      const count = mobilePerf ? 3 : 4;

      if (style === "neon") {
        const ringGeom = new THREE.TorusGeometry(3.0, 0.16, mobilePerf ? 8 : 12, mobilePerf ? 20 : 36);
        for (const side of [-1, 1]) {
          for (let i = 0; i < count; i++) {
            const x = -arena.w / 2 + (i + 0.5) * (arena.w / count);
            const ring = new THREE.Mesh(ringGeom, i % 2 ? brightA : brightB);
            ring.position.set(x, 9.2 + (i % 2) * 1.2, side * (arena.l / 2 + 14.3));
            ring.rotation.x = Math.PI * 0.5;
            ring.scale.set(1.0, 0.72, 1.0);
            ring.castShadow = false;
            world.add(ring);
            propBox(0.22, 0.22, 7.0, x, 4.2, side * (arena.l / 2 + 4.8), i % 2 ? brightB : brightA);
          }
        }
        if (!mobilePerf) {
          for (const x of [-arena.w / 2 - 7, arena.w / 2 + 7]) {
            propBox(0.32, 0.32, arena.l * 0.82, x, 2.4, 0, brightA);
            propBox(0.32, 0.32, arena.l * 0.82, x + Math.sign(x) * 1.5, 3.2, 0, brightB);
          }
        }
      } else if (style === "sunset") {
        const palmMat = new THREE.MeshStandardMaterial({ color: 0x6b3517, roughness: 0.78 });
        const leafMat = new THREE.MeshBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
        for (const side of [-1, 1]) {
          for (let i = 0; i < count; i++) {
            const x = -arena.w / 2 + (i + 0.5) * (arena.w / count);
            cyl(0.24, 6.4, x, 3.2, side * (arena.l / 2 + 31.5), palmMat, 7);
            for (let k = 0; k < 4; k++) {
              const leaf = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.62), leafMat.clone());
              leaf.material.color.setHex(k % 2 ? accentB : accentC);
              leaf.position.set(x, 6.7, side * (arena.l / 2 + 31.5));
              leaf.rotation.y = k * Math.PI * 0.5;
              leaf.rotation.z = 0.28;
              world.add(leaf);
            }
            propBox(5.2, 0.5, 0.46, x, 11.4, side * (arena.l / 2 + 18.5), i % 2 ? brightB : brightC);
          }
        }
        propBox(arena.w * 0.72, 0.46, 0.7, 0, 18.6, -arena.l / 2 - 19.8, brightB);
        propBox(arena.w * 0.72, 0.46, 0.7, 0, 18.6, arena.l / 2 + 19.8, brightC);
      } else if (style === "storm") {
        const cloudMat = new THREE.MeshStandardMaterial({ color: 0x102c45, emissive: 0x0ea5e9, emissiveIntensity: mobilePerf ? 0.10 : 0.18, transparent: true, opacity: 0.84, roughness: 0.62 });
        for (const side of [-1, 1]) {
          for (let i = 0; i < count; i++) {
            const x = -arena.w / 2 + (i + 0.5) * (arena.w / count);
            propBox(7.2, 0.7, 2.4, x, 20.5 + (i % 2) * 1.1, side * (arena.l / 2 + 16.8), cloudMat);
            propBox(0.38, 5.8, 0.38, x, 15.5, side * (arena.l / 2 + 15.8), i % 2 ? brightA : brightC);
            const pts = [
              new THREE.Vector3(x - 0.8, 19.7, side * (arena.l / 2 + 15.2)),
              new THREE.Vector3(x + 0.35, 17.7, side * (arena.l / 2 + 15.2)),
              new THREE.Vector3(x - 0.15, 17.7, side * (arena.l / 2 + 15.2)),
              new THREE.Vector3(x + 0.85, 15.2, side * (arena.l / 2 + 15.2))
            ];
            const bolt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: i % 2 ? accentC : accentA, transparent: true, opacity: 0.82 }));
            world.add(bolt);
          }
        }
      } else {
        for (const side of [-1, 1]) {
          for (let i = 0; i < count; i++) {
            const x = -arena.w / 2 + (i + 0.5) * (arena.w / count);
            const pennant = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.5), (i % 2 ? flatA : flatB).clone());
            pennant.position.set(x, 14.8, side * (arena.l / 2 + 12.7));
            pennant.rotation.y = side < 0 ? 0 : Math.PI;
            world.add(pennant);
          }
        }
      }
    }
    addThemeIdentityProps();

    if (!mobilePerf) {
      const boardMat = new THREE.MeshStandardMaterial({ color: 0x050814, emissive: 0x0ea5e9, emissiveIntensity: 0.26, roughness: 0.32 });
      propBox(15.0, 5.2, 0.7, 0, 15.6, -arena.l / 2 - 22.5, boardMat);
      propBox(5.2, 0.65, 0.9, -5.0, 15.6, -arena.l / 2 - 22.0, glowBlue);
      propBox(5.2, 0.65, 0.9,  5.0, 15.6, -arena.l / 2 - 22.0, glowOrange);
      propBox(12.5, 4.0, 0.7, 0, 13.0, arena.l / 2 + 22.5, boardMat);
      propBox(3.8, 0.52, 0.9, -4.1, 13.0, arena.l / 2 + 22.0, glowBlue);
      propBox(3.8, 0.52, 0.9,  4.1, 13.0, arena.l / 2 + 22.0, glowOrange);
    }
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
  buildGoal(-1, goalBlue);
  buildGoal(1, goalOrange);
  box(arena.w + 2, 0.8, 0.8, 0, 0.45, -arena.l / 2, trimBlue);
  box(arena.w + 2, 0.8, 0.8, 0, 0.45, arena.l / 2, trimOrange);
  box(0.8, 0.8, arena.l + 2, -arena.w / 2, 0.45, 0, neutralTrim);
  box(0.8, 0.8, arena.l + 2, arena.w / 2, 0.45, 0, neutralTrim);

  const standsMat = new THREE.MeshStandardMaterial({ color: theme.stands ?? 0x111827, roughness: 0.9 });
  const crowd = theme.crowd || [0x1f2937, 0x0f172a, 0x243b53];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const stand = box(arena.w + 20 + i * 5, 2.2, 4, 0, 3 + i * 2.2, side * (arena.l / 2 + 10 + i * 3), standsMat);
      stand.rotation.x = side * 0.08;
      if (i > 0) {
        const crowdMat = new THREE.MeshBasicMaterial({ color: crowd[i % crowd.length], transparent: true, opacity: 0.36 });
        const ribbon = new THREE.Mesh(new THREE.BoxGeometry(arena.w + 14 + i * 5, 0.45, 0.16), crowdMat);
        ribbon.position.set(0, 4.4 + i * 2.2, side * (arena.l / 2 + 7.8 + i * 3));
        world.add(ribbon);
      }
    }
    // V28 performance: emissive end trims replace dynamic point lights.
  }
  // V28 performance: no extra side point lights; ambient + sun + emissive props are cheaper.

  addExteriorProps();

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
  // V28 performance: boost pads glow with emissive meshes instead of one dynamic light per pad.
  const halo = new THREE.Object3D();
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

function carMaterial(team, human, model = "default") {
  const base = team === "blue" ? 0x0a91ff : 0xff6a00;
  const metalness = model === "truck" ? 0.08 : human ? 0.18 : 0.06;
  const roughness = model === "sport" ? 0.28 : human ? 0.35 : 0.55;
  return new THREE.MeshStandardMaterial({ color: base, roughness, metalness });
}

function createWheelMesh(x, z, scale = 1) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34 * scale, 0.34 * scale, 0.42 * scale, 14),
    new THREE.MeshStandardMaterial({ color: 0x07080b, roughness: 0.72, metalness: 0.08 })
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, 0.36 * scale, z);
  wheel.castShadow = true;
  return wheel;
}

function createCarMesh(car, state) {
  const modelKey = VEHICLE_CONFIGS[car.model] ? car.model : "default";
  const vehicle = VEHICLE_CONFIGS[modelKey];
  const g = new THREE.Group();
  g.userData.model = modelKey;
  g.userData.team = car.team;

  const [bodyW, bodyH, bodyD] = vehicle.body || VEHICLE_CONFIGS.default.body;
  const [cabinW, cabinH, cabinD] = vehicle.cabin || VEHICLE_CONFIGS.default.cabin;
  const [cabinX, cabinY, cabinZ] = vehicle.cabinOffset || VEHICLE_CONFIGS.default.cabinOffset;

  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyD), carMaterial(car.team, car.human, modelKey));
  body.position.y = bodyH / 2;
  body.castShadow = true;

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(cabinW, cabinH, cabinD), new THREE.MeshStandardMaterial({ color: 0x10141e, roughness: 0.22, metalness: 0.4 }));
  cabin.position.set(cabinX, cabinY, cabinZ);
  cabin.castShadow = true;

  const accentMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: car.team === "blue" ? 0x0044aa : 0xaa3300, emissiveIntensity: 0.25 });
  const nose = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.45, bodyW * 0.72), 0.30, 0.26), accentMat);
  nose.position.set(0, bodyH * 0.76, bodyD / 2 + 0.10);

  const wheelScale = vehicle.wheelScale || 1;
  const wheelX = bodyW / 2 + 0.04;
  const wheelZ = bodyD * 0.34;
  g.add(
    createWheelMesh(-wheelX, -wheelZ, wheelScale),
    createWheelMesh(wheelX, -wheelZ, wheelScale),
    createWheelMesh(-wheelX, wheelZ, wheelScale),
    createWheelMesh(wheelX, wheelZ, wheelScale)
  );

  if (modelKey === "rally") {
    const rollBar = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.055, 8, 18, Math.PI), new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.36, metalness: 0.5 }));
    rollBar.rotation.z = Math.PI;
    rollBar.position.set(0, 1.44, -0.26);
    g.add(rollBar);
  }

  if (modelKey === "truck") {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.84, 0.30, bodyD * 0.34), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.48, metalness: 0.16 }));
    bed.position.set(0, bodyH + 0.18, -bodyD * 0.22);
    g.add(bed);
  }

  if (modelKey === "muscle") {
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xffffff, emissiveIntensity: 0.12, roughness: 0.30 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.18, 0.055, bodyD * 0.92), stripeMat);
    stripe.position.set(0, bodyH + 0.055, 0);
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.78, 0.12, 0.22), stripeMat);
    spoiler.position.set(0, bodyH + 0.34, -bodyD * 0.48);
    g.add(stripe, spoiler);
  }

  if (modelKey === "van") {
    const rackMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.38, metalness: 0.46 });
    const rackA = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.74, 0.08, 0.12), rackMat);
    const rackB = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.74, 0.08, 0.12), rackMat);
    rackA.position.set(0, cabinY + cabinH * 0.58, -bodyD * 0.16);
    rackB.position.set(0, cabinY + cabinH * 0.58, bodyD * 0.18);
    const rearPanel = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.72, bodyH * 0.42, 0.08), new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.45, metalness: 0.12 }));
    rearPanel.position.set(0, bodyH * 0.78, -bodyD * 0.51);
    g.add(rackA, rackB, rearPanel);
  }

  const flameGeo = new THREE.ConeGeometry(0.58, 2.2, 14).rotateX(-Math.PI / 2);
  const flame = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({ color: 0xff8a00, transparent: true, opacity: 0.88 }));
  flame.position.set(0, Math.max(0.44, bodyH * 0.52), -bodyD / 2 - 0.58);
  flame.visible = false;
  g.userData.flame = flame;
  g.add(body, cabin, nose, flame);

  if (state.mode === "snooker") {
    const cueMat = new THREE.MeshStandardMaterial({ color: 0xd8b47a, roughness: 0.4 });
    const cue = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.19, 4.6, 12), cueMat);
    cue.rotation.x = Math.PI / 2;
    cue.position.set(0, 0.7, bodyD / 2 + 1.20);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf7f0da, emissive: 0x665522, emissiveIntensity: 0.1 }));
    tip.position.set(0, 0.7, bodyD / 2 + 3.47);
    g.add(cue, tip);
  }
  world.add(g);
  carMeshes.set(car.id, g);
  return g;
}

let previewRenderer = null;
let previewScene = null;
let previewCamera = null;
let previewVehicle = null;
let previewVehicleModel = "";

function initVehiclePreview() {
  if (!ui.vehiclePreview || previewRenderer) return;
  previewScene = new THREE.Scene();
  previewCamera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  previewCamera.position.set(0, 2.4, 7.4);
  previewCamera.lookAt(0, 0.85, 0);
  previewRenderer = new THREE.WebGLRenderer({ canvas: ui.vehiclePreview, antialias: true, alpha: true, powerPreference: "low-power" });
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhonePortrait() ? 1.45 : 1.6));
  previewRenderer.shadowMap.enabled = false;
  previewScene.add(new THREE.AmbientLight(0xffffff, 0.78));
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(4, 6, 6);
  previewScene.add(key);
  const rim = new THREE.PointLight(0x12b9ff, 0.75, 12);
  rim.position.set(-3, 3, -4);
  previewScene.add(rim);
  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(3.0, 3.0, 0.14, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.10 })
  );
  pad.position.y = -0.08;
  previewScene.add(pad);
}

function createPreviewVehicleMesh(modelKey) {
  const vehicle = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.default;
  const g = new THREE.Group();
  const [bodyW, bodyH, bodyD] = vehicle.body || VEHICLE_CONFIGS.default.body;
  const [cabinW, cabinH, cabinD] = vehicle.cabin || VEHICLE_CONFIGS.default.cabin;
  const [cabinX, cabinY, cabinZ] = vehicle.cabinOffset || VEHICLE_CONFIGS.default.cabinOffset;
  const body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, bodyD), carMaterial("blue", true, modelKey));
  body.position.y = bodyH / 2;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(cabinW, cabinH, cabinD), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.22, metalness: 0.38 }));
  cabin.position.set(cabinX, cabinY, cabinZ);
  const accent = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.45, bodyW * 0.72), 0.30, 0.26), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x0a91ff, emissiveIntensity: 0.35 }));
  accent.position.set(0, bodyH * 0.76, bodyD / 2 + 0.10);
  const wheelScale = vehicle.wheelScale || 1;
  const wheelX = bodyW / 2 + 0.04;
  const wheelZ = bodyD * 0.34;
  g.add(body, cabin, accent,
    createWheelMesh(-wheelX, -wheelZ, wheelScale),
    createWheelMesh(wheelX, -wheelZ, wheelScale),
    createWheelMesh(-wheelX, wheelZ, wheelScale),
    createWheelMesh(wheelX, wheelZ, wheelScale)
  );
  if (modelKey === "rally") {
    const rollBar = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.055, 8, 18, Math.PI), new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.36, metalness: 0.5 }));
    rollBar.rotation.z = Math.PI;
    rollBar.position.set(0, 1.44, -0.26);
    g.add(rollBar);
  }
  if (modelKey === "truck") {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.84, 0.30, bodyD * 0.34), new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.48, metalness: 0.16 }));
    bed.position.set(0, bodyH + 0.18, -bodyD * 0.22);
    g.add(bed);
  }
  if (modelKey === "muscle") {
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, emissive: 0xffffff, emissiveIntensity: 0.12, roughness: 0.30 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.18, 0.055, bodyD * 0.92), stripeMat);
    stripe.position.set(0, bodyH + 0.055, 0);
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.78, 0.12, 0.22), stripeMat);
    spoiler.position.set(0, bodyH + 0.34, -bodyD * 0.48);
    g.add(stripe, spoiler);
  }

  if (modelKey === "van") {
    const rackMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.38, metalness: 0.46 });
    const rackA = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.74, 0.08, 0.12), rackMat);
    const rackB = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.74, 0.08, 0.12), rackMat);
    rackA.position.set(0, cabinY + cabinH * 0.58, -bodyD * 0.16);
    rackB.position.set(0, cabinY + cabinH * 0.58, bodyD * 0.18);
    const rearPanel = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.72, bodyH * 0.42, 0.08), new THREE.MeshStandardMaterial({ color: 0x0b1220, roughness: 0.45, metalness: 0.12 }));
    rearPanel.position.set(0, bodyH * 0.78, -bodyD * 0.51);
    g.add(rackA, rackB, rearPanel);
  }

  g.position.y = 0.05;
  g.rotation.y = Math.PI * 0.18;
  g.scale.setScalar(0.86);
  return g;
}

function updateVehiclePreview(force = false) {
  const modelKey = VEHICLE_CONFIGS[ui.vehicle?.value] ? ui.vehicle.value : "default";
  const cfg = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.default;
  if (ui.vehiclePreviewName) ui.vehiclePreviewName.textContent = cfg.label || "Vehicle";
  if (ui.vehiclePreviewDesc) ui.vehiclePreviewDesc.textContent = cfg.description || "Selectable body with tiny handling differences.";
  if (!ui.vehiclePreview) return;
  initVehiclePreview();
  if (!previewScene || (!force && previewVehicleModel === modelKey && previewVehicle)) return;
  if (previewVehicle) previewScene.remove(previewVehicle);
  previewVehicle = createPreviewVehicleMesh(modelKey);
  previewVehicleModel = modelKey;
  previewScene.add(previewVehicle);
}

function renderVehiclePreview(now) {
  if (!ui.vehiclePreview || document.body.classList.contains("game-running") || ui.lobby.classList.contains("hidden")) return;
  initVehiclePreview();
  updateVehiclePreview(false);
  if (!previewRenderer || !previewVehicle || !previewCamera) return;
  const rect = ui.vehiclePreview.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return;
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isPhonePortrait() ? 1.45 : 1.6));
  previewRenderer.setSize(rect.width, rect.height, false);
  previewCamera.aspect = rect.width / Math.max(1, rect.height);
  previewCamera.updateProjectionMatrix();
  previewVehicle.rotation.y = now * 0.00135;
  previewRenderer.render(previewScene, previewCamera);
}


const lastSound = {
  ballHitTick: 0,
  wallHitTick: 0,
  bounceTick: 0,
  boostPadTick: 0,
  carBumpTick: 0,
  goalTick: 0,
  roundSerial: 0,
  countdownSecond: 0,
  previousKickoffTimer: 0,
  jumpTicks: new Map(),
  doubleJumpTicks: new Map()
};

function handleSoundEvents(state) {
  if (!state) return;
  const snd = state.sound || {};
  const kickoff = Math.max(0, Number(state.kickoffTimer || 0));
  const roundSerial = Number(snd.roundSerial || 0);
  if (roundSerial !== lastSound.roundSerial) {
    lastSound.roundSerial = roundSerial;
    lastSound.countdownSecond = 0;
    lastSound.previousKickoffTimer = kickoff;
  }
  if (kickoff > 0) {
    const second = Math.max(1, Math.ceil(kickoff));
    if (second !== lastSound.countdownSecond && second <= 5) {
      lastSound.countdownSecond = second;
      SFX.countdown(second);
    }
  } else if (lastSound.previousKickoffTimer > 0) {
    lastSound.countdownSecond = 0;
    SFX.kickoff();
  }
  lastSound.previousKickoffTimer = kickoff;

  if ((snd.goalTick || 0) > lastSound.goalTick) { lastSound.goalTick = snd.goalTick; SFX.goal(snd.goalTeam || "blue"); }
  if ((snd.ballHitTick || 0) > lastSound.ballHitTick) { lastSound.ballHitTick = snd.ballHitTick; SFX.ballHit(snd.ballHitImpulse || state.ball?.lastTouchImpulse || 18); }
  if ((snd.wallHitTick || 0) > lastSound.wallHitTick) { lastSound.wallHitTick = snd.wallHitTick; SFX.wallHit(snd.wallHitSpeed || 8); }
  if ((snd.bounceTick || 0) > lastSound.bounceTick) { lastSound.bounceTick = snd.bounceTick; SFX.bounce(snd.bounceSpeed || 8); }
  if ((snd.boostPadTick || 0) > lastSound.boostPadTick) { lastSound.boostPadTick = snd.boostPadTick; SFX.boostPad(!!snd.boostPadBig); }
  if ((snd.carBumpTick || 0) > lastSound.carBumpTick) { lastSound.carBumpTick = snd.carBumpTick; SFX.carBump(snd.carBumpImpulse || 8); }

  for (const car of Object.values(state.cars || {})) {
    const jt = Number(car.jumpEventTick || 0);
    const djt = Number(car.doubleJumpEventTick || 0);
    if (djt && djt > (lastSound.doubleJumpTicks.get(car.id) || 0)) {
      lastSound.doubleJumpTicks.set(car.id, djt);
      lastSound.jumpTicks.set(car.id, Math.max(jt, djt));
      SFX.jump(true);
    } else if (jt && jt > (lastSound.jumpTicks.get(car.id) || 0)) {
      lastSound.jumpTicks.set(car.id, jt);
      SFX.jump(false);
    }
  }
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
    let mesh = carMeshes.get(car.id);
    const modelKey = VEHICLE_CONFIGS[car.model] ? car.model : "default";
    if (mesh && (mesh.userData.model !== modelKey || mesh.userData.team !== car.team)) {
      world.remove(mesh);
      carMeshes.delete(car.id);
      mesh = null;
    }
    mesh = mesh || createCarMesh(car, state);
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
  handleSoundEvents(state);
  updateHud(state);
  recordLeaderboardResult(state).catch(err => console.warn("Leaderboard result save failed", err));
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
  if (ui.countdown) {
    const k = Math.max(0, Number(state.kickoffTimer || 0));
    const running = document.body.classList.contains("game-running");
    ui.countdown.classList.toggle("hidden", !running || k <= 0);
    if (running && k > 0) {
      ui.countdown.textContent = String(Math.max(1, Math.ceil(k)));
      ui.countdown.dataset.second = String(Math.max(1, Math.ceil(k)));
    }
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
    const toBall = new THREE.Vector3(state.ball.x - localCar.x, 0, state.ball.z - localCar.z);
    if (toBall.lengthSq() < 0.001) toBall.set(Math.sin(localCar.yaw), 0, Math.cos(localCar.yaw));
    toBall.normalize();
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
  SFX.update(latestState, activePlayerId());
  renderer.render(scene, camera);
  renderVehiclePreview(performance.now());
}

setupMobileControls();
firebaseBootPromise = bootFirebase();
renderLoop();
