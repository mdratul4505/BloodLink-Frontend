import apiClient, {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
} from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { IApiResponse, IUser } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  isDonor?: boolean;
  bloodGroup?: string;
  district?: string;
  upazila?: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
  user: IUser;
}

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<IApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload
    );
    if (data.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
      }
      if (data.data.user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.data.user));
      }
    }
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return data;
  },

  verifyEmail: async (payload: { email: string; otp: string }) => {
    const { data } = await apiClient.post<IApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      payload
    );
    if (data.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
      }
      if (data.data.user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.data.user));
      }
    }
    return data;
  },

  resendVerificationOtp: async (email: string) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.RESEND_OTP,
      { email }
    );
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return data;
  },

  verifyOtp: async (payload: { email: string; otp: string }) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      payload
    );
    return data;
  },

  resetPassword: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload
    );
    return data;
  },

  changePassword: async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const { data } = await apiClient.post<IApiResponse<null>>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      payload
    );
    return data;
  },

  googleOAuth: async (payload: { idToken: string } | string) => {
    const idToken = typeof payload === "string" ? payload : payload.idToken;
    const { data } = await apiClient.post<IApiResponse<AuthResponseData>>(
      API_ENDPOINTS.AUTH.GOOGLE,
      { idToken }
    );
    if (data.data?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refreshToken);
      }
      if (data.data.user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.data.user));
      }
    }
    return data;
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
    }
  },
};
