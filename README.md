# Logan Night — Portfolio

Personal portfolio website for Logan Night (`flyboy-byte`), showcasing expertise in automotive diagnostics, embedded systems, Linux, and amateur radio.

> [!NOTE]
> **Status**: Local development phase. Deployment is currently on hold.

---

## 🤖 AI / Vibe Coding Context
*This section is for AI assistants and vibe-coding platforms to quickly understand the project state.*

- **Goal**: A high-end, 3D interactive portfolio that highlights technical maker skills.
- **Key Files**:
  - `src/constants/index.js`: The "source of truth" for all content.
  - `src/assets/index.js`: Maps icon/asset names to external URLs.
  - `src/components/canvas/`: Contains all Three.js logic.
- **Current Footing**:
  - Repo is cleaned and documented.
  - Architecture overview is available in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
  - All external assets are currently linked via HTTPS to bypass local LFS/proxy issues.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **3D Engine**: Three.js (@react-three/fiber + @react-three/drei)
- **Icons**: Iconify (Dynamic SVG loading)
- **Contact**: EmailJS (configured for `logan07night@gmail.com`)

## 🛠️ Key Features

- **3D Hero**: Interactive desktop PC model with custom lighting and typewriter effects.
- **Maker-Centric Content**: Custom sections for GM ASEP training, ASE certifications, and Ham Radio expertise.
- **Project Cards**: Dynamic previews for `foss-radar` and `drag-tree` using GitHub OpenGraph cards.
- **Interactive Tech Stack**: 3D "Tech Balls" that users can rotate and interact with.

## 📦 Project Structure

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a detailed breakdown of the component hierarchy and design patterns.

## 🛠️ Local Development

1. **Clone & Install**:
   ```bash
   git clone https://github.com/flyboy-byte/portfolio.git
   cd portfolio
   npm install
   ```
2. **Run Dev**:
   ```bash
   npm run dev
   ```

## 📝 Roadmap & Next Steps

- [x] Base React + Vite app configured.
- [x] Content adapted for Logan's profile.
- [x] Architecture documentation added.
- [x] Contact email updated to `logan07night@gmail.com`.
- [ ] **EmailJS Activation**: Replace `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`, and `YOUR_PUBLIC_KEY` in `src/components/Contact.jsx`.
- [ ] **Asset Localizing**: (Optional) Move external 3D models/icons to local `public/` or `src/assets/` once deployment is stable.
- [ ] **Custom 3D Model**: Replace the default PC model with a custom "Logan-themed" workspace model.

---

## 📜 Credits & References

- **Base Template**: [lohitkolluri/Portfolio-Website](https://github.com/lohitkolluri/Portfolio-Website) — Used as the initial structural foundation for this 3D portfolio.
- **Design Inspiration**: Adapted to focus on automotive diagnostics, maker projects, and ham radio.

---
*Built with React, Three.js, and Framer Motion.*
