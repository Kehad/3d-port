import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerRig } from '../Characters/PlayerRig';
import { SplineRoad } from '../ExperienceJourney/SplineRoad';
import { SceneryProps } from '../ExperienceJourney/SceneryProps';
import { HeroMansion } from '../Mansions/HeroMansion';
import { SkillsMansion } from '../Mansions/SkillsMansion';
import { ExperienceMansion } from '../Mansions/ExperienceMansion';
import { ProjectMansion } from '../Mansions/ProjectMansion';
import { MansionEntranceZone } from '../Mansions/MansionEntranceZone';
import { MANSION_WAYPOINTS } from '../../data/mansionsData';
import { getCurveTransform } from '../../utils/roadCurve';
import { AvatarGender, LocomotionMode, MansionWaypoint } from '../../types/testsprite';
import { VehicleControlsState } from '../../hooks/useVehicleControls';
import { updateEnginePitch } from '../../utils/soundEffects';

interface OverworldSceneProps {
  gender: AvatarGender;
  locomotion: LocomotionMode;
  outfitColor?: string;
  hairColor?: string;
  controls: VehicleControlsState;
  progress: number;
  onUpdateProgress: (newProgress: number) => void;
  onEnterMansion: (waypoint: MansionWaypoint) => void;
  onReportTelemetry: (pos: THREE.Vector3, speed: number) => void;
  onNearbyMansionChange?: (waypoint: MansionWaypoint | null) => void;
}

export const OverworldScene: React.FC<OverworldSceneProps> = ({
  gender,
  locomotion,
  outfitColor,
  hairColor,
  controls,
  progress,
  onUpdateProgress,
  onEnterMansion,
  onReportTelemetry,
  onNearbyMansionChange,
}) => {
  const { camera } = useThree();

  const velocityRef = useRef(0);
  const laneOffsetRef = useRef(0);
  const steerAngleRef = useRef(0);
  const smoothedLookTargetRef = useRef(new THREE.Vector3(0, 0, -220));
  const lastNearbyRef = useRef<MansionWaypoint | null>(null);
  const enterCooldownRef = useRef(false);

  const totalCurveLength = 720;

  useFrame((state, delta) => {
    // Locomotion physics parameters
    const isFoot = locomotion === 'foot';
    const isBike = locomotion === 'bicycle';

    const accel = isFoot ? 9 : isBike ? 20 : 22;
    const maxSpeed = isFoot ? 6.0 : isBike ? 18.0 : 34.0;
    const brakeForce = isFoot ? 18 : isBike ? 28 : 34;
    const friction = isFoot ? 14 : isBike ? 6.5 : 4.5;
    const steerSpeed = isFoot ? 3.0 : isBike ? 4.8 : 4.2;

    let v = velocityRef.current;

    // Up / Accelerate
    if (controls.up) {
      v += accel * delta;
      if (v > maxSpeed) v = maxSpeed;
    }
    // Down / Brake or Reverse
    else if (controls.down) {
      if (v > 0.4) {
        v -= brakeForce * delta;
        if (v < 0) v = 0;
      } else {
        v -= accel * 0.4 * delta;
        if (v < -4.0) v = -4.0;
      }
    }
    // Coasting friction
    else {
      if (Math.abs(v) > 0.05) {
        v = Math.sign(v) * Math.max(0, Math.abs(v) - friction * delta);
      } else {
        v = 0;
      }
    }
    velocityRef.current = v;

    // Steer Left / Right
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

    // Clamp lane within road width
    laneOffsetRef.current = THREE.MathUtils.clamp(laneOffsetRef.current, -2.1, 2.1);

    // Update progress along spline
    if (Math.abs(v) > 0.0001) {
      const deltaT = (v * delta) / totalCurveLength;
      const nextProgress = THREE.MathUtils.clamp(progress + deltaT, 0, 0.999);
      onUpdateProgress(nextProgress);
    }

    if (locomotion === 'car') {
      updateEnginePitch(v / maxSpeed);
    }

    // Compute player world position
    const currentTransform = getCurveTransform(progress);
    const playerPos = currentTransform.position.clone();
    playerPos.addScaledVector(currentTransform.binormal, laneOffsetRef.current);
    playerPos.y += isFoot ? 0.0 : isBike ? 0.0 : 0.04;

    onReportTelemetry(playerPos, v / maxSpeed);

    // Check proximity to landmarks for HUD prompt and interaction
    let closestWp: MansionWaypoint | null = null;
    let minDist = 18.0;
    for (const wp of MANSION_WAYPOINTS) {
      const ePos = new THREE.Vector3(...wp.coordinates);
      const d = playerPos.distanceTo(ePos);
      const isNearProgress = Math.abs(progress - wp.progress) < 0.045;
      if (d < minDist || isNearProgress) {
        if (d < minDist) {
          minDist = d;
        }
        closestWp = wp;
      }
    }

    if (closestWp?.id !== lastNearbyRef.current?.id) {
      lastNearbyRef.current = closestWp;
      onNearbyMansionChange?.(closestWp);
    }

    if (controls.action && closestWp && !enterCooldownRef.current) {
      enterCooldownRef.current = true;
      onEnterMansion(closestWp);
      setTimeout(() => {
        enterCooldownRef.current = false;
      }, 1000);
    }

    // Third-person smooth camera follow
    const targetCamPos = new THREE.Vector3();
    const lookTarget = new THREE.Vector3();

    const backDist = isFoot ? 6.2 : isBike ? 8.2 : 10.5;
    const height = isFoot ? 2.6 : isBike ? 3.6 : 4.6;
    const sideOffset = laneOffsetRef.current * 0.35;

    targetCamPos.copy(playerPos)
      .addScaledVector(currentTransform.tangent, -backDist)
      .addScaledVector(currentTransform.binormal, -sideOffset);
    targetCamPos.y = playerPos.y + height;

    lookTarget.copy(playerPos).addScaledVector(currentTransform.tangent, 7.5);
    lookTarget.y = playerPos.y + (isFoot ? 1.2 : 0.9);

    camera.position.lerp(targetCamPos, 0.09);
    smoothedLookTargetRef.current.lerp(lookTarget, 0.12);
    camera.lookAt(smoothedLookTargetRef.current);
  });

  const currentTransform = getCurveTransform(progress);
  const playerPos = currentTransform.position.clone();
  playerPos.addScaledVector(currentTransform.binormal, laneOffsetRef.current);
  playerPos.y += locomotion === 'foot' ? 0.0 : 0.04;

  const playerRotationY = currentTransform.rotationY + steerAngleRef.current * 0.25;

  return (
    <>
      {/* Daylight Atmosphere & Lighting */}
      <fog attach="fog" args={['#dbeafe', 60, 380]} />
      <color attach="background" args={['#bae6fd']} />

      <ambientLight intensity={0.75} color="#f8fafc" />
      <hemisphereLight args={['#93c5fd', '#3f6212', 0.85]} position={[0, 80, 0]} />

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

      {/* OVERWORLD ROADWAY & TERRAIN */}
      <SplineRoad />
      <SceneryProps />

      {/* THE 4 LANDMARK MANSIONS ALONG THE ROUTE */}
      <HeroMansion waypoint={MANSION_WAYPOINTS[0]} />
      <SkillsMansion waypoint={MANSION_WAYPOINTS[1]} />
      <ExperienceMansion waypoint={MANSION_WAYPOINTS[2]} />
      <ProjectMansion waypoint={MANSION_WAYPOINTS[3]} />

      {/* MANSION ENTRANCE ACTION ZONES */}
      {MANSION_WAYPOINTS.map((wp) => (
        <MansionEntranceZone
          key={wp.id}
          waypoint={wp}
          playerPos={playerPos}
          progress={progress}
          onEnter={() => onEnterMansion(wp)}
        />
      ))}

      {/* PLAYER AVATAR & SELECTED LOCOMOTION VEHICLE */}
      <PlayerRig
        gender={gender}
        locomotion={locomotion}
        position={playerPos}
        rotationY={playerRotationY}
        speed={velocityRef.current / (locomotion === 'foot' ? 6.0 : locomotion === 'bicycle' ? 18.0 : 34.0)}
        steeringAngle={steerAngleRef.current}
        outfitColor={outfitColor}
        hairColor={hairColor}
      />
    </>
  );
};
