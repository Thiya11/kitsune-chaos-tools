'use client'

import React, { useId } from 'react'

export interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  displayValue?: string
  disabled?: boolean
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  displayValue,
  disabled = false,
}: SliderProps) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 500,
            color: disabled ? 'var(--accent-tertiary)' : 'var(--text-secondary)',
            cursor: disabled ? 'not-allowed' : 'default',
          }}
        >
          {label}
        </label>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 600,
            color: disabled ? 'var(--accent-tertiary)' : 'var(--accent-primary)',
          } as React.CSSProperties}
        >
          {displayValue ?? `${value}${unit}`}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-thumb w-full"
        style={{
          height: '4px',
          borderRadius: 'var(--radius-full)',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          background: disabled
            ? 'var(--border-subtle)'
            : `linear-gradient(to right, var(--slider-primary) ${pct}%, var(--border-color) ${pct}%)`,
          opacity: disabled ? 0.35 : 1,
        }}
      />
    </div>
  )
}
