import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// A soldering bench where the left speaker was: a temperature-controlled station, the iron in a cone-coil stand with brass
// wool, helping hands holding a populated board, and a solder spool. Built from primitives in centimetres (the keyboard is
// 4.05 model units = 44 cm, so 1 unit = 10.9 cm) and must stay a child of the desk model's <primitive>.
// Desk axes: +x toward the camera, +y up (desk top is y=0.25), +z screen-left. Everything stays at z <= 80 cm so phones
// keep it in frame.

const CM = 1 / 10.9;
const DESK_Y = 0.25;

// Left to right as the camera sees it: station at the back, helping hands in front of it, then the iron stand and spool
// beside the keyboard's far end.
const STATION = [-21, 0, 74];
const STATION_YAW = 0.2;
const SOCKET = [6.9, 2.9, -3.6];
const HANDS = [3, 0, 63];
const STAND = [4, 0, 50];
const SPOOL = [-3, 0, 38];

// The iron rests in the coil, tip down, handle rising back toward the station so the cable run stays short and off the
// keyboard.
const IRON_DIR = new THREE.Vector3(-0.72, 0.52, 0.26).normalize();
const COIL_BASE = new THREE.Vector3(STAND[0] - 0.6, 3.4, STAND[2] + 1.2);
const IRON_TIP = COIL_BASE.clone().addScaledVector(IRON_DIR, 0.6);
const IRON_LEN = 19;

const WISPS = 4;

// Drawn at 2x the layout size so small text and traces stay crisp when the camera gets close.
const TEX_SCALE = 2;

const canvasTexture = (w, h, draw, anisotropy = 1) => {
  const c = document.createElement("canvas");
  c.width = w * TEX_SCALE;
  c.height = h * TEX_SCALE;
  const g = c.getContext("2d");
  g.scale(TEX_SCALE, TEX_SCALE);
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  return t;
};

// Board artwork: solder mask, traces, pads and silkscreen, so the PCB reads as a real board rather than a green slab.
const drawBoard = (g, w, h) => {
  g.fillStyle = "#0c5a35";
  g.fillRect(0, 0, w, h);
  g.strokeStyle = "#1d7a4c";
  g.lineWidth = 5;
  g.lineCap = "round";
  const trace = (pts) => {
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  };
  for (let i = 0; i < 9; i++) trace([[40 + i * 52, 28], [40 + i * 52, 90], [150 + i * 30, 150], [150 + i * 30, 230]]);
  for (let i = 0; i < 6; i++) trace([[60, 260 + i * 22], [260, 260 + i * 22], [300, 300 + i * 10]]);
  trace([[330, 180], [470, 180], [470, 340]]);
  trace([[350, 220], [440, 220], [440, 360]]);
  g.fillStyle = "#d6b45a";
  for (let i = 0; i < 12; i++) {
    g.beginPath();
    g.arc(30 + i * 41, 18, 9, 0, Math.PI * 2);
    g.arc(30 + i * 41, h - 18, 9, 0, Math.PI * 2);
    g.fill();
  }
  [[90, 330], [380, 110], [420, 300]].forEach(([x, y]) => g.fillRect(x, y, 18, 10));
  g.fillStyle = "#e9efe9";
  g.font = "bold 22px monospace";
  g.fillText("LN-01  rev B", 300, 380);
  g.fillText("U1", 120, 200);
  g.fillText("+3V3", 30, 240);
  g.strokeStyle = "#e9efe9";
  g.lineWidth = 2;
  g.strokeRect(70, 110, 170, 110);
};

// The station's LED readout: lit segments plus faint unlit ones, which is what makes a 7-segment display read as one.
const drawDisplay = (g, w, h) => {
  g.fillStyle = "#07070a";
  g.fillRect(0, 0, w, h);
  g.font = "bold 92px monospace";
  g.textBaseline = "middle";
  g.fillStyle = "#2a0d06";
  g.fillText("888", 22, h / 2 + 4);
  g.fillStyle = "#ff5a1f";
  g.shadowColor = "#ff5a1f";
  g.shadowBlur = 14;
  g.fillText("350", 22, h / 2 + 4);
  g.font = "bold 30px monospace";
  g.fillText("°C", 200, 36);
};

const smokeSprite = (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  r.addColorStop(0, "rgba(235,232,255,0.9)");
  r.addColorStop(0.4, "rgba(235,232,255,0.35)");
  r.addColorStop(1, "rgba(235,232,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, w, h);
};

const useMaterials = () => {
  const { gl } = useThree();
  return useMemo(() => {
    // A small studio reflection map, applied only to this bench, so metal reads as metal without relighting the desk model.
    const aniso = gl.capabilities.getMaxAnisotropy();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    const std = (color, roughness, metalness = 0, extra = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness, envMap: env, envMapIntensity: 0.55, ...extra });
    return {
      body: std("#1a1c24", 0.45, 0.3),
      panel: std("#0d0e13", 0.3, 0.2),
      rubber: std("#22232b", 0.85),
      cable: std("#141418", 0.6),
      steel: std("#c8cad4", 0.28, 1),
      chrome: std("#eef0f6", 0.12, 1),
      brass: std("#d1a54c", 0.45, 1),
      amber: std("#ffb340", 0.45, 0.1),
      red: std("#c8312b", 0.5),
      blackPlastic: std("#0c0c10", 0.4),
      gold: std("#e2bd5c", 0.3, 1),
      chip: std("#16161a", 0.35),
      solder: std("#b8bbc4", 0.3, 0.9),
      capBlue: std("#24357a", 0.4),
      resistor: std("#d8c49a", 0.6),
      board: std("#ffffff", 0.5, 0, { map: canvasTexture(512, 400, drawBoard, aniso) }),
      display: new THREE.MeshBasicMaterial({ map: canvasTexture(256, 128, drawDisplay, aniso), toneMapped: false }),
      tip: std("#9a9aa4", 0.3, 1, { emissive: "#ff5a10", emissiveIntensity: 0 }),
      led: new THREE.MeshBasicMaterial({ color: "#ff3030", toneMapped: false }),
      smoke: canvasTexture(64, 64, smokeSprite),
    };
  }, [gl]);
};

const M = ({ geo, mat, ...props }) => (
  <mesh material={mat} castShadow receiveShadow {...props}>
    {geo}
  </mesh>
);

const Cyl = ({ r, r2 = r, h, seg = 28, ...props }) => <M geo={<cylinderGeometry args={[r2, r, h, seg]} />} {...props} />;

const Tube = ({ points, r, seg = 64, closed = false, ...props }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  return <M geo={<tubeGeometry args={[curve, seg, r, 10, closed]} />} {...props} />;
};

// --- station -------------------------------------------------------------------------------------------------------------

const Station = ({ m }) => (
  <group position={STATION} rotation={[0, STATION_YAW, 0]}>
    <RoundedBox args={[13, 8.5, 11]} radius={0.6} smoothness={3} position={[0, 4.4, 0]} material={m.body} castShadow receiveShadow />
    <M geo={<boxGeometry args={[0.3, 7.2, 9.8]} />} mat={m.panel} position={[6.55, 4.4, 0]} />
    <M geo={<planeGeometry args={[5.6, 2.8]} />} mat={m.display} position={[6.72, 6, 0.9]} rotation={[0, Math.PI / 2, 0]} />
    <M geo={<boxGeometry args={[0.2, 0.25, 9.8]} />} mat={m.amber} position={[6.72, 8.2, 0]} />
    {[-1.6, 0.2, 2].map((z) => (
      <RoundedBox key={z} args={[0.5, 0.9, 1.3]} radius={0.15} position={[6.85, 2.9, z]} material={m.rubber} />
    ))}
    <Cyl r={0.7} h={0.6} mat={m.steel} position={SOCKET} rotation={[0, 0, Math.PI / 2]} />
    <RoundedBox args={[0.5, 1.4, 0.9]} radius={0.12} position={[6.85, 2.9, 4]} material={m.red} />
    {[-4.5, 4.5].map((z) =>
      [-5.5, 5.5].map((x) => <Cyl key={`${x}${z}`} r={0.7} h={0.3} mat={m.rubber} position={[x, 0.15, z]} />)
    )}
  </group>
);

// --- iron in its stand ---------------------------------------------------------------------------------------------------

// Lathe profiles, [radius, y] from the tip upward; each section is its own mesh so it can take its own material.
const IRON_PARTS = [
  ["tip", [[0, 0], [0.12, 0.25], [0.2, 1.2], [0.24, 2.4], [0.3, 2.6]]],
  ["steel", [[0.3, 2.6], [0.38, 2.8], [0.38, 6.2], [0.5, 6.4]]],
  ["amber", [[0.5, 6.4], [0.82, 6.7], [0.82, 7.3], [0.9, 7.4]]],
  ["rubber", [[0.9, 7.4], [1.02, 8.5], [1.0, 12.5], [0.92, 14], [0.88, 14.6]]],
  ["cable", [[0.88, 14.6], [0.6, 15.2], [0.45, 17.5], [0.32, IRON_LEN], [0, IRON_LEN]]],
];

const Iron = ({ m }) => {
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), IRON_DIR), []);
  return (
    <group position={IRON_TIP} quaternion={quat}>
      {IRON_PARTS.map(([mat, pts]) => (
        <M key={mat} geo={<latheGeometry args={[pts.map(([r, y]) => new THREE.Vector2(r, y)), 32]} />} mat={m[mat]} />
      ))}
      {/* grip ribs */}
      {[9, 10, 11, 12].map((y) => (
        <M key={y} geo={<torusGeometry args={[1.02, 0.07, 6, 32]} />} mat={m.blackPlastic} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
};

// The cone coil the iron sits in, as a real helix rather than stacked rings.
const coilPoints = () => {
  const pts = [];
  const turns = 6.5;
  for (let i = 0; i <= 160; i++) {
    const t = i / 160;
    const a = t * turns * Math.PI * 2;
    const r = 0.9 + 1.0 * t;
    pts.push([Math.cos(a) * r, t * 8.5, Math.sin(a) * r]);
  }
  return pts;
};

const IronStand = ({ m }) => {
  const coil = useMemo(coilPoints, []);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), IRON_DIR), []);
  return (
    <group>
      <group position={STAND}>
        <Cyl r={5} r2={4.6} h={1.6} seg={48} mat={m.body} position={[0, 0.8, 0]} />
        {/* brass-wool cup */}
        <Cyl r={2.1} r2={2.3} h={2.2} mat={m.chrome} position={[2.2, 2.6, -1.8]} />
        <M geo={<icosahedronGeometry args={[1.9, 3]} />} mat={m.brass} position={[2.2, 3.5, -1.8]} scale={[1, 0.55, 1]} />
        {/* coil mount */}
        <Cyl r={0.9} h={2.4} mat={m.steel} position={[-0.6, 2.6, 1.2]} />
      </group>
      <group position={COIL_BASE} quaternion={quat}>
        <Tube points={coil} r={0.14} seg={320} mat={m.chrome} />
      </group>
      <Iron m={m} />
    </group>
  );
};

// --- helping hands with a board ------------------------------------------------------------------------------------------

const Clip = ({ m, ...props }) => (
  <group {...props}>
    <M geo={<boxGeometry args={[0.5, 0.25, 2]} />} mat={m.chrome} position={[0, 0.2, 0]} rotation={[0.08, 0, 0]} />
    <M geo={<boxGeometry args={[0.5, 0.25, 2]} />} mat={m.chrome} position={[0, -0.2, 0]} rotation={[-0.08, 0, 0]} />
    <M geo={<boxGeometry args={[0.6, 0.7, 0.8]} />} mat={m.red} position={[0, 0, 1.3]} />
  </group>
);

const Board = ({ m }) => (
  <group>
    <M geo={<boxGeometry args={[5, 0.16, 6.4]} />} mat={[m.chip, m.chip, m.board, m.chip, m.chip, m.chip]} />
    {/* ESP32-style module: shield can plus antenna */}
    <M geo={<boxGeometry args={[1.8, 0.32, 1.6]} />} mat={m.steel} position={[-0.8, 0.25, 1.4]} />
    <M geo={<boxGeometry args={[0.8, 0.1, 1.6]} />} mat={m.chip} position={[-2.1, 0.12, 1.4]} />
    {/* DIP chip with legs */}
    <M geo={<boxGeometry args={[1.2, 0.3, 2]} />} mat={m.chip} position={[0.9, 0.3, -1.6]} />
    {[-0.8, -0.27, 0.27, 0.8].map((z) =>
      [-0.66, 0.66].map((x) => <M key={`${x}${z}`} geo={<boxGeometry args={[0.18, 0.3, 0.14]} />} mat={m.steel} position={[0.9 + x, 0.18, -1.6 + z]} />)
    )}
    {/* resistors, electrolytic cap, header, status LED */}
    {[-1.6, -1.1, -0.6].map((x) => (
      <Cyl key={x} r={0.16} h={0.9} seg={12} mat={m.resistor} position={[x, 0.3, -1.4]} rotation={[Math.PI / 2, 0, 0]} />
    ))}
    <Cyl r={0.4} h={1.1} mat={m.capBlue} position={[1.4, 0.63, 1.8]} />
    <Cyl r={0.38} h={0.04} mat={m.steel} position={[1.4, 1.19, 1.8]} />
    <M geo={<boxGeometry args={[0.3, 0.3, 4.4]} />} mat={m.chip} position={[2.1, 0.23, -0.2]} />
    <M geo={<boxGeometry args={[0.24, 0.24, 0.24]} />} mat={m.led} position={[-1.8, 0.2, -2.6]} />
    {/* a solder blob on a pad, still bright */}
    <M geo={<sphereGeometry args={[0.18, 12, 8]} />} mat={m.solder} position={[0.2, 0.1, 0.4]} scale={[1, 0.5, 1]} />
  </group>
);

const BOARD_AT = [0.5, 12, 0];
const ARM_ENDS = [-3.9, 3.9];
const armPoints = (z) => [[0, 7, 0], [-0.5, 11, z * 0.35], [0.2, 13.5, z * 0.85], [BOARD_AT[0], BOARD_AT[1] + 0.3, z]];

const HelpingHands = ({ m }) => (
  <group position={HANDS} rotation={[0, 0.15, 0]}>
    <RoundedBox args={[6, 1.6, 9.5]} radius={0.4} smoothness={3} position={[0, 0.8, 0]} material={m.body} castShadow receiveShadow />
    <Cyl r={0.35} h={6} mat={m.chrome} position={[0, 4.6, 0]} />
    <Cyl r={0.7} h={1.2} mat={m.blackPlastic} position={[0, 7.2, 0]} />
    {ARM_ENDS.map((z) => (
      <React.Fragment key={z}>
        <Tube points={armPoints(z)} r={0.32} seg={48} mat={m.rubber} />
        <Clip m={m} position={[BOARD_AT[0], BOARD_AT[1], z + 0.4 * Math.sign(z)]} rotation={[0, z > 0 ? 0 : Math.PI, -1.0]} />
      </React.Fragment>
    ))}
    {/* tilted toward the camera so the populated face is what you see */}
    <group position={BOARD_AT} rotation={[0, 0, -0.95]}>
      <Board m={m} />
    </group>
  </group>
);

// --- solder spool and the iron's cable -----------------------------------------------------------------------------------

const Spool = ({ m }) => (
  <group position={SPOOL}>
    <Cyl r={3.4} h={0.3} seg={40} mat={m.blackPlastic} position={[0, 0.15, 0]} />
    <Cyl r={2.9} h={2.4} seg={40} mat={m.solder} position={[0, 1.5, 0]} />
    <Cyl r={3.4} h={0.3} seg={40} mat={m.blackPlastic} position={[0, 2.85, 0]} />
    <Cyl r={1.1} h={0.32} seg={24} mat={m.chip} position={[0, 2.9, 0]} />
    <Tube points={[[2.9, 1.8, 0], [4.2, 1.2, 1.5], [5, 0.25, 4], [4.4, 0.18, 7.5]]} r={0.07} seg={40} mat={m.solder} />
  </group>
);

// From the back of the iron, arcing over and sagging down to the station's front socket.
const cablePoints = () => {
  const end = IRON_TIP.clone().addScaledVector(IRON_DIR, IRON_LEN);
  const toStation = (p) => new THREE.Vector3(...p).applyAxisAngle(new THREE.Vector3(0, 1, 0), STATION_YAW).add(new THREE.Vector3(...STATION));
  const socket = toStation(SOCKET);
  const out = toStation([SOCKET[0] + 3, SOCKET[1] - 1, SOCKET[2]]);
  return [
    end.toArray(),
    end.clone().addScaledVector(IRON_DIR, 1.5).add(new THREE.Vector3(-0.5, -0.8, 0)).toArray(),
    [end.x - 3, end.y - 5, end.z + 1],
    [(end.x + out.x) / 2, 1.2, (end.z + out.z) / 2 - 1],
    out.toArray(),
    socket.toArray(),
  ];
};

const Cable = ({ m }) => {
  const pts = useMemo(cablePoints, []);
  return <Tube points={pts} r={0.3} seg={120} mat={m.cable} />;
};

// --- smoke and the hot tip -----------------------------------------------------------------------------------------------

const Smoke = ({ m, origin }) => {
  const refs = useRef([]);
  useFrame(({ clock }) => {
    m.tip.emissiveIntensity = 0.6 + 0.15 * Math.sin(clock.elapsedTime * 2.3);
    refs.current.forEach((s, i) => {
      if (!s) return;
      const t = (clock.elapsedTime * 0.22 + i / WISPS) % 1;
      s.position.set(origin[0] + Math.sin(t * 5 + i * 2) * 0.8 * t, origin[1] + t * 9, origin[2] + Math.cos(t * 4 + i) * 0.8 * t);
      s.scale.setScalar(1.2 + t * 4);
      s.material.opacity = 0.32 * (1 - t) * Math.min(1, t * 6);
    });
  });
  return Array.from({ length: WISPS }, (_, i) => (
    <sprite key={i} ref={(el) => (refs.current[i] = el)}>
      <spriteMaterial map={m.smoke} transparent opacity={0} depthWrite={false} />
    </sprite>
  ));
};

const SolderStation = () => {
  const m = useMaterials();
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useLayoutEffect(() => {
    if (reduce) m.tip.emissiveIntensity = 0.6;
  }, [m, reduce]);
  return (
    <group position={[0, DESK_Y, 0]} scale={CM}>
      <Station m={m} />
      <IronStand m={m} />
      <HelpingHands m={m} />
      <Spool m={m} />
      <Cable m={m} />
      {!reduce && <Smoke m={m} origin={[IRON_TIP.x, IRON_TIP.y + 1, IRON_TIP.z]} />}
    </group>
  );
};

export default SolderStation;
