"use client";

import { X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    regions: string[];
    deviceModels: string[];
    severity: string[];
  };
  onFilterChange: (type: 'regions' | 'deviceModels' | 'severity', value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  availableRegions: string[];
  availableDeviceModels: string[];
}

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  availableRegions,
  availableDeviceModels
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {(filters.regions.length > 0 || filters.deviceModels.length > 0 || filters.severity.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 gap-1.5"
              onClick={onClearFilters}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear All Filters
            </Button>
          )}
        </div>

        <div className="space-y-6 p-6">
          {/* Region Filter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Regions/Zones</h4>
            <div className="space-y-2">
              {availableRegions.map((region) => (
                <label key={region} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region)}
                    onChange={() => onFilterChange('regions', region)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Device Model Filter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Device Models</h4>
            <div className="space-y-2">
              {availableDeviceModels.map((model) => (
                <label key={model} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.deviceModels.includes(model)}
                    onChange={() => onFilterChange('deviceModels', model)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{model}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Incident Severity</h4>
            <div className="space-y-2">
              {["Critical", "High", "Medium", "Low"].map((severity) => (
                <label key={severity} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes(severity)}
                    onChange={() => onFilterChange('severity', severity)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{severity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-6">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}