
import Link from "next/link";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

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
    <section className="relative overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-24">

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">

        {/* Left Content */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
            Frequently Asked Questions
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl">
            Got Questions?
            <span className="block text-[#14B8A6]">
              We Have Answers.
            </span>
          </h2>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
            Find answers to common questions about digital banking,
            account management and available services.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
          >
            <MessageCircleQuestion size={18} />
            Contact Support
          </Link>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 open:border-[#14B8A6]/50 open:shadow-lg dark:border-white/10 dark:bg-white/[0.05]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#102A43] marker:hidden dark:text-white sm:text-base">
                <span>{faq.question}</span>

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#14B8A6] transition-transform duration-300 group-open:rotate-180">
                  <ChevronDown size={18} />
                </span>
              </summary>

              <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </section>
  );
}
