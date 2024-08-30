'use client';

import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from 'three';
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "three/addons/geometries/ParametricGeometries.js";

export default function DefaultGeometry() {
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
        scale={1.5}
        geometry={geometry}
        material={material}
      />
    )
  }

  function Torus(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(() => {
      ref.current.rotation.x += 0.001;
      ref.current.rotation.y += 0.003;
    });

    return (
      <mesh
        {...props}
        ref={ref}
        scale={0.05}
      >
        <torusKnotGeometry args={[500, 50, 200, 50]} />
        <meshStandardMaterial
          wireframe
          color='white'
          emissive='gray'
          roughness={1}
          metalness={0.5}
        />
      </mesh>
    )
  }


  return (
    < Canvas className="top-0 left-0 w-full h-full" >
      {/* <Mobius position={[0, 0, 0]} /> */}
      < Torus position={[0, 0, 0]} />
    </Canvas >
  )
}
