import { useState, useEffect, useRef, useCallback } from 'react'
import { stepRK4, period, pendulumBobXY, type PendulumState } from '@kitsune/physics'

export interface PendulumHookState {
  // params
  length: number
  gravity: number
  amplitude: number
  damping: number
  setLength: (v: number) => void
  setGravity: (v: number) => void
  setAmplitude: (v: number) => void
  setDamping: (v: number) => void
  // simulation
  theta: number
  running: boolean
  toggle: () => void
  reset: () => void
  // computed
  periodSeconds: number
  // bob position (normalised 0-1 within SVG viewport)
  bobX: number
  bobY: number
  pivotX: number
  pivotY: number
  /** Trail positions for ghost path */
  trail: Array<{ x: number; y: number }>
}

const PIVOT_X = 200
const PIVOT_Y = 60
const SCALE = 160 // pixels per metre of pendulum length at max (1.0 m)

export function usePendulum(): PendulumHookState {
  const [length, setLength] = useState(1.5)
  const [gravity, setGravity] = useState(9.81)
  const [amplitude, setAmplitude] = useState(30) // degrees
  const [damping, setDamping] = useState(0)

  const stateRef = useRef<PendulumState>({
    theta: (30 * Math.PI) / 180,
    omega: 0,
    time: 0,
  })

  const [displayTheta, setDisplayTheta] = useState(stateRef.current.theta)
  const [running, setRunning] = useState(true)
  const trailRef = useRef<Array<{ x: number; y: number }>>([])
  const [trail, setTrail] = useState<Array<{ x: number; y: number }>>([])
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const reset = useCallback(() => {
    const thetaRad = (amplitude * Math.PI) / 180
    stateRef.current = { theta: thetaRad, omega: 0, time: 0 }
    trailRef.current = []
    setTrail([])
    setDisplayTheta(thetaRad)
  }, [amplitude])

  // Reset when amplitude changes
  useEffect(() => {
    reset()
  }, [amplitude, reset])

  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
      return
    }

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp
      }
      const dtMs = Math.min(timestamp - lastTimeRef.current, 50) // cap at 50ms
      lastTimeRef.current = timestamp

      const dt = dtMs / 1000
      const steps = 8
      for (let i = 0; i < steps; i++) {
        stateRef.current = stepRK4(stateRef.current, { length, gravity, damping }, dt / steps)
      }

      setDisplayTheta(stateRef.current.theta)

      // Record trail (keep last 80 points)
      const bob = pendulumBobXY(PIVOT_X, PIVOT_Y, length * SCALE, stateRef.current.theta)
      trailRef.current = [...trailRef.current.slice(-79), bob]
      setTrail([...trailRef.current])

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [running, length, gravity, damping])

  const bob = pendulumBobXY(PIVOT_X, PIVOT_Y, length * SCALE, displayTheta)

  return {
    length,
    gravity,
    amplitude,
    damping,
    setLength,
    setGravity,
    setAmplitude: (v: number) => setAmplitude(v),
    setDamping,
    theta: displayTheta,
    running,
    toggle: () => setRunning((r) => !r),
    reset,
    periodSeconds: period({ length, gravity }),
    bobX: bob.x,
    bobY: bob.y,
    pivotX: PIVOT_X,
    pivotY: PIVOT_Y,
    trail,
  }
}
