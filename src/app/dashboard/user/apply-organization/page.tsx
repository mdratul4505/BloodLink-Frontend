"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  BANGLADESH_DIVISIONS,
  getDistrictsByDivision,
  ALL_DISTRICTS,
} from "@/constants/bangladesh-locations";

export default function UserApplyOrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState("");
  const [type, setType] = useState<string>("HOSPITAL");
  const [address, setAddress] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableDistricts = division ? getDistrictsByDivision(division) : ALL_DISTRICTS;

  // Fetch current user details with latest ownedOrganizations
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["my-profile-org"],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.USERS.ME);
      return res.data?.data || res.data;
    },
  });

  const currentUser = profileData || user;
  const ownedOrg = currentUser?.ownedOrganizations?.[0];
  const isOrgUser = currentUser?.role === "ORGANIZATION" || currentUser?.role === "HOSPITAL";

  const applyMutation = useMutation({
    mutationFn: organizationService.createOrganization,
    onSuccess: async () => {
      toast.add({
        title: "Application Submitted Successfully",
        description:
          "Your organization application has been received and is pending administrator review.",
        type: "success",
      });
      await refreshProfile();
      await refetchProfile();
      queryClient.invalidateQueries({ queryKey: ["my-profile-org"] });
      queryClient.invalidateQueries({ queryKey: ["admin-verify-orgs-list"] });
      setShowNewForm(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to submit organization application.";
      setErrorMsg(msg);
      toast.add({
        title: "Application Failed",
        description: msg,
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter organization / hospital name.");
      return;
    }
    if (!division) {
      setErrorMsg("Please select division.");
      return;
    }
    if (!district) {
      setErrorMsg("Please select district.");
      return;
    }
    if (!address.trim()) {
      setErrorMsg("Please enter street address / venue.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg("Please provide an official emergency contact phone number.");
      return;
    }

    applyMutation.mutate({
      name: name.trim(),
      type,
      address: address.trim(),
      district,
      upazila: upazila.trim() || undefined,
      contactPhone: contactPhone.trim(),
      email: email.trim() || undefined,
    });
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      await refetchProfile();
      toast.add({
        title: "Status Refreshed",
        description: "Checked for latest administrator verification updates.",
        type: "info",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Apply as Healthcare Organization
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Register your hospital, blood bank, or volunteer foundation to host donation drives and coordinate emergency supplies.
        </p>
      </div>

      {/* Case 1: Already Approved Organization */}
      {isOrgUser || ownedOrg?.verificationStatus === "APPROVED" ? (
        <Card className="border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-7" />
              </div>
              <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase px-3 py-1">
                Verified Organization
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-2">
              {ownedOrg?.name || currentUser?.name}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Official healthcare partner verified by BloodLink Administration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-background border border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Type</span>
                <span className="font-bold text-foreground">{ownedOrg?.type || "HOSPITAL"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">District</span>
                <span className="font-bold text-foreground">{ownedOrg?.district || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Hotline</span>
                <span className="font-bold text-foreground">{ownedOrg?.contactPhone || currentUser?.phone || "N/A"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold">
                Your role has been upgraded to <strong>ORGANIZATION</strong>. You have full access to create mobile camps, manage participant registrations, and broadcast coordinated emergency requests.
              </p>
            </div>

            <div className="flex justify-end">
              <Link href="/dashboard/organization">
                <Button className="gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                  <span>Go to Organization Hub</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Case 2: Pending Application */}
      {!isOrgUser && ownedOrg?.verificationStatus === "PENDING" && !showNewForm ? (
        <Card className="border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/20 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="size-7" />
              </div>
              <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10 font-bold text-xs uppercase px-3 py-1">
                Verification Pending
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-2">
              Application Under Review: {ownedOrg.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Submitted on {new Date(ownedOrg.createdAt).toLocaleDateString()} • Pending administrator verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-background border border-border text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Organization Type</span>
                <span className="font-bold text-foreground">{ownedOrg.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">District & Location</span>
                <span className="font-bold text-foreground">
                  {ownedOrg.district}
                  {ownedOrg.upazila ? `, ${ownedOrg.upazila}` : ""}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Address / Venue</span>
                <span className="font-bold text-foreground">{ownedOrg.address}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-semibold">Contact Hotline</span>
                <span className="font-bold text-foreground">{ownedOrg.contactPhone || "N/A"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Info className="size-4 text-primary" />
                <span>What happens next?</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Platform administrators verify clinical hospital licenses and organization documentation to ensure security and trust. Once an admin approves your application in the <strong>Admin Verification portal</strong>, your role will automatically upgrade from <strong>USER</strong> to <strong>ORGANIZATION</strong>, granting immediate access to the Organization Hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="gap-2 text-xs font-semibold"
              >
                <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Check for Approval</span>
              </Button>

              <span className="text-[11px] text-muted-foreground">
                You will also receive an in-app notification when reviewed.
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Case 3: Rejected Application */}
      {!isOrgUser && ownedOrg?.verificationStatus === "REJECTED" && !showNewForm ? (
        <Card className="border-destructive/40 bg-destructive/5 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="size-7" />
              </div>
              <Badge className="bg-destructive text-white font-bold text-xs uppercase px-3 py-1">
                Application Rejected
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold mt-2">
              Application for {ownedOrg.name} was not approved
            </CardTitle>
            <CardDescription className="text-xs">
              Reason provided by administration: {ownedOrg.rejectionReason || "Verification criteria not met"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              You can review the feedback above and submit an updated application with corrected clinical credentials or verified contact details.
            </p>
            <Button
              onClick={() => {
                setName(ownedOrg.name || "");
                setType(ownedOrg.type || "HOSPITAL");
                setAddress(ownedOrg.address || "");
                setContactPhone(ownedOrg.contactPhone || "");
                setEmail(ownedOrg.email || "");
                setShowNewForm(true);
              }}
              className="gap-2 font-bold"
            >
              <span>Submit New Application</span>
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Case 4: No application yet, or user wants to submit new */}
      {(!ownedOrg || showNewForm) && !isOrgUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <Card className="lg:col-span-2 border border-border shadow-xs">
            <CardHeader>
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Building2 className="size-5" />
              </div>
              <CardTitle className="text-xl font-bold">Organization Application Form</CardTitle>
              <CardDescription className="text-xs">
                Fill in the verified details of your medical center, blood bank, or volunteer group.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {errorMsg && (
                <div className="p-3.5 mb-5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
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
                    placeholder="e.g. Bangladesh Red Crescent Blood Center"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="org-type" className="text-xs font-bold">
                    Organization Type *
                  </Label>
                  <Select value={type} onValueChange={(val) => val && setType(val)}>
                    <SelectTrigger id="org-type" className="w-full">
                      <SelectValue placeholder="Select Organization Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOSPITAL">Hospital / Clinical Medical Center</SelectItem>
                      <SelectItem value="BLOOD_BANK">Blood Bank / Transfusion Center</SelectItem>
                      <SelectItem value="VOLUNTEER_GROUP">Volunteer Blood Donation Society</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Division */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Division *</Label>
                    <Select
                      value={division}
                      onValueChange={(val) => {
                        if (val) {
                          setDivision(val);
                          setDistrict("");
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
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

                  {/* District */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">District *</Label>
                    <Select
                      value={district}
                      onValueChange={(val) => val && setDistrict(val)}
                      disabled={!division}
                    >
                      <SelectTrigger className="w-full">
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
                  {/* Upazila */}
                  <div className="space-y-1.5">
                    <Label htmlFor="upazila" className="text-xs font-bold">
                      Upazila / Area (Optional)
                    </Label>
                    <Input
                      id="upazila"
                      placeholder="e.g. Dhanmondi, Mirpur"
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                    />
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-xs font-bold">
                      Street Address / Venue *
                    </Label>
                    <Input
                      id="address"
                      placeholder="e.g. 7/2 Aurangzeb Road, Mohammadpur"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-phone" className="text-xs font-bold">
                      Official Contact Phone *
                    </Label>
                    <Input
                      id="contact-phone"
                      placeholder="01700000000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs font-bold">
                      Official Email (Optional)
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="contact@bloodcenter.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={applyMutation.isPending}
                  className="w-full font-bold shadow-md gap-2"
                >
                  <Building2 className="size-4" />
                  <span>
                    {applyMutation.isPending
                      ? "Submitting Application..."
                      : "Submit Application for Review"}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Process & Guidance Card */}
          <div className="space-y-4">
            <Card className="border border-border shadow-xs bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  <CardTitle className="text-sm font-bold">How Verification Works</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-foreground block">1. Submit Details</span>
                  <p className="text-muted-foreground">
                    Provide the official clinical name, type, and geographic location of your organization.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground block">2. Admin Verification</span>
                  <p className="text-muted-foreground">
                    Administrators review hospital licensing and verification credentials from the Admin Portal.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-foreground block">3. Instant Role Elevation</span>
                  <p className="text-muted-foreground">
                    Upon approval, your account role automatically upgrades to <strong>ORGANIZATION</strong>. The Organization Hub unlocks in your sidebar to host donation camps!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-xs p-4 text-xs space-y-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Organization Benefits</span>
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Host public voluntary blood donation drives</li>
                <li>Coordinate hospital ward emergency supplies</li>
                <li>Track and confirm volunteer donor arrivals</li>
                <li>Verified badge next to institution name</li>
              </ul>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
