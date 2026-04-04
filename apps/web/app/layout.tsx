import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kitsune Chaos',
    template: '%s | Kitsune Chaos',
  },
  description: 'Interactive STEM tools for physics, electronics, and more — built in the open.',
  metadataBase: new URL('https://kitsunechaos.com'),
  openGraph: {
    type: 'website',
    siteName: 'Kitsune Chaos',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Background layers */}
        <div className="layout__bg-gradient" aria-hidden />
        <div className="layout__bg-noise" aria-hidden />
        <div className="layout__halftone" aria-hidden />

        {/* Nav */}
        <nav
          className="glass"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: 'var(--nav-height)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            className="container"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                fontSize: 'var(--fs-xl)',
                fontWeight: 'var(--fw-bold)',
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <img alt="Kitsune Chaos" className="h-[32px] w-auto" src="/brand/favicon.ico" />
              <span className="tracking-widest">KITSUNE<span className="gradient-text">CHAOS</span></span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Link href="/overview" className="nav-link">Tools</Link>
              <Link href="/blog"     className="nav-link">Blog</Link>
              <a
                href="https://github.com/Thiya11/kitsune-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        <footer
          style={{
            position: 'relative',
            padding: 'var(--space-3xl) 0 var(--space-xl)',
            borderTop: '1px solid var(--border-color)',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <div className="footer__glow" aria-hidden />

          <div className="container">
            {/* Footer top */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 'var(--space-2xl)',
                marginBottom: 'var(--space-2xl)',
                flexWrap: 'wrap',
              }}
            >
              {/* Brand */}
              <div style={{ maxWidth: '300px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    fontSize: 'var(--fs-xl)',
                    fontWeight: 'var(--fw-bold)',
                    letterSpacing: '-0.02em',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  <img alt="Kitsune Chaos" className="h-[32px] w-auto" src="/brand/favicon.ico" />
                  <span>Kitsune Chaos</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                  Developing in the open.
                </p>
              </div>

              {/* Nav groups */}
              <div style={{ display: 'flex', gap: 'var(--space-3xl)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <span
                    style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 'var(--space-xs)',
                    }}
                  >
                    Navigate
                  </span>
                  {[
                    { label: 'Home',     href: '/' },
                    { label: 'Tools',    href: '/overview' },
                    { label: 'Blog',     href: '/blog' },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                      className="footer-link"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <span
                    style={{
                      fontSize: 'var(--fs-xs)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 'var(--space-xs)',
                    }}
                  >
                    Connect
                  </span>
                  {[
                    { label: 'GitHub',   href: 'https://github.com/Thiya11' },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer bottom */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 'var(--space-xl)',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: 'var(--space-sm)',
              }}
            >
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Kitsune Choas — Built in public
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-muted)',
                }}
              >
                Next.js + Turborepo
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
