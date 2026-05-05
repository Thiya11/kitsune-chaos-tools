# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-05-06

### Added
- **Wave Interference Simulator** — new Physics tool with a 16× low-res pixel canvas (150×100 rendered, scaled 4×), two-source interference pattern, nodal line overlays, and right-edge fringe markers (m = −3 … +3)
- `waveInterference.ts` physics module — `WaveParams`, `WaveSource`, `getSourcePositions`, `getWavelength`, `computeFringePositions`, `computeAmplitude`, `amplitudeToColor`

### Changed
- Canvas overlay controls (source toggle + play/pause) moved inside the simulation panel; source count uses a two-segment pill toggle matching the site button palette
- Tool shell layout changed from fixed `height: calc(100vh)` to `min-height` so content flows to the page naturally without an internal scrollbar

## [1.2.0] - 2026-05-05

### Added
- **Lens Formula Simulator** — new interactive thin lens ray diagram tool under Physics
- Scale ruler below the principal axis showing real distances in cm; auto-steps based on current zoom level

### Changed
- Object arrow is draggable horizontally; minimum object distance enforced at 20 cm from lens
- Ray intersection points clamped to lens aperture — rays no longer originate outside the drawn lens boundary
- Scale calculation no longer uses image distance, preventing object from collapsing into the lens at extreme focal lengths
- Image arrow (line + arrowhead + label) now animates as a single grouped unit with a shared spring, eliminating the arrowhead lag

### Fixed
- Rays now always originate from the object arrow tip regardless of scale compression
- Object arrow cannot enter the lens in any slider combination

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
