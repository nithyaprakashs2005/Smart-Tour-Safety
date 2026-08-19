"use client";

import { Phone, Mail, MessageSquare, BookOpen, Clock, Zap } from "lucide-react";
import { supportContacts } from "@/lib/help-data";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Mail,
  MessageSquare,
  BookOpen,
};

export default function ContactCard() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Contact Support</h3>
        <p className="text-xs text-slate-500">Reach our team through any channel</p>
      </div>

      <div className="space-y-3">
        {supportContacts.map((contact) => {
          const Icon = iconMap[contact.icon] || MessageSquare;
          return (
            <div
              key={contact.channel}
              className="flex items-center gap-4 rounded-lg border border-slate-50 p-4 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{contact.channel}</p>
                <p className="text-sm text-blue-600">{contact.value}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {contact.availability}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {contact.responseTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}