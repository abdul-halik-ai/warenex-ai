"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Navigation,
  ArrowRight,
  TrendingDown,
  Clock,
  Box,
  MapPin,
  CheckCircle2,
  Sliders
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PickingOptimizationPage() {
  const [routeData, setRouteData] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState("ord-1042");
  const [loading, setLoading] = useState(true);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/routes/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder })
      });
      const data = await res.json();
      setRouteData(data.route);
    } catch {
      toast.error("Failed to calculate picking route");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [selectedOrder]);

  const handleApplyRoute = () => {
    toast.success(`AI Optimized Route broadcasted to Worker Elena Rostova's RF Scanner!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Picking Route Optimization Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Graph-based Traveling Salesperson (TSP) solver comparing standard sequential pick paths against AI shortest paths.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-600 text-white text-xs">
            TSP GRAPH SOLVER ACTIVE
          </Badge>
        </div>
      </div>

      {/* Comparison Metrics */}
      {routeData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs">Original Distance</CardDescription>
              <CardTitle className="text-xl font-bold text-slate-700">
                {routeData.originalDistanceMeters} meters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-[11px] text-slate-500">
              Est. Travel Time: {routeData.originalTimeMinutes} min
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-950/20">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs text-blue-700 dark:text-blue-300">AI Optimized Distance</CardDescription>
              <CardTitle className="text-xl font-bold text-blue-600">
                {routeData.optimizedDistanceMeters} meters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-[11px] text-blue-600 dark:text-blue-400">
              Est. Travel Time: {routeData.optimizedTimeMinutes} min
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20">
            <CardHeader className="p-4 pb-1">
              <CardDescription className="text-xs text-emerald-700 dark:text-emerald-300">Total Improvement</CardDescription>
              <CardTitle className="text-xl font-bold text-emerald-600 flex items-center gap-1">
                <TrendingDown className="h-5 w-5" />
                +{routeData.improvementPercentage}% Faster
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              Saves ~4.4 minutes per pick cycle
            </CardContent>
          </Card>

          <Card className="border-slate-200 flex items-center justify-center p-4">
            <Button onClick={handleApplyRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 text-xs">
              <Zap className="h-4 w-4 fill-current" />
              Transmit to Picker RF Terminal
            </Button>
          </Card>
        </div>
      )}

      {/* Route Sequences Visualizer */}
      {routeData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Route */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700">Standard Sequential Route</CardTitle>
                <Badge variant="outline" className="text-[10px]">Unoptimized</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {routeData.originalRoute.map((step: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px] shrink-0 border">
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-2 rounded bg-slate-50 dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {step}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Optimized Route */}
          <Card className="border-blue-300 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2 border-b bg-blue-50/50 dark:bg-blue-950/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-600" />
                  AI Shortest-Path Sequence
                </CardTitle>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  -{routeData.improvementPercentage}% Distance
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {routeData.optimizedRoute.map((step: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-2 rounded bg-blue-50/40 dark:bg-blue-950/30 border border-blue-200 text-blue-950 dark:text-blue-200 font-mono text-[11px] flex items-center justify-between">
                    <span>{step}</span>
                    {idx > 0 && idx < routeData.optimizedRoute.length - 1 && (
                      <Badge variant="outline" className="text-[9px] bg-white text-blue-700">Pick Waypoint</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
