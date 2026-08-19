"use client";

import { Users, ShieldCheck, AlertTriangle, Siren, WifiOff, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TouristStatsProps {
  total: number;
  safe: number;
  warning: number;
  emergency: number;
  offline: number;
  activeToday: number;
  newToday: number;
}

export default function TouristStats({
  total,
  safe,
  warning,
  emergency,
  offline,
  activeToday,
  newToday,
}: TouristStatsProps) {
  const statCards = [
    {
      label: "Total Tourists",
      sublabel: "Currently registered",
      value: total,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Safe",
      sublabel: "All vitals normal",
      value: safe,
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Warning",
      sublabel: "Needs attention",
      value: warning,
      icon: AlertTriangle,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Emergency",
      sublabel: "Immediate action required",
      value: emergency,
      icon: Siren,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Offline",
      sublabel: "No signal / device off",
      value: offline,
      icon: WifiOff,
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "New Today",
      sublabel: "Fresh registrations",
      value: newToday,
      icon: UserPlus,
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