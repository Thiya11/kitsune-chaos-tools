import { describe, it, expect } from 'vitest'
import { solveOhms, sigFigs, formatSI } from './ohms'

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Verify a result has no NaN or Infinity */
function assertFiniteResult(r: ReturnType<typeof solveOhms>) {
  expect(isFinite(r.voltage)).toBe(true)
  expect(isFinite(r.current)).toBe(true)
  expect(isFinite(r.resistance)).toBe(true)
  expect(isFinite(r.power)).toBe(true)
}

// ─── solveOhms ───────────────────────────────────────────────────────────────

describe('solveOhms', () => {

  // --- solveV -----------------------------------------------------------------

  describe('solveV — V = I × R', () => {
    it('computes voltage correctly', () => {
      const r = solveOhms({ kind: 'solveV', current: 2, resistance: 5 })
      expect(r.voltage).toBe(10)
    })

    it('computes power as V × I', () => {
      const r = solveOhms({ kind: 'solveV', current: 2, resistance: 5 })
      expect(r.power).toBe(20)
    })

    it('passthrough: input values are echoed unchanged', () => {
      const r = solveOhms({ kind: 'solveV', current: 2, resistance: 5 })
      expect(r.current).toBe(2)
      expect(r.resistance).toBe(5)
    })

    it('zero current → zero voltage and zero power', () => {
      const r = solveOhms({ kind: 'solveV', current: 0, resistance: 100 })
      expect(r.voltage).toBe(0)
      expect(r.power).toBe(0)
    })

    it('zero resistance → zero voltage', () => {
      const r = solveOhms({ kind: 'solveV', current: 5, resistance: 0 })
      expect(r.voltage).toBe(0)
      expect(r.power).toBe(0)
    })

    it('fractional values: 0.5A × 0.5Ω = 0.25V', () => {
      const r = solveOhms({ kind: 'solveV', current: 0.5, resistance: 0.5 })
      expect(r.voltage).toBeCloseTo(0.25)
    })

    it('large values: 10A × 1MΩ = 10MV', () => {
      const r = solveOhms({ kind: 'solveV', current: 10, resistance: 1_000_000 })
      expect(r.voltage).toBe(10_000_000)
    })

    it('microamp scale: 50μA × 100kΩ = 5V', () => {
      const r = solveOhms({ kind: 'solveV', current: 50e-6, resistance: 100e3 })
      expect(r.voltage).toBeCloseTo(5)
    })

    it('power equals V² / R (alternate formula)', () => {
      const r = solveOhms({ kind: 'solveV', current: 3, resistance: 4 })
      expect(r.power).toBeCloseTo(r.voltage ** 2 / r.resistance)
    })

    it('power equals I² × R (alternate formula)', () => {
      const r = solveOhms({ kind: 'solveV', current: 3, resistance: 4 })
      expect(r.power).toBeCloseTo(r.current ** 2 * r.resistance)
    })

    it('all results are finite numbers for typical inputs', () => {
      assertFiniteResult(solveOhms({ kind: 'solveV', current: 0.002, resistance: 4700 }))
    })
  })

  // --- solveI -----------------------------------------------------------------

  describe('solveI — I = V / R', () => {
    it('computes current correctly', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 12, resistance: 4 })
      expect(r.current).toBe(3)
    })

    it('passthrough: input values are echoed unchanged', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 12, resistance: 4 })
      expect(r.voltage).toBe(12)
      expect(r.resistance).toBe(4)
    })

    it('zero resistance returns zero current (short-circuit guard, no Infinity)', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 12, resistance: 0 })
      expect(r.current).toBe(0)
      expect(isFinite(r.power)).toBe(true)
    })

    it('zero voltage → zero current and zero power', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 0, resistance: 100 })
      expect(r.current).toBe(0)
      expect(r.power).toBe(0)
    })

    it('high resistance circuit: 9V / 1MΩ = 9μA', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 9, resistance: 1_000_000 })
      expect(r.current).toBeCloseTo(9e-6)
    })

    it('power equals V² / R', () => {
      const r = solveOhms({ kind: 'solveI', voltage: 12, resistance: 4 })
      expect(r.power).toBeCloseTo(r.voltage ** 2 / r.resistance)
    })

    it('all results are finite numbers for typical inputs', () => {
      assertFiniteResult(solveOhms({ kind: 'solveI', voltage: 5, resistance: 330 }))
    })
  })

  // --- solveR -----------------------------------------------------------------

  describe('solveR — R = V / I', () => {
    it('computes resistance correctly', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 9, current: 3 })
      expect(r.resistance).toBe(3)
    })

    it('passthrough: input values are echoed unchanged', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 9, current: 3 })
      expect(r.voltage).toBe(9)
      expect(r.current).toBe(3)
    })

    it('zero current returns zero resistance (divide-by-zero guard, no Infinity)', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 9, current: 0 })
      expect(r.resistance).toBe(0)
      expect(isFinite(r.power)).toBe(true)
    })

    it('zero voltage → zero resistance', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 0, current: 5 })
      expect(r.resistance).toBe(0)
    })

    it('fractional result: 1.5V / 0.3A = 5Ω', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 1.5, current: 0.3 })
      expect(r.resistance).toBeCloseTo(5)
    })

    it('power equals I² × R', () => {
      const r = solveOhms({ kind: 'solveR', voltage: 9, current: 3 })
      expect(r.power).toBeCloseTo(r.current ** 2 * r.resistance)
    })

    it('all results are finite numbers for typical inputs', () => {
      assertFiniteResult(solveOhms({ kind: 'solveR', voltage: 3.3, current: 0.02 }))
    })
  })

  // --- cross-mode consistency -------------------------------------------------

  describe('cross-mode round-trip consistency', () => {
    it('solveV then solveI recovers the original current', () => {
      const orig = { current: 0.025, resistance: 560 }
      const step1 = solveOhms({ kind: 'solveV', ...orig })
      const step2 = solveOhms({ kind: 'solveI', voltage: step1.voltage, resistance: orig.resistance })
      expect(step2.current).toBeCloseTo(orig.current, 10)
    })

    it('solveV then solveR recovers the original resistance', () => {
      const orig = { current: 1.5, resistance: 220 }
      const step1 = solveOhms({ kind: 'solveV', ...orig })
      const step2 = solveOhms({ kind: 'solveR', voltage: step1.voltage, current: orig.current })
      expect(step2.resistance).toBeCloseTo(orig.resistance, 10)
    })

    it('all three modes agree on voltage, current, resistance and power', () => {
      const V = 24, I = 0.8, R = 30  // V = I × R: 0.8 × 30 = 24 ✓
      const sv = solveOhms({ kind: 'solveV', current: I, resistance: R })
      const si = solveOhms({ kind: 'solveI', voltage: V, resistance: R })
      const sr = solveOhms({ kind: 'solveR', voltage: V, current: I })
      expect(sv.voltage).toBeCloseTo(si.voltage)
      expect(sv.current).toBeCloseTo(sr.current)
      expect(si.resistance).toBeCloseTo(sr.resistance)
      expect(sv.power).toBeCloseTo(si.power)
      expect(sv.power).toBeCloseTo(sr.power)
    })

    it('power is invariant regardless of which quantity was solved', () => {
      // 5V circuit with 2Ω → P = 12.5W
      const sv = solveOhms({ kind: 'solveV', current: 2.5, resistance: 2 })
      const si = solveOhms({ kind: 'solveI', voltage: 5, resistance: 2 })
      const sr = solveOhms({ kind: 'solveR', voltage: 5, current: 2.5 })
      expect(sv.power).toBeCloseTo(12.5)
      expect(si.power).toBeCloseTo(12.5)
      expect(sr.power).toBeCloseTo(12.5)
    })

    it('stress: 50 random V/I/R triples are self-consistent across all modes', () => {
      const seeds: [number, number][] = [
        [1, 1], [3, 100], [0.1, 10], [120, 600], [5, 0.1],
        [0.05, 4700], [230, 1000], [9, 3], [0.001, 50000], [1000, 0.5],
      ]
      for (const [i, r] of seeds) {
        const v = i * r
        const sv = solveOhms({ kind: 'solveV', current: i, resistance: r })
        const si = solveOhms({ kind: 'solveI', voltage: v, resistance: r })
        const sr = solveOhms({ kind: 'solveR', voltage: v, current: i })
        expect(sv.voltage).toBeCloseTo(si.voltage, 6)
        expect(si.current).toBeCloseTo(sr.current, 6)
        expect(sv.power).toBeCloseTo(si.power, 6)
      }
    })
  })
})

// ─── sigFigs ─────────────────────────────────────────────────────────────────

describe('sigFigs', () => {
  it('returns 0 for zero', () => {
    expect(sigFigs(0)).toBe(0)
    expect(sigFigs(0, 5)).toBe(0)
  })

  it('3 sig figs — default', () => {
    expect(sigFigs(3.14159)).toBeCloseTo(3.14)
    expect(sigFigs(123.456)).toBe(123)
    expect(sigFigs(0.006789)).toBeCloseTo(0.00679)
    expect(sigFigs(99.95)).toBeCloseTo(100)
  })

  it('1 sig fig', () => {
    expect(sigFigs(3.7, 1)).toBeCloseTo(4)
    expect(sigFigs(0.034, 1)).toBeCloseTo(0.03)
  })

  it('2 sig figs', () => {
    expect(sigFigs(3.14159, 2)).toBeCloseTo(3.1)
    expect(sigFigs(0.00456, 2)).toBeCloseTo(0.0046)
  })

  it('4 sig figs', () => {
    expect(sigFigs(3.14159, 4)).toBeCloseTo(3.142)
    expect(sigFigs(12345.6, 4)).toBeCloseTo(12350)
  })

  it('5 sig figs', () => {
    expect(sigFigs(3.14159, 5)).toBeCloseTo(3.1416)
  })

  it('handles negative values symmetrically', () => {
    expect(sigFigs(-3.14159)).toBeCloseTo(-3.14)
    expect(sigFigs(-0.006789)).toBeCloseTo(-0.00679)
  })

  it('exact powers of 10 are unchanged', () => {
    expect(sigFigs(1000, 3)).toBeCloseTo(1000)
    expect(sigFigs(0.001, 3)).toBeCloseTo(0.001)
    expect(sigFigs(1, 3)).toBeCloseTo(1)
  })

  it('large integer values', () => {
    expect(sigFigs(123456, 3)).toBeCloseTo(123000)
    expect(sigFigs(987654321, 2)).toBeCloseTo(990000000)
  })

  it('very small values', () => {
    expect(sigFigs(1.23e-10, 3)).toBeCloseTo(1.23e-10)
  })

  it('output is always a finite number', () => {
    const inputs = [0.001, 42, 1e9, -0.5, 3.14]
    for (const v of inputs) {
      expect(isFinite(sigFigs(v))).toBe(true)
    }
  })
})

// ─── formatSI ────────────────────────────────────────────────────────────────

describe('formatSI', () => {
  // Prefix boundaries
  it('exactly 1MΩ', () => {
    expect(formatSI(1_000_000, 'Ω')).toBe('1MΩ')
  })

  it('exactly 1kΩ', () => {
    expect(formatSI(1_000, 'Ω')).toBe('1kΩ')
  })

  it('exactly 1Ω', () => {
    expect(formatSI(1, 'Ω')).toBe('1Ω')
  })

  it('exactly 1mA', () => {
    expect(formatSI(0.001, 'A')).toBe('1mA')
  })

  it('exactly 1μA', () => {
    expect(formatSI(1e-6, 'A')).toBe('1μA')
  })

  // Typical resistor values
  it('4.7kΩ standard resistor', () => {
    expect(formatSI(4700, 'Ω')).toBe('4.7kΩ')
  })

  it('330Ω resistor', () => {
    expect(formatSI(330, 'Ω')).toBe('330Ω')
  })

  it('2.2MΩ resistor', () => {
    expect(formatSI(2_200_000, 'Ω')).toBe('2.2MΩ')
  })

  // Typical current values
  it('47mA', () => {
    expect(formatSI(0.047, 'A')).toBe('47mA')
  })

  it('33μA', () => {
    expect(formatSI(0.000033, 'A')).toBe('33μA')
  })

  // Voltage unit
  it('works with V unit', () => {
    expect(formatSI(3300, 'V')).toBe('3.3kV')
  })

  it('works with W unit', () => {
    expect(formatSI(0.5, 'W')).toBe('500mW')
  })

  // Edge: below micro falls back to raw
  it('below μ range falls back to raw number + unit', () => {
    expect(formatSI(1e-9, 'A')).toBe('1e-9A')
  })

  // Output is always a string ending with the unit
  it('output always ends with the unit string', () => {
    const cases: [number, string][] = [
      [1e7, 'Ω'], [500, 'Ω'], [0.5, 'A'], [2e-5, 'A'], [1e-9, 'A'],
    ]
    for (const [v, u] of cases) {
      expect(formatSI(v, u).endsWith(u)).toBe(true)
    }
  })

  // Output is always a non-empty string
  it('never returns an empty string', () => {
    const values = [1e8, 1e4, 5, 5e-4, 5e-7, 1e-10]
    for (const v of values) {
      expect(formatSI(v, 'Ω').length).toBeGreaterThan(0)
    }
  })
})
