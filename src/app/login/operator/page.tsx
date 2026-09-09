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
import { ScanBarcode, Loader2, ArrowLeft, KeyRound, Lock, Radio, UserCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function OperatorLoginPage() {
  const router = useRouter();
  const [badgeId, setBadgeId] = useState("OP-7749");
  const [pin, setPin] = useState("operator123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: badgeId, // auth.ts accepts Badge ID directly!
        password: pin,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Operator Badge ID or PIN invalid");
      } else {
        toast.success(`Badge ${badgeId} verified. Launching Picking Terminal...`);
        router.push("/picking");
        router.refresh();
      }
    } catch {
      toast.error("Handheld sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBadge = (bId: string, bPin: string) => {
    setBadgeId(bId);
    setPin(bPin);
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
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <ScanBarcode className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Floor Operator & Handheld Terminal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            RF Scanner Login • Fast Order Picking • Inbound Dock Putaway
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
              ROLE: OPERATOR
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 text-[10px] flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              RF TERMINAL OPTIMIZED
            </Badge>
          </div>
        </div>

        {/* Card */}
        <Card className="border-slate-200 shadow-md bg-white dark:bg-slate-900 dark:border-slate-800">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Operator Badge Authentication</CardTitle>
              <CardDescription className="text-xs">
                Scan your physical worker badge or enter your Badge ID & PIN.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="badgeId" className="text-xs font-medium">Worker Badge ID or Email</Label>
                <div className="relative">
                  <Input
                    id="badgeId"
                    type="text"
                    placeholder="e.g. OP-7749 or operator@warenex.ai"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
                    className="h-10 font-mono font-semibold text-sm tracking-wide text-emerald-700 dark:text-emerald-400"
                    required
                  />
                  <ScanBarcode className="absolute right-2.5 top-2.5 h-5 w-5 text-emerald-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pin" className="text-xs font-medium">Security PIN / Password</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="h-10 text-sm font-mono"
                    required
                  />
                  <Lock className="absolute right-2.5 top-2.5 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Quick Active Roster:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-[11px] justify-start border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800"
                    onClick={() => handleQuickBadge("OP-7749", "operator123")}
                  >
                    <UserCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                    Elena (OP-7749)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 text-[11px] justify-start border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800"
                    onClick={() => handleQuickBadge("operator@warenex.ai", "operator123")}
                  >
                    <KeyRound className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                    Email Mode
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm h-10 shadow-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Scan In & Start Pick Route
              </Button>

              <div className="flex items-center justify-between w-full text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
                  RFID Gateway Synced
                </span>
                <span>Zone A & B Active</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
