"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  Droplet,
  Activity,
  Calendar,
  Bell,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { donorService, bloodRequestService } from "@/services";

export default function UserOverviewPage() {
  const { user, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const isDonorAvailable = user?.donorProfile?.isAvailable ?? true;

  const availabilityMutation = useMutation({
    mutationFn: (isAvailable: boolean) => donorService.updateMyAvailability(isAvailable),
    onSuccess: (res) => {
      refreshProfile();
      toast.add({
        title: "Availability Updated",
        description: res.data?.isAvailable
          ? "You are now marked as AVAILABLE for emergency requests."
          : "You are now marked as UNAVAILABLE for donations.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update Failed",
        description: err?.response?.data?.message || "Could not update availability status.",
        type: "error",
      });
    },
  });

  const { data: myRequestsData } = useQuery({
    queryKey: ["my-blood-requests"],
    queryFn: bloodRequestService.getMyRequests,
  });

  const myRequests = myRequestsData?.data || [];
  const openRequestsCount = myRequests.filter((r) => r.status === "OPEN").length;

  const formatBloodGroup = (bg?: string) => {
    return bg?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || "Not set";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md">
        <div className="space-y-2">
          <Badge className="bg-white/20 text-white border-0 font-bold text-xs uppercase tracking-wider">
            Donor Dashboard
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || "Blood Donor"}
          </h1>
          <p className="text-sm text-red-100 max-w-xl leading-relaxed">
            Thank you for being part of the BloodLink life-saving emergency coordination network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link href="/blood-requests/create">
            <Button className="bg-white text-red-700 hover:bg-red-50 font-bold shadow-md gap-2">
              <PlusCircle className="size-4" />
              <span>Create Blood Request</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Donor Status
              </span>
              <div className="size-8 rounded-lg bg-red-500/10 text-primary flex items-center justify-center">
                <Droplet className="size-4 fill-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {formatBloodGroup(user?.donorProfile?.bloodGroup)}
              </span>
              <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-500/40">
                Verified
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              District: {user?.donorProfile?.district || "Not set"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Total Donations
              </span>
              <div className="size-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Heart className="size-4 fill-rose-600" />
              </div>
            </div>
            <span className="text-2xl font-black text-foreground">
              {user?.donorProfile?.totalDonations || 0} Times
            </span>
            <p className="text-xs text-muted-foreground">
              Up to {(user?.donorProfile?.totalDonations || 0) * 3} lives touched
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                My Requests
              </span>
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Activity className="size-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-foreground">
              {myRequests.length} Total
            </span>
            <p className="text-xs text-muted-foreground">
              {openRequestsCount} currently open
            </p>
          </CardContent>
        </Card>

        {/* Quick Availability Card */}
        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Availability
              </span>
              <Switch
                id="toggle-avail"
                checked={isDonorAvailable}
                disabled={availabilityMutation.isPending}
                onCheckedChange={(checked) => availabilityMutation.mutate(checked)}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-lg font-bold ${
                  isDonorAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                }`}
              >
                {isDonorAvailable ? "Available to Donate" : "Currently Unavailable"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Toggle to receive emergency matching notifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent My Requests */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold">My Blood Requests</CardTitle>
            <CardDescription className="text-xs">
              Emergency requests you have posted on BloodLink
            </CardDescription>
          </div>
          <Link href="/dashboard/user/requests">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {myRequests.length > 0 ? (
            <div className="divide-y divide-border/60">
              {myRequests.slice(0, 4).map((req) => (
                <div key={req.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-white font-extrabold text-xs">
                      {formatBloodGroup(req.bloodGroup)}
                    </Badge>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{req.hospitalName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {req.district} • {req.units} Units Needed ({req.unitsFulfilled} Fulfilled)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {req.status}
                    </Badge>
                    <Link href={`/blood-requests/${req.id}`}>
                      <Button variant="ghost" size="xs">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-2">
              <Droplet className="size-8 mx-auto text-muted-foreground/40" />
              <p>You have not created any blood requests yet.</p>
              <Link href="/blood-requests/create" className="inline-block pt-1">
                <Button size="xs" variant="outline">
                  Create First Request
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
