
import { baseApi } from "./baseApi";

export interface StaffHistoryUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface StaffHistoryAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
}

export interface StaffHistoryEntry {
  account: string;
  direction: "debit" | "credit";
  amountPaisa: number;
  balanceBeforePaisa: number;
  balanceAfterPaisa: number;
}

export interface StaffHistoryTransaction {
  _id: string;
  transactionId: string;
  type: string;
  amountPaisa: number;
  feePaisa?: number;
  status: string;
  description?: string;
  initiatedBy?: StaffHistoryUser | null;
  senderAccount?: StaffHistoryAccount | null;
  receiverAccount?: StaffHistoryAccount | null;
  reviewedBy?: StaffHistoryUser | null;
  entries?: StaffHistoryEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface StaffHistoryResponse {
  success: boolean;
  message: string;
  data: StaffHistoryTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetStaffHistoryParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  search?: string;
}

export const staffTransactionHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffTransactionHistory: builder.query<
      StaffHistoryResponse,
      GetStaffHistoryParams
    >({
      query: (params) => ({
        url: "/staff/transactions/history",
        method: "GET",
        params,
      }),
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useGetStaffTransactionHistoryQuery } =
  staffTransactionHistoryApi;
