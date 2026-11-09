import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SKILL_GATES } from '../../data/skills';
import { getCurveTransform } from '../../utils/roadCurve';
import { SkillCategory } from '../../types/portfolio';

interface SkillsZoneProps {
  progress: number;
  activeSkillGate: SkillCategory | null;
  onSelectSkillGate: (gate: SkillCategory) => void;
}

export const SkillsZone: React.FC<SkillsZoneProps> = ({
  progress,
  activeSkillGate,
  onSelectSkillGate,
}) => {
  return (
    <group>
      {SKILL_GATES.map((gate) => {
        const transform = getCurveTransform(gate.progress);
        const isActive = activeSkillGate?.id === gate.id;

        return (
          <CyberTollGate
            key={gate.id}
            gate={gate}
            transform={transform}
            isActive={isActive}
            onSelect={() => onSelectSkillGate(gate)}
          />
        );
      })}
    </group>
  );
};

interface CyberTollGateProps {
  gate: SkillCategory;
  transform: ReturnType<typeof getCurveTransform>;
  isActive: boolean;
  onSelect: () => void;
}

function CyberTollGate({ gate, transform, isActive, onSelect }: CyberTollGateProps) {
  const laserRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (laserRef.current) {
      laserRef.current.scale.y = 1 + Math.sin(t * 8) * 0.05;
    }
    if (pulseRingRef.current) {
      pulseRingRef.current.rotation.z = t * 1.5;
    }
  });

  return (
    <group
      position={transform.position}
      rotation={[0, transform.rotationY, 0]}
    >
      {/* Toll Gate Arch Structure spanning across road */}
      <group position={[0, 0, 0]}>
        {/* Left Cyber Pylon */}
        <mesh position={[-4.8, 3.8, 0]} castShadow>
          <boxGeometry args={[0.6, 7.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Left Pylon Neon Strip */}
        <mesh position={[-4.45, 3.8, 0]}>
          <boxGeometry args={[0.08, 7.2, 0.1]} />
          <meshStandardMaterial
            color={gate.accentColor}
            emissive={gate.accentColor}
            emissiveIntensity={isActive ? 3.5 : 1.2}
          />
        </mesh>

        {/* Right Cyber Pylon */}
        <mesh position={[4.8, 3.8, 0]} castShadow>
          <boxGeometry args={[0.6, 7.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Pylon Neon Strip */}
        <mesh position={[4.45, 3.8, 0]}>
          <boxGeometry args={[0.08, 7.2, 0.1]} />
          <meshStandardMaterial
            color={gate.accentColor}
            emissive={gate.accentColor}
            emissiveIntensity={isActive ? 3.5 : 1.2}
          />
        </mesh>

        {/* Overhead Gantry Crossbeam */}
        <mesh position={[0, 7.5, 0]} castShadow>
          <boxGeometry args={[10.6, 0.9, 1.2]} />
          <meshStandardMaterial color="#090d16" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Digital Toll Name Signboard */}
        <mesh position={[0, 7.4, 0.65]}>
          <boxGeometry args={[6.8, 0.65, 0.12]} />
          <meshStandardMaterial
            color="#020617"
            emissive={gate.accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Holographic Overhead Scanner Beam / Laser Field */}
        <mesh
          ref={laserRef}
          position={[0, 3.5, 0]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[8.8, 6.8]} />
          <meshBasicMaterial
            color={gate.accentColor}
            transparent
            opacity={isActive ? 0.35 : 0.12}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Overhead Spotlights down onto highway */}
        <spotLight
          position={[0, 7.2, 0]}
          target-position={[0, 0, 2]}
          color={gate.accentColor}
          intensity={isActive ? 16 : 4}
          distance={15}
          angle={0.7}
          penumbra={0.6}
        />
      </group>

      {/* Floating Holographic Cyber Billboard using Drei Float */}
      <Float
        speed={2.2}
        rotationIntensity={0.25}
        floatIntensity={0.4}
        position={[4.6, 5.2, 2.5]}
      >
        <Html
          center
          distanceFactor={16}
          zIndexRange={[100, 0]}
        >
          <div
            onClick={onSelect}
            className={`cursor-pointer transition-all duration-300 transform select-none ${
              isActive ? 'scale-105' : 'hover:scale-105'
            }`}
          >
            {isActive ? (
              <div
                className="w-80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl border text-white transition-all pointer-events-auto"
                style={{
                  background: 'rgba(11, 15, 26, 0.94)',
                  borderColor: `${gate.accentColor}80`,
                  boxShadow: `0 0 35px ${gate.accentColor}45`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-950 font-mono shadow"
                    style={{ backgroundColor: gate.accentColor }}
                  >
                    Gate 0{gate.gateNumber}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    SCAN_ACTIVE
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1">
                  {gate.category}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {gate.description}
                </p>

                {/* Skill Gauges & Badges */}
                <div className="space-y-2">
                  {gate.skills.map((s) => (
                    <div key={s.name} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-200">
                          {s.name}
                        </span>
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: gate.accentColor }}
                        >
                          {s.level}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.level}%`,
                            backgroundColor: gate.accentColor,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all border-white/20 bg-slate-950/80 hover:border-white/40"
                style={{ borderColor: `${gate.accentColor}50` }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: gate.accentColor }}
                />
                <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
                  {gate.gateName}
                </span>
              </div>
            )}
          </div>
        </Html>
      </Float>
    </group>
  );
}

