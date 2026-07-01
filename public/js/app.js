import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import * as AppConfig from "./config.js";
import {
  DEFAULT_META,
  MODE_CONFIGS,
  ROLES,
  STADIUM_THEMES,
  PITCH_SIZE_CONFIGS,
  MATCH_LENGTH_OPTIONS,
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

const FIREBASE_CONFIG = AppConfig.FIREBASE_CONFIG;
const WEBRTC_CONFIG = AppConfig.WEBRTC_CONFIG || { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const $ = sel => document.querySelector(sel);
const LOCAL_UID = "LOCAL_PLAYER";
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ui = {
  setup: $("#setup-card"), gameMode: $("#game-mode-card"), tournamentCard: $("#tournament-card"), lobby: $("#lobby-card"), accountCard: $("#account-card"), leaderboardCard: $("#leaderboard-card"), settingsCard: $("#settings-card"), firebaseWarning: $("#firebase-warning"),
  name: $("#player-name"), nameLabel: $("#player-name-label"), signedPlayerName: $("#signed-player-name"), openModeMenu: $("#open-mode-menu"), modeMenuBack: $("#mode-menu-back"), quickMatch: $("#quick-match"), single: $("#single-player"), tournamentMode: $("#tournament-mode"), tournamentContinue: $("#tournament-continue"), tournamentExit: $("#tournament-exit"), tournamentTitle: $("#tournament-title"), tournamentSubtitle: $("#tournament-subtitle"), tournamentStandings: $("#tournament-standings"), create: $("#create-lobby"), joinCode: $("#join-code"), join: $("#join-lobby"),
  accountStatus: $("#account-status"), openAccount: $("#open-account"), closeAccount: $("#close-account"), accountSubtitle: $("#account-subtitle"), accountAuthFields: $("#account-auth-fields"), accountProfileFields: $("#account-profile-fields"), accountProfileName: $("#account-profile-name"), accountDisplayName: $("#account-display-name"), saveDisplayNameAccount: $("#save-display-name-account"), accountUsername: $("#account-username"), accountPassword: $("#account-password"), accountNewPassword: $("#account-new-password"), createAccount: $("#create-account"), signInAccount: $("#sign-in-account"), changePasswordAccount: $("#change-password-account"), signOutAccount: $("#sign-out-account"), accountMessage: $("#account-message"),
  openSettings: $("#open-settings"), closeSettings: $("#close-settings"), settingsPitchSize: $("#settings-pitch-size"), settingsMatchLength: $("#settings-match-length"), settingsSyncStatus: $("#settings-sync-status"), keybindList: $("#keybind-list"), resetKeybinds: $("#reset-keybinds"), fovRange: $("#fov-range"), fovValue: $("#fov-value"), gameVolume: $("#game-volume"), gameVolumeValue: $("#game-volume-value"), musicVolume: $("#music-volume"), musicVolumeValue: $("#music-volume-value"), musicEnabled: $("#music-enabled"), voiceTestPlayback: $("#voice-test-playback"), voiceTestStatus: $("#voice-test-status"), voiceSpeakerMode: $("#voice-speaker-mode"), voiceActivationMode: $("#voice-activation-mode"), voiceVolume: $("#voice-volume"), voiceVolumeValue: $("#voice-volume-value"), voiceMicSensitivity: $("#voice-mic-sensitivity"), voiceMicSensitivityValue: $("#voice-mic-sensitivity-value"), voiceInputDevice: $("#voice-input-device"), voiceOutputDevice: $("#voice-output-device"), refreshAudioDevices: $("#refresh-audio-devices"), audioDeviceStatus: $("#audio-device-status"), musicTrackSelect: $("#music-track-select"), musicTrackToggles: $("#music-track-toggles"), previewMusic: $("#preview-music"), previousMusic: $("#previous-music"), nextMusic: $("#next-music"), musicNowPlaying: $("#music-now-playing"), menuMusicDock: $("#menu-music-dock"), menuMusicToggle: $("#menu-music-toggle"), menuMusicPanel: $("#menu-music-panel"), menuMusicPrev: $("#menu-music-prev"), menuMusicPlay: $("#menu-music-play"), menuMusicNext: $("#menu-music-next"), menuMusicTitle: $("#menu-music-title"), controllerEnabled: $("#controller-enabled"), controllerDeadzone: $("#controller-deadzone"), controllerDeadzoneValue: $("#controller-deadzone-value"), controllerPanSensitivity: $("#controller-pan-sensitivity"), controllerPanSensitivityValue: $("#controller-pan-sensitivity-value"), controllerStatus: $("#controller-status"), controllerWaitCard: $("#controller-wait-card"), controllerOptions: $("#controller-options"), controllerSettingsSection: $("#controller-settings-section"), controllerBindList: $("#controller-bind-list"), settingsAerialSensitivity: $("#settings-aerial-sensitivity"), settingsAirControl: $("#settings-air-control"), settingsAirRollSensitivity: $("#settings-air-roll-sensitivity"), settingsMobileAerialControls: $("#settings-mobile-aerial-controls"), resetController: $("#reset-controller"), openLeaderboard: $("#open-leaderboard"), closeLeaderboard: $("#close-leaderboard"), leaderboardList: $("#leaderboard-list"),
  connection: $("#connection-status"), lobbyCode: $("#lobby-code-label"), lobbyStatus: $("#lobby-status"), copy: $("#copy-code"),
  mode: $("#mode-select"), theme: $("#theme-select"), teamSize: $("#team-size-select"), pitchSize: $("#pitch-size-select"), matchLength: $("#match-length-select"), customMatchMinutes: $("#custom-match-minutes"), halfTimeEnabled: $("#half-time-enabled"), hydrationEnabled: $("#hydration-enabled"), overtimeEnabled: $("#overtime-enabled"), goldenGoalEnabled: $("#golden-goal-enabled"), overtimeDuration: $("#overtime-duration-select"), tournamentOptions: $("#tournament-options"), tournamentMatchCount: $("#tournament-match-count"), tournamentIndividualLengths: $("#tournament-individual-lengths"), tournamentFinalLonger: $("#tournament-final-longer"), tournamentFinalLength: $("#tournament-final-length"), tournamentLengthList: $("#tournament-length-list"), tournamentScheduleSummary: $("#tournament-schedule-summary"), difficulty: $("#difficulty-select"), playstyle: $("#playstyle-select"), aiStrategy: $("#team-strategy-select"), advancedAiList: $("#advanced-ai-list"), chatScope: $("#chat-scope-select"), voiceScope: $("#voice-scope-select"),
  maxHumans: $("#max-humans-label"), team: $("#team-select"), role: $("#role-select"), vehicle: $("#vehicle-select"), ready: $("#ready-btn"),
  leaveLobby: $("#leave-lobby"), blueList: $("#blue-team-list"), orangeList: $("#orange-team-list"),
  hud: $("#hud"), scoreBlue: $("#score-blue"), scoreOrange: $("#score-orange"), clock: $("#clock"), countdown: $("#round-countdown"), breakOverlay: $("#break-overlay"), breakTitle: $("#break-title"), breakTimer: $("#break-timer"), breakCopy: $("#break-copy"), leaveGame: $("#leave-game"), pauseGame: $("#pause-game"), toggleChat: $("#toggle-chat"), toggleVoice: $("#toggle-voice"), muteVoice: $("#mute-voice"), activeSpeakers: $("#active-speakers"), pauseOverlay: $("#pause-overlay"), pauseOpenSettings: $("#pause-open-settings"), pauseResume: $("#pause-resume"), pauseLeave: $("#pause-leave"),
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
  let sfxVolume = 0.75;
  let seed = 7331;

  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

  function init() {
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = sfxVolume;
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

  function setVolume(value = 0.75) {
    sfxVolume = clamp(Number(value), 0, 1);
    if (master && ctx) master.gain.setTargetAtTime(sfxVolume, ctx.currentTime, 0.035);
  }

  function ready() { return ctx && master && !muted && sfxVolume > 0.001; }

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

  return { resume, setVolume, ui, countdown, kickoff, jump, ballHit, wallHit, bounce, boostPad, carBump, goal, update };
})();

const canvas = $("#game");
let initializeApp, getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, signOut, onAuthStateChanged, getDatabase, ref, get, set, push, update, onValue, remove, onDisconnect, serverTimestamp, query, orderByChild, limitToLast, runTransaction, getFunctions, httpsCallable;
let firebaseBootPromise = null;
let firebaseBootDone = false;
let firebaseBootError = null;
let firebaseReady = false;
let auth = null;
let db = null;
let functions = null;
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
let unsubTeamCommands = null;
let inputTimer = 0;
let currentChat = {};
let chatChannel = localStorage.getItem("rlcss_chat_channel") || "game";
let chatMuted = localStorage.getItem("rlcss_chat_muted") === "1";
let chatOpen = localStorage.getItem("rlcss_chat_open") === "1";
let chatOpenPreferenceSet = localStorage.getItem("rlcss_chat_open") !== null;
let chatRenderKey = "";
let voiceActive = false;
let voiceMuted = localStorage.getItem("rlcss_voice_muted") === "1";
let voiceConnecting = false;
let voiceLocalStream = null;
let voicePresence = {};
let voicePeers = new Map();
let voiceSignalUnsub = null;
let voicePresenceUnsub = null;
let voiceRenderKey = "";
let voiceAnalysisCtx = null;
let voiceAnalysers = new Map();
let voiceActivityTimer = 0;
let voiceTalkers = {};
let voiceSelfTestBusy = false;
let voicePttKeyboardHeld = false;
let voicePttControllerHeld = false;
let voicePttTouchHeld = false;
let audioDeviceRefreshBusy = false;
let localBallCam = (localStorage.getItem("rlcss_ball_cam") ?? localStorage.getItem("pl_ball_cam")) === "1";
const keys = {};
const SETTINGS_VERSION = "v42-ai-team-commands";
const KEY_ACTIONS = [
  ["forward", "Drive forward"], ["backward", "Brake / reverse"], ["left", "Steer left"], ["right", "Steer right"],
  ["boost", "Boost"], ["jump", "Jump / double jump"], ["drift", "Drift / powerslide / free air roll"],
  ["airRollLeft", "Air Roll Left"], ["airRollRight", "Air Roll Right"], ["airRoll", "General Air Roll"],
  ["pitchUp", "Air pitch up"], ["pitchDown", "Air pitch down"], ["yawLeft", "Air yaw left"], ["yawRight", "Air yaw right"],
  ["cam", "Ball cam"], ["reset", "Reset"],
  ["pause", "Pause (host)"], ["chat", "Toggle chat"], ["voice", "Toggle voice"], ["mic", "Mic / push-to-talk"], ["aiCommand", "AI command wheel / speak"]
];
const DEFAULT_FOV = 65;
const DEFAULT_GAME_SETTINGS = {
  pitchSize: DEFAULT_META.pitchSize || "standard",
  matchLength: DEFAULT_META.matchLength || 300,
  aerialSensitivity: 1,
  airControlStrength: 1,
  airRollSensitivity: 1,
  mobileAerialControls: true,
  aiTeamCommands: { enabled: true, inputMode: "quick", serverAiEnabled: false, serverSttEnabled: false, language: "", showTranscript: true, showAcknowledgements: true, wheelTimeout: "medium", commandStrength: "normal", storeHistory: false, sendAmbiguousToServer: false, sendVoiceToServer: false, smarterOpponents: true }
};
const MUSIC_TRACKS = {
  nitro: { label: "Nitro Boost Dreams", src: "./songs/nitro-boost-dreams.mp3" },
  turbo: { label: "Turbo Boost Dreams", src: "./songs/turbo-boost-dreams.mp3" },
  starlight: { label: "Boosting Through Starlight", src: "./songs/boosting-through-starlight.mp3" },
  ignite: { label: "Boost Ignite", src: "./songs/boost-ignite.mp3" },
  hearts: { label: "Nitro Hearts Racing", src: "./songs/nitro-hearts-racing.mp3" },
  overdrive: { label: "Neon Overdrive", src: "./songs/neon-overdrive.wav" },
  anthem2: { label: "Boost Mode Anthem 2", src: "./songs/boost-mode-anthem-2.mp3" },
  anthem: { label: "Boost Mode Anthem", src: "./songs/boost-mode-anthem.wav" }
};
const MUSIC_ORDER = ["nitro", "turbo", "starlight", "ignite", "hearts", "overdrive", "anthem2", "anthem"];
const defaultTrackEnablement = () => Object.fromEntries(MUSIC_ORDER.map(key => [key, true]));
const DEFAULT_AUDIO_SETTINGS = {
  gameVolume: 0.75,
  musicVolume: 0.45,
  musicEnabled: true,
  voiceSpeakerMode: "always",
  voiceActivationMode: "open",
  voiceVolume: 0.85,
  voiceMicSensitivity: 0.45,
  voiceInputDeviceId: "",
  voiceOutputDeviceId: "",
  musicTrack: "shuffle",
  enabledTracks: defaultTrackEnablement()
};
function loadBindings() {
  const base = defaultBindings();
  try {
    const saved = JSON.parse(localStorage.getItem("rlcss_key_bindings") || "{}");
    return sanitiseBindings({ ...base, ...saved });
  } catch (_) { return { ...base }; }
}
function sanitiseBindings(raw = {}) {
  const base = defaultBindings();
  const out = { ...base };
  for (const [action] of KEY_ACTIONS) {
    if (typeof raw[action] === "string" && raw[action]) out[action] = raw[action];
  }
  return out;
}
function sanitiseGameSettings(raw = {}) {
  const pitchSize = PITCH_SIZE_CONFIGS[raw.pitchSize] ? raw.pitchSize : DEFAULT_GAME_SETTINGS.pitchSize;
  const matchLength = MATCH_LENGTH_OPTIONS[String(raw.matchLength)]
    ? Number(raw.matchLength)
    : clamp(Math.round(Number(raw.matchLength) || DEFAULT_GAME_SETTINGS.matchLength), 60, 900);
  const ai = raw.aiTeamCommands || {};
  return { pitchSize, matchLength, aerialSensitivity: clamp(Number(raw.aerialSensitivity ?? 1), 0.55, 1.45), airControlStrength: clamp(Number(raw.airControlStrength ?? 1), 0.55, 1.45), airRollSensitivity: clamp(Number(raw.airRollSensitivity ?? 1), 0.55, 1.55), mobileAerialControls: raw.mobileAerialControls !== false, aiTeamCommands: { ...DEFAULT_GAME_SETTINGS.aiTeamCommands, ...ai, inputMode: ["quick", "push", "alwaysMatch", "alwaysLobbyMatch"].includes(ai.inputMode) ? ai.inputMode : "quick", wheelTimeout: ["short", "medium", "long"].includes(ai.wheelTimeout) ? ai.wheelTimeout : "medium", commandStrength: ["subtle", "normal", "strong"].includes(ai.commandStrength) ? ai.commandStrength : "normal" } };
}
function loadGameSettings() {
  try { return sanitiseGameSettings(JSON.parse(localStorage.getItem("rlcss_gameplay_settings") || "{}") || {}); }
  catch (_) { return { ...DEFAULT_GAME_SETTINGS }; }
}
function sanitiseAudioSettings(raw = {}) {
  const enabledTracks = defaultTrackEnablement();
  const incomingEnabled = raw.enabledTracks && typeof raw.enabledTracks === "object" ? raw.enabledTracks : {};
  for (const key of MUSIC_ORDER) enabledTracks[key] = incomingEnabled[key] !== false;
  const track = raw.musicTrack === "shuffle" || MUSIC_TRACKS[raw.musicTrack] ? raw.musicTrack : DEFAULT_AUDIO_SETTINGS.musicTrack;
  const voiceSpeakerMode = ["always", "menus", "off"].includes(raw.voiceSpeakerMode) ? raw.voiceSpeakerMode : DEFAULT_AUDIO_SETTINGS.voiceSpeakerMode;
  const voiceActivationMode = ["open", "push"].includes(raw.voiceActivationMode) ? raw.voiceActivationMode : DEFAULT_AUDIO_SETTINGS.voiceActivationMode;
  return {
    gameVolume: clamp(Number(raw.gameVolume ?? raw.sfxVolume ?? DEFAULT_AUDIO_SETTINGS.gameVolume), 0, 1),
    musicVolume: clamp(Number(raw.musicVolume ?? DEFAULT_AUDIO_SETTINGS.musicVolume), 0, 1),
    musicEnabled: raw.musicEnabled !== false,
    voiceSpeakerMode,
    voiceActivationMode,
    voiceVolume: clamp(Number(raw.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume), 0, 1),
    voiceMicSensitivity: clamp(Number(raw.voiceMicSensitivity ?? DEFAULT_AUDIO_SETTINGS.voiceMicSensitivity), 0, 1),
    voiceInputDeviceId: typeof raw.voiceInputDeviceId === "string" ? raw.voiceInputDeviceId : "",
    voiceOutputDeviceId: typeof raw.voiceOutputDeviceId === "string" ? raw.voiceOutputDeviceId : "",
    musicTrack: track,
    enabledTracks
  };
}
function enabledMusicKeys(settings = audioSettings) {
  const enabled = settings?.enabledTracks || {};
  return MUSIC_ORDER.filter(key => MUSIC_TRACKS[key] && enabled[key] !== false);
}
function firstEnabledMusicKey(settings = audioSettings) {
  return enabledMusicKeys(settings)[0] || "";
}
function sensitivityLabel(value) {
  const n = clamp(Number(value), 0, 1);
  if (n < 0.22) return "Low";
  if (n < 0.42) return "Medium-low";
  if (n < 0.62) return "Normal";
  if (n < 0.82) return "High";
  return "Very high";
}
function voiceTalkingThreshold(id = "local") {
  const sensitivity = clamp(Number(audioSettings.voiceMicSensitivity ?? DEFAULT_AUDIO_SETTINGS.voiceMicSensitivity), 0, 1);
  const base = id === "local" ? 0.052 : 0.045;
  return clamp(base + (0.5 - sensitivity) * 0.075, 0.012, 0.11);
}
function loadAudioSettings() {
  try { return sanitiseAudioSettings(JSON.parse(localStorage.getItem("rlcss_audio_settings") || "{}") || {}); }
  catch (_) { return { ...DEFAULT_AUDIO_SETTINGS }; }
}
const bindings = loadBindings();
const DEFAULT_CONTROLLER = {
  enabled: true,
  deadzone: 0.18,
  panSensitivity: 1,
  aerialSensitivity: 1,
  airRollSensitivity: 1,
  steerAxis: 0,
  throttleAxis: 7,
  brakeAxis: 6,
  cameraXAxis: 2,
  cameraYAxis: 3,
  jumpButton: 0,
  boostButton: 1,
  driftButton: 2,
  airRollLeftButton: 4,
  airRollRightButton: 5,
  camButton: 3,
  resetButton: 8,
  pauseButton: 9,
  chatButton: 10,
  voiceButton: 11,
  micButton: 12
};
function sanitiseControllerSettings(raw = {}) {
  const merged = { ...DEFAULT_CONTROLLER, ...(raw || {}) };
  merged.enabled = merged.enabled !== false;
  merged.deadzone = clamp(Number(merged.deadzone) || DEFAULT_CONTROLLER.deadzone, 0.05, 0.35);
  merged.panSensitivity = clamp(Number(merged.panSensitivity) || DEFAULT_CONTROLLER.panSensitivity, 0.5, 1.5);
  merged.aerialSensitivity = clamp(Number(merged.aerialSensitivity) || DEFAULT_CONTROLLER.aerialSensitivity, 0.55, 1.45);
  merged.airRollSensitivity = clamp(Number(merged.airRollSensitivity) || DEFAULT_CONTROLLER.airRollSensitivity, 0.55, 1.55);
  for (const key of ["steerAxis", "throttleAxis", "brakeAxis", "cameraXAxis", "cameraYAxis"]) merged[key] = clamp(Math.round(Number(merged[key]) || 0), 0, 7);
  for (const key of ["jumpButton", "boostButton", "driftButton", "airRollLeftButton", "airRollRightButton", "camButton", "resetButton", "pauseButton", "chatButton", "voiceButton", "micButton"]) merged[key] = clamp(Math.round(Number(merged[key]) || 0), 0, 17);
  return merged;
}
const CONTROLLER_BIND_ROWS = [
  ["steerAxis", "Left stick steer", "axis"], ["throttleAxis", "Right trigger / drive", "axis"], ["brakeAxis", "Left trigger / reverse", "axis"],
  ["cameraXAxis", "Right stick pan X", "axis"], ["cameraYAxis", "Right stick pan Y", "axis"],
  ["jumpButton", "Jump", "button"], ["boostButton", "Boost", "button"], ["driftButton", "Drift / free air roll", "button"], ["airRollLeftButton", "Air Roll Left (LB)", "button"], ["airRollRightButton", "Air Roll Right (RB)", "button"], ["camButton", "Ball cam", "button"],
  ["resetButton", "Reset", "button"], ["pauseButton", "Pause", "button"], ["chatButton", "Chat", "button"], ["voiceButton", "Voice", "button"], ["micButton", "Mic mute", "button"]
];
function loadControllerSettings() {
  try { return sanitiseControllerSettings(JSON.parse(localStorage.getItem("rlcss_controller_settings") || "{}") || {}); }
  catch (_) { return { ...DEFAULT_CONTROLLER }; }
}
let gameSettings = loadGameSettings();
let audioSettings = loadAudioSettings();
let cameraFov = clamp(Number(localStorage.getItem("rlcss_camera_fov")) || DEFAULT_FOV, 55, 100);
let controllerSettings = loadControllerSettings();
let pendingKeyBind = null;
const controllerLatches = {};
let controllerInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, airRollLeft: false, airRollRight: false, airRoll: false, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, reset: false };
let controllerLook = { x: 0, y: 0, active: false };
let cloudSettingsLoadedForUid = null;
let settingsSaveTimer = 0;
let applyingCloudSettings = false;
let activeSettingsTab = localStorage.getItem("rlcss_settings_tab") || "gameplay";
let settingsOpenedFromPause = false;
let pendingControllerBind = null;
let controllerBindBaseline = null;
let controllerBindStartedAt = 0;
const controllerNavLatches = {};
let controllerNavLastMove = 0;
let controllerNavSuppressUntil = 0;
let controllerUiLastFocusAt = 0;
const mobileInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, airRollLeft: false, airRollRight: false, airRoll: false, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, reset: false };
let mobileDriftTimer = 0;
let mobileDriftCooldownTimer = 0;
let camKeyLatch = false;
let touchDevice = matchMedia("(pointer: coarse)").matches;
let selectedGameMode = "single";
let tournamentState = null;

const Music = (() => {
  let audio = null;
  let currentTrack = "";
  let recentTracks = [];
  let playedHistory = [];
  let userPaused = false;
  let isLoading = false;
  let hasTriedLaunchAutoplay = false;
  let playRequestId = 0;
  let playInFlight = false;
  let unlockQueued = false;

  function init() {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = "auto";
    audio.autoplay = true;
    audio.playsInline = true;
    audio.setAttribute("playsinline", "");
    audio.crossOrigin = "anonymous";
    audio.addEventListener("ended", () => next(true));
    audio.addEventListener("waiting", () => setLoading(true));
    audio.addEventListener("loadstart", () => setLoading(true));
    audio.addEventListener("canplay", () => { if (!playInFlight) setLoading(false); });
    audio.addEventListener("playing", () => { playInFlight = false; setLoading(false); updateNowPlaying(); });
    audio.addEventListener("pause", () => updateNowPlaying());
    audio.addEventListener("error", () => { setLoading(false); updateNowPlaying("Music file could not be loaded."); });
    return audio;
  }

  function enabledKeys() {
    return enabledMusicKeys(audioSettings);
  }

  function choosePlayableTrack(preferred = "") {
    const enabled = enabledKeys();
    if (!enabled.length) return "";
    if (preferred && MUSIC_TRACKS[preferred] && enabled.includes(preferred)) return preferred;
    return enabled[0];
  }

  function chooseRandomNext() {
    const enabled = enabledKeys();
    if (!enabled.length) return "";
    if (enabled.length === 1) return enabled[0];

    const recentLimit = Math.min(4, Math.max(1, enabled.length - 1));
    const avoid = recentTracks.slice(-recentLimit);
    let candidates = enabled.filter(key => key !== currentTrack && !avoid.includes(key));
    if (!candidates.length) candidates = enabled.filter(key => key !== currentTrack);
    if (!candidates.length) candidates = enabled;
    const picked = candidates[Math.floor(Math.random() * candidates.length)] || enabled[0];
    recentTracks.push(picked);
    while (recentTracks.length > recentLimit) recentTracks.shift();
    return picked;
  }

  function chooseTrack(forceNext = false) {
    if (audioSettings.musicTrack !== "shuffle") return choosePlayableTrack(audioSettings.musicTrack);
    if (forceNext || !currentTrack || !enabledKeys().includes(currentTrack)) return chooseRandomNext();
    return currentTrack;
  }

  function setLoading(next) {
    isLoading = !!next;
    document.body.classList.toggle("music-loading", isLoading);
    if (ui.menuMusicPlay) ui.menuMusicPlay.classList.toggle("loading", isLoading);
    updateNowPlaying();
  }

  function setSource(trackKey, { remember = true } = {}) {
    const safe = choosePlayableTrack(trackKey);
    init();
    if (!safe) {
      currentTrack = "";
      audio.removeAttribute("src");
      audio.load();
      setLoading(false);
      updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
      return false;
    }
    if (currentTrack === safe && audio.src) return true;
    if (remember && currentTrack && currentTrack !== safe) {
      playedHistory.push(currentTrack);
      if (playedHistory.length > 24) playedHistory.shift();
    }
    currentTrack = safe;
    audio.src = MUSIC_TRACKS[safe].src;
    audio.currentTime = 0;
    setLoading(true);
    audio.load();
    updateNowPlaying("Loading first song…");
    return true;
  }

  async function waitUntilCanPlay(timeoutMs = 8000) {
    init();
    if (!audio.src) return false;
    if (audio.readyState >= 3) return true;
    await new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        audio.removeEventListener("canplay", finish);
        audio.removeEventListener("canplaythrough", finish);
        audio.removeEventListener("error", finish);
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(finish, timeoutMs);
      audio.addEventListener("canplay", finish, { once: true });
      audio.addEventListener("canplaythrough", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
    });
    return audio.readyState >= 2;
  }

  function applySettings(tryPlay = true) {
    init();
    audio.volume = clamp(Number(audioSettings.musicVolume), 0, 1);
    audio.loop = false;
    if (!audioSettings.musicEnabled || audioSettings.musicVolume <= 0) {
      userPaused = true;
      audio.pause();
      setLoading(false);
      updateNowPlaying(audioSettings.musicEnabled ? "Music volume is at 0%." : "Music is disabled.");
      return;
    }
    const selected = chooseTrack(false);
    if (!selected) {
      userPaused = true;
      audio.pause();
      setLoading(false);
      updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
      return;
    }
    setSource(selected, { remember: false });
    if (tryPlay && !userPaused) play();
  }

  function unlockAndMaybePlay() {
    unlockQueued = true;
    if (audioSettings.musicEnabled && !userPaused) play({ requireGesture: true });
  }

  async function play({ mutedStart = false, requireGesture = false } = {}) {
    userPaused = false;
    init();
    if (!audioSettings.musicEnabled || audioSettings.musicVolume <= 0) {
      setLoading(false);
      updateNowPlaying(audioSettings.musicEnabled ? "Music volume is at 0%." : "Music is disabled.");
      return false;
    }
    const selected = chooseTrack(false);
    if (!selected) {
      setLoading(false);
      updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
      return false;
    }
    setSource(selected, { remember: false });
    const requestId = ++playRequestId;
    playInFlight = true;
    setLoading(true);
    await waitUntilCanPlay();
    if (requestId !== playRequestId || userPaused) { if (requestId === playRequestId) { playInFlight = false; setLoading(false); } return false; }
    audio.volume = mutedStart ? 0 : clamp(Number(audioSettings.musicVolume), 0, 1);
    audio.muted = !!mutedStart;
    try {
      await audio.play();
      if (requestId !== playRequestId || userPaused) { if (requestId === playRequestId) { playInFlight = false; setLoading(false); } return false; }
      playInFlight = false;
      if (mutedStart) {
        window.setTimeout(() => {
          if (!audio || userPaused || !audioSettings.musicEnabled) return;
          audio.muted = false;
          audio.volume = clamp(Number(audioSettings.musicVolume), 0, 1);
          updateNowPlaying();
        }, 250);
      }
      setLoading(false);
      updateNowPlaying();
      return true;
    } catch (err) {
      playInFlight = false;
      setLoading(false);
      if (requireGesture || hasTriedLaunchAutoplay) updateNowPlaying("Tap play once to start music.");
      else updateNowPlaying("Autoplay blocked — tap anywhere once to start music.");
      return false;
    }
  }

  function pause() {
    userPaused = true;
    playRequestId += 1;
    playInFlight = false;
    setLoading(false);
    if (audio) audio.pause();
    updateNowPlaying("Music paused.");
  }

  function togglePreview() {
    init();
    if (!audioSettings.musicEnabled) {
      audioSettings.musicEnabled = true;
      saveAudioSettingsLocal();
      renderSettingsUi();
    }
    if (isLoading || audio.paused || userPaused) play({ requireGesture: true });
    else pause();
  }

  function next(fromEnded = false) {
    init();
    const selected = chooseRandomNext();
    if (!selected) {
      userPaused = true;
      audio.pause();
      setLoading(false);
      updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
      return;
    }
    setSource(selected, { remember: true });
    if (audioSettings.musicEnabled && !userPaused) play({ requireGesture: !fromEnded });
  }

  function previous() {
    init();
    if (audio && currentTrack && audio.currentTime > 5) {
      audio.currentTime = 0;
      if (audioSettings.musicEnabled) play({ requireGesture: true });
      updateNowPlaying();
      return;
    }
    const enabled = enabledKeys();
    let previousKey = "";
    while (playedHistory.length && !previousKey) {
      const candidate = playedHistory.pop();
      if (enabled.includes(candidate)) previousKey = candidate;
    }
    if (!previousKey) previousKey = enabled.length > 1 ? enabled.find(key => key !== currentTrack) || enabled[0] : enabled[0];
    if (!previousKey) {
      updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
      return;
    }
    setSource(previousKey, { remember: false });
    if (audioSettings.musicEnabled) play({ requireGesture: true });
  }

  function updateNowPlaying(message = "") {
    const enabled = enabledKeys();
    const label = MUSIC_TRACKS[currentTrack]?.label || (enabled.length ? "Music ready" : "No enabled songs");
    const text = message || (isLoading ? `Loading: ${label}` : `Now playing: ${label}`);
    if (ui.musicNowPlaying) ui.musicNowPlaying.textContent = text;
    if (ui.menuMusicTitle) ui.menuMusicTitle.textContent = message ? message.replace(/^Now playing:\s*/i, "") : (isLoading ? `Loading: ${label}` : label);
    const playing = !!(audio && !audio.paused && !userPaused);
    if (ui.previewMusic) ui.previewMusic.textContent = isLoading ? "Loading music…" : (playing ? "Pause music" : "Preview music");
    if (ui.menuMusicPlay) {
      ui.menuMusicPlay.textContent = isLoading ? "◌" : (playing ? "❚❚" : "▶");
      ui.menuMusicPlay.title = isLoading ? "Loading music" : (playing ? "Pause music" : "Play music");
      ui.menuMusicPlay.setAttribute("aria-label", ui.menuMusicPlay.title);
    }
  }

  function toggleDock() {
    document.body.classList.toggle("music-dock-open");
    if (ui.menuMusicToggle) ui.menuMusicToggle.setAttribute("aria-expanded", document.body.classList.contains("music-dock-open") ? "true" : "false");
  }

  function autoplayOnLaunch() {
    if (hasTriedLaunchAutoplay) return;
    hasTriedLaunchAutoplay = true;
    init();
    if (!audioSettings.musicEnabled || audioSettings.musicVolume <= 0 || userPaused) return;
    const selected = chooseTrack(false);
    if (!selected) return updateNowPlaying("No enabled songs. Enable a track in Audio settings.");
    setSource(selected, { remember: false });
    // Load the first track before attempting playback so the menu shows a real
    // loading state instead of a stale Play button. Browsers that block audible
    // autoplay will still be started by the first tap/key via unlockAndMaybePlay.
    play({ mutedStart: false }).then(ok => {
      if (!ok && !userPaused) play({ mutedStart: true });
    });
  }

  return { applySettings, unlockAndMaybePlay, autoplayOnLaunch, play, pause, next, previous, togglePreview, toggleDock, updateNowPlaying };
})();


const AI_COMMANDS = [
  ["DEFEND_GOAL", "Defend goal"], ["TAKE_SHOT", "Take shot"], ["ROTATE_BACK", "Rotate back"], ["CLEAR_BALL", "Clear it"],
  ["GET_BOOST", "Get boost"], ["PASS_LEFT", "Pass left"], ["PASS_RIGHT", "Pass right"], ["GOALKEEPER_HOLD", "Goalie hold"],
  ["TEAM_PRESS", "All push"], ["MARK_OPPONENT", "Mark attacker"], ["SPREAD_OUT", "Spread out"], ["CENTER_BALL", "Center ball"],
  ["ATTACK_BALL", "Go for it"], ["HOLD_POSITION", "Hold position"], ["SUPPORT_ME", "Support me"]
];
const AI_PHRASES = [
  [/\b(defend|defence|defense|protect).*(goal|net)?\b/i, "DEFEND_GOAL"], [/\b(stay back|goalie|goalkeeper|keeper).*\b/i, "GOALKEEPER_HOLD"],
  [/\b(take.*shot|shoot|score)\b/i, "TAKE_SHOT"], [/\b(go for it|attack|challenge|ball)\b/i, "ATTACK_BALL"],
  [/\brotate back|come back|fall back\b/i, "ROTATE_BACK"], [/\bclear( it| ball)?\b/i, "CLEAR_BALL"],
  [/\bpass left|left pass\b/i, "PASS_LEFT"], [/\bpass right|right pass\b/i, "PASS_RIGHT"], [/\bboost|get boost|grab boost\b/i, "GET_BOOST"],
  [/\ball push|press|pressure\b/i, "TEAM_PRESS"], [/\bmark|cover attacker\b/i, "MARK_OPPONENT"], [/\bspread|space out\b/i, "SPREAD_OUT"],
  [/\bcenter|centre\b/i, "CENTER_BALL"], [/\bhold position|wait\b/i, "HOLD_POSITION"], [/\bsupport me|help me\b/i, "SUPPORT_ME"]
];
let aiCommandWheelOpen = false;
let aiCommandRecorder = null;
let aiCommandChunks = [];
let aiCommandPressTimer = 0;
let aiCommandPressStarted = 0;
Object.assign(ui, {
  aiCommandButton: $("#ai-command-button"), aiCommandWheel: $("#ai-command-wheel"), aiCommandOverlay: $("#ai-command-overlay"), mobileAiCommand: $("#mobile-ai-command"), pauseAiCommand: $("#pause-ai-command"),
  aiCommandsEnabled: $("#ai-commands-enabled"), aiCommandInputMode: $("#ai-command-input-mode"), aiCommandServerAi: $("#ai-command-server-ai"), aiCommandServerStt: $("#ai-command-server-stt"), aiCommandLanguage: $("#ai-command-language"), aiCommandTranscript: $("#ai-command-transcript"), aiCommandAcks: $("#ai-command-acks"), aiCommandTimeout: $("#ai-command-timeout"), aiCommandStrength: $("#ai-command-strength"), aiCommandStoreHistory: $("#ai-command-store-history"), aiCommandSendAmbiguous: $("#ai-command-send-ambiguous"), aiCommandSendVoice: $("#ai-command-send-voice"), aiCommandSmarterOpponents: $("#ai-command-smarter-opponents"), aiCommandHelpOpen: $("#ai-command-help-open"), aiCommandHelp: $("#ai-command-help"), aiCommandHelpClose: $("#ai-command-help-close")
});
function aiCommandSettings() { return gameSettings.aiTeamCommands || DEFAULT_GAME_SETTINGS.aiTeamCommands; }
function strengthValue() { return aiCommandSettings().commandStrength === "strong" ? 0.95 : aiCommandSettings().commandStrength === "subtle" ? 0.55 : 0.75; }
function localParseAiCommand(text = "") {
  const clean = String(text).trim();
  for (const [rx, intent] of AI_PHRASES) if (rx.test(clean)) return { transcript: clean, intent, target: "all", confidence: 0.9, strength: strengthValue(), durationMs: 8000 };
  return { transcript: clean, intent: "", target: "all", confidence: 0.15, strength: strengthValue(), durationMs: 6000 };
}
function commandTeam() { return (currentPlayers?.[activePlayerId()]?.team || ui.team?.value || "blue") === "orange" ? "orange" : "blue"; }
function commandSettingsForMeta() { const s = aiCommandSettings(); return { enabled: !!s.enabled && (isSinglePlayer || s.inputMode === "push"), inputMode: s.inputMode, serverAiEnabled: !!s.serverAiEnabled, voiceEnabled: s.inputMode !== "quick", serverSttEnabled: !!s.serverSttEnabled, showTranscript: s.showTranscript !== false, showAcknowledgements: s.showAcknowledgements !== false, commandStrength: s.commandStrength, smarterOpponents: s.smarterOpponents !== false, sameTeamOnly: true }; }
function canUseAiCommandsInMatch() { return !!aiCommandSettings().enabled && currentMeta?.status === "running"; }
function hideAiCommandOverlay() { if (!ui.aiCommandOverlay) return; clearTimeout(showAiCommandOverlay.timer); ui.aiCommandOverlay.classList.add("hidden"); }
function showAiCommandOverlay(text) { if (!ui.aiCommandOverlay || currentMeta?.status !== "running") return; ui.aiCommandOverlay.textContent = text; ui.aiCommandOverlay.classList.remove("hidden"); clearTimeout(showAiCommandOverlay.timer); showAiCommandOverlay.timer = setTimeout(() => ui.aiCommandOverlay.classList.add("hidden"), 2600); }
function aiServerFallbackAvailable() { return !!(functions && httpsCallable); }
async function callAiCommandFunction(name, payload, timeoutMs = 1400) {
  if (!aiServerFallbackAvailable()) throw new Error("AI command server fallback is unavailable.");
  return withTimeout(httpsCallable(functions, name)(payload), timeoutMs, name);
}
async function issueAiCommand(input, source = "quick") {
  const s = aiCommandSettings(); if (!s.enabled) return showAiCommandOverlay("AI Team Commands are disabled.");
  let parsed = typeof input === "string" && !AI_COMMANDS.some(c => c[0] === input) ? localParseAiCommand(input) : { intent: input, transcript: AI_COMMANDS.find(c => c[0] === input)?.[1] || input, confidence: 1, target: "all", durationMs: 8000, strength: strengthValue() };
  if ((!parsed.intent || parsed.confidence < 0.55) && s.serverAiEnabled && s.sendAmbiguousToServer && aiServerFallbackAvailable()) {
    try { parsed = { ...parsed, ...(await callAiCommandFunction("parseAiTeamCommand", { text: parsed.transcript, team: commandTeam(), language: s.language || navigator.language }, 1500)).data }; } catch (err) { console.warn("Server AI command parse failed; keeping local parser result.", err); }
  }
  if (!parsed.intent) return showAiCommandOverlay(`Command not recognized: ${parsed.transcript || "try a quick command"}`);
  const now = Date.now();
  const cmd = { intent: parsed.intent, target: parsed.target || "all", team: commandTeam(), issuedBy: activePlayerId() || uid || LOCAL_UID, issuedByName: playerName, source, confidence: clamp(Number(parsed.confidence || 0.8), 0, 1), strength: clamp(Number(parsed.strength || strengthValue()), 0.1, 1), createdAt: now, expiresAt: now + clamp(Number(parsed.durationMs || 8000), 2500, 12000) };
  if (isSinglePlayer) {
    currentMeta = serialiseMeta({ ...currentMeta, aiTeamCommands: commandSettingsForMeta(), activeTeamCommands: { ...(currentMeta?.activeTeamCommands || {}), [cmd.team]: [cmd] } });
    currentLobby = { ...(currentLobby || {}), meta: currentMeta };
  } else if (db && lobbyCode) {
    await set(push(lobbyRef(lobbyCode, `teamCommands/${cmd.team}`)), cmd).catch(err => console.warn("Command write failed", err));
    if (currentMeta?.hostId === activePlayerId()) await update(lobbyRef(lobbyCode, "commandSettings"), commandSettingsForMeta()).catch(() => {});
  }
  showAiCommandOverlay(`${s.showTranscript !== false ? `Command heard: “${parsed.transcript || cmd.intent}” → ` : ""}${AI_COMMANDS.find(c => c[0] === cmd.intent)?.[1] || cmd.intent}`);
}
function renderAiCommandWheel() { if (!ui.aiCommandWheel) return; ui.aiCommandWheel.innerHTML = AI_COMMANDS.slice(0, 10).map(([intent, label], i) => `<button type="button" style="--i:${i}" data-ai-intent="${intent}">${escapeHtml(label)}</button>`).join(""); }
function setAiCommandWheel(open) {
  aiCommandWheelOpen = !!open && canUseAiCommandsInMatch();
  renderAiCommandWheel();
  ui.aiCommandWheel?.classList.toggle("hidden", !aiCommandWheelOpen);
  [ui.aiCommandButton, ui.mobileAiCommand, ui.pauseAiCommand].forEach(btn => btn?.setAttribute("aria-expanded", aiCommandWheelOpen ? "true" : "false"));
}
function updateAiCommandUi() {
  const enabled = canUseAiCommandsInMatch();
  const phone = isPhonePortrait();
  ui.aiCommandButton?.classList.toggle("hidden", !enabled || phone);
  ui.mobileAiCommand?.classList.add("hidden");
  ui.pauseAiCommand?.classList.toggle("hidden", !enabled || !phone);
  if (!enabled) { setAiCommandWheel(false); hideAiCommandOverlay(); }
}
function applyAiCommandSettingsToUi() { const s = aiCommandSettings(); if (ui.aiCommandsEnabled) ui.aiCommandsEnabled.checked = !!s.enabled; if (ui.aiCommandInputMode) ui.aiCommandInputMode.value = s.inputMode; if (ui.aiCommandServerAi) ui.aiCommandServerAi.checked = !!s.serverAiEnabled; if (ui.aiCommandServerStt) ui.aiCommandServerStt.checked = !!s.serverSttEnabled; if (ui.aiCommandLanguage) ui.aiCommandLanguage.value = s.language || ""; if (ui.aiCommandTranscript) ui.aiCommandTranscript.checked = s.showTranscript !== false; if (ui.aiCommandAcks) ui.aiCommandAcks.checked = s.showAcknowledgements !== false; if (ui.aiCommandTimeout) ui.aiCommandTimeout.value = s.wheelTimeout || "medium"; if (ui.aiCommandStrength) ui.aiCommandStrength.value = s.commandStrength || "normal"; if (ui.aiCommandStoreHistory) ui.aiCommandStoreHistory.checked = !!s.storeHistory; if (ui.aiCommandSendAmbiguous) ui.aiCommandSendAmbiguous.checked = !!s.sendAmbiguousToServer; if (ui.aiCommandSendVoice) ui.aiCommandSendVoice.checked = !!s.sendVoiceToServer; if (ui.aiCommandSmarterOpponents) ui.aiCommandSmarterOpponents.checked = s.smarterOpponents !== false; updateAiCommandUi(); }
function saveAiCommandSettingsFromUi() { gameSettings.aiTeamCommands = { ...aiCommandSettings(), enabled: !!ui.aiCommandsEnabled?.checked, inputMode: ui.aiCommandInputMode?.value || "quick", serverAiEnabled: !!ui.aiCommandServerAi?.checked, serverSttEnabled: !!ui.aiCommandServerStt?.checked, language: ui.aiCommandLanguage?.value || "", showTranscript: ui.aiCommandTranscript?.checked !== false, showAcknowledgements: ui.aiCommandAcks?.checked !== false, wheelTimeout: ui.aiCommandTimeout?.value || "medium", commandStrength: ui.aiCommandStrength?.value || "normal", storeHistory: !!ui.aiCommandStoreHistory?.checked, sendAmbiguousToServer: !!ui.aiCommandSendAmbiguous?.checked, sendVoiceToServer: !!ui.aiCommandSendVoice?.checked, smarterOpponents: ui.aiCommandSmarterOpponents?.checked !== false }; queueSettingsSave(); if (currentMeta) updateMetaPatch({ aiTeamCommands: commandSettingsForMeta() }); applyAiCommandSettingsToUi(); }
async function startAiCommandRecording() { const s = aiCommandSettings(); if (!s.enabled || s.inputMode === "quick") return; try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); aiCommandChunks = []; aiCommandRecorder = new MediaRecorder(stream); aiCommandRecorder.ondataavailable = e => { if (e.data?.size) aiCommandChunks.push(e.data); }; aiCommandRecorder.onstop = async () => { stream.getTracks().forEach(t => t.stop()); showAiCommandOverlay("Voice command recorded. Use browser transcript or quick commands; server STT is optional."); if (s.serverSttEnabled && s.sendVoiceToServer && aiServerFallbackAvailable() && aiCommandChunks.length) { const blob = new Blob(aiCommandChunks, { type: aiCommandRecorder.mimeType || "audio/webm" }); const dataUrl = await new Promise(r => { const fr = new FileReader(); fr.onerror = () => r(""); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); }); try { const res = (await callAiCommandFunction("transcribeAiTeamCommand", { audioDataUrl: dataUrl, language: s.language || navigator.language }, 1800)).data; if (res?.transcript) await issueAiCommand(res.transcript, "voice"); else showAiCommandOverlay("Voice recorded, but no command was recognized. Quick commands still work."); } catch (err) { console.warn("Server STT failed; voice command ignored safely.", err); showAiCommandOverlay("Server voice parsing unavailable. Quick commands still work."); } } }; aiCommandRecorder.start(); showAiCommandOverlay("Listening for AI team command…"); } catch (err) { showAiCommandOverlay("Microphone permission is needed for voice commands."); } }
function stopAiCommandRecording() { if (aiCommandRecorder?.state === "recording") aiCommandRecorder.stop(); }


ui.name.value = playerName;
populateChoiceSelects();
applyGameSettingsToSelectors({ forceLobbyDefaults: true });
renderSettingsUi();
SFX.setVolume(audioSettings.gameVolume);
Music.autoplayOnLaunch();
Music.applySettings(false);

function populateChoiceSelects() {
  fillSelect(ui.theme, STADIUM_THEMES, DEFAULT_META.theme);
  fillSelect(ui.pitchSize, PITCH_SIZE_CONFIGS, gameSettings.pitchSize);
  fillSelect(ui.settingsPitchSize, PITCH_SIZE_CONFIGS, gameSettings.pitchSize);
  fillSelect(ui.matchLength, MATCH_LENGTH_OPTIONS, String(gameSettings.matchLength));
  fillSelect(ui.settingsMatchLength, MATCH_LENGTH_OPTIONS, String(gameSettings.matchLength));
  renderTournamentScheduleOptions();
  fillSelect(ui.vehicle, VEHICLE_CONFIGS, "default");
}

function fillSelect(select, configs, fallback) {
  if (!select) return;
  const current = select.value || fallback;
  select.innerHTML = Object.entries(configs)
    .map(([key, cfg]) => `<option value="${key}">${escapeHtml(cfg.label || key)}</option>`)
    .join("");
  select.value = configs[current] ? current : String(fallback);
}

function actionLabel(action) {
  return (KEY_ACTIONS.find(([key]) => key === action) || [action, action])[1];
}

function keyLabel(code) {
  if (!code) return "Unbound";
  const map = { Space: "Space", ShiftLeft: "Left Shift", ShiftRight: "Right Shift", ControlLeft: "Left Ctrl", ControlRight: "Right Ctrl", AltLeft: "Left Alt", AltRight: "Right Alt", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→" };
  if (map[code]) return map[code];
  return code.replace(/^Key/, "").replace(/^Digit/, "").replace(/^Numpad/, "Num ");
}

function saveBindings() {
  localStorage.setItem("rlcss_key_bindings", JSON.stringify(bindings));
  renderSettingsUi();
  queueSettingsSave();
}

function saveControllerSettings() {
  controllerSettings = sanitiseControllerSettings(controllerSettings);
  localStorage.setItem("rlcss_controller_settings", JSON.stringify(controllerSettings));
  renderSettingsUi();
  queueSettingsSave();
}

function saveGameSettingsLocal() {
  gameSettings = sanitiseGameSettings(gameSettings);
  localStorage.setItem("rlcss_gameplay_settings", JSON.stringify(gameSettings));
}

function settingsRef(id = uid) {
  return ref(db, `settings/${id}`);
}

function cloudSettingsPayload() {
  return {
    version: SETTINGS_VERSION,
    keyboard: { ...bindings },
    camera: { fov: cameraFov },
    controller: sanitiseControllerSettings(controllerSettings),
    gameplay: sanitiseGameSettings(gameSettings),
    audio: sanitiseAudioSettings(audioSettings),
    ui: { settingsTab: activeSettingsTab },
    updatedAt: serverTimestamp()
  };
}

function setSettingsSyncStatus(text) {
  if (ui.settingsSyncStatus) ui.settingsSyncStatus.textContent = text;
}

function saveLocalSettings() {
  localStorage.setItem("rlcss_key_bindings", JSON.stringify(bindings));
  localStorage.setItem("rlcss_camera_fov", String(cameraFov));
  localStorage.setItem("rlcss_controller_settings", JSON.stringify(sanitiseControllerSettings(controllerSettings)));
  localStorage.setItem("rlcss_audio_settings", JSON.stringify(sanitiseAudioSettings(audioSettings)));
  localStorage.setItem("rlcss_settings_tab", activeSettingsTab);
  saveGameSettingsLocal();
}

function queueSettingsSave() {
  saveLocalSettings();
  if (applyingCloudSettings) return;
  if (!isAccountUser() || !db || !uid) {
    setSettingsSyncStatus("Settings saved on this device. Sign in to sync them.");
    return;
  }
  clearTimeout(settingsSaveTimer);
  setSettingsSyncStatus("Saving settings to Firebase…");
  settingsSaveTimer = setTimeout(() => saveSettingsToFirebase(), 650);
}

async function saveSettingsToFirebase() {
  if (!isAccountUser() || !db || !uid) return;
  try {
    await set(settingsRef(uid), cloudSettingsPayload());
    cloudSettingsLoadedForUid = uid;
    setSettingsSyncStatus("Settings saved to Firebase.");
  } catch (err) {
    console.warn("Settings save failed", err);
    setSettingsSyncStatus("Could not sync settings; local copy is saved.");
  }
}

function applyLoadedSettings(raw = {}) {
  applyingCloudSettings = true;
  try {
    const cloudKeys = sanitiseBindings(raw.keyboard || raw.keyBindings || {});
    Object.keys(bindings).forEach(key => delete bindings[key]);
    Object.assign(bindings, cloudKeys);
    cameraFov = clamp(Number(raw.camera?.fov ?? raw.cameraFov) || DEFAULT_FOV, 55, 100);
    controllerSettings = sanitiseControllerSettings(raw.controller || raw.controllerSettings || {});
    gameSettings = sanitiseGameSettings(raw.gameplay || raw.gameSettings || {});
    audioSettings = sanitiseAudioSettings(raw.audio || raw.audioSettings || audioSettings);
    SFX.setVolume(audioSettings.gameVolume);
    applyAllVoiceAudioSettings();
    Music.applySettings(false);
    if (raw.ui?.settingsTab) activeSettingsTab = raw.ui.settingsTab;
    saveLocalSettings();
    applyCameraSettings();
    applyGameSettingsToSelectors({ forceLobbyDefaults: !lobbyCode });
    renderSettingsUi();
    updateControlsHintText();
  } finally {
    applyingCloudSettings = false;
  }
}

async function loadSettingsFromFirebase() {
  if (!isAccountUser() || !db || !uid || cloudSettingsLoadedForUid === uid) return;
  try {
    const snap = await get(settingsRef(uid));
    if (snap.exists()) {
      applyLoadedSettings(snap.val() || {});
      cloudSettingsLoadedForUid = uid;
      setSettingsSyncStatus("Settings loaded from Firebase.");
    } else {
      await saveSettingsToFirebase();
    }
  } catch (err) {
    console.warn("Settings load failed", err);
    setSettingsSyncStatus("Could not load cloud settings; using this device.");
  }
}

function applyGameSettingsToSelectors({ forceLobbyDefaults = false } = {}) {
  const pitch = PITCH_SIZE_CONFIGS[gameSettings.pitchSize] ? gameSettings.pitchSize : DEFAULT_META.pitchSize;
  const length = MATCH_LENGTH_OPTIONS[String(gameSettings.matchLength)] ? String(gameSettings.matchLength) : String(DEFAULT_META.matchLength);
  if (ui.settingsPitchSize) ui.settingsPitchSize.value = pitch;
  if (ui.settingsMatchLength) ui.settingsMatchLength.value = length;
  if (ui.halfTimeEnabled) ui.halfTimeEnabled.checked = !!gameSettings.halfTimeEnabled;
  if (ui.hydrationEnabled) ui.hydrationEnabled.checked = !!gameSettings.hydrationEnabled;
  if (ui.overtimeEnabled) ui.overtimeEnabled.checked = !!gameSettings.overtimeEnabled;
  if (ui.goldenGoalEnabled) ui.goldenGoalEnabled.checked = gameSettings.goldenGoal !== false;
  if (ui.overtimeDuration) ui.overtimeDuration.value = String(gameSettings.overtimeDuration || 180);
  if (forceLobbyDefaults || !lobbyCode) {
    if (ui.pitchSize) ui.pitchSize.value = pitch;
    if (ui.matchLength) ui.matchLength.value = length;
  }
}

function connectedController() {
  return navigator.getGamepads ? Array.from(navigator.getGamepads()).find(Boolean) || null : null;
}

function axisOptions(selected) {
  const pad = connectedController();
  const count = pad?.axes?.length || 0;
  if (!count) return `<option value="" disabled>No axes detected</option>`;
  return Array.from({ length: count }, (_, i) => `<option value="${i}" ${Number(selected) === i ? "selected" : ""}>Axis ${i}</option>`).join("");
}

function buttonOptions(selected) {
  const pad = connectedController();
  const count = pad?.buttons?.length || 0;
  if (!count) return `<option value="" disabled>No buttons detected</option>`;
  return Array.from({ length: count }, (_, i) => `<option value="${i}" ${Number(selected) === i ? "selected" : ""}>Button ${i}</option>`).join("");
}

function renderSettingsUi() {
  if (ui.fovRange) ui.fovRange.value = String(cameraFov);
  if (ui.fovValue) ui.fovValue.textContent = `${Math.round(cameraFov)}°`;
  if (ui.gameVolume) ui.gameVolume.value = String(audioSettings.gameVolume);
  if (ui.gameVolumeValue) ui.gameVolumeValue.textContent = `${Math.round(audioSettings.gameVolume * 100)}%`;
  if (ui.musicVolume) ui.musicVolume.value = String(audioSettings.musicVolume);
  if (ui.musicVolumeValue) ui.musicVolumeValue.textContent = `${Math.round(audioSettings.musicVolume * 100)}%`;
  if (ui.musicEnabled) ui.musicEnabled.checked = audioSettings.musicEnabled;
  if (ui.voiceSpeakerMode) ui.voiceSpeakerMode.value = audioSettings.voiceSpeakerMode || DEFAULT_AUDIO_SETTINGS.voiceSpeakerMode;
  if (ui.voiceActivationMode) ui.voiceActivationMode.value = audioSettings.voiceActivationMode || DEFAULT_AUDIO_SETTINGS.voiceActivationMode;
  if (ui.voiceVolume) ui.voiceVolume.value = String(audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume);
  if (ui.voiceVolumeValue) ui.voiceVolumeValue.textContent = `${Math.round((audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume) * 100)}%`;
  if (ui.voiceMicSensitivity) ui.voiceMicSensitivity.value = String(audioSettings.voiceMicSensitivity ?? DEFAULT_AUDIO_SETTINGS.voiceMicSensitivity);
  if (ui.voiceMicSensitivityValue) ui.voiceMicSensitivityValue.textContent = sensitivityLabel(audioSettings.voiceMicSensitivity ?? DEFAULT_AUDIO_SETTINGS.voiceMicSensitivity);
  if (ui.voiceInputDevice && ui.voiceInputDevice.options.length) ui.voiceInputDevice.value = audioSettings.voiceInputDeviceId || "";
  if (ui.voiceOutputDevice && ui.voiceOutputDevice.options.length) ui.voiceOutputDevice.value = audioSettings.voiceOutputDeviceId || "";
  renderActiveSpeakers();
  if (ui.musicTrackSelect) {
    ui.musicTrackSelect.value = audioSettings.musicTrack;
    Array.from(ui.musicTrackSelect.options).forEach(option => {
      if (option.value !== "shuffle" && MUSIC_TRACKS[option.value]) option.disabled = audioSettings.enabledTracks?.[option.value] === false;
    });
  }
  if (ui.musicTrackToggles) {
    ui.musicTrackToggles.innerHTML = MUSIC_ORDER.map(key => `
      <label class="music-track-toggle">
        <input type="checkbox" data-music-track-toggle="${key}" ${audioSettings.enabledTracks?.[key] === false ? "" : "checked"} />
        <span>${escapeHtml(MUSIC_TRACKS[key].label)}</span>
      </label>`).join("");
  }
  Music.updateNowPlaying();
  applyGameSettingsToSelectors({ forceLobbyDefaults: false });
  if (ui.settingsAerialSensitivity) ui.settingsAerialSensitivity.value = String(gameSettings.aerialSensitivity ?? 1);
  if (ui.settingsAirControl) ui.settingsAirControl.value = String(gameSettings.airControlStrength ?? 1);
  if (ui.settingsAirRollSensitivity) ui.settingsAirRollSensitivity.value = String(gameSettings.airRollSensitivity ?? 1);
  if (ui.settingsMobileAerialControls) ui.settingsMobileAerialControls.checked = gameSettings.mobileAerialControls !== false;
  document.body.classList.toggle("mobile-aerial-disabled", gameSettings.mobileAerialControls === false);
  if (ui.keybindList) {
    ui.keybindList.innerHTML = KEY_ACTIONS.map(([action, label]) => `
      <div class="bind-row">
        <span>${escapeHtml(label)}</span>
        <button type="button" class="bind-btn" data-bind-action="${action}">${escapeHtml(keyLabel(bindings[action]))}</button>
      </div>`).join("");
  }
  if (ui.controllerEnabled) ui.controllerEnabled.checked = controllerSettings.enabled !== false;
  if (ui.controllerDeadzone) ui.controllerDeadzone.value = String(controllerSettings.deadzone ?? DEFAULT_CONTROLLER.deadzone);
  if (ui.controllerDeadzoneValue) ui.controllerDeadzoneValue.textContent = Number(controllerSettings.deadzone ?? DEFAULT_CONTROLLER.deadzone).toFixed(2);
  if (ui.controllerPanSensitivity) ui.controllerPanSensitivity.value = String(controllerSettings.panSensitivity ?? DEFAULT_CONTROLLER.panSensitivity);
  if (ui.controllerPanSensitivityValue) ui.controllerPanSensitivityValue.textContent = `${Number(controllerSettings.panSensitivity ?? DEFAULT_CONTROLLER.panSensitivity).toFixed(2)}x`;
  const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
  const pad = pads[0] || null;
  if (ui.controllerStatus) ui.controllerStatus.textContent = pad
    ? `${pad.id || "Controller"} detected. Configure controls below.`
    : "No controller detected yet. Press any controller button once to wake it up.";
  if (ui.controllerSettingsSection) ui.controllerSettingsSection.classList.toggle("no-controller", !pad);
  if (ui.controllerOptions) ui.controllerOptions.hidden = !pad;
  if (ui.controllerWaitCard) ui.controllerWaitCard.hidden = !!pad;
  if (ui.controllerBindList) {
    if (!pad) {
      ui.controllerBindList.innerHTML = "";
    } else {
      ui.controllerBindList.innerHTML = CONTROLLER_BIND_ROWS.map(([key, label, type]) => {
        const listening = pendingControllerBind?.key === key;
        return `
        <label class="controller-bind-row ${listening ? "listening" : ""}">
          <span>${escapeHtml(label)}</span>
          <div class="controller-bind-controls">
            <select data-controller-bind="${key}">${type === "axis" ? axisOptions(controllerSettings[key]) : buttonOptions(controllerSettings[key])}</select>
            <button type="button" class="detect-controller-btn ${listening ? "listening" : ""}" data-controller-detect="${key}" data-controller-type="${type}">${listening ? "Move input…" : "Detect"}</button>
          </div>
        </label>`;
      }).join("");
    }
  }
  if (ui.controllerStatus) {
    ui.controllerStatus.textContent = pad
      ? `Controller detected: ${pad.id || "Gamepad"}. Only this controller's available axes/buttons are shown below.`
      : "No controller connected. Press any button on your controller to wake it up and show the available options.";
  }
  updateControlsHintText();
}

function setSettingsTab(tab = "gameplay") {
  const safe = ["gameplay", "camera", "audio", "songs", "keyboard", "controller", "mobile", "aiCommands"].includes(tab) ? tab : "gameplay";
  activeSettingsTab = safe;
  localStorage.setItem("rlcss_settings_tab", safe);
  document.querySelectorAll("[data-settings-tab]").forEach(btn => {
    const active = btn.dataset.settingsTab === safe;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll("[data-settings-pane]").forEach(pane => {
    const active = pane.dataset.settingsPane === safe;
    pane.classList.toggle("active", active);
    pane.hidden = !active;
  });
  if (safe === "audio") refreshAudioDevices({ requestPermission: false }).catch(() => {});
}

function hideModeChoicePanels() {
  if (ui.gameMode) ui.gameMode.classList.add("hidden");
  if (ui.tournamentCard) ui.tournamentCard.classList.add("hidden");
}

function closeAiCommandHelp() {
  if (ui.aiCommandHelp) ui.aiCommandHelp.classList.add("hidden");
}

function openSettingsPanel(fromPause = false) {
  settingsOpenedFromPause = !!fromPause;
  hideModeChoicePanels();
  document.body.classList.toggle("settings-open", !!fromPause || currentMeta?.status !== "running");
  showMenuPanel("settings");
  setSettingsTab(activeSettingsTab);
}

function closeSettingsPanel() {
  closeAiCommandHelp();
  if (currentMeta?.status === "running") {
    if (ui.settingsCard) ui.settingsCard.classList.add("hidden");
    document.body.classList.remove("settings-open");
    settingsOpenedFromPause = false;
    updateGameVisibility();
    return;
  }
  document.body.classList.remove("settings-open");
  settingsOpenedFromPause = false;
  showMenuPanel("setup");
}

function applyCameraSettings() {
  if (typeof camera === "undefined") return;
  camera.fov = cameraFov;
  camera.updateProjectionMatrix();
}

function updateControlsHintText() {
  if (!ui.controlsHint) return;
  ui.controlsHint.innerHTML = `
    <div id="cam-indicator">BALL CAM: <span id="cam-state">${localBallCam ? "ON" : "OFF"}</span></div>
    <strong>${escapeHtml(keyLabel(bindings.forward))}/${escapeHtml(keyLabel(bindings.backward))}</strong>: DRIVE &amp; REVERSE &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.boost))}</strong>: BOOST<br />
    <strong>${escapeHtml(keyLabel(bindings.jump))}</strong>: JUMP &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.drift))}</strong>: DRIFT &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.cam))}</strong>: BALL CAM &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.reset))}</strong>: RESET<br />
    <strong>${escapeHtml(keyLabel(bindings.chat))}</strong>: CHAT &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.voice))}</strong>: VOICE &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.mic))}</strong>: MIC &nbsp;|&nbsp; <strong>${escapeHtml(keyLabel(bindings.aiCommand))}</strong>: AI CMD &nbsp;|&nbsp; Controller: left stick drive, right stick pan
  `;
  ui.camState = $("#cam-state");
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
    ({ getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, signOut, onAuthStateChanged } = authMod);
    ({ getDatabase, ref, get, set, push, update, onValue, remove, onDisconnect, serverTimestamp, query, orderByChild, limitToLast, runTransaction } = dbMod);
    const app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getDatabase(app);
    import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js").then(fnMod => {
      ({ getFunctions, httpsCallable } = fnMod);
      functions = getFunctions(app);
    }).catch(err => {
      console.warn("Firebase Functions SDK unavailable; AI command server fallback disabled.", err);
      functions = null;
      httpsCallable = null;
    });
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
          refreshAccountProfile().then(profile => {
            if (profile?.username) return loadSettingsFromFirebase();
          }).finally(() => updateAccountUi());
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
  const display = accountName();
  const username = accountProfile?.username || normalizeUsername(display);
  if (ui.accountStatus) {
    ui.accountStatus.textContent = signedIn
      ? `Signed in: ${display}`
      : (anon ? "Playing as guest" : "Offline / guest only");
  }
  if (ui.openAccount) ui.openAccount.textContent = signedIn ? "Profile" : "Create / Sign in";
  if (ui.openAccount) ui.openAccount.classList.toggle("account-cta", !signedIn);
  if (ui.accountSubtitle) ui.accountSubtitle.textContent = signedIn ? "Manage your profile." : "Create an account for leaderboard stats, or keep playing as guest.";
  if (ui.accountAuthFields) ui.accountAuthFields.classList.toggle("hidden", signedIn);
  if (ui.accountProfileFields) ui.accountProfileFields.classList.toggle("hidden", !signedIn);
  if (ui.accountProfileName) ui.accountProfileName.textContent = username || "player";
  if (ui.accountDisplayName && signedIn && document.activeElement !== ui.accountDisplayName) ui.accountDisplayName.value = display;
  if (ui.createAccount) ui.createAccount.classList.toggle("hidden", signedIn);
  if (ui.signInAccount) ui.signInAccount.classList.toggle("hidden", signedIn);
  if (ui.accountUsername) ui.accountUsername.disabled = signedIn;
  if (ui.accountPassword) ui.accountPassword.disabled = signedIn;
  if (ui.signOutAccount) ui.signOutAccount.classList.toggle("hidden", !signedIn);
  if (ui.changePasswordAccount) ui.changePasswordAccount.classList.toggle("hidden", !signedIn);
  if (ui.saveDisplayNameAccount) ui.saveDisplayNameAccount.classList.toggle("hidden", !signedIn);
  if (ui.nameLabel) ui.nameLabel.classList.toggle("hidden", signedIn);
  if (ui.name) ui.name.disabled = signedIn;
  if (ui.signedPlayerName) {
    ui.signedPlayerName.classList.toggle("hidden", !signedIn);
    const strong = ui.signedPlayerName.querySelector("strong");
    if (strong) strong.textContent = display;
  }
  document.body.classList.toggle("account-signed-in", signedIn);
  if (ui.accountMessage && !ui.accountMessage.dataset.busy) {
    ui.accountMessage.textContent = signedIn
      ? ""
      : (authUser ? "Guest play still works. Accounts save leaderboard stats and cloud settings." : "Connect Firebase to create accounts and save leaderboard stats.");
  }
  if (signedIn) {
    playerName = sanitizeName(display);
    localStorage.setItem("rlcss_online_name", playerName);
    if (ui.name) ui.name.value = playerName;
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

async function saveProfile(username, displayNameInput = "") {
  const clean = normalizeUsername(username);
  const displayName = sanitizeName(displayNameInput || accountProfile?.displayName || username);
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
  queueSettingsSave();
}

async function saveDisplayName() {
  if (!isAccountUser() || !db || !uid) return setAccountMessage("Sign in first.");
  const displayName = sanitizeName(ui.accountDisplayName?.value || accountName());
  if (!displayName || displayName.length < 2) return setAccountMessage("Display name must be 2–18 characters.");
  setAccountMessage("Saving display name…", true);
  await update(profileRef(uid), { displayName, updatedAt: serverTimestamp() });
  accountProfile = { ...(accountProfile || {}), displayName, updatedAt: Date.now() };
  playerName = displayName;
  localStorage.setItem("rlcss_online_name", playerName);
  if (ui.name) ui.name.value = playerName;
  if (lobbyCode && uid) await updateLocalPlayer({ name: playerName });
  await update(leaderboardRef(uid), { displayName }).catch(() => {});
  await publishVoicePresence().catch(() => {});
  updateAccountUi();
  renderLobby();
  setAccountMessage("Display name saved.");
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
  await loadSettingsFromFirebase();
  setAccountMessage(`Signed in as ${username}. Leaderboard stats and settings will now save.`);
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
  await loadSettingsFromFirebase();
  setAccountMessage(`Signed in as ${accountName()}.`);
  startLeaderboardListener();
}

async function changeAccountPassword() {
  if (!isAccountUser() || !authUser || !updatePassword) return setAccountMessage("Sign in first.");
  const next = String(ui.accountNewPassword?.value || "");
  if (next.length < 6) return setAccountMessage("Password must be at least 6 characters.");
  setAccountMessage("Changing password…", true);
  await updatePassword(authUser, next);
  if (ui.accountNewPassword) ui.accountNewPassword.value = "";
  setAccountMessage("Password changed.");
}

async function signOutAccount() {
  if (!auth || !signOut) return;
  setAccountMessage("Signing out…", true);
  await signOut(auth);
  accountProfile = null;
  cloudSettingsLoadedForUid = null;
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
    displayName: accountName(),
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

function voiceRef(code, path = "") {
  return ref(db, path ? `voice/${code}/${path}` : `voice/${code}`);
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


function selectedMatchLengthSeconds() {
  const custom = clamp(Math.round(Number(ui.customMatchMinutes?.value || 0)), 0, 30);
  if (custom >= 1) return custom * 60;
  return Number(ui.matchLength?.value || gameSettings.matchLength || DEFAULT_META.matchLength);
}

function saveRuleSettingsFromSetup() {
  gameSettings.matchLength = selectedMatchLengthSeconds();
  gameSettings.halfTimeEnabled = !!ui.halfTimeEnabled?.checked;
  gameSettings.hydrationEnabled = !!ui.hydrationEnabled?.checked;
  gameSettings.overtimeEnabled = !!ui.overtimeEnabled?.checked;
  gameSettings.goldenGoal = ui.goldenGoalEnabled?.checked !== false;
  gameSettings.overtimeDuration = ui.overtimeDuration?.value || 180;
  saveGameSettingsLocal();
  queueSettingsSave();
}

function tournamentOptionsFromUi() {
  const count = clamp(Number(ui.tournamentMatchCount?.value || 5), 3, 7);
  const defaultLength = selectedMatchLengthSeconds();
  const individual = !!ui.tournamentIndividualLengths?.checked;
  const finalLonger = !!ui.tournamentFinalLonger?.checked;
  const finalLength = Number(ui.tournamentFinalLength?.value || 600);
  const lengths = [];
  for (let i = 0; i < count; i++) {
    const sel = document.querySelector(`[data-tournament-length="${i}"]`);
    lengths.push(individual && sel ? Number(sel.value || defaultLength) : (finalLonger && i === count - 1 ? finalLength : defaultLength));
  }
  return { count, defaultLength, individual, finalLonger, finalLength, lengths };
}

function renderTournamentScheduleOptions() {
  if (!ui.tournamentOptions) return;
  ui.tournamentOptions.classList.toggle("hidden", selectedGameMode !== "tournament");
  const opts = tournamentOptionsFromUi();
  if (ui.tournamentScheduleSummary) ui.tournamentScheduleSummary.textContent = `${opts.count} matches · default ${Math.round(opts.defaultLength / 60)} min${opts.finalLonger ? ` · final ${Math.round(opts.finalLength / 60)} min` : ""}`;
  if (!ui.tournamentLengthList) return;
  ui.tournamentLengthList.innerHTML = opts.individual ? opts.lengths.map((len, i) => `<label>Match ${i + 1}${i === opts.count - 1 ? " / Final" : ""}<select data-tournament-length="${i}">${Object.values(MATCH_LENGTH_OPTIONS).map(o => `<option value="${o.seconds}" ${o.seconds === len ? "selected" : ""}>${o.label}</option>`).join("")}</select></label>`).join("") : "";
}

function openGameModeMenu() { showMenuPanel("mode"); }

function openSingleSetup(mode = "single") {
  selectedGameMode = mode;
  hideModeChoicePanels();
  renderTournamentScheduleOptions();
  startSinglePlayer();
}

function startQuickMatch() {
  selectedGameMode = "quick";
  hideModeChoicePanels();
  if (ui.teamSize) ui.teamSize.value = "1";
  if (ui.matchLength) ui.matchLength.value = String(gameSettings.matchLength || DEFAULT_META.matchLength || 300);
  if (ui.customMatchMinutes) ui.customMatchMinutes.value = "";
  startSinglePlayer();
  setTimeout(() => startSoloMatch(), 60);
}

function beginTournamentSetup() {
  selectedGameMode = "tournament";
  hideModeChoicePanels();
  renderTournamentScheduleOptions();
  startSinglePlayer();
  setStatus("Tournament setup opened. Configure schedule, then start Match 1.");
}

function resetTournamentState() {
  const opts = tournamentOptionsFromUi();
  tournamentState = {
    options: opts,
    index: 0,
    complete: false,
    teams: {
      blue: { w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
      orange: { w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }
    },
    last: null
  };
}

function applyTournamentMatchLength() {
  if (!tournamentState) return;
  const len = tournamentState.options.lengths[tournamentState.index] || tournamentState.options.defaultLength;
  if (ui.matchLength && MATCH_LENGTH_OPTIONS[String(len)]) ui.matchLength.value = String(len);
  if (ui.customMatchMinutes && !MATCH_LENGTH_OPTIONS[String(len)]) ui.customMatchMinutes.value = String(Math.round(len / 60));
  currentMeta = serialiseMeta({ ...currentMeta, matchLength: len });
}

function recordTournamentMatch(state) {
  if (!tournamentState || tournamentState.last?.tick === state.tick) return;
  const blue = Number(state.score?.blue || 0), orange = Number(state.score?.orange || 0);
  const b = tournamentState.teams.blue, o = tournamentState.teams.orange;
  b.gf += blue; b.ga += orange; o.gf += orange; o.ga += blue;
  if (blue > orange) { b.w++; o.l++; b.pts += 3; }
  else if (orange > blue) { o.w++; b.l++; o.pts += 3; }
  else { b.d++; o.d++; b.pts++; o.pts++; }
  tournamentState.last = { tick: state.tick, blue, orange, match: tournamentState.index + 1 };
  tournamentState.index++;
  tournamentState.complete = tournamentState.index >= tournamentState.options.count;
}

function renderTournamentCard() {
  if (!tournamentState || !ui.tournamentCard) return;
  const last = tournamentState.last;
  if (ui.tournamentTitle) ui.tournamentTitle.textContent = tournamentState.complete ? "Final Tournament Results" : `Match ${tournamentState.index + 1} Ready`;
  if (ui.tournamentSubtitle) ui.tournamentSubtitle.textContent = last ? `Last match: Blue ${last.blue} - ${last.orange} Orange` : "Local points: win 3, draw 1, loss 0.";
  const rows = Object.entries(tournamentState.teams).sort((a,b)=>b[1].pts-a[1].pts || (b[1].gf-b[1].ga)-(a[1].gf-a[1].ga));
  if (ui.tournamentStandings) ui.tournamentStandings.innerHTML = rows.map(([team,r]) => `<div class="tournament-row ${team}"><strong>${team.toUpperCase()}</strong><span>${r.w}W ${r.d}D ${r.l}L</span><span>GF ${r.gf} / GA ${r.ga}</span><b>${r.pts} pts</b></div>`).join("");
  if (ui.tournamentContinue) ui.tournamentContinue.textContent = tournamentState.complete ? "Back to Menu" : `Start Match ${tournamentState.index + 1}`;
  currentMeta = serialiseMeta({ ...(currentMeta || DEFAULT_META), status: "waiting", paused: false });
  document.body.classList.remove("game-running");
  showMenuPanel("tournament");
}

function continueTournament() {
  if (!tournamentState || tournamentState.complete) return endTournament();
  applyTournamentMatchLength();
  showMenuPanel("setup");
  startSoloMatch();
}

function endTournament() {
  tournamentState = null;
  selectedGameMode = "single";
  lobbyCode = null;
  currentMeta = null;
  showMenuPanel("setup");
}

function currentSoloMetaPatch() {
  return {
    aiTeamCommands: commandSettingsForMeta(),
    mode: ui.mode?.value || DEFAULT_META.mode,
    theme: ui.theme?.value || DEFAULT_META.theme,
    teamSize: Number(ui.teamSize?.value || DEFAULT_META.teamSize),
    pitchSize: ui.pitchSize?.value || gameSettings.pitchSize || DEFAULT_META.pitchSize,
    matchLength: selectedMatchLengthSeconds(),
    difficulty: ui.difficulty?.value || DEFAULT_META.difficulty,
    playstyle: ui.playstyle?.value || DEFAULT_META.playstyle,
    aiStrategy: ui.playstyle?.value || DEFAULT_META.aiStrategy || DEFAULT_META.playstyle,
    chatScope: ui.chatScope?.value || DEFAULT_META.chatScope,
    voiceScope: ui.voiceScope?.value || DEFAULT_META.voiceScope,
    halfTimeEnabled: !!ui.halfTimeEnabled?.checked,
    hydrationEnabled: !!ui.hydrationEnabled?.checked,
    overtimeEnabled: !!ui.overtimeEnabled?.checked,
    goldenGoal: ui.goldenGoalEnabled?.checked !== false,
    overtimeDuration: ui.overtimeDuration?.value || 180
  };
}

async function createLobby() {
  isSinglePlayer = false;
  hideModeChoicePanels();
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
    const player = { name: playerName, team: ui.team.value || "blue", role: ui.role.value || "balanced", model: ui.vehicle?.value || "default", ready: false, joinedAt: serverTimestamp(), isHost: true };

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
  hideModeChoicePanels();
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
    await withTimeout(set(lobbyRef(code, `players/${uid}`), { name: playerName, team, role: "balanced", model: ui.vehicle?.value || "default", ready: false, joinedAt: serverTimestamp(), isHost: false }), 12000, "Joining lobby");
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
  hideModeChoicePanels();
  closeAiCommandHelp();
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
      role: ui.role.value || "balanced",
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
  setTimeout(focusFirstMenuElement, 80);
  if (ui.lobbyStatus) ui.lobbyStatus.textContent = "Solo setup: configure teams, modes and AI, then start.";
  setStatus("Solo setup opened. Configure the match, then press Start Match.");
}

function startSoloMatch() {
  if (!isSinglePlayer || !currentMeta || !currentPlayers) return;
  hideModeChoicePanels();
  closeAiCommandHelp();
  saveRuleSettingsFromSetup();
  if (selectedGameMode === "tournament" && !tournamentState) resetTournamentState();
  if (selectedGameMode === "tournament") applyTournamentMatchLength();
  const localId = activePlayerId();
  currentPlayers[localId] = {
    ...(currentPlayers[localId] || {}),
    name: sanitizeName(isAccountUser() ? accountName() : ui.name.value),
    team: ui.team.value || currentPlayers[localId]?.team || "blue",
    role: ui.role.value || currentPlayers[localId]?.role || "balanced",
    model: ui.vehicle?.value || currentPlayers[localId]?.model || "default",
    ready: true
  };
  currentMeta = serialiseMeta({ ...currentMeta, aiTeamCommands: commandSettingsForMeta(), status: "running", startedAt: Date.now(), updatedAt: Date.now() });
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
  hideModeChoicePanels();
  closeAiCommandHelp();
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
  unsubTeamCommands = onValue(lobbyRef(code, "teamCommands"), snap => { if (currentMeta) currentMeta = serialiseMeta({ ...currentMeta, activeTeamCommands: snap.val() || {}, aiTeamCommands: currentLobby?.commandSettings || currentMeta.aiTeamCommands }); });
  unsubChat = onValue(lobbyRef(code, "chat"), snap => { currentChat = snap.val() || {}; renderChat(); });
  clearInterval(inputTimer);
  inputTimer = setInterval(sendInput, 33);
  setTimeout(focusFirstMenuElement, 120);
}

function cleanupLobbyListeners() {
  if (typeof unsubLobby === "function") unsubLobby();
  if (typeof unsubInputs === "function") unsubInputs();
  if (typeof unsubState === "function") unsubState();
  if (typeof unsubChat === "function") unsubChat();
  if (typeof unsubTeamCommands === "function") unsubTeamCommands();
  unsubLobby = unsubInputs = unsubState = unsubChat = unsubTeamCommands = null;
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
  if (ui.pitchSize) ui.pitchSize.value = currentMeta.pitchSize || DEFAULT_META.pitchSize;
  if (ui.matchLength) ui.matchLength.value = String(currentMeta.matchLength || DEFAULT_META.matchLength);
  ui.difficulty.value = currentMeta.difficulty;
  ui.playstyle.value = currentMeta.playstyle;
  if (ui.chatScope) ui.chatScope.value = currentMeta.chatScope || DEFAULT_META.chatScope;
  if (ui.voiceScope) ui.voiceScope.value = currentMeta.voiceScope || DEFAULT_META.voiceScope;
  ui.team.value = local.team || "blue";
  ui.role.value = ROLES.includes(local.role) ? local.role : "balanced";
  if (ui.vehicle) ui.vehicle.value = (VEHICLE_CONFIGS[local.model] ? local.model : "default");
  updateVehiclePreview(false);
  ui.ready.classList.toggle("not-ready", !isSinglePlayer && !!local.ready);
  ui.ready.textContent = isSinglePlayer ? "Start Match" : (local.ready ? "Unready" : "Ready");
  ui.mode.disabled = ui.teamSize.disabled = ui.difficulty.disabled = ui.playstyle.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.pitchSize) ui.pitchSize.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.matchLength) ui.matchLength.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.chatScope) ui.chatScope.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.voiceScope) ui.voiceScope.disabled = !isHost || currentMeta.status !== "waiting" || voiceActive;
  if (ui.theme) ui.theme.disabled = !isHost || currentMeta.status !== "waiting";
  if (ui.vehicle) ui.vehicle.disabled = currentMeta.status !== "waiting";
  ui.copy.disabled = isSinglePlayer;
  ui.copy.textContent = isSinglePlayer ? "Solo" : "Copy Code";
  const maxHumans = maxHumansFor(currentMeta.mode, currentMeta.teamSize);
  const humanCount = Object.keys(currentPlayers).length;
  const chatCopy = (currentMeta.chatScope || "all") === "team" ? "Game chat: same-team" : "Game chat: everyone";
  const voiceCopy = currentMeta.voiceScope === "off" ? "Voice: off" : (currentMeta.voiceScope === "all" ? "Voice: everyone" : "Voice: team");
  const pitchCopy = (PITCH_SIZE_CONFIGS[currentMeta.pitchSize] || PITCH_SIZE_CONFIGS.standard).label;
  const lengthCopy = `${Math.round((currentMeta.matchLength || DEFAULT_META.matchLength) / 60)} min`;
  ui.maxHumans.textContent = isSinglePlayer
    ? `Solo mode · ${themeLabel(currentMeta.theme)} · ${pitchCopy} pitch · ${lengthCopy} · ${chatCopy} · ${voiceCopy} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`
    : `Lobby theme: ${themeLabel(currentMeta.theme)} · ${pitchCopy} pitch · ${lengthCopy} · ${chatCopy} · ${voiceCopy} · Max humans: ${maxHumans} · Humans joined: ${humanCount}/${maxHumans} · AI fills the rest to ${currentMeta.teamSize}v${currentMeta.teamSize}`;
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
  if (voiceActive) reconcileVoicePeers();
  updateVoiceUi();
  updateAiCommandUi();
  if (!document.body.classList.contains("game-running") && document.body.classList.contains("using-controller")) {
    setTimeout(focusFirstMenuElement, 0);
  }
}


function aiTuningValue(meta, team, slot, field, fallback = "normal") {
  const value = meta?.aiTuning?.[team]?.[slot]?.[field];
  return ["low", "normal", "high"].includes(value) ? value : fallback;
}

function optionSet(selected, values) {
  return values.map(([value, label]) => `<option value="${value}" ${selected === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
}

function renderAdvancedAiOptions() {
  if (!ui.advancedAiList || !currentMeta) return;
  const meta = currentMeta || DEFAULT_META;
  const isHost = (isSinglePlayer || meta.hostId === activePlayerId()) && meta.status === "waiting";
  const humanByTeam = { blue: [], orange: [] };
  Object.values(currentPlayers || {}).forEach(p => humanByTeam[p.team === "orange" ? "orange" : "blue"].push(p));
  const rows = [];
  for (const team of ["blue", "orange"]) {
    for (let i = 0; i < meta.teamSize; i++) {
      if (humanByTeam[team]?.[i]) continue;
      const role = meta.aiRoles?.[team]?.[i] || defaultRoleForSlot(i, meta.teamSize);
      const aggression = aiTuningValue(meta, team, i, "aggression", "normal");
      const defence = aiTuningValue(meta, team, i, "defence", "normal");
      const boost = aiTuningValue(meta, team, i, "boost", "normal");
      const disabled = isHost ? "" : "disabled";
      rows.push(`
        <div class="advanced-ai-row ${team}">
          <div class="advanced-ai-title"><span class="dot"></span><strong>${team === "blue" ? "Blue" : "Orange"} AI ${i + 1}</strong></div>
          <label>Role
            <select class="advanced-ai-control" data-ai-team="${team}" data-ai-slot="${i}" data-ai-field="role" ${disabled}>
              ${ROLES.map(r => `<option value="${r}" ${r === role ? "selected" : ""}>${roleLabel(r)}</option>`).join("")}
            </select>
          </label>
          <label>Aggression
            <select class="advanced-ai-control" data-ai-team="${team}" data-ai-slot="${i}" data-ai-field="aggression" ${disabled}>
              ${optionSet(aggression, [["low", "Patient"], ["normal", "Normal"], ["high", "Press hard"]])}
            </select>
          </label>
          <label>Defence
            <select class="advanced-ai-control" data-ai-team="${team}" data-ai-slot="${i}" data-ai-field="defence" ${disabled}>
              ${optionSet(defence, [["low", "Loose"], ["normal", "Normal"], ["high", "Hold shape"]])}
            </select>
          </label>
          <label>Boost use
            <select class="advanced-ai-control" data-ai-team="${team}" data-ai-slot="${i}" data-ai-field="boost" ${disabled}>
              ${optionSet(boost, [["low", "Conserve"], ["normal", "Normal"], ["high", "Use often"]])}
            </select>
          </label>
        </div>`);
    }
  }
  ui.advancedAiList.innerHTML = rows.length ? rows.join("") : `<p class="hint">All slots are currently filled by human players. AI options appear when the selected team size leaves AI slots.</p>`;
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
  return role === "balanced" ? "Balanced" : role === "goalkeeper" ? "Goalkeeper" : role === "defence" ? "Back / Defence" : role === "midfield" ? "Midfield" : "Attack";
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
  if (voiceActive && ("team" in patch || "name" in patch)) publishVoicePresence();
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
  document.body.classList.toggle("game-paused", !!(running && currentMeta?.paused));
  document.body.classList.toggle("lobby-open", !!(!running && lobbyCode));
  if (running) {
    if (ui.accountCard) ui.accountCard.classList.add("hidden");
    if (ui.leaderboardCard) ui.leaderboardCard.classList.add("hidden");
    if (ui.gameMode) ui.gameMode.classList.add("hidden");
    if (ui.tournamentCard) ui.tournamentCard.classList.add("hidden");
    if (ui.settingsCard && (!currentMeta?.paused || !settingsOpenedFromPause)) {
      ui.settingsCard.classList.add("hidden");
      document.body.classList.remove("settings-open");
    }
  } else if (lobbyCode) {
    hideModeChoicePanels();
  }
  ui.hud.classList.toggle("hidden", !running);
  if (ui.leaveGame) ui.leaveGame.classList.toggle("hidden", !running);
  if (ui.leaveGame) { ui.leaveGame.textContent = "↩"; ui.leaveGame.title = "Leave match"; ui.leaveGame.setAttribute("aria-label", "Leave match"); }
  const isHostPlayer = running && (isSinglePlayer || currentMeta?.hostId === activePlayerId());
  if (ui.pauseGame) {
    ui.pauseGame.classList.toggle("hidden", !isHostPlayer);
    ui.pauseGame.textContent = currentMeta?.paused ? "▶" : "⏸";
    ui.pauseGame.title = currentMeta?.paused ? "Resume match" : "Pause match";
    ui.pauseGame.setAttribute("aria-label", currentMeta?.paused ? "Resume match" : "Pause match");
  }
  if (ui.pauseOverlay) ui.pauseOverlay.classList.toggle("hidden", !running || !currentMeta?.paused);
  if (ui.pauseResume) ui.pauseResume.classList.toggle("hidden", !isHostPlayer);
  if (ui.pauseOpenSettings) ui.pauseOpenSettings.classList.toggle("hidden", !running || !currentMeta?.paused);
  const lobbyChatActive = !!(lobbyCode && currentMeta && !isSinglePlayer && (currentMeta.status === "waiting" || currentMeta.status === "running"));
  document.body.classList.toggle("lobby-chat-enabled", lobbyChatActive);
  if (lobbyChatActive && !chatOpenPreferenceSet && !isPhonePortrait()) chatOpen = true;
  if (ui.toggleChat) {
    ui.toggleChat.classList.toggle("hidden", !lobbyChatActive);
    ui.toggleChat.textContent = chatOpen ? "💬" : "💬";
    ui.toggleChat.dataset.label = chatOpen ? "Hide chat" : "Open chat";
    ui.toggleChat.setAttribute("aria-expanded", chatOpen ? "true" : "false");
    ui.toggleChat.title = "Toggle lobby/team chat (T)";
  }
  if (ui.chatPanel) ui.chatPanel.classList.toggle("hidden", !lobbyChatActive || !chatOpen);
  updateVoiceUi();
  updateAiCommandUi();
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
      if (currentLobby?.teamCommands) currentMeta = serialiseMeta({ ...currentMeta, activeTeamCommands: currentLobby.teamCommands, aiTeamCommands: currentLobby.commandSettings || currentMeta.aiTeamCommands });
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
  await stopVoice(true);
  if (!isSinglePlayer && lobbyCode && uid && db) {
    await remove(lobbyRef(lobbyCode, `players/${uid}`)).catch(() => {});
    await remove(lobbyRef(lobbyCode, `inputs/${uid}`)).catch(() => {});
  }
  cleanupLobbyListeners();
  isSinglePlayer = false;
  singlePlayerId = null;
  lobbyCode = null; currentLobby = null; currentMeta = null; currentPlayers = {}; currentChat = {}; latestState = null; latestInputs = {};
  ui.lobby.classList.remove("solo");
  document.body.classList.remove("game-running", "game-paused", "settings-open", "lobby-open");
  settingsOpenedFromPause = false;
  ui.setup.classList.remove("hidden");
  if (ui.accountCard) ui.accountCard.classList.add("hidden");
  if (ui.leaderboardCard) ui.leaderboardCard.classList.add("hidden");
  ui.lobby.classList.add("hidden");
  ui.hud.classList.add("hidden");
  if (ui.leaveGame) ui.leaveGame.classList.add("hidden");
  if (ui.pauseGame) ui.pauseGame.classList.add("hidden");
  if (ui.pauseOverlay) ui.pauseOverlay.classList.add("hidden");
  if (ui.breakOverlay) ui.breakOverlay.classList.add("hidden");
  closeAiCommandHelp();
  if (ui.chatPanel) ui.chatPanel.classList.add("hidden");
  document.body.classList.remove("lobby-chat-enabled");
  if (ui.toggleChat) ui.toggleChat.classList.add("hidden");
  if (ui.toggleVoice) ui.toggleVoice.classList.add("hidden");
  if (ui.muteVoice) ui.muteVoice.classList.add("hidden");
  ui.boostLabel.classList.add("hidden");
  ui.boostBox.classList.add("hidden");
  ui.controlsHint.classList.add("hidden");
  ui.mobile.classList.add("hidden");
  if (message) ui.connection.textContent = message;
}

function getFirstGamepad() {
  if (!navigator.getGamepads || controllerSettings.enabled === false) return null;
  return Array.from(navigator.getGamepads()).find(Boolean) || null;
}

function axisValue(gamepad, index, deadzone = controllerSettings.deadzone || DEFAULT_CONTROLLER.deadzone) {
  const raw = gamepad?.axes?.[Number(index)] ?? 0;
  if (!Number.isFinite(raw) || Math.abs(raw) < deadzone) return 0;
  const sign = Math.sign(raw);
  return clamp(sign * ((Math.abs(raw) - deadzone) / Math.max(0.001, 1 - deadzone)), -1, 1);
}

function triggerValueFromAxis(gamepad, index) {
  const raw = gamepad?.axes?.[Number(index)] ?? 0;
  if (!Number.isFinite(raw)) return 0;
  const v = raw < -0.05 ? (raw + 1) / 2 : raw;
  return clamp(v, 0, 1);
}

function buttonValue(gamepad, index) {
  const btn = gamepad?.buttons?.[Number(index)];
  if (!btn) return 0;
  return clamp(Number(btn.value || (btn.pressed ? 1 : 0)) || 0, 0, 1);
}

function buttonPressed(gamepad, index) {
  return buttonValue(gamepad, index) > 0.45;
}

function latchButton(name, pressed, handler) {
  if (pressed && !controllerLatches[name]) {
    controllerLatches[name] = true;
    handler();
  } else if (!pressed) controllerLatches[name] = false;
}

function getFirstRawGamepad() {
  if (!navigator.getGamepads) return null;
  return Array.from(navigator.getGamepads()).find(Boolean) || null;
}

function gamepadSnapshot(pad) {
  return {
    axes: Array.from(pad?.axes || []),
    buttons: Array.from(pad?.buttons || []).map(btn => Number(btn?.value || (btn?.pressed ? 1 : 0)) || 0)
  };
}

function suppressControllerNav(ms = 650) {
  controllerNavSuppressUntil = Math.max(controllerNavSuppressUntil, performance.now() + ms);
  Object.keys(controllerNavLatches).forEach(k => { controllerNavLatches[k] = true; });
}

function startControllerBindDetect(key, type) {
  const pad = getFirstRawGamepad();
  pendingControllerBind = { key, type };
  suppressControllerNav(12000);
  controllerBindBaseline = gamepadSnapshot(pad || { axes: [], buttons: [] });
  controllerBindStartedAt = performance.now();
  renderSettingsUi();
  if (ui.controllerStatus) ui.controllerStatus.textContent = pad ? "Move the controller input you want to assign…" : "Press a button on the controller, then move the input you want to assign…";
}

function finishControllerBindDetect(value) {
  if (!pendingControllerBind) return;
  controllerSettings[pendingControllerBind.key] = Number(value);
  pendingControllerBind = null;
  controllerBindBaseline = null;
  suppressControllerNav(700);
  saveControllerSettings();
  if (ui.controllerStatus) ui.controllerStatus.textContent = "Controller binding detected and saved.";
}

function cancelControllerBindDetect(message = "Controller detect cancelled.") {
  pendingControllerBind = null;
  controllerBindBaseline = null;
  suppressControllerNav(700);
  renderSettingsUi();
  if (ui.controllerStatus) ui.controllerStatus.textContent = message;
}

function updateControllerBindDetect() {
  if (!pendingControllerBind) return;
  const pad = getFirstRawGamepad();
  if (!pad) return;
  if (performance.now() - controllerBindStartedAt > 12000) return cancelControllerBindDetect("Controller detect timed out. Try again and move one input clearly.");
  const base = controllerBindBaseline || gamepadSnapshot(pad);
  const axes = Array.from(pad.axes || []);
  const buttons = Array.from(pad.buttons || []).map(btn => Number(btn?.value || (btn?.pressed ? 1 : 0)) || 0);
  if (pendingControllerBind.type === "axis") {
    for (let i = 0; i < axes.length; i++) {
      const v = Number(axes[i]) || 0;
      const old = Number(base.axes?.[i]) || 0;
      if (Math.abs(v - old) > 0.45 || Math.abs(v) > 0.72) return finishControllerBindDetect(i);
    }
    // Many browsers expose triggers as buttons, but the existing axis mapping
    // intentionally also checks buttonValue(index), so saving the button index
    // here works for common LT/RT controller layouts.
    for (let i = 0; i < buttons.length; i++) {
      const v = buttons[i];
      const old = Number(base.buttons?.[i]) || 0;
      if (v > 0.55 && v - old > 0.35) return finishControllerBindDetect(i);
    }
  } else {
    for (let i = 0; i < buttons.length; i++) {
      const v = buttons[i];
      const old = Number(base.buttons?.[i]) || 0;
      if (v > 0.55 && v - old > 0.35) return finishControllerBindDetect(i);
    }
  }
}

function isVisibleElement(el) {
  if (!el || el.disabled || el.closest(".hidden") || el.hidden) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function menuFocusableElements() {
  const root = document.querySelector("#ui-root");
  const selectors = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), details > summary, [tabindex]:not([tabindex='-1'])";
  const items = Array.from(root?.querySelectorAll(selectors) || []).filter(isVisibleElement);
  const pauseItems = Array.from(document.querySelectorAll("#pause-overlay button:not(:disabled)")).filter(isVisibleElement);
  return [...items, ...pauseItems];
}

function markControllerUiActive() {
  document.body.classList.add("using-controller");
  controllerUiLastFocusAt = performance.now();
}

function focusMenuElement(delta = 1) {
  const items = menuFocusableElements();
  if (!items.length) return;
  markControllerUiActive();
  const currentIndex = items.indexOf(document.activeElement);
  const idx = currentIndex >= 0 ? currentIndex : (delta >= 0 ? -1 : 0);
  const next = items[(idx + delta + items.length) % items.length];
  next.focus({ preventScroll: true });
  next.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
}

function focusFirstMenuElement() {
  const items = menuFocusableElements();
  if (!items.length) return;
  if (isVisibleElement(document.activeElement) && items.includes(document.activeElement)) return;
  markControllerUiActive();
  items[0].focus({ preventScroll: true });
  items[0].scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

function clickFocusedMenuElement() {
  const el = document.activeElement;
  if (!isVisibleElement(el)) return focusMenuElement(1);
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
  if (el.tagName === "SELECT") return stepFocusedSelect(1);
  el.click();
}

function stepFocusedSelect(delta) {
  const el = document.activeElement;
  if (!el || el.tagName !== "SELECT") return false;
  const next = clamp(el.selectedIndex + delta, 0, el.options.length - 1);
  if (next === el.selectedIndex) return true;
  el.selectedIndex = next;
  el.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

function navButtonEdge(name, pressed) {
  if (pressed && !controllerNavLatches[name]) {
    controllerNavLatches[name] = true;
    return true;
  }
  if (!pressed) controllerNavLatches[name] = false;
  return false;
}

function settingsTabDelta(delta) {
  if (pendingControllerBind || pendingKeyBind) return false;
  if (!ui.settingsCard || ui.settingsCard.classList.contains("hidden")) return false;
  const tabs = ["gameplay", "camera", "audio", "songs", "keyboard", "controller", "mobile", "aiCommands"];
  const idx = Math.max(0, tabs.indexOf(activeSettingsTab));
  setSettingsTab(tabs[(idx + delta + tabs.length) % tabs.length]);
  return true;
}

function pollControllerMenuNavigation() {
  if (pendingControllerBind || pendingKeyBind || performance.now() < controllerNavSuppressUntil) return;
  const activeMenu = !document.body.classList.contains("game-running") || (currentMeta?.paused && (!ui.settingsCard?.classList.contains("hidden") || !ui.pauseOverlay?.classList.contains("hidden")));
  if (!activeMenu) return;
  const pad = getFirstRawGamepad();
  if (!pad) return;
  const buttons = pad.buttons || [];
  const axisX = axisValue(pad, 0, 0.42);
  const axisY = axisValue(pad, 1, 0.42);
  const dUp = buttons[12]?.pressed || axisY < -0.65;
  const dDown = buttons[13]?.pressed || axisY > 0.65;
  const dLeft = buttons[14]?.pressed || axisX < -0.65;
  const dRight = buttons[15]?.pressed || axisX > 0.65;
  const now = performance.now();
  if ((dUp || dDown || dLeft || dRight) && now - controllerNavLastMove > 170) {
    controllerNavLastMove = now;
    if (!isVisibleElement(document.activeElement)) {
      focusFirstMenuElement();
      return;
    }
    if (dLeft && (stepFocusedSelect(-1) || settingsTabDelta(-1))) return;
    if (dRight && (stepFocusedSelect(1) || settingsTabDelta(1))) return;
    focusMenuElement(dDown || dRight ? 1 : -1);
  }
  if (navButtonEdge("a", !!buttons[0]?.pressed)) clickFocusedMenuElement();
  if (navButtonEdge("b", !!buttons[1]?.pressed)) {
    if (ui.settingsCard && !ui.settingsCard.classList.contains("hidden")) closeSettingsPanel();
    else if (ui.accountCard && !ui.accountCard.classList.contains("hidden")) showMenuPanel("setup");
    else if (ui.leaderboardCard && !ui.leaderboardCard.classList.contains("hidden")) showMenuPanel("setup");
  }
  if (navButtonEdge("lb", !!buttons[4]?.pressed)) settingsTabDelta(-1);
  if (navButtonEdge("rb", !!buttons[5]?.pressed)) settingsTabDelta(1);
}

function pollController() {
  const pad = getFirstGamepad();
  controllerInput = { throttle: 0, steer: 0, boost: false, jump: false, drift: false, airRollLeft: false, airRollRight: false, airRoll: false, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, reset: false };
  controllerLook = { x: 0, y: 0, active: false };
  if (!pad) { setVoicePttHeld("controller", false); return controllerInput; }
  if (pendingControllerBind || pendingKeyBind) return controllerInput;

  const steerAxis = axisValue(pad, controllerSettings.steerAxis);
  const driveTrigger = Math.max(triggerValueFromAxis(pad, controllerSettings.throttleAxis), buttonValue(pad, controllerSettings.throttleAxis));
  const brakeTrigger = Math.max(triggerValueFromAxis(pad, controllerSettings.brakeAxis), buttonValue(pad, controllerSettings.brakeAxis));
  const boostPressed = buttonPressed(pad, controllerSettings.boostButton);
  const jumpPressed = buttonPressed(pad, controllerSettings.jumpButton);
  const driftPressed = buttonPressed(pad, controllerSettings.driftButton);
  const resetPressed = buttonPressed(pad, controllerSettings.resetButton);
  const airRollLeftPressed = buttonPressed(pad, controllerSettings.airRollLeftButton);
  const airRollRightPressed = buttonPressed(pad, controllerSettings.airRollRightButton);

  // Gamepad left stick follows the same V10 convention as keyboard: positive steer turns left.
  controllerInput = {
    throttle: clamp(driveTrigger - brakeTrigger, -1, 1),
    steer: clamp(-steerAxis, -1, 1),
    pitchUp: Math.max(0, axisValue(pad, 1) * (controllerSettings.aerialSensitivity || 1)),
    pitchDown: Math.max(0, -axisValue(pad, 1) * (controllerSettings.aerialSensitivity || 1)),
    yawLeft: Math.max(0, -steerAxis * (controllerSettings.aerialSensitivity || 1)),
    yawRight: Math.max(0, steerAxis * (controllerSettings.aerialSensitivity || 1)),
    boost: boostPressed,
    jump: jumpPressed,
    drift: driftPressed,
    airRoll: driftPressed,
    airRollLeft: airRollLeftPressed,
    airRollRight: airRollRightPressed,
    reset: resetPressed
  };
  const lookX = axisValue(pad, controllerSettings.cameraXAxis, Math.max(0.08, (controllerSettings.deadzone || 0.18) * 0.75));
  const lookY = axisValue(pad, controllerSettings.cameraYAxis, Math.max(0.08, (controllerSettings.deadzone || 0.18) * 0.75));
  controllerLook = { x: lookX, y: lookY, active: Math.abs(lookX) > 0.01 || Math.abs(lookY) > 0.01 };

  latchButton("cam", buttonPressed(pad, controllerSettings.camButton), () => {
    localBallCam = !localBallCam;
    localStorage.setItem("rlcss_ball_cam", localBallCam ? "1" : "0");
    if (ui.camState) ui.camState.textContent = localBallCam ? "ON" : "OFF";
    SFX.ui(localBallCam ? 860 : 520);
  });
  latchButton("pause", buttonPressed(pad, controllerSettings.pauseButton), () => togglePause());
  latchButton("chat", buttonPressed(pad, controllerSettings.chatButton), () => toggleChatOpen());
  latchButton("voice", buttonPressed(pad, controllerSettings.voiceButton), () => toggleVoice());
  const aiCommandPressed = !!pad.buttons?.[12]?.pressed;
  if (aiCommandPressed && !controllerLatches.aiCommandButton && canUseAiCommandsInMatch()) { controllerLatches.aiCommandButton = true; aiCommandPressStarted = Date.now(); aiCommandPressTimer = setTimeout(() => startAiCommandRecording(), 320); }
  if (!aiCommandPressed && controllerLatches.aiCommandButton) { controllerLatches.aiCommandButton = false; clearTimeout(aiCommandPressTimer); if (Date.now() - aiCommandPressStarted < 320) setAiCommandWheel(!aiCommandWheelOpen); stopAiCommandRecording(); }
  const micPressed = buttonPressed(pad, controllerSettings.micButton);
  if (isPushToTalkMode()) {
    setVoicePttHeld("controller", micPressed);
  } else {
    latchButton("mic", micPressed, () => toggleVoiceMuted());
  }

  return controllerInput;
}

function localInput() {
  const k = inputFromKeys(keys, bindings);
  const c = pollController();
  const combined = {
    throttle: clamp(k.throttle + mobileInput.throttle + c.throttle, -1, 1),
    steer: clamp(k.steer + mobileInput.steer + c.steer, -1, 1),
    boost: k.boost || mobileInput.boost || c.boost,
    jump: k.jump || mobileInput.jump || c.jump,
    drift: k.drift || mobileInput.drift || c.drift,
    cam: localBallCam,
    reset: k.reset || mobileInput.reset || c.reset,
    airRollLeft: k.airRollLeft || mobileInput.airRollLeft || c.airRollLeft,
    airRollRight: k.airRollRight || mobileInput.airRollRight || c.airRollRight,
    airRoll: k.airRoll || mobileInput.airRoll || c.airRoll,
    pitchUp: clamp(((k.pitchUp || 0) + (mobileInput.pitchUp || 0) + (c.pitchUp || 0)) * (gameSettings.aerialSensitivity || 1), 0, 1.5),
    pitchDown: clamp(((k.pitchDown || 0) + (mobileInput.pitchDown || 0) + (c.pitchDown || 0)) * (gameSettings.aerialSensitivity || 1), 0, 1.5),
    yawLeft: clamp(((k.yawLeft || 0) + (mobileInput.yawLeft || 0) + (c.yawLeft || 0)) * (gameSettings.airControlStrength || 1), 0, 1.5),
    yawRight: clamp(((k.yawRight || 0) + (mobileInput.yawRight || 0) + (c.yawRight || 0)) * (gameSettings.airControlStrength || 1), 0, 1.5),
    airRollScale: gameSettings.airRollSensitivity || 1
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

// ---------------------------------------------------------------------------
// V30: actual WebRTC voice chat. Firebase RTDB is used only for signalling
// (presence, offers, answers and ICE candidates); the audio stream itself is
// peer-to-peer between browsers. Voice is opt-in per player and can be scoped
// per lobby to everyone, same-team-only, or disabled.
// ---------------------------------------------------------------------------
function voiceScopeLabel(scope = currentMeta?.voiceScope) {
  if (scope === "off") return "off";
  return scope === "all" ? "everyone" : "team";
}

function localVoicePlayer() {
  return currentPlayers?.[activePlayerId()] || {};
}

function canUseVoice() {
  const status = currentMeta?.status || "";
  const inOnlineLobbyOrMatch = !!(lobbyCode && !isSinglePlayer && (status === "waiting" || status === "running"));
  return !!(navigator.mediaDevices?.getUserMedia && window.RTCPeerConnection && db && uid && inOnlineLobbyOrMatch && currentMeta?.voiceScope !== "off");
}

function voiceIceConfig() {
  const fallback = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const cfg = WEBRTC_CONFIG && typeof WEBRTC_CONFIG === "object" ? WEBRTC_CONFIG : fallback;
  return cfg.iceServers ? cfg : fallback;
}


function isDesktopVoiceOverlayAvailable() {
  return !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)").matches);
}

function shouldShowActiveSpeakerOverlay() {
  const mode = audioSettings.voiceSpeakerMode || DEFAULT_AUDIO_SETTINGS.voiceSpeakerMode;
  if (mode === "off" || !isDesktopVoiceOverlayAvailable()) return false;
  if (mode === "menus" && document.body.classList.contains("game-running") && !document.body.classList.contains("settings-open")) return false;
  return voiceActive && Object.values(voiceTalkers || {}).some(t => t && t.talking);
}

function voiceDisplayFor(id) {
  if (id === "local") {
    const local = localVoicePlayer();
    return {
      name: sanitizeName(local.name || playerName || ui.name?.value || "You"),
      team: local.team === "orange" ? "orange" : "blue",
      muted: voiceMuted
    };
  }
  const presence = voicePresence?.[id] || {};
  const player = currentPlayers?.[id] || {};
  return {
    name: sanitizeName(presence.name || player.name || "Player"),
    team: (presence.team || player.team) === "orange" ? "orange" : "blue",
    muted: !!presence.muted
  };
}

function renderActiveSpeakers() {
  const localInfo = voiceActive ? (voiceTalkers.local || { talking: false, level: 0 }) : null;
  const localLevel = clamp(Number(localInfo?.level || 0), 0, 0.35);
  const localPercentRaw = Math.round(clamp(localLevel / 0.18, 0, 1) * 100);
  const localTalking = !!(localInfo?.talking && voiceActive && !voiceMuted && (!isPushToTalkMode() || isVoicePttHeld()));
  if (ui.muteVoice) {
    ui.muteVoice.style.setProperty("--voice-level", `${localPercentRaw}%`);
    ui.muteVoice.classList.toggle("voice-input-detected", localPercentRaw > 8);
    ui.muteVoice.classList.toggle("voice-local-talking", localTalking);
    if (voiceActive) ui.muteVoice.dataset.level = `${localPercentRaw}%`;
    else delete ui.muteVoice.dataset.level;
  }
  if (!ui.activeSpeakers) return;
  const entries = Object.entries(voiceTalkers || {});
  const talkers = entries
    .filter(([, info]) => info && info.talking)
    .map(([id, info]) => ({ id, ...voiceDisplayFor(id), level: info.level || 0 }))
    .filter(t => !t.muted)
    .sort((a, b) => b.level - a.level)
    .slice(0, 4);
  const mode = audioSettings.voiceSpeakerMode || DEFAULT_AUDIO_SETTINGS.voiceSpeakerMode;
  const showMonitor = voiceActive && mode !== "off" && isDesktopVoiceOverlayAvailable() && (mode !== "menus" || !document.body.classList.contains("game-running") || document.body.classList.contains("settings-open"));
  const show = showMonitor && (talkers.length > 0 || localInfo);
  ui.activeSpeakers.classList.toggle("hidden", !show);
  if (!show) {
    ui.activeSpeakers.innerHTML = "";
    return;
  }
  const localOverlayLevel = clamp(Number(localInfo?.level || 0), 0, 0.28);
  const localPercent = Math.round((localOverlayLevel / 0.28) * 100);
  const transmitting = voiceActive && !voiceMuted && (!isPushToTalkMode() || isVoicePttHeld());
  ui.activeSpeakers.innerHTML = `
    <div class="active-speakers-title">Voice ${transmitting ? "live" : "monitor"}</div>
    <div class="active-speaker self ${localInfo?.talking && transmitting ? "talking" : ""}"><span></span>${escapeHtml(transmitting ? "You" : "You muted / PTT off")}</div>
    <div class="voice-level-meter" aria-hidden="true"><i style="width:${localPercent}%"></i></div>
    ${talkers.filter(t => t.id !== "local").map(t => `<div class="active-speaker ${t.team}"><span></span>${escapeHtml(t.name)}</div>`).join("")}
  `;
}
function getVoiceAnalysisContext() {
  if (!voiceAnalysisCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    voiceAnalysisCtx = new AudioContext();
  }
  if (voiceAnalysisCtx.state === "suspended") voiceAnalysisCtx.resume?.().catch(() => {});
  return voiceAnalysisCtx;
}

function attachVoiceAnalyser(id, stream) {
  if (!id || !stream || voiceAnalysers.has(id)) return;
  const ctx = getVoiceAnalysisContext();
  if (!ctx) return;
  try {
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.55;
    source.connect(analyser);
    voiceAnalysers.set(id, { source, analyser, data: new Uint8Array(analyser.fftSize) });
    ensureVoiceActivityLoop();
  } catch (err) {
    console.warn("Voice activity analyser failed", err);
  }
}

function detachVoiceAnalyser(id) {
  const analyser = voiceAnalysers.get(id);
  if (analyser?.source) {
    try { analyser.source.disconnect(); } catch (_) {}
  }
  voiceAnalysers.delete(id);
  delete voiceTalkers[id];
  if (!voiceAnalysers.size && voiceActivityTimer) {
    clearInterval(voiceActivityTimer);
    voiceActivityTimer = 0;
  }
  renderActiveSpeakers();
}

function ensureVoiceActivityLoop() {
  if (voiceActivityTimer) return;
  voiceActivityTimer = setInterval(() => {
    let changed = false;
    for (const [id, item] of voiceAnalysers.entries()) {
      item.analyser.getByteTimeDomainData(item.data);
      let sum = 0;
      for (let i = 0; i < item.data.length; i++) {
        const v = (item.data[i] - 128) / 128;
        sum += v * v;
      }
      const level = Math.sqrt(sum / Math.max(1, item.data.length));
      const threshold = voiceTalkingThreshold(id);
      const previous = voiceTalkers[id] || { talking: false, level: 0 };
      const talking = level > threshold;
      if (previous.talking !== talking || Math.abs((previous.level || 0) - level) > 0.02) changed = true;
      voiceTalkers[id] = { talking, level, lastHeard: talking ? Date.now() : previous.lastHeard || 0 };
    }
    if (changed) renderActiveSpeakers();
  }, 160);
}


function selectedAudioInputConstraint() {
  const deviceId = audioSettings.voiceInputDeviceId || "";
  return {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    ...(deviceId ? { deviceId: { exact: deviceId } } : {})
  };
}

async function applyVoiceOutputDevice(audioEl) {
  if (!audioEl || typeof audioEl.setSinkId !== "function") return false;
  try {
    await audioEl.setSinkId(audioSettings.voiceOutputDeviceId || "");
    return true;
  } catch (err) {
    console.warn("Could not set voice output device", err);
    return false;
  }
}

function applyAllVoiceAudioSettings() {
  const volume = clamp(Number(audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume), 0, 1);
  for (const peer of voicePeers.values()) {
    if (peer.audio) peer.audio.volume = volume;
  }
}

async function refreshAudioDevices({ requestPermission = false } = {}) {
  if (!navigator.mediaDevices?.enumerateDevices) {
    if (ui.audioDeviceStatus) ui.audioDeviceStatus.textContent = "This browser cannot list audio devices.";
    return;
  }
  if (audioDeviceRefreshBusy) return;
  audioDeviceRefreshBusy = true;
  if (ui.refreshAudioDevices) ui.refreshAudioDevices.disabled = true;
  if (ui.audioDeviceStatus) ui.audioDeviceStatus.textContent = requestPermission ? "Requesting mic permission…" : "Scanning audio devices…";
  let tempStream = null;
  try {
    if (requestPermission && navigator.mediaDevices.getUserMedia) {
      tempStream = await navigator.mediaDevices.getUserMedia({ audio: selectedAudioInputConstraint(), video: false });
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter(device => device.kind === "audioinput");
    const outputs = devices.filter(device => device.kind === "audiooutput");
    const option = (device, index, fallback) => `<option value="${escapeHtml(device.deviceId)}">${escapeHtml(device.label || `${fallback} ${index + 1}`)}</option>`;
    if (ui.voiceInputDevice) {
      ui.voiceInputDevice.innerHTML = `<option value="">Default microphone</option>` + inputs.map((device, i) => option(device, i, "Microphone")).join("");
      const hasInput = !audioSettings.voiceInputDeviceId || inputs.some(device => device.deviceId === audioSettings.voiceInputDeviceId);
      if (!hasInput) audioSettings.voiceInputDeviceId = "";
      ui.voiceInputDevice.value = audioSettings.voiceInputDeviceId || "";
    }
    if (ui.voiceOutputDevice) {
      ui.voiceOutputDevice.innerHTML = `<option value="">Default speaker/headphones</option>` + outputs.map((device, i) => option(device, i, "Output")).join("");
      const supported = typeof HTMLMediaElement !== "undefined" && "setSinkId" in HTMLMediaElement.prototype;
      const hasOutput = !audioSettings.voiceOutputDeviceId || outputs.some(device => device.deviceId === audioSettings.voiceOutputDeviceId);
      if (!hasOutput) audioSettings.voiceOutputDeviceId = "";
      ui.voiceOutputDevice.value = audioSettings.voiceOutputDeviceId || "";
      ui.voiceOutputDevice.disabled = !supported || !outputs.length;
    }
    if (ui.audioDeviceStatus) {
      const outputText = (typeof HTMLMediaElement !== "undefined" && "setSinkId" in HTMLMediaElement.prototype)
        ? `${outputs.length || 1} output option${(outputs.length || 1) === 1 ? "" : "s"}`
        : "output selection not supported here";
      ui.audioDeviceStatus.textContent = `${inputs.length || 1} mic option${(inputs.length || 1) === 1 ? "" : "s"}; ${outputText}.`;
    }
  } catch (err) {
    console.warn("Audio device refresh failed", err);
    if (ui.audioDeviceStatus) ui.audioDeviceStatus.textContent = `Could not access audio devices: ${err.message || err}`;
  } finally {
    if (tempStream) tempStream.getTracks().forEach(track => track.stop());
    audioDeviceRefreshBusy = false;
    if (ui.refreshAudioDevices) ui.refreshAudioDevices.disabled = false;
  }
}

function isPushToTalkMode() {
  return (audioSettings.voiceActivationMode || DEFAULT_AUDIO_SETTINGS.voiceActivationMode) === "push";
}

function isVoicePttHeld() {
  return !!(voicePttKeyboardHeld || voicePttControllerHeld || voicePttTouchHeld);
}

function updateVoiceTransmitState() {
  const shouldTransmit = voiceActive && !voiceMuted && (!isPushToTalkMode() || isVoicePttHeld());
  if (voiceLocalStream) voiceLocalStream.getAudioTracks().forEach(track => { track.enabled = shouldTransmit; });
  updateVoiceUi();
  updateAiCommandUi();
  if (voiceActive) publishVoicePresence();
}

function setVoicePttHeld(source, held) {
  const next = !!held;
  if (source === "keyboard") voicePttKeyboardHeld = next;
  else if (source === "controller") voicePttControllerHeld = next;
  else if (source === "touch") voicePttTouchHeld = next;
  updateVoiceTransmitState();
}
async function runVoiceSelfTest() {
  if (voiceSelfTestBusy) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Mic test is not supported in this browser.";
    return;
  }
  voiceSelfTestBusy = true;
  if (ui.voiceTestPlayback) ui.voiceTestPlayback.disabled = true;
  if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Requesting microphone permission…";
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: selectedAudioInputConstraint(),
      video: false
    });
    if (!window.MediaRecorder) {
      if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Mic is detected, but this browser cannot record playback samples.";
      return;
    }
    const chunks = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
    const done = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = () => reject(recorder.error || new Error("Recorder failed"));
    });
    if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Recording your mic for 2 seconds… speak now.";
    recorder.start();
    await new Promise(resolve => setTimeout(resolve, 2100));
    if (recorder.state !== "inactive") recorder.stop();
    await done;
    if (!chunks.length) {
      if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "No microphone audio was captured. Check your input device/permission.";
      return;
    }
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    const url = URL.createObjectURL(blob);
    const playback = new Audio(url);
    playback.volume = clamp(Number(audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume), 0, 1);
    await applyVoiceOutputDevice(playback);
    if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Playing back your mic sample…";
    await playback.play().catch(err => {
      if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Recorded OK. Tap the test button again if playback was blocked.";
      throw err;
    });
    await new Promise(resolve => { playback.onended = resolve; setTimeout(resolve, 3500); });
    URL.revokeObjectURL(url);
    if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = "Voice check complete. If you heard yourself, mic and output are working.";
  } catch (err) {
    console.error(err);
    if (ui.voiceTestStatus) ui.voiceTestStatus.textContent = `Voice check failed: ${err.message || err}.`;
  } finally {
    if (stream) stream.getTracks().forEach(track => track.stop());
    voiceSelfTestBusy = false;
    if (ui.voiceTestPlayback) ui.voiceTestPlayback.disabled = false;
  }
}

function updateVoiceUi() {
  const status = currentMeta?.status || "";
  const runningOnline = !!(!isSinglePlayer && lobbyCode && (status === "waiting" || status === "running"));
  const disabledByHost = currentMeta?.voiceScope === "off";
  const show = runningOnline && !disabledByHost;
  if (ui.toggleVoice) {
    ui.toggleVoice.classList.toggle("hidden", !show);
    ui.toggleVoice.classList.toggle("voice-live", voiceActive);
    ui.toggleVoice.classList.toggle("voice-connecting", voiceConnecting);
    ui.toggleVoice.disabled = !runningOnline || disabledByHost || voiceConnecting;
    ui.toggleVoice.setAttribute("aria-pressed", voiceActive ? "true" : "false");
    const count = Math.max(0, voicePeers.size);
    ui.toggleVoice.textContent = voiceActive ? "🔊" : "🎙";
    ui.toggleVoice.dataset.label = voiceActive ? `Voice on · ${voiceScopeLabel()} · ${count ? count + 1 : 1}` : "Join voice";
    ui.toggleVoice.title = disabledByHost ? "Voice chat disabled by host" : "Join/leave voice chat (V). Works in lobbies and matches.";
  }
  if (ui.muteVoice) {
    const pushMode = isPushToTalkMode();
    const transmitting = !!(voiceActive && !voiceMuted && (!pushMode || isVoicePttHeld()));
    ui.muteVoice.classList.toggle("hidden", !show || !voiceActive);
    ui.muteVoice.classList.toggle("voice-muted", voiceMuted || (pushMode && !isVoicePttHeld()));
    ui.muteVoice.classList.toggle("voice-talking", transmitting);
    ui.muteVoice.setAttribute("aria-pressed", transmitting ? "true" : "false");
    ui.muteVoice.textContent = pushMode ? (transmitting ? "🟢" : "🎤") : (voiceMuted ? "🔇" : "🎤");
    ui.muteVoice.dataset.label = pushMode ? (transmitting ? "Talking" : "Hold to talk") : (voiceMuted ? "Mic muted" : "Mic on");
    ui.muteVoice.title = pushMode ? "Hold to talk. Uses your Mic / push-to-talk keyboard or controller binding too." : "Mute/unmute microphone (M)";
  }
  if (disabledByHost && voiceActive) stopVoice(true);
  renderActiveSpeakers();
}

async function publishVoicePresence() {
  if (!voiceActive || !db || !uid || !lobbyCode) return;
  const local = localVoicePlayer();
  await set(voiceRef(lobbyCode, `presence/${uid}`), {
    name: sanitizeName(local.name || playerName || ui.name?.value),
    team: local.team === "orange" ? "orange" : "blue",
    muted: !!voiceMuted || (isPushToTalkMode() && !isVoicePttHeld()),
    activation: audioSettings.voiceActivationMode || DEFAULT_AUDIO_SETTINGS.voiceActivationMode,
    updatedAt: serverTimestamp(),
    clientTime: Date.now()
  }).catch(err => console.warn("Voice presence update failed", err));
}

function setupVoiceSubscriptions() {
  if (!voiceActive || !lobbyCode || !uid || !db) return;
  if (!voicePresenceUnsub) {
    voicePresenceUnsub = onValue(voiceRef(lobbyCode, "presence"), snap => {
      voicePresence = snap.val() || {};
      reconcileVoicePeers();
      updateVoiceUi();
  updateAiCommandUi();
    });
  }
  if (!voiceSignalUnsub) {
    voiceSignalUnsub = onValue(voiceRef(lobbyCode, `signals/${uid}`), snap => {
      const signals = snap.val() || {};
      Object.entries(signals)
        .sort(([, a], [, b]) => Number(a?.clientTime || 0) - Number(b?.clientTime || 0))
        .forEach(([id, signal]) => {
          handleVoiceSignal(id, signal).catch(err => console.warn("Voice signal failed", err));
        });
    });
  }
  onDisconnect(voiceRef(lobbyCode, `presence/${uid}`)).remove().catch(() => {});
  onDisconnect(voiceRef(lobbyCode, `signals/${uid}`)).remove().catch(() => {});
}

function clearVoiceSubscriptions() {
  if (typeof voicePresenceUnsub === "function") voicePresenceUnsub();
  if (typeof voiceSignalUnsub === "function") voiceSignalUnsub();
  voicePresenceUnsub = null;
  voiceSignalUnsub = null;
}

function voicePeerEligible(remoteId) {
  if (!voiceActive || !remoteId || remoteId === uid || currentMeta?.voiceScope === "off") return false;
  const remotePlayer = currentPlayers?.[remoteId];
  if (!remotePlayer) return false;
  const remotePresence = voicePresence?.[remoteId] || {};
  if ((currentMeta?.voiceScope || "team") === "team") {
    const localTeam = localVoicePlayer().team === "orange" ? "orange" : "blue";
    const remoteTeam = (remotePresence.team || remotePlayer.team) === "orange" ? "orange" : "blue";
    return localTeam === remoteTeam;
  }
  return true;
}

function reconcileVoicePeers() {
  if (!voiceActive || !uid) return;
  for (const remoteId of Array.from(voicePeers.keys())) {
    if (!voicePeerEligible(remoteId)) closeVoicePeer(remoteId, true);
  }
  for (const remoteId of Object.keys(voicePresence || {})) {
    if (!voicePeerEligible(remoteId) || voicePeers.has(remoteId)) continue;
    // Lexicographic ordering avoids both browsers creating simultaneous offers.
    if (String(uid) < String(remoteId)) createVoicePeer(remoteId, true).catch(err => console.warn("Voice offer failed", err));
  }
}

async function requestVoiceStreamWithFallback() {
  try {
    return await navigator.mediaDevices.getUserMedia({ audio: selectedAudioInputConstraint(), video: false });
  } catch (err) {
    const namedDeviceFailed = !!audioSettings.voiceInputDeviceId && ["NotFoundError", "OverconstrainedError", "ConstraintNotSatisfiedError"].includes(err?.name);
    if (!namedDeviceFailed) throw err;
    audioSettings.voiceInputDeviceId = "";
    renderSettingsInputs();
    commitAudioSettings({ play: false });
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false
    });
  }
}

async function startVoice() {
  if (voiceActive || voiceConnecting) return;
  if (!canUseVoice()) {
    setStatus(currentMeta?.voiceScope === "off" ? "Voice chat is disabled by the host." : "Voice needs an online lobby or match, HTTPS, and microphone permission.");
    return;
  }
  voiceConnecting = true;
  setStatus("Requesting microphone permission… allow access in your browser popup.");
  updateVoiceUi();
  updateAiCommandUi();
  try {
    voiceLocalStream = await requestVoiceStreamWithFallback();
    voiceLocalStream.getAudioTracks().forEach(track => { track.enabled = false; });
    attachVoiceAnalyser("local", voiceLocalStream);
    refreshAudioDevices({ requestPermission: false }).catch(() => {});
    voiceActive = true;
    updateVoiceTransmitState();
    setupVoiceSubscriptions();
    await publishVoicePresence();
    reconcileVoicePeers();
    setStatus(`Voice chat joined (${voiceScopeLabel()}). Speak now — your local meter should move in the voice overlay.`);
  } catch (err) {
    console.error(err);
    setStatus(`Voice chat failed: ${err.message || err}. Tap Voice again and allow microphone permission in the browser. HTTPS is required.`);
    stopLocalVoiceTracks();
  } finally {
    voiceConnecting = false;
    updateVoiceUi();
  updateAiCommandUi();
  }
}

async function stopVoice(silent = false) {
  if (!voiceActive && !voiceConnecting && !voiceLocalStream) {
    updateVoiceUi();
  updateAiCommandUi();
    return;
  }
  const code = lobbyCode;
  const local = uid;
  const remoteIds = Array.from(voicePeers.keys());
  for (const remoteId of remoteIds) sendVoiceSignal(remoteId, { type: "leave" }).catch(() => {});
  closeAllVoicePeers();
  clearVoiceSubscriptions();
  stopLocalVoiceTracks();
  voiceActive = false;
  voiceConnecting = false;
  voicePresence = {};
  if (db && code && local) {
    await remove(voiceRef(code, `presence/${local}`)).catch(() => {});
    await remove(voiceRef(code, `signals/${local}`)).catch(() => {});
  }
  if (!silent) setStatus("Voice chat left.");
  updateVoiceUi();
  updateAiCommandUi();
}

function stopLocalVoiceTracks() {
  detachVoiceAnalyser("local");
  if (voiceLocalStream) voiceLocalStream.getTracks().forEach(track => track.stop());
  voiceLocalStream = null;
  voicePttKeyboardHeld = false;
  voicePttControllerHeld = false;
  voicePttTouchHeld = false;
}


function toggleVoice() {
  return voiceActive ? stopVoice() : startVoice();
}

function setVoiceMuted(next) {
  voiceMuted = !!next;
  localStorage.setItem("rlcss_voice_muted", voiceMuted ? "1" : "0");
  updateVoiceTransmitState();
  publishVoicePresence();
  updateVoiceUi();
  updateAiCommandUi();
}

function toggleVoiceMuted() {
  setVoiceMuted(!voiceMuted);
}

async function sendVoiceSignal(targetUid, payload) {
  if (!db || !lobbyCode || !uid || !targetUid) return;
  const signalRef = push(voiceRef(lobbyCode, `signals/${targetUid}`));
  await set(signalRef, {
    ...payload,
    from: uid,
    clientTime: Date.now(),
    createdAt: serverTimestamp()
  });
}

async function createVoicePeer(remoteId, makeOffer = false) {
  if (!voiceLocalStream || voicePeers.has(remoteId) || !voicePeerEligible(remoteId)) return voicePeers.get(remoteId);
  const pc = new RTCPeerConnection(voiceIceConfig());
  const peer = { id: remoteId, pc, audio: null };
  voicePeers.set(remoteId, peer);

  voiceLocalStream.getTracks().forEach(track => pc.addTrack(track, voiceLocalStream));

  pc.onicecandidate = event => {
    if (event.candidate) sendVoiceSignal(remoteId, { type: "candidate", candidate: event.candidate.toJSON() }).catch(() => {});
  };
  pc.ontrack = event => {
    const stream = event.streams?.[0];
    if (!stream) return;
    if (!peer.audio) {
      const audio = document.createElement("audio");
      audio.autoplay = true;
      audio.playsInline = true;
      audio.dataset.voicePeer = remoteId;
      audio.volume = clamp(Number(audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume), 0, 1);
      audio.style.display = "none";
      document.body.appendChild(audio);
      peer.audio = audio;
    }
    peer.audio.srcObject = stream;
    applyVoiceOutputDevice(peer.audio);
    attachVoiceAnalyser(remoteId, stream);
    peer.audio.play?.().catch(() => {});
  };
  pc.onconnectionstatechange = () => {
    if (["failed", "closed", "disconnected"].includes(pc.connectionState)) {
      window.setTimeout(() => {
        const current = voicePeers.get(remoteId);
        if (current?.pc === pc && ["failed", "closed", "disconnected"].includes(pc.connectionState)) closeVoicePeer(remoteId, true);
      }, pc.connectionState === "disconnected" ? 4000 : 400);
    }
    updateVoiceUi();
  updateAiCommandUi();
  };

  if (makeOffer) {
    const offer = await pc.createOffer({ offerToReceiveAudio: true });
    await pc.setLocalDescription(offer);
    await sendVoiceSignal(remoteId, { type: "offer", sdp: pc.localDescription.toJSON() });
  }
  updateVoiceUi();
  updateAiCommandUi();
  return peer;
}

async function handleVoiceSignal(signalId, signal) {
  if (!signal || !signal.from || signal.from === uid) {
    if (lobbyCode && uid && signalId) remove(voiceRef(lobbyCode, `signals/${uid}/${signalId}`)).catch(() => {});
    return;
  }
  if (!voiceActive || currentMeta?.voiceScope === "off") {
    if (lobbyCode && uid && signalId) remove(voiceRef(lobbyCode, `signals/${uid}/${signalId}`)).catch(() => {});
    return;
  }
  const from = signal.from;
  try {
    if (signal.type === "leave") {
      closeVoicePeer(from, true);
      return;
    }
    if (signal.type === "offer") {
      const peer = voicePeers.get(from) || await createVoicePeer(from, false);
      if (!peer || !voicePeerEligible(from)) return;
      await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);
      await sendVoiceSignal(from, { type: "answer", sdp: peer.pc.localDescription.toJSON() });
    } else if (signal.type === "answer") {
      const peer = voicePeers.get(from);
      if (peer && !peer.pc.currentRemoteDescription) await peer.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    } else if (signal.type === "candidate") {
      const peer = voicePeers.get(from);
      if (peer && signal.candidate) await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch(() => {});
    }
  } finally {
    if (lobbyCode && uid && signalId) remove(voiceRef(lobbyCode, `signals/${uid}/${signalId}`)).catch(() => {});
  }
}

function closeVoicePeer(remoteId, keepPresence = false) {
  const peer = voicePeers.get(remoteId);
  if (!peer) return;
  try { peer.pc.onicecandidate = null; peer.pc.ontrack = null; peer.pc.close(); } catch (_) {}
  if (peer.audio) {
    try { peer.audio.srcObject = null; peer.audio.remove(); } catch (_) {}
  }
  detachVoiceAnalyser(remoteId);
  voicePeers.delete(remoteId);
  if (!keepPresence && voicePresence?.[remoteId]) delete voicePresence[remoteId];
  updateVoiceUi();
  updateAiCommandUi();
}

function closeAllVoicePeers() {
  for (const remoteId of Array.from(voicePeers.keys())) closeVoicePeer(remoteId, true);
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
  const running = currentMeta?.status === "running";
  const showAccount = which === "account";
  const showMode = which === "mode" && !lobbyCode;
  const showTournament = which === "tournament";
  const showLeaderboard = which === "leaderboard";
  const showSettings = which === "settings";
  if (!showSettings) closeAiCommandHelp();
  if (running) {
    document.body.classList.toggle("settings-open", showSettings && !!currentMeta?.paused);
    if (ui.setup) ui.setup.classList.add("hidden");
    if (ui.lobby) ui.lobby.classList.add("hidden");
    if (ui.gameMode) ui.gameMode.classList.add("hidden");
    if (ui.tournamentCard) ui.tournamentCard.classList.add("hidden");
    if (ui.accountCard) ui.accountCard.classList.add("hidden");
    if (ui.leaderboardCard) ui.leaderboardCard.classList.add("hidden");
    if (ui.settingsCard) ui.settingsCard.classList.toggle("hidden", !showSettings || !currentMeta?.paused);
    if (showSettings) { renderSettingsUi(); setSettingsTab(activeSettingsTab); }
    setTimeout(focusFirstMenuElement, 0);
    return;
  }
  settingsOpenedFromPause = false;
  document.body.classList.toggle("settings-open", showSettings);
  if (lobbyCode && !showSettings) hideModeChoicePanels();
  if (ui.setup) ui.setup.classList.toggle("hidden", showAccount || showMode || showTournament || showLeaderboard || showSettings || !!lobbyCode);
  if (ui.gameMode) ui.gameMode.classList.toggle("hidden", !showMode);
  if (ui.tournamentCard) ui.tournamentCard.classList.toggle("hidden", !showTournament);
  if (ui.accountCard) ui.accountCard.classList.toggle("hidden", !showAccount);
  if (ui.leaderboardCard) ui.leaderboardCard.classList.toggle("hidden", !showLeaderboard);
  if (ui.settingsCard) ui.settingsCard.classList.toggle("hidden", !showSettings);
  if (showLeaderboard) {
    if (!leaderboardLoaded && ui.leaderboardList) ui.leaderboardList.textContent = firebaseReady ? "Loading leaderboard…" : "Connect Firebase to load the leaderboard.";
    startLeaderboardListener();
  }
  if (showAccount && ui.accountUsername && !ui.accountUsername.value) ui.accountUsername.value = normalizeUsername(ui.name?.value || accountProfile?.username || "");
  if (showAccount && ui.accountDisplayName && isAccountUser()) ui.accountDisplayName.value = accountName();
  if (showAccount) updateAccountUi();
  if (showSettings) { renderSettingsUi(); setSettingsTab(activeSettingsTab); }
  setTimeout(focusFirstMenuElement, 0);
}

// UI events
ui.single.addEventListener("click", safeUi(() => openSingleSetup("single"), "Single player setup"));
ui.create.addEventListener("click", safeUi(createLobby, "Create lobby"));
ui.join.addEventListener("click", safeUi(joinLobby, "Join lobby"));
ui.joinCode.addEventListener("input", () => ui.joinCode.value = ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
if (ui.name) ui.name.addEventListener("input", () => {
  if (isAccountUser()) {
    ui.name.value = accountName();
    return;
  }
  playerName = sanitizeName(ui.name.value);
  localStorage.setItem("rlcss_online_name", playerName);
});
if (ui.openAccount) ui.openAccount.addEventListener("click", () => showMenuPanel("account"));
if (ui.closeAccount) ui.closeAccount.addEventListener("click", () => showMenuPanel("setup"));
if (ui.openSettings) ui.openSettings.addEventListener("click", () => openSettingsPanel(false));
if (ui.closeSettings) ui.closeSettings.addEventListener("click", closeSettingsPanel);
document.querySelectorAll("[data-settings-tab]").forEach(btn => btn.addEventListener("click", () => setSettingsTab(btn.dataset.settingsTab)));
if (ui.openLeaderboard) ui.openLeaderboard.addEventListener("click", () => showMenuPanel("leaderboard"));
if (ui.openModeMenu) ui.openModeMenu.addEventListener("click", safeUi(openGameModeMenu, "Open game mode menu"));
if (ui.modeMenuBack) ui.modeMenuBack.addEventListener("click", () => showMenuPanel("setup"));
if (ui.quickMatch) ui.quickMatch.addEventListener("click", safeUi(startQuickMatch, "Quick match"));
if (ui.tournamentMode) ui.tournamentMode.addEventListener("click", safeUi(beginTournamentSetup, "Tournament mode"));
if (ui.tournamentContinue) ui.tournamentContinue.addEventListener("click", safeUi(continueTournament, "Continue tournament"));
if (ui.tournamentExit) ui.tournamentExit.addEventListener("click", safeUi(endTournament, "End tournament"));
if (ui.closeLeaderboard) ui.closeLeaderboard.addEventListener("click", () => showMenuPanel("setup"));
if (ui.createAccount) ui.createAccount.addEventListener("click", safeUi(createAccount, "Create account"));
if (ui.signInAccount) ui.signInAccount.addEventListener("click", safeUi(signInAccount, "Sign in account"));
if (ui.changePasswordAccount) ui.changePasswordAccount.addEventListener("click", safeUi(changeAccountPassword, "Change password"));
if (ui.saveDisplayNameAccount) ui.saveDisplayNameAccount.addEventListener("click", safeUi(saveDisplayName, "Save display name"));
if (ui.signOutAccount) ui.signOutAccount.addEventListener("click", safeUi(signOutAccount, "Sign out account"));
if (ui.accountUsername) ui.accountUsername.addEventListener("input", () => { ui.accountUsername.value = normalizeUsername(ui.accountUsername.value); });
if (ui.accountDisplayName) ui.accountDisplayName.addEventListener("input", () => { ui.accountDisplayName.value = sanitizeName(ui.accountDisplayName.value); });
if (ui.keybindList) ui.keybindList.addEventListener("click", e => {
  const btn = e.target.closest("[data-bind-action]");
  if (!btn) return;
  pendingKeyBind = btn.dataset.bindAction;
  suppressControllerNav(12000);
  btn.textContent = "Press a key…";
  btn.classList.add("listening");
});
if (ui.resetKeybinds) ui.resetKeybinds.addEventListener("click", () => {
  const reset = defaultBindings();
  Object.keys(bindings).forEach(key => delete bindings[key]);
  Object.assign(bindings, reset);
  saveBindings();
});
if (ui.fovRange) ui.fovRange.addEventListener("input", () => {
  cameraFov = clamp(Number(ui.fovRange.value) || DEFAULT_FOV, 55, 100);
  localStorage.setItem("rlcss_camera_fov", String(cameraFov));
  if (ui.fovValue) ui.fovValue.textContent = `${Math.round(cameraFov)}°`;
  applyCameraSettings();
  queueSettingsSave();
});
if (ui.settingsPitchSize) ui.settingsPitchSize.addEventListener("change", () => {
  gameSettings.pitchSize = ui.settingsPitchSize.value;
  saveGameSettingsLocal();
  applyGameSettingsToSelectors({ forceLobbyDefaults: !lobbyCode });
  queueSettingsSave();
});
if (ui.settingsMatchLength) ui.settingsMatchLength.addEventListener("change", () => {
  gameSettings.matchLength = Number(ui.settingsMatchLength.value) || DEFAULT_META.matchLength;
  saveGameSettingsLocal();
  applyGameSettingsToSelectors({ forceLobbyDefaults: !lobbyCode });
  queueSettingsSave();
});
function saveAudioSettingsLocal() {
  audioSettings = sanitiseAudioSettings(audioSettings);
  localStorage.setItem("rlcss_audio_settings", JSON.stringify(audioSettings));
}
function commitAudioSettings({ play = true } = {}) {
  saveAudioSettingsLocal();
  SFX.setVolume(audioSettings.gameVolume);
  applyAllVoiceAudioSettings();
  Music.applySettings(play);
  renderSettingsUi();
  queueSettingsSave();
}
if (ui.gameVolume) ui.gameVolume.addEventListener("input", () => {
  audioSettings.gameVolume = clamp(Number(ui.gameVolume.value), 0, 1);
  if (ui.gameVolumeValue) ui.gameVolumeValue.textContent = `${Math.round(audioSettings.gameVolume * 100)}%`;
  SFX.setVolume(audioSettings.gameVolume);
  commitAudioSettings({ play: false });
});
if (ui.musicVolume) ui.musicVolume.addEventListener("input", () => {
  audioSettings.musicVolume = clamp(Number(ui.musicVolume.value), 0, 1);
  if (ui.musicVolumeValue) ui.musicVolumeValue.textContent = `${Math.round(audioSettings.musicVolume * 100)}%`;
  commitAudioSettings({ play: true });
});
if (ui.musicEnabled) ui.musicEnabled.addEventListener("change", () => {
  audioSettings.musicEnabled = !!ui.musicEnabled.checked;
  commitAudioSettings({ play: true });
});
if (ui.voiceVolume) ui.voiceVolume.addEventListener("input", () => {
  audioSettings.voiceVolume = clamp(Number(ui.voiceVolume.value), 0, 1);
  if (ui.voiceVolumeValue) ui.voiceVolumeValue.textContent = `${Math.round(audioSettings.voiceVolume * 100)}%`;
  commitAudioSettings({ play: false });
});
if (ui.voiceMicSensitivity) ui.voiceMicSensitivity.addEventListener("input", () => {
  audioSettings.voiceMicSensitivity = clamp(Number(ui.voiceMicSensitivity.value), 0, 1);
  if (ui.voiceMicSensitivityValue) ui.voiceMicSensitivityValue.textContent = sensitivityLabel(audioSettings.voiceMicSensitivity);
  commitAudioSettings({ play: false });
  renderActiveSpeakers();
});
if (ui.voiceSpeakerMode) ui.voiceSpeakerMode.addEventListener("change", () => {
  audioSettings.voiceSpeakerMode = ui.voiceSpeakerMode.value;
  commitAudioSettings({ play: false });
  renderActiveSpeakers();
});
if (ui.voiceActivationMode) ui.voiceActivationMode.addEventListener("change", () => {
  audioSettings.voiceActivationMode = ui.voiceActivationMode.value;
  commitAudioSettings({ play: false });
  updateVoiceTransmitState();
});
if (ui.voiceInputDevice) ui.voiceInputDevice.addEventListener("change", () => {
  audioSettings.voiceInputDeviceId = ui.voiceInputDevice.value || "";
  commitAudioSettings({ play: false });
  if (voiceActive) setStatus("Mic device changed. Rejoin voice chat to use the new microphone.");
});
if (ui.voiceOutputDevice) ui.voiceOutputDevice.addEventListener("change", () => {
  audioSettings.voiceOutputDeviceId = ui.voiceOutputDevice.value || "";
  commitAudioSettings({ play: false });
  for (const peer of voicePeers.values()) if (peer.audio) { applyVoiceOutputDevice(peer.audio); peer.audio.volume = clamp(Number(audioSettings.voiceVolume ?? DEFAULT_AUDIO_SETTINGS.voiceVolume), 0, 1); }
});
if (ui.refreshAudioDevices) ui.refreshAudioDevices.addEventListener("click", safeUi(() => refreshAudioDevices({ requestPermission: true }), "Refresh audio devices"));
if (navigator.mediaDevices?.addEventListener) navigator.mediaDevices.addEventListener("devicechange", () => refreshAudioDevices({ requestPermission: false }).catch(() => {}));
if (ui.voiceTestPlayback) ui.voiceTestPlayback.addEventListener("click", safeUi(runVoiceSelfTest, "Voice playback test"));
if (ui.musicTrackSelect) ui.musicTrackSelect.addEventListener("change", () => {
  audioSettings.musicTrack = ui.musicTrackSelect.value;
  commitAudioSettings({ play: true });
});
if (ui.musicTrackToggles) ui.musicTrackToggles.addEventListener("change", e => {
  const input = e.target.closest("[data-music-track-toggle]");
  if (!input) return;
  audioSettings.enabledTracks = { ...defaultTrackEnablement(), ...(audioSettings.enabledTracks || {}) };
  audioSettings.enabledTracks[input.dataset.musicTrackToggle] = !!input.checked;
  if (audioSettings.musicTrack !== "shuffle" && audioSettings.enabledTracks[audioSettings.musicTrack] === false) audioSettings.musicTrack = "shuffle";
  commitAudioSettings({ play: true });
});
if (ui.previewMusic) ui.previewMusic.addEventListener("click", () => {
  SFX.resume();
  Music.togglePreview();
  queueSettingsSave();
});
if (ui.previousMusic) ui.previousMusic.addEventListener("click", () => {
  SFX.resume();
  Music.previous();
  queueSettingsSave();
});
if (ui.nextMusic) ui.nextMusic.addEventListener("click", () => {
  SFX.resume();
  Music.next(false);
  queueSettingsSave();
});
if (ui.menuMusicToggle) ui.menuMusicToggle.addEventListener("click", () => Music.toggleDock());
if (ui.menuMusicPrev) ui.menuMusicPrev.addEventListener("click", () => { SFX.resume(); Music.previous(); });
if (ui.menuMusicNext) ui.menuMusicNext.addEventListener("click", () => { SFX.resume(); Music.next(false); });
if (ui.menuMusicPlay) ui.menuMusicPlay.addEventListener("click", () => { SFX.resume(); Music.togglePreview(); });
if (ui.controllerEnabled) ui.controllerEnabled.addEventListener("change", () => {
  controllerSettings.enabled = !!ui.controllerEnabled.checked;
  saveControllerSettings();
});
if (ui.controllerDeadzone) ui.controllerDeadzone.addEventListener("input", () => {
  controllerSettings.deadzone = clamp(Number(ui.controllerDeadzone.value) || DEFAULT_CONTROLLER.deadzone, 0.05, 0.35);
  if (ui.controllerDeadzoneValue) ui.controllerDeadzoneValue.textContent = controllerSettings.deadzone.toFixed(2);
  saveControllerSettings();
});
if (ui.controllerPanSensitivity) ui.controllerPanSensitivity.addEventListener("input", () => {
  controllerSettings.panSensitivity = clamp(Number(ui.controllerPanSensitivity.value) || DEFAULT_CONTROLLER.panSensitivity, 0.5, 1.5);
  if (ui.controllerPanSensitivityValue) ui.controllerPanSensitivityValue.textContent = `${controllerSettings.panSensitivity.toFixed(2)}x`;
  saveControllerSettings();
});
if (ui.controllerBindList) ui.controllerBindList.addEventListener("change", e => {
  const sel = e.target.closest("[data-controller-bind]");
  if (!sel || sel.value === "") return;
  controllerSettings[sel.dataset.controllerBind] = Number(sel.value);
  saveControllerSettings();
});
if (ui.controllerBindList) ui.controllerBindList.addEventListener("click", e => {
  const btn = e.target.closest("[data-controller-detect]");
  if (!btn) return;
  startControllerBindDetect(btn.dataset.controllerDetect, btn.dataset.controllerType || "button");
});
if (ui.resetController) ui.resetController.addEventListener("click", () => {
  controllerSettings = { ...DEFAULT_CONTROLLER };
  saveControllerSettings();
});
ui.copy.addEventListener("click", () => { if (!isSinglePlayer) navigator.clipboard?.writeText(lobbyCode || ""); });
ui.leaveLobby.addEventListener("click", safeUi(() => leaveToMenu("Left lobby."), "Leave lobby"));
if (ui.leaveGame) ui.leaveGame.addEventListener("click", safeUi(() => leaveToMenu("Left match."), "Leave match"));
if (ui.pauseGame) ui.pauseGame.addEventListener("click", safeUi(togglePause, "Toggle pause"));
if (ui.pauseResume) ui.pauseResume.addEventListener("click", safeUi(togglePause, "Resume match"));
if (ui.pauseLeave) ui.pauseLeave.addEventListener("click", safeUi(() => leaveToMenu("Left match."), "Leave match"));
if (ui.pauseOpenSettings) ui.pauseOpenSettings.addEventListener("click", () => openSettingsPanel(true));
if (ui.toggleChat) ui.toggleChat.addEventListener("click", safeUi(toggleChatOpen, "Toggle chat"));
if (ui.toggleVoice) ui.toggleVoice.addEventListener("click", safeUi(toggleVoice, "Toggle voice"));
if (ui.muteVoice) {
  ui.muteVoice.addEventListener("click", safeUi(() => {
    if (!isPushToTalkMode()) toggleVoiceMuted();
  }, "Toggle microphone"));
  ui.muteVoice.addEventListener("pointerdown", e => {
    if (!isPushToTalkMode()) return;
    e.preventDefault();
    ui.muteVoice.setPointerCapture?.(e.pointerId);
    setVoicePttHeld("touch", true);
  });
  const releasePtt = e => {
    if (!isPushToTalkMode()) return;
    setVoicePttHeld("touch", false);
  };
  ui.muteVoice.addEventListener("pointerup", releasePtt);
  ui.muteVoice.addEventListener("pointercancel", releasePtt);
  ui.muteVoice.addEventListener("pointerleave", releasePtt);
}
ui.ready.addEventListener("click", () => {
  if (isSinglePlayer) startSoloMatch();
  else updateLocalPlayer({ ready: !(currentPlayers[activePlayerId()]?.ready) });
});
ui.team.addEventListener("change", () => { updateVehiclePreview(true); updateLocalPlayer({ team: ui.team.value, ready: false }); });
ui.role.addEventListener("change", () => updateLocalPlayer({ role: ui.role.value, ready: false }));
if (ui.vehicle) ui.vehicle.addEventListener("change", () => { updateVehiclePreview(true); updateLocalPlayer({ model: ui.vehicle.value, ready: false }); });
ui.mode.addEventListener("change", () => updateMetaPatch({ mode: ui.mode.value }));
if (ui.theme) ui.theme.addEventListener("change", () => updateMetaPatch({ theme: ui.theme.value }));
ui.teamSize.addEventListener("change", () => updateMetaPatch({ teamSize: Number(ui.teamSize.value) }));
if (ui.pitchSize) ui.pitchSize.addEventListener("change", () => {
  gameSettings.pitchSize = ui.pitchSize.value;
  saveGameSettingsLocal();
  queueSettingsSave();
  updateMetaPatch({ pitchSize: ui.pitchSize.value });
});
if (ui.matchLength) ui.matchLength.addEventListener("change", () => {
  if (ui.customMatchMinutes) ui.customMatchMinutes.value = "";
  gameSettings.matchLength = Number(ui.matchLength.value) || DEFAULT_META.matchLength;
  saveGameSettingsLocal();
  queueSettingsSave();
  updateMetaPatch({ matchLength: gameSettings.matchLength });
});
ui.difficulty.addEventListener("change", () => updateMetaPatch({ difficulty: ui.difficulty.value }));
ui.playstyle.addEventListener("change", () => updateMetaPatch({ playstyle: ui.playstyle.value }));
if (ui.aiStrategy) ui.aiStrategy.addEventListener("change", () => updateMetaPatch({ aiStrategy: ui.aiStrategy.value }));
if (ui.chatScope) ui.chatScope.addEventListener("change", () => updateMetaPatch({ chatScope: ui.chatScope.value }));
if (ui.voiceScope) ui.voiceScope.addEventListener("change", () => updateMetaPatch({ voiceScope: ui.voiceScope.value }));
for (const el of [ui.customMatchMinutes, ui.halfTimeEnabled, ui.hydrationEnabled, ui.overtimeEnabled, ui.goldenGoalEnabled, ui.overtimeDuration, ui.tournamentMatchCount, ui.tournamentIndividualLengths, ui.tournamentFinalLonger, ui.tournamentFinalLength]) {
  if (el) el.addEventListener("change", () => { saveRuleSettingsFromSetup(); renderTournamentScheduleOptions(); updateMetaPatch(currentSoloMetaPatch()); });
}
if (ui.tournamentLengthList) ui.tournamentLengthList.addEventListener("change", renderTournamentScheduleOptions);

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

if (ui.advancedAiList) ui.advancedAiList.addEventListener("change", e => {
  const sel = e.target.closest(".advanced-ai-control");
  if (!sel || !currentMeta || (!isSinglePlayer && currentMeta.hostId !== activePlayerId())) return;
  const team = sel.dataset.aiTeam;
  const slot = Number(sel.dataset.aiSlot);
  const field = sel.dataset.aiField;
  if (!team || !Number.isFinite(slot) || !field) return;
  if (field === "role") {
    const roles = JSON.parse(JSON.stringify(currentMeta.aiRoles || { blue: {}, orange: {} }));
    if (!roles[team]) roles[team] = {};
    roles[team][slot] = sel.value;
    updateMetaPatch({ aiRoles: roles });
    return;
  }
  const tuning = JSON.parse(JSON.stringify(currentMeta.aiTuning || { blue: {}, orange: {} }));
  if (!tuning[team]) tuning[team] = {};
  if (!tuning[team][slot]) tuning[team][slot] = {};
  tuning[team][slot][field] = sel.value;
  updateMetaPatch({ aiTuning: tuning });
});

window.addEventListener("keydown", e => {
  SFX.resume();
  Music.unlockAndMaybePlay();
  if (pendingKeyBind) {
    e.preventDefault();
    bindings[pendingKeyBind] = e.code;
    pendingKeyBind = null;
    suppressControllerNav(700);
    saveBindings();
    return;
  }
  if (e.code === "Escape") {
    if (ui.aiCommandHelp && !ui.aiCommandHelp.classList.contains("hidden")) {
      closeAiCommandHelp();
      return;
    }
    if (ui.settingsCard && !ui.settingsCard.classList.contains("hidden")) {
      closeSettingsPanel();
      return;
    }
  }
  const tag = (e.target?.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;
  SFX.resume();
  if ([bindings.forward, bindings.backward, bindings.left, bindings.right, bindings.boost, bindings.jump, bindings.drift].includes(e.code)) e.preventDefault();
  if (e.code === bindings.pause) {
    togglePause();
    return;
  }
  if (e.code === bindings.chat) {
    toggleChatOpen();
    return;
  }
  if (e.code === bindings.voice) {
    toggleVoice();
    return;
  }
  if (e.code === bindings.aiCommand) { if (canUseAiCommandsInMatch()) { e.preventDefault(); aiCommandPressStarted = Date.now(); aiCommandPressTimer = setTimeout(() => startAiCommandRecording(), 260); } return; }
  if (e.code === bindings.mic) {
    if (isPushToTalkMode()) {
      e.preventDefault();
      setVoicePttHeld("keyboard", true);
    } else {
      toggleVoiceMuted();
    }
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
  if (e.code === bindings.aiCommand) { clearTimeout(aiCommandPressTimer); if (Date.now() - aiCommandPressStarted < 260) setAiCommandWheel(!aiCommandWheelOpen); stopAiCommandRecording(); }
  if (e.code === bindings.mic && isPushToTalkMode()) setVoicePttHeld("keyboard", false);
  if (e.code === bindings.cam) camKeyLatch = false;
});
if (ui.aiCommandWheel) ui.aiCommandWheel.addEventListener("click", e => { const btn = e.target.closest("[data-ai-intent]"); if (btn) { issueAiCommand(btn.dataset.aiIntent, "quick"); setAiCommandWheel(false); } });
[ui.aiCommandsEnabled, ui.aiCommandInputMode, ui.aiCommandServerAi, ui.aiCommandServerStt, ui.aiCommandLanguage, ui.aiCommandTranscript, ui.aiCommandAcks, ui.aiCommandTimeout, ui.aiCommandStrength, ui.aiCommandStoreHistory, ui.aiCommandSendAmbiguous, ui.aiCommandSendVoice, ui.aiCommandSmarterOpponents].forEach(el => el && el.addEventListener("change", saveAiCommandSettingsFromUi));
if (ui.aiCommandHelpOpen) ui.aiCommandHelpOpen.addEventListener("click", () => ui.aiCommandHelp?.classList.remove("hidden"));
if (ui.aiCommandHelpClose) ui.aiCommandHelpClose.addEventListener("click", closeAiCommandHelp);
if (ui.aiCommandHelp) ui.aiCommandHelp.addEventListener("click", e => { if (e.target === ui.aiCommandHelp) closeAiCommandHelp(); });
if (ui.aiCommandButton) { ui.aiCommandButton.addEventListener("click", () => setAiCommandWheel(!aiCommandWheelOpen)); ui.aiCommandButton.addEventListener("pointerdown", () => { if (!canUseAiCommandsInMatch()) return; aiCommandPressStarted = Date.now(); aiCommandPressTimer = setTimeout(() => startAiCommandRecording(), 320); }); ui.aiCommandButton.addEventListener("pointerup", () => { clearTimeout(aiCommandPressTimer); stopAiCommandRecording(); }); }
if (ui.mobileAiCommand) { ui.mobileAiCommand.addEventListener("click", () => setAiCommandWheel(!aiCommandWheelOpen)); ui.mobileAiCommand.addEventListener("pointerdown", () => { if (!canUseAiCommandsInMatch()) return; aiCommandPressTimer = setTimeout(() => startAiCommandRecording(), 320); }); ui.mobileAiCommand.addEventListener("pointerup", () => { clearTimeout(aiCommandPressTimer); stopAiCommandRecording(); }); }
if (ui.pauseAiCommand) { ui.pauseAiCommand.addEventListener("click", () => setAiCommandWheel(!aiCommandWheelOpen)); ui.pauseAiCommand.addEventListener("pointerdown", () => { if (!canUseAiCommandsInMatch()) return; aiCommandPressStarted = Date.now(); aiCommandPressTimer = setTimeout(() => startAiCommandRecording(), 320); }); ui.pauseAiCommand.addEventListener("pointerup", () => { clearTimeout(aiCommandPressTimer); stopAiCommandRecording(); }); }

window.addEventListener("gamepadconnected", () => { renderSettingsUi(); setSettingsSyncStatus("Controller detected."); });
window.addEventListener("gamepaddisconnected", () => { renderSettingsUi(); setSettingsSyncStatus("Controller disconnected."); });
["pointerdown", "touchstart", "click"].forEach(type => window.addEventListener(type, () => { SFX.resume(); Music.unlockAndMaybePlay(); }, { passive: true }));

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
    mobileInput.yawLeft = Math.max(0, -nx); mobileInput.yawRight = Math.max(0, nx);
    mobileInput.pitchUp = Math.max(0, ny); mobileInput.pitchDown = Math.max(0, -ny);
    knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    zone.classList.add("active");
  }
  function resetStick() {
    activeId = null;
    mobileInput.steer = 0;
    mobileInput.throttle = 0;
    mobileInput.pitchUp = 0; mobileInput.pitchDown = 0; mobileInput.yawLeft = 0; mobileInput.yawRight = 0;
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
    mobileInput.airRollLeft = false; mobileInput.airRollRight = false;
    activeAction = null;
    actionZones.forEach(el => el.classList.remove("active"));
  }

  function setActionFromPoint(clientX, clientY, force = false) {
    const zoneEl = zoneForPoint(clientX, clientY);
    const next = zoneEl?.dataset.action || null;
    if (!force && next === activeAction) return;

    mobileInput.boost = false;
    mobileInput.drift = false;
    mobileInput.airRollLeft = false; mobileInput.airRollRight = false;
    actionZones.forEach(el => el.classList.toggle("active", el === zoneEl));
    activeAction = next;

    if (next === "boost") mobileInput.boost = true;
    else if (next === "drift") mobileInput.drift = true;
    else if (next === "airRollLeft") mobileInput.airRollLeft = true;
    else if (next === "airRollRight") mobileInput.airRollRight = true;
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
const camera = new THREE.PerspectiveCamera(cameraFov, 1, 0.1, 1200);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
renderer.setPixelRatio(desiredPixelRatio());
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputEncoding = THREE.sRGBEncoding;

const ambient = new THREE.AmbientLight(0xffffff, 0.58);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(40, 75, 35);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);
const stadiumHemi = new THREE.HemisphereLight(0xbfefff, 0x05070d, 0.32);
scene.add(stadiumHemi);
const blueRimLight = new THREE.DirectionalLight(0x12b9ff, 0.34);
blueRimLight.position.set(-55, 26, -42);
scene.add(blueRimLight);
const orangeRimLight = new THREE.DirectionalLight(0xff8a1f, 0.30);
orangeRimLight.position.set(55, 24, 46);
scene.add(orangeRimLight);

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
let arenaScoreboard = null;
let ballMesh = null;
const carMeshes = new Map();
const boostPadMeshes = new Map();
const nameSprites = new Map();
const boostTrailMeshes = new Map();
const ballTrail = [];
const menuDemo = new THREE.Group();
scene.add(menuDemo);
let menuDemoBuilt = false;
let menuDemoThemeApplied = false;
const menuDemoCars = [];

function disposeMaterial(mat) {
  if (!mat) return;
  for (const key of ["map", "emissiveMap", "alphaMap", "bumpMap", "normalMap", "roughnessMap", "metalnessMap"]) {
    if (mat[key]?.dispose) mat[key].dispose();
  }
  if (mat.dispose) mat.dispose();
}

function disposeSceneObject(root) {
  root.traverse?.(obj => {
    if (obj.geometry?.dispose) obj.geometry.dispose();
    if (Array.isArray(obj.material)) obj.material.forEach(disposeMaterial);
    else disposeMaterial(obj.material);
  });
}

function clearWorld() {
  for (const child of [...world.children]) {
    disposeSceneObject(child);
    world.remove(child);
  }
}

function makeMenuDemoFieldTexture() {
  const cnv = document.createElement("canvas");
  cnv.width = 1024;
  cnv.height = 1024;
  const ctx = cnv.getContext("2d");
  const grass = ctx.createLinearGradient(0, 0, 0, cnv.height);
  grass.addColorStop(0, "#0b2d24");
  grass.addColorStop(0.48, "#08241d");
  grass.addColorStop(1, "#0d2a1b");
  ctx.fillStyle = grass;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.045)";
    ctx.fillRect(0, i * cnv.height / 18, cnv.width, cnv.height / 18);
  }
  const line = "rgba(248,251,255,0.74)";
  ctx.strokeStyle = line;
  ctx.lineWidth = 7;
  ctx.strokeRect(66, 66, 892, 892);
  ctx.beginPath();
  ctx.moveTo(66, 512);
  ctx.lineTo(958, 512);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(512, 512, 96, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(24,200,255,0.72)";
  ctx.strokeRect(312, 66, 400, 118);
  ctx.strokeStyle = "rgba(255,138,31,0.72)";
  ctx.strokeRect(312, 840, 400, 118);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.075)";
  for (let x = 84; x < 960; x += 52) {
    ctx.beginPath();
    ctx.moveTo(x, 76);
    ctx.lineTo(x - 34, 948);
    ctx.stroke();
  }
  ctx.save();
  ctx.globalAlpha = 0.18;
  const blue = ctx.createLinearGradient(0, 0, cnv.width, 0);
  blue.addColorStop(0, "#18c8ff");
  blue.addColorStop(1, "transparent");
  ctx.fillStyle = blue;
  ctx.fillRect(0, 0, cnv.width, 180);
  const orange = ctx.createLinearGradient(0, 0, cnv.width, 0);
  orange.addColorStop(0, "transparent");
  orange.addColorStop(1, "#ff8a22");
  ctx.fillStyle = orange;
  ctx.fillRect(0, cnv.height - 180, cnv.width, 180);
  ctx.restore();
  const tex = new THREE.CanvasTexture(cnv);
  tex.anisotropy = isPhonePortrait() ? 2 : 4;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function buildMenuDemo() {
  if (menuDemoBuilt) return;
  menuDemoBuilt = true;

  const fieldMat = new THREE.MeshStandardMaterial({
    map: makeMenuDemoFieldTexture(),
    roughness: 0.72,
    metalness: 0.03
  });
  const field = new THREE.Mesh(new THREE.PlaneGeometry(142, 104), fieldMat);
  field.rotation.x = -Math.PI / 2;
  field.receiveShadow = true;
  menuDemo.add(field);

  const sideGlass = new THREE.MeshStandardMaterial({ color: 0x123049, emissive: 0x12b9ff, emissiveIntensity: 0.10, transparent: true, opacity: 0.28, roughness: 0.18, metalness: 0.16 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x12b9ff, emissive: 0x12b9ff, emissiveIntensity: 0.58, roughness: 0.28, metalness: 0.12 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff8a1f, emissive: 0xff8a1f, emissiveIntensity: 0.56, roughness: 0.30, metalness: 0.10 });
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x1b2738, roughness: 0.52, metalness: 0.28 });
  const standMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.84, metalness: 0.02 });
  const signMat = new THREE.MeshBasicMaterial({ map: makeStadiumScreenTexture(STADIUM_THEMES.neon || STADIUM_THEMES.v10, "RLCSS", 0x59ffd0), side: THREE.DoubleSide });

  const addBox = (w, h, d, x, y, z, mat, rotY = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    menuDemo.add(mesh);
    return mesh;
  };
  const addPlane = (w, h, x, y, z, mat, rotY = 0) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    menuDemo.add(mesh);
    return mesh;
  };

  for (const side of [-1, 1]) {
    addBox(144, 3.2, 1.4, 0, 1.8, side * 53, side < 0 ? blueMat : orangeMat);
    addBox(144, 9.5, 0.32, 0, 8.0, side * 53.4, sideGlass);
    addBox(156, 2.6, 6.8, 0, 3.2, side * 63, standMat);
    addBox(168, 2.2, 5.8, 0, 5.9, side * 69, standMat);
    for (let i = 0; i < 9; i++) {
      const x = -63 + i * 15.75;
      addBox(8.2, 1.15, 0.44, x, 2.2, side * 54.4, i % 2 ? orangeMat : blueMat);
      if (i % 3 === 1) addPlane(9.0, 2.6, x, 8.8, side * 62.2, signMat, side < 0 ? 0 : Math.PI);
    }
  }
  for (const side of [-1, 1]) {
    addBox(1.2, 11.4, 104, side * 71.6, 5.9, 0, sideGlass);
    addBox(5.0, 2.0, 118, side * 82.6, 4.2, 0, standMat);
    for (let i = 0; i < 7; i++) {
      const z = -42 + i * 14;
      addBox(0.42, 4.6, 4.6, side * 73.5, 7.2, z, i % 2 ? orangeMat : blueMat);
    }
  }

  const makeGoal = (side, mat) => {
    const group = new THREE.Group();
    const goalW = 28;
    const goalH = 9;
    const z = side * 52.8;
    const post = new THREE.CylinderGeometry(0.34, 0.34, goalH, 14);
    for (const x of [-goalW / 2, goalW / 2]) {
      const p = new THREE.Mesh(post, mat);
      p.position.set(x, goalH / 2, z);
      group.add(p);
    }
    const cross = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, goalW, 14), mat);
    cross.rotation.z = Math.PI / 2;
    cross.position.set(0, goalH, z);
    group.add(cross);
    const net = new THREE.Mesh(
      new THREE.PlaneGeometry(goalW, goalH),
      new THREE.MeshBasicMaterial({ color: mat.color, wireframe: true, transparent: true, opacity: 0.36, side: THREE.DoubleSide })
    );
    net.position.set(0, goalH / 2, side * 57.2);
    group.add(net);
    menuDemo.add(group);
  };
  makeGoal(-1, blueMat);
  makeGoal(1, orangeMat);

  const ball = new THREE.Group();
  const ballCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.25, 3),
    new THREE.MeshPhysicalMaterial({ color: 0xf8fbff, roughness: 0.26, metalness: 0.18, clearcoat: 0.45, clearcoatRoughness: 0.24, emissive: 0x1f2937, emissiveIntensity: 0.08 })
  );
  ballCore.castShadow = true;
  ball.add(ballCore);
  const ballRingMat = new THREE.MeshBasicMaterial({ color: 0x0b1020, transparent: true, opacity: 0.72 });
  for (const rot of [[0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0]]) {
    const seam = new THREE.Mesh(new THREE.TorusGeometry(2.32, 0.025, 8, 60), ballRingMat);
    seam.rotation.set(rot[0], rot[1], rot[2]);
    ball.add(seam);
  }
  ball.position.set(7, 2.45, -4);
  menuDemo.userData.ball = ball;
  menuDemo.add(ball);

  const makeHeroCar = (team, modelKey, phase, lane, speed) => {
    const cfg = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.default;
    const [bodyW, bodyH, bodyD] = cfg.body || VEHICLE_CONFIGS.default.body;
    const [cabinW, cabinH, cabinD] = cfg.cabin || VEHICLE_CONFIGS.default.cabin;
    const [cabinX, cabinY, cabinZ] = cfg.cabinOffset || VEHICLE_CONFIGS.default.cabinOffset;
    const g = new THREE.Group();
    const body = createRoundedBoxMesh(bodyW, bodyH, bodyD, 0.22, carMaterial(team, true, modelKey, true), 5);
    body.position.y = bodyH / 2;
    body.castShadow = true;
    const cabin = createRoundedBoxMesh(cabinW, cabinH, cabinD, 0.18, new THREE.MeshPhysicalMaterial({ color: 0x0a1019, roughness: 0.18, metalness: 0.42, clearcoat: 0.38 }), 5);
    cabin.position.set(cabinX, cabinY, cabinZ);
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(0.28, bodyW * 0.14), 0.055, bodyD * 0.84),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.82 })
    );
    stripe.position.set(0, bodyH + 0.048, 0.04);
    const wheelScale = cfg.wheelScale || 1;
    const wheelX = bodyW / 2 + 0.04;
    const wheelZ = bodyD * 0.34;
    g.add(
      createWheelMesh(-wheelX, -wheelZ, wheelScale),
      createWheelMesh(wheelX, -wheelZ, wheelScale),
      createWheelMesh(-wheelX, wheelZ, wheelScale),
      createWheelMesh(wheelX, wheelZ, wheelScale),
      body,
      cabin,
      stripe
    );
    addVehicleLighting(g, bodyW, bodyH, bodyD, team, modelKey, true);
    addAeroKit(g, bodyW, bodyH, bodyD, team, modelKey, true);
    const trail = new THREE.Group();
    const trailColor = team === "blue" ? 0x38d8ff : 0xff8a24;
    for (let i = 0; i < 5; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: trailColor, transparent: true, opacity: 0.22 * (1 - i / 5), depthWrite: false, blending: THREE.AdditiveBlending }));
      sprite.position.set(0, 0.62, -bodyD / 2 - 0.65 - i * 0.68);
      sprite.scale.set(1.1 + i * 0.26, 0.72 + i * 0.18, 1);
      trail.add(sprite);
    }
    g.add(trail);
    g.userData = { phase, lane, speed, trail, bodyD };
    menuDemoCars.push(g);
    menuDemo.add(g);
  };
  makeHeroCar("blue", "sport", 0.06, 0, 0.000185);
  makeHeroCar("orange", "muscle", 0.38, 1, 0.000174);
  makeHeroCar("blue", "rally", 0.64, 2, 0.000156);
  makeHeroCar("orange", "truck", 0.84, 3, 0.000148);

  const gantryMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 });
  for (const z of [-35, 0, 35]) {
    addBox(148, 0.18, 0.18, 0, 18.8, z, gantryMat);
    addBox(0.18, 8.2, 0.18, -68, 14.8, z, steelMat);
    addBox(0.18, 8.2, 0.18, 68, 14.8, z, steelMat);
  }

  menuDemo.visible = false;
}

function updateMenuDemo(now) {
  const pausedMidGame = document.body.classList.contains("game-running") && currentMeta?.paused;
  const active = !document.body.classList.contains("game-running") && !pausedMidGame;
  buildMenuDemo();
  menuDemo.visible = active;
  world.visible = !active;
  if (!active) {
    if (menuDemoThemeApplied) arenaSignature = "";
    menuDemoThemeApplied = false;
    return false;
  }
  if (!menuDemoThemeApplied) {
    applySceneTheme(STADIUM_THEMES.neon || STADIUM_THEMES.v10);
    menuDemoThemeApplied = true;
  }
  const t = now;
  for (let i = 0; i < menuDemoCars.length; i++) {
    const car = menuDemoCars[i];
    const a = (t * car.userData.speed + car.userData.phase) * Math.PI * 2;
    const rx = 48 + (car.userData.lane % 2) * 7;
    const rz = 28 + (car.userData.lane > 1 ? 6 : 0);
    const x = Math.cos(a) * rx;
    const z = Math.sin(a) * rz;
    const dx = -Math.sin(a) * rx;
    const dz = Math.cos(a) * rz;
    car.position.set(x, 0.02 + Math.sin(t * 0.004 + i) * 0.035, z);
    car.rotation.y = Math.atan2(dx, dz);
    car.rotation.z = Math.sin(a * 2 + i) * 0.035;
    car.rotation.x = Math.cos(a * 2.4 + i) * 0.025;
    if (car.userData.trail) {
      let j = 0;
      for (const sprite of car.userData.trail.children) {
        sprite.material.opacity = (0.26 - j * 0.035) * (0.76 + Math.sin(t * 0.008 + i + j) * 0.24);
        sprite.scale.set(1.1 + j * 0.28 + Math.sin(t * 0.012 + j) * 0.08, 0.72 + j * 0.18, 1);
        j++;
      }
    }
  }
  if (menuDemo.userData.ball) {
    const ball = menuDemo.userData.ball;
    ball.position.set(7 + Math.sin(t * 0.0016) * 3.8, 2.45 + Math.sin(t * 0.0031) * 0.34, -4 + Math.cos(t * 0.00135) * 3.2);
    ball.rotation.x += 0.018;
    ball.rotation.z += 0.014;
  }
  const camA = t * 0.000082;
  camera.position.set(-42 + Math.cos(camA) * 11, 19 + Math.sin(camA * 1.6) * 2.2, 54 + Math.sin(camA) * 9);
  camera.lookAt(3, 2.6, -5);
  return true;
}

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

function hexCss(value, alpha = 1) {
  const c = new THREE.Color(value ?? 0xffffff);
  const r = Math.round(c.r * 255);
  const g = Math.round(c.g * 255);
  const b = Math.round(c.b * 255);
  return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}

function makeStadiumScreenTexture(theme, title, accentHex) {
  const cnv = document.createElement("canvas");
  cnv.width = 512;
  cnv.height = 160;
  const ctx = cnv.getContext("2d");
  const accent = hexCss(accentHex ?? theme.accentA ?? 0x12b9ff);
  const accentSoft = hexCss(accentHex ?? theme.accentA ?? 0x12b9ff, 0.34);
  const orange = hexCss(theme.lightOrange ?? theme.accentB ?? 0xff8a1f, 0.78);
  const blue = hexCss(theme.lightBlue ?? theme.accentA ?? 0x12b9ff, 0.78);
  const grd = ctx.createLinearGradient(0, 0, cnv.width, cnv.height);
  grd.addColorStop(0, "#050814");
  grd.addColorStop(0.48, "#10172a");
  grd.addColorStop(1, "#050814");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = accentSoft;
  ctx.fillRect(0, 0, cnv.width, 10);
  ctx.fillRect(0, cnv.height - 10, cnv.width, 10);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i++) {
    const x = i * 58 - 28;
    ctx.beginPath();
    ctx.moveTo(x, cnv.height);
    ctx.lineTo(x + 74, 0);
    ctx.stroke();
  }
  ctx.font = "900 48px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f8fbff";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.fillText(title, cnv.width / 2, 64);
  ctx.shadowBlur = 0;
  ctx.font = "900 22px Arial, sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText("BOOST  //  BALL  //  GOAL", cnv.width / 2, 112);
  ctx.fillStyle = blue;
  ctx.fillRect(38, 130, 150, 8);
  ctx.fillStyle = orange;
  ctx.fillRect(cnv.width - 188, 130, 150, 8);
  const tex = new THREE.CanvasTexture(cnv);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = isPhonePortrait() ? 1 : 2;
  return tex;
}

function updateArenaScoreboard(state) {
  if (!arenaScoreboard?.materials?.length || !state?.score) return;
  const blue = Number(state.score.blue || 0);
  const orange = Number(state.score.orange || 0);
  const key = `${blue}:${orange}`;
  if (arenaScoreboard.key === key) return;
  const nextMap = makeStadiumScreenTexture(themeForState(state), `${blue}  :  ${orange}`, arenaScoreboard.accent);
  const oldMaps = new Set();
  for (const mat of arenaScoreboard.materials) {
    if (mat.map) oldMaps.add(mat.map);
    mat.map = nextMap;
    mat.needsUpdate = true;
  }
  oldMaps.forEach(map => { if (map !== nextMap && map.dispose) map.dispose(); });
  arenaScoreboard.key = key;
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
  stadiumHemi.color.setHex(theme.lightBlue ?? theme.accentA ?? 0xbfefff);
  stadiumHemi.groundColor.setHex(theme.background ?? 0x05070d);
  stadiumHemi.intensity = isPhonePortrait() ? 0.24 : 0.38;
  blueRimLight.color.setHex(theme.lightBlue ?? theme.accentA ?? 0x12b9ff);
  orangeRimLight.color.setHex(theme.lightOrange ?? theme.accentB ?? 0xff8a1f);
  blueRimLight.intensity = isPhonePortrait() ? 0.18 : 0.42;
  orangeRimLight.intensity = isPhonePortrait() ? 0.16 : 0.38;
}

function makeFieldTexture(mode, arena, theme) {
  const cnv = document.createElement("canvas");
  const phone = isPhonePortrait();
  const texSize = 1024;
  cnv.width = texSize; cnv.height = texSize;
  const ctx = cnv.getContext("2d");
  const base = modeFieldColor(mode, theme);
  const pitchShade = mode === "ice" ? 0.58 : mode === "snooker" ? 0.42 : 0.34;
  const shadedBase = base.map(v => Math.max(0, Math.round(v * pitchShade)));
  ctx.fillStyle = `rgb(${shadedBase[0]},${shadedBase[1]},${shadedBase[2]})`;
  ctx.fillRect(0, 0, texSize, texSize);

  const cssHex = value => `#${(Number(value ?? 0xffffff) >>> 0).toString(16).padStart(6, "0").slice(-6)}`;
  const glowA = cssHex(theme.fieldGlowA ?? theme.accentA ?? 0x16c7ff);
  const glowB = cssHex(theme.fieldGlowB ?? theme.accentB ?? 0xff9a2b);
  const identityAlpha = theme.style === "classic" ? 0.026 : 0.064;
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
  ctx.save();
  ctx.lineWidth = 5;
  ctx.strokeStyle = `rgba(255,255,255,${mode === "ice" ? 0.72 : 0.46})`;
  const boxW = texSize * 0.42;
  const boxD = texSize * 0.13;
  ctx.strokeRect(mid - boxW / 2, m, boxW, boxD);
  ctx.strokeRect(mid - boxW / 2, texSize - m - boxD, boxW, boxD);
  ctx.lineWidth = 3;
  ctx.strokeStyle = `rgba(255,255,255,${mode === "ice" ? 0.42 : 0.28})`;
  ctx.strokeRect(mid - boxW * 0.31, m, boxW * 0.62, boxD * 0.52);
  ctx.strokeRect(mid - boxW * 0.31, texSize - m - boxD * 0.52, boxW * 0.62, boxD * 0.52);
  ctx.fillStyle = `rgba(255,255,255,${mode === "ice" ? 0.82 : 0.58})`;
  ctx.beginPath(); ctx.arc(mid, mid, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(mid, m + boxD * 0.72, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(mid, texSize - m - boxD * 0.72, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  const drawChevronLane = (y, dir, color, alpha) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    const laneW = texSize * 0.17;
    const laneGap = texSize * 0.20;
    for (const x of [mid - laneGap, mid + laneGap]) {
      for (let i = 0; i < 4; i++) {
        const yy = y + dir * i * texSize * 0.036;
        ctx.beginPath();
        ctx.moveTo(x - laneW * 0.36, yy - dir * laneW * 0.16);
        ctx.lineTo(x, yy + dir * laneW * 0.16);
        ctx.lineTo(x + laneW * 0.36, yy - dir * laneW * 0.16);
        ctx.stroke();
      }
    }
    ctx.restore();
  };
  drawChevronLane(texSize * 0.19, 1, glowA, phone ? 0.18 : 0.30);
  drawChevronLane(texSize * 0.81, -1, glowB, phone ? 0.18 : 0.30);

  ctx.save();
  ctx.globalAlpha = phone ? 0.035 : 0.055;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  const hexR = texSize / (phone ? 28 : 34);
  const hexH = Math.sin(Math.PI / 3) * hexR;
  for (let row = -1; row < (phone ? 16 : 20); row++) {
    for (let col = -1; col < (phone ? 14 : 18); col++) {
      const x = col * hexR * 1.5 + (row % 2 ? hexR * 0.75 : 0) + texSize * 0.05;
      const y = row * hexH * 2 + texSize * 0.06;
      if (x < -hexR || x > texSize + hexR || y < -hexH || y > texSize + hexH) continue;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 6 + k * Math.PI / 3;
        const px = x + Math.cos(a) * hexR;
        const py = y + Math.sin(a) * hexR;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = mode === "ice" ? 0.24 : 0.16;
  ctx.strokeStyle = glowA;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(mid, mid, texSize * 0.16, Math.PI * 0.06, Math.PI * 0.94);
  ctx.stroke();
  ctx.strokeStyle = glowB;
  ctx.beginPath();
  ctx.arc(mid, mid, texSize * 0.16, Math.PI * 1.06, Math.PI * 1.94);
  ctx.stroke();
  ctx.restore();

  // Subtle deterministic turf/ice grain. This avoids the field looking flat
  // while keeping the selected lobby theme stable for every client.
  let seed = (arena.w * 31 + arena.l * 17 + (base[0] << 8) + base[1]) >>> 0;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  ctx.globalAlpha = mode === "ice" ? 0.12 : 0.18;
  for (let i = 0; i < (phone ? 900 : 1300); i++) {
    const x = rand() * texSize, y = rand() * texSize;
    ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(x, y, 1, 1);
  }
  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = phone ? 2 : 4;
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
  clearWorld();
  ballMesh = null;
  carMeshes.clear();
  boostPadMeshes.clear();
  boostTrailMeshes.clear();
  ballTrail.length = 0;
  nameSprites.clear();
  applySceneTheme(theme);
  arenaScoreboard = { key: "", materials: [], accent: theme.trim ?? 0xffffff };

  const arena = state.arena;
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(arena.w, arena.l),
    new THREE.MeshStandardMaterial({
      map: makeFieldTexture(state.mode, arena, theme),
      color: state.mode === "ice" ? 0xffffff : 0x7a8576,
      roughness: state.mode === "ice" ? 0.24 : (arena.floorRoughness ?? 0.74),
      metalness: state.mode === "ice" ? 0.12 : (arena.floorMetalness ?? 0.03)
    })
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
    function goalTube(radius, length, x, y, z, axis = "y", radiusScale = 1) {
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * radiusScale, radius * radiusScale, length, mobilePerf ? 10 : 16),
        frameMat
      );
      tube.position.set(x, y, z);
      if (axis === "x") tube.rotation.z = Math.PI / 2;
      if (axis === "z") tube.rotation.x = Math.PI / 2;
      tube.castShadow = false;
      tube.receiveShadow = true;
      world.add(tube);
      return tube;
    }

    // Real goal frame: rounded posts/crossbars keep the mouth visually clean.
    // The old rectangular rails looked like extra boxes in and around the posts.
    goalTube(post * 0.5, arena.goalH, -halfW, arena.goalH / 2, goalLineZ);
    goalTube(post * 0.5, arena.goalH,  halfW, arena.goalH / 2, goalLineZ);
    goalTube(post * 0.5, arena.goalW + post, 0, arena.goalH, goalLineZ, "x");
    goalTube(post * 0.34, arena.goalH, -halfW, arena.goalH / 2, backZ);
    goalTube(post * 0.34, arena.goalH,  halfW, arena.goalH / 2, backZ);
    goalTube(post * 0.34, arena.goalW + post, 0, arena.goalH, backZ, "x");
    goalTube(post * 0.30, arena.goalD, -halfW, arena.goalH, midZ, "z");
    goalTube(post * 0.30, arena.goalD,  halfW, arena.goalH, midZ, "z");

    const netMat = new THREE.MeshBasicMaterial({ color: frameMat.color || new THREE.Color(0xffffff), wireframe: true, transparent: true, opacity: mobilePerf ? 0.30 : 0.42, side: THREE.DoubleSide });
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

    const goalWashMat = new THREE.MeshBasicMaterial({
      color: frameMat.color || new THREE.Color(0xffffff),
      transparent: true,
      opacity: mobilePerf ? 0.10 : 0.16,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const floorWash = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalW * 0.92, arena.goalD * 0.92), goalWashMat);
    floorWash.rotation.x = -Math.PI / 2;
    floorWash.position.set(0, 0.08, midZ);
    world.add(floorWash);
    const backGlow = new THREE.Mesh(new THREE.PlaneGeometry(arena.goalW * 0.86, arena.goalH * 0.82), goalWashMat.clone());
    backGlow.position.set(0, arena.goalH * 0.46, backZ + side * 0.04);
    world.add(backGlow);

    // Keep the goal mouth clear: only transparent washes/nets, no lower rails,
    // backboards, or braces inside the posts during shots/replays.
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
    function propPlane(w, h, x, y, z, mat, rotY = 0) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z);
      m.rotation.y = rotY;
      m.castShadow = false;
      m.receiveShadow = false;
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
    // No ad blocks behind the goal opening; keep those sightlines clean.

    // Goal-end stands and entry tunnels make the arena feel enclosed without affecting collisions.
    for (const side of [-1, 1]) {
      propBox((arena.w - arena.goalW) * 0.46, 3.0, 8.0, -arena.w * 0.34, 2.1, side * (arena.l / 2 + arena.goalD + 6), darkMat);
      propBox((arena.w - arena.goalW) * 0.46, 3.0, 8.0,  arena.w * 0.34, 2.1, side * (arena.l / 2 + arena.goalD + 6), darkMat);
      propBox(arena.goalW * 0.78, 2.7, 4.6, 0, 2.0, side * (arena.l / 2 + arena.goalD + 9.5), steelMat);
      propBox(arena.goalW * 0.62, 1.15, 0.38, 0, 3.65, side * (arena.l / 2 + arena.goalD + 7.4), side < 0 ? glowBlue : glowOrange);
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
    const haloMat = new THREE.MeshBasicMaterial({ color: trim, transparent: true, opacity: mobilePerf ? 0.34 : 0.50 });
    for (const side of [-1, 1]) {
      propBox(arena.w + 30, 0.26, 0.42, 0, 17.65, side * (arena.l / 2 + 16.2), haloMat);
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
    for (const side of [-1, 1]) {
      propBox(0.42, 0.26, arena.l + 24, side * (arena.w / 2 + 14.7), 17.65, 0, haloMat);
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

    // Low-key broadcast/stadium props: benches, camera rigs, speakers, and a
    // compact hanging scoreboard. They sit above/outside play so the pitch stays readable.
    const equipmentMat = new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.66, metalness: 0.18 });
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: mobilePerf ? 0.28 : 0.45 });
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72, metalness: 0.04 });
    const propCount = mobilePerf ? 2 : 4;
    for (const side of [-1, 1]) {
      for (let i = 0; i < propCount; i++) {
        const z = -arena.l * 0.32 + i * (arena.l * 0.64 / Math.max(1, propCount - 1));
        propBox(3.4, 0.42, 1.0, side * (arena.w / 2 + 3.4), 0.58, z, benchMat);
        propBox(0.18, 1.8, 0.18, side * (arena.w / 2 + 4.9), 1.05, z + 1.4, equipmentMat);
        propBox(0.9, 0.42, 0.6, side * (arena.w / 2 + 4.9), 2.1, z + 1.4, i % 2 ? glowBlue : glowOrange, side * Math.PI * 0.5);
      }
      for (let i = 0; i < (mobilePerf ? 3 : 5); i++) {
        const z = -arena.l / 2 + (i + 0.5) * (arena.l / (mobilePerf ? 3 : 5));
        propBox(0.32, 0.32, 3.2, side * (arena.w / 2 + 18.8), 12.8, z, equipmentMat);
        propBox(0.12, 8.5, 0.12, side * (arena.w / 2 + 18.8), 8.4, z, cableMat);
      }
    }

    const scoreTex = makeStadiumScreenTexture(theme, "0  :  0", trim);
    const scoreScreen = new THREE.MeshBasicMaterial({ map: scoreTex, side: THREE.DoubleSide, transparent: true, opacity: mobilePerf ? 0.72 : 0.88 });
    arenaScoreboard.materials.push(scoreScreen);
    propBox(10.6, 2.8, 0.42, 0, 18.0, -3.3, equipmentMat);
    propBox(10.6, 2.8, 0.42, 0, 18.0, 3.3, equipmentMat);
    propPlane(9.2, 2.1, 0, 18.0, -3.55, scoreScreen, 0);
    propPlane(9.2, 2.1, 0, 18.0, 3.55, scoreScreen, Math.PI);
    propBox(0.24, 6.8, 0.24, -5.3, 20.9, 0, cableMat);
    propBox(0.24, 6.8, 0.24,  5.3, 20.9, 0, cableMat);

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
      const screenBlue = new THREE.MeshBasicMaterial({ map: makeStadiumScreenTexture(theme, "RLCSS", blueLight), side: THREE.DoubleSide });
      const screenOrange = new THREE.MeshBasicMaterial({ map: makeStadiumScreenTexture(theme, "ROCKET", orangeLight), side: THREE.DoubleSide });
      propBox(15.0, 5.2, 0.7, 0, 15.6, -arena.l / 2 - 22.5, boardMat);
      propPlane(13.6, 4.2, 0, 15.6, -arena.l / 2 - 22.08, screenBlue, 0);
      propBox(5.2, 0.65, 0.9, -5.0, 15.6, -arena.l / 2 - 22.0, glowBlue);
      propBox(5.2, 0.65, 0.9,  5.0, 15.6, -arena.l / 2 - 22.0, glowOrange);
      propBox(12.5, 4.0, 0.7, 0, 13.0, arena.l / 2 + 22.5, boardMat);
      propPlane(11.2, 3.1, 0, 13.0, arena.l / 2 + 22.08, screenOrange, Math.PI);
      propBox(3.8, 0.52, 0.9, -4.1, 13.0, arena.l / 2 + 22.0, glowBlue);
      propBox(3.8, 0.52, 0.9,  4.1, 13.0, arena.l / 2 + 22.0, glowOrange);
    } else {
      const miniScreen = new THREE.MeshBasicMaterial({ map: makeStadiumScreenTexture(theme, "RLCSS", trim), side: THREE.DoubleSide });
      propPlane(8.4, 2.5, 0, 12.2, -arena.l / 2 - 18.8, miniScreen, 0);
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

  const upperGlassMat = new THREE.MeshStandardMaterial({
    color: wallColor,
    emissive: theme.accentA ?? blueLight,
    emissiveIntensity: mobilePerf ? 0.04 : 0.08,
    transparent: true,
    opacity: mobilePerf ? 0.12 : 0.18,
    depthWrite: false,
    roughness: 0.18,
    metalness: 0.10
  });
  box(0.22, 4.2, arena.l * 0.96, -arena.w / 2, 15.0, 0, upperGlassMat);
  box(0.22, 4.2, arena.l * 0.96, arena.w / 2, 15.0, 0, upperGlassMat);
  box(arena.w * 0.96, 4.2, 0.22, 0, 15.0, -arena.l / 2, upperGlassMat);
  box(arena.w * 0.96, 4.2, 0.22, 0, 15.0, arena.l / 2, upperGlassMat);

  const ribBlue = new THREE.MeshBasicMaterial({ color: blueLight, transparent: true, opacity: mobilePerf ? 0.42 : 0.62 });
  const ribOrange = new THREE.MeshBasicMaterial({ color: orangeLight, transparent: true, opacity: mobilePerf ? 0.42 : 0.62 });
  const ribNeutral = new THREE.MeshBasicMaterial({ color: theme.trim ?? 0xffffff, transparent: true, opacity: mobilePerf ? 0.28 : 0.42 });
  const ribCount = mobilePerf ? 5 : 8;
  for (let i = 0; i < ribCount; i++) {
    const t = ribCount <= 1 ? 0.5 : i / (ribCount - 1);
    const z = -arena.l * 0.42 + t * arena.l * 0.84;
    box(0.24, 8.6, 0.20, -arena.w / 2 - 0.08, 7.3, z, i % 2 ? ribBlue : ribNeutral);
    box(0.24, 8.6, 0.20, arena.w / 2 + 0.08, 7.3, z, i % 2 ? ribOrange : ribNeutral);
  }

  const standsMat = new THREE.MeshStandardMaterial({ color: theme.stands ?? 0x111827, roughness: 0.9 });
  const stairMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, emissive: theme.trim ?? 0xffffff, emissiveIntensity: mobilePerf ? 0.10 : 0.18, roughness: 0.48, metalness: 0.06 });
  const railMat = new THREE.MeshBasicMaterial({ color: theme.trim ?? 0xffffff, transparent: true, opacity: mobilePerf ? 0.24 : 0.40 });
  const crowd = theme.crowd || [0x1f2937, 0x0f172a, 0x243b53];
  function addCrowdPixels(side) {
    const palette = crowd.slice(0, 4);
    const total = mobilePerf ? 54 : 138;
    const perColor = Math.max(1, Math.floor(total / palette.length));
    const seedBase = ((arena.w * 13 + arena.l * 19 + (side > 0 ? 101 : 307)) >>> 0) || 1;
    let seed = seedBase;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const geo = new THREE.BoxGeometry(0.52, 0.34, 0.08);
    const dummy = new THREE.Object3D();
    for (let c = 0; c < palette.length; c++) {
      const mat = new THREE.MeshBasicMaterial({ color: palette[c], transparent: true, opacity: mobilePerf ? 0.42 : 0.58 });
      const inst = new THREE.InstancedMesh(geo, mat, perColor);
      for (let i = 0; i < perColor; i++) {
        const tier = Math.floor(rand() * 5);
        const x = -arena.w / 2 - 7 + rand() * (arena.w + 14);
        const y = 4.45 + tier * 2.12 + rand() * 0.34;
        const z = side * (arena.l / 2 + 7.4 + tier * 3.0 + rand() * 0.45);
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(0.75 + rand() * 0.75, 0.78 + rand() * 0.9, 1);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.castShadow = false;
      inst.receiveShadow = false;
      world.add(inst);
    }
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const stand = box(arena.w + 20 + i * 5, 2.2, 4, 0, 3 + i * 2.2, side * (arena.l / 2 + 10 + i * 3), standsMat);
      stand.rotation.x = side * 0.08;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(arena.w + 18 + i * 5, 0.14, 0.12), railMat);
      rail.position.set(0, 4.16 + i * 2.2, side * (arena.l / 2 + 8.0 + i * 3));
      rail.castShadow = false;
      rail.receiveShadow = false;
      world.add(rail);
      if (i > 0) {
        const crowdMat = new THREE.MeshBasicMaterial({ color: crowd[i % crowd.length], transparent: true, opacity: 0.36 });
        const ribbon = new THREE.Mesh(new THREE.BoxGeometry(arena.w + 14 + i * 5, 0.45, 0.16), crowdMat);
        ribbon.position.set(0, 4.4 + i * 2.2, side * (arena.l / 2 + 7.8 + i * 3));
        world.add(ribbon);
      }
    }
    const aisleCount = mobilePerf ? 4 : 6;
    for (let i = 0; i < aisleCount; i++) {
      const x = -arena.w / 2 + (i + 0.5) * (arena.w / aisleCount);
      const aisle = box(0.48, 10.0, 1.1, x, 7.8, side * (arena.l / 2 + 16.0), stairMat);
      aisle.rotation.x = side * 0.08;
      const portal = box(3.4, 1.2, 0.65, x, 2.15, side * (arena.l / 2 + 6.0), i % 2 ? trimOrange : trimBlue);
      portal.castShadow = false;
      portal.receiveShadow = false;
    }
    addCrowdPixels(side);
    // V28 performance: emissive end trims replace dynamic point lights.
  }

  // Fill the long touchline sides too, so every arena feels surrounded by a
  // complete bowl instead of only having detail behind the goals. These props
  // sit outside the collision walls and intentionally do not affect pitch art.
  function addSideStandCrowd(side) {
    const palette = crowd.slice(0, 4);
    const total = mobilePerf ? 44 : 116;
    const perColor = Math.max(1, Math.floor(total / palette.length));
    let seed = ((arena.w * 29 + arena.l * 37 + (side > 0 ? 719 : 421)) >>> 0) || 1;
    const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const geo = new THREE.BoxGeometry(0.08, 0.34, 0.52);
    const dummy = new THREE.Object3D();
    for (let c = 0; c < palette.length; c++) {
      const mat = new THREE.MeshBasicMaterial({ color: palette[c], transparent: true, opacity: mobilePerf ? 0.42 : 0.58 });
      const inst = new THREE.InstancedMesh(geo, mat, perColor);
      for (let i = 0; i < perColor; i++) {
        const tier = Math.floor(rand() * 5);
        const x = side * (arena.w / 2 + 7.4 + tier * 2.6 + rand() * 0.45);
        const y = 4.45 + tier * 2.05 + rand() * 0.34;
        const z = -arena.l / 2 - 5 + rand() * (arena.l + 10);
        dummy.position.set(x, y, z);
        dummy.scale.set(1, 0.78 + rand() * 0.9, 0.75 + rand() * 0.75);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.castShadow = false;
      inst.receiveShadow = false;
      world.add(inst);
    }
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const stand = box(4, 2.0, arena.l + 18 + i * 4.2, side * (arena.w / 2 + 10 + i * 2.7), 3 + i * 2.05, 0, standsMat);
      stand.rotation.z = -side * 0.08;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, arena.l + 16 + i * 4.2), railMat);
      rail.position.set(side * (arena.w / 2 + 8.0 + i * 2.7), 4.12 + i * 2.05, 0);
      rail.castShadow = false;
      rail.receiveShadow = false;
      world.add(rail);
      if (i > 0) {
        const crowdMat = new THREE.MeshBasicMaterial({ color: crowd[(i + 2) % crowd.length], transparent: true, opacity: 0.36 });
        const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.45, arena.l + 12 + i * 4.2), crowdMat);
        ribbon.position.set(side * (arena.w / 2 + 7.8 + i * 2.7), 4.34 + i * 2.05, 0);
        world.add(ribbon);
      }
    }
    const aisleCount = mobilePerf ? 5 : 7;
    for (let i = 0; i < aisleCount; i++) {
      const z = -arena.l / 2 + (i + 0.5) * (arena.l / aisleCount);
      const aisle = box(1.05, 9.4, 0.48, side * (arena.w / 2 + 15.2), 7.6, z, stairMat);
      aisle.rotation.z = -side * 0.08;
      const portal = box(0.65, 1.2, 3.2, side * (arena.w / 2 + 5.8), 2.15, z, i % 2 ? trimOrange : trimBlue);
      portal.castShadow = false;
      portal.receiveShadow = false;
    }
    addSideStandCrowd(side);
  }
  // V28 performance: no extra side point lights; ambient + sun + emissive props are cheaper.

  addExteriorProps();

  ballMesh = new THREE.Group();
  const ballGeo = new THREE.IcosahedronGeometry(VISUAL_CONSTANTS.BALL_RADIUS, mobilePerf ? 2 : 3);
  const ballCore = new THREE.Mesh(
    ballGeo,
    new THREE.MeshStandardMaterial({ color: 0xf8fbff, roughness: 0.38, metalness: 0.14, emissive: 0x111827, emissiveIntensity: 0.10 })
  );
  ballCore.castShadow = true;
  const ballEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(ballGeo),
    new THREE.LineBasicMaterial({ color: theme.accentC ?? 0xdbeafe, transparent: true, opacity: mobilePerf ? 0.18 : 0.28 })
  );
  const footballLineMat = new THREE.MeshBasicMaterial({ color: 0x050505, transparent: true, opacity: mobilePerf ? 0.64 : 0.78, depthWrite: false });
  const seamRadius = VISUAL_CONSTANTS.BALL_RADIUS * 1.015;
  const seamTube = VISUAL_CONSTANTS.BALL_RADIUS * 0.010;
  const addBallSeam = (rotX = 0, rotY = 0, rotZ = 0, scaleX = 1, scaleY = 1) => {
    const seam = new THREE.Mesh(new THREE.TorusGeometry(seamRadius, seamTube, mobilePerf ? 6 : 8, mobilePerf ? 40 : 64), footballLineMat);
    seam.rotation.set(rotX, rotY, rotZ);
    seam.scale.set(scaleX, scaleY, 1);
    ballMesh.add(seam);
  };
  const ballAura = new THREE.Mesh(
    new THREE.SphereGeometry(VISUAL_CONSTANTS.BALL_RADIUS * 1.06, mobilePerf ? 16 : 24, mobilePerf ? 10 : 14),
    new THREE.MeshBasicMaterial({ color: theme.trim ?? 0xffffff, transparent: true, opacity: mobilePerf ? 0.035 : 0.055, depthWrite: false })
  );
  ballMesh.add(ballAura, ballCore, ballEdges);
  addBallSeam(Math.PI / 2, 0, 0, 1.0, 1.0);
  addBallSeam(0, Math.PI / 2, 0, 1.0, 1.0);
  addBallSeam(Math.PI / 2, Math.PI / 4, 0, 0.64, 1.0);
  addBallSeam(Math.PI / 2, -Math.PI / 4, 0, 0.64, 1.0);
  world.add(ballMesh);
}


function createBoostPadMesh(pad) {
  const g = new THREE.Group();
  const radius = pad.radius || 2.15;
  const big = !!pad.big || (pad.amount || 0) >= 100;
  const diskMat = new THREE.MeshStandardMaterial({
    color: big ? 0xffc247 : 0xff9f1a,
    emissive: big ? 0xffb000 : 0xff6500,
    emissiveIntensity: big ? 0.86 : 0.62,
    transparent: true,
    opacity: big ? 0.82 : 0.70,
    roughness: 0.35
  });
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.18, big ? 32 : 24), diskMat);
  disk.position.y = 0.09;
  disk.receiveShadow = true;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.88, big ? 0.095 : 0.065, 8, big ? 36 : 28), new THREE.MeshBasicMaterial({ color: 0xfff2a8 }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.26;
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: big ? 0.72 : 0.52, depthWrite: false, side: THREE.DoubleSide });
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.32, radius * 0.62, 3), arrowMat);
  arrow.rotation.x = -Math.PI / 2;
  arrow.rotation.z = Math.PI;
  arrow.position.y = 0.31;
  const orb = new THREE.Mesh(new THREE.SphereGeometry(big ? 0.62 : 0.44, big ? 18 : 14, big ? 12 : 10), new THREE.MeshBasicMaterial({ color: big ? 0xfff2a8 : 0xffd55a }));
  const baseOrbY = big ? 1.02 : 0.82;
  orb.position.y = baseOrbY;
  // V28 performance: boost pads glow with emissive meshes instead of one dynamic light per pad.
  const halo = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 1.22, radius * 1.22, 0.04, big ? 36 : 28),
    new THREE.MeshBasicMaterial({ color: 0xffb000, transparent: true, opacity: big ? 0.22 : 0.14, depthWrite: false })
  );
  halo.position.y = 0.04;
  g.add(halo, disk, ring, arrow, orb);
  g.position.set(pad.x, 0, pad.z);
  g.userData = { orb, ring, disk, halo, arrow, baseOrbY, baseHaloOpacity: halo.material.opacity };
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
      mesh.userData.orb.position.y = (mesh.userData.baseOrbY || 0.9) + Math.sin(t + pad.x) * (pad.big ? 0.14 : 0.10);
      mesh.userData.orb.scale.setScalar(pulse);
      mesh.userData.ring.rotation.z += 0.035;
      mesh.userData.arrow.rotation.z += pad.big ? 0.025 : 0.018;
      mesh.userData.halo.scale.setScalar(0.98 + (pulse - 1) * 1.2);
      mesh.userData.halo.material.opacity = mesh.userData.baseHaloOpacity * (0.82 + pulse * 0.20);
    }
  }
}

function carMaterial(team, human, model = "default", isLocal = false) {
  const teamBase = team === "blue" ? 0x0a91ff : 0xff6a00;
  const base = isLocal
    ? new THREE.Color(teamBase).lerp(new THREE.Color(0xffffff), team === "blue" ? 0.24 : 0.18).getHex()
    : teamBase;
  const metalness = model === "truck" ? 0.14 : human ? 0.34 : 0.16;
  const roughness = model === "sport" ? 0.20 : human ? 0.26 : 0.42;
  return new THREE.MeshPhysicalMaterial({
    color: base,
    roughness: isLocal ? Math.max(0.22, roughness - 0.05) : roughness,
    metalness: isLocal ? Math.min(0.48, metalness + 0.10) : metalness,
    clearcoat: human || isLocal ? 0.72 : 0.42,
    clearcoatRoughness: model === "truck" ? 0.32 : 0.18,
    emissive: teamBase,
    emissiveIntensity: isLocal ? 0.13 : human ? 0.055 : 0.03
  });
}


function createRoundedBoxMesh(w, h, d, radius, material, segments = 4) {
  const r = Math.max(0.02, Math.min(radius, w * 0.45, h * 0.45));
  const shape = new THREE.Shape();
  const x = w / 2 - r;
  const y = h / 2 - r;
  shape.moveTo(-x, -h / 2);
  shape.lineTo(x, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -y);
  shape.lineTo(w / 2, y);
  shape.quadraticCurveTo(w / 2, h / 2, x, h / 2);
  shape.lineTo(-x, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, y);
  shape.lineTo(-w / 2, -y);
  shape.quadraticCurveTo(-w / 2, -h / 2, -x, -h / 2);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: r * 0.38, bevelSize: r * 0.44, bevelSegments: segments, curveSegments: segments });
  geo.center();
  const mesh = new THREE.Mesh(geo, material);
  return mesh;
}

function addAeroKit(g, bodyW, bodyH, bodyD, team, modelKey, isLocal = false) {
  const accent = isLocal ? 0xffffff : team === "blue" ? 0x32d7ff : 0xff9a2b;
  const carbon = new THREE.MeshStandardMaterial({ color: 0x070a10, roughness: 0.42, metalness: 0.34 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.42, roughness: 0.24, metalness: 0.18 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x07111e, emissive: accent, emissiveIntensity: 0.08, roughness: 0.12, metalness: 0.52, transparent: true, opacity: 0.88 });
  const splitter = createRoundedBoxMesh(bodyW * 0.82, 0.10, 0.34, 0.06, carbon, 3);
  splitter.position.set(0, 0.22, bodyD / 2 + 0.23);
  const diffuser = createRoundedBoxMesh(bodyW * 0.76, 0.14, 0.24, 0.05, carbon, 3);
  diffuser.position.set(0, 0.30, -bodyD / 2 - 0.18);
  const spoiler = createRoundedBoxMesh(bodyW * 0.88, 0.10, 0.30, 0.06, carbon, 3);
  spoiler.position.set(0, bodyH + 0.52, -bodyD * 0.46);
  spoiler.rotation.x = -0.10;
  const wingA = createRoundedBoxMesh(0.10, 0.50, 0.16, 0.04, carbon, 3);
  const wingB = wingA.clone();
  wingA.position.set(-bodyW * 0.38, bodyH + 0.28, -bodyD * 0.45);
  wingB.position.set(bodyW * 0.38, bodyH + 0.28, -bodyD * 0.45);
  g.add(splitter, diffuser, spoiler, wingA, wingB);
  for (const sx of [-1, 1]) {
    const skirt = createRoundedBoxMesh(0.12, 0.18, bodyD * 0.74, 0.05, carbon, 3);
    skirt.position.set(sx * (bodyW / 2 + 0.08), 0.34, -bodyD * 0.02);
    const neon = createRoundedBoxMesh(0.055, 0.07, bodyD * 0.68, 0.035, accentMat, 3);
    neon.position.set(sx * (bodyW / 2 + 0.145), 0.53, -bodyD * 0.02);
    const window = createRoundedBoxMesh(bodyW * 0.22, bodyH * 0.34, 0.06, 0.05, glassMat, 3);
    window.position.set(sx * bodyW * 0.31, bodyH + 0.20, 0.08);
    window.rotation.y = sx * Math.PI / 2;
    g.add(skirt, neon, window);
  }
  if (modelKey === "sport") {
    const intake = createRoundedBoxMesh(bodyW * 0.34, 0.08, bodyD * 0.28, 0.04, carbon, 3);
    intake.position.set(0, bodyH + 0.14, bodyD * 0.12);
    g.add(intake);
  }
}

function createWheelMesh(x, z, scale = 1) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34 * scale, 0.34 * scale, 0.42 * scale, 14),
    new THREE.MeshStandardMaterial({ color: 0x07080b, roughness: 0.72, metalness: 0.08 })
  );
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, 0.36 * scale, z);
  wheel.castShadow = true;
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.44 * scale, 10),
    new THREE.MeshBasicMaterial({ color: 0xb9c4d3, transparent: true, opacity: 0.72 })
  );
  wheel.add(rim);
  const trim = new THREE.Mesh(
    new THREE.TorusGeometry(0.245 * scale, 0.022 * scale, 6, 18),
    new THREE.MeshBasicMaterial({ color: 0xe5f4ff, transparent: true, opacity: 0.46 })
  );
  trim.rotation.x = Math.PI / 2;
  wheel.add(trim);
  return wheel;
}

function addVehicleLighting(g, bodyW, bodyH, bodyD, team, modelKey, isLocal = false) {
  const accent = isLocal ? 0xffffff : team === "blue" ? 0x33d6ff : 0xff9a2b;
  const accentMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.82 });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xf8fbff, transparent: true, opacity: 0.86 });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2d2d, transparent: true, opacity: 0.78 });
  const underMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: isLocal ? 0.24 : modelKey === "sport" ? 0.18 : 0.13, depthWrite: false, side: THREE.DoubleSide });
  const under = new THREE.Mesh(new THREE.PlaneGeometry(bodyW * 1.15, bodyD * 0.80), underMat);
  under.rotation.x = -Math.PI / 2;
  under.position.set(0, 0.08, -bodyD * 0.03);
  g.add(under);

  const frontW = Math.max(0.42, bodyW * 0.22);
  for (const sx of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.BoxGeometry(frontW, 0.10, 0.075), headMat);
    head.position.set(sx * bodyW * 0.25, bodyH * 0.57, bodyD / 2 + 0.18);
    const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.09, bodyD * 0.58), accentMat);
    sideRail.position.set(sx * (bodyW / 2 + 0.035), bodyH * 0.66, -bodyD * 0.02);
    g.add(head, sideRail);
  }
  const tail = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.58, 0.10, 0.07), tailMat);
  tail.position.set(0, bodyH * 0.55, -bodyD / 2 - 0.12);
  const roofLight = new THREE.Mesh(new THREE.BoxGeometry(bodyW * 0.34, 0.065, 0.42), accentMat);
  roofLight.position.set(0, bodyH + 0.36, -bodyD * 0.04);
  g.add(tail, roofLight);
}

function createCarMesh(car, state) {
  const modelKey = VEHICLE_CONFIGS[car.model] ? car.model : "default";
  const isLocal = car.id === activePlayerId();
  const vehicle = VEHICLE_CONFIGS[modelKey];
  const g = new THREE.Group();
  g.userData.model = modelKey;
  g.userData.team = car.team;
  g.userData.isLocal = isLocal;

  const [bodyW, bodyH, bodyD] = vehicle.body || VEHICLE_CONFIGS.default.body;
  const [cabinW, cabinH, cabinD] = vehicle.cabin || VEHICLE_CONFIGS.default.cabin;
  const [cabinX, cabinY, cabinZ] = vehicle.cabinOffset || VEHICLE_CONFIGS.default.cabinOffset;

  const body = createRoundedBoxMesh(bodyW, bodyH, bodyD, 0.22, carMaterial(car.team, car.human, modelKey, isLocal), isPhonePortrait() ? 3 : 5);
  body.position.y = bodyH / 2;
  body.castShadow = true;

  const cabin = createRoundedBoxMesh(cabinW, cabinH, cabinD, 0.18, new THREE.MeshPhysicalMaterial({ color: 0x0b111b, roughness: 0.20, metalness: 0.42, clearcoat: 0.36 }), isPhonePortrait() ? 3 : 5);
  cabin.position.set(cabinX, cabinY, cabinZ);
  cabin.castShadow = true;

  const accentMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: car.team === "blue" ? 0x0044aa : 0xaa3300, emissiveIntensity: 0.25 });
  const nose = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.45, bodyW * 0.72), 0.30, 0.26), accentMat);
  nose.position.set(0, bodyH * 0.76, bodyD / 2 + 0.10);
  const stripeMat = new THREE.MeshBasicMaterial({ color: isLocal ? 0xffffff : (car.team === "blue" ? 0xbff4ff : 0xffe0b6), transparent: true, opacity: isLocal ? 0.92 : 0.72 });
  const hoodStripe = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.22, bodyW * 0.12), 0.055, bodyD * 0.74), stripeMat);
  hoodStripe.position.set(0, bodyH + 0.055, bodyD * 0.02);
  const sideDecalA = new THREE.Mesh(new THREE.BoxGeometry(0.048, bodyH * 0.34, bodyD * 0.42), stripeMat);
  sideDecalA.position.set(-(bodyW / 2 + 0.026), bodyH * 0.58, bodyD * 0.02);
  const sideDecalB = sideDecalA.clone();
  sideDecalB.position.x = bodyW / 2 + 0.026;

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

  const flame = new THREE.Group();
  const flameOuter = new THREE.Mesh(
    new THREE.ConeGeometry(0.82, 2.9, 14).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: car.team === "blue" ? 0x33d6ff : 0xff8a00, transparent: true, opacity: 0.24, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  const flameCore = new THREE.Mesh(
    new THREE.ConeGeometry(0.46, 2.1, 12).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xfff2a8, transparent: true, opacity: 0.48, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  flameOuter.position.z = -0.18;
  flame.add(flameOuter, flameCore);
  flame.position.set(0, Math.max(0.44, bodyH * 0.52), -bodyD / 2 - 0.58);
  flame.visible = false;
  g.userData.flame = flame;
  const localBeacon = isLocal ? new THREE.Mesh(
    new THREE.RingGeometry(Math.max(bodyW, bodyD) * 0.50, Math.max(bodyW, bodyD) * 0.64, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide })
  ) : null;
  if (localBeacon) {
    localBeacon.rotation.x = -Math.PI / 2;
    localBeacon.position.y = 0.075;
    g.add(localBeacon);
  }

  const detailMat = new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.50, metalness: 0.26 });
  for (const sx of [-1, 1]) {
    const mirror = createRoundedBoxMesh(0.14, 0.16, 0.28, 0.04, detailMat, 3);
    mirror.position.set(sx * (bodyW / 2 + 0.14), bodyH * 0.86, bodyD * 0.22);
    const doorCut = new THREE.Mesh(new THREE.BoxGeometry(0.035, bodyH * 0.48, bodyD * 0.36), detailMat);
    doorCut.position.set(sx * (bodyW / 2 + 0.018), bodyH * 0.62, -bodyD * 0.02);
    g.add(mirror, doorCut);
  }

  g.add(body, cabin, nose, hoodStripe, sideDecalA, sideDecalB, flame);
  addVehicleLighting(g, bodyW, bodyH, bodyD, car.team, modelKey, isLocal);
  addAeroKit(g, bodyW, bodyH, bodyD, car.team, modelKey, isLocal);

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
let previewVehicleTeam = "";

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

function createPreviewVehicleMesh(modelKey, team = "blue") {
  const vehicle = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.default;
  const g = new THREE.Group();
  const [bodyW, bodyH, bodyD] = vehicle.body || VEHICLE_CONFIGS.default.body;
  const [cabinW, cabinH, cabinD] = vehicle.cabin || VEHICLE_CONFIGS.default.cabin;
  const [cabinX, cabinY, cabinZ] = vehicle.cabinOffset || VEHICLE_CONFIGS.default.cabinOffset;
  const body = createRoundedBoxMesh(bodyW, bodyH, bodyD, 0.22, carMaterial(team, true, modelKey), isPhonePortrait() ? 3 : 5);
  body.position.y = bodyH / 2;
  const cabin = createRoundedBoxMesh(cabinW, cabinH, cabinD, 0.18, new THREE.MeshPhysicalMaterial({ color: 0x0b111b, roughness: 0.20, metalness: 0.42, clearcoat: 0.36 }), isPhonePortrait() ? 3 : 5);
  cabin.position.set(cabinX, cabinY, cabinZ);
  const accent = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.45, bodyW * 0.72), 0.30, 0.26), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: team === "blue" ? 0x0a91ff : 0xff6a00, emissiveIntensity: 0.35 }));
  accent.position.set(0, bodyH * 0.76, bodyD / 2 + 0.10);
  const previewStripeMat = new THREE.MeshBasicMaterial({ color: team === "blue" ? 0xbff4ff : 0xffe0b6, transparent: true, opacity: 0.82 });
  const hoodStripe = new THREE.Mesh(new THREE.BoxGeometry(Math.max(0.22, bodyW * 0.12), 0.055, bodyD * 0.74), previewStripeMat);
  hoodStripe.position.set(0, bodyH + 0.055, bodyD * 0.02);
  const sideDecalA = new THREE.Mesh(new THREE.BoxGeometry(0.048, bodyH * 0.34, bodyD * 0.42), previewStripeMat);
  sideDecalA.position.set(-(bodyW / 2 + 0.026), bodyH * 0.58, bodyD * 0.02);
  const sideDecalB = sideDecalA.clone();
  sideDecalB.position.x = bodyW / 2 + 0.026;
  const wheelScale = vehicle.wheelScale || 1;
  const wheelX = bodyW / 2 + 0.04;
  const wheelZ = bodyD * 0.34;
  g.add(body, cabin, accent, hoodStripe, sideDecalA, sideDecalB,
    createWheelMesh(-wheelX, -wheelZ, wheelScale),
    createWheelMesh(wheelX, -wheelZ, wheelScale),
    createWheelMesh(-wheelX, wheelZ, wheelScale),
    createWheelMesh(wheelX, wheelZ, wheelScale)
  );
  addVehicleLighting(g, bodyW, bodyH, bodyD, team, modelKey);
  addAeroKit(g, bodyW, bodyH, bodyD, team, modelKey);
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
  const team = ui.team?.value === "orange" ? "orange" : "blue";
  const cfg = VEHICLE_CONFIGS[modelKey] || VEHICLE_CONFIGS.default;
  if (ui.vehiclePreviewName) ui.vehiclePreviewName.textContent = cfg.label || "Vehicle";
  if (ui.vehiclePreviewDesc) ui.vehiclePreviewDesc.textContent = cfg.description || "Selectable body with tiny handling differences.";
  if (!ui.vehiclePreview) return;
  initVehiclePreview();
  if (!previewScene || (!force && previewVehicleModel === modelKey && previewVehicleTeam === team && previewVehicle)) return;
  if (previewVehicle) previewScene.remove(previewVehicle);
  previewVehicle = createPreviewVehicleMesh(modelKey, team);
  previewVehicleModel = modelKey;
  previewVehicleTeam = team;
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
  if ((snd.demoTick || 0) > (lastSound.demoTick || 0)) { lastSound.demoTick = snd.demoTick; SFX.carBump(32); SFX.wallHit(30); }

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


function makeTrailSprite(color, opacity, scale) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  sprite.scale.setScalar(scale);
  world.add(sprite);
  return sprite;
}

let boostTrailTexture = null;
function getBoostTrailTexture() {
  if (boostTrailTexture) return boostTrailTexture;
  const cnv = document.createElement("canvas");
  cnv.width = 96;
  cnv.height = 96;
  const ctx = cnv.getContext("2d");
  const glow = ctx.createRadialGradient(48, 48, 0, 48, 48, 48);
  glow.addColorStop(0, "rgba(255,255,255,0.92)");
  glow.addColorStop(0.24, "rgba(255,255,255,0.48)");
  glow.addColorStop(0.58, "rgba(255,255,255,0.12)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, cnv.width, cnv.height);
  boostTrailTexture = new THREE.CanvasTexture(cnv);
  boostTrailTexture.minFilter = THREE.LinearFilter;
  boostTrailTexture.magFilter = THREE.LinearFilter;
  return boostTrailTexture;
}

function updateBallTrail(state) {
  const phone = isPhonePortrait();
  const max = phone ? 7 : 14;
  if (!ballMesh || !state.ball) return;
  const speed = Math.hypot(state.ball.vx || 0, state.ball.vy || 0, state.ball.vz || 0);
  if (speed > 10 && !phone) {
    const theme = themeForState(state);
    const s = makeTrailSprite(theme.trim ?? 0xdbeafe, 0.20, Math.min(2.4, 0.75 + speed * 0.018));
    s.position.copy(ballMesh.position);
    ballTrail.unshift({ mesh: s, life: 1 });
  }
  while (ballTrail.length > max) {
    const old = ballTrail.pop();
    world.remove(old.mesh);
    old.mesh.material.dispose();
  }
  for (let i = ballTrail.length - 1; i >= 0; i--) {
    const p = ballTrail[i];
    p.life -= 0.075;
    p.mesh.material.opacity = Math.max(0, p.life) * 0.18;
    p.mesh.scale.multiplyScalar(0.985);
    if (p.life <= 0) {
      world.remove(p.mesh);
      p.mesh.material.dispose();
      ballTrail.splice(i, 1);
    }
  }
}

function updateCarEffects(car, mesh) {
  const speed = Math.hypot(car.vx || 0, car.vz || 0);
  const color = car.team === "blue" ? 0x38d8ff : 0xff8a24;
  let trail = boostTrailMeshes.get(car.id);
  if (!trail) {
    trail = new THREE.Group();
    const trailMap = getBoostTrailTexture();
    for (let i = 0; i < (isPhonePortrait() ? 3 : 6); i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: trailMap, color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sprite.scale.set(0.9 + i * 0.18, 0.58 + i * 0.12, 1);
      trail.add(sprite);
    }
    world.add(trail);
    boostTrailMeshes.set(car.id, trail);
  }
  const fwd = new THREE.Vector3(Math.sin(car.yaw), 0, Math.cos(car.yaw));
  const active = (!!car.boosting && (car.boost || 0) > 0) || speed > 31;
  trail.visible = active && !(car.demoTimer > 0);
  if (trail.visible) {
    trail.position.set(car.x - fwd.x * 2.35, car.y + 0.62, car.z - fwd.z * 2.35);
    trail.rotation.y = car.yaw;
    let i = 0;
    const time = performance.now() * 0.006;
    for (const s of trail.children) {
      const falloff = 1 - i / trail.children.length;
      const wave = 0.5 + Math.sin(time + i * 1.6 + car.x * 0.03) * 0.5;
      const spread = (i - (trail.children.length - 1) / 2) * 0.10 + Math.sin(time * 0.7 + i) * 0.025;
      s.position.set(spread, Math.sin(time + i) * 0.025, -i * 0.58);
      s.material.opacity = (car.boosting ? 0.30 : 0.11) * falloff * (0.72 + wave * 0.22);
      s.scale.set((car.boosting ? 1.20 : 0.78) + i * 0.18, (car.boosting ? 0.70 : 0.46) + i * 0.10, 1);
      i++;
    }
  }
}

function updateVisuals(state) {
  if (!state) return;
  buildArena(state);
  const live = new Set(Object.keys(state.cars || {}));
  for (const [id, mesh] of carMeshes.entries()) {
    if (!live.has(id)) {
      world.remove(mesh);
      carMeshes.delete(id);
      const trail = boostTrailMeshes.get(id);
      if (trail) { world.remove(trail); boostTrailMeshes.delete(id); }
    }
  }
  if (ballMesh) {
    ballMesh.position.set(state.ball.x, state.ball.y, state.ball.z);
    ballMesh.rotation.set(state.ball.rx, 0, state.ball.rz);
  }
  updateBoostPadVisuals(state);
  updateBallTrail(state);
  for (const car of Object.values(state.cars || {})) {
    let mesh = carMeshes.get(car.id);
    const modelKey = VEHICLE_CONFIGS[car.model] ? car.model : "default";
    const isLocal = car.id === activePlayerId();
    if (mesh && (mesh.userData.model !== modelKey || mesh.userData.team !== car.team || mesh.userData.isLocal !== isLocal)) {
      world.remove(mesh);
      carMeshes.delete(car.id);
      mesh = null;
    }
    mesh = mesh || createCarMesh(car, state);
    mesh.visible = !(car.demoTimer > 0);
    mesh.position.set(car.x, car.y + (car.demoTimer > 0 ? -100 : 0), car.z);
    mesh.rotation.set(car.pitch || 0, car.yaw, car.roll || 0, "YXZ");
    const scale = car.cueCooldown > 0 ? 1 + car.cueCooldown * 0.45 : 1;
    mesh.scale.set(1, 1, scale);
    updateCarEffects(car, mesh);
    if (mesh.userData.flame) {
      const boosting = !!car.boosting && (car.boost || 0) > 0;
      mesh.userData.flame.visible = boosting;
      if (boosting) {
        const f = 0.92 + Math.sin(performance.now() * 0.018 + car.x * 0.05) * 0.12;
        mesh.userData.flame.scale.set(0.90, f, 1.05 + Math.sin(performance.now() * 0.014 + car.z * 0.04) * 0.08);
      }
    }
  }
  handleSoundEvents(state);
  updateHud(state);
  if (state.ended && selectedGameMode === "tournament" && tournamentState && tournamentState.last?.tick !== state.tick) { recordTournamentMatch(state); renderTournamentCard(); }
  recordLeaderboardResult(state).catch(err => console.warn("Leaderboard result save failed", err));
  updateCamera(state);
}

function updateHud(state) {
  ui.scoreBlue.textContent = `BLUE ${state.score?.blue ?? 0}`;
  ui.scoreOrange.textContent = `${state.score?.orange ?? 0} ORANGE`;
  updateArenaScoreboard(state);
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
  if (ui.boostLabel) ui.boostLabel.textContent = "BOOST";
  // Phone: the BOOST button itself shows the amount and its fill drains live.
  if (ui.mobileBoostButton) {
    ui.mobileBoostButton.style.setProperty("--boost-pct", `${boostPct}%`);
    ui.mobileBoostButton.innerHTML = `<span class="boost-btn-title">BOOST</span><span class="boost-btn-value">${boostPct}</span>`;
    ui.mobileBoostButton.classList.toggle("boost-empty", boostPct <= 0);
  }
  if (ui.breakOverlay) {
    const br = state.break;
    ui.breakOverlay.classList.toggle("hidden", !br);
    if (br) {
      ui.breakTitle.textContent = br.type === "hydration" ? "Hydration Break" : "Half-time";
      ui.breakTimer.textContent = String(Math.ceil(br.timer || 0));
      ui.breakCopy.textContent = `Press Reset to vote skip · ${br.skipVotes || 0}/${br.humans || 1}`;
    }
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
  // Keep controller camera pan local-only, Rocket League style: right stick looks
  // around without changing the physics/input sent to the lobby host.
  if (controllerSettings.enabled !== false) pollController();
  let yaw = localCar.yaw;
  if (localBallCam && state.ball) {
    yaw = Math.atan2(state.ball.x - localCar.x, state.ball.z - localCar.z);
  }
  const panSensitivity = controllerSettings.panSensitivity || 1;
  const panYaw = (controllerLook.x || 0) * 0.72 * panSensitivity;
  const panPitch = (controllerLook.y || 0) * 5.2 * panSensitivity;
  const offset = new THREE.Vector3(0, (localBallCam ? 8 : 6.8) + panPitch * 0.22, localBallCam ? -20 : -18);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw + panYaw);
  const desired = new THREE.Vector3(localCar.x, localCar.y + 1.6, localCar.z).add(offset);

  camera.position.lerp(desired, 0.16);
  let look;
  if (localBallCam) {
    const toBall = new THREE.Vector3(state.ball.x - localCar.x, 0, state.ball.z - localCar.z);
    if (toBall.lengthSq() < 0.001) toBall.set(Math.sin(localCar.yaw), 0, Math.cos(localCar.yaw));
    toBall.normalize();
    look = new THREE.Vector3(localCar.x + toBall.x * 14, localCar.y + 2.4 - panPitch * 0.26, localCar.z + toBall.z * 14);
  } else {
    const fwdYaw = localCar.yaw + panYaw;
    const fwd = new THREE.Vector3(Math.sin(fwdYaw), 0, Math.cos(fwdYaw));
    look = new THREE.Vector3(localCar.x + fwd.x * 24, localCar.y + 2.2 - panPitch * 0.26, localCar.z + fwd.z * 24);
  }
  camera.lookAt(look);
}

function renderLoop() {
  requestAnimationFrame(renderLoop);
  const now = performance.now();
  updateControllerBindDetect();
  pollControllerMenuNavigation();
  const menuDemoActive = updateMenuDemo(now);
  if (latestState && !menuDemoActive) updateVisuals(latestState);
  resizeRenderer();
  if (!menuDemoActive) SFX.update(latestState, activePlayerId());
  renderer.render(scene, camera);
  renderVehiclePreview(now);
}

setupMobileControls();
firebaseBootPromise = bootFirebase();
renderLoop();
