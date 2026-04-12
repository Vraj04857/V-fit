import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import fitnessBg from '../assets/V.png';
import axios from 'axios';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

  const getStrength = (pw) => {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: 'Weak', color: '#C0392B', pct: 20 };
    if (score <= 2) return { label: 'Fair', color: '#E67E22', pct: 40 };
    if (score <= 3) return { label: 'Good', color: '#F1C40F', pct: 60 };
    if (score <= 4) return { label: 'Strong', color: '#27AE60', pct: 80 };
    return { label: 'Very strong', color: '#1E8449', pct: 100 };
  };

  const strength = getStrength(form.newPassword);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    if (serverError) setServerError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.newPassword) errs.newPassword = 'Password is required';
    else if (form.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate('/login', { state: { passwordReset: true } }), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 48px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '28px',
              color: 'var(--ink)', marginBottom: '12px',
            }}>
              Invalid reset link
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
              This password reset link is missing or invalid. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn-primary" style={{
              display: 'inline-block', textDecoration: 'none',
            }}>
              Request new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />

      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `url(${fitnessBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.06,
      }} />

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 48px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ width: '100%', maxWidth: '420px', animation: 'fadeUp 0.5s ease forwards' }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '32px',
              letterSpacing: '-0.025em', marginBottom: '8px', color: 'var(--ink)',
            }}>
              {success ? 'Password reset!' : 'Set new password'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
              {success
                ? 'Redirecting you to login...'
                : 'Choose a strong password for your account.'}
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(250, 250, 240, 0.92)', backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)', border: '1px solid rgba(44,44,26,0.12)',
            padding: '32px', boxShadow: '0 8px 32px rgba(44,44,26,0.1)',
          }}>

            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(61,90,62,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: '28px',
                }}>
                  ✅
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px' }}>
                  Your password has been updated successfully.
                </p>
                <Link to="/login" className="btn-primary" style={{
                  display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none',
                }}>
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                {serverError && (
                  <div style={{
                    background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)',
                    borderRadius: 'var(--radius-md)', padding: '12px 16px',
                    marginBottom: '20px', fontSize: '14px', color: 'var(--accent)',
                  }}>
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>

                    <div className="form-group">
                      <label className="form-label">New password</label>
                      <input
                        type="password" name="newPassword"
                        className={`form-input ${errors.newPassword ? 'error' : ''}`}
                        placeholder="At least 8 characters"
                        value={form.newPassword} onChange={handleChange}
                        autoComplete="new-password"
                      />
                      {strength && (
                        <div style={{ marginTop: '6px' }}>
                          <div style={{
                            height: '3px', background: 'var(--cream-dark)',
                            borderRadius: '2px', overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%', width: `${strength.pct}%`,
                              background: strength.color, borderRadius: '2px',
                              transition: 'all 0.3s ease',
                            }} />
                          </div>
                          <span style={{
                            fontSize: '11px', color: strength.color,
                            marginTop: '4px', display: 'block',
                          }}>
                            {strength.label} password
                          </span>
                        </div>
                      )}
                      {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm new password</label>
                      <input
                        type="password" name="confirmPassword"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword} onChange={handleChange}
                        autoComplete="new-password"
                      />
                      {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}>
                    {loading ? (
                      <span style={{
                        width: '18px', height: '18px', border: '2px solid rgba(250,250,240,0.3)',
                        borderTopColor: 'var(--cream)', borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite', display: 'inline-block',
                      }} />
                    ) : (
                      <>Reset password &rarr;</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}