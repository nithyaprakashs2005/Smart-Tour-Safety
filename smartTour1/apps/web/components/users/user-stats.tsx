"use client";

import { Users, UserCheck, UserX, UserPlus, Lock, Shield, Radio } from "lucide-react";
import { userStats } from "@/lib/users-data";

const statCards = [
  {
    label: "Total Users",
    sublabel: "System accounts",
    value: userStats.total,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active",
    sublabel: "Currently enabled",
    value: userStats.active,
    icon: UserCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Inactive",
    sublabel: "Disabled accounts",
    value: userStats.inactive,
    icon: UserX,
    color: "bg-slate-100 text-slate-600",
  },
  {
    label: "Pending",
    sublabel: "Invite not accepted",
    value: userStats.pending,
    icon: UserPlus,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Locked",
    sublabel: "Security hold",
    value: userStats.locked,
    icon: Lock,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Online Now",
    sublabel: "Active sessions",
    value: userStats.onlineNow,
    icon: Radio,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function UserStats() {
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

import { cn } from "@/lib/utils";