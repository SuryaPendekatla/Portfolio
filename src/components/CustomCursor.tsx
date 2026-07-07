import { useEffect, useRef, useState } from 'react';

interface CursorHoverDetail {
  active: boolean;
  label?: string;
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;

    document.body.classList.add('custom-cursor-active');

    const ringPos = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };

    const handleMove = (e: MouseEvent) => {
      dotPos.x = e.clientX;
      dotPos.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      }
    };

    // Ring trails the dot with a light lerp for a bit of weight/inertia
    let frame: number;
    const tick = () => {
      ringPos.x += (dotPos.x - ringPos.x) * 0.2;
      ringPos.y += (dotPos.y - ringPos.y) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const handleHover = (e: Event) => {
      const detail = (e as CustomEvent<CursorHoverDetail>).detail;
      setHovering(detail.active);
      setLabel(detail.active ? detail.label ?? '' : '');
    };

    // Also pick up ordinary DOM buttons/links so the cursor reacts consistently everywhere
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) {
        setHovering(true);
        setLabel('');
      }
    };
    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) {
        setHovering(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('cursor:hover', handleHover);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('cursor:hover', handleHover);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} />
      <div ref={ringRef} className={`custom-cursor-ring ${hovering ? 'hovering' : ''}`}>
        {label && <span className="custom-cursor-label">{label}</span>}
      </div>
    </>
  );
}
