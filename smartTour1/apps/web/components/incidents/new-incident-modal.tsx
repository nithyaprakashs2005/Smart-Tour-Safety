"use client";

import { useState } from "react";
import { X, AlertTriangle, Shield, MapPin, User, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type Incident,
  type IncidentSeverity,
  type IncidentStatus,
  type IncidentType,
} from "@/lib/incident-data";

const incidentTypes: IncidentType[] = [
  "Injury / Fall",
  "SOS Activation",
  "Lost / Missing",
  "Wildlife Encounter",
  "Medical Emergency",
  "Environmental Hazard",
  "Device Failure",
  "Security",
  "Evacuation",
];

const availableTeams = [
  "Search & Rescue Alpha",
  "Response Team Beta",
  "Ranger Unit 3",
  "Medical Response Team",
  "Tech Support + Field Ops",
  "Security Unit",
];

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (incident: Incident) => void;
}

export default function NewIncidentModal({
  isOpen,
  onClose,
  onCreateIncident,
}: NewIncidentModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<IncidentType>("Injury / Fall");
  const [severity, setSeverity] = useState<IncidentSeverity>("high");
  const [status, setStatus] = useState<IncidentStatus>("investigating");
  const [location, setLocation] = useState("");
  const [assignedTeam, setAssignedTeam] = useState(availableTeams[0]);
  const [leadInvestigator, setLeadInvestigator] = useState("");
  const [touristName, setTouristName] = useState("");
  const [touristId, setTouristId] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !description) return;

    const nowIso = new Date().toISOString();
    const newId = `INC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newIncident: Incident = {
      id: newId,
      title,
      type,
      severity,
      status,
      location,
      coordinates: { lat: 30.70 + Math.random() * 0.05, lng: 79.45 + Math.random() * 0.05 },
      reportedAt: nowIso,
      updatedAt: nowIso,
      reportedBy: "Operator (Manual Entry)",
      assignedTeam: assignedTeam || "Emergency Response Team Alpha",
      leadInvestigator: leadInvestigator || undefined,
      involvedTourists: touristName
        ? [
            {
              id: touristId || `T${Math.floor(100 + Math.random() * 900)}`,
              name: touristName,
              status: severity === "critical" ? "injured" : "safe",
            },
          ]
        : [],
      description,
      timeline: [
        {
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          actor: "Operator",
          action: "Incident logged into TourGuard system",
          note: `Severity assigned: ${severity.toUpperCase()}`,
        },
      ],
      documents: 0,
    };

    onCreateIncident(newIncident);
    onClose();
    
    // Reset form
    setTitle("");
    setLocation("");
    setTouristName("");
    setTouristId("");
    setLeadInvestigator("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Log New Incident</h3>
              <p className="text-xs text-slate-500">Record a safety incident and deploy response teams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Incident Title *
            </label>
            <Input
              required
              placeholder="e.g. Tourist Fall near Rocky Ridge Pass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Incident Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncidentType)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {incidentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
              >
                <option value="critical">Critical (Immediate Evac / Life-Threatening)</option>
                <option value="high">High (Urgent Response Needed)</option>
                <option value="medium">Medium (Standard Investigation)</option>
                <option value="low">Low (Minor Advisory)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize"
              >
                <option value="reported">Reported (Awaiting Dispatch)</option>
                <option value="investigating">Investigating (Team Dispatched)</option>
                <option value="escalated">Escalated (Command Level)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Location / Zone *
              </label>
              <Input
                required
                placeholder="e.g. Lakeview Park, Zone B"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assigned Team
              </label>
              <select
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {availableTeams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Lead Investigator (Optional)
              </label>
              <Input
                placeholder="e.g. Ranger Mike Chen"
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Involved Tourist Name
              </label>
              <Input
                placeholder="e.g. James Wilson"
                value={touristName}
                onChange={(e) => setTouristName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tourist ID
              </label>
              <Input
                placeholder="e.g. T003"
                value={touristId}
                onChange={(e) => setTouristId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Incident Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide full initial details, vitals, environmental factors, or tourist condition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Log Incident Case
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
