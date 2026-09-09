export type Role = "ADMIN" | "WAREHOUSE_MANAGER" | "SUPERVISOR" | "OPERATOR" | "VIEWER";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "DISCONTINUED";

export type InventoryStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "PICKED"
  | "PACKED"
  | "DISPATCHED"
  | "DAMAGED"
  | "MISSING"
  | "QUARANTINED"
  | "EXPIRED";

export type OrderStatus =
  | "RECEIVED"
  | "ALLOCATED"
  | "PICKING"
  | "PICKED"
  | "PACKING"
  | "PACKED"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED";

export type AnomalyType =
  | "MISPLACED_ITEM"
  | "STOCK_MISMATCH"
  | "DAMAGED_ITEM"
  | "TEMPERATURE_VIOLATION"
  | "HUMIDITY_VIOLATION"
  | "UNAUTHORIZED_MOVEMENT"
  | "RFID_DISAPPEARED"
  | "WORKER_SAFETY_ZONE";

export type DamageType =
  | "CRUSHED"
  | "TORN"
  | "OPEN"
  | "WET"
  | "BROKEN"
  | "DENTED"
  | "LEAKING"
  | "UNKNOWN";

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  currentOccupancy: number;
}

export interface Zone {
  id: string;
  warehouseId: string;
  name: string;
  code: string; // "RECEIVING", "ZONE_A", "ZONE_B", "ZONE_C", "COLD_STORAGE", "HIGH_VALUE", "PACKING", "DISPATCH", "RETURNS"
  type: string;
  capacity: number;
  occupied: number;
  temperature: number; // in Celsius
  humidity: number; // in %
  activeWorkers: number;
  inventoryCount: number;
  alertCount: number;
  anomalyCount: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  color: string;
}

export interface Rack {
  id: string;
  zoneId: string;
  name: string; // e.g. "Rack A01"
  shelvesCount: number;
}

export interface Shelf {
  id: string;
  rackId: string;
  name: string; // e.g. "Shelf 2"
  level: number;
}

export interface Bin {
  id: string;
  shelfId: string;
  name: string; // e.g. "Bin 04"
  barcode: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  batchNumber: string;
  serialNumber?: string;
  supplier: string;
  cost: number;
  sellingPrice: number;
  expiryDate?: string;
  weight: number; // kg
  dimensions: string; // e.g. "30x20x15 cm"
  status: ProductStatus;
  expectedZone: string;
  expectedRack: string;
  expectedShelf: string;
  expectedBin: string;
  reorderPoint: number;
  demandRate: number; // units/day
}

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  status: InventoryStatus;
  warehouseId: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  batchNumber: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  sku: string;
  productName: string;
  fromLocation: string;
  toLocation: string;
  time: string;
  event: string; // "RECEIVING", "PUTAWAY", "MOVE", "PICK", "PACK", "DISPATCH", "QUARANTINE"
  worker: string;
  device: string; // "SCANNER-02", "RFID-GATE-4", "FORKLIFT-01", "SYSTEM"
  reason: string;
}

export interface OrderItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  pickedQuantity: number;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  priority: "HIGH" | "NORMAL" | "LOW" | "URGENT";
  status: OrderStatus;
  items: OrderItem[];
  itemCount: number;
  totalUnits: number;
  createdAt: string;
  pickedAt?: string;
  packedAt?: string;
  dispatchedAt?: string;
  assignedWorker?: string;
}

export interface Worker {
  id: string;
  badgeId: string;
  name: string;
  role: "Picker" | "Receiver" | "Packer" | "Forklift Driver" | "Supervisor";
  currentZone: string;
  currentTask: string;
  status: "ACTIVE" | "IDLE" | "BREAK" | "OFFLINE";
  ordersPicked: number;
  unitsPicked: number;
  avgPickTimeMin: number;
  travelDistanceKm: number;
  accuracyRate: number; // e.g. 99.4%
  shiftStart: string;
}

export interface Sensor {
  id: string;
  sensorId: string;
  type: "TEMPERATURE" | "HUMIDITY" | "AIR_QUALITY" | "LIGHT" | "DOOR" | "VIBRATION" | "WEIGHT" | "MOTION";
  zone: string;
  value: number;
  unit: string;
  thresholdMin: number;
  thresholdMax: number;
  timestamp: string;
  status: "ONLINE" | "WARNING" | "CRITICAL" | "OFFLINE";
}

export interface RfidEvent {
  id: string;
  tagId: string;
  sku: string;
  readerId: string;
  zone: string;
  timestamp: string;
  signalStrength: number; // e.g. -45 dBm
  eventType: "ENTER" | "EXIT" | "MOVE" | "DWELL" | "UNKNOWN";
}

export interface BarcodeScan {
  id: string;
  barcode: string;
  sku: string;
  workerId: string;
  location: string;
  timestamp: string;
  result: "SUCCESS" | "MISMATCH" | "UNKNOWN";
}

export interface VisionDetection {
  id: string;
  label: string; // "box", "damaged_package", "worker", "empty_bin", "forklift"
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, w, h] %
  damageType?: DamageType;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface VisionAnalysisResult {
  id: string;
  imageUrl: string;
  timestamp: string;
  zone: string;
  cameraName: string;
  detectedObjects: VisionDetection[];
  boxCount: number;
  damagedCount: number;
  workerCount: number;
  emptyBinDetected: boolean;
  damageConfidence: number;
  damageType?: DamageType;
  recommendedAction: string;
  quarantineRequired: boolean;
}

export interface Alert {
  id: string;
  type: AnomalyType | string;
  severity: AlertSeverity;
  title: string;
  description: string;
  zone: string;
  sku?: string;
  timestamp: string;
  status: AlertStatus;
  assignedTo?: string;
  priorityScore: number; // 0 - 100
  recommendedAction: string;
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  riskScore: number; // 0 - 100
  evidence: string[];
  location: string;
  detectedTime: string;
  sku?: string;
  aiExplanation: string;
  recommendedAction: string;
  status: "UNRESOLVED" | "INVESTIGATING" | "RESOLVED";
  likelyCause: string;
}

export interface PickRouteOptimization {
  orderId: string;
  orderNumber: string;
  startLocation: string;
  originalRoute: string[];
  originalDistanceMeters: number;
  originalTimeMinutes: number;
  optimizedRoute: string[];
  optimizedDistanceMeters: number;
  optimizedTimeMinutes: number;
  improvementPercentage: number;
  waypoints: { location: string; sku: string; qty: number; zone: string }[];
}

export interface RestockPriority {
  sku: string;
  productName: string;
  currentStock: number;
  reservedStock: number;
  demandRate: number;
  leadTimeDays: number;
  pendingOrdersCount: number;
  location: string;
  priorityScore: number; // 0 - 100
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  problem: string;
  evidence: string;
  impact: string;
  recommendedAction: string;
  confidence: number;
  zone?: string;
  sku?: string;
  requiresConfirmation: boolean;
  isExecuted?: boolean;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  prevValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress?: string;
  device?: string;
}

export interface SimulationState {
  isRunning: boolean;
  speed: 1 | 2 | 5 | 10;
  eventsGenerated: number;
  misplacementProbability: number; // e.g. 0.05
  damageProbability: number; // e.g. 0.03
  rfidFailureProbability: number; // e.g. 0.02
  stockMismatchProbability: number; // e.g. 0.04
  tempViolationProbability: number; // e.g. 0.01
  lastTickTime: string;
}
