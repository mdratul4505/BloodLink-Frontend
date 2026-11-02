"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { campService } from "@/services";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";

export default function CampDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["camp-detail", id],
    queryFn: () => campService.getCampById(id),
  });

  const registerMutation = useMutation({
    mutationFn: () => campService.registerForCamp(id),
    onSuccess: () => {
      toast.add({
        title: "Registration Confirmed",
        description: "You have successfully registered as a donor participant for this camp!",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["camp-detail", id] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Registration failed or already registered.";
      toast.add({
        title: "Registration Notice",
        description: msg,
        type: "error",
      });
    },
  });

  const camp = data?.data;

  const handleRegister = () => {
    if (!isAuthenticated) {
      toast.add({
        title: "Sign In Required",
        description: "Please sign in to register for this blood donation camp.",
        type: "warning",
      });
      router.push(`/login?redirect=/camps/${id}`);
      return;
    }
    registerMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
          <Calendar className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Donation Camp Not Found</h2>
        <p className="text-xs text-muted-foreground">
          This donation camp might have ended or is no longer listed.
        </p>
        <Link href="/camps">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Back to Donation Camps</span>
          </Button>
        </Link>
      </div>
    );
  }

  const registrationsCount = camp.registrations?.length || 0;

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/camps"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{t.common.back} to Camps</span>
        </Link>

        {/* Camp Overview Card */}
        <Card className="border border-border shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-transparent border-b border-border/60" />

          <CardContent className="px-6 sm:px-8 pb-8 -mt-12 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="size-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md border-4 border-background">
                  <Calendar className="size-10" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-foreground">{camp.title}</h1>
                  {camp.organization && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span>{camp.organization.name}</span>
                    </p>
                  )}
                </div>
              </div>

              <Badge
                variant="outline"
                className="border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 text-xs uppercase"
              >
                {camp.status}
              </Badge>
            </div>

            {/* Event Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Event Date</span>
                <span className="text-base font-bold text-foreground">
                  {new Date(camp.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Venue Location</span>
                <span className="text-base font-bold text-foreground">
                  {camp.venue}, {camp.district}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Participants Registered</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {registrationsCount} Donors Joined
                </span>
              </div>
            </div>

            {/* Description */}
            {camp.description && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Campaign Details & Objectives
                </h4>
                <p className="text-sm text-foreground p-4 rounded-xl bg-muted/20 border border-border/60 leading-relaxed">
                  {camp.description}
                </p>
              </div>
            )}

            {/* Registration Action */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Voluntary Blood Drive Participation</p>
                <p>Registered participants receive automated reminder notifications and verified donor certificates.</p>
              </div>

              <Button
                size="lg"
                onClick={handleRegister}
                disabled={registerMutation.isPending || camp.status === "COMPLETED"}
                className="w-full sm:w-auto font-bold shadow-md gap-2"
              >
                <Heart className="size-4 fill-white" />
                <span>
                  {registerMutation.isPending
                    ? "Registering..."
                    : camp.status === "COMPLETED"
                    ? "Camp Completed"
                    : "Register to Donate at this Camp"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
