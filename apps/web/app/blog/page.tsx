import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Building Kitsune Chaos in public — design decisions, physics write-ups, and dev logs.',
  alternates: {
    canonical: 'https://kitsunechaos.com/blog',
  },
  openGraph: {
    title: 'Blog — Kitsune Chaos',
    description: 'Building Kitsune Chaos in public — design decisions, physics write-ups, and dev logs.',
    url: 'https://kitsunechaos.com/blog',
    siteName: 'Kitsune Chaos',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Blog — Kitsune Chaos',
    description: 'Building Kitsune Chaos in public — design decisions, physics write-ups, and dev logs.',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Blog</h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Building in public — thoughts on physics, interactive learning, and making this site.
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {posts.map((post) => (
            <article key={post.slug} className="blog-card py-8" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="group mt-2 block">
                <h2 className="text-xl font-semibold transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md px-2 py-0.5 text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
