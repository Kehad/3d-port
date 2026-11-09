import React from 'react';
import { Text } from '@react-three/drei';
import { MansionWaypoint } from '../../types/testsprite';

interface ProjectMansionProps {
  waypoint: MansionWaypoint;
}

export const ProjectMansion: React.FC<ProjectMansionProps> = ({ waypoint }) => {
  const [x, y, z] = waypoint.coordinates;
  const buildingPos = waypoint.buildingCoordinates || [x - 8, y, z];

  return (
    <group position={buildingPos}>
      {/* Polished Concrete Foundation */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[26, 0.8, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Main Glass Pavilion Body */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 9.5, 18]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.7}
          transmission={0.4}
          thickness={0.5}
        />
      </mesh>

      {/* Modern Cantilevered Roof Canopy */}
      <mesh position={[3, 11.2, 0]} rotation={[0.04, 0, 0.05]} castShadow>
        <boxGeometry args={[26, 0.8, 22]} />
        <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Wood Underside Soffit */}
      <mesh position={[3, 10.7, 0]} rotation={[0.04, 0, 0.05]}>
        <boxGeometry args={[25.8, 0.05, 21.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>

      {/* Minimalist Entrance Portal (Facing Road) */}
      <group position={[11.2, 0, 0]}>
        {/* Entrance Portal Frame */}
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[0.6, 7.2, 6.5]} />
          <meshStandardMaterial color="#020617" roughness={0.3} />
        </mesh>
        {/* Glass Sliding Doors with Amber Neon Frame */}
        <mesh position={[-0.1, 3.5, 0]}>
          <boxGeometry args={[0.1, 6.2, 5.8]} />
          <meshPhysicalMaterial
            color="#0f172a"
            roughness={0.05}
            transmission={0.85}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0.22, 7.2, 0]}>
          <boxGeometry args={[0.08, 0.1, 6.2]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* 3D Modern Signboard */}
      <group position={[11.4, 8.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 9.8]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <Text
          position={[0.15, 0.1, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.5}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          PROJECTS PAVILION
        </Text>
      </group>

      {/* Modern Sculpture / Glowing Geometric Plinth */}
      <mesh position={[10, 2.5, 7]} castShadow>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#f59e0b" wireframe emissive="#f59e0b" emissiveIntensity={2} />
      </mesh>

      {/* Amber Spotlights */}
      <spotLight
        position={[11.5, 8.5, 0]}
        target-position={[16, 0, 0]}
        color="#f59e0b"
        intensity={15}
        distance={22}
        angle={0.65}
      />
    </group>
  );
};

