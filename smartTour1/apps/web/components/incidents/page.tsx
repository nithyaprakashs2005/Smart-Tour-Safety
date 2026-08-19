"use client";

import { useState } from "react";
import { AlertTriangle, FileText, Download, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import IncidentStats from "@/components/incidents/incident-stats";
import IncidentTable from "@/components/incidents/incident-table";
import IncidentDetail from "@/components/incidents/incident-detail";
import NewIncidentModal from "@/components/incidents/new-incident-modal";
import TeamStatusDrawer from "@/components/incidents/team-status-drawer";
import { incidents as initialIncidents, type Incident } from "@/lib/incident-data";

export default function IncidentsPage() {
  const [incidentsList, setIncidentsList] = useState<Incident[]>(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [isTeamStatusDrawerOpen, setIsTeamStatusDrawerOpen] = useState(false);

  const activeCount = incidentsList.filter(
    (i) => i.status === "reported" || i.status === "investigating" || i.status === "escalated"
  ).length;

  const handleCreateIncident = (newIncident: Incident) => {
    setIncidentsList((prev) => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
  };

  const handleUpdateIncident = (updated: Incident) => {
    setIncidentsList((prev) =>
      prev.map((inc) => (inc.id === updated.id ? updated : inc))
    );
    if (selectedIncident?.id === updated.id) {
      setSelectedIncident(updated);
    }
  };

  const handleExportReport = () => {
    const headers = [
      "Incident ID",
      "Title",
      "Type",
      "Severity",
      "Status",
      "Location",
      "Assigned Team",
      "Reported At",
      "Involved Tourists",
      "Description",
    ];

    const rows = incidentsList.map((inc) => [
      inc.id,
      `"${inc.title.replace(/"/g, '""')}"`,
      `"${inc.type}"`,
      inc.severity,
      inc.status,
      `"${inc.location.replace(/"/g, '""')}"`,
      `"${inc.assignedTeam}"`,
      inc.reportedAt,
      inc.involvedTourists.length,
      `"${inc.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tourguard-incidents-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                {activeCount} active
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Formal case management for safety incidents, investigations, and resolutions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleExportReport}
            >
              <Download className="h-3.5 w-3.5" />
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsTeamStatusDrawerOpen(true)}
            >
              <Shield className="h-3.5 w-3.5" />
              Team Status
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsNewIncidentModalOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Log Incident
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <IncidentStats incidents={incidentsList} />

          {/* Table */}
          <IncidentTable
            incidents={incidentsList}
            onSelectIncident={setSelectedIncident}
            onOpenNewIncident={() => setIsNewIncidentModalOpen(true)}
          />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdateIncident={handleUpdateIncident}
        />
      )}

      {/* New Incident Modal */}
      <NewIncidentModal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setIsNewIncidentModalOpen(false)}
        onCreateIncident={handleCreateIncident}
      />

      {/* Team Status Drawer */}
      <TeamStatusDrawer
        isOpen={isTeamStatusDrawerOpen}
        onClose={() => setIsTeamStatusDrawerOpen(false)}
        incidents={incidentsList}
        onSelectIncident={setSelectedIncident}
      />
    </div>
  );
}