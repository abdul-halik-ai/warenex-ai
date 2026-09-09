import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function POST(request: NextRequest) {
  try {
    const { barcode, workerId, location } = await request.json();

    // Match against inventory or SKU
    const item = warehouseStore.inventory.find(i => i.sku.toLowerCase() === barcode.trim().toLowerCase());
    const prod = warehouseStore.products.find(p => p.sku.toLowerCase() === barcode.trim().toLowerCase());

    const result = item ? "SUCCESS" : "MISMATCH";

    const scan = warehouseStore.recordBarcodeScan({
      barcode,
      sku: item?.sku || barcode,
      workerId: workerId || "W-104",
      location: location || "Aisle A01",
      timestamp: new Date().toLocaleTimeString(),
      result
    });

    return NextResponse.json({
      success: true,
      scan,
      product: prod || null,
      inventory: item || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
