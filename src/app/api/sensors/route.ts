import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    sensors: warehouseStore.sensors
  });
}

export async function POST(request: NextRequest) {
  try {
    const { sensorId, value } = await request.json();
    warehouseStore.updateSensorReading(sensorId, Number(value));
    return NextResponse.json({ success: true, sensor: warehouseStore.sensors.find(s => s.sensorId === sensorId) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
