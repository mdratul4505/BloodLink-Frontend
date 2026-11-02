"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Lock, Eye, EyeOff, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useChangePassword } from "@/hooks/auth.hook";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const changeMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!oldPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    changeMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.add({
            title: "Password Changed",
            description: "Your account password has been updated securely.",
            type: "success",
          });
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to change password. Please check your current password.";
          setErrorMsg(msg);
          toast.add({
            title: "Error",
            description: msg,
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Change Password
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Update your secret credentials to keep your BloodLink account secure.
        </p>
      </div>

      <Card className="border border-border shadow-xs">
        <CardHeader>
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1">
            <KeyRound className="size-5" />
          </div>
          <CardTitle className="text-lg font-bold">Security Credentials</CardTitle>
          <CardDescription className="text-xs">
            Enter your current password followed by your chosen new password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="old-pass" className="text-xs font-bold">
                Current Password *
              </Label>
              <Input
                id="old-pass"
                type={showPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-pass" className="text-xs font-bold">
                New Password *
              </Label>
              <Input
                id="new-pass"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass" className="text-xs font-bold">
                Confirm New Password *
              </Label>
              <Input
                id="confirm-pass"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium"
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                <span>{showPassword ? "Hide Passwords" : "Show Passwords"}</span>
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={changeMutation.isPending}
                className="w-full font-bold shadow-md"
              >
                {changeMutation.isPending ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
