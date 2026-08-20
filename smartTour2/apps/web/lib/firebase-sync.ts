import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import type {
  Tourist,
  Alert,
  Incident,
  Device,
  Geofence,
  Message,
  Report,
  Conversation,
} from "./types";
import type {
  TouristRecord,
  AlertRecord,
  ActivityRecord,
  DashboardData,
  TouristStatus as ApiTouristStatus,
} from "@/lib/smarttour-api";

export const COLLECTIONS = {
  TOURISTS: "tourists",
  ALERTS: "alerts",
  INCIDENTS: "incidents",
  DEVICES: "devices",
  GEOFENCES: "geofences",
  MESSAGES: "messages",
  REPORTS: "reports",
  CONVERSATIONS: "conversations",
  ACTIVITIES: "activities",
  ANALYTICS: "analytics",
  DISPATCHES: "dispatches",
} as const;

// ══════════════════════════════════════════════════════════════
// REALTIME LISTENERS FOR GLOBAL STORE
// ══════════════════════════════════════════════════════════════

export function subscribeToStoreTourists(
  onUpdate: (tourists: Tourist[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.TOURISTS), (snapshot) => {
      if (snapshot.empty) return;
      const items: Tourist[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || "Unknown Tourist",
          status: data.status || "active",
          location: data.location || { lat: Number(data.latitude || 0), lng: Number(data.longitude || 0) },
          lastSeen: data.lastSeen || data.last_updated || "Just now",
          deviceId: data.deviceId || data.wearable_id || "",
          emergencyContact: data.emergencyContact || data.phone,
          medicalInfo: data.medicalInfo,
          currentZone: data.currentZone || data.group,
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore tourists subscription error:", e);
    return null;
  }
}

export function subscribeToStoreAlerts(
  onUpdate: (alerts: Alert[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.ALERTS), (snapshot) => {
      if (snapshot.empty) return;
      const items: Alert[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          type: data.type || "geofence_breach",
          priority: data.priority || data.severity || "normal",
          status: data.status || "active",
          touristId: data.touristId || data.tourist_id,
          deviceId: data.deviceId,
          location: data.location || { lat: Number(data.latitude || 0), lng: Number(data.longitude || 0) },
          message: data.message || "Alert reported",
          timestamp: data.timestamp || new Date().toISOString(),
          acknowledgedBy: data.acknowledgedBy,
          acknowledgedAt: data.acknowledgedAt,
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore alerts subscription error:", e);
    return null;
  }
}

export function subscribeToStoreIncidents(
  onUpdate: (incidents: Incident[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.INCIDENTS), (snapshot) => {
      if (snapshot.empty) return;
      const items: Incident[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          type: data.type || "other",
          status: data.status || "active",
          priority: data.priority || "normal",
          touristId: data.touristId,
          location: data.location || { lat: 0, lng: 0 },
          description: data.description || "",
          reportedAt: data.reportedAt || new Date().toISOString(),
          reportedBy: data.reportedBy || "System",
          assignedTeam: data.assignedTeam,
          resolvedAt: data.resolvedAt,
          resolution: data.resolution,
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore incidents subscription error:", e);
    return null;
  }
}

export function subscribeToStoreDevices(
  onUpdate: (devices: Device[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.DEVICES), (snapshot) => {
      if (snapshot.empty) return;
      const items: Device[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          model: data.model || "TourGuard Pro",
          status: data.status || "online",
          batteryLevel: Number(data.batteryLevel ?? data.battery ?? 100),
          lastSeen: data.lastSeen || "Just now",
          assignedTouristId: data.assignedTouristId || data.tourist_id,
          firmwareVersion: data.firmwareVersion || "1.0.0",
          signalStrength: Number(data.signalStrength ?? data.signal ?? 100),
          location: data.location,
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore devices subscription error:", e);
    return null;
  }
}

export function subscribeToStoreGeofences(
  onUpdate: (geofences: Geofence[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.GEOFENCES), (snapshot) => {
      if (snapshot.empty) return;
      const items: Geofence[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          name: data.name || "Geofence Zone",
          status: data.status || "active",
          type: data.type || "circle",
          coordinates: data.coordinates || [],
          radius: data.radius,
          maxCapacity: data.maxCapacity,
          currentOccupancy: Number(data.currentOccupancy ?? 0),
          breachCount24h: Number(data.breachCount24h ?? 0),
          autoLockdown: Boolean(data.autoLockdown),
          rules: data.rules || [],
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore geofences subscription error:", e);
    return null;
  }
}

export function subscribeToStoreMessages(
  onUpdate: (messages: Message[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.MESSAGES), (snapshot) => {
      if (snapshot.empty) return;
      const items: Message[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          type: data.type || "broadcast",
          priority: data.priority || "normal",
          sender: data.sender || "Admin",
          senderRole: data.senderRole || "Operator",
          recipients: data.recipients || [],
          recipientCount: Number(data.recipientCount ?? 1),
          subject: data.subject || "Message",
          body: data.body || "",
          sentAt: data.sentAt || new Date().toISOString(),
          status: data.status || "delivered",
          readCount: data.readCount,
          replyCount: data.replyCount,
          channel: data.channel || "all",
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore messages subscription error:", e);
    return null;
  }
}

export function subscribeToStoreReports(
  onUpdate: (reports: Report[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.REPORTS), (snapshot) => {
      if (snapshot.empty) return;
      const items: Report[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || "Report",
          type: data.type || "summary",
          status: data.status || "ready",
          generatedAt: data.generatedAt || new Date().toISOString(),
          generatedBy: data.generatedBy || "System",
          fileSize: data.fileSize || "1.2 MB",
          format: data.format || "pdf",
          pages: Number(data.pages ?? 1),
          records: Number(data.records ?? 0),
          description: data.description || "",
          coverDate: data.coverDate || new Date().toISOString(),
          sections: data.sections || [],
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore reports subscription error:", e);
    return null;
  }
}

export function subscribeToStoreConversations(
  onUpdate: (conversations: Conversation[]) => void
): Unsubscribe | null {
  const db = getFirebaseDb();
  if (!db) return null;

  try {
    return onSnapshot(collection(db, COLLECTIONS.CONVERSATIONS), (snapshot) => {
      if (snapshot.empty) return;
      const items: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          touristId: data.touristId || "",
          touristName: data.touristName || "Tourist",
          touristStatus: data.touristStatus || "active",
          lastMessage: data.lastMessage || "",
          lastMessageTime: data.lastMessageTime || new Date().toISOString(),
          unread: Number(data.unread ?? 0),
          messages: data.messages || [],
        });
      });
      onUpdate(items);
    });
  } catch (e) {
    console.warn("Firestore conversations subscription error:", e);
    return null;
  }
}

// ══════════════════════════════════════════════════════════════
// CLOUD MUTATION HELPERS
// ══════════════════════════════════════════════════════════════

export async function saveTouristToCloud(tourist: Tourist): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.TOURISTS, tourist.id), {
    ...tourist,
    updated_at: serverTimestamp(),
  }, { merge: true });
}

export async function saveDemoLocationToCloud(location: { lat: number; lng: number; activity?: string }): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const batch = writeBatch(db);
  const timestamp = serverTimestamp();
  batch.set(doc(db, COLLECTIONS.TOURISTS, "T-DEMO-01"), {
    latitude: location.lat,
    longitude: location.lng,
    location: "Live device location",
    activity: location.activity ?? "Moving",
    last_updated: timestamp,
  }, { merge: true });
  batch.set(doc(db, COLLECTIONS.DEVICES, "DEV-1001"), {
    connected: true,
    status: "online",
    last_seen: timestamp,
  }, { merge: true });
  batch.set(doc(db, COLLECTIONS.ANALYTICS, "T-DEMO-01"), {
    current_zone: "Live device location",
    zone_status: "Live location received",
    last_updated: timestamp,
  }, { merge: true });
  await batch.commit();
}

export async function updateTouristInCloud(id: string, updates: Partial<Tourist>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.TOURISTS, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function deleteTouristFromCloud(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, COLLECTIONS.TOURISTS, id));
}

export async function saveAlertToCloud(alert: Alert): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.ALERTS, alert.id), {
    ...alert,
    created_at: serverTimestamp(),
  }, { merge: true });
}

export async function updateAlertInCloud(id: string, updates: Partial<Alert>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.ALERTS, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function saveIncidentToCloud(incident: Incident): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.INCIDENTS, incident.id), {
    ...incident,
    created_at: serverTimestamp(),
  }, { merge: true });
}

export async function updateIncidentInCloud(id: string, updates: Partial<Incident>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.INCIDENTS, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function saveDeviceToCloud(device: Device): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.DEVICES, device.id), {
    ...device,
    updated_at: serverTimestamp(),
  }, { merge: true });
}

export async function updateDeviceInCloud(id: string, updates: Partial<Device>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.DEVICES, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function deleteDeviceFromCloud(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, COLLECTIONS.DEVICES, id));
}

export async function saveGeofenceToCloud(geofence: Geofence): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.GEOFENCES, geofence.id), {
    ...geofence,
    updated_at: serverTimestamp(),
  }, { merge: true });
}

export async function updateGeofenceInCloud(id: string, updates: Partial<Geofence>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.GEOFENCES, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function deleteGeofenceFromCloud(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await deleteDoc(doc(db, COLLECTIONS.GEOFENCES, id));
}

export async function saveMessageToCloud(message: Message): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), {
    ...message,
    created_at: serverTimestamp(),
  }, { merge: true });
}

export async function saveReportToCloud(report: Report): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.REPORTS, report.id), {
    ...report,
    updated_at: serverTimestamp(),
  }, { merge: true });
}

export async function saveConversationToCloud(conversation: Conversation): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await setDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversation.id), {
    ...conversation,
    updated_at: serverTimestamp(),
  }, { merge: true });
}

export async function updateConversationInCloud(id: string, updates: Partial<Conversation>): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, id), {
    ...updates,
    updated_at: serverTimestamp(),
  });
}

export async function resolveAlertInCloud(alertId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;
  await updateDoc(doc(db, COLLECTIONS.ALERTS, alertId), {
    status: "resolved",
    resolved_at: serverTimestamp(),
  });
}

export async function dispatchRescueInCloud(
  touristId: string,
  responderNotes = "Emergency response unit dispatched"
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  const dispatchCol = collection(db, COLLECTIONS.DISPATCHES);
  await addDoc(dispatchCol, {
    touristId,
    status: "dispatched",
    notes: responderNotes,
    timestamp: serverTimestamp(),
  });

  const touristRef = doc(db, COLLECTIONS.TOURISTS, touristId);
  await updateDoc(touristRef, {
    status: "emergency",
    rescue_dispatched: true,
    rescue_dispatched_at: serverTimestamp(),
  });
}

// ══════════════════════════════════════════════════════════════
// ONE-CLICK CLOUD SEEDER ENGINE
// ══════════════════════════════════════════════════════════════

export async function seedAllToFirestore(initialData: {
  tourists: Tourist[];
  alerts: Alert[];
  incidents: Incident[];
  devices: Device[];
  geofences: Geofence[];
  messages: Message[];
  reports: Report[];
  conversations: Conversation[];
}): Promise<{ success: boolean; count: number; message: string }> {
  const db = getFirebaseDb();
  if (!db) {
    return { success: false, count: 0, message: "Firebase is not configured." };
  }

  try {
    const batch = writeBatch(db);
    let totalItems = 0;

    // Firestore rejects undefined values — strip them before writing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(clean);
      if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, clean(v)])
        );
      }
      return obj;
    };

    initialData.tourists.forEach((t) => {
      batch.set(doc(db, COLLECTIONS.TOURISTS, t.id), { ...clean(t), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });


    initialData.alerts.forEach((a) => {
      batch.set(doc(db, COLLECTIONS.ALERTS, a.id), { ...clean(a), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.incidents.forEach((i) => {
      batch.set(doc(db, COLLECTIONS.INCIDENTS, i.id), { ...clean(i), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.devices.forEach((d) => {
      batch.set(doc(db, COLLECTIONS.DEVICES, d.id), { ...clean(d), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.geofences.forEach((g) => {
      batch.set(doc(db, COLLECTIONS.GEOFENCES, g.id), { ...clean(g), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.messages.forEach((m) => {
      batch.set(doc(db, COLLECTIONS.MESSAGES, m.id), { ...clean(m), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.reports.forEach((r) => {
      batch.set(doc(db, COLLECTIONS.REPORTS, r.id), { ...clean(r), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    initialData.conversations.forEach((c) => {
      batch.set(doc(db, COLLECTIONS.CONVERSATIONS, c.id), { ...clean(c), seeded_at: serverTimestamp() }, { merge: true });
      totalItems++;
    });

    await batch.commit();
    return {
      success: true,
      count: totalItems,
      message: `Successfully seeded ${totalItems} records across 8 collections to Firebase Cloud Firestore!`,
    };
  } catch (err: any) {
    console.error("Firebase seeding error:", err);
    return {
      success: false,
      count: 0,
      message: `Seeding error: ${err?.message || "Failed to commit batch to Firestore"}`,
    };
  }
}
