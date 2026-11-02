"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin, Building2, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { campService } from "@/services";
import { useLanguage } from "@/providers/language.provider";

export function UpcomingCampsSection() {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["home-camps"],
    queryFn: () => campService.getCamps({ limit: 3 }),
  });

  const camps = data?.data || [];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="size-3.5" />
              <span>Public Donation Drives</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.campSection.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t.campSection.subtitle}
            </p>
          </div>
          <Link href="/camps">
            <Button variant="outline" className="gap-2 font-medium">
              <span>{t.common.viewAll}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Camps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </Card>
            ))
          ) : camps.length > 0 ? (
            camps.map((camp) => (
              <Card
                key={camp.id}
                className="border border-border/80 bg-card hover:border-emerald-500/50 transition-all duration-200 shadow-xs flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Calendar className="size-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs uppercase font-bold"
                    >
                      {camp.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-lg leading-snug">
                      {camp.title}
                    </h4>
                    {camp.organization && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                        <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{camp.organization.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">
                        {new Date(camp.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {camp.venue}, {camp.district}
                      </span>
                    </div>
                  </div>

                  <Link href={`/camps/${camp.id}`} className="block pt-2">
                    <Button variant="default" size="sm" className="w-full text-xs font-semibold">
                      {t.campSection.registerCamp}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Calendar className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground">No upcoming donation camps scheduled.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Organizations can schedule public camps directly from their dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
