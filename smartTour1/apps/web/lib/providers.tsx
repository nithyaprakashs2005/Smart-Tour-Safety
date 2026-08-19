"use client";

import { ReactNode, useEffect } from 'react';
import { FilterProvider } from './filter-context';
import { useGlobalStore, initGlobalFirebaseSync } from './store';

/**
 * Unified Provider Wrapper
 * Integrates global state, filters, Firebase Cloud sync, and ensures synchronization across the application
 */
export function TourGuardProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const cleanup = initGlobalFirebaseSync();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <FilterProvider>
      <GlobalStateSync>
        {children}
      </GlobalStateSync>
    </FilterProvider>
  );
}

/**
 * Component to synchronize global store with URL parameters
 * This enables deep linking and ensures URL state matches application state
 */
function GlobalStateSync({ children }: { children: ReactNode }) {
  const { setSelectedTouristId, setSelectedAlertId, setSelectedIncidentId, setSelectedDeviceId, setSelectedGeofenceId } = useGlobalStore();
  
  useEffect(() => {
    // Sync URL parameters with global state on mount and URL changes
    const params = new URLSearchParams(window.location.search);
    
    const touristId = params.get('id');
    const alertId = params.get('alertId');
    const incidentId = params.get('incidentId');
    const deviceId = params.get('deviceId');
    const geofenceId = params.get('geofenceId');
    
    if (touristId && window.location.pathname.includes('/tourists')) {
      setSelectedTouristId(touristId);
    }
    if (alertId && window.location.pathname.includes('/alerts')) {
      setSelectedAlertId(alertId);
    }
    if (incidentId && window.location.pathname.includes('/incidents')) {
      setSelectedIncidentId(incidentId);
    }
    if (deviceId && window.location.pathname.includes('/devices')) {
      setSelectedDeviceId(deviceId);
    }
    if (geofenceId && window.location.pathname.includes('/geofences')) {
      setSelectedGeofenceId(geofenceId);
    }
  }, [setSelectedTouristId, setSelectedAlertId, setSelectedIncidentId, setSelectedDeviceId, setSelectedGeofenceId]);
  
  return <>{children}</>;
}

/**
 * Hook to subscribe to global state changes with automatic cleanup
 * Useful for components that need to react to state changes across pages
 */
export function useGlobalStateSubscription<T>(
  selector: (state: ReturnType<typeof useGlobalStore.getState>) => T,
  callback: (value: T) => void
) {
  useEffect(() => {
    const unsubscribe = useGlobalStore.subscribe((state) => {
      callback(selector(state));
    });
    
    return unsubscribe;
  }, [selector, callback]);
}

/**
 * Hook to manage cross-page state persistence
 * Ensures that when navigating between pages, relevant state is preserved
 */
export function useCrossPageState() {
  const { 
    selectedTouristId, 
    selectedAlertId, 
    selectedIncidentId, 
    selectedDeviceId, 
    selectedGeofenceId,
    setSelectedTouristId,
    setSelectedAlertId,
    setSelectedIncidentId,
    setSelectedDeviceId,
    setSelectedGeofenceId
  } = useGlobalStore();
  
  const clearSelections = () => {
    setSelectedTouristId(null);
    setSelectedAlertId(null);
    setSelectedIncidentId(null);
    setSelectedDeviceId(null);
    setSelectedGeofenceId(null);
  };
  
  return {
    selections: {
      touristId: selectedTouristId,
      alertId: selectedAlertId,
      incidentId: selectedIncidentId,
      deviceId: selectedDeviceId,
      geofenceId: selectedGeofenceId
    },
    clearSelections,
    setSelectedTouristId,
    setSelectedAlertId,
    setSelectedIncidentId,
    setSelectedDeviceId,
    setSelectedGeofenceId
  };
}
