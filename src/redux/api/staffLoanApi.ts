
import { baseApi } from "./baseApi";

export interface StaffLoanUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface StaffLoanAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balancePaisa?: number;
}

export interface StaffLoan {
  _id: string;
  customer: StaffLoanUser;
  disbursementAccount?: StaffLoanAccount | null;
  loanType: "personal" | "business" | "education" | "home" | "other";
  requestedAmountPaisa: number;
  durationMonths: number;
  monthlyIncomePaisa: number;
  employmentStatus:
  | "salaried"
  | "self_employed"
  | "business_owner"
  | "unemployed"
  | "other";
  applicationDescription?: string;
  status:
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "active"
  | "completed";
  assignedStaff?: StaffLoanUser;
  reviewedBy?: StaffLoanUser;
  reviewNotes?: string;
  approvedAmountPaisa?: number | null;
  interestRateBps?: number | null;
  totalRepayablePaisa?: number | null;
  outstandingBalancePaisa?: number | null;
  monthlyInstallmentPaisa?: number | null;
  disbursedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffLoansResponse {
  success: boolean;
  message: string;
  data: StaffLoan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetStaffLoansParams {
  page?: number;
  limit?: number;
  status?: string;
  loanType?: string;
  search?: string;
}

export interface ReviewStaffLoanRequest {
  id: string;
  action: "under_review" | "approved" | "rejected";
  reviewNotes?: string;
  approvedAmountPaisa?: number;
  interestRateBps?: number;
}

export interface ReviewStaffLoanResponse {
  success: boolean;
  message: string;
  data?: StaffLoan;
}

export interface DisburseStaffLoanRequest {
  id: string;
}

export interface DisburseStaffLoanResponse {
  success: boolean;
  message: string;
  data?: {
    loanId: string;
    status: string;
    amountPaisa: number;
    accountNumber?: string;
  };
}

export const staffLoanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffLoans: builder.query<
      StaffLoansResponse,
      GetStaffLoansParams
    >({
      query: (params) => ({
        url: "/staff/loans",
        params,
      }),
      providesTags: ["Loan"],
    }),

    getStaffLoanById: builder.query<
      { success: boolean; message: string; data: StaffLoan },
      string
    >({
      query: (id) => `/staff/loans/${id}`,
      providesTags: ["Loan"],
    }),

    reviewStaffLoan: builder.mutation<
      ReviewStaffLoanResponse,
      ReviewStaffLoanRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/staff/loans/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Loan", "Dashboard"],
    }),

    disburseStaffLoan: builder.mutation<
      DisburseStaffLoanResponse,
      DisburseStaffLoanRequest
    >({
      query: ({ id }) => ({
        url: `/staff/loans/${id}/disburse`,
        method: "POST",
      }),
      invalidatesTags: ["Loan", "Account", "Transaction", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStaffLoansQuery,
  useGetStaffLoanByIdQuery,
  useReviewStaffLoanMutation,
  useDisburseStaffLoanMutation,
} = staffLoanApi;
