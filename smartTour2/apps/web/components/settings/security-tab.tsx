"use client";

import { Shield, Key, Lock, Smartphone, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { securityLogs } from "@/lib/settings-data";

const statusConfig = {
  success: { dot: "bg-emerald-500", text: "text-emerald-600" },
  failed: { dot: "bg-red-500", text: "text-red-600" },
  warning: { dot: "bg-amber-500", text: "text-amber-600" },
};

export default function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
        <p className="text-sm text-slate-500">Manage passwords, sessions, and access logs</p>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Password</h4>
              <p className="text-xs text-slate-500">Last changed 3 days ago</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8">
            Change Password
          </Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h4>
              <p className="text-xs text-slate-500">Protected with authenticator app</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Active
            </Badge>
            <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-red-50">
              Disable
            </Button>
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-xs font-medium text-slate-900">Authenticator App</p>
              <p className="text-xs text-slate-500">Configured on May 17, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Active Sessions</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600">
                CM
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Chrome on macOS</p>
                <p className="text-xs text-slate-500">Mumbai, India · 203.192.12.45</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Current
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                SA
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Safari on iPhone</p>
                <p className="text-xs text-slate-500">Mumbai, India · 203.192.12.46</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-red-600 hover:bg-red-50">
              Revoke
            </Button>
          </div>
        </div>
      </div>

      {/* Security Log */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Security Log</h4>
        <div className="space-y-2">
          {securityLogs.map((log) => {
            const st = statusConfig[log.status];
            return (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-slate-50 p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", st.dot)} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{log.event}</p>
                    <p className="text-xs text-slate-500">
                      {log.device} · {log.ip} · {log.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <span className={cn("text-xs font-medium", st.text)}>{log.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";