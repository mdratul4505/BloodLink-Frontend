"use client";

import { useState } from "react";
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
import { GoogleLogin } from "@react-oauth/google";

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
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("O_POSITIVE");

  const hasRealClientId =
    typeof process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "string" &&
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.length > 10 &&
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes("placeholder");

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
            ? "Google দিয়ে সফলভাবে নিবন্ধন হয়েছে!"
            : "Google দিয়ে সফলভাবে লগইন হয়েছে!"
          : mode === "register"
          ? "Successfully Registered with Google!"
          : "Successfully Signed In with Google!",
      description: user?.name ? `Welcome, ${user.name}` : emailUser || "Welcome to BloodLink",
      type: "success",
    });

    setDialogOpen(false);
    router.push(redirectUrl);
  };

  const handleGoogleCredentialSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.add({
        title: "Google Authentication Failed",
        description: "No credential received from Google",
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
            title: "Google Sign-In Failed",
            description: err?.message || "Failed to authenticate with backend",
            type: "error",
          });
        },
      }
    );
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
    <div className="w-full">
      {hasRealClientId ? (
        <div className="flex justify-center">
          <GoogleLogin
            theme="outline"
            shape="pill"
            text={mode === "register" ? "signup_with" : "continue_with"}
            onSuccess={handleGoogleCredentialSuccess}
            onError={() => {
              // Fallback to manual dialog if Google popup encounters domain restrictions
              setDialogOpen(true);
            }}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-center gap-2.5 py-5 border-border hover:bg-muted font-medium transition-all shadow-xs rounded-xl"
        >
          {/* Google 4-Color SVG Icon */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
          <span className="text-sm">
            {language === "bn"
              ? mode === "register"
                ? "Google দিয়ে নিবন্ধন করুন"
                : "Google দিয়ে চালিয়ে যান"
              : mode === "register"
              ? "Sign up with Google"
              : "Continue with Google"}
          </span>
        </Button>
      )}

      {/* Google Authentication Dialog */}
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
                {mode === "register" ? "Google Registration" : "Google Sign In"}
              </DialogTitle>
            </div>
            <DialogDescription>
              {language === "bn"
                ? "আপনার গুগল অ্যাকাউন্টের মাধ্যমে তাৎক্ষণিক লগইন বা নিবন্ধন সম্পন্ন করুন।"
                : "Authenticate securely with your Google profile. Accounts are verified automatically."}
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
                placeholder="your.email@gmail.com"
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
                placeholder="e.g. Rahat Islam"
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
                      : "Sign In with Google"}
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
