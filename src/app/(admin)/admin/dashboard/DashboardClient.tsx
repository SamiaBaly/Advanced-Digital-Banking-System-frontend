
"use client";

import { useTheme } from "next-themes";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
  type RecentTransaction,
} from "@/redux/api/dashboardApi";


import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  Activity,
  Building2,
  ChartNoAxesCombined,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Clock3,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

const overviewItems = [
  {
    label: "Customer Management",
    description: "Manage customer profiles and accounts.",
    icon: Users,
  },
  {
    label: "Account Management",
    description: "Monitor and manage banking accounts.",
    icon: Wallet,
  },
  {
    label: "Transaction Management",
    description: "Review and monitor transactions.",
    icon: ArrowLeftRight,
  },
  {
    label: "Loan Management",
    description: "Manage loan applications and records.",
    icon: CreditCard,
  },
  {
    label: "Staff Management",
    description: "Manage banking staff and permissions.",
    icon: Building2,
  },
  {
    label: "Reports & Analytics",
    description: "View banking reports and performance.",
    icon: ChartNoAxesCombined,
  },
];

export default function DashboardClient() {
  const user = useAppSelector((state) => state.auth.user);

  const { theme, setTheme } = useTheme();

  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
  } = useGetDashboardStatsQuery(undefined, {
    skip: !user || user.role !== "admin",
  });
  const {
    data: recentActivities,
    isLoading: isRecentActivityLoading,
    isError: isRecentActivityError,
  } = useGetRecentActivityQuery(undefined, {
    skip: !user || user.role !== "admin",
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const adminName = user?.fullName || "Administrator";
  const firstName = adminName.trim().split(" ")[0];

  const initials =
    adminName
      .split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD";

  const formatNumber = (value: number) =>
    value.toLocaleString("en-BD");

  const formatBDT = (paisa: number) =>
    `৳${(paisa / 100).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const formatTransactionDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionType = (type: RecentTransaction["type"]) => {
    const labels: Record<RecentTransaction["type"], string> = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      fund_transfer: "Fund Transfer",
      loan_disbursement: "Loan Disbursement",
      loan_repayment: "Loan Repayment",
    };

    return labels[type];
  };

  const getTransactionStatusStyle = (
    status: RecentTransaction["status"]
  ) => {
    const styles: Record<RecentTransaction["status"], string> = {
      completed:
        "bg-[#16A34A]/10 text-[#16A34A]",
      pending:
        "bg-[#F59E0B]/10 text-[#D97706]",
      failed:
        "bg-[#DC2626]/10 text-[#DC2626]",
      reversed:
        "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
    };

    return styles[status];
  };

  const getStatValue = (value: number) => {
    if (isLoading) return "...";
    if (isError) return "—";

    return formatNumber(value);
  };

  const stats = [
    {
      title: "Total Customers",
      value: getStatValue(dashboardData?.customers.total ?? 0),
      description: isError
        ? "Unable to load customer data"
        : `${formatNumber(dashboardData?.customers.active ?? 0)} active customers`,
      icon: Users,
      accent: "from-[#176B87] to-[#14B8A6]",
      iconBg: "bg-[#176B87]/10",
      iconColor: "text-[#176B87] dark:text-[#14B8A6]",
    },
    {
      title: "Total Accounts",
      value: getStatValue(dashboardData?.accounts.total ?? 0),
      description: isError
        ? "Unable to load account data"
        : `${formatNumber(dashboardData?.accounts.active ?? 0)} active accounts`,
      icon: Wallet,
      accent: "from-[#14B8A6] to-[#0D9488]",
      iconBg: "bg-[#14B8A6]/10",
      iconColor: "text-[#14B8A6]",
    },
    {
      title: "Transactions",
      value: getStatValue(dashboardData?.transactions.total ?? 0),
      description: isError
        ? "Unable to load transaction data"
        : `${formatNumber(dashboardData?.transactions.completed ?? 0)} completed`,
      icon: ArrowLeftRight,
      accent: "from-[#6366F1] to-[#818CF8]",
      iconBg: "bg-[#6366F1]/10",
      iconColor: "text-[#6366F1]",
    },
    {
      title: "Active Loans",
      value: getStatValue(dashboardData?.loans.active ?? 0),
      description: isError
        ? "Unable to load loan data"
        : `${formatNumber(dashboardData?.loans.pending ?? 0)} pending applications`,
      icon: CreditCard,
      accent: "from-[#F59E0B] to-[#FBBF24]",
      iconBg: "bg-[#F59E0B]/10",
      iconColor: "text-[#F59E0B]",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-6 text-[#172B4D] dark:bg-[#0B1726] dark:text-[#F4F7FB] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Top Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#176B87] dark:text-[#14B8A6]">
                Digital Banking / Administration
              </p>
            </div>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#102A43] dark:text-white sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and monitor your digital banking platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#14283D] dark:text-slate-300">
              <Search size={19} />
            </div>

            {/* Notifications */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm dark:border-white/10 dark:bg-[#14283D] dark:text-slate-300">
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#14B8A6]" />
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Switch Light / Dark Mode"
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#172B4D] shadow-sm transition hover:border-[#14B8A6]/50 hover:bg-[#F4F7FB] dark:border-white/10 dark:bg-[#14283D] dark:text-white dark:hover:bg-[#102A43]"
            >
              {theme === "dark" ? (
                <Sun size={19} className="text-[#F59E0B]" />
              ) : (
                <Moon
                  size={19}
                  className="text-[#176B87] dark:text-[#14B8A6]"
                />
              )}
            </button>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-4 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-sm font-bold text-white">
                {initials}
              </div>

              <div className="hidden sm:block">
                <p className="max-w-32 truncate text-xs font-bold text-[#102A43] dark:text-white">
                  {adminName}
                </p>

                <p className="text-[10px] font-medium capitalize text-slate-500 dark:text-slate-400">
                  {user?.role?.replace("_", " ") || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#102A43] via-[#176B87] to-[#0D9488] p-6 shadow-xl shadow-[#102A43]/10 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[35px] border-white/5" />

          <div className="pointer-events-none absolute -bottom-36 right-1/4 -z-10 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                <Sparkles size={14} />
                Your Banking Control Center
              </div>

              <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {firstName}!
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                Here your administration workspace. Monitor platform
                activity, manage banking operations and keep everything
                organized from one place.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                  <ShieldCheck size={17} className="text-[#5EEAD4]" />
                  Administrator Access
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                  <Activity size={17} className="text-[#5EEAD4]" />
                  Management Workspace
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center lg:flex">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-3 rounded-full border border-dashed border-white/30" />

                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-white/25 to-white/5 shadow-inner">
                  <Building2
                    size={58}
                    className="text-white"
                    strokeWidth={1.3}
                  />
                </div>

                <div className="absolute -right-2 top-5 rounded-xl border border-white/20 bg-[#14B8A6] p-3 text-white shadow-lg">
                  <ShieldCheck size={22} />
                </div>

                <div className="absolute -bottom-2 left-1 rounded-xl border border-white/20 bg-white p-3 text-[#176B87] shadow-lg">
                  <ChartNoAxesCombined size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#176B87] dark:text-[#14B8A6]">
                Platform Statistics
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#102A43] dark:text-white">
                Banking Overview
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isLoading
                  ? "Loading live statistics..."
                  : isError
                    ? "Unable to load statistics"
                    : "Live database statistics"}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                disabled={isLoading}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#176B87] transition hover:bg-[#F4F7FB] disabled:opacity-50 dark:border-white/10 dark:bg-[#14283D] dark:text-[#14B8A6]"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#102A43]/5 dark:border-white/10 dark:bg-[#14283D] dark:hover:shadow-black/20"
                >
                  <div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.accent}`}
                  />

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {stat.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#102A43] dark:text-white">
                        {stat.value}
                      </h3>
                    </div>

                    <div
                      className={`rounded-xl p-3 ${stat.iconBg} ${stat.iconColor} transition duration-300 group-hover:scale-110`}
                    >
                      <Icon size={23} strokeWidth={1.8} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {stat.description}
                    </p>

                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 transition group-hover:text-[#14B8A6]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Balance */}
          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Customer Account Balance
                </p>

                <h3 className="mt-2 text-2xl font-extrabold text-[#102A43] dark:text-white">
                  {isLoading
                    ? "Loading..."
                    : isError
                      ? "Unavailable"
                      : formatBDT(
                        dashboardData?.accounts.totalBalancePaisa ?? 0
                      )}
                </h3>
              </div>

              <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
                <Wallet size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Content */}
        <section className="grid gap-6 xl:grid-cols-3">

          {/* Analytics */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:p-6 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-[#14B8A6]/10 p-2 text-[#14B8A6]">
                    <TrendingUp size={19} />
                  </div>

                  <h2 className="font-bold text-[#102A43] dark:text-white">
                    Transaction Analytics
                  </h2>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Transaction performance and banking activity
                </p>
              </div>

              <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                Overview
              </span>
            </div>

            <div className="mt-7 flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-[#F4F7FB]/70 px-5 text-center dark:border-white/10 dark:bg-[#0B1726]/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6]">
                <ChartNoAxesCombined size={31} strokeWidth={1.6} />
              </div>

              <h3 className="mt-4 font-bold text-[#102A43] dark:text-white">
                Analytics Coming Soon
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500 dark:text-slate-400">
                Transaction charts, deposit trends and banking performance
                analytics will appear here after backend integration.
              </p>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#176B87]/10 p-2 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                <ShieldCheck size={19} />
              </div>

              <h2 className="font-bold text-[#102A43] dark:text-white">
                Admin Information
              </h2>
            </div>

            <div className="mt-6 flex flex-col items-center rounded-2xl bg-gradient-to-br from-[#F4F7FB] to-white p-5 dark:from-[#0B1726] dark:to-[#102A43]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-xl font-extrabold text-white shadow-lg shadow-[#176B87]/20">
                {initials}
              </div>

              <h3 className="mt-3 max-w-full truncate text-base font-bold text-[#102A43] dark:text-white">
                {adminName}
              </h3>

              <p className="mt-1 max-w-full break-all text-center text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "Email unavailable"}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#14B8A6]/10 px-3 py-1.5 text-[11px] font-bold capitalize text-[#0D9488] dark:text-[#5EEAD4]">
                <ShieldCheck size={13} />
                {user?.role?.replace("_", " ") || "Admin"}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Account status
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                  {user?.userStatus || "Active"}
                </span>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/10" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Access level
                </span>

                <span className="text-xs font-semibold capitalize text-[#176B87] dark:text-[#14B8A6]">
                  {user?.role?.replace("_", " ") || "Administrator"}
                </span>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/10" />

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  User ID
                </span>

                <span className="max-w-32 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                  {user?.id || "Not available"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Management Modules */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#176B87] dark:text-[#14B8A6]">
                Administration
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#102A43] dark:text-white">
                Banking Management Modules
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Overview of the main management areas.
              </p>
            </div>

            <Building2 size={25} className="text-[#14B8A6]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {overviewItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#F4F7FB]/70 p-4 transition hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 dark:border-white/10 dark:bg-[#0B1726]/40 dark:hover:bg-[#14B8A6]/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#176B87]/10 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                    <Icon size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#102A43] dark:text-white">
                      {item.label}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={17}
                    className="shrink-0 text-slate-300 dark:text-slate-500"
                  />
                </div>
              );
            })}
          </div>
        </section>


        {/* Recent Activity */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[#102A43] dark:text-white">
                Recent Banking Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest activities across the platform
              </p>
            </div>

            <div className="rounded-lg bg-[#176B87]/10 p-2 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
              <Clock3 size={19} />
            </div>
          </div>

          <div className="mt-5">
            {isRecentActivityLoading ? (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                <Activity size={25} className="animate-pulse text-[#14B8A6]" />

                <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Loading recent activities...
                </p>
              </div>
            ) : isRecentActivityError ? (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-[#DC2626]/30">
                <Activity size={25} className="text-[#DC2626]" />

                <p className="mt-3 text-sm font-semibold text-[#DC2626]">
                  Unable to load recent activities
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please try again later.
                </p>
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-[#F4F7FB]/70 p-4 transition hover:border-[#14B8A6]/40 dark:border-white/10 dark:bg-[#0B1726]/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#14B8A6]">
                        <ArrowLeftRight size={20} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#102A43] dark:text-white">
                          {getTransactionType(transaction.type)}
                        </h3>

                        <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                          {transaction.transactionId}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                          {formatTransactionDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="text-sm font-extrabold text-[#102A43] dark:text-white">
                        {formatBDT(transaction.amountPaisa)}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold capitalize ${getTransactionStatusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                  <Activity size={23} />
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  No recent activities
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Recent banking activities will appear here.
                </p>
              </div>
            )}
          </div>
        </section>


        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 py-5 text-center dark:border-white/10 sm:flex-row sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 Digital Bank. Administration Workspace.
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} className="text-[#14B8A6]" />
            Secure Banking Management
          </div>
        </footer>

      </div>
    </main>
  );
}
