"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  Camera,
  Activity,
  AlertTriangle,
  Zap,
  Layers,
  Sparkles,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DigitalTwinPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5 | 10>(1);
  const [eventsCount, setEventsCount] = useState(1420);
  const [activeLog, setActiveLog] = useState<string[]>([]);
  const [forkliftPos, setForkliftPos] = useState({ x: 120, y: 140 });
  const [workerPos, setWorkerPos] = useState({ x: 340, y: 220 });

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/simulation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "STEP" })
          });
          const data = await res.json();
          setEventsCount(prev => prev + 1);
          if (data.event?.description) {
            setActiveLog(prev => [
              `[${new Date().toLocaleTimeString()}] ${data.event.description}`,
              ...prev.slice(0, 15)
            ]);
          }

          // Move forklift and worker smoothly
          setForkliftPos(prev => ({
            x: 100 + (prev.x + 35) % 450,
            y: 120 + ((prev.y + 15) % 180)
          }));
          setWorkerPos(prev => ({
            x: 200 + (prev.x + 20) % 380,
            y: 160 + ((prev.y + 25) % 150)
          }));
        } catch {
          // ignore
        }
      }, 2000 / speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      toast.success(`Digital Twin Simulation Running at ${speed}x speed`);
    } else {
      toast.info("Simulation Paused");
    }
  };

  const handleInjectAnomaly = async () => {
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "INJECT_ANOMALY" })
      });
      const data = await res.json();
      toast.warning("Injected synthetic RFID Misplacement Anomaly into Zone C!");
      setActiveLog(prev => [
        `[${new Date().toLocaleTimeString()}] ⚠️ SYNTHETIC ANOMALY: SKU-3011 detected in unauthorized Zone C portal`,
        ...prev.slice(0, 15)
      ]);
    } catch {
      toast.error("Failed to inject anomaly");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" />
            Digital Twin & Simulation Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time physical spatial mirror animating forklifts, RFID reader gates, CCTV cones, and automated telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-slate-300">
            {eventsCount.toLocaleString()} TELEMETRY EVENTS
          </Badge>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleInjectAnomaly}
            className="text-xs gap-1 h-8"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Inject Anomaly
          </Button>
        </div>
      </div>

      {/* Simulation Playback Toolbar */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/70 dark:bg-slate-900/70">
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isRunning ? "destructive" : "default"}
              onClick={handleToggle}
              className="h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700"
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isRunning ? "Pause Engine" : "Start Simulation"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEventsCount(0);
                setActiveLog([]);
                toast.info("Simulation counters reset");
              }}
              className="h-8 gap-1 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Engine Speed:</span>
            {([1, 2, 5, 10] as const).map(s => (
              <Button
                key={s}
                size="sm"
                variant={speed === s ? "default" : "outline"}
                onClick={() => setSpeed(s)}
                className={`h-7 px-2 text-xs font-mono ${speed === s ? "bg-blue-600 text-white" : ""}`}
              >
                {s}x
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Animated Twin Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b bg-white dark:bg-slate-950 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live 2D Animated Twin Floor</CardTitle>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Forklift #1</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Picker Elena</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> RFID Gates</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative bg-slate-950 min-h-[460px] overflow-hidden">
              {/* Floor grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }}
              />

              {/* Warehouse Zones Outlines */}
              <div className="absolute top-6 left-6 w-36 h-28 border border-blue-500/40 rounded bg-blue-500/10 p-2 text-[10px] text-blue-300 font-mono">
                Receiving Dock
              </div>
              <div className="absolute top-6 left-48 w-44 h-36 border border-emerald-500/40 rounded bg-emerald-500/10 p-2 text-[10px] text-emerald-300 font-mono">
                Zone A (Fast Moving)
              </div>
              <div className="absolute top-6 left-96 w-44 h-36 border border-amber-500/40 rounded bg-amber-500/10 p-2 text-[10px] text-amber-300 font-mono">
                Zone B (Electronics)
              </div>
              <div className="absolute top-44 left-6 w-36 h-36 border border-cyan-500/40 rounded bg-cyan-500/10 p-2 text-[10px] text-cyan-300 font-mono">
                Cold Storage (8.4°C)
              </div>
              <div className="absolute top-44 left-48 w-44 h-32 border border-purple-500/40 rounded bg-purple-500/10 p-2 text-[10px] text-purple-300 font-mono">
                High Value Vault
              </div>
              <div className="absolute top-44 left-96 w-44 h-32 border border-orange-500/40 rounded bg-orange-500/10 p-2 text-[10px] text-orange-300 font-mono">
                Zone C (Heavy Bay)
              </div>

              {/* RFID Gates */}
              <div className="absolute top-20 left-44 h-10 w-2 bg-purple-500 rounded animate-pulse" title="RFID Reader Gate R-01" />
              <div className="absolute top-20 left-92 h-10 w-2 bg-purple-500 rounded animate-pulse" title="RFID Reader Gate R-02" />
              <div className="absolute top-58 left-92 h-10 w-2 bg-purple-500 rounded animate-pulse" title="RFID Reader Gate R-03" />

              {/* Animated Forklift */}
              <div
                style={{
                  transform: `translate(${forkliftPos.x}px, ${forkliftPos.y}px)`,
                  transition: "transform 0.8s ease-out"
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shadow-[0_0_12px_rgba(59,130,246,0.8)] border border-white/40">
                  FL-1
                </div>
                <span className="text-[9px] font-mono text-blue-300 mt-0.5 bg-slate-900/80 px-1 rounded">
                  Forklift #01
                </span>
              </div>

              {/* Animated Worker */}
              <div
                style={{
                  transform: `translate(${workerPos.x}px, ${workerPos.y}px)`,
                  transition: "transform 0.8s ease-out"
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                <div className="h-5 w-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[8px] shadow-[0_0_10px_rgba(245,158,11,0.8)] border border-white">
                  W4
                </div>
                <span className="text-[9px] font-mono text-amber-300 mt-0.5 bg-slate-900/80 px-1 rounded">
                  Elena (W-104)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Telemetry Stream Feed */}
        <Card className="border-slate-200 shadow-sm flex flex-col h-[520px]">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              Live Simulation Event Feed
            </CardTitle>
            <CardDescription className="text-xs">Incoming sensor, RFID, and scan events</CardDescription>
          </CardHeader>
          <CardContent className="p-3 flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-slate-950 text-slate-300">
            {activeLog.length === 0 ? (
              <div className="text-slate-500 italic p-4 text-center">
                Simulation idle. Click &quot;Start Simulation&quot; to begin event generation.
              </div>
            ) : (
              activeLog.map((log, idx) => (
                <div key={idx} className="leading-tight border-b border-slate-800/60 pb-1">
                  {log}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
