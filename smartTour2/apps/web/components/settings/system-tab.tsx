"use client";

import { useState } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { systemSettings } from "@/lib/settings-data";

export default function SystemTab() {
  const [settings, setSettings] = useState(systemSettings);

  const updateValue = (id: string, value: string | number | boolean) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">System Configuration</h3>
        <p className="text-sm text-slate-500">Manage operational parameters and system behavior</p>
      </div>

      <div className="space-y-3">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5"
          >
            <div className="flex-1 pr-4">
              <p className="text-sm font-semibold text-slate-900">{setting.label}</p>
              <p className="text-xs text-slate-500">{setting.description}</p>
            </div>

            <div className="shrink-0">
              {setting.type === "toggle" && (
                <button
                  onClick={() => updateValue(setting.id, !setting.value)}
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    setting.value ? "bg-blue-600" : "bg-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                      setting.value ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              )}

              {setting.type === "number" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const val = Number(setting.value) - 1;
                      if (setting.min === undefined || val >= setting.min) {
                        updateValue(setting.id, val);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-slate-900">
                    {setting.value}
                  </span>
                  <button
                    onClick={() => {
                      const val = Number(setting.value) + 1;
                      if (setting.max === undefined || val <= setting.max) {
                        updateValue(setting.id, val);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              )}

              {setting.type === "select" && (
                <select
                  value={String(setting.value)}
                  onChange={(e) => updateValue(setting.id, e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {setting.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {setting.type === "text" && (
                <input
                  type="text"
                  value={String(setting.value)}
                  onChange={(e) => updateValue(setting.id, e.target.value)}
                  className="h-9 w-48 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-100 bg-red-50 p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h4 className="text-sm font-semibold text-red-900">Danger Zone</h4>
        </div>
        <p className="mt-2 text-sm text-red-700">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset to Defaults
          </Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";