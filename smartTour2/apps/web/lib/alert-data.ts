export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved" | "escalated";
export type AlertType = "ELEVATED_HEART_RATE" | "Fall Detected" | "SOS Activated" | "Outside Safe Zone" | "Low Battery" | "No Signal" | "Panic Button" | "VITAL_EMERGENCY";

export interface Alert {
  id: string;
  touristId: string;
  touristName: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  timestamp: string;
  assignedTo?: string;
  resolvedAt?: string;
  notes?: string;
  heartRate?: number;
  battery?: number | null;
}
