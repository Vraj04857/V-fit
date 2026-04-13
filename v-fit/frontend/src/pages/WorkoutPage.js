import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';

const API = 'http://localhost:8080/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

/* ── Sidebar nav ── */
const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg> },
  { to: '/workout', label: 'Workout', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="13" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { to: '/diet', label: 'Diet', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6.5 11C7.3 12.2 8.1 12.8 9 12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/></svg> },
  { to: '/progress', label: 'Progress', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { to: '/ai', label: 'AI Assistant', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M6 9C6 7.3 7.3 6 9 6C10.7 6 12 7.3 12 9C12 10.2 11.3 11.2 10.3 11.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg> },
  { to: '/profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
];

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GOALS = ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTAIN_FITNESS', 'ENDURANCE', 'STRENGTH', 'FLEXIBILITY'];

const cardBg = {
  background: 'rgba(245,245,225,0.88)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '18px', border: '1px solid rgba(44,44,26,0.1)',
};

const formatGoal = g => !g ? '' : g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

/* ── Toast ── */
function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 999,
      background: type === 'success' ? 'rgba(74,103,65,0.95)' : 'rgba(192,57,43,0.95)',
      color: 'white', padding: '14px 22px', borderRadius: '14px',
      fontSize: '14px', fontWeight: '500', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '10px',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      fontFamily: 'var(--font-body)',
    }}>
      {type === 'success' ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M5.5 9.5L8 12L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M9 5.5V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.8" fill="white"/></svg>
      )}
      {message}
    </div>
  );
}

/* ── Confirm Modal ── */
function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(44,44,26,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onCancel}>
      <div style={{
        ...cardBg, padding: '28px 32px', maxWidth: '400px', width: '90%',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            style={{
              padding: '9px 18px', borderRadius: '100px', border: '1.5px solid var(--accent)',
              background: 'rgba(192,57,43,0.08)', color: 'var(--accent)',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
            {loading && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(192,57,43,0.3)" strokeWidth="2"/><path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/></svg>}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Create/Edit Modal ── */
function PlanModal({ plan, library, onSave, onClose, saving }) {
  const [name, setName] = useState(plan?.planName || '');
  const [goal, setGoal] = useState(plan?.goalCategory || '');
  const [exercises, setExercises] = useState(plan?.exercises || []);
  const [search, setSearch] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  const filteredLib = (library || []).filter(ex =>
    ex.exerciseName?.toLowerCase().includes(search.toLowerCase()) ||
    ex.category?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20);

  const addExercise = (libEx) => {
    setExercises(prev => [...prev, {
      libraryExerciseId: libEx.libraryExerciseId,
      exerciseName: libEx.exerciseName,
      category: libEx.category,
      sets: 3, reps: 12, durationMinutes: null,
      dayOfWeek: selectedDay,
    }]);
    setShowLibrary(false);
    setSearch('');
  };

  const updateExercise = (idx, field, value) => {
    setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const removeExercise = (idx) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ planName: name, goalCategory: goal || null, exercises });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(44,44,26,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        ...cardBg, padding: '0', maxWidth: '680px', width: '95%',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>
              {plan ? 'Edit Workout Plan' : 'Create Workout Plan'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Plan info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div className="form-group">
              <label className="form-label">Plan Name</label>
              <input type="text" className="form-input" placeholder="e.g. Morning Strength" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Goal Category</label>
              <select className="form-input" value={goal} onChange={e => setGoal(e.target.value)}
                style={{ cursor: 'pointer' }}>
                <option value="">Select goal...</option>
                {GOALS.map(g => <option key={g} value={g}>{formatGoal(g)}</option>)}
              </select>
            </div>
          </div>

          {/* Day tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', overflowX: 'auto' }}>
            {[1,2,3,4,5,6,7].map(d => {
              const count = exercises.filter(ex => ex.dayOfWeek === d).length;
              const isActive = selectedDay === d;
              return (
                <button key={d} onClick={() => setSelectedDay(d)}
                  style={{
                    padding: '7px 14px', borderRadius: '100px', border: 'none',
                    background: isActive ? 'var(--green)' : 'rgba(44,44,26,0.06)',
                    color: isActive ? 'white' : 'var(--ink-muted)',
                    fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                  }}>
                  {DAYS[d]}
                  {count > 0 && (
                    <span style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(74,103,65,0.15)',
                      color: isActive ? 'white' : 'var(--green)',
                      padding: '1px 6px', borderRadius: '100px', fontSize: '10px',
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px', minHeight: '200px' }}>
          {exercises.filter(ex => ex.dayOfWeek === selectedDay).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-light)' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.3, margin: '0 auto 12px' }}>
                <rect x="4" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="28" y="16" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: '13px', marginBottom: '4px' }}>No exercises for {DAYS[selectedDay]}</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>Add from the exercise library below</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {exercises.map((ex, idx) => {
                if (ex.dayOfWeek !== selectedDay) return null;
                return (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 14px', borderRadius: '12px',
                    background: 'rgba(250,250,240,0.7)',
                    border: '1px solid rgba(44,44,26,0.06)',
                    animation: `fadeUp 0.3s ease ${(idx % 10) * 0.04}s both`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>
                        {ex.exerciseName || 'Exercise'}
                      </div>
                      {ex.category && (
                        <span style={{
                          fontSize: '10px', fontWeight: '500', color: 'var(--green)',
                          background: 'var(--green-pale)', padding: '2px 8px', borderRadius: '100px',
                        }}>{ex.category}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <label style={{ fontSize: '9px', color: 'var(--ink-light)', textTransform: 'uppercase' }}>Sets</label>
                        <input type="number" value={ex.sets || ''} onChange={e => updateExercise(idx, 'sets', parseInt(e.target.value) || null)}
                          style={{
                            width: '48px', padding: '5px 4px', textAlign: 'center',
                            border: '1px solid rgba(44,44,26,0.12)', borderRadius: '8px',
                            background: 'var(--white)', fontSize: '13px', fontFamily: 'var(--font-body)',
                            color: 'var(--ink)', outline: 'none',
                          }} />
                      </div>
                      <span style={{ color: 'var(--ink-light)', fontSize: '14px', fontWeight: '300' }}>×</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <label style={{ fontSize: '9px', color: 'var(--ink-light)', textTransform: 'uppercase' }}>Reps</label>
                        <input type="number" value={ex.reps || ''} onChange={e => updateExercise(idx, 'reps', parseInt(e.target.value) || null)}
                          style={{
                            width: '48px', padding: '5px 4px', textAlign: 'center',
                            border: '1px solid rgba(44,44,26,0.12)', borderRadius: '8px',
                            background: 'var(--white)', fontSize: '13px', fontFamily: 'var(--font-body)',
                            color: 'var(--ink)', outline: 'none',
                          }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <label style={{ fontSize: '9px', color: 'var(--ink-light)', textTransform: 'uppercase' }}>Min</label>
                        <input type="number" value={ex.durationMinutes || ''} onChange={e => updateExercise(idx, 'durationMinutes', parseInt(e.target.value) || null)}
                          style={{
                            width: '48px', padding: '5px 4px', textAlign: 'center',
                            border: '1px solid rgba(44,44,26,0.12)', borderRadius: '8px',
                            background: 'var(--white)', fontSize: '13px', fontFamily: 'var(--font-body)',
                            color: 'var(--ink)', outline: 'none',
                          }} />
                      </div>
                    </div>
                    <button onClick={() => removeExercise(idx)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--ink-light)', padding: '4px', transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-light)'}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add exercise section */}
          <div style={{ marginTop: '14px', marginBottom: '14px' }}>
            {showLibrary ? (
              <div style={{
                border: '1.5px solid rgba(74,103,65,0.2)', borderRadius: '14px',
                background: 'rgba(250,250,240,0.5)', overflow: 'hidden',
                animation: 'fadeUp 0.3s ease',
              }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(44,44,26,0.06)' }}>
                  <input type="text" className="form-input" placeholder="Search exercises by name or category..."
                    value={search} onChange={e => setSearch(e.target.value)} autoFocus
                    style={{ fontSize: '13px', padding: '10px 14px' }} />
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredLib.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-light)' }}>
                      {search ? 'No exercises found' : 'Loading library...'}
                    </p>
                  ) : filteredLib.map(ex => (
                    <button key={ex.libraryExerciseId} onClick={() => addExercise(ex)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', border: 'none', background: 'transparent',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left',
                        borderBottom: '1px solid rgba(44,44,26,0.04)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,103,65,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>{ex.exerciseName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          {ex.category && <span>{ex.category}</span>}
                          {ex.difficultyLevel && <span>· {ex.difficultyLevel}</span>}
                          {ex.caloriesBurnedPerMin && <span>· {ex.caloriesBurnedPerMin} cal/min</span>}
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--green)', flexShrink: 0 }}>
                        <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(44,44,26,0.06)' }}>
                  <button onClick={() => { setShowLibrary(false); setSearch(''); }}
                    style={{ fontSize: '12px', color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    Close library
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLibrary(true)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  border: '1.5px dashed rgba(74,103,65,0.25)', background: 'rgba(220,232,200,0.2)',
                  color: 'var(--green)', fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,232,200,0.4)'; e.currentTarget.style.borderColor = 'rgba(74,103,65,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,232,200,0.2)'; e.currentTarget.style.borderColor = 'rgba(74,103,65,0.25)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Add exercise from library
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 28px', borderTop: '1px solid rgba(44,44,26,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} total
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>Cancel</button>
            <button onClick={handleSubmit} className="btn btn-green" disabled={saving || !name.trim()}
              style={{ fontSize: '13px', padding: '9px 22px', opacity: !name.trim() ? 0.5 : 1 }}>
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M8 2C11.3 2 14 4.7 14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Saving…
                </span>
              ) : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════
   MAIN WORKOUT PAGE
   ══════════════════════════════════════════════ */
export default function WorkoutPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = All
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  /* Load data */
  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [p, l] = await Promise.allSettled([
          axios.get(`${API}/workout`, { headers: getHeaders() }),
          axios.get(`${API}/workout/exercises/library`, { headers: getHeaders() }),
        ]);
        if (p.status === 'fulfilled') setPlans(p.value.data || []);
        if (l.status === 'fulfilled') setLibrary(l.value.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  /* Auto-generate */
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/workout/generate`, {}, { headers: getHeaders() });
      setPlans(prev => [res.data, ...prev]);
      setExpandedPlan(res.data.planId);
      showToast('Workout plan generated!');
    } catch (e) {
      showToast(e.response?.data || 'Failed to generate plan. Complete your profile first.', 'error');
    } finally { setGenerating(false); }
  };

  /* Create / Update */
  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingPlan) {
        const res = await axios.put(`${API}/workout/${editingPlan.planId}`, data, { headers: getHeaders() });
        setPlans(prev => prev.map(p => p.planId === editingPlan.planId ? res.data : p));
        showToast('Plan updated!');
      } else {
        const res = await axios.post(`${API}/workout`, data, { headers: getHeaders() });
        setPlans(prev => [res.data, ...prev]);
        showToast('Plan created!');
      }
      setShowCreateModal(false);
      setEditingPlan(null);
    } catch (e) {
      showToast(e.response?.data || 'Failed to save plan', 'error');
    } finally { setSaving(false); }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!deletingPlan) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/workout/${deletingPlan.planId}`, { headers: getHeaders() });
      setPlans(prev => prev.filter(p => p.planId !== deletingPlan.planId));
      if (expandedPlan === deletingPlan.planId) setExpandedPlan(null);
      showToast('Plan deleted');
      setDeletingPlan(null);
    } catch (e) {
      showToast('Failed to delete plan', 'error');
    } finally { setDeleting(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getExercisesForDay = (exercises, day) => {
    if (day === 0) return exercises || [];
    return (exercises || []).filter(ex => ex.dayOfWeek === day);
  };

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
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.03em', fontStyle: 'italic' }}>V – Fit</span>
            </Link>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {NAV.map(item => {
              const isActive = item.to === '/workout';
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
                  {item.icon}{item.label}
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
            marginBottom: '28px', animation: 'fadeUp 0.5s ease forwards',
          }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '4px' }}>
                Workout Plans
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
                Create custom plans or auto-generate based on your goals
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleGenerate} disabled={generating}
                className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>
                {generating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(44,44,26,0.2)" strokeWidth="2"/>
                      <path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Generating…
                  </span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L10 5.5H15L11 8.5L12.5 14L8 11L3.5 14L5 8.5L1 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                    Auto-generate
                  </>
                )}
              </button>
              <button onClick={() => { setEditingPlan(null); setShowCreateModal(true); }}
                className="btn btn-green" style={{ fontSize: '13px', padding: '9px 18px' }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Create plan
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="16" cy="16" r="12" stroke="rgba(74,103,65,0.2)" strokeWidth="3"/>
                <path d="M16 4C22.6 4 28 9.4 28 16" stroke="var(--green)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>Loading workout plans…</span>
            </div>
          ) : plans.length === 0 ? (
            /* ── Empty State ── */
            <div style={{
              ...cardBg, padding: '60px 40px', textAlign: 'center',
              animation: 'fadeUp 0.5s ease forwards',
            }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto 20px', opacity: 0.25 }}>
                <rect x="8" y="24" width="12" height="16" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="44" y="24" width="12" height="16" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <rect x="12" y="20" width="4" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                <rect x="48" y="20" width="4" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>
                No workout plans yet
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Create your first plan manually or let our algorithm generate one based on your fitness goals and activity level.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleGenerate} disabled={generating} className="btn btn-outline" style={{ fontSize: '13px' }}>
                  Auto-generate a plan
                </button>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-green" style={{ fontSize: '13px' }}>
                  Create from scratch
                </button>
              </div>
            </div>
          ) : (
            /* ── Plans List ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {plans.map((plan, idx) => {
                const isExpanded = expandedPlan === plan.planId;
                const exCount = plan.exercises?.length || 0;
                const dayExercises = getExercisesForDay(plan.exercises, selectedDay);

                return (
                  <div key={plan.planId} style={{
                    ...cardBg, padding: 0, overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    animation: `fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s both`,
                  }}
                    onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,44,26,0.08)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {/* Plan header */}
                    <div
                      onClick={() => setExpandedPlan(isExpanded ? null : plan.planId)}
                      style={{
                        padding: '20px 24px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '16px',
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: plan.isAutoGenerated ? 'rgba(230,126,34,0.1)' : 'var(--green-pale)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {plan.isAutoGenerated ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2L12 7H17L13 10.5L14.5 16L10 13L5.5 16L7 10.5L3 7H8L10 2Z" stroke="#E67E22" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="2" y="8" width="5" height="5" rx="1" stroke="var(--green)" strokeWidth="1.5"/>
                            <rect x="13" y="8" width="5" height="5" rx="1" stroke="var(--green)" strokeWidth="1.5"/>
                            <line x1="7" y1="10.5" x2="13" y2="10.5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>{plan.planName}</h3>
                          {plan.isAutoGenerated && (
                            <span style={{
                              fontSize: '10px', fontWeight: '500', color: 'var(--accent-light)',
                              background: 'rgba(230,126,34,0.1)', padding: '2px 8px', borderRadius: '100px',
                            }}>Auto</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--ink-light)' }}>
                          {plan.goalCategory && <span style={{ color: 'var(--green)', fontWeight: '500' }}>{formatGoal(plan.goalCategory)}</span>}
                          <span>{exCount} exercise{exCount !== 1 ? 's' : ''}</span>
                          {plan.createdAt && <span>{new Date(plan.createdAt).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setEditingPlan(plan); setShowCreateModal(true); }}
                          style={{
                            padding: '7px 8px', borderRadius: '8px', border: 'none',
                            background: 'rgba(44,44,26,0.04)', cursor: 'pointer',
                            color: 'var(--ink-light)', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-pale)'; e.currentTarget.style.color = 'var(--green)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
                          title="Edit plan"
                        >
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                            <path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => setDeletingPlan(plan)}
                          style={{
                            padding: '7px 8px', borderRadius: '8px', border: 'none',
                            background: 'rgba(44,44,26,0.04)', cursor: 'pointer',
                            color: 'var(--ink-light)', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
                          title="Delete plan"
                        >
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 4H11.5M5 4V2.5H9V4M5.5 6V10.5M8.5 6V10.5M3.5 4L4 11.5H10L10.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      {/* Expand chevron */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{ color: 'var(--ink-light)', transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Expanded exercises */}
                    {isExpanded && (
                      <div style={{
                        borderTop: '1px solid rgba(44,44,26,0.06)',
                        padding: '16px 24px 20px',
                        animation: 'fadeUp 0.3s ease',
                      }}>
                        {/* Day filter tabs */}
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', overflowX: 'auto' }}>
                          {DAYS.map((day, i) => {
                            const count = i === 0 ? (plan.exercises?.length || 0) : (plan.exercises || []).filter(ex => ex.dayOfWeek === i).length;
                            const isActive = selectedDay === i;
                            return (
                              <button key={day} onClick={() => setSelectedDay(i)}
                                style={{
                                  padding: '6px 12px', borderRadius: '100px', border: 'none',
                                  background: isActive ? 'var(--green)' : 'rgba(44,44,26,0.05)',
                                  color: isActive ? 'white' : 'var(--ink-muted)',
                                  fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                                  fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                }}>
                                {day}
                                {count > 0 && (
                                  <span style={{
                                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(74,103,65,0.12)',
                                    color: isActive ? 'white' : 'var(--green)',
                                    padding: '0 5px', borderRadius: '100px', fontSize: '10px',
                                  }}>{count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Exercise rows */}
                        {dayExercises.length === 0 ? (
                          <p style={{ fontSize: '13px', color: 'var(--ink-light)', textAlign: 'center', padding: '20px 0' }}>
                            No exercises for {selectedDay === 0 ? 'this plan' : DAYS[selectedDay]}
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {dayExercises.map((ex, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 14px', borderRadius: '10px',
                                background: 'rgba(250,250,240,0.6)',
                                border: '1px solid rgba(44,44,26,0.04)',
                                animation: `slideUp 0.3s ease ${i * 0.04}s both`,
                              }}>
                                <div style={{
                                  width: '32px', height: '32px', borderRadius: '8px',
                                  background: 'var(--green-pale)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '12px', fontWeight: '600', color: 'var(--green)', flexShrink: 0,
                                }}>
                                  {i + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>
                                    {ex.exerciseName || 'Exercise'}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '8px', marginTop: '1px' }}>
                                    {ex.category && <span>{ex.category}</span>}
                                    {selectedDay === 0 && ex.dayOfWeek && <span>· {DAYS[ex.dayOfWeek]}</span>}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                                  {ex.sets && ex.reps && (
                                    <span style={{ color: 'var(--ink)' }}>
                                      <strong>{ex.sets}</strong><span style={{ color: 'var(--ink-light)' }}> × </span><strong>{ex.reps}</strong>
                                    </span>
                                  )}
                                  {ex.durationMinutes && (
                                    <span style={{ color: 'var(--accent-light)', fontWeight: '500' }}>
                                      {ex.durationMinutes} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {(showCreateModal || editingPlan) && (
        <PlanModal
          plan={editingPlan}
          library={library}
          saving={saving}
          onSave={handleSave}
          onClose={() => { setShowCreateModal(false); setEditingPlan(null); }}
        />
      )}

      {deletingPlan && (
        <ConfirmModal
          title="Delete workout plan"
          message={`Are you sure you want to delete "${deletingPlan.planName}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPlan(null)}
          loading={deleting}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </PageBackground>
  );
}