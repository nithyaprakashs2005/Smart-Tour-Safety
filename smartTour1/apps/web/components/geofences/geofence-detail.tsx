"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  X,
  Hexagon,
  MapPin,
  Users,
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Power,
  Clock,
  Lock,
  Bell,
  FileText,
  UserCheck,
  Navigation,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Geofence, GeofenceStatus } from "@/lib/geofence-data";

const statusConfig: Record<GeofenceStatus, { label: string; badge: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", badge: "bg-slate-100 text-slate-600 border-slate-200" },
  maintenance: { label: "Maintenance", badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

interface GeofenceDetailProps {
  geofence: Geofence | null;
  onClose: () => void;
}

export default function GeofenceDetail({ geofence, onClose }: GeofenceDetailProps) {
  if (!geofence) return null;

  const st = statusConfig[geofence.status];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: geofence.color + "20" }}
              >
                <Hexagon className="h-5 w-5" style={{ color: geofence.color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{geofence.name}</h2>
                <p className="text-xs text-slate-500">{geofence.id}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className={cn("text-xs font-medium", st.badge)}>
              {st.label}
            </Badge>
            {geofence.autoLockdown && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
                <Lock className="mr-1 h-3 w-3" />
                Auto-Lockdown
              </Badge>
            )}
            {geofence.breachCount24h > 0 && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
                <AlertTriangle className="mr-1 h-3 w-3" />
                {geofence.breachCount24h} Breaches
              </Badge>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/live-map">
                <Navigation className="h-3.5 w-3.5" />
                View on Map
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Edit Zone
            </Button>
            {geofence.status === "active" ? (
              <Button variant="outline" size="sm" className="gap-1.5 text-amber-600 hover:bg-amber-50">
                <Power className="h-3.5 w-3.5" />
                Disable
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 hover:bg-emerald-50">
                <ShieldCheck className="h-3.5 w-3.5" />
                Activate
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{geofence.description}</p>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Zone Type</p>
              <p className="mt-1 text-sm font-medium capitalize text-slate-900">{geofence.type}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Area</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{geofence.areaKm2} km²</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Monitoring Rule</p>
              <p className="mt-1 text-sm font-medium capitalize text-slate-900">{geofence.rule}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Alert on Breach</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Bell className={cn("h-3.5 w-3.5", geofence.alertOnBreach ? "text-emerald-500" : "text-slate-400")} />
                <span className="text-sm font-medium text-slate-900">
                  {geofence.alertOnBreach ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
            {geofence.radius && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Radius</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{geofence.radius} m</p>
              </div>
            )}
            {geofence.maxCapacity && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Max Capacity</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{geofence.maxCapacity}</p>
              </div>
            )}
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{geofence.createdBy}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Created</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(geofence.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tourists Inside */}
          {geofence.touristCount > 0 && (
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tourists Inside
                </h3>
                <span className="text-xs font-medium text-slate-700">{geofence.touristCount} present</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {geofence.associatedGroups.map((group) => (
                  <Badge key={group} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    {group} Group
                  </Badge>
                ))}
              </div>
              <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-1 text-xs text-slate-400">Live occupancy map</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Coordinates */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Coordinates
            </h3>
            {geofence.type === "circle" && geofence.center ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Center Lat</span>
                  <span className="font-mono text-slate-900">{geofence.center.lat.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Center Lng</span>
                  <span className="font-mono text-slate-900">{geofence.center.lng.toFixed(5)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Radius</span>
                  <span className="font-mono text-slate-900">{geofence.radius} m</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {geofence.coordinates.slice(0, -1).map((coord, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-500">Vertex {i + 1}</span>
                    <span className="font-mono text-slate-900">
                      {coord[1]!.toFixed(5)}, {coord[0]!.toFixed(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Breaches */}
          {geofence.recentBreaches.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-red-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red-700">
                  Recent Breaches
                </h3>
              </div>
              <div className="space-y-2">
                {geofence.recentBreaches.map((breach) => (
                  <div
                    key={breach.id}
                    className="flex items-center justify-between rounded-lg border border-red-100 bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          breach.type === "exit" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}
                      >
                        {breach.type === "exit" ? <Navigation className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {breach.touristName} <span className="text-slate-500">({breach.touristId})</span>
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {breach.type} · {breach.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        {new Date(breach.timestamp).toLocaleTimeString()}
                      </p>
                      {breach.resolved ? (
                        <Badge variant="outline" className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-1 bg-red-50 text-red-700 border-red-200 text-[10px]">
                          <AlertTriangle className="mr-1 h-2.5 w-2.5" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 p-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">Total Breaches</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{geofence.totalBreaches}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Last 24h</p>
              <p className={cn("mt-1 text-lg font-bold", geofence.breachCount24h > 0 ? "text-red-600" : "text-slate-900")}>
                {geofence.breachCount24h}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Last Breached</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {geofence.lastBreached
                  ? new Date(geofence.lastBreached).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}