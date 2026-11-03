"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Droplet, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
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
import { useLogin } from "@/hooks/auth.hook";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const { login: authLogin } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res) => {
          const accessToken = res.data?.accessToken;
          const refreshToken = res.data?.refreshToken;
          const user = res.data?.user;

          if (accessToken) {
            authLogin(accessToken, refreshToken, user);
          }

          toast.add({
            title: "Welcome Back",
            description: "Successfully signed in to BloodLink.",
            type: "success",
          });

          // Redirect role appropriately if no explicit redirect
          if (redirectUrl === "/") {
            if (user?.role === "ADMIN") {
              router.push("/dashboard/admin");
              return;
            }
            if (user?.role === "ORGANIZATION" || user?.role === "HOSPITAL") {
              router.push("/dashboard/organization");
              return;
            }
          }
          router.push(redirectUrl);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid credentials. Please verify and try again.";
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
                <Lock className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {t.auth.loginTitle}
              </CardTitle>
              <CardDescription>
                {t.auth.loginSubtitle}
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
                  {loginMutation.isPending ? "Signing In..." : t.auth.loginBtn}
                </Button>
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
