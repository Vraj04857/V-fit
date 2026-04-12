import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageBackground from '../components/PageBackground';

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 5V4C7 3.4 7.4 3 8 3H14C14.6 3 15 3.4 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 11H15M7 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Smart Workout Planner',
    description: 'Build custom plans or auto-generate week-long programs based on your goals — weight loss, muscle gain, or maintenance.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 7V11L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 3.5C7 3.5 9 2 11 2C13 2 15 3.5 15 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Diet Plan Generator',
    description: 'Create personalized meal plans from templates or manually. Track calories and macros for every meal, every day.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17L7 12L10 14L14 9L19 17H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M3 6H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    title: 'Progress Analytics',
    description: 'Visualize your weight trends, calorie balance, and workout streaks on an intuitive dashboard with exportable data.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 3V5M15 3V5M3 9H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="14" r="1.5" fill="currentColor" opacity="0.6"/>
        <circle cx="11" cy="14" r="1.5" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
    title: 'Reminders & Calendar',
    description: 'Stay on track with workout and diet reminders. See your full schedule in weekly and monthly calendar views.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 18L8 14M8 14C8 14 10 16 11 16C12 16 20 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="5" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17 4C17 4 18.5 5.5 18.5 7C18.5 8.5 17 10 17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'AI Fitness Assistant',
    description: 'Get real-time guidance from an AI trained on fitness and nutrition. Ask anything — from form tips to meal swaps.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 19C4 15.7 6.2 13 9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 14L16 16L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Role-based Access',
    description: 'Admin panel to manage users, workout and diet templates, and view system-wide usage statistics.',
  },
];

const steps = [
  { num: '01', title: 'Create your profile', desc: 'Set your goal, fitness level, dietary preference, and current stats.' },
  { num: '02', title: 'Generate your plan', desc: 'Let the system auto-build a workout and diet plan, or create one manually.' },
  { num: '03', title: 'Track & adjust', desc: 'Log daily progress. Watch your charts improve. Refine your plan anytime.' },
];

const stats = [
  { value: '12+', label: 'Core features' },
  { value: '20+', label: 'Food library items' },
  { value: '10+', label: 'Exercise templates' },
  { value: '100%', label: 'Personalized' },
];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageBackground>
      <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 32px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,158,94,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,57,43,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div ref={heroRef} style={{ maxWidth: '760px', position: 'relative' }}>
          <div className="animate-fadeUp" style={{ marginBottom: '24px' }}>
            <span className="tag">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="6" cy="6" r="4"/>
              </svg>
              Smart Fitness & Nutrition Platform
            </span>
          </div>

          <h1
            className="animate-fadeUp delay-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 7vw, 80px)',
              lineHeight: '1.08',
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: '28px',
            }}
          >
            Your fitness,{' '}
            <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>unified.</span>
          </h1>

          <p
            className="animate-fadeUp delay-2"
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: 'var(--ink-muted)',
              maxWidth: '560px',
              margin: '0 auto 40px',
            }}
          >
            V-Fit brings workout planning, diet tracking, progress analytics,
            and AI coaching into one clean, personalized platform.
          </p>

          <div className="animate-fadeUp delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-green btn-lg">
              Start for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a href="#features" className="btn btn-outline btn-lg">
              See features
            </a>
          </div>

          {/* Mini stats */}
          <div
            className="animate-fadeUp delay-4"
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '64px',
              flexWrap: 'wrap',
            }}
          >
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: 'var(--ink)',
                  letterSpacing: '-0.03em',
                }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-light)', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="tag" style={{ marginBottom: '16px' }}>Features</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              letterSpacing: '-0.025em',
              lineHeight: '1.15',
              marginTop: '12px',
            }}>
              Everything you need,<br />
              <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>nothing you don't.</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2px',
            background: 'var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--white)',
                  padding: '32px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: 'var(--green-pale)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--green)',
                  marginBottom: '20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  letterSpacing: '-0.01em',
                }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: '1.65' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <span className="tag" style={{ marginBottom: '20px' }}>How it works</span>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(30px, 3.5vw, 44px)',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                marginBottom: '48px',
                marginTop: '12px',
              }}>
                Three steps to a better routine.
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '24px' }}>
                    <div style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      color: 'var(--green)',
                      letterSpacing: '0.05em',
                      paddingTop: '3px',
                    }}>{s.num}</div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', letterSpacing: '-0.01em' }}>{s.title}</h4>
                      <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: '1.65' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '48px' }}>
                <Link to="/register" className="btn btn-green">
                  Get started free
                </Link>
              </div>
            </div>

            {/* Visual card panel */}
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                padding: '28px',
                boxShadow: 'var(--shadow-lg)',
              }}>
                {/* Mini dashboard mockup */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-light)', marginBottom: '6px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>This week</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Calories', value: '1,840', sub: '/ 2,100 goal', color: 'var(--green)' },
                      { label: 'Workouts', value: '3', sub: '/ 4 planned', color: 'var(--accent)' },
                    ].map(m => (
                      <div key={m.label} style={{
                        background: 'var(--cream)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                      }}>
                        <div style={{ fontSize: '12px', color: 'var(--ink-light)', marginBottom: '6px' }}>{m.label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '-0.02em', color: m.color }}>{m.value}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-light)', marginTop: '2px' }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bars */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--ink-light)', marginBottom: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Macros today</div>
                  {[
                    { label: 'Protein', pct: 78, color: 'var(--green)' },
                    { label: 'Carbs', pct: 62, color: 'var(--accent-light)' },
                    { label: 'Fats', pct: 45, color: 'var(--accent)' },
                  ].map(bar => (
                    <div key={bar.label} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{bar.label}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{bar.pct}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--cream-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: '3px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent workout */}
                <div style={{
                  background: 'var(--green-pale)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--green)', marginBottom: '2px' }}>Today: Upper Body</div>
                    <div style={{ fontSize: '12px', color: 'var(--green)' }}>4 exercises · 45 min</div>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--green)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 7L7 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                background: 'var(--ink)',
                color: 'var(--cream)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                fontSize: '12px',
                fontWeight: '500',
                boxShadow: 'var(--shadow-md)',
              }}>
                AI-powered ✦
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="section" style={{ background: 'var(--ink)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            color: 'var(--cream)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            marginBottom: '20px',
          }}>
            Ready to start your journey?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(247,244,238,0.6)', marginBottom: '36px', maxWidth: '420px', margin: '0 auto 36px' }}>
            Join V-Fit and get a complete fitness and nutrition platform — built around your goals.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-lg" style={{
              background: 'var(--cream)',
              color: 'var(--ink)',
              borderColor: 'var(--cream)',
            }}>
              Create your account
            </Link>
            <Link to="/login" className="btn btn-lg btn-ghost" style={{ color: 'rgba(247,244,238,0.7)', borderColor: 'rgba(247,244,238,0.2)' }}>
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--ink)',
        borderTop: '1px solid rgba(247,244,238,0.08)',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px',
            background: 'var(--green)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1.5C6 1.5 3.5 3.5 3.5 6.5C3.5 8.5 4.5 10 6 10C7.5 10 8.5 8.5 8.5 6.5C8.5 3.5 6 1.5 6 1.5Z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)', fontSize: '16px' }}>V-Fit</span>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(247,244,238,0.35)' }}>
          © 2025 V-Fit · Vraj Patel · Master's Thesis Project
        </p>
      </footer>
    </div>
    </PageBackground>
  );
}