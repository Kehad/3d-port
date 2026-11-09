import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CarProps {
  position: THREE.Vector3;
  rotationY: number;
  speed: number;
  steeringAngle?: number;
  isIgnited?: boolean;
}

export const Car: React.FC<CarProps> = ({
  position,
  rotationY,
  speed,
  steeringAngle = 0,
  isIgnited = true,
}) => {
  const carGroupRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const chassisRef = useRef<THREE.Group>(null);
  const headlightBeamRef = useRef<THREE.SpotLight>(null);
  const exhaustParticlesRef = useRef<THREE.Points>(null);

  const wheelRotation = useRef(0);

  // Procedural exhaust particles
  const particleCount = 45;
  const { particlePositions, particleVelocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel: { x: number; y: number; z: number; life: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = -1.8 - Math.random() * 0.5;
      vel.push({
        x: (Math.random() - 0.5) * 0.04,
        y: Math.random() * 0.03,
        z: -0.15 - Math.random() * 0.25,
        life: Math.random(),
      });
    }
    return { particlePositions: pos, particleVelocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!carGroupRef.current) return;

    carGroupRef.current.position.copy(position);
    carGroupRef.current.rotation.y = rotationY;

    // Wheel spin
    const wheelRadius = 0.4;
    const distanceTraveled = speed * delta * 45;
    wheelRotation.current -= distanceTraveled / wheelRadius;

    // Front steering
    [frontLeftWheelRef.current, frontRightWheelRef.current].forEach((wheelGroup) => {
      if (wheelGroup) {
        wheelGroup.rotation.y = steeringAngle;
        const wheelMesh = wheelGroup.children[0];
        if (wheelMesh) {
          wheelMesh.rotation.x = wheelRotation.current;
        }
      }
    });

    wheelsRef.current.forEach((wheelMesh) => {
      if (wheelMesh) {
        wheelMesh.rotation.x = wheelRotation.current;
      }
    });

    // Suspension bounce and acceleration tilt
    if (chassisRef.current) {
      const isMoving = Math.abs(speed) > 0.0001;
      const idleRumble = isIgnited ? Math.sin(state.clock.elapsedTime * 22) * 0.004 : 0;
      const moveBounce = isMoving ? Math.sin(state.clock.elapsedTime * 16) * 0.015 : 0;
      chassisRef.current.position.y = 0.35 + idleRumble + moveBounce;
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(
        chassisRef.current.rotation.x,
        speed * 0.35,
        0.1
      );
    }

    // Headlight intensity ramp
    if (headlightBeamRef.current) {
      const targetIntensity = isIgnited ? (Math.abs(speed) > 0.01 ? 22 : 12) : 0.5;
      headlightBeamRef.current.intensity = THREE.MathUtils.lerp(
        headlightBeamRef.current.intensity,
        targetIntensity,
        0.1
      );
    }

    // Exhaust particle updates
    if (exhaustParticlesRef.current && isIgnited) {
      const posAttr = exhaustParticlesRef.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      const isRevving = Math.abs(speed) > 0.001;

      for (let i = 0; i < particleCount; i++) {
        const v = particleVelocities[i];
        v.life -= delta * (isRevving ? 2.5 : 1.2);

        if (v.life <= 0) {
          // Reset particle at exhaust pipe
          v.life = 1.0;
          arr[i * 3 + 0] = (Math.random() - 0.5) * 0.35;
          arr[i * 3 + 1] = 0.22;
          arr[i * 3 + 2] = -1.8;
        } else {
          arr[i * 3 + 0] += v.x;
          arr[i * 3 + 1] += v.y;
          arr[i * 3 + 2] += v.z * (isRevving ? 1.8 : 0.6);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={carGroupRef}>
      {/* Dynamic Chassis */}
      <group ref={chassisRef} position={[0, 0.35, 0]}>
        {/* Main Body */}
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[1.7, 0.42, 3.4]} />
          <meshStandardMaterial
            color="#0ea5e9"
            roughness={0.2}
            metalness={0.75}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Front Hood Slope */}
        <mesh castShadow position={[0, 0.16, 1.45]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.65, 0.28, 0.7]} />
          <meshStandardMaterial color="#0284c7" roughness={0.25} metalness={0.7} />
        </mesh>

        {/* Front Air Splitter */}
        <mesh position={[0, -0.05, 1.7]}>
          <boxGeometry args={[1.72, 0.08, 0.3]} />
          <meshStandardMaterial color="#090d16" roughness={0.7} />
        </mesh>

        {/* Cockpit Tinted Canopy Glass */}
        <mesh castShadow position={[0, 0.62, -0.2]}>
          <boxGeometry args={[1.35, 0.48, 1.9]} />
          <meshPhysicalMaterial
            color="#0f172a"
            roughness={0.06}
            metalness={0.9}
            transmission={0.4}
            thickness={0.5}
            reflectivity={0.9}
          />
        </mesh>

        {/* Roof Shell */}
        <mesh castShadow position={[0, 0.88, -0.2]}>
          <boxGeometry args={[1.25, 0.06, 1.5]} />
          <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Rear Deck */}
        <mesh castShadow position={[0, 0.3, -1.4]}>
          <boxGeometry args={[1.68, 0.3, 0.8]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.25} metalness={0.7} />
        </mesh>

        {/* Cyber Rear Wing / Spoiler */}
        <group position={[0, 0.58, -1.65]}>
          <mesh castShadow>
            <boxGeometry args={[1.72, 0.06, 0.32]} />
            <meshStandardMaterial color="#0369a1" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[-0.6, -0.12, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.15]} />
            <meshStandardMaterial color="#090d16" />
          </mesh>
          <mesh position={[0.6, -0.12, 0]}>
            <boxGeometry args={[0.06, 0.2, 0.15]} />
            <meshStandardMaterial color="#090d16" />
          </mesh>
        </group>

        {/* Headlight Neon Light Bars */}
        <group position={[0, 0.25, 1.72]}>
          <mesh position={[-0.62, 0, 0]}>
            <boxGeometry args={[0.35, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={isIgnited ? 3.5 : 0.3}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0.62, 0, 0]}>
            <boxGeometry args={[0.35, 0.08, 0.05]} />
            <meshStandardMaterial
              color="#e0f2fe"
              emissive="#38bdf8"
              emissiveIntensity={isIgnited ? 3.5 : 0.3}
              toneMapped={false}
            />
          </mesh>
          {/* Headlight Forward Beam */}
          <spotLight
            ref={headlightBeamRef}
            position={[0, 0, 0.2]}
            target-position={[0, -0.5, 16]}
            color="#38bdf8"
            intensity={isIgnited ? 18 : 0}
            distance={34}
            angle={0.48}
            penumbra={0.65}
          />
        </group>

        {/* Taillight LED Bar */}
        <group position={[0, 0.32, -1.72]}>
          <mesh>
            <boxGeometry args={[1.58, 0.07, 0.05]} />
            <meshStandardMaterial
              color="#ff4444"
              emissive="#ef4444"
              emissiveIntensity={isIgnited ? 3 : 0.4}
              toneMapped={false}
            />
          </mesh>
          <pointLight color="#ef4444" intensity={isIgnited ? 2.5 : 0} distance={5} />
        </group>

        {/* Dual Exhaust Pipes with glowing rims */}
        <mesh position={[-0.45, 0.08, -1.73]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0.45, 0.08, -1.73]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>

        {/* Neon Underglow Strip */}
        <pointLight
          position={[0, -0.2, 0]}
          color="#38bdf8"
          intensity={isIgnited ? 2.2 : 0}
          distance={3.2}
        />
      </group>

      {/* Exhaust Particle Emitter */}
      {isIgnited && (
        <points ref={exhaustParticlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.16}
            color="#38bdf8"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Front Wheels (Steered) */}
      <group ref={frontLeftWheelRef} position={[-0.92, 0.35, 1.05]}>
        <Wheel />
      </group>
      <group ref={frontRightWheelRef} position={[0.92, 0.35, 1.05]}>
        <Wheel />
      </group>

      {/* Rear Wheels */}
      <group
        position={[-0.92, 0.35, -1.05]}
        ref={(el) => {
          if (el) wheelsRef.current[0] = el;
        }}
      >
        <Wheel />
      </group>
      <group
        position={[0.92, 0.35, -1.05]}
        ref={(el) => {
          if (el) wheelsRef.current[1] = el;
        }}
      >
        <Wheel />
      </group>
    </group>
  );
};

function Wheel() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.26, 18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.27, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 8]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}
