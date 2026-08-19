"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, Calendar, Filter, ChevronDown, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar";
import AnalyticsStats from "@/components/analytics/analytics-stats";
import AnalyticsCharts from "@/components/analytics/analytics-charts";
import LocationPerformance from "@/components/analytics/location-performance";
import TeamPerformance from "@/components/analytics/team-performance";
import DeviceHealth from "@/components/analytics/device-health";
import DailyMetricsTable from "@/components/analytics/daily-metrics-table";
import FilterModal from "@/components/analytics/filter-modal";
import { 
  dailyMetrics, 
  locationMetrics, 
  teamMetrics, 
  deviceMetrics, 
  analyticsStats,
  type DailyMetric,
  type LocationMetric,
  type TeamMetric,
  type DeviceMetric
} from "@/lib/analytics-data";
import { cn } from "@/lib/utils";

type TimeRange = "today" | "last_7_days" | "last_30_days" | "custom";
type SortField = "visitors" | "incidents" | "satisfaction" | "name";
type SortOrder = "asc" | "desc";

interface FilterState {
  regions: string[];
  deviceModels: string[];
  severity: string[];
}

export default function AnalyticsPage() {
  // Time Range State
  const [timeRange, setTimeRange] = useState<TimeRange>("last_7_days");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  
  // Filter State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    deviceModels: [],
    severity: []
  });
  
  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Sorting State
  const [sortField, setSortField] = useState<SortField>("visitors");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Derived data based on time range
  const filteredData = useMemo(() => {
    let filteredDailyMetrics: DailyMetric[];
    let filteredLocationMetrics: LocationMetric[];
    let filteredTeamMetrics: TeamMetric[];
    let filteredDeviceMetrics: DeviceMetric[];
    let filteredStats: typeof analyticsStats;

    switch (timeRange) {
      case "today":
        filteredDailyMetrics = dailyMetrics.slice(-1);
        filteredLocationMetrics = locationMetrics.map(loc => ({
          ...loc,
          visitors: Math.floor(loc.visitors * 0.8),
          incidents: Math.floor(loc.incidents * 0.5)
        }));
        filteredTeamMetrics = teamMetrics.map(team => ({
          ...team,
          incidentsHandled: Math.floor(team.incidentsHandled * 0.3)
        }));
        filteredDeviceMetrics = deviceMetrics;
        filteredStats = {
          ...analyticsStats,
          totalTourists: Math.floor(analyticsStats.totalTourists * 0.8),
          activeAlerts: Math.floor(analyticsStats.activeAlerts * 0.5),
          incidentsToday: Math.floor(analyticsStats.incidentsToday * 0.3),
          touristTrend: "+2.1%",
          alertTrend: "-8.3%",
          incidentTrend: "0"
        };
        break;
      case "last_7_days":
        filteredDailyMetrics = dailyMetrics.slice(-7);
        filteredLocationMetrics = locationMetrics;
        filteredTeamMetrics = teamMetrics;
        filteredDeviceMetrics = deviceMetrics;
        filteredStats = analyticsStats;
        break;
      case "last_30_days":
        // Simulate 30 days by repeating and modifying data
        filteredDailyMetrics = [
          ...dailyMetrics,
          ...dailyMetrics.map(d => ({ ...d, tourists: Math.floor(d.tourists * 1.1), alerts: Math.floor(d.alerts * 1.2) })),
          ...dailyMetrics.map(d => ({ ...d, tourists: Math.floor(d.tourists * 0.9), alerts: Math.floor(d.alerts * 0.8) })),
          ...dailyMetrics.slice(0, 9).map(d => ({ ...d, date: d.date.replace("May", "Apr") }))
        ];
        filteredLocationMetrics = locationMetrics.map(loc => ({
          ...loc,
          visitors: Math.floor(loc.visitors * 1.3),
          incidents: Math.floor(loc.incidents * 1.5)
        }));
        filteredTeamMetrics = teamMetrics.map(team => ({
          ...team,
          incidentsHandled: Math.floor(team.incidentsHandled * 2.5)
        }));
        filteredDeviceMetrics = deviceMetrics;
        filteredStats = {
          ...analyticsStats,
          totalTourists: Math.floor(analyticsStats.totalTourists * 1.3),
          activeAlerts: Math.floor(analyticsStats.activeAlerts * 1.2),
          incidentsToday: Math.floor(analyticsStats.incidentsToday * 1.5),
          touristTrend: "+12.8%",
          alertTrend: "+5.2%",
          incidentTrend: "+8"
        };
        break;
      case "custom":
        filteredDailyMetrics = dailyMetrics.slice(-3);
        filteredLocationMetrics = locationMetrics;
        filteredTeamMetrics = teamMetrics;
        filteredDeviceMetrics = deviceMetrics;
        filteredStats = analyticsStats;
        break;
      default:
        filteredDailyMetrics = dailyMetrics;
        filteredLocationMetrics = locationMetrics;
        filteredTeamMetrics = teamMetrics;
        filteredDeviceMetrics = deviceMetrics;
        filteredStats = analyticsStats;
    }

    // Apply additional filters
    if (filters.regions.length > 0) {
      filteredLocationMetrics = filteredLocationMetrics.filter(loc => 
        filters.regions.includes(loc.name)
      );
    }

    if (filters.deviceModels.length > 0) {
      filteredDeviceMetrics = filteredDeviceMetrics.filter(device =>
        filters.deviceModels.includes(device.model)
      );
    }

    return {
      dailyMetrics: filteredDailyMetrics,
      locationMetrics: filteredLocationMetrics,
      teamMetrics: filteredTeamMetrics,
      deviceMetrics: filteredDeviceMetrics,
      stats: filteredStats
    };
  }, [timeRange, filters]);

  // Sorted location metrics
  const sortedLocationMetrics = useMemo(() => {
    return [...filteredData.locationMetrics].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "visitors":
          comparison = a.visitors - b.visitors;
          break;
        case "incidents":
          comparison = a.incidents - b.incidents;
          break;
        case "satisfaction":
          comparison = a.satisfaction - b.satisfaction;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData.locationMetrics, sortField, sortOrder]);

  // Paginated location metrics
  const paginatedLocationMetrics = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLocationMetrics.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedLocationMetrics, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedLocationMetrics.length / itemsPerPage);

  // Export handlers
  const handleExportPDF = () => {
    const content = `
      TourGuard Analytics Report
      Time Range: ${timeRange.replace(/_/g, ' ').toUpperCase()}
      Generated: ${new Date().toLocaleString()}
      
      SUMMARY METRICS
      ===============
      Total Tourists: ${filteredData.stats.totalTourists} (${filteredData.stats.touristTrend})
      Active Alerts: ${filteredData.stats.activeAlerts} (${filteredData.stats.alertTrend})
      Avg Response Time: ${filteredData.stats.avgResponseTime} (${filteredData.stats.responseTrend})
      Incidents Today: ${filteredData.stats.incidentsToday} (${filteredData.stats.incidentTrend})
      System Uptime: ${filteredData.stats.systemUptime} (${filteredData.stats.uptimeTrend})
      Geofence Breaches: ${filteredData.stats.geofenceBreaches} (${filteredData.stats.breachTrend})
      Devices Online: ${filteredData.stats.devicesOnline} (${filteredData.stats.deviceTrend})
      
      LOCATION PERFORMANCE
      =====================
      ${filteredData.locationMetrics.map(loc => 
        `${loc.name}: ${loc.visitors} visitors, ${loc.incidents} incidents, ${loc.satisfaction}% satisfaction`
      ).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Tourists", "Alerts", "Incidents", "Breaches", "Avg Response (min)"];
    const rows = filteredData.dailyMetrics.map(m => 
      [m.date, m.tourists, m.alerts, m.incidents, m.breaches, m.avgResponseMin].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-metrics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({
      timeRange,
      generatedAt: new Date().toISOString(),
      stats: filteredData.stats,
      dailyMetrics: filteredData.dailyMetrics,
      locationMetrics: filteredData.locationMetrics,
      teamMetrics: filteredData.teamMetrics,
      deviceMetrics: filteredData.deviceMetrics
    }, null, 2);
    
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setFilters({ regions: [], deviceModels: [], severity: [] });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.date-dropdown') && !target.closest('.export-dropdown')) {
        setIsDateDropdownOpen(false);
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        {/* Page Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
              <span className="flex h-6 items-center justify-center rounded-full bg-blue-100 px-2.5 text-xs font-bold text-blue-600">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Operational insights, trends, and performance metrics across all systems.
              <span className="ml-2 text-xs text-slate-400">
                Range: {timeRange.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative date-dropdown">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5"
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              >
                <Calendar className="h-3.5 w-3.5" />
                {timeRange.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              
              {isDateDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                  {[
                    { value: "today", label: "Today" },
                    { value: "last_7_days", label: "Last 7 Days" },
                    { value: "last_30_days", label: "Last 30 Days" },
                    { value: "custom", label: "Custom Range" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTimeRange(option.value as TimeRange);
                        setIsDateDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm transition-colors",
                        timeRange === option.value
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 relative"
              onClick={() => setIsFilterDrawerOpen(true)}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {(filters.regions.length > 0 || filters.deviceModels.length > 0 || filters.severity.length > 0) && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {filters.regions.length + filters.deviceModels.length + filters.severity.length}
                </span>
              )}
            </Button>

            {/* Export Button */}
            <div className="relative export-dropdown">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              >
                <Download className="h-3.5 w-3.5" />
                Export Report
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
              
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      handleExportPDF();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Export Daily Metrics (CSV)
                  </button>
                  <button
                    onClick={() => {
                      handleExportJSON();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Export All Data (JSON)
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="space-y-6 px-8 py-6">
          {/* Top Stats */}
          <AnalyticsStats stats={filteredData.stats} timeRange={timeRange} />

          {/* Charts Grid */}
          <AnalyticsCharts 
            dailyMetrics={filteredData.dailyMetrics}
            deviceMetrics={filteredData.deviceMetrics}
          />

          {/* Middle Section: Location + Team */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LocationPerformance 
              locationMetrics={paginatedLocationMetrics}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <TeamPerformance teamMetrics={filteredData.teamMetrics} />
          </div>

          {/* Bottom Section: Device Health + Daily Table */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <DeviceHealth deviceMetrics={filteredData.deviceMetrics} />
            </div>
            <div className="lg:col-span-2">
              <DailyMetricsTable dailyMetrics={filteredData.dailyMetrics} />
            </div>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={toggleFilter}
        onClearFilters={clearFilters}
        onApplyFilters={() => {
          // Filter logic is handled automatically via the filteredData useMemo
          setIsFilterDrawerOpen(false);
        }}
        availableRegions={locationMetrics.map(loc => loc.name)}
        availableDeviceModels={deviceMetrics.map(device => device.model)}
      />
    </div>
  );
}