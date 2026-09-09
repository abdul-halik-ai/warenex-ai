"use client";

import { useState, useEffect } from "react";
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Clock,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts");
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch {
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (alertId: string) => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESOLVE_ALERT", alertId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Alert acknowledged & marked RESOLVED");
        fetchAlerts();
      }
    } catch {
      toast.error("Failed to resolve alert");
    }
  };

  const filtered = filter === "ALL" ? alerts : alerts.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="h-6 w-6 text-rose-600" />
            Central Alert Prioritization Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time incident dispatching ranked by business impact, environmental risk, and financial exposure.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["ALL", "OPEN", "RESOLVED"].map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={`text-xs h-8 ${filter === f ? "bg-blue-600 text-white" : ""}`}
            >
              {f} ({f === "ALL" ? alerts.length : alerts.filter(a => a.status === f).length})
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>Alert Details</TableHead>
                <TableHead>Zone & Target</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-center">Priority Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {filtered.map((alt) => {
                const isCrit = alt.severity === "CRITICAL";
                const isHigh = alt.severity === "HIGH";

                return (
                  <TableRow key={alt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell className="max-w-md">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{alt.title}</span>
                        {alt.sku && (
                          <Badge variant="outline" className="font-mono text-[10px] px-1 py-0">
                            {alt.sku}
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{alt.description}</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                        👉 Action: {alt.recommendedAction}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{alt.zone}</div>
                      <div className="text-[10px] text-slate-400">{alt.timestamp}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[9px] ${
                          isCrit
                            ? "bg-rose-600 text-white"
                            : isHigh
                            ? "bg-amber-600 text-white"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {alt.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      <span className={`text-sm ${alt.priorityScore >= 85 ? "text-rose-600" : "text-amber-600"}`}>
                        {alt.priorityScore}/100
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {alt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alt.status === "OPEN" ? (
                        <Button
                          size="sm"
                          className="h-7 text-[11px] px-2.5 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleResolve(alt.id)}
                        >
                          Resolve Alert
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
