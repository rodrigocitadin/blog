'use client';

import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "three/addons/geometries/ParametricGeometries.js";

export default function TorusKnot() {
  function Mobius(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(() => {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.005;
    });

    const geometry = new ParametricGeometry(
      ParametricGeometries.mobius,
      5,
      100
    );

    const material = new THREE.MeshStandardMaterial({
      wireframe: true,
      color: 'black',
      emissive: 'white',
      roughness: 1,
      metalness: 0.5
    })

    return (
      <mesh
        {...props}
        ref={ref}
        scale={1}
        geometry={geometry}
        material={material}
      />
    )
  }

  // function Torus(props: ThreeElements['mesh']) {
  //   const ref = useRef<THREE.Mesh>(null!);
  //   useFrame(() => {
  //     ref.current.rotation.x += 0.005;
  //     ref.current.rotation.y += 0.005;
  //   });

  //   return (
  //     <mesh
  //       {...props}
  //       ref={ref}
  //       scale={0.02}
  //     >
  //       <torusKnotGeometry args={[70, 30, 80, 10]} />
  //       <meshStandardMaterial
  //         wireframe
  //         color='black'
  //         emissive='white'
  //         roughness={1}
  //         metalness={0.5}
  //       />
  //     </mesh>
  //   )
  // }

  return (
    <div className="mt-10 h-[600px]">
      <Canvas className="top-0 left-0 w-full h-full">
        <Mobius position={[0, 0, 0]} />
      </Canvas>
    </div>
  )
}
