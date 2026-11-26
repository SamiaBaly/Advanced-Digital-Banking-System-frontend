
"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Landmark,
  Moon,
  Sun,
  RefreshCw,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  useGetStaffTransactionsQuery,
  useReviewStaffTransactionMutation,
  type StaffTransaction,
} from "@/redux/api/staffTransactionApi";

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
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function RequestsClient() {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const { resolvedTheme, setTheme } = useTheme();

  const [page, setPage] = useState(1);
  const [type, setType] = useState<"" | "deposit" | "withdrawal">("");
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState<StaffTransaction | null>(null);

  const [reviewAction, setReviewAction] = useState<
    "approve" | "reject" | null
  >(null);

  const [reviewNote, setReviewNote] = useState("");
  const [actionError, setActionError] = useState("");

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetStaffTransactionsQuery({
    page,
    limit: 8,
    type,
    status: status === "all" ? "" : status,
    search: search.trim(),
  });

  const [reviewTransaction, { isLoading: isReviewing }] =
    useReviewStaffTransactionMutation();

  const transactions = response?.data ?? [];
  const pagination = response?.pagination;

  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const totalItems = pagination?.total ?? transactions.length;

  const openReviewModal = (
    transaction: StaffTransaction,
    action: "approve" | "reject"
  ) => {
    setSelectedTransaction(transaction);
    setReviewAction(action);
    setReviewNote("");
    setActionError("");
  };

  const closeReviewModal = () => {
    if (isReviewing) return;

    setSelectedTransaction(null);
    setReviewAction(null);
    setReviewNote("");
    setActionError("");
  };

  const handleReview = async () => {
    if (!selectedTransaction || !reviewAction) return;

    if (reviewAction === "reject" && !reviewNote.trim()) {
      setActionError(
        "Please provide a reason for rejecting this request."
      );
      return;
    }

    setActionError("");

    try {
      await reviewTransaction({
        id: selectedTransaction._id,
        action: reviewAction,
        reviewNote: reviewNote.trim(),
      }).unwrap();

      closeReviewModal();
      refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data
          ? String(error.data.message)
          : "Unable to process this request. Please try again.";

      setActionError(message);
    }
  };

  const changeFilter = (
    callback: (value: string) => void,
    value: string
  ) => {
    callback(value);
    setPage(1);
  };

  const resetFilters = () => {
    setPage(1);
    setType("");
    setStatus("pending");
    setSearch("");
  };

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
              <ShieldCheck size={20} className="text-[#14B8A6]" />
              <span className="text-sm font-semibold">Bank Staff</span>
            </div>
          </div>
        </header>

        {/* Page Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#102A43] to-[#176B87] p-6 text-white shadow-lg sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-teal-200">
              BANKING OPERATIONS
            </p>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Deposit & Withdrawal Requests
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Review customer deposit and withdrawal requests.
              Approve valid requests or reject them with a reason.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium">
              <ShieldCheck size={15} />
              Secure Staff Operations
            </div>
          </div>

          <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-teal-300/10" />
        </section>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Matching Requests",
              value: totalItems,
              icon: FileText,
              color:
                "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
            },
            {
              label: "Current Page",
              value: `${page} / ${totalPages}`,
              icon: Clock,
              color:
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
            },
            {
              label: "Showing Requests",
              value: transactions.length,
              icon: CheckCircle2,
              color:
                "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Manage Requests</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search and filter customer requests
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-[#29445E] dark:bg-[#1B354D] dark:hover:bg-[#23415C]"
            >
              <RefreshCw
                size={15}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search transaction ID or description..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#176B87] focus:ring-2 focus:ring-[#176B87]/10 dark:border-[#29445E] dark:bg-[#0B1726] dark:text-white"
              />
            </div>

            <select
              value={type}
              onChange={(event) =>
                changeFilter(
                  (value) =>
                    setType(value as "" | "deposit" | "withdrawal"),
                  event.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-[#29445E] dark:bg-[#0B1726] dark:text-white"
            >
              <option value="">All Request Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
            </select>

            <select
              value={status}
              onChange={(event) =>
                changeFilter(setStatus, event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-[#29445E] dark:bg-[#0B1726] dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="completed">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All Statuses</option>
            </select>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-[#29445E] dark:text-gray-300 dark:hover:bg-[#1B354D]"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* Requests Table */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
          <div className="border-b border-gray-100 px-5 py-5 dark:border-[#29445E] sm:px-6">
            <h2 className="text-lg font-bold">Customer Requests</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review request details and take action
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-[#1B354D]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <AlertCircle
                size={35}
                className="mx-auto text-red-500"
              />
              <p className="mt-3 font-semibold">
                Failed to load requests
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-[#176B87] px-5 py-2 text-sm font-semibold text-white hover:bg-[#12566D]"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <FileText
                size={40}
                className="mx-auto text-gray-400"
              />
              <h3 className="mt-3 font-semibold">No Requests Found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                No requests match your selected filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-gray-500 dark:border-[#29445E] dark:bg-[#0B1726] dark:text-gray-400">
                    <th className="px-5 py-4 font-semibold">
                      Transaction
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Customer
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Account
                    </th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => {
                    const isDeposit = transaction.type === "deposit";

                    const account = isDeposit
                      ? transaction.receiverAccount
                      : transaction.senderAccount;

                    return (
                      <tr
                        key={transaction._id}
                        className="border-b border-gray-50 last:border-0 dark:border-[#29445E]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {transaction.transactionId}
                          </p>
                          <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500 dark:text-gray-400">
                            {transaction.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold">
                            {transaction.initiatedBy?.fullName || "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {transaction.initiatedBy?.email || "N/A"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">
                            {account?.accountNumber || "N/A"}
                          </p>
                          <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                            {account?.accountType?.replace("_", " ") || "Account"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 font-semibold capitalize ${isDeposit
                                ? "text-green-600 dark:text-green-400"
                                : "text-purple-600 dark:text-purple-400"
                              }`}
                          >
                            {isDeposit ? (
                              <ArrowDownLeft size={16} />
                            ) : (
                              <ArrowUpRight size={16} />
                            )}
                            {transaction.type}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-bold">
                          {formatMoney(transaction.amountPaisa)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                          {mounted
                            ? formatDate(transaction.createdAt)
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          {transaction.status === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openReviewModal(transaction, "approve")
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                              >
                                <CheckCircle2 size={14} />
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openReviewModal(transaction, "reject")
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="block text-right text-xs text-gray-400">
                              Reviewed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination - Always Visible */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 dark:border-[#29445E]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination?.page ?? page} of {totalPages}
              {" · "}
              {totalItems} total requests
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#1B354D]"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages || isFetching}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#1B354D]"
              >
                Next
                <ChevronRight size={16} />
              </button>
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

      {/* Review Modal */}
      {selectedTransaction && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${reviewAction === "approve"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                >
                  {reviewAction === "approve" ? (
                    <CheckCircle2 size={23} />
                  ) : (
                    <XCircle size={23} />
                  )}
                </div>

                <h2 className="text-xl font-bold">
                  {reviewAction === "approve"
                    ? "Approve Request"
                    : "Reject Request"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Confirm your decision for this transaction.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                disabled={isReviewing}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-[#1B354D]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4 dark:bg-[#0B1726]">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Transaction ID
                </span>
                <span className="text-right font-semibold">
                  {selectedTransaction.transactionId}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Request Type
                </span>
                <span className="font-semibold capitalize">
                  {selectedTransaction.type}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Amount
                </span>
                <span className="font-bold text-[#176B87] dark:text-teal-400">
                  {formatMoney(selectedTransaction.amountPaisa)}
                </span>
              </div>
            </div>

            {reviewAction === "reject" && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={reviewNote}
                  onChange={(event) => setReviewNote(event.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Explain why this request is being rejected..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#176B87] dark:border-[#29445E] dark:bg-[#0B1726] dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {reviewNote.length}/500
                </p>
              </div>
            )}

            {reviewAction === "approve" && (
              <p className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">
                This action will approve the request and update the customer&apos;s account balance.
              </p>
            )}

            {actionError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {actionError}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50 dark:border-[#29445E] dark:hover:bg-[#1B354D]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReview}
                disabled={
                  isReviewing ||
                  (reviewAction === "reject" && !reviewNote.trim())
                }
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {isReviewing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : reviewAction === "approve" ? (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm Approval
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
