
import { baseApi } from "./baseApi";

export type NotificationCategory =
  | "transaction"
  | "deposit"
  | "withdrawal"
  | "loan"
  | "security"
  | "system";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  readAt: string | null;
  relatedTransaction?: string | null;
  relatedLoan?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface MarkReadResponse {
  success: boolean;
  message: string;
  data?: Notification;
}

interface MarkAllReadResponse {
  success: boolean;
  message: string;
  data: {
    updatedCount: number;
  };
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query<
      NotificationResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/notifications?page=${page}&limit=${limit}`,
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<
      MarkReadResponse,
      string
    >({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    markAllNotificationsAsRead: builder.mutation<
      MarkAllReadResponse,
      void
    >({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;
