import { carWrench, arduino, linux, radioTower, git, python, typescript, reactjs, threejs, bash, gmLogo, aseLogo, hamLogo, fossRadar, dragTree } from "../assets";
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
      icon: gmLogo, iconBg: "#0a1628", date: "2022 – Present",
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
        "A6 — Electrical/Electronic Systems: charging, starting, lighting, and body electrical diagnosis.",
        "A4 — Steering & Suspension: alignment theory, component inspection, and ride-height diagnosis.",
        "A5 — Brakes: hydraulic systems, ABS, and friction system service.",
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
      name: "foss-radar",
      description: "Personal FOSS dashboard for discovering, tracking, and monitoring open-source software worth following.",
      tags: [{ name: "TypeScript", color: "blue-text-gradient" }, { name: "FOSS tracking", color: "green-text-gradient" }, { name: "Dashboard", color: "pink-text-gradient" }],
      image: fossRadar,
      source_code_link: "https://github.com/flyboy-byte/foss-radar",
    },
    {
      name: "drag-tree",
      description: "NHRA Pro Tree drag strip reaction timer — an Expo React Native app for accurate practice starts at the track.",
      tags: [{ name: "TypeScript", color: "blue-text-gradient" }, { name: "React Native", color: "green-text-gradient" }, { name: "Expo", color: "pink-text-gradient" }],
      image: dragTree,
      source_code_link: "https://github.com/flyboy-byte/drag-tree",
    },
  ];