"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Download, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/sidebar";
import AlertStats from "@/components/alerts/alert-stats";
import AlertTable from "@/components/alerts/alert-table";
import AlertDetail from "@/components/alerts/alert-detail";
import { type Alert, type AlertSeverity, type AlertStatus } from "@/lib/alert-data";
import { acknowledgeAlert, getDashboardData, resolveAlert } from "@/lib/smarttour-api";

export default function AlertsPage() {
  const [alertsData, setAlertsData] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    "Emergency update: Please proceed to the nearest checkpoint and monitor incoming alerts."
  );

  const loadAlerts = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const dashboard = await getDashboardData();
      setAlertsData(dashboard.alerts.map((alert) => ({
        id: alert.id,
        touristId: alert.tourist_id,
        touristName: dashboard.tourists.find((tourist) => tourist.id === alert.tourist_id)?.name ?? "Demo Tourist",
        type: alert.type as Alert["type"],
        severity: alert.severity,
        status: alert.status,
        description: alert.message,
        location: alert.location,
        coordinates: { lat: alert.latitude, lng: alert.longitude },
        timestamp: alert.timestamp,
        heartRate: alert.heart_rate,
        battery: alert.battery,
      })));
    } catch {
      setAlertsData([]);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    const interval = window.setInterval(loadAlerts, 5000);
    return () => window.clearInterval(interval);
  }, [loadAlerts]);

  const filteredAlerts = useMemo(() => {
    return alertsData.filter((alert) => {
      const matchesSearch =
        alert.id.toLowerCase().includes(search.toLowerCase()) ||
        alert.touristName.toLowerCase().includes(search.toLowerCase()) ||
        alert.type.toLowerCase().includes(search.toLowerCase()) ||
        alert.location.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alertsData, search, severityFilter, statusFilter]);

  const updateAlertStatus = async (alertId: string, nextStatus: AlertStatus) => {
    try {
      if (nextStatus === "resolved") await resolveAlert(alertId);
      else if (nextStatus === "acknowledged") await acknowledgeAlert(alertId);
      await loadAlerts();
    } catch {
      /* The UI continues to show the last Firebase-backed alert state. */
    }
  };

  const handleRefresh = () => loadAlerts();

  const exportRows = selectedRows.length > 0 ? alertsData.filter((alert) => selectedRows.includes(alert.id)) : filteredAlerts;

  const handleExport = () => {
    const rows = exportRows.length > 0 ? exportRows : filteredAlerts;
    const csv = [
      ["id", "touristName", "touristId", "type", "severity", "status", "location", "time"].join(","),
      ...rows.map((alert) =>
        [
          alert.id,
          `"${alert.touristName}"`,
          alert.touristId,
          `"${alert.type}"`,
          alert.severity,
          alert.status,
          `"${alert.location}"`,
          alert.timestamp,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedRows.length > 0 ? "selected-alerts" : "filtered-alerts"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBroadcastSend = () => {
    if (!broadcastMessage.trim()) return;

    setIsBroadcastOpen(false);
    setBroadcastMessage("Emergency update: Please proceed to the nearest checkpoint and monitor incoming alerts.");
    setSelectedRows([]);
  };

  const activeAlertCount = alertsData.filter((alert) => alert.status === "active").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Alerts</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-red-100 px-2.5 text-xs font-bold text-red-600">
                {activeAlertCount} active
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Monitor, triage, and resolve tourist safety alerts in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={() => setIsBroadcastOpen(true)}>
              <Bell className="h-3.5 w-3.5" />
              Broadcast Alert
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          <AlertStats alerts={alertsData} />

          <AlertTable
            alerts={alertsData}
            search={search}
            severityFilter={severityFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onSeverityFilterChange={setSeverityFilter}
            onStatusFilterChange={setStatusFilter}
            selectedRows={selectedRows}
            onToggleRow={(alertId) =>
              setSelectedRows((current) =>
                current.includes(alertId) ? current.filter((id) => id !== alertId) : [...current, alertId]
              )
            }
            onToggleAll={(nextIds) => setSelectedRows(nextIds)}
            onSelectAlert={setSelectedAlert}
            onUpdateAlertStatus={updateAlertStatus}
            onOpenBroadcast={() => setIsBroadcastOpen(true)}
            filteredAlerts={filteredAlerts}
          />
        </div>
      </main>

      {selectedAlert && (
        <AlertDetail alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}

      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Broadcast</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Emergency Alert</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsBroadcastOpen(false)}>
                ×
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Audience</label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {selectedRows.length > 0 ? `${selectedRows.length} selected alerts` : "All visible alerts"}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(event) => setBroadcastMessage(event.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setIsBroadcastOpen(false)}>
                Cancel
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleBroadcastSend}>
                <Send className="h-4 w-4" />
                Send Broadcast
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
