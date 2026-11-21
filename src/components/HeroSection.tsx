import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { portfolioData, monthsSince } from '../data/portfolioData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { playHover, playClick } from '../lib/sfx';

interface HeroSectionProps {
  onProjectsClick: () => void;
  onContactClick: () => void;
}

export function HeroSection({ onProjectsClick, onContactClick }: HeroSectionProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [typedRole, setTypedRole] = useState('');
  const [glitching, setGlitching] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, tech: 0, months: 0 });

  const reducedMotion = useReducedMotion();
  const name = portfolioData.bio.name;
  const role = portfolioData.bio.role;
  const [firstWord, ...restWords] = name.split(' ');
  const accentWord = restWords.join(' ');

  const stats = useMemo(() => {
    const techSet = new Set<string>();
    portfolioData.projects.forEach((p) => p.tech.forEach((t) => techSet.add(t)));
    return {
      projects: portfolioData.projects.length,
      tech: techSet.size,
      months: monthsSince(portfolioData.bio.aiCareerStart),
    };
  }, []);

  // Typewriter reveal for the role line
  useEffect(() => {
    let i = 0;
    setTypedRole('');
    const interval = setInterval(() => {
      i += 1;
      setTypedRole(role.slice(0, i));
      if (i >= role.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [role]);

  // Periodic glitch pulse on the name — skipped entirely under prefers-reduced-motion
  useEffect(() => {
    if (reducedMotion) return;
    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 220);
    };
    const first = setTimeout(trigger, 1800);
    const interval = setInterval(trigger, 5000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [reducedMotion]);

  // Stat counters ease up on mount
  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts({
        projects: Math.round(stats.projects * eased),
        tech: Math.round(stats.tech * eased),
        months: Math.round(stats.months * eased),
      });
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stats]);

  // Cursor spotlight tracks pointer position within the hero card
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={cardRef}
      className="home-hero glass-panel hero-animated"
      onMouseMove={handleMouseMove}
    >
      <div className="hero-spotlight" />
      <div className="hero-border-beam" />

      <h1 className={`hero-name ${glitching ? 'glitching' : ''}`} data-text={name}>
        <span className="hero-word">
          {firstWord.split('').map((char, idx) => (
            <span
              key={`f-${idx}`}
              className="hero-letter"
              style={{ animationDelay: `${0.3 + idx * 0.04}s` }}
            >
              {char}
            </span>
          ))}
        </span>
        {accentWord && (
          <>
            {' '}
            <span className="hero-word hero-name-accent">
              {accentWord.split('').map((char, idx) => (
                <span
                  key={`r-${idx}`}
                  className="hero-letter"
                  style={{ animationDelay: `${0.3 + (firstWord.length + idx) * 0.04}s` }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </span>
          </>
        )}
      </h1>

      <h2 className="hero-role">
        {typedRole}
        <span className="hero-cursor" />
      </h2>

      <div className="hero-focus">
        {portfolioData.bio.focusAreas.map((area) => (
          <span key={area} className="hero-focus-item">{area}</span>
        ))}
      </div>

      <p className="hero-tagline">{portfolioData.bio.tagline}</p>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-value">{counts.projects}</span>
          <span className="hero-stat-label">Projects Shipped</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{counts.tech}</span>
          <span className="hero-stat-label">Technologies</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-value">{counts.months}+</span>
          <span className="hero-stat-label">Months in AI</span>
        </div>
      </div>

      <div className="hero-cta">
        <button
          className="btn-primary hero-btn-spring"
          onClick={() => {
            playClick();
            onProjectsClick();
          }}
          onMouseEnter={() => playHover()}
        >
          System Projects
        </button>
        <button
          className="btn-secondary hero-btn-spring hero-btn-spring-delay"
          onClick={() => {
            playClick();
            onContactClick();
          }}
          onMouseEnter={() => playHover()}
        >
          Signal Transmit
        </button>
      </div>
    </section>
  );
}
