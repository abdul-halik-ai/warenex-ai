import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status");

  let items = warehouseStore.inventory;

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      i =>
        i.sku.toLowerCase().includes(q) ||
        i.productName.toLowerCase().includes(q) ||
        i.zone.toLowerCase().includes(q)
    );
  }

  if (statusFilter && statusFilter !== "ALL") {
    items = items.filter(i => i.status === statusFilter);
  }

  return NextResponse.json({
    items,
    total: items.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "ADJUST") {
      const { id, quantity, reason, worker } = body;
      const updated = warehouseStore.updateStock(id, Number(quantity), reason, worker);
      if (!updated) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "TRANSFER") {
      const { id, zone, rack, shelf, bin, worker } = body;
      const updated = warehouseStore.transferInventory(id, zone, rack, shelf, bin, worker);
      if (!updated) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, item: updated });
    }

    if (action === "ADD_PRODUCT") {
      const { sku, name, category, cost, sellingPrice, weight, dimensions, expectedZone, expectedRack, expectedShelf, expectedBin, reorderPoint, demandRate } = body;
      const newProduct = warehouseStore.addProduct({
        sku,
        name,
        category: category || "General Merchandise",
        batchNumber: `BAT-${Date.now().toString().slice(-4)}`,
        supplier: "Global Warehouse Logistics",
        cost: Number(cost) || 50,
        sellingPrice: Number(sellingPrice) || 100,
        weight: Number(weight) || 1,
        dimensions: dimensions || "20x20x20 cm",
        status: "ACTIVE",
        expectedZone: expectedZone || "Zone A (Fast Moving)",
        expectedRack: expectedRack || "Rack A01",
        expectedShelf: expectedShelf || "Shelf 1",
        expectedBin: expectedBin || "Bin 01",
        reorderPoint: Number(reorderPoint) || 20,
        demandRate: Number(demandRate) || 5
      });
      return NextResponse.json({ success: true, product: newProduct });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
