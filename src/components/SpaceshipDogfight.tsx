import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShipConfig {
  id: number;
  color: string;
  centerX: number;
  centerY: number;
  centerZ: number;
  radiusX: number;
  radiusZ: number;
  bobAmplitude: number;
  speed: number;
  phase: number;
  fireInterval: number;
}

const SHIP_COUNT = 8;
const FLEET_CENTER = { x: 0, y: 4, z: -24 };

function buildShipConfigs(): ShipConfig[] {
  const configs: ShipConfig[] = [];
  for (let i = 0; i < SHIP_COUNT; i++) {
    configs.push({
      id: i,
      color: i % 2 === 0 ? '#00f0ff' : '#ff007f',
      centerX: FLEET_CENTER.x,
      centerY: FLEET_CENTER.y,
      centerZ: FLEET_CENTER.z,
      radiusX: 7 + (i % 4) * 1.6,
      radiusZ: 5 + ((i * 7) % 5),
      bobAmplitude: 1.2 + (i % 3),
      speed: 0.12 + (i % 3) * 0.04,
      phase: (i / SHIP_COUNT) * Math.PI * 2,
      fireInterval: 3 + (i % 5)
    });
  }
  return configs;
}

// One wireframe fighter looping a patrol path far behind the main scene; two factions'
// intersecting racetracks read as a background dogfight without ever competing with foreground UI.
function Ship({ config }: { config: ShipConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);
  const nextFireRef = useRef(config.fireInterval);
  const laserLifeRef = useRef(0);
  const laserDuration = 0.18;

  const posAt = (t: number) => {
    const angle = config.phase + t * config.speed;
    return new THREE.Vector3(
      config.centerX + Math.cos(angle) * config.radiusX,
      config.centerY + Math.sin(angle * 1.3) * config.bobAmplitude,
      config.centerZ + Math.sin(angle) * config.radiusZ
    );
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.copy(posAt(t));
    groupRef.current.lookAt(posAt(t + 0.1));

    nextFireRef.current -= delta;
    if (nextFireRef.current <= 0) {
      laserLifeRef.current = laserDuration;
      nextFireRef.current = config.fireInterval + Math.random() * 2;
    } else if (laserLifeRef.current > 0) {
      laserLifeRef.current -= delta;
    }

    if (laserRef.current) {
      const visible = laserLifeRef.current > 0;
      laserRef.current.visible = visible;
      if (visible) {
        const material = laserRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = (laserLifeRef.current / laserDuration) * 0.85;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 1.6, 4]} />
        <meshBasicMaterial color={config.color} wireframe transparent opacity={0.6} />
      </mesh>
      <mesh ref={laserRef} position={[0, 0, -2.4]} visible={false}>
        <boxGeometry args={[0.05, 0.05, 3.4]} />
        <meshBasicMaterial color={config.color} transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function SpaceshipDogfight() {
  const ships = useMemo(() => buildShipConfigs(), []);
  return (
    <>
      {ships.map((config) => (
        <Ship key={config.id} config={config} />
      ))}
    </>
  );
}
