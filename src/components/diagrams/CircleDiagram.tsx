import React from 'react';
import { DiagramConfig } from '../../types/math';
import { TangentDiagram } from './TangentDiagram';
import { AngleDiagram } from './AngleDiagram';
import { SectorDiagram } from './SectorDiagram';
import { Compass, Eye } from 'lucide-react';

interface Props {
  config: DiagramConfig;
  highlightedElement?: string;
}

export const CircleDiagram: React.FC<Props> = ({ config }) => {
  const renderDiagramContent = () => {
    switch (config.type) {
      case 'gspl':
      case 'gspd':
        return <TangentDiagram config={config} />;
      case 'central_inscribed':
      case 'cyclic_quad':
        return <AngleDiagram config={config} />;
      case 'arc_sector':
        return <SectorDiagram config={config} />;
      case 'orbit_complex':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-neon-gold mb-1 font-rajdhani">Lintasan Orbit Wahana (42 km)</span>
              <SectorDiagram config={{ ...config, type: 'arc_sector' }} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-neon-cyan mb-1 font-rajdhani">Stasiun Riset Biner (10 km & 6 km)</span>
              <TangentDiagram config={{ ...config, type: 'gspl' }} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full rounded-xl bg-space-blue/80 border border-space-border backdrop-blur-md p-4 flex flex-col items-center overflow-hidden shadow-card-glow group">
      {/* Sci-Fi HUD corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-cyan pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-cyan pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan pointer-events-none" />

      {/* Header bar */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2 text-neon-cyan font-rajdhani font-semibold tracking-wider">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>VISUALISASI GEOMETRI RADAR KOSMIK</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-space-deep/90 border border-neon-cyan/20 text-[10px] text-neon-white/70 flex items-center gap-1">
            <Eye className="w-3 h-3 text-neon-cyan" />
            Ilustrasi Vektor Dinamis
          </span>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="w-full flex items-center justify-center min-h-[220px]">
        {renderDiagramContent()}
      </div>

      {/* Footer scale disclaimer */}
      <div className="w-full flex justify-end mt-2 pt-1 border-t border-white/5">
        <span className="text-[10px] text-neon-white/40 italic">
          * Ilustrasi geometri interaktif terkalibrasi proporsional
        </span>
      </div>
    </div>
  );
};
