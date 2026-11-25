
import Link from "next/link";
import PageBanner from "@/components/public/PageBanner";

import {
  ShieldCheck,
  Target,
  UsersRound,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Security First",
    description:
      "We prioritize secure account access and responsible financial management.",
  },
  {
    icon: Target,
    title: "Simplicity",
    description:
      "We focus on making everyday banking activities easier to understand and manage.",
  },
  {
    icon: UsersRound,
    title: "Customer Focus",
    description:
      "We aim to provide an intuitive banking experience built around customer needs.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] dark:bg-[#102A43]">

      {/* Premium About Banner */}
      <PageBanner
        eyebrow="ABOUT DIGITALBANK"
        title="Banking With a"
        highlight="Smarter Perspective."
        description="Discover our vision for a simpler, smarter and more convenient digital banking experience."
        currentPage="About Us"
        buttonText="Explore Services"
        buttonHref="/services"
      />

      {/* Our Story */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#102A43] dark:text-white sm:text-4xl">
              Redefining Everyday
              <span className="block text-[#14B8A6]">
                Banking Experience.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-300">
              Our goal is to bring essential banking features into
              one organized digital experience. From managing
              accounts to exploring transfers and loan services,
              the platform is designed to make financial activities
              more accessible.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
              We believe modern banking interfaces should be
              simple, transparent and designed with security
              in mind.
            </p>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1"
            >
              Explore Our Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5 sm:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-white">
              <Target size={32} />
            </div>

            <h3 className="mt-7 text-2xl font-extrabold text-[#102A43] dark:text-white">
              Our Mission
            </h3>

            <p className="mt-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
              To create a convenient digital banking experience
              where people can understand, manage and explore
              their financial activities with confidence.
            </p>
          </div>

        </div>
      </section>

      {/* Core Values */}
      <section className="border-y border-slate-200 bg-white px-5 py-20 dark:border-white/10 dark:bg-white/[0.03] sm:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#102A43] dark:text-white">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-[#F4F7FB] p-7 transition hover:-translate-y-2 hover:border-[#14B8A6]/50 dark:border-white/10 dark:bg-white/5"
                >
                  <Icon size={32} className="text-[#14B8A6]" />

                  <h3 className="mt-5 text-xl font-bold text-[#102A43] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#102A43] to-[#176B87] px-7 py-14 text-center sm:px-14">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Explore Digital Banking?
          </h2>

          <p className="mt-4 text-sm text-white/70">
            Discover a simpler way to manage your banking activities.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#14B8A6] px-7 py-4 text-sm font-bold text-[#102A43] transition hover:bg-[#45D6BC]"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
