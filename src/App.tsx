import { useEffect, useState } from 'react';
import { CanvasContainer } from './components/CanvasContainer';
import { LoadingScreen } from './components/LoadingScreen';
import { NavigationHUD } from './components/NavigationHUD';
import { DetailOverlay } from './components/DetailOverlay';
import { HeroSection } from './components/HeroSection';
import { CustomCursor } from './components/CustomCursor';
import { AchievementToast } from './components/AchievementToast';
import { useAchievements } from './hooks/useAchievements';
import { primeAudio, playOpen, playClose } from './lib/sfx';
import { portfolioData } from './data/portfolioData';
import type { Project } from './data/portfolioData';

const SECTION_ACHIEVEMENTS: Record<string, { title: string; description: string }> = {
  home: { title: 'SYSTEM BOOTED', description: 'Reached the terminal home screen.' },
  projects: { title: 'ARCHIVE ACCESSED', description: 'Opened the projects sector.' },
  about: { title: 'IDENTITY VERIFIED', description: 'Reviewed the operator profile.' },
  contact: { title: 'SIGNAL LINKED', description: 'Opened the transmit console.' }
};

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { current: achievement, unlock, dismissCurrent, isUnlocked } = useAchievements();

  // Audio requires a user gesture to start — prime it on the very first click anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      primeAudio();
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  // Section-visit achievements
  useEffect(() => {
    const payload = SECTION_ACHIEVEMENTS[activeTab];
    if (payload) unlock(`section:${activeTab}`, payload);
  }, [activeTab, unlock]);

  useEffect(() => {
    const allSections = Object.keys(SECTION_ACHIEVEMENTS).every((s) => isUnlocked(`section:${s}`));
    if (allSections) {
      unlock('all-sections', { title: 'SECTOR MAP COMPLETE', description: 'Every section of the site explored.' });
    }
  }, [activeTab, isUnlocked, unlock]);

  // Project-view achievements
  useEffect(() => {
    if (selectedProject) {
      unlock(`project:${selectedProject.id}`, {
        title: `${selectedProject.title.toUpperCase()} — DECRYPTED`,
        description: 'Project file opened.'
      });
    }
  }, [selectedProject, unlock]);

  useEffect(() => {
    const allProjects = portfolioData.projects.every((p) => isUnlocked(`project:${p.id}`));
    if (allProjects) {
      unlock('all-projects', { title: 'ARCHIVE FULLY DECRYPTED', description: 'Every project file inspected.' });
    }
  }, [selectedProject, isUnlocked, unlock]);

  // Close modals handlers
  const handleCloseProject = () => {
    playClose();
    setSelectedProject(null);
  };

  const handleCloseAbout = () => {
    playClose();
    setActiveTab('home');
  };

  const handleCloseContact = () => {
    playClose();
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
          playOpen();
          setActiveTab('about');
          setSelectedProject(null);
        }}
        onProjectClick={(project) => {
          playOpen();
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

      {/* Game-style achievement popups for exploring sections/projects */}
      {achievement && (
        <AchievementToast
          key={achievement.key}
          title={achievement.title}
          description={achievement.description}
          onDismiss={dismissCurrent}
        />
      )}
    </>
  );
}

export default App;
