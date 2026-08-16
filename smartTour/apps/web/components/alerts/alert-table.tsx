"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  ArrowUpCircle,
  XCircle,
  Eye,
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
import { alerts, type Alert, type AlertSeverity, type AlertStatus } from "@/lib/alert-data";
import { cn } from "@/lib/utils";

const severityConfig: Record<
  AlertSeverity,
  { color: string; bg: string; icon: any }
> = {
  critical: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertOctagon },
  high: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: AlertTriangle },
  medium: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle },
  low: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Info },
};

const statusConfig: Record<AlertStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "bg-red-500", dot: "bg-red-500" },
  acknowledged: { label: "Acknowledged", color: "bg-amber-500", dot: "bg-amber-500" },
  resolved: { label: "Resolved", color: "bg-emerald-500", dot: "bg-emerald-500" },
  escalated: { label: "Escalated", color: "bg-purple-500", dot: "bg-purple-500" },
};

interface AlertTableProps {
  onSelectAlert: (alert: Alert) => void;
}

export default function AlertTable({ onSelectAlert }: AlertTableProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filtered = alerts.filter((alert) => {
    const matchesSearch =
      alert.id.toLowerCase().includes(search.toLowerCase()) ||
      alert.touristName.toLowerCase().includes(search.toLowerCase()) ||
      alert.type.toLowerCase().includes(search.toLowerCase()) ||
      alert.location.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((a) => a.id)));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search alerts, tourists, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | "all")}
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
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | "all")}
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

        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">{selectedRows.size} selected</span>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Acknowledge
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <XCircle className="h-3.5 w-3.5" />
              Resolve
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedRows.size === filtered.length}
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
              const isSelected = selectedRows.has(alert.id);

              return (
                <TableRow
                  key={alert.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectAlert(alert)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(alert.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell className="text-sm font-mono font-medium text-slate-900">
                    {alert.id}
                  </TableCell>
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
                      <span className="truncate max-w-[140px]">{alert.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(alert.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
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

      {/* Pagination */}
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