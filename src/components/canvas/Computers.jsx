import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import CanvasLoader from "../Loader";
import SolderStation from "./SolderStation";

const DESKTOP_GLTF = "/models/desktop_pc/scene.gltf";
const MOBILE_GLB = "/models/pc-mobile.glb";

const SCREEN_MATERIAL = "Material.074_30";
const SCREEN_NOCURSOR = "/models/screen-nocursor.webp";
const BLINK_SECONDS = 0.53;
const GLOW_INTENSITY = 0.9;

// Shared with the fan shaders below; advanced every frame.
const hueUniform = { value: 0 };

// Rotates the hue of a masked emissive map (the RGB fans and speaker rings) so the rainbow flows.
const addHueShift = (material) => {
  if (material.userData.hueShift) return;
  material.userData.hueShift = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHue = hueUniform;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        `uniform float uHue;
vec3 hueRot(vec3 c, float a) {
  const vec3 k = vec3(0.57735);
  float ca = cos(a), sa = sin(a);
  return c * ca + cross(k, c) * sa + k * dot(k, c) * (1.0 - ca);
}
void main() {`
      )
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  totalEmissiveRadiance = hueRot(totalEmissiveRadiance, uHue);");
  };
  material.customProgramCacheKey = () => "hueShift";
  material.needsUpdate = true;
};

const Computer = ({ url, isMobile }) => {
  const { scene } = useGLTF(url);
  const group = useRef();
  const spot = useRef();
  const { invalidate, gl } = useThree();
  const visible = useRef(true);
  const reduceMotion = useRef(false);
  const glow = useRef(null);
  const blink = useRef({ mat: null, on: null, off: null, state: true });

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const max = gl.capabilities.getMaxAnisotropy();
    let screen = null;
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const m = o.material;
      if (m.name === SCREEN_MATERIAL) {
        screen = o;
        // The screen is a dense 1920x1080 texture seen small and slightly off-axis; max anisotropy keeps it sharp instead of mushy.
        [m.map, m.emissiveMap].forEach((t) => {
          if (!t) return;
          t.anisotropy = max;
          t.needsUpdate = true;
        });
      } else if (m.emissiveMap && m.alphaTest > 0 && !reduceMotion.current) {
        addHueShift(m);
      }
    });
    if (!screen || reduceMotion.current) return;

    // Cursor blink: swap in a second frame of the screen with the cursor hidden.
    const on = screen.material.map;
    new THREE.TextureLoader().load(SCREEN_NOCURSOR, (off) => {
      off.flipY = false;
      off.colorSpace = THREE.SRGBColorSpace;
      off.anisotropy = max;
      blink.current = { mat: screen.material, on, off, state: true };
    });

    // Screen glow: a soft light just in front of the monitor, so the screen lights the desk like a real one.
    const g = group.current;
    scene.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(screen);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const towardCamera = new THREE.Vector3(20, 3, 5).sub(center).normalize();
    const light = new THREE.PointLight("#a98bff", GLOW_INTENSITY, size.length() * 6, 2);
    light.position.copy(g.worldToLocal(center.clone().addScaledVector(towardCamera, size.length() * 0.35)));
    g.add(light);
    glow.current = light;
    return () => {
      g.remove(light);
      light.dispose?.();
      glow.current = null;
    };
  }, [scene, gl]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) invalidate();
    });
    io.observe(gl.domElement);
    return () => io.disconnect();
  }, [gl, invalidate]);

  // The canvas is demand-driven, so every moving thing needs invalidate() each frame, and only while the hero is on screen.
  // Mobile has no OrbitControls, so a slow sway also keeps the scene alive.
  useFrame(({ clock }) => {
    if (reduceMotion.current) return;
    const t = clock.elapsedTime;
    hueUniform.value = t * 0.8;
    if (glow.current) glow.current.intensity = GLOW_INTENSITY * (1 + 0.1 * Math.sin(t * 1.7));
    if (spot.current) spot.current.position.x = -20 + Math.sin(t * 0.3) * 6;
    const b = blink.current;
    if (b.mat && b.off) {
      const on = Math.floor(t / BLINK_SECONDS) % 2 === 0;
      if (on !== b.state) {
        b.state = on;
        b.mat.map = b.mat.emissiveMap = on ? b.on : b.off;
      }
    }
    if (isMobile && group.current) group.current.rotation.y = Math.sin(t * 0.5) * 0.08;
    if (visible.current) invalidate();
  });

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight ref={spot} position={[-20, 50, 10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <pointLight intensity={1} />
      <group ref={group} position={isMobile ? [-0.15, 0, 0.55] : [0, 0, 0]}>
        <primitive object={scene} scale={0.75} position={[0, -3.25, -1.5]} rotation={[-0.01, -0.2, -0.1]}>
          <SolderStation />
        </primitive>
      </group>
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
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: isMobile ? 52 : 25 }}
      gl={{ preserveDrawingBuffer: true }}
      style={{ touchAction: isMobile ? "pan-y" : undefined }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {!isMobile && <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />}
        <Memo url={isMobile ? MOBILE_GLB : DESKTOP_GLTF} isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
