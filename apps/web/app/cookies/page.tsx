import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for Kitsune Chaos — what cookies are set, why, and how to control them.',
  alternates: { canonical: 'https://kitsunechaos.com/cookies' },
  openGraph: {
    title: 'Cookie Policy — Kitsune Chaos',
    description: 'Cookie policy for Kitsune Chaos — what cookies are set, why, and how to control them.',
    url: 'https://kitsunechaos.com/cookies',
    siteName: 'Kitsune Chaos',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

const LAST_UPDATED = 'April 5, 2026'

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">

      <header className="mb-10">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Cookie Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-base" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          This page explains exactly which cookies Kitsune Chaos sets, why, and how you can
          control them. We keep cookies to the minimum necessary.
        </p>
      </header>

      <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '2.5rem' }} />

      <div className="flex flex-col gap-10" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--fs-base)' }}>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What is a cookie?</h2>
          <p>
            A cookie is a small text file stored in your browser by a website you visit. Cookies
            are used to remember preferences, measure usage, and keep services working correctly.
            They are not programs and cannot run code or carry viruses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Cookies we use</h2>

          {/* Necessary */}
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Necessary cookies
              </h3>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
              >
                Always on
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              These cookies are required for the site to function. They cannot be disabled.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Cookie', 'Purpose', 'Expires'].map((h) => (
                      <th key={h} className="text-left pb-2 pr-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>cc_cookie</td>
                    <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>Stores your cookie consent preferences</td>
                    <td className="py-2" style={{ color: 'var(--text-muted)' }}>182 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Analytics cookies
              </h3>
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
              >
                Opt-in only
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Set only if you accept analytics in the consent banner. Used to understand how people
              use the tools so we can improve them. All data is anonymised.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Cookie', 'Purpose', 'Expires'].map((h) => (
                      <th key={h} className="text-left pb-2 pr-4" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '_ga', purpose: 'Distinguishes unique users (anonymised)', expires: '2 years' },
                    { name: '_ga_*', purpose: 'Persists session state for GA4', expires: '2 years' },
                    { name: '_gid', purpose: 'Distinguishes users within a 24-hour window', expires: '24 hours' },
                    { name: '_gat', purpose: 'Throttles request rate to Google Analytics', expires: '1 minute' },
                  ].map(({ name, purpose, expires }) => (
                    <tr key={name} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="py-2 pr-4 font-mono" style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>{name}</td>
                      <td className="py-2 pr-4" style={{ color: 'var(--text-secondary)' }}>{purpose}</td>
                      <td className="py-2" style={{ color: 'var(--text-muted)' }}>{expires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>How to manage cookies</h2>
          <p className="mb-3">You have three ways to control cookies on this site:</p>
          <ol className="flex flex-col gap-2 pl-5 list-decimal">
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Consent banner</strong> — on your first
              visit, choose Accept or Reject. Analytics cookies are off by default.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Preferences panel</strong> — change
              your choice at any time by clicking "Manage cookies" in the site footer.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Browser settings</strong> — all modern
              browsers let you block or delete cookies. Note that blocking necessary cookies may
              break the consent banner.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Third-party cookies</h2>
          <p>
            The only third-party cookies are Google Analytics cookies, set only with your consent.
            No advertising networks or social media trackers set cookies on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Changes to this policy</h2>
          <p>
            If the cookies used on this site change, this page will be updated and the "Last updated"
            date revised. Check back here for the current list.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Questions</h2>
          <p>
            Cookie-related questions:{' '}
            <a href="mailto:support@kitsunechaos.com" style={{ color: 'var(--text-primary)' }}>support@kitsunechaos.com</a>
          </p>
        </section>

      </div>
    </div>
  )
}
