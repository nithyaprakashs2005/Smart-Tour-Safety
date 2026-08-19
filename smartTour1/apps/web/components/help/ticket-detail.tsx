"use client";

import { useState } from "react";
import {
  X,
  Ticket,
  Send,
  Clock,
  User,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket as TicketType, TicketStatus } from "@/lib/help-data";

const statusConfig: Record<TicketStatus, { label: string; badge: string }> = {
  open: { label: "Open", badge: "bg-red-50 text-red-700 border-red-200" },
  in_progress: { label: "In Progress", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  waiting: { label: "Waiting", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved: { label: "Resolved", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", badge: "bg-slate-100 text-slate-600 border-slate-200" },
};

interface TicketDetailProps {
  ticket: TicketType | null;
  onClose: () => void;
}

export default function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState(ticket?.messages || []);

  if (!ticket) return null;

  const st = statusConfig[ticket.status];
  const isOpen = ticket.status === "open" || ticket.status === "in_progress" || ticket.status === "waiting";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={cn("text-xs font-medium", st.badge)}>
                {st.label}
              </Badge>
              <span className="text-xs text-slate-500">{ticket.id}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900">{ticket.subject}</h2>
          <p className="text-sm text-slate-500">{categoryLabels[ticket.category]} · Priority: {ticket.priority}</p>

          <div className="mt-4 flex gap-2">
            {isOpen && (
              <>
                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Reply
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark Resolved
                </Button>
              </>
            )}
            {ticket.status === "resolved" && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Reopen
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{ticket.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{ticket.createdBy}</p>
              <p className="text-xs text-slate-500">{ticket.createdByEmail}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Assigned To</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{ticket.assignedTo || "Unassigned"}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Created</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Conversation ({messages.length})
            </h3>
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.from === "support" ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      msg.from === "support"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {msg.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      msg.from === "support"
                        ? "bg-blue-50 text-slate-800"
                        : "bg-slate-100 text-slate-800"
                    )}
                  >
                    <p className="text-xs font-medium text-slate-500 mb-1">{msg.name}</p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="mt-1 text-right text-[10px] text-slate-400">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply */}
          {isOpen && (
            <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-slate-100 bg-white p-6">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyText.trim()) {
                      setMessages([...messages, { from: "support", name: "Support Agent", text: replyText, time: "Now" }]);
                      setReplyText("");
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700"
                  disabled={!replyText.trim()}
                  onClick={() => {
                    setMessages([...messages, { from: "support", name: "Support Agent", text: replyText, time: "Now" }]);
                    setReplyText("");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const categoryLabels: Record<string, string> = {
  technical: "Technical",
  account: "Account",
  billing: "Billing",
  feature_request: "Feature Request",
  bug: "Bug",
  training: "Training",
};

import { cn } from "@/lib/utils";