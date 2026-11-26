
import StaffSidebar from "@/components/staff/StaffSidebar";

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B1726]">
      <StaffSidebar />

      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
