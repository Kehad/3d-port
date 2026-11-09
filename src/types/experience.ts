export interface ExperienceItem {
  id: string;
  stationNumber: number;
  stationName: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Contract' | 'Internship' | 'Lead';
  progress: number; // 0 to 1 position along spline (e.g. 0.15, 0.42, 0.70, 0.92)
  summary: string;
  highlights: string[];
  techStack: string[];
  metrics?: { label: string; value: string }[];
  accentColor: string;
}

export type CameraMode = 'cinematic' | 'chase' | 'topDown' | 'freeOrbit';

