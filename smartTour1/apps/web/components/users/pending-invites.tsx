"use client";

import { Mail, Clock, RotateCcw, X, UserPlus, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pendingInvites, roles } from "@/lib/users-data";

const statusConfig = {
  pending: { badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
  accepted: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Accepted" },
  expired: { badge: "bg-slate-100 text-slate-500 border-slate-200", label: "Expired" },
};

export default function PendingInvites() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pending Invites</h3>
          <p className="text-xs text-slate-500">Outstanding user invitations</p>
        </div>
        <Button size="sm" className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-3.5 w-3.5" />
          Invite
        </Button>
      </div>

      <div className="space-y-2">
        {pendingInvites.map((invite) => {
          const st = statusConfig[invite.status];
          const role = roles.find((r) => r.id === invite.role);
          return (
            <div
              key={invite.id}
              className="flex items-center justify-between rounded-lg border border-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{invite.email}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{invite.id}</span>
                    <span>·</span>
                    <span>Invited by {invite.invitedBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {role && (
                  <Badge variant="outline" className={cn("text-[10px]", role.color)}>
                    {role.name}
                  </Badge>
                )}
                <Badge variant="outline" className={cn("text-[10px]", st.badge)}>
                  {st.label}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  Expires {new Date(invite.expiresAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <X className="h-3.5 w-3.5 text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";