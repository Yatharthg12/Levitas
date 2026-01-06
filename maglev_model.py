import numpy as np

# -----------------------------
# Physical constants
# -----------------------------

g = 9.81          # gravitational acceleration (m/s^2)
m = 0.05          # mass of levitated object (kg)
k = 1e-5          # magnetic force constant (N·m^2/A^2)

# -----------------------------
# Control parameters
# -----------------------------

x_ref = 0.02      # desired levitation height (m)
i0 = 1.5          # nominal coil current (A)

Kp = 120.0        # proportional gain
Kd = 8.0          # derivative gain

# -----------------------------
# System dynamics
# -----------------------------

def magnetic_force(x, i):
    """
    Computes magnetic force based on distance and current.

    Parameters:
        x (float): distance from electromagnet (m)
        i (float): coil current (A)

    Returns:
        float: magnetic force (N)
    """
    return k * (i ** 2) / (x ** 2)


def pd_controller(x, x_dot):
    """
    Proportional-Derivative controller.

    Parameters:
        x (float): current position (m)
        x_dot (float): current velocity (m/s)

    Returns:
        float: control input u (A)
    """
    error = x_ref - x
    u = Kp * error - Kd * x_dot
    return u


def maglev_dynamics(state, dt):
    """
    Computes next state using Euler integration.

    Parameters:
        state (ndarray): [position, velocity]
        dt (float): timestep (s)

    Returns:
        ndarray: updated state
    """
    x, x_dot = state

    # Control input
    u = pd_controller(x, x_dot)
    i = i0 + u

    # Prevent negative or zero current
    i = max(i, 0.0)

    # Magnetic force
    Fm = magnetic_force(x, i)

    # Acceleration
    x_ddot = (Fm / m) - g

    # Euler integration
    x_dot_next = x_dot + x_ddot * dt
    x_next = x + x_dot_next * dt

    return np.array([x_next, x_dot_next])
