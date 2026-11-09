import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { OverworldScene } from './components/Overworld/OverworldScene';
import { InteriorScene } from './components/Interiors/InteriorScene';
import { HeroInterior } from './components/Interiors/HeroInterior';
import { SkillsInterior } from './components/Interiors/SkillsInterior';
import { ExperienceInterior } from './components/Interiors/ExperienceInterior';
import { ProjectInterior } from './components/Interiors/ProjectInterior';
import { QuickNavHUD } from './components/UI/QuickNavHUD';
import { MiniMapHUD } from './components/UI/MiniMapHUD';
import { ActionPromptHUD } from './components/UI/ActionPromptHUD';
import { ArrowKeypadHUD } from './components/UI/ArrowKeypadHUD';
import { useVehicleControls } from './hooks/useVehicleControls';
import { MANSION_WAYPOINTS } from './data/mansionsData';
import {
  AppPhase,
  MansionId,
  MansionWaypoint,
  PlayerCustomization,
} from './types/testsprite';
import { playMilestoneChime, toggleAudio } from './utils/soundEffects';
import { Car, Bike, Footprints, Sparkles, DoorOpen, LogOut } from 'lucide-react';
import * as THREE from 'three';

export default function App() {
  // App Phase State: 'onboarding' | 'mounting' | 'overworld' | 'entering' | 'interior' | 'exiting'
  const [phase, setPhase] = useState<AppPhase>('onboarding');

  // Player Customization State (matching reference imagery)
  const [customization, setCustomization] = useState<PlayerCustomization>({
    gender: 'male',
    locomotion: 'bicycle',
    outfitColor: '#c49bb0',
    hairColor: '#1c1917',
  });

  // Road progress (0 to 1 along curve)
  const [progress, setProgress] = useState(0.005);
  const [playerSpeed, setPlayerSpeed] = useState(0);

  // Mansion states
  const [activeMansion, setActiveMansion] = useState<MansionWaypoint | null>(null);
  const [nearbyMansion, setNearbyMansion] = useState<MansionWaypoint | null>(null);

  // Audio state
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Controls hook (WASD, Arrow keys, E, Space)
  const { controls, setManualControl } = useVehicleControls();
  const glideAnimRef = useRef<gsap.core.Tween | null>(null);

  // 1. Handle Onboarding Confirmation (PRD §4.1)
  const handleOnboardingConfirm = (config: PlayerCustomization) => {
    setCustomization(config);
    setPhase('mounting');
    playMilestoneChime();

    // 1.4s Mounting sequence cutscene before transitioning to overworld follow view
    setTimeout(() => {
      setPhase('overworld');
    }, 1400);
  };

  // 2. Handle Waypoint Arrival & Entrance Sequence (PRD §4.4)
  const handleEnterMansion = useCallback((waypoint: MansionWaypoint) => {
    setActiveMansion(waypoint);
    setPhase('entering');
    playMilestoneChime();

    // 1.2s Character dismount & doorway cross-fade
    setTimeout(() => {
      setPhase('interior');
    }, 1200);
  }, []);

  // 3. Handle Exit & Remount Flow (PRD §4.6)
  const handleExitInterior = useCallback(() => {
    setPhase('exiting');
    playMilestoneChime();

    // 1.1s Door exit & vehicle remount sequence
    setTimeout(() => {
      setPhase('overworld');
      setActiveMansion(null);
    }, 1100);
  }, []);

  // Telemetry update from Overworld Scene
  const handleReportTelemetry = useCallback((_pos: THREE.Vector3, speed: number) => {
    setPlayerSpeed(speed);
  }, []);

  // Recruiter Fast Jump to Mansion position on road (PRD §4.3 & §5)
  const handleFastJumpToMansion = useCallback((id: MansionId) => {
    const targetWp = MANSION_WAYPOINTS.find((w) => w.id === id);
    if (!targetWp) return;

    if (glideAnimRef.current) glideAnimRef.current.kill();
    const current = { p: progress };
    glideAnimRef.current = gsap.to(current, {
      p: targetWp.progress,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => setProgress(current.p),
      onComplete: () => {
        playMilestoneChime();
      },
    });
  }, [progress]);

  // Recruiter Direct Jump into Mansion Interior (PRD §5)
  const handleDirectOpenInterior = useCallback((id: MansionId) => {
    const targetWp = MANSION_WAYPOINTS.find((w) => w.id === id);
    if (!targetWp) return;

    setProgress(targetWp.progress);
    setActiveMansion(targetWp);
    setPhase('interior');
    playMilestoneChime();
  }, []);

  // Reset to start of road
  const handleResetToStart = useCallback(() => {
    if (glideAnimRef.current) glideAnimRef.current.kill();
    setProgress(0.005);
    setActiveMansion(null);
    setPhase('overworld');
  }, []);

  // Audio Toggle
  const handleToggleAudio = useCallback(() => {
    const state = toggleAudio();
    setIsAudioActive(state);
  }, []);

  // Current nearest mansion for HUD display
  const currentMansionId: MansionId | null =
    activeMansion?.id ||
    nearbyMansion?.id ||
    MANSION_WAYPOINTS.reduce((prev, curr) =>
      Math.abs(curr.progress - progress) < Math.abs(prev.progress - progress) ? curr : prev
    ).id;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. ONBOARDING MODAL GATE (PRD §4.1) */}
      {phase === 'onboarding' && (
        <OnboardingModal onConfirm={handleOnboardingConfirm} />
      )}

      {/* 2. MOUNTING ANIMATION / PREVIEW CUTSCENE (PRD §4.1) */}
      {phase === 'mounting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="glass-panel p-8 rounded-3xl border border-sky-400/40 text-center max-w-md shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400 flex items-center justify-center animate-pulse text-sky-400">
              {customization.locomotion === 'car' ? (
                <Car className="w-8 h-8" />
              ) : customization.locomotion === 'bicycle' ? (
                <Bike className="w-8 h-8" />
              ) : (
                <Footprints className="w-8 h-8" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                PREPARING JOURNEY
              </span>
              <h2 className="text-2xl font-black text-white">
                Mounting {customization.locomotion.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Avatar: {customization.gender.toUpperCase()} // Mode: {customization.locomotion.toUpperCase()}
              </p>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 animate-[pulse_1s_infinite] w-full" />
            </div>

            <button
              onClick={() => setPhase('overworld')}
              className="text-[11px] font-mono text-slate-400 hover:text-white underline cursor-pointer mt-1"
            >
              Skip Cutscene &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 3. ENTRANCE TRANSITION CUTSCENE (PRD §4.4) */}
      {phase === 'entering' && activeMansion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="glass-panel p-8 rounded-3xl border border-sky-400/50 text-center max-w-md shadow-2xl flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce"
              style={{
                backgroundColor: `${activeMansion.themeColor}25`,
                border: `1px solid ${activeMansion.themeColor}`,
              }}
            >
              <DoorOpen className="w-8 h-8" style={{ color: activeMansion.themeColor }} />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-3 h-3" />
                ENTRANCE SEQUENCE
              </span>
              <h2 className="text-2xl font-black text-white">
                Entering {activeMansion.name}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Dismounting vehicle &bull; Entering {activeMansion.roomName}...
              </p>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full animate-[pulse_0.8s_infinite] w-full"
                style={{ backgroundColor: activeMansion.themeColor }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. EXIT & REMOUNT TRANSITION CUTSCENE (PRD §4.6) */}
      {phase === 'exiting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="glass-panel p-8 rounded-3xl border border-emerald-400/50 text-center max-w-md shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse text-emerald-400">
              <LogOut className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-3 h-3" />
                EXIT &amp; REMOUNT SEQUENCE
              </span>
              <h2 className="text-2xl font-black text-white">
                Returning to Overworld
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Stepping outside to driveway &bull; Remounting {customization.locomotion.toUpperCase()}...
              </p>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 animate-[pulse_0.8s_infinite] w-full" />
            </div>
          </div>
        </div>
      )}

      {/* 5. RECRUITER FAST NAVIGATION OVERRIDE HUD (PRD §5) */}
      {phase !== 'onboarding' && (
        <QuickNavHUD
          currentMansionId={currentMansionId}
          locomotion={customization.locomotion}
          speed={playerSpeed}
          progress={progress}
          isInterior={phase === 'interior'}
          isAudioActive={isAudioActive}
          onToggleAudio={handleToggleAudio}
          onFastJumpToMansion={handleFastJumpToMansion}
          onDirectOpenInterior={handleDirectOpenInterior}
          onResetToStart={handleResetToStart}
        />
      )}

      {/* 6. OVERWORLD 3D SCENE & NAVIGATION (PRD §4.2) */}
      {(phase === 'overworld' || phase === 'entering') && (
        <>
          <Canvas
            shadows
            camera={{ position: [0, 4.5, -235], fov: 50, near: 0.1, far: 800 }}
            className="w-full h-full"
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <OverworldScene
              gender={customization.gender}
              locomotion={customization.locomotion}
              outfitColor={customization.outfitColor}
              hairColor={customization.hairColor}
              controls={phase === 'overworld' ? controls : { up: false, down: false, left: false, right: false, action: false }}
              progress={progress}
              onUpdateProgress={setProgress}
              onEnterMansion={handleEnterMansion}
              onReportTelemetry={handleReportTelemetry}
              onNearbyMansionChange={setNearbyMansion}
            />
          </Canvas>

          {/* Interactive Entrance Button Prompt (PRD §4.4) */}
          <ActionPromptHUD
            nearbyMansion={nearbyMansion}
            onEnter={handleEnterMansion}
          />

          {/* On-Screen Arrow Keypad for touch/mobile or mouse navigation */}
          <ArrowKeypadHUD
            controls={controls}
            onSetControl={setManualControl}
            showEnterAction={!!nearbyMansion}
            onEnterAction={() => nearbyMansion && handleEnterMansion(nearbyMansion)}
          />

          {/* INTERACTIVE MINI-MAP (BOTTOM-RIGHT HUD) (PRD §4.3 & §5) */}
          <MiniMapHUD
            progress={progress}
            nearbyMansionId={nearbyMansion?.id || null}
            onWaypointClick={handleFastJumpToMansion}
          />
        </>
      )}

      {/* 7. INTERIOR 3D ROOM SCENE & INSPECTION MODALS (PRD §4.5) */}
      {phase === 'interior' && activeMansion && (
        <div className="relative w-full h-full">
          {/* 3D Interior Environment (Desk, Workstation, Trophies, 3D Exit Door) */}
          <div className="absolute inset-0 z-0">
            <Canvas
              shadows
              camera={{ position: [0, 3.2, 8.8], fov: 46, near: 0.1, far: 100 }}
              className="w-full h-full"
              gl={{ antialias: true }}
            >
              <InteriorScene
                mansionId={activeMansion.id}
                gender={customization.gender}
                onExit={handleExitInterior}
              />
            </Canvas>
          </div>

          {/* High-Legibility Section Interior Content Overlay */}
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-6 bg-slate-950/45 backdrop-blur-[2px] pointer-events-auto">
            {activeMansion.id === 'hero' && (
              <HeroInterior onExit={handleExitInterior} />
            )}
            {activeMansion.id === 'skills' && (
              <SkillsInterior onExit={handleExitInterior} />
            )}
            {activeMansion.id === 'experience' && (
              <ExperienceInterior onExit={handleExitInterior} />
            )}
            {activeMansion.id === 'projects' && (
              <ProjectInterior onExit={handleExitInterior} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
