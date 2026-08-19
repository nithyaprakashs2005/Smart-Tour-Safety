"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { analyticsStats } from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

interface AnalyticsStatsProps {
  stats?: typeof analyticsStats;
  timeRange?: string;
}

export default function AnalyticsStats({ stats = analyticsStats, timeRange = "last_7_days" }: AnalyticsStatsProps) {
  const statCards = [
    {
      label: "Total Tourists",
      value: stats.totalTourists,
      trend: stats.touristTrend,
      trendUp: !stats.touristTrend.startsWith("-"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Alerts",
      value: stats.activeAlerts,
      trend: stats.alertTrend,
      trendUp: !stats.alertTrend.startsWith("-"),
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Avg Response",
      value: stats.avgResponseTime,
      trend: stats.responseTrend,
      trendUp: !stats.responseTrend.startsWith("-"),
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Incidents Today",
      value: stats.incidentsToday,
      trend: stats.incidentTrend,
      trendUp: !stats.incidentTrend.startsWith("-"),
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "System Uptime",
      value: stats.systemUptime,
      trend: stats.uptimeTrend,
      trendUp: !stats.uptimeTrend.startsWith("-"),
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Geofence Breaches",
      value: stats.geofenceBreaches,
      trend: stats.breachTrend,
      trendUp: !stats.breachTrend.startsWith("-"),
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Devices Online",
      value: stats.devicesOnline,
      trend: stats.deviceTrend,
      trendUp: !stats.deviceTrend.startsWith("-"),
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
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
            <span className="text-[10px] text-slate-400 ml-1">
              {timeRange === "today" ? "vs yesterday" : timeRange === "last_7_days" ? "vs prev 7 days" : "vs prev 30 days"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}