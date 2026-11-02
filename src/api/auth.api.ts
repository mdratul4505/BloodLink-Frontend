import { apiClient } from "@/lib/apiClient";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  isDonor?: boolean;
  bloodGroup?: string;
  district?: string;
  upazila?: string;
  otp?: string;
}

export function userLogin(payload: { email: string; password: string }) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function userLogOut() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/users/me");
}

export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}

export function userRegister(payload: RegisterPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function resendVerificationOtp(payload: { email: string }) {
  return apiClient("/auth/resend-verification-otp", {
    method: "POST",
    body: payload,
  });
}
