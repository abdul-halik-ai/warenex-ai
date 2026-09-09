import { NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    anomalies: warehouseStore.anomalies,
    unresolvedCount: warehouseStore.anomalies.filter(a => a.status === "UNRESOLVED").length
  });
}
