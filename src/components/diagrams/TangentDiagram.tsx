import React from 'react';
import { DiagramConfig } from '../../types/math';

interface Props {
  config: DiagramConfig;
}

export const TangentDiagram: React.FC<Props> = ({ config }) => {
  const { R = 10, r = 4, d = 10, showGSPL, showGSPD, labels } = config.params;

  // SVG dimensions & coordinate normalization
  const width = 500;
  const height = 280;
  const centerY = height / 2;

  // Scale down or up to fit within width (padding 60px on sides)
  const availableWidth = width - 120;
  // Visual distance scale: ensure d and radii are visually distinguishable
  const visualScale = Math.min(22, availableWidth / Math.max(d, R + r + 2));
  
  const visualR = Math.max(28, Math.min(65, R * visualScale * 0.8));
  const visualr = Math.max(18, Math.min(50, r * visualScale * 0.8));
  // Keep centers apart with adequate spacing for visualization
  const visualD = Math.max(visualR + visualr + 40, Math.min(availableWidth - visualR - visualr, d * visualScale));

  const cx1 = (width - visualD) / 2;
  const cx2 = cx1 + visualD;
  const cy1 = centerY;
  const cy2 = centerY;

  // Calculate tangent contact points
  // For GSPL: sin(alpha) = (R - r) / d
  const gsplAlpha = Math.asin(Math.max(-0.95, Math.min(0.95, (visualR - visualr) / visualD)));
  // Tangent on top side
  const t1x_gspl = cx1 + visualR * Math.sin(gsplAlpha);
  const t1y_gspl = cy1 - visualR * Math.cos(gsplAlpha);
  const t2x_gspl = cx2 + visualr * Math.sin(gsplAlpha);
  const t2y_gspl = cy2 - visualr * Math.cos(gsplAlpha);

  // For GSPD: sin(beta) = (R + r) / d
  const gspdRatio = Math.max(-0.95, Math.min(0.95, (visualR + visualr) / visualD));
  const gspdAlpha = Math.asin(gspdRatio);
  // Tangent crossing from top of circle 1 to bottom of circle 2
  const t1x_gspd = cx1 + visualR * Math.sin(gspdAlpha);
  const t1y_gspd = cy1 - visualR * Math.cos(gspdAlpha);
  const t2x_gspd = cx2 - visualr * Math.sin(gspdAlpha);
  const t2y_gspd = cy2 + visualr * Math.cos(gspdAlpha);

  return (
    <div className="w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[300px] select-none"
        aria-label={config.title || 'Diagram Garis Singgung'}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="circleGrad1" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#07152B" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="circleGrad2" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7861FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#07152B" stopOpacity="0.8" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid */}
        <line x1="20" y1={centerY} x2={width - 20} y2={centerY} stroke="rgba(242, 247, 255, 0.1)" strokeDasharray="4 4" />

        {/* Distance Line between centers */}
        <line
          x1={cx1}
          y1={cy1}
          x2={cx2}
          y2={cy2}
          stroke="#FFD34E"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        {/* Distance label */}
        <rect x={(cx1 + cx2) / 2 - 40} y={centerY + 8} width="80" height="20" rx="4" fill="#07152B" fillOpacity="0.85" stroke="rgba(255, 211, 78, 0.4)" />
        <text
          x={(cx1 + cx2) / 2}
          y={centerY + 22}
          fill="#FFD34E"
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
          className="font-rajdhani"
        >
          {labels?.distance || `d = ${d} cm`}
        </text>

        {/* Circle 1 (Big) */}
        <circle
          cx={cx1}
          cy={cy1}
          r={visualR}
          fill="url(#circleGrad1)"
          stroke="#00E5FF"
          strokeWidth="2"
          filter="url(#neonGlow)"
        />
        {/* Center 1 Dot */}
        <circle cx={cx1} cy={cy1} r="4" fill="#00E5FF" />
        <text x={cx1} y={cy1 - visualR - 10} fill="#00E5FF" fontSize="13" fontWeight="bold" textAnchor="middle">
          {labels?.center1 || `P (R = ${R} cm)`}
        </text>

        {/* Circle 2 (Small) */}
        <circle
          cx={cx2}
          cy={cy2}
          r={visualr}
          fill="url(#circleGrad2)"
          stroke="#7861FF"
          strokeWidth="2"
          filter="url(#neonGlow)"
        />
        {/* Center 2 Dot */}
        <circle cx={cx2} cy={cy2} r="4" fill="#7861FF" />
        <text x={cx2} y={cy2 - visualr - 10} fill="#7861FF" fontSize="13" fontWeight="bold" textAnchor="middle">
          {labels?.center2 || `Q (r = ${r} cm)`}
        </text>

        {/* GSPL Line & Radii */}
        {showGSPL !== false && (
          <g>
            {/* Radius to contact point 1 */}
            <line x1={cx1} y1={cy1} x2={t1x_gspl} y2={t1y_gspl} stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Radius to contact point 2 */}
            <line x1={cx2} y1={cy2} x2={t2x_gspl} y2={t2y_gspl} stroke="#7861FF" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Tangent line */}
            <line
              x1={t1x_gspl - 15}
              y1={t1y_gspl - (t2y_gspl - t1y_gspl) * (15 / visualD)}
              x2={t2x_gspl + 15}
              y2={t2y_gspl + (t2y_gspl - t1y_gspl) * (15 / visualD)}
              stroke="#00FF9D"
              strokeWidth="3"
              filter="url(#neonGlow)"
            />
            {/* Contact dots */}
            <circle cx={t1x_gspl} cy={t1y_gspl} r="4.5" fill="#00FF9D" stroke="#050B1A" strokeWidth="1.5" />
            <circle cx={t2x_gspl} cy={t2y_gspl} r="4.5" fill="#00FF9D" stroke="#050B1A" strokeWidth="1.5" />
            
            {/* GSPL Label */}
            <rect x={(t1x_gspl + t2x_gspl) / 2 - 50} y={(t1y_gspl + t2y_gspl) / 2 - 26} width="100" height="22" rx="4" fill="#07152B" fillOpacity="0.9" stroke="rgba(0, 255, 157, 0.5)" />
            <text
              x={(t1x_gspl + t2x_gspl) / 2}
              y={(t1y_gspl + t2y_gspl) / 2 - 11}
              fill="#00FF9D"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              className="font-rajdhani"
            >
              {labels?.tangent && !showGSPD ? labels.tangent : 'GSPL'}
            </text>
          </g>
        )}

        {/* GSPD Line & Radii */}
        {showGSPD && (
          <g>
            {/* Radius to contact point 1 */}
            <line x1={cx1} y1={cy1} x2={t1x_gspd} y2={t1y_gspd} stroke="#00E5FF" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Radius to contact point 2 */}
            <line x1={cx2} y1={cy2} x2={t2x_gspd} y2={t2y_gspd} stroke="#7861FF" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* GSPD Tangent line */}
            <line
              x1={t1x_gspd - 10}
              y1={t1y_gspd - (t2y_gspd - t1y_gspd) * (10 / visualD)}
              x2={t2x_gspd + 10}
              y2={t2y_gspd + (t2y_gspd - t1y_gspd) * (10 / visualD)}
              stroke="#FF3366"
              strokeWidth="3"
              filter="url(#neonGlow)"
            />
            {/* Contact dots */}
            <circle cx={t1x_gspd} cy={t1y_gspd} r="4.5" fill="#FF3366" stroke="#050B1A" strokeWidth="1.5" />
            <circle cx={t2x_gspd} cy={t2y_gspd} r="4.5" fill="#FF3366" stroke="#050B1A" strokeWidth="1.5" />

            {/* GSPD Label */}
            <rect x={(t1x_gspd + t2x_gspd) / 2 - 45} y={(t1y_gspd + t2y_gspd) / 2 - 12} width="90" height="22" rx="4" fill="#07152B" fillOpacity="0.9" stroke="rgba(255, 51, 102, 0.5)" />
            <text
              x={(t1x_gspd + t2x_gspd) / 2}
              y={(t1y_gspd + t2y_gspd) / 2 + 3}
              fill="#FF3366"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              className="font-rajdhani"
            >
              {labels?.tangent && showGSPD && !showGSPL ? labels.tangent : 'GSPD'}
            </text>
          </g>
        )}
      </svg>
      <div className="flex items-center gap-4 text-xs text-neon-white/60 mt-1">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neon-cyan inline-block"></span> Lingkaran P</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neon-violet inline-block"></span> Lingkaran Q</span>
        {showGSPL !== false && <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-emerald inline-block"></span> GSPL</span>}
        {showGSPD && <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-rose inline-block"></span> GSPD</span>}
      </div>
    </div>
  );
};
