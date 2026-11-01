import React from 'react';
import { DiagramConfig } from '../../types/math';

interface Props {
  config: DiagramConfig;
}

export const AngleDiagram: React.FC<Props> = ({ config }) => {
  const { centralAngle = 100, inscribedAngle = 50, secondInscribedAngle, angleA, angleC, labels } = config.params;

  const width = 460;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const R = 95;

  const isCyclicQuad = config.type === 'cyclic_quad';

  if (isCyclicQuad) {
    // 4 points on circle for Cyclic Quadrilateral ABCD
    // Angle positions in radians
    const angRadA = -Math.PI / 2; // Top (A)
    const angRadB = 0.15; // Right-ish (B)
    const angRadC = Math.PI / 2; // Bottom (C)
    const angRadD = Math.PI + 0.3; // Left-ish (D)

    const ptA = { x: cx + R * Math.cos(angRadA), y: cy + R * Math.sin(angRadA) };
    const ptB = { x: cx + R * Math.cos(angRadB), y: cy + R * Math.sin(angRadB) };
    const ptC = { x: cx + R * Math.cos(angRadC), y: cy + R * Math.sin(angRadC) };
    const ptD = { x: cx + R * Math.cos(angRadD), y: cy + R * Math.sin(angRadD) };

    return (
      <div className="w-full flex flex-col items-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px] select-none">
          <defs>
            <radialGradient id="quadGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7861FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#07152B" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Main circle */}
          <circle cx={cx} cy={cy} r={R} fill="url(#quadGrad)" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r="3" fill="#00E5FF" />
          <text x={cx + 8} y={cy - 8} fill="rgba(242, 247, 255, 0.4)" fontSize="11">O</text>

          {/* Cyclic Quad Polygon */}
          <polygon
            points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptC.x},${ptC.y} ${ptD.x},${ptD.y}`}
            fill="rgba(120, 97, 255, 0.2)"
            stroke="#7861FF"
            strokeWidth="2.5"
          />

          {/* Vertices Dots */}
          {[
            { pt: ptA, name: labels?.A || `A (${angleA ? angleA + '°' : '2x+15°'})`, color: '#00E5FF', pos: { dx: 0, dy: -12 } },
            { pt: ptB, name: labels?.B || 'B', color: '#FFD34E', pos: { dx: 18, dy: 5 } },
            { pt: ptC, name: labels?.C || `C (${angleC ? angleC + '°' : '3x+5°'})`, color: '#00E5FF', pos: { dx: 0, dy: 22 } },
            { pt: ptD, name: labels?.D || 'D', color: '#FFD34E', pos: { dx: -18, dy: 5 } },
          ].map((item, idx) => (
            <g key={idx}>
              <circle cx={item.pt.x} cy={item.pt.y} r="5" fill={item.color} stroke="#050B1A" strokeWidth="2" />
              <text
                x={item.pt.x + item.pos.dx}
                y={item.pt.y + item.pos.dy}
                fill={item.color}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.name}
              </text>
            </g>
          ))}

          {/* Opposite Angles highlight note */}
          <rect x={width / 2 - 100} y={height - 28} width="200" height="22" rx="4" fill="#07152B" fillOpacity="0.9" stroke="rgba(0, 229, 255, 0.4)" />
          <text x={width / 2} y={height - 13} fill="#00E5FF" fontSize="11" fontWeight="bold" textAnchor="middle">
            ∠A + ∠C = 180° (Berhadapan)
          </text>
        </svg>
      </div>
    );
  }

  // Central & Inscribed Angles
  // A & B at bottom forming arc AB
  const angleHalf = (centralAngle * Math.PI) / 360;
  const angA = Math.PI / 2 + angleHalf;
  const angB = Math.PI / 2 - angleHalf;

  const ptA = { x: cx + R * Math.cos(angA), y: cy + R * Math.sin(angA) };
  const ptB = { x: cx + R * Math.cos(angB), y: cy + R * Math.sin(angB) };
  
  // Point C on top arc
  const angC = -Math.PI / 2 - 0.25;
  const ptC = { x: cx + R * Math.cos(angC), y: cy + R * Math.sin(angC) };

  // Point D (if present, e.g. for question 5)
  const angD = -Math.PI / 2 + 0.35;
  const ptD = { x: cx + R * Math.cos(angD), y: cy + R * Math.sin(angD) };

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px] select-none">
        <defs>
          <radialGradient id="angGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7861FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#07152B" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Outer Circle */}
        <circle cx={cx} cy={cy} r={R} fill="url(#angGrad)" stroke="#00E5FF" strokeWidth="2" />

        {/* Highlighted Arc AB */}
        <path
          d={`M ${ptA.x} ${ptA.y} A ${R} ${R} 0 0 0 ${ptB.x} ${ptB.y}`}
          fill="none"
          stroke="#FFD34E"
          strokeWidth="4"
        />

        {/* Center Radii OA and OB */}
        <line x1={cx} y1={cy} x2={ptA.x} y2={ptA.y} stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 2" />
        <line x1={cx} y1={cy} x2={ptB.x} y2={ptB.y} stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 2" />

        {/* Central Angle indicator arc */}
        <circle cx={cx} cy={cy} r="4" fill="#00E5FF" />
        <text x={cx} y={cy - 10} fill="#00E5FF" fontSize="12" fontWeight="bold" textAnchor="middle">
          {labels?.center || `O (${centralAngle}°)`}
        </text>

        {/* Inscribed Rays to C */}
        <line x1={ptC.x} y1={ptC.y} x2={ptA.x} y2={ptA.y} stroke="#7861FF" strokeWidth="2" />
        <line x1={ptC.x} y1={ptC.y} x2={ptB.x} y2={ptB.y} stroke="#7861FF" strokeWidth="2" />
        <circle cx={ptC.x} cy={ptC.y} r="5" fill="#7861FF" stroke="#050B1A" strokeWidth="2" />
        <text x={ptC.x - 12} y={ptC.y - 10} fill="#7861FF" fontSize="12" fontWeight="bold" textAnchor="middle">
          {labels?.inscribed || `C (${inscribedAngle}°)`}
        </text>

        {/* Second inscribed vertex D if applicable */}
        {secondInscribedAngle && (
          <g>
            <line x1={ptD.x} y1={ptD.y} x2={ptA.x} y2={ptA.y} stroke="#00FF9D" strokeWidth="2" strokeDasharray="4 3" />
            <line x1={ptD.x} y1={ptD.y} x2={ptB.x} y2={ptB.y} stroke="#00FF9D" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx={ptD.x} cy={ptD.y} r="5" fill="#00FF9D" stroke="#050B1A" strokeWidth="2" />
            <text x={ptD.x + 18} y={ptD.y - 10} fill="#00FF9D" fontSize="12" fontWeight="bold" textAnchor="middle">
              {labels?.secondInscribed || `D (${secondInscribedAngle}°)`}
            </text>
          </g>
        )}

        {/* Points A and B */}
        <circle cx={ptA.x} cy={ptA.y} r="5" fill="#FFD34E" stroke="#050B1A" strokeWidth="2" />
        <text x={ptA.x - 14} y={ptA.y + 16} fill="#FFD34E" fontSize="12" fontWeight="bold">A</text>

        <circle cx={ptB.x} cy={ptB.y} r="5" fill="#FFD34E" stroke="#050B1A" strokeWidth="2" />
        <text x={ptB.x + 10} y={ptB.y + 16} fill="#FFD34E" fontSize="12" fontWeight="bold">B</text>

        {/* Arc AB Label */}
        <text x={cx} y={cy + R + 24} fill="#FFD34E" fontSize="12" fontWeight="600" textAnchor="middle">
          {labels?.arc || 'Busur yang Dihadapi (AB)'}
        </text>
      </svg>
      <div className="flex items-center gap-4 text-xs text-neon-white/60 mt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-cyan inline-block"></span> Sudut Pusat (O)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-violet inline-block"></span> Sudut Keliling (C)</span>
        {secondInscribedAngle && <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-emerald inline-block"></span> Sudut Keliling (D)</span>}
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-gold inline-block"></span> Busur AB</span>
      </div>
    </div>
  );
};
