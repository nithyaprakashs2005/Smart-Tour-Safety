import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import MetricsRow from "@/components/metrics-row";
import MapSection from "@/components/map-section";
import ActiveAlerts from "@/components/active-alerts";
import RecentActivity from "@/components/recent-activity";
import TouristTable from "@/components/tourist-table";
import SystemWeather from "@/components/system-weather";
import ActionBar from "@/components/action-bar";
import { ChevronRight } from "lucide-react";

const OPERATIONS_PANEL_HEIGHT = "h-[548px]";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <Sidebar />

      <main className="ml-64 flex-1 min-w-0">
        <Topbar />

        <div className="space-y-6 px-6 py-6 lg:px-8">
          <MetricsRow />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div
              className={`xl:col-span-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.02] ${OPERATIONS_PANEL_HEIGHT}`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-3.5">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    Live Operations Map
                  </h2>
                  <p className="text-xs text-slate-500">
                    GPS tracking, geofences, and incident positions
                  </p>
                </div>
                <Link
                  href="/live-map"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Full screen
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="relative min-h-0 flex-1">
                <MapSection embedded className="absolute inset-0 h-full w-full" />
              </div>
            </div>

            <div className={`xl:col-span-4 ${OPERATIONS_PANEL_HEIGHT}`}>
              <ActiveAlerts className="h-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <RecentActivity />
            </div>
            <div className="lg:col-span-5">
              <TouristTable compact />
            </div>
            <div className="lg:col-span-3">
              <SystemWeather />
            </div>
          </div>

          <ActionBar />
        </div>
      </main>
    </div>
  );
}
