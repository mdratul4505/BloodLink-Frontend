import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  IApiResponse,
  IDonorProfile,
  IBloodRequest,
  IOrganization,
  IDonationCamp,
  IDashboardStats,
  BloodGroup,
} from "@/types";

export const donorService = {
  getDonors: async (params?: {
    bloodGroup?: string;
    district?: string;
    upazila?: string;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await apiClient.get<IApiResponse<IDonorProfile[]>>(
      API_ENDPOINTS.DONORS.LIST,
      { params }
    );
    return data;
  },

  getDonorById: async (id: string) => {
    const { data } = await apiClient.get<IApiResponse<IDonorProfile>>(
      API_ENDPOINTS.DONORS.DETAILS(id)
    );
    return data;
  },

  updateMyAvailability: async (isAvailable: boolean) => {
    const { data } = await apiClient.patch<IApiResponse<IDonorProfile>>(
      API_ENDPOINTS.DONORS.MY_AVAILABILITY,
      { isAvailable }
    );
    return data;
  },
};

export const bloodRequestService = {
  getRequests: async (params?: {
    bloodGroup?: string;
    district?: string;
    status?: string;
    urgency?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await apiClient.get<IApiResponse<IBloodRequest[]>>(
      API_ENDPOINTS.BLOOD_REQUESTS.LIST,
      { params }
    );
    return data;
  },

  getMyRequests: async () => {
    const { data } = await apiClient.get<IApiResponse<IBloodRequest[]>>(
      API_ENDPOINTS.BLOOD_REQUESTS.MY_REQUESTS
    );
    return data;
  },

  getRequestById: async (id: string) => {
    const { data } = await apiClient.get<IApiResponse<IBloodRequest>>(
      API_ENDPOINTS.BLOOD_REQUESTS.DETAILS(id)
    );
    return data;
  },

  createRequest: async (payload: {
    patientName?: string;
    bloodGroup: BloodGroup;
    units: number;
    hospitalName: string;
    district: string;
    upazila?: string;
    contactPhone: string;
    neededBy: string;
    urgency?: string;
    note?: string;
    organizationId?: string;
  }) => {
    const { data } = await apiClient.post<IApiResponse<IBloodRequest>>(
      API_ENDPOINTS.BLOOD_REQUESTS.CREATE,
      payload
    );
    return data;
  },

  updateRequest: async (id: string, payload: Partial<IBloodRequest>) => {
    const { data } = await apiClient.patch<IApiResponse<IBloodRequest>>(
      API_ENDPOINTS.BLOOD_REQUESTS.UPDATE(id),
      payload
    );
    return data;
  },

  deleteRequest: async (id: string) => {
    const { data } = await apiClient.delete<IApiResponse<null>>(
      API_ENDPOINTS.BLOOD_REQUESTS.DELETE(id)
    );
    return data;
  },

  respondToRequest: async (
    id: string,
    payload: { status: "AVAILABLE" | "UNABLE"; message?: string }
  ) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.BLOOD_REQUESTS.RESPOND(id),
      payload
    );
    return data;
  },

  getResponses: async (id: string) => {
    const { data } = await apiClient.get(
      API_ENDPOINTS.BLOOD_REQUESTS.RESPONSES(id)
    );
    return data;
  },

  confirmResponse: async (id: string, donorId: string) => {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.BLOOD_REQUESTS.CONFIRM_RESPONSE(id, donorId),
      { donorId }
    );
    return data;
  },

  completeDonation: async (
    id: string,
    payload: { donorId: string; unitsDonated?: number }
  ) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.BLOOD_REQUESTS.COMPLETE_DONATION(id),
      payload
    );
    return data;
  },
};

export const organizationService = {
  getOrganizations: async (params?: {
    district?: string;
    verificationStatus?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await apiClient.get<IApiResponse<IOrganization[]>>(
      API_ENDPOINTS.ORGANIZATIONS.LIST,
      { params }
    );
    return data;
  },

  getOrganizationById: async (id: string) => {
    const { data } = await apiClient.get<IApiResponse<IOrganization>>(
      API_ENDPOINTS.ORGANIZATIONS.DETAILS(id)
    );
    return data;
  },

  createOrganization: async (payload: {
    name: string;
    type: string;
    address: string;
    district: string;
    upazila?: string;
    contactPhone?: string;
    email?: string;
  }) => {
    const { data } = await apiClient.post<IApiResponse<IOrganization>>(
      API_ENDPOINTS.ORGANIZATIONS.CREATE,
      payload
    );
    return data;
  },

  updateOrganization: async (id: string, payload: Partial<IOrganization>) => {
    const { data } = await apiClient.patch<IApiResponse<IOrganization>>(
      API_ENDPOINTS.ORGANIZATIONS.UPDATE(id),
      payload
    );
    return data;
  },
};

export const campService = {
  getCamps: async (params?: {
    district?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const { data } = await apiClient.get<IApiResponse<IDonationCamp[]>>(
      API_ENDPOINTS.CAMPS.LIST,
      { params }
    );
    return data;
  },

  getCampById: async (id: string) => {
    const { data } = await apiClient.get<IApiResponse<IDonationCamp>>(
      API_ENDPOINTS.CAMPS.DETAILS(id)
    );
    return data;
  },

  createCamp: async (payload: {
    organizationId: string;
    title: string;
    venue: string;
    district: string;
    date: string;
    description?: string;
  }) => {
    const { data } = await apiClient.post<IApiResponse<IDonationCamp>>(
      API_ENDPOINTS.CAMPS.CREATE,
      payload
    );
    return data;
  },

  registerForCamp: async (campId: string) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.CAMPS.REGISTER(campId)
    );
    return data;
  },

  updateStatus: async (campId: string, status: string) => {
    const { data } = await apiClient.patch(
      API_ENDPOINTS.CAMPS.UPDATE_STATUS(campId),
      { status }
    );
    return data;
  },
};

export const statsService = {
  getStats: async (): Promise<IDashboardStats> => {
    try {
      const { data } = await apiClient.get<IApiResponse<IDashboardStats>>(
        API_ENDPOINTS.ADMIN.DASHBOARD_STATS
      );
      if (data.data) {
        return data.data;
      }
    } catch {
      // If not logged in as admin, fetch public counts
    }

    try {
      const [donorsRes, requestsRes, orgsRes, campsRes] = await Promise.all([
        donorService.getDonors({ limit: 1 }),
        bloodRequestService.getRequests({ limit: 1 }),
        organizationService.getOrganizations({ limit: 1 }),
        campService.getCamps({ limit: 1 }),
      ]);

      return {
        totalUsers: (donorsRes.meta?.total || 0) + 10,
        totalDonors: donorsRes.meta?.total || 0,
        totalRequests: requestsRes.meta?.total || 0,
        openRequests: requestsRes.meta?.total || 0,
        totalOrganizations: orgsRes.meta?.total || 0,
        verifiedOrganizations: orgsRes.meta?.total || 0,
        totalCamps: campsRes.meta?.total || 0,
        totalPaymentsAmount: 0,
        totalPaymentsCount: 0,
      };
    } catch {
      return {
        totalUsers: 0,
        totalDonors: 0,
        totalRequests: 0,
        openRequests: 0,
        totalOrganizations: 0,
        verifiedOrganizations: 0,
        totalCamps: 0,
        totalPaymentsAmount: 0,
        totalPaymentsCount: 0,
      };
    }
  },
};

export * from "./auth.service";
export * from "./notification.service";
export * from "./payment.service";
export * from "./admin.service";

