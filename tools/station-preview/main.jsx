// Dev-only close-up of the solder station on the real desk model: `npm run dev`, then /tools/station-preview/?cam=x,y,z&t=x,y,z
import React from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import SolderStation from "../../src/components/canvas/SolderStation";

const q = new URLSearchParams(location.search);
const vec = (k, d) => (q.get(k) ? q.get(k).split(",").map(Number) : d);
const cam = vec("cam", [6, 0.5, 6]);
const target = vec("t", [-0.4, -2.3, 3.5]);

const Desk = () => {
  const { scene } = useGLTF("/models/desktop_pc/scene.gltf");
  return (
    <primitive object={scene} scale={0.75} position={[0, -3.25, -1.5]} rotation={[-0.01, -0.2, -0.1]}>
      <SolderStation />
    </primitive>
  );
};

createRoot(document.getElementById("root")).render(
  <Canvas shadows camera={{ position: cam, fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
    <hemisphereLight intensity={0.15} groundColor="black" />
    <spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
    <pointLight intensity={1} />
    <pointLight position={[4, 0, 6]} intensity={0.9} color="#a98bff" distance={20} />
    <React.Suspense fallback={null}><Desk /></React.Suspense>
    <OrbitControls target={target} />
  </Canvas>
);
