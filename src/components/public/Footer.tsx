
import Image from "next/image";
import Link from "next/link";

import {
  Globe,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  MoveRight,
} from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Security", href: "/security" },
    { label: "Contact Us", href: "/contact" },
  ],
  Services: [
    { label: "Bank Accounts", href: "/services" },
    { label: "Money Transfer", href: "/services" },
    { label: "Deposits & Withdrawals", href: "/services" },
    { label: "Loan Services", href: "/services" },
  ],
};

const socialLinks = [
  {
    label: "Website",
    icon: Globe,
    href: "/",
  },
  {
    label: "Contact",
    icon: MessageCircle,
    href: "/contact",
  },
  {
    label: "Email Support",
    icon: Mail,
    href: "/contact",
  },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#081B2D] text-white">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-[#176B87]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:pt-20">
        {/* Main Footer */}
        <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10">
                <Image
                  src="/image/logo.png"
                  alt="DigitalBank Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>

              <span className="text-xl font-extrabold tracking-tight">
                Digital
                <span className="text-[#14B8A6]">Bank</span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-8 text-slate-400">
              A modern digital banking platform designed for
              convenient account management and everyday
              financial activities.
            </p>

            {/* Trust Indicator */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/20 bg-[#14B8A6]/5 px-4 py-2.5">
              <ShieldCheck size={16} className="text-[#14B8A6]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                Security-Minded Banking
              </span>
            </div>

            {/* Social Links */}
            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#14B8A6]/50 hover:bg-[#14B8A6]/10 hover:text-[#14B8A6]"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
                {title}
              </h3>

              <div className="mt-7 space-y-5">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-[#14B8A6]"
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              Get In Touch
            </h3>

            <p className="mt-7 text-sm leading-7 text-slate-400">
              Have a question about our platform or banking
              services? Visit our contact page to reach our
              support team.
            </p>

            <div className="mt-6 space-y-5">
              <Link
                href="/contact"
                className="group flex items-center gap-3 text-sm text-slate-400 transition hover:text-[#14B8A6]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#14B8A6] transition group-hover:bg-[#14B8A6]/10">
                  <Mail size={17} />
                </span>
                <span>Contact Support</span>
              </Link>

              <Link
                href="/contact"
                className="group flex items-center gap-3 text-sm text-slate-400 transition hover:text-[#14B8A6]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#14B8A6] transition group-hover:bg-[#14B8A6]/10">
                  <MessageCircle size={17} />
                </span>
                <span>Send Us a Message</span>
              </Link>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#14B8A6]">
                  <MapPin size={17} />
                </span>
                <span>Digital Banking Platform</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#14B8A6]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Contact Us
              <MoveRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col justify-between gap-5 py-7 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs text-slate-500">
              © 2026 DigitalBank. All rights reserved.
            </p>
            <p className="mt-2 text-[11px] text-slate-600">
              Digital Banking System
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/security"
              className="text-xs text-slate-500 transition hover:text-[#14B8A6]"
            >
              Security
            </Link>

            <Link
              href="/contact"
              className="text-xs text-slate-500 transition hover:text-[#14B8A6]"
            >
              Support
            </Link>

            <span className="text-xs font-semibold text-[#14B8A6]">
              Smart Banking. Simple Experience.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />
    </footer>
  );
}
