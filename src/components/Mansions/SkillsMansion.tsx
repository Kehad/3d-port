import React from 'react';
import { Text } from '@react-three/drei';
import { MansionWaypoint } from '../../types/testsprite';

interface SkillsMansionProps {
  waypoint: MansionWaypoint;
}

export const SkillsMansion: React.FC<SkillsMansionProps> = ({ waypoint }) => {
  const [x, y, z] = waypoint.coordinates;
  const buildingPos = waypoint.buildingCoordinates || [x - 8, y, z];

  return (
    <group position={buildingPos}>
      {/* Industrial Foundation Slab */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[26, 0.8, 22]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Main Workshop Building Body */}
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 9.5, 18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Exposed Steel Roof Trusses & Sawtooth Roof */}
      <group position={[0, 11.2, 0]}>
        {[-6, 0, 6].map((rz, i) => (
          <mesh key={i} position={[0, 1.2, rz]} rotation={[0, 0, 0.2]} castShadow>
            <boxGeometry args={[22.5, 2.2, 5.2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}
        {/* Glass Skylight Strips */}
        {[-6, 0, 6].map((rz, i) => (
          <mesh key={`sky-${i}`} position={[0, 2.4, rz + 1.2]}>
            <boxGeometry args={[20, 0.1, 1.4]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>

      {/* Workshop Loading Bay / Roll-Up Entrance Door (Facing Road) */}
      <group position={[11.2, 0, 0]}>
        {/* Portal Frame */}
        <mesh position={[0, 4.0, 0]}>
          <boxGeometry args={[0.5, 7.2, 7.8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Roll-up Steel Slats Door */}
        <mesh position={[-0.1, 3.6, 0]}>
          <boxGeometry args={[0.2, 6.4, 6.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Caution Yellow/Black Striping */}
        <mesh position={[0.26, 0.2, 0]}>
          <boxGeometry args={[0.1, 0.35, 7.2]} />
          <meshStandardMaterial color="#eab308" emissive="#ca8a04" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Cyber Antenna Tower & Transformer */}
      <group position={[8, 11, -7]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.2, 8, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 4.2, 0]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} />
        </mesh>
      </group>

      {/* 3D Illuminated Lab Signboard */}
      <group position={[11.4, 8.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.2, 1.4, 9.5]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <Text
          position={[0.15, 0.1, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.52}
          color="#c084fc"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          SKILLS LAB // WORKSHOP
        </Text>
      </group>

      {/* Purple Lab Accent Spotlights */}
      <spotLight
        position={[11.5, 7.5, 0]}
        target-position={[15, 0, 0]}
        color="#a855f7"
        intensity={14}
        distance={20}
        angle={0.6}
      />
    </group>
  );
};

