"use client";

import { useState, useEffect } from "react";
import { Plug, Key, Copy, Eye, EyeOff, Trash2, Plus, Calendar, Flame, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiKeys } from "@/lib/settings-data";
import { cn } from "@/lib/utils";
import { isFirebaseConfigured, firebaseConfig } from "@/lib/firebase";
import { useGlobalStore } from "@/lib/store";

export default function IntegrationsTab() {
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<{ success: boolean; message: string } | null>(null);

  const { seedToFirebase } = useGlobalStore();

  useEffect(() => {
    setFirebaseConnected(isFirebaseConfigured());
  }, []);

  const toggleReveal = (id: string) => {
    const next = new Set(revealedKeys);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedKeys(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Integrations & API</h3>
        <p className="text-sm text-slate-500">Manage API keys, Firebase Cloud Firestore, and third-party connections</p>
      </div>

      {/* Firebase Cloud Card */}
      <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 via-white to-orange-50/40 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900">Firebase Cloud Firestore</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold",
                    firebaseConnected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                  )}
                >
                  {firebaseConnected ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Local Mode (Pending Keys)
                    </span>
                  )}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Real-time multi-device synchronization of tourist GPS beacons, active emergency alerts, and responder telemetry.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg bg-white/80 p-3.5 border border-amber-100 text-xs">
          <div>
            <span className="text-slate-400 block">Project ID</span>
            <span className="font-mono font-semibold text-slate-700">
              {firebaseConfig.projectId || "Not configured"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Auth Domain</span>
            <span className="font-mono font-semibold text-slate-700 truncate block">
              {firebaseConfig.authDomain || "Not configured"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Active Collections</span>
            <span className="font-medium text-amber-700">
              tourists, alerts, activities, wearables
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-200/60">
          <div className="text-xs text-slate-600">
            {seedStatus ? (
              <span className={cn("font-medium", seedStatus.success ? "text-emerald-700" : "text-rose-600")}>
                {seedStatus.message}
              </span>
            ) : (
              <span>Populate your cloud Firestore database with all initial tourists, alerts, geofences, and devices.</span>
            )}
          </div>
          <Button
            size="sm"
            disabled={isSeeding || !firebaseConnected}
            onClick={async () => {
              setIsSeeding(true);
              try {
                const res = await seedToFirebase();
                setSeedStatus(res);
              } catch (err: any) {
                setSeedStatus({ success: false, message: err?.message || "Failed to seed" });
              } finally {
                setIsSeeding(false);
              }
            }}
            className="h-8 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isSeeding && "animate-spin")} />
            {isSeeding ? "Seeding Firestore..." : "Seed All Data to Firestore"}
          </Button>
        </div>

        {!firebaseConnected && (
          <div className="mt-4 rounded-lg bg-amber-100/70 p-3 text-xs text-amber-900 leading-relaxed">
            <strong>How to connect:</strong> Copy your Firebase Web App configuration credentials into{" "}
            <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono text-[11px]">apps/web/.env.local</code> (or environment variables). The system will automatically switch from local memory to live Cloud Firestore.
          </div>
        )}
      </div>

      {/* Connected Services */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Connected Services</h4>
        <div className="space-y-3">
          {[
            { name: "Firebase Cloud Firestore", status: firebaseConnected ? "connected" : "ready", icon: "🔥", lastSync: firebaseConnected ? "Live Realtime" : "Standby" },
            { name: "Mapbox GL", status: "connected", icon: "🗺️", lastSync: "Active" },
            { name: "OpenWeather API", status: "connected", icon: "🌤️", lastSync: "2 min ago" },
            { name: "Twilio SMS", status: "connected", icon: "📱", lastSync: "Active" },
            { name: "SendGrid Email", status: "degraded", icon: "📧", lastSync: "Latency 400ms" },
            { name: "Slack Webhooks", status: "connected", icon: "💬", lastSync: "Active" },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-lg border border-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{service.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                  <p className="text-xs text-slate-500">Last sync: {service.lastSync}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    service.status === "connected"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {service.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-slate-500">
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">API Keys</h4>
          <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-3.5 w-3.5" />
            New Key
          </Button>
        </div>

        <div className="space-y-3">
          {apiKeys.map((key) => {
            const isRevealed = revealedKeys.has(key.id);
            return (
              <div
                key={key.id}
                className={cn(
                  "rounded-lg border p-4",
                  key.active ? "border-slate-100" : "border-slate-50 bg-slate-50/50 opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{key.name}</p>
                      <p className="text-xs text-slate-500">ID: {key.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        key.active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      )}
                    >
                      {key.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 rounded-md bg-slate-100 px-3 py-2 text-xs font-mono text-slate-700">
                    {isRevealed ? key.key : key.key.slice(0, 12) + "••••••••"}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleReveal(key.id)}
                  >
                    {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Plug className="h-3 w-3" />
                    Last used {new Date(key.lastUsed).toLocaleTimeString()}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {key.permissions.map((perm) => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="bg-slate-50 text-slate-600 border-slate-200 text-[10px]"
                    >
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Webhook Endpoints */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900">Webhook Endpoints</h4>
          <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Endpoint
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">https://hooks.tourguard.io/alerts</p>
              <p className="text-xs text-slate-500">Receives all alert events · POST</p>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-900">https://hooks.tourguard.io/incidents</p>
              <p className="text-xs text-slate-500">Receives incident updates · POST</p>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Active
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}