"use client";

import { useState } from "react";
import { Zap, ShieldCheck, CheckCircle2, Sliders, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AutomationPage() {
  const [rules, setRules] = useState([
    {
      id: "rule-1",
      name: "Cold Storage Thermal Tripwire",
      trigger: "Temperature > 8.0°C for > 10 minutes",
      action: "Trigger CRITICAL alert + Dispatch HVAC engineer + Send SMS",
      enabled: true
    },
    {
      id: "rule-2",
      name: "Autonomous Misplacement Quarantine",
      trigger: "Actual RFID Zone != Product Catalog Zone",
      action: "Create MISPLACED_ITEM Anomaly + Block inventory picking reservation",
      enabled: true
    },
    {
      id: "rule-3",
      name: "Automatic Picking Route Optimization",
      trigger: "Order status transitioned to PICKING with > 2 items",
      action: "Calculate shortest-path TSP sequence and send to RF scanner",
      enabled: true
    },
    {
      id: "rule-4",
      name: "AI Vision Damage Quarantine",
      trigger: "Computer vision damage confidence > 90%",
      action: "Lock inventory batch status to QUARANTINED + Alert supervisor",
      enabled: true
    },
    {
      id: "rule-5",
      name: "Low-Stock Reorder Auto-Draft",
      trigger: "Available units < Reorder Point",
      action: "Calculate Restock Priority Score + Draft PO in ERP",
      enabled: false
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const next = !r.enabled;
        toast.success(`Rule "${r.name}" ${next ? "ENABLED" : "DISABLED"}`);
        return { ...r, enabled: next };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          Autonomous Trigger Policies & Rules Engine
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deterministic event-driven automation rules governing safety, quarantine, and replenishment triggers.
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between text-xs gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{rule.name}</span>
                  <Badge variant={rule.enabled ? "default" : "secondary"} className="text-[10px]">
                    {rule.enabled ? "ACTIVE" : "PAUSED"}
                  </Badge>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  <strong>IF:</strong> {rule.trigger}
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-medium text-[11px]">
                  <strong>THEN:</strong> {rule.action}
                </div>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => toggleRule(rule.id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
