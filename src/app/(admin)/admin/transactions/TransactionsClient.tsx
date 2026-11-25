
"use client";

import { useState } from "react";
import {
  Search,
  ArrowLeftRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  X,
  ClipboardCheck,
} from "lucide-react";
import {
  useGetTransactionsQuery,
  useApproveTransactionMutation,
  useRejectTransactionMutation,
  type Transaction,
} from "@/redux/api/transactionApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(paisa / 100);

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  reversed: "bg-gray-200 text-gray-700",
  rejected: "bg-red-100 text-red-700",
};

const typeLabels: Record<string, string> = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  fund_transfer: "Fund Transfer",
  loan_disbursement: "Loan Disbursement",
  loan_repayment: "Loan Repayment",
};

export default function TransactionsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [reviewAction, setReviewAction] =
    useState<"approve" | "reject" | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTransactionsQuery({
    page,
    limit: 10,
    search,
    status,
    type,
  });

  const [approveTransaction, { isLoading: isApproving }] =
    useApproveTransactionMutation();

  const [rejectTransaction, { isLoading: isRejecting }] =
    useRejectTransactionMutation();

  const isReviewing = isApproving || isRejecting;

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  const openReviewModal = (
    transaction: Transaction,
    action: "approve" | "reject"
  ) => {
    setSelectedTransaction(transaction);
    setReviewAction(action);
    setReviewNote("");
    setActionMessage("");
    setActionError("");
  };

  const closeReviewModal = () => {
    if (isReviewing) return;

    setSelectedTransaction(null);
    setReviewAction(null);
    setReviewNote("");
  };

  const handleReview = async () => {
    if (!selectedTransaction || !reviewAction || isReviewing) {
      return;
    }

    setActionError("");
    setActionMessage("");

    try {
      const request = {
        id: selectedTransaction._id,
        reviewNote: reviewNote.trim(),
      };

      if (reviewAction === "approve") {
        await approveTransaction(request).unwrap();
        setActionMessage("Request approved successfully.");
      } else {
        await rejectTransaction(request).unwrap();
        setActionMessage("Request rejected successfully.");
      }

      setSelectedTransaction(null);
      setReviewAction(null);
      setReviewNote("");
      setPage((current) => current);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Failed to review this request. Please try again.";

      setActionError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 dark:bg-[#0B1726]">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#172B4D] dark:text-[#F4F7FB]">
              Transaction Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor transactions and review deposit and withdrawal requests.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#102A43] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Action Messages */}
        {actionMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle size={18} />
            {actionMessage}
            <button
              onClick={() => setActionMessage("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {actionError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
            <XCircle size={18} />
            {actionError}
            <button
              onClick={() => setActionError("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Transactions
              </p>
              <ArrowLeftRight className="text-[#176B87]" size={21} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-[#102A43] dark:text-white">
              {pagination?.total ?? 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completed on This Page
              </p>
              <ShieldCheck className="text-green-600" size={21} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.status === "completed").length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pending on This Page
              </p>
              <ArrowLeftRight className="text-amber-500" size={21} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-amber-500">
              {transactions.filter((t) => t.status === "pending").length}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#29435C] dark:bg-[#14283D]">

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-5 md:flex-row dark:border-[#29435C]">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search transaction ID or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
              />
            </div>

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Transaction Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="fund_transfer">Fund Transfer</option>
              <option value="loan_disbursement">Loan Disbursement</option>
              <option value="loan_repayment">Loan Repayment</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="reversed">Reversed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          {isLoading ? (
            <p className="py-16 text-center text-gray-500">
              Loading transactions...
            </p>
          ) : error ? (
            <p className="py-16 text-center text-red-500">
              Failed to load transactions. Please check the API connection.
            </p>
          ) : (
            <>
              {isFetching && (
                <p className="px-5 pt-3 text-xs text-[#176B87]">
                  Updating transaction list...
                </p>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1250px] text-left text-sm">
                  <thead className="bg-[#F4F7FB] dark:bg-[#102A43]">
                    <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-[#29435C] dark:text-gray-400">
                      <th className="px-5 py-4">Transaction ID</th>
                      <th className="px-5 py-4">Type</th>
                      <th className="px-5 py-4">Initiated By</th>
                      <th className="px-5 py-4">Accounts</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Fee</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction: Transaction) => (
                      <tr
                        key={transaction._id}
                        className="border-b border-gray-100 transition hover:bg-gray-50 last:border-0 dark:border-[#29435C] dark:hover:bg-[#102A43]"
                      >
                        <td className="px-5 py-4 font-semibold text-[#176B87]">
                          {transaction.transactionId}
                        </td>

                        <td className="px-5 py-4 text-gray-700 dark:text-gray-300">
                          {typeLabels[transaction.type] ?? transaction.type}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-[#172B4D] dark:text-white">
                            {transaction.initiatedBy?.fullName ?? "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.initiatedBy?.email ?? "N/A"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                          <p>
                            From:{" "}
                            {transaction.senderAccount?.accountNumber ?? "N/A"}
                          </p>
                          <p className="mt-1">
                            To:{" "}
                            {transaction.receiverAccount?.accountNumber ?? "N/A"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-semibold text-[#172B4D] dark:text-white">
                          {formatBDT(transaction.amountPaisa)}
                        </td>

                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                          {formatBDT(transaction.feePaisa)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[transaction.status] ??
                              "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {transaction.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                          {new Date(transaction.createdAt).toLocaleString("en-BD")}
                        </td>

                        <td className="px-5 py-4">
                          {transaction.status === "pending" &&
                            (transaction.type === "deposit" ||
                              transaction.type === "withdrawal") ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  openReviewModal(transaction, "approve")
                                }
                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                              >
                                <CheckCircle size={14} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  openReviewModal(transaction, "reject")
                                }
                                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No action
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {transactions.length === 0 && (
                  <p className="py-16 text-center text-gray-500">
                    No transactions found.
                  </p>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#29435C]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination?.page ?? page} of{" "}
                  {pagination?.totalPages ?? 1}
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-1 rounded-xl border border-gray-300 px-4 py-2 text-sm text-[#172B4D] transition hover:bg-gray-100 disabled:opacity-40 dark:border-[#29435C] dark:text-white dark:hover:bg-[#102A43]"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    disabled={
                      isFetching || page >= (pagination?.totalPages ?? 1)
                    }
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1 rounded-xl bg-[#176B87] px-4 py-2 text-sm text-white transition hover:bg-[#102A43] disabled:opacity-40"
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

      {/* Review Confirmation Modal */}
      {selectedTransaction && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-3 ${reviewAction === "approve"
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                      : "bg-red-100 text-red-600 dark:bg-red-500/10"
                    }`}
                >
                  {reviewAction === "approve" ? (
                    <CheckCircle size={22} />
                  ) : (
                    <XCircle size={22} />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-[#172B4D] dark:text-white">
                    {reviewAction === "approve"
                      ? "Approve Request"
                      : "Reject Request"}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {typeLabels[selectedTransaction.type]}
                  </p>
                </div>
              </div>

              <button
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:hover:bg-[#102A43]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transaction ID
              </p>
              <p className="mt-1 font-semibold text-[#176B87]">
                {selectedTransaction.transactionId}
              </p>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Amount
              </p>
              <p className="mt-1 text-xl font-bold text-[#172B4D] dark:text-white">
                {formatBDT(selectedTransaction.amountPaisa)}
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="reviewNote"
                className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-white"
              >
                Review Note (Optional)
              </label>

              <textarea
                id="reviewNote"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Write a review note..."
                disabled={isReviewing}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white p-3 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {reviewNote.length}/500
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:border-[#29435C] dark:text-gray-300 dark:hover:bg-[#102A43]"
              >
                Cancel
              </button>

              <button
                onClick={handleReview}
                disabled={isReviewing}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${reviewAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {isReviewing ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <ClipboardCheck size={16} />
                )}

                {isReviewing
                  ? "Processing..."
                  : reviewAction === "approve"
                    ? "Confirm Approve"
                    : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
