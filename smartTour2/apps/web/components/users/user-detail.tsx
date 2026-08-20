"use client";

import {
  X,
  ShieldCheck,
  Shield,
  Mail,
  Phone,
  MapPin,
  Clock,
  Lock,
  Unlock,
  UserX,
  Edit3,
  Activity,
  Key,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, UserStatus, roles } from "@/lib/users-data";

const statusConfig: Record<UserStatus, { label: string; badge: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  inactive: { label: "Inactive", badge: "bg-slate-100 text-slate-600 border-slate-200" },
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  locked: { label: "Locked", badge: "bg-red-50 text-red-700 border-red-200" },
};

interface UserDetailProps {
  user: User | null;
  onClose: () => void;
}

export default function UserDetail({ user, onClose }: UserDetailProps) {
  if (!user) return null;

  const st = statusConfig[user.status];
  const role = roles.find((r) => r.id === user.role);

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
            <Badge variant="outline" className={cn("text-xs font-medium", st.badge)}>
              {st.label}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.id} · {user.department}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Edit3 className="h-3.5 w-3.5" />
              Edit User
            </Button>
            {user.status === "locked" ? (
              <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 hover:bg-emerald-50">
                <Unlock className="h-3.5 w-3.5" />
                Unlock
              </Button>
            ) : user.status === "active" ? (
              <Button variant="outline" size="sm" className="gap-1.5 text-amber-600 hover:bg-amber-50">
                <Lock className="h-3.5 w-3.5" />
                Lock
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 hover:bg-emerald-50">
                <Unlock className="h-3.5 w-3.5" />
                Activate
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 text-red-600 hover:bg-red-50">
              <UserX className="h-3.5 w-3.5" />
              Deactivate
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Contact */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-700">{user.department}</span>
              </div>
            </div>
          </div>

          {/* Role & Security */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Role</p>
              {role && (
                <Badge variant="outline" className={cn("mt-1 text-xs", role.color)}>
                  {role.name}
                </Badge>
              )}
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">2FA Status</p>
              <div className="mt-1 flex items-center gap-1.5">
                {user.twoFactorEnabled ? (
                  <>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">Enabled</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-500">Disabled</span>
                  </>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Total Logins</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{user.loginCount}</p>
            </div>
            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-500">Joined</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Last Login */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Last Session
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="text-slate-900">{new Date(user.lastActive).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IP Address</span>
                <span className="font-mono text-slate-900">{user.lastLoginIp}</span>
              </div>
            </div>
          </div>

          {/* Permissions Preview */}
          {role && (
            <div className="rounded-xl border border-slate-100 p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Permissions ({role.permissions.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 8).map((perm) => (
                  <Badge
                    key={perm}
                    variant="outline"
                    className="bg-slate-50 text-slate-600 border-slate-200 text-[10px]"
                  >
                    {perm}
                  </Badge>
                ))}
                {role.permissions.length > 8 && (
                  <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px]">
                    +{role.permissions.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recent Activity
            </h3>
            <div className="relative space-y-0 pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100" />
              {user.recentActivity.map((act, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{act.action}</p>
                      <p className="text-xs text-slate-500">{act.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { cn } from "@/lib/utils";