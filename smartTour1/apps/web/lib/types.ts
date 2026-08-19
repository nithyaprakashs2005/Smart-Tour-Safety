// Unified Data Types for Global State Management

export type TouristStatus = "active" | "idle" | "emergency" | "offline";
export type AlertStatus = "active" | "acknowledged" | "resolved" | "false_alarm";
export type IncidentStatus = "active" | "investigating" | "resolved" | "closed";
export type DeviceStatus = "online" | "offline" | "low_battery" | "maintenance";
export type GeofenceStatus = "active" | "inactive" | "maintenance";
export type MessageStatus = "sent" | "delivered" | "read" | "failed" | "pending";
export type Priority = "low" | "normal" | "high" | "critical";
export type MessageType = "broadcast" | "direct" | "emergency" | "group" | "auto";
export type TimeRange = "today" | "last_7_days" | "last_30_days" | "custom";

export interface Tourist {
  id: string;
  name: string;
  status: TouristStatus;
  location: { lat: number; lng: number };
  lastSeen: string;
  deviceId: string;
  emergencyContact?: string;
  medicalInfo?: string;
  currentZone?: string;
}

export interface Alert {
  id: string;
  type: "geofence_breach" | "sos" | "low_battery" | "device_offline" | "medical" | "weather";
  priority: Priority;
  status: AlertStatus;
  touristId?: string;
  deviceId?: string;
  location: { lat: number; lng: number };
  message: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface Incident {
  id: string;
  type: "medical" | "lost_person" | "equipment" | "wildlife" | "other";
  status: IncidentStatus;
  priority: Priority;
  touristId?: string;
  location: { lat: number; lng: number };
  description: string;
  reportedAt: string;
  reportedBy: string;
  assignedTeam?: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface Device {
  id: string;
  model: string;
  status: DeviceStatus;
  batteryLevel: number;
  lastSeen: string;
  assignedTouristId?: string;
  firmwareVersion: string;
  signalStrength: number;
  location?: { lat: number; lng: number };
}

export interface Geofence {
  id: string;
  name: string;
  status: GeofenceStatus;
  type: "circle" | "polygon";
  coordinates: { lat: number; lng: number }[];
  radius?: number;
  maxCapacity?: number;
  currentOccupancy: number;
  breachCount24h: number;
  autoLockdown: boolean;
  rules: string[];
}

export interface Message {
  id: string;
  type: MessageType;
  priority: Priority;
  sender: string;
  senderRole: string;
  recipients: string[];
  recipientCount: number;
  subject: string;
  body: string;
  sentAt: string;
  status: MessageStatus;
  readCount?: number;
  replyCount?: number;
  channel: "push" | "sms" | "email" | "in-app" | "all";
}

export interface Report {
  id: string;
  title: string;
  type: string;
  status: "ready" | "generating" | "scheduled" | "failed";
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  format: "pdf" | "csv" | "xlsx" | "kml";
  pages?: number;
  records?: number;
  description: string;
  coverDate: string;
  downloadUrl?: string;
  sections: string[];
}

export interface Conversation {
  id: string;
  touristId: string;
  touristName: string;
  touristStatus: TouristStatus;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: {
    id: string;
    from: "tourist" | "admin";
    text: string;
    time: string;
    status: MessageStatus;
  }[];
}

export interface FilterState {
  timeRange: TimeRange;
  customDateRange?: { start: string; end: string };
  regions: string[];
  deviceModels: string[];
  severity: string[];
  zones: string[];
}

export interface GlobalState {
  // Data Collections
  tourists: Tourist[];
  alerts: Alert[];
  incidents: Incident[];
  devices: Device[];
  geofences: Geofence[];
  messages: Message[];
  reports: Report[];
  conversations: Conversation[];
  
  // Filter State
  filters: FilterState;
  
  // UI State
  selectedTouristId: string | null;
  selectedAlertId: string | null;
  selectedIncidentId: string | null;
  selectedDeviceId: string | null;
  selectedGeofenceId: string | null;
  
  // Actions
  addTourist: (tourist: Tourist) => void;
  updateTourist: (id: string, updates: Partial<Tourist>) => void;
  deleteTourist: (id: string) => void;
  
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  acknowledgeAlert: (id: string, acknowledgedBy: string) => void;
  resolveAlert: (id: string) => void;
  
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  resolveIncident: (id: string, resolution: string) => void;
  
  addDevice: (device: Device) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  
  addGeofence: (geofence: Geofence) => void;
  updateGeofence: (id: string, updates: Partial<Geofence>) => void;
  deleteGeofence: (id: string) => void;
  
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  
  // Filter Actions
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Selection Actions
  setSelectedTouristId: (id: string | null) => void;
  setSelectedAlertId: (id: string | null) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setSelectedDeviceId: (id: string | null) => void;
  setSelectedGeofenceId: (id: string | null) => void;
  
  // Bulk State Setters
  setTourists: (tourists: Tourist[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setIncidents: (incidents: Incident[]) => void;
  setDevices: (devices: Device[]) => void;
  setGeofences: (geofences: Geofence[]) => void;
  setMessages: (messages: Message[]) => void;
  setReports: (reports: Report[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  seedToFirebase: () => Promise<{ success: boolean; count: number; message: string }>;

  // Quick Actions
  triggerSOS: (touristId: string, location: { lat: number; lng: number }) => void;
  broadcastEmergencyAlert: (message: string, recipients: string[]) => void;
}