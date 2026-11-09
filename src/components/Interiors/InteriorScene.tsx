import React from 'react';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { MansionId } from '../../types/testsprite';
import { AvatarModel } from '../Characters/AvatarModel';
import { AvatarGender } from '../../types/testsprite';

interface InteriorSceneProps {
  mansionId: MansionId;
  gender: AvatarGender;
  onExit: () => void;
}

export const InteriorScene: React.FC<InteriorSceneProps> = ({
  mansionId,
  gender,
  onExit,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Interior Ambient & Warm Room Lighting */}
      <ambientLight intensity={0.65} color="#f8fafc" />
      <directionalLight position={[10, 15, 8]} intensity={1.4} castShadow color="#fffbeb" />

      {/* Room Floor (Hardwood / Polished Concrete) */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 14]} />
        <meshStandardMaterial
          color={
            mansionId === 'hero'
              ? '#78350f' // Warm mahogany floor
              : mansionId === 'skills'
              ? '#1e293b' // Industrial slate
              : mansionId === 'experience'
              ? '#cbd5e1' // Marble tiles
              : '#090d16' // Dark showroom
          }
          roughness={0.4}
        />
      </mesh>

      {/* Center Persian / Themed Area Rug */}
      <mesh position={[0, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 7]} />
        <meshStandardMaterial
          color={
            mansionId === 'hero'
              ? '#991b1b'
              : mansionId === 'skills'
              ? '#3b82f6'
              : mansionId === 'experience'
              ? '#047857'
              : '#f59e0b'
          }
          roughness={0.8}
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 4.5, -6.8]} receiveShadow>
        <boxGeometry args={[18, 9, 0.4]} />
        <meshStandardMaterial
          color={
            mansionId === 'hero'
              ? '#f1f5f9'
              : mansionId === 'skills'
              ? '#0f172a'
              : mansionId === 'experience'
              ? '#f8fafc'
              : '#020617'
          }
          roughness={0.7}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-8.8, 4.5, 0]} receiveShadow>
        <boxGeometry args={[0.4, 9, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[8.8, 4.5, 0]} receiveShadow>
        <boxGeometry args={[0.4, 9, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* THEMED 3D INTERIOR PROPS PER MANSION */}
      {mansionId === 'hero' && (
        // Study / Living Room: Mahogany Desk, Bookcases, Fireplace Glow
        <group position={[0, 0, -2]}>
          {/* Executive Desk */}
          <mesh position={[-3.2, 0.85, -2]} castShadow>
            <boxGeometry args={[3.2, 0.1, 1.8]} />
            <meshStandardMaterial color="#451a03" roughness={0.4} />
          </mesh>
          <mesh position={[-4.5, 0.42, -2]} castShadow>
            <boxGeometry args={[0.2, 0.8, 1.6]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          <mesh position={[-1.9, 0.42, -2]} castShadow>
            <boxGeometry args={[0.2, 0.8, 1.6]} />
            <meshStandardMaterial color="#451a03" />
          </mesh>
          {/* Desk Lamp */}
          <mesh position={[-4.0, 1.3, -2]}>
            <cylinderGeometry args={[0.15, 0.25, 0.2, 8]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
          <pointLight position={[-4.0, 1.4, -2]} color="#fef08a" intensity={3} distance={5} />

          {/* Bookcases along back wall */}
          <mesh position={[4.0, 3.2, -6.4]} castShadow>
            <boxGeometry args={[5.2, 6.2, 0.8]} />
            <meshStandardMaterial color="#78350f" roughness={0.5} />
          </mesh>
        </group>
      )}

      {mansionId === 'skills' && (
        // Workshop Lab: Toolboards, Server Rack, Tech Hologram
        <group position={[0, 0, -2]}>
          {/* Industrial Workbench */}
          <mesh position={[-3.5, 0.9, -2]} castShadow>
            <boxGeometry args={[3.8, 0.12, 1.8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Server Rack with blinking lights */}
          <mesh position={[4.5, 3.0, -6.2]} castShadow>
            <boxGeometry args={[2.5, 5.8, 1.2]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Floating Tech Cube Hologram */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={[0, 3.0, -2]}>
            <mesh>
              <dodecahedronGeometry args={[0.9, 0]} />
              <meshStandardMaterial color="#a855f7" wireframe emissive="#a855f7" emissiveIntensity={3} />
            </mesh>
          </Float>
        </group>
      )}

      {mansionId === 'experience' && (
        // Trophy Room / Gallery: Marble Pedestals, Golden Statuettes
        <group position={[0, 0, -2]}>
          {[-4, -1.5, 1.5, 4].map((px, i) => (
            <group key={i} position={[px, 0, -3]}>
              <mesh position={[0, 0.75, 0]} castShadow>
                <cylinderGeometry args={[0.45, 0.5, 1.5, 16]} />
                <meshStandardMaterial color="#e2e8f0" />
              </mesh>
              {/* Golden Award / Trophy */}
              <mesh position={[0, 1.8, 0]} castShadow>
                <torusKnotGeometry args={[0.22, 0.08, 32, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
              </mesh>
              <spotLight position={[0, 4, 0]} color="#fef08a" intensity={4} distance={6} angle={0.5} />
            </group>
          ))}
        </group>
      )}

      {mansionId === 'projects' && (
        // Exhibition Room: Hologram Pedestals with Live Rotating Polyhedra
        <group position={[0, 0, -2]}>
          {[-3.5, 0, 3.5].map((px, i) => (
            <group key={i} position={[px, 0, -2]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.7, 0.8, 1.2, 16]} />
                <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
              </mesh>
              <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.4} position={[0, 2.2, 0]}>
                <mesh>
                  {i === 0 && <torusKnotGeometry args={[0.5, 0.15, 64, 16]} />}
                  {i === 1 && <octahedronGeometry args={[0.65, 0]} />}
                  {i === 2 && <icosahedronGeometry args={[0.6, 1]} />}
                  <meshStandardMaterial color="#38bdf8" wireframe emissive="#38bdf8" emissiveIntensity={2.5} />
                </mesh>
              </Float>
            </group>
          ))}
        </group>
      )}

      {/* 3D INTERACTIVE EXIT DOOR (PRD Section 4.4: Walking to door prompts Exit Building) */}
      <group position={[0, 0, 6.2]} onClick={onExit}>
        {/* Door Frame */}
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[3.2, 5.4, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Door Leaf */}
        <mesh position={[0, 2.6, -0.05]}>
          <boxGeometry args={[2.8, 4.8, 0.12]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
        {/* Brass Door Handle */}
        <mesh position={[1.1, 2.6, -0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>

        {/* Illuminated 3D EXIT Sign */}
        <group position={[0, 5.6, -0.2]}>
          <mesh>
            <boxGeometry args={[2.0, 0.6, 0.1]} />
            <meshStandardMaterial color="#065f46" />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.28}
            color="#ecfdf5"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            EXIT TO OVERWORLD
          </Text>
        </group>
      </group>

      {/* Avatar Standing in Interior Room */}
      <group position={[0, 0, 1.2]} rotation={[0, Math.PI, 0]}>
        <AvatarModel gender={gender} pose="standing" />
      </group>
    </group>
  );
};

