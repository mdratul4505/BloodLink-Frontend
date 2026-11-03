import apiClient from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { IApiResponse, INotification } from "@/types";

export const notificationService = {
  getNotifications: async () => {
    const { data } = await apiClient.get<
      IApiResponse<{ notifications: INotification[]; unreadCount: number } | INotification[]>
    >(API_ENDPOINTS.NOTIFICATIONS.LIST);
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await apiClient.patch<IApiResponse<INotification>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.patch<IApiResponse<{ count: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    );
    return data;
  },
};
