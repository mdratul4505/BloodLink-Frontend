"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useVerifyEmail, useResendVerificationOtp } from "@/hooks/auth.hook";
import { useLanguage } from "@/providers/language.provider";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const { t } = useLanguage();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationOtp();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (otp.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    verifyMutation.mutate(
      { email: email.trim(), otp: otp.trim() },
      {
        onSuccess: () => {
          toast.add({
            title: "Email Verified",
            description: "Your account is activated. You may now sign in.",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid or expired verification code. Please request a new one.";
          setErrorMsg(msg);
          toast.add({
            title: "Verification Failed",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  const handleResend = () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email to resend OTP.");
      return;
    }

    resendMutation.mutate(email.trim(), {
      onSuccess: () => {
        toast.add({
          title: "Code Dispatched",
          description: "A fresh 6-digit OTP has been sent to your email.",
          type: "success",
        });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to resend code.";
        toast.add({
          title: "Resend Error",
          description: msg,
          type: "error",
        });
      },
    });
  };

  return (
    <Card className="border border-border shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
          <Mail className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {t.auth.verifyEmailTitle}
        </CardTitle>
        <CardDescription>
          {t.auth.verifyEmailSubtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="verify-email" className="text-xs font-bold">
              {t.auth.emailLabel}
            </Label>
            <Input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="otp" className="text-xs font-bold">
              6-Digit Verification Code (OTP)
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

          <Button
            type="submit"
            size="lg"
            disabled={verifyMutation.isPending}
            className="w-full font-bold shadow-md"
          >
            {verifyMutation.isPending ? "Verifying..." : t.auth.verifyBtn}
          </Button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
          <span>Didn&apos;t receive the code?</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="font-bold text-primary gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${resendMutation.isPending ? "animate-spin" : ""}`} />
            <span>{t.auth.resendOtp}</span>
          </Button>
        </div>

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

export default function VerifyEmailPage() {
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
          <Suspense fallback={<div className="text-center text-sm py-12">Loading verification...</div>}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BloodLink. Every Drop Connects a Life.
      </footer>
    </div>
  );
}
