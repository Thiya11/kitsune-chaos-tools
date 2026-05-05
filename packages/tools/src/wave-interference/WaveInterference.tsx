'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Slider, Panel, ToolShell } from '@kitsunechaos/ui'
import { useWaveInterference } from './useWaveInterference'
import { WaveCanvas } from './WaveCanvas'

const meta = {
  name:        'Wave Interference',
  slug:        'wave-interference',
  category:    'Waves',
  description: 'd · sin(θ) = m · λ — two-source interference with live fringe visualisation',
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 25 }

const CYAN  = '#67e8f9'
const WHITE = '#e2e8f0'

// ── Equation panel ────────────────────────────────────────────────────────────

interface EquationPanelProps {
  separation: number
  wavelength: number
  frequency:  number
}

function EquationPanel({ separation, wavelength, frequency }: EquationPanelProps) {
  const varStyle = (color: string): React.CSSProperties => ({
    display:     'inline-block',
    fontWeight:  700,
    fontSize:    '1.1rem',
    color,
    fontFamily:  'var(--font-mono)',
  })

  const opStyle: React.CSSProperties = {
    color:      'var(--text-muted)',
    fontSize:   '1.1rem',
    fontFamily: 'var(--font-mono)',
  }

  const readoutStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize:   'var(--fs-xs)',
    color:      'var(--text-muted)',
    display:    'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap:        '2px',
    minWidth:   '80px',
  }

  const valueStyle: React.CSSProperties = {
    fontSize:   'var(--fs-sm)',
    fontWeight: 600,
    color:      'var(--text-primary)',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {/* Equation: d · sin(θ) = m · λ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <motion.span
          key={separation}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={spring}
          style={varStyle(WHITE)}
        >
          d
        </motion.span>
        <span style={opStyle}>· sin(θ) = m ·</span>
        <motion.span
          key={`λ${wavelength.toFixed(2)}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={spring}
          style={varStyle(CYAN)}
        >
          λ
        </motion.span>
      </div>

      {/* Value readouts */}
      <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center' }}>
        <div style={readoutStyle}>
          <span>d (separation)</span>
          <motion.span
            key={separation}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={spring}
            style={valueStyle}
          >
            {separation} units
          </motion.span>
        </div>

        <div style={readoutStyle}>
          <span>λ (wavelength)</span>
          <motion.span
            key={wavelength.toFixed(1)}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={spring}
            style={valueStyle}
          >
            {wavelength.toFixed(1)} units
          </motion.span>
        </div>

        <div style={readoutStyle}>
          <span>f (frequency)</span>
          <motion.span
            key={frequency}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={spring}
            style={valueStyle}
          >
            {frequency} Hz
          </motion.span>
        </div>
      </div>
    </div>
  )
}

// ── Source toggle — pill slider ───────────────────────────────────────────────
// Styled to match the Pendulum tool's button palette

const BTN_H = 32   // matches pendulum button height (0.5rem * 2 + ~16px line-height ≈ 32px)
const BTN_FONT: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize:   'var(--fs-xs)',
  fontWeight: 600,
}

interface SourceToggleProps {
  value: boolean      // true = two sources
  onChange: (v: boolean) => void
}

function SourceToggle({ value, onChange }: SourceToggleProps) {
  // Two-segment pill: left = "1 Source", right = "2 Sources"
  // Active segment: var(--gradient-primary) bg, var(--bg-primary) text  (= pendulum primary btn)
  // Inactive segment: transparent bg, var(--text-muted) text            (= pendulum reset btn)

  const segStyle = (active: boolean): React.CSSProperties => ({
    flex:            1,
    height:          BTN_H,
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    cursor:          'pointer',
    ...BTN_FONT,
    color:           active ? 'var(--bg-primary)' : 'var(--text-muted)',
    background:      active ? 'var(--gradient-primary)' : 'transparent',
    transition:      'background 0.2s, color 0.2s',
    whiteSpace:      'nowrap',
    padding:         '0 14px',
  })

  return (
    <div
      role="group"
      aria-label="Source count"
      style={{
        display:      'flex',
        borderRadius: 'var(--radius-md)',
        border:       '1px solid var(--border-color)',
        overflow:     'hidden',
        flexShrink:   0,
      }}
    >
      {/* Left — 1 Source */}
      <button
        style={segStyle(!value)}
        onClick={() => onChange(false)}
        aria-pressed={!value}
      >
        1 Source
      </button>
      {/* Divider */}
      <div style={{ width: 1, background: 'var(--border-color)', flexShrink: 0 }} />
      {/* Right — 2 Sources */}
      <button
        style={segStyle(value)}
        onClick={() => onChange(true)}
        aria-pressed={value}
      >
        2 Sources
      </button>
    </div>
  )
}

// ── Play/pause button ─────────────────────────────────────────────────────────

interface PlayButtonProps {
  playing: boolean
  onClick: () => void
}

function PlayButton({ playing, onClick }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? 'Pause' : 'Play'}
      style={{
        height:       BTN_H,
        padding:      '0 1rem',
        borderRadius: 'var(--radius-md)',
        border:       playing ? 'none' : '1px solid var(--border-color)',
        background:   playing ? 'var(--gradient-primary)' : 'transparent',
        color:        playing ? 'var(--bg-primary)' : 'var(--text-muted)',
        cursor:       'pointer',
        flexShrink:   0,
        ...BTN_FONT,
        transition:   'opacity var(--transition-fast)',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.75')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
    >
      {playing ? 'Pause' : 'Play'}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function WaveInterference() {
  const {
    frequency,  setFrequency,
    amplitude,  setAmplitude,
    separation, setSeparation,
    source2On,  setSource2On,
    playing,    setPlaying,
    waveParams,
    sources,
    wavelength,
  } = useWaveInterference()

  return (
    <ToolShell meta={meta}>
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          padding:       '1.25rem',
          gap:           '1.25rem',
        }}
      >
        {/* Panel 1 — Canvas with overlay controls */}
        <Panel>
          <div
            style={{
              position:        'relative',
              display:         'flex',
              justifyContent:  'center',
              background:      '#050A1E',
              borderRadius:    'var(--radius-md)',
              overflow:        'hidden',
              lineHeight:      0,
            }}
          >
            <WaveCanvas
              waveParams={waveParams}
              sources={sources}
              playing={playing}
              width={600}
              height={400}
            />

            {/* Overlay controls — top-left of canvas */}
            <div
              style={{
                position:       'absolute',
                top:            12,
                left:           12,
                display:        'flex',
                alignItems:     'center',
                gap:            8,
                padding:        '6px 8px',
                borderRadius:   'var(--radius-md)',
                background:     'var(--bg-card)',
                border:         '1px solid var(--border-color)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <SourceToggle value={source2On} onChange={setSource2On} />
              <PlayButton playing={playing} onClick={() => setPlaying(!playing)} />
            </div>
          </div>
        </Panel>

        {/* Panel 2 — Equation */}
        <Panel>
          <EquationPanel
            separation={separation}
            wavelength={wavelength}
            frequency={frequency}
          />
        </Panel>

        {/* Panel 3 — Controls */}
        <Panel title="Controls">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Slider
              label="Frequency"
              value={frequency}
              min={0.5}
              max={3.0}
              step={0.1}
              onChange={setFrequency}
              displayValue={`${frequency} Hz`}
            />
            <Slider
              label="Amplitude"
              value={amplitude}
              min={0.1}
              max={1.0}
              step={0.05}
              onChange={setAmplitude}
              displayValue={`${(amplitude * 100).toFixed(0)}%`}
            />
            <Slider
              label="Source Separation"
              value={separation}
              min={5}
              max={40}
              step={1}
              onChange={setSeparation}
              displayValue={`${separation} units`}
            />
          </div>
        </Panel>
      </div>
    </ToolShell>
  )
}
