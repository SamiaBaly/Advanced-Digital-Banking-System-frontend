
import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Eye,
  ArrowUpRight,
  CheckCircle2,
  Shield,
  ScanFace,
} from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description:
      "Security-focused login and account access management for your banking activities.",
    tag: "Account Access",
  },
  {
    icon: Fingerprint,
    title: "Identity Protection",
    description:
      "Identity verification designed to help protect your personal banking information.",
    tag: "Identity Security",
  },
  {
    icon: Eye,
    title: "Activity Monitoring",
    description:
      "Keep track of your account and transaction activities through your dashboard.",
    tag: "Transparency",
  },
];

export default function SecurityHighlights() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#176B87]/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left Content */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/25 bg-[#14B8A6]/10 px-4 py-2">
            <ShieldCheck size={15} className="text-[#14B8A6]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#176B87] dark:text-[#14B8A6]">
              Security & Protection
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-7 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Your Security.
            <span className="mt-2 block text-[#14B8A6]">
              Our Priority.
            </span>
          </h2>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
            Your financial information deserves careful protection.
            Explore a digital banking platform designed with secure
            account access, identity verification and transparent
            activity management in mind.
          </p>

          {/* Trust Points */}
          <div className="mt-7 space-y-3">
            {[
              "Security-focused account access",
              "Identity verification workflow",
              "Transparent account activity",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#14B8A6]"
                />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/security"
            className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(20,184,166,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(20,184,166,0.35)]"
          >
            Explore Security
            <ArrowUpRight
              size={19}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>

          {/* Security Note */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]/10">
              <Shield className="h-5 w-5 text-[#14B8A6]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#102A43] dark:text-white">
                Built with security in mind
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Designed for a more confident banking experience
              </p>
            </div>
          </div>
        </div>

        {/* Right Security Cards */}
        <div className="relative">
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#14B8A6]/10 blur-[80px]" />

          <div className="relative space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F4F7FB] p-5 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#14B8A6]/50 hover:shadow-[0_15px_35px_rgba(20,184,166,0.10)] dark:border-white/10 dark:bg-white/[0.05] sm:p-6"
                >
                  {/* Hover Accent */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#176B87] to-[#14B8A6] transition-all duration-300 group-hover:w-full" />

                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={26} strokeWidth={1.8} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#14B8A6]">
                        {feature.tag}
                      </span>

                      <h3 className="mt-1 text-sm font-bold text-[#102A43] dark:text-white sm:text-base">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>

                    {/* Number */}
                    <span className="hidden text-2xl font-black text-slate-200 dark:text-white/10 sm:block">
                      0{index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Security Card */}
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#14B8A6]/20 bg-[#14B8A6]/5 p-5 dark:bg-[#14B8A6]/[0.07]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14B8A6]/15 text-[#14B8A6]">
              <ScanFace size={25} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white">
                Identity Verification
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                A dedicated verification process for account protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
