"use client";

import React, { useState } from "react";
import { Building2, MapPin, Phone, Mail, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth.provider";

export default function OrganizationProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "City Blood Transfusion Center");
  const [address, setAddress] = useState("Hospital Road, Medical Zone");
  const [district, setDistrict] = useState("Dhaka");
  const [phone, setPhone] = useState(user?.phone || "01700000000");
  const [email, setEmail] = useState(user?.email || "org@bloodlink.org");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.add({
      title: "Organization Saved",
      description: "Organization profile details have been saved.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Organization Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your hospital or blood bank public accreditation profile.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="size-6" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{name}</CardTitle>
                <CardDescription className="text-xs">{email}</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs font-bold gap-1">
              <ShieldCheck className="size-3" />
              <span>Verified Entity</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Organization Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Official Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Contact Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Street Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">District</Label>
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" className="gap-2 font-bold shadow-xs">
                <Save className="size-4" />
                <span>Save Organization Details</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
