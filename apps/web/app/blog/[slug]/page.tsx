import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: 'var(--text-muted)' }}
      >
        ← All posts
      </Link>

      {/* Post header */}
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>{post.title}</h1>
        <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>{post.description}</p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2.5 py-1 text-xs font-medium"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* MDX content */}
      <article className="prose-kitsune">
        <MDXRemote source={post.content} />
      </article>

      {/* Footer nav */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Back to all posts
        </Link>
      </div>
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
