"use client";

import { CalendarDays, Users, Bell, ShieldAlert, Hexagon, Clock } from "lucide-react";
import { dailyMetrics } from "@/lib/analytics-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DailyMetricsTable() {
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
            {dailyMetrics.map((day, i) => {
              const prev = dailyMetrics[i - 1];
              const touristChange = prev ? day.tourists - prev.tourists : 0;
              return (
                <TableRow key={day.date} className="border-slate-50">
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
    </div>
  );
}

import { cn } from "@/lib/utils";