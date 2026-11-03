"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  User,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { donorService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { BloodGroup } from "@/types";
import {
  BANGLADESH_DIVISIONS,
  ALL_DISTRICTS,
  getDistrictsByDivision,
} from "@/constants/bangladesh-locations";

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

export default function DonorsPage() {
  const { t } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState<string>("ALL");
  const [division, setDivision] = useState<string>("ALL");
  const [district, setDistrict] = useState<string>("ALL");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 8;

  const availableDistricts =
    division !== "ALL" ? getDistrictsByDivision(division) : ALL_DISTRICTS;

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["donors-list", bloodGroup, district, availableOnly, page],
    queryFn: () =>
      donorService.getDonors({
        bloodGroup: bloodGroup === "ALL" ? undefined : bloodGroup,
        district: district === "ALL" ? undefined : district,
        isAvailable: availableOnly ? true : undefined,
        page,
        limit,
      }),
  });

  const donors = data?.data || [];
  const meta = data?.meta || { total: 0, totalPages: 1, page: 1, limit };

  const formatBloodGroup = (bg: string) => {
    return bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  const handleReset = () => {
    setBloodGroup("ALL");
    setDistrict("ALL");
    setAvailableOnly(false);
    setPage(1);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.donorSection.title}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Find verified blood donors across Bangladesh ready for emergency donations.
            </p>
          </div>
          <Link href="/register">
            <Button className="gap-2 font-semibold shadow-xs">
              <UserPlus className="size-4" />
              <span>{t.hero.becomeDonorBtn}</span>
            </Button>
          </Link>
        </div>

        {/* Filters Card */}
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.bloodGroup}
                </Label>
                <Select
                  value={bloodGroup}
                  onValueChange={(val) => {
                    if (val) {
                      setBloodGroup(val);
                      setPage(1);
                    }
                  }}
                >
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
                  Division
                </Label>
                <Select
                  value={division}
                  onValueChange={(val) => {
                    if (val) {
                      setDivision(val);
                      setDistrict("ALL");
                      setPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Divisions</SelectItem>
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.district}
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
                    {availableDistricts.map((dst) => (
                      <SelectItem key={dst} value={dst}>
                        {dst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Switch
                  id="available-only"
                  checked={availableOnly}
                  onCheckedChange={(checked) => {
                    setAvailableOnly(checked);
                    setPage(1);
                  }}
                />
                <Label htmlFor="available-only" className="text-sm font-medium cursor-pointer">
                  Available Only
                </Label>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full text-xs font-semibold"
                >
                  {t.common.clear} Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{donors.length}</strong> donors
            {meta.total ? ` of ${meta.total} total` : ""}
          </span>
          {meta.totalPages > 1 && (
            <span>
              Page {page} of {meta.totalPages}
            </span>
          )}
        </div>

        {/* Donor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="size-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded" />
                </div>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </Card>
            ))
          ) : donors.length > 0 ? (
            donors.map((donor) => (
              <Card
                key={donor.id}
                className="border border-border/80 bg-card hover:border-primary/50 transition-all duration-200 shadow-xs flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                      {donor.user?.name ? donor.user.name[0].toUpperCase() : <User className="size-5" />}
                    </div>
                    <Badge className="bg-primary text-white font-extrabold text-sm px-2.5 py-1">
                      {formatBloodGroup(donor.bloodGroup)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-foreground text-base leading-snug">
                      {donor.user?.name || "Anonymous Hero"}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3 text-primary shrink-0" />
                      <span>
                        {donor.district}
                        {donor.upazila ? `, ${donor.upazila}` : ""}
                      </span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge
                        variant="outline"
                        className={
                          donor.isAvailable
                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {donor.isAvailable ? t.common.available : t.common.unavailable}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Donations:</span>
                      <span className="font-semibold text-foreground">
                        {donor.totalDonations || 0} times
                      </span>
                    </div>
                    {donor.lastDonationDate && (
                      <div className="flex items-center justify-between">
                        <span>Last Donated:</span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(donor.lastDonationDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href={`/donors/${donor.id}`} className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                      {t.donorSection.contactDonor}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Heart className="size-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-bold text-foreground">
                {t.donorSection.noDonorsFound}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Try widening your search filters or register as a donor to support emergency patients in this area.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset Filters
                </Button>
                <Link href="/register">
                  <Button size="sm">{t.hero.becomeDonorBtn}</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
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
