"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { getDashboardData, type ActivityRecord } from "@/lib/smarttour-api";

const statusColors = {
  emergency: "bg-rose-500",
  warning: "bg-amber-500",
  safe: "bg-emerald-500",
  info: "bg-blue-500",
};

const statusLabels = {
  emergency: "Emergency",
  warning: "Warning",
  safe: "Safe",
  info: "Info",
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getDashboardData();
        if (active) setActivities(data.activities.slice(0, 5));
      } catch {
        if (active) setActivities([]);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <DashboardCard
      title="Recent Activity"
      description="Latest field events and status changes"
      action={
        <Link href="/incidents" className="text-xs font-medium text-blue-600 hover:text-blue-700">
          View all
        </Link>
      }
    >
      {activities.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No recent activity</p>
      ) : (
        <div className="relative space-y-0">
          <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-200" />

          {activities.map((activity) => (
            <div key={activity.id} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="relative z-10 mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-white shadow-sm ring-1 ring-slate-200">
                <div className={cn("h-2 w-2 rounded-full", statusColors[activity.status])} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white",
                      statusColors[activity.status],
                    )}
                  >
                    {statusLabels[activity.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900">{activity.event}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {activity.tourist_id} · {activity.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
