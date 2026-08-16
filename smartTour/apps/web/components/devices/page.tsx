"use client";

import { useState } from "react";
import DeviceStats from "@/components/devices/device-stats";
import DeviceTable from "@/components/devices/device-table";
import DeviceDetail from "@/components/devices/device-detail";
import Sidebar from "@/components/sidebar";
import type { Device } from "@/lib/device-data";

export default function DevicesPage() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Devices</h1>
        <p className="text-sm text-slate-500">
          Monitor connected safety devices, battery levels, and signal status across your fleet.
        </p>
      </div>

      <DeviceStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DeviceTable
            selectedDeviceId={selectedDevice?.id ?? null}
            onSelectDevice={setSelectedDevice}
          />
        </div>
        <div className="xl:col-span-1">
          <DeviceDetail device={selectedDevice} onClose={() => setSelectedDevice(null)} />
        </div>
      </div>
      </main>
    </div>
  );
}