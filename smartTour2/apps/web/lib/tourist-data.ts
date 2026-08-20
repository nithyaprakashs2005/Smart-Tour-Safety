export type TouristStatus = "safe" | "warning" | "emergency" | "offline";
export type Group = "Alpine Solo" | "Alpha" | "Beta" | "Gamma" | "Solo";

export interface Tourist {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: TouristStatus;
  group: Group;
  heartRate: number | null;
  heartRateVariability: number | null;
  spo2: number | null;
  bodyTemperature: number | null;
  bloodPressure: { systolic: number; diastolic: number } | null;
  lastUpdate: string;
  location: string;
  coordinates: { lat: number; lng: number };
  deviceId: string;
  deviceModel: string;
  checkInTime: string;
  emergencyContact: { name: string; phone: string; relation: string };
  medicalNotes?: string;
  history: { time: string; event: string; location: string }[];
}
