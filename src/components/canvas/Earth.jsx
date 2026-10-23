import {Suspense, useRef} from "react";
  import {Canvas, useFrame} from "@react-three/fiber";
  import {Preload, useGLTF} from "@react-three/drei";
  import CanvasLoader from "../Loader";
  import {useInView} from "../../utils/useInView";
  const GLTF="/models/planet/scene.gltf";
  const Earth=()=>{
    const ref=useRef();
    const e=useGLTF(GLTF);
    useFrame((_,delta)=>{ if(ref.current) ref.current.rotation.y+=delta*0.15; });
    return <primitive ref={ref} object={e.scene} scale={2.5} position-y={0} rotation-y={0}/>;
  };
  // No OrbitControls here: it unconditionally sets the canvas's touch-action to
  // "none" on connect, which blocks native page scroll over the globe on mobile.
  // Rotation is driven manually via useFrame instead, so the canvas never gets
  // any pointer/touch listeners attached and scrolling passes through untouched.
  const EarthCanvas=()=>{
    const [ref,inView]=useInView();
    return (
      <div ref={ref} style={{width:"100%",height:"100%"}}>
        <Canvas shadows frameloop={inView?"always":"never"} dpr={[1,2]} gl={{preserveDrawingBuffer:true}} camera={{fov:45,near:0.1,far:200,position:[-4,3,6]}} style={{touchAction:"pan-y"}}>
          <Suspense fallback={<CanvasLoader/>}>
            <Earth/>
            <Preload all/>
          </Suspense>
        </Canvas>
      </div>
    );
  };
  export default EarthCanvas;
