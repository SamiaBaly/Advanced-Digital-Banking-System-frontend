
import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Eye,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description: "Security-focused login and account access management.",
  },
  {
    icon: Fingerprint,
    title: "Identity Protection",
    description: "Identity verification designed to protect account access.",
  },
  {
    icon: Eye,
    title: "Activity Monitoring",
    description: "Designed for transparent transaction and account activity tracking.",
  },
];

export default function SecurityHighlights() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 dark:bg-[#102A43] sm:px-8 lg:py-24">

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
            Security & Protection
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
            Your Security.
            <span className="block text-[#14B8A6]">
              Our Priority.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-8 text-slate-600 dark:text-slate-300">
            Explore a banking platform designed with security,
            identity protection and transparent account management
            in mind.
          </p>

          <Link
            href="/security"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
          >
            Explore Security
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Right Security Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition-all duration-300 hover:-translate-x-1 hover:border-[#14B8A6]/50 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.05]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white transition-transform group-hover:scale-110">
                  <Icon size={26} />
                </div>

                <div>
                  <h3 className="font-bold text-[#102A43] dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>

                <span className="ml-auto text-sm font-bold text-[#14B8A6]">
                  0{index + 1}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </section>
  );
}
