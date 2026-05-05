'use client'

import dynamic from 'next/dynamic'
import { ToolSkeleton } from './ToolSkeleton'

const OhmsLaw = dynamic(
  () => import('@kitsunechaos/tools').then((m) => ({ default: m.OhmsLaw })),
  { ssr: false, loading: () => <ToolSkeleton /> },
)

const PendulumSim = dynamic(
  () => import('@kitsunechaos/tools').then((m) => ({ default: m.PendulumSim })),
  { ssr: false, loading: () => <ToolSkeleton /> },
)

const LensFormulaSimulator = dynamic(
  () => import('@kitsunechaos/tools').then((m) => ({ default: m.LensFormulaSimulator })),
  { ssr: false, loading: () => <ToolSkeleton /> },
)

const WaveInterference = dynamic(
  () => import('@kitsunechaos/tools').then((m) => ({ default: m.WaveInterference })),
  { ssr: false, loading: () => <ToolSkeleton /> },
)

const COMPONENTS: Record<string, React.ComponentType> = {
  'ohms-law': OhmsLaw,
  pendulum: PendulumSim,
  'lens-formula-simulator': LensFormulaSimulator,
  'wave-interference': WaveInterference,
}

export function ToolLoader({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug]
  if (!Component) return null
  return <Component />
}
