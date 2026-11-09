import React from 'react';
import * as THREE from 'three';
import { AvatarModel } from './AvatarModel';
import { Bicycle } from './Bicycle';
import { Car } from '../ExperienceJourney/Car';
import { AvatarGender, LocomotionMode } from '../../types/testsprite';

interface PlayerRigProps {
  gender: AvatarGender;
  locomotion: LocomotionMode;
  position: THREE.Vector3;
  rotationY: number;
  speed: number;
  steeringAngle?: number;
  outfitColor?: string;
  hairColor?: string;
}

export const PlayerRig: React.FC<PlayerRigProps> = ({
  gender,
  locomotion,
  position,
  rotationY,
  speed,
  steeringAngle = 0,
  outfitColor,
  hairColor,
}) => {
  if (locomotion === 'bicycle') {
    return (
      <Bicycle
        gender={gender}
        position={position}
        rotationY={rotationY}
        speed={speed}
        steeringAngle={steeringAngle}
        outfitColor={outfitColor}
        hairColor={hairColor}
      />
    );
  }

  if (locomotion === 'car') {
    return (
      <group position={position} rotation={[0, rotationY, 0]}>
        <Car
          position={new THREE.Vector3(0, 0, 0)}
          rotationY={0}
          speed={speed}
          steeringAngle={steeringAngle}
          isIgnited={true}
        />
        {/* Visible Avatar seated inside car cockpit */}
        <group position={[-0.35, 0.35, 0.1]} scale={[0.82, 0.82, 0.82]}>
          <AvatarModel
            gender={gender}
            pose="driving"
            speed={speed}
            outfitColor={outfitColor}
            hairColor={hairColor}
          />
        </group>
      </group>
    );
  }

  // Locomotion: On Foot
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <AvatarModel
        gender={gender}
        pose="walking"
        speed={speed}
        outfitColor={outfitColor}
        hairColor={hairColor}
      />
    </group>
  );
};

