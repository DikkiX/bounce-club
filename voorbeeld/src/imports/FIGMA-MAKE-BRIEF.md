# Bounce Club — Figma Make Design Brief

Gebruik dit document in **Figma Make** (of handmatig in Figma). Kopieer per sectie de **Make prompt** in één keer.

---

## 1. Project context (plak eerst)

```
Design a premium nightlife / club website for "Bounce Club" in Amsterdam.

Brand feel: dark, minimal, gold accents, underground but polished — not cheesy neon.

Must keep exact brand colors:
- Background: #181A1D
- Primary accent (gold): #FDC763
- Gold hover/light: #FFD283
- Text primary: #FFFFFF
- Text muted: rgba(255,255,255,0.65)

Typography: Helvetica Neue or similar clean sans-serif. Bold uppercase for headings, regular for body.

Target: desktop-first (1440px), plus mobile frame (390px).

Do NOT use orange — only the gold above on dark background.

The hero centerpiece is an interactive DJ turntable / deck (visual only in Figma — show it as 3D-ish, top-down or slight angle, with vinyl record and tonearm). It should feel like the heart of the site.

Pages to design:
1. Home (hero + next event + DJ preview + gallery strip)
2. Events listing
3. DJs / line-up
4. Gallery
5. Admin dashboard (Events, DJs, Gallery management)
6. Mobile home

Style references: Berghain-style minimal dark, Boiler Room energy, but cleaner and more luxury gold-on-black.
```

---

## 2. Design tokens (Figma variables)

| Token | Value | Usage |
|-------|-------|--------|
| `color/bg` | `#181A1D` | Page background |
| `color/bg-elevated` | `#1E2126` | Cards, panels |
| `color/bg-glass` | `rgba(255,255,255,0.05)` | Glass cards |
| `color/gold` | `#FDC763` | CTAs, links, accents |
| `color/gold-hover` | `#FFD283` | Hover states |
| `color/gold-muted` | `rgba(253,199,99,0.2)` | Borders, glows |
| `color/text` | `#FFFFFF` | Headings, body |
| `color/text-muted` | `rgba(255,255,255,0.65)` | Secondary text |
| `radius/lg` | `20px` | Event cards |
| `radius/md` | `12px` | Buttons, inputs |
| `radius/full` | `9999px` | Pills, tags |
| `shadow/gold` | `0 0 24px rgba(253,199,99,0.25)` | Hero glow |
| `font/display` | Helvetica Neue Bold, uppercase, letter-spacing 0.15em | H1 |
| `font/body` | Helvetica Neue Regular, 16px, line-height 1.6 | Body |

---

## 3. Home — Make prompt

```
Create a dark club website homepage, 1440×900, background #181A1D.

Layout:
- Top bar: small "BOUNCE CLUB" wordmark left, hamburger menu icon right (gold #FDC763).
- Center hero (60% viewport): large stylized DJ turntable / deck viewed from slight top angle.
  - Black matte deck body, gold ring accents (#FDC763), vinyl record with subtle groove lines.
  - Tonearm positioned on record. Soft gold ambient glow under the deck.
  - Label on vinyl: "BOUNCE" in minimal type.
  - Small caption below deck: "Drag to spin · Coming soon" in muted white.
- Below hero, two columns:
  - Left: "NEXT EVENT" card — event poster placeholder, date in gold, title in white, "Tickets" gold outline button.
  - Right: "ON THE DECKS" — 3 DJ avatar circles in a row with name + genre under each.
- Bottom strip: "FROM THE FLOOR" — horizontal scroll of 4 square photo thumbnails with thin gold border.
- Footer: minimal — Instagram, SoundCloud icons in gold, copyright.

Mood: cinematic, spacious, lots of negative space. No clutter. Gold only as accent, never large flat orange areas.
```

---

## 4. Events page — Make prompt

```
Design Events page for Bounce Club, 1440×900, background #181A1D.

- Page title "EVENTS" large uppercase gold, left-aligned with thin gold underline.
- Filter row: pills "Upcoming" (filled gold), "Past" (outline gold).
- Grid 3 columns of event cards:
  - Each card: 16:9 image top, dark glass body, gold date, white title, muted description (2 lines), gold "Details" link.
  - Card hover state (show second frame): slight scale up, gold border glow.
- One featured event card spans 2 columns at top — larger poster, "Featured" gold badge.

Keep palette strict: #181A1D, #FDC763, white only.
```

---

## 5. DJs / Line-up — Make prompt

```
Design DJs / Line-up page for Bounce Club, 1440×900, dark #181A1D.

- Title "LINE-UP" centered, gold, uppercase.
- Grid of DJ profile cards (3×2):
  - Circular or rounded-square portrait (B&W or desaturated photo placeholder).
  - Name in white bold, genre in gold small caps.
  - Row of social icons: Instagram, SoundCloud, Spotify in gold outline.
  - On hover: card lifts, gold border, short bio snippet appears (2 lines muted white).

Optional: one "Resident" badge in gold pill on featured DJ.

Clean, editorial, not festival poster chaos.
```

---

## 6. Gallery — Make prompt

```
Design Gallery page for Bounce Club, 1440×900, background #181A1D.

- Title "GALLERY" gold uppercase.
- Album grid: masonry or uniform 3-column grid of night-club photo placeholders.
- Each album tile: cover image, overlay on hover with album title + date in gold/white.
- Click state mockup: lightbox overlay (dark 90% scrim) with large image center, gold close X, arrow navigation.

Photos should feel moody, flash photography, crowd energy — desaturated with gold UI on top.
```

---

## 7. Admin dashboard — Make prompt

```
Design an admin dashboard for Bounce Club content management. Desktop 1440×900.

Same brand: dark #181A1D background, gold #FDC763 accents, white text.

Layout:
- Left sidebar (240px): logo "Bounce Admin", nav items with icons — Events (active), DJs, Gallery, Settings. Active item has gold left border + gold text.
- Main area:
  - Header: "Events" + gold "+ New Event" button right.
  - Table/list of events: columns Date, Title, Artists, Status, Actions (edit/delete icons in gold).
  - One row expanded or modal open: "Edit Event" form —
    - Fields: Title, Date picker, Time, Description textarea, Artists tags, Image upload dropzone with preview.
    - Gold primary "Save", outline "Cancel".

Secondary screens (smaller frames): DJ form (name, genre, bio, photo upload, social links), Gallery album form (title, date, multi-image upload).

Professional, not generic SaaS blue — stay on brand dark/gold.
```

---

## 8. Mobile home — Make prompt

```
Mobile homepage 390×844 for Bounce Club.

- Sticky top: logo center, menu right.
- Hero: DJ deck centered, smaller but still hero element, gold glow.
- Stacked sections:
  - Next Event card full width.
  - "On the decks" horizontal scroll of DJ cards.
  - Gallery horizontal scroll thumbnails.
- Fixed bottom optional: gold "View Events" pill button.

Thumb-friendly tap targets, 16px min body text, same colors #181A1D and #FDC763.
```

---

## 9. Component library (ask Make to generate)

```
Create a component set for Bounce Club design system:

Buttons:
- Primary: gold fill #FDC763, dark text #181A1D, uppercase, 12px letter-spacing.
- Secondary: gold 1px border, transparent bg, gold text.
- Ghost: white text, no border.

Inputs: dark bg #1E2126, 1px border rgba(253,199,99,0.3), gold focus ring.

Cards: glass dark rgba(255,255,255,0.05), border rgba(253,199,99,0.2), radius 20px.

Tags: gold outline pill, small caps.

Navigation: fullscreen overlay menu mock — large gold links HOME, EVENTS, DJs, GALLERY stacked center.

DJ Deck component: reusable hero illustration — top-down turntable with vinyl, gold accents, subtle shadow/glow.

Export as Figma components with variants: default / hover / active where relevant.
```

---

## 10. Interactie — notes voor development (niet in Figma)

| Fase | Gedrag |
|------|--------|
| v1 | Deck roteert langzaam idle (CSS animation) |
| v2 | Gebruiker sleept muis/touch → vinyl draait mee |
| v3 | Klik op deck → scroll naar Events of open featured event |

Figma: toon **default** + **hover (glow stronger)** + **optional "drag hint"** states.

---

## 11. Content placeholders (realistisch)

- Club: **Bounce Club**, Amsterdam premier nightlife
- Sample event: **Bounce x [Artist]** — Saturday 22:00
- Sample DJs: 3 residents with genre (House, Techno, UKG)
- Gallery: album "Night 01 — March 2026"

---

## 12. Checklist na Make export

- [ ] Alle frames gebruiken `#181A1D` / `#FDC763` (geen andere accentkleur)
- [ ] DJ deck duidelijk centraal op home (desktop + mobile)
- [ ] Events, DJs, Gallery + Admin aanwezig
- [ ] Mobile variant van homepage
- [ ] Component styles consistent (buttons, cards, inputs)
- [ ] Export specs of Dev Mode klaar voor Next.js build in `websites/bounce`

---

## 13. One-shot mega prompt (als Make één prompt wil)

```
Design a complete UI kit and 6 screens for "Bounce Club" Amsterdam nightlife website.

Colors: background #181A1D, accent gold #FDC763, text white. No orange.

Screens (1440 desktop + one 390 mobile home):
1. Home — hero is a stylized DJ turntable/deck (vinyl + tonearm, gold accents, soft glow), next event card, DJ preview row, gallery strip.
2. Events grid with featured event.
3. DJs line-up grid with social links.
4. Gallery masonry + lightbox state.
5. Admin dashboard — sidebar Events/DJs/Gallery, event edit form with image upload.
6. Mobile home — stacked layout, same deck hero smaller.

Typography: Helvetica Neue, bold uppercase headings. Style: minimal dark luxury club, gold-on-black, spacious, cinematic. Include component library: primary/secondary buttons, inputs, cards, nav overlay, DJ deck hero component.

Reference vibe: underground club elegance, not festival flyer clutter.
```

---

*Bestand voor project: `websites/bounce` — volgende stap na Figma: Next.js build + admin koppelen aan bestaande MongoDB API.*
