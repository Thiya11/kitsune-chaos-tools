'use client'

import { useState } from 'react'
import {
  getSourcePositions,
  getWavelength,
  computeFringePositions,
  type WaveParams,
  type WaveSource,
} from '@kitsunechaos/physics'

export function useWaveInterference() {
  const [frequency, setFrequency]   = useState(1.5)
  const [amplitude, setAmplitude]   = useState(0.7)
  const [separation, setSeparation] = useState(20)
  const [source2On, setSource2On]   = useState(true)
  const [playing, setPlaying]       = useState(true)

  const waveParams: WaveParams = { frequency, amplitude, speed: 30 }

  const rawSources = getSourcePositions(separation)
  const sources: [WaveSource, WaveSource] = [
    rawSources[0],
    { ...rawSources[1], enabled: source2On },
  ]

  const wavelength      = getWavelength(waveParams)
  const fringePositions = computeFringePositions(waveParams, separation)

  return {
    frequency,  setFrequency,
    amplitude,  setAmplitude,
    separation, setSeparation,
    source2On,  setSource2On,
    playing,    setPlaying,
    waveParams,
    sources,
    wavelength,
    fringePositions,
  }
}
