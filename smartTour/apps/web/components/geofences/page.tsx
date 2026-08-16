"use client";

import { useState } from "react";
import { Hexagon, Plus, Download, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import GeofenceStats from "@/components/geofences/geofence-stat";
import GeofenceMap from "@/components/geofences/geofence-map";
import GeofenceTable from "@/components/geofences/geofence-table";
import GeofenceDetail from "@/components/geofences/geofence-detail";
import { Geofence, geofences } from "@/lib/geofence-data";
import { cn } from "@/lib/utils";

export default function GeofencesPage() {
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);

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
                8 zones
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Define, monitor, and manage virtual safety boundaries across the park.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          <GeofenceStats />

          {/* Map + Table Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GeofenceMap
                selectedId={selectedGeofence?.id}
                onSelectGeofence={setSelectedGeofence}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm h-full">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">Zone Quick View</h3>
                <div className="space-y-3">
                  {[
                    { name: "Base Camp Perimeter", status: "Active", color: "#3b82f6", count: 34 },
                    { name: "Rocky Ridge Restricted", status: "Breached", color: "#ef4444", count: 0 },
                    { name: "Pine Trail Corridor", status: "Active", color: "#10b981", count: 18 },
                    { name: "River Side Camp", status: "Breached", color: "#f59e0b", count: 4 },
                    { name: "Lakeview Park Zone", color: "#06b6d4", count: 22 },
                  ].map((zone, i) => (
                    <button
                      key={i}
                      className="flex w-full items-center gap-3 rounded-lg border border-slate-50 p-3 text-left transition-colors hover:bg-slate-50"
                      onClick={() => {
                        const gf = geofences.find((g) => g.name === zone.name);
                        if (gf) setSelectedGeofence(gf);
                      }}
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{zone.name}</p>
                        <p className="text-xs text-slate-500">{zone.count} tourists</p>
                      </div>
                      {zone.status && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            zone.status === "Breached"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          )}
                        >
                          {zone.status}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <GeofenceTable onSelectGeofence={setSelectedGeofence} />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedGeofence && (
        <GeofenceDetail geofence={selectedGeofence} onClose={() => setSelectedGeofence(null)} />
      )}
    </div>
  );
}