import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authService,
  LoginPayload,
  RegisterPayload,
  GoogleAuthPayload,
} from "@/services/auth.service";
import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { IApiResponse, IUser } from "@/types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });
}
export const UseLogin = useLogin;

export function useRegistration() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
}
export const UseRegistration = useRegistration;

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      authService.verifyEmail(payload),
  });
}

export function useResendVerificationOtp() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationOtp(email),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      authService.verifyOtp(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { email: string; otp: string; newPassword: string }) =>
      authService.resetPassword(payload),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(payload),
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: (payload: GoogleAuthPayload | string) =>
      authService.googleOAuth(payload),
  });
}
export const UseGoogleOAuth = useGoogleOAuth;

export function useLogOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
export const UseLogOut = useLogOut;

export function useGetMe() {
  return useQuery({
    queryKey: ["user-me"],
    queryFn: async () => {
      const { data } = await apiClient.get<IApiResponse<IUser>>(
        API_ENDPOINTS.USERS.ME
      );
      return data;
    },
    retry: false,
  });
}
export const UseGetMe = useGetMe;
