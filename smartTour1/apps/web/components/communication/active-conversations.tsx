"use client";

import { useState } from "react";
import { Send, Circle, AlertTriangle, CheckCheck, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { conversations, type Conversation } from "@/lib/communication-data";
import { cn } from "@/lib/utils";

const statusColors = {
  safe: "bg-emerald-500",
  warning: "bg-amber-500",
  emergency: "bg-red-500",
};

interface ActiveConversationsProps {
  conversations?: Conversation[];
  onSelectConversation?: (conversationId: string) => void;
}

export default function ActiveConversations({ 
  conversations: dynamicConversations = conversations,
  onSelectConversation 
}: ActiveConversationsProps) {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    if (onSelectConversation) {
      onSelectConversation(conv.id);
    }
  };

  const handleBack = () => {
    setActiveConv(null);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeConv) return;
    
    // In a real app, this would send the reply to the backend
    console.log("Sending reply:", replyText);
    setReplyText("");
  };

  if (activeConv) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
            {activeConv.touristName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{activeConv.touristName}</p>
            <p className="text-xs text-slate-500">{activeConv.touristId}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", statusColors[activeConv.touristStatus])} />
            <span className="text-xs capitalize text-slate-600">{activeConv.touristStatus}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {activeConv.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.from === "admin" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5",
                  msg.from === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900"
                )}
              >
                <p className="text-sm">{msg.text}</p>
                <div
                  className={cn(
                    "mt-1 flex items-center justify-end gap-1",
                    msg.from === "admin" ? "text-blue-200" : "text-slate-400"
                  )}
                >
                  <span className="text-[10px]">{msg.time}</span>
                  {msg.from === "admin" && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && replyText.trim()) {
                  handleSendReply();
                }
              }}
            />
            <Button
              size="icon"
              onClick={handleSendReply}
              className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700"
              disabled={!replyText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Active Conversations</h3>
          <p className="text-xs text-slate-500">Real-time tourist messaging</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          {dynamicConversations.reduce((acc, c) => acc + c.unread, 0)} unread
        </Badge>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {dynamicConversations.map((conv) => (
          <button
            key={conv.id}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors",
              conv.unread > 0 ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"
            )}
            onClick={() => handleSelectConversation(conv)}
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                {conv.touristName.split(" ").map((n) => n[0]).join("")}
              </div>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                  statusColors[conv.touristStatus]
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{conv.touristName}</p>
                <span className="text-[10px] text-slate-400">{conv.lastMessageTime.split(" ")[0]}</span>
              </div>
              <p className="truncate text-xs text-slate-500">{conv.lastMessage}</p>
            </div>
            {conv.unread > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {conv.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}