import { SkillCategory } from '../types/portfolio';

export const SKILL_GATES: SkillCategory[] = [
  {
    id: 'gate-frontend',
    gateNumber: 1,
    gateName: 'TOLL 01 // SPATIAL & UI',
    category: 'Spatial UI & Creative Web',
    progress: 0.24,
    accentColor: '#38bdf8', // Neon Cyan
    iconName: 'Layout',
    description: 'Immersive browser experiences, procedural canvas shaders, and micro-interaction design systems.',
    skills: [
      { name: 'React 18 / 19', level: 96, tag: 'Core' },
      { name: 'Three.js / R3F', level: 94, tag: '3D Web' },
      { name: 'TypeScript', level: 95, tag: 'Strict' },
      { name: 'GLSL Shaders', level: 86, tag: 'VFX' },
      { name: 'Tailwind CSS', level: 98, tag: 'Design' },
      { name: 'GSAP / Motion', level: 92, tag: 'Physics' },
    ],
  },
  {
    id: 'gate-backend',
    gateNumber: 2,
    gateName: 'TOLL 02 // DISTRIBUTED CORE',
    category: 'Backend & Cloud Infrastructure',
    progress: 0.31,
    accentColor: '#a855f7', // Cyber Purple
    iconName: 'Server',
    description: 'Resilient event-driven microservices, high-throughput APIs, and relational/cache architectures.',
    skills: [
      { name: 'Node.js / Express', level: 94, tag: 'Runtime' },
      { name: 'Go (Golang)', level: 85, tag: 'High-Perf' },
      { name: 'PostgreSQL', level: 90, tag: 'DB' },
      { name: 'Redis', level: 88, tag: 'Cache' },
      { name: 'GraphQL / gRPC', level: 86, tag: 'Protocols' },
      { name: 'Kafka / PubSub', level: 82, tag: 'Streams' },
    ],
  },
  {
    id: 'gate-systems',
    gateNumber: 3,
    gateName: 'TOLL 03 // SYSTEMS & COMPUTE',
    category: 'Low-Level Systems & Graphics',
    progress: 0.38,
    accentColor: '#10b981', // Emerald Matrix
    iconName: 'Cpu',
    description: 'Hardware-accelerated compute shaders, memory optimization, and WebAssembly compilation.',
    skills: [
      { name: 'Rust & Wasm', level: 84, tag: 'Systems' },
      { name: 'WebGPU API', level: 82, tag: 'Next-Gen' },
      { name: 'C++ Basics', level: 78, tag: 'Native' },
      { name: 'Multi-threading', level: 86, tag: 'Workers' },
      { name: 'GPU Instancing', level: 92, tag: 'Optimization' },
      { name: 'Linear Algebra', level: 88, tag: 'Math' },
    ],
  },
  {
    id: 'gate-devops',
    gateNumber: 4,
    gateName: 'TOLL 04 // PLATFORM & AI',
    category: 'DevOps, Toolchains & AI Integration',
    progress: 0.45,
    accentColor: '#f59e0b', // Amber Laser
    iconName: 'Terminal',
    description: 'Automated CI/CD release pipelines, container orchestration, and neural inference workflows.',
    skills: [
      { name: 'Docker / K8s', level: 88, tag: 'Containers' },
      { name: 'CI/CD Pipelines', level: 92, tag: 'Automation' },
      { name: 'AWS / Cloudflare', level: 86, tag: 'Edge' },
      { name: 'PyTorch / ONNX', level: 80, tag: 'ML/AI' },
      { name: 'Linux Kernel/Bash', level: 90, tag: 'OS' },
      { name: 'Vite / Rollup', level: 95, tag: 'Bundlers' },
    ],
  },
];

