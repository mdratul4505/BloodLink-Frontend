export type Role = "USER" | "ORGANIZATION" | "HOSPITAL" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type RequestStatus =
  | "OPEN"
  | "PARTIALLY_FULFILLED"
  | "FULFILLED"
  | "CANCELLED"
  | "EXPIRED";

export type ResponseStatus = "AVAILABLE" | "UNABLE" | "CONFIRMED" | "DONATED";

export type UrgencyLevel = "NORMAL" | "URGENT" | "CRITICAL";

export type OrganizationType = "HOSPITAL" | "BLOOD_BANK" | "VOLUNTEER_GROUP";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type OrgMemberRole = "ADMIN" | "MEMBER";

export type CampStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type AttendanceStatus = "REGISTERED" | "ATTENDED" | "MISSED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type PaymentProvider = "BKASH";

export type PaymentPurpose = "PLATFORM_SUPPORT" | "EMERGENCY_FUND";

export type NotificationType =
  | "NEW_MATCHING_REQUEST"
  | "DONOR_RESPONDED"
  | "RESPONSE_CONFIRMED"
  | "REQUEST_STATUS_CHANGED"
  | "PAYMENT_UPDATE"
  | "CAMP_UPDATE"
  | "SYSTEM";

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IApiResponse<T = unknown> {
  statusCode?: number;
  success: boolean;
  message?: string;
  meta?: IMeta;
  data?: T;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  isVerified: boolean;
  phone?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
  donorProfile?: IDonorProfile | null;
}

export interface IDonorProfile {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  district: string;
  upazila?: string | null;
  isAvailable: boolean;
  lastDonationDate?: string | null;
  bio?: string | null;
  totalDonations: number;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface IBloodRequest {
  id: string;
  requesterId: string;
  organizationId?: string | null;
  patientName?: string | null;
  bloodGroup: BloodGroup;
  units: number;
  unitsFulfilled: number;
  hospitalName: string;
  district: string;
  upazila?: string | null;
  contactPhone: string;
  note?: string | null;
  urgency: UrgencyLevel;
  status: RequestStatus;
  neededBy: string;
  createdAt: string;
  updatedAt: string;
  requester?: IUser;
  organization?: IOrganization | null;
  responses?: IDonorResponse[];
}

export interface IDonorResponse {
  id: string;
  requestId: string;
  donorId: string;
  status: ResponseStatus;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  donor?: IUser;
  request?: IBloodRequest;
}

export interface IOrganization {
  id: string;
  name: string;
  type: OrganizationType;
  address: string;
  district: string;
  upazila?: string | null;
  contactPhone?: string | null;
  email?: string | null;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: IUser;
  members?: IOrganizationMember[];
  camps?: IDonationCamp[];
}

export interface IOrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  roleInOrg: OrgMemberRole;
  createdAt: string;
  user?: IUser;
}

export interface IDonationCamp {
  id: string;
  organizationId: string;
  title: string;
  description?: string | null;
  venue: string;
  district: string;
  date: string;
  status: CampStatus;
  createdAt: string;
  updatedAt: string;
  organization?: IOrganization;
  registrations?: ICampRegistration[];
}

export interface ICampRegistration {
  id: string;
  campId: string;
  userId: string;
  attendance: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string | null;
  requestId?: string | null;
  createdAt: string;
}

export interface IPayment {
  id: string;
  userId: string;
  provider: PaymentProvider;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  merchantInvoiceNumber: string;
  bkashPaymentId?: string | null;
  trxId?: string | null;
  payerReference?: string | null;
  payerMobile?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface IAuditLog {
  id: string;
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
  actor?: IUser | null;
}

export interface IDashboardStats {
  totalUsers: number;
  totalDonors: number;
  totalRequests: number;
  openRequests: number;
  totalOrganizations: number;
  verifiedOrganizations: number;
  totalCamps: number;
  totalPaymentsAmount: number;
  totalPaymentsCount: number;
}
