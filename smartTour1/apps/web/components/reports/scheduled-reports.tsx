"use client";

import {
  Calendar,
  Clock,
  Mail,
  FileText,
  Pause,
  Play,
  MoreHorizontal,
  RotateCcw,
  Hourglass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ScheduledReport } from "@/lib/reports-data";

const freqConfig = {
  hourly: { label: "Hourly", color: "bg-blue-50 text-blue-700 border-blue-200" },
  daily: { label: "Daily", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  weekly: { label: "Weekly", color: "bg-violet-50 text-violet-700 border-violet-200" },
  monthly: { label: "Monthly", color: "bg-amber-50 text-amber-700 border-amber-200" },
};

interface ScheduledReportsProps {
  scheduledJobs: ScheduledReport[];
  onToggleActive: (id: string) => void;
  onNewSchedule: () => void;
}

function formatTimeString(isoString?: string) {
  if (!isoString) return "--";
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  const hoursValue = match?.[1];
  const minutesValue = match?.[2];

  if (hoursValue && minutesValue) {
    const hours = parseInt(hoursValue, 10);
    const minutes = minutesValue;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return isoString;
}

export default function ScheduledReports({ scheduledJobs, onToggleActive, onNewSchedule }: ScheduledReportsProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Scheduled Reports</h3>
          <p className="text-xs text-slate-500">Recurring automated generation jobs</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={onNewSchedule}>
          <Calendar className="h-3.5 w-3.5" />
          New Schedule
        </Button>
      </div>

      <div className="space-y-3">
        {scheduledJobs.map((sch) => {
          const freq = freqConfig[sch.frequency];
          return (
            <div
              key={sch.id}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-4 transition-colors",
                sch.active ? "border-slate-100" : "border-slate-50 bg-slate-50/50 opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  sch.active ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
                )}
              >
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">{sch.title}</p>
                  <Badge variant="outline" className={cn("text-[10px]", freq.color)}>
                    {freq.label}
                  </Badge>
                  {!sch.active && (
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px]">
                      Paused
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1" suppressHydrationWarning>
                    <Clock className="h-3 w-3" />
                    Next: {formatTimeString(sch.nextRun)}
                  </span>
                  {sch.lastRun && (
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <RotateCcw className="h-3 w-3" />
                      Last: {formatTimeString(sch.lastRun)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {sch.recipients.length} recipient{sch.recipients.length > 1 ? "s" : ""}
                  </span>
                  <span className="uppercase">{sch.format}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onToggleActive(sch.id)}
                >
                  {sch.active ? (
                    <Pause className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Play className="h-4 w-4 text-emerald-500" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";