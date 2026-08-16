"use client";

import { ClipboardList, AlertCircle, Search, CheckCircle2, ShieldAlert, Users, Clock } from "lucide-react";
import { incidentStats } from "@/lib/incident-data";
import { cn } from "@/lib/utils";

const statCards = [
  {
    label: "Total Incidents",
    sublabel: "All time",
    value: incidentStats.total,
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Open",
    sublabel: "Awaiting assignment",
    value: incidentStats.open,
    icon: AlertCircle,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Investigating",
    sublabel: "Active cases",
    value: incidentStats.investigating,
    icon: Search,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Resolved Today",
    sublabel: "Closed cases",
    value: incidentStats.resolvedToday,
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Critical",
    sublabel: "High priority",
    value: incidentStats.critical,
    icon: ShieldAlert,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "Teams Deployed",
    sublabel: "Active response",
    value: incidentStats.teamsDeployed,
    icon: Users,
    color: "bg-violet-50 text-violet-600",
  },
];

export default function IncidentStats() {
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