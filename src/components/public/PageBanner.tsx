
import Link from "next/link";
import {
  Sparkles,
  Home,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

interface PageBannerProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  currentPage: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function PageBanner({
  eyebrow,
  title,
  highlight,
  description,
  currentPage,
  buttonText,
  buttonHref,
}: PageBannerProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#081B2D] px-5 py-24 sm:py-28 lg:py-32">

      {/* Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.13]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.13) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Abstract Glow */}

      {/* Large Thick Circular Rings */}
      <div className="pointer-events-none absolute -right-20 top-[-100px] z-0 h-80 w-80 rounded-full border-[5px] border-[#14B8A6]/20 shadow-[0_0_50px_rgba(20,184,166,0.08)]" />

      <div className="pointer-events-none absolute -right-10 top-[-60px] z-0 h-60 w-60 rounded-full border-[4px] border-white/10" />

      {/* Large 3D Diamond */}
      <div className="pointer-events-none absolute left-[7%] top-16 z-0 h-24 w-24 rotate-45 rounded-3xl border-[4px] border-[#14B8A6]/30 bg-[#14B8A6]/5 shadow-[0_0_40px_rgba(20,184,166,0.12)] backdrop-blur-xl" />

      <div className="pointer-events-none absolute right-[20%] bottom-10 z-0 h-20 w-20 rotate-45 rounded-2xl border-[3px] border-white/15" />

      {/* Floating Glass Square */}
      <div className="pointer-events-none absolute left-[20%] bottom-8 z-0 h-28 w-28 rotate-12 rounded-3xl border-[3px] border-[#14B8A6]/25 bg-[#14B8A6]/5 shadow-[0_0_35px_rgba(20,184,166,0.12)] backdrop-blur-md" />

      {/* Thick Glowing Dots */}
      <div className="pointer-events-none absolute right-[30%] top-16 z-0 h-5 w-5 rounded-full border-[3px] border-[#14B8A6]/60 bg-[#14B8A6]/20 shadow-[0_0_25px_#14B8A6]" />

      <div className="pointer-events-none absolute left-[12%] bottom-24 z-0 h-4 w-4 rounded-full bg-[#14B8A6] shadow-[0_0_25px_#14B8A6]" />


      {/* Banner Content */}
      <div className="relative z-10 mx-auto max-w-7xl text-center">

        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 px-5 py-2.5 shadow-[0_0_30px_rgba(20,184,166,0.08)] backdrop-blur-xl">

          <Sparkles
            size={15}
            className="text-[#14B8A6]"
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6EE7D3] sm:text-xs">
            {eyebrow}
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_10px_#14B8A6]" />

        </div>

        {/* Heading */}
        <h1 className="mx-auto mt-8 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">

          {title}

          <span className="mt-2 block bg-gradient-to-r from-[#14B8A6] via-[#63E6D0] to-[#91CFFF] bg-clip-text text-transparent">
            {highlight}
          </span>

        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-300/80 sm:text-base">
          {description}
        </p>

        {/* Optional Button */}
        {buttonText && buttonHref && (
          <Link
            href={buttonHref}
            className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(20,184,166,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(20,184,166,0.35)]"
          >
            {buttonText}

            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        )}

        {/* Breadcrumb */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">

          <Link
            href="/"
            className="flex items-center gap-1.5 transition hover:text-[#14B8A6]"
          >
            <Home size={14} />
            Home
          </Link>

          <ChevronRight
            size={14}
            className="text-[#14B8A6]"
          />

          <span className="font-semibold text-[#6EE7D3]">
            {currentPage}
          </span>

        </div>

      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 z-10 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </section>
  );
}
