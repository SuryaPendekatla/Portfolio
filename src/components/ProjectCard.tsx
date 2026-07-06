import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Project } from '../data/portfolioData';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate the floating cards
  useFrame((state) => {
    if (groupRef.current) {
      // Float up/down at slightly different phases based on project id
      const phase = project.id === 'project-1' ? 0 : project.id === 'project-2' ? 1.5 : 3.0;
      groupRef.current.position.y = project.position[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + phase) * 0.15;
    }
    if (modelRef.current) {
      // Rotate faster on hover
      const speed = hovered ? 0.8 : 0.25;
      modelRef.current.rotation.y += speed * 0.05;
      modelRef.current.rotation.x += speed * 0.02;

      // Pulsate scale for the "orb" type
      if (project.modelType === 'orb') {
        const scale = 0.8 + Math.sin(state.clock.getElapsedTime() * 3) * 0.08;
        modelRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  // Helper to render the custom 3D model indicator
  const renderModel = () => {
    switch (project.modelType) {
      case 'globe':
        return (
          <mesh ref={modelRef}>
            <sphereGeometry args={[0.55, 12, 12]} />
            <meshBasicMaterial
              color={hovered ? '#00f0ff' : '#00bfff'}
              wireframe={true}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        );
      case 'phone':
        return (
          <mesh ref={modelRef} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.5, 0.9, 0.08]} />
            <meshBasicMaterial
              color={hovered ? '#ff007f' : '#b0005a'}
              wireframe={true}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        );
      case 'orb':
      default:
        return (
          <mesh ref={modelRef}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshBasicMaterial
              color={hovered ? '#ffaa00' : '#ff7a00'}
              wireframe={true}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        );
    }
  };

  const getGlowColor = () => {
    if (project.modelType === 'globe') return '#00f0ff';
    if (project.modelType === 'phone') return '#ff007f';
    return '#ffaa00';
  };

  return (
    <group
      ref={groupRef}
      position={project.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Background backing plane - Holographic card */}
      <mesh>
        <planeGeometry args={[1.6, 2.2]} />
        <meshPhysicalMaterial
          color="#050110"
          transparent={true}
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>

      {/* Frame / border of the card */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 2.2)]} />
        <lineBasicMaterial
          color={hovered ? getGlowColor() : '#1a1a2e'}
          linewidth={hovered ? 2 : 1}
        />
      </lineSegments>

      {/* Dynamic 3D model centerpiece */}
      <group position={[0, 0.25, 0.1]}>
        {renderModel()}
      </group>

      {/* HTML overlay text projected into 3D */}
      <Html
        position={[0, -0.65, 0.15]}
        center
        distanceFactor={6}
        style={{
          width: '180px',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '11px',
          fontWeight: 700,
          color: hovered ? '#fff' : 'var(--text-secondary)',
          textShadow: hovered ? `0 0 8px ${getGlowColor()}` : 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.2s ease',
          background: 'rgba(3,0,10,0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: `1px solid ${hovered ? getGlowColor() : 'rgba(255,255,255,0.05)'}`
        }}>
          {project.title}
        </div>
        <div style={{
          fontFamily: 'var(--font-text)',
          fontSize: '9px',
          color: 'var(--text-muted)',
          marginTop: '4px',
          textTransform: 'uppercase'
        }}>
          {project.tag.split('//')[0].trim()}
        </div>
      </Html>
    </group>
  );
}
