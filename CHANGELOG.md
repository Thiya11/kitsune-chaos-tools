# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-04-05

### Added
- `/about` page — project overview, tech stack grid, creator section (Thiyagu Arunachalam) with GitHub, LinkedIn, and Blog links
- `/contact` page — GitHub Issues, GitHub Discussions, and email contact cards
- `/privacy` page — GDPR-compliant privacy policy (GA4 data handling, retention, user rights)
- `/cookies` page — cookie policy with necessity/analytics tables and management instructions
- JSON-LD `AboutPage` schema on `/about`
- JSON-LD `ContactPage` schema on `/contact`
- `robots: noindex` on `/privacy` and `/cookies` to exclude legal pages from search indexing
- LinkedIn link added to footer Connect section
- Legal section added to footer with Privacy Policy and Cookie Policy links
- All new pages added to `sitemap.xml`

### Changed
- Footer Navigate section extended with About and Contact links
- Creator name updated to "Thiyagu Arunachalam" on About page
- All contact emails standardised to `support@kitsunechaos.com`

## [0.2.1] - 2026-04-05

### Added
- `author` field in `BlogPost` interface and frontmatter — surfaced in metadata and JSON-LD
- JSON-LD `BlogPosting` structured data on all blog post pages
- Twitter card metadata on blog post and blog index pages
- `alternates.canonical` on blog post and blog index pages
- `keywords` and `authors` metadata fields on blog post pages
- OpenGraph `url`, `siteName`, `authors`, and `tags` on blog post pages
- OpenGraph block and Twitter card on blog index page
- Two new blog post URLs added to `sitemap.xml`
- License and content copyright section added to `README.md`

## [0.2.0] - 2026-04-05

### Added
- **Cookie consent** — `CookieConsentManager` component using `vanilla-cookieconsent`; analytics opt-in by default, GA disabled on rejection
- **Google Analytics** — GA script gated behind cookie consent, production-only (`kitsunechaos.com`)
- **LICENSE** — MIT license added
- **CHANGELOG** — this file
- **Dark / Light theme system** — `ThemeProvider` and `ThemeToggle` components with full CSS variable support across all pages and tools
- **Mobile navigation** — new `MobileNav` component with responsive hamburger menu
- **SEO improvements** — `robots.txt` and `sitemap.xml` added to `public/`

### Fixed
- Dark mode styling on `OhmsLaw` and `PendulumSim` tool panels
- Pendulum simulator initial height value corrected
- GitHub link URL in site header corrected

### Changed
- `layout.tsx` refactored to integrate `ThemeProvider` and mobile nav
- `globals.css` extended with responsive breakpoints and theme variable definitions
- `ToolShell`, `OhmsLaw`, and `PendulumSim` updated for dark mode compatibility
- Blog pages (`/blog`, `/blog/[slug]`) updated with responsive styles

## [0.1.0] - 2026-04-04

### Added
- Initial monorepo setup with Next.js, React, and Turborepo
- `packages/physics` — pendulum and Ohm's Law physics engines
- `packages/tools` — `PendulumSim` and `OhmsLaw` interactive tool components
- `packages/ui` — shared `Panel`, `Slider`, and `ToolShell` components
- `packages/config` — shared ESLint, Tailwind, and TypeScript configs
- `apps/web` — Next.js web app with tool routing, blog system, and overview page
- Blog post: "Why I Rebuilt Kitsune Tools"
- Brand assets: favicon and logo
