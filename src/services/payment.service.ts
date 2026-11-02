import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { IApiResponse, IPayment } from "@/types";

export interface CreateBkashPaymentPayload {
  amount: number;
  purpose?: "PLATFORM_SUPPORT" | "EMERGENCY_FUND";
  payerReference?: string;
  requestId?: string;
}

export interface BkashCreateResponse {
  paymentId: string;
  bkashPaymentId: string;
  bkashURL: string;
}

export const paymentService = {
  createBkashPayment: async (payload: CreateBkashPaymentPayload) => {
    const { data } = await apiClient.post<IApiResponse<BkashCreateResponse>>(
      API_ENDPOINTS.PAYMENTS.BKASH_CREATE,
      payload
    );
    return data;
  },

  getMyPayments: async () => {
    const { data } = await apiClient.get<IApiResponse<IPayment[]>>(
      API_ENDPOINTS.PAYMENTS.MY
    );
    return data;
  },

  getPaymentById: async (id: string) => {
    const { data } = await apiClient.get<IApiResponse<IPayment>>(
      API_ENDPOINTS.PAYMENTS.DETAILS(id)
    );
    return data;
  },

  executeBkashCallback: async (params: { paymentID?: string; status?: string }) => {
    const { data } = await apiClient.get<IApiResponse<IPayment>>(
      API_ENDPOINTS.PAYMENTS.BKASH_CALLBACK,
      { params }
    );
    return data;
  },
};
