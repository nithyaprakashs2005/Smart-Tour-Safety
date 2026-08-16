"use client";

import { useState } from "react";
import { Send, AlertTriangle, Users, User, MessageSquare, Radio, Mail, Smartphone, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/communication-data";

const priorityConfig = {
  low: { color: "bg-slate-100 text-slate-700 border-slate-200", label: "Low" },
  normal: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Normal" },
  high: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "High" },
  critical: { color: "bg-red-50 text-red-700 border-red-200", label: "Critical" },
};

const channelIcons = {
  push: Bell,
  sms: Smartphone,
  email: Mail,
  "in-app": MessageSquare,
  all: Radio,
};

export default function ComposePanel() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [priority, setPriority] = useState<keyof typeof priorityConfig>("normal");
  const [channel, setChannel] = useState<string>("push");
  const [recipientType, setRecipientType] = useState<string>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const applyTemplate = (templateId: string) => {
    const t = templates.find((tmp) => tmp.id === templateId);
    if (t) {
      setSelectedTemplate(templateId);
      setSubject(t.subject);
      setBody(t.body);
      setPriority(t.priority as keyof typeof priorityConfig);
      setChannel(t.channel);
    }
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Compose Message</h3>
          <p className="text-xs text-slate-500">Send broadcast, direct, or emergency communications</p>
        </div>
        <Badge variant="outline" className={cn("text-xs", priorityConfig[priority].color)}>
          {priorityConfig[priority].label} Priority
        </Badge>
      </div>

      {/* Template Selector */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-slate-500">Quick Templates</p>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.id)}
              className={cn(
                "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                selectedTemplate === t.id
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipients */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-slate-500">Recipients</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Tourists", icon: Users },
            { id: "teams", label: "All Teams", icon: Radio },
            { id: "emergency", label: "Emergency Only", icon: AlertTriangle },
            { id: "custom", label: "Custom Select", icon: User },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRecipientType(r.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                recipientType === r.id
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              <r.icon className="h-3.5 w-3.5" />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority & Channel */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Priority</p>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as keyof typeof priorityConfig)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Channel</p>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="push">Push Notification</option>
            <option value="sms">SMS</option>
            <option value="email">Email</option>
            <option value="in-app">In-App</option>
            <option value="all">All Channels</option>
          </select>
        </div>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Subject line..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <textarea
          placeholder="Type your message here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            {(() => {
              const ChIcon = channelIcons[channel as keyof typeof channelIcons] || Bell;
              return <ChIcon className="h-3.5 w-3.5" />;
            })()}
            {channel === "all" ? "All channels" : channel.toUpperCase()}
          </span>
          <span>·</span>
          <span>
            {recipientType === "all" ? "127 tourists" : recipientType === "teams" ? "12 staff" : "Select recipients"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            Save Draft
          </Button>
          <Button
            size="sm"
            className={cn(
              "h-9 gap-1.5",
              priority === "critical"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
            disabled={!subject || !body}
          >
            <Send className="h-3.5 w-3.5" />
            {priority === "critical" ? "Send Emergency" : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";