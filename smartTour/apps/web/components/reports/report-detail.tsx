"use client";

import {
  X,
  FileText,
  Download,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  RotateCcw,
  File,
  Layers,
  Mail,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Report, ReportStatus, ExportFormat } from "@/lib/reports-data";

const statusConfig: Record<ReportStatus, { label: string; badge: string }> = {
  ready: { label: "Ready", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  generating: { label: "Generating", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  scheduled: { label: "Scheduled", badge: "bg-violet-50 text-violet-700 border-violet-200" },
  failed: { label: "Failed", badge: "bg-red-50 text-red-700 border-red-200" },
};

const formatLabels: Record<ExportFormat, string> = {
  pdf: "PDF Document",
  csv: "CSV Spreadsheet",
  xlsx: "Excel Workbook",
  kml: "KML Geographic",
};

interface ReportDetailProps {
  report: Report | null;
  onClose: () => void;
}

export default function ReportDetail({ report, onClose }: ReportDetailProps) {
  if (!report) return null;

  const st = statusConfig[report.status];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("text-xs font-medium", st.badge)}>
              {st.label}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900">{report.title}</h2>
          <p className="text-sm text-slate-500">{report.id}</p>

          <div className="mt-4 flex gap-2">
            {report.status === "ready" && (
              <>
                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </Button>
              </>
            )}
            {report.status === "failed" && (
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Generation
              </Button>
            )}
            {report.status === "generating" && (
              <Button size="sm" disabled className="gap-1.5">
                <Clock className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{report.description}</p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Report Type</p>
              <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                {report.type.replace(/_/g, " ")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Format</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{formatLabels[report.format]}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Cover Period</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{report.coverDate}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">File Size</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{report.fileSize}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Generated At</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Generated By</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{report.generatedBy}</p>
            </div>
            {report.pages && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Pages</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{report.pages}</p>
              </div>
            )}
            {report.records && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Records</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{report.records}</p>
              </div>
            )}
          </div>

          {/* Sections */}
          {report.sections.length > 0 && (
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Report Sections
                </h3>
              </div>
              <div className="space-y-2">
                {report.sections.map((section, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-slate-50 bg-slate-50/50 p-3"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{section}</span>
                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Placeholder */}
          {report.status === "ready" && (
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Preview
              </h3>
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">Report Preview</p>
                    <p className="text-xs text-slate-400">{report.pages || "--"} pages</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Failure Notice */}
          {report.status === "failed" && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-red-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-red-700">
                  Generation Failed
                </h3>
              </div>
              <p className="mt-2 text-sm text-red-700">
                {report.description.includes("Failed") ? report.description : "An error occurred during report generation."}
              </p>
              <Button variant="outline" size="sm" className="mt-3 gap-1.5 border-red-200 text-red-600 hover:bg-red-50">
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import { cn } from "@/lib/utils";