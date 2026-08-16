"use client";

import { Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import AnalyticsStats from "@/components/analytics/analytics-stats";
import AnalyticsCharts from "@/components/analytics/analytics-charts";
import LocationPerformance from "@/components/analytics/location-performance";
import TeamPerformance from "@/components/analytics/team-performance";
import DeviceHealth from "@/components/analytics/device-health";
import DailyMetricsTable from "@/components/analytics/daily-metrics-table";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Operational insights, trends, and performance metrics across all systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export Report
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Top Stats */}
          <AnalyticsStats />

          {/* Charts Grid */}
          <AnalyticsCharts />

          {/* Middle Section: Location + Team */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LocationPerformance />
            <TeamPerformance />
          </div>

          {/* Bottom Section: Device Health + Daily Table */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DeviceHealth />
            </div>
            <div className="lg:col-span-2">
              <DailyMetricsTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}