import { ExperienceItem } from '../types/experience';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'stop-1',
    stationNumber: 1,
    stationName: 'Station 01 // Foundations',
    role: 'Frontend & Creative Developer Intern',
    company: 'PixelCraft Studios',
    location: 'San Francisco, CA',
    period: '2020 — 2021',
    type: 'Internship',
    progress: 0.52,
    accentColor: '#38bdf8', // Cyan
    summary:
      'Kickstarted my career crafting interactive landing pages, shaders, and micro-interactions for award-winning digital campaigns.',
    highlights: [
      'Built 15+ high-conversion marketing sites using React, Three.js, and GSAP animations.',
      'Optimized asset loading pipelines, reducing initial bundle payloads by 42%.',
      'Implemented custom GLSL canvas backgrounds featured on Awwwards Site of the Day.',
    ],
    techStack: ['React', 'Three.js', 'GSAP', 'WebGL', 'Tailwind CSS', 'Vite'],
    metrics: [
      { label: 'Awwwards Honored', value: '3x' },
      { label: 'Bundle Reduction', value: '-42%' },
    ],
  },
  {
    id: 'stop-2',
    stationNumber: 2,
    stationName: 'Station 02 // Scale Interchange',
    role: 'Software Engineer — UI & WebGL',
    company: 'Nexus Interactive Labs',
    location: 'New York, NY',
    period: '2021 — 2023',
    type: 'Full-time',
    progress: 0.58,
    accentColor: '#a855f7', // Purple
    summary:
      'Engineered enterprise 3D product configurators and high-throughput real-time visualization dashboards serving millions of active users.',
    highlights: [
      'Architected a modular R3F product customizer generating $2.4M in direct e-commerce pipeline.',
      'Pioneered instanced rendering and level-of-detail (LOD) systems maintaining 60 FPS on mobile.',
      'Collaborated with design & 3D artists to standardize glTF / USDZ compression pipelines via Draco/Meshopt.',
    ],
    techStack: ['React 18', '@react-three/fiber', '@react-three/drei', 'TypeScript', 'GLSL', 'Zustand', 'Docker'],
    metrics: [
      { label: 'Framerate on Mobile', value: '60 FPS' },
      { label: 'Pipeline Revenue', value: '$2.4M' },
    ],
  },
  {
    id: 'stop-3',
    stationNumber: 3,
    stationName: 'Station 03 // Innovation Terminal',
    role: 'Senior Creative Technologist',
    company: 'Aether Digital Systems',
    location: 'Remote / London',
    period: '2023 — 2025',
    type: 'Full-time',
    progress: 0.65,
    accentColor: '#10b981', // Emerald
    summary:
      'Led the web graphics core team, designing spatial web experiences, procedural simulation tools, and design-system-first 3D components.',
    highlights: [
      'Created an internal WebGPU/WebGL framework adopted across 8 cross-functional product squads.',
      'Reduced memory footprint across interactive canvas tabs by 55% via strict buffer disposal hooks.',
      'Mentored 6 junior/mid engineers and established engineering standards for 3D web accessibility.',
    ],
    techStack: ['WebGPU', 'Three.js', 'Next.js', 'Tailwind CSS', 'Blender', 'Node.js', 'Jest'],
    metrics: [
      { label: 'Memory Footprint', value: '-55%' },
      { label: 'Teams Enabled', value: '8 Squads' },
    ],
  },
  {
    id: 'stop-4',
    stationNumber: 4,
    stationName: 'Station 04 // Horizon Hub',
    role: 'Staff Engineer & 3D Architect',
    company: 'Vanguard Meta & AI Platforms',
    location: 'San Francisco, CA',
    period: '2025 — Present',
    type: 'Lead',
    progress: 0.71,
    accentColor: '#f59e0b', // Amber
    summary:
      'Spearheading immersive web architectures, AI-assisted 3D generation toolchains, and high-performance WebXR spatial workflows.',
    highlights: [
      'Directing architectural evolution of real-time browser canvas runtimes supporting 500k+ concurrent sessions.',
      'Integrated real-time neural radiance fields (NeRF/Gaussian Splatting) viewers into standard web viewports.',
      'Keynote speaker at Global WebXR Summit 2025 on high-density instanced 3D performance.',
    ],
    techStack: ['WebGPU', 'React Three Fiber', 'Rust / Wasm', 'Python', 'Tailwind CSS', 'Three.js', 'WebXR'],
    metrics: [
      { label: 'Concurrent Users', value: '500K+' },
      { label: 'Speaker Rating', value: '4.9/5' },
    ],
  },
];
