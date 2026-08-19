"use client";

import { CalendarDays, Users, Bell, ShieldAlert, Hexagon, Clock } from "lucide-react";
import { dailyMetrics, type DailyMetric } from "@/lib/analytics-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DailyMetricsTableProps {
  dailyMetrics?: DailyMetric[];
}

export default function DailyMetricsTable({ dailyMetrics: dynamicDailyMetrics = dailyMetrics }: DailyMetricsTableProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Daily Metrics</h3>
          <p className="text-xs text-slate-500">Last 7 days comparison</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Date</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Tourists</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Alerts</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Incidents</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Breaches</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Avg Response</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dynamicDailyMetrics.map((day, i) => {
              const prev = dynamicDailyMetrics[i - 1];
              const touristChange = prev ? day.tourists - prev.tourists : 0;
              return (
                <TableRow key={day.date} className="border-slate-50 hover:bg-slate-50 cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-900">{day.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-900">{day.tourists}</span>
                      {touristChange !== 0 && (
                        <span
                          className={cn(
                            "text-xs",
                            touristChange > 0 ? "text-emerald-600" : "text-red-600"
                          )}
                        >
                          {touristChange > 0 ? "+" : ""}
                          {touristChange}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5 text-slate-400" />
                      <span
                        className={cn(
                          "text-sm",
                          day.alerts > 5 ? "font-medium text-red-600" : "text-slate-700"
                        )}
                      >
                        {day.alerts}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                      <span
                        className={cn(
                          "text-sm",
                          day.incidents > 0 ? "font-medium text-red-600" : "text-slate-700"
                        )}
                      >
                        {day.incidents}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Hexagon className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{day.breaches}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{day.avgResponseMin}m</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {dynamicDailyMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <CalendarDays className="h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No daily metrics available</p>
        </div>
      )}
    </div>
  );
}