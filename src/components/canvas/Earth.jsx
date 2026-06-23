import {Suspense, useEffect, useRef} from "react";
  import {Canvas} from "@react-three/fiber";
  import {OrbitControls,Preload,useGLTF} from "@react-three/drei";
  import CanvasLoader from "../Loader";
  const GLTF="https://raw.githubusercontent.com/lohitkolluri/Portfolio-Website/main/public/planet/scene.gltf";
  const Earth=()=>{const e=useGLTF(GLTF);return <primitive object={e.scene} scale={2.5} position-y={0} rotation-y={0}/>;};
  const EarthCanvas=()=>{
    const controlsRef=useRef();
    useEffect(()=>{
      // OrbitControls forces touchAction:"none" on its dom element, which blocks
      // page scroll over the canvas on mobile. Rotation is auto-driven, so user
      // touch-rotate isn't needed — restore vertical scroll-through instead.
      const dom=controlsRef.current?.domElement;
      if(dom) dom.style.touchAction="pan-y";
    },[]);
    return (
      <Canvas shadows frameloop="demand" dpr={[1,2]} gl={{preserveDrawingBuffer:true}} camera={{fov:45,near:0.1,far:200,position:[-4,3,6]}}>
        <Suspense fallback={<CanvasLoader/>}>
          <OrbitControls ref={controlsRef} autoRotate enableZoom={false} enableRotate={false} enablePan={false} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2}/>
          <Earth/>
          <Preload all/>
        </Suspense>
      </Canvas>
    );
  };
  export default EarthCanvas;
