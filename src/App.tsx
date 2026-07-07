import { useState } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { LoadingScreen } from './components/LoadingScreen';
import { NavigationHUD } from './components/NavigationHUD';
import { DetailOverlay } from './components/DetailOverlay';
import { HeroSection } from './components/HeroSection';
import { CustomCursor } from './components/CustomCursor';
import type { Project } from './data/portfolioData';

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Close modals handlers
  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleCloseAbout = () => {
    setActiveTab('home');
  };

  const handleCloseContact = () => {
    setActiveTab('home');
  };

  return (
    <>
      {/* Custom cursor with hover affordance for 3D nodes and UI controls */}
      <CustomCursor />

      {/* Immersive Loading Screen */}
      <LoadingScreen />

      {/* 3D WebGL Scene Background / Core */}
      <CanvasContainer
        activeTab={activeTab}
        selectedProject={selectedProject}
        onTerminalClick={() => {
          setActiveTab('about');
          setSelectedProject(null);
        }}
        onProjectClick={(project) => {
          setSelectedProject(project);
          setActiveTab('projects');
        }}
      />

      {/* 2D Interactive HUD Layout (Header, Footer, Sidebar diagnostics) */}
      <NavigationHUD
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      {/* 2D Hero intro overlay - visible on home tab when not zoomed in on elements */}
      {activeTab === 'home' && !selectedProject && (
        <HeroSection
          onProjectsClick={() => setActiveTab('projects')}
          onContactClick={() => setActiveTab('contact')}
        />
      )}

      {/* 2D Detail Modal Overlay System */}
      <DetailOverlay
        activeTab={activeTab}
        selectedProject={selectedProject}
        onCloseProject={handleCloseProject}
        onCloseAbout={handleCloseAbout}
        onCloseContact={handleCloseContact}
      />
    </>
  );
}

export default App;
