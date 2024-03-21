'use client';

import Link from "next/link";
import ListIcon from "./icons/ListIcon";
import * as THREE from 'three';
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from 'react';

export default function Home() {
  function Torus(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((_, delta) => {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta;
    });

    return (
      <mesh
        {...props}
        ref={ref}
        scale={0.02}
      >
        <torusKnotGeometry args={[70, 30, 80, 10]} />
        <meshPhysicalMaterial 
          color={0x194c7f} 
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
    )
  }

  return (
    <main className="w-[90%] m-auto">
      <nav className="flex justify-between">
        <Link href="/">c.dev</Link>
        <ListIcon />
      </nav>

      {/* mobius strip here */}
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Torus position={[0, 0, 0]} />
      </Canvas>

      {/* my pic and texts here */}
    </main>
  );
}
