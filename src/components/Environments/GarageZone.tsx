import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GarageZoneProps {
  progress: number; // 0 to 1
}

export const GarageZone: React.FC<GarageZoneProps> = ({ progress }) => {
  const shutterRef = useRef<THREE.Group>(null);
  const neonLightRef = useRef<THREE.PointLight>(null);

  // Shutter door raises between progress 0.03 and 0.14
  useFrame((state) => {
    if (shutterRef.current) {
      const openProgress = THREE.MathUtils.clamp((progress - 0.02) / 0.12, 0, 1);
      // Raise shutter up from 2.5 to 8.5
      shutterRef.current.position.y = THREE.MathUtils.lerp(2.5, 9.0, openProgress);
    }

    if (neonLightRef.current) {
      // Subtle industrial neon tube flicker
      const t = state.clock.elapsedTime;
      const flicker = 1 + Math.sin(t * 30) * 0.08 + (Math.random() > 0.98 ? -0.4 : 0);
      neonLightRef.current.intensity = flicker * 3;
    }
  });

  return (
    <group position={[0, 0, -200]}>
      {/* Garage Concrete Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[24, 0.2, 75]} />
        <meshStandardMaterial
          color="#0b0e14"
          roughness={0.65}
          metalness={0.3}
        />
      </mesh>

      {/* Yellow/Black Caution Floor Borders */}
      <mesh position={[-6.2, 0.06, 0]}>
        <planeGeometry args={[0.5, 70]} />
        <meshStandardMaterial
          color="#eab308"
          emissive="#ca8a04"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[6.2, 0.06, 0]}>
        <planeGeometry args={[0.5, 70]} />
        <meshStandardMaterial
          color="#eab308"
          emissive="#ca8a04"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Cyberpunk Floor Guide Neon Strips */}
      <mesh position={[-2.8, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 65]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[2.8, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 65]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Side Industrial Walls */}
      {/* Left Wall */}
      <mesh position={[-11.5, 4.5, 0]} receiveShadow>
        <boxGeometry args={[1, 9, 74]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[11.5, 4.5, 0]} receiveShadow>
        <boxGeometry args={[1, 9, 74]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 4.5, -36.5]}>
        <boxGeometry args={[23, 9, 1]} />
        <meshStandardMaterial color="#090d16" roughness={0.8} />
      </mesh>

      {/* Steel Overhead Trusses */}
      {[-25, -10, 5, 20].map((z, i) => (
        <group key={i} position={[0, 8.5, z]}>
          <mesh castShadow>
            <boxGeometry args={[23, 0.4, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Hanging Industrial Fluorescent Fixture */}
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[6, 0.12, 0.3]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0, -0.68, 0]}>
            <boxGeometry args={[5.8, 0.04, 0.2]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Animated Garage Shutter Door (at Z = +37 from garage center, which is Z = -163 in world) */}
      <group position={[0, 0, 36.5]} ref={shutterRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[18, 7.5, 0.35]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        {/* Shutter Horizontal Slats */}
        {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.19]}>
            <boxGeometry args={[17.6, 0.08, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        ))}
        {/* Neon Warning Status Light atop shutter */}
        <mesh position={[0, 4.0, 0.2]}>
          <boxGeometry args={[3.5, 0.25, 0.1]} />
          <meshStandardMaterial
            color={progress > 0.05 ? '#10b981' : '#ef4444'}
            emissive={progress > 0.05 ? '#10b981' : '#ef4444'}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Shutter Portal Frame */}
      <group position={[0, 4.5, 36.5]}>
        <mesh position={[-9.5, 0, 0]}>
          <boxGeometry args={[2, 9, 0.8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[9.5, 0, 0]}>
          <boxGeometry args={[2, 9, 0.8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 4.3, 0]}>
          <boxGeometry args={[21, 0.8, 0.8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Interior Mood Spotlights */}
      <pointLight
        ref={neonLightRef}
        position={[0, 6.5, -15]}
        color="#38bdf8"
        intensity={3}
        distance={25}
      />
      <pointLight
        position={[-6, 3, 10]}
        color="#a855f7"
        intensity={1.8}
        distance={18}
      />
      <pointLight
        position={[6, 3, 10]}
        color="#38bdf8"
        intensity={1.8}
        distance={18}
      />
    </group>
  );
};

