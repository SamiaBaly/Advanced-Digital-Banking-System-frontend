
import { baseApi } from "./baseApi";

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  userStatus: "pending" | "active" | "inactive" | "blocked";
  isIdentityVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface CustomerListResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CustomerListParams {
  page: number;
  limit: number;
  search: string;
  status: string;
}

interface CustomerStatusResponse {
  success: boolean;
  message: string;
  data: Customer;
}

interface ApproveCustomerResponse {
  success: boolean;
  message: string;
  data: {
    customer: Customer;
    account: {
      _id: string;
      accountNumber: string;
      accountType: string;
      balancePaisa: number;
      currency: string;
      accountStatus: string;
      isPrimary: boolean;
    };
  };
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      CustomerListResponse["data"],
      CustomerListParams
    >({
      query: ({ page, limit, search, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search,
          status,
        });

        return `/admin/customers?${params.toString()}`;
      },
      transformResponse: (response: CustomerListResponse) => response.data,
      providesTags: ["Dashboard"],
    }),

    updateCustomerStatus: builder.mutation<
      CustomerStatusResponse,
      { id: string; userStatus: "active" | "inactive" | "blocked" }
    >({
      query: ({ id, userStatus }) => ({
        url: `/admin/customers/${id}/status`,
        method: "PATCH",
        body: { userStatus },
      }),
      invalidatesTags: ["Dashboard", "Account"],
    }),

    approveCustomer: builder.mutation<
      ApproveCustomerResponse,
      string
    >({
      query: (id) => ({
        url: `/admin/customers/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Dashboard", "Account"],
    }),

    rejectCustomer: builder.mutation<
      CustomerStatusResponse,
      string
    >({
      query: (id) => ({
        url: `/admin/customers/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Dashboard", "Account"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
  useApproveCustomerMutation,
  useRejectCustomerMutation,
} = customerApi;
