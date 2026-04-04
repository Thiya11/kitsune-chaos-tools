# Kitsune Chaos 🦊

Interactive STEM tools for physics, electronics, and more — built as a Turborepo monorepo.

**Live tools:** Ohm's Law Calculator · Pendulum Simulator

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Web shell | Next.js 14 (App Router) |
| Tool components | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion + GSAP |
| Language | TypeScript (strict) |

## Repository layout

```
kitsune-tools/
├── apps/
│   └── web/                    # Next.js shell — routing, SEO, blog
│       ├── app/                # App Router pages
│       ├── content/blog/       # MDX articles
│       ├── components/         # Web-only components (ToolSkeleton, etc.)
│       ├── lib/                # Server utilities (blog reader)
│       └── tools/registry.ts   # Central tool registry
└── packages/
    ├── config/                 # Shared TS + Tailwind + ESLint config
    ├── physics/                # Pure TS physics math (no React)
    ├── ui/                     # Shared React components (Slider, Panel, ToolShell)
    └── tools/                  # Interactive tool components
```

## Getting started

```bash
# Install dependencies
npm install

# Start all dev servers
npm run dev

# Build everything
npm run build
```

The web app runs at `http://localhost:3000`.

---

## How to add a new tool

### 1. Add physics helpers (if needed)

Add a new file to `packages/physics/src/`, for example `lens.ts`:

```ts
// packages/physics/src/lens.ts
export function thinLens(objectDist: number, focalLength: number): number {
  return (objectDist * focalLength) / (objectDist - focalLength)
}
```

Export it from `packages/physics/src/index.ts`.

### 2. Create the tool component

Create a new directory in `packages/tools/src/`:

```
packages/tools/src/lens-equation/
├── LensEquation.tsx   # React component
└── useLensEquation.ts # State + logic hook
```

Rules:
- The component accepts **no required props** — all state is internal
- Use `@kitsune/ui` for all controls (`Slider`, `Panel`, `ToolShell`)
- Use `@kitsune/physics` for math — keep components dumb
- No Next.js imports anywhere in `packages/`

Export from `packages/tools/src/index.ts`:
```ts
export { LensEquation } from './lens-equation/LensEquation'
```

### 3. Register the tool

Add an entry to `apps/web/tools/registry.ts`:

```ts
{
  slug: 'lens-equation',
  name: 'Thin Lens Equation',
  category: 'physics',
  description: 'Explore image formation with a thin lens.',
  component: 'LensEquation',
  status: 'live',
  icon: '🔭',
}
```

### 4. Add the dynamic import

In `apps/web/app/tools/[slug]/page.tsx`, add the slug to `TOOL_COMPONENTS`:

```ts
'lens-equation': dynamic(
  () => import('@kitsune/tools').then((m) => ({ default: m.LensEquation })),
  { ssr: false, loading: () => <ToolSkeleton /> },
),
```

That's it. The tool will appear on the overview page and get its own SEO-optimised page automatically.

---

## Blog

Write MDX files in `apps/web/content/blog/`. Required frontmatter:

```mdx
---
title: "Your Post Title"
date: "2026-04-10"
description: "One sentence summary for the index and OG tags."
tags: ["physics", "tutorial"]
---
```

The blog index and article pages are automatically generated.

---

## Package dependency rules

```
apps/web  →  @kitsune/tools, @kitsune/ui, @kitsune/config
@kitsune/tools  →  @kitsune/physics, @kitsune/ui
@kitsune/ui  →  (React peer dep only)
@kitsune/physics  →  (no deps)
@kitsune/config  →  (no deps)
```

No circular dependencies. `@kitsune/physics` must never import React.
