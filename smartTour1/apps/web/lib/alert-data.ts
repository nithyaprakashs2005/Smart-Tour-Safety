export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved" | "escalated";
export type AlertType =
  | "Fall Detected"
  | "SOS Activated"
  | "Outside Safe Zone"
  | "Low Battery"
  | "No Signal"
  | "Panic Button"
  | "Man Down"
  | "Speeding";

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
  battery?: number;
}

export const alertStats = {
  total: 24,
  critical: 3,
  high: 5,
  medium: 10,
  low: 6,
  active: 8,
  acknowledged: 6,
  resolvedToday: 10,
  avgResponseTime: "4m 12s",
};

export const alerts: Alert[] = [
  {
    id: "ALT-2025-001",
    touristId: "T024",
    touristName: "Neha Verma",
    type: "Fall Detected",
    severity: "critical",
    status: "active",
    description: "No movement for 45 seconds. Accelerometer detected sudden impact.",
    location: "Near Hill Top Trail, Sector 4",
    coordinates: { lat: 30.71, lng: 79.44 },
    timestamp: "2025-05-20T10:22:00",
    heartRate: 138,
    battery: 76,
  },
  {
    id: "ALT-2025-002",
    touristId: "T045",
    touristName: "Arjun Mehta",
    type: "SOS Activated",
    severity: "critical",
    status: "active",
    description: "Physical SOS button pressed by tourist.",
    location: "River Side Camp, Zone B",
    coordinates: { lat: 30.65, lng: 79.47 },
    timestamp: "2025-05-20T10:16:00",
    battery: 60,
  },
  {
    id: "ALT-2025-003",
    touristId: "T087",
    touristName: "Priya Nair",
    type: "Outside Safe Zone",
    severity: "high",
    status: "acknowledged",
    description: "Exited designated safe zone boundary 12 minutes ago.",
    location: "North Forest Area",
    coordinates: { lat: 30.74, lng: 79.49 },
    timestamp: "2025-05-20T10:18:00",
    assignedTo: "Response Team Alpha",
    heartRate: 95,
    battery: 82,
  },
  {
    id: "ALT-2025-004",
    touristId: "T018",
    touristName: "Vikram Singh",
    type: "Man Down",
    severity: "high",
    status: "active",
    description: "Device orientation horizontal for 90+ seconds with no motion.",
    location: "Hill Top Trail, Checkpoint 3",
    coordinates: { lat: 30.71, lng: 79.44 },
    timestamp: "2025-05-20T10:10:00",
    heartRate: 102,
    battery: 45,
  },
  {
    id: "ALT-2025-005",
    touristId: "T091",
    touristName: "Sarah Johnson",
    type: "Low Battery",
    severity: "medium",
    status: "resolved",
    description: "Device battery dropped below 15%. Tourist notified to return to base.",
    location: "Lakeview Park",
    coordinates: { lat: 30.68, lng: 79.50 },
    timestamp: "2025-05-20T09:45:00",
    resolvedAt: "2025-05-20T09:52:00",
    battery: 12,
  },
  {
    id: "ALT-2025-006",
    touristId: "T033",
    touristName: "Ravi Kumar",
    type: "No Signal",
    severity: "medium",
    status: "active",
    description: "GPS and cellular signal lost for 8 minutes. Last known position recorded.",
    location: "Eagle Peak Base",
    coordinates: { lat: 30.73, lng: 79.52 },
    timestamp: "2025-05-20T10:05:00",
    battery: 88,
  },
  {
    id: "ALT-2025-007",
    touristId: "T056",
    touristName: "Ananya Desai",
    type: "Panic Button",
    severity: "high",
    status: "escalated",
    description: "Panic button triggered. Tourist reported feeling threatened by wildlife.",
    location: "Sunset View Point",
    coordinates: { lat: 30.75, lng: 79.45 },
    timestamp: "2025-05-20T10:00:00",
    assignedTo: "Ranger Unit 3",
    heartRate: 125,
    battery: 91,
  },
  {
    id: "ALT-2025-008",
    touristId: "T012",
    touristName: "David Chen",
    type: "Speeding",
    severity: "low",
    status: "resolved",
    description: "Vehicle speed exceeded 40km/h in pedestrian zone.",
    location: "Main Access Road",
    coordinates: { lat: 30.70, lng: 79.48 },
    timestamp: "2025-05-20T09:30:00",
    resolvedAt: "2025-05-20T09:35:00",
  },
  {
    id: "ALT-2025-009",
    touristId: "T067",
    touristName: "Fatima Al-Rashid",
    type: "Outside Safe Zone",
    severity: "medium",
    status: "acknowledged",
    description: "Left geofenced camping area after curfew hours.",
    location: "Pine Trail Junction",
    coordinates: { lat: 30.72, lng: 79.48 },
    timestamp: "2025-05-20T09:50:00",
    assignedTo: "Response Team Beta",
    battery: 67,
  },
  {
    id: "ALT-2025-010",
    touristId: "T003",
    touristName: "James Wilson",
    type: "Fall Detected",
    severity: "critical",
    status: "active",
    description: "Hard fall detected. No response to device check-in prompt.",
    location: "Rocky Ridge Pass",
    coordinates: { lat: 30.69, lng: 79.46 },
    timestamp: "2025-05-20T10:25:00",
    heartRate: 142,
    battery: 33,
  },
  {
    id: "ALT-2025-011",
    touristId: "T077",
    touristName: "Lakshmi Iyer",
    type: "Low Battery",
    severity: "low",
    status: "active",
    description: "Battery at 18%. Automated power-saving mode activated.",
    location: "Hilltop Museum",
    coordinates: { lat: 30.70, lng: 79.42 },
    timestamp: "2025-05-20T10:20:00",
    battery: 18,
  },
  {
    id: "ALT-2025-012",
    touristId: "T029",
    touristName: "Mohammed Ali",
    type: "SOS Activated",
    severity: "high",
    status: "resolved",
    description: "False alarm. Tourist accidentally triggered SOS while adjusting backpack.",
    location: "Camp Area 2",
    coordinates: { lat: 30.66, lng: 79.51 },
    timestamp: "2025-05-20T09:15:00",
    resolvedAt: "2025-05-20T09:18:00",
    notes: "Confirmed false alarm via voice call.",
  },
];