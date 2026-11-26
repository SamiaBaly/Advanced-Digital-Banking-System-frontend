
import Link from "next/link";
import {
  UserRoundPlus,
  ClipboardCheck,
  Landmark,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    subtitle: "Get started in minutes",
    description:
      "Begin your digital banking journey with a simple registration process. Provide your basic details and create secure login credentials.",
    icon: UserRoundPlus,
    points: [
      "Quick and simple registration",
      "Submit your basic information",
      "Create secure login credentials",
    ],
  },
  {
    number: "02",
    title: "Verify Your Identity",
    subtitle: "Your security comes first",
    description:
      "Complete the identity verification process by submitting the required information. Your application will be reviewed for approval.",
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
    subtitle: "Everything in one place",
    description:
      "Once approved, access your personal banking dashboard and start managing your accounts and financial activities.",
    icon: Landmark,
    points: [
      "Access your banking dashboard",
      "Manage your bank accounts",
      "Explore digital banking services",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="relative isolate overflow-hidden bg-[#F4F7FB] px-5 py-20 dark:bg-[#0B1726] sm:px-8 lg:py-28">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#176B87]/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/25 bg-[#14B8A6]/10 px-4 py-2">
            <Sparkles size={14} className="text-[#14B8A6]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#176B87] dark:text-[#14B8A6]">
              Simple Process
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Your Banking Journey,
            <span className="mt-2 block text-[#14B8A6]">
              Made Simple.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Getting started with digital banking has never been easier.
            Follow three simple steps and take control of your finances.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connecting Line */}
          <div className="absolute left-[17%] right-[17%] top-12 hidden h-px bg-gradient-to-r from-[#176B87]/20 via-[#14B8A6] to-[#176B87]/20 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-[0_12px_40px_rgba(16,42,67,0.05)] transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-[0_20px_50px_rgba(20,184,166,0.12)] dark:border-white/10 dark:bg-[#14283D] sm:p-8"
              >
                {/* Number and Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/20 transition-transform duration-300 group-hover:scale-110 dark:border-[#14283D]">
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="text-5xl font-black tracking-tighter text-slate-100 transition-colors group-hover:text-[#14B8A6]/20 dark:text-white/[0.06]">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-7">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
                    Step {index + 1}
                  </span>

                  <h3 className="mt-2 text-xl font-bold text-[#102A43] dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#176B87] dark:text-[#14B8A6]">
                    {step.subtitle}
                  </p>

                  <p className="mt-4 min-h-[105px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Checklist */}
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-white/10">
                  {step.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2.5 text-xs font-medium text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#14B8A6]"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Accent */}
                <div className="mt-7 h-1 w-12 rounded-full bg-gradient-to-r from-[#176B87] to-[#14B8A6] transition-all duration-300 group-hover:w-24" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#102A43] via-[#176B87] to-[#0D9488] p-8 shadow-xl sm:p-10">
          <div className="flex flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Ready to Get Started?
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
                Take the first step towards a smarter and more convenient
                banking experience.
              </p>
            </div>

            <Link
              href="/register"
              className="group inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#102A43] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E6FFFA]"
            >
              Open an Account
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
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
