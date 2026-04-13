import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageBackground from '../components/PageBackground';

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

const QUICK_PROMPTS = [
  { text: 'What should I eat today?', icon: '🍽️' },
  { text: 'Suggest a workout for me', icon: '💪' },
  { text: 'How is my progress?', icon: '📊' },
  { text: 'Tips to lose weight', icon: '🔥' },
  { text: 'How much protein do I need?', icon: '🥩' },
  { text: 'Help me stay motivated', icon: '🚀' },
];

/* ── Typing Indicator ── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: 'var(--green)',
          animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── Format AI response with basic markdown ── */
function FormattedMessage({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: '8px' }} />;
        // Bold markers
        const parts = trimmed.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} style={{ fontWeight: '600', color: 'var(--ink)' }}>{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        });
        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ color: 'var(--green)', fontWeight: '600', flexShrink: 0 }}>•</span>
              <span>{parts.map((p, idx) => idx === 0 ? <span key={idx}>{typeof p === 'string' ? p.replace(/^[-•]\s*/, '') : p}</span> : p)}</span>
            </div>
          );
        }
        // Numbered lists
        if (/^\d+[\.\)]\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)/)[1];
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ color: 'var(--green)', fontWeight: '600', minWidth: '16px', flexShrink: 0 }}>{num}.</span>
              <span>{trimmed.replace(/^\d+[\.\)]\s*/, '')}</span>
            </div>
          );
        }
        return <p key={i} style={{ margin: 0 }}>{parts}</p>;
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN AI ASSISTANT PAGE
   ══════════════════════════════════════════════ */
export default function AiAssistantPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  /* Load chat history + profile */
  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    const load = async () => {
      try {
        const [h, p] = await Promise.allSettled([
          axios.get(`${API}/ai/history?limit=10`, { headers: getHeaders() }),
          axios.get(`${API}/profile`, { headers: getHeaders() }),
        ]);
        if (h.status === 'fulfilled' && h.value.data) {
          // History comes newest-first, reverse for chat display
          const history = (h.value.data || []).reverse();
          const chatMsgs = [];
          history.forEach(item => {
            chatMsgs.push({ role: 'user', content: item.userMessage, time: item.createdAt });
            chatMsgs.push({ role: 'ai', content: item.aiResponse, time: item.createdAt, model: item.apiUsed });
          });
          setMessages(chatMsgs);
        }
        if (p.status === 'fulfilled') setProfile(p.value.data);
      } catch (e) { console.error(e); }
      finally { setLoadingHistory(false); }
    };
    load();
  }, [navigate]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* Send message */
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput('');
    setError(null);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: msg, time: new Date().toISOString() }]);
    setSending(true);

    try {
      const res = await axios.post(`${API}/ai/chat`, { message: msg }, { headers: getHeaders() });
      setMessages(prev => [...prev, {
        role: 'ai',
        content: res.data.aiResponse,
        time: res.data.createdAt,
        model: res.data.apiUsed,
      }]);
    } catch (e) {
      setError('Unable to get a response. Please try again.');
      setMessages(prev => [...prev, {
        role: 'ai',
        content: null,
        error: true,
        time: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRetry = () => {
    // Remove last error message and resend
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(prev => prev.filter(m => !m.error));
      setError(null);
      sendMessage(lastUserMsg.content);
    }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); };

  const formatTime = (t) => {
    if (!t) return '';
    try {
      const d = new Date(t);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch { return ''; }
  };

  const formatGoal = g => !g ? '' : g.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  const hasHistory = messages.length > 0;

  return (
    <PageBackground>
      <div style={{ display: 'flex', minHeight: '100vh', height: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: '220px', flexShrink: 0, background: 'rgba(240,240,216,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRight: '1px solid rgba(44,44,26,0.1)', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
          <div style={{ padding: '0 24px 28px' }}><Link to="/" style={{ textDecoration: 'none' }}><span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.03em', fontStyle: 'italic' }}>V – Fit</span></Link></div>
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
            {NAV.map(item => {
              const isActive = item.to === '/ai';
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

        {/* ── Chat Area ── */}
        <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

          {/* Chat Header */}
          <div style={{
            padding: '16px 32px', borderBottom: '1px solid rgba(44,44,26,0.08)',
            background: 'rgba(245,245,225,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, animation: 'fadeUp 0.4s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(74,103,65,0.2)',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7.5" stroke="white" strokeWidth="1.5"/>
                  <path d="M7 10C7 8 8.3 6.5 10 6.5C11.7 6.5 13 8 13 10C13 11.3 12.2 12.4 11 12.8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="10" cy="14.5" r="0.8" fill="white"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>V-Fit AI Assistant</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s ease infinite' }} />
                  <span style={{ fontSize: '11px', color: 'var(--ink-light)' }}>Powered by GPT-4o-mini</span>
                </div>
              </div>
            </div>

            {/* Context badges */}
            {profile && (
              <div style={{ display: 'flex', gap: '6px', animation: 'fadeIn 0.5s ease 0.3s both' }}>
                {profile.fitnessGoal && (
                  <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--green)', background: 'var(--green-pale)', padding: '3px 10px', borderRadius: '100px' }}>
                    {formatGoal(profile.fitnessGoal)}
                  </span>
                )}
                {profile.dietaryPreference && (
                  <span style={{ fontSize: '10px', fontWeight: '500', color: 'var(--accent-light)', background: 'rgba(230,126,34,0.1)', padding: '3px 10px', borderRadius: '100px' }}>
                    {formatGoal(profile.dietaryPreference)}
                  </span>
                )}
                {profile.activityLevel && (
                  <span style={{ fontSize: '10px', fontWeight: '500', color: '#2196F3', background: 'rgba(33,150,243,0.08)', padding: '3px 10px', borderRadius: '100px' }}>
                    {formatGoal(profile.activityLevel)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '24px 32px',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            {loadingHistory ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '12px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ animation: 'spin 1s linear infinite' }}><circle cx="14" cy="14" r="10" stroke="rgba(74,103,65,0.2)" strokeWidth="2.5"/><path d="M14 4C19.5 4 24 8.5 24 14" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"/></svg>
                <span style={{ fontSize: '13px', color: 'var(--ink-light)' }}>Loading chat history…</span>
              </div>
            ) : !hasHistory ? (
              /* ── Welcome / Empty State ── */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, animation: 'fadeUp 0.6s ease', maxWidth: '520px', margin: '0 auto' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, var(--green-pale) 0%, rgba(74,103,65,0.12) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                  animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
                }}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" stroke="var(--green)" strokeWidth="2"/>
                    <path d="M11 16C11 13.2 13 10.5 16 10.5C19 10.5 21 13.2 21 16C21 18.2 19.5 20 17.5 20.8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="16" cy="23.5" r="1.2" fill="var(--green)"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--ink)', marginBottom: '8px', textAlign: 'center', letterSpacing: '-0.02em' }}>
                  Your personal fitness coach
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: '1.6', marginBottom: '28px' }}>
                  Ask me anything about workouts, nutrition, diet plans, or your fitness goals. I'm personalized to your profile.
                </p>

                {/* Quick prompts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button key={i} onClick={() => sendMessage(prompt.text)}
                      style={{
                        padding: '12px 16px', borderRadius: '14px',
                        border: '1px solid rgba(44,44,26,0.1)',
                        background: 'rgba(245,245,225,0.7)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--ink)', fontSize: '13px', fontWeight: '400',
                        cursor: 'pointer', fontFamily: 'var(--font-body)',
                        textAlign: 'left', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        animation: `fadeUp 0.4s ease ${0.15 + i * 0.06}s both`,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = 'rgba(220,232,200,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.1)'; e.currentTarget.style.background = 'rgba(245,245,225,0.7)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <span style={{ fontSize: '16px' }}>{prompt.icon}</span>
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Chat Messages ── */
              <>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    animation: `${msg.role === 'user' ? 'slideInRight' : 'slideInLeft'} 0.35s cubic-bezier(0.16, 1, 0.3, 1)`,
                  }}>
                    {/* AI avatar */}
                    {msg.role === 'ai' && (
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginRight: '10px', marginTop: '2px',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.2"/>
                          <path d="M5 7C5 5.8 5.9 4.8 7 4.8C8.1 4.8 9 5.8 9 7C9 7.9 8.4 8.7 7.6 9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="10.5" r="0.6" fill="white"/>
                        </svg>
                      </div>
                    )}

                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{
                        padding: '14px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.role === 'user'
                          ? 'var(--green)'
                          : msg.error
                            ? 'rgba(192,57,43,0.06)'
                            : 'rgba(245,245,225,0.92)',
                        color: msg.role === 'user' ? 'white' : msg.error ? 'var(--accent)' : 'var(--ink)',
                        fontSize: '14px', lineHeight: '1.6',
                        border: msg.role === 'user' ? 'none' : '1px solid rgba(44,44,26,0.08)',
                        backdropFilter: msg.role === 'ai' ? 'blur(8px)' : 'none',
                        boxShadow: msg.role === 'user' ? '0 2px 12px rgba(74,103,65,0.15)' : 'none',
                      }}>
                        {msg.error ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span>Unable to generate a response. Please try again.</span>
                            <button onClick={handleRetry} style={{
                              padding: '6px 14px', borderRadius: '100px', border: '1.5px solid var(--accent)',
                              background: 'transparent', color: 'var(--accent)',
                              fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                              fontFamily: 'var(--font-body)', alignSelf: 'flex-start',
                              display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 6C1.5 3.5 3.5 1.5 6 1.5C8.5 1.5 10.5 3.5 10.5 6C10.5 8.5 8.5 10.5 6 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M1 3.5V6H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Retry
                            </button>
                          </div>
                        ) : msg.role === 'user' ? (
                          msg.content
                        ) : (
                          <FormattedMessage text={msg.content} />
                        )}
                      </div>
                      <span style={{
                        fontSize: '10px', color: 'var(--ink-light)',
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        paddingLeft: msg.role === 'ai' ? '4px' : '0',
                        paddingRight: msg.role === 'user' ? '4px' : '0',
                      }}>
                        {formatTime(msg.time)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {sending && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.2"/></svg>
                    </div>
                    <div style={{
                      padding: '14px 20px', borderRadius: '18px 18px 18px 4px',
                      background: 'rgba(245,245,225,0.92)', border: '1px solid rgba(44,44,26,0.08)',
                    }}>
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </>
            )}
          </div>

          {/* ── Input Bar ── */}
          <div style={{
            padding: '16px 32px 20px', borderTop: '1px solid rgba(44,44,26,0.06)',
            background: 'rgba(245,245,225,0.6)', backdropFilter: 'blur(12px)',
            flexShrink: 0,
          }}>
            {/* Quick prompts row (when has history) */}
            {hasHistory && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
                {QUICK_PROMPTS.slice(0, 4).map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt.text)} disabled={sending}
                    style={{
                      padding: '5px 12px', borderRadius: '100px',
                      border: '1px solid rgba(44,44,26,0.1)',
                      background: 'rgba(250,250,240,0.8)',
                      color: 'var(--ink-muted)', fontSize: '11px', fontWeight: '400',
                      cursor: sending ? 'default' : 'pointer', fontFamily: 'var(--font-body)',
                      whiteSpace: 'nowrap', transition: 'all 0.15s', opacity: sending ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { if (!sending) e.currentTarget.style.borderColor = 'var(--green)'; }}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(44,44,26,0.1)'}
                  >
                    {prompt.icon} {prompt.text}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about workouts, diet, nutrition..."
                  disabled={sending}
                  rows={1}
                  style={{
                    width: '100%', padding: '13px 18px', paddingRight: '48px',
                    border: '1.5px solid rgba(44,44,26,0.15)',
                    borderRadius: '16px', background: 'var(--white)',
                    fontSize: '14px', fontFamily: 'var(--font-body)',
                    color: 'var(--ink)', outline: 'none',
                    resize: 'none', minHeight: '48px', maxHeight: '120px',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    lineHeight: '1.5',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,103,65,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(44,44,26,0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <span style={{
                  position: 'absolute', right: '14px', bottom: '12px',
                  fontSize: '10px', color: input.length > 450 ? 'var(--accent)' : 'var(--ink-light)',
                }}>
                  {input.length > 0 && `${input.length}/500`}
                </span>
              </div>

              <button onClick={() => sendMessage()} disabled={sending || !input.trim()}
                style={{
                  width: '48px', height: '48px', borderRadius: '14px', border: 'none',
                  background: input.trim() && !sending ? 'var(--green)' : 'rgba(44,44,26,0.08)',
                  color: input.trim() && !sending ? 'white' : 'var(--ink-light)',
                  cursor: input.trim() && !sending ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', flexShrink: 0,
                  boxShadow: input.trim() && !sending ? '0 2px 12px rgba(74,103,65,0.2)' : 'none',
                }}
                onMouseEnter={e => { if (input.trim() && !sending) e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {sending ? (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(74,103,65,0.3)" strokeWidth="2"/>
                    <path d="M8 2C11.3 2 14 4.7 14 8" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9L15 3L9 15L8 10L3 9Z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </PageBackground>
  );
}