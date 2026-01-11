'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CloudRain, Thermometer, Zap, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function PredictiveMapLayer() {
  const [activeLayer, setActiveLayer] = useState<'none' | 'flood' | 'dengue' | 'traffic'>('none');

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      
      {/* 1. CONTROL PANEL (Top Right) */}
      <div className="absolute top-4 right-4 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-xl text-white shadow-2xl">
        <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 px-2">AI Prediction Layers</p>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveLayer(activeLayer === 'flood' ? 'none' : 'flood')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
              activeLayer === 'flood' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <CloudRain className="w-4 h-4" /> Flood Risk (48h)
          </button>
          
          <button 
            onClick={() => setActiveLayer(activeLayer === 'dengue' ? 'none' : 'dengue')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
              activeLayer === 'dengue' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Thermometer className="w-4 h-4" /> Dengue Outbreak
          </button>

          <button 
            onClick={() => setActiveLayer(activeLayer === 'traffic' ? 'none' : 'traffic')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
              activeLayer === 'traffic' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" /> Power Grid Load
          </button>
        </div>
      </div>

      {/* 2. VISUAL LAYERS (CSS Overlays) */}
      
      {/* LAYER: FLOOD RISK */}
      {activeLayer === 'flood' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Risk Zone 1 */}
          <div className="absolute top-[30%] left-[40%] w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-[35%] left-[42%] text-blue-900 font-bold text-xs bg-white/80 px-2 py-1 rounded shadow-sm border border-blue-200">
            ⚠️ 85% Risk: Waterlogging
          </div>
          
          {/* Risk Zone 2 */}
          <div className="absolute bottom-[20%] right-[30%] w-40 h-40 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
      )}

      {/* LAYER: DENGUE OUTBREAK */}
      {activeLayer === 'dengue' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          {/* Hotspot 1 */}
          <div className="absolute top-[20%] left-[20%] w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[25%] left-[25%]">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
          </div>
          <Card className="absolute top-[28%] left-[20%] p-2 bg-red-950/90 border-red-800 text-red-100 w-48 pointer-events-auto">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Vector Breeding Detected</p>
                <p className="text-[10px] opacity-80 mt-1">Stagnant water reported in 12 households.</p>
                <button className="mt-2 text-[10px] bg-red-600 hover:bg-red-500 px-2 py-1 rounded w-full">Dispatch Fogging Truck</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* LAYER: POWER GRID */}
      {activeLayer === 'traffic' && (
        <div className="absolute inset-0 animate-in fade-in duration-700">
          <svg className="absolute inset-0 w-full h-full opacity-60">
             <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#d97706" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
             <line x1="40%" y1="50%" x2="80%" y2="80%" stroke="#d97706" strokeWidth="4" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
             <circle cx="40%" cy="50%" r="4" fill="#d97706" className="animate-ping" />
          </svg>
          <div className="absolute top-[50%] left-[40%] text-amber-900 font-bold text-xs bg-amber-100/90 px-2 py-1 rounded shadow-sm border border-amber-200 translate-x-4">
            High Load: Sector 4
          </div>
        </div>
      )}

    </div>
  );
}