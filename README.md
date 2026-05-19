# Logan Night — Portfolio

  Personal portfolio website for Logan Night (`flyboy-byte`), showcasing expertise in automotive diagnostics, embedded systems, Linux, and amateur radio.

  > [!NOTE]
  > **Status**: Ready to deploy. Trigger the GitHub Actions workflow to go live at `flyboy-byte.github.io/portfolio`.

  ---

  ## 🤖 AI / Vibe Coding Context
  *This section is for AI assistants and vibe-coding platforms to quickly understand the project state.*

  - **Goal**: A high-end, 3D interactive portfolio that highlights technical maker skills.
  - **Key Files**:
    - `src/constants/index.js`: The "source of truth" for all content.
    - `src/assets/index.js`: Maps icon/asset names to external URLs.
    - `src/components/canvas/`: Contains all Three.js logic.
  - **Current State**:
    - All source files pushed and content is Logan's.
    - EmailJS is fully configured — service, template, and public key are live.
    - Resume button in Navbar points to `/portfolio/Resume.pdf` — Logan will upload `Resume.pdf` to `public/`.
    - GitHub Actions deploy workflow is in `.github/workflows/deploy.yml` — triggers on push to `main`.
    - Architecture overview available in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
    - All external assets linked via HTTPS (Iconify CDN for icons, raw GitHub URLs for 3D models).

  ---

  ## 🚀 Tech Stack

  - **Framework**: React 18 + Vite
  - **Styling**: Tailwind CSS + Framer Motion
  - **3D Engine**: Three.js (@react-three/fiber + @react-three/drei)
  - **Icons**: Iconify (dynamic SVG loading via CDN)
  - **Contact**: EmailJS (configured for `logan07night@gmail.com`)

  ## 🛠️ Key Features

  - **3D Hero**: Interactive desktop PC model with custom lighting and typewriter effects cycling through Logan's skills.
  - **Maker-Centric Content**: Custom sections for GM ASEP training, ASE certifications (A4/A5/A6), and Extra Class ham radio.
  - **Project Cards**: Dynamic previews for `foss-radar` and `drag-tree` using GitHub OpenGraph cards.
  - **Interactive Tech Stack**: 3D "Tech Balls" for Linux, Git, Arduino, Python, TypeScript, React, Three.js, Bash.
  - **Contact Form**: Wired to EmailJS — sends directly to `logan07night@gmail.com`.

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

  ## 🌐 Deploy

  Push to `main` — GitHub Actions builds and deploys to the `gh-pages` branch automatically.
  Enable GitHub Pages under **Settings → Pages → Source: gh-pages branch** on first run.

  Live URL: **https://flyboy-byte.github.io/portfolio**

  ## 📝 Status

  - [x] Base React + Vite app configured with `base: "/portfolio/"`
  - [x] Content adapted for Logan's profile (bio, credentials, projects)
  - [x] Architecture documentation added
  - [x] EmailJS fully configured (`service_vsyd175` / `template_31v002c`)
  - [x] Contact sends to `logan07night@gmail.com`
  - [x] GitHub Actions deploy workflow ready
  - [ ] Upload `Resume.pdf` to `public/` (Logan doing this manually)
  - [ ] Run first deploy / enable GitHub Pages

  ---

  ## 📜 Credits & References

  - **Base Template**: [lohitkolluri/Portfolio-Website](https://github.com/lohitkolluri/Portfolio-Website) — Used as the initial structural foundation.
  - **Design Inspiration**: Adapted to focus on automotive diagnostics, maker projects, and ham radio.

  ---
  *Built with React, Three.js, and Framer Motion.*