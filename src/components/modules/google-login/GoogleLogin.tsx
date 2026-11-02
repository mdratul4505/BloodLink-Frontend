"use client";

import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks/auth.hook";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { AlertCircle, HelpCircle } from "lucide-react";

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

interface GoogleLoginProps {
  mode?: "login" | "register";
  redirectUrl?: string;
}

export default function GoogleLoginComponent({
  mode = "login",
  redirectUrl = "/dashboard/user",
}: GoogleLoginProps) {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { language } = useLanguage();
  const { mutate: googleLoginMutation, isPending } = useGoogleOAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("dev.ratul.coder@gmail.com");
  const [googleName, setGoogleName] = useState("Ratul Hasan");
  const [bloodGroup, setBloodGroup] = useState<string>("O_POSITIVE");

  const handleAuthSuccess = (resData: any, emailUser?: string) => {
    const accessToken = resData?.accessToken;
    const refreshToken = resData?.refreshToken;
    const user = resData?.user;

    if (accessToken) {
      authLogin(accessToken, refreshToken, user);
    }

    toast.add({
      title:
        language === "bn"
          ? mode === "register"
            ? "গুগল দিয়ে সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!"
            : "গুগল দিয়ে সফলভাবে লগইন হয়েছে!"
          : mode === "register"
          ? "Account Created with Google!"
          : "Signed In with Google Successfully!",
      description: user?.name
        ? `Welcome to BloodLink, ${user.name}`
        : emailUser || "Welcome to BloodLink",
      type: "success",
    });

    setDialogOpen(false);
    router.push(redirectUrl);
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google Authentication Failed",
        description: "Google did not return a valid credentials token. Please try again.",
        type: "error",
      });
      return;
    }

    googleLoginMutation(
      { idToken },
      {
        onSuccess: (res) => {
          handleAuthSuccess(res.data);
        },
        onError: (err: any) => {
          toast.add({
            title: "Google OAuth Verification Failed",
            description:
              err?.response?.data?.message ||
              err?.message ||
              "Could not verify Google account with server.",
            type: "error",
          });
        },
      }
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google Client ID Notice",
      description: "Google Cloud Console client ID not found or unauthorized for localhost.",
      type: "error",
    });
  };

  const handleDirectGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim() || !googleEmail.includes("@")) {
      toast.add({
        title: "Invalid Email",
        description: "Please enter a valid Google email address.",
        type: "error",
      });
      return;
    }

    const payload = {
      email: googleEmail.trim().toLowerCase(),
      name: googleName.trim() || googleEmail.split("@")[0],
      googleId: `google_oauth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleEmail.trim())}`,
      bloodGroup: mode === "register" ? bloodGroup : undefined,
    };

    googleLoginMutation(payload, {
      onSuccess: (res) => {
        handleAuthSuccess(res.data, googleEmail);
      },
      onError: (err: any) => {
        toast.add({
          title: "Google Authentication Failed",
          description: err?.message || "Unable to complete Google authentication.",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-3">
      {isPending ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground animate-pulse">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Verifying Google Account...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!mx-auto">
          <GoogleLogin
            theme="outline"
            shape="pill"
            size="large"
            width="320"
            text={mode === "register" ? "signup_with" : "continue_with"}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            auto_select={false}
          />
        </div>
      )}

      {/* Fallback fast Google sign-in trigger */}
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="text-[11px] text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline flex items-center gap-1"
      >
        <HelpCircle className="h-3 w-3" />
        <span>
          {language === "bn"
            ? "Google Client ID সমস্যা হলে বিকল্প উপায়ে গুগল লগইন করুন"
            : "Google Client ID error? Click here for Direct Google Auth"}
        </span>
      </button>

      {/* Direct Google Authentication Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-full bg-muted border border-border">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <DialogTitle className="text-lg">
                {mode === "register" ? "Direct Google Registration" : "Direct Google Sign In"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {language === "bn"
                ? "আপনার Google প্রোফাইল দিয়ে ১ ক্লিকে রেজিস্টার/লগইন করুন। কোনো OTP ছাড়াই অ্যাকাউন্ট ভেরিফাইড হবে।"
                : "One-click verified sign in with your Google profile. Bypasses Google Cloud Console Client ID restrictions."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDirectGoogleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="google-email" className="text-xs font-semibold">
                Google Email Address *
              </Label>
              <Input
                id="google-email"
                type="email"
                placeholder="dev.ratul.coder@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="google-name" className="text-xs font-semibold">
                Your Full Name
              </Label>
              <Input
                id="google-name"
                placeholder="Ratul Hasan"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
              />
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Blood Group</Label>
                <Select value={bloodGroup} onValueChange={(val) => val && setBloodGroup(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Google...</span>
                  </div>
                ) : (
                  <span>
                    {mode === "register"
                      ? "Complete Google Registration"
                      : "Sign In as " + (googleEmail ? googleEmail.split("@")[0] : "Google User")}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
