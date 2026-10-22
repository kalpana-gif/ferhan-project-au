# Ferhan typography audit and proposed hierarchy

22 October 2026 · Analysis and recommendations

The strongest improvement is to increase the readability of useful content and make the shared hierarchy dependable. Keep Ferhan’s light, spacious architectural headings, but give descriptions, navigation, forms and actions more prominence. The current gap between large headings and small supporting text is too wide.

There is no universal industry standard prescribing a website’s font sizes. The scale below is a design recommendation for this site. WCAG provides accessibility requirements for contrast, resizing, reflow and user-adjusted spacing; it does not mandate an 18px body font.

## Scope and evidence

Reviewed the shared CSS, component styles, font assets and markup across the service gateway, Architects, Developments, Consultants, Projects, service details, navigation, footer and enquiry dialog. Sampled computed browser styles at a 1440 × 1000 CSS-pixel viewport for all main page families, and at 390 × 844 for Consultants. Inspected the mobile service explorer visually. Sampled Engineering Services as a service detail page. Project detail and other dialog layouts were reviewed in source.

Computed font-size/weight describe the browser’s CSS result; a requested weight is not proof that a corresponding font file exists. Measurements are viewport-dependent. This is a typography audit with representative browser checks, not an exhaustive accessibility certification or a completed 200%/400% zoom test.

## What is working

- Graphik’s restrained shapes and light display headings suit the architectural imagery.
- Shared type tokens already exist in `src/styles/site/typography.css`.
- Reading copy often has a sensible line-height of 1.6–1.7 and constrained widths.
- Form inputs already use 16px text.
- The service explorer uses a useful h2 → h3 accordion → h4 step structure.
- Text alternatives behind canvas effects, reduced-motion styles and visible focus states provide a useful foundation.

## Main findings

### 1. Equivalent roles render differently

The shared type scale loads last, but more specific component selectors override it. The claim that one stylesheet controls every route is therefore not borne out by the rendered result.

Representative desktop measurements, rounded to one decimal place:

| Role | Architects | Developments | Consultants | Projects |
|---|---:|---:|---:|---:|
| Page/hero title | 115.2px | 115.2px | 115.2px | 88px |
| Main services section heading | 63.4px | 77.8px | 63.4px | — |
| Services introduction | 16px | 20.9px | 16px | — |
| Service/project card title | 23px | 24.5px | 28.8px | 28.8px |
| Service card action | 11px | 13px | 11px | — |

Other desktop examples: the gateway title is 112px, testimonials headings 69.1px, the approach heading 60.5px and the explorer heading 63.4px. Different visual roles may reasonably differ; equivalent roles should use an explicit variant rather than an accidental selector override.

Sources: `src/main.jsx`, `src/styles/site/typography.css:35`, `src/components/sections/ScrollExpandIntro.css:1`, `src/styles/expertise.css:151`, `src/components/sections/TestimonialsSection.css:5`.

### 2. Useful text is too small relative to the headings

The new explorer, now shared by Developments and Consultants, uses:

| Element | Current desktop | Current mobile | Recommended |
|---|---:|---:|---:|
| Service explanation | 14px | 14px | 16–18px |
| Process step heading | 14px | 14px | 16px |
| Process step explanation | 12px | 12px | 14px |
| Help sentence | 12px | 12px | 14px |
| Step number | 9px | 9px | 12px, or omit if redundant |
| Service action label | 12px | 12px | 14px |

Shared navigation is 11px uppercase. Several other actions also inherit that label role. Form labels, consent and helper text are 12px. Separate these functional roles from decorative eyebrows.

Our recent explorer styling also introduced local font sizes; those should be consolidated into the shared system during the redesign.

Sources: `src/styles/expertise.css:281`, `src/styles/expertise.css:299`, `src/styles/site/typography.css:114`, `src/styles/site/typography.css:138`.

### 3. The available font files do not support the requested weights

The repository supplies Graphik Light 300 and Graphik Medium 500. The Medium asset is a static font, but its CSS declaration advertises a 500–800 range. There is no Regular 400 asset, and font synthesis is disabled.

This means changing a CSS weight to 400 or 600 will not reliably create the intended regular or semibold appearance. Different requested values can resolve to the same available outlines.

Recommended family:

- Light 300: large display and section headings.
- Regular 400: body copy, descriptions and supporting information, using a properly licensed Regular font file.
- Medium 500: buttons, navigation, labels and selected emphasis.

Declare the real weight of each static file. Three actual weights are sufficient; adding more typefaces is unnecessary. If a Regular Graphik licence is unavailable, evaluate a complete alternative family with the brand owner before replacing it.

Source: `src/styles/site/base.css:11` and the two WOFF files in `public/assets/`.

### 4. Some muted text misses minimum contrast

Calculated from the solid CSS foreground/background pairs used by the explorer, using the WCAG relative-luminance formula. Ratios below are rounded for display; classifications use the underlying values.

| Use | Foreground | Background | Ratio | Assessment |
|---|---|---|---:|---|
| Explorer paragraph | `#64705d` | `#f6f7f2` | 4.85:1 | Meets normal-text minimum; a stronger colour would help Light text |
| Steps/help text | `#737d6c` | `#f6f7f2` | 4.00:1 | Below 4.5:1 for normal text |
| Step numbers | `#7b8d6f` | `#f6f7f2` | 3.32:1 | Below normal-text minimum if conveying information |
| Service numbers | `#718167` | `#f6f7f2` | 3.87:1 | Below normal-text minimum if conveying information |
| Green heading accent | `#64814e` | `#f6f7f2` | 4.07:1 | Suitable for the current large heading; avoid reusing for small copy |

Use deeper greens such as the existing `#52604b` for supporting copy on pale surfaces. Keep the pale brand green for fills, icons and text on sufficiently dark backgrounds. It is not a suitable small-text colour on white. Text over photography needs checking against the actual image and overlay, including every relevant carousel frame.

Source: `src/styles/expertise.css:275–306` and [W3C: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### 5. Button typography still varies

The green filled “Back to top” button requests 14px/600 locally but computes to 12px/500 because the shared footer selector overrides it. Hero/approach actions retain 14px while service card actions range from 11–13px.

Use one shared button component with explicit primary, secondary and text-link variants. Set all ordinary action labels to 14px/500 with consistent tracking, regardless of colour. Keep the approved green pill/black circular arrow treatment for primary actions, with an upward arrow for back-to-top and directional arrows appropriate to navigation. Right-aligned explorer actions can retain their placement.

Use a 48–56px control height for routine actions and an explicit 60px hero variant when needed. These are product recommendations, not WCAG-mandated heights. Allow controls to grow at larger text settings.

Sources: `src/components/layout/SiteFooter.css:14`, `src/styles/site/typography.css:124`, `src/pages/ExpertisePage.jsx`.

### 6. Mobile should reflow, rather than reduce reading text

At 390px the hero remains 60px while explorer descriptions are 14px and steps are 12px. The process grid remains two columns. Larger text should be accommodated with a single-column process list below roughly 480px, subject to the actual container width.

Prefer balanced natural wrapping for long service names and headings. Give flex text children `min-width: 0` and flexible space; keep icon controls from shrinking. Avoid forced line breaks when they create awkward mobile layouts. Allow card heights to grow.

The scroll scenes use viewport-height stages, absolute overlays and hidden overflow. That creates a risk when text is enlarged or the device is short. Provide a normal document-flow fallback when content cannot fit and verify the resulting behaviour in a browser. Some measured mobile elements had scroll widths exceeding their text boxes; investigate those individually rather than assuming page-level horizontal scrolling proves they are safe.

Sources: `src/styles/expertise.css:300`, `src/components/effects/ScrollExpand.jsx:136`, `src/components/effects/ScrollExpand.jsx:242`.

### 7. Heading semantics need to remain stable

The scroll effect hides the wrapper containing the page h1 after expansion. The visual replacement is an h2. Preserve a stable semantic page title and treat duplicate animated lettering as decorative where appropriate.

Service-card titles use `<strong>` instead of headings. The Projects listing jumps from its h1 directly to reusable h3 card titles; related-project cards correctly sit below an h2. Assign heading levels according to context while using typography classes for their visual appearance.

Sources: `src/components/effects/ScrollExpand.jsx:80`, `src/pages/ExpertisePage.jsx:112`, `src/components/shared/ProjectCard.jsx:8`, `src/pages/ProjectsPage.jsx:83`.

### 8. Forms need more room and readable helper text

The enquiry dialog has 16px inputs, 24px line-height, fixed 43px height and 20px vertical padding. With borders, the content box is smaller than the line-height. Use flexible minimum heights around 48–52px and verify vertical alignment, browser autofill and zoom.

Use 14px labels, help, consent and errors. Keep input text at 16px or larger. Reduce the form’s secondary heading to a subsection role so it supports the main dialog title rather than competing at the same 40px size.

Sources: `src/components/dialogs/ContactDialog.css:26` and `src/styles/site/typography.css:154`.

## Proposed type system

Desktop values are intended targets around 1280–1440px. Mobile values target roughly 360–430px. Sizes should interpolate smoothly with `rem` bounds and a `rem + vw` middle value, and be tested under text resizing. Bounds alone do not guarantee accessibility.

| Role | Desktop target | Mobile target | Weight | Line-height | Letter spacing |
|---|---:|---:|---:|---:|---:|
| Display / page hero | 80px; cap at 88px normally | 44px | 300 | 1.08 | −0.03em |
| Section h2 | 48–56px | 32–36px | 300 | 1.15 | −0.025em |
| Subsection / dialog title | 32px | 28px | 400 | 1.2 | −0.015em |
| Service/project card or accordion | 24px | 21–22px | 400 | 1.3 | −0.01em |
| Process step heading | 16px | 16px | 500 | 1.4 | 0 |
| Intro / lead paragraph | 20px | 18px | 400 | 1.55 | 0 |
| Main reading paragraph | 18px | 16px | 400 | 1.65 | 0 |
| Supporting copy / form label | 14px | 14px | 400; 500 for labels | 1.55 | 0 |
| Navigation / buttons | 14px | 14px | 500 | 1.4 | 0–0.025em |
| Short uppercase eyebrow / metadata | 12px | 12px | 500 | 1.4 | 0.08em |

Use one explicit 56px section-emphasis variant where warranted. Avoid an individual custom size for every section. Large headings should earn their size through hierarchy, not simply occupy every section.

Keep the existing uppercase treatment for brief navigation/primary-action labels if desired, but reduce tracking to about 0.04–0.06em for those labels. Use sentence case for longer functional labels. Reserve 0.08em tracking for short eyebrows. Current −0.045/−0.055em heading tracking is tighter than needed for the proposed smaller sizes.

## Spacing and measure

- Long-form paragraphs: approximately 55–65 characters per line (`ch` is a useful approximation, not an exact character counter).
- Short lead copy: around 35–45 characters per line.
- Eyebrow to title: 12–16px.
- Title to supporting paragraph: 20–24px.
- Paragraph to action: 24–32px.
- Paragraph spacing: 16–24px, adjusted to the body size.
- Section spacing: use a consistent 8px-based spacing scale; approximately 80–112px vertically on desktop and 56–72px on mobile is a sensible starting point for this composition.
- Right-aligned actions should align with their content column, while headings and paragraphs share a clear left edge.

## Implementation order

1. **Readability first:** correct font files/weight mappings; increase small functional text; darken the failing secondary colours; fix input dimensions.
2. **Consolidate the hierarchy:** define role tokens for display, section, subsection, card, lead, body, supporting copy, UI and eyebrow. Map every component to one role. Remove competing typography declarations after checking their purpose.
3. **Unify repeated components:** common primary/secondary buttons; shared service explorer; consistent service/project card titles and descriptions; consistent navigation and forms.
4. **Responsive and semantic refinement:** one-column mobile steps, flexible cards, stable h1 semantics, natural heading wrapping and scroll-scene fallback.
5. **Acceptance review:** compare all routes and interactive states at 1440px, 1024px, 768px, 390px and 320px; verify short landscape, keyboard focus, text resizing, reflow, long labels, validation errors and text-spacing overrides.

Prefer tokens or low-specificity role classes over long page-specific selector chains. Keep layout and typography responsibilities distinct. Source order alone cannot defeat a higher-specificity rule.

## Accessibility baseline and limits

- Normal text: at least 4.5:1 contrast; qualifying large text: at least 3:1. Aim higher for the retained Light face. Large text is generally 24 CSS px or about 18.7 CSS px when bold; a CSS request for Medium is not automatically qualifying bold.
- Text should resize to 200% without losing content or functionality, subject to the criterion’s exceptions.
- Content should reflow at a width equivalent to 320 CSS px, subject to exceptions for content requiring two-dimensional layout. Test 400% browser zoom from an appropriate desktop viewport.
- Text-spacing overrides must not cause loss: line-height 1.5, paragraph spacing 2em, letter spacing 0.12em and word spacing 0.16em. These are robustness tests, not required default styling.
- Use clearly visible keyboard focus and comfortable targets; 44px is a good product target. WCAG 2.2 AA target-size minimum is 24 × 24 CSS px with specified exceptions, rather than a universal 44px rule.

References: [Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

The browser audit directly checked the contrast and text-spacing reference pages. Zoom, reflow and complete interaction-state compliance remain acceptance work for implementation. This report proposes the redesign; no application source files were changed during this audit.
