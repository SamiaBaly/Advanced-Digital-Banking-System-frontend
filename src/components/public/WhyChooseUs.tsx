
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Security First",
    description:
      "A banking experience designed with account protection and responsible access in mind.",
    icon: ShieldCheck,
    points: [
      "Role-based access design",
      "Protected account management",
      "Security-focused architecture",
    ],
  },
  {
    number: "02",
    title: "Simple Experience",
    description:
      "Manage everyday banking activities through a clean and intuitive digital experience.",
    icon: Zap,
    points: [
      "Easy account navigation",
      "Convenient fund transfer interface",
      "Simple transaction overview",
    ],
  },
  {
    number: "03",
    title: "Financial Clarity",
    description:
      "Keep your banking activity organized with clear account and transaction information.",
    icon: ChartNoAxesCombined,
    points: [
      "Account balance overview",
      "Transaction history",
      "Organized financial records",
    ],
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative isolate overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#0B1726] sm:px-8 lg:py-28"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#176B87]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#176B87] dark:text-[#14B8A6]">
            <Sparkles size={14} />
            Why DigitalBank
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Banking Designed
            <span className="mt-2 block text-[#14B8A6]">
              Around You.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
            A modern digital banking experience built around
            simplicity, security-minded design and financial clarity.
          </p>

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-[#176B87] to-[#14B8A6]" />
        </div>

        {/* Benefit Cards */}
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-[0_20px_45px_rgba(23,107,135,0.12)] dark:border-white/10 dark:bg-[#14283D] sm:p-8"
              >
                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-[#176B87] to-[#14B8A6] transition-all duration-500 group-hover:w-full" />

                {/* Background Number */}
                <span className="pointer-events-none absolute right-6 top-5 text-5xl font-black text-slate-100 transition-colors duration-300 group-hover:text-[#14B8A6]/10 dark:text-white/[0.04] dark:group-hover:text-[#14B8A6]/10">
                  {benefit.number}
                </span>

                {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-[#102A43] dark:text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>

                {/* Features */}
                <div className="mt-6 flex-1 space-y-4 border-t border-slate-100 pt-6 dark:border-white/10">
                  {benefit.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#14B8A6]"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Card Accent */}
                <div className="mt-7 flex items-center gap-2 text-xs font-bold text-[#176B87] dark:text-[#14B8A6]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
                  Digital banking, made thoughtful
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#102A43] via-[#176B87] to-[#14B8A6] px-6 py-10 text-center shadow-xl shadow-[#176B87]/15 sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-5 -top-14 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              Get to know us
            </span>

            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Banking That Moves With You.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/80">
              Discover our vision for a simpler and more organized
              digital banking experience.
            </p>

            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#102A43] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F4F7FB]"
            >
              Discover More About Us
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
