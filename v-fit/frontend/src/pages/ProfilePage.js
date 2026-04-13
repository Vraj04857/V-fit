import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';

const API = 'http://localhost:8080/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

/* ── Sidebar nav (shared with Dashboard) ── */
const NAV = [
    { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg> },
    { to: '/workout', label: 'Workout', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="13" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
    { to: '/diet', label: 'Diet', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6.5 11C7.3 12.2 8.1 12.8 9 12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/></svg> },
    { to: '/progress', label: 'Progress', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
    { to: '/ai', label: 'AI Assistant', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M6 9C6 7.3 7.3 6 9 6C10.7 6 12 7.3 12 9C12 10.2 11.3 11.2 10.3 11.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg> },
    { to: '/profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
];

const GOALS = [
  { value: 'WEIGHT_LOSS', label: 'Weight Loss', emoji: '🔥' },
  { value: 'MUSCLE_GAIN', label: 'Muscle Gain', emoji: '💪' },
  { value: 'MAINTAIN_FITNESS', label: 'Maintain', emoji: '⚖️' },
  { value: 'ENDURANCE', label: 'Endurance', emoji: '🏃' },
];

const DIETS = [
  { value: 'BALANCED', label: 'Balanced' },
  { value: 'VEGETARIAN', label: 'Vegetarian' },
  { value: 'VEGAN', label: 'Vegan' },
  { value: 'KETO', label: 'Keto' },
  { value: 'LOW_CARB', label: 'Low Carb' },
  { value: 'HIGH_PROTEIN', label: 'High Protein' },
];

const ACTIVITY = [
  { value: 'SEDENTARY', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'LIGHT', label: 'Light', desc: '1-3 days/week' },
  { value: 'MODERATE', label: 'Moderate', desc: '3-5 days/week' },
  { value: 'ACTIVE', label: 'Active', desc: '6-7 days/week' },
  { value: 'VERY_ACTIVE', label: 'Very Active', desc: 'Intense daily' },
];

const GENDERS = ['Male', 'Female', 'Other'];

/* ── Toast component ── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 999,
      background: type === 'success' ? 'rgba(74,103,65,0.95)' : 'rgba(192,57,43,0.95)',
      color: 'white', padding: '14px 22px', borderRadius: '14px',
      fontSize: '14px', fontWeight: '500',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      fontFamily: 'var(--font-body)',
    }}>
      {type === 'success' ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/>
          <path d="M5.5 9.5L8 12L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/>
          <path d="M9 5.5V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="9" cy="12.5" r="0.8" fill="white"/>
        </svg>
      )}
      {message}
    </div>
  );
}

/* ── Pill Selector ── */
function PillSelector({ options, value, onChange, colorActive = 'var(--green)', bgActive = 'var(--green-pale)' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map((opt, i) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '9px 18px',
              borderRadius: '100px',
              border: `1.5px solid ${isActive ? colorActive : 'rgba(44,44,26,0.15)'}`,
              background: isActive ? bgActive : 'rgba(250,250,240,0.6)',
              color: isActive ? colorActive : 'var(--ink-muted)',
              fontSize: '13px',
              fontWeight: isActive ? '600' : '400',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.3)'; e.currentTarget.style.transform = 'scale(1.02)'; }}}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}}
          >
            {opt.emoji && <span style={{ marginRight: '4px' }}>{opt.emoji}</span>}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Activity Level Scale ── */
function ActivityScale({ value, onChange }) {
  const idx = ACTIVITY.findIndex(a => a.value === value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'stretch' }}>
        {ACTIVITY.map((level, i) => {
          const isActive = level.value === value;
          const isPast = i <= idx;
          const heights = [28, 38, 50, 62, 76];
          return (
            <button
              key={level.value}
              onClick={() => onChange(level.value)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                padding: '0',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                animation: `growUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
              }}
            >
              <div style={{
                width: '100%',
                height: `${heights[i]}px`,
                borderRadius: '8px 8px 4px 4px',
                background: isPast
                  ? `linear-gradient(180deg, ${isActive ? 'var(--green)' : 'var(--green-light)'} 0%, var(--green) 100%)`
                  : 'rgba(44,44,26,0.08)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isActive ? 'scaleY(1.08)' : 'scaleY(1)',
                transformOrigin: 'bottom',
                boxShadow: isActive ? '0 -4px 16px rgba(74,103,65,0.25)' : 'none',
              }} />
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? 'var(--green)' : 'var(--ink-light)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}>
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
      {value && (
        <div style={{
          fontSize: '12px', color: 'var(--ink-muted)',
          textAlign: 'center', fontStyle: 'italic',
          animation: 'fadeIn 0.3s ease',
        }}>
          {ACTIVITY.find(a => a.value === value)?.desc}
        </div>
      )}
    </div>
  );
}

/* ── Section Card ── */
function SectionCard({ title, icon, children, delay = 0 }) {
  return (
    <div style={{
      background: 'rgba(245,245,225,0.88)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderRadius: '18px',
      border: '1px solid rgba(44,44,26,0.1)',
      padding: '26px 28px',
      animation: `fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,44,26,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ color: 'var(--green)', opacity: 0.8 }}>{icon}</div>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Main Profile Page ── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({});
  const [activeNav] = useState('/profile');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`, { headers: getHeaders() });
        setProfile(res.data);
        setForm(res.data);
      } catch (e) {
        console.error('Failed to load profile:', e);
        showToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API}/profile`, form, { headers: getHeaders() });
      setProfile(res.data);
      setForm(res.data);
      setEditing(false);
      showToast('Profile updated successfully!');
    } catch (e) {
      showToast(e.response?.data || 'Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (!editing) setEditing(true);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatGoal = (g) => !g ? 'Not set' : g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  return (
    <PageBackground>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: '220px', flexShrink: 0,
          background: 'rgba(240,240,216,0.88)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(44,44,26,0.1)',
          display: 'flex', flexDirection: 'column', padding: '24px 0',
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        }}>
          <div style={{ padding: '0 24px 28px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.03em', fontStyle: 'italic' }}>
                V – Fit
              </span>
            </Link>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {NAV.map(item => {
              const isActive = activeNav === item.to;
              return (
                <Link key={item.to} to={item.to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px', fontSize: '14px',
                    fontWeight: isActive ? '500' : '400',
                    color: isActive ? 'var(--green)' : 'var(--ink-muted)',
                    background: isActive ? 'var(--green-pale)' : 'transparent',
                    textDecoration: 'none', transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(44,44,26,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: '0 12px' }}>
            <button onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 12px', borderRadius: '10px', border: 'none',
                background: 'transparent', fontSize: '14px', color: 'var(--ink-muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 3H3C2.4 3 2 3.4 2 4V14C2 14.6 2.4 15 3 15H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M12 6L16 9L12 12M16 9H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ marginLeft: '220px', flex: 1, padding: '32px 36px', minWidth: 0 }}>

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '32px', animation: 'fadeUp 0.5s ease forwards',
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: '30px',
                letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '4px',
              }}>
                Your Profile
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                Manage your personal information and fitness preferences
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {editing && (
                <>
                  <button onClick={handleCancel} className="btn btn-outline"
                    style={{ fontSize: '13px', padding: '9px 18px', animation: 'fadeIn 0.3s ease' }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn btn-green"
                    disabled={saving}
                    style={{ fontSize: '13px', padding: '9px 18px', animation: 'fadeIn 0.3s ease' }}>
                    {saving ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                          <path d="M8 2C11.3 2 14 4.7 14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Saving…
                      </span>
                    ) : 'Save changes'}
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '400px', gap: '16px',
            }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="16" cy="16" r="12" stroke="rgba(74,103,65,0.2)" strokeWidth="3"/>
                <path d="M16 4C22.6 4 28 9.4 28 16" stroke="var(--green)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>Loading your profile…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>

              {/* ── Profile Hero Card ── */}
              <div style={{
                background: 'rgba(245,245,225,0.88)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '20px', border: '1px solid rgba(44,44,26,0.1)',
                padding: '32px', display: 'flex', alignItems: 'center', gap: '28px',
                animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Decorative background circles */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px',
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(74,103,65,0.06) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: '-30px', right: '60px',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(230,126,34,0.05) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />

                {/* Avatar */}
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', fontWeight: '600', color: 'white',
                  fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
                  flexShrink: 0, boxShadow: '0 4px 20px rgba(74,103,65,0.25)',
                  animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
                }}>
                  {getInitials(form.name || user.name)}
                </div>

                <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: '24px',
                    letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '4px',
                  }}>
                    {form.name || user.name || 'Your Name'}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                    {user.email || 'email@example.com'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {form.fitnessGoal && (
                      <span style={{
                        background: 'var(--green-pale)', color: 'var(--green)',
                        padding: '4px 12px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: '500',
                      }}>
                        {formatGoal(form.fitnessGoal)}
                      </span>
                    )}
                    {form.activityLevel && (
                      <span style={{
                        background: 'rgba(230,126,34,0.1)', color: 'var(--accent-light)',
                        padding: '4px 12px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: '500',
                      }}>
                        {formatGoal(form.activityLevel)}
                      </span>
                    )}
                    {form.dietaryPreference && (
                      <span style={{
                        background: 'rgba(33,150,243,0.08)', color: '#1976D2',
                        padding: '4px 12px', borderRadius: '100px',
                        fontSize: '12px', fontWeight: '500',
                      }}>
                        {formatGoal(form.dietaryPreference)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit toggle */}
                {!editing && (
                  <button onClick={() => setEditing(true)}
                    style={{
                      padding: '9px 18px', borderRadius: '100px',
                      border: '1.5px solid rgba(44,44,26,0.2)',
                      background: 'rgba(250,250,240,0.8)',
                      color: 'var(--ink-muted)', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'all 0.2s ease', position: 'relative', zIndex: 1,
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.2)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                    Edit
                  </button>
                )}
              </div>

              {/* ── Personal Information ── */}
              <SectionCard
                delay={0.12}
                title="Personal Information"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" value={form.name || ''} readOnly={!editing}
                      onChange={e => handleChange('name', e.target.value)}
                      style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" value={form.age || ''} readOnly={!editing}
                      onChange={e => handleChange('age', parseInt(e.target.value) || null)}
                      style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    {editing ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {GENDERS.map(g => (
                          <button key={g} onClick={() => handleChange('gender', g)}
                            style={{
                              flex: 1, padding: '11px', borderRadius: 'var(--radius-md)',
                              border: `1.5px solid ${form.gender === g ? 'var(--green)' : 'rgba(44,44,26,0.18)'}`,
                              background: form.gender === g ? 'var(--green-pale)' : 'var(--white)',
                              color: form.gender === g ? 'var(--green)' : 'var(--ink-muted)',
                              fontSize: '14px', fontWeight: form.gender === g ? '500' : '400',
                              cursor: 'pointer', fontFamily: 'var(--font-body)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input type="text" className="form-input" value={form.gender || 'Not set'} readOnly
                        style={{ opacity: 0.8, cursor: 'default' }}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input type="number" className="form-input" value={form.height || ''} readOnly={!editing}
                      onChange={e => handleChange('height', parseFloat(e.target.value) || null)}
                      style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input type="number" className="form-input" value={form.weight || ''} readOnly={!editing}
                      onChange={e => handleChange('weight', parseFloat(e.target.value) || null)}
                      style={{ opacity: editing ? 1 : 0.8, cursor: editing ? 'text' : 'default' }}
                    />
                  </div>
                  {form.height && form.weight && (
                    <div className="form-group">
                      <label className="form-label">BMI</label>
                      <div style={{
                        padding: '12px 16px', borderRadius: 'var(--radius-md)',
                        background: 'var(--green-pale)', color: 'var(--green)',
                        fontSize: '15px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}>
                        {(form.weight / ((form.height / 100) ** 2)).toFixed(1)}
                        <span style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                          {(() => {
                            const bmi = form.weight / ((form.height / 100) ** 2);
                            if (bmi < 18.5) return 'Underweight';
                            if (bmi < 25) return 'Normal';
                            if (bmi < 30) return 'Overweight';
                            return 'Obese';
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>

              {/* ── Fitness Goal ── */}
              <SectionCard
                delay={0.2}
                title="Fitness Goal"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>}
              >
                <PillSelector
                  options={GOALS}
                  value={form.fitnessGoal}
                  onChange={v => handleChange('fitnessGoal', v)}
                />
                {!editing && !form.fitnessGoal && (
                  <p style={{ fontSize: '13px', color: 'var(--ink-light)', marginTop: '10px', fontStyle: 'italic' }}>
                    Click a goal to set your fitness target — this powers auto-generated plans
                  </p>
                )}
              </SectionCard>

              {/* ── Dietary Preference ── */}
              <SectionCard
                delay={0.28}
                title="Dietary Preference"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/></svg>}
              >
                <PillSelector
                  options={DIETS}
                  value={form.dietaryPreference}
                  onChange={v => handleChange('dietaryPreference', v)}
                  colorActive="var(--accent-light)"
                  bgActive="rgba(230,126,34,0.1)"
                />
              </SectionCard>

              {/* ── Activity Level ── */}
              <SectionCard
                delay={0.36}
                title="Activity Level"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              >
                <ActivityScale
                  value={form.activityLevel}
                  onChange={v => handleChange('activityLevel', v)}
                />
              </SectionCard>

              {/* ── Account ── */}
              <SectionCard
                delay={0.44}
                title="Account"
                icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 7.5H16" stroke="currentColor" strokeWidth="1.6"/></svg>}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 18px', borderRadius: '12px',
                    background: 'rgba(250,250,240,0.6)',
                    border: '1px solid rgba(44,44,26,0.06)',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>Email</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{user.email || 'Not available'}</div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: '500', color: 'var(--green)',
                      background: 'var(--green-pale)', padding: '4px 10px',
                      borderRadius: '100px',
                    }}>
                      Verified
                    </span>
                  </div>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 18px', borderRadius: '12px',
                    background: 'rgba(250,250,240,0.6)',
                    border: '1px solid rgba(44,44,26,0.06)',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>Member since</div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently joined'}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(44,44,26,0.08)', paddingTop: '16px', marginTop: '4px' }}>
                    <button onClick={handleLogout}
                      style={{
                        padding: '10px 20px', borderRadius: '100px',
                        border: '1.5px solid rgba(192,57,43,0.25)',
                        background: 'rgba(192,57,43,0.04)',
                        color: 'var(--accent)', fontSize: '13px', fontWeight: '500',
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                        transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.1)'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.04)'; e.currentTarget.style.borderColor = 'rgba(192,57,43,0.25)'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5.5 2H2.5C2 2 1.5 2.4 1.5 3V11C1.5 11.6 2 12 2.5 12H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        <path d="M9.5 4.5L12.5 7L9.5 9.5M12.5 7H5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Log out of account
                    </button>
                  </div>
                </div>
              </SectionCard>

              {/* Bottom spacing */}
              <div style={{ height: '32px' }} />
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Additional animations */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes growUp {
          from { opacity: 0; transform: scaleY(0); }
          to { opacity: 1; transform: scaleY(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </PageBackground>
  );
}