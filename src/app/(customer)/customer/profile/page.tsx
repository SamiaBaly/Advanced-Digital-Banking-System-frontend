
"use client";

import { useState, useSyncExternalStore } from "react";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  X,
  Pencil,
} from "lucide-react";

import { type AuthUser } from "@/lib/auth";
import { useChangePasswordMutation } from "@/redux/api/securityApi";

// Cached localStorage snapshot
let cachedRawUser: string | null | undefined;
let cachedUser: AuthUser | null = null;

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("banking-user-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("banking-user-updated", callback);
  };
};

const getSnapshot = (): AuthUser | null => {
  const rawUser = localStorage.getItem("banking_user");

  if (rawUser === cachedRawUser) {
    return cachedUser;
  }

  cachedRawUser = rawUser;

  if (!rawUser) {
    cachedUser = null;
    return null;
  }

  try {
    cachedUser = JSON.parse(rawUser) as AuthUser;
  } catch {
    cachedUser = null;
  }

  return cachedUser;
};

const getServerSnapshot = (): AuthUser | null => null;

export default function CustomerProfilePage() {
  const user = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setErrorMessage("");
  };

  const closePasswordModal = () => {
    if (isLoading) return;

    setIsPasswordModalOpen(false);
    resetPasswordForm();
  };

  const handlePasswordChange = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword.length > 128) {
      setErrorMessage(
        "New password cannot exceed 128 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        "New password and confirmation do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      const response = await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      setSuccessMessage(
        response.message || "Password changed successfully."
      );

      setIsPasswordModalOpen(false);
      resetPasswordForm();
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string };
      };

      setErrorMessage(
        apiError.data?.message ||
        "Unable to change password. Please try again."
      );
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#176B87] focus:ring-2 focus:ring-[#176B87]/15 dark:border-[#29445F] dark:bg-[#102A43] dark:text-white dark:placeholder:text-slate-500";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200";

  const passwordField = (
    label: string,
    value: string,
    setter: (value: string) => void,
    visible: boolean,
    toggle: () => void,
    placeholder: string,
    autoComplete: string
  ) => (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pr-12`}
          autoComplete={autoComplete}
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={toggle}
          disabled={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#176B87] dark:hover:text-[#14B8A6]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#F4F7FB] px-4 py-6 dark:bg-[#0B1726] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-7">

          {/* PAGE HEADER */}
          <div>
            <p className="mb-2 text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
              CUSTOMER ACCOUNT
            </p>

            <h1 className="text-2xl font-bold text-[#102A43] dark:text-white sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Manage your personal information and account security.
            </p>
          </div>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={20} className="shrink-0" />
              {successMessage}
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

          {/* PERSONAL INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-[#29445F]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-[#102A43] dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your registered account details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {user ? (
                <>
                  <div className="mb-7 flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102A43] to-[#176B87] text-3xl font-bold text-white">
                      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-[#102A43] dark:text-white">
                        {user.fullName}
                      </h3>

                      <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-400">
                        {user.role?.replace("_", " ")}
                      </p>

                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        <ShieldCheck size={14} />
                        {user.userStatus || "Active"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <UserRound size={17} />
                        <span className="text-xs font-semibold">
                          FULL NAME
                        </span>
                      </div>
                      <p className="break-words font-semibold text-[#102A43] dark:text-white">
                        {user.fullName}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Mail size={17} />
                        <span className="text-xs font-semibold">
                          EMAIL ADDRESS
                        </span>
                      </div>
                      <p className="break-all font-semibold text-[#102A43] dark:text-white">
                        {user.email}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone size={17} />
                        <span className="text-xs font-semibold">
                          PHONE NUMBER
                        </span>
                      </div>
                      <p className="font-semibold text-[#102A43] dark:text-white">
                        {user.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                      <div className="mb-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <ShieldCheck size={17} />
                        <span className="text-xs font-semibold">
                          ACCOUNT STATUS
                        </span>
                      </div>
                      <p className="font-semibold capitalize text-[#102A43] dark:text-white">
                        {user.userStatus || "Active"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading profile information...
                </p>
              )}
            </div>
          </section>

          {/* ACCOUNT SECURITY CARD */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#29445F] dark:bg-[#14283D]">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-[#29445F]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-[#102A43] dark:text-white">
                    Account Security
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage your password and protect your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#F4F7FB] p-3 text-[#176B87] dark:bg-[#0B1726] dark:text-[#14B8A6]">
                  <KeyRound size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    Password
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Change your password regularly to keep your account secure.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setIsPasswordModalOpen(true);
                }}
                disabled={!user}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Pencil size={17} />
                Change Password
              </button>
            </div>
          </section>

          {/* SECURITY INFORMATION */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#176B87]/15 bg-[#176B87]/5 p-5 dark:border-[#14B8A6]/20 dark:bg-[#14B8A6]/5">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-[#176B87] dark:text-[#14B8A6]"
            />

            <div>
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white">
                Account Security
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Never share your password or banking credentials with
                anyone. If you notice suspicious account activity,
                change your password immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={closePasswordModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
            className="my-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#29445F] dark:bg-[#14283D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#F4F7FB] px-6 py-5 dark:border-[#29445F] dark:bg-[#102A43]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:bg-[#14B8A6]/10 dark:text-[#14B8A6]">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <h2
                    id="change-password-title"
                    className="font-bold text-[#102A43] dark:text-white"
                  >
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your account password
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={isLoading}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-red-500 disabled:opacity-50 dark:hover:bg-[#29445F]"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL FORM */}
            <form
              onSubmit={handlePasswordChange}
              className="space-y-5 p-6"
            >
              {errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {passwordField(
                "Current Password",
                currentPassword,
                setCurrentPassword,
                showCurrent,
                () => setShowCurrent((prev) => !prev),
                "Enter your current password",
                "current-password"
              )}

              {passwordField(
                "New Password",
                newPassword,
                setNewPassword,
                showNew,
                () => setShowNew((prev) => !prev),
                "Enter your new password",
                "new-password"
              )}

              {passwordField(
                "Confirm New Password",
                confirmPassword,
                setConfirmPassword,
                showConfirm,
                () => setShowConfirm((prev) => !prev),
                "Confirm your new password",
                "new-password"
              )}

              {/* PASSWORD REQUIREMENTS */}
              <div className="rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#0B1726]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#102A43] dark:text-white">
                  <KeyRound
                    size={17}
                    className="text-[#176B87] dark:text-[#14B8A6]"
                  />
                  Password Requirements
                </div>

                <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <li>• Minimum 8 characters</li>
                  <li>• Maximum 128 characters</li>
                  <li>• Must be different from current password</li>
                  <li>• Confirmation must match new password</li>
                </ul>
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-[#29445F] dark:text-slate-300 dark:hover:bg-[#102A43]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
