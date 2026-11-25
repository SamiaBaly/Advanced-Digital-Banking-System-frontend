
"use client";

import { useState } from "react";

import {
  useGetBankSettingsQuery,
  useUpdateBankSettingsMutation,
} from "@/redux/api/settingsApi";

import type { UpdateSettingsRequest } from "@/redux/api/settingsApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(paisa / 100);

const toPaisa = (taka: string) => {
  const value = Number(taka);

  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  const paisa = Math.round(value * 100);

  return Number.isSafeInteger(paisa) ? paisa : null;
};

const inputClass =
  "w-full rounded-xl border border-[#D9E2EC] bg-white px-4 py-3 text-sm text-[#172B4D] outline-none transition focus:border-[#176B87] focus:ring-2 focus:ring-[#176B87]/15 dark:border-[#29445F] dark:bg-[#102A43] dark:text-[#F4F7FB]";

const cardClass =
  "rounded-2xl border border-[#E3EAF2] bg-white p-5 shadow-sm dark:border-[#29445F] dark:bg-[#14283D] sm:p-6";

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-[#172B4D] dark:text-[#F4F7FB]">
          {label}
        </p>

        <p className="mt-1 text-sm text-[#627D98] dark:text-[#9FB3C8]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked
            ? "bg-[#14B8A6]"
            : "bg-[#9FB3C8] dark:bg-[#486581]"
          }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"
            }`}
        />
      </button>
    </div>
  );
}

export default function SettingsClient() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetBankSettingsQuery();

  const [updateSettings, { isLoading: isSaving }] =
    useUpdateBankSettingsMutation();

  const settings = data?.data;

  // Local form state: null means use the latest API value.
  const [dailyLimit, setDailyLimit] = useState<string | null>(null);
  const [singleLimit, setSingleLimit] = useState<string | null>(null);
  const [minimumBalance, setMinimumBalance] = useState<string | null>(null);
  const [transferFee, setTransferFee] = useState<string | null>(null);

  const [allowTransfers, setAllowTransfers] = useState<boolean | null>(null);
  const [allowNewAccounts, setAllowNewAccounts] = useState<boolean | null>(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Derive initial values from API data without useEffect.
  const currentDailyLimit =
    dailyLimit ??
    String((settings?.dailyTransferLimitPaisa ?? 50000000) / 100);

  const currentSingleLimit =
    singleLimit ??
    String((settings?.maxSingleTransactionPaisa ?? 10000000) / 100);

  const currentMinimumBalance =
    minimumBalance ??
    String((settings?.minimumAccountBalancePaisa ?? 0) / 100);

  const currentTransferFee =
    transferFee ??
    String((settings?.transferFeePaisa ?? 0) / 100);

  const currentAllowTransfers =
    allowTransfers ?? settings?.allowTransfers ?? true;

  const currentAllowNewAccounts =
    allowNewAccounts ?? settings?.allowNewAccounts ?? true;

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const daily = toPaisa(currentDailyLimit);
    const single = toPaisa(currentSingleLimit);
    const minimum = toPaisa(currentMinimumBalance);
    const fee = toPaisa(currentTransferFee);

    if (
      daily === null ||
      single === null ||
      minimum === null ||
      fee === null
    ) {
      setErrorMessage("Please enter valid non-negative amounts.");
      return;
    }

    if (single > daily) {
      setErrorMessage(
        "Maximum single transaction cannot exceed the daily transfer limit."
      );
      return;
    }

    const payload: UpdateSettingsRequest = {
      dailyTransferLimitPaisa: daily,
      maxSingleTransactionPaisa: single,
      minimumAccountBalancePaisa: minimum,
      transferFeePaisa: fee,
      allowTransfers: currentAllowTransfers,
      allowNewAccounts: currentAllowNewAccounts,
    };

    try {
      const result = await updateSettings(payload).unwrap();

      // Clear local overrides so the latest API values are displayed.
      setDailyLimit(null);
      setSingleLimit(null);
      setMinimumBalance(null);
      setTransferFee(null);
      setAllowTransfers(null);
      setAllowNewAccounts(null);

      setMessage(
        result.message || "Settings updated successfully."
      );
    } catch (error) {
      const apiError = error as {
        data?: { message?: string };
      };

      setErrorMessage(
        apiError.data?.message || "Failed to update settings."
      );
    }
  };

  const handleReset = () => {
    setDailyLimit(null);
    setSingleLimit(null);
    setMinimumBalance(null);
    setTransferFee(null);
    setAllowTransfers(null);
    setAllowNewAccounts(null);

    setMessage("");
    setErrorMessage("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-9 w-64 rounded-lg bg-[#D9E2EC] dark:bg-[#29445F]" />
          <div className="h-64 rounded-2xl bg-white dark:bg-[#14283D]" />
          <div className="h-64 rounded-2xl bg-white dark:bg-[#14283D]" />
        </div>
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900 dark:bg-[#14283D]">
          <h2 className="text-lg font-bold text-[#172B4D] dark:text-[#F4F7FB]">
            Unable to load bank settings
          </h2>

          <p className="mt-2 text-sm text-[#627D98] dark:text-[#9FB3C8]">
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-[#176B87] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102A43]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 text-[#172B4D] dark:text-[#F4F7FB]">

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
              ADMINISTRATION
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Bank Settings
            </h1>

            <p className="mt-2 text-sm text-[#627D98] dark:text-[#9FB3C8]">
              Manage bank-wide transaction rules and account controls.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#D9E2EC] bg-white px-4 py-2.5 text-sm dark:border-[#29445F] dark:bg-[#14283D]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]" />
            <span className="font-medium">Global Configuration</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Daily Transfer Limit",
              value: formatBDT(settings.dailyTransferLimitPaisa),
              icon: "↗",
            },
            {
              label: "Single Transaction Limit",
              value: formatBDT(settings.maxSingleTransactionPaisa),
              icon: "⇄",
            },
            {
              label: "Minimum Balance",
              value: formatBDT(settings.minimumAccountBalancePaisa),
              icon: "৳",
            },
            {
              label: "Transfer Fee",
              value: formatBDT(settings.transferFeePaisa),
              icon: "⌁",
            },
          ].map((item) => (
            <div key={item.label} className={cardClass}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#627D98] dark:text-[#9FB3C8]">
                  {item.label}
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F6F5] text-lg font-bold text-[#176B87] dark:bg-[#103D48] dark:text-[#14B8A6]">
                  {item.icon}
                </span>
              </div>

              <p className="mt-4 break-words text-xl font-bold">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Transaction Limits */}
          <section className={cardClass}>
            <div className="mb-6">
              <h2 className="text-lg font-bold">
                Transaction Limits & Fees
              </h2>

              <p className="mt-1 text-sm text-[#627D98] dark:text-[#9FB3C8]">
                Configure the financial limits applied across the bank.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold">
                  Daily Transfer Limit (BDT)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentDailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className={inputClass}
                  required
                />

                <span className="block text-xs text-[#829AB1]">
                  Maximum total transfer amount per day.
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">
                  Maximum Single Transaction (BDT)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentSingleLimit}
                  onChange={(e) => setSingleLimit(e.target.value)}
                  className={inputClass}
                  required
                />

                <span className="block text-xs text-[#829AB1]">
                  Maximum amount allowed in one transaction.
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">
                  Minimum Account Balance (BDT)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentMinimumBalance}
                  onChange={(e) => setMinimumBalance(e.target.value)}
                  className={inputClass}
                  required
                />

                <span className="block text-xs text-[#829AB1]">
                  Minimum balance customers must maintain.
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold">
                  Transfer Fee (BDT)
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentTransferFee}
                  onChange={(e) => setTransferFee(e.target.value)}
                  className={inputClass}
                  required
                />

                <span className="block text-xs text-[#829AB1]">
                  Standard fee charged for each transfer.
                </span>
              </label>
            </div>
          </section>

          {/* Bank Operations */}
          <section className={cardClass}>
            <div className="mb-6">
              <h2 className="text-lg font-bold">
                Bank Operations
              </h2>

              <p className="mt-1 text-sm text-[#627D98] dark:text-[#9FB3C8]">
                Enable or disable important banking operations.
              </p>
            </div>

            <div className="divide-y divide-[#E3EAF2] dark:divide-[#29445F]">
              <div className="py-4 first:pt-0">
                <Toggle
                  label="Allow Transfers"
                  description="Allow customers to send and receive money."
                  checked={currentAllowTransfers}
                  onChange={setAllowTransfers}
                />
              </div>

              <div className="py-4 last:pb-0">
                <Toggle
                  label="Allow New Accounts"
                  description="Allow eligible customers to open new bank accounts."
                  checked={currentAllowNewAccounts}
                  onChange={setAllowNewAccounts}
                />
              </div>
            </div>
          </section>

          {/* Success Message */}
          {message && (
            <div
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
            >
              {message}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            >
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[#D9E2EC] bg-white px-6 py-3 text-sm font-semibold text-[#486581] transition hover:bg-[#F4F7FB] dark:border-[#29445F] dark:bg-[#14283D] dark:text-[#BCCCDC] dark:hover:bg-[#102A43]"
            >
              Reset Changes
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#176B87] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* Last Updated */}
        <p className="text-right text-xs text-[#829AB1]">
          Last updated:{" "}
          {new Date(settings.updatedAt).toLocaleString("en-BD")}
        </p>
      </div>
    </div>
  );
}
