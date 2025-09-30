import Link from "next/link";
import { Logo } from "@/components/common/ui/logos/logo";
import { socialLinks } from "./footer-data";
import { ROUTES } from "@/consts/routes";

const FooterBrand = () => {
  return (
    <div className="col-span-1 md:col-span-2">
      <Link href={ROUTES.PUBLIC.HOME} className="flex items-center mb-4">
        <Logo className="h-8 w-auto text-black" />
      </Link>
      <p className="text-gray-600 text-sm leading-relaxed max-w-md">
        Plazze es la plataforma donde encuentras y reservas espacios únicos para
        eventos, reuniones, talleres y experiencias inolvidables 🎉
      </p>
      <div className="flex space-x-4 mt-6">
        {socialLinks.map(({ name, href, icon: Icon }) => {
          return (
            <Link
              key={name}
              href={href}
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FooterBrand;
