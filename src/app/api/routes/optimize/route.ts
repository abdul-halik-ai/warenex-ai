import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    const result = warehouseStore.calculatePickRoute(orderId || "ord-1042");
    return NextResponse.json({ success: true, route: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
