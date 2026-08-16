"use client";

import { useState } from "react";
import { Users, UserPlus, Download, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import TouristStats from "@/components/tourists/tourist-stats";
import TouristTable from "@/components/tourists/tourist-table";
import TouristDetail from "@/components/tourists/tourist-detail";
import { Tourist } from "@/lib/tourist-data";

export default function TouristsPage() {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Tourists</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                127 total
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Manage registered tourists, monitor vitals, and track real-time locations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Map className="h-3.5 w-3.5" />
              View on Map
            </Button>
            <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-3.5 w-3.5" />
              Add Tourist
            </Button>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Stats */}
          <TouristStats />

          {/* Table */}
          <TouristTable onSelectTourist={setSelectedTourist} />
        </div>
      </main>

      {/* Detail Drawer */}
      {selectedTourist && (
        <TouristDetail tourist={selectedTourist} onClose={() => setSelectedTourist(null)} />
      )}
    </div>
  );
}