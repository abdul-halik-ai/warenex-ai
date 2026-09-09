"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Layers,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
      setPriorities(data.restockPriorities || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-600" />
            Product Master & Restock Optimization
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Catalog master definitions with automated Restock Priority Score (0-100) based on lead times and demand rates.
          </p>
        </div>
      </div>

      {/* Restock Priority Queue */}
      <Card className="border-blue-200 bg-blue-50/20 shadow-sm">
        <CardHeader className="p-4 pb-2 border-b bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                AI Restock Priority Scoring (Lead Time & Demand Model)
              </CardTitle>
              <CardDescription className="text-xs">
                Items ranked by stockout risk, pending orders, and reorder point deficits
              </CardDescription>
            </div>
            <Badge className="bg-blue-600 text-white text-xs">REORDER ALGORITHM ACTIVE</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white dark:bg-slate-950">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>SKU & Product</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Demand Rate</TableHead>
                <TableHead>Assigned Bay</TableHead>
                <TableHead className="text-center">Priority Score</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {priorities.map((item) => {
                const isCrit = item.urgency === "CRITICAL";
                const isHigh = item.urgency === "HIGH";

                return (
                  <TableRow key={item.sku} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <TableCell>
                      <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">{item.sku}</div>
                      <div className="text-[11px] text-slate-500">{item.productName}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">{item.currentStock} u</TableCell>
                    <TableCell className="text-right font-mono text-slate-600">{item.demandRate} u/day</TableCell>
                    <TableCell className="text-[11px] text-slate-600 dark:text-slate-400">{item.location}</TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      <span className={`text-sm ${isCrit ? "text-rose-600" : isHigh ? "text-amber-600" : "text-slate-600"}`}>
                        {item.priorityScore}/100
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[9px] ${
                          isCrit
                            ? "bg-rose-600 text-white"
                            : isHigh
                            ? "bg-amber-600 text-white"
                            : "bg-slate-600 text-white"
                        }`}
                      >
                        {item.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={isCrit ? "default" : "outline"}
                        className={`h-7 text-[11px] px-2.5 ${isCrit ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`}
                        onClick={() => toast.success(`Purchase Order generated for ${item.sku}`)}
                      >
                        Generate PO
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Catalog Master Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold">Product Catalog Master</CardTitle>
          <CardDescription className="text-xs">
            Assigned expected zones, packaging dimensions, and wholesale unit costs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Expected Storage Bay</TableHead>
                <TableHead className="text-right">Reorder Point</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {products.map((prod) => (
                <TableRow key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">{prod.sku}</TableCell>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{prod.category}</TableCell>
                  <TableCell className="font-mono">${prod.cost?.toFixed(2)}</TableCell>
                  <TableCell className="font-mono font-semibold text-emerald-600">${prod.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-[11px]">{prod.expectedZone} / {prod.expectedRack}</TableCell>
                  <TableCell className="text-right font-mono">{prod.reorderPoint} units</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
