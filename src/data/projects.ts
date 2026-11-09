import { ProjectItem } from '../types/portfolio';

export const PROJECTS: ProjectItem[] = [
  {
    id: 'proj-hyperdrive',
    bayNumber: 1,
    title: 'HyperDrive XR',
    subtitle: 'Real-time WebGPU Procedural Vehicle Simulator',
    progress: 0.79,
    accentColor: '#38bdf8', // Neon Sky
    hologramType: 'torus',
    description:
      'High-performance browser-based vehicle dynamics simulation with procedural infinite highway generation, volumetric atmospheric lighting, and WebGPU compute particles running at steady 60 FPS on mobile.',
    metrics: [
      { label: 'Render Target', value: 'WebGPU 60fps' },
      { label: 'Concurrent Particles', value: '250,000' },
    ],
    techStack: ['WebGPU', 'Three.js', 'TypeScript', 'GLSL', 'Rapier Physics', 'React'],
    liveUrl: 'https://example.com/hyperdrive',
    githubUrl: 'https://github.com/example/hyperdrive-xr',
  },
  {
    id: 'proj-aethercloud',
    bayNumber: 2,
    title: 'AetherCloud Engine',
    subtitle: 'Distributed Systems Telemetry & 3D Topology Mesh',
    progress: 0.86,
    accentColor: '#a855f7', // Electric Violet
    hologramType: 'cube',
    description:
      'Spatial 3D observability console for distributed Kubernetes clusters. Renders real-time node network topologies, live traffic packet tracing, and automated bottleneck mitigation through an intuitive 3D cluster diagram.',
    metrics: [
      { label: 'Network Throughput', value: '1.2M req/s' },
      { label: 'Mean TT-Mitigate', value: '-68%' },
    ],
    techStack: ['Go', 'gRPC', 'React 18', 'R3F', 'GraphQL', 'Docker', 'TimescaleDB'],
    liveUrl: 'https://example.com/aethercloud',
    githubUrl: 'https://github.com/example/aether-cloud',
  },
  {
    id: 'proj-neuralsplat',
    bayNumber: 3,
    title: 'NeuralSplat 3D',
    subtitle: 'AI Gaussian Splatting & Spatial Reconstruction Studio',
    progress: 0.93,
    accentColor: '#10b981', // Emerald Ray
    hologramType: 'cylinder',
    description:
      'Browser native 3D Gaussian Splatting viewer and progressive radiance field editor. Enables instant radiance field training from video captures with multi-view point cloud synthesis in under 4 minutes.',
    metrics: [
      { label: 'Splat Density', value: '1.8M Splats' },
      { label: 'Web Load Time', value: '1.4s' },
    ],
    techStack: ['Rust / Wasm', 'WebGPU', 'PyTorch', 'Next.js', 'Tailwind', 'Three.js'],
    liveUrl: 'https://example.com/neuralsplat',
    githubUrl: 'https://github.com/example/neural-splat-3d',
  },
];

