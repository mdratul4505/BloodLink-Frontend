"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Calendar, PlusCircle, AlertCircle } from "lucide-react";
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
import { campService } from "@/services";
import { useAuth } from "@/providers/auth.provider";
import {
  BANGLADESH_DIVISIONS,
  getDistrictsByDivision,
  ALL_DISTRICTS,
} from "@/constants/bangladesh-locations";

export default function CreateCampPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const availableDistricts = division ? getDistrictsByDivision(division) : ALL_DISTRICTS;

  const createMutation = useMutation({
    mutationFn: campService.createCamp,
    onSuccess: (res) => {
      toast.add({
        title: "Camp Created",
        description: "The donation camp is scheduled and visible to public donors.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["org-manage-camps"] });
      queryClient.invalidateQueries({ queryKey: ["camps-list"] });
      const newId = res.data?.id;
      if (newId) {
        router.push(`/camps/${newId}`);
      } else {
        router.push("/dashboard/organization/camps");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to create donation camp.";
      setErrorMsg(msg);
      toast.add({
        title: "Error",
        description: msg,
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Please provide camp title.");
      return;
    }
    if (!venue.trim()) {
      setErrorMsg("Please specify venue location.");
      return;
    }
    if (!district) {
      setErrorMsg("Please select district.");
      return;
    }
    if (!date) {
      setErrorMsg("Please select camp date.");
      return;
    }

    createMutation.mutate({
      organizationId: user?.id || "org-id",
      title: title.trim(),
      venue: venue.trim(),
      district,
      date: new Date(date).toISOString(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        href="/dashboard/organization/camps"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Camps</span>
      </Link>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
            <Calendar className="size-5" />
          </div>
          <CardTitle className="text-xl font-bold">Organize Donation Camp</CardTitle>
          <CardDescription className="text-xs">
            Schedule a mobile voluntary blood donation drive for public participants.
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
              <Label htmlFor="camp-title" className="text-xs font-bold">
                Camp Title *
              </Label>
              <Input
                id="camp-title"
                placeholder="e.g. National Voluntary Blood Donation Drive 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="camp-venue" className="text-xs font-bold">
                  Venue / Location *
                </Label>
                <Input
                  id="camp-venue"
                  placeholder="e.g. TSC Auditorium, University of Dhaka"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
              </div>

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

            <div className="space-y-1.5">
              <Label htmlFor="camp-date" className="text-xs font-bold">
                Camp Event Date *
              </Label>
              <Input
                id="camp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="camp-desc" className="text-xs font-bold">
                Description & Objectives
              </Label>
              <Textarea
                id="camp-desc"
                placeholder="Describe donor facilities, certified medical staff on premise, refreshments, and donor gifts..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createMutation.isPending}
                className="w-full font-bold shadow-md gap-2"
              >
                <PlusCircle className="size-4" />
                <span>{createMutation.isPending ? "Scheduling Camp..." : "Schedule Donation Camp"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
