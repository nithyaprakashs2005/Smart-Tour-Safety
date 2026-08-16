"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Loader2,
  XCircle,
  Calendar,
  User,
  FileSpreadsheet,
  File,
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
import { generatedReports, type Report, type ReportStatus, type ExportFormat } from "@/lib/reports-data";

const statusConfig: Record<ReportStatus, { label: string; badge: string; icon: React.ElementType }> = {
  ready: { label: "Ready", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  generating: { label: "Generating", badge: "bg-blue-50 text-blue-700 border-blue-200", icon: Loader2 },
  scheduled: { label: "Scheduled", badge: "bg-violet-50 text-violet-700 border-violet-200", icon: Calendar },
  failed: { label: "Failed", badge: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

const formatIcon: Record<ExportFormat, React.ElementType> = {
  pdf: FileText,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  kml: File,
};

interface ReportTableProps {
  onSelectReport: (report: Report) => void;
}

export default function ReportTable({ onSelectReport }: ReportTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");

  const filtered = generatedReports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.generatedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
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
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "all")}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="ready">Ready</option>
            <option value="generating">Generating</option>
            <option value="scheduled">Scheduled</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
          <FileText className="h-3.5 w-3.5" />
          Generate Report
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Report ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Title</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Format</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Generated</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">By</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Size</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((report) => {
              const st = statusConfig[report.status];
              const FmtIcon = formatIcon[report.format];
              return (
                <TableRow
                  key={report.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    report.status === "failed" ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectReport(report)}
                >
                  <TableCell className="text-sm font-mono font-medium text-slate-900">
                    {report.id}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{report.description.slice(0, 70)}...</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium", st.badge)}>
                      <st.icon className={cn("h-3 w-3", report.status === "generating" && "animate-spin")} />
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FmtIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm uppercase text-slate-700">{report.format}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(report.generatedAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {report.generatedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{report.fileSize}</span>
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
          <p className="mt-4 text-sm font-medium text-slate-900">No reports found</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {generatedReports.length} reports
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