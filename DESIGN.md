---
name: glass.no
description: Glass-Service Svendsen og Sønn AS, the Oslo family glazier since 1889; calm pages that lead to a free survey.
colors:
  brand-red: "#ed4c4c"
  brand-red-deep: "color-mix(in oklab, #ed4c4c 86%, #000)"
  on-red: "#ffffff"
  harbour-navy: "#040037"
  slate-muted: "#556186"
  window-paper: "#f8f9fa"
  frost-mist: "#e9ebf0"
  pure-white: "#ffffff"
  night-surface: "#0b1144"
  inverse-ink: "#f8f9fa"
  inverse-muted: "#8b94ae"
  error-red: "color-mix(in oklab, #d92d20 72%, #040037)"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(38px, 3.24vw + 25.4px, 72px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(30px, 1.72vw + 23.3px, 48px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline-guide:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.5vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.6vw, 1.45rem)"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
  btn: "8px"
  circle: "50%"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
  section-y: "clamp(3rem, 6vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.on-red}"
    typography: "{typography.body}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.brand-red-deep}"
    textColor: "{colors.on-red}"
  button-primary-large:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "48px"
  button-secondary:
    backgroundColor: "color-mix(in oklab, #040037 8%, #f8f9fa)"
    textColor: "{colors.harbour-navy}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "44px"
  button-on-brand:
    backgroundColor: "{colors.harbour-navy}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.btn}"
    padding: "0 24px"
    height: "44px"
  card-image:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.harbour-navy}"
    rounded: "{rounded.lg}"
    padding: "20px 24px 24px"
  card-contact-form:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.harbour-navy}"
    rounded: "{rounded.lg}"
    padding: "clamp(1.25rem, 3vw, 2rem)"
  input-field:
    backgroundColor: "{colors.window-paper}"
    textColor: "{colors.harbour-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 0.9rem"
  nav-link:
    textColor: "{colors.harbour-navy}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  facts-strip:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.harbour-navy}"
    rounded: "{rounded.sm}"
    padding: "1.1rem 1.4rem"
  icon-disc:
    backgroundColor: "{colors.brand-red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.circle}"
    size: "48px"
  icon-social:
    backgroundColor: "{colors.frost-mist}"
    textColor: "{colors.brand-red}"
    rounded: "{rounded.circle}"
    size: "44px"
---

# Design System: glass.no

## Overview

**Creative North Star: "The Trusted Local Glazier"**

The site should feel like a tidy workshop run by people who have done this since 1889: calm, clear and well made. Light, cool grounds carry real photographs of real installs and product cutouts, set in firm rounded frames. Navy does the talking, and brand red marks the next step: the booking button, list markers, icon discs, the one red booking band per page. Nothing decorates for its own sake. Trust comes from honest facts set plainly (years in the trade, phone, opening hours, partner logos) and from booking always being at hand.

Density is relaxed but not sparse. Sections breathe with a fluid vertical rhythm, text holds a readable measure, and every page is a stack of editable EmDash blocks, each choosing one of six surfaces. The pages depend on the client's own words, which stay exactly as written. The design shapes them through type, casing via CSS, and layout, and never rewrites them.

Components are solid and confident: clear filled buttons, firm cards with soft shadows, nothing fussy. Motion is small and practical: a 1-2px hover lift, a single hero entrance, a slow partner-logo marquee that stops for reduced motion.

**Key Characteristics:**
- One typeface, Hanken Grotesk, with light-weight (400) tightly tracked display headings and medium-weight (500) titles.
- Navy ink on cool paper; brand red reserved for actions and small brand marks.
- Real install photography in 20px-radius frames; product cutouts shown whole (contain), photos cropped (cover).
- Soft, navy-tinted ambient shadows; no hard edges, no offsets.
- Every layout is an editable block with a chosen surface.

## Colors

A cool, near-white workshop ground with deep navy ink and one warm brand red that means "act here."

### Primary
- **Glass-Service Red** (brand-red): the action colour. It fills every primary button (with white text), the brand surface band, contact-strip icon discs, prose list markers, link underlines (at 70% strength, full on hover), the guide contents hover rule and the form accent colour. On hover a button darkens to **Deep Red** (brand-red-deep).
- **On-Red White** (on-red): the text and icon colour on red, as the brand commitment requires.

### Secondary
- **Harbour Navy** (harbour-navy): the ink. All headings, body text, nav links, the focus ring, and the fill of a button placed on the red band. As a ground it is the dark and image surfaces and the footer.

### Neutral
- **Window Paper** (window-paper): the page ground (light surface), the nav bar, input fills.
- **Frost Mist** (frost-mist): the tint surface, photo frame backing in page heroes, social icon discs.
- **Pure White** (pure-white): the white surface, image cards, the contact form panel and the facts strip, which lift off the paper ground.
- **Slate** (slate-muted): secondary text. Hero body copy, card descriptions, contact-strip values, facts captions, guide contents links. It passes AA on both paper and mist.
- **Night Surface** (night-surface), **Inverse Ink** (inverse-ink), **Inverse Muted** (inverse-muted): the inverse set for dark and image surfaces. Image surfaces lay a 58% navy shade over the photo.
- **Error Red** (error-red): field validation borders and messages, pulled toward navy to reach 4.5:1. It always appears with words, never as colour alone.
- Hairlines are navy mixed into transparent (11% default, 20% strong, 16% on dark or brand grounds), never a separate grey.

### Named Rules
**The Red Means Book Rule.** Red marks the action and a few small brand marks (list markers, icon discs, underlines). Don't use it for headings, body text or large decorative fills. The brand band is the single exception, and on that band the button turns navy so the action still stands out.

**The Navy-Not-Black Rule.** Ink, hairlines, shadows and image shades all derive from Harbour Navy. Do not introduce pure black or neutral greys.

## Typography

**Display Font:** Hanken Grotesk (with system-ui, sans-serif)
**Body Font:** Hanken Grotesk (with system-ui, sans-serif)

**Character:** One grotesk across the whole site. Its large sizes use the regular weight (400) with tight negative tracking, which reads crafted rather than loud. Small titles step up to 500-600 in the same face so they hold weight beside body text.

### Hierarchy
- **Display** (400, clamp 38-72px, line-height 1.02, -0.038em): the home hero headline. Product page heroes use their own clamp (2.5-4.25rem, -0.03em).
- **Headline** (400, clamp 30-48px, 1.1, -0.03em): section headings.
- **Headline Guide** (400, clamp 1.75-2.25rem, 1.15, -0.02em): h2 inside the long SEO guide, a step quieter than section headings. Guide h3s are 1.25rem/600.
- **Subtitle** (500, clamp 1.2-1.45rem, 1.35): the page hero's secondary heading under the title, max 30ch.
- **Title** (500, 20px on desktop and 18px below 1024px, 1.3): card titles, FAQ questions, contact form titles. Icon-item titles use 1.125rem/600.
- **Body** (400, 16px, 1.65): running text, capped at a 62ch measure in prose and 56ch in hero copy. Lead lists (features) use 18-20px.
- **Label** (500, 13px, 0.06em, uppercase via CSS): nav menu group names, the guide's contents summary, fact captions. Fact values are 1.25rem/500 with tabular numerals.

### Named Rules
**The Words As Written Rule.** Client copy is SEO text and stays word for word. Casing comes only from CSS: buttons, card titles and feature items are capitalized, image-card titles and labels are uppercased. Never retype a string to change its case.

**The Light Display Rule.** Headings at headline size and above use weight 400 with negative tracking. Weight comes in only at title size and below.

## Layout

A 1280px content column (`width: min(100% - 2 * gutter, 1280px)`) with gutters of 24px on a phone, 48px from 640px and 80px from 1024px. Pages are vertical stacks of full-bleed blocks. Each block pads top and bottom by the fluid section rhythm (clamp 3-6rem). When two adjacent blocks share the white, light or tint surface, the second drops its top padding so they read as one band.

Inside a block: a 12-column kit grid for heroes, services and features; the Section block's 1, 2 or 3 columns with 2:1 and 1:2 splits; the Cards block's per-row setting (capped at 3 below 1024px, 2 below 720px, 1 for image cards). Gaps use the 4px-based s-scale. Headings sit 48px above their content (32px on a phone). The page hero is a two-column text and photo split that stacks photo-first below 860px. The SEO guide is a sticky contents rail (12-16rem) beside a 60ch text column. It collapses to a bordered disclosure box above the text below 960px.

Breakpoints in use: 640px, 860px, 1024px (plus 720px and 960px in single blocks). The nav is fixed at 72px (56px on a phone), and anchored headings offset by it.

## Elevation & Depth

A hybrid. Grounds are flat and separate by tone (paper, mist, white, navy, red). Elevated objects (image cards, the contact form panel, the facts strip, post cards) sit on a soft, navy-tinted ambient shadow that suggests a panel resting on a bench, never floating. Hover adds a small lift, not a bigger glow.

### Shadow Vocabulary
- **Soft Lift** (`box-shadow: 0 12px 32px color-mix(in oklab, #040037 8%, transparent)`): image cards, the contact form panel, post list cards.
- **Facts Rest** (`box-shadow: 0 1px 2px rgb(4 0 55 / .06), 0 8px 24px -12px rgb(4 0 55 / .12)`): the facts strip, a tighter shadow for a short panel.
- **Kit Card Rest / Hover**: a 1px top inner highlight plus a 1px contact shadow at rest. On hover it gains `0 14px 32px -18px`, which deepens on dark cards, and a 2px rise.

### Named Rules
**The Resting Panel Rule.** Shadows are wide, low-opacity and navy-tinted. Never hard, offset or coloured red.

## Shapes

Gently rounded and consistent: 20px for cards, photo frames and the form panel (18px for kit cards on a phone); 12px mid; 8px for buttons, inputs, nav links, prose images and the facts strip. Circles (50%) hold icons: red discs in the contact strip, mist discs for social links. Kit card panels nest their radius (outer radius minus inset). Borders are 1px navy-tinted hairlines. Photographs are clipped by their frame's radius at 4:3 (page hero 4:3.4, service frames 4:5). The FAQ disclosure mark is a CSS-drawn chevron that rotates when open.

## Components

### Buttons
Clear, filled and confident; one look across the site.
- **Shape:** gently rounded (8px), 44px tall (48px for the large booking variant), 24px side padding, medium weight (500) at 16px (15px in the nav bar).
- **Primary:** white on Glass-Service Red. The site's main action ("Book befaring", "Send melding").
- **Hover / Focus / Active:** darkens toward Deep Red and rises 1px. A press drops 1px and scales to 0.985. Focus is a 2px navy outline at 2px offset.
- **Secondary (tonal):** navy text on paper mixed with 8% navy, no border. 14% on hover.
- **On the brand band:** the button inverts to a navy fill with white text, lightening on hover.
- **Arrow:** booking calls to action in the footer carry a drawn SVG arrow after the label, not a text glyph.

### Cards / Containers
- **Image card** (Cards block): white, 20px radius, Soft Lift shadow, media on paper at 4:3 (cutouts contained, photos covered), body padded 20/24/24px with an uppercased 1.15rem title and a compact button pinned to the bottom.
- **Icon item** (Cards icon variant, Features cards): no box. A 3.5rem icon beside a 600-weight title and slate text, three per row on desktop.
- **Service card** (Services block): an open card. Title on the ground over a 4:3 photo panel with a 20px radius that lifts 2px on hover.
- **Internal padding:** 28px kit cards (32px from 1024px, 20px on a phone).

### Inputs / Fields
- **Style:** paper fill, 1px navy hairline, 8px radius, 16px text, 600-weight labels above with a 0.35rem gap.
- **Focus:** 2px navy outline, 1px offset.
- **Error:** a 2px Error Red border plus the reason in words under the field.

### Navigation
A fixed 72px paper bar with a navy hairline, the client's SVG logo at 32px, 15px/500 links with an 8px radius whose underline draws in from the left on hover. Mega-menu groups are headed by labels, and a primary "Gratis befaring" button sits at the right. On a phone the links open in a sheet at 20px.

### Facts Strip
A white, 8px-radius panel with Facts Rest. An auto-fit grid of short slate captions over 1.25rem/500 navy values in tabular numerals. Phone and email values are tappable at full row height.

### Contact Strip
A row of facts (phone, email, address, hours), each with a 48px Glass-Service Red disc holding a white line icon, a 600-weight term and a slate value that turns navy and underlines on hover.

### FAQ
Native disclosure rows split by hairlines. Questions at 20px/500 with a 44px minimum target. Answers at 64ch with the client's line breaks preserved.

### Partner Logos
A masked, endlessly scrolling marquee of brand-partner logos (40s, linear) that pauses on hover or focus. Under reduced motion it becomes a static, wrapped, centred row.

### Guide Contents
A sticky contents rail beside the SEO guide. A hairline left rule, slate links that turn navy with a red left rule on hover or focus, and smooth scrolling only when motion is allowed.

## Do's and Don'ts

### Do:
- **Do** build every new layout as an editable EmDash block with a surface choice (white, light, tint, dark, brand, image), never as a one-off page.
- **Do** use white text on Glass-Service Red for buttons. It is a brand commitment. That pairing measures 3.7:1, AA only at large or bold sizes (18.66px bold and up), against the WCAG 2.1 AA target in PRODUCT.md, so keep red-ground text large and short.
- **Do** keep a booking action within a screen of any point on the page: the nav button, the red booking band, the closing call to action.
- **Do** change casing only with CSS text-transform; keep the client's words exactly as written.
- **Do** use real install photography and product cutouts from the media library, framed at 20px, covered for photos and contained for cutouts.
- **Do** honour reduced motion: colour changes and press feedback stay, lifts, marquee and entrance stop.

### Don't:
- **Don't** set body-size text in white on red outside buttons. At 15-16px/500 even the buttons sit below the large-text threshold, a recorded gap against AA.
- **Don't** rewrite, retype or re-case client copy to fit a design.
- **Don't** use red for headings, paragraphs or large fills beyond the one brand band.
- **Don't** introduce pure black, neutral grey, hard offset shadows or a second typeface.
- **Don't** add small uppercase kickers or eyebrow labels above headings. Labels head menus, contents and facts only.
- **Don't** invent reviews, customer names or figures; trust comes from the facts the company can prove.
