"use client";

import { useState } from "react";
import { Download, Calendar, Plus, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import ReportStats from "@/components/reports/report-stats";
import ReportTemplates from "@/components/reports/report-templates";
import ReportTable from "@/components/reports/report-table";
import ScheduledReports from "@/components/reports/scheduled-reports";
import ReportDetail from "@/components/reports/report-detail";
import NewReportModal from "@/components/reports/new-report-modal";
import ScheduleModal from "@/components/reports/schedule-modal";
import { generatedReports, scheduledReportsList, reportTemplates, type Report, type ReportType, type ExportFormat, type ScheduledReport } from "@/lib/reports-data";
import { downloadReport } from "@/lib/report-generator";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(generatedReports);
  const [scheduledJobs, setScheduledJobs] = useState<ScheduledReport[]>(scheduledReportsList);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Modals state
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [quickTemplate, setQuickTemplate] = useState<ReportType | null>(null);

  // Bulk select state
  const [selectedReportIds, setSelectedReportIds] = useState<Set<string>>(new Set());

  const handleGenerateReport = (config: { type: ReportType; format: ExportFormat; dateRange: string; recipients: string }) => {
    const newId = `RPT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    
    // Get template info for estimated time
    const template = reportTemplates.find(t => t.type === config.type);
    const estimatedTime = template ? parseInt(template.avgTime) * 1000 : 4000;
    
    const newReport: Report = {
      id: newId,
      title: `Generated ${config.type.replace(/_/g, " ")} - ${config.dateRange}`,
      type: config.type,
      status: "generating",
      generatedAt: new Date().toISOString(),
      generatedBy: "Admin",
      fileSize: "--",
      format: config.format,
      description: `User-requested generation for ${config.dateRange}`,
      coverDate: config.dateRange,
      sections: template ? [template.label, "Data Analysis", "Summary", "Recommendations"] : [],
    };

    setReports([newReport, ...reports]);

    // Simulate progress updates and completion
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        const readyData: Partial<Report> = {
          status: "ready",
          fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
          description: "Successfully generated report.",
          pages: Math.floor(Math.random() * 20 + 5),
          records: Math.floor(Math.random() * 500 + 50)
        };

        // Update to ready status
        setReports((prev) =>
          prev.map((r) =>
            r.id === newId 
              ? { 
                  ...r, 
                  ...readyData
                } 
              : r
          )
        );

        setSelectedReport((current) => {
          if (current?.id === newId) {
            return { ...current, ...readyData } as Report;
          }
          return current;
        });
      }
    }, estimatedTime / 10);
  };

  const handleScheduleReport = (config: { title: string; type: ReportType; format: ExportFormat; frequency: "hourly" | "daily" | "weekly" | "monthly"; recipients: string[] }) => {
    const newSch: ScheduledReport = {
      id: `SCH-${Math.floor(100 + Math.random() * 900)}`,
      title: config.title,
      type: config.type,
      format: config.format,
      frequency: config.frequency,
      recipients: config.recipients,
      nextRun: new Date(Date.now() + 3600000).toISOString(),
      active: true,
    };
    setScheduledJobs([newSch, ...scheduledJobs]);
  };

  const handleToggleSchedule = (id: string) => {
    setScheduledJobs(scheduledJobs.map((j) => (j.id === id ? { ...j, active: !j.active } : j)));
  };

  const handleQuickGenerate = (type: ReportType) => {
    setQuickTemplate(type);
    setIsNewReportModalOpen(true);
  };

  const handleBulkExport = async () => {
    if (selectedReportIds.size === 0) return;
    const readyReports = reports.filter(
      (r) => selectedReportIds.has(r.id) && r.status === "ready"
    );
    for (const report of readyReports) {
      await downloadReport(report);
      // small gap between downloads to avoid browser blocking
      await new Promise((res) => setTimeout(res, 400));
    }
    setSelectedReportIds(new Set());
  };

  const handleDownloadReport = (report: Report) => {
    console.log(`Downloading report: ${report.id}`);
    // The actual download logic is handled in the ReportDetail component
  };

  const handleEmailReport = (report: Report, recipients: string) => {
    console.log(`Emailing report ${report.id} to: ${recipients}`);
    // Would integrate with email API here
  };

  const handlePrintReport = (report: Report) => {
    console.log(`Printing report: ${report.id}`);
    // The actual print logic is handled in the ReportDetail component
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Classification Banner */}
        <div className="bg-slate-900 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          TOURGUARD GLOBAL SAFETY INTELLIGENCE PLATFORM &nbsp;—&nbsp; OFFICIAL USE ONLY
        </div>

        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Intelligence Reports</h2>
                    <span className="flex h-5 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-bold text-blue-700">
                      {reports.length} dossiers
                    </span>
                    <span className="flex h-5 items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 text-[11px] font-bold text-emerald-700">
                      <Shield className="h-3 w-3" />
                      ISO 45001 Certified
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Generate, export, and schedule operational safety dossiers and compliance intelligence records.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-9 font-medium" onClick={() => setIsScheduleModalOpen(true)}>
                <Calendar className="h-3.5 w-3.5" />
                Schedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 h-9 font-medium"
                onClick={handleBulkExport}
                disabled={selectedReportIds.size === 0}
              >
                <Download className="h-3.5 w-3.5" />
                {selectedReportIds.size > 0 ? `Export ${selectedReportIds.size} selected` : "Bulk Export"}
              </Button>
              <Button size="sm" className="gap-1.5 h-9 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm" onClick={() => { setQuickTemplate(null); setIsNewReportModalOpen(true); }}>
                <Plus className="h-3.5 w-3.5" />
                New Dossier
              </Button>
            </div>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          <ReportStats reports={reports} scheduledJobs={scheduledJobs} />

          <ReportTemplates onQuickGenerate={handleQuickGenerate} />

          <ReportTable
            reports={reports}
            selectedReportIds={selectedReportIds}
            onSelectReportIds={setSelectedReportIds}
            onSelectReport={setSelectedReport}
          />

          <ScheduledReports
            scheduledJobs={scheduledJobs}
            onToggleActive={handleToggleSchedule}
            onNewSchedule={() => setIsScheduleModalOpen(true)}
          />
        </div>
      </main>

      {selectedReport && (
        <ReportDetail 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)}
          onDownload={handleDownloadReport}
          onEmail={handleEmailReport}
          onPrint={handlePrintReport}
        />
      )}

      <NewReportModal 
        isOpen={isNewReportModalOpen} 
        onClose={() => setIsNewReportModalOpen(false)} 
        onGenerate={handleGenerateReport} 
        initialTemplate={quickTemplate}
      />

      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        onSchedule={handleScheduleReport} 
      />
    </div>
  );
}