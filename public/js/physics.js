export const ROLES = ["goalkeeper", "defence", "midfield", "attack"];

export const MODE_CONFIGS = {
  standard: {
    label: "Standard",
    gravity: -30,
    ballGravity: -26,
    grip: 1.0,
    lateralGrip: 9.2,
    ballDamping: 0.992,
    ballRestitution: 0.74,
    carRestitution: 0.22,
    sizeBonus: 0,
    maxHumans: teamSize => teamSize * 2
  },
  ice: {
    label: "Ice Rink",
    gravity: -28,
    ballGravity: -23,
    grip: 0.62,
    lateralGrip: 3.2,
    ballDamping: 0.997,
    ballRestitution: 0.82,
    carRestitution: 0.16,
    sizeBonus: 3,
    maxHumans: teamSize => teamSize * 2
  },
  snooker: {
    label: "Snooker Cue",
    gravity: -30,
    ballGravity: -25,
    grip: 0.92,
    lateralGrip: 7.8,
    ballDamping: 0.990,
    ballRestitution: 0.68,
    carRestitution: 0.18,
    sizeBonus: 4,
    maxHumans: teamSize => Math.min(teamSize * 2, 6)
  },
  flying: {
    label: "Flying Scoutsman",
    gravity: -11,
    ballGravity: -10,
    grip: 0.86,
    lateralGrip: 7.0,
    ballDamping: 0.996,
    ballRestitution: 0.80,
    carRestitution: 0.20,
    sizeBonus: 13,
    maxHumans: teamSize => Math.min(teamSize * 2, 8)
  }
};

export const DEFAULT_META = {
  mode: "standard",
  teamSize: 1,
  difficulty: "pro",
  playstyle: "balanced",
  status: "waiting",
  matchLength: 300
};

const CAR_RADIUS = 1.7;
const CAR_HALF_LENGTH = 1.85;
const CAR_HEIGHT = 1.3;
const BALL_RADIUS = 1.8;
const GOAL_W_BASE = 18;
const GOAL_H = 7.5;
const GOAL_D = 7.0;
const BOOST_MAX = 100;
const BOOST_PAD_RADIUS = 2.15;
const BOOST_PAD_RESPAWN = 6.0;
const MATCH_TICKS_PER_WRITE = 3;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const len2 = (x, z) => Math.hypot(x, z);
const angleNorm = a => Math.atan2(Math.sin(a), Math.cos(a));
const randBetween = (a, b) => a + Math.random() * (b - a);

export function getArenaSize(mode = "standard", teamSize = 1) {
  const cfg = MODE_CONFIGS[mode] || MODE_CONFIGS.standard;
  const n = clamp(Number(teamSize) || 1, 1, 5);
  // 1v1 is intentionally the same baseline as the V6/V10 arena.
  return {
    w: 60 + (n - 1) * 10 + cfg.sizeBonus,
    l: 100 + (n - 1) * 18 + cfg.sizeBonus * 1.4,
    goalW: GOAL_W_BASE + (n - 1) * 1.9,
    goalH: GOAL_H,
    goalD: GOAL_D
  };
}


function makeBoostPads(arena) {
  const w = arena.w, l = arena.l;
  const raw = [
    { x: -0.40 * w, z: 0, amount: 42 },
    { x:  0.40 * w, z: 0, amount: 42 },
    { x: -0.30 * w, z: -0.34 * l, amount: 42 },
    { x:  0.30 * w, z: -0.34 * l, amount: 42 },
    { x: -0.30 * w, z:  0.34 * l, amount: 42 },
    { x:  0.30 * w, z:  0.34 * l, amount: 42 },
    { x: 0, z: -0.25 * l, amount: 30 },
    { x: 0, z:  0.25 * l, amount: 30 },
    { x: -0.18 * w, z: -0.13 * l, amount: 24 },
    { x:  0.18 * w, z: -0.13 * l, amount: 24 },
    { x: -0.18 * w, z:  0.13 * l, amount: 24 },
    { x:  0.18 * w, z:  0.13 * l, amount: 24 }
  ];
  return raw.map((p, i) => ({
    id: `pad_${i}`,
    x: clamp(p.x, -w / 2 + 5, w / 2 - 5),
    z: clamp(p.z, -l / 2 + 9, l / 2 - 9),
    y: 0.12,
    radius: BOOST_PAD_RADIUS,
    amount: p.amount,
    active: true,
    timer: 0,
    respawn: BOOST_PAD_RESPAWN
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
  return out;
}

export function defaultRoleForSlot(i, teamSize) {
  if (i === 0 && teamSize >= 4) return "goalkeeper";
  if (i <= 1 && teamSize >= 3) return "defence";
  if (i === teamSize - 1) return "attack";
  return i % 3 === 0 ? "attack" : "midfield";
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
      const spawn = kickoffSpawn(team, i, cleanMeta.teamSize, arena);
      cars[id] = makeCar(id, team, role, !!human, human?.name || aiName(team, role, i), spawn.x, spawn.z, spawn.yaw, slotIndex++);
    }
  }
  return {
    version: 1,
    tick: 0,
    timeLeft: cleanMeta.matchLength,
    score: { blue: 0, orange: 0 },
    mode: cleanMeta.mode,
    teamSize: cleanMeta.teamSize,
    arena,
    ball: { x: 0, y: BALL_RADIUS, z: 0, vx: 0, vy: 0, vz: 0, rx: 0, rz: 0 },
    boostPads: makeBoostPads(arena),
    cars,
    goalFlash: null,
    kickoffTimer: 2.0,
    ended: false
  };
}

function aiName(team, role, i) {
  const prefix = team === "blue" ? "Blue" : "Orange";
  const roleName = role === "goalkeeper" ? "GK" : role === "defence" ? "Back" : role === "midfield" ? "Mid" : "Striker";
  return `${prefix} ${roleName} ${i + 1}`;
}

function kickoffSpawn(team, i, teamSize, arena) {
  const sign = team === "blue" ? -1 : 1;
  const laneSets = {
    1: [0],
    2: [-0.22, 0.22],
    3: [-0.34, 0, 0.34],
    4: [-0.42, -0.14, 0.14, 0.42],
    5: [-0.46, -0.22, 0, 0.22, 0.46]
  };
  const lanes = laneSets[clamp(Number(teamSize) || 1, 1, 5)] || laneSets[1];
  const x = (lanes[i] ?? 0) * arena.w;
  const zBase = sign * (arena.l * 0.34 + (i % 2) * 4);
  const yaw = team === "blue" ? 0 : Math.PI;
  return { x, z: zBase, yaw };
}

function makeCar(id, team, role, human, name, x, z, yaw, slotIndex) {
  return {
    id,
    team,
    role,
    human,
    name,
    slotIndex,
    x, y: CAR_RADIUS, z,
    vx: 0, vy: 0, vz: 0,
    yaw,
    yawVel: 0,
    grounded: true,
    boost: 45,
    boosting: false,
    boostPickup: 0,
    jumpLatch: false,
    cueCooldown: 0,
    bumpCooldown: 0,
    lastTouch: null
  };
}

export function inputFromKeys(keys, bind) {
  const pressed = code => !!keys[bind[code]];
  return {
    throttle: (pressed("forward") ? 1 : 0) + (pressed("backward") ? -1 : 0),
    steer: (pressed("right") ? 1 : 0) + (pressed("left") ? -1 : 0),
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

export function makeAIInput(car, state, meta) {
  const difficulty = meta.difficulty || "pro";
  const playstyle = meta.playstyle || "balanced";
  const teamSign = car.team === "blue" ? -1 : 1;
  const enemySign = -teamSign;
  const ownGoalZ = teamSign * (state.arena.l / 2 - 5);
  const enemyGoalZ = enemySign * (state.arena.l / 2 - 8);
  const ball = state.ball;
  let target = { x: ball.x, z: ball.z };
  const ballTowardOwn = Math.sign(ball.vz || 0.001) === teamSign;
  const behindBallZ = ball.z - enemySign * 7;

  if (car.role === "goalkeeper") {
    target = { x: clamp(ball.x * 0.72, -state.arena.goalW * 0.46, state.arena.goalW * 0.46), z: ownGoalZ };
    if (Math.abs(ball.z - ownGoalZ) < state.arena.l * 0.32 || ballTowardOwn) target.z = ball.z - teamSign * 6;
  } else if (car.role === "defence") {
    target = { x: ball.x * 0.65, z: (ball.z + ownGoalZ) * 0.5 };
    if (playstyle === "aggressive" && Math.abs(ball.z) < state.arena.l * 0.22) target = { x: ball.x, z: behindBallZ };
  } else if (car.role === "midfield") {
    target = { x: ball.x * 0.55 + (car.slotIndex % 2 ? 7 : -7), z: ball.z * 0.35 };
    if (playstyle === "defensive") target.z = (ball.z + ownGoalZ) * 0.42;
  } else {
    target = { x: ball.x * 0.95, z: behindBallZ };
    if (playstyle === "defensive") target.z = ball.z - enemySign * 12;
  }

  if (playstyle === "chaotic") {
    target.x += Math.sin(state.tick * 0.035 + car.slotIndex) * 8;
    target.z += Math.cos(state.tick * 0.027 + car.slotIndex * 2) * 6;
  }

  target.x = clamp(target.x, -state.arena.w / 2 + 5, state.arena.w / 2 - 5);
  target.z = clamp(target.z, -state.arena.l / 2 + 5, state.arena.l / 2 - 5);

  const dx = target.x - car.x;
  const dz = target.z - car.z;
  const desiredYaw = Math.atan2(dx, dz);
  const err = angleNorm(desiredYaw - car.yaw);
  const dist = Math.hypot(dx, dz);
  const skill = difficulty === "rookie" ? 0.62 : difficulty === "allstar" ? 1.18 : 0.92;
  const steer = clamp(err * (1.35 + skill * 0.45), -1, 1);
  let throttle = Math.abs(err) > 1.8 ? -0.45 : 1;
  if (dist < 5) throttle *= 0.35;

  const ballDist = Math.hypot(ball.x - car.x, ball.z - car.z);
  const canBoost = difficulty !== "rookie" && dist > 18 && Math.abs(err) < 0.38;
  const jump = difficulty === "allstar" && ballDist < 5 && ball.y > 3.0 && car.grounded;
  return { throttle, steer, boost: canBoost, jump, drift: Math.abs(err) > 0.65 && dist < 18, cam: false, reset: false };
}

export class PhysicsHost {
  constructor(meta, players) {
    this.meta = serialiseMeta(meta);
    this.state = makeInitialState(this.meta, players);
    this.inputs = {};
    this.writeCounter = 0;
  }

  syncMeta(meta, players) {
    const next = serialiseMeta(meta);
    if (next.mode !== this.meta.mode || next.teamSize !== this.meta.teamSize) {
      this.meta = next;
      this.state = makeInitialState(this.meta, players);
      return;
    }
    this.meta = next;
  }

  setInputs(inputs) {
    this.inputs = inputs || {};
  }

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
    if (resetRequested && !this.resetLatch) {
      resetKickoff(state, players);
    }
    this.resetLatch = resetRequested;

    const humanIds = new Set(Object.keys(players));
    for (const car of Object.values(state.cars)) {
      car.human = humanIds.has(car.id);
      if (players[car.id]) {
        car.name = players[car.id].name || car.name;
        car.role = players[car.id].role || car.role;
        car.team = players[car.id].team || car.team;
      }
      const input = car.human ? normaliseInput(this.inputs[car.id]) : makeAIInput(car, state, this.meta);
      if (state.kickoffTimer > 0) {
        updateCar(car, { throttle: 0, steer: 0, boost: false, jump: false, drift: false }, state, cfg, dt);
      } else {
        updateCar(car, input, state, cfg, dt);
      }
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
  const fwd = { x: Math.sin(car.yaw), z: Math.cos(car.yaw) };
  const right = { x: Math.cos(car.yaw), z: -Math.sin(car.yaw) };
  const forwardSpeed = car.vx * fwd.x + car.vz * fwd.z;
  const sideSpeed = car.vx * right.x + car.vz * right.z;
  const speed = Math.hypot(car.vx, car.vz);
  const flying = state.mode === "flying";
  const drift = input.drift && car.grounded;

  const accel = (flying ? 38 : 48) * cfg.grip;
  const reverseAccel = 34 * cfg.grip;
  const brakeAccel = 62 * cfg.grip;
  const maxSpeed = flying ? 39 : 34;
  const boostMaxSpeed = flying ? 53 : 45;
  const reverseMax = 20;

  if (input.throttle > 0.05) {
    car.vx += fwd.x * accel * input.throttle * dt;
    car.vz += fwd.z * accel * input.throttle * dt;
  } else if (input.throttle < -0.05) {
    const braking = forwardSpeed > 3;
    const amount = (braking ? brakeAccel : reverseAccel) * -input.throttle * dt;
    car.vx -= fwd.x * amount;
    car.vz -= fwd.z * amount;
  }

  const boostAllowed = input.boost && car.boost > 0;
  car.boosting = false;
  if (boostAllowed && speed < boostMaxSpeed + 1.5) {
    car.vx += fwd.x * 72 * dt;
    car.vz += fwd.z * 72 * dt;
    if (!car.grounded && flying) car.vy += 11 * dt;
    car.boost = Math.max(0, car.boost - 33 * dt);
    car.boosting = true;
  }

  const steerSpeedFactor = clamp(Math.abs(forwardSpeed) / 17, 0.18, 1.0);
  const reverseSign = forwardSpeed < -1 ? -1 : 1;
  const steerPower = (drift ? 3.55 : 2.55) * steerSpeedFactor;
  car.yawVel += input.steer * steerPower * reverseSign * dt;
  car.yawVel *= Math.pow(drift ? 0.965 : 0.84, dt * 60);
  car.yaw += car.yawVel;

  if (car.grounded) {
    const grip = (drift ? cfg.lateralGrip * 0.23 : cfg.lateralGrip) * dt;
    car.vx -= right.x * sideSpeed * grip;
    car.vz -= right.z * sideSpeed * grip;
    const rollDrag = Math.pow(drift ? 0.993 : 0.985, dt * 60);
    car.vx *= rollDrag;
    car.vz *= rollDrag;
  } else {
    car.vx *= Math.pow(0.996, dt * 60);
    car.vz *= Math.pow(0.996, dt * 60);
  }

  const currentH = Math.hypot(car.vx, car.vz);
  const cap = input.boost && car.boost > 0 ? boostMaxSpeed : (forwardSpeed < -3 ? reverseMax : maxSpeed);
  if (currentH > cap) {
    const s = cap / currentH;
    car.vx *= s; car.vz *= s;
  }

  if (input.jump && !car.jumpLatch && car.grounded) {
    car.vy = flying ? 17 : 13.5;
    car.grounded = false;
  }
  car.jumpLatch = !!input.jump;

  car.vy += cfg.gravity * dt;
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  car.z += car.vz * dt;

  if (car.y < CAR_RADIUS) {
    car.y = CAR_RADIUS;
    if (car.vy < -6) car.bumpCooldown = 0.08;
    car.vy = 0;
    car.grounded = true;
  } else {
    car.grounded = false;
  }

  if (car.y > 28 && !flying) {
    car.y = 28;
    car.vy *= -0.25;
  }

  clampCarToArena(car, arena);
  car.boostPickup = Math.max(0, (car.boostPickup || 0) - dt);
  car.cueCooldown = Math.max(0, car.cueCooldown - dt);
  car.bumpCooldown = Math.max(0, car.bumpCooldown - dt);
}

function clampCarToArena(car, arena) {
  const xLim = arena.w / 2 - CAR_RADIUS;
  const inGoalMouth = Math.abs(car.x) < arena.goalW / 2 - CAR_RADIUS * 0.35;
  const zLim = inGoalMouth ? arena.l / 2 + arena.goalD - CAR_RADIUS : arena.l / 2 - CAR_RADIUS;
  if (Math.abs(car.x) > xLim) {
    car.x = Math.sign(car.x) * xLim;
    car.vx *= -0.18;
  }
  if (Math.abs(car.z) > zLim) {
    car.z = Math.sign(car.z) * zLim;
    car.vz *= -0.18;
  }
}


function updateBoostPads(state, dt) {
  if (!Array.isArray(state.boostPads)) state.boostPads = makeBoostPads(state.arena);
  for (const pad of state.boostPads) {
    pad.radius = pad.radius || BOOST_PAD_RADIUS;
    pad.amount = pad.amount || 34;
    pad.respawn = pad.respawn || BOOST_PAD_RESPAWN;
    if (!pad.active) {
      pad.timer = Math.max(0, (Number(pad.timer) || 0) - dt);
      if (pad.timer <= 0) pad.active = true;
      continue;
    }
    for (const car of Object.values(state.cars || {})) {
      if (Math.abs(car.y - CAR_RADIUS) > 2.4) continue;
      const d = Math.hypot(car.x - pad.x, car.z - pad.z);
      if (d <= CAR_RADIUS + pad.radius) {
        const before = car.boost || 0;
        car.boost = Math.min(BOOST_MAX, before + pad.amount);
        if (car.boost > before) {
          car.boostPickup = 0.16;
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
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const d = Math.hypot(dx, dz) || 0.0001;
      const min = CAR_RADIUS * 2;
      if (d < min && Math.abs(a.y - b.y) < 2.4) {
        const nx = dx / d, nz = dz / d;
        const push = (min - d) * 0.5;
        a.x -= nx * push; a.z -= nz * push;
        b.x += nx * push; b.z += nz * push;
        const av = a.vx * nx + a.vz * nz;
        const bv = b.vx * nx + b.vz * nz;
        const impulse = (bv - av) * 0.45;
        a.vx += nx * impulse; a.vz += nz * impulse;
        b.vx -= nx * impulse; b.vz -= nz * impulse;
      }
    }
  }
}

function updateBall(state, cfg, dt) {
  const b = state.ball;
  const arena = state.arena;
  b.vy += cfg.ballGravity * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.z += b.vz * dt;
  const damp = Math.pow(cfg.ballDamping, dt * 60);
  b.vx *= damp; b.vy *= Math.pow(0.998, dt * 60); b.vz *= damp;

  b.rx += b.vz * dt * 0.9;
  b.rz -= b.vx * dt * 0.9;

  if (b.y < BALL_RADIUS) {
    b.y = BALL_RADIUS;
    if (b.vy < 0) b.vy *= -cfg.ballRestitution;
    b.vx *= Math.pow(0.988, dt * 60);
    b.vz *= Math.pow(0.988, dt * 60);
  }
  if (b.y > 34) {
    b.y = 34;
    b.vy *= -0.5;
  }

  const xLim = arena.w / 2 - BALL_RADIUS;
  if (Math.abs(b.x) > xLim) {
    b.x = Math.sign(b.x) * xLim;
    b.vx *= -0.82;
  }

  const inMouth = Math.abs(b.x) < arena.goalW / 2 - BALL_RADIUS * 0.7 && b.y < arena.goalH - BALL_RADIUS * 0.25;
  const zLim = (inMouth ? arena.l / 2 + arena.goalD : arena.l / 2) - BALL_RADIUS;
  if (Math.abs(b.z) > zLim) {
    b.z = Math.sign(b.z) * zLim;
    b.vz *= -0.82;
  }

  const maxBallSpeed = state.mode === "flying" ? 62 : 56;
  const hs = Math.hypot(b.vx, b.vz);
  if (hs > maxBallSpeed) {
    const s = maxBallSpeed / hs;
    b.vx *= s; b.vz *= s;
  }
}

function resolveBallHits(state, cfg, dt, mode) {
  const b = state.ball;
  for (const car of Object.values(state.cars)) {
    if (mode === "snooker") {
      resolveCueHit(car, b, state);
      continue;
    }
    const dx = b.x - car.x;
    const dy = b.y - (car.y + 0.25);
    const dz = b.z - car.z;
    const dist = Math.hypot(dx, dy, dz) || 0.0001;
    const min = BALL_RADIUS + CAR_RADIUS;
    if (dist < min) {
      const nx = dx / dist, ny = dy / dist, nz = dz / dist;
      const push = min - dist;
      b.x += nx * push;
      b.y += ny * push;
      b.z += nz * push;
      const relX = b.vx - car.vx, relY = b.vy - car.vy, relZ = b.vz - car.vz;
      const rel = relX * nx + relY * ny + relZ * nz;
      const carSpeed = Math.hypot(car.vx, car.vz);
      const impulse = Math.max(0, -rel * 0.75 + carSpeed * 0.62 + 7.5);
      b.vx += nx * impulse;
      b.vy += Math.max(2.0, impulse * 0.18) + (car.y - CAR_RADIUS) * 0.16;
      b.vz += nz * impulse;
      car.lastTouch = state.tick;
    }
  }
}

function resolveCueHit(car, b, state) {
  const fwd = { x: Math.sin(car.yaw), z: Math.cos(car.yaw) };
  const cueLen = 3.8;
  const tip = { x: car.x + fwd.x * cueLen, y: car.y + 0.55, z: car.z + fwd.z * cueLen };
  const dx = b.x - tip.x;
  const dy = b.y - tip.y;
  const dz = b.z - tip.z;
  const dist = Math.hypot(dx, dy, dz) || 0.0001;
  const min = BALL_RADIUS + 0.72;
  if (dist < min) {
    const nx = dx / dist, ny = dy / dist, nz = dz / dist;
    b.x += nx * (min - dist);
    b.y += ny * (min - dist);
    b.z += nz * (min - dist);
    const forwardCue = Math.max(2, car.vx * fwd.x + car.vz * fwd.z);
    const impulse = 9 + Math.abs(forwardCue) * 1.2;
    b.vx += nx * impulse + fwd.x * impulse * 0.35;
    b.vy += Math.max(1.2, impulse * 0.08);
    b.vz += nz * impulse + fwd.z * impulse * 0.35;
    car.cueCooldown = 0.22;
    car.lastTouch = state.tick;
  }
}

function resolveGoals(state, players) {
  const b = state.ball;
  const arena = state.arena;
  const scoredBlue = b.z > arena.l / 2 + 0.8;
  const scoredOrange = b.z < -arena.l / 2 - 0.8;
  if (!scoredBlue && !scoredOrange) return;
  const team = scoredBlue ? "blue" : "orange";
  state.score[team] += 1;
  state.goalFlash = { team, tick: state.tick };
  resetKickoff(state, players);
}

function resetKickoff(state, players) {
  state.ball.x = 0; state.ball.y = BALL_RADIUS; state.ball.z = 0;
  state.ball.vx = 0; state.ball.vy = 0; state.ball.vz = 0;
  state.kickoffTimer = 2.0;
  const byTeam = { blue: 0, orange: 0 };
  for (const car of Object.values(state.cars)) {
    const idx = byTeam[car.team]++;
    const spawn = kickoffSpawn(car.team, idx, state.teamSize, state.arena);
    car.x = spawn.x; car.y = CAR_RADIUS; car.z = spawn.z;
    car.vx = 0; car.vy = 0; car.vz = 0;
    car.yaw = spawn.yaw; car.yawVel = 0;
    car.grounded = true; car.boost = Math.min(BOOST_MAX, Math.max(car.boost || 0, 33)); car.boosting = false; car.boostPickup = 0;
  }
}

export function compactState(state) {
  const round = n => Math.round(n * 1000) / 1000;
  const cars = {};
  for (const [id, c] of Object.entries(state.cars)) {
    cars[id] = {
      id: c.id, team: c.team, role: c.role, human: c.human, name: c.name,
      x: round(c.x), y: round(c.y), z: round(c.z),
      vx: round(c.vx), vy: round(c.vy), vz: round(c.vz),
      yaw: round(c.yaw), yawVel: round(c.yawVel), grounded: c.grounded,
      boost: Math.round(c.boost), boosting: !!c.boosting, boostPickup: round(c.boostPickup || 0), cueCooldown: round(c.cueCooldown), slotIndex: c.slotIndex
    };
  }
  return {
    version: state.version,
    tick: state.tick,
    timeLeft: round(state.timeLeft),
    score: state.score,
    mode: state.mode,
    teamSize: state.teamSize,
    arena: state.arena,
    ball: {
      x: round(state.ball.x), y: round(state.ball.y), z: round(state.ball.z),
      vx: round(state.ball.vx), vy: round(state.ball.vy), vz: round(state.ball.vz),
      rx: round(state.ball.rx), rz: round(state.ball.rz)
    },
    boostPads: (state.boostPads || []).map(p => ({
      id: p.id, x: round(p.x), z: round(p.z), y: round(p.y || 0.12), radius: round(p.radius || BOOST_PAD_RADIUS),
      amount: p.amount || 34, active: p.active !== false, timer: round(p.timer || 0), respawn: p.respawn || BOOST_PAD_RESPAWN
    })),
    cars,
    goalFlash: state.goalFlash,
    kickoffTimer: round(state.kickoffTimer),
    ended: state.ended
  };
}

export const VISUAL_CONSTANTS = { CAR_RADIUS, CAR_HALF_LENGTH, CAR_HEIGHT, BALL_RADIUS, GOAL_H, GOAL_D };
