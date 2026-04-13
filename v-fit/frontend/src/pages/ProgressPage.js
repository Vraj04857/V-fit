import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const API = 'http://localhost:8080/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg> },
  { to: '/workout', label: 'Workout', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="13" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { to: '/diet', label: 'Diet', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/></svg> },
  { to: '/progress', label: 'Progress', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { to: '/ai', label: 'AI Assistant', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M6 9C6 7.3 7.3 6 9 6C10.7 6 12 7.3 12 9C12 10.2 11.3 11.2 10.3 11.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg> },
  { to: '/profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
];

const cardBg = {
  background: 'rgba(245,245,225,0.88)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '18px', border: '1px solid rgba(44,44,26,0.1)',
};

const today = () => new Date().toISOString().split('T')[0];

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 999, background: type === 'success' ? 'rgba(74,103,65,0.95)' : 'rgba(192,57,43,0.95)', color: 'white', padding: '14px 22px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards', fontFamily: 'var(--font-body)' }}>
      {type === 'success' ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M5.5 9.5L8 12L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M9 5.5V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.8" fill="white"/></svg>}
      {message}
    </div>
  );
}

/* ── Custom Tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(245,245,225,0.97)', border: '1px solid rgba(44,44,26,0.15)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', boxShadow: '0 4px 16px rgba(44,44,26,0.1)' }}>
      <div style={{ color: 'var(--ink-muted)', marginBottom: '4px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: '500' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, color, icon, delay = 0 }) {
  return (
    <div style={{ ...cardBg, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px', animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`, transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,44,26,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ color: color || 'var(--green)', opacity: 0.7 }}>{icon}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '-0.03em', color: color || 'var(--ink)', lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--ink-light)' }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PROGRESS PAGE
   ══════════════════════════════════════════════ */
export default function ProgressPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [weightLogs, setWeightLogs] = useState([]);
  const [calorieLogs, setCalorieLogs] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState('weight');
  const [toast, setToast] = useState(null);

  // Log forms
  const [weightForm, setWeightForm] = useState({ weightKg: '', logDate: today() });
  const [calorieForm, setCalorieForm] = useState({ caloriesIntake: '', caloriesBurned: '', logDate: today() });
  const [workoutForm, setWorkoutForm] = useState({ completed: true, durationMinutes: '', logDate: today() });
  const [savingWeight, setSavingWeight] = useState(false);
  const [savingCalorie, setSavingCalorie] = useState(false);
  const [savingWorkout, setSavingWorkout] = useState(false);

  const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

  const loadData = useCallback(async (d) => {
    try {
      const [s, w, c, wk] = await Promise.allSettled([
        axios.get(`${API}/progress/summary?days=${d}`, { headers: getHeaders() }),
        axios.get(`${API}/progress/weight`, { headers: getHeaders() }),
        axios.get(`${API}/progress/calories`, { headers: getHeaders() }),
        axios.get(`${API}/progress/workout`, { headers: getHeaders() }),
      ]);
      if (s.status === 'fulfilled') setSummary(s.value.data);
      if (w.status === 'fulfilled') setWeightLogs(w.value.data || []);
      if (c.status === 'fulfilled') setCalorieLogs(c.value.data || []);
      if (wk.status === 'fulfilled') setWorkoutLogs(wk.value.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    loadData(days);
  }, [navigate, days, loadData]);

  /* ── Log handlers ── */
  const logWeight = async () => {
    if (!weightForm.weightKg) return;
    setSavingWeight(true);
    try {
      await axios.post(`${API}/progress/weight`, { weightKg: parseFloat(weightForm.weightKg), logDate: weightForm.logDate || null }, { headers: getHeaders() });
      showToast('Weight logged!');
      setWeightForm({ weightKg: '', logDate: today() });
      loadData(days);
    } catch (e) { showToast(e.response?.data || 'Failed to log weight', 'error'); }
    finally { setSavingWeight(false); }
  };

  const logCalories = async () => {
    if (!calorieForm.caloriesIntake && !calorieForm.caloriesBurned) return;
    setSavingCalorie(true);
    try {
      await axios.post(`${API}/progress/calories`, {
        caloriesIntake: parseInt(calorieForm.caloriesIntake) || 0,
        caloriesBurned: parseInt(calorieForm.caloriesBurned) || 0,
        logDate: calorieForm.logDate || null,
      }, { headers: getHeaders() });
      showToast('Calories logged!');
      setCalorieForm({ caloriesIntake: '', caloriesBurned: '', logDate: today() });
      loadData(days);
    } catch (e) { showToast(e.response?.data || 'Failed to log calories', 'error'); }
    finally { setSavingCalorie(false); }
  };

  const logWorkout = async () => {
    setSavingWorkout(true);
    try {
      await axios.post(`${API}/progress/workout`, {
        completed: workoutForm.completed,
        durationMinutes: parseInt(workoutForm.durationMinutes) || null,
        logDate: workoutForm.logDate || null,
      }, { headers: getHeaders() });
      showToast('Workout logged!');
      setWorkoutForm({ completed: true, durationMinutes: '', logDate: today() });
      loadData(days);
    } catch (e) { showToast(e.response?.data || 'Failed to log workout', 'error'); }
    finally { setSavingWorkout(false); }
  };

  /* ── CSV Export ── */
  const exportCSV = () => {
    let csv = '';
    if (activeTab === 'weight') {
      csv = 'Date,Weight (kg)\n' + weightLogs.map(l => `${l.logDate},${l.weightKg}`).join('\n');
    } else if (activeTab === 'calories') {
      csv = 'Date,Intake,Burned,Net\n' + calorieLogs.map(l => `${l.logDate},${l.caloriesIntake || 0},${l.caloriesBurned || 0},${l.netCalories || 0}`).join('\n');
    } else {
      csv = 'Date,Completed,Duration (min)\n' + workoutLogs.map(l => `${l.logDate},${l.completed},${l.durationMinutes || ''}`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vfit-${activeTab}-logs.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  // Chart data
  const weightData = (summary?.weightHistory || []).map(d => ({ date: d.date?.slice(5), weight: d.weight }));
  const calorieData = (summary?.calorieHistory || []).map(d => ({ date: d.date?.slice(5), intake: d.intake, burned: d.burned, net: d.net }));

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid rgba(44,44,26,0.15)', borderRadius: '10px', background: 'var(--white)', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none', transition: 'border-color 0.2s' };

  return (
    <PageBackground>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(240,240,216,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRight: '1px solid rgba(44,44,26,0.1)', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          <div style={{ padding: '0 24px 28px' }}><Link to="/" style={{ textDecoration: 'none' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.03em', fontStyle: 'italic' }}>V – Fit</span></Link></div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {NAV.map(item => {
              const isActive = item.to === '/progress';
              return (<Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: isActive ? '500' : '400', color: isActive ? 'var(--green)' : 'var(--ink-muted)', background: isActive ? 'var(--green-pale)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s ease' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(44,44,26,0.06)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                {item.icon}{item.label}</Link>);
            })}
          </nav>
          <div style={{ padding: '0 12px' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', fontSize: '14px', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-muted)'; }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3H3C2.4 3 2 3.4 2 4V14C2 14.6 2.4 15 3 15H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 6L16 9L12 12M16 9H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>Log out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ marginLeft: '220px', flex: 1, padding: '32px 36px', minWidth: 0 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', animation: 'fadeUp 0.5s ease forwards' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '4px' }}>Progress Tracking</h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>Log your daily stats and track trends over time</p>
            </div>
            {/* Time range pills */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(44,44,26,0.04)', borderRadius: '100px', padding: '3px' }}>
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setDays(d)} style={{
                  padding: '7px 16px', borderRadius: '100px', border: 'none',
                  background: days === d ? 'var(--green)' : 'transparent',
                  color: days === d ? 'white' : 'var(--ink-muted)',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s ease',
                }}>{d}d</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="16" cy="16" r="12" stroke="rgba(74,103,65,0.2)" strokeWidth="3"/><path d="M16 4C22.6 4 28 9.4 28 16" stroke="var(--green)" strokeWidth="3" strokeLinecap="round"/></svg>
              <span style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>Loading progress data…</span>
            </div>
          ) : (
            <>
              {/* ── Quick Log Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                {/* Weight log */}
                <div style={{ ...cardBg, padding: '20px 22px', animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2C5 2 3 4 3 6.5C3 9.5 7 12 7 12C7 12 11 9.5 11 6.5C11 4 9 2 7 2Z" stroke="var(--green)" strokeWidth="1.4"/></svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>Log Weight</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="number" step="0.1" placeholder="Weight (kg)" value={weightForm.weightKg} onChange={e => setWeightForm(p => ({ ...p, weightKg: e.target.value }))} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'var(--green)'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'} />
                    <input type="date" value={weightForm.logDate} onChange={e => setWeightForm(p => ({ ...p, logDate: e.target.value }))} style={{ ...inputStyle, fontSize: '12px' }} />
                    <button onClick={logWeight} disabled={savingWeight || !weightForm.weightKg} className="btn btn-green" style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '13px', opacity: !weightForm.weightKg ? 0.5 : 1 }}>
                      {savingWeight ? 'Saving…' : 'Log Weight'}
                    </button>
                  </div>
                </div>

                {/* Calorie log */}
                <div style={{ ...cardBg, padding: '20px 22px', animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(230,126,34,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C7 1 3 4.5 3 8C3 10.5 4.8 12.5 7 12.5C9.2 12.5 11 10.5 11 8C11 4.5 7 1 7 1Z" stroke="#E67E22" strokeWidth="1.4"/></svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>Log Calories</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="number" placeholder="Calories intake" value={calorieForm.caloriesIntake} onChange={e => setCalorieForm(p => ({ ...p, caloriesIntake: e.target.value }))} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-light)'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'} />
                    <input type="number" placeholder="Calories burned" value={calorieForm.caloriesBurned} onChange={e => setCalorieForm(p => ({ ...p, caloriesBurned: e.target.value }))} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-light)'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'} />
                    <input type="date" value={calorieForm.logDate} onChange={e => setCalorieForm(p => ({ ...p, logDate: e.target.value }))} style={{ ...inputStyle, fontSize: '12px' }} />
                    <button onClick={logCalories} disabled={savingCalorie} style={{ width: '100%', padding: '9px', borderRadius: '100px', border: 'none', background: 'var(--accent-light)', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {savingCalorie ? 'Saving…' : 'Log Calories'}
                    </button>
                  </div>
                </div>

                {/* Workout log */}
                <div style={{ ...cardBg, padding: '20px 22px', animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(33,150,243,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3.5" stroke="#2196F3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink)' }}>Log Workout</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setWorkoutForm(p => ({ ...p, completed: true }))} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1.5px solid ${workoutForm.completed ? '#2196F3' : 'rgba(44,44,26,0.15)'}`, background: workoutForm.completed ? 'rgba(33,150,243,0.08)' : 'var(--white)', color: workoutForm.completed ? '#2196F3' : 'var(--ink-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Completed</button>
                      <button onClick={() => setWorkoutForm(p => ({ ...p, completed: false }))} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1.5px solid ${!workoutForm.completed ? 'var(--accent)' : 'rgba(44,44,26,0.15)'}`, background: !workoutForm.completed ? 'rgba(192,57,43,0.06)' : 'var(--white)', color: !workoutForm.completed ? 'var(--accent)' : 'var(--ink-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Skipped</button>
                    </div>
                    <input type="number" placeholder="Duration (min)" value={workoutForm.durationMinutes} onChange={e => setWorkoutForm(p => ({ ...p, durationMinutes: e.target.value }))} style={inputStyle} onFocus={e => e.currentTarget.style.borderColor = '#2196F3'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'} />
                    <input type="date" value={workoutForm.logDate} onChange={e => setWorkoutForm(p => ({ ...p, logDate: e.target.value }))} style={{ ...inputStyle, fontSize: '12px' }} />
                    <button onClick={logWorkout} disabled={savingWorkout} style={{ width: '100%', padding: '9px', borderRadius: '100px', border: 'none', background: '#2196F3', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {savingWorkout ? 'Saving…' : 'Log Workout'}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Stat Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                <StatCard delay={0.08} label="Current Weight" value={summary?.currentWeight ? `${summary.currentWeight} kg` : '—'}
                  sub={summary?.weightChange != null ? `${summary.weightChange > 0 ? '+' : ''}${summary.weightChange?.toFixed(1)} kg` : 'No data'}
                  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C6 2 4 4 4 6.5C4 9.5 8 13 8 13C8 13 12 9.5 12 6.5C12 4 10 2 8 2Z" stroke="currentColor" strokeWidth="1.4"/></svg>} />
                <StatCard delay={0.14} label="Avg Calories In" value={summary?.avgCaloriesIntake ?? '—'} sub="kcal / day" color="var(--accent-light)"
                  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1C8 1 4 5 4 9C4 11.8 5.8 14 8 14C10.2 14 12 11.8 12 9C12 5 8 1 8 1Z" stroke="currentColor" strokeWidth="1.4"/></svg>} />
                <StatCard delay={0.2} label="Avg Calories Burned" value={summary?.avgCaloriesBurned ?? '—'} sub="kcal / day" color="var(--accent)"
                  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 5.5H14L11 8.5L12 13L8 10.5L4 13L5 8.5L2 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>} />
                <StatCard delay={0.26} label="Workouts Done" value={summary?.completedWorkouts ?? '—'} sub={`last ${days} days`} color="var(--green)"
                  icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8L6 11.5L13.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>} />
              </div>

              {/* ── Charts ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Weight chart */}
                <div style={{ ...cardBg, padding: '22px 24px', animation: 'fadeUp 0.5s ease 0.15s both' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Weight trend</h3>
                    <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>Last {days} days</span>
                  </div>
                  {weightData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
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
                        <Tooltip content={<ChartTooltip />}/>
                        <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#4A6741" strokeWidth={2} fill="url(#wGrad)" dot={false} animationDuration={1200}/>
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '8px', opacity: 0.4 }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M4 28L10 18L16 22L24 12L32 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p style={{ fontSize: '13px', color: 'var(--ink-light)' }}>No weight data yet</p>
                    </div>
                  )}
                </div>

                {/* Calorie chart */}
                <div style={{ ...cardBg, padding: '22px 24px', animation: 'fadeUp 0.5s ease 0.2s both' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Calorie balance</h3>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                      <span style={{ color: '#E67E22' }}>● Intake</span>
                      <span style={{ color: '#C0392B' }}>● Burned</span>
                      <span style={{ color: '#2196F3' }}>● Net</span>
                    </div>
                  </div>
                  {calorieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={calorieData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(44,44,26,0.06)"/>
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false}/>
                        <YAxis tick={{ fontSize: 11, fill: '#8C8C6A' }} tickLine={false} axisLine={false}/>
                        <Tooltip content={<ChartTooltip />}/>
                        <Line type="monotone" dataKey="intake" name="Intake" stroke="#E67E22" strokeWidth={2} dot={false} animationDuration={1200}/>
                        <Line type="monotone" dataKey="burned" name="Burned" stroke="#C0392B" strokeWidth={2} dot={false} strokeDasharray="4 2" animationDuration={1200}/>
                        <Line type="monotone" dataKey="net" name="Net" stroke="#2196F3" strokeWidth={1.5} dot={false} strokeDasharray="2 2" animationDuration={1200}/>
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '8px', opacity: 0.4 }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4C18 4 10 10 10 19C10 24 13.6 28 18 28C22.4 28 26 24 26 19C26 10 18 4 18 4Z" stroke="currentColor" strokeWidth="2.5"/></svg>
                      <p style={{ fontSize: '13px', color: 'var(--ink-light)' }}>No calorie data yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── History Logs ── */}
              <div style={{ ...cardBg, padding: '22px 24px', animation: 'fadeUp 0.5s ease 0.25s both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['weight', 'calories', 'workouts'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '7px 16px', borderRadius: '100px', border: 'none',
                        background: activeTab === tab ? 'var(--green)' : 'rgba(44,44,26,0.05)',
                        color: activeTab === tab ? 'white' : 'var(--ink-muted)',
                        fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', textTransform: 'capitalize',
                      }}>{tab}</button>
                    ))}
                  </div>
                  <button onClick={exportCSV} style={{ padding: '7px 14px', borderRadius: '100px', border: '1.5px solid rgba(44,44,26,0.15)', background: 'transparent', color: 'var(--ink-muted)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2V9M7 9L4 6.5M7 9L10 6.5M2 11H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Export CSV
                  </button>
                </div>

                {/* Table */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {activeTab === 'weight' && (
                    weightLogs.length === 0 ? <p style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--ink-light)' }}>No weight logs yet</p> : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ borderBottom: '1px solid rgba(44,44,26,0.08)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                          <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight (kg)</th>
                        </tr></thead>
                        <tbody>{weightLogs.slice(0, 30).map((log, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(44,44,26,0.04)', animation: `slideUp 0.3s ease ${i * 0.02}s both` }}>
                            <td style={{ padding: '10px', color: 'var(--ink-muted)' }}>{log.logDate}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', color: 'var(--ink)' }}>{log.weightKg}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    )
                  )}

                  {activeTab === 'calories' && (
                    calorieLogs.length === 0 ? <p style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--ink-light)' }}>No calorie logs yet</p> : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ borderBottom: '1px solid rgba(44,44,26,0.08)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Date</th>
                          <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: '#E67E22', textTransform: 'uppercase' }}>Intake</th>
                          <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: '#C0392B', textTransform: 'uppercase' }}>Burned</th>
                          <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: '#2196F3', textTransform: 'uppercase' }}>Net</th>
                        </tr></thead>
                        <tbody>{calorieLogs.slice(0, 30).map((log, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(44,44,26,0.04)', animation: `slideUp 0.3s ease ${i * 0.02}s both` }}>
                            <td style={{ padding: '10px', color: 'var(--ink-muted)' }}>{log.logDate}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#E67E22', fontWeight: '500' }}>{log.caloriesIntake || 0}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#C0392B', fontWeight: '500' }}>{log.caloriesBurned || 0}</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#2196F3', fontWeight: '500' }}>{log.netCalories || 0}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    )
                  )}

                  {activeTab === 'workouts' && (
                    workoutLogs.length === 0 ? <p style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--ink-light)' }}>No workout logs yet</p> : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead><tr style={{ borderBottom: '1px solid rgba(44,44,26,0.08)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Date</th>
                          <th style={{ textAlign: 'center', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Status</th>
                          <th style={{ textAlign: 'right', padding: '8px 10px', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Duration</th>
                        </tr></thead>
                        <tbody>{workoutLogs.slice(0, 30).map((log, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(44,44,26,0.04)', animation: `slideUp 0.3s ease ${i * 0.02}s both` }}>
                            <td style={{ padding: '10px', color: 'var(--ink-muted)' }}>{log.logDate}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>
                              <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '500', background: log.completed ? 'var(--green-pale)' : 'rgba(192,57,43,0.08)', color: log.completed ? 'var(--green)' : 'var(--accent)' }}>
                                {log.completed ? 'Completed' : 'Skipped'}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500', color: 'var(--ink)' }}>{log.durationMinutes ? `${log.durationMinutes} min` : '—'}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    )
                  )}
                </div>
              </div>

              <div style={{ height: '32px' }} />
            </>
          )}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </PageBackground>
  );
}