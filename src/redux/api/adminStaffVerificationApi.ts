
import { baseApi } from "./baseApi";

export interface AdminStaffVerificationRequest {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isIdentityVerified: boolean;
  staffVerification: {
    status: "pending";
    employeeId: string;
    nidNumber: string;
    dateOfBirth: string | null;
    address: string;
    rejectionReason: string;
    submittedAt: string | null;
    reviewedAt: string | null;
    reviewedBy: string | null;
  };
}

export interface AdminStaffVerificationResponse {
  success: boolean;
  data: AdminStaffVerificationRequest[];
}

export interface ReviewStaffVerificationRequest {
  id: string;
  decision: "approved" | "rejected";
  rejectionReason?: string;
}

export interface ReviewStaffVerificationResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    fullName: string;
    isIdentityVerified: boolean;
    verificationStatus: "verified" | "rejected";
    rejectionReason: string;
    reviewedAt: string;
  };
}

export const adminStaffVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStaffVerificationRequests: builder.query<
      AdminStaffVerificationResponse,
      void
    >({
      query: () => "/admin/staff-verification",
      providesTags: ["Staff"],
    }),

    reviewStaffVerification: builder.mutation<
      ReviewStaffVerificationResponse,
      ReviewStaffVerificationRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/staff-verification/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetAdminStaffVerificationRequestsQuery,
  useReviewStaffVerificationMutation,
} = adminStaffVerificationApi;
