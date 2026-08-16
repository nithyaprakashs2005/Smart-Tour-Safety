"use client";

import { useState } from "react";
import { Users, UserPlus, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import UserStats from "@/components/users/user-stats";
import UserTable from "@/components/users/user-table";
import RolesMatrix from "@/components/users/roles-matrix";
import PendingInvites from "@/components/users/pending-invites";
import UserDetail from "@/components/users/user-detail";
import { User } from "@/lib/users-data";

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Users & Roles</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                24 users
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage system users, roles, permissions, and access control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Audit Log
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-3.5 w-3.5" />
              Invite User
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <UserStats />

          {/* Users Table */}
          <UserTable onSelectUser={setSelectedUser} />

          {/* Roles + Invites */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RolesMatrix />
            <PendingInvites />
          </div>
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedUser && (
        <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}