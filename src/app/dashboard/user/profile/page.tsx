"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, Phone, MapPin, Calendar, Heart, ShieldCheck, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useAuth } from "@/providers/auth.provider";
import { BloodGroup } from "@/types";
import {
  BANGLADESH_DIVISIONS,
  getDistrictsByDivision,
  getDivisionByDistrict,
  ALL_DISTRICTS,
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

export default function MyProfilePage() {
  const { user, refreshProfile, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [bio, setBio] = useState("");
  const [lastDonationDate, setLastDonationDate] = useState("");

  const availableDistricts = division ? getDistrictsByDivision(division) : ALL_DISTRICTS;

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.donorProfile) {
        const userDistrict = user.donorProfile.district || "";
        setDistrict(userDistrict);
        setDivision(getDivisionByDistrict(userDistrict) || "");
        setUpazila(user.donorProfile.upazila || "");
        setBloodGroup(user.donorProfile.bloodGroup || "");
        setBio(user.donorProfile.bio || "");
        if (user.donorProfile.lastDonationDate) {
          setLastDonationDate(
            new Date(user.donorProfile.lastDonationDate).toISOString().split("T")[0]
          );
        }
      }
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.USERS.ME, payload);
      return data;
    },
    onSuccess: () => {
      refreshProfile();
      toast.add({
        title: "Profile Updated",
        description: "Your user profile and donor parameters have been saved.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update Failed",
        description: err?.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: name.trim(),
      phone: phone.trim() || undefined,
      district: district || undefined,
      upazila: upazila.trim() || undefined,
      bloodGroup: bloodGroup || undefined,
      bio: bio.trim() || undefined,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate).toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your account information, donor status, and location credentials.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">{user?.name}</CardTitle>
              <CardDescription className="text-xs">{user?.email}</CardDescription>
              <div className="flex items-center gap-2 pt-1.5">
                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                  {user?.role}
                </Badge>
                {user?.isVerified && (
                  <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                    <ShieldCheck className="size-3" />
                    <span>Verified</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-bold">
                  Full Name
                </Label>
                <Input
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email" className="text-xs font-bold">
                  Email Address (Verified)
                </Label>
                <Input
                  id="prof-email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-phone" className="text-xs font-bold">
                  Phone Number
                </Label>
                <Input
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01700000000"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Blood Group</Label>
                <Select
                  value={bloodGroup}
                  onValueChange={(val) => setBloodGroup(val as BloodGroup)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg.value} value={bg.value}>
                        {bg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Division</Label>
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

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">District</Label>
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

              <div className="space-y-1.5">
                <Label htmlFor="prof-upazila" className="text-xs font-bold">
                  Upazila / Area
                </Label>
                <Input
                  id="prof-upazila"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="e.g. Dhanmondi"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="last-donation" className="text-xs font-bold">
                  Last Donation Date
                </Label>
                <Input
                  id="last-donation"
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-bold">
                  Donor Statement / Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell requesters about your availability, health, or willingness to help..."
                  rows={2}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="gap-2 font-bold shadow-xs"
              >
                <Save className="size-4" />
                <span>{updateProfileMutation.isPending ? "Saving..." : "Save Profile Changes"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
