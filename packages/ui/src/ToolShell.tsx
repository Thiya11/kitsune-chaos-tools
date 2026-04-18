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
      className="tool-shell-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Tool header */}
      <div
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="tool-shell-header" style={{ maxWidth: '90rem', margin: '0 auto' }}>
          {/* Breadcrumb row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            <span style={{ color: 'var(--border-color)', fontSize: 'var(--fs-xs)' }}>/</span>
            <h1
              style={{
                fontSize: 'var(--fs-sm)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--text-primary)',
              }}
            >
              {meta.name}
            </h1>
          </div>
          {/* Description */}
          <p
            className="tool-shell-desc"
            style={{
              fontSize: 'var(--fs-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {meta.description}
          </p>
        </div>
      </div>

      {/* Tool body */}
      <div className="tool-shell-body">
        {/* Sidebar */}
        {sidebar && (
          <aside className="tool-shell-sidebar">
            {sidebar}
          </aside>
        )}

        {/* Canvas / main area */}
        <main
          className="tool-shell-main"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
        >
          {children}
        </main>
      </div>
    </motion.div>
  )
}
