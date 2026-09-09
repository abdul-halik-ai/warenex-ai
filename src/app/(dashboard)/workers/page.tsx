"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Award,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/warehouse");
      const data = await res.json();
      setWorkers(data.workers || []);
    } catch {
      toast.error("Failed to load workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Worker Activity & Productivity Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Privacy-compliant tracking using RFID badge IDs, tasks, travel distance, and pick accuracy rates. (No facial recognition).
          </p>
        </div>
      </div>

      {/* Workers Roster Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>Worker Name & Badge</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Active Zone</TableHead>
                <TableHead>Current Task</TableHead>
                <TableHead className="text-right">Units Handled</TableHead>
                <TableHead className="text-right">Avg Pick Time</TableHead>
                <TableHead className="text-right">Travel Distance</TableHead>
                <TableHead className="text-right">Accuracy Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {workers.map((w) => (
                <TableRow key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{w.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{w.badgeId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {w.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                    {w.currentZone}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {w.currentTask}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    {w.unitsPicked} u
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-600">
                    {w.avgPickTimeMin}m
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-600">
                    {w.travelDistanceKm} km
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-600">
                    {w.accuracyRate}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
