import Image from "next/image";

const FooterCredits = () => {
  return (
    <>
      <p className="text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Plazze. Todos los derechos reservados.
      </p>
      <div className="text-center mt-4">
        <span className="inline-flex items-center text-gray-500 text-xs">
          Desarrollado con ♥️ por
          <a
            href="https://chrod.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex ms-1 font-semibold hover:text-primary"
          >
            <Image
              src="/chrod-logo.png"
              alt="CHRod logo"
              width={36}
              height={28}
            />
          </a>
        </span>
      </div>
    </>
  );
};

export default FooterCredits;
