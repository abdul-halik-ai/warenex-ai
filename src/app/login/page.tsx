"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Box,
  Loader2,
  ShieldCheck,
  ClipboardCheck,
  ScanBarcode,
  Eye,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Building2,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { DEMO_USERS } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [identifier, setIdentifier] = useState<string>("admin@warenex.ai");
  const [password, setPassword] = useState<string>("admin123");
  const [loading, setLoading] = useState(false);

  const roleConfigs: Record<string, {
    label: string;
    badge: string;
    icon: any;
    desc: string;
    portalHref: string;
    color: string;
    borderColor: string;
    bgAccent: string;
    targetRoute: string;
    defaultUser: string;
    defaultPass: string;
    placeholder: string;
  }> = {
    admin: {
      label: "Management",
      badge: "ADMIN & MANAGER",
      icon: ShieldCheck,
      desc: "Full root access, inventory transfers, settings & PO approvals.",
      portalHref: "/login/admin",
      color: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      bgAccent: "bg-blue-50/60 dark:bg-blue-950/40",
      targetRoute: "/",
      defaultUser: "admin@warenex.ai",
      defaultPass: "admin123",
      placeholder: "admin@warenex.ai"
    },
    supervisor: {
      label: "Supervisor",
      badge: "SUPERVISOR",
      icon: ClipboardCheck,
      desc: "Shift quality review, anomaly triage & alert resolution.",
      portalHref: "/login/supervisor",
      color: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      bgAccent: "bg-amber-50/60 dark:bg-amber-950/40",
      targetRoute: "/alerts",
      defaultUser: "supervisor@warenex.ai",
      defaultPass: "super123",
      placeholder: "supervisor@warenex.ai"
    },
    operator: {
      label: "Floor Operator",
      badge: "OPERATOR",
      icon: ScanBarcode,
      desc: "Handheld RF picking routes, barcode scans & putaway.",
      portalHref: "/login/operator",
      color: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      bgAccent: "bg-emerald-50/60 dark:bg-emerald-950/40",
      targetRoute: "/picking",
      defaultUser: "OP-7749",
      defaultPass: "operator123",
      placeholder: "Badge ID (e.g. OP-7749)"
    },
    viewer: {
      label: "Auditor / Spectator",
      badge: "VIEWER",
      icon: Eye,
      desc: "Read-only live telemetry, 2D digital twin & audit observer.",
      portalHref: "/login/viewer",
      color: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      bgAccent: "bg-purple-50/60 dark:bg-purple-950/40",
      targetRoute: "/digital-twin",
      defaultUser: "viewer@warenex.ai",
      defaultPass: "viewer123",
      placeholder: "viewer@warenex.ai"
    }
  };

  const handleTabChange = (roleKey: string) => {
    setSelectedRole(roleKey);
    const config = roleConfigs[roleKey];
    if (config) {
      setIdentifier(config.defaultUser);
      setPassword(config.defaultPass);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: identifier,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials or badge ID");
      } else {
        const dest = roleConfigs[selectedRole]?.targetRoute || "/";
        toast.success("Authentication confirmed. Directing to your workspace...");
        router.push(dest);
        router.refresh();
      }
    } catch {
      toast.error("Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  const currentCfg = roleConfigs[selectedRole] || roleConfigs.admin;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-2xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Box className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              WARENEX AI
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Enterprise Warehouse Authentication Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            Select a dedicated operational portal or authenticate below. Role permissions enforce granular floor access.
          </p>
        </div>

        {/* Dedicated Portals Directory (Role Separation Cards) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Dedicated Role Portals:
            </span>
            <span className="text-[11px] text-slate-400">Choose your terminal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Portal Card */}
            <Link
              href="/login/admin"
              className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      Management Portal
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Alex Vance & Sarah Chen
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-[9px] border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300">
                    Full Root Access & Audits
                  </Badge>
                </div>
              </div>
            </Link>

            {/* Supervisor Portal Card */}
            <Link
              href="/login/supervisor"
              className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                      Supervisor Portal
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Marcus Brody (Shift Lead)
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-[9px] border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300">
                    Discrepancies & Alerts
                  </Badge>
                </div>
              </div>
            </Link>

            {/* Operator Portal Card */}
            <Link
              href="/login/operator"
              className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <ScanBarcode className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                      Operator Terminal
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Elena Rostova (Badge OP-7749)
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-[9px] border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300">
                    Badge Scan & Pick Routes
                  </Badge>
                </div>
              </div>
            </Link>

            {/* Viewer Portal Card */}
            <Link
              href="/login/viewer"
              className="group p-3.5 rounded-xl border border-slate-200 bg-white hover:border-purple-400 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <Eye className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
                      Auditor / Viewer
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    James Miller (Guest Pass)
                  </p>
                  <Badge variant="outline" className="mt-1.5 text-[9px] border-purple-200 text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300">
                    Read-Only Digital Twin
                  </Badge>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Sign-in Card with Role Tabs */}
        <Card className="border-slate-200 shadow-md bg-white dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  Quick Multi-Role Sign In
                </CardTitle>
                <CardDescription className="text-xs">
                  Switch roles below for automatic pre-fill and direct landing page routing.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] border-slate-200 font-mono">
                WH-01 HUB
              </Badge>
            </div>

            {/* Role Tabs */}
            <div className="pt-3">
              <Tabs value={selectedRole} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-4 w-full h-9 bg-slate-100 p-1 dark:bg-slate-800 text-xs">
                  <TabsTrigger value="admin" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-xs">
                    Admin
                  </TabsTrigger>
                  <TabsTrigger value="supervisor" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-xs">
                    Supervisor
                  </TabsTrigger>
                  <TabsTrigger value="operator" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs">
                    Operator
                  </TabsTrigger>
                  <TabsTrigger value="viewer" className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-xs">
                    Viewer
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-3.5 pt-4">
              {/* Selected Role Info Banner */}
              <div className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${currentCfg.borderColor} ${currentCfg.bgAccent}`}>
                <currentCfg.icon className={`h-4 w-4 mt-0.5 shrink-0 ${currentCfg.color}`} />
                <div className="text-xs flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{currentCfg.label} Mode</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      &bull; Target: <span className="font-mono text-slate-700 dark:text-slate-300">{currentCfg.targetRoute}</span>
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                    {currentCfg.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="identifier" className="text-xs font-medium">
                  {selectedRole === "operator" ? "Worker Badge ID or Email" : "Enterprise Email"}
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder={currentCfg.placeholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium">
                    {selectedRole === "operator" ? "Terminal PIN / Password" : "Password"}
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 pt-1">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 shadow-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign in as {currentCfg.label}
              </Button>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  RBAC Session Protected
                </span>
                <Link
                  href={currentCfg.portalHref}
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Open Dedicated Portal &rarr;
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
