
"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Clock,
  CreditCard,
  Wallet,
  ShieldCheck,
  Info,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
} from "lucide-react";

import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  type Notification,
} from "@/redux/api/notificationApi";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const categoryConfig = {
  transaction: {
    label: "Transaction",
    icon: CreditCard,
    color: "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/15",
  },
  deposit: {
    label: "Deposit",
    icon: Wallet,
    color: "text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/15",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: Wallet,
    color: "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-500/15",
  },
  loan: {
    label: "Loan",
    icon: CreditCard,
    color: "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/15",
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    color: "text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-500/15",
  },
  system: {
    label: "System",
    icon: Info,
    color: "text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-500/15",
  },
};

type FilterType = "all" | "unread" | "read";

export default function CustomerNotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  const [actionError, setActionError] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyNotificationsQuery({ page, limit: 10 });

  const [markAsRead, { isLoading: isMarking }] =
    useMarkNotificationAsReadMutation();

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data.notifications ?? [];
  const unreadCount = data?.data.unreadCount ?? 0;
  const pagination = data?.data.pagination;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    setActionError("");

    try {
      await markAsRead(id).unwrap();
    } catch {
      setActionError("Could not update notification. Please try again.");
    }
  };

  const handleMarkAllAsRead = async () => {
    setActionError("");

    try {
      await markAllAsRead().unwrap();
    } catch {
      setActionError("Could not update notifications. Please try again.");
    }
  };

  const getCategory = (category: Notification["category"]) =>
    categoryConfig[category] ?? categoryConfig.system;

  return (
    <div className="min-h-screen space-y-6 bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-white sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-xl bg-[#176B87]/10 p-2 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
              <Bell size={22} />
            </div>
            <span className="text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
              Customer Center
            </span>
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay updated with your banking activities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50 dark:border-[#29445F] dark:bg-[#14283D] dark:hover:bg-[#1B354E]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isMarkingAll}
            className="flex items-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12576F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={16} />
            {isMarkingAll ? "Updating..." : "Mark all read"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Notifications
            </p>
            <Bell className="text-[#176B87] dark:text-[#14B8A6]" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold">
            {pagination?.total ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unread
            </p>
            <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#F59E0B]">
            {unreadCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Read
            </p>
            <CheckCheck className="text-green-600" size={21} />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {Math.max(0, (pagination?.total ?? 0) - unreadCount)}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["all", "unread", "read"] as FilterType[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${filter === item
                  ? "bg-[#102A43] text-white dark:bg-[#14B8A6] dark:text-[#0B1726]"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-[#29445F] dark:bg-[#14283D] dark:text-gray-300"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {filteredNotifications.length} shown on this page
        </p>
      </div>

      {/* Error */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle size={17} />
          {actionError}
        </div>
      )}

      {/* Content */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <RefreshCw className="animate-spin text-[#176B87]" size={30} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading notifications...
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <AlertCircle className="text-red-500" size={35} />
            <p className="font-semibold">Failed to load notifications</p>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-[#176B87] px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
            <div className="mb-4 rounded-2xl bg-gray-100 p-5 dark:bg-[#0B1726]">
              <Inbox size={35} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold">No notifications found</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {filter === "unread"
                ? "You are all caught up. No unread notifications."
                : filter === "read"
                  ? "You don't have any read notifications on this page."
                  : "Your banking updates will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#29445F]">
            {filteredNotifications.map((notification) => {
              const config = getCategory(notification.category);
              const Icon = config.icon;

              return (
                <div
                  key={notification._id}
                  className={`flex flex-col gap-4 p-5 transition hover:bg-gray-50 dark:hover:bg-[#1B354E]/50 sm:flex-row sm:items-start ${!notification.isRead
                      ? "bg-[#176B87]/[0.035] dark:bg-[#14B8A6]/[0.04]"
                      : ""
                    }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{notification.title}</h3>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                      )}

                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                      <Clock size={13} />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>

                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      disabled={isMarking}
                      className="flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-[#176B87]/20 px-3 py-2 text-xs font-semibold text-[#176B87] transition hover:bg-[#176B87]/10 disabled:opacity-50 dark:border-[#14B8A6]/30 dark:text-[#14B8A6] dark:hover:bg-[#14B8A6]/10"
                    >
                      <CheckCheck size={14} />
                      Mark as read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1 || isFetching}
              className="rounded-xl border border-gray-200 bg-white p-2.5 disabled:opacity-40 dark:border-[#29445F] dark:bg-[#14283D]"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(pagination.totalPages, prev + 1)
                )
              }
              disabled={page >= pagination.totalPages || isFetching}
              className="rounded-xl border border-gray-200 bg-white p-2.5 disabled:opacity-40 dark:border-[#29445F] dark:bg-[#14283D]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
