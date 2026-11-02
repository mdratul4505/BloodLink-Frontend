"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Droplet, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { bloodRequestService } from "@/services";
import { useAuth } from "@/providers/auth.provider";
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

export default function CreateBloodRequestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const [patientName, setPatientName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [units, setUnits] = useState(1);
  const [hospitalName, setHospitalName] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [urgency, setUrgency] = useState<"NORMAL" | "URGENT" | "CRITICAL">("NORMAL");
  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useMutation({
    mutationFn: bloodRequestService.createRequest,
    onSuccess: (res) => {
      toast.add({
        title: "Blood Request Created",
        description: "Emergency alerts dispatched to compatible donors in your area.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["requests-list"] });
      queryClient.invalidateQueries({ queryKey: ["home-blood-requests"] });
      const newId = res.data?.id;
      if (newId) {
        router.push(`/blood-requests/${newId}`);
      } else {
        router.push("/blood-requests");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to create blood request.";
      setErrorMsg(msg);
      toast.add({
        title: "Creation Error",
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
        title: "Authentication Required",
        description: "Please sign in to post an emergency blood request.",
        type: "warning",
      });
      router.push("/login?redirect=/blood-requests/create");
      return;
    }

    if (!bloodGroup) {
      setErrorMsg("Please select the required blood group.");
      return;
    }
    if (!hospitalName.trim()) {
      setErrorMsg("Please provide the hospital or clinic name.");
      return;
    }
    if (!district) {
      setErrorMsg("Please select the district.");
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg("Please provide a contact phone number.");
      return;
    }
    if (!neededBy) {
      setErrorMsg("Please specify the date when blood is needed.");
      return;
    }

    createMutation.mutate({
      patientName: patientName.trim() || undefined,
      bloodGroup,
      units: Number(units) || 1,
      hospitalName: hospitalName.trim(),
      district,
      upazila: upazila.trim() || undefined,
      contactPhone: contactPhone.trim(),
      neededBy: new Date(neededBy).toISOString(),
      urgency,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Blood Requests</span>
        </Link>

        <Card className="border border-border shadow-sm">
          <CardHeader className="space-y-1">
            <div className="size-10 rounded-xl bg-red-500/10 text-primary flex items-center justify-center mb-2">
              <Droplet className="size-5 fill-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Create Emergency Blood Request
            </CardTitle>
            <CardDescription>
              Broadcast emergency blood requirements to compatible verified donors in your region.
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="blood-group" className="text-xs font-bold">
                    Required Blood Group *
                  </Label>
                  <Select
                    value={bloodGroup}
                    onValueChange={(val) => setBloodGroup(val as BloodGroup)}
                  >
                    <SelectTrigger id="blood-group" className="w-full">
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

                <div className="space-y-1.5">
                  <Label htmlFor="units" className="text-xs font-bold">
                    Units / Bags Required *
                  </Label>
                  <Input
                    id="units"
                    type="number"
                    min={1}
                    max={10}
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="hospital" className="text-xs font-bold">
                    Hospital Name & Ward *
                  </Label>
                  <Input
                    id="hospital"
                    placeholder="e.g. Dhaka Medical College Hospital"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="patient" className="text-xs font-bold">
                    Patient Name (Optional)
                  </Label>
                  <Input
                    id="patient"
                    placeholder="e.g. Sarah Ahmed"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="district" className="text-xs font-bold">
                    District *
                  </Label>
                  <Select value={district} onValueChange={(val) => val && setDistrict(val)}>
                    <SelectTrigger id="district" className="w-full">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map((dst) => (
                        <SelectItem key={dst} value={dst}>
                          {dst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold">
                    Emergency Contact Phone *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 01700000000"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="neededBy" className="text-xs font-bold">
                    Needed By Date *
                  </Label>
                  <Input
                    id="neededBy"
                    type="date"
                    value={neededBy}
                    onChange={(e) => setNeededBy(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="urgency" className="text-xs font-bold">
                  Urgency Level *
                </Label>
                <Select
                  value={urgency}
                  onValueChange={(val) => setUrgency(val as "NORMAL" | "URGENT" | "CRITICAL")}
                >
                  <SelectTrigger id="urgency" className="w-full">
                    <SelectValue placeholder="Select Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal — Routine or Scheduled</SelectItem>
                    <SelectItem value="URGENT">Urgent — Needed within 24 hours</SelectItem>
                    <SelectItem value="CRITICAL">Critical — Immediate Emergency / Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="note" className="text-xs font-bold">
                  Clinical Note / Details (Optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Mention reason (e.g. Thalassemia, Dengue, C-Section surgery), blood donation location, or contact person details..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={createMutation.isPending}
                  className="w-full font-bold shadow-md gap-2"
                >
                  <PlusCircle className="size-5" />
                  <span>
                    {createMutation.isPending
                      ? "Broadcasting Emergency Request..."
                      : "Broadcast Blood Request"}
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
