
import Image from "next/image";
import Link from "next/link";

import {
  Globe,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Security", href: "/security" },
    { label: "Contact", href: "/contact" },
  ],

  Services: [
    { label: "Bank Accounts", href: "/services" },
    { label: "Money Transfer", href: "/services" },
    { label: "Deposits", href: "/services" },
    { label: "Loan Services", href: "/services" },
  ],
};

const socialIcons = [Globe, MessageCircle, Mail];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#081B2D] text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/image/logo.png"
                alt="DigitalBank Logo"
                width={44}
                height={44}
                className="rounded-xl object-contain"
              />

              <span className="text-xl font-extrabold tracking-tight">
                Digital<span className="text-[#14B8A6]">Bank</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              A modern digital banking platform designed
              for convenient account management and
              everyday financial activities.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {socialIcons.map((Icon, index) => (
                <span
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#14B8A6] hover:bg-[#14B8A6]/10 hover:text-[#14B8A6]"
                >
                  <Icon size={18} />
                </span>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {title}
              </h3>

              <div className="mt-6 space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-[#14B8A6]"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Contact Information
            </h3>

            <div className="mt-6 space-y-5 text-sm text-slate-400">

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-[#14B8A6]"
                />
                <span>Contact through our support team</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-[#14B8A6]"
                />
                <span>Phone: Contact support</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="shrink-0 text-[#14B8A6]"
                />
                <span>Digital Banking Platform</span>
              </div>

            </div>

            {/* Contact Button */}
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#14B8A6]/10 transition hover:-translate-y-1 hover:shadow-xl"
            >
              Contact Us
              <ArrowUpRight size={15} />
            </Link>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center">

          <p className="text-xs text-slate-500">
            © 2026 DigitalBank. All rights reserved.
          </p>

          <p className="text-xs font-medium text-slate-500">
            Smart Banking. Simple Experience.
          </p>

        </div>

      </div>

      {/* Bottom Gradient Border */}
      <div className="h-1 w-full bg-gradient-to-r from-[#176B87] via-[#14B8A6] to-transparent" />

    </footer>
  );
}
