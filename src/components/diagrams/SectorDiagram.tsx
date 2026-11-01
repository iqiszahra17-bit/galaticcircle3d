import React from 'react';
import { DiagramConfig } from '../../types/math';

interface Props {
  config: DiagramConfig;
}

export const SectorDiagram: React.FC<Props> = ({ config }) => {
  const { radius = 14, centralAngle = 90, arcLength, sectorArea, labels } = config.params;

  const width = 460;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const visualR = 90;

  // Convert angle from degrees to radians, starting from -90 deg (top) or customized
  const startAngDeg = -90;
  const endAngDeg = startAngDeg + centralAngle;

  const startRad = (startAngDeg * Math.PI) / 180;
  const endRad = (endAngDeg * Math.PI) / 180;

  const x1 = cx + visualR * Math.cos(startRad);
  const y1 = cy + visualR * Math.sin(startRad);
  const x2 = cx + visualR * Math.cos(endRad);
  const y2 = cy + visualR * Math.sin(endRad);

  const largeArcFlag = centralAngle > 180 ? 1 : 0;

  // Sector path: Move to center -> line to arc start -> arc to end -> close back to center
  const sectorPath = `M ${cx} ${cy} L ${x1} ${y1} A ${visualR} ${visualR} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

  return (
    <div className="w-full flex flex-col items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px] select-none">
        <defs>
          <radialGradient id="sectorFillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD34E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#7861FF" stopOpacity="0.15" />
          </radialGradient>
          <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Full Circle Guide (Dashed) */}
        <circle
          cx={cx}
          cy={cy}
          r={visualR}
          fill="none"
          stroke="rgba(0, 229, 255, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Shaded Sector (Luas Juring) */}
        <path
          d={sectorPath}
          fill="url(#sectorFillGrad)"
          stroke="#FFD34E"
          strokeWidth="2"
        />

        {/* Highlighted Arc Curve (Panjang Busur) */}
        <path
          d={`M ${x1} ${y1} A ${visualR} ${visualR} 0 ${largeArcFlag} 1 ${x2} ${y2}`}
          fill="none"
          stroke="#00E5FF"
          strokeWidth="4"
          filter="url(#arcGlow)"
        />

        {/* Center Point */}
        <circle cx={cx} cy={cy} r="4.5" fill="#FFD34E" stroke="#050B1A" strokeWidth="1.5" />
        <text x={cx - 16} y={cy + 18} fill="#FFD34E" fontSize="12" fontWeight="bold">
          {labels?.center || 'O'}
        </text>

        {/* Angle Label & Arc in Center */}
        <text
          x={cx + (visualR * 0.4) * Math.cos(((startAngDeg + endAngDeg) / 2 * Math.PI) / 180)}
          y={cy + (visualR * 0.4) * Math.sin(((startAngDeg + endAngDeg) / 2 * Math.PI) / 180)}
          fill="#FFD34E"
          fontSize="13"
          fontWeight="bold"
          textAnchor="middle"
          className="font-rajdhani"
        >
          {labels?.angle || `θ = ${centralAngle}°`}
        </text>

        {/* Radius Labels */}
        <text
          x={(cx + x1) / 2 - 14}
          y={(cy + y1) / 2 - 4}
          fill="#F2F7FF"
          fontSize="11"
          fontWeight="500"
          transform={`rotate(${startAngDeg + 90}, ${(cx + x1) / 2}, ${(cy + y1) / 2})`}
        >
          {labels?.radius || `r = ${radius}`}
        </text>

        {/* Arc / Area Badge Labels */}
        <g transform={`translate(${width / 2}, 24)`}>
          <rect x="-110" y="-12" width="220" height="26" rx="6" fill="#07152B" fillOpacity="0.9" stroke="rgba(0, 229, 255, 0.4)" />
          <text x="0" y="5" fill="#00E5FF" fontSize="11" fontWeight="bold" textAnchor="middle">
            {labels?.arc ? labels.arc : `Panjang Busur (s)`} {labels?.area ? `• ${labels.area}` : ''}
          </text>
        </g>
      </svg>
      <div className="flex items-center gap-4 text-xs text-neon-white/60 mt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-cyan inline-block"></span> Panjang Busur (s)</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-neon-gold/50 border border-neon-gold inline-block"></span> Luas Juring (A)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1 bg-neon-gold inline-block"></span> Sudut Pusat (θ)</span>
      </div>
    </div>
  );
};
