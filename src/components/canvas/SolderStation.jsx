import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// A small soldering station that replaces the left speaker: an ESP32-style board in a PCB holder, and an iron resting in a
// coil stand. Built from primitives in the desk model's own units (desk top is y=0.25, +x faces the camera, +z is screen-left),
// so it must stay a child of the model's <primitive>. It fits where the speaker was (z 6.2 to 7.5), which keeps it inside
// the frame on phones.

const Part = ({ p, s, c, r = 0.6, m = 0, glow, rot, shape = "box" }) => (
  <mesh position={p} rotation={rot}>
    {shape === "cyl" ? <cylinderGeometry args={s} /> : shape === "torus" ? <torusGeometry args={s} /> : <boxGeometry args={s} />}
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={glow || "#000000"} emissiveIntensity={glow ? 1.8 : 0} />
  </mesh>
);

const METAL = "#a3a0c4";
const DARK = "#2e2a58";
const GOLD = "#e0b95a";

const Board = () => (
  <group>
    <Part p={[0, 0, 0]} s={[0.035, 0.52, 0.5]} c="#12a064" r={0.45} />
    {/* ESP32-style module: metal can plus the black antenna strip */}
    <Part p={[0.03, 0.02, 0]} s={[0.03, 0.2, 0.26]} c="#c6c4da" r={0.3} m={0.8} />
    <Part p={[0.02, 0.18, 0]} s={[0.016, 0.1, 0.26]} c="#0a0912" />
    {/* pin headers */}
    {[-0.22, -0.16, -0.1, -0.04, 0.02, 0.08].map((y) => (
      <React.Fragment key={y}>
        <Part p={[0.028, y, -0.2]} s={[0.03, 0.03, 0.03]} c={GOLD} r={0.3} m={0.9} />
        <Part p={[0.028, y, 0.2]} s={[0.03, 0.03, 0.03]} c={GOLD} r={0.3} m={0.9} />
      </React.Fragment>
    ))}
    {/* copper traces */}
    <Part p={[0.012, -0.12, -0.1]} s={[0.01, 0.012, 0.1]} c={GOLD} r={0.4} m={0.8} />
    <Part p={[0.012, -0.05, 0.1]} s={[0.01, 0.012, 0.1]} c={GOLD} r={0.4} m={0.8} />
    <Part p={[0.012, -0.2, 0.05]} s={[0.01, 0.012, 0.16]} c={GOLD} r={0.4} m={0.8} />
    {/* status LED */}
    <Part p={[0.025, -0.2, -0.04]} s={[0.02, 0.035, 0.05]} c="#ff3b3b" glow="#ff2a2a" />
  </group>
);

const Iron = () => (
  <group>
    <Part p={[0, 0.03, 0]} s={[0.013, 0.013, 0.06, 10]} c="#ff7a1a" glow="#ff6a00" shape="cyl" />
    <Part p={[0, 0.12, 0]} s={[0.012, 0.012, 0.2, 10]} c="#cfcde2" r={0.3} m={0.8} shape="cyl" />
    <Part p={[0, 0.3, 0]} s={[0.03, 0.03, 0.22, 12]} c={METAL} r={0.4} m={0.7} shape="cyl" />
    <Part p={[0, 0.66, 0]} s={[0.05, 0.05, 0.5, 14]} c="#3b3670" r={0.7} shape="cyl" />
    <Part p={[0, 0.48, 0]} s={[0.053, 0.053, 0.05, 14]} c="#ffb340" r={0.5} shape="cyl" />
    <Part p={[0, 1.02, 0]} s={[0.014, 0.014, 0.3, 8]} c="#0d0c1c" shape="cyl" />
  </group>
);

// The parts below are modelled around ANCHOR (their footprint centre on the desk); PLACE and SCALE put them on the desk.
// PLACE sits in front of the monitor's left edge so the monitor never hides the iron, and keeps z inside the phone frame.
const ANCHOR = [-2.1, 0.25, 6.85];
const PLACE = [-0.6, 0.25, 6.75];
const SCALE = 1.35;

const WISPS = 3;

const Smoke = ({ origin }) => {
  const refs = useRef([]);
  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = (clock.elapsedTime * 0.28 + i / WISPS) % 1;
      mesh.position.set(origin[0] + Math.sin(t * 6 + i) * 0.03, origin[1] + t * 0.5, origin[2] + Math.cos(t * 5 + i) * 0.03);
      mesh.scale.setScalar(0.6 + t * 1.6);
      mesh.material.opacity = 0.34 * (1 - t) * Math.min(1, t * 8);
    });
  });
  return Array.from({ length: WISPS }, (_, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} position={origin}>
      <sphereGeometry args={[0.03, 10, 10]} />
      <meshBasicMaterial color="#d8d2ff" transparent opacity={0} depthWrite={false} />
    </mesh>
  ));
};

const SolderStation = () => {
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  return (
    <group position={PLACE} scale={SCALE}>
      <group position={[-ANCHOR[0], -ANCHOR[1], -ANCHOR[2]]}>
      <Part p={[-2.1, 0.28, 6.85]} s={[1.15, 0.06, 1.2]} c="#25214a" r={0.75} />

      {/* PCB holder */}
      <Part p={[-2.3, 0.33, 6.55]} s={[0.3, 0.05, 0.34]} c={DARK} />
      <Part p={[-2.3, 0.56, 6.55]} s={[0.035, 0.035, 0.42, 10]} c={METAL} r={0.4} m={0.7} shape="cyl" />
      <Part p={[-2.3, 0.78, 6.55]} s={[0.05, 0.05, 0.6]} c={METAL} r={0.4} m={0.7} />
      <Part p={[-2.3, 0.9, 6.3]} s={[0.06, 0.26, 0.04]} c={METAL} r={0.4} m={0.7} />
      <Part p={[-2.3, 0.9, 6.8]} s={[0.06, 0.26, 0.04]} c={METAL} r={0.4} m={0.7} />
      <group position={[-2.25, 0.98, 6.55]} rotation={[0, 0, 0.3]}>
        <Board />
      </group>

      {/* iron stand */}
      <Part p={[-1.95, 0.31, 7.15]} s={[0.42, 0.07, 0.42]} c={DARK} />
      <Part p={[-1.95, 0.55, 7.15]} s={[0.04, 0.04, 0.42, 10]} c={METAL} r={0.4} m={0.7} shape="cyl" />
      {[0.7, 0.76, 0.82, 0.88].map((y) => (
        <Part key={y} p={[-1.95, y, 7.15]} rot={[Math.PI / 2, 0, 0]} s={[0.085, 0.014, 8, 20]} c={METAL} r={0.35} m={0.8} shape="torus" />
      ))}
      <group position={[-1.95, 0.72, 7.15]} rotation={[-0.55, 0, 0]}>
        <Iron />
      </group>
      {!reduce && <Smoke origin={[-1.95, 0.76, 7.15]} />}
      </group>
    </group>
  );
};

export default SolderStation;
