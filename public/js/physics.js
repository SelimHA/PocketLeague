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
  180: { label: "3 minutes", seconds: 180 },
  300: { label: "5 minutes", seconds: 300 },
  420: { label: "7 minutes", seconds: 420 },
  600: { label: "10 minutes", seconds: 600 }
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
  matchLength: 300
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
// V26: a heavier-feeling ball, closer to the pre-multiplayer HTML-only game.
// Max speed, bounce and car-hit lift are trimmed slightly so touches feel less floaty.
const BALL_MAX_SPEED = 58;
const BALL_GRAVITY = 39;
const BALL_RESTITUTION = 0.70;
const BALL_HEAVY_IMPULSE_SCALE = 0.95;
const BALL_HEAVY_LIFT_SCALE = 0.78;
const WALL_RESTITUTION = 0.78;
const KICKOFF_COUNTDOWN_SECONDS = 5;

const CAR_HALF_X = 1.35;
const CAR_HALF_Y = 0.58;
const CAR_HALF_Z = 2.25;
const CAR_RADIUS = 2.35;
const CAR_GROUND_Y = CAR_HALF_Y + 0.08;
const GRAVITY = 44;
const BOOST_MAX = 100;
const BOOST_PAD_RADIUS_SMALL = 1.85;
const BOOST_PAD_RADIUS_BIG = 2.65;
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

function makeBoostPads(arena) {
  const raw = [
    [0, 0, 100], [-arena.w * 0.35, 0, 100], [arena.w * 0.35, 0, 100],
    [-arena.w * 0.40, -arena.l * 0.32, 100], [arena.w * 0.40, -arena.l * 0.32, 100],
    [-arena.w * 0.40, arena.l * 0.32, 100], [arena.w * 0.40, arena.l * 0.32, 100],
    [-arena.w * 0.20, -arena.l * 0.16, 36], [arena.w * 0.20, -arena.l * 0.16, 36],
    [-arena.w * 0.20, arena.l * 0.16, 36], [arena.w * 0.20, arena.l * 0.16, 36],
    [-arena.w * 0.43, 0, 36], [arena.w * 0.43, 0, 36],
    [-arena.w * 0.14, -arena.l * 0.34, 36], [arena.w * 0.14, arena.l * 0.34, 36]
  ];
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
  out.matchLength = clamp(Math.round(Number(out.matchLength) || DEFAULT_META.matchLength), 60, 900);
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
    version: 2,
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
    boostPads: makeBoostPads(arena),
    cars,
    goalFlash: null,
    sound: { roundSerial: 1, roundTick: 0, goalTick: 0, goalTeam: null, ballHitTick: 0, ballHitImpulse: 0, wallHitTick: 0, wallHitSpeed: 0, bounceTick: 0, bounceSpeed: 0, boostPadTick: 0, boostPadBig: false, boostPadCar: null, carBumpTick: 0, carBumpImpulse: 0 },
    kickoffTimer: KICKOFF_COUNTDOWN_SECONDS,
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
    grounded: true,
    onGround: true,
    boost: STARTING_BOOST,
    boosting: false,
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
    cam: "KeyB",
    reset: "KeyR",
    pause: "KeyP",
    chat: "KeyT",
    voice: "KeyV",
    mic: "KeyM"
  };
}


function aiSkill(meta) {
  const d = meta.difficulty || "pro";
  // V34: the difficulty levels now change how early bots read the play, how
  // cleanly they aim/rotate, and how often they make human-like errors. Rookie
  // deliberately hesitates and over-commits sometimes; Pro rotates and saves;
  // All-Star anticipates touches and chooses boost/aerials much more reliably.
  return d === "rookie"
    ? { think: 0.24, aim: 0.70, speed: 0.78, boost: 0.38, jump: 0.34, error: 7.4, read: 0.38, rotation: 0.46, challenge: 0.62, patience: 0.38, aerial: 0.18, save: 0.56, mistake: 0.28, kickoff: 0.42, intercept: 0.44, discipline: 0.48, shot: 0.55, fake: 0.10 }
    : d === "allstar"
      ? { think: 0.040, aim: 1.30, speed: 1.16, boost: 1.12, jump: 0.96, error: 0.72, read: 1.20, rotation: 1.26, challenge: 1.14, patience: 1.05, aerial: 0.92, save: 1.22, mistake: 0.035, kickoff: 0.99, intercept: 1.28, discipline: 1.28, shot: 1.24, fake: 0.42 }
      : { think: 0.085, aim: 1.03, speed: 1.02, boost: 0.88, jump: 0.68, error: 2.55, read: 0.80, rotation: 0.90, challenge: 0.90, patience: 0.74, aerial: 0.58, save: 0.90, mistake: 0.12, kickoff: 0.93, intercept: 0.86, discipline: 0.88, shot: 0.88, fake: 0.24 };
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
    v.y *= Math.pow(0.985, step * 120);
    const airD = Math.pow(0.999, step * 120);
    v.x *= airD; v.y *= airD; v.z *= airD;
    p.x += v.x * step; p.y += v.y * step; p.z += v.z * step;
    if (p.y < BALL_RADIUS) {
      p.y = BALL_RADIUS;
      if (v.y < 0) v.y *= -Math.min(0.88, BALL_RESTITUTION * cfg.ballRestitution);
      const pf = 1 - (1 - 0.988) * cfg.ballFriction;
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

function aiCarEta(car, target, state, skill, danger01 = 0) {
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
  return d / (13 + speed * 0.34 + skill.speed * 7.5) + turnPenalty + rolePenalty;
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

function carBehindBallForTeam(car, ball, team) {
  const enemySign = team === "blue" ? 1 : -1;
  return enemySign * car.z < enemySign * ball.z - 1.5;
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
    const heightPenalty = Math.max(0, p.y - (skill.aerial > 0.75 ? 7.4 : 4.8)) * (1.25 - skill.aerial * 0.62);
    const behindBonus = carBehindBallForTeam(car, p, car.team) ? -0.18 * roleCfg.attack : 0.18 * roleCfg.discipline;
    const defenceBias = ownSign * p.z > state.arena.l * 0.12 ? -0.18 * roleCfg.defence * danger01 : 0;
    const attackBias = enemySign * p.z > state.arena.l * 0.12 ? -0.12 * roleCfg.attack : 0;
    const wallPenalty = Math.abs(p.x) > state.arena.w * 0.43 ? 0.10 * (1.25 - skill.aim) : 0;
    const score = eta + timing + heightPenalty + behindBonus + defenceBias + attackBias + wallPenalty;
    if (!best || score < best.score) best = { point: p, time: t, eta, score };
  }
  return best || { point: ballAt(state, 0.2), time: 0.2, eta: 0.2, score: 0 };
}

function goalTargetForShot(state, team, from, skill = null) {
  const enemySign = team === "blue" ? 1 : -1;
  const opponents = opponentCars(state, team);
  const goalZ = enemySign * (state.arena.l / 2 + state.arena.goalD * 0.34);
  const inNet = opponents.filter(o => Math.sign(o.z || 0) === enemySign && Math.abs(o.z) > state.arena.l * 0.34);
  let x = 0;
  if (inNet.length) {
    const avg = inNet.reduce((sum, o) => sum + o.x, 0) / inNet.length;
    x = avg >= 0 ? -state.arena.goalW * 0.28 : state.arena.goalW * 0.28;
  } else if (Math.abs(from?.x || 0) > state.arena.goalW * 0.18) {
    x = -(from.x || 0) * 0.22;
  }
  if (skill?.shot && skill.shot > 0.95 && inNet.length) {
    const coveredLeft = inNet.some(o => o.x < -state.arena.goalW * 0.12);
    const coveredRight = inNet.some(o => o.x > state.arena.goalW * 0.12);
    if (coveredLeft && !coveredRight) x = state.arena.goalW * 0.30;
    else if (coveredRight && !coveredLeft) x = -state.arena.goalW * 0.30;
  }
  const maxAim = state.arena.goalW * (skill?.shot > 1.05 ? 0.42 : 0.34);
  return { x: clamp(x, -maxAim, maxAim), z: goalZ };
}

function clearanceTarget(state, team, from) {
  const enemySign = team === "blue" ? 1 : -1;
  const side = (from?.x || state.ball.x || 0) >= 0 ? -1 : 1;
  return {
    x: side * state.arena.w * 0.36,
    z: enemySign * state.arena.l * 0.22
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

function nearestUsefulBoostPad(car, state, preferBig = false) {
  const pads = (state.boostPads || []).filter(p => p.active !== false && (preferBig ? p.big : true));
  if (!pads.length && preferBig) return nearestUsefulBoostPad(car, state, false);
  let best = null;
  let bestScore = Infinity;
  const ownSign = car.team === "blue" ? -1 : 1;
  for (const p of pads) {
    const d = Math.hypot(car.x - p.x, car.z - p.z);
    const ownHalfBonus = Math.sign(p.z || 0) === ownSign ? -6 : 0;
    const bigBonus = p.big ? -12 : 0;
    const airPenalty = Math.abs(car.y - CAR_GROUND_Y) > 2 ? 20 : 0;
    const score = d + ownHalfBonus + bigBonus + airPenalty;
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

function setAiDebug(car, intent, tx, tz) {
  car.aiIntent = intent;
  car.aiTargetX = tx;
  car.aiTargetZ = tz;
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
  const behind = Math.abs(delta) > 2.28 && dist < 18;
  let throttle = behind ? -0.52 : clamp(dist / (precise ? 16 : 10), 0.30, 1) * skill.speed;
  if (Math.abs(delta) > 1.15 && !behind) throttle *= precise ? 0.38 : 0.56;
  if (intent === "recover") throttle = clamp(throttle, 0.34, 0.82);
  if (intent === "boost") throttle = 1;
  if (["guard", "shadow", "support", "rotate", "fake"].includes(intent) && !behind) {
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
    && speed > (intent === "kickoff" ? 8.0 : 9.2)
    && Math.abs(delta) > driftThreshold
    && Math.abs(delta) < 2.62
    && driftSkill > 0.38
    && driftWindow;
  const boostIntent = ["challenge", "shot", "save", "kickoff", "boost"].includes(intent);
  const boostAngle = intent === "kickoff" ? 0.50 : intent === "save" ? 0.38 : 0.34;
  const boostMinDist = intent === "kickoff" ? 9 : intent === "save" ? 13 : 18;
  const boostAllowed = throttle >= 0.04 && car.boost > (precise ? 14 : 7) && (car.grounded || state.mode === "flying");
  const boost = boostAllowed
    && boostIntent
    && Math.abs(delta) < boostAngle
    && dist > boostMinDist
    && forwardSpeed > -2
    && Math.random() < clamp(skill.boost * (opts.boostScale || 1), 0, 1.45);
  return { throttle, steer, boost, drift: shouldDrift, aligned, dist, delta };
}

export function makeAIInput(car, state, meta) {
  const cfg = MODE_CONFIGS[state.mode] || MODE_CONFIGS.standard;
  const tune = aiTuningForCar(meta, car);
  const skill = { ...aiSkill(meta) };
  const style = { ...styleConfig(meta) };
  const role = ROLES.includes(car.role) ? car.role : "balanced";
  const roleCfg = roleConfig(role);
  skill.speed *= (0.96 + (tune.aggression - 1) * 0.35 + (tune.boost - 1) * 0.18);
  skill.boost *= tune.boost;
  skill.jump *= (0.94 + (tune.aggression - 1) * 0.25);
  skill.save *= (0.96 + (tune.defence - 1) * 0.34);
  skill.challenge *= roleCfg.challenge;
  skill.rotation *= roleCfg.rotation;
  skill.aerial *= roleCfg.aerial;
  skill.patience *= roleCfg.patience;
  skill.discipline *= roleCfg.discipline;
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
  const ballSpeed = Math.hypot(ball.vx, ball.vz);
  const movingAtOwnGoal = Math.sign(ball.vz || ownSign) === ownSign && Math.abs(ball.vz) > 1.5;
  const ownHalfDepth = clamp((ownSign * ball.z) / (state.arena.l * 0.50), 0, 1);
  const nearOwnGoal = Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.28;
  const danger01 = clamp((movingAtOwnGoal ? 0.35 : 0) + ownHalfDepth * 0.55 + (nearOwnGoal ? 0.24 : 0) + clamp(ballSpeed / 60, 0, 0.20), 0, 1);
  const distToBall = distance2(car, ball);
  const intercept = selectAiIntercept(car, state, skill, danger01, roleCfg);
  const predicted = intercept.point;
  const ownEta = aiCarEta(car, predicted, state, skill, danger01);
  const opponentEta = opponentEtaTo(state, car.team, predicted, skill, danger01);
  const mateEta = teamEtaTo(state, car.team, predicted, skill, danger01, car.id);
  const rank = aiRankForBall(car, state, skill, danger01);
  const teamSize = Math.max(1, Number(state.teamSize || meta.teamSize || 1));
  const firstMan = rank === 0 || style.chaos;
  const secondMan = rank === 1 || (teamSize === 1 && rank === 0);
  const thirdMan = rank >= 2;
  const hasBetterMate = mateEta + (skill.discipline > 1 ? 0.18 : 0.05) < ownEta && !style.chaos;
  const behindBall = carBehindBallForTeam(car, predicted, car.team);
  const inOwnThird = ownSign * predicted.z > state.arena.l * 0.16;
  const inEnemyHalf = enemySign * predicted.z > 0;
  const canWinRace = ownEta < opponentEta + (skill.discipline > 1 ? 0.20 : 0.05);
  const shouldPressureOpponent = opponentEta < ownEta + 0.42 && (firstMan || style.chase > 1.15) && role !== "goalkeeper";

  let intent = "support";
  let target = { x: predicted.x, z: predicted.z };
  let aim = goalTargetForShot(state, car.team, predicted, skill);
  let approachDistance = cfg.snooker ? 14 : 7.6;
  let precise = false;
  let holdPlan = false;

  const ticksSinceRound = state.tick - Number(state.sound?.roundTick || 0);
  const kickoffActive = Math.abs(ball.x) < 0.1 && Math.abs(ball.z) < 0.1 && state.kickoffTimer <= 0 && ticksSinceRound < 120 * 4;
  const canChallenge = (firstMan && !hasBetterMate)
    || (role === "attack" && rank <= 1 && style.attack > 1.03 && !hasBetterMate)
    || (role === "balanced" && rank <= 1 && (danger01 > 0.36 || style.chase > 0.95) && !hasBetterMate)
    || (role === "midfield" && rank <= 1 && style.chase > 1.08 && danger01 < 0.72)
    || (role === "defence" && danger01 > 0.54 && rank <= 1);
  const shouldDefend = danger01 > (role === "goalkeeper" ? 0.26 : role === "defence" ? 0.35 : role === "balanced" ? 0.46 : 0.60 / Math.max(0.65, style.defence));
  const disciplinedChallenge = canChallenge
    && (canWinRace || shouldPressureOpponent || danger01 > 0.68 || style.chaos)
    && (behindBall || danger01 > 0.52 || role === "attack" || skill.discipline < 0.82);

  if (kickoffActive && (role === "attack" || role === "balanced" || rank === 0)) {
    intent = "kickoff";
    const kickoffShot = (meta.difficulty || "pro") !== "rookie" && aiRoundRoll(car, state, 2) < (meta.difficulty === "allstar" ? 0.52 : 0.28);
    aim = kickoffShot ? goalTargetForShot(state, car.team, ball) : { x: 0, z: enemyGoalZ };
    target = distToBall > 13
      ? { x: 0, z: 0 }
      : approachTargetBehindBall(ball, aim, kickoffShot ? 1.4 : 2.4);
    approachDistance = 0;
    precise = false;
  } else if (role === "goalkeeper") {
    if (danger01 > 0.38 || inOwnThird || Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.24) {
      intent = danger01 > 0.68 || (distToBall < 16 && canWinRace) ? "save" : "guard";
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
      target = backPostTarget(state, car.team, ball, 3.6);
      precise = true;
      holdPlan = true;
    }
  } else if (shouldDefend && (role === "defence" || role === "balanced" || rank <= 1 || style.defence > 1.18)) {
    intent = danger01 > 0.66 && rank <= 1 && !hasBetterMate ? "save" : "shadow";
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
    const attacking = inEnemyHalf || (style.attack > 1.12 && !inOwnThird);
    intent = attacking ? "shot" : "challenge";
    aim = attacking ? goalTargetForShot(state, car.team, predicted, skill) : clearanceTarget(state, car.team, predicted);
    approachDistance = cfg.snooker ? 13 : clamp(8.8 - skill.aim * 1.45 + ballSpeed * 0.030 - skill.shot * 0.28, 5.2, 10.8);
    target = approachTargetBehindBall(predicted, aim, approachDistance);
    if (distToBall < 7.2 + skill.aim * 1.4 || ownEta < 0.28) target = { x: predicted.x + (aim.x - predicted.x) * 0.08, z: predicted.z + (aim.z - predicted.z) * 0.08 };
  } else if (firstMan && !hasBetterMate && shouldPressureOpponent && skill.fake > 0.18 && role !== "defence" && role !== "goalkeeper") {
    intent = "fake";
    aim = inOwnThird ? clearanceTarget(state, car.team, predicted) : goalTargetForShot(state, car.team, predicted, skill);
    target = approachTargetBehindBall(predicted, aim, 10.5 + skill.patience * 1.6);
    precise = true;
  } else if (secondMan || role === "balanced" || role === "midfield") {
    intent = "support";
    target = supportTargetForRole(car, state, role, rank, style, roleCfg, predicted, ownSign);
    precise = true;
    holdPlan = skill.discipline > 0.70;
  } else {
    intent = "rotate";
    target = (role === "attack" || role === "balanced") && !thirdMan
      ? supportTargetForRole(car, state, role, rank, style, roleCfg, predicted, ownSign)
      : {
        x: clamp(((car.slotIndex % Math.max(1, teamSize)) - (teamSize - 1) / 2) * state.arena.w * 0.10 - ball.x * 0.15, -state.arena.w * 0.38, state.arena.w * 0.38),
        z: ownGoalZ - ownSign * (role === "defence" || thirdMan ? 9.0 : 15.5)
      };
    precise = true;
    holdPlan = true;
  }

  // Real players rotate for boost when they are not the immediate challenger.
  // V38: with the same starting boost as humans, bots now value pads more and
  // take nearby route pads during support/rotation, rather than waiting until
  // they are completely empty.
  const roleBoostFloor = role === "attack" ? 20 : role === "balanced" ? 24 : 28;
  const lowBoost = car.boost < roleBoostFloor * style.boostDiscipline;
  const routeBoost = ["support", "rotate", "guard"].includes(intent) && car.boost < (skill.rotation > 0.9 ? 62 : 48);
  const urgent = intent === "save" || (intent === "challenge" && danger01 > 0.62) || intent === "kickoff";
  if ((lowBoost || routeBoost) && !urgent && !cfg.snooker && car.grounded && (role !== "goalkeeper" || danger01 < 0.32)) {
    const pad = nearestUsefulBoostPad(car, state, car.boost < 12 || (routeBoost && skill.rotation > 0.9));
    const maxPadRange = state.arena.l * (routeBoost ? 0.34 : (skill.rotation > 0.9 ? 0.55 : 0.38));
    if (pad && Math.hypot(car.x - pad.x, car.z - pad.z) < maxPadRange) {
      intent = "boost";
      target = { x: pad.x, z: pad.z };
      precise = false;
      holdPlan = false;
    }
  }

  const urgentPlan = intent === "save" || intent === "kickoff" || danger01 > 0.76;
  if (!urgentPlan && car.aiPlan && state.tick < (car.aiNextThinkTick || 0)) {
    intent = car.aiPlan.intent || intent;
    target = { x: car.aiPlan.x, z: car.aiPlan.z };
    precise = !!car.aiPlan.precise;
  } else {
    const thinkTicks = Math.max(3, Math.round((skill.think + aiRoundRoll(car, state, 7) * skill.think * 0.55) * 120));
    car.aiPlan = { intent, x: target.x, z: target.z, precise };
    car.aiNextThinkTick = state.tick + (holdPlan ? Math.round(thinkTicks * 1.25) : thinkTicks);
  }

  // Human-like errors: mostly Rookie, occasionally Pro. All-Star remains clean.
  const mistakeWave = Math.sin(state.tick * 0.013 + car.aiNoiseSeed * 4.1);
  const n = deterministicNoise(car, state, skill.error * (mistakeWave > 1 - skill.mistake * 2 ? 1.45 : 0.55));
  if (style.chaos) {
    n.x += Math.sin(state.tick * 0.035 + car.aiNoiseSeed) * 6.5;
    n.z += Math.cos(state.tick * 0.027 + car.aiNoiseSeed * 1.7) * 5.5;
  }
  const errorScale = intent === "save" ? 0.38 : intent === "shot" ? 0.62 : 1;
  target.x += n.x * errorScale;
  target.z += n.z * errorScale;

  target.x = clamp(target.x, -state.arena.w / 2 + 6.5, state.arena.w / 2 - 6.5);
  target.z = clamp(target.z, -state.arena.l / 2 - state.arena.goalD + 5.5, state.arena.l / 2 + state.arena.goalD - 5.5);

  const drive = makeDriveInput(car, target, state, skill, intent, {
    precise,
    boostScale: intent === "boost" ? 0.55 : intent === "save" ? 0.85 : intent === "kickoff" ? 1.35 : 1
  });

  if (intent === "kickoff") {
    drive.throttle = 1;
    const kickoffFast = (meta.difficulty || "pro") !== "rookie" && aiRoundRoll(car, state, 1) < skill.kickoff;
    if (kickoffFast && car.boost > 2 && (car.grounded || state.mode === "flying") && drive.dist > 6 && Math.abs(drive.delta) < 0.72) drive.boost = true;
    if (kickoffFast && car.grounded && carSpeed2(car) > 9 && Math.abs(drive.delta) > 0.34 && Math.abs(drive.delta) < 1.35) drive.drift = true;
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
  const reachableHeight = state.mode === "flying" ? 16 : (skill.aerial > 0.7 ? 7.6 : 5.8);
  let jump = false;
  if ((intent === "shot" || intent === "challenge" || intent === "save" || intent === "kickoff") && ballDist < (intent === "save" ? 9.5 : 7.4) && shotAligned) {
    if (ball.y > 2.35 && ball.y < reachableHeight && car.grounded && Math.random() < clamp(skill.jump * (intent === "save" ? skill.save : 1), 0, 1.15)) jump = true;
    if (intent === "kickoff" && ballDist < 7.2 && car.grounded && (skill.jump > 0.55 || ((meta.difficulty || "pro") !== "rookie" && aiRoundRoll(car, state, 3) < 0.86))) jump = true;
  }
  if (!car.grounded && !car.doubleJumpUsed && ballDist < 8.6 && ball.y > car.y + 0.8 && shotAligned && skill.aerial > 0.55 && Math.random() < skill.aerial * 0.34) {
    jump = true;
  }

  // Avoid boosting through badly angled recoveries; better bots feather boost when
  // they need to rotate instead of wasting it.
  if (Math.abs(drive.delta) > 0.58 && intent !== "kickoff" && intent !== "save") drive.boost = false;
  if (drive.boost && !(drive.throttle >= 0 && car.boost > 0.1 && (car.grounded || state.mode === "flying"))) drive.boost = false;
  if (!car.grounded) drive.drift = false;
  if (cfg.snooker) drive.boost = false;

  setAiDebug(car, intent, target.x, target.z);
  return {
    throttle: drive.throttle,
    steer: drive.steer,
    boost: drive.boost,
    jump,
    drift: drive.drift,
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

    if (state.kickoffTimer > 0) {
      state.kickoffTimer = Math.max(0, state.kickoffTimer - dt);
    } else {
      state.timeLeft = Math.max(0, state.timeLeft - dt);
      if (state.timeLeft <= 0) state.ended = true;
    }

    const resetRequested = Object.keys(players || {}).some(id => normaliseInput(this.inputs[id]).reset);
    if (resetRequested && !this.resetLatch) resetKickoff(state, players, false);
    this.resetLatch = resetRequested;

    const humanIds = new Set(Object.keys(players));
    for (const car of Object.values(state.cars)) {
      car.human = humanIds.has(car.id);
      if (players[car.id]) {
        car.name = players[car.id].name || car.name;
        car.role = players[car.id].role || car.role;
        car.team = players[car.id].team || car.team;
        car.model = sanitiseVehicleModel(players[car.id].model || players[car.id].vehicle || car.model);
      }
      const input = car.human ? normaliseInput(this.inputs[car.id]) : makeAIInput(car, state, this.meta);
      updateCar(car, state.kickoffTimer > 0 ? { throttle: 0, steer: 0, boost: false, jump: false, drift: false } : input, state, cfg, dt);
    }

    updateBoostPads(state, dt);
    resolveCarCar(state);
    updateBall(state, cfg, dt);
    resolveBallHits(state, cfg, dt, this.meta.mode);
    resolveGoals(state, players);
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
    reset: !!input.reset
  };
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
  const wantsBoost = !!input.boost && throttle >= 0 && car.boost > 0.1 && (car.grounded || state.mode === "flying");
  const jump = !!input.jump;
  const vehicle = VEHICLE_CONFIGS[car.model] || VEHICLE_CONFIGS.default;

  car.boosting = false;
  car.drifting = false;

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
    if (jump && !car.jumpLatch && car.jumpCooldown <= 0 && !car.doubleJumpUsed) {
      car.doubleJumpUsed = true;
      car.justJumped = true;
      car.vy = Math.max(car.vy + 4.5 * cfg.jump * vehicle.jump, DOUBLE_JUMP_VELOCITY * cfg.jump * vehicle.jump);
      car.vx += fwd.x * DOUBLE_JUMP_FORWARD_KICK * vehicle.aerial;
      car.vz += fwd.z * DOUBLE_JUMP_FORWARD_KICK * vehicle.aerial;
      car.pitch = -0.22;
      car.jumpCooldown = 0.28;
      car.jumpEventTick = state.tick;
      car.doubleJumpEventTick = state.tick;
    }
    car.yaw += steer * 2.05 * cfg.steer * vehicle.aerial * dt;
    if (Math.abs(throttle) > 0.001) {
      car.vx += fwd.x * throttle * 14.0 * cfg.drive * cfg.aerialDrive * vehicle.aerial * dt;
      car.vz += fwd.z * throttle * 14.0 * cfg.drive * cfg.aerialDrive * vehicle.aerial * dt;
    }
    if (wantsBoost) {
      car.boosting = true;
      car.boost = Math.max(0, car.boost - (state.mode === "flying" ? BOOST_DRAIN_FLYING : BOOST_DRAIN_AIR) * dt);
      car.vx += fwd.x * 57 * cfg.drive * vehicle.boost * dt;
      car.vz += fwd.z * 57 * cfg.drive * vehicle.boost * dt;
    }
    car.vy -= GRAVITY * cfg.gravity * dt;
  }

  car.jumpLatch = !!jump;
  car.jumpCooldown = Math.max(0, (car.jumpCooldown || 0) - dt);
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  car.z += car.vz * dt;

  if (car.y <= CAR_GROUND_Y) {
    car.y = CAR_GROUND_Y;
    car.vy = 0;
    car.grounded = true;
    car.onGround = true;
    car.doubleJumpUsed = false;
    car.justJumped = false;
  } else {
    car.grounded = false;
    car.onGround = false;
  }

  const wallBounce = state.mode === "ice" ? -0.16 : -0.08;
  const limX = arena.w / 2 - CAR_RADIUS;
  if (Math.abs(car.x) > limX) {
    car.x = Math.sign(car.x) * limX;
    car.vx *= wallBounce;
  }
  const inGoalMouth = Math.abs(car.x) < arena.goalW / 2 - CAR_RADIUS * 0.5;
  const limZ = inGoalMouth ? arena.l / 2 + arena.goalD - CAR_RADIUS : arena.l / 2 - CAR_RADIUS;
  if (Math.abs(car.z) > limZ) {
    car.z = Math.sign(car.z) * limZ;
    car.vz *= wallBounce;
  }

  const visualSpeed = Math.hypot(car.vx, car.vz);
  const driftLean = car.drifting ? 0.12 * Math.sign(steer || car.yawVel || 1) : 0;
  car.roll = smooth(car.roll || 0, -steer * clamp(visualSpeed / 42, 0, 1) * 0.16 + driftLean, 10, dt);
  car.pitch = smooth(car.pitch || 0, -clamp(forwardSpeed / 55, -1, 1) * 0.08 + (car.grounded ? 0 : 0.12), 7, dt);

  car.boostPickup = Math.max(0, (car.boostPickup || 0) - dt);
  car.cueCooldown = Math.max(0, (car.cueCooldown || 0) - dt);
  car.bumpCooldown = Math.max(0, (car.bumpCooldown || 0) - dt);
}

function updateBoostPads(state, dt) {
  if (!Array.isArray(state.boostPads)) state.boostPads = makeBoostPads(state.arena);
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

function resolveCarCar(state) {
  const cars = Object.values(state.cars);
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
        const impulse = closing * 0.42;
        const massA = (VEHICLE_CONFIGS[a.model] || VEHICLE_CONFIGS.default).mass;
        const massB = (VEHICLE_CONFIGS[b.model] || VEHICLE_CONFIGS.default).mass;
        a.vx += nx * impulse / massA; a.vz += nz * impulse / massA;
        b.vx -= nx * impulse / massB; b.vz -= nz * impulse / massB;
        a.bumpCooldown = b.bumpCooldown = 0.1;
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
  b.vy *= Math.pow(0.985, dt * 120);
  const air = Math.pow(0.999, dt * 120);
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
    if (b.vy < -1.2) {
      b.vy *= -ballRestitution;
      if (impactY > 3.2) {
        if (!state.sound) state.sound = {};
        state.sound.bounceTick = state.tick;
        state.sound.bounceSpeed = impactY;
      }
    } else b.vy = 0;
    const groundFriction = 1 - (1 - 0.988) * cfg.ballFriction;
    const d = Math.pow(groundFriction, dt * 120);
    b.vx *= d; b.vz *= d;
  }

  const ceilingH = arena.ceilingH || (state.mode === "flying" ? CEILING_H_FLYING : CEILING_H_STANDARD);
  if (b.y > ceilingH - BALL_RADIUS) {
    b.y = ceilingH - BALL_RADIUS;
    const hitSpeed = Math.abs(b.vy);
    if (b.vy > 0) b.vy *= -0.62;
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
    b.vz *= 0.985;
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
    b.vx *= 0.985;
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
      if (b.vy > 0) b.vy *= -0.62;
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
  const frontBonus = clamp(fwd.x * nx + fwd.z * nz, -0.2, 1) * 6.2;
  const jumpBonus = car.justJumped ? 7.4 : 0;
  const impulse = (Math.max(0, closing * 1.18) + 4.0 + speed * 0.39 + frontBonus + jumpBonus) * vehicle.hit * BALL_HEAVY_IMPULSE_SCALE;
  b.vx += nx * impulse;
  b.vy += ny * impulse * BALL_HEAVY_LIFT_SCALE;
  b.vz += nz * impulse;
  if (ny < 0.25) b.vy += clamp((speed * 0.082 + (car.justJumped ? 4.0 : 1.55)) * BALL_HEAVY_LIFT_SCALE, 1.0, 5.7);
  if (car.boosting) { b.vx += fwd.x * 5.1; b.vz += fwd.z * 5.1; }
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const bs = Math.hypot(b.vx, b.vy, b.vz);
  if (bs > maxBallSpeed) { const s = maxBallSpeed / bs; b.vx *= s; b.vy *= s; b.vz *= s; }
  const recoil = Math.min(7, impulse * 0.085) / vehicle.mass;
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

function resolveGoals(state, players) {
  const b = state.ball;
  const arena = state.arena;
  const mouthX = Math.abs(b.x) < arena.goalW / 2 - BALL_RADIUS * 0.45;
  const scoredBlue = b.z > arena.l / 2 + arena.goalD - BALL_RADIUS * 1.4 && mouthX;
  const scoredOrange = b.z < -arena.l / 2 - arena.goalD + BALL_RADIUS * 1.4 && mouthX;
  if (!scoredBlue && !scoredOrange) return;
  const team = scoredBlue ? "blue" : "orange";
  state.score[team] += 1;
  state.goalFlash = { team, tick: state.tick };
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
    car.grounded = true; car.onGround = true;
    const baseBoost = initial ? STARTING_BOOST : Math.max(car.boost || 0, STARTING_BOOST);
    car.boost = Math.min(BOOST_MAX, baseBoost);
    car.boosting = false; car.drifting = false; car.boostPickup = 0; car.jumpCooldown = 0; car.jumpLatch = false; car.doubleJumpUsed = false; car.justJumped = false; car.jumpEventTick = 0; car.doubleJumpEventTick = 0;
  }
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
      yaw: round(c.yaw), yawVel: round(c.yawVel), pitch: round(c.pitch || 0), roll: round(c.roll || 0), grounded: !!c.grounded, doubleJumpUsed: !!c.doubleJumpUsed,
      boost: Math.round(c.boost), boosting: !!c.boosting, drifting: !!c.drifting,
      boostPickup: round(c.boostPickup || 0), cueCooldown: round(c.cueCooldown || 0), bumpCooldown: round(c.bumpCooldown || 0),
      lastTouch: c.lastTouch || 0, justJumped: !!c.justJumped, jumpEventTick: c.jumpEventTick || 0, doubleJumpEventTick: c.doubleJumpEventTick || 0, slotIndex: c.slotIndex
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
    ended: state.ended
  };
}

export const VISUAL_CONSTANTS = {
  CAR_RADIUS, CAR_HALF_LENGTH: CAR_HALF_Z, CAR_HEIGHT: CAR_HALF_Y * 2,
  CAR_GROUND_Y, CAR_HALF_X, CAR_HALF_Y, CAR_HALF_Z,
  BALL_RADIUS, GOAL_H, GOAL_D
};
