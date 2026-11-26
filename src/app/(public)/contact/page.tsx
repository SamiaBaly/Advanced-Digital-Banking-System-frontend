
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import {
  Mail,
  MessageCircle,
  Send,
  ShieldCheck,
  Clock,
  ArrowRight,
  Headphones,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5002/api";

      const response = await fetch(`${API_URL}/contact`, {
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
    <main className="min-h-screen overflow-hidden bg-[#F4F7FB] dark:bg-[#0B1726]">

      {/* Unique Contact Hero */}
      <section className="relative overflow-hidden bg-[#081B2D] px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#176B87]/30 blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:55px_55px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5EEAD4]">
              <Sparkles size={14} />
              Were Here to Help
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Lets Start a
              <span className="mt-2 block bg-gradient-to-r from-[#5EEAD4] to-[#14B8A6] bg-clip-text text-transparent">
                Conversation.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Have a question about digital banking? Were ready
              to hear from you. Send us your enquiry and let us
              help you find the right direction.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 rounded-xl bg-[#14B8A6] px-6 py-4 text-sm font-bold text-[#081B2D] transition hover:-translate-y-1 hover:bg-[#5EEAD4]"
              >
                Send an Enquiry
                <ArrowRight size={18} />
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:border-[#14B8A6] hover:text-[#5EEAD4]"
              >
                Back to Home
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#14B8A6]" />
                Secure Enquiry
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#14B8A6]" />
                Customer Support
              </span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-[#14B8A6]/20 blur-[80px]" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg">
                  <Headphones size={28} />
                </div>

                <span className="rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5EEAD4]">
                  Support Center
                </span>
              </div>

              <h2 className="mt-9 text-2xl font-bold text-white">
                How can we help?
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Choose your enquiry type and send us a message.
                Were happy to help.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Mail, title: "Email Enquiries", text: "Send us your questions" },
                  { icon: ShieldCheck, title: "Account Support", text: "Account-related concerns" },
                  { icon: MessageCircle, title: "General Assistance", text: "Platform information" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#5EEAD4]">
                        <Icon size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-6">
                <Clock size={18} className="text-[#14B8A6]" />
                <p className="text-xs text-slate-400">
                  Your feedback matters to us.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/15 bg-[#14283D] p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-[#14B8A6]" />
                <div>
                  <p className="text-xs font-bold text-white">
                    Were listening
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Your voice matters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#14B8A6] to-transparent" />
      </section>

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

              <div className="mt-12 flex items-center gap-3 border-t border-white/15 pt-6">
                <Clock size={19} className="text-[#14B8A6]" />
                <p className="text-xs text-white/60">
                  We value your time and feedback.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div
              id="contact-form"
              className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-7 shadow-lg dark:border-white/10 dark:bg-[#14283D] sm:p-10"
            >
              <h3 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
                Send Us a Message
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Fill out the form with your information.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                    maxLength={100}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

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
                    maxLength={150}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

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
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send
                    size={17}
                    className={isSubmitting ? "animate-pulse" : ""}
                  />
                </button>

                {feedback && (
                  <p
                    role="status"
                    aria-live="polite"
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

      <div className="h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </main>
  );
}
