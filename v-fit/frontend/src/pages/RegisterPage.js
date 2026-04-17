import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Navbar from '../components/Navbar';
import PageBackground from '../components/PageBackground';
import axios from 'axios';

const GOALS = [
  { value: 'WEIGHT_LOSS', label: 'Lose weight' },
  { value: 'MUSCLE_GAIN', label: 'Build muscle' },
  { value: 'MAINTAIN', label: 'Stay fit' },
];
const GENDERS = ['Male', 'Female', 'Prefer not to say'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '', age: '', gender: '', fitnessGoal: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (serverError) setServerError('');
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.age) errs.age = 'Age is required';
    else if (form.age < 13 || form.age > 100) errs.age = 'Enter a valid age';
    if (!form.gender) errs.gender = 'Please select your gender';
    if (!form.fitnessGoal) errs.fitnessGoal = 'Please select your goal';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await axios.post('/api', {
        email: form.email, password: form.password,
        name: form.name, age: parseInt(form.age),
        gender: form.gender, fitnessGoal: form.fitnessGoal,
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      if (msg.toLowerCase().includes('email')) { setStep(1); setErrors({ email: 'Email already registered' }); }
      else setServerError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setServerError('');
    try {
      const res = await axios.post('/api/auth/google', { credential: tokenResponse.access_token });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setServerError('Google sign-up failed. Please try again.');
    } finally { setGoogleLoading(false); }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setServerError('Google login was cancelled or failed.'),
  });

  const pwStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Weak', color: 'var(--accent)', pct: 30 };
    if (p.length < 10 || !/\d/.test(p)) return { label: 'Fair', color: 'var(--accent-light)', pct: 60 };
    return { label: 'Strong', color: 'var(--green)', pct: 100 };
  };
  const strength = pwStrength();

  return (
    <PageBackground>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 48px' }}>
          <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeUp 0.5s ease forwards' }}>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '-0.025em', marginBottom: '6px', color: 'var(--ink)' }}>Create your account</h1>
              <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>{step === 1 ? 'Start with your login details' : 'Tell us about your fitness goals'}</p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2].map(n => (
                <div key={n} style={{ flex: 1, height: '3px', borderRadius: '2px', background: n <= step ? 'var(--green)' : 'rgba(44,44,26,0.2)', transition: 'background 0.3s ease' }} />
              ))}
            </div>

            <div style={{ background: 'rgba(245, 245, 225, 0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(44,44,26,0.16)', padding: '32px', boxShadow: '0 12px 48px rgba(44,44,26,0.18)' }}>
              {serverError && (
                <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: 'var(--accent)' }}>{serverError}</div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Email address</label>
                    <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email"/>
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" className={`form-input ${errors.password ? 'error' : ''}`} placeholder="At least 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password"/>
                    {strength && (
                      <div style={{ marginTop: '6px' }}>
                        <div style={{ height: '3px', background: 'var(--cream-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: '2px', transition: 'all 0.3s ease' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: strength.color, marginTop: '4px', display: 'block' }}>{strength.label} password</span>
                      </div>
                    )}
                    {errors.password && <span className="form-error">{errors.password}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm password</label>
                    <input type="password" name="confirmPassword" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password"/>
                    {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                  </div>
                  <button className="btn btn-green" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', marginTop: '6px' }}>
                    Continue
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="divider" style={{ margin: '4px 0' }}>or</div>
                  <button type="button" onClick={() => googleLogin()} disabled={googleLoading}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: 'white', border: '1.5px solid rgba(44,44,26,0.2)', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '500', color: 'var(--ink)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,44,26,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    {googleLoading ? 'Signing up…' : 'Continue with Google'}
                  </button>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label">Full name</label>
                      <input type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your name" value={form.name} onChange={handleChange} autoComplete="name"/>
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Age</label>
                        <input type="number" name="age" className={`form-input ${errors.age ? 'error' : ''}`} placeholder="e.g. 25" value={form.age} onChange={handleChange} min="13" max="100"/>
                        {errors.age && <span className="form-error">{errors.age}</span>}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select name="gender" className={`form-input ${errors.gender ? 'error' : ''}`} value={form.gender} onChange={handleChange} style={{ appearance: 'none' }}>
                          <option value="">Select…</option>
                          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        {errors.gender && <span className="form-error">{errors.gender}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fitness goal</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {GOALS.map(g => (
                          <button key={g.value} type="button"
                            onClick={() => { setForm(p => ({ ...p, fitnessGoal: g.value })); setErrors(p => ({ ...p, fitnessGoal: '' })); }}
                            style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: `1.5px solid ${form.fitnessGoal === g.value ? 'var(--green)' : 'var(--border-strong)'}`, background: form.fitnessGoal === g.value ? 'var(--green-pale)' : 'rgba(250,250,240,0.6)', color: form.fitnessGoal === g.value ? 'var(--green)' : 'var(--ink-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap' }}
                          >{g.label}</button>
                        ))}
                      </div>
                      {errors.fitnessGoal && <span className="form-error">{errors.fitnessGoal}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)} style={{ padding: '13px 20px' }}>← Back</button>
                    <button type="submit" className="btn btn-green" disabled={loading} style={{ flex: 1, justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
                      {loading ? 'Creating account…' : 'Create account'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--green)', fontWeight: '500' }}>Log in</Link>
            </p>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </PageBackground>
  );
}