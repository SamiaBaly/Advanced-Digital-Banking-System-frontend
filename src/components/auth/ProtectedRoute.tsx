
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getUser, isAuthenticated, logout } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "bank_staff" | "customer")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const user = getUser();

      if (!authenticated || !user) {
        logout();
        router.replace("/login");
        return;
      }

      if (user.userStatus && user.userStatus !== "active") {
        logout();
        router.replace("/login");
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace("/");
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (checking || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] dark:bg-[#0B1726]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#176B87]/20 border-t-[#14B8A6]" />

          <p className="mt-4 text-sm font-medium text-[#176B87] dark:text-[#14B8A6]">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
