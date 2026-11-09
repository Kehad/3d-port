export type AvatarGender = 'male' | 'female';
export type LocomotionMode = 'foot' | 'bicycle' | 'car';
export type MansionId = 'hero' | 'skills' | 'experience' | 'projects';

export type AppPhase = 'onboarding' | 'mounting' | 'overworld' | 'entering' | 'interior' | 'exiting';

export interface MansionWaypoint {
  id: MansionId;
  name: string;
  tagline: string;
  roomName: string;
  progress: number; // 0 to 1 position along road curve
  side: 'left' | 'right';
  themeColor: string;
  accentColor: string;
  coordinates: [number, number, number];
  buildingCoordinates?: [number, number, number];
}

export interface PlayerCustomization {
  gender: AvatarGender;
  locomotion: LocomotionMode;
  outfitColor: string;
  hairColor: string;
}

