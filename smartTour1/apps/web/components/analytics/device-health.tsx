"use client";

import { Watch, Wifi, Battery, AlertTriangle } from "lucide-react";
import { deviceMetrics, type DeviceMetric } from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

interface DeviceHealthProps {
  deviceMetrics?: DeviceMetric[];
}

export default function DeviceHealth({ deviceMetrics: dynamicDeviceMetrics = deviceMetrics }: DeviceHealthProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Device Health</h3>
          <p className="text-xs text-slate-500">Fleet status by model</p>
        </div>
      </div>

      <div className="space-y-4">
        {dynamicDeviceMetrics.map((device) => {
          const offline = device.count - device.online;
          return (
            <div key={device.model} className="rounded-lg border border-slate-50 p-4 transition-colors hover:bg-slate-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                    <Watch className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{device.model}</p>
                    <p className="text-xs text-slate-500">{device.count} devices deployed</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-900">{device.online}</span>
                    <span className="text-xs text-slate-500">online</span>
                  </div>
                  {offline > 0 && (
                    <p className="text-xs text-red-600">{offline} offline</p>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Avg Battery</span>
                    <span
                      className={cn(
                        "font-medium",
                        device.avgBattery < 30 ? "text-red-600" : "text-slate-900"
                      )}
                    >
                      {device.avgBattery}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", {
                        "bg-emerald-500": device.avgBattery > 50,
                        "bg-amber-500": device.avgBattery > 25 && device.avgBattery <= 50,
                        "bg-red-500": device.avgBattery <= 25,
                      })}
                      style={{ width: `${device.avgBattery}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Failure Rate</span>
                    <span
                      className={cn(
                        "font-medium",
                        device.failureRate > 3 ? "text-red-600" : "text-slate-900"
                      )}
                    >
                      {device.failureRate}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", {
                        "bg-emerald-500": device.failureRate < 2,
                        "bg-amber-500": device.failureRate >= 2 && device.failureRate <= 4,
                        "bg-red-500": device.failureRate > 4,
                      })}
                      style={{ width: `${Math.min(device.failureRate * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {dynamicDeviceMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <Watch className="h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No device data available</p>
        </div>
      )}
    </div>
  );
}