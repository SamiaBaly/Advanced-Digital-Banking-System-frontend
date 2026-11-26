
import { baseApi } from "./baseApi";

export type StaffVerificationStatus =
  | "not_submitted"
  | "pending"
  | "verified"
  | "rejected";

export interface StaffVerification {
  status: StaffVerificationStatus;
  employeeId: string;
  nidNumber: string;
  dateOfBirth: string | null;
  address: string;
  rejectionReason: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface StaffVerificationResponse {
  success: boolean;
  data: {
    isIdentityVerified: boolean;
    verification: StaffVerification;
  };
}

export interface SubmitStaffVerificationRequest {
  employeeId: string;
  nidNumber: string;
  dateOfBirth: string;
  address: string;
}

export interface SubmitStaffVerificationResponse {
  success: boolean;
  message: string;
  data: {
    status: StaffVerificationStatus;
    submittedAt: string;
  };
}

export const staffVerificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffVerification: builder.query<
      StaffVerificationResponse,
      void
    >({
      query: () => "/staff/verification",
      providesTags: ["Staff"],
    }),

    submitStaffVerification: builder.mutation<
      SubmitStaffVerificationResponse,
      SubmitStaffVerificationRequest
    >({
      query: (body) => ({
        url: "/staff/verification",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetStaffVerificationQuery,
  useSubmitStaffVerificationMutation,
} = staffVerificationApi;
