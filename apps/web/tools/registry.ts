export type ToolStatus = 'live' | 'wip' | 'planned'
export type ToolCategory = 'electronics' | 'physics' | 'chemistry' | 'math'

export interface ToolEntry {
  slug: string
  name: string
  category: ToolCategory
  description: string
  component: string
  status: ToolStatus
  /** Icon character or emoji — keep it short */
  icon?: string
}

export const tools: ToolEntry[] = [
  {
    slug: 'ohms-law',
    name: "Ohm's Law Calculator",
    category: 'electronics',
    description: 'Solve for voltage, current, or resistance interactively with a live circuit diagram.',
    component: 'OhmsLaw',
    status: 'live',
    icon: '⚡',
  },
  {
    slug: 'pendulum',
    name: 'Pendulum Simulator',
    category: 'physics',
    description: 'Visualize simple harmonic motion with a live animated pendulum and period readout.',
    component: 'PendulumSim',
    status: 'live',
    icon: '🔵',
  },
]

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getLiveTools(): ToolEntry[] {
  return tools.filter((t) => t.status === 'live')
}
