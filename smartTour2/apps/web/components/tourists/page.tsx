"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Download, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import TouristStats from "@/components/tourists/tourist-stats";
import TouristTable from "@/components/tourists/tourist-table";
import TouristDetail from "@/components/tourists/tourist-detail";
import { getDashboardData, type DashboardData } from "@/lib/smarttour-api";
import type { Tourist, TouristStatus } from "@/lib/tourist-data";

const emptyStats = {
  total: 0,
  safe: 0,
  warning: 0,
  emergency: 0,
  offline: 0,
  activeToday: 0,
  newToday: 0,
};

function mapApiTouristToClient(record: DashboardData["tourists"][number]): Tourist {
  const status = (record.status ?? "safe") as TouristStatus;

  return {
    id: record.id,
    name: record.name,
    email: record.email ?? `${record.id.toLowerCase()}@tourguard.local`,
    phone: record.phone ?? "Unavailable",
    status,
    group: (record.group ?? "Solo") as Tourist["group"],
    heartRate: record.heart_rate ?? null,
    heartRateVariability: record.heart_rate_variability ?? null,
    spo2: record.spo2 ?? null,
    bodyTemperature: record.body_temperature ?? null,
    bloodPressure: record.blood_pressure ?? null,
    lastUpdate: record.last_updated ?? new Date().toISOString(),
    location: record.location ?? "Unknown location",
    coordinates: {
      lat: record.latitude ?? 0,
      lng: record.longitude ?? 0,
    },
    deviceId: record.wearable_id ?? record.id,
    deviceModel: "TourGuard Pro",
    checkInTime: record.last_updated ?? new Date().toISOString(),
    emergencyContact: {
      name: "Emergency Contact",
      phone: record.phone ?? "Unavailable",
      relation: "Guardian",
    },
    history: [
      {
        time: new Date(record.last_updated ?? Date.now()).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        event: "Latest status update",
        location: record.location ?? "Unknown location",
      },
    ],
  };
}

export default function TouristsPage() {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [isLoading, setIsLoading] = useState(true);

  const loadTourists = async () => {
    try {
      const data = await getDashboardData();
      const mappedTourists = data.tourists.map(mapApiTouristToClient);
      setTourists(mappedTourists);

      const total = data.metrics.totalTourists ?? mappedTourists.length;
      const safe = data.metrics.safe ?? 0;
      const warning = data.metrics.warning ?? 0;
      const emergency = data.metrics.emergency ?? 0;
      const offline = Math.max(0, total - safe - warning - emergency);

      setStats({
        total,
        safe,
        warning,
        emergency,
        offline,
        activeToday: Math.max(0, total - 3),
        newToday: Math.max(0, Math.round(total * 0.04)),
      });
    } catch {
      setTourists([]);
      setStats(emptyStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTourists();
    const interval = setInterval(loadTourists, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Tourists</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                {isLoading ? "Loading..." : `${stats.total} total`}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage registered tourists, monitor vitals, and track real-time locations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href="/live-map">
                <Map className="h-3.5 w-3.5" />
                View on Map
              </Link>
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-3.5 w-3.5" />
              Add Tourist
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          <TouristStats
            total={stats.total}
            safe={stats.safe}
            warning={stats.warning}
            emergency={stats.emergency}
            offline={stats.offline}
            activeToday={stats.activeToday}
            newToday={stats.newToday}
          />

          <TouristTable tourists={tourists} onSelectTourist={setSelectedTourist} />
        </div>
      </main>

      {selectedTourist && (
        <TouristDetail tourist={selectedTourist} onClose={() => setSelectedTourist(null)} />
      )}
    </div>
  );
}
