"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  MapPin,
  Building2,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { campService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { ALL_DISTRICTS } from "@/constants/bangladesh-locations";

export default function CampsPage() {
  const { t } = useLanguage();
  const [district, setDistrict] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["camps-list", district, status, page],
    queryFn: () =>
      campService.getCamps({
        district: district === "ALL" ? undefined : district,
        status: status === "ALL" ? undefined : status,
        page,
        limit,
      }),
  });

  const camps = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1, page: 1, limit };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.campSection.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Public mobile blood drives and voluntary donation campaigns arranged by certified healthcare partners.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  District
                </Label>
                <Select
                  value={district}
                  onValueChange={(val) => {
                    if (val) {
                      setDistrict(val);
                      setPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Districts</SelectItem>
                    {ALL_DISTRICTS.map((dst) => (
                      <SelectItem key={dst} value={dst}>
                        {dst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Camp Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    if (val) {
                      setStatus(val);
                      setPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Statuses</SelectItem>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDistrict("ALL");
                    setStatus("ALL");
                    setPage(1);
                  }}
                  className="w-full text-xs font-semibold"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Camps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
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
                className="border border-border/80 bg-card hover:border-emerald-500/50 transition-all duration-200 shadow-xs flex flex-col justify-between group"
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
                    <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
                      {camp.title}
                    </h3>
                    {camp.organization && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                        <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{camp.organization.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 space-y-2 text-xs">
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
            <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Calendar className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-foreground">No Camps Scheduled</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No active donation campaigns found matching your selected criteria.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="pt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              <span>Previous</span>
            </Button>
            <span className="text-xs text-muted-foreground font-medium px-2">
              Page {page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="gap-1"
            >
              <span>Next</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
