import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Decal, Float, Preload } from "@react-three/drei";
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
      canvas.getContext("2d").drawImage(img, 0, 0, 256, 256);
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

const DraggableBall = ({ iconUrl }) => {
  const meshRef = useRef();
  const texture = useRasterTexture(iconUrl);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, velX: 0, velY: 0 });
  const rot = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!meshRef.current) return;
    const d = drag.current;
    const r = rot.current;

    if (!d.active) {
      // friction + spring back to 0
      d.velX *= 0.85;
      d.velY *= 0.85;
      r.x += d.velX;
      r.y += d.velY;
      r.x += (0 - r.x) * 0.06;
      r.y += (0 - r.y) * 0.06;
    }

    meshRef.current.rotation.x = r.x;
    meshRef.current.rotation.y = r.y;
  });

  const onDown = (e) => {
    e.stopPropagation();
    drag.current.active = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.velX = 0;
    drag.current.velY = 0;
  };
  const onMove = (e) => {
    if (!drag.current.active) return;
    const dx = (e.clientX - drag.current.lastX) * 0.013;
    const dy = (e.clientY - drag.current.lastY) * 0.013;
    drag.current.velY = dx;
    drag.current.velX = dy;
    rot.current.y += dx;
    rot.current.x += dy;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
  };
  const onUp = () => { drag.current.active = false; };

  return (
    <Float speed={1.75} rotationIntensity={0} floatIntensity={1.5}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        scale={2.75}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#fff8eb"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        {texture && (
          <Decal
            position={[0, 0, 1]}
            rotation={[2 * Math.PI, 0, 6.25]}
            scale={1}
            map={texture}
            flatShading
          />
        )}
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => (
  <Canvas
    frameloop="always"
    dpr={[1, 2]}
    gl={{ preserveDrawingBuffer: true }}
    camera={{ position: [20, 3, 5], fov: 25 }}
    style={{ touchAction: "none" }}
  >
    <Suspense fallback={<CanvasLoader />}>
      <DraggableBall iconUrl={icon} />
    </Suspense>
    <Preload all />
  </Canvas>
);

export default BallCanvas;
