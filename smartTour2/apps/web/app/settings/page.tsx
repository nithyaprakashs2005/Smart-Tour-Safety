"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import Sidebar from "@/components/sidebar";
import SettingsSidebar from "@/components/settings/settings-sidebar";
import ProfileTab from "@/components/settings/profile-tab";
import NotificationsTab from "@/components/settings/notifications-tab";
import SystemTab from "@/components/settings/system-tab";
import SecurityTab from "@/components/settings/security-tab";
import IntegrationsTab from "@/components/settings/integrations-tab";

const tabs: Record<string, React.ElementType> = {
  profile: ProfileTab,
  notifications: NotificationsTab,
  system: SystemTab,
  security: SecurityTab,
  integrations: IntegrationsTab,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveComponent = tabs[activeTab];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="border-b border-slate-200 bg-white px-8 py-5">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Configure system preferences, notifications, security, and integrations.
          </p>
        </header>

        <div className="flex gap-6 px-8 py-6">
          {/* Settings Sub-nav */}
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </main>
    </div>
  );
}