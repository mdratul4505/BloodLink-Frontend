"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2, CheckCircle2, MapPin, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { organizationService } from "@/services";
import { useLanguage } from "@/providers/language.provider";

export function VerifiedOrgsSection() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["home-organizations"],
    queryFn: () => organizationService.getOrganizations({ limit: 3 }),
  });

  const orgs = data?.data || [];

  const formatOrgType = (type: string) => {
    switch (type) {
      case "HOSPITAL":
        return "Hospital";
      case "BLOOD_BANK":
        return "Blood Bank";
      case "VOLUNTEER_GROUP":
        return "Volunteer Group";
      default:
        return type;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
              <ShieldCheck className="size-3.5" />
              <span>Verified Institutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.orgSection.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t.orgSection.subtitle}
            </p>
          </div>
          <Link href="/organizations">
            <Button variant="outline" className="gap-2 font-medium">
              <span>{t.common.viewAll}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </Card>
            ))
          ) : orgs.length > 0 ? (
            orgs.map((org) => (
              <Card
                key={org.id}
                className="border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 shadow-xs flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Building2 className="size-6" />
                    </div>
                    {org.verificationStatus === "APPROVED" && (
                      <Badge className="bg-emerald-600 text-white gap-1 text-[11px] font-semibold">
                        <CheckCircle2 className="size-3" />
                        <span>Verified</span>
                      </Badge>
                    )}
                  </div>

                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold mb-2">
                      {formatOrgType(org.type)}
                    </Badge>
                    <h4 className="font-bold text-foreground text-lg leading-snug">
                      {org.name}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {org.address}, {org.district}
                      </span>
                    </p>
                  </div>

                  {org.contactPhone && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <Phone className="size-3 text-muted-foreground" />
                      <span>{org.contactPhone}</span>
                    </div>
                  )}

                  <Link href={`/organizations/${org.id}`} className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      {t.orgSection.viewOrg}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Building2 className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground">No organizations listed yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Are you a healthcare facility or volunteer blood organization?
              </p>
              <Link href="/organizations/apply" className="inline-block mt-4">
                <Button size="sm" className="font-medium">
                  {t.orgSection.applyOrg}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
