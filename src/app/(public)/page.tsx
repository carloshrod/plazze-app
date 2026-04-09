import HeroSection from "@/components/features/landing/hero-section";
import FeaturesSection from "@/components/features/landing/features-section";
import CategoriesSection from "@/components/features/landing/categories-section";
import CTASection from "@/components/features/landing/cta-section";
import ScrollToTop from "@/components/common/ui/scroll-to-top";
import TrendingPlazzesSection from "@/components/features/landing/trending-plazzes-section";
import BannersCarousel from "@/components/features/landing/banners-carousel";
import FeaturedPlazzesSection from "@/components/features/landing/featured-plazzes-section";

export default async function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <BannersCarousel position="features" />
      <FeaturedPlazzesSection />
      <TrendingPlazzesSection />
      <BannersCarousel position="trending" />
      <CategoriesSection />
      <CTASection />
      <ScrollToTop />
    </main>
  );
}
