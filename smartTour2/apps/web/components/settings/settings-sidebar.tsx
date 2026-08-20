"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Bell,
  Settings,
  Shield,
  Plug,
  Save,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "system", label: "System", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Plug },
];

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="w-56 shrink-0 space-y-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-blue-50 text-blue-600"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <tab.icon className="h-5 w-5" />
          {tab.label}
        </button>
      ))}

      <div className="pt-4">
        <button className="flex w-full items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}