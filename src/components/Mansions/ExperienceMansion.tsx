import React from 'react';
import { Text } from '@react-three/drei';
import { MansionWaypoint } from '../../types/testsprite';

interface ExperienceMansionProps {
  waypoint: MansionWaypoint;
}

export const ExperienceMansion: React.FC<ExperienceMansionProps> = ({ waypoint }) => {
  const [x, y, z] = waypoint.coordinates;
  const buildingPos = waypoint.buildingCoordinates || [x + 8, y, z];

  return (
    <group position={buildingPos}>
      {/* Marble Stepped Foundation */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[28, 0.8, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* Monumental Marble Steps */}
      {[-4, -2, 0].map((stepZ, i) => (
        <mesh key={i} position={[-11 - i * 0.9, 0.35 - i * 0.1, 0]} receiveShadow>
          <boxGeometry args={[1.4, 0.28, 12]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
        </mesh>
      ))}

      {/* Main Museum Body */}
      <mesh position={[0, 6.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[24, 10.5, 20]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* Grand Museum Colonnade (Facing Road) */}
      <group position={[-12.2, 0, 0]}>
        {/* 6 Monumental Marble Columns */}
        {[-5, -3, -1, 1, 3, 5].map((colZ, i) => (
          <mesh key={i} position={[0, 5.6, colZ]} castShadow>
            <cylinderGeometry args={[0.38, 0.44, 10.2, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </mesh>
        ))}

        {/* Frieze & Cornice */}
        <mesh position={[0, 11.0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.9, 13.5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>

        {/* Bronze Double Entrance Doors */}
        <mesh position={[0.2, 3.5, 0]} castShadow>
          <boxGeometry args={[0.3, 5.2, 3.6]} />
          <meshStandardMaterial color="#78350f" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Golden Door Medallions */}
        <mesh position={[0.02, 3.6, -0.6]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.02, 3.6, 0.6]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Copper/Verdigris Classical Roof */}
      <mesh position={[0, 12.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[18, 4.5, 4]} />
        <meshStandardMaterial color="#047857" roughness={0.6} />
      </mesh>

      {/* 3D Archive Name Carved into Frieze */}
      <Text
        position={[-12.4, 11.0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.52}
        color="#047857"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        EXPERIENCE ARCHIVE
      </Text>

      {/* Emerald Lantern Spotlights */}
      <pointLight position={[-11.5, 4.5, -3.2]} color="#10b981" intensity={5} distance={10} />
      <pointLight position={[-11.5, 4.5, 3.2]} color="#10b981" intensity={5} distance={10} />
    </group>
  );
};

