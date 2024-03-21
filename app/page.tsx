'use client';

import Link from "next/link";
import ListIcon from "./icons/ListIcon";
import * as THREE from 'three';
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from 'react';

export default function Home() {
  function Torus(props: ThreeElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(() => {
      ref.current.rotation.x += 0.005;
      ref.current.rotation.y += 0.005;
    });

    return (
      <mesh
        {...props}
        ref={ref}
        scale={0.03}
      >
        <torusKnotGeometry args={[70, 30, 80, 10]} />
        <meshStandardMaterial
          wireframe
          color='black'
          emissive='white'
          roughness={1}
          metalness={0.5}
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
        <Torus position={[0, 0, 0]} />
      </Canvas>

      {/* my pic and texts here */}
    </main>
  );
}
