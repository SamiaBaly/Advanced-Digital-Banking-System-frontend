
import Link from "next/link";
import {
  UserRoundPlus,
  ClipboardCheck,
  Landmark,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Start by registering with your basic information and creating your digital banking account.",
    icon: UserRoundPlus,
    points: [
      "Simple registration process",
      "Provide your basic details",
      "Create secure login credentials",
    ],
  },
  {
    number: "02",
    title: "Verify Your Identity",
    description:
      "Complete the required identity verification process to help protect your banking account.",
    icon: ClipboardCheck,
    points: [
      "Submit required information",
      "Complete identity verification",
      "Wait for account approval",
    ],
  },
  {
    number: "03",
    title: "Start Banking",
    description:
      "After approval, access your banking dashboard and explore the available services.",
    icon: Landmark,
    points: [
      "Access your dashboard",
      "Manage banking accounts",
      "Explore available services",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-24">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#14B8A6]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#176B87] dark:text-[#14B8A6]">
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            How It
            <span className="text-[#14B8A6]"> Works.</span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Getting started with digital banking is simple.
            Follow these three steps to begin your journey.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-7 md:grid-cols-3">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col rounded-3xl border border-white/80 bg-white/75 p-7 shadow-[0_10px_40px_rgba(16,42,67,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.05] sm:p-8"
              >

                {/* Step Number */}
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-slate-200 dark:text-white/10">
                    {step.number}
                  </span>

                  <ArrowRight
                    size={20}
                    className="text-[#14B8A6] transition-transform group-hover:translate-x-2"
                  />
                </div>

                {/* Icon */}
                <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={30} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-7 text-xl font-bold text-[#102A43] dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>

                {/* Step Checklist */}
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-white/10">
                  {step.points.map((point) => (
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
            href="/register"
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#176B87]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Get Started Today

            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </div>

      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </section>
  );
}
