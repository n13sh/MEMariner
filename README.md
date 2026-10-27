# Middle East Mariner

Professional web portal and interactive 3D vessel anatomy experience for **Middle East Mariner**, a marine services, spare parts, boat distribution, maintenance, and engineering company based in East Ahmadi, Kuwait (Established 2006).

## Features

- **60–120 FPS 3D Exploded Vessel Scrollytelling Engine**: Custom WebGL/Three.js interactive offshore vessel that smoothly disassembles along 6 mechanical and structural subsystems as you scroll or scrub the reveal slider.
- **Marine Solutions Editorial Aesthetic**: Clean, modern, luxury maritime design with generous whitespace and high-impact visual storytelling.
- **Seamless Light & Dark Mode Toggle**: Instant switching between an airy daytime marina studio theme and a nocturnal navy blue mode with persistent user preferences.
- **Heavy Mobile Optimization**:
  - `touch-action: pan-y` gesture separation allowing smooth page scrolling alongside horizontal 3D orbit.
  - Automatic portrait aspect ratio camera framing keeping the 3D vessel centered in the upper screen.
  - Docked mobile quick-action bar with 48px tap targets and iOS safe-area handling.
  - Automatic off-screen WebGL render sleeping via `IntersectionObserver` to save mobile battery.
  - 16px font sizing on inputs to prevent iOS Safari auto-zooming.
- **Runner Boats Portfolio**: Official models from Rider 25 FT to Magnus 42 FT with specifications and one-click enquiry workflows.
- **7 Core Marine Service Divisions & 5-Point Boat Surveys**: Clean collapsible accordions covering vessel care, engine overhaul, hydraulics, HVAC, and surveys.
- **Bilingual AI Concierge**: Embedded voice/text assistant supporting English and Arabic with guardrails.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js
- **Icons**: Lucide React

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```
