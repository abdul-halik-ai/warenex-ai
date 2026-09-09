import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function GET() {
  return NextResponse.json({
    alerts: warehouseStore.alerts,
    total: warehouseStore.alerts.length,
    open: warehouseStore.alerts.filter(a => a.status === "OPEN").length
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, alertId, recId } = await request.json();

    if (action === "RESOLVE_ALERT") {
      const ok = warehouseStore.resolveAlert(alertId);
      return NextResponse.json({ success: ok });
    }

    if (action === "EXECUTE_REC") {
      const ok = warehouseStore.executeRecommendation(recId);
      return NextResponse.json({ success: ok });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
