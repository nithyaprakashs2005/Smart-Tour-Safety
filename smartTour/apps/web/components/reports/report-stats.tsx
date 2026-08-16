"use client";

import { FileText, Clock, Calendar, AlertTriangle, HardDrive, Zap } from "lucide-react";
import { reportStats } from "@/lib/reports-data";

const statCards = [
  {
    label: "Total Generated",
    sublabel: "All time",
    value: reportStats.totalGenerated,
    icon: FileText,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "This Week",
    sublabel: "Last 7 days",
    value: reportStats.thisWeek,
    icon: Zap,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Scheduled",
    sublabel: "Active jobs",
    value: reportStats.scheduled,
    icon: Calendar,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Failed",
    sublabel: "Requires attention",
    value: reportStats.failed,
    icon: AlertTriangle,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Avg Gen Time",
    sublabel: "Per report",
    value: reportStats.avgGenTime,
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Storage Used",
    sublabel: "Report archive",
    value: reportStats.storageUsed,
    icon: HardDrive,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function ReportStats() {
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