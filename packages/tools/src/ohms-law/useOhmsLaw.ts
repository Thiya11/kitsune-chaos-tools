import { useState } from 'react'
import { solveOhms, formatSI } from '@kitsunechaos/physics'

export const V_MIN = 0.1
export const V_MAX = 9
export const R_MIN = 10
export const R_MAX = 1000
export const I_MIN = V_MIN / R_MAX  // ~0.0001 A
export const I_MAX = V_MAX / R_MIN  // 0.9 A

export interface OhmsSimState {
  voltage: number
  resistance: number
  current: number
  setVoltage: (v: number) => void
  setResistance: (r: number) => void
  formattedV: string
  formattedR: string
}

export function useOhmsLaw(): OhmsSimState {
  const [voltage, setVoltage] = useState(4.5)
  const [resistance, setResistance] = useState(200)

  const result = solveOhms({ kind: 'solveI', voltage, resistance })

  return {
    voltage,
    resistance,
    current: result.current,
    setVoltage,
    setResistance,
    formattedV: formatSI(result.voltage, 'V'),
    formattedR: formatSI(result.resistance, 'Ω'),
  }
}
