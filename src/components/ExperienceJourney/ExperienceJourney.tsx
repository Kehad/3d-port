import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene3D } from './Scene3D';
import { ExperienceHUD } from './ExperienceHUD';
import { JourneyControls } from './JourneyControls';
import { FallbackTimeline } from './FallbackTimeline';
import { EXPERIENCES } from '../../data/experiences';
import { CameraMode, ExperienceItem } from '../../types/experience';
import { playMilestoneChime, toggleAudio } from '../../utils/soundEffects';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceJourneyProps {
  useGSAPScroll?: boolean;
}

export const ExperienceJourney: React.FC<ExperienceJourneyProps> = ({
  useGSAPScroll = true,
}) => {
  // Journey state
  const [progress, setProgress] = useState(0);
  const [activeExperience, setActiveExperience] = useState<ExperienceItem | null>(null);
  const [cameraMode, setCameraMode] = useState<CameraMode>('cinematic');
  const [isAutoDriving, setIsAutoDriving] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [showWorldCard, setShowWorldCard] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // References for scroll pinning and animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const progressAnimRef = useRef<gsap.core.Tween | null>(null);
  const autoDriveFrameRef = useRef<number | null>(null);
  const lastActiveStopRef = useRef<string | null>(null);

  /**
   * Evaluates if car is within the threshold of any bus stop milestone
   * and triggers the corresponding experience detail card.
   */
  const checkMilestoneThreshold = useCallback((currentProgress: number) => {
    const threshold = 0.045; // Milestones trigger when car is within +/- 4.5% of progress
    const matched = EXPERIENCES.find(
      (exp) => Math.abs(currentProgress - exp.progress) < threshold
    );

    if (matched) {
      if (lastActiveStopRef.current !== matched.id) {
        lastActiveStopRef.current = matched.id;
        setActiveExperience(matched);
        playMilestoneChime();
      }
    } else {
      if (lastActiveStopRef.current !== null) {
        lastActiveStopRef.current = null;
        setActiveExperience(null);
      }
    }
  }, []);

  /**
   * Applies magnetic dwell / slowdown at bus stops:
   * Compresses scroll input when within milestone zones to create a comfortable pause.
   */
  const applyMilestoneDwell = (rawProgress: number): number => {
    let adjusted = rawProgress;
    for (const exp of EXPERIENCES) {
      const dist = rawProgress - exp.progress;
      if (Math.abs(dist) < 0.035) {
        // Soft plateau easing
        adjusted = exp.progress + Math.sign(dist) * Math.pow(Math.abs(dist) / 0.035, 1.8) * 0.035;
        break;
      }
    }
    return THREE_CLAMP(adjusted, 0, 0.999);
  };

  /**
   * Setup GSAP ScrollTrigger for pinning the canvas across 350vh scroll duration
   */
  useEffect(() => {
    if (!useGSAPScroll || isFallbackMode) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: '+=350%',
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (!isAutoDriving) {
          const raw = self.progress;
          const eased = applyMilestoneDwell(raw);
          setProgress(eased);
          checkMilestoneThreshold(eased);
        }
      },
    });

    triggerRef.current = trigger;

    return () => {
      trigger.kill();
    };
  }, [useGSAPScroll, isFallbackMode, isAutoDriving, checkMilestoneThreshold]);

  /**
   * Auto-Drive simulation loop when user toggles play cruise
   */
  useEffect(() => {
    if (!isAutoDriving) {
      if (autoDriveFrameRef.current) cancelAnimationFrame(autoDriveFrameRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setProgress((prev) => {
        let next = prev + dt * 0.038;
        if (next >= 0.99) {
          next = 0; // Loop or stop
        }
        checkMilestoneThreshold(next);

        // Synchronize GSAP scroll position if active
        if (triggerRef.current) {
          const scrollPos = triggerRef.current.start + next * (triggerRef.current.end - triggerRef.current.start);
          window.scrollTo({ top: scrollPos, behavior: 'instant' });
        }
        return next;
      });

      autoDriveFrameRef.current = requestAnimationFrame(loop);
    };

    autoDriveFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (autoDriveFrameRef.current) cancelAnimationFrame(autoDriveFrameRef.current);
    };
  }, [isAutoDriving, checkMilestoneThreshold]);

  /**
   * Smoothly jump / glide to a specific milestone
   */
  const handleSelectExperience = (exp: ExperienceItem) => {
    setIsAutoDriving(false);
    if (progressAnimRef.current) progressAnimRef.current.kill();

    const targetProgress = exp.progress;

    // Animate progress smoothly via GSAP tween
    const currentObj = { p: progress };
    progressAnimRef.current = gsap.to(currentObj, {
      p: targetProgress,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(currentObj.p);
        checkMilestoneThreshold(currentObj.p);
      },
      onComplete: () => {
        setActiveExperience(exp);
        playMilestoneChime();
      },
    });

    // Sync window scrollbar to match milestone
    if (triggerRef.current) {
      const scrollPos =
        triggerRef.current.start + targetProgress * (triggerRef.current.end - triggerRef.current.start);
      window.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  /**
   * Seek directly from timeline slider
   */
  const handleSeek = (newProgress: number) => {
    setIsAutoDriving(false);
    setProgress(newProgress);
    checkMilestoneThreshold(newProgress);

    if (triggerRef.current) {
      const scrollPos =
        triggerRef.current.start + newProgress * (triggerRef.current.end - triggerRef.current.start);
      window.scrollTo({ top: scrollPos, behavior: 'instant' });
    }
  };

  const handleReset = () => {
    setIsAutoDriving(false);
    handleSeek(0);
    setActiveExperience(null);
  };

  const handleToggleAudio = () => {
    const newState = toggleAudio();
    setIsAudioActive(newState);
  };

  if (isFallbackMode) {
    return (
      <div className="bg-[#090a0f] min-h-screen">
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsFallbackMode(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-slate-950 shadow-glow-cyan"
          >
            Switch to 3D Experience
          </button>
        </div>
        <FallbackTimeline />
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative w-full h-screen bg-[#090a0f] overflow-hidden select-none"
    >
      {/* 3D Scene Viewport */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          shadows
          camera={{ position: [0, 8, -125], fov: 46 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
        >
          <Scene3D
            progress={progress}
            activeExperience={activeExperience}
            onSelectExperience={handleSelectExperience}
            cameraMode={cameraMode}
            showWorldCard={showWorldCard}
          />
        </Canvas>
      </div>

      {/* Top Section Header Watermark */}
      <header className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
            Interactive Journey
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
          Work Experience Roadmap
        </h1>
        <p className="text-xs text-slate-400 font-mono hidden sm:block">
          Scroll down to drive along career milestones • Click stops to inspect
        </p>
      </header>

      {/* Top Right Quick Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsFallbackMode(true)}
          className="glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition-all shadow-md"
          title="Switch to 2D standard timeline"
        >
          2D Mode
        </button>
      </div>

      {/* Synchronized Experience Card HUD Overlay (Fixed 2D view with transitions) */}
      {!showWorldCard && (
        <ExperienceHUD
          activeExperience={activeExperience}
          onClose={() => setActiveExperience(null)}
          onNavigate={handleSelectExperience}
        />
      )}

      {/* Bottom Controls Dock (Progress scrubber, Auto-Drive, Audio, Camera) */}
      <JourneyControls
        progress={progress}
        onSeek={handleSeek}
        activeExperience={activeExperience}
        onSelectExperience={handleSelectExperience}
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        isAutoDriving={isAutoDriving}
        onToggleAutoDrive={() => setIsAutoDriving(!isAutoDriving)}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        onReset={handleReset}
        showWorldCard={showWorldCard}
        onToggleWorldCard={() => setShowWorldCard(!showWorldCard)}
      />
    </section>
  );
};

function THREE_CLAMP(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

