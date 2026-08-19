# TourGuard Global State Management & Navigation Guide

This guide explains how to use the unified global state management and cross-page navigation system in the TourGuard dashboard.

## Architecture Overview

The system consists of three main layers:

1. **Global State Store (Zustand)** - Centralized state management for all data
2. **Filter Context** - Unified filter management across pages
3. **Navigation Utilities** - Type-safe cross-page deep linking

## 1. Global State Store

### Basic Usage

```tsx
import { useGlobalStore } from '@/lib/store';

function MyComponent() {
  const { tourists, alerts, addTourist, updateAlert } = useGlobalStore();
  
  // Access data
  const activeTourists = tourists.filter(t => t.status === 'active');
  
  // Update data
  const handleUpdate = () => {
    updateAlert('ALT-001', { status: 'resolved' });
  };
}
```

### Using Reactive Selectors

```tsx
import { 
  useActiveTourists, 
  useCriticalAlerts, 
  useDashboardStats,
  useFilteredAlerts 
} from '@/lib/store';

function DashboardStats() {
  const activeTourists = useActiveTourists();
  const criticalAlerts = useCriticalAlerts();
  const stats = useDashboardStats();
  const filteredAlerts = useFilteredAlerts();
  
  return (
    <div>
      <p>Total Tourists: {stats.totalTourists}</p>
      <p>Active Alerts: {stats.activeAlerts}</p>
      <p>Critical Alerts: {criticalAlerts.length}</p>
    </div>
  );
}
```

### Available Selectors

- `useActiveTourists()` - Get all active tourists
- `useEmergencyTourists()` - Get tourists in emergency status
- `useActiveAlerts()` - Get all active alerts
- `useCriticalAlerts()` - Get critical priority alerts
- `useActiveIncidents()` - Get active/investigating incidents
- `useOnlineDevices()` - Get online devices
- `useOfflineDevices()` - Get offline devices
- `useLowBatteryDevices()` - Get devices with <20% battery
- `useActiveGeofences()` - Get active geofences
- `useUnreadMessageCount()` - Get total unread messages
- `useDashboardStats()` - Get dashboard statistics
- `useFilteredTourists()` - Get tourists filtered by global filters
- `useFilteredAlerts()` - Get alerts filtered by global filters
- `useFilteredDevices()` - Get devices filtered by global filters

### Store Actions

```tsx
const {
  // Tourist Actions
  addTourist,
  updateTourist,
  deleteTourist,
  
  // Alert Actions
  addAlert,
  updateAlert,
  acknowledgeAlert,
  resolveAlert,
  
  // Incident Actions
  addIncident,
  updateIncident,
  resolveIncident,
  
  // Device Actions
  addDevice,
  updateDevice,
  deleteDevice,
  
  // Geofence Actions
  addGeofence,
  updateGeofence,
  deleteGeofence,
  
  // Message Actions
  addMessage,
  updateMessage,
  
  // Report Actions
  addReport,
  updateReport,
  
  // Filter Actions
  setFilters,
  resetFilters,
  
  // Selection Actions
  setSelectedTouristId,
  setSelectedAlertId,
  setSelectedIncidentId,
  setSelectedDeviceId,
  setSelectedGeofenceId,
  
  // Quick Actions
  triggerSOS,
  broadcastEmergencyAlert
} = useGlobalStore();
```

## 2. Cross-Page Navigation

### Basic Navigation

```tsx
import { useAppNavigation } from '@/lib/navigation';

function AlertRow({ alert }) {
  const { navigateToTourist, navigateToDevice, navigateToLiveMap } = useAppNavigation();
  
  return (
    <tr>
      <td>
        <button onClick={() => navigateToTourist(alert.touristId)}>
          {alert.touristId}
        </button>
      </td>
      <td>
        <button onClick={() => navigateToDevice(alert.deviceId)}>
          {alert.deviceId}
        </button>
      </td>
      <td>
        <button onClick={() => navigateToLiveMap({ 
          focus: 'alert', 
          lat: alert.location.lat, 
          lng: alert.location.lng 
        })}>
          View on Map
        </button>
      </td>
    </tr>
  );
}
```

### Using Navigation Components

```tsx
import { 
  NavigationLink, 
  CrossPageNavigation,
  BroadcastAlertButton,
  LiveMapFocusButton 
} from '@/components/navigation/navigation-link';

function AlertTable({ alerts }) {
  return (
    <table>
      {alerts.map(alert => (
        <tr key={alert.id}>
          <td>
            <NavigationLink type="tourist" id={alert.touristId}>
              {alert.touristId}
            </NavigationLink>
          </td>
          <td>
            <NavigationLink type="device" id={alert.deviceId}>
              {alert.deviceId}
            </NavigationLink>
          </td>
          <td>
            <CrossPageNavigation 
              sourceType="alert" 
              sourceId={alert.id}
              targetType="tourist"
              targetId={alert.touristId}
            >
              View Tourist Details
            </CrossPageNavigation>
          </td>
          <td>
            <BroadcastAlertButton alertId={alert.id}>
              Broadcast Alert
            </BroadcastAlertButton>
          </td>
          <td>
            <LiveMapFocusButton focusType="alert" id={alert.id}>
              View on Map
            </LiveMapFocusButton>
          </td>
        </tr>
      ))}
    </table>
  );
}
```

### Navigation Functions

```tsx
const {
  // Entity Navigation
  navigateToTourist,
  navigateToAlert,
  navigateToIncident,
  navigateToDevice,
  navigateToGeofence,
  
  // Cross-Page Navigation
  navigateFromAlertToTourist,
  navigateFromAlertToDevice,
  navigateFromIncidentToTourist,
  navigateFromIncidentToDevice,
  
  // Special Navigation
  navigateToCommunication,
  navigateToBroadcastAlert,
  navigateToLiveMap,
  navigateToAnalytics,
  navigateToReports,
  
  // URL Parameter Helpers
  getTouristId,
  getAlertId,
  getTemplate,
  getCoordinates
} = useAppNavigation();
```

## 3. Unified Filter Management

### Using Unified Filters

```tsx
import { useUnifiedFilters } from '@/lib/filter-context';

function AnalyticsPage() {
  const { 
    filters, 
    setTimeRange, 
    toggleSeverity,
    hasActiveFilters,
    getActiveFilters 
  } = useUnifiedFilters();
  
  return (
    <div>
      <select 
        value={filters.timeRange}
        onChange={(e) => setTimeRange(e.target.value as any)}
      >
        <option value="today">Today</option>
        <option value="last_7_days">Last 7 Days</option>
        <option value="last_30_days">Last 30 Days</option>
      </select>
      
      <button onClick={() => toggleSeverity('critical')}>
        Toggle Critical
      </button>
      
      {hasActiveFilters() && (
        <button onClick={() => resetFilters()}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
```

### Filter Synchronization

Filters automatically synchronize across pages. When you change filters on the Analytics page, the same filters apply to Reports and Overview pages.

```tsx
// Analytics page
const { setTimeRange } = useUnifiedFilters();
setTimeRange('last_30_days');

// Reports page - automatically has same filter
const { filters } = useUnifiedFilters();
console.log(filters.timeRange); // 'last_30_days'
```

## 4. Quick SOS Integration

### Using the SOS Modal

```tsx
import SOSModal from '@/components/global/sos-modal';
import { useState } from 'react';

function Sidebar() {
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsSOSModalOpen(true)}>
        Quick SOS
      </button>
      
      <SOSModal 
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        defaultTouristId="T001"
        defaultLocation={{ lat: 35.6895, lng: 139.6917 }}
      />
    </div>
  );
}
```

### Programmatic SOS Trigger

```tsx
import { useGlobalStore } from '@/lib/store';

function EmergencyButton({ touristId }) {
  const { triggerSOS, broadcastEmergencyAlert } = useGlobalStore();
  
  const handleEmergency = () => {
    const location = { lat: 35.6895, lng: 139.6917 };
    
    // This will:
    // 1. Create a critical alert
    // 2. Log an incident
    // 3. Update tourist status to emergency
    // 4. Broadcast to all teams
    triggerSOS(touristId, location);
    broadcastEmergencyAlert(
      'Emergency activated - immediate response required',
      ['All Tourists', 'All Teams']
    );
  };
  
  return <button onClick={handleEmergency}>Trigger SOS</button>;
}
```

## 5. Reactive Updates Example

### Device Status Update

```tsx
// On Devices page
function DeviceStatusToggle({ device }) {
  const { updateDevice } = useGlobalStore();
  
  const toggleStatus = () => {
    updateDevice(device.id, { 
      status: device.status === 'online' ? 'offline' : 'online' 
    });
  };
  
  return <button onClick={toggleStatus}>Toggle Status</button>;
}

// This update will automatically reflect in:
// - Analytics page (device health chart)
// - Overview page (stat card)
// - Live Map (device markers)
// - Any component using useOnlineDevices() or useOfflineDevices()
```

## 6. Deep Linking Examples

### Creating Shareable URLs

```tsx
import { createDeepLink } from '@/lib/navigation';

function ShareButton({ incidentId }) {
  const handleShare = () => {
    const url = createDeepLink('/incidents', { id: incidentId });
    navigator.clipboard.writeText(url);
  };
  
  return <button onClick={handleShare}>Share Incident</button>;
}
```

### Handling Deep Links on Page Load

```tsx
import { useAppNavigation } from '@/lib/navigation';
import { useEffect } from 'react';

function IncidentPage() {
  const { getIncidentId } = useAppNavigation();
  const { setSelectedIncidentId } = useGlobalStore();
  
  useEffect(() => {
    const incidentId = getIncidentId();
    if (incidentId) {
      setSelectedIncidentId(incidentId);
      // Load incident details or scroll to incident
    }
  }, []);
  
  // ... rest of component
}
```

## 7. Complete Example: Alert Table with Navigation

```tsx
import { useAppNavigation } from '@/lib/navigation';
import { useActiveAlerts } from '@/lib/store';
import { 
  NavigationLink, 
  CrossPageNavigation,
  BroadcastAlertButton,
  LiveMapFocusButton 
} from '@/components/navigation/navigation-link';

function AlertTable() {
  const alerts = useActiveAlerts();
  const { acknowledgeAlert, resolveAlert } = useGlobalStore();
  
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Alert ID</th>
          <th>Tourist</th>
          <th>Device</th>
          <th>Type</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map(alert => (
          <tr key={alert.id} className="border-b">
            <td>
              <NavigationLink type="alert" id={alert.id}>
                {alert.id}
              </NavigationLink>
            </td>
            <td>
              <CrossPageNavigation 
                sourceType="alert" 
                sourceId={alert.id}
                targetType="tourist"
                targetId={alert.touristId!}
              >
                {alert.touristId}
              </CrossPageNavigation>
            </td>
            <td>
              <CrossPageNavigation 
                sourceType="alert" 
                sourceId={alert.id}
                targetType="device"
                targetId={alert.deviceId!}
              >
                {alert.deviceId}
              </CrossPageNavigation>
            </td>
            <td>{alert.type}</td>
            <td>
              <span className={`px-2 py-1 rounded ${
                alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {alert.priority}
              </span>
            </td>
            <td className="flex gap-2">
              <button 
                onClick={() => acknowledgeAlert(alert.id, 'Admin')}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Acknowledge
              </button>
              <button 
                onClick={() => resolveAlert(alert.id)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Resolve
              </button>
              <BroadcastAlertButton alertId={alert.id}>
                Broadcast
              </BroadcastAlertButton>
              <LiveMapFocusButton focusType="alert" id={alert.id}>
                Map
              </LiveMapFocusButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Best Practices

1. **Use selectors for computed data** - Instead of filtering in components, use the provided selector hooks
2. **Leverage navigation components** - Use the reusable navigation components for consistent behavior
3. **Keep filters synchronized** - Use `useUnifiedFilters` for filter management to ensure cross-page consistency
4. **Handle deep links** - Always check URL parameters on page load to handle deep linking
5. **Use reactive updates** - Trust that store updates will automatically reflect across all components
6. **Type safety** - The navigation utilities are fully typed - leverage TypeScript for better developer experience

## File Structure

```
lib/
├── store.ts                    # Global Zustand store with selectors
├── types.ts                    # TypeScript type definitions
├── navigation.ts               # Navigation utilities
├── filter-context.tsx          # Filter context and hooks
├── providers.tsx               # Unified provider wrapper
└── GLOBAL_STATE_GUIDE.md       # This guide

components/
├── navigation/
│   └── navigation-link.tsx     # Reusable navigation components
└── global/
    └── sos-modal.tsx           # SOS modal component
```
