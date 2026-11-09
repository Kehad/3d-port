import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { TravelMode } from '../../types/portfolio';

interface HeroStartingZone3DProps {
  currentMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  progress: number;
}

export const HeroStartingZone3D: React.FC<HeroStartingZone3DProps> = ({
  currentMode,
  onSelectMode,
  progress,
}) => {
  const gantryRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.z = t * 0.8;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.8;
  });

  return (
    <group position={[0, 0, -225]}>
      {/* Starting Plaza Pavement / Concrete Overlook Platform */}
      <mesh position={[0, -0.04, 0]} receiveShadow>
        <boxGeometry args={[18, 0.16, 50]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Asphalt Driveway Surface */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[12, 0.05, 48]} />
        <meshStandardMaterial color="#262a33" roughness={0.7} />
      </mesh>

      {/* Concrete Curbs Left and Right */}
      <mesh position={[-6.2, 0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 0.22, 48]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>
      <mesh position={[6.2, 0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, 0.22, 48]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* 3D Painted Road Lanes & Markings */}
      {/* Walk Lane (Left: X = -3.2) */}
      <group position={[-3.2, 0.08, -6]} onClick={() => onSelectMode('walk')}>
        {/* Painted Bay Rectangle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 6]} />
          <meshBasicMaterial
            color={currentMode === 'walk' ? '#10b981' : '#475569'}
            transparent
            opacity={currentMode === 'walk' ? 0.35 : 0.15}
          />
        </mesh>
        {/* Painted Border */}
        <mesh ref={ring1Ref} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 24]} />
          <meshBasicMaterial
            color={currentMode === 'walk' ? '#10b981' : '#94a3b8'}
          />
        </mesh>
        {/* 3D Text Label in 3D scene (NOT DOM) */}
        <Text
          position={[0, 0.05, 3.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.42}
          color={currentMode === 'walk' ? '#10b981' : '#cbd5e1'}
          anchorX="center"
          anchorY="middle"
        >
          [ 1. WALK ]
        </Text>
        <Text
          position={[0, 0.05, 4.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.24}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          PEDESTRIAN STROLL
        </Text>
      </group>

      {/* Car Lane (Center: X = 0) */}
      <group position={[0, 0.08, -6]} onClick={() => onSelectMode('car')}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.6, 7]} />
          <meshBasicMaterial
            color={currentMode === 'car' ? '#0284c7' : '#475569'}
            transparent
            opacity={currentMode === 'car' ? 0.35 : 0.15}
          />
        </mesh>
        <mesh ref={ring2Ref} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.8, 24]} />
          <meshBasicMaterial
            color={currentMode === 'car' ? '#0284c7' : '#94a3b8'}
          />
        </mesh>
        <Text
          position={[0, 0.05, 3.8]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.45}
          color={currentMode === 'car' ? '#38bdf8' : '#cbd5e1'}
          anchorX="center"
          anchorY="middle"
        >
          [ 2. DRIVE CAR ]
        </Text>
        <Text
          position={[0, 0.05, 4.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.24}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          SPORT ROADSTER
        </Text>
      </group>

      {/* Motorcycle Lane (Right: X = +3.2) */}
      <group position={[3.2, 0.08, -6]} onClick={() => onSelectMode('motorcycle')}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 6]} />
          <meshBasicMaterial
            color={currentMode === 'motorcycle' ? '#9333ea' : '#475569'}
            transparent
            opacity={currentMode === 'motorcycle' ? 0.35 : 0.15}
          />
        </mesh>
        <mesh ref={ring3Ref} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.6, 24]} />
          <meshBasicMaterial
            color={currentMode === 'motorcycle' ? '#a855f7' : '#94a3b8'}
          />
        </mesh>
        <Text
          position={[0, 0.05, 3.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.42}
          color={currentMode === 'motorcycle' ? '#c084fc' : '#cbd5e1'}
          anchorX="center"
          anchorY="middle"
        >
          [ 3. MOTORCYCLE ]
        </Text>
        <Text
          position={[0, 0.05, 4.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.24}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          HIGH-SPEED SUPERBIKE
        </Text>
      </group>

      {/* 3D Directional Road Markings Painted on Ground */}
      <group position={[0, 0.08, 12]}>
        <Text
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.55}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
        >
          ▲ DRIVE FORWARD [ARROW UP] ▲
        </Text>
        <Text
          position={[0, 0, 2.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.32}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          ◄ STEER LEFT [ARROW LEFT]   |   STEER RIGHT [ARROW RIGHT] ►
        </Text>
        <Text
          position={[0, 0, 3.6]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.28}
          color="#f87171"
          anchorX="center"
          anchorY="middle"
        >
          ▼ BRAKE / REVERSE [ARROW DOWN] ▼
        </Text>
      </group>

      {/* MASSIVE 3D OVERHEAD HIGHWAY GANTRY SIGN (Realistic Daytime Highway Sign) */}
      <group position={[0, 0, 2]} ref={gantryRef}>
        {/* Left Truss Support Pillar */}
        <mesh position={[-6.8, 4.2, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 8.4, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Right Truss Support Pillar */}
        <mesh position={[6.8, 4.2, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.28, 8.4, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Overhead Crossbeam Truss */}
        <mesh position={[0, 8.2, 0]} castShadow>
          <boxGeometry args={[14.2, 0.5, 0.6]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Realistic Highway Overhead Sign Board (Green Highway Guide Sign) */}
        <mesh position={[0, 6.8, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[11.5, 2.8, 0.18]} />
          <meshStandardMaterial color="#065f46" roughness={0.4} />
        </mesh>
        {/* White Border Frame on Sign */}
        <mesh position={[0, 6.8, 0.5]}>
          <boxGeometry args={[11.3, 2.6, 0.02]} />
          <meshStandardMaterial color="#047857" roughness={0.4} />
        </mesh>

        {/* 3D 3D-RENDERED TEXT ON THE HIGHWAY SIGN (Zero DOM) */}
        <Text
          position={[0, 7.6, 0.52]}
          fontSize={0.52}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ALEX CHEN // PORTFOLIO HIGHWAY
        </Text>

        <Text
          position={[0, 6.85, 0.52]}
          fontSize={0.32}
          color="#facc15"
          anchorX="center"
          anchorY="middle"
        >
          USE ARROW KEYS [▲ ▼ ◄ ►] TO DRIVE
        </Text>

        <Text
          position={[0, 6.2, 0.52]}
          fontSize={0.24}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          CURRENT MODE: {currentMode.toUpperCase()} • CLICK BAY TO SWITCH
        </Text>

        {/* Realistic Overhead Lighting Lamps */}
        {[-3.5, 0, 3.5].map((x, i) => (
          <group key={i} position={[x, 8.5, 0.8]}>
            <mesh>
              <boxGeometry args={[0.8, 0.15, 0.35]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.7, 0.04, 0.25]} />
              <meshStandardMaterial color="#fffbeb" />
            </mesh>
            <spotLight
              position={[0, -0.1, 0]}
              target-position={[0, -2, 0]}
              color="#fffbeb"
              intensity={4}
              distance={8}
              angle={0.6}
            />
          </group>
        ))}
      </group>

      {/* Floating 3D Mode Selector Indicator (Pops up over selected lane) */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group
          position={[
            currentMode === 'walk' ? -3.2 : currentMode === 'car' ? 0 : 3.2,
            3.6,
            -6,
          ]}
        >
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.4, 0.8, 4]} />
            <meshStandardMaterial
              color={
                currentMode === 'walk'
                  ? '#10b981'
                  : currentMode === 'car'
                  ? '#38bdf8'
                  : '#a855f7'
              }
            />
          </mesh>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            ACTIVE VEHICLE
          </Text>
        </group>
      </Float>
    </group>
  );
};
