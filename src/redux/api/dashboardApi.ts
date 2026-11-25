
import { baseApi } from "./baseApi";

export interface DashboardStats {
  customers: { total: number; active: number };
  accounts: {
    total: number;
    active: number;
    totalBalancePaisa: number;
  };
  transactions: {
    total: number;
    completed: number;
    pending: number;
  };
  loans: {
    total: number;
    pending: number;
    approved: number;
    active: number;
  };
}

export interface RecentTransaction {
  _id: string;
  transactionId: string;
  type:
  | "deposit"
  | "withdrawal"
  | "fund_transfer"
  | "loan_disbursement"
  | "loan_repayment";
  amountPaisa: number;
  status: "pending" | "completed" | "failed" | "reversed";
  description: string;
  createdAt: string;
}

interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

interface RecentActivityResponse {
  success: boolean;
  message: string;
  data: RecentTransaction[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/admin/dashboard/stats",
      transformResponse: (response: DashboardStatsResponse) =>
        response.data,
      providesTags: ["Dashboard"],
    }),

    getRecentActivity: builder.query<RecentTransaction[], void>({
      query: () => "/admin/dashboard/recent-activity",
      transformResponse: (response: RecentActivityResponse) =>
        response.data,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} = dashboardApi;
