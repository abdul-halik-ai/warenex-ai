"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  SlidersHorizontal,
  Download,
  Box,
  Layers,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modals
  const [transferOpen, setTransferOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [newQty, setNewQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [toZone, setToZone] = useState("");
  const [toRack, setToRack] = useState("");
  const [toShelf, setToShelf] = useState("");
  const [toBin, setToBin] = useState("");

  // Add Product form state
  const [addSku, setAddSku] = useState("");
  const [addName, setAddName] = useState("");
  const [addCat, setAddCat] = useState("Sensors & Robotics");
  const [addPrice, setAddPrice] = useState("250");
  const [addZone, setAddZone] = useState("Zone A (Fast Moving)");

  const fetchInventory = async () => {
    try {
      const url = `/api/inventory?q=${encodeURIComponent(search)}&status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search, statusFilter]);

  const handleStockAdjustment = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADJUST",
          id: selectedItem.id,
          quantity: newQty,
          reason: adjustReason || "Cycle count reconciliation",
          worker: "Manager"
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Stock for ${selectedItem.sku} adjusted to ${newQty} units`);
        setAdjustOpen(false);
        fetchInventory();
      }
    } catch {
      toast.error("Adjustment failed");
    }
  };

  const handleTransfer = async () => {
    if (!selectedItem) return;
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TRANSFER",
          id: selectedItem.id,
          zone: toZone || selectedItem.zone,
          rack: toRack || "Rack A01",
          shelf: toShelf || "Shelf 1",
          bin: toBin || "Bin 01",
          worker: "Elena Rostova"
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Transferred ${selectedItem.sku} to ${toZone || selectedItem.zone}`);
        setTransferOpen(false);
        fetchInventory();
      }
    } catch {
      toast.error("Transfer failed");
    }
  };

  const handleAddProduct = async () => {
    if (!addSku || !addName) {
      toast.error("Please fill SKU and Product Name");
      return;
    }
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_PRODUCT",
          sku: addSku.toUpperCase(),
          name: addName,
          category: addCat,
          sellingPrice: Number(addPrice),
          expectedZone: addZone
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Product ${addSku} added to catalog`);
        setAddOpen(false);
        fetchInventory();
      }
    } catch {
      toast.error("Failed to add product");
    }
  };

  const exportCSV = () => {
    const headers = ["SKU", "Product Name", "Category", "Quantity", "Available", "Reserved", "Status", "Zone", "Rack", "Bin"];
    const rows = items.map(i => [
      i.sku,
      `"${i.productName}"`,
      i.category,
      i.quantity,
      i.availableQuantity,
      i.reservedQuantity,
      i.status,
      `"${i.zone}"`,
      i.rack,
      i.bin
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `warenex_inventory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success("Inventory exported to CSV");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time stock master across racks, bins, and quarantine zones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1 text-xs">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Filter by SKU, name, or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs bg-white dark:bg-slate-950"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={(val: any) => val && setStatusFilter(val)}>
                <SelectTrigger className="w-[180px] text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                  <SelectItem value="RESERVED">RESERVED</SelectItem>
                  <SelectItem value="DAMAGED">DAMAGED</SelectItem>
                  <SelectItem value="QUARANTINED">QUARANTINED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
              <TableRow className="text-[11px]">
                <TableHead>SKU & Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total Qty</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs divide-y">
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <TableCell className="font-medium">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{item.sku}</span>
                      {item.sku === "SKU-1007" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-[9px] px-1 py-0">
                          MISPLACED
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">{item.productName}</div>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">{item.category}</TableCell>
                  <TableCell className="text-right font-mono font-bold">{item.quantity}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-600">{item.availableQuantity}</TableCell>
                  <TableCell className="text-right font-mono text-slate-500">{item.reservedQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[9px] px-1.5 py-0 ${
                        item.status === "DAMAGED"
                          ? "bg-rose-500 text-white"
                          : item.status === "AVAILABLE"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-600 text-white"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[11px]">
                    <span className="font-semibold">{item.zone.split(" ")[0]}</span> / {item.rack} / {item.bin}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] px-2"
                      onClick={() => {
                        setSelectedItem(item);
                        setToZone(item.zone);
                        setTransferOpen(true);
                      }}
                    >
                      Transfer
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 text-[11px] px-2"
                      onClick={() => {
                        setSelectedItem(item);
                        setNewQty(item.quantity);
                        setAdjustOpen(true);
                      }}
                    >
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Transfer Inventory: {selectedItem?.sku}</DialogTitle>
            <DialogDescription className="text-xs">
              Relocate SKU to another zone, rack, or bin. System will generate an immutable movement event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>Target Zone</Label>
              <Select value={toZone} onValueChange={(val: any) => val && setToZone(val)}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone A (Fast Moving)">Zone A (Fast Moving)</SelectItem>
                  <SelectItem value="Zone B (Consumer Electronics)">Zone B (Consumer Electronics)</SelectItem>
                  <SelectItem value="Zone C (Industrial & Heavy)">Zone C (Industrial & Heavy)</SelectItem>
                  <SelectItem value="Cold Storage (Pharmaceutical / Perishable)">Cold Storage</SelectItem>
                  <SelectItem value="High Value Storage Vault">High Value Storage Vault</SelectItem>
                  <SelectItem value="Returns & Quarantine">Returns & Quarantine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Target Rack</Label>
                <Input value={toRack} onChange={(e) => setToRack(e.target.value)} placeholder="Rack B04" className="text-xs" />
              </div>
              <div>
                <Label>Target Shelf</Label>
                <Input value={toShelf} onChange={(e) => setToShelf(e.target.value)} placeholder="Shelf 3" className="text-xs" />
              </div>
              <div>
                <Label>Target Bin</Label>
                <Input value={toBin} onChange={(e) => setToBin(e.target.value)} placeholder="Bin 01" className="text-xs" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setTransferOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleTransfer} className="bg-blue-600 hover:bg-blue-700 text-white">Execute Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Modal */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Stock Adjustment: {selectedItem?.sku}</DialogTitle>
            <DialogDescription className="text-xs">
              Reconcile physical stock count. Reason is required for compliance audit logging.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label>New Quantity</Label>
              <Input
                type="number"
                value={newQty}
                onChange={(e) => setNewQty(Number(e.target.value))}
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label>Audit Reason</Label>
              <Input
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g., Physical cycle count variance, damaged carton removed"
                className="text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAdjustOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleStockAdjustment} className="bg-blue-600 hover:bg-blue-700 text-white">Confirm Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add New Product to Catalog</DialogTitle>
            <DialogDescription className="text-xs">
              Create product master definition with deterministic expected storage zones.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>SKU Code</Label>
                <Input value={addSku} onChange={(e) => setAddSku(e.target.value)} placeholder="SKU-9901" className="text-xs font-mono" />
              </div>
              <div>
                <Label>Unit Price ($)</Label>
                <Input value={addPrice} onChange={(e) => setAddPrice(e.target.value)} type="number" className="text-xs font-mono" />
              </div>
            </div>
            <div>
              <Label>Product Name</Label>
              <Input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Precision Micro-Actuator 24V" className="text-xs" />
            </div>
            <div>
              <Label>Assigned Storage Zone</Label>
              <Select value={addZone} onValueChange={(val: any) => val && setAddZone(val)}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zone A (Fast Moving)">Zone A (Fast Moving)</SelectItem>
                  <SelectItem value="Zone B (Consumer Electronics)">Zone B (Consumer Electronics)</SelectItem>
                  <SelectItem value="Zone C (Industrial & Heavy)">Zone C (Industrial & Heavy)</SelectItem>
                  <SelectItem value="Cold Storage (Pharmaceutical / Perishable)">Cold Storage</SelectItem>
                  <SelectItem value="High Value Storage Vault">High Value Storage Vault</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700 text-white">Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
