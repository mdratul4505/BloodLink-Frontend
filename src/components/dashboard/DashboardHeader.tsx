"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplet, User, LogOut, LayoutDashboard, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((part, idx) => {
      const url = "/" + parts.slice(0, idx + 1).join("/");
      const formatted = part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      return { label: formatted, url, isLast: idx === parts.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();

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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="hidden sm:block">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.url}>
                  {idx > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="font-semibold text-foreground">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={
                          <Link href={crumb.url} className="text-muted-foreground hover:text-foreground">
                            {crumb.label}
                          </Link>
                        }
                      />
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/blood-requests/create" className="hidden sm:inline-flex">
          <Button size="xs" variant="outline" className="border-red-200 text-red-600 dark:border-red-900 font-bold gap-1">
            <Droplet className="size-3 fill-red-600" />
            <span>Emergency Request</span>
          </Button>
        </Link>

        {/* Notification Dropdown */}
        <NotificationDropdown />

        {/* Global Language Switcher */}
        <LanguageSwitcher variant="ghost" size="sm" />

        {/* MANDATORY: Global ThemeSwitcher in all dashboard headers */}
        <ThemeSwitcher variant="ghost" size="icon-sm" />

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="relative size-9 rounded-full p-0 ring-1 ring-border ml-1"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatar || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user?.name || "BloodLink User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="pt-1">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">
                      {user?.role || "USER"}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/user/profile" className="flex items-center gap-2 w-full">
                <User className="size-4 text-muted-foreground" />
                <span>{t.dashboard.myProfile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/user/availability" className="flex items-center gap-2 w-full">
                <Droplet className="size-4 text-primary" />
                <span>{t.dashboard.myAvailability}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            >
              <LogOut className="size-4" />
              <span>{t.common.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
