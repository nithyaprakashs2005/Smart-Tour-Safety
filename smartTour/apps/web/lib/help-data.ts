export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "technical" | "account" | "billing" | "feature_request" | "bug" | "training";

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  views: number;
  lastUpdated: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: {
    from: "user" | "support";
    name: string;
    text: string;
    time: string;
  }[];
}

export interface SupportContact {
  channel: string;
  value: string;
  icon: string;
  availability: string;
  responseTime: string;
}

export const helpStats = {
  openTickets: 5,
  resolvedToday: 8,
  avgResponse: "2h 15m",
  totalArticles: 42,
  satisfaction: "94%",
  activeUsers: 18,
};

export const articles: HelpArticle[] = [
  {
    id: "ART-001",
    title: "Getting Started with TourGuard Dashboard",
    category: "Getting Started",
    excerpt: "Learn the basics of navigating the dashboard, understanding metrics, and customizing your view.",
    readTime: "5 min",
    views: 1240,
    lastUpdated: "2025-05-01",
    tags: ["dashboard", "overview", "basics"],
  },
  {
    id: "ART-002",
    title: "Setting Up Geofence Zones",
    category: "Geofences",
    excerpt: "Step-by-step guide to creating circular and polygon geofences, configuring breach rules, and setting auto-lockdown.",
    readTime: "8 min",
    views: 892,
    lastUpdated: "2025-04-20",
    tags: ["geofences", "zones", "safety"],
  },
  {
    id: "ART-003",
    title: "Managing Alert Escalation",
    category: "Alerts",
    excerpt: "Configure automatic escalation rules, response team assignments, and emergency broadcast workflows.",
    readTime: "6 min",
    views: 756,
    lastUpdated: "2025-04-15",
    tags: ["alerts", "escalation", "automation"],
  },
  {
    id: "ART-004",
    title: "Device Fleet Management",
    category: "Devices",
    excerpt: "Register new devices, update firmware, monitor battery health, and troubleshoot connectivity issues.",
    readTime: "10 min",
    views: 634,
    lastUpdated: "2025-05-10",
    tags: ["devices", "firmware", "troubleshooting"],
  },
  {
    id: "ART-005",
    title: "Incident Reporting Best Practices",
    category: "Incidents",
    excerpt: "How to properly document incidents, attach evidence, and generate compliance-ready reports.",
    readTime: "7 min",
    views: 521,
    lastUpdated: "2025-03-28",
    tags: ["incidents", "reporting", "compliance"],
  },
  {
    id: "ART-006",
    title: "User Roles and Permissions",
    category: "Administration",
    excerpt: "Understanding the role hierarchy, assigning permissions, and managing team access control.",
    readTime: "4 min",
    views: 489,
    lastUpdated: "2025-05-05",
    tags: ["users", "roles", "permissions"],
  },
  {
    id: "ART-007",
    title: "API Integration Guide",
    category: "Developers",
    excerpt: "Complete reference for REST API endpoints, authentication, webhooks, and rate limits.",
    readTime: "15 min",
    views: 312,
    lastUpdated: "2025-04-01",
    tags: ["api", "integration", "developers"],
  },
  {
    id: "ART-008",
    title: "Troubleshooting Map Display Issues",
    category: "Technical",
    excerpt: "Common Mapbox rendering problems, token configuration, and fallback map options.",
    readTime: "6 min",
    views: 445,
    lastUpdated: "2025-05-12",
    tags: ["map", "technical", "troubleshooting"],
  },
];

export const faqs: FAQ[] = [
  {
    id: "FAQ-001",
    question: "How do I reset my password?",
    answer: "Go to Settings > Security > Change Password. If you've forgotten your password, click 'Forgot Password' on the login screen and follow the email instructions. For security, password reset links expire after 1 hour.",
    category: "Account",
    helpful: 45,
    notHelpful: 2,
  },
  {
    id: "FAQ-002",
    question: "What happens when a tourist presses the SOS button?",
    answer: "When SOS is activated, the system immediately: (1) Logs the alert with GPS coordinates, (2) Notifies the nearest response team, (3) Sends an emergency broadcast to all on-duty rangers, (4) Opens a direct communication channel with the tourist, and (5) Begins continuous location tracking until resolved.",
    category: "Alerts",
    helpful: 67,
    notHelpful: 1,
  },
  {
    id: "FAQ-003",
    question: "Can I export data for external analysis?",
    answer: "Yes. Navigate to Analytics > Export Report or use the Export button on any table. Supported formats include PDF, CSV, XLSX, and KML for geographic data. Scheduled exports can be configured in Reports > Schedule.",
    category: "Data",
    helpful: 34,
    notHelpful: 3,
  },
  {
    id: "FAQ-004",
    question: "How accurate is the GPS tracking?",
    answer: "TourGuard devices use multi-band GPS with typical accuracy of ±3 meters in open terrain. Accuracy may decrease to ±10 meters in dense forest or deep valleys. The system automatically flags low-accuracy readings for manual verification.",
    category: "Devices",
    helpful: 28,
    notHelpful: 5,
  },
  {
    id: "FAQ-005",
    question: "What is the difference between an Alert and an Incident?",
    answer: "An Alert is an automated system notification (e.g., geofence breach, low battery). An Incident is a formal case created when human judgment determines an Alert requires investigation, documentation, and coordinated response. All Incidents start as Alerts, but not all Alerts become Incidents.",
    category: "General",
    helpful: 52,
    notHelpful: 0,
  },
  {
    id: "FAQ-006",
    question: "How do I add a new response team member?",
    answer: "Go to Users & Roles > Invite User. Enter their email, select the 'Ranger' or 'Operator' role, and send the invitation. They will receive a setup link valid for 7 days. For bulk additions, use the CSV import option.",
    category: "Administration",
    helpful: 19,
    notHelpful: 1,
  },
  {
    id: "FAQ-007",
    question: "Why did my report generation fail?",
    answer: "Common causes: (1) Mapbox token expired — renew in Integrations, (2) Weather API timeout — retry after 5 minutes, (3) Date range too large — limit to 90 days, (4) Insufficient permissions — contact your Admin. Check Reports > Failed for specific error codes.",
    category: "Technical",
    helpful: 41,
    notHelpful: 4,
  },
  {
    id: "FAQ-008",
    question: "Can tourists communicate back through the device?",
    answer: "Yes. TourGuard Pro X2 devices support two-way voice and text messaging. Tourists can reply to check-ins, confirm safety status, or request assistance. Lite models support one-way acknowledgment buttons only.",
    category: "Communication",
    helpful: 23,
    notHelpful: 2,
  },
];

export const tickets: Ticket[] = [
  {
    id: "TKT-2025-042",
    subject: "Map not loading on Live Map page",
    description: "The map tiles are not rendering. Getting a blank gray screen with 'Mapbox token expired' error in console.",
    category: "technical",
    priority: "high",
    status: "in_progress",
    createdBy: "Priya Nair",
    createdByEmail: "priya.nair@tourguard.io",
    assignedTo: "Sarah Kim",
    createdAt: "2025-05-20T09:15:00",
    updatedAt: "2025-05-20T09:45:00",
    messages: [
      { from: "user", name: "Priya Nair", text: "Map not loading on the Live Map page. Just a gray screen.", time: "09:15 AM" },
      { from: "support", name: "Sarah Kim", text: "Checking your Mapbox token. Can you confirm if this is happening on all browsers?", time: "09:30 AM" },
      { from: "user", name: "Priya Nair", text: "Yes, tested on Chrome and Safari. Same issue.", time: "09:35 AM" },
      { from: "support", name: "Sarah Kim", text: "Found it — your token expired yesterday. I've rotated it. Please refresh and confirm.", time: "09:45 AM" },
    ],
  },
  {
    id: "TKT-2025-041",
    subject: "Request: Bulk tourist import via CSV",
    description: "We have 50 new tourists arriving next week. Need ability to bulk import instead of adding one by one.",
    category: "feature_request",
    priority: "medium",
    status: "waiting",
    createdBy: "Commander Arjun Mehta",
    createdByEmail: "arjun.mehta@tourguard.io",
    assignedTo: "Product Team",
    createdAt: "2025-05-19T14:00:00",
    updatedAt: "2025-05-20T10:00:00",
    messages: [
      { from: "user", name: "Arjun Mehta", text: "Can we get a CSV bulk import for tourists? 50 arrivals next Monday.", time: "May 19, 2:00 PM" },
      { from: "support", name: "Product Team", text: "This is on our Q3 roadmap. As a workaround, I can provide an API script. Would that help?", time: "May 20, 10:00 AM" },
    ],
  },
  {
    id: "TKT-2025-040",
    subject: "Device T033 not updating location",
    description: "Device shows last update 45 minutes ago but tourist is active. Battery at 76%.",
    category: "technical",
    priority: "high",
    status: "resolved",
    createdBy: "Ranger Mike Chen",
    createdByEmail: "mike.chen@tourguard.io",
    assignedTo: "Sarah Kim",
    createdAt: "2025-05-20T08:00:00",
    updatedAt: "2025-05-20T08:30:00",
    resolvedAt: "2025-05-20T08:30:00",
    messages: [
      { from: "user", name: "Mike Chen", text: "T033 location stuck. Tourist is moving but no updates.", time: "08:00 AM" },
      { from: "support", name: "Sarah Kim", text: "GPS module was stuck in sleep mode. Pushed a remote wake command. Updates resumed at 08:28.", time: "08:30 AM" },
    ],
  },
  {
    id: "TKT-2025-039",
    subject: "Billing question: Pro vs Lite device pricing",
    description: "Need clarification on device pricing tiers and volume discounts for 100+ units.",
    category: "billing",
    priority: "low",
    status: "open",
    createdBy: "Admin",
    createdByEmail: "admin@tourguard.io",
    createdAt: "2025-05-18T11:00:00",
    updatedAt: "2025-05-18T11:00:00",
    messages: [
      { from: "user", name: "Admin", text: "What are the volume discounts for 100+ Pro X2 devices?", time: "May 18, 11:00 AM" },
    ],
  },
  {
    id: "TKT-2025-038",
    subject: "Training session request for new rangers",
    description: "5 new rangers joining next week. Need a 2-hour training on dashboard usage and emergency protocols.",
    category: "training",
    priority: "medium",
    status: "in_progress",
    createdBy: "Lakshmi Iyer",
    createdByEmail: "lakshmi.iyer@tourguard.io",
    assignedTo: "Training Dept",
    createdAt: "2025-05-17T10:00:00",
    updatedAt: "2025-05-19T16:00:00",
    messages: [
      { from: "user", name: "Lakshmi Iyer", text: "Need training for 5 new rangers. Available slots next week?", time: "May 17, 10:00 AM" },
      { from: "support", name: "Training Dept", text: "We have slots on Tuesday 2PM and Thursday 10AM. Which works better?", time: "May 19, 4:00 PM" },
    ],
  },
  {
    id: "TKT-2025-037",
    subject: "False alert suppression for known safe zones",
    description: "Getting repeated geofence breach alerts for the staff rest area. Should be whitelisted.",
    category: "bug",
    priority: "medium",
    status: "resolved",
    createdBy: "David Okafor",
    createdByEmail: "david.okafor@tourguard.io",
    assignedTo: "Sarah Kim",
    createdAt: "2025-05-16T09:00:00",
    updatedAt: "2025-05-16T10:00:00",
    resolvedAt: "2025-05-16T10:00:00",
    messages: [
      { from: "user", name: "David Okafor", text: "Staff rest area triggers alerts. Can we whitelist it?", time: "May 16, 9:00 AM" },
      { from: "support", name: "Sarah Kim", text: "Added internal_staff zone with suppress_alerts flag. Resolved.", time: "May 16, 10:00 AM" },
    ],
  },
];

export const supportContacts: SupportContact[] = [
  {
    channel: "Emergency Hotline",
    value: "+91 1800-TOUR-911",
    icon: "Phone",
    availability: "24/7",
    responseTime: "Immediate",
  },
  {
    channel: "Technical Support",
    value: "tech@tourguard.io",
    icon: "Mail",
    availability: "Mon–Sat, 08:00–20:00 IST",
    responseTime: "Under 2 hours",
  },
  {
    channel: "Live Chat",
    value: "Available in-app",
    icon: "MessageSquare",
    availability: "Mon–Fri, 09:00–18:00 IST",
    responseTime: "Under 5 minutes",
  },
  {
    channel: "Documentation",
    value: "docs.tourguard.io",
    icon: "BookOpen",
    availability: "24/7",
    responseTime: "Self-service",
  },
];