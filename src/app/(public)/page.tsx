
import Hero from "@/components/public/Hero";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import BankingServices from "@/components/public/BankingServices";
import HowItWorks from "@/components/public/HowItWorks";
import SecurityHighlights from "@/components/public/SecurityHighlights";
import FAQ from "@/components/public/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] dark:bg-[#102A43]">
      <Hero />
      <WhyChooseUs />
      <BankingServices />
      <HowItWorks />
      <SecurityHighlights />
      <FAQ />
    </main>
  );
}
