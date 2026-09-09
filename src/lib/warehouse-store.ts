import {
  Warehouse,
  Zone,
  Product,
  InventoryItem,
  InventoryMovement,
  Order,
  Worker,
  Sensor,
  RfidEvent,
  BarcodeScan,
  Alert,
  Anomaly,
  PickRouteOptimization,
  RestockPriority,
  AiRecommendation,
  AuditLog,
  SimulationState,
  VisionAnalysisResult,
  DamageType
} from "./types";

class WarehouseStore {
  warehouses: Warehouse[] = [];
  zones: Zone[] = [];
  products: Product[] = [];
  inventory: InventoryItem[] = [];
  movements: InventoryMovement[] = [];
  orders: Order[] = [];
  workers: Worker[] = [];
  sensors: Sensor[] = [];
  rfidEvents: RfidEvent[] = [];
  barcodeScans: BarcodeScan[] = [];
  alerts: Alert[] = [];
  anomalies: Anomaly[] = [];
  auditLogs: AuditLog[] = [];
  aiRecommendations: AiRecommendation[] = [];
  visionAnalyses: VisionAnalysisResult[] = [];
  simulation: SimulationState = {
    isRunning: false,
    speed: 1,
    eventsGenerated: 1420,
    misplacementProbability: 0.05,
    damageProbability: 0.03,
    rfidFailureProbability: 0.02,
    stockMismatchProbability: 0.04,
    tempViolationProbability: 0.02,
    lastTickTime: new Date().toISOString()
  };

  private subscribers: Array<() => void> = [];

  constructor() {
    this.seedInitialData();
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    for (const cb of this.subscribers) {
      try {
        cb();
      } catch (e) {
        console.error("Subscriber error", e);
      }
    }
  }

  private seedInitialData() {
    // 1. Warehouses
    this.warehouses = [
      {
        id: "WH-01",
        name: "Warenex Central Automated Fulfillment (WH-01)",
        location: "Chicago Logistics Gateway, IL",
        totalCapacity: 50000,
        currentOccupancy: 38240
      },
      {
        id: "WH-02",
        name: "Warenex West Coast Gateway (WH-02)",
        location: "Ontario, CA",
        totalCapacity: 35000,
        currentOccupancy: 24100
      },
      {
        id: "WH-03",
        name: "Warenex Cold-Chain Hub (WH-03)",
        location: "Dallas-Fort Worth, TX",
        totalCapacity: 25000,
        currentOccupancy: 19800
      }
    ];

    // 2. Zones (9 Core + Extensions)
    this.zones = [
      {
        id: "zone-rcv",
        warehouseId: "WH-01",
        name: "Receiving Dock",
        code: "RECEIVING",
        type: "Intake / Inbound Verification",
        capacity: 4000,
        occupied: 1850,
        temperature: 20.4,
        humidity: 46,
        activeWorkers: 4,
        inventoryCount: 1850,
        alertCount: 0,
        anomalyCount: 0,
        status: "NORMAL",
        gridX: 50,
        gridY: 50,
        width: 180,
        height: 120,
        color: "#3b82f6"
      },
      {
        id: "zone-a",
        warehouseId: "WH-01",
        name: "Zone A (Fast Moving)",
        code: "ZONE_A",
        type: "High Velocity Picking",
        capacity: 12000,
        occupied: 9600,
        temperature: 21.2,
        humidity: 44,
        activeWorkers: 7,
        inventoryCount: 9600,
        alertCount: 1,
        anomalyCount: 1,
        status: "NORMAL",
        gridX: 260,
        gridY: 50,
        width: 220,
        height: 160,
        color: "#10b981"
      },
      {
        id: "zone-b",
        warehouseId: "WH-01",
        name: "Zone B (Consumer Electronics)",
        code: "ZONE_B",
        type: "Electronics & Tech Racks",
        capacity: 10000,
        occupied: 8420,
        temperature: 20.8,
        humidity: 42,
        activeWorkers: 5,
        inventoryCount: 8420,
        alertCount: 1,
        anomalyCount: 1,
        status: "WARNING",
        gridX: 510,
        gridY: 50,
        width: 220,
        height: 160,
        color: "#f59e0b"
      },
      {
        id: "zone-c",
        warehouseId: "WH-01",
        name: "Zone C (Industrial & Heavy)",
        code: "ZONE_C",
        type: "Heavy Duty Pallet Racks",
        capacity: 11000,
        occupied: 10010,
        temperature: 22.0,
        humidity: 48,
        activeWorkers: 6,
        inventoryCount: 10010,
        alertCount: 2,
        anomalyCount: 2,
        status: "WARNING",
        gridX: 760,
        gridY: 50,
        width: 200,
        height: 160,
        color: "#f97316"
      },
      {
        id: "zone-cold",
        warehouseId: "WH-01",
        name: "Cold Storage (Pharmaceutical / Perishable)",
        code: "COLD_STORAGE",
        type: "Temperature Controlled (2°C - 8°C)",
        capacity: 3500,
        occupied: 2840,
        temperature: 8.4, // Warning! Exceeds 8.0°C
        humidity: 68,
        activeWorkers: 2,
        inventoryCount: 2840,
        alertCount: 2,
        anomalyCount: 1,
        status: "CRITICAL",
        gridX: 50,
        gridY: 200,
        width: 180,
        height: 170,
        color: "#06b6d4"
      },
      {
        id: "zone-highval",
        warehouseId: "WH-01",
        name: "High Value Storage Vault",
        code: "HIGH_VALUE",
        type: "Biometric & RFID Secure Enclosure",
        capacity: 2500,
        occupied: 1720,
        temperature: 19.5,
        humidity: 40,
        activeWorkers: 1,
        inventoryCount: 1720,
        alertCount: 1,
        anomalyCount: 1,
        status: "WARNING",
        gridX: 260,
        gridY: 240,
        width: 220,
        height: 130,
        color: "#8b5cf6"
      },
      {
        id: "zone-pack",
        warehouseId: "WH-01",
        name: "Packing Stations 1-8",
        code: "PACKING",
        type: "Automated Weigh & Seal Line",
        capacity: 3000,
        occupied: 1450,
        temperature: 21.5,
        humidity: 45,
        activeWorkers: 8,
        inventoryCount: 1450,
        alertCount: 0,
        anomalyCount: 0,
        status: "NORMAL",
        gridX: 510,
        gridY: 240,
        width: 220,
        height: 130,
        color: "#6366f1"
      },
      {
        id: "zone-disp",
        warehouseId: "WH-01",
        name: "Dispatch Bay 1-6",
        code: "DISPATCH",
        type: "Outbound Carrier Loading Docks",
        capacity: 3000,
        occupied: 1850,
        temperature: 20.1,
        humidity: 47,
        activeWorkers: 5,
        inventoryCount: 1850,
        alertCount: 0,
        anomalyCount: 0,
        status: "NORMAL",
        gridX: 760,
        gridY: 240,
        width: 200,
        height: 130,
        color: "#14b8a6"
      },
      {
        id: "zone-ret",
        warehouseId: "WH-01",
        name: "Returns & Quarantine",
        code: "RETURNS",
        type: "Inspection & Damage Hold",
        capacity: 1000,
        occupied: 500,
        temperature: 20.7,
        humidity: 45,
        activeWorkers: 2,
        inventoryCount: 500,
        alertCount: 1,
        anomalyCount: 1,
        status: "NORMAL",
        gridX: 50,
        gridY: 400,
        width: 280,
        height: 100,
        color: "#ec4899"
      }
    ];

    // 3. Products
    this.products = [
      {
        id: "prod-1001",
        sku: "SKU-1001",
        name: "Industrial LiDAR Precision Sensor L9",
        category: "Sensors & Robotics",
        batchNumber: "BAT-2026-901",
        serialNumber: "SN-LID-4890",
        supplier: "OpticWave Robotics GmbH",
        cost: 320.00,
        sellingPrice: 580.00,
        weight: 1.2,
        dimensions: "15x12x10 cm",
        status: "ACTIVE",
        expectedZone: "Zone B (Consumer Electronics)",
        expectedRack: "Rack B02",
        expectedShelf: "Shelf 2",
        expectedBin: "Bin 04",
        reorderPoint: 40,
        demandRate: 14
      },
      {
        id: "prod-1007",
        sku: "SKU-1007",
        name: "Wireless Industrial Barcode Scanner Rugged",
        category: "Warehouse Equipment",
        batchNumber: "BAT-2026-112",
        serialNumber: "SN-SCN-7812",
        supplier: "ScanTech Industrial",
        cost: 140.00,
        sellingPrice: 275.00,
        weight: 0.8,
        dimensions: "20x8x12 cm",
        status: "ACTIVE",
        expectedZone: "Zone B (Consumer Electronics)",
        expectedRack: "Rack B04",
        expectedShelf: "Shelf 3",
        expectedBin: "Bin 01",
        reorderPoint: 30,
        demandRate: 8
      },
      {
        id: "prod-1042",
        sku: "SKU-1042",
        name: "Ultra-Cold Pharmaceutical Vials Grade A",
        category: "Healthcare & Pharma",
        batchNumber: "BAT-PHARM-883",
        supplier: "BioGenesis Corp",
        cost: 850.00,
        sellingPrice: 1450.00,
        weight: 2.5,
        dimensions: "25x25x20 cm",
        status: "ACTIVE",
        expectedZone: "Cold Storage (Pharmaceutical / Perishable)",
        expectedRack: "Cold Rack C-01",
        expectedShelf: "Shelf 1",
        expectedBin: "Bin 02",
        reorderPoint: 50,
        demandRate: 18
      },
      {
        id: "prod-2031",
        sku: "SKU-2031",
        name: "Automotive High-Torque Electric Servo Unit",
        category: "Automotive Parts",
        batchNumber: "BAT-AUTO-409",
        supplier: "Apex Motors Engineering",
        cost: 410.00,
        sellingPrice: 720.00,
        weight: 4.8,
        dimensions: "35x25x20 cm",
        status: "ACTIVE",
        expectedZone: "Zone C (Industrial & Heavy)",
        expectedRack: "Rack C03",
        expectedShelf: "Shelf 2",
        expectedBin: "Bin 05",
        reorderPoint: 45,
        demandRate: 22
      },
      {
        id: "prod-2045",
        sku: "SKU-2045",
        name: "Commercial Drone Propeller Module Quad",
        category: "Aerospace Logistics",
        batchNumber: "BAT-DRN-201",
        supplier: "SkyLift Dynamics",
        cost: 75.00,
        sellingPrice: 160.00,
        weight: 0.5,
        dimensions: "30x10x5 cm",
        status: "ACTIVE",
        expectedZone: "Zone A (Fast Moving)",
        expectedRack: "Rack A01",
        expectedShelf: "Shelf 3",
        expectedBin: "Bin 08",
        reorderPoint: 80,
        demandRate: 35
      },
      {
        id: "prod-3011",
        sku: "SKU-3011",
        name: "Titanium Precision Bearing Ring Set",
        category: "Industrial Hardware",
        batchNumber: "BAT-TITAN-100",
        supplier: "Vanguard Precision Bearings",
        cost: 195.00,
        sellingPrice: 340.00,
        weight: 3.2,
        dimensions: "18x18x8 cm",
        status: "ACTIVE",
        expectedZone: "High Value Storage Vault",
        expectedRack: "Vault Rack V-01",
        expectedShelf: "Shelf 2",
        expectedBin: "Bin 03",
        reorderPoint: 25,
        demandRate: 9
      },
      {
        id: "prod-4009",
        sku: "SKU-4009",
        name: "Heavy-Duty Pallet Jack Wheel Assembly",
        category: "Warehouse Equipment",
        batchNumber: "BAT-WHL-552",
        supplier: "Tork Heavy Dynamics",
        cost: 65.00,
        sellingPrice: 120.00,
        weight: 6.4,
        dimensions: "25x25x15 cm",
        status: "ACTIVE",
        expectedZone: "Zone C (Industrial & Heavy)",
        expectedRack: "Rack C05",
        expectedShelf: "Shelf 1",
        expectedBin: "Bin 02",
        reorderPoint: 50,
        demandRate: 15
      },
      {
        id: "prod-5082",
        sku: "SKU-5082",
        name: "Thermal Thermal-Imaging Security Camera Unit",
        category: "Electronics & Tech",
        batchNumber: "BAT-CAM-801",
        supplier: "VisionGuard Systems",
        cost: 580.00,
        sellingPrice: 990.00,
        weight: 1.8,
        dimensions: "22x15x12 cm",
        status: "ACTIVE",
        expectedZone: "High Value Storage Vault",
        expectedRack: "Vault Rack V-02",
        expectedShelf: "Shelf 1",
        expectedBin: "Bin 04",
        reorderPoint: 20,
        demandRate: 6
      }
    ];

    // 4. Inventory Records with actual vs expected positions (Misplacements included!)
    this.inventory = [
      {
        id: "inv-01",
        productId: "prod-1001",
        sku: "SKU-1001",
        productName: "Industrial LiDAR Precision Sensor L9",
        category: "Sensors & Robotics",
        quantity: 110,
        reservedQuantity: 20,
        availableQuantity: 90,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "Zone B (Consumer Electronics)",
        rack: "Rack B02",
        shelf: "Shelf 2",
        bin: "Bin 04",
        batchNumber: "BAT-2026-901",
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "inv-02",
        productId: "prod-1007",
        sku: "SKU-1007",
        productName: "Wireless Industrial Barcode Scanner Rugged",
        category: "Warehouse Equipment",
        quantity: 45,
        reservedQuantity: 5,
        availableQuantity: 40,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        // INTENTIONAL MISPLACEMENT FOR DEMO: Expected Zone B / Rack B04 / Shelf 3, but found in Zone C!
        zone: "Zone C (Industrial & Heavy)",
        rack: "Rack C02",
        shelf: "Shelf 1",
        bin: "Bin 06",
        batchNumber: "BAT-2026-112",
        updatedAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: "inv-03",
        productId: "prod-1042",
        sku: "SKU-1042",
        productName: "Ultra-Cold Pharmaceutical Vials Grade A",
        category: "Healthcare & Pharma",
        quantity: 210,
        reservedQuantity: 40,
        availableQuantity: 170,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "Cold Storage (Pharmaceutical / Perishable)",
        rack: "Cold Rack C-01",
        shelf: "Shelf 1",
        bin: "Bin 02",
        batchNumber: "BAT-PHARM-883",
        updatedAt: new Date(Date.now() - 420000).toISOString()
      },
      {
        id: "inv-04",
        productId: "prod-2031",
        sku: "SKU-2031",
        productName: "Automotive High-Torque Electric Servo Unit",
        category: "Automotive Parts",
        // INTENTIONAL STOCK DISCREPANCY: Expected 120, detected 116 (-4 units)
        quantity: 116,
        reservedQuantity: 30,
        availableQuantity: 86,
        status: "DAMAGED", // 1 unit marked damaged
        warehouseId: "WH-01",
        zone: "Zone C (Industrial & Heavy)",
        rack: "Rack C03",
        shelf: "Shelf 2",
        bin: "Bin 05",
        batchNumber: "BAT-AUTO-409",
        updatedAt: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: "inv-05",
        productId: "prod-2045",
        sku: "SKU-2045",
        productName: "Commercial Drone Propeller Module Quad",
        category: "Aerospace Logistics",
        quantity: 34, // LOW STOCK! Reorder point is 80
        reservedQuantity: 28,
        availableQuantity: 6,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "Zone A (Fast Moving)",
        rack: "Rack A01",
        shelf: "Shelf 3",
        bin: "Bin 08",
        batchNumber: "BAT-DRN-201",
        updatedAt: new Date(Date.now() - 5400000).toISOString()
      },
      {
        id: "inv-06",
        productId: "prod-3011",
        sku: "SKU-3011",
        productName: "Titanium Precision Bearing Ring Set",
        category: "Industrial Hardware",
        quantity: 68,
        reservedQuantity: 12,
        availableQuantity: 56,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "High Value Storage Vault",
        rack: "Vault Rack V-01",
        shelf: "Shelf 2",
        bin: "Bin 03",
        batchNumber: "BAT-TITAN-100",
        updatedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: "inv-07",
        productId: "prod-4009",
        sku: "SKU-4009",
        productName: "Heavy-Duty Pallet Jack Wheel Assembly",
        category: "Warehouse Equipment",
        quantity: 140,
        reservedQuantity: 15,
        availableQuantity: 125,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "Zone C (Industrial & Heavy)",
        rack: "Rack C05",
        shelf: "Shelf 1",
        bin: "Bin 02",
        batchNumber: "BAT-WHL-552",
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "inv-08",
        productId: "prod-5082",
        sku: "SKU-5082",
        productName: "Thermal Thermal-Imaging Security Camera Unit",
        category: "Electronics & Tech",
        quantity: 18, // LOW STOCK!
        reservedQuantity: 14,
        availableQuantity: 4,
        status: "AVAILABLE",
        warehouseId: "WH-01",
        zone: "High Value Storage Vault",
        rack: "Vault Rack V-02",
        shelf: "Shelf 1",
        bin: "Bin 04",
        batchNumber: "BAT-CAM-801",
        updatedAt: new Date(Date.now() - 12000000).toISOString()
      }
    ];

    // 5. Product Movement Timeline
    this.movements = [
      {
        id: "mov-01",
        sku: "SKU-1001",
        productName: "Industrial LiDAR Precision Sensor L9",
        fromLocation: "Receiving Dock",
        toLocation: "Zone B / Rack B02",
        time: "09:18 AM",
        event: "PUTAWAY",
        worker: "David Kim (W-109)",
        device: "FORKLIFT-01",
        reason: "Inbound Putaway Complete"
      },
      {
        id: "mov-02",
        sku: "SKU-1007",
        productName: "Wireless Industrial Barcode Scanner",
        fromLocation: "Zone B / Rack B04",
        toLocation: "Zone C / Rack C02",
        time: "10:14 AM",
        event: "MOVE",
        worker: "Elena Rostova (W-104)",
        device: "SCANNER-04",
        reason: "Unauthorized Transfer / Staging"
      },
      {
        id: "mov-03",
        sku: "SKU-2031",
        productName: "Electric Servo Unit",
        fromLocation: "Zone C / Rack C03",
        toLocation: "Returns & Quarantine",
        time: "11:22 AM",
        event: "QUARANTINE",
        worker: "Marcus Brody (W-102)",
        device: "VISION-CAM-04",
        reason: "Detected Crushed Outer Packaging (Confidence 94%)"
      },
      {
        id: "mov-04",
        sku: "SKU-2045",
        productName: "Commercial Drone Propeller",
        fromLocation: "Zone A / Rack A01",
        toLocation: "Packing Station Alpha",
        time: "11:45 AM",
        event: "PICK",
        worker: "Elena Rostova (W-104)",
        device: "SCANNER-02",
        reason: "Order #1042 Picking Sequence"
      },
      {
        id: "mov-05",
        sku: "SKU-1042",
        productName: "Ultra-Cold Pharmaceutical Vials",
        fromLocation: "Receiving Bay 2",
        toLocation: "Cold Storage / Rack C-01",
        time: "12:05 PM",
        event: "PUTAWAY",
        worker: "Carlos Mendez (W-108)",
        device: "COLD-CONTAINER-03",
        reason: "Thermal Chain Fast-Track Inbound"
      }
    ];

    // 6. Orders
    this.orders = [
      {
        id: "ord-1042",
        orderNumber: "ORD-1042",
        customer: "Boeing Defense & Logistics",
        priority: "HIGH",
        status: "PICKING",
        itemCount: 3,
        totalUnits: 14,
        createdAt: "Today 10:15 AM",
        assignedWorker: "Elena Rostova (W-104)",
        items: [
          {
            productId: "prod-2045",
            sku: "SKU-2045",
            productName: "Commercial Drone Propeller Module",
            quantity: 8,
            pickedQuantity: 4,
            zone: "Zone A (Fast Moving)",
            rack: "Rack A01",
            shelf: "Shelf 3",
            bin: "Bin 08"
          },
          {
            productId: "prod-1001",
            sku: "SKU-1001",
            productName: "Industrial LiDAR Precision Sensor L9",
            quantity: 4,
            pickedQuantity: 0,
            zone: "Zone B (Consumer Electronics)",
            rack: "Rack B02",
            shelf: "Shelf 2",
            bin: "Bin 04"
          },
          {
            productId: "prod-3011",
            sku: "SKU-3011",
            productName: "Titanium Precision Bearing Ring Set",
            quantity: 2,
            pickedQuantity: 0,
            zone: "High Value Storage Vault",
            rack: "Vault Rack V-01",
            shelf: "Shelf 2",
            bin: "Bin 03"
          }
        ]
      },
      {
        id: "ord-1045",
        orderNumber: "ORD-1045",
        customer: "Apex Robotics Systems",
        priority: "URGENT",
        status: "ALLOCATED",
        itemCount: 2,
        totalUnits: 6,
        createdAt: "Today 11:30 AM",
        assignedWorker: "David Kim (W-109)",
        items: [
          {
            productId: "prod-2031",
            sku: "SKU-2031",
            productName: "Automotive High-Torque Electric Servo Unit",
            quantity: 4,
            pickedQuantity: 0,
            zone: "Zone C (Industrial & Heavy)",
            rack: "Rack C03",
            shelf: "Shelf 2",
            bin: "Bin 05"
          },
          {
            productId: "prod-1007",
            sku: "SKU-1007",
            productName: "Wireless Industrial Barcode Scanner",
            quantity: 2,
            pickedQuantity: 0,
            zone: "Zone B (Consumer Electronics)",
            rack: "Rack B04",
            shelf: "Shelf 3",
            bin: "Bin 01"
          }
        ]
      },
      {
        id: "ord-1039",
        orderNumber: "ORD-1039",
        customer: "Northwestern Health Hospitals",
        priority: "HIGH",
        status: "PACKED",
        itemCount: 1,
        totalUnits: 20,
        createdAt: "Today 08:45 AM",
        pickedAt: "09:30 AM",
        packedAt: "11:10 AM",
        assignedWorker: "Sarah Chen (W-101)",
        items: [
          {
            productId: "prod-1042",
            sku: "SKU-1042",
            productName: "Ultra-Cold Pharmaceutical Vials Grade A",
            quantity: 20,
            pickedQuantity: 20,
            zone: "Cold Storage (Pharmaceutical / Perishable)",
            rack: "Cold Rack C-01",
            shelf: "Shelf 1",
            bin: "Bin 02"
          }
        ]
      },
      {
        id: "ord-1031",
        orderNumber: "ORD-1031",
        customer: "Amazon Fulfillment Logistics",
        priority: "NORMAL",
        status: "DISPATCHED",
        itemCount: 4,
        totalUnits: 45,
        createdAt: "Yesterday 04:00 PM",
        pickedAt: "08:15 AM",
        packedAt: "09:40 AM",
        dispatchedAt: "10:30 AM",
        items: []
      }
    ];

    // 7. Workers
    this.workers = [
      {
        id: "w-104",
        badgeId: "RFID-BADGE-104",
        name: "Elena Rostova",
        role: "Picker",
        currentZone: "Zone A (Fast Moving)",
        currentTask: "Order #1042 Picking Route",
        status: "ACTIVE",
        ordersPicked: 18,
        unitsPicked: 142,
        avgPickTimeMin: 2.3,
        travelDistanceKm: 6.4,
        accuracyRate: 99.8,
        shiftStart: "07:00 AM"
      },
      {
        id: "w-109",
        badgeId: "RFID-BADGE-109",
        name: "David Kim",
        role: "Forklift Driver",
        currentZone: "Zone C (Industrial & Heavy)",
        currentTask: "Pallet Replenishment Rack C03",
        status: "ACTIVE",
        ordersPicked: 12,
        unitsPicked: 96,
        avgPickTimeMin: 3.8,
        travelDistanceKm: 12.1,
        accuracyRate: 99.2,
        shiftStart: "07:30 AM"
      },
      {
        id: "w-102",
        badgeId: "RFID-BADGE-102",
        name: "Marcus Brody",
        role: "Supervisor",
        currentZone: "Command Center",
        currentTask: "Audit & Anomaly Investigation",
        status: "ACTIVE",
        ordersPicked: 4,
        unitsPicked: 24,
        avgPickTimeMin: 1.8,
        travelDistanceKm: 3.5,
        accuracyRate: 100.0,
        shiftStart: "06:30 AM"
      },
      {
        id: "w-108",
        badgeId: "RFID-BADGE-108",
        name: "Carlos Mendez",
        role: "Receiver",
        currentZone: "Receiving Dock",
        currentTask: "Inbound Verification Truck TR-881",
        status: "ACTIVE",
        ordersPicked: 0,
        unitsPicked: 320,
        avgPickTimeMin: 1.5,
        travelDistanceKm: 4.2,
        accuracyRate: 99.6,
        shiftStart: "08:00 AM"
      },
      {
        id: "w-111",
        badgeId: "RFID-BADGE-111",
        name: "Aisha Patel",
        role: "Packer",
        currentZone: "Packing Stations 1-8",
        currentTask: "Packing Order #1039",
        status: "ACTIVE",
        ordersPicked: 26,
        unitsPicked: 184,
        avgPickTimeMin: 1.9,
        travelDistanceKm: 2.1,
        accuracyRate: 99.9,
        shiftStart: "07:00 AM"
      }
    ];

    // 8. IoT Sensors with Live Readings and Thresholds
    this.sensors = [
      {
        id: "sens-01",
        sensorId: "TEMP-COLD-01",
        type: "TEMPERATURE",
        zone: "Cold Storage (Pharmaceutical / Perishable)",
        value: 8.4, // Over threshold! Max is 8.0°C
        unit: "°C",
        thresholdMin: 2.0,
        thresholdMax: 8.0,
        timestamp: "Just now",
        status: "CRITICAL"
      },
      {
        id: "sens-02",
        sensorId: "HUM-COLD-01",
        type: "HUMIDITY",
        zone: "Cold Storage (Pharmaceutical / Perishable)",
        value: 68.2,
        unit: "%",
        thresholdMin: 40.0,
        thresholdMax: 70.0,
        timestamp: "Just now",
        status: "WARNING"
      },
      {
        id: "sens-03",
        sensorId: "TEMP-ZONE-A",
        type: "TEMPERATURE",
        zone: "Zone A (Fast Moving)",
        value: 21.2,
        unit: "°C",
        thresholdMin: 15.0,
        thresholdMax: 26.0,
        timestamp: "Just now",
        status: "ONLINE"
      },
      {
        id: "sens-04",
        sensorId: "AIR-ZONE-C",
        type: "AIR_QUALITY",
        zone: "Zone C (Industrial & Heavy)",
        value: 42.0,
        unit: "AQI",
        thresholdMin: 0.0,
        thresholdMax: 60.0,
        timestamp: "Just now",
        status: "ONLINE"
      },
      {
        id: "sens-05",
        sensorId: "VIB-CONVEY-02",
        type: "VIBRATION",
        zone: "Packing Stations 1-8",
        value: 3.4,
        unit: "mm/s",
        thresholdMin: 0.0,
        thresholdMax: 5.0,
        timestamp: "Just now",
        status: "ONLINE"
      },
      {
        id: "sens-06",
        sensorId: "DOOR-VAULT-01",
        type: "DOOR",
        zone: "High Value Storage Vault",
        value: 0, // 0 = Closed, 1 = Open
        unit: "State",
        thresholdMin: 0,
        thresholdMax: 0,
        timestamp: "Just now",
        status: "ONLINE"
      }
    ];

    // 9. Alerts
    this.alerts = [
      {
        id: "alt-101",
        type: "TEMPERATURE_VIOLATION",
        severity: "CRITICAL",
        title: "Cold Storage Temperature Exceeded Threshold",
        description: "Sensor TEMP-COLD-01 recorded 8.4°C (Safe limit: 2.0°C - 8.0°C) for 14 consecutive minutes.",
        zone: "Cold Storage (Pharmaceutical / Perishable)",
        sku: "SKU-1042",
        timestamp: "12 minutes ago",
        status: "OPEN",
        assignedTo: "Marcus Brody (Shift Lead)",
        priorityScore: 96,
        recommendedAction: "Dispatch HVAC maintenance immediately and verify pharmaceutical cold-chain seal integrity."
      },
      {
        id: "alt-102",
        type: "MISPLACED_ITEM",
        severity: "HIGH",
        title: "High-Priority Product Misplaced in Zone C",
        description: "SKU-1007 (expected in Zone B / Rack B04 / Shelf 3) detected by RFID Reader R-03 in Zone C / Rack C02.",
        zone: "Zone C (Industrial & Heavy)",
        sku: "SKU-1007",
        timestamp: "24 minutes ago",
        status: "OPEN",
        assignedTo: "Elena Rostova",
        priorityScore: 88,
        recommendedAction: "Relocate SKU-1007 to assigned bin Zone B / Rack B04 / Shelf 3 / Bin 01 to prevent picker delay."
      },
      {
        id: "alt-103",
        type: "DAMAGED_ITEM",
        severity: "HIGH",
        title: "Damaged Outer Carton Detected by AI Vision",
        description: "Overhead Camera CAM-04 identified crushed packaging on SKU-2031 (Confidence: 94%).",
        zone: "Zone C (Industrial & Heavy)",
        sku: "SKU-2031",
        timestamp: "45 minutes ago",
        status: "IN_PROGRESS",
        assignedTo: "Marcus Brody",
        priorityScore: 84,
        recommendedAction: "Move pallet batch to Returns & Quarantine for physical structural inspection."
      },
      {
        id: "alt-104",
        type: "STOCK_MISMATCH",
        severity: "MEDIUM",
        title: "Stock Discrepancy on SKU-2031",
        description: "Database count expects 120 units; physical count and RFID scan detected 116 units (-4 units discrepancy).",
        zone: "Zone C (Industrial & Heavy)",
        sku: "SKU-2031",
        timestamp: "1 hour ago",
        status: "OPEN",
        priorityScore: 78,
        recommendedAction: "Initiate cycle count audit on Rack C03 to confirm whether items bypassed barcode scanning."
      },
      {
        id: "alt-105",
        type: "LOW_STOCK",
        severity: "HIGH",
        title: "High Stockout Risk: SKU-2045",
        description: "Only 6 units available; 28 units reserved across 4 active picking orders. Stockout in ~4 hours.",
        zone: "Zone A (Fast Moving)",
        sku: "SKU-2045",
        timestamp: "2 hours ago",
        status: "OPEN",
        priorityScore: 92,
        recommendedAction: "Approve expedited replenishment PO #4091 from Regional Supplier SkyLift Dynamics."
      }
    ];

    // 10. Anomalies
    this.anomalies = [
      {
        id: "anom-01",
        type: "MISPLACED_ITEM",
        riskScore: 89,
        sku: "SKU-1007",
        location: "Zone C / Rack C02 / Shelf 1 (Expected: Zone B / Rack B04)",
        detectedTime: "24 minutes ago",
        evidence: [
          "RFID reader R-03 registered tag RFID-884201 at Zone C portal at 10:14 AM",
          "Barcode scanner unit SCANNER-04 logged operator movement into Zone C aisle",
          "Expected shelf B04-S3 empty during cycle audit"
        ],
        aiExplanation: "Worker Elena Rostova temporarily staged SKU-1007 cartons near Rack C02 during a batch transfer, bypassing putaway confirmation.",
        likelyCause: "Staging bypass during multi-order picking rush.",
        recommendedAction: "Create transfer task to return SKU-1007 to Zone B Rack B04 Shelf 3 Bin 01.",
        status: "UNRESOLVED"
      },
      {
        id: "anom-02",
        type: "STOCK_MISMATCH",
        riskScore: 82,
        sku: "SKU-2031",
        location: "Zone C / Rack C03",
        detectedTime: "1 hour ago",
        evidence: [
          "Expected database quantity: 120 units",
          "Observed RFID tag census: 116 units",
          "Last scan discrepancy: -4 units"
        ],
        aiExplanation: "4 units may have been pulled for quality check without scanning or moved backwards in workflow without RFID portal registration.",
        likelyCause: "Unrecorded withdrawal during manual quality audit.",
        recommendedAction: "Perform targeted shelf audit on Rack C03 and review CAM-04 video log for 09:30 - 10:30 AM.",
        status: "INVESTIGATING"
      },
      {
        id: "anom-03",
        type: "TEMPERATURE_VIOLATION",
        riskScore: 95,
        sku: "SKU-1042",
        location: "Cold Storage (Pharmaceutical / Perishable)",
        detectedTime: "14 minutes ago",
        evidence: [
          "Sensor TEMP-COLD-01 exceeded 8.0°C threshold (currently 8.4°C)",
          "Rapid temperature ramp (+1.2°C in 20 min) following forklift door cycle",
          "Affected product: 210 units of Pharma Grade Vials"
        ],
        aiExplanation: "Cold storage air curtain failure or high frequency door opening during Inbound Truck TR-881 intake.",
        likelyCause: "Air curtain motor tripped or secondary seal left unlatched.",
        recommendedAction: "Inspect bay door seal immediately; engage secondary backup chiller unit.",
        status: "UNRESOLVED"
      }
    ];

    // 11. AI Recommendations
    this.aiRecommendations = [
      {
        id: "rec-01",
        title: "Immediate Relocation of SKU-1007",
        problem: "SKU-1007 is misplaced in Zone C, increasing pick travel time for Order #1045 by 210 meters.",
        evidence: "RFID Tag RFID-884201 detected at Zone C Reader R-03 instead of Zone B.",
        impact: "Pickers will lose ~6.5 minutes per order if not corrected before Order #1045 picking wave.",
        recommendedAction: "Relocate 40 units of SKU-1007 from Zone C Rack C02 to Zone B Rack B04 Shelf 3.",
        confidence: 0.98,
        zone: "Zone C (Industrial & Heavy)",
        sku: "SKU-1007",
        requiresConfirmation: true
      },
      {
        id: "rec-02",
        title: "Zone C Capacity Rebalance",
        problem: "Zone C is operating at 91.0% capacity (10,010 / 11,000 pallets).",
        evidence: "12 inbound pallets of heavy equipment scheduled for 02:00 PM will cause dock congestion.",
        impact: "Severe dock dwell times (+45 minutes per truck) and aisle blockage.",
        recommendedAction: "Transfer 250 slow-moving units of SKU-4009 to Overfill Zone E.",
        confidence: 0.92,
        zone: "Zone C (Industrial & Heavy)",
        requiresConfirmation: true
      },
      {
        id: "rec-03",
        title: "Order #1042 Picking Route Optimization",
        problem: "Original sequential picking route requires 410 meters and 14.5 minutes across 3 zones.",
        evidence: "Warehouse graph TSP solver calculated optimized waypoint sequence: A01 -> B02 -> V01 -> Packing.",
        impact: "Reduces travel distance by 26.8% (down to 300 meters) and saves 4.2 minutes per picker.",
        recommendedAction: "Apply AI Optimized Picking Route to worker Elena Rostova's RF Terminal.",
        confidence: 0.99,
        requiresConfirmation: false
      },
      {
        id: "rec-04",
        title: "Cold Chain Seal Emergency Inspection",
        problem: "Cold Storage exceeded 8.0°C maximum safe tolerance for 14 minutes.",
        evidence: "Sensor TEMP-COLD-01 indicates 8.4°C. 210 units of biological vials at thermal risk.",
        impact: "Potential $180,000 inventory loss if temperature does not normalize within 40 minutes.",
        recommendedAction: "Activate Auxiliary Chiller Pump B and inspect Bay Door #2 seal.",
        confidence: 0.96,
        zone: "Cold Storage (Pharmaceutical / Perishable)",
        requiresConfirmation: true
      }
    ];

    // 12. Audit Logs
    this.auditLogs = [
      {
        id: "aud-01",
        user: "admin@warenex.ai",
        action: "CONFIG_UPDATE",
        entity: "SensorThreshold",
        entityId: "TEMP-COLD-01",
        prevValue: "Max 8.5°C",
        newValue: "Max 8.0°C",
        timestamp: "Today 08:00 AM",
        ipAddress: "192.168.1.45",
        device: "Chrome Desktop / MacOS"
      },
      {
        id: "aud-02",
        user: "manager@warenex.ai",
        action: "STOCK_ADJUSTMENT",
        entity: "Inventory",
        entityId: "inv-04 (SKU-2031)",
        prevValue: "120 Units",
        newValue: "116 Units",
        timestamp: "Today 10:45 AM",
        ipAddress: "192.168.1.82",
        device: "Zebra TC57 Handheld"
      },
      {
        id: "aud-03",
        user: "system@warenex.ai",
        action: "AI_ANOMALY_TRIGGERED",
        entity: "Anomaly",
        entityId: "anom-01 (SKU-1007)",
        newValue: "MISPLACED_ITEM Risk: 89",
        timestamp: "Today 10:14 AM",
        device: "Warenex Anomaly Detection Engine"
      },
      {
        id: "aud-04",
        user: "operator@warenex.ai",
        action: "ORDER_STATUS_UPDATE",
        entity: "Order",
        entityId: "ORD-1042",
        prevValue: "ALLOCATED",
        newValue: "PICKING",
        timestamp: "Today 10:20 AM",
        device: "RF Scanner 02"
      }
    ];

    // 13. Vision Analyses
    this.visionAnalyses = [
      {
        id: "vis-01",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        timestamp: "11:22 AM",
        zone: "Zone C (Industrial & Heavy)",
        cameraName: "CAM-04 (Aisle C03 Overhead)",
        detectedObjects: [
          { id: "det-1", label: "box", confidence: 0.98, bbox: [15, 25, 30, 45] },
          { id: "det-2", label: "damaged_package", confidence: 0.94, bbox: [52, 38, 28, 42], damageType: "CRUSHED", severity: "HIGH" },
          { id: "det-3", label: "worker", confidence: 0.96, bbox: [82, 18, 15, 65] }
        ],
        boxCount: 3,
        damagedCount: 1,
        workerCount: 1,
        emptyBinDetected: false,
        damageConfidence: 0.94,
        damageType: "CRUSHED",
        recommendedAction: "Package crushed on corner edge. Structural carton integrity compromised. Move to Quarantine.",
        quarantineRequired: true
      }
    ];
  }

  // --- ACTIONS & MUTATIONS ---

  addProduct(productData: Omit<Product, "id">): Product {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id };
    this.products.unshift(newProduct);
    this.logAudit("USER", "CREATE_PRODUCT", "Product", newProduct.sku, undefined, JSON.stringify(newProduct));
    this.notify();
    return newProduct;
  }

  updateStock(inventoryId: string, newQuantity: number, reason: string, workerName: string = "Manager"): InventoryItem | null {
    const item = this.inventory.find(i => i.id === inventoryId);
    if (!item) return null;

    const oldQty = item.quantity;
    item.quantity = newQuantity;
    item.availableQuantity = Math.max(0, newQuantity - item.reservedQuantity);
    item.updatedAt = new Date().toISOString();

    this.movements.unshift({
      id: `mov-${Date.now()}`,
      sku: item.sku,
      productName: item.productName,
      fromLocation: `${item.zone} / ${item.rack}`,
      toLocation: `${item.zone} / ${item.rack}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: "ADJUSTMENT",
      worker: workerName,
      device: "DASHBOARD",
      reason: reason || "Manual stock reconciliation"
    });

    this.logAudit("USER", "STOCK_ADJUSTMENT", "Inventory", item.sku, `${oldQty} Units`, `${newQuantity} Units`);
    this.checkAnomalies();
    this.notify();
    return item;
  }

  transferInventory(inventoryId: string, toZone: string, toRack: string, toShelf: string, toBin: string, workerName: string = "Elena Rostova"): InventoryItem | null {
    const item = this.inventory.find(i => i.id === inventoryId);
    if (!item) return null;

    const prevLocation = `${item.zone} / ${item.rack} / ${item.shelf} / ${item.bin}`;
    item.zone = toZone;
    item.rack = toRack;
    item.shelf = toShelf;
    item.bin = toBin;
    item.updatedAt = new Date().toISOString();

    const newLocation = `${toZone} / ${toRack} / ${toShelf} / ${toBin}`;

    this.movements.unshift({
      id: `mov-${Date.now()}`,
      sku: item.sku,
      productName: item.productName,
      fromLocation: prevLocation,
      toLocation: newLocation,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: "TRANSFER",
      worker: workerName,
      device: "SCANNER-02",
      reason: "Inventory Transfer & Reallocation"
    });

    this.logAudit("USER", "TRANSFER_INVENTORY", "Inventory", item.sku, prevLocation, newLocation);

    // If item was previously misplaced and returned to expected location, auto-resolve anomaly
    const prod = this.products.find(p => p.sku === item.sku);
    if (prod && toZone.includes(prod.expectedZone.split(" ")[0])) {
      const anom = this.anomalies.find(a => a.sku === item.sku && a.type === "MISPLACED_ITEM" && a.status === "UNRESOLVED");
      if (anom) {
        anom.status = "RESOLVED";
        this.alerts.unshift({
          id: `alt-${Date.now()}`,
          type: "MISPLACED_ITEM",
          severity: "LOW",
          title: `Resolved: ${item.sku} returned to correct location`,
          description: `Product successfully verified at ${newLocation}.`,
          zone: toZone,
          sku: item.sku,
          timestamp: "Just now",
          status: "RESOLVED",
          priorityScore: 10,
          recommendedAction: "None. System in sync."
        });
      }
    }

    this.checkAnomalies();
    this.notify();
    return item;
  }

  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    alert.status = "RESOLVED";
    this.logAudit("USER", "RESOLVE_ALERT", "Alert", alert.id, "OPEN", "RESOLVED");
    this.notify();
    return true;
  }

  executeRecommendation(recId: string): boolean {
    const rec = this.aiRecommendations.find(r => r.id === recId);
    if (!rec) return false;

    rec.isExecuted = true;

    // Apply deterministic effect
    if (rec.sku === "SKU-1007") {
      const inv = this.inventory.find(i => i.sku === "SKU-1007");
      if (inv) {
        this.transferInventory(inv.id, "Zone B (Consumer Electronics)", "Rack B04", "Shelf 3", "Bin 01", "AI Copilot Auto-Route");
      }
    } else if (rec.title.includes("Cold Chain")) {
      const sens = this.sensors.find(s => s.sensorId === "TEMP-COLD-01");
      if (sens) {
        sens.value = 4.2;
        sens.status = "ONLINE";
      }
      const zone = this.zones.find(z => z.code === "COLD_STORAGE");
      if (zone) {
        zone.temperature = 4.2;
        zone.status = "NORMAL";
      }
      const alt = this.alerts.find(a => a.type === "TEMPERATURE_VIOLATION" && a.status === "OPEN");
      if (alt) alt.status = "RESOLVED";
    }

    this.logAudit("AI_COPILOT", "EXECUTE_RECOMMENDATION", "AiRecommendation", rec.id, undefined, rec.recommendedAction);
    this.notify();
    return true;
  }

  recordRfidEvent(event: Omit<RfidEvent, "id">): RfidEvent {
    const newEvent: RfidEvent = {
      ...event,
      id: `rfid-${Date.now()}`
    };
    this.rfidEvents.unshift(newEvent);

    // Deterministic rule: check if scanned zone matches product expected zone
    const prod = this.products.find(p => p.sku === event.sku);
    if (prod && !event.zone.toLowerCase().includes(prod.expectedZone.toLowerCase().slice(0, 6))) {
      // Create Misplaced Item anomaly if not already created
      if (!this.anomalies.some(a => a.sku === event.sku && a.status === "UNRESOLVED")) {
        this.anomalies.unshift({
          id: `anom-${Date.now()}`,
          type: "MISPLACED_ITEM",
          riskScore: 92,
          sku: event.sku,
          location: `${event.zone} (Reader: ${event.readerId})`,
          detectedTime: "Just now",
          evidence: [
            `RFID Reader ${event.readerId} detected tag ${event.tagId} with signal ${event.signalStrength} dBm`,
            `Registered zone ${event.zone} contradicts expected ${prod.expectedZone}`
          ],
          aiExplanation: `RFID Tag detected at reader ${event.readerId} inside ${event.zone}, whereas catalog master specifies ${prod.expectedZone}.`,
          likelyCause: "Unauthorized transport or wrong bin placement.",
          recommendedAction: `Relocate ${event.sku} to ${prod.expectedZone} ${prod.expectedRack}.`,
          status: "UNRESOLVED"
        });
      }
    }

    this.notify();
    return newEvent;
  }

  recordBarcodeScan(scan: Omit<BarcodeScan, "id">): BarcodeScan {
    const newScan: BarcodeScan = {
      ...scan,
      id: `scan-${Date.now()}`
    };
    this.barcodeScans.unshift(newScan);
    this.notify();
    return newScan;
  }

  updateSensorReading(sensorId: string, value: number) {
    const sensor = this.sensors.find(s => s.sensorId === sensorId);
    if (!sensor) return;

    sensor.value = value;
    sensor.timestamp = "Just now";

    if (value > sensor.thresholdMax) {
      sensor.status = "CRITICAL";
      // Auto create alert if none exists
      if (!this.alerts.some(a => a.title.includes(sensor.zone) && a.status === "OPEN")) {
        this.alerts.unshift({
          id: `alt-${Date.now()}`,
          type: "TEMPERATURE_VIOLATION",
          severity: "CRITICAL",
          title: `Sensor Alert: ${sensor.zone} Exceeded Maximum Limit`,
          description: `${sensor.type} reading of ${value} ${sensor.unit} exceeds upper threshold of ${sensor.thresholdMax} ${sensor.unit}.`,
          zone: sensor.zone,
          timestamp: "Just now",
          status: "OPEN",
          priorityScore: 95,
          recommendedAction: "Trigger maintenance inspection immediately."
        });
      }
    } else if (value < sensor.thresholdMin) {
      sensor.status = "WARNING";
    } else {
      sensor.status = "ONLINE";
    }

    this.notify();
  }

  // --- ROUTE OPTIMIZATION ENGINE ---
  calculatePickRoute(orderId: string): PickRouteOptimization {
    const order = this.orders.find(o => o.id === orderId) || this.orders[0];

    // Warehouse graph coordinates and distances
    const waypoints = order.items.map(item => ({
      location: `${item.zone} / ${item.rack} / ${item.bin}`,
      sku: item.sku,
      qty: item.quantity,
      zone: item.zone
    }));

    // Sequential unoptimized route:
    const originalRoute = ["Receiving Intake", ...waypoints.map(w => w.location), "Packing Bay Alpha"];
    const originalDistanceMeters = 420;
    const originalTimeMinutes = 14.2;

    // AI Optimized sequence (sorts by spatial zone proximity: Zone A -> Zone B -> Vault -> Packing):
    const sortedWaypoints = [...waypoints].sort((a, b) => a.zone.localeCompare(b.zone));
    const optimizedRoute = ["Receiving Intake", ...sortedWaypoints.map(w => w.location), "Packing Bay Alpha"];
    const optimizedDistanceMeters = 295;
    const optimizedTimeMinutes = 9.8;
    const improvementPercentage = Math.round(((originalDistanceMeters - optimizedDistanceMeters) / originalDistanceMeters) * 100);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      startLocation: "Zone A Intake",
      originalRoute,
      originalDistanceMeters,
      originalTimeMinutes,
      optimizedRoute,
      optimizedDistanceMeters,
      optimizedTimeMinutes,
      improvementPercentage,
      waypoints: sortedWaypoints
    };
  }

  // --- RESTOCK OPTIMIZATION ENGINE ---
  calculateRestockPriorities(): RestockPriority[] {
    return this.products.map(prod => {
      const inv = this.inventory.find(i => i.productId === prod.id);
      const currentStock = inv ? inv.quantity : 0;
      const reservedStock = inv ? inv.reservedQuantity : 0;
      const availableStock = Math.max(0, currentStock - reservedStock);

      // Deterministic priority formula:
      // Score = (ReorderPoint - AvailableStock) * 2 + (DemandRate * 1.5)
      const deficit = Math.max(0, prod.reorderPoint - availableStock);
      const rawScore = (deficit / (prod.reorderPoint || 1)) * 60 + (prod.demandRate / 30) * 40;
      const priorityScore = Math.min(100, Math.round(rawScore));

      let urgency: RestockPriority["urgency"] = "LOW";
      if (priorityScore >= 85) urgency = "CRITICAL";
      else if (priorityScore >= 70) urgency = "HIGH";
      else if (priorityScore >= 50) urgency = "MEDIUM";

      return {
        sku: prod.sku,
        productName: prod.name,
        currentStock,
        reservedStock,
        demandRate: prod.demandRate,
        leadTimeDays: 3,
        pendingOrdersCount: reservedStock > 0 ? Math.ceil(reservedStock / 4) : 0,
        location: `${prod.expectedZone} / ${prod.expectedRack}`,
        priorityScore,
        urgency,
        reason: deficit > 0
          ? `Stock deficit (${deficit} below reorder point) with demand rate of ${prod.demandRate} units/day.`
          : `Healthy stock buffer (${availableStock} units available).`
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // --- SIMULATION TICK / STEP ---
  simulateStep(): { eventType: string; description: string } {
    this.simulation.eventsGenerated += 1;
    this.simulation.lastTickTime = new Date().toISOString();

    const rand = Math.random();

    // 1. Move a worker slightly or record picking activity
    const activeWorker = this.workers[Math.floor(Math.random() * this.workers.length)];
    activeWorker.unitsPicked += Math.floor(Math.random() * 3) + 1;
    activeWorker.travelDistanceKm = parseFloat((activeWorker.travelDistanceKm + 0.05).toFixed(2));

    // 2. Chance of RFID detection
    if (rand < 0.4) {
      const prod = this.products[Math.floor(Math.random() * this.products.length)];
      const zone = this.zones[Math.floor(Math.random() * this.zones.length)];
      this.recordRfidEvent({
        tagId: `RFID-${Math.floor(100000 + Math.random() * 900000)}`,
        sku: prod.sku,
        readerId: `R-${zone.code.slice(0, 4)}-01`,
        zone: zone.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        signalStrength: Math.floor(-35 - Math.random() * 25),
        eventType: "ENTER"
      });
      this.notify();
      return {
        eventType: "RFID_DETECTED",
        description: `RFID Tag detected for ${prod.sku} at ${zone.name}.`
      };
    }

    // 3. Small temperature fluctuation
    const coldSensor = this.sensors.find(s => s.sensorId === "TEMP-COLD-01");
    if (coldSensor) {
      const delta = (Math.random() - 0.48) * 0.3;
      coldSensor.value = parseFloat((coldSensor.value + delta).toFixed(1));
      if (coldSensor.value > 8.0) {
        coldSensor.status = "CRITICAL";
      } else {
        coldSensor.status = "ONLINE";
      }
    }

    this.notify();
    return {
      eventType: "TELEMETRY_TICK",
      description: `Worker ${activeWorker.name} progressed picking task. Sensor telemetry synced.`
    };
  }

  checkAnomalies() {
    // Deterministic check for misplaced items
    for (const inv of this.inventory) {
      const prod = this.products.find(p => p.sku === inv.sku);
      if (prod) {
        const expectedZonePrefix = prod.expectedZone.split(" ")[0];
        if (!inv.zone.startsWith(expectedZonePrefix)) {
          if (!this.anomalies.some(a => a.sku === inv.sku && a.status === "UNRESOLVED")) {
            this.anomalies.unshift({
              id: `anom-${Date.now()}`,
              type: "MISPLACED_ITEM",
              riskScore: 88,
              sku: inv.sku,
              location: `${inv.zone} (Expected: ${prod.expectedZone})`,
              detectedTime: "Just now",
              evidence: [
                `Inventory record points to ${inv.zone} / ${inv.rack}`,
                `Product master requires ${prod.expectedZone} / ${prod.expectedRack}`
              ],
              aiExplanation: `Location discrepancy detected. Actual position contradicts expected zone.`,
              likelyCause: "Manual putaway error or staging bypass.",
              recommendedAction: `Move ${inv.sku} to ${prod.expectedZone}.`,
              status: "UNRESOLVED"
            });
          }
        }
      }
    }
  }

  logAudit(user: string, action: string, entity: string, entityId: string, prevValue?: string, newValue?: string) {
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      user,
      action,
      entity,
      entityId,
      prevValue,
      newValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      device: "Warenex Engine"
    });
  }

  // --- AI TOOL EXECUTION ENGINE (Deterministic & Exact) ---
  executeAiTool(toolName: string, args: Record<string, any>): any {
    switch (toolName) {
      case "get_inventory": {
        if (args.sku) {
          return this.inventory.filter(i => i.sku.toLowerCase() === args.sku.toLowerCase());
        }
        return this.inventory.slice(0, 10);
      }
      case "get_product_location": {
        const item = this.inventory.find(i => i.sku.toLowerCase() === args.sku?.toLowerCase());
        const prod = this.products.find(p => p.sku.toLowerCase() === args.sku?.toLowerCase());
        if (!item || !prod) {
          return { error: `SKU ${args.sku} not found in warehouse database.` };
        }
        return {
          sku: item.sku,
          productName: item.productName,
          currentLocation: `${item.zone} / ${item.rack} / ${item.shelf} / ${item.bin}`,
          expectedLocation: `${prod.expectedZone} / ${prod.expectedRack} / ${prod.expectedShelf} / ${prod.expectedBin}`,
          isMisplaced: item.zone !== prod.expectedZone,
          availableQuantity: item.availableQuantity,
          status: item.status
        };
      }
      case "get_anomalies": {
        return this.anomalies.filter(a => a.status !== "RESOLVED");
      }
      case "get_low_stock_items": {
        return this.calculateRestockPriorities().filter(p => p.priorityScore >= 70);
      }
      case "get_storage_conditions": {
        return this.sensors.map(s => ({
          sensorId: s.sensorId,
          type: s.type,
          zone: s.zone,
          value: `${s.value} ${s.unit}`,
          thresholdRange: `${s.thresholdMin} - ${s.thresholdMax} ${s.unit}`,
          status: s.status
        }));
      }
      case "calculate_pick_route": {
        return this.calculatePickRoute(args.orderId || "ord-1042");
      }
      case "get_warehouse_status": {
        const totalItems = this.inventory.reduce((acc, i) => acc + i.quantity, 0);
        const openAlerts = this.alerts.filter(a => a.status === "OPEN").length;
        const unresolvedAnomalies = this.anomalies.filter(a => a.status === "UNRESOLVED").length;
        return {
          inventoryAccuracy: "98.4%",
          totalUnitsInWarehouse: totalItems,
          activeOrders: this.orders.filter(o => o.status !== "DELIVERED" && o.status !== "DISPATCHED").length,
          activeAlerts: openAlerts,
          unresolvedAnomalies: unresolvedAnomalies,
          zonesWithWarnings: this.zones.filter(z => z.status !== "NORMAL").map(z => z.name)
        };
      }
      default:
        return { error: `Tool ${toolName} not supported.` };
    }
  }
}

// Global Singleton Instance to survive Next.js Fast Refresh
const globalStore = global as unknown as { warehouseStore: WarehouseStore };
export const warehouseStore = globalStore.warehouseStore || new WarehouseStore();
if (process.env.NODE_ENV !== "production") {
  globalStore.warehouseStore = warehouseStore;
}
