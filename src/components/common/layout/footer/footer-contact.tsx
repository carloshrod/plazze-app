import { contactInfo } from "./footer-data";

const FooterContact = () => {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">
        <span className="border-b-2 border-b-primary">Contáctanos</span>
      </h3>
      <ul className="space-y-2">
        {contactInfo.map(({ icon: Icon, text }) => (
          <li key={text}>
            <span className="inline-flex gap-1 text-gray-600 text-sm">
              <Icon size={16} /> {text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterContact;
