# Chidori Anime → Netflix-style (Blue Edition)

Transform the site into a polished Netflix-clone experience, but in a deep blue Chidori palette, and fix the chibi Sasuke to be a tall portrait image instead of a wide one.

## 1. Visual identity (Netflix, but blue)

Update `src/styles.css` design tokens:
- Background: near-black with a cool blue tint (`oklch(0.12 0.02 250)`)
- Surfaces/cards: slightly lighter blue-black
- Primary: vivid Chidori electric blue (`#1E90FF` / `oklch(0.65 0.2 250)`)
- Primary glow + gradient tokens for buttons/CTAs
- Foreground: off-white; muted: blue-gray
- Add `--shadow-elegant`, `--gradient-primary`, `--gradient-hero` blue tokens

Typography stays Poppins (headings) + Inter (body) — already loaded.

## 2. Netflix-style layout

### Header (`src/components/Layout.tsx`)
- Sticky top nav, transparent → solid-blur on scroll
- Centered "CHIDORI ANIME" wordmark (kept on top as before)
- Right side: Search icon, Bookmarks, History, Info — Netflix-style minimal links
- Remove left sidebar nav entirely (Netflix has no sidebar); move Sasuke chibi into the footer or a floating corner mascot

### Home page (`src/routes/index.tsx`)
- **Hero billboard**: full-width 70vh backdrop of a featured anime, large title, synopsis, "▶ Watch Now" + "+ My List" buttons, gradient fade to background (Netflix billboard)
- **Rows** of horizontally-scrollable posters with hover-scale + info popup card (Netflix tile hover):
  - Continue Watching
  - Trending Now
  - Top 10 This Week (numbered overlay)
  - New Releases
  - Action, Romance, Shounen genre rows
- Smooth horizontal scroll with left/right arrow buttons on hover

### Anime detail (`src/routes/anime.$id.tsx`)
- Keep the merged hero (already fixed)
- Add Netflix-style "More Like This" row at the bottom
- Episode list as a styled accordion/grid like Netflix episodes tab

### Watch page (`src/routes/watch.$id.$ep.tsx`)
- Darker chrome, episode rail styled like Netflix's "Next Episode" panel

### Footer
- Blue-tinted, multi-column links, © Chidori Anime 2026

## 3. Sasuke chibi — portrait orientation

Regenerate `src/assets/sasuke-chibi.png` as a **tall portrait** (e.g. 512×1024, full-body standing pose) instead of square. Place it as a floating mascot in the bottom-left corner of the home page (or footer), sized to feel like a side character, not a banner.

## 4. Quality polish
- All poster images: prefer Jikan `large_image_url` / `maximum_image_url` (already wired on detail page — extend to rows on home + search)
- Card hover: scale 1.05, blue glow shadow, quick fade-in info overlay (title, year, rating, genres)
- Smooth transitions everywhere (200–300ms)
- Skeleton loaders already exist — restyle in blue

## Technical notes
- Pure frontend/CSS work; no backend, no new packages
- Files touched: `src/styles.css`, `src/components/Layout.tsx`, `src/components/Hero.tsx`, `src/components/Row.tsx`, `src/components/AnimeCard.tsx`, `src/routes/index.tsx`, `src/routes/anime.$id.tsx`, `src/routes/watch.$id.$ep.tsx`, regenerate `src/assets/sasuke-chibi.png`
- No route additions; existing routes stay
