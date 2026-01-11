'use client';

import { useState } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Users, Clock, CheckCircle2,
  AlertTriangle, Calendar, Download, Filter, ArrowUpRight, ArrowDownRight,
  PieChart, Activity, Map, Zap, RefreshCw, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useZoneStore } from '@/lib/store';

// --- Mock Data ---
const KPIS = [
  { label: 'Total Grievances', value: '4,419', change: '+12.5%', trend: 'up', icon: FileText, color: 'blue' },
  { label: 'Resolution Rate', value: '91.2%', change: '+3.2%', trend: 'up', icon: CheckCircle2, color: 'green' },
  { label: 'Avg Turnaround', value: '4.2h', change: '-18%', trend: 'good', icon: Clock, color: 'orange' }, // 'good' because time went down
  { label: 'Citizen Engagement', value: '2.8k', change: '+8.7%', trend: 'up', icon: Users, color: 'purple' },
];

const WEEKLY_DATA = [
  { day: 'Mon', new: 145, resolved: 132 },
  { day: 'Tue', new: 178, resolved: 156 },
  { day: 'Wed', new: 203, resolved: 189 },
  { day: 'Thu', new: 167, resolved: 154 },
  { day: 'Fri', new: 189, resolved: 172 },
  { day: 'Sat', new: 112, resolved: 98 },
  { day: 'Sun', new: 89, resolved: 82 },
];

const CATEGORY_DATA = [
  { label: 'Sanitation', value: 35, color: '#3b82f6' }, // blue
  { label: 'Water', value: 25, color: '#06b6d4' },    // cyan
  { label: 'Roads', value: 20, color: '#f59e0b' },    // amber
  { label: 'Electricity', value: 15, color: '#eab308' }, // yellow
  { label: 'Others', value: 5, color: '#64748b' },    // slate
];

const ZONE_PERFORMANCE = [
  { zone: 'North Delhi', rate: 94, volume: 'High', status: 'Optimal' },
  { zone: 'South Delhi', rate: 87, volume: 'Critical', status: 'Lagging' },
  { zone: 'East Delhi', rate: 91, volume: 'Med', status: 'Stable' },
  { zone: 'West Delhi', rate: 89, volume: 'Med', status: 'Stable' },
  { zone: 'Central', rate: 98, volume: 'Low', status: 'Optimal' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const { selectedZone } = useZoneStore();

  return (
    <div className="flex flex-col space-y-6 max-w-[1600px] mx-auto p-2">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Performance Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time civic data intelligence engine</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
             <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-slate-900 shadow-sm">Overview</button>
             <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900">Demographics</button>
             <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900">Reports</button>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2 h-9">
            <Download className="w-3 h-3" /> Export
          </Button>
        </div>
      </div>

      {/* 2. KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
                    <span className={`text-xs font-medium flex items-center ${
                      kpi.trend === 'up' || kpi.trend === 'good' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' || kpi.trend === 'good' ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
              {/* Mini Sparkline Visualization */}
              <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-${kpi.color}-500`} style={{ width: `${Math.random() * 40 + 60}%` }}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Trends (Custom SVG Chart) */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Weekly Resolution Volume
              </CardTitle>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-[2px]"></div>Incoming</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-400 rounded-[2px]"></div>Resolved</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-end justify-between gap-2 px-2 pb-2">
              {WEEKLY_DATA.map((d, i) => {
                 const max = 220; // scale
                 const hNew = (d.new / max) * 100;
                 const hRes = (d.resolved / max) * 100;
                 return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                       <div className="relative w-full max-w-[40px] h-full flex items-end justify-center">
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                             {d.new} New / {d.resolved} Done
                          </div>
                          {/* Bars */}
                          <div className="w-[8px] md:w-[12px] bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600" style={{ height: `${hNew}%` }}></div>
                          <div className="w-[8px] md:w-[12px] bg-emerald-400 rounded-t-sm ml-1 transition-all duration-500 hover:bg-emerald-500" style={{ height: `${hRes}%` }}></div>
                       </div>
                       <span className="text-[10px] font-medium text-slate-400 uppercase">{d.day}</span>
                    </div>
                 );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Donut Chart (CSS Conic Gradient) */}
        <Card className="shadow-sm flex flex-col">
          <CardHeader>
             <CardTitle className="text-base font-bold flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" /> Issue Distribution
             </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
             <div className="relative w-48 h-48 rounded-full"
                  style={{
                     background: `conic-gradient(
                        ${CATEGORY_DATA[0].color} 0% 35%, 
                        ${CATEGORY_DATA[1].color} 35% 60%, 
                        ${CATEGORY_DATA[2].color} 60% 80%, 
                        ${CATEGORY_DATA[3].color} 80% 95%, 
                        ${CATEGORY_DATA[4].color} 95% 100%
                     )`
                  }}
             >
                <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                   <span className="text-3xl font-bold text-slate-800">4.4k</span>
                   <span className="text-[10px] text-slate-400 uppercase tracking-wide">Total</span>
                </div>
             </div>
             
             {/* Legend */}
             <div className="w-full grid grid-cols-2 gap-2 mt-6">
                {CATEGORY_DATA.map((c, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></div>
                      <span className="text-xs text-slate-600">{c.label} ({c.value}%)</span>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. BOTTOM SECTION: Insights & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Zone Performance Table */}
         <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                     <Map className="w-4 h-4 text-indigo-500" /> Zonal Performance Matrix
                  </CardTitle>
                  <Button variant="ghost" size="sm"><Filter className="w-3 h-3" /></Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                        <tr>
                           <th className="px-6 py-3">Zone Name</th>
                           <th className="px-6 py-3">Resolution Efficiency</th>
                           <th className="px-6 py-3">Load Volume</th>
                           <th className="px-6 py-3">AI Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {ZONE_PERFORMANCE.map((z, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-800">{z.zone}</td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="flex-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                       <div className={`h-full rounded-full ${z.rate > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${z.rate}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{z.rate}%</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                    z.volume === 'High' || z.volume === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                 }`}>
                                    {z.volume}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-1.5">
                                    <div className={`w-2 h-2 rounded-full ${z.status === 'Optimal' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                    <span className="text-xs text-slate-500">{z.status}</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </CardContent>
         </Card>

         {/* AI Insights Panel */}
         <Card className="bg-slate-900 text-white shadow-lg border-slate-800">
            <CardHeader>
               <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Sampark AI Insights
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-xs text-slate-400 mb-1 font-mono uppercase">Anomaly Detected</p>
                  <p className="text-sm font-medium">Unusual spike in <span className="text-blue-400">Water Supply</span> complaints in South Delhi (Sector 4) between 2 PM - 4 PM.</p>
               </div>
               
               <div className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-xs text-slate-400 mb-1 font-mono uppercase">Recommendation</p>
                  <p className="text-sm font-medium">Deploy 2 additional maintenance crews to <span className="text-emerald-400">West Zone</span> to reduce backlog.</p>
               </div>

               <div className="pt-4 border-t border-white/10">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none">
                     <RefreshCw className="w-4 h-4 mr-2" />
                     Regenerate Analysis
                  </Button>
               </div>
            </CardContent>
         </Card>

      </div>
    </div>
  );
}