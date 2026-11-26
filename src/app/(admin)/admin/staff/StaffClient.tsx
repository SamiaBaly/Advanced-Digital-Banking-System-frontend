
"use client";

import { useState, type FormEvent } from "react";

import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Plus,
  X,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Calendar,
  MapPin,
  Phone,
  Mail,
  IdCard,
  AlertCircle,
} from "lucide-react";

import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffStatusMutation,
  type StaffStatus,
} from "@/redux/api/staffApi";

import {
  useGetAdminStaffVerificationRequestsQuery,
  useReviewStaffVerificationMutation,
  type AdminStaffVerificationRequest,
} from "@/redux/api/adminStaffVerificationApi";

const statusStyles: Record<StaffStatus, string> = {
  active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  inactive:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  blocked:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const initialStaffForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

export default function StaffClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newStaff, setNewStaff] = useState(initialStaffForm);

  const [selectedRequest, setSelectedRequest] =
    useState<AdminStaffVerificationRequest | null>(null);

  const [rejectionReason, setRejectionReason] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetStaffQuery({
    page,
    limit: 10,
    search,
    status,
  });

  const [createStaff, { isLoading: isCreating }] =
    useCreateStaffMutation();

  const [updateStaffStatus, { isLoading: isUpdating }] =
    useUpdateStaffStatusMutation();

  const {
    data: verificationData,
    isLoading: verificationLoading,
    isFetching: verificationFetching,
    isError: verificationError,
    refetch: refetchVerification,
  } = useGetAdminStaffVerificationRequestsQuery();

  const [reviewVerification, { isLoading: isReviewing }] =
    useReviewStaffVerificationMutation();

  const staff = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination;

  const verificationRequests = Array.isArray(verificationData?.data)
    ? verificationData.data
    : [];

  const activeCount = staff.filter(
    (member) => member.userStatus === "active"
  ).length;

  const inactiveBlockedCount = staff.filter(
    (member) => member.userStatus !== "active"
  ).length;

  const verifiedCount = staff.filter(
    (member) => member.isIdentityVerified
  ).length;

  const sectionClass =
    "rounded-2xl border border-[#E2E8F0] bg-white shadow-sm dark:border-[#29445E] dark:bg-[#14283D]";

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-[#F4F7FB] px-4 py-3 text-sm text-[#172B4D] outline-none transition placeholder:text-gray-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-[#29445E] dark:bg-[#102A43] dark:text-white";

  const summaryCards = [
    {
      label: "Total Staff",
      value: pagination?.total ?? 0,
      icon: Users,
      color: "text-[#176B87]",
      bg: "bg-[#176B87]/10",
    },
    {
      label: "Active Staff",
      value: activeCount,
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Inactive / Blocked",
      value: inactiveBlockedCount,
      icon: Users,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Identity Verified",
      value: verifiedCount,
      icon: ShieldCheck,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const handleCreateStaff = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await createStaff({
        fullName: newStaff.fullName.trim(),
        email: newStaff.email.trim().toLowerCase(),
        phone: newStaff.phone.trim(),
        password: newStaff.password,
      }).unwrap();

      alert("Staff account created successfully!");

      setNewStaff(initialStaffForm);
      setShowPassword(false);
      setShowCreateModal(false);
      setPage(1);

      refetch();
    } catch (error: unknown) {
      console.error("Staff creation failed:", error);

      alert(
        getErrorMessage(
          error,
          "Failed to create staff account. Please try again."
        )
      );
    }
  };

  const closeCreateModal = () => {
    if (isCreating) return;

    setShowCreateModal(false);
    setNewStaff(initialStaffForm);
    setShowPassword(false);
  };

  const handleStatusChange = async (
    id: string,
    userStatus: StaffStatus
  ) => {
    try {
      await updateStaffStatus({ id, userStatus }).unwrap();
    } catch (error: unknown) {
      console.error("Staff status update failed:", error);

      alert(
        getErrorMessage(error, "Failed to update staff status.")
      );
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    const confirmed = window.confirm(
      `Are you sure you want to verify ${selectedRequest.fullName}?`
    );

    if (!confirmed) return;

    setReviewError("");

    try {
      await reviewVerification({
        id: selectedRequest._id,
        decision: "approved",
      }).unwrap();

      alert("Staff identity verified successfully!");

      setSelectedRequest(null);
      setShowRejectForm(false);
      setRejectionReason("");

      refetchVerification();
      refetch();
    } catch (error: unknown) {
      setReviewError(
        getErrorMessage(error, "Failed to approve verification.")
      );
    }
  };

  const handleReject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRequest) return;

    const reason = rejectionReason.trim();

    if (!reason) {
      setReviewError("Please provide a rejection reason.");
      return;
    }

    setReviewError("");

    try {
      await reviewVerification({
        id: selectedRequest._id,
        decision: "rejected",
        rejectionReason: reason,
      }).unwrap();

      alert("Verification request rejected.");

      setSelectedRequest(null);
      setShowRejectForm(false);
      setRejectionReason("");

      refetchVerification();
      refetch();
    } catch (error: unknown) {
      setReviewError(
        getErrorMessage(error, "Failed to reject verification.")
      );
    }
  };

  const closeReviewModal = () => {
    if (isReviewing) return;

    setSelectedRequest(null);
    setShowRejectForm(false);
    setRejectionReason("");
    setReviewError("");
  };

  const formatDate = (value: string | null) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 text-[#172B4D] dark:bg-[#0B1726] dark:text-[#F4F7FB] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
              <Users size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
                Staff Management
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage bank staff members and their account status
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-3 text-sm font-semibold text-[#102A43] transition hover:bg-[#0FAE9E]"
            >
              <Plus size={17} />
              Add Staff
            </button>

            <button
              type="button"
              onClick={() => {
                refetch();
                refetchVerification();
              }}
              disabled={isFetching || verificationFetching}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
            >
              <RefreshCw
                size={16}
                className={
                  isFetching || verificationFetching
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`${sectionClass} p-5`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`shrink-0 rounded-xl p-3 ${item.bg} ${item.color}`}
                  >
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pending Verification Requests */}
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="flex flex-col justify-between gap-3 border-b border-[#E2E8F0] p-5 dark:border-[#29445E] sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                <FileCheck size={23} />
              </div>

              <div>
                <h2 className="font-bold">
                  Pending Verification Requests
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Review staff identity information and approve or reject requests.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              {verificationRequests.length} Pending
            </span>
          </div>

          {verificationLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw size={17} className="animate-spin" />
              Loading verification requests...
            </div>
          ) : verificationError ? (
            <div className="p-10 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={30} />

              <p className="text-sm font-medium text-red-500">
                Failed to load verification requests.
              </p>

              <button
                type="button"
                onClick={() => refetchVerification()}
                className="mt-4 rounded-xl bg-[#176B87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#102A43]"
              >
                Try Again
              </button>
            </div>
          ) : verificationRequests.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle2
                size={35}
                className="mx-auto mb-3 text-green-500"
              />

              <p className="font-semibold">
                No Pending Verification Requests
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                New staff verification requests will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#F4F7FB] text-xs uppercase text-gray-500 dark:bg-[#102A43] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Staff Member</th>
                    <th className="px-5 py-4">Employee ID</th>
                    <th className="px-5 py-4">Submitted</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#29445E]">
                  {verificationRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="transition hover:bg-[#F4F7FB]/70 dark:hover:bg-[#102A43]/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {request.fullName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {request.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {request.staffVerification.employeeId}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(
                          request.staffVerification.submittedAt
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <Clock size={13} />
                          Pending
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewError("");
                            setShowRejectForm(false);
                            setRejectionReason("");
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#176B87] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#102A43] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
                        >
                          <Eye size={15} />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Search and Filters */}
        <section className={`${sectionClass} p-5`}>
          <div className="mb-4">
            <h2 className="font-bold">Search & Filters</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Find staff members by name, email, phone or status
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search staff name, email or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-[#29445E] dark:bg-[#102A43]"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] px-3 py-3 text-sm outline-none transition focus:border-[#14B8A6] dark:border-[#29445E] dark:bg-[#102A43]"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </section>

        {/* Staff Table */}
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="flex flex-col justify-between gap-2 border-b border-[#E2E8F0] p-5 dark:border-[#29445E] sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">All Staff Members</h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Bank staff accounts and information
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#176B87]/10 px-3 py-1.5 text-xs font-semibold text-[#176B87] dark:text-[#14B8A6]">
              {pagination?.total ?? 0} Staff
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw size={17} className="animate-spin" />
              Loading staff...
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-sm font-medium text-red-500">
                Failed to load staff.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-[#176B87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#102A43]"
              >
                Try Again
              </button>
            </div>
          ) : staff.length === 0 ? (
            <div className="p-12 text-center">
              <Users
                size={35}
                className="mx-auto mb-3 text-gray-400"
              />

              <p className="font-semibold">
                No staff members found
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-[#F4F7FB] text-xs uppercase text-gray-500 dark:bg-[#102A43] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Staff Member</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Identity</th>
                    <th className="px-5 py-4">Last Login</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Update Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#29445E]">
                  {staff.map((member) => (
                    <tr
                      key={member._id}
                      className="transition hover:bg-[#F4F7FB]/70 dark:hover:bg-[#102A43]/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {member.fullName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {member.phone || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#176B87]/10 px-3 py-1 text-xs font-semibold text-[#176B87] dark:text-[#14B8A6]">
                          Bank Staff
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {member.isIdentityVerified ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
                            <ShieldCheck size={15} />
                            Verified
                          </span>
                        ) : (
                          <span className="font-medium text-amber-600 dark:text-amber-400">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {member.lastLoginAt
                          ? new Date(member.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[member.userStatus]}`}
                        >
                          {member.userStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={member.userStatus}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              member._id,
                              e.target.value as StaffStatus
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-[#14B8A6] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#29445E] dark:bg-[#102A43]"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-3 border-t border-[#E2E8F0] p-4 dark:border-[#29445E] sm:flex-row sm:items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination?.page ?? page} of{" "}
              {pagination?.totalPages ?? 1}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || isFetching}
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium transition hover:bg-[#F4F7FB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#102A43]"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                disabled={
                  !pagination ||
                  page >= pagination.totalPages ||
                  isFetching
                }
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium transition hover:bg-[#F4F7FB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#102A43]"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Add Staff Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCreateModal();
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5 dark:border-[#29445E]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
                  <UserCheck size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
                    Add New Staff
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Create a new bank staff account
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500 disabled:opacity-50 dark:hover:bg-[#102A43]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <input
                  required
                  type="text"
                  maxLength={100}
                  value={newStaff.fullName}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      fullName: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      email: e.target.value,
                    })
                  }
                  placeholder="staff@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone Number
                </label>

                <input
                  required
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) =>
                    setNewStaff({
                      ...newStaff,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    value={newStaff.password}
                    onChange={(e) =>
                      setNewStaff({
                        ...newStaff,
                        password: e.target.value,
                      })
                    }
                    placeholder="Minimum 8 characters"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-[#14B8A6] dark:text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Password must contain at least 8 characters.
                </p>
              </div>

              <div className="rounded-xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-4 dark:bg-[#14B8A6]/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-[#14B8A6]"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Account Information
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Role: Bank Staff
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Initial Status: Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 dark:border-[#29445E] sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-[#29445E] dark:text-gray-300 dark:hover:bg-[#102A43]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3 text-sm font-bold text-[#102A43] transition hover:bg-[#0FAE9E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Staff Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl dark:border-[#29445E] dark:bg-[#14283D]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-5 dark:border-[#29445E]">
              <div>
                <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
                  Staff Verification Review
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Review submitted identity information
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                disabled={isReviewing}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-500 disabled:opacity-50 dark:hover:bg-[#102A43]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
              <div>
                <h3 className="mb-3 text-sm font-bold text-[#176B87] dark:text-[#14B8A6]">
                  Staff Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Users size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Full Name
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold">
                        {selectedRequest.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IdCard size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Employee ID
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.staffVerification.employeeId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 dark:border-[#29445E]">
                <h3 className="mb-3 text-sm font-bold text-[#176B87] dark:text-[#14B8A6]">
                  Identity Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <IdCard size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        NID Number
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.staffVerification.nidNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Date of Birth
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatDate(
                          selectedRequest.staffVerification.dateOfBirth
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Present Address
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.staffVerification.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <Clock size={18} className="mt-0.5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Request Submitted
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {selectedRequest.staffVerification.submittedAt
                          ? new Date(
                            selectedRequest.staffVerification.submittedAt
                          ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {showRejectForm && (
                <form
                  onSubmit={handleReject}
                  className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20"
                >
                  <label className="block text-sm font-bold text-red-700 dark:text-red-400">
                    Rejection Reason
                  </label>

                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this verification request is rejected..."
                    rows={3}
                    maxLength={500}
                    required
                    className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-red-400 dark:border-red-900 dark:bg-[#0B1726] dark:text-white"
                  />

                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={isReviewing}
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason("");
                        setReviewError("");
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isReviewing || !rejectionReason.trim()}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isReviewing && (
                        <RefreshCw size={15} className="animate-spin" />
                      )}
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              )}

              {reviewError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  <AlertCircle size={17} />
                  {reviewError}
                </div>
              )}
            </div>

            {!showRejectForm && (
              <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] p-5 dark:border-[#29445E] sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isReviewing}
                  onClick={() => setShowRejectForm(true)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <XCircle size={17} />
                  Reject
                </button>

                <button
                  type="button"
                  disabled={isReviewing}
                  onClick={handleApprove}
                  className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {isReviewing ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                  Approve & Verify
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
