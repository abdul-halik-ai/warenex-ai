"use client";

import { useState } from "react";
import {
  Camera,
  Upload,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Box,
  User,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function VisionPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>({
    id: "vis-demo",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
    timestamp: "11:22 AM",
    zone: "Zone C (Industrial & Heavy)",
    cameraName: "CAM-04 (Aisle C Overhead)",
    detectedObjects: [
      { id: "det-1", label: "box", confidence: 0.98, bbox: [12, 20, 32, 44] },
      { id: "det-2", label: "damaged_package", confidence: 0.94, bbox: [48, 35, 30, 40], damageType: "CRUSHED", severity: "HIGH" },
      { id: "det-3", label: "worker", confidence: 0.95, bbox: [80, 15, 16, 68] }
    ],
    boxCount: 2,
    damagedCount: 1,
    workerCount: 1,
    emptyBinDetected: false,
    damageConfidence: 0.94,
    damageType: "CRUSHED",
    recommendedAction: "Corner impact detected on outer corrugated carton. Move package to Quarantine Bay immediately.",
    quarantineRequired: true
  });

  const handleSimulateVision = async (simulateDamage: boolean) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zone: "Zone C (Industrial & Heavy)",
          cameraName: "CAM-04 Overhead Aisle C",
          simulateDamage
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
        if (simulateDamage) {
          toast.warning("AI Vision Alert: Damaged package detected (94% confidence)!");
        } else {
          toast.success("AI Vision Scan: Packaging intact. Ready for putaway.");
        }
      }
    } catch {
      toast.error("Computer vision inspection failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Computer Vision & Damage Inspection
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time inference pipeline analyzing overhead CCTV streams and handheld photo uploads for package integrity, personnel safety, and empty bins.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateVision(false)}
            disabled={analyzing}
            className="text-xs gap-1.5"
          >
            <Scan className="h-3.5 w-3.5" />
            Inspect Intact Pallet
          </Button>
          <Button
            size="sm"
            onClick={() => handleSimulateVision(true)}
            disabled={analyzing}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Inspect Damaged Pallet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Inspection Video / Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <CardHeader className="p-4 pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  Live CCTV Stream: {analysis?.cameraName || "CAM-04 (Aisle C Overhead)"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Inference FPS: 28.4 • Model: YOLO-Warehouse-v8 + ResNet Damage Classifier
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 text-[10px] font-mono">
                LIVE RTSP STREAM
              </Badge>
            </CardHeader>
            <CardContent className="p-0 relative bg-slate-950 flex items-center justify-center min-h-[420px]">
              {/* Warehouse Camera Feed Background */}
              <img
                src={analysis?.imageUrl}
                alt="Warehouse inspection camera stream"
                className="w-full h-full object-cover max-h-[480px] opacity-85"
              />

              {/* Bounding Boxes Overlay */}
              {analysis?.detectedObjects?.map((obj: any) => {
                const isDamaged = obj.label === "damaged_package";
                const isWorker = obj.label === "worker";

                return (
                  <div
                    key={obj.id}
                    style={{
                      position: "absolute",
                      left: `${obj.bbox[0]}%`,
                      top: `${obj.bbox[1]}%`,
                      width: `${obj.bbox[2]}%`,
                      height: `${obj.bbox[3]}%`
                    }}
                    className={`border-2 rounded transition-all pointer-events-none flex flex-col justify-between ${
                      isDamaged
                        ? "border-rose-500 bg-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                        : isWorker
                        ? "border-blue-400 bg-blue-500/10"
                        : "border-emerald-400 bg-emerald-500/10"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono px-1.5 py-0.5 self-start text-white font-bold uppercase tracking-wider rounded-br ${
                        isDamaged ? "bg-rose-600" : isWorker ? "bg-blue-600" : "bg-emerald-600"
                      }`}
                    >
                      {obj.label} ({Math.round(obj.confidence * 100)}%)
                      {obj.damageType && ` - ${obj.damageType}`}
                    </div>
                  </div>
                );
              })}

              {analyzing && (
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white text-xs">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                    <span>Running Vision Inference Pipeline...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inference Diagnostic Results */}
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 border-b">
              <CardTitle className="text-sm font-semibold">AI Detection Summary</CardTitle>
              <CardDescription className="text-xs">Object breakdown and structural assessment</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border text-center">
                  <div className="text-slate-500 text-[10px]">Boxes Detected</div>
                  <div className="font-bold text-base text-slate-900 dark:text-slate-100">{analysis?.boxCount}</div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border text-center">
                  <div className="text-slate-500 text-[10px]">Damaged Items</div>
                  <div className={`font-bold text-base ${analysis?.damagedCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                    {analysis?.damagedCount}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border text-center">
                  <div className="text-slate-500 text-[10px]">Workers in View</div>
                  <div className="font-bold text-base text-slate-900 dark:text-slate-100">{analysis?.workerCount}</div>
                </div>
              </div>

              {analysis?.damagedCount > 0 ? (
                <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      Damage Classification: {analysis.damageType}
                    </span>
                    <Badge variant="destructive" className="text-[10px]">
                      {Math.round(analysis.damageConfidence * 100)}% Confidence
                    </Badge>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Severity: <strong>HIGH</strong>. Physical structural failure on corner edge. Carton burst hazard.
                  </p>
                  <div className="p-2 rounded bg-white dark:bg-slate-900 border border-rose-200 text-slate-800 dark:text-slate-200 text-[11px] font-medium">
                    👉 <strong>Recommended Action:</strong> {analysis.recommendedAction}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Packaging Verified: 100% Intact
                  </div>
                  <p className="text-[11px]">
                    No structural tears, crushing, or punctures detected. Safe for automated high-bay racking.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t text-[11px] text-slate-500 space-y-1 font-mono">
                <div>Zone: {analysis?.zone}</div>
                <div>Timestamp: {analysis?.timestamp}</div>
                <div>Quarantine Required: {analysis?.quarantineRequired ? "YES" : "NO"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
