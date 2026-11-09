import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS } from '../../data/projects';
import { getCurveTransform } from '../../utils/roadCurve';
import { ProjectItem } from '../../types/portfolio';
import { ExternalLink, Github, Sparkles } from 'lucide-react';

interface ProjectsShowroomZoneProps {
  progress: number;
  activeProject: ProjectItem | null;
  onSelectProject: (proj: ProjectItem) => void;
}

export const ProjectsShowroomZone: React.FC<ProjectsShowroomZoneProps> = ({
  progress,
  activeProject,
  onSelectProject,
}) => {
  return (
    <group>
      {/* Background Cyber City Skyline */}
      <CitySkyline />

      {/* 3 Project Showcase Bays along the curve */}
      {PROJECTS.map((project) => {
        const transform = getCurveTransform(project.progress);
        const isActive = activeProject?.id === project.id;

        return (
          <ShowroomBay
            key={project.id}
            project={project}
            transform={transform}
            isActive={isActive}
            onSelect={() => onSelectProject(project)}
          />
        );
      })}

      {/* Finish Line Terminal at progress ~1.0 (Z ~ 480) */}
      <FinishTerminal isNearFinish={progress > 0.96} />
    </group>
  );
};

interface ShowroomBayProps {
  project: ProjectItem;
  transform: ReturnType<typeof getCurveTransform>;
  isActive: boolean;
  onSelect: () => void;
}

function ShowroomBay({ project, transform, isActive, onSelect }: ShowroomBayProps) {
  const hologramMeshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Position bay to the right of the road
  const bayPos = transform.position
    .clone()
    .addScaledVector(transform.binormal, 5.5);
  bayPos.y = transform.position.y;

  const bayRotY = transform.rotationY + Math.PI / 2;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (hologramMeshRef.current) {
      hologramMeshRef.current.rotation.y = t * 0.8;
      hologramMeshRef.current.rotation.x = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.6;
    }
  });

  return (
    <group position={bayPos} rotation={[0, bayRotY, 0]}>
      {/* Showroom Platform Pedestal */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.25, 24]} />
        <meshStandardMaterial color="#090d16" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Neon Perimeter Halo */}
      <mesh
        ref={ringRef}
        position={[0, 0.26, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[3.8, 4.0, 32]} />
        <meshBasicMaterial
          color={project.accentColor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating 3D Interactive Hologram */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6} position={[0, 2.6, 0]}>
        <mesh ref={hologramMeshRef} castShadow>
          {project.hologramType === 'torus' && (
            <torusKnotGeometry args={[0.9, 0.28, 64, 16]} />
          )}
          {project.hologramType === 'cube' && (
            <octahedronGeometry args={[1.2, 0]} />
          )}
          {project.hologramType === 'cylinder' && (
            <icosahedronGeometry args={[1.1, 1]} />
          )}
          <meshStandardMaterial
            color={project.accentColor}
            emissive={project.accentColor}
            emissiveIntensity={isActive ? 2.8 : 1.2}
            wireframe
          />
        </mesh>
      </Float>

      {/* Spot Light Illuminating Project Hologram */}
      <spotLight
        position={[0, 6.5, 2]}
        target-position={[0, 2, 0]}
        color={project.accentColor}
        intensity={isActive ? 12 : 3}
        distance={14}
        angle={0.6}
      />

      {/* Giant Curved Digital Screen Display via Drei Html */}
      <Html
        position={[0, 4.2, 0]}
        center
        distanceFactor={18}
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
              className="w-84 sm:w-96 rounded-2xl p-6 shadow-2xl backdrop-blur-xl border text-white transition-all pointer-events-auto"
              style={{
                background: 'rgba(11, 15, 26, 0.95)',
                borderColor: `${project.accentColor}90`,
                boxShadow: `0 0 45px ${project.accentColor}40`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-950 font-mono shadow"
                  style={{ backgroundColor: project.accentColor }}
                >
                  Bay 0{project.bayNumber} // Featured
                </span>
                <span className="flex items-center gap-1 text-xs text-sky-400 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  SHOWCASE
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {project.title}
              </h3>
              <p className="text-xs font-medium text-slate-400 mb-3 font-mono">
                {project.subtitle}
              </p>

              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {project.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-[10px] text-slate-400 font-mono uppercase">
                      {m.label}
                    </div>
                    <div
                      className="text-sm font-bold font-mono"
                      style={{ color: project.accentColor }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Launch Prototype</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="View Source on GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-xl backdrop-blur-md transition-all bg-slate-950/80 hover:border-white/50"
              style={{ borderColor: `${project.accentColor}60` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.accentColor }}
              />
              <span className="text-xs font-bold text-white font-mono whitespace-nowrap">
                0{project.bayNumber}: {project.title}
              </span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// Background futuristic skyscrapers
function CitySkyline() {
  const buildingData = [
    { x: -35, z: 320, h: 42, w: 12, d: 12 },
    { x: -55, z: 380, h: 58, w: 16, d: 14 },
    { x: -28, z: 440, h: 48, w: 14, d: 12 },
    { x: 35, z: 340, h: 45, w: 14, d: 14 },
    { x: 60, z: 400, h: 65, w: 18, d: 16 },
    { x: 30, z: 460, h: 52, w: 12, d: 12 },
  ];

  return (
    <group>
      {buildingData.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#070b14"
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
          {/* Glowing Top Beacon Antenna */}
          <mesh position={[0, b.h / 2 + 3, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 6, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, b.h / 2 + 6, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Finish Line Cyber Terminal at progress ~1.0
function FinishTerminal({ isNearFinish }: { isNearFinish: boolean }) {
  return (
    <group position={[0, 0, 480]}>
      {/* Terminal Gate Arch */}
      <mesh position={[-6, 4, 0]}>
        <boxGeometry args={[0.8, 8, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[6, 4, 0]}>
        <boxGeometry args={[0.8, 8, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[13, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Floating Checkpoint Card */}
      <Html position={[0, 4.5, 0]} center distanceFactor={16}>
        <div
          className={`glass-panel p-6 rounded-2xl border text-center transition-all duration-500 max-w-sm ${
            isNearFinish ? 'scale-105 opacity-100 border-sky-400' : 'opacity-80 border-white/20'
          }`}
          style={{
            background: 'rgba(9, 10, 15, 0.95)',
            boxShadow: '0 0 40px rgba(56, 189, 248, 0.35)',
          }}
        >
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
            DESTINATION REACHED
          </div>
          <h2 className="text-lg font-black text-white mb-2">
            Transmission Port Open
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Available for Senior / Lead Engineering roles, WebGL advisories, and full-stack spatial architectures.
          </p>
          <a
            href="mailto:contact@alexchen.dev"
            className="inline-block w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-glow-cyan transition-colors"
          >
            Transmit Message (alex@chen.dev)
          </a>
        </div>
      </Html>
    </group>
  );
}

