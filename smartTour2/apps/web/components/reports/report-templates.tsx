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
  ArrowRight,
} from "lucide-react";
import { reportTemplates, type ReportType } from "@/lib/reports-data";
import { cn } from "@/lib/utils";

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

interface ReportTemplatesProps {
  onQuickGenerate: (type: ReportType) => void;
}

export default function ReportTemplates({ onQuickGenerate }: ReportTemplatesProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Intelligence Report Templates</h3>
          <p className="text-xs text-slate-500">Instantly generate a certified safety dossier from a pre-configured intelligence module</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
          {reportTemplates.length} Templates
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-slate-100 lg:grid-cols-4">
        {reportTemplates.map((template) => {
          const Icon = iconMap[template.icon] || FilePlus;
          return (
            <button
              key={template.type}
              onClick={() => onQuickGenerate(template.type)}
              className="group relative flex flex-col items-start gap-3 bg-white p-5 text-left transition-all hover:bg-slate-50"
            >
              {/* Icon */}
              <div className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                template.color
              )}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {template.label}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                  {template.description}
                </p>
              </div>

              {/* Footer */}
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Clock className="h-3 w-3" />
                  ~{template.avgTime}
                </span>
                <span className="flex items-center gap-0.5 rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-1">
                  Generate
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {/* Bottom accent line on hover */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 transition-transform group-hover:scale-x-100 origin-left" />
            </button>
          );
        })}
      </div>
    </div>
  );
}