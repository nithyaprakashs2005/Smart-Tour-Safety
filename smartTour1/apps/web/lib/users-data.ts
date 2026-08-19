export type UserStatus = "active" | "inactive" | "pending" | "locked";
export type UserRole = "super_admin" | "admin" | "operator" | "ranger" | "viewer";

export interface Permission {
  id: string;
  label: string;
  description: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  lastActive: string;
  joinedAt: string;
  lastLoginIp: string;
  twoFactorEnabled: boolean;
  loginCount: number;
  recentActivity: { time: string; action: string; detail: string }[];
}

export interface PendingInvite {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired";
}

export const userStats = {
  total: 24,
  active: 19,
  inactive: 2,
  pending: 2,
  locked: 1,
  roles: 5,
  onlineNow: 8,
};

export const permissions: Permission[] = [
  { id: "read:overview", label: "View Dashboard", description: "Access main dashboard and metrics" },
  { id: "read:live_map", label: "View Live Map", description: "Access real-time tourist tracking" },
  { id: "read:tourists", label: "View Tourists", description: "Browse tourist directory and profiles" },
  { id: "write:tourists", label: "Manage Tourists", description: "Add, edit, and remove tourists" },
  { id: "read:alerts", label: "View Alerts", description: "Access alert feed and details" },
  { id: "write:alerts", label: "Manage Alerts", description: "Acknowledge, escalate, and resolve alerts" },
  { id: "read:incidents", label: "View Incidents", description: "Browse incident reports" },
  { id: "write:incidents", label: "Manage Incidents", description: "Create, assign, and close incidents" },
  { id: "read:geofences", label: "View Geofences", description: "View safety boundaries" },
  { id: "write:geofences", label: "Manage Geofences", description: "Create and edit geofence zones" },
  { id: "read:analytics", label: "View Analytics", description: "Access reports and dashboards" },
  { id: "write:analytics", label: "Export Data", description: "Download and schedule reports" },
  { id: "read:devices", label: "View Devices", description: "Monitor device fleet status" },
  { id: "write:devices", label: "Manage Devices", description: "Configure and update devices" },
  { id: "read:communication", label: "View Messages", description: "Read message history" },
  { id: "write:communication", label: "Send Messages", description: "Broadcast and direct messaging" },
  { id: "read:users", label: "View Users", description: "Browse user directory" },
  { id: "write:users", label: "Manage Users", description: "Invite, edit, and deactivate users" },
  { id: "read:settings", label: "View Settings", description: "Access system configuration" },
  { id: "write:settings", label: "Manage Settings", description: "Modify system parameters" },
];

export const roles: Role[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full system access. Can manage all users, settings, and configurations.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    userCount: 1,
    permissions: permissions.map((p) => p.id),
  },
  {
    id: "admin",
    name: "Admin",
    description: "Operational oversight. Can manage tourists, alerts, incidents, and view analytics.",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    userCount: 3,
    permissions: [
      "read:overview", "read:live_map", "read:tourists", "write:tourists",
      "read:alerts", "write:alerts", "read:incidents", "write:incidents",
      "read:geofences", "write:geofences", "read:analytics", "write:analytics",
      "read:devices", "read:communication", "write:communication",
      "read:users", "read:settings",
    ],
  },
  {
    id: "operator",
    name: "Operator",
    description: "Day-to-day monitoring. Can manage alerts, view tourists, and send communications.",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    userCount: 8,
    permissions: [
      "read:overview", "read:live_map", "read:tourists", "write:tourists",
      "read:alerts", "write:alerts", "read:incidents", "read:geofences",
      "read:analytics", "read:devices", "read:communication", "write:communication",
    ],
  },
  {
    id: "ranger",
    name: "Ranger",
    description: "Field operations. Can view assigned tourists, update locations, and respond to alerts.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    userCount: 10,
    permissions: [
      "read:overview", "read:live_map", "read:tourists", "read:alerts",
      "write:alerts", "read:incidents", "read:geofences", "read:communication",
      "write:communication",
    ],
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access. Can view dashboards and reports but cannot take actions.",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    userCount: 2,
    permissions: [
      "read:overview", "read:live_map", "read:tourists", "read:alerts",
      "read:incidents", "read:geofences", "read:analytics", "read:devices",
      "read:communication",
    ],
  },
];

export const users: User[] = [
  {
    id: "USR-001",
    name: "System Administrator",
    email: "admin@tourguard.io",
    phone: "+91 98765 43210",
    role: "super_admin",
    status: "active",
    department: "Operations Command",
    lastActive: "2025-05-20T10:24:00",
    joinedAt: "2024-01-15T08:00:00",
    lastLoginIp: "203.192.12.45",
    twoFactorEnabled: true,
    loginCount: 1247,
    recentActivity: [
      { time: "10:24 AM", action: "Login", detail: "Chrome / macOS" },
      { time: "10:15 AM", action: "Resolved incident", detail: "INC-2025-002" },
      { time: "09:45 AM", action: "Generated report", detail: "Daily Summary" },
    ],
  },
  {
    id: "USR-002",
    name: "Commander Arjun Mehta",
    email: "arjun.mehta@tourguard.io",
    phone: "+91 98765 43220",
    role: "admin",
    status: "active",
    department: "Field Operations",
    lastActive: "2025-05-20T10:20:00",
    joinedAt: "2024-02-01T09:00:00",
    lastLoginIp: "203.192.12.50",
    twoFactorEnabled: true,
    loginCount: 892,
    recentActivity: [
      { time: "10:20 AM", action: "Dispatched team", detail: "Response Team Alpha" },
      { time: "09:30 AM", action: "Updated geofence", detail: "GF-006" },
    ],
  },
  {
    id: "USR-003",
    name: "Ranger Mike Chen",
    email: "mike.chen@tourguard.io",
    phone: "+91 98765 43230",
    role: "ranger",
    status: "active",
    department: "Search & Rescue",
    lastActive: "2025-05-20T10:30:00",
    joinedAt: "2024-03-10T10:00:00",
    lastLoginIp: "203.192.12.55",
    twoFactorEnabled: false,
    loginCount: 634,
    recentActivity: [
      { time: "10:30 AM", action: "On scene", detail: "Rocky Ridge Pass" },
      { time: "10:28 AM", action: "Received alert", detail: "INC-2025-001" },
    ],
  },
  {
    id: "USR-004",
    name: "Dr. Aisha Patel",
    email: "aisha.patel@tourguard.io",
    phone: "+91 98765 43240",
    role: "ranger",
    status: "active",
    department: "Medical Response",
    lastActive: "2025-05-20T10:40:00",
    joinedAt: "2024-03-15T11:00:00",
    lastLoginIp: "203.192.12.60",
    twoFactorEnabled: true,
    loginCount: 521,
    recentActivity: [
      { time: "10:40 AM", action: "Stabilized patient", detail: "T003" },
      { time: "10:20 AM", action: "Dispatched", detail: "Rocky Ridge Pass" },
    ],
  },
  {
    id: "USR-005",
    name: "Priya Nair",
    email: "priya.nair@tourguard.io",
    phone: "+91 98765 43250",
    role: "operator",
    status: "active",
    department: "Control Room",
    lastActive: "2025-05-20T10:18:00",
    joinedAt: "2024-04-01T08:00:00",
    lastLoginIp: "203.192.12.65",
    twoFactorEnabled: true,
    loginCount: 445,
    recentActivity: [
      { time: "10:18 AM", action: "Acknowledged alert", detail: "T087 outside safe zone" },
      { time: "10:10 AM", action: "Sent broadcast", detail: "Weather warning" },
    ],
  },
  {
    id: "USR-006",
    name: "David Okafor",
    email: "david.okafor@tourguard.io",
    phone: "+91 98765 43260",
    role: "ranger",
    status: "active",
    department: "Ranger Unit 3",
    lastActive: "2025-05-20T10:22:00",
    joinedAt: "2024-04-20T09:00:00",
    lastLoginIp: "203.192.12.70",
    twoFactorEnabled: false,
    loginCount: 398,
    recentActivity: [
      { time: "10:22 AM", action: "Cleared area", detail: "Sunset View Point" },
      { time: "10:00 AM", action: "Wildlife encounter", detail: "Bear sighting" },
    ],
  },
  {
    id: "USR-007",
    name: "Sarah Kim",
    email: "sarah.kim@tourguard.io",
    phone: "+91 98765 43270",
    role: "operator",
    status: "active",
    department: "Tech Support",
    lastActive: "2025-05-20T10:15:00",
    joinedAt: "2024-05-01T10:00:00",
    lastLoginIp: "203.192.12.75",
    twoFactorEnabled: true,
    loginCount: 312,
    recentActivity: [
      { time: "10:15 AM", action: "Escalated incident", detail: "Device malfunction" },
      { time: "09:50 AM", action: "Remote diagnostic", detail: "12 devices" },
    ],
  },
  {
    id: "USR-008",
    name: "James O'Connor",
    email: "james.oconnor@tourguard.io",
    phone: "+91 98765 43280",
    role: "ranger",
    status: "inactive",
    department: "Ranger Unit 2",
    lastActive: "2025-05-18T16:30:00",
    joinedAt: "2024-05-15T08:00:00",
    lastLoginIp: "203.192.12.80",
    twoFactorEnabled: false,
    loginCount: 267,
    recentActivity: [
      { time: "May 18, 4:30 PM", action: "Shift ended", detail: "Eagle Peak patrol" },
    ],
  },
  {
    id: "USR-009",
    name: "Lakshmi Iyer",
    email: "lakshmi.iyer@tourguard.io",
    phone: "+91 98765 43290",
    role: "admin",
    status: "active",
    department: "Search & Rescue",
    lastActive: "2025-05-20T10:50:00",
    joinedAt: "2024-06-01T09:00:00",
    lastLoginIp: "203.192.12.85",
    twoFactorEnabled: true,
    loginCount: 189,
    recentActivity: [
      { time: "10:50 AM", action: "Visual contact", detail: "North Forest Group" },
      { time: "10:20 AM", action: "Mobilized team", detail: "Drone + ground unit" },
    ],
  },
  {
    id: "USR-010",
    name: "Rajesh Gupta",
    email: "rajesh.gupta@tourguard.io",
    phone: "+91 98765 43300",
    role: "ranger",
    status: "active",
    department: "Medical Response",
    lastActive: "2025-05-20T09:55:00",
    joinedAt: "2024-06-15T10:00:00",
    lastLoginIp: "203.192.12.90",
    twoFactorEnabled: true,
    loginCount: 156,
    recentActivity: [
      { time: "9:55 AM", action: "Airlift complete", detail: "T091 to hospital" },
    ],
  },
  {
    id: "USR-011",
    name: "Emma Wilson",
    email: "emma.wilson@tourguard.io",
    phone: "+44 7700 900200",
    role: "viewer",
    status: "active",
    department: "Compliance",
    lastActive: "2025-05-20T09:00:00",
    joinedAt: "2024-07-01T08:00:00",
    lastLoginIp: "198.51.100.10",
    twoFactorEnabled: false,
    loginCount: 89,
    recentActivity: [
      { time: "9:00 AM", action: "Viewed report", detail: "Weekly Safety Audit" },
    ],
  },
  {
    id: "USR-012",
    name: "Vikram Singh",
    email: "vikram.singh@tourguard.io",
    phone: "+91 98765 43310",
    role: "operator",
    status: "locked",
    department: "Control Room",
    lastActive: "2025-05-19T14:00:00",
    joinedAt: "2024-07-15T09:00:00",
    lastLoginIp: "203.192.12.95",
    twoFactorEnabled: false,
    loginCount: 134,
    recentActivity: [
      { time: "May 19, 2:00 PM", action: "Account locked", detail: "3 failed login attempts" },
    ],
  },
];

export const pendingInvites: PendingInvite[] = [
  {
    id: "INV-001",
    email: "new.ranger@tourguard.io",
    role: "ranger",
    invitedBy: "Admin",
    invitedAt: "2025-05-20T09:00:00",
    expiresAt: "2025-05-27T09:00:00",
    status: "pending",
  },
  {
    id: "INV-002",
    email: "analyst@external.com",
    role: "viewer",
    invitedBy: "Admin",
    invitedAt: "2025-05-19T10:00:00",
    expiresAt: "2025-05-26T10:00:00",
    status: "pending",
  },
];