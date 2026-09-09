"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Layers,
  ShoppingCart,
  Map,
  Truck,
  ScanBarcode,
  Users,
  Radio,
  BellRing,
  AlertTriangle,
  BarChart3,
  Bot,
  MonitorPlay,
  Settings,
  ShieldCheck,
  Zap
} from "lucide-react";

const navigation = [
  { name: "Command Center", href: "/", icon: LayoutDashboard },
  { name: "Live Warehouse", href: "/live", icon: Map },
  { name: "Inventory", href: "/inventory", icon: Layers },
  { name: "Products", href: "/products", icon: Box },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Picking", href: "/picking", icon: ScanBarcode },
  { name: "Receiving", href: "/receiving", icon: Truck },
  { name: "Storage", href: "/storage", icon: Layers },
  { name: "Computer Vision", href: "/vision", icon: MonitorPlay },
  { name: "Workers", href: "/workers", icon: Users },
  { name: "IoT Sensors", href: "/sensors", icon: Radio },
  { name: "Alerts", href: "/alerts", icon: BellRing },
  { name: "Anomalies", href: "/anomalies", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Copilot", href: "/copilot", icon: Bot },
  { name: "Digital Twin", href: "/digital-twin", icon: Map },
  { name: "Automation", href: "/automation", icon: Zap },
  { name: "Audit Logs", href: "/audit", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50/40 dark:bg-slate-900/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Box className="h-6 w-6 text-blue-600" />
          <span className="text-xl">WARENEX AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50",
                  isActive ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
