import { describe, it, expect } from 'vitest'
import { period, periodCorrected, stepRK4, pendulumBobXY } from './pendulum'
import type { PendulumState, PendulumParams } from './pendulum'

const EARTH: PendulumParams = { length: 1, gravity: 9.81 }
const MOON: PendulumParams  = { length: 1, gravity: 1.62 }
const MARS: PendulumParams  = { length: 1, gravity: 3.72 }

/** Mechanical energy: KE + PE = ½L²ω² + gL(1−cosθ) */
function energy(s: PendulumState, p: PendulumParams): number {
  return 0.5 * p.length ** 2 * s.omega ** 2
    + p.gravity * p.length * (1 - Math.cos(s.theta))
}

/** Run n RK4 steps and return final state */
function simulate(
  init: PendulumState,
  params: PendulumParams,
  dt: number,
  steps: number,
): PendulumState {
  let s = init
  for (let i = 0; i < steps; i++) s = stepRK4(s, params, dt)
  return s
}

// ─── period ──────────────────────────────────────────────────────────────────

describe('period', () => {
  it('matches T = 2π√(L/g) for standard Earth pendulum', () => {
    expect(period(EARTH)).toBeCloseTo(2 * Math.PI * Math.sqrt(1 / 9.81), 10)
  })

  it('Moon pendulum is longer than Earth pendulum (weaker gravity)', () => {
    expect(period(MOON)).toBeGreaterThan(period(EARTH))
  })

  it('Mars period is between Moon and Earth', () => {
    expect(period(MARS)).toBeLessThan(period(MOON))
    expect(period(MARS)).toBeGreaterThan(period(EARTH))
  })

  it('period scales as √L — quadrupling L doubles T', () => {
    const t1 = period(EARTH)
    const t4 = period({ ...EARTH, length: 4 })
    expect(t4 / t1).toBeCloseTo(2, 8)
  })

  it('period scales as 1/√g — quadrupling g halves T', () => {
    const t1 = period(EARTH)
    const t4 = period({ ...EARTH, gravity: EARTH.gravity * 4 })
    expect(t4 / t1).toBeCloseTo(0.5, 8)
  })

  it('always returns a positive value', () => {
    const cases: PendulumParams[] = [EARTH, MOON, MARS,
      { length: 0.1, gravity: 9.81 },
      { length: 10,  gravity: 9.81 },
    ]
    for (const p of cases) expect(period(p)).toBeGreaterThan(0)
  })

  it('result is always finite', () => {
    expect(isFinite(period(EARTH))).toBe(true)
    expect(isFinite(period(MOON))).toBe(true)
  })

  it('inverse: L = g(T/2π)² recovers the original length', () => {
    const T = period(EARTH)
    const recoveredL = EARTH.gravity * (T / (2 * Math.PI)) ** 2
    expect(recoveredL).toBeCloseTo(EARTH.length, 10)
  })
})

// ─── periodCorrected ─────────────────────────────────────────────────────────

describe('periodCorrected', () => {
  it('equals T₀ at zero amplitude', () => {
    expect(periodCorrected(EARTH, 0)).toBeCloseTo(period(EARTH), 10)
  })

  it('is always ≥ the small-angle period', () => {
    const amplitudes = [0.01, 0.1, 0.3, 0.5, 0.8, 1.0, 1.2]
    for (const a of amplitudes) {
      expect(periodCorrected(EARTH, a)).toBeGreaterThanOrEqual(period(EARTH))
    }
  })

  it('monotonically increases with amplitude', () => {
    const amps = [0, 0.1, 0.3, 0.6, 1.0]
    const periods = amps.map(a => periodCorrected(EARTH, a))
    for (let i = 1; i < periods.length; i++) {
      expect(periods[i]).toBeGreaterThanOrEqual(periods[i - 1]!)
    }
  })

  it('is symmetric: correction is the same for ±amplitude (θ² term)', () => {
    const pos = periodCorrected(EARTH, 0.4)
    const neg = periodCorrected(EARTH, -0.4)
    expect(pos).toBeCloseTo(neg, 10)
  })

  it('applies exact Bernoulli factor (1 + θ²/16)', () => {
    const a = 0.6
    expect(periodCorrected(EARTH, a)).toBeCloseTo(period(EARTH) * (1 + a ** 2 / 16), 10)
  })

  it('at small angle (0.01 rad) correction is < 0.01% of T₀', () => {
    const t0 = period(EARTH)
    const tc = periodCorrected(EARTH, 0.01)
    expect((tc - t0) / t0).toBeLessThan(0.0001)
  })

  it('works consistently across different gravity environments', () => {
    for (const params of [EARTH, MOON, MARS]) {
      expect(periodCorrected(params, 0.3)).toBeGreaterThan(period(params))
    }
  })
})

// ─── stepRK4 ─────────────────────────────────────────────────────────────────

describe('stepRK4', () => {

  // --- basic mechanics --------------------------------------------------------

  it('advances time by exactly dt', () => {
    const s: PendulumState = { theta: 0.3, omega: 0, time: 5 }
    expect(stepRK4(s, EARTH, 0.016).time).toBeCloseTo(5.016, 10)
  })

  it('accumulates time correctly over many steps', () => {
    const s = simulate({ theta: 0.3, omega: 0, time: 0 }, EARTH, 0.01, 1000)
    expect(s.time).toBeCloseTo(10, 8)
  })

  it('equilibrium at bottom (θ=0, ω=0) is stable', () => {
    const s = simulate({ theta: 0, omega: 0, time: 0 }, EARTH, 0.016, 500)
    expect(s.theta).toBeCloseTo(0, 12)
    expect(s.omega).toBeCloseTo(0, 12)
  })

  it('released from rest swings back: ω becomes negative for positive θ', () => {
    const next = stepRK4({ theta: 0.5, omega: 0, time: 0 }, EARTH, 0.016)
    expect(next.omega).toBeLessThan(0)
  })

  it('released from negative angle: ω becomes positive', () => {
    const next = stepRK4({ theta: -0.5, omega: 0, time: 0 }, EARTH, 0.016)
    expect(next.omega).toBeGreaterThan(0)
  })

  it('dt = 0 leaves state completely unchanged', () => {
    const s: PendulumState = { theta: 0.4, omega: 1.2, time: 3 }
    const next = stepRK4(s, EARTH, 0)
    expect(next.theta).toBe(s.theta)
    expect(next.omega).toBe(s.omega)
    expect(next.time).toBe(s.time)
  })

  // --- energy conservation (undamped) ----------------------------------------

  it('conserves energy over one full period (small angle)', () => {
    const init: PendulumState = { theta: 0.1, omega: 0, time: 0 }
    const T = period(EARTH)
    const steps = Math.round(T / 0.001)
    const final = simulate(init, EARTH, 0.001, steps)
    expect(energy(final, EARTH)).toBeCloseTo(energy(init, EARTH), 3)
  })

  it('conserves energy over 10 full periods (small angle)', () => {
    const init: PendulumState = { theta: 0.1, omega: 0, time: 0 }
    const T = period(EARTH)
    const steps = Math.round(10 * T / 0.001)
    const final = simulate(init, EARTH, 0.001, steps)
    const drift = Math.abs(energy(final, EARTH) - energy(init, EARTH)) / energy(init, EARTH)
    expect(drift).toBeLessThan(0.001) // < 0.1% drift over 10 periods
  })

  it('conserves energy at large amplitude (π/3)', () => {
    const init: PendulumState = { theta: Math.PI / 3, omega: 0, time: 0 }
    const e0 = energy(init, EARTH)
    const final = simulate(init, EARTH, 0.002, 2000)
    expect(energy(final, EARTH)).toBeCloseTo(e0, 2)
  })

  // --- damping ----------------------------------------------------------------

  it('damping reduces peak speed over time', () => {
    const init: PendulumState = { theta: 0.5, omega: 0, time: 0 }
    const damped: PendulumParams = { ...EARTH, damping: 0.5 }
    const undamped: PendulumParams = { ...EARTH, damping: 0 }
    const sd = simulate(init, damped, 0.016, 200)
    const su = simulate(init, undamped, 0.016, 200)
    expect(Math.abs(sd.omega)).toBeLessThan(Math.abs(su.omega))
  })

  it('energy monotonically decreases with damping', () => {
    const damped: PendulumParams = { ...EARTH, damping: 0.3 }
    let s: PendulumState = { theta: 0.5, omega: 0, time: 0 }
    let prevEnergy = energy(s, EARTH)
    let violations = 0
    for (let i = 0; i < 300; i++) {
      s = stepRK4(s, damped, 0.016)
      const e = energy(s, EARTH)
      if (e > prevEnergy + 1e-10) violations++
      prevEnergy = e
    }
    expect(violations).toBe(0)
  })

  it('heavy damping brings pendulum to rest', () => {
    const heavy: PendulumParams = { ...EARTH, damping: 2 }
    const final = simulate({ theta: 1.0, omega: 0, time: 0 }, heavy, 0.016, 1000)
    expect(Math.abs(final.theta)).toBeLessThan(0.01)
    expect(Math.abs(final.omega)).toBeLessThan(0.01)
  })

  it('zero damping and explicit damping=0 give identical results', () => {
    const init: PendulumState = { theta: 0.4, omega: 0.1, time: 0 }
    const a = simulate(init, { ...EARTH }, 0.01, 100)
    const b = simulate(init, { ...EARTH, damping: 0 }, 0.01, 100)
    expect(a.theta).toBeCloseTo(b.theta, 12)
    expect(a.omega).toBeCloseTo(b.omega, 12)
  })

  // --- symmetry ----------------------------------------------------------------

  it('mirrored initial conditions produce mirrored trajectories', () => {
    const dt = 0.01
    const steps = 150
    const pos = simulate({ theta:  0.4, omega:  0.2, time: 0 }, EARTH, dt, steps)
    const neg = simulate({ theta: -0.4, omega: -0.2, time: 0 }, EARTH, dt, steps)
    expect(pos.theta).toBeCloseTo(-neg.theta, 8)
    expect(pos.omega).toBeCloseTo(-neg.omega, 8)
  })

  it('time-reversal symmetry (undamped): forward then backward returns to start', () => {
    const init: PendulumState = { theta: 0.3, omega: 0, time: 0 }
    const dt = 0.005
    const steps = 200

    // run forward
    let forward = simulate(init, EARTH, dt, steps)
    // reverse omega and run forward again (equivalent to running backward)
    let reversed = simulate(
      { theta: forward.theta, omega: -forward.omega, time: forward.time },
      EARTH, dt, steps,
    )
    expect(reversed.theta).toBeCloseTo(init.theta, 3)
    expect(Math.abs(reversed.omega)).toBeCloseTo(Math.abs(init.omega), 3)
  })

  // --- numerical stability ────────────────────────────────────────────────────

  it('large amplitude (π/2) stays finite over 500 steps', () => {
    const final = simulate({ theta: Math.PI / 2, omega: 0, time: 0 }, EARTH, 0.01, 500)
    expect(isFinite(final.theta)).toBe(true)
    expect(isFinite(final.omega)).toBe(true)
  })

  it('near-inverted position (0.99π) stays finite', () => {
    const final = simulate({ theta: 0.99 * Math.PI, omega: 0, time: 0 }, EARTH, 0.005, 1000)
    expect(isFinite(final.theta)).toBe(true)
    expect(isFinite(final.omega)).toBe(true)
  })

  it('high initial angular velocity stays finite', () => {
    const final = simulate({ theta: 0, omega: 20, time: 0 }, EARTH, 0.005, 500)
    expect(isFinite(final.theta)).toBe(true)
    expect(isFinite(final.omega)).toBe(true)
  })

  it('works correctly under Moon and Mars gravity', () => {
    for (const params of [MOON, MARS]) {
      const final = simulate({ theta: 0.3, omega: 0, time: 0 }, params, 0.01, 200)
      expect(isFinite(final.theta)).toBe(true)
      expect(isFinite(final.omega)).toBe(true)
    }
  })

  // --- period accuracy --------------------------------------------------------

  it('simulated half-period brings theta back near −initial (small angle)', () => {
    // After half a period the bob reaches the opposite extreme (−θ₀, ω≈0)
    const init: PendulumState = { theta: 0.05, omega: 0, time: 0 }
    const halfT = period(EARTH) / 2
    const steps = Math.round(halfT / 0.001)
    const final = simulate(init, EARTH, 0.001, steps)
    expect(final.theta).toBeCloseTo(-init.theta, 2)
    expect(Math.abs(final.omega)).toBeLessThan(0.05)
  })
})

// ─── pendulumBobXY ───────────────────────────────────────────────────────────

describe('pendulumBobXY', () => {

  // --- cardinal positions ─────────────────────────────────────────────────────

  it('θ=0: hangs straight down — directly below pivot', () => {
    const { x, y } = pendulumBobXY(100, 50, 200, 0)
    expect(x).toBeCloseTo(100)
    expect(y).toBeCloseTo(250)
  })

  it('θ=π/2: bob is level with pivot, fully to the right', () => {
    const { x, y } = pendulumBobXY(0, 0, 1, Math.PI / 2)
    expect(x).toBeCloseTo(1, 5)
    expect(y).toBeCloseTo(0, 5)
  })

  it('θ=−π/2: bob is level with pivot, fully to the left', () => {
    const { x, y } = pendulumBobXY(0, 0, 1, -Math.PI / 2)
    expect(x).toBeCloseTo(-1, 5)
    expect(y).toBeCloseTo(0, 5)
  })

  it('θ=π: bob is directly above pivot (inverted)', () => {
    const { x, y } = pendulumBobXY(0, 0, 1, Math.PI)
    expect(x).toBeCloseTo(0, 5)
    expect(y).toBeCloseTo(-1, 5)
  })

  it('θ=2π: full rotation — same position as θ=0', () => {
    const base  = pendulumBobXY(0, 0, 1, 0)
    const full  = pendulumBobXY(0, 0, 1, 2 * Math.PI)
    expect(full.x).toBeCloseTo(base.x, 8)
    expect(full.y).toBeCloseTo(base.y, 8)
  })

  // --- direction ──────────────────────────────────────────────────────────────

  it('positive θ moves bob to the right of pivot', () => {
    expect(pendulumBobXY(0, 0, 1, 0.5).x).toBeGreaterThan(0)
  })

  it('negative θ moves bob to the left of pivot', () => {
    expect(pendulumBobXY(0, 0, 1, -0.5).x).toBeLessThan(0)
  })

  it('bob is always below pivot for |θ| < π/2', () => {
    const angles = [-1.2, -0.5, 0, 0.5, 1.2]
    for (const theta of angles) {
      const { y } = pendulumBobXY(0, 0, 1, theta)
      expect(y).toBeGreaterThan(0)
    }
  })

  // --- invariants ─────────────────────────────────────────────────────────────

  it('bob distance from pivot is always exactly L (all angles)', () => {
    const angles = [0, 0.1, 0.5, 1.0, Math.PI / 2, Math.PI, -0.7, -Math.PI / 3]
    for (const theta of angles) {
      const { x, y } = pendulumBobXY(0, 0, 1, theta)
      expect(Math.sqrt(x * x + y * y)).toBeCloseTo(1, 10)
    }
  })

  it('bob distance scales with L', () => {
    for (const L of [0.5, 1, 2, 10, 100]) {
      const { x, y } = pendulumBobXY(0, 0, L, 0.4)
      expect(Math.sqrt(x * x + y * y)).toBeCloseTo(L, 8)
    }
  })

  it('pivot offset shifts bob by exactly the same amount', () => {
    const base = pendulumBobXY(0, 0, 1, 0.4)
    const shifted = pendulumBobXY(50, 30, 1, 0.4)
    expect(shifted.x - base.x).toBeCloseTo(50, 10)
    expect(shifted.y - base.y).toBeCloseTo(30, 10)
  })

  // --- symmetry ───────────────────────────────────────────────────────────────

  it('left/right symmetry: x(θ) = −x(−θ), y(θ) = y(−θ)', () => {
    const angles = [0.2, 0.6, 1.1, Math.PI / 3]
    for (const theta of angles) {
      const pos = pendulumBobXY(0, 0, 1,  theta)
      const neg = pendulumBobXY(0, 0, 1, -theta)
      expect(pos.x).toBeCloseTo(-neg.x, 10)
      expect(pos.y).toBeCloseTo( neg.y, 10)
    }
  })

  it('zero length: bob always sits at pivot regardless of angle', () => {
    for (const theta of [0, 0.5, Math.PI]) {
      const { x, y } = pendulumBobXY(7, 13, 0, theta)
      expect(x).toBeCloseTo(7, 10)
      expect(y).toBeCloseTo(13, 10)
    }
  })
})
