"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks/auth.hook";
import { useAuth } from "@/providers/auth.provider";
import { useLanguage } from "@/providers/language.provider";

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

          router.push(redirectUrl);
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
      title: "Google Authentication Error",
      description: "Google sign-in popup was cancelled or failed to load. Please check your browser connection.",
      type: "error",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
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
    </div>
  );
}
