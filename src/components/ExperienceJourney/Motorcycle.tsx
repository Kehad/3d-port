import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MotorcycleProps {
  position: THREE.Vector3;
  rotationY: number;
  speed: number;
  steeringAngle?: number;
  isIgnited?: boolean;
}

export const Motorcycle: React.FC<MotorcycleProps> = ({
  position,
  rotationY,
  speed,
  steeringAngle = 0,
  isIgnited = true,
}) => {
  const bikeGroupRef = useRef<THREE.Group>(null);
  const leanGroupRef = useRef<THREE.Group>(null);
  const frontForkRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const rearWheelRef = useRef<THREE.Mesh>(null);
  const headlightBeamRef = useRef<THREE.SpotLight>(null);
  const exhaustParticlesRef = useRef<THREE.Points>(null);

  const wheelRotation = useRef(0);

  // Procedural exhaust particles
  const particleCount = 30;
  const { particlePositions, particleVelocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel: { x: number; y: number; z: number; life: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 1] = 0.25;
      pos[i * 3 + 2] = -1.3;
      vel.push({
        x: (Math.random() - 0.5) * 0.03,
        y: Math.random() * 0.03,
        z: -0.15 - Math.random() * 0.2,
        life: Math.random(),
      });
    }
    return { particlePositions: pos, particleVelocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!bikeGroupRef.current) return;

    bikeGroupRef.current.position.copy(position);
    bikeGroupRef.current.rotation.y = rotationY;

    // Wheel spin (radius ~0.38)
    const wheelRadius = 0.38;
    const distanceTraveled = speed * delta * 50;
    wheelRotation.current -= distanceTraveled / wheelRadius;

    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.x = wheelRotation.current;
    }
    if (rearWheelRef.current) {
      rearWheelRef.current.rotation.x = wheelRotation.current;
    }

    // Front fork steering
    if (frontForkRef.current) {
      frontForkRef.current.rotation.y = steeringAngle;
    }

    // Motorcycle banks/leans dynamically into curves!
    if (leanGroupRef.current) {
      const targetLean = -steeringAngle * 1.8;
      const isMoving = Math.abs(speed) > 0.0001;
      const idleBob = isIgnited ? Math.sin(state.clock.elapsedTime * 20) * 0.005 : 0;
      const moveBob = isMoving ? Math.sin(state.clock.elapsedTime * 18) * 0.012 : 0;

      leanGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        leanGroupRef.current.rotation.z,
        targetLean,
        0.12
      );
      leanGroupRef.current.position.y = 0.1 + idleBob + moveBob;
    }

    // Headlight intensity
    if (headlightBeamRef.current) {
      const targetIntensity = isIgnited ? (Math.abs(speed) > 0.01 ? 24 : 14) : 0.5;
      headlightBeamRef.current.intensity = THREE.MathUtils.lerp(
        headlightBeamRef.current.intensity,
        targetIntensity,
        0.1
      );
    }

    // Exhaust particles
    if (exhaustParticlesRef.current && isIgnited) {
      const posAttr = exhaustParticlesRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      const isRevving = Math.abs(speed) > 0.001;

      for (let i = 0; i < particleCount; i++) {
        const v = particleVelocities[i];
        v.life -= delta * (isRevving ? 2.8 : 1.4);

        if (v.life <= 0) {
          v.life = 1.0;
          arr[i * 3 + 0] = 0.22 + (Math.random() - 0.5) * 0.08;
          arr[i * 3 + 1] = 0.28;
          arr[i * 3 + 2] = -1.2;
        } else {
          arr[i * 3 + 0] += v.x;
          arr[i * 3 + 1] += v.y;
          arr[i * 3 + 2] += v.z * (isRevving ? 2.0 : 0.7);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={bikeGroupRef}>
      {/* Leaning Group for natural motorcycle banking physics */}
      <group ref={leanGroupRef} position={[0, 0.1, 0]}>
        {/* Main Cyber Frame */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.38, 0.42, 1.8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Slanted Fuel Tank / Cowling */}
        <mesh position={[0, 0.8, 0.35]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.32, 0.75]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Neon Accent Lines on Tank */}
        <mesh position={[0.22, 0.82, 0.35]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.6]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={isIgnited ? 3 : 0.5}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-0.22, 0.82, 0.35]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.02, 0.08, 0.6]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={isIgnited ? 3 : 0.5}
            toneMapped={false}
          />
        </mesh>

        {/* Motorcycle Ergonomic Seat */}
        <mesh position={[0, 0.68, -0.25]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.32, 0.15, 0.65]} />
          <meshStandardMaterial color="#090d16" roughness={0.7} />
        </mesh>

        {/* Rear Cyber Tail Fairing */}
        <mesh position={[0, 0.78, -0.75]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.6]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Engine Block with Heat Fins */}
        <mesh position={[0, 0.38, 0.05]} castShadow>
          <boxGeometry args={[0.42, 0.38, 0.6]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Exhaust Pipe & Muffler */}
        <group position={[0.24, 0.32, -0.6]} rotation={[-0.15, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.9, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Exhaust Tip */}
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 12]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ea580c"
              emissiveIntensity={isIgnited ? 2.5 : 0}
            />
          </mesh>
        </group>

        {/* Rear Wheel Assembly */}
        <group position={[0, 0.38, -0.85]}>
          <mesh ref={rearWheelRef} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.22, 20]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          {/* Glowing Neon Ring on Rear Rim */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.25, 0.28, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={isIgnited ? 3 : 0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Rear Swingarm */}
          <mesh position={[-0.15, 0.1, 0.35]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.05, 0.08, 0.7]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0.15, 0.1, 0.35]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.05, 0.08, 0.7]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        </group>

        {/* Front Fork & Steering Assembly */}
        <group ref={frontForkRef} position={[0, 0.65, 0.8]}>
          {/* Fork Tubes */}
          <mesh position={[-0.16, -0.15, 0.12]} rotation={[-0.35, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.85, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.16, -0.15, 0.12]} rotation={[-0.35, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.85, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Front Wheel */}
          <group position={[0, -0.27, 0.28]}>
            <mesh ref={frontWheelRef} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.18, 20]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
            {/* Glowing Neon Ring on Front Rim */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.25, 0.28, 24]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={isIgnited ? 3 : 0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Handlebars */}
          <group position={[0, 0.25, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 0.75, 8]} />
              <meshStandardMaterial color="#090d16" />
            </mesh>
            {/* Rubber Grips */}
            <mesh position={[-0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.14, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0.34, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.14, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Cyber Visor / Windscreen */}
            <mesh position={[0, 0.18, 0.12]} rotation={[0.45, 0, 0]}>
              <boxGeometry args={[0.32, 0.25, 0.04]} />
              <meshPhysicalMaterial
                color="#0f172a"
                roughness={0.1}
                transmission={0.6}
                thickness={0.2}
              />
            </mesh>
          </group>

          {/* Front Headlight LED Bar */}
          <group position={[0, 0.08, 0.26]}>
            <mesh>
              <boxGeometry args={[0.28, 0.08, 0.05]} />
              <meshStandardMaterial
                color="#e0f2fe"
                emissive="#38bdf8"
                emissiveIntensity={isIgnited ? 4 : 0.4}
                toneMapped={false}
              />
            </mesh>
            {/* Forward Headlight Beam */}
            <spotLight
              ref={headlightBeamRef}
              position={[0, 0, 0.2]}
              target-position={[0, -0.6, 16]}
              color="#38bdf8"
              intensity={isIgnited ? 20 : 0}
              distance={35}
              angle={0.42}
              penumbra={0.6}
            />
          </group>
        </group>

        {/* Rear Taillight Strip */}
        <mesh position={[0, 0.82, -1.06]}>
          <boxGeometry args={[0.22, 0.06, 0.04]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={isIgnited ? 3.5 : 0.4}
            toneMapped={false}
          />
        </mesh>

        {/* Motorcycle Underglow Glow */}
        <pointLight
          position={[0, 0.2, 0]}
          color="#38bdf8"
          intensity={isIgnited ? 2.5 : 0}
          distance={3.0}
        />
      </group>

      {/* Exhaust Particle System */}
      {isIgnited && (
        <points ref={exhaustParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            color="#38bdf8"
            transparent
            opacity={0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};

