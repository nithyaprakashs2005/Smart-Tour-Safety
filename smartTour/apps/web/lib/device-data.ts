export type DeviceType = "gps-band" | "sos-tag" | "smartwatch" | "beacon";
export type DeviceStatus = "online" | "offline" | "low-battery" | "maintenance";
export type SignalStrength = "strong" | "moderate" | "weak" | "none";

export interface Device {
  id: string;
  deviceId: string;
  type: DeviceType;
  status: DeviceStatus;
  battery: number; // percent, 0-100
  signal: SignalStrength;
  touristId: string | null;
  touristName: string | null;
  location: string;
  lastSync: string;
  firmwareVersion: string;
}

export const deviceTypeLabels: Record<DeviceType, string> = {
  "gps-band": "GPS Band",
  "sos-tag": "SOS Tag",
  smartwatch: "Smartwatch",
  beacon: "Fixed Beacon",
};

// Replace with a real data source (API route / DB query) — shaped to match
// the tourist records already used on the Overview and Tourists pages.
export const devices: Device[] = [
  {
    id: "DVC-1001",
    deviceId: "DVC-1001",
    type: "gps-band",
    status: "online",
    battery: 85,
    signal: "strong",
    touristId: "T001",
    touristName: "Rahul Sharma",
    location: "Pine Trail",
    lastSync: "10:24 AM",
    firmwareVersion: "2.4.1",
  },
  {
    id: "DVC-1002",
    deviceId: "DVC-1002",
    type: "smartwatch",
    status: "online",
    battery: 90,
    signal: "strong",
    touristId: "T002",
    touristName: "Ananya Patel",
    location: "Lakeview Park",
    lastSync: "10:24 AM",
    firmwareVersion: "2.4.1",
  },
  {
    id: "DVC-1003",
    deviceId: "DVC-1003",
    type: "sos-tag",
    status: "online",
    battery: 62,
    signal: "moderate",
    touristId: "T003",
    touristName: "Priya Nair",
    location: "Sunset View Point",
    lastSync: "10:21 AM",
    firmwareVersion: "2.4.0",
  },
  {
    id: "DVC-1004",
    deviceId: "DVC-1004",
    type: "gps-band",
    status: "low-battery",
    battery: 18,
    signal: "weak",
    touristId: "T018",
    touristName: "Vikram Singh",
    location: "Hill Top Trail",
    lastSync: "10:23 AM",
    firmwareVersion: "2.3.8",
  },
  {
    id: "DVC-1005",
    deviceId: "DVC-1005",
    type: "sos-tag",
    status: "online",
    battery: 76,
    signal: "strong",
    touristId: "T024",
    touristName: "Neha Verma",
    location: "Near Hill Top Trail",
    lastSync: "10:22 AM",
    firmwareVersion: "2.4.1",
  },
  {
    id: "DVC-1006",
    deviceId: "DVC-1006",
    type: "smartwatch",
    status: "offline",
    battery: 60,
    signal: "none",
    touristId: "T045",
    touristName: "Arjun Mehta",
    location: "River Side Camp",
    lastSync: "10:16 AM",
    firmwareVersion: "2.2.0",
  },
  {
    id: "DVC-1007",
    deviceId: "DVC-1007",
    type: "beacon",
    status: "online",
    battery: 94,
    signal: "strong",
    touristId: null,
    touristName: null,
    location: "Sunset View Point — trailhead beacon",
    lastSync: "10:24 AM",
    firmwareVersion: "1.9.4",
  },
  {
    id: "DVC-1008",
    deviceId: "DVC-1008",
    type: "beacon",
    status: "online",
    battery: 88,
    signal: "strong",
    touristId: null,
    touristName: null,
    location: "Hilltop Museum — entrance beacon",
    lastSync: "10:24 AM",
    firmwareVersion: "1.9.4",
  },
  {
    id: "DVC-1009",
    deviceId: "DVC-1009",
    type: "gps-band",
    status: "maintenance",
    battery: 0,
    signal: "none",
    touristId: null,
    touristName: null,
    location: "Repair Bench — Base Camp",
    lastSync: "08:10 AM",
    firmwareVersion: "2.1.0",
  },
  {
    id: "DVC-1010",
    deviceId: "DVC-1010",
    type: "sos-tag",
    status: "offline",
    battery: 12,
    signal: "none",
    touristId: null,
    touristName: null,
    location: "Last seen — North Forest Area",
    lastSync: "Yesterday, 6:45 PM",
    firmwareVersion: "2.4.1",
  },
];