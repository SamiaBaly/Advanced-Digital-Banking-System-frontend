
import { baseApi } from "./baseApi";

export interface ReportDateRange {
  startDate: string;
  endDate: string;
}

export interface ReportQueryParams {
  startDate?: string;
  endDate?: string;
}

export interface ReportBreakdown {
  _id: string;
  count: number;
  totalAmountPaisa?: number;
}

export interface MonthlyTransactionReport {
  _id: string;
  count: number;
  totalAmountPaisa: number;
}

export interface ReportsData {
  dateRange: ReportDateRange;

  overview: {
    customers: {
      total: number;
      active: number;
    };
    staff: {
      total: number;
    };
    accounts: {
      total: number;
      active: number;
      totalBalancePaisa: number;
    };
  };

  transactions: {
    total: number;
    pending: number;
    completed: number;
    failed: number;
    reversed: number;
    completedAmountPaisa: number;
    monthly: MonthlyTransactionReport[];
    byType: ReportBreakdown[];
  };

  accounts: {
    byType: ReportBreakdown[];
  };

  loans: {
    total: number;
    byStatus: ReportBreakdown[];
  };

  cards: {
    total: number;
    debit: number;
    credit: number;
    byStatus: ReportBreakdown[];
  };
}

export interface ReportsResponse {
  success: boolean;
  message: string;
  data: ReportsData;
}

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminReports: builder.query<
      ReportsResponse,
      ReportQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/reports",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Report"],
    }),
  }),
});

export const { useGetAdminReportsQuery } = reportApi;
