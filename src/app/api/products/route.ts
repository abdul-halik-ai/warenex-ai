import { NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    products: warehouseStore.products,
    restockPriorities: warehouseStore.calculateRestockPriorities()
  });
}
