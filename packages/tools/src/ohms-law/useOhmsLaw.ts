import { useState, useCallback } from 'react'
import { solveOhms, formatSI, type OhmsResult } from '@kitsune/physics'

export type SolveFor = 'V' | 'I' | 'R'

export interface OhmsLawState {
  solveFor: SolveFor
  voltage: number
  current: number
  resistance: number
  result: OhmsResult
  setSolveFor: (target: SolveFor) => void
  setVoltage: (v: number) => void
  setCurrent: (i: number) => void
  setResistance: (r: number) => void
  formattedV: string
  formattedI: string
  formattedR: string
  formattedP: string
}

export function useOhmsLaw(): OhmsLawState {
  const [solveFor, setSolveForState] = useState<SolveFor>('V')
  const [voltage, setVoltageState] = useState(12)
  const [current, setCurrentState] = useState(0.1)
  const [resistance, setResistanceState] = useState(120)

  const compute = useCallback(
    (sf: SolveFor, v: number, i: number, r: number): OhmsResult => {
      switch (sf) {
        case 'V':
          return solveOhms({ kind: 'solveV', current: i, resistance: r })
        case 'I':
          return solveOhms({ kind: 'solveI', voltage: v, resistance: r })
        case 'R':
          return solveOhms({ kind: 'solveR', voltage: v, current: i })
      }
    },
    [],
  )

  const result = compute(solveFor, voltage, current, resistance)

  const setSolveFor = (target: SolveFor) => setSolveForState(target)
  const setVoltage = (v: number) => setVoltageState(v)
  const setCurrent = (i: number) => setCurrentState(i)
  const setResistance = (r: number) => setResistanceState(r)

  return {
    solveFor,
    voltage,
    current,
    resistance,
    result,
    setSolveFor,
    setVoltage,
    setCurrent,
    setResistance,
    formattedV: formatSI(result.voltage, 'V'),
    formattedI: formatSI(result.current, 'A'),
    formattedR: formatSI(result.resistance, 'Ω'),
    formattedP: formatSI(result.power, 'W'),
  }
}
