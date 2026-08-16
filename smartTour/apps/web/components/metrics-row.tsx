"use client";

import { useEffect, useState } from "react";
import { Users, ShieldCheck, AlertTriangle, Siren, Wifi, Bell } from "lucide-react";
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
    label: "Monitored",
    icon: Users,
    accent: "from-blue-500/10 to-blue-500/0 border-blue-200/60",
    iconColor: "text-blue-600 bg-blue-50",
  },
  {
    key: "safe",
    label: "Safe",
    icon: ShieldCheck,
    accent: "from-emerald-500/10 to-emerald-500/0 border-emerald-200/60",
    iconColor: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "warning",
    label: "Warning",
    icon: AlertTriangle,
    accent: "from-amber-500/10 to-amber-500/0 border-amber-200/60",
    iconColor: "text-amber-600 bg-amber-50",
  },
  {
    key: "emergency",
    label: "Emergency",
    icon: Siren,
    accent: "from-rose-500/10 to-rose-500/0 border-rose-200/60",
    iconColor: "text-rose-600 bg-rose-50",
  },
  {
    key: "devicesOnline",
    label: "Devices Online",
    icon: Wifi,
    accent: "from-violet-500/10 to-violet-500/0 border-violet-200/60",
    iconColor: "text-violet-600 bg-violet-50",
    format: (metrics: typeof defaultMetrics) => `${metrics.devicesOnline}%`,
    sublabel: (metrics: typeof defaultMetrics) => `${metrics.devicesActive} of ${metrics.devicesTotal} active`,
  },
  {
    key: "activeAlerts",
    label: "Active Alerts",
    icon: Bell,
    accent: "from-orange-500/10 to-orange-500/0 border-orange-200/60",
    iconColor: "text-orange-600 bg-orange-50",
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
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
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-shadow hover:shadow-md",
              card.accent,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", card.iconColor)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
              <p className="mt-0.5 text-xs font-medium text-slate-600">{card.label}</p>
              {sublabel && <p className="mt-1 text-[10px] text-slate-500">{sublabel}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
