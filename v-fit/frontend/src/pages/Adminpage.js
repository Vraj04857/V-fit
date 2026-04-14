import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:8080/api/admin';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// ── Inline Styles ─────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--cream, #FAFAF2)',
    fontFamily: '"DM Sans", sans-serif',
    color: 'var(--ink, #1A1A0F)',
  },
  topbar: {
    background: '#fff',
    borderBottom: '1px solid rgba(44,44,26,0.1)',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: '"Instrument Serif", serif',
    fontSize: '22px',
    color: '#1A1A0F',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  adminBadge: {
    background: 'rgba(56,142,60,0.12)',
    color: '#2E7D32',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '100px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  logoutBtn: {
    padding: '7px 18px',
    borderRadius: '100px',
    border: '1px solid rgba(44,44,26,0.2)',
    background: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#1A1A0F',
    fontFamily: '"DM Sans", sans-serif',
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)',
  },
  sidebar: {
    width: '220px',
    background: '#fff',
    borderRight: '1px solid rgba(44,44,26,0.08)',
    padding: '24px 0',
    flexShrink: 0,
  },
  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: active ? '500' : '400',
    color: active ? '#2E7D32' : '#555',
    background: active ? 'rgba(56,142,60,0.08)' : 'transparent',
    borderRight: active ? '2px solid #2E7D32' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
    userSelect: 'none',
  }),
  main: {
    flex: 1,
    padding: '32px',
    maxWidth: '1100px',
  },
  pageTitle: {
    fontFamily: '"Instrument Serif", serif',
    fontSize: '26px',
    fontWeight: '400',
    color: '#1A1A0F',
    marginBottom: '4px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '28px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '14px',
    marginBottom: '32px',
  },
  statCard: (color) => ({
    background: '#fff',
    border: '1px solid rgba(44,44,26,0.1)',
    borderRadius: '12px',
    padding: '18px 20px',
    borderTop: `3px solid ${color}`,
  }),
  statLabel: {
    fontSize: '12px',
    color: '#888',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1A1A0F',
    fontFamily: '"Instrument Serif", serif',
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(44,44,26,0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(44,44,26,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1A1A0F',
  },
  addBtn: {
    padding: '7px 16px',
    borderRadius: '100px',
    border: 'none',
    background: '#2E7D32',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    padding: '10px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#888',
    background: '#FAFAF2',
    borderBottom: '1px solid rgba(44,44,26,0.08)',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(44,44,26,0.06)',
    color: '#1A1A0F',
    verticalAlign: 'middle',
  },
  badge: (active) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: '600',
    background: active ? 'rgba(56,142,60,0.12)' : 'rgba(211,47,47,0.1)',
    color: active ? '#2E7D32' : '#C62828',
  }),
  roleBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: '600',
    background: 'rgba(25,118,210,0.1)',
    color: '#1565C0',
  },
  actionBtn: (danger) => ({
    padding: '5px 12px',
    borderRadius: '6px',
    border: `1px solid ${danger ? 'rgba(211,47,47,0.3)' : 'rgba(44,44,26,0.2)'}`,
    background: 'transparent',
    color: danger ? '#C62828' : '#555',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    marginLeft: '6px',
  }),
  toggleBtn: (active) => ({
    padding: '5px 12px',
    borderRadius: '6px',
    border: `1px solid ${active ? 'rgba(211,47,47,0.3)' : 'rgba(56,142,60,0.3)'}`,
    background: 'transparent',
    color: active ? '#C62828' : '#2E7D32',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  }),
  modal: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999,
  },
  modalBox: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    width: '460px',
    maxWidth: '90vw',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
  },
  modalTitle: {
    fontFamily: '"Instrument Serif", serif',
    fontSize: '20px',
    marginBottom: '20px',
    color: '#1A1A0F',
  },
  formGroup: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(44,44,26,0.2)',
    fontSize: '14px',
    fontFamily: '"DM Sans", sans-serif',
    color: '#1A1A0F',
    background: '#FAFAF2',
    boxSizing: 'border-box',
    outline: 'none',
  },
  modalActions: {
    display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px',
  },
  cancelBtn: {
    padding: '9px 20px',
    borderRadius: '100px',
    border: '1px solid rgba(44,44,26,0.2)',
    background: 'transparent',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    color: '#555',
  },
  saveBtn: {
    padding: '9px 22px',
    borderRadius: '100px',
    border: 'none',
    background: '#2E7D32',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
  },
  emptyRow: {
    padding: '32px',
    textAlign: 'center',
    color: '#aaa',
    fontSize: '13px',
  },
  searchBar: {
    padding: '8px 14px',
    borderRadius: '100px',
    border: '1px solid rgba(44,44,26,0.15)',
    fontSize: '13px',
    fontFamily: '"DM Sans", sans-serif',
    color: '#1A1A0F',
    background: '#FAFAF2',
    outline: 'none',
    width: '200px',
  },
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'overview', label: 'Overview', icon: '⬡' },
  { key: 'users', label: 'Users', icon: '◎' },
  { key: 'exercises', label: 'Exercise Library', icon: '◈' },
  { key: 'foods', label: 'Food Library', icon: '◉' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Modal state
  const [modal, setModal] = useState(null); // { type: 'exercise'|'food', mode: 'add'|'edit', data: {} }
  const [form, setForm] = useState({});

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/stats`, getAuthHeaders());
      setStats(data);
    } catch { /* handled below */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/users`, getAuthHeaders());
      setUsers(data);
    } finally { setLoading(false); }
  }, []);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/exercises`, getAuthHeaders());
      setExercises(data);
    } finally { setLoading(false); }
  }, []);

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/foods`, getAuthHeaders());
      setFoods(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    if (tab === 'users') fetchUsers();
    if (tab === 'exercises') fetchExercises();
    if (tab === 'foods') fetchFoods();
  }, [tab, fetchStats, fetchUsers, fetchExercises, fetchFoods]);

  const toggleUser = async (userId, active) => {
    await axios.put(`${API}/users/${userId}/toggle-status`, {}, getAuthHeaders());
    setUsers(prev => prev.map(u =>
      u.userId === userId ? { ...u, isActive: !active } : u
    ));
    fetchStats();
  };

  const openAdd = (type) => {
    setForm({});
    setModal({ type, mode: 'add' });
  };

  const openEdit = (type, item) => {
    setForm({ ...item });
    setModal({ type, mode: 'edit', id: item.libraryExerciseId || item.foodId });
  };

  const closeModal = () => { setModal(null); setForm({}); };

  const handleSave = async () => {
    const { type, mode, id } = modal;
    if (type === 'exercise') {
      if (mode === 'add') {
        const { data } = await axios.post(`${API}/exercises`, form, getAuthHeaders());
        setExercises(prev => [...prev, data]);
      } else {
        const { data } = await axios.put(`${API}/exercises/${id}`, form, getAuthHeaders());
        setExercises(prev => prev.map(e => e.libraryExerciseId === id ? data : e));
      }
    } else {
      if (mode === 'add') {
        const { data } = await axios.post(`${API}/foods`, form, getAuthHeaders());
        setFoods(prev => [...prev, data]);
      } else {
        const { data } = await axios.put(`${API}/foods/${id}`, form, getAuthHeaders());
        setFoods(prev => prev.map(f => f.foodId === id ? data : f));
      }
    }
    closeModal();
    fetchStats();
  };

  const deleteExercise = async (id) => {
    if (!window.confirm('Delete this exercise?')) return;
    await axios.delete(`${API}/exercises/${id}`, getAuthHeaders());
    setExercises(prev => prev.filter(e => e.libraryExerciseId !== id));
    fetchStats();
  };

  const deleteFood = async (id) => {
    if (!window.confirm('Delete this food?')) return;
    await axios.delete(`${API}/foods/${id}`, getAuthHeaders());
    setFoods(prev => prev.filter(f => f.foodId !== id));
    fetchStats();
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredExercises = exercises.filter(e =>
    (e.exerciseName || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredFoods = foods.filter(f =>
    (f.foodName || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div style={s.logo}>
          V-Fit <span style={s.adminBadge}>Admin</span>
        </div>
        <button style={s.logoutBtn} onClick={logout}>Log out</button>
      </div>

      <div style={s.layout}>
        {/* Sidebar */}
        <div style={s.sidebar}>
          {NAV.map(n => (
            <div key={n.key} style={s.navItem(tab === n.key)} onClick={() => { setTab(n.key); setSearch(''); }}>
              <span style={{ fontSize: '14px' }}>{n.icon}</span> {n.label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={s.main}>

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              <div style={s.pageTitle}>Dashboard Overview</div>
              <div style={s.pageSubtitle}>System-wide usage statistics</div>
              <div style={s.statsGrid}>
                {[
                  { label: 'Total Users', value: stats?.totalUsers ?? '—', color: '#1565C0' },
                  { label: 'Active Users', value: stats?.activeUsers ?? '—', color: '#2E7D32' },
                  { label: 'Inactive Users', value: stats?.inactiveUsers ?? '—', color: '#C62828' },
                  { label: 'Exercises', value: stats?.totalExercises ?? '—', color: '#E65100' },
                  { label: 'Foods', value: stats?.totalFoods ?? '—', color: '#6A1B9A' },
                ].map(c => (
                  <div key={c.label} style={s.statCard(c.color)}>
                    <div style={s.statLabel}>{c.label}</div>
                    <div style={s.statValue}>{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div style={{ ...s.card, padding: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: '500', marginBottom: '16px' }}>Quick Actions</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {['users', 'exercises', 'foods'].map(t => (
                    <button key={t} style={{ ...s.addBtn, background: '#fff', color: '#2E7D32', border: '1px solid #2E7D32', padding: '9px 22px' }}
                      onClick={() => setTab(t)}>
                      Manage {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <>
              <div style={s.pageTitle}>User Management</div>
              <div style={s.pageSubtitle}>View and activate/deactivate accounts</div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>All Users ({users.length})</span>
                  <input style={s.searchBar} placeholder="Search by email…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['ID', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={s.emptyRow}>Loading…</td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={6} style={s.emptyRow}>No users found.</td></tr>
                    ) : filteredUsers.map(u => (
                      <tr key={u.userId}>
                        <td style={s.td}>{u.userId}</td>
                        <td style={s.td}>{u.email}</td>
                        <td style={s.td}><span style={s.roleBadge}>{u.role}</span></td>
                        <td style={s.td}><span style={s.badge(u.isActive)}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td style={s.td}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        <td style={s.td}>
                          <button style={s.toggleBtn(u.isActive)} onClick={() => toggleUser(u.userId, u.isActive)}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── Exercises ── */}
          {tab === 'exercises' && (
            <>
              <div style={s.pageTitle}>Exercise Library</div>
              <div style={s.pageSubtitle}>Manage exercises available to all users</div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Exercises ({exercises.length})</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={s.searchBar} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                    <button style={s.addBtn} onClick={() => openAdd('exercise')}>+ Add Exercise</button>
                  </div>
                </div>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Name', 'Category', 'Difficulty', 'Cal/min', 'Actions'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={s.emptyRow}>Loading…</td></tr>
                    ) : filteredExercises.length === 0 ? (
                      <tr><td colSpan={5} style={s.emptyRow}>No exercises found.</td></tr>
                    ) : filteredExercises.map(e => (
                      <tr key={e.libraryExerciseId}>
                        <td style={s.td}><strong>{e.exerciseName}</strong><br /><span style={{ fontSize: '12px', color: '#888' }}>{e.description}</span></td>
                        <td style={s.td}>{e.category || '—'}</td>
                        <td style={s.td}>{e.difficultyLevel || '—'}</td>
                        <td style={s.td}>{e.caloriesBurnedPerMin ?? '—'}</td>
                        <td style={s.td}>
                          <button style={s.actionBtn(false)} onClick={() => openEdit('exercise', e)}>Edit</button>
                          <button style={s.actionBtn(true)} onClick={() => deleteExercise(e.libraryExerciseId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── Foods ── */}
          {tab === 'foods' && (
            <>
              <div style={s.pageTitle}>Food Library</div>
              <div style={s.pageSubtitle}>Manage foods available for diet planning</div>
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardTitle}>Foods ({foods.length})</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input style={s.searchBar} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                    <button style={s.addBtn} onClick={() => openAdd('food')}>+ Add Food</button>
                  </div>
                </div>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Name', 'Category', 'Serving', 'Calories', 'Protein', 'Carbs', 'Fats', 'Actions'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={8} style={s.emptyRow}>Loading…</td></tr>
                    ) : filteredFoods.length === 0 ? (
                      <tr><td colSpan={8} style={s.emptyRow}>No foods found.</td></tr>
                    ) : filteredFoods.map(f => (
                      <tr key={f.foodId}>
                        <td style={s.td}><strong>{f.foodName}</strong></td>
                        <td style={s.td}>{f.category || '—'}</td>
                        <td style={s.td}>{f.servingSize || '—'}</td>
                        <td style={s.td}>{f.caloriesPerServing ?? '—'}</td>
                        <td style={s.td}>{f.proteinGrams ?? '—'}g</td>
                        <td style={s.td}>{f.carbsGrams ?? '—'}g</td>
                        <td style={s.td}>{f.fatsGrams ?? '—'}g</td>
                        <td style={s.td}>
                          <button style={s.actionBtn(false)} onClick={() => openEdit('food', f)}>Edit</button>
                          <button style={s.actionBtn(true)} onClick={() => deleteFood(f.foodId)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div style={s.modal} onClick={closeModal}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>
              {modal.mode === 'add' ? 'Add' : 'Edit'} {modal.type === 'exercise' ? 'Exercise' : 'Food'}
            </div>

            {modal.type === 'exercise' ? (
              <>
                {[
                  { key: 'exerciseName', label: 'Exercise Name', type: 'text' },
                  { key: 'category', label: 'Category', type: 'text' },
                  { key: 'difficultyLevel', label: 'Difficulty (Beginner / Intermediate / Advanced)', type: 'text' },
                  { key: 'caloriesBurnedPerMin', label: 'Calories Burned per Min', type: 'number' },
                  { key: 'description', label: 'Description', type: 'text' },
                ].map(f => (
                  <div key={f.key} style={s.formGroup}>
                    <label style={s.label}>{f.label}</label>
                    <input style={s.input} type={f.type} value={form[f.key] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { key: 'foodName', label: 'Food Name', type: 'text' },
                  { key: 'category', label: 'Category', type: 'text' },
                  { key: 'servingSize', label: 'Serving Size (e.g. 100g)', type: 'text' },
                  { key: 'caloriesPerServing', label: 'Calories per Serving', type: 'number' },
                  { key: 'proteinGrams', label: 'Protein (g)', type: 'number' },
                  { key: 'carbsGrams', label: 'Carbs (g)', type: 'number' },
                  { key: 'fatsGrams', label: 'Fats (g)', type: 'number' },
                ].map(f => (
                  <div key={f.key} style={s.formGroup}>
                    <label style={s.label}>{f.label}</label>
                    <input style={s.input} type={f.type} value={form[f.key] || ''}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </>
            )}

            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={s.saveBtn} onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}