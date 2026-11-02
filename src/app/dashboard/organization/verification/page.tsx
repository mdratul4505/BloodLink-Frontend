"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth.provider";

export default function OrgVerificationPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Organization Verification Status
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review your institution&apos;s administrative certification and verification credentials.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{user?.name || "Healthcare Partner"}</h3>
                <Badge className="bg-emerald-600 text-white text-xs font-bold">
                  VERIFIED
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Clinical accreditation granted by BloodLink Administrator Board.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Verified Compliance Checklist
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="text-foreground">Official Clinical License & Registration Authenticated</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="text-foreground">Authorized to organize and host mobile donation drives</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="text-foreground">Designated emergency contact hotline verified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
