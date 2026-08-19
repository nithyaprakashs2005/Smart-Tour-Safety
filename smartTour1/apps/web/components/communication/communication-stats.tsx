"use client";

import { Send, CheckCircle2, XCircle, Clock, MessageSquare, Activity } from "lucide-react";
import { communicationStats } from "@/lib/communication-data";
import { cn } from "@/lib/utils";

interface CommunicationStatsProps {
  stats?: typeof communicationStats;
}

export default function CommunicationStats({ stats = communicationStats }: CommunicationStatsProps) {
  const statCards = [
    {
      label: "Sent Today",
      sublabel: "All channels",
      value: stats.sentToday,
      icon: Send,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Delivered",
      sublabel: "Successfully reached",
      value: stats.delivered,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Failed",
      sublabel: "Delivery failed",
      value: stats.failed,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Pending",
      sublabel: "In queue",
      value: stats.pending,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Response Rate",
      sublabel: "Tourist engagement",
      value: stats.responseRate,
      icon: MessageSquare,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Active Chats",
      sublabel: "Open conversations",
      value: stats.activeConversations,
      icon: Activity,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

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