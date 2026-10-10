# Farhan Architects

A production-oriented website for Farhan Architects, an architecture and design studio based in Perth, Western Australia.

## Product map

- A first-screen selector at `/` for Architects + Builders, Developments, and Consultants
- Architects + Builders opens the current full studio site; Developments and Consultants have coming-soon pages
- ScrollExpand-led home prelude: a framed hero image expands with window scroll before handing off to the construction sequence
- Scroll-controlled construction film: a pinned home-page sequence scrubs forward and backward with the user's mouse or trackpad
- Cleaned construction video: 1080p H.264 on desktop and a smaller 720p version on mobile
- Scrollable Services, Portfolio, About, and Contact sections
- One shared navigation configuration for desktop, mobile, active-section detection, and smooth scrolling
- Framer Motion transitions for carousel changes, section reveals, cards, menu hierarchy, dialogs, and active navigation
- Project exploration dialog and contact enquiry flow

## UX decisions

- Intersection Observer drives active navigation without a per-component scroll listener.
- Programmatic navigation temporarily locks the selected item until the destination enters the observer focal area, avoiding active-state flicker during smooth scroll.
- The contact flow provides client-side validation, sending state and confirmation state.
- Framer Motion respects reduced-motion preferences through `MotionConfig`, with a CSS fallback for non-motion transitions.
- The React Bits Crosshair, BorderGlow, and StrokeText components live in `src/components/effects/` and style the path selector.

## Source layout

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Route selection, page metadata, and shared motion settings |
| `src/pages/StudioPage.jsx` | Studio page composition, navigation, and dialogs |
| `src/pages/ServiceGateway.jsx` | Service selector and planned service pages |
| `src/components/sections/` | One file per studio section, plus the scroll chapters |
| `src/components/layout/` | Header, navigation overlay, and footer |
| `src/components/dialogs/` | Project and contact dialogs |
| `src/components/effects/` | Reusable visual and scroll effects; `InlineTechText.tsx` renders selectable text with a canvas effect, while `TechTextCanvas.jsx` renders the selector heading |
| `src/components/shared/` | Brand mark and shared controls |
| `src/components/ui/` | Registry-managed UI components |
| `src/data/` | Navigation, slide, and service content |
| `src/animations/` | Shared Framer Motion variants |
| `src/styles/site/` | Studio styles split into base, navigation, immersive scenes, sections, overlays, typography, and responsive rules |
| `src/styles/site.css` | Ordered entry point for the studio styles |
| `src/styles/gateway.css` | Service selector styles |
| `src/styles/tailwind.css` | Tailwind entry point |
| `public/assets/` | Assets served at stable `/assets/` URLs |

The selectors' copy and card data remain in `src/data/gatewayContent.js` and `src/data/servicePaths.js`. The `output/` directory holds working design artifacts, separate from the app source.

## Run locally

To update the path selection page's header, heading, introduction, or footer later, edit `src/data/gatewayContent.js`. The three service cards are configured in `src/data/servicePaths.js`.

```bash
npm install
npm run dev
```
