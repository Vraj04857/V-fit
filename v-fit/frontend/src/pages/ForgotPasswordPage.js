import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import fitnessBg from '../assets/V.png';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      // Always show success (backend does the same for security)
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

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
              {sent ? 'Check your email' : 'Forgot password?'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
              {sent
                ? 'If an account exists with that email, we sent a reset link.'
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(250, 250, 240, 0.92)', backdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-lg)', border: '1px solid rgba(44,44,26,0.12)',
            padding: '32px', boxShadow: '0 8px 32px rgba(44,44,26,0.1)',
          }}>

            {sent ? (
              /* Success state */
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(61,90,62,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: '28px',
                }}>
                  ✉️
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                  The link will expire in 30 minutes. Check your spam folder if you don't see it.
                </p>
                <Link to="/login" className="btn-primary" style={{
                  display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none',
                }}>
                  Back to Login
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                {error && (
                  <div style={{
                    background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.25)',
                    borderRadius: 'var(--radius-md)', padding: '12px 16px',
                    marginBottom: '20px', fontSize: '14px', color: 'var(--accent)',
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className={`form-input ${error ? 'error' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                      autoComplete="email"
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px',
                  }}>
                    {loading ? (
                      <span className="spinner" style={{
                        width: '18px', height: '18px', border: '2px solid rgba(250,250,240,0.3)',
                        borderTopColor: 'var(--cream)', borderRadius: '50%',
                        animation: 'spin 0.6s linear infinite',
                      }} />
                    ) : (
                      <>Send reset link &rarr;</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Back to login */}
          {!sent && (
            <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink-muted)' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: 'var(--green)', fontWeight: 500, textDecoration: 'none' }}>
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}