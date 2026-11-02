"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { organizationService } from "@/services";
import { useLanguage } from "@/providers/language.provider";

export default function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ["organization-detail", id],
    queryFn: () => organizationService.getOrganizationById(id),
  });

  const org = data?.data;

  const formatOrgType = (type?: string) => {
    switch (type) {
      case "HOSPITAL":
        return "Hospital";
      case "BLOOD_BANK":
        return "Blood Bank";
      case "VOLUNTEER_GROUP":
        return "Volunteer Group";
      default:
        return type || "Organization";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
          <Building2 className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Organization Not Found</h2>
        <p className="text-xs text-muted-foreground">
          This organization profile is unavailable or does not exist.
        </p>
        <Link href="/organizations">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Back to Organizations</span>
          </Button>
        </Link>
      </div>
    );
  }

  const camps = org.camps || [];

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/organizations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{t.common.back} to Organizations</span>
        </Link>

        {/* Organization Profile Card */}
        <Card className="border border-border shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-transparent border-b border-border/60" />

          <CardContent className="px-6 sm:px-8 pb-8 -mt-12 relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="size-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md border-4 border-background">
                  <Building2 className="size-10" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
                  </div>
                  <Badge variant="outline" className="text-xs uppercase font-bold">
                    {formatOrgType(org.type)}
                  </Badge>
                </div>
              </div>

              <div>
                {org.verificationStatus === "APPROVED" ? (
                  <Badge className="bg-emerald-600 text-white gap-1.5 px-3 py-1 text-xs font-bold">
                    <CheckCircle2 className="size-3.5" />
                    <span>Verified Organization</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-500/40 text-xs">
                    Verification Pending
                  </Badge>
                )}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary shrink-0" />
                  <span className="text-foreground">
                    {org.address}, {org.district}
                    {org.upazila ? `, ${org.upazila}` : ""}
                  </span>
                </div>
                {org.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span>{org.contactPhone}</span>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <span>{org.email}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2">
                <span className="font-bold text-foreground block">Verified Accreditation</span>
                <p className="text-muted-foreground leading-relaxed">
                  Accredited by the BloodLink Administrative Safety Board for clinical donation coordination and mobile camp drives.
                </p>
              </div>
            </div>

            {/* Contact Action */}
            {org.contactPhone && (
              <div className="pt-4 border-t border-border flex justify-end">
                <a href={`tel:${org.contactPhone}`}>
                  <Button className="gap-2 font-bold shadow-xs">
                    <Phone className="size-4" />
                    <span>Call Organization</span>
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organized Donation Camps */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span>Donation Camps Organized ({camps.length})</span>
          </h3>

          {camps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {camps.map((camp) => (
                <Card key={camp.id} className="border border-border/80">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">{camp.title}</h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {camp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-primary" />
                      <span>{camp.venue}, {camp.district}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3 text-primary" />
                      <span>{new Date(camp.date).toLocaleDateString()}</span>
                    </p>
                    <Link href={`/camps/${camp.id}`} className="block pt-2">
                      <Button variant="outline" size="xs" className="w-full font-semibold">
                        View Camp Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No donation camps currently scheduled by this organization.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
