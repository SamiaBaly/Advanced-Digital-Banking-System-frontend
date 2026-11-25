
"use client";

import { useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import {
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
  useApproveCustomerMutation,
  useRejectCustomerMutation,
  type Customer,
} from "@/redux/api/customerApi";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCustomersQuery({
    page,
    limit: 10,
    search,
    status,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateCustomerStatusMutation();

  const [approveCustomer, { isLoading: isApproving }] =
    useApproveCustomerMutation();

  const [rejectCustomer, { isLoading: isRejecting }] =
    useRejectCustomerMutation();

  const isProcessing = isUpdating || isApproving || isRejecting;

  const handleStatusChange = async (
    customer: Customer,
    userStatus: "active" | "inactive" | "blocked"
  ) => {
    try {
      await updateStatus({
        id: customer._id,
        userStatus,
      }).unwrap();
    } catch {
      alert("Customer status update failed.");
    }
  };

  const handleApprove = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Approve ${customer.fullName} and create a Savings Account?`
    );

    if (!confirmed) return;

    try {
      const result = await approveCustomer(customer._id).unwrap();

      alert(
        `Customer approved successfully!\nAccount Number: ${result.data.account.accountNumber}`
      );
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data
          ? String(error.data.message)
          : "Customer approval failed.";

      alert(message);
    }
  };

  const handleReject = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to reject ${customer.fullName}'s registration?`
    );

    if (!confirmed) return;

    try {
      await rejectCustomer(customer._id).unwrap();
      alert("Customer registration rejected successfully.");
    } catch {
      alert("Customer rejection failed.");
    }
  };

  const customers = data?.customers ?? [];
  const pagination = data?.pagination;

  const statusStyle: Record<Customer["userStatus"], string> = {
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    active:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    inactive:
      "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
    blocked:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage customers and approve new registrations.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-xl bg-[#176B87] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14596F] dark:bg-[#14B8A6] dark:text-[#102A43]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Customers
              </p>
              <Users className="text-[#176B87] dark:text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#102A43] dark:text-white">
              {pagination?.total ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Verified Customers
              </p>
              <ShieldCheck className="text-[#14B8A6]" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-[#102A43] dark:text-white">
              {customers.filter((customer) => customer.isIdentityVerified).length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#14283D]">
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
                placeholder="Search name, email or phone..."
                className="w-full rounded-xl border border-slate-200 bg-[#F4F7FB] py-3 pl-10 pr-4 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#102A43] dark:text-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Verification</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading || isFetching ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-red-500">
                      Failed to load customers.
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-slate-100 text-sm last:border-0 dark:border-white/5"
                    >
                      <td className="px-4 py-4 font-semibold text-[#102A43] dark:text-white">
                        {customer.fullName}
                      </td>

                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {customer.email}
                      </td>

                      <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                        {customer.phone}
                      </td>

                      <td className="px-4 py-4">
                        <span className={customer.isIdentityVerified ? "text-green-600" : "text-amber-600"}>
                          {customer.isIdentityVerified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle[customer.userStatus]}`}>
                          {customer.userStatus}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {customer.userStatus === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(customer)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check size={14} />
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(customer)}
                              disabled={isProcessing}
                              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <select
                            value={customer.userStatus}
                            disabled={isProcessing}
                            onChange={(event) =>
                              handleStatusChange(
                                customer,
                                event.target.value as "active" | "inactive" | "blocked"
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-[#172B4D] outline-none dark:border-white/10 dark:bg-[#102A43] dark:text-white"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {customers.length} of {pagination?.total ?? 0} customers
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
                disabled={page >= (pagination?.totalPages || 1) || isFetching}
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
