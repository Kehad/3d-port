import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarGender } from '../../types/testsprite';

interface AvatarModelProps {
  gender: AvatarGender;
  pose?: 'standing' | 'walking' | 'biking' | 'driving';
  speed?: number;
  outfitColor?: string;
  hairColor?: string;
}

/**
 * High-fidelity stylized avatar model matching user reference imagery:
 * - Male: Dusty mauve/lavender sweatshirt with flap sleeve pocket, slate-blue chinos, white sneakers, smartphone to ear.
 * - Female: Camel wool trench coat, dark charcoal turtleneck, rolled blue jeans, tan ankle boots, white designer handbag.
 */
export const AvatarModel: React.FC<AvatarModelProps> = ({
  gender = 'male',
  pose = 'standing',
  speed = 0,
  outfitColor,
  hairColor,
}) => {
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const handbagRef = useRef<THREE.Group>(null);

  const walkCycle = useRef(0);
  const isFemale = gender === 'female';

  // Default color palettes inspired directly by reference photos
  const maleSweatshirtColor = outfitColor || '#c49bb0'; // Dusty rose / lavender-pink sweatshirt
  const maleRibbingColor = '#b58ca1';
  const maleChinosColor = '#56748e'; // Slate-blue tailored chinos
  const maleShoeColor = '#ffffff'; // Crisp white sneakers
  const maleHairColor = hairColor || '#1c1917'; // Short dark brown / black

  const femaleCoatColor = outfitColor || '#b88251'; // Camel / warm tan trench coat
  const femaleTurtleneckColor = '#1e2430'; // Dark charcoal / deep navy turtleneck
  const femaleJeansColor = '#2e435c'; // Blue denim jeans
  const femaleBootColor = '#99582a'; // Camel / tan suede ankle boots
  const femaleHairColor = hairColor || '#382218'; // Chocolate brown with bangs
  const femaleSkinTone = '#fed7aa';
  const maleSkinTone = '#fed7aa';

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const isMoving = Math.abs(speed) > 0.001;

    if (pose === 'walking') {
      if (isMoving) {
        walkCycle.current += delta * Math.max(Math.abs(speed) * 85, 5.0);
      } else {
        walkCycle.current = THREE.MathUtils.lerp(walkCycle.current, 0, 0.1);
      }
      const cycle = walkCycle.current;
      const swing = isMoving ? 0.65 : 0;

      // Legs swing
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(cycle) * swing;
        rightLegRef.current.rotation.x = -Math.sin(cycle) * swing;
        leftLegRef.current.position.y = 0.88;
        rightLegRef.current.position.y = 0.88;
      }

      // Arms swing
      if (leftArmRef.current && rightArmRef.current) {
        if (!isFemale && !isMoving) {
          // Male holding phone idle
          rightArmRef.current.rotation.set(1.4, -0.4, 0.3);
          leftArmRef.current.rotation.x = 0;
        } else {
          leftArmRef.current.rotation.x = -Math.sin(cycle) * swing * 0.7;
          rightArmRef.current.rotation.x = Math.sin(cycle) * swing * 0.7;
          rightArmRef.current.rotation.y = 0;
          rightArmRef.current.rotation.z = 0;
        }
      }

      // Torso bob
      if (torsoRef.current) {
        const bob = isMoving ? Math.abs(Math.sin(cycle)) * 0.06 : Math.sin(t * 3) * 0.015;
        torsoRef.current.position.y = 0.95 + bob;
        torsoRef.current.rotation.y = isMoving ? Math.sin(cycle) * 0.08 : 0;
        torsoRef.current.rotation.x = 0;
      }

      // Handbag subtle sway for female
      if (handbagRef.current) {
        handbagRef.current.rotation.x = Math.sin(cycle) * 0.25;
      }
    } else if (pose === 'biking') {
      // Biking posture: leaned forward, hands on handlebars, pedaling legs
      const pedalSpeed = Math.abs(speed) * 60;
      walkCycle.current += delta * Math.max(pedalSpeed, isMoving ? 4.0 : 0);
      const cycle = walkCycle.current;

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.74;
        torsoRef.current.rotation.x = 0.38; // leaning forward
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(-0.72, 0.15, 0);
        rightArmRef.current.rotation.set(-0.72, -0.15, 0);
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0.45 + Math.sin(cycle) * 0.5;
        rightLegRef.current.rotation.x = 0.45 - Math.sin(cycle) * 0.5;
      }
      if (handbagRef.current) {
        handbagRef.current.visible = false; // tuck bag while biking
      }
    } else if (pose === 'driving') {
      // Seated in cockpit
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.45;
        torsoRef.current.position.z = -0.15;
        torsoRef.current.rotation.x = -0.1;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.set(-0.55, 0, 0);
        rightArmRef.current.rotation.set(-0.55, 0, 0);
      }
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(-1.1, 0, 0);
        rightLegRef.current.rotation.set(-1.1, 0, 0);
      }
      if (handbagRef.current) {
        handbagRef.current.visible = false;
      }
    } else {
      // Standing idle pose
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.95 + Math.sin(t * 2.5) * 0.015;
        torsoRef.current.rotation.set(0, 0, 0);
      }

      if (isFemale) {
        // Female standing pose (Image 2): chic stance, left hand carrying white handbag, right hand relaxed/tucked
        if (leftArmRef.current) {
          leftArmRef.current.rotation.set(0.08, 0, 0.06);
        }
        if (rightArmRef.current) {
          rightArmRef.current.rotation.set(-0.25, 0.2, -0.12); // relaxed near coat pocket
        }
        if (handbagRef.current) {
          handbagRef.current.visible = true;
          handbagRef.current.rotation.z = Math.sin(t * 2.5) * 0.03;
        }
      } else {
        // Male standing pose (Image 1): casual stance with right hand holding smartphone to ear!
        if (rightArmRef.current) {
          rightArmRef.current.rotation.set(1.45, -0.42, 0.25);
        }
        if (leftArmRef.current) {
          leftArmRef.current.rotation.set(0.1, 0, -0.08);
        }
      }

      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.set(0, 0, 0);
        rightLegRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  return (
    <group>
      {/* Torso & Upper Body */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        {/* MALE MODEL (Image 1: Dusty Mauve Oversized Sweatshirt) */}
        {!isFemale && (
          <group>
            {/* Oversized Sweatshirt Main Torso */}
            <mesh castShadow position={[0, 0.36, 0]}>
              <boxGeometry args={[0.56, 0.68, 0.34]} />
              <meshStandardMaterial color={maleSweatshirtColor} roughness={0.7} />
            </mesh>

            {/* Ribbed Hem Bottom Band */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.52, 0.08, 0.32]} />
              <meshStandardMaterial color={maleRibbingColor} roughness={0.8} />
            </mesh>

            {/* Ribbed Crewneck Collar */}
            <mesh position={[0, 0.71, 0.02]}>
              <cylinderGeometry args={[0.13, 0.15, 0.06, 16]} />
              <meshStandardMaterial color={maleRibbingColor} />
            </mesh>

            {/* Utility Flap Pocket on Left Chest/Torso */}
            <mesh position={[-0.16, 0.38, 0.18]}>
              <boxGeometry args={[0.12, 0.14, 0.02]} />
              <meshStandardMaterial color={maleRibbingColor} />
            </mesh>
            {/* Pocket Flap */}
            <mesh position={[-0.16, 0.46, 0.19]}>
              <boxGeometry args={[0.13, 0.03, 0.025]} />
              <meshStandardMaterial color={maleSweatshirtColor} />
            </mesh>
          </group>
        )}

        {/* FEMALE MODEL (Image 2: Camel Trench Coat over Navy Turtleneck) */}
        {isFemale && (
          <group>
            {/* Inner Dark Navy/Charcoal Turtleneck */}
            <mesh position={[0, 0.42, 0.02]}>
              <boxGeometry args={[0.34, 0.62, 0.24]} />
              <meshStandardMaterial color={femaleTurtleneckColor} roughness={0.6} />
            </mesh>
            {/* High Turtleneck Collar */}
            <mesh position={[0, 0.74, 0.02]}>
              <cylinderGeometry args={[0.11, 0.12, 0.12, 16]} />
              <meshStandardMaterial color={femaleTurtleneckColor} />
            </mesh>

            {/* Camel Trench Coat Outer Body */}
            <mesh castShadow position={[0, 0.34, -0.02]}>
              <boxGeometry args={[0.52, 0.7, 0.32]} />
              <meshStandardMaterial color={femaleCoatColor} roughness={0.6} />
            </mesh>

            {/* Coat Long Lapels (Left & Right) */}
            <mesh position={[-0.16, 0.42, 0.16]} rotation={[0, 0.15, -0.08]}>
              <boxGeometry args={[0.11, 0.45, 0.02]} />
              <meshStandardMaterial color={femaleCoatColor} />
            </mesh>
            <mesh position={[0.16, 0.42, 0.16]} rotation={[0, -0.15, 0.08]}>
              <boxGeometry args={[0.11, 0.45, 0.02]} />
              <meshStandardMaterial color={femaleCoatColor} />
            </mesh>

            {/* Knee-Length Coat Skirt Extends Down past waist */}
            <mesh position={[0, -0.15, -0.01]} castShadow>
              <boxGeometry args={[0.54, 0.48, 0.34]} />
              <meshStandardMaterial color={femaleCoatColor} roughness={0.6} />
            </mesh>

            {/* Coat Belt with Brass Buckle */}
            <mesh position={[0, 0.06, 0.02]}>
              <boxGeometry args={[0.53, 0.06, 0.33]} />
              <meshStandardMaterial color={femaleCoatColor} />
            </mesh>
            <mesh position={[0, 0.06, 0.18]}>
              <boxGeometry args={[0.07, 0.06, 0.02]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* HEAD ASSEMBLY */}
        <group ref={headRef} position={[0, 0.82, 0]}>
          {/* Face Mesh */}
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.28, 0.26]} />
            <meshStandardMaterial
              color={isFemale ? femaleSkinTone : maleSkinTone}
              roughness={0.6}
            />
          </mesh>

          {/* Facial Features (Eyes & Brows) */}
          <mesh position={[-0.06, 0.02, 0.135]}>
            <boxGeometry args={[0.035, 0.025, 0.01]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.06, 0.02, 0.135]}>
            <boxGeometry args={[0.035, 0.025, 0.01]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>

          {/* MALE HAIRSTYLE (Image 1: Short Dark Textured Crop) */}
          {!isFemale && (
            <group position={[0, 0.08, 0]}>
              {/* Hair Top */}
              <mesh position={[0, 0.08, -0.02]} castShadow>
                <boxGeometry args={[0.28, 0.14, 0.28]} />
                <meshStandardMaterial color={maleHairColor} roughness={0.6} />
              </mesh>
              {/* Fringe / Front Texture */}
              <mesh position={[0, 0.09, 0.1]}>
                <boxGeometry args={[0.24, 0.07, 0.08]} />
                <meshStandardMaterial color={maleHairColor} />
              </mesh>
              {/* Tapered Back & Sides */}
              <mesh position={[0, 0.01, -0.12]}>
                <boxGeometry args={[0.27, 0.12, 0.06]} />
                <meshStandardMaterial color={maleHairColor} />
              </mesh>
            </group>
          )}

          {/* FEMALE HAIRSTYLE (Image 2: Medium Chocolate Brown Hair with Bangs) */}
          {isFemale && (
            <group position={[0, 0.06, 0]}>
              {/* Hair Cap Top */}
              <mesh position={[0, 0.1, -0.01]} castShadow>
                <boxGeometry args={[0.29, 0.14, 0.29]} />
                <meshStandardMaterial color={femaleHairColor} roughness={0.5} />
              </mesh>
              {/* Front Straight Bangs / Fringe */}
              <mesh position={[0, 0.08, 0.13]}>
                <boxGeometry args={[0.24, 0.08, 0.04]} />
                <meshStandardMaterial color={femaleHairColor} />
              </mesh>
              {/* Side Locks Falling past shoulders */}
              <mesh position={[-0.14, -0.14, 0.02]}>
                <boxGeometry args={[0.05, 0.38, 0.22]} />
                <meshStandardMaterial color={femaleHairColor} />
              </mesh>
              <mesh position={[0.14, -0.14, 0.02]}>
                <boxGeometry args={[0.05, 0.38, 0.22]} />
                <meshStandardMaterial color={femaleHairColor} />
              </mesh>
              {/* Back Hair Length */}
              <mesh position={[0, -0.16, -0.12]} castShadow>
                <boxGeometry args={[0.28, 0.42, 0.08]} />
                <meshStandardMaterial color={femaleHairColor} roughness={0.5} />
              </mesh>
            </group>
          )}
        </group>

        {/* LEFT ARM */}
        <group ref={leftArmRef} position={[isFemale ? -0.32 : -0.36, 0.58, 0]}>
          {/* Sleeve */}
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry
              args={[
                isFemale ? 0.13 : 0.16, // Male has relaxed oversized sleeve
                0.52,
                isFemale ? 0.14 : 0.16,
              ]}
            />
            <meshStandardMaterial
              color={isFemale ? femaleCoatColor : maleSweatshirtColor}
              roughness={0.6}
            />
          </mesh>

          {/* Left Hand */}
          <mesh position={[0, -0.53, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial
              color={isFemale ? femaleSkinTone : maleSkinTone}
            />
          </mesh>

          {/* FEMALE CHIC WHITE HANDBAG / TOTE (Image 2) */}
          {isFemale && (
            <group ref={handbagRef} position={[0, -0.68, 0.06]}>
              {/* Bag Body (White leather structured tote) */}
              <mesh castShadow>
                <boxGeometry args={[0.18, 0.22, 0.14]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
              </mesh>
              {/* Bag Flap Closure */}
              <mesh position={[0, 0.04, 0.08]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.16, 0.12, 0.02]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              {/* Gold Clasp / Ring */}
              <mesh position={[0, 0.01, 0.09]}>
                <torusGeometry args={[0.02, 0.005, 8, 16]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.9} />
              </mesh>
              {/* Bag Top Handle */}
              <mesh position={[0, 0.16, 0]}>
                <torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          )}
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArmRef} position={[isFemale ? 0.32 : 0.36, 0.58, 0]}>
          {/* Sleeve */}
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry
              args={[
                isFemale ? 0.13 : 0.16,
                0.52,
                isFemale ? 0.14 : 0.16,
              ]}
            />
            <meshStandardMaterial
              color={isFemale ? femaleCoatColor : maleSweatshirtColor}
              roughness={0.6}
            />
          </mesh>

          {/* Right Hand */}
          <mesh position={[0, -0.53, 0]}>
            <boxGeometry args={[0.08, 0.1, 0.08]} />
            <meshStandardMaterial
              color={isFemale ? femaleSkinTone : maleSkinTone}
            />
          </mesh>

          {/* MALE SMARTPHONE TO EAR (Image 1: Black Phone Held in Right Hand) */}
          {!isFemale && (
            <mesh position={[0.02, -0.52, 0.04]} rotation={[0, 0.2, 0]}>
              <boxGeometry args={[0.06, 0.12, 0.015]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>
      </group>

      {/* LEFT LEG */}
      <group ref={leftLegRef} position={[-0.14, 0.88, 0]}>
        {/* Trousers / Chinos / Jeans */}
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry
            args={[
              isFemale ? 0.15 : 0.17,
              0.68,
              isFemale ? 0.16 : 0.18,
            ]}
          />
          <meshStandardMaterial
            color={isFemale ? femaleJeansColor : maleChinosColor}
            roughness={0.8}
          />
        </mesh>

        {/* Rolled Cuff (Female Jeans) / Ankle Hem */}
        {isFemale ? (
          <group position={[0, -0.68, 0]}>
            {/* Rolled Denim Hem */}
            <mesh>
              <boxGeometry args={[0.16, 0.05, 0.17]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {/* Camel Suede Ankle Boot with Block Heel (Image 2) */}
            <mesh position={[0, -0.08, 0.04]} castShadow>
              <boxGeometry args={[0.14, 0.14, 0.24]} />
              <meshStandardMaterial color={femaleBootColor} roughness={0.7} />
            </mesh>
            {/* Boot Heel */}
            <mesh position={[0, -0.13, -0.04]}>
              <boxGeometry args={[0.12, 0.06, 0.06]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          </group>
        ) : (
          <group position={[0, -0.68, 0]}>
            {/* White Ankle Sock */}
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.14, 0.06, 0.16]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            {/* White Low-Top Sneaker (Image 1) */}
            <mesh position={[0, -0.08, 0.05]} castShadow>
              <boxGeometry args={[0.16, 0.11, 0.27]} />
              <meshStandardMaterial color={maleShoeColor} roughness={0.3} />
            </mesh>
            {/* Sneaker Sole */}
            <mesh position={[0, -0.13, 0.05]}>
              <boxGeometry args={[0.165, 0.03, 0.28]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </group>
        )}
      </group>

      {/* RIGHT LEG */}
      <group ref={rightLegRef} position={[0.14, 0.88, 0]}>
        {/* Trousers / Chinos / Jeans */}
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry
            args={[
              isFemale ? 0.15 : 0.17,
              0.68,
              isFemale ? 0.16 : 0.18,
            ]}
          />
          <meshStandardMaterial
            color={isFemale ? femaleJeansColor : maleChinosColor}
            roughness={0.8}
          />
        </mesh>

        {isFemale ? (
          <group position={[0, -0.68, 0]}>
            <mesh>
              <boxGeometry args={[0.16, 0.05, 0.17]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[0, -0.08, 0.04]} castShadow>
              <boxGeometry args={[0.14, 0.14, 0.24]} />
              <meshStandardMaterial color={femaleBootColor} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.13, -0.04]}>
              <boxGeometry args={[0.12, 0.06, 0.06]} />
              <meshStandardMaterial color="#451a03" />
            </mesh>
          </group>
        ) : (
          <group position={[0, -0.68, 0]}>
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.14, 0.06, 0.16]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, -0.08, 0.05]} castShadow>
              <boxGeometry args={[0.16, 0.11, 0.27]} />
              <meshStandardMaterial color={maleShoeColor} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.13, 0.05]}>
              <boxGeometry args={[0.165, 0.03, 0.28]} />
              <meshStandardMaterial color="#e2e8f0" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
