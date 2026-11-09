import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ExperienceItem } from '../../types/experience';
import { getCurveTransform } from '../../utils/roadCurve';

interface BusStopProps {
  experience: ExperienceItem;
  isActive: boolean;
  onSelect: (exp: ExperienceItem) => void;
  showWorldCard?: boolean;
}

export const BusStop: React.FC<BusStopProps> = ({
  experience,
  isActive,
  onSelect,
  showWorldCard = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Compute transform along spline at experience.progress
  const transform = getCurveTransform(experience.progress);

  // Offset bus stop to the right side of the road
  const rightOffset = 4.2;
  const stopPosition = transform.position
    .clone()
    .addScaledVector(transform.binormal, rightOffset);
  stopPosition.y = transform.position.y;

  // Shelter orientation facing back towards the road
  const shelterRotationY = transform.rotationY + Math.PI / 2;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beaconRef.current) {
      const scale = isActive ? 1 + Math.sin(t * 5) * 0.15 : 1;
      beaconRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      const ringScale = isActive ? 1 + Math.sin(t * 3) * 0.08 : 0.95;
      ringRef.current.scale.set(ringScale, ringScale, 1);
    }
  });

  return (
    <group position={stopPosition} rotation={[0, shelterRotationY, 0]} ref={groupRef}>
      {/* Station Platform / Curb Extension */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[4.8, 0.18, 2.6]} />
        <meshStandardMaterial color="#1e2230" roughness={0.8} />
      </mesh>

      {/* Tactile Platform Edge / Warning Line */}
      <mesh position={[0, 0.18, 1.2]}>
        <boxGeometry args={[4.8, 0.02, 0.16]} />
        <meshStandardMaterial
          color={experience.accentColor}
          emissive={experience.accentColor}
          emissiveIntensity={isActive ? 1.5 : 0.4}
        />
      </mesh>

      {/* Station Holographic Ground Ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.19, 0]}
      >
        <ringGeometry args={[1.1, 1.25, 32]} />
        <meshBasicMaterial
          color={experience.accentColor}
          transparent
          opacity={isActive ? 0.85 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shelter Back Glass Wall */}
      <mesh position={[0, 1.4, -1.1]} castShadow>
        <boxGeometry args={[4.2, 2.3, 0.08]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.2}
          transmission={0.82}
          thickness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Shelter Side Glass */}
      <mesh position={[-2.1, 1.4, -0.4]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.4, 2.3, 0.08]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          transmission={0.82}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Structural Pillars */}
      {[-2.05, 0, 2.05].map((x, i) => (
        <mesh key={i} position={[x, 1.35, -1.12]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.6, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Modern Cantilever Roof */}
      <mesh position={[0, 2.62, -0.1]} rotation={[0.06, 0, 0]} castShadow>
        <boxGeometry args={[4.6, 0.12, 2.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Roof Edge Neon Accent */}
      <mesh position={[0, 2.6, 1.1]}>
        <boxGeometry args={[4.6, 0.06, 0.05]} />
        <meshStandardMaterial
          color={experience.accentColor}
          emissive={experience.accentColor}
          emissiveIntensity={isActive ? 2.5 : 0.8}
        />
      </mesh>

      {/* Waiting Bench */}
      <group position={[0, 0.45, -0.6]}>
        {/* Bench Planks */}
        <mesh castShadow>
          <boxGeometry args={[2.6, 0.07, 0.45]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Bench Legs */}
        <mesh position={[-1.1, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.35, 0.4]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[1.1, -0.2, 0]}>
          <boxGeometry args={[0.06, 0.35, 0.4]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
      </group>

      {/* Bus Stop Totem / Station Pole */}
      <group position={[2.1, 1.5, 0.8]}>
        {/* Main Post */}
        <mesh castShadow>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* Illuminated Signboard */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.7, 0.9, 0.15]} />
          <meshStandardMaterial color="#090d16" roughness={0.4} />
        </mesh>

        {/* Station Number Badge */}
        <mesh position={[0, 0.88, 0.08]}>
          <planeGeometry args={[0.55, 0.35]} />
          <meshBasicMaterial color={experience.accentColor} />
        </mesh>

        {/* Glowing Top Beacon */}
        <mesh ref={beaconRef} position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color={experience.accentColor}
            emissive={experience.accentColor}
            emissiveIntensity={isActive ? 4 : 1.2}
          />
        </mesh>
      </group>

      {/* Shelter Interior Warm Accent Light */}
      <pointLight
        position={[0, 2.2, 0]}
        color={experience.accentColor}
        intensity={isActive ? 3.5 : 1}
        distance={7}
      />

      {/* Interactive 3D World Tag / Card (Drei Html) */}
      <Html
        position={[0, 3.4, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={() => onSelect(experience)}
          className={`cursor-pointer transition-all duration-300 transform select-none ${
            isActive ? 'scale-105' : 'hover:scale-105 opacity-90'
          }`}
        >
          {showWorldCard && isActive ? (
            <div
              className="w-72 rounded-xl p-4 shadow-2xl backdrop-blur-xl border border-white/20 text-white transition-all pointer-events-auto"
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                boxShadow: `0 0 30px ${experience.accentColor}40`,
                borderColor: `${experience.accentColor}80`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="px-2 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider text-black"
                  style={{ backgroundColor: experience.accentColor }}
                >
                  Stop 0{experience.stationNumber}
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  {experience.period}
                </span>
              </div>
              <h3 className="font-bold text-sm leading-tight text-white mb-0.5">
                {experience.role}
              </h3>
              <p className="text-xs text-sky-300 font-medium mb-2">
                {experience.company}
              </p>
              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {experience.summary}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {experience.techStack.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-gray-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${
                isActive
                  ? 'border-sky-400 bg-slate-900/90 shadow-sky-500/30'
                  : 'border-white/20 bg-slate-900/70 hover:border-white/40'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: experience.accentColor }}
              />
              <span className="text-xs font-semibold text-white whitespace-nowrap">
                0{experience.stationNumber}: {experience.company}
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

