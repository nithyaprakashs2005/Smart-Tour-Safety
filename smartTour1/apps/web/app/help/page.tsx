"use client";

import { useState } from "react";
import { HelpCircle, Ticket, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import HelpStats from "@/components/help/help-stats";
import KnowledgeBase from "@/components/help/knowledge-base";
import FAQSection from "@/components/help/faq-section";
import TicketTable from "@/components/help/ticket-table";
import TicketDetail from "@/components/help/ticket-detail";
import ContactCard from "@/components/help/contact-card";
import { Ticket as TicketType } from "@/lib/help-data";

export default function HelpPage() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-900">Help & Support</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Documentation, FAQs, ticket management, and support channels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Live Chat
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <Ticket className="h-3.5 w-3.5" />
              Submit Ticket
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <HelpStats />

          {/* Knowledge Base + Contact */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <KnowledgeBase />
            </div>
            <div className="lg:col-span-1">
              <ContactCard />
            </div>
          </div>

          {/* FAQ */}
          <FAQSection />

          {/* Tickets */}
          <TicketTable onSelectTicket={setSelectedTicket} />
        </div>
      </main>

      {/* Ticket Detail Drawer */}
      {selectedTicket && (
        <TicketDetail ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}