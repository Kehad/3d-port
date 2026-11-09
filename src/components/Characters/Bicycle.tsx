import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarModel } from './AvatarModel';
import { AvatarGender } from '../../types/testsprite';

interface BicycleProps {
  gender: AvatarGender;
  position: THREE.Vector3;
  rotationY: number;
  speed: number;
  steeringAngle?: number;
  outfitColor?: string;
  hairColor?: string;
}

/**
 * High-fidelity 3D Golden City Cruiser Bicycle matching user reference Image 3:
 * - Vibrant sunflower-yellow diamond frame (top tube, down tube, seat tube, stays, fork).
 * - Matching yellow deep-dish rims with thin black rubber tires and wire spokes.
 * - Silver circular chainring disc, pedals, and black drive chain.
 * - Vintage dark brown leather saddle and chrome riser handlebars.
 * - Seated avatar rider pedaling smoothly.
 */
export const Bicycle: React.FC<BicycleProps> = ({
  gender,
  position,
  rotationY,
  speed,
  steeringAngle = 0,
  outfitColor,
  hairColor,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const leanGroupRef = useRef<THREE.Group>(null);
  const frontForkRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const crankRef = useRef<THREE.Group>(null);

  const wheelRotation = useRef(0);

  // Exact reference yellow frame & rim color from Image 3
  const frameColor = '#f59e0b'; // Vibrant sunflower yellow / golden amber
  const rimColor = '#eab308'; // Matching yellow deep-dish rim
  const saddleColor = '#451a03'; // Vintage dark brown leather
  const metalColor = '#cbd5e1'; // Polished chrome / silver

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;

    rootGroupRef.current.position.copy(position);
    rootGroupRef.current.rotation.y = rotationY;

    // Wheel spin physics based on speed (wheel radius ~0.34m)
    const wheelRadius = 0.34;
    const distance = speed * delta * 45;
    wheelRotation.current -= distance / wheelRadius;

    if (frontWheelRef.current) frontWheelRef.current.rotation.x = wheelRotation.current;
    if (rearWheelRef.current) rearWheelRef.current.rotation.x = wheelRotation.current;

    // Pedaling crank rotation
    if (crankRef.current) {
      crankRef.current.rotation.x = wheelRotation.current * 0.75;
    }

    // Front fork steering
    if (frontForkRef.current) {
      frontForkRef.current.rotation.y = steeringAngle;
    }

    // Dynamic banking lean physics into turns
    if (leanGroupRef.current) {
      const targetLean = -steeringAngle * 1.5;
      const isMoving = Math.abs(speed) > 0.001;
      const pedalSway = isMoving ? Math.sin(state.clock.elapsedTime * 12) * 0.025 : 0;

      leanGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        leanGroupRef.current.rotation.z,
        targetLean + pedalSway,
        0.12
      );
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* Dynamic Leaning Frame Group */}
      <group ref={leanGroupRef} position={[0, 0, 0]}>
        {/* VIBRANT YELLOW DIAMOND FRAME (Image 3) */}
        <group position={[0, 0.35, 0]}>
          {/* Top Tube */}
          <mesh position={[0, 0.44, 0.05]} rotation={[0.08, 0, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.86, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Down Tube */}
          <mesh position={[0, 0.18, 0.18]} rotation={[-0.75, 0, 0]} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 0.95, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Seat Tube */}
          <mesh position={[0, 0.28, -0.32]} rotation={[0.26, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.84, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.4} />
          </mesh>

          {/* Chainstays (Bottom Bracket to Rear Hub) */}
          <group position={[0, -0.06, -0.58]}>
            <mesh position={[-0.04, 0, 0]} rotation={[-0.1, 0, -0.06]}>
              <cylinderGeometry args={[0.018, 0.018, 0.66, 8]} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
            <mesh position={[0.04, 0, 0]} rotation={[-0.1, 0, 0.06]}>
              <cylinderGeometry args={[0.018, 0.018, 0.66, 8]} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
          </group>

          {/* Seatstays (Seat Lug to Rear Hub) */}
          <group position={[0, 0.2, -0.6]}>
            <mesh position={[-0.04, 0, 0]} rotation={[-0.7, 0, -0.06]}>
              <cylinderGeometry args={[0.018, 0.018, 0.72, 8]} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
            <mesh position={[0.04, 0, 0]} rotation={[-0.7, 0, 0.06]}>
              <cylinderGeometry args={[0.018, 0.018, 0.72, 8]} />
              <meshStandardMaterial color={frameColor} />
            </mesh>
          </group>

          {/* Chrome Seatpost */}
          <mesh position={[0, 0.58, -0.36]} rotation={[0.26, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.26, 8]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Vintage Brown Leather Saddle (Image 3) */}
          <group position={[0, 0.68, -0.38]}>
            {/* Saddle Top */}
            <mesh castShadow>
              <boxGeometry args={[0.18, 0.06, 0.32]} />
              <meshStandardMaterial color={saddleColor} roughness={0.7} />
            </mesh>
            {/* Saddle Nose */}
            <mesh position={[0, -0.01, 0.16]}>
              <boxGeometry args={[0.08, 0.05, 0.1]} />
              <meshStandardMaterial color={saddleColor} roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* ROTATING CRANK, SILVER CHAINRING & PEDALS (Image 3) */}
        <group ref={crankRef} position={[0, 0.3, -0.25]}>
          {/* Bottom Bracket Axle */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 0.18, 12]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} />
          </mesh>

          {/* Silver Circular Chainring Disc (Image 3) */}
          <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.015, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Left Crank Arm & Pedal */}
          <mesh position={[-0.1, 0.1, 0]}>
            <boxGeometry args={[0.02, 0.22, 0.03]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} />
          </mesh>
          <mesh position={[-0.14, 0.21, 0]}>
            <boxGeometry args={[0.08, 0.03, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>

          {/* Right Crank Arm & Pedal */}
          <mesh position={[0.1, -0.1, 0]}>
            <boxGeometry args={[0.02, 0.22, 0.03]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} />
          </mesh>
          <mesh position={[0.14, -0.21, 0]}>
            <boxGeometry args={[0.08, 0.03, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* DRIVE CHAIN (from chainring to rear cog) */}
        <mesh position={[0.08, 0.31, -0.55]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.01, 0.02, 0.62]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* REAR WHEEL WITH YELLOW DEEP-DISH RIM (Image 3) */}
        <group position={[0, 0.34, -0.85]} ref={rearWheelRef}>
          {/* Black Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[0.34, 0.022, 12, 32]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>

          {/* Sunflower Yellow Deep-Dish Aerodynamic Rim (Image 3) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.31, 0.035, 16, 32]} />
            <meshStandardMaterial color={rimColor} roughness={0.3} metalness={0.3} />
          </mesh>

          {/* Chrome Wire Spokes */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.01, 24]} />
            <meshStandardMaterial color={metalColor} wireframe transparent opacity={0.6} />
          </mesh>

          {/* Silver Rear Hub & Cog */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} />
          </mesh>
        </group>

        {/* FRONT FORK, HANDLEBARS & FRONT WHEEL (Image 3) */}
        <group ref={frontForkRef} position={[0, 0.35, 0.45]}>
          {/* Yellow Front Fork (Left & Right Blades) */}
          <mesh position={[-0.04, 0.15, 0.1]} rotation={[-0.32, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.016, 0.85, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.3} />
          </mesh>
          <mesh position={[0.04, 0.15, 0.1]} rotation={[-0.32, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.016, 0.85, 12]} />
            <meshStandardMaterial color={frameColor} roughness={0.3} />
          </mesh>

          {/* Chrome Handlebar Stem & Riser Bar (Image 3) */}
          <group position={[0, 0.52, 0]}>
            {/* Stem */}
            <mesh position={[0, 0.08, 0.06]} rotation={[0.2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Horizontal Chrome Handlebar */}
            <mesh position={[0, 0.15, 0.08]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.66, 12]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Black Rubber Grips */}
            <mesh position={[-0.28, 0.15, 0.08]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.13, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
            <mesh position={[0.28, 0.15, 0.08]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.024, 0.024, 0.13, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>

            {/* Brake Levers */}
            <mesh position={[-0.18, 0.13, 0.12]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.01, 0.015, 0.08]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} />
            </mesh>
            <mesh position={[0.18, 0.13, 0.12]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.01, 0.015, 0.08]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} />
            </mesh>
          </group>

          {/* FRONT WHEEL WITH YELLOW DEEP-DISH RIM (Image 3) */}
          <group position={[0, -0.01, 0.35]} ref={frontWheelRef}>
            {/* Black Rubber Tire */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.34, 0.022, 12, 32]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>

            {/* Sunflower Yellow Deep-Dish Rim (Image 3) */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.31, 0.035, 16, 32]} />
              <meshStandardMaterial color={rimColor} roughness={0.3} metalness={0.3} />
            </mesh>

            {/* Chrome Wire Spokes */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.27, 0.27, 0.01, 24]} />
              <meshStandardMaterial color={metalColor} wireframe transparent opacity={0.6} />
            </mesh>

            {/* Silver Front Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.035, 0.035, 0.11, 16]} />
              <meshStandardMaterial color={metalColor} metalness={0.9} />
            </mesh>
          </group>
        </group>

        {/* AVATAR RIDER IN BIKING POSE (Image 3) */}
        <group position={[0, 0.28, -0.32]}>
          <AvatarModel
            gender={gender}
            pose="biking"
            speed={speed}
            outfitColor={outfitColor}
            hairColor={hairColor}
          />
        </group>
      </group>
    </group>
  );
};
