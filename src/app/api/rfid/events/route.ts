import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    events: warehouseStore.rfidEvents
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = warehouseStore.recordRfidEvent({
      tagId: body.tagId || `RFID-${Math.floor(100000 + Math.random() * 900000)}`,
      sku: body.sku || "SKU-1007",
      readerId: body.readerId || "ZONE-B-R03",
      zone: body.zone || "Zone B (Consumer Electronics)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      signalStrength: body.signalStrength || -42,
      eventType: body.eventType || "ENTER"
    });

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
