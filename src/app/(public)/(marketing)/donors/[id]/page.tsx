"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Clock,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { donorService } from "@/services";
import { useLanguage } from "@/providers/language.provider";

export default function DonorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["donor-detail", id],
    queryFn: () => donorService.getDonorById(id),
  });

  const donor = data?.data;

  const formatBloodGroup = (bg: string) => {
    return bg?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || bg;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Card className="p-8 space-y-6">
          <div className="flex gap-4 items-center">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 mx-auto flex items-center justify-center">
          <User className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Donor Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested donor profile may have been removed or does not exist.
        </p>
        <Link href="/donors">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Back to Donors</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back navigation */}
        <Link href="/donors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />
          <span>{t.common.back} to Donors</span>
        </Link>

        {/* Profile Card */}
        <Card className="border border-border/80 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-red-600/10 via-rose-500/10 to-transparent border-b border-border/60" />

          <CardContent className="px-6 sm:px-8 pb-8 -mt-14 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="size-24 rounded-3xl bg-primary text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-background">
                  {donor.user?.name ? donor.user.name[0].toUpperCase() : <User className="size-10" />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {donor.user?.name || "Anonymous Donor"}
                    </h1>
                    <ShieldCheck className="size-5 text-emerald-600" />
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    <span>
                      {donor.district}
                      {donor.upazila ? `, ${donor.upazila}` : ""}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-white text-lg font-black px-4 py-1.5 shadow-sm">
                  {formatBloodGroup(donor.bloodGroup)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    donor.isAvailable
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-muted-foreground"
                  }
                >
                  {donor.isAvailable ? t.common.available : t.common.unavailable}
                </Badge>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Heart className="size-4 text-primary" />
                  <span>Total Donations</span>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {donor.totalDonations || 0} times
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="size-4 text-primary" />
                  <span>Last Donated</span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {donor.lastDonationDate
                    ? new Date(donor.lastDonationDate).toLocaleDateString()
                    : t.donorSection.neverDonated}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Clock className="size-4 text-emerald-600" />
                  <span>Member Since</span>
                </div>
                <p className="text-sm font-bold text-foreground">
                  {new Date(donor.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Bio / Statement */}
            {donor.bio && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  About Donor
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed p-4 rounded-xl bg-muted/20 border border-border/40">
                  &ldquo;{donor.bio}&rdquo;
                </p>
              </div>
            )}

            {/* Contact / Emergency Actions */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Emergency Contact Protocol</p>
                <p>Please only contact voluntary donors for legitimate medical requests.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {donor.user?.phone ? (
                  <a href={`tel:${donor.user.phone}`} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                      <Phone className="size-4" />
                      <span>Call {donor.user.phone}</span>
                    </Button>
                  </a>
                ) : (
                  <Link href="/blood-requests/create" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                      <Droplet className="size-4 fill-white" />
                      <span>Request Blood from Donor</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
