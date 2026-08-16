"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  Bell,
  Mail,
  Smartphone,
  Radio,
  AlertTriangle,
  MoreHorizontal,
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
import { messages, type Message, type MessageType, type MessageStatus, type Priority } from "@/lib/communication-data";

const typeConfig: Record<MessageType, { label: string; badge: string; icon: React.ElementType }> = {
  broadcast: { label: "Broadcast", badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Radio },
  direct: { label: "Direct", badge: "bg-slate-50 text-slate-700 border-slate-200", icon: Send },
  emergency: { label: "Emergency", badge: "bg-red-50 text-red-700 border-red-200", icon: AlertTriangle },
  group: { label: "Group", badge: "bg-violet-50 text-violet-700 border-violet-200", icon: MessageSquare },
  auto: { label: "Auto", badge: "bg-slate-50 text-slate-500 border-slate-200", icon: Clock },
};

const statusConfig: Record<MessageStatus, { label: string; color: string; icon: React.ElementType }> = {
  sent: { label: "Sent", color: "text-blue-600", icon: Send },
  delivered: { label: "Delivered", color: "text-emerald-600", icon: CheckCircle2 },
  read: { label: "Read", color: "text-emerald-600", icon: Eye },
  failed: { label: "Failed", color: "text-red-600", icon: XCircle },
  pending: { label: "Pending", color: "text-amber-600", icon: Clock },
};

const priorityConfig: Record<Priority, { dot: string }> = {
  low: { dot: "bg-slate-400" },
  normal: { dot: "bg-blue-500" },
  high: { dot: "bg-amber-500" },
  critical: { dot: "bg-red-500" },
};

const channelIcons: Record<string, React.ElementType> = {
  push: Bell,
  sms: Smartphone,
  email: Mail,
  "in-app": MessageSquare,
  all: Radio,
};

export default function MessageHistory() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MessageType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.sender.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as MessageType | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="broadcast">Broadcast</option>
              <option value="emergency">Emergency</option>
              <option value="direct">Direct</option>
              <option value="group">Group</option>
              <option value="auto">Auto</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MessageStatus | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Message</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Channel</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Recipients</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Sent</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((msg) => {
              const tp = typeConfig[msg.type];
              const st = statusConfig[msg.status];
              const pr = priorityConfig[msg.priority];
              const ChIcon = channelIcons[msg.channel] || Bell;
              return (
                <TableRow
                  key={msg.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    msg.type === "emergency" ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"
                  )}
                >
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{msg.subject}</p>
                        <span className={cn("h-1.5 w-1.5 rounded-full", pr.dot)} />
                      </div>
                      <p className="text-xs text-slate-500">
                        {msg.id} · {msg.sender}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium", tp.badge)}>
                      <tp.icon className="h-3 w-3" />
                      {tp.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs capitalize text-slate-600">{msg.priority}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <st.icon className={cn("h-3.5 w-3.5", st.color)} />
                      <span className={cn("text-sm font-medium", st.color)}>{st.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <ChIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="capitalize">{msg.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-700">{msg.recipientCount}</span>
                      {msg.readCount !== undefined && msg.status !== "failed" && (
                        <span className="text-xs text-slate-500">
                          ({msg.readCount} read)
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{formatTime(msg.sentAt)}</span>
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
          <p className="mt-4 text-sm font-medium text-slate-900">No messages found</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {messages.length} messages
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