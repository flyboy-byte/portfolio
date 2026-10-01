import { carWrench, arduino, linux, radioTower, git, python, typescript, reactjs, threejs, bash, gmLogo, aseLogo, hamLogo, dragTree, discTracker, portfolioSite, moomooTrader, crosslight, riscvPico } from "../assets";
  export const navLinks = [
    { id: "about", title: "About" },
    { id: "work", title: "Credentials" },
    { id: "contact", title: "Contact" },
  ];
  export const services = [
    { title: "Automotive Diagnostics", icon: carWrench },
    { title: "Embedded Systems", icon: arduino },
    { title: "Linux & CLI", icon: linux },
    { title: "Extra Class Ham Radio", icon: radioTower },
  ];
  export const technologies = [
    { name: "Linux", icon: linux }, { name: "Git", icon: git },
    { name: "Arduino", icon: arduino }, { name: "Python", icon: python },
    { name: "TypeScript", icon: typescript }, { name: "React", icon: reactjs },
    { name: "Three.js", icon: threejs }, { name: "Bash", icon: bash },
  ];
  export const experiences = [
    {
      title: "GM ASEP Student",
      company_name: "General Motors — Automotive Service Educational Program",
      icon: gmLogo, iconBg: "#0a1628", date: "2025 – Present",
      points: [
        "Studying GM-specific vehicle systems including powertrain, electrical, HVAC, and advanced diagnostics through a dealer-sponsored cooperative program.",
        "Working hands-on in a GM dealership performing warranty repairs alongside certified technicians.",
        "Proficient with GDS2 and TIS2Web for OEM-level diagnostics and service information.",
      ],
    },
    {
      title: "ASE Certified Technician",
      company_name: "National Institute for Automotive Service Excellence",
      icon: aseLogo, iconBg: "#0a1628", date: "Active",
      points: [
        "A1 — Engine Repair: cylinder head, valve train, lubrication/cooling systems, and engine mechanical diagnosis.",
        "A6 — Electrical/Electronic Systems: charging, starting, lighting, and body electrical diagnosis.",
        "A4 — Steering & Suspension: alignment theory, component inspection, and ride-height diagnosis.",
        "A5 — Brakes: hydraulic systems, ABS, and friction system service.",
        "A7 — Heating & Air Conditioning: HVAC system diagnosis, refrigerant handling, and climate control service.",
        "A9 — Light Vehicle Diesel Engines: diesel fuel systems, emissions, and engine mechanical diagnosis.",
        "A3 — Manual Drive Train & Axles: clutch systems, manual transmissions, drive shafts, and axle/differential service.",
      ],
    },
    {
      title: "Extra Class Amateur Radio Operator",
      company_name: "Federal Communications Commission (FCC)",
      icon: hamLogo, iconBg: "#0a1628", date: "Active",
      points: [
        "Holds FCC Extra Class license — full access to all amateur frequency privileges.",
        "Hands-on with HF propagation, antenna design, and RF interference diagnosis.",
        "Experiments with SDR, digital modes, and Linux-based signal processing tools.",
      ],
    },
  ];
  export const projects = [
    {
      name: "crosslight",
      description: "Open-source e-reader firmware written in C — custom rendering pipeline, font handling, and display drivers for e-ink hardware.",
      tags: [{ name: "C", color: "blue-text-gradient" }, { name: "Embedded", color: "green-text-gradient" }, { name: "Firmware", color: "pink-text-gradient" }],
      image: crosslight,
      source_code_link: "https://github.com/flyboy-byte/crosslight",
    },
    {
      name: "drag-tree",
      description: "NHRA Pro Tree drag strip reaction timer — an Expo React Native app for accurate practice starts at the track.",
      tags: [{ name: "TypeScript", color: "blue-text-gradient" }, { name: "React Native", color: "green-text-gradient" }, { name: "Expo", color: "pink-text-gradient" }],
      image: dragTree,
      source_code_link: "https://github.com/flyboy-byte/drag-tree",
    },
    {
      name: "disc-tracker",
      description: "Self-hosted disc golf bag tracker — multi-user disc library with flight path visualization, stability filters, and CSV import/export.",
      tags: [{ name: "Python", color: "blue-text-gradient" }, { name: "Flask", color: "green-text-gradient" }, { name: "Self-hosted", color: "pink-text-gradient" }],
      image: discTracker,
      source_code_link: "https://github.com/flyboy-byte/disc-tracker",
    },
    {
      name: "portfolio",
      description: "This site — a 3D interactive portfolio built with React, Three.js, and Tailwind, deployed via GitHub Actions to a custom domain.",
      tags: [{ name: "React", color: "blue-text-gradient" }, { name: "Three.js", color: "green-text-gradient" }, { name: "Vite", color: "pink-text-gradient" }],
      image: portfolioSite,
      source_code_link: "https://github.com/flyboy-byte/portfolio",
    },
    {
      name: "riscv-pico",
      description: "Real Linux on a Raspberry Pi Pico — the RP2040 emulates a RISC-V CPU in software, with SPI PSRAM as system memory, PS/2 keyboard input, and VGA video output.",
      tags: [{ name: "C", color: "blue-text-gradient" }, { name: "RISC-V", color: "green-text-gradient" }, { name: "Embedded Linux", color: "pink-text-gradient" }],
      image: riscvPico,
      source_code_link: "https://github.com/flyboy-byte/riscv-pico",
    },
    {
      name: "moomoo-trader",
      description: "Systematic strategy research and paper-trading platform on the Moomoo API — three validated strategies with backtesting, walk-forward validation, and live dashboards. Paper trading only, no live orders.",
      tags: [{ name: "Python", color: "blue-text-gradient" }, { name: "Trading", color: "green-text-gradient" }, { name: "Backtesting", color: "pink-text-gradient" }],
      image: moomooTrader,
      source_code_link: "https://github.com/flyboy-byte/moomoo-trader",
    },
  ];
