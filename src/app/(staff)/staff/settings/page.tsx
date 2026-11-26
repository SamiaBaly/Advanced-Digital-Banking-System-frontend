
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  ShieldCheck,
  UserRound,
  LockKeyhole,
  Mail,
  Smartphone,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

type Preferences = {
  emailNotifications: boolean;
  securityAlerts: boolean;
  transactionNotifications: boolean;
  loanNotifications: boolean;
};

const defaultPreferences: Preferences = {
  emailNotifications: true,
  securityAlerts: true,
  transactionNotifications: true,
  loanNotifications: true,
};

const PREFERENCES_KEY = "staff_preferences";

const getPreferencesSnapshot = () => {
  return (
    localStorage.getItem(PREFERENCES_KEY) ??
    JSON.stringify(defaultPreferences)
  );
};

const getServerPreferencesSnapshot = () =>
  JSON.stringify(defaultPreferences);

const subscribePreferences = (callback: () => void) => {
  window.addEventListener("staff-preferences-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("staff-preferences-change", callback);
    window.removeEventListener("storage", callback);
  };
};

const savePreferences = (preferences: Preferences) => {
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify(preferences)
  );

  window.dispatchEvent(new Event("staff-preferences-change"));
};

const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div>
      <p className="text-sm font-semibold text-[#172B4D] dark:text-white">
        {label}
      </p>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          : "bg-gray-300 dark:bg-[#486581]"
        }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"
          }`}
      />
    </button>
  </div>
);

export default function StaffSettingsPage() {
  const preferencesSnapshot = useSyncExternalStore(
    subscribePreferences,
    getPreferencesSnapshot,
    getServerPreferencesSnapshot
  );

  const preferences = (() => {
    try {
      const parsed = JSON.parse(
        preferencesSnapshot
      ) as Partial<Preferences>;

      return {
        ...defaultPreferences,
        ...parsed,
      };
    } catch {
      return defaultPreferences;
    }
  })();

  const [saved, setSaved] = useState(false);

  const updatePreference = (
    key: keyof Preferences,
    value: boolean
  ) => {
    savePreferences({
      ...preferences,
      [key]: value,
    });

    setSaved(false);
  };

  const handleSave = () => {
    savePreferences(preferences);
    setSaved(true);
  };

  const handleReset = () => {
    savePreferences(defaultPreferences);
    setSaved(true);
  };

  const cardClass =
    "rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm dark:border-[#29445E] dark:bg-[#14283D] sm:p-6";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 dark:bg-[#0B1726] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6 text-[#172B4D] dark:text-[#F4F7FB]">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
            <Settings size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              Staff Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your notification preferences and account security.
            </p>
          </div>
        </div>

        {/* Notification Preferences */}
        <section className={cardClass}>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-[#176B87] dark:text-[#14B8A6]">
              <Bell size={21} />
            </div>

            <div>
              <h2 className="font-bold">
                Notification Preferences
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0] dark:divide-[#29445E]">
            <Toggle
              label="Email Notifications"
              description="Receive important banking updates through email."
              checked={preferences.emailNotifications}
              onChange={(value) =>
                updatePreference("emailNotifications", value)
              }
            />

            <Toggle
              label="Security Alerts"
              description="Receive alerts about important account security events."
              checked={preferences.securityAlerts}
              onChange={(value) =>
                updatePreference("securityAlerts", value)
              }
            />

            <Toggle
              label="Transaction Notifications"
              description="Receive notifications about deposit and withdrawal activities."
              checked={preferences.transactionNotifications}
              onChange={(value) =>
                updatePreference("transactionNotifications", value)
              }
            />

            <Toggle
              label="Loan Notifications"
              description="Receive updates about staff loan request activities."
              checked={preferences.loanNotifications}
              onChange={(value) =>
                updatePreference("loanNotifications", value)
              }
            />
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 dark:border-[#29445E] sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#D9E2EC] px-5 py-3 text-sm font-semibold transition hover:bg-[#F4F7FB] dark:border-[#29445E] dark:hover:bg-[#102A43]"
            >
              <RotateCcw size={16} />
              Reset Preferences
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#176B87] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
            >
              Save Preferences
            </button>
          </div>

          {saved && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 size={17} />
              Preferences saved successfully.
            </p>
          )}
        </section>

        {/* Security */}
        <section className={cardClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-bold">
                Security & Account
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Manage your staff account information.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
              <LockKeyhole
                size={20}
                className="mt-0.5 text-[#14B8A6]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Account Authentication
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your account uses authenticated access to protect banking operations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
              <Mail
                size={20}
                className="mt-0.5 text-[#14B8A6]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Email Security
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Keep your registered email address up to date.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-[#F4F7FB] p-4 dark:bg-[#102A43]">
              <Smartphone
                size={20}
                className="mt-0.5 text-[#14B8A6]"
              />

              <div>
                <p className="text-sm font-semibold">
                  Account Protection
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Never share your password or authentication token.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/staff/profile"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#176B87] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
          >
            <UserRound size={17} />
            Manage My Profile
          </Link>
        </section>

        <p className="pb-4 text-center text-xs text-gray-400">
          Advanced Digital Banking System · Staff Preferences
        </p>
      </div>
    </div>
  );
}
