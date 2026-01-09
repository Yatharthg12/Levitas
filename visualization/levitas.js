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
// Chamber & Failure
// =======================
const CHAMBER_LIMIT = 180; // pixels
let systemFailed = false;

// =======================
// Control Parameters
// =======================
let Kp = 6.0;
let Kd = 2.5;
let gravityEnabled = false;
const GRAVITY = 1.2; // downward acceleration

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
    fx = -gain * (Kp * state.x + Kd * state.vx);
    fy = -gain * (Kp * state.y + Kd * state.vy) - (gravityEnabled ? GRAVITY : 0);
  } else {
    // Inherent instability when control is OFF
    fx = 0.6 * state.x;
    fy = 0.6 * state.y;
  }

  // Gravity (true vertical axis)
  if (gravityEnabled) {
    fy += GRAVITY;
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
  if (
    Math.abs(state.x * 300) > CHAMBER_LIMIT ||
    Math.abs(state.y * 300) > CHAMBER_LIMIT
  ) {
    systemFailed = true;
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
  const cy = H / 2 + state.y * 300;

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
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - state.x * 200, cy - state.y * 200);
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
};

// =======================
// Gravity Toggle
// =======================
gravityToggle.onchange = e => {
  gravityEnabled = e.target.checked;
};
