# NartForge Website

Premium website for the NartForge brand — Discord bots, Minecraft plugins, web solutions, and custom software.

## Features

- **7 Pages**: Home, Store, Products, Wiki, Support, Development
- **AMOLED Dark Mode**: `#000000` true black theme
- **Light Mode**: Clean white theme
- **Theme Toggle**: Button switch, localStorage persistence (`nartforge-theme`)
- **Responsive**: Mobile, tablet, desktop
- **Animations**: Scroll reveal, mesh gradient hero, typewriter, animated counters, wave dividers
- **Premium Design**: Glassmorphism, dark/light contrast sections, pricing cards, comparison table, FAQ accordion
- **Discord Integration**: CTA buttons across all pages
- **SEO**: Meta tags, Open Graph

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
npm run preview   # Preview build
```

## Stack

- React 19 + TypeScript
- Vite 5
- React Router v6 (HashRouter)
- Pure CSS with custom properties (no UI library)

## Project Structure

```
src/
├── components/   # Header, Footer, DiscordCTA, ScrollReveal, AnimatedCounter, Typewriter, WaveDivider, ScrollProgressBar, ProductCard
├── context/      # ThemeContext (light/dark toggle)
├── data/         # products.ts, wiki.ts
├── hooks/        # useScrollAnimation
├── pages/        # Home, Store, Products, Wiki, Support, Gelistirme
└── styles/       # index.css (all global styles, animations, themes)
```

## Color Palette

- Primary: `#E65100` (Orange)
- Secondary: `#FF6D00`
- Accent: `#FF8A65`, `#FFB74D`
- Gradient: `#E65100` → `#FF6D00`

## Pages

| Page        | Route         | Description                              |
|-------------|---------------|------------------------------------------|
| Home        | `/`           | Mesh hero, stats, features, pricing, FAQ |
| Store       | `/magaza`     | Sidebar category store with product grid |
| Products    | `/urunler`    | Filtered product listing                 |
| Wiki        | `/wiki`       | Documentation with category menu         |
| Support     | `/destek`     | Support cards + contact form             |
| Development | `/gelistirme` | Development services                     |

## Notes

- HashRouter used for static deployment compatibility
- All Discord links → `https://discord.gg/6N8B4aMJkw`
- All static, no backend required
- Contact form is frontend-only (demo purpose)

## License

© 2025 NartForge. All rights reserved.
