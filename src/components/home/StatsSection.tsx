"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Droplets, HeartPulse, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { statsService } from "@/services";
import { useLanguage } from "@/providers/language.provider";

export function StatsSection() {
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["home-stats"],
    queryFn: statsService.getStats,
    staleTime: 60 * 1000,
  });

  const statItems = [
    {
      label: t.stats.totalDonors,
      value: stats?.totalDonors ?? 0,
      icon: Users,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10",
      border: "hover:border-red-500/40",
    },
    {
      label: t.stats.bloodRequests,
      value: stats?.totalRequests ?? 0,
      icon: Droplets,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/40",
    },
    {
      label: t.stats.livesSupported,
      // Each completed donation/request touches multiple lives
      value: (stats?.totalRequests ? stats.totalRequests * 3 : 0) || 0,
      icon: HeartPulse,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
    },
    {
      label: t.stats.organizations,
      value: stats?.verifiedOrganizations ?? 0,
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
    },
  ];

  return (
    <section className="py-12 border-y border-border/60 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className={`transition-all duration-200 border border-border shadow-xs ${item.border}`}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg}`}
                  >
                    <Icon className={`size-6 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                      {isLoading ? "..." : item.value.toLocaleString()}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">
                      {item.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
