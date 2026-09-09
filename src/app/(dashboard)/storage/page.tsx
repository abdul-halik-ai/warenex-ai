"use client";

import { useState } from "react";
import { Layers, Box, CheckCircle2, AlertTriangle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StoragePage() {
  const [selectedZone, setSelectedZone] = useState("Zone B");

  const sampleBins = [
    { id: "B01-S1-01", sku: "SKU-1001", qty: 45, status: "OCCUPIED" },
    { id: "B01-S1-02", sku: "SKU-1001", qty: 65, status: "OCCUPIED" },
    { id: "B01-S2-01", sku: null, qty: 0, status: "EMPTY" },
    { id: "B01-S2-02", sku: null, qty: 0, status: "EMPTY" },
    { id: "B02-S1-01", sku: "SKU-2045", qty: 34, status: "LOW_STOCK" },
    { id: "B02-S1-02", sku: "SKU-3011", qty: 68, status: "OCCUPIED" },
    { id: "B02-S2-01", sku: null, qty: 0, status: "EMPTY" },
    { id: "B02-S2-02", sku: "SKU-5082", qty: 18, status: "LOW_STOCK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" />
            Storage Architecture & High-Bay Bins
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hierarchical physical layout: Warehouses → Zones → Racks → Shelves → Bins.
          </p>
        </div>
        <div className="flex gap-2">
          {["Zone A", "Zone B", "Zone C", "Cold Storage", "Vault"].map(z => (
            <Button
              key={z}
              size="sm"
              variant={selectedZone === z ? "default" : "outline"}
              onClick={() => setSelectedZone(z)}
              className={`text-xs h-8 ${selectedZone === z ? "bg-blue-600 text-white" : ""}`}
            >
              {z}
            </Button>
          ))}
        </div>
      </div>

      {/* Racks & Bins Grid */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold">{selectedZone} High-Bay Racking Matrix</CardTitle>
          <CardDescription className="text-xs">
            Individual bin slot occupancy and SKU assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sampleBins.map((bin) => {
              const isEmpty = bin.status === "EMPTY";
              const isLow = bin.status === "LOW_STOCK";

              return (
                <div
                  key={bin.id}
                  className={`p-4 rounded-lg border-2 text-xs flex flex-col justify-between min-h-[110px] ${
                    isEmpty
                      ? "border-dashed border-slate-300 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400"
                      : isLow
                      ? "border-amber-300 bg-amber-50/40 dark:bg-amber-950/20"
                      : "border-slate-200 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{bin.id}</span>
                    <Badge
                      className={`text-[9px] px-1 py-0 ${
                        isEmpty
                          ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          : isLow
                          ? "bg-amber-500 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {bin.status}
                    </Badge>
                  </div>

                  {!isEmpty ? (
                    <div className="my-1">
                      <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">{bin.sku}</div>
                      <div className="text-[11px] text-slate-500">Stored Qty: {bin.qty} units</div>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px]">Available Slot</div>
                  )}

                  <div className="text-[10px] text-slate-400 border-t pt-1">
                    {isEmpty ? "Ready for Putaway" : "Barcoded Shelf Position"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
