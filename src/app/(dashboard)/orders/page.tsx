"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Package,
  Layers,
  ChevronRight,
  User
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = "ALLOCATED";
    if (currentStatus === "RECEIVED") nextStatus = "ALLOCATED";
    else if (currentStatus === "ALLOCATED") nextStatus = "PICKING";
    else if (currentStatus === "PICKING") nextStatus = "PICKED";
    else if (currentStatus === "PICKED") nextStatus = "PACKING";
    else if (currentStatus === "PACKING") nextStatus = "PACKED";
    else if (currentStatus === "PACKED") nextStatus = "DISPATCHED";

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order advanced to status: ${nextStatus}`);
        fetchOrders();
      }
    } catch {
      toast.error("Failed to advance order status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            End-to-end lifecycle: Allocation → Picking → Quality Packing → Dispatch Bay.
          </p>
        </div>
        <Link href="/picking">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 text-xs">
            <Package className="h-3.5 w-3.5" /> Optimize Picking Routes
          </Button>
        </Link>
      </div>

      {/* Orders Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>Order ID & Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Item Units</TableHead>
                <TableHead>Status Progression</TableHead>
                <TableHead>Assigned Worker</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {orders.map((ord) => {
                const isUrgent = ord.priority === "URGENT";
                const isHigh = ord.priority === "HIGH";

                return (
                  <TableRow key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell>
                      <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {ord.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">{ord.customer}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 ${
                          isUrgent
                            ? "bg-rose-50 text-rose-700 border-rose-300"
                            : isHigh
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ord.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {ord.itemCount} SKUs ({ord.totalUnits} Units)
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          ord.status === "DISPATCHED"
                            ? "bg-emerald-600 text-white"
                            : ord.status === "PICKING"
                            ? "bg-blue-600 text-white"
                            : ord.status === "PACKED"
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {ord.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {ord.assignedWorker || "Unassigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      {ord.status !== "DISPATCHED" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2.5 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleAdvanceStatus(ord.id, ord.status)}
                        >
                          Advance Next <ChevronRight className="h-3 w-3" />
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched
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
