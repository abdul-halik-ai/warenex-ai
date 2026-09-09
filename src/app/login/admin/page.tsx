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
import { ShieldCheck, Loader2, ArrowLeft, KeyRound, Building2, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@warenex.ai");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid administrator credentials");
      } else {
        toast.success("Executive authentication approved. Redirecting to Command Center...");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Authentication server unavailable");
    } finally {
      setLoading(false);
    }
  };

  const setRoleDemo = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        {/* Back navigation */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Portal Directory
        </Link>

        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive & Ops Management Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tier-1 Root Access • System Auditing • Autonomous Operations
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px]">
              ROLE: ADMIN & WAREHOUSE_MANAGER
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-200 shadow-md bg-white dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Administrator Sign In</CardTitle>
              <CardDescription className="text-xs">
                Enter your administrative credentials to access facility controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">Enterprise Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@warenex.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                  <Building2 className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">Master Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                  <Lock className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              {/* Quick Credentials Switcher */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Quick Demo Accounts:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] justify-start border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800"
                    onClick={() => setRoleDemo("admin@warenex.ai", "admin123")}
                  >
                    <KeyRound className="mr-1.5 h-3 w-3 text-blue-600" />
                    Admin (Root)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-[11px] justify-start border-slate-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800"
                    onClick={() => setRoleDemo("manager@warenex.ai", "manager123")}
                  >
                    <KeyRound className="mr-1.5 h-3 w-3 text-indigo-600" />
                    Operations Dir.
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9 shadow-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Authorize & Access Command Center
              </Button>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Audit logging active
                </span>
                <span>Port 3000 • SSL 256-bit</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
