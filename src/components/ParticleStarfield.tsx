import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleStarfield() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions and colors for 2000 stars
  const [positions, colors] = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position inside a spherical range from 10 to 40 units away
      const radius = 10 + Math.random() * 30;
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
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow background rotation
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.008;

      // Parallax effect: tilt starfield subtly depending on cursor
      const targetX = state.pointer.x * 0.15;
      const targetY = state.pointer.y * 0.15;
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
        size={0.06}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
