import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Logo } from "../ui/logos/logo";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Logo className="h-8 w-auto text-black" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Plazze es la plataforma donde encuentras y reservas espacios
              únicos para eventos, reuniones, talleres y experiencias
              inolvidables 🎉
            </p>
            <div className="flex space-x-4 mt-6">
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              <span className="border-b-2 border-b-primary">Plataforma</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sitios"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm"
                >
                  Explorar sitios
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm"
                >
                  Para propietarios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              <span className="border-b-2 border-b-primary">Contáctanos</span>
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="inline-flex gap-1 text-gray-600 text-sm">
                  <MapPin size={16} /> Panamá, Costa del Este
                </span>
              </li>
              <li>
                <span className="inline-flex gap-1 text-gray-600 text-sm">
                  <Phone size={16} /> (507) 233-3333
                </span>
              </li>
              <li>
                <span className="inline-flex gap-1 text-gray-600 text-sm">
                  <Mail size={16} /> admin@plazze.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Plazze. Todos los derechos reservados.
          </p>
        </div>

        <div className="text-center mt-4 pt-4">
          <span className="inline-flex text-gray-500 text-sm">
            Desarrollado con 💚 por
            <a
              href="https://github.com/carloshrod"
              target="_blank"
              rel="noopener noreferrer"
              className="flex ms-1 font-semibold hover:text-primary"
            >
              CHRod <Github size={16} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
