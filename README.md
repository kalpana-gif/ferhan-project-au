# Ferhan Architects

A production-oriented website for Ferhan Architects, an architecture and design studio based in Perth, Western Australia.

## Product map

- A first-screen selector at `/` for Architects, Developments, and Consultants
- Architects retains the full studio composition with a black and green colour skin; Developments and Consultants have complete overview and individual service pages
- ScrollExpand-led home prelude: a framed hero image expands with window scroll before handing off to the construction sequence
- Scroll-controlled construction film: a pinned home-page sequence scrubs forward and backward with the user's mouse or trackpad
- Cleaned construction video: 1080p H.264 on desktop and a smaller 720p version on mobile
- Scrollable Services, Portfolio, About, and Contact sections
- One shared navigation configuration for desktop, mobile, active-section detection, and smooth scrolling
- Framer Motion transitions for carousel changes, section reveals, cards, menu hierarchy, dialogs, and active navigation
- Shared projects collection at `/projects`, six category filters, individual image galleries and similar projects
- Swipeable testimonials with keyboard, arrow and pagination controls
- Shared contact enquiry flow and compact service links at the bottom of the footer

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
| `src/pages/ServiceGateway.jsx` | Service selector and not-found page |
| `src/components/sections/` | One file per studio section, plus the scroll chapters |
| `src/components/layout/` | Header, navigation overlay, and footer |
| `src/components/dialogs/` | Service details and contact dialogs |
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

## Development and consulting content

Edit `src/data/expertise.js` for the new service copy, imagery, highlights and four-step processes. Each service is linked from its overview at `/services/developments` or `/services/consultants` and has a stable nested URL. The existing assets are reused; development descriptions are introductory and clearly marked pending final information. Project and testimonial previews are labelled samples, described below.

`src/styles/expertise.css` controls the new pages. `src/styles/brand-theme.css` applies the shared black and green palette while keeping the Architects composition.

## Enquiry delivery

The new pages post the `project-enquiry` form to Netlify Forms. The matching hidden form in `index.html` enables detection during deployment. Enable form detection in the site's Netlify Forms settings and redeploy, then confirm the form appears. Under form notifications, configure an email notification to the approved recipient. Notification destination is an account setting, not supplied by frontend code. Verify a real submission after deployment; local validation does not prove delivery.

On localhost, submission opens the visitor's email application with the enquiry details; the visitor must send the email. The preview never claims an enquiry was sent. Direct telephone, email and map links are also available. The Architects dialog preserves its design and now opens the email application with the enquiry details instead of showing a simulated sending confirmation.

## Projects and testimonials

`src/data/projects.js` holds the six project categories and image collections. `src/data/testimonials.js` holds the testimonial wording and attribution. Current entries are explicitly labelled design previews: the image collections are reference imagery, not records of completed projects, and the quotes are sample wording rather than client reviews.

Preview entries appear in development and on localhost. On a deployed production host, only entries marked `approved: true` appear. Replace names, descriptions, grouped photos and consented testimonial wording before approving entries. If no approved projects exist, the public collection shows an honest enquiry prompt; the testimonials section is omitted.

Project filters are stored in the URL and retained when returning from a project gallery. Galleries and testimonials use native horizontal scroll with snapping, support touch and keyboard navigation, and respect reduced motion. No autoplay is used. `src/styles/projects.css` and the testimonial component stylesheet use the shared white, black and green palette.

## Typography

The site uses Graphik Light for headings and reading copy, and Graphik Medium for navigation, labels and controls. The Ferhan wordmark retains its brand lettering. `src/styles/site/typography.css` is loaded last and owns the shared type scale: 16px body text, 14px supporting copy, 12px captions and controls, 11px uppercase labels, and fluid heading sizes. Update the role tokens there instead of adding page-specific font overrides. Tailwind's sans-serif font uses the same Graphik family.

Headings retain comfortable line spacing on mobile; service cards become one column on narrow phones, and testimonial controls sit below their heading. Enquiry fields retain 16px text for mobile readability.
