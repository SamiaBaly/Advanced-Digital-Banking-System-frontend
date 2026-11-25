
"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

import {
  useGetMyAccountsQuery,
  useRequestDepositMutation,
  useRequestWithdrawalMutation,
  type CustomerAccount,
} from "@/redux/api/accountApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(paisa / 100);

export default function DepositWithdrawPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdrawal">(
    "deposit"
  );

  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [requestResult, setRequestResult] = useState<{
    transactionId: string;
    amountPaisa: number;
    type: "deposit" | "withdrawal";
  } | null>(null);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
    error: accountsError,
    refetch,
  } = useGetMyAccountsQuery();

  const [requestDeposit, { isLoading: isDepositing }] =
    useRequestDepositMutation();

  const [requestWithdrawal, { isLoading: isWithdrawing }] =
    useRequestWithdrawalMutation();

  const accounts = accountsData?.data ?? [];

  const activeAccounts = accounts.filter(
    (account: CustomerAccount) => account.accountStatus === "active"
  );

  const selectedAccount = activeAccounts.find(
    (account) => account._id === accountId
  );

  const isSubmitting = isDepositing || isWithdrawing;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setRequestResult(null);

    if (!accountId) {
      setErrorMessage("Please select an account.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    const amountPaisa = Math.round(numericAmount * 100);

    if (
      !Number.isSafeInteger(amountPaisa) ||
      amountPaisa <= 0 ||
      Math.abs(amountPaisa / 100 - numericAmount) > 0.000001
    ) {
      setErrorMessage("Please enter a valid amount with up to 2 decimal places.");
      return;
    }

    if (
      activeTab === "withdrawal" &&
      selectedAccount &&
      amountPaisa > selectedAccount.balancePaisa
    ) {
      setErrorMessage("Insufficient account balance.");
      return;
    }

    try {
      const payload = {
        accountId,
        amountPaisa,
        description: description.trim(),
        idempotencyKey: crypto.randomUUID(),
      };

      const response =
        activeTab === "deposit"
          ? await requestDeposit(payload).unwrap()
          : await requestWithdrawal(payload).unwrap();

      setRequestResult({
        transactionId: response.data.transactionId,
        amountPaisa: response.data.amountPaisa,
        type: response.data.type,
      });

      setSuccessMessage(
        response.message || "Your request has been submitted successfully."
      );

      setAmount("");
      setDescription("");
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
          : "Request failed. Please try again.";

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 sm:p-6 dark:bg-[#0B1726]">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#172B4D] dark:text-[#F4F7FB]">
              Deposit & Withdraw
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your money with secure banking requests.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={accountsFetching}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#102A43] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={accountsFetching ? "animate-spin" : ""}
            />
            Refresh Accounts
          </button>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Available Accounts
              </p>
              <Wallet className="text-[#176B87]" size={22} />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[#102A43] dark:text-white">
              {activeAccounts.length}
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Active accounts available for transactions
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#29435C] dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected Account Balance
              </p>
              <Wallet className="text-[#14B8A6]" size={22} />
            </div>

            <h2 className="mt-3 text-2xl font-bold text-[#102A43] dark:text-white">
              {selectedAccount
                ? formatBDT(selectedAccount.balancePaisa)
                : formatBDT(0)}
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {selectedAccount
                ? selectedAccount.accountNumber
                : "Select an account to view balance"}
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-[#29435C] dark:bg-[#14283D]">

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-200 dark:border-[#29435C]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("deposit");
                setSuccessMessage("");
                setErrorMessage("");
                setRequestResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-5 text-sm font-semibold transition ${activeTab === "deposit"
                  ? "border-b-2 border-[#14B8A6] bg-[#14B8A6]/5 text-[#14B8A6]"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#102A43]"
                }`}
            >
              <ArrowDownToLine size={19} />
              Deposit Money
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("withdrawal");
                setSuccessMessage("");
                setErrorMessage("");
                setRequestResult(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-5 text-sm font-semibold transition ${activeTab === "withdrawal"
                  ? "border-b-2 border-[#176B87] bg-[#176B87]/5 text-[#176B87] dark:text-[#14B8A6]"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#102A43]"
                }`}
            >
              <ArrowUpFromLine size={19} />
              Withdraw Money
            </button>
          </div>

          <div className="p-5 sm:p-8">

            {/* Messages */}
            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-500/10">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="mt-0.5 text-green-600"
                  />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">
                      Request Submitted
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                      {successMessage}
                    </p>

                    {requestResult && (
                      <div className="mt-3 space-y-1 text-sm text-green-700 dark:text-green-400">
                        <p>
                          Transaction ID:{" "}
                          <strong>{requestResult.transactionId}</strong>
                        </p>
                        <p>
                          Amount:{" "}
                          <strong>
                            {formatBDT(requestResult.amountPaisa)}
                          </strong>
                        </p>
                        <p className="flex items-center gap-1 font-semibold">
                          <Clock size={14} />
                          Status: Pending Admin Approval
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Loading */}
            {accountsLoading ? (
              <div className="py-16 text-center text-gray-500">
                <RefreshCw size={24} className="mx-auto mb-3 animate-spin" />
                Loading your accounts...
              </div>
            ) : accountsError ? (
              <div className="py-12 text-center">
                <AlertCircle
                  size={28}
                  className="mx-auto mb-3 text-red-500"
                />
                <p className="text-sm text-red-500">
                  Failed to load accounts. Please refresh.
                </p>
              </div>
            ) : activeAccounts.length === 0 ? (
              <div className="py-12 text-center">
                <Wallet
                  size={32}
                  className="mx-auto mb-3 text-gray-400"
                />
                <h3 className="font-semibold text-[#172B4D] dark:text-white">
                  No Active Account Found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You need an active account to make a deposit or withdrawal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">

                {/* Account Selection */}
                <div>
                  <label
                    htmlFor="account"
                    className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-white"
                  >
                    Select Account
                  </label>

                  <select
                    id="account"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
                  >
                    <option value="">Choose an account</option>

                    {activeAccounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountNumber} -{" "}
                        {account.accountType.toUpperCase()}
                        {account.isPrimary ? " (Primary)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Account Info */}
                {selectedAccount && (
                  <div className="rounded-xl border border-[#176B87]/20 bg-[#176B87]/5 p-4 dark:bg-[#176B87]/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Account Balance
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#176B87] dark:text-[#14B8A6]">
                          {formatBDT(selectedAccount.balancePaisa)}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                        {selectedAccount.accountStatus}
                      </span>
                    </div>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-white"
                  >
                    Amount (BDT)
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                      ৳
                    </span>

                    <input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
                    />
                  </div>

                  {activeTab === "withdrawal" && selectedAccount && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Current balance:{" "}
                      {formatBDT(selectedAccount.balancePaisa)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-white"
                  >
                    Description (Optional)
                  </label>

                  <textarea
                    id="description"
                    rows={3}
                    maxLength={500}
                    placeholder={
                      activeTab === "deposit"
                        ? "Reason for deposit..."
                        : "Reason for withdrawal..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] dark:border-[#29435C] dark:bg-[#102A43] dark:text-white"
                  />
                </div>

                {/* Information */}
                <div className="flex items-start gap-3 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
                  <Clock
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />
                  <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">
                    Your {activeTab === "deposit" ? "deposit" : "withdrawal"}{" "}
                    request will remain pending until an Admin reviews and
                    approves it. Your account balance will not change before
                    approval.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !accountId || !amount}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${activeTab === "deposit"
                      ? "bg-[#14B8A6] hover:bg-[#0D9488]"
                      : "bg-[#176B87] hover:bg-[#102A43]"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Submitting Request...
                    </>
                  ) : activeTab === "deposit" ? (
                    <>
                      <ArrowDownToLine size={18} />
                      Submit Deposit Request
                    </>
                  ) : (
                    <>
                      <ArrowUpFromLine size={18} />
                      Submit Withdrawal Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
