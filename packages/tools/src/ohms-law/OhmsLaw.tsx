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

// ── SVG circuit geometry (viewBox 0 0 600 280) ───────────────────────────────
const CX_LEFT   = 80
const CX_RIGHT  = 520
const CX_TOP    = 40
const CX_BOTTOM = 240

const BATT_X     = 80
const BATT_MID_Y = (CX_TOP + CX_BOTTOM) / 2   // 140
const CELL_STEP  = 18   // px between cells (positive terminal to next positive terminal)

const RES_LEFT  = 220
const RES_RIGHT = 380
const RES_Y     = CX_TOP
const RES_SEGS  = 8
const RES_ZIG   = 10    // half-amplitude of zigzag

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
  const cellCount  = clamp(Math.round((voltage / V_MAX) * 9), 1, 9)
  const battSpan   = cellCount * CELL_STEP           // total height of cell stack
  const battStartY = BATT_MID_Y - battSpan / 2      // topmost positive-terminal Y

  // GSAP electron animation — reruns when current changes
  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const totalLen = path.getTotalLength()
    const duration = lerp(current, I_MIN, I_MAX, 3, 0.4)
    const proxies: Array<{ t: number }> = []

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const startT = (i / DOT_COUNT) * totalLen
      const proxy  = { t: startT }
      proxies.push(proxy)

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

  // Arrowhead x position: ~one-third from the right on the top wire
  const arrowX1 = RES_RIGHT + Math.round((CX_RIGHT - RES_RIGHT) * 0.45)
  const arrowX2 = arrowX1 + 20

  // Current label: midpoint of top-right wire segment
  const currentLabelX = (RES_RIGHT + CX_RIGHT) / 2

  return (
    <svg
      viewBox="0 0 600 280"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrow-dir"
          viewBox="0 0 10 6"
          refX="10"
          refY="3"
          markerWidth="8"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L10 3 L0 6 Z" fill={GREEN} />
        </marker>
      </defs>

      {/* ── Hidden path for GSAP tracking ── */}
      <path
        ref={pathRef}
        d={`M ${CX_LEFT} ${CX_TOP} L ${CX_RIGHT} ${CX_TOP} L ${CX_RIGHT} ${CX_BOTTOM} L ${CX_LEFT} ${CX_BOTTOM} Z`}
        fill="none"
        stroke="transparent"
      />

      {/* ── Wires (full rectangle) — strokeWidth 2 ── */}
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
          const posY = battStartY + i * CELL_STEP   // positive terminal Y
          const negY = posY + 8                      // negative terminal Y
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Positive terminal — long thin line (28px wide, sw 1.5) */}
              <line
                x1={BATT_X - 14} y1={posY}
                x2={BATT_X + 14} y2={posY}
                stroke={BLUE} strokeWidth="1.5"
              />
              {/* Negative terminal — short thick line (14px wide, sw 4) */}
              <line
                x1={BATT_X - 7} y1={negY}
                x2={BATT_X + 7} y2={negY}
                stroke={BLUE} strokeWidth="1.5"
              />
            </motion.g>
          )
        })}
      </AnimatePresence>

      {/* ── Resistor (drawn over top wire) — strokeWidth 1.5 ── */}
      <rect
        x={RES_LEFT - 4}
        y={RES_Y - RES_ZIG - 8}
        width={RES_RIGHT - RES_LEFT + 8}
        height={(RES_ZIG + 8) * 2}
        fill="var(--bg-card)"
      />
      <polyline
        points={zigPts}
        fill="none"
        stroke={AMBER}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Conventional current arrowhead on top wire ── */}
      <line
        x1={arrowX1} y1={CX_TOP}
        x2={arrowX2} y2={CX_TOP}
        stroke="none"
        markerEnd="url(#arrow-dir)"
      />

      {/* ── Value labels (inside circuit loop) ── */}
      {/* Voltage: right of battery, inside loop */}
      <text
        x={BATT_X + 28}
        y={BATT_MID_Y + 5}
        textAnchor="start"
        fill={BLUE}
        fontSize="13"
        fontWeight="600"
        fontFamily="monospace"
      >
        {formattedV}
      </text>

      {/* Resistance: below the resistor body, inside loop */}
      <text
        x={(RES_LEFT + RES_RIGHT) / 2}
        y={RES_Y + RES_ZIG + 22}
        textAnchor="middle"
        fill={AMBER}
        fontSize="13"
        fontWeight="600"
        fontFamily="monospace"
      >
        {formattedR}
      </text>

      {/* Current: on top-right wire segment, below the wire */}
      <text
        x={currentLabelX}
        y={CX_TOP + 22}
        textAnchor="middle"
        fill={GREEN}
        fontSize="13"
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
        {/* Top: SVG circuit diagram — fixed 300px so it fills without overflow */}
        <Panel>
          <div style={{ height: '300px' }}>
            <CircuitDiagram
              voltage={voltage}
              current={current}
              formattedV={formattedV}
              formattedR={formattedR}
            />
          </div>
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
