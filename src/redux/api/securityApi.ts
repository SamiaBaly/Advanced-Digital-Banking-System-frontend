
import { baseApi } from "./baseApi";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification", "Auth"],
    }),
  }),
});

export const {
  useChangePasswordMutation,
} = securityApi;
