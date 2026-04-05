# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-04-05

### Added
- `vitest` test runner added to `@kitsunechaos/physics`
- `test` and `test:watch` scripts added to `packages/physics/package.json`
- `ohms.test.ts` — 52 tests covering `solveOhms` (all three modes, power invariants, divide-by-zero guards, round-trip consistency, stress suite), `sigFigs`, and `formatSI`
- `pendulum.test.ts` — 52 tests covering `period` (scaling laws, inverse recovery), `periodCorrected` (Bernoulli factor, monotonicity, symmetry), `stepRK4` (energy conservation over 10 periods, damping decay, time-reversal symmetry, numerical stability at large angles), and `pendulumBobXY` (cardinal positions, distance invariant, pivot offset, left/right symmetry)

### Changed
- Package scope renamed from `@kitsune/` to `@kitsunechaos/` across all packages and imports to match npm organisation name

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
