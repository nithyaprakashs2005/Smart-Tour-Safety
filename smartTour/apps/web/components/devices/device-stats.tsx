"use client";

import { useMemo } from "react";
import { Cpu, Wifi, WifiOff, BatteryWarning, Wrench, type LucideIcon } from "lucide-react";
import { devices } from "@/lib/device-data";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subLabel: string;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, subLabel, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg, iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-semibold text-slate-900">{value}</div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-[11px] text-slate-400">{subLabel}</div>
      </div>
    </div>
  );
}

export default function DeviceStats() {
  const stats = useMemo(() => {
    const total = devices.length;
    const online = devices.filter((d) => d.status === "online").length;
    const offline = devices.filter((d) => d.status === "offline").length;
    const lowBattery = devices.filter((d) => d.status === "low-battery").length;
    const maintenance = devices.filter((d) => d.status === "maintenance").length;
    const avgBattery =
      total > 0 ? Math.round(devices.reduce((sum, d) => sum + d.battery, 0) / total) : 0;
    return { total, online, offline, lowBattery, maintenance, avgBattery };
  }, []);

  const onlinePct = stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={Cpu}
        label="Total Devices"
        value={String(stats.total)}
        subLabel="Registered in fleet"
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatCard
        icon={Wifi}
        label="Online"
        value={String(stats.online)}
        subLabel={`${onlinePct}% of total`}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        icon={WifiOff}
        label="Offline"
        value={String(stats.offline)}
        subLabel="Not reporting"
        iconBg="bg-slate-100"
        iconColor="text-slate-500"
      />
      <StatCard
        icon={BatteryWarning}
        label="Low Battery"
        value={String(stats.lowBattery)}
        subLabel="Below 20%"
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        icon={Wrench}
        label="Maintenance"
        value={String(stats.maintenance)}
        subLabel={`Avg battery ${stats.avgBattery}%`}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />
    </div>
  );
}