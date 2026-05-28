import { carWrench, arduino, linux, radioTower, git, python, typescript, reactjs, threejs, bash, gmLogo, aseLogo, hamLogo, fossRadar, dragTree, linuxBloat } from "../assets";
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
    {
      name: "pkgfilter",
      description: "Arch Linux bloat hunter. Queries every installed package via pacman and lets you progressively filter known-good packages across revision files to isolate removal candidates. Optionally scans for large dirs and files outside package management.",
      tags: [{ name: "Python", color: "blue-text-gradient" }, { name: "Arch Linux", color: "green-text-gradient" }, { name: "CLI", color: "pink-text-gradient" }],
      image: linuxBloat,
      source_code_link: "https://github.com/flyboy-byte/LinuxBloat",
    },
  ];
export const papers = [
  {
    title: 'Evaluating Common AI APIs and Models',
    description: 'Comparative analysis of frontier and value-tier LLMs — pricing, benchmark scores, latency, and a practical three-lane stack recommendation for a student/technical workflow.',
    tags: ['AI', 'LLMs', 'APIs', 'Reference'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/ai-apis-report.pdf',
  },
  {
    title: 'Vendor-Kernel Preservation in Qualcomm-Based SBCs',
    description: 'Technical guide to replacing the userspace on the Arduino UNO Q while keeping the BSP kernel, bootloader, firmware blobs, and device tree intact.',
    tags: ['Embedded', 'Linux', 'Qualcomm', 'SBC'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/qualcomm-kernel.html',
  },
  {
    title: 'Phasing, Math, and Signals — Ham Extra Learner Manual',
    description: 'Connects trigonometry, complex numbers, and Fourier theory to real RF behavior. Built for Ham Extra exam prep and practical antenna and modulation intuition.',
    tags: ['Ham Radio', 'RF', 'Math', 'Extra Class'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/ham-radio-math.pdf',
  },
  {
    title: 'T1D Field Management and Insulin Pen Survival Guide v2',
    description: 'Evidence-grounded field guide for Type 1 Diabetes management in austere or off-grid conditions — storage limits, monitoring protocols, and evacuation triggers.',
    tags: ['Medical', 'Field Guide', 'T1D', 'Wilderness'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/t1d-field-guide.pdf',
  },
  {
    title: 'Pure Arch on an Older Dell Latitude',
    description: 'A real BIOS/MBR LUKS install progression on a Dell Latitude E5540 — capturing failed paths, ext4 tooling pitfalls, GRUB/LUKS config, and the final clean architecture.',
    tags: ['Linux', 'Arch', 'Security', 'Systems'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/arch-dell-latitude.html',
  },
  {
    title: 'HP LaserJet P1005 on Arch Linux',
    description: 'Install guide, diagnostics, and open-source fallback driver for the HP LaserJet P1005 host-based laser on Arch Linux — HPLIP, foo2zjs Plan B, CUPS queue management, and a repair log.',
    tags: ['Linux', 'Arch', 'Hardware', 'CUPS'],
    link: 'https://flyboy-byte.github.io/portfolio/papers/hp-p1005-arch.html',
  },
];