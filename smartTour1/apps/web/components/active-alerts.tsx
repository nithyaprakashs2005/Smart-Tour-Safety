"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Siren, AlertTriangle, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { getAlerts, type AlertRecord } from "@/lib/smarttour-api";

const severityStyles = {
  critical: "bg-rose-100 text-rose-700 border-rose-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

const alertIcons = {
  FALL_DETECTED: Siren,
  SOS_ACTIVATED: Siren,
  HIGH_HEART_RATE: AlertTriangle,
};

function formatAlertType(type: string) {
  return type.replace(/_/g, " ");
}

interface ActiveAlertsProps {
  className?: string;
}

export default function ActiveAlerts({ className }: ActiveAlertsProps) {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getAlerts();
        if (active) setAlerts(data.filter((alert) => alert.status !== "resolved"));
      } catch {
        if (active) setAlerts([]);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardCard
      title="Active Alerts"
      description="Incidents requiring operator attention"
      className={cn("h-full overflow-hidden", className)}
      contentClassName="flex min-h-0 flex-1 flex-col p-0"
      action={
        <Link href="/alerts" className="text-xs font-medium text-blue-600 hover:text-blue-700">
          View all
        </Link>
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <AlertTriangle className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">All clear</p>
            <p className="mt-1 text-xs text-slate-500">No unresolved alerts at the moment</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {alerts.slice(0, 8).map((alert) => {
              const Icon = alertIcons[alert.type as keyof typeof alertIcons] || AlertTriangle;
              const isCritical = alert.severity === "critical" || alert.severity === "high";

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "rounded-xl border p-3 transition-colors",
                    isCritical
                      ? "border-rose-200 bg-rose-50/60"
                      : "border-slate-200 bg-slate-50/40",
                  )}
                >
                  <div className="grid grid-cols-[36px_1fr] gap-x-3 gap-y-1">
                    <div className="row-span-2 flex items-center justify-center self-center">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          isCritical ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold leading-tight text-slate-900">
                          {formatAlertType(alert.type)}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 px-2 py-0 text-[10px] font-semibold capitalize",
                            severityStyles[alert.severity],
                          )}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                        {alert.tourist_id}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs leading-snug text-slate-600">{alert.message}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                        <span className="flex min-w-0 items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{alert.location}</span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {new Date(alert.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-2.5">
        <Link
          href="/alerts"
          className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Open alert center
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </DashboardCard>
  );
}
