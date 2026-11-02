"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  Droplet,
  MapPin,
  Phone,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { bloodRequestService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { UrgencyLevel } from "@/types";

export function EmergencyRequestsSection() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["home-blood-requests"],
    queryFn: () => bloodRequestService.getRequests({ status: "OPEN", limit: 3 }),
  });

  const requests = data?.data || [];

  const formatBloodGroup = (bg: string) => {
    return bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-600 text-white font-bold text-xs uppercase animate-pulse">
            Critical
          </Badge>
        );
      case "URGENT":
        return (
          <Badge className="bg-amber-600 text-white font-bold text-xs uppercase">
            Urgent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-xs uppercase">
            Normal
          </Badge>
        );
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs font-bold mb-3">
              <AlertCircle className="size-3.5" />
              <span>Immediate Attention</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.requestSection.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t.requestSection.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blood-requests/create">
              <Button className="gap-2 font-medium">
                <PlusCircle className="size-4" />
                <span>{t.requestSection.createRequest}</span>
              </Button>
            </Link>
            <Link href="/blood-requests">
              <Button variant="outline" className="gap-2 font-medium">
                <span>{t.common.viewAll}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </Card>
            ))
          ) : requests.length > 0 ? (
            requests.map((req) => (
              <Card
                key={req.id}
                className="border border-border/80 bg-card hover:border-red-500/50 transition-all duration-200 shadow-xs flex flex-col justify-between group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-primary text-white font-extrabold text-base px-3 py-1">
                      {formatBloodGroup(req.bloodGroup)}
                    </Badge>
                    {getUrgencyBadge(req.urgency)}
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
                      {req.hospitalName}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {req.district}
                        {req.upazila ? `, ${req.upazila}` : ""}
                      </span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.requestSection.unitsNeeded}:</span>
                      <span className="font-bold text-foreground">
                        {req.units} {t.common.bags} ({req.unitsFulfilled} {t.requestSection.unitsFulfilled})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.requestSection.neededBy}:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {new Date(req.neededBy).toLocaleDateString()}
                      </span>
                    </div>
                    {req.patientName && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t.requestSection.patient}:</span>
                        <span className="font-medium text-foreground">{req.patientName}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/blood-requests/${req.id}`} className="block pt-2">
                    <Button className="w-full gap-2 font-semibold shadow-xs">
                      <Droplet className="size-4 fill-white" />
                      <span>{t.requestSection.respondNow}</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Droplet className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground">{t.requestSection.noRequests}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Need urgent blood for a patient or surgery?
              </p>
              <Link href="/blood-requests/create" className="inline-block mt-4">
                <Button size="sm" className="font-medium">
                  {t.requestSection.createRequest}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
