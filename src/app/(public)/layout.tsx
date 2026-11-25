
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}
