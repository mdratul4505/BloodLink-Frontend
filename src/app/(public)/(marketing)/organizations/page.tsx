"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
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
import { organizationService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { ALL_DISTRICTS } from "@/constants/bangladesh-locations";

export default function OrganizationsPage() {
  const { t } = useLanguage();
  const [district, setDistrict] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["organizations-list", district, page],
    queryFn: () =>
      organizationService.getOrganizations({
        district: district === "ALL" ? undefined : district,
        page,
        limit,
      }),
  });

  const orgs = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1, page: 1, limit };

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
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.orgSection.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Verified partner hospitals, blood banks, and community donation teams.
            </p>
          </div>
          <Link href="/organizations/apply">
            <Button size="lg" className="gap-2 font-bold shadow-xs">
              <PlusCircle className="size-4" />
              <span>{t.orgSection.applyOrg}</span>
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Filter by District
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
                <Button
                  variant="outline"
                  onClick={() => {
                    setDistrict("ALL");
                    setPage(1);
                  }}
                  className="w-full text-xs font-semibold"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orgs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-lg" />
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
                    <h3 className="font-bold text-foreground text-lg leading-snug">
                      {org.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {org.address}, {org.district}
                      </span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1">
                    {org.contactPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="size-3 text-muted-foreground" />
                        <span>{org.contactPhone}</span>
                      </div>
                    )}
                    {org.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3 text-muted-foreground" />
                        <span>{org.email}</span>
                      </div>
                    )}
                  </div>

                  <Link href={`/organizations/${org.id}`} className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      {t.orgSection.viewOrg}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Building2 className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-foreground">No Organizations Listed</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Are you a healthcare facility or volunteer blood donation team?
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Link href="/organizations/apply">
                  <Button size="sm">{t.orgSection.applyOrg}</Button>
                </Link>
              </div>
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
