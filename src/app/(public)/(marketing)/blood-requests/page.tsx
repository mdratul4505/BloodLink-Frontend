"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Calendar,
  Droplet,
  MapPin,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
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
import { bloodRequestService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { BloodGroup, UrgencyLevel, RequestStatus } from "@/types";

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: "A_POSITIVE", label: "A Positive (A+)" },
  { value: "A_NEGATIVE", label: "A Negative (A-)" },
  { value: "B_POSITIVE", label: "B Positive (B+)" },
  { value: "B_NEGATIVE", label: "B Negative (B-)" },
  { value: "AB_POSITIVE", label: "AB Positive (AB+)" },
  { value: "AB_NEGATIVE", label: "AB Negative (AB-)" },
  { value: "O_POSITIVE", label: "O Positive (O+)" },
  { value: "O_NEGATIVE", label: "O Negative (O-)" },
];

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Satkhira",
  "Gazipur",
  "Narayanganj",
  "Bogura",
];

export default function BloodRequestsPage() {
  const { t } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState<string>("ALL");
  const [district, setDistrict] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");
  const [urgency, setUrgency] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ["requests-list", bloodGroup, district, status, urgency, page],
    queryFn: () =>
      bloodRequestService.getRequests({
        bloodGroup: bloodGroup === "ALL" ? undefined : bloodGroup,
        district: district === "ALL" ? undefined : district,
        status: status === "ALL" ? undefined : status,
        urgency: urgency === "ALL" ? undefined : urgency,
        page,
        limit,
      }),
  });

  const requests = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1, page: 1, limit };

  const formatBloodGroup = (bg: string) => {
    return bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  const getUrgencyBadge = (urg: UrgencyLevel) => {
    switch (urg) {
      case "CRITICAL":
        return <Badge className="bg-red-600 text-white font-bold text-xs uppercase animate-pulse">Critical</Badge>;
      case "URGENT":
        return <Badge className="bg-amber-600 text-white font-bold text-xs uppercase">Urgent</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground text-xs uppercase">Normal</Badge>;
    }
  };

  const handleReset = () => {
    setBloodGroup("ALL");
    setDistrict("ALL");
    setStatus("ALL");
    setUrgency("ALL");
    setPage(1);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.requestSection.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Active urgent and critical blood donation requests across hospitals and blood banks.
            </p>
          </div>
          <Link href="/blood-requests/create">
            <Button size="lg" className="gap-2 font-bold shadow-xs">
              <PlusCircle className="size-4" />
              <span>{t.requestSection.createRequest}</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.bloodGroup}
                </Label>
                <Select value={bloodGroup} onValueChange={(val) => { if (val) { setBloodGroup(val); setPage(1); }}}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Blood Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Groups</SelectItem>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg.value} value={bg.value}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.district}
                </Label>
                <Select value={district} onValueChange={(val) => { if (val) { setDistrict(val); setPage(1); }}}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Districts</SelectItem>
                    {DISTRICTS.map((dst) => (
                      <SelectItem key={dst} value={dst}>
                        {dst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Urgency Level
                </Label>
                <Select value={urgency} onValueChange={(val) => { if (val) { setUrgency(val); setPage(1); }}}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Urgencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Urgencies</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Status
                </Label>
                <Select value={status} onValueChange={(val) => { if (val) { setStatus(val); setPage(1); }}}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t.common.all} Statuses</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="PARTIALLY_FULFILLED">Partially Fulfilled</SelectItem>
                    <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button variant="outline" onClick={handleReset} className="w-full text-xs font-semibold">
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Grid */}
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
                    <h3 className="font-bold text-foreground text-lg leading-snug group-hover:text-primary transition-colors">
                      {req.hospitalName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="size-3.5 text-primary shrink-0" />
                      <span>
                        {req.district}
                        {req.upazila ? `, ${req.upazila}` : ""}
                      </span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t.requestSection.unitsNeeded}:</span>
                      <span className="font-bold text-foreground">
                        {req.units} {t.common.bags} ({req.unitsFulfilled} fulfilled)
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
            <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Droplet className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-foreground">{t.requestSection.noRequests}</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No active blood requests currently match your selected filters.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset Filters
                </Button>
                <Link href="/blood-requests/create">
                  <Button size="sm">{t.requestSection.createRequest}</Button>
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
