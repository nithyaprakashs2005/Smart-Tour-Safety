export interface Tourist {
  id: string;
  name: string;
  status: "safe" | "warning" | "emergency";
  heartRate: number | null;
  battery: number;
  lastUpdate: string;
  location: string;
}

export interface Alert {
  id: string;
  touristId: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

export interface Activity {
  id: string;
  touristId: string;
  event: string;
  location: string;
  timestamp: string;
  status: "emergency" | "warning" | "safe" | "info";
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  status: "safe" | "warning" | "emergency";
  label: string;
  touristId?: string;
  touristName?: string;
  heartRate?: number | null;
  battery?: number;
  alertType?: string;
  altitude?: string;
  lastUpdate?: string;
}

export const metrics = {
  totalTourists: 127,
  safe: 118,
  warning: 6,
  emergency: 3,
  devicesOnline: 98,
  devicesActive: 124,
  devicesTotal: 127,
};

export const alerts: Alert[] = [
  {
    id: "A001",
    touristId: "T024",
    type: "Fall Detected",
    description: "No movement for 45 seconds",
    location: "Near Hill Top Trail",
    timestamp: "10:22 AM",
    severity: "high",
  },
  {
    id: "A002",
    touristId: "T087",
    type: "Outside Safe Zone",
    description: "Exited designated safe zone",
    location: "North Forest Area",
    timestamp: "10:18 AM",
    severity: "medium",
  },
  {
    id: "A003",
    touristId: "T045",
    type: "SOS Activated",
    description: "SOS button pressed",
    location: "River Side Camp",
    timestamp: "10:16 AM",
    severity: "high",
  },
];

export const activities: Activity[] = [
  {
    id: "AC001",
    touristId: "T024",
    event: "Fall detected",
    location: "Near Hill Top Trail",
    timestamp: "10:22 AM",
    status: "emergency",
  },
  {
    id: "AC002",
    touristId: "T087",
    event: "Left safe zone",
    location: "North Forest Area",
    timestamp: "10:18 AM",
    status: "warning",
  },
  {
    id: "AC003",
    touristId: "T003",
    event: "Back to safe zone",
    location: "Sunset View Point",
    timestamp: "10:15 AM",
    status: "safe",
  },
  {
    id: "AC004",
    touristId: "T056",
    event: "SOS cancelled",
    location: "River Side Camp",
    timestamp: "10:12 AM",
    status: "info",
  },
];

export const tourists: Tourist[] = [
  {
    id: "T001",
    name: "Rahul Sharma",
    status: "safe",
    heartRate: 78,
    battery: 85,
    lastUpdate: "10:24 AM",
    location: "Pine Trail",
  },
  {
    id: "T002",
    name: "Ananya Patel",
    status: "safe",
    heartRate: 72,
    battery: 90,
    lastUpdate: "10:24 AM",
    location: "Lakeview Park",
  },
  {
    id: "T018",
    name: "Vikram Singh",
    status: "warning",
    heartRate: 102,
    battery: 45,
    lastUpdate: "10:23 AM",
    location: "Hill Top Trail",
  },
  {
    id: "T024",
    name: "Neha Verma",
    status: "emergency",
    heartRate: 138,
    battery: 76,
    lastUpdate: "10:22 AM",
    location: "Near Hill Top Trail",
  },
  {
    id: "T045",
    name: "Arjun Mehta",
    status: "emergency",
    heartRate: null,
    battery: 60,
    lastUpdate: "10:16 AM",
    location: "River Side Camp",
  },
];

export const mapMarkers: MapMarker[] = [
  {
    id: "M1",
    lat: 30.75,
    lng: 79.45,
    status: "safe",
    label: "Sunset View Point",
    touristId: "T003",
    touristName: "Kavita Rao",
    heartRate: 74,
    battery: 92,
    altitude: "3,120m",
    lastUpdate: "10:24 AM",
  },
  {
    id: "M2",
    lat: 30.72,
    lng: 79.48,
    status: "safe",
    label: "Pine Trail",
    touristId: "T001",
    touristName: "Rahul Sharma",
    heartRate: 78,
    battery: 85,
    altitude: "2,850m",
    lastUpdate: "10:24 AM",
  },
  {
    id: "M3",
    lat: 30.70,
    lng: 79.42,
    status: "warning",
    label: "Hilltop Museum",
    touristId: "T087",
    touristName: "Sunil Joshi",
    heartRate: 98,
    battery: 22,
    alertType: "Low Battery Warning (22%)",
    altitude: "2,980m",
    lastUpdate: "10:18 AM",
  },
  {
    id: "M4",
    lat: 30.68,
    lng: 79.50,
    status: "safe",
    label: "Lakeview Park",
    touristId: "T002",
    touristName: "Ananya Patel",
    heartRate: 72,
    battery: 90,
    altitude: "2,640m",
    lastUpdate: "10:24 AM",
  },
  {
    id: "M5",
    lat: 30.65,
    lng: 79.47,
    status: "emergency",
    label: "River Side Camp",
    touristId: "T045",
    touristName: "Arjun Mehta",
    heartRate: 145,
    battery: 60,
    alertType: "SOS Triggered - In Distress",
    altitude: "2,420m",
    lastUpdate: "10:16 AM",
  },
  {
    id: "M6",
    lat: 30.73,
    lng: 79.52,
    status: "safe",
    label: "Eagle Peak",
    touristId: "T012",
    touristName: "Pooja Hegde",
    heartRate: 80,
    battery: 78,
    altitude: "3,450m",
    lastUpdate: "10:21 AM",
  },
  {
    id: "M7",
    lat: 30.71,
    lng: 79.44,
    status: "warning",
    label: "Hill Top Trail",
    touristId: "T018",
    touristName: "Vikram Singh",
    heartRate: 102,
    battery: 45,
    alertType: "Geofence Perimeter Proximity",
    altitude: "3,010m",
    lastUpdate: "10:23 AM",
  },
  {
    id: "M8",
    lat: 30.69,
    lng: 79.46,
    status: "emergency",
    label: "Near Hill Top Trail",
    touristId: "T024",
    touristName: "Neha Verma",
    heartRate: 138,
    battery: 76,
    alertType: "Fall Detected - Impact Alarm",
    altitude: "2,890m",
    lastUpdate: "10:22 AM",
  },
  {
    id: "M9",
    lat: 30.74,
    lng: 79.49,
    status: "safe",
    label: "North Forest Area",
    touristId: "T033",
    touristName: "Manoj Bajpai",
    heartRate: 76,
    battery: 88,
    altitude: "2,730m",
    lastUpdate: "10:20 AM",
  },
  {
    id: "M10",
    lat: 30.66,
    lng: 79.51,
    status: "safe",
    label: "Camp Area",
    touristId: "T056",
    touristName: "Deepak Chahar",
    heartRate: 70,
    battery: 95,
    altitude: "2,500m",
    lastUpdate: "10:19 AM",
  },
];

export const geofenceCoords = [
  [79.40, 30.60],
  [79.55, 30.60],
  [79.55, 30.78],
  [79.40, 30.78],
  [79.40, 30.60],
];