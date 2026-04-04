import type { Metadata } from 'next'
import Link from 'next/link'
import { tools } from '@/tools/registry'

export const metadata: Metadata = {
  title: 'Kitsune Chaos — Interactive STEM Tools',
  description:
    'Free, open-source interactive tools for physics, electronics, and more. Learn by doing.',
}

export default function HomePage() {
  const liveTools = tools.filter((t) => t.status === 'live')

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section className="hero-section">
        {/* Animated orbs — hidden on mobile via .hero-orb */}
        <div
          aria-hidden
          className="hero-orb"
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          className="hero-orb"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />

        <div
          className="stagger-children"
          style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Live pill */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              border: '1px solid rgba(34,197,94,0.25)',
              backgroundColor: 'rgba(34,197,94,0.06)',
              color: '#22c55e',
              borderRadius: 'var(--radius-full)',
              padding: '0.375rem 1rem',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'var(--fw-medium)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 2s infinite',
                display: 'inline-block',
              }}
            />
            {liveTools.length} tools live · building in public
          </div>

          <h1
            className="animate-fade-in-up"
            style={{
              fontSize: 'var(--fs-hero)',
              fontWeight: 'var(--fw-bold)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 'var(--space-lg)',
            }}
          >
            Interactive{' '}
            <span className="gradient-text">STEM Tools</span>
          </h1>

          <p
            className="animate-fade-in-up"
            style={{
              fontSize: 'var(--fs-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto var(--space-xl)',
            }}
          >
            Physics simulations and electronics calculators you can actually play with.
            No ads. No accounts. No fluff.
          </p>

          <div
            className="animate-fade-in-up hero-cta"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-md)',
            }}
          >
            <Link
              href="/overview"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.5rem',
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-semibold)',
                background: 'var(--gradient-primary)',
                color: 'var(--bg-primary)',
                transition: 'opacity var(--transition-fast)',
                display: 'inline-block',
              }}
            >
              Explore Tools
            </Link>
            <Link
              href="/blog"
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.5rem',
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-semibold)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                transition: 'all var(--transition-fast)',
                display: 'inline-block',
              }}
            >
              Read the Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured tools */}
      <section
        style={{
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
      >
        <div className="container" style={{ padding: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-xl)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--fs-2xl)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: '-0.02em',
              }}
            >
              Featured Tools
            </h2>
            <Link
              href="/overview"
              style={{
                fontSize: 'var(--fs-sm)',
                color: 'var(--text-muted)',
                transition: 'color var(--transition-fast)',
              }}
            >
              View All →
            </Link>
          </div>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gap: 'var(--space-md)',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {liveTools.map((tool, i) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="project-card animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Glow overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    background: 'var(--gradient-card)',
                    transition: 'opacity var(--transition-base)',
                    pointerEvents: 'none',
                    zIndex: 0,
                    borderRadius: 'var(--radius-lg)',
                  }}
                />

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
                    <span style={{ fontSize: 'var(--fs-sm)' }}>{tool.icon}</span>
                    <span className="label-category">{tool.category}</span>
                  </div>
                  <span className="tag tag--live">live</span>
                </div>

                {/* Thumbnail */}
                <div style={{ padding: 'var(--space-md)', position: 'relative', zIndex: 1 }}>
                  <div className="card-thumbnail">
                    <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1, filter: 'grayscale(0.1)' }}>
                      {tool.icon}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: '0 var(--space-md) var(--space-md)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'var(--fs-lg)',
                      fontWeight: 'var(--fw-bold)',
                      marginBottom: 'var(--space-sm)',
                      letterSpacing: '-0.01em',
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section
        style={{
          padding: 'var(--space-3xl) var(--space-xl)',
        }}
      >
        <div className="container" style={{ padding: 0 }}>
          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gap: 'var(--space-3xl)',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            }}
          >
            {[
              {
                title: 'Learn by doing',
                body: 'Move a slider and watch the physics change in real time — the best way to build intuition.',
              },
              {
                title: 'Open source',
                body: 'Every formula, every animation, every line of code is public. Fork it, learn from it, contribute.',
              },
              {
                title: 'No friction',
                body: 'No sign-up, no paywall, no ads. Load a tool and start exploring immediately.',
              },
            ].map((item) => (
              <div key={item.title} className="animate-fade-in-up">
                <div
                  style={{
                    marginBottom: 'var(--space-md)',
                    height: '1px',
                    width: '32px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-primary)',
                  }}
                />
                <h3
                  style={{
                    fontSize: 'var(--fs-base)',
                    fontWeight: 'var(--fw-semibold)',
                    marginBottom: 'var(--space-sm)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
