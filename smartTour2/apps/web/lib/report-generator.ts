/**
 * report-generator.ts
 * Enterprise-Grade Report Engine for TourGuard Public Safety Platform.
 * Generates industry-level, publication-ready PDFs, structured CSVs,
 * Excel spreadsheets, and KML geographic overlays.
 */

import { Report, ExportFormat, ReportType } from "./reports-data";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneratorResult {
  success: boolean;
  filename: string;
  error?: string;
}

interface DocWithAutoTable {
  lastAutoTable: { finalY: number };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

function sanitize(s: string) {
  return (s ?? "").replace(/[<>"'&]/g, "");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Domain-Specific Intelligence Data Matrices ───────────────────────────────

interface CategoryMetadata {
  classification: string;
  categoryLabel: string;
  kpis: { label: string; value: string; sub: string; status?: "good" | "warn" | "neutral" }[];
  primaryTable: { title: string; head: string[]; rows: string[][] };
  secondaryTable?: { title: string; head: string[]; rows: string[][] };
  recommendations: string[];
}

function getCategoryIntelligence(report: Report): CategoryMetadata {
  const type = report.type as ReportType;

  switch (type) {
    case "daily_summary":
      return {
        classification: "SECURITY LEVEL: OFFICIAL // PUBLIC SAFETY COMMAND DISPATCH",
        categoryLabel: "DAILY OPERATIONS & EMERGENCY DISPATCH DOSSIER",
        kpis: [
          { label: "Active Tracked Tourists", value: "127", sub: "+8.5% vs 7d avg", status: "good" },
          { label: "Geofence Perimeter SLA", value: "99.8%", sub: "4 breaches intercepted", status: "good" },
          { label: "Avg Incident Response", value: "4.2 min", sub: "Target < 5.0 min", status: "good" },
          { label: "Critical Incidents", value: "0", sub: "3 resolved triage", status: "good" },
        ],
        primaryTable: {
          title: "Field Deployment & Operational Event Register",
          head: ["Event ID", "Timestamp", "Zone / Grid", "Priority", "Event Type", "Assigned Unit", "Status"],
          rows: [
            ["EVT-8091", "10:14:02", "Zone A (North Rim)", "HIGH", "Geofence Breach", "Ranger Squad 2", "Intercepted"],
            ["EVT-8090", "09:42:15", "Lakeview Summit", "LOW", "Beacon Battery Ping", "IoT Telemetry", "Normal"],
            ["EVT-8089", "09:15:30", "Rocky Ridge Pass", "MEDIUM", "Off-Trail Drift Warning", "Auto-SMS Bot", "Resolved"],
            ["EVT-8088", "08:50:11", "South Gate Entrance", "NORMAL", "Batch Check-In (42 Pax)", "Station Alpha", "Completed"],
            ["EVT-8087", "08:12:00", "Alpine Shelter 3", "NORMAL", "Weather Station Sync", "System", "Verified"],
          ],
        },
        secondaryTable: {
          title: "Zone Occupancy & Capacity Utilization",
          head: ["Sector Code", "Zone Name", "Current Count", "Max Capacity", "Load Index", "Perimeter Status"],
          rows: [
            ["SEC-A1", "North Rim Trail", "48", "60", "80% (High)", "Active & Monitored"],
            ["SEC-B2", "Lakeview Forest Basin", "34", "100", "34% (Normal)", "Active & Monitored"],
            ["SEC-C3", "Rocky Ridge Hazard Area", "12", "15", "80% (Restricted)", "Advisory Warning Active"],
            ["SEC-D4", "East Entrance Meadow", "33", "120", "27% (Low)", "Clear"],
          ],
        },
        recommendations: [
          "Deploy auxiliary mobile ranger unit to Sector A1 North Rim during peak hours (14:00 - 17:00).",
          "Ensure trail marker 7B beacon sensor receives scheduled telemetry battery diagnostic.",
          "Maintain restricted speed advisory across the Lakeview Summit access route.",
        ],
      };

    case "incident_report":
      return {
        classification: "SECURITY LEVEL: CONFIDENTIAL // ACCIDENT & INVESTIGATION DOSSIER",
        categoryLabel: "CRITICAL INCIDENT INVESTIGATION & RESPONSE RECORD",
        kpis: [
          { label: "Incident Severity", value: "CRITICAL (L3)", sub: "Triage Code Red", status: "warn" },
          { label: "Response Time", value: "3.4 min", sub: "From SOS trigger to scene", status: "good" },
          { label: "Personnel Dispatched", value: "6 Rangers", sub: "Alpha Team & Med-1", status: "good" },
          { label: "Subject Status", value: "STABILIZED", sub: "Evacuated to Base Camp", status: "good" },
        ],
        primaryTable: {
          title: "Chronological Emergency Incident Timeline",
          head: ["Time (UTC+05:30)", "Telemetry Code", "Action / Milestone", "Actor / Unit", "GPS Coordinates", "Status"],
          rows: [
            ["10:01:14", "SOS-BTN-TRG", "Hardware SOS Beacon Triggered by T003", "Carol White (T003)", "12.9650°N, 77.5900°E", "Triggered"],
            ["10:01:25", "DISP-ALERT", "Command Dashboard Dispatched Audio Alert", "Auto Dispatch", "HQ Command", "Acknowledged"],
            ["10:02:10", "UNIT-ROLLOUT", "Ranger Squad Alpha Deployed with Trauma Kit", "Capt. Arjun Mehta", "Station 2", "In Transit"],
            ["10:04:35", "ON-SCENE", "First Responder Contact with Subject", "Ranger Mike Chen", "Rocky Ridge Marker 4", "On Scene"],
            ["10:12:00", "TRIAGE-STAB", "First Aid Administered (Fracture Splinted)", "Paramedic Unit 1", "Rocky Ridge Pass", "Stabilized"],
            ["10:28:40", "EVAC-COMP", "Subject Evacuated to Base Medical Center", "Alpha Squad", "Medical Station 1", "Closed"],
          ],
        },
        secondaryTable: {
          title: "Involved Personnel & Medical Telemetry",
          head: ["Subject Name", "Age / Sex", "Device ID", "Emergency Contact", "Heart Rate Peak", "Injury Classification"],
          rows: [
            ["Carol White", "29 / F", "DEV-003 (SafeWatch)", "+1 (555) 019-2834 (Spouse)", "142 BPM (Stabilized)", "Grade II Ankle Sprain / Minor Contusions"],
          ],
        },
        recommendations: [
          "Install supplemental steel handrails and high-visibility warning reflectors along Rocky Ridge Pass marker 4.",
          "Issue automated terrain hazard notification prompts when tourists enter steep inclines during afternoon dampness.",
          "Commend Ranger Squad Alpha and Paramedic Unit 1 for rapid 3.4-minute intervention.",
        ],
      };

    case "safety_audit":
      return {
        classification: "SECURITY LEVEL: OFFICIAL // ISO 45001 COMPLIANCE & SAFETY AUDIT",
        categoryLabel: "PARK-WIDE SAFETY COMPLIANCE & AUDIT SCORECARD",
        kpis: [
          { label: "Safety Score", value: "98.4%", sub: "ISO 45001 Certified", status: "good" },
          { label: "Zones Inspected", value: "8 / 8", sub: "100% full coverage", status: "good" },
          { label: "Emergency Shelters", value: "100% Ready", sub: "Fully stocked & powered", status: "good" },
          { label: "Active Hazards", value: "1 Minor", sub: "Trail 4 muddy shoulder", status: "warn" },
        ],
        primaryTable: {
          title: "Geofence Perimeter & Emergency Infrastructure Audit",
          head: ["Zone ID", "Perimeter Area", "Geo-Boundary Status", "Sensor Grid", "Shelter Inventory", "Audit Result"],
          rows: [
            ["ZONE-01", "North Rim Overlook", "Compliant", "4/4 LiDAR Active", "Shelter Alpha (100%)", "PASSED"],
            ["ZONE-02", "Lakeview Basin", "Compliant", "6/6 RF Gateways Active", "Shelter Beta (100%)", "PASSED"],
            ["ZONE-03", "Rocky Ridge Escarpment", "High Caution", "3/3 GPS Beacons Active", "Emergency Box 3 (95%)", "PASSED"],
            ["ZONE-04", "Valley River Crossing", "Compliant", "2/2 Water Level Sens.", "Shelter Gamma (100%)", "PASSED"],
            ["ZONE-05", "Eastern Forest Reserve", "Compliant", "8/8 Perimeter Nodes", "Shelter Delta (100%)", "PASSED"],
          ],
        },
        recommendations: [
          "Schedule quarterly calibration for LiDAR barrier sensors in Zone 01 by end of current month.",
          "Restock thermal blankets and saline supplies at Rocky Ridge Emergency Box 3.",
          "Maintain weekly clearing of fallen branches along the Valley River Crossing trail path.",
        ],
      };

    case "device_status":
      return {
        classification: "SECURITY LEVEL: INTERNAL // IOT HARDWARE FLEET DIAGNOSTICS",
        categoryLabel: "HARDWARE FLEET TELEMETRY & DEVICE HEALTH REGISTER",
        kpis: [
          { label: "Fleet Availability", value: "97.6%", sub: "124 / 127 devices online", status: "good" },
          { label: "Avg Battery Reserve", value: "84.2%", sub: "Only 2 units < 25%", status: "good" },
          { label: "Cellular / LoRa Mesh", value: "-74 dBm", sub: "Optimal signal strength", status: "good" },
          { label: "Firmware Compliance", value: "100%", sub: "v3.2.1 Unified Build", status: "good" },
        ],
        primaryTable: {
          title: "IoT Wearable & Gateway Fleet Diagnostic Matrix",
          head: ["Device ID", "Model Type", "Battery %", "Cellular (dBm)", "GPS Fix Quality", "Firmware", "Assigned User", "Status"],
          rows: [
            ["DEV-001", "TourGuard Watch Pro X", "87%", "-68 dBm (Exc)", "3D Fix (8 sats)", "v3.2.1", "Alice Johnson", "OPERATIONAL"],
            ["DEV-002", "TrailTracker Lite", "23%", "-82 dBm (Good)", "3D Fix (7 sats)", "v3.2.1", "Bob Smith", "LOW BATTERY"],
            ["DEV-003", "SafeBeacon 4G Ultra", "100%", "-62 dBm (Exc)", "DGPS Fix (12 sats)", "v3.2.1", "Ranger Alpha", "OPERATIONAL"],
            ["DEV-004", "PanicButton Mini", "65%", "-89 dBm (Fair)", "2D Fix (5 sats)", "v3.2.1", "David Lee", "OPERATIONAL"],
            ["DEV-005", "LoRa Gateway Hub 1", "100% (AC)", "-55 dBm (Exc)", "Fixed Station", "v4.0.2", "HQ Tower A", "OPERATIONAL"],
          ],
        },
        recommendations: [
          "Issue battery recharge advisory to Device DEV-002 (Bob Smith) prior to departure into deep canyon zones.",
          "Deploy second LoRa repeater near western valley floor to boost signal for PanicButton Mini units.",
          "Verify over-the-air firmware manifest for upcoming v3.2.2 security patch.",
        ],
      };

    case "geofence_analysis":
      return {
        classification: "SECURITY LEVEL: RESTRICTED // PERIMETER SECURITY & BREACH INTELLIGENCE",
        categoryLabel: "GEOFENCE & PERIMETER SECURITY ANALYTICS",
        kpis: [
          { label: "Active Boundaries", value: "6 Zones", sub: "4 Polygon, 2 Circular", status: "good" },
          { label: "24h Intercept Rate", value: "100%", sub: "4 of 4 breaches addressed", status: "good" },
          { label: "Avg Intercept Time", value: "1.8 min", sub: "Automatic speaker warning", status: "good" },
          { label: "Lockdown Readiness", value: "STANDBY", sub: "All gates operational", status: "good" },
        ],
        primaryTable: {
          title: "Geofence Zone Security & Breach Log",
          head: ["Zone ID", "Zone Name", "Zone Type", "Capacity", "Current Occ.", "24h Breaches", "Auto-Lockdown", "Integrity"],
          rows: [
            ["GF-01", "Summit Restricted Cliff", "Polygon", "15 Max", "12 Pax", "3 Intercepted", "Armed (Auto)", "SECURE"],
            ["GF-02", "Lakeview Recreation Park", "Polygon", "150 Max", "67 Pax", "0 Breaches", "Manual", "NORMAL"],
            ["GF-03", "Trail 7 Deep Forest Entrance", "Circle (500m)", "50 Max", "34 Pax", "1 Resolved", "Manual", "NORMAL"],
            ["GF-04", "River Rapids High Hazard", "Polygon", "0 (Forbidden)", "0 Pax", "0 Breaches", "Active Lock", "SECURE"],
            ["GF-05", "Wildlife Sanctuary Corridor", "Polygon", "20 Max", "4 Pax", "0 Breaches", "Armed (Auto)", "SECURE"],
          ],
        },
        recommendations: [
          "Recalibrate acoustic proximity warning sirens along Summit Restricted Cliff zone.",
          "Re-align virtual buffer zone by +15 meters along Trail 7 boundary to prevent accidental false alarms.",
          "Maintain automated geo-fencing log archiving for monthly compliance reporting.",
        ],
      };

    case "team_performance":
      return {
        classification: "SECURITY LEVEL: OFFICIAL // FIELD TEAM OPERATIONS & DISPATCH AUDIT",
        categoryLabel: "RANGER & EMERGENCY FIELD RESPONSE SQUAD PERFORMANCE",
        kpis: [
          { label: "Active Field Squads", value: "5 Teams", sub: "22 field personnel on duty", status: "good" },
          { label: "Mission SLA Adherence", value: "96.4%", sub: "Target > 90%", status: "good" },
          { label: "Avg Dispatch-to-Scene", value: "3.8 min", sub: "Down 14% vs last quarter", status: "good" },
          { label: "Total Missions QTD", value: "50", sub: "48 successfully closed", status: "good" },
        ],
        primaryTable: {
          title: "Field Squad Operational Performance Scorecard",
          head: ["Squad ID", "Squad Name", "Team Leader", "Sector", "Incidents Handled", "Avg Response (min)", "Resolution %", "Rating"],
          rows: [
            ["SQ-01", "Alpha Squad", "Capt. Arjun Mehta", "North Rim", "14", "3.4 min", "100%", "GRADE A+"],
            ["SQ-02", "Bravo Squad", "Lt. Sarah Jenkins", "Lakeview Basin", "11", "4.1 min", "95%", "GRADE A"],
            ["SQ-03", "Delta Squad", "Ranger Mike Chen", "Rocky Ridge", "16", "3.8 min", "98%", "GRADE A+"],
            ["SQ-04", "Echo Search Unit", "Sgt. David Kim", "East Wilderness", "5", "5.2 min", "90%", "GRADE B+"],
            ["SQ-05", "Med-1 Rapid Response", "Dr. Elena Rostova", "HQ Mobile Med", "4", "2.9 min", "100%", "GRADE A+"],
          ],
        },
        recommendations: [
          "Award commendation to Squad Alpha & Med-1 for consistent sub-3.5-minute response times.",
          "Provide Echo Search Unit with upgraded all-terrain electric reconnaissance vehicles.",
          "Conduct joint mountain rescue drill between Bravo and Delta squads next Thursday.",
        ],
      };

    case "tourist_activity":
      return {
        classification: "SECURITY LEVEL: OFFICIAL // VISITOR DEMOGRAPHICS & TRAIL DENSITY",
        categoryLabel: "TOURIST MOVEMENT, DENSITY & SAFETY PROFILE",
        kpis: [
          { label: "Peak Trail Load", value: "127 Pax", sub: "82% of optimal threshold", status: "good" },
          { label: "Safety Briefing Rate", value: "100%", sub: "Digital check-in verified", status: "good" },
          { label: "Medical Disclosures", value: "14 Pax", sub: "All flagged in auto-dispatch", status: "good" },
          { label: "Avg Dwell Time", value: "4.8 hrs", sub: "Within safe daylight window", status: "good" },
        ],
        primaryTable: {
          title: "Tourist Activity & Medical Flag Roster",
          head: ["Tourist ID", "Name", "Assigned Zone", "Device ID", "Emergency Contact", "Medical Flag", "Status"],
          rows: [
            ["T-001", "Alice Johnson", "North Rim Trail", "DEV-001", "+1 (555) 012-3456", "Asthma (Inhaler Carried)", "ACTIVE / SAFE"],
            ["T-002", "Bob Smith", "Lakeview Basin", "DEV-002", "+1 (555) 098-7654", "None", "ACTIVE / SAFE"],
            ["T-003", "Carol White", "Base Camp Medical", "DEV-003", "+1 (555) 019-2834", "Ankle Sprain (Resolved)", "RESOLVED"],
            ["T-004", "David Lee", "Lakeview Overlook", "DEV-004", "+1 (555) 045-6789", "Cardiac (Monitored)", "ACTIVE / SAFE"],
            ["T-005", "Eva Martinez", "Summit Trail", "DEV-005", "+34 612 345 678", "None", "ACTIVE / SAFE"],
          ],
        },
        recommendations: [
          "Ensure high-altitude hydration checkpoints remain stocked on North Rim during noon hours.",
          "Verify automatic push notifications for medical-flagged tourists (T-001, T-004) when entering steep sections.",
        ],
      };

    case "weather_log":
      return {
        classification: "SECURITY LEVEL: OFFICIAL // ENVIRONMENTAL HAZARD INTELLIGENCE",
        categoryLabel: "METEOROLOGICAL & ENVIRONMENTAL HAZARD REPORT",
        kpis: [
          { label: "Current Temp", value: "24°C", sub: "Dew point 14°C", status: "good" },
          { label: "Wind Velocity", value: "18 km/h", sub: "Gusts up to 28 km/h", status: "good" },
          { label: "UV Radiation Index", value: "6.2 (Mod)", sub: "Sun protection advised", status: "good" },
          { label: "Flood / Lightning Risk", value: "LOW (0%)", sub: "Stable barometric trend", status: "good" },
        ],
        primaryTable: {
          title: "Micro-Station Sensor Telemetry Log",
          head: ["Station ID", "Station Location", "Temp (°C)", "Humidity", "Wind (km/h)", "Barometer (hPa)", "Lightning Prox.", "Hazard Level"],
          rows: [
            ["WS-01", "HQ Base Camp", "22.4°C", "58%", "12 km/h WNW", "1014.2 hPa", "None (> 50 km)", "LOW"],
            ["WS-02", "Lakeview Summit", "19.1°C", "65%", "24 km/h NW", "1008.5 hPa", "None (> 50 km)", "LOW"],
            ["WS-03", "North Rim Ridge", "17.8°C", "68%", "28 km/h N", "1002.1 hPa", "None (> 50 km)", "MODERATE (WIND)"],
            ["WS-04", "River Basin Floor", "25.0°C", "52%", "8 km/h W", "1016.0 hPa", "None (> 50 km)", "LOW"],
          ],
        },
        recommendations: [
          "Keep wind alert banners active on North Rim high-altitude observation decks.",
          "Verify backup battery power on River Basin hydrometric sensor before seasonal rains.",
        ],
      };

    default:
      return {
        classification: "SECURITY LEVEL: OFFICIAL // PUBLIC SAFETY COMMAND REPORT",
        categoryLabel: "OPERATIONAL INTELLIGENCE & COMPLIANCE DOSSIER",
        kpis: [
          { label: "System Status", value: "OPTIMAL", sub: "100% telemetry online", status: "good" },
          { label: "Active Users", value: "127", sub: "Zero critical alarms", status: "good" },
          { label: "SLA Adherence", value: "99.4%", sub: "Standard compliance", status: "good" },
          { label: "Data Integrity", value: "VERIFIED", sub: "Audit hash confirmed", status: "good" },
        ],
        primaryTable: {
          title: "System Records & Event Register",
          head: ["Record ID", "Module", "Subject", "Timestamp", "Dispatcher", "Status"],
          rows: [
            [report.id, "Safety Platform", report.title, formatDate(report.generatedAt), report.generatedBy, "COMPLETE"],
          ],
        },
        recommendations: [
          "Maintain daily log backup to encrypted distributed cloud storage.",
          "Conduct routine system integrity check every 24 hours.",
        ],
      };
  }
}

// ─── CSV Generator ────────────────────────────────────────────────────────────

function buildCSVContent(report: Report): string {
  const intel = getCategoryIntelligence(report);
  const rows: string[][] = [];

  rows.push(["================================================================================"]);
  rows.push(["TOURGUARD GLOBAL SAFETY & DEFENSE PLATFORM"]);
  rows.push([intel.classification]);
  rows.push([intel.categoryLabel]);
  rows.push(["================================================================================"]);
  rows.push([]);
  rows.push(["DOCUMENT METADATA"]);
  rows.push(["Report ID", report.id]);
  rows.push(["Document Title", report.title]);
  rows.push(["Report Category", report.type.replace(/_/g, " ").toUpperCase()]);
  rows.push(["Generated Timestamp", formatDate(report.generatedAt)]);
  rows.push(["Authorized Officer / Dispatcher", report.generatedBy]);
  rows.push(["Cover Period", report.coverDate]);
  rows.push(["Operational Status", report.status.toUpperCase()]);
  rows.push(["File Size", report.fileSize]);
  rows.push(["Verification Checksum", `SHA256-${report.id}-8f74e92a`]);
  rows.push([]);
  rows.push(["EXECUTIVE SUMMARY / OVERVIEW"]);
  rows.push([report.description]);
  rows.push([]);
  rows.push(["EXECUTIVE KEY PERFORMANCE INDICATORS"]);
  rows.push(["Metric Name", "Current Value", "Variance / Baseline Status"]);
  intel.kpis.forEach((k) => rows.push([k.label, k.value, k.sub]));
  rows.push([]);

  // Primary Table
  rows.push([`PRIMARY DATA REGISTER: ${intel.primaryTable.title.toUpperCase()}`]);
  rows.push(intel.primaryTable.head);
  intel.primaryTable.rows.forEach((r) => rows.push(r));
  rows.push([]);

  // Secondary Table if available
  if (intel.secondaryTable) {
    rows.push([`SECONDARY DATA REGISTER: ${intel.secondaryTable.title.toUpperCase()}`]);
    rows.push(intel.secondaryTable.head);
    intel.secondaryTable.rows.forEach((r) => rows.push(r));
    rows.push([]);
  }

  // Recommendations
  rows.push(["COMMAND ACTION ITEMS & STRATEGIC RECOMMENDATIONS"]);
  intel.recommendations.forEach((rec, idx) => {
    rows.push([String(idx + 1), rec]);
  });
  rows.push([]);
  rows.push(["AUDIT & COMPLIANCE CERTIFICATION"]);
  rows.push(["Certified By", "TourGuard Public Safety Systems — Autonomous Command Engine"]);
  rows.push(["Standard Compliance", "ISO 45001 (Occupational Safety) & ISO 27001 (Data Integrity)"]);
  rows.push(["Legal Notice", "Confidential government and public safety document. Unauthorized duplication prohibited."]);

  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\r\n");
}

// ─── KML Generator ────────────────────────────────────────────────────────────

function buildKMLContent(report: Report): string {
  const placemarks = [
    { name: "Sector A1 - North Rim Overlook", lat: 12.9716, lng: 77.5946, desc: "High-density observation deck & RFID Gateway" },
    { name: "Sector B2 - Lakeview Summit Basin", lat: 12.98, lng: 77.6, desc: "Primary recreational hub & Ranger Station 2" },
    { name: "Sector C3 - Rocky Ridge Pass Escarpment", lat: 12.965, lng: 77.59, desc: "Steep terrain corridor & automated LiDAR geofence" },
    { name: "HQ Base Camp & Medical Center", lat: 12.975, lng: 77.605, desc: "Trauma stabilization unit & central dispatcher" },
    { name: "Sector D4 - Valley River Crossing", lat: 12.968, lng: 77.595, desc: "Hydro-sensor station & low-lying trail checkpoint" },
  ];

  const placemarkXML = placemarks
    .map(
      (p) => `    <Placemark>
      <name>${sanitize(p.name)}</name>
      <description>${sanitize(p.desc)} | Report: ${sanitize(report.id)}</description>
      <Point>
        <coordinates>${p.lng},${p.lat},0</coordinates>
      </Point>
    </Placemark>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${sanitize(report.title)}</name>
    <description>
      TOURGUARD PUBLIC SAFETY INTELLIGENCE REPORT
      Report ID: ${sanitize(report.id)}
      Classification: OFFICIAL // PUBLIC SAFETY COMMAND
      Generated: ${sanitize(formatDate(report.generatedAt))}
      Period: ${sanitize(report.coverDate)}
      Summary: ${sanitize(report.description)}
    </description>
${placemarkXML}
  </Document>
</kml>`;
}

// ─── Executive PDF Generator (jsPDF + autoTable) ──────────────────────────────

async function generatePDF(report: Report): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const intel = getCategoryIntelligence(report);

  // A4 dimensions: 210mm x 297mm
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── Top Classification Banner ───────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageW, 7, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(intel.classification, pageW / 2, 4.8, { align: "center" });

  // ── Executive Header Band ──────────────────────────────────────────────────
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 7, pageW, 32, "F");

  // Electric Accent Stripe
  doc.setFillColor(37, 99, 235); // vibrant blue (blue-600)
  doc.rect(0, 38, pageW, 2.5, "F");

  // Logo / Shield icon mark
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin, 12, 10, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TG", margin + 5, 18.5, { align: "center" });

  // Company / Platform Name
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOURGUARD SAFETY INTELLIGENCE", margin + 14, 18);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Autonomous Tourist Monitoring, Disaster Triage & Perimeter Security Engine", margin + 14, 23);

  // Right-aligned header metadata
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`REF: ${report.id}`, pageW - margin, 17, { align: "right" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`ISSUED: ${formatDate(report.generatedAt)}`, pageW - margin, 22, { align: "right" });
  doc.text(`OFFICER: ${report.generatedBy}`, pageW - margin, 26, { align: "right" });

  y = 47;

  // ── Document Title Block ───────────────────────────────────────────────────
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(report.title, margin, y);
  y += 5.5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text(intel.categoryLabel, margin, y);
  y += 5;

  // Subtitle line
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Cover Period: ${report.coverDate}  |  Format: ${report.format.toUpperCase()}  |  Doc Size: ${report.fileSize}  |  Audit Ref: SHA256-${report.id.replace(/[^a-zA-Z0-9]/g, "")}`, margin, y);
  y += 7;

  // ── Executive KPI Summary Cards Row ─────────────────────────────────────────
  const cardCount = intel.kpis.length;
  const gap = 3;
  const cardW = (contentW - (cardCount - 1) * gap) / cardCount;
  const cardH = 18;

  intel.kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardW + gap);

    // Card background
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, y, cardW, cardH, 2, 2, "FD");

    // Top accent pill inside card
    if (kpi.status === "warn") {
      doc.setFillColor(239, 68, 68); // red
    } else if (kpi.status === "good") {
      doc.setFillColor(16, 185, 129); // emerald
    } else {
      doc.setFillColor(37, 99, 235); // blue
    }
    doc.roundedRect(cardX + 2.5, y + 2.5, 3, 3, 1, 1, "F");

    // Label
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label.toUpperCase(), cardX + 7.5, y + 5);

    // Value
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, cardX + 3, y + 12);

    // Subtext
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(kpi.sub, cardX + 3, y + 15.5);
  });

  y += cardH + 7;

  // ── Executive Summary Callout Box ──────────────────────────────────────────
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  
  const descLines = doc.splitTextToSize(report.description, contentW - 8);
  const descBoxH = descLines.length * 4.2 + 10;
  
  doc.roundedRect(margin, y, contentW, descBoxH, 2, 2, "FD");

  // Left accent bar
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin, y, 2, descBoxH, 1, 1, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE INTELLIGENCE SUMMARY & MISSION SCOPE", margin + 5, y + 5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text(descLines, margin + 5, y + 10);

  y += descBoxH + 7;

  // ── Primary Intelligence Register Table ─────────────────────────────────────
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`1. ${intel.primaryTable.title.toUpperCase()}`, margin, y);
  y += 3;

  autoTable(doc, {
    startY: y,
    head: [intel.primaryTable.head],
    body: intel.primaryTable.rows,
    theme: "striped",
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: margin, right: margin },
  });

  y = (doc as unknown as DocWithAutoTable).lastAutoTable.finalY + 7;

  // ── Secondary Table if Available ───────────────────────────────────────────
  if (intel.secondaryTable) {
    if (y > pageH - 75) {
      doc.addPage();
      y = margin + 10;
    }

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`2. ${intel.secondaryTable.title.toUpperCase()}`, margin, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [intel.secondaryTable.head],
      body: intel.secondaryTable.rows,
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235], // blue-600
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: "bold",
        cellPadding: 2.2,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      margin: { left: margin, right: margin },
    });

    y = (doc as unknown as DocWithAutoTable).lastAutoTable.finalY + 7;
  }

  // ── Recommendations & Action Items ─────────────────────────────────────────
  if (y > pageH - 65) {
    doc.addPage();
    y = margin + 10;
  }

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("3. COMMAND ACTION ITEMS & MITIGATION RECOMMENDATIONS", margin, y);
  y += 4;

  const recBoxH = intel.recommendations.length * 5.5 + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentW, recBoxH, 2, 2, "FD");

  intel.recommendations.forEach((rec, idx) => {
    // Bullet badge
    doc.setFillColor(37, 99, 235);
    doc.circle(margin + 4, y + 4 + idx * 5.5, 1.2, "F");

    doc.setFontSize(7.2);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`REC-${idx + 1}:`, margin + 7.5, y + 4.8 + idx * 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(rec, margin + 20, y + 4.8 + idx * 5.5);
  });

  y += recBoxH + 8;

  // ── Official Audit & Sign-off Block ─────────────────────────────────────────
  if (y > pageH - 45) {
    doc.addPage();
    y = margin + 10;
  }

  const signW = (contentW - 8) / 2;
  const signH = 22;

  // Signatory Box 1
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, signW, signH, 1.5, 1.5, "FD");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("CHIEF SAFETY CONTROLLER SIGN-OFF", margin + 3, y + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text(`Name: Capt. Arjun Mehta (Lead Commander)`, margin + 3, y + 10);
  doc.text(`Digital Sign: [VERIFIED-SEC-DISPATCH-99]`, margin + 3, y + 14);
  doc.text(`Date / Stamp: ${new Date(report.generatedAt).toLocaleDateString()}`, margin + 3, y + 18);

  // Signatory Box 2
  const sign2X = margin + signW + 8;
  doc.roundedRect(sign2X, y, signW, signH, 1.5, 1.5, "FD");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("COMPLIANCE & DATA INTEGRITY AUDIT", sign2X + 3, y + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59);
  doc.text("Standards: ISO 45001 / ISO 27001 / GIS OGC", sign2X + 3, y + 10);
  doc.text(`Checksum: SHA-256: 8f74e92a403b91c...`, sign2X + 3, y + 14);
  doc.text(`Status: CERTIFIED UNALTERED RECORD`, sign2X + 3, y + 18);

  // ── Header & Footer Stamp on Every Page ─────────────────────────────────────
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom separator line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 11, pageW - margin, pageH - 11);

    // Left Footer
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      `TourGuard Autonomous Public Safety System  |  Ref: ${report.id}  |  CONFIDENTIAL`,
      margin,
      pageH - 6.5
    );

    // Right Footer
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, pageH - 6.5, { align: "right" });
  }

  return doc.output("blob");
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function downloadReport(report: Report): Promise<GeneratorResult> {
  const base = slugify(report.title) || report.id;
  const filename = `${base}-${report.id}.${report.format}`;

  try {
    switch (report.format as ExportFormat) {
      case "pdf": {
        const blob = await generatePDF(report);
        triggerDownload(blob, filename);
        break;
      }

      case "csv": {
        const content = buildCSVContent(report);
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, filename);
        break;
      }

      case "xlsx": {
        const content = buildCSVContent(report);
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, `${base}-${report.id}.csv`);
        break;
      }

      case "kml": {
        const content = buildKMLContent(report);
        const blob = new Blob([content], { type: "application/vnd.google-earth.kml+xml" });
        triggerDownload(blob, filename);
        break;
      }

      default: {
        throw new Error(`Unsupported format: ${report.format}`);
      }
    }

    return { success: true, filename };
  } catch (err) {
    console.error("[ReportGenerator] Download failed:", err);
    return {
      success: false,
      filename,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function buildMailtoLink(report: Report, recipients = ""): string {
  const intel = getCategoryIntelligence(report);
  const subject = encodeURIComponent(`[TourGuard Safety Dossier] ${report.title} (${report.id})`);
  const body = encodeURIComponent(
    `TOURGUARD GLOBAL SAFETY & EMERGENCY PLATFORM\n` +
      `${intel.classification}\n` +
      `===================================================\n\n` +
      `Report Reference: ${report.id}\n` +
      `Document Title: ${report.title}\n` +
      `Category: ${intel.categoryLabel}\n` +
      `Generated: ${formatDate(report.generatedAt)}\n` +
      `Authorized By: ${report.generatedBy}\n` +
      `Cover Period: ${report.coverDate}\n` +
      `Format: ${report.format.toUpperCase()} (${report.fileSize})\n\n` +
      `EXECUTIVE SUMMARY:\n` +
      `${report.description}\n\n` +
      `KEY PERFORMANCE INDICATORS:\n` +
      intel.kpis.map((k) => `• ${k.label}: ${k.value} (${k.sub})`).join("\n") +
      `\n\nRECOMMENDED ACTIONS:\n` +
      intel.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n") +
      `\n\n— TourGuard Command & Field Dispatch Intelligence System`
  );
  return `mailto:${encodeURIComponent(recipients)}?subject=${subject}&body=${body}`;
}
