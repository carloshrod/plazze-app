import HeroSection from "@/components/features/landing/hero-section";
import FeaturesSection from "@/components/features/landing/features-section";
import CategoriesSection from "@/components/features/landing/categories-section";
import CTASection from "@/components/features/landing/cta-section";
import ScrollToTop from "@/components/common/ui/scroll-to-top";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <CTASection />
      <ScrollToTop />
    </main>
  );
}
