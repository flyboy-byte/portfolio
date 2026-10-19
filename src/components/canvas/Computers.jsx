import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const DESKTOP_GLTF = "/models/desktop_pc/scene.gltf";
const MOBILE_GLB = "/models/pc-mobile.glb";

const Computer = ({ url }) => {
  const { scene } = useGLTF(url);
  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <pointLight intensity={1} />
      <primitive object={scene} scale={0.75} position={[0, -3.25, -1.5]} rotation={[-0.01, -0.2, -0.1]} />
    </mesh>
  );
};

const Memo = React.memo(Computer);

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // OrbitControls forces touch-action:none, which would block page scroll over the hero on touch devices.
  return (
    <Canvas
      key={isMobile ? "m" : "d"}
      frameloop="demand"
      shadows={!isMobile}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [20, 3, 5], fov: isMobile ? 48 : 25 }}
      gl={{ preserveDrawingBuffer: true }}
      style={{ touchAction: isMobile ? "pan-y" : undefined }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {!isMobile && <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />}
        <Memo url={isMobile ? MOBILE_GLB : DESKTOP_GLTF} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
