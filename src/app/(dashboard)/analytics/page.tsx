"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { toast } from "sonner";

const accuracyData = [
  { day: "Mon", accuracy: 98.1, picks: 340, throughput: 1420 },
  { day: "Tue", accuracy: 98.4, picks: 380, throughput: 1560 },
  { day: "Wed", accuracy: 97.9, picks: 310, throughput: 1390 },
  { day: "Thu", accuracy: 98.6, picks: 420, throughput: 1680 },
  { day: "Fri", accuracy: 98.2, picks: 450, throughput: 1810 },
  { day: "Sat", accuracy: 98.7, picks: 290, throughput: 1200 },
  { day: "Sun", accuracy: 98.4, picks: 240, throughput: 980 },
];

const anomalyTypesData = [
  { name: "Misplaced Items", value: 42, color: "#f59e0b" },
  { name: "Stock Mismatch", value: 28, color: "#3b82f6" },
  { name: "Damaged Outer Box", value: 16, color: "#ef4444" },
  { name: "Thermal Excursion", value: 14, color: "#06b6d4" },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"Today" | "7 Days" | "30 Days" | "90 Days">("7 Days");

  const generateReport = () => {
    toast.success("Executive Daily Warehouse Intelligence PDF Generated & Downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Advanced Warehouse Analytics & Telemetry KPIs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automated cycle counting accuracy, pick throughput, damage incident rates, and sensor violation history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["Today", "7 Days", "30 Days", "90 Days"] as const).map(t => (
            <Button
              key={t}
              size="sm"
              variant={timeRange === t ? "default" : "outline"}
              onClick={() => setTimeRange(t)}
              className={`text-xs h-8 ${timeRange === t ? "bg-blue-600 text-white" : ""}`}
            >
              {t}
            </Button>
          ))}
          <Button size="sm" onClick={generateReport} className="bg-slate-900 text-white hover:bg-slate-800 text-xs gap-1.5 h-8">
            <Download className="h-3.5 w-3.5" /> Generate Executive Report
          </Button>
        </div>
      </div>

      {/* Top 4 KPI metric banners */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Overall Inventory Accuracy</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
              98.4%
              <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">+0.3%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-slate-500">
            Target SLA: &gt;98.0%
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Daily Order Throughput</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-between">
              1,680 u
              <Badge className="bg-blue-100 text-blue-700 text-[10px]">Peak</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-slate-500">
            +14% vs previous week
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Avg Picker Speed</CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-between">
              2.1 min/pick
              <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">-18% time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-slate-500">
            Accelerated by TSP Route Optimizer
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-1">
            <CardDescription className="text-xs">Packaging Damage Rate</CardDescription>
            <CardTitle className="text-2xl font-bold text-rose-600 flex items-center justify-between">
              0.42%
              <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Below 0.5% cap</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-[11px] text-slate-500">
            Filtered via CCTV AI inspection
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Accuracy & Pick Volume */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold">Inventory Accuracy Trend (%)</CardTitle>
            <CardDescription className="text-xs">Continuous autonomous cycle counts vs baseline</CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis domain={[96, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Throughput Bar Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold">Order Pick Throughput (Units)</CardTitle>
            <CardDescription className="text-xs">Daily outbound picked units across fast-moving zones</CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="throughput" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anomaly Distribution */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold">Anomaly Category Distribution</CardTitle>
            <CardDescription className="text-xs">Breakdown of operational incidents detected by AI</CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={anomalyTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {anomalyTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Executive Summary Card */}
        <Card className="border-slate-200 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              Daily Executive Warehouse Summary
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Generated by Warenex Intelligence Engine at 08:00 AM.
            </p>
            <div className="space-y-2 mt-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                <strong>Safety & Integrity:</strong> Zero OSHA safety zone incursions; Cold storage thermal recovery underway.
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                <strong>Productivity Gain:</strong> +26.8% picking route distance reduction saving 42 man-hours weekly.
              </div>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 border">
                <strong>Inventory Risk:</strong> 1 high-value SKU (SKU-1007) successfully localized and queued for return.
              </div>
            </div>
          </div>
          <Button onClick={generateReport} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export PDF Report
          </Button>
        </Card>
      </div>
    </div>
  );
}
