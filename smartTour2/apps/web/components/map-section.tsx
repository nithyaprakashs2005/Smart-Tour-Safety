"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl/maplibre";
import type { MapRef, LayerProps } from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Search, Plus, Minus, LocateFixed, Layers, Shield, Heart, Battery,
  Mountain, AlertTriangle, Radio, Compass, CheckCircle2, X, Navigation,
  Sparkles, Loader2, MapPin, Tent, Cross, Star, Clock, Landmark, Eye,
  Maximize2, Minimize2, Ruler, Download, Bookmark, BookmarkCheck,
  Wind, CloudRain, Activity, Route, Flag, Crosshair, Map as MapIcon,
  Flame, SlidersHorizontal, Circle, Locate, Globe, RefreshCw
} from "lucide-react";
import type { TouristPlace } from "@/lib/map-types";
import { WORLD_TOURIST_PLACES } from "@/lib/world-tourist-places";
import WorldPlacesPanel from "@/components/world-places-panel";
import { cn } from "@/lib/utils";
import { saveDemoLocationToCloud } from "@/lib/firebase-sync";
import {
  getDashboardData,
  dispatchTourist,
  updateDemoTouristLocation,
  type DashboardData,
} from "@/lib/smarttour-api";

export type { TouristPlace } from "@/lib/map-types";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  status: "safe" | "warning" | "emergency";
  label: string;
  touristId?: string;
  touristName?: string;
  heartRate?: number | null;
  battery?: number;
  alertType?: string;
  altitude?: string;
  lastUpdate?: string;
}

// ══════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ══════════════════════════════════════════════════════════════

interface RouteGeoJson {
  type: "Feature";
  geometry: { type: "LineString"; coordinates: [number, number][] };
  properties: Record<string, never>;
}

interface OsrmRouteResponse {
  code: string;
  routes?: Array<{ distance: number; duration: number; geometry: { type: "LineString"; coordinates: [number, number][] } }>;
  trips?: Array<{ distance: number; duration: number; geometry: { type: "LineString"; coordinates: [number, number][] } }>;
}

interface WeatherData { temp: number; wind: number; rain: number; code: number }
interface GeocoderResult { place_id: number; display_name: string; lat: string; lon: string }
interface Waypoint { id: string; lat: number; lng: number; name: string }

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function createCirclePolygon(centerLng: number, centerLat: number, radiusKm: number, steps = 64) {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = (radiusKm / 111.32) / Math.cos((centerLat * Math.PI) / 180);
    const dy = radiusKm / 111.32;
    coords.push([centerLng + dx * Math.cos(angle), centerLat + dy * Math.sin(angle)]);
  }
  return { type: "Feature" as const, geometry: { type: "Polygon" as const, coordinates: [coords] }, properties: {} };
}

function generateDynamicGeofence(centerLat: number, centerLng: number, radiusKm = 6) {
  const pts: [number, number][] = [];
  const count = 10;
  for (let i = 0; i <= count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    const r = radiusKm * (0.8 + Math.sin(i * 1.5) * 0.25);
    const dx = (r / 111.32) / Math.cos((centerLat * Math.PI) / 180);
    const dy = r / 111.32;
    pts.push([centerLng + dx * Math.cos(angle), centerLat + dy * Math.sin(angle)]);
  }
  return pts;
}

function generateDynamicDangerZones(centerLat: number, centerLng: number) {
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: { name: "High Hazard Sector A" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [centerLng - 0.025, centerLat + 0.015],
            [centerLng - 0.010, centerLat + 0.028],
            [centerLng - 0.005, centerLat + 0.018],
            [centerLng - 0.018, centerLat + 0.008],
            [centerLng - 0.025, centerLat + 0.015]
          ]]
        }
      },
      {
        type: "Feature" as const,
        properties: { name: "Restricted Corridor B" },
        geometry: {
          type: "Polygon" as const,
          coordinates: [[
            [centerLng + 0.012, centerLat - 0.018],
            [centerLng + 0.028, centerLat - 0.010],
            [centerLng + 0.035, centerLat - 0.022],
            [centerLng + 0.018, centerLat - 0.030],
            [centerLng + 0.012, centerLat - 0.018]
          ]]
        }
      }
    ]
  };
}

function generateDynamicUnits(centerLat: number, centerLng: number): MapMarker[] {
  return [];
  /* Legacy simulator removed: live markers are supplied only by Firebase-backed telemetry.
  const markers: MapMarker[] = [];
  for (let i = 0; i < TOURIST_NAMES.length; i++) {
    const angle = (i / TOURIST_NAMES.length) * 2 * Math.PI + Math.random() * 0.4;
    const distanceKm = 0.5 + Math.random() * 3.5;
    const dx = (distanceKm / 111.32) / Math.cos((centerLat * Math.PI) / 180);
    const dy = distanceKm / 111.32;
    
    let status: "safe" | "warning" | "emergency" = "safe";
    let alertType: string | undefined = undefined;
    if (i === 1) {
      status = "emergency";
      alertType = ALERT_PRESETS[2];
    } else if (i === 4 || i === 8) {
      status = "warning";
      alertType = i === 4 ? ALERT_PRESETS[1] : ALERT_PRESETS[0];
    }

    markers.push({
      id: `unit-${i + 1}`,
      lat: centerLat + dy * Math.sin(angle),
      lng: centerLng + dx * Math.cos(angle),
      status,
      label: `Beacon #${100 + i + 1}`,
      touristId: `T-${200 + i + 1}`,
      touristName: TOURIST_NAMES[i],
      heartRate: status === "emergency" ? 142 : status === "warning" ? 118 : 72 + Math.floor(Math.random() * 16),
      battery: status === "warning" && i === 8 ? 14 : 45 + Math.floor(Math.random() * 50),
      alertType,
      altitude: `${Math.floor(120 + Math.random() * 450)}m`,
      lastUpdate: "Live · Real-time"
    });
  }
  return markers;
  */
}

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

function generateTrailCoords(lat: number, lng: number): [number, number][] {
  const trail: [number, number][] = [];
  let cLat = lat - 0.008;
  let cLng = lng - 0.006;
  for (let i = 0; i < 5; i++) {
    cLat += 0.0016 + (Math.sin(i * 2) * 0.0006);
    cLng += 0.0012 + (Math.cos(i * 2) * 0.0006);
    trail.push([cLng, cLat]);
  }
  trail.push([lng, lat]);
  return trail;
}

function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 49) return "🌫️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "❄️";
  return "⛈️";
}

function dashboardToMapMarkers(dashboard: DashboardData): MapMarker[] {
  const alertByTourist: Record<string, string> = {};
  dashboard.alerts
    .filter((alert) => alert.status !== "resolved")
    .forEach((alert) => {
      alertByTourist[alert.tourist_id] = alert.message;
    });

  return dashboard.mapMarkers.map((marker) => ({
    id: marker.id,
    lat: marker.lat,
    lng: marker.lng,
    status: marker.status,
    label: marker.label,
    touristId: marker.touristId,
    touristName: marker.touristName,
    heartRate: marker.heartRate,
    battery: marker.battery ?? 0,
    alertType: alertByTourist[marker.touristId] ?? undefined,
    lastUpdate: marker.lastUpdate || "Live",
  }));
}

function centerOfMarkers(markers: MapMarker[]): { lat: number; lng: number } | null {
  if (markers.length === 0) return null;
  const lat = markers.reduce((sum, marker) => sum + marker.lat, 0) / markers.length;
  const lng = markers.reduce((sum, marker) => sum + marker.lng, 0) / markers.length;
  return { lat, lng };
}

// ══════════════════════════════════════════════════════════════
// MAP STYLES (OpenStreetMap is default)
// ══════════════════════════════════════════════════════════════

const MAP_STYLES = {
  osm: {
    id: "osm",
    name: "OpenStreetMap Standard",
    icon: Globe,
    styleSpec: {
      version: 8,
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "osm-base",
          type: "raster",
          source: "osm-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  voyager: {
    id: "voyager",
    name: "Outdoors / Topo",
    icon: Mountain,
    styleSpec: {
      version: 8,
      sources: {
        "esri-topo": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "&copy; Esri",
        },
      },
      layers: [
        {
          id: "topo-base",
          type: "raster",
          source: "esri-topo",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  positron: {
    id: "positron",
    name: "Clean Light",
    icon: Sparkles,
    styleSpec: {
      version: 8,
      sources: {
        "esri-light": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "&copy; Esri",
        },
      },
      layers: [
        {
          id: "light-base",
          type: "raster",
          source: "esri-light",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  dark: {
    id: "dark",
    name: "Dark Ops",
    icon: Compass,
    styleSpec: {
      version: 8,
      sources: {
        "esri-dark": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "&copy; Esri",
        },
      },
      layers: [
        {
          id: "dark-base",
          type: "raster",
          source: "esri-dark",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  satellite: {
    id: "satellite",
    name: "Satellite Hybrid",
    icon: Layers,
    styleSpec: {
      version: 8,
      sources: {
        "esri-sat": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "&copy; Esri, Maxar",
        },
      },
      layers: [
        {
          id: "sat-base",
          type: "raster",
          source: "esri-sat",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

const MINIMAP_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap",
    },
  },
  layers: [{ id: "osm-base", type: "raster", source: "osm", minzoom: 0, maxzoom: 18 }],
};

// ══════════════════════════════════════════════════════════════
// LAYER SPECS
// ══════════════════════════════════════════════════════════════

const geofenceFillLayer: LayerProps = { id: "geofence-fill", type: "fill", paint: { "fill-color": "#3b82f6", "fill-opacity": 0.10 } };
const geofenceLineLayer: LayerProps = { id: "geofence-outline", type: "line", paint: { "line-color": "#2563eb", "line-width": 2, "line-dasharray": [3, 2], "line-opacity": 0.9 } };
const routeCasingLayer: LayerProps = { id: "route-casing", type: "line", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#ffffff", "line-width": 8, "line-opacity": 0.9 } };
const routeLineLayer: LayerProps = { id: "route-line", type: "line", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#2563eb", "line-width": 5, "line-opacity": 0.95 } };
const clusterLayer: LayerProps = {
  id: "clusters", type: "circle", filter: ["has", "point_count"],
  paint: {
    "circle-color": ["step", ["get", "point_count"], "#8b5cf6", 10, "#7c3aed", 50, "#6d28d9"],
    "circle-radius": ["step", ["get", "point_count"], 22, 10, 30, 50, 38],
    "circle-opacity": 0.88, "circle-stroke-width": 2, "circle-stroke-color": "#ffffff",
  },
};
const clusterCountLayer: LayerProps = {
  id: "cluster-count", type: "symbol", filter: ["has", "point_count"],
  layout: { "text-field": "{point_count_abbreviated}", "text-size": 12 },
  paint: { "text-color": "#ffffff" },
};
const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point", type: "circle", filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": ["match", ["get", "category"], "camp", "#d97706", "viewpoint", "#4f46e5", "attraction", "#7c3aed", "medical", "#dc2626", "trailhead", "#059669", "#6366f1"],
    "circle-radius": 8, "circle-stroke-width": 2, "circle-stroke-color": "#ffffff", "circle-opacity": 0.9,
  },
};
const heatmapLayer: LayerProps = {
  id: "poi-heatmap", type: "heatmap",
  paint: {
    "heatmap-weight": 1,
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 14, 2.5],
    "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(33,102,172,0)", 0.2, "rgb(103,169,207)", 0.5, "rgb(209,229,240)", 0.7, "rgb(253,219,199)", 0.9, "rgb(239,138,98)", 1, "rgb(178,24,43)"],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 14, 25],
    "heatmap-opacity": 0.75,
  },
};
const trailLineLayer: LayerProps = { id: "trail-line", type: "line", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": ["get", "color"], "line-width": 2.5, "line-dasharray": [2, 2], "line-opacity": 0.8 } };
const proximityFillLayer: LayerProps = { id: "proximity-fill", type: "fill", paint: { "fill-color": "#ef4444", "fill-opacity": 0.07 } };
const proximityLineLayer: LayerProps = { id: "proximity-line", type: "line", paint: { "line-color": "#ef4444", "line-width": 1.5, "line-dasharray": [4, 3], "line-opacity": 0.7 } };
const dangerFillLayer: LayerProps = { id: "danger-fill", type: "fill", paint: { "fill-color": "#f97316", "fill-opacity": 0.13 } };
const dangerLineLayer: LayerProps = { id: "danger-line", type: "line", paint: { "line-color": "#ea580c", "line-width": 2, "line-dasharray": [4, 2], "line-opacity": 0.85 } };
const rulerLineLayer: LayerProps = { id: "ruler-line", type: "line", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#fbbf24", "line-width": 2.5, "line-dasharray": [3, 2] } };
const rulerPointLayer: LayerProps = { id: "ruler-points", type: "circle", paint: { "circle-color": "#fbbf24", "circle-radius": 6, "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" } };

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

function BeaconMarker({ marker, isSelected, onClick }: { marker: MapMarker; isSelected: boolean; onClick: () => void }) {
  const isEmergency = marker.status === "emergency";
  const isWarning = marker.status === "warning";
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex cursor-pointer items-center justify-center p-2 outline-none transition-transform hover:scale-110 focus:outline-none"
      title={`${marker.touristName || marker.label} (${marker.status.toUpperCase()})`}>
      {isEmergency && <><span className="absolute h-10 w-10 animate-ping rounded-full bg-rose-500/40 duration-1000" /><span className="absolute h-8 w-8 animate-pulse rounded-full bg-rose-500/30" /></>}
      {isWarning && <span className="absolute h-8 w-8 animate-ping rounded-full bg-amber-500/30 duration-1000" />}
      <div className={cn("relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lg transition-all duration-200",
        isEmergency && "bg-rose-600 ring-4 ring-rose-500/40 text-white animate-bounce",
        isWarning && "bg-amber-500 ring-2 ring-amber-400/40 text-white",
        !isEmergency && !isWarning && "bg-emerald-500 ring-2 ring-emerald-400/30 text-white",
        isSelected && "scale-125 ring-4 ring-blue-500 z-30")}>
        {isEmergency ? <AlertTriangle className="h-3.5 w-3.5 stroke-[2.5]" /> : isWarning ? <Radio className="h-3.5 w-3.5 stroke-[2.5]" /> : <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
      <div className="pointer-events-none absolute -bottom-8 left-1/2 z-40 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-sm group-hover:flex items-center gap-1.5 border border-slate-800">
        <span className={cn("h-1.5 w-1.5 rounded-full", isEmergency ? "bg-rose-500 animate-ping" : isWarning ? "bg-amber-500" : "bg-emerald-500")} />
        <span>{marker.touristName || marker.label}</span>
        {marker.touristId && <span className="text-slate-400 text-[10px]">({marker.touristId})</span>}
      </div>
    </button>
  );
}

function PlaceMarker({ place, isSelected, isFavourite, onClick }: { place: TouristPlace; isSelected: boolean; isFavourite: boolean; onClick: () => void }) {
  const getIcon = () => {
    switch (place.category) {
      case "camp": return Tent; case "viewpoint": return Eye; case "attraction": return Landmark;
      case "medical": return Cross; case "trailhead": return Compass; default: return MapPin;
    }
  };
  const Icon = getIcon();
  const getBg = () => {
    switch (place.category) {
      case "camp": return "bg-amber-600 hover:bg-amber-700"; case "viewpoint": return "bg-indigo-600 hover:bg-indigo-700";
      case "attraction": return "bg-purple-600 hover:bg-purple-700"; case "medical": return "bg-red-600 hover:bg-red-700";
      case "trailhead": return "bg-emerald-600 hover:bg-emerald-700"; default: return "bg-blue-600 hover:bg-blue-700";
    }
  };
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex cursor-pointer items-center justify-center p-1.5 outline-none transition-transform hover:scale-110 focus:outline-none">
      <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white shadow-md text-white transition-all duration-200", getBg(), isSelected && "scale-125 ring-4 ring-purple-400/80 z-30")}>
        <Icon className="h-4 w-4 stroke-[2]" />
        {isFavourite && <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 border border-white"><Star className="h-1.5 w-1.5 fill-white text-white" /></span>}
      </div>
      <div className="pointer-events-none absolute -bottom-8 left-1/2 z-40 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-sm group-hover:flex items-center gap-1 border border-slate-700">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span>{place.name}</span>
      </div>
    </button>
  );
}

function OriginMarker({ name }: { name: string }) {
  return (
    <div className="group relative flex items-center justify-center p-1">
      <span className="absolute h-8 w-8 rounded-full bg-blue-500/20" />
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg ring-2 ring-blue-500/40"><Navigation className="h-3.5 w-3.5 stroke-[2.5]" /></div>
      <div className="pointer-events-none absolute -bottom-8 left-1/2 z-40 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-sm group-hover:flex border border-slate-800">{name}</div>
    </div>
  );
}

function WaypointMarker({ index }: { index: number }) {
  return <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-cyan-600 text-white shadow-md text-[10px] font-bold">{index + 1}</div>;
}

function UserLocationMarker({
  label,
  onClick,
}: {
  label?: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group relative flex cursor-pointer items-center justify-center p-2 outline-none focus:outline-none"
    >
      <span className="absolute h-10 w-10 animate-ping rounded-full bg-blue-500/35 duration-1000" />
      <span className="absolute h-7 w-7 rounded-full bg-blue-400/25 ring-2 ring-blue-400/60" />
      <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 shadow-xl ring-2 ring-blue-500 text-white">
        <Navigation className="h-3 w-3 fill-white stroke-[2.5]" />
      </div>
      <div className="pointer-events-none absolute -bottom-7 left-1/2 z-40 whitespace-nowrap rounded-md bg-slate-950/95 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xl backdrop-blur-sm -translate-x-1/2 border border-slate-800 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{label || "You (Live Position)"}</span>
      </div>
    </button>
  );
}

function ElevationProfile({ elevations, distance }: { elevations: number[]; distance: number }) {
  const min = Math.min(...elevations);
  const max = Math.max(...elevations);
  const range = max - min || 1;
  const W = 260; const H = 52;
  const pts = elevations.map((e, i) => `${((i / (elevations.length - 1)) * W).toFixed(1)},${(H - ((e - min) / range) * H).toFixed(1)}`);
  const area = `0,${H} ${pts.join(" ")} ${W},${H}`;
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-blue-700">
        <span className="flex items-center gap-1"><Activity className="h-3 w-3" />Elevation Profile</span>
        <span>{min.toFixed(0)}m – {max.toFixed(0)}m · {distance.toFixed(1)}km</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        <defs><linearGradient id="elev-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" /></linearGradient></defs>
        <polygon points={area} fill="url(#elev-fill)" />
        <polyline points={pts.join(" ")} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MapSection({
  className,
  embedded = false,
  focusTouristId = null,
  initialShowLayerPanel = false,
}: {
  className?: string;
  embedded?: boolean;
  focusTouristId?: string | null;
  initialShowLayerPanel?: boolean;
}) {
  const mapRef = useRef<MapRef | null>(null);
  const routeAbortRef = useRef<AbortController | null>(null);
  const poiAbortRef = useRef<AbortController | null>(null);
  const poiCacheRef = useRef<Record<string, TouristPlace[]>>({});
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geocodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reverseGeocodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitializedViewRef = useRef(false);
  const lastUploadedLocationRef = useRef<{ lat: number; lng: number; at: number } | null>(null);

  // Dynamic Viewport — default starts with user location or global hub
  const [viewState, setViewState] = useState({ longitude: 0, latitude: 20, zoom: 3, pitch: 0, bearing: 0 });
  const [activeRegionName, setActiveRegionName] = useState("GLOBAL MONITORING GRID");
  const [isLocating, setIsLocating] = useState(false);

  // OpenStreetMap is default
  const [activeStyle, setActiveStyle] = useState<MapStyleKey>("osm");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [showGeofence, setShowGeofence] = useState(true);
  const [is3DMode, setIs3DMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "safe" | "warning" | "emergency">("all");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [dispatchedAlert, setDispatchedAlert] = useState<string | null>(null);
  
  // Real-time Dynamic Units (Spawns and moves wherever you pan on Earth)
  const [dynamicMarkers, setDynamicMarkers] = useState<MapMarker[]>([]);

  // POI state
  const [selectedPlace, setSelectedPlace] = useState<TouristPlace | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [showPOIs, setShowPOIs] = useState(true);
  const [touristPlaces, setTouristPlaces] = useState<TouristPlace[]>([]);
  const [isFetchingPOIs, setIsFetchingPOIs] = useState(false);

  // Dynamic Rescue Center Command Post
  const [routeOrigin, setRouteOrigin] = useState({ lng: 0, lat: 20, name: "Rescue Command Post" });
  const [routeGeoJson, setRouteGeoJson] = useState<RouteGeoJson | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeTargetId, setRouteTargetId] = useState<string | null>(null);

  // Tools state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerPoints, setRulerPoints] = useState<[number, number][]>([]);
  const [rulerDistance, setRulerDistance] = useState<number | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [useCluster, setUseCluster] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showProximityRadius, setShowProximityRadius] = useState(true);
  const [proximityRadiusKm, setProximityRadiusKm] = useState(1.5);
  const [showLayerPanel, setShowLayerPanel] = useState(initialShowLayerPanel);
  const [mapReady, setMapReady] = useState(false);
  const [isRefreshingData, setIsRefreshingData] = useState(false);

  useEffect(() => {
    setShowLayerPanel(initialShowLayerPanel);
  }, [initialShowLayerPanel]);
  const [favouritePlaceIds, setFavouritePlaceIds] = useState<Set<string>>(new Set());
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);
  const [isTripRouting, setIsTripRouting] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [elevationProfile, setElevationProfile] = useState<number[] | null>(null);
  const [geocodeQuery, setGeocodeQuery] = useState("");
  const [geocodeResults, setGeocodeResults] = useState<GeocoderResult[]>([]);
  const [isGeocodingSearching, setIsGeocodingSearching] = useState(false);
  const [showGeocodeResults, setShowGeocodeResults] = useState(false);
  const [poiRadiusKm, setPoiRadiusKm] = useState<number | null>(null);
  const [showRadiusFilter, setShowRadiusFilter] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [userLocationLabel, setUserLocationLabel] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showWorldPlacesPanel, setShowWorldPlacesPanel] = useState(true);
  const [showUserLocationPopup, setShowUserLocationPopup] = useState(false);
  const [isPinningLocationMode, setIsPinningLocationMode] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const userLocationInitializedRef = useRef(false);
  const [mapLoadingError, setMapLoadingError] = useState<string | null>(null);

  const applyBackendDashboard = useCallback((dashboard: DashboardData, centerMap = false) => {
    const markers = dashboardToMapMarkers(dashboard);
    setDynamicMarkers(markers);

    if (centerMap) {
      const center = centerOfMarkers(markers);
      if (center) {
        setViewState((prev) => ({
          ...prev,
          latitude: center.lat,
          longitude: center.lng,
          zoom: prev.zoom < 8 ? 12 : prev.zoom,
        }));
        setRouteOrigin({
          lng: center.lng,
          lat: center.lat,
          name: "Rescue Command Post",
        });
        hasInitializedViewRef.current = true;
      }
    }
  }, []);

  const loadBackendData = useCallback(async (centerMap = false) => {
    try {
      const dashboard = await getDashboardData();
      applyBackendDashboard(dashboard, centerMap);
      return true;
    } catch {
      return false;
    }
  }, [applyBackendDashboard]);

  const refreshBackendData = useCallback(async () => {
    setIsRefreshingData(true);
    try {
      await loadBackendData(false);
    } finally {
      setIsRefreshingData(false);
    }
  }, [loadBackendData]);

  const flyToUserLocation = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      duration: 1200,
      essential: true,
    });
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom: 14,
      pitch: 0,
      bearing: 0,
    }));
    hasInitializedViewRef.current = true;
  }, []);

  const saveAndShowUserLocation = useCallback((position: GeolocationPosition, forceCenter = false) => {
    const { latitude, longitude, accuracy } = position.coords;
    const location = { lat: latitude, lng: longitude, accuracy };

    setUserLocation(location);
    setUserLocationLabel("Your live location");
    setLocationError(null);
    setRouteOrigin({ lng: longitude, lat: latitude, name: "Your live location" });

    const previousUpload = lastUploadedLocationRef.current;
    const moved = !previousUpload || haversineKm(previousUpload.lat, previousUpload.lng, latitude, longitude) >= 0.02;
    const isDue = !previousUpload || Date.now() - previousUpload.at >= 30_000;
    if (moved || isDue) {
      lastUploadedLocationRef.current = { lat: latitude, lng: longitude, at: Date.now() };
      updateDemoTouristLocation({ lat: latitude, lng: longitude, location: "Live device location", activity: "Moving" }).catch(() => {
        /* The marker remains live locally if the API is temporarily unreachable. */
      });
      saveDemoLocationToCloud({ lat: latitude, lng: longitude, activity: "Moving" }).catch(() => {
        /* Firestore security rules may require an authenticated demo user. */
      });
    }

    try {
      localStorage.setItem("smarttour-user-location", JSON.stringify(location));
    } catch {
      /* Location tracking works even when browser storage is unavailable. */
    }

    if (forceCenter || !userLocationInitializedRef.current) {
      flyToUserLocation(latitude, longitude);
      userLocationInitializedRef.current = true;
    }
  }, [flyToUserLocation]);

  const getLocationErrorMessage = useCallback((error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      return "Location access is blocked. Allow location permission in your browser, then try again.";
    }
    if (error.code === error.POSITION_UNAVAILABLE) {
      return "Your device could not determine a location. Check GPS, Wi-Fi, or mobile data.";
    }
    return "Location request timed out. Move to an area with a clearer GPS signal and try again.";
  }, []);

  const flyToPlace = useCallback((lng: number, lat: number, zoom = 15) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom,
      pitch: 45,
      bearing: 0,
      duration: 1400,
      essential: true,
    });
    setViewState((prev) => ({
      ...prev,
      longitude: lng,
      latitude: lat,
      zoom,
      pitch: 45,
      bearing: 0,
    }));
  }, []);

  // ── Manual GPS Locate Click (only when user explicitly requests) ──
  const locateUser = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Live location is not supported by this browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveAndShowUserLocation(pos, true);
        setIsLocating(false);
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error));
        setIsLocating(false);
      },
      { timeout: 15000, maximumAge: 5000, enableHighAccuracy: true }
    );
  }, [getLocationErrorMessage, saveAndShowUserLocation]);

  const setAsOperationsBase = useCallback((lat: number, lng: number, name: string) => {
    const base = { lat, lng, name, zoom: 13 };
    try {
      localStorage.setItem("smarttour-base-location", JSON.stringify(base));
      window.dispatchEvent(new CustomEvent("smarttour-location-changed", { detail: base }));
    } catch {
      /* ignore */
    }
    setRouteOrigin({ lng, lat, name });
    setActiveRegionName(`${name.toUpperCase()} OPS GRID`);
  }, []);

  // ── Watch user's live GPS position passively (does not hijack map view) ──
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationError("Live location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => saveAndShowUserLocation(pos, true),
      (error) => setLocationError(getLocationErrorMessage(error)),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        saveAndShowUserLocation(pos);
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error));
        /* permission denied — fallback handled elsewhere */
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [getLocationErrorMessage, saveAndShowUserLocation]);

  // ── Passive GPS & Saved Location Restoration on Mount ──
  useEffect(() => {
    try {
      const savedUserLoc = localStorage.getItem("smarttour-user-location");
      if (savedUserLoc) {
        const parsed = JSON.parse(savedUserLoc);
        if (parsed?.lat && parsed?.lng) {
          setUserLocation({ lat: parsed.lat, lng: parsed.lng, accuracy: parsed.accuracy || 10 });
        }
      }
    } catch {
      /* ignore */
    }

  }, []);

  // ── Label user's location via reverse geocode ──
  useEffect(() => {
    if (!userLocation) return;
    const labelTimeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.lat}&lon=${userLocation.lng}&format=json&zoom=14`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = await res.json();
        const name =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.county ||
          data?.display_name?.split(",")[0];
        if (name) setUserLocationLabel(name);
      } catch {
        setUserLocationLabel("Device Location");
      }
    }, 300);
    return () => clearTimeout(labelTimeout);
  }, [userLocation]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("smarttour-favs");
      if (saved) setFavouritePlaceIds(new Set(JSON.parse(saved)));
    } catch {
      /* ignore */
    }
  }, []);

  // ── Mount initialization & Polling backend for live tourist positions ──
  useEffect(() => {
    let active = true;

    const initView = async () => {
      if (hasInitializedViewRef.current) return;

      // 1. Check for user-saved base location
      try {
        const savedBase = localStorage.getItem("smarttour-base-location");
        if (savedBase) {
          const parsed = JSON.parse(savedBase);
          if (parsed?.lat && parsed?.lng) {
            setViewState((prev) => ({
              ...prev,
              latitude: parsed.lat,
              longitude: parsed.lng,
              zoom: parsed.zoom || 13,
            }));
            setRouteOrigin({ lng: parsed.lng, lat: parsed.lat, name: parsed.name || "Operations Base" });
            hasInitializedViewRef.current = true;
            await loadBackendData(false);
            return;
          }
        }
      } catch {
        /* ignore */
      }

      // 2. Otherwise load backend data and center on live tourists
      await loadBackendData(true);
    };

    initView();

    const interval = setInterval(async () => {
      if (!active) return;
      await loadBackendData(false);
    }, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loadBackendData]);

  // ── Focus a specific tourist when linked from tourists table ──
  useEffect(() => {
    if (!focusTouristId || dynamicMarkers.length === 0) return;
    const marker = dynamicMarkers.find(
      (m) => m.touristId === focusTouristId || m.id === focusTouristId,
    );
    if (marker) {
      setSelectedPlace(null);
      setSelectedMarker(marker);
      mapRef.current?.flyTo({
        center: [marker.lng, marker.lat],
        zoom: 15,
        pitch: 25,
        duration: 1200,
        essential: true,
      });
    }
  }, [focusTouristId, dynamicMarkers]);

  // ── Real-Time Live Telemetry Tick (simulated units only when API is unavailable) ──
  // ── Reverse Geocode for Dynamic Region Name ──
  const reverseGeocode = useCallback((lat: number, lon: number) => {
    if (reverseGeocodeTimeoutRef.current) clearTimeout(reverseGeocodeTimeoutRef.current);
    reverseGeocodeTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`, { headers: { "Accept-Language": "en" } });
        const data = await res.json();
        if (data && data.address) {
          const name = data.address.city || data.address.town || data.address.county || data.address.state || data.address.country || "ACTIVE";
          setActiveRegionName(`${name.toUpperCase()} OPS GRID`);
        }
      } catch { /* silent */ }
    }, 600);
  }, []);

  // ── Dynamic Geofences & Danger Zones calculated around view ──
  const dynamicGeofenceData = useMemo(() => {
    const coords = generateDynamicGeofence(viewState.latitude, viewState.longitude, 7);
    return { type: "Feature" as const, geometry: { type: "Polygon" as const, coordinates: [coords] }, properties: {} };
  }, [viewState.latitude, viewState.longitude]);

  const dynamicDangerZonesData = useMemo(() => {
    return generateDynamicDangerZones(viewState.latitude, viewState.longitude);
  }, [viewState.latitude, viewState.longitude]);

  const filteredMarkers = useMemo(() => {
    return dynamicMarkers.filter(m => statusFilter === "all" || m.status === statusFilter);
  }, [dynamicMarkers, statusFilter]);

  const filteredWorldPlaces = useMemo(() => {
    if (!showPOIs) return [];
    return WORLD_TOURIST_PLACES.filter(
      (pl) => selectedCategoryFilter === "all" || pl.category === selectedCategoryFilter,
    );
  }, [showPOIs, selectedCategoryFilter]);

  const localFilteredPlaces = useMemo(() => {
    if (!showPOIs) return [];
    let p = touristPlaces.filter(
      (pl) => selectedCategoryFilter === "all" || pl.category === selectedCategoryFilter,
    );
    if (poiRadiusKm !== null) {
      p = p.filter(
        (pl) => haversineKm(viewState.latitude, viewState.longitude, pl.lat, pl.lng) <= poiRadiusKm,
      );
    }
    return p;
  }, [showPOIs, selectedCategoryFilter, touristPlaces, poiRadiusKm, viewState.latitude, viewState.longitude]);

  const filteredPlaces = useMemo(
    () => [...filteredWorldPlaces, ...localFilteredPlaces],
    [filteredWorldPlaces, localFilteredPlaces],
  );

  const poiGeoJson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: localFilteredPlaces.map((p) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] as [number, number] },
        properties: { id: p.id, name: p.name, category: p.category },
      })),
    }),
    [localFilteredPlaces],
  );

  const trailGeoJson = useMemo(() => {
    if (!showTrails) return { type: "FeatureCollection" as const, features: [] };
    const colors: Record<string, string> = { emergency: "#ef4444", warning: "#f59e0b", safe: "#10b981" };
    return { type: "FeatureCollection" as const, features: filteredMarkers.map(m => ({ type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: generateTrailCoords(m.lat, m.lng) }, properties: { color: colors[m.status] || "#10b981" } })) };
  }, [showTrails, filteredMarkers]);

  const proximityGeoJson = useMemo(() => {
    if (!showProximityRadius) return { type: "FeatureCollection" as const, features: [] };
    return { type: "FeatureCollection" as const, features: dynamicMarkers.filter(m => m.status === "emergency" || m.status === "warning").map(m => createCirclePolygon(m.lng, m.lat, proximityRadiusKm)) };
  }, [showProximityRadius, dynamicMarkers, proximityRadiusKm]);

  const rulerGeoJson = useMemo(() => {
    const features: object[] = [];
    if (rulerPoints.length >= 2) features.push({ type: "Feature", geometry: { type: "LineString", coordinates: rulerPoints }, properties: {} });
    rulerPoints.forEach(p => features.push({ type: "Feature", geometry: { type: "Point", coordinates: p }, properties: {} }));
    return { type: "FeatureCollection" as const, features };
  }, [rulerPoints]);

  const counts = useMemo(() => {
    return {
      all: dynamicMarkers.length,
      safe: dynamicMarkers.filter(m => m.status === "safe").length,
      warning: dynamicMarkers.filter(m => m.status === "warning").length,
      emergency: dynamicMarkers.filter(m => m.status === "emergency").length
    };
  }, [dynamicMarkers]);

  const currentMapStyle = useMemo(() => MAP_STYLES[activeStyle].styleSpec as unknown as maplibregl.StyleSpecification, [activeStyle]);
  const isRouteActiveForPlace = !!selectedPlace && !!routeGeoJson && routeTargetId === selectedPlace.id;
  const interactiveLayerIds = useMemo(() => showPOIs && useCluster ? ["clusters", "unclustered-point"] : [], [showPOIs, useCluster]);

  // ── FETCH POIS FROM OVERPASS GLOBAL ──
  const fetchPOIs = useCallback(async (bounds: maplibregl.LngLatBounds, zoom: number) => {
    if (!showPOIs || zoom < 10) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }

    const s = Number(bounds.getSouth().toFixed(2));
    const w = Number(bounds.getWest().toFixed(2));
    const n = Number(bounds.getNorth().toFixed(2));
    const e = Number(bounds.getEast().toFixed(2));
    const cacheKey = `${s},${w},${n},${e}`;

    if (poiCacheRef.current[cacheKey]) {
      setTouristPlaces(poiCacheRef.current[cacheKey]);
      return;
    }

    if (poiAbortRef.current) {
      poiAbortRef.current.abort();
    }
    const abortController = new AbortController();
    poiAbortRef.current = abortController;

    setIsFetchingPOIs(true);
    const bbox = `${s},${w},${n},${e}`;
    const query = `[out:json][timeout:8];(node["tourism"~"attraction|viewpoint|camp_site"](${bbox});way["tourism"~"attraction|viewpoint|camp_site"](${bbox});node["historic"](${bbox});way["historic"](${bbox}););out center 40;`;

    let places: TouristPlace[] | null = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      if (abortController.signal.aborted) break;
      try {
        const url = `${endpoint}?data=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
          signal: abortController.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && Array.isArray(data.elements)) {
          places = data.elements
            .filter((el: any) => el.tags && (el.tags.name || el.tags["name:en"]))
            .map((el: any) => {
              let category: TouristPlace["category"] = "attraction";
              if (el.tags.tourism === "camp_site") category = "camp";
              else if (el.tags.tourism === "viewpoint") category = "viewpoint";
              return {
                id: `osm-${el.type}-${el.id}`,
                name: el.tags.name || el.tags["name:en"],
                category,
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                rating: Number((4.0 + ((el.id || 1) % 10) / 10).toFixed(1)),
                reviewsCount: Math.floor(((el.id || 1) % 180)) + 15,
                description: el.tags.description || "A notable point of interest mapped via OpenStreetMap.",
                openingHours: el.tags.opening_hours,
                altitude: el.tags.ele ? `${el.tags.ele}m` : undefined,
                address: el.tags["addr:full"] || el.tags["addr:street"],
              };
            });
          break;
        }
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setIsFetchingPOIs(false);
          return;
        }
        // Try next fallback endpoint quietly
      }
    }

    if (places !== null && !abortController.signal.aborted) {
      poiCacheRef.current[cacheKey] = places;
      setTouristPlaces(places);
    }
    setIsFetchingPOIs(false);
  }, [showPOIs]);

  const fetchWeather = useCallback(async (lat: number, lng: number) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lng.toFixed(2)}&current=temperature_2m,windspeed_10m,precipitation,weathercode&timezone=auto`);
      const data = await res.json();
      const c = data.current;
      setWeather({ temp: c.temperature_2m, wind: c.windspeed_10m, rain: c.precipitation, code: c.weathercode });
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const refreshTimer = window.setTimeout(() => {
      fetchWeather(userLocation.lat, userLocation.lng);
    }, 250);
    return () => window.clearTimeout(refreshTimer);
  }, [fetchWeather, userLocation]);

  const fetchElevation = useCallback(async (coords: [number, number][]) => {
    if (coords.length < 2) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const step = Math.max(1, Math.floor(coords.length / 20));
    const sampled = coords.filter((_, i) => i % step === 0).slice(0, 20);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${sampled.map(c => c[1]).join(",")}&longitude=${sampled.map(c => c[0]).join(",")}`);
      const data = await res.json();
      if (data.elevation) setElevationProfile(data.elevation);
    } catch { /* silent */ }
  }, []);

  const handleGeocode = useCallback((query: string) => {
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    if (query.length < 2) {
      setGeocodeResults([]);
      setShowGeocodeResults(false);
      return;
    }

    const q = query.toLowerCase();
    const worldMatches: GeocoderResult[] = WORLD_TOURIST_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    )
      .slice(0, 4)
      .map((p, i) => ({
        place_id: -(WORLD_TOURIST_PLACES.indexOf(p) + 1),
        display_name: `${p.name}, ${p.country}`,
        lat: String(p.lat),
        lon: String(p.lng),
      }));

    if (worldMatches.length > 0) {
      setGeocodeResults(worldMatches);
      setShowGeocodeResults(true);
    }

    geocodeTimeoutRef.current = setTimeout(async () => {
      setIsGeocodingSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
          { headers: { "Accept-Language": "en" } },
        );
        const data: GeocoderResult[] = await res.json();
        const merged = [...worldMatches];
        const seen = new Set(worldMatches.map((r) => r.display_name));
        data.forEach((r) => {
          if (!seen.has(r.display_name)) merged.push(r);
        });
        setGeocodeResults(merged.slice(0, 8));
        setShowGeocodeResults(true);
      } catch {
        if (worldMatches.length > 0) {
          setGeocodeResults(worldMatches);
          setShowGeocodeResults(true);
        }
      } finally {
        setIsGeocodingSearching(false);
      }
    }, 400);
  }, []);

  // ── HANDLERS ──
  const handleFlyTo = useCallback((lng: number, lat: number, zoom = 14.5, pitch = 25) => {
    mapRef.current?.flyTo({ center: [lng, lat - 0.003], zoom, pitch, duration: 1100, essential: true });
  }, []);

  const clearRoute = useCallback(() => {
    routeAbortRef.current?.abort(); routeAbortRef.current = null;
    setRouteGeoJson(null); setRouteDistance(null); setRouteDuration(null);
    setIsRouting(false); setRouteError(null); setRouteTargetId(null); setElevationProfile(null);
  }, []);

  const calculateRouteToCoords = useCallback(async (targetLng: number, targetLat: number, targetId: string) => {
    routeAbortRef.current?.abort();
    const ctrl = new AbortController(); routeAbortRef.current = ctrl;
    setIsRouting(true); setRouteError(null); setElevationProfile(null);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${routeOrigin.lng},${routeOrigin.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`, { signal: ctrl.signal });
      if (!res.ok) throw new Error("Route failed");
      const data: OsrmRouteResponse = await res.json();
      const route = data.routes?.[0];
      if (!route?.geometry?.coordinates?.length) throw new Error("No route");
      if (routeAbortRef.current !== ctrl) return;
      setRouteGeoJson({ type: "Feature", geometry: { type: "LineString", coordinates: route.geometry.coordinates }, properties: {} });
      setRouteDistance(route.distance / 1000); setRouteDuration(route.duration / 60); setRouteTargetId(targetId);
      mapRef.current?.fitBounds([[Math.min(routeOrigin.lng, targetLng), Math.min(routeOrigin.lat, targetLat)], [Math.max(routeOrigin.lng, targetLng), Math.max(routeOrigin.lat, targetLat)]], { padding: { top: 100, bottom: 100, left: 100, right: 380 }, duration: 1200, maxZoom: 15 });
      fetchElevation(route.geometry.coordinates);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (routeAbortRef.current === ctrl) { setRouteError("Unable to calculate route."); setRouteGeoJson(null); setRouteDistance(null); setRouteDuration(null); setRouteTargetId(null); }
    } finally { if (routeAbortRef.current === ctrl) { setIsRouting(false); routeAbortRef.current = null; } }
  }, [routeOrigin, fetchElevation]);

  const calculateTripRoute = useCallback(async () => {
    if (waypoints.length < 2) return;
    setIsTripRouting(true);
    try {
      const coords = [routeOrigin, ...waypoints].map(w => `${w.lng},${w.lat}`).join(";");
      const res = await fetch(`https://router.project-osrm.org/trip/v1/driving/${coords}?overview=full&geometries=geojson&roundtrip=false`);
      const data: OsrmRouteResponse = await res.json();
      const trip = data.trips?.[0];
      if (!trip?.geometry?.coordinates?.length) throw new Error("No trip");
      setRouteGeoJson({ type: "Feature", geometry: { type: "LineString", coordinates: trip.geometry.coordinates }, properties: {} });
      setRouteDistance(trip.distance / 1000); setRouteDuration(trip.duration / 60); setRouteTargetId("trip");
      fetchElevation(trip.geometry.coordinates);
      const allLngs = [routeOrigin.lng, ...waypoints.map(w => w.lng)], allLats = [routeOrigin.lat, ...waypoints.map(w => w.lat)];
      mapRef.current?.fitBounds([[Math.min(...allLngs), Math.min(...allLats)], [Math.max(...allLngs), Math.max(...allLats)]], { padding: 80, duration: 1200 });
    } catch (e) { console.warn("Trip route failed:", e); } finally { setIsTripRouting(false); }
  }, [waypoints, routeOrigin, fetchElevation]);

  const handleMoveEnd = useCallback((evt: any) => {
    const { target, viewState: vs } = evt;
    const { longitude, latitude, zoom } = vs;
    
    // Reverse geocode to get live city/region name
    reverseGeocode(latitude, longitude);
    
    // Fetch live weather
    fetchWeather(latitude, longitude);

    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      if (!showPOIs) return;
      const bounds = target?.getBounds ? target.getBounds() : mapRef.current?.getBounds();
      if (bounds) fetchPOIs(bounds, zoom);
    }, 800);
  }, [fetchPOIs, fetchWeather, reverseGeocode, showPOIs]);

  useEffect(() => {
    // Quick failsafe so map displays immediately without hanging on slow network
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleMapLoad = useCallback((evt: any) => {
    setMapReady(true);
    setMapLoadingError(null);
    const map = evt.target;
    if (showPOIs && map?.getBounds) fetchPOIs(map.getBounds(), map.getZoom());
    fetchWeather(viewState.latitude, viewState.longitude);
  }, [fetchPOIs, fetchWeather, showPOIs, viewState.latitude, viewState.longitude]);

  const handleMapError = useCallback((error: any) => {
    console.warn('Map notice:', error);
    // Non-fatal: do not block or unmount map on minor tile warnings
  }, []);

  const handleSelectMarker = useCallback((marker: MapMarker) => {
    setSelectedPlace(null);
    if (routeTargetId && routeTargetId !== marker.id) clearRoute();
    setSelectedMarker(marker); handleFlyTo(marker.lng, marker.lat, 14.5, 25);
  }, [routeTargetId, clearRoute, handleFlyTo]);

  const handleSelectPlace = useCallback((place: TouristPlace) => {
    setSelectedMarker(null);
    if (routeTargetId && routeTargetId !== place.id) clearRoute();
    setSelectedPlace(place);
    setGeocodeQuery(place.name);
    flyToPlace(place.lng, place.lat, 15);
    reverseGeocode(place.lat, place.lng);
    fetchWeather(place.lat, place.lng);
  }, [routeTargetId, clearRoute, flyToPlace, reverseGeocode, fetchWeather]);

  const handleGeocodeSelect = useCallback(
    (result: GeocoderResult) => {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const worldPlace =
        result.place_id < 0
          ? WORLD_TOURIST_PLACES[Math.abs(result.place_id) - 1]
          : WORLD_TOURIST_PLACES.find(
              (p) => Math.abs(p.lat - lat) < 0.05 && Math.abs(p.lng - lon) < 0.05,
            );

      if (worldPlace) {
        handleSelectPlace(worldPlace);
      } else {
        setSelectedMarker(null);
        setSelectedPlace(null);
        flyToPlace(lon, lat, 13);
        setGeocodeQuery(result.display_name.split(",")[0] || "");
        reverseGeocode(lat, lon);
        fetchWeather(lat, lon);
      }
      setShowGeocodeResults(false);
    },
    [handleSelectPlace, flyToPlace, reverseGeocode, fetchWeather],
  );

  const handleMapClick = useCallback((e: any) => {
    if (isPinningLocationMode) {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      const newLoc = { lat, lng, accuracy: 5 };
      setUserLocation(newLoc);
      try {
        localStorage.setItem("smarttour-user-location", JSON.stringify(newLoc));
      } catch {
        /* ignore */
      }
      setIsPinningLocationMode(false);
      setAsOperationsBase(lat, lng, "My Live Location");
      flyToUserLocation(lat, lng);
      reverseGeocode(lat, lng);
      fetchWeather(lat, lng);
      return;
    }

    if (rulerMode) {
      const newPt: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setRulerPoints(prev => {
        const next = prev.length >= 2 ? [newPt] : [...prev, newPt];
        if (next.length === 2 && next[0] && next[1]) setRulerDistance(haversineKm(next[0][1], next[0][0], next[1][1], next[1][0]));
        else setRulerDistance(null);
        return next;
      });
      return;
    }
    if (!e.features?.length) return;
    const clusterFeature = e.features.find((f: any) => f.layer?.id === "clusters");
    if (clusterFeature) {
      const clusterId = clusterFeature.properties?.cluster_id;
      const source = (mapRef.current as any)?.getSource?.("pois-cluster-source");
      if (source?.getClusterExpansionZoom) {
        source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;
          const coords = (clusterFeature.geometry as any).coordinates as [number, number];
          mapRef.current?.easeTo({ center: coords, zoom: zoom + 0.5, duration: 500 });
        });
      }
      return;
    }
    const pointFeature = e.features.find((f: any) => f.layer?.id === "unclustered-point");
    if (pointFeature) {
      const place = filteredPlaces.find((p) => p.id === pointFeature.properties?.id);
      if (place) handleSelectPlace(place);
    }
  }, [isPinningLocationMode, rulerMode, filteredPlaces, handleSelectPlace, setAsOperationsBase, flyToUserLocation, reverseGeocode, fetchWeather]);

  const handleResetView = useCallback(() => {
    setSelectedMarker(null); setSelectedPlace(null); clearRoute();
    setRulerPoints([]); setRulerDistance(null); setRulerMode(false);
    setIs3DMode(false);

    try {
      const savedBase = localStorage.getItem("smarttour-base-location");
      if (savedBase) {
        const parsed = JSON.parse(savedBase);
        if (parsed?.lat && parsed?.lng) {
          flyToPlace(parsed.lng, parsed.lat, parsed.zoom || 13);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    if (dynamicMarkers.length > 0) {
      const center = centerOfMarkers(dynamicMarkers);
      if (center) {
        flyToPlace(center.lng, center.lat, 12);
        return;
      }
    }
    flyToPlace(79.48, 30.72, 12);
  }, [clearRoute, dynamicMarkers, flyToPlace]);

  const handleToggle3D = useCallback(() => {
    setIs3DMode(prev => { const next = !prev; mapRef.current?.easeTo({ pitch: next ? 55 : 0, bearing: next ? -20 : 0, duration: 900 }); return next; });
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavouritePlaceIds(prev => {
      const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem("smarttour-favs", JSON.stringify([...next])); } catch { /* */ }
      return next;
    });
  }, []);

  const handleExportPNG = useCallback(() => {
    const canvas = (mapRef.current as any)?.getCanvas?.();
    if (!canvas) return;
    const link = document.createElement("a"); link.download = `smarttour-map-${new Date().toISOString().slice(0, 10)}.png`; link.href = canvas.toDataURL("image/png"); link.click();
  }, []);

  const addWaypoint = useCallback((lat: number, lng: number, name: string) => {
    setWaypoints(prev => prev.length >= 5 ? prev : [...prev, { id: `wp-${Date.now()}`, lat, lng, name }]);
  }, []);

  useEffect(() => {
    return () => {
      routeAbortRef.current?.abort();
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
      if (reverseGeocodeTimeoutRef.current) clearTimeout(reverseGeocodeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (rulerMode) { setRulerMode(false); setRulerPoints([]); setRulerDistance(null); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, rulerMode]);

  const LAYER_TOGGLES = [
    { label: "Places List", icon: Landmark, state: showWorldPlacesPanel, setState: setShowWorldPlacesPanel, color: "text-indigo-600" },
    { label: "POI Heatmap", icon: Flame, state: showHeatmap, setState: setShowHeatmap, color: "text-orange-600" },
    { label: "Cluster Mode", icon: Circle, state: useCluster, setState: setUseCluster, color: "text-purple-600" },
    { label: "Dynamic Geofence", icon: Shield, state: showGeofence, setState: setShowGeofence, color: "text-blue-600" },
    { label: "Hazard Zones", icon: AlertTriangle, state: showDangerZones, setState: setShowDangerZones, color: "text-orange-600" },
    { label: "Live Trails", icon: Activity, state: showTrails, setState: setShowTrails, color: "text-emerald-600" },
    { label: "Alert Radii", icon: Circle, state: showProximityRadius, setState: setShowProximityRadius, color: "text-rose-600" },
    { label: "Mini-map", icon: MapIcon, state: showMiniMap, setState: setShowMiniMap, color: "text-teal-600" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-900 transition-all duration-300",
        isFullscreen
          ? "fixed inset-0 z-[100] rounded-none border-0"
          : embedded
            ? className ?? "h-full w-full rounded-none border-0 shadow-none"
            : cn("rounded-2xl border border-slate-200/80 shadow-md", className ?? "h-[560px] w-full"),
      )}
    >

      {/* Non-blocking loading indicator */}
      {!mapReady && !mapLoadingError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-950/85 px-4 py-2 text-xs font-medium text-slate-200 shadow-xl backdrop-blur-md pointer-events-none">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          <span>Initializing map...</span>
        </div>
      )}

      {mapLoadingError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 p-8 text-center max-w-md bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl">
            <AlertTriangle className="h-12 w-12 text-rose-500" />
            <div>
              <h3 className="text-base font-semibold text-slate-100">Map Loading Issue</h3>
              <p className="text-xs text-slate-400 mt-1">{mapLoadingError}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              <button 
                onClick={() => {
                  setMapLoadingError(null);
                  setMapReady(true);
                }}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <Map
        ref={mapRef}
        {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onMoveEnd={handleMoveEnd}
          onLoad={handleMapLoad}
          onError={handleMapError}
          onMouseMove={(e: any) => setCursorCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
          onClick={handleMapClick}
          interactiveLayerIds={interactiveLayerIds}
          mapLib={maplibregl}
          style={{ width: "100%", height: "100%" }}
          mapStyle={currentMapStyle}
          attributionControl={false}
          cursor={rulerMode ? "crosshair" : "grab"}
        >
          {/* Dynamic Regional Geofence */}
          {showGeofence && (
            <Source id="geofence-source" type="geojson" data={dynamicGeofenceData}>
              <Layer {...geofenceFillLayer} /><Layer {...geofenceLineLayer} />
            </Source>
          )}
          
          {/* Dynamic Hazard / Danger Zones */}
          {showDangerZones && (
            <Source id="danger-source" type="geojson" data={dynamicDangerZonesData as any}>
              <Layer {...dangerFillLayer} /><Layer {...dangerLineLayer} />
            </Source>
          )}
          
          {/* Real-Time Proximity Alert Radius */}
          {showProximityRadius && (
            <Source id="proximity-source" type="geojson" data={proximityGeoJson as any}>
              <Layer {...proximityFillLayer} /><Layer {...proximityLineLayer} />
            </Source>
          )}
          
          {/* Real-Time Breadcrumb Trails */}
          {showTrails && (
            <Source id="trail-source" type="geojson" data={trailGeoJson as any}>
              <Layer {...trailLineLayer} />
            </Source>
          )}
          
          {/* Heatmap */}
          {showHeatmap && (
            <Source id="heatmap-source" type="geojson" data={poiGeoJson as any}>
              <Layer {...heatmapLayer} />
            </Source>
          )}
          
          {/* Overpass POI Cluster Source */}
          {showPOIs && useCluster && (
            <Source id="pois-cluster-source" type="geojson" data={poiGeoJson as any} cluster={true} clusterRadius={50} clusterMaxZoom={13}>
              <Layer {...clusterLayer} /><Layer {...clusterCountLayer} /><Layer {...unclusteredPointLayer} />
            </Source>
          )}
          
          {/* Calculated Routes */}
          {routeGeoJson && (
            <Source id="route-source" type="geojson" data={routeGeoJson}>
              <Layer {...routeCasingLayer} /><Layer {...routeLineLayer} />
            </Source>
          )}
          
          {/* Ruler */}
          {rulerPoints.length > 0 && (
            <Source id="ruler-source" type="geojson" data={rulerGeoJson as any}>
              {rulerPoints.length >= 2 && <Layer {...rulerLineLayer} />}
              <Layer {...rulerPointLayer} />
            </Source>
          )}
          
          {/* User's present location (Google Maps blue dot & pulse) */}
          {userLocation && (
            <Marker longitude={userLocation.lng} latitude={userLocation.lat} anchor="center">
              <UserLocationMarker label={userLocationLabel} onClick={() => setShowUserLocationPopup(true)} />
            </Marker>
          )}

          {/* User Live Location Popup */}
          {showUserLocationPopup && userLocation && (
            <Popup
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              anchor="bottom"
              offset={24}
              closeOnClick={false}
              onClose={() => setShowUserLocationPopup(false)}
            >
              <div className="w-64 overflow-hidden rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                      <Navigation className="h-3.5 w-3.5 fill-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">Your Live Location</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{userLocationLabel || "Field Position"}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowUserLocationPopup(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="mt-2.5 rounded-lg bg-slate-50 p-2 text-[10px] text-slate-600 space-y-1">
                  <div><span className="font-semibold text-slate-700">Coords:</span> {userLocation.lat.toFixed(5)}°, {userLocation.lng.toFixed(5)}°</div>
                  {userLocation.accuracy && <div><span className="font-semibold text-slate-700">Accuracy:</span> ~{Math.round(userLocation.accuracy)}m</div>}
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAsOperationsBase(userLocation.lat, userLocation.lng, userLocationLabel || "My Base");
                      setShowUserLocationPopup(false);
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <MapPin className="h-3 w-3" />Set as Operations Base Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPinningLocationMode(true);
                      setShowUserLocationPopup(false);
                    }}
                    className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Crosshair className="h-3 w-3" />Re-pin Exact Spot
                  </button>
                </div>
              </div>
            </Popup>
          )}

          {/* Rescue Base Origin */}
          {routeGeoJson && <Marker longitude={routeOrigin.lng} latitude={routeOrigin.lat} anchor="center"><OriginMarker name={routeOrigin.name} /></Marker>}
          
          {/* Waypoints */}
          {waypoints.map((wp, i) => <Marker key={wp.id} longitude={wp.lng} latitude={wp.lat} anchor="center"><WaypointMarker index={i} /></Marker>)}
          
          {/* Real-time Dynamic Tourist Beacons */}
          {filteredMarkers.map(marker => (
            <Marker key={marker.id} longitude={marker.lng} latitude={marker.lat} anchor="center">
              <BeaconMarker marker={marker} isSelected={selectedMarker?.id === marker.id} onClick={() => handleSelectMarker(marker)} />
            </Marker>
          ))}
          
          {/* World-famous tourist landmarks (always visible) */}
          {showPOIs &&
            filteredWorldPlaces.map((place) => (
              <Marker key={place.id} longitude={place.lng} latitude={place.lat} anchor="center">
                <PlaceMarker
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  isFavourite={favouritePlaceIds.has(place.id)}
                  onClick={() => handleSelectPlace(place)}
                />
              </Marker>
            ))}

          {/* Local Overpass POI markers (when cluster disabled) */}
          {showPOIs &&
            !useCluster &&
            localFilteredPlaces.map((place) => (
              <Marker key={place.id} longitude={place.lng} latitude={place.lat} anchor="center">
                <PlaceMarker
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  isFavourite={favouritePlaceIds.has(place.id)}
                  onClick={() => handleSelectPlace(place)}
                />
              </Marker>
            ))}
          
          {/* Selected Tourist Popup */}
          {selectedMarker && (
            <Popup longitude={selectedMarker.lng} latitude={selectedMarker.lat} anchor="bottom" offset={24} closeOnClick={false} onClose={() => setSelectedMarker(null)}>
              <div className="w-72 overflow-hidden rounded-xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", selectedMarker.status === "emergency" ? "bg-rose-500 animate-pulse" : selectedMarker.status === "warning" ? "bg-amber-500" : "bg-emerald-500")} />
                      <h4 className="font-semibold text-slate-900">{selectedMarker.touristName || selectedMarker.label}</h4>
                    </div>
                    <p className="text-xs text-slate-500">ID: {selectedMarker.touristId || selectedMarker.id} · {selectedMarker.label}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedMarker(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-3.5 w-3.5" /></button>
                </div>
                {selectedMarker.alertType && (
                  <div className={cn("mt-2.5 flex items-center gap-2 rounded-lg p-2 text-xs font-medium", selectedMarker.status === "emergency" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200")}>
                    <AlertTriangle className="h-4 w-4 shrink-0" /><span>{selectedMarker.alertType}</span>
                  </div>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 border-y border-slate-100 py-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><Heart className="h-3.5 w-3.5 animate-pulse" /></div>
                    <div><div className="text-[10px] text-slate-400">Heart Rate</div><div className="font-semibold text-slate-800">{selectedMarker.heartRate ? `${selectedMarker.heartRate} BPM` : "No Signal"}</div></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Battery className="h-3.5 w-3.5" /></div>
                    <div><div className="text-[10px] text-slate-400">Battery</div><div className="font-semibold text-slate-800">{selectedMarker.battery ? `${selectedMarker.battery}%` : "—"}</div></div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <button type="button" onClick={() => handleFlyTo(selectedMarker.lng, selectedMarker.lat, 15, 45)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"><Navigation className="h-3 w-3" />Focus</button>
                  <button type="button" onClick={() => addWaypoint(selectedMarker.lat, selectedMarker.lng, selectedMarker.touristName || selectedMarker.label)} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-cyan-50 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100 border border-cyan-200"><Flag className="h-3 w-3" />Waypoint</button>
                  <button type="button" onClick={async () => {
                    const touristId = selectedMarker.touristId || selectedMarker.id;
                    try {
                      await dispatchTourist(touristId);
                    } catch {
                      /* fallback to local feedback */
                    }
                    setDispatchedAlert(selectedMarker.id);
                    setTimeout(() => setDispatchedAlert(null), 3000);
                  }} className={cn("flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-white shadow-sm", selectedMarker.status === "emergency" ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700")}>
                    {dispatchedAlert === selectedMarker.id ? <><CheckCircle2 className="h-3.5 w-3.5" />Done!</> : <><Radio className="h-3 w-3" />Rescue</>}
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Map>

      {/* Live Weather Chip */}
      {weather && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-slate-950/85 px-3.5 py-1.5 text-xs text-white shadow-xl backdrop-blur-md border border-slate-700 pointer-events-none">
          <span className="text-base leading-none">{getWeatherIcon(weather.code)}</span>
          <span className="font-semibold">{weather.temp.toFixed(1)}°C</span>
          <span className="text-slate-500">·</span>
          <span className="flex items-center gap-1 text-slate-300"><Wind className="h-3 w-3" />{weather.wind} km/h</span>
          {weather.rain > 0 && <><span className="text-slate-500">·</span><span className="flex items-center gap-1 text-sky-400"><CloudRain className="h-3 w-3" />{weather.rain}mm</span></>}
        </div>
      )}

      {/* Ruler Distance Badge */}
      {rulerMode && (
        <div className={cn("absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-xl backdrop-blur-md border pointer-events-none", rulerDistance !== null ? "bg-amber-500/90 text-white border-amber-400" : "bg-slate-950/85 text-amber-400 border-slate-700")}>
          <Ruler className="h-3.5 w-3.5" />
          {rulerDistance !== null ? `${rulerDistance.toFixed(2)} km between points` : "Click two points anywhere to measure distance"}
        </div>
      )}

      {/* World tourist places panel */}
      {showWorldPlacesPanel && (
        <div className={cn("absolute z-20", embedded ? "left-3 top-24" : "left-4 top-24")}>
          <WorldPlacesPanel
            places={WORLD_TOURIST_PLACES}
            selectedPlaceId={selectedPlace?.id ?? null}
            onSelectPlace={handleSelectPlace}
            onLocateUser={locateUser}
            isLocating={isLocating}
            userLocationLabel={userLocationLabel}
            embedded={embedded}
          />
        </div>
      )}

      {/* Pinning Location Mode Banner */}
      {isPinningLocationMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-2xl animate-bounce">
          <Crosshair className="h-4 w-4" />
          <span>Click anywhere on the map to place your live position</span>
          <button
            type="button"
            onClick={() => setIsPinningLocationMode(false)}
            className="rounded-full bg-blue-700 px-2 py-0.5 text-[10px] hover:bg-blue-800"
          >
            Cancel
          </button>
        </div>
      )}

      {/* TOP LEFT: Global Geocoder & Tools */}
      <div className={cn("absolute z-20 flex flex-col gap-2", embedded ? "left-3 top-3" : "left-4 top-4", showWorldPlacesPanel && (embedded ? "left-[17.5rem]" : "left-[19rem]"))}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md border border-slate-200/80">
              {isGeocodingSearching ? <Loader2 className="h-4 w-4 text-slate-400 animate-spin" /> : <Search className="h-4 w-4 text-slate-400" />}
              <input type="text" value={geocodeQuery} onChange={e => { setGeocodeQuery(e.target.value); handleGeocode(e.target.value); }} onFocus={() => geocodeResults.length > 0 && setShowGeocodeResults(true)} onBlur={() => setTimeout(() => setShowGeocodeResults(false), 200)} placeholder="Search any city or place worldwide..." className="h-6 w-56 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none" />
              {geocodeQuery && <button type="button" onClick={() => { setGeocodeQuery(""); setGeocodeResults([]); setShowGeocodeResults(false); }} className="text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
            </div>
            {showGeocodeResults && geocodeResults.length > 0 && (
              <div className="absolute left-0 top-11 w-72 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                {geocodeResults.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    className="flex w-full items-start gap-2 px-3 py-2 text-left text-xs hover:bg-blue-50 border-b border-slate-100 last:border-0"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleGeocodeSelect(r)}
                  >
                    <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed line-clamp-2">{r.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location Manager Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocationMenuOpen((p) => !p)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md border transition-all",
                userLocation ? "text-blue-700 hover:bg-blue-50 border-blue-200" : "text-slate-700 hover:bg-slate-50 border-slate-200/80"
              )}
            >
              <Navigation className={cn("h-3.5 w-3.5", userLocation ? "text-blue-600 fill-blue-600" : "text-slate-500")} />
              <span className="max-w-[110px] truncate">{userLocationLabel || "My Location"}</span>
            </button>
            {isLocationMenuOpen && (
              <div className="absolute left-0 top-11 w-64 rounded-xl border border-slate-200 bg-white/98 p-2 shadow-2xl backdrop-blur-md z-50 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Set My Location</div>
                <button
                  type="button"
                  onClick={() => {
                    locateUser();
                    setIsLocationMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <Locate className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Auto-Detect via GPS</div>
                    <div className="text-[10px] text-slate-400">Request live coordinates</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPinningLocationMode(true);
                    setIsLocationMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Crosshair className="h-4 w-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Pin Exact Spot on Map</div>
                    <div className="text-[10px] text-slate-400">Click anywhere on the map</div>
                  </div>
                </button>
                {userLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      flyToUserLocation(userLocation.lat, userLocation.lng);
                      setIsLocationMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-blue-700 bg-blue-50/80 font-medium transition-colors"
                  >
                    <Compass className="h-4 w-4 text-blue-600" />
                    <span>Fly to My Pin ({userLocation.lat.toFixed(2)}°, {userLocation.lng.toFixed(2)}°)</span>
                  </button>
                )}
                {locationError && (
                  <div role="status" className="mt-2 flex w-64 items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] leading-relaxed text-amber-800 shadow-lg">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span className="flex-1">{locationError}</span>
                    <button type="button" onClick={() => setLocationError(null)} aria-label="Dismiss location message" className="text-amber-600 hover:text-amber-800"><X className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-md border border-slate-200/80 w-fit">
          <button type="button" onClick={() => setShowPOIs(p => !p)} title="Toggle Overpass POIs" className={cn("rounded-lg p-1.5 transition-all", showPOIs ? "bg-purple-100 text-purple-700" : "text-slate-400 hover:bg-slate-100")}><MapPin className="h-3.5 w-3.5" /></button>
          <div className="h-4 w-px bg-slate-200 my-auto" />
          <select value={selectedCategoryFilter} onChange={e => setSelectedCategoryFilter(e.target.value)} className="bg-transparent text-[11px] font-medium text-slate-700 focus:outline-none px-1">
            <option value="all">All POIs</option>
            <option value="attraction">Attractions</option>
            <option value="viewpoint">Viewpoints</option>
            <option value="camp">Campgrounds</option>
            <option value="trailhead">Trailheads</option>
            <option value="medical">Medical Posts</option>
          </select>
          <div className="h-4 w-px bg-slate-200 my-auto" />
          <button type="button" onClick={() => setShowRadiusFilter(p => !p)} title="Filter radius" className={cn("rounded-lg p-1.5 transition-all", showRadiusFilter || poiRadiusKm !== null ? "bg-blue-100 text-blue-700" : "text-slate-400 hover:bg-slate-100")}><Crosshair className="h-3.5 w-3.5" /></button>
        </div>

        {showRadiusFilter && (
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur-md border border-slate-200/80">
            <Crosshair className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex justify-between text-[10px] text-slate-500"><span>POI Radius</span><span className="font-semibold text-blue-700">{poiRadiusKm !== null ? `${poiRadiusKm} km` : "Off"}</span></div>
              <input type="range" min={1} max={50} step={1} value={poiRadiusKm ?? 10} onChange={e => setPoiRadiusKm(parseInt(e.target.value))} className="w-full h-1 accent-blue-600" />
            </div>
            <button type="button" onClick={() => setPoiRadiusKm(null)} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
          </div>
        )}

        <div className="flex items-center gap-1">
          {(["all", "safe", "warning", "emergency"] as const).map(s => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)}
              className={cn("rounded-lg px-2 py-1 text-[10px] font-semibold transition-all shadow-sm border", statusFilter === s ? (s === "all" ? "bg-slate-800 text-white border-slate-800" : s === "emergency" ? "bg-rose-600 text-white border-rose-600" : s === "warning" ? "bg-amber-500 text-white border-amber-500" : "bg-emerald-600 text-white border-emerald-600") : "bg-white/90 text-slate-600 border-slate-200 hover:bg-slate-50")}>
              {s === "all" ? `All (${counts.all})` : s === "safe" ? `✓ ${counts.safe}` : s === "warning" ? `⚠ ${counts.warning}` : `🆘 ${counts.emergency}`}
            </button>
          ))}
        </div>
      </div>

      {/* TOP RIGHT: OpenStreetMap selector & Control bar */}
      <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2">
        <div className="relative">
          <button type="button" onClick={() => setIsStyleMenuOpen(p => !p)} className="flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-md border border-slate-200/80 hover:bg-white">
            <Globe className="h-3.5 w-3.5 text-blue-600" /><span>{MAP_STYLES[activeStyle].name}</span>
          </button>
          {isStyleMenuOpen && (
            <div className="absolute right-0 top-11 w-52 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md z-30 space-y-1">
              {(Object.keys(MAP_STYLES) as MapStyleKey[]).map(key => { const s = MAP_STYLES[key]; const I = s.icon; return (
                <button key={key} type="button" onClick={() => { setActiveStyle(key); setIsStyleMenuOpen(false); }} className={cn("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors", activeStyle === key ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-100")}>
                  <I className="h-3.5 w-3.5 text-slate-600" /><span>{s.name}</span>
                </button>
              ); })}
            </div>
          )}
        </div>

        <div className="flex flex-col rounded-xl bg-white/95 p-1 shadow-lg backdrop-blur-md border border-slate-200/80">
          <button type="button" title="Locate My Real Position" onClick={locateUser} className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50">
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
          </button>
          <button type="button" title="Refresh live data" onClick={refreshBackendData} disabled={isRefreshingData} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-emerald-600 disabled:opacity-50">
            <RefreshCw className={cn("h-4 w-4", isRefreshingData && "animate-spin")} />
          </button>
          <div className="my-1 border-t border-slate-200" />
          <button type="button" onClick={() => mapRef.current?.zoomIn()} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-lg font-bold">+</button>
          <button type="button" onClick={() => mapRef.current?.zoomOut()} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 text-lg font-bold">−</button>
          <div className="my-1 border-t border-slate-200" />
          <button type="button" title="Reset View" onClick={handleResetView} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600"><LocateFixed className="h-4 w-4" /></button>
          <button type="button" title={is3DMode ? "2D View" : "3D View"} onClick={handleToggle3D} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", is3DMode ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100")}><span className="text-[10px] font-bold">3D</span></button>
          <div className="my-1 border-t border-slate-200" />
          <button type="button" title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"} onClick={() => setIsFullscreen(p => !p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", isFullscreen ? "bg-purple-50 text-purple-600" : "text-slate-600 hover:bg-slate-100 hover:text-purple-600")}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button type="button" title="Export Map as PNG" onClick={handleExportPNG} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-green-600"><Download className="h-4 w-4" /></button>
          <div className="my-1 border-t border-slate-200" />
          <button type="button" title={rulerMode ? "Exit Ruler (Esc)" : "Measure Distance"} onClick={() => { setRulerMode(p => !p); setRulerPoints([]); setRulerDistance(null); }} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", rulerMode ? "bg-amber-50 text-amber-600" : "text-slate-600 hover:bg-slate-100 hover:text-amber-600")}><Ruler className="h-4 w-4" /></button>
          <button type="button" title="Layer Controls" onClick={() => setShowLayerPanel(p => !p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", showLayerPanel ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600")}><SlidersHorizontal className="h-4 w-4" /></button>
          <button type="button" title="Toggle Mini-map" onClick={() => setShowMiniMap(p => !p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", showMiniMap ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-100")}><MapIcon className="h-4 w-4" /></button>
          <button type="button" title="Multi-stop Route" onClick={() => setShowWaypointPanel(p => !p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", showWaypointPanel ? "bg-cyan-50 text-cyan-600" : "text-slate-600 hover:bg-slate-100 hover:text-cyan-600")}><Route className="h-4 w-4" /></button>
        </div>

        {showLayerPanel && (
          <div className="rounded-xl border border-slate-200 bg-white/97 p-3 shadow-2xl backdrop-blur-md w-52 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Layer Controls</div>
            {LAYER_TOGGLES.map(({ label, icon: Icon, state, setState, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className={cn("flex items-center gap-2 text-xs", color)}><Icon className="h-3.5 w-3.5" /><span>{label}</span></div>
                <button type="button" onClick={() => setState((p: boolean) => !p)} className={cn("relative h-5 w-9 rounded-full transition-colors duration-200", state ? "bg-blue-600" : "bg-slate-200")}>
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200", state ? "translate-x-4" : "translate-x-0.5")} />
                </button>
              </div>
            ))}
            {showProximityRadius && (
              <div className="pt-1.5 border-t border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Alert Radius</span><span className="font-semibold text-rose-600">{proximityRadiusKm} km</span></div>
                <input type="range" min={0.5} max={5} step={0.5} value={proximityRadiusKm} onChange={e => setProximityRadiusKm(parseFloat(e.target.value))} className="w-full h-1 accent-rose-600" />
              </div>
            )}
          </div>
        )}

        {showWaypointPanel && (
          <div className="rounded-xl border border-slate-200 bg-white/97 p-3 shadow-2xl backdrop-blur-md w-64 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Multi-stop Route</div>
              {waypoints.length > 0 && <button type="button" onClick={() => setWaypoints([])} className="text-[10px] text-red-500 hover:text-red-700">Clear all</button>}
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">Select any unit or place then click "Waypoint" to add stops.</p>
            {waypoints.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-3 text-slate-400"><Route className="h-6 w-6" /><span className="text-[10px]">No waypoints added yet</span></div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-2 py-1.5 text-[10px] text-blue-700"><Navigation className="h-3 w-3" /><span className="font-medium">{routeOrigin.name}</span></div>
                {waypoints.map((wp, i) => (
                  <div key={wp.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[9px] font-bold text-white shrink-0">{i + 1}</span>
                    <span className="flex-1 text-[10px] text-slate-700 truncate">{wp.name}</span>
                    <button type="button" onClick={() => setWaypoints(prev => prev.filter(w => w.id !== wp.id))} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
            {waypoints.length >= 2 && (
              <button type="button" onClick={calculateTripRoute} disabled={isTripRouting} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-600 py-2 text-xs font-semibold text-white hover:bg-cyan-700 disabled:opacity-60 transition-colors">
                {isTripRouting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Calculating...</> : <><Route className="h-3.5 w-3.5" />Calculate Trip Route</>}
              </button>
            )}
            {routeDistance !== null && routeTargetId === "trip" && (
              <div className="flex items-center justify-between rounded-lg bg-cyan-50 border border-cyan-100 px-2 py-1.5 text-[10px] font-semibold text-cyan-700">
                <span>{routeDistance.toFixed(1)} km total</span><span>{Math.max(1, Math.round(routeDuration ?? 0))} min drive</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Place Details Drawer */}
      {selectedPlace && (
        <div className={cn("absolute z-30 w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/97 shadow-2xl backdrop-blur-md", embedded ? "right-3 top-24 bottom-12" : "right-4 top-28 bottom-16")}>
          {selectedPlace.imageUrl ? (
            <div className="relative h-32 w-full overflow-hidden bg-slate-100">
              <img src={selectedPlace.imageUrl} alt={selectedPlace.name} className="h-full w-full object-cover" />
              <button type="button" onClick={() => setSelectedPlace(null)} className="absolute right-2 top-2 rounded-full bg-slate-950/60 p-1.5 text-white hover:bg-slate-950/80"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-slate-100 p-3">
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 uppercase tracking-wider">{selectedPlace.category}</span>
              <button type="button" onClick={() => setSelectedPlace(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
          )}
          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{selectedPlace.name}</h3>
                <button type="button" onClick={() => toggleFavourite(selectedPlace.id)} className="shrink-0 rounded-lg p-1.5 hover:bg-amber-50 transition-colors">
                  {favouritePlaceIds.has(selectedPlace.id) ? <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Bookmark className="h-4 w-4 text-slate-400" />}
                </button>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-0.5 text-amber-500 font-semibold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /><span>{selectedPlace.rating.toFixed(1)}</span></div>
                <span>({selectedPlace.reviewsCount} reviews)</span>
                <span>·</span><span className="capitalize">{selectedPlace.category}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{selectedPlace.description}</p>
            <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
              {selectedPlace.address && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" /><span>{selectedPlace.address}</span></div>}
              {selectedPlace.openingHours && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400 shrink-0" /><span>{selectedPlace.openingHours}</span></div>}
              {selectedPlace.altitude && <div className="flex items-center gap-2"><Mountain className="h-4 w-4 text-slate-400 shrink-0" /><span>Altitude: {selectedPlace.altitude}</span></div>}
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <iframe title="Street View" width="100%" height="112" frameBorder="0" style={{ border: 0, display: "block" }}
                src={`https://www.mapillary.com/embed?map_style=Mapillary+light&image_key=latest&map_zoom=14&focus=photo&lat=${selectedPlace.lat}&lng=${selectedPlace.lng}`} allowFullScreen />
              <div className="px-2 py-0.5 text-[9px] text-slate-400 bg-slate-50 border-t border-slate-100">Street-level imagery · Mapillary</div>
            </div>
            {isRouteActiveForPlace && elevationProfile && elevationProfile.length > 1 && routeDistance !== null && <ElevationProfile elevations={elevationProfile} distance={routeDistance} />}
            {isRouteActiveForPlace && routeDistance !== null && routeDuration !== null && (
              <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs">
                <span className="font-semibold text-blue-700">Distance: {routeDistance.toFixed(1)} km</span>
                <span className="font-semibold text-blue-700">Drive: {Math.max(1, Math.round(routeDuration))} min</span>
              </div>
            )}
            {routeError && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700"><AlertTriangle className="h-4 w-4 shrink-0" /><span>{routeError}</span></div>}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAsOperationsBase(selectedPlace.lat, selectedPlace.lng, selectedPlace.name)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                Set as Operations Base Hub
              </button>
              <button type="button" onClick={() => calculateRouteToCoords(selectedPlace.lng, selectedPlace.lat, selectedPlace.id)} disabled={isRouting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors">
                {isRouting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Calculating Route...</> : <><Navigation className="h-3.5 w-3.5" />Route to Place</>}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => addWaypoint(selectedPlace.lat, selectedPlace.lng, selectedPlace.name)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-100"><Flag className="h-3.5 w-3.5" />Add Waypoint</button>
                <button type="button" onClick={() => handleFlyTo(selectedPlace.lng, selectedPlace.lat, 15.5, 45)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"><Compass className="h-3.5 w-3.5 text-slate-500" />Focus Camera</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini-map */}
      {showMiniMap && (
        <div className={cn("absolute z-20 overflow-hidden rounded-xl border border-slate-300/80 shadow-xl", embedded ? "bottom-3 right-3 h-24 w-36" : "bottom-16 right-4 h-28 w-44")}>
          <Map longitude={viewState.longitude} latitude={viewState.latitude} zoom={Math.max(2, viewState.zoom - 7)} pitch={0} bearing={0} interactive={false} mapLib={maplibregl} mapStyle={MINIMAP_STYLE as unknown as maplibregl.StyleSpecification} style={{ width: "100%", height: "100%" }} attributionControl={false} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-3 w-3 rounded-full border-2 border-red-500 bg-red-500/40 shadow" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/70 px-1.5 py-0.5 text-center text-[9px] text-slate-300">Overview · z{viewState.zoom.toFixed(1)}</div>
        </div>
      )}

      {/* Dynamic Status Bar */}
      <div className={cn("absolute z-20 pointer-events-none", embedded ? "bottom-2 left-3 right-3" : "bottom-4 left-4 right-4")}>
        <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-xl bg-slate-950/85 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-md border border-slate-800 flex-wrap max-w-full">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
          <span className="font-semibold tracking-wide text-[11px] text-slate-200">{activeRegionName}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 text-[11px]">{counts.all} Active Units</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 text-[11px]">{isFetchingPOIs ? <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin inline" />Fetching OSM POIs...</span> : `${filteredPlaces.length} OSM POIs`}</span>
          {locationError ? (
            <>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-[11px] text-amber-300" title={locationError}>
                <AlertTriangle className="h-3 w-3" />
                Location unavailable
              </span>
            </>
          ) : userLocation && (
            <>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-[11px] text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400 ring-2 ring-blue-300/40" />
                {userLocationLabel ?? "Your location"}
              </span>
            </>
          )}
          {cursorCoords && <><span className="text-slate-600">·</span><span className="font-mono text-[10px] text-slate-400">{cursorCoords.lat.toFixed(4)}°N {cursorCoords.lng.toFixed(4)}°E</span></>}
          {favouritePlaceIds.size > 0 && <><span className="text-slate-600">·</span><span className="text-amber-400 text-[10px]">★ {favouritePlaceIds.size} saved</span></>}
        </div>
      </div>
    </div>
  );
}
