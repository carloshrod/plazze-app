import HeroSection from "@/components/features/landing/hero-section";
import FeaturesSection from "@/components/features/landing/features-section";
import CategoriesSection from "@/components/features/landing/categories-section";
import CTASection from "@/components/features/landing/cta-section";
import ScrollToTop from "@/components/common/ui/scroll-to-top";
import TrendingPlazzesSection from "@/components/features/landing/trending-plazzes-section";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TrendingPlazzesSection />
      <CategoriesSection />
      <CTASection />
      <ScrollToTop />
    </main>
  );
}
