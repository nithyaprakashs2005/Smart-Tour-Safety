"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface IncidentDetailProps {
  incident: Incident | null;
  onClose: () => void;
}

export default function IncidentDetail({ incident, onClose }: IncidentDetailProps) {
  if (!incident) return null;

  const sev = severityConfig[incident.severity];
  const stat = statusConfig[incident.status];
  const isOpen = incident.status === "reported" || incident.status === "investigating" || incident.status === "escalated";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
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
                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                  <UserCheck className="h-3.5 w-3.5" />
                  Assign Team
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ArrowUpCircle className="h-3.5 w-3.5" />
                  Escalate
                </Button>
              </>
            )}
            {incident.status === "reported" && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Start Investigation
              </Button>
            )}
            {(incident.status === "investigating" || incident.status === "escalated") && (
              <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Resolved
              </Button>
            )}
            {incident.status === "resolved" && (
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Close Case
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Add Note
            </Button>
          </div>
        </div>

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
            <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-1 text-xs text-slate-400">Incident location map</p>
                </div>
              </div>
            </div>
          </div>

          {/* Involved Tourists */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Involved Tourists ({incident.involvedTourists.length})
            </h3>
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
                    className={cn("text-xs capitalize", touristStatusColors[t.status])}
                  >
                    {t.status}
                  </Badge>
                </div>
              ))}
            </div>
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
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Incident Timeline
            </h3>
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
                        {event.actor}
                        {event.note && ` · ${event.note}`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 p-4">
            <div>
              <p className="text-xs text-slate-500">Reported</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(incident.reportedAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(incident.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            {incident.resolvedAt && (
              <div>
                <p className="text-xs text-slate-500">Resolved</p>
                <p className="mt-1 text-sm font-medium text-emerald-600">
                  {new Date(incident.resolvedAt).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}