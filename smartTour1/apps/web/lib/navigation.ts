import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobalStore } from './store';

/**
 * Navigation utilities for cross-page deep linking
 * Provides type-safe navigation functions with query parameters
 */

export function useAppNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSelectedTouristId, setSelectedAlertId, setSelectedIncidentId, setSelectedDeviceId, setSelectedGeofenceId } = useGlobalStore();

  return {
    // Tourist Navigation
    navigateToTourist: (touristId: string) => {
      setSelectedTouristId(touristId);
      router.push(`/tourists?id=${touristId}`);
    },
    
    navigateToTouristDetail: (touristId: string) => {
      setSelectedTouristId(touristId);
      router.push(`/tourists/${touristId}`);
    },
    
    // Alert Navigation
    navigateToAlert: (alertId: string) => {
      setSelectedAlertId(alertId);
      router.push(`/alerts?id=${alertId}`);
    },
    
    navigateToAlertDetail: (alertId: string) => {
      setSelectedAlertId(alertId);
      router.push(`/alerts/${alertId}`);
    },
    
    // Incident Navigation
    navigateToIncident: (incidentId: string) => {
      setSelectedIncidentId(incidentId);
      router.push(`/incidents?id=${incidentId}`);
    },
    
    navigateToIncidentDetail: (incidentId: string) => {
      setSelectedIncidentId(incidentId);
      router.push(`/incidents/${incidentId}`);
    },
    
    // Device Navigation
    navigateToDevice: (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      router.push(`/devices?id=${deviceId}`);
    },
    
    navigateToDeviceDetail: (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      router.push(`/devices/${deviceId}`);
    },
    
    // Geofence Navigation
    navigateToGeofence: (geofenceId: string) => {
      setSelectedGeofenceId(geofenceId);
      router.push(`/geofences?id=${geofenceId}`);
    },
    
    navigateToGeofenceDetail: (geofenceId: string) => {
      setSelectedGeofenceId(geofenceId);
      router.push(`/geofences/${geofenceId}`);
    },
    
    // Communication Navigation
    navigateToCommunication: (params?: { template?: string; recipientId?: string; alertId?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.template) queryParams.set('template', params.template);
      if (params?.recipientId) queryParams.set('recipientId', params.recipientId);
      if (params?.alertId) queryParams.set('alertId', params.alertId);
      
      const queryString = queryParams.toString();
      router.push(`/communication${queryString ? `?${queryString}` : ''}`);
    },
    
    navigateToBroadcastAlert: (alertId?: string) => {
      const queryParams = new URLSearchParams();
      queryParams.set('template', 'emergency');
      if (alertId) queryParams.set('alertId', alertId);
      
      router.push(`/communication?${queryParams.toString()}`);
    },
    
    // Live Map Navigation
    navigateToLiveMap: (params?: { focus?: string; lat?: number; lng?: number; zoom?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.focus) queryParams.set('focus', params.focus);
      if (params?.lat) queryParams.set('lat', params.lat.toString());
      if (params?.lng) queryParams.set('lng', params.lng.toString());
      if (params?.zoom) queryParams.set('zoom', params.zoom.toString());
      
      const queryString = queryParams.toString();
      router.push(`/live-map${queryString ? `?${queryString}` : ''}`);
    },
    
    navigateToLiveMapTourist: (touristId: string) => {
      setSelectedTouristId(touristId);
      router.push(`/live-map?focus=tourist&id=${touristId}`);
    },
    
    navigateToLiveMapAlert: (alertId: string) => {
      setSelectedAlertId(alertId);
      router.push(`/live-map?focus=alert&id=${alertId}`);
    },
    
    navigateToLiveMapIncident: (incidentId: string) => {
      setSelectedIncidentId(incidentId);
      router.push(`/live-map?focus=incident&id=${incidentId}`);
    },
    
    // Analytics Navigation
    navigateToAnalytics: (params?: { timeRange?: string; focus?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.timeRange) queryParams.set('timeRange', params.timeRange);
      if (params?.focus) queryParams.set('focus', params.focus);
      
      const queryString = queryParams.toString();
      router.push(`/analytics${queryString ? `?${queryString}` : ''}`);
    },
    
    navigateToAnalyticsIncident: (incidentId: string) => {
      setSelectedIncidentId(incidentId);
      router.push(`/analytics?focus=incident&id=${incidentId}`);
    },
    
    // Reports Navigation
    navigateToReports: (params?: { reportId?: string; type?: string }) => {
      const queryParams = new URLSearchParams();
      if (params?.reportId) queryParams.set('reportId', params.reportId);
      if (params?.type) queryParams.set('type', params.type);
      
      const queryString = queryParams.toString();
      router.push(`/reports${queryString ? `?${queryString}` : ''}`);
    },
    
    navigateToReportDetail: (reportId: string) => {
      router.push(`/reports/${reportId}`);
    },
    
    // General Navigation
    navigateToOverview: () => {
      router.push('/');
    },
    
    navigateToSettings: (section?: string) => {
      if (section) {
        router.push(`/settings?section=${section}`);
      } else {
        router.push('/settings');
      }
    },
    
    navigateToUsers: (userId?: string) => {
      if (userId) {
        router.push(`/users?id=${userId}`);
      } else {
        router.push('/users');
      }
    },
    
    // Cross-page navigation from alerts
    navigateFromAlertToTourist: (alertId: string, touristId: string) => {
      setSelectedAlertId(alertId);
      setSelectedTouristId(touristId);
      router.push(`/tourists?id=${touristId}&fromAlert=${alertId}`);
    },
    
    navigateFromAlertToDevice: (alertId: string, deviceId: string) => {
      setSelectedAlertId(alertId);
      setSelectedDeviceId(deviceId);
      router.push(`/devices?id=${deviceId}&fromAlert=${alertId}`);
    },
    
    // Cross-page navigation from incidents
    navigateFromIncidentToTourist: (incidentId: string, touristId: string) => {
      setSelectedIncidentId(incidentId);
      setSelectedTouristId(touristId);
      router.push(`/tourists?id=${touristId}&fromIncident=${incidentId}`);
    },
    
    navigateFromIncidentToDevice: (incidentId: string, deviceId: string) => {
      setSelectedIncidentId(incidentId);
      setSelectedDeviceId(deviceId);
      router.push(`/devices?id=${deviceId}&fromIncident=${incidentId}`);
    },
    
    // Get URL Parameters
    getTouristId: () => searchParams.get('id'),
    getAlertId: () => searchParams.get('id'),
    getIncidentId: () => searchParams.get('id'),
    getDeviceId: () => searchParams.get('id'),
    getGeofenceId: () => searchParams.get('id'),
    getReportId: () => searchParams.get('reportId'),
    getTemplate: () => searchParams.get('template'),
    getRecipientId: () => searchParams.get('recipientId'),
    getTimeRange: () => searchParams.get('timeRange'),
    getFocus: () => searchParams.get('focus'),
    getCoordinates: () => ({
      lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined,
      lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined,
      zoom: searchParams.get('zoom') ? parseInt(searchParams.get('zoom')!) : undefined
    }),
    getFromAlert: () => searchParams.get('fromAlert'),
    getFromIncident: () => searchParams.get('fromIncident'),
    
    // Clear specific parameters
    clearParams: (paramsToClear: string[]) => {
      const newParams = new URLSearchParams(searchParams.toString());
      paramsToClear.forEach(param => newParams.delete(param));
      
      const queryString = newParams.toString();
      router.push(`${window.location.pathname}${queryString ? `?${queryString}` : ''}`);
    },
    
    // Navigation with state preservation
    navigateWithState: (path: string, state: Record<string, any>) => {
      const queryParams = new URLSearchParams();
      Object.entries(state).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.set(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      router.push(`${path}${queryString ? `?${queryString}` : ''}`);
    }
  };
}

/**
 * Helper function to create clickable navigation handlers
 * Can be used in table rows, cards, and buttons
 */
export function createNavigationHandler(
  navigateFn: (id: string) => void,
  id: string
) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateFn(id);
  };
}

/**
 * Helper to determine if we should navigate based on click vs keyboard
 */
export function handleNavigation(
  navigateFn: () => void,
  e: React.MouseEvent | React.KeyboardEvent
) {
  if (e.type === 'click' || (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter')) {
    e.preventDefault();
    e.stopPropagation();
    navigateFn();
  }
}

/**
 * Deep link utilities for creating shareable URLs
 */
export function createDeepLink(path: string, params: Record<string, string | number>): string {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.set(key, String(value));
  });
  
  const queryString = queryParams.toString();
  return `${window.location.origin}${path}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Parse deep link parameters from URL
 */
export function parseDeepLinkParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}