export type GeofenceType = "circle" | "polygon";
export type GeofenceStatus = "active" | "inactive" | "maintenance";
export type RuleType = "entry" | "exit" | "both";

export interface BreachEvent {
  id: string;
  touristId: string;
  touristName: string;
  type: "entry" | "exit";
  timestamp: string;
  location: string;
  resolved: boolean;
}

export interface Geofence {
  id: string;
  name: string;
  description: string;
  type: GeofenceType;
  status: GeofenceStatus;
  color: string;
  fillOpacity: number;
  coordinates: number[][]; // [lng, lat] pairs for polygon
  center?: { lat: number; lng: number };
  radius?: number; // meters for circle
  areaKm2: number;
  touristCount: number;
  maxCapacity?: number;
  breachCount24h: number;
  totalBreaches: number;
  lastBreached?: string;
  rule: RuleType;
  alertOnBreach: boolean;
  autoLockdown: boolean;
  associatedGroups: string[];
  createdAt: string;
  createdBy: string;
  recentBreaches: BreachEvent[];
}

export const geofenceStats = {
  total: 8,
  active: 6,
  inactive: 1,
  maintenance: 1,
  breached24h: 4,
  touristsInside: 89,
  coverageKm2: 12.4,
};

export const geofences: Geofence[] = [
  {
    id: "GF-001",
    name: "Base Camp Perimeter",
    description: "Primary safety boundary around the main tourist base camp including lodging, medical station, and parking.",
    type: "circle",
    status: "active",
    color: "#3b82f6",
    fillOpacity: 0.12,
    coordinates: [],
    center: { lat: 30.70, lng: 79.48 },
    radius: 800,
    areaKm2: 2.01,
    touristCount: 34,
    maxCapacity: 150,
    breachCount24h: 0,
    totalBreaches: 12,
    rule: "exit",
    alertOnBreach: true,
    autoLockdown: false,
    associatedGroups: ["Alpha", "Beta", "Gamma", "Solo"],
    createdAt: "2025-01-15T08:00:00",
    createdBy: "Admin",
    recentBreaches: [],
  },
  {
    id: "GF-002",
    name: "Pine Trail Corridor",
    description: "Linear safe zone following the Pine Trail from base to Lakeview Point. Monitored for off-trail deviation.",
    type: "polygon",
    status: "active",
    color: "#10b981",
    fillOpacity: 0.1,
    coordinates: [
      [79.47, 30.71],
      [79.49, 30.72],
      [79.50, 30.70],
      [79.48, 30.69],
      [79.47, 30.71],
    ],
    areaKm2: 1.45,
    touristCount: 18,
    breachCount24h: 2,
    totalBreaches: 28,
    lastBreached: "2025-05-20T10:18:00",
    rule: "both",
    alertOnBreach: true,
    autoLockdown: false,
    associatedGroups: ["Alpha", "Solo"],
    createdAt: "2025-02-01T10:00:00",
    createdBy: "Ranger Mike Chen",
    recentBreaches: [
      {
        id: "BR-021",
        touristId: "T087",
        touristName: "Priya Nair",
        type: "exit",
        timestamp: "2025-05-20T10:18:00",
        location: "North Forest Edge",
        resolved: false,
      },
      {
        id: "BR-020",
        touristId: "T012",
        touristName: "David Chen",
        type: "exit",
        timestamp: "2025-05-20T09:30:00",
        location: "Pine Trail Junction",
        resolved: true,
      },
    ],
  },
  {
    id: "GF-003",
    name: "Lakeview Park Zone",
    description: "Recreational area around Lakeview Park with swimming and picnic restrictions after sunset.",
    type: "polygon",
    status: "active",
    color: "#06b6d4",
    fillOpacity: 0.1,
    coordinates: [
      [79.49, 30.67],
      [79.51, 30.67],
      [79.51, 30.69],
      [79.49, 30.69],
      [79.49, 30.67],
    ],
    areaKm2: 2.80,
    touristCount: 22,
    maxCapacity: 60,
    breachCount24h: 1,
    totalBreaches: 8,
    lastBreached: "2025-05-20T09:45:00",
    rule: "entry",
    alertOnBreach: true,
    autoLockdown: false,
    associatedGroups: ["Beta", "Gamma"],
    createdAt: "2025-02-10T14:00:00",
    createdBy: "Admin",
    recentBreaches: [
      {
        id: "BR-019",
        touristId: "T091",
        touristName: "Sarah Johnson",
        type: "entry",
        timestamp: "2025-05-20T09:45:00",
        location: "South Edge",
        resolved: true,
      },
    ],
  },
  {
    id: "GF-004",
    name: "Rocky Ridge Restricted",
    description: "HIGH RISK zone. Unstable rock formations. Entry strictly prohibited without guide escort.",
    type: "polygon",
    status: "active",
    color: "#ef4444",
    fillOpacity: 0.2,
    coordinates: [
      [79.45, 30.68],
      [79.47, 30.68],
      [79.47, 30.70],
      [79.45, 30.70],
      [79.45, 30.68],
    ],
    areaKm2: 1.92,
    touristCount: 0,
    breachCount24h: 1,
    totalBreaches: 3,
    lastBreached: "2025-05-20T10:25:00",
    rule: "entry",
    alertOnBreach: true,
    autoLockdown: true,
    associatedGroups: [],
    createdAt: "2025-03-01T09:00:00",
    createdBy: "Ranger Lakshmi Iyer",
    recentBreaches: [
      {
        id: "BR-022",
        touristId: "T003",
        touristName: "James Wilson",
        type: "entry",
        timestamp: "2025-05-20T10:25:00",
        location: "Rocky Ridge Pass",
        resolved: false,
      },
    ],
  },
  {
    id: "GF-005",
    name: "Hill Top Trail Safe Zone",
    description: "Designated safe corridor for Hill Top Trail hikers. Emergency shelters at checkpoints 1, 3, and 5.",
    type: "polygon",
    status: "active",
    color: "#8b5cf6",
    fillOpacity: 0.1,
    coordinates: [
      [79.43, 30.70],
      [79.45, 30.72],
      [79.46, 30.71],
      [79.44, 30.69],
      [79.43, 30.70],
    ],
    areaKm2: 1.60,
    touristCount: 8,
    breachCount24h: 1,
    totalBreaches: 15,
    lastBreached: "2025-05-20T10:22:00",
    rule: "exit",
    alertOnBreach: true,
    autoLockdown: false,
    associatedGroups: ["Beta"],
    createdAt: "2025-03-15T11:00:00",
    createdBy: "Admin",
    recentBreaches: [
      {
        id: "BR-023",
        touristId: "T024",
        touristName: "Neha Verma",
        type: "exit",
        timestamp: "2025-05-20T10:22:00",
        location: "Near Hill Top Trail",
        resolved: false,
      },
    ],
  },
  {
    id: "GF-006",
    name: "River Side Camp",
    description: "Overnight camping zone along the river. Flood monitoring enabled. Auto-evacuate on weather alert.",
    type: "circle",
    status: "active",
    color: "#f59e0b",
    fillOpacity: 0.12,
    coordinates: [],
    center: { lat: 30.65, lng: 79.47 },
    radius: 500,
    areaKm2: 0.79,
    touristCount: 4,
    maxCapacity: 25,
    breachCount24h: 1,
    totalBreaches: 6,
    lastBreached: "2025-05-20T10:16:00",
    rule: "both",
    alertOnBreach: true,
    autoLockdown: true,
    associatedGroups: ["Gamma"],
    createdAt: "2025-04-01T08:00:00",
    createdBy: "Commander Arjun Mehta",
    recentBreaches: [
      {
        id: "BR-024",
        touristId: "T045",
        touristName: "Arjun Mehta",
        type: "exit",
        timestamp: "2025-05-20T10:16:00",
        location: "Zone B Perimeter",
        resolved: false,
      },
    ],
  },
  {
    id: "GF-007",
    name: "Eagle Peak Summit",
    description: "Summit area with high-altitude weather exposure. Entry restricted during wind speeds >40km/h.",
    type: "circle",
    status: "maintenance",
    color: "#64748b",
    fillOpacity: 0.1,
    coordinates: [],
    center: { lat: 30.73, lng: 79.52 },
    radius: 300,
    areaKm2: 0.28,
    touristCount: 0,
    breachCount24h: 0,
    totalBreaches: 2,
    rule: "entry",
    alertOnBreach: true,
    autoLockdown: false,
    associatedGroups: ["Solo"],
    createdAt: "2025-04-10T10:00:00",
    createdBy: "Admin",
    recentBreaches: [],
  },
  {
    id: "GF-008",
    name: "Sunset View Point",
    description: "Scenic overlook with crowd control measures. Max 40 tourists during golden hour.",
    type: "polygon",
    status: "inactive",
    color: "#ec4899",
    fillOpacity: 0.1,
    coordinates: [
      [79.44, 30.74],
      [79.46, 30.74],
      [79.46, 30.76],
      [79.44, 30.76],
      [79.44, 30.74],
    ],
    areaKm2: 1.55,
    touristCount: 0,
    maxCapacity: 40,
    breachCount24h: 0,
    totalBreaches: 5,
    rule: "both",
    alertOnBreach: false,
    autoLockdown: false,
    associatedGroups: [],
    createdAt: "2025-05-01T09:00:00",
    createdBy: "Admin",
    recentBreaches: [],
  },
];