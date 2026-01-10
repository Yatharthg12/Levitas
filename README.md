# LEVITAS — Active Magnetic Containment via Feedback Control

LEVITAS(LEVITation via Active Stabilization) is an interactive, web-based simulation demonstrating **contactless containment and stabilization of a magnetically responsive object using actively controlled electromagnets**.

The project focuses on **control physics**, not visual spectacle — showing why passive magnetic systems are unstable and how real-world levitation requires continuous feedback, sensing, and actuation.

---

## Core Concept

Static magnetic fields cannot stably levitate or contain an object (Earnshaw’s Theorem).  
LEVITAS demonstrates how **active electromagnetic control** overcomes this limitation by continuously adjusting forces based on sensed object motion.

The simulation models a **Magnetically Levitated Processing Chamber (MLPC)** — a conceptual environment for contactless handling in precision manufacturing, metrology, and sensitive instrumentation.

---

## What the Simulation Demonstrates

- Passive magnetic instability (control OFF)
- Active stabilization using feedback control (control ON)
- Effect of control gain on stability and oscillation
- Effect of disturbances (noise)
- Gravity and gravity compensation
- Actuator saturation and control limits
- Sensor noise and sampling delay
- Failure before physical contact (loss of containment)

Both **2D and 3D views** are driven by the same physical principles and control logic.

---

## Physics & Control Model (High-Level)

- **Payload**: Lumped point mass
- **Actuation**: Control-linearized electromagnetic force
- **Controller**: PD feedback with optional gravity feedforward
- **Gravity**: Explicit external force, toggleable
- **Sensors**: Discrete-time sampling with noise
- **Actuators**: Saturation limits and first-order coil dynamics
- **Failure Condition**: Loss of containment before contact

The goal is **behavioral fidelity**, not electromagnetic field accuracy.

---

## Why This Matters

Ultra-precision systems (semiconductors, quantum hardware, medical implants) suffer from:
- Mechanical contact
- Vibrations
- Wear and contamination

LEVITAS shows how **actively stabilized magnetic containment** could enable:
- Contactless handling
- Vibration-free environments
- Improved yield and longevity

---

## Intended Audience

- Control systems students
- Robotics & mechatronics researchers
- Applied physics / EM enthusiasts
- Faculty evaluating project or thesis ideas
- Engineers exploring digital twins

---

## Assumptions & Limitations

This simulation intentionally abstracts:
- Detailed electromagnetic field distributions
- Thermal effects and hysteresis
- Structural resonances
- Material nonlinearities

It should be interpreted as a **control-faithful digital twin**, not a hardware design tool.

---

## How to Use

1. Open `index.html` in a browser (or via Live Server)
2. Toggle **Control Active** to observe stabilization
3. Adjust **Gain** and **Noise**
4. Enable **Gravity** to see compensation behavior
5. Turn control OFF to observe instability
6. Switch to **3D View** for spatial intuition

OR 

View the deployed project version: https://yatharthg12.github.io/Levitas/visualization/index.html

---

## Project Status

✔ Physics model complete  
✔ Control logic stable  
✔ Failure modes validated  
✔ Visualization aligned with physics  

This repository represents **LEVITAS v1.0** — a complete conceptual and educational simulation.

---

## Author

**Yatharth Garg**

Developed as part of an exploration into active stabilization, control theory, and contactless precision systems.

---

## License

The project is open-source and free to study and modify. Note that use is permitted only for academic and research purposes.
