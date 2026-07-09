import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ShipVariant = 'interceptor' | 'cruiser';

interface ShipConfig {
  id: number;
  variant: ShipVariant;
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

// Interceptor: sleek fighter with swept wings, gold engine trail
// Cruiser: bulkier hexagonal gunship, blue engine trail — mirrors the two ship classes in the
// reference art (slim jets up top, blockier gunships below)
const VARIANT_STYLE: Record<ShipVariant, { hull: string; accent: string; trail: string }> = {
  interceptor: { hull: '#dce8ff', accent: '#3fa9ff', trail: '#ffd23f' },
  cruiser: { hull: '#9aa5b1', accent: '#c2cad3', trail: '#3fd0ff' }
};

function buildShipConfigs(): ShipConfig[] {
  const configs: ShipConfig[] = [];
  for (let i = 0; i < SHIP_COUNT; i++) {
    configs.push({
      id: i,
      variant: i % 2 === 0 ? 'interceptor' : 'cruiser',
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

function ShipModel({ variant }: { variant: ShipVariant }) {
  const style = VARIANT_STYLE[variant];

  if (variant === 'interceptor') {
    return (
      <group>
        {/* Fuselage — slim nose pointed forward (local -Z) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.16, 1.3, 8]} />
          <meshStandardMaterial color={style.hull} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Swept wings */}
        <mesh position={[0.32, 0, 0.15]} rotation={[0, -0.45, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.32]} />
          <meshStandardMaterial color={style.accent} metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.32, 0, 0.15]} rotation={[0, 0.45, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.32]} />
          <meshStandardMaterial color={style.accent} metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Hexagonal bulk hull */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 1.5, 6]} />
        <meshStandardMaterial color={style.hull} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Side gun pods */}
      <mesh position={[0.45, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
        <meshStandardMaterial color={style.accent} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.45, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.6, 6]} />
        <meshStandardMaterial color={style.accent} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

// One ship looping a patrol path far behind the main scene; two classes' intersecting racetracks
// read as a background dogfight without ever competing with foreground UI.
function Ship({ config }: { config: ShipConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const burstRef = useRef<THREE.Mesh>(null);
  const nextFireRef = useRef(config.fireInterval);
  const burstLifeRef = useRef(0);
  const burstDuration = 0.18;
  const style = VARIANT_STYLE[config.variant];

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

    // Steady engine trail with a light flicker, like the constant thruster beam in the reference
    if (trailRef.current) {
      const material = trailRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.55 + Math.sin(t * 14 + config.id) * 0.15;
    }

    // Occasional brighter weapon pulse down the same trail line
    nextFireRef.current -= delta;
    if (nextFireRef.current <= 0) {
      burstLifeRef.current = burstDuration;
      nextFireRef.current = config.fireInterval + Math.random() * 2;
    } else if (burstLifeRef.current > 0) {
      burstLifeRef.current -= delta;
    }
    if (burstRef.current) {
      const visible = burstLifeRef.current > 0;
      burstRef.current.visible = visible;
      if (visible) {
        const material = burstRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = (burstLifeRef.current / burstDuration) * 0.9;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <ShipModel variant={config.variant} />
      {/* Engine trail — apex points backward (+Z, away from the nose at -Z), like a thruster
          flame flaring at the engine and tapering off behind */}
      <mesh ref={trailRef} position={[0, 0, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.7, 6]} />
        <meshBasicMaterial color={style.trail} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Weapon pulse burst */}
      <mesh ref={burstRef} position={[0, 0, -2.2]} visible={false}>
        <boxGeometry args={[0.05, 0.05, 3.2]} />
        <meshBasicMaterial color={style.trail} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
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
