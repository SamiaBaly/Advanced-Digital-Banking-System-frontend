
"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  RefreshCw,
  CalendarDays,
  TrendingUp,
  FileText,
} from "lucide-react";

import { useGetAdminReportsQuery } from "@/redux/api/reportApi";

const formatMoney = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format((paisa || 0) / 100);

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-BD").format(value || 0);

export default function ReportsClient() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminReportsQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const report = data?.data;

  const overviewCards = [
    {
      title: "Total Customers",
      value: formatNumber(report?.overview.customers.total ?? 0),
      subtitle: `${formatNumber(report?.overview.customers.active ?? 0)} active`,
      icon: Users,
      color: "text-[#176B87] bg-[#176B87]/10",
    },
    {
      title: "Total Staff",
      value: formatNumber(report?.overview.staff.total ?? 0),
      subtitle: "Bank staff members",
      icon: Users,
      color: "text-[#14B8A6] bg-[#14B8A6]/10",
    },
    {
      title: "Total Accounts",
      value: formatNumber(report?.overview.accounts.total ?? 0),
      subtitle: `${formatNumber(report?.overview.accounts.active ?? 0)} active`,
      icon: Wallet,
      color: "text-[#16A34A] bg-[#16A34A]/10",
    },
    {
      title: "Total Bank Balance",
      value: formatMoney(report?.overview.accounts.totalBalancePaisa ?? 0),
      subtitle: "Current account balances",
      icon: Landmark,
      color: "text-[#F59E0B] bg-[#F59E0B]/10",
    },
  ];

  const transactionCards = [
    { title: "Total", value: report?.transactions.total ?? 0, color: "text-[#176B87]" },
    { title: "Completed", value: report?.transactions.completed ?? 0, color: "text-[#16A34A]" },
    { title: "Pending", value: report?.transactions.pending ?? 0, color: "text-[#F59E0B]" },
    { title: "Failed", value: report?.transactions.failed ?? 0, color: "text-[#DC2626]" },
    { title: "Reversed", value: report?.transactions.reversed ?? 0, color: "text-[#64748B]" },
  ];

  const monthly = report?.transactions.monthly ?? [];

  const maxMonthly = Math.max(
    ...monthly.map((item) => item.count),
    1
  );

  const sectionClass =
    "rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#29435B] dark:bg-[#14283D]";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] dark:bg-[#0B1726]">
        <RefreshCw className="animate-spin text-[#14B8A6]" size={30} />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-[#14283D]">
            <p className="font-semibold text-[#DC2626]">
              Failed to load reports.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#176B87] px-5 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 text-[#172B4D] dark:text-[#F4F7FB]">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
              <BarChart3 size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
                Reports & Analytics
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Banking performance and business insights
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Date Filter */}
        <section className={sectionClass}>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={19} className="text-[#14B8A6]" />
            <h2 className="font-bold">Report Date Range</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm outline-none focus:border-[#14B8A6] dark:border-[#29435B] dark:bg-[#102A43]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm outline-none focus:border-[#14B8A6] dark:border-[#29435B] dark:bg-[#102A43]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 dark:border-[#29435B] dark:hover:bg-[#102A43]"
              >
                Clear Date Filter
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Transaction, loan and card reports use the selected date range.
            Customer, staff and account overview shows current totals.
          </p>
        </section>

        {/* Banking Overview */}
        <section>
          <h2 className="mb-4 text-lg font-bold">Banking Overview</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className={sectionClass}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {card.title}
                      </p>
                      <h3 className="mt-2 break-words text-2xl font-bold">
                        {card.value}
                      </h3>
                    </div>

                    <div className={`shrink-0 rounded-xl p-3 ${card.color}`}>
                      <Icon size={23} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transaction Reports */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:text-[#14B8A6]">
              <ArrowLeftRight size={22} />
            </div>

            <div>
              <h2 className="font-bold">Transaction Reports</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction status summary for selected dates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {transactionCards.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.title}
                </p>
                <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                  {formatNumber(item.value)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Completed Transaction Amount
            </p>
            <p className="mt-1 text-2xl font-bold text-[#16A34A]">
              {formatMoney(report.transactions.completedAmountPaisa)}
            </p>
          </div>
        </section>

        {/* Monthly Transaction Trends */}
        <section className={sectionClass}>
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp size={22} className="text-[#14B8A6]" />
            <div>
              <h2 className="font-bold">Monthly Transaction Trends</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of transactions per month
              </p>
            </div>
          </div>

          {monthly.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No transaction data available for this period.
            </p>
          ) : (
            <div className="space-y-5">
              {monthly.map((item) => (
                <div key={item._id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">{item._id}</span>
                    <span className="font-semibold">
                      {formatNumber(item.count)} transactions
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-[#102A43]">
                    <div
                      className="h-full rounded-full bg-[#14B8A6] transition-all"
                      style={{
                        width: `${(item.count / maxMonthly) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Account Breakdown */}
        <section className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <Wallet size={22} className="text-[#176B87] dark:text-[#14B8A6]" />
            <h2 className="font-bold">Account Type Breakdown</h2>
          </div>

          {report.accounts.byType.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No account data available.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {report.accounts.byType.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]"
                >
                  <p className="text-sm capitalize text-slate-500 dark:text-slate-400">
                    {item._id} Account
                  </p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatNumber(item.count)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Loans & Cards */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Loan Reports */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-3">
              <FileText size={22} className="text-[#F59E0B]" />
              <h2 className="font-bold">Loan Reports</h2>
            </div>

            <div className="mb-4 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Loans in Selected Period
              </p>
              <p className="mt-1 text-2xl font-bold">
                {formatNumber(report.loans.total)}
              </p>
            </div>

            <div className="space-y-3">
              {report.loans.byStatus.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  No loan data available.
                </p>
              ) : (
                report.loans.byStatus.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#102A43]"
                  >
                    <span className="text-sm font-medium capitalize">
                      {item._id.replace("_", " ")}
                    </span>
                    <span className="font-bold">
                      {formatNumber(item.count)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Card Reports */}
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-3">
              <CreditCard size={22} className="text-[#14B8A6]" />
              <h2 className="font-bold">Card Reports</h2>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { title: "Total", value: report.cards.total },
                { title: "Debit", value: report.cards.debit },
                { title: "Credit", value: report.cards.credit },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-[#F4F7FB] p-3 text-center dark:bg-[#102A43]"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xl font-bold">
                    {formatNumber(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {report.cards.byStatus.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">
                  No card data available.
                </p>
              ) : (
                report.cards.byStatus.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#102A43]"
                  >
                    <span className="text-sm font-medium capitalize">
                      {item._id}
                    </span>
                    <span className="font-bold">
                      {formatNumber(item.count)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
