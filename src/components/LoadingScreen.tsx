import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export function LoadingScreen() {
  const { active, progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // If loading is complete, initiate the fade out transition
    if (!active || progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setFade(true);
      }, 500);

      const hideTimer = setTimeout(() => {
        setHidden(true);
      }, 1300); // 500ms delay + 800ms fade transition time

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [active, progress]);

  if (hidden) return null;

  return (
    <div className={`loader-overlay ${fade ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <h1 className="loader-logo">
          SURYA<span>.P</span>
        </h1>
        <div className="loader-bar-container">
          <div
            className="loader-bar"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <p className="loader-status">
          INITIALIZING HOLOGRAPHIC CORE {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
