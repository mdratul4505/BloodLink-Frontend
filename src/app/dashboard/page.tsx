"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/dashboard/user");
      return;
    }
    if (user?.role === "ADMIN") {
      router.replace("/dashboard/admin");
    } else if (user?.role === "ORGANIZATION" || user?.role === "HOSPITAL") {
      router.replace("/dashboard/organization");
    } else {
      router.replace("/dashboard/user");
    }
  }, [user, isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
