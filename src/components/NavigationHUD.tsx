import { portfolioData } from '../data/portfolioData';
import type { Project } from '../data/portfolioData';
import { SoundToggle } from './SoundToggle';
import { playClick, playHover } from '../lib/sfx';

interface NavigationHUDProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export function NavigationHUD({
  activeTab,
  setActiveTab,
  selectedProject,
  setSelectedProject
}: NavigationHUDProps) {

  const handleNavClick = (tab: string) => {
    playClick();
    setActiveTab(tab);
    setSelectedProject(null); // Clear selected project to zoom camera back out
  };

  // Determine current active coordinate metrics for HUD sidebar display
  const getCoordinates = () => {
    if (selectedProject) {
      const [x, y, z] = selectedProject.position;
      return `[${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}]`;
    }
    switch (activeTab) {
      case 'about': return '[0.0, 0.9, 2.5]';
      case 'projects': return '[0.0, 2.0, 9.0]';
      case 'contact': return '[-4.0, 2.0, 5.5]';
      case 'home':
      default: return '[0.0, 0.0, 8.5]';
    }
  };

  return (
    <div className="hud-overlay">
      {/* HUD Header Navigation */}
      <header className="cyber-header interactive">
        <a href="#home" className="cyber-logo" onClick={() => handleNavClick('home')}>
          SURYA<span>.P</span>
        </a>
        <nav className="cyber-nav">
          <button
            className={`nav-btn ${activeTab === 'home' && !selectedProject ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            onMouseEnter={() => playHover()}
          >
            Terminal
          </button>
          <button
            className={`nav-btn ${activeTab === 'projects' || selectedProject ? 'active' : ''}`}
            onClick={() => handleNavClick('projects')}
            onMouseEnter={() => playHover()}
          >
            Projects
          </button>
          <button
            className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleNavClick('about')}
            onMouseEnter={() => playHover()}
          >
            About
          </button>
          <button
            className={`nav-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleNavClick('contact')}
            onMouseEnter={() => playHover()}
          >
            Contact
          </button>
        </nav>
        <SoundToggle />
      </header>

      {/* Spatial Help Prompt - appears on home page */}
      {activeTab === 'home' && !selectedProject && (
        <div className="spatial-instruction">
          DRAG MOUSE TO ROTATE ORBIT // SCROLL TO ZOOM
        </div>
      )}

      {/* Cyber Status HUD Panel Sidebar */}
      <aside className="cyber-status glass-panel interactive">
        <h3 className="status-title">Core Diagnostics</h3>

        <div className="status-item">
          <span className="status-label">STATUS</span>
          <span className="status-val" style={{ color: 'var(--color-cyan)' }}>
            ONLINE // SECURE
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">SECTOR</span>
          <span className="status-val" style={{ textTransform: 'uppercase' }}>
            {selectedProject ? `focus: ${selectedProject.title.slice(0, 10)}...` : activeTab}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">CAMERA_VECTOR</span>
          <span className="status-val">{getCoordinates()}</span>
        </div>

        <div className="status-item">
          <span className="status-label">ENGINE_STATE</span>
          <span className="status-val">WEBGL_2.0_ENABLED</span>
        </div>

        <div className="status-item">
          <span className="status-label">USER_COORD</span>
          <span className="status-val">{portfolioData.bio.location.split('Grid Coordinates ')[1] || portfolioData.bio.location}</span>
        </div>
      </aside>

      {/* HUD Footer */}
      <footer className="cyber-footer interactive">
        <div>
          © {new Date().getFullYear()} {portfolioData.bio.name}. ALL SYSTEMS OPERATIONAL.
        </div>
        <div className="cyber-footer-links">
          <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer">
            GITHUB
          </a>
          <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer">
            LINKEDIN
          </a>
          <a href={portfolioData.social.twitter} target="_blank" rel="noopener noreferrer">
            TWITTER
          </a>
        </div>
      </footer>
    </div>
  );
}
