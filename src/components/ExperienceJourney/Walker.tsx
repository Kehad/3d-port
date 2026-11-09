import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WalkerProps {
  position: THREE.Vector3;
  rotationY: number;
  speed: number;
  steeringAngle?: number;
}

export const Walker: React.FC<WalkerProps> = ({
  position,
  rotationY,
  speed,
  steeringAngle = 0,
}) => {
  const walkerGroupRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const visorLightRef = useRef<THREE.SpotLight>(null);

  const walkCycle = useRef(0);

  useFrame((state, delta) => {
    if (!walkerGroupRef.current) return;

    walkerGroupRef.current.position.copy(position);
    walkerGroupRef.current.rotation.y = rotationY;

    const isMoving = Math.abs(speed) > 0.0001;
    const walkSpeed = Math.abs(speed) * 90;

    if (isMoving) {
      walkCycle.current += delta * Math.max(walkSpeed, 4.5);
    } else {
      // Return gently to neutral stance
      walkCycle.current = THREE.MathUtils.lerp(walkCycle.current, 0, 0.1);
    }

    const cycle = walkCycle.current;
    const swingAmp = isMoving ? 0.65 : 0;

    // Legs alternate swing
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = Math.sin(cycle) * swingAmp;
      rightLegRef.current.rotation.x = -Math.sin(cycle) * swingAmp;
    }

    // Arms alternate in opposite phase to legs
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = -Math.sin(cycle) * swingAmp * 0.8;
      rightArmRef.current.rotation.x = Math.sin(cycle) * swingAmp * 0.8;
    }

    // Torso vertical bounce & subtle sway
    if (torsoRef.current) {
      const bob = isMoving ? Math.abs(Math.sin(cycle)) * 0.06 : Math.sin(state.clock.elapsedTime * 3) * 0.015;
      torsoRef.current.position.y = 0.95 + bob;
      torsoRef.current.rotation.y = isMoving ? Math.sin(cycle) * 0.08 : 0;
      torsoRef.current.rotation.z = -steeringAngle * 0.4;
    }

    if (visorLightRef.current) {
      visorLightRef.current.intensity = isMoving ? 14 : 8;
    }
  });

  return (
    <group ref={walkerGroupRef}>
      {/* Torso & Upper Body */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* Chest / Cyber Jacket */}
        <mesh castShadow position={[0, 0.35, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Cyber Neon Vest Stripes */}
        <mesh position={[0, 0.35, 0.17]}>
          <boxGeometry args={[0.35, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.5}
            toneMapped={false}
          />
        </mesh>

        {/* Cyber Tech Backpack / Power Cell */}
        <mesh position={[0, 0.38, -0.22]} castShadow>
          <boxGeometry args={[0.38, 0.48, 0.16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Backpack Power Core Indicator */}
        <mesh position={[0, 0.38, -0.31]}>
          <boxGeometry args={[0.15, 0.15, 0.04]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={3}
          />
        </mesh>

        {/* Head & Helmet */}
        <group position={[0, 0.82, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.32, 0.32]} />
            <meshStandardMaterial color="#090d16" roughness={0.5} />
          </mesh>
          {/* Glowing Cyber Visor */}
          <mesh position={[0, 0.02, 0.17]}>
            <boxGeometry args={[0.28, 0.1, 0.03]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
          {/* Headlamp Spotlight projecting light ahead */}
          <spotLight
            ref={visorLightRef}
            position={[0, 0.02, 0.2]}
            target-position={[0, -1.2, 12]}
            color="#38bdf8"
            intensity={10}
            distance={25}
            angle={0.5}
            penumbra={0.6}
          />
        </group>

        {/* Left Arm Assembly */}
        <group ref={leftArmRef} position={[-0.38, 0.6, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.15, 0.58, 0.16]} />
            <meshStandardMaterial color="#0369a1" metalness={0.7} />
          </mesh>
          {/* Cyber Gauntlet */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.16, 0.18, 0.17]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1}
            />
          </mesh>
        </group>

        {/* Right Arm Assembly */}
        <group ref={rightArmRef} position={[0.38, 0.6, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.15, 0.58, 0.16]} />
            <meshStandardMaterial color="#0369a1" metalness={0.7} />
          </mesh>
          {/* Cyber Gauntlet */}
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.16, 0.18, 0.17]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      </group>

      {/* Left Leg (Pivoting at hip) */}
      <group ref={leftLegRef} position={[-0.16, 0.88, 0]}>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.18, 0.72, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Left Cyber Boot */}
        <mesh position={[0, -0.76, 0.06]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>

      {/* Right Leg (Pivoting at hip) */}
      <group ref={rightLegRef} position={[0.16, 0.88, 0]}>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.18, 0.72, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Right Cyber Boot */}
        <mesh position={[0, -0.76, 0.06]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.32]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

