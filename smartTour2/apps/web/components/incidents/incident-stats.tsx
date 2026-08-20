"use client";

import { ClipboardList, AlertCircle, Search, CheckCircle2, ShieldAlert, Users } from "lucide-react";
import { type Incident } from "@/lib/incident-data";
import { cn } from "@/lib/utils";

interface IncidentStatsProps {
  incidents: Incident[];
}

export default function IncidentStats({ incidents }: IncidentStatsProps) {
  const total = incidents.length;
  const openCount = incidents.filter((i) => i.status === "reported").length;
  const investigatingCount = incidents.filter(
    (i) => i.status === "investigating" || i.status === "escalated"
  ).length;
  const resolvedCount = incidents.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  ).length;
  const criticalCount = incidents.filter((i) => i.severity === "critical").length;
  
  // Count unique teams deployed on active incidents
  const deployedTeamsSet = new Set(
    incidents
      .filter((i) => i.status === "reported" || i.status === "investigating" || i.status === "escalated")
      .map((i) => i.assignedTeam)
  );
  const teamsDeployedCount = deployedTeamsSet.size;

  const statCards = [
    {
      label: "Total Incidents",
      sublabel: "All recorded cases",
      value: total,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Open",
      sublabel: "Awaiting dispatch",
      value: openCount,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Investigating",
      sublabel: "Active cases in field",
      value: investigatingCount,
      icon: Search,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Resolved",
      sublabel: "Closed / Resolved cases",
      value: resolvedCount,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Critical",
      sublabel: "High priority emergencies",
      value: criticalCount,
      icon: ShieldAlert,
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Teams Deployed",
      sublabel: "Active response units",
      value: teamsDeployedCount,
      icon: Users,
      color: "bg-violet-50 text-violet-600",
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