"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Activity, ShieldCheck, Heart, AlertCircle, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { donorService } from "@/services";
import { useAuth } from "@/providers/auth.provider";

export default function MyAvailabilityPage() {
  const { user, refreshProfile } = useAuth();

  const isAvailable = user?.donorProfile?.isAvailable ?? true;
  const lastDonationDate = user?.donorProfile?.lastDonationDate;

  const mutation = useMutation({
    mutationFn: (val: boolean) => donorService.updateMyAvailability(val),
    onSuccess: (res) => {
      refreshProfile();
      toast.add({
        title: "Availability Updated",
        description: res.data?.isAvailable
          ? "You are now publicly listed as ready and available to donate blood."
          : "You have paused donor availability.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update Error",
        description: err?.response?.data?.message || "Failed to update availability.",
        type: "error",
      });
    },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Blood Donor Availability
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Control your active donor status for emergency matching alerts and public directory listings.
        </p>
      </div>

      {/* Main Switch Card */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center ${
                    isAvailable ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Activity className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAvailable ? "Available to Donate Blood" : "Unavailable for Blood Donation"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={
                      isAvailable
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                        : "text-muted-foreground text-xs"
                    }
                  >
                    {isAvailable ? "Status: Ready & Active" : "Status: Paused"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Switch
                id="avail-toggle"
                checked={isAvailable}
                disabled={mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate(checked)}
                className="scale-125"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>When Available</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>You appear in emergency donor discovery searches for your blood group.</li>
                <li>You receive instant in-app alerts when nearby patients need blood.</li>
                <li>Requesters can coordinate donations directly with you.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <AlertCircle className="size-4 text-amber-600" />
                <span>When Paused / Unavailable</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Recommended if you recently donated blood within the past 90 days.</li>
                <li>Recommended if you are traveling, unwell, or temporarily unfit to donate.</li>
                <li>Your profile remains safe and you can reactivate at any time.</li>
              </ul>
            </div>
          </div>

          {lastDonationDate && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span className="font-semibold text-foreground">Last Recorded Donation:</span>
                <span className="text-muted-foreground">
                  {new Date(lastDonationDate).toLocaleDateString()}
                </span>
              </div>
              <Badge className="bg-primary text-white text-[10px]">
                {user?.donorProfile?.totalDonations || 0} Total Badges
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
