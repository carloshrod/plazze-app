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
      <div id="hero">
        <HeroSection />
      </div>
      <div id="caracteristicas">
        <FeaturesSection />
      </div>
      <BannersCarousel position="features" />
      <div id="destacados">
        <FeaturedPlazzesSection />
      </div>
      <div id="populares">
        <TrendingPlazzesSection />
      </div>
      <BannersCarousel position="trending" />
      <div id="categorias">
        <CategoriesSection />
      </div>
      <div id="plazzer">
        <CTASection />
      </div>
      <ScrollToTop />
    </main>
  );
}
