"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { organizationService } from "@/services";
import { useAuth } from "@/providers/auth.provider";
import {
  BANGLADESH_DIVISIONS,
  getDistrictsByDivision,
  ALL_DISTRICTS,
} from "@/constants/bangladesh-locations";

export default function ApplyOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState<string>("HOSPITAL");
  const [address, setAddress] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const availableDistricts = division ? getDistrictsByDivision(division) : ALL_DISTRICTS;

  const applyMutation = useMutation({
    mutationFn: organizationService.createOrganization,
    onSuccess: (res) => {
      toast.add({
        title: "Application Submitted",
        description: "Your organization application has been received and is pending administrator verification.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations-list"] });
      const newId = res.data?.id;
      if (newId) {
        router.push(`/organizations/${newId}`);
      } else {
        router.push("/organizations");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to submit organization application.";
      setErrorMsg(msg);
      toast.add({
        title: "Application Error",
        description: msg,
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isAuthenticated) {
      toast.add({
        title: "Sign In Required",
        description: "Please sign in to your BloodLink account to submit an organization application.",
        type: "warning",
      });
      router.push("/login?redirect=/organizations/apply");
      return;
    }

    if (!name.trim()) {
      setErrorMsg("Please enter organization name.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter physical street address.");
      return;
    }
    if (!district) {
      setErrorMsg("Please select district.");
      return;
    }

    applyMutation.mutate({
      name: name.trim(),
      type,
      address: address.trim(),
      district,
      upazila: upazila.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/organizations"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Organizations</span>
        </Link>

        <Card className="border border-border shadow-sm">
          <CardHeader className="space-y-1">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
              <Building2 className="size-5" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Register Healthcare Organization
            </CardTitle>
            <CardDescription>
              Register your hospital, clinical blood bank, or volunteer blood donation network for platform verification.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="org-name" className="text-xs font-bold">
                  Organization / Hospital Name *
                </Label>
                <Input
                  id="org-name"
                  placeholder="e.g. Bangladesh Red Crescent Blood Bank"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="org-type" className="text-xs font-bold">
                    Organization Type *
                  </Label>
                  <Select value={type} onValueChange={(val) => { if (val) setType(val); }}>
                    <SelectTrigger id="org-type" className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOSPITAL">Hospital / Medical Center</SelectItem>
                      <SelectItem value="BLOOD_BANK">Blood Bank / Transfusion Center</SelectItem>
                      <SelectItem value="VOLUNTEER_GROUP">Volunteer Donation Society</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="division" className="text-xs font-bold">
                    Division *
                  </Label>
                  <Select
                    value={division}
                    onValueChange={(val) => {
                      if (val) {
                        setDivision(val);
                        setDistrict("");
                      }
                    }}
                  >
                    <SelectTrigger id="division" className="w-full">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <SelectItem key={div} value={div}>
                          {div}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-bold">
                    District *
                  </Label>
                  <Select
                    value={district}
                    onValueChange={(val) => val && setDistrict(val)}
                    disabled={!division}
                  >
                    <SelectTrigger id="district" className="w-full">
                      <SelectValue
                        placeholder={division ? "Select District" : "Select Division first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((dst) => (
                        <SelectItem key={dst} value={dst}>
                          {dst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-bold">
                    Street Address / Venue *
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g. 684/1 West Shewrapara"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="upazila" className="text-xs font-bold">
                    Upazila / Thana (Optional)
                  </Label>
                  <Input
                    id="upazila"
                    placeholder="e.g. Mirpur"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold">
                    Official Contact Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 01700000000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold">
                    Official Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. info@bloodbank.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={applyMutation.isPending}
                  className="w-full font-bold shadow-md gap-2"
                >
                  <ShieldCheck className="size-5" />
                  <span>
                    {applyMutation.isPending ? "Submitting Application..." : "Submit for Verification"}
                  </span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
