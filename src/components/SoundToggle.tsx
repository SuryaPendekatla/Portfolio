import { useEffect, useState } from 'react';
import { isMuted, toggleMuted, playClick } from '../lib/sfx';

export function SoundToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const handleClick = () => {
    const next = toggleMuted();
    setMutedState(next);
    if (!next) playClick();
  };

  return (
    <button
      className="sound-toggle interactive"
      onClick={handleClick}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      [ SFX: {muted ? 'OFF' : 'ON'} ]
    </button>
  );
}
