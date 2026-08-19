"use client";

import { Ticket, CheckCircle2, Clock, BookOpen, ThumbsUp, Users } from "lucide-react";
import { helpStats } from "@/lib/help-data";

const statCards = [
  {
    label: "Open Tickets",
    sublabel: "Awaiting resolution",
    value: helpStats.openTickets,
    icon: Ticket,
    color: "bg-red-50 text-red-600",
  },
  {
    label: "Resolved Today",
    sublabel: "Closed tickets",
    value: helpStats.resolvedToday,
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Avg Response",
    sublabel: "First response time",
    value: helpStats.avgResponse,
    icon: Clock,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Help Articles",
    sublabel: "Knowledge base",
    value: helpStats.totalArticles,
    icon: BookOpen,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Satisfaction",
    sublabel: "Support rating",
    value: helpStats.satisfaction,
    icon: ThumbsUp,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Active Users",
    sublabel: "Online now",
    value: helpStats.activeUsers,
    icon: Users,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function HelpStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", card.color)}>
            <card.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-slate-900">{card.value}</p>
            <p className="text-xs font-medium text-slate-700">{card.label}</p>
            <p className="text-[10px] text-slate-500">{card.sublabel}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { cn } from "@/lib/utils";