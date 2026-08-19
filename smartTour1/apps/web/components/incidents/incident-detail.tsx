"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  ArrowUpCircle,
  MessageSquare,
  Navigation,
  Shield,
  UserCheck,
  AlertTriangle,
  Calendar,
  Paperclip,
  Plus,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Incident, IncidentSeverity, IncidentStatus } from "@/lib/incident-data";
import { cn } from "@/lib/utils";

const severityConfig: Record<IncidentSeverity, { badge: string; border: string }> = {
  critical: { badge: "bg-red-50 text-red-700 border-red-200", border: "border-red-200" },
  high: { badge: "bg-orange-50 text-orange-700 border-orange-200", border: "border-orange-200" },
  medium: { badge: "bg-amber-50 text-amber-700 border-amber-200", border: "border-amber-200" },
  low: { badge: "bg-blue-50 text-blue-700 border-blue-200", border: "border-blue-200" },
};

const statusConfig: Record<IncidentStatus, { label: string; color: string }> = {
  reported: { label: "Reported", color: "bg-slate-500" },
  investigating: { label: "Investigating", color: "bg-amber-500" },
  escalated: { label: "Escalated", color: "bg-purple-500" },
  resolved: { label: "Resolved", color: "bg-emerald-500" },
  closed: { label: "Closed", color: "bg-slate-400" },
};

const touristStatusColors = {
  safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
  injured: "bg-red-50 text-red-700 border-red-200",
  missing: "bg-amber-50 text-amber-700 border-amber-200",
  evacuated: "bg-blue-50 text-blue-700 border-blue-200",
};

const availableTeams = [
  "Search & Rescue Alpha",
  "Response Team Beta",
  "Ranger Unit 3",
  "Medical Response Team",
  "Tech Support + Field Ops",
  "Security Unit",
];

function formatTimeString(isoString?: string) {
  if (!isoString) return "--";
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  if (match && match[1] && match[2]) {
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }
  return isoString;
}

interface IncidentDetailProps {
  incident: Incident | null;
  onClose: () => void;
  onUpdateIncident?: (updated: Incident) => void;
}

export default function IncidentDetail({
  incident,
  onClose,
  onUpdateIncident,
}: IncidentDetailProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteActor, setNoteActor] = useState("Command Center");
  const [isAssigningTeam, setIsAssigningTeam] = useState(false);
  const [selectedNewTeam, setSelectedNewTeam] = useState(incident?.assignedTeam || availableTeams[0]);

  if (!incident) return null;

  const sev = severityConfig[incident.severity];
  const stat = statusConfig[incident.status];
  const isOpen =
    incident.status === "reported" ||
    incident.status === "investigating" ||
    incident.status === "escalated";

  const getNowTime = () =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const handleStatusTransition = (newStatus: IncidentStatus, actionTitle: string, note?: string) => {
    if (!onUpdateIncident) return;
    const nowIso = new Date().toISOString();
    const updated: Incident = {
      ...incident,
      status: newStatus,
      updatedAt: nowIso,
      resolvedAt: newStatus === "resolved" || newStatus === "closed" ? nowIso : incident.resolvedAt,
      resolution:
        newStatus === "resolved" && !incident.resolution
          ? "Incident verified and resolved by field response personnel."
          : incident.resolution,
      timeline: [
        ...incident.timeline,
        {
          time: getNowTime(),
          actor: "Operator",
          action: actionTitle,
          note: note || `Status transitioned to ${newStatus.toUpperCase()}`,
        },
      ],
    };
    onUpdateIncident(updated);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !onUpdateIncident) return;

    const updated: Incident = {
      ...incident,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...incident.timeline,
        {
          time: getNowTime(),
          actor: noteActor || "Operator",
          action: "Status note added",
          note: noteText.trim(),
        },
      ],
    };
    onUpdateIncident(updated);
    setNoteText("");
    setIsAddingNote(false);
  };

  const handleAssignTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewTeam || !onUpdateIncident) return;

    const updated: Incident = {
      ...incident,
      assignedTeam: selectedNewTeam,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...incident.timeline,
        {
          time: getNowTime(),
          actor: "Incident Command",
          action: `Assigned response team: ${selectedNewTeam}`,
          note: `Reassigned from ${incident.assignedTeam}`,
        },
      ],
    };
    onUpdateIncident(updated);
    setIsAssigningTeam(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={cn("capitalize", sev.badge)} variant="outline">
                {incident.severity}
              </Badge>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", stat.color)} />
                <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="mt-3 text-xl font-bold text-slate-900">{incident.title}</h2>
          <p className="text-sm text-slate-500">
            {incident.id} · {incident.type}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {isOpen && (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSelectedNewTeam(incident.assignedTeam);
                    setIsAssigningTeam(!isAssigningTeam);
                    setIsAddingNote(false);
                  }}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Assign Team
                </Button>
                {incident.status !== "escalated" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50"
                    onClick={() =>
                      handleStatusTransition("escalated", "Case escalated to Incident Command")
                    }
                  >
                    <ArrowUpCircle className="h-3.5 w-3.5" />
                    Escalate
                  </Button>
                )}
              </>
            )}

            {incident.status === "reported" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() =>
                  handleStatusTransition(
                    "investigating",
                    "Investigation officially started",
                    `Dispatched ${incident.assignedTeam} to location`
                  )
                }
              >
                <Shield className="h-3.5 w-3.5" />
                Start Investigation
              </Button>
            )}

            {(incident.status === "investigating" || incident.status === "escalated") && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
                onClick={() =>
                  handleStatusTransition("resolved", "Incident marked as resolved by field team")
                }
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Resolved
              </Button>
            )}

            {incident.status === "resolved" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => handleStatusTransition("closed", "Incident case closed & archived")}
              >
                <FileText className="h-3.5 w-3.5" />
                Close Case
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setIsAddingNote(!isAddingNote);
                setIsAssigningTeam(false);
              }}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Action Panels */}
        {isAssigningTeam && (
          <form
            onSubmit={handleAssignTeamSubmit}
            className="border-b border-blue-100 bg-blue-50/60 p-5 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Reassign Response Team
              </h4>
              <button
                type="button"
                onClick={() => setIsAssigningTeam(false)}
                className="text-xs text-blue-600 hover:underline"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedNewTeam}
                onChange={(e) => setSelectedNewTeam(e.target.value)}
                className="flex-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
            </div>
          </form>
        )}

        {isAddingNote && (
          <form
            onSubmit={handleAddNoteSubmit}
            className="border-b border-amber-100 bg-amber-50/60 p-5 space-y-3 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Append Case Timeline Note
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="text-xs text-amber-700 hover:underline"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Author (e.g. Ranger Unit 2)"
                value={noteActor}
                onChange={(e) => setNoteActor(e.target.value)}
                className="bg-white text-xs h-8"
              />
            </div>
            <textarea
              required
              rows={2}
              placeholder="Enter status update, vitals check, or action log..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full rounded-md border border-amber-200 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 gap-1 text-xs"
              >
                <Send className="h-3 w-3" />
                Post Note
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-700">{incident.description}</p>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Reported By</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{incident.reportedBy}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Assigned Team</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{incident.assignedTeam}</p>
            </div>
            {incident.leadInvestigator && (
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-500">Lead Investigator</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{incident.leadInvestigator}</p>
              </div>
            )}
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Documents</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                <p className="text-sm font-medium text-slate-900">{incident.documents || 0} attached</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </h3>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{incident.location}</p>
                <p className="text-xs text-slate-500">
                  {incident.coordinates.lat.toFixed(5)}, {incident.coordinates.lng.toFixed(5)}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-blue-600">
                <Navigation className="h-3 w-3" />
                Map
              </Button>
            </div>
          </div>

          {/* Involved Tourists */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Involved Tourists ({incident.involvedTourists.length})
            </h3>
            {incident.involvedTourists.length > 0 ? (
              <div className="space-y-2">
                {incident.involvedTourists.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border border-slate-50 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.id}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs capitalize", touristStatusColors[t.status] || "bg-slate-50 text-slate-700")}
                    >
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No specific tourist records linked to this case.</p>
            )}
          </div>

          {/* Root Cause / Resolution */}
          {incident.rootCause && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Root Cause
                </h3>
              </div>
              <p className="mt-2 text-sm text-amber-800">{incident.rootCause}</p>
            </div>
          )}

          {incident.resolution && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Resolution
                </h3>
              </div>
              <p className="mt-2 text-sm text-emerald-800">{incident.resolution}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Incident Timeline ({incident.timeline.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs gap-1 text-blue-600"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="h-3 w-3" />
                Add Event
              </Button>
            </div>

            <div className="relative space-y-0 pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {incident.timeline.map((event, i) => (
                <div key={i} className="relative pb-5 last:pb-0">
                  <div
                    className={cn(
                      "absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white",
                      i === 0
                        ? "bg-red-500"
                        : i === incident.timeline.length - 1 && incident.status !== "reported"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    )}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{event.action}</p>
                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">{event.actor}</span>
                        {event.note && ` · ${event.note}`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 p-4">
            <div>
              <p className="text-xs text-slate-500">Reported</p>
              <p className="mt-1 text-sm font-medium text-slate-900" suppressHydrationWarning>
                {formatTimeString(incident.reportedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-900" suppressHydrationWarning>
                {formatTimeString(incident.updatedAt)}
              </p>
            </div>
            {incident.resolvedAt && (
              <div>
                <p className="text-xs text-slate-500">Resolved</p>
                <p className="mt-1 text-sm font-medium text-emerald-600" suppressHydrationWarning>
                  {formatTimeString(incident.resolvedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}