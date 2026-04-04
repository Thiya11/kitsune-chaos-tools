import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolBySlug, getLiveTools } from '@/tools/registry'
import { ToolLoader } from '@/components/ToolLoader'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getLiveTools().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: tool.name,
      description: tool.description,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool || tool.status !== 'live') notFound()

  return (
    <>
      {/*
        Server-rendered crawlable text for SEO.
        Visually hidden — search engines will index it.
      */}
      <div className="sr-only">
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
        <p>Category: {tool.category}</p>
      </div>

      {/* Client-rendered interactive tool, loaded with ssr: false */}
      <ToolLoader slug={slug} />
    </>
  )
}
