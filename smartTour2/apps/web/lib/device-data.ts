export type DeviceType = "gps-band" | "sos-tag" | "smartwatch" | "beacon";
export type DeviceStatus = "online" | "offline" | "maintenance";
export type SignalStrength = "strong" | "moderate" | "weak" | "none";

export interface Device {
  id: string;
  deviceId: string;
  type: DeviceType;
  status: DeviceStatus;
  heartRate: number | null;
  heartRateVariability: number | null;
  spo2: number | null;
  bodyTemperature: number | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
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
