"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Calendar, Heart, Shield, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { donorService } from "@/services";
import { useLanguage } from "@/providers/language.provider";
import { BloodGroup } from "@/types";

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

export function FindDonorsSection() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["home-donors", selectedGroup, selectedDistrict],
    queryFn: () =>
      donorService.getDonors({
        bloodGroup: selectedGroup === "ALL" ? undefined : selectedGroup,
        district: selectedDistrict === "ALL" ? undefined : selectedDistrict,
        limit: 4,
      }),
  });

  const donors = data?.data || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedGroup !== "ALL") params.set("group", selectedGroup);
    if (selectedDistrict !== "ALL") params.set("district", selectedDistrict);
    router.push(`/donors?${params.toString()}`);
  };

  const formatBloodGroup = (bg: string) => {
    return bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {t.donorSection.title}
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t.donorSection.subtitle}
            </p>
          </div>
          <Link href="/donors">
            <Button variant="outline" className="gap-2 font-medium">
              <span>{t.common.viewAll}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {/* Filter Bar */}
        <Card className="border border-border shadow-xs mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.bloodGroup}
                </label>
                <Select value={selectedGroup} onValueChange={(val) => val && setSelectedGroup(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.donorSection.selectBloodGroup} />
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
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  {t.common.district}
                </label>
                <Select value={selectedDistrict} onValueChange={(val) => val && setSelectedDistrict(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.donorSection.selectDistrict} />
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

              <div className="sm:self-end">
                <Button onClick={handleSearch} className="w-full gap-2 font-semibold">
                  <Search className="size-4" />
                  <span>{t.donorSection.searchBtn}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-border p-6 space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full rounded-lg" />
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
                    <h4 className="font-bold text-foreground text-base leading-snug">
                      {donor.user?.name || "Anonymous Donor"}
                    </h4>
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
                      <span>Total Donations:</span>
                      <span className="font-semibold text-foreground">
                        {donor.totalDonations || 0} times
                      </span>
                    </div>
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
            <div className="col-span-full py-12 text-center bg-card rounded-2xl border border-dashed border-border p-8">
              <Heart className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-foreground">{t.donorSection.noDonorsFound}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first hero to register as a donor in this category!
              </p>
              <Link href="/register" className="inline-block mt-4">
                <Button size="sm" className="font-medium">
                  {t.hero.becomeDonorBtn}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
