# 🚗 3D Interactive "Experience Journey" Section

An interactive 3D career timeline built with **React**, **Three.js / React Three Fiber (`@react-three/fiber`)**, **`@react-three/drei`**, **GSAP ScrollTrigger**, and **Tailwind CSS**.

As the user scrolls down through the portfolio, a stylized 3D low-poly sports car navigates along an asphalt road spline through rolling terrain. The road features milestone **Bus Stops / Stations**, each corresponding to a career role. When the car reaches each stop, the journey slows down slightly and reveals an interactive detail card with role info, metrics, highlights, and tech stack tags.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies (already installed in workspace)
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🏗️ Architecture & Component Breakdown

```
src/
├── types/
│   └── experience.ts               # Type definitions for Experience items and Camera modes
├── data/
│   └── experiences.ts              # Career milestones data (progress 0.16, 0.44, 0.72, 0.93)
├── utils/
│   ├── roadCurve.ts                # CatmullRomCurve3 3D spline & ribbon geometry generator
│   └── soundEffects.ts             # Web Audio API engine purr and milestone chimes
├── components/
│   ├── ExperienceJourney/
│   │   ├── ExperienceJourney.tsx   # Canvas wrapper with GSAP ScrollTrigger pinning & milestone snapping
│   │   ├── Scene3D.tsx             # R3F scene manager, lighting, dynamic chase camera & car physics
│   │   ├── Car.tsx                 # Stylized 3D low-poly car with spinning wheels, steering & neon lights
│   │   ├── BusStop.tsx             # 3D bus shelter with frosted glass, bench, glowing totem & Drei <Html>
│   │   ├── SplineRoad.tsx          # Custom asphalt road ribbon geometry with curbs & terrain
│   │   ├── SceneryProps.tsx        # Instanced meshes for trees, boulders & street lamps (low draw calls)
│   │   ├── ExperienceHUD.tsx       # Synchronized fixed 2D glassmorphism detail card overlay
│   │   ├── JourneyControls.tsx     # Floating dock: scrub bar, auto-cruise, camera views & audio
│   │   └── FallbackTimeline.tsx    # Accessible 2D fallback timeline for low-power devices
│   └── UI/
│       ├── Navbar.tsx              # Floating header navigation
│       ├── HeroSection.tsx         # Portfolio hero introduction with scroll-to-journey CTA
│       └── OutroSection.tsx        # Contact & transmission section
├── App.tsx                         # Main page assembling all sections
├── index.css                       # Tailwind CSS directives & glassmorphism utilities
└── main.tsx                        # React DOM root
```

---

## 🎯 Key Functional Features

1. **Scroll Synchronization**:
   - Pinned canvas across a `350vh` scroll track using GSAP `ScrollTrigger`.
   - Progress normalized from $0 \to 1$ to sample 3D positions and forward tangents from `THREE.CatmullRomCurve3`.
   - Car dynamically aligns with its forward vector (`rotation.y = Math.atan2(tangent.x, tangent.z)`).
   - Dynamic wheel rotation based on car velocity, and front wheels steer into road curvature.

2. **Milestone Bus Stops**:
   - 3D bus stop structures placed along the curve at exact milestone fractions (e.g. 16%, 44%, 72%, 93%).
   - Frosted glass shelters, passenger benches, station totems with station numbers, and glowing ground waypoint rings.
   - Non-linear scroll easing / magnetic dwell slows down the car when passing each bus stop.

3. **Synchronized Experience Popups**:
   - Rich glassmorphism cards showing **Job Title**, **Company**, **Period**, **Location**, **Key Metrics**, **Accomplishments**, and **Tech Stack**.
   - Supports both **Fixed 2D HUD Overlay** and **Drei `<Html>` 3D In-World World Space Popups** (switchable via the sparkle button in the controls).
   - Clean forward/backward toggling with zero flickering.

4. **Visuals & High Performance**:
   - Low draw-call batching: repeated scenery elements (100+ trees, rocks, streetlights) use `<Instances>` and `<Instance>`.
   - Dynamic cinematic chase camera with smooth lerping, plus alternative camera views (Sport Cockpit, Isometric Top-Down, and Free 360° Orbit).
   - Procedural Web Audio API engine sound that modulates pitch with car speed, plus melodic milestone chimes.
   - Accessible 2D timeline fallback button for low-power devices or screen readers.
