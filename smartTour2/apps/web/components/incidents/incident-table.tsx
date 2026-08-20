"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  MoreHorizontal,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
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
import { type Incident, type IncidentSeverity, type IncidentStatus } from "@/lib/incident-data";
import { cn } from "@/lib/utils";

const severityConfig: Record<IncidentSeverity, { badge: string; dot: string }> = {
  critical: { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  high: { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  medium: { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  low: { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
};

const statusConfig: Record<IncidentStatus, { label: string; color: string; icon: string }> = {
  reported: { label: "Reported", color: "bg-slate-100 text-slate-700", icon: "●" },
  investigating: { label: "Investigating", color: "bg-amber-100 text-amber-700", icon: "●" },
  escalated: { label: "Escalated", color: "bg-purple-100 text-purple-700", icon: "●" },
  resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-700", icon: "✓" },
  closed: { label: "Closed", color: "bg-slate-100 text-slate-500", icon: "✓" },
};

function formatTimeString(isoString?: string) {
  if (!isoString) return "--";
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  if (match && match[1] && match[2]) {
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return isoString;
}

interface IncidentTableProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onOpenNewIncident?: () => void;
}

export default function IncidentTable({
  incidents,
  onSelectIncident,
  onOpenNewIncident,
}: IncidentTableProps) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = incidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(search.toLowerCase()) ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.location.toLowerCase().includes(search.toLowerCase()) ||
      inc.assignedTeam.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "all" || inc.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const isActive = (status: IncidentStatus) =>
    status === "reported" || status === "investigating" || status === "escalated";

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search incidents, teams, locations..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-72 sm:w-80 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value as IncidentSeverity | "all");
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setStatusFilter(e.target.value as IncidentStatus | "all");
                setCurrentPage(1);
              }}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="investigating">Investigating</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewIncident && (
            <Button
              size="sm"
              className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700"
              onClick={onOpenNewIncident}
            >
              <FileText className="h-3.5 w-3.5" />
              New Incident
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Incident ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Title</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Severity</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Location</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Team</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Reported</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Involved</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((incident) => {
              const sev = severityConfig[incident.severity];
              const stat = statusConfig[incident.status];

              return (
                <TableRow
                  key={incident.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    isActive(incident.status) ? "bg-amber-50/30 hover:bg-amber-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectIncident(incident)}
                >
                  <TableCell className="text-sm font-mono font-medium text-slate-900">
                    {incident.id}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-slate-900">{incident.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{incident.description.slice(0, 60)}...</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{incident.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5 text-xs font-semibold capitalize", sev.badge)}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", sev.dot)} />
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        stat.color
                      )}
                    >
                      <span>{stat.icon}</span>
                      {stat.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">{incident.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{incident.assignedTeam}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600" suppressHydrationWarning>
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatTimeString(incident.reportedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{incident.involvedTourists.length}</span>
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
          <p className="mt-4 text-sm font-medium text-slate-900">No incidents found</p>
          <p className="text-xs text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          {filtered.length > 0 ? (
            <>
              Showing <span className="font-medium">{(safePage - 1) * pageSize + 1}</span>–
              <span className="font-medium">{Math.min(safePage * pageSize, filtered.length)}</span> of{" "}
              <span className="font-medium">{filtered.length}</span> incidents
            </>
          ) : (
            "Showing 0 incidents"
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="h-8 text-xs gap-1"
          >
            <ChevronLeft className="h-3 w-3" />
            Previous
          </Button>
          <span className="text-xs text-slate-500 px-1">
            Page {safePage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="h-8 text-xs gap-1"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}