"use client";

import { useState } from "react";
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
  Zap,
  ChevronDown,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpRight,
  LogOut,
  UserCheck,
  Lock
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  iconColor?: string;
}

interface NavSector {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  items: NavItem[];
}

const navSectors: NavSector[] = [
  {
    id: "operations",
    title: "Operations & Fulfillment",
    tag: "OPS",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
    items: [
      { name: "Command Center", href: "/", icon: LayoutDashboard, iconColor: "text-blue-600 dark:text-blue-400" },
      { name: "Inbound Receiving", href: "/receiving", icon: Truck, badge: "DOCK", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", iconColor: "text-emerald-600 dark:text-emerald-400" },
      { name: "Order Fulfillment", href: "/orders", icon: ShoppingCart, badge: "LIVE", badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", iconColor: "text-indigo-600 dark:text-indigo-400" },
      { name: "Picking Route (TSP)", href: "/picking", icon: ScanBarcode, badge: "+26.8%", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", iconColor: "text-emerald-600 dark:text-emerald-400" },
      { name: "Inventory Master", href: "/inventory", icon: Layers, iconColor: "text-sky-600 dark:text-sky-400" },
      { name: "Product Catalog", href: "/products", icon: Box, iconColor: "text-blue-600 dark:text-blue-400" },
      { name: "Storage & Racks", href: "/storage", icon: Layers, iconColor: "text-slate-600 dark:text-slate-400" },
    ]
  },
  {
    id: "intelligence",
    title: "AI & Vision Intelligence",
    tag: "AI",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
    items: [
      { name: "OpenCV 5.0 & Vision", href: "/vision", icon: MonitorPlay, badge: "OPENCV", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", iconColor: "text-purple-600 dark:text-purple-400" },
      { name: "AI Ops Copilot", href: "/copilot", icon: Bot, badge: "TOOL-CALL", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300", iconColor: "text-violet-600 dark:text-violet-400" },
      { name: "2D Digital Twin", href: "/digital-twin", icon: Map, badge: "MAP", badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300", iconColor: "text-cyan-600 dark:text-cyan-400" },
      { name: "Live Facility Feeds", href: "/live", icon: Map, iconColor: "text-sky-600 dark:text-sky-400" },
      { name: "Autonomous Rules", href: "/automation", icon: Zap, iconColor: "text-amber-500 dark:text-amber-400" },
    ]
  },
  {
    id: "telemetry",
    title: "Telemetry & Monitoring",
    tag: "MONITOR",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    items: [
      { name: "Alert Queue", href: "/alerts", icon: BellRing, badge: "1 CRIT", badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300", iconColor: "text-rose-600 dark:text-rose-400" },
      { name: "Anomaly & RCA", href: "/anomalies", icon: AlertTriangle, badge: "RCA", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", iconColor: "text-amber-600 dark:text-amber-400" },
      { name: "IoT Environment", href: "/sensors", icon: Radio, badge: "SENSORS", badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300", iconColor: "text-sky-600 dark:text-sky-400" },
      { name: "Facility Analytics", href: "/analytics", icon: BarChart3, iconColor: "text-indigo-600 dark:text-indigo-400" },
    ]
  },
  {
    id: "governance",
    title: "Governance & Control",
    tag: "ADMIN",
    tagColor: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    items: [
      { name: "Workforce Roster", href: "/workers", icon: Users, iconColor: "text-blue-600 dark:text-blue-400" },
      { name: "Immutable Audit Log", href: "/audit", icon: ShieldCheck, badge: "LEDGER", badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", iconColor: "text-emerald-600 dark:text-emerald-400" },
      { name: "System Settings", href: "/settings", icon: Settings, iconColor: "text-slate-600 dark:text-slate-400" },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Management View Filter: 'ALL' | 'operations' | 'intelligence' | 'telemetry' | 'governance'
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  
  // Collapsed sections tracking
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectorId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectorId]: !prev[sectorId] }));
  };

  const filteredSectors = selectedFilter === "ALL"
    ? navSectors
    : navSectors.filter(s => s.id === selectedFilter);

  const userRole = (session?.user as any)?.role || "ADMIN";
  const userRoleBadge: Record<string, string> = {
    ADMIN: "bg-blue-600 text-white",
    WAREHOUSE_MANAGER: "bg-indigo-600 text-white",
    SUPERVISOR: "bg-amber-600 text-white",
    OPERATOR: "bg-emerald-600 text-white",
    VIEWER: "bg-purple-600 text-white"
  };
  const currentBadgeClass = userRoleBadge[userRole] || "bg-slate-600 text-white";

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-850 shadow-xs select-none">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 lg:h-[62px] lg:px-5 dark:border-slate-850 bg-gradient-to-r from-white via-indigo-50/20 to-white dark:from-slate-950 dark:via-slate-900/40 dark:to-slate-950">
        <Link href="/" className="flex items-center gap-2.5 font-black tracking-tight text-slate-900 dark:text-white group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
            <Box className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base leading-tight font-extrabold tracking-wide">
              WARENEX<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-wider">
              AUTONOMOUS LOGISTICS
            </span>
          </div>
        </Link>
      </div>

      {/* Split Management Filter Bar */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-2.5 w-2.5" />
            MANAGEMENT FILTER:
          </span>
          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
            {filteredSectors.reduce((acc, s) => acc + s.items.length, 0)} MODULES
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[11px] font-medium">
          <button
            onClick={() => setSelectedFilter("ALL")}
            className={cn(
              "py-1 rounded text-center transition-all cursor-pointer",
              selectedFilter === "ALL"
                ? "bg-white text-indigo-700 font-bold shadow-xs dark:bg-slate-800 dark:text-indigo-300"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            )}
          >
            All
          </button>
          <button
            onClick={() => setSelectedFilter("operations")}
            className={cn(
              "py-1 rounded text-center transition-all cursor-pointer",
              selectedFilter === "operations"
                ? "bg-white text-blue-700 font-bold shadow-xs dark:bg-slate-800 dark:text-blue-300"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            )}
          >
            Ops
          </button>
          <button
            onClick={() => setSelectedFilter("intelligence")}
            className={cn(
              "py-1 rounded text-center transition-all cursor-pointer",
              selectedFilter === "intelligence"
                ? "bg-white text-purple-700 font-bold shadow-xs dark:bg-slate-800 dark:text-purple-300"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            )}
          >
            AI
          </button>
          <button
            onClick={() => setSelectedFilter("telemetry")}
            className={cn(
              "py-1 rounded text-center transition-all cursor-pointer",
              selectedFilter === "telemetry"
                ? "bg-white text-amber-700 font-bold shadow-xs dark:bg-slate-800 dark:text-amber-300"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
            )}
          >
            Monitor
          </button>
        </div>
      </div>

      {/* Nav Sectors List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {filteredSectors.map((sector) => {
          const isCollapsed = Boolean(collapsedSections[sector.id]);

          return (
            <div key={sector.id} className="space-y-1">
              {/* Sector Header with Collapse Trigger */}
              <button
                type="button"
                onClick={() => toggleSection(sector.id)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5">
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-transform" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-transform" />
                  )}
                  <span className="uppercase tracking-wider text-[10px] font-extrabold text-slate-600 dark:text-slate-300">
                    {sector.title}
                  </span>
                </div>
                <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 h-4 border", sector.tagColor)}>
                  {sector.items.length}
                </Badge>
              </button>

              {/* Sector Items */}
              {!isCollapsed && (
                <div className="space-y-0.5 pt-0.5">
                  {sector.items.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
                          isActive
                            ? "bg-indigo-50/90 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-2 shadow-2xs dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-400"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              isActive
                                ? "text-indigo-600 dark:text-indigo-400"
                                : item.iconColor || "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                            )}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <Badge
                            className={cn(
                              "text-[9px] px-1.5 py-0 h-4 font-mono font-bold tracking-tight rounded-xs shrink-0 border-0",
                              item.badgeColor || "bg-slate-100 text-slate-600"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom User & Role Console */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-850 bg-slate-50/60 dark:bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {session?.user?.name?.[0] || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {session?.user?.name || "Alex Vance"}
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                {session?.user?.email || "admin@warenex.ai"}
              </span>
            </div>
          </div>
          <Badge className={cn("text-[9px] px-1.5 py-0 h-4 font-mono font-bold", currentBadgeClass)}>
            {userRole}
          </Badge>
        </div>

        {/* Quick Portal Switch Link */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold"
            title="Switch login portal"
          >
            <Lock className="h-3 w-3" />
            Switch Portal
          </Link>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-3 w-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
