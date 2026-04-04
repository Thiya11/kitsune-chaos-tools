'use client'

import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider, Panel, ToolShell } from '@kitsune/ui'
import { useOhmsLaw, type SolveFor } from './useOhmsLaw'

const meta = {
  name: "Ohm's Law Calculator",
  slug: 'ohms-law',
  category: 'Electronics',
  description: 'Solve for voltage, current, or resistance interactively',
}

// Palette matches kitsunechaos.com: near-black bg, accent yellow, neutral grays
const C = {
  wire:     '#444444',
  battery:  '#e0e0e0',  // accent white (noir)
  resistor: '#888888',
  current:  '#666666',
  muted:    '#444444',
  bg:       '#0f0f0f',
}

const SOLVE_OPTIONS: { value: SolveFor; label: string }[] = [
  { value: 'V', label: 'Solve for Voltage (V)' },
  { value: 'I', label: 'Solve for Current (I)' },
  { value: 'R', label: 'Solve for Resistance (R)' },
]

const RESULT_COLORS: Record<string, string> = {
  Voltage:    'var(--accent-primary)',
  Current:    'var(--text-secondary)',
  Resistance: 'var(--accent-secondary)',
  Power:      'var(--text-muted)',
}

export function OhmsLaw() {
  const state = useOhmsLaw()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio ?? 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const W = rect.width
    const H = rect.height
    const cx = W / 2
    const cy = H / 2

    // Background
    ctx.fillStyle = C.bg
    ctx.fillRect(0, 0, W, H)

    const pad = 70
    const top = cy - 90
    const bot = cy + 90
    const left = pad
    const right = W - pad

    // Wires
    ctx.strokeStyle = C.wire
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(right, top)
    ctx.lineTo(right, bot)
    ctx.lineTo(left, bot)
    ctx.lineTo(left, top)
    ctx.stroke()

    // Battery (left side)
    const bH = 44
    const bX = left
    const bY1 = cy - bH / 2
    const bY2 = cy + bH / 2
    ctx.strokeStyle = C.battery
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(bX - 14, bY1)
    ctx.lineTo(bX + 14, bY1)
    ctx.stroke()
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(bX - 9, bY2)
    ctx.lineTo(bX + 9, bY2)
    ctx.stroke()

    // +/- labels
    ctx.fillStyle = C.battery
    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'right'
    ctx.fillText('+', bX - 17, bY1 + 5)
    ctx.fillText('−', bX - 17, bY2 + 5)

    // Voltage label (below battery)
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(state.formattedV, bX - 17, cy + 6)

    // Resistor (top wire, center)
    const rW = 64
    const rH = 14
    const rX = cx - rW / 2
    const rY = top - rH / 2
    ctx.strokeStyle = C.resistor
    ctx.lineWidth = 1.5
    ctx.strokeRect(rX, rY, rW, rH)
    ctx.fillStyle = C.bg
    ctx.fillRect(rX + 1, rY + 1, rW - 2, rH - 2)

    // Zigzag
    ctx.strokeStyle = C.resistor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const zigCount = 6
    const zigW = rW / zigCount
    for (let i = 0; i <= zigCount; i++) {
      const x = rX + i * zigW
      const y = i % 2 === 0 ? rY + 2 : rY + rH - 2
      i === 0 ? ctx.moveTo(x, rY + rH / 2) : ctx.lineTo(x, y)
    }
    ctx.lineTo(rX + rW, rY + rH / 2)
    ctx.stroke()

    // Resistance label
    ctx.fillStyle = C.resistor
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(state.formattedR, cx, top - rH / 2 - 9)

    // Current arrow (right side)
    const aX = right + 22
    const aY1 = cy - 18
    const aY2 = cy + 18
    ctx.strokeStyle = C.current
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(aX, aY1)
    ctx.lineTo(aX, aY2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(aX - 5, aY2 - 7)
    ctx.lineTo(aX, aY2)
    ctx.lineTo(aX + 5, aY2 - 7)
    ctx.stroke()
    ctx.fillStyle = C.current
    ctx.font = '11px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(state.formattedI, aX + 9, cy + 4)

    // Power
    ctx.fillStyle = C.muted
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`P = ${state.formattedP}`, cx, bot + 22)
  }, [state.formattedV, state.formattedI, state.formattedR, state.formattedP])

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Solve-for selector */}
      <Panel title="Solve For">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {SOLVE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => state.setSolveFor(opt.value)}
              style={{
                borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: state.solveFor === opt.value ? '1px solid var(--slider-primary)' : '1px solid transparent',
                backgroundColor: state.solveFor === opt.value ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: state.solveFor === opt.value ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Panel>

      {/* Inputs */}
      <Panel title="Inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Slider
            label="Voltage (V)"
            value={state.voltage}
            min={0.1}
            max={240}
            step={0.1}
            onChange={state.setVoltage}
            displayValue={state.formattedV}
            disabled={state.solveFor === 'V'}
          />
          <Slider
            label="Current (I)"
            value={state.current}
            min={0.001}
            max={10}
            step={0.001}
            onChange={state.setCurrent}
            displayValue={state.formattedI}
            disabled={state.solveFor === 'I'}
          />
          <Slider
            label="Resistance (R)"
            value={state.resistance}
            min={1}
            max={10000}
            step={1}
            onChange={state.setResistance}
            displayValue={state.formattedR}
            disabled={state.solveFor === 'R'}
          />
        </div>
      </Panel>

      {/* Results */}
      <Panel title="Results">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
          {[
            { label: 'Voltage',    value: state.formattedV },
            { label: 'Current',    value: state.formattedI },
            { label: 'Resistance', value: state.formattedR },
            { label: 'Power',      value: state.formattedP },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                borderRadius: '0.5rem',
                padding: '0.625rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {item.label}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.value}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: RESULT_COLORS[item.label],
                  }}
                >
                  {item.value}
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Panel>

      {/* Formula */}
      <Panel>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
          <span className="gradient-text">V</span>
          {' = '}
          <span style={{ color: 'var(--text-secondary)' }}>I</span>
          {' × '}
          <span style={{ color: 'var(--accent-secondary)' }}>R</span>
        </div>
      </Panel>
    </div>
  )

  return (
    <ToolShell meta={meta} sidebar={sidebar}>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '340px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            display: 'block',
          }}
        />
      </div>
    </ToolShell>
  )
}
