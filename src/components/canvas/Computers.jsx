import React, { Suspense, useEffect, useState } from "react";
  import { Canvas } from "@react-three/fiber";
  import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
  import CanvasLoader from "../Loader";
  const GLTF="https://raw.githubusercontent.com/lohitkolluri/Portfolio-Website/main/public/desktop_pc/scene.gltf";
  const Computer=({isMobile})=>{
    const {scene}=useGLTF(GLTF);
    return(<mesh><hemisphereLight intensity={0.15} groundColor="black"/><spotLight position={[-20,50,10]} angle={0.12} penumbra={1} intensity={1} castShadow shadow-mapSize={1024}/><pointLight intensity={1}/><primitive object={scene} scale={isMobile?0.7:0.75} position={isMobile?[0,-3,-2.2]:[0,-3.25,-1.5]} rotation={[-0.01,-0.2,-0.1]}/></mesh>);
  };
  const Memo=React.memo(Computer);
  const ComputersCanvas=()=>{
    const [isMobile,setIsMobile]=useState(false);
    useEffect(()=>{const mq=window.matchMedia("(max-width:500px)");setIsMobile(mq.matches);const h=e=>setIsMobile(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);
    return(<Canvas frameloop="demand" shadows dpr={[1,2]} camera={{position:[20,3,5],fov:25}} gl={{preserveDrawingBuffer:true}}><Suspense fallback={<CanvasLoader/>}><OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2}/><Memo isMobile={isMobile}/></Suspense><Preload all/></Canvas>);
  };
  export default ComputersCanvas;