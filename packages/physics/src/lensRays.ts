export type Point = { x: number; y: number }

export type RaySegment = {
  points: Point[]
  dashed: boolean
}

export type SingleRay = {
  segments: RaySegment[]
  color: string
}

export type RayData = {
  ray1: SingleRay
  ray2: SingleRay
  ray3: SingleRay
  isVirtual: boolean
  isInfinity: boolean
  imageX: number
  imageY: number
}

export type RayInput = {
  objectDistance: number
  focalLength: number
  objectHeight: number
  imageDistance: number
  imageHeight: number
  layout?: {
    scale: number
    verticalScale?: number
    lensX: number
    axisY: number
    width: number
    height: number
  }
}

const SCALE = 6
const LX = 350
const AY = 170
const SVG_W = 700
const SVG_H = 340

function clampY(y: number, height = SVG_H): number {
  return Math.min(height, Math.max(0, y))
}

function clampX(x: number, width = SVG_W): number {
  return Math.min(width, Math.max(0, x))
}

function clampPoint(p: Point, width = SVG_W, height = SVG_H): Point {
  return { x: clampX(p.x, width), y: clampY(p.y, height) }
}

function clampSegment(seg: RaySegment, width = SVG_W, height = SVG_H): RaySegment {
  return { ...seg, points: seg.points.map((point) => clampPoint(point, width, height)) }
}

export function computeRays(input: RayInput): RayData {
  const { objectDistance, focalLength, objectHeight, imageDistance, imageHeight, layout } = input
  const scale = layout?.scale ?? SCALE
  const verticalScale = layout?.verticalScale ?? scale
  const lensX = layout?.lensX ?? LX
  const axisY = layout?.axisY ?? AY
  const width = layout?.width ?? SVG_W
  const height = layout?.height ?? SVG_H

  const objX = lensX - objectDistance * scale
  const objY = axisY - objectHeight * verticalScale
  const imgX = lensX + imageDistance * scale
  const imgY = axisY - imageHeight * verticalScale
  const F1x = lensX - Math.abs(focalLength) * scale
  const F2x = lensX + Math.abs(focalLength) * scale

  const isInfinity = !isFinite(imageDistance) || Math.abs(imageDistance) > 900
  const isVirtual = imageDistance < 0

  const objTip: Point = { x: objX, y: objY }

  // ── RAY 2: Centre ray — straight through optical centre, undeviated ──
  const slope2 = (axisY - objY) / (lensX - objX)
  const ray2EndY = axisY + slope2 * (width - lensX)
  const ray2: SingleRay = {
    color: '#3b82f6',
    segments: [
      {
        points: [objTip, { x: lensX, y: axisY }, { x: width, y: ray2EndY }],
        dashed: false,
      },
    ],
  }

  // ── RAY 1: Parallel ray — horizontal to lens, refracts through F2 ──
  let ray1: SingleRay

  if (isInfinity) {
    ray1 = {
      color: '#ef4444',
      segments: [
        { points: [objTip, { x: lensX, y: objY }], dashed: false },
        { points: [{ x: lensX, y: objY }, { x: width, y: objY }], dashed: false },
      ],
    }
  } else if (!isVirtual) {
    // Real image: refracts through F2 and converges
    const slope1b = (axisY - objY) / (F2x - lensX)
    const r1EndY = objY + slope1b * (width - lensX)
    ray1 = {
      color: '#ef4444',
      segments: [
        { points: [objTip, { x: lensX, y: objY }], dashed: false },
        { points: [{ x: lensX, y: objY }, { x: width, y: r1EndY }], dashed: false },
      ],
    }
  } else {
    // Virtual image: ray diverges after lens; backward extension is dashed
    const slope1v = (objY - axisY) / (lensX - F2x)
    const r1SolidEndY = objY + slope1v * (width - lensX)
    const r1DashEndY = objY + slope1v * (imgX - lensX)
    ray1 = {
      color: '#ef4444',
      segments: [
        { points: [objTip, { x: lensX, y: objY }], dashed: false },
        { points: [{ x: lensX, y: objY }, { x: width, y: r1SolidEndY }], dashed: false },
        { points: [{ x: lensX, y: objY }, { x: imgX, y: r1DashEndY }], dashed: true },
      ],
    }
  }

  // ── RAY 3: Focal ray — through F1 to lens, exits parallel to axis ──
  let ray3: SingleRay

  if (isInfinity) {
    // Same geometry as real case
    const slope3a = (axisY - objY) / (F1x - objX)
    const lensY3 = objY + slope3a * (lensX - objX)
    ray3 = {
      color: '#22c55e',
      segments: [
        { points: [objTip, { x: lensX, y: lensY3 }], dashed: false },
        { points: [{ x: lensX, y: lensY3 }, { x: width, y: lensY3 }], dashed: false },
      ],
    }
  } else if (!isVirtual) {
    // Real image: aimed through F1, exits horizontally
    const slope3a = (axisY - objY) / (F1x - objX)
    const lensY3 = objY + slope3a * (lensX - objX)
    ray3 = {
      color: '#22c55e',
      segments: [
        { points: [objTip, { x: lensX, y: lensY3 }], dashed: false },
        { points: [{ x: lensX, y: lensY3 }, { x: width, y: lensY3 }], dashed: false },
      ],
    }
  } else {
    // Virtual image: exits diverging; backward extension is dashed to image
    const slope3a = (axisY - objY) / (F1x - objX)
    const lensY3 = objY + slope3a * (lensX - objX)
    const slopeOut3 = (lensY3 - axisY) / (lensX - F1x)
    const r3SolidEndY = lensY3 + slopeOut3 * (width - lensX)
    ray3 = {
      color: '#22c55e',
      segments: [
        { points: [objTip, { x: lensX, y: lensY3 }], dashed: false },
        { points: [{ x: lensX, y: lensY3 }, { x: width, y: r3SolidEndY }], dashed: false },
        { points: [{ x: lensX, y: lensY3 }, { x: imgX, y: imgY }], dashed: true },
      ],
    }
  }

  return {
    ray1: { ...ray1, segments: ray1.segments.map((segment) => clampSegment(segment, width, height)) },
    ray2: { ...ray2, segments: ray2.segments.map((segment) => clampSegment(segment, width, height)) },
    ray3: { ...ray3, segments: ray3.segments.map((segment) => clampSegment(segment, width, height)) },
    isVirtual,
    isInfinity,
    imageX: imgX,
    imageY: imgY,
  }
}
