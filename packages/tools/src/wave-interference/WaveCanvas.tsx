'use client'

import React, { useRef, useEffect } from 'react'
import {
  computeAmplitude,
  amplitudeToColor,
  computeFringePositions,
  type WaveParams,
  type WaveSource,
} from '@kitsunechaos/physics'

// Low-res grid: render 150×100 pixels, then scale 4× to 600×400.
// This processes 15 000 pixels instead of 240 000 — 16× faster.
const GRID_W = 150
const GRID_H = 100

// Canvas dimensions (canvas x of both sources × 4 = 120; screen L = 600 − 120 = 480)
const CANVAS_L = 480

interface WaveCanvasProps {
  waveParams: WaveParams
  sources: [WaveSource, WaveSource]
  playing: boolean
  width?: number
  height?: number
}

export function WaveCanvas({
  waveParams,
  sources,
  playing,
  width = 600,
  height = 400,
}: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tRef      = useRef(0)
  const rafRef    = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Offscreen canvas for low-res rendering ——————————————————————————————
    let offscreen: HTMLCanvasElement | OffscreenCanvas
    let offCtx: CanvasRenderingContext2D

    if (typeof OffscreenCanvas !== 'undefined') {
      const ofc = new OffscreenCanvas(GRID_W, GRID_H)
      offscreen = ofc
      offCtx    = ofc.getContext('2d') as unknown as CanvasRenderingContext2D
    } else {
      const el  = document.createElement('canvas')
      el.width  = GRID_W
      el.height = GRID_H
      offscreen = el
      offCtx    = el.getContext('2d')!
    }

    // Derived fringe geometry ——————————————————————————————————————————————
    const sep          = Math.abs(sources[1].y - sources[0].y)   // grid units
    const fringePositions = computeFringePositions(waveParams, sep)

    const λc           = waveParams.speed / waveParams.frequency  // canvas px
    const dc           = sep * 4                                   // canvas px
    const spacingCanvas = dc > 0 ? (λc * CANVAS_L) / dc : 0       // fringe spacing, canvas px
    const cy_canvas    = (sources[0].y + sources[1].y) / 2 * 4    // canvas y of midpoint

    // ─────────────────────────────────────────────────────────────────────
    const renderFrame = (t: number) => {
      // 1. Wave pixel pass (offscreen, GRID_W × GRID_H) ——————————————————
      const imageData = offCtx.createImageData(GRID_W, GRID_H)
      const data      = imageData.data

      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const amp     = computeAmplitude(x, y, t, sources[0], sources[1], waveParams)
          const [r, g, b] = amplitudeToColor(amp)
          const i       = (y * GRID_W + x) * 4
          data[i]     = r
          data[i + 1] = g
          data[i + 2] = b
          data[i + 3] = 255
        }
      }

      offCtx.putImageData(imageData, 0, 0)

      // 2. Scale 4× onto main canvas, no smoothing (keeps sharp pixel look) ——
      ctx.save()
      ctx.scale(4, 4)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(offscreen as CanvasImageSource, 0, 0)
      ctx.restore()

      // 3. Nodal lines (destructive interference guides) ————————————————
      const bothActive = sources[0].enabled && sources[1].enabled
      if (bothActive && fringePositions.length > 0) {
        const midX = sources[0].x * 4
        const midY = cy_canvas

        ctx.save()
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth   = 1

        for (const yF of fringePositions) {
          ctx.beginPath()
          ctx.moveTo(midX, midY)
          ctx.lineTo(width, yF * 4)
          ctx.stroke()
        }
        ctx.setLineDash([])
        ctx.restore()
      }

      // 4. Source dots + pulsing emission rings ——————————————————————————
      for (const src of sources) {
        if (!src.enabled) continue
        const sx = src.x * 4
        const sy = src.y * 4

        // Pulsing ring: cycles with wave period, fades as it expands
        const ringRadius = 5 + (t * waveParams.frequency * 20) % 20
        const ringOpacity = Math.max(0, 1 - (ringRadius - 5) / 20)
        ctx.save()
        ctx.strokeStyle = `rgba(100, 180, 255, ${ringOpacity.toFixed(3)})`
        ctx.lineWidth   = 1.5
        ctx.beginPath()
        ctx.arc(sx, sy, ringRadius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Filled white dot with blue border
        ctx.save()
        ctx.fillStyle   = 'white'
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth   = 2
        ctx.beginPath()
        ctx.arc(sx, sy, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }

      // 5. Fringe markers on right edge ——————————————————————————————————
      if (bothActive && spacingCanvas > 0) {
        ctx.save()
        ctx.font      = '10px monospace'
        ctx.textAlign = 'right'

        for (let m = -3; m <= 3; m += 0.5) {
          const yc = cy_canvas + m * spacingCanvas
          if (yc < 0 || yc > height) continue

          const isConstructive = Number.isInteger(m)
          const opacity        = isConstructive ? 0.85 : 0.4

          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.lineWidth   = isConstructive ? 2 : 1
          ctx.beginPath()
          ctx.moveTo(width - 15, yc)
          ctx.lineTo(width - 2,  yc)
          ctx.stroke()

          if (isConstructive) {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.fillText(`m=${m}`, width - 18, yc + 4)
          }
        }
        ctx.restore()
      }
    }

    // RAF loop ——————————————————————————————————————————————————————————————
    let lastTime = performance.now()

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now
      if (playing) tRef.current += dt
      renderFrame(tRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, waveParams, sources, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', width, height, background: '#050A1E' }}
    />
  )
}
