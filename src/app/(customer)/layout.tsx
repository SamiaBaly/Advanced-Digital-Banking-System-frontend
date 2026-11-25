
import CustomerSidebar from "@/components/customer/CustomerSidebar";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B1726]">
      <CustomerSidebar />

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
