"use client";

import { useState, useEffect } from "react";
import {
  Radio,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  DoorClosed,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SensorsPage() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testValue, setTestValue] = useState<Record<string, string>>({});

  const fetchSensors = async () => {
    try {
      const res = await fetch("/api/sensors");
      const data = await res.json();
      setSensors(data.sensors || []);
    } catch {
      toast.error("Failed to load IoT sensors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
    const interval = setInterval(fetchSensors, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateSensor = async (sensorId: string) => {
    const val = testValue[sensorId];
    if (val === undefined || val === "") return;

    try {
      const res = await fetch("/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensorId, value: Number(val) })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Sensor ${sensorId} updated to ${val}`);
        fetchSensors();
      }
    } catch {
      toast.error("Failed to update sensor reading");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-blue-600" />
            IoT Environmental & Facility Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time sensor network monitoring temperature, relative humidity, air quality, and vault intrusion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
            MQTT BROKER CONNECTED
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => {
          const isCrit = sensor.status === "CRITICAL";
          const isWarn = sensor.status === "WARNING";

          return (
            <Card
              key={sensor.id}
              className={`border transition-all ${
                isCrit
                  ? "border-rose-300 bg-rose-50/40 dark:bg-rose-950/20"
                  : isWarn
                  ? "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20"
                  : "border-slate-200"
              }`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {sensor.sensorId}
                  </span>
                  <div className="text-[11px] text-slate-500">{sensor.zone}</div>
                </div>
                <Badge
                  className={`text-[9px] ${
                    isCrit
                      ? "bg-rose-600 text-white"
                      : isWarn
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {sensor.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {sensor.value} <span className="text-sm font-normal text-slate-500">{sensor.unit}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>Safe Tolerance:</div>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      {sensor.thresholdMin} - {sensor.thresholdMax} {sensor.unit}
                    </span>
                  </div>
                </div>

                {isCrit && (
                  <div className="p-2 rounded bg-rose-100/70 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 text-[11px] flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Threshold Breach: Immediate inspection required!
                  </div>
                )}

                <div className="pt-2 border-t flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Simulate val..."
                    value={testValue[sensor.sensorId] || ""}
                    onChange={(e) => setTestValue({ ...testValue, [sensor.sensorId]: e.target.value })}
                    className="h-7 text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2"
                    onClick={() => handleUpdateSensor(sensor.sensorId)}
                  >
                    Test Drift
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
