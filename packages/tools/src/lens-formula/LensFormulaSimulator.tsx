'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Panel, Slider, ToolShell } from '@kitsunechaos/ui'
import { solveLens, type LensType, type LensResult } from '@kitsunechaos/physics'

const meta = {
  name: 'Lens Formula Simulator',
  slug: 'lens-formula-simulator',
  category: 'Physics',
  description: 'Calculate image distance and magnification with the thin lens equation',
}

const LENS_OPTIONS: { value: LensType; label: string }[] = [
  { value: 'convex', label: 'Convex' },
  { value: 'concave', label: 'Concave' },
]

export function LensFormulaSimulator() {
  const [lensType, setLensType] = useState<LensType>('convex')
  const [focalLengthCm, setFocalLengthCm] = useState(10)
  const [objectDistanceCm, setObjectDistanceCm] = useState(30)
  const [objectHeightCm, setObjectHeightCm] = useState(5)

  const result = useMemo(
    () => solveLens({ lensType, focalLengthCm, objectDistanceCm, objectHeightCm }),
    [lensType, focalLengthCm, objectDistanceCm, objectHeightCm],
  )

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Panel title="Lens Type">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {LENS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLensType(option.value)}
              aria-pressed={lensType === option.value}
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 0.75rem',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                border: lensType === option.value ? '1px solid var(--slider-primary)' : '1px solid var(--border-color)',
                background: lensType === option.value ? 'rgba(255,255,255,0.06)' : 'var(--bg-secondary)',
                color: lensType === option.value ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Slider
            label="Focal length"
            value={focalLengthCm}
            min={1}
            max={50}
            step={0.5}
            onChange={setFocalLengthCm}
            displayValue={`${result.signedFocalLengthCm.toFixed(1)} cm`}
          />
          <Slider
            label="Object distance"
            value={objectDistanceCm}
            min={1}
            max={100}
            step={0.5}
            onChange={setObjectDistanceCm}
            displayValue={`${objectDistanceCm.toFixed(1)} cm`}
          />
          <Slider
            label="Object height"
            value={objectHeightCm}
            min={0.5}
            max={20}
            step={0.5}
            onChange={setObjectHeightCm}
            displayValue={`${objectHeightCm.toFixed(1)} cm`}
          />
        </div>
      </Panel>

      <Panel title="Results">
        <ResultGrid result={result} />
      </Panel>
    </div>
  )

  return (
    <ToolShell meta={meta} sidebar={sidebar}>
      <div style={{ display: 'flex', flex: 1, padding: '1.25rem', minHeight: 0 }}>
        <LensDiagram
          lensType={lensType}
          focalLengthCm={Math.abs(result.signedFocalLengthCm)}
          objectDistanceCm={objectDistanceCm}
          objectHeightCm={objectHeightCm}
          result={result}
        />
      </div>
    </ToolShell>
  )
}

function ResultGrid({ result }: { result: LensResult }) {
  const rows = [
    { label: 'Image distance', value: result.imageDistanceCm == null ? 'At infinity' : `${result.imageDistanceCm.toFixed(2)} cm` },
    { label: 'Magnification', value: result.magnification == null ? 'Not finite' : `${result.magnification.toFixed(2)}x` },
    { label: 'Image height', value: result.imageHeightCm == null ? 'Not finite' : `${result.imageHeightCm.toFixed(2)} cm` },
    {
      label: 'Image nature',
      value:
        result.message ??
        `${capitalize(result.reality)}, ${result.orientation}, ${result.scale}`,
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.625rem' }}>
      {rows.map((row) => (
        <div
          key={row.label}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: '0.625rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {row.label}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={row.value}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
              }}
            >
              {row.value}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function LensDiagram({
  lensType,
  focalLengthCm,
  objectDistanceCm,
  objectHeightCm,
  result,
}: {
  lensType: LensType
  focalLengthCm: number
  objectDistanceCm: number
  objectHeightCm: number
  result: LensResult
}) {
  const width = 760
  const height = 430
  const axisY = height / 2
  const lensX = width / 2
  const scale = Math.min(5, 260 / Math.max(objectDistanceCm, Math.abs(result.imageDistanceCm ?? 0), focalLengthCm, 1))
  const objectX = lensX - objectDistanceCm * scale
  const focalOffset = focalLengthCm * scale

  const imageDistance = result.imageDistanceCm
  const imageX = imageDistance == null ? width - 55 : clamp(lensX + imageDistance * scale, 50, width - 50)
  const objectArrow = clamp(objectHeightCm * 9, 32, 110)
  const imageArrow =
    result.imageHeightCm == null ? 0 : clamp(Math.abs(result.imageHeightCm) * 9, 18, 130)
  const imagePointsUp = (result.imageHeightCm ?? 0) > 0
  const imageY2 = imagePointsUp ? axisY - imageArrow : axisY + imageArrow
  const virtual = result.reality === 'virtual'

  return (
    <figure
      aria-label="Interactive thin lens diagram showing object position, lens, focal points, and calculated image position."
      style={{
        flex: 1,
        margin: 0,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)',
        overflow: 'hidden',
        minHeight: '340px',
      }}
    >
      <svg
        role="img"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', minHeight: '340px' }}
      >
        <title>Thin lens ray diagram</title>
        <desc>
          Object arrow is left of the lens. The calculated image arrow moves as focal length, object distance,
          object height, and lens type change.
        </desc>
        <rect width={width} height={height} fill="var(--bg-card)" />

        <line x1={34} y1={axisY} x2={width - 34} y2={axisY} stroke="var(--border-color)" strokeWidth={2} />
        <text x={width - 38} y={axisY - 10} fill="var(--text-muted)" fontSize={12} textAnchor="end">
          principal axis
        </text>

        <LensShape x={lensX} y={axisY} type={lensType} />

        <FocalPoint x={lensX - focalOffset} y={axisY} label="F" />
        <FocalPoint x={lensX + focalOffset} y={axisY} label="F" />

        <Arrow x={objectX} axisY={axisY} height={objectArrow} label="Object" direction="up" stroke="var(--text-primary)" />

        {result.reality === 'infinite' ? (
          <g>
            <line x1={lensX + 22} y1={axisY - objectArrow} x2={width - 60} y2={axisY - objectArrow} stroke="var(--text-secondary)" strokeWidth={2} strokeDasharray="7 6" />
            <text x={width - 58} y={axisY - objectArrow - 12} fill="var(--text-secondary)" fontSize={13} textAnchor="end">
              image at infinity
            </text>
          </g>
        ) : (
          <Arrow
            x={imageX}
            axisY={axisY}
            height={imageArrow}
            label={virtual ? 'Virtual image' : 'Real image'}
            direction={imagePointsUp ? 'up' : 'down'}
            stroke={virtual ? 'var(--text-muted)' : 'var(--text-secondary)'}
            dashed={virtual}
          />
        )}

        <RayLines
          objectX={objectX}
          objectTopY={axisY - objectArrow}
          lensX={lensX}
          axisY={axisY}
          imageX={imageX}
          imageY={imageY2}
          showFinite={result.reality !== 'infinite'}
          virtual={virtual}
        />

        <text x={18} y={28} fill="var(--text-secondary)" fontSize={13}>
          {lensType === 'convex' ? 'Convex lens: positive focal length' : 'Concave lens: negative focal length'}
        </text>
        <text x={18} y={50} fill="var(--text-muted)" fontSize={12}>
          1/f = 1/v + 1/u
        </text>
      </svg>
      <figcaption style={{ padding: '0 1rem 1rem', color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.55 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Convention:</strong> object distance is entered as positive. Convex focal length is positive, concave focal length is negative, and magnification uses m = -v / u. Real images are drawn on the opposite side of the lens; virtual images use a dashed arrow on the object side.
      </figcaption>
    </figure>
  )
}

function LensShape({ x, y, type }: { x: number; y: number; type: LensType }) {
  const path =
    type === 'convex'
      ? `M ${x} ${y - 125} C ${x - 34} ${y - 78}, ${x - 34} ${y + 78}, ${x} ${y + 125} C ${x + 34} ${y + 78}, ${x + 34} ${y - 78}, ${x} ${y - 125} Z`
      : `M ${x - 28} ${y - 125} C ${x + 8} ${y - 78}, ${x + 8} ${y + 78}, ${x - 28} ${y + 125} L ${x + 28} ${y + 125} C ${x - 8} ${y + 78}, ${x - 8} ${y - 78}, ${x + 28} ${y - 125} Z`

  return (
    <g>
      <path d={path} fill="rgba(255,255,255,0.04)" stroke="var(--text-secondary)" strokeWidth={2} />
      <line x1={x} y1={y - 132} x2={x} y2={y + 132} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="5 5" />
      <text x={x} y={y + 152} fill="var(--text-muted)" fontSize={12} textAnchor="middle">
        lens
      </text>
    </g>
  )
}

function FocalPoint({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill="var(--text-secondary)" />
      <text x={x} y={y + 22} fill="var(--text-muted)" fontSize={12} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function Arrow({
  x,
  axisY,
  height,
  label,
  direction,
  stroke,
  dashed = false,
}: {
  x: number
  axisY: number
  height: number
  label: string
  direction: 'up' | 'down'
  stroke: string
  dashed?: boolean
}) {
  const tipY = direction === 'up' ? axisY - height : axisY + height
  const arrowSide = direction === 'up' ? 1 : -1

  return (
    <g>
      <line x1={x} y1={axisY} x2={x} y2={tipY} stroke={stroke} strokeWidth={3} strokeDasharray={dashed ? '6 5' : undefined} />
      <path
        d={`M ${x} ${tipY} L ${x - 7} ${tipY + 12 * arrowSide} L ${x + 7} ${tipY + 12 * arrowSide} Z`}
        fill={stroke}
        opacity={dashed ? 0.75 : 1}
      />
      <text x={x} y={direction === 'up' ? tipY - 14 : tipY + 24} fill={stroke} fontSize={12} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function RayLines({
  objectX,
  objectTopY,
  lensX,
  axisY,
  imageX,
  imageY,
  showFinite,
  virtual,
}: {
  objectX: number
  objectTopY: number
  lensX: number
  axisY: number
  imageX: number
  imageY: number
  showFinite: boolean
  virtual: boolean
}) {
  if (!showFinite) return null

  return (
    <g opacity={0.8}>
      <line x1={objectX} y1={objectTopY} x2={lensX} y2={objectTopY} stroke="var(--text-muted)" strokeWidth={1.5} />
      <line x1={lensX} y1={objectTopY} x2={imageX} y2={imageY} stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray={virtual ? '6 5' : undefined} />
      <line x1={objectX} y1={objectTopY} x2={lensX} y2={axisY} stroke="var(--text-muted)" strokeWidth={1.5} />
      <line x1={lensX} y1={axisY} x2={imageX} y2={imageY} stroke="var(--text-muted)" strokeWidth={1.5} strokeDasharray={virtual ? '6 5' : undefined} />
    </g>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
