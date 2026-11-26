
"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Wallet,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  useGetStaffTransactionHistoryQuery,
  type StaffHistoryTransaction,
} from "@/redux/api/staffTransactionHistoryApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format((paisa || 0) / 100);

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const statusStyle: Record<string, string> = {
  completed:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

const typeIcon = (type: string) => {
  if (type === "deposit" || type === "loan_disbursement") {
    return <ArrowDownLeft size={16} />;
  }

  if (type === "withdrawal") {
    return <ArrowUpRight size={16} />;
  }

  return <ArrowLeftRight size={16} />;
};

export default function TransactionsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [selectedTransaction, setSelectedTransaction] =
    useState<StaffHistoryTransaction | null>(null);

  const { data, isLoading, isFetching, error, refetch } =
    useGetStaffTransactionHistoryQuery({
      page,
      limit: 10,
      search,
      type,
      status,
    });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const totalTransactions = pagination?.total ?? 0;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const resetFilters = () => {
    setPage(1);
    setSearch("");
    setSearchInput("");
    setType("");
    setStatus("");
  };

  const summary = {
    total: totalTransactions,
    completed: transactions.filter(
      (item) => item.status === "completed"
    ).length,
    pending: transactions.filter(
      (item) => item.status === "pending"
    ).length,
    rejected: transactions.filter(
      (item) => item.status === "rejected"
    ).length,
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-slate-100 sm:p-6">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and monitor banking transaction history.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12566D] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={isFetching ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Transactions",
            value: summary.total,
            icon: <Wallet size={21} />,
            color: "text-[#176B87]",
          },
          {
            label: "Completed (Current Page)",
            value: summary.completed,
            icon: <CheckCircle2 size={21} />,
            color: "text-green-600",
          },
          {
            label: "Pending (Current Page)",
            value: summary.pending,
            icon: <Clock size={21} />,
            color: "text-amber-500",
          },
          {
            label: "Rejected (Current Page)",
            value: summary.rejected,
            icon: <AlertCircle size={21} />,
            color: "text-red-500",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#14283D]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <span className={item.color}>{item.icon}</span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#14283D]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">

          <div className="relative md:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              placeholder="Search transaction ID or description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#0B1726]"
            />
          </div>

          <select
            value={type}
            onChange={(event) => {
              setPage(1);
              setType(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-600 dark:bg-[#0B1726]"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="loan_disbursement">Loan Disbursement</option>
            <option value="loan_repayment">Loan Repayment</option>
          </select>

          <select
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-600 dark:bg-[#0B1726]"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleSearch}
            className="rounded-xl bg-[#176B87] px-5 py-2 text-sm font-semibold text-white hover:bg-[#12566D]"
          >
            Search
          </button>

          <button
            onClick={resetFilters}
            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#14283D]">

        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
          <div>
            <h2 className="font-bold">
              Transaction History
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {totalTransactions} records found
            </p>
          </div>

          {isFetching && (
            <RefreshCw
              size={17}
              className="animate-spin text-[#176B87]"
            />
          )}
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            Loading transactions...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            Failed to load transactions. Please refresh.
            <button
              onClick={() => refetch()}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet
              size={36}
              className="mx-auto mb-3 text-slate-400"
            />

            <p className="font-semibold">
              No transactions found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Transactions will appear here when available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-[#0B1726] dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Account</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {transactions.map((transaction) => {
                  const account =
                    transaction.receiverAccount ??
                    transaction.senderAccount;

                  return (
                    <tr
                      key={transaction._id}
                      className="hover:bg-slate-50 dark:hover:bg-[#1A344D]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {transaction.transactionId}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-xs text-slate-500">
                          {transaction.description || "No description"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {transaction.initiatedBy?.fullName || "System"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {transaction.initiatedBy?.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p>
                          {account?.accountNumber || "—"}
                        </p>

                        <p className="text-xs capitalize text-slate-500">
                          {account?.accountType || ""}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 font-medium capitalize">
                          {typeIcon(transaction.type)}
                          {transaction.type.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold tabular-nums">
                        {formatBDT(transaction.amountPaisa)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[transaction.status] ||
                            "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDate(transaction.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setSelectedTransaction(transaction)
                          }
                          title="View details"
                          className="rounded-lg border border-slate-200 p-2 text-[#176B87] hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination - Always Visible */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#14283D]">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page {pagination?.page ?? page} of {totalPages}
          {" · "}
          {totalTransactions} transactions
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1 || isFetching}
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-600"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            disabled={
              !pagination ||
              page >= pagination.totalPages ||
              isFetching
            }
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40 dark:border-slate-600"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#14283D]">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Transaction Details
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedTransaction.transactionId}
                </p>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-slate-50 p-4 text-center dark:bg-[#0B1726]">
              <p className="text-sm text-slate-500">
                Transaction Amount
              </p>

              <p className="mt-2 text-3xl font-bold text-[#176B87]">
                {formatBDT(selectedTransaction.amountPaisa)}
              </p>

              <p className="mt-2 text-sm capitalize">
                {selectedTransaction.type.replaceAll("_", " ")}
              </p>
            </div>

            <div className="space-y-3">
              {[
                ["Transaction ID", selectedTransaction.transactionId],
                ["Customer", selectedTransaction.initiatedBy?.fullName || "System"],
                ["Email", selectedTransaction.initiatedBy?.email || "—"],
                ["Type", selectedTransaction.type.replaceAll("_", " ")],
                ["Status", selectedTransaction.status],
                ["Sender Account", selectedTransaction.senderAccount?.accountNumber || "—"],
                ["Receiver Account", selectedTransaction.receiverAccount?.accountNumber || "—"],
                ["Fee", formatBDT(selectedTransaction.feePaisa || 0)],
                ["Reviewed By", selectedTransaction.reviewedBy?.fullName || "—"],
                ["Description", selectedTransaction.description || "—"],
                ["Created At", formatDate(selectedTransaction.createdAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col justify-between gap-1 border-b border-slate-100 pb-3 text-sm dark:border-slate-700 sm:flex-row"
                >
                  <span className="text-slate-500">
                    {label}
                  </span>

                  <span className="break-all font-medium capitalize sm:text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="mt-6 w-full rounded-xl bg-[#176B87] py-3 font-semibold text-white hover:bg-[#12566D]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
