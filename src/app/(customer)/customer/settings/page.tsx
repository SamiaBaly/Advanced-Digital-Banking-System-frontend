
"use client";

import Link from "next/link";
import {
  Settings,
  ShieldCheck,
  Bell,
  UserRound,
  CreditCard,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";

export default function CustomerSettingsPage() {
  return (
    <div className="min-h-screen space-y-6 bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-white sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#176B87]/10 p-3 text-[#176B87] dark:text-[#14B8A6]">
          <Settings size={25} />
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your banking account preferences and security.
          </p>
        </div>
      </div>

      {/* Account Preferences */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#243B53] dark:bg-[#14283D]">
        <div className="border-b border-gray-100 p-5 dark:border-[#29445E]">
          <h2 className="font-bold">Account Preferences</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal banking information.
          </p>
        </div>

        <Link
          href="/customer/profile"
          className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50 dark:hover:bg-[#1B354D]"
        >
          <span className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
              <UserRound size={21} />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                Profile Information
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                View your personal information and account details.
              </span>
            </span>
          </span>
          <ChevronRight size={19} className="shrink-0 text-gray-400" />
        </Link>

        <div className="mx-5 border-t border-gray-100 dark:border-[#29445E]" />

        <Link
          href="/customer/accounts"
          className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50 dark:hover:bg-[#1B354D]"
        >
          <span className="flex items-center gap-3">
            <span className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
              <CreditCard size={21} />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                Bank Accounts
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                View your linked bank accounts.
              </span>
            </span>
          </span>
          <ChevronRight size={19} className="shrink-0 text-gray-400" />
        </Link>
      </section>

      {/* Notifications */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#243B53] dark:bg-[#14283D]">
        <div className="border-b border-gray-100 p-5 dark:border-[#29445E]">
          <h2 className="font-bold">Notifications</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay updated about your banking activities.
          </p>
        </div>

        <Link
          href="/customer/notifications"
          className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50 dark:hover:bg-[#1B354D]"
        >
          <span className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-500/10 p-3 text-amber-500">
              <Bell size={21} />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                My Notifications
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                View and manage your banking notifications.
              </span>
            </span>
          </span>
          <ChevronRight size={19} className="shrink-0 text-gray-400" />
        </Link>
      </section>

      {/* Security */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-[#243B53] dark:bg-[#14283D]">
        <div className="border-b border-gray-100 p-5 dark:border-[#29445E]">
          <h2 className="font-bold">Security & Privacy</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Protect your banking account.
          </p>
        </div>

        <Link
          href="/customer/profile"
          className="flex items-center justify-between gap-3 p-5 transition hover:bg-gray-50 dark:hover:bg-[#1B354D]"
        >
          <span className="flex items-center gap-3">
            <span className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
              <ShieldCheck size={21} />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                Change Password
              </span>
              <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                Update your account password securely.
              </span>
            </span>
          </span>
          <ChevronRight size={19} className="shrink-0 text-gray-400" />
        </Link>

        <div className="mx-5 border-t border-gray-100 dark:border-[#29445E]" />

        <div className="flex items-center gap-3 p-5">
          <span className="rounded-xl bg-purple-500/10 p-3 text-purple-500">
            <LockKeyhole size={21} />
          </span>
          <span>
            <span className="block text-sm font-semibold">
              Account Protection
            </span>
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              Your account is protected by secure authentication.
            </span>
          </span>
        </div>
      </section>

      <p className="text-center text-xs text-gray-400">
        Advanced Digital Banking · Customer Settings
      </p>
    </div>
  );
}
