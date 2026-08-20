"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Battery, Heart, MapPin, Radio, RefreshCw, Route, ShieldCheck, Watch } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { getDashboardData, type DashboardData, type PersonalAnalytics } from "@/lib/smarttour-api";

function value(value: number | null | undefined, suffix = "") {
  return value === null || value === undefined ? "—" : `${value}${suffix}`;
}

function MetricCard({ icon: Icon, label, children }: { icon: typeof Heart; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div>
        <div><p className="text-xs font-medium text-slate-500">{label}</p><div className="mt-0.5 text-xl font-bold text-slate-900">{children}</div></div>
      </div>
    </div>
  );
}

function TrendTable({ title, unit, points, valueKey }: { title: string; unit: string; points: Array<Record<string, number | string>>; valueKey: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {points.length === 0 ? (
        <p className="mt-8 text-center text-sm text-slate-500">No live samples received yet.</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-left text-xs"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-3 py-2 font-medium">Received</th><th className="px-3 py-2 text-right font-medium">Value</th></tr></thead>
            <tbody>{points.slice(-10).reverse().map((point, index) => <tr key={`${point.time}-${index}`} className="border-t border-slate-100"><td className="px-3 py-2 text-slate-600">{String(point.time)}</td><td className="px-3 py-2 text-right font-semibold text-slate-900">{value(point[valueKey] as number, unit)}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setDashboard(await getDashboardData());
      setError(null);
    } catch {
      setError("Live analytics are unavailable. Check that the API and Firebase are running.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const analytics: PersonalAnalytics | null = dashboard?.analytics?.tourist_id ? dashboard.analytics : null;
  const tourist = dashboard?.tourists[0];
  const device = dashboard?.wearables?.[0];

  return (
    <div className="flex min-h-screen bg-slate-50"><Sidebar />
      <main className="ml-64 flex-1 p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-slate-900">Live Personal Analytics</h1><span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700"><Radio className="h-3 w-3" />Live</span></div><p className="mt-1 text-sm text-slate-500">Only telemetry received from the single demo tourist and device is shown.</p></div>
          <Button variant="outline" size="sm" onClick={refresh} disabled={isRefreshing} className="gap-1.5"><RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />Refresh</Button>
        </header>

        {error && <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{error}</div>}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Monitored tourist</p><h2 className="mt-1 text-lg font-bold text-slate-900">{tourist?.name ?? "Waiting for Firestore record"}</h2><p className="mt-1 text-sm text-slate-500">{tourist?.location ?? "No live location received"}</p></div><div className="text-right text-xs text-slate-500"><p>Device: <span className="font-semibold text-slate-700">{device?.id ?? "—"}</span></p><p className="mt-1">Last telemetry: <span className="font-semibold text-slate-700">{analytics?.last_updated ? new Date(analytics.last_updated).toLocaleTimeString() : "—"}</span></p></div></div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Heart} label="Heart rate">{value(analytics?.live_heart_rate, " BPM")}</MetricCard>
          <MetricCard icon={Battery} label="Device battery">{value(analytics?.live_battery, "%")}</MetricCard>
          <MetricCard icon={ShieldCheck} label="Risk score">{value(analytics?.live_risk_score)}</MetricCard>
          <MetricCard icon={MapPin} label="Live location">{tourist?.latitude === null || tourist?.latitude === undefined ? "Waiting" : "Received"}</MetricCard>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <MetricCard icon={Route} label="Distance recorded">{value(analytics?.distance_km, " km")}</MetricCard>
          <MetricCard icon={Activity} label="Steps recorded">{value(analytics?.steps_count)}</MetricCard>
          <MetricCard icon={Watch} label="Device status">{device?.connected ? "Online" : "Waiting"}</MetricCard>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <TrendTable title="Heart-rate samples" unit=" BPM" points={(analytics?.heart_rate_trend ?? []) as Array<Record<string, number | string>>} valueKey="bpm" />
          <TrendTable title="Battery samples" unit="%" points={(analytics?.battery_trend ?? []) as Array<Record<string, number | string>>} valueKey="battery" />
          <TrendTable title="Risk-score samples" unit="" points={(analytics?.risk_trend ?? []) as Array<Record<string, number | string>>} valueKey="score" />
        </div>
      </main>
    </div>
  );
}
