"use client";

import { useState } from "react";
import { Shield, Users, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { roles, permissions } from "@/lib/users-data";

export default function RolesMatrix() {
  const [expandedRole, setExpandedRole] = useState<string | null>("admin");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Roles & Permissions</h3>
          <p className="text-xs text-slate-500">Role-based access control matrix</p>
        </div>
      </div>

      <div className="space-y-3">
        {roles.map((role) => {
          const isExpanded = expandedRole === role.id;
          return (
            <div
              key={role.id}
              className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left"
                onClick={() => setExpandedRole(isExpanded ? null : role.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", role.color.split(" ")[0])}>
                    <Shield className="h-5 w-5" style={{ color: "inherit" }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{role.name}</p>
                      <Badge variant="outline" className={cn("text-[10px]", role.color)}>
                        {role.userCount} users
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">{role.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 px-5 pb-5">
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {permissions.map((perm) => {
                      const hasPerm = role.permissions.includes(perm.id);
                      return (
                        <div
                          key={perm.id}
                          className="flex items-center justify-between rounded-lg py-2 px-3 hover:bg-slate-50"
                        >
                          <div>
                            <p className="text-sm text-slate-800">{perm.label}</p>
                            <p className="text-xs text-slate-500">{perm.description}</p>
                          </div>
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full",
                              hasPerm ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                            )}
                          >
                            {hasPerm ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";