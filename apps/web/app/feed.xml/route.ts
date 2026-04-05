import { getAllPosts } from '@/lib/blog'

const BASE_URL = 'https://kitsunechaos.com'

export const dynamic = 'force-static'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map((post) => {
      const url = `${BASE_URL}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('')

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <author>${escapeXml(post.author)}</author>
      ${categories}
    </item>`
    })
    .join('')

  const lastBuildDate =
    posts[0] != null ? new Date(posts[0].date ?? new Date()).toUTCString() : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Kitsune Chaos Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Interactive STEM tools for physics, electronics, and more — built in the open.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
