"use client";

import { useState, useEffect, useCallback } from "react";
import { Hexagon, Plus, Download, Layers, RefreshCw, AlertTriangle, MapPin, Users, ShieldCheck, Wrench, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import GeofenceStats from "@/components/geofences/geofence-stat";
import GeofenceMap from "@/components/geofences/geofence-map";
import GeofenceTable from "@/components/geofences/geofence-table";
import GeofenceDetail from "@/components/geofences/geofence-detail";
import { Geofence, geofences, geofenceStats, type GeofenceStatus } from "@/lib/geofence-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<GeofenceStatus, { label: string; badge: string; icon: any }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldCheck },
  inactive: { label: "Inactive", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: Power },
  maintenance: { label: "Maintenance", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: Wrench },
};

export default function GeofencesPage() {
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);
  const [dynamicGeofences, setDynamicGeofences] = useState<Geofence[]>(geofences);
  const [dynamicStats, setDynamicStats] = useState(geofenceStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Set initial date only on the client to avoid SSR/CSR hydration mismatch
  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  // Simulate real-time updates
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate dynamic tourist count changes
    const updatedGeofences = dynamicGeofences.map(gf => ({
      ...gf,
      touristCount: Math.max(0, gf.touristCount + Math.floor(Math.random() * 5) - 2),
      breachCount24h: gf.breachCount24h + (Math.random() > 0.9 ? 1 : 0),
    }));

    // Update stats
    const totalTourists = updatedGeofences.reduce((sum, gf) => sum + gf.touristCount, 0);
    const breachedCount = updatedGeofences.filter(gf => gf.breachCount24h > 0).length;
    const activeCount = updatedGeofences.filter(gf => gf.status === "active").length;

    setDynamicGeofences(updatedGeofences);
    setDynamicStats({
      ...dynamicStats,
      total: updatedGeofences.length,
      active: activeCount,
      breached24h: updatedGeofences.reduce((sum, gf) => sum + gf.breachCount24h, 0),
      touristsInside: totalTourists,
    });
    setLastUpdate(new Date());
    setIsRefreshing(false);
  }, [dynamicGeofences, dynamicStats]);

  useEffect(() => {
    const interval = setInterval(refreshData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  const getZoneStatus = (gf: Geofence) => {
    if (gf.breachCount24h > 0) return "Breached";
    return statusConfig[gf.status].label;
  };

  const isZoneBreached = (gf: Geofence) => gf.breachCount24h > 0;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Geofences</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                {dynamicStats.total} zones
              </span>
              <span className="relative flex h-2 w-2 ml-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Define, monitor, and manage virtual safety boundaries across the park.
              {lastUpdate && (
                <span className="ml-2 text-xs text-slate-400">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Layer Settings
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export KML
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5" />
              Create Geofence
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <GeofenceStats stats={dynamicStats} />

          {/* Map + Table Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GeofenceMap
                geofences={dynamicGeofences}
                selectedId={selectedGeofence?.id}
                onSelectGeofence={setSelectedGeofence}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900">Zone Quick View</h3>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Live
                  </Badge>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {dynamicGeofences.map((gf) => {
                    const status = getZoneStatus(gf);
                    const isBreached = isZoneBreached(gf);
                    const st = statusConfig[gf.status];
                    
                    return (
                      <button
                        key={gf.id}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                          selectedGeofence?.id === gf.id 
                            ? "border-blue-300 bg-blue-50" 
                            : "border-slate-50 hover:bg-slate-50"
                        )}
                        onClick={() => setSelectedGeofence(gf)}
                      >
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: gf.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{gf.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">{gf.touristCount} tourists</span>
                            {isBreached && (
                              <span className="flex items-center gap-1 text-xs text-red-600">
                                <AlertTriangle className="h-3 w-3" />
                                {gf.breachCount24h} breach{gf.breachCount24h > 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] flex-shrink-0",
                            isBreached
                              ? "bg-red-50 text-red-700 border-red-200"
                              : st.badge
                          )}
                        >
                          {isBreached ? (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              {status}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <st.icon className="h-2.5 w-2.5" />
                              {status}
                            </span>
                          )}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
                
                {/* Summary Footer */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <p className="text-lg font-bold text-emerald-700">{dynamicStats.active}</p>
                      <p className="text-[10px] text-emerald-600">Active</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-2">
                      <p className="text-lg font-bold text-red-700">{dynamicStats.breached24h}</p>
                      <p className="text-[10px] text-red-600">Breaches</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <GeofenceTable 
            geofences={dynamicGeofences} 
            onSelectGeofence={setSelectedGeofence} 
          />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedGeofence && (
        <GeofenceDetail geofence={selectedGeofence} onClose={() => setSelectedGeofence(null)} />
      )}
    </div>
  );
}