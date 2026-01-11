'use client';

import { useState } from 'react';
import { 
  Scan, 
  Zap, 
  AlertTriangle, 
  Calculator, 
  Truck,
  HardHat,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AIAnalysisPanel({ imageUrl = "/api/placeholder/600/400" }: { imageUrl?: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | 'done'>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate complex CV processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult('done');
    }, 2500);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-xl">
        <div>
          <h3 className="flex items-center gap-2 font-bold text-lg">
            <Scan className="w-5 h-5 text-blue-400" /> 
            AI "Third Eye" Inspector
          </h3>
          <p className="text-xs text-slate-400">Automated Visual Damage Assessment & Costing</p>
        </div>
        {!result && (
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className={`
              ${isAnalyzing ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'} 
              text-white font-mono uppercase text-xs tracking-wider
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-spin" /> Processing Neural Net...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" /> Run Analysis
              </span>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. IMAGE SCANNER UI */}
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-900 group h-[400px]">
           {/* The Image (Placeholder) */}
           <div 
             className="absolute inset-0 bg-cover bg-center opacity-80"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800')` }} 
           ></div>
           
           {/* Overlay: Scanning Animation */}
           {isAnalyzing && (
             <div className="absolute inset-0 z-20">
               <div className="w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
               <div className="absolute top-4 left-4 font-mono text-xs text-blue-400 bg-black/50 px-2 py-1 rounded">
                 System: CV_YOLO_V8 <br/>
                 Processing Frames...
               </div>
               <style jsx>{`
                 @keyframes scan {
                   0% { top: 0%; }
                   50% { top: 100%; }
                   100% { top: 0%; }
                 }
               `}</style>
             </div>
           )}

           {/* Overlay: Bounding Boxes (Appears after analysis) */}
           {result === 'done' && (
             <>
               <div className="absolute top-[30%] left-[20%] w-[40%] h-[30%] border-2 border-red-500 bg-red-500/10 z-10 animate-in zoom-in duration-300">
                  <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Pothole (Severity: High)
                  </div>
                  <div className="absolute -bottom-6 right-0 text-white text-[10px] font-mono bg-black/70 px-1">
                    Dimensions: 1.2m x 0.8m
                  </div>
               </div>
               {/* Grid Overlay for 'Tech' feel */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
             </>
           )}
        </div>

        {/* 3. ANALYSIS RESULTS DASHBOARD */}
        {result === 'done' ? (
          <div className="space-y-4 animate-in slide-in-from-right-8 duration-500 delay-100">
            
            {/* Severity Card */}
            <Card className="p-4 bg-red-50 border-red-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase">Damage Severity</p>
                <h4 className="text-2xl font-black text-slate-900">CRITICAL (8.5/10)</h4>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-red-500 flex items-center justify-center bg-white">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </Card>

            {/* Estimated Budget (The "Anti-Corruption" Feature) */}
            <Card className="p-4 bg-emerald-50 border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-bold text-emerald-700 uppercase">AI Cost Estimation</p>
              </div>
              <div className="flex justify-between items-end border-b border-emerald-200 pb-3 mb-3">
                <span className="text-sm text-slate-600">Material Volume (Bitumen)</span>
                <span className="font-mono font-bold">~45 kg</span>
              </div>
              <div className="flex justify-between items-end border-b border-emerald-200 pb-3 mb-3">
                <span className="text-sm text-slate-600">Labor Man-hours</span>
                <span className="font-mono font-bold">12 hrs</span>
              </div>
              <div className="flex justify-between items-end pt-1">
                <span className="text-sm font-bold text-slate-700">Total Recommended Budget</span>
                <span className="text-2xl font-black text-emerald-700">₹8,450</span>
              </div>
            </Card>

            {/* Recommended Action */}
            <Card className="p-4 bg-blue-50 border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <HardHat className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-bold text-blue-700 uppercase">Resource Allocation</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-white border border-blue-200 rounded-lg text-xs font-medium flex items-center gap-1 text-slate-600">
                  <Truck className="w-3 h-3" /> 1x Road Roller
                </div>
                <div className="px-3 py-1 bg-white border-blue-200 rounded-lg text-xs font-medium flex items-center gap-1 text-slate-600">
                  <Users className="w-3 h-3" /> 2x Workers
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20">
                Auto-Generate Work Order
              </Button>
            </Card>

          </div>
        ) : (
          /* Empty State / Prompt */
          <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
            <Scan className="w-16 h-16 mb-4 opacity-20" />
            <h4 className="font-bold text-slate-600">Ready to Scan</h4>
            <p className="text-sm mt-2 max-w-xs">
              Click "Run Analysis" to let AI identify the issue, calculate dimensions, and generate a budget estimate automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}