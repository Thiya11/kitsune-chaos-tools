# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-05

First public release. Site live at [kitsunechaos.com](https://kitsunechaos.com).

### Added
- **Monorepo** — Turborepo setup with `packages/physics`, `packages/tools`, `packages/ui`, `packages/config`
- **PendulumSim** — interactive pendulum simulator with real-time physics
- **OhmsLaw** — interactive Ohm's Law calculator
- **Blog system** — MDX-based blog with frontmatter, author field, and JSON-LD `BlogPosting` schema
- **Dark / light theme** — `ThemeProvider` and `ThemeToggle` with full CSS variable system
- **Mobile navigation** — responsive `MobileNav` with hamburger menu
- **Cookie consent** — `CookieConsentManager` via `vanilla-cookieconsent`; analytics opt-in only, production-gated
- **Google Analytics** — GA4 loaded only after consent, only on `kitsunechaos.com`
- **SEO** — `robots.txt`, `sitemap.xml`, canonical URLs, OpenGraph, Twitter cards, JSON-LD on all key pages
- **`/about`** — project overview, tech stack, creator section with GitHub and LinkedIn
- **`/contact`** — GitHub Issues, Discussions, and email contact cards
- **`/privacy`** — GDPR-compliant privacy policy (noindex)
- **`/cookies`** — cookie policy with necessity/analytics tables (noindex)
- **Footer** — Navigate, Connect (GitHub, LinkedIn), and Legal sections
- **LICENSE** — MIT license (code); content and brand assets copyright reserved
- **CHANGELOG** — this file
