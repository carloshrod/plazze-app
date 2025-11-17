import HeroSection from "@/components/features/landing/hero-section";
import FeaturesSection from "@/components/features/landing/features-section";
import CategoriesSection from "@/components/features/landing/categories-section";
import CTASection from "@/components/features/landing/cta-section";
import ScrollToTop from "@/components/common/ui/scroll-to-top";
import TrendingPlazzesSection from "@/components/features/landing/trending-plazzes-section";
import { plazzeLib } from "@/libs/api";

export default async function Home() {
  const plazzes = await plazzeLib.getPlazzes({
    per_page: 5,
    page: 1,
  });
  ({
    per_page: 5,
    page: 1,
  });

  return (
    <main className="min-h-screen">
      <HeroSection plazzes={plazzes} />
      <FeaturesSection />
      <TrendingPlazzesSection trendingPlazzes={plazzes} />
      <CategoriesSection />
      <CTASection />
      <ScrollToTop />
    </main>
  );
}
