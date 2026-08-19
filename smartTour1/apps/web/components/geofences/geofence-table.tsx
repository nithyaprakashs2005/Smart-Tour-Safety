"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import {
  Search,
  Hexagon,
  MapPin,
  Users,
  AlertTriangle,
  MoreHorizontal,
  ShieldCheck,
  Wrench,
  Power,
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
import { type Geofence, type GeofenceStatus } from "@/lib/geofence-data";

const statusConfig: Record<GeofenceStatus, { label: string; badge: string; icon: any }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldCheck },
  inactive: { label: "Inactive", badge: "bg-slate-100 text-slate-600 border-slate-200", icon: Power },
  maintenance: { label: "Maintenance", badge: "bg-amber-50 text-amber-700 border-amber-200", icon: Wrench },
};

interface GeofenceTableProps {
  geofences: Geofence[];
  onSelectGeofence: (gf: Geofence) => void;
}

export default function GeofenceTable({ geofences, onSelectGeofence }: GeofenceTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<GeofenceStatus | "all">("all");

  const filtered = geofences.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search geofences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as GeofenceStatus | "all")}
            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
          <Hexagon className="h-3.5 w-3.5" />
          Create Geofence
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">Zone</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Rule</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Tourists</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Breaches 24h</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Area</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Auto-Lock</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((gf) => {
              const st = statusConfig[gf.status];
              return (
                <TableRow
                  key={gf.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    gf.breachCount24h > 0 ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectGeofence(gf)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: gf.color + "20" }}
                      >
                        <Hexagon className="h-5 w-5" style={{ color: gf.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{gf.name}</p>
                        <p className="text-xs text-slate-500">{gf.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 text-xs font-medium", st.badge)}>
                      <st.icon className="h-3 w-3" />
                      {st.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize text-slate-700">{gf.type}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{gf.rule}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700">
                        {gf.touristCount}
                        {gf.maxCapacity && ` / ${gf.maxCapacity}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {gf.breachCount24h > 0 && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                      <span
                        className={cn(
                          "text-sm font-medium",
                          gf.breachCount24h > 0 ? "text-red-600" : "text-slate-700"
                        )}
                      >
                        {gf.breachCount24h}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{gf.areaKm2} km²</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        gf.autoLockdown
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      )}
                    >
                      {gf.autoLockdown ? "Enabled" : "Off"}
                    </Badge>
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
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No geofences found</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {geofences.length} zones
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
        </div>
      </div>

      {/* Live Stats Footer */}
      <div className="mx-5 mb-5 rounded-lg bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-medium text-slate-700">Live Updates</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500">
            <span>Total: {geofences.length}</span>
            <span>Active: {geofences.filter(g => g.status === 'active').length}</span>
            <span className="text-red-600">Breaches: {geofences.reduce((sum, g) => sum + g.breachCount24h, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}