"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Search,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { adminService, organizationService } from "@/services";
import { IOrganization, VerificationStatus } from "@/types";

export default function AdminOrganizationsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orgs-management"],
    queryFn: () => organizationService.getOrganizations({ limit: 100 }),
  });

  const verifyMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: VerificationStatus;
      reason?: string;
    }) => adminService.verifyOrganization(id, status, reason),
    onSuccess: (res) => {
      toast.add({
        title: "Organization Updated",
        description: `Organization verification status is now ${
          res.data?.verificationStatus || "updated"
        }.`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-orgs-management"] });
      queryClient.invalidateQueries({ queryKey: ["admin-verify-orgs-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update Failed",
        description:
          err?.response?.data?.message ||
          "Failed to update organization status.",
        type: "error",
      });
    },
  });

  const rawOrgs = data?.data as any;
  const orgsList: IOrganization[] = Array.isArray(rawOrgs)
    ? rawOrgs
    : Array.isArray(rawOrgs?.organizations)
    ? rawOrgs.organizations
    : [];

  const filteredOrgs = orgsList.filter((org) => {
    const matchesSearch =
      !search.trim() ||
      org.name?.toLowerCase().includes(search.toLowerCase()) ||
      org.district?.toLowerCase().includes(search.toLowerCase()) ||
      org.address?.toLowerCase().includes(search.toLowerCase()) ||
      org.contactPhone?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || org.verificationStatus === statusFilter;

    const matchesType =
      typeFilter === "ALL" || org.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCount = orgsList.length;
  const approvedCount = orgsList.filter(
    (o) => o.verificationStatus === "APPROVED"
  ).length;
  const pendingCount = orgsList.filter(
    (o) => o.verificationStatus === "PENDING"
  ).length;
  const rejectedCount = orgsList.filter(
    (o) => o.verificationStatus === "REJECTED"
  ).length;

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 font-bold text-xs">
            <CheckCircle2 className="size-3" />
            <span>Approved</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 font-bold text-xs">
            <Clock className="size-3" />
            <span>Pending</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 gap-1 font-bold text-xs">
            <XCircle className="size-3" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatType = (type?: string) => {
    if (!type) return "Organization";
    return type.replace(/_/g, " ");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Manage Organizations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Supervise clinical healthcare partners, hospitals, and blood banks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/verify-orgs">
            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Pending Verifications ({pendingCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Total Organizations
            </p>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
            <p className="text-[11px] text-muted-foreground">Registered partners</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Verified / Approved
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {approvedCount}
            </p>
            <p className="text-[11px] text-muted-foreground">Active in network</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Pending Review
            </p>
            <p className="text-2xl font-black text-amber-600">
              {pendingCount}
            </p>
            <p className="text-[11px] text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Rejected / Revoked
            </p>
            <p className="text-2xl font-black text-destructive">
              {rejectedCount}
            </p>
            <p className="text-[11px] text-muted-foreground">Declined credentials</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="border border-border shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, district, address, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val || "ALL")}
              >
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={typeFilter}
                onValueChange={(val) => setTypeFilter(val || "ALL")}
              >
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="HOSPITAL">Hospital</SelectItem>
                  <SelectItem value="BLOOD_BANK">Blood Bank</SelectItem>
                  <SelectItem value="RED_CRESCENT">Red Crescent</SelectItem>
                  <SelectItem value="CLUB">Volunteer Club</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card className="border border-border shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="font-bold text-xs">Organization</TableHead>
                <TableHead className="font-bold text-xs">Type</TableHead>
                <TableHead className="font-bold text-xs">Location</TableHead>
                <TableHead className="font-bold text-xs">Contact</TableHead>
                <TableHead className="font-bold text-xs">Status</TableHead>
                <TableHead className="font-bold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span>Loading organizations...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id} className="hover:bg-muted/30">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground leading-tight">
                            {org.name}
                          </p>
                          {org.email && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="size-3" />
                              <span>{org.email}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-[11px] font-medium capitalize">
                        {formatType(org.type)}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-1 max-w-[200px]">
                        <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="truncate">
                          {org.district}
                          {org.address ? `, ${org.address}` : ""}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {org.contactPhone ? (
                        <div className="flex items-center gap-1 font-mono">
                          <Phone className="size-3" />
                          <span>{org.contactPhone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      {getStatusBadge(org.verificationStatus)}
                    </TableCell>

                    <TableCell className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/organizations/${org.id}`}>
                          <Button variant="ghost" size="xs" className="gap-1 text-xs">
                            <ExternalLink className="size-3.5" />
                            <span>View</span>
                          </Button>
                        </Link>

                        {org.verificationStatus !== "APPROVED" && (
                          <Button
                            size="xs"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                            disabled={verifyMutation.isPending}
                            onClick={() =>
                              verifyMutation.mutate({
                                id: org.id,
                                status: "APPROVED",
                              })
                            }
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Approve</span>
                          </Button>
                        )}

                        {org.verificationStatus !== "REJECTED" && (
                          <Button
                            variant="destructive"
                            size="xs"
                            className="gap-1 text-xs"
                            disabled={verifyMutation.isPending}
                            onClick={() =>
                              verifyMutation.mutate({
                                id: org.id,
                                status: "REJECTED",
                                reason: "Verification declined by platform administrator.",
                              })
                            }
                          >
                            <XCircle className="size-3.5" />
                            <span>Reject</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                    <Building2 className="size-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="font-medium text-foreground">No organizations found</p>
                    <p className="text-muted-foreground mt-0.5">
                      {search || statusFilter !== "ALL" || typeFilter !== "ALL"
                        ? "Try adjusting your search query or filters."
                        : "No organizations have registered yet."}
                    </p>
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
