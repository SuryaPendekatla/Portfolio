import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { ParticleStarfield } from './ParticleStarfield';
import { TerminalConsole } from './TerminalConsole';
import { ProjectCard } from './ProjectCard';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../data/portfolioData';

interface CanvasContainerProps {
  activeTab: string;
  selectedProject: Project | null;
  onTerminalClick: () => void;
  onProjectClick: (project: Project) => void;
}

// Animated glowing orbital ring around the scene center
function OrbitalRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.12;
      ringRef.current.rotation.x = 0.4 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }
  });
  return (
    <mesh ref={ringRef} position={[0, 0.2, 0]}>
      <torusGeometry args={[5.5, 0.012, 8, 120]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.18} />
    </mesh>
  );
}

// Secondary magenta ring at a different angle
function OrbitalRingMagenta() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = -state.clock.getElapsedTime() * 0.08;
      ringRef.current.rotation.x = -0.6 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.04;
    }
  });
  return (
    <mesh ref={ringRef} position={[0, 0.2, 0]}>
      <torusGeometry args={[6.5, 0.009, 8, 120]} />
      <meshBasicMaterial color="#ff007f" transparent opacity={0.12} />
    </mesh>
  );
}

// Camera control helper to smoothly interpolate position and lookAt
function CameraRig({
  activeTab,
  selectedProject
}: {
  activeTab: string;
  selectedProject: Project | null;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 8.5));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const tempLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (selectedProject) {
      const [px, py, pz] = selectedProject.position;
      targetPos.current.set(px, py, pz + 2.0);
      targetLook.current.set(px, py, pz);
    } else {
      switch (activeTab) {
        case 'about':
          targetPos.current.set(0, 0.9, 2.5);
          targetLook.current.set(0, 0.4, -0.66);
          break;
        case 'projects':
          targetPos.current.set(0, 2.0, 9.0);
          targetLook.current.set(0, 0.8, -0.5);
          break;
        case 'contact':
          targetPos.current.set(-4.0, 2.0, 5.5);
          targetLook.current.set(0, 0.5, 0);
          break;
        case 'home':
        default:
          targetPos.current.set(0, 0, 8.5);
          targetLook.current.set(0, 0, 0);
          break;
      }
    }
  }, [activeTab, selectedProject]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    tempLook.current.lerp(targetLook.current, 0.05);
    camera.lookAt(tempLook.current);
  });

  return null;
}

export function CanvasContainer({
  activeTab,
  selectedProject,
  onTerminalClick,
  onProjectClick
}: CanvasContainerProps) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        gl={{ antialias: true }}
      >
        {/* Sky / Space background color */}
        <color attach="background" args={['#03000b']} />

        {/* Dynamic Starfield particles */}
        <ParticleStarfield />

        {/* Neon grid floor - gives the scene a cyberpunk ground plane */}
        <Grid
          position={[0, -1.3, 0]}
          args={[40, 40]}
          cellSize={1}
          cellThickness={0.4}
          cellColor="#00f0ff"
          sectionSize={5}
          sectionThickness={0.8}
          sectionColor="#ff007f"
          fadeDistance={25}
          fadeStrength={1.5}
          infiniteGrid
        />

        {/* Animated orbital rings for visual depth */}
        <OrbitalRing />
        <OrbitalRingMagenta />

        {/* Ambient environment glow */}
        <ambientLight intensity={0.5} />

        {/* Directional light casting shadow depth */}
        <directionalLight position={[-5, 8, 5]} intensity={0.6} />

        {/* Emissive cyan and pink glows centered in space */}
        <pointLight position={[0, 0, 0]} color="#00f0ff" intensity={1.8} distance={8} />
        <pointLight position={[0, 1.5, -2]} color="#ff007f" intensity={1.2} distance={6} />
        {/* Additional rim lights for project card nodes */}
        <pointLight position={[-4.5, 1.2, 0.5]} color="#00bfff" intensity={1.0} distance={4} />
        <pointLight position={[4.5, 1.2, 0.5]} color="#ffaa00" intensity={1.0} distance={4} />

        {/* The Central Cyber Console */}
        <TerminalConsole onClick={onTerminalClick} />

        {/* Floating Project Showcases */}
        {portfolioData.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectClick(project)}
          />
        ))}

        {/* Camera lerping controls */}
        <CameraRig activeTab={activeTab} selectedProject={selectedProject} />

        {/* Orbit Controls */}
        <OrbitControls
          enableZoom={!selectedProject && activeTab !== 'about'}
          enableRotate={!selectedProject && activeTab !== 'about'}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minDistance={2.5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}
