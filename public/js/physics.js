export const ROLES = ["balanced", "goalkeeper", "defence", "midfield", "attack"];

// V20 re-tunes the multiplayer rebuild back toward the last pre-multiplayer
// single-file version (V10): wider baseline pitch, 120 Hz host physics,
// stronger but smoother ground grip, proper powerslide momentum, OBB car-ball
// contacts, and the same ball restitution/friction ratios.
export const MODE_CONFIGS = {
  standard: {
    label: "Standard",
    drive: 1, brake: 1, reverse: 1, steer: 1, grip: 1, driftGrip: 1, driftTurn: 1,
    ballFriction: 1, ballRestitution: 1, wallRestitution: 1, ballMax: 1,
    gravity: 1, ballGravity: 1, jump: 1, aerialDrive: 1,
    floorRoughness: 0.74, floorMetalness: 0.03,
    snooker: false,
    sizeBonus: 0,
    maxHumans: teamSize => teamSize * 2
  },
  ice: {
    label: "Ice Rink",
    // V21: make Ice Rink clearly slipperier while keeping enough drive
    // and steering authority to remain playable. Low grip + low drag makes
    // cars carry speed and slide; reduced brake prevents instant stopping.
    drive: 0.76, brake: 0.40, reverse: 0.60, steer: 0.72, grip: 0.15, driftGrip: 0.085, driftTurn: 1.34,
    ballFriction: 0.20, ballRestitution: 1.12, wallRestitution: 1.14, ballMax: 0.98,
    gravity: 1, ballGravity: 1, jump: 1, aerialDrive: 1,
    floorRoughness: 0.08, floorMetalness: 0.30,
    snooker: false,
    sizeBonus: 0,
    maxHumans: teamSize => teamSize * 2
  },
  snooker: {
    label: "Snooker Cue",
    drive: 0.92, brake: 0.92, reverse: 0.95, steer: 0.95, grip: 0.82, driftGrip: 0.70, driftTurn: 0.95,
    ballFriction: 0.70, ballRestitution: 1.12, wallRestitution: 1.06, ballMax: 0.78,
    gravity: 1, ballGravity: 1, jump: 1, aerialDrive: 1,
    floorRoughness: 0.42, floorMetalness: 0.08,
    snooker: true, cueLength: 5.2, cueRadius: 0.55,
    sizeBonus: 0,
    maxHumans: teamSize => Math.min(teamSize * 2, 6)
  },
  flying: {
    label: "Flying Scoutsman",
    drive: 0.98, brake: 0.90, reverse: 0.92, steer: 0.98, grip: 0.86, driftGrip: 0.72, driftTurn: 1.08,
    ballFriction: 0.78, ballRestitution: 1.02, wallRestitution: 1.02, ballMax: 0.94,
    gravity: 0.34, ballGravity: 0.43, jump: 1.42, aerialDrive: 1.9,
    floorRoughness: 0.62, floorMetalness: 0.04,
    snooker: false,
    sizeBonus: 0.08,
    maxHumans: teamSize => Math.min(teamSize * 2, 8)
  }
};


export const STADIUM_THEMES = {
  v10: {
    label: "V10 Classic Stadium",
    style: "classic",
    background: 0x070912,
    fog: 0x080b16,
    fogDensity: 0.0058,
    ambient: 0xffffff,
    ambientIntensity: 0.54,
    sun: 0xffffff,
    sunIntensity: 1.08,
    sunPosition: [-30, 70, 25],
    field: [34, 102, 58],
    iceField: [185, 230, 255],
    snookerField: [16, 92, 50],
    flyingField: [34, 40, 72],
    stripeAlpha: 0.052,
    lineAlpha: 0.62,
    wall: 0x1b2744,
    wallOpacity: 0.48,
    trim: 0xffffff,
    stands: 0x111827,
    crowd: [0x1f2937, 0x0f172a, 0x243b53, 0x334155],
    concourse: 0x182033,
    road: 0x070a12,
    glass: 0x143257,
    warmGlass: 0x2a1d14,
    accentA: 0x12b9ff,
    accentB: 0xff8a1f,
    accentC: 0xf8fafc,
    fieldGlowA: 0x16c7ff,
    fieldGlowB: 0xff9a2b,
    lightBlue: 0x12b9ff,
    lightOrange: 0xff8a1f
  },
  neon: {
    label: "Neon Bowl",
    style: "neon",
    background: 0x07001f,
    fog: 0x160044,
    fogDensity: 0.0088,
    ambient: 0xd7faff,
    ambientIntensity: 0.58,
    sun: 0x7df9ff,
    sunIntensity: 1.12,
    sunPosition: [38, 78, 32],
    field: [8, 92, 105],
    iceField: [132, 236, 255],
    snookerField: [6, 76, 72],
    flyingField: [38, 20, 104],
    stripeAlpha: 0.085,
    lineAlpha: 0.82,
    wall: 0x250064,
    wallOpacity: 0.70,
    trim: 0xf0abfc,
    stands: 0x120032,
    crowd: [0x0891b2, 0x7e22ce, 0xbe123c, 0x0f766e],
    concourse: 0x1b064a,
    road: 0x07001a,
    glass: 0x081947,
    warmGlass: 0x33002f,
    accentA: 0x00f5ff,
    accentB: 0xff2bd6,
    accentC: 0xb7ff00,
    fieldGlowA: 0x00f5ff,
    fieldGlowB: 0xff2bd6,
    lightBlue: 0x00f5ff,
    lightOrange: 0xff2bd6
  },
  sunset: {
    label: "Sunset Arena",
    style: "sunset",
    background: 0x3a081e,
    fog: 0x6b1b1b,
    fogDensity: 0.0055,
    ambient: 0xffdfb7,
    ambientIntensity: 0.72,
    sun: 0xff9d44,
    sunIntensity: 1.42,
    sunPosition: [-58, 52, -22],
    field: [76, 132, 42],
    iceField: [255, 223, 192],
    snookerField: [52, 92, 37],
    flyingField: [87, 42, 86],
    stripeAlpha: 0.064,
    lineAlpha: 0.66,
    wall: 0x7a2546,
    wallOpacity: 0.60,
    trim: 0xffd166,
    stands: 0x4a1634,
    crowd: [0xf97316, 0xdb2777, 0x7c2d12, 0x4338ca],
    concourse: 0x5c1f39,
    road: 0x2b0d18,
    glass: 0x44204b,
    warmGlass: 0x5b2411,
    accentA: 0xffc857,
    accentB: 0xff4d6d,
    accentC: 0x7dd3fc,
    fieldGlowA: 0xffc857,
    fieldGlowB: 0xff4d6d,
    lightBlue: 0x45d9ff,
    lightOrange: 0xffb020
  },
  storm: {
    label: "Storm Dome",
    style: "storm",
    background: 0x010b16,
    fog: 0x0a2440,
    fogDensity: 0.0105,
    ambient: 0xc9e8ff,
    ambientIntensity: 0.50,
    sun: 0x9ed3ff,
    sunIntensity: 1.02,
    sunPosition: [18, 86, -45],
    field: [12, 105, 96],
    iceField: [142, 225, 255],
    snookerField: [8, 87, 66],
    flyingField: [21, 35, 72],
    stripeAlpha: 0.090,
    lineAlpha: 0.84,
    wall: 0x0d3a56,
    wallOpacity: 0.72,
    trim: 0xe0f2fe,
    stands: 0x06172a,
    crowd: [0x0f172a, 0x1e3a8a, 0x334155, 0x0e7490],
    concourse: 0x0a2238,
    road: 0x04101b,
    glass: 0x09243a,
    warmGlass: 0x152b3c,
    accentA: 0x7dd3fc,
    accentB: 0xa78bfa,
    accentC: 0xfacc15,
    fieldGlowA: 0x7dd3fc,
    fieldGlowB: 0xa78bfa,
    lightBlue: 0x7dd3fc,
    lightOrange: 0xf97316
  }
};

export const VEHICLE_CONFIGS = {
  default: {
    label: "Default Car",
    description: "Balanced original RLCSS car",
    drive: 1, brake: 1, reverse: 1, steer: 1, grip: 1, driftGrip: 1, driftTurn: 1,
    maxSpeed: 1, boost: 1, aerial: 1, jump: 1, mass: 1, hit: 1,
    body: [2.25, 0.9, 3.7], cabin: [1.55, 0.75, 1.55], cabinOffset: [0, 1.15, 0.18], nose: true, wheelScale: 1
  },
  sport: {
    label: "Sport Coupe",
    description: "Tiny bit sharper and lower",
    drive: 1.025, brake: 1.0, reverse: 0.99, steer: 1.04, grip: 0.99, driftGrip: 0.98, driftTurn: 1.03,
    maxSpeed: 1.01, boost: 1.01, aerial: 1.02, jump: 1.0, mass: 0.98, hit: 0.985,
    body: [2.12, 0.78, 3.95], cabin: [1.42, 0.62, 1.34], cabinOffset: [0, 1.04, 0.02], nose: true, wheelScale: 0.92
  },
  rally: {
    label: "Rally Buggy",
    description: "A little more steering and slide",
    drive: 1.0, brake: 0.98, reverse: 1.02, steer: 1.055, grip: 0.975, driftGrip: 0.93, driftTurn: 1.06,
    maxSpeed: 0.995, boost: 1.0, aerial: 1.0, jump: 1.01, mass: 0.99, hit: 0.995,
    body: [2.05, 0.84, 3.45], cabin: [1.25, 0.7, 1.12], cabinOffset: [0, 1.12, -0.12], nose: true, wheelScale: 1.08
  },
  truck: {
    label: "Mini Truck",
    description: "Slightly heavier with calmer turning",
    drive: 0.965, brake: 0.965, reverse: 0.98, steer: 0.94, grip: 1.025, driftGrip: 1.04, driftTurn: 0.95,
    maxSpeed: 0.985, boost: 0.985, aerial: 0.96, jump: 0.985, mass: 1.065, hit: 1.035,
    body: [2.55, 1.05, 4.05], cabin: [1.65, 1.0, 1.35], cabinOffset: [0, 1.35, -0.28], nose: true, wheelScale: 1.18
  },
  muscle: {
    label: "Muscle GT",
    description: "Stable straight-line power with a wider feel",
    drive: 1.01, brake: 0.99, reverse: 0.98, steer: 0.965, grip: 1.015, driftGrip: 1.01, driftTurn: 0.985,
    maxSpeed: 1.018, boost: 1.012, aerial: 0.985, jump: 0.995, mass: 1.035, hit: 1.018,
    body: [2.48, 0.88, 4.28], cabin: [1.48, 0.66, 1.38], cabinOffset: [0, 1.08, -0.10], nose: true, wheelScale: 1.04
  },
  van: {
    label: "Utility Van",
    description: "Boxier body with grippy, predictable handling",
    drive: 0.982, brake: 1.018, reverse: 0.99, steer: 0.985, grip: 1.035, driftGrip: 1.02, driftTurn: 0.975,
    maxSpeed: 0.992, boost: 0.992, aerial: 0.965, jump: 0.985, mass: 1.055, hit: 1.026,
    body: [2.38, 1.16, 3.92], cabin: [1.82, 0.94, 1.86], cabinOffset: [0, 1.42, 0.10], nose: false, wheelScale: 1.10
  }
};

export const PITCH_SIZE_CONFIGS = {
  compact: { label: "Compact", scale: 0.88 },
  standard: { label: "Standard", scale: 1 },
  wide: { label: "Wide", scale: 1.14 },
  stadium: { label: "Stadium XL", scale: 1.30 }
};

export const MATCH_LENGTH_OPTIONS = {
  60: { label: "1 minute", seconds: 60 },
  180: { label: "3 minutes", seconds: 180 },
  300: { label: "5 minutes", seconds: 300 },
  420: { label: "7 minutes", seconds: 420 },
  600: { label: "10 minutes", seconds: 600 },
  900: { label: "15 minutes", seconds: 900 }
};

export const DEFAULT_META = {
  mode: "standard",
  theme: "v10",
  teamSize: 1,
  pitchSize: "standard",
  difficulty: "pro",
  playstyle: "balanced",
  aiStrategy: "balanced",
  chatScope: "all",
  voiceScope: "team",
  paused: false,
  status: "waiting",
  matchLength: 300,
  halfTimeEnabled: false,
  hydrationEnabled: false,
  overtimeEnabled: false,
  goldenGoal: true,
  overtimeDuration: 180,
  aiTeamCommands: { enabled: false, smarterOpponents: true, commandStrength: "normal" },
  activeTeamCommands: {}
};

const BASE_FIELD_W = 72;
const BASE_FIELD_L = 112;
const WALL_H = 18;
const CEILING_H_STANDARD = 30;
const CEILING_H_FLYING = 42;
const BASE_GOAL_W = 22;
const GOAL_H = 9;
const GOAL_D = 8;

const BALL_RADIUS = 1.85;
// V48: slightly heavier, Rocket League-like ball response.
// Touches still carry power, but bounce, lift and hang time are trimmed.
const BALL_MAX_SPEED = 57;
const BALL_GRAVITY = 44;
const BALL_RESTITUTION = 0.64;
const BALL_HEAVY_IMPULSE_SCALE = 0.84;
const BALL_HEAVY_LIFT_SCALE = 0.58;
const BALL_VERTICAL_DAMPING = 0.982;
const BALL_AIR_DAMPING = 0.9986;
const BALL_GROUND_FRICTION = 0.9865;
const BALL_GROUND_SETTLE_SPEED = 1.85;
const BALL_GROUNDED_TOUCH_LIFT_CAP = 8.6;
const BALL_JUMP_TOUCH_LIFT_CAP = 12.4;
const BALL_NON_BOOST_HIT_SCALE = 0.86;
const BALL_BOOST_HIT_SCALE = 1.0;
const WALL_RESTITUTION = 0.76;
const WALL_TANGENT_DAMPING = 0.982;
const CEILING_RESTITUTION = 0.58;
const KICKOFF_COUNTDOWN_SECONDS = 5;

const CAR_HALF_X = 1.35;
const CAR_HALF_Y = 0.58;
const CAR_HALF_Z = 2.25;
const CAR_RADIUS = 2.35;
const CAR_GROUND_Y = CAR_HALF_Y + 0.08;
const GRAVITY = 44;
const BOOST_MAX = 100;
const BOOST_PAD_RADIUS_SMALL = 1.42;
const BOOST_PAD_RADIUS_BIG = 2.08;
// V38: slightly tighter boost economy. Everyone now starts with the same
// amount and the tank drains a little faster, so kickoff/boost-pad decisions
// matter more without making boost feel scarce.
const STARTING_BOOST = 28;
const BOOST_DRAIN_GROUND = 38;
const BOOST_DRAIN_AIR = 32;
const BOOST_DRAIN_FLYING = 34;
const DOUBLE_JUMP_VELOCITY = 17.2;
const DOUBLE_JUMP_FORWARD_KICK = 6.3;
const MATCH_TICKS_PER_WRITE = 4;
const KICKOFF_SPAWN_RADIUS = 40;

// V28: Rocket League-style feel pass. The numbers still preserve the V10 baseline,
// but make standard handling more immediate, more predictable, and less floaty.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angleNorm = a => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (current, target, sharpness, dt) => current + (target - current) * (1 - Math.exp(-sharpness * dt));
const horizontalSpeed = c => Math.hypot(c.vx, c.vz);
const fwdFromYaw = yaw => ({ x: Math.sin(yaw), z: Math.cos(yaw) });
const rightFromYaw = yaw => ({ x: Math.cos(yaw), z: -Math.sin(yaw) });
const dot2 = (ax, az, bx, bz) => ax * bx + az * bz;

export function getArenaSize(mode = "standard", teamSize = 1, pitchSize = "standard") {
  const cfg = MODE_CONFIGS[mode] || MODE_CONFIGS.standard;
  const n = clamp(Number(teamSize) || 1, 1, 5);
  const pitchCfg = PITCH_SIZE_CONFIGS[pitchSize] || PITCH_SIZE_CONFIGS.standard;
  // Match the pre-multiplayer V10 baseline: 1v1 standard is 72 x 112.
  // Team size still scales the arena, and the new pitch setting applies a
  // separate multiplier for custom compact/wide/stadium matches.
  const teamScale = 1 + (n - 1) * 0.16;
  const flyingScale = mode === "flying" ? 1.08 : 1;
  const pitchScale = pitchCfg.scale || 1;
  return {
    w: BASE_FIELD_W * teamScale * flyingScale * pitchScale,
    l: BASE_FIELD_L * teamScale * flyingScale * pitchScale,
    wallH: WALL_H,
    ceilingH: mode === "flying" ? CEILING_H_FLYING : CEILING_H_STANDARD,
    goalW: BASE_GOAL_W * (1 + (n - 1) * 0.055) * Math.sqrt(pitchScale),
    goalH: GOAL_H,
    goalD: GOAL_D,
    floorRoughness: cfg.floorRoughness,
    floorMetalness: cfg.floorMetalness
  };
}

function makeBoostPads(arena, mode = "standard") {
  const standardRaw = [
    [-arena.w * 0.40, -arena.l * 0.32, 100], [arena.w * 0.40, -arena.l * 0.32, 100],
    [-arena.w * 0.40, arena.l * 0.32, 100], [arena.w * 0.40, arena.l * 0.32, 100],
    [-arena.w * 0.20, -arena.l * 0.16, 36], [arena.w * 0.20, -arena.l * 0.16, 36],
    [-arena.w * 0.20, arena.l * 0.16, 36], [arena.w * 0.20, arena.l * 0.16, 36],
    [-arena.w * 0.43, 0, 36], [arena.w * 0.43, 0, 36]
  ];
  const fullRaw = [
    [0, 0, 100], [-arena.w * 0.35, 0, 100], [arena.w * 0.35, 0, 100],
    [-arena.w * 0.40, -arena.l * 0.32, 100], [arena.w * 0.40, -arena.l * 0.32, 100],
    [-arena.w * 0.40, arena.l * 0.32, 100], [arena.w * 0.40, arena.l * 0.32, 100],
    [-arena.w * 0.20, -arena.l * 0.16, 36], [arena.w * 0.20, -arena.l * 0.16, 36],
    [-arena.w * 0.20, arena.l * 0.16, 36], [arena.w * 0.20, arena.l * 0.16, 36],
    [-arena.w * 0.43, 0, 36], [arena.w * 0.43, 0, 36],
    [-arena.w * 0.14, -arena.l * 0.34, 36], [arena.w * 0.14, arena.l * 0.34, 36]
  ];
  const raw = mode === "standard" ? standardRaw : fullRaw;
  return raw.map(([x, z, amount], i) => ({
    id: `pad_${i}`,
    x: clamp(x, -arena.w / 2 + 5, arena.w / 2 - 5),
    z: clamp(z, -arena.l / 2 + 8, arena.l / 2 - 8),
    y: 0,
    radius: amount >= 100 ? BOOST_PAD_RADIUS_BIG : BOOST_PAD_RADIUS_SMALL,
    amount,
    big: amount >= 100,
    active: true,
    timer: 0,
    respawn: amount >= 100 ? 10 : 5
  }));
}

export function maxHumansFor(mode, teamSize) {
  const cfg = MODE_CONFIGS[mode] || MODE_CONFIGS.standard;
  return cfg.maxHumans(clamp(Number(teamSize) || 1, 1, 5));
}


function sanitiseAiTuning(raw = {}) {
  const out = { blue: {}, orange: {} };
  for (const team of ["blue", "orange"]) {
    const src = raw?.[team] || {};
    for (const [slot, cfg] of Object.entries(src)) {
      const n = clamp(Number(slot), 0, 4);
      const clean = {};
      for (const field of ["aggression", "defence", "boost"]) {
        if (["low", "normal", "high"].includes(cfg?.[field])) clean[field] = cfg[field];
      }
      if (Object.keys(clean).length) out[team][n] = clean;
    }
  }
  return out;
}

function sanitiseAiTeamCommandSettings(raw = {}) {
  const inputMode = ["quick", "push", "alwaysMatch", "alwaysLobbyMatch"].includes(raw.inputMode) ? raw.inputMode : "quick";
  const commandStrength = ["subtle", "normal", "strong"].includes(raw.commandStrength) ? raw.commandStrength : "normal";
  return {
    enabled: !!raw.enabled,
    inputMode,
    serverAiEnabled: !!raw.serverAiEnabled,
    voiceEnabled: inputMode !== "quick",
    serverSttEnabled: !!raw.serverSttEnabled,
    showTranscript: raw.showTranscript !== false,
    showAcknowledgements: raw.showAcknowledgements !== false,
    commandStrength,
    smarterOpponents: raw.smarterOpponents !== false,
    sameTeamOnly: raw.sameTeamOnly !== false
  };
}

const AI_COMMAND_INTENTS = new Set(["ATTACK_BALL", "TAKE_SHOT", "DEFEND_GOAL", "ROTATE_BACK", "CLEAR_BALL", "PASS_LEFT", "PASS_RIGHT", "GET_BOOST", "GOALKEEPER_HOLD", "TEAM_PRESS", "MARK_OPPONENT", "SPREAD_OUT", "CENTER_BALL", "HOLD_POSITION", "SUPPORT_ME"]);
function sanitiseActiveTeamCommands(raw = {}) {
  const now = Date.now();
  const out = { blue: [], orange: [] };
  for (const team of ["blue", "orange"]) {
    const src = raw?.[team] || {};
    const list = Array.isArray(src) ? src : Object.values(src);
    out[team] = list.filter(cmd => cmd && AI_COMMAND_INTENTS.has(cmd.intent) && Number(cmd.expiresAt || 0) > now - 1000).slice(-6).map(cmd => ({
      intent: cmd.intent, target: String(cmd.target || "all").slice(0, 24), strength: clamp(Number(cmd.strength ?? 0.75), 0.1, 1), confidence: clamp(Number(cmd.confidence ?? 1), 0, 1), createdAt: Number(cmd.createdAt || now), expiresAt: Number(cmd.expiresAt || now + 6000), issuedBy: String(cmd.issuedBy || "").slice(0, 64)
    }));
  }
  return out;
}

function sanitiseAiRoles(raw = {}) {
  const out = { blue: {}, orange: {} };
  for (const team of ["blue", "orange"]) {
    const src = raw?.[team] || {};
    for (const [slot, role] of Object.entries(src)) {
      const n = clamp(Number(slot), 0, 4);
      if (ROLES.includes(role)) out[team][n] = role;
    }
  }
  return out;
}

export function serialiseMeta(meta = {}) {
  const out = { ...DEFAULT_META, ...meta };
  out.teamSize = clamp(Number(out.teamSize) || 1, 1, 5);
  if (!PITCH_SIZE_CONFIGS[out.pitchSize]) out.pitchSize = "standard";
  out.matchLength = clamp(Math.round(Number(out.matchLength) || DEFAULT_META.matchLength), 60, 1800);
  if (!MODE_CONFIGS[out.mode]) out.mode = "standard";
  if (!["rookie", "pro", "allstar"].includes(out.difficulty)) out.difficulty = "pro";
  if (!["balanced", "defensive", "aggressive", "chaotic"].includes(out.playstyle)) out.playstyle = "balanced";
  if (!["balanced", "defensive", "aggressive", "rotational", "chaotic"].includes(out.aiStrategy)) out.aiStrategy = out.playstyle || "balanced";
  out.aiTuning = sanitiseAiTuning(out.aiTuning);
  out.aiRoles = sanitiseAiRoles(out.aiRoles);
  if (!STADIUM_THEMES[out.theme]) out.theme = "v10";
  if (!["all", "team"].includes(out.chatScope)) out.chatScope = "all";
  if (!["all", "team", "off"].includes(out.voiceScope)) out.voiceScope = "team";
  out.paused = !!out.paused;
  out.halfTimeEnabled = !!out.halfTimeEnabled && out.matchLength >= 120;
  out.hydrationEnabled = !!out.hydrationEnabled && out.matchLength >= 180;
  out.overtimeEnabled = !!out.overtimeEnabled;
  out.goldenGoal = out.goldenGoal !== false;
  out.overtimeDuration = out.overtimeDuration === "unlimited" ? "unlimited" : clamp(Math.round(Number(out.overtimeDuration) || 180), 60, 300);
  out.aiTeamCommands = sanitiseAiTeamCommandSettings(out.aiTeamCommands);
  out.activeTeamCommands = sanitiseActiveTeamCommands(out.activeTeamCommands);
  return out;
}

export function defaultRoleForSlot(i, teamSize) {
  if (teamSize <= 1) return "balanced";
  if (i === 0) return "goalkeeper";
  if (teamSize >= 4 && i === 1) return "defence";
  if (i === teamSize - 1) return "attack";
  return "midfield";
}

export function sanitiseVehicleModel(model) {
  return VEHICLE_CONFIGS[model] ? model : "default";
}

function aiVehicleForSlot(team, i, role) {
  if (role === "balanced") return i % 2 ? "rally" : "default";
  if (role === "goalkeeper") return i % 2 ? "van" : "truck";
  if (role === "defence") return i % 2 ? "rally" : "van";
  if (role === "midfield") return i % 2 ? "sport" : "rally";
  return team === "blue" ? (i % 3 === 0 ? "muscle" : i % 2 ? "sport" : "default") : (i % 3 === 0 ? "muscle" : i % 2 ? "rally" : "sport");
}

export function makeInitialState(meta, players = {}) {
  const cleanMeta = serialiseMeta(meta);
  const arena = getArenaSize(cleanMeta.mode, cleanMeta.teamSize, cleanMeta.pitchSize);
  const kickoffVariant = cleanMeta.teamSize <= 1 ? makeKickoffVariant(arena) : null;
  const humans = Object.entries(players).map(([id, p]) => ({ id, ...p }));
  const cars = {};
  let slotIndex = 0;
  for (const team of ["blue", "orange"]) {
    const teamHumans = humans.filter(p => p.team === team).slice(0, cleanMeta.teamSize);
    for (let i = 0; i < cleanMeta.teamSize; i++) {
      const human = teamHumans[i];
      const id = human ? human.id : `AI_${team}_${i}`;
      const configuredAiRole = cleanMeta.aiRoles?.[team]?.[i];
      const humanRole = ROLES.includes(human?.role) ? human.role : null;
      const role = humanRole || configuredAiRole || defaultRoleForSlot(i, cleanMeta.teamSize);
      const spawn = kickoffSpawn(team, i, cleanMeta.teamSize, arena, role, !!human, kickoffVariant);
      const model = human ? sanitiseVehicleModel(human.model || human.vehicle || human.carModel) : aiVehicleForSlot(team, i, role);
      cars[id] = makeCar(id, team, role, !!human, human?.name || aiName(team, role, i), spawn.x, spawn.z, spawn.yaw, slotIndex++, model);
    }
  }
  return {
    version: 3,
    tick: 0,
    timeLeft: cleanMeta.matchLength,
    score: { blue: 0, orange: 0 },
    mode: cleanMeta.mode,
    theme: cleanMeta.theme,
    teamSize: cleanMeta.teamSize,
    pitchSize: cleanMeta.pitchSize,
    arena,
    kickoffVariant,
    ball: { x: 0, y: BALL_RADIUS, z: 0, vx: 0, vy: 0, vz: 0, rx: 0, rz: 0, lastTouchTick: 0, lastTouchCar: null, lastTouchImpulse: 0 },
    boostPads: makeBoostPads(arena, cleanMeta.mode),
    cars,
    aiBlackboard: makeAiBlackboardState(),
    goalFlash: null,
    sound: { roundSerial: 1, roundTick: 0, goalTick: 0, goalTeam: null, ballHitTick: 0, ballHitImpulse: 0, wallHitTick: 0, wallHitSpeed: 0, bounceTick: 0, bounceSpeed: 0, boostPadTick: 0, boostPadBig: false, boostPadCar: null, carBumpTick: 0, carBumpImpulse: 0 },
    kickoffTimer: KICKOFF_COUNTDOWN_SECONDS,
    break: null,
    halfTimeTriggered: false,
    hydrationTriggered: false,
    overtime: null,
    demoSerial: 0,
    ended: false
  };
}

function aiName(team, role, i) {
  const prefix = team === "blue" ? "Blue" : "Orange";
  const roleName = role === "balanced" ? "Flex" : role === "goalkeeper" ? "GK" : role === "defence" ? "Back" : role === "midfield" ? "Mid" : "Striker";
  return `${prefix} ${roleName} ${i + 1}`;
}

function laneOffset(index, count, spacing) {
  if (count <= 1) return 0;
  return (index - (count - 1) / 2) * spacing;
}

function makeKickoffVariant(arena) {
  // V38: 1v1 kickoffs now choose a Rocket League-like symmetric spawn around
  // the centre ball. The distance from centre remains the old 40-unit baseline,
  // but the angle can be straight-on or diagonal and is mirrored for the teams.
  const radius = Math.min(KICKOFF_SPAWN_RADIUS, Math.max(24, arena.l * 0.36));
  if (Math.random() < 0.38) return { kind: "straight", radius, side: 0, x: 0, z: radius };
  const side = Math.random() < 0.5 ? -1 : 1;
  const x = clamp(radius * 0.56, 12, Math.max(12, arena.w / 2 - 10));
  const z = Math.sqrt(Math.max(16, radius * radius - x * x));
  return { kind: "diagonal", radius, side, x, z };
}

function normaliseKickoffVariant(raw, arena) {
  if (!raw || typeof raw !== "object") return makeKickoffVariant(arena);
  const radius = Math.min(KICKOFF_SPAWN_RADIUS, Math.max(24, arena.l * 0.36));
  const kind = raw.kind === "diagonal" ? "diagonal" : "straight";
  const side = raw.side < 0 ? -1 : raw.side > 0 ? 1 : 0;
  if (kind === "straight" || !side) return { kind: "straight", radius, side: 0, x: 0, z: radius };
  const x = clamp(Math.abs(Number(raw.x) || radius * 0.56), 12, Math.max(12, arena.w / 2 - 10));
  const z = clamp(Number(raw.z) || Math.sqrt(Math.max(16, radius * radius - x * x)), 8, radius);
  return { kind: "diagonal", radius, side, x, z };
}

function kickoffSpawn(team, i, teamSize, arena, role = "attack", human = false, kickoffVariant = null) {
  const blue = team === "blue";
  const sign = blue ? -1 : 1;
  const yaw = blue ? 0 : Math.PI;
  if (teamSize <= 1) {
    const variant = normaliseKickoffVariant(kickoffVariant, arena);
    const blueX = variant.kind === "diagonal" ? variant.side * variant.x : 0;
    const blueZ = -variant.z;
    return blue
      ? { x: blueX, z: blueZ, yaw }
      : { x: -blueX, z: -blueZ, yaw };
  }
  const roleDepth = { goalkeeper: 0.43, defence: 0.33, midfield: 0.24, balanced: 0.21, attack: 0.17 };
  const roles = Array.from({ length: teamSize }, (_, idx) => idx === i ? role : defaultRoleForSlot(idx, teamSize));
  const sameRoleCount = roles.filter(r => r === role).length;
  const roleIndex = roles.slice(0, i + 1).filter(r => r === role).length - 1;
  const spacing = Math.min(17, Math.max(9, arena.w / 6.2));
  let x = laneOffset(roleIndex, sameRoleCount, spacing);
  let z = sign * arena.l * (roleDepth[role] ?? 0.24);
  if (human) {
    x = 0;
    z = sign * arena.l * 0.36;
  } else if (role === "goalkeeper") {
    x *= 0.45;
  } else if (role === "balanced") {
    z = sign * arena.l * 0.20;
  } else if (role === "attack") {
    z = sign * arena.l * 0.16;
  }
  return { x: clamp(x, -arena.w / 2 + 8, arena.w / 2 - 8), z, yaw };
}

function makeCar(id, team, role, human, name, x, z, yaw, slotIndex, model = "default") {
  return {
    id, team, role, human, name, slotIndex, model: sanitiseVehicleModel(model),
    x, y: CAR_GROUND_Y, z,
    vx: 0, vy: 0, vz: 0,
    yaw,
    pitch: 0,
    roll: 0,
    yawVel: 0,
    pitchVel: 0,
    rollVel: 0,
    grounded: true,
    onGround: true,
    boost: STARTING_BOOST,
    boosting: false,
    boostHeld: 0,
    demoed: false,
    demoTimer: 0,
    drifting: false,
    boostPickup: 0,
    jumpCooldown: 0,
    jumpLatch: false,
    doubleJumpUsed: false,
    justJumped: false,
    jumpEventTick: 0,
    doubleJumpEventTick: 0,
    cueCooldown: 0,
    bumpCooldown: 0,
    lastTouch: null,
    aiTimer: 0,
    aiNoiseSeed: Math.random() * 99,
    aiMemory: makeAiMemory(),
    aiPlan: makeAiPlan("support", "spawn", { x, z }, 0, { reason: "spawn" }),
    aiTargetX: 0,
    aiTargetZ: 0
  };
}

export function inputFromKeys(keys, bind) {
  const pressed = code => !!keys[bind[code]];
  // Match the V10 human steering convention: positive steer turns screen-left.
  return {
    throttle: (pressed("forward") ? 1 : 0) + (pressed("backward") ? -1 : 0),
    steer: (pressed("left") ? 1 : 0) + (pressed("right") ? -1 : 0),
    boost: pressed("boost"),
    jump: pressed("jump"),
    drift: pressed("drift"),
    airRollLeft: pressed("airRollLeft"),
    airRollRight: pressed("airRollRight"),
    airRoll: pressed("airRoll"),
    pitchUp: pressed("pitchUp"),
    pitchDown: pressed("pitchDown"),
    yawLeft: pressed("yawLeft"),
    yawRight: pressed("yawRight"),
    cam: pressed("cam"),
    reset: pressed("reset")
  };
}

export function defaultBindings() {
  return {
    forward: "KeyW",
    backward: "KeyS",
    left: "KeyA",
    right: "KeyD",
    boost: "ShiftLeft",
    jump: "Space",
    drift: "ControlLeft",
    airRollLeft: "KeyQ",
    airRollRight: "KeyE",
    airRoll: "ControlLeft",
    pitchUp: "KeyS",
    pitchDown: "KeyW",
    yawLeft: "KeyA",
    yawRight: "KeyD",
    cam: "KeyB",
    reset: "KeyR",
    pause: "KeyP",
    chat: "KeyT",
    voice: "KeyV",
    mic: "KeyM",
    aiCommand: "KeyC"
  };
}


function aiSkill(meta) {
  const d = meta.difficulty || "pro";
  // V34: the difficulty levels now change how early bots read the play, how
  // cleanly they aim/rotate, and how often they make human-like errors. Rookie
  // deliberately hesitates and over-commits sometimes; Pro rotates and saves;
  // All-Star anticipates touches and chooses boost/aerials much more reliably.
  return d === "rookie"
    ? { think: 0.20, aim: 0.78, speed: 0.83, boost: 0.50, jump: 0.44, error: 5.8, read: 0.50, rotation: 0.58, challenge: 0.70, patience: 0.46, aerial: 0.28, save: 0.68, mistake: 0.22, kickoff: 0.56, intercept: 0.56, discipline: 0.58, shot: 0.64, fake: 0.12, recovery: 0.60, wallRead: 0.58, aerialBoost: 0.12, fastAerial: 0.04, padRouting: 0.34, recoveryAirRoll: 0.30, commit: 0.54 }
    : d === "allstar"
      ? { think: 0.032, aim: 1.38, speed: 1.20, boost: 1.24, jump: 1.08, error: 0.48, read: 1.34, rotation: 1.38, challenge: 1.22, patience: 1.12, aerial: 1.10, save: 1.34, mistake: 0.025, kickoff: 1.08, intercept: 1.42, discipline: 1.36, shot: 1.34, fake: 0.46, recovery: 1.36, wallRead: 1.34, aerialBoost: 1.10, fastAerial: 1.00, padRouting: 1.10, recoveryAirRoll: 1.08, commit: 1.18 }
      : { think: 0.070, aim: 1.10, speed: 1.06, boost: 0.98, jump: 0.76, error: 1.95, read: 0.92, rotation: 1.02, challenge: 0.98, patience: 0.82, aerial: 0.70, save: 1.00, mistake: 0.09, kickoff: 1.00, intercept: 1.00, discipline: 0.98, shot: 0.98, fake: 0.26, recovery: 1.02, wallRead: 0.98, aerialBoost: 0.62, fastAerial: 0.46, padRouting: 0.78, recoveryAirRoll: 0.78, commit: 0.86 };
}

function styleConfig(meta) {
  const p = meta.aiStrategy || meta.playstyle || "balanced";
  return p === "defensive"
    ? { attack: 0.70, defence: 1.52, chase: 0.76, chaos: 0, rotation: 0.82, support: 1.22, boostDiscipline: 1.18 }
    : p === "aggressive"
      ? { attack: 1.52, defence: 0.74, chase: 1.22, chaos: 0, rotation: 0.72, support: 0.88, boostDiscipline: 0.90 }
      : p === "rotational"
        ? { attack: 1.08, defence: 1.14, chase: 0.90, chaos: 0, rotation: 1.32, support: 1.18, boostDiscipline: 1.08 }
        : p === "chaotic"
          ? { attack: 1.16, defence: 0.84, chase: 1.48, chaos: 1, rotation: 0.42, support: 0.70, boostDiscipline: 0.72 }
          : { attack: 1, defence: 1, chase: 1, chaos: 0, rotation: 1, support: 1, boostDiscipline: 1 };
}

function roleConfig(role = "attack") {
  return role === "balanced"
    ? { attack: 1.04, defence: 1.06, challenge: 1.00, support: 1.06, rotation: 1.08, boostNeed: 1.00, width: 0.30, depth: 0.30, patience: 1.00, aerial: 1.00, discipline: 1.06 }
    : role === "goalkeeper"
      ? { attack: 0.34, defence: 1.62, challenge: 0.42, support: 0.70, rotation: 1.18, boostNeed: 0.64, width: 0.18, depth: 0.09, patience: 1.36, aerial: 0.76, discipline: 1.34 }
      : role === "defence"
        ? { attack: 0.62, defence: 1.30, challenge: 0.72, support: 0.86, rotation: 1.18, boostNeed: 0.88, width: 0.28, depth: 0.17, patience: 1.12, aerial: 0.88, discipline: 1.18 }
        : role === "midfield"
          ? { attack: 0.96, defence: 1.02, challenge: 0.96, support: 1.18, rotation: 1.08, boostNeed: 1.00, width: 0.34, depth: 0.32, patience: 0.98, aerial: 1.02, discipline: 1.02 }
          : { attack: 1.32, defence: 0.76, challenge: 1.18, support: 0.88, rotation: 0.92, boostNeed: 1.08, width: 0.26, depth: 0.46, patience: 0.78, aerial: 1.08, discipline: 0.84 };
}

function activeCommandForCar(meta, car) {
  const list = meta?.activeTeamCommands?.[car.team] || [];
  const now = Date.now();
  return list.filter(cmd => cmd && cmd.expiresAt > now && (cmd.target === "all" || String(cmd.target || "").toLowerCase() === String(car.role || "").toLowerCase() || String(cmd.target || "").toLowerCase() === String(car.id || "").toLowerCase()))
    .sort((a, b) => (b.strength * b.confidence) - (a.strength * a.confidence))[0] || null;
}

function opponentCommandBoost(meta, car, players = {}) {
  const cfg = meta?.aiTeamCommands || {};
  if (!cfg.enabled || !cfg.smarterOpponents || car.human) return 1;
  const humans = Object.values(players || {}).filter(p => p && !p.localAi);
  if (!humans.length) return 1;
  const opponentHumans = humans.filter(p => (p.team || "blue") !== car.team);
  const sameTeamHumans = humans.filter(p => (p.team || "blue") === car.team);
  if (sameTeamHumans.length || !opponentHumans.length) return 1;
  return meta.difficulty === "allstar" ? 1.18 : meta.difficulty === "pro" ? 1.11 : 1.04;
}

function aiTuningForCar(meta, car) {
  const match = String(car.id || "").match(/^AI_(blue|orange)_(\d+)$/);
  const slot = match ? Number(match[2]) : Math.max(0, Number(car.slotIndex || 0) % Math.max(1, Number(meta.teamSize || 1)));
  const raw = meta.aiTuning?.[car.team]?.[slot] || {};
  const factor = value => value === "high" ? 1.18 : value === "low" ? 0.84 : 1;
  return {
    aggression: factor(raw.aggression),
    defence: factor(raw.defence),
    boost: factor(raw.boost)
  };
}

function predictBall(state, seconds) {
  const cfg = MODE_CONFIGS[state.mode] || MODE_CONFIGS.standard;
  const p = { x: state.ball.x, y: state.ball.y, z: state.ball.z };
  const v = { x: state.ball.vx, y: state.ball.vy, z: state.ball.vz };
  const simDt = 1 / 45;
  let t = 0;
  while (t < seconds) {
    const step = Math.min(simDt, seconds - t);
    v.y -= BALL_GRAVITY * cfg.ballGravity * step;
    v.y *= Math.pow(BALL_VERTICAL_DAMPING, step * 120);
    const airD = Math.pow(BALL_AIR_DAMPING, step * 120);
    v.x *= airD; v.y *= airD; v.z *= airD;
    p.x += v.x * step; p.y += v.y * step; p.z += v.z * step;
    if (p.y < BALL_RADIUS) {
      p.y = BALL_RADIUS;
      if (v.y < -BALL_GROUND_SETTLE_SPEED) v.y *= -Math.min(0.88, BALL_RESTITUTION * cfg.ballRestitution);
      else if (v.y < 0) v.y = 0;
      const pf = 1 - (1 - BALL_GROUND_FRICTION) * cfg.ballFriction;
      const pd = Math.pow(pf, step * 120);
      v.x *= pd; v.z *= pd;
    }
    if (Math.abs(p.x) > state.arena.w / 2 - BALL_RADIUS) {
      p.x = Math.sign(p.x) * (state.arena.w / 2 - BALL_RADIUS);
      v.x *= -Math.min(0.94, WALL_RESTITUTION * cfg.wallRestitution);
    }
    const mouthX = Math.abs(p.x) < state.arena.goalW / 2 - BALL_RADIUS * 0.45;
    const mouthY = p.y < state.arena.goalH - BALL_RADIUS * 0.35;
    const zLim = mouthX && mouthY ? state.arena.l / 2 + state.arena.goalD - BALL_RADIUS : state.arena.l / 2 - BALL_RADIUS;
    if (Math.abs(p.z) > zLim) {
      p.z = Math.sign(p.z) * zLim;
      v.z *= -Math.min(0.94, WALL_RESTITUTION * cfg.wallRestitution);
    }
    t += step;
  }
  return p;
}

function ballAt(state, seconds) {
  return seconds <= 0.01 ? { x: state.ball.x, y: state.ball.y, z: state.ball.z } : predictBall(state, seconds);
}

function distance2(a, b) {
  return Math.hypot((a.x || 0) - (b.x || 0), (a.z || 0) - (b.z || 0));
}

function carSpeed2(car) {
  return Math.hypot(car.vx || 0, car.vz || 0);
}

function teamCars(state, team) {
  return Object.values(state.cars || {}).filter(c => c.team === team);
}

function opponentCars(state, team) {
  return Object.values(state.cars || {}).filter(c => c.team !== team);
}

function rolePriority(role) {
  return role === "attack" ? -0.18 : role === "balanced" ? -0.04 : role === "midfield" ? 0.02 : role === "defence" ? 0.22 : 0.48;
}

function aiCarEta(car, target, state, skill, danger01 = 0, opts = {}) {
  const d = distance2(car, target);
  const speed = carSpeed2(car);
  const fwd = fwdFromYaw(car.yaw || 0);
  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const frontDot = d > 0.001 ? (dx * fwd.x + dz * fwd.z) / d : 1;
  const turnPenalty = clamp((1 - frontDot) * 0.22, 0, 0.40);
  let rolePenalty = rolePriority(car.role) / Math.max(0.35, skill.rotation);
  if (car.role === "goalkeeper" && danger01 > 0.62) rolePenalty -= 0.38;
  if (car.role === "defence" && danger01 > 0.52) rolePenalty -= 0.24;
  if (car.boost < 8 && d > 18) rolePenalty += 0.16;
  let routePenalty = 0;
  if (opts.routeAware) {
    const risk = opts.routeRisk || routeRisk(car, state, target, { skill, intent: opts.intent || "intercept", touchPoint: opts.touchPoint || target });
    routePenalty = risk.blocked && !risk.reachesBallFirst
      ? clamp(risk.risk * (risk.human ? 0.56 : 0.38) + (risk.hardBlock ? 0.24 : 0), 0, 0.78)
      : clamp(risk.risk * 0.12, 0, 0.16);
  }
  return d / (13 + speed * 0.34 + skill.speed * 7.5) + turnPenalty + rolePenalty + routePenalty;
}

function aiRankForBall(car, state, skill, danger01) {
  const ball = state.ball;
  const predicted = ballAt(state, clamp(0.18 + distance2(car, ball) / 98 * skill.read, 0.12, 1.35));
  const mates = teamCars(state, car.team)
    .map(c => ({ id: c.id, eta: aiCarEta(c, predicted, state, skill, danger01) }))
    .sort((a, b) => a.eta - b.eta);
  return Math.max(0, mates.findIndex(v => v.id === car.id));
}

function opponentEtaTo(state, team, target, skill, danger01) {
  const opponents = opponentCars(state, team);
  if (!opponents.length) return Infinity;
  return Math.min(...opponents.map(c => aiCarEta(c, target, state, skill, danger01)));
}

function teamEtaTo(state, team, target, skill, danger01, ignoreId = null) {
  const mates = teamCars(state, team).filter(c => c.id !== ignoreId);
  if (!mates.length) return Infinity;
  return Math.min(...mates.map(c => aiCarEta(c, target, state, skill, danger01)));
}

function makeAiMemory() {
  return {
    lastPlanTick: 0,
    currentPlanId: 0,
    committedUntil: 0,
    rotatingOutUntil: 0,
    fakeChallengeUntil: 0,
    lastTouchTick: 0,
    lastMissTick: 0,
    lastJumpTick: 0,
    lastAerialTick: 0,
    lastBoostPadTick: 0,
    lastRecoveryTick: 0,
    lastDemoAttemptTick: 0,
    stuckTicks: 0,
    wallContactTick: -9999,
    wallNormalX: 0,
    wallNormalZ: 0,
    wallImpactSpeed: 0,
    lastBumpTick: -9999,
    lastBumpCar: null,
    bumpNormalX: 0,
    bumpNormalZ: 0,
    avoidUntil: 0,
    avoidSide: 0,
    avoidCarId: null,
    avoidReason: "",
    yieldUntil: 0,
    yieldCarId: null,
    lastObservedBallTouchTick: 0,
    lastObservedBallTouchCar: null,
    lastRouteProgress: Infinity,
    noProgressTicks: 0
  };
}

function ensureAiMemory(car) {
  if (!car.aiMemory || typeof car.aiMemory !== "object") car.aiMemory = makeAiMemory();
  return car.aiMemory;
}

function makeAiPlan(intent = "support", stateName = "support", target = { x: 0, z: 0 }, expiresTick = 0, extra = {}) {
  const tx = Number(target?.x) || 0;
  const ty = Number(target?.y) || 0;
  const tz = Number(target?.z) || 0;
  return {
    id: Number(extra.id || 0),
    role: extra.role || "balanced",
    teamSlot: extra.teamSlot || "unassigned",
    intent,
    state: stateName,
    target: { x: tx, y: ty, z: tz },
    x: tx,
    y: ty,
    z: tz,
    interceptTime: Number(extra.interceptTime || 0),
    confidence: clamp(Number(extra.confidence ?? 0.5), 0, 1),
    mechanic: extra.mechanic || "drive_to_target",
    expiresTick,
    precise: !!extra.precise,
    reason: extra.reason || intent
  };
}

function makeTeamBlackboard(team) {
  return {
    team,
    tick: -9999,
    danger: 0,
    opportunity: 0,
    ballInfo: null,
    ballPrediction: [],
    bestIntercept: null,
    firstManId: null,
    secondManId: null,
    thirdManId: null,
    goalkeeperId: null,
    slotsById: {},
    etasById: {},
    openShot: false,
    bestShotTarget: null,
    bestPass: null,
    defensiveShapeBroken: false,
    teamOvercommitted: false,
    boostStarved: false
  };
}

function makeAiBlackboardState() {
  return {
    blue: makeTeamBlackboard("blue"),
    orange: makeTeamBlackboard("orange")
  };
}

function buildBallPrediction(state, horizon = 1.4, step = 0.18) {
  const points = [];
  let prev = { x: state.ball.x, y: state.ball.y, z: state.ball.z };
  let prevT = 0;
  for (let t = step; t <= horizon + 0.001; t += step) {
    const p = predictBall(state, t);
    const dt = Math.max(0.001, t - prevT);
    const point = {
      t,
      x: p.x,
      y: p.y,
      z: p.z,
      vx: (p.x - prev.x) / dt,
      vy: (p.y - prev.y) / dt,
      vz: (p.z - prev.z) / dt,
      bounce: p.y <= BALL_RADIUS + 0.08 && prev.y > BALL_RADIUS + 0.22,
      wall: Math.abs(p.x) > state.arena.w / 2 - BALL_RADIUS * 1.3 || Math.abs(p.z) > state.arena.l / 2 - BALL_RADIUS * 1.3
    };
    points.push(point);
    prev = p;
    prevT = t;
  }
  return points;
}

function classifyBallState(state, team, prediction = []) {
  const b = state.ball;
  const ownSign = team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const future = prediction.find(p => p.t >= 0.72) || prediction[prediction.length - 1] || b;
  const ownGoalZ = ownSign * (state.arena.l / 2 - 5.4);
  const enemyGoalZ = enemySign * (state.arena.l / 2 - 7.2);
  const speed2 = Math.hypot(b.vx || 0, b.vz || 0);
  const movingTowardOwnGoal = ownSign * (b.vz || 0) > 1.6 || ownSign * (future.z - b.z) > 4.5;
  const movingTowardEnemyGoal = enemySign * (b.vz || 0) > 1.6 || enemySign * (future.z - b.z) > 4.5;
  const nearOwnGoal = ownSign * b.z > state.arena.l * 0.24 || Math.abs(b.z - ownGoalZ) < state.arena.l * 0.24;
  const nearEnemyGoal = enemySign * b.z > state.arena.l * 0.24 || Math.abs(b.z - enemyGoalZ) < state.arena.l * 0.22;
  const central = Math.abs(b.x) < state.arena.goalW * 0.58;
  const highThreat = b.y < state.arena.goalH + 3.2 && future.y < state.arena.goalH + 3.8;
  return {
    rolling: b.y <= BALL_RADIUS + 0.35 && Math.abs(b.vy || 0) < 2.2,
    bouncing: b.y > BALL_RADIUS + 0.35 || Math.abs(b.vy || 0) > 2.2,
    aerial: b.y > 5.0 || future.y > 5.8,
    wallBall: Math.abs(b.x) > state.arena.w * 0.42,
    backboardBall: Math.abs(b.z) > state.arena.l * 0.42 && b.y > 3.8,
    inCorner: Math.abs(b.x) > state.arena.w * 0.35 && Math.abs(b.z) > state.arena.l * 0.35,
    nearOwnGoal,
    nearEnemyGoal,
    movingTowardOwnGoal,
    movingTowardEnemyGoal,
    dangerousShot: nearOwnGoal && movingTowardOwnGoal && central && highThreat && speed2 > 5,
    shootable: nearEnemyGoal && b.y < state.arena.goalH + 1.8 && movingTowardEnemyGoal,
    clearable: nearOwnGoal || ownSign * b.z > -state.arena.l * 0.06,
    passable: b.y < 4.8 && !nearOwnGoal && speed2 < 42
  };
}

function lanePressureToTarget(state, team, from, to) {
  const opponents = opponentCars(state, team).filter(c => !(c.demoTimer > 0));
  if (!opponents.length) return 0;
  const vx = to.x - from.x;
  const vz = to.z - from.z;
  const len2 = Math.max(1, vx * vx + vz * vz);
  let pressure = 0;
  for (const o of opponents) {
    const wx = o.x - from.x;
    const wz = o.z - from.z;
    const t = clamp((wx * vx + wz * vz) / len2, 0, 1);
    const px = from.x + vx * t;
    const pz = from.z + vz * t;
    const d = Math.hypot(o.x - px, o.z - pz);
    pressure = Math.max(pressure, clamp(1 - d / 14.5, 0, 1));
  }
  return pressure;
}

function chooseTeamInterceptPoint(state, team, prediction, skill, danger01) {
  const cars = teamCars(state, team).filter(c => !(c.demoTimer > 0));
  const points = prediction.length ? prediction : [{ t: 0.22, x: state.ball.x, y: state.ball.y, z: state.ball.z, vx: state.ball.vx, vy: state.ball.vy, vz: state.ball.vz }];
  if (!cars.length) return { point: points[0], time: points[0].t || 0.2, teamEta: Infinity, opponentEta: Infinity, score: Infinity };
  let best = null;
  for (const p of points) {
    let teamEta = Infinity;
    let bestCar = null;
    for (const c of cars) {
      const eta = aiCarEta(c, p, state, skill, danger01);
      if (eta < teamEta) { teamEta = eta; bestCar = c; }
    }
    const opponentEta = opponentEtaTo(state, team, p, skill, danger01);
    const timing = Math.abs(teamEta - (p.t || 0.2)) * 0.46;
    const heightPenalty = Math.max(0, (p.y || BALL_RADIUS) - (5.6 + skill.aerial * 4.2)) * 0.18;
    const raceBonus = clamp(opponentEta - teamEta, -0.65, 0.65) * -0.22;
    const behindBonus = bestCar && carBehindBallForTeam(bestCar, p, team) ? -0.10 : 0.12;
    const score = teamEta + timing + heightPenalty + raceBonus + behindBonus;
    if (!best || score < best.score) best = { point: p, time: p.t || 0.2, teamEta, opponentEta, score };
  }
  return best;
}

function assignRotation(teamList, state, board, skill) {
  const target = board.bestIntercept?.point || state.ball;
  const ownSign = board.team === "blue" ? -1 : 1;
  const candidates = teamList.filter(c => !(c.demoTimer > 0)).map(car => {
    const memory = ensureAiMemory(car);
    const eta = aiCarEta(car, target, state, skill, board.danger);
    const goalSide = carBehindBallForTeam(car, target, board.team);
    const dist = distance2(car, target);
    return {
      car,
      eta,
      goalSide,
      dist,
      committed: memory.committedUntil > state.tick,
      boost: car.boost || 0,
      roleBias: rolePriority(car.role)
    };
  }).sort((a, b) => a.eta - b.eta);
  const choose = (items, scorer) => {
    let best = null;
    let bestScore = Infinity;
    for (const item of items) {
      const score = scorer(item);
      if (score < bestScore) { bestScore = score; best = item; }
    }
    return best;
  };
  const first = choose(candidates, item => {
    const role = item.car.role || "balanced";
    const keeperPenalty = role === "goalkeeper" && board.danger < 0.78 ? 0.72 : 0;
    const defenderEmergencyBonus = (role === "goalkeeper" || role === "defence") && board.danger > 0.62 ? -0.22 : 0;
    const attackerBonus = role === "attack" && board.danger < 0.64 ? -0.20 : 0;
    const notGoalSidePenalty = !item.goalSide && board.danger < 0.70 ? 0.22 * skill.discipline : 0;
    const boostPenalty = item.boost < 7 && item.dist > 18 ? 0.18 : 0;
    return item.eta + item.roleBias + keeperPenalty + defenderEmergencyBonus + attackerBonus + notGoalSidePenalty + boostPenalty + (item.committed ? -0.12 : 0);
  });
  const withoutFirst = candidates.filter(item => item.car.id !== first?.car.id);
  const second = choose(withoutFirst, item => {
    const role = item.car.role || "balanced";
    const supportRoleBonus = role === "midfield" ? -0.24 : role === "balanced" ? -0.14 : role === "attack" && board.opportunity > 0.48 ? -0.10 : 0;
    const keeperPenalty = role === "goalkeeper" ? 0.34 : 0;
    const spacingPenalty = first ? clamp(1 - Math.hypot(item.car.x - first.car.x, item.car.z - first.car.z) / 22, 0, 1) * 0.26 : 0;
    return item.eta * 0.62 + Math.abs(item.car.x - target.x) / Math.max(18, state.arena.w) + supportRoleBonus + keeperPenalty + spacingPenalty;
  });
  const withoutFirstSecond = candidates.filter(item => item.car.id !== first?.car.id && item.car.id !== second?.car.id);
  const third = choose(withoutFirstSecond, item => {
    const role = item.car.role || "balanced";
    const depthScore = -ownSign * item.car.z / Math.max(1, state.arena.l);
    const goalSideBonus = item.goalSide ? -0.18 : 0.22;
    const defenderBonus = role === "defence" ? -0.20 : role === "goalkeeper" ? -0.12 : 0;
    return depthScore + goalSideBonus + defenderBonus + item.eta * 0.18;
  });
  const keeper = choose(candidates, item => {
    const explicit = item.car.role === "goalkeeper" ? -1.0 : 0;
    const depthScore = -ownSign * item.car.z / Math.max(1, state.arena.l);
    return explicit + depthScore + (item.goalSide ? -0.10 : 0.12);
  });
  const slotsById = {};
  if (first) slotsById[first.car.id] = "first_man";
  if (second) slotsById[second.car.id] = "second_man";
  if (third) slotsById[third.car.id] = "third_man";
  if (keeper && !slotsById[keeper.car.id]) slotsById[keeper.car.id] = "goalkeeper";
  for (const item of candidates) if (!slotsById[item.car.id]) slotsById[item.car.id] = "support";
  return {
    firstManId: first?.car.id || null,
    secondManId: second?.car.id || null,
    thirdManId: third?.car.id || null,
    goalkeeperId: keeper?.car.id || null,
    slotsById,
    etasById: Object.fromEntries(candidates.map(item => [item.car.id, item.eta]))
  };
}

function computeTeamBlackboard(state, team, meta = DEFAULT_META) {
  const skill = aiSkill(meta);
  const difficulty = meta.difficulty || "pro";
  const horizon = difficulty === "rookie" ? 0.85 : difficulty === "allstar" ? 2.20 : 1.45;
  const step = difficulty === "allstar" ? 0.16 : 0.18;
  const prediction = buildBallPrediction(state, horizon, step);
  const ballInfo = classifyBallState(state, team, prediction);
  const ownSign = team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const ownTeam = teamCars(state, team).filter(c => !(c.demoTimer > 0));
  const bestIntercept = chooseTeamInterceptPoint(state, team, prediction, skill, 0.5);
  const target = bestIntercept.point || state.ball;
  const teamEta = bestIntercept.teamEta;
  const opponentEta = bestIntercept.opponentEta;
  const noGoalSideDefender = !ownTeam.some(c => carBehindBallForTeam(c, state.ball, team) && ownSign * c.z > state.arena.l * 0.08);
  const centralOwnLane = Math.abs(state.ball.x) < state.arena.goalW * 0.72 && ownSign * state.ball.z > state.arena.l * 0.08;
  const etaDanger = clamp((teamEta - opponentEta + 0.35) / 1.15, 0, 1);
  const danger = clamp(
    (ballInfo.nearOwnGoal ? 0.26 : 0) +
    (ballInfo.movingTowardOwnGoal ? 0.24 : 0) +
    (ballInfo.dangerousShot ? 0.26 : 0) +
    (centralOwnLane ? 0.12 : 0) +
    (noGoalSideDefender ? 0.14 : 0) +
    etaDanger * 0.20 +
    clamp((state.ball.y - 3.0) / 9, 0, 0.10),
    0,
    1
  );
  const shotTarget = goalTargetForShot(state, team, state.ball, skill);
  const shotPressure = lanePressureToTarget(state, team, state.ball, shotTarget);
  const ownEtaAdvantage = clamp((opponentEta - teamEta + 0.2) / 1.1, 0, 1);
  const opportunity = clamp(
    (ballInfo.nearEnemyGoal ? 0.24 : 0) +
    (ballInfo.movingTowardEnemyGoal ? 0.14 : 0) +
    (enemySign * state.ball.z > 0 ? 0.12 : 0) +
    ownEtaAdvantage * 0.24 +
    (1 - shotPressure) * 0.16 +
    (target.y < state.arena.goalH + 1.8 ? 0.10 : 0),
    0,
    1
  );
  const board = makeTeamBlackboard(team);
  board.tick = state.tick;
  board.danger = danger;
  board.opportunity = opportunity;
  board.ballInfo = ballInfo;
  board.ballPrediction = prediction;
  board.bestIntercept = bestIntercept;
  board.openShot = opportunity > 0.50 && shotPressure < 0.56 && ballInfo.shootable;
  board.bestShotTarget = shotTarget;
  board.defensiveShapeBroken = noGoalSideDefender && danger > 0.46;
  board.teamOvercommitted = ownTeam.filter(c => !carBehindBallForTeam(c, state.ball, team) && enemySign * c.z > enemySign * state.ball.z - 4).length >= Math.max(2, Math.ceil(ownTeam.length * 0.62));
  board.boostStarved = ownTeam.length > 0 && ownTeam.reduce((sum, c) => sum + (c.boost || 0), 0) / ownTeam.length < 18;
  Object.assign(board, assignRotation(ownTeam, state, board, skill));
  return board;
}

function aiBlackboardIntervalTicks(meta = DEFAULT_META) {
  const difficulty = meta.difficulty || "pro";
  return difficulty === "allstar" ? 4 : difficulty === "rookie" ? 12 : 6;
}

function ensureAiBlackboards(state, meta = DEFAULT_META) {
  if (!state.aiBlackboard) state.aiBlackboard = makeAiBlackboardState();
  const interval = aiBlackboardIntervalTicks(meta);
  if (state.aiBlackboardTick != null && state.tick - state.aiBlackboardTick < interval) return state.aiBlackboard;
  state.aiBlackboard.blue = computeTeamBlackboard(state, "blue", meta);
  state.aiBlackboard.orange = computeTeamBlackboard(state, "orange", meta);
  state.aiBlackboardTick = state.tick;
  return state.aiBlackboard;
}

function carBehindBallForTeam(car, ball, team) {
  const enemySign = team === "blue" ? 1 : -1;
  return enemySign * car.z < enemySign * ball.z - 1.5;
}

function routeCapsuleInfo(from, target, point) {
  const dx = (target?.x || 0) - (from?.x || 0);
  const dz = (target?.z || 0) - (from?.z || 0);
  const len = Math.hypot(dx, dz);
  if (len < 0.001) {
    return { len: 0, ux: 0, uz: 1, rightX: 1, rightZ: 0, along: 0, side: 0 };
  }
  const ux = dx / len;
  const uz = dz / len;
  const rightX = uz;
  const rightZ = -ux;
  const px = (point?.x || 0) - (from?.x || 0);
  const pz = (point?.z || 0) - (from?.z || 0);
  return {
    len,
    ux,
    uz,
    rightX,
    rightZ,
    along: px * ux + pz * uz,
    side: px * rightX + pz * rightZ
  };
}

function routeRisk(car, state, target, opts = {}) {
  if (!car || !target) {
    return { risk: 0, blocked: false, hardBlock: false, side: 0, reason: "", reachesBallFirst: true, brake: false };
  }
  const skill = opts.skill || {};
  const touchPoint = opts.touchPoint || opts.ball || state.ball || target;
  const route = routeCapsuleInfo(car, target, target);
  if (route.len < 0.75) {
    return { risk: 0, blocked: false, hardBlock: false, side: 0, reason: "", reachesBallFirst: true, brake: false };
  }

  const touchInfo = routeCapsuleInfo(car, target, touchPoint);
  const speed = carSpeed2(car);
  const routeSpeed = clamp(12 + speed * 0.34 + (skill.speed || 1) * 8.5, 13, 38);
  const touchAlong = clamp(touchInfo.along > 0 ? touchInfo.along : distance2(car, touchPoint), 0, route.len + CAR_RADIUS * 2.5);
  const timeToBall = touchAlong / routeSpeed;
  const samples = [0, 0.18, 0.36, 0.58];
  let best = null;

  for (const other of Object.values(state.cars || {})) {
    if (!other || other.id === car.id || (other.demoTimer || 0) > 0) continue;
    const teammate = other.team === car.team;
    const human = !!other.human;
    for (const t of samples) {
      const predictedOther = {
        x: (other.x || 0) + (other.vx || 0) * t,
        z: (other.z || 0) + (other.vz || 0) * t
      };
      const info = routeCapsuleInfo(car, target, predictedOther);
      if (info.along < -CAR_RADIUS * 0.35 || info.along > route.len + CAR_RADIUS * 1.6) continue;
      const corridor = CAR_RADIUS * (human ? 2.62 : teammate ? 2.28 : 2.08) + (opts.intent === "shot" ? 0.35 : 0);
      const sideAbs = Math.abs(info.side);
      if (sideAbs > corridor) continue;

      const timeToBlocker = Math.max(0, info.along) / routeSpeed;
      const blockerSpeed = Math.hypot(other.vx || 0, other.vz || 0);
      const timeDelta = Math.abs(timeToBlocker - t);
      const beforeBall = info.along < touchAlong - CAR_RADIUS * 0.55;
      const inBallCapsule = info.along <= touchAlong + CAR_RADIUS * 1.2 && sideAbs < corridor * (human ? 0.92 : 0.82);
      const stationaryBlocker = blockerSpeed < 1.2 && beforeBall && sideAbs < corridor * 0.92;
      if (!stationaryBlocker && timeDelta > 0.62) continue;
      const relVx = (car.vx || 0) - (other.vx || 0);
      const relVz = (car.vz || 0) - (other.vz || 0);
      const closing = relVx * route.ux + relVz * route.uz;
      const widthScore = clamp((corridor - sideAbs) / corridor, 0, 1);
      const alignmentScore = stationaryBlocker ? 0.92 : clamp(1 - timeDelta / 0.62, 0, 1);
      const timePressure = clamp(1 - timeToBlocker / 0.95, 0, 1) * alignmentScore;
      const beforeBallPenalty = beforeBall ? 0.26 : 0;
      const humanPenalty = human ? 0.22 : 0;
      const teammatePenalty = teammate ? 0.10 : 0;
      const closingPenalty = closing > 1.5 ? clamp(closing / 24, 0, 0.18) : 0;
      const risk = clamp((widthScore * 0.46 + timePressure * 0.24 + beforeBallPenalty + humanPenalty + teammatePenalty + closingPenalty) * (0.55 + alignmentScore * 0.45), 0, 1);
      if (!best || risk > best.risk) {
        let side = sideAbs > 0.2 ? (info.side >= 0 ? -1 : 1) : ((car.x || 0) <= (other.x || 0) ? -1 : 1);
        if (!side) side = car.team === "blue" ? 1 : -1;
        best = { other, teammate, human, side, risk, timeToBlocker, sampleTime: t, timeDelta, stationaryBlocker, beforeBall, inBallCapsule, closing, along: info.along };
      }
    }
  }

  if (!best) {
    return { risk: 0, blocked: false, hardBlock: false, side: 0, reason: "", reachesBallFirst: true, brake: false, timeToBall, timeToBlocker: Infinity };
  }

  const margin = best.human ? 0.18 : best.teammate ? 0.14 : 0.09;
  const reachesBallFirst = timeToBall + margin < best.timeToBlocker && !best.inBallCapsule;
  const hardBlock = best.risk > 0.70 && !reachesBallFirst;
  const blocked = best.risk > (best.human ? 0.34 : 0.42) && (!reachesBallFirst || best.inBallCapsule);
  const reason = best.teammate && best.human
    ? "yield teammate possession"
    : best.human
      ? "avoid player lane"
      : best.teammate
        ? "avoid teammate lane"
        : "avoid car lane";
  return {
    risk: best.risk,
    blocked,
    hardBlock,
    side: best.side,
    blockerId: best.other.id,
    blocker: best.other,
    human: best.human,
    teammate: best.teammate,
    opponent: !best.teammate,
    beforeBall: best.beforeBall,
    blockerInBallCapsule: best.inBallCapsule,
    reachesBallFirst,
    brake: hardBlock || (best.human && best.timeToBlocker < 0.52 && !reachesBallFirst) || best.closing > 8,
    reason,
    timeToBall,
    timeToBlocker: best.timeToBlocker,
    sampleTime: best.sampleTime,
    timeDelta: best.timeDelta,
    along: best.along
  };
}

function sameTeamHumanPossession(car, state, ball, intent, danger01 = 0) {
  if (!car || !ball || intent === "kickoff" || intent === "save" || danger01 > 0.72) return { active: false };
  const carDist = distance2(car, ball);
  let best = null;
  for (const mate of Object.values(state.cars || {})) {
    if (!mate || mate.id === car.id || mate.team !== car.team || !mate.human || (mate.demoTimer || 0) > 0) continue;
    const mateDist = distance2(mate, ball);
    const lane = routeCapsuleInfo(car, ball, mate);
    const inLane = lane.len > 0.75 && lane.along > -CAR_RADIUS * 0.5 && lane.along < lane.len + CAR_RADIUS * 1.2 && Math.abs(lane.side) < CAR_RADIUS * 2.55;
    const ownsGoalSide = carBehindBallForTeam(mate, ball, car.team);
    const closeControl = mateDist < 8.2 || mateDist < carDist - 2.5;
    const screening = inLane && mateDist < carDist + 7.5;
    if (!closeControl && !screening && !(ownsGoalSide && mateDist < 14.5)) continue;
    const score = (closeControl ? 1.0 : 0) + (screening ? 0.85 : 0) + (ownsGoalSide ? 0.45 : 0) - mateDist * 0.018;
    if (!best || score > best.score) best = { mate, score, mateDist, inLane, ownsGoalSide };
  }
  if (!best) return { active: false };
  return {
    active: true,
    mate: best.mate,
    reason: best.inLane ? "teammate owns ball lane" : "teammate possession",
    strong: best.inLane || best.mateDist < 6.5
  };
}

function selectAiIntercept(car, state, skill, danger01, roleCfg) {
  const maxRead = clamp(0.32 + skill.read * 0.95 + skill.intercept * 0.46 + danger01 * 0.32, 0.38, 2.25);
  const samples = skill.intercept > 1.12 ? 8 : skill.intercept > 0.78 ? 6 : 4;
  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  let best = null;
  for (let i = 0; i < samples; i++) {
    const t = samples <= 1 ? 0.18 : 0.14 + (i / (samples - 1)) * maxRead;
    const p = ballAt(state, t);
    const eta = aiCarEta(car, p, state, skill, danger01);
    const timing = Math.abs(eta - t) * (skill.intercept > 1 ? 0.48 : 0.82);
    const aerialReach = 4.4 + skill.aerial * 4.6 + roleCfg.aerial * 0.9 + clamp((car.boost || 0) / 100, 0, 1) * skill.aerial * 2.4;
    const highBall = p.y > 3.2;
    const aerialFeasible = highBall && p.y < aerialReach && skill.aerial > 0.42 && (car.boost > 10 || p.y < 5.2);
    const heightPenalty = Math.max(0, p.y - (aerialFeasible ? aerialReach : skill.aerial > 0.75 ? 7.4 : 4.8)) * (1.30 - skill.aerial * 0.58);
    const aerialBonus = aerialFeasible ? -0.10 * skill.aerial * (danger01 > 0.45 ? skill.save : roleCfg.attack) : 0;
    const lowReadBonus = !highBall && skill.aerial < 0.45 ? -0.07 : 0;
    const behindBonus = carBehindBallForTeam(car, p, car.team) ? -0.18 * roleCfg.attack : 0.18 * roleCfg.discipline;
    const defenceBias = ownSign * p.z > state.arena.l * 0.12 ? -0.18 * roleCfg.defence * danger01 : 0;
    const attackBias = enemySign * p.z > state.arena.l * 0.12 ? -0.12 * roleCfg.attack : 0;
    const wallPenalty = Math.abs(p.x) > state.arena.w * 0.43 ? 0.12 * (1.35 - (skill.wallRead || skill.aim)) : 0;
    const score = eta + timing + heightPenalty + aerialBonus + lowReadBonus + behindBonus + defenceBias + attackBias + wallPenalty;
    if (!best || score < best.score) best = { point: p, time: t, eta, score };
  }
  return best || { point: ballAt(state, 0.2), time: 0.2, eta: 0.2, score: 0 };
}

function selectAiInterceptFromPrediction(car, state, skill, danger01, roleCfg, board = null) {
  const prediction = board?.ballPrediction || [];
  if (!prediction.length) return selectAiIntercept(car, state, skill, danger01, roleCfg);
  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const teamSlot = board?.slotsById?.[car.id] || "support";
  const firstManId = board?.firstManId || null;
  const betterMateEta = firstManId && firstManId !== car.id ? board?.etasById?.[firstManId] : Infinity;
  const fwd = fwdFromYaw(car.yaw || 0);
  let best = null;
  for (const p of prediction) {
    const route = routeRisk(car, state, p, { skill, intent: "intercept", touchPoint: p });
    const eta = aiCarEta(car, p, state, skill, danger01);
    const dist = distance2(car, p);
    const dx = p.x - car.x;
    const dz = p.z - car.z;
    const frontDot = dist > 0.001 ? (dx * fwd.x + dz * fwd.z) / dist : 1;
    const timing = Math.abs(eta - (p.t || 0.2)) * (skill.intercept > 1 ? 0.36 : 0.66);
    const aerialReach = 4.6 + skill.aerial * 5.0 + roleCfg.aerial * 1.1 + clamp((car.boost || 0) / 100, 0, 1) * skill.aerial * 2.7;
    const highBall = p.y > 3.1;
    const aerialFeasible = highBall && p.y < aerialReach && skill.aerial > 0.44 && (car.boost > 9 || p.y < 5.0);
    const heightPenalty = Math.max(0, p.y - (aerialFeasible ? aerialReach : skill.aerial > 0.75 ? 7.8 : 4.7)) * (1.18 - skill.aerial * 0.46);
    const behindBonus = carBehindBallForTeam(car, p, car.team) ? -0.18 * roleCfg.attack : 0.18 * roleCfg.discipline;
    const defenceBias = ownSign * p.z > state.arena.l * 0.12 ? -0.22 * roleCfg.defence * danger01 : 0;
    const attackBias = enemySign * p.z > state.arena.l * 0.12 ? -0.15 * roleCfg.attack * clamp(board?.opportunity ?? 0.35, 0.2, 1) : 0;
    const wallPenalty = p.wall ? 0.12 * (1.35 - (skill.wallRead || skill.aim)) : 0;
    const facingPenalty = clamp((1 - frontDot) * 0.20, 0, 0.34);
    const firstManBonus = teamSlot === "first_man" ? -0.18 : teamSlot === "second_man" ? -0.04 : 0.10 * skill.discipline;
    const teammateConflictPenalty = betterMateEta + 0.12 < eta && danger01 < 0.78 ? 0.34 * skill.discipline : 0;
    const velocityLaneBonus = Math.hypot(p.vx || 0, p.vz || 0) > 5 && frontDot > 0.45 ? -0.05 * skill.read : 0;
    const shot = selectShotOption(state, car.team, p, skill, car, { approachRisk: route });
    const attackingRead = enemySign * p.z > -state.arena.l * 0.10 && danger01 < 0.66;
    const contactPenalty = attackingRead ? (1 - shot.contact.score) * clamp(0.34 + skill.shot * 0.16, 0.28, 0.56) : 0;
    const chanceBonus = attackingRead ? -shot.score * 0.18 * roleCfg.attack : 0;
    const routePenalty = route.blocked && !route.reachesBallFirst
      ? clamp(route.risk * (route.human ? 0.64 : 0.42) + (route.hardBlock ? 0.34 : 0), 0, 0.92)
      : clamp(route.risk * 0.10, 0, 0.14);
    const score = eta + timing + heightPenalty + behindBonus + defenceBias + attackBias + wallPenalty + facingPenalty + firstManBonus + teammateConflictPenalty + velocityLaneBonus + contactPenalty + routePenalty + chanceBonus;
    if (!best || score < best.score) best = { point: p, time: p.t || 0.2, eta, score };
  }
  return best || selectAiIntercept(car, state, skill, danger01, roleCfg);
}

function contactQualityFor(car, state, ball, aim, skill = null, intent = "shot", danger01 = 0) {
  const toBallX = (ball.x || 0) - (car.x || 0);
  const toBallZ = (ball.z || 0) - (car.z || 0);
  const toBallLen = Math.hypot(toBallX, toBallZ) || 1;
  const laneX = (aim?.x || 0) - (ball.x || 0);
  const laneZ = (aim?.z || 0) - (ball.z || 0);
  const laneLen = Math.hypot(laneX, laneZ) || 1;
  const approachDot = (toBallX * laneX + toBallZ * laneZ) / (toBallLen * laneLen);
  const lateral = Math.abs(toBallX * laneZ - toBallZ * laneX) / laneLen;
  const fwd = fwdFromYaw(car.yaw || 0);
  const facingBall = (toBallX * fwd.x + toBallZ * fwd.z) / toBallLen;
  const speed = carSpeed2(car);
  const attackingTouch = intent === "shot" || intent === "pass" || intent === "center";
  const acceptsUglyTouch = intent === "save" || intent === "clear" || danger01 > 0.72;
  const behindScore = acceptsUglyTouch ? clamp((approachDot + 0.55) / 1.55, 0, 1) : clamp((approachDot + 0.10) / 1.10, 0, 1);
  const lateralScore = clamp(1 - lateral / (attackingTouch ? 7.4 : 10.5), 0, 1);
  const facingScore = clamp((facingBall + 0.35) / 1.35, 0, 1);
  const speedScore = attackingTouch ? clamp(1 - Math.max(0, speed - 36) / 22, 0.25, 1) : 1;
  const score = clamp(behindScore * 0.45 + lateralScore * 0.25 + facingScore * 0.20 + speedScore * 0.10, 0, 1);
  return {
    score,
    approachDot,
    lateral,
    facingBall,
    wrongSide: approachDot < (acceptsUglyTouch ? -0.42 : 0.08),
    controlled: score > (attackingTouch ? 0.58 : 0.42)
  };
}

function projectedShotScore(state, team, from, target, contact, car = null) {
  const enemySign = team === "blue" ? 1 : -1;
  const laneX = (target?.x || 0) - (from?.x || 0);
  const laneZ = (target?.z || 0) - (from?.z || 0);
  const laneLen = Math.hypot(laneX, laneZ) || 1;
  const ux = laneX / laneLen;
  const uz = laneZ / laneLen;
  const ballToward = ((from?.vx || 0) * ux + (from?.vz || 0) * uz);
  const carSpeed = car ? carSpeed2(car) : 16;
  const approach = Number.isFinite(Number(contact?.approachDot)) ? Number(contact.approachDot) : 0.35;
  const contactScore = Number.isFinite(Number(contact?.score)) ? Number(contact.score) : 0.5;
  const firstTouchPower = clamp(contactScore * 0.62 + Math.max(0, approach) * 0.26 + Math.max(0, ballToward) / 42 * 0.12, 0, 1);
  const projectedSpeed = Math.max(0, ballToward) * 0.30 + carSpeed * Math.max(0, approach) * 0.34 + firstTouchPower * 8.5;
  const goalward = clamp(enemySign * uz, 0, 1);
  const mouthX = Math.abs(target?.x || 0) < state.arena.goalW / 2 - BALL_RADIUS * 0.35 ? 1 : 0.72;
  const lowEnough = clamp(1 - Math.max(0, (from?.y || BALL_RADIUS) - (state.arena.goalH + 1.4)) / 7.5, 0, 1);
  return clamp(firstTouchPower * 0.34 + clamp(projectedSpeed / 30, 0, 1) * 0.26 + goalward * 0.20 + mouthX * 0.10 + lowEnough * 0.10, 0, 1);
}

function shotOptionsFor(state, team, from, skill = null, car = null, opts = {}) {
  const enemySign = team === "blue" ? 1 : -1;
  const goalZ = enemySign * (state.arena.l / 2 + state.arena.goalD * 0.34);
  const maxAim = state.arena.goalW * (skill?.shot > 1.05 ? 0.43 : 0.35);
  const offsets = [-0.40, 0.40, -0.20, 0.20, 0];
  const approachRisk = opts.approachRisk || (car ? routeRisk(car, state, from, { skill: skill || {}, intent: "shot", touchPoint: from }) : null);
  return offsets.map((o, i) => {
    const target = { x: clamp(o * state.arena.goalW, -maxAim, maxAim), z: goalZ };
    const lanePressure = lanePressureToTarget(state, team, from, target);
    const laneX = target.x - (from?.x || 0);
    const laneZ = target.z - (from?.z || 0);
    const laneLen = Math.hypot(laneX, laneZ) || 1;
    const angleScore = clamp(Math.abs(laneZ) / laneLen, 0, 1);
    const farPostBias = Math.sign(from?.x || 0) && Math.sign(target.x || 0) !== Math.sign(from?.x || 0) ? 0.10 : 0;
    const heightScore = clamp(1 - Math.max(0, (from?.y || BALL_RADIUS) - (state.arena.goalH + 1.8)) / 7, 0, 1);
    const contact = car ? contactQualityFor(car, state, from, target, skill, "shot", 0) : { score: 0.55 };
    const projected = projectedShotScore(state, team, from, target, contact, car);
    const routePenalty = approachRisk?.blocked && !approachRisk.reachesBallFirst ? clamp(approachRisk.risk * (approachRisk.human ? 0.32 : 0.22), 0, 0.34) : clamp((approachRisk?.risk || 0) * 0.05, 0, 0.08);
    const centralPenalty = i === offsets.length - 1 ? 0.04 : 0;
    const score = clamp((1 - lanePressure) * 0.27 + angleScore * 0.14 + heightScore * 0.12 + contact.score * 0.18 + projected * 0.24 + farPostBias - centralPenalty - routePenalty, 0, 1);
    return { target, score, lanePressure, contact, projected, routeRisk: approachRisk, kind: i === 0 || i === 1 ? "post" : i === offsets.length - 1 ? "center" : "slot" };
  }).sort((a, b) => b.score - a.score);
}

function selectShotOption(state, team, from, skill = null, car = null, opts = {}) {
  const options = shotOptionsFor(state, team, from, skill, car, opts);
  const fallback = { x: 0, z: (team === "blue" ? 1 : -1) * (state.arena.l / 2 + state.arena.goalD * 0.34) };
  const best = options[0] || { target: fallback, score: 0, lanePressure: 1, contact: { score: 0 } };
  return {
    ...best,
    options,
    open: best.score > (skill?.shot > 1.05 ? 0.54 : 0.60) && best.lanePressure < 0.62
  };
}

function goalTargetForShot(state, team, from, skill = null, car = null) {
  return selectShotOption(state, team, from, skill, car).target;
}

function reboundTargetForShot(state, team, from, shotTarget, car = null) {
  const enemySign = team === "blue" ? 1 : -1;
  const side = Math.sign((shotTarget?.x || 0) - (from?.x || 0)) || Math.sign(car?.x || from?.x || 1);
  return {
    x: clamp(-side * state.arena.goalW * 0.42, -state.arena.w * 0.38, state.arena.w * 0.38),
    z: enemySign * state.arena.l * 0.34
  };
}

function centerTargetAcrossGoal(state, team, from) {
  const enemySign = team === "blue" ? 1 : -1;
  const side = Math.sign(from?.x || 1);
  return {
    x: -side * state.arena.goalW * 0.34,
    z: enemySign * state.arena.l * 0.39
  };
}

function teamForwardTarget(state, team, from, depth = 0.30) {
  const enemySign = team === "blue" ? 1 : -1;
  return {
    x: clamp((from?.x || 0) * 0.62, -state.arena.w * 0.36, state.arena.w * 0.36),
    z: enemySign * state.arena.l * depth
  };
}

function passLaneScore(state, passer, mate, ball, skill, danger01) {
  const enemySign = passer.team === "blue" ? 1 : -1;
  const mateAhead = enemySign * (mate.z - ball.z);
  const lateralGap = Math.abs(mate.x - ball.x);
  const mateDist = distance2(mate, ball);
  if (mateDist < 8 || mateDist > state.arena.l * 0.46) return null;
  if (mateAhead < -state.arena.l * 0.11) return null;
  const opponents = opponentCars(state, passer.team);
  let lanePressure = 0;
  for (const o of opponents) {
    const vx = mate.x - ball.x;
    const vz = mate.z - ball.z;
    const wx = o.x - ball.x;
    const wz = o.z - ball.z;
    const len2 = Math.max(1, vx * vx + vz * vz);
    const t = clamp((wx * vx + wz * vz) / len2, 0, 1);
    const px = ball.x + vx * t;
    const pz = ball.z + vz * t;
    const d = Math.hypot(o.x - px, o.z - pz);
    lanePressure = Math.max(lanePressure, clamp(1 - d / 13.5, 0, 1));
  }
  const openBonus = (1 - lanePressure) * 1.35;
  const forwardBonus = clamp(mateAhead / (state.arena.l * 0.36), -0.4, 1.1);
  const roleBonus = mate.role === "attack" ? 0.34 : mate.role === "midfield" || mate.role === "balanced" ? 0.22 : mate.human ? 0.28 : 0;
  const reachable = clamp(1 - Math.abs(mateDist - 24) / 36, 0, 1);
  const wideOutlet = clamp(lateralGap / (state.arena.w * 0.30), 0, 1) * 0.22;
  const dangerPenalty = danger01 > 0.52 && enemySign * mate.z > enemySign * ball.z ? 0.36 : 0;
  return openBonus + forwardBonus + roleBonus + reachable + wideOutlet - dangerPenalty + skill.discipline * 0.10;
}

function selectPassOption(car, state, ball, skill, danger01, role) {
  const teamSize = Math.max(1, Number(state.teamSize || 1));
  if (teamSize <= 1 || role === "goalkeeper" || danger01 > 0.72) return null;
  const enemySign = car.team === "blue" ? 1 : -1;
  const inAttackingFlow = enemySign * ball.z > -state.arena.l * 0.20;
  const ballLow = (ball.y || 0) < 4.6;
  if (!inAttackingFlow || !ballLow) return null;
  const mates = teamCars(state, car.team).filter(c => c.id !== car.id && !(c.demoTimer > 0));
  let best = null;
  for (const mate of mates) {
    const score = passLaneScore(state, car, mate, ball, skill, danger01);
    if (score == null) continue;
    const leadSeconds = clamp(distance2(mate, ball) / 42, 0.22, 0.78);
    const receive = {
      x: clamp(mate.x + (mate.vx || 0) * leadSeconds, -state.arena.w * 0.43, state.arena.w * 0.43),
      z: clamp(mate.z + (mate.vz || 0) * leadSeconds + enemySign * 5.5, -state.arena.l * 0.42, state.arena.l * 0.42)
    };
    const finalScore = score + (mate.human ? 0.24 : 0) + (mate.role === "attack" && enemySign * receive.z > 0 ? 0.18 : 0);
    if (!best || finalScore > best.score) best = { mate, receive, score: finalScore };
  }
  const threshold = (skill.discipline > 1.05 ? 1.82 : 2.05) - (role === "midfield" ? 0.18 : 0) - (role === "balanced" ? 0.08 : 0);
  if (!best || best.score < threshold) return null;
  return best;
}

function clearanceTarget(state, team, from) {
  const enemySign = team === "blue" ? 1 : -1;
  const side = (from?.x || state.ball.x || 0) >= 0 ? -1 : 1;
  return {
    x: side * state.arena.w * 0.36,
    z: enemySign * state.arena.l * 0.22
  };
}

function wallSafeTouchAim(state, team, ball, aim, intent = "shot", danger01 = 0) {
  if (!ball || !aim) return aim;
  const ownSign = team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const wallSide = Math.sign(ball.x || 0) || 1;
  const sideWall = Math.abs(ball.x || 0) > state.arena.w / 2 - 9.0;
  const corner = sideWall && Math.abs(ball.z || 0) > state.arena.l * 0.34;
  if (!sideWall && !corner) return aim;
  const ownHalf = ownSign * (ball.z || 0) > state.arena.l * 0.10;
  const attackingHalf = enemySign * (ball.z || 0) > -state.arena.l * 0.04;
  if (ownHalf || danger01 > 0.48 || intent === "save" || intent === "challenge") {
    return {
      x: clamp((ball.x || 0) - wallSide * state.arena.w * 0.18, -state.arena.w * 0.38, state.arena.w * 0.38),
      z: enemySign * state.arena.l * 0.24
    };
  }
  if (attackingHalf) {
    if (corner) {
      return {
        x: clamp(-wallSide * state.arena.goalW * 0.12, -state.arena.goalW * 0.30, state.arena.goalW * 0.30),
        z: enemySign * (state.arena.l / 2 - 7.5)
      };
    }
    return {
      x: clamp(-wallSide * state.arena.goalW * 0.38, -state.arena.goalW * 0.45, state.arena.goalW * 0.45),
      z: enemySign * (state.arena.l / 2 + state.arena.goalD * 0.28)
    };
  }
  return {
    x: clamp((ball.x || 0) - wallSide * state.arena.w * 0.22, -state.arena.w * 0.40, state.arena.w * 0.40),
    z: enemySign * state.arena.l * 0.30
  };
}

function backPostTarget(state, team, ball, depth = 2.4) {
  const ownSign = team === "blue" ? -1 : 1;
  const postSide = (ball?.x || 0) >= 0 ? -1 : 1;
  return {
    x: clamp(postSide * state.arena.goalW * 0.34, -state.arena.goalW * 0.42, state.arena.goalW * 0.42),
    z: ownSign * (state.arena.l / 2 - depth)
  };
}

function supportTargetForRole(car, state, role, rank, style, roleCfg, ball, ownSign) {
  const slotLane = ((car.slotIndex % Math.max(1, Number(state.teamSize || 1))) - (Math.max(1, Number(state.teamSize || 1)) - 1) / 2);
  const side = slotLane === 0 ? (car.slotIndex % 2 ? 1 : -1) : Math.sign(slotLane);
  const ownGoalZ = ownSign * (state.arena.l / 2 - 6.4);
  if (role === "goalkeeper") return backPostTarget(state, car.team, ball, 4.4);
  if (role === "defence") {
    return {
      x: clamp(ball.x * 0.34 + side * state.arena.w * 0.16, -state.arena.w * 0.38, state.arena.w * 0.38),
      z: clamp((ball.z + ownGoalZ) * 0.50, -state.arena.l * 0.42, state.arena.l * 0.42)
    };
  }
  if (role === "balanced") {
    const danger = clamp((ownSign * ball.z) / (state.arena.l * 0.48), 0, 1);
    const defendZ = (ball.z + ownGoalZ) * 0.42;
    const attackZ = ball.z - ownSign * state.arena.l * (rank === 0 ? 0.11 : 0.16);
    return {
      x: clamp(ball.x * (danger > 0.42 ? 0.38 : 0.54) + side * state.arena.w * roleCfg.width * (danger > 0.42 ? 0.48 : 0.86), -state.arena.w * 0.42, state.arena.w * 0.42),
      z: clamp(danger > 0.42 ? defendZ : attackZ, -state.arena.l * 0.40, state.arena.l * 0.40)
    };
  }
  if (role === "midfield") {
    return {
      x: clamp(ball.x * 0.42 + side * state.arena.w * roleCfg.width, -state.arena.w * 0.44, state.arena.w * 0.44),
      z: clamp(ball.z * 0.30 + ownSign * state.arena.l * (style.defence > 1.2 ? 0.08 : -0.02), -state.arena.l * 0.38, state.arena.l * 0.38)
    };
  }
  return {
    x: clamp(ball.x * 0.62 + side * state.arena.w * roleCfg.width, -state.arena.w * 0.43, state.arena.w * 0.43),
    z: clamp(ball.z - ownSign * state.arena.l * 0.16, -state.arena.l * 0.35, state.arena.l * 0.42)
  };
}

function approachTargetBehindBall(ball, aim, distance) {
  const ax = aim.x - ball.x;
  const az = aim.z - ball.z;
  const len = Math.hypot(ax, az) || 1;
  return {
    x: ball.x - ax / len * distance,
    z: ball.z - az / len * distance,
    y: ball.y || BALL_RADIUS
  };
}

function approachTargetForTouch(state, team, ball, aim, distance) {
  const target = approachTargetBehindBall(ball, aim, distance);
  const sideWall = Math.abs(ball?.x || 0) > state.arena.w / 2 - 9.0;
  if (!sideWall) return target;
  const enemySign = team === "blue" ? 1 : -1;
  const wallSide = Math.sign(ball.x || 0) || 1;
  const insideOffset = clamp(distance + 3.2, 6.0, 10.2);
  const behindOffset = clamp(distance * 0.62 + 2.8, 5.2, 9.8);
  return {
    x: clamp((ball.x || 0) - wallSide * insideOffset, -state.arena.w * 0.42, state.arena.w * 0.42),
    z: clamp((ball.z || 0) - enemySign * behindOffset, -state.arena.l * 0.42, state.arena.l * 0.42),
    y: ball.y || BALL_RADIUS
  };
}

function closestOpponentTo(state, team, target) {
  const opponents = opponentCars(state, team);
  if (!opponents.length) return null;
  let best = null;
  let bestD = Infinity;
  for (const opponent of opponents) {
    const d = distance2(opponent, target);
    if (d < bestD) { bestD = d; best = opponent; }
  }
  return best ? { car: best, dist: bestD } : null;
}

function noteAiWallContact(car, state, normalX, normalZ, impactSpeed = 0) {
  if (car.human) return;
  const memory = ensureAiMemory(car);
  memory.wallContactTick = state.tick;
  memory.wallNormalX = normalX;
  memory.wallNormalZ = normalZ;
  memory.wallImpactSpeed = impactSpeed;
  car.aiWallContactTick = state.tick;
  car.aiWallNormalX = normalX;
  car.aiWallNormalZ = normalZ;
  car.aiWallImpactSpeed = impactSpeed;
}

function noteAiBump(car, other, state, normalX, normalZ, closing = 0) {
  if (car.human) return;
  const memory = ensureAiMemory(car);
  memory.lastBumpTick = state.tick;
  memory.lastBumpCar = other?.id || null;
  memory.bumpNormalX = normalX;
  memory.bumpNormalZ = normalZ;
  memory.avoidCarId = other?.id || null;
  memory.avoidUntil = Math.max(memory.avoidUntil || 0, state.tick + Math.round(0.62 * 120));
  memory.yieldUntil = Math.max(memory.yieldUntil || 0, state.tick + Math.round((other?.human ? 0.52 : 0.36) * 120));
  memory.avoidSide = Math.abs(normalX) > 0.12
    ? Math.sign(normalX)
    : (Math.sign((car.x || 0) - (other?.x || 0)) || (car.team === "blue" ? 1 : -1));
  memory.avoidReason = other?.human ? "recover from player bump" : "recover from car bump";
  memory.committedUntil = Math.min(memory.committedUntil || state.tick, state.tick + Math.round(0.08 * 120));
  car.aiLastBumpTick = state.tick;
  car.aiLastBumpCar = other?.id || null;
  car.aiBumpNormalX = normalX;
  car.aiBumpNormalZ = normalZ;
  car.aiBumpClosing = closing;
  car.aiPlan = null;
  car.aiNextThinkTick = state.tick;
}

function routeObstacleAvoidance(car, state, target, intent, skill, opts = {}) {
  const memory = ensureAiMemory(car);
  const immediateTouch = !!opts.immediateTouch;
  const teamCommandActive = !!opts.teamCommandActive;
  if (!target) return { active: false, target, forceReverse: false, reason: "" };
  const risk = opts.routeRisk || routeRisk(car, state, target, {
    skill,
    intent,
    touchPoint: opts.touchPoint || state.ball
  });
  const safeDirectTouch = immediateTouch
    && risk.reachesBallFirst
    && !risk.blockerInBallCapsule
    && risk.risk < (risk.human ? 0.62 : 0.78);
  if ((teamCommandActive || intent === "kickoff" || intent === "save") && !risk.blocked) {
    return { active: false, target, forceReverse: false, reason: "" };
  }
  if (safeDirectTouch) return { active: false, target, forceReverse: false, reason: "" };
  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const len = Math.hypot(dx, dz);
  if (len < 7 && !risk.blocked) return { active: false, target, forceReverse: false, reason: "" };
  const ux = dx / len;
  const uz = dz / len;
  const rightX = uz;
  const rightZ = -ux;

  if (risk.blocked) {
    const side = risk.side || memory.avoidSide || 1;
    memory.avoidUntil = state.tick + Math.round(clamp(0.34 + skill.discipline * 0.16 + (risk.human ? 0.12 : 0), 0.34, 0.68) * 120);
    memory.avoidSide = side;
    memory.avoidCarId = risk.blockerId || null;
    memory.avoidReason = risk.reason || "avoid blocked lane";
    if (risk.teammate && risk.human) memory.yieldUntil = Math.max(memory.yieldUntil || 0, state.tick + Math.round(0.55 * 120));
    const offset = clamp((risk.hardBlock ? 8.4 : 6.2) + skill.discipline * 2.0 + (risk.human ? 3.0 : 0), 5.6, risk.human ? 15.0 : 11.8) * side;
    return {
      active: true,
      target: {
        x: clamp(target.x + rightX * offset, -state.arena.w / 2 + 7, state.arena.w / 2 - 7),
        z: clamp(target.z + rightZ * offset, -state.arena.l / 2 + 7, state.arena.l / 2 - 7)
      },
      forceReverse: risk.brake && risk.timeToBlocker < 0.35 && carSpeed2(car) < 15,
      brake: risk.brake,
      risk,
      reason: risk.reason || "avoid blocked lane"
    };
  }

  if (state.tick < (memory.avoidUntil || 0) && memory.avoidSide) {
    const offset = clamp(5.8 + skill.discipline * 1.8, 4.5, 8.2) * memory.avoidSide;
    return {
      active: true,
      target: {
        x: clamp(target.x + rightX * offset, -state.arena.w / 2 + 7, state.arena.w / 2 - 7),
        z: clamp(target.z + rightZ * offset, -state.arena.l / 2 + 7, state.arena.l / 2 - 7)
      },
      forceReverse: false,
      reason: memory.avoidReason || "persistent avoidance"
    };
  }

  let best = null;
  for (const other of Object.values(state.cars || {})) {
    if (other.id === car.id || (other.demoTimer || 0) > 0) continue;
    const ox = (other.x + (other.vx || 0) * 0.28) - (car.x + (car.vx || 0) * 0.18);
    const oz = (other.z + (other.vz || 0) * 0.28) - (car.z + (car.vz || 0) * 0.18);
    const along = ox * ux + oz * uz;
    if (along < 1.5 || along > Math.min(len, 25)) continue;
    const side = ox * rightX + oz * rightZ;
    const corridor = CAR_RADIUS * (other.human ? 2.25 : 2.05);
    if (Math.abs(side) > corridor) continue;
    const relVx = (car.vx || 0) - (other.vx || 0);
    const relVz = (car.vz || 0) - (other.vz || 0);
    const closing = relVx * ux + relVz * uz;
    const headOn = closing > 2 || along < 7;
    const score = (corridor - Math.abs(side)) + clamp(18 - along, 0, 18) * 0.10 + (headOn ? 1.8 : 0) + (other.human ? 0.8 : 0);
    if (!best || score > best.score) best = { other, side, along, closing, score };
  }

  if (!best) return { active: false, target, forceReverse: false, reason: "" };
  const side = best.side >= 0 ? -1 : 1;
  memory.avoidUntil = state.tick + Math.round(clamp(0.28 + skill.discipline * 0.12, 0.26, 0.50) * 120);
  memory.avoidSide = side;
  memory.avoidCarId = best.other.id || null;
  memory.avoidReason = best.other.human ? "avoid player lane" : "avoid car lane";
  const offset = clamp(6.2 + skill.discipline * 2.0, 5.2, 9.0) * side;
  const forceReverse = best.along < 5.0 && best.closing > 3.5 && carSpeed2(car) < 12;
  return {
    active: true,
    target: {
      x: clamp(target.x + rightX * offset, -state.arena.w / 2 + 7, state.arena.w / 2 - 7),
      z: clamp(target.z + rightZ * offset, -state.arena.l / 2 + 7, state.arena.l / 2 - 7)
    },
    forceReverse,
    reason: memory.avoidReason
  };
}

function aiTouchSetup(car, state, ball, aim, skill, intent, role, danger01) {
  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const fwd = fwdFromYaw(car.yaw || 0);
  const toBallX = ball.x - car.x;
  const toBallZ = ball.z - car.z;
  const dist = Math.hypot(toBallX, toBallZ) || 1;
  const ballAhead = (toBallX * fwd.x + toBallZ * fwd.z) / dist;
  const ballSpeed = Math.hypot(ball.vx || 0, ball.vz || 0);
  const ballGoalSide = enemySign * ball.z;
  const carGoalSide = enemySign * car.z;
  const behindBall = carGoalSide < ballGoalSide - 0.6;
  const opponent = closestOpponentTo(state, car.team, ball);
  const pressure = opponent ? clamp(1 - opponent.dist / 22, 0, 1) : 0;
  const attackingRole = role === "attack" || role === "balanced" || role === "midfield";
  const touchLane = wallSafeTouchAim(state, car.team, ball, aim || goalTargetForShot(state, car.team, ball, skill, car), intent, danger01);
  const contact = contactQualityFor(car, state, ball, touchLane, skill, intent, danger01);
  const sideWallBall = Math.abs(ball.x || 0) > state.arena.w / 2 - 9.0;
  const nearBackWallBall = Math.abs(ball.z || 0) > state.arena.l / 2 - 11.0;
  const closeReachableWallTouch = sideWallBall
    && nearBackWallBall
    && Math.abs(car.x || 0) < Math.abs(ball.x || 0) - 0.6
    && dist < (nearBackWallBall ? 8.8 : 7.6)
    && ballAhead > -0.12
    && enemySign * ((ball.z || 0) - (car.z || 0)) < (nearBackWallBall ? 11.5 : 8.5);
  const ownEta = aiCarEta(car, ball, state, skill, danger01);
  const opponentEta = opponentEtaTo(state, car.team, ball, skill, danger01);
  const hasTimeForCorrection = ownEta + (skill.discipline > 1 ? 0.26 : 0.14) < opponentEta || (opponentEta === Infinity && dist > 8);
  const wrongSideCorrection = attackingRole
    && (intent === "shot" || intent === "pass")
    && contact.wrongSide
    && !closeReachableWallTouch
    && hasTimeForCorrection
    && danger01 < 0.54
    && dist < 24
    && skill.discipline > 0.74;
  const controllable = attackingRole
    && (intent === "shot" || intent === "pass")
    && (behindBall || contact.controlled)
    && ball.y < 3.4
    && dist < 11.5
    && ballAhead > 0.18
    && danger01 < 0.58;

  if (wrongSideCorrection) {
    const side = Math.sign(car.x - ball.x) || Math.sign((opponent?.car?.x || 0) - ball.x) || 1;
    const loopDistance = clamp(6.2 + skill.aim * 1.6 + ballSpeed * 0.025, 5.8, 9.2);
    const laneLen = Math.hypot(touchLane.x - ball.x, touchLane.z - ball.z) || 1;
    const laneRightX = (touchLane.z - ball.z) / laneLen;
    const laneRightZ = -(touchLane.x - ball.x) / laneLen;
    const target = approachTargetBehindBall(ball, touchLane, loopDistance);
    target.x = clamp(target.x + laneRightX * side * 3.8, -state.arena.w * 0.44, state.arena.w * 0.44);
    target.z = clamp(target.z + laneRightZ * side * 3.8, -state.arena.l * 0.44, state.arena.l * 0.44);
    return { active: true, target, jump: false, boostScale: 0.22, precise: true, targetSpeed: 10 + skill.aim * 3, reason: "loop for clean touch" };
  }

  if (!controllable) {
    return { active: false, target: null, jump: false, boostScale: 1, precise: false, targetSpeed: 0, reason: "" };
  }

  const carryBias = pressure > 0.35 ? 0.16 : 0.07;
  const desiredBehind = clamp(3.2 + ballSpeed * 0.055 - skill.aim * 0.55 + (1 - contact.score) * 1.0, 2.2, 5.4);
  let target = approachTargetForTouch(state, car.team, ball, touchLane, desiredBehind);
  const wallSide = Math.sign(ball.x || 0) || 1;

  // Better bots offset the touch when pressured, creating a Rocket League-like
  // hook/cut rather than always driving through the exact centre of the ball.
  if (skill.shot > 0.78 && pressure > 0.18) {
    const side = Math.sign((opponent?.car?.x || 0) - ball.x) || Math.sign(car.x - ball.x) || 1;
    target.x = clamp(target.x - side * state.arena.w * carryBias, -state.arena.w * 0.44, state.arena.w * 0.44);
  }

  const isPass = intent === "pass";
  const sideWall = sideWallBall;
  const manageableCarry = !isPass
    && !sideWall
    && ball.y < 2.55
    && ballSpeed < 24 + skill.aim * 4
    && enemySign * ball.z < state.arena.l * 0.20
    && danger01 < 0.48
    && (behindBall || contact.score > 0.58)
    && pressure < 0.58;
  const isFinishingTouch = !isPass
    && !manageableCarry
    && (enemySign * ball.z > state.arena.l * 0.25 || pressure > 0.58 || contact.score > 0.72);
  if (sideWall) {
    const insideOffset = clamp(desiredBehind + 3.8, 5.5, 9.0);
    const behindOffset = clamp(desiredBehind + 2.2, 4.4, 8.4);
    target.x = clamp((ball.x || 0) - wallSide * insideOffset, -state.arena.w * 0.42, state.arena.w * 0.42);
    target.z = clamp((ball.z || 0) - enemySign * behindOffset, -state.arena.l * 0.42, state.arena.l * 0.42);
    const nearBackWall = nearBackWallBall;
    const canTakeInwardTouch = closeReachableWallTouch
      && contact.score > (nearBackWall ? 0.18 : 0.34)
      && (nearBackWall || !contact.wrongSide);
    if (canTakeInwardTouch) {
      return {
        active: true,
        target: {
          x: clamp((ball.x || 0) + wallSide * (nearBackWall ? 0.35 : 0.0), -state.arena.w / 2 + 3.0, state.arena.w / 2 - 3.0),
          z: (ball.z || 0) + (touchLane.z - (ball.z || 0)) * (nearBackWall ? 0.07 : 0.04)
        },
        jump: false,
        boostScale: nearBackWall ? 0.20 : 0.48,
        precise: false,
        targetSpeed: clamp(ballSpeed + 6.0 + skill.shot * 1.3, 9.0, nearBackWall ? 13.6 : 18.5),
        reason: "take wall ball inward"
      };
    }
  }
  const aligned = ballAhead > 0.62 && Math.abs(target.x - car.x) < 5.5 + skill.aim * 3;
  const jump = isFinishingTouch
    && aligned
    && car.grounded
    && dist < 5.6
    && ball.y > 1.55
    && ball.y < 4.8
    && Math.random() < clamp(0.18 + skill.jump * skill.shot * 0.42, 0, 0.72);

  return {
    active: true,
    target,
    jump,
    boostScale: manageableCarry ? 0.22 : isPass ? 0.52 : (pressure > 0.45 || isFinishingTouch ? 1.10 : 0.56),
    precise: skill.aim > 0.82,
    targetSpeed: manageableCarry
      ? clamp(ballSpeed + 5.2 + skill.aim * 1.6, 7.5, 14.5)
      : isFinishingTouch && contact.score > 0.66
        ? clamp(16 + skill.shot * 4 - pressure * 2, 14, 23)
        : clamp(10.5 + skill.aim * 3.2 - pressure * 2, 8, 16),
    reason: manageableCarry ? "carry ball under control" : contact.score > 0.62 ? "clean touch lane" : "controlled approach"
  };
}

function nearestUsefulBoostPad(car, state, preferBig = false, routeTarget = null, skill = null, role = "balanced") {
  const pads = (state.boostPads || []).filter(p => p.active !== false && (preferBig ? p.big : true));
  if (!pads.length && preferBig) return nearestUsefulBoostPad(car, state, false, routeTarget, skill, role);
  let best = null;
  let bestScore = Infinity;
  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const routeWeight = clamp(skill?.padRouting ?? 0.5, 0.15, 1.2);
  const currentToTarget = routeTarget ? Math.hypot(car.x - routeTarget.x, car.z - routeTarget.z) : 0;
  for (const p of pads) {
    const d = Math.hypot(car.x - p.x, car.z - p.z);
    const ownHalfBonus = Math.sign(p.z || 0) === ownSign ? -6 : 0;
    const roleForwardBonus = (role === "attack" || role === "midfield") && Math.sign(p.z || 0) === enemySign ? -3.5 : 0;
    const defenderPullPenalty = (role === "goalkeeper" || role === "defence") && Math.sign(p.z || 0) === enemySign ? 8.5 * routeWeight : 0;
    const bigBonus = p.big ? -12 : 0;
    const airPenalty = Math.abs(car.y - CAR_GROUND_Y) > 2 ? 20 : 0;
    let routePenalty = 0;
    if (routeTarget) {
      const padToTarget = Math.hypot(p.x - routeTarget.x, p.z - routeTarget.z);
      const extraRoute = Math.max(0, d + padToTarget - currentToTarget);
      const midX = car.x * 0.42 + routeTarget.x * 0.58;
      const midZ = car.z * 0.42 + routeTarget.z * 0.58;
      const routeDeviation = Math.hypot(p.x - midX, p.z - midZ);
      routePenalty = (extraRoute * 0.42 + routeDeviation * 0.22) * routeWeight;
    }
    const greedyDiscount = skill?.padRouting < 0.55 && d < 18 ? -4 : 0;
    const score = d + routePenalty + ownHalfBonus + roleForwardBonus + defenderPullPenalty + bigBonus + airPenalty + greedyDiscount;
    if (score < bestScore) { bestScore = score; best = p; }
  }
  return best;
}

function deterministicNoise(car, state, scale = 1) {
  const seed = car.aiNoiseSeed || 0;
  return {
    x: Math.sin(state.tick * 0.021 + seed * 1.73) * scale,
    z: Math.cos(state.tick * 0.017 + seed * 2.31) * scale
  };
}

function aiRoundRoll(car, state, salt = 0) {
  const serial = Number(state.sound?.roundSerial || 1);
  const seed = Number(car.aiNoiseSeed || 0);
  const v = Math.sin(serial * 12.9898 + seed * 78.233 + salt * 37.719) * 43758.5453123;
  return v - Math.floor(v);
}

function aiFrameRoll(car, state, salt = 0) {
  const seed = Number(car.aiNoiseSeed || 0);
  const v = Math.sin((state.tick || 0) * 12.9898 + seed * 78.233 + salt * 37.719) * 43758.5453123;
  return v - Math.floor(v);
}

function setAiDebug(car, intent, tx, tz, reason = "") {
  car.aiIntent = intent;
  car.aiTargetX = tx;
  car.aiTargetZ = tz;
  car.aiReason = reason;
  car.aiSlot = car.aiPlan?.teamSlot || car.aiSlot || "unassigned";
}

function wallPressure(car, state, margin = 8.5) {
  const halfW = state.arena.w / 2;
  const halfL = state.arena.l / 2;
  const px = clamp((halfW - Math.abs(car.x)) / margin, 0, 1);
  const pz = clamp((halfL - Math.abs(car.z)) / margin, 0, 1);
  const nearSide = px < 1;
  const nearBack = pz < 1;
  return {
    near: nearSide || nearBack,
    side: nearSide ? Math.sign(car.x || 1) : 0,
    back: nearBack ? Math.sign(car.z || 1) : 0,
    amount: Math.max(nearSide ? 1 - px : 0, nearBack ? 1 - pz : 0),
    corner: nearSide && nearBack
  };
}

function escapeTargetFromWall(car, state, pressure) {
  const memory = ensureAiMemory(car);
  const wallNx = memory.wallNormalX || (pressure.side ? -pressure.side : 0);
  const wallNz = memory.wallNormalZ || (pressure.back ? -pressure.back : 0);
  const laneToBallZ = clamp((state.ball.z - car.z) * 0.18, -12, 12);
  const tangentX = pressure.back ? Math.sign(state.ball.x - car.x || car.x || 1) * 10 : 0;
  const tangentZ = pressure.side ? Math.sign(state.ball.z - car.z || -pressure.side || 1) * 12 : laneToBallZ;
  const awayX = wallNx * (pressure.corner ? 26 : 21) + tangentX;
  const awayZ = wallNz * (pressure.corner ? 28 : 22) + tangentZ;
  return {
    x: clamp(car.x + awayX, -state.arena.w / 2 + 12, state.arena.w / 2 - 12),
    z: clamp(car.z + awayZ, -state.arena.l / 2 + 12, state.arena.l / 2 - 12)
  };
}

function updateAiRecovery(car, state, target, intent, skill) {
  const memory = ensureAiMemory(car);
  const speed = carSpeed2(car);
  const pressure = wallPressure(car, state);
  const grounded = car.grounded && Math.abs(car.y - CAR_GROUND_Y) < 1.25;
  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const dist = Math.hypot(dx, dz);
  const fwd = fwdFromYaw(car.yaw || 0);
  const frontDot = dist > 0.001 ? (dx * fwd.x + dz * fwd.z) / dist : 1;
  const facingWall = pressure.near && (
    (pressure.side && pressure.side * fwd.x > 0.50) ||
    (pressure.back && pressure.back * fwd.z > 0.50)
  );
  const ballDist = distance2(car, state.ball);
  const toBallX = state.ball.x - car.x;
  const toBallZ = state.ball.z - car.z;
  const toBallLen = Math.hypot(toBallX, toBallZ) || 1;
  const ballAhead = (toBallX * fwd.x + toBallZ * fwd.z) / toBallLen;
  const recentWall = state.tick - Number(memory.wallContactTick ?? car.aiWallContactTick ?? -9999) < Math.round(0.55 * 120);
  const recentBump = state.tick - Number(memory.lastBumpTick ?? car.aiLastBumpTick ?? -9999) < Math.round(0.42 * 120);
  const targetProgress = dist;
  if (Number.isFinite(memory.lastRouteProgress) && targetProgress > memory.lastRouteProgress - 0.18 && speed < 9 && dist > 8) memory.noProgressTicks = (memory.noProgressTicks || 0) + 1;
  else memory.noProgressTicks = Math.max(0, (memory.noProgressTicks || 0) - 2);
  memory.lastRouteProgress = targetProgress;
  const pinned = grounded && pressure.near && speed < 3.2 && (facingWall || pressure.corner || frontDot < -0.55);
  const blocked = grounded && speed < 2.2 && dist > 9 && Math.abs(frontDot) < 0.22;
  const wallGrind = grounded && pressure.near && recentWall && (facingWall || frontDot > 0.35 || pressure.corner) && speed < 16;
  const bumpStall = grounded && recentBump && speed < 7.5 && dist > 6;
  const noProgress = grounded && (memory.noProgressTicks || 0) > Math.round(0.22 * 120) && pressure.near;
  const urgent = intent === "save" || intent === "kickoff";
  const targetInward = (!pressure.side || Math.abs(target.x) < state.arena.w / 2 - 11)
    && (!pressure.back || Math.abs(target.z) < state.arena.l / 2 - 11);
  const activeCornerPlay = ["shot", "challenge", "pass"].includes(intent)
    && pressure.near
    && targetInward
    && ballDist < 18
    && !facingWall;
  const reachableWallTouch = ["shot", "challenge", "pass"].includes(intent)
    && pressure.near
    && ballDist < 9.2
    && Math.hypot((target.x || 0) - (state.ball.x || 0), (target.z || 0) - (state.ball.z || 0)) < 4.8
    && ballAhead > -0.20;
  const urgentTouchBypass = (urgent && ballDist < (intent === "save" ? 8.8 : 7.2) && ballAhead > 0.34 && !facingWall)
    || activeCornerPlay
    || reachableWallTouch;
  if (!urgentTouchBypass && (pinned || blocked || wallGrind || bumpStall || noProgress)) {
    car.aiStuckTicks = (car.aiStuckTicks || 0) + 1;
  } else if (speed > 6 || !grounded || urgentTouchBypass) {
    car.aiStuckTicks = Math.max(0, (car.aiStuckTicks || 0) - 4);
  } else {
    car.aiStuckTicks = Math.max(0, (car.aiStuckTicks || 0) - 1);
  }

  if (car.aiRecoveryUntil && state.tick < car.aiRecoveryUntil) {
    return { active: true, pressure, escape: escapeTargetFromWall(car, state, pressure), reverse: !!car.aiRecoveryReverse };
  }
  car.aiRecoveryUntil = 0;
  car.aiRecoveryReverse = false;

  const threshold = Math.round(22 - clamp(skill.recovery || 0.8, 0.35, 1.35) * 9);
  const immediateWallEscape = !urgentTouchBypass && grounded && (wallGrind || (recentWall && pressure.corner) || bumpStall);
  if (!urgentTouchBypass && (immediateWallEscape || car.aiStuckTicks > threshold)) {
    const reverse = facingWall || pressure.corner || frontDot < -0.42 || bumpStall;
    car.aiRecoveryUntil = state.tick + Math.round((reverse ? 0.52 : 0.36) * 120);
    car.aiRecoveryReverse = reverse;
    car.aiPlan = null;
    car.aiNextThinkTick = 0;
    memory.lastRecoveryTick = state.tick;
    return { active: true, pressure, escape: escapeTargetFromWall(car, state, pressure), reverse };
  }
  return { active: false, pressure, escape: null, reverse: false };
}

function roleBoostReserve(role, intent, danger01 = 0, skill = null) {
  if (intent === "kickoff") return 1;
  if (intent === "save") return danger01 > 0.70 ? 3 : 9;
  if (intent === "shot" || intent === "challenge" || intent === "pass") return role === "goalkeeper" ? 18 : role === "defence" ? 10 : 5;
  const discipline = clamp(skill?.discipline ?? 1, 0.5, 1.45);
  const base = role === "goalkeeper" ? 24 : role === "defence" ? 15 : role === "midfield" ? 10 : role === "balanced" ? 12 : 5;
  return Math.round(base * (0.88 + discipline * 0.12));
}

function shouldBoostForPlan(car, intent, target, drive, role, skill, board = null) {
  if (!drive || !target || car.boost <= 0.1) return false;
  if (drive.throttle < 0.05 || drive.dist < 6.5) return false;
  const reserve = roleBoostReserve(role, intent, board?.danger || 0, skill);
  if (car.boost <= reserve) return false;
  const urgent = intent === "kickoff" || intent === "save" || (board?.danger > 0.66 && intent === "challenge");
  const angleLimit = urgent ? 0.62 : intent === "shot" ? 0.36 : intent === "challenge" ? 0.42 : 0.30;
  if (Math.abs(drive.delta) > angleLimit) return false;
  if (role === "goalkeeper" && !urgent && board?.danger > 0.38) return false;
  if ((intent === "support" || intent === "rotate" || intent === "guard") && car.boost < reserve + 12) return false;
  return true;
}

function makeDriveInput(car, target, state, skill, intent, opts = {}) {
  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const dist = Math.hypot(dx, dz);
  const desiredYaw = Math.atan2(dx, dz);
  const delta = angleNorm(desiredYaw - car.yaw);
  const speed = carSpeed2(car);
  const forwardSpeed = dot2(car.vx, car.vz, Math.sin(car.yaw), Math.cos(car.yaw));
  const aimPower = 1.55 + skill.aim * 0.48;
  let steer = clamp(delta * aimPower, -1, 1);
  const precise = opts.precise || intent === "save" || intent === "guard" || dist < 10;
  const allowReverse = opts.allowReverse !== false;
  const shouldBackUp = allowReverse && (opts.forceReverse || (Math.abs(delta) > 2.18 && dist < (precise ? 22 : 18)));
  let throttle = shouldBackUp ? (opts.forceReverse ? -0.88 : -0.58) : clamp(dist / (precise ? 16 : 10), 0.30, 1) * skill.speed;
  if (shouldBackUp) steer *= -1;
  if (Math.abs(delta) > 1.15 && !shouldBackUp) throttle *= precise ? 0.38 : 0.56;
  if (intent === "recover") throttle = clamp(throttle, 0.34, 0.82);
  if (intent === "boost") throttle = 1;
  const hasTargetSpeed = opts.targetSpeed !== undefined && opts.targetSpeed !== null && Number.isFinite(Number(opts.targetSpeed));
  const requestedTargetSpeed = hasTargetSpeed ? Number(opts.targetSpeed) : 0;
  if (!shouldBackUp && hasTargetSpeed && dist < (opts.slowRadius || 14)) {
    const targetSpeed = Math.max(0, requestedTargetSpeed);
    if (forwardSpeed > targetSpeed + 5) throttle = Math.min(throttle, precise ? -0.24 : 0.04);
    else if (forwardSpeed > targetSpeed + 1.5) throttle = Math.min(throttle, targetSpeed < 1 ? -0.10 : 0.22);
    else if (forwardSpeed > targetSpeed - 1) throttle = Math.min(throttle, targetSpeed < 1 ? 0.08 : 0.55);
  }
  if (!shouldBackUp && opts.brakeForRisk) {
    throttle = Math.min(throttle, opts.brakeForRisk > 0.75 ? -0.14 : 0.18);
    if (Math.abs(delta) > 0.50) steer = clamp(steer * 1.10, -1, 1);
  }
  if (["guard", "shadow", "support", "rotate", "fake"].includes(intent) && !shouldBackUp) {
    const holdRadius = intent === "guard" ? 13 : intent === "shadow" ? 16 : 18;
    const targetSpeed = intent === "guard" ? 7.5 : intent === "shadow" ? 12 : intent === "fake" ? 13 : 16;
    if (dist < holdRadius && forwardSpeed > targetSpeed) throttle *= intent === "guard" ? 0.18 : 0.34;
    if (dist < 5.2 && forwardSpeed > 5.5) throttle = -0.26;
    if (intent === "shadow" && throttle > 0) throttle = clamp(throttle, 0.16, 0.68);
    if (intent === "fake" && throttle > 0) throttle = clamp(throttle, 0.18, 0.72);
  }
  const aligned = Math.abs(delta) < (precise ? 0.20 : 0.32);
  const driftThreshold = intent === "kickoff" ? 0.38 : (precise ? 0.68 : 0.52);
  const driftSkill = clamp(skill.rotation * (intent === "kickoff" ? 1.18 : 1), 0, 1.45);
  const driftConfidence = clamp((driftSkill - 0.34) / 0.82, 0, 1);
  const driftWindow = driftConfidence > 0.78 || Math.sin(state.tick * 0.047 + (car.aiNoiseSeed || 0) * 1.9) > 0.18 - driftConfidence * 0.98;
  const shouldDrift = car.grounded
    && !shouldBackUp
    && speed > (intent === "kickoff" ? 8.0 : 9.2)
    && Math.abs(delta) > driftThreshold
    && Math.abs(delta) < 2.62
    && driftSkill > 0.38
    && driftWindow;
  const boostIntent = ["challenge", "shot", "pass", "save", "kickoff", "boost"].includes(intent);
  const boostAngle = (intent === "kickoff" ? 0.50 : intent === "save" ? 0.38 : 0.34) + clamp((skill.boost - 0.75) * 0.08 + (skill.commit - 0.75) * 0.05, -0.05, 0.12);
  const boostMinDist = Math.max(7, (intent === "kickoff" ? 9 : intent === "save" ? 13 : 18) - clamp((skill.boost - 0.55) * 4.0, 0, 4.5));
  const boostReserve = Number(opts.boostReserve ?? (precise ? 14 : 7));
  const boostAllowed = throttle >= 0.04 && car.boost > boostReserve && (car.grounded || state.mode === "flying");
  const boost = boostAllowed
    && boostIntent
    && Math.abs(delta) < boostAngle
    && dist > boostMinDist
    && forwardSpeed > -2
    && Math.random() < clamp(skill.boost * (opts.boostScale || 1), 0, 1.45);
  return { throttle, steer, boost, drift: shouldDrift, aligned, dist, delta };
}

export function makeAIInput(car, state, meta, players = {}) {
  const cfg = MODE_CONFIGS[state.mode] || MODE_CONFIGS.standard;
  const difficulty = meta.difficulty || "pro";
  const tune = aiTuningForCar(meta, car);
  const skill = { ...aiSkill(meta) };
  const style = { ...styleConfig(meta) };
  const role = ROLES.includes(car.role) ? car.role : "balanced";
  const roleCfg = roleConfig(role);
  const teamCommand = activeCommandForCar(meta, car);
  const smartBoost = opponentCommandBoost(meta, car, players);
  if (smartBoost > 1) {
    skill.think /= smartBoost; skill.aim *= smartBoost; skill.read *= smartBoost; skill.rotation *= smartBoost; skill.challenge *= smartBoost; skill.save *= smartBoost; skill.intercept *= smartBoost; skill.discipline *= smartBoost; skill.recovery *= smartBoost; skill.mistake /= smartBoost; skill.error /= smartBoost; skill.boost *= Math.min(1.12, smartBoost);
  }
  skill.speed *= (0.96 + (tune.aggression - 1) * 0.35 + (tune.boost - 1) * 0.18);
  skill.boost *= tune.boost;
  skill.aerialBoost *= (0.96 + (tune.boost - 1) * 0.28 + (tune.aggression - 1) * 0.16);
  skill.fastAerial *= (0.96 + (tune.aggression - 1) * 0.20);
  skill.padRouting *= (0.96 + (tune.boost - 1) * 0.34);
  skill.commit *= (0.98 + (tune.aggression - 1) * 0.22 + (tune.defence - 1) * -0.10);
  skill.jump *= (0.94 + (tune.aggression - 1) * 0.25);
  skill.save *= (0.96 + (tune.defence - 1) * 0.34);
  skill.challenge *= roleCfg.challenge;
  skill.rotation *= roleCfg.rotation;
  skill.aerial *= roleCfg.aerial;
  skill.patience *= roleCfg.patience;
  skill.discipline *= roleCfg.discipline;
  skill.commit *= role === "attack" ? 1.08 : role === "midfield" ? 1.00 : role === "balanced" ? 0.96 : role === "defence" ? 0.84 : 0.72;
  skill.aerialBoost *= roleCfg.aerial;
  style.attack *= tune.aggression * roleCfg.attack;
  style.defence *= tune.defence * roleCfg.defence;
  style.chase *= (0.98 + (tune.aggression - 1) * 0.34) * roleCfg.challenge;
  style.support *= roleCfg.support;
  style.rotation *= roleCfg.rotation;
  style.boostDiscipline *= (1 + (1 - tune.boost) * 0.26) / roleCfg.boostNeed;

  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const ownGoalZ = ownSign * (state.arena.l / 2 - 6.4);
  const enemyGoalZ = enemySign * (state.arena.l / 2 - 8.8);
  const ball = state.ball;
  const memory = ensureAiMemory(car);
  const board = ensureAiBlackboards(state, meta)?.[car.team] || null;
  const boardTrust = board && (difficulty !== "rookie" || aiRoundRoll(car, state, 21) > 0.58);
  const ballSpeed = Math.hypot(ball.vx, ball.vz);
  const movingAtOwnGoal = Math.sign(ball.vz || ownSign) === ownSign && Math.abs(ball.vz) > 1.5;
  const ownHalfDepth = clamp((ownSign * ball.z) / (state.arena.l * 0.50), 0, 1);
  const nearOwnGoal = Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.28;
  const localDanger01 = clamp((movingAtOwnGoal ? 0.35 : 0) + ownHalfDepth * 0.55 + (nearOwnGoal ? 0.24 : 0) + clamp(ballSpeed / 60, 0, 0.20), 0, 1);
  const danger01 = boardTrust ? clamp(board.danger * 0.82 + localDanger01 * 0.18, 0, 1) : localDanger01;
  const distToBall = distance2(car, ball);
  const intercept = boardTrust
    ? selectAiInterceptFromPrediction(car, state, skill, danger01, roleCfg, board)
    : selectAiIntercept(car, state, skill, danger01, roleCfg);
  const predicted = intercept.point;
  const predictedRouteRisk = routeRisk(car, state, predicted, { skill, intent: "intercept", touchPoint: predicted });
  const ownEta = aiCarEta(car, predicted, state, skill, danger01, { routeAware: true, intent: "intercept", touchPoint: predicted, routeRisk: predictedRouteRisk });
  const opponentEta = opponentEtaTo(state, car.team, predicted, skill, danger01);
  const mateEta = teamEtaTo(state, car.team, predicted, skill, danger01, car.id);
  const possessionReservation = sameTeamHumanPossession(car, state, predicted, "challenge", danger01);
  const ballTouchChanged = (memory.lastObservedBallTouchTick || memory.lastObservedBallTouchCar)
    && (memory.lastObservedBallTouchTick !== (ball.lastTouchTick || 0) || memory.lastObservedBallTouchCar !== (ball.lastTouchCar || null));
  memory.lastObservedBallTouchTick = ball.lastTouchTick || 0;
  memory.lastObservedBallTouchCar = ball.lastTouchCar || null;
  const teamSize = Math.max(1, Number(state.teamSize || meta.teamSize || 1));
  const localRank = aiRankForBall(car, state, skill, danger01);
  const teamSlot = boardTrust ? (board.slotsById?.[car.id] || (teamSize <= 1 ? "first_man" : "support")) : null;
  const rank = boardTrust
    ? teamSlot === "first_man" ? 0 : teamSlot === "second_man" ? 1 : teamSlot === "third_man" || teamSlot === "goalkeeper" ? 2 : localRank
    : localRank;
  const firstMan = boardTrust ? (teamSlot === "first_man" || teamSize === 1 || style.chaos) : (rank === 0 || style.chaos);
  const secondMan = teamSize > 1 && (boardTrust ? teamSlot === "second_man" : rank === 1);
  const thirdMan = boardTrust ? teamSlot === "third_man" || teamSlot === "goalkeeper" : rank >= 2;
  const boardFirstEta = boardTrust && board.firstManId && board.firstManId !== car.id ? board.etasById?.[board.firstManId] : Infinity;
  const hasBetterMate = boardTrust
    ? (board.firstManId && board.firstManId !== car.id && boardFirstEta + (skill.discipline > 1 ? 0.16 : 0.05) < ownEta && !style.chaos)
    : (mateEta + (skill.discipline > 1 ? 0.18 : 0.05) < ownEta && !style.chaos);
  const behindBall = carBehindBallForTeam(car, predicted, car.team);
  const inOwnThird = ownSign * predicted.z > state.arena.l * 0.16;
  const inEnemyHalf = enemySign * predicted.z > 0;
  const routeBlockedBeforeBall = predictedRouteRisk.blocked && !predictedRouteRisk.reachesBallFirst;
  const canWinRace = ownEta < opponentEta + (skill.discipline > 1 ? 0.20 : 0.05) && !routeBlockedBeforeBall;
  const shouldPressureOpponent = opponentEta < ownEta + 0.42
    && (firstMan || style.chase > 1.15)
    && role !== "goalkeeper"
    && (!routeBlockedBeforeBall || predictedRouteRisk.opponent || danger01 > 0.78);
  const losesRaceBadly = opponentEta + (0.10 + skill.commit * 0.22) < ownEta;
  const rookieBadFifty = skill.commit < 0.65 && aiRoundRoll(car, state, 10) < 0.38;

  const shotOption = selectShotOption(state, car.team, predicted, skill, car, { approachRisk: predictedRouteRisk });
  const shotQuality = shotOption.score;
  const scoringWindow = (firstMan || secondMan)
    && (shotOption.open || shotQuality > (difficulty === "allstar" ? 0.52 : difficulty === "pro" ? 0.57 : 0.68) || (boardTrust && board.opportunity > 0.54))
    && danger01 < 0.66
    && enemySign * predicted.z > -state.arena.l * 0.18;
  let intent = "support";
  let target = { x: predicted.x, z: predicted.z };
  let aim = shotOption.target || goalTargetForShot(state, car.team, predicted, skill, car);
  let approachDistance = cfg.snooker ? 14 : 7.6;
  let precise = false;
  let holdPlan = false;
  let passOption = null;
  let driveTargetSpeed = null;
  let avoidForceReverse = false;
  let planState = "support";
  let planMechanic = "drive_intercept";
  let planReason = boardTrust ? `${teamSlot || "support"} via team board` : "local read";
  let planConfidence = boardTrust ? clamp(0.50 + skill.discipline * 0.20 + skill.read * 0.10 - intercept.score * 0.04, 0.25, 0.94) : clamp(0.42 + skill.read * 0.12, 0.20, 0.76);
  car.aiTouchJump = false;
  car.aiTouchBoostScale = 1;

  const ticksSinceRound = state.tick - Number(state.sound?.roundTick || 0);
  const kickoffActive = Math.abs(ball.x) < 0.1 && Math.abs(ball.z) < 0.1 && state.kickoffTimer <= 0 && ticksSinceRound < 120 * 4;
  const canChallenge = (firstMan && !hasBetterMate)
    || (role === "attack" && rank <= 1 && style.attack > 1.03 && !hasBetterMate)
    || (role === "balanced" && rank <= 1 && (danger01 > 0.36 || style.chase > 0.95) && !hasBetterMate)
    || (role === "midfield" && rank <= 1 && style.chase > 1.08 && danger01 < 0.72)
    || (role === "defence" && danger01 > 0.54 && rank <= 1);
  if (teamCommand) {
    const s = clamp(teamCommand.strength || 0.75, 0.1, 1);
    if (["DEFEND_GOAL", "GOALKEEPER_HOLD", "ROTATE_BACK", "CLEAR_BALL", "HOLD_POSITION"].includes(teamCommand.intent)) { style.defence *= 1 + s * 0.55; style.attack *= 1 - s * 0.22; skill.discipline *= 1 + s * 0.20; }
    if (["ATTACK_BALL", "TAKE_SHOT", "TEAM_PRESS", "CENTER_BALL"].includes(teamCommand.intent)) { style.attack *= 1 + s * 0.45; style.chase *= 1 + s * 0.28; skill.challenge *= 1 + s * 0.22; }
    if (["GET_BOOST", "ROTATE_BACK", "SPREAD_OUT"].includes(teamCommand.intent)) { style.rotation *= 1 + s * 0.32; style.boostDiscipline *= 1 + s * 0.22; }
    if (["PASS_LEFT", "PASS_RIGHT", "SUPPORT_ME"].includes(teamCommand.intent)) { style.support *= 1 + s * 0.48; skill.discipline *= 1 + s * 0.18; }
  }
  const shouldDefend = danger01 > (role === "goalkeeper" ? 0.26 : role === "defence" ? 0.35 : role === "balanced" ? 0.46 : 0.60 / Math.max(0.65, style.defence))
    || (boardTrust && (board.defensiveShapeBroken || (thirdMan && board.danger > 0.32) || (teamSlot === "goalkeeper" && board.danger > 0.26)));
  const recentOwnTouch = ball.lastTouchCar === car.id && state.tick - Number(ball.lastTouchTick || -9999) < Math.round(1.8 * 120);
  const attackingFollowup = teamSize <= 1
    && firstMan
    && !hasBetterMate
    && !shouldDefend
    && danger01 < 0.74
    && distToBall < 34
    && enemySign * predicted.z > -state.arena.l * 0.12
    && (recentOwnTouch || ownEta < opponentEta + 0.32 || enemySign * predicted.z > state.arena.l * 0.28);
  const disciplinedChallenge = canChallenge
    && (canWinRace || shouldPressureOpponent || danger01 > 0.68 || style.chaos || attackingFollowup)
    && (behindBall || danger01 > 0.52 || role === "attack" || skill.discipline < 0.82 || attackingFollowup)
    && (!losesRaceBadly || danger01 > 0.70 || rookieBadFifty || attackingFollowup || (predictedRouteRisk.opponent && firstMan && skill.discipline > 0.72) || (role === "attack" && style.chase > 1.22 && skill.discipline < 1.05));

  if (kickoffActive && (role === "attack" || role === "balanced" || rank === 0)) {
    intent = "kickoff";
    planState = "kickoff";
    planMechanic = difficulty === "allstar" ? "speed_flip_kickoff" : "drive_kickoff";
    planReason = "kickoff first touch";
    planConfidence = difficulty === "rookie" ? 0.48 : difficulty === "allstar" ? 0.86 : 0.70;
    const kickoffShot = difficulty !== "rookie" && aiRoundRoll(car, state, 2) < (difficulty === "allstar" ? 0.52 : 0.28);
    aim = kickoffShot ? goalTargetForShot(state, car.team, ball, skill, car) : { x: 0, z: enemyGoalZ };
    target = distToBall > 13
      ? { x: 0, z: 0 }
      : approachTargetBehindBall(ball, aim, kickoffShot ? 1.4 : 2.4);
    approachDistance = 0;
    precise = false;
  } else if (role === "goalkeeper") {
    const dangerousShot = boardTrust ? board.ballInfo?.dangerousShot : false;
    if (danger01 > 0.38 || inOwnThird || Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.24) {
      intent = dangerousShot || danger01 > 0.68 || (firstMan && distToBall < 16 && canWinRace) ? "save" : "guard";
      planState = intent === "save" ? (predicted.y > 5.2 ? "aerial_save" : "challenge_shot") : "guard_back_post";
      planMechanic = intent === "save" && predicted.y > 5.2 ? "aerial_save" : intent === "save" ? "drive_save" : "drive_to_target";
      planReason = intent === "save" ? "dangerous shot lane" : "hold goal-side cover";
      planConfidence = intent === "save" ? clamp(0.58 + skill.save * 0.22, 0.45, 0.92) : clamp(0.58 + skill.discipline * 0.18, 0.45, 0.88);
      const goalIntercept = ballAt(state, clamp(Math.abs(ball.z - ownGoalZ) / Math.max(12, Math.abs(ball.vz) + 7), 0.15, 1.15 + skill.read * 0.25));
      target = {
        x: clamp(goalIntercept.x * 0.88, -state.arena.goalW * 0.43, state.arena.goalW * 0.43),
        z: ownGoalZ - ownSign * (intent === "save" ? 2.0 : 0.2)
      };
      aim = clearanceTarget(state, car.team, predicted);
      precise = true;
      if (intent === "save" && (distToBall < 18 || ownEta < intercept.time + 0.45) && Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.22) {
        target = approachTargetBehindBall(predicted, aim, 5.8);
      }
    } else {
      intent = "guard";
      planState = "guard_back_post";
      planMechanic = "drive_to_target";
      planReason = "back-post discipline";
      planConfidence = clamp(0.60 + skill.discipline * 0.18, 0.45, 0.90);
      target = backPostTarget(state, car.team, ball, 3.6);
      precise = true;
      holdPlan = true;
    }
  } else if (shouldDefend && (role === "defence" || role === "balanced" || rank <= 1 || style.defence > 1.18)) {
    intent = danger01 > 0.66 && rank <= 1 && !hasBetterMate ? "save" : "shadow";
    planState = intent === "save" ? "clear_ball" : (role === "defence" ? "shadow_attacker" : "cover_center");
    planMechanic = intent === "save" && predicted.y > 5.1 ? "aerial_clear" : "drive_intercept";
    planReason = intent === "save" ? "first defender clear" : "defensive shape";
    planConfidence = clamp(0.48 + skill.save * 0.16 + skill.discipline * 0.14, 0.34, 0.88);
    aim = clearanceTarget(state, car.team, predicted);
    if (intent === "save" && distToBall < state.arena.l * 0.35 && (behindBall || danger01 > 0.78 || skill.discipline < 0.78)) {
      target = approachTargetBehindBall(predicted, aim, 6.6);
    } else {
      target = role === "defence" || role === "balanced"
        ? supportTargetForRole(car, state, role, rank, style, roleCfg, predicted, ownSign)
        : {
          x: clamp(ball.x * 0.54, -state.arena.w * 0.36, state.arena.w * 0.36),
          z: (ball.z + ownGoalZ) * 0.42
        };
    }
    precise = true;
  } else if (disciplinedChallenge && style.chase * skill.challenge > 0.52) {
    const finishLaneOpen = !routeBlockedBeforeBall || predictedRouteRisk.reachesBallFirst;
    const strongShotChance = firstMan && scoringWindow && finishLaneOpen && (shotQuality > 0.50 || shotOption.open);
    const attacking = strongShotChance
      || (boardTrust && board.openShot && finishLaneOpen)
      || (inEnemyHalf && shotQuality > 0.43 && finishLaneOpen)
      || (attackingFollowup && finishLaneOpen && enemySign * predicted.z > -state.arena.l * 0.04)
      || (style.attack > 1.12 && !inOwnThird && shotQuality > 0.48 && finishLaneOpen);
    intent = attacking ? "shot" : "challenge";
    planState = attacking ? (boardTrust && board.openShot ? "shoot" : "first_man_pressure") : "challenge_if_first";
    planMechanic = predicted.y > 5.0 && skill.aerial > 0.65 ? (attacking ? "aerial_shot" : "aerial_clear") : "drive_intercept";
    planReason = attacking ? (strongShotChance ? "high quality shot lane" : (boardTrust && board.openShot) ? "open shot lane" : "attacking first touch") : "first-man challenge";
    planConfidence = clamp(0.44 + skill.challenge * 0.14 + skill.aim * 0.08 + (board?.opportunity || 0) * 0.14 + shotQuality * 0.10, 0.30, 0.94);
    aim = wallSafeTouchAim(state, car.team, predicted, attacking ? shotOption.target : clearanceTarget(state, car.team, predicted), intent, danger01);
    passOption = attacking ? selectPassOption(car, state, predicted, skill, danger01, role) : null;
    const passBias = style.support * skill.discipline * (role === "midfield" ? 1.22 : role === "balanced" ? 1.10 : 1);
    if (!strongShotChance && passOption && passBias > 0.82 && (passOption.mate.human || passOption.score > 2.22 || enemySign * predicted.z < state.arena.l * 0.30)) {
      intent = "pass";
      planState = "pass_option";
      planMechanic = "controlled_touch";
      planReason = "open passing lane";
      planConfidence = clamp(0.54 + passOption.score * 0.10, 0.42, 0.90);
      aim = passOption.receive;
      approachDistance = cfg.snooker ? 13 : clamp(9.4 - skill.aim * 1.15 + ballSpeed * 0.025, 5.8, 11.2);
    } else {
      approachDistance = cfg.snooker ? 13 : clamp(8.8 - skill.aim * 1.45 + ballSpeed * 0.030 - skill.shot * 0.28 + (1 - shotQuality) * 1.2, 5.2, 11.6);
    }
    const contact = contactQualityFor(car, state, predicted, aim, skill, intent, danger01);
    const directFinish = strongShotChance
      && attacking
      && shotQuality > 0.56
      && contact.score > 0.66
      && finishLaneOpen
      && (!shotOption.routeRisk?.blocked || shotOption.routeRisk.reachesBallFirst);
    target = approachTargetForTouch(state, car.team, predicted, aim, approachDistance);
    if (directFinish && (distToBall < 5.6 + skill.aim * 0.7 || ownEta < 0.16)) {
      target = { x: predicted.x + (aim.x - predicted.x) * 0.08, z: predicted.z + (aim.z - predicted.z) * 0.08 };
    }
    if (routeBlockedBeforeBall && predictedRouteRisk.opponent && !attacking && danger01 < 0.74) {
      const side = predictedRouteRisk.side || (car.x <= predicted.x ? -1 : 1);
      const passedBall = enemySign * (car.z - predicted.z) > 2.5;
      const sideReady = Math.abs(car.x - predicted.x) > 7.2 && enemySign * (predicted.z - car.z) < 10.5;
      target = passedBall
        ? {
          x: clamp(predicted.x + side * clamp(9.5 + skill.discipline * 1.8, 8.5, 12.5), -state.arena.w * 0.42, state.arena.w * 0.42),
          z: clamp(predicted.z - enemySign * clamp(7.5 + skill.aim * 1.5, 6.5, 10.0), -state.arena.l * 0.42, state.arena.l * 0.42)
        }
        : sideReady
        ? {
          x: clamp(predicted.x + side * 2.4, -state.arena.w * 0.42, state.arena.w * 0.42),
          z: clamp(predicted.z - enemySign * 2.0, -state.arena.l * 0.42, state.arena.l * 0.42)
        }
        : {
          x: clamp(predicted.x + side * clamp(10.5 + skill.discipline * 2.2, 9.5, 13.5), -state.arena.w * 0.42, state.arena.w * 0.42),
          z: clamp(predicted.z - enemySign * clamp(5.8 + skill.aim * 1.6, 5.2, 8.4), -state.arena.l * 0.42, state.arena.l * 0.42)
        };
      precise = true;
      driveTargetSpeed = sideReady ? null : clamp(12 + skill.speed * 3, 11, 17);
      planState = "side_challenge";
      planMechanic = "side_challenge";
      planReason = passedBall ? "loop back around player" : sideReady ? "side lane take ball" : predictedRouteRisk.human ? "side challenge around player" : "side challenge around blocker";
    }
    const touch = aiTouchSetup(car, state, predicted, aim, skill, intent, role, danger01);
    if (touch.active) {
      target = touch.target;
      precise = touch.precise;
      car.aiTouchJump = touch.jump;
      car.aiTouchBoostScale = touch.boostScale;
      driveTargetSpeed = Number.isFinite(Number(touch.targetSpeed)) ? Number(touch.targetSpeed) : 0;
      if (touch.reason && !strongShotChance) planReason = touch.reason;
    } else {
      car.aiTouchJump = false;
      car.aiTouchBoostScale = 1;
    }
  } else if (firstMan && !hasBetterMate && shouldPressureOpponent && !routeBlockedBeforeBall && skill.fake > 0.18 && role !== "defence" && role !== "goalkeeper") {
    intent = "fake";
    planState = "fake_challenge";
    planMechanic = "fake_challenge";
    planReason = "draw opponent touch";
    planConfidence = clamp(0.38 + skill.fake * 0.32, 0.30, 0.74);
    aim = inOwnThird ? clearanceTarget(state, car.team, predicted) : goalTargetForShot(state, car.team, predicted, skill);
    target = approachTargetBehindBall(predicted, aim, 10.5 + skill.patience * 1.6);
    precise = true;
  } else if (secondMan || role === "balanced" || role === "midfield") {
    intent = "support";
    planState = role === "midfield" ? "second_man_support" : "support";
    planMechanic = "drive_to_target";
    planReason = boardTrust && teamSlot === "second_man" ? "second-man rebound lane" : "support spacing";
    planConfidence = clamp(0.46 + skill.discipline * 0.18 + (board?.opportunity || 0) * 0.08, 0.30, 0.86);
    target = supportTargetForRole(car, state, role, rank, style, roleCfg, predicted, ownSign);
    if (secondMan && scoringWindow && skill.discipline > 0.76) {
      target = reboundTargetForShot(state, car.team, predicted, shotOption.target, car);
      planState = "rebound_wait";
      planReason = "second-man rebound lane";
      holdPlan = true;
    }
    const carrier = teamCars(state, car.team).find(c => c.id !== car.id && distance2(c, ball) < 12 && carBehindBallForTeam(c, ball, car.team));
    if (teamSize > 1 && carrier && skill.discipline > 0.62 && enemySign * ball.z > -state.arena.l * 0.22) {
      const outlet = teamForwardTarget(state, car.team, car, role === "attack" ? 0.34 : 0.24);
      target.x = target.x * 0.48 + outlet.x * 0.52;
      target.z = target.z * 0.48 + outlet.z * 0.52;
    }
    precise = true;
    holdPlan = skill.discipline > 0.70;
  } else {
    intent = "rotate";
    planState = thirdMan ? "third_man_cover" : "rotate_back";
    planMechanic = "drive_to_target";
    planReason = thirdMan ? "protect counterattack" : "rotate out";
    planConfidence = clamp(0.46 + skill.rotation * 0.20, 0.30, 0.86);
    target = (role === "attack" || role === "balanced") && !thirdMan
      ? supportTargetForRole(car, state, role, rank, style, roleCfg, predicted, ownSign)
      : {
        x: clamp(((car.slotIndex % Math.max(1, teamSize)) - (teamSize - 1) / 2) * state.arena.w * 0.10 - ball.x * 0.15, -state.arena.w * 0.38, state.arena.w * 0.38),
        z: ownGoalZ - ownSign * (role === "defence" || thirdMan ? 9.0 : 15.5)
      };
    precise = true;
    holdPlan = true;
  }

  if (possessionReservation.active
    && ["shot", "challenge", "pass"].includes(intent)
    && danger01 < 0.72
    && !teamCommand) {
    intent = "support";
    planState = scoringWindow && skill.discipline > 0.76 ? "rebound_wait" : "support_teammate";
    planMechanic = "drive_to_target";
    planReason = possessionReservation.reason;
    planConfidence = clamp(0.54 + skill.discipline * 0.18, 0.42, 0.88);
    target = scoringWindow && skill.discipline > 0.76
      ? reboundTargetForShot(state, car.team, predicted, shotOption.target, car)
      : supportTargetForRole(car, state, role, Math.max(1, rank), style, roleCfg, predicted, ownSign);
    precise = true;
    holdPlan = true;
    driveTargetSpeed = Math.min(driveTargetSpeed !== null && driveTargetSpeed !== undefined && Number.isFinite(Number(driveTargetSpeed)) ? Number(driveTargetSpeed) : 16, 12);
    car.aiTouchJump = false;
    car.aiTouchBoostScale = Math.min(car.aiTouchBoostScale || 1, 0.35);
    memory.yieldUntil = Math.max(memory.yieldUntil || 0, state.tick + Math.round((possessionReservation.strong ? 0.62 : 0.42) * 120));
    memory.yieldCarId = possessionReservation.mate?.id || null;
  }

  // Real players rotate for boost when they are not the immediate challenger.
  // V38: with the same starting boost as humans, bots now value pads more and
  // take nearby route pads during support/rotation, rather than waiting until
  // they are completely empty.
  const roleBoostFloor = role === "goalkeeper" ? 34 : role === "defence" ? 30 : role === "midfield" ? 24 : role === "balanced" ? 24 : 18;
  const lowBoost = car.boost < roleBoostFloor * style.boostDiscipline;
  const routeBoost = ["support", "rotate", "guard"].includes(intent)
    && car.boost < (skill.rotation > 0.9 ? 62 : 48)
    && !(boardTrust && board.danger > 0.54 && (teamSlot === "first_man" || teamSlot === "goalkeeper" || role === "goalkeeper"));
  const urgent = intent === "save" || (intent === "challenge" && danger01 > 0.62) || intent === "kickoff";
  const boostDetourBlocked = scoringWindow && (firstMan || secondMan) && car.boost > 8 && !teamCommand;
  if (teamCommand?.intent === "GET_BOOST" && !urgent && car.boost < 78) { intent = "boost"; }
  if (!boostDetourBlocked && (lowBoost || routeBoost || intent === "boost") && !urgent && !cfg.snooker && car.grounded && (role !== "goalkeeper" || danger01 < 0.28)) {
    const pad = nearestUsefulBoostPad(car, state, car.boost < 12 || (routeBoost && skill.rotation > 0.9), target, skill, role);
    const maxPadRange = state.arena.l * (routeBoost ? 0.34 : (skill.rotation > 0.9 ? 0.55 : 0.38));
    const padPullsOutOfShape = boardTrust && board.danger > 0.44 && (role === "goalkeeper" || role === "defence") && Math.sign(pad?.z || 0) === enemySign;
    if (pad && !padPullsOutOfShape && Math.hypot(car.x - pad.x, car.z - pad.z) < maxPadRange) {
      intent = "boost";
      planState = "collect_boost";
      planMechanic = "boost_route";
      planReason = routeBoost ? "route pad on rotation" : "low boost";
      planConfidence = clamp(0.42 + skill.padRouting * 0.20, 0.32, 0.78);
      target = { x: pad.x, z: pad.z };
      precise = false;
      holdPlan = false;
    }
  }

  if (teamCommand) {
    const side = teamCommand.intent === "PASS_LEFT" ? -1 : teamCommand.intent === "PASS_RIGHT" ? 1 : 0;
    if (teamCommand.intent === "ROTATE_BACK" || teamCommand.intent === "DEFEND_GOAL" || teamCommand.intent === "GOALKEEPER_HOLD") { intent = teamCommand.intent === "GOALKEEPER_HOLD" ? "guard" : "rotate"; planState = teamCommand.intent === "GOALKEEPER_HOLD" ? "guard_back_post" : "rotate_back"; planMechanic = "drive_to_target"; planReason = `team command ${teamCommand.intent}`; target = backPostTarget(state, car.team, ball, teamCommand.intent === "GOALKEEPER_HOLD" ? 1.8 : 7.5); precise = true; holdPlan = true; }
    else if (teamCommand.intent === "CLEAR_BALL") { intent = danger01 > 0.25 ? "save" : "challenge"; planState = "clear_ball"; planMechanic = "drive_intercept"; planReason = "team command CLEAR_BALL"; aim = wallSafeTouchAim(state, car.team, predicted, clearanceTarget(state, car.team, predicted), intent, danger01); target = approachTargetForTouch(state, car.team, predicted, aim, 6.2); precise = true; }
    else if (teamCommand.intent === "TAKE_SHOT" && (firstMan || role === "attack")) { intent = "shot"; planState = "shoot"; planMechanic = predicted.y > 5 ? "aerial_shot" : "drive_intercept"; planReason = "team command TAKE_SHOT"; aim = wallSafeTouchAim(state, car.team, predicted, goalTargetForShot(state, car.team, predicted, skill), intent, danger01); target = approachTargetForTouch(state, car.team, predicted, aim, 5.9); }
    else if (teamCommand.intent === "TEAM_PRESS" && role !== "goalkeeper") { intent = "challenge"; planState = "first_man_pressure"; planMechanic = "drive_intercept"; planReason = "team command TEAM_PRESS"; aim = wallSafeTouchAim(state, car.team, predicted, goalTargetForShot(state, car.team, predicted, skill), intent, danger01); target = approachTargetForTouch(state, car.team, predicted, aim, 7.0); }
    else if (side) { intent = "pass"; planState = "pass_option"; planMechanic = "controlled_touch"; planReason = `team command ${teamCommand.intent}`; aim = wallSafeTouchAim(state, car.team, predicted, { x: side * state.arena.w * 0.34, z: enemySign * state.arena.l * 0.20 }, intent, danger01); target = approachTargetForTouch(state, car.team, predicted, aim, 8.2); precise = true; }
    else if (teamCommand.intent === "SPREAD_OUT") { target.x = clamp(target.x + ((car.slotIndex % 2 ? 1 : -1) * state.arena.w * 0.16), -state.arena.w * 0.42, state.arena.w * 0.42); }
    planConfidence = Math.max(planConfidence, clamp(Number(teamCommand.confidence || 0.75), 0.30, 0.98));
  }
  const prePlanRouteRisk = routeRisk(car, state, target, {
    skill,
    intent,
    touchPoint: ["shot", "challenge", "pass", "save"].includes(intent) ? predicted : target
  });
  const recentBump = state.tick - Number(memory.lastBumpTick ?? -9999) < Math.round(0.38 * 120);
  const yieldActive = state.tick < Number(memory.yieldUntil || 0);
  const plannedTarget = car.aiPlan?.target || car.aiPlan;
  const targetDrift = plannedTarget ? Math.hypot((plannedTarget.x || 0) - target.x, (plannedTarget.z || 0) - target.z) : 0;
  const wallPlanPressure = wallPressure(car, state);
  const stalePlan = recentBump
    || yieldActive
    || (prePlanRouteRisk.blocked && !prePlanRouteRisk.reachesBallFirst)
    || (possessionReservation.active && ["shot", "challenge", "pass"].includes(car.aiPlan?.intent || intent))
    || (ballTouchChanged && ["shot", "challenge", "pass", "save"].includes(car.aiPlan?.intent || intent))
    || (targetDrift > (["shot", "challenge", "pass"].includes(car.aiPlan?.intent || intent) ? 8.5 : 14.0))
    || (wallPlanPressure.near && ["shot", "challenge", "boost"].includes(car.aiPlan?.intent || intent) && danger01 < 0.72);
  if (stalePlan) car.aiNextThinkTick = state.tick;
  const urgentPlan = intent === "save" || intent === "kickoff" || danger01 > 0.76;
  const planExpiresTick = Number(car.aiPlan?.expiresTick || car.aiNextThinkTick || 0);
  if (!urgentPlan && !stalePlan && car.aiPlan && state.tick < planExpiresTick) {
    intent = car.aiPlan.intent || intent;
    target = {
      x: Number(car.aiPlan.target?.x ?? car.aiPlan.x ?? target.x),
      y: Number(car.aiPlan.target?.y ?? car.aiPlan.y ?? target.y ?? 0),
      z: Number(car.aiPlan.target?.z ?? car.aiPlan.z ?? target.z)
    };
    precise = !!car.aiPlan.precise;
    planState = car.aiPlan.state || planState;
    planMechanic = car.aiPlan.mechanic || planMechanic;
    planReason = car.aiPlan.reason || planReason;
    planConfidence = clamp(Number(car.aiPlan.confidence ?? planConfidence), 0, 1);
  } else {
    const thinkTicks = Math.max(3, Math.round((skill.think + aiRoundRoll(car, state, 7) * skill.think * 0.55) * 120));
    const expiresTick = state.tick + (holdPlan ? Math.round(thinkTicks * 1.25) : thinkTicks);
    memory.currentPlanId = (memory.currentPlanId || 0) + 1;
    memory.lastPlanTick = state.tick;
    if (["shot", "challenge", "save", "kickoff", "pass"].includes(intent)) memory.committedUntil = Math.max(memory.committedUntil || 0, state.tick + Math.round((intent === "save" ? 0.42 : intent === "kickoff" ? 0.35 : 0.28) * 120));
    if (intent === "rotate") memory.rotatingOutUntil = Math.max(memory.rotatingOutUntil || 0, state.tick + Math.round(0.8 * 120));
    if (intent === "fake") memory.fakeChallengeUntil = Math.max(memory.fakeChallengeUntil || 0, state.tick + Math.round(0.55 * 120));
    car.aiPlan = makeAiPlan(intent, planState, target, expiresTick, {
      id: memory.currentPlanId,
      role,
      teamSlot: teamSlot || (firstMan ? "first_man" : secondMan ? "second_man" : thirdMan ? "third_man" : "support"),
      interceptTime: intercept.time,
      confidence: planConfidence,
      mechanic: planMechanic,
      precise,
      reason: planReason
    });
    car.aiNextThinkTick = expiresTick;
  }

  // Human-like errors: mostly Rookie, occasionally Pro. All-Star remains clean.
  const mistakeWave = Math.sin(state.tick * 0.013 + car.aiNoiseSeed * 4.1);
  const n = deterministicNoise(car, state, skill.error * (mistakeWave > 1 - skill.mistake * 2 ? 1.45 : 0.55));
  if (style.chaos) {
    n.x += Math.sin(state.tick * 0.035 + car.aiNoiseSeed) * 6.5;
    n.z += Math.cos(state.tick * 0.027 + car.aiNoiseSeed * 1.7) * 5.5;
  }
  const errorScale = intent === "save"
    ? 0.38
    : intent === "shot"
      ? (shotQuality > 0.58 ? 0.24 : 0.44)
      : 1;
  target.x += n.x * errorScale;
  target.z += n.z * errorScale;

  const closeWallTouchClamp = ["shot", "challenge", "pass", "save"].includes(intent)
    && Math.abs(predicted.x || ball.x || 0) > state.arena.w / 2 - 9.0
    && distToBall < 12.5;
  const targetWallMargin = closeWallTouchClamp ? 2.7 : 6.5;
  target.x = clamp(target.x, -state.arena.w / 2 + targetWallMargin, state.arena.w / 2 - targetWallMargin);
  target.z = clamp(target.z, -state.arena.l / 2 - state.arena.goalD + 5.5, state.arena.l / 2 + state.arena.goalD - 5.5);

  // Finalized AI behaviour plan after evaluating the existing controller:
  // 1) keep tactical role selection as the high-level brain,
  // 2) add a low-level recovery layer that can override stale plans,
  // 3) make reversing a deliberate persistent action instead of a one-frame
  //    side effect, and
  // 4) bias wall/corner recoveries toward the arena interior so bots stop
  //    grinding along walls when their route planner still wants the ball.
  let driveBoostScale = intent === "boost" ? 0.55 : intent === "save" ? 0.85 : intent === "kickoff" ? 1.35 : (car.aiTouchBoostScale || 1);
  const recovery = updateAiRecovery(car, state, target, intent, skill);
  if (recovery.active) {
    intent = recovery.reverse ? "reverse-recover" : "recover";
    target = recovery.escape || target;
    precise = false;
    driveBoostScale = 0;
  } else if (recovery.pressure.near && ["support", "rotate", "boost", "fake"].includes(intent) && skill.wallRead > 0.7) {
    const escape = escapeTargetFromWall(car, state, recovery.pressure);
    target.x = target.x * 0.72 + escape.x * 0.28;
    target.z = target.z * 0.72 + escape.z * 0.28;
  }
  const immediateRouteTouch = ["shot", "challenge", "pass", "save"].includes(intent)
    && distToBall < (intent === "save" ? 8.8 : 7.4)
    && contactQualityFor(car, state, ball, aim, skill, intent, danger01).score > (intent === "save" ? 0.35 : 0.48);
  const routeTouchPoint = ["shot", "challenge", "pass", "save"].includes(intent) ? ball : target;
  let finalRouteRisk = routeRisk(car, state, target, { skill, intent, touchPoint: routeTouchPoint });
  if (!recovery.active) {
    const avoidance = routeObstacleAvoidance(car, state, target, intent, skill, {
      immediateTouch: immediateRouteTouch,
      teamCommandActive: !!teamCommand,
      touchPoint: routeTouchPoint,
      routeRisk: finalRouteRisk
    });
    if (avoidance.active) {
      target = avoidance.target;
      avoidForceReverse = avoidance.forceReverse;
      precise = true;
      driveBoostScale = Math.min(driveBoostScale, 0.35);
      planReason = avoidance.reason || planReason;
      finalRouteRisk = routeRisk(car, state, target, { skill, intent, touchPoint: routeTouchPoint });
    }
  }

  if (intent === "recover" || intent === "reverse-recover") driveBoostScale = 0;
  const drive = makeDriveInput(car, target, state, skill, intent, {
    precise,
    boostScale: driveBoostScale,
    boostReserve: roleBoostReserve(role, intent, danger01, skill),
    targetSpeed: driveTargetSpeed,
    slowRadius: intent === "shot" && shotQuality > 0.60 ? 8 : 14,
    forceReverse: intent === "reverse-recover" || avoidForceReverse,
    allowReverse: intent !== "kickoff",
    brakeForRisk: finalRouteRisk.blocked && !finalRouteRisk.reachesBallFirst ? finalRouteRisk.risk : 0
  });

  if (intent === "kickoff") {
    drive.throttle = 1;
    const kickoffFast = difficulty !== "rookie" && aiRoundRoll(car, state, 1) < skill.kickoff;
    if (kickoffFast && car.boost > 2 && (car.grounded || state.mode === "flying") && drive.dist > 6 && Math.abs(drive.delta) < 0.72) drive.boost = true;
    if (kickoffFast && car.grounded && carSpeed2(car) > 9 && Math.abs(drive.delta) > 0.34 && Math.abs(drive.delta) < 1.35) drive.drift = true;
  }
  if (finalRouteRisk.blocked
    && (!finalRouteRisk.reachesBallFirst || finalRouteRisk.human || finalRouteRisk.teammate)
    && intent !== "recover"
    && intent !== "reverse-recover") {
    drive.boost = false;
    if (finalRouteRisk.brake && !avoidForceReverse) drive.throttle = Math.min(drive.throttle, finalRouteRisk.hardBlock ? -0.12 : 0.14);
    planReason = finalRouteRisk.reason || planReason;
  }

  const ballDist = distance2(car, ball);
  const ballAhead = (() => {
    const fwd = fwdFromYaw(car.yaw);
    const dx = ball.x - car.x;
    const dz = ball.z - car.z;
    const d = Math.hypot(dx, dz) || 1;
    return (dx * fwd.x + dz * fwd.z) / d;
  })();
  const shotAligned = ballAhead > (intent === "save" ? 0.35 : 0.55) && Math.abs(drive.delta) < (intent === "save" ? 0.65 : 0.42);
  const aerialIntent = ["shot", "challenge", "pass", "save"].includes(intent);
  const reachableHeight = state.mode === "flying"
    ? 16
    : clamp(4.8 + skill.aerial * 4.4 + (car.boost > 16 ? skill.aerial * 1.8 : 0), 5.1, difficulty === "allstar" ? 10.8 : difficulty === "pro" ? 8.8 : 6.4);
  const aerialHeight = Math.max(ball.y || 0, predicted.y || 0);
  const aerialDistLimit = difficulty === "allstar" ? 14.5 : difficulty === "pro" ? 11.2 : 8.2;
  const aerialCommitChance = clamp(skill.aerial * (intent === "save" ? skill.save : intent === "shot" ? skill.shot : 1) * (danger01 > 0.55 ? 1.12 : 1), 0, 1.25);
  const roleAerialAllowed = role === "attack" || role === "midfield" || role === "balanced" || intent === "save" || danger01 > 0.58;
  const aerialTeamConflict = boardTrust
    && intent !== "save"
    && board.firstManId
    && board.firstManId !== car.id
    && (board.etasById?.[board.firstManId] ?? Infinity) + 0.16 < ownEta
    && danger01 < 0.74;
  const aerialSlotAllowed = !boardTrust
    || firstMan
    || intent === "save"
    || (secondMan && board.opportunity > 0.52 && (intent === "shot" || intent === "pass"));
  const aerialPlanWindow = aerialIntent
    && aerialHeight > (difficulty === "rookie" ? 3.25 : 2.85)
    && aerialHeight < reachableHeight
    && ballDist < aerialDistLimit
    && shotAligned
    && (car.boost > (difficulty === "rookie" ? 18 : 7) || aerialHeight < 5.2)
    && roleAerialAllowed
    && aerialSlotAllowed
    && !aerialTeamConflict
    && (role !== "goalkeeper" || intent === "save" || danger01 > 0.58);
  let jump = false;
  if (car.aiTouchJump && (intent === "shot" || intent === "challenge" || intent === "pass")) jump = true;
  if (aerialPlanWindow && aiFrameRoll(car, state, 16) < aerialCommitChance * (difficulty === "rookie" ? 0.36 : difficulty === "pro" ? 0.74 : 0.98)) {
    car.aiAerialUntil = state.tick + Math.round((0.36 + skill.fastAerial * 0.34 + (intent === "save" ? 0.12 : 0)) * 120);
    if (car.grounded) jump = true;
  }
  if ((intent === "shot" || intent === "challenge" || intent === "pass" || intent === "save" || intent === "kickoff") && ballDist < (intent === "save" ? 9.5 : 7.4) && shotAligned) {
    if (ball.y > 2.35 && ball.y < reachableHeight && car.grounded && Math.random() < clamp(skill.jump * (intent === "save" ? skill.save : 1), 0, 1.15)) jump = true;
    if (intent === "kickoff" && ballDist < 7.2 && car.grounded && (skill.jump > 0.55 || (difficulty !== "rookie" && aiRoundRoll(car, state, 3) < 0.86))) jump = true;
  }
  const ticksSinceJump = state.tick - Number(car.jumpEventTick || 0);
  if (!car.grounded && !car.doubleJumpUsed && ticksSinceJump >= 0 && ticksSinceJump < (difficulty === "allstar" ? 7 : 10)) {
    jump = false;
  } else if (!car.grounded && !car.doubleJumpUsed && ballDist < (aerialPlanWindow ? 10.8 : 8.6) && ball.y > car.y + 0.65 && shotAligned && skill.aerial > 0.50 && aiFrameRoll(car, state, 17) < skill.aerial * (aerialPlanWindow ? 0.62 : 0.34)) {
    jump = true;
  }

  // Avoid boosting through badly angled recoveries; better bots feather boost when
  // they need to rotate instead of wasting it.
  if (!shouldBoostForPlan(car, intent, target, drive, role, skill, boardTrust ? board : null)) drive.boost = false;
  const directInterceptBoost = !drive.boost
    && (firstMan || intent === "save")
    && ["challenge", "shot", "save", "kickoff"].includes(intent)
    && drive.aligned
    && drive.dist > (intent === "save" ? 10 : 12)
    && car.boost > roleBoostReserve(role, intent, danger01, skill) + 5
    && Math.abs(drive.delta) < (intent === "save" ? 0.42 : 0.28)
    && aiFrameRoll(car, state, 22) < clamp(skill.boost * (difficulty === "allstar" ? 0.92 : difficulty === "pro" ? 0.68 : 0.34), 0, 1);
  if (directInterceptBoost && shouldBoostForPlan(car, intent, target, { ...drive, boost: true }, role, skill, boardTrust ? board : null)) drive.boost = true;
  if (drive.boost && !(drive.throttle >= 0 && car.boost > 0.1)) drive.boost = false;
  const aerialTarget = intent === "save" || intent === "shot" || intent === "challenge" || intent === "pass" ? predicted : ball;
  const airDx = aerialTarget.x - car.x;
  const airDz = aerialTarget.z - car.z;
  const desiredAirYaw = Math.atan2(airDx, airDz);
  const airYawDelta = angleNorm(desiredAirYaw - (car.yaw || 0));
  const aerialPlanActive = !car.grounded && state.tick < Number(car.aiAerialUntil || 0) && aerialIntent;
  const aerialBoost = aerialPlanActive
    && car.boost > 1.5
    && skill.aerialBoost > 0.08
    && Math.abs(airYawDelta) < 0.92 + skill.aerial * 0.16
    && (aerialTarget.y > car.y + 0.15 || ballDist > 5.2)
    && aiFrameRoll(car, state, 18) < clamp(skill.aerialBoost, 0, 1.1);
  if (aerialBoost) drive.boost = true;
  const recoveryRoll = !car.grounded
    && skill.recoveryAirRoll > 0.22
    && (Math.abs(car.roll || 0) > (difficulty === "rookie" ? 0.45 : 0.24) || (car.y < CAR_GROUND_Y + 3.2 && Math.abs(car.pitch || 0) > 0.34));
  const aerialAimRoll = aerialPlanActive && skill.aerial > 0.52 && Math.abs(airYawDelta) > (difficulty === "allstar" ? 0.24 : 0.34);
  const rollAllowed = aiFrameRoll(car, state, 19) < clamp(Math.max(skill.recoveryAirRoll, skill.aerialBoost), 0, 1.08);
  const aiAirRoll = !car.grounded && rollAllowed && (recoveryRoll || aerialAimRoll);
  const desiredRollSign = recoveryRoll && Math.abs(car.roll || 0) > 0.08 ? Math.sign(car.roll || 0) : Math.sign(airYawDelta || drive.steer || 0);
  if (!car.grounded) drive.drift = false;
  if (cfg.snooker) drive.boost = false;

  const aerialControlScale = aerialPlanActive ? clamp(skill.aerial * 1.12, 0, 1.2) : clamp(skill.aerial, 0, 1);
  if (car.aiPlan) {
    car.aiPlan.intent = intent;
    car.aiPlan.state = planState;
    car.aiPlan.mechanic = planMechanic;
    car.aiPlan.reason = planReason;
    car.aiPlan.confidence = planConfidence;
    car.aiPlan.teamSlot = teamSlot || car.aiPlan.teamSlot || (firstMan ? "first_man" : secondMan ? "second_man" : thirdMan ? "third_man" : "support");
  }
  setAiDebug(car, intent, target.x, target.z, planReason);
  return {
    throttle: drive.throttle,
    steer: drive.steer,
    boost: drive.boost,
    jump,
    drift: drive.drift,
    airRollLeft: aiAirRoll && desiredRollSign > 0,
    airRollRight: aiAirRoll && desiredRollSign < 0,
    airRollScale: clamp(0.75 + skill.recoveryAirRoll * 0.42, 0.65, 1.28),
    pitchUp: !car.grounded && aerialTarget.y > car.y + 0.35 ? aerialControlScale : 0,
    pitchDown: !car.grounded && aerialTarget.y < car.y - 0.25 ? clamp(aerialControlScale * 0.64, 0, 1) : 0,
    yawLeft: !car.grounded && airYawDelta > 0 ? clamp(Math.abs(airYawDelta) * aerialControlScale, 0, 1) : 0,
    yawRight: !car.grounded && airYawDelta < 0 ? clamp(Math.abs(airYawDelta) * aerialControlScale, 0, 1) : 0,
    cam: false,
    reset: false
  };
}

export class PhysicsHost {
  constructor(meta, players) {
    this.meta = serialiseMeta(meta);
    this.state = makeInitialState(this.meta, players);
    this.inputs = {};
    this.writeCounter = 0;
    this.resetLatch = false;
  }

  syncMeta(meta, players) {
    const next = serialiseMeta(meta);
    if (next.mode !== this.meta.mode || next.teamSize !== this.meta.teamSize || next.pitchSize !== this.meta.pitchSize || next.matchLength !== this.meta.matchLength) {
      this.meta = next;
      this.state = makeInitialState(this.meta, players);
      return;
    }
    this.meta = next;
    if (this.state) this.state.theme = next.theme;
  }

  setInputs(inputs) { this.inputs = inputs || {}; }

  step(dt, players = {}) {
    const cfg = MODE_CONFIGS[this.meta.mode] || MODE_CONFIGS.standard;
    const state = this.state;
    if (state.ended) return false;
    state.tick++;
    state.goalFlash = null;

    const resetRequested = Object.keys(players || {}).some(id => normaliseInput(this.inputs[id]).reset);
    if (state.break) {
      const humanIds = Object.keys(players || {});
      state.break.timer = Math.max(0, (state.break.timer || 0) - dt);
      state.break.skipVotes = humanIds.filter(id => normaliseInput(this.inputs[id]).reset).length;
      state.break.humans = humanIds.length || 1;
      if (state.break.timer <= 0 || (humanIds.length && state.break.skipVotes >= humanIds.length)) state.break = null;
    } else if (state.kickoffTimer > 0) {
      state.kickoffTimer = Math.max(0, state.kickoffTimer - dt);
    } else {
      const prev = state.timeLeft;
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      const halfPoint = (this.meta.matchLength || DEFAULT_META.matchLength) / 2;
      if (this.meta.halfTimeEnabled && !state.halfTimeTriggered && prev > halfPoint && state.timeLeft <= halfPoint) {
        state.halfTimeTriggered = true;
        state.break = { type: "half", timer: 60, duration: 60, skipVotes: 0, humans: Object.keys(players || {}).length || 1 };
      }
      if (state.timeLeft <= 0) {
        if (this.meta.overtimeEnabled && state.score.blue === state.score.orange && !state.overtime) {
          state.overtime = { timer: this.meta.overtimeDuration === "unlimited" ? -1 : this.meta.overtimeDuration };
          state.timeLeft = state.overtime.timer > 0 ? state.overtime.timer : 0;
        } else state.ended = true;
      }
    }

    if (!state.break && resetRequested && !this.resetLatch) resetKickoff(state, players, false);
    this.resetLatch = resetRequested;

    const humanIds = new Set(Object.keys(players));
    const cars = Object.values(state.cars);
    for (const car of cars) {
      car.human = humanIds.has(car.id);
      if (players[car.id]) {
        car.name = players[car.id].name || car.name;
        car.role = players[car.id].role || car.role;
        car.team = players[car.id].team || car.team;
        car.model = sanitiseVehicleModel(players[car.id].model || players[car.id].vehicle || car.model);
      }
      ensureAiMemory(car);
    }
    ensureAiBlackboards(state, this.meta);
    for (const car of cars) {
      const input = car.human ? normaliseInput(this.inputs[car.id]) : makeAIInput(car, state, this.meta, players);
      if ((car.demoTimer || 0) > 0) {
        car.demoTimer = Math.max(0, car.demoTimer - dt);
        if (car.demoTimer <= 0) respawnDemoCar(car, state);
        continue;
      }
      updateCar(car, (state.kickoffTimer > 0 || state.break) ? { throttle: 0, steer: 0, boost: false, jump: false, drift: false } : input, state, cfg, dt);
    }

    if (!state.break) {
      updateBoostPads(state, dt);
      resolveCarCar(state);
      updateBall(state, cfg, dt);
      resolveBallHits(state, cfg, dt, this.meta.mode);
      resolveGoals(state, players, this.meta);
    }
    this.writeCounter = (this.writeCounter + 1) % MATCH_TICKS_PER_WRITE;
    return this.writeCounter === 0;
  }
}

function normaliseInput(input = {}) {
  return {
    throttle: clamp(Number(input.throttle) || 0, -1, 1),
    steer: clamp(Number(input.steer) || 0, -1, 1),
    boost: !!input.boost,
    jump: !!input.jump,
    drift: !!input.drift,
    cam: !!input.cam,
    reset: !!input.reset,
    airRollLeft: !!input.airRollLeft,
    airRollRight: !!input.airRollRight,
    airRoll: !!input.airRoll,
    pitchUp: clamp(Number(input.pitchUp) || 0, 0, 1),
    pitchDown: clamp(Number(input.pitchDown) || 0, 0, 1),
    yawLeft: clamp(Number(input.yawLeft) || 0, 0, 1),
    yawRight: clamp(Number(input.yawRight) || 0, 0, 1),
    airRollScale: clamp(Number(input.airRollScale) || 1, 0.5, 1.7)
  };
}

function carAxes(car) {
  const yaw = car.yaw || 0;
  const pitch = car.pitch || 0;
  const roll = car.roll || 0;
  const sy = Math.sin(yaw), cy = Math.cos(yaw);
  const sp = Math.sin(pitch), cp = Math.cos(pitch);
  const sr = Math.sin(roll), cr = Math.cos(roll);
  const fwd = { x: sy * cp, y: -sp, z: cy * cp };
  const right = { x: cy * cr + sy * sp * sr, y: cp * sr, z: -sy * cr + cy * sp * sr };
  const up = { x: -cy * sr + sy * sp * cr, y: cp * cr, z: sy * sr + cy * sp * cr };
  return { fwd, right, up };
}

function aerialAxisInput(input, steer, throttle) {
  const pitchButtons = (input.pitchUp || 0) - (input.pitchDown || 0);
  const yawButtons = (input.yawLeft || 0) - (input.yawRight || 0);
  const pitchInput = clamp(Math.abs(pitchButtons) > 0.001 ? pitchButtons : throttle, -1, 1);
  const yawInput = clamp(Math.abs(yawButtons) > 0.001 ? yawButtons : steer, -1, 1);
  // Directional air roll is a dedicated roll torque, while free air roll rolls
  // from the steering axis only while the drift/air-roll modifier is held.
  // Keeping them separate fixes AIR L/R feeling like weak drift aliases.
  const directionalRoll = (input.airRollLeft ? 1 : 0) - (input.airRollRight ? 1 : 0);
  const freeRoll = input.airRoll ? steer : 0;
  const rollInput = clamp((directionalRoll + freeRoll) * (input.airRollScale || 1), -1.85, 1.85);
  return { pitchInput, yawInput, rollInput, directionalRoll, freeRoll };
}

function updateCar(car, input, state, cfg, dt) {
  const arena = state.arena;
  const fwd = fwdFromYaw(car.yaw);
  const right = rightFromYaw(car.yaw);
  const forwardSpeed = dot2(car.vx, car.vz, fwd.x, fwd.z);
  const sideSpeed = dot2(car.vx, car.vz, right.x, right.z);
  const speed = Math.hypot(car.vx, car.vz);
  const wasOnGround = car.grounded;
  const throttle = clamp(input.throttle || 0, -1, 1);
  const steer = clamp(input.steer || 0, -1, 1);
  const handbrake = !!input.drift;
  const wantsBoost = !!input.boost && car.boost > 0.1;
  const jump = !!input.jump;
  const vehicle = VEHICLE_CONFIGS[car.model] || VEHICLE_CONFIGS.default;

  car.boosting = false;
  car.drifting = false;
  car.boostHeld = input.boost ? (car.boostHeld || 0) + dt : 0;

  if (car.grounded) {
    let driveAcc = 0;
    // Standard mode keeps the exact V10 baseline constants; vehicle models only
    // apply tiny multipliers so the selected body has personality without changing
    // the core game balance.
    const maxForward = (wantsBoost ? 55 : 39.5) * (state.mode === "ice" ? 1.05 : 1) * vehicle.maxSpeed;
    const maxReverse = 16.5 * cfg.reverse * vehicle.maxSpeed;
    const accel = 68 * cfg.drive * vehicle.drive;
    const brake = 112 * cfg.brake * vehicle.brake;
    const reverseAccel = 33 * cfg.reverse * vehicle.reverse;

    if (throttle > 0) {
      if (forwardSpeed < maxForward) driveAcc = accel * throttle;
    } else if (throttle < 0) {
      if (forwardSpeed > 3.0) driveAcc = -brake;
      else if (forwardSpeed > -maxReverse) driveAcc = reverseAccel * throttle;
    }
    car.vx += fwd.x * driveAcc * dt;
    car.vz += fwd.z * driveAcc * dt;

    if (wantsBoost) {
      car.boosting = true;
      car.boost = Math.max(0, car.boost - (state.mode === "flying" ? BOOST_DRAIN_FLYING : BOOST_DRAIN_GROUND) * dt);
      car.vx += fwd.x * 72 * cfg.drive * vehicle.boost * dt;
      car.vz += fwd.z * 72 * cfg.drive * vehicle.boost * dt;
    }

    // V25: powerslide engages at lower speed and has no post-release lockout,
    // so you can chain short drifts without waiting for a cooldown.
    const driftActive = handbrake && speed > 3.4;
    car.drifting = driftActive;
    const normalGrip = 24.0 * cfg.grip * vehicle.grip;
    const driftGrip = 1.30 * cfg.driftGrip * vehicle.driftGrip;
    const grip = driftActive ? driftGrip : normalGrip;
    car.vx += right.x * (-sideSpeed * grip * dt);
    car.vz += right.z * (-sideSpeed * grip * dt);

    if (driftActive && Math.abs(steer) > 0.05) {
      const slideAssist = -steer * Math.sign(forwardSpeed || 1) * clamp(speed / 32, 0, 1) * 10.6;
      car.vx += right.x * slideAssist * dt;
      car.vz += right.z * slideAssist * dt;
    }

    const coastDrag = state.mode === "ice" ? 0.997 : 0.982;
    if (Math.abs(throttle) < 0.05 && Math.abs(forwardSpeed) < 4 && !driftActive) {
      car.vx += fwd.x * (-forwardSpeed * 5.5 * cfg.brake * dt);
      car.vz += fwd.z * (-forwardSpeed * 5.5 * cfg.brake * dt);
    } else if (Math.abs(throttle) < 0.05) {
      const d = Math.pow(coastDrag, dt * 120);
      car.vx *= d; car.vz *= d;
    }

    const sign = forwardSpeed >= -1 ? 1 : -1;
    const speedFactor = clamp(speed / 24, 0.45, 1);
    const baseTurn = (driftActive ? 6.75 * cfg.driftTurn * vehicle.driftTurn : 3.28) * cfg.steer * vehicle.steer * speedFactor;
    const targetYawVel = steer * sign * baseTurn;
    const yawSharpness = driftActive ? (state.mode === "ice" ? 3.1 : 5.85) : 11.6;
    car.yawVel = smooth(car.yawVel, targetYawVel, yawSharpness, dt);
    car.yaw += car.yawVel * dt;
    if (!driftActive) car.yawVel *= Math.pow(0.78, dt * 120);

    const newSpeed = Math.hypot(car.vx, car.vz);
    const maxSpeed = (wantsBoost ? 58 : (forwardSpeed < -1 ? 18.5 * cfg.reverse : 40.5 * (state.mode === "ice" ? 1.04 : 1))) * vehicle.maxSpeed;
    if (newSpeed > maxSpeed) {
      const s = maxSpeed / newSpeed;
      car.vx *= s; car.vz *= s;
    }

    if (jump && !car.jumpLatch && car.jumpCooldown <= 0) {
      car.grounded = false;
      car.onGround = false;
      car.doubleJumpUsed = false;
      car.vy = (state.mode === "ice" ? 17.6 : 18.9) * cfg.jump * vehicle.jump;
      car.jumpCooldown = 0.20;
      car.justJumped = true;
      car.jumpEventTick = state.tick;
    }
  } else {
    const axes = carAxes(car);
    const { fwd: airFwd, right: airRight, up: airUp } = axes;
    const { pitchInput, yawInput, rollInput, directionalRoll, freeRoll } = aerialAxisInput(input, steer, throttle);
    if (jump && !car.jumpLatch && car.jumpCooldown <= 0 && !car.doubleJumpUsed) {
      car.doubleJumpUsed = true;
      car.justJumped = true;
      const directional = Math.hypot(pitchInput, yawInput) > 0.20;
      car.vy = Math.max(car.vy + 4.2 * cfg.jump * vehicle.jump, DOUBLE_JUMP_VELOCITY * cfg.jump * vehicle.jump);
      car.vx += (directional ? airFwd.x * pitchInput + airRight.x * yawInput : airFwd.x) * DOUBLE_JUMP_FORWARD_KICK * vehicle.aerial;
      car.vz += (directional ? airFwd.z * pitchInput + airRight.z * yawInput : airFwd.z) * DOUBLE_JUMP_FORWARD_KICK * vehicle.aerial;
      car.pitchVel += directional ? -pitchInput * 5.8 : -2.0;
      car.rollVel += yawInput * 3.6;
      car.jumpCooldown = 0.28;
      car.jumpEventTick = state.tick;
      car.doubleJumpEventTick = state.tick;
    }

    const aerialTune = vehicle.aerial * cfg.aerialDrive;
    const directionalAirRoll = Math.abs(directionalRoll) > 0.001;
    const freeAirRoll = Math.abs(freeRoll) > 0.001;
    const airRollHeld = directionalAirRoll || freeAirRoll;
    car.pitchVel = (car.pitchVel || 0) + (-pitchInput * (directionalAirRoll ? 4.55 : 5.2) * aerialTune) * dt;
    car.yawVel = (car.yawVel || 0) + (yawInput * (directionalAirRoll ? 3.75 : 4.2) * aerialTune) * dt;
    car.rollVel = (car.rollVel || 0) + (rollInput * (directionalAirRoll ? 10.9 : 8.4) * aerialTune) * dt;
    if (directionalAirRoll && Math.abs(yawInput) > 0.05) {
      car.pitchVel += -directionalRoll * yawInput * 1.35 * aerialTune * dt;
      car.yawVel += directionalRoll * pitchInput * 0.82 * aerialTune * dt;
    }
    if (!airRollHeld && Math.abs(car.roll || 0) > 0.05) {
      car.rollVel += -Math.sin(car.roll || 0) * 4.3 * aerialTune * dt;
    }
    car.pitchVel *= Math.pow(0.975, dt * 120);
    car.yawVel *= Math.pow(directionalAirRoll ? 0.988 : 0.982, dt * 120);
    car.rollVel *= Math.pow(airRollHeld ? 0.992 : 0.970, dt * 120);
    car.pitch = clamp((car.pitch || 0) + car.pitchVel * dt, -1.35, 1.35);
    car.yaw += car.yawVel * dt;
    car.roll = angleNorm((car.roll || 0) + car.rollVel * dt);

    if (wantsBoost) {
      car.boosting = true;
      car.boost = Math.max(0, car.boost - (state.mode === "flying" ? BOOST_DRAIN_FLYING : BOOST_DRAIN_AIR) * dt);
      const boostPower = 62 * cfg.drive * vehicle.boost;
      car.vx += airFwd.x * boostPower * dt;
      car.vy += airFwd.y * boostPower * dt;
      car.vz += airFwd.z * boostPower * dt;
    }
    const feather = 8.5 * cfg.drive * aerialTune;
    car.vx += (airFwd.x * Math.abs(throttle) * Math.sign(throttle) + airRight.x * steer * 0.45) * feather * dt;
    car.vy += (airFwd.y * throttle + airUp.y * 0.08) * feather * dt;
    car.vz += (airFwd.z * throttle + airRight.z * steer * 0.45) * feather * dt;
    const airDrag = Math.pow(0.995, dt * 120);
    car.vx *= airDrag; car.vz *= airDrag; car.vy *= Math.pow(0.998, dt * 120);
    car.vy -= GRAVITY * cfg.gravity * dt;
  }
  car.jumpLatch = !!jump;
  car.jumpCooldown = Math.max(0, (car.jumpCooldown || 0) - dt);
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  car.z += car.vz * dt;

  if (car.y <= CAR_GROUND_Y) {
    const landingVy = car.vy || 0;
    car.y = CAR_GROUND_Y;
    car.vy = landingVy < -18 && Math.abs(car.roll || 0) > 1.15 ? Math.min(6, -landingVy * 0.18) : 0;
    car.grounded = car.vy <= 0.05;
    car.onGround = car.grounded;
    car.doubleJumpUsed = false;
    car.justJumped = false;
    if (car.grounded) {
      const uprightAssist = !input.airRollLeft && !input.airRollRight && !input.airRoll;
      const rollToZero = angleNorm(car.roll || 0);
      if (uprightAssist && Math.abs(rollToZero) < 1.25) car.roll = smooth(rollToZero, 0, 8, dt);
      car.pitch = smooth(car.pitch || 0, 0, 10, dt);
      car.pitchVel = 0; car.rollVel = (car.rollVel || 0) * 0.35;
    }
  } else {
    car.grounded = false;
    car.onGround = false;
  }

  const wallBounce = state.mode === "ice" ? -0.16 : -0.08;
  const limX = arena.w / 2 - CAR_RADIUS;
  if (Math.abs(car.x) > limX) {
    const impact = Math.abs(car.vx || 0);
    const normalX = -Math.sign(car.x || 1);
    car.x = Math.sign(car.x) * limX;
    car.vx *= wallBounce;
    noteAiWallContact(car, state, normalX, 0, impact);
  }
  const inGoalMouth = Math.abs(car.x) < arena.goalW / 2 - CAR_RADIUS * 0.5;
  const limZ = inGoalMouth ? arena.l / 2 + arena.goalD - CAR_RADIUS : arena.l / 2 - CAR_RADIUS;
  if (Math.abs(car.z) > limZ) {
    const impact = Math.abs(car.vz || 0);
    const normalZ = -Math.sign(car.z || 1);
    car.z = Math.sign(car.z) * limZ;
    car.vz *= wallBounce;
    noteAiWallContact(car, state, 0, normalZ, impact);
  }

  const visualSpeed = Math.hypot(car.vx, car.vz);
  if (car.grounded) {
    const driftLean = car.drifting ? 0.12 * Math.sign(steer || car.yawVel || 1) : 0;
    car.roll = smooth(car.roll || 0, -steer * clamp(visualSpeed / 42, 0, 1) * 0.16 + driftLean, 10, dt);
    car.pitch = smooth(car.pitch || 0, -clamp(forwardSpeed / 55, -1, 1) * 0.08, 7, dt);
  }

  car.boostPickup = Math.max(0, (car.boostPickup || 0) - dt);
  car.cueCooldown = Math.max(0, (car.cueCooldown || 0) - dt);
  car.bumpCooldown = Math.max(0, (car.bumpCooldown || 0) - dt);
}

function updateBoostPads(state, dt) {
  if (!Array.isArray(state.boostPads)) state.boostPads = makeBoostPads(state.arena, state.mode);
  for (const pad of state.boostPads) {
    pad.big = !!pad.big || (pad.amount || 0) >= 100;
    const defaultRadius = pad.big ? BOOST_PAD_RADIUS_BIG : BOOST_PAD_RADIUS_SMALL;
    pad.radius = Math.min(Number(pad.radius) || defaultRadius, defaultRadius);
    pad.amount = pad.amount || (pad.big ? 100 : 36);
    pad.respawn = pad.respawn || (pad.big ? 10 : 5);
    if (!pad.active) {
      pad.timer = Math.max(0, (Number(pad.timer) || 0) - dt);
      if (pad.timer <= 0) pad.active = true;
      continue;
    }
    for (const car of Object.values(state.cars || {})) {
      if (Math.abs(car.y - CAR_GROUND_Y) > 2.4) continue;
      const d = Math.hypot(car.x - pad.x, car.z - pad.z);
      if (d < pad.radius) {
        const before = car.boost || 0;
        car.boost = pad.amount >= 100 ? BOOST_MAX : Math.min(BOOST_MAX, before + pad.amount);
        if (car.boost > before) {
          car.boostPickup = 0.16;
          if (!state.sound) state.sound = {};
          state.sound.boostPadTick = state.tick;
          state.sound.boostPadBig = !!pad.big;
          state.sound.boostPadCar = car.id;
          pad.active = false;
          pad.timer = pad.respawn;
        }
        break;
      }
    }
  }
}

function respawnDemoCar(car, state) {
  const idx = Number(car.slotIndex || 0);
  const spawn = kickoffSpawn(car.team, idx % Math.max(1, state.teamSize || 1), state.teamSize || 1, state.arena, car.role, car.human, state.kickoffVariant);
  car.x = spawn.x; car.y = CAR_GROUND_Y; car.z = spawn.z;
  car.vx = 0; car.vy = 0; car.vz = 0;
  car.yaw = spawn.yaw; car.yawVel = 0; car.pitch = 0; car.roll = 0; car.pitchVel = 0; car.rollVel = 0;
  car.grounded = true; car.onGround = true; car.demoed = false; car.demoTimer = 0; car.boosting = false;
  car.aiMemory = makeAiMemory();
  car.aiPlan = makeAiPlan("support", "respawn", { x: car.x, z: car.z }, state.tick + 1, { role: car.role, reason: "respawn" });
  car.aiNextThinkTick = 0;
  car.aiAerialUntil = 0;
  car.aiRecoveryUntil = 0;
}

function maybeDemo(attacker, victim, nx, nz, closing, state) {
  if (!attacker.boosting || (attacker.boostHeld || 0) < 3.2 || (victim.demoTimer || 0) > 0) return false;
  const speed = horizontalSpeed(attacker);
  const fwd = fwdFromYaw(attacker.yaw || 0);
  const angle = Math.abs(fwd.x * -nx + fwd.z * -nz);
  if (speed < 34 || closing < 18 || angle < 0.42) return false;
  victim.demoed = true; victim.demoTimer = 5;
  victim.vx = 0; victim.vy = 0; victim.vz = 0; victim.boosting = false;
  state.demoSerial = (state.demoSerial || 0) + 1;
  if (!state.sound) state.sound = {};
  state.sound.demoTick = state.tick; state.sound.demoCar = victim.id; state.sound.demoBy = attacker.id;
  return true;
}

function resolveCarCar(state) {
  const cars = Object.values(state.cars).filter(c => !(c.demoTimer > 0));
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i], b = cars[j];
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      const dist = Math.hypot(dx, dz);
      const minDist = CAR_RADIUS * 1.55;
      if (dist <= 0.0001 || dist >= minDist) continue;
      const nx = dx / dist, nz = dz / dist;
      const push = (minDist - dist) * 0.5;
      a.x += nx * push; a.z += nz * push;
      b.x -= nx * push; b.z -= nz * push;
      const relX = a.vx - b.vx;
      const relZ = a.vz - b.vz;
      const closing = -(relX * nx + relZ * nz);
      if (closing > 0) {
        if (maybeDemo(b, a, nx, nz, closing, state) || maybeDemo(a, b, -nx, -nz, closing, state)) continue;
        const impulse = closing * 0.42;
        const massA = (VEHICLE_CONFIGS[a.model] || VEHICLE_CONFIGS.default).mass;
        const massB = (VEHICLE_CONFIGS[b.model] || VEHICLE_CONFIGS.default).mass;
        a.vx += nx * impulse / massA; a.vz += nz * impulse / massA;
        b.vx -= nx * impulse / massB; b.vz -= nz * impulse / massB;
        a.bumpCooldown = b.bumpCooldown = 0.1;
        noteAiBump(a, b, state, nx, nz, closing);
        noteAiBump(b, a, state, -nx, -nz, closing);
        if (!state.sound) state.sound = {};
        state.sound.carBumpTick = state.tick;
        state.sound.carBumpImpulse = impulse;
      }
    }
  }
}

function updateBall(state, cfg, dt) {
  const b = state.ball;
  const arena = state.arena;
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const ballRestitution = Math.min(0.90, BALL_RESTITUTION * cfg.ballRestitution);
  const wallRestitution = Math.min(0.94, WALL_RESTITUTION * cfg.wallRestitution);

  b.vy -= BALL_GRAVITY * cfg.ballGravity * dt;
  // The HTML-only version damped vertical arcs a little more than the
  // multiplayer rebuild. Restoring that damping makes the ball feel heavier.
  b.vy *= Math.pow(BALL_VERTICAL_DAMPING, dt * 120);
  const air = Math.pow(BALL_AIR_DAMPING, dt * 120);
  b.vx *= air; b.vy *= air; b.vz *= air;
  const speed = Math.hypot(b.vx, b.vy, b.vz);
  if (speed > maxBallSpeed) {
    const s = maxBallSpeed / speed;
    b.vx *= s; b.vy *= s; b.vz *= s;
  }

  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.z += b.vz * dt;

  if (b.y < BALL_RADIUS) {
    b.y = BALL_RADIUS;
    const impactY = Math.abs(b.vy);
    if (b.vy < -BALL_GROUND_SETTLE_SPEED) {
      b.vy *= -ballRestitution;
      if (impactY > 3.2) {
        if (!state.sound) state.sound = {};
        state.sound.bounceTick = state.tick;
        state.sound.bounceSpeed = impactY;
      }
    } else b.vy = 0;
    const groundFriction = 1 - (1 - BALL_GROUND_FRICTION) * cfg.ballFriction;
    const d = Math.pow(groundFriction, dt * 120);
    b.vx *= d; b.vz *= d;
  }

  const ceilingH = arena.ceilingH || (state.mode === "flying" ? CEILING_H_FLYING : CEILING_H_STANDARD);
  if (b.y > ceilingH - BALL_RADIUS) {
    b.y = ceilingH - BALL_RADIUS;
    const hitSpeed = Math.abs(b.vy);
    if (b.vy > 0) b.vy *= -CEILING_RESTITUTION;
    if (hitSpeed > 4) {
      if (!state.sound) state.sound = {};
      state.sound.wallHitTick = state.tick;
      state.sound.wallHitSpeed = hitSpeed;
    }
  }

  const sideLim = arena.w / 2 - BALL_RADIUS;
  if (Math.abs(b.x) > sideLim) {
    const hitSpeed = Math.abs(b.vx);
    b.x = Math.sign(b.x) * sideLim;
    b.vx *= -wallRestitution;
    b.vz *= WALL_TANGENT_DAMPING;
    if (hitSpeed > 3.5) {
      if (!state.sound) state.sound = {};
      state.sound.wallHitTick = state.tick;
      state.sound.wallHitSpeed = hitSpeed;
    }
  }

  const mouthX = Math.abs(b.x) < arena.goalW / 2 - BALL_RADIUS * 0.45;
  const mouthY = b.y < arena.goalH - BALL_RADIUS * 0.35;
  const goalOpen = mouthX && mouthY;
  const zLim = goalOpen ? arena.l / 2 + arena.goalD - BALL_RADIUS : arena.l / 2 - BALL_RADIUS;
  if (Math.abs(b.z) > zLim) {
    const hitSpeed = Math.abs(b.vz);
    b.z = Math.sign(b.z) * zLim;
    b.vz *= -wallRestitution;
    b.vx *= WALL_TANGENT_DAMPING;
    if (hitSpeed > 3.5) {
      if (!state.sound) state.sound = {};
      state.sound.wallHitTick = state.tick;
      state.sound.wallHitSpeed = hitSpeed;
    }
  }

  // Goal side and roof collisions inside the goal volume.
  if (Math.abs(b.z) > arena.l / 2 - BALL_RADIUS && Math.abs(b.z) < arena.l / 2 + arena.goalD) {
    const netXLim = arena.goalW / 2 - BALL_RADIUS;
    if (Math.abs(b.x) > netXLim) {
      const hitSpeed = Math.abs(b.vx);
      b.x = Math.sign(b.x) * netXLim;
      b.vx *= -0.72;
      if (hitSpeed > 3.5) {
        if (!state.sound) state.sound = {};
        state.sound.wallHitTick = state.tick;
        state.sound.wallHitSpeed = hitSpeed;
      }
    }
    if (b.y > arena.goalH - BALL_RADIUS) {
      const hitSpeed = Math.abs(b.vy);
      b.y = arena.goalH - BALL_RADIUS;
      if (b.vy > 0) b.vy *= -CEILING_RESTITUTION;
      if (hitSpeed > 3.5) {
        if (!state.sound) state.sound = {};
        state.sound.wallHitTick = state.tick;
        state.sound.wallHitSpeed = hitSpeed;
      }
    }
  }

  b.rx += b.vz * dt / BALL_RADIUS;
  b.rz -= b.vx * dt / BALL_RADIUS;
}

function resolveBallHits(state, cfg, dt, mode) {
  const b = state.ball;
  for (const car of Object.values(state.cars)) {
    if ((car.demoTimer || 0) > 0) continue;
    if (cfg.snooker || mode === "snooker") {
      resolveCueHit(car, b, state, cfg);
      continue;
    }
    resolveCarBallOBB(car, b, state, cfg);
  }
}

function resolveCueHit(car, b, state, cfg) {
  const fwd = fwdFromYaw(car.yaw);
  const right = rightFromYaw(car.yaw);
  const cueLength = cfg.cueLength || 5.2;
  const cueRadius = cfg.cueRadius || 0.55;
  const cueY = clamp(b.y, car.y + 0.20, car.y + 1.15);
  const startX = car.x + fwd.x * (CAR_HALF_Z * 1.22);
  const startY = cueY;
  const startZ = car.z + fwd.z * (CAR_HALF_Z * 1.22);
  const endX = startX + fwd.x * cueLength;
  const endY = startY;
  const endZ = startZ + fwd.z * cueLength;
  const segX = endX - startX;
  const segY = endY - startY;
  const segZ = endZ - startZ;
  const segLenSq = segX * segX + segY * segY + segZ * segZ;
  if (segLenSq <= 0.001) return;
  const toX = b.x - startX;
  const toY = b.y - startY;
  const toZ = b.z - startZ;
  const t = clamp((toX * segX + toY * segY + toZ * segZ) / segLenSq, 0, 1);
  const closestX = startX + segX * t;
  const closestY = startY + segY * t;
  const closestZ = startZ + segZ * t;
  let dx = b.x - closestX;
  let dy = b.y - closestY;
  let dz = b.z - closestZ;
  let dist = Math.hypot(dx, dy, dz);
  const hitRadius = BALL_RADIUS + cueRadius;
  if (dist >= hitRadius) return;
  let nx, ny, nz;
  if (dist > 0.0001) { nx = dx / dist; ny = dy / dist; nz = dz / dist; }
  else { nx = fwd.x; ny = 0; nz = fwd.z; dist = 0; }
  const frontness = fwd.x * nx + fwd.z * nz;
  const speed = horizontalSpeed(car);
  b.x += nx * (hitRadius - dist + 0.012);
  b.y += ny * (hitRadius - dist + 0.012);
  b.z += nz * (hitRadius - dist + 0.012);

  let cueVx = car.vx + fwd.x * (car.boosting ? 5.0 : 1.2) + right.x * car.yawVel * cueLength * clamp(t, 0.25, 1);
  let cueVy = car.vy;
  let cueVz = car.vz + fwd.z * (car.boosting ? 5.0 : 1.2) + right.z * car.yawVel * cueLength * clamp(t, 0.25, 1);
  const relX = b.vx - cueVx, relY = b.vy - cueVy, relZ = b.vz - cueVz;
  const closing = -(relX * nx + relY * ny + relZ * nz);
  const cueSweetSpot = clamp(t, 0.35, 1.0);
  const lineUpBonus = clamp(frontness, -0.2, 1) * 5.8;
  const impulse = (Math.max(0, closing * 1.25) + 2.6 + speed * 0.24 + lineUpBonus) * cueSweetSpot * BALL_HEAVY_IMPULSE_SCALE;
  b.vx += nx * impulse + fwd.x * clamp(frontness, 0, 1) * (1.78 + speed * 0.030);
  b.vy += ny * impulse * BALL_HEAVY_LIFT_SCALE + clamp((1 - Math.abs(ny)) * 0.42, 0.12, 0.78);
  b.vz += nz * impulse + fwd.z * clamp(frontness, 0, 1) * (1.78 + speed * 0.030);
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const bs = Math.hypot(b.vx, b.vy, b.vz);
  if (bs > maxBallSpeed) { const s = maxBallSpeed / bs; b.vx *= s; b.vy *= s; b.vz *= s; }
  car.vx -= nx * Math.min(4.5, impulse * 0.045);
  car.vz -= nz * Math.min(4.5, impulse * 0.045);
  car.cueCooldown = 0.22;
  car.lastTouch = state.tick;
  b.lastTouchTick = state.tick;
  b.lastTouchCar = car.id;
  b.lastTouchImpulse = impulse;
  if (!state.sound) state.sound = {};
  state.sound.ballHitTick = state.tick;
  state.sound.ballHitImpulse = impulse;
}

function resolveCarBallOBB(car, b, state, cfg) {
  const vehicle = VEHICLE_CONFIGS[car.model] || VEHICLE_CONFIGS.default;
  const fwd = fwdFromYaw(car.yaw);
  const right = rightFromYaw(car.yaw);
  const relX = b.x - car.x;
  const relY = b.y - car.y;
  const relZ = b.z - car.z;
  const lx = relX * right.x + relZ * right.z;
  const ly = relY;
  const lz = relX * fwd.x + relZ * fwd.z;
  const cx = clamp(lx, -CAR_HALF_X, CAR_HALF_X);
  const cy = clamp(ly, -CAR_HALF_Y, CAR_HALF_Y * 1.15);
  const cz = clamp(lz, -CAR_HALF_Z, CAR_HALF_Z);
  const closestX = car.x + right.x * cx + fwd.x * cz;
  const closestY = car.y + cy;
  const closestZ = car.z + right.z * cx + fwd.z * cz;
  let dx = b.x - closestX;
  let dy = b.y - closestY;
  let dz = b.z - closestZ;
  let dist = Math.hypot(dx, dy, dz);
  if (dist >= BALL_RADIUS) return;
  let nx, ny, nz;
  if (dist > 0.0001) {
    nx = dx / dist; ny = dy / dist; nz = dz / dist;
  } else {
    const ex = CAR_HALF_X - Math.abs(lx);
    const ey = CAR_HALF_Y * 1.15 - Math.abs(ly);
    const ez = CAR_HALF_Z - Math.abs(lz);
    if (ex < ey && ex < ez) { nx = right.x * Math.sign(lx || 1); ny = 0; nz = right.z * Math.sign(lx || 1); }
    else if (ez < ey) { nx = fwd.x * Math.sign(lz || 1); ny = 0; nz = fwd.z * Math.sign(lz || 1); }
    else { nx = 0; ny = Math.sign(ly || 1); nz = 0; }
    dist = 0;
  }

  b.x += nx * (BALL_RADIUS - dist + 0.015);
  b.y += ny * (BALL_RADIUS - dist + 0.015);
  b.z += nz * (BALL_RADIUS - dist + 0.015);
  let contactVx = car.vx, contactVy = car.vy, contactVz = car.vz;
  if (car.boosting) { contactVx += fwd.x * 6.0; contactVz += fwd.z * 6.0; }
  const relativeX = b.vx - contactVx;
  const relativeY = b.vy - contactVy;
  const relativeZ = b.vz - contactVz;
  const closing = -(relativeX * nx + relativeY * ny + relativeZ * nz);
  const speed = horizontalSpeed(car);
  const frontness = clamp(fwd.x * nx + fwd.z * nz, -0.2, 1);
  const hitScale = car.boosting ? BALL_BOOST_HIT_SCALE : BALL_NON_BOOST_HIT_SCALE;
  const speedHitScale = car.boosting ? 1 : 0.74;
  const frontBonus = frontness * (car.boosting ? 6.0 : 5.2);
  const jumpBonus = car.justJumped ? 6.8 : 0;
  const impulse = (Math.max(0, closing * 1.12) + 3.7 + speed * 0.36 * speedHitScale + frontBonus + jumpBonus) * vehicle.hit * BALL_HEAVY_IMPULSE_SCALE * hitScale;
  b.vx += nx * impulse;
  b.vy += ny * impulse * BALL_HEAVY_LIFT_SCALE;
  b.vz += nz * impulse;
  if (ny < 0.25) b.vy += clamp((speed * 0.070 * speedHitScale + (car.justJumped ? 3.7 : 1.2)) * BALL_HEAVY_LIFT_SCALE, 0.72, 4.8);
  if (car.boosting) { b.vx += fwd.x * 4.8; b.vz += fwd.z * 4.8; }
  const groundedTouch = b.y < BALL_RADIUS + 0.75 && car.grounded && ny < 0.35;
  if (groundedTouch) b.vy = Math.min(b.vy, car.justJumped ? BALL_JUMP_TOUCH_LIFT_CAP : BALL_GROUNDED_TOUCH_LIFT_CAP);
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const bs = Math.hypot(b.vx, b.vy, b.vz);
  if (bs > maxBallSpeed) { const s = maxBallSpeed / bs; b.vx *= s; b.vy *= s; b.vz *= s; }
  const recoil = Math.min(7.4, impulse * 0.095) / vehicle.mass;
  car.vx -= nx * recoil;
  car.vy -= ny * recoil;
  car.vz -= nz * recoil;
  car.lastTouch = state.tick;
  b.lastTouchTick = state.tick;
  b.lastTouchCar = car.id;
  b.lastTouchImpulse = impulse;
  if (!state.sound) state.sound = {};
  state.sound.ballHitTick = state.tick;
  state.sound.ballHitImpulse = impulse;
}

function resolveGoals(state, players, meta = DEFAULT_META) {
  const b = state.ball;
  const arena = state.arena;
  const mouthX = Math.abs(b.x) < arena.goalW / 2 - BALL_RADIUS * 0.45;
  const scoredBlue = b.z > arena.l / 2 + arena.goalD - BALL_RADIUS * 1.4 && mouthX;
  const scoredOrange = b.z < -arena.l / 2 - arena.goalD + BALL_RADIUS * 1.4 && mouthX;
  if (!scoredBlue && !scoredOrange) return;
  const team = scoredBlue ? "blue" : "orange";
  state.score[team] += 1;
  state.goalFlash = { team, tick: state.tick };
  if (meta.hydrationEnabled && !state.hydrationTriggered && state.timeLeft < (meta.matchLength || DEFAULT_META.matchLength) * 0.62 && state.timeLeft > (meta.matchLength || DEFAULT_META.matchLength) * 0.25) {
    state.hydrationTriggered = true;
    state.break = { type: "hydration", timer: 30, duration: 30, skipVotes: 0, humans: Object.keys(players || {}).length || 1 };
  }
  if (state.overtime && meta.goldenGoal) state.ended = true;
  if (!state.sound) state.sound = {};
  state.sound.goalTick = state.tick;
  state.sound.goalTeam = team;
  resetKickoff(state, players, false);
}

function resetKickoff(state, players, initial = false) {
  state.ball.x = 0; state.ball.y = BALL_RADIUS; state.ball.z = 0;
  state.ball.vx = 0; state.ball.vy = 0; state.ball.vz = 0; state.ball.rx = 0; state.ball.rz = 0;
  state.ball.lastTouchTick = 0; state.ball.lastTouchCar = null; state.ball.lastTouchImpulse = 0;
  if (!state.sound) state.sound = {};
  state.sound.roundSerial = (state.sound.roundSerial || 0) + 1;
  state.sound.roundTick = state.tick;
  state.kickoffTimer = KICKOFF_COUNTDOWN_SECONDS;
  state.kickoffVariant = state.teamSize <= 1 ? makeKickoffVariant(state.arena) : null;
  const byTeam = { blue: 0, orange: 0 };
  for (const car of Object.values(state.cars)) {
    const idx = byTeam[car.team]++;
    const spawn = kickoffSpawn(car.team, idx, state.teamSize, state.arena, car.role, car.human, state.kickoffVariant);
    car.x = spawn.x; car.y = CAR_GROUND_Y; car.z = spawn.z;
    car.vx = 0; car.vy = 0; car.vz = 0;
    car.yaw = spawn.yaw; car.yawVel = 0; car.pitch = 0; car.roll = 0;
    car.grounded = true; car.onGround = true; car.demoed = false; car.demoTimer = 0; car.boostHeld = 0;
    const baseBoost = initial ? STARTING_BOOST : Math.max(car.boost || 0, STARTING_BOOST);
    car.boost = Math.min(BOOST_MAX, baseBoost);
    car.boosting = false; car.drifting = false; car.boostPickup = 0; car.jumpCooldown = 0; car.jumpLatch = false; car.doubleJumpUsed = false; car.justJumped = false; car.jumpEventTick = 0; car.doubleJumpEventTick = 0;
    car.aiMemory = makeAiMemory();
    car.aiPlan = makeAiPlan("support", "kickoff_reset", { x: car.x, z: car.z }, state.tick + 1, { role: car.role, teamSlot: "unassigned", reason: "kickoff reset" });
    car.aiNextThinkTick = 0;
    car.aiAerialUntil = 0;
    car.aiRecoveryUntil = 0;
  }
  state.aiBlackboard = makeAiBlackboardState();
  state.aiBlackboardTick = -9999;
  for (const pad of state.boostPads || []) {
    pad.active = true;
    pad.timer = 0;
  }
}

export function compactState(state) {
  const round = n => Math.round(n * 1000) / 1000;
  const cars = {};
  for (const [id, c] of Object.entries(state.cars)) {
    cars[id] = {
      id: c.id, team: c.team, role: c.role, human: c.human, name: c.name, model: sanitiseVehicleModel(c.model),
      x: round(c.x), y: round(c.y), z: round(c.z),
      vx: round(c.vx), vy: round(c.vy), vz: round(c.vz),
      yaw: round(c.yaw), yawVel: round(c.yawVel), pitchVel: round(c.pitchVel || 0), rollVel: round(c.rollVel || 0), pitch: round(c.pitch || 0), roll: round(c.roll || 0), grounded: !!c.grounded, doubleJumpUsed: !!c.doubleJumpUsed,
      boost: Math.round(c.boost), boosting: !!c.boosting, drifting: !!c.drifting,
      boostPickup: round(c.boostPickup || 0), cueCooldown: round(c.cueCooldown || 0), bumpCooldown: round(c.bumpCooldown || 0),
      lastTouch: c.lastTouch || 0, justJumped: !!c.justJumped, jumpEventTick: c.jumpEventTick || 0, doubleJumpEventTick: c.doubleJumpEventTick || 0, slotIndex: c.slotIndex,
      ai: c.human ? null : {
        intent: c.aiIntent || c.aiPlan?.intent || "support",
        slot: c.aiSlot || c.aiPlan?.teamSlot || "support",
        state: c.aiPlan?.state || c.aiIntent || "support",
        mechanic: c.aiPlan?.mechanic || "drive_to_target",
        reason: String(c.aiReason || c.aiPlan?.reason || "").slice(0, 80),
        confidence: round(c.aiPlan?.confidence || 0),
        targetX: round(c.aiTargetX || c.aiPlan?.x || 0),
        targetZ: round(c.aiTargetZ || c.aiPlan?.z || 0)
      }
    };
  }
  return {
    version: state.version,
    tick: state.tick,
    timeLeft: round(state.timeLeft),
    score: state.score,
    mode: state.mode,
    theme: state.theme || "v10",
    teamSize: state.teamSize,
    pitchSize: state.pitchSize || "standard",
    arena: state.arena,
    ball: {
      x: round(state.ball.x), y: round(state.ball.y), z: round(state.ball.z),
      vx: round(state.ball.vx), vy: round(state.ball.vy), vz: round(state.ball.vz),
      rx: round(state.ball.rx), rz: round(state.ball.rz),
      lastTouchTick: state.ball.lastTouchTick || 0,
      lastTouchCar: state.ball.lastTouchCar || null,
      lastTouchImpulse: round(state.ball.lastTouchImpulse || 0)
    },
    boostPads: (state.boostPads || []).map(p => ({
      id: p.id, x: round(p.x), z: round(p.z), y: round(p.y || 0), radius: round(p.radius || (p.big ? BOOST_PAD_RADIUS_BIG : BOOST_PAD_RADIUS_SMALL)),
      amount: p.amount || (p.big ? 100 : 36), big: !!p.big, active: p.active !== false, timer: round(p.timer || 0), respawn: p.respawn || (p.big ? 10 : 5)
    })),
    cars,
    goalFlash: state.goalFlash,
    sound: { ...(state.sound || {}) },
    kickoffTimer: round(state.kickoffTimer),
    break: state.break ? { type: state.break.type, timer: round(state.break.timer || 0), duration: state.break.duration || 0, skipVotes: state.break.skipVotes || 0, humans: state.break.humans || 1 } : null,
    overtime: state.overtime ? { timer: state.overtime.timer } : null,
    demoSerial: state.demoSerial || 0,
    ended: state.ended
  };
}

export const VISUAL_CONSTANTS = {
  CAR_RADIUS, CAR_HALF_LENGTH: CAR_HALF_Z, CAR_HEIGHT: CAR_HALF_Y * 2,
  CAR_GROUND_Y, CAR_HALF_X, CAR_HALF_Y, CAR_HALF_Z,
  BALL_RADIUS, GOAL_H, GOAL_D
};
