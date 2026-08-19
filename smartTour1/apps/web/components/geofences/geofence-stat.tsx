"use client";

import { cn } from "@/lib/utils";

import { Hexagon, ShieldCheck, AlertTriangle, Wrench, Users, Map } from "lucide-react";
import { geofenceStats } from "@/lib/geofence-data";

interface GeofenceStatsProps {
  stats?: typeof geofenceStats;
}

export default function GeofenceStats({ stats = geofenceStats }: GeofenceStatsProps) {
  const statCards = [
    {
      label: "Total Zones",
      sublabel: "Defined geofences",
      value: stats.total,
      icon: Hexagon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active",
      sublabel: "Monitoring now",
      value: stats.active,
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Breached 24h",
      sublabel: "Boundary violations",
      value: stats.breached24h,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "In Maintenance",
      sublabel: "Temporarily offline",
      value: stats.maintenance,
      icon: Wrench,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Tourists Inside",
      sublabel: "Within safe zones",
      value: stats.touristsInside,
      icon: Users,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Coverage",
      sublabel: "Total area km²",
      value: stats.coverageKm2,
      icon: Map,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", card.color)}>
            <card.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs font-medium text-slate-700">{card.label}</p>
            <p className="text-[10px] text-slate-500">{card.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}