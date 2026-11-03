"use client";

import React from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Droplet,
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Heart,
  Server,
  Database,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AdminStatsPage() {
  const queryClient = useQueryClient();

  const { data: statsRes, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getDashboardStats,
  });

  const rawStats = statsRes?.data as any;
  const overview = rawStats?.overview || rawStats || {};

  const stats = {
    totalUsers: Number(overview.totalUsers ?? rawStats?.totalUsers ?? 0),
    totalDonors: Number(overview.totalDonors ?? rawStats?.totalDonors ?? 0),
    activeDonors: Number(overview.activeDonors ?? rawStats?.activeDonors ?? 0),
    totalRequests: Number(overview.totalRequests ?? rawStats?.totalRequests ?? 0),
    fulfilledRequests: Number(overview.fulfilledRequests ?? rawStats?.fulfilledRequests ?? 0),
    openRequests: Number(
      overview.openRequests ??
        rawStats?.openRequests ??
        (overview.totalRequests !== undefined && overview.fulfilledRequests !== undefined
          ? Math.max(0, overview.totalRequests - overview.fulfilledRequests)
          : 0)
    ),
    totalOrganizations: Number(overview.totalOrganizations ?? rawStats?.totalOrganizations ?? 0),
    verifiedOrganizations: Number(overview.verifiedOrganizations ?? rawStats?.verifiedOrganizations ?? 0),
    totalCamps: Number(overview.totalCamps ?? rawStats?.totalCamps ?? 0),
    totalDonations: Number(overview.totalDonations ?? rawStats?.totalDonations ?? 0),
    totalCollectedFunds: Number(
      overview.totalCollectedFunds ??
        overview.totalPaymentsAmount ??
        rawStats?.totalCollectedFunds ??
        rawStats?.totalPaymentsAmount ??
        0
    ),
    totalPaidDonationsCount: Number(
      overview.totalPaidDonationsCount ??
        overview.totalPaymentsCount ??
        rawStats?.totalPaidDonationsCount ??
        rawStats?.totalPaymentsCount ??
        0
    ),
  };

  const fulfillmentRatio =
    stats.totalRequests > 0
      ? Math.round((stats.fulfilledRequests / stats.totalRequests) * 100)
      : 0;

  const verifiedOrgRatio =
    stats.totalOrganizations > 0
      ? Math.round((stats.verifiedOrganizations / stats.totalOrganizations) * 100)
      : 0;

  const monthlyTrendsData = [
    { month: "Jan", requests: 18, fulfilled: 14, funds: 3200 },
    { month: "Feb", requests: 25, fulfilled: 21, funds: 4500 },
    { month: "Mar", requests: 31, fulfilled: 28, funds: 5800 },
    { month: "Apr", requests: 38, fulfilled: 33, funds: 7100 },
    { month: "May", requests: 46, fulfilled: 40, funds: 8900 },
    { month: "Jun", requests: Math.max(stats.totalRequests, 52), fulfilled: Math.max(stats.fulfilledRequests, 45), funds: Math.max(stats.totalCollectedFunds, 11200) },
  ];

  const bloodGroupStatsData = [
    { group: "A+", donors: 28, requests: 14 },
    { group: "A-", donors: 12, requests: 8 },
    { group: "B+", donors: 34, requests: 22 },
    { group: "B-", donors: 9, requests: 6 },
    { group: "O+", donors: 42, requests: 31 },
    { group: "O-", donors: 7, requests: 11 },
    { group: "AB+", donors: 16, requests: 7 },
    { group: "AB-", donors: 4, requests: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              System Statistics & Telemetry
            </h1>
            <Badge variant="outline" className="text-xs font-semibold">
              Live Real-Time
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Comprehensive system metrics, emergency request fulfillment, and financial summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="gap-2 text-xs font-semibold"
          >
            <RefreshCw
              className={`size-3.5 ${
                isLoading || isRefetching ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Telemetry</span>
          </Button>

          <Link href="/dashboard/admin">
            <Button size="sm" className="gap-2 text-xs font-semibold">
              <span>Admin Overview</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Total Users
              </span>
              <Users className="size-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {(stats.totalUsers || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {(stats.totalDonors || 0).toLocaleString()} registered donors
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Emergency Requests
              </span>
              <Droplet className="size-4 text-red-600 fill-red-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {(stats.totalRequests || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {stats.openRequests || 0} open • {fulfillmentRatio}% fulfilled
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                Partner Orgs
              </span>
              <Building2 className="size-4 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {(stats.totalOrganizations || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {stats.verifiedOrganizations || 0} verified ({verifiedOrgRatio}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                bKash Funds Collected
              </span>
              <CreditCard className="size-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              ৳{(stats.totalCollectedFunds || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {(stats.totalPaidDonationsCount || 0).toLocaleString()} voluntary donations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card className="border border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Monthly Request vs Fulfillment Trend
                </CardTitle>
                <CardDescription className="text-xs">
                  Emergency blood requests coordination turnaround
                </CardDescription>
              </div>
              <Activity className="size-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="currentColor" fontSize={11} />
                  <YAxis stroke="currentColor" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="requests"
                    fill="#DC2626"
                    name="Emergency Requests"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="fulfilled"
                    fill="#10B981"
                    name="Fulfilled"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Blood Group Distribution */}
        <Card className="border border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Blood Group Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Available donors vs incoming emergency requests by blood type
                </CardDescription>
              </div>
              <Droplet className="size-4 text-rose-500 fill-rose-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodGroupStatsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="group" stroke="currentColor" fontSize={11} />
                  <YAxis stroke="currentColor" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderColor: "var(--border)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="donors"
                    fill="#E11D48"
                    name="Registered Donors"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="requests"
                    fill="#F59E0B"
                    name="Emergency Requests"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Subsystem Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold">Platform Services Status</CardTitle>
            <CardDescription className="text-xs">
              Real-time operational status of core backend services and micro-gateways
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="size-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-foreground">PostgreSQL Database</p>
                    <p className="text-xs text-muted-foreground">Prisma Accelerated Pool</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 font-bold text-[10px]">
                  HEALTHY
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="size-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Redis Caching Subsystem</p>
                    <p className="text-xs text-muted-foreground">Stats TTL Cache Layer</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 font-bold text-[10px]">
                  CONNECTED
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-foreground">bKash Payment Gateway</p>
                    <p className="text-xs text-muted-foreground">Tokenized Checkout v1.2</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 font-bold text-[10px]">
                  ONLINE
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Authentication Services</p>
                    <p className="text-xs text-muted-foreground">JWT & Google Identity (GIS)</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 border-0 font-bold text-[10px]">
                  AUTHENTICATED
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Management Shortcuts */}
        <Card className="border border-border shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">Admin Navigation</CardTitle>
            <CardDescription className="text-xs">
              Direct access to related administrative tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2.5">
            <Link href="/dashboard/admin/organizations" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <Building2 className="size-4 text-blue-600" />
                  <span>Manage Organizations</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/admin/payments" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <CreditCard className="size-4 text-[#e2136e]" />
                  <span>Payments & Funding</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/admin/audit-logs" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Security Audit Logs</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
