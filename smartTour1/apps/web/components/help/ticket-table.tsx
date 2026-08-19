"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Ticket as TicketIcon,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
  Hourglass,
  XCircle,
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
import { tickets, type Ticket, type TicketStatus, type TicketPriority, type TicketCategory } from "@/lib/help-data";

const statusConfig: Record<TicketStatus, { label: string; badge: string; icon: React.ElementType }> = {
  open: { label: "Open", badge: "bg-red-50 text-red-700 border-red-200", icon: TicketIcon },
  in_progress: { label: "In Progress", badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Loader2 },
  waiting: { label: "Waiting", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: Hourglass },
  resolved: { label: "Resolved", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  closed: { label: "Closed", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: XCircle },
};

const priorityConfig: Record<TicketPriority, { dot: string; label: string }> = {
  low: { dot: "bg-slate-400", label: "Low" },
  medium: { dot: "bg-blue-500", label: "Medium" },
  high: { dot: "bg-amber-500", label: "High" },
  urgent: { dot: "bg-red-500", label: "Urgent" },
};

const categoryLabels: Record<TicketCategory, string> = {
  technical: "Technical",
  account: "Account",
  billing: "Billing",
  feature_request: "Feature Request",
  bug: "Bug",
  training: "Training",
};

interface TicketTableProps {
  onSelectTicket: (ticket: Ticket) => void;
}

export default function TicketTable({ onSelectTicket }: TicketTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.createdBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting">Waiting</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
          <TicketIcon className="h-3.5 w-3.5" />
          New Ticket
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Ticket</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Category</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Created By</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Assigned</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ticket) => {
              const st = statusConfig[ticket.status];
              const pr = priorityConfig[ticket.priority];
              return (
                <TableRow
                  key={ticket.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    ticket.status === "open" || ticket.status === "in_progress"
                      ? "bg-blue-50/20 hover:bg-blue-50/40"
                      : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectTicket(ticket)}
                >
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{ticket.subject}</p>
                      <p className="text-xs text-slate-500">{ticket.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{categoryLabels[ticket.category]}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", pr.dot)} />
                      <span className="text-sm text-slate-700">{pr.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium", st.badge)}>
                      <st.icon className={cn("h-3 w-3", ticket.status === "in_progress" && "animate-spin")} />
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{ticket.createdBy}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{ticket.assignedTo || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(ticket.updatedAt)}
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
          <TicketIcon className="h-8 w-8 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-900">No tickets found</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {tickets.length} tickets
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";