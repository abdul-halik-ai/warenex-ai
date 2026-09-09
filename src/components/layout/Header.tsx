"use client";

import { useState } from "react";
import { Bell, Play, Pause, Zap, CheckCircle2, AlertTriangle, User, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

export function Header() {
  const { data: session } = useSession();
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    { title: "1. Inbound Truck TR-881 Docking", desc: "Shipment arrived at Receiving Dock with 240 units.", status: "DONE" },
    { title: "2. RFID Gate Verification", desc: "Overhead Portal R-RCV-01 detected 24 RFID tags.", status: "DONE" },
    { title: "3. Barcode Scanning Confirmation", desc: "Operator Elena Rostova verified pallet SKU-1001 with Zebra scanner.", status: "DONE" },
    { title: "4. Autonomous Putaway Assignment", desc: "Warehouse engine allocated optimal bin in Zone B / Rack B02.", status: "DONE" },
    { title: "5. Forklift Autonomous Route", desc: "Driver David Kim completed high-bay shelf deposit.", status: "DONE" },
    { title: "6. Order #1042 Ingestion", desc: "Urgent defense contract order received: 14 units across 3 zones.", status: "IN_PROGRESS" },
    { title: "7. AI Route Optimization Engine", desc: "Warehouse graph TSP solver calculated 26.8% shorter path.", status: "DONE" },
    { title: "8. AI Computer Vision Inspection", desc: "Overhead camera CAM-04 flagged crushed packaging on SKU-2031.", status: "ALERT" },
    { title: "9. Cold Storage Temperature Anomaly", desc: "Sensor TEMP-COLD-01 logged 8.4°C breach (> 8.0°C).", status: "ALERT" },
    { title: "10. Misplaced SKU-1007 Detected", desc: "RFID tag detected in Zone C pallet instead of Zone B.", status: "ALERT" },
    { title: "11. Central Alert Engine Prioritization", desc: "Priority scores computed: 96/100 for temperature breach.", status: "DONE" },
    { title: "12. Warenex Copilot Proactive Recommendation", desc: "AI recommended immediate bin relocation and auxiliary cooling.", status: "DONE" },
    { title: "13. Manager Confirmation Dialog", desc: "Operations supervisor approved transfer task with one click.", status: "DONE" },
    { title: "14. Pallet Relocation & Audit Sync", desc: "Immutable audit trail logged transfer from Zone C to Zone B.", status: "DONE" },
    { title: "15. Weigh & Seal Quality Packing", desc: "Package weight confirmed at 14.2 kg within 0.1% tolerance.", status: "DONE" },
    { title: "16. Outbound Dispatch Bay 3 Handover", desc: "FedEx Freight carrier loaded. Order #1042 complete.", status: "SUCCESS" }
  ];

  const handleToggleSimulation = async () => {
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE" })
      });
      const data = await res.json();
      setIsSimRunning(data.isRunning);
      if (data.isRunning) {
        toast.success("Simulation engine started (1x speed)");
      } else {
        toast.info("Simulation paused");
      }
    } catch {
      toast.error("Failed to toggle simulation");
    }
  };

  const handleStepSimulation = async () => {
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "STEP" })
      });
      const data = await res.json();
      toast.success(data.event?.description || "Simulated 1 telemetry tick");
    } catch {
      toast.error("Simulation step failed");
    }
  };

  const handleRunDemo = () => {
    setDemoOpen(true);
    setDemoStep(0);
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          toast.success("Autonomous Warehouse Demo Cycle Complete!");
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <>
      <header className="flex h-14 items-center gap-3 border-b bg-white px-4 lg:h-[62px] lg:px-6 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">FACILITY:</span>
            <Badge variant="outline" className="font-mono text-xs bg-slate-50 dark:bg-slate-900 border-slate-300">
              WH-01 CHICAGO HUB
            </Badge>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 text-xs hidden sm:inline-flex">
            SYSTEM LIVE • 18ms
          </Badge>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Simulation Controls */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border">
            <Button
              size="sm"
              variant={isSimRunning ? "destructive" : "secondary"}
              className="h-7 text-xs px-2.5 gap-1"
              onClick={handleToggleSimulation}
            >
              {isSimRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isSimRunning ? "Pause Sim" : "Run Sim"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs px-2 gap-1"
              onClick={handleStepSimulation}
              title="Step single telemetry tick"
            >
              <RefreshCw className="h-3 w-3" />
              Step
            </Button>
          </div>

          {/* One-Click Demo Button */}
          <Button
            size="sm"
            className="h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm font-medium text-xs"
            onClick={handleRunDemo}
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            Run Warehouse Demo
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border border-slate-200 h-8 px-2.5 rounded-md bg-white text-xs font-medium dark:bg-slate-900 cursor-pointer">
              <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {session?.user?.name?.[0] || "A"}
              </div>
              <span className="text-xs font-medium max-w-[120px] truncate hidden md:inline-block">
                {session?.user?.name || "Admin"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold">{session?.user?.name || "Alex Vance"}</div>
                <div className="text-xs font-normal text-slate-500">{session?.user?.email || "admin@warenex.ai"}</div>
                <Badge className="mt-1 text-[10px] bg-blue-100 text-blue-700 border-blue-200">
                  {(session?.user as any)?.role || "ADMIN"}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* 16-Step Warehouse Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-blue-600 fill-current" />
              Autonomous Warehouse End-to-End Lifecycle Demo
            </DialogTitle>
            <DialogDescription>
              Watch the WARENEX AI platform process a complete shipment lifecycle across sensors, RFID, vision, route optimizer, and automated resolution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3">
            {demoSteps.map((step, idx) => {
              const isCurrent = idx === demoStep;
              const isDone = idx < demoStep;
              return (
                <div
                  key={step.title}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-blue-50/70 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700"
                      : isDone
                      ? "bg-slate-50/50 border-slate-200 dark:bg-slate-900/40 opacity-80"
                      : "opacity-40 border-slate-200"
                  }`}
                >
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                      </span>
                    ) : (
                      <span className="h-4 w-4 rounded-full border border-slate-300 inline-block" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{step.title}</span>
                      {step.status === "ALERT" && isDone && (
                        <Badge variant="destructive" className="text-[10px] h-4">ANOMALY</Badge>
                      )}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 border-t text-xs text-slate-500">
            <span>Step {Math.min(demoStep + 1, demoSteps.length)} of {demoSteps.length}</span>
            <Button size="sm" onClick={() => setDemoOpen(false)}>Close Walkthrough</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
