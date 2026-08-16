"use client";

import { Activity, Zap, Calendar, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { dailyMetrics, deviceMetrics } from "@/lib/analytics-data";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const incidentData = [
  { name: 'Medical', value: 12 },
  { name: 'Lost Person', value: 8 },
  { name: 'Equipment', value: 5 },
  { name: 'Wildlife', value: 3 },
  { name: 'Other', value: 2 },
];

const statusData = [
  { name: 'Active', value: 124 },
  { name: 'Idle', value: 3 },
  { name: 'Offline', value: 5 },
];

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Tourist Status Distribution */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Tourist Status Distribution</h3>
            <p className="text-xs text-slate-500">Current active monitoring</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <PieChartIcon className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 min-h-[250px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${(((percent ?? 0) * 100)).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Activity */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Alert Activity</h3>
            <p className="text-xs text-slate-500">Daily breakdown of alerts</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <Activity className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 min-h-[250px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="alerts" stroke="#ef4444" fillOpacity={1} fill="url(#colorAlerts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents by Type */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Incidents by Type</h3>
            <p className="text-xs text-slate-500">Last 30 days classification</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <BarChart3 className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 min-h-[250px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Device Battery Distribution */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Average Battery</h3>
            <p className="text-xs text-slate-500">By device model</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <Zap className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 min-h-[250px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deviceMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="model" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="avgBattery" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Tourist Activity */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-3 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Weekly Tourist Activity</h3>
            <p className="text-xs text-slate-500">7-day trend with new registrations</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">
            <Calendar className="h-4 w-4 text-slate-500" />
          </div>
        </div>
        <div className="flex-1 min-h-[300px] overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="tourists" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTourists)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}