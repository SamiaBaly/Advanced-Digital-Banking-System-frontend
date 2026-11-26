
"use client";

import { useState } from "react";
import {
  useCreateLoanApplicationMutation,
  useGetMyLoansQuery,
  useRepayLoanMutation,
  type LoanType,
  type EmploymentStatus,
  type Loan,
} from "@/redux/api/loanApi";
import { useGetMyAccountsQuery } from "@/redux/api/accountApi";

import {
  Banknote,
  CalendarDays,
  Wallet,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Eye,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

const PAGE_SIZE = 10;

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(paisa / 100);

const statusStyle: Record<string, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  under_review:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  approved:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  rejected:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  active:
    "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
  completed:
    "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  completed: "Completed",
};

export default function CustomerLoansPage() {
  const [page, setPage] = useState(1);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useGetMyAccountsQuery();

  const {
    data: loansData,
    isLoading: loansLoading,
    isFetching: loansFetching,
    refetch,
  } = useGetMyLoansQuery({
    page,
    limit: PAGE_SIZE,
  });

  const [createLoan, { isLoading: submitting }] =
    useCreateLoanApplicationMutation();

  const [repayLoan, { isLoading: repaying }] =
    useRepayLoanMutation();

  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [loanType, setLoanType] = useState<LoanType>("personal");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("12");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>("salaried");
  const [accountId, setAccountId] = useState("");
  const [description, setDescription] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [paymentAccountId, setPaymentAccountId] = useState("");
  const [repaymentError, setRepaymentError] = useState("");
  const [repaymentSuccess, setRepaymentSuccess] = useState("");

  const accounts = (accountsData?.data ?? []).filter(
    (account) => account.accountStatus === "active"
  );

  const loans = loansData?.data ?? [];
  const pagination = loansData?.pagination;

  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const currentPage = pagination?.page ?? page;
  const totalLoans = pagination?.total ?? loans.length;

  const openApplicationModal = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setIsApplicationOpen(true);
  };

  const closeApplicationModal = () => {
    if (!submitting) {
      setIsApplicationOpen(false);
    }
  };

  // APPLY FOR LOAN
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const amountNumber = Number(amount);
    const incomeNumber = Number(monthlyIncome);
    const durationNumber = Number(duration);

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setErrorMessage("Please enter a valid loan amount.");
      return;
    }

    if (!Number.isFinite(incomeNumber) || incomeNumber <= 0) {
      setErrorMessage("Please enter a valid monthly income.");
      return;
    }

    if (
      !Number.isInteger(durationNumber) ||
      durationNumber < 1 ||
      durationNumber > 360
    ) {
      setErrorMessage("Duration must be between 1 and 360 months.");
      return;
    }

    if (
      amountNumber * 100 > Number.MAX_SAFE_INTEGER ||
      incomeNumber * 100 > Number.MAX_SAFE_INTEGER
    ) {
      setErrorMessage("The entered amount is too large.");
      return;
    }

    try {
      const result = await createLoan({
        loanType,
        requestedAmountPaisa: Math.round(amountNumber * 100),
        durationMonths: durationNumber,
        monthlyIncomePaisa: Math.round(incomeNumber * 100),
        employmentStatus,
        applicationDescription: description.trim(),
        ...(accountId ? { disbursementAccount: accountId } : {}),
      }).unwrap();

      setSuccessMessage(
        result.message || "Loan application submitted successfully."
      );

      setAmount("");
      setMonthlyIncome("");
      setDuration("12");
      setDescription("");
      setAccountId("");

      setPage(1);

      await refetch();
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
      };

      setErrorMessage(
        apiError.data?.message || "Unable to submit loan application."
      );
    }
  };

  // OPEN LOAN DETAILS
  const openLoanDetails = (loan: Loan) => {
    setSelectedLoan(loan);

    setRepaymentAmount(
      loan.monthlyInstallmentPaisa != null
        ? (loan.monthlyInstallmentPaisa / 100).toFixed(2)
        : ""
    );

    setPaymentAccountId("");
    setRepaymentError("");
    setRepaymentSuccess("");
  };

  // REPAY LOAN
  const handleRepayment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setRepaymentError("");
    setRepaymentSuccess("");

    if (!selectedLoan) return;

    const amountNumber = Number(repaymentAmount);

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setRepaymentError("Please enter a valid payment amount.");
      return;
    }

    if (amountNumber * 100 > Number.MAX_SAFE_INTEGER) {
      setRepaymentError("Payment amount is too large.");
      return;
    }

    if (!paymentAccountId) {
      setRepaymentError("Please select a payment account.");
      return;
    }

    const amountPaisa = Math.round(amountNumber * 100);
    const outstanding = selectedLoan.outstandingBalancePaisa ?? 0;

    if (amountPaisa > outstanding) {
      setRepaymentError(
        "Payment cannot exceed outstanding balance."
      );
      return;
    }

    const selectedAccount = accounts.find(
      (account) => account._id === paymentAccountId
    );

    if (!selectedAccount) {
      setRepaymentError("Please select a valid active account.");
      return;
    }

    if ((selectedAccount.balancePaisa ?? 0) < amountPaisa) {
      setRepaymentError("Insufficient account balance.");
      return;
    }

    try {
      const result = await repayLoan({
        id: selectedLoan._id,
        amountPaisa,
        paymentAccount: paymentAccountId,
      }).unwrap();

      setRepaymentSuccess(
        result.message || "Loan repayment completed successfully."
      );

      setSelectedLoan((previous) =>
        previous
          ? {
            ...previous,
            outstandingBalancePaisa:
              result.data.remainingBalancePaisa,
            status: result.data.loanStatus,
            completedAt:
              result.data.loanStatus === "completed"
                ? new Date().toISOString()
                : previous.completedAt,
          }
          : null
      );

      setRepaymentAmount("");

      await Promise.all([refetch(), refetchAccounts()]);
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
      };

      setRepaymentError(
        apiError.data?.message || "Unable to process loan repayment."
      );
    }
  };

  // PAGINATION
  const handlePrevious = () => {
    if (currentPage > 1 && !loansFetching) {
      setPage((previous) => Math.max(1, previous - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loansFetching) {
      setPage((previous) =>
        Math.min(totalPages, previous + 1)
      );
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-[#F4F7FB] sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Loan Management
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Apply for a loan, track your application and repay your active loans.
          </p>
        </div>

        <button
          type="button"
          onClick={openApplicationModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 font-semibold text-white transition hover:bg-[#12566D]"
        >
          <Plus size={19} />
          Apply for Loan
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && !isApplicationOpen && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* FEATURE CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#14283D]">
          <Banknote className="mb-3 h-7 w-7 text-[#176B87]" />
          <h3 className="font-semibold">Flexible Amount</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Request the amount you need.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#14283D]">
          <CalendarDays className="mb-3 h-7 w-7 text-[#14B8A6]" />
          <h3 className="font-semibold">Flexible Duration</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose your repayment duration.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#14283D]">
          <Wallet className="mb-3 h-7 w-7 text-[#176B87]" />
          <h3 className="font-semibold">Loan Repayment</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Repay your active loan securely.
          </p>
        </div>
      </div>

      {/* LOAN TABLE */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#14283D] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              My Loan Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and track your submitted applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={loansFetching}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-[#102A43]"
          >
            <RefreshCw
              className={`h-4 w-4 ${loansFetching ? "animate-spin" : ""
                }`}
            />
            Refresh
          </button>
        </div>

        {loansLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-[#176B87]" />
          </div>
        ) : loans.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center dark:border-slate-600">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-400" />
            <p className="font-medium">No loan applications yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Submit your first loan application.
            </p>
            <button
              type="button"
              onClick={openApplicationModal}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12566D]"
            >
              <Plus size={16} />
              Apply for Loan
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700">
                    <th className="px-4 py-3">Loan Type</th>
                    <th className="px-4 py-3">Requested Amount</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Application Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.map((loan) => (
                    <tr
                      key={loan._id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-700"
                    >
                      <td className="px-4 py-4 font-medium capitalize">
                        {loan.loanType.replace("_", " ")}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        {formatBDT(loan.requestedAmountPaisa)}
                      </td>

                      <td className="px-4 py-4">
                        {loan.durationMonths} months
                      </td>

                      <td className="px-4 py-4">
                        {new Date(loan.createdAt).toLocaleDateString("en-BD")}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[loan.status] ||
                            statusStyle.pending
                            }`}
                        >
                          {statusLabel[loan.status] || loan.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openLoanDetails(loan)}
                          className="flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-[#176B87] hover:bg-slate-100 dark:hover:bg-[#102A43]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PREVIOUS / NEXT PAGINATION */}
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {totalLoans === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
                {" - "}
                {Math.min(currentPage * PAGE_SIZE, totalLoans)}
                {" of "}
                {totalLoans} applications
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentPage <= 1 || loansFetching}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-[#176B87] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-[#14B8A6] dark:hover:bg-[#102A43]"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="px-2 text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages || loansFetching}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-[#176B87] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-[#14B8A6] dark:hover:bg-[#102A43]"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* APPLICATION MODAL */}
      {isApplicationOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={closeApplicationModal}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#14283D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#14283D] sm:p-6">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[#176B87] dark:text-[#14B8A6]">
                  <Banknote size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Loan Services
                  </span>
                </div>
                <h2 className="text-xl font-bold">
                  New Loan Application
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Complete the form to submit your loan request.
                </p>
              </div>

              <button
                type="button"
                onClick={closeApplicationModal}
                disabled={submitting}
                className="rounded-xl p-2 transition hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-[#102A43]"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              {successMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Loan Type *
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value as LoanType)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="education">Education Loan</option>
                    <option value="home">Home Loan</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Loan Amount (BDT) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter requested amount"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    step="1"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Monthly Income (BDT) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="Enter monthly income"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Employment Status *
                  </label>
                  <select
                    value={employmentStatus}
                    onChange={(e) =>
                      setEmploymentStatus(
                        e.target.value as EmploymentStatus
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self_employed">Self Employed</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Disbursement Account
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    disabled={accountsLoading}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] disabled:opacity-60 dark:border-slate-600 dark:bg-[#102A43]"
                  >
                    <option value="">
                      Select account (optional)
                    </option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountNumber} - {account.accountType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Application Description
                </label>
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why you need this loan..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] dark:border-slate-600 dark:bg-[#102A43]"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {description.length}/1000
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-[#102A43] dark:text-slate-300">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#176B87]" />
                <p>
                  Your application will be submitted for admin review.
                  Submission does not guarantee loan approval.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeApplicationModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-[#102A43]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || accountsLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12566D] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOAN DETAILS MODAL */}
      {selectedLoan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !repaying && setSelectedLoan(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-[#14283D]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Loan Application Details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedLoan(null)}
                disabled={repaying}
                className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-[#102A43]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[selectedLoan.status] ||
                    statusStyle.pending
                    }`}
                >
                  {statusLabel[selectedLoan.status] || selectedLoan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Loan Type</p>
                  <p className="mt-1 font-semibold capitalize">
                    {selectedLoan.loanType}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Requested Amount</p>
                  <p className="mt-1 font-semibold">
                    {formatBDT(selectedLoan.requestedAmountPaisa)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Duration</p>
                  <p className="mt-1 font-semibold">
                    {selectedLoan.durationMonths} months
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Monthly Income</p>
                  <p className="mt-1 font-semibold">
                    {formatBDT(selectedLoan.monthlyIncomePaisa)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Employment</p>
                  <p className="mt-1 font-semibold capitalize">
                    {selectedLoan.employmentStatus.replace("_", " ")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Applied On</p>
                  <p className="mt-1 font-semibold">
                    {new Date(selectedLoan.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
              </div>

              {selectedLoan.applicationDescription && (
                <div>
                  <p className="text-xs text-slate-500">Description</p>
                  <p className="mt-1 text-sm">
                    {selectedLoan.applicationDescription}
                  </p>
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#102A43]">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4 text-[#176B87]" />
                  Admin Review
                </div>
                <p className="text-sm">
                  {selectedLoan.reviewNotes || "No review notes available yet."}
                </p>
              </div>

              {selectedLoan.approvedAmountPaisa != null && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Approved Amount
                  </p>
                  <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">
                    {formatBDT(selectedLoan.approvedAmountPaisa)}
                  </p>

                  {selectedLoan.interestRateBps != null && (
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      Interest Rate:{" "}
                      {(selectedLoan.interestRateBps / 100).toFixed(2)}%
                    </p>
                  )}

                  {selectedLoan.monthlyInstallmentPaisa != null && (
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      Monthly Installment:{" "}
                      {formatBDT(selectedLoan.monthlyInstallmentPaisa)}
                    </p>
                  )}

                  {selectedLoan.totalRepayablePaisa != null && (
                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      Total Repayable:{" "}
                      {formatBDT(selectedLoan.totalRepayablePaisa)}
                    </p>
                  )}
                </div>
              )}

              {/* REPAYMENT */}
              {selectedLoan.status === "active" && (
                <div className="space-y-4 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/20">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                    <h3 className="font-bold text-teal-800 dark:text-teal-400">
                      Loan Repayment
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3 dark:bg-[#14283D]">
                      <p className="text-xs text-slate-500">
                        Outstanding Balance
                      </p>
                      <p className="mt-1 font-bold text-red-600 dark:text-red-400">
                        {formatBDT(
                          selectedLoan.outstandingBalancePaisa ?? 0
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg bg-white p-3 dark:bg-[#14283D]">
                      <p className="text-xs text-slate-500">Monthly EMI</p>
                      <p className="mt-1 font-bold text-teal-700 dark:text-teal-400">
                        {formatBDT(
                          selectedLoan.monthlyInstallmentPaisa ?? 0
                        )}
                      </p>
                    </div>
                  </div>

                  {repaymentSuccess && (
                    <div className="flex items-start gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      {repaymentSuccess}
                    </div>
                  )}

                  {repaymentError && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      {repaymentError}
                    </div>
                  )}

                  {(selectedLoan.outstandingBalancePaisa ?? 0) > 0 ? (
                    <form onSubmit={handleRepayment} className="space-y-3">
                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Payment Account *
                        </label>
                        <select
                          required
                          value={paymentAccountId}
                          onChange={(e) =>
                            setPaymentAccountId(e.target.value)
                          }
                          disabled={accountsLoading || repaying}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] disabled:opacity-60 dark:border-slate-600 dark:bg-[#102A43]"
                        >
                          <option value="">Select payment account</option>
                          {accounts.map((account) => (
                            <option
                              key={account._id}
                              value={account._id}
                            >
                              {account.accountNumber} - {account.accountType} (
                              {formatBDT(account.balancePaisa ?? 0)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Payment Amount (BDT) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          max={
                            (selectedLoan.outstandingBalancePaisa ?? 0) / 100
                          }
                          value={repaymentAmount}
                          onChange={(e) =>
                            setRepaymentAmount(e.target.value)
                          }
                          placeholder="Enter repayment amount"
                          disabled={repaying}
                          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#176B87] disabled:opacity-60 dark:border-slate-600 dark:bg-[#102A43]"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Maximum payment:{" "}
                          {formatBDT(
                            selectedLoan.outstandingBalancePaisa ?? 0
                          )}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          repaying ||
                          accountsLoading ||
                          accounts.length === 0
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {repaying ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5" />
                            Repay Loan
                          </>
                        )}
                      </button>

                      {accounts.length === 0 && !accountsLoading && (
                        <p className="text-xs text-red-600">
                          No active payment account available.
                        </p>
                      )}
                    </form>
                  ) : (
                    <p className="rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      This loan has been fully repaid.
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedLoan(null)}
              disabled={repaying}
              className="mt-6 w-full rounded-xl bg-[#176B87] px-4 py-3 font-semibold text-white hover:bg-[#12566D] disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
