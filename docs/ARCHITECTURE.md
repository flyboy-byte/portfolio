# Project Architecture

This project is based on the [lohitkolluri/Portfolio-Website](https://github.com/lohitkolluri/Portfolio-Website) template. This document provides a technical overview of the Logan Night Portfolio codebase to assist developers and AI agents in understanding the system design.

## Core Design Patterns

### Higher-Order Components (HOC)
We use a `SectionWrapper` HOC to ensure consistent layout and animation behaviors across all main sections.
- **Location**: `src/hoc/SectionWrapper.jsx`
- **Purpose**: Handles the "anchored" navigation, consistent padding, and entrance animations via Framer Motion.

### Content Separation
All text content, experience data, and project metadata are centralized in `src/constants/index.js`. 
- **Rule**: Avoid hardcoding content directly into components. Always import from constants.

### 3D Asset Strategy
Models are self-hosted in `public/models/` (since 2026-10-18; they used to load from the template author's repo):
- `desktop_pc/` — stock Sketchfab glTF, served to desktop (>768px). ~8.8 MB, 685 meshes. Left untouched on purpose.
- `pc-mobile.glb` — the same model, optimized for phones (~2.0 MB): meshes merged, meshopt-compressed geometry, WebP textures capped at 1024px except the 1920x1080 monitor screen. Needs `EXT_meshopt_compression` + `EXT_texture_webp` (drei's `useGLTF` and three's GLTFLoader handle both).
- `planet/` — stock Sketchfab glTF for the Contact globe. Not optimized (~2 MB).
- **Icons**: self-hosted in `public/icons/` (SVGs from `@iconify-json` packages; the Iconify API rate-limits with 429).
- **Project card images**: generated SVGs in `public/projects/`.

Both models are CC-BY-4.0 (see Credits in `README.md`). Build steps for `pc-mobile.glb` and the follow-up plan are in `docs/3D_PLAN.md`.

## Routing
Routes live in `src/App.jsx`: `/` (`pages/Home.jsx`, the original one-page site), `/blog`, `/blog/:slug` (lazy-loaded). See `docs/BLOG.md` for the blog's structure, drafts and publishing.

## Head metadata
`index.src.html` carries the favicon (`public/favicon.svg`, `public/apple-touch-icon.png`), `theme-color`, canonical, and Open Graph / Twitter tags. The share image is `public/og-image.png` (1200x630). It was rendered once from an HTML mock with the self-hosted Poppins and JetBrains Mono fonts; re-render it if the tagline or palette changes. URLs are absolute on `https://logannightingale.com/`.

## Component Breakdown

### 1. Navigation (`Navbar.jsx`)
- Handles glassmorphism styling and mobile menu state.
- Dynamic scrolling based on section IDs defined in constants.

### 2. Hero (`Hero.jsx`)
- Combines a React-based typewriter effect with a `ComputersCanvas` (Three.js).
- Uses `CanvasLoader` for smooth loading transitions.

### 3. Contact (`Contact.jsx`)
- Integrated with EmailJS.
- Uses `StarsCanvas` and `EarthCanvas` for background/sidebar aesthetics.

## Animation System
- **Framer Motion**: Used for staggered transitions and entrance effects.
- **React Tilt**: Applied to service/project cards for interactivity.
- **Three.js**: Managed via `@react-three/fiber` and `@react-three/drei`.

## Maintenance Notes
- **EmailJS**: Live credentials (`SVC`, `TMPL`, `KEY`) are set in `Contact.jsx`.
- **Responsive Design**: `ComputersCanvas` detects mobile (`max-width: 768px`) with `matchMedia` and remounts the Canvas (`key`) with a different setup: optimized GLB, wider camera (fov 52 vs 25), no shadows, lower pixel-ratio cap, no `OrbitControls` (it forces `touch-action: none` and would block page scroll), and a slow idle sway that pauses off-screen and under `prefers-reduced-motion`. The sway needs `invalidate()` each frame because the canvas uses `frameloop="demand"`.
