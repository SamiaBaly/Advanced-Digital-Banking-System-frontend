
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  ArrowUpRight,
  Bell
} from "lucide-react";
import { useGetMyNotificationsQuery } from "@/redux/api/notificationApi";

import ThemeToggle from "@/components/ThemeToggle";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCredentials } from "@/redux/slices/authSlice";

// Hydration-safe mounted state
const subscribeToNothing = () => () => { };
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Security", href: "/security" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot
  );

  const avatarContainerRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const currentUser = isMounted ? user : null;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data: notificationData } = useGetMyNotificationsQuery(
    { page: 1, limit: 1 },
    {
      skip: !currentUser || currentUser.role !== "customer",
      pollingInterval: 30000,
    }
  );

  const unreadCount = notificationData?.data.unreadCount ?? 0;

  // User Initials
  const initials =
    currentUser?.fullName
      .split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  // Role-based Dashboard
  const dashboardPath =
    currentUser?.role === "admin"
      ? "/admin/dashboard"
      : currentUser?.role === "bank_staff"
        ? "/staff/dashboard"
        : "/customer/dashboard";

  // Logout
  const handleLogout = () => {
    logout();
    dispatch(clearCredentials());

    setAvatarOpen(false);
    setMobileOpen(false);

    router.replace("/");
  };

  // Active Navigation Class
  const getLinkClass = (href: string) => {
    const isActive = pathname === href;

    return `relative rounded-xl px-3 py-2 text-sm transition-all duration-200 ${isActive
        ? "bg-[#176B87]/10 font-bold text-[#176B87] dark:bg-white/10 dark:text-[#14B8A6]"
        : "font-medium text-slate-600 hover:bg-[#176B87]/10 hover:text-[#176B87] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-[#14B8A6]"
      }`;
  };

  // Close Avatar Dropdown on Outside Click and Escape
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        avatarContainerRef.current &&
        !avatarContainerRef.current.contains(event.target as Node)
      ) {
        setAvatarOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAvatarOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-6">
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-[0_8px_40px_rgba(16,42,67,0.10)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-[#102A43]/80 dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)] sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <Image
            src="/image/logo.png"
            alt="Digital Bank Logo"
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-xl object-contain"
          />

          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-[#102A43] dark:text-white">
              Digital<span className="text-[#14B8A6]">Bank</span>
            </span>

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Banking Reimagined
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={getLinkClass(link.href)}
            >
              {link.label}

              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-[#14B8A6]" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {currentUser?.role === "customer" && (
            <Link
              href="/customer/notifications"
              aria-label={`Notifications, ${unreadCount} unread`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#102A43]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          )}
          <ThemeToggle />

          {/* Guest User */}
          {!currentUser ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#102A43] transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#176B87]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Open Account

                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          ) : (
            /* Authenticated User Avatar */
            <div
              ref={avatarContainerRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                onClick={() => setAvatarOpen(!avatarOpen)}
                aria-expanded={avatarOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/60 p-1.5 pr-3 shadow-sm backdrop-blur-xl transition hover:border-[#14B8A6]/50 hover:shadow-md dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] text-sm font-bold text-white">
                  {initials}
                </div>

                <div className="hidden text-left xl:block">
                  <p className="max-w-28 truncate text-xs font-bold text-slate-800 dark:text-white">
                    {currentUser.fullName}
                  </p>

                  <p className="text-[10px] capitalize text-slate-500 dark:text-slate-400">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`text-slate-500 transition-transform ${avatarOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Avatar Dropdown */}
              {avatarOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-white/60 bg-white/90 p-2 shadow-[0_15px_60px_rgba(16,42,67,0.18)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-white/10 dark:bg-[#102A43]/95"
                >
                  {/* User Information */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-100/80 p-3 dark:bg-white/5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] font-bold text-white">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {currentUser.fullName}
                      </p>

                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />

                  {/* Dashboard */}
                  <Link
                    href={dashboardPath}
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#176B87]/10 hover:text-[#176B87] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-[#14B8A6]"
                  >
                    <LayoutDashboard size={18} />
                    Go to Dashboard
                    <ArrowUpRight size={15} className="ml-auto" />
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setAvatarOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#176B87]/10 hover:text-[#176B87] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-[#14B8A6]"
                  >
                    <UserRound size={18} />
                    My Profile
                  </Link>

                  <div className="my-2 h-px bg-slate-200 dark:bg-white/10" />

                  {/* Logout */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 mx-1 rounded-2xl border border-white/60 bg-white/95 p-3 shadow-xl shadow-[#102A43]/10 backdrop-blur-2xl dark:border-white/10 dark:bg-[#102A43]/95 lg:hidden">

            {/* Mobile Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={getLinkClass(link.href)}
                >
                  <span className="flex items-center justify-between">
                    {link.label}

                    {pathname === link.href && (
                      <span className="h-2 w-2 rounded-full bg-[#14B8A6]" />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-slate-200 dark:bg-white/10" />

            {/* Authenticated Mobile Menu */}
            {currentUser ? (
              <>
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-slate-100 p-3 dark:bg-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#176B87] to-[#14B8A6] font-bold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {currentUser.fullName}
                    </p>

                    <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                      {currentUser.role.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardPath}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#176B87]/10 dark:text-white dark:hover:bg-white/10"
                >
                  <LayoutDashboard size={18} />
                  Go to Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-[#176B87]/10 dark:text-white dark:hover:bg-white/10"
                >
                  <UserRound size={18} />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-gradient-to-r from-[#176B87] to-[#14B8A6] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Open Account
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
