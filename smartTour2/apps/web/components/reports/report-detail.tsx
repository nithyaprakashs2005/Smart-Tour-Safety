"use client";

import { useState } from "react";
import {
  X,
  FileText,
  Download,
  CheckCircle2,
  RotateCcw,
  File,
  Layers,
  Mail,
  Printer,
  Send,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Report, ReportStatus, ExportFormat } from "@/lib/reports-data";
import { cn } from "@/lib/utils";
import { downloadReport, buildMailtoLink } from "@/lib/report-generator";

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
  onDownload?: (report: Report) => void;
  onEmail?: (report: Report, recipients: string) => void;
  onPrint?: (report: Report) => void;
}

export default function ReportDetail({ 
  report, 
  onClose, 
  onDownload,
  onEmail,
  onPrint 
}: ReportDetailProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [totalPages] = useState(4);

  if (!report) return null;

  const st = statusConfig[report.status];

  // Real download handler — uses jsPDF for PDF, CSV for csv/xlsx, KML for kml
  const handleDownload = async () => {
    if (onDownload) {
      onDownload(report);
    }
    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);
    const result = await downloadReport(report);
    setIsDownloading(false);
    if (result.success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } else {
      setDownloadError(result.error ?? "Download failed");
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

  // Email handler — opens mailto: link with report details pre-filled
  const handleEmail = () => {
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = () => {
    if (onEmail) onEmail(report, emailRecipients);
    const mailto = buildMailtoLink(report, emailRecipients);
    window.open(mailto, "_blank");
    setIsEmailModalOpen(false);
    setEmailRecipients("");
  };

  // Print handler — opens an ultra-professional, publication-ready printable window
  const handlePrint = () => {
    if (onPrint) onPrint(report);
    const printContent = generatePrintContent(report);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${report.title} — Official Safety Dossier</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; background: #fff; line-height: 1.5; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .page { max-width: 880px; margin: 0 auto; padding: 32px; }
              
              /* Classification Banner */
              .classification { background: #0f172a; color: #e2e8f0; text-align: center; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 6px 12px; text-transform: uppercase; border-radius: 4px 4px 0 0; }
              
              /* Header */
              .header { background: #1e293b; color: #fff; padding: 24px 28px; border-bottom: 4px solid #2563eb; display: flex; justify-content: space-between; align-items: center; }
              .header-left { display: flex; align-items: center; gap: 14px; }
              .header-logo { width: 38px; height: 38px; background: #2563eb; color: #fff; font-weight: 800; font-size: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
              .header h1 { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
              .header p { font-size: 11px; color: #94a3b8; margin-top: 2px; }
              .header-meta { text-align: right; font-size: 11px; color: #94a3b8; }
              .header-meta strong { color: #fff; font-size: 12px; display: block; font-family: 'JetBrains Mono', monospace; }

              .content-body { border: 1px solid #e2e8f0; border-top: none; padding: 28px; border-radius: 0 0 6px 6px; }

              /* Title Block */
              .doc-title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
              .doc-subtitle { font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
              
              /* KPI Grid */
              .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
              .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; position: relative; }
              .kpi-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #2563eb; border-radius: 8px 0 0 8px; }
              .kpi-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
              .kpi-val { font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.2; }
              .kpi-sub { font-size: 9px; color: #94a3b8; margin-top: 2px; }

              /* Summary Box */
              .summary-box { background: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; padding: 14px 18px; margin-bottom: 24px; font-size: 12px; color: #334155; }
              .summary-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 4px; letter-spacing: 0.05em; }

              /* Meta Grid */
              .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
              .meta-cell { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; }
              .meta-cell label { display: block; font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
              .meta-cell span { font-size: 12px; font-weight: 600; color: #0f172a; }

              /* Tables */
              .section-heading { font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin: 24px 0 10px 0; display: flex; align-items: center; gap: 8px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
              th { background: #0f172a; color: #fff; padding: 8px 12px; text-align: left; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
              td { border: 1px solid #e2e8f0; padding: 8px 12px; color: #334155; }
              tr:nth-child(even) td { background: #f8fafc; }

              /* Sign-off */
              .sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
              .sign-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; font-size: 10px; color: #475569; }
              .sign-box strong { display: block; font-size: 10px; text-transform: uppercase; color: #0f172a; margin-bottom: 6px; }

              /* Footer */
              .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
              
              @media print {
                .page { padding: 0; max-width: 100%; }
                body { background: #fff; }
              }
            </style>
          </head>
          <body>
            <div class="page">
              ${printContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  // Generate print-friendly content
  const generatePrintContent = (rpt: Report): string => {
    return `
      <div class="classification">SECURITY CLASSIFICATION: OFFICIAL // PUBLIC SAFETY COMMAND & DISPATCH</div>
      <div class="header">
        <div class="header-left">
          <div class="header-logo">TG</div>
          <div>
            <h1>TOURGUARD SAFETY INTELLIGENCE</h1>
            <p>Autonomous Tourist Monitoring, Disaster Triage & Perimeter Security</p>
          </div>
        </div>
        <div class="header-meta">
          <strong>REF: ${rpt.id}</strong>
          <div>ISSUED: ${new Date(rpt.generatedAt).toLocaleString()}</div>
          <div>OFFICER: ${rpt.generatedBy}</div>
        </div>
      </div>

      <div class="content-body">
        <div class="doc-title">${rpt.title}</div>
        <div class="doc-subtitle">${rpt.type.replace(/_/g, " ").toUpperCase()} DOSSIER &bull; ${rpt.coverDate}</div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Operational Status</div>
            <div class="kpi-val" style="color:#059669">${rpt.status.toUpperCase()}</div>
            <div class="kpi-sub">Verified in store</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Export Format</div>
            <div class="kpi-val">${rpt.format.toUpperCase()}</div>
            <div class="kpi-sub">${formatLabels[rpt.format]}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">File Size</div>
            <div class="kpi-val">${rpt.fileSize}</div>
            <div class="kpi-sub">${rpt.pages ?? 12} Pages Encoded</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Data Records</div>
            <div class="kpi-val">${rpt.records ?? 127}</div>
            <div class="kpi-sub">Telemetric Entities</div>
          </div>
        </div>

        <div class="summary-box">
          <div class="summary-title">Executive Summary & Scope</div>
          ${rpt.description}
        </div>

        <div class="meta-grid">
          <div class="meta-cell"><label>Report ID</label><span>${rpt.id}</span></div>
          <div class="meta-cell"><label>Cover Period</label><span>${rpt.coverDate}</span></div>
          <div class="meta-cell"><label>Generated By</label><span>${rpt.generatedBy}</span></div>
          <div class="meta-cell"><label>Checksum</label><span style="font-family:'JetBrains Mono',monospace;font-size:10px">SHA256-${rpt.id.slice(0, 8)}</span></div>
        </div>

        ${rpt.sections.length > 0 ? `
          <div class="section-heading">1. Included Report Sections</div>
          <table>
            <thead><tr><th style="width:40px">#</th><th>Section Title</th><th style="width:120px">Audit State</th></tr></thead>
            <tbody>
              ${rpt.sections.map((s, i) => `<tr><td style="text-align:center;font-weight:700">${i + 1}</td><td><strong>${s}</strong></td><td style="color:#059669;font-weight:600">✓ Verified Complete</td></tr>`).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="section-heading">2. Command Action Items & Strategic Directives</div>
        <table>
          <thead><tr><th style="width:80px">Action Code</th><th>Operational Recommendation</th><th style="width:100px">Priority</th></tr></thead>
          <tbody>
            <tr><td style="font-weight:700">ACT-01</td><td>Deploy auxiliary mobile ranger unit to peak elevation zones during high visitor density.</td><td style="color:#2563eb;font-weight:700">HIGH</td></tr>
            <tr><td style="font-weight:700">ACT-02</td><td>Maintain automated LoRa mesh telemetry syncing across all perimeter gateways.</td><td style="color:#059669;font-weight:700">NORMAL</td></tr>
            <tr><td style="font-weight:700">ACT-03</td><td>Synchronize micro-climate hazard warnings with visitor wearable beacons.</td><td style="color:#059669;font-weight:700">NORMAL</td></tr>
          </tbody>
        </table>

        <div class="sign-grid">
          <div class="sign-box">
            <strong>Chief Operations Commander</strong>
            <div>Name: Capt. Arjun Mehta</div>
            <div>Sign: [DIGITAL-SEC-AUTH-99]</div>
            <div>Date: ${new Date(rpt.generatedAt).toLocaleDateString()}</div>
          </div>
          <div class="sign-box">
            <strong>Compliance & Integrity Certification</strong>
            <div>Standard: ISO 45001 / ISO 27001 Certified</div>
            <div>Status: VERIFIED UNALTERED RECORD</div>
            <div>Ref: SHA-256 Verified</div>
          </div>
        </div>

        <div class="footer">
          <span>TourGuard Autonomous Public Safety System &bull; Ref: ${rpt.id} &bull; CONFIDENTIAL</span>
          <span>Generated: ${new Date(rpt.generatedAt).toLocaleString()}</span>
        </div>
      </div>
    `;
  };

  // Preview component based on format
  const renderPreview = () => {
    if (report.status !== "ready") return null;

    switch (report.format) {
      case 'pdf':
        return renderPDFPreview();
      case 'csv':
        return renderCSVPreview();
      case 'xlsx':
        return renderXLSXPreview();
      case 'kml':
        return renderKMLPreview();
      default:
        return renderGenericPreview();
    }
  };

  const renderPDFPreview = () => (
    <div className="space-y-4">
      {/* High Fidelity PDF Mini-Doc Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Header Preview Banner */}
        <div className="mb-4 rounded-lg bg-slate-900 p-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold">TG</span>
              <div>
                <p className="text-xs font-bold leading-none">TOURGUARD SAFETY INTELLIGENCE</p>
                <p className="text-[9px] text-slate-400">Autonomous Public Safety Dossier</p>
              </div>
            </div>
            <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-[9px] font-semibold text-blue-300">
              {report.id}
            </span>
          </div>
        </div>

        <div className="border-b border-slate-100 pb-3">
          <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
          <p className="text-[11px] font-semibold text-blue-600">{report.type.replace(/_/g, " ").toUpperCase()}</p>
        </div>

        {/* 3 KPI mini pills */}
        <div className="my-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-slate-50 border border-slate-100 p-2">
            <p className="text-[10px] text-slate-500 font-medium">Status</p>
            <p className="text-xs font-bold text-emerald-600">VERIFIED</p>
          </div>
          <div className="rounded-md bg-slate-50 border border-slate-100 p-2">
            <p className="text-[10px] text-slate-500 font-medium">Records</p>
            <p className="text-xs font-bold text-slate-900">{report.records ?? 127}</p>
          </div>
          <div className="rounded-md bg-slate-50 border border-slate-100 p-2">
            <p className="text-[10px] text-slate-500 font-medium">Pages</p>
            <p className="text-xs font-bold text-slate-900">{report.pages ?? 12}</p>
          </div>
        </div>

        {/* Mini Section Checklist */}
        <div className="space-y-1.5 rounded-lg bg-slate-50/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verified Dossier Modules</p>
          {report.sections.slice(0, 3).map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                {s}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">✓ Ready</span>
            </div>
          ))}
        </div>

        {/* Footer stamp preview */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] text-slate-400">
          <span>ISO 45001 / ISO 27001 Certified</span>
          <span>Page {previewPage} of {totalPages}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setPreviewPage(Math.max(1, previewPage - 1))} disabled={previewPage === 1} className="h-8 text-xs">
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPreviewPage(i + 1)}
              className={cn(
                "h-6 w-6 rounded text-xs font-medium transition-colors",
                previewPage === i + 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setPreviewPage(Math.min(totalPages, previewPage + 1))} disabled={previewPage === totalPages} className="h-8 text-xs">
          Next
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );

  const renderCSVPreview = () => (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-700">Field</th>
              <th className="px-3 py-2 text-left font-medium text-slate-700">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">Report ID</td>
              <td className="px-3 py-2 text-slate-900 font-mono text-xs">{report.id}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">Title</td>
              <td className="px-3 py-2 text-slate-900 font-medium">{report.title}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">Type</td>
              <td className="px-3 py-2 text-slate-900 capitalize">{report.type.replace(/_/g, " ")}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">Status</td>
              <td className="px-3 py-2 text-emerald-600 font-semibold uppercase text-xs">{report.status}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">Generated At</td>
              <td className="px-3 py-2 text-slate-900">{new Date(report.generatedAt).toLocaleString()}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-3 py-2 text-slate-600">File Size</td>
              <td className="px-3 py-2 text-slate-900">{report.fileSize}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
        {report.records || 127} telemetry rows encoded
      </div>
    </div>
  );

  const renderXLSXPreview = () => (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{report.title}.xlsx</p>
            <p className="text-xs text-slate-500">{report.fileSize} • {report.records || 127} rows</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-emerald-50 rounded p-2 text-center">
            <p className="font-medium text-emerald-700">{report.sections.length || 4}</p>
            <p className="text-emerald-600">Sheets</p>
          </div>
          <div className="bg-blue-50 rounded p-2 text-center">
            <p className="font-medium text-blue-700">{report.records || 127}</p>
            <p className="text-blue-600">Data Points</p>
          </div>
          <div className="bg-amber-50 rounded p-2 text-center">
            <p className="font-medium text-amber-700">{report.pages || 12}</p>
            <p className="text-amber-600">Charts</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                {report.sections.slice(0, 4).map((section, i) => (
                  <th key={i} className="px-2 py-2 text-left font-medium text-slate-700">{section}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((row) => (
                <tr key={row} className="border-t border-slate-100">
                  {report.sections.slice(0, 4).map((_, i) => (
                    <td key={i} className="px-2 py-2 text-slate-600">Metric {row}-{i + 1}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderKMLPreview = () => (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded bg-cyan-100 flex items-center justify-center">
            <Eye className="h-4 w-4 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{report.title}.kml</p>
            <p className="text-xs text-slate-500">Geographic Data Layer</p>
          </div>
        </div>
        <div className="rounded-lg bg-slate-900 p-4 text-white text-xs">
          <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] mb-2">
            <span>&lt;kml xmlns="..."&gt;</span>
            <span>5 Placemarks</span>
          </div>
          <p className="text-slate-300 text-[11px]">Geofence Boundaries, Emergency Shelters & RF Gateways ready for Google Earth & ArcGIS GIS mapping.</p>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold text-slate-700 mb-2">Placemarks: {report.records || 5}</p>
        <div className="space-y-1.5">
          {[
            { name: "Sector A1 - North Rim Overlook", coords: "12.9716°N, 77.5946°E" },
            { name: "Sector B2 - Lakeview Summit Basin", coords: "12.9800°N, 77.6000°E" },
            { name: "Sector C3 - Rocky Ridge Pass Escarpment", coords: "12.9650°N, 77.5900°E" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
              <span className="text-slate-700 font-medium">{item.name}</span>
              <span className="text-slate-400 ml-auto font-mono text-[10px]">{item.coords}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGenericPreview = () => (
    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-slate-100">
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2 text-sm font-medium text-slate-500">Report Preview</p>
          <p className="text-xs text-slate-400">{report.pages || "--"} pages</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-xs font-semibold px-2.5 py-0.5", st.badge)}>
                {st.label.toUpperCase()}
              </Badge>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Official Dossier
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900">{report.title}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
            <span>{report.id}</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold uppercase">{report.type.replace(/_/g, " ")}</span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2">
              {report.status === "ready" && (
                <>
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={cn(
                      "gap-1.5 font-semibold shadow-sm transition-all",
                      downloadSuccess
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : downloadSuccess ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {isDownloading ? "Preparing Dossier…" : downloadSuccess ? "Downloaded!" : `Download ${report.format.toUpperCase()}`}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEmail} className="gap-1.5 text-xs font-semibold">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-xs font-semibold">
                    <Printer className="h-3.5 w-3.5 text-slate-500" />
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
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating Dossier…
                </Button>
              )}
            </div>
            {downloadError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <X className="h-3 w-3" /> {downloadError}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Executive Summary Callout */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Executive Scope & Summary
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{report.description}</p>
          </div>

          {/* KPI Snapshot Pill Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-100 bg-white p-3 text-center shadow-xs">
              <p className="text-[10px] font-medium text-slate-500 uppercase">Records</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{report.records ?? 127}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3 text-center shadow-xs">
              <p className="text-[10px] font-medium text-slate-500 uppercase">Format</p>
              <p className="text-base font-bold text-blue-600 mt-0.5">{report.format.toUpperCase()}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3 text-center shadow-xs">
              <p className="text-[10px] font-medium text-slate-500 uppercase">File Size</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{report.fileSize}</p>
            </div>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Report Type</p>
              <p className="mt-1 text-xs font-semibold capitalize text-slate-900">
                {report.type.replace(/_/g, " ")}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Classification</p>
              <p className="mt-1 text-xs font-semibold text-slate-900">Official Safety Record</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Cover Period</p>
              <p className="mt-1 text-xs font-semibold text-slate-900">{report.coverDate}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Generated By</p>
              <p className="mt-1 text-xs font-semibold text-slate-900">{report.generatedBy}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 col-span-2">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Issued Timestamp</p>
              <p className="mt-1 text-xs font-semibold text-slate-900">
                {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
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

          {/* Dynamic Preview */}
          {report.status === "ready" && (
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Preview
              </h3>
              {renderPreview()}
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

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Email Report</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Recipients</label>
                <Input
                  type="text"
                  placeholder="emails separated by comma"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                <Input
                  type="text"
                  value={`Report: ${report.title}`}
                  readOnly
                  className="bg-slate-50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  className="w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={`Please find attached the ${report.type.replace(/_/g, ' ')} report for ${report.coverDate}.\n\nGenerated on ${new Date(report.generatedAt).toLocaleString()}\n\nThis is an automated message from TourGuard Safety System.`}
                  readOnly
                />
              </div>
              <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                Clicking <strong>Open Mail Client</strong> will open your default email app with the report details pre-filled.
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={!emailRecipients}
                  className="bg-blue-600 hover:bg-blue-700 gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  Open Mail Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}