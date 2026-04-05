import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Kitsune Chaos — what data we collect, how we use it, and your rights.',
  alternates: { canonical: 'https://kitsunechaos.com/privacy' },
  openGraph: {
    title: 'Privacy Policy — Kitsune Chaos',
    description: 'Privacy policy for Kitsune Chaos — what data we collect, how we use it, and your rights.',
    url: 'https://kitsunechaos.com/privacy',
    siteName: 'Kitsune Chaos',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

const LAST_UPDATED = 'April 5, 2026'

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">

      <header className="mb-10">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Last updated: {LAST_UPDATED}
        </p>
        <p className="mt-4 text-base" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Kitsune Chaos (<strong style={{ color: 'var(--text-primary)' }}>kitsunechaos.com</strong>) is
          committed to being transparent about data. This policy explains exactly what is collected,
          why, and what your rights are. There are no surprises.
        </p>
      </header>

      <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '2.5rem' }} />

      <div className="flex flex-col gap-10" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--fs-base)' }}>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>1. Who we are</h2>
          <p>
            Kitsune Chaos is an independent open-source project operated by Thiya. The site is
            hosted at kitsunechaos.com. For privacy-related enquiries, contact{' '}
            <a href="mailto:support@kitsunechaos.com" style={{ color: 'var(--text-primary)' }}>support@kitsunechaos.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>2. What data we collect</h2>
          <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Analytics (optional)</h3>
          <p className="mb-3">
            If you accept analytics cookies, we use <strong style={{ color: 'var(--text-primary)' }}>Google Analytics 4</strong> to
            collect anonymised usage data including:
          </p>
          <ul className="flex flex-col gap-1 pl-5 list-disc">
            <li>Pages visited and time spent</li>
            <li>Approximate country (not city or address)</li>
            <li>Browser type and screen size</li>
            <li>Whether you arrived from a search engine, direct link, or referral</li>
          </ul>
          <p className="mt-3">
            This data is anonymised. We do not collect names, email addresses, or anything that
            identifies you personally. No data is sold or shared with third parties.
          </p>
          <p className="mt-3">
            Analytics cookies are <strong style={{ color: 'var(--text-primary)' }}>off by default</strong>. They
            only activate if you click Accept in the cookie consent banner. See our{' '}
            <a href="/cookies" style={{ color: 'var(--text-primary)' }}>Cookie Policy</a> for details.
          </p>

          <h3 className="text-base font-semibold mb-2 mt-6" style={{ color: 'var(--text-primary)' }}>Necessary data</h3>
          <p>
            The site sets a single necessary cookie (<code style={{ fontSize: '0.85em', padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>cc_cookie</code>) to
            remember your cookie consent preference. This is required for the consent banner to work
            correctly. It contains no personal information.
          </p>

          <h3 className="text-base font-semibold mb-2 mt-6" style={{ color: 'var(--text-primary)' }}>No account data</h3>
          <p>
            Kitsune Chaos has no user accounts, no login, and no forms that collect personal
            information. We do not store any data on our servers about individual visitors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>3. How we use data</h2>
          <p>
            Analytics data is used solely to understand which tools are used, where users drop off,
            and whether the mobile layout is working correctly. This information guides development
            decisions — nothing else.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>4. Third parties</h2>
          <p className="mb-3">
            The only third-party service used is Google Analytics, and only when you have consented.
            Google's privacy policy applies to data processed by their service:{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>
              policies.google.com/privacy
            </a>.
          </p>
          <p>
            No advertising networks, social media trackers, or data brokers are used on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>5. Data retention</h2>
          <p>
            Google Analytics data is retained for 14 months (the GA4 default). The{' '}
            <code style={{ fontSize: '0.85em', padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>cc_cookie</code>{' '}
            consent cookie expires after 182 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>6. Your rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="flex flex-col gap-1 pl-5 list-disc">
            <li>Withdraw analytics consent at any time via the cookie preferences panel</li>
            <li>Request deletion of any data associated with your visit</li>
            <li>Object to processing of your data</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact{' '}
            <a href="mailto:support@kitsunechaos.com" style={{ color: 'var(--text-primary)' }}>support@kitsunechaos.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>7. Changes to this policy</h2>
          <p>
            If this policy changes materially, the "Last updated" date at the top of this page will
            be updated. Continued use of the site after a change constitutes acceptance of the
            revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>8. Contact</h2>
          <p>
            Questions or concerns about this privacy policy:{' '}
            <a href="mailto:support@kitsunechaos.com" style={{ color: 'var(--text-primary)' }}>support@kitsunechaos.com</a>
          </p>
        </section>

      </div>
    </div>
  )
}
