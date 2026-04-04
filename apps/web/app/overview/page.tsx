import type { Metadata } from 'next'
import Link from 'next/link'
import { tools, type ToolCategory } from '@/tools/registry'

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse all interactive STEM tools — physics simulators, electronics calculators, and more.',
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  electronics: 'Electronics',
  physics: 'Physics',
  chemistry: 'Chemistry',
  math: 'Mathematics',
}

export default function OverviewPage() {
  const categories = [...new Set(tools.map((t) => t.category))]

  return (
    <div
      className="container page-enter"
      style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 'var(--space-3xl)' }}>
        <h1
          style={{
            fontSize: 'var(--fs-3xl)',
            fontWeight: 'var(--fw-bold)',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}
        >
          All Tools
        </h1>
        <p style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {tools.filter((t) => t.status === 'live').length} live · {tools.length} total
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat)
          return (
            <section key={cat}>
              {/* Section divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <span className="label-category">{CATEGORY_LABELS[cat]}</span>
                <span
                  style={{
                    flex: 1,
                    height: '1px',
                    background: 'var(--border-subtle)',
                  }}
                />
              </div>

              <div
                className="stagger-children"
                style={{
                  display: 'grid',
                  gap: 'var(--space-md)',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
              >
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) {
  const isLive = tool.status === 'live'
  const Wrapper = isLive ? Link : 'div'
  const wrapperProps = isLive ? { href: `/tools/${tool.slug}` } : {}

  const statusTag = {
    live:    <span className="tag tag--live">live</span>,
    wip:     <span className="tag tag--wip">wip</span>,
    planned: <span className="tag tag--planned">planned</span>,
  }[tool.status]

  return (
    // @ts-expect-error — conditional element type
    <Wrapper
      {...wrapperProps}
      className={['project-card animate-fade-in-up', !isLive ? 'opacity-60' : ''].join(' ')}
      style={{ cursor: isLive ? 'pointer' : 'default' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-md) var(--space-md) 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: 'var(--fs-sm)' }}>{tool.icon ?? '🔬'}</span>
          <span className="label-category">{tool.category}</span>
        </div>
        {statusTag}
      </div>

      {/* Thumbnail */}
      <div style={{ padding: 'var(--space-md)', position: 'relative', zIndex: 1 }}>
        <div className="card-thumbnail">
          <span
            style={{
              fontSize: '2.5rem',
              position: 'relative',
              zIndex: 1,
              transition: 'transform var(--transition-slow)',
              filter: 'grayscale(0.1)',
            }}
          >
            {tool.icon ?? '🔬'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0 var(--space-md) var(--space-md)', position: 'relative', zIndex: 1, flex: 1 }}>
        <h3
          style={{
            fontSize: 'var(--fs-lg)',
            fontWeight: 'var(--fw-bold)',
            marginBottom: 'var(--space-sm)',
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            transition: 'color var(--transition-fast)',
          }}
        >
          {tool.name}
        </h3>
        <p
          style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {tool.description}
        </p>

        {/* Tags */}
        <div style={{ marginTop: 'var(--space-md)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          <span className="tag-pill">{tool.category}</span>
          {isLive && <span className="tag-pill">interactive</span>}
        </div>
      </div>
    </Wrapper>
  )
}
