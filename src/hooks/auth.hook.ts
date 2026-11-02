import {
  getMe,
  googleOAuth,
  resendVerificationOtp,
  userLogin,
  userLogOut,
  userRegister,
  verifyEmail,
  type RegisterPayload,
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}
export const UseLogin = useLogin;

export function useLogOut() {
  return useMutation({
    mutationFn: userLogOut,
  });
}
export const UseLogOut = useLogOut;

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}
export const UseGoogleOAuth = useGoogleOAuth;

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}
export const UseGetMe = useGetMe;

export function useRegistration() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => userRegister(payload),
  });
}
export const UseRegistration = useRegistration;

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      verifyEmail(payload),
  });
}

export function useResendVerificationOtp() {
  return useMutation({
    mutationFn: (payload: { email: string }) => resendVerificationOtp(payload),
  });
}
