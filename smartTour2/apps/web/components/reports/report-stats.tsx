"use client";

import { FileText, Clock, Calendar, AlertTriangle, HardDrive, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { type Report, type ScheduledReport } from "@/lib/reports-data";
import { cn } from "@/lib/utils";

interface ReportStatsProps {
  reports: Report[];
  scheduledJobs: ScheduledReport[];
}

export default function ReportStats({ reports, scheduledJobs }: ReportStatsProps) {
  const totalGenerated = reports.length;
  const thisWeek = reports.filter(r => new Date(r.generatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const scheduledCount = scheduledJobs.filter(j => j.active).length;
  const failedCount = reports.filter(r => r.status === "failed").length;

  const statCards = [
    {
      label: "Total Dossiers",
      sublabel: "All time archive",
      value: totalGenerated,
      trend: "+12%",
      trendUp: true,
      icon: FileText,
      accent: "bg-blue-600",
      iconBg: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Generated This Week",
      sublabel: "Last 7 days",
      value: thisWeek,
      trend: "+4",
      trendUp: true,
      icon: Zap,
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      label: "Active Schedules",
      sublabel: "Automated jobs",
      value: scheduledCount,
      trend: "Stable",
      trendUp: true,
      icon: Calendar,
      accent: "bg-violet-500",
      iconBg: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
    {
      label: "Requires Triage",
      sublabel: "Failed generations",
      value: failedCount,
      trend: failedCount === 0 ? "Clear" : "Action needed",
      trendUp: failedCount === 0,
      icon: AlertTriangle,
      accent: "bg-red-500",
      iconBg: "bg-red-50 text-red-600",
      border: "border-red-100",
    },
    {
      label: "Avg Generation Time",
      sublabel: "Per dossier",
      value: "12s",
      trend: "-3s vs last wk",
      trendUp: true,
      icon: Clock,
      accent: "bg-amber-500",
      iconBg: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
    {
      label: "Archive Storage",
      sublabel: "Total report archive",
      value: "1.2 GB",
      trend: "3 days until review",
      trendUp: true,
      icon: HardDrive,
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-50 text-cyan-600",
      border: "border-cyan-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
            card.border
          )}
        >
          {/* Accent bar */}
          <div className={cn("absolute inset-x-0 top-0 h-0.5", card.accent)} />

          <div className="p-4">
            <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg", card.iconBg)}>
              <card.icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-xl font-bold tracking-tight text-slate-900">{card.value}</p>
            <p className="text-xs font-semibold text-slate-700">{card.label}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{card.sublabel}</p>
            <div className={cn(
              "mt-2 flex items-center gap-0.5 text-[10px] font-semibold",
              card.trendUp ? "text-emerald-600" : "text-red-500"
            )}>
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {card.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}