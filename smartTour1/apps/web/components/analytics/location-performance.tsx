"use client";

import { MapPin, Users, Clock, ShieldAlert, ThumbsUp, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { locationMetrics, type LocationMetric } from "@/lib/analytics-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SortField = "visitors" | "incidents" | "satisfaction" | "name";
type SortOrder = "asc" | "desc";

interface LocationPerformanceProps {
  locationMetrics?: LocationMetric[];
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function LocationPerformance({ 
  locationMetrics: dynamicLocationMetrics = locationMetrics,
  sortField = "visitors",
  sortOrder = "desc",
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: LocationPerformanceProps) {
  
  const handleSort = (field: SortField) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />;
    }
    return sortOrder === "asc" 
      ? <ChevronUp className="h-3.5 w-3.5 text-slate-600" />
      : <ChevronDown className="h-3.5 w-3.5 text-slate-600" />;
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Location Performance</h3>
          <p className="text-xs text-slate-500">Visitor metrics by zone</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead 
                className="text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Location
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort("visitors")}
              >
                <div className="flex items-center gap-1">
                  Visitors
                  {getSortIcon("visitors")}
                </div>
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Capacity</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Avg Duration</TableHead>
              <TableHead 
                className="text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort("incidents")}
              >
                <div className="flex items-center gap-1">
                  Incidents
                  {getSortIcon("incidents")}
                </div>
              </TableHead>
              <TableHead 
                className="text-xs font-semibold text-slate-500 cursor-pointer hover:bg-slate-50"
                onClick={() => handleSort("satisfaction")}
              >
                <div className="flex items-center gap-1">
                  Satisfaction
                  {getSortIcon("satisfaction")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dynamicLocationMetrics.map((loc) => {
              const utilization = (loc.visitors / loc.capacity) * 100;
              return (
                <TableRow key={loc.name} className="border-slate-50 hover:bg-slate-50 cursor-pointer">
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
      
      {dynamicLocationMetrics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <MapPin className="h-8 w-8 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No location data available</p>
        </div>
      )}
    </div>
  );
}