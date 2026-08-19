"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  ArrowUpCircle,
  XCircle,
  AlertOctagon,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Alert, type AlertSeverity, type AlertStatus } from "@/lib/alert-data";
import { cn } from "@/lib/utils";

const severityConfig: Record<AlertSeverity, { color: string; bg: string }> = {
  critical: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
  high: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  low: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
};

const statusConfig: Record<AlertStatus, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-red-500" },
  acknowledged: { label: "Acknowledged", dot: "bg-amber-500" },
  resolved: { label: "Resolved", dot: "bg-emerald-500" },
  escalated: { label: "Escalated", dot: "bg-purple-500" },
};

interface AlertTableProps {
  alerts: Alert[];
  search: string;
  severityFilter: AlertSeverity | "all";
  statusFilter: AlertStatus | "all";
  onSearchChange: (value: string) => void;
  onSeverityFilterChange: (value: AlertSeverity | "all") => void;
  onStatusFilterChange: (value: AlertStatus | "all") => void;
  selectedRows: string[];
  onToggleRow: (alertId: string) => void;
  onToggleAll: (nextIds: string[]) => void;
  onSelectAlert: (alert: Alert) => void;
  onUpdateAlertStatus: (alertId: string, nextStatus: AlertStatus) => void;
  onOpenBroadcast: () => void;
  filteredAlerts: Alert[];
}

export default function AlertTable({
  alerts,
  search,
  severityFilter,
  statusFilter,
  onSearchChange,
  onSeverityFilterChange,
  onStatusFilterChange,
  selectedRows,
  onToggleRow,
  onToggleAll,
  onSelectAlert,
  onUpdateAlertStatus,
  onOpenBroadcast,
  filteredAlerts,
}: AlertTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.id.toLowerCase().includes(search.toLowerCase()) ||
        alert.touristName.toLowerCase().includes(search.toLowerCase()) ||
        alert.type.toLowerCase().includes(search.toLowerCase()) ||
        alert.location.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || alert.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, search, severityFilter, statusFilter]);

  const selectedSet = new Set(selectedRows);
  const allVisibleSelected = filtered.length > 0 && filtered.every((alert) => selectedSet.has(alert.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      onToggleAll(selectedRows.filter((id) => !filtered.some((alert) => alert.id === id)));
      return;
    }

    onToggleAll(Array.from(new Set([...selectedRows, ...filtered.map((alert) => alert.id)])));
  };

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search alerts, tourists, locations..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(event) => onSeverityFilterChange(event.target.value as AlertSeverity | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value as AlertStatus | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{selectedRows.length} selected</span>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => selectedRows.forEach((id) => onUpdateAlertStatus(id, "acknowledged"))}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acknowledge
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => selectedRows.forEach((id) => onUpdateAlertStatus(id, "resolved"))}
            >
              <XCircle className="h-3.5 w-3.5" />
              Resolve
            </Button>
            <Button variant="default" size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700" onClick={onOpenBroadcast}>
              Broadcast
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Alert ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Tourist</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Severity</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Location</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((alert) => {
              const sev = severityConfig[alert.severity];
              const stat = statusConfig[alert.status];
              const isSelected = selectedRows.includes(alert.id);
              const isMenuOpen = openMenuId === alert.id;

              return (
                <TableRow
                  key={alert.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectAlert(alert)}
                >
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleRow(alert.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>

                  <TableCell className="text-sm font-mono font-medium text-slate-900">{alert.id}</TableCell>

                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{alert.touristName}</p>
                      <p className="text-xs text-slate-500">{alert.touristId}</p>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-slate-700">{alert.type}</TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5 text-xs font-semibold capitalize", sev.bg, sev.color)}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", sev.color.replace("text-", "bg-"))} />
                      {alert.severity}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", stat.dot)} />
                      <span className="text-sm font-medium text-slate-700">{stat.label}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="max-w-[140px] truncate">{alert.location}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(alert.timestamp)}
                    </div>
                  </TableCell>

                  <TableCell onClick={(event) => event.stopPropagation()} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setOpenMenuId(isMenuOpen ? null : alert.id)}
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-12 z-20 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                        <button
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            onUpdateAlertStatus(alert.id, "acknowledged");
                            setOpenMenuId(null);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-amber-500" />
                          Acknowledge
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            onUpdateAlertStatus(alert.id, "escalated");
                            setOpenMenuId(null);
                          }}
                        >
                          <ArrowUpCircle className="h-4 w-4 text-purple-500" />
                          Escalate
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            onUpdateAlertStatus(alert.id, "resolved");
                            setOpenMenuId(null);
                          }}
                        >
                          <XCircle className="h-4 w-4 text-emerald-500" />
                          Resolve
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            onSelectAlert(alert);
                            setOpenMenuId(null);
                          }}
                        >
                          <AlertOctagon className="h-4 w-4 text-blue-500" />
                          View Details
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No alerts found</p>
          <p className="text-xs text-slate-500">Try adjusting your filters</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {alerts.length} alerts
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}