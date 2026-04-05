import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Kitsune Chaos — an open-source collection of interactive STEM tools built for students, educators, and curious minds.',
  alternates: { canonical: 'https://kitsunechaos.com/about' },
  openGraph: {
    title: 'About — Kitsune Chaos',
    description: 'Learn about Kitsune Chaos — an open-source collection of interactive STEM tools built for students, educators, and curious minds.',
    url: 'https://kitsunechaos.com/about',
    siteName: 'Kitsune Chaos',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About — Kitsune Chaos',
    description: 'Learn about Kitsune Chaos — an open-source collection of interactive STEM tools built for students, educators, and curious minds.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Kitsune Chaos',
  url: 'https://kitsunechaos.com/about',
  description: 'Learn about Kitsune Chaos — an open-source collection of interactive STEM tools built for students, educators, and curious minds.',
  publisher: {
    '@type': 'Organization',
    name: 'Kitsune Chaos',
    url: 'https://kitsunechaos.com',
  },
  author: {
    '@type': 'Person',
    name: 'Thiyagu Arunachalam',
    url: 'https://github.com/Thiya11',
  },
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          About Kitsune Chaos
        </h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Interactive STEM tools for physics, electronics, and more — built in the open, free forever.
        </p>
      </header>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '3rem' }} />

      {/* What is Kitsune Chaos */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          What is Kitsune Chaos?
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--fs-base)' }} className="flex flex-col gap-4">
          <p>
            Kitsune Chaos is a collection of interactive STEM tools designed for anyone who learns
            better by doing. Move a slider, change a variable, and watch the physics respond in real
            time — no textbook static diagrams, no passive reading.
          </p>
          <p>
            The tools cover physics simulations, electronics calculators, and more. Every tool runs
            entirely in your browser with no account, no paywall, and no ads.
          </p>
          <p>
            The project is fully open source under the MIT license. The source code is on GitHub —
            you can read it, learn from it, contribute to it, or build on it.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          The mission
        </h2>
        <div
          style={{
            borderLeft: '2px solid var(--border-color)',
            paddingLeft: '1.5rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
            fontSize: 'var(--fs-base)',
          }}
          className="flex flex-col gap-4"
        >
          <p>
            Good interactive learning tools are rare. Most are paywalled, unmaintained, or built on
            dying technology. The ones that survive tend to be simple enough to stay fast and focused
            enough to actually teach something.
          </p>
          <p>
            Kitsune Chaos exists to build those tools and keep them free. The focus is depth over
            breadth — a small set of excellent simulators beats a hundred mediocre ones.
          </p>
        </div>
      </section>

      {/* Tech */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          How it's built
        </h2>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--fs-base)' }} className="flex flex-col gap-4">
          <p>
            The project is a Turborepo monorepo. The physics and tool logic live in separate packages
            with no Next.js dependency — pure TypeScript functions and React components that could run
            anywhere. The Next.js app is just the shell that handles routing, SEO, and this blog.
          </p>
          <p>
            This separation means the math can be unit-tested independently, the tools can be embedded
            in other projects, and the architecture can scale as new tools are added without the whole
            thing becoming a monolith.
          </p>
        </div>

        <div
          className="mt-6 grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
        >
          {[
            { label: 'Framework', value: 'Next.js (App Router)' },
            { label: 'Language', value: 'TypeScript (strict)' },
            { label: 'Monorepo', value: 'Turborepo' },
            { label: 'Styling', value: 'Tailwind CSS' },
            { label: 'License', value: 'MIT' },
            { label: 'Hosting', value: 'kitsunechaos.com' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '3rem' }} />

      {/* About the creator */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          About the creator
        </h2>

        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row gap-6"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          {/* Avatar placeholder */}
          <div
            className="shrink-0 flex items-center justify-center rounded-full"
            style={{
              width: '72px',
              height: '72px',
              background: 'var(--gradient-primary)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: 'var(--bg-primary)',
            }}
          >
            T
          </div>

          <div>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Thiyagu Arunachalam
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
              Builder · Kitsune Chaos
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.8 }} className="flex flex-col gap-3">
              <p>
                Developer and the person behind Kitsune Chaos. I build interactive tools because static
                diagrams never worked for me — I need to move things to understand them.
              </p>
              <p>
                The project started as a personal tool collection and turned into something worth
                sharing. I build it in public, write about the decisions on the blog, and keep
                everything open source.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://github.com/Thiya11"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                GitHub →
              </a>
              <a
                href="https://www.linkedin.com/in/thiyagu-arunachalam-b6a901159/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                LinkedIn →
              </a>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--fs-sm)',
                }}
              >
                Blog →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Want to contribute?
          </h3>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            The project is open source. Bug reports, feature suggestions, and pull requests are welcome.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/Thiya11/kitsune-chaos-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--gradient-primary)', color: 'var(--bg-primary)' }}
            >
              View on GitHub
            </a>
            <Link
              href="/contact"
              className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
