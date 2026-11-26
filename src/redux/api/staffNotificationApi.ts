
import { baseApi } from "./baseApi";

export type StaffNotificationCategory =
  | "transaction"
  | "deposit"
  | "withdrawal"
  | "loan"
  | "security"
  | "system";

export interface StaffNotification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  category: StaffNotificationCategory;
  relatedTransaction?: string | null;
  relatedLoan?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffNotificationPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StaffNotificationsResponse {
  success: boolean;
  message: string;
  data: StaffNotification[];
  unreadCount: number;
  pagination: StaffNotificationPagination;
}

export interface GetStaffNotificationsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: StaffNotificationCategory | "all";
  readStatus?: "all" | "read" | "unread";
}

export interface StaffNotificationActionResponse {
  success: boolean;
  message: string;
  data?: {
    modifiedCount?: number;
  };
}

export const staffNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffNotifications: builder.query<
      StaffNotificationsResponse,
      GetStaffNotificationsParams
    >({
      query: (params) => ({
        url: "/staff/notifications",
        method: "GET",
        params,
      }),
      providesTags: ["Notification"],
    }),

    markStaffNotificationRead: builder.mutation<
      StaffNotificationActionResponse,
      string
    >({
      query: (id) => ({
        url: `/staff/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),

    markAllStaffNotificationsRead: builder.mutation<
      StaffNotificationActionResponse,
      void
    >({
      query: () => ({
        url: "/staff/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification", "Dashboard"],
    }),
  }),
});

export const {
  useGetStaffNotificationsQuery,
  useMarkStaffNotificationReadMutation,
  useMarkAllStaffNotificationsReadMutation,
} = staffNotificationApi;
