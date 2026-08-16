export interface DailyMetric {
  date: string;
  tourists: number;
  alerts: number;
  incidents: number;
  breaches: number;
  avgResponseMin: number;
}

export interface LocationMetric {
  name: string;
  visitors: number;
  capacity: number;
  avgDuration: string;
  incidents: number;
  satisfaction: number;
}

export interface TeamMetric {
  name: string;
  incidentsHandled: number;
  avgResponse: string;
  resolutionRate: number;
  onDuty: boolean;
  rating: number;
}

export interface DeviceMetric {
  model: string;
  count: number;
  online: number;
  avgBattery: number;
  failureRate: number;
}

export const dailyMetrics: DailyMetric[] = [
  { date: "May 14", tourists: 112, alerts: 3, incidents: 1, breaches: 2, avgResponseMin: 4.2 },
  { date: "May 15", tourists: 118, alerts: 5, incidents: 2, breaches: 1, avgResponseMin: 3.8 },
  { date: "May 16", tourists: 125, alerts: 4, incidents: 1, breaches: 3, avgResponseMin: 5.1 },
  { date: "May 17", tourists: 127, alerts: 8, incidents: 3, breaches: 4, avgResponseMin: 4.5 },
  { date: "May 18", tourists: 124, alerts: 6, incidents: 2, breaches: 2, avgResponseMin: 3.9 },
  { date: "May 19", tourists: 119, alerts: 2, incidents: 0, breaches: 1, avgResponseMin: 3.2 },
  { date: "May 20", tourists: 127, alerts: 8, incidents: 3, breaches: 4, avgResponseMin: 4.2 },
];

export const locationMetrics: LocationMetric[] = [
  { name: "Lakeview Park", visitors: 42, capacity: 60, avgDuration: "2h 15m", incidents: 1, satisfaction: 94 },
  { name: "Pine Trail", visitors: 35, capacity: 50, avgDuration: "3h 30m", incidents: 2, satisfaction: 91 },
  { name: "Sunset View Point", visitors: 28, capacity: 40, avgDuration: "1h 45m", incidents: 1, satisfaction: 96 },
  { name: "Hill Top Trail", visitors: 22, capacity: 35, avgDuration: "4h 10m", incidents: 3, satisfaction: 87 },
  { name: "River Side Camp", visitors: 15, capacity: 25, avgDuration: "5h 00m", incidents: 2, satisfaction: 89 },
  { name: "Eagle Peak", visitors: 8, capacity: 20, avgDuration: "6h 30m", incidents: 0, satisfaction: 92 },
];

export const teamMetrics: TeamMetric[] = [
  { name: "Search & Rescue Alpha", incidentsHandled: 12, avgResponse: "3m 45s", resolutionRate: 92, onDuty: true, rating: 4.8 },
  { name: "Response Team Beta", incidentsHandled: 8, avgResponse: "5m 12s", resolutionRate: 88, onDuty: true, rating: 4.5 },
  { name: "Ranger Unit 3", incidentsHandled: 6, avgResponse: "4m 30s", resolutionRate: 95, onDuty: true, rating: 4.9 },
  { name: "Medical Response Team", incidentsHandled: 5, avgResponse: "2m 18s", resolutionRate: 100, onDuty: true, rating: 5.0 },
  { name: "Tech Support", incidentsHandled: 3, avgResponse: "8m 00s", resolutionRate: 67, onDuty: false, rating: 4.2 },
];

export const deviceMetrics: DeviceMetric[] = [
  { model: "TourGuard Pro X2", count: 45, online: 44, avgBattery: 72, failureRate: 2.2 },
  { model: "TourGuard Pro X1", count: 52, online: 50, avgBattery: 58, failureRate: 3.8 },
  { model: "TourGuard Lite", count: 30, online: 30, avgBattery: 81, failureRate: 0.0 },
];

export const analyticsStats = {
  totalTourists: 127,
  touristTrend: "+5.2%",
  activeAlerts: 8,
  alertTrend: "-12.5%",
  avgResponseTime: "4m 12s",
  responseTrend: "-18s",
  incidentsToday: 3,
  incidentTrend: "+1",
  systemUptime: "99.97%",
  uptimeTrend: "+0.02%",
  geofenceBreaches: 4,
  breachTrend: "+2",
  devicesOnline: 124,
  deviceTrend: "+3",
};