import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Real load progress reaches 100% almost instantly since the scene is entirely procedural (no
// textures/models to fetch) — this floor keeps the counter and core animation on screen long
// enough to actually read instead of flashing past in a couple hundred ms.
const MIN_DISPLAY_MS = 2200;

export function LoadingScreen() {
  const { active, progress: realProgress } = useProgress();
  const reducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const startRef = useRef(performance.now());
  const minDisplayMs = reducedMotion ? 0 : MIN_DISPLAY_MS;

  useEffect(() => {
    if (minDisplayMs === 0) {
      setDisplayProgress(100);
      return;
    }
    const interval = setInterval(() => {
      const elapsed = performance.now() - startRef.current;
      setDisplayProgress(Math.min(100, Math.round((elapsed / minDisplayMs) * 100)));
    }, 80);
    return () => clearInterval(interval);
  }, [minDisplayMs]);

  useEffect(() => {
    const elapsed = performance.now() - startRef.current;
    const remaining = Math.max(0, minDisplayMs - elapsed);
    if (!active || realProgress >= 100) {
      const fadeTimer = setTimeout(() => setFade(true), remaining + 200);
      const hideTimer = setTimeout(() => setHidden(true), remaining + 1000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [active, realProgress, minDisplayMs]);

  if (hidden) return null;

  return (
    <div className={`loader-overlay ${fade ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className={`loader-core ${reducedMotion ? 'static' : ''}`}>
          <div className="loader-core-ring loader-core-ring-cyan" />
          <div className="loader-core-ring loader-core-ring-magenta" />
          <div className="loader-core-dot" />
        </div>
        <h1 className="loader-logo">
          SURYA<span>.P</span>
        </h1>
        <div className="loader-bar-container">
          <div
            className="loader-bar"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
        <p className="loader-status">
          INITIALIZING HOLOGRAPHIC CORE {displayProgress}%
        </p>
      </div>
    </div>
  );
}
