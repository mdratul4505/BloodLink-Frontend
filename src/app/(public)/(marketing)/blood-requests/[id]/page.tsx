"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Droplet,
  HeartHandshake,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { bloodRequestService } from "@/services";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { UrgencyLevel } from "@/types";

export default function BloodRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [responseStatus, setResponseStatus] = useState<"AVAILABLE" | "UNABLE">("AVAILABLE");
  const [responseMsg, setResponseMsg] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["blood-request-detail", id],
    queryFn: () => bloodRequestService.getRequestById(id),
  });

  const { data: responsesData } = useQuery({
    queryKey: ["blood-request-responses", id],
    queryFn: () => bloodRequestService.getResponses(id),
    enabled: !!id,
  });

  const respondMutation = useMutation({
    mutationFn: (payload: { status: "AVAILABLE" | "UNABLE"; message?: string }) =>
      bloodRequestService.respondToRequest(id, payload),
    onSuccess: () => {
      toast.add({
        title: "Response Submitted",
        description: "Thank you! The requester has been notified.",
        type: "success",
      });
      setDialogOpen(false);
      setResponseMsg("");
      queryClient.invalidateQueries({ queryKey: ["blood-request-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blood-request-responses", id] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Response Failed",
        description: err?.response?.data?.message || "Could not record response.",
        type: "error",
      });
    },
  });

  const request = data?.data;
  const responses = responsesData?.data || [];

  const formatBloodGroup = (bg?: string) => {
    return bg?.replace("_POSITIVE", "+").replace("_NEGATIVE", "-") || bg;
  };

  const getUrgencyBadge = (urg?: UrgencyLevel) => {
    switch (urg) {
      case "CRITICAL":
        return <Badge className="bg-red-600 text-white font-bold text-xs uppercase animate-pulse">Critical Urgency</Badge>;
      case "URGENT":
        return <Badge className="bg-amber-600 text-white font-bold text-xs uppercase">Urgent</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground text-xs uppercase">Normal</Badge>;
    }
  };

  const handleRespond = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/blood-requests/${id}`);
      return;
    }
    respondMutation.mutate({
      status: responseStatus,
      message: responseMsg.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Card className="p-8 space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 mx-auto flex items-center justify-center">
          <Droplet className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Request Not Found</h2>
        <p className="text-xs text-muted-foreground">
          This blood request might have expired, been fulfilled, or cancelled.
        </p>
        <Link href="/blood-requests">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Back to Blood Requests</span>
          </Button>
        </Link>
      </div>
    );
  }

  const isRequester = user?.id === request.requesterId;
  const isFulfilled = request.status === "FULFILLED";

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/blood-requests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>{t.common.back} to Requests</span>
        </Link>

        {/* Main Request Card */}
        <Card className="border border-border shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
                  {formatBloodGroup(request.bloodGroup)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      {request.hospitalName}
                    </h1>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span>
                      {request.district}
                      {request.upazila ? `, ${request.upazila}` : ""}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {getUrgencyBadge(request.urgency)}
                <Badge variant="outline" className="text-xs uppercase font-bold">
                  {request.status}
                </Badge>
              </div>
            </div>

            {/* Units & Timeline Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Required Units</span>
                <span className="text-2xl font-bold text-foreground">
                  {request.units} {t.common.bags}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Fulfilled</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {request.unitsFulfilled} {t.common.bags}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Needed By</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400 block pt-1">
                  {new Date(request.neededBy).toLocaleDateString()}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                <span className="text-xs text-muted-foreground block mb-1">Patient</span>
                <span className="text-sm font-bold text-foreground block pt-1">
                  {request.patientName || "Confidential"}
                </span>
              </div>
            </div>

            {/* Note */}
            {request.note && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Clinical Note / Description
                </h4>
                <p className="text-sm text-foreground p-4 rounded-xl bg-muted/20 border border-border/60 leading-relaxed">
                  {request.note}
                </p>
              </div>
            )}

            {/* Contact Information & Respond Action */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a href={`tel:${request.contactPhone}`} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 font-bold">
                    <Phone className="size-4 text-primary" />
                    <span>Call {request.contactPhone}</span>
                  </Button>
                </a>
              </div>

              {!isFulfilled && !isRequester && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger
                    render={
                      <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-md">
                        <HeartHandshake className="size-5" />
                        <span>Respond to Donate Blood</span>
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Respond to Blood Request</DialogTitle>
                      <DialogDescription>
                        Confirm whether you are willing and available to donate {formatBloodGroup(request.bloodGroup)} blood for this patient.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                      <div>
                        <Label className="text-xs font-bold mb-2 block">Your Availability</Label>
                        <RadioGroup
                          value={responseStatus}
                          onValueChange={(val) => setResponseStatus(val as "AVAILABLE" | "UNABLE")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="AVAILABLE" id="avail" />
                            <Label htmlFor="avail" className="cursor-pointer font-semibold text-sm">
                              I can donate (Available)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="UNABLE" id="unavail" />
                            <Label htmlFor="unavail" className="cursor-pointer text-sm text-muted-foreground">
                              Unable right now
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="resp-msg" className="text-xs font-bold">
                          Message to Requester (Optional)
                        </Label>
                        <Textarea
                          id="resp-msg"
                          placeholder="e.g. I can arrive at the hospital by 3 PM..."
                          value={responseMsg}
                          onChange={(e) => setResponseMsg(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleRespond}
                        disabled={respondMutation.isPending}
                        className="font-bold"
                      >
                        {respondMutation.isPending ? "Submitting..." : "Confirm Response"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </Card>

        {/* Responses Received Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <span>Donor Responses ({responses.length})</span>
            </h3>
          </div>

          {responses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {responses.map((resp: any) => (
                <Card key={resp.id} className="border border-border/80">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {resp.donor?.name?.[0] || "D"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {resp.donor?.name || "Donor"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(resp.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          resp.status === "AVAILABLE"
                            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]"
                            : resp.status === "DONATED"
                            ? "bg-emerald-600 text-white text-[10px]"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {resp.status}
                      </Badge>
                    </div>
                    {resp.message && (
                      <p className="text-xs text-muted-foreground pl-10">
                        &ldquo;{resp.message}&rdquo;
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No donor responses recorded yet. Be the first to answer this life-saving request.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
