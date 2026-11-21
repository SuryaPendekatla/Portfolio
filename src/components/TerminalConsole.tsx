import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { portfolioData } from '../data/portfolioData';
import { playHover, playClick } from '../lib/sfx';

interface TerminalConsoleProps {
  onClick: () => void;
}

export function TerminalConsole({ onClick }: TerminalConsoleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Set up HTML Canvas for dynamic 3D screen rendering
  const [canvas, texture] = useMemo((): [HTMLCanvasElement, THREE.CanvasTexture] => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;

    const texture = new THREE.CanvasTexture(canvas);
    return [canvas, texture];
  }, []);

  // Animate the terminal screen writing terminal text
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.1;
      // Gentle spin
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }

    // Draw on screen canvas
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#060214';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing scanlines effect
    ctx.fillStyle = 'rgba(0, 240, 255, 0.02)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }

    // Terminal Text
    ctx.font = 'bold 24px "Orbitron", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('// SYSTEM ACCESS', 30, 45);

    ctx.font = '18px "Orbitron", monospace';
    ctx.fillStyle = '#b6b1c9';
    ctx.fillText(`IDENTITY: ${portfolioData.bio.name}`, 30, 82);
    ctx.fillText(`ROLE: ${portfolioData.bio.role.toUpperCase()}`, 30, 110);
    ctx.fillText(`BASE: ${portfolioData.bio.currentCompany.toUpperCase()}`, 30, 138);
    ctx.fillText('STATUS: SECURE_LINK_CONNECTED', 30, 166);

    // Blinking cursor / input line
    const blink = Math.floor(state.clock.getElapsedTime() * 2) % 2 === 0;
    ctx.fillStyle = '#ff007f';
    ctx.font = '18px "Orbitron", monospace';
    ctx.fillText(`> CLICK TO LOG IN${blink ? '_' : ' '}`, 30, 208);

    // Border glowing indicator
    ctx.strokeStyle = hovered ? '#ff007f' : '#00f0ff';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    texture.needsUpdate = true;
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        playHover();
        document.body.style.cursor = 'pointer';
        window.dispatchEvent(new CustomEvent('cursor:hover', { detail: { active: true, label: 'OPEN' } }));
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
        window.dispatchEvent(new CustomEvent('cursor:hover', { detail: { active: false } }));
      }}
    >
      {/* Keyboard Base */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[2.5, 0.1, 1.8]} />
        <meshStandardMaterial
          color="#0d081f"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Screen Frame */}
      <mesh position={[0, 0.4, -0.75]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[2.7, 1.5, 0.15]} />
        <meshStandardMaterial
          color="#0a0518"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Screen Glass Display */}
      <mesh position={[0, 0.4, -0.66]} rotation={[0.15, 0, 0]}>
        <planeGeometry args={[2.5, 1.3]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
        />
      </mesh>

      {/* Screen Support Arm */}
      <mesh position={[0, -0.2, -0.6]} rotation={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.7]} />
        <meshStandardMaterial
          color="#160d33"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Emissive Base Accents */}
      <mesh position={[0, -0.55, 0.82]}>
        <boxGeometry args={[2.2, 0.02, 0.05]} />
        <meshBasicMaterial color={hovered ? "#ff007f" : "#00f0ff"} />
      </mesh>
    </group>
  );
}
