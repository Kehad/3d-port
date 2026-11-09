import { MansionWaypoint } from '../types/testsprite';

export const MANSION_WAYPOINTS: MansionWaypoint[] = [
  {
    id: 'hero',
    name: 'Hero Manor',
    tagline: 'Grand Entrance Hall & Private Study',
    roomName: 'Living Room / Study',
    progress: 0.15,
    side: 'right',
    themeColor: '#38bdf8',
    accentColor: '#0284c7',
    coordinates: [6.9, 0.5, -109.3],
    buildingCoordinates: [20.8, 0.5, -114.2],
  },
  {
    id: 'skills',
    name: 'Skills Laboratory',
    tagline: 'High-Tech Workshop & Hardware Lab',
    roomName: 'Interactive Warehouse / Toolboard',
    progress: 0.38,
    side: 'left',
    themeColor: '#a855f7',
    accentColor: '#7e22ce',
    coordinates: [0.8, 2.4, 49.6],
    buildingCoordinates: [-10.1, 2.4, 39.7],
  },
  {
    id: 'experience',
    name: 'Experience Archive',
    tagline: 'Chronological Corridor & Museum Hall',
    roomName: 'Trophy Room / Timeline Gallery',
    progress: 0.65,
    side: 'right',
    themeColor: '#10b981',
    accentColor: '#047857',
    coordinates: [17.3, 3.3, 219.2],
    buildingCoordinates: [29.7, 3.3, 211.0],
  },
  {
    id: 'projects',
    name: 'Projects Pavilion',
    tagline: 'Futuristic Skyline & Exhibition Plaza',
    roomName: 'Digital Exhibition Room',
    progress: 0.88,
    side: 'left',
    themeColor: '#f59e0b',
    accentColor: '#d97706',
    coordinates: [-14.6, 0.3, 387.2],
    buildingCoordinates: [-29.1, 0.3, 390.1],
  },
];

export const HERO_BIO = {
  name: 'Alex Chen',
  headline: 'Full-Stack & Spatial 3D Systems Engineer',
  location: 'San Francisco, CA (Open to Remote / Hybrid)',
  summary:
    'Creative software engineer with 5+ years of experience engineering high-performance WebGL/WebGPU applications, distributed cloud microservices, and interactive spatial interfaces. Passionate about bridging graphical computing, real-time physics, and resilient system architectures.',
  philosophy:
    'Building software at the intersection of game engine performance, web accessibility, and robust full-stack reliability.',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'alex.chen.dev@example.com',
    twitter: 'https://twitter.com',
  },
  resumeUrl: '#resume-download',
  stats: [
    { label: 'Years Experience', value: '5+' },
    { label: 'Production Apps', value: '18+' },
    { label: 'Awwwards / Honors', value: '4x' },
    { label: 'Open Source Stars', value: '1.2K' },
  ],
};

