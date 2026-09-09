import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";
import { OrderStatus } from "@/lib/types";

export async function GET() {
  return NextResponse.json({
    orders: warehouseStore.orders
  });
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    const order = warehouseStore.orders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const prev = order.status;
    order.status = status as OrderStatus;

    if (status === "PICKED") order.pickedAt = new Date().toLocaleTimeString();
    if (status === "PACKED") order.packedAt = new Date().toLocaleTimeString();
    if (status === "DISPATCHED") order.dispatchedAt = new Date().toLocaleTimeString();

    warehouseStore.logAudit("USER", "ORDER_STATUS_UPDATE", "Order", order.orderNumber, prev, status);
    warehouseStore.notify();

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
