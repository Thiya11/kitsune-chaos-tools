'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { Slider, Panel, ToolShell } from '@kitsunechaos/ui'
import { useOhmsLaw, V_MIN, V_MAX, R_MIN, R_MAX, I_MIN, I_MAX } from './useOhmsLaw'

const meta = {
  name: "Ohm's Law",
  slug: 'ohms-law',
  category: 'Electronics',
  description: 'V = I × R — control voltage and resistance, observe current flow',
}

// ── Palette ──────────────────────────────────────────────────────────────────
const BLUE  = '#3b82f6'   // V
const GREEN = '#22c55e'   // I
const AMBER = '#f59e0b'   // R

// ── SVG circuit geometry ──────────────────────────────────────────────────────
const CX_LEFT   = 90
const CX_RIGHT  = 440
const CX_TOP    = 72
const CX_BOTTOM = 232

const BATT_X      = CX_LEFT
const BATT_MID_Y  = (CX_TOP + CX_BOTTOM) / 2   // 152
const CELL_STEP   = 9    // px between long-line centres of adjacent cells

const RES_LEFT  = 202
const RES_RIGHT = 328
const RES_Y     = CX_TOP
const RES_SEGS  = 8
const RES_ZIG   = 8      // half-amplitude of zigzag

const DOT_COUNT = 7

// ── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

function lerp(
  val: number,
  inMin: number, inMax: number,
  outMin: number, outMax: number,
): number {
  return outMin + clamp((val - inMin) / (inMax - inMin), 0, 1) * (outMax - outMin)
}

function formatCurrent(amps: number): string {
  return amps < 0.1
    ? `${(amps * 1000).toFixed(1)} mA`
    : `${amps.toFixed(3)} A`
}

// ── Resistor zigzag points ────────────────────────────────────────────────────
const segW = (RES_RIGHT - RES_LEFT) / RES_SEGS
const zigPts = [
  `${RES_LEFT},${RES_Y}`,
  ...Array.from({ length: RES_SEGS - 1 }, (_, i) => {
    const x = RES_LEFT + (i + 1) * segW
    const y = RES_Y + (i % 2 === 0 ? -RES_ZIG : RES_ZIG)
    return `${x.toFixed(2)},${y}`
  }),
  `${RES_RIGHT},${RES_Y}`,
].join(' ')

// ── FormulaDisplay ────────────────────────────────────────────────────────────
interface FormulaDisplayProps {
  voltage: number
  current: number
  resistance: number
}

function FormulaDisplay({ voltage, current, resistance }: FormulaDisplayProps) {
  const spring = { type: 'spring' as const, stiffness: 120, damping: 20 }
  const vScale = lerp(voltage,    V_MIN, V_MAX, 0.7, 1.6)
  const iScale = lerp(current,    I_MIN, I_MAX, 0.7, 1.6)
  const rScale = lerp(resistance, R_MIN, R_MAX, 0.7, 1.6)

  const letterStyle = (color: string): React.CSSProperties => ({
    display:    'block',
    fontSize:   '64px',
    fontWeight: 700,
    color,
    lineHeight: 1,
    userSelect: 'none',
  })

  const opStyle: React.CSSProperties = {
    fontSize:   '2rem',
    fontWeight: 700,
    color:      'var(--text-muted)',
    userSelect: 'none',
    alignSelf:  'center',
  }

  const unitStyle: React.CSSProperties = {
    fontSize:   '0.65rem',
    color:      'var(--text-muted)',
    marginTop:  '4px',
    fontFamily: 'var(--font-mono)',
    userSelect: 'none',
  }

  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '1rem',
        minHeight:      '110px',
        overflow:       'hidden',
        padding:        '0.25rem 0',
      }}
    >
      {/* V */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '5rem' }}>
        <motion.span animate={{ scale: vScale }} transition={spring} style={letterStyle(BLUE)}>
          V
        </motion.span>
        <span style={unitStyle}>{voltage.toFixed(1)} V</span>
      </div>

      <span style={opStyle}>=</span>

      {/* I */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '5rem' }}>
        <motion.span animate={{ scale: iScale }} transition={spring} style={letterStyle(GREEN)}>
          I
        </motion.span>
        <span style={unitStyle}>{formatCurrent(current)}</span>
      </div>

      <span style={opStyle}>×</span>

      {/* R */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '5rem' }}>
        <motion.span animate={{ scale: rScale }} transition={spring} style={letterStyle(AMBER)}>
          R
        </motion.span>
        <span style={unitStyle}>{resistance.toFixed(0)} Ω</span>
      </div>
    </div>
  )
}

// ── CircuitDiagram ────────────────────────────────────────────────────────────
interface CircuitDiagramProps {
  voltage:    number
  current:    number
  formattedV: string
  formattedR: string
}

function CircuitDiagram({ voltage, current, formattedV, formattedR }: CircuitDiagramProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(SVGCircleElement | null)[]>(Array(DOT_COUNT).fill(null) as null[])

  // Battery cell count 1–9, scales with voltage
  const cellCount = clamp(Math.round((voltage / V_MAX) * 9), 1, 9)
  // battStartY: topmost long-line Y, centred at BATT_MID_Y
  const battSpan  = (cellCount - 1) * CELL_STEP + 4   // +4 for short line below last long line
  const battStartY = BATT_MID_Y - battSpan / 2

  // GSAP electron animation — reruns when current changes
  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLen = path.getTotalLength()
    const duration = lerp(current, I_MIN, I_MAX, 3, 0.4)  // slow → fast as I rises
    const proxies: Array<{ t: number }> = []

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const startT = (i / DOT_COUNT) * totalLen
      const proxy  = { t: startT }
      proxies.push(proxy)

      // Place dot immediately before tween starts
      const pt0 = path.getPointAtLength(startT)
      dot.setAttribute('cx', String(pt0.x))
      dot.setAttribute('cy', String(pt0.y))

      gsap.to(proxy, {
        t:        startT + totalLen,
        duration,
        ease:     'none',
        repeat:   -1,
        onUpdate() {
          const pt = path.getPointAtLength(proxy.t % totalLen)
          dot.setAttribute('cx', String(pt.x))
          dot.setAttribute('cy', String(pt.y))
        },
      })
    })

    return () => { proxies.forEach((p) => gsap.killTweensOf(p)) }
  }, [current])

  // Midpoint of top-right wire segment (resistor end → right corner) for current label
  const currentLabelX = (RES_RIGHT + CX_RIGHT) / 2

  return (
    <svg
      viewBox="0 0 520 300"
      style={{ width: '100%', display: 'block', maxHeight: '38vh' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ── Hidden path for GSAP tracking ── */}
      <path
        ref={pathRef}
        d={`M ${CX_LEFT} ${CX_TOP} L ${CX_RIGHT} ${CX_TOP} L ${CX_RIGHT} ${CX_BOTTOM} L ${CX_LEFT} ${CX_BOTTOM} Z`}
        fill="none"
        stroke="transparent"
      />

      {/* ── Wires (full rectangle) ── */}
      <rect
        x={CX_LEFT}
        y={CX_TOP}
        width={CX_RIGHT - CX_LEFT}
        height={CX_BOTTOM - CX_TOP}
        fill="none"
        stroke="var(--border-color)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* ── Battery cells (drawn over left wire) ── */}
      <AnimatePresence>
        {Array.from({ length: cellCount }).map((_, i) => {
          const ly = battStartY + i * CELL_STEP   // long (thin) line Y
          const sy = ly + 4                        // short (thick) line Y
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Positive terminal — long thin horizontal line */}
              <line
                x1={BATT_X - 12} y1={ly}
                x2={BATT_X + 12} y2={ly}
                stroke={BLUE} strokeWidth="1.5"
              />
              {/* Negative terminal — short thick horizontal line */}
              <line
                x1={BATT_X - 7} y1={sy}
                x2={BATT_X + 7} y2={sy}
                stroke={BLUE} strokeWidth="3"
              />
            </motion.g>
          )
        })}
      </AnimatePresence>

      {/* ── Resistor (drawn over top wire) ── */}
      {/* Filled rect covers the wire segment behind the zigzag */}
      <rect
        x={RES_LEFT - 3}
        y={RES_Y - RES_ZIG - 6}
        width={RES_RIGHT - RES_LEFT + 6}
        height={(RES_ZIG + 6) * 2}
        fill="var(--bg-card)"
      />
      <polyline
        points={zigPts}
        fill="none"
        stroke={AMBER}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Value labels ── */}
      {/* Voltage: to the left of battery, inside the loop */}
      <text
        x={BATT_X + 20}
        y={BATT_MID_Y + 4}
        textAnchor="start"
        fill={BLUE}
        fontSize="12"
        fontWeight="600"
        fontFamily="monospace"
      >
        {formattedV}
      </text>

      {/* Resistance: below the resistor body, inside the loop */}
      <text
        x={(RES_LEFT + RES_RIGHT) / 2}
        y={RES_Y + RES_ZIG + 20}
        textAnchor="middle"
        fill={AMBER}
        fontSize="12"
        fontWeight="600"
        fontFamily="monospace"
      >
        {formattedR}
      </text>

      {/* Current: on the top-right wire segment, inside the loop */}
      <text
        x={currentLabelX}
        y={CX_TOP + 20}
        textAnchor="middle"
        fill={GREEN}
        fontSize="12"
        fontWeight="600"
        fontFamily="monospace"
      >
        {formatCurrent(current)}
      </text>

      {/* ── Electron dots ── */}
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <circle
          key={i}
          ref={(el) => { dotRefs.current[i] = el }}
          r={4}
          fill={GREEN}
          opacity={0.85}
        />
      ))}
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function OhmsLaw() {
  const {
    voltage, resistance, current,
    setVoltage, setResistance,
    formattedV, formattedR,
  } = useOhmsLaw()

  return (
    <ToolShell meta={meta}>
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          padding:       '1.25rem',
          gap:           '1.25rem',
          overflowY:     'auto',
          flex:          1,
          minHeight:     0,
        }}
      >
        {/* Top: SVG circuit diagram */}
        <Panel>
          <CircuitDiagram
            voltage={voltage}
            current={current}
            formattedV={formattedV}
            formattedR={formattedR}
          />
        </Panel>

        {/* Middle: animated formula */}
        <Panel>
          <FormulaDisplay
            voltage={voltage}
            current={current}
            resistance={resistance}
          />
        </Panel>

        {/* Bottom: two sliders */}
        <Panel title="Controls">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Slider
              label="Voltage"
              value={voltage}
              min={V_MIN}
              max={V_MAX}
              step={0.1}
              onChange={setVoltage}
              displayValue={formattedV}
            />
            <Slider
              label="Resistance"
              value={resistance}
              min={R_MIN}
              max={R_MAX}
              step={10}
              onChange={setResistance}
              displayValue={formattedR}
            />
          </div>
        </Panel>
      </div>
    </ToolShell>
  )
}
