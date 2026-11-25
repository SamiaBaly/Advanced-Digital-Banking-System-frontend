
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fields = [
    {
      label: "Full Name",
      name: "fullName",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "example@email.com",
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "017XXXXXXXX",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Minimum 12 characters",
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: "password",
      placeholder: "Re-enter your password",
    },
  ];

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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002"}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(
        "Registration successful! Please wait for admin approval before logging in."
      );
      setMessageType("success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      setTimeout(() => {
        router.push("/login");
      }, 2000);

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
      <div className="mx-auto grid min-h-[780px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_70px_rgba(16,42,67,0.12)] transition-colors duration-300 dark:bg-[#14283D] dark:shadow-black/30 lg:grid-cols-2">

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
              YOUR FINANCIAL JOURNEY STARTS HERE
            </span>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Banking made
              <span className="block text-[#14B8A6]">
                simple & secure.
              </span>
            </h1>

            <p className="mt-6 text-base leading-8 text-slate-300">
              Experience smarter digital banking with secure access,
              seamless services and complete control over your finances.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Secure account access",
                "Simple and convenient banking",
                "Your finances, under your control",
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

        {/* Registration Form */}
        <section className="flex items-center justify-center px-5 py-10 transition-colors duration-300 dark:bg-[#14283D] sm:px-10 lg:px-14">
          <div className="w-full max-w-md">

            {/* Mobile Branding */}
            <div className="mb-8 lg:hidden">
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
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-[3px] text-[#176B87] dark:text-[#14B8A6]">
                Get Started
              </span>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102A43] dark:text-white sm:text-4xl">
                Create Account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Join us today and experience a smarter way to manage
                your finances.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-semibold text-[#172B4D] dark:text-slate-200"
                  >
                    {field.label}
                  </label>

                  <div className="relative">
                    <input
                      id={field.name}
                      type={
                        field.name === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : field.name === "confirmPassword"
                            ? showConfirmPassword
                              ? "text"
                              : "password"
                            : field.type
                      }
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      minLength={
                        field.name === "fullName"
                          ? 2
                          : field.name.includes("password")
                            ? 12
                            : undefined
                      }
                      maxLength={
                        field.name === "fullName" ? 100 : undefined
                      }
                      pattern={
                        field.name === "phone"
                          ? "^\\+?[0-9]{10,15}$"
                          : undefined
                      }
                      autoComplete={
                        field.name === "password"
                          ? "new-password"
                          : field.name === "confirmPassword"
                            ? "new-password"
                            : field.name === "email"
                              ? "email"
                              : field.name === "phone"
                                ? "tel"
                                : "name"
                      }
                      className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 pr-12 text-sm text-[#172B4D] outline-none transition placeholder:text-slate-400 hover:border-[#176B87]/50 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-[#14B8A6]/10 dark:border-slate-700 dark:bg-[#102A43] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-[#14B8A6]/50 dark:focus:border-[#14B8A6] dark:focus:bg-[#102A43]"
                    />

                    {(field.name === "password" ||
                      field.name === "confirmPassword") && (
                        <button
                          type="button"
                          onClick={() =>
                            field.name === "password"
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#14B8A6]"
                          aria-label={
                            field.name === "password"
                              ? showPassword
                                ? "Hide password"
                                : "Show password"
                              : showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                          }
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
                            {(
                              field.name === "password"
                                ? showPassword
                                : showConfirmPassword
                            ) ? (
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
                      )}
                  </div>
                </div>
              ))}

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
                {loading ? "Creating Account..." : "Create Account"}

                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#176B87] transition hover:text-[#14B8A6] dark:text-[#14B8A6] dark:hover:text-[#5EEAD4]"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Security Footer */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
              <span className="text-[#14B8A6]">✓</span>
              Secure registration experience
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
