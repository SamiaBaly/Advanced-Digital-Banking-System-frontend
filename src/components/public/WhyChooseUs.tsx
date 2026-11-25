
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
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
      className="relative overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-28"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87] dark:text-[#14B8A6]">
            Why DigitalBank
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Banking Designed
            <span className="block text-[#14B8A6]">
              Around You.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            A modern digital banking experience built around
            simplicity, security-minded design and financial clarity.
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl hover:shadow-[#176B87]/10 dark:border-white/10 dark:bg-white/[0.05] sm:p-8"
              >
                {/* Number */}
                <span className="absolute right-6 top-5 text-5xl font-black text-slate-100 dark:text-white/[0.04]">
                  {benefit.number}
                </span>

                {/* Icon */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={27} />
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-[#102A43] dark:text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>

                {/* Features */}
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-6 dark:border-white/10">
                  {benefit.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-[#14B8A6]"
                      />
                      {point}
                    </div>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 rounded-xl bg-[#102A43] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#176B87] dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#45D6BC]"
          >
            Discover More About Us

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>
      {/* Bottom Accent Border */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
