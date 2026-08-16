"use client";

import { Bell, AlertOctagon, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { alertStats } from "@/lib/alert-data";
import { cn } from "@/lib/utils";

const statCards = [
  {
    label: "Total Alerts",
    value: alertStats.total,
    sublabel: "Last 24 hours",
    icon: Bell,
    color: "bg-blue-50 text-blue-600",
    trend: "+3 from yesterday",
    trendUp: true,
  },
  {
    label: "Critical / High",
    value: alertStats.critical + alertStats.high,
    sublabel: "Requires immediate action",
    icon: AlertOctagon,
    color: "bg-red-50 text-red-600",
    trend: "2 unassigned",
    trendUp: false,
  },
  {
    label: "Active Now",
    value: alertStats.active,
    sublabel: "Awaiting resolution",
    icon: AlertTriangle,
    color: "bg-amber-50 text-amber-600",
    trend: "-2 from 1h ago",
    trendUp: false,
  },
  {
    label: "Resolved Today",
    value: alertStats.resolvedToday,
    sublabel: "Average response time",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
    trend: alertStats.avgResponseTime,
    trendUp: true,
  },
  {
    label: "Avg Response",
    value: alertStats.avgResponseTime,
    sublabel: "Team performance",
    icon: Clock,
    color: "bg-violet-50 text-violet-600",
    trend: "Top 5% this week",
    trendUp: true,
  },
];

export default function AlertStats() {
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