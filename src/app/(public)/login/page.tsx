
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { saveAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api"}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server.");
      }

      // Store authentication information for the current prototype.
      // Store authentication information.
      const userId = data.user._id || data.user.id;

      if (!userId) {
        throw new Error("User ID is missing from login response.");
      }

      saveAuth(data.token, data.user);

      // Update Redux authentication state.
      dispatch(
        setCredentials({
          id: userId,
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          userStatus: data.user.userStatus || "active",
        })
      );

      

      // Redirect according to user role.

      // Redirect according to user role.
      const dashboardPath =
        data.user.role === "admin"
          ? "/admin/dashboard"
          : data.user.role === "bank_staff"
            ? "/staff/dashboard"
            : "/customer/dashboard";

      router.push(dashboardPath);


      setFormData({
        email: "",
        password: "",
      });

      setShowPassword(false);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] px-4 py-10 transition-colors duration-300 dark:bg-[#0B1726] sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(16,42,67,0.12)] transition-colors duration-300 dark:bg-[#14283D] dark:shadow-black/30 lg:grid-cols-2">

        {/* Branding Section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#102A43] p-12 text-white lg:flex">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-28 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute right-10 top-36 h-52 w-52 rounded-full bg-[#14B8A6]/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6] text-2xl font-bold text-[#102A43]">
                B
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-wide">
                  Digital Banking
                </h2>
                <p className="text-xs text-slate-300">
                  SMART BANKING. SECURE FUTURE.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#5EEAD4]">
              <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
              WELCOME BACK
            </span>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Your banking,
              <span className="block text-[#14B8A6]">
                your control.
              </span>
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300">
              Access your digital banking account and manage your
              financial activities with confidence and convenience.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Secure account authentication",
                "Convenient digital banking access",
                "A smarter financial experience",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#14B8A6]/15 text-sm text-[#5EEAD4]">
                    ✓
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-400">
            © 2026 Digital Banking. All rights reserved.
          </p>
        </section>

        {/* Login Form */}
        <section className="flex items-center justify-center px-5 py-12 transition-colors duration-300 dark:bg-[#14283D] sm:px-10 lg:px-14">
          <div className="w-full max-w-md">

            {/* Mobile Branding */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102A43] text-xl font-bold text-[#14B8A6]">
                  B
                </div>

                <div>
                  <h2 className="font-bold text-[#102A43] dark:text-white">
                    Digital Banking
                  </h2>
                  <p className="text-xs text-[#176B87] dark:text-[#14B8A6]">
                    SMART BANKING. SECURE FUTURE.
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <span className="text-sm font-bold uppercase tracking-[3px] text-[#176B87] dark:text-[#14B8A6]">
                Welcome Back
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102A43] dark:text-white sm:text-4xl">
                Sign In
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Enter your account details to access your digital
                banking dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-slate-200"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 text-sm text-[#172B4D] outline-none transition placeholder:text-slate-400 hover:border-[#176B87]/50 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-[#14B8A6]/10 dark:border-slate-700 dark:bg-[#102A43] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-[#14B8A6]/50 dark:focus:border-[#14B8A6] dark:focus:bg-[#102A43]"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#172B4D] dark:text-slate-200"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#176B87] transition hover:text-[#14B8A6] dark:text-[#14B8A6] dark:hover:text-[#5EEAD4]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-4 pr-12 text-sm text-[#172B4D] outline-none transition placeholder:text-slate-400 hover:border-[#176B87]/50 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-[#14B8A6]/10 dark:border-slate-700 dark:bg-[#102A43] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-[#14B8A6]/50 dark:focus:border-[#14B8A6] dark:focus:bg-[#102A43]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#14B8A6]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="m3 3 18 18" />
                          <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.8" />
                          <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.4 4-1" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#14B8A6]"
                />

                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-slate-600 dark:text-slate-400"
                >
                  Remember me
                </label>
              </div>

              {/* Success / Error Message */}
              {message && (
                <div
                  role="alert"
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${messageType === "success"
                      ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#102A43] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#102A43]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#176B87] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43] dark:shadow-[#14B8A6]/10 dark:hover:bg-[#5EEAD4]"
              >
                {loading ? "Signing In..." : "Sign In"}

                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#176B87] transition hover:text-[#14B8A6] dark:text-[#14B8A6] dark:hover:text-[#5EEAD4]"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Security Footer */}
            <div className="mt-9 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <span className="text-[#14B8A6]">✓</span>
              Secure login experience
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
