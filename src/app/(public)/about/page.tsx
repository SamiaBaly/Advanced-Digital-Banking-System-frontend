
import Link from "next/link";
import {
  ShieldCheck,
  Target,
  UsersRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Landmark,
  Lightbulb,
  HeartHandshake,
  ArrowUpRight,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Security First",
    description:
      "We prioritize secure account access and responsible financial management.",
    points: ["Secure account access", "Responsible banking"],
  },
  {
    icon: Target,
    number: "02",
    title: "Simplicity",
    description:
      "We focus on making everyday banking activities easier to understand and manage.",
    points: ["Easy navigation", "Simple banking tools"],
  },
  {
    icon: UsersRound,
    number: "03",
    title: "Customer Focus",
    description:
      "We aim to provide an intuitive banking experience built around customer needs.",
    points: ["Customer-centered design", "Convenient experience"],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4F7FB] dark:bg-[#0B1726]">
      {/* Unique About Hero */}
      <section className="relative overflow-hidden bg-[#102A43] px-5 pb-24 pt-24 text-white sm:px-8 sm:pb-32 sm:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(20,184,166,0.17),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(23,107,135,0.35),transparent_40%)]" />

        <div className="absolute -right-28 top-10 h-80 w-80 rounded-full border border-[#14B8A6]/15" />
        <div className="absolute -right-16 top-24 h-56 w-56 rounded-full border border-[#14B8A6]/20" />
        <div className="absolute -right-4 top-40 h-28 w-28 rounded-full bg-[#14B8A6]/10 blur-2xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">
              <Sparkles size={15} />
              About DigitalBank
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Banking With a
              <span className="mt-2 block text-[#14B8A6]">
                Smarter Perspective.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Discover our vision for a simpler, smarter and more convenient
              digital banking experience. We bring essential banking tools
              together in one organized platform.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-6 py-3.5 text-sm font-bold text-[#102A43] shadow-lg shadow-[#14B8A6]/20 transition hover:-translate-y-1 hover:bg-[#5EEAD4]"
              >
                Explore Services
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Contact Us
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#14B8A6]" />
                Simplicity
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#14B8A6]" />
                Convenience
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#14B8A6]" />
                Customer Focus
              </span>
            </div>
          </div>

          {/* About visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-8 rounded-full bg-[#14B8A6]/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-xl shadow-[#14B8A6]/20">
                <Landmark size={38} />
              </div>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#5EEAD4]">
                Our Vision
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-snug text-white">
                A Better Way to Experience Banking.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Bringing essential financial activities together through
                a simple and organized digital experience.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <Lightbulb size={23} className="text-[#14B8A6]" />
                  <p className="mt-3 text-sm font-bold text-white">
                    Innovation
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Thoughtful design
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <HeartHandshake size={23} className="text-[#14B8A6]" />
                  <p className="mt-3 text-sm font-bold text-white">
                    Commitment
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Customer focused
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-white/10 bg-[#173B55] px-5 py-4 shadow-xl sm:block">
              <p className="text-xs font-bold text-white">
                Simplicity · Security · Convenience
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
      </section>

      {/* Our Story */}
      <section className="relative px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              <Sparkles size={14} />
              Who We Are
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-[#102A43] dark:text-white sm:text-4xl lg:text-5xl">
              Redefining Everyday
              <span className="mt-2 block bg-gradient-to-r from-[#176B87] to-[#14B8A6] bg-clip-text text-transparent">
                Banking Experience.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
              Our goal is to bring essential banking features into one
              organized digital experience. From managing accounts to
              exploring transfers and loan services, the platform is designed
              to make financial activities more accessible.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
              We believe modern banking interfaces should be simple,
              transparent and designed with security in mind.
            </p>

            <div className="mt-7 space-y-3">
              {[
                "Convenient digital banking experience",
                "Simple and organized account management",
                "Customer-focused banking features",
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-[#14B8A6]"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/services"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#176B87]/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Explore Our Services
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Mission Card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-[#14B8A6]/15 to-[#176B87]/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#14283D] dark:shadow-black/20 sm:p-12">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#14B8A6]/10 blur-2xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20">
                <Target size={32} />
              </div>

              <span className="relative mt-9 block text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
                Our Mission
              </span>

              <h3 className="relative mt-3 text-3xl font-extrabold text-[#102A43] dark:text-white">
                Banking That Works Around You.
              </h3>

              <p className="relative mt-5 text-sm leading-8 text-slate-600 dark:text-slate-300">
                To create a convenient digital banking experience where
                people can understand, manage and explore their financial
                activities with confidence.
              </p>

              <div className="relative mt-9 border-t border-slate-200 pt-6 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Our commitment
                </p>
                <p className="mt-2 text-sm font-semibold text-[#176B87] dark:text-[#14B8A6]">
                  Simplicity · Security · Convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-y border-slate-200 bg-white px-5 py-20 dark:border-white/10 dark:bg-white/[0.025] sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#14B8A6]">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#102A43] dark:text-white sm:text-4xl">
              Our Core Values
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              The principles that guide our approach to building a better
              digital banking experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-[#F4F7FB] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#14B8A6]/50 hover:shadow-xl hover:shadow-[#176B87]/10 dark:border-white/10 dark:bg-[#14283D]"
                >
                  <div className="absolute right-5 top-5 text-4xl font-black text-slate-200/70 transition group-hover:text-[#14B8A6]/15 dark:text-white/5">
                    {item.number}
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white shadow-lg shadow-[#176B87]/15 transition duration-300 group-hover:scale-110">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#102A43] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 dark:border-white/10">
                    {item.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                      >
                        <CheckCircle2
                          size={15}
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
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#102A43] via-[#123D59] to-[#176B87] px-7 py-16 text-center shadow-2xl shadow-[#102A43]/20 sm:px-14">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#14B8A6]/15 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#176B87]/40 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#5EEAD4]">
              <Sparkles size={14} />
              Start Your Journey
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ready to Explore Digital Banking?
            </h2>

            <p className="mt-5 text-sm leading-7 text-white/70 sm:text-base">
              Discover a simpler way to manage your banking activities with
              a convenient digital experience.
            </p>

            <Link
              href="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-bold text-[#102A43] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#45D6BC] hover:shadow-xl"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
