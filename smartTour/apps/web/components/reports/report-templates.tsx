"use client";

import {
  ClipboardList,
  ShieldAlert,
  ShieldCheck,
  Watch,
  Hexagon,
  Users,
  Footprints,
  CloudSun,
  FilePlus,
  Clock,
} from "lucide-react";
import { reportTemplates } from "@/lib/reports-data";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList,
  ShieldAlert,
  ShieldCheck,
  Watch,
  Hexagon,
  Users,
  Footprints,
  CloudSun,
};

export default function ReportTemplates() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Report Templates</h3>
          <p className="text-xs text-slate-500">Generate on-demand reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reportTemplates.map((template) => {
          const Icon = iconMap[template.icon] || FilePlus;
          return (
            <button
              key={template.type}
              className="group flex flex-col items-start gap-3 rounded-xl border border-slate-100 p-4 text-left transition-all hover:border-blue-200 hover:shadow-sm"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", template.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                  {template.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {template.description}
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  ~{template.avgTime}
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                  Generate
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";