
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
  Sparkles,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";

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
    <main className="min-h-screen overflow-hidden bg-[#F4F7FB] dark:bg-[#0B1726]">
      {/* Unique Services Hero */}
      <section className="relative overflow-hidden bg-[#102A43] px-5 pb-20 pt-24 text-white sm:px-8 sm:pb-28 sm:pt-32">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#14B8A6]/20 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-[#176B87]/40 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">
              <Sparkles size={15} />
              Our Banking Services
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Everything You Need,
              <span className="block text-[#14B8A6]">
                All in One Place.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Explore convenient digital banking services designed to
              simplify your accounts, transactions and everyday financial
              activities.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3.5 text-sm font-bold text-[#102A43] shadow-lg shadow-[#14B8A6]/20 transition hover:-translate-y-1 hover:bg-[#5EEAD4]"
              >
                Open Your Account
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="#services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Services
                <ChevronRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#14B8A6]" />
                Convenient Banking
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#14B8A6]" />
                Organized Transactions
              </span>
            </div>
          </div>

          {/* Decorative service visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-[#14B8A6]/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    DIGITAL BANKING
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-white">
                    Your Services
                  </h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14B8A6]/15 text-[#14B8A6]">
                  <Wallet size={23} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Wallet, name: "Accounts" },
                  { icon: ArrowLeftRight, name: "Transfers" },
                  { icon: Landmark, name: "Deposits" },
                  { icon: HandCoins, name: "Loans" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-[#14B8A6]/40 hover:bg-white/10"
                    >
                      <Icon size={24} className="text-[#14B8A6]" />
                      <p className="mt-4 text-sm font-semibold text-white">
                        {item.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/10 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]/20 text-[#5EEAD4]">
                  <ShieldCheck size={21} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Banking Made Simple
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Explore your digital banking tools
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#173B55] p-4 shadow-xl sm:flex">
              <LockKeyhole size={22} className="text-[#14B8A6]" />
              <div>
                <p className="text-xs font-bold text-white">
                  Security Focused
                </p>
                <p className="text-[10px] text-slate-400">
                  Responsible banking access
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
      </section>

      {/* Services */}
      <section
        id="services"
        className="relative px-5 py-20 sm:px-8 lg:py-24"
      >
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
              Discover the tools and features available throughout your
              digital banking experience.
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
      </section>

      {/* Security Note */}
      <section className="px-5 pb-20 pt-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 rounded-3xl border border-[#14B8A6]/20 bg-white/70 p-8 text-center shadow-lg backdrop-blur-xl dark:bg-white/[0.05] sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#14B8A6]/10 text-[#14B8A6]">
            <ShieldCheck size={32} />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#102A43] dark:text-white">
              Security Is Part of Every Experience
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Explore our security approach and learn about account
              protection and responsible banking access.
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
