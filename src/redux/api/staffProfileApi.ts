
import { baseApi } from "./baseApi";

export interface StaffProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "bank_staff";
  userStatus: "active" | "inactive" | "blocked" | "pending";
  isIdentityVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfileResponse {
  success: boolean;
  message: string;
  data: StaffProfile;
}

export interface UpdateStaffProfileRequest {
  fullName: string;
  phone: string;
}

export const staffProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffProfile: builder.query<StaffProfileResponse, void>({
      query: () => ({
        url: "/staff/profile",
        method: "GET",
      }),
      providesTags: ["Staff"],
    }),

    updateStaffProfile: builder.mutation<
      StaffProfileResponse,
      UpdateStaffProfileRequest
    >({
      query: (body) => ({
        url: "/staff/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetStaffProfileQuery,
  useUpdateStaffProfileMutation,
} = staffProfileApi;
