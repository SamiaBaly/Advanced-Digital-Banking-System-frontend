
"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send,
  User,
  Receipt,
  Info,
} from "lucide-react";

import {
  useGetMyAccountsQuery,
  useTransferFundsMutation,
} from "@/redux/api/accountApi";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);

export default function CustomerTransferPage() {
  const { data, isLoading, isError, refetch } = useGetMyAccountsQuery();

  const [
    transferFunds,
    {
      isLoading: isTransferring,
      isSuccess,
      isError: transferError,
      error,
      data: transferData,
      reset,
    },
  ] = useTransferFundsMutation();

  const accounts = Array.isArray(data?.data) ? data.data : [];

  const activeAccounts = accounts.filter(
    (account) => account.accountStatus === "active"
  );

  const [senderAccountId, setSenderAccountId] = useState("");
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const selectedAccount =
    activeAccounts.find((account) => account._id === senderAccountId) ||
    activeAccounts.find((account) => account.isPrimary) ||
    activeAccounts[0];

  const amountNumber = Number(amount);
  const amountPaisa = Math.round(amountNumber * 100);

  const isValidAmount =
    amount.trim() !== "" &&
    Number.isFinite(amountNumber) &&
    amountNumber > 0 &&
    Number.isSafeInteger(amountPaisa);

  const availableBalance = selectedAccount
    ? selectedAccount.balancePaisa / 100
    : 0;

  const hasSufficientBalance =
    isValidAmount && amountNumber <= availableBalance;

  const canSubmit =
    !!selectedAccount &&
    receiverAccountNumber.trim().length > 0 &&
    isValidAmount &&
    hasSufficientBalance &&
    !isTransferring;

  const handleTransfer = async () => {
    if (!canSubmit || !selectedAccount || !confirmed) return;

    reset();

    try {
      await transferFunds({
        senderAccountId: selectedAccount._id,
        receiverAccountNumber: receiverAccountNumber.trim(),
        amountPaisa,
        description: description.trim() || undefined,
        idempotencyKey: crypto.randomUUID(),
      }).unwrap();

      setAmount("");
      setReceiverAccountNumber("");
      setDescription("");
      setConfirmed(false);

      refetch();
    } catch {
      // RTK Query error is displayed below.
    }
  };

  const getErrorMessage = () => {
    if (!transferError || !error) return "";

    if ("data" in error) {
      const response = error.data as { message?: string };
      return response?.message || "Transfer failed. Please try again.";
    }

    return "Unable to complete transfer. Please try again.";
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-7 dark:bg-[#0B1726] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
              <ArrowLeftRight size={17} />
              CUSTOMER BANKING
            </div>

            <h1 className="mt-2 text-2xl font-extrabold text-[#102A43] dark:text-white sm:text-3xl">
              Fund Transfer
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Transfer money securely to another bank account.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400">
            <ShieldCheck size={19} />
            Secure Transfer
          </div>
        </div>

        {/* Loading Accounts */}
        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#14283D]">
            <RefreshCw
              className="mx-auto animate-spin text-[#14B8A6]"
              size={32}
            />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading your accounts...
            </p>
          </div>
        )}

        {/* Account Loading Error */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-500/20 dark:bg-[#14283D]">
            <AlertCircle className="mx-auto text-red-500" size={35} />
            <h3 className="mt-3 font-bold text-[#102A43] dark:text-white">
              Unable to load accounts
            </h3>
            <button
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#176B87] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Active Account */}
        {!isLoading && !isError && activeAccounts.length === 0 && (
          <div className="rounded-2xl border border-amber-200 bg-white p-10 text-center dark:border-amber-500/20 dark:bg-[#14283D]">
            <Wallet className="mx-auto text-amber-500" size={35} />
            <h3 className="mt-3 font-bold text-[#102A43] dark:text-white">
              No Active Account Available
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You need an active bank account to transfer money.
            </p>
          </div>
        )}

        {/* Transfer Form */}
        {!isLoading && !isError && activeAccounts.length > 0 && (
          <div className="grid gap-6 xl:grid-cols-3">

            <div className="space-y-6 xl:col-span-2">

              {/* Sender Account */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:text-[#14B8A6]">
                    <Wallet size={22} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#102A43] dark:text-white">
                      Select Your Account
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose the account to transfer from.
                    </p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Sender Account
                </label>

                <select
                  value={selectedAccount?._id || ""}
                  onChange={(e) => {
                    setSenderAccountId(e.target.value);
                    reset();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm font-medium text-[#102A43] outline-none focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
                >
                  {activeAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountType.toUpperCase()} - {account.accountNumber}
                      {account.isPrimary ? " (Primary)" : ""}
                    </option>
                  ))}
                </select>

                {selectedAccount && (
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-[#102A43] to-[#176B87] p-5 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">
                        AVAILABLE BALANCE
                      </span>
                      <ShieldCheck size={20} />
                    </div>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      {formatMoney(availableBalance)}
                    </h3>

                    <p className="mt-3 text-xs tracking-wider text-white/70">
                      {selectedAccount.accountNumber}
                    </p>
                  </div>
                )}
              </section>

              {/* Receiver Details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#102A43] dark:text-white">
                      Receiver Details
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter the destination account information.
                    </p>
                  </div>
                </div>

                <label className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Receiver Account Number
                </label>

                <input
                  type="text"
                  value={receiverAccountNumber}
                  onChange={(e) => {
                    setReceiverAccountNumber(e.target.value);
                    reset();
                  }}
                  placeholder="Enter receiver account number"
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#102A43] outline-none transition focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
                />

                {/* Amount */}
                <label className="mb-2 mt-5 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Transfer Amount (BDT)
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#176B87] dark:text-[#14B8A6]">
                    ৳
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      reset();
                    }}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] py-4 pl-10 pr-4 text-lg font-bold text-[#102A43] outline-none focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
                  />
                </div>

                {amount !== "" && !isValidAmount && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Enter a valid amount greater than zero.
                  </p>
                )}

                {isValidAmount && !hasSufficientBalance && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    Insufficient available balance.
                  </p>
                )}

                {/* Description */}
                <label className="mb-2 mt-5 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Description (Optional)
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="What is this transfer for?"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#102A43] outline-none focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {description.length}/500
                </p>
              </section>

              {/* Confirmation */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
                <div className="flex items-start gap-3">
                  <input
                    id="confirm-transfer"
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#176B87]"
                  />
                  <label
                    htmlFor="confirm-transfer"
                    className="text-sm leading-6 text-slate-600 dark:text-slate-300"
                  >
                    I confirm that the receiver account number and transfer
                    amount are correct. I understand that this transaction
                    will update both account balances.
                  </label>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={!canSubmit || !confirmed}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#102A43] to-[#176B87] px-5 py-4 font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:from-[#14B8A6] dark:to-[#0D9488] dark:text-[#102A43]"
                >
                  {isTransferring ? (
                    <>
                      <RefreshCw size={19} className="animate-spin" />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <Send size={19} />
                      Confirm & Transfer
                    </>
                  )}
                </button>
              </section>
            </div>

            {/* Summary */}
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
                    <Receipt size={22} />
                  </div>
                  <h2 className="font-extrabold text-[#102A43] dark:text-white">
                    Transfer Summary
                  </h2>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      From Account
                    </span>
                    <span className="max-w-[60%] break-all text-right font-semibold text-[#102A43] dark:text-white">
                      {selectedAccount?.accountNumber || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      To Account
                    </span>
                    <span className="max-w-[60%] break-all text-right font-semibold text-[#102A43] dark:text-white">
                      {receiverAccountNumber || "—"}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-4 dark:border-white/10">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        Transfer Amount
                      </span>
                      <span className="font-bold text-[#102A43] dark:text-white">
                        {isValidAmount ? formatMoney(amountNumber) : "৳0.00"}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">
                        Transfer Fee
                      </span>
                      <span className="font-semibold text-green-600">
                        ৳0.00
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Debit
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#102A43] dark:text-white">
                      {isValidAmount ? formatMoney(amountNumber) : "৳0.00"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#176B87]/20 bg-[#176B87]/5 p-5 dark:border-[#14B8A6]/20 dark:bg-[#14B8A6]/5">
                <div className="flex items-center gap-2 font-bold text-[#176B87] dark:text-[#14B8A6]">
                  <Info size={18} />
                  Security Information
                </div>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                  <li>• Verify the receiver account number carefully.</li>
                  <li>• Never share your password or OTP.</li>
                  <li>• Transfers require an active account.</li>
                  <li>• Keep your transaction confirmation for records.</li>
                </ul>
              </section>
            </aside>
          </div>
        )}

        {/* Transfer Success */}
        {isSuccess && transferData?.data && (
          <div className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-500/20 dark:bg-[#14283D]">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="shrink-0 text-green-500" size={32} />
              <div className="min-w-0">
                <h3 className="font-extrabold text-green-600 dark:text-green-400">
                  Transfer Successful!
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {transferData.message}
                </p>
                <p className="mt-3 break-all text-sm font-semibold text-[#102A43] dark:text-white">
                  Transaction ID: {transferData.data.transactionId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Error */}
        {transferError && (
          <div className="rounded-2xl border border-red-200 bg-white p-5 dark:border-red-500/20 dark:bg-[#14283D]">
            <div className="flex items-center gap-3">
              <AlertCircle className="shrink-0 text-red-500" size={25} />
              <div>
                <h3 className="font-bold text-red-600 dark:text-red-400">
                  Transfer Failed
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {getErrorMessage()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
