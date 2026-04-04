/**
 * Simple pendulum physics
 *
 * For small angles (θ < ~15°) the motion is approximately simple harmonic.
 * For larger angles we use the full nonlinear ODE via RK4.
 */

export interface PendulumState {
  /** Angle from vertical in radians */
  theta: number
  /** Angular velocity in rad/s */
  omega: number
  /** Time elapsed in seconds */
  time: number
}

export interface PendulumParams {
  /** Pendulum length in metres */
  length: number
  /** Gravitational acceleration in m/s² */
  gravity: number
  /** Damping coefficient (0 = undamped) */
  damping?: number
}

/**
 * Period of a simple pendulum (small-angle approximation)
 * T = 2π √(L/g)
 */
export function period(params: Pick<PendulumParams, 'length' | 'gravity'>): number {
  return 2 * Math.PI * Math.sqrt(params.length / params.gravity)
}

/**
 * Period with the Bernoulli correction for larger amplitudes
 * T ≈ T₀ (1 + θ₀²/16)
 */
export function periodCorrected(
  params: Pick<PendulumParams, 'length' | 'gravity'>,
  amplitudeRad: number,
): number {
  const t0 = period(params)
  return t0 * (1 + (amplitudeRad * amplitudeRad) / 16)
}

/**
 * Advance the pendulum state by dt seconds using RK4 integration.
 */
export function stepRK4(
  state: PendulumState,
  params: PendulumParams,
  dt: number,
): PendulumState {
  const { length, gravity, damping = 0 } = params

  const deriv = (theta: number, omega: number) => ({
    dTheta: omega,
    dOmega: -(gravity / length) * Math.sin(theta) - damping * omega,
  })

  const k1 = deriv(state.theta, state.omega)
  const k2 = deriv(state.theta + (dt / 2) * k1.dTheta, state.omega + (dt / 2) * k1.dOmega)
  const k3 = deriv(state.theta + (dt / 2) * k2.dTheta, state.omega + (dt / 2) * k2.dOmega)
  const k4 = deriv(state.theta + dt * k3.dTheta, state.omega + dt * k3.dOmega)

  return {
    theta: state.theta + (dt / 6) * (k1.dTheta + 2 * k2.dTheta + 2 * k3.dTheta + k4.dTheta),
    omega: state.omega + (dt / 6) * (k1.dOmega + 2 * k2.dOmega + 2 * k3.dOmega + k4.dOmega),
    time: state.time + dt,
  }
}

/**
 * Convert polar (pivot + length + angle) to SVG cartesian coordinates.
 * Angle is measured from vertical (0 = straight down).
 */
export function pendulumBobXY(
  pivotX: number,
  pivotY: number,
  length: number,
  theta: number,
): { x: number; y: number } {
  return {
    x: pivotX + length * Math.sin(theta),
    y: pivotY + length * Math.cos(theta),
  }
}
