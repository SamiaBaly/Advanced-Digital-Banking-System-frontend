
import { baseApi } from "./baseApi";

export interface AccountOwner {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface Account {
  _id: string;
  owner: AccountOwner;
  accountNumber: string;
  accountType: "savings" | "current" | "business";
  balancePaisa: number;
  currency: "BDT";
  accountStatus: "active" | "frozen" | "blocked" | "closed";
  isPrimary: boolean;
  branchName?: string | null;
  createdAt: string;
}

export interface CustomerAccount {
  _id: string;
  accountNumber: string;
  accountType: "savings" | "current" | "business";
  balancePaisa: number;
  currency: "BDT";
  accountStatus: "active" | "frozen" | "blocked" | "closed";
  isPrimary: boolean;
  branchName?: string | null;
  createdAt: string;
}

export interface CustomerAccountsResponse {
  success: boolean;
  message: string;
  data: CustomerAccount[];
}

export interface AccountsResponse {
  success: boolean;
  message: string;
  data: {
    accounts: Account[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AccountQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  accountType?: string;
}

export interface UpdateAccountStatusRequest {
  id: string;
  accountStatus: Account["accountStatus"];
}

export interface CreateAccountRequest {
  ownerId: string;
  accountType: Account["accountType"];
  branchName?: string;
}

export interface CreateAccountResponse {
  success: boolean;
  message: string;
  data: Account;
}

// CUSTOMER FUND TRANSFER
export interface FundTransferRequest {
  senderAccountId: string;
  receiverAccountNumber: string;
  amountPaisa: number;
  description?: string;
  idempotencyKey: string;
}

export interface FundTransferTransaction {
  _id: string;
  transactionId: string;
  type: "fund_transfer";
  senderAccount: string;
  receiverAccount: string;
  amountPaisa: number;
  feePaisa: number;
  status: "pending" | "completed" | "failed" | "reversed";
  description?: string;
  createdAt: string;
}

export interface FundTransferResponse {
  success: boolean;
  message: string;
  data: FundTransferTransaction;
}

// CUSTOMER DEPOSIT & WITHDRAWAL
export interface DepositWithdrawRequest {
  accountId: string;
  amountPaisa: number;
  description?: string;
}

export interface DepositWithdrawTransaction {
  _id: string;
  transactionId: string;
  type: "deposit" | "withdrawal";
  amountPaisa: number;
  feePaisa: number;
  status: "pending" | "completed" | "failed" | "rejected";
  description?: string;
  createdAt: string;
}

export interface DepositWithdrawResponse {
  success: boolean;
  message: string;
  data: DepositWithdrawTransaction;
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADMIN: Get all accounts
    getAccounts: builder.query<AccountsResponse, AccountQueryParams>({
      query: (params) => ({
        url: "/admin/accounts",
        method: "GET",
        params,
      }),
      providesTags: ["Account"],
    }),

    // CUSTOMER: Get logged-in customer's own accounts
    getMyAccounts: builder.query<CustomerAccountsResponse, void>({
      query: () => ({
        url: "/customer/accounts",
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    // ADMIN: Create account
    createAccount: builder.mutation<
      CreateAccountResponse,
      CreateAccountRequest
    >({
      query: (body) => ({
        url: "/admin/accounts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account", "Dashboard"],
    }),

    // ADMIN: Update account status
    updateAccountStatus: builder.mutation<
      { success: boolean; message: string; data: Account },
      UpdateAccountStatusRequest
    >({
      query: ({ id, accountStatus }) => ({
        url: `/admin/accounts/${id}/status`,
        method: "PATCH",
        body: { accountStatus },
      }),
      invalidatesTags: ["Account", "Dashboard"],
    }),

    // CUSTOMER: Fund Transfer
    transferFunds: builder.mutation<
      FundTransferResponse,
      FundTransferRequest
    >({
      query: ({ idempotencyKey, ...body }) => ({
        url: "/customer/transfer",
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        body,
      }),
      invalidatesTags: ["Account", "Dashboard", "Transaction"],
    }),

    // CUSTOMER: Deposit Request
    requestDeposit: builder.mutation<
      DepositWithdrawResponse,
      DepositWithdrawRequest & { idempotencyKey: string }
    >({
      query: ({ idempotencyKey, ...body }) => ({
        url: "/customer/deposit-withdraw/deposit",
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        body,
      }),
      invalidatesTags: ["Account", "Dashboard", "Transaction"],
    }),

    // CUSTOMER: Withdrawal Request
    requestWithdrawal: builder.mutation<
      DepositWithdrawResponse,
      DepositWithdrawRequest & { idempotencyKey: string }
    >({
      query: ({ idempotencyKey, ...body }) => ({
        url: "/customer/deposit-withdraw/withdrawal",
        method: "POST",
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
        body,
      }),
      invalidatesTags: ["Account", "Dashboard", "Transaction"],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetMyAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountStatusMutation,
  useTransferFundsMutation,
  useRequestDepositMutation,
  useRequestWithdrawalMutation,
} = accountApi;
