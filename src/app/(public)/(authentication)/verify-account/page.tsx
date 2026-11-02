"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useResendVerificationOtp, useVerifyEmail } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } =
    useResendVerificationOtp();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    verifyOtp(
      { email: email.trim().toLowerCase(), otp: otp.trim() },
      {
        onSuccess: (res: any) => {
          toast.add({
            title: "Verification Successful",
            description:
              res?.message ||
              "Your email has been verified! You can now log in.",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err: any) => {
          const message =
            err?.data?.message ||
            err?.message ||
            "Invalid OTP code. Please try again.";
          setError(message);
          toast.add({
            title: "Verification Failed",
            description: message,
            type: "error",
          });
        },
      },
    );
  };

  const handleResend = () => {
    if (!email.trim()) {
      toast.add({
        title: "Email Required",
        description: "Please enter your email to resend OTP.",
        type: "error",
      });
      return;
    }

    resendOtp(
      { email: email.trim().toLowerCase() },
      {
        onSuccess: (res: any) => {
          toast.add({
            title: "Code Sent",
            description:
              res?.message ||
              "A fresh 6-digit verification code has been sent to your email.",
            type: "success",
          });
        },
        onError: (err: any) => {
          const message =
            err?.data?.message ||
            err?.message ||
            "Failed to resend code. Please try again later.";
          toast.add({
            title: "Resend Failed",
            description: message,
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Verify Your Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit verification code sent to your email address
        </p>
      </div>

      <form onSubmit={handleVerify}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </Field>

          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="otp">6-Digit Verification Code</FieldLabel>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="text-center text-2xl tracking-widest font-mono font-bold"
              required
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>

          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? (
              <>
                <Spinner /> Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="flex flex-col items-center gap-2 text-center text-sm">
        <div className="text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-medium text-primary underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <div className="text-muted-foreground">
          Already verified?{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/logo.jpg"
              alt="Blood Link Logo"
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
            <span className="font-semibold text-lg">Blood Link</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense
              fallback={
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              }
            >
              <VerifyAccountForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/register.jpg"
          alt="Blood Link Verify"
          fill
          priority
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
