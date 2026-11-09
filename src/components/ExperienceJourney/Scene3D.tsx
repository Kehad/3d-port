import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Car } from './Car';
import { Motorcycle } from './Motorcycle';
import { Walker } from './Walker';
import { SplineRoad } from './SplineRoad';
import { SceneryProps } from './SceneryProps';
import { BusStop } from './BusStop';
import { HeroStartingZone3D } from '../Environments/HeroStartingZone3D';
import { SkillsZone } from '../Environments/SkillsZone';
import { ProjectsShowroomZone } from '../Environments/ProjectsShowroomZone';
import { EXPERIENCES } from '../../data/experiences';
import { getCurveTransform } from '../../utils/roadCurve';
import type { ExperienceItem, CameraMode } from '../../types/experience';
import type { SkillCategory, ProjectItem, TravelMode } from '../../types/portfolio';
import type { VehicleControlsState } from '../../hooks/useVehicleControls';
import { updateEnginePitch } from '../../utils/soundEffects';

interface Scene3DProps {
  progress: number;
  onUpdateProgress?: (newProgress: number) => void;
  travelMode?: TravelMode;
  onSelectMode?: (mode: TravelMode) => void;
  controls?: VehicleControlsState;
  activeExperience: ExperienceItem | null;
  onSelectExperience: (exp: ExperienceItem) => void;
  activeSkillGate?: SkillCategory | null;
  onSelectSkillGate?: (gate: SkillCategory) => void;
  activeProject?: ProjectItem | null;
  onSelectProject?: (proj: ProjectItem) => void;
  cameraMode: CameraMode;
  showWorldCard?: boolean;
  onReportCarCoords?: (coords: { x: number; y: number; z: number }, speed: number) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  progress,
  onUpdateProgress = () => {},
  travelMode = 'car',
  onSelectMode = () => {},
  controls = { up: false, down: false, left: false, right: false },
  activeExperience,
  onSelectExperience,
  activeSkillGate = null,
  onSelectSkillGate = () => {},
  activeProject = null,
  onSelectProject = () => {},
  cameraMode,
  showWorldCard = true,
  onReportCarCoords,
}) => {
  const { camera } = useThree();

  // Physics state
  const velocityRef = useRef(0);
  const laneOffsetRef = useRef(0);
  const steerAngleRef = useRef(0);
  const smoothedLookTargetRef = useRef(new THREE.Vector3(0, 0, -225));

  const totalCurveLength = 720; // approximate world length of curve in units

  useFrame((state, delta) => {
    // 1. Realistic movement physics based on arrow keys
    const isWalk = travelMode === 'walk';
    const isBike = travelMode === 'motorcycle';

    const accel = isWalk ? 10 : isBike ? 26 : 20;
    const maxSpeed = isWalk ? 6.5 : isBike ? 38 : 32; // units/s
    const brakeForce = isWalk ? 16 : isBike ? 38 : 32;
    const friction = isWalk ? 12 : isBike ? 5.5 : 4.5;
    const steerSpeed = isWalk ? 3.2 : isBike ? 5.2 : 4.5;

    let v = velocityRef.current;

    // Arrow Up: Accelerate Forward
    if (controls.up) {
      v += accel * delta;
      if (v > maxSpeed) v = maxSpeed;
    }
    // Arrow Down: Brake or Reverse
    else if (controls.down) {
      if (v > 0.4) {
        v -= brakeForce * delta;
        if (v < 0) v = 0;
      } else {
        // Slow reverse
        v -= accel * 0.4 * delta;
        if (v < -4.0) v = -4.0;
      }
    }
    // Coasting deceleration / natural rolling resistance
    else {
      if (Math.abs(v) > 0.05) {
        v = Math.sign(v) * Math.max(0, Math.abs(v) - friction * delta);
      } else {
        v = 0;
      }
    }
    velocityRef.current = v;

    // Lateral Steering: Arrow Left & Arrow Right
    let steerTarget = 0;
    if (controls.left) {
      laneOffsetRef.current -= steerSpeed * delta;
      steerTarget = -0.38;
    }
    if (controls.right) {
      laneOffsetRef.current += steerSpeed * delta;
      steerTarget = 0.38;
    }
    steerAngleRef.current = THREE.MathUtils.lerp(
      steerAngleRef.current,
      steerTarget,
      0.18
    );

    // Keep vehicle safely within the asphalt road width
    laneOffsetRef.current = THREE.MathUtils.clamp(laneOffsetRef.current, -2.1, 2.1);

    // 2. Advance progress along the 3D spline
    if (Math.abs(v) > 0.0001) {
      const deltaT = (v * delta) / totalCurveLength;
      const nextProgress = THREE.MathUtils.clamp(progress + deltaT, 0, 0.999);
      onUpdateProgress(nextProgress);
    }

    // Engine Audio Pitch
    if (!isWalk) {
      updateEnginePitch(v / maxSpeed);
    }

    // 3. Compute 3D vehicle position on the road
    const currentTransform = getCurveTransform(progress);
    const vehiclePos = currentTransform.position.clone();
    vehiclePos.addScaledVector(currentTransform.binormal, laneOffsetRef.current);
    vehiclePos.y += isWalk ? 0.0 : 0.04;

    if (onReportCarCoords) {
      onReportCarCoords(
        { x: vehiclePos.x, y: vehiclePos.y, z: vehiclePos.z },
        v / maxSpeed
      );
    }

    if (cameraMode === 'freeOrbit') return;

    // 4. Smooth Realistic Daytime Camera Follow
    const targetCamPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    if (cameraMode === 'cinematic') {
      let backDist = isWalk ? 6.5 : isBike ? 8.5 : 10.5;
      let height = isWalk ? 2.8 : isBike ? 3.8 : 4.8;
      let sideOffset = laneOffsetRef.current * 0.4;

      targetCamPos.copy(vehiclePos)
        .addScaledVector(currentTransform.tangent, -backDist)
        .addScaledVector(currentTransform.binormal, -sideOffset);
      targetCamPos.y = vehiclePos.y + height;

      lookTarget.copy(vehiclePos).addScaledVector(currentTransform.tangent, 7.5);
      lookTarget.y = vehiclePos.y + (isWalk ? 1.2 : 0.9);
    } else if (cameraMode === 'chase') {
      const chaseDist = isWalk ? -4.2 : isBike ? -5.5 : -6.5;
      targetCamPos.copy(vehiclePos).addScaledVector(currentTransform.tangent, chaseDist);
      targetCamPos.y = vehiclePos.y + (isWalk ? 1.8 : 2.4);

      lookTarget.copy(vehiclePos).addScaledVector(currentTransform.tangent, 8.5);
      lookTarget.y = vehiclePos.y + (isWalk ? 1.2 : 0.9);
    } else if (cameraMode === 'topDown') {
      targetCamPos.copy(vehiclePos);
      targetCamPos.y = vehiclePos.y + 24;
      targetCamPos.z -= 8;

      lookTarget.copy(vehiclePos);
    }

    camera.position.lerp(targetCamPos, 0.09);
    smoothedLookTargetRef.current.lerp(lookTarget, 0.12);
    camera.lookAt(smoothedLookTargetRef.current);
  });

  const currentTransform = getCurveTransform(progress);
  const vehiclePos = currentTransform.position.clone();
  vehiclePos.addScaledVector(currentTransform.binormal, laneOffsetRef.current);
  vehiclePos.y += travelMode === 'walk' ? 0.0 : 0.04;

  const vehicleRotationY = currentTransform.rotationY + steerAngleRef.current * 0.25;

  return (
    <>
      {/* REALISTIC DAYTIME ATMOSPHERE & LIGHTING */}
      <fog attach="fog" args={['#dbeafe', 60, 380]} />
      <color attach="background" args={['#bae6fd']} />

      {/* Daylight Ambient Fill */}
      <ambientLight intensity={0.75} color="#f8fafc" />

      {/* Hemisphere Light: Sky Blue from above, Terrain Bounce from below */}
      <hemisphereLight
        args={['#93c5fd', '#3f6212', 0.85]}
        position={[0, 80, 0]}
      />

      {/* Main Natural Daylight Sun */}
      <directionalLight
        position={[60, 95, -40]}
        intensity={2.2}
        color="#fffbeb"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={320}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.0004}
      />

      {/* Soft Secondary Daylight Fill */}
      <directionalLight
        position={[-40, 50, 60]}
        intensity={0.65}
        color="#e0f2fe"
      />

      {/* SECTION 1: Starting Highway Launchpad & 3D Selection (100% 3D, Zero DOM) */}
      <HeroStartingZone3D
        currentMode={travelMode}
        onSelectMode={onSelectMode}
        progress={progress}
      />

      {/* SECTION 2: Skills Highway / Overhead Gantries */}
      <SkillsZone
        progress={progress}
        activeSkillGate={activeSkillGate}
        onSelectSkillGate={onSelectSkillGate}
      />

      {/* SECTION 3: Roadside Experience Bus Stops */}
      {EXPERIENCES.map((exp) => (
        <BusStop
          key={exp.id}
          experience={exp}
          isActive={activeExperience?.id === exp.id}
          onSelect={onSelectExperience}
          showWorldCard={showWorldCard}
        />
      ))}

      {/* SECTION 4: The City Showroom / Drive-In Plaza */}
      <ProjectsShowroomZone
        progress={progress}
        activeProject={activeProject}
        onSelectProject={onSelectProject}
      />

      {/* Daytime Highway Ribbon Surface & Meadow Terrain */}
      <SplineRoad />

      {/* Instanced Scenery: Natural Green Trees, Boulders, Streetlamps */}
      <SceneryProps />

      {/* Player Vehicle: Moves using Arrow Keys with Realistic Day Physics */}
      {travelMode === 'car' && (
        <Car
          position={vehiclePos}
          rotationY={vehicleRotationY}
          speed={velocityRef.current / 32}
          steeringAngle={steerAngleRef.current}
          isIgnited={true}
        />
      )}

      {travelMode === 'motorcycle' && (
        <Motorcycle
          position={vehiclePos}
          rotationY={vehicleRotationY}
          speed={velocityRef.current / 38}
          steeringAngle={steerAngleRef.current}
          isIgnited={true}
        />
      )}

      {travelMode === 'walk' && (
        <Walker
          position={vehiclePos}
          rotationY={vehicleRotationY}
          speed={velocityRef.current / 6.5}
          steeringAngle={steerAngleRef.current}
        />
      )}

      {/* Free 360 Orbit Controls if toggled */}
      {cameraMode === 'freeOrbit' && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={3}
          maxDistance={90}
        />
      )}
    </>
  );
};
