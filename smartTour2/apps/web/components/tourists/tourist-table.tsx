"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MapPin,
  MoreHorizontal,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Tourist, TouristStatus } from "@/lib/tourist-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<TouristStatus, { label: string; dot: string; badge: string }> = {
  safe: {
    label: "Safe",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  emergency: {
    label: "Emergency",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
  },
  offline: {
    label: "Offline",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

interface TouristTableProps {
  tourists: Tourist[];
  onSelectTourist: (tourist: Tourist) => void;
}

export default function TouristTable({ tourists, onSelectTourist }: TouristTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TouristStatus | "all">("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const filtered = tourists.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesGroup = groupFilter === "all" || t.group === groupFilter;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search tourists by name, ID, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-80 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TouristStatus | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="safe">Safe</option>
              <option value="warning">Warning</option>
              <option value="emergency">Emergency</option>
              <option value="offline">Offline</option>
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Groups</option>
              <option value="Alpha">Alpha</option>
              <option value="Beta">Beta</option>
              <option value="Gamma">Gamma</option>
              <option value="Solo">Solo</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="h-3.5 w-3.5" />
            Message All
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center p-8 text-sm text-slate-500">
            No tourists match the current filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-xs font-semibold text-slate-500">Tourist</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Group</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Heart Rate</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">HRV</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">SpO2</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Temperature</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Blood Pressure</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Last Update</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Location</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Device</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tourist) => {
                const st = statusConfig[tourist.status];
                return (
                  <TableRow
                    key={tourist.id}
                    className="cursor-pointer border-slate-50 transition-colors hover:bg-slate-50"
                    onClick={() => onSelectTourist(tourist)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {tourist.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{tourist.name}</p>
                          <p className="text-xs text-slate-500">{tourist.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("gap-1.5 text-xs font-semibold capitalize", st.badge)}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", st.dot)} />
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-700">{tourist.group}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5",
                            tourist.heartRate && tourist.heartRate > 120 ? "text-red-500" : "text-slate-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm",
                            tourist.heartRate && tourist.heartRate > 120
                              ? "font-semibold text-red-600"
                              : "text-slate-700"
                          )}
                        >
                          {tourist.heartRate ? `${tourist.heartRate} bpm` : "--"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">{tourist.heartRateVariability ? `${tourist.heartRateVariability} ms` : "--"}</TableCell>
                    <TableCell className="text-sm text-slate-700">{tourist.spo2 ? `${tourist.spo2}%` : "--"}</TableCell>
                    <TableCell className="text-sm text-slate-700">{tourist.bodyTemperature ? `${tourist.bodyTemperature.toFixed(1)} °C` : "--"}</TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {tourist.bloodPressure ? `${tourist.bloodPressure.systolic}/${tourist.bloodPressure.diastolic}` : "--"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "text-sm",
                          tourist.status === "emergency" ? "font-semibold text-red-600" : "text-slate-700"
                        )}
                      >
                        {formatTime(tourist.lastUpdate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="max-w-[140px] truncate">{tourist.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{tourist.deviceModel}</span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No tourists found</p>
          <p className="text-xs text-slate-500">Try adjusting your filters</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {tourists.length} tourists
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}