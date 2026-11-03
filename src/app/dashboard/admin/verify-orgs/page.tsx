"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Check, X, Building2, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { adminService, organizationService } from "@/services";
import { VerificationStatus } from "@/types";

export default function AdminVerifyOrgsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-verify-orgs-list"],
    queryFn: () => organizationService.getOrganizations({ limit: 50 }),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: VerificationStatus; reason?: string }) =>
      adminService.verifyOrganization(id, status, reason),
    onSuccess: (res) => {
      toast.add({
        title: "Verification Updated",
        description: `Organization is now ${res.data?.verificationStatus || "updated"}.`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-verify-orgs-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orgs-list"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Verification Error",
        description: err?.response?.data?.message || "Failed to update verification status.",
        type: "error",
      });
    },
  });

  const orgs = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Verify Healthcare Organizations
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review, authenticate, or reject clinical hospital and blood bank credentials.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>District & Address</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead className="text-right">Verification Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : orgs.length > 0 ? (
                orgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="font-bold text-sm text-foreground">{org.name}</div>
                      {org.owner && (
                        <div className="text-[11px] text-muted-foreground font-normal">
                          Applicant: {org.owner.name} ({org.owner.email})
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {org.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {org.address}, {org.district}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {org.contactPhone || org.email || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          org.verificationStatus === "APPROVED"
                            ? "bg-emerald-600 text-white font-bold text-[10px]"
                            : org.verificationStatus === "REJECTED"
                            ? "bg-destructive text-white font-bold text-[10px]"
                            : "border-amber-500 text-amber-600 font-bold text-[10px]"
                        }
                      >
                        {org.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {org.verificationStatus !== "APPROVED" && (
                        <Button
                          size="xs"
                          onClick={() => verifyMutation.mutate({ id: org.id, status: "APPROVED" })}
                          disabled={verifyMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs font-semibold"
                        >
                          <Check className="size-3" />
                          <span>Approve</span>
                        </Button>
                      )}
                      {org.verificationStatus !== "REJECTED" && (
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => verifyMutation.mutate({ id: org.id, status: "REJECTED", reason: "Documentation verification failed" })}
                          disabled={verifyMutation.isPending}
                          className="gap-1 text-xs font-semibold"
                        >
                          <X className="size-3" />
                          <span>Reject</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    No organizations awaiting verification.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
