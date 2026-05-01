import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getToolBySlug, getLiveTools, type ToolEntry } from '@/tools/registry'
import { ToolLoader } from '@/components/ToolLoader'

interface Props {
  params: Promise<{ slug: string }>
}

const SITE_URL = 'https://kitsunechaos.com'

export async function generateStaticParams() {
  return getLiveTools().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  const title = tool.seoTitle ?? tool.name
  const description = tool.seoDescription ?? tool.description
  const path = `/tools/${tool.slug}`

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: 'Kitsune Chaos',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool || tool.status !== 'live') notFound()

  const jsonLd = buildToolJsonLd(tool)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <ToolLoader slug={slug} />

      <article className="container prose-kitsune tool-seo-content">
        <header className="tool-seo-header">
          <span className="label-category">{tool.category}</span>
          <h1>{tool.name}</h1>
          <p>{tool.seoDescription ?? tool.description}</p>
        </header>

        {tool.formula && (
          <section className="tool-formula" aria-labelledby="formula-heading">
            <h2 id="formula-heading">{tool.formula.title}</h2>
            <p className="tool-formula-expression">{tool.formula.expression}</p>
            <p>{tool.formula.body}</p>
          </section>
        )}

        {tool.guide?.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        {!!tool.examples?.length && (
          <section>
            <h2>Practical examples</h2>
            <div className="tool-example-grid">
              {tool.examples.map((example) => (
                <div key={example.title} className="tool-example">
                  <h3>{example.title}</h3>
                  <p>{example.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!!tool.faqs?.length && (
          <section>
            <h2>FAQ</h2>
            <div className="tool-faq-list">
              {tool.faqs.map((faq) => (
                <details key={faq.question} className="tool-faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {!!tool.relatedTools?.length && (
          <nav aria-label="Related tools" className="tool-related-links">
            <h2>Related tools</h2>
            <div>
              {tool.relatedTools.map((related) => (
                <Link key={related.href} href={related.href}>
                  <span>{related.label}</span>
                  <small>{related.description}</small>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </article>
    </>
  )
}

function buildToolJsonLd(tool: ToolEntry) {
  const url = `${SITE_URL}/tools/${tool.slug}`
  const description = tool.seoDescription ?? tool.description

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      description,
      keywords: tool.keywords?.join(', '),
      isAccessibleForFree: true,
      publisher: {
        '@type': 'Organization',
        name: 'Kitsune Chaos',
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tools',
          item: `${SITE_URL}/overview`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: url,
        },
      ],
    },
    ...(tool.faqs?.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ]
}
