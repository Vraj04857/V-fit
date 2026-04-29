import React, { useState } from 'react';

/* ═══════════════════════════════════════════
  MUSCLE REGION SVG PATHS
  Front view and back view definitions
   ═══════════════════════════════════════════ */

const FRONT_REGIONS = {
  shoulders: {
    label: 'Shoulders',
    paths: [
      'M108,108 Q96,112 90,128 L92,140 Q100,136 110,126 Q116,120 118,112 Z',
      'M192,108 Q204,112 210,128 L208,140 Q200,136 190,126 Q184,120 182,112 Z',
    ],
  },
  chest: {
    label: 'Chest',
    paths: [
      'M118,114 Q150,108 182,114 L188,140 Q150,150 112,140 Z',
    ],
  },
  biceps: {
    label: 'Biceps',
    paths: [
      'M88,142 L96,138 L100,170 L90,172 Z',
      'M204,138 L212,142 L210,172 L200,170 Z',
    ],
  },
  abs: {
    label: 'Core',
    paths: [
      'M122,142 Q150,150 178,142 L176,210 Q150,216 124,210 Z',
    ],
  },
  quads: {
    label: 'Quads',
    paths: [
      'M122,218 L148,218 L144,300 L120,296 Z',
      'M152,218 L178,218 L180,296 L156,300 Z',
    ],
  },
  calves: {
    label: 'Calves',
    paths: [
      'M122,308 L142,308 L140,370 L124,370 Z',
      'M158,308 L178,308 L176,370 L160,370 Z',
    ],
  },
};

const BACK_REGIONS = {
  traps: {
    label: 'Traps',
    paths: [
      'M130,96 Q150,88 170,96 L168,114 Q150,106 132,114 Z',
    ],
  },
  shoulders: {
    label: 'Rear Delts',
    paths: [
      'M108,108 Q96,112 90,128 L92,140 Q100,136 110,126 Q116,120 118,112 Z',
      'M192,108 Q204,112 210,128 L208,140 Q200,136 190,126 Q184,120 182,112 Z',
    ],
  },
  back: {
    label: 'Back',
    paths: [
      'M120,114 Q150,106 180,114 L184,176 Q150,184 116,176 Z',
    ],
  },
  triceps: {
    label: 'Triceps',
    paths: [
      'M88,142 L96,138 L100,170 L90,172 Z',
      'M204,138 L212,142 L210,172 L200,170 Z',
    ],
  },
  lowerback: {
    label: 'Lower Back',
    paths: [
      'M126,178 Q150,184 174,178 L172,210 Q150,216 128,210 Z',
    ],
  },
  glutes: {
    label: 'Glutes',
    paths: [
      'M120,214 L180,214 L182,250 Q150,260 118,250 Z',
    ],
  },
  hamstrings: {
    label: 'Hamstrings',
    paths: [
      'M120,254 L148,254 L144,326 L118,320 Z',
      'M152,254 L180,254 L182,320 L156,326 Z',
    ],
  },
  calves: {
    label: 'Calves',
    paths: [
      'M120,330 L142,330 L140,388 L124,388 Z',
      'M158,330 L178,330 L176,388 L160,388 Z',
    ],
  },
};

const MUSCLE_COLORS = {
  chest: '#4A8C3F',
  back: '#4A8C3F',
  shoulders: '#5C9E4E',
  biceps: '#6BAF60',
  triceps: '#6BAF60',
  abs: '#5C9E4E',
  quads: '#4A8C3F',
  hamstrings: '#4A8C3F',
  glutes: '#5C9E4E',
  calves: '#6BAF60',
  traps: '#5C9E4E',
  lowerback: '#7ABF6E',
};

const MUSCLE_LABELS = {
  chest: 'Chest', back: 'Back', shoulders: 'Shoulders', biceps: 'Biceps',
  triceps: 'Triceps', abs: 'Core', quads: 'Quads', hamstrings: 'Hamstrings',
  glutes: 'Glutes', calves: 'Calves', traps: 'Traps', lowerback: 'Lower Back',
};

function pathCenter(pathStr) {
  const nums = pathStr.match(/[\d.]+/g);
  if (!nums) return [150, 150];
  const coords = nums.map(Number);
  let sx = 0, sy = 0, c = 0;
  for (let i = 0; i < coords.length - 1; i += 2) {
    sx += coords[i]; sy += coords[i + 1]; c++;
  }
  return [Math.round(sx / c), Math.round(sy / c)];
}

/* ═══════════════════════════════════════════
   BODY MAP COMPONENT
   ═══════════════════════════════════════════ */
export default function BodyMap({ gender = 'Male', selectedMuscle, onMuscleSelect }) {
  const [view, setView] = useState('front');
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  const isFemale = gender?.toLowerCase() === 'female';
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS;
  const viewBoxH = view === 'front' ? 390 : 410;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
      {/* View toggle */}
      <div style={{
        display: 'inline-flex', borderRadius: '100px', overflow: 'hidden',
        border: '1px solid rgba(44,44,26,0.12)', background: 'rgba(250,250,240,0.6)',
        flexShrink: 0,
      }}>
        {['front', 'back'].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '4px 14px', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: view === v ? '600' : '400',
              fontFamily: 'var(--font-body)',
              background: view === v ? 'var(--green)' : 'transparent',
              color: view === v ? 'white' : 'var(--ink-muted)',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* SVG Body — width: 100% so it fills its 200px container */}
      <svg
        viewBox={`70 60 160 ${viewBoxH - 60}`}
        width="100%"
        style={{ display: 'block' }}
      >
        {/* Body outline silhouette */}
        <g opacity="0.08" stroke="var(--ink, #2C2C1A)" strokeWidth="1" fill="none">
          <ellipse cx="150" cy="78" rx={isFemale ? 18 : 20} ry={isFemale ? 22 : 24} />
          <line x1="150" y1={isFemale ? 100 : 102} x2="150" y2="108" />
          <path d={isFemale
            ? 'M118,108 Q150,105 182,108 L186,150 Q188,200 180,218 L120,218 Q112,200 114,150 Z'
            : 'M118,108 Q150,104 182,108 L190,142 Q188,200 178,218 L122,218 Q112,200 110,142 Z'
          } />
          <path d="M108,110 Q92,116 86,140 L84,180 Q82,195 86,210" />
          <path d="M192,110 Q208,116 214,140 L216,180 Q218,195 214,210" />
          <path d={view === 'front'
            ? 'M130,218 L126,300 Q124,330 126,370 L126,390'
            : 'M130,218 L126,320 Q124,350 126,388 L126,400'
          } />
          <path d={view === 'front'
            ? 'M170,218 L174,300 Q176,330 174,370 L174,390'
            : 'M170,218 L174,320 Q176,350 174,388 L174,400'
          } />
        </g>

        {/* Clickable muscle regions */}
        {Object.entries(regions).map(([key, region]) => {
          const isSelected = selectedMuscle === key;
          const isHovered = hoveredMuscle === key;
          const color = MUSCLE_COLORS[key] || '#4A8C3F';
          return (
            <g key={key + view}
              onClick={() => onMuscleSelect(key)}
              onMouseEnter={() => setHoveredMuscle(key)}
              onMouseLeave={() => setHoveredMuscle(null)}
              style={{ cursor: 'pointer' }}
            >
              {region.paths.map((p, i) => (
                <path key={i} d={p}
                  fill={color}
                  fillOpacity={isSelected ? 0.85 : isHovered ? 0.7 : 0.45}
                  stroke={isSelected ? color : isHovered ? color : 'transparent'}
                  strokeWidth={isSelected ? 2 : 1}
                  style={{ transition: 'all 0.2s ease' }}
                />
              ))}
              {(isSelected || isHovered) && (() => {
                const [cx, cy] = pathCenter(region.paths[0]);
                return (
                  <text x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="central"
                    fill={isSelected ? color : 'var(--ink, #2C2C1A)'}
                    fontSize="9" fontWeight="600"
                    fontFamily="var(--font-body, 'DM Sans', sans-serif)"
                    pointerEvents="none"
                  >
                    {region.label}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* Selected muscle indicator */}
      {selectedMuscle && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px', borderRadius: '100px',
          background: 'var(--green-pale, rgba(220,232,200,0.5))',
          fontSize: '11px', fontWeight: '500',
          color: 'var(--green, #4A6741)',
          animation: 'fadeIn 0.2s ease',
          flexShrink: 0,
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: MUSCLE_COLORS[selectedMuscle] || '#4A8C3F', flexShrink: 0,
          }} />
          {MUSCLE_LABELS[selectedMuscle] || selectedMuscle}
        </div>
      )}

      {!selectedMuscle && (
        <p style={{
          fontSize: '10px', color: 'var(--ink-light, #8C8C7A)',
          textAlign: 'center', margin: '0', lineHeight: '1.4',
        }}>
          Tap a muscle to see exercises
        </p>
      )}
    </div>
  );
}