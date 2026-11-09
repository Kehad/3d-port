/**
 * Procedural Audio Synthesizer via Web Audio API
 * Generates dynamic engine hum pitch matching car velocity and smooth milestone chime.
 */

let audioCtx: AudioContext | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
let isAudioEnabled = false;

export function toggleAudio(enable?: boolean): boolean {
  if (typeof window === 'undefined') return false;

  const targetState = enable !== undefined ? enable : !isAudioEnabled;

  if (targetState) {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtx = new AudioContextClass();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!engineOsc) {
        engineOsc = audioCtx.createOscillator();
        engineGain = audioCtx.createGain();

        engineOsc.type = 'sawtooth';
        engineOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low purr
        engineGain.gain.setValueAtTime(0.02, audioCtx.currentTime); // Very subtle

        // Lowpass filter for warm engine rumble
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, audioCtx.currentTime);

        engineOsc.connect(filter);
        filter.connect(engineGain);
        engineGain.connect(audioCtx.destination);
        engineOsc.start();
      }

      isAudioEnabled = true;
    } catch {
      isAudioEnabled = false;
    }
  } else {
    if (engineGain && audioCtx) {
      engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    }
    isAudioEnabled = false;
  }

  return isAudioEnabled;
}

export function updateEnginePitch(speed: number) {
  if (!isAudioEnabled || !audioCtx || !engineOsc || !engineGain) return;
  const baseFreq = 50;
  const targetFreq = THREE_CLAMP(baseFreq + Math.abs(speed) * 80, 50, 160);
  engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
}

export function playMilestoneChime() {
  if (!isAudioEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Arpeggio chord effect (F# maj 7)
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  } catch {
    // Audio context may not be allowed until user interaction
  }
}

function THREE_CLAMP(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

