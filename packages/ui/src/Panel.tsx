'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface PanelProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        transition: 'border-color var(--transition-base)',
      }}
    >
      {title && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--fs-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--accent-primary)',
            marginBottom: '0.875rem',
          }}
        >
          {title}
        </p>
      )}
      {children}
    </motion.div>
  )
}
