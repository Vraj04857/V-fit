import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';

const API = 'http://localhost:8080/api';
const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg> },
  { to: '/workout', label: 'Workout', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><rect x="13" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/><line x1="5" y1="9" x2="13" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="13" y="5" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg> },
  { to: '/diet', label: 'Diet', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 5 5.5 5 9.5C5 12 6.8 14 9 14C11.2 14 13 12 13 9.5C13 5.5 9 2 9 2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6.5 11C7.3 12.2 8.1 12.8 9 12.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/></svg> },
  { to: '/progress', label: 'Progress', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L6 9.5L9 11.5L13 6L16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { to: '/ai', label: 'AI Assistant', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="M6 9C6 7.3 7.3 6 9 6C10.7 6 12 7.3 12 9C12 10.2 11.3 11.2 10.3 11.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="currentColor"/></svg> },
  { to: '/profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.6"/><path d="M2 16C2 13.2 5.1 11 9 11C12.9 11 16 13.2 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
];

const DAYS = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const DIET_TYPES = ['BALANCED', 'VEGETARIAN', 'VEGAN', 'KETO', 'LOW_CARB', 'HIGH_PROTEIN', 'PALEO'];
const MACRO_COLORS = { protein: '#4A6741', carbs: '#E67E22', fats: '#C0392B' };

const cardBg = {
  background: 'rgba(245,245,225,0.88)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
  borderRadius: '18px', border: '1px solid rgba(44,44,26,0.1)',
};
const formatLabel = g => !g ? '' : g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
const mealIcon = (type) => {
  const t = (type || '').toUpperCase();
  if (t === 'BREAKFAST') return '🌅';
  if (t === 'LUNCH') return '☀️';
  if (t === 'DINNER') return '🌙';
  return '🍎';
};

/* ── Macro Donut ── */
function MacroDonut({ protein = 0, carbs = 0, fats = 0, size = 64 }) {
  const total = protein + carbs + fats;
  if (total === 0) return <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(44,44,26,0.06)' }} />;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pPct = protein / total, cPct = carbs / total, fPct = fats / total;
  const pLen = pPct * circ, cLen = cPct * circ, fLen = fPct * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MACRO_COLORS.protein} strokeWidth="6"
        strokeDasharray={`${pLen} ${circ - pLen}`} strokeDashoffset="0" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MACRO_COLORS.carbs} strokeWidth="6"
        strokeDasharray={`${cLen} ${circ - cLen}`} strokeDashoffset={`${-pLen}`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MACRO_COLORS.fats} strokeWidth="6"
        strokeDasharray={`${fLen} ${circ - fLen}`} strokeDashoffset={`${-(pLen + cLen)}`} />
    </svg>
  );
}

/* ── Calorie Progress Bar ── */
function CalorieBar({ current, target, label }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const over = current > target;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {label && <span style={{ fontSize: '12px', color: 'var(--ink-light)', minWidth: '36px' }}>{label}</span>}
      <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(44,44,26,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '4px',
          background: over ? 'var(--accent)' : 'linear-gradient(90deg, var(--green) 0%, var(--green-light) 100%)',
          width: `${pct}%`, transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '500', color: over ? 'var(--accent)' : 'var(--ink)', minWidth: '70px', textAlign: 'right' }}>
        {current} / {target}
      </span>
    </div>
  );
}

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
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards', fontFamily: 'var(--font-body)',
    }}>
      {type === 'success' ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M5.5 9.5L8 12L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="white" strokeWidth="1.5"/><path d="M9 5.5V10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="12.5" r="0.8" fill="white"/></svg>}
      {message}
    </div>
  );
}

/* ── Confirm Modal ── */
function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(44,44,26,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }} onClick={onCancel}>
      <div style={{ ...cardBg, padding: '28px 32px', maxWidth: '400px', width: '90%', boxShadow: '0 16px 48px rgba(0,0,0,0.15)', animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '8px', color: 'var(--ink)' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: '1.6' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: '9px 18px', borderRadius: '100px', border: '1.5px solid var(--accent)', background: 'rgba(192,57,43,0.08)', color: 'var(--accent)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {loading && <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(192,57,43,0.3)" strokeWidth="2"/><path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/></svg>}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Create/Edit Diet Modal ── */
function DietModal({ plan, foodLibrary, onSave, onClose, saving }) {
  const [name, setName] = useState(plan?.planName || '');
  const [dietType, setDietType] = useState(plan?.dietType || '');
  const [targetCal, setTargetCal] = useState(plan?.targetCalories || 2000);
  const [meals, setMeals] = useState(plan?.meals || []);
  const [search, setSearch] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedType, setSelectedType] = useState('BREAKFAST');

  const filteredFoods = (foodLibrary || []).filter(f =>
    f.foodName?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 20);

  const addMeal = (food) => {
    setMeals(prev => [...prev, {
      foodId: food.foodId, foodName: food.foodName,
      mealType: selectedType,
      calories: food.caloriesPerServing || 0,
      proteinGrams: food.proteinGrams || 0,
      carbsGrams: food.carbsGrams || 0,
      fatsGrams: food.fatsGrams || 0,
      dayOfWeek: selectedDay,
    }]);
    setShowLibrary(false);
    setSearch('');
  };

  const updateMeal = (idx, field, value) => {
    setMeals(prev => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const removeMeal = (idx) => setMeals(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ planName: name, dietType: dietType || null, targetCalories: targetCal, meals });
  };

  const dayMeals = meals.filter(m => m.dayOfWeek === selectedDay);
  const dayCalories = dayMeals.reduce((s, m) => s + (m.calories || 0), 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(44,44,26,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }} onClick={onClose}>
      <div style={{ ...cardBg, padding: 0, maxWidth: '720px', width: '95%', maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 16px 48px rgba(0,0,0,0.15)', animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)' }}>{plan ? 'Edit Diet Plan' : 'Create Diet Plan'}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Plan Name</label>
              <input type="text" className="form-input" placeholder="e.g. Clean Eating Week" value={name} onChange={e => setName(e.target.value)} style={{ fontSize: '13px', padding: '10px 14px' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Diet Type</label>
              <select className="form-input" value={dietType} onChange={e => setDietType(e.target.value)} style={{ cursor: 'pointer', fontSize: '13px', padding: '10px 14px' }}>
                <option value="">Select type...</option>
                {DIET_TYPES.map(d => <option key={d} value={d}>{formatLabel(d)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Calories</label>
              <input type="number" className="form-input" value={targetCal} onChange={e => setTargetCal(parseInt(e.target.value) || 0)} style={{ fontSize: '13px', padding: '10px 14px' }} />
            </div>
          </div>

          {/* Day tabs + calorie bar */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {[1,2,3,4,5,6,7].map(d => {
              const count = meals.filter(m => m.dayOfWeek === d).length;
              const isActive = selectedDay === d;
              return (
                <button key={d} onClick={() => setSelectedDay(d)} style={{ padding: '6px 12px', borderRadius: '100px', border: 'none', background: isActive ? 'var(--accent-light)' : 'rgba(44,44,26,0.06)', color: isActive ? 'white' : 'var(--ink-muted)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {DAYS[d]}
                  {count > 0 && <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(230,126,34,0.15)', color: isActive ? 'white' : 'var(--accent-light)', padding: '0 5px', borderRadius: '100px', fontSize: '10px' }}>{count}</span>}
                </button>
              );
            })}
          </div>
          <CalorieBar current={dayCalories} target={targetCal} label={DAYS[selectedDay]} />
          <div style={{ height: '12px' }} />
        </div>

        {/* Meals list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px', minHeight: '180px' }}>
          {/* Meal type tabs */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {MEAL_TYPES.map(mt => {
              const isActive = selectedType === mt;
              const count = dayMeals.filter(m => m.mealType === mt).length;
              return (
                <button key={mt} onClick={() => setSelectedType(mt)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: `1px solid ${isActive ? 'var(--accent-light)' : 'rgba(44,44,26,0.08)'}`,
                  background: isActive ? 'rgba(230,126,34,0.08)' : 'transparent',
                  color: isActive ? 'var(--accent-light)' : 'var(--ink-light)',
                  fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                }}>
                  {mealIcon(mt)} {formatLabel(mt)} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Filtered meals for selected day + type */}
          {dayMeals.filter(m => m.mealType === selectedType).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--ink-light)' }}>
              <p style={{ fontSize: '13px' }}>No {formatLabel(selectedType).toLowerCase()} items for {DAYS[selectedDay]}</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>Add food from the library below</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {dayMeals.filter(m => m.mealType === selectedType).map((meal, i) => {
                const realIdx = meals.indexOf(meal);
                return (
                  <div key={realIdx} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(250,250,240,0.7)', border: '1px solid rgba(44,44,26,0.04)',
                    animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)', marginBottom: '2px' }}>{meal.foodName || 'Food'}</div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
                        <span style={{ color: MACRO_COLORS.protein }}>P: {Math.round(meal.proteinGrams || 0)}g</span>
                        <span style={{ color: MACRO_COLORS.carbs }}>C: {Math.round(meal.carbsGrams || 0)}g</span>
                        <span style={{ color: MACRO_COLORS.fats }}>F: {Math.round(meal.fatsGrams || 0)}g</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <label style={{ fontSize: '9px', color: 'var(--ink-light)', textTransform: 'uppercase' }}>Cal</label>
                      <input type="number" value={meal.calories || ''} onChange={e => updateMeal(realIdx, 'calories', parseInt(e.target.value) || 0)}
                        style={{ width: '56px', padding: '5px 4px', textAlign: 'center', border: '1px solid rgba(44,44,26,0.12)', borderRadius: '8px', background: 'var(--white)', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--ink)', outline: 'none' }} />
                    </div>
                    <button onClick={() => removeMeal(realIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)', padding: '4px', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-light)'}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add food section */}
          <div style={{ marginTop: '12px', marginBottom: '14px' }}>
            {showLibrary ? (
              <div style={{ border: '1.5px solid rgba(230,126,34,0.2)', borderRadius: '14px', background: 'rgba(250,250,240,0.5)', overflow: 'hidden', animation: 'fadeUp 0.3s ease' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(44,44,26,0.06)' }}>
                  <input type="text" className="form-input" placeholder="Search foods by name or category..." value={search} onChange={e => setSearch(e.target.value)} autoFocus style={{ fontSize: '13px', padding: '10px 14px' }} />
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {filteredFoods.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--ink-light)' }}>{search ? 'No foods found' : 'Loading library...'}</p>
                  ) : filteredFoods.map(food => (
                    <button key={food.foodId} onClick={() => addMeal(food)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', borderBottom: '1px solid rgba(44,44,26,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(230,126,34,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>{food.foodName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-light)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <span>{food.caloriesPerServing} cal</span>
                          {food.servingSize && <span>· {food.servingSize}</span>}
                          {food.category && <span>· {food.category}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '10px', flexShrink: 0 }}>
                        <span style={{ color: MACRO_COLORS.protein }}>P{Math.round(food.proteinGrams || 0)}</span>
                        <span style={{ color: MACRO_COLORS.carbs }}>C{Math.round(food.carbsGrams || 0)}</span>
                        <span style={{ color: MACRO_COLORS.fats }}>F{Math.round(food.fatsGrams || 0)}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(44,44,26,0.06)' }}>
                  <button onClick={() => { setShowLibrary(false); setSearch(''); }} style={{ fontSize: '12px', color: 'var(--ink-light)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Close library</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLibrary(true)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px dashed rgba(230,126,34,0.25)', background: 'rgba(230,126,34,0.04)', color: 'var(--accent-light)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,126,34,0.08)'; e.currentTarget.style.borderColor = 'rgba(230,126,34,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(230,126,34,0.04)'; e.currentTarget.style.borderColor = 'rgba(230,126,34,0.25)'; }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                Add {formatLabel(selectedType).toLowerCase()} from food library
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(44,44,26,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', color: 'var(--ink-light)' }}>{meals.length} meal{meals.length !== 1 ? 's' : ''} · {meals.reduce((s, m) => s + (m.calories || 0), 0)} cal total</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>Cancel</button>
            <button onClick={handleSubmit} disabled={saving || !name.trim()} style={{ padding: '9px 22px', borderRadius: '100px', border: '1.5px solid var(--accent-light)', background: 'var(--accent-light)', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', opacity: !name.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {saving ? <><svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M8 2C11.3 2 14 4.7 14 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>Saving…</> : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN DIET PAGE
   ══════════════════════════════════════════════ */
export default function DietPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [foodLibrary, setFoodLibrary] = useState([]);
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

  const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [p, f] = await Promise.allSettled([
          axios.get(`${API}/diet`, { headers: getHeaders() }),
          axios.get(`${API}/diet/foods/library`, { headers: getHeaders() }),
        ]);
        if (p.status === 'fulfilled') setPlans(p.value.data || []);
        if (f.status === 'fulfilled') setFoodLibrary(f.value.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await axios.post(`${API}/diet/generate`, {}, { headers: getHeaders() });
      setPlans(prev => [res.data, ...prev]);
      setExpandedPlan(res.data.dietPlanId);
      showToast('Diet plan generated!');
    } catch (e) { showToast(e.response?.data || 'Failed to generate. Complete your profile first.', 'error'); }
    finally { setGenerating(false); }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingPlan) {
        const res = await axios.put(`${API}/diet/${editingPlan.dietPlanId}`, data, { headers: getHeaders() });
        setPlans(prev => prev.map(p => p.dietPlanId === editingPlan.dietPlanId ? res.data : p));
        showToast('Plan updated!');
      } else {
        const res = await axios.post(`${API}/diet`, data, { headers: getHeaders() });
        setPlans(prev => [res.data, ...prev]);
        showToast('Plan created!');
      }
      setShowCreateModal(false); setEditingPlan(null);
    } catch (e) { showToast(e.response?.data || 'Failed to save plan', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingPlan) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/diet/${deletingPlan.dietPlanId}`, { headers: getHeaders() });
      setPlans(prev => prev.filter(p => p.dietPlanId !== deletingPlan.dietPlanId));
      if (expandedPlan === deletingPlan.dietPlanId) setExpandedPlan(null);
      showToast('Plan deleted'); setDeletingPlan(null);
    } catch (e) { showToast('Failed to delete plan', 'error'); }
    finally { setDeleting(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  const getMealsForDay = (meals, day) => day === 0 ? (meals || []) : (meals || []).filter(m => m.dayOfWeek === day);

  const getPlanMacros = (meals) => {
    const m = meals || [];
    return {
      protein: m.reduce((s, x) => s + (x.proteinGrams || 0), 0),
      carbs: m.reduce((s, x) => s + (x.carbsGrams || 0), 0),
      fats: m.reduce((s, x) => s + (x.fatsGrams || 0), 0),
      calories: m.reduce((s, x) => s + (x.calories || 0), 0),
    };
  };

  return (
    <PageBackground>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(240,240,216,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRight: '1px solid rgba(44,44,26,0.1)', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          <div style={{ padding: '0 24px 28px' }}>
            <Link to="/" style={{ textDecoration: 'none' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.03em', fontStyle: 'italic' }}>V – Fit</span></Link>
          </div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {NAV.map(item => {
              const isActive = item.to === '/diet';
              return (
                <Link key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', fontSize: '14px', fontWeight: isActive ? '500' : '400', color: isActive ? 'var(--green)' : 'var(--ink-muted)', background: isActive ? 'var(--green-pale)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(44,44,26,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                  {item.icon}{item.label}
                </Link>
              );
            })}
          </nav>
          <div style={{ padding: '0 12px' }}>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', fontSize: '14px', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-muted)'; }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 3H3C2.4 3 2 3.4 2 4V14C2 14.6 2.4 15 3 15H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 6L16 9L12 12M16 9H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Log out
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ marginLeft: '220px', flex: 1, padding: '32px 36px', minWidth: 0 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', animation: 'fadeUp 0.5s ease forwards' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--ink)', marginBottom: '4px' }}>Diet Plans</h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>Plan meals, track macros, and auto-generate based on your preferences</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleGenerate} disabled={generating} className="btn btn-outline" style={{ fontSize: '13px', padding: '9px 18px' }}>
                {generating ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(44,44,26,0.2)" strokeWidth="2"/><path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--accent-light)" strokeWidth="2" strokeLinecap="round"/></svg>Generating…</span>
                  : <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 5.5H15L11 8.5L12.5 14L8 11L3.5 14L5 8.5L1 5.5H6L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>Auto-generate</>}
              </button>
              <button onClick={() => { setEditingPlan(null); setShowCreateModal(true); }} style={{ padding: '9px 18px', borderRadius: '100px', border: '1.5px solid var(--accent-light)', background: 'var(--accent-light)', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d57019'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-light)'; }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                Create plan
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="16" cy="16" r="12" stroke="rgba(230,126,34,0.2)" strokeWidth="3"/><path d="M16 4C22.6 4 28 9.4 28 16" stroke="var(--accent-light)" strokeWidth="3" strokeLinecap="round"/></svg>
              <span style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>Loading diet plans…</span>
            </div>
          ) : plans.length === 0 ? (
            <div style={{ ...cardBg, padding: '60px 40px', textAlign: 'center', animation: 'fadeUp 0.5s ease forwards' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto 20px', opacity: 0.25 }}>
                <path d="M32 8C32 8 16 18 16 34C16 42 22 50 32 50C42 50 48 42 48 34C48 18 32 8 32 8Z" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M24 38C26 42 29 44 32 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              </svg>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', marginBottom: '8px' }}>No diet plans yet</h3>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>Create a custom meal plan or auto-generate one based on your dietary preferences and calorie goals.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={handleGenerate} disabled={generating} className="btn btn-outline" style={{ fontSize: '13px' }}>Auto-generate a plan</button>
                <button onClick={() => setShowCreateModal(true)} style={{ padding: '12px 24px', borderRadius: '100px', border: 'none', background: 'var(--accent-light)', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Create from scratch</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {plans.map((plan, idx) => {
                const isExpanded = expandedPlan === plan.dietPlanId;
                const allMeals = plan.meals || [];
                const dayMeals = getMealsForDay(allMeals, selectedDay);
                const macros = getPlanMacros(dayMeals);

                return (
                  <div key={plan.dietPlanId} style={{ ...cardBg, padding: 0, overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease', animation: `fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s both` }}
                    onMouseEnter={e => { if (!isExpanded) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,44,26,0.08)'; }}}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                    {/* Plan header */}
                    <div onClick={() => setExpandedPlan(isExpanded ? null : plan.dietPlanId)} style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: plan.isAutoGenerated ? 'rgba(74,103,65,0.08)' : 'rgba(230,126,34,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MacroDonut protein={getPlanMacros(allMeals).protein} carbs={getPlanMacros(allMeals).carbs} fats={getPlanMacros(allMeals).fats} size={36} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>{plan.planName}</h3>
                          {plan.isAutoGenerated && <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--green)', background: 'var(--green-pale)', padding: '2px 8px', borderRadius: '100px' }}>Auto</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--ink-light)' }}>
                          {plan.dietType && <span style={{ color: 'var(--accent-light)', fontWeight: '500' }}>{formatLabel(plan.dietType)}</span>}
                          {plan.targetCalories && <span>{plan.targetCalories} kcal target</span>}
                          <span>{allMeals.length} meal{allMeals.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setEditingPlan(plan); setShowCreateModal(true); }} style={{ padding: '7px 8px', borderRadius: '8px', border: 'none', background: 'rgba(44,44,26,0.04)', cursor: 'pointer', color: 'var(--ink-light)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,126,34,0.1)'; e.currentTarget.style.color = 'var(--accent-light)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }} title="Edit plan">
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => setDeletingPlan(plan)} style={{ padding: '7px 8px', borderRadius: '8px', border: 'none', background: 'rgba(44,44,26,0.04)', cursor: 'pointer', color: 'var(--ink-light)', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.08)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,44,26,0.04)'; e.currentTarget.style.color = 'var(--ink-light)'; }} title="Delete plan">
                          <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2.5 4H11.5M5 4V2.5H9V4M5.5 6V10.5M8.5 6V10.5M3.5 4L4 11.5H10L10.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>

                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--ink-light)', transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid rgba(44,44,26,0.06)', padding: '16px 24px 20px', animation: 'fadeUp 0.3s ease' }}>
                        {/* Day filter + macros summary */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {DAYS.map((day, i) => {
                              const count = i === 0 ? allMeals.length : allMeals.filter(m => m.dayOfWeek === i).length;
                              const isActive = selectedDay === i;
                              return (
                                <button key={day} onClick={() => setSelectedDay(i)} style={{ padding: '6px 12px', borderRadius: '100px', border: 'none', background: isActive ? 'var(--accent-light)' : 'rgba(44,44,26,0.05)', color: isActive ? 'white' : 'var(--ink-muted)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  {day}
                                  {count > 0 && <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(230,126,34,0.12)', color: isActive ? 'white' : 'var(--accent-light)', padding: '0 5px', borderRadius: '100px', fontSize: '10px' }}>{count}</span>}
                                </button>
                              );
                            })}
                          </div>
                          {/* Macro summary badges */}
                          <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: '500' }}>
                            <span style={{ color: MACRO_COLORS.protein, background: 'rgba(74,103,65,0.08)', padding: '3px 10px', borderRadius: '100px' }}>P: {Math.round(macros.protein)}g</span>
                            <span style={{ color: MACRO_COLORS.carbs, background: 'rgba(230,126,34,0.08)', padding: '3px 10px', borderRadius: '100px' }}>C: {Math.round(macros.carbs)}g</span>
                            <span style={{ color: MACRO_COLORS.fats, background: 'rgba(192,57,43,0.08)', padding: '3px 10px', borderRadius: '100px' }}>F: {Math.round(macros.fats)}g</span>
                            <span style={{ color: 'var(--ink)', background: 'rgba(44,44,26,0.06)', padding: '3px 10px', borderRadius: '100px' }}>{Math.round(macros.calories)} cal</span>
                          </div>
                        </div>

                        {/* Calorie progress */}
                        {plan.targetCalories > 0 && <div style={{ marginBottom: '16px' }}><CalorieBar current={Math.round(macros.calories)} target={plan.targetCalories} /></div>}

                        {/* Meals grouped by type */}
                        {dayMeals.length === 0 ? (
                          <p style={{ fontSize: '13px', color: 'var(--ink-light)', textAlign: 'center', padding: '20px 0' }}>No meals for {selectedDay === 0 ? 'this plan' : DAYS[selectedDay]}</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {MEAL_TYPES.map(mt => {
                              const typeMeals = dayMeals.filter(m => m.mealType === mt);
                              if (typeMeals.length === 0) return null;
                              return (
                                <div key={mt}>
                                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span>{mealIcon(mt)}</span> {mt}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {typeMeals.map((meal, i) => (
                                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(250,250,240,0.6)', border: '1px solid rgba(44,44,26,0.04)', animation: `slideUp 0.3s ease ${i * 0.03}s both` }}>
                                        <div style={{ flex: 1 }}>
                                          <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>{meal.foodName || 'Meal'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                                          <span style={{ color: MACRO_COLORS.protein }}>P{Math.round(meal.proteinGrams || 0)}</span>
                                          <span style={{ color: MACRO_COLORS.carbs }}>C{Math.round(meal.carbsGrams || 0)}</span>
                                          <span style={{ color: MACRO_COLORS.fats }}>F{Math.round(meal.fatsGrams || 0)}</span>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)', minWidth: '50px', textAlign: 'right' }}>{meal.calories} cal</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
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

      {(showCreateModal || editingPlan) && <DietModal plan={editingPlan} foodLibrary={foodLibrary} saving={saving} onSave={handleSave} onClose={() => { setShowCreateModal(false); setEditingPlan(null); }} />}
      {deletingPlan && <ConfirmModal title="Delete diet plan" message={`Are you sure you want to delete "${deletingPlan.planName}"? This action cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeletingPlan(null)} loading={deleting} />}
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