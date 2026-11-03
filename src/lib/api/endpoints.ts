export const API_ENDPOINTS = {
  // General
  ROOT: "/",
  HEALTH: "/health",

  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-verification-otp",
    LOGIN: "/auth/login",
    GOOGLE: "/auth/google",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // Users
  USERS: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    ME_AVATAR: "/users/me/avatar",
    AVAILABILITY: "/users/availability",
  },

  // Donors
  DONORS: {
    LIST: "/donors",
    DETAILS: (id: string) => `/donors/${id}`,
    MY_AVAILABILITY: "/donors/me/availability",
  },

  // Blood Requests
  BLOOD_REQUESTS: {
    CREATE: "/blood-requests",
    LIST: "/blood-requests",
    MY_REQUESTS: "/blood-requests/my-requests",
    DETAILS: (id: string) => `/blood-requests/${id}`,
    UPDATE: (id: string) => `/blood-requests/${id}`,
    DELETE: (id: string) => `/blood-requests/${id}`,
    RESPOND: (id: string) => `/blood-requests/${id}/respond`,
    RESPONSES: (id: string) => `/blood-requests/${id}/responses`,
    CONFIRM_RESPONSE: (id: string, donorId: string) =>
      `/blood-requests/${id}/responses/${donorId}/confirm`,
    STATUS: (id: string) => `/blood-requests/${id}/status`,
    COMPLETE_DONATION: (id: string) => `/blood-requests/${id}/complete-donation`,
  },

  // Organizations
  ORGANIZATIONS: {
    CREATE: "/organizations",
    LIST: "/organizations",
    DETAILS: (id: string) => `/organizations/${id}`,
    UPDATE: (id: string) => `/organizations/${id}`,
  },

  // Donation Camps
  CAMPS: {
    CREATE: "/camps",
    LIST: "/camps",
    DETAILS: (id: string) => `/camps/${id}`,
    REGISTER: (id: string) => `/camps/${id}/register`,
    UPDATE_STATUS: (id: string) => `/camps/${id}/status`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/read-all",
  },

  // Payments
  PAYMENTS: {
    BKASH_CREATE: "/payments/bkash/create",
    BKASH_CALLBACK: "/payments/bkash/callback",
    MY: "/payments/my",
    DETAILS: (id: string) => `/payments/${id}`,
  },

  // Admin
  ADMIN: {
    USERS: "/admin/users",
    UPDATE_USER_STATUS: (id: string) => `/admin/users/${id}/status`,
    VERIFY_ORG: (id: string) => `/admin/organizations/${id}/verify`,
    DASHBOARD_STATS: "/admin/dashboard-stats",
    AUDIT_LOGS: "/admin/audit-logs",
    PAYMENTS: "/admin/payments",
  },
} as const;
