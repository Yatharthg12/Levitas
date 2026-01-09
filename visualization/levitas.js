const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

// =======================
// Physical interpretation
// =======================
// Red circle = levitated object
// Square = magnetic chamber
// Forces = active electromagnetic centering

let dt = 0.016;

// Object state (meters, simplified)
let state = {
  x: 0.15,   // horizontal offset
  y: -0.10,  // vertical offset
  vx: 0,
  vy: 0
};

// Control gains (visual LQR-style)
let Kp = 6.0;
let Kd = 2.5;

// UI
const controlToggle = document.getElementById("controlToggle");
const noiseSlider = document.getElementById("noiseSlider");
const gainSlider = document.getElementById("gainSlider");


// =======================
// Physics update
// =======================
function step() {
  let fx = 0;
  let fy = 0;

  if (controlToggle.checked) {
    // Active magnetic centering forces
    const gain = gainSlider.value;
    fx = -gain * (Kp * state.x + Kd * state.vx);
    fy = -gain * (Kp * state.y + Kd * state.vy);
  }

  // Integrate motion
  state.vx += fx * dt;
  state.vy += fy * dt;

  state.x += state.vx * dt;
  state.y += state.vy * dt;

  // Noise / disturbance
  const noise = noiseSlider.value;
  state.x += (Math.random() - 0.5) * noise;
  state.y += (Math.random() - 0.5) * noise;
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

  // Top
  ctx.fillRect(360, 80, 80, 15);
  // Bottom
  ctx.fillRect(360, 415, 80, 15);
  // Left
  ctx.fillRect(130, 235, 15, 80);
  // Right
  ctx.fillRect(655, 235, 15, 80);
}

function drawObject() {
  const cx = W / 2 + state.x * 300;
  const cy = H / 2 + state.y * 300;

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  return { cx, cy };
}

function drawForces(cx, cy) {
  if (!controlToggle.checked) return;

  ctx.strokeStyle = "#ff4444";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx - state.x * 200, cy - state.y * 200);
  ctx.stroke();
}

// =======================
// Main loop
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
