
"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Wallet,
} from "lucide-react";

import { useGetMyTransactionsQuery } from "@/redux/api/transactionApi";

const formatAmount = (amountPaisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(amountPaisa / 100);

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const transactionTypes = [
  { value: "", label: "All Types" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "fund_transfer", label: "Fund Transfer" },
  { value: "loan_disbursement", label: "Loan Disbursement" },
  { value: "loan_repayment", label: "Loan Repayment" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "reversed", label: "Reversed" },
];

export default function CustomerTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMyTransactionsQuery({
    page,
    limit: 10,
    search,
    status,
    type,
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  const getTypeDetails = (transactionType: string) => {
    switch (transactionType) {
      case "deposit":
        return {
          label: "Deposit",
          icon: ArrowDownLeft,
          color: "text-green-600 bg-green-100 dark:bg-green-500/10",
        };
      case "withdrawal":
        return {
          label: "Withdrawal",
          icon: ArrowUpRight,
          color: "text-red-600 bg-red-100 dark:bg-red-500/10",
        };
      case "fund_transfer":
        return {
          label: "Fund Transfer",
          icon: ArrowLeftRight,
          color: "text-blue-600 bg-blue-100 dark:bg-blue-500/10",
        };
      case "loan_disbursement":
        return {
          label: "Loan Disbursement",
          icon: Wallet,
          color: "text-teal-600 bg-teal-100 dark:bg-teal-500/10",
        };
      case "loan_repayment":
        return {
          label: "Loan Repayment",
          icon: Wallet,
          color: "text-orange-600 bg-orange-100 dark:bg-orange-500/10",
        };
      default:
        return {
          label: transactionType,
          icon: Wallet,
          color: "text-gray-600 bg-gray-100 dark:bg-gray-500/10",
        };
    }
  };

  const getStatusStyle = (value: string) => {
    switch (value) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "reversed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-6 dark:bg-[#0B1726] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-[#176B87] dark:text-[#14B8A6]">
              CUSTOMER BANKING
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#172B4D] dark:text-white sm:text-3xl">
              Transaction History
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              View and track all transactions from your accounts.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#176B87] transition hover:bg-gray-50 disabled:opacity-50 dark:border-[#29445D] dark:bg-[#14283D] dark:text-[#14B8A6] dark:hover:bg-[#1B354D]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445D] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <ArrowLeftRight size={21} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#172B4D] dark:text-white">
              {pagination?.total ?? 0}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Matching your filters
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445D] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current Page
              </p>
              <div className="rounded-xl bg-teal-100 p-3 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <CalendarDays size={21} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#172B4D] dark:text-white">
              {pagination?.page ?? 1}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Of {pagination?.totalPages ?? 0} pages
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445D] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing Results
              </p>
              <div className="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <Wallet size={21} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#172B4D] dark:text-white">
              {transactions.length}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Transactions on this page
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445D] dark:bg-[#14283D]">
          <div className="mb-4">
            <h2 className="font-bold text-[#172B4D] dark:text-white">
              Find Transactions
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Search by transaction ID or description.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search transaction..."
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] py-3 pl-10 pr-4 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29445D] dark:bg-[#102A43] dark:text-white"
              />
            </div>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-[#F4F7FB] px-3 py-3 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29445D] dark:bg-[#102A43] dark:text-white"
            >
              {transactionTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-[#F4F7FB] px-3 py-3 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29445D] dark:bg-[#102A43] dark:text-white"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-[#176B87] hover:underline dark:text-[#14B8A6]"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#29445D] dark:bg-[#14283D]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[#29445D]">
            <div>
              <h2 className="font-bold text-[#172B4D] dark:text-white">
                All Transactions
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your account activity
              </p>
            </div>
            <span className="rounded-full bg-[#E5F3F6] px-3 py-1 text-xs font-semibold text-[#176B87] dark:bg-[#176B87]/20 dark:text-[#14B8A6]">
              {pagination?.total ?? 0} Records
            </span>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <RefreshCw className="animate-spin text-[#176B87]" size={28} />
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Loading transactions...
              </span>
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-red-500">
                Failed to load transactions.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 rounded-lg bg-[#176B87] px-4 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <div className="rounded-full bg-[#E5F3F6] p-5 text-[#176B87] dark:bg-[#176B87]/20 dark:text-[#14B8A6]">
                <Wallet size={30} />
              </div>
              <h3 className="mt-4 font-bold text-[#172B4D] dark:text-white">
                No Transactions Found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                Your transactions will appear here when account activity is
                available.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-[#F4F7FB] text-xs uppercase text-gray-500 dark:bg-[#102A43] dark:text-gray-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Transaction</th>
                      <th className="px-5 py-4 font-semibold">Type</th>
                      <th className="px-5 py-4 font-semibold">Account</th>
                      <th className="px-5 py-4 font-semibold">Amount</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-[#29445D]">
                    {transactions.map((transaction) => {
                      const details = getTypeDetails(transaction.type);
                      const TypeIcon = details.icon;

                      const account =
                        transaction.senderAccount ??
                        transaction.receiverAccount;

                      return (
                        <tr
                          key={transaction._id}
                          className="transition hover:bg-[#F4F7FB]/70 dark:hover:bg-[#102A43]/60"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#172B4D] dark:text-white">
                              {transaction.transactionId}
                            </p>
                            <p className="mt-1 max-w-48 truncate text-xs text-gray-500 dark:text-gray-400">
                              {transaction.description || "No description"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`rounded-lg p-2 ${details.color}`}>
                                <TypeIcon size={16} />
                              </div>
                              <span className="text-sm font-medium text-[#172B4D] dark:text-gray-200">
                                {details.label}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-[#172B4D] dark:text-gray-200">
                              {account?.accountNumber ?? "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {account?.accountType ?? "Account"}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-[#172B4D] dark:text-white">
                              {formatAmount(transaction.amountPaisa)}
                            </p>
                            {transaction.feePaisa > 0 && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Fee: {formatAmount(transaction.feePaisa)}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(transaction.status)}`}
                            >
                              {transaction.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 dark:border-[#29445D] sm:flex-row">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Page {pagination?.page ?? page} of{" "}
                  {pagination?.totalPages ?? 1} · {pagination?.total ?? 0}{" "}
                  transactions
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page <= 1 || isFetching}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#176B87] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445D] dark:text-[#14B8A6] dark:hover:bg-[#102A43]"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setPage((current) =>
                        Math.min(pagination?.totalPages ?? 1, current + 1)
                      )
                    }
                    disabled={
                      page >= (pagination?.totalPages ?? 1) || isFetching
                    }
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#176B87] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445D] dark:text-[#14B8A6] dark:hover:bg-[#102A43]"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
