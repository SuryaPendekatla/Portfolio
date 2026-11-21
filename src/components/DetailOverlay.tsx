import React, { useState, useEffect } from 'react';
import { portfolioData } from '../data/portfolioData';
import type { Project, SkillCategory, Experience, Education } from '../data/portfolioData';
import { playHover, playClick } from '../lib/sfx';

interface DetailOverlayProps {
  activeTab: string;
  selectedProject: Project | null;
  onCloseProject: () => void;
  onCloseAbout: () => void;
  onCloseContact: () => void;
}

// Accent colors cycle per skill category so each block reads as its own "module"
const CATEGORY_ACCENTS = ['var(--color-magenta)', 'var(--color-cyan)', 'var(--color-gold)'];

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
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const contactEmail = portfolioData.social.email;

  useEffect(() => {
    if (activeTab === 'contact') {
      setStatus('idle');
    }
  }, [activeTab]);

  // The site is static (no backend), so the form hands the message to the visitor's own mail
  // app, pre-addressed and pre-filled — the message is actually delivered once they hit send.
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    playClick();
    const subject = `Portfolio inquiry from ${name}`;
    const body = `${message}\n\n— ${name}\n${email}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('success');
    setName('');
    setEmail('');
    setMessage('');
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
              <button className="close-btn" onClick={onCloseProject} onMouseEnter={() => playHover()}>[ CLOSE ]</button>

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

              {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                <div className="project-metrics">
                  {selectedProject.metrics.map((metric, idx) => (
                    <div key={idx} className="project-metric">
                      <span className="project-metric-value">{metric.value}</span>
                      <span className="project-metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="section-heading">MISSION DEBRIEF // HIGHLIGHTS</h3>
              <ul className="bullet-list project-highlights">
                {selectedProject.highlights.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>

              {(selectedProject.github || selectedProject.live) && (
                <div className="project-links">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      Source Code
                    </a>
                  )}
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── About & Skills ── */}
          {activeTab === 'about' && !selectedProject && (
            <div>
              <button className="close-btn" onClick={onCloseAbout} onMouseEnter={() => playHover()}>[ SHUTDOWN ]</button>

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
              <h3 className="section-heading">MISSION LOG // EXPERIENCE</h3>

              <div className="timeline">
                {portfolioData.experience.map((exp: Experience, idx: number) => (
                  <div key={idx} className="timeline-row">
                    <div className="timeline-period">{exp.period}</div>
                    <div>
                      <div className="timeline-role">{exp.role}</div>
                      <div className="timeline-company">{exp.company}</div>
                      <ul className="bullet-list">
                        {exp.points.map((point, pidx) => (
                          <li key={pidx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education & Certifications */}
              <h3 className="section-heading">TRAINING LOG // EDUCATION</h3>

              <div className="timeline">
                {portfolioData.education.map((edu: Education, idx: number) => (
                  <div key={idx} className="timeline-row">
                    <div className="timeline-period">{edu.period}</div>
                    <div>
                      <div className="timeline-role">{edu.title}</div>
                      <div className="timeline-company">{edu.institution}</div>
                      {edu.note && <div className="timeline-note">{edu.note}</div>}
                    </div>
                  </div>
                ))}
                <div className="timeline-row">
                  <div className="timeline-period">CERTIFICATIONS</div>
                  <ul className="bullet-list">
                    {portfolioData.certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Skills Grid */}
              <h3 className="section-heading">SYSTEM CAPABILITIES</h3>

              <div className="skills-container">
                {portfolioData.skills.map((category: SkillCategory, idx: number) => {
                  const accent = CATEGORY_ACCENTS[idx % CATEGORY_ACCENTS.length];
                  return (
                    <div key={idx} className="skills-category glass-panel">
                      <h4 className="category-title skill-category-header" style={{ color: accent }}>
                        {category.title}
                        <span className="skill-level-badge">{category.skills.length} MODULES</span>
                      </h4>
                      <div className="skill-chips">
                        {category.skills.map((skill, sidx) => (
                          <span key={sidx} className="skill-chip" style={{ borderLeftColor: accent }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Contact Terminal ── */}
          {activeTab === 'contact' && !selectedProject && (
            <div>
              <button className="close-btn" onClick={onCloseContact} onMouseEnter={() => playHover()}>[ DISCONNECT ]</button>

              <div className="project-header">
                <div>
                  <h2 className="project-title">TRANSMIT SIGNAL</h2>
                  <span className="project-tag">ESTABLISHING DATA BRIDGE</span>
                </div>
              </div>

              <p className="project-body" style={{ marginBottom: '1rem' }}>
                Open to AI product engineering roles and collaborations. Reach{' '}
                <span style={{ color: 'var(--color-cyan)' }}>{portfolioData.bio.name}</span> directly on any
                channel below, or compose a message in the console.
              </p>

              <div className="contact-channels">
                <a className="contact-channel" href={`mailto:${contactEmail}`} onMouseEnter={() => playHover()}>
                  <span className="contact-channel-label">EMAIL</span>
                  <span className="contact-channel-value">{contactEmail}</span>
                </a>
                <a
                  className="contact-channel"
                  href={portfolioData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playHover()}
                >
                  <span className="contact-channel-label">LINKEDIN</span>
                  <span className="contact-channel-value">in/pendekatla-surya</span>
                </a>
                <a
                  className="contact-channel"
                  href={portfolioData.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => playHover()}
                >
                  <span className="contact-channel-label">GITHUB</span>
                  <span className="contact-channel-value">@SuryaPendekatla</span>
                </a>
              </div>

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
                  <h3 className="form-status">SIGNAL HANDED TO YOUR MAIL CLIENT</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6 }}>
                    Your email app should now be open with the message ready — hit send there to complete the
                    transmission. Nothing opened? Write to{' '}
                    <a href={`mailto:${contactEmail}`} style={{ color: 'var(--color-cyan)' }}>{contactEmail}</a>.
                  </p>
                  <button className="btn-secondary" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>
                    Compose Another Transmission
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
                    style={{ marginTop: '0.5rem' }}
                  >
                    SEND SIGNAL
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
