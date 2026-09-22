# Farhan Architects

A production-oriented website for Farhan Architects, an architecture and design studio based in Perth, Western Australia.

## Product map

- ScrollExpand-led home prelude: a framed hero image expands with window scroll before handing off to the construction sequence
- Scroll-controlled construction film: a pinned home-page sequence scrubs forward and backward with the user's mouse or trackpad
- Adaptive high-resolution video: 8K HEVC on supported displays, 4K H.264 on desktop, and a lightweight mobile fallback
- Scrollable Services, Portfolio, About, and Contact sections
- One shared navigation configuration for desktop, mobile, active-section detection, and smooth scrolling
- Framer Motion transitions for carousel changes, section reveals, cards, menu hierarchy, dialogs, and active navigation
- Project exploration dialog and contact enquiry flow

## UX decisions

- Intersection Observer drives active navigation without a per-component scroll listener.
- Programmatic navigation temporarily locks the selected item until the destination enters the observer focal area, avoiding active-state flicker during smooth scroll.
- The contact flow provides client-side validation, sending state and confirmation state.
- Framer Motion respects reduced-motion preferences through `MotionConfig`, with a CSS fallback for non-motion transitions.
- The requested shadcn React Bits component is installed at `src/components/ScrollExpand.jsx` and integrated through `src/components/ScrollExpandIntro.jsx`.

## Run locally

```bash
npm install
npm run dev
```
