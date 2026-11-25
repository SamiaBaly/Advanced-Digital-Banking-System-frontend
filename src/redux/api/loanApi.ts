
import { baseApi } from "./baseApi";

export type LoanStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

export type LoanType =
  | "personal"
  | "business"
  | "education"
  | "home"
  | "other";

export type EmploymentStatus =
  | "salaried"
  | "self_employed"
  | "business_owner"
  | "unemployed"
  | "other";

export interface LoanCustomer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface LoanAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  balancePaisa?: number;
}

export interface LoanStaff {
  _id: string;
  fullName: string;
  email: string;
}

export interface Loan {
  _id: string;
  customer: LoanCustomer;
  disbursementAccount?: LoanAccount | null;

  loanType: LoanType;
  requestedAmountPaisa: number;
  durationMonths: number;
  monthlyIncomePaisa: number;
  employmentStatus: EmploymentStatus;

  applicationDescription: string;
  status: LoanStatus;

  assignedStaff?: LoanStaff | null;
  reviewedBy?: LoanStaff | null;

  reviewNotes: string;
  approvedAmountPaisa: number | null;
  interestRateBps: number | null;
  totalRepayablePaisa: number | null;
  outstandingBalancePaisa: number | null;
  monthlyInstallmentPaisa: number | null;

  disbursedAt: string | null;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

interface LoanListResponse {
  success: boolean;
  data: Loan[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SingleLoanResponse {
  success: boolean;
  data: Loan;
}

interface UpdateLoanResponse {
  success: boolean;
  message: string;
  data: Loan;
}

interface GetLoansParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  loanType?: string;
}

interface UpdateLoanStatusPayload {
  id: string;
  status: LoanStatus;
  reviewNotes?: string;
  approvedAmountPaisa?: number;
  interestRateBps?: number;
}

// Customer loan application payload
export interface CreateLoanApplicationPayload {
  loanType: LoanType;
  requestedAmountPaisa: number;
  durationMonths: number;
  monthlyIncomePaisa: number;
  employmentStatus: EmploymentStatus;
  applicationDescription?: string;
  disbursementAccount?: string;
}

interface CreateLoanApplicationResponse {
  success: boolean;
  message: string;
  data: Loan;
}

// Customer loan repayment payload
export interface RepayLoanPayload {
  id: string;
  amountPaisa: number;
  paymentAccount: string;
}

interface RepayLoanResponse {
  success: boolean;
  message: string;
  data: {
    loanId: string;
    paymentAmountPaisa: number;
    remainingBalancePaisa: number;
    loanStatus: LoanStatus;
    accountBalancePaisa: number;
    transactionId: string;
  };
}

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Get all loans
    getLoans: builder.query<LoanListResponse, GetLoansParams>({
      query: (params) => ({
        url: "/admin/loans",
        method: "GET",
        params,
      }),
      providesTags: ["Loan"],
    }),

    // Admin: Get single loan
    getLoanById: builder.query<SingleLoanResponse, string>({
      query: (id) => ({
        url: `/admin/loans/${id}`,
        method: "GET",
      }),
      providesTags: ["Loan"],
    }),

    // Admin: Update loan status
    updateLoanStatus: builder.mutation<
      UpdateLoanResponse,
      UpdateLoanStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/loans/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Loan", "Dashboard"],
    }),

    // Admin: Disburse approved loan
    disburseLoan: builder.mutation<UpdateLoanResponse, string>({
      query: (id) => ({
        url: `/admin/loans/${id}/disburse`,
        method: "POST",
      }),
      invalidatesTags: ["Loan", "Dashboard", "Account", "Transaction"],
    }),

    // Customer: Submit loan application
    createLoanApplication: builder.mutation<
      CreateLoanApplicationResponse,
      CreateLoanApplicationPayload
    >({
      query: (body) => ({
        url: "/customer/loans",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loan", "Dashboard"],
    }),

    // Customer: Get own loan applications
    getMyLoans: builder.query<LoanListResponse, GetLoansParams>({
      query: (params) => ({
        url: "/customer/loans",
        method: "GET",
        params,
      }),
      providesTags: ["Loan"],
    }),

    // Customer: Get own loan details
    getMyLoanById: builder.query<SingleLoanResponse, string>({
      query: (id) => ({
        url: `/customer/loans/${id}`,
        method: "GET",
      }),
      providesTags: ["Loan"],
    }),

    // Customer: Repay loan
    repayLoan: builder.mutation<RepayLoanResponse, RepayLoanPayload>({
      query: ({ id, ...body }) => ({
        url: `/customer/loans/${id}/repay`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Loan", "Dashboard", "Account", "Transaction"],
    }),
  }),
});

export const {
  useGetLoansQuery,
  useGetLoanByIdQuery,
  useUpdateLoanStatusMutation,
  useDisburseLoanMutation,
  useCreateLoanApplicationMutation,
  useGetMyLoansQuery,
  useGetMyLoanByIdQuery,
  useRepayLoanMutation,
} = loanApi;
