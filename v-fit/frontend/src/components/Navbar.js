import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = location.pathname === '/';

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(240, 240, 216, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(44,44,26,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>

      {/* Logo - pure text, no icon */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          color: 'var(--ink)',
          letterSpacing: '-0.03em',
          fontStyle: 'italic',
        }}>
          V – Fit
        </span>
      </Link>

      {/* Nav links (landing only) */}
      {isLanding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['Features', 'How it Works', 'About'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="btn btn-ghost"
              style={{ fontSize: '14px' }}
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/login" className="btn btn-ghost" style={{ fontSize: '14px' }}>
          Log in
        </Link>
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '14px' }}>
          Get started
        </Link>
      </div>
    </nav>
  );
}