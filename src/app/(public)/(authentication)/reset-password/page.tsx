"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useResetPassword } from "@/hooks/auth.hook";
import { useLanguage } from "@/providers/language.provider";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { t } = useLanguage();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetMutation = useResetPassword();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (otp.trim().length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP code sent to your email.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    resetMutation.mutate(
      {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Password Changed",
            description: "Your password has been successfully reset. Please log in.",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to reset password. OTP may be invalid or expired.";
          setErrorMsg(msg);
          toast.add({
            title: "Reset Failed",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <Card className="border border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
          <Lock className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t.auth.resetPasswordTitle}
        </CardTitle>
        <CardDescription>
          {t.auth.resetPasswordSubtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="reset-email" className="text-xs font-bold">
              {t.auth.emailLabel}
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-xs font-bold">
              6-Digit Reset Code (OTP)
            </Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="text-center font-mono text-2xl tracking-widest font-bold h-12"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs font-bold">
              {t.auth.newPasswordLabel}
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-9"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-new-password" className="text-xs font-bold">
              Confirm New Password
            </Label>
            <Input
              id="confirm-new-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={resetMutation.isPending}
            className="w-full font-bold shadow-md"
          >
            {resetMutation.isPending ? "Updating Password..." : "Reset & Save Password"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-red-50/40 via-background to-background dark:from-red-950/20 dark:via-background dark:to-background">
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Logo size="md" showTagline />
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="ghost" size="sm" />
          <ThemeSwitcher variant="ghost" size="icon-sm" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center text-sm py-12">Loading reset page...</div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BloodLink. Every Drop Connects a Life.
      </footer>
    </div>
  );
}
