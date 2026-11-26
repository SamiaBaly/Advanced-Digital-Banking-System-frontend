
"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Check,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ShieldAlert,
  Settings,
  FileText,
  Clock,
  Inbox,
  AlertCircle,
} from "lucide-react";

import {
  useGetStaffNotificationsQuery,
  useMarkStaffNotificationReadMutation,
  useMarkAllStaffNotificationsReadMutation,
  type StaffNotification,
  type StaffNotificationCategory,
} from "@/redux/api/staffNotificationApi";

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "transaction", label: "Transaction" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "loan", label: "Loan" },
  { value: "security", label: "Security" },
  { value: "system", label: "System" },
];

const readOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function getCategoryStyle(category: StaffNotificationCategory) {
  switch (category) {
    case "transaction":
      return {
        icon: ArrowLeftRight,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-500/10",
        label: "Transaction",
      };

    case "deposit":
      return {
        icon: ArrowDownLeft,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-500/10",
        label: "Deposit",
      };

    case "withdrawal":
      return {
        icon: ArrowUpRight,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-500/10",
        label: "Withdrawal",
      };

    case "loan":
      return {
        icon: Wallet,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-500/10",
        label: "Loan",
      };

    case "security":
      return {
        icon: ShieldAlert,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-100 dark:bg-red-500/10",
        label: "Security",
      };

    default:
      return {
        icon: Settings,
        color: "text-slate-600 dark:text-slate-300",
        bg: "bg-slate-100 dark:bg-slate-700/40",
        label: "System",
      };
  }
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NotificationCard({
  notification,
  onMarkRead,
  isMarking,
}: {
  notification: StaffNotification;
  onMarkRead: (id: string) => void;
  isMarking: boolean;
}) {
  const style = getCategoryStyle(notification.category);
  const Icon = style.icon;

  return (
    <div
      className={`group rounded-2xl border p-4 transition sm:p-5 ${notification.isRead
          ? "border-slate-200 bg-white dark:border-slate-700 dark:bg-[#14283D]"
          : "border-[#176B87]/30 bg-[#176B87]/5 dark:border-[#14B8A6]/30 dark:bg-[#14B8A6]/5"
        }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg}`}
        >
          <Icon className={`h-5 w-5 ${style.color}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#172B4D] dark:text-white sm:text-base">
              {notification.title}
            </h3>

            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
            )}
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {notification.message}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.color}`}
            >
              {style.label}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(notification.createdAt)}
            </span>
          </div>
        </div>

        {!notification.isRead && (
          <button
            type="button"
            onClick={() => onMarkRead(notification._id)}
            disabled={isMarking}
            title="Mark as read"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#176B87]/20 px-2.5 py-2 text-xs font-semibold text-[#176B87] transition hover:bg-[#176B87] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#14B8A6]/30 dark:text-[#14B8A6] dark:hover:bg-[#14B8A6] dark:hover:text-[#102A43]"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Mark read</span>
          </button>
        )}

        {notification.isRead && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Read</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function NotificationsClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [readStatus, setReadStatus] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetStaffNotificationsQuery({
    page,
    limit: 10,
    search,
    category: category as StaffNotificationCategory | "all",
    readStatus: readStatus as "all" | "read" | "unread",
  });

  const [markRead, { isLoading: isMarking }] =
    useMarkStaffNotificationReadMutation();

  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllStaffNotificationsReadMutation();

  const notifications = response?.data ?? [];
  const unreadCount = response?.unreadCount ?? 0;
  const pagination = response?.pagination;

  const totalPages = pagination?.totalPages ?? 1;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleReadStatusChange = (value: string) => {
    setReadStatus(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-6 dark:bg-[#0B1726] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#176B87]/10 dark:bg-[#14B8A6]/10">
                <Bell className="h-6 w-6 text-[#176B87] dark:text-[#14B8A6]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#102A43] dark:text-white sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Stay updated with your banking activities.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-[#14283D] dark:text-slate-200 dark:hover:bg-[#1B354D]"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || isMarkingAll}
              className="flex items-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12566D] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FA895]"
            >
              <CheckCheck className="h-4 w-4" />
              {isMarkingAll ? "Processing..." : "Mark all as read"}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Notifications
              </p>
              <Bell className="h-5 w-5 text-[#176B87] dark:text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#102A43] dark:text-white">
              {pagination?.total ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Unread Notifications
              </p>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-orange-600 dark:text-orange-400">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Read Notifications
              </p>
              <CheckCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.max(0, (pagination?.total ?? 0) - unreadCount)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#14283D]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#176B87] focus:ring-2 focus:ring-[#176B87]/10 dark:border-slate-600 dark:bg-[#0B1726] dark:text-white dark:focus:border-[#14B8A6]"
              />
            </div>

            <select
              value={category}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#0B1726] dark:text-white"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={readStatus}
              onChange={(event) => handleReadStatusChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#0B1726] dark:text-white"
            >
              {readOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notification list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
              Recent Notifications
            </h2>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              {pagination?.total ?? 0} result(s)
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 dark:border-slate-700 dark:bg-[#14283D]">
              <RefreshCw className="h-8 w-8 animate-spin text-[#176B87] dark:text-[#14B8A6]" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Loading notifications...
              </p>
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20">
              <AlertCircle className="mx-auto h-9 w-9 text-red-500" />
              <p className="mt-3 font-semibold text-red-700 dark:text-red-400">
                Failed to load notifications
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-slate-700 dark:bg-[#14283D]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/40">
                <Inbox className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#102A43] dark:text-white">
                No notifications found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                New notifications will appear here when available.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkRead={handleMarkRead}
                isMarking={isMarking}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#14283D] sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isFetching}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-[#1B354D]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || isFetching}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-[#1B354D]"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
