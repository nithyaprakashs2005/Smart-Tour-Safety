"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import ReportStats from "@/components/reports/report-stats";
import ReportTemplates from "@/components/reports/report-templates";
import ReportTable from "@/components/reports/report-table";
import ScheduledReports from "@/components/reports/scheduled-reports";
import ReportDetail from "@/components/reports/report-detail";
import { Report } from "@/lib/reports-data";

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                156 generated
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Generate, schedule, and manage operational reports and compliance documentation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Bulk Export
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-3.5 w-3.5" />
              New Report
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <ReportStats />

          {/* Templates */}
          <ReportTemplates />

          {/* Generated Reports Table */}
          <ReportTable onSelectReport={setSelectedReport} />

          {/* Scheduled Reports */}
          <ScheduledReports />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedReport && (
        <ReportDetail report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}