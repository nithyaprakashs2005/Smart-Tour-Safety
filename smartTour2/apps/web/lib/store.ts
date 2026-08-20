import { create } from 'zustand';
import { 
  Tourist, 
  Alert, 
  Incident, 
  Device, 
  Geofence, 
  Message, 
  Report, 
  Conversation,
  FilterState,
  GlobalState 
} from './types';

// Computed Selectors for reactive data
export const storeSelectors = {
  // Tourist Selectors
  getActiveTourists: (state: GlobalState) => state.tourists.filter(t => t.status === 'active'),
  getEmergencyTourists: (state: GlobalState) => state.tourists.filter(t => t.status === 'emergency'),
  getTouristById: (state: GlobalState, id: string) => state.tourists.find(t => t.id === id),
  getTouristsByZone: (state: GlobalState, zone: string) => state.tourists.filter(t => t.currentZone === zone),
  
  // Alert Selectors
  getActiveAlerts: (state: GlobalState) => state.alerts.filter(a => a.status === 'active'),
  getCriticalAlerts: (state: GlobalState) => state.alerts.filter(a => a.priority === 'critical' && a.status === 'active'),
  getAlertsByTourist: (state: GlobalState, touristId: string) => state.alerts.filter(a => a.touristId === touristId),
  getAlertsByDevice: (state: GlobalState, deviceId: string) => state.alerts.filter(a => a.deviceId === deviceId),
  
  // Incident Selectors
  getActiveIncidents: (state: GlobalState) => state.incidents.filter(i => i.status === 'active' || i.status === 'investigating'),
  getIncidentById: (state: GlobalState, id: string) => state.incidents.find(i => i.id === id),
  
  // Device Selectors
  getOnlineDevices: (state: GlobalState) => state.devices.filter(d => d.status === 'online'),
  getOfflineDevices: (state: GlobalState) => state.devices.filter(d => d.status === 'offline'),
  getLowBatteryDevices: (state: GlobalState) => state.devices.filter(d => d.batteryLevel < 20),
  getDeviceById: (state: GlobalState, id: string) => state.devices.find(d => d.id === id),
  
  // Geofence Selectors
  getActiveGeofences: (state: GlobalState) => state.geofences.filter(g => g.status === 'active'),
  getGeofenceById: (state: GlobalState, id: string) => state.geofences.find(g => g.id === id),
  
  // Message Selectors
  getUnreadMessageCount: (state: GlobalState) => state.conversations.reduce((acc, c) => acc + c.unread, 0),
  
  // Statistics
  getTotalTourists: (state: GlobalState) => state.tourists.length,
  getTotalActiveAlerts: (state: GlobalState) => state.alerts.filter(a => a.status === 'active').length,
  getTotalActiveIncidents: (state: GlobalState) => state.incidents.filter(i => i.status === 'active' || i.status === 'investigating').length,
  getTotalOnlineDevices: (state: GlobalState) => state.devices.filter(d => d.status === 'online').length,
  
  // Filtered Data based on global filters
  getFilteredTourists: (state: GlobalState) => {
    let filtered = state.tourists;
    
    if (state.filters.zones.length > 0) {
      filtered = filtered.filter(t => t.currentZone && state.filters.zones.includes(t.currentZone));
    }
    
    return filtered;
  },
  
  getFilteredAlerts: (state: GlobalState) => {
    let filtered = state.alerts;
    
    if (state.filters.severity.length > 0) {
      filtered = filtered.filter(a => state.filters.severity.includes(a.priority));
    }
    
    // Apply time range filter
    if (state.filters.timeRange !== 'custom') {
      const now = new Date();
      const timeRanges = {
        today: 24 * 60 * 60 * 1000,
        last_7_days: 7 * 24 * 60 * 60 * 1000,
        last_30_days: 30 * 24 * 60 * 60 * 1000
      };
      
      const cutoff = new Date(now.getTime() - (timeRanges[state.filters.timeRange as keyof typeof timeRanges] || timeRanges.last_7_days));
      filtered = filtered.filter(a => new Date(a.timestamp) >= cutoff);
    } else if (state.filters.customDateRange) {
      const start = new Date(state.filters.customDateRange.start);
      const end = new Date(state.filters.customDateRange.end);
      filtered = filtered.filter(a => {
        const date = new Date(a.timestamp);
        return date >= start && date <= end;
      });
    }
    
    return filtered;
  },
  
  getFilteredDevices: (state: GlobalState) => {
    let filtered = state.devices;
    
    if (state.filters.deviceModels.length > 0) {
      filtered = filtered.filter(d => state.filters.deviceModels.includes(d.model));
    }
    
    return filtered;
  }
};

// Initial mock data
const initialTourists: Tourist[] = [
  {
    id: 'T001',
    name: 'Sarah Johnson',
    status: 'active',
    location: { lat: 35.6895, lng: 139.6917 },
    lastSeen: new Date().toISOString(),
    deviceId: 'DEV-001',
    emergencyContact: 'John Johnson - 555-0101',
    medicalInfo: 'No known allergies',
    currentZone: 'Lakeview Park'
  },
  {
    id: 'T002',
    name: 'James Wilson',
    status: 'emergency',
    location: { lat: 35.6850, lng: 139.6950 },
    lastSeen: new Date(Date.now() - 5 * 60000).toISOString(),
    deviceId: 'DEV-002',
    emergencyContact: 'Mary Wilson - 555-0102',
    medicalInfo: 'Diabetic - insulin dependent',
    currentZone: 'Pine Trail'
  },
  {
    id: 'T003',
    name: 'Emily Chen',
    status: 'active',
    location: { lat: 35.6920, lng: 139.6880 },
    lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
    deviceId: 'DEV-003',
    emergencyContact: undefined,
    currentZone: 'Sunset View Point'
  }
];

const initialAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'sos',
    priority: 'critical',
    status: 'active',
    touristId: 'T002',
    deviceId: 'DEV-002',
    location: { lat: 35.6850, lng: 139.6950 },
    message: 'SOS - Medical emergency',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 'ALT-002',
    type: 'geofence_breach',
    priority: 'high',
    status: 'active',
    touristId: 'T003',
    deviceId: 'DEV-003',
    location: { lat: 35.6920, lng: 139.6880 },
    message: 'Geofence breach detected - restricted area',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString()
  }
];

const initialIncidents: Incident[] = [];

const initialDevices: Device[] = [
  {
    id: 'DEV-001',
    model: 'TourGuard Pro X2',
    status: 'online',
    batteryLevel: 85,
    lastSeen: new Date().toISOString(),
    assignedTouristId: 'T001',
    firmwareVersion: '2.1.0',
    signalStrength: 95,
    location: { lat: 35.6895, lng: 139.6917 }
  },
  {
    id: 'DEV-002',
    model: 'TourGuard Pro X2',
    status: 'online',
    batteryLevel: 42,
    lastSeen: new Date(Date.now() - 5 * 60000).toISOString(),
    assignedTouristId: 'T002',
    firmwareVersion: '2.1.0',
    signalStrength: 78,
    location: { lat: 35.6850, lng: 139.6950 }
  },
  {
    id: 'DEV-003',
    model: 'TourGuard Pro X1',
    status: 'online',
    batteryLevel: 67,
    lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
    assignedTouristId: 'T003',
    firmwareVersion: '2.0.5',
    signalStrength: 88,
    location: { lat: 35.6920, lng: 139.6880 }
  }
];

const initialGeofences: Geofence[] = [
  {
    id: 'GF-001',
    name: 'Lakeview Park Zone',
    status: 'active',
    type: 'circle',
    coordinates: [{ lat: 35.6895, lng: 139.6917 }],
    radius: 500,
    maxCapacity: 60,
    currentOccupancy: 42,
    breachCount24h: 3,
    autoLockdown: false,
    rules: ['No swimming', 'Stay on marked trails', 'Return before sunset']
  },
  {
    id: 'GF-002',
    name: 'Pine Trail Restricted Area',
    status: 'active',
    type: 'polygon',
    coordinates: [
      { lat: 35.6850, lng: 139.6950 },
      { lat: 35.6870, lng: 139.6970 },
      { lat: 35.6860, lng: 139.6990 },
      { lat: 35.6840, lng: 139.6970 }
    ],
    maxCapacity: 20,
    currentOccupancy: 15,
    breachCount24h: 7,
    autoLockdown: true,
    rules: ['Authorized personnel only', 'Check-in required', 'Buddy system mandatory']
  }
];

const initialMessages: Message[] = [
  {
    id: 'MSG-001',
    type: 'broadcast',
    priority: 'high',
    sender: 'Admin',
    senderRole: 'System Administrator',
    recipients: ['All Tourists'],
    recipientCount: 3,
    subject: 'Weather Alert - Approaching Storm',
    body: 'A storm is approaching the area. Please return to base camp immediately.',
    sentAt: new Date(Date.now() - 30 * 60000).toISOString(),
    status: 'delivered',
    readCount: 2,
    channel: 'all'
  }
];

const initialReports: Report[] = [
  {
    id: 'RPT-001',
    title: 'Daily Operations Summary',
    type: 'daily_summary',
    status: 'ready',
    generatedAt: new Date(Date.now() - 3600000).toISOString(),
    generatedBy: 'System (Auto)',
    fileSize: '2.4 MB',
    format: 'pdf',
    pages: 12,
    records: 3,
    description: 'Complete daily overview of tourist activity, alerts, and incidents.',
    coverDate: new Date().toISOString().split('T')[0] || new Date().toISOString(),
    sections: ['Executive Summary', 'Tourist Activity', 'Alert Log', 'Incident Register']
  }
];

const initialConversations: Conversation[] = [
  {
    id: 'CONV-001',
    touristId: 'T001',
    touristName: 'Sarah Johnson',
    touristStatus: 'active',
    lastMessage: 'Thank you for the weather update!',
    lastMessageTime: new Date(Date.now() - 15 * 60000).toISOString(),
    unread: 0,
    messages: [
      {
        id: 'm1',
        from: 'admin',
        text: 'Weather Alert - A storm is approaching. Please return to base camp.',
        time: '10:30 AM',
        status: 'read'
      },
      {
        id: 'm2',
        from: 'tourist',
        text: 'Thank you for the weather update!',
        time: '10:32 AM',
        status: 'read'
      }
    ]
  }
];

export const useGlobalStore = create<GlobalState>((set, get) => ({
  // Initial State
  tourists: initialTourists,
  alerts: initialAlerts,
  incidents: initialIncidents,
  devices: initialDevices,
  geofences: initialGeofences,
  messages: initialMessages,
  reports: initialReports,
  conversations: initialConversations,
  
  filters: {
    timeRange: 'last_7_days',
    regions: [],
    deviceModels: [],
    severity: [],
    zones: []
  },
  
  selectedTouristId: null,
  selectedAlertId: null,
  selectedIncidentId: null,
  selectedDeviceId: null,
  selectedGeofenceId: null,
  
  // Bulk State Setters (used by Firestore real-time subscriptions)
  setTourists: (tourists) => set({ tourists }),
  setAlerts: (alerts) => set({ alerts }),
  setIncidents: (incidents) => set({ incidents }),
  setDevices: (devices) => set({ devices }),
  setGeofences: (geofences) => set({ geofences }),
  setMessages: (messages) => set({ messages }),
  setReports: (reports) => set({ reports }),
  setConversations: (conversations) => set({ conversations }),

  seedToFirebase: async () => {
    const { seedAllToFirestore } = await import("./firebase-sync");
    return seedAllToFirestore({
      tourists: get().tourists,
      alerts: get().alerts,
      incidents: get().incidents,
      devices: get().devices,
      geofences: get().geofences,
      messages: get().messages,
      reports: get().reports,
      conversations: get().conversations,
    });
  },

  // Tourist Actions
  addTourist: (tourist) => {
    set((state) => ({ tourists: [...state.tourists, tourist] }));
    import("./firebase-sync").then(({ saveTouristToCloud }) => saveTouristToCloud(tourist)).catch(() => {});
  },
  updateTourist: (id, updates) => {
    set((state) => ({
      tourists: state.tourists.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    const updated = get().tourists.find((t) => t.id === id);
    if (updated) {
      import("./firebase-sync").then(({ saveTouristToCloud }) => saveTouristToCloud(updated)).catch(() => {});
    }
  },
  deleteTourist: (id) => {
    set((state) => ({
      tourists: state.tourists.filter((t) => t.id !== id),
    }));
    import("./firebase-sync").then(({ deleteTouristFromCloud }) => deleteTouristFromCloud(id)).catch(() => {});
  },
  
  // Alert Actions
  addAlert: (alert) => {
    set((state) => ({ alerts: [alert, ...state.alerts] }));
    import("./firebase-sync").then(({ saveAlertToCloud }) => saveAlertToCloud(alert)).catch(() => {});
  },
  updateAlert: (id, updates) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    }));
    import("./firebase-sync").then(({ updateAlertInCloud }) => updateAlertInCloud(id, updates)).catch(() => {});
  },
  acknowledgeAlert: (id, acknowledgedBy) => {
    const updates = { status: "acknowledged" as const, acknowledgedBy, acknowledgedAt: new Date().toISOString() };
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }));
    import("./firebase-sync").then(({ updateAlertInCloud }) => updateAlertInCloud(id, updates)).catch(() => {});
  },
  resolveAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, status: "resolved" as const } : a)),
    }));
    import("./firebase-sync").then(({ resolveAlertInCloud }) => resolveAlertInCloud(id)).catch(() => {});
  },
  
  // Incident Actions
  addIncident: (incident) => {
    set((state) => ({ incidents: [incident, ...state.incidents] }));
    import("./firebase-sync").then(({ saveIncidentToCloud }) => saveIncidentToCloud(incident)).catch(() => {});
  },
  updateIncident: (id, updates) => {
    set((state) => ({
      incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    }));
    import("./firebase-sync").then(({ updateIncidentInCloud }) => updateIncidentInCloud(id, updates)).catch(() => {});
  },
  resolveIncident: (id, resolution) => {
    const updates = { status: "resolved" as const, resolvedAt: new Date().toISOString(), resolution };
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
    import("./firebase-sync").then(({ updateIncidentInCloud }) => updateIncidentInCloud(id, updates)).catch(() => {});
  },
  
  // Device Actions
  addDevice: (device) => {
    set((state) => ({ devices: [...state.devices, device] }));
    import("./firebase-sync").then(({ saveDeviceToCloud }) => saveDeviceToCloud(device)).catch(() => {});
  },
  updateDevice: (id, updates) => {
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
    import("./firebase-sync").then(({ updateDeviceInCloud }) => updateDeviceInCloud(id, updates)).catch(() => {});
  },
  deleteDevice: (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
    }));
    import("./firebase-sync").then(({ deleteDeviceFromCloud }) => deleteDeviceFromCloud(id)).catch(() => {});
  },
  
  // Geofence Actions
  addGeofence: (geofence) => {
    set((state) => ({ geofences: [...state.geofences, geofence] }));
    import("./firebase-sync").then(({ saveGeofenceToCloud }) => saveGeofenceToCloud(geofence)).catch(() => {});
  },
  updateGeofence: (id, updates) => {
    set((state) => ({
      geofences: state.geofences.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
    import("./firebase-sync").then(({ updateGeofenceInCloud }) => updateGeofenceInCloud(id, updates)).catch(() => {});
  },
  deleteGeofence: (id) => {
    set((state) => ({
      geofences: state.geofences.filter((g) => g.id !== id),
    }));
    import("./firebase-sync").then(({ deleteGeofenceFromCloud }) => deleteGeofenceFromCloud(id)).catch(() => {});
  },
  
  // Message Actions
  addMessage: (message) => {
    set((state) => ({ messages: [message, ...state.messages] }));
    import("./firebase-sync").then(({ saveMessageToCloud }) => saveMessageToCloud(message)).catch(() => {});
  },
  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },
  
  // Report Actions
  addReport: (report) => {
    set((state) => ({ reports: [report, ...state.reports] }));
    import("./firebase-sync").then(({ saveReportToCloud }) => saveReportToCloud(report)).catch(() => {});
  },
  updateReport: (id, updates) => {
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  },
  
  // Conversation Actions
  addConversation: (conversation) => {
    set((state) => ({ conversations: [...state.conversations, conversation] }));
    import("./firebase-sync").then(({ saveConversationToCloud }) => saveConversationToCloud(conversation)).catch(() => {});
  },
  updateConversation: (id, updates) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    import("./firebase-sync").then(({ updateConversationInCloud }) => updateConversationInCloud(id, updates)).catch(() => {});
  },
  
  // Filter Actions
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({
    filters: {
      timeRange: 'last_7_days',
      regions: [],
      deviceModels: [],
      severity: [],
      zones: []
    }
  }),
  
  // Selection Actions
  setSelectedTouristId: (id) => set({ selectedTouristId: id }),
  setSelectedAlertId: (id) => set({ selectedAlertId: id }),
  setSelectedIncidentId: (id) => set({ selectedIncidentId: id }),
  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),
  setSelectedGeofenceId: (id) => set({ selectedGeofenceId: id }),
  
  // Quick Actions
  triggerSOS: (touristId, location) => {
    const tourist = get().tourists.find(t => t.id === touristId);
    if (!tourist) return;
    
    // Create SOS alert
    const sosAlert: Alert = {
      id: `ALT-${Date.now()}`,
      type: 'sos',
      priority: 'critical',
      status: 'active',
      touristId,
      deviceId: tourist.deviceId,
      location,
      message: 'SOS - Emergency activated',
      timestamp: new Date().toISOString()
    };
    
    // Create incident
    const incident: Incident = {
      id: `INC-${Date.now()}`,
      type: 'medical',
      status: 'investigating',
      priority: 'critical',
      touristId,
      location,
      description: 'SOS activated - emergency response required',
      reportedAt: new Date().toISOString(),
      reportedBy: tourist.name
    };
    
    // Update tourist status
    set((state) => ({
      alerts: [sosAlert, ...state.alerts],
      incidents: [incident, ...state.incidents],
      tourists: state.tourists.map(t => 
        t.id === touristId ? { ...t, status: 'emergency' } : t
      )
    }));

    // Cloud mutations
    import("./firebase-sync").then(({ saveAlertToCloud, saveIncidentToCloud, updateTouristInCloud }) => {
      saveAlertToCloud(sosAlert).catch(() => {});
      saveIncidentToCloud(incident).catch(() => {});
      updateTouristInCloud(touristId, { status: "emergency" }).catch(() => {});
    }).catch(() => {});
  },
  
  broadcastEmergencyAlert: (message, recipients) => {
    const emergencyMessage: Message = {
      id: `MSG-${Date.now()}`,
      type: 'emergency',
      priority: 'critical',
      sender: 'Admin',
      senderRole: 'System Administrator',
      recipients,
      recipientCount: recipients.length,
      subject: 'EMERGENCY BROADCAST',
      body: message,
      sentAt: new Date().toISOString(),
      status: 'sent',
      channel: 'all'
    };
    
    set((state) => ({ messages: [emergencyMessage, ...state.messages] }));
    import("./firebase-sync").then(({ saveMessageToCloud }) => saveMessageToCloud(emergencyMessage)).catch(() => {});
  }
}));

/**
 * Initializes real-time subscriptions to Firebase Cloud Firestore.
 * Updates the Zustand store whenever any document is modified in Firestore.
 */
export function initGlobalFirebaseSync(): () => void {
  const unsubs: Array<(() => void) | null | undefined> = [];

  import("./firebase").then(({ isFirebaseConfigured }) => {
    if (!isFirebaseConfigured()) return;

    import("./firebase-sync").then((sync) => {
      const store = useGlobalStore.getState();

      const u1 = sync.subscribeToStoreTourists(store.setTourists);
      const u2 = sync.subscribeToStoreAlerts(store.setAlerts);
      const u3 = sync.subscribeToStoreIncidents(store.setIncidents);
      const u4 = sync.subscribeToStoreDevices(store.setDevices);
      const u5 = sync.subscribeToStoreGeofences(store.setGeofences);
      const u6 = sync.subscribeToStoreMessages(store.setMessages);
      const u7 = sync.subscribeToStoreReports(store.setReports);
      const u8 = sync.subscribeToStoreConversations(store.setConversations);

      unsubs.push(u1, u2, u3, u4, u5, u6, u7, u8);
    });
  });

  return () => {
    unsubs.forEach((u) => u?.());
  };
}

// Convenience hooks for using selectors
export const useStoreSelector = <T>(selector: (state: GlobalState) => T): T => {
  return useGlobalStore(selector);
};

// Specific hooks for common use cases
export const useActiveTourists = () => useStoreSelector(storeSelectors.getActiveTourists);
export const useEmergencyTourists = () => useStoreSelector(storeSelectors.getEmergencyTourists);
export const useActiveAlerts = () => useStoreSelector(storeSelectors.getActiveAlerts);
export const useCriticalAlerts = () => useStoreSelector(storeSelectors.getCriticalAlerts);
export const useActiveIncidents = () => useStoreSelector(storeSelectors.getActiveIncidents);
export const useOnlineDevices = () => useStoreSelector(storeSelectors.getOnlineDevices);
export const useOfflineDevices = () => useStoreSelector(storeSelectors.getOfflineDevices);
export const useLowBatteryDevices = () => useStoreSelector(storeSelectors.getLowBatteryDevices);
export const useActiveGeofences = () => useStoreSelector(storeSelectors.getActiveGeofences);
export const useUnreadMessageCount = () => useStoreSelector(storeSelectors.getUnreadMessageCount);

// Statistics hooks
export const useDashboardStats = () => useStoreSelector((state) => ({
  totalTourists: storeSelectors.getTotalTourists(state),
  activeAlerts: storeSelectors.getTotalActiveAlerts(state),
  activeIncidents: storeSelectors.getTotalActiveIncidents(state),
  onlineDevices: storeSelectors.getTotalOnlineDevices(state)
}));

// Filtered data hooks
export const useFilteredTourists = () => useStoreSelector(storeSelectors.getFilteredTourists);
export const useFilteredAlerts = () => useStoreSelector(storeSelectors.getFilteredAlerts);
export const useFilteredDevices = () => useStoreSelector(storeSelectors.getFilteredDevices);