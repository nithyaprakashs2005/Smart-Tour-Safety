export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  loginIp: string;
}

export interface NotificationSetting {
  id: string;
  category: string;
  description: string;
  push: boolean;
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface SystemSetting {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "number" | "select" | "text";
  value: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface SecurityLog {
  id: string;
  event: string;
  ip: string;
  location: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
  device: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
  active: boolean;
}

export const adminProfile: AdminProfile = {
  id: "ADM-001",
  name: "System Administrator",
  email: "admin@tourguard.io",
  phone: "+91 98765 43210",
  role: "System Administrator",
  department: "Operations Command",
  avatar: "",
  timezone: "Asia/Kolkata (GMT+5:30)",
  language: "English (US)",
  twoFactorEnabled: true,
  lastLogin: "2025-05-20T10:00:00",
  loginIp: "203.192.12.45",
};

export const notificationSettings: NotificationSetting[] = [
  {
    id: "notif-001",
    category: "Emergency Alerts",
    description: "Critical incidents requiring immediate response",
    push: true,
    email: true,
    sms: true,
    inApp: true,
  },
  {
    id: "notif-002",
    category: "Geofence Breaches",
    description: "Tourists exiting or entering restricted zones",
    push: true,
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "notif-003",
    category: "Device Health Warnings",
    description: "Low battery, signal loss, or hardware failures",
    push: true,
    email: false,
    sms: false,
    inApp: true,
  },
  {
    id: "notif-004",
    category: "Daily Summary Reports",
    description: "Automated end-of-day operational summary",
    push: false,
    email: true,
    sms: false,
    inApp: false,
  },
  {
    id: "notif-005",
    category: "Tourist Check-ins",
    description: "Automated tourist status confirmations",
    push: false,
    email: false,
    sms: false,
    inApp: true,
  },
  {
    id: "notif-006",
    category: "System Maintenance",
    description: "Scheduled downtime and update notifications",
    push: true,
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "notif-007",
    category: "Team Performance Alerts",
    description: "Response time thresholds and team metrics",
    push: false,
    email: true,
    sms: false,
    inApp: false,
  },
  {
    id: "notif-008",
    category: "Weather Warnings",
    description: "Severe weather and environmental hazard alerts",
    push: true,
    email: true,
    sms: true,
    inApp: true,
  },
];

export const systemSettings: SystemSetting[] = [
  {
    id: "sys-001",
    label: "Auto-refresh Interval",
    description: "Dashboard data refresh rate in seconds",
    type: "number",
    value: 30,
    min: 5,
    max: 300,
  },
  {
    id: "sys-002",
    label: "Alert Auto-escalation",
    description: "Automatically escalate alerts after timeout",
    type: "toggle",
    value: true,
  },
  {
    id: "sys-003",
    label: "Geofence Check Interval",
    description: "How often to validate tourist positions",
    type: "select",
    value: "15s",
    options: ["5s", "10s", "15s", "30s", "1m", "5m"],
  },
  {
    id: "sys-004",
    label: "Data Retention Period",
    description: "Days to keep historical tourist data",
    type: "select",
    value: "90 days",
    options: ["30 days", "60 days", "90 days", "180 days", "1 year"],
  },
  {
    id: "sys-005",
    label: "Emergency Broadcast Mode",
    description: "Allow one-click alerts to all channels",
    type: "toggle",
    value: true,
  },
  {
    id: "sys-006",
    label: "Map Default Zoom",
    description: "Initial zoom level for live map view",
    type: "number",
    value: 12,
    min: 8,
    max: 18,
  },
  {
    id: "sys-007",
    label: "Offline Sync",
    description: "Queue actions when connection is lost",
    type: "toggle",
    value: true,
  },
  {
    id: "sys-008",
    label: "Audit Logging",
    description: "Record all admin actions for compliance",
    type: "toggle",
    value: true,
  },
  {
    id: "sys-009",
    label: "Tourist Inactivity Timeout",
    description: "Minutes before marking tourist as inactive",
    type: "number",
    value: 10,
    min: 5,
    max: 60,
  },
  {
    id: "sys-010",
    label: "Default Language",
    description: "Interface language for new users",
    type: "select",
    value: "English",
    options: ["English", "Hindi", "Spanish", "French", "German", "Japanese"],
  },
];

export const securityLogs: SecurityLog[] = [
  {
    id: "LOG-001",
    event: "Login successful",
    ip: "203.192.12.45",
    location: "Mumbai, India",
    timestamp: "2025-05-20T10:00:00",
    status: "success",
    device: "Chrome 124 / macOS",
  },
  {
    id: "LOG-002",
    event: "Password changed",
    ip: "203.192.12.45",
    location: "Mumbai, India",
    timestamp: "2025-05-19T14:30:00",
    status: "success",
    device: "Chrome 124 / macOS",
  },
  {
    id: "LOG-003",
    event: "Failed login attempt",
    ip: "185.220.101.38",
    location: "Frankfurt, Germany",
    timestamp: "2025-05-18T03:22:00",
    status: "failed",
    device: "Firefox 125 / Windows",
  },
  {
    id: "LOG-004",
    event: "2FA verification",
    ip: "203.192.12.45",
    location: "Mumbai, India",
    timestamp: "2025-05-20T10:01:00",
    status: "success",
    device: "Chrome 124 / macOS",
  },
  {
    id: "LOG-005",
    event: "API key generated",
    ip: "203.192.12.45",
    location: "Mumbai, India",
    timestamp: "2025-05-17T09:15:00",
    status: "success",
    device: "Chrome 124 / macOS",
  },
  {
    id: "LOG-006",
    event: "Suspicious activity detected",
    ip: "198.51.100.42",
    location: "Unknown",
    timestamp: "2025-05-16T22:10:00",
    status: "warning",
    device: "Unknown / Linux",
  },
];

export const apiKeys: ApiKey[] = [
  {
    id: "KEY-001",
    name: "Production Mapbox Integration",
    key: "pk.tg_prod_8f3a...9c2e",
    createdAt: "2025-01-15T08:00:00",
    lastUsed: "2025-05-20T10:24:00",
    permissions: ["read:geofences", "read:tourists", "write:alerts"],
    active: true,
  },
  {
    id: "KEY-002",
    name: "Mobile App Sync",
    key: "pk.tg_mobile_2b7d...4f1a",
    createdAt: "2025-03-10T12:00:00",
    lastUsed: "2025-05-20T10:20:00",
    permissions: ["read:tourists", "write:locations", "read:devices"],
    active: true,
  },
  {
    id: "KEY-003",
    name: "Weather Service Hook",
    key: "pk.tg_weather_9e1c...7d3b",
    createdAt: "2025-04-01T09:00:00",
    lastUsed: "2025-05-20T08:05:00",
    permissions: ["read:weather", "write:alerts"],
    active: true,
  },
  {
    id: "KEY-004",
    name: "Legacy Device Gateway",
    key: "pk.tg_legacy_4a2f...1e8d",
    createdAt: "2024-12-01T10:00:00",
    lastUsed: "2025-05-15T16:30:00",
    permissions: ["read:devices", "write:status"],
    active: false,
  },
];