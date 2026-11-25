
"use client";

import { useState, type FormEvent } from "react";
import {
  Search,
  Wallet,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountStatusMutation,
  type Account,
} from "@/redux/api/accountApi";
import { useGetCustomersQuery } from "@/redux/api/customerApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(paisa / 100);

export default function AccountsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("");

  // Create account form state
  const [ownerId, setOwnerId] = useState("");
  const [accountType, setAccountType] =
    useState<Account["accountType"]>("savings");
  const [branchName, setBranchName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAccountsQuery({
    page,
    limit: 10,
    search,
    status,
    accountType: accountTypeFilter,
  });

  const {
    data: customerData,
    isLoading: isCustomersLoading,
  } = useGetCustomersQuery({
    page: 1,
    limit: 100,
    search: "",
    status: "active",
  });

  const [createAccount, { isLoading: isCreating }] =
    useCreateAccountMutation();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAccountStatusMutation();

  const customers = customerData?.customers ?? [];
  const accounts = data?.data?.accounts ?? [];
  const pagination = data?.data?.pagination;

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormMessage("");
    setFormError(false);

    if (!ownerId) {
      setFormMessage("Please select a customer.");
      setFormError(true);
      return;
    }

    try {
      const response = await createAccount({
        ownerId,
        accountType,
        branchName: branchName.trim(),
      }).unwrap();

      setFormMessage(
        response.message || "Account created successfully."
      );
      setFormError(false);

      setOwnerId("");
      setAccountType("savings");
      setBranchName("");
      setPage(1);

      refetch();
    } catch (error) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : "Account creation failed. Please try again.";

      setFormMessage(message);
      setFormError(true);
    }
  };

  const handleStatusChange = async (
    account: Account,
    accountStatus: Account["accountStatus"]
  ) => {
    if (accountStatus === account.accountStatus) return;

    try {
      await updateStatus({
        id: account._id,
        accountStatus,
      }).unwrap();
    } catch {
      alert("Account status update failed.");
    }
  };

  const statusStyle: Record<Account["accountStatus"], string> = {
    active:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    frozen:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    blocked:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    closed:
      "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
              Account Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage and monitor customer bank accounts.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14596F] disabled:opacity-50 dark:bg-[#14B8A6] dark:text-[#102A43]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Create Account Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-[#176B87]/10 p-3 dark:bg-[#14B8A6]/10">
              <PlusCircle
                size={22}
                className="text-[#176B87] dark:text-[#14B8A6]"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
                Create New Account
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Open a new bank account for an active customer.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">

              {/* Customer */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-slate-200">
                  Select Customer
                </label>

                <select
                  required
                  value={ownerId}
                  onChange={(event) => setOwnerId(event.target.value)}
                  disabled={isCustomersLoading || customers.length === 0}
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] disabled:opacity-60 dark:border-white/10 dark:bg-[#102A43] dark:text-white"
                >
                  <option value="">
                    {isCustomersLoading
                      ? "Loading customers..."
                      : customers.length === 0
                        ? "No active customers available"
                        : "Choose a customer"}
                  </option>

                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.fullName} - {customer.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Type */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-slate-200">
                  Account Type
                </label>

                <select
                  value={accountType}
                  onChange={(event) =>
                    setAccountType(
                      event.target.value as Account["accountType"]
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
                >
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-slate-200">
                  Branch Name
                </label>

                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={(event) => setBranchName(event.target.value)}
                  placeholder="Enter branch name"
                  className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] placeholder:text-slate-400 outline-none transition focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 dark:border-white/10 dark:bg-[#102A43] dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {formMessage && (
              <p
                className={`rounded-lg px-4 py-3 text-sm ${formError
                    ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  }`}
              >
                {formMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New accounts will be created with a zero balance.
              </p>

              <button
                type="submit"
                disabled={isCreating || isCustomersLoading || customers.length === 0}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14596F] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#14B8A6] dark:text-[#102A43]"
              >
                <PlusCircle size={17} />
                {isCreating ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Accounts
              </p>
              <Wallet className="text-[#176B87] dark:text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#102A43] dark:text-white">
              {pagination?.total ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active Accounts on This Page
              </p>
              <ShieldCheck className="text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#102A43] dark:text-white">
              {accounts.filter(
                (account) => account.accountStatus === "active"
              ).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D] sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Balance on This Page
              </p>
              <Wallet className="text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-[#102A43] dark:text-white">
              {formatBDT(
                accounts.reduce(
                  (total, account) => total + account.balancePaisa,
                  0
                )
              )}
            </p>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search account number or customer..."
                className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] py-3 pl-10 pr-4 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
              />
            </div>

            <select
              value={accountTypeFilter}
              onChange={(event) => {
                setAccountTypeFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Account Types</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="business">Business</option>
            </select>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="frozen">Frozen</option>
              <option value="blocked">Blocked</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <th className="px-4 py-4">Account Number</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Balance</th>
                  <th className="px-4 py-4">Branch</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-500">
                      Loading accounts...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-red-500">
                      Failed to load accounts.
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr
                      key={account._id}
                      className="border-b border-slate-100 text-sm last:border-0 dark:border-white/5"
                    >
                      <td className="px-4 py-4 font-semibold text-[#176B87] dark:text-[#14B8A6]">
                        {account.accountNumber}
                        {account.isPrimary && (
                          <span className="ml-2 text-[10px] text-[#14B8A6]">
                            Primary
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#102A43] dark:text-white">
                        {account.owner?.fullName ?? "Unknown"}
                        <p className="mt-1 text-xs font-normal text-slate-500 dark:text-slate-400">
                          {account.owner?.email ?? "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-4 capitalize text-slate-600 dark:text-slate-300">
                        {account.accountType}
                      </td>

                      <td className="px-4 py-4 font-semibold text-[#102A43] dark:text-white">
                        {formatBDT(account.balancePaisa)}
                      </td>

                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {account.branchName || "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[account.accountStatus]}`}
                        >
                          {account.accountStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={account.accountStatus}
                          disabled={isUpdating}
                          onChange={(event) =>
                            handleStatusChange(
                              account,
                              event.target.value as Account["accountStatus"]
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-[#172B4D] outline-none dark:border-white/10 dark:bg-[#102A43] dark:text-white"
                        >
                          <option value="active">Active</option>
                          <option value="frozen">Frozen</option>
                          <option value="blocked">Blocked</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {accounts.length} of {pagination?.total ?? 0} accounts
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((previous) => previous - 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-white"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm text-[#172B4D] dark:text-white">
                {page} / {pagination?.totalPages || 1}
              </span>

              <button
                disabled={
                  page >= (pagination?.totalPages || 1) || isFetching
                }
                onClick={() => setPage((previous) => previous + 1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40 dark:border-white/10 dark:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
