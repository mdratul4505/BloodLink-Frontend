"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useForgotPassword } from "@/hooks/auth.hook";
import { useLanguage } from "@/providers/language.provider";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const forgotMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    forgotMutation.mutate(email.trim(), {
      onSuccess: () => {
        toast.add({
          title: "Password Reset Code Sent",
          description: "A 6-digit OTP code has been sent to your email.",
          type: "success",
        });
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to process request. Please ensure the email address is correct.";
        setErrorMsg(msg);
        toast.add({
          title: "Error",
          description: msg,
          type: "error",
        });
      },
    });
  };

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
        <div className="w-full max-w-md space-y-6">
          <Card className="border border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                <KeyRound className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {t.auth.forgotPasswordTitle}
              </CardTitle>
              <CardDescription>
                {t.auth.forgotPasswordSubtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email" className="text-xs font-bold">
                    {t.auth.emailLabel}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={forgotMutation.isPending}
                  className="w-full font-bold shadow-md"
                >
                  {forgotMutation.isPending ? "Sending OTP..." : t.auth.sendOtpBtn}
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
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} BloodLink. Every Drop Connects a Life.
      </footer>
    </div>
  );
}
