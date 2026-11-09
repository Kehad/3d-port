import React, { useState } from 'react';
import {
  User,
  Footprints,
  Car as CarIcon,
  Bike,
  Sparkles,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { AvatarGender, LocomotionMode, PlayerCustomization } from '../../types/testsprite';

interface OnboardingModalProps {
  onConfirm: (config: PlayerCustomization) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onConfirm }) => {
  const [gender, setGender] = useState<AvatarGender>('male');
  const [locomotion, setLocomotion] = useState<LocomotionMode>('bicycle');
  const [outfitColor, setOutfitColor] = useState('#c49bb0'); // Default: Dusty mauve sweatshirt from Image 1

  const outfitColors = [
    { label: 'Dusty Rose Mauve (Reference)', value: '#c49bb0' },
    { label: 'Camel Wool Tan (Reference)', value: '#b88251' },
    { label: 'Golden Sunflower (Reference)', value: '#f59e0b' },
    { label: 'Slate Chino Denim (Reference)', value: '#56748e' },
  ];

  const handleGenderSelect = (selectedGender: AvatarGender) => {
    setGender(selectedGender);
    if (selectedGender === 'female') {
      setOutfitColor('#b88251'); // Camel trench coat for female
    } else {
      setOutfitColor('#c49bb0'); // Dusty rose sweatshirt for male
    }
  };

  const handleStart = () => {
    onConfirm({
      gender,
      locomotion,
      outfitColor,
      hairColor: gender === 'female' ? '#382218' : '#1c1917',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-500/30 text-white relative overflow-hidden">
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-amber-400 to-purple-400" />

        {/* Header Title */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              TestSprite // Character Studio
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">v2.5 // Official Outfits</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          Select Your Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono mb-6 leading-relaxed">
          Choose your tailored character model and preferred locomotion mode to travel across the portfolio world.
        </p>

        {/* STEP 1: Avatar Gender Base */}
        <div className="mb-5">
          <label className="text-xs font-mono uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            1. Select Character Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Male Avatar (Image 1) */}
            <button
              onClick={() => handleGenderSelect('male')}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                gender === 'male'
                  ? 'bg-rose-500/20 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-white">Male Model</span>
                <span className="text-[11px] font-mono text-rose-300 block">
                  Mauve Sweatshirt &bull; Slate Chinos
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  White Sneakers &bull; Smartphone
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  gender === 'male' ? 'border-rose-400 bg-rose-400' : 'border-slate-600'
                }`}
              >
                {gender === 'male' && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
              </div>
            </button>

            {/* Female Avatar (Image 2) */}
            <button
              onClick={() => handleGenderSelect('female')}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                gender === 'female'
                  ? 'bg-amber-500/20 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-white">Female Model</span>
                <span className="text-[11px] font-mono text-amber-300 block">
                  Camel Trench &bull; Turtleneck
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Ankle Boots &bull; White Handbag
                </span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  gender === 'female' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                }`}
              >
                {gender === 'female' && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: Locomotion Mode (Foot, Bicycle, Car) */}
        <div className="mb-5">
          <label className="text-xs font-mono uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1.5 mb-2.5">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            2. Select Transportation Mode
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Bicycle (Image 3) */}
            <button
              onClick={() => setLocomotion('bicycle')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                locomotion === 'bicycle'
                  ? 'bg-amber-500/25 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)] text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Bike className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                  Image 3
                </span>
              </div>
              <span className="text-xs font-bold text-white block">Yellow Cruiser</span>
              <span className="text-[10px] font-mono text-slate-300">Golden Bike</span>
            </button>

            {/* On Foot */}
            <button
              onClick={() => setLocomotion('foot')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                locomotion === 'foot'
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-glow-emerald text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 font-bold">
                  1.0X
                </span>
              </div>
              <span className="text-xs font-bold text-white block">On Foot</span>
              <span className="text-[10px] font-mono text-slate-400">Casual Walk</span>
            </button>

            {/* Car */}
            <button
              onClick={() => setLocomotion('car')}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                locomotion === 'car'
                  ? 'bg-sky-500/20 border-sky-400 shadow-glow-cyan text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <CarIcon className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 font-bold">
                  3.5X
                </span>
              </div>
              <span className="text-xs font-bold text-white block">Sports Car</span>
              <span className="text-[10px] font-mono text-slate-400">Highway Drive</span>
            </button>
          </div>
        </div>

        {/* STEP 3: Outfit Color Accent */}
        <div className="mb-7">
          <label className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Palette Accent
          </label>
          <div className="flex items-center gap-2.5">
            {outfitColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setOutfitColor(color.value)}
                style={{ backgroundColor: color.value }}
                className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                  outfitColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 hover:from-amber-400 hover:to-sky-400 text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-101 active:scale-99"
        >
          <Sparkles className="w-4 h-4" />
          <span>START PORTFOLIO EXPEDITION</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[10px] font-mono text-slate-400 mt-3">
          Controls: WASD or Arrow Keys to steer/move &bull; Press E to enter mansions.
        </p>
      </div>
    </div>
  );
};
