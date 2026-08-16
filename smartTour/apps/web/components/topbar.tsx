"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio, Bell, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/smarttour-api";

export default function Topbar() {
  const [alertCount, setAlertCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const clock = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getDashboardData();
        if (!active) return;
        setAlertCount(data.metrics.activeAlerts);
        setEmergencyCount(data.metrics.emergency);
      } catch {
        if (!active) return;
        setAlertCount(0);
        setEmergencyCount(0);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const formattedDate = now
    ? now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "";
  const formattedTime = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Operations Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Live monitoring
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time safety intelligence across all active tourist groups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:flex">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>{emergencyCount === 0 ? "No active emergencies" : `${emergencyCount} emergency signal${emergencyCount > 1 ? "s" : ""}`}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <Radio className="h-3.5 w-3.5" />
            Emergency Broadcast
          </Button>

          <Link href="/alerts">
            <Button variant="outline" size="icon" className="relative h-9 w-9 shrink-0">
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 p-0 text-[10px] text-white">
                  {alertCount}
                </Badge>
              )}
            </Button>
          </Link>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white">
              AD
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-slate-900">{formattedDate}</p>
              <p className="text-[11px] text-slate-500">{formattedTime}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
