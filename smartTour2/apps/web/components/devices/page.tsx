"use client";

import { useEffect, useState } from "react";
import DeviceStats from "@/components/devices/device-stats";
import DeviceTable from "@/components/devices/device-table";
import DeviceDetail from "@/components/devices/device-detail";
import Sidebar from "@/components/sidebar";
import type { Device } from "@/lib/device-data";
import { getDashboardData } from "@/lib/smarttour-api";

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleUpdateDevice = (updatedDevice: Device) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
    );
    if (selectedDevice?.id === updatedDevice.id) {
      setSelectedDevice(updatedDevice);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await getDashboardData();
        setDevices(dashboard.wearables.slice(0, 1).map((device) => {
          const tourist = dashboard.tourists.find((item) => item.id === device.tourist_id);
          return {
            id: device.id,
            deviceId: device.id,
            type: "gps-band",
            status: device.connected ? "online" : "offline",
            heartRate: device.heart_rate ?? tourist?.heart_rate ?? null,
            heartRateVariability: device.heart_rate_variability ?? tourist?.heart_rate_variability ?? null,
            spo2: device.spo2 ?? tourist?.spo2 ?? null,
            bodyTemperature: device.body_temperature ?? tourist?.body_temperature ?? null,
            bloodPressure: device.blood_pressure ?? tourist?.blood_pressure ?? null,
            signal: device.connected ? "strong" : "none",
            touristId: device.tourist_id,
            touristName: tourist?.name ?? null,
            location: tourist?.location ?? "Waiting for live location",
            lastSync: device.last_seen,
            firmwareVersion: "Live telemetry",
          };
        }));
      } catch {
        setDevices([]);
      }
    };
    load();
    const interval = window.setInterval(load, 5000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Devices</h1>
          <p className="text-sm text-slate-500">
            Monitor connected safety devices, live health telemetry, and signal status across your fleet.
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
