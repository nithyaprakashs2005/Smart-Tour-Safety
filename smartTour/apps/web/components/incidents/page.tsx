"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import IncidentStats from "@/components/incidents/incident-stats";
import IncidentTable from "@/components/incidents/incident-table";
import IncidentDetail from "@/components/incidents/incident-detail";
import { Incident } from "@/lib/incident-data";

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Incidents</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700">
                7 active
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Formal case management for safety incidents, investigations, and resolutions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Team Status
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <FileText className="h-3.5 w-3.5" />
              Log Incident
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <IncidentStats />

          {/* Table */}
          <IncidentTable onSelectIncident={setSelectedIncident} />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedIncident && (
        <IncidentDetail incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      )}
    </div>
  );
}