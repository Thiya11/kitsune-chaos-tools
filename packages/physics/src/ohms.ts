/**
 * Ohm's Law: V = I × R
 *
 * Given any two of voltage (V), current (I), resistance (R),
 * this module solves for the third.
 */

export type OhmsInput =
  | { kind: 'solveV'; current: number; resistance: number }
  | { kind: 'solveI'; voltage: number; resistance: number }
  | { kind: 'solveR'; voltage: number; current: number }

export interface OhmsResult {
  voltage: number
  current: number
  resistance: number
  /** Power in watts: P = V × I */
  power: number
}

export function solveOhms(input: OhmsInput): OhmsResult {
  let voltage: number
  let current: number
  let resistance: number

  switch (input.kind) {
    case 'solveV':
      current = input.current
      resistance = input.resistance
      voltage = current * resistance
      break
    case 'solveI':
      voltage = input.voltage
      resistance = input.resistance
      current = resistance === 0 ? 0 : voltage / resistance
      break
    case 'solveR':
      voltage = input.voltage
      current = input.current
      resistance = current === 0 ? 0 : voltage / current
      break
  }

  const power = voltage * current
  return { voltage, current, resistance, power }
}

/** Round to a given number of significant figures */
export function sigFigs(value: number, digits = 3): number {
  if (value === 0) return 0
  const d = Math.ceil(Math.log10(Math.abs(value)))
  const power = digits - d
  const magnitude = Math.pow(10, power)
  return Math.round(value * magnitude) / magnitude
}

/** Format a value with appropriate SI prefix */
export function formatSI(value: number, unit: string): string {
  const abs = Math.abs(value)
  if (abs >= 1e6) return `${sigFigs(value / 1e6)}M${unit}`
  if (abs >= 1e3) return `${sigFigs(value / 1e3)}k${unit}`
  if (abs >= 1) return `${sigFigs(value)}${unit}`
  if (abs >= 1e-3) return `${sigFigs(value * 1e3)}m${unit}`
  if (abs >= 1e-6) return `${sigFigs(value * 1e6)}μ${unit}`
  return `${value}${unit}`
}
