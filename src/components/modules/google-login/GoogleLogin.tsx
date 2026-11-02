"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks/auth.hook";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";
import { AlertCircle } from "lucide-react";

interface GoogleLoginProps {
  mode?: "login" | "register";
  redirectUrl?: string;
}

export default function GoogleLoginComponent({
  mode = "login",
  redirectUrl,
}: GoogleLoginProps) {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { language } = useLanguage();
  const { mutate: googleLoginMutation, isPending } = useGoogleOAuth();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isConfigured = Boolean(
    clientId &&
      !clientId.includes("placeholder") &&
      !clientId.includes("your_google_client_id")
  );

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

    // Send the genuine Google ID token to backend for server-side verification
    googleLoginMutation(
      { idToken },
      {
        onSuccess: (res) => {
          const accessToken = res.data?.accessToken;
          const refreshToken = res.data?.refreshToken;
          const user = res.data?.user;

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
              : "Welcome to BloodLink",
            type: "success",
          });

          // Role-based redirection
          let targetPath = redirectUrl;
          if (!targetPath) {
            if (user?.role === "ADMIN") {
              targetPath = "/dashboard/admin";
            } else if (user?.role === "ORGANIZATION" || user?.role === "HOSPITAL") {
              targetPath = "/dashboard/organization";
            } else {
              targetPath = "/dashboard/user";
            }
          }

          router.push(targetPath);
        },
        onError: (err: any) => {
          const backendMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Server could not verify your Google credentials.";

          toast.add({
            title: "Authentication Failed",
            description: backendMessage,
            type: "error",
          });
        },
      }
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google Sign-In Notice",
      description:
        "Authentication popup was closed or origin was unauthorized. Ensure http://localhost:3000 is added under Authorized JavaScript origins in Google Cloud Console.",
      type: "error",
    });
  };

  if (!isConfigured) {
    return (
      <div className="w-full p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <span>Google OAuth Client ID Required</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Please add your Google Cloud Console OAuth 2.0 Web Client ID to{" "}
          <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">.env.local</code>{" "}
          as <code className="text-foreground font-mono bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {isPending ? (
        <div className="flex items-center gap-2 py-2.5 text-xs text-muted-foreground animate-pulse">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span>Verifying credentials with Google & BloodLink server...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!mx-auto">
          <GoogleLogin
            theme="outline"
            shape="pill"
            size="large"
            width="340"
            text={mode === "register" ? "signup_with" : "continue_with"}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            auto_select={false}
          />
        </div>
      )}
    </div>
  );
}
