
"use client";

import { useState } from "react";
import { useGetMyAccountsQuery } from "@/redux/api/accountApi";
import {
  Wallet,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Star,
  Copy,
  Check,
  TrendingUp,
  Landmark,
  ArrowUpRight,
} from "lucide-react";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);

export default function CustomerAccountsPage() {
  const { data, isLoading, isError, refetch } = useGetMyAccountsQuery();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const accounts = Array.isArray(data?.data) ? data.data : [];

  const activeAccounts = accounts.filter(
    (account) => account.accountStatus === "active"
  ).length;

  const totalBalance = accounts.reduce(
    (total, account) => total + (account.balancePaisa || 0),
    0
  );

  const primaryAccount =
    accounts.find((account) => account.isPrimary) || accounts[0];

  const handleCopy = async (accountNumber: string, id: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] px-4 py-7 dark:bg-[#0B1726] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D] sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
              <Wallet size={17} />
              CUSTOMER BANKING
            </div>

            <h1 className="mt-2 text-2xl font-extrabold text-[#102A43] dark:text-white sm:text-3xl">
              My Accounts
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage and monitor your banking accounts.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#176B87] disabled:opacity-50 dark:bg-[#14B8A6] dark:text-[#102A43]"
          >
            <RefreshCw
              size={17}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh Accounts
          </button>
        </div>

        {/* Overview */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-gradient-to-br from-[#102A43] to-[#176B87] p-5 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-white/15 p-3">
                <Wallet size={23} />
              </div>
              <ArrowUpRight size={20} className="text-white/60" />
            </div>

            <p className="mt-5 text-sm text-white/70">Total Accounts</p>
            <h2 className="mt-1 text-3xl font-extrabold">
              {isLoading ? "..." : accounts.length}
            </h2>
            <p className="mt-2 text-xs text-white/60">
              Your registered bank accounts
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-green-500/10 p-3 text-green-600">
                <ShieldCheck size={23} />
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600">
                Active
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Active Accounts
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-[#102A43] dark:text-white">
              {isLoading ? "..." : activeAccounts}
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Currently operational
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:text-[#14B8A6]">
                <TrendingUp size={23} />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                BDT
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Total Balance
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-[#102A43] dark:text-white">
              {isLoading ? "..." : formatMoney(totalBalance / 100)}
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Combined account balance
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">
                <Landmark size={23} />
              </div>
              <Star size={18} className="text-amber-500" />
            </div>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Primary Account
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#102A43] dark:text-white">
              {isLoading
                ? "..."
                : primaryAccount
                  ? primaryAccount.accountType?.replace("_", " ") || "Savings"
                  : "Not Set"}
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Your main banking account
            </p>
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

        {/* Error */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-500/20 dark:bg-[#14283D]">
            <AlertCircle className="mx-auto text-red-500" size={35} />
            <h3 className="mt-3 font-bold text-[#102A43] dark:text-white">
              Unable to load accounts
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Something went wrong while loading your accounts.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-[#176B87] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Account List */}
        {!isLoading && !isError && accounts.length > 0 && (
          <section>
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-extrabold text-[#102A43] dark:text-white">
                  Your Bank Accounts
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Account details and available balances.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#176B87]/10 px-4 py-2 text-xs font-bold text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                {accounts.length} ACCOUNT{accounts.length !== 1 ? "S" : ""}
              </span>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#14283D]"
                >
                  {/* Banking Card */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#102A43] via-[#176B87] to-[#0D9488] p-6 text-white">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full border-[25px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-24 right-24 h-52 w-52 rounded-full border-[25px] border-white/5" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/15 p-2.5">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-bold tracking-wide">
                            Digital Bank
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                            Banking Services
                          </p>
                        </div>
                      </div>

                      {account.isPrimary && (
                        <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold">
                          <Star size={13} />
                          Primary
                        </span>
                      )}
                    </div>

                    <div className="relative mt-8">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-white/60">
                        AVAILABLE BALANCE
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                        {formatMoney((account.balancePaisa || 0) / 100)}
                      </h3>
                    </div>

                    <div className="relative mt-8 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] tracking-[0.2em] text-white/60">
                          ACCOUNT NUMBER
                        </p>
                        <p className="mt-2 break-all text-base font-bold tracking-widest sm:text-lg">
                          {account.accountNumber}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleCopy(account.accountNumber, account._id)
                        }
                        title="Copy account number"
                        className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-3 transition hover:bg-white/20"
                      >
                        {copiedId === account._id ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>

                    {copiedId === account._id && (
                      <p className="relative mt-2 text-xs font-semibold text-teal-100">
                        Account number copied!
                      </p>
                    )}
                  </div>

                  {/* Account Details */}
                  <div className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="font-bold text-[#102A43] dark:text-white">
                        Account Information
                      </h3>
                      <span className="text-xs text-slate-400">
                        Account Details
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Account Type
                        </p>
                        <p className="mt-2 font-bold capitalize text-[#102A43] dark:text-white">
                          {account.accountType?.replace("_", " ") || "Savings"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Currency
                        </p>
                        <p className="mt-2 font-bold text-[#102A43] dark:text-white">
                          {account.currency || "BDT"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 px-4 py-4 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[#176B87]/10 p-2 text-[#176B87] dark:text-[#14B8A6]">
                          <ShieldCheck size={19} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Account Status
                          </p>
                          <p className="mt-1 text-sm font-bold text-[#102A43] dark:text-white">
                            {account.accountStatus}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${account.accountStatus === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : account.accountStatus === "frozen"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                      >
                        {account.accountStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && !isError && accounts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/20 dark:bg-[#14283D]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#176B87]/10 text-[#176B87] dark:text-[#14B8A6]">
              <Wallet size={32} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[#102A43] dark:text-white">
              No Bank Account Found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              You do not have any bank account yet. Your account will appear
              here after your registration is approved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
