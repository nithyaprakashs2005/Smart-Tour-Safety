"use client";

import { useEffect, useState } from "react";
import {
  Satellite,
  Wifi,
  Users,
  Battery,
  Sun,
  Wind,
  Droplets,
  Eye,
  MapPin,
} from "lucide-react";
import { DashboardCard } from "@/components/ui/dashboard-card";

interface WeatherData {
  temp: number;
  wind: number;
  humidity: number;
  code: number;
}

function getWeatherLabel(code: number) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  return "Stormy";
}

export default function SystemWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>("Locating...");
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          // Fallback if permission denied
          setLocationCoords({ lat: 30.72, lng: 79.48 });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setLocationCoords({ lat: 30.72, lng: 79.48 });
    }
  }, []);

  useEffect(() => {
    if (!locationCoords) return;

    const loadWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationCoords.lat}&longitude=${locationCoords.lng}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto`,
        );
        const data = await res.json();
        const current = data.current;
        setWeather({
          temp: current.temperature_2m,
          wind: current.windspeed_10m,
          humidity: current.relative_humidity_2m,
          code: current.weathercode,
        });
      } catch {
        setWeather(null);
      }
    };

    const loadLocationName = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${locationCoords.lat}&lon=${locationCoords.lng}&format=json&zoom=14`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = await res.json();
        const name =
          data?.address?.city ||
          data?.address?.town ||
          data?.address?.village ||
          data?.address?.county ||
          data?.display_name?.split(",")[0];
        if (name) {
          setLocationName(name);
        } else {
          setLocationName("Unknown Location");
        }
      } catch {
        setLocationName("Hill Region Operations Zone");
      }
    };

    loadWeather();
    loadLocationName();

    const interval = setInterval(loadWeather, 60000);
    return () => clearInterval(interval);
  }, [locationCoords]);

  return (
    <DashboardCard
      title="Field Conditions"
      description="System health and local weather"
      className="h-full"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Satellite className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[11px]">GPS Accuracy</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">98%</p>
            <p className="text-[10px] font-medium text-emerald-600">Operational</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Wifi className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[11px]">Network</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">Stable</p>
            <p className="text-[10px] font-medium text-emerald-600">Low latency</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-[11px]">Response Teams</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">12</p>
            <p className="text-[10px] font-medium text-blue-600">On standby</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Battery className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[11px]">Backup Power</span>
            </div>
            <p className="mt-2 text-lg font-semibold text-slate-900">82%</p>
            <p className="text-[10px] font-medium text-emerald-600">Charged</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-sky-50 to-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">
                {weather ? `${weather.temp.toFixed(0)}°C` : "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {weather ? getWeatherLabel(weather.code) : "Loading conditions..."}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
              <Sun className="h-6 w-6 text-amber-500" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
            <div className="text-center">
              <Wind className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {weather ? `${weather.wind} km/h` : "—"}
              </p>
              <p className="text-[10px] text-slate-500">Wind</p>
            </div>
            <div className="text-center">
              <Droplets className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {weather ? `${weather.humidity}%` : "—"}
              </p>
              <p className="text-[10px] text-slate-500">Humidity</p>
            </div>
            <div className="text-center">
              <Eye className="mx-auto h-3.5 w-3.5 text-slate-400" />
              <p className="mt-1 text-xs font-semibold text-slate-700">10 km</p>
              <p className="text-[10px] text-slate-500">Visibility</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
