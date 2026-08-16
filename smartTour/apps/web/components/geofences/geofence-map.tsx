"use client";

import { useState, useCallback } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/maplibre";
import type { LayerProps } from "react-map-gl/maplibre";
import { Plus, Minus, LocateFixed, Layers, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { geofences, type Geofence } from "@/lib/geofence-data";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const fillLayer: LayerProps = {
  id: "geofence-fill",
  type: "fill",
  paint: {
    "fill-color": ["get", "color"],
    "fill-opacity": ["get", "fillOpacity"],
  },
};

const lineLayer: LayerProps = {
  id: "geofence-line",
  type: "line",
  paint: {
    "line-color": ["get", "color"],
    "line-width": 2,
    "line-opacity": 0.8,
  },
};

function buildGeoJSON(geofenceList: Geofence[]) {
  const features = geofenceList
    .filter((g) => g.type === "polygon")
    .map((g) => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [g.coordinates],
      },
      properties: {
        id: g.id,
        color: g.color,
        fillOpacity: g.fillOpacity,
        name: g.name,
      },
    }));

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

interface GeofenceMapProps {
  selectedId?: string | null;
  onSelectGeofence: (gf: Geofence) => void;
}

export default function GeofenceMap({ selectedId, onSelectGeofence }: GeofenceMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 79.48,
    latitude: 30.70,
    zoom: 12,
  });

  const onMove = useCallback((evt: any) => {
    setViewState(evt.viewState);
  }, []);

  const geojson = buildGeoJSON(geofences);

  if (!TOKEN) {
    return (
      <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-500">Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local to enable the map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Map
        {...viewState}
        onMove={onMove}
        mapLib={maplibregl}
        style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        attributionControl={false}
      >
        <Source id="geofences" type="geojson" data={geojson}>
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Source>

        {geofences
          .filter((g) => g.type === "circle" && g.center)
          .map((g) => (
            <Marker
              key={g.id}
              longitude={g.center!.lng}
              latitude={g.center!.lat}
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                onSelectGeofence(g);
              }}
            >
              <div className="group relative cursor-pointer">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110"
                  style={{ backgroundColor: g.color }}
                >
                  <Hexagon className="h-4 w-4 text-white" />
                </div>
                <div
                  className="absolute -inset-2 rounded-full opacity-20"
                  style={{ backgroundColor: g.color }}
                />
                <div className="absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                  {g.name}
                </div>
              </div>
            </Marker>
          ))}
      </Map>

      {/* Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
          <Plus className="h-4 w-4 text-slate-600" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
          <Minus className="h-4 w-4 text-slate-600" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
          <LocateFixed className="h-4 w-4 text-slate-600" />
        </Button>
        <Button variant="secondary" size="icon" className="h-8 w-8 bg-white shadow-md">
          <Layers className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-slate-700">Zone Types</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-500/20 border border-blue-500" />
            <span className="text-xs text-slate-600">Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-500/20 border border-emerald-500" />
            <span className="text-xs text-slate-600">Trail Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-red-500/20 border border-red-500" />
            <span className="text-xs text-slate-600">Restricted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-amber-500/20 border border-amber-500" />
            <span className="text-xs text-slate-600">Camp / Flood Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}