// Coordinate system
// WaveSource x/y are in GRID units (0–150 × 0–100).
// computeAmplitude receives grid units. All distance math uses grid units via
// an effective k_grid = 2π / λ_grid where λ_grid = speed / (freq * GRID_SCALE).
// waveParams.speed is in canvas pixels per second (GRID_SCALE = 4 canvas px / grid px).
// This keeps displayed λ and d in the same unit (grid units) while giving
// enough fringe density for ~3 visible bands at the default settings.

const GRID_SCALE = 4       // canvas pixels per grid pixel
const SOURCE_X_GRID = 30   // grid x of both sources
const CANVAS_W = 600       // canvas width
const CANVAS_H = 400       // canvas height

export interface WaveParams {
  frequency: number   // Hz
  amplitude: number   // 0–1
  speed: number       // canvas pixels per second
}

export interface WaveSource {
  x: number      // grid units
  y: number      // grid units
  enabled: boolean
}

// Sources sit at a fixed x, vertically centred, ±separation/2 apart in grid units.
export function getSourcePositions(separation: number): [WaveSource, WaveSource] {
  const cy = CANVAS_H / GRID_SCALE / 2  // = 50
  const half = separation / 2
  return [
    { x: SOURCE_X_GRID, y: cy - half, enabled: true },
    { x: SOURCE_X_GRID, y: cy + half, enabled: true },
  ]
}

// Wavelength in grid units (consistent units with separation for the formula display).
export function getWavelength(params: WaveParams): number {
  return params.speed / params.frequency / GRID_SCALE
}

// Destructive fringe y-positions in grid units at the right-hand screen edge.
// Formula: fringe_spacing_grid = speed * 30 / (freq * separation)
// derived from λ_canvas * L_canvas / (d_canvas * GRID_SCALE)
// where L_canvas = CANVAS_W - SOURCE_X_GRID * GRID_SCALE = 480.
export function computeFringePositions(params: WaveParams, separation: number): number[] {
  if (separation === 0) return []
  const spacingGrid = (params.speed * 30) / (params.frequency * separation)
  const cy = CANVAS_H / GRID_SCALE / 2      // = 50
  const maxY = CANVAS_H / GRID_SCALE        // = 100
  const positions: number[] = []

  for (let m = -10; m <= 10; m++) {
    const n = m + 0.5  // half-integer → destructive fringe
    const y = cy + n * spacingGrid
    if (y >= 0 && y <= maxY) positions.push(y)
  }
  return positions
}

// Instantaneous superposition amplitude at grid point (gx, gy) at time t.
// Amplitude is in [-2·params.amplitude, +2·params.amplitude], clamped to [-1, 1].
// A purely constructive point reaches ±1 when both waves peak together.
export function computeAmplitude(
  gx: number,
  gy: number,
  t: number,
  s1: WaveSource,
  s2: WaveSource,
  params: WaveParams,
): number {
  const λGrid = params.speed / params.frequency / GRID_SCALE
  const k = (2 * Math.PI) / λGrid
  const ω = 2 * Math.PI * params.frequency

  let total = 0

  const addWave = (sx: number, sy: number) => {
    const dx = gx - sx
    const dy = gy - sy
    const r = Math.sqrt(dx * dx + dy * dy)
    total += params.amplitude * Math.cos(k * r - ω * t)
  }

  if (s1.enabled) addWave(s1.x, s1.y)
  if (s2.enabled) addWave(s2.x, s2.y)

  return Math.max(-1, Math.min(1, total))
}

// Map amplitude [-1, +1] to an RGB colour.
// amp = -1 → near-black (0, 0, 10)
// amp =  0 → medium blue (50, 57, 132)
// amp = +1 → bright cyan (200, 230, 255)
export function amplitudeToColor(amp: number): [number, number, number] {
  const v = (amp + 1) * 0.5  // 0..1
  const v2 = v * v            // quadratic: accentuates bright peaks
  return [
    Math.round(v2 * 200),
    Math.round(v2 * 230),
    Math.round(10 + v * 245),
  ]
}
