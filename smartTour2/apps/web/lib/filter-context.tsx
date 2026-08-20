"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { FilterState, TimeRange } from './types';
import { useGlobalStore } from './store';

interface FilterContextType {
  filters: FilterState;
  setTimeRange: (timeRange: TimeRange) => void;
  setCustomDateRange: (range: { start: string; end: string }) => void;
  toggleRegion: (region: string) => void;
  toggleDeviceModel: (model: string) => void;
  toggleSeverity: (severity: string) => void;
  toggleZone: (zone: string) => void;
  resetFilters: () => void;
  setRegions: (regions: string[]) => void;
  setDeviceModels: (models: string[]) => void;
  setSeverity: (severity: string[]) => void;
  setZones: (zones: string[]) => void;
  setFilters: (filters: FilterState) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  timeRange: 'last_7_days',
  regions: [],
  deviceModels: [],
  severity: [],
  zones: []
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setTimeRange = useCallback((timeRange: TimeRange) => {
    setFilters(prev => ({ ...prev, timeRange }));
  }, []);

  const setCustomDateRange = useCallback((range: { start: string; end: string }) => {
    setFilters(prev => ({ ...prev, customDateRange: range, timeRange: 'custom' }));
  }, []);

  const toggleRegion = useCallback((region: string) => {
    setFilters(prev => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region]
    }));
  }, []);

  const toggleDeviceModel = useCallback((model: string) => {
    setFilters(prev => ({
      ...prev,
      deviceModels: prev.deviceModels.includes(model)
        ? prev.deviceModels.filter(m => m !== model)
        : [...prev.deviceModels, model]
    }));
  }, []);

  const toggleSeverity = useCallback((severity: string) => {
    setFilters(prev => ({
      ...prev,
      severity: prev.severity.includes(severity)
        ? prev.severity.filter(s => s !== severity)
        : [...prev.severity, severity]
    }));
  }, []);

  const toggleZone = useCallback((zone: string) => {
    setFilters(prev => ({
      ...prev,
      zones: prev.zones.includes(zone)
        ? prev.zones.filter(z => z !== zone)
        : [...prev.zones, zone]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const setRegions = useCallback((regions: string[]) => {
    setFilters(prev => ({ ...prev, regions }));
  }, []);

  const setDeviceModels = useCallback((models: string[]) => {
    setFilters(prev => ({ ...prev, deviceModels: models }));
  }, []);

  const setSeverity = useCallback((severity: string[]) => {
    setFilters(prev => ({ ...prev, severity }));
  }, []);

  const setZones = useCallback((zones: string[]) => {
    setFilters(prev => ({ ...prev, zones }));
  }, []);

  const setAllFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setTimeRange,
        setCustomDateRange,
        toggleRegion,
        toggleDeviceModel,
        toggleSeverity,
        toggleZone,
        resetFilters,
        setRegions,
        setDeviceModels,
        setSeverity,
        setZones,
        setFilters: setAllFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

/**
 * Hook to sync global store filters with context filters
 * This ensures both systems stay in sync
 */
export function useSyncFilters() {
  const { filters: contextFilters, setFilters: setContextFilters } = useFilters();
  const { setFilters: setStoreFilters, filters: storeFilters } = useGlobalStore();

  // Sync context changes to store
  const syncContextToStore = useCallback(() => {
    setStoreFilters(contextFilters);
  }, [contextFilters, setStoreFilters]);

  // Sync store changes to context
  const syncStoreToContext = useCallback(() => {
    setContextFilters(storeFilters);
  }, [storeFilters, setContextFilters]);

  return {
    syncContextToStore,
    syncStoreToContext,
    filters: contextFilters
  };
}

/**
 * Enhanced hook for unified filter management across the application
 * Automatically synchronizes between context and store, providing a single source of truth
 */
export function useUnifiedFilters() {
  const { filters: contextFilters, setTimeRange, setCustomDateRange, toggleRegion, toggleDeviceModel, toggleSeverity, toggleZone, resetFilters, setRegions, setDeviceModels, setSeverity, setZones, setFilters: setContextFilters } = useFilters();
  const { filters: storeFilters, setFilters: setStoreFilters } = useGlobalStore();

  // Auto-sync context changes to store
  useEffect(() => {
    setStoreFilters(contextFilters);
  }, [contextFilters, setStoreFilters]);

  // Initialize context from store on mount
  useEffect(() => {
    setContextFilters(storeFilters);
  }, []);

  return {
    filters: contextFilters,
    setTimeRange,
    setCustomDateRange,
    toggleRegion,
    toggleDeviceModel,
    toggleSeverity,
    toggleZone,
    resetFilters,
    setRegions,
    setDeviceModels,
    setSeverity,
    setZones,
    // Convenience methods for common filter operations
    setFilter: (key: keyof FilterState, value: any) => {
      setStoreFilters({ [key]: value });
    },
    getActiveFilters: () => {
      const active: Record<string, any> = {};
      if (contextFilters.timeRange !== 'last_7_days') active.timeRange = contextFilters.timeRange;
      if (contextFilters.regions.length > 0) active.regions = contextFilters.regions;
      if (contextFilters.deviceModels.length > 0) active.deviceModels = contextFilters.deviceModels;
      if (contextFilters.severity.length > 0) active.severity = contextFilters.severity;
      if (contextFilters.zones.length > 0) active.zones = contextFilters.zones;
      return active;
    },
    hasActiveFilters: () => {
      return contextFilters.timeRange !== 'last_7_days' ||
             contextFilters.regions.length > 0 ||
             contextFilters.deviceModels.length > 0 ||
             contextFilters.severity.length > 0 ||
             contextFilters.zones.length > 0;
    }
  };
}