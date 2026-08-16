"use client";

import { Radio, MessageSquarePlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import CommunicationStats from "@/components/communication/communication-stats";
import ComposePanel from "@/components/communication/compose-panel";
import MessageHistory from "@/components/communication/message-history";
import ActiveConversations from "@/components/communication/active-conversations";

export default function CommunicationPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Communication</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Broadcast alerts, send direct messages, and manage tourist conversations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export Log
            </Button>
            <Button size="sm" className="gap-1.5 bg-red-600 hover:bg-red-700">
              <Radio className="h-3.5 w-3.5" />
              Emergency Broadcast
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <CommunicationStats />

          {/* Compose + Conversations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ComposePanel />
            </div>
            <div className="lg:col-span-1">
              <div className="h-[560px]">
                <ActiveConversations />
              </div>
            </div>
          </div>

          {/* Message History */}
          <MessageHistory />
        </div>
      </main>
    </div>
  );
}