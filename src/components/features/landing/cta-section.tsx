import Link from "next/link";
import { Button } from "antd";
import { LogoIcon } from "@/components/common/ui/logos/logo-icon";
import { ROUTES } from "@/consts/routes";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 85%)" }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Tienes un plazze? <br />
              <span className="text-white/90">Es momento de crecer</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-md">
              Se un plazzer y forma parte de la red de locales más grande.
              Aumenta tu visibilidad y llega a más clientes.
            </p>
            <Link href={ROUTES.ADMIN.PLAZZES}>
              <Button
                size="large"
                className="px-8 py-6 h-auto !text-primary hover:!text-primary/90 bg-white hover:bg-white/95 border-0 rounded-xl text-lg font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                Registra tu plazze ahora
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="w-full max-w-sm aspect-square rounded-full bg-white/20 backdrop-blur-md shadow-inner flex items-center justify-center">
              <div className="w-4/5 h-4/5 rounded-full bg-white/30 backdrop-blur-lg shadow-lg flex items-center justify-center">
                <LogoIcon className="w-24 h-24 md:w-32 md:h-32 text-white drop-shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
