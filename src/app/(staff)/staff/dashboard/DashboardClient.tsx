
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  Moon,
  Sun,
  Landmark,
  ShieldCheck,
  Users,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Bell,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { useTheme } from "next-themes";

import { useAppSelector } from "@/redux/hooks";

import {
  useGetStaffDashboardStatsQuery,
  useGetStaffRecentActivityQuery,
} from "@/redux/api/staffDashboardApi";

// Hydration-safe mounted detection
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const formatMoney = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format((paisa || 0) / 100);

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const statusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "failed":
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function StaffDashboardClient() {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const { resolvedTheme, setTheme } = useTheme();

  const user = useAppSelector((state) => state.auth.user);

  const {
    data: statsResponse,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useGetStaffDashboardStatsQuery();

  const {
    data: activityResponse,
    isLoading: activityLoading,
    isError: activityError,
    refetch: refetchActivity,
  } = useGetStaffRecentActivityQuery();

  const stats = statsResponse?.data;

  // Dashboard-এ সর্বোচ্চ ৫টি activity দেখাবে
  const activities = (activityResponse?.data ?? []).slice(0, 5);

  const totalActivities = activityResponse?.data?.length ?? 0;

  const staffName = mounted
    ? user?.fullName || "Staff Member"
    : "Staff Member";

  const staffEmail = mounted
    ? user?.email || "Not available"
    : "Not available";

  const staffRole = mounted
    ? user?.role?.replace("_", " ") || "Bank Staff"
    : "Bank Staff";

  const staffInitials = mounted
    ? staffName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
    : "SM";

  const refreshDashboard = () => {
    refetchStats();
    refetchActivity();
  };

  const statCards = [
    {
      title: "Total Pending Requests",
      value: stats?.requests?.totalPending ?? 0,
      description: "Requests awaiting review",
      icon: FileText,
      color:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      title: "Pending Deposits",
      value: stats?.requests?.pendingDeposits ?? 0,
      description: "Deposit requests to review",
      icon: ArrowDownLeft,
      color:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      title: "Pending Withdrawals",
      value: stats?.requests?.pendingWithdrawals ?? 0,
      description: "Withdrawal requests to review",
      icon: ArrowUpRight,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      title: "Pending Loans",
      value: stats?.requests?.pendingLoans ?? 0,
      description: "Loan applications to review",
      icon: Wallet,
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
    },
    {
      title: "Unread Notifications",
      value: stats?.notifications?.unread ?? 0,
      description: `${stats?.notifications?.total ?? 0} total notifications`,
      icon: Bell,
      color:
        "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-6 text-[#172B4D] transition-colors dark:bg-[#0B1726] dark:text-[#F4F7FB] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#102A43] text-white">
              <Landmark size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#102A43] dark:text-white">
                Digital Banking
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Staff Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100 dark:border-[#29445E] dark:bg-[#14283D]"
            >
              <Sun
                size={19}
                className="hidden text-[#F59E0B] dark:block"
              />

              <Moon
                size={19}
                className="block text-[#176B87] dark:hidden"
              />
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-[#29445E] dark:bg-[#14283D]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#176B87] text-sm font-bold text-white">
                {staffInitials}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{staffName}</p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Bank Staff
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#102A43] to-[#176B87] p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-teal-200">
              STAFF DASHBOARD
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {staffName}!
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Manage banking requests, monitor pending applications,
              and keep track of recent banking activities.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <ShieldCheck size={15} />
                Secure Staff Portal
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 size={15} />
                Banking Operations
              </span>
            </div>
          </div>

          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-teal-300/10" />
        </section>

        {/* Operations Overview */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Operations Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your current banking operations summary
              </p>
            </div>

            <button
              type="button"
              onClick={refreshDashboard}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-[#29445E] dark:bg-[#14283D] dark:hover:bg-[#1B354D]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {statsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl bg-white dark:bg-[#14283D]"
                />
              ))}
            </div>
          ) : statsError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={18} />
                Failed to load dashboard statistics.
              </div>

              <p className="mt-2">
                Please check your connection and try refreshing.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {card.title}
                        </p>

                        <h3 className="mt-3 text-3xl font-bold">
                          {card.value}
                        </h3>
                      </div>

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                      >
                        <Icon size={23} />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-gray-400">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                Recent Banking Activities
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Latest 5 transaction activities across the bank
              </p>
            </div>

            {totalActivities > 5 && (
              <Link
                href="/staff/transactions"
                className="inline-flex items-center gap-2 rounded-lg bg-[#176B87] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#102A43]"
              >
                View All Transactions
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-[#1B354D]"
                />
              ))}
            </div>
          ) : activityError ? (
            <div className="rounded-xl bg-red-50 p-5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              Failed to load recent activities.
            </div>
          ) : activities.length === 0 ? (
            <div className="py-10 text-center">
              <Clock size={35} className="mx-auto text-gray-400" />

              <h3 className="mt-3 font-semibold">
                No Recent Activities
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Banking activities will appear here when available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 dark:border-[#29445E] dark:text-gray-400">
                    <th className="px-3 py-3 font-semibold">
                      Transaction
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Type
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Amount
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Status
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((activity) => (
                    <tr
                      key={activity._id}
                      className="border-b border-gray-50 last:border-0 dark:border-[#29445E]"
                    >
                      <td className="px-3 py-4">
                        <p className="font-semibold">
                          {activity.transactionId || "N/A"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {activity.description || "Banking transaction"}
                        </p>
                      </td>

                      <td className="px-3 py-4 capitalize">
                        {activity.type}
                      </td>

                      <td className="px-3 py-4 font-semibold">
                        {formatMoney(activity.amountPaisa)}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(activity.status)}`}
                        >
                          {activity.status}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {mounted
                          ? formatDate(activity.createdAt)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Staff Information */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                <Users size={22} />
              </div>

              <div>
                <h2 className="font-bold">
                  Staff Information
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your portal account
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {staffName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-semibold">
                  {staffEmail}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Account Role
                </p>

                <p className="mt-1 text-sm font-semibold capitalize">
                  {staffRole}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="font-bold">
                  Staff Responsibilities
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Banking operations overview
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-green-500" />
                <p className="text-sm">
                  Review pending deposit requests
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-green-500" />
                <p className="text-sm">
                  Review pending withdrawal requests
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-green-500" />
                <p className="text-sm">
                  Review pending loan applications
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="shrink-0 text-green-500" />
                <p className="text-sm">
                  Monitor banking notifications
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-5 text-center dark:border-[#29445E]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2026 Digital Banking System. All rights reserved.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Secure • Reliable • Digital Banking
          </p>
        </footer>
      </div>
    </main>
  );
}
