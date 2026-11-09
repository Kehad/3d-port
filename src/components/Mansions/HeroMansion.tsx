import React from 'react';
import { Text } from '@react-three/drei';
import { MansionWaypoint } from '../../types/testsprite';

interface HeroMansionProps {
  waypoint: MansionWaypoint;
}

export const HeroMansion: React.FC<HeroMansionProps> = ({ waypoint }) => {
  const [x, y, z] = waypoint.coordinates;
  const buildingPos = waypoint.buildingCoordinates || [x + 8, y, z];

  return (
    <group position={buildingPos}>
      {/* Stone Plaza Foundation */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[26, 0.8, 22]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </mesh>

      {/* Front Entrance Staircase */}
      {[-4, -2, 0].map((stepZ, i) => (
        <mesh key={i} position={[-10 - i * 0.8, 0.3 - i * 0.1, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.25, 8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      ))}

      {/* Main Manor Building Body */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 9.5, 18]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>

      {/* Grand Classical Portico & Columns */}
      <group position={[-11.2, 0, 0]}>
        {/* 4 Classical Columns */}
        {[-3, -1, 1, 3].map((colZ, i) => (
          <mesh key={i} position={[0, 5.2, colZ]} castShadow>
            <cylinderGeometry args={[0.35, 0.4, 9.2, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
          </mesh>
        ))}

        {/* Triangular Pediment atop Columns */}
        <mesh position={[0, 10.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 4.8, 0.8, 3]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>

        {/* Double Entrance Oak Doors */}
        <mesh position={[0.2, 3.2, 0]} castShadow>
          <boxGeometry args={[0.3, 4.6, 2.8]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
        {/* Brass Door Knocker / Handles */}
        <mesh position={[0.02, 3.2, -0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.02, 3.2, 0.3]}>
          <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Manor Hipped Slate Roof */}
      <mesh position={[0, 12.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[16, 5, 4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Twin Brick Chimneys */}
      <mesh position={[-6, 14, 4]} castShadow>
        <boxGeometry args={[1.2, 3.5, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[6, 14, -4]} castShadow>
        <boxGeometry args={[1.2, 3.5, 1.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Manor Windows with Warm Interior Light Glow */}
      {[-6, 0, 6].map((wZ, i) => (
        <group key={i}>
          {/* Floor 1 Windows */}
          <mesh position={[-11.1, 4.5, wZ]}>
            <boxGeometry args={[0.1, 2.2, 1.4]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={1.2}
            />
          </mesh>
          {/* Floor 2 Windows */}
          <mesh position={[-11.1, 7.8, wZ]}>
            <boxGeometry args={[0.1, 1.8, 1.2]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#fef08a"
              emissiveIntensity={1.2}
            />
          </mesh>
        </group>
      ))}

      {/* 3D Manor Name Plaque */}
      <Text
        position={[-11.4, 9.4, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.58}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        HERO MANOR
      </Text>

      {/* Carriage Lanterns flanking door */}
      <pointLight position={[-10.8, 4.0, -2.2]} color="#fbbf24" intensity={4} distance={9} />
      <pointLight position={[-10.8, 4.0, 2.2]} color="#fbbf24" intensity={4} distance={9} />
    </group>
  );
};

