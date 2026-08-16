"use client";

import { useState } from "react";
import { Bell, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import AlertStats from "@/components/alerts/alert-stats";
import AlertTable from "@/components/alerts/alert-table";
import AlertDetail from "@/components/alerts/alert-detail";
import { Alert } from "@/lib/alert-data";

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Alerts</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-red-100 px-2.5 text-xs font-bold text-red-600">
                8 active
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Monitor, triage, and resolve tourist safety alerts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Bell className="h-3.5 w-3.5" />
              Broadcast Alert
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <AlertStats />

          {/* Table */}
          <AlertTable onSelectAlert={setSelectedAlert} />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedAlert && (
        <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}