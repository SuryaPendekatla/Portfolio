import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Soft round sprite so stars read as glowing dots rather than the hard squares THREE.Points
// renders by default — most noticeable on the larger "near" parallax layer.
function generateStarSprite(): THREE.CanvasTexture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.5)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

interface ParticleStarfieldProps {
  reducedMotion: boolean;
  count?: number;
  radiusMin?: number;
  radiusMax?: number;
  size?: number;
  opacity?: number;
  parallaxStrength?: number;
  rotationSpeed?: number;
}

export function ParticleStarfield({
  reducedMotion,
  count = 2000,
  radiusMin = 10,
  radiusMax = 40,
  size = 0.06,
  opacity = 0.8,
  parallaxStrength = 0.15,
  rotationSpeed = 1
}: ParticleStarfieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const sprite = useMemo(() => generateStarSprite(), []);

  // Generate random positions and colors for the star layer
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position inside a spherical shell between radiusMin and radiusMax
      const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color palette: deep blue, cyan, magenta, and white
      const r = Math.random();
      if (r < 0.3) {
        // Cyan
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.94;
        colors[i * 3 + 2] = 1.0;
      } else if (r < 0.6) {
        // Magenta
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.0;
        colors[i * 3 + 2] = 0.5;
      } else {
        // Bright white/silver
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.93;
        colors[i * 3 + 2] = 1.0;
      }
    }

    return [positions, colors];
  }, [count, radiusMin, radiusMax]);

  useFrame((state) => {
    if (pointsRef.current && !reducedMotion) {
      // Slow background rotation
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015 * rotationSpeed;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.008 * rotationSpeed;

      // Parallax effect: tilt starfield subtly depending on cursor
      const targetX = state.pointer.x * parallaxStrength;
      const targetY = state.pointer.y * parallaxStrength;
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
      pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={size}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
