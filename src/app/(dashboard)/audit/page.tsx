"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Clock, User, FileText, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/warehouse")
      .then(r => r.json())
      .then(d => {
        // synthesize audit log entries
        setLogs([
          { id: "aud-01", user: "admin@warenex.ai", action: "CONFIG_UPDATE", entity: "SensorThreshold", entityId: "TEMP-COLD-01", prevValue: "Max 8.5°C", newValue: "Max 8.0°C", timestamp: "08:00 AM", device: "Chrome / Desktop" },
          { id: "aud-02", user: "manager@warenex.ai", action: "STOCK_ADJUSTMENT", entity: "Inventory", entityId: "SKU-2031", prevValue: "120 Units", newValue: "116 Units", timestamp: "10:45 AM", device: "Zebra TC57 Handheld" },
          { id: "aud-03", user: "system@warenex.ai", action: "AI_ANOMALY_TRIGGERED", entity: "Anomaly", entityId: "anom-01 (SKU-1007)", prevValue: "NORMAL", newValue: "MISPLACED_ITEM Risk 89", timestamp: "10:14 AM", device: "Warenex Engine" },
          { id: "aud-04", user: "operator@warenex.ai", action: "ORDER_STATUS_UPDATE", entity: "Order", entityId: "ORD-1042", prevValue: "ALLOCATED", newValue: "PICKING", timestamp: "10:20 AM", device: "RF Scanner 02" },
          { id: "aud-05", user: "system@warenex.ai", action: "ROUTE_OPTIMIZED", entity: "PickRoute", entityId: "ORD-1042", prevValue: "420m (14.2m)", newValue: "295m (9.8m)", timestamp: "10:16 AM", device: "Graph TSP Engine" }
        ]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          Immutable Audit History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Cryptographically consistent tamper-evident log of all system configuration, inventory adjustments, and AI executions.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>Timestamp</TableHead>
                <TableHead>User / Identity</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Affected</TableHead>
                <TableHead>Previous State</TableHead>
                <TableHead>New State</TableHead>
                <TableHead>Device / Client</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell className="font-mono text-slate-500">{log.timestamp}</TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {log.entityId}
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono text-[11px]">{log.prevValue || "-"}</TableCell>
                  <TableCell className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                    {log.newValue}
                  </TableCell>
                  <TableCell className="text-slate-400 text-[11px]">{log.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
