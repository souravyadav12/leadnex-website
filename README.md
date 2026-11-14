# LeadNex AI — website

Marketing site for **LeadNex AI** (AI calling / voice agents). Same copy, data
and page set as the original repo — completely new editorial design layer and a
full motion system on top of it.

React 19 · Vite 7 · Tailwind CSS v4 · Framer Motion · **Lenis** · React Router 7

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static build in dist/
npm run preview  # serve the build
```

Deploying: this is a client-routed SPA, so the host must rewrite unknown paths
to `index.html`. Both configs are in the repo —

- `vercel.json` (Vercel)
- `public/_redirects` (Netlify)

For nginx:

```nginx
location / { try_files $uri $uri/ /index.html; }
```

---

## Routes

| Route | Page | File |
| --- | --- | --- |
| `/` | Home — hero → live demo → workflow → features → testimonials → security → pricing → FAQ → contact → CTA | `src/pages/Home.jsx` |
| `/features` | Features masthead + the 6 feature cards, USP table, security band | `src/pages/Features.jsx` |
| `/pricing` | Pricing masthead + plans, comparison, FAQ, contact form | `src/pages/Pricing.jsx` |
| `*` | 404 | `src/pages/NotFound.jsx` |

Every band is a section component, so pages are just compositions of them.

---

## Content

**All copy is the original repo's copy, verbatim** — headlines, subheads, plan
features, testimonials, FAQ answers, form labels, footer columns, even the
`<title>`/OG/JSON-LD in `index.html`. Nothing was rewritten or invented.

Everything lives in **`src/data/site.js`**:

`nav` · `hero` (+ dashboard, transcript, stats, logos) · `demo` (scenarios,
voices, the 8-intent reply bank, panel, logs) · `workflow` · `features` (+ USP
comparison, languages, integrations) · `testimonials` · `security` (flow,
badges) · `pricing` (monthly + yearly, comparison, guarantees) · `faq` · `lead`
(form fields, industries, volumes, calendar) · `ctaBanner` · `footer`.

Change a string there and it changes everywhere it is rendered.

---

## Colour themes

Three palettes, all built on black / gray surfaces, all driven by one token set
(`--a1`, `--a1-soft`, `--a2`, `--base`, `--base-2`, `--ok` in `src/index.css`)
so every bloom, border, chip and gradient retints together:

| Theme | Accent | Second hue | Base |
| --- | --- | --- | --- |
| **Blue** (default) | `#3b82f6` | slate `#64748b` | `#06080c` |
| **Slate** | `#94a3b8` | slate `#64748b` | `#090a0c` |
| **Black** | `#e4e6eb` | gray `#787c85` | `#050506` |

Blue and Slate keep a cool teal only for "live / positive" telemetry; Black is
fully monochrome (that chip goes silver). Switch from the three dots in the
navbar (or the theme row in the mobile sheet); the choice persists in
`localStorage` and is applied before first paint.

## Live widgets

The artifacts are not screenshots — they run:

- **Hero dashboard** — active calls drift, qualified/leads tick upward, a call
  timer counts, the status chip cycles, the transcript cycles, the waveform
  answers.
- **Demo console** — pick a scenario, voice, start the call, type a reply; the
  intent classifier picks one of the eight reply lines. The Live Activity
  ticker streams new events with a countdown bar.
- **Workflow** — the Live Conversation panel is `position: sticky` (sections use
  `overflow: clip` so sticky actually works) and is driven by scroll: the
  transcript fills in, qualification chips tick on, then the calendar card
  appears — as you pass the matching step.
- **Features** — the call widget types its agent line and its sentiment keeps
  moving, latency meter sweeps, voice-clone waveform runs, language chips cycle
  (click to pin one), telemetry values drift.
- **Security** — a packet travels the pipeline and lights each stage.
- All timers pause when their widget is off screen (`useNearView`).

## Motion system

```
src/motion/
  Atmosphere.jsx     the living background + every scroll-driven primitive:
                     Atmosphere · SectionAura · ScrollBand · ScrollZoom ·
                     ScrollGlowRail · IntroCurtain
  ThreeD.jsx         Roller3D (3D coverflow testimonial roller, scroll-driven
                     + draggable) · Band3D (rotating word drum) · Cube3D
                     (wireframe cube in the CTA banner)
  kit.jsx            Reveal · Stagger/StaggerItem · SplitText · Parallax ·
                     Magnetic · Tilt · HoverLift · CountNum · Marquee ·
                     Section · SectionHead · ActionButton · ScrollProgressRail
  SmoothScroll.jsx   Lenis provider (+ window.__lenis, smoothScrollTo, scrollToTop)
  config.js          EASE / SPRING / SPRING_SOFT — the only curves used
  background/        the original layered ambience (gradient mesh, aurora,
                     grid, particles, beams) kept for reference
  components/Counter.jsx, hooks/useCountUpSpring.js, hooks/useReducedMotion.js
```

**Performance** — every ambient layer is a compositor-only CSS transform
(no per-frame JS, no blur filters, no blend modes, no layout-animating
keyframes); the waveform bars animate `scaleY` rather than height; the fixed
scene is `contain: paint` and painted once. Measured scroll frame time dropped
from ~144 ms to ~27 ms average (p95 ~39 ms) in a GPU-less headless browser —
i.e. comfortably 60 fps on real hardware.

**Background (always moving)**
`<Atmosphere />` is a fixed scene behind everything: four colour blooms
(indigo / violet / cyan / mint) that drift on their own timers, parallax
against page scroll in opposite directions, a slow rotating conic light,
a parallaxed hairline grid, a pointer-following light, a vignette and film
grain. Every section adds a `<SectionAura>` on top — two local blooms that
slide at different speeds, so depth changes as you travel down the page.

**Motion that follows the scroll**
- Smooth scrolling — Lenis drives wheel scroll, anchor jumps and route changes
  (`smoothScrollTo`, `scrollToTop`); native scroll stays the source of truth.
- `<Band3D>` — the word strip is now a **drum**: the text block rotates back in
  X and tracks across as you scroll through it (three on the home page).
- `<Roller3D>` — testimonials spin on a **3D coverflow roller** (lg and up):
  scroll rotates it, pointer-drag spins it forward/back, side cards sit in
  depth with `rotateY`, scaled down and faded, dots track the active card.
  Below `lg` the original flat grid takes over.
- `<Cube3D>` — two wireframe cubes rotate slowly on opposite axes inside the
  CTA banner, parallaxed against the scroll.
- `<ScrollZoom>` — plan cards, feature cards and testimonials scale/settle in
  as they enter the viewport.
- `<Parallax>` — hero art, CTA banners, section backdrops.
- `<ScrollGlowRail>` — a gradient line on the right edge that fills with
  reading progress, plus the thin top progress bar.
- `<IntroCurtain>` — one-shot page-load reveal (mark + hairline that fills,
  then the panel lifts away).

**Everything else**
- Entrances: `Reveal` / `Stagger` fade + rise on `whileInView`, once.
- Text: `SplitText` masks each word and lifts it on a stagger (~0.9s).
- Numbers: `CountNum` springs 0 → value when it enters view.
- Micro: magnetic buttons, ripples, hover lifts, icon nudges, tilt + glare on
  the hero panel, orbiting hairlines, animated waveform, hover sheen sweeping
  across cards, marquees that skew with scroll velocity.
- Hover surfaces: gradient hairline borders (`.gborder`) and glow shadows.
- Reduced motion: `MotionConfig reducedMotion="user"` + `useReducedMotion` turn
  off Lenis, the atmosphere animation, reveals, counters, bands, the curtain
  and CSS loops — content stays fully visible and static.

Shared easing: `EASE = [0.16, 1, 0.3, 1]` for reveals, springs
`{ stiffness: 420, damping: 34 }` for interaction. No linear or `ease-in-out`
sweeps except where a loop is meant to breathe (waveform, float, aurora).

## Design language

- **Type**: Inter Variable (UI), Instrument Serif italic (accents), JetBrains
  Mono (labels, numbers, telemetry). Bundled locally via `@fontsource`.
- **Colour**: `#07080a` base, hairline borders, accent `#5b7cfa` with violet
  `#8b5cf6`, cyan and mint (`#7fe0c4`) used only as ambient light and
  telemetry. Cards are tinted glass, not flat fills.
- **Rhythm**: numbered mono kickers (`01 —— [ LIVE DEMO ]`), display headline
  with a serif accent line, lede, then the artifact (a working mini-UI).
- **Grid**: `.u-shell` for width, `.bg-grid` + `.mask-fade-*` for texture,
  `.card-hairline` / `.edge-light` for surfaces.

---

## Accessibility

Labelled form fields with inline errors and `aria-invalid`, `aria-expanded` on
the accordion and nav sheet, `aria-live` on the demo console, `aria-hidden` on
decorative layers, focus-visible rings on every control, and a global
reduced-motion rule that also stops the marquees.

---

## Notes

- The demo console, ROI numbers, logs and calendar are front-end simulations —
  no backend calls.
- Legacy demo/feature/hero components from the original repo were removed once
  the new sections replaced them; `src/motion/` now contains only what is used.

## Theme palette

The navbar has a **colour palette picker** (`src/components/layout/ThemePalette.jsx`)
— three swatch dots open a small panel listing every theme:

| Theme  | Accent     | Feel                                  |
| ------ | ---------- | ------------------------------------- |
| Blue   | `#3b82f6`  | default — blue on black/graphite      |
| Slate  | `#94a3b8`  | cool steel, low saturation            |
| Black  | `#e4e6eb`  | pure monochrome, white accent         |

Choosing a theme sets `data-theme` on `<html>`, every colour in the app reads
`--a1-rgb / --a1-soft-rgb / --a2-rgb / --ok-rgb / --base / --base-2` tokens, and
the pick persists in `localStorage` under `leadnex-theme` (`applyStoredTheme()`
runs before first paint in `main.jsx`, so there is no flash). The same picker
sits in the mobile menu sheet.
