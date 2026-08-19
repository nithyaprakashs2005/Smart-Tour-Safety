"use client";

import { useState } from "react";
import { Locate, MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TouristPlace } from "@/lib/map-types";
import {
  WORLD_REGIONS,
  type WorldRegion,
  type WorldTouristPlace,
} from "@/lib/world-tourist-places";

interface WorldPlacesPanelProps {
  places: WorldTouristPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: TouristPlace) => void;
  onLocateUser: () => void;
  isLocating: boolean;
  userLocationLabel?: string | null;
  embedded?: boolean;
  className?: string;
}

export default function WorldPlacesPanel({
  places,
  selectedPlaceId,
  onSelectPlace,
  onLocateUser,
  isLocating,
  userLocationLabel,
  embedded = false,
  className,
}: WorldPlacesPanelProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<WorldRegion>("All");

  const filtered = places.filter((place) => {
    const matchesRegion = region === "All" || place.region === region;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      place.name.toLowerCase().includes(q) ||
      place.country.toLowerCase().includes(q) ||
      place.region.toLowerCase().includes(q);
    return matchesRegion && matchesQuery;
  });

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white/97 shadow-xl backdrop-blur-md",
        embedded ? "w-64" : "w-72",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-slate-900">Explore Places</p>
            <p className="text-[10px] text-slate-500">World tourist destinations</p>
          </div>
          <button
            type="button"
            onClick={onLocateUser}
            disabled={isLocating}
            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
          >
            <Locate className={cn("h-3 w-3", isLocating && "animate-pulse")} />
            My location
          </button>
        </div>

        {userLocationLabel && (
          <p className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-blue-200" />
            You: {userLocationLabel}
          </p>
        )}

        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places..."
            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {WORLD_REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                region === r
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("overflow-y-auto", embedded ? "max-h-[220px]" : "max-h-[320px]")}>
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-slate-500">No places match your search</p>
        ) : (
          filtered.map((place) => {
            const isSelected = selectedPlaceId === place.id;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => onSelectPlace(place)}
                className={cn(
                  "flex w-full items-start gap-2.5 border-b border-slate-100 px-3 py-2.5 text-left transition-colors last:border-0",
                  isSelected ? "bg-blue-50" : "hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    isSelected ? "bg-blue-600 text-white" : "bg-purple-50 text-purple-600",
                  )}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{place.name}</p>
                  <p className="truncate text-[10px] text-slate-500">
                    {place.country} · {place.region}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-amber-600">
                    ★ {place.rating.toFixed(1)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-100 px-3 py-2 text-center text-[10px] text-slate-500">
        {filtered.length} place{filtered.length !== 1 ? "s" : ""} · click to fly on map
      </div>
    </div>
  );
}
