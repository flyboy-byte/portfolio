import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal, Float, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";

const useRasterTexture = (url) => {
  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 256, 256);
      setTexture(new THREE.CanvasTexture(canvas));
    };
    img.onerror = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      setTexture(new THREE.CanvasTexture(canvas));
    };
    img.src = url;
  }, [url]);
  return texture;
};

const Ball = React.memo(({ iconUrl }) => {
  const texture = useRasterTexture(iconUrl);
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        {texture && (
          <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={texture} flatShading />
        )}
      </mesh>
    </Float>
  );
});

const BallCanvas = ({ icon }) => {
  const controlsRef = useRef();
  const handleStart = () => { if (controlsRef.current) controlsRef.current.autoRotate = false; };
  const handleEnd   = () => { if (controlsRef.current) controlsRef.current.autoRotate = true; };
  return (
    <Canvas frameloop="always" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={3}
          enableDamping
          dampingFactor={0.08}
          maxPolarAngle={Math.PI * 0.75}
          minPolarAngle={Math.PI * 0.25}
          onStart={handleStart}
          onEnd={handleEnd}
        />
        <Ball iconUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;
