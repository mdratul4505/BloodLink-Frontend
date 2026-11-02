"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campService, organizationService } from "@/services";
import { useAuth } from "@/providers/auth.provider";

export default function OrganizationOverviewPage() {
  const { user } = useAuth();

  const { data: campsData, isLoading } = useQuery({
    queryKey: ["org-camps"],
    queryFn: () => campService.getCamps({ limit: 5 }),
  });

  const camps = campsData?.data || [];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 text-white shadow-md">
        <div className="space-y-2">
          <Badge className="bg-white/20 text-white border-0 font-bold text-xs uppercase tracking-wider">
            Healthcare Organization Hub
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Organization Management
          </h1>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Manage mobile donation camps, track verified participant registrations, and coordinate emergency supplies.
          </p>
        </div>

        <Link href="/dashboard/organization/camps/create">
          <Button className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md gap-2">
            <PlusCircle className="size-4" />
            <span>Create Donation Camp</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Active Camps
              </span>
              <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Calendar className="size-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-foreground">
              {camps.length} Camps
            </span>
            <p className="text-xs text-muted-foreground">
              Public blood donation drives
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Verification Status
              </span>
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs font-bold">
              APPROVED
            </Badge>
            <p className="text-xs text-muted-foreground">
              Official BloodLink Partner
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Participant Network
              </span>
              <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-foreground">
              100% Active
            </span>
            <p className="text-xs text-muted-foreground">
              Voluntary attendees coordinated
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Operations
              </span>
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Building2 className="size-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-foreground">
              24/7 Live
            </span>
            <p className="text-xs text-muted-foreground">
              Transfusion support ready
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Camps Table */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-bold">Scheduled Donation Camps</CardTitle>
            <CardDescription className="text-xs">
              Recent campaigns organized under your organization
            </CardDescription>
          </div>
          <Link href="/dashboard/organization/camps">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camp Title</TableHead>
                <TableHead>Venue & District</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">
                    Loading camps...
                  </TableCell>
                </TableRow>
              ) : camps.length > 0 ? (
                camps.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell className="font-bold text-sm text-foreground">
                      {camp.title}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {camp.venue}, {camp.district}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(camp.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          camp.status === "UPCOMING"
                            ? "border-emerald-500 text-emerald-600 text-[10px] font-bold"
                            : "text-muted-foreground text-[10px]"
                        }
                      >
                        {camp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/camps/${camp.id}`}>
                        <Button variant="ghost" size="xs">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No camps created yet. Click &quot;Create Donation Camp&quot; to organize a drive.
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
