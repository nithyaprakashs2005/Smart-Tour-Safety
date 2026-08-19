"use client";

import { useState } from 'react';
import { AlertTriangle, X, MapPin, User, Smartphone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGlobalStore } from '@/lib/store';
import { useAppNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTouristId?: string;
  defaultLocation?: { lat: number; lng: number };
}

export default function SOSModal({ 
  isOpen, 
  onClose, 
  defaultTouristId,
  defaultLocation 
}: SOSModalProps) {
  const { tourists, triggerSOS, broadcastEmergencyAlert } = useGlobalStore();
  const { navigateToLiveMap } = useAppNavigation();
  
  const [selectedTouristId, setSelectedTouristId] = useState(defaultTouristId || '');
  const [location, setLocation] = useState(
    defaultLocation || { lat: 35.6895, lng: 139.6917 }
  );
  const [description, setDescription] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [broadcastToAll, setBroadcastToAll] = useState(true);

  if (!isOpen) return null;

  const handleTriggerSOS = () => {
    if (!selectedTouristId) return;
    
    setIsTriggering(true);
    
    // Trigger SOS in global state
    triggerSOS(selectedTouristId, location);
    
    // Broadcast emergency alert if enabled
    if (broadcastToAll) {
      const tourist = tourists.find(t => t.id === selectedTouristId);
      const message = `EMERGENCY: SOS activated by ${tourist?.name || 'Unknown'} at ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}. ${description || 'Immediate response required.'}`;
      broadcastEmergencyAlert(message, ['All Tourists', 'All Teams']);
    }
    
    // Navigate to live map
    setTimeout(() => {
      navigateToLiveMap({ 
        focus: 'alert', 
        lat: location.lat, 
        lng: location.lng 
      });
      setIsTriggering(false);
      onClose();
    }, 1000);
  };

  const emergencyTourists = tourists.filter(t => t.status === 'emergency');

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-red-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-100 bg-red-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-900">Emergency SOS</h3>
                <p className="text-xs text-red-600">Trigger emergency response protocol</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:bg-red-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Tourist Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                <User className="mr-1 h-4 w-4 inline" />
                Affected Tourist
              </label>
              <select
                value={selectedTouristId}
                onChange={(e) => setSelectedTouristId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select tourist...</option>
                {tourists.map((tourist) => (
                  <option key={tourist.id} value={tourist.id}>
                    {tourist.name} ({tourist.status})
                  </option>
                ))}
              </select>
              
              {emergencyTourists.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {emergencyTourists.length} tourist(s) in emergency status
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                <MapPin className="mr-1 h-4 w-4 inline" />
                Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={location.lat}
                  onChange={(e) => setLocation({ ...location, lat: parseFloat(e.target.value) || 0 })}
                  className="text-sm"
                />
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="Longitude"
                  value={location.lng}
                  onChange={(e) => setLocation({ ...location, lng: parseFloat(e.target.value) || 0 })}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Emergency Description
              </label>
              <textarea
                placeholder="Describe the emergency situation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            {/* Broadcast Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="broadcast"
                checked={broadcastToAll}
                onChange={(e) => setBroadcastToAll(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="broadcast" className="text-sm text-slate-700">
                Broadcast emergency alert to all teams and tourists
              </label>
            </div>

            {/* Warning */}
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-red-700">
                  <p className="font-semibold">This will trigger an emergency response:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Create critical alert in system</li>
                    <li>Log emergency incident</li>
                    <li>Update tourist status to emergency</li>
                    <li>Notify all response teams</li>
                    <li>Update live map with emergency overlay</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleTriggerSOS}
              disabled={!selectedTouristId || isTriggering}
              className="bg-red-600 hover:bg-red-700"
            >
              {isTriggering ? (
                <>
                  <Smartphone className="mr-2 h-4 w-4 animate-pulse" />
                  Triggering SOS...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Trigger Emergency SOS
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}