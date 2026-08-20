"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Users,
  Bell,
  AlertTriangle,
  Hexagon,
  BarChart3,
  FileText,
  Watch,
  Settings,
  UserCog,
  HelpCircle,
  Shield,
  Radio,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Map, label: "Live Map", href: "/live-map" },
  { icon: Users, label: "Tourists", href: "/tourists" },
  { icon: Bell, label: "Alerts", href: "/alerts" },
  { icon: AlertTriangle, label: "Incidents", href: "/incidents" },
  { icon: Hexagon, label: "Geofences", href: "/geofences" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Watch, label: "Devices", href: "/devices" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: UserCog, label: "Users & Roles", href: "/users" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">TourGuard</h1>
          <p className="text-xs text-slate-500">Smart Tourist Safety</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 px-4 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
            AD
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">System Administrator</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="mx-4 mb-4 rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="text-xs font-semibold text-red-700">Quick SOS</p>
        <p className="mt-1 text-xs text-red-600">Send alert to all response teams instantly</p>
        <button className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-200 transition-transform hover:scale-105">
          <Radio className="h-5 w-5 text-white" />
        </button>
      </div>
    </aside>
  );
}