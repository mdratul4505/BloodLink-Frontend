"use client";

import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { useAuth } from "@/providers/auth.provider";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

interface GoogleLoginComponentProps {
  mode?: "login" | "register";
  redirectUrl?: string;
}

export default function GoogleLoginComponent({
  mode = "login",
  redirectUrl = "/",
}: GoogleLoginComponentProps) {
  const router = useRouter();
  const { mutate: googleLogin, isPending } = useGoogleOAuth();
  const { login: authLogin } = useAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google Authentication Failed",
        description: "Google did not return a valid credential. Please try again.",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: (res: any) => {
          const accessToken = res?.data?.accessToken;
          const refreshToken = res?.data?.refreshToken;
          const user = res?.data?.user;

          if (accessToken) {
            authLogin(accessToken, refreshToken, user);
          }

          toast.add({
            title: "Logged in Successfully",
            description: `Welcome to BloodLink${user?.name ? `, ${user.name}` : ""}!`,
            type: "success",
          });

          if (redirectUrl && redirectUrl !== "/") {
            router.push(redirectUrl);
            return;
          }

          if (user?.role === "ADMIN") {
            router.push("/dashboard/admin");
          } else if (user?.role === "ORGANIZATION" || user?.role === "HOSPITAL") {
            router.push("/dashboard/organization");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Google authentication failed. Please try again.";
          toast.add({
            title: "Google Authentication Failed",
            description: msg,
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google Sign-In Cancelled",
      description: "Google sign-in was closed or failed to initialize.",
      type: "error",
    });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <GoogleLogin
        theme="outline"
        shape="pill"
        text="continue_with"
        width="100%"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </div>
  );
}