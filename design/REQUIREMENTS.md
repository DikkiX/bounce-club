# Bounce Club — Functionaliteiten & scope

> **Design bron:** [Figma Make](https://www.figma.com/make/586EK3Wn6NVNSJt27PqWrM/Read-this) + `FIGMA-MAKE-BRIEF.md`  
> **Stack:** Next.js (App Router) · MongoDB · Tailwind · poort **3004**

---

## 1. Brand (niet onderhandelbaar)

| Token | Waarde |
|-------|--------|
| Background | `#181A1D` |
| Gold accent | `#FDC763` |
| Gold hover | `#FFD283` |
| Text | `#FFFFFF` |
| Text muted | `rgba(255,255,255,0.65)` |

- **Geen oranje** — alleen gold op dark.
- **Typography (Figma Make):** Barlow Condensed (headings) + Inter (body).
- **Vibe:** minimal dark luxury, underground club — niet festival-chaos, niet generic SaaS.

---

## 2. Publieke pagina's

### Home `/`
- Top bar: **BOUNCE CLUB** links, hamburger rechts (gold).
- **Hero (~60vh):** DJ turntable/deck centraal — hart van de site.
- Onder hero, **twee kolommen:**
  - Links: **Next Event** — poster, datum (gold), titel, outline **Tickets** knop.
  - Rechts: **On the Decks** — 3 DJ avatars (rond) + naam + genre.
- Onderaan: **From the Floor** — horizontale scroll, vierkante thumbs, dunne gold border.
- Footer: Instagram, SoundCloud, copyright.

### Events `/events`
- Titel **EVENTS** + gold underline.
- Filters: **Upcoming** (filled gold) / **Past** (outline).
- Featured event (2 kolommen breed) + grid 3 kolommen.
- Cards: 16:9 image, glass body, gold datum, witte titel, muted description, gold **Details**.

### Line-up `/lineup`
- Titel **LINE-UP** gecentreerd.
- Grid 3×2 DJ cards: portrait, naam, genre, socials (IG / SC / SP).
- Hover: card lift, gold border, korte bio.

### Gallery `/gallery`
- Titel **GALLERY**.
- Masonry / 3-koloms grid albums.
- Hover overlay: titel + datum.
- Lightbox: dark scrim, grote foto, pijltjes, gold sluit-kruis.

---

## 3. Turntable (hero interactie)

| Gedrag | Beschrijving |
|--------|--------------|
| **Idle** | Vinyl draait **altijd** langzaam door (constant). |
| **Drag** | Muis/touch slepen = vinyl draait mee met input. |
| **Release** | Loslaten = idle spin hervat **direct** (niet stoppen). |
| **Visual** | SVG deck, slight top angle, gold ring, tonearm op plaat, zachte gold glow onder deck, label **BOUNCE** op vinyl. |
| **Caption** | "Drag to spin" (muted white). |

Later optioneel: klik op deck → scroll naar Events / featured event.

---

## 4. Admin

### Login `/admin`
- Username + password → JWT in localStorage.

### Panel `/admin/panel`
- Sidebar: Events · DJs · Gallery (gold active state).
- **Events:** CRUD — title, date, time, description, artists, image upload, featured flag.
- **DJs:** CRUD — name, genre, bio, image, social links (instagram, soundcloud, spotify).
- **Gallery:** CRUD — album title, date, description, thumbnail, extra images.
- Image upload → `public/uploads/`.

Default admin via env: `ADMIN_USERNAME`, `ADMIN_PASSWORD`.

---

## 5. Backend / data

- **Database:** MongoDB (`MONGODB_URI`, default `mongodb://localhost:27017/bounce-club`) — zelfde DB als oude `bounce-club` app.
- **Auth:** JWT (`JWT_SECRET`), bcrypt passwords.
- **API routes:**
  - `GET /api/events`, `/api/djs`, `/api/albums`
  - `POST/PUT/DELETE /api/admin/events`, `/djs`, `/albums`
  - `POST /api/admin/login`, `GET /api/admin/verify`
  - `POST /api/admin/upload`

---

## 6. Navigatie

Fullscreen overlay menu (hamburger):
- Home · Events · Line-up · Gallery

---

## 7. Wat we **niet** willen

- Generic AI-look (particles, grain, excessive glow, framer overload).
- Oranje placeholders / verkeerde kleuren.
- Turntable die stopt na loslaten.
- Layout die afwijkt van Figma (hero vol met extra titels, verkeerde sectie-indeling).

---

## 8. Dev

```bash
cd websites/bounce
cp .env.example .env.local   # MONGODB_URI + JWT_SECRET
npm install
npm run dev                    # http://localhost:3004
```

---

## 9. Referenties

| Wat | Waar |
|-----|------|
| Design brief | `design/FIGMA-MAKE-BRIEF.md` |
| **Figma Make export (bron van waarheid voor UI)** | `voorbeeld/src/app/App.tsx` |
| Figma Make link | https://www.figma.com/make/586EK3Wn6NVNSJt27PqWrM/Read-this |
| Oude werkende app (referentie API/data) | `Obed's Games/public/projects/bounce-club/` |
