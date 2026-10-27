# Middle East Mariner

Marketing site for **Middle East Mariner**, a marine services, OEM spare parts, boat distribution, maintenance and engineering company in East Ahmadi, Kuwait (est. 2006).

## Design

Clean dealer-site style: centred logo with an uppercase letter-spaced navigation row beneath it, Montserrat body text, Cormorant Garamond italic headings, a blue accent, white sections alternating with a pale blue tint, square-cornered cards with a tinted footer row, and an uppercase "DISCOVER →" link pattern.

- **Tokens** live in `src/index.css` and are exposed to Tailwind as `bg-tint`, `text-ink`, `text-accent`, `bg-navy`, `bg-dark`, `border-line`.
- **Utilities**: `eyebrow`, `h-hero`, `h-section`, `h-card`, `lead`, `btn-primary`, `btn-outline`, `btn-white`, `link-caps`, `card`, `field`, `label`, `dot-list`, `container-x`.
- **Motion**: `src/lib/Reveal.tsx` fades sections in on scroll; `src/lib/CountUp.tsx` counts stats up in view. The header compacts into a sticky bar with a scroll-progress line and active-section underline; cards lift and zoom their photo on hover; arrows nudge on hover; the yard opens a keyboard-navigable lightbox (`Lightbox.tsx`); a back-to-top button appears after scrolling. All motion respects `prefers-reduced-motion`.

## Sections

1. **Hero** (`Hero.tsx`) – copy on the left, the live 3D vessel (Three.js, `ExplodedBoatCanvas.tsx` in `chromeless` presentation mode) in a framed panel on the right, turning slowly, draggable, with a slider that separates its systems. Every system is named with a pin; clicking a pin, the part itself (raycast) or a chip below opens `PartSheet.tsx` with that system's details, spare parts, related services and an enquiry button.
2. **Services** – seven division cards with yard photography, each opening a detail sheet with the full checklist and a booking action.
3. **Parts & Hardware** – six spare-part categories that pre-fill the enquiry form.
4. **Runner Boats** – six model cards with hull silhouettes drawn to relative scale.
5. **The Yard** – workshop photography from East Ahmadi (`public/assets/gallery`).
6. **5-Point Survey** – photo plus dark panel listing the inspection domains.
7. **About + FAQ** – company statement, stats, core services and common questions.
8. **Contact** – "Talk to a Marine Advisor" with a bordered form. The form does not post to a server: it builds a pre-filled `mailto:` link and a WhatsApp link and the visitor chooses one. A **Contact information** block (`ContactInfo.tsx`) follows with phone, email, address with a map link, hours, the response promise and social icons (handles in `COMPANY_INFO.social`; empty handles are hidden).
9. **Footer** – logo, blurb, four link columns, contact icons, copyright. A floating WhatsApp button sits bottom-right.

## Media

```
public/
  favicon.svg
  assets/gallery/
    yard-qboat-rib.jpg
    yard-maxum.jpg
    workshop-walkaround.jpg
    rigging-still.jpg            # frame from the outboard rigging clip
    outboard-service-still.jpg   # frame from the outboard service clip
  assets/services/               # AI illustrations, one per service division
  assets/video/
    rigging.mp4                  # plays from the yard tile and its lightbox
    outboard-service.mp4
media/video-unused/              # original WhatsApp clips incl. the unused sideways one
```

## Languages

An English/Arabic toggle sits in the header. `src/lib/i18n.tsx` provides `t(key, english)` for interface strings and `td(id, field, english)` for data records; the Arabic lives in `src/data/ar.ts`. Switching sets `lang` and `dir` on `<html>`, swaps the typefaces to Tajawal/Amiri, drops italics and letter-spacing, and mirrors the arrow icons. The choice is remembered in `localStorage`.

## Service images

The seven division cards use AI-generated illustrations, one per division, each prompted from that division's description. They were generated once with pollinations.ai (fixed seeds, prompts in the session notes) and are stored in `public/assets/services/<division-id>.jpg`, so the site has no runtime dependency on the generator. To regenerate one, replace the file.

## Tech stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 (`@theme inline` tokens, `@utility` classes)
- Three.js for the vessel
- Lucide React icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
```
