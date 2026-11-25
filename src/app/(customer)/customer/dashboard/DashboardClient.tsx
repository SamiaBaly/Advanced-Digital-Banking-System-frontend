
"use client";

import {
  Moon,
  Sun,
  Wallet,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Landmark,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAppSelector } from "@/redux/hooks";
import { useGetMyAccountsQuery } from "@/redux/api/accountApi";

const formatMoney = (paisa: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format((paisa || 0) / 100);
};

const getInitials = (name?: string) => {
  if (!name) return "CU";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const statusStyle = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    case "frozen":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case "blocked":
    case "closed":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
  }
};

export default function DashboardClient() {
  const { resolvedTheme, setTheme } = useTheme();

  const user = useAppSelector((state) => state.auth.user);

  const {
    data: accountsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetMyAccountsQuery();

  const accounts = accountsResponse?.data ?? [];

  const primaryAccount =
    accounts.find((account) => account.isPrimary) ?? accounts[0];

  const totalBalance = accounts.reduce(
    (total, account) => total + account.balancePaisa,
    0
  );

  const activeAccounts = accounts.filter(
    (account) => account.accountStatus === "active"
  ).length;

  const customerName = user?.fullName || "Customer";
  const customerEmail = user?.email || "Welcome to your banking dashboard";

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const quickActions = [
    {
      title: "Send Money",
      description: "Transfer funds",
      icon: ArrowUpRight,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      title: "Deposit",
      description: "Add money",
      icon: ArrowDownLeft,
      color:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },
    {
      title: "Withdraw",
      description: "Withdraw cash",
      icon: Wallet,
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
    },
    {
      title: "Apply for Loan",
      description: "Get financial support",
      icon: Landmark,
      color:
        "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
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
                Customer Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100 dark:border-[#29445E] dark:bg-[#14283D] dark:hover:bg-[#1B354D]"
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
                {getInitials(customerName)}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">{customerName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Customer
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#102A43] to-[#176B87] p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-teal-200">
              CUSTOMER DASHBOARD
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {customerName}!
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Manage your accounts, monitor your balance and enjoy secure
              digital banking from one place.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <ShieldCheck size={15} />
                Secure Banking
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
                <CheckCircle2 size={15} />
                Customer Portal
              </span>
            </div>
          </div>

          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-teal-300/10" />
        </section>

        {/* Account Overview */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Account Overview</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your banking summary at a glance
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-[#29445E] dark:bg-[#14283D] dark:hover:bg-[#1B354D]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl bg-white dark:bg-[#14283D]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={18} />
                Failed to load your accounts.
              </div>
              <p className="mt-2">
                Please check your connection and try again.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Total Balance */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Balance
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">
                      {formatMoney(totalBalance)}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-[#14B8A6] dark:bg-teal-500/10">
                    <Wallet size={23} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Across all your accounts
                </p>
              </div>

              {/* Total Accounts */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Accounts
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">
                      {accounts.length}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                    <CreditCard size={23} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Your registered bank accounts
                </p>
              </div>

              {/* Active Accounts */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Active Accounts
                    </p>
                    <h3 className="mt-3 text-2xl font-bold">
                      {activeAccounts}
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle2 size={23} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  Currently active accounts
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Primary Account */}
        {!isLoading && !isError && primaryAccount && (
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Primary Account</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your main banking account
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#102A43] to-[#176B87] p-6 text-white shadow-lg sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-100">Primary Bank Account</p>
                  <h3 className="mt-2 text-xl font-bold capitalize">
                    {primaryAccount.accountType} Account
                  </h3>
                </div>

                <div className="rounded-xl bg-white/15 p-3">
                  <Landmark size={25} />
                </div>
              </div>

              <div className="mt-7">
                <p className="text-xs text-blue-100">Account Number</p>
                <p className="mt-2 text-xl font-semibold tracking-wider">
                  {primaryAccount.accountNumber}
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-blue-100">Available Balance</p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatMoney(primaryAccount.balancePaisa)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${primaryAccount.accountStatus === "active"
                      ? "bg-green-400/20 text-green-100"
                      : "bg-white/20 text-white"
                    }`}
                >
                  {primaryAccount.accountStatus}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Other Accounts */}
        {!isLoading && !isError && accounts.length > 1 && (
          <section>
            <h2 className="mb-4 text-xl font-bold">Other Accounts</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {accounts
                .filter((account) => !account.isPrimary)
                .map((account) => (
                  <div
                    key={account._id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                          <CreditCard size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold capitalize">
                            {account.accountType} Account
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyle(
                          account.accountStatus
                        )}`}
                      >
                        {account.accountStatus}
                      </span>
                    </div>

                    <p className="mt-5 text-xs text-gray-500 dark:text-gray-400">
                      Available Balance
                    </p>
                    <p className="mt-1 text-xl font-bold">
                      {formatMoney(account.balancePaisa)}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* No Account */}
        {!isLoading && !isError && accounts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-[#29445E] dark:bg-[#14283D]">
            <Landmark size={35} className="mx-auto text-gray-400" />
            <h3 className="mt-3 font-semibold">No Bank Account Found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your bank account has not been created yet.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Access your banking services quickly
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <div
                  key={action.title}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                  >
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold sm:text-base">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                    Coming Soon
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Keep track of your latest banking activities
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
              Coming Soon
            </span>
          </div>

          <div className="py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
              <Clock size={25} />
            </div>

            <h3 className="mt-4 font-semibold">No Transactions Yet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your recent transaction history will appear here.
            </p>
          </div>
        </section>

        {/* Customer Information & Security */}
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                <User size={22} />
              </div>

              <div>
                <h2 className="font-bold">Customer Information</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your profile details
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Name
                </p>
                <p className="mt-1 text-sm font-semibold">{customerName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="mt-1 break-all text-sm font-semibold">
                  {customerEmail}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Account Role
                </p>
                <p className="mt-1 text-sm font-semibold capitalize">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="font-bold">Banking Security</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your account protection
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-green-500"
                />
                <p className="text-sm">Secure authentication enabled</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-green-500"
                />
                <p className="text-sm">Protected customer account</p>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-green-500"
                />
                <p className="text-sm">Banking data protection</p>
              </div>
            </div>
          </section>
        </div>

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
