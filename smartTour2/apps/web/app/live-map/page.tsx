"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Satellite, Radio, Shield, Map as MapIcon, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import MapSection from "@/components/map-section";
import { getDashboardData, type DashboardData } from "@/lib/smarttour-api";

const defaultMetrics = {
  totalTourists: 0,
  safe: 0,
  warning: 0,
  emergency: 0,
  activeAlerts: 0,
};

function LiveMapContent() {
  const searchParams = useSearchParams();
  const focusTouristId = searchParams.get("tourist");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const loadDashboard = async () => {
    setIsRefreshing(true);
    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch {
      setDashboard(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const metrics = dashboard?.metrics ?? defaultMetrics;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Live Map</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-emerald-100 px-2.5 text-xs font-bold text-emerald-600">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Real-time GPS tracking, emergency monitoring, and location intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={loadDashboard}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setShowLayerPanel((prev) => !prev)}
            >
              <Layers className="h-3.5 w-3.5" />
              Layer Settings
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/alerts">
                <Radio className="h-3.5 w-3.5" />
                Broadcast Alert
              </a>
            </Button>
          </div>
        </header>

        <div className="mx-8 mt-6 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{metrics.totalTourists}</p>
              <p className="text-xs font-medium text-slate-700">Active Beacons</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Satellite className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{metrics.emergency}</p>
              <p className="text-xs font-medium text-slate-700">Emergency</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{metrics.warning}</p>
              <p className="text-xs font-medium text-slate-700">Warnings</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{metrics.activeAlerts}</p>
              <p className="text-xs font-medium text-slate-700">Active Alerts</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <MapSection
              className="h-[calc(100vh-280px)] min-h-[600px] w-full rounded-none border-0"
              focusTouristId={focusTouristId}
              initialShowLayerPanel={showLayerPanel}
            />
          </div>
        </div>

        <div className="mx-8 mb-8 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Map Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <span className="text-xs text-slate-600">Safe Tourist</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-500 shadow">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <span className="text-xs text-slate-600">Warning Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center animate-pulse rounded-full border-2 border-white bg-rose-600 shadow">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              <span className="text-xs text-slate-600">Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-blue-500 bg-blue-500/20" />
              <span className="text-xs text-slate-600">Safe Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-rose-500 bg-rose-500/20" />
              <span className="text-xs text-slate-600">Restricted Area</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-amber-500 bg-amber-500/20" />
              <span className="text-xs text-slate-600">Hazard Zone</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LiveMapPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Loading map...</div>}>
      <LiveMapContent />
    </Suspense>
  );
}
