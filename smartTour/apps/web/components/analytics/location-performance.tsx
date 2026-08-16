"use client";

import { MapPin, Users, Clock, ShieldAlert, ThumbsUp } from "lucide-react";
import { locationMetrics } from "@/lib/analytics-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LocationPerformance() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Location Performance</h3>
          <p className="text-xs text-slate-500">Visitor metrics by zone</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Location</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Visitors</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Capacity</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Avg Duration</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Incidents</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Satisfaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationMetrics.map((loc) => {
              const utilization = (loc.visitors / loc.capacity) * 100;
              return (
                <TableRow key={loc.name} className="border-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{loc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{loc.visitors}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={cn("h-full rounded-full", {
                            "bg-emerald-500": utilization < 70,
                            "bg-amber-500": utilization >= 70 && utilization < 90,
                            "bg-red-500": utilization >= 90,
                          })}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round(utilization)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">{loc.avgDuration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {loc.incidents > 0 && <ShieldAlert className="h-3.5 w-3.5 text-red-500" />}
                      <span
                        className={cn(
                          "text-sm",
                          loc.incidents > 0 ? "font-medium text-red-600" : "text-slate-700"
                        )}
                      >
                        {loc.incidents}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-900">{loc.satisfaction}%</span>
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