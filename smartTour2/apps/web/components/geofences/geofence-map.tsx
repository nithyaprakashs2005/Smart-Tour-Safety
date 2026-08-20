"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl/maplibre";
import type { LayerProps, MapRef } from "react-map-gl/maplibre";
import { Plus, Minus, LocateFixed, Hexagon, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Geofence } from "@/lib/geofence-data";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm-base", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }],
} as const;

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
        breached: g.breachCount24h > 0,
      },
    }));

  return {
    type: "FeatureCollection" as const,
    features,
  };
}

function createCirclePolygon(centerLng: number, centerLat: number, radiusKm: number, steps = 64) {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = (radiusKm / 111.32) / Math.cos((centerLat * Math.PI) / 180);
    const dy = radiusKm / 111.32;
    coords.push([centerLng + dx * Math.cos(angle), centerLat + dy * Math.sin(angle)]);
  }
  return coords;
}

interface GeofenceMapProps {
  geofences: Geofence[];
  selectedId?: string | null;
  onSelectGeofence: (gf: Geofence) => void;
}

export default function GeofenceMap({ geofences, selectedId, onSelectGeofence }: GeofenceMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 79.48,
    latitude: 30.7,
    zoom: 12,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const onMove = useCallback((evt: { viewState: typeof viewState }) => {
    setViewState(evt.viewState);
  }, []);

  const onLoad = useCallback(() => {
    setMapLoaded(true);
    setMapError(null);
  }, []);

  const onError = useCallback((error: any) => {
    console.error('Map loading error:', error);
    setMapError('Failed to load map. Please refresh the page.');
    setMapLoaded(false);
  }, []);

  // Auto-center map on geofences
  useEffect(() => {
    if (geofences.length === 0) return;

    const allCoords: [number, number][] = geofences.flatMap((gf) => {
      if (gf.type === "circle" && gf.center) {
        return [[gf.center.lng, gf.center.lat] as [number, number]];
      }

      return (gf.coordinates ?? []).filter(
        (coord): coord is [number, number] => Array.isArray(coord) && coord.length >= 2 && typeof coord[0] === "number" && typeof coord[1] === "number",
      );
    });

    if (allCoords.length === 0) return;

    const lngs = allCoords.map((c) => c[0]);
    const lats = allCoords.map((c) => c[1]);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    setViewState(prev => ({
      ...prev,
      longitude: centerLng,
      latitude: centerLat,
      zoom: 12,
    }));
  }, [geofences]);

  const polygonGeoJson = buildGeoJSON(geofences);
  
  // Build circle geofences as polygons
  const circleFeatures = geofences
    .filter((g) => g.type === "circle" && g.center && g.radius)
    .map((g) => ({
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [createCirclePolygon(g.center!.lng, g.center!.lat, g.radius! / 1000)],
      },
      properties: {
        id: g.id,
        color: g.color,
        fillOpacity: g.fillOpacity,
        name: g.name,
        breached: g.breachCount24h > 0,
      },
    }));

  const circleGeoJson = {
    type: "FeatureCollection" as const,
    features: circleFeatures,
  };

  const resetView = () => {
    mapRef.current?.flyTo({
      center: [79.48, 30.7],
      zoom: 12,
      duration: 900,
    });
  };

  const totalTourists = geofences.reduce((sum, gf) => sum + gf.touristCount, 0);
  const totalBreaches = geofences.reduce((sum, gf) => sum + gf.breachCount24h, 0);

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white">
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-slate-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <p className="text-sm text-slate-700">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      <Map
        ref={mapRef}
        {...viewState}
        onMove={onMove}
        onLoad={onLoad}
        onError={onError}
        mapLib={maplibregl}
        style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
        mapStyle={OSM_STYLE as unknown as maplibregl.StyleSpecification}
        attributionControl={false}
      >
        {/* Polygon Geofences */}
        <Source id="geofences-polygon" type="geojson" data={polygonGeoJson}>
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Source>

        {/* Circle Geofences */}
        <Source id="geofences-circle" type="geojson" data={circleGeoJson}>
          <Layer {...fillLayer} />
          <Layer {...lineLayer} />
        </Source>

        {/* Center Markers for Circle Geofences */}
        {geofences
          .filter((g) => g.type === "circle" && g.center)
          .map((g) => (
            <Marker
              key={g.id}
              longitude={g.center!.lng}
              latitude={g.center!.lat}
              onClick={(e: { originalEvent: Event }) => {
                e.originalEvent.stopPropagation();
                onSelectGeofence(g);
              }}
            >
              <div className="group relative cursor-pointer">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110",
                    selectedId === g.id && "ring-4 ring-blue-500 ring-offset-2"
                  )}
                  style={{ backgroundColor: g.color }}
                >
                  <Hexagon className="h-4 w-4 text-white" />
                </div>
                {g.breachCount24h > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white animate-pulse">
                    <AlertTriangle className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
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
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md"
          onClick={() => mapRef.current?.zoomIn()}
        >
          <Plus className="h-4 w-4 text-slate-600" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md"
          onClick={() => mapRef.current?.zoomOut()}
        >
          <Minus className="h-4 w-4 text-slate-600" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white shadow-md"
          onClick={resetView}
        >
          <LocateFixed className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* Live Stats Overlay */}
      <div className="absolute top-4 left-4 rounded-lg bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-medium text-slate-700">Live Monitoring</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {totalTourists} tourists
          </span>
          <span className={cn("flex items-center gap-1", totalBreaches > 0 ? "text-red-600" : "text-slate-500")}>
            <AlertTriangle className="h-3 w-3" />
            {totalBreaches} breaches
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-slate-700">Zone Types</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-blue-500 bg-blue-500/20" />
            <span className="text-xs text-slate-600">Safe Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-emerald-500 bg-emerald-500/20" />
            <span className="text-xs text-slate-600">Trail Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-red-500 bg-red-500/20" />
            <span className="text-xs text-slate-600">Restricted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-amber-500 bg-amber-500/20" />
            <span className="text-xs text-slate-600">Camp / Flood Risk</span>
          </div>
        </div>
        {selectedId && (
          <p className="mt-2 border-t border-slate-200 pt-2 text-[10px] text-slate-500">
            Selected: {geofences.find((g) => g.id === selectedId)?.name}
          </p>
        )}
      </div>
    </div>
  );
}
