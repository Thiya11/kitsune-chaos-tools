import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Kitsune Chaos team — bug reports, feature requests, or just to say hello.',
  alternates: { canonical: 'https://kitsunechaos.com/contact' },
  openGraph: {
    title: 'Contact — Kitsune Chaos',
    description: 'Get in touch with the Kitsune Chaos team — bug reports, feature requests, or just to say hello.',
    url: 'https://kitsunechaos.com/contact',
    siteName: 'Kitsune Chaos',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact — Kitsune Chaos',
    description: 'Get in touch with the Kitsune Chaos team — bug reports, feature requests, or just to say hello.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — Kitsune Chaos',
  url: 'https://kitsunechaos.com/contact',
  description: 'Get in touch with the Kitsune Chaos team — bug reports, feature requests, or just to say hello.',
  publisher: {
    '@type': 'Organization',
    name: 'Kitsune Chaos',
    url: 'https://kitsunechaos.com',
    email: 'support@kitsunechaos.com',
    sameAs: [
      'https://github.com/Thiya11/kitsune-chaos-tools',
    ],
  },
}

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-12">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Get in touch
        </h1>
        <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Bug report, feature idea, or just want to say hello — here's how to reach us.
        </p>
      </header>

      <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '3rem' }} />

      {/* Contact options */}
      <div className="flex flex-col gap-4 mb-12">

        {/* GitHub Issues — primary */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: '44px', height: '44px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '1.25rem' }}
            >
              🐛
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Bug reports &amp; feature requests
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                The best place for bugs, broken tools, or ideas for new features. GitHub Issues keeps
                everything tracked and visible so others can follow along or add context.
              </p>
              <a
                href="https://github.com/Thiya11/kitsune-chaos-tools/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md px-4 py-2 text-sm font-semibold"
                style={{ background: 'var(--gradient-primary)', color: 'var(--bg-primary)' }}
              >
                Open an issue on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* GitHub Discussions */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: '44px', height: '44px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '1.25rem' }}
            >
              💬
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Questions &amp; general discussion
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Questions about the code, the math behind a tool, or how to build on top of the
                packages — GitHub Discussions is the right place.
              </p>
              <a
                href="https://github.com/Thiya11/kitsune-chaos-tools/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md px-4 py-2 text-sm font-semibold"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Start a discussion
              </a>
            </div>
          </div>
        </div>

        {/* Email */}
        <div
          className="rounded-xl p-6"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: '44px', height: '44px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '1.25rem' }}
            >
              ✉️
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Everything else
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Privacy concerns, content questions, or anything that doesn't fit a GitHub issue —
                reach out directly.
              </p>
              <a
                href="mailto:support@kitsunechaos.com"
                className="inline-block rounded-md px-4 py-2 text-sm font-semibold"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
              >
                support@kitsunechaos.com
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Response time note */}
      <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
        This is a solo project maintained in spare time. GitHub issues get priority since they're
        public and benefit everyone. Response times vary but everything gets read.
      </p>

    </div>
  )
}
