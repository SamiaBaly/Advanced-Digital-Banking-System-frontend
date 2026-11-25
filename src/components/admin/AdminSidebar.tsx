
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { clearCredentials } from "@/redux/slices/authSlice";
import { logout } from "@/lib/auth";

import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  UserCog,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Home,
} from "lucide-react";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Accounts", href: "/admin/accounts", icon: Wallet },
  { label: "Transactions", href: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Loans", href: "/admin/loans", icon: Landmark },
  { label: "Cards", href: "/admin/cards", icon: CreditCard },
  { label: "Staff", href: "/admin/staff", icon: UserCog },
  { label: "Reports & Analytics", href: "/admin/reports", icon: ChartNoAxesCombined },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white text-[#172B4D] dark:border-white/10 dark:bg-[#102A43] dark:text-white">

      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6 dark:border-white/10">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white p-1">
          <Image
            src="/image/logo.png"
            alt="Digital Bank Logo"
            fill
            sizes="48px"
            className="object-contain"
            priority
          />
        </div>

        <div>
          <h2 className="text-base font-extrabold tracking-wide text-[#102A43] dark:text-white">
            Digital Bank
          </h2>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#176B87] dark:text-[#5EEAD4]">
            Administration
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/admin/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                    ? "bg-[#176B87] text-white shadow-lg shadow-[#176B87]/10 dark:bg-[#14B8A6] dark:text-[#102A43] dark:shadow-[#14B8A6]/10"
                    : "text-slate-600 hover:bg-[#F4F7FB] hover:text-[#176B87] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={19} strokeWidth={1.9} />
                  {item.label}
                </span>

                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Security Card */}
      <div className="mx-4 mb-5 rounded-2xl border border-[#176B87]/15 bg-[#F4F7FB] p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={19} className="text-[#176B87] dark:text-[#14B8A6]" />

          <span className="text-xs font-bold text-[#102A43] dark:text-white">
            Secure Banking
          </span>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
          Your administration workspace is protected.
        </p>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-200 p-4 dark:border-white/10">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10 dark:hover:text-red-200"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 text-center text-[10px] text-slate-400 dark:text-slate-500">
        © 2026 Digital Bank
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    dispatch(clearCredentials());
    setMobileOpen(false);
    router.replace("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-[#14283D] lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white p-1">
            <Image
              src="/image/logo.png"
              alt="Digital Bank Logo"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>

          <span className="font-bold text-[#102A43] dark:text-white">
            Digital Bank
          </span>
        </div>

        <button
          onClick={() => setMobileOpen((previous) => !previous)}
          className="rounded-lg p-2 text-[#102A43] hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Overlay and Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          />

          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}
    </>
  );
}
