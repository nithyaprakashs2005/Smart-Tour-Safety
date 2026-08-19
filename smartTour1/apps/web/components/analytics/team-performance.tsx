"use client";

import { Users, Clock, Target, Star, Radio } from "lucide-react";
import { teamMetrics, type TeamMetric } from "@/lib/analytics-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamPerformanceProps {
  teamMetrics?: TeamMetric[];
}

export default function TeamPerformance({ teamMetrics: dynamicTeamMetrics = teamMetrics }: TeamPerformanceProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Response Team Performance</h3>
          <p className="text-xs text-slate-500">7-day operational metrics</p>
        </div>
      </div>

      <div className="space-y-3">
        {dynamicTeamMetrics.map((team) => (
          <div
            key={team.name}
            className="flex items-center gap-4 rounded-lg border border-slate-50 p-3 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                team.onDuty ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
              )}
            >
              <Users className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{team.name}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    team.onDuty
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  )}
                >
                  {team.onDuty ? (
                    <span className="flex items-center gap-1">
                      <Radio className="h-2 w-2" />
                      On Duty
                    </span>
                  ) : (
                    "Off Duty"
                  )}
                </Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {team.incidentsHandled} handled
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {team.avgResponse}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500" />
                  {team.rating}
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">{team.resolutionRate}%</p>
              <p className="text-[10px] text-slate-500">resolution</p>
            </div>
          </div>
        ))}
      </div>
      
      {dynamicTeamMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <Users className="h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No team data available</p>
        </div>
      )}
    </div>
  );
}