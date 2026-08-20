export type TouristStatus = "safe" | "warning" | "emergency";
export type AlertSeverity = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface TouristRecord {
  id: string;
  name: string;
  status: TouristStatus;
  latitude: number | null;
  longitude: number | null;
  heart_rate: number | null;
  heart_rate_variability: number | null;
  spo2: number | null;
  body_temperature: number | null;
  blood_pressure: { systolic: number; diastolic: number } | null;
  battery: number | null;
  activity: string;
  risk_score: number;
  wearable_id: string;
  last_updated: string;
  location: string;
  email: string;
  phone: string;
  group: string;
}

export interface AlertRecord {
  id: string;
  tourist_id: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  message: string;
  location: string;
  latitude: number;
  longitude: number;
  heart_rate?: number;
  battery?: number;
}

export interface WearableRecord {
  id: string;
  tourist_id: string;
  status: string;
  battery: number | null;
  heart_rate: number | null;
  heart_rate_variability: number | null;
  spo2: number | null;
  body_temperature: number | null;
  blood_pressure: { systolic: number; diastolic: number } | null;
  last_seen: string;
  signal: number;
  connected: boolean;
  sensor_status: string;
}

export interface ActivityRecord {
  id: string;
  tourist_id: string;
  event: string;
  location: string;
  timestamp: string;
  status: "safe" | "warning" | "emergency" | "info";
}

export interface DashboardData {
  metrics: {
    totalTourists: number;
    safe: number;
    warning: number;
    emergency: number;
    devicesOnline: number;
    devicesActive: number;
    devicesTotal: number;
    activeAlerts: number;
  };
  tourists: TouristRecord[];
  wearables: WearableRecord[];
  alerts: AlertRecord[];
  activities: ActivityRecord[];
  analytics: PersonalAnalytics;
  mapMarkers: Array<{
    id: string;
    lat: number;
    lng: number;
    status: TouristStatus;
    label: string;
    touristId: string;
    touristName: string;
    heartRate: number | null;
    battery: number;
    lastUpdate: string;
  }>;
}

export interface PersonalAnalytics {
  tourist_id: string;
  tourist_name: string;
  device_id: string;
  live_heart_rate: number | null;
  live_battery: number | null;
  live_risk_score: number;
  distance_km: number;
  steps_count: number;
  active_duration_minutes: number;
  elevation_gain_m: number;
  current_altitude_m: number | null;
  current_speed_kmh: number | null;
  current_zone: string;
  zone_status: string;
  geofence_breaches: number;
  heart_rate_trend: Array<{ time: string; bpm: number }>;
  battery_trend: Array<{ time: string; battery: number }>;
  risk_trend: Array<{ time: string; score: number }>;
  vitals_summary: Record<string, number>;
  last_updated?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function getDashboardData(): Promise<DashboardData> {
  return fetchJson<DashboardData>("/api/dashboard");
}

export async function updateDemoTouristLocation(payload: {
  lat: number;
  lng: number;
  location?: string;
  activity?: string;
}): Promise<{ status: string }> {
  return postJson<{ status: string }>("/api/tourists/location", payload);
}

export async function getTourists(): Promise<TouristRecord[]> {
  return fetchJson<TouristRecord[]>("/api/tourists");
}

export async function getAlerts(): Promise<AlertRecord[]> {
  return fetchJson<AlertRecord[]>("/api/alerts");
}

export async function getWearables(): Promise<WearableRecord[]> {
  return fetchJson<WearableRecord[]>("/api/wearables");
}

export async function getTouristById(id: string): Promise<TouristRecord> {
  return fetchJson<TouristRecord>(`/api/tourists/${id}`);
}

export async function getAlertById(id: string): Promise<AlertRecord> {
  return fetchJson<AlertRecord>(`/api/alerts/${id}`);
}

export async function acknowledgeAlert(id: string): Promise<{ status: string; alertId: string }> {
  try {
    const { isFirebaseConfigured } = await import("@/lib/firebase");
    if (isFirebaseConfigured()) {
      const { resolveAlertInCloud } = await import("@/lib/firebase-sync");
      // Cloud update in background
      resolveAlertInCloud(id).catch(() => {});
    }
  } catch {
    /* ignore */
  }
  return postJson<{ status: string; alertId: string }>(`/api/alerts/${id}/acknowledge`);
}

export async function resolveAlert(id: string): Promise<{ status: string; alertId: string }> {
  try {
    const { isFirebaseConfigured } = await import("@/lib/firebase");
    if (isFirebaseConfigured()) {
      const { resolveAlertInCloud } = await import("@/lib/firebase-sync");
      resolveAlertInCloud(id).catch(() => {});
    }
  } catch {
    /* ignore */
  }
  return postJson<{ status: string; alertId: string }>(`/api/alerts/${id}/resolve`);
}

export async function dispatchTourist(id: string): Promise<{ status: string; touristId: string; message: string }> {
  try {
    const { isFirebaseConfigured } = await import("@/lib/firebase");
    if (isFirebaseConfigured()) {
      const { dispatchRescueInCloud } = await import("@/lib/firebase-sync");
      dispatchRescueInCloud(id).catch(() => {});
    }
  } catch {
    /* ignore */
  }
  return postJson<{ status: string; touristId: string; message: string }>(`/api/tourists/${id}/dispatch`);
}

export async function routeToTourist(
  id: string,
  origin?: { lat: number; lng: number },
): Promise<{
  distanceKm: number;
  etaMinutes: number;
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
}> {
  return postJson(`/api/tourists/${id}/route`, origin ? { origin } : undefined);
}

export function mapStatusToColor(status: TouristStatus): string {
  switch (status) {
    case "safe":
      return "#10b981";
    case "warning":
      return "#f59e0b";
    default:
      return "#ef4444";
  }
}
