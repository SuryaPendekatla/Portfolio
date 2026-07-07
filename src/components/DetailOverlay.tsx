import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import type { Project, SkillCategory, Experience } from '../data/portfolioData';

interface DetailOverlayProps {
  activeTab: string;
  selectedProject: Project | null;
  onCloseProject: () => void;
  onCloseAbout: () => void;
  onCloseContact: () => void;
}

export function DetailOverlay({
  activeTab,
  selectedProject,
  onCloseProject,
  onCloseAbout,
  onCloseContact
}: DetailOverlayProps) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    if (activeTab === 'contact') {
      setStatus('idle');
    }
  }, [activeTab]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  const isOpen = !!selectedProject || activeTab === 'about' || activeTab === 'contact';

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (selectedProject) onCloseProject();
    else if (activeTab === 'about') onCloseAbout();
    else if (activeTab === 'contact') onCloseContact();
  };

  return (
    <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={handleBackdropClick}>
      {isOpen && (
        <div className="modal-content glass-panel">

          {/* ── Project Details ── */}
          {selectedProject && (
            <div>
              <button className="close-btn" onClick={onCloseProject}>[ CLOSE ]</button>

              <div className="project-header">
                <div>
                  <h2 className="project-title">{selectedProject.title}</h2>
                  <span className="project-tag">{selectedProject.tag}</span>
                </div>
              </div>

              <div className="project-tech">
                {selectedProject.tech.map((t, idx) => (
                  <span key={idx} className="tech-tag">{t}</span>
                ))}
              </div>

              <p className="project-body">{selectedProject.details}</p>

              <div className="project-links">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Source Code
                </a>
                <a
                  href={selectedProject.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  Live Demo
                </a>
              </div>
            </div>
          )}

          {/* ── About & Skills ── */}
          {activeTab === 'about' && !selectedProject && (
            <div>
              <button className="close-btn" onClick={onCloseAbout}>[ SHUTDOWN ]</button>

              <div className="project-header">
                <div>
                  <h2 className="project-title">{portfolioData.bio.name}</h2>
                  <span
                    className="project-tag"
                    style={{ color: 'var(--color-magenta)', borderColor: 'var(--color-magenta)' }}
                  >
                    {portfolioData.bio.role}
                  </span>
                </div>
              </div>

              <p className="project-body">{portfolioData.bio.summary}</p>

              {/* Experience Timeline */}
              <h3
                className="category-title"
                style={{
                  marginTop: '1.5rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '0.5rem'
                }}
              >
                MISSION LOG // EXPERIENCE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {portfolioData.experience.map((exp: Experience, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr',
                      gap: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.04)'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-hud)',
                          fontSize: '0.6rem',
                          color: 'var(--color-cyan)',
                          letterSpacing: '0.05rem'
                        }}
                      >
                        {exp.period}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-hud)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#fff',
                          marginBottom: '0.2rem'
                        }}
                      >
                        {exp.role}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-hud)',
                          fontSize: '0.65rem',
                          color: 'var(--color-magenta)',
                          marginBottom: '0.4rem',
                          textTransform: 'uppercase'
                        }}
                      >
                        {exp.company}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {exp.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills Grid */}
              <h3
                className="category-title"
                style={{
                  marginBottom: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '0.5rem'
                }}
              >
                SYSTEM CAPABILITIES
              </h3>

              <div className="skills-container">
                {portfolioData.skills.map((category: SkillCategory, idx: number) => (
                  <div key={idx} className="skills-category glass-panel">
                    <h4 className="category-title">{category.title}</h4>
                    <div className="skills-list">
                      {category.skills.map((skill, sidx) => (
                        <div key={sidx} className="skill-row">
                          <span className="skill-name">{skill.name}</span>
                          <div className="skill-bar-bg">
                            <div
                              className="skill-bar-fill"
                              style={{
                                width: `${skill.level}%`,
                                backgroundColor: idx === 0 ? 'var(--color-magenta)' : idx === 1 ? 'var(--color-cyan)' : 'var(--color-gold)',
                                boxShadow: idx === 0 ? 'var(--magenta-glow)' : idx === 1 ? 'var(--cyan-glow)' : '0 0 15px rgba(255,183,0,0.4)'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Contact Terminal ── */}
          {activeTab === 'contact' && !selectedProject && (
            <div>
              <button className="close-btn" onClick={onCloseContact}>[ DISCONNECT ]</button>

              <div className="project-header">
                <div>
                  <h2 className="project-title">TRANSMIT SIGNAL</h2>
                  <span className="project-tag">ESTABLISHING DATA BRIDGE</span>
                </div>
              </div>

              <p className="project-body" style={{ marginBottom: '1rem' }}>
                Fill out the console form below to send a message directly to{' '}
                <span style={{ color: 'var(--color-cyan)' }}>{portfolioData.bio.name}</span>'s terminal.
              </p>

              {status === 'success' ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      border: '2px solid var(--color-cyan)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'var(--color-cyan)',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      boxShadow: 'var(--cyan-glow)'
                    }}
                  >
                    ✓
                  </div>
                  <h3 className="form-status">TRANSMISSION COMPLETED</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                    Signal successfully routed. Gateway response: 200 OK.
                  </p>
                  <button className="btn-secondary" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="form-name">NAME // AGENT ID</label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      placeholder="Enter identity label"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email">ROUTING ENDPOINT (EMAIL)</label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      placeholder="endpoint@network.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-message">MESSAGE BODY</label>
                    <textarea
                      id="form-message"
                      rows={5}
                      required
                      placeholder="State core objectives..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={status === 'sending'}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {status === 'sending' ? 'TRANSMITTING...' : 'SEND SIGNAL'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
