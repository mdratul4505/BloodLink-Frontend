"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Droplet,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/common/Logo";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { useRegistration } from "@/hooks/auth.hook";
import { useLanguage } from "@/providers/language.provider";
import { BloodGroup } from "@/types";

const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: "A_POSITIVE", label: "A Positive (A+)" },
  { value: "A_NEGATIVE", label: "A Negative (A-)" },
  { value: "B_POSITIVE", label: "B Positive (B+)" },
  { value: "B_NEGATIVE", label: "B Negative (B-)" },
  { value: "AB_POSITIVE", label: "AB Positive (AB+)" },
  { value: "AB_NEGATIVE", label: "AB Negative (AB-)" },
  { value: "O_POSITIVE", label: "O Positive (O+)" },
  { value: "O_NEGATIVE", label: "O Negative (O-)" },
];

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
  "Comilla",
  "Satkhira",
  "Gazipur",
  "Narayanganj",
  "Bogura",
];

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isDonor, setIsDonor] = useState(true);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const registerMutation = useRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (isDonor && !bloodGroup) {
      setErrorMsg("Please select your blood group as a registered donor.");
      return;
    }
    if (isDonor && !district) {
      setErrorMsg("Please select your residential district.");
      return;
    }

    registerMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        isDonor,
        bloodGroup: isDonor ? bloodGroup : undefined,
        district: isDonor ? district : undefined,
        upazila: isDonor && upazila.trim() ? upazila.trim() : undefined,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Registration Initiated",
            description: "A 6-digit OTP verification code has been dispatched to your email.",
            type: "success",
          });
          router.push(`/verify-account?email=${encodeURIComponent(email.trim())}`);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Registration failed. Email might already be registered.";
          setErrorMsg(msg);
          toast.add({
            title: "Registration Error",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-red-50/40 via-background to-background dark:from-red-950/20 dark:via-background dark:to-background">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Logo size="md" showTagline />
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="ghost" size="sm" />
          <ThemeSwitcher variant="ghost" size="icon-sm" />
        </div>
      </header>

      {/* Register Form Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg space-y-6">
          <Card className="border border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-2">
                <UserPlus className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {t.auth.registerTitle}
              </CardTitle>
              <CardDescription>
                {t.auth.registerSubtitle}
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
                  <Label htmlFor="name" className="text-xs font-bold">
                    {t.auth.nameLabel} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="e.g. Ratul Hasan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold">
                      {t.auth.emailLabel} *
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
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold">
                      {t.auth.phoneLabel}
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="01700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold">
                      {t.auth.passwordLabel} *
                    </Label>
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
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-xs font-bold">
                      {t.auth.confirmPasswordLabel} *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Donor Onboarding Section */}
                <div className="pt-2 p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <Checkbox
                      id="is-donor"
                      checked={isDonor}
                      onCheckedChange={(checked) => setIsDonor(!!checked)}
                    />
                    <Label htmlFor="is-donor" className="text-sm font-bold cursor-pointer">
                      Register me as a voluntary Blood Donor
                    </Label>
                  </div>

                  {isDonor && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-muted-foreground">
                          {t.auth.bloodGroupLabel} *
                        </Label>
                        <Select
                          value={bloodGroup}
                          onValueChange={(val) => setBloodGroup(val as BloodGroup)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Group" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOOD_GROUPS.map((bg) => (
                              <SelectItem key={bg.value} value={bg.value}>
                                {bg.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-muted-foreground">
                          {t.auth.districtLabel} *
                        </Label>
                        <Select value={district} onValueChange={(val) => val && setDistrict(val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="District" />
                          </SelectTrigger>
                          <SelectContent>
                            {DISTRICTS.map((dst) => (
                              <SelectItem key={dst} value={dst}>
                                {dst}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-bold text-muted-foreground">
                          Upazila (Opt)
                        </Label>
                        <Input
                          placeholder="Upazila"
                          value={upazila}
                          onChange={(e) => setUpazila(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={registerMutation.isPending}
                  className="w-full font-bold shadow-md"
                >
                  {registerMutation.isPending ? "Creating Account..." : t.auth.registerBtn}
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

              {/* Google OAuth Register */}
              <div className="flex justify-center">
                <GoogleLoginComponent mode="register" redirectUrl="/dashboard/user" />
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                {t.auth.haveAccount}{" "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline underline-offset-4"
                >
                  {t.auth.loginBtn}
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
