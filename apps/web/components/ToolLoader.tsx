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

const COMPONENTS: Record<string, React.ComponentType> = {
  'ohms-law': OhmsLaw,
  pendulum: PendulumSim,
}

export function ToolLoader({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug]
  if (!Component) return null
  return <Component />
}
