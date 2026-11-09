export type ZoneId = 'garage' | 'skills' | 'experience' | 'projects';
export type TravelMode = 'walk' | 'car' | 'motorcycle';

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  code: string;
  range: [number, number]; // [startProgress, endProgress]
  description: string;
}

export interface SkillCategory {
  id: string;
  gateNumber: number;
  gateName: string;
  category: string;
  progress: number;
  accentColor: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    tag?: string;
  }[];
}

export interface ProjectItem {
  id: string;
  bayNumber: number;
  title: string;
  subtitle: string;
  progress: number;
  accentColor: string;
  description: string;
  metrics: { label: string; value: string }[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  hologramType: 'cube' | 'torus' | 'cylinder';
}

