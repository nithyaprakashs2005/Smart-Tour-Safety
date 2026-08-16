"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ShieldCheck,
  Shield,
  MapPin,
  Clock,
  Lock,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users, roles, type User, type UserStatus, type UserRole } from "@/lib/users-data";

const statusConfig: Record<UserStatus, { label: string; badge: string; dot: string }> = {
  active: { label: "Active", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", badge: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  pending: { label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  locked: { label: "Locked", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

interface UserTableProps {
  onSelectUser: (user: User) => void;
}

export default function UserTable({ onSelectUser }: UserTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users by name, email, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-80 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="locked">Locked</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <option value="ranger">Ranger</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button size="sm" className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700">
            <Mail className="h-3.5 w-3.5" />
            Invite User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-slate-500">User</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Role</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Department</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Last Active</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">2FA</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Logins</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => {
              const st = statusConfig[user.status];
              const role = roles.find((r) => r.id === user.role);
              return (
                <TableRow
                  key={user.id}
                  className={cn(
                    "cursor-pointer border-slate-50 transition-colors",
                    user.status === "locked" ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"
                  )}
                  onClick={() => onSelectUser(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {role && (
                      <Badge variant="outline" className={cn("text-xs font-medium", role.color)}>
                        {role.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", st.dot)} />
                      <span className="text-sm font-medium text-slate-700">{st.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{user.department}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formatTime(user.lastActive)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.twoFactorEnabled ? (
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Shield className="h-4 w-4 text-slate-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-700">{user.loginCount}</span>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="h-8 w-8 text-slate-300" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No users found</p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium">{filtered.length}</span> of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Previous</Button>
          <Button variant="outline" size="sm" disabled className="h-8 text-xs">Next</Button>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";