"use client";

import { useState } from "react";
import { Camera, Mail, Phone, Shield, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminProfile } from "@/lib/settings-data";

export default function ProfileTab() {
  const [profile, setProfile] = useState(adminProfile);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Profile Settings</h3>
        <p className="text-sm text-slate-500">Manage your account information and preferences</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 rounded-xl border border-slate-100 bg-white p-6">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
            {profile.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">{profile.name}</p>
          <p className="text-sm text-slate-500">{profile.role}</p>
          <p className="text-xs text-slate-400">ID: {profile.id}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Personal Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Department</label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <h4 className="mb-4 text-sm font-semibold text-slate-900">Preferences</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Timezone</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Asia/Kolkata (GMT+5:30)</option>
                <option>UTC (GMT+0)</option>
                <option>America/New_York (GMT-4)</option>
                <option>Europe/London (GMT+1)</option>
                <option>Asia/Tokyo (GMT+9)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Language</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h4>
              <p className="text-xs text-slate-500">Secure your account with 2FA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              Enabled
            </Badge>
            <Button variant="outline" size="sm" className="h-8">
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";