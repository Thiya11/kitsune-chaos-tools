import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Building Kitsune Chaos in public — design decisions, physics write-ups, and dev logs.',
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">Blog</h1>
        <p className="mt-2 text-zinc-400">
          Building in public — thoughts on physics, interactive learning, and making this site.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col divide-y divide-zinc-800/60">
          {posts.map((post) => (
            <article key={post.slug} className="py-8 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="group mt-2 block">
                <h2 className="text-xl font-semibold text-zinc-100 transition-colors group-hover:text-brand-300">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-zinc-400">{post.description}</p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
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
