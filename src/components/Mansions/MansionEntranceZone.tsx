import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { MansionWaypoint } from '../../types/testsprite';

interface MansionEntranceZoneProps {
  waypoint: MansionWaypoint;
  playerPos: THREE.Vector3;
  progress?: number;
  onEnter: () => void;
}

export const MansionEntranceZone: React.FC<MansionEntranceZoneProps> = ({
  waypoint,
  playerPos,
  progress,
  onEnter,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef<THREE.Group>(null);

  const entrancePos = new THREE.Vector3(...waypoint.coordinates);

  // Check distance to player and road progress
  const dist = playerPos.distanceTo(entrancePos);
  const isNearProgress = progress !== undefined ? Math.abs(progress - waypoint.progress) < 0.045 : false;
  const isNearby = dist < 22.0 || isNearProgress;
  const isInTriggerRange = dist < 14.0 || isNearProgress;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
      const s = isInTriggerRange ? 1.0 + Math.sin(t * 6) * 0.1 : 0.95;
      ringRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={entrancePos}>
      {/* Ground Holographic Waypoint Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
      >
        <ringGeometry args={[2.0, 2.3, 32]} />
        <meshBasicMaterial
          color={waypoint.themeColor}
          transparent
          opacity={isNearby ? 0.8 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Action Prompt when player approaches */}
      {isNearby && (
        <Float speed={2.5} rotationIntensity={0.1} floatIntensity={0.3} position={[0, 3.2, 0]}>
          <group ref={portalRef} onClick={onEnter}>
            {/* Background pill panel */}
            <mesh position={[0, 0, -0.05]}>
              <boxGeometry args={[4.2, 1.1, 0.1]} />
              <meshStandardMaterial
                color="#0f172a"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[4.1, 1.0, 0.04]} />
              <meshBasicMaterial
                color={waypoint.themeColor}
                transparent
                opacity={0.25}
              />
            </mesh>

            {/* 3D Text Prompt */}
            <Text
              position={[0, 0.22, 0.05]}
              fontSize={0.34}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {`ENTER ${waypoint.name.toUpperCase()}`}
            </Text>
            <Text
              position={[0, -0.18, 0.05]}
              fontSize={0.22}
              color={waypoint.themeColor}
              anchorX="center"
              anchorY="middle"
            >
              [ PRESS 'E' / TAP TO ENTER ]
            </Text>
          </group>
        </Float>
      )}

      {/* Floating Luminous Wayfinding Beacon (PRD §4.2) */}
      <mesh position={[0, 18, 0]}>
        <cylinderGeometry args={[0.35, 1.6, 36, 16, 1, true]} />
        <meshBasicMaterial
          color={waypoint.themeColor}
          transparent
          opacity={isNearby ? 0.6 : 0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating Diamond Waypoint Beacon */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.4} position={[0, 36, 0]}>
        <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color={waypoint.themeColor} wireframe />
        </mesh>
      </Float>

      {/* Entrance Spotlight */}
      <spotLight
        position={[0, 8, 2]}
        target-position={[0, 0, 0]}
        color={waypoint.themeColor}
        intensity={isInTriggerRange ? 16 : 6}
        distance={22}
        angle={0.65}
      />
    </group>
  );
};

