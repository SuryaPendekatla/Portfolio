import { useEffect } from 'react';

interface AchievementToastProps {
  title: string;
  description: string;
  onDismiss: () => void;
}

export function AchievementToast({ title, description, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4200);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="achievement-toast interactive" onClick={onDismiss}>
      <div className="achievement-toast-label">// ACHIEVEMENT UNLOCKED</div>
      <div className="achievement-toast-title">{title}</div>
      <div className="achievement-toast-desc">{description}</div>
    </div>
  );
}
