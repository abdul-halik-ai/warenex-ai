"use client";

import { useEffect, useState } from "react";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  Box,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldAlert,
  Thermometer,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Link from "next/link";

export default function CommandCenterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/warehouse");
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load warehouse data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteRec = async (recId: string) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXECUTE_REC", recId })
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("AI Recommendation executed successfully!");
        fetchDashboard();
      }
    } catch {
      toast.error("Failed to execute recommendation");
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE_ALERT", alertId })
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success("Alert resolved and recorded in audit log.");
        fetchDashboard();
      }
    } catch {
      toast.error("Failed to resolve alert");
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">Loading Warenex AI Command Center...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const zones = data?.zones || [];
  const alerts = data?.activeAlerts || [];
  const movements = data?.recentMovements || [];
  const recs = data?.recommendations || [];
  const workers = data?.workers || [];

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time autonomous intelligence, zone telemetry, and active alerts across facility WH-01.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboard} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Now
          </Button>
          <Link href="/copilot">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Ask Copilot
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Inventory Accuracy</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
              {stats.inventoryAccuracy || "98.4%"}
              <span className="text-xs text-emerald-600 flex items-center font-normal">
                <ArrowUpRight className="h-3 w-3" /> +0.2%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[11px] text-slate-500">Autonomous cycle count</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Units in Facility</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.totalUnitsInWarehouse ? stats.totalUnitsInWarehouse.toLocaleString() : "38,240"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[11px] text-slate-500">Across 9 operational zones</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Active Orders</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-600">
              {stats.activeOrders || 4}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[11px] text-slate-500">2 in picking, 1 allocated</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Warehouse Utilization</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
              76.4%
              <Badge variant="outline" className="text-[10px] font-normal">Optimum</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Progress value={76.4} className="h-1.5 mt-1" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Active Alerts</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-600 flex items-center justify-between">
              {alerts.length}
              <ShieldAlert className="h-5 w-5 text-rose-500 opacity-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[11px] text-slate-500">1 Critical, 3 High Priority</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs font-medium">Anomalies Detected</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600 flex items-center justify-between">
              {stats.unresolvedAnomalies || 3}
              <AlertTriangle className="h-5 w-5 text-amber-500 opacity-80" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-[11px] text-slate-500">Misplacement & Temp breach</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Zone Overview & AI Recommendations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Live Warehouse Zones Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Live Zone Utilization & Telemetry</CardTitle>
                <CardDescription className="text-xs">Capacity, occupancy, and thermal status across all 9 zones</CardDescription>
              </div>
              <Link href="/live">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1 h-7">
                  Full Digital Twin <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zones.map((zone: any) => {
                  const utilPct = Math.round((zone.occupied / zone.capacity) * 100);
                  const isCritical = zone.status === "CRITICAL";
                  const isWarning = zone.status === "WARNING";

                  return (
                    <div
                      key={zone.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCritical
                          ? "border-rose-300 bg-rose-50/40 dark:bg-rose-950/20"
                          : isWarning
                          ? "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20"
                          : "border-slate-200 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {zone.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            isCritical
                              ? "bg-rose-100 text-rose-700 border-rose-200"
                              : isWarning
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {zone.status}
                        </Badge>
                      </div>

                      <div className="flex items-baseline justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                        <span>Occupancy: {utilPct}%</span>
                        <span className="font-mono text-[11px]">{zone.occupied.toLocaleString()} / {zone.capacity.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={utilPct}
                        className={`h-1.5 ${
                          utilPct > 90 ? "bg-slate-200 [&>div]:bg-rose-500" : "[&>div]:bg-blue-600"
                        }`}
                      />

                      <div className="mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          <span className={zone.temperature > 8 && zone.code === "COLD_STORAGE" ? "text-rose-600 font-bold" : ""}>
                            {zone.temperature}°C
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {zone.activeWorkers} workers
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inventory Movements */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Real-Time Inventory Movements</CardTitle>
                <CardDescription className="text-xs">Immutable chronological ledger of physical stock shifts</CardDescription>
              </div>
              <Link href="/audit">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1 h-7">
                  View Audit Log <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {movements.map((mov: any) => (
                  <div key={mov.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="h-7 w-7 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-mono font-bold text-[10px] mt-0.5">
                        {mov.event.slice(0, 3)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{mov.sku}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-normal text-slate-600 dark:text-slate-300">{mov.productName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {mov.fromLocation} → <span className="font-medium text-slate-700 dark:text-slate-300">{mov.toLocation}</span> ({mov.reason})
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-[11px] text-slate-500">{mov.time}</div>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 border-slate-200">
                        {mov.worker.split(" ")[0]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Recommendations & Active Alerts */}
        <div className="space-y-6">
          {/* AI Operational Recommendations */}
          <Card className="border-blue-200 bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-950/20 dark:to-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Warenex AI Recommendations
                </CardTitle>
                <Badge className="bg-blue-600 text-white text-[10px]">AI Active</Badge>
              </div>
              <CardDescription className="text-xs">Deterministic reasoning augmented by LLM operations copilot</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-3">
              {recs.map((rec: any) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-lg border border-blue-100 bg-white/90 dark:bg-slate-950/90 dark:border-blue-900/40 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{rec.title}</span>
                    <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700">
                      {Math.round(rec.confidence * 100)}% Conf
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {rec.problem}
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    👉 Action: {rec.recommendedAction}
                  </div>

                  <div className="pt-1 flex justify-end">
                    {rec.isExecuted ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Executed
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleExecuteRec(rec.id)}
                      >
                        Confirm & Execute
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Prioritized Alerts */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Priority Alert Queue</CardTitle>
                <CardDescription className="text-xs">Prioritized by severity and business risk score</CardDescription>
              </div>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1 h-7">
                  All ({alerts.length}) <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2.5">
              {alerts.map((alt: any) => {
                const isCrit = alt.severity === "CRITICAL";
                return (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-lg border text-xs space-y-1.5 transition-all ${
                      isCrit
                        ? "border-rose-200 bg-rose-50/50 dark:bg-rose-950/20"
                        : "border-slate-200 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                        {alt.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={isCrit ? "destructive" : "secondary"}
                          className="text-[9px] px-1 py-0"
                        >
                          Score: {alt.priorityScore}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {alt.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                      <span>{alt.zone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] px-2 text-blue-600 hover:text-blue-700"
                        onClick={() => handleResolveAlert(alt.id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
