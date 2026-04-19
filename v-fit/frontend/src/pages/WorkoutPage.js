import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';
import BodyMap from '../components/Bodymap';

const API = '/api';
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

const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps',
  triceps: 'Triceps', abs: 'Core', quads: 'Quads', hamstrings: 'Hamstrings',
  glutes: 'Glutes', calves: 'Calves', traps: 'Traps', lowerback: 'Lower Back',
  cardio: 'Cardio',
};

// Maps DB category values to body map muscle keys
const CATEGORY_TO_MUSCLE = {
  'Strength': ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'traps', 'lowerback'],
  'Strenght': ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'traps', 'lowerback'],
  'Cardio': ['cardio'],
  'Core': ['abs'],
  'Flexibility': ['shoulders', 'hamstrings', 'calves', 'back'],
  'HIIT': ['cardio'],
};

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


/*══════════════════════════════════════════════
  ENHANCED CREATE/EDIT MODAL WITH BODY MAP
  ══════════════════════════════════════════════ */
function PlanModal({ plan, library, gender, onSave, onClose, saving }) {
  const [name, setName] = useState(plan?.planName || '');
  const [goal, setGoal] = useState(plan?.goalCategory || '');
  const [exercises, setExercises] = useState(plan?.exercises || []);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [addMode, setAddMode] = useState('body');

  // Fixed: uses CATEGORY_TO_MUSCLE to map DB categories to body map muscle keys
  const muscleFiltered = selectedMuscle
    ? (library || []).filter(ex => {
        if (ex.muscleGroup?.toLowerCase() === selectedMuscle.toLowerCase()) return true;
        if (ex.category?.toLowerCase() === selectedMuscle.toLowerCase()) return true;
        const mapped = CATEGORY_TO_MUSCLE[ex.category] || [];
        return mapped.includes(selectedMuscle.toLowerCase());
      })
    : [];

  const searchFiltered = search.trim()
    ? (library || []).filter(ex =>
        ex.exerciseName?.toLowerCase().includes(search.toLowerCase()) ||
        ex.category?.toLowerCase().includes(search.toLowerCase()) ||
        ex.muscleGroup?.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 20)
    : [];

  const addExercise = (libEx) => {
    setExercises(prev => [...prev, {
      libraryExerciseId: libEx.libraryExerciseId,
      exerciseName: libEx.exerciseName,
      category: libEx.category,
      muscleGroup: libEx.muscleGroup,
      sets: 3, reps: 12, durationMinutes: null,
      dayOfWeek: selectedDay,
    }]);
  };

  const isExerciseAdded = (libExId) =>
    exercises.some(ex => ex.libraryExerciseId === libExId && ex.dayOfWeek === selectedDay);

  const updateExercise = (idx, field, value) =>
    setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));

  const removeExercise = (idx) =>
    setExercises(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ planName: name, goalCategory: goal || null, exercises });
  };

  const dayExercises = exercises.filter(ex => ex.dayOfWeek === selectedDay);

  /* Exercise items — no own scroll wrapper */
  const renderExerciseItems = (exList) => (
    <>
      {exList.length === 0 ? (
        <p style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-light)' }}>
          No exercises found
        </p>
      ) : exList.map(ex => {
        const added = isExerciseAdded(ex.libraryExerciseId);
        return (
          <button key={ex.libraryExerciseId}
            onClick={() => { if (!added) addExercise(ex); }}
            disabled={added}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 12px', border: 'none',
              background: added ? 'rgba(74,103,65,0.06)' : 'transparent',
              cursor: added ? 'default' : 'pointer',
              fontFamily: 'var(--font-body)', textAlign: 'left',
              borderBottom: '1px solid rgba(44,44,26,0.04)',
              transition: 'background 0.15s', opacity: added ? 0.65 : 1,
            }}
            onMouseEnter={e => { if (!added) e.currentTarget.style.background = 'rgba(74,103,65,0.06)'; }}
            onMouseLeave={e => { if (!added) e.currentTarget.style.background = added ? 'rgba(74,103,65,0.06)' : 'transparent'; }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>{ex.exerciseName}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '6px', marginTop: '1px', flexWrap: 'wrap' }}>
                {ex.difficultyLevel && <span>{ex.difficultyLevel}</span>}
                {ex.equipment && <span>· {ex.equipment}</span>}
                {ex.caloriesBurnedPerMin && <span>· {ex.caloriesBurnedPerMin} cal/min</span>}
              </div>
            </div>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(74,103,65,0.08)', color: 'var(--green)',
              fontSize: '14px', fontWeight: '600',
            }}>
              {added ? '✓' : '+'}
            </div>
          </button>
        );
      })}
    </>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(44,44,26,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        ...cardBg, padding: '0',
        maxWidth: '1060px', width: '96%',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* ── Modal Header ── */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>
              {plan ? 'Edit Workout Plan' : 'Create Workout Plan'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Plan info row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Plan Name</label>
              <input type="text" className="form-input" placeholder="e.g. Morning Strength" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Goal Category</label>
              <select className="form-input" value={goal} onChange={e => setGoal(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">Select goal...</option>
                {GOALS.map(g => <option key={g} value={g}>{formatGoal(g)}</option>)}
              </select>
            </div>
          </div>

          {/* Day tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', overflowX: 'auto' }}>
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

        <div style={{
          flex: 1, overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1fr 500px',
          borderTop: '1px solid rgba(44,44,26,0.06)',
        }}>

          {/* ── LEFT COLUMN: current day exercises ── */}
          <div style={{ overflowY: 'auto', padding: '16px 24px' }}>
            {dayExercises.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '32px 20px',
                color: 'var(--ink-light)', fontSize: '13px',
              }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 10px', opacity: 0.2 }}>
                  <rect x="4" y="14" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="24" y="14" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="18" x2="24" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>No exercises for {DAYS[selectedDay]}</p>
                <p style={{ fontSize: '12px', color: 'var(--ink-light)', marginTop: '4px' }}>
                  Use the body map or search to add exercises →
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--ink-light)', marginBottom: '4px' }}>
                  {DAYS[selectedDay]} — {dayExercises.length} exercise{dayExercises.length !== 1 ? 's' : ''}
                </div>
                {dayExercises.map((ex, localIdx) => {
                  const realIdx = exercises.findIndex(e => e === ex);
                  return (
                    <div key={realIdx} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px',
                      background: 'rgba(250,250,240,0.6)',
                      border: '1px solid rgba(44,44,26,0.06)',
                      borderRadius: '12px',
                      animation: 'fadeUp 0.2s ease',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>
                          {ex.exerciseName || ex.libraryExercise?.exerciseName || 'Exercise'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '6px', marginTop: '2px' }}>
                          {(ex.muscleGroup || ex.category) && <span>{MUSCLE_LABELS[ex.muscleGroup] || ex.category}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {[['Sets','sets'],['Reps','reps'],['Min','durationMinutes']].map(([lbl, field]) => (
                          <div key={field} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <label style={{ fontSize: '9px', color: 'var(--ink-light)', textTransform: 'uppercase' }}>{lbl}</label>
                            <input type="number" value={ex[field] || ''}
                              onChange={e => updateExercise(realIdx, field, parseInt(e.target.value) || null)}
                              style={{
                                width: '44px', padding: '5px 4px', textAlign: 'center',
                                border: '1px solid rgba(44,44,26,0.12)', borderRadius: '8px',
                                background: 'var(--white, #fff)', fontSize: '13px',
                                fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none',
                              }} />
                          </div>
                        ))}
                      </div>
                      <button onClick={() => removeExercise(realIdx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '4px', transition: 'color 0.15s' }}
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
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{
            borderLeft: '1px solid rgba(44,44,26,0.06)',
            overflow: 'hidden',
            background: 'rgba(250,250,240,0.3)',
            display: 'flex', flexDirection: 'column',
          }}>

            {/* Mode toggle */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(44,44,26,0.06)', flexShrink: 0 }}>
              <button onClick={() => { setAddMode('body'); setSearch(''); }}
                style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: addMode === 'body' ? '600' : '400',
                  fontFamily: 'var(--font-body)',
                  background: addMode === 'body' ? 'rgba(74,103,65,0.08)' : 'transparent',
                  color: addMode === 'body' ? 'var(--green)' : 'var(--ink-muted)',
                  borderBottom: addMode === 'body' ? '2px solid var(--green)' : '2px solid transparent',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="3" r="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 13V7C4 5.9 4.9 5 6 5H8C9.1 5 10 5.9 10 7V13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Body Map
              </button>
              <button onClick={() => { setAddMode('search'); setSelectedMuscle(null); }}
                style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: addMode === 'search' ? '600' : '400',
                  fontFamily: 'var(--font-body)',
                  background: addMode === 'search' ? 'rgba(74,103,65,0.08)' : 'transparent',
                  color: addMode === 'search' ? 'var(--green)' : 'var(--ink-muted)',
                  borderBottom: addMode === 'search' ? '2px solid var(--green)' : '2px solid transparent',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Search
              </button>
            </div>

            {addMode === 'body' ? (
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{
                  width: '200px', flexShrink: 0,
                  borderRight: '1px solid rgba(44,44,26,0.08)',
                  overflowY: 'auto',
                  padding: '10px 6px 12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  <BodyMap
                    gender={gender}
                    selectedMuscle={selectedMuscle}
                    onMuscleSelect={(m) => setSelectedMuscle(m === selectedMuscle ? null : m)}
                  />
                </div>

                <div style={{
                  flex: 1, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                }}>
                  {selectedMuscle ? (
                    <>
                      <div style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(44,44,26,0.08)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexShrink: 0,
                        background: 'rgba(245,245,225,0.7)',
                      }}>
                        <span style={{
                          fontSize: '12px', fontWeight: '600', color: 'var(--green)',
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: 'var(--green)', display: 'inline-block', flexShrink: 0,
                          }} />
                          {MUSCLE_LABELS[selectedMuscle] || selectedMuscle}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px', color: 'var(--ink-light)',
                            background: 'rgba(74,103,65,0.08)', padding: '2px 7px', borderRadius: '100px',
                          }}>
                            {muscleFiltered.length} exercises
                          </span>
                          <button
                            onClick={() => setSelectedMuscle(null)}
                            title="Deselect muscle"
                            style={{
                              background: 'rgba(44,44,26,0.06)', border: 'none', cursor: 'pointer',
                              color: 'var(--ink-light)', borderRadius: '50%',
                              width: '20px', height: '20px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s', flexShrink: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.12)'; e.currentTarget.style.color = 'var(--ink)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.06)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div style={{ flex: 1, overflowY: 'auto' }}>
                        {renderExerciseItems(muscleFiltered)}
                      </div>
                    </>
                  ) : (
                    <div style={{
                      flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      padding: '24px 20px', textAlign: 'center',
                      color: 'var(--ink-light)',
                    }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.2, marginBottom: '12px' }}>
                        <circle cx="20" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 36V24C12 21.8 13.8 20 16 20H24C26.2 20 28 21.8 28 24V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="8" y1="22" x2="14" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="26" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                        Select a muscle group
                      </p>
                      <p style={{ fontSize: '11px', lineHeight: '1.5', maxWidth: '160px' }}>
                        Click any highlighted area on the body map to see available exercises
                      </p>
                    </div>
                  )}
                </div>
              </div>

            ) : (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '12px', gap: '8px' }}>
                <input
                  type="text" className="form-input"
                  placeholder="Search by name, muscle, or category..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  autoFocus
                  style={{ fontSize: '13px', padding: '10px 14px', flexShrink: 0 }}
                />
                {search.trim() ? (
                  <div style={{
                    flex: 1, minHeight: 0,
                    border: '1px solid rgba(74,103,65,0.15)',
                    borderRadius: '12px', background: 'rgba(250,250,240,0.5)',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  }}>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {renderExerciseItems(searchFiltered)}
                    </div>
                  </div>
                ) : (
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    <p style={{ fontSize: '11px', color: 'var(--ink-light)', marginBottom: '8px' }}>
                      Or browse by muscle group:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {Object.entries(MUSCLE_LABELS).map(([key, label]) => {
                        const count = (library || []).filter(ex => {
                          if (ex.muscleGroup === key) return true;
                          if (ex.category?.toLowerCase() === key.toLowerCase()) return true;
                          const mapped = CATEGORY_TO_MUSCLE[ex.category] || [];
                          return mapped.includes(key.toLowerCase());
                        }).length;
                        if (count === 0) return null;
                        return (
                          <button key={key}
                            onClick={() => { setAddMode('body'); setSelectedMuscle(key); }}
                            style={{
                              padding: '4px 10px', borderRadius: '100px',
                              border: '1px solid rgba(44,44,26,0.1)',
                              background: 'rgba(250,250,240,0.6)',
                              fontSize: '11px', cursor: 'pointer',
                              fontFamily: 'var(--font-body)', color: 'var(--ink-muted)',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-pale)'; e.currentTarget.style.color = 'var(--green)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(250,250,240,0.6)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
                          >
                            {label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '16px 28px', flexShrink: 0,
          borderTop: '1px solid rgba(44,44,26,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '13px', color: 'var(--ink-light)' }}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} total
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 20px' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !name.trim()}
              className="btn btn-green"
              style={{ fontSize: '13px', padding: '9px 24px', opacity: saving || !name.trim() ? 0.5 : 1 }}>
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
  const [selectedDay, setSelectedDay] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [userGender, setUserGender] = useState('Male');

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [p, l, prof] = await Promise.allSettled([
          axios.get(`${API}/workout`, { headers: getHeaders() }),
          axios.get(`${API}/workout/exercises/library`, { headers: getHeaders() }),
          axios.get(`${API}/profile`, { headers: getHeaders() }),
        ]);
        if (p.status === 'fulfilled') setPlans(p.value.data || []);
        if (l.status === 'fulfilled') setLibrary(l.value.data || []);
        if (prof.status === 'fulfilled') setUserGender(prof.value.data?.gender || 'Male');
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/workout/generate`, {}, { headers: getHeaders() });
      setPlans(prev => [res.data, ...prev]);
      setExpandedPlan(res.data.planId);
      showToast('Workout plan generated!');
    } catch (e) {
      showToast('Please complete your profile first — add fitness goal & activity level', 'error');
      setTimeout(() => navigate('/profile'), 3000);
    } finally { setGenerating(false); }
  };

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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(74,103,65,0.3)" strokeWidth="2"/>
                      <path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Generating…
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 4.5L12.5 5L9.5 7.5L10.5 11.5L7 9.5L3.5 11.5L4.5 7.5L1.5 5L5.5 4.5L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    Auto-generate
                  </span>
                )}
              </button>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-green" style={{ fontSize: '13px', padding: '9px 20px' }}>
                + Create plan
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto' }}>
                <circle cx="8" cy="8" r="6" stroke="rgba(74,103,65,0.2)" strokeWidth="2"/>
                <path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ ...cardBg, padding: '60px 40px', textAlign: 'center', animation: 'fadeUp 0.5s ease forwards' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto 20px', opacity: 0.25 }}>
                <rect x="8" y="24" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <rect x="40" y="24" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <line x1="24" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>No workout plans yet</h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                Create a custom workout plan or auto-generate one based on your fitness goals.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleGenerate} disabled={generating} className="btn btn-outline" style={{ fontSize: '13px' }}>Auto-generate a plan</button>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-green" style={{ fontSize: '13px' }}>Create from scratch</button>
              </div>
            </div>
          ) : (
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
                    <div onClick={() => setExpandedPlan(isExpanded ? null : plan.planId)}
                      style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: plan.isAutoGenerated ? 'rgba(230,126,34,0.1)' : 'var(--green-pale)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {plan.isAutoGenerated
                          ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12 7L17 7.5L13 11L14.5 16L10 13.5L5.5 16L7 11L3 7.5L8 7L10 2Z" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                          : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="8" width="5" height="5" rx="1" stroke="var(--green)" strokeWidth="1.5"/><rect x="13" y="8" width="5" height="5" rx="1" stroke="var(--green)" strokeWidth="1.5"/><line x1="7" y1="10.5" x2="13" y2="10.5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--ink)' }}>{plan.planName}</span>
                          {plan.isAutoGenerated && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(230,126,34,0.12)', color: 'var(--accent-light)', fontWeight: '500' }}>Auto</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-light)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          {plan.goalCategory && <span>{formatGoal(plan.goalCategory)}</span>}
                          <span>{exCount} exercise{exCount !== 1 ? 's' : ''}</span>
                          {plan.createdAt && <span>{new Date(plan.createdAt).toLocaleDateString()}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setEditingPlan(plan); setShowCreateModal(true); }}
                          style={{ padding: '7px 8px', borderRadius: '8px', border: 'none', background: 'rgba(44,44,26,0.04)', cursor: 'pointer', color: 'var(--ink-light)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,103,65,0.1)'; e.currentTarget.style.color = 'var(--green)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
                          title="Edit plan">
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => setDeletingPlan(plan)}
                          style={{ padding: '7px 8px', borderRadius: '8px', border: 'none', background: 'rgba(44,44,26,0.04)', cursor: 'pointer', color: 'var(--ink-light)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }}
                          title="Delete plan">
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.5 4H11.5M5 4V2.5H9V4M5.5 6V10.5M8.5 6V10.5M3.5 4L4 11.5H10L10.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-light)', transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid rgba(44,44,26,0.06)', padding: '16px 24px 20px', animation: 'fadeUp 0.3s ease' }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', overflowX: 'auto' }}>
                          {DAYS.map((day, i) => {
                            const count = i === 0 ? (plan.exercises?.length || 0) : getExercisesForDay(plan.exercises, i).length;
                            const isActive = selectedDay === i;
                            return (
                              <button key={i} onClick={() => setSelectedDay(i)}
                                style={{
                                  padding: '5px 12px', borderRadius: '100px', border: 'none',
                                  background: isActive ? 'var(--green)' : 'rgba(44,44,26,0.05)',
                                  color: isActive ? 'white' : 'var(--ink-muted)',
                                  fontSize: '11px', fontWeight: '500', cursor: 'pointer',
                                  fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', transition: 'all 0.15s',
                                }}>
                                {day} {count > 0 ? `(${count})` : ''}
                              </button>
                            );
                          })}
                        </div>
                        {dayExercises.length === 0 ? (
                          <p style={{ fontSize: '13px', color: 'var(--ink-light)', textAlign: 'center', padding: '16px' }}>
                            No exercises for {DAYS[selectedDay] === 'All' ? 'this plan' : DAYS[selectedDay]}
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {dayExercises.map((ex, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 14px', borderRadius: '10px',
                                background: 'rgba(250,250,240,0.4)',
                              }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>
                                    {ex.exerciseName || ex.libraryExercise?.exerciseName || 'Exercise'}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '6px', marginTop: '1px' }}>
                                    {(ex.muscleGroup || ex.category || ex.libraryExercise?.category) && (
                                      <span>{MUSCLE_LABELS[ex.muscleGroup] || ex.category || ex.libraryExercise?.category}</span>
                                    )}
                                    {ex.dayOfWeek && <span>· {DAYS[ex.dayOfWeek]}</span>}
                                  </div>
                                </div>
                                <div style={{ fontSize: '12px', display: 'flex', gap: '10px' }}>
                                  {ex.sets && ex.reps && <span style={{ color: 'var(--green)', fontWeight: '500' }}>{ex.sets}×{ex.reps}</span>}
                                  {ex.durationMinutes && <span style={{ color: 'var(--accent-light)', fontWeight: '500' }}>{ex.durationMinutes} min</span>}
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

      {(showCreateModal || editingPlan) && (
        <PlanModal
          plan={editingPlan}
          library={library}
          gender={userGender}
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