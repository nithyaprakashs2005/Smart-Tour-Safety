"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { getTourists, type TouristRecord } from "@/lib/smarttour-api";

const statusStyles = {
  safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  emergency: "bg-red-50 text-red-700 border-red-200",
};

interface TouristTableProps {
  compact?: boolean;
}

export default function TouristTable({ compact = false }: TouristTableProps) {
  const [search, setSearch] = useState("");
  const [tourists, setTourists] = useState<TouristRecord[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getTourists();
        if (active) setTourists(data);
      } catch {
        if (active) setTourists([]);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = tourists.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()),
  );

  const displayed = compact ? filtered.slice(0, 5) : filtered;

  const headerAction = compact ? (
    <Link href="/tourists" className="text-xs font-medium text-blue-600 hover:text-blue-700">
      View all
    </Link>
  ) : (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        placeholder="Search tourist..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 w-44 pl-9 text-sm"
      />
    </div>
  );

  const content = (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Tourist
            </TableHead>
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Status
            </TableHead>
            {!compact && (
              <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Heart Rate
              </TableHead>
            )}
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Battery
            </TableHead>
            {!compact && (
              <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Last Update
              </TableHead>
            )}
            <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Location
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayed.map((tourist) => (
            <TableRow key={tourist.id} className="border-slate-50 hover:bg-slate-50/60">
              <TableCell>
                <div>
                  <p className="text-sm font-medium text-slate-900">{tourist.name}</p>
                  <p className="text-[11px] text-slate-500">{tourist.id}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] font-semibold capitalize", statusStyles[tourist.status])}
                >
                  <span
                    className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
                      "bg-emerald-500": tourist.status === "safe",
                      "bg-amber-500": tourist.status === "warning",
                      "bg-red-500": tourist.status === "emergency",
                    })}
                  />
                  {tourist.status}
                </Badge>
              </TableCell>
              {!compact && (
                <TableCell className="text-sm text-slate-700">
                  {tourist.heart_rate ? `${tourist.heart_rate} bpm` : "--"}
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700">{tourist.battery === null ? "—" : `${tourist.battery}%`}</span>
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", {
                        "bg-emerald-500": (tourist.battery ?? 0) > 50,
                        "bg-amber-500": (tourist.battery ?? 0) > 20 && (tourist.battery ?? 0) <= 50,
                        "bg-red-500": (tourist.battery ?? 0) <= 20,
                      })}
                      style={{ width: `${tourist.battery ?? 0}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              {!compact && (
                <TableCell className="text-sm font-medium text-slate-600">
                  {new Date(tourist.last_updated).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              )}
              <TableCell className="max-w-[140px] truncate text-sm text-slate-600">
                {tourist.location}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (compact) {
    return (
      <DashboardCard
        title="Tourist Overview"
        description="Priority monitored visitors"
        action={headerAction}
        contentClassName="p-0"
        noPadding
      >
        <div className="px-5 pb-5">{content}</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Tourist Overview" action={headerAction}>
      {content}
    </DashboardCard>
  );
}
