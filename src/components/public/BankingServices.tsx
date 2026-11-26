
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  Landmark,
  HandCoins,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Savings & Current Accounts",
    description:
      "Explore account options and manage your everyday banking activities from one place.",
    icon: Wallet,
    color: "from-blue-500 to-cyan-500",
    label: "Account Management",
  },
  {
    number: "02",
    title: "Money Transfer",
    description:
      "Explore convenient account-to-account fund transfer services.",
    icon: ArrowLeftRight,
    color: "from-teal-500 to-emerald-400",
    label: "Fund Transfer",
  },
  {
    number: "03",
    title: "Deposit & Withdrawal",
    description:
      "Submit and track deposit or withdrawal requests through the banking platform.",
    icon: Landmark,
    color: "from-violet-500 to-purple-400",
    label: "Money Management",
  },
  {
    number: "04",
    title: "Loan Services",
    description:
      "Explore loan options and manage your loan application journey.",
    icon: HandCoins,
    color: "from-orange-500 to-amber-400",
    label: "Loan Management",
  },
];

export default function BankingServices() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-5 py-20 dark:bg-[#0B1726] sm:px-8 lg:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#176B87]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#176B87] dark:text-[#14B8A6]">
              <Sparkles size={14} />
              What We Offer
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
              Banking Services
              <span className="mt-2 block text-[#14B8A6]">
                Built Around You.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
              Discover essential banking services designed to help
              you manage your money with greater clarity and
              convenience.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-xl border border-[#14B8A6]/30 px-5 py-3.5 text-sm font-bold text-[#176B87] transition-all duration-300 hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 dark:text-[#14B8A6]"
          >
            View All Services
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Service Cards */}
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.number}
                href="/services"
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-[#F4F7FB] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-[0_20px_40px_rgba(23,107,135,0.12)] dark:border-white/10 dark:bg-[#14283D] sm:p-7"
              >
                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#176B87] to-[#14B8A6] transition-all duration-500 group-hover:w-full" />

                {/* Background Number */}
                <span className="pointer-events-none absolute right-6 top-5 text-4xl font-black text-slate-200/80 transition-colors group-hover:text-[#14B8A6]/10 dark:text-white/[0.06]">
                  {service.number}
                </span>

                {/* Icon */}
                <div
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Label */}
                <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#14B8A6]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#176B87] dark:text-[#14B8A6]">
                  <CheckCircle2 size={12} />
                  {service.label}
                </span>

                {/* Content */}
                <h3 className="mt-4 text-lg font-bold leading-snug text-[#102A43] dark:text-white">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>

                {/* Explore Link */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-white/10">
                  <span className="text-xs font-bold text-[#176B87] transition-colors group-hover:text-[#14B8A6] dark:text-[#14B8A6]">
                    Explore Service
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#14B8A6] transition-all duration-300 group-hover:bg-[#14B8A6] group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Trust Message */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-slate-200 pt-7 dark:border-white/10">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Designed for everyday banking
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-[#14B8A6] sm:block" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Simple account management
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-[#14B8A6] sm:block" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Clear transaction records
          </span>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
