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
import { AlertCircle, Loader2, ArrowLeft, KeyRound, Lock, ClipboardCheck, BellRing } from "lucide-react";
import { toast } from "sonner";

export default function SupervisorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("supervisor@warenex.ai");
  const [password, setPassword] = useState("super123");
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
        toast.error("Invalid supervisor credentials");
      } else {
        toast.success("Shift Lead authenticated. Directing to Alerts & Anomaly Center...");
        router.push("/alerts");
        router.refresh();
      }
    } catch {
      toast.error("Authentication server unavailable");
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
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shift Supervisor & Quality Audit Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Discrepancy Triage • Quarantine Approvals • Cold Chain Oversight
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px]">
              ROLE: SUPERVISOR
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 text-[10px]">
              SHIFT: DAY TIER-A
            </Badge>
          </div>
        </div>

        {/* Card */}
        <Card className="border-slate-200 shadow-md bg-white dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Supervisor Authentication</CardTitle>
              <CardDescription className="text-xs">
                Review flagged anomalies, verify stock discrepancies, and approve POs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">Supervisor Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="supervisor@warenex.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium">Shift Authorization Code</Label>
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

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-[11px] justify-start border-slate-200 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-800"
                  onClick={() => {
                    setEmail("supervisor@warenex.ai");
                    setPassword("super123");
                  }}
                >
                  <KeyRound className="mr-1.5 h-3 w-3 text-amber-600" />
                  Pre-fill: Marcus Brody (Shift Lead / super123)
                </Button>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs h-9 shadow-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Authorize Shift & Open Alert Queue
              </Button>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <BellRing className="h-3 w-3 text-amber-600" />
                  1 active thermal alert pending sign-off
                </span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
