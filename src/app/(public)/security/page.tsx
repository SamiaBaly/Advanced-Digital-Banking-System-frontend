
import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
  Eye,
  UserCheck,
  ArrowUpRight,
  CheckCircle2,
  Shield,
  KeyRound,
  Sparkles,
  ArrowRight,
} from "lucide-react";

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
    <main className="min-h-screen overflow-hidden bg-[#F4F7FB] dark:bg-[#0B1726]">

      {/* Unique Security Hero */}
      <section className="relative overflow-hidden bg-[#071827] px-5 py-24 sm:px-8 sm:py-32">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#176B87]/30 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5EEAD4]">
              <ShieldCheck size={15} />
              Security & Protection
            </div>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Security.
              <span className="mt-2 block text-[#14B8A6]">
                Our Priority.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Explore security-focused features and responsible
              access management designed to support your digital
              banking experience.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-xl bg-[#14B8A6] px-6 py-4 text-sm font-bold text-[#071827] shadow-lg shadow-[#14B8A6]/20 transition hover:-translate-y-1 hover:bg-[#5EEAD4]"
              >
                Contact Support
                <ArrowRight size={18} />
              </Link>

              <a
                href="#security-features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:border-[#14B8A6] hover:text-[#5EEAD4]"
              >
                Explore Features
                <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <LockKeyhole size={16} className="text-[#14B8A6]" />
                Access Management
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#14B8A6]" />
                Account Protection
              </span>
            </div>
          </div>

          {/* Shield Visual */}
          <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-8">
            <div className="absolute h-72 w-72 rounded-full border border-[#14B8A6]/10 sm:h-96 sm:w-96" />
            <div className="absolute h-60 w-60 rounded-full border border-dashed border-[#14B8A6]/20 sm:h-80 sm:w-80" />
            <div className="absolute h-48 w-48 rounded-full bg-[#14B8A6]/10 blur-3xl" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] border border-[#14B8A6]/30 bg-gradient-to-br from-[#176B87]/40 to-[#14B8A6]/10 shadow-[0_0_80px_rgba(20,184,166,0.12)] backdrop-blur-xl sm:h-80 sm:w-80">
              <div className="absolute inset-5 rounded-[2.5rem] border border-white/10" />

              <div className="flex h-36 w-36 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-2xl shadow-[#14B8A6]/30 sm:h-44 sm:w-44">
                <ShieldCheck size={90} strokeWidth={1.4} />
              </div>

              <div className="absolute -right-3 top-10 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-[#14283D] text-[#5EEAD4] shadow-xl sm:-right-5">
                <LockKeyhole size={23} />
              </div>

              <div className="absolute -bottom-4 -left-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-[#14283D] text-[#5EEAD4] shadow-xl">
                <Fingerprint size={23} />
              </div>
            </div>

            <div className="absolute -bottom-8 right-0 rounded-2xl border border-white/10 bg-[#14283D] p-4 shadow-xl sm:right-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6]/15 text-[#14B8A6]">
                  <Shield size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Security Focused
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Responsible account access
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#14B8A6] to-transparent" />
      </section>

      {/* Security Features */}
      <section
        id="security-features"
        className="scroll-mt-20 px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
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
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl hover:shadow-[#176B87]/10 dark:border-white/10 dark:bg-[#14283D]"
                >
                  <span className="absolute right-6 top-6 text-3xl font-black text-slate-100 dark:text-white/5">
                    0{index + 1}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg transition-transform group-hover:scale-110">
                    <Icon size={27} />
                  </div>

                  <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
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
      <section className="border-y border-slate-200 bg-white px-5 py-20 dark:border-white/10 dark:bg-white/[0.025] sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              <Sparkles size={14} />
              Account Protection
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#102A43] dark:text-white sm:text-4xl">
              Responsible Banking
              <span className="mt-2 block text-[#14B8A6]">
                Starts With Security.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
              Safe account management requires careful handling
              of login credentials, personal information and
              financial activities.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Keep your login credentials private.",
                "Use a strong and unique password.",
                "Review your available account activity.",
                "Report suspicious account activity promptly.",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-[#14B8A6]"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#14B8A6]/20 bg-gradient-to-br from-[#102A43] to-[#176B87] p-8 shadow-xl sm:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#14B8A6]/15 blur-3xl" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#14B8A6]">
              <ShieldCheck size={34} />
            </div>

            <h3 className="relative mt-7 text-2xl font-extrabold text-white">
              Stay In Control
            </h3>

            <p className="relative mt-4 text-sm leading-8 text-white/70">
              Understand your account activity, manage your
              access responsibly and stay informed about
              your banking transactions.
            </p>

            <div className="relative mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <KeyRound size={21} className="text-[#5EEAD4]" />
              <p className="text-xs font-medium text-white/80">
                Protect your credentials and personal information.
              </p>
            </div>

            <Link
              href="/contact"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3.5 text-sm font-bold text-[#102A43] transition hover:-translate-y-1 hover:bg-[#45D6BC]"
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
