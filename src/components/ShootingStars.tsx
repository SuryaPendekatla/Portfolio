import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StreakState {
  active: boolean;
  start: THREE.Vector3;
  end: THREE.Vector3;
  t: number;
  duration: number;
  nextTrigger: number;
}

const STREAK_COUNT = 2;

function randomSkyPoint(): THREE.Vector3 {
  const radius = 22 + Math.random() * 14;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI * 0.5 + 0.15;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi) + 4,
    radius * Math.sin(phi) * Math.sin(theta) - 12
  );
}

function ShootingStar() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const stateRef = useRef<StreakState>({
    active: false,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    t: 0,
    duration: 0.65,
    nextTrigger: 3 + Math.random() * 6
  });

  useFrame((_, delta) => {
    const group = groupRef.current;
    const material = materialRef.current;
    if (!group || !material) return;
    const s = stateRef.current;

    if (!s.active) {
      s.nextTrigger -= delta;
      if (s.nextTrigger <= 0) {
        s.start.copy(randomSkyPoint());
        s.end.copy(randomSkyPoint());
        s.t = 0;
        s.active = true;
        group.visible = true;
      }
      return;
    }

    s.t += delta / s.duration;
    if (s.t >= 1) {
      s.active = false;
      s.nextTrigger = 4 + Math.random() * 9;
      group.visible = false;
      return;
    }

    group.position.lerpVectors(s.start, s.end, s.t);
    group.lookAt(s.end);
    // Capped well below 1.0 — at full brightness this tiny cone overwhelms the bloom pass into
    // a giant glowing blob instead of reading as a thin streak
    const peak = s.t < 0.15 ? s.t / 0.15 : 1 - (s.t - 0.15) / 0.85;
    material.opacity = peak * 0.45;
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.02, 1.6, 6]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#8fd8ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// A couple of rare, fast streaks across the distant sky — skipped under reduced motion since
// this is exactly the kind of unpredictable, brief flash that's uncomfortable for that preference
export function ShootingStars({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null;
  return (
    <>
      {Array.from({ length: STREAK_COUNT }).map((_, i) => (
        <ShootingStar key={i} />
      ))}
    </>
  );
}
