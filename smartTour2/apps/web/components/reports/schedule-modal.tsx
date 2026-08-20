"use client";

import { useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportTemplates, type ReportType, type ExportFormat } from "@/lib/reports-data";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (config: { title: string; type: ReportType; format: ExportFormat; frequency: "hourly" | "daily" | "weekly" | "monthly"; recipients: string[] }) => void;
}

export default function ScheduleModal({ isOpen, onClose, onSchedule }: ScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<ReportType>("daily_summary");
  const [format, setFormat] = useState<ExportFormat>("pdf");
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [recipients, setRecipients] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSchedule({
        title: title || reportTemplates.find((t) => t.type === template)?.label || "Scheduled Report",
        type: template,
        format,
        frequency,
        recipients: recipients.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">New Schedule</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Schedule Title</label>
            <Input
              required
              type="text"
              placeholder="e.g. Daily Admin Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as "hourly" | "daily" | "weekly" | "monthly")}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="xlsx">XLSX</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Recipients (emails)</label>
            <Input
              required
              type="text"
              placeholder="admin@tourguard.io, etc"
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
                <Calendar className="mr-2 h-4 w-4" />
              )}
              Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
