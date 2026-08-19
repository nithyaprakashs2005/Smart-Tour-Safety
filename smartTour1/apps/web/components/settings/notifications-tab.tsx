"use client";

import { useState } from "react";
import { Bell, Smartphone, Mail, MessageSquare, Monitor } from "lucide-react";
import { notificationSettings } from "@/lib/settings-data";

const channelIcons = {
  push: Smartphone,
  email: Mail,
  sms: MessageSquare,
  inApp: Monitor,
};

export default function NotificationsTab() {
  const [settings, setSettings] = useState(notificationSettings);

  const toggle = (id: string, channel: keyof typeof channelIcons) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [channel]: !s[channel] } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
        <p className="text-sm text-slate-500">Choose how and when you receive alerts</p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4">
          <div className="col-span-4 text-xs font-semibold text-slate-500">Category</div>
          <div className="col-span-2 text-center text-xs font-semibold text-slate-500">Push</div>
          <div className="col-span-2 text-center text-xs font-semibold text-slate-500">Email</div>
          <div className="col-span-2 text-center text-xs font-semibold text-slate-500">SMS</div>
          <div className="col-span-2 text-center text-xs font-semibold text-slate-500">In-App</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div className="col-span-4">
                <p className="text-sm font-medium text-slate-900">{setting.category}</p>
                <p className="text-xs text-slate-500">{setting.description}</p>
              </div>

              {(Object.keys(channelIcons) as Array<keyof typeof channelIcons>).map((channel) => (
                <div key={channel} className="col-span-2 flex justify-center">
                  <button
                    onClick={() => toggle(setting.id, channel)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                      setting[channel]
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                    )}
                  >
                    {(() => {
                      const Icon = channelIcons[channel];
                      return <Icon className="h-4 w-4" />;
                    })()}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Quiet Hours</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">From</span>
            <input
              type="time"
              defaultValue="22:00"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">To</span>
            <input
              type="time"
              defaultValue="07:00"
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-slate-600">Except emergencies</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";