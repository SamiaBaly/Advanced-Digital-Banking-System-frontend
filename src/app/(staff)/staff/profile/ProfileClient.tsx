
"use client";

import { useState, type FormEvent } from "react";
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Save,
  Pencil,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send,
  Mail,
  Phone,
  CalendarDays,
  BriefcaseBusiness,
  BadgeCheck,
} from "lucide-react";

import {
  useGetStaffProfileQuery,
  useUpdateStaffProfileMutation,
} from "@/redux/api/staffProfileApi";

import {
  useGetStaffVerificationQuery,
  useSubmitStaffVerificationMutation,
} from "@/redux/api/staffVerificationApi";

export default function ProfileClient() {
  const { data: profileResponse, isLoading: profileLoading } =
    useGetStaffProfileQuery();

  const {
    data: verificationResponse,
    isLoading: verificationLoading,
  } = useGetStaffVerificationQuery();

  const [updateProfile, { isLoading: updating }] =
    useUpdateStaffProfileMutation();

  const [submitVerification, { isLoading: submitting }] =
    useSubmitStaffVerificationMutation();

  const profile = profileResponse?.data;
  const verification = verificationResponse?.data?.verification;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] =
    useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [employeeId, setEmployeeId] = useState("");
  const [nidNumber, setNidNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const status = verification?.status ?? "not_submitted";

  const isVerified =
    verificationResponse?.data?.isIdentityVerified ??
    profile?.isIdentityVerified ??
    false;

  const isValidNid = [10, 13, 17].includes(nidNumber.length);

  const statusStyles: Record<string, string> = {
    verified:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    rejected:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    not_submitted:
      "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  };

  const statusLabels: Record<string, string> = {
    verified: "Verified",
    pending: "Pending Verification",
    rejected: "Rejected",
    not_submitted: "Not Verified",
  };

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#29445E] dark:bg-[#14283D]";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#F4F7FB] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-[#29445E] dark:bg-[#0B1726] dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

  const openEditModal = () => {
    if (!profile) return;

    setFullName(profile.fullName);
    setPhone(profile.phone);
    setError("");
    setSuccessMessage("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    if (updating) return;
    setShowEditModal(false);
    setError("");
  };

  const closeVerificationModal = () => {
    if (submitting) return;
    setShowVerificationModal(false);
    setError("");
  };

  const handleProfileSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      }).unwrap();

      setShowEditModal(false);
      setSuccessMessage(
        "Your profile has been updated successfully."
      );
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
          err !== null &&
          "data" in err &&
          typeof err.data === "object" &&
          err.data !== null &&
          "message" in err.data &&
          typeof err.data.message === "string"
          ? err.data.message
          : "Failed to update profile.";

      setError(message);
    }
  };

  const handleVerificationSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    // NID validation
    if (!/^\d+$/.test(nidNumber)) {
      setError("NID number must contain digits only.");
      return;
    }

    if (![10, 13, 17].includes(nidNumber.length)) {
      setError(
        "NID number must contain 10, 13 or 17 digits."
      );
      return;
    }

    if (!employeeId.trim()) {
      setError("Employee ID is required.");
      return;
    }

    if (!dateOfBirth) {
      setError("Date of Birth is required.");
      return;
    }

    if (!address.trim()) {
      setError("Present Address is required.");
      return;
    }

    try {
      await submitVerification({
        employeeId: employeeId.trim(),
        nidNumber: nidNumber.trim(),
        dateOfBirth,
        address: address.trim(),
      }).unwrap();

      setEmployeeId("");
      setNidNumber("");
      setDateOfBirth("");
      setAddress("");

      setShowVerificationModal(false);

      setSuccessMessage(
        "Verification request submitted successfully. Please wait for Admin review."
      );
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
          err !== null &&
          "data" in err &&
          typeof err.data === "object" &&
          err.data !== null &&
          "message" in err.data &&
          typeof err.data.message === "string"
          ? err.data.message
          : "Failed to submit verification request.";

      setError(message);
    }
  };

  if (profileLoading || verificationLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#176B87]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        Failed to load staff profile.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-7xl space-y-6 px-4 pb-10 text-[#172B4D] dark:text-white sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and identity verification.
          </p>
        </div>

        <button
          type="button"
          onClick={openEditModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
          <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          <p>{successMessage}</p>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="ml-auto"
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && !showEditModal && !showVerificationModal && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Profile Overview */}
      <section className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm dark:border-[#29445E] dark:bg-[#14283D]">
        <div className="h-28 bg-gradient-to-r from-[#102A43] via-[#176B87] to-[#14B8A6]" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#E8F4F7] text-[#176B87] shadow-sm dark:border-[#14283D] dark:bg-[#102A43] dark:text-[#14B8A6]">
                <User size={42} />
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-[#102A43] dark:text-white">
                  {profile.fullName}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="rounded-full bg-[#176B87]/10 px-3 py-1.5 text-xs font-bold text-[#176B87] dark:bg-teal-400/10 dark:text-teal-400">
                Bank Staff
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${profile.userStatus === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  }`}
              >
                {profile.userStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className={cardClass}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#102A43] dark:text-white">
              Personal Information
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your registered staff information
            </p>
          </div>

          <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:bg-teal-400/10 dark:text-teal-400">
            <User size={21} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-[#0B1726] dark:text-slate-400">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full Name
              </p>
              <p className="mt-1 font-semibold">
                {profile.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-[#0B1726] dark:text-slate-400">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email Address
              </p>
              <p className="mt-1 break-all font-semibold">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-[#0B1726] dark:text-slate-400">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Phone Number
              </p>
              <p className="mt-1 font-semibold">
                {profile.phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 dark:bg-[#0B1726] dark:text-slate-400">
              <BriefcaseBusiness size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Account Role
              </p>
              <p className="mt-1 font-semibold">Bank Staff</p>
            </div>
          </div>
        </div>
      </section>

      {/* Identity Verification */}
      <section className={cardClass}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
              {isVerified ? (
                <ShieldCheck size={27} />
              ) : (
                <ShieldAlert size={27} />
              )}
            </div>

            <div>
              <h3 className="font-bold text-[#102A43] dark:text-white">
                Identity Verification
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Verification of your staff identity by Admin
              </p>
            </div>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${statusStyles[isVerified ? "verified" : status] ||
              statusStyles.not_submitted
              }`}
          >
            {isVerified
              ? "Verified"
              : statusLabels[status] || "Not Verified"}
          </span>
        </div>

        {status === "pending" && !isVerified && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            <Clock size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Request Under Review</p>
              <p className="mt-1">
                Your verification request has been submitted. Please wait for Admin to review your information.
              </p>
            </div>
          </div>
        )}

        {isVerified && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-300">
            <BadgeCheck size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">
                Identity Successfully Verified
              </p>
              <p className="mt-1">
                Admin has verified your staff identity.
              </p>
            </div>
          </div>
        )}

        {status === "rejected" && !isVerified && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">
                Verification Request Rejected
              </p>
              <p className="mt-1">
                Reason: {verification?.rejectionReason || "Please contact Admin."}
              </p>
              <p className="mt-2">
                You can submit a new request with corrected information.
              </p>
            </div>
          </div>
        )}

        {!isVerified && status !== "pending" && (
          <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726] sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-[#102A43] dark:text-white">
                {status === "rejected"
                  ? "Submit a New Verification Request"
                  : "Verify Your Staff Identity"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Submit your identity details for Admin approval.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setEmployeeId("");
                setNidNumber("");
                setDateOfBirth("");
                setAddress("");
                setShowVerificationModal(true);
              }}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
            >
              <ShieldCheck size={17} />
              Request Verification
            </button>
          </div>
        )}
      </section>

      {/* Account Information */}
      <section className={cardClass}>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:bg-teal-400/10 dark:text-teal-400">
            <BriefcaseBusiness size={22} />
          </div>

          <div>
            <h3 className="font-bold text-[#102A43] dark:text-white">
              Account Information
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your staff account details
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Account Status
            </p>
            <p className="mt-1 font-semibold capitalize">
              {profile.userStatus}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Joined On
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <CalendarDays
                size={16}
                className="text-[#176B87] dark:text-teal-400"
              />
              {new Date(profile.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last Login
            </p>
            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Clock
                size={16}
                className="text-[#176B87] dark:text-teal-400"
              />
              {profile.lastLoginAt
                ? new Date(profile.lastLoginAt).toLocaleString("en-GB")
                : "Not available"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identity Status
            </p>
            <p
              className={`mt-1 font-semibold ${isVerified
                  ? "text-green-600 dark:text-green-400"
                  : "text-amber-600 dark:text-amber-400"
                }`}
            >
              {isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#29445E] dark:bg-[#14283D]"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-[#F4F7FB] p-5 dark:border-[#29445E] dark:bg-[#102A43]">
              <div>
                <h2
                  id="edit-profile-title"
                  className="text-lg font-bold text-[#102A43] dark:text-white"
                >
                  Edit Profile
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Update your personal information
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={updating}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#29445E]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5 p-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  maxLength={20}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  value={profile.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-60`}
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Email address cannot be changed here.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updating}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#29445E] dark:text-slate-300 dark:hover:bg-[#102A43]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
                >
                  {updating ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeVerificationModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#29445E] dark:bg-[#14283D]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#F4F7FB] p-5 dark:border-[#29445E] dark:bg-[#102A43]">
              <div>
                <h2
                  id="verification-title"
                  className="text-lg font-bold text-[#102A43] dark:text-white"
                >
                  Identity Verification Request
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Submit your details for Admin review
                </p>
              </div>

              <button
                type="button"
                onClick={closeVerificationModal}
                disabled={submitting}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#29445E]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleVerificationSubmit}
              className="space-y-5 p-6"
            >
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  <AlertCircle size={17} />
                  {error}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Employee ID</label>
                  <input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className={inputClass}
                    placeholder="Enter employee ID"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>NID Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={17}
                    value={nidNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNidNumber(value.slice(0, 17));
                      setError("");
                    }}
                    placeholder="Enter 10, 13 or 17 digit NID"
                    className={inputClass}
                    required
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Allowed: 10, 13 or 17 digits
                    </p>
                    <p
                      className={`text-xs font-semibold ${isValidNid
                          ? "text-green-600 dark:text-green-400"
                          : "text-slate-400"
                        }`}
                    >
                      {nidNumber.length}/17
                    </p>
                  </div>

                  {nidNumber.length > 0 && !isValidNid && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      NID number must contain 10, 13 or 17 digits.
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={inputClass}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Registered Phone</label>
                  <input
                    value={profile.phone}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-60`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Present Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                  placeholder="Enter your complete present address"
                  rows={3}
                  maxLength={300}
                  required
                />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={19} className="mt-0.5 shrink-0" />
                  <p>
                    Your NID information is sensitive. Submit accurate information only through your trusted banking system. Admin will review your details before verification.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeVerificationModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#29445E] dark:text-slate-300 dark:hover:bg-[#102A43]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !isValidNid}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
                >
                  {submitting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Send size={17} />
                  )}
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
