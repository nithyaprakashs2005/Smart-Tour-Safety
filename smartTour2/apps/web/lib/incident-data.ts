export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "reported" | "investigating" | "escalated" | "resolved" | "closed";
export type IncidentType =
  | "Injury / Fall"
  | "SOS Activation"
  | "Lost / Missing"
  | "Wildlife Encounter"
  | "Medical Emergency"
  | "Environmental Hazard"
  | "Device Failure"
  | "Security"
  | "Evacuation";

export interface InvolvedTourist {
  id: string;
  name: string;
  status: "safe" | "injured" | "missing" | "evacuated";
}

export interface TimelineEvent {
  time: string;
  actor: string;
  action: string;
  note?: string;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  coordinates: { lat: number; lng: number };
  reportedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  reportedBy: string;
  assignedTeam: string;
  leadInvestigator?: string;
  involvedTourists: InvolvedTourist[];
  description: string;
  rootCause?: string;
  resolution?: string;
  timeline: TimelineEvent[];
  documents?: number;
}

export const incidents: Incident[] = [];
