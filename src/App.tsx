import { useState } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { LoadingScreen } from './components/LoadingScreen';
import { NavigationHUD } from './components/NavigationHUD';
import { DetailOverlay } from './components/DetailOverlay';
import { portfolioData } from './data/portfolioData';
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
        <section className="home-hero glass-panel">
          <h1>
            SURYA <span>PENDEKATLA</span>
          </h1>
          <h2>{portfolioData.bio.role}</h2>
          <p>{portfolioData.bio.tagline}</p>
          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => setActiveTab('projects')}
            >
              System Projects
            </button>
            <button
              className="btn-secondary"
              onClick={() => setActiveTab('contact')}
            >
              Signal Transmit
            </button>
          </div>
        </section>
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
