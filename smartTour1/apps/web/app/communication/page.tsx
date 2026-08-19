"use client";

import { useState, useEffect, useCallback } from "react";
import { Radio, MessageSquarePlus, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import CommunicationStats from "@/components/communication/communication-stats";
import ComposePanel from "@/components/communication/compose-panel";
import MessageHistory from "@/components/communication/message-history";
import ActiveConversations from "@/components/communication/active-conversations";
import { messages, conversations, communicationStats, type Message, type Conversation } from "@/lib/communication-data";

export default function CommunicationPage() {
  const [dynamicMessages, setDynamicMessages] = useState<Message[]>(messages);
  const [dynamicConversations, setDynamicConversations] = useState<Conversation[]>(conversations);
  const [dynamicStats, setDynamicStats] = useState(communicationStats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time updates
  const refreshData = useCallback(() => {
    setIsRefreshing(true);

    const senderOptions: Message["sender"][] = ["Admin", "System", "Ranger Mike Chen", "Commander Arjun Mehta"];
    const randomSender = senderOptions[Math.floor(Math.random() * senderOptions.length)] ?? "Admin";

    // Simulate new message arrival
    const newMessage: Message = {
      id: `MSG-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      type: ["broadcast", "direct", "auto", "group"][Math.floor(Math.random() * 4)] as any,
      priority: ["low", "normal", "high", "critical"][Math.floor(Math.random() * 4)] as any,
      sender: randomSender,
      senderRole: "System Administrator",
      recipients: ["All Tourists"],
      recipientCount: Math.floor(Math.random() * 50) + 80,
      subject: "Test Message " + new Date().toLocaleTimeString(),
      body: "This is a test message for the communication system.",
      sentAt: new Date().toISOString(),
      status: ["sent", "delivered", "read", "failed", "pending"][Math.floor(Math.random() * 5)] as any,
      readCount: Math.floor(Math.random() * 50),
      replyCount: Math.floor(Math.random() * 5),
      channel: ["push", "sms", "email", "in-app", "all"][Math.floor(Math.random() * 5)] as any,
    };

    // Simulate conversation updates
    const updatedConversations = dynamicConversations.map(conv => ({
      ...conv,
      unread: Math.random() > 0.7 ? Math.min(conv.unread + 1, 5) : Math.max(conv.unread - 1, 0),
    }));

    // Update stats
    const totalSent = dynamicMessages.length + 1;
    const deliveredCount = dynamicMessages.filter(m => m.status === "delivered" || m.status === "read").length;
    const failedCount = dynamicMessages.filter(m => m.status === "failed").length;
    const unreadCount = updatedConversations.reduce((sum, c) => sum + c.unread, 0);

    setDynamicMessages([newMessage, ...dynamicMessages].slice(0, 50));
    setDynamicConversations(updatedConversations);
    setDynamicStats({
      sentToday: totalSent,
      delivered: deliveredCount,
      failed: failedCount,
      pending: 0,
      responseRate: "87%",
      avgReadTime: "3m 24s",
      activeConversations: updatedConversations.length,
    });
    setLastUpdate(new Date());
    setIsRefreshing(false);
  }, [dynamicMessages, dynamicConversations]);

  useEffect(() => {
    const interval = setInterval(refreshData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleSendMessage = useCallback((messageData: Omit<Message, "id" | "sentAt" | "status" | "readCount" | "replyCount">) => {
    const newMessage: Message = {
      ...messageData,
      id: `MSG-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      sentAt: new Date().toISOString(),
      status: "sent",
      readCount: 0,
      replyCount: 0,
    };

    setDynamicMessages([newMessage, ...dynamicMessages]);
    setDynamicStats(prev => ({
      ...prev,
      sentToday: prev.sentToday + 1,
    }));
  }, [dynamicMessages, dynamicStats]);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setDynamicConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread: 0 }
        : conv
    ));
  }, []);

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
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Broadcast alerts, send direct messages, and manage tourist conversations.
              <span className="ml-2 text-xs text-slate-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
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
          <CommunicationStats stats={dynamicStats} />

          {/* Compose + Conversations */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ComposePanel onSendMessage={handleSendMessage} />
            </div>
            <div className="lg:col-span-1">
              <div className="h-[560px]">
                <ActiveConversations 
                  conversations={dynamicConversations}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
            </div>
          </div>

          {/* Message History */}
          <MessageHistory messages={dynamicMessages} />
        </div>
      </main>
    </div>
  );
}

import { cn } from "@/lib/utils";