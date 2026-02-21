---
name: frontend-design-ultimate
description: Production-grade, anti-AI-slop frontend design with bold aesthetics and WCAG AA compliance
---

# Frontend Design Ultimate Skill

Create distinctive, production-grade UIs that look premium — not generic AI-generated. Based on the "anti-AI-slop" design philosophy.

## The BOLD Direction

Before writing ANY code, commit to an extreme design tone:

| Tone | Description |
|------|-------------|
| Brutally Minimal | Stark emptiness, one color, dramatic negative space |
| Maximalist Chaos | Layered, textured, information-dense |
| Retro-Futuristic | Neon + dark, sci-fi typography, scan lines |
| Organic/Natural | Soft curves, earth tones, hand-drawn elements |
| Luxury/Refined | Gold accents, serif typography, minimal motion |
| Editorial/Magazine | Grid-heavy, bold headlines, pull quotes |
| Brutalist/Raw | Exposed structure, monospace, raw edges |
| Art Deco/Geometric | Symmetry, gold lines, 1920s elegance |
| Soft/Pastel | Light gradients, rounded shapes, gentle motion |
| Industrial/Utilitarian | Steel grey, technical fonts, dashboard feel |

## Typography Rules

### Banned Fonts (too generic)
Inter, Roboto, Arial, System fonts, Open Sans

### Recommended Headlines
Clash, Cabinet Grotesk, Satoshi, Space Grotesk, Playfair Display

### Recommended Body
Instrument Sans, General Sans, Plus Jakarta Sans

### Scale
- Use **3x+ size jumps** for hierarchy (not timid 1.5x)
- Hero text: 64-120px
- Section headers: 32-48px
- Body: 16-18px

## Color Rules (70-20-10)
- **70%** dominant (background, surfaces)
- **20%** secondary (cards, sections)
- **10%** accent (CTAs, links, active states)
- **BANNED**: Purple gradients on white, even 5-color palettes

## Atmosphere (No Flat Backgrounds)
Every background needs texture:
- Noise/grain overlay (opacity 0.03-0.08)
- Gradient mesh (radial or conic)
- Geometric patterns (subtle, low opacity)
- Fixed grain layer: `background-image: url("data:image/svg+xml...")`

## Layout Rules
- **Asymmetric composition** — ban predictable centered layouts
- **Purposeful overlap** — elements should layer, not stack
- **Edge-to-edge hero sections** — no max-width containers for heroes
- **Grid break moments** — one element per page should break the grid

## Animation Principles
- **One orchestrated page load** > scattered micro-interactions
- **Staggered reveals**: `animation-delay: 0.1s, 0.2s, 0.3s...`
- **Scroll-triggered entrances**: fade up + slight translate
- **Hover surprises**: scale 1.02-1.05, color shift, shadow depth
- **Durations**: 200-400ms (snappy), ease-out curves

## Mobile-First
- Heroes center on mobile (no empty grid space)
- All grids → single column
- Forms stack vertically
- Large lists → accordions (not horizontal scroll)
- Touch targets: minimum 44px

## Accessibility (WCAG AA)
- Text contrast: 4.5:1 minimum
- Visible focus states on all interactive elements
- Semantic HTML: `nav`, `main`, `section`, `article`
- Alt text on all images
- Reduced motion: `@media (prefers-reduced-motion: reduce)`

## The Unforgettable Element
Every project needs ONE standout feature:
- Unique typography treatment (variable font animation)
- Unusual layout (diagonal sections, overlapping cards)
- Signature animation (hero morph, parallax depth)
- Custom cursor or interaction pattern

## ClawHub Source
- Skill: `frontend-design-ultimate` by @kesslerio (3.1K downloads)
- Install: `clawhub install frontend-design-ultimate`
- Tech: React 18 + TypeScript + Tailwind + shadcn/ui + Framer Motion
