import React from 'react';
import fitnessBg from '../assets/V.png';

export default function PageBackground({ children }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>

      {/* Background image - fixed, full screen */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${fitnessBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
      }} />

      {/* Blur + tint overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        background: 'rgba(240, 240, 216, 0.25)',
        zIndex: 1,
      }} />

      {/* Page content sits above */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}