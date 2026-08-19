"use client";

import { useState } from "react";
import DeviceStats from "@/components/devices/device-stats";
import DeviceTable from "@/components/devices/device-table";
import DeviceDetail from "@/components/devices/device-detail";
import Sidebar from "@/components/sidebar";
import { devices as initialDevices, type Device } from "@/lib/device-data";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
    );
    if (selectedDevice?.id === updatedDevice.id) {
      setSelectedDevice(updatedDevice);
    }
  };

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

        <DeviceStats devices={devices} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DeviceTable
              devices={devices}
              selectedDeviceId={selectedDevice?.id ?? null}
              onSelectDevice={setSelectedDevice}
            />
          </div>
          <div className="xl:col-span-1">
            <DeviceDetail
              device={selectedDevice}
              onClose={() => setSelectedDevice(null)}
              onUpdateDevice={handleUpdateDevice}
            />
          </div>
        </div>
      </main>
    </div>
  );
}