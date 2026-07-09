import { useCallback, useRef, useState } from 'react';
import { playAchievement } from '../lib/sfx';

export interface AchievementPayload {
  title: string;
  description: string;
}

interface QueuedAchievement extends AchievementPayload {
  key: string;
}

const STORAGE_KEY = 'unlocked-achievements';

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function useAchievements() {
  const unlockedRef = useRef<Set<string> | null>(null);
  if (!unlockedRef.current) unlockedRef.current = loadUnlocked();

  const [queue, setQueue] = useState<QueuedAchievement[]>([]);

  const isUnlocked = useCallback((key: string) => unlockedRef.current!.has(key), []);

  const unlock = useCallback((key: string, payload: AchievementPayload) => {
    if (unlockedRef.current!.has(key)) return;
    unlockedRef.current!.add(key);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unlockedRef.current!)));
    setQueue((q) => [...q, { key, ...payload }]);
    playAchievement();
  }, []);

  const dismissCurrent = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return { current: queue[0] ?? null, unlock, dismissCurrent, isUnlocked };
}
