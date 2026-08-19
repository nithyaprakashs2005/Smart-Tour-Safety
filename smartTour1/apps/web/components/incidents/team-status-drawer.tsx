"use client";

import { X, Shield, Users, Radio, CheckCircle2, Clock, AlertTriangle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Incident } from "@/lib/incident-data";
import { cn } from "@/lib/utils";

interface TeamStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
}

const teamsData = [
  {
    id: "team-1",
    name: "Search & Rescue Alpha",
    type: "Tactical & Mountain SAR",
    members: 6,
    lead: "Ranger Mike Chen",
    base: "Base Camp Sector 1",
    avgResponse: "3m 45s",
    rating: 4.8,
    status: "deployed", // "deployed" | "on-duty" | "standby"
  },
  {
    id: "team-2",
    name: "Response Team Beta",
    type: "Rapid ATV Unit",
    members: 4,
    lead: "Officer Priya Nair",
    base: "River Valley Post",
    avgResponse: "5m 12s",
    rating: 4.5,
    status: "deployed",
  },
  {
    id: "team-3",
    name: "Ranger Unit 3",
    type: "Trail Patrol & Wildlife",
    members: 5,
    lead: "Ranger David Okafor",
    base: "North Forest Outpost",
    avgResponse: "4m 30s",
    rating: 4.9,
    status: "on-duty",
  },
  {
    id: "team-4",
    name: "Medical Response Team",
    type: "Paramedic & Med-Evac",
    members: 4,
    lead: "Dr. Aisha Patel",
    base: "Central Clinic & Helipad",
    avgResponse: "2m 18s",
    rating: 5.0,
    status: "deployed",
  },
  {
    id: "team-5",
    name: "Tech Support + Field Ops",
    type: "Device Telemetry & IT",
    members: 3,
    lead: "Engineer Sarah Kim",
    base: "Operations Control Hub",
    avgResponse: "8m 00s",
    rating: 4.2,
    status: "on-duty",
  },
  {
    id: "team-6",
    name: "Security Unit",
    type: "Camp Security & Access",
    members: 4,
    lead: "Officer Sarah Johnson",
    base: "Visitor Center",
    avgResponse: "6m 15s",
    rating: 4.6,
    status: "on-duty",
  },
];

export default function TeamStatusDrawer({
  isOpen,
  onClose,
  incidents,
  onSelectIncident,
}: TeamStatusDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Response Teams Status</h2>
                <p className="text-xs text-slate-500">Live deployment & field readiness</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <p className="text-xl font-bold text-slate-900">{teamsData.length}</p>
              <p className="text-[11px] font-medium text-slate-500">Total Teams</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
              <p className="text-xl font-bold text-emerald-700">
                {teamsData.filter((t) => t.status === "deployed").length}
              </p>
              <p className="text-[11px] font-medium text-emerald-600">Deployed</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-center">
              <p className="text-xl font-bold text-blue-700">
                {teamsData.filter((t) => t.status === "on-duty").length}
              </p>
              <p className="text-[11px] font-medium text-blue-600">On Duty Ready</p>
            </div>
          </div>

          <div className="space-y-3">
            {teamsData.map((team) => {
              const activeIncidents = incidents.filter(
                (inc) =>
                  (inc.assignedTeam || "").toLowerCase().includes(team.name.toLowerCase().split(" ")[0] || "") &&
                  (inc.status === "reported" || inc.status === "investigating" || inc.status === "escalated")
              );

              return (
                <div
                  key={team.id}
                  className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{team.name}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize font-semibold",
                            activeIncidents.length > 0
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          )}
                        >
                          {activeIncidents.length > 0 ? "Active Assignment" : "Available / Patrol"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{team.type} · Lead: {team.lead}</p>
                    </div>

                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Radio className="h-3 w-3 text-blue-600" />
                      Radio
                    </Button>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-50 pt-3 text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px]">Personnel</p>
                      <p className="font-semibold text-slate-700">{team.members} Rangers</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Avg Response</p>
                      <p className="font-semibold text-slate-700">{team.avgResponse}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Base Location</p>
                      <p className="font-semibold text-slate-700 truncate">{team.base}</p>
                    </div>
                  </div>

                  {activeIncidents.length > 0 && (
                    <div className="mt-3 rounded-lg bg-amber-50/70 border border-amber-100 p-2.5">
                      <p className="text-[11px] font-semibold text-amber-900 mb-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Active Incident ({activeIncidents.length}):
                      </p>
                      {activeIncidents.map((inc) => (
                        <div
                          key={inc.id}
                          onClick={() => {
                            if (onSelectIncident) {
                              onSelectIncident(inc);
                              onClose();
                            }
                          }}
                          className="cursor-pointer text-xs text-amber-800 hover:text-amber-950 underline truncate"
                        >
                          {inc.id} — {inc.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
