export const ROLES = ["goalkeeper", "defence", "midfield", "attack"];

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

export const DEFAULT_META = {
  mode: "standard",
  theme: "v10",
  teamSize: 1,
  difficulty: "pro",
  playstyle: "balanced",
  chatScope: "all",
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
// V25: still finite and a little faster than the old slow drain, but backed
// off slightly from V23/V24 so each tank lasts just a touch longer.
const BOOST_DRAIN_GROUND = 35;
const BOOST_DRAIN_AIR = 29;
const BOOST_DRAIN_FLYING = 31;
const DOUBLE_JUMP_VELOCITY = 17.2;
const DOUBLE_JUMP_FORWARD_KICK = 6.3;
const MATCH_TICKS_PER_WRITE = 4;

// V28: Rocket League-style feel pass. The numbers still preserve the V10 baseline,
// but make standard handling more immediate, more predictable, and less floaty.

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angleNorm = a => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (current, target, sharpness, dt) => current + (target - current) * (1 - Math.exp(-sharpness * dt));
const horizontalSpeed = c => Math.hypot(c.vx, c.vz);
const fwdFromYaw = yaw => ({ x: Math.sin(yaw), z: Math.cos(yaw) });
const rightFromYaw = yaw => ({ x: Math.cos(yaw), z: -Math.sin(yaw) });
const dot2 = (ax, az, bx, bz) => ax * bx + az * bz;

export function getArenaSize(mode = "standard", teamSize = 1) {
  const cfg = MODE_CONFIGS[mode] || MODE_CONFIGS.standard;
  const n = clamp(Number(teamSize) || 1, 1, 5);
  // Match the pre-multiplayer V10 baseline: 1v1 is 72 x 112.
  const teamScale = 1 + (n - 1) * 0.16;
  const flyingScale = mode === "flying" ? 1.08 : 1;
  return {
    w: BASE_FIELD_W * teamScale * flyingScale,
    l: BASE_FIELD_L * teamScale * flyingScale,
    wallH: WALL_H,
    ceilingH: mode === "flying" ? CEILING_H_FLYING : CEILING_H_STANDARD,
    goalW: BASE_GOAL_W * (1 + (n - 1) * 0.055),
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
    radius: amount >= 100 ? 3.15 : 2.35,
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

export function serialiseMeta(meta = {}) {
  const out = { ...DEFAULT_META, ...meta };
  out.teamSize = clamp(Number(out.teamSize) || 1, 1, 5);
  if (!MODE_CONFIGS[out.mode]) out.mode = "standard";
  if (!["rookie", "pro", "allstar"].includes(out.difficulty)) out.difficulty = "pro";
  if (!["balanced", "defensive", "aggressive", "chaotic"].includes(out.playstyle)) out.playstyle = "balanced";
  if (!STADIUM_THEMES[out.theme]) out.theme = "v10";
  if (!["all", "team"].includes(out.chatScope)) out.chatScope = "all";
  out.paused = !!out.paused;
  return out;
}

export function defaultRoleForSlot(i, teamSize) {
  if (teamSize <= 1) return "attack";
  if (i === 0) return teamSize >= 2 ? "goalkeeper" : "attack";
  if (teamSize >= 4 && i === 1) return "defence";
  if (i === teamSize - 1) return "attack";
  return "midfield";
}

export function sanitiseVehicleModel(model) {
  return VEHICLE_CONFIGS[model] ? model : "default";
}

function aiVehicleForSlot(team, i, role) {
  if (role === "goalkeeper") return i % 2 ? "van" : "truck";
  if (role === "defence") return i % 2 ? "rally" : "van";
  if (role === "midfield") return i % 2 ? "sport" : "rally";
  return team === "blue" ? (i % 3 === 0 ? "muscle" : i % 2 ? "sport" : "default") : (i % 3 === 0 ? "muscle" : i % 2 ? "rally" : "sport");
}

export function makeInitialState(meta, players = {}) {
  const cleanMeta = serialiseMeta(meta);
  const arena = getArenaSize(cleanMeta.mode, cleanMeta.teamSize);
  const humans = Object.entries(players).map(([id, p]) => ({ id, ...p }));
  const cars = {};
  let slotIndex = 0;
  for (const team of ["blue", "orange"]) {
    const teamHumans = humans.filter(p => p.team === team).slice(0, cleanMeta.teamSize);
    for (let i = 0; i < cleanMeta.teamSize; i++) {
      const human = teamHumans[i];
      const id = human ? human.id : `AI_${team}_${i}`;
      const configuredAiRole = cleanMeta.aiRoles?.[team]?.[i];
      const role = human?.role || configuredAiRole || defaultRoleForSlot(i, cleanMeta.teamSize);
      const spawn = kickoffSpawn(team, i, cleanMeta.teamSize, arena, role, !!human);
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
    arena,
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
  const roleName = role === "goalkeeper" ? "GK" : role === "defence" ? "Back" : role === "midfield" ? "Mid" : "Striker";
  return `${prefix} ${roleName} ${i + 1}`;
}

function laneOffset(index, count, spacing) {
  if (count <= 1) return 0;
  return (index - (count - 1) / 2) * spacing;
}

function kickoffSpawn(team, i, teamSize, arena, role = "attack", human = false) {
  const blue = team === "blue";
  const sign = blue ? -1 : 1;
  const yaw = blue ? 0 : Math.PI;
  if (teamSize <= 1) return { x: 0, z: sign * 40, yaw };
  const roleDepth = { goalkeeper: 0.43, defence: 0.33, midfield: 0.24, attack: 0.17 };
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
    boost: team === "blue" ? 33 : 60,
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
    reset: "KeyR"
  };
}

function aiSkill(meta) {
  const d = meta.difficulty || "pro";
  return d === "rookie"
    ? { think: 0.16, aim: 0.72, speed: 0.76, boost: 0.35, jump: 0.35, error: 6.4 }
    : d === "allstar"
      ? { think: 0.055, aim: 1.18, speed: 1.12, boost: 1.0, jump: 0.88, error: 0.95 }
      : { think: 0.09, aim: 1.0, speed: 1.0, boost: 0.75, jump: 0.65, error: 2.8 };
}

function styleConfig(meta) {
  const p = meta.playstyle || "balanced";
  return p === "defensive"
    ? { attack: 0.72, defence: 1.42, chase: 0.82, chaos: 0 }
    : p === "aggressive"
      ? { attack: 1.45, defence: 0.72, chase: 1.18, chaos: 0 }
      : p === "chaotic"
        ? { attack: 1.15, defence: 0.84, chase: 1.45, chaos: 1 }
        : { attack: 1, defence: 1, chase: 1, chaos: 0 };
}

function predictBall(state, seconds) {
  const cfg = MODE_CONFIGS[state.mode] || MODE_CONFIGS.standard;
  const p = { x: state.ball.x, y: state.ball.y, z: state.ball.z };
  const v = { x: state.ball.vx, y: state.ball.vy, z: state.ball.vz };
  const simDt = 1 / 30;
  let t = 0;
  while (t < seconds) {
    const step = Math.min(simDt, seconds - t);
    v.y -= BALL_GRAVITY * cfg.ballGravity * step;
    const d = Math.pow(0.997, step * 120);
    v.x *= d; v.y *= d; v.z *= d;
    p.x += v.x * step; p.y += v.y * step; p.z += v.z * step;
    if (p.y < BALL_RADIUS) {
      p.y = BALL_RADIUS;
      if (v.y < 0) v.y *= -Math.min(0.88, BALL_RESTITUTION * cfg.ballRestitution);
      const pf = 1 - (1 - 0.994) * cfg.ballFriction;
      const pd = Math.pow(pf, step * 120);
      v.x *= pd; v.z *= pd;
    }
    if (Math.abs(p.x) > state.arena.w / 2 - BALL_RADIUS) {
      p.x = Math.sign(p.x) * (state.arena.w / 2 - BALL_RADIUS);
      v.x *= -Math.min(0.94, WALL_RESTITUTION * cfg.wallRestitution);
    }
    t += step;
  }
  return p;
}

export function makeAIInput(car, state, meta) {
  const cfg = MODE_CONFIGS[state.mode] || MODE_CONFIGS.standard;
  const skill = aiSkill(meta);
  const style = styleConfig(meta);
  const ownSign = car.team === "blue" ? -1 : 1;
  const enemySign = -ownSign;
  const ownGoalZ = ownSign * (state.arena.l / 2 - 7);
  const enemyGoalZ = enemySign * (state.arena.l / 2 - 9);
  const ball = state.ball;
  const ballThreat = Math.sign(ball.vz || 0.001) === ownSign || Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.32;
  const predicted = predictBall(state, clamp(0.25 + Math.hypot(ball.x - car.x, ball.z - car.z) / 85, 0.25, 1.25));
  let tx = predicted.x;
  let tz = predicted.z;

  if (car.role === "goalkeeper") {
    tx = clamp(ball.x * 0.72, -state.arena.goalW * 0.44, state.arena.goalW * 0.44);
    tz = ownGoalZ;
    if (ballThreat) tz = ball.z - ownSign * 8;
  } else if (car.role === "defence") {
    tx = ball.x * 0.55;
    tz = (ball.z + ownGoalZ) * 0.48;
    if (style.attack > 1.2 && Math.abs(ball.z) < state.arena.l * 0.23) tz = ball.z - enemySign * 9;
  } else if (car.role === "midfield") {
    tx = ball.x * 0.58 + (car.slotIndex % 2 ? 8 : -8);
    tz = ball.z * 0.32;
    if (style.defence > 1.2) tz = (ball.z + ownGoalZ) * 0.38;
  } else {
    tx = predicted.x * 0.94;
    tz = predicted.z - enemySign * (cfg.snooker ? 13 : 7);
    if (style.defence > 1.2) tz = ball.z - enemySign * 14;
  }

  if (style.chaos) {
    tx += Math.sin(state.tick * 0.035 + car.aiNoiseSeed) * 8;
    tz += Math.cos(state.tick * 0.027 + car.aiNoiseSeed * 1.7) * 6;
  }

  tx = clamp(tx, -state.arena.w / 2 + 7, state.arena.w / 2 - 7);
  tz = clamp(tz, -state.arena.l / 2 + 7, state.arena.l / 2 - 7);

  const dx = tx - car.x;
  const dz = tz - car.z;
  const desiredYaw = Math.atan2(dx, dz);
  const delta = angleNorm(desiredYaw - car.yaw);
  const dist = Math.hypot(dx, dz);
  const steer = clamp(delta * (1.45 + skill.aim * 0.4), -1, 1);
  let throttle = Math.abs(delta) > 2.05 ? -0.42 : clamp(dist / 10, 0.28, 1) * skill.speed;
  if (Math.abs(delta) > 1.05 && dist < 14) throttle *= 0.45;
  const aligned = Math.abs(delta) < 0.28;
  const chaseAllowed = car.role === "attack" || (car.role === "midfield" && style.attack >= 0.9) || (car.role === "defence" && ballThreat);
  const boost = car.boost > 10 && aligned && dist > (cfg.snooker ? 24 : 18) && chaseAllowed && !cfg.snooker && Math.random() < skill.boost;
  const ballNear = Math.hypot(ball.x - car.x, ball.z - car.z) < (state.mode === "flying" ? 9.0 : 6.0);
  const jump = ballNear && ball.y > 2.2 && ball.y < (state.mode === "flying" ? 15.5 : 6.2) && car.grounded && Math.random() < skill.jump;
  return { throttle, steer, boost, jump, drift: Math.abs(delta) > 0.62 && dist < 18, cam: false, reset: false };
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
    if (next.mode !== this.meta.mode || next.teamSize !== this.meta.teamSize) {
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
    pad.radius = pad.radius || (pad.big ? 3.15 : 2.35);
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
  const byTeam = { blue: 0, orange: 0 };
  for (const car of Object.values(state.cars)) {
    const idx = byTeam[car.team]++;
    const spawn = kickoffSpawn(car.team, idx, state.teamSize, state.arena, car.role, car.human);
    car.x = spawn.x; car.y = CAR_GROUND_Y; car.z = spawn.z;
    car.vx = 0; car.vy = 0; car.vz = 0;
    car.yaw = spawn.yaw; car.yawVel = 0; car.pitch = 0; car.roll = 0;
    car.grounded = true; car.onGround = true;
    const baseBoost = car.human ? (initial ? 33 : Math.max(car.boost || 0, 33)) : (initial ? 60 : Math.max(car.boost || 0, 45));
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
      id: p.id, x: round(p.x), z: round(p.z), y: round(p.y || 0), radius: round(p.radius || (p.big ? 3.15 : 2.35)),
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
