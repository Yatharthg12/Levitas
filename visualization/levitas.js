const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

let dt = 0.016;

// =======================
// System State
// =======================
let state = {
  x: 0.15,
  y: -0.10,
  vx: 0,
  vy: 0
};

// =======================
// Sensor model (sampled measurement)
// =======================
let sensed = {
  x: state.x,
  y: state.y,
  vx: state.vx,
  vy: state.vy
};

const OBJECT_RADIUS = 8; // pixels
const SENSOR_DT = 0.02; // 50 Hz sensor update
let sensorTimer = 0;

// =======================
// Chamber & Failure
// =======================
let systemFailed = false;

// =======================
// Control Parameters
// =======================
let Kp = 6.0;
let Kd = 2.5;
let gravityEnabled = false;
const GRAVITY = 1.2; // downward acceleration

// =======================
// Physical Actuator Model
// =======================

// Magnetic force constant (tunable)
const MAG_K = 8.0;

// Coil electrical dynamics
const COIL_TIME_CONSTANT = 0.05; // seconds

// Actuator limits
const I_MAX = 3.0;

// Internal coil current states
let Ix = 0;
let Iy = 0;


// =======================
// UI Elements
// =======================
const controlToggle = document.getElementById("controlToggle");
const noiseSlider = document.getElementById("noiseSlider");
const gainSlider = document.getElementById("gainSlider");
const gravityToggle = document.getElementById("gravityToggle");
const resetBtn = document.getElementById("reset2D");

// =======================
// Physics Update
// =======================
function step() {
  if (systemFailed) return;

  let fx = 0;
  let fy = 0;

  if (controlToggle.checked) {
    const gain = gainSlider.value;
    // Desired control current (from controller)
    let Ix_cmd = -gain * (Kp * sensed.x + Kd * sensed.vx);
    let Iy_cmd = -gain * (Kp * sensed.y + Kd * sensed.vy);

    // Gravity feedforward (match 3D behavior)
    if (gravityEnabled) {
      Iy_cmd -= GRAVITY;
    }

    // Actuator saturation
    Ix_cmd = Math.max(-I_MAX, Math.min(I_MAX, Ix_cmd));
    Iy_cmd = Math.max(-I_MAX, Math.min(I_MAX, Iy_cmd));

    // Coil lag (first-order dynamics)
    Ix += (Ix_cmd - Ix) * (dt / COIL_TIME_CONSTANT);
    Iy += (Iy_cmd - Iy) * (dt / COIL_TIME_CONSTANT);

    // Nonlinear magnetic force (inverse-square distance)
    fx = MAG_K * Ix;
    fy = MAG_K * Iy;

  } else {
    fx = 0.6 * state.x + 0.02;
    fy = 0.6 * state.y;
  }

  // Noise / disturbance
  const noise = noiseSlider.value;
  fx += (Math.random() - 0.5) * noise;
  fy += (Math.random() - 0.5) * noise;

  // Integrate
  state.vx += fx * dt;
  state.vy += fy * dt;

  state.x += state.vx * dt;
  state.y += state.vy * dt;

  // Wall collision → failure
  const cx = W / 2 + state.x * 300;
  const cy = H / 2 - state.y * 300;

  // Chamber bounds (must match drawChamber)
  const LEFT   = 150 + OBJECT_RADIUS;
  const RIGHT  = 650 - OBJECT_RADIUS;
  const TOP    = 100 + OBJECT_RADIUS;
  const BOTTOM = 400 - OBJECT_RADIUS;

  if (
    cx < LEFT || cx > RIGHT ||
    cy < TOP  || cy > BOTTOM
  ) {
    systemFailed = true;
  }

  // =======================
  // Sensor sampling update
  // =======================
  sensorTimer += dt;

  if (sensorTimer >= SENSOR_DT) {
    sensed.x = state.x + (Math.random() - 0.5) * noiseSlider.value;
    sensed.y = state.y + (Math.random() - 0.5) * noiseSlider.value;
    sensed.vx = state.vx;
    sensed.vy = state.vy;

    sensorTimer = 0;
  }
}

// =======================
// Drawing
// =======================
function drawChamber() {
  ctx.strokeStyle = "#00bcd4";
  ctx.lineWidth = 2;
  ctx.strokeRect(150, 100, 500, 300);
}

function drawMagnets() {
  ctx.fillStyle = "#ffaa00";
  ctx.fillRect(360, 80, 80, 15);
  ctx.fillRect(360, 415, 80, 15);
  ctx.fillRect(130, 235, 15, 80);
  ctx.fillRect(655, 235, 15, 80);
}

function drawObject() {
  const cx = W / 2 + state.x * 300;
  const cy = H / 2 - state.y * 300;

  ctx.fillStyle = systemFailed ? "#666" : "red";
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  return { cx, cy };
}

function drawForces(cx, cy) {
  if (!controlToggle.checked || systemFailed) return;

  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 2;
  const LINE_SCALE = 60; // Scaling factor for visualization

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(
    cx,
    cy - state.vy * LINE_SCALE
  );
  ctx.stroke();
}

// =======================
// Main Loop
// =======================
function loop() {
  ctx.clearRect(0, 0, W, H);

  step();
  drawChamber();
  drawMagnets();
  const { cx, cy } = drawObject();
  drawForces(cx, cy);

  requestAnimationFrame(loop);
}
loop();

// =======================
// Reset System
// =======================
resetBtn.onclick = () => {
  state.x = 0;
  state.y = 0;
  state.vx = 0.02;
  state.vy = -0.015;
  systemFailed = false;

  Ix = 0;
  Iy = 0;

  sensed.x = state.x;
  sensed.y = state.y;
  sensed.vx = state.vx;
  sensed.vy = state.vy;

  sensorTimer = 0;
};

// =======================
// Gravity Toggle
// =======================
gravityToggle.onchange = e => {
  gravityEnabled = e.target.checked;
};
