"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  MapPin,
  Tag,
  Watch,
  RadioTower,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deviceTypeLabels, type Device, type DeviceStatus } from "@/lib/device-data";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { key: DeviceStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "offline", label: "Offline" },
  { key: "maintenance", label: "Maintenance" },
];

const TYPE_ICON: Record<Device["type"], LucideIcon> = {
  "gps-band": MapPin,
  "sos-tag": Tag,
  smartwatch: Watch,
  beacon: RadioTower,
};

const SIGNAL_ICON: Record<Device["signal"], LucideIcon> = {
  strong: SignalHigh,
  moderate: SignalMedium,
  weak: SignalLow,
  none: SignalZero,
};

const STATUS_STYLES: Record<DeviceStatus, string> = {
  online: "bg-emerald-50 text-emerald-700 border-emerald-200",
  offline: "bg-slate-100 text-slate-600 border-slate-200",
  maintenance: "bg-violet-50 text-violet-700 border-violet-200",
};

const STATUS_LABELS: Record<DeviceStatus, string> = {
  online: "Online",
  offline: "Offline",
  maintenance: "Maintenance",
};

function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

interface DeviceTableProps {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelectDevice: (device: Device) => void;
}

export default function DeviceTable({ devices, selectedDeviceId, onSelectDevice }: DeviceTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return devices.filter((d) => {
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      const matchesQuery =
        !q ||
        d.deviceId.toLowerCase().includes(q) ||
        (d.touristName && d.touristName.toLowerCase().includes(q)) ||
        (d.touristId && d.touristId.toLowerCase().includes(q)) ||
        d.location.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search device ID, tourist, location..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-50 p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                statusFilter === f.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>Assigned Tourist</TableHead>
            <TableHead>Health Metrics</TableHead>
            <TableHead>Signal</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-sm text-slate-500">
                No devices match your search.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((device) => {
              const TypeIcon = TYPE_ICON[device.type];
              const SignalIcon = SIGNAL_ICON[device.signal];
              const isSelected = device.id === selectedDeviceId;

              return (
                <TableRow
                  key={device.id}
                  onClick={() => onSelectDevice(device)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-slate-50",
                    isSelected && "bg-blue-50/70 hover:bg-blue-50"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{device.deviceId}</div>
                        <div className="text-xs text-slate-400">{deviceTypeLabels[device.type]}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {device.touristName ? (
                      <div>
                        <div className="text-sm text-slate-800">{device.touristName}</div>
                        <div className="text-xs text-slate-400">{device.touristId}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span>HR {device.heartRate ? `${device.heartRate} bpm` : "--"}</span>
                      <span>HRV {device.heartRateVariability ? `${device.heartRateVariability} ms` : "--"}</span>
                      <span>SpO2 {device.spo2 ? `${device.spo2}%` : "--"}</span>
                      <span>Temp {device.bodyTemperature ? `${device.bodyTemperature.toFixed(1)} °C` : "--"}</span>
                      <span>BP {device.bloodPressure ? `${device.bloodPressure.systolic}/${device.bloodPressure.diastolic}` : "--"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <SignalIcon className="h-3.5 w-3.5" />
                      <span className="capitalize">{device.signal}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{device.lastSync}</TableCell>
                  <TableCell className="text-sm text-slate-600">{device.location}</TableCell>
                  <TableCell>
                    <StatusBadge status={device.status} />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}