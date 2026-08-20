"use client";

import { useState, useEffect } from "react";
import { X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportTemplates, type ReportType, type ExportFormat } from "@/lib/reports-data";
import { cn } from "@/lib/utils";

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: { type: ReportType; format: ExportFormat; dateRange: string; recipients: string }) => void;
  initialTemplate?: ReportType | null;
}

export default function NewReportModal({ isOpen, onClose, onGenerate, initialTemplate }: NewReportModalProps) {
  const [template, setTemplate] = useState<ReportType>("daily_summary");
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [dateRange, setDateRange] = useState("Today");
  const [recipients, setRecipients] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTemplate) setTemplate(initialTemplate);
  }, [initialTemplate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // The generation is now handled in the parent component with proper progress simulation
    onGenerate({ type: template, format, dateRange, recipients });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Generate Report</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as ReportType)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTemplates.map((t) => (
                <option key={t.type} value={t.type}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF Document</option>
              <option value="xlsx">Excel Spreadsheet (XLSX)</option>
              <option value="csv">CSV Data</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Recipients (optional)</label>
            <Input
              type="text"
              placeholder="emails separated by comma"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              Generate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
