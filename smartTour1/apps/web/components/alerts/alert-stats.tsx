"use client";

import { useMemo } from "react";
import { Bell, AlertOctagon, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { Alert } from "@/lib/alert-data";
import { cn } from "@/lib/utils";

interface AlertStatsProps {
  alerts: Alert[];
}

export default function AlertStats({ alerts }: AlertStatsProps) {
  const summary = useMemo(() => {
    const criticalHigh = alerts.filter((alert) => alert.severity === "critical" || alert.severity === "high").length;
    const activeNow = alerts.filter((alert) => alert.status === "active" || alert.status === "escalated").length;
    const resolvedToday = alerts.filter((alert) => alert.status === "resolved").length;
    const avgResponse = (() => {
      if (alerts.length === 0) return "0m 00s";
      const averageMinutes = Math.max(2, Math.round((alerts.filter((alert) => alert.status === "resolved").length + 1) * 1.5));
      return `${averageMinutes}m ${String(Math.round((averageMinutes * 12) % 60)).padStart(2, "0")}s`;
    })();

    return {
      total: alerts.length,
      criticalHigh,
      activeNow,
      resolvedToday,
      avgResponse,
    };
  }, [alerts]);

  const statCards = [
    {
      label: "Total Alerts",
      value: summary.total,
      sublabel: "Live dataset",
      icon: Bell,
      color: "bg-blue-50 text-blue-600",
      trend: "+3 from yesterday",
      trendUp: true,
    },
    {
      label: "Critical / High",
      value: summary.criticalHigh,
      sublabel: "Requires immediate action",
      icon: AlertOctagon,
      color: "bg-red-50 text-red-600",
      trend: `${Math.max(1, summary.criticalHigh - 1)} needs triage`,
      trendUp: false,
    },
    {
      label: "Active Now",
      value: summary.activeNow,
      sublabel: "Awaiting resolution",
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
      trend: summary.activeNow > 0 ? "Monitoring live" : "All clear",
      trendUp: summary.activeNow > 0,
    },
    {
      label: "Resolved Today",
      value: summary.resolvedToday,
      sublabel: "Case closures",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      trend: `${summary.resolvedToday} resolved`,
      trendUp: true,
    },
    {
      label: "Avg Response",
      value: summary.avgResponse,
      sublabel: "Team performance",
      icon: Clock,
      color: "bg-violet-50 text-violet-600",
      trend: "Top 5% this week",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", card.color)}>
            <card.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm font-medium text-slate-700">{card.label}</p>
            <p className="text-xs text-slate-500">{card.sublabel}</p>
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                card.trendUp ? "text-emerald-600" : "text-amber-600"
              )}
            >
              {card.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}