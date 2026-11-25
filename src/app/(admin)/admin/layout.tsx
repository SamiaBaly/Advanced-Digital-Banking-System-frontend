
import type { ReactNode } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B1726]">
        <AdminSidebar />

        <div className="min-h-screen pt-16 lg:pl-64 lg:pt-0">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
