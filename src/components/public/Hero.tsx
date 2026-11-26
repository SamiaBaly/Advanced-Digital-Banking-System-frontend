
import Image from "next/image";
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  CreditCard,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    title: "Smart Accounts",
    description: "Manage your money easily",
    icon: Wallet,
  },
  {
    title: "Fund Transfers",
    description: "Fast and convenient transfers",
    icon: ArrowLeftRight,
  },
  {
    title: "Digital Payments",
    description: "Simple payment management",
    icon: CreditCard,
  },
  {
    title: "Secure Banking",
    description: "Security-focused banking",
    icon: ShieldCheck,
  },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#102A43]">
      {/* Background */}
      <Image
        src="/image/banner.jpg"
        alt="Digital banking experience"
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#081B2D]/45 via-[#102A43]/25 to-[#102A43]/15" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#081B2D]/40 via-transparent to-[#081B2D]/10" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#176B87]/25 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-white/10 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <Sparkles size={15} className="text-[#14B8A6]" />
            <span className="text-[10px] font-bold tracking-[0.18em] text-white sm:text-xs">
              THE FUTURE OF DIGITAL BANKING
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Banking Made
            <span className="mt-2 block bg-gradient-to-r from-[#14B8A6] via-[#45D6BC] to-[#A0F0DF] bg-clip-text text-transparent">
              Simple & Smart.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            Experience a smarter way to manage your money. Enjoy convenient
            digital banking, seamless transactions, and complete financial
            control — all in one secure place.
          </p>

          {/* Trust points */}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
            {[
              "Easy account management",
              "Convenient transactions",
              "Secure banking experience",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#14B8A6]" />
                <span className="text-xs font-medium text-white/80">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative flex min-h-[145px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.09] p-4 text-center shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#14B8A6]/60 hover:bg-white/[0.15]"
                >
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-white/30">
                    0{index + 1}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/15 text-[#45D6BC] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#14B8A6] group-hover:text-[#102A43]">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-3 text-xs font-bold leading-5 text-white sm:text-sm">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-4 text-white/55">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(20,184,166,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(20,184,166,0.4)]"
            >
              Open Your Account
              <ArrowUpRight
                size={19}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#14B8A6]/60 hover:bg-white/10"
            >
              Discover More
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Security indicator */}
          <div className="mt-7 flex items-center gap-2 text-white/60">
            <ShieldCheck size={17} className="shrink-0 text-[#14B8A6]" />
            <span className="text-xs font-medium">
              Your money. Your control. Your digital banking experience.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
