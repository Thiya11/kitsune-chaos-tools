import type { Metadata } from 'next'
import Link from 'next/link'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { MobileNav } from '@/components/MobileNav'
import { CookieConsentManager } from '@/components/CookieConsentManager'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kitsune Chaos',
    template: '%s | Kitsune Chaos',
  },
  description: 'Interactive STEM tools for physics, electronics, and more — built in the open.',
  metadataBase: new URL('https://kitsunechaos.com'),
  alternates: {
    types: {
      'application/rss+xml': 'https://kitsunechaos.com/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Kitsune Chaos',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-primary)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <CookieConsentManager />
      <ThemeProvider>
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
            overflow: 'visible',
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
              <img alt="Kitsune Chaos" className="logo-img h-[38px] w-[38px] rounded-full object-contain bg-white p-0.5" src="/brand/logo.png" />
              <span className="tracking-widest nav-logo-text">KITSUNE<span className="gradient-text">CHAOS</span></span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Link href="/overview" className="nav-link">Tools</Link>
              <Link href="/blog"     className="nav-link">Blog</Link>
              <a
                href="https://github.com/Thiya11/kitsune-chaos-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                GitHub
              </a>
              <ThemeToggle />
            </div>

            {/* Mobile nav */}
            <div className="flex md:hidden" style={{ alignItems: 'center', gap: 'var(--space-sm)' }}>
              <MobileNav />
            </div>
          </div>
        </nav>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer__glow" aria-hidden />
          <div className="container">
            <div className="footer-top">
              {/* Brand */}
              <div style={{ maxWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', letterSpacing: '-0.02em', marginBottom: 'var(--space-sm)' }}>
                  <img alt="Kitsune Chaos" className="logo-img h-[38px] w-[38px] rounded-full object-contain bg-white p-0.5" src="/brand/logo.png" />
                  <span>Kitsune Chaos</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
                  Developing in the open.
                </p>
              </div>

              {/* Nav groups */}
              <div className="footer-nav-groups">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-xs)' }}>
                    Navigate
                  </span>
                  {[{ label: 'Home', href: '/' }, { label: 'Tools', href: '/overview' }, { label: 'Blog', href: '/blog' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((l) => (
                    <Link key={l.href} href={l.href} className="footer-link" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-xs)' }}>
                    Connect
                  </span>
                  <a href="https://github.com/Thiya11" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}>
                    GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/thiyagu-arunachalam-b6a901159/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}>
                    LinkedIn
                  </a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-xs)' }}>
                    Legal
                  </span>
                  {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }].map((l) => (
                    <Link key={l.href} href={l.href} className="footer-link" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', transition: 'color var(--transition-fast)' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer bottom */}
            <div style={{ paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Kitsune Chaos — Built in public
              </span>
            </div>
          </div>
        </footer>
      </ThemeProvider>
      </body>
    </html>
  )
}
