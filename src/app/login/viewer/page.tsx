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
import { Eye, Loader2, ArrowLeft, KeyRound, Lock, Sparkles, Map } from "lucide-react";
import { toast } from "sonner";

export default function ViewerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("viewer@warenex.ai");
  const [password, setPassword] = useState("viewer123");
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
        toast.error("Invalid spectator credentials");
      } else {
        toast.success("Spectator session initialized. Redirecting to Digital Twin...");
        router.push("/digital-twin");
        router.refresh();
      }
    } catch {
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setLoading(true);
    try {
      await signIn("credentials", {
        email: "viewer@warenex.ai",
        password: "viewer123",
        redirect: false,
      });
      toast.success("One-click spectator access granted.");
      router.push("/digital-twin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Portal Directory
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Eye className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Auditor & Telemetry Spectator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Read-Only Telemetry • 2D Spatial Digital Twin • Compliance Audit
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px]">
              ROLE: VIEWER (READ-ONLY)
            </Badge>
          </div>
        </div>

        {/* Card */}
        <Card className="border-slate-200 shadow-md bg-white dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Guest & Spectator Access</CardTitle>
              <CardDescription className="text-xs">
                View live IoT sensor metrics, forklift trajectories, and rack occupancies without mutation rights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">Auditor Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
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

              {/* Instant 1-Click Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-[11px] justify-center gap-1.5 border-purple-200 bg-purple-50/40 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-850 dark:bg-purple-950/40"
                  onClick={handleInstantDemo}
                >
                  <Sparkles className="h-3 w-3 text-purple-600" />
                  Instant 1-Click Spectator Pass (James Miller)
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs h-9 shadow-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Launch 2D Digital Twin
              </Button>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Map className="h-3 w-3 text-purple-600" />
                  All 9 Zones Visible
                </span>
                <span>Zero write permissions</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
