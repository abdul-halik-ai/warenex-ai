"use client";

import { useSession } from "next-auth/react";
import { Settings, ShieldCheck, Key, User, Database, Radio, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEMO_USERS } from "@/lib/auth";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          System Settings & Access Control (RBAC)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Security configuration, role-based authorization matrix, and verified enterprise demo identities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Identity Card */}
        <Card className="border-slate-200 shadow-sm md:col-span-1">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Authenticated Session
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div>
              <div className="text-slate-500">Full Name:</div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {session?.user?.name || "Alex Vance"}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Email Address:</div>
              <div className="font-mono text-slate-700 dark:text-slate-300">
                {session?.user?.email || "admin@warenex.ai"}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Security Role:</div>
              <Badge className="bg-blue-600 text-white mt-1">
                {(session?.user as any)?.role || "ADMIN"}
              </Badge>
            </div>
            <div className="pt-2 border-t text-[11px] text-slate-500">
              Session Strategy: JWT (Stateless Bearer Token)
            </div>
          </CardContent>
        </Card>

        {/* Pre-configured Demo Accounts */}
        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader className="p-4 pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verified Enterprise Demo Accounts
            </CardTitle>
            <CardDescription className="text-xs">
              Use any of these pre-seeded accounts to test different permission tiers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-900/70">
                <TableRow className="text-[11px]">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Default Password</TableHead>
                  <TableHead>Permission Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y">
                {Object.values(DEMO_USERS).map((user) => (
                  <TableRow key={user.email}>
                    <TableCell className="font-mono font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-slate-500">{user.pass}</TableCell>
                    <TableCell className="text-[11px] text-slate-600 dark:text-slate-400">
                      {user.role === "ADMIN"
                        ? "Full root access & audit override"
                        : user.role === "WAREHOUSE_MANAGER"
                        ? "Inventory, Transfers, Restock POs"
                        : user.role === "SUPERVISOR"
                        ? "Discrepancy audit & Alert sign-off"
                        : user.role === "OPERATOR"
                        ? "Picking, Scans & Putaway"
                        : "Read-only telemetry spectator"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
