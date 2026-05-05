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
To keep the repository lightweight and avoid proxy/LFS issues during early development, we use external URLs for heavy assets:
- **Models**: Loaded via `useGLTF` from raw GitHub URLs (see `src/components/canvas/Computers.jsx`).
- **Icons**: Fetched from Iconify API (see `src/assets/index.js`).

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
- **EmailJS**: Public keys are currently placeholders. Update `SVC`, `TMPL`, and `KEY` in `Contact.jsx` to enable the form.
- **Responsive Design**: The `ComputersCanvas` uses a `useState` hook to detect mobile viewports and scale models accordingly.
