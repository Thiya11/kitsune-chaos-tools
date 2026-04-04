'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface ToolMeta {
  name: string
  slug: string
  category: string
  description: string
}

export interface ToolShellProps {
  meta: ToolMeta
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function ToolShell({ meta, children, sidebar }: ToolShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Tool header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--fs-xs)',
              fontWeight: 'var(--fw-semibold)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
            }}
          >
            {meta.category}
          </span>
          <span style={{ color: 'var(--border-color)' }}>/</span>
          <h1
            style={{
              fontSize: 'var(--fs-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {meta.name}
          </h1>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {meta.description}
          </span>
        </div>
      </div>

      {/* Tool body */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          maxWidth: '80rem',
          margin: '0 auto',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        {sidebar && (
          <aside
            style={{
              width: '17rem',
              flexShrink: 0,
              borderRight: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              overflowY: 'auto',
            }}
          >
            {sidebar}
          </aside>
        )}

        {/* Canvas / main area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </main>
      </div>
    </motion.div>
  )
}
