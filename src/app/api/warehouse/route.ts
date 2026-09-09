import { NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  const status = warehouseStore.executeAiTool("get_warehouse_status", {});
  return NextResponse.json({
    warehouses: warehouseStore.warehouses,
    zones: warehouseStore.zones,
    stats: status,
    activeAlerts: warehouseStore.alerts.filter(a => a.status === "OPEN"),
    recentMovements: warehouseStore.movements.slice(0, 8),
    recommendations: warehouseStore.aiRecommendations,
    workers: warehouseStore.workers,
    simulation: warehouseStore.simulation
  });
}
