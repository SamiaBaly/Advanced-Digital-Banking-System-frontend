
import { baseApi } from "./baseApi";

export interface StaffDashboardStats {
  requests: {
    pendingDeposits: number;
    pendingWithdrawals: number;
    pendingLoans: number;
    totalPending: number;
  };
  notifications: {
    total: number;
    unread: number;
  };
}

export interface StaffRecentActivity {
  _id: string;
  transactionId: string;
  type: string;
  amountPaisa: number;
  status: string;
  description?: string;
  createdAt: string;
}

interface StaffStatsResponse {
  success: boolean;
  message: string;
  data: StaffDashboardStats;
}

interface StaffActivityResponse {
  success: boolean;
  message: string;
  data: StaffRecentActivity[];
}

export const staffDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffDashboardStats: builder.query<
      StaffStatsResponse,
      void
    >({
      query: () => "/staff/dashboard/stats",
      providesTags: ["Dashboard"],
    }),

    getStaffRecentActivity: builder.query<
      StaffActivityResponse,
      void
    >({
      query: () => "/staff/dashboard/recent-activity",
      providesTags: ["Transaction"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStaffDashboardStatsQuery,
  useGetStaffRecentActivityQuery,
} = staffDashboardApi;
