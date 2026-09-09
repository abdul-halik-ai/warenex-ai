"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Search,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnomalies = async () => {
    try {
      const res = await fetch("/api/anomalies");
      const data = await res.json();
      setAnomalies(data.anomalies || []);
    } catch {
      toast.error("Failed to load anomalies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Anomaly Center & Root Cause Analysis
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automated detection of misplaced inventory, stock discrepancies, and unauthorized movements with causal graphs.
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
          BEHAVIORAL ENGINE ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {anomalies.map((anom) => {
          const isHigh = anom.riskScore >= 85;
          return (
            <Card key={anom.id} className="border-slate-200 shadow-sm overflow-hidden">
              <div className={`h-1.5 w-full ${isHigh ? "bg-rose-500" : "bg-amber-500"}`} />
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {anom.type.replace(/_/g, " ")}
                    </CardTitle>
                    {anom.sku && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {anom.sku}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs text-slate-500">
                    Location: {anom.location} • Detected: {anom.detectedTime}
                  </CardDescription>
                </div>
                <Badge
                  className={`text-xs ${
                    isHigh ? "bg-rose-600 text-white" : "bg-amber-600 text-white"
                  }`}
                >
                  Risk Score: {anom.riskScore}/100
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3 text-xs">
                {/* Evidence items */}
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] mb-1">
                    Telemetry Evidence:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    {anom.evidence.map((ev: string, idx: number) => (
                      <li key={idx}>{ev}</li>
                    ))}
                  </ul>
                </div>

                {/* Root Cause Box */}
                <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-[11px]">
                    <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                    ROOT CAUSE ANALYSIS (AI INFERENCE)
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {anom.aiExplanation}
                  </p>
                  <div className="text-[11px] text-slate-500">
                    <strong>Likely Trigger:</strong> {anom.likelyCause}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 text-blue-900 dark:text-blue-200 flex items-center justify-between font-medium text-[11px]">
                  <span>👉 Recommended Action: {anom.recommendedAction}</span>
                  <Badge className="bg-blue-600 text-white text-[10px]">
                    {anom.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
