"use client";

import { useState } from "react";
import {
  X,
  RadioTower,
  Wrench,
  RotateCw,
  CheckCircle2,
  MapPin,
  Tag,
  Watch,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deviceTypeLabels, type Device } from "@/lib/device-data";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<Device["type"], LucideIcon> = {
  "gps-band": MapPin,
  "sos-tag": Tag,
  smartwatch: Watch,
  beacon: RadioTower,
};

const SIGNAL_ICON: Record<Device["signal"], LucideIcon> = {
  strong: SignalHigh,
  moderate: SignalMedium,
  weak: SignalLow,
  none: SignalZero,
};

interface DeviceDetailProps {
  device: Device | null;
  onClose: () => void;
  onUpdateDevice?: (device: Device) => void;
}

export default function DeviceDetail({ device, onClose, onUpdateDevice }: DeviceDetailProps) {
  const [isPinging, setIsPinging] = useState(false);
  const [pinged, setPinged] = useState(false);

  if (!device) {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <RadioTower className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">No device selected</p>
        <p className="mt-1 text-xs text-slate-400">Select a device from the table to view its details.</p>
      </div>
    );
  }

  const TypeIcon = TYPE_ICON[device.type];
  const SignalIcon = SIGNAL_ICON[device.signal];
  const handlePing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPinged(false);
    // Simulated round-trip — swap for a real device-ping API call.
    setTimeout(() => {
      setIsPinging(false);
      setPinged(true);
      setTimeout(() => setPinged(false), 2500);
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TypeIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{device.deviceId}</div>
            <div className="text-xs text-slate-400">{deviceTypeLabels[device.type]}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 p-4">
        <div>
          <div className="text-xs font-medium text-slate-400">Assigned Tourist</div>
          {device.touristName ? (
            <div className="mt-1 text-sm font-medium text-slate-800">
              {device.touristName} <span className="text-slate-400">· {device.touristId}</span>
            </div>
          ) : (
            <div className="mt-1 text-sm text-slate-400">Unassigned</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <div><div className="text-[10px] text-slate-400">Heart Rate</div><div className="text-sm font-semibold text-slate-800">{device.heartRate ? `${device.heartRate} bpm` : "--"}</div></div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" /><div><div className="text-[10px] text-slate-400">HRV</div><div className="text-sm font-semibold text-slate-800">{device.heartRateVariability ? `${device.heartRateVariability} ms` : "--"}</div></div>
          </div>
          <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-cyan-500" /><div><div className="text-[10px] text-slate-400">SpO2</div><div className="text-sm font-semibold text-slate-800">{device.spo2 ? `${device.spo2}%` : "--"}</div></div></div>
          <div className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-orange-500" /><div><div className="text-[10px] text-slate-400">Temperature</div><div className="text-sm font-semibold text-slate-800">{device.bodyTemperature ? `${device.bodyTemperature.toFixed(1)} °C` : "--"}</div></div></div>
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-rose-500" /><div><div className="text-[10px] text-slate-400">Blood Pressure</div><div className="text-sm font-semibold text-slate-800">{device.bloodPressure ? `${device.bloodPressure.systolic}/${device.bloodPressure.diastolic}` : "--"}</div></div></div>
          <div className="flex items-center gap-2"><SignalIcon className="h-4 w-4 text-blue-500" /><div><div className="text-[10px] text-slate-400">Signal</div><div className="text-sm font-semibold capitalize text-slate-800">{device.signal}</div></div></div>
          <div>
            <div className="text-[10px] text-slate-400">Last Sync</div>
            <div className="text-sm font-medium text-slate-700">{device.lastSync}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Firmware</div>
            <div className="text-sm font-medium text-slate-700">v{device.firmwareVersion}</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400">Location</div>
          <div className="mt-1 text-sm text-slate-700">{device.location}</div>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 p-4">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-1.5"
          onClick={handlePing}
          disabled={isPinging}
        >
          {isPinging ? (
            <>
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
              Pinging device...
            </>
          ) : pinged ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Ping sent
            </>
          ) : (
            <>
              <RotateCw className="h-3.5 w-3.5" />
              Ping Device
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          className="w-full justify-center gap-1.5"
          onClick={() => {
            if (device && onUpdateDevice) {
              onUpdateDevice({ ...device, status: "maintenance" });
            }
          }}
        >
          <Wrench className="h-3.5 w-3.5" />
          Send to Maintenance
        </Button>
      </div>
    </div>
  );
}