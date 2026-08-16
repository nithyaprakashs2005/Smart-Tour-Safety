"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { analyticsStats } from "@/lib/analytics-data";

const statCards = [
  {
    label: "Total Tourists",
    value: analyticsStats.totalTourists,
    trend: analyticsStats.touristTrend,
    trendUp: true,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Alerts",
    value: analyticsStats.activeAlerts,
    trend: analyticsStats.alertTrend,
    trendUp: false,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Avg Response",
    value: analyticsStats.avgResponseTime,
    trend: analyticsStats.responseTrend,
    trendUp: true,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Incidents Today",
    value: analyticsStats.incidentsToday,
    trend: analyticsStats.incidentTrend,
    trendUp: false,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "System Uptime",
    value: analyticsStats.systemUptime,
    trend: analyticsStats.uptimeTrend,
    trendUp: true,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Geofence Breaches",
    value: analyticsStats.geofenceBreaches,
    trend: analyticsStats.breachTrend,
    trendUp: false,
    color: "bg-orange-50 text-orange-600",
  },
  {
    label: "Devices Online",
    value: analyticsStats.devicesOnline,
    trend: analyticsStats.deviceTrend,
    trendUp: true,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function AnalyticsStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <p className="text-xs font-medium text-slate-500">{card.label}</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{card.value}</p>
          <div className="mt-2 flex items-center gap-1">
            {card.trendUp ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                card.trendUp ? "text-emerald-600" : "text-red-600"
              )}
            >
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";