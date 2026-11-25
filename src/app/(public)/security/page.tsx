
import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Eye,
  UserCheck,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import PageBanner from "@/components/public/PageBanner";

const securityFeatures = [
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description:
      "A security-focused authentication system designed to protect account access.",
  },
  {
    icon: Fingerprint,
    title: "Identity Verification",
    description:
      "Identity verification workflows designed to support responsible account registration.",
  },
  {
    icon: Eye,
    title: "Transaction Monitoring",
    description:
      "Access transaction records and monitor available transaction statuses.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Access",
    description:
      "Separate access experiences for customers, bank staff and administrators.",
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] dark:bg-[#102A43]">

      {/* Hero */}
      {/* Premium Security Banner */}
      <PageBanner
        eyebrow="SECURITY & PROTECTION"
        title="Your Security."
        highlight="Our Priority."
        description="Explore security-focused features and responsible access management designed to protect your digital banking experience."
        currentPage="Security"
        buttonText="Contact Support"
        buttonHref="/contact"
      />

      {/* Security Features */}
      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              Protection Features
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#102A43] dark:text-white sm:text-4xl">
              Built Around Security
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Explore the platform features designed to support
              responsible banking access and account management.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.05]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg transition-transform group-hover:scale-110">
                    <Icon size={27} />
                  </div>

                  <span className="mt-6 block text-xs font-bold text-[#14B8A6]">
                    FEATURE 0{index + 1}
                  </span>

                  <h3 className="mt-3 text-lg font-bold text-[#102A43] dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Practices */}
      <section className="border-y border-slate-200 bg-white px-5 py-20 dark:border-white/10 dark:bg-white/[0.03] sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              Account Protection
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl">
              Responsible Banking
              <span className="block text-[#14B8A6]">
                Starts With Security.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
              Safe account management requires careful handling
              of login credentials, personal information and
              financial activities.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Keep your login credentials private.",
                "Use a strong and unique password.",
                "Review your available account activity.",
                "Report suspicious account activity promptly.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-[#14B8A6]"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#14B8A6]/20 bg-gradient-to-br from-[#102A43] to-[#176B87] p-8 shadow-xl sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#14B8A6]">
              <ShieldCheck size={34} />
            </div>

            <h3 className="mt-7 text-2xl font-extrabold text-white">
              Stay In Control
            </h3>

            <p className="mt-4 text-sm leading-8 text-white/70">
              Understand your account activity, manage your
              access responsibly and stay informed about
              your banking transactions.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3.5 text-sm font-bold text-[#102A43] transition hover:bg-[#45D6BC]"
            >
              Contact Support
              <ArrowUpRight size={17} />
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
