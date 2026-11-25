
import { baseApi } from "./baseApi";

export interface Transaction {
  _id: string;
  transactionId: string;
  type:
  | "deposit"
  | "withdrawal"
  | "fund_transfer"
  | "loan_disbursement"
  | "loan_repayment";

  senderAccount?: {
    _id: string;
    accountNumber: string;
    accountType: string;
  } | null;

  receiverAccount?: {
    _id: string;
    accountNumber: string;
    accountType: string;
  } | null;

  initiatedBy?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };

  reviewedBy?: {
    _id: string;
    fullName: string;
    email: string;
  } | null;

  reviewedAt?: string | null;
  reviewNote?: string;

  amountPaisa: number;
  feePaisa: number;

  status:
  | "pending"
  | "completed"
  | "failed"
  | "reversed"
  | "rejected";

  description: string;
  createdAt: string;
}

interface TransactionsResponse {
  success: boolean;
  message: string;
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export interface ReviewTransactionRequest {
  id: string;
  reviewNote?: string;
}

interface ReviewTransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin Transactions
    getTransactions: builder.query<
      TransactionsResponse,
      TransactionQueryParams
    >({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["Transaction"],
    }),

    // Approve Deposit / Withdrawal
    approveTransaction: builder.mutation<
      ReviewTransactionResponse,
      ReviewTransactionRequest
    >({
      query: ({ id, reviewNote }) => ({
        url: `/admin/transactions/${id}/approve`,
        method: "PATCH",
        body: { reviewNote },
      }),
      invalidatesTags: ["Transaction", "Account", "Dashboard"],
    }),

    // Reject Deposit / Withdrawal
    rejectTransaction: builder.mutation<
      ReviewTransactionResponse,
      ReviewTransactionRequest
    >({
      query: ({ id, reviewNote }) => ({
        url: `/admin/transactions/${id}/reject`,
        method: "PATCH",
        body: { reviewNote },
      }),
      invalidatesTags: ["Transaction", "Account", "Dashboard"],
    }),

    // Customer Transaction History
    getMyTransactions: builder.query<
      TransactionsResponse,
      TransactionQueryParams
    >({
      query: (params) => ({
        url: "/customer/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["Transaction"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetMyTransactionsQuery,
  useApproveTransactionMutation,
  useRejectTransactionMutation,
} = transactionApi;
