import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageBackground from '../components/PageBackground';

// ── Hardcoded photo imports ──────────────────────────────────────────────────
import vrajPhoto from '../assets/vraj.jpg';
import kaufmanPhoto from '../assets/kaufman.png';
import samadianPhoto from '../assets/samadian.png';

// ── Team data ────────────────────────────────────────────────────────────────
const team = [
  {
    photo: vrajPhoto,
    name: 'Vraj Patel',
    role: 'Student',
    badgeColor: '#6B9E5E',
    tooltip: {
      badge: 'Developer & Researcher',
      details: [
        { label: 'Program', value: 'M.S. Software Engineering' },
        { label: 'Institution', value: 'University of Scranton' },
        { label: 'Project', value: 'V-Fit — Smart Fitness & Diet Planner' },
        { label: 'Duration', value: 'Two Semesters (2024 – 2025)' },
      ],
      bio: 'Built V-Fit as a full-stack thesis project spanning requirements analysis, system design, implementation, and deployment — covering every layer from React frontend to Spring Boot backend and AWS EC2 infrastructure.',
    },
  },
  {
    photo: kaufmanPhoto,
    name: 'John Kaufman',
    role: 'Thesis Advisor',
    badgeColor: '#8B6914',
    tooltip: {
      badge: 'Faculty Advisor',
      details: [
        { label: 'Title', value: 'Faculty Specialist' },
        { label: 'Department', value: 'Computer Science' },
        { label: 'Institution', value: 'University of Scranton' },
      ],
      bio: 'Provided guidance and oversight throughout the two-semester thesis project — from initial proposal and use-case analysis through final implementation, deployment, and thesis documentation.',
    },
  },
  {
    photo: samadianPhoto,
    name: 'Hiva Samadian',
    role: 'Second Reader',
    badgeColor: '#2C5F8A',
    tooltip: {
      badge: 'Second Reader',
      details: [
        { label: 'Title', value: 'Assistant Professor' },
        { label: 'Department', value: 'Computer Science' },
        { label: 'Institution', value: 'University of Scranton' },
      ],
      bio: 'Served as second reader for the thesis project, providing independent academic evaluation and feedback on system design, implementation quality, and research contributions.',
    },
  },
];

// ── Tech stack data ──────────────────────────────────────────────────────────
const stack = [
  {
    layer: 'Frontend',
    color: '#6B9E5E',
    items: ['React 18', 'React Router v6', 'Axios', 'Recharts', 'Lucide React'],
  },
  {
    layer: 'Backend',
    color: '#C0392B',
    items: ['Spring Boot 3.2', 'Java 17', 'Spring Security', 'JWT Auth', 'OpenRouter AI'],
  },
  {
    layer: 'Database',
    color: '#8B6914',
    items: ['PostgreSQL 15', 'Spring Data JPA', 'Hibernate ORM'],
  },
  {
    layer: 'DevOps',
    color: '#2C5F8A',
    items: ['Docker Compose', 'AWS EC2', 'GitHub Actions CI/CD', 'Ubuntu Server'],
  },
];

// ── Features data ────────────────────────────────────────────────────────────
const features = [
  { label: 'Workout Planner', desc: 'Custom & auto-generated weekly plans tailored to your goals.' },
  { label: 'Diet Generator', desc: 'Manual meal tracking or template-based plan generation.' },
  { label: 'Progress Analytics', desc: 'Visual dashboards for weight, calories, and workout streaks.' },
  { label: 'AI Assistant', desc: 'Real-time guidance powered by GPT-4o-mini via OpenRouter.' },
  { label: 'Role-based Access', desc: 'Admin panel for templates, users, and system-wide stats.' },
];

// ── PersonCard with directional tooltip ──────────────────────────────────────
// tooltipDir: 'left' | 'bottom' | 'right'
function PersonCard({ photo, name, role, badgeColor, tooltip, tooltipDir }) {
  const [hovered, setHovered] = useState(false);

  // Build position styles + arrow styles per direction
  const getTooltipStyle = () => {
    const base = {
      position: 'absolute',
      width: '280px',
      background: 'rgba(250,250,240,0.98)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(44,44,26,0.12)',
      boxShadow: '0 20px 60px rgba(44,44,26,0.2)',
      padding: '20px',
      zIndex: 200,
      pointerEvents: 'none',
    };
    if (tooltipDir === 'left') return {
      ...base,
      top: '50%',
      right: 'calc(100% + 16px)',
      transform: 'translateY(-50%)',
      animation: 'tooltipLeft 0.18s ease',
    };
    if (tooltipDir === 'right') return {
      ...base,
      top: '50%',
      left: 'calc(100% + 16px)',
      transform: 'translateY(-50%)',
      animation: 'tooltipRight 0.18s ease',
    };
    // bottom
    return {
      ...base,
      top: 'calc(100% + 16px)',
      left: '50%',
      transform: 'translateX(-50%)',
      animation: 'tooltipBottom 0.18s ease',
    };
  };

  const getArrowStyle = () => {
    const base = {
      position: 'absolute',
      width: '13px', height: '13px',
      background: 'rgba(250,250,240,0.98)',
      border: '1px solid rgba(44,44,26,0.12)',
    };
    if (tooltipDir === 'left') return {
      ...base,
      top: '50%', right: '-7px',
      transform: 'translateY(-50%) rotate(45deg)',
      borderBottom: 'none', borderLeft: 'none',
    };
    if (tooltipDir === 'right') return {
      ...base,
      top: '50%', left: '-7px',
      transform: 'translateY(-50%) rotate(45deg)',
      borderTop: 'none', borderRight: 'none',
    };
    // bottom — arrow points up
    return {
      ...base,
      top: '-7px', left: '50%',
      transform: 'translateX(-50%) rotate(45deg)',
      borderBottom: 'none', borderRight: 'none',
    };
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Square photo */}
      <div style={{
        width: '200px', height: '200px',
        borderRadius: '16px', overflow: 'hidden',
        border: `2px solid ${badgeColor}40`,
        boxShadow: hovered ? `0 16px 48px ${badgeColor}35` : '0 4px 20px rgba(44,44,26,0.1)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: 'default',
        background: 'rgba(107,158,94,0.06)',
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>

      {/* Name & role label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)', marginBottom: '5px' }}>{name}</div>
        <span style={{
          padding: '3px 10px', borderRadius: '100px', fontSize: '11px',
          fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em',
          color: badgeColor, background: `${badgeColor}14`,
          border: `1px solid ${badgeColor}30`,
        }}>{role}</span>
      </div>

      {/* Directional tooltip */}
      {hovered && (
        <div style={getTooltipStyle()}>
          <div style={getArrowStyle()} />

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 10px', borderRadius: '100px',
            background: `${badgeColor}14`, color: badgeColor,
            fontSize: '10px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: '10px',
            border: `1px solid ${badgeColor}30`,
          }}>
            {tooltip.badge}
          </div>

          {/* Name */}
          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)', marginBottom: '8px' }}>{name}</div>

          {/* Bio */}
          <p style={{
            fontSize: '12px', lineHeight: '1.65', color: 'var(--ink-muted)',
            margin: '0 0 12px', padding: '10px 12px',
            background: 'rgba(44,44,26,0.03)', borderRadius: '8px',
            border: '1px solid rgba(44,44,26,0.06)',
          }}>
            {tooltip.bio}
          </p>

          {/* Detail rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {tooltip.details.map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 0', borderBottom: '1px solid rgba(44,44,26,0.06)',
              }}>
                <span style={{ fontSize: '10px', color: 'var(--ink-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                <span style={{ fontSize: '11px', color: 'var(--ink)', fontWeight: '500' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      {/* Tooltip keyframe animations — one per direction */}
      <style>{`
        @keyframes tooltipLeft {
          from { opacity: 0; transform: translateY(-50%) translateX(8px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0px); }
        }
        @keyframes tooltipRight {
          from { opacity: 0; transform: translateY(-50%) translateX(-8px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0px); }
        }
        @keyframes tooltipBottom {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }
      `}</style>

      {/* Extra dimming overlay — reduces brightness of the background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'rgba(215, 215, 185, 0.52)',
        pointerEvents: 'none',
      }} />

      <PageBackground>
        <div style={{ minHeight: '100vh', fontFamily: 'var(--font-body)', position: 'relative', zIndex: 2 }}>
          <Navbar />

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <section style={{
            paddingTop: '120px', paddingBottom: '80px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '10%', left: '5%', width: '360px', height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(107,158,94,0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '0', right: '8%', width: '280px', height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto', padding: '0 32px' }}>
              <span className="tag" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ marginRight: '6px' }}>
                  <circle cx="6" cy="6" r="4" />
                </svg>
                MS Software Engineering · Thesis Project
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 6vw, 72px)',
                lineHeight: '1.08', letterSpacing: '-0.03em',
                color: 'var(--ink)', marginBottom: '20px',
              }}>
                About{' '}
                <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>V-Fit</span>
              </h1>
              <p style={{
                fontSize: '17px', lineHeight: '1.75', color: 'var(--ink-muted)',
                maxWidth: '560px', margin: '0 auto',
              }}>
                A unified fitness and nutrition platform built as a two-semester graduate
                thesis — bringing workout planning, diet tracking, progress analytics,
                and AI coaching into one cohesive experience.
              </p>
            </div>
          </section>

          {/* ── Mission ──────────────────────────────────────────────────── */}
          <section style={{ padding: '0 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              background: 'rgba(245,245,225,0.85)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '20px', border: '1px solid rgba(44,44,26,0.1)',
              padding: '48px 52px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center',
            }}>
              <div>
                <span className="tag" style={{ marginBottom: '16px', display: 'inline-flex' }}>Mission</span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  lineHeight: '1.2', letterSpacing: '-0.02em',
                  marginBottom: '18px', color: 'var(--ink)',
                }}>
                  One platform.<br />Everything fitness.
                </h2>
                <p style={{ fontSize: '15px', lineHeight: '1.75', color: 'var(--ink-muted)' }}>
                  Most fitness tools are siloed — you track calories in one app, log workouts in
                  another, and check analytics somewhere else. V-Fit consolidates all of this,
                  adding AI assistance and role-based management into a single, cohesive platform.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {features.map((f) => (
                  <div key={f.label} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(107,158,94,0.06)',
                    borderRadius: '12px', border: '1px solid rgba(107,158,94,0.12)',
                  }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'var(--green)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)', marginBottom: '2px' }}>{f.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── People ───────────────────────────────────────────────────── */}
          <section style={{ padding: '0 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="tag" style={{ marginBottom: '14px', display: 'inline-flex' }}>The People</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                letterSpacing: '-0.025em', color: 'var(--ink)',
                marginBottom: '10px',
              }}>Developer & Academic Team</h2>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                Hover over a photo to see full details
              </p>
            </div>

            {/* 3 photo cards — centered row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '52px',
              flexWrap: 'wrap',
              paddingBottom: '40px',
            }}>
              {team.map((person, i) => (
                <PersonCard
                  key={person.name}
                  {...person}
                  tooltipDir={i === 0 ? 'left' : i === 1 ? 'bottom' : 'right'}
                />
              ))}
            </div>
          </section>

          {/* ── Tech Stack ───────────────────────────────────────────────── */}
          <section style={{ padding: '0 32px 80px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="tag" style={{ marginBottom: '14px', display: 'inline-flex' }}>Built with</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                letterSpacing: '-0.025em', color: 'var(--ink)',
              }}>Technology Stack</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {stack.map((s) => (
                <div key={s.layer} style={{
                  background: 'rgba(245,245,225,0.85)',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: '16px', border: '1px solid rgba(44,44,26,0.08)',
                  padding: '24px 28px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                    <span style={{
                      fontSize: '13px', fontWeight: '600', color: 'var(--ink)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{s.layer}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {s.items.map((item) => (
                      <span key={item} style={{
                        padding: '4px 10px', borderRadius: '100px', fontSize: '12px',
                        fontWeight: '500', color: s.color,
                        background: `${s.color}14`, border: `1px solid ${s.color}25`,
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Thesis Context ───────────────────────────────────────────── */}
          <section style={{ padding: '0 32px 100px', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              background: 'var(--ink)', borderRadius: '20px',
              padding: '48px 52px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center',
            }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '100px',
                  background: 'rgba(107,158,94,0.2)', color: 'var(--green)',
                  fontSize: '12px', fontWeight: '500', letterSpacing: '0.04em',
                  marginBottom: '20px', textTransform: 'uppercase',
                }}>
                  Thesis Context
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 3vw, 34px)',
                  letterSpacing: '-0.02em', lineHeight: '1.2',
                  color: 'var(--cream)', marginBottom: '18px',
                }}>
                  Academic research,<br />real-world execution.
                </h2>
                <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'rgba(247,244,238,0.65)' }}>
                  V-Fit demonstrates that a production-grade, full-stack platform can be
                  designed and delivered within an academic timeline — complete with CI/CD,
                  cloud deployment, and AI integration.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Institution', value: 'University of Scranton' },
                  { label: 'Program', value: 'M.S. Software Engineering' },
                  { label: 'Advisor', value: 'John Kaufman' },
                  { label: 'Second Reader', value: 'Hiva Samadian' },
                  { label: 'Duration', value: 'Two Semesters · 2024 – 2025' },
                  { label: 'Deployment', value: 'AWS EC2 (Ubuntu, Docker Compose)' },
                  { label: 'Repository', value: 'github.com/Vraj04857/V-fit' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(247,244,238,0.45)', fontWeight: '500' }}>{label}</span>
                    <span style={{ fontSize: '13px', color: 'var(--cream)', fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Footer nav ── */}
          <div style={{ textAlign: 'center', paddingBottom: '60px' }}>
            <Link to="/" className="btn btn-ghost" style={{ fontSize: '14px' }}>
              ← Back to Home
            </Link>
          </div>

        </div>
      </PageBackground>
    </>
  );
}