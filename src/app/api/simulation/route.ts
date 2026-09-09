import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    simulation: warehouseStore.simulation,
    stats: {
      totalMovements: warehouseStore.movements.length,
      rfidEvents: warehouseStore.rfidEvents.length,
      barcodeScans: warehouseStore.barcodeScans.length
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, speed } = await request.json();

    if (action === "STEP") {
      const event = warehouseStore.simulateStep();
      return NextResponse.json({ success: true, event, simulation: warehouseStore.simulation });
    }

    if (action === "TOGGLE") {
      warehouseStore.simulation.isRunning = !warehouseStore.simulation.isRunning;
      warehouseStore.notify();
      return NextResponse.json({ success: true, isRunning: warehouseStore.simulation.isRunning });
    }

    if (action === "SET_SPEED") {
      warehouseStore.simulation.speed = speed;
      warehouseStore.notify();
      return NextResponse.json({ success: true, speed: warehouseStore.simulation.speed });
    }

    if (action === "INJECT_ANOMALY") {
      // Injects a live misplaced event
      const randTag = `RFID-${Math.floor(100000 + Math.random() * 900000)}`;
      warehouseStore.recordRfidEvent({
        tagId: randTag,
        sku: "SKU-3011", // Titanium bearing
        readerId: "R-ZONE-C-02",
        zone: "Zone C (Industrial & Heavy)",
        timestamp: new Date().toLocaleTimeString(),
        signalStrength: -38,
        eventType: "ENTER"
      });
      return NextResponse.json({ success: true, message: "Injected unexpected RFID event into Zone C." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
