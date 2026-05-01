export type LensType = 'convex' | 'concave'

export type ImageOrientation = 'upright' | 'inverted' | 'none'
export type ImageReality = 'real' | 'virtual' | 'infinite' | 'invalid'
export type ImageScale = 'magnified' | 'diminished' | 'same size' | 'none'

export interface LensInput {
  lensType: LensType
  focalLengthCm: number
  objectDistanceCm: number
  objectHeightCm: number
}

export interface LensResult {
  signedFocalLengthCm: number
  imageDistanceCm: number | null
  magnification: number | null
  imageHeightCm: number | null
  reality: ImageReality
  orientation: ImageOrientation
  scale: ImageScale
  message: string | null
}

const EPSILON = 1e-9

export function calculateImageDistance(focalLengthCm: number, objectDistanceCm: number): number | null {
  if (Math.abs(focalLengthCm) < EPSILON || objectDistanceCm <= 0) return null

  const denominator = 1 / focalLengthCm - 1 / objectDistanceCm
  if (Math.abs(denominator) < EPSILON) return null
  return 1 / denominator
}

export function calculateMagnification(imageDistanceCm: number, objectDistanceCm: number): number | null {
  if (objectDistanceCm <= 0) return null
  return -imageDistanceCm / objectDistanceCm
}

export function classifyImageNature(magnification: number | null, imageDistanceCm: number | null): {
  reality: ImageReality
  orientation: ImageOrientation
  scale: ImageScale
} {
  if (imageDistanceCm == null || magnification == null) {
    return { reality: 'infinite', orientation: 'none', scale: 'none' }
  }

  const absM = Math.abs(magnification)
  const scale: ImageScale =
    Math.abs(absM - 1) < 0.03 ? 'same size' : absM > 1 ? 'magnified' : 'diminished'

  return {
    reality: imageDistanceCm > 0 ? 'real' : 'virtual',
    orientation: magnification < 0 ? 'inverted' : 'upright',
    scale,
  }
}

export function solveLens(input: LensInput): LensResult {
  const signedFocalLengthCm =
    input.lensType === 'convex' ? Math.abs(input.focalLengthCm) : -Math.abs(input.focalLengthCm)

  if (Math.abs(signedFocalLengthCm) < EPSILON || input.objectDistanceCm <= 0 || input.objectHeightCm <= 0) {
    return {
      signedFocalLengthCm,
      imageDistanceCm: null,
      magnification: null,
      imageHeightCm: null,
      reality: 'invalid',
      orientation: 'none',
      scale: 'none',
      message: 'Use positive non-zero values for focal length, object distance, and object height.',
    }
  }

  const imageDistanceCm = calculateImageDistance(signedFocalLengthCm, input.objectDistanceCm)
  const magnification =
    imageDistanceCm == null ? null : calculateMagnification(imageDistanceCm, input.objectDistanceCm)

  if (imageDistanceCm == null || magnification == null) {
    return {
      signedFocalLengthCm,
      imageDistanceCm: null,
      magnification: null,
      imageHeightCm: null,
      reality: 'infinite',
      orientation: 'none',
      scale: 'none',
      message: 'The object is at the focal point, so the image forms at infinity.',
    }
  }

  const nature = classifyImageNature(magnification, imageDistanceCm)

  return {
    signedFocalLengthCm,
    imageDistanceCm,
    magnification,
    imageHeightCm: magnification * input.objectHeightCm,
    ...nature,
    message: null,
  }
}
