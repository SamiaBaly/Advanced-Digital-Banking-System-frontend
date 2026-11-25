
"use client";

import { useState, type FormEvent } from "react";
import PageBanner from "@/components/public/PageBanner";

import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send enquiry.");
      }

      setFeedback({
        type: "success",
        message: "Your enquiry has been submitted successfully!",
      });

      form.reset();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] dark:bg-[#102A43]">

      {/* Premium Contact Banner */}
      <PageBanner
        eyebrow="GET IN TOUCH"
        title="Let's Start a"
        highlight="Conversation."
        description="Have a question about digital banking? Connect with us and explore how we can help."
        currentPage="Contact Us"
      />

      {/* Contact Section */}
      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Contact Information
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#102A43] dark:text-white sm:text-4xl">
              Were Here to Help
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Send us your questions, feedback or support requests
              through the contact form.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

            {/* Left Information */}
            <div className="rounded-3xl bg-gradient-to-br from-[#081B2D] to-[#176B87] p-8 shadow-xl sm:p-10">

              <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
                Get Connected
              </span>

              <h3 className="mt-5 text-3xl font-extrabold text-white">
                Lets Talk About Your Banking Needs.
              </h3>

              <p className="mt-5 text-sm leading-8 text-white/65">
                Whether you need assistance with accounts,
                transactions or general platform information,
                were here to help you find the right direction.
              </p>

              <div className="mt-10 space-y-7">

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#14B8A6]">
                    <Mail size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Email Support
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      Submit your enquiry using the contact form
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#14B8A6]">
                    <MessageCircle size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      General Enquiries
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      Questions and platform information
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#14B8A6]">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Security Concerns
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      Report account-related concerns
                    </p>
                  </div>
                </div>

              </div>

              {/* Decorative Bottom */}
              <div className="mt-12 flex items-center gap-3 border-t border-white/15 pt-6">
                <Clock size={19} className="text-[#14B8A6]" />
                <p className="text-xs text-white/60">
                  We value your time and feedback.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-lg dark:border-white/10 dark:bg-white/[0.05] sm:p-10">

              <h3 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
                Send Us a Message
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Fill out the form with your information.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-white"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-white"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-white"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-600 outline-none transition focus:border-[#14B8A6] dark:border-white/10 dark:bg-[#193D56] dark:text-white"
                  >
                    <option value="" disabled>
                      Select an enquiry type
                    </option>
                    <option value="general">General Enquiry</option>
                    <option value="account">Account Assistance</option>
                    <option value="transaction">Transaction Issue</option>
                    <option value="security">Security Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-[#102A43] dark:text-white"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={17} />
                </button>

                {feedback && (
                  <p
                    role="status"
                    className={`rounded-xl border p-4 text-sm ${feedback.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                      }`}
                  >
                    {feedback.message}
                  </p>
                )}

              </form>

            </div>
          </div>
        </div>
      </section>

      {/* Bottom Border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </main>
  );
}
