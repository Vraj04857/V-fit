import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const API = '/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg> },
  { to: '/workout', label: 'Workout', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="13" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { to: '/diet', label: 'Diet', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6.5 11C7.3 12.2 8.1 12.8 9 12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/></svg> },
  { to: '/progress', label: 'Progress', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { to: '/ai', label: 'AI Assistant', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M6 9C6 7.3 7.3 6 9 6C10.7 6 12 7.3 12 9C12 10.2 11.3 11.2 10.3 11.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg> },
  { to: '/profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
];

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: 'rgba(245,245,225,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(44,44,26,0.1)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,44,26,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ color: color || 'var(--green)', opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '-0.03em', color: color || 'var(--ink)', lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--ink-light)' }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(245,245,225,0.97)',
      border: '1px solid rgba(44,44,26,0.15)',
      borderRadius: '10px',
      padding: '10px 14px',
      fontSize: '13px',
      boxShadow: '0 4px 16px rgba(44,44,26,0.1)',
    }}>
      <div style={{ color: 'var(--ink-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: '500' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon, text, linkTo, linkLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: '12px' }}>
      <div style={{ opacity: 0.25 }}>{icon}</div>
      <p style={{ fontSize: '13px', color: 'var(--ink-light)', textAlign: 'center' }}>{text}</p>
      {linkTo && <Link to={linkTo} className="btn btn-green" style={{ fontSize: '13px', padding: '8px 20px' }}>{linkLabel}</Link>}
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('/dashboard');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [p, s, w, d] = await Promise.allSettled([
          axios.get(`${API}/profile`, { headers: getHeaders() }),
          axios.get(`${API}/progress/summary?days=30`, { headers: getHeaders() }),
          axios.get(`${API}/workout`, { headers: getHeaders() }),
          axios.get(`${API}/diet`, { headers: getHeaders() }),
        ]);
        if (p.status === 'fulfilled') setProfile(p.value.data);
        if (s.status === 'fulfilled') setSummary(s.value.data);
        if (w.status === 'fulfilled') setWorkouts(w.value.data || []);
        if (d.status === 'fulfilled') setDiets(d.value.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const goalLabel = g => !g ? 'Not set' : g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  const weightData = (summary?.weightHistory || []).map(d => ({ date: d.date?.slice(5), weight: d.weight }));
  const calorieData = (summary?.calorieHistory || []).map(d => ({ date: d.date?.slice(5), intake: d.intake, burned: d.burned }));
  const latestWorkout = workouts[0] || null;
  const latestDiet = diets[0] || null;

  const cardBg = {
    background: 'rgba(245,245,225,0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(44,44,26,0.1)',
    padding: '22px 24px',
  };

  return (
    <PageBackground>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: '220px',
          flexShrink: 0,
          background: 'rgba(240,240,216,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(44,44,26,0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 50,
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
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setActiveNav(item.to)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: isActive ? '500' : '400',
                    color: isActive ? 'var(--green)' : 'var(--ink-muted)',
                    background: isActive ? 'var(--green-pale)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
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
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 12px',
                borderRadius: '10px', border: 'none',
                background: 'transparent', fontSize: '14px',
                color: 'var(--ink-muted)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all 0.15s ease',
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

        {/* ── Main ── */}
        <main style={{ marginLeft: '220px', flex: 1, padding: '32px 36px', minWidth: 0 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '4px' }}>
                {loading ? 'Loading…' : `Hello, ${profile?.name || user?.name || 'there'} 👋`}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                Goal: <strong style={{ color: 'var(--green)' }}>{goalLabel(profile?.fitnessGoal)}</strong>
                {profile?.activityLevel && <span> · {goalLabel(profile.activityLevel)} activity</span>}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/progress" className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>Log today</Link>
              <Link to="/workout" className="btn btn-green" style={{ fontSize: '13px', padding: '9px 18px' }}>Generate plan</Link>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--ink-muted)', fontSize: '15px' }}>
              Loading your dashboard…
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                <StatCard
                  label="Current Weight"
                  value={summary?.currentWeight ? `${summary.currentWeight} kg` : '—'}
                  sub={summary?.weightChange != null ? `${summary.weightChange > 0 ? '+' : ''}${summary.weightChange?.toFixed(1)} kg this month` : 'No data yet'}
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3C6.2 3 4 5.2 4 8C4 11.9 9 15 9 15C9 15 14 11.9 14 8C14 5.2 11.8 3 9 3Z" stroke="currentColor" strokeWidth="1.6"/><circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>}
                />
                <StatCard
                  label="Avg Calories In"
                  value={summary?.avgCaloriesIntake ?? '—'}
                  sub="kcal / day avg"
                  color="var(--accent-light)"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 6 5 10C5 12.8 6.8 15 9 15C11.2 15 13 12.8 13 10C13 6 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/></svg>}
                />
                <StatCard
                  label="Avg Calories Burned"
                  value={summary?.avgCaloriesBurned ?? '—'}
                  sub="kcal / day avg"
                  color="var(--accent)"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>}
                />
                <StatCard
                  label="Workouts Done"
                  value={summary?.completedWorkouts ?? '—'}
                  sub="last 30 days"
                  color="var(--green)"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={cardBg}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Weight trend</h3>
                    <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>Last 30 days</span>
                  </div>
                  {weightData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={weightData}>
                        <defs>
                          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4A6741" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#4A6741" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,44,26,0.06)"/>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false}/>
                        <YAxis tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false} domain={['auto','auto']}/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4A6741" strokeWidth={2} fill="url(#wGrad)" dot={false}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 28L10 18L16 22L24 12L32 18" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      text="No weight data yet"
                      linkTo="/progress"
                      linkLabel="Log weight →"
                    />
                  )}
                </div>

                <div style={cardBg}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Calorie balance</h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                      <span style={{ color: '#E67E22' }}>● Intake</span>
                      <span style={{ color: '#C0392B' }}>● Burned</span>
                    </div>
                  </div>
                  {calorieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={calorieData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,44,26,0.06)"/>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false}/>
                        <YAxis tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false}/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Line type="monotone" dataKey="intake" name="Intake" stroke="#E67E22" strokeWidth={2} dot={false}/>
                        <Line type="monotone" dataKey="burned" name="Burned" stroke="#C0392B" strokeWidth={2} dot={false} strokeDasharray="4 2"/>
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyState
                      icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4C18 4 10 10 10 19C10 24 13.6 28 18 28C22.4 28 26 24 26 19C26 10 18 4 18 4Z" stroke="#E67E22" strokeWidth="2.5"/></svg>}
                      text="No calorie data yet"
                      linkTo="/progress"
                      linkLabel="Log calories →"
                    />
                  )}
                </div>
              </div>

              {/* Plans */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Workout plan */}
                <div style={cardBg}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Active workout plan</h3>
                    <Link to="/workout" style={{ fontSize: '12px', color: 'var(--green)' }}>View all →</Link>
                  </div>
                  {latestWorkout ? (
                    <>
                      <div style={{ background: 'var(--green-pale)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--green)', marginBottom: '4px' }}>{latestWorkout.planName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--green)', opacity: 0.8 }}>
                          {goalLabel(latestWorkout.goalCategory)} · {latestWorkout.exercises?.length || 0} exercises
                          {latestWorkout.isAutoGenerated && <span style={{ marginLeft: '8px', background: 'var(--green)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>Auto</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {(latestWorkout.exercises || []).slice(0, 4).map((ex, i, arr) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(44,44,26,0.06)' : 'none' }}>
                            <span style={{ color: 'var(--ink)' }}>{ex.exerciseName || 'Exercise'}</span>
                            <span style={{ color: 'var(--ink-light)' }}>{ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ex.durationMinutes ? `${ex.durationMinutes} min` : ''}</span>
                          </div>
                        ))}
                        {(latestWorkout.exercises?.length || 0) > 4 && (
                          <div style={{ fontSize: '12px', color: 'var(--ink-light)', paddingTop: '6px' }}>+{latestWorkout.exercises.length - 4} more</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="2" y="13" width="7" height="10" rx="2" stroke="#4A6741" strokeWidth="2"/><rect x="27" y="13" width="7" height="10" rx="2" stroke="#4A6741" strokeWidth="2"/><line x1="9" y1="18" x2="27" y2="18" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                      text="No workout plan yet"
                      linkTo="/workout"
                      linkLabel="Create plan"
                    />
                  )}
                </div>

                {/* Diet plan */}
                <div style={cardBg}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Active diet plan</h3>
                    <Link to="/diet" style={{ fontSize: '12px', color: 'var(--green)' }}>View all →</Link>
                  </div>
                  {latestDiet ? (
                    <>
                      <div style={{ background: 'rgba(230,126,34,0.1)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--accent-light)', marginBottom: '4px' }}>{latestDiet.planName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--accent-light)', opacity: 0.85 }}>
                          {latestDiet.dietType || 'Custom'} · {latestDiet.targetCalories ? `${latestDiet.targetCalories} kcal target` : `${latestDiet.meals?.length || 0} meals`}
                          {latestDiet.isAutoGenerated && <span style={{ marginLeft: '8px', background: 'var(--accent-light)', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>Auto</span>}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ink-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's meals</div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {(latestDiet.meals || []).filter(m => m.dayOfWeek === 1).slice(0, 3).map((meal, i, arr) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(44,44,26,0.06)' : 'none' }}>
                            <div>
                              <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--accent-light)', textTransform: 'uppercase', marginRight: '6px' }}>{meal.mealType}</span>
                              <span style={{ color: 'var(--ink)' }}>{meal.foodName || 'Meal'}</span>
                            </div>
                            <span style={{ color: 'var(--ink-light)' }}>{meal.calories} kcal</span>
                          </div>
                        ))}
                        {!(latestDiet.meals || []).filter(m => m.dayOfWeek === 1).length && (
                          <p style={{ fontSize: '13px', color: 'var(--ink-light)' }}>No meals for day 1</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <EmptyState
                      icon={<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4C18 4 10 10 10 19C10 24 13.6 28 18 28C22.4 28 26 24 26 19C26 10 18 4 18 4Z" stroke="#E67E22" strokeWidth="2"/></svg>}
                      text="No diet plan yet"
                      linkTo="/diet"
                      linkLabel="Create plan"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </PageBackground>
  );
}