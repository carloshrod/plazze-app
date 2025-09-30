import Link from "next/link";
import { platformLinks } from "./footer-data";

const FooterLinks = () => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">
        <span className="border-b-2 border-b-primary">Plataforma</span>
      </h3>
      <ul className="space-y-2">
        {platformLinks.map(({ name, href }) => (
          <li key={name}>
            <Link
              href={href}
              className="text-gray-600 hover:text-green-600 transition-colors text-sm"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
