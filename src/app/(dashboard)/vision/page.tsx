"use client";

import { useState, useEffect, useRef } from "react";
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
  RefreshCw,
  Sliders,
  Cpu,
  Zap,
  Activity,
  Award,
  Layers,
  Sparkles,
  QrCode,
  Droplets,
  Scissors,
  Check,
  Maximize2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [left%, top%, width%, height%]
  damageType?: string;
  severity?: string;
}

interface ModelMetrics {
  mAP50: number;
  mAP50_95: number;
  precision: number;
  recall: number;
  inferenceSpeedMs: number;
}

interface ModelReport {
  modelName: string;
  baseArchitecture: string;
  trainingStatus: string;
  trainedAt: string;
  epochs: number;
  device: string;
  classes: string[];
  metrics: ModelMetrics;
}

export default function VisionPage() {
  const [activeEngine, setActiveEngine] = useState<"opencv" | "yolo">("opencv");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeChannel, setActiveChannel] = useState("damaged");
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
  const [cannyLow, setCannyLow] = useState(50);
  const [cannyHigh, setCannyHigh] = useState(150);
  const [displayMode, setDisplayMode] = useState<"annotated" | "raw">("annotated");
  const [modelReport, setModelReport] = useState<ModelReport | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OpenCV Analysis State
  const [cvAnalysis, setCvAnalysis] = useState<any>({
    id: "cv-init",
    imageUrl: "/samples/sample_damaged.jpg",
    annotatedImageUrl: "/samples/annotated_opencv.jpg",
    annotatedBase64: null,
    timestamp: "Live",
    zone: "Zone C (Industrial & Heavy)",
    cameraName: "CAM-04 (Aisle C Overhead)",
    condition: "DAMAGED",
    damageType: "CRUSHED_CORNER",
    structuralIntegrity: 59.8,
    quarantineRequired: true,
    recommendedAction: "Crushed carton corner & structural dent identified by OpenCV contour analysis. Transfer package to Quarantine Bay 01.",
    metrics: {
      edgeDensity: 0.082,
      solidity: 0.81,
      aspectRatio: 0.88,
      maxDefectDepthPx: 28.4,
      moistureRatio: 0.021,
      tearScore: 74.2,
      barcodeDetected: true,
      defectCount: 1,
      processingTimeMs: 54.2
    },
    defectRegions: [
      { type: "CONVEXITY_DENT", x: 72.4, y: 38.2, depth_px: 28.4, severity: "HIGH" }
    ],
    cartonBbox: [18.2, 28.5, 52.4, 48.0]
  });

  // YOLO Analysis State
  const [yoloAnalysis, setYoloAnalysis] = useState<any>({
    id: "vis-init",
    imageUrl: "/samples/sample_damaged.jpg",
    timestamp: "Live",
    zone: "Zone C (Industrial & Heavy)",
    cameraName: "CAM-04 (Aisle C Overhead)",
    detectedObjects: [
      { id: "det-1", label: "box", confidence: 0.96, bbox: [15, 52, 22, 20] },
      { id: "det-2", label: "damaged_package", confidence: 0.94, bbox: [48, 52, 24, 22], damageType: "CRUSHED", severity: "HIGH" },
      { id: "det-3", label: "worker", confidence: 0.95, bbox: [12, 42, 10, 31] }
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

  // Fetch model training metrics
  const fetchModelMeta = async () => {
    try {
      const res = await fetch("/api/vision/train");
      const data = await res.json();
      if (data.success && data.report) {
        setModelReport(data.report);
      }
    } catch {
      console.error("Failed to load model metrics");
    }
  };

  useEffect(() => {
    fetchModelMeta();
    // Run initial OpenCV scan
    runOpenCvScan({ imageUrl: "/samples/sample_damaged.jpg" });
  }, []);

  // Execute OpenCV Product Analysis
  const runOpenCvScan = async (payload: Record<string, any>) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/vision/opencv-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cannyLow,
          cannyHigh,
          ...payload
        })
      });
      const data = await res.json();
      if (data.success) {
        setCvAnalysis(data.analysis);
        if (data.analysis.quarantineRequired) {
          toast.warning(
            `OpenCV Alert: Package damage detected (${data.analysis.damageType} • ${data.analysis.structuralIntegrity}% Integrity). Quarantine required.`
          );
        } else {
          toast.success(`OpenCV Scan: Package verified intact (${data.analysis.structuralIntegrity}% Integrity). Clear for putaway.`);
        }
      } else {
        toast.error(data.error || "OpenCV analysis error");
      }
    } catch {
      toast.error("OpenCV inspection service unavailable");
    } finally {
      setAnalyzing(false);
    }
  };

  // Execute YOLOv8 Inference
  const runYoloScan = async (payload: Record<string, any>) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confidenceThreshold,
          ...payload
        })
      });
      const data = await res.json();
      if (data.success) {
        setYoloAnalysis(data.analysis);
        if (data.analysis.quarantineRequired) {
          toast.warning(
            `YOLOv8 Alert: Damaged package detected (${Math.round(data.analysis.damageConfidence * 100)}% conf). Transfer required.`
          );
        } else {
          toast.success("YOLOv8 Scan: Packaging verified intact. Pallet approved.");
        }
      } else {
        toast.error(data.error || "YOLO inference error");
      }
    } catch {
      toast.error("YOLO inference service failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleChannelSelect = (channel: string) => {
    setActiveChannel(channel);
    let sampleImg = "/samples/sample_damaged.jpg";
    let zone = "Zone C (Industrial & Heavy)";
    let camName = "CAM-04 (Aisle C Overhead)";

    if (channel === "intact") {
      sampleImg = "/samples/sample_intact.jpg";
      zone = "Receiving Dock";
      camName = "CAM-01 (Receiving Portal)";
    } else if (channel === "worker") {
      sampleImg = "/samples/sample_worker.jpg";
      zone = "Zone A (Main Transit Corridor)";
      camName = "CAM-07 (Corridor Safety)";
    } else if (channel === "empty") {
      sampleImg = "/samples/sample_empty.jpg";
      zone = "Zone B (High-Bay Racks)";
      camName = "CAM-09 (Shelf Bin Staging)";
    }

    if (activeEngine === "opencv") {
      runOpenCvScan({ imageUrl: sampleImg, zone, cameraName: camName });
    } else {
      runYoloScan({ imageUrl: sampleImg, zone, cameraName: camName });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setActiveChannel("custom");
      if (activeEngine === "opencv") {
        runOpenCvScan({
          base64Image: base64Data,
          cameraName: `User Upload (${file.name})`,
          zone: "Quality Control Lab"
        });
      } else {
        runYoloScan({
          base64Image: base64Data,
          cameraName: `User Upload (${file.name})`,
          zone: "Quality Control Lab"
        });
      }
      setUploadLoading(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendToQuarantine = async () => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TRANSFER",
          inventoryId: "inv-04",
          toZone: "Returns & Quarantine",
          toRack: "Quarantine Bay 01",
          toShelf: "Shelf 1",
          toBin: "Bin 01",
          workerName: "OpenCV QC Auto-Dispatcher"
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Package routed to Quarantine Bay 01. Immutable audit record logged.");
        setCvAnalysis((prev: any) => ({
          ...prev,
          quarantineRequired: false,
          recommendedAction: "Package successfully transferred to Quarantine Bay 01."
        }));
        setYoloAnalysis((prev: any) => ({
          ...prev,
          quarantineRequired: false,
          recommendedAction: "Package successfully transferred to Quarantine Bay 01."
        }));
      } else {
        toast.error(data.error || "Quarantine routing failed");
      }
    } catch {
      toast.error("Failed to trigger quarantine transfer");
    }
  };

  const metrics = modelReport?.metrics || {
    mAP50: 0.942,
    mAP50_95: 0.816,
    precision: 0.952,
    recall: 0.924,
    inferenceSpeedMs: 24.5
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Computer Vision & Product Quality Analysis
            </h1>
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs">
              OPENCV 5.0 & YOLOv8 ACTIVE
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time optical quality control analyzing product cartons for crushed corners, surface tears, moisture leaks, and barcode legibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadLoading || analyzing}
            className="text-xs gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Upload className="h-3.5 w-3.5 text-blue-600" />
            Upload Carton Photo
          </Button>
          <Button
            size="sm"
            onClick={() => handleChannelSelect(activeChannel)}
            disabled={analyzing}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${analyzing ? "animate-spin" : ""}`} />
            Re-Analyze Product
          </Button>
        </div>
      </div>

      {/* Engine Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <Tabs value={activeEngine} onValueChange={(val) => setActiveEngine(val as any)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 w-full sm:w-[480px] h-10 bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
            <TabsTrigger
              value="opencv"
              className="text-xs font-semibold py-1.5 gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-emerald-400"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              OpenCV 5.0 Defect Analyzer
            </TabsTrigger>
            <TabsTrigger
              value="yolo"
              className="text-xs font-semibold py-1.5 gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-blue-400"
            >
              <Cpu className="h-4 w-4 text-blue-600" />
              YOLOv8 Deep Learning
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Hardware Acceleration: CPU C++ Backend
          </span>
        </div>
      </div>

      {/* Preset Camera Channels & Parameters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mr-1 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-blue-600" />
            SAMPLE CARRIERS:
          </span>
          <Button
            size="sm"
            variant={activeChannel === "damaged" ? "default" : "outline"}
            onClick={() => handleChannelSelect("damaged")}
            className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-800"
          >
            <AlertTriangle className="h-3 w-3 text-rose-500" />
            Crushed / Damaged Carton
          </Button>
          <Button
            size="sm"
            variant={activeChannel === "intact" ? "default" : "outline"}
            onClick={() => handleChannelSelect("intact")}
            className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-800"
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Intact Standard Pallet
          </Button>
          <Button
            size="sm"
            variant={activeChannel === "worker" ? "default" : "outline"}
            onClick={() => handleChannelSelect("worker")}
            className="text-xs h-8 gap-1.5 border-slate-200 dark:border-slate-800"
          >
            <User className="h-3 w-3 text-blue-500" />
            Aisle Safety View
          </Button>
          {activeChannel === "custom" && (
            <Badge className="bg-indigo-600 text-white text-xs h-8 px-2.5">
              Custom Upload Active
            </Badge>
          )}
        </div>

        {/* Dynamic Controls based on Engine */}
        {activeEngine === "opencv" ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <Button
                size="sm"
                variant={displayMode === "annotated" ? "secondary" : "ghost"}
                className="h-7 text-xs px-2.5"
                onClick={() => setDisplayMode("annotated")}
              >
                OpenCV HUD View
              </Button>
              <Button
                size="sm"
                variant={displayMode === "raw" ? "secondary" : "ghost"}
                className="h-7 text-xs px-2.5"
                onClick={() => setDisplayMode("raw")}
              >
                Raw Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">YOLO Confidence:</span>
            <select
              value={confidenceThreshold}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setConfidenceThreshold(val);
                runYoloScan({ confidenceThreshold: val });
              }}
              className="text-xs h-8 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            >
              <option value="0.15">15% (High Sensitivity)</option>
              <option value="0.25">25% (Recommended)</option>
              <option value="0.50">50% (Standard)</option>
              <option value="0.75">75% (Strict)</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: Viewport + Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Inspection Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-600" />
                  {activeEngine === "opencv" ? cvAnalysis.cameraName : yoloAnalysis.cameraName}
                </CardTitle>
                <CardDescription className="text-xs">
                  {activeEngine === "opencv" ? "OpenCV 5.0 Real-time Structural Geometry Stream" : "YOLOv8 Overhead CCTV Feed"} &bull; Location: {cvAnalysis.zone}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                  {activeEngine === "opencv" ? `OPENCV • ${cvAnalysis.metrics?.processingTimeMs || 54}ms` : "YOLO • 24ms"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                {activeEngine === "opencv" ? (
                  // OPENCV VIEW
                  displayMode === "annotated" && (cvAnalysis.annotatedBase64 || cvAnalysis.annotatedImageUrl) ? (
                    <img
                      src={cvAnalysis.annotatedBase64 || cvAnalysis.annotatedImageUrl}
                      alt="OpenCV Annotated Inspection"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={cvAnalysis.imageUrl}
                      alt="Raw Stream"
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  // YOLO VIEW
                  <div className="relative w-full h-full">
                    <img
                      src={yoloAnalysis.imageUrl}
                      alt="YOLO Stream"
                      className="w-full h-full object-contain"
                    />
                    {/* YOLO Bounding Boxes */}
                    {yoloAnalysis.detectedObjects?.map((obj: DetectedObject) => {
                      const [left, top, width, height] = obj.bbox;
                      const isDamaged = obj.label === "damaged_package";
                      const isWorker = obj.label === "worker";

                      return (
                        <div
                          key={obj.id}
                          className={`absolute border-2 transition-all duration-300 pointer-events-none ${
                            isDamaged
                              ? "border-rose-500 bg-rose-500/20"
                              : isWorker
                              ? "border-amber-400 bg-amber-400/20"
                              : "border-blue-500 bg-blue-500/10"
                          }`}
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            width: `${width}%`,
                            height: `${height}%`,
                          }}
                        >
                          <div
                            className={`absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase rounded-xs shadow-xs ${
                              isDamaged ? "bg-rose-600" : isWorker ? "bg-amber-600" : "bg-blue-600"
                            }`}
                          >
                            {obj.label} ({Math.round(obj.confidence * 100)}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Loading overlay */}
                {analyzing && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white text-xs">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                      <span>Running {activeEngine === "opencv" ? "OpenCV 5.0 C++ Analysis" : "YOLOv8 Inference"}...</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* OpenCV Analytical Findings / Legend */}
          {activeEngine === "opencv" && (
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  OpenCV 5.0 Visual Inspection Layers & Color Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-semibold text-[11px]">Green Hull</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Valid Carton Geometry</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50/70 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div>
                      <div className="font-semibold text-[11px]">Red Highlights</div>
                      <div className="text-[10px] text-rose-700 dark:text-rose-400">Crushed Corners / Tears</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div>
                      <div className="font-semibold text-[11px]">Yellow Region</div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-400">Moisture / Damp Stains</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-semibold text-[11px]">Blue Box</div>
                      <div className="text-[10px] text-blue-700 dark:text-blue-400">Barcode & Shipping Label</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Detailed Telemetry & Decision Console */}
        <div className="space-y-4">
          {activeEngine === "opencv" ? (
            // OPENCV DIAGNOSTICS CARD
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" />
                    OpenCV Quality Verdict
                  </CardTitle>
                  <Badge
                    className={
                      cvAnalysis.condition === "DAMAGED"
                        ? "bg-rose-600 text-white hover:bg-rose-700 font-bold"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
                    }
                  >
                    {cvAnalysis.condition}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Structural Integrity Dial */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Packaging Structural Integrity
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span
                      className={`text-3xl font-black ${
                        cvAnalysis.structuralIntegrity >= 85
                          ? "text-emerald-600"
                          : cvAnalysis.structuralIntegrity >= 70
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {cvAnalysis.structuralIntegrity}%
                    </span>
                    <span className="text-xs text-slate-500">
                      (Min Allowed: 82.0%)
                    </span>
                  </div>
                </div>

                {/* Quantitative Metric Gauges */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Scissors className="h-3.5 w-3.5 text-rose-500" />
                      Corner Defect Depth:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {cvAnalysis.metrics?.maxDefectDepthPx || 0} px
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-indigo-500" />
                      Canny Edge Density:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {(cvAnalysis.metrics?.edgeDensity * 100 || 0).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-amber-500" />
                      Moisture / Damp Ratio:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {(cvAnalysis.metrics?.moistureRatio * 100 || 0).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <QrCode className="h-3.5 w-3.5 text-blue-500" />
                      Barcode & Shipping Label:
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] border-blue-200 text-blue-700 bg-blue-50">
                      {cvAnalysis.metrics?.barcodeDetected ? "VERIFIED READABLE" : "NOT DETECTED"}
                    </Badge>
                  </div>
                </div>

                {/* AI Recommendation Message */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    cvAnalysis.quarantineRequired
                      ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {cvAnalysis.quarantineRequired ? (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                    {cvAnalysis.quarantineRequired ? "Defect Action Required" : "Packaging Cleared"}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {cvAnalysis.recommendedAction}
                  </p>
                </div>

                {/* Automated Quarantine Transfer Button */}
                {cvAnalysis.quarantineRequired && (
                  <Button
                    onClick={handleSendToQuarantine}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 font-semibold gap-2 shadow-sm"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Dispatch to Quarantine Bay 01
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            // YOLO DIAGNOSTICS CARD
            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    YOLOv8 Class Tally
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {yoloAnalysis.detectedObjects?.length || 0} OBJECTS
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 text-[11px] block">Cartons</span>
                    <span className="text-lg font-bold text-blue-600">{yoloAnalysis.boxCount || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 text-[11px] block">Damaged</span>
                    <span className="text-lg font-bold text-rose-600">{yoloAnalysis.damagedCount || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 text-[11px] block">Personnel</span>
                    <span className="text-lg font-bold text-amber-600">{yoloAnalysis.workerCount || 0}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 text-[11px] block">Empty Bins</span>
                    <span className="text-lg font-bold text-purple-600">{yoloAnalysis.emptyBinDetected ? "YES" : "NO"}</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg border text-xs ${
                    yoloAnalysis.quarantineRequired
                      ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {yoloAnalysis.quarantineRequired ? (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                    YOLOv8 Dispatch Advice
                  </div>
                  <p className="text-[11px] leading-relaxed">{yoloAnalysis.recommendedAction}</p>
                </div>

                {yoloAnalysis.quarantineRequired && (
                  <Button
                    onClick={handleSendToQuarantine}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs h-9 font-semibold gap-2 shadow-sm"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Transfer to Quarantine Bay
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
