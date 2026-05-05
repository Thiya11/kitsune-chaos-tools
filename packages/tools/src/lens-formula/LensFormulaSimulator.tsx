'use client'

import { useMemo, useRef, useState } from 'react'
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

const MIN_OBJECT_DISTANCE_CM = 20
const MAX_OBJECT_HEIGHT_CM = 6
const MIN_RADIUS_OF_CURVATURE_CM = 40
const MAX_RADIUS_OF_CURVATURE_CM = 120
const MIN_REFRACTIVE_INDEX = 1.2
const MAX_REFRACTIVE_INDEX = 1.8

type Point = { x: number; y: number }

type RaySegment = {
  points: Point[]
  dashed?: boolean
}

type SingleRay = {
  segments: RaySegment[]
  color: string
}

type RayData = {
  ray1: SingleRay
  ray2: SingleRay
  ray3: SingleRay
}

type RayLayout = {
  width: number
  height: number
  lensX: number
  axisY: number
  scale: number
  verticalScale: number
}

export function LensFormulaSimulator() {
  const [lensType, setLensType] = useState<LensType>('convex')
  const [radiusOfCurvatureCm, setRadiusOfCurvatureCm] = useState(40)
  const [refractiveIndex, setRefractiveIndex] = useState(1.5)
  const [objectDistanceCm, setObjectDistanceCm] = useState(30)
  const [objectHeightCm, setObjectHeightCm] = useState(5)

  const focalLengthCm = useMemo(
    () => radiusOfCurvatureCm / (2 * (refractiveIndex - 1)),
    [radiusOfCurvatureCm, refractiveIndex],
  )

  const result = useMemo(
    () => solveLens({ lensType, focalLengthCm, objectDistanceCm, objectHeightCm }),
    [lensType, focalLengthCm, objectDistanceCm, objectHeightCm],
  )

  const sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Panel title="Inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Slider
            label="Radius of curvature"
            value={radiusOfCurvatureCm}
            min={MIN_RADIUS_OF_CURVATURE_CM}
            max={MAX_RADIUS_OF_CURVATURE_CM}
            step={0.5}
            onChange={(value) => setRadiusOfCurvatureCm(clamp(value, MIN_RADIUS_OF_CURVATURE_CM, MAX_RADIUS_OF_CURVATURE_CM))}
            displayValue={`${radiusOfCurvatureCm.toFixed(1)} cm`}
          />
          <Slider
            label="Refractive index"
            value={refractiveIndex}
            min={MIN_REFRACTIVE_INDEX}
            max={MAX_REFRACTIVE_INDEX}
            step={0.01}
            onChange={(value) => setRefractiveIndex(clamp(value, MIN_REFRACTIVE_INDEX, MAX_REFRACTIVE_INDEX))}
            displayValue={refractiveIndex.toFixed(2)}
          />
          <Slider
            label="Object distance"
            value={objectDistanceCm}
            min={MIN_OBJECT_DISTANCE_CM}
            max={100}
            step={0.5}
            onChange={(value) => setObjectDistanceCm(Math.max(MIN_OBJECT_DISTANCE_CM, value))}
            displayValue={`${objectDistanceCm.toFixed(1)} cm`}
          />
          <Slider
            label="Object height"
            value={objectHeightCm}
            min={0.5}
            max={MAX_OBJECT_HEIGHT_CM}
            step={0.5}
            onChange={(value) => setObjectHeightCm(Math.min(MAX_OBJECT_HEIGHT_CM, value))}
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
          onLensTypeChange={setLensType}
          radiusOfCurvatureCm={radiusOfCurvatureCm}
          refractiveIndex={refractiveIndex}
          focalLengthCm={Math.abs(result.signedFocalLengthCm)}
          objectDistanceCm={objectDistanceCm}
          objectHeightCm={objectHeightCm}
          result={result}
          onObjectDistanceChange={setObjectDistanceCm}
        />
      </div>
    </ToolShell>
  )
}

function ResultGrid({ result }: { result: LensResult }) {
  const rows = [
    { label: 'Focal length', value: `${result.signedFocalLengthCm.toFixed(2)} cm` },
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
  onLensTypeChange,
  radiusOfCurvatureCm,
  refractiveIndex,
  focalLengthCm,
  objectDistanceCm,
  objectHeightCm,
  result,
  onObjectDistanceChange,
}: {
  lensType: LensType
  onLensTypeChange: (value: LensType) => void
  radiusOfCurvatureCm: number
  refractiveIndex: number
  focalLengthCm: number
  objectDistanceCm: number
  objectHeightCm: number
  result: LensResult
  onObjectDistanceChange: (v: number) => void
}) {
  const width = 760
  const height = 430
  const axisY = height / 2
  const lensX = width / 2
  const scale = Math.min(5, 260 / Math.max(objectDistanceCm, focalLengthCm, 1))
  const objectX = Math.min(lensX - objectDistanceCm * scale, lensX - 44)
  const focalOffset = focalLengthCm * scale

  const imageDistance = result.imageDistanceCm
  const imageX = imageDistance == null ? width - 55 : clamp(lensX + imageDistance * scale, 50, width - 50)
  const maxHeightCm = Math.max(objectHeightCm, Math.abs(result.imageHeightCm ?? 0), 1)
  const verticalScale = Math.min(9, 130 / maxHeightCm)
  const objectArrow = objectHeightCm * verticalScale

  const imageSignedPx =
    result.imageHeightCm == null
      ? 0
      : result.imageHeightCm * verticalScale
  const imageTipY = axisY - imageSignedPx
  const virtual = result.reality === 'virtual'

  const rays = computeDiagramRays({
    objectDistance: (lensX - objectX) / scale,
    focalLength: result.signedFocalLengthCm,
    objectHeight: objectHeightCm,
    imageDistance: imageDistance == null ? Infinity : (imageX - lensX) / scale,
    imageHeight: result.imageHeightCm ?? 0,
    layout: {
      scale,
      verticalScale,
      lensX,
      axisY,
      width,
      height,
    },
  })

  const svgRef = useRef<SVGSVGElement>(null)
  const isDragging = useRef(false)

  function toSvgCoords(clientX: number, clientY: number): { x: number; y: number } {
    const rect = svgRef.current!.getBoundingClientRect()
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    }
  }

  function applyDrag(clientX: number, clientY: number) {
    const { x: svgX } = toSvgCoords(clientX, clientY)
    onObjectDistanceChange(clamp((lensX - svgX) / scale, MIN_OBJECT_DISTANCE_CM, 100))
  }

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    isDragging.current = true
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return
    applyDrag(e.clientX, e.clientY)
  }

  function handleMouseUp() {
    isDragging.current = false
  }

  function handleTouchStart(e: React.TouchEvent) {
    e.preventDefault()
    isDragging.current = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging.current || !e.touches[0]) return
    applyDrag(e.touches[0].clientX, e.touches[0].clientY)
  }

  function handleTouchEnd() {
    isDragging.current = false
  }

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
      <div style={{ padding: '1.25rem 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', alignSelf: 'flex-start' }}>
          {LENS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLensTypeChange(option.value)}
              aria-pressed={lensType === option.value}
              style={{
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.75rem',
                minWidth: '5.75rem',
                fontSize: 'var(--fs-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                border: lensType === option.value ? '1px solid var(--slider-primary)' : '1px solid var(--border-color)',
                background: lensType === option.value ? 'rgba(255,255,255,0.08)' : 'var(--bg-secondary)',
                color: lensType === option.value ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {lensType === 'convex' ? 'Convex lens: positive focal length' : 'Concave lens: negative focal length'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: '0.35rem' }}>
            f = R / 2(n - 1), 1/f = 1/v + 1/u
          </div>
        </div>
      </div>
      <svg
        ref={svgRef}
        role="img"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', minHeight: '340px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <title>Thin lens ray diagram</title>
        <desc>
          Object arrow is left of the lens. The calculated image arrow moves as radius of curvature, refractive index,
          object distance, object height, and lens type change.
        </desc>
        <rect width={width} height={height} fill="var(--bg-card)" />

        <line x1={10} y1={axisY} x2={690} y2={axisY} stroke="#374151" strokeWidth={0.75} />
        <polygon points={`690,${axisY - 3} 698,${axisY} 690,${axisY + 3}`} fill="#374151" />
        <text x={682} y={axisY - 6} fontSize={9} fill="#6b7280" textAnchor="end">
          Principal axis
        </text>

        <LensShape
          x={lensX}
          y={axisY}
          type={lensType}
          radiusOfCurvatureCm={radiusOfCurvatureCm}
          refractiveIndex={refractiveIndex}
        />

        <AxisMarker x={clamp(lensX - focalOffset, 20, 680)} axisY={axisY} label="F" />
        <AxisMarker x={clamp(lensX + focalOffset, 20, 680)} axisY={axisY} label="F" />
        {lensX - 2 * focalOffset >= 20 && (
          <AxisMarker x={lensX - 2 * focalOffset} axisY={axisY} label="2F" />
        )}
        {lensX + 2 * focalOffset <= 680 && (
          <AxisMarker x={lensX + 2 * focalOffset} axisY={axisY} label="2F" />
        )}

        <ScaleRuler lensX={lensX} axisY={axisY} scale={scale} width={width} />

        <RayLayer rayData={rays} />

        <g cursor="move" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
          <Arrow x={objectX} baseY={axisY} height={objectArrow} label="Object" direction="up" stroke="var(--text-primary)" />
          <rect x={objectX - 20} y={axisY - objectArrow - 28} width={40} height={objectArrow + 36} fill="transparent" />
        </g>

        {result.reality === 'infinite' ? (
          <text x={660} y={axisY - 20} fontSize={11} fill="#9ca3af" textAnchor="end">
            Image at infinity
          </text>
        ) : (
          <ImageArrow
            x={imageX}
            baseY={axisY}
            tipY={imageTipY}
            label={virtual ? 'Virtual image' : 'Real image'}
            stroke={virtual ? 'var(--text-muted)' : 'var(--text-secondary)'}
            dashed={virtual}
          />
        )}
      </svg>
      <figcaption style={{ padding: '0 1rem 1rem', color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', lineHeight: 1.55 }}>
        <strong style={{ color: 'var(--text-secondary)' }}>Convention:</strong> radius is treated as a symmetric lens curvature magnitude in air, so f = R / 2(n - 1). Convex focal length is positive, concave focal length is negative, and magnification uses m = -v / u.
      </figcaption>
    </figure>
  )
}

function LensShape({
  x,
  y,
  type,
  radiusOfCurvatureCm,
  refractiveIndex,
}: {
  x: number
  y: number
  type: LensType
  radiusOfCurvatureCm: number
  refractiveIndex: number
}) {
  const radiusT = (radiusOfCurvatureCm - MIN_RADIUS_OF_CURVATURE_CM) / (MAX_RADIUS_OF_CURVATURE_CM - MIN_RADIUS_OF_CURVATURE_CM)
  const indexT = (refractiveIndex - MIN_REFRACTIVE_INDEX) / (MAX_REFRACTIVE_INDEX - MIN_REFRACTIVE_INDEX)
  const half = 60
  const top = y - half
  const bot = y + half
  const convexBulge = 32 - radiusT * 12
  const concaveInset = 17 - radiusT * 6
  const fillOpacity = 0.12 + indexT * 0.16
  const strokeOpacity = 0.72 + indexT * 0.28
  const strokeWidth = 1.4 + indexT * 0.5

  const convexPath = `M ${x} ${top} C ${x - convexBulge} ${top}, ${x - convexBulge} ${bot}, ${x} ${bot} C ${x + convexBulge} ${bot}, ${x + convexBulge} ${top}, ${x} ${top} Z`
  const concavePath = `M ${x} ${top} C ${x + concaveInset} ${top}, ${x + concaveInset} ${bot}, ${x} ${bot} C ${x - concaveInset} ${bot}, ${x - concaveInset} ${top}, ${x} ${top} Z`

  const isConvex = type === 'convex'
  const fill = isConvex ? `rgba(96, 165, 250, ${fillOpacity})` : `rgba(52, 211, 153, ${fillOpacity})`
  const stroke = isConvex ? `rgba(147, 197, 253, ${strokeOpacity})` : `rgba(110, 231, 183, ${strokeOpacity})`

  return (
    <g>
      <line x1={x} y1={y - 132} x2={x} y2={y + 132} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="5 5" />
      <motion.path
        animate={{ d: isConvex ? convexPath : concavePath, fill, stroke }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        strokeWidth={strokeWidth}
      />
      <motion.path
        animate={{ fill: stroke }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        d={`M ${x} ${top - 2} L ${x - 5} ${top + 7} L ${x + 5} ${top + 7} Z`}
      />
      <motion.path
        animate={{ fill: stroke }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        d={`M ${x} ${bot + 2} L ${x - 5} ${bot - 7} L ${x + 5} ${bot - 7} Z`}
      />
      <text x={x} y={y + 80} fill="var(--text-muted)" fontSize={12} textAnchor="middle">
        lens
      </text>
    </g>
  )
}

function ScaleRuler({
  lensX,
  axisY,
  scale,
  width,
}: {
  lensX: number
  axisY: number
  scale: number
  width: number
}) {
  const rulerY = axisY + 32
  const NICE_STEPS = [2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]
  const rawStep = 65 / scale
  const step = NICE_STEPS.find((n) => n >= rawStep) ?? 1000

  const ticks: { x: number; label: string }[] = [{ x: lensX, label: '0' }]
  for (let d = step; d * scale <= width; d += step) {
    const xR = lensX + d * scale
    const xL = lensX - d * scale
    if (xR <= width - 12) ticks.push({ x: xR, label: `${d}` })
    if (xL >= 12) ticks.push({ x: xL, label: `${d}` })
  }

  return (
    <g>
      <line x1={12} y1={rulerY} x2={width - 12} y2={rulerY} stroke="#1f2937" strokeWidth={1} />
      {ticks.map(({ x, label }) => (
        <g key={x}>
          <line x1={x} y1={rulerY} x2={x} y2={rulerY + 6} stroke="#374151" strokeWidth={1} />
          <text x={x} y={rulerY + 17} textAnchor="middle" fontSize={9} fill="#4b5563">
            {label}
          </text>
        </g>
      ))}
      <text x={width - 12} y={rulerY + 17} textAnchor="end" fontSize={9} fill="#374151">
        cm
      </text>
    </g>
  )
}


function AxisMarker({ x, axisY, label }: { x: number; axisY: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={axisY - 5} x2={x} y2={axisY + 5} stroke="#6b7280" strokeWidth={1} />
      <text x={x} y={axisY + 20} textAnchor="middle" fontSize={10} fill="#6b7280">
        {label}
      </text>
    </g>
  )
}

function Arrow({
  x,
  baseY,
  height,
  label,
  direction,
  stroke,
  dashed = false,
}: {
  x: number
  baseY: number
  height: number
  label: string
  direction: 'up' | 'down'
  stroke: string
  dashed?: boolean
}) {
  const tipY = direction === 'up' ? baseY - height : baseY + height
  const arrowSide = direction === 'up' ? 1 : -1

  return (
    <g>
      <line x1={x} y1={baseY} x2={x} y2={tipY} stroke={stroke} strokeWidth={3} strokeDasharray={dashed ? '6 5' : undefined} />
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

function RayLayer({ rayData }: { rayData: RayData }) {
  return (
    <g>
      {[rayData.ray1, rayData.ray2, rayData.ray3].map((ray, ri) =>
        ray.segments.map((seg, si) => (
          <polyline
            key={`${ri}-${si}`}
            points={seg.points.map((p) => `${p.x},${p.y}`).join(' ')}
            stroke={ray.color}
            strokeWidth={1.5}
            strokeDasharray={seg.dashed ? '5 4' : undefined}
            fill="none"
            opacity={seg.dashed ? 0.5 : 0.85}
          />
        ))
      )}
    </g>
  )
}

function computeDiagramRays({
  objectDistance,
  focalLength,
  objectHeight,
  imageDistance,
  imageHeight,
  layout,
}: {
  objectDistance: number
  focalLength: number
  objectHeight: number
  imageDistance: number
  imageHeight: number
  layout: RayLayout
}): RayData {
  const { width, height, lensX, axisY, scale, verticalScale } = layout
  const objectTip = {
    x: lensX - objectDistance * scale,
    y: axisY - objectHeight * verticalScale,
  }
  const imageTip = {
    x: lensX + imageDistance * scale,
    y: axisY - imageHeight * verticalScale,
  }
  const isInfinity = !Number.isFinite(imageDistance)
  const isVirtual = Number.isFinite(imageDistance) && imageDistance < 0
  const nearFocalX = lensX - Math.abs(focalLength) * scale
  const farFocalX = lensX + Math.abs(focalLength) * scale

  const parallelSlope = (axisY - objectTip.y) / Math.max(Math.abs(focalLength) * scale, 1)
  const extendToFrame = (start: Point, slope: number): Point => {
    if (Math.abs(slope) < 0.0001) return { x: width, y: start.y }

    const rightY = start.y + slope * (width - start.x)
    if (rightY >= 0 && rightY <= height) {
      return { x: width, y: rightY }
    }

    const edgeY = rightY < 0 ? 0 : height
    return { x: start.x + (edgeY - start.y) / slope, y: edgeY }
  }
  const extendThroughImage = (lensPoint: Point): Point => {
    const slope = (imageTip.y - lensPoint.y) / (imageTip.x - lensPoint.x)
    return extendToFrame(lensPoint, slope)
  }
  const virtualSolidEnd = (lensPoint: Point): Point => {
    const slope = (lensPoint.y - imageTip.y) / (lensPoint.x - imageTip.x)
    return extendToFrame(lensPoint, slope)
  }
  const infinityEnd = (lensPoint: Point): Point => extendToFrame(lensPoint, parallelSlope)

  const LENS_HALF = 60
  const lensMinY = axisY - LENS_HALF
  const lensMaxY = axisY + LENS_HALF

  const ray1LensPoint = { x: lensX, y: clamp(objectTip.y, lensMinY, lensMaxY) }
  const ray2LensPoint = { x: lensX, y: axisY }
  const ray3LensPoint = (() => {
    const targetX = focalLength > 0 ? nearFocalX : farFocalX
    if (Math.abs(targetX - objectTip.x) < 0.001) {
      return { x: lensX, y: clamp(objectTip.y + (axisY - objectTip.y) * 0.45, lensMinY, lensMaxY) }
    }
    const slope = (axisY - objectTip.y) / (targetX - objectTip.x)
    return { x: lensX, y: clamp(objectTip.y + slope * (lensX - objectTip.x), lensMinY, lensMaxY) }
  })()

  const makeOutgoing = (lensPoint: Point, infinityOffset = 0): RaySegment[] => {
    if (isInfinity) {
      const end = infinityEnd({ x: lensPoint.x, y: lensPoint.y + infinityOffset })
      return [{ points: [lensPoint, end] }]
    }

    if (isVirtual) {
      return [
        { points: [lensPoint, virtualSolidEnd(lensPoint)] },
        { points: [lensPoint, imageTip], dashed: true },
      ]
    }

    return [{ points: [lensPoint, imageTip, extendThroughImage(lensPoint)] }]
  }

  return {
    ray1: {
      color: '#ef4444',
      segments: [
        { points: [objectTip, ray1LensPoint] },
        ...makeOutgoing(ray1LensPoint),
      ].map((segment) => clampSegment(segment, width, height)),
    },
    ray2: {
      color: '#3b82f6',
      segments: [
        {
          points: [
            objectTip,
            ray2LensPoint,
            isInfinity ? infinityEnd(ray2LensPoint) : isVirtual ? virtualSolidEnd(ray2LensPoint) : imageTip,
            ...(isInfinity || isVirtual ? [] : [extendThroughImage(ray2LensPoint)]),
          ],
        },
        ...(isVirtual ? [{ points: [ray2LensPoint, imageTip], dashed: true }] : []),
      ].map((segment) => clampSegment(segment, width, height)),
    },
    ray3: {
      color: '#22c55e',
      segments: [
        { points: [objectTip, ray3LensPoint] },
        ...(isInfinity
          ? makeOutgoing(ray3LensPoint)
          : [{ points: [ray3LensPoint, ...(isVirtual ? [] : [imageTip]), isVirtual ? virtualSolidEnd(ray3LensPoint) : extendThroughImage(ray3LensPoint)] }]),
        ...(isVirtual ? [{ points: [ray3LensPoint, imageTip], dashed: true }] : []),
      ].map((segment) => clampSegment(segment, width, height)),
    },
  }
}

function clampSegment(segment: RaySegment, width: number, height: number): RaySegment {
  return {
    ...segment,
    points: segment.points.map((point) => ({
      x: clamp(point.x, 0, width),
      y: clamp(point.y, 0, height),
    })),
  }
}

const springTransition = { type: 'spring' as const, stiffness: 180, damping: 22 }

function ImageArrow({
  x,
  baseY,
  tipY,
  label,
  stroke,
  dashed = false,
}: {
  x: number
  baseY: number
  tipY: number
  label: string
  stroke: string
  dashed?: boolean
}) {
  const isUp = tipY <= baseY
  const arrowSide = isUp ? 1 : -1

  return (
    <g>
      <motion.line
        x1={x} x2={x}
        animate={{ y1: baseY, y2: tipY }}
        transition={springTransition}
        stroke={stroke}
        strokeWidth={3}
        strokeDasharray={dashed ? '6 3' : undefined}
      />
      <motion.g animate={{ y: tipY }} transition={springTransition}>
        <path
          d={`M ${x} 0 L ${x - 7} ${12 * arrowSide} L ${x + 7} ${12 * arrowSide} Z`}
          fill={stroke}
          opacity={dashed ? 0.75 : 1}
        />
        <text
          x={x}
          y={isUp ? -14 : 24}
          fill={stroke}
          fontSize={12}
          textAnchor="middle"
        >
          {label}
        </text>
      </motion.g>
    </g>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
