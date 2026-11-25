
"use client";

import { useState } from "react";
import {
  Search,
  Wallet,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Save,
  Banknote,
  CalendarDays,
  UserRound,
  Landmark,
  FileText,
} from "lucide-react";

import {
  useGetLoansQuery,
  useUpdateLoanStatusMutation,
  useDisburseLoanMutation,
  type Loan,
  type LoanStatus,
} from "@/redux/api/loanApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(paisa / 100);

const statusColors: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  under_review:
    "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20",
  approved:
    "bg-green-50 text-green-700 ring-1 ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
  rejected:
    "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  active:
    "bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:ring-teal-500/20",
  completed:
    "bg-gray-100 text-gray-700 ring-1 ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  completed: "Completed",
};

const loanTypeLabels: Record<string, string> = {
  personal: "Personal",
  business: "Business",
  education: "Education",
  home: "Home",
  other: "Other",
};

const loanStatuses: LoanStatus[] = [
  "pending",
  "under_review",
  "approved",
  "rejected",
  "active",
  "completed",
];

export default function LoansClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loanType, setLoanType] = useState("");

  const [selectedStatuses, setSelectedStatuses] = useState<
    Record<string, LoanStatus>
  >({});

  const [reviewNotes, setReviewNotes] = useState<
    Record<string, string>
  >({});

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetLoansQuery({
    page,
    limit: 10,
    search,
    status,
    loanType,
  });

  const [updateLoanStatus, { isLoading: isUpdating }] =
    useUpdateLoanStatusMutation();

  const [disburseLoan, { isLoading: isDisbursing }] =
    useDisburseLoanMutation();

  const loans = data?.data ?? [];
  const pagination = data?.pagination;

  const handleStatusUpdate = async (loan: Loan) => {
    const newStatus = selectedStatuses[loan._id];

    if (!newStatus || newStatus === loan.status) return;

    try {
      await updateLoanStatus({
        id: loan._id,
        status: newStatus,
        reviewNotes: reviewNotes[loan._id] ?? "",
      }).unwrap();

      setSelectedStatuses((prev) => {
        const updated = { ...prev };
        delete updated[loan._id];
        return updated;
      });

      setReviewNotes((prev) => ({
        ...prev,
        [loan._id]: "",
      }));

      await refetch();
      alert("Loan status updated successfully.");
    } catch (error) {
      console.error("Loan status update failed:", error);
      alert("Failed to update loan status. Please try again.");
    }
  };

  const handleDisbursement = async (loan: Loan) => {
    if (loan.status !== "approved" || loan.disbursedAt) return;

    const amount = loan.approvedAmountPaisa ?? 0;

    if (amount <= 0) {
      alert("Approved loan amount is invalid.");
      return;
    }

    if (!loan.disbursementAccount?._id) {
      alert("No disbursement account found for this loan.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to disburse ${formatBDT(amount)} to ${loan.customer?.fullName ?? "this customer"}?\n\nAccount: ${loan.disbursementAccount.accountNumber}\n\nThis amount will be credited to the selected customer account.`
    );

    if (!confirmed) return;

    try {
      await disburseLoan(loan._id).unwrap();

      await refetch();

      alert(
        `Loan disbursed successfully!\nAmount: ${formatBDT(amount)}`
      );
    } catch (error) {
      console.error("Loan disbursement failed:", error);
      alert(
        "Loan disbursement failed. Please check the account and server response."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 lg:p-8 dark:bg-[#0B1726]">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#176B87] dark:text-[#14B8A6]">
              <Landmark size={15} />
              Banking Operations
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl dark:text-white">
              Loan Management
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Review applications, manage approvals and disburse customer loans.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-[#176B87] shadow-sm transition hover:border-[#176B87] hover:bg-[#F4F7FB] disabled:opacity-50 dark:border-[#29435C] dark:bg-[#14283D] dark:text-[#14B8A6] dark:hover:bg-[#102A43]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Applications
                </p>
                <h2 className="mt-3 text-3xl font-bold text-[#102A43] dark:text-white">
                  {pagination?.total ?? 0}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                <Wallet size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Total submitted loan applications
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Applications
                </p>
                <h2 className="mt-3 text-3xl font-bold text-amber-500">
                  {loans.filter((loan) => loan.status === "pending").length}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Clock size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Pending on this page
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Approved Applications
                </p>
                <h2 className="mt-3 text-3xl font-bold text-green-600 dark:text-green-400">
                  {loans.filter((loan) => loan.status === "approved").length}
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <ShieldCheck size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Approved on this page
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#29435C] dark:bg-[#14283D]">

          {/* Table Header */}
          <div className="border-b border-gray-200 px-5 py-5 dark:border-[#29435C]">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
                  Loan Applications
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Manage and review customer loan requests
                </p>
              </div>

              <span className="w-fit rounded-lg bg-[#F4F7FB] px-3 py-2 text-xs font-semibold text-[#176B87] dark:bg-[#102A43] dark:text-[#14B8A6]">
                {loans.length} Records on this page
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-5 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px] dark:border-[#29435C]">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search customer, email or loan type..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-[#F9FAFC] py-3 pl-10 pr-4 text-sm text-[#172B4D] outline-none transition placeholder:text-gray-400 focus:border-[#176B87] focus:bg-white dark:border-[#29435C] dark:bg-[#102A43] dark:text-white dark:focus:bg-[#0B1726]"
              />
            </div>

            <select
              value={loanType}
              onChange={(e) => {
                setLoanType(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-[#F9FAFC] px-4 py-3 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Loan Types</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="education">Education</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-[#F9FAFC] px-4 py-3 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Status</option>
              {loanStatuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <RefreshCw className="animate-spin text-[#176B87]" size={28} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading loan applications...
              </p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="font-medium text-red-500">
                Failed to load loans.
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-[#176B87] hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {isFetching && (
                <div className="px-5 py-2 text-xs text-[#176B87] dark:text-[#14B8A6]">
                  Updating loan list...
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1450px] text-left text-sm">

                  <thead className="bg-[#F4F7FB] dark:bg-[#102A43]">
                    <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-[#29435C] dark:text-gray-400">
                      <th className="px-5 py-4">Customer</th>
                      <th className="px-5 py-4">Loan Type</th>
                      <th className="px-5 py-4">Requested Amount</th>
                      <th className="px-5 py-4">Approved Amount</th>
                      <th className="px-5 py-4">Duration</th>
                      <th className="px-5 py-4">Monthly Income</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Applied Date</th>
                      <th className="px-5 py-4">Actions & Review</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loans.map((loan: Loan) => (
                      <tr
                        key={loan._id}
                        className="border-b border-gray-100 transition-colors hover:bg-[#F9FBFD] last:border-0 dark:border-[#29435C] dark:hover:bg-[#102A43]/70"
                      >
                        {/* Customer */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#176B87]/10 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                              <UserRound size={19} />
                            </div>

                            <div>
                              <p className="font-semibold text-[#172B4D] dark:text-white">
                                {loan.customer?.fullName ?? "Unknown"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {loan.customer?.email ?? "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Loan Type */}
                        <td className="px-5 py-5">
                          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#176B87] dark:bg-blue-500/10 dark:text-blue-400">
                            {loanTypeLabels[loan.loanType] ?? loan.loanType}
                          </span>
                        </td>

                        {/* Requested Amount */}
                        <td className="px-5 py-5 font-semibold text-[#172B4D] dark:text-white">
                          {formatBDT(loan.requestedAmountPaisa)}
                        </td>

                        {/* Approved Amount */}
                        <td className="px-5 py-5">
                          {loan.approvedAmountPaisa ? (
                            <span className="font-bold text-green-600 dark:text-green-400">
                              {formatBDT(loan.approvedAmountPaisa)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Not approved
                            </span>
                          )}
                        </td>

                        {/* Duration */}
                        <td className="px-5 py-5 text-gray-600 dark:text-gray-300">
                          {loan.durationMonths} months
                        </td>

                        {/* Income */}
                        <td className="px-5 py-5 text-gray-600 dark:text-gray-300">
                          {formatBDT(loan.monthlyIncomePaisa)}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-5">
                          <div className="flex flex-col items-start gap-2">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusColors[loan.status] ?? "bg-gray-100 text-gray-700"}`}
                            >
                              {statusLabels[loan.status] ?? loan.status}
                            </span>

                            {loan.disbursedAt && (
                              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                                <Banknote size={12} className="mr-1 inline" />
                                Disbursed
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <CalendarDays size={14} />
                            {new Date(loan.createdAt).toLocaleDateString("en-BD")}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-5">
                          <div className="flex min-w-[260px] flex-col gap-3">

                            <div className="flex items-center gap-2">
                              <select
                                value={
                                  selectedStatuses[loan._id] ?? loan.status
                                }
                                onChange={(e) =>
                                  setSelectedStatuses((prev) => ({
                                    ...prev,
                                    [loan._id]: e.target.value as LoanStatus,
                                  }))
                                }
                                className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
                              >
                                {loanStatuses.map((item) => (
                                  <option key={item} value={item}>
                                    {statusLabels[item]}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => handleStatusUpdate(loan)}
                                disabled={
                                  isUpdating ||
                                  !selectedStatuses[loan._id] ||
                                  selectedStatuses[loan._id] === loan.status
                                }
                                title="Save status"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#176B87] text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Save size={16} />
                              </button>
                            </div>

                            <div className="relative">
                              <FileText
                                size={14}
                                className="absolute left-3 top-3 text-gray-400"
                              />
                              <textarea
                                value={reviewNotes[loan._id] ?? ""}
                                onChange={(e) =>
                                  setReviewNotes((prev) => ({
                                    ...prev,
                                    [loan._id]: e.target.value,
                                  }))
                                }
                                placeholder="Write review notes..."
                                rows={2}
                                maxLength={1000}
                                className="w-full resize-none rounded-lg border border-gray-200 bg-[#F9FAFC] py-2.5 pl-9 pr-3 text-xs text-[#172B4D] outline-none focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
                              />
                            </div>

                            {loan.disbursementAccount?.accountNumber && (
                              <p className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                                <Landmark size={13} />
                                Account: {loan.disbursementAccount.accountNumber}
                              </p>
                            )}

                            {/* Disburse Button */}
                            {loan.status === "approved" && !loan.disbursedAt && (
                              <button
                                onClick={() => handleDisbursement(loan)}
                                disabled={
                                  isDisbursing ||
                                  !loan.disbursementAccount?._id
                                }
                                title={
                                  !loan.disbursementAccount?._id
                                    ? "No disbursement account selected"
                                    : "Disburse approved loan"
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Banknote size={16} />
                                {isDisbursing
                                  ? "Processing Disbursement..."
                                  : "Disburse Loan"}
                              </button>
                            )}

                            {loan.status === "active" && loan.disbursedAt && (
                              <div className="flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-xs font-bold text-teal-700 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-400">
                                <ShieldCheck size={15} />
                                Loan Disbursed
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loans.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="rounded-2xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
                      <Wallet size={30} className="text-gray-400" />
                    </div>
                    <p className="mt-4 font-semibold text-[#172B4D] dark:text-white">
                      No loan applications found
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#29435C]">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing page{" "}
                  <span className="font-semibold text-[#172B4D] dark:text-white">
                    {pagination?.page ?? page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#172B4D] dark:text-white">
                    {pagination?.totalPages ?? 1}
                  </span>
                </p>

                <div className="flex gap-2">
                  <button
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#172B4D] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29435C] dark:bg-[#102A43] dark:text-white dark:hover:bg-[#0B1726]"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    disabled={
                      isFetching || page >= (pagination?.totalPages ?? 1)
                    }
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-40"
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
