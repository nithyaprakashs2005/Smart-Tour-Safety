"use client";

import { X, MapPin, Clock, User, Heart, Battery, CheckCircle2, ArrowUpCircle, XCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertSeverity, AlertStatus } from "@/lib/alert-data";
import { cn } from "@/lib/utils";

const severityConfig: Record<AlertSeverity, { label: string; color: string; border: string }> = {
  critical: { label: "Critical", color: "text-red-700 bg-red-50", border: "border-red-200" },
  high: { label: "High", color: "text-orange-700 bg-orange-50", border: "border-orange-200" },
  medium: { label: "Medium", color: "text-amber-700 bg-amber-50", border: "border-amber-200" },
  low: { label: "Low", color: "text-blue-700 bg-blue-50", border: "border-blue-200" },
};

const statusConfig: Record<AlertStatus, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-red-500" },
  acknowledged: { label: "Acknowledged", dot: "bg-amber-500" },
  resolved: { label: "Resolved", dot: "bg-emerald-500" },
  escalated: { label: "Escalated", dot: "bg-purple-500" },
};

interface AlertDetailProps {
  alert: Alert | null;
  onClose: () => void;
}

export default function AlertDetail({ alert, onClose }: AlertDetailProps) {
  if (!alert) return null;

  const sev = severityConfig[alert.severity];
  const stat = statusConfig[alert.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className={cn("capitalize", sev.color, sev.border)} variant="outline">
                {alert.severity}
              </Badge>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", stat.dot)} />
                <span className="text-sm font-medium text-slate-700">{stat.label}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-900">{alert.type}</h2>
          <p className="text-sm text-slate-500">{alert.id}</p>
        </div>

        <div className="space-y-6 p-6">
          {/* Description */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-relaxed text-slate-700">{alert.description}</p>
          </div>

          {/* Tourist Card */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tourist Details
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {alert.touristName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{alert.touristName}</p>
                <p className="text-xs text-slate-500">{alert.touristId}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {alert.heartRate && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-slate-500">Heart Rate</p>
                    <p className="text-sm font-semibold text-slate-900">{alert.heartRate} bpm</p>
                  </div>
                </div>
              )}
              {alert.battery && (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                  <Battery className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-xs text-slate-500">Battery</p>
                    <p className="text-sm font-semibold text-slate-900">{alert.battery}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Location
            </h3>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-900">{alert.location}</p>
                <p className="text-xs text-slate-500">
                  {alert.coordinates.lat.toFixed(4)}, {alert.coordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-1 text-xs text-slate-400">Map preview</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              Open in Live Map
            </Button>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Timeline
            </h3>
            <div className="relative space-y-4 pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
              <div className="relative">
                <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                <p className="text-xs font-medium text-slate-900">Alert Triggered</p>
                <p className="text-xs text-slate-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {alert.assignedTo && (
                <div className="relative">
                  <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white bg-amber-500" />
                  <p className="text-xs font-medium text-slate-900">Assigned to {alert.assignedTo}</p>
                  <p className="text-xs text-slate-500">Acknowledged automatically</p>
                </div>
              )}
              {alert.resolvedAt && (
                <div className="relative">
                  <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  <p className="text-xs font-medium text-slate-900">Resolved</p>
                  <p className="text-xs text-slate-500">
                    {new Date(alert.resolvedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {alert.notes && (
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Notes
              </h3>
              <p className="text-sm text-slate-700">{alert.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-slate-100 bg-white p-6">
            <div className="grid grid-cols-2 gap-3">
              <Button className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                Acknowledge
              </Button>
              <Button variant="outline" className="gap-1.5">
                <ArrowUpCircle className="h-4 w-4" />
                Escalate
              </Button>
            </div>
            <Button variant="outline" className="mt-3 w-full gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700">
              <XCircle className="h-4 w-4" />
              Mark as Resolved
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}