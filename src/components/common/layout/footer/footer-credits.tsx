import { LuGithub } from "react-icons/lu";

const FooterCredits = () => {
  return (
    <>
      <p className="text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Plazze. Todos los derechos reservados.
      </p>
      <div className="text-center mt-4">
        <span className="inline-flex text-gray-500 text-sm">
          Desarrollado con 💚 por
          <a
            href="https://github.com/carloshrod"
            target="_blank"
            rel="noopener noreferrer"
            className="flex ms-1 font-semibold hover:text-primary"
          >
            CHRod <LuGithub size={16} />
          </a>
        </span>
      </div>
    </>
  );
};

export default FooterCredits;
