"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Droplets,
  QrCode,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // OpenCV Inspection Modal State
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [cvResult, setCvResult] = useState<any>(null);

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

  const handleOpenCvInspect = async (product: any) => {
    setSelectedProduct(product);
    setInspectModalOpen(true);
    setInspectLoading(true);
    setCvResult(null);

    // If SKU is SKU-2031 (Hydraulic Actuator Pack) or damaged sample, run damaged simulation
    const simulateDamage = product.sku === "SKU-2031" || product.sku === "SKU-1007";
    const sampleImg = simulateDamage ? "/samples/sample_damaged.jpg" : "/samples/sample_intact.jpg";

    try {
      const res = await fetch("/api/vision/opencv-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: sampleImg,
          sku: product.sku,
          productName: product.name,
          simulateDamage,
          zone: product.expectedZone || "Zone C"
        })
      });
      const data = await res.json();
      if (data.success) {
        setCvResult(data.analysis);
      } else {
        toast.error(data.error || "Inspection analysis failed");
      }
    } catch {
      toast.error("Failed to connect to OpenCV inspection engine");
    } finally {
      setInspectLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="h-6 w-6 text-blue-600" />
            Product Master & Restock Optimization
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Catalog master definitions with OpenCV 5.0 packaging damage inspection and automated Restock Priority Score (0-100).
          </p>
        </div>
      </div>

      {/* Restock Priority Queue */}
      <Card className="border-blue-200 bg-blue-50/20 shadow-sm dark:border-blue-900 dark:bg-blue-950/20">
        <CardHeader className="p-4 pb-2 border-b bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Deterministic Restock Priority Ranking
              </CardTitle>
              <CardDescription className="text-xs">
                Calculated live from demand velocity, pending order backlog, and supplier lead time.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs bg-white dark:bg-slate-900">
              {priorities.length} Products Monitored
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>Product / SKU</TableHead>
                <TableHead className="text-right">Current Stock</TableHead>
                <TableHead className="text-right">Demand Rate</TableHead>
                <TableHead>Location</TableHead>
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

      {/* Catalog Master Table with OpenCV Actions */}
      <Card className="border-slate-200 shadow-sm bg-white dark:bg-slate-950 dark:border-slate-800">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Product Catalog Master</CardTitle>
              <CardDescription className="text-xs">
                Assigned storage bays, packaging dimensions, and one-click OpenCV 5.0 optical quality inspections.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">
              OPENCV INSPECTOR READY
            </Badge>
          </div>
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
                <TableHead>Storage Bay</TableHead>
                <TableHead className="text-right">Reorder</TableHead>
                <TableHead className="text-right">Quality Check</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {products.map((prod) => (
                <TableRow key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell className="font-mono font-bold text-slate-900 dark:text-slate-100">{prod.sku}</TableCell>
                  <TableCell className="font-medium">{prod.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{prod.category}</TableCell>
                  <TableCell className="font-mono">${prod.cost?.toFixed(2)}</TableCell>
                  <TableCell className="font-mono font-semibold text-emerald-600">${prod.sellingPrice?.toFixed(2)}</TableCell>
                  <TableCell className="font-mono text-[11px]">{prod.expectedZone} / {prod.expectedRack}</TableCell>
                  <TableCell className="text-right font-mono">{prod.reorderPoint} u</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] gap-1.5 border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      onClick={() => handleOpenCvInspect(prod)}
                    >
                      <Sparkles className="h-3 w-3 text-emerald-600" />
                      Inspect (OpenCV)
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* OpenCV Product Inspection Modal */}
      <Dialog open={inspectModalOpen} onOpenChange={setInspectModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                OpenCV 5.0 Package Inspection &bull; {selectedProduct?.sku}
              </span>
              {cvResult && (
                <Badge
                  className={
                    cvResult.condition === "DAMAGED"
                      ? "bg-rose-600 text-white"
                      : "bg-emerald-600 text-white"
                  }
                >
                  {cvResult.condition}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedProduct?.name} &bull; Expected Bay: {selectedProduct?.expectedZone}
            </DialogDescription>
          </DialogHeader>

          {inspectLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="text-xs text-slate-500">Executing OpenCV Canny contour & deformation inference...</p>
            </div>
          ) : cvResult ? (
            <div className="space-y-4 py-2">
              {/* Image Preview with OpenCV HUD Overlay */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <img
                  src={cvResult.annotatedBase64 || cvResult.annotatedImageUrl}
                  alt="OpenCV Product Inspection"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Integrity Score</span>
                  <span
                    className={`text-lg font-bold ${
                      cvResult.structuralIntegrity >= 85
                        ? "text-emerald-600"
                        : cvResult.structuralIntegrity >= 70
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {cvResult.structuralIntegrity}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Corner Dent Depth</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                    {cvResult.metrics?.maxDefectDepthPx || 0} px
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Edge Tear Density</span>
                  <span className="text-lg font-bold text-indigo-600 font-mono">
                    {(cvResult.metrics?.edgeDensity * 100 || 0).toFixed(2)}%
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <span className="text-[10px] text-slate-500 uppercase block">Barcode Label</span>
                  <span className="text-xs font-bold text-emerald-600 mt-1 block">
                    {cvResult.metrics?.barcodeDetected ? "OK (READABLE)" : "N/A"}
                  </span>
                </div>
              </div>

              {/* Advice Message */}
              <div
                className={`p-3 rounded-lg border text-xs ${
                  cvResult.quarantineRequired
                    ? "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900"
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                  {cvResult.quarantineRequired ? (
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  {cvResult.quarantineRequired ? "Packaging Anomaly Detected" : "Quality Inspection Passed"}
                </div>
                <p className="text-[11px]">{cvResult.recommendedAction}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button size="sm" variant="outline" onClick={() => setInspectModalOpen(false)}>
                  Close
                </Button>
                {cvResult.quarantineRequired ? (
                  <Button
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
                    onClick={() => {
                      toast.success(`Pallet for ${selectedProduct.sku} dispatched to Quarantine Bay 01.`);
                      setInspectModalOpen(false);
                    }}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Quarantine Package
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                    onClick={() => {
                      toast.success(`Pallet for ${selectedProduct.sku} approved for putaway.`);
                      setInspectModalOpen(false);
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve for Putaway
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
