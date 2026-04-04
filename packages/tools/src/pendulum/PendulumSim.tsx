'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider, Panel, ToolShell } from '@kitsune/ui'
import { usePendulum } from './usePendulum'

function useSvgColors() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') !== 'light')
    check()
    const mo = new MutationObserver(check)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  return isDark
    ? { bg: '#0f0f0f', mount: '#1a1a1a', dash: '#2a2a2a', ref: '#1f1f1f', rod: '#333', pivotOuter: '#222', pivotInner: '#555', accent: '#e0e0e0', text: '#444444' }
    : { bg: '#ffffff', mount: '#e0e0e0', dash: '#cccccc', ref: '#e5e5e5', rod: '#aaaaaa', pivotOuter: '#cccccc', pivotInner: '#888888', accent: '#000000', text: '#888888' }
}

const meta = {
  name: 'Pendulum Simulator',
  slug: 'pendulum',
  category: 'Physics',
  description: 'Visualize simple harmonic motion with live controls',
}

const SVG_W = 400
const SVG_H = 550

export function PendulumSim() {
  const sim = usePendulum()
  const SC = useSvgColors()

  const rodLen = sim.length * 160
  const angleDeg = (sim.theta * 180) / Math.PI

  const trailPath =
    sim.trail.length > 1
      ? sim.trail
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ')
      : ''

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Panel title="Parameters">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Slider
            label="Length (m)"
            value={sim.length}
            min={0.1}
            max={2}
            step={0.01}
            onChange={sim.setLength}
            displayValue={`${sim.length.toFixed(2)} m`}
          />
          <Slider
            label="Gravity (m/s²)"
            value={sim.gravity}
            min={0.5}
            max={25}
            step={0.01}
            onChange={sim.setGravity}
            displayValue={`${sim.gravity.toFixed(2)} m/s²`}
          />
          <Slider
            label="Amplitude (°)"
            value={sim.amplitude}
            min={1}
            max={90}
            step={1}
            onChange={sim.setAmplitude}
            displayValue={`${sim.amplitude}°`}
          />
          <Slider
            label="Damping"
            value={sim.damping}
            min={0}
            max={2}
            step={0.01}
            onChange={sim.setDamping}
            displayValue={`${sim.damping.toFixed(2)}`}
          />
        </div>
      </Panel>

      <Panel title="Measurements">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'Period',    value: `${sim.periodSeconds.toFixed(3)} s`,        color: 'var(--text-primary)', animate: true  },
            { label: 'Frequency', value: `${(1 / sim.periodSeconds).toFixed(3)} Hz`, color: 'var(--text-primary)', animate: true  },
            { label: 'Angle',     value: `${angleDeg.toFixed(1)}°`,                  color: 'var(--text-primary)', animate: false },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.625rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{row.label}</span>
              {row.animate ? (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={row.value}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontFamily: 'monospace', fontSize: '0.825rem', fontWeight: 600, color: row.color }}
                  >
                    {row.value}
                  </motion.span>
                </AnimatePresence>
              ) : (
                <span style={{ fontFamily: 'monospace', fontSize: '0.825rem', fontWeight: 600, color: row.color }}>
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {/* Formula */}
      <Panel>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--accent-primary)' }}>
          T = 2π<span style={{ color: 'var(--text-secondary)' }}>√(</span>
          <span className="gradient-text">L</span>
          <span style={{ color: 'var(--text-secondary)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>g</span>
          <span style={{ color: 'var(--text-secondary)' }}>)</span>
        </div>
      </Panel>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={sim.toggle}
          style={{
            flex: 1,
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem',
            fontSize: 'var(--fs-xs)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'var(--gradient-primary)',
            color: 'var(--bg-primary)',
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          {sim.running ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={sim.reset}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 1rem',
            fontSize: 'var(--fs-xs)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid var(--border-color)',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )

  return (
    <ToolShell meta={meta} sidebar={sidebar}>
      <div style={{ display: 'flex', flex: 1, padding: '1.25rem', minHeight: 0 }}>
        <div
          style={{
            flex: 1,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="xMidYMid meet" style={{ userSelect: 'none', display: 'block', flex: 1, minHeight: '320px' }}>
            {/* Background */}
            <rect width={SVG_W} height={SVG_H} fill={SC.bg} />

            {/* Ceiling mount */}
            <rect x={sim.pivotX - 22} y={0} width={44} height={10} rx={2} fill={SC.mount} />
            <line
              x1={sim.pivotX} y1={0}
              x2={sim.pivotX} y2={sim.pivotY}
              stroke={SC.dash} strokeWidth={1.5} strokeDasharray="4 3"
            />

            {/* Vertical reference */}
            <line
              x1={sim.pivotX} y1={sim.pivotY}
              x2={sim.pivotX} y2={sim.pivotY + rodLen + 20}
              stroke={SC.ref} strokeWidth={1} strokeDasharray="6 4"
            />

            {/* Trail */}
            {trailPath && (
              <path
                d={trailPath}
                fill="none"
                stroke={SC.accent}
                strokeWidth={1.5}
                strokeOpacity={0.15}
                strokeLinecap="round"
              />
            )}

            {/* Rod */}
            <line
              x1={sim.pivotX} y1={sim.pivotY}
              x2={sim.bobX}   y2={sim.bobY}
              stroke={SC.rod} strokeWidth={2} strokeLinecap="round"
            />

            {/* Pivot */}
            <circle cx={sim.pivotX} cy={sim.pivotY} r={5}  fill={SC.pivotOuter} />
            <circle cx={sim.pivotX} cy={sim.pivotY} r={2.5} fill={SC.pivotInner} />

            {/* Bob glow */}
            <circle cx={sim.bobX} cy={sim.bobY} r={20} fill={SC.accent} fillOpacity={0.05} />
            {/* Bob */}
            <circle cx={sim.bobX} cy={sim.bobY} r={13} fill={SC.bg} stroke={SC.accent} strokeWidth={1.5} />
            <circle cx={sim.bobX - 4} cy={sim.bobY - 4} r={3} fill={SC.accent} fillOpacity={0.2} />

            {/* Angle arc */}
            {Math.abs(sim.theta) > 0.02 && (
              <path
                d={describeArc(sim.pivotX, sim.pivotY, 34, 0, sim.theta)}
                fill="none"
                stroke={SC.accent}
                strokeWidth={1}
                opacity={0.25}
              />
            )}

            {/* Period readout */}
            <text x={10} y={SVG_H - 10} fontSize={10} fill={SC.text} fontFamily="JetBrains Mono, monospace">
              T = {sim.periodSeconds.toFixed(3)} s
            </text>
          </svg>
        </div>
      </div>
    </ToolShell>
  )
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCart(cx, cy, r, startAngle)
  const end = polarToCart(cx, cy, r, endAngle)
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0
  const sweep = endAngle > startAngle ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
}

function polarToCart(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.sin(angle),
    y: cy + r * Math.cos(angle),
  }
}
