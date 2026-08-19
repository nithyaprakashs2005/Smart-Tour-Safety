"use client";

import React from 'react';
import { useAppNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  type: 'tourist' | 'alert' | 'incident' | 'device' | 'geofence' | 'report';
  id: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'subtle' | 'highlight';
}

/**
 * Reusable navigation link component for cross-page deep linking
 * Automatically handles navigation and state management
 */
export function NavigationLink({
  type,
  id,
  children,
  className,
  showIcon = false,
  variant = 'default'
}: NavigationLinkProps) {
  const {
    navigateToTourist,
    navigateToAlert,
    navigateToIncident,
    navigateToDevice,
    navigateToGeofence,
    navigateToReportDetail
  } = useAppNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (type) {
      case 'tourist':
        navigateToTourist(id);
        break;
      case 'alert':
        navigateToAlert(id);
        break;
      case 'incident':
        navigateToIncident(id);
        break;
      case 'device':
        navigateToDevice(id);
        break;
      case 'geofence':
        navigateToGeofence(id);
        break;
      case 'report':
        navigateToReportDetail(id);
        break;
    }
  };

  const variantStyles = {
    default: 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer',
    subtle: 'text-slate-600 hover:text-slate-800 hover:underline cursor-pointer',
    highlight: 'text-blue-700 font-semibold hover:text-blue-900 hover:underline cursor-pointer'
  };

  return (
    <span
      onClick={handleClick}
      className={cn(variantStyles[variant], className)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {children}
    </span>
  );
}

interface CrossPageNavigationProps {
  sourceType: 'alert' | 'incident';
  sourceId: string;
  targetType: 'tourist' | 'device';
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Component for navigating from one entity to another
 * Example: From an alert to the associated tourist or device
 */
export function CrossPageNavigation({
  sourceType,
  sourceId,
  targetType,
  targetId,
  children,
  className
}: CrossPageNavigationProps) {
  const {
    navigateFromAlertToTourist,
    navigateFromAlertToDevice,
    navigateFromIncidentToTourist,
    navigateFromIncidentToDevice
  } = useAppNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sourceType === 'alert') {
      if (targetType === 'tourist') {
        navigateFromAlertToTourist(sourceId, targetId);
      } else if (targetType === 'device') {
        navigateFromAlertToDevice(sourceId, targetId);
      }
    } else if (sourceType === 'incident') {
      if (targetType === 'tourist') {
        navigateFromIncidentToTourist(sourceId, targetId);
      } else if (targetType === 'device') {
        navigateFromIncidentToDevice(sourceId, targetId);
      }
    }
  };

  return (
    <span
      onClick={handleClick}
      className={cn('text-blue-600 hover:text-blue-800 hover:underline cursor-pointer', className)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {children}
    </span>
  );
}

interface BroadcastAlertButtonProps {
  alertId?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'outline';
}

/**
 * Button component for navigating to communication page with pre-filled emergency template
 */
export function BroadcastAlertButton({
  alertId,
  children,
  className,
  variant = 'default'
}: BroadcastAlertButtonProps) {
  const { navigateToBroadcastAlert } = useAppNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToBroadcastAlert(alertId);
  };

  const variantStyles = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

interface LiveMapFocusButtonProps {
  focusType: 'tourist' | 'alert' | 'incident';
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Button component for navigating to live map with focus on specific entity
 */
export function LiveMapFocusButton({
  focusType,
  id,
  children,
  className
}: LiveMapFocusButtonProps) {
  const {
    navigateToLiveMapTourist,
    navigateToLiveMapAlert,
    navigateToLiveMapIncident
  } = useAppNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (focusType) {
      case 'tourist':
        navigateToLiveMapTourist(id);
        break;
      case 'alert':
        navigateToLiveMapAlert(id);
        break;
      case 'incident':
        navigateToLiveMapIncident(id);
        break;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  );
}
