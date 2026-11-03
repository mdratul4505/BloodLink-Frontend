"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Droplet,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { useLogin, useVerifyEmail, useResendVerificationOtp } from "@/hooks/auth.hook";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpInfoMsg, setOtpInfoMsg] = useState("");

  const loginMutation = useLogin();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationOtp();

  const handleLoginSuccess = (res: any) => {
    const accessToken = res.data?.accessToken;
    const refreshToken = res.data?.refreshToken;
    const user = res.data?.user;

    if (accessToken) {
      authLogin(accessToken, refreshToken, user);
    }

    toast.add({
      title: "Welcome Back",
      description: `Successfully signed in to BloodLink${user?.name ? `, ${user.name}` : ""}.`,
      type: "success",
    });

    // Redirect role appropriately if no explicit redirect
    if (!redirectUrl || redirectUrl === "/") {
      if (user?.role === "ADMIN") {
        router.push("/dashboard/admin");
        return;
      }
      if (user?.role === "ORGANIZATION" || user?.role === "HOSPITAL") {
        router.push("/dashboard/organization");
        return;
      }
      router.push("/dashboard/user");
      return;
    }
    router.push(redirectUrl);
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res: any) => {
          if (res.data?.requiresOtp) {
            setStep("otp");
            setOtpInfoMsg(
              res.data?.message ||
                `A 6-digit OTP verification code has been dispatched to ${email.trim()}.`
            );
            toast.add({
              title: "Verification Code Sent",
              description: "Please check your Gmail for the 6-digit OTP code.",
              type: "info",
            });
            return;
          }
          handleLoginSuccess(res);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid credentials. Please verify and try again.";

          // If backend requires verification or sent OTP
          if (
            msg.toLowerCase().includes("otp") ||
            msg.toLowerCase().includes("not verified") ||
            msg.toLowerCase().includes("verify your email") ||
            err?.response?.status === 403
          ) {
            setStep("otp");
            setOtpInfoMsg(msg);
            toast.add({
              title: "OTP Dispatched to Gmail",
              description: "Please enter the 6-digit OTP code sent to your email to log in.",
              type: "info",
            });
            return;
          }

          setErrorMsg(msg);
          toast.add({
            title: "Sign In Failed",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otp.trim().length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    // First attempt verification via verifyEmail
    verifyMutation.mutate(
      { email: email.trim(), otp: otp.trim() },
      {
        onSuccess: (res: any) => {
          handleLoginSuccess(res);
        },
        onError: (err: any) => {
          // If verifyEmail fails (e.g. user already verified), try logging in with otp payload
          loginMutation.mutate(
            { email: email.trim(), password, otp: otp.trim() },
            {
              onSuccess: (loginRes: any) => {
                handleLoginSuccess(loginRes);
              },
              onError: (loginErr: any) => {
                const msg =
                  loginErr?.response?.data?.message ||
                  err?.response?.data?.message ||
                  loginErr?.message ||
                  "Invalid or expired OTP code. Please check your email or request a new code.";
                setErrorMsg(msg);
                toast.add({
                  title: "Verification Failed",
                  description: msg,
                  type: "error",
                });
              },
            }
          );
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email address to resend OTP.");
      return;
    }
    setErrorMsg("");
    resendMutation.mutate(email.trim(), {
      onSuccess: () => {
        toast.add({
          title: "Code Dispatched",
          description: "A fresh 6-digit OTP has been sent to your Gmail.",
          type: "success",
        });
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to resend code. Please try again later.";
        setErrorMsg(msg);
        toast.add({
          title: "Resend Failed",
          description: msg,
          type: "error",
        });
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-red-50/40 via-background to-background dark:from-red-950/20 dark:via-background dark:to-background">
      {/* Top Header with Logo, Language, and Theme */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Logo size="md" showTagline />
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="ghost" size="sm" />
          <ThemeSwitcher variant="ghost" size="icon-sm" />
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <Card className="border border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                {step === "otp" ? <KeyRound className="size-6" /> : <Lock className="size-6" />}
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {step === "otp" ? "Two-Step Verification" : t.auth.loginTitle}
              </CardTitle>
              <CardDescription>
                {step === "otp"
                  ? "Enter the 6-digit OTP code sent to your email to log in."
                  : t.auth.loginSubtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {step === "otp" ? (
                /* STEP 2: OTP Verification Form */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-start gap-2.5">
                    <Mail className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Check your Gmail Inbox</p>
                      <p className="text-muted-foreground mt-0.5">
                        We sent a 6-digit OTP code to <strong className="text-foreground">{email}</strong>.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="otp" className="text-xs font-bold">
                        6-Digit Verification Code
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="otp"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="••••••"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          className="pl-9 text-center font-mono text-2xl font-bold tracking-[0.4em] h-12"
                          maxLength={6}
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        verifyMutation.isPending ||
                        loginMutation.isPending ||
                        otp.length !== 6
                      }
                      className="w-full font-bold shadow-md"
                    >
                      {verifyMutation.isPending || loginMutation.isPending
                        ? "Verifying Code..."
                        : "Verify & Sign In"}
                    </Button>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("credentials");
                          setOtp("");
                          setErrorMsg("");
                        }}
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium"
                      >
                        <ArrowLeft className="size-3.5" />
                        <span>Change Email / Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendMutation.isPending}
                        className="text-primary hover:underline font-bold disabled:opacity-50"
                      >
                        {resendMutation.isPending ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* STEP 1: Email & Password Credentials Form */
                <>
                  <form onSubmit={handleCredentialSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold">
                        {t.auth.emailLabel}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold">
                          {t.auth.passwordLabel}
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          {t.auth.forgotPasswordLink}
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 pr-9"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loginMutation.isPending}
                      className="w-full font-bold shadow-md"
                    >
                      {loginMutation.isPending ? "Checking Credentials..." : t.auth.loginBtn}
                    </Button>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("otp");
                          setErrorMsg("");
                        }}
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        Already have an OTP code? Enter here
                      </button>
                    </div>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        {t.auth.orContinueWith}
                      </span>
                    </div>
                  </div>

                  {/* Google OAuth Login */}
                  <div className="flex justify-center">
                    <GoogleLoginComponent mode="login" redirectUrl={redirectUrl} />
                  </div>
                </>
              )}

              <div className="text-center text-xs text-muted-foreground pt-2">
                {t.auth.noAccount}{" "}
                <Link
                  href="/register"
                  className="font-bold text-primary hover:underline underline-offset-4"
                >
                  {t.auth.registerBtn}
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
