
import Image from "next/image";
import Link from "next/link";
import {
  Wallet,
  ArrowLeftRight,
  CreditCard,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Smart Accounts",
    description: "Manage your accounts",
    icon: Wallet,
  },
  {
    title: "Fund Transfers",
    description: "Convenient money transfers",
    icon: ArrowLeftRight,
  },
  {
    title: "Digital Payments",
    description: "Manage payment activity",
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
    <section className="relative isolate flex min-h-[720px] items-center overflow-hidden bg-[#102A43]">

      {/* Full Background Image */}
      <Image
        src="/image/banner.jpg"
        alt="Digital Banking Background"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Left Side Gradient Only */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#081B2D]/95 via-[#102A43]/55 to-transparent" />

      {/* Left Decorative Glow */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-96 w-96 rounded-full bg-[#14B8A6]/15 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-24">

        {/* Left Content */}
        <div className="max-w-3xl">

          {/* Top Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 shadow-lg backdrop-blur-xl">
            <Sparkles size={15} className="text-[#14B8A6]" />

            <span className="text-xs font-bold tracking-[0.17em] text-white">
              THE FUTURE OF DIGITAL BANKING
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Banking Made

            <span className="mt-2 block bg-gradient-to-r from-[#14B8A6] to-[#7DE8D5] bg-clip-text text-transparent">
              Simple & Smart.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
            Experience a smarter way to manage your money.
            Enjoy convenient digital banking, secure transactions,
            and complete financial control — all in one place.
          </p>

          {/* Four Square Feature Cards */}

          {/* Four Compact Square Feature Cards */}
          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-3 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/70 hover:bg-white/15 sm:p-3"
                >
                  {/* Card Number */}
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-white/30">
                    0{index + 1}
                  </span>

                  {/* Centered Bigger Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14B8A6]/15 text-[#45D6BC] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#14B8A6] group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Centered Text */}
                  <div className="mt-3">
                    <h3 className="text-xs font-bold leading-5 text-white sm:text-sm">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-white/60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>


          {/* Main CTA Button */}
          <div className="mt-8">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(20,184,166,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(20,184,166,0.4)]"
            >
              Open Your Account

              <ArrowUpRight
                size={19}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="mt-7 flex items-center gap-2 text-white/65">
            <ShieldCheck
              size={17}
              className="shrink-0 text-[#14B8A6]"
            />

            <span className="text-xs font-medium">
              Security-focused digital banking experience
            </span>
          </div>

        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </section>
  );
}
