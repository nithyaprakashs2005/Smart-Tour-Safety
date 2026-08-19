"use client";

import Link from "next/link";
import { X, MapPin, Phone, Mail, Heart, Battery, Watch, Clock, Navigation, MessageSquare, PhoneCall, AlertTriangle, Map, Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tourist, TouristStatus } from "@/lib/tourist-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<TouristStatus, { label: string; dot: string; badge: string }> = {
  safe: { label: "Safe", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  warning: { label: "Warning", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  emergency: { label: "Emergency", dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200" },
  offline: { label: "Offline", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-700 border-slate-200" },
};

interface TouristDetailProps {
  tourist: Tourist | null;
  onClose: () => void;
}

export default function TouristDetail({ tourist, onClose }: TouristDetailProps) {
  if (!tourist) return null;

  const st = statusConfig[tourist.status];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <Badge className={cn("capitalize", st.badge)} variant="outline">
              <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", st.dot)} />
              {st.label}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
              {tourist.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{tourist.name}</h2>
              <p className="text-sm text-slate-500">{tourist.id} · {tourist.group} Group</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-3.5 w-3.5" />
              Message
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href={`/live-map?tourist=${tourist.id}`}>
                <Navigation className="h-3.5 w-3.5" />
                Locate
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              Call
            </Button>
            {tourist.status === "emergency" && (
              <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                Escalate
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Vitals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <Heart className={cn("h-4 w-4", tourist.heartRate && tourist.heartRate > 120 ? "text-red-500" : "text-slate-400")} />
                <span className="text-xs text-slate-500">Heart Rate</span>
              </div>
              <p className={cn("mt-1 text-2xl font-bold", tourist.heartRate && tourist.heartRate > 120 ? "text-red-600" : "text-slate-900")}>
                {tourist.heartRate ? `${tourist.heartRate} bpm` : "--"}
              </p>
              {tourist.heartRate && tourist.heartRate > 120 && (
                <p className="text-xs font-medium text-red-600">Elevated</p>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2">
                <Battery className={cn("h-4 w-4", tourist.battery <= 20 ? "text-red-500" : "text-emerald-500")} />
                <span className="text-xs text-slate-500">Battery</span>
              </div>
              <p className={cn("mt-1 text-2xl font-bold", tourist.battery <= 20 ? "text-red-600" : "text-slate-900")}>
                {tourist.battery}%
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn("h-full rounded-full", {
                    "bg-emerald-500": tourist.battery > 50,
                    "bg-amber-500": tourist.battery > 20 && tourist.battery <= 50,
                    "bg-red-500": tourist.battery <= 20,
                  })}
                  style={{ width: `${tourist.battery}%` }}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Current Location
            </h3>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{tourist.location}</p>
                <p className="text-xs text-slate-500">
                  {tourist.coordinates.lat.toFixed(5)}, {tourist.coordinates.lng.toFixed(5)}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-blue-600" asChild>
                <Link href={`/live-map?tourist=${tourist.id}`}>
                  <Map className="h-3 w-3" />
                  Map
                </Link>
              </Button>
            </div>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
              <iframe
                title={`Map of ${tourist.name}`}
                className="h-full w-full border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${tourist.coordinates.lng - 0.02}%2C${tourist.coordinates.lat - 0.015}%2C${tourist.coordinates.lng + 0.02}%2C${tourist.coordinates.lat + 0.015}&layer=mapnik&marker=${tourist.coordinates.lat}%2C${tourist.coordinates.lng}`}
              />
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last update: {new Date(tourist.lastUpdate).toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-1">
                <Watch className="h-3 w-3" />
                {tourist.deviceId}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact & Emergency
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{tourist.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{tourist.phone}</span>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-700">Emergency Contact</p>
                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tourist.emergencyContact.name}</p>
                    <p className="text-xs text-slate-500">
                      {tourist.emergencyContact.relation} · {tourist.emergencyContact.phone}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                    <PhoneCall className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Medical */}
          {tourist.medicalNotes && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Medical Notes
                </h3>
              </div>
              <p className="mt-2 text-sm text-amber-800">{tourist.medicalNotes}</p>
            </div>
          )}

          {/* Device Info */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Device Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Device ID</p>
                <p className="font-medium text-slate-900">{tourist.deviceId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Model</p>
                <p className="font-medium text-slate-900">{tourist.deviceModel}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Check-in Time</p>
                <p className="font-medium text-slate-900">
                  {new Date(tourist.checkInTime).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Group</p>
                <p className="font-medium text-slate-900">{tourist.group}</p>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Activity History
            </h3>
            <div className="relative space-y-0 pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {tourist.history.map((h, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900">{h.event}</p>
                    <span className="text-xs text-slate-500">{h.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{h.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}