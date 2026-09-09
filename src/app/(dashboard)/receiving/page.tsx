"use client";

import { useState } from "react";
import {
  Truck,
  ScanBarcode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ReceivingPage() {
  const [barcodeInput, setBarcodeInput] = useState("SKU-1001");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [putawayDone, setPutawayDone] = useState(false);

  const handleScan = async (codeToScan?: string) => {
    const code = codeToScan || barcodeInput;
    if (!code) return;

    setScanning(true);
    try {
      const res = await fetch("/api/barcode/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: code,
          workerId: "Carlos Mendez (W-108)",
          location: "Receiving Dock Intake Bay 2"
        })
      });
      const data = await res.json();
      setScanResult(data);
      setPutawayDone(false);
      if (data.scan?.result === "SUCCESS") {
        toast.success(`Verified: ${data.scan.sku} matches Master Catalog!`);
      } else {
        toast.warning(`Notice: Unknown SKU code ${code}`);
      }
    } catch {
      toast.error("Barcode verification failed");
    } finally {
      setScanning(false);
    }
  };

  const handleExecutePutaway = () => {
    setPutawayDone(true);
    toast.success(`Autonomous Putaway complete: Pallet stored at assigned bay!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Receiving Dock & Barcode/QR Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Intake workflow: Truck Arrival → Barcode/RFID Verification → Quality Check → Putaway.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Simulation Card */}
        <Card className="border-slate-200 shadow-sm lg:col-span-1">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ScanBarcode className="h-4 w-4 text-blue-600" />
              Handheld Barcode / QR Scanner
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate Zebra TC57 optical laser scan or trigger browser camera
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-slate-700">Enter or Scan Barcode/SKU:</span>
              <div className="flex gap-2">
                <Input
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="SKU-1001"
                  className="text-xs font-mono"
                />
                <Button
                  onClick={() => handleScan()}
                  disabled={scanning}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  Scan
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-500">Quick Pallet Barcode Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {["SKU-1001", "SKU-1007", "SKU-1042", "SKU-2031", "SKU-2045"].map(sku => (
                  <Button
                    key={sku}
                    size="sm"
                    variant="outline"
                    className="text-[11px] h-6 px-2 font-mono"
                    onClick={() => {
                      setBarcodeInput(sku);
                      handleScan(sku);
                    }}
                  >
                    {sku}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Hardware Integration:</div>
              <div>Connected Reader: Zebra TC57 / Honeywell Xenon 1950g</div>
              <div>RFID Portal: Zebra FX9600 Fixed RFID Reader</div>
            </div>
          </CardContent>
        </Card>

        {/* Verification & Putaway Output */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold">Inbound Verification & Putaway Engine</CardTitle>
            <CardDescription className="text-xs">
              System verification against product master database
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-4">
            {scanResult ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-blue-900 dark:text-blue-200 font-mono">
                      {scanResult.scan.sku}
                    </span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      VERIFIED MATCH
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Product Name:</span>{" "}
                      <strong>{scanResult.product?.name || "Industrial Precision Unit"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Assigned Storage Zone:</span>{" "}
                      <strong>{scanResult.product?.expectedZone || "Zone A"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Assigned Rack & Bin:</span>{" "}
                      <strong className="font-mono">{scanResult.product?.expectedRack || "Rack A01"} / {scanResult.product?.expectedBin || "Bin 01"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Available Stock:</span>{" "}
                      <strong>{scanResult.inventory?.availableQuantity || 90} units</strong>
                    </div>
                  </div>
                </div>

                {/* Putaway Execution Step */}
                <div className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-slate-900">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Step 7: Autonomous Putaway Task
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Transport pallet from Receiving Intake to {scanResult.product?.expectedZone || "assigned zone"}
                    </div>
                  </div>

                  {putawayDone ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Putaway Complete
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleExecutePutaway}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                    >
                      Confirm Putaway <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs italic">
                Scan or enter a barcode above to trigger inbound product verification and putaway assignment.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
