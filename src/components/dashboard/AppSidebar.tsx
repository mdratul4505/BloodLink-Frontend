"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Activity,
  Droplet,
  MessageSquare,
  Bell,
  CreditCard,
  KeyRound,
  Building2,
  Calendar,
  PlusCircle,
  Users,
  ShieldCheck,
  ShieldAlert,
  ClipboardList,
  BarChart3,
  LogOut,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isAdmin, isOrganization, logout } = useAuth();
  const { t } = useLanguage();

  const userItems = [
    { href: "/dashboard/user", label: t.dashboard.overview, icon: LayoutDashboard },
    { href: "/dashboard/user/profile", label: t.dashboard.myProfile, icon: User },
    { href: "/dashboard/user/availability", label: t.dashboard.myAvailability, icon: Activity },
    { href: "/dashboard/user/requests", label: t.dashboard.myRequests, icon: Droplet },
    { href: "/dashboard/user/responses", label: t.dashboard.myResponses, icon: MessageSquare },
    { href: "/dashboard/user/apply-organization", label: t.dashboard.applyOrganization, icon: Building2 },
    { href: "/dashboard/user/notifications", label: t.dashboard.notifications, icon: Bell },
    { href: "/dashboard/user/payments", label: t.dashboard.payments, icon: CreditCard },
    { href: "/dashboard/user/change-password", label: t.dashboard.changePassword, icon: KeyRound },
  ];

  const orgItems = [
    { href: "/dashboard/organization", label: t.dashboard.overview, icon: LayoutDashboard },
    { href: "/dashboard/organization/profile", label: t.dashboard.orgProfile, icon: Building2 },
    { href: "/dashboard/organization/camps", label: t.dashboard.manageCamps, icon: Calendar },
    { href: "/dashboard/organization/camps/create", label: t.dashboard.createCamp, icon: PlusCircle },
    { href: "/dashboard/organization/registrations", label: t.dashboard.campRegistrations, icon: Users },
    { href: "/dashboard/organization/verification", label: t.dashboard.verificationStatus, icon: ShieldCheck },
  ];

  const adminItems = [
    { href: "/dashboard/admin", label: t.dashboard.overview, icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: t.dashboard.manageUsers, icon: Users },
    { href: "/dashboard/admin/organizations", label: t.dashboard.manageOrgs, icon: Building2 },
    { href: "/dashboard/admin/verify-orgs", label: t.dashboard.verifyOrgs, icon: ShieldCheck },
    { href: "/dashboard/admin/requests", label: t.dashboard.manageRequests, icon: Droplet },
    { href: "/dashboard/admin/camps", label: t.dashboard.manageCamps, icon: Calendar },
    { href: "/dashboard/admin/payments", label: t.dashboard.managePayments, icon: CreditCard },
    { href: "/dashboard/admin/audit-logs", label: t.dashboard.auditLogs, icon: ClipboardList },
    { href: "/dashboard/admin/stats", label: t.dashboard.stats, icon: BarChart3 },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* Brand Header */}
      <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-sidebar-border">
        <Logo size="sm" showTagline={false} />
      </SidebarHeader>

      <SidebarContent className="space-y-2 py-4">
        {/* User / Donor Menu Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground px-4">
            Donor Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      }
                      isActive={isActive}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Organization Menu Group (if user is org or admin) */}
        {(isOrganization || isAdmin) && (
          <>
            <SidebarSeparator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground px-4">
                Organization Hub
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {orgItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <Icon className="size-4 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          }
                          isActive={isActive}
                        />
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Menu Group (if user is admin) */}
        {isAdmin && (
          <>
            <SidebarSeparator className="my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs uppercase font-bold tracking-wider text-muted-foreground px-4 text-primary">
                System Administration
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <Icon className="size-4 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          }
                          isActive={isActive}
                        />
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Back to Public Website link */}
        <SidebarSeparator className="my-2" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    >
                      <ExternalLink className="size-4 shrink-0" />
                      <span>{t.common.home} Website</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with current user and logout */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center justify-between p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Avatar className="size-8 shrink-0">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-sidebar-foreground truncate">
                {user?.name || "BloodLink User"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-semibold">
                {user?.role || "USER"}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
