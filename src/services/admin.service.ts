import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  IApiResponse,
  IUser,
  IOrganization,
  IDashboardStats,
  IAuditLog,
  IPayment,
  UserStatus,
  VerificationStatus,
} from "@/types";

export const adminService = {
  getUsers: async (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<IApiResponse<IUser[]>>(
      API_ENDPOINTS.ADMIN.USERS,
      { params }
    );
    return data;
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    const { data } = await apiClient.patch<IApiResponse<IUser>>(
      API_ENDPOINTS.ADMIN.UPDATE_USER_STATUS(id),
      { status }
    );
    return data;
  },

  verifyOrganization: async (id: string, status: VerificationStatus, rejectionReason?: string) => {
    const { data } = await apiClient.patch<IApiResponse<IOrganization>>(
      API_ENDPOINTS.ADMIN.VERIFY_ORG(id),
      { status, rejectionReason }
    );
    return data;
  },

  getDashboardStats: async () => {
    const { data } = await apiClient.get<IApiResponse<IDashboardStats>>(
      API_ENDPOINTS.ADMIN.DASHBOARD_STATS
    );
    return data;
  },

  getAuditLogs: async (params?: { action?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<IApiResponse<IAuditLog[]>>(
      API_ENDPOINTS.ADMIN.AUDIT_LOGS,
      { params }
    );
    return data;
  },

  getPayments: async (params?: { status?: string; page?: number; limit?: number }) => {
    const { data } = await apiClient.get<IApiResponse<IPayment[]>>(
      API_ENDPOINTS.ADMIN.PAYMENTS,
      { params }
    );
    return data;
  },
};
