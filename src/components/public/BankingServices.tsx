
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  Landmark,
  HandCoins,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Savings & Current Accounts",
    description:
      "Explore account options and manage your everyday banking activities from one place.",
    icon: Wallet,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Money Transfer",
    description:
      "Explore convenient account-to-account fund transfer services.",
    icon: ArrowLeftRight,
    color: "from-teal-500 to-emerald-400",
  },
  {
    number: "03",
    title: "Deposit & Withdrawal",
    description:
      "Submit and track deposit or withdrawal requests through the banking platform.",
    icon: Landmark,
    color: "from-violet-500 to-purple-400",
  },
  {
    number: "04",
    title: "Loan Services",
    description:
      "Explore loan options and manage your loan application journey.",
    icon: HandCoins,
    color: "from-orange-500 to-amber-400",
  },
];

export default function BankingServices() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-24">

      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#14B8A6]">
              What We Offer
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
              Banking Services
              <span className="block text-[#14B8A6]">
                Built Around You.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              Discover the essential banking services designed
              to help you manage your money with greater clarity
              and convenience.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-[#176B87] transition hover:text-[#14B8A6] dark:text-[#14B8A6]"
          >
            View All Services
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Service Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.number}
                href="/services"
                className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl hover:shadow-[#176B87]/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
              >
                {/* Card Number */}
                <span className="absolute right-6 top-5 text-4xl font-black text-slate-200/80 dark:text-white/[0.06]">
                  {service.number}
                </span>

                {/* Icon */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Card Content */}
                <h3 className="mt-7 text-lg font-bold leading-snug text-[#102A43] dark:text-white">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>

                {/* Explore Link */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-white/10">
                  <span className="text-xs font-bold text-[#176B87] dark:text-[#14B8A6]">
                    Explore Service
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14B8A6]/10 text-[#14B8A6] transition-all group-hover:bg-[#14B8A6] group-hover:text-white">
                    <ArrowUpRight size={17} />
                  </span>
                </div>

              </Link>
            );
          })}

        </div>
      </div>
      {/* Bottom Accent Border */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
