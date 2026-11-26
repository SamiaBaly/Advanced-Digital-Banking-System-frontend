
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
    <section className="relative isolate overflow-hidden bg-[#081B2D] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      {/* Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Background Gradients */}
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-96 w-96 rounded-full bg-[#176B87]/25 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[450px] w-[450px] rounded-full bg-[#14B8A6]/15 blur-[130px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-48 w-2/3 -translate-x-1/2 rounded-full bg-[#176B87]/10 blur-[100px]" />

      {/* Decorative Rings */}
      <div className="pointer-events-none absolute -right-28 -top-36 -z-10 h-[430px] w-[430px] rounded-full border border-[#14B8A6]/20" />

      <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-[300px] w-[300px] rounded-full border border-white/10" />

      <div className="pointer-events-none absolute -right-2 -top-10 -z-10 h-[220px] w-[220px] rounded-full border border-[#14B8A6]/10" />

      {/* Decorative Shapes */}
      <div className="pointer-events-none absolute left-[8%] top-20 -z-10 hidden h-20 w-20 rotate-45 rounded-2xl border border-[#14B8A6]/25 bg-[#14B8A6]/5 backdrop-blur-xl sm:block" />

      <div className="pointer-events-none absolute bottom-16 right-[18%] -z-10 hidden h-14 w-14 rotate-12 rounded-xl border border-white/15 bg-white/5 backdrop-blur-lg lg:block" />

      <div className="pointer-events-none absolute left-[18%] bottom-24 -z-10 h-3 w-3 rounded-full bg-[#14B8A6] shadow-[0_0_25px_#14B8A6]" />

      <div className="pointer-events-none absolute right-[30%] top-20 -z-10 h-2.5 w-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_20px_#14B8A6]" />

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#14B8A6]/30 bg-white/[0.06] px-5 py-2.5 shadow-[0_0_30px_rgba(20,184,166,0.08)] backdrop-blur-xl">
          <Sparkles size={15} className="text-[#14B8A6]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6EE7D3] sm:text-xs">
            {eyebrow}
          </span>

          <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6] shadow-[0_0_10px_#14B8A6]" />
        </div>

        {/* Heading */}
        <h1 className="mx-auto mt-7 max-w-5xl text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}

          <span className="mt-2 block bg-gradient-to-r from-[#14B8A6] via-[#63E6D0] to-[#91CFFF] bg-clip-text text-transparent">
            {highlight}
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300/85 sm:text-base sm:leading-8">
          {description}
        </p>

        {/* Optional CTA */}
        {buttonText && buttonHref && (
          <Link
            href={buttonHref}
            className="group mt-9 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_35px_rgba(20,184,166,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(20,184,166,0.4)]"
          >
            {buttonText}

            <ArrowUpRight
              size={19}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        )}

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 transition-colors hover:text-[#14B8A6]"
          >
            <Home size={14} />
            Home
          </Link>

          <ChevronRight size={14} className="text-[#14B8A6]" />

          <span
            aria-current="page"
            className="font-semibold text-[#6EE7D3]"
          >
            {currentPage}
          </span>
        </nav>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </section>
  );
}
