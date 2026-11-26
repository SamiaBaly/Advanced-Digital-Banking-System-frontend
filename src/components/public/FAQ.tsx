
import Link from "next/link";
import {
  ChevronDown,
  MessageCircleQuestion,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const faqs = [
  {
    question: "How can I create a banking account?",
    answer:
      "Click Open Account, provide the required information and follow the registration and identity verification process.",
  },
  {
    question: "What banking services are available?",
    answer:
      "The platform is designed to support account management, fund transfers, deposit and withdrawal requests, and loan services.",
  },
  {
    question: "How do fund transfers work?",
    answer:
      "Select an eligible account, provide the recipient account details and amount, then follow the transaction confirmation process.",
  },
  {
    question: "Why is identity verification required?",
    answer:
      "Identity verification helps protect customer accounts and supports secure account registration and access management.",
  },
  {
    question: "How can I track my transactions?",
    answer:
      "After signing in, you will be able to view available transaction records and their statuses from your banking dashboard.",
  },
  {
    question: "What should I do if a transaction is pending?",
    answer:
      "Check the transaction status in your account history. Avoid submitting the same transaction again until its status is confirmed.",
  },
];

export default function FAQ() {
  return (
    <section className="relative isolate overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#0B1726] sm:px-8 lg:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#176B87]/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* Left Content */}
        <div className="lg:sticky lg:top-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#176B87] dark:text-[#14B8A6]">
            <Sparkles size={14} />
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Got Questions?
            <span className="mt-2 block text-[#14B8A6]">
              We Have Answers.
            </span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
            Find answers to common questions about digital banking,
            account management and available services.
          </p>

          {/* Support Card */}
          <div className="mt-9 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#14283D]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6]">
                <HelpCircle size={25} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#102A43] dark:text-white">
                  Still have questions?
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Our contact page is here to help.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#176B87]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <MessageCircleQuestion size={18} />
              Contact Support
              <ChevronDown
                size={16}
                className="-rotate-90 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="mt-6 text-xs leading-6 text-slate-500 dark:text-slate-400">
            We aim to make your digital banking experience simple,
            clear and convenient.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 open:border-[#14B8A6]/40 open:shadow-[0_12px_30px_rgba(23,107,135,0.08)] dark:border-white/10 dark:bg-[#14283D] sm:p-6"
              open={index === 0}
            >
              {/* Active Accent */}
              <div className="absolute left-0 top-0 h-full w-1 scale-y-0 bg-gradient-to-b from-[#176B87] to-[#14B8A6] transition-transform duration-300 group-open:scale-y-100" />

              <summary className="flex cursor-pointer list-none items-center gap-4 marker:hidden [&::-webkit-details-marker]:hidden">
                {/* Number */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-xs font-extrabold text-[#14B8A6]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span className="flex-1 text-sm font-bold leading-6 text-[#102A43] dark:text-white sm:text-base">
                  {faq.question}
                </span>

                {/* Toggle Icon */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#176B87] transition-all duration-300 group-open:rotate-180 group-open:bg-[#14B8A6]/10 group-open:text-[#14B8A6] dark:bg-white/10 dark:text-slate-300">
                  <ChevronDown size={18} />
                </span>
              </summary>

              {/* Answer */}
              <div className="ml-0 mt-5 border-t border-slate-100 pt-4 dark:border-white/10 sm:ml-13">
                <p className="text-sm leading-8 text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
