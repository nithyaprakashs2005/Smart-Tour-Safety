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

export const incidentStats = {
  total: 10,
  open: 3,
  investigating: 4,
  resolvedToday: 2,
  critical: 2,
  teamsDeployed: 5,
  avgResolution: "2h 18m",
};

export const incidents: Incident[] = [
  {
    id: "INC-2025-001",
    title: "Tourist Fall — Critical Head Injury",
    type: "Injury / Fall",
    severity: "critical",
    status: "investigating",
    location: "Rocky Ridge Pass, Sector 7",
    coordinates: { lat: 30.69, lng: 79.46 },
    reportedAt: "2025-05-20T10:25:00",
    updatedAt: "2025-05-20T10:45:00",
    reportedBy: "System Auto-Detect (T003 Device)",
    assignedTeam: "Search & Rescue Alpha",
    leadInvestigator: "Ranger Mike Chen",
    involvedTourists: [
      { id: "T003", name: "James Wilson", status: "injured" },
    ],
    description:
      "Automatic fall detection triggered on T003 device. Tourist non-responsive to device check-in prompts. Heart rate elevated at 142 bpm. Medical evacuation helicopter dispatched.",
    rootCause: "Under investigation — possible loose rock on trail",
    timeline: [
      { time: "10:25 AM", actor: "System", action: "Fall detected, alert triggered", note: "Impact sensor reading: 4.2G" },
      { time: "10:26 AM", actor: "System", action: "Emergency services notified", note: "GPS coordinates transmitted" },
      { time: "10:30 AM", actor: "Ranger Mike Chen", action: "Dispatched to location", note: "ETA 12 minutes" },
      { time: "10:35 AM", actor: "Med Team", action: "Helicopter med-evac requested", note: "Landing zone: Rocky Ridge Flat" },
      { time: "10:45 AM", actor: "Ranger Mike Chen", action: "On scene — vitals stable", note: "Tourist conscious, suspected concussion" },
    ],
    documents: 3,
  },
  {
    id: "INC-2025-002",
    title: "SOS Activation — River Side Camp",
    type: "SOS Activation",
    severity: "high",
    status: "resolved",
    location: "River Side Camp, Zone B",
    coordinates: { lat: 30.65, lng: 79.47 },
    reportedAt: "2025-05-20T10:16:00",
    updatedAt: "2025-05-20T10:35:00",
    resolvedAt: "2025-05-20T10:35:00",
    reportedBy: "Tourist T045 Device",
    assignedTeam: "Response Team Beta",
    leadInvestigator: "Officer Priya Nair",
    involvedTourists: [
      { id: "T045", name: "Arjun Mehta", status: "safe" },
    ],
    description:
      "Physical SOS button pressed. Tourist reported feeling disoriented and dehydrated. Response team reached location within 14 minutes. Tourist provided fluids and escorted back to base camp.",
    resolution: "Tourist stabilized. No further medical attention required. Advised rest and hydration.",
    timeline: [
      { time: "10:16 AM", actor: "T045", action: "SOS button pressed", note: "Duration: 3 seconds" },
      { time: "10:17 AM", actor: "System", action: "Alert broadcast to Response Team Beta", note: "" },
      { time: "10:20 AM", actor: "Officer Priya Nair", action: "Team dispatched", note: "2 personnel, ATV unit" },
      { time: "10:30 AM", actor: "Officer Priya Nair", action: "On scene", note: "Tourist conscious, mild dehydration" },
      { time: "10:35 AM", actor: "Officer Priya Nair", action: "Incident resolved", note: "Escorted to base camp" },
    ],
    documents: 2,
  },
  {
    id: "INC-2025-003",
    title: "Lost Group — North Forest Area",
    type: "Lost / Missing",
    severity: "high",
    status: "investigating",
    location: "North Forest Area, Trail 4B",
    coordinates: { lat: 30.74, lng: 79.49 },
    reportedAt: "2025-05-20T10:18:00",
    updatedAt: "2025-05-20T10:50:00",
    reportedBy: "Geofence System",
    assignedTeam: "Search & Rescue Alpha",
    leadInvestigator: "Ranger Lakshmi Iyer",
    involvedTourists: [
      { id: "T087", name: "Priya Nair", status: "missing" },
      { id: "T102", name: "Rohan Gupta", status: "missing" },
      { id: "T103", name: "Simran Kaur", status: "missing" },
      { id: "T104", name: "Aryan Shah", status: "missing" },
    ],
    description:
      "Group of 4 tourists exited designated safe zone 32 minutes ago. GPS signals intermittent due to dense canopy. Last known heading: northeast toward unmarked trail. Drone search initiated.",
    rootCause: "Under investigation — possible trail marker vandalism",
    timeline: [
      { time: "09:46 AM", actor: "System", action: "Safe zone exit detected", note: "Group: Beta-4" },
      { time: "10:18 AM", actor: "System", action: "Escalated to incident", note: "No return after timeout" },
      { time: "10:20 AM", actor: "Ranger Lakshmi Iyer", action: "Search team mobilized", note: "Ground + drone unit" },
      { time: "10:35 AM", actor: "Drone Unit", action: "Thermal scan initiated", note: "Sector 4B-7C" },
      { time: "10:50 AM", actor: "Ranger Lakshmi Iyer", action: "Possible visual contact", note: "Smoke signal spotted 2km NE" },
    ],
    documents: 1,
  },
  {
    id: "INC-2025-004",
    title: "Wildlife Encounter — Bear Sighting",
    type: "Wildlife Encounter",
    severity: "medium",
    status: "resolved",
    location: "Sunset View Point",
    coordinates: { lat: 30.75, lng: 79.45 },
    reportedAt: "2025-05-20T10:00:00",
    updatedAt: "2025-05-20T10:22:00",
    resolvedAt: "2025-05-20T10:22:00",
    reportedBy: "Tourist T056 (Panic Button)",
    assignedTeam: "Ranger Unit 3",
    leadInvestigator: "Ranger David Okafor",
    involvedTourists: [
      { id: "T056", name: "Ananya Desai", status: "safe" },
    ],
    description:
      "Tourist reported black bear sighting approximately 50m from trail. Tourist used panic button. Rangers cleared area and confirmed bear had moved on. Trail temporarily closed as precaution.",
    resolution: "Area secured. No aggressive behavior observed. Trail reopened after 20-minute closure.",
    timeline: [
      { time: "10:00 AM", actor: "T056", action: "Panic button triggered", note: "Voice: 'Bear nearby'" },
      { time: "10:02 AM", actor: "System", action: "Trail closure initiated", note: "Sunset View Point" },
      { time: "10:10 AM", actor: "Ranger David Okafor", action: "On scene", note: "Bear tracks confirmed, no sighting" },
      { time: "10:22 AM", actor: "Ranger David Okafor", action: "Trail reopened", note: "Bear moved north per camera trap" },
    ],
    documents: 2,
  },
  {
    id: "INC-2025-005",
    title: "Mass Device Malfunction — GPS Drift",
    type: "Device Failure",
    severity: "medium",
    status: "escalated",
    location: "Multiple locations",
    coordinates: { lat: 30.70, lng: 79.48 },
    reportedAt: "2025-05-20T09:45:00",
    updatedAt: "2025-05-20T10:15:00",
    reportedBy: "System Monitor",
    assignedTeam: "Tech Support + Field Ops",
    leadInvestigator: "Engineer Sarah Kim",
    involvedTourists: [
      { id: "T012", name: "David Chen", status: "safe" },
      { id: "T021", name: "Emma Wilson", status: "safe" },
      { id: "T034", name: "Raj Patel", status: "safe" },
      { id: "T041", name: "Lisa Wong", status: "safe" },
      { id: "T055", name: "Tom Bradley", status: "safe" },
      { id: "T066", name: "Nina Petrova", status: "safe" },
      { id: "T078", name: "Carlos Mendez", status: "safe" },
      { id: "T089", name: "Yuki Tanaka", status: "safe" },
      { id: "T092", name: "Ahmed Hassan", status: "safe" },
      { id: "T095", name: "Olivia Brown", status: "safe" },
      { id: "T099", name: "Liam O'Brien", status: "safe" },
      { id: "T101", name: "Sofia Rossi", status: "safe" },
    ],
    description:
      "12 devices experienced simultaneous GPS coordinate drift of ~200m starting 09:45. Firmware bug suspected in v2.4.1 batch. All affected tourists visually confirmed safe via ranger check-ins.",
    rootCause: "Firmware v2.4.1 GPS module bug — under patch review",
    timeline: [
      { time: "09:45 AM", actor: "System", action: "Anomaly detected", note: "12 devices, coordinate drift >150m" },
      { time: "09:50 AM", actor: "Engineer Sarah Kim", action: "Remote diagnostic initiated", note: "Firmware v2.4.1 identified" },
      { time: "10:00 AM", actor: "Field Ops", action: "Visual confirmation requested", note: "All rangers in affected sectors" },
      { time: "10:15 AM", actor: "Engineer Sarah Kim", action: "Escalated to dev team", note: "Rollback to v2.3.8 prepared" },
    ],
    documents: 4,
  },
  {
    id: "INC-2025-006",
    title: "Heat Exhaustion — Hill Top Trail",
    type: "Medical Emergency",
    severity: "high",
    status: "resolved",
    location: "Hill Top Trail, Checkpoint 3",
    coordinates: { lat: 30.71, lng: 79.44 },
    reportedAt: "2025-05-20T10:10:00",
    updatedAt: "2025-05-20T10:40:00",
    resolvedAt: "2025-05-20T10:40:00",
    reportedBy: "Ranger Unit 2 (Visual)",
    assignedTeam: "Medical Response Team",
    leadInvestigator: "Dr. Aisha Patel",
    involvedTourists: [
      { id: "T018", name: "Vikram Singh", status: "safe" },
    ],
    description:
      "Ranger observed tourist collapsed near checkpoint. Heart rate 102 bpm, skin flushed. Diagnosed as heat exhaustion. IV fluids administered on site. Tourist recovered sufficiently to walk back with assistance.",
    resolution: "Tourist stable. Advised to avoid strenuous activity for remainder of day. Monitoring vitals.",
    timeline: [
      { time: "10:10 AM", actor: "Ranger Unit 2", action: "Visual distress observed", note: "Tourist seated on ground" },
      { time: "10:12 AM", actor: "Ranger Unit 2", action: "Medical team called", note: "Heat exhaustion suspected" },
      { time: "10:20 AM", actor: "Dr. Aisha Patel", action: "On scene", note: "IV fluids started" },
      { time: "10:40 AM", actor: "Dr. Aisha Patel", action: "Incident resolved", note: "Vitals normalized" },
    ],
    documents: 3,
  },
  {
    id: "INC-2025-007",
    title: "Stranded at Eagle Peak Base",
    type: "Environmental Hazard",
    severity: "medium",
    status: "investigating",
    location: "Eagle Peak Base Camp",
    coordinates: { lat: 30.73, lng: 79.52 },
    reportedAt: "2025-05-20T10:05:00",
    updatedAt: "2025-05-20T10:30:00",
    reportedBy: "Tourist T033 (Signal Restored)",
    assignedTeam: "Response Team Alpha",
    leadInvestigator: "Ranger James O'Connor",
    involvedTourists: [
      { id: "T033", name: "Ravi Kumar", status: "safe" },
    ],
    description:
      "Tourist stranded for 8 minutes due to sudden rockslide blocking return path. Signal was lost during event. Tourist uninjured but path impassable. Engineering team assessing trail stability.",
    rootCause: "Rockslide — geological survey pending",
    timeline: [
      { time: "09:57 AM", actor: "System", action: "Signal lost", note: "T033 Eagle Peak" },
      { time: "10:05 AM", actor: "T033", action: "Signal restored, SOS sent", note: "Rockslide blocking trail" },
      { time: "10:10 AM", actor: "Ranger James O'Connor", action: "Team dispatched", note: "Alternate route identified" },
      { time: "10:30 AM", actor: "Ranger James O'Connor", action: "Tourist evacuated", note: "Via alternate south ridge" },
    ],
    documents: 2,
  },
  {
    id: "INC-2025-008",
    title: "Snake Bite — Venomous Species Suspected",
    type: "Medical Emergency",
    severity: "critical",
    status: "resolved",
    location: "Lakeview Park, South Edge",
    coordinates: { lat: 30.68, lng: 79.50 },
    reportedAt: "2025-05-20T09:30:00",
    updatedAt: "2025-05-20T09:55:00",
    resolvedAt: "2025-05-20T09:55:00",
    reportedBy: "Tourist T091 (Phone Call)",
    assignedTeam: "Med Evac + Anti-Venom Unit",
    leadInvestigator: "Dr. Rajesh Gupta",
    involvedTourists: [
      { id: "T091", name: "Sarah Johnson", status: "evacuated" },
    ],
    description:
      "Tourist bitten by unidentified snake near lake edge. Anti-venom administered within 18 minutes. Helicopter transport to Lakeview General Hospital. Species later identified as non-venomous grass snake — precautionary treatment completed.",
    resolution: "Tourist discharged after 4-hour observation. No envenomation confirmed.",
    timeline: [
      { time: "09:30 AM", actor: "T091", action: "Emergency call", note: "Snake bite, lower leg" },
      { time: "09:32 AM", actor: "System", action: "GPS lock, med-evac dispatched", note: "Anti-venom kit loaded" },
      { time: "09:40 AM", actor: "Dr. Rajesh Gupta", action: "On scene", note: "Wound cleaned, anti-venom given" },
      { time: "09:55 AM", actor: "Dr. Rajesh Gupta", action: "Airlift complete", note: "Hospital handoff successful" },
    ],
    documents: 5,
  },
  {
    id: "INC-2025-009",
    title: "Flash Flood Warning — Group Evacuation",
    type: "Evacuation",
    severity: "high",
    status: "closed",
    location: "Gamma Group Campsite, River Valley",
    coordinates: { lat: 30.66, lng: 79.47 },
    reportedAt: "2025-05-20T08:00:00",
    updatedAt: "2025-05-20T09:15:00",
    resolvedAt: "2025-05-20T09:15:00",
    reportedBy: "Weather Monitoring System",
    assignedTeam: "Emergency Response + All Rangers",
    leadInvestigator: "Commander Arjun Mehta",
    involvedTourists: [
      { id: "T024", name: "Neha Verma", status: "evacuated" },
      { id: "T056", name: "Ananya Desai", status: "evacuated" },
      { id: "T077", name: "Lakshmi Iyer", status: "evacuated" },
      { id: "T088", name: "Karan Malhotra", status: "evacuated" },
      { id: "T090", name: "Divya Reddy", status: "evacuated" },
    ],
    description:
      "Automated weather alert triggered flash flood warning for River Valley. 23 tourists evacuated to high ground within 35 minutes. No injuries. Campsite sustained minor equipment damage.",
    resolution: "All personnel accounted for. Flood peak passed at 09:10. Campsite secured.",
    timeline: [
      { time: "08:00 AM", actor: "Weather System", action: "Flash flood warning issued", note: "River level rising 15cm/hr" },
      { time: "08:05 AM", actor: "Commander Arjun Mehta", action: "Evacuation order given", note: "All campsites downstream" },
      { time: "08:35 AM", actor: "Emergency Response", action: "Evacuation complete", note: "23 tourists to high ground" },
      { time: "09:15 AM", actor: "Commander Arjun Mehta", action: "Incident closed", note: "Area declared safe" },
    ],
    documents: 6,
  },
  {
    id: "INC-2025-010",
    title: "Theft Report — Base Camp Locker",
    type: "Security",
    severity: "low",
    status: "closed",
    location: "Base Camp, Locker Zone C",
    coordinates: { lat: 30.70, lng: 79.48 },
    reportedAt: "2025-05-20T07:45:00",
    updatedAt: "2025-05-20T08:30:00",
    resolvedAt: "2025-05-20T08:30:00",
    reportedBy: "Tourist T029",
    assignedTeam: "Security Unit",
    leadInvestigator: "Officer Sarah Johnson",
    involvedTourists: [
      { id: "T029", name: "Mohammed Ali", status: "safe" },
    ],
    description:
      "Tourist reported missing wallet from communal locker. Security footage reviewed. Identified as misplaced inside tent by tourist. Item recovered.",
    resolution: "Wallet found inside tent pocket. No theft occurred. Tourist apologized for false report.",
    timeline: [
      { time: "07:45 AM", actor: "T029", action: "Theft reported", note: "Wallet missing from locker" },
      { time: "08:00 AM", actor: "Officer Sarah Johnson", action: "Footage review started", note: "Locker area cameras" },
      { time: "08:20 AM", actor: "Officer Sarah Johnson", action: "Tent search", note: "Wallet found in tent pocket" },
      { time: "08:30 AM", actor: "Officer Sarah Johnson", action: "Incident closed", note: "False report, item recovered" },
    ],
    documents: 1,
  },
];