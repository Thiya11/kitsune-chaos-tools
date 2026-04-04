import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  /** Reading time string, e.g. "4 min read" */
  readingTime: string
  content: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    // Rough reading time: ~200 words per minute
    const words = content.split(/\s+/).length
    const minutes = Math.max(1, Math.round(words / 200))
    const readingTime = `${minutes} min read`

    return {
      slug,
      title: data['title'] as string ?? slug,
      date: data['date'] as string ?? '',
      description: data['description'] as string ?? '',
      tags: (data['tags'] as string[]) ?? [],
      readingTime,
    }
  })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const words = content.split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))

  return {
    slug,
    title: data['title'] as string ?? slug,
    date: data['date'] as string ?? '',
    description: data['description'] as string ?? '',
    tags: (data['tags'] as string[]) ?? [],
    readingTime: `${minutes} min read`,
    content,
  }
}
