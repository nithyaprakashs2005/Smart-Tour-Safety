"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, AlertTriangle, Siren, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardData, type DashboardData } from "@/lib/smarttour-api";

const defaultMetrics = {
  totalTourists: 0,
  safe: 0,
  warning: 0,
  emergency: 0,
  devicesOnline: 0,
  devicesActive: 0,
  devicesTotal: 0,
  activeAlerts: 0,
};

const cards = [
  {
    key: "totalTourists",
    label: "Total Tourists",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    sublabel: () => "Currently monitored",
  },
  {
    key: "safe",
    label: "Safe",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    sublabel: (metrics: typeof defaultMetrics) => 
      `${((metrics.safe / (metrics.totalTourists || 1)) * 100).toFixed(1)}% of total`,
  },
  {
    key: "warning",
    label: "Warning",
    icon: AlertTriangle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    sublabel: (metrics: typeof defaultMetrics) => 
      `${((metrics.warning / (metrics.totalTourists || 1)) * 100).toFixed(1)}% of total`,
  },
  {
    key: "emergency",
    label: "Emergency",
    icon: Siren,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    sublabel: (metrics: typeof defaultMetrics) => 
      `${((metrics.emergency / (metrics.totalTourists || 1)) * 100).toFixed(1)}% of total`,
  },
  {
    key: "devicesOnline",
    label: "Devices Online",
    icon: Wifi,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    format: (metrics: typeof defaultMetrics) => `${metrics.devicesOnline}%`,
    sublabel: (metrics: typeof defaultMetrics) => 
      `${metrics.devicesActive} / ${metrics.devicesTotal} active`,
  },
] as const;

export default function MetricsRow() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getDashboardData();
        if (active) setDashboard(data);
      } catch {
        if (active) setDashboard(null);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const metrics = dashboard?.metrics ?? defaultMetrics;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const value =
          "format" in card && card.format
            ? card.format(metrics)
            : metrics[card.key as keyof typeof metrics];
        const sublabel =
          "sublabel" in card && card.sublabel ? card.sublabel(metrics) : null;

        return (
          <div
            key={card.key}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                card.iconBg
              )}
            >
              <Icon className={cn("h-7 w-7", card.iconColor)} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                {value}
              </span>
              <span className="mt-1 text-[0.9rem] font-semibold text-slate-800">
                {card.label}
              </span>
              {sublabel && (
                <span className="mt-0.5 text-[0.7rem] font-medium text-slate-500">
                  {sublabel}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
