import FooterBrand from "./footer-brand";
import FooterLinks from "./footer-links";
import FooterContact from "./footer-contact";
import FooterCredits from "./footer-credits";
import { cn } from "@/lib/utils";

const Footer = ({ isDashboard = false }: { isDashboard?: boolean }) => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          isDashboard ? "py-4" : "py-8"
        )}
      >
        {!isDashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FooterBrand />
            <FooterLinks />
            <FooterContact />
          </div>
        )}

        <div
          className={cn(!isDashboard && "border-t border-gray-200 mt-8 pt-8")}
        >
          <FooterCredits />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
