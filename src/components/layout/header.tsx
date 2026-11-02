"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  HeartHandshake,
  Droplet,
  LogOut,
  User,
  LayoutDashboard,
  Shield,
  Building2,
  Calendar,
  Users,
  Code2,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin, isOrganization } = useAuth();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.common.home },
    { href: "/donors", label: t.common.findDonors },
    { href: "/blood-requests", label: t.common.bloodRequests },
    { href: "/organizations", label: t.common.organizations },
    { href: "/camps", label: t.common.camps },
    { href: "/developer", label: t.common.developer },
  ];

  const getDashboardHref = () => {
    if (isAdmin) return "/dashboard/admin";
    if (isOrganization) return "/dashboard/organization";
    return "/dashboard/user";
  };

  const getInitials = (name?: string) => {
    if (!name) return "BL";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo size="md" showTagline={false} />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:text-foreground hover:bg-muted/60",
                  isActive
                    ? "text-primary font-semibold bg-muted/80"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls: Theme, Language, Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Emergency Blood Request Quick Button */}
          <Link href="/blood-requests" className="hidden sm:inline-flex">
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40 gap-1.5 font-medium"
            >
              <Droplet className="size-3.5 fill-red-600 text-red-600 dark:fill-red-400" />
              <span>{t.hero.findDonorBtn}</span>
            </Button>
          </Link>

          <LanguageSwitcher variant="ghost" size="sm" />
          <ThemeSwitcher variant="ghost" size="icon-sm" />

          {/* User Account / Login State */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative size-9 rounded-full p-0 ring-1 ring-border"
                  >
                    <Avatar className="size-9">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="pt-1">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href={getDashboardHref()} className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    <span>{t.common.dashboard}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/dashboard/user/profile" className="flex items-center gap-2 w-full">
                    <User className="size-4 text-muted-foreground" />
                    <span>{t.nav.myProfile}</span>
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
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  {t.common.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-medium shadow-sm">
                  {t.common.register}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Sheet Trigger */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Open mobile navigation menu"
                  >
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6">
                <SheetHeader className="text-left pb-4 border-b border-border">
                  <SheetTitle>
                    <Logo size="sm" showTagline />
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-2 py-6">
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {link.href === "/" && <HeartHandshake className="size-4" />}
                        {link.href === "/donors" && <Users className="size-4" />}
                        {link.href === "/blood-requests" && <Droplet className="size-4" />}
                        {link.href === "/organizations" && <Building2 className="size-4" />}
                        {link.href === "/camps" && <Calendar className="size-4" />}
                        {link.href === "/developer" && <Code2 className="size-4" />}
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-border flex flex-col gap-3">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        href={getDashboardHref()}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button className="w-full gap-2 justify-start font-medium">
                          <LayoutDashboard className="size-4" />
                          <span>{t.common.dashboard}</span>
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setMobileOpen(false);
                          logout();
                        }}
                        className="w-full gap-2 justify-start font-medium"
                      >
                        <LogOut className="size-4" />
                        <span>{t.common.logout}</span>
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full font-medium">
                          {t.common.login}
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full font-medium">
                          {t.common.register}
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                    <span>{t.common.theme}</span>
                    <ThemeSwitcher variant="outline" size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{t.common.language}</span>
                    <LanguageSwitcher variant="outline" size="sm" showLabel />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
