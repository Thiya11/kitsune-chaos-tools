'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'

const NAV_LINKS = [
  { label: 'Tools',  href: '/overview',                                      external: false },
  { label: 'Blog',   href: '/blog',                                           external: false },
  { label: 'GitHub', href: 'https://github.com/Thiya11/kitsune-chaos-tools', external: true  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '5px',
          width: '36px',
          height: '36px',
          padding: '7px 6px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          background: 'transparent',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              height: '1.5px',
              background: 'var(--text-primary)',
              borderRadius: '2px',
              transition: 'transform 0.25s ease, opacity 0.25s ease',
              transformOrigin: 'center',
              transform:
                open && i === 0 ? 'translateY(6.5px) rotate(45deg)'  :
                open && i === 2 ? 'translateY(-6.5px) rotate(-45deg)' :
                'none',
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          zIndex: 49,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'var(--space-md) var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          transform: open ? 'translateY(0)' : 'translateY(-120%)',
          visibility: open ? 'visible' : 'hidden',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear ' + (open ? '0s' : '0.3s'),
        }}
      >
        {NAV_LINKS.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              style={{
                fontSize: 'var(--fs-base)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--text-secondary)',
                padding: 'var(--space-md) 0',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {item.label}
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>↗</span>
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                fontSize: 'var(--fs-base)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--text-secondary)',
                padding: 'var(--space-md) 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              {item.label}
            </Link>
          )
        )}

        {/* Theme row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-md)',
          }}
        >
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
            {theme === 'dark' ? 'Dark mode' : 'Light mode'}
          </span>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </>
  )
}
