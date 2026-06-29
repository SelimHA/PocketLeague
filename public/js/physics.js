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
    drive: 0.82, brake: 0.58, reverse: 0.72, steer: 0.84, grip: 0.28, driftGrip: 0.22, driftTurn: 1.18,
    ballFriction: 0.36, ballRestitution: 1.08, wallRestitution: 1.10, ballMax: 0.96,
    gravity: 1, ballGravity: 1, jump: 1, aerialDrive: 1,
    floorRoughness: 0.20, floorMetalness: 0.18,
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

export const DEFAULT_META = {
  mode: "standard",
  teamSize: 1,
  difficulty: "pro",
  playstyle: "balanced",
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
const BALL_MAX_SPEED = 58;
const BALL_GRAVITY = 36;
const BALL_RESTITUTION = 0.72;
const WALL_RESTITUTION = 0.78;

const CAR_HALF_X = 1.35;
const CAR_HALF_Y = 0.58;
const CAR_HALF_Z = 2.25;
const CAR_RADIUS = 2.35;
const CAR_GROUND_Y = CAR_HALF_Y + 0.08;
const GRAVITY = 44;
const BOOST_MAX = 100;
const MATCH_TICKS_PER_WRITE = 4;

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
  return out;
}

export function defaultRoleForSlot(i, teamSize) {
  if (teamSize <= 1) return "attack";
  if (i === 0) return teamSize >= 2 ? "goalkeeper" : "attack";
  if (teamSize >= 4 && i === 1) return "defence";
  if (i === teamSize - 1) return "attack";
  return "midfield";
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
      cars[id] = makeCar(id, team, role, !!human, human?.name || aiName(team, role, i), spawn.x, spawn.z, spawn.yaw, slotIndex++);
    }
  }
  return {
    version: 2,
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
    kickoffTimer: 1.35,
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

function makeCar(id, team, role, human, name, x, z, yaw, slotIndex) {
  return {
    id, team, role, human, name, slotIndex,
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
    justJumped: false,
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

  car.boosting = false;
  car.drifting = false;

  if (car.grounded) {
    let driveAcc = 0;
    const maxForward = (wantsBoost ? 50 : 35) * (state.mode === "ice" ? 1.05 : 1);
    const maxReverse = 16 * cfg.reverse;
    const accel = 56 * cfg.drive;
    const brake = 92 * cfg.brake;
    const reverseAccel = 28 * cfg.reverse;

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
      car.boost = Math.max(0, car.boost - (state.mode === "flying" ? 26 : 33) * dt);
      car.vx += fwd.x * 62 * cfg.drive * dt;
      car.vz += fwd.z * 62 * cfg.drive * dt;
    }

    const driftActive = handbrake && speed > 7.0;
    car.drifting = driftActive;
    const normalGrip = 18.0 * cfg.grip;
    const driftGrip = 2.25 * cfg.driftGrip;
    const grip = driftActive ? driftGrip : normalGrip;
    car.vx += right.x * (-sideSpeed * grip * dt);
    car.vz += right.z * (-sideSpeed * grip * dt);

    if (driftActive && Math.abs(steer) > 0.05) {
      const slideAssist = -steer * Math.sign(forwardSpeed || 1) * clamp(speed / 34, 0, 1) * 8.0;
      car.vx += right.x * slideAssist * dt;
      car.vz += right.z * slideAssist * dt;
    }

    const coastDrag = state.mode === "ice" ? 0.991 : 0.982;
    if (Math.abs(throttle) < 0.05 && Math.abs(forwardSpeed) < 4 && !driftActive) {
      car.vx += fwd.x * (-forwardSpeed * 5.5 * cfg.brake * dt);
      car.vz += fwd.z * (-forwardSpeed * 5.5 * cfg.brake * dt);
    } else if (Math.abs(throttle) < 0.05) {
      const d = Math.pow(coastDrag, dt * 120);
      car.vx *= d; car.vz *= d;
    }

    const sign = forwardSpeed >= -1 ? 1 : -1;
    const speedFactor = clamp(speed / 24, 0.45, 1);
    const baseTurn = (driftActive ? 5.35 * cfg.driftTurn : 2.9) * cfg.steer * speedFactor;
    const targetYawVel = steer * sign * baseTurn;
    const yawSharpness = driftActive ? (state.mode === "ice" ? 2.3 : 3.3) : 9.0;
    car.yawVel = smooth(car.yawVel, targetYawVel, yawSharpness, dt);
    car.yaw += car.yawVel * dt;
    if (!driftActive) car.yawVel *= Math.pow(0.78, dt * 120);

    const newSpeed = Math.hypot(car.vx, car.vz);
    const maxSpeed = wantsBoost ? 53 : (forwardSpeed < -1 ? 18 * cfg.reverse : 37 * (state.mode === "ice" ? 1.04 : 1));
    if (newSpeed > maxSpeed) {
      const s = maxSpeed / newSpeed;
      car.vx *= s; car.vz *= s;
    }

    if (jump && !car.jumpLatch && car.jumpCooldown <= 0) {
      car.grounded = false;
      car.onGround = false;
      car.vy = (state.mode === "ice" ? 17.4 : 18.5) * cfg.jump;
      car.jumpCooldown = 0.22;
      car.justJumped = true;
    }
  } else {
    car.yaw += steer * 1.55 * cfg.steer * dt;
    if (Math.abs(throttle) > 0.001) {
      car.vx += fwd.x * throttle * 11 * cfg.drive * cfg.aerialDrive * dt;
      car.vz += fwd.z * throttle * 11 * cfg.drive * cfg.aerialDrive * dt;
    }
    if (wantsBoost) {
      car.boosting = true;
      car.boost = Math.max(0, car.boost - 26 * dt);
      car.vx += fwd.x * 48 * cfg.drive * dt;
      car.vz += fwd.z * 48 * cfg.drive * dt;
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
        a.vx += nx * impulse; a.vz += nz * impulse;
        b.vx -= nx * impulse; b.vz -= nz * impulse;
        a.bumpCooldown = b.bumpCooldown = 0.1;
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
    if (b.vy < -1.2) b.vy *= -ballRestitution;
    else b.vy = 0;
    const groundFriction = 1 - (1 - 0.988) * cfg.ballFriction;
    const d = Math.pow(groundFriction, dt * 120);
    b.vx *= d; b.vz *= d;
  }

  const ceilingH = arena.ceilingH || (state.mode === "flying" ? CEILING_H_FLYING : CEILING_H_STANDARD);
  if (b.y > ceilingH - BALL_RADIUS) {
    b.y = ceilingH - BALL_RADIUS;
    if (b.vy > 0) b.vy *= -0.62;
  }

  const sideLim = arena.w / 2 - BALL_RADIUS;
  if (Math.abs(b.x) > sideLim) {
    b.x = Math.sign(b.x) * sideLim;
    b.vx *= -wallRestitution;
    b.vz *= 0.985;
  }

  const mouthX = Math.abs(b.x) < arena.goalW / 2 - BALL_RADIUS * 0.45;
  const mouthY = b.y < arena.goalH - BALL_RADIUS * 0.35;
  const goalOpen = mouthX && mouthY;
  const zLim = goalOpen ? arena.l / 2 + arena.goalD - BALL_RADIUS : arena.l / 2 - BALL_RADIUS;
  if (Math.abs(b.z) > zLim) {
    b.z = Math.sign(b.z) * zLim;
    b.vz *= -wallRestitution;
    b.vx *= 0.985;
  }

  // Goal side and roof collisions inside the goal volume.
  if (Math.abs(b.z) > arena.l / 2 - BALL_RADIUS && Math.abs(b.z) < arena.l / 2 + arena.goalD) {
    const netXLim = arena.goalW / 2 - BALL_RADIUS;
    if (Math.abs(b.x) > netXLim) {
      b.x = Math.sign(b.x) * netXLim;
      b.vx *= -0.72;
    }
    if (b.y > arena.goalH - BALL_RADIUS) {
      b.y = arena.goalH - BALL_RADIUS;
      if (b.vy > 0) b.vy *= -0.62;
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
  const impulse = (Math.max(0, closing * 1.25) + 2.6 + speed * 0.24 + lineUpBonus) * cueSweetSpot;
  b.vx += nx * impulse + fwd.x * clamp(frontness, 0, 1) * (2.0 + speed * 0.035);
  b.vy += ny * impulse + clamp((1 - Math.abs(ny)) * 0.55, 0.15, 1.0);
  b.vz += nz * impulse + fwd.z * clamp(frontness, 0, 1) * (2.0 + speed * 0.035);
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const bs = Math.hypot(b.vx, b.vy, b.vz);
  if (bs > maxBallSpeed) { const s = maxBallSpeed / bs; b.vx *= s; b.vy *= s; b.vz *= s; }
  car.vx -= nx * Math.min(4.5, impulse * 0.045);
  car.vz -= nz * Math.min(4.5, impulse * 0.045);
  car.cueCooldown = 0.22;
  car.lastTouch = state.tick;
}

function resolveCarBallOBB(car, b, state, cfg) {
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
  const frontBonus = clamp(fwd.x * nx + fwd.z * nz, -0.2, 1) * 5.5;
  const jumpBonus = car.justJumped ? 7.0 : 0;
  const impulse = Math.max(0, closing * 1.18) + 4.4 + speed * 0.34 + frontBonus + jumpBonus;
  b.vx += nx * impulse;
  b.vy += ny * impulse;
  b.vz += nz * impulse;
  if (ny < 0.25) b.vy += clamp(speed * 0.12 + (car.justJumped ? 5.2 : 2.2), 1.5, 7.5);
  if (car.boosting) { b.vx += fwd.x * 5.4; b.vz += fwd.z * 5.4; }
  const maxBallSpeed = BALL_MAX_SPEED * cfg.ballMax;
  const bs = Math.hypot(b.vx, b.vy, b.vz);
  if (bs > maxBallSpeed) { const s = maxBallSpeed / bs; b.vx *= s; b.vy *= s; b.vz *= s; }
  car.vx -= nx * Math.min(7, impulse * 0.085);
  car.vy -= ny * Math.min(7, impulse * 0.085);
  car.vz -= nz * Math.min(7, impulse * 0.085);
  car.lastTouch = state.tick;
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
  resetKickoff(state, players, false);
}

function resetKickoff(state, players, initial = false) {
  state.ball.x = 0; state.ball.y = BALL_RADIUS; state.ball.z = 0;
  state.ball.vx = 0; state.ball.vy = 0; state.ball.vz = 0; state.ball.rx = 0; state.ball.rz = 0;
  state.kickoffTimer = 1.35;
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
    car.boosting = false; car.drifting = false; car.boostPickup = 0; car.jumpCooldown = 0; car.jumpLatch = false; car.justJumped = false;
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
      id: c.id, team: c.team, role: c.role, human: c.human, name: c.name,
      x: round(c.x), y: round(c.y), z: round(c.z),
      vx: round(c.vx), vy: round(c.vy), vz: round(c.vz),
      yaw: round(c.yaw), yawVel: round(c.yawVel), pitch: round(c.pitch || 0), roll: round(c.roll || 0), grounded: !!c.grounded,
      boost: Math.round(c.boost), boosting: !!c.boosting, drifting: !!c.drifting,
      boostPickup: round(c.boostPickup || 0), cueCooldown: round(c.cueCooldown || 0), bumpCooldown: round(c.bumpCooldown || 0), slotIndex: c.slotIndex
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
      id: p.id, x: round(p.x), z: round(p.z), y: round(p.y || 0), radius: round(p.radius || (p.big ? 3.15 : 2.35)),
      amount: p.amount || (p.big ? 100 : 36), big: !!p.big, active: p.active !== false, timer: round(p.timer || 0), respawn: p.respawn || (p.big ? 10 : 5)
    })),
    cars,
    goalFlash: state.goalFlash,
    kickoffTimer: round(state.kickoffTimer),
    ended: state.ended
  };
}

export const VISUAL_CONSTANTS = {
  CAR_RADIUS, CAR_HALF_LENGTH: CAR_HALF_Z, CAR_HEIGHT: CAR_HALF_Y * 2,
  CAR_GROUND_Y, CAR_HALF_X, CAR_HALF_Y, CAR_HALF_Z,
  BALL_RADIUS, GOAL_H, GOAL_D
};
