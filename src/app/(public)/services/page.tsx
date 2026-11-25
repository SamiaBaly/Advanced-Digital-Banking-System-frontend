
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  Landmark,
  HandCoins,
  CreditCard,
  ClipboardList,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import PageBanner from "@/components/public/PageBanner";

const services = [
  {
    icon: Wallet,
    title: "Savings & Current Accounts",
    description:
      "Manage your banking accounts and explore account options for your everyday financial needs.",
    features: [
      "Account information overview",
      "Balance monitoring",
      "Account management",
    ],
    category: "Account Management",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ArrowLeftRight,
    title: "Fund Transfers",
    description:
      "Explore convenient fund transfer services between eligible banking accounts.",
    features: [
      "Sender and receiver details",
      "Transfer amount management",
      "Transaction status tracking",
    ],
    category: "Money Movement",
    color: "from-teal-500 to-emerald-400",
  },
  {
    icon: Landmark,
    title: "Deposit & Withdrawal",
    description:
      "Manage deposit and withdrawal requests through an organized banking interface.",
    features: [
      "Deposit request management",
      "Withdrawal requests",
      "Request status tracking",
    ],
    category: "Cash Management",
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: HandCoins,
    title: "Loan Services",
    description:
      "Explore loan application options and follow your application journey.",
    features: [
      "Loan application",
      "Application status",
      "Repayment information",
    ],
    category: "Credit Services",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: CreditCard,
    title: "Digital Payments",
    description:
      "Explore digital payment management and keep your payment activity organized.",
    features: [
      "Payment activity overview",
      "Transaction records",
      "Payment status information",
    ],
    category: "Payment Management",
    color: "from-pink-500 to-rose-400",
  },
  {
    icon: ClipboardList,
    title: "Transaction History",
    description:
      "Review available transaction records and understand your account activity.",
    features: [
      "Transaction history",
      "Transaction details",
      "Status information",
    ],
    category: "Financial Records",
    color: "from-indigo-500 to-blue-400",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] dark:bg-[#102A43]">

      {/* Hero */}
      <PageBanner
        eyebrow="OUR BANKING SERVICES"
        title="Everything You Need,"
        highlight="All in One Place."
        description="Explore convenient digital banking services designed to simplify your accounts, transactions and financial activities."
        currentPage="Services"
        buttonText="Open Your Account"
        buttonHref="/register"
      />

      {/* Services */}
      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              Explore Our Platform
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#102A43] dark:text-white sm:text-4xl">
              Banking Services
              <span className="text-[#14B8A6]"> Designed for You.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Discover the tools and features available
              throughout your digital banking experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl hover:shadow-[#176B87]/10 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
                >

                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={27} />
                    </div>

                    <span className="text-4xl font-black text-slate-100 dark:text-white/[0.06]">
                      0{index + 1}
                    </span>
                  </div>

                  <span className="mt-6 w-fit rounded-full bg-[#14B8A6]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176B87] dark:text-[#14B8A6]">
                    {service.category}
                  </span>

                  <h3 className="mt-4 text-xl font-bold text-[#102A43] dark:text-white">
                    {service.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-white/10">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-[#14B8A6]"
                        />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/register"
                    className="mt-7 flex items-center justify-between rounded-xl bg-[#F4F7FB] px-4 py-3 text-sm font-bold text-[#176B87] transition hover:bg-[#14B8A6] hover:text-white dark:bg-white/5 dark:text-[#14B8A6] dark:hover:text-[#102A43]"
                  >
                    Get Started
                    <ArrowUpRight size={17} />
                  </Link>

                </div>
              );
            })}

          </div>
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
      </section>

      {/* Security Note */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-3xl border border-[#14B8A6]/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl dark:bg-white/[0.05] sm:flex-row sm:text-left">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6]">
            <ShieldCheck size={32} />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#102A43] dark:text-white">
              Security Is Part of Every Experience
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Explore our security approach and learn about
              account protection and responsible banking access.
            </p>
          </div>

          <Link
            href="/security"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#102A43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176B87] dark:bg-[#14B8A6] dark:text-[#102A43]"
          >
            Security
            <ArrowUpRight size={16} />
          </Link>

        </div>
      </section>

    </main>
  );
}
