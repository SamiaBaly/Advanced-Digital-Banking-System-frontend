
import { baseApi } from "./baseApi";

export type StaffStatus = "active" | "inactive" | "blocked";

export interface StaffMember {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "bank_staff";
  userStatus: StaffStatus;
  isIdentityVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffResponse {
  success: boolean;
  data: StaffMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StaffQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateStaffRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateStaffStatusRequest {
  id: string;
  userStatus: StaffStatus;
}

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<StaffResponse, StaffQueryParams>({
      query: (params) => ({
        url: "/admin/staff",
        method: "GET",
        params,
      }),
      providesTags: ["Staff"],
    }),

    getStaffById: builder.query<
      { success: boolean; data: StaffMember },
      string
    >({
      query: (id) => `/admin/staff/${id}`,
      providesTags: ["Staff"],
    }),

    createStaff: builder.mutation<
      { success: boolean; message: string; data: StaffMember },
      CreateStaffRequest
    >({
      query: (body) => ({
        url: "/admin/staff",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff", "Dashboard"],
    }),

    updateStaffStatus: builder.mutation<
      { success: boolean; message: string; data: StaffMember },
      UpdateStaffStatusRequest
    >({
      query: ({ id, userStatus }) => ({
        url: `/admin/staff/${id}/status`,
        method: "PATCH",
        body: { userStatus },
      }),
      invalidatesTags: ["Staff", "Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useCreateStaffMutation,
  useUpdateStaffStatusMutation,
} = staffApi;
