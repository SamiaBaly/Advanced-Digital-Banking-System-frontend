
import { baseApi } from "./baseApi";

export interface StaffTransactionAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
}

export interface StaffTransactionUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface StaffTransaction {
  _id: string;
  transactionId: string;
  type: "deposit" | "withdrawal";
  amountPaisa: number;
  feePaisa?: number;
  status: "pending" | "completed" | "rejected" | "failed";
  description?: string;
  createdAt: string;
  initiatedBy?: StaffTransactionUser;
  senderAccount?: StaffTransactionAccount;
  receiverAccount?: StaffTransactionAccount;
  reviewedBy?: StaffTransactionUser;
  reviewedAt?: string;
  reviewNote?: string;
}

export interface StaffTransactionsResponse {
  success: boolean;
  message: string;
  data: StaffTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetStaffTransactionsParams {
  page?: number;
  limit?: number;
  type?: "deposit" | "withdrawal" | "";
  status?: string;
  search?: string;
}

export interface ReviewStaffTransactionRequest {
  id: string;
  action: "approve" | "reject";
  reviewNote?: string;
}

export interface ReviewStaffTransactionResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    status: string;
    amountPaisa: number;
    balanceAfterPaisa?: number;
  };
}

export const staffTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffTransactions: builder.query<
      StaffTransactionsResponse,
      GetStaffTransactionsParams
    >({
      query: (params) => ({
        url: "/staff/transactions",
        params,
      }),
      providesTags: ["Transaction"],
    }),

    reviewStaffTransaction: builder.mutation<
      ReviewStaffTransactionResponse,
      ReviewStaffTransactionRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/staff/transactions/${id}/review`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Transaction", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStaffTransactionsQuery,
  useReviewStaffTransactionMutation,
} = staffTransactionApi;
