"use client";

import { useMemo } from "react";
import { Cpu, Wifi, WifiOff, Activity, Wrench, type LucideIcon } from "lucide-react";
import type { Device } from "@/lib/device-data";
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

interface DeviceStatsProps {
  devices: Device[];
}

export default function DeviceStats({ devices }: DeviceStatsProps) {
  const stats = useMemo(() => {
    const total = devices.length;
    const online = devices.filter((d) => d.status === "online").length;
    const offline = devices.filter((d) => d.status === "offline").length;
    const maintenance = devices.filter((d) => d.status === "maintenance").length;
    const telemetryReady = devices.filter((d) => d.heartRate !== null || d.spo2 !== null || d.bodyTemperature !== null).length;
    return { total, online, offline, maintenance, telemetryReady };
  }, [devices]);

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
        icon={Activity}
        label="Health Telemetry"
        value={String(stats.telemetryReady)}
        subLabel="Reporting vitals"
        iconBg="bg-cyan-50"
        iconColor="text-cyan-600"
      />
      <StatCard
        icon={Wrench}
        label="Maintenance"
        value={String(stats.maintenance)}
        subLabel="Service required"
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
      />
    </div>
  );
}