
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Wallet,
  FileText,
  X,
  ShieldCheck,
  AlertCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useGetStaffLoansQuery,
  useReviewStaffLoanMutation,
  useDisburseStaffLoanMutation,
  type StaffLoan,
} from "@/redux/api/staffLoanApi";

type ApiError = {
  data?: {
    message?: string;
  };
};

const formatBDT = (paisa?: number | null) =>
  `৳${((paisa || 0) / 100).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "—";

const statusStyles: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  under_review:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  active:
    "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  completed:
    "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400",
};

const loanTypes = [
  "personal",
  "business",
  "education",
  "home",
  "other",
];

const initialReview = {
  action: "under_review" as
    | "under_review"
    | "approved"
    | "rejected",
  reviewNotes: "",
  approvedAmount: "",
  interestRate: "10",
};

export default function LoansClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [loanType, setLoanType] = useState("");

  const [selectedLoan, setSelectedLoan] =
    useState<StaffLoan | null>(null);

  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState(initialReview);
  const [message, setMessage] = useState("");

  const queryParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status || undefined,
      loanType: loanType || undefined,
    }),
    [page, search, status, loanType]
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetStaffLoansQuery(queryParams);

  const [reviewLoan, { isLoading: isReviewing }] =
    useReviewStaffLoanMutation();

  const [disburseLoan, { isLoading: isDisbursing }] =
    useDisburseStaffLoanMutation();

  const loans = data?.data || [];
  const pagination = data?.pagination;

  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const totalItems = pagination?.total ?? 0;

  const summary = [
    {
      label: "Pending Requests",
      value: status === "pending" ? totalItems : "—",
      icon: Clock,
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Under Review",
      value:
        status === "under_review" ? totalItems : "—",
      icon: FileText,
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Approved",
      value: status === "approved" ? totalItems : "—",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Total Requests",
      value: totalItems,
      icon: Wallet,
      color: "text-[#176B87] bg-[#176B87]/10",
    },
  ];

  const canReview = (loan: StaffLoan) =>
    loan.status === "pending" ||
    loan.status === "under_review";

  const openReview = (loan: StaffLoan) => {
    setSelectedLoan(loan);

    setReviewForm({
      ...initialReview,
      approvedAmount: String(
        loan.requestedAmountPaisa / 100
      ),
    });

    setMessage("");
    setReviewModal(true);
  };

  const closeReviewModal = () => {
    if (isReviewing) return;

    setReviewModal(false);
    setSelectedLoan(null);
    setMessage("");
  };

  const handleReview = async () => {
    if (!selectedLoan) return;

    if (
      reviewForm.action === "rejected" &&
      !reviewForm.reviewNotes.trim()
    ) {
      setMessage("Rejection reason is required.");
      return;
    }

    const body: {
      id: string;
      action: "under_review" | "approved" | "rejected";
      reviewNotes?: string;
      approvedAmountPaisa?: number;
      interestRateBps?: number;
    } = {
      id: selectedLoan._id,
      action: reviewForm.action,
      reviewNotes: reviewForm.reviewNotes.trim(),
    };

    if (reviewForm.action === "approved") {
      const amount = Number(reviewForm.approvedAmount);
      const rate = Number(reviewForm.interestRate);
      const amountPaisa = Math.round(amount * 100);

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !Number.isSafeInteger(amountPaisa)
      ) {
        setMessage("Enter a valid approved amount.");
        return;
      }

      if (
        amountPaisa > selectedLoan.requestedAmountPaisa
      ) {
        setMessage(
          "Approved amount cannot exceed requested amount."
        );
        return;
      }

      if (
        !Number.isFinite(rate) ||
        rate < 0 ||
        rate > 1000
      ) {
        setMessage(
          "Interest rate must be between 0% and 1000%."
        );
        return;
      }

      body.approvedAmountPaisa = amountPaisa;
      body.interestRateBps = Math.round(rate * 100);
    }

    try {
      await reviewLoan(body).unwrap();

      setReviewModal(false);
      setSelectedLoan(null);
      setMessage("");
      refetch();
    } catch (error: unknown) {
      const apiError = error as ApiError;

      setMessage(
        apiError.data?.message ||
        "Unable to update loan request."
      );
    }
  };

  const handleDisburse = async (loan: StaffLoan) => {
    const confirmed = window.confirm(
      `Disburse ${formatBDT(
        loan.approvedAmountPaisa
      )} to ${loan.customer?.fullName}?`
    );

    if (!confirmed) return;

    try {
      await disburseLoan({ id: loan._id }).unwrap();

      setSelectedLoan(null);
      refetch();

      window.alert("Loan disbursed successfully.");
    } catch (error: unknown) {
      const apiError = error as ApiError;

      window.alert(
        apiError.data?.message ||
        "Unable to disburse this loan."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#176B87] dark:text-[#14B8A6]">
              <ShieldCheck size={17} />
              Staff Management
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Loan Requests
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review customer loan applications and manage disbursements.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#176B87] disabled:opacity-60 dark:bg-[#176B87]"
          >
            <RefreshCw
              size={17}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {item.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search customer or loan..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={loanType}
              onChange={(e) => {
                setLoanType(e.target.value);
                setPage(1);
              }}
              className={inputClass}
            >
              <option value="">All Loan Types</option>

              {loanTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loan Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#14283D]">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <div>
              <h2 className="font-bold">Loan Applications</h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Review and process loan applications
              </p>
            </div>

            <span className="rounded-lg bg-[#176B87]/10 px-3 py-1.5 text-xs font-semibold text-[#176B87] dark:text-[#14B8A6]">
              {totalItems} Records
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading loan applications...
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <AlertCircle
                className="mx-auto mb-3 text-red-500"
                size={30}
              />

              <p className="font-semibold">
                Failed to load loan requests
              </p>

              <button
                onClick={() => refetch()}
                className="mt-3 text-sm font-semibold text-[#176B87]"
              >
                Try again
              </button>
            </div>
          ) : loans.length === 0 ? (
            <div className="p-12 text-center">
              <FileText
                className="mx-auto mb-3 text-gray-400"
                size={32}
              />

              <p className="font-semibold">
                No loan applications found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try changing the filters or check again later.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-[#0B1726] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Loan Type</th>
                    <th className="px-5 py-4">Requested</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Monthly Income</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Applied</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {loans.map((loan) => (
                    <tr
                      key={loan._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {loan.customer?.fullName || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {loan.customer?.email || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 capitalize">
                        {loan.loanType}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatBDT(loan.requestedAmountPaisa)}
                      </td>

                      <td className="px-5 py-4">
                        {loan.durationMonths} months
                      </td>

                      <td className="px-5 py-4">
                        {formatBDT(loan.monthlyIncomePaisa)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[loan.status] ||
                            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {loan.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(loan.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="rounded-lg border border-[#176B87]/20 p-2 text-[#176B87] hover:bg-[#176B87]/10 dark:text-[#14B8A6]"
                          title="View details"
                        >
                          <Eye size={17} />
                        </button>

                        {canReview(loan) && (
                          <button
                            onClick={() => openReview(loan)}
                            className="ml-2 rounded-lg bg-[#176B87] px-3 py-2 text-xs font-semibold text-white hover:bg-[#102A43]"
                          >
                            Review
                          </button>
                        )}

                        {loan.status === "approved" && (
                          <button
                            onClick={() => handleDisburse(loan)}
                            disabled={isDisbursing}
                            className="ml-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            Disburse
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination - Always Visible */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/10 sm:flex-row">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination?.page ?? page} of {totalPages}
              {" · "}
              {totalItems} total applications
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages ||
                  isFetching ||
                  totalItems === 0
                }
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/5"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Modal */}
      {selectedLoan && !reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#14283D]">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Loan Details</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Application ID: {selectedLoan._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedLoan(null)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Customer", selectedLoan.customer?.fullName || "—"],
                ["Email", selectedLoan.customer?.email || "—"],
                ["Loan Type", selectedLoan.loanType],
                ["Requested Amount", formatBDT(selectedLoan.requestedAmountPaisa)],
                ["Duration", `${selectedLoan.durationMonths} months`],
                ["Monthly Income", formatBDT(selectedLoan.monthlyIncomePaisa)],
                ["Employment", selectedLoan.employmentStatus.replace("_", " ")],
                ["Status", selectedLoan.status.replace("_", " ")],
                ["Approved Amount", formatBDT(selectedLoan.approvedAmountPaisa)],
                [
                  "Interest Rate",
                  selectedLoan.interestRateBps != null
                    ? `${selectedLoan.interestRateBps / 100}%`
                    : "—",
                ],
                ["Monthly Installment", formatBDT(selectedLoan.monthlyInstallmentPaisa)],
                ["Outstanding", formatBDT(selectedLoan.outstandingBalancePaisa)],
                ["Applied On", formatDate(selectedLoan.createdAt)],
                ["Disbursed On", formatDate(selectedLoan.disbursedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-gray-50 p-4 dark:bg-[#0B1726]"
                >
                  <p className="text-xs text-gray-500">{label}</p>

                  <p className="mt-1 break-words text-sm font-semibold capitalize">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {selectedLoan.applicationDescription && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-[#0B1726]">
                <p className="text-xs text-gray-500">
                  Application Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {selectedLoan.applicationDescription}
                </p>
              </div>
            )}

            {selectedLoan.reviewNotes && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-[#0B1726]">
                <p className="text-xs text-gray-500">
                  Staff Review Notes
                </p>

                <p className="mt-2 text-sm">
                  {selectedLoan.reviewNotes}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {canReview(selectedLoan) && (
                <button
                  onClick={() => openReview(selectedLoan)}
                  className="rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Review Application
                </button>
              )}

              {selectedLoan.status === "approved" && (
                <button
                  onClick={() => handleDisburse(selectedLoan)}
                  disabled={isDisbursing}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Send size={16} />
                  {isDisbursing ? "Disbursing..." : "Disburse Loan"}
                </button>
              )}

              <button
                onClick={() => setSelectedLoan(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold dark:border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && selectedLoan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#14283D]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Review Loan Application
              </h2>

              <button
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-[#176B87]/10 p-4">
              <p className="text-sm font-semibold">
                {selectedLoan.customer?.fullName}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Requested: {formatBDT(selectedLoan.requestedAmountPaisa)}
                {" · "}
                {selectedLoan.durationMonths} months
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Review Decision
                </label>

                <select
                  value={reviewForm.action}
                  onChange={(e) =>
                    setReviewForm((f) => ({
                      ...f,
                      action: e.target.value as typeof f.action,
                    }))
                  }
                  className={inputClass}
                >
                  <option value="under_review">Mark Under Review</option>
                  <option value="approved">Approve Loan</option>
                  <option value="rejected">Reject Loan</option>
                </select>
              </div>

              {reviewForm.action === "approved" && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Approved Amount (BDT)
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      max={selectedLoan.requestedAmountPaisa / 100}
                      step="0.01"
                      value={reviewForm.approvedAmount}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          approvedAmount: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Maximum: {formatBDT(selectedLoan.requestedAmountPaisa)}
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Annual Interest Rate (%)
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="0.01"
                      value={reviewForm.interestRate}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          interestRate: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Review Notes{" "}
                  {reviewForm.action === "rejected" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>

                <textarea
                  rows={4}
                  maxLength={1000}
                  value={reviewForm.reviewNotes}
                  onChange={(e) =>
                    setReviewForm((f) => ({
                      ...f,
                      reviewNotes: e.target.value,
                    }))
                  }
                  placeholder={
                    reviewForm.action === "rejected"
                      ? "Explain why this loan is rejected..."
                      : "Add review notes..."
                  }
                  className={inputClass}
                />

                <p className="mt-1 text-right text-xs text-gray-500">
                  {reviewForm.reviewNotes.length}/1000
                </p>
              </div>

              {message && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={closeReviewModal}
                  disabled={isReviewing}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold disabled:opacity-50 dark:border-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReview}
                  disabled={isReviewing}
                  className="rounded-xl bg-[#176B87] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isReviewing ? "Saving..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
