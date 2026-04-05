# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-05

### Added
- **Google Analytics** — GA script injected via `layout.tsx` for page-view tracking
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
