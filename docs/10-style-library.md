# 10 — Style library (18 styles)

Eleven styles come from the founder's Dribbble references; seven come from 2026 design trends. Each is a rule set; any palette or logo fills its color slots. Machine-readable version: [`design/styles.json`](../design/styles.json).

**Inspired, not copied.** Styles borrow the feel of a reference: spacing, shape, type mood. Never reuse a reference's images, illustrations, logos or exact screens. Imagery comes from the user's uploads, free stock photos, or generated abstract art (open question).

**Acceptance for every style:** it renders all seven core screens (login, dashboard with KPI cards, data table, form, detail page, settings, empty state) in light and dark mode, with all 14 palettes and a test logo, passing contrast checks.

## At a glance

| # | ID | Style | Look | Best for | Reference |
| --- | --- | --- | --- | --- | --- |
| 1 | `airy-pill` | Airy pill | Near-white canvas, pill shapes everywhere, even chart bars | SaaS metrics, startup admin | [Zajno, SaaS analytics](https://dribbble.com/shots/27663724-SaaS-Analytics-Platform-Dashboard) |
| 2 | `pastel-frost` | Pastel frost | Frosted white cards over a soft color wash | Finance, personal money, HR | [Upnow Studio, finance](https://dribbble.com/shots/26150398-Finance-Dashboard-design) |
| 3 | `industrial-dark` | Industrial dark | Near-black cards, photo banner, one neon accent | Inventory, logistics, operations | [VALMAX, inventory](https://dribbble.com/shots/27195047-Inventory-Management-Dashboard) |
| 4 | `executive-cobalt` | Executive cobalt | One-line KPI strip, single-hue charts, top icon nav | Leadership reports, sales | [Sujon Hossain, executive](https://dribbble.com/shots/27724102-Executive-Business-Dashboard) |
| 5 | `soft-graphite` | Soft graphite | Cool gray canvas, floating pill nav, black round buttons | Sales, CRM, e-commerce admin | [NexUX Lab, sales analytics](https://dribbble.com/shots/27671116-Sales-Analytics-Revenue-Management-Dashboard) |
| 6 | `warm-human` | Warm human | Warm off-white, friendly copy, one gradient insight card | Communities, utilities, nonprofits | [Emote Agency, energy SaaS](https://dribbble.com/shots/27743047-Dashboard-Energy-Community-SaaS) |
| 7 | `bento-grid` | Bento grid | Mixed-size tiles, each tile one idea | Product overviews, analytics home | 2026 trends |
| 8 | `data-dense-pro` | Data-dense pro | Compact rows, tabular numbers, keyboard-first | Ops, finance back office, admins | 2026 trends |
| 9 | `corporate-classic` | Corporate classic | Quiet, conservative, clear hierarchy | Colleges, government, enterprise CRM | Enterprise practice |
| 10 | `light-glass` | Light glass | Translucent panels over an abstract backdrop | Task tools, team workspaces | [Leon Abramovic, glass dashboard](https://dribbble.com/shots/25346001-Glassmorphism-Dashboard-UI-Design) |
| 11 | `neo-brutalist` | Neo-brutalist | Thick black outlines, hard shadows, loud flat colors | Creators, education, portfolios | [Kristina Volchek, neo-brutalism](https://dribbble.com/shots/21066046-Personal-Website-Redesign-for-a-Product-Designer-NeoBrutalism) |
| 12 | `editorial` | Editorial | Giant condensed headlines, ruled boxes, image grid | Blogs, media, events, catalogs | [Inhens, online journal](https://dribbble.com/shots/22290609-Online-Journal-Landing-Page-Concept) |
| 13 | `luxe-blush` | Luxe blush | Serif display, full-bleed photo, glass nav | Beauty, fashion, boutique stores | [Bloom Skin, skincare](https://dribbble.com/shots/27487459--Daily-UI-053-Bloom-Skin-Skincare-Website-Navigation) |
| 14 | `map-split` | Map split | Big map or media panel beside a detail panel | Rentals, delivery, travel, field teams | [Nixtio, bike rental](https://dribbble.com/shots/27793885-Bike-Rental-Sharing-Web-App-Design) |
| 15 | `clay` | Clay | Soft puffy 3D shapes, big friendly corners | Kids, education, onboarding | 2026 trends |
| 16 | `natural` | Natural | Sage and sand, paper texture, organic shapes | Wellness, agriculture, food | 2026 trends |
| 17 | `terminal` | Terminal | Monospace, dark, grid lines, status lights | Developer tools, monitoring | 2026 trends |
| 18 | `swiss-type` | Swiss type | Black and white, oversized type, strict grid | Agencies, architecture, studios | 2026 trends |

Default recommendation for new users: `airy-pill` or `corporate-classic`.

## Dashboard styles (1–9)

### 1. Airy pill
- **Type:** Manrope; large light numbers, small medium labels
- **Surfaces and shape:** almost-white canvas, white cards, no border, faint shadow; card radius 20px; full pills on buttons, tags, inputs
- **KPI card:** label on top, big number, small rounded delta pill (green/red), mini chart inside
- **Layout:** slim icon-only rail on the left; period tabs (day, week, month) on top; right column for a live list
- **Charts:** fully rounded bars and soft lines in one hue family; gentle gradients inside bars
- **Default palette:** Sky

### 2. Pastel frost
- **Type:** DM Sans; numbers with lighter decimals
- **Surfaces and shape:** soft color wash behind everything; cards white at 70% opacity with light blur; radius 24px
- **KPI card:** small tinted icon tile, number, colored delta chip; cards in a horizontal strip
- **Layout:** left sidebar with soft selected state; wide main chart; side column with gauge and status card
- **Charts:** pale bars with one highlighted bar in the primary; segmented ring gauges
- **Default palette:** Lavender

### 3. Industrial dark
- **Type:** Space Grotesk headings and numbers, Inter body
- **Surfaces and shape:** near-black canvas, dark gray cards with 1px lighter border; radius 16px
- **KPI card:** number with a progress bar of thin ticks lit in the accent
- **Layout:** optional photo banner across the top with metric chips over it (user image or generated)
- **Charts:** tick-bar and stripe charts; donuts with one bright segment; one neon accent only
- **Default palette:** Lime night

### 4. Executive cobalt
- **Type:** Inter; tight, businesslike
- **Surfaces and shape:** light gray-blue canvas, white cards, 1px borders; radius 14px
- **KPI card:** all KPIs in a single strip across the top, each with value, change and a tiny count tag
- **Layout:** top bar with icon tabs instead of a sidebar; filters top right of each panel
- **Charts:** one hue in several tints; hatched fills for comparison periods; standout period called out
- **Default palette:** Cobalt

### 5. Soft graphite
- **Type:** Outfit
- **Surfaces and shape:** cool gray canvas, slightly lighter gray cards, no borders; radius 22px
- **KPI card:** icon in a small circle top right; black round arrow button opens details
- **Layout:** floating pill top nav; floating icon rail on the left; black primary buttons
- **Charts:** area charts with two soft color bands; gray bars with light gradients
- **Default palette:** Graphite

### 6. Warm human
- **Type:** Instrument Sans; friendly sentence-case copy
- **Surfaces and shape:** warm off-white canvas, white cards, soft borders; radius 18px
- **KPI card:** number with unit in smaller type; plain-language trend line under it
- **Layout:** sidebar grouped by real tasks; one gradient insight card per page with one clear action
- **Charts:** smooth lines with the best point marked by a tag; warm accent
- **Default palette:** Ember

### 7. Bento grid
- **Type:** Plus Jakarta Sans
- **Surfaces and shape:** tiles 1×1, 2×1, 2×2 on a 12-column grid, 12px gaps; radius 20px
- **KPI card:** each KPI is a tile; hero metric gets a 2×2 tile with its chart
- **Layout:** top nav, no sidebar on home; tiles reflow cleanly on mobile
- **Charts:** one chart per tile, minimal axes
- **Default palette:** Ocean indigo

### 8. Data-dense pro
- **Type:** Inter text, JetBrains Mono numbers (tabular)
- **Surfaces and shape:** flat, 1px borders everywhere, no shadows; radius 6px; row height 32px
- **KPI card:** compact, four to six per row, with sparkline
- **Layout:** collapsible sidebar, sticky table headers, filter bar, keyboard shortcuts, command menu
- **Charts:** small multiples and sparklines over big hero charts
- **Default palette:** Teal mint

### 9. Corporate classic
- **Type:** IBM Plex Sans
- **Surfaces and shape:** white surfaces, light gray canvas, clear 1px borders; radius 8px
- **KPI card:** label, number, comparison text ("vs last month"); no decoration
- **Layout:** standard left sidebar with section headings, breadcrumbs, page title with actions on the right
- **Charts:** plain bars and lines, labelled axes, gridlines on
- **Default palette:** Cobalt or the user's logo

## Expressive styles (10–18)

Each also defines a calmer **work mode** for dense screens (tables, forms) so the app stays usable after the landing page.

### 10. Light glass
- **Type:** Plus Jakarta Sans
- **Surfaces and shape:** translucent panels with blur over an abstract backdrop; text areas on a more solid layer; radius 20px
- **KPI card:** greeting card first, then metric cards with small trend lines
- **Layout:** three columns: nav, main, a rail with calendar or activity
- **Backdrop:** user's brand image or generated abstract shape in palette colors
- **Default palette:** Ember

### 11. Neo-brutalist
- **Type:** Work Sans, extra bold headings
- **Surfaces and shape:** cream canvas, 2px black outlines, hard offset shadows (4px, no blur); radius 12px
- **KPI card:** flat bright fill per card, black outline, big number
- **Layout:** chunky buttons, sticker-like badges, icons in outlined tiles
- **Charts:** flat solid bars with black outlines
- **Default palette:** Sunflower pop

### 12. Editorial
- **Type:** Anton uppercase headlines, Inter body
- **Surfaces and shape:** white page, thin black rules boxing nav and sections, no shadows; square corners
- **KPI card:** large condensed numbers separated by vertical rules
- **Layout:** magazine grid of image cards, each with colored frame, headline, outlined tags
- **Imagery:** needs real images; user uploads or placeholders until provided
- **Default palette:** Crimson ink

### 13. Luxe blush
- **Type:** Cormorant Garamond display, Jost body
- **Surfaces and shape:** full-bleed product photo; glass nav bar and feature chips floating on it; deep wine text; full pills on buttons
- **KPI card (work mode):** blush cards, serif numbers, thin wine borders
- **Layout:** hero with headline and two actions; trust strip along the bottom
- **Imagery:** product or lifestyle photo from the user
- **Default palette:** Blush wine

### 14. Map split
- **Type:** Sora
- **Surfaces and shape:** large dark map or media panel with a curved divider; light detail panel beside it; radius 24px
- **KPI card:** dark cards with a route-style line and dots; small orange status badges
- **Layout:** floating pop-up cards on the map; detail panel with history list
- **Map:** free OpenStreetMap-based tiles in a dark theme (check tile provider terms)
- **Default palette:** Ember on graphite surfaces

### 15. Clay
- **Type:** Nunito
- **Surfaces and shape:** soft puffy cards using two inner shadows; pastel fills; radius 28px
- **KPI card:** chunky rounded tiles with a 3D-style icon
- **Layout:** big touch targets, generous spacing, playful empty states
- **Default palette:** Lavender or Teal mint

### 16. Natural
- **Type:** Fraunces headings, DM Sans body
- **Surfaces and shape:** sand canvas with faint paper texture; organic blob shapes in backgrounds; radius 16px
- **KPI card:** muted green and clay tones; leaf-like progress shapes
- **Layout:** calm spacing, photo-friendly sections
- **Default palette:** Forest sage

### 17. Terminal
- **Type:** JetBrains Mono everywhere
- **Surfaces and shape:** near-black canvas, 1px grid lines, square corners, no shadows
- **KPI card:** bracketed labels, status lights (green/amber/red dots), live numbers
- **Layout:** split panes, log-style lists, command bar
- **Default palette:** Plum dark or Lime night

### 18. Swiss type
- **Type:** Inter Tight, very heavy weights for headings
- **Surfaces and shape:** black and white plus one accent; strict 12-column grid; square corners
- **KPI card:** oversized number, tiny caption, lots of white space
- **Layout:** asymmetric, strong left alignment
- **Default palette:** Crimson ink

## Refresh policy

Review the library every 3–4 months and swap 3–4 styles to stay current. Style IDs are permanent; retired styles stay renderable for existing projects.
