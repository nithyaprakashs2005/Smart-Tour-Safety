"use client";

import Link from "next/link";
import { UserPlus, Hexagon, FileBarChart, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/dashboard-card";

const actions = [
  {
    icon: UserPlus,
    label: "Add Tourist",
    sublabel: "Register a new monitored visitor",
    href: "/tourists",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Hexagon,
    label: "Create Geofence",
    sublabel: "Define operational boundaries",
    href: "/geofences",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: FileBarChart,
    label: "View Reports",
    sublabel: "Export safety analytics",
    href: "/reports",
    color: "text-amber-600 bg-amber-50",
  },
];

export default function ActionBar() {
  return (
    <DashboardCard
      title="Quick Actions"
      description="Common operator workflows"
      noPadding
      contentClassName="p-0"
    >
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 border-b border-r border-slate-100 p-4 transition-colors last:border-b-0 hover:bg-slate-50/80 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
          >
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", action.color)}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{action.sublabel}</p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}
