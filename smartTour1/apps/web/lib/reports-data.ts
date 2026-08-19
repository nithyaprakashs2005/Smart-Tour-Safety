export type ReportType = "daily_summary" | "incident_report" | "safety_audit" | "device_status" | "geofence_analysis" | "team_performance" | "tourist_activity" | "weather_log";
export type ReportStatus = "ready" | "generating" | "scheduled" | "failed";
export type ExportFormat = "pdf" | "csv" | "xlsx" | "kml";

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  fileSize: string;
  format: ExportFormat;
  pages?: number;
  records?: number;
  description: string;
  coverDate: string;
  downloadUrl?: string;
  sections: string[];
}

export interface ScheduledReport {
  id: string;
  title: string;
  type: ReportType;
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  nextRun: string;
  lastRun?: string;
  recipients: string[];
  format: ExportFormat;
  active: boolean;
}

export const reportStats = {
  totalGenerated: 156,
  thisWeek: 23,
  scheduled: 8,
  failed: 1,
  avgGenTime: "12s",
  storageUsed: "1.2 GB",
};

export const reportTemplates: { type: ReportType; label: string; description: string; icon: string; color: string; avgTime: string }[] = [
  {
    type: "daily_summary",
    label: "Daily Summary",
    description: "Complete overview of tourist activity, alerts, incidents, and system health for the day.",
    icon: "ClipboardList",
    color: "bg-blue-50 text-blue-600",
    avgTime: "8s",
  },
  {
    type: "incident_report",
    label: "Incident Report",
    description: "Detailed incident dossiers with timelines, involved parties, and resolution status.",
    icon: "ShieldAlert",
    color: "bg-red-50 text-red-600",
    avgTime: "15s",
  },
  {
    type: "safety_audit",
    label: "Safety Audit",
    description: "Compliance checklist, geofence effectiveness, and risk assessment documentation.",
    icon: "ShieldCheck",
    color: "bg-emerald-50 text-emerald-600",
    avgTime: "20s",
  },
  {
    type: "device_status",
    label: "Device Status",
    description: "Fleet health report including battery levels, signal strength, and firmware versions.",
    icon: "Watch",
    color: "bg-violet-50 text-violet-600",
    avgTime: "10s",
  },
  {
    type: "geofence_analysis",
    label: "Geofence Analysis",
    description: "Boundary breach patterns, zone utilization, and capacity trend analysis.",
    icon: "Hexagon",
    color: "bg-cyan-50 text-cyan-600",
    avgTime: "12s",
  },
  {
    type: "team_performance",
    label: "Team Performance",
    description: "Response time metrics, resolution rates, and individual ranger evaluations.",
    icon: "Users",
    color: "bg-amber-50 text-amber-600",
    avgTime: "14s",
  },
  {
    type: "tourist_activity",
    label: "Tourist Activity",
    description: "Trail usage, peak times, demographic breakdowns, and satisfaction scores.",
    icon: "Footprints",
    color: "bg-pink-50 text-pink-600",
    avgTime: "18s",
  },
  {
    type: "weather_log",
    label: "Weather Log",
    description: "Environmental conditions, hazard warnings, and impact on operations.",
    icon: "CloudSun",
    color: "bg-sky-50 text-sky-600",
    avgTime: "6s",
  },
];

export const generatedReports: Report[] = [
  {
    id: "RPT-2025-156",
    title: "Daily Operations Summary — May 20, 2025",
    type: "daily_summary",
    status: "ready",
    generatedAt: "2025-05-20T10:30:00",
    generatedBy: "System (Auto)",
    fileSize: "2.4 MB",
    format: "pdf",
    pages: 12,
    records: 127,
    description: "Comprehensive daily overview including 127 active tourists, 8 alerts, 3 incidents, and 4 geofence breaches.",
    coverDate: "May 20, 2025",
    sections: ["Executive Summary", "Tourist Activity", "Alert Log", "Incident Register", "Geofence Status", "Device Health", "Weather Conditions"],
  },
  {
    id: "RPT-2025-155",
    title: "Incident Analysis — Rocky Ridge Fall (INC-2025-001)",
    type: "incident_report",
    status: "ready",
    generatedAt: "2025-05-20T10:45:00",
    generatedBy: "Ranger Mike Chen",
    fileSize: "4.1 MB",
    format: "pdf",
    pages: 24,
    records: 1,
    description: "Full incident dossier for T003 fall at Rocky Ridge Pass. Includes witness statements, medical response timeline, and GPS telemetry.",
    coverDate: "May 20, 2025",
    sections: ["Incident Overview", "Timeline Reconstruction", "Medical Response", "GPS Telemetry", "Witness Statements", "Recommendations"],
  },
  {
    id: "RPT-2025-154",
    title: "Weekly Safety Audit — May 14–20, 2025",
    type: "safety_audit",
    status: "ready",
    generatedAt: "2025-05-20T09:00:00",
    generatedBy: "Admin",
    fileSize: "8.7 MB",
    format: "pdf",
    pages: 45,
    records: 8,
    description: "Weekly compliance audit covering all 8 geofence zones, trail conditions, emergency shelter inventory, and ranger readiness.",
    coverDate: "May 14 – May 20, 2025",
    sections: ["Compliance Scorecard", "Geofence Audit", "Trail Assessment", "Shelter Inventory", "Training Records", "Action Items"],
  },
  {
    id: "RPT-2025-153",
    title: "Device Fleet Health — May 2025",
    type: "device_status",
    status: "ready",
    generatedAt: "2025-05-19T23:00:00",
    generatedBy: "System (Auto)",
    fileSize: "1.8 MB",
    format: "xlsx",
    records: 127,
    description: "Monthly device health report with battery degradation analysis, firmware compliance, and replacement recommendations.",
    coverDate: "May 1–19, 2025",
    sections: ["Fleet Overview", "Battery Analysis", "Firmware Compliance", "Signal Quality", "Replacement Forecast"],
  },
  {
    id: "RPT-2025-152",
    title: "Geofence Breach Pattern Analysis",
    type: "geofence_analysis",
    status: "generating",
    generatedAt: "2025-05-20T10:50:00",
    generatedBy: "Admin",
    fileSize: "--",
    format: "pdf",
    description: "Analyzing 42 breaches over the last 30 days to identify high-risk zones and time patterns.",
    coverDate: "Apr 20 – May 20, 2025",
    sections: ["Breach Heatmap", "Temporal Analysis", "Zone Comparison", "Tourist Behavior", "Recommendations"],
  },
  {
    id: "RPT-2025-151",
    title: "Response Team Performance — Q2 2025",
    type: "team_performance",
    status: "ready",
    generatedAt: "2025-05-18T14:00:00",
    generatedBy: "Commander Arjun Mehta",
    fileSize: "3.2 MB",
    format: "pdf",
    pages: 18,
    records: 5,
    description: "Quarterly evaluation of all 5 response teams with response time distributions, incident resolution quality, and training gaps.",
    coverDate: "April 1 – May 18, 2025",
    sections: ["Team Scorecards", "Response Time Analysis", "Resolution Quality", "Training Assessment", "Budget Review"],
  },
  {
    id: "RPT-2025-150",
    title: "Tourist Activity Deep Dive — Lakeview Park",
    type: "tourist_activity",
    status: "ready",
    generatedAt: "2025-05-17T11:00:00",
    generatedBy: "Admin",
    fileSize: "5.5 MB",
    format: "xlsx",
    records: 340,
    description: "Detailed visitor flow analysis for Lakeview Park including peak times, demographic data, and satisfaction survey results.",
    coverDate: "May 1–17, 2025",
    sections: ["Visitor Flow", "Peak Analysis", "Demographics", "Satisfaction Scores", "Revenue Impact"],
  },
  {
    id: "RPT-2025-149",
    title: "Environmental Hazard Log — Flash Flood Event",
    type: "weather_log",
    status: "failed",
    generatedAt: "2025-05-20T08:30:00",
    generatedBy: "System (Auto)",
    fileSize: "--",
    format: "pdf",
    description: "Failed to generate — weather data source timeout. Retry scheduled.",
    coverDate: "May 20, 2025",
    sections: ["Weather Data", "Impact Assessment", "Evacuation Effectiveness", "Damage Report"],
  },
];

export const scheduledReportsList: ScheduledReport[] = [
  {
    id: "SCH-001",
    title: "Daily Operations Summary",
    type: "daily_summary",
    frequency: "daily",
    nextRun: "2025-05-21T10:00:00",
    lastRun: "2025-05-20T10:00:00",
    recipients: ["admin@tourguard.io", "ops@tourguard.io"],
    format: "pdf",
    active: true,
  },
  {
    id: "SCH-002",
    title: "Device Health Check",
    type: "device_status",
    frequency: "daily",
    nextRun: "2025-05-21T06:00:00",
    lastRun: "2025-05-20T06:00:00",
    recipients: ["tech@tourguard.io"],
    format: "xlsx",
    active: true,
  },
  {
    id: "SCH-003",
    title: "Weekly Safety Audit",
    type: "safety_audit",
    frequency: "weekly",
    nextRun: "2025-05-26T09:00:00",
    lastRun: "2025-05-19T09:00:00",
    recipients: ["admin@tourguard.io", "safety@tourguard.io", "rangers@tourguard.io"],
    format: "pdf",
    active: true,
  },
  {
    id: "SCH-004",
    title: "Geofence Breach Alert",
    type: "geofence_analysis",
    frequency: "hourly",
    nextRun: "2025-05-20T11:00:00",
    lastRun: "2025-05-20T10:00:00",
    recipients: ["ops@tourguard.io"],
    format: "csv",
    active: true,
  },
  {
    id: "SCH-005",
    title: "Monthly Tourist Analytics",
    type: "tourist_activity",
    frequency: "monthly",
    nextRun: "2025-06-01T08:00:00",
    lastRun: "2025-05-01T08:00:00",
    recipients: ["admin@tourguard.io", "marketing@tourguard.io"],
    format: "xlsx",
    active: false,
  },
];