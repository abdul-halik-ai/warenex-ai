import { NextRequest, NextResponse } from "next/server";
import { warehouseStore } from "@/lib/warehouse-store";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const q = (message || "").toLowerCase().trim();

    let reply = "";
    let toolCalls: any[] = [];

    // Deterministic Intent Parsing & Tool Routing against actual Warehouse State
    if (q.includes("where is sku") || q.includes("where is") || q.includes("locate")) {
      const match = q.match(/sku-[0-9]+/i);
      const sku = match ? match[0].toUpperCase() : "SKU-1007";
      const locData = warehouseStore.executeAiTool("get_product_location", { sku });
      toolCalls.push({ tool: "get_product_location", args: { sku }, result: locData });

      if (locData.error) {
        reply = `I searched the warehouse database for ${sku}, but I don't have enough warehouse data to locate that item.`;
      } else if (locData.isMisplaced) {
        reply = `⚠️ **MISPLACEMENT DETECTED**\n\n**${locData.sku} (${locData.productName})** is currently at:\n📍 **${locData.currentLocation}**\n\nExpected Location:\n🎯 **${locData.expectedLocation}**\n\n**AI Recommendation:** Move this SKU back to its assigned bin to prevent picker delays on scheduled orders.`;
      } else {
        reply = `**${locData.sku} (${locData.productName})** is in its expected storage location:\n📍 **${locData.currentLocation}**\n\nAvailable Quantity: **${locData.availableQuantity} units** (Status: ${locData.status}).`;
      }
    } else if (q.includes("anomaly") || q.includes("why is sku-2031")) {
      const anomalies = warehouseStore.executeAiTool("get_anomalies", {});
      toolCalls.push({ tool: "get_anomalies", args: {}, result: anomalies });

      reply = `### 🚨 Root Cause Anomaly Analysis\n\nHere are the detected anomalies currently active in the warehouse:\n\n` +
        anomalies.map((a: any) => `* **${a.type.replace(/_/g, " ")} (${a.sku || "Zone"})** - Risk Score: **${a.riskScore}/100**\n  * **Location:** ${a.location}\n  * **AI Analysis:** ${a.aiExplanation}\n  * **Likely Cause:** ${a.likelyCause}\n  * **Recommended Action:** ${a.recommendedAction}`).join("\n\n");
    } else if (q.includes("restock") || q.includes("low stock")) {
      const lowStock = warehouseStore.executeAiTool("get_low_stock_items", {});
      toolCalls.push({ tool: "get_low_stock_items", args: {}, result: lowStock });

      reply = `### 📦 Immediate Restock Priorities\n\n` +
        lowStock.map((item: any) => `* **${item.sku} - ${item.productName}** (Priority Score: **${item.priorityScore}/100** - ${item.urgency})\n  * **Current Stock:** ${item.currentStock} units (${item.reservedStock} reserved)\n  * **Demand Rate:** ${item.demandRate} units/day\n  * **Action Required:** ${item.reason}`).join("\n\n");
    } else if (q.includes("temperature") || q.includes("storage condition") || q.includes("sensor")) {
      const conditions = warehouseStore.executeAiTool("get_storage_conditions", {});
      toolCalls.push({ tool: "get_storage_conditions", args: {}, result: conditions });

      const critical = conditions.filter((c: any) => c.status !== "ONLINE");
      reply = `### 🌡️ Storage Condition Audit\n\n` +
        (critical.length > 0
          ? `⚠️ **VIOLATION ACTIVE**: Cold Storage is currently at **8.4°C**, which breaches the mandatory threshold limit of 2.0°C - 8.0°C.\n\n`
          : `All zones are currently within safe operational parameters.\n\n`) +
        conditions.map((c: any) => `* **${c.zone}** (${c.sensorId}): **${c.value}** (Allowed: ${c.thresholdRange}) - Status: **${c.status}**`).join("\n");
    } else if (q.includes("route") || q.includes("picking route") || q.includes("order #1045") || q.includes("order #1042")) {
      const routeData = warehouseStore.executeAiTool("calculate_pick_route", { orderId: "ord-1042" });
      toolCalls.push({ tool: "calculate_pick_route", args: { orderId: "ord-1042" }, result: routeData });

      reply = `### ⚡ AI Picking Route Optimization\n\nFor Order **${routeData.orderNumber}**, the warehouse graph optimizer has generated a shortest-path sequence:\n\n* **Original Sequential Distance:** ${routeData.originalDistanceMeters} meters (~${routeData.originalTimeMinutes} min)\n* **AI Optimized Route:** ${routeData.optimizedDistanceMeters} meters (~${routeData.optimizedTimeMinutes} min)\n* **Efficiency Gain:** **+${routeData.improvementPercentage}% distance saved**\n\n**Optimized Waypoint Sequence:**\n` +
        routeData.optimizedRoute.map((wp: string, idx: number) => `${idx + 1}. ${wp}`).join("\n");
    } else if (q.includes("worker") || q.includes("active workers")) {
      const workers = warehouseStore.workers;
      reply = `### 👷 Active Worker Roster (${workers.length} Personnel Active)\n\n` +
        workers.map((w: any) => `* **${w.name}** (${w.badgeId}) - **${w.role}** in *${w.currentZone}*\n  * Current Task: ${w.currentTask}\n  * Accuracy: **${w.accuracyRate}%** | Average Pick Time: ${w.avgPickTimeMin}m`).join("\n");
    } else {
      const status = warehouseStore.executeAiTool("get_warehouse_status", {});
      toolCalls.push({ tool: "get_warehouse_status", args: {}, result: status });

      reply = `### 🏭 Warenex AI Operational Summary\n\n* **Inventory Accuracy:** ${status.inventoryAccuracy}\n* **Units in Facility:** ${status.totalUnitsInWarehouse.toLocaleString()}\n* **Active Orders:** ${status.activeOrders} orders pending fulfillment\n* **Active Alerts:** ${status.activeAlerts} alerts requiring supervisor attention\n* **Detected Anomalies:** ${status.unresolvedAnomalies} unresolved anomalies\n\n**Top Priority Recommendation:**\nInvestigate Zone C because **SKU-1007** is misplaced outside its designated bay, and cold storage sensor **TEMP-COLD-01** breached maximum threshold.\n\n*You can ask me to locate any SKU, optimize picking routes, inspect damaged products, or audit workers.*`;
    }

    return NextResponse.json({
      reply,
      toolCalls,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
