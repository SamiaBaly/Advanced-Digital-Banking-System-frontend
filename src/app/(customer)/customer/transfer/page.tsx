
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
  X,
  ArrowRight,
  LockKeyhole,
  Info,
  ArrowDownLeft,
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
  const [showTransferModal, setShowTransferModal] = useState(false);

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

  const isReceiverValid =
    receiverAccountNumber.trim().length > 0 &&
    receiverAccountNumber.trim() !== selectedAccount?.accountNumber;

  const canTransfer =
    !!selectedAccount &&
    isValidAmount &&
    hasSufficientBalance &&
    isReceiverValid &&
    confirmed &&
    !isTransferring;

  const handleOpenModal = () => {
    if (!selectedAccount) return;

    reset();
    setReceiverAccountNumber("");
    setAmount("");
    setDescription("");
    setConfirmed(false);
    setShowTransferModal(true);
  };

  const handleCloseModal = () => {
    if (isTransferring) return;

    setShowTransferModal(false);
    setReceiverAccountNumber("");
    setAmount("");
    setDescription("");
    setConfirmed(false);
  };

  const handleTransfer = async () => {
    if (!canTransfer || !selectedAccount) return;

    try {
      await transferFunds({
        senderAccountId: selectedAccount._id,
        receiverAccountNumber: receiverAccountNumber.trim(),
        amountPaisa,
        description: description.trim() || undefined,
        idempotencyKey: crypto.randomUUID(),
      }).unwrap();

      setShowTransferModal(false);
      setAmount("");
      setReceiverAccountNumber("");
      setDescription("");
      setConfirmed(false);
      setSenderAccountId("");

      refetch();
    } catch {
      // Error is displayed in the modal.
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
    <>
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

          {/* Loading */}
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

          {/* Account Error */}
          {isError && !isLoading && (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-500/20 dark:bg-[#14283D]">
              <AlertCircle className="mx-auto text-red-500" size={35} />
              <h3 className="mt-3 font-bold text-[#102A43] dark:text-white">
                Unable to load accounts
              </h3>
              <button
                type="button"
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

          {/* Main Page - Sender Account Only */}
          {!isLoading && !isError && activeAccounts.length > 0 && (
            <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D] lg:col-span-2">
                <div className="mb-6 flex items-center gap-3">
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
                      {account.accountType.toUpperCase()} -{" "}
                      {account.accountNumber}
                      {account.isPrimary ? " (Primary)" : ""}
                    </option>
                  ))}
                </select>

                {selectedAccount && (
                  <div className="mt-5 rounded-xl bg-gradient-to-br from-[#102A43] to-[#176B87] p-6 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/70">
                        AVAILABLE BALANCE
                      </span>
                      <ShieldCheck size={21} />
                    </div>

                    <h3 className="mt-2 text-3xl font-extrabold">
                      {formatMoney(availableBalance)}
                    </h3>

                    <p className="mt-3 text-xs tracking-wider text-white/70">
                      {selectedAccount.accountNumber}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOpenModal}
                  disabled={!selectedAccount}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#102A43] to-[#176B87] px-5 py-4 font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:from-[#14B8A6] dark:to-[#0D9488] dark:text-[#102A43]"
                >
                  <ArrowLeftRight size={19} />
                  Start Transfer
                  <ArrowRight size={18} />
                </button>
              </section>

              {/* Security Information */}
              <aside className="space-y-5">
                <section className="rounded-2xl border border-[#176B87]/20 bg-[#176B87]/5 p-5 dark:border-[#14B8A6]/20 dark:bg-[#14B8A6]/5">
                  <div className="flex items-center gap-2 font-bold text-[#176B87] dark:text-[#14B8A6]">
                    <Info size={18} />
                    Security Information
                  </div>

                  <ul className="mt-3 space-y-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                    <li>• Verify the receiver account number carefully.</li>
                    <li>• Never share your password or OTP.</li>
                    <li>• Transfers require an active account.</li>
                    <li>• Keep your transaction confirmation for records.</li>
                  </ul>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                      <LockKeyhole size={21} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#102A43] dark:text-white">
                        Secure Banking
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Review your transfer details before confirming.
                      </p>
                    </div>
                  </div>
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

        </div>
      </div>

      {/* COMPLETE TRANSFER MODAL */}
      {showTransferModal && selectedAccount && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#071321]/85 p-3 backdrop-blur-sm sm:p-5"
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="transfer-modal-title"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14283D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#102A43] to-[#176B87] px-6 py-6 text-white">
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[20px] border-white/5" />
              <div className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full border-[18px] border-white/5" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div className="mb-3 inline-flex rounded-xl bg-white/15 p-3">
                    <ArrowLeftRight size={24} />
                  </div>

                  <h2
                    id="transfer-modal-title"
                    className="text-xl font-extrabold sm:text-2xl"
                  >
                    Complete Fund Transfer
                  </h2>

                  <p className="mt-1 text-sm text-white/70">
                    Enter receiver details and review your transaction.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isTransferring}
                  onClick={handleCloseModal}
                  className="rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-40"
                  aria-label="Close modal"
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6">

              {/* Sender Account */}
              <section className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <div className="mb-3 flex items-center gap-2">
                  <Wallet size={19} className="text-[#14B8A6]" />
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    Sender Account
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="break-all text-sm font-bold text-[#102A43] dark:text-white">
                      {selectedAccount.accountNumber}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                      {selectedAccount.accountType} Account
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Available Balance
                    </p>
                    <p className="mt-1 font-bold text-green-600 dark:text-green-400">
                      {formatMoney(availableBalance)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Receiver Details */}
              <section className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <div className="mb-4 flex items-center gap-2">
                  <User size={19} className="text-[#14B8A6]" />
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    Receiver Details
                  </h3>
                </div>

                <label className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Receiver Account Number
                </label>

                <input
                  type="text"
                  autoFocus
                  value={receiverAccountNumber}
                  disabled={isTransferring}
                  onChange={(e) => {
                    setReceiverAccountNumber(e.target.value);
                    reset();
                  }}
                  placeholder="Enter receiver account number"
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#102A43] outline-none transition focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
                />

                {receiverAccountNumber.trim() === "" && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    Please enter receiver account number.
                  </p>
                )}

                {receiverAccountNumber.trim() !== "" &&
                  receiverAccountNumber.trim() === selectedAccount.accountNumber && (
                    <p className="mt-2 text-xs text-red-500">
                      You cannot transfer money to your own account.
                    </p>
                  )}
              </section>

              {/* Amount */}
              <section className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt size={19} className="text-[#14B8A6]" />
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    Transfer Information
                  </h3>
                </div>

                <label className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
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
                    disabled={isTransferring}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      reset();
                    }}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] py-3.5 pl-10 pr-4 text-lg font-bold text-[#102A43] outline-none focus:border-[#176B87] dark:border-white/10 dark:bg-[#0B1726] dark:text-white"
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

                <label className="mb-2 mt-5 block text-sm font-semibold text-[#102A43] dark:text-slate-200">
                  Description (Optional)
                </label>

                <textarea
                  value={description}
                  disabled={isTransferring}
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

              {/* Transfer Summary */}
              <section className="rounded-xl bg-[#F4F7FB] p-5 dark:bg-[#0B1726]">
                <div className="mb-4 flex items-center gap-2">
                  <Receipt size={19} className="text-[#14B8A6]" />
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    Transfer Summary
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      From Account
                    </span>
                    <span className="max-w-[60%] break-all text-right font-semibold text-[#102A43] dark:text-white">
                      {selectedAccount.accountNumber}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500 dark:text-slate-400">
                      To Account
                    </span>
                    <span className="max-w-[60%] break-all text-right font-semibold text-[#102A43] dark:text-white">
                      {receiverAccountNumber.trim() || "—"}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-slate-300 pt-3 dark:border-white/10">
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

                  <div className="rounded-xl bg-white p-4 dark:bg-[#14283D]">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total Debit
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-[#102A43] dark:text-white">
                      {isValidAmount ? formatMoney(amountNumber) : "৳0.00"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Confirmation */}
              <div className="flex items-start gap-3 rounded-xl border border-[#176B87]/20 bg-[#176B87]/5 p-4 dark:border-[#14B8A6]/20 dark:bg-[#14B8A6]/5">
                <input
                  id="confirm-transfer"
                  type="checkbox"
                  checked={confirmed}
                  disabled={isTransferring}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#14B8A6]"
                />

                <label
                  htmlFor="confirm-transfer"
                  className="text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                  I confirm that the sender, receiver and transfer amount are
                  correct. I understand that this transaction will update both
                  account balances.
                </label>
              </div>

              {/* Warning */}
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                <LockKeyhole
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
                />
                <p className="text-xs leading-5 text-amber-800 dark:text-amber-300">
                  Verify the receiver account number carefully. Never share
                  your password or OTP.
                </p>
              </div>

              {/* Transfer Error */}
              {transferError && (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                  <AlertCircle className="shrink-0 text-red-500" size={21} />
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">
                      Transfer Failed
                    </p>
                    <p className="mt-1 text-xs text-red-600 dark:text-red-300">
                      {getErrorMessage()}
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isTransferring}
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-[#0B1726]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleTransfer}
                  disabled={!canTransfer}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#102A43] to-[#176B87] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:from-[#14B8A6] dark:to-[#0D9488] dark:text-[#102A43]"
                >
                  {isTransferring ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Confirm & Transfer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
