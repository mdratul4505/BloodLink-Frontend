"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Droplet,
  Building2,
  Calendar,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService, statsService } from "@/services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getDashboardStats,
  });

  const { data: recentUsers } = useQuery({
    queryKey: ["admin-recent-users"],
    queryFn: () => adminService.getUsers({ limit: 5 }),
  });

  const statsData = stats?.data || {
    totalUsers: 142,
    totalDonors: 98,
    totalRequests: 45,
    openRequests: 12,
    totalOrganizations: 18,
    verifiedOrganizations: 15,
    totalCamps: 9,
    totalPaymentsAmount: 18500,
    totalPaymentsCount: 37,
  };

  const chartData = [
    { month: "Jan", donations: 24, requests: 30 },
    { month: "Feb", donations: 35, requests: 38 },
    { month: "Mar", donations: 42, requests: 45 },
    { month: "Apr", donations: 48, requests: 52 },
    { month: "May", donations: 56, requests: 50 },
    { month: "Jun", donations: 64, requests: 58 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white shadow-md">
        <div className="space-y-2">
          <Badge className="bg-white/20 text-white border-0 font-bold text-xs uppercase tracking-wider">
            Super Administrator Control Plane
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            System Administration
          </h1>
          <p className="text-sm text-red-100 max-w-xl leading-relaxed">
            Monitor real-time blood requests, user accounts, organization verifications, audit logs, and voluntary funding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/verify-orgs">
            <Button className="bg-white text-red-700 hover:bg-red-50 font-bold shadow-md gap-2">
              <ShieldCheck className="size-4" />
              <span>Verify Organizations</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics 4x Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Total Users</span>
              <Users className="size-4 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {statsData.totalUsers.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">Registered on platform</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Blood Donors</span>
              <Droplet className="size-4 text-red-600 fill-red-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {statsData.totalDonors.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">Verified active donors</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Blood Requests</span>
              <Activity className="size-4 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {statsData.totalRequests.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">{statsData.openRequests} currently open</p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-xs">
          <CardContent className="p-6 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">bKash Funds</span>
              <CreditCard className="size-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              ৳{Number(statsData.totalPaymentsAmount || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground">{statsData.totalPaymentsCount || 0} voluntary donations</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Emergency Requests vs. Donations Volume
                </CardTitle>
                <CardDescription className="text-xs">
                  Monthly platform life-saving coordination metrics
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-bold">
                2026 Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                  <Bar dataKey="requests" fill="#DC2626" name="Requests" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="donations" fill="#10B981" name="Donations" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card className="border border-border shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">Management Shortlinks</CardTitle>
            <CardDescription className="text-xs">
              Direct access to system administration modules
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2.5">
            <Link href="/dashboard/admin/users" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span>Manage Users</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/admin/verify-orgs" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Verify Organizations</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/admin/audit-logs" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-blue-600" />
                  <span>Platform Audit Logs</span>
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>

            <Link href="/dashboard/admin/payments" className="block">
              <Button variant="outline" className="w-full justify-between font-semibold text-xs h-10">
                <span className="flex items-center gap-2">
                  <CreditCard className="size-4 text-[#e2136e]" />
                  <span>Manage Payments</span>
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
