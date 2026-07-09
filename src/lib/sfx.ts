// Lightweight synthesized SFX engine (Web Audio API) — no audio files, just oscillator blips.
// Fits the cyber-terminal theme and sidesteps asset/licensing concerns entirely.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let ambientStarted = false;
let muted = localStorage.getItem('sfx-muted') === 'true';

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.35;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

// Must be called from within a user-gesture handler (click, keydown) — browsers block audio
// otherwise. Safe to call repeatedly; only resumes/starts once.
export function primeAudio() {
  const context = getContext();
  if (context.state === 'suspended') context.resume();
  startAmbient();
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  localStorage.setItem('sfx-muted', String(value));
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(value ? 0 : 0.35, ctx.currentTime, 0.08);
  }
}

export function toggleMuted() {
  setMuted(!muted);
  return muted;
}

function tone(
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = 'square',
  peakGain = 0.5
) {
  if (!masterGain) return;
  const context = getContext();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, context.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), context.currentTime + duration);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, context.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(context.currentTime + duration + 0.02);
}

export function playHover() {
  tone(1400, 1800, 0.05, 'sine', 0.18);
}

export function playClick() {
  tone(600, 950, 0.09, 'square', 0.35);
}

export function playOpen() {
  tone(420, 1300, 0.16, 'sawtooth', 0.3);
}

export function playClose() {
  tone(900, 300, 0.14, 'sawtooth', 0.28);
}

export function playAchievement() {
  if (!masterGain) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    setTimeout(() => tone(freq, freq, 0.14, 'triangle', 0.4), i * 90);
  });
}

function startAmbient() {
  if (ambientStarted || !ctx || !masterGain) return;
  ambientStarted = true;

  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = 55;

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.02;

  ambientGain = ctx.createGain();
  ambientGain.gain.value = 0.05;

  lfo.connect(lfoGain);
  lfoGain.connect(ambientGain.gain);
  drone.connect(ambientGain);
  ambientGain.connect(masterGain);

  drone.start();
  lfo.start();
}
