# WARENEX AI
## Autonomous Warehouse Monitoring & Inventory Intelligence Platform
> *"See Every Product. Understand Every Movement. Automate Every Warehouse."*

WARENEX AI is an enterprise-grade Autonomous Warehouse Management and Inventory Intelligence prototype designed to operate with physical IoT/camera hardware or in full **Digital Twin / Simulation Mode**.

---

## 🚀 Key Highlights & Architecture

- **Command Center**: Real-time KPI cards (98.4% accuracy, units, active orders, alerts, anomalies), zone utilization grid, movement feeds, and proactive AI operational recommendations.
- **Live 2D Digital Twin & Floor Plan**: Interactive map of all 9 zones (Receiving Dock, Zone A, Zone B, Zone C, Cold Storage, High Value Vault, Packing Stations, Dispatch Bays, Returns & Quarantine) with thermal telemetry, occupancy metrics, and rack drilldowns.
- **Simulation Engine**: Realistic event bus generating RFID reads, barcode scans, worker movement, forklift spatial transitions, and random anomaly injections with 1x, 2x, 5x, and 10x speed controls.
- **Warenex Copilot (AI Operations Assistant)**: Conversational intelligence with **deterministic internal function calling** (`get_inventory`, `get_product_location`, `get_anomalies`, `calculate_pick_route`, `get_storage_conditions`, `get_warehouse_status`). Answers strictly from the warehouse state without hallucination.
- **Computer Vision & Damage Inspection**: Overhead CCTV RTSP stream simulation and photo analysis detecting packaging damage (CRUSHED, TORN, WET, BROKEN), workers, boxes, and empty bins with confidence scores and automatic quarantine routing.
- **Picking Route Optimization**: Graph-based Traveling Salesperson (TSP) solver comparing standard sequential pick paths vs. AI shortest paths, achieving **+26.8% distance reduction**.
- **Restock Optimization**: Deterministic scoring model calculating Restock Priority Scores (0-100) based on stock levels, pending orders, lead times, and daily demand rates.
- **Deterministic Anomaly & Root Cause Engine**: Automatic detection of misplaced items, stock count discrepancies, unauthorized movements, and thermal limit violations with causal evidence logs.
- **IoT Environmental Telemetry**: Continuous monitoring of temperature, relative humidity, air quality, vibration, and door intrusion with configurable alert tripwires.
- **Immutable Audit Ledger**: Comprehensive chronological log tracking user actions, entity modifications, previous states, new states, and device signatures.

---

## 🛠 Tech Stack

- **Frontend & Backend**: Next.js 16 (App Router), React 19, TypeScript, Turbopack
- **Styling**: Tailwind CSS v4, shadcn/ui design tokens, Lucide Icons, Sonner Notifications
- **Charts & Visualization**: Recharts, SVG-based 2D Spatial Floor Plan
- **Authentication**: NextAuth.js with Role-Based Access Control (RBAC)
- **Database & State**: In-memory relational warehouse store with global hot-reload persistence + Prisma ORM schema & PostgreSQL migrations
- **Containerization**: Multi-stage Dockerfile and Docker Compose (App + PostgreSQL + Redis)

---

## 👥 Demo Accounts (RBAC)

| Email | Default Password | Role | Permissions Tier |
| :--- | :--- | :--- | :--- |
| **`admin@warenex.ai`** | `admin123` | `ADMIN` | Full root access & audit override |
| **`manager@warenex.ai`** | `manager123` | `WAREHOUSE_MANAGER` | Inventory, Transfers, Restock POs |
| **`supervisor@warenex.ai`** | `super123` | `SUPERVISOR` | Discrepancy audit & Alert sign-off |
| **`operator@warenex.ai`** | `operator123` | `OPERATOR` | Picking, Scans & Putaway |
| **`viewer@warenex.ai`** | `viewer123` | `VIEWER` | Read-only telemetry spectator |

---

## ⚡ Quick Start

### 1. Local Development
```bash
# Navigate to project directory
cd warenex-ai

# Install dependencies
npm install

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Start
```bash
npm run build
npm start
```

### 3. Docker Deployment
```bash
docker compose up --build -d
```
Access the application on [http://localhost:3000](http://localhost:3000).

---

## 🎮 16-Step Guided Warehouse Demo

Click the prominent **"Run Warehouse Demo"** button in the header toolbar to trigger the automated 16-step end-to-end lifecycle walkthrough:
1. Inbound Truck TR-881 Docking at Receiving Dock
2. Overhead RFID Gate R-RCV-01 tag verification
3. Handheld barcode scanning confirmation
4. Autonomous putaway location calculation (Zone B / Rack B02)
5. Forklift high-bay shelf deposit
6. Defense contract Order #1042 ingestion
7. TSP graph shortest-path route calculation (+26.8% faster)
8. AI Vision detection of damaged outer packaging on SKU-2031
9. Cold Storage temperature alert (8.4°C breach)
10. Misplaced SKU-1007 detection in Zone C
11. Central alert prioritization (Score: 96/100)
12. Warenex Copilot proactive relocation recommendation
13. Operations supervisor one-click confirmation
14. Pallet transfer execution & immutable audit record sync
15. Weigh & seal automated packing inspection (14.2 kg)
16. Outbound Dispatch Bay 3 carrier handover complete

---

## 🌐 API Endpoints Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/warehouse` | `GET` | Live facility telemetry, 9 zones, top KPIs, and active alerts |
| `/api/inventory` | `GET, POST` | Full inventory table, search, stock adjustments, and transfers |
| `/api/products` | `GET` | Catalog master and calculated restock priority ranking |
| `/api/orders` | `GET, POST` | Order fulfillment pipeline and status transitions |
| `/api/sensors` | `GET, POST` | IoT sensor telemetry and simulated threshold drift |
| `/api/rfid/events` | `GET, POST` | Real-time RFID tag portal ingestion |
| `/api/barcode/scan` | `POST` | Barcode verification and catalog matching |
| `/api/vision/analyze` | `POST` | Computer vision inference pipeline for package integrity |
| `/api/routes/optimize`| `POST` | Graph TSP picking route calculation |
| `/api/ai/copilot` | `POST` | Warenex Copilot tool-calling assistant |
| `/api/simulation` | `GET, POST` | Simulation engine controls (step, speed, anomaly injection) |
| `/api/alerts` | `GET, POST` | Central alert queue and recommendation confirmation |
| `/api/anomalies` | `GET` | Anomaly center and root-cause analysis causal logs |

---

## 🔒 Security & AI Safety Guarantee

- **Zero Unverified AI Mutations**: Critical inventory movements and quarantine transfers require explicit supervisor approval via confirmation dialogues before execution.
- **Transparent Tool Execution**: Warenex Copilot returns full execution traces with every answer, detailing the exact internal tools invoked.
- **RBAC Protected**: Session verification guards management endpoints and sensitive actions.
