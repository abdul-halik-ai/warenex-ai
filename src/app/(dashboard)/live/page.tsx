"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Thermometer,
  Droplets,
  Users,
  Box,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function LiveWarehousePage() {
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/warehouse");
      const data = await res.json();
      setZones(data.zones || []);
      if (!selectedZone && data.zones?.length > 0) {
        // default select Zone C or Cold Storage which has anomalies
        setSelectedZone(data.zones.find((z: any) => z.code === "COLD_STORAGE") || data.zones[0]);
      }
    } catch {
      toast.error("Failed to load live warehouse zones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
    const interval = setInterval(fetchZones, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Live Warehouse Map & Digital Twin
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive floor plan of Facility WH-01. Click any zone to inspect real-time racks, sensors, and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
            ● 9 ZONES MONITORED
          </Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 text-xs">
            1 CRITICAL ZONE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Visual Warehouse Floor Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Interactive Facility Floor Plan (2D Spatial Twin)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live SVG coordinate overlay mapping telemetry, RFID portals, and occupancy density
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Normal</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Warning</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Critical</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-slate-100/50 dark:bg-slate-950 flex items-center justify-center">
              {/* Floor Plan Visual Grid */}
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-4 shadow-inner relative min-h-[480px]">
                {/* Dock markers */}
                <div className="absolute top-1 left-8 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  ▲ North Inbound Docking Bays (D1-D4)
                </div>
                <div className="absolute bottom-1 right-8 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  ▼ South Outbound Logistics Docks (B1-B6)
                </div>

                <div className="grid grid-cols-3 gap-3 pt-6 pb-6">
                  {zones.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id;
                    const isCrit = zone.status === "CRITICAL";
                    const isWarn = zone.status === "WARNING";
                    const utilPct = Math.round((zone.occupied / zone.capacity) * 100);

                    return (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`cursor-pointer rounded-lg p-3.5 border-2 transition-all duration-150 relative flex flex-col justify-between min-h-[125px] ${
                          isSelected
                            ? "ring-2 ring-blue-600 border-blue-600 shadow-md scale-[1.02] bg-blue-50/20"
                            : isCrit
                            ? "border-rose-400 bg-rose-50/40 hover:border-rose-500"
                            : isWarn
                            ? "border-amber-400 bg-amber-50/40 hover:border-amber-500"
                            : "border-slate-200 bg-white hover:border-slate-400 dark:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                              {zone.name.split("(")[0]}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {zone.code}
                            </span>
                          </div>
                          <Badge
                            className={`text-[9px] px-1 py-0 ${
                              isCrit
                                ? "bg-rose-500 text-white"
                                : isWarn
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            {zone.status}
                          </Badge>
                        </div>

                        <div className="my-2 space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                            <span>Occ: {utilPct}%</span>
                            <span className="font-mono">{zone.occupied} u</span>
                          </div>
                          <Progress
                            value={utilPct}
                            className={`h-1.5 ${
                              utilPct > 90 ? "[&>div]:bg-rose-500" : "[&>div]:bg-blue-600"
                            }`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t">
                          <span className="flex items-center gap-0.5 font-semibold">
                            <Thermometer className="h-3 w-3 text-slate-400" />
                            <span className={zone.temperature > 8 && zone.code === "COLD_STORAGE" ? "text-rose-600 font-bold" : ""}>
                              {zone.temperature}°C
                            </span>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Users className="h-3 w-3 text-slate-400" />
                            {zone.activeWorkers}
                          </span>
                          {zone.anomalyCount > 0 && (
                            <span className="flex items-center text-amber-600 font-bold">
                              <AlertTriangle className="h-3 w-3 mr-0.5" /> {zone.anomalyCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Detailed Zone Inspection Panel */}
        <div>
          {selectedZone ? (
            <Card className="border-slate-200 shadow-sm sticky top-4">
              <CardHeader className="p-4 pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      {selectedZone.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Type: {selectedZone.type}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${
                      selectedZone.status === "CRITICAL"
                        ? "bg-rose-600 text-white"
                        : selectedZone.status === "WARNING"
                        ? "bg-amber-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {selectedZone.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                    <div className="text-slate-500 text-[10px]">Capacity Utilization</div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {Math.round((selectedZone.occupied / selectedZone.capacity) * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {selectedZone.occupied} / {selectedZone.capacity} pallets
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                    <div className="text-slate-500 text-[10px]">Thermal Reading</div>
                    <div className={`font-bold text-sm ${selectedZone.temperature > 8 && selectedZone.code === "COLD_STORAGE" ? "text-rose-600" : "text-slate-900 dark:text-slate-100"}`}>
                      {selectedZone.temperature}°C / {selectedZone.humidity}% RH
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {selectedZone.code === "COLD_STORAGE" ? "Safe: 2.0 - 8.0°C" : "Safe: 15 - 26°C"}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                    <div className="text-slate-500 text-[10px]">Assigned Personnel</div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {selectedZone.activeWorkers} Workers Active
                    </div>
                    <div className="text-[10px] text-slate-400">RFID badges synced</div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                    <div className="text-slate-500 text-[10px]">Active Incidents</div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {selectedZone.alertCount} Alerts / {selectedZone.anomalyCount} Anomalies
                    </div>
                    <div className="text-[10px] text-slate-400">Verified by Warenex Engine</div>
                  </div>
                </div>

                {/* Specific Alerts for this zone */}
                {selectedZone.code === "COLD_STORAGE" && (
                  <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      CRITICAL THERMAL EXCURSION
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Sensor TEMP-COLD-01 detected 8.4°C exceeding pharmaceutical upper limit (8.0°C). 210 units of SKU-1042 at potential compromise risk.
                    </p>
                  </div>
                )}

                {selectedZone.code === "ZONE_C" && (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      MISPLACED INVENTORY & DAMAGE REPORT
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      SKU-1007 detected in Rack C02 (Expected: Zone B). Overhead camera CAM-04 also flagged crushed package on SKU-2031.
                    </p>
                  </div>
                )}

                {/* Sub-Racks Structure */}
                <div>
                  <div className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-2">
                    Storage Racks & Bay Allocation
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2, 3, 4].map(rackNum => (
                      <div key={rackNum} className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800 border text-xs">
                        <span className="font-mono font-medium">Rack {selectedZone.code.slice(0, 3)}-0{rackNum}</span>
                        <span className="text-[11px] text-slate-500">4 Shelves • 16 Bins</span>
                        <Badge variant="outline" className="text-[10px]">Optimal</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select a zone from the floor plan to inspect telemetry and racks.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
