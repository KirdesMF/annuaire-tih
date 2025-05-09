import { Link, linkOptions } from "@tanstack/react-router";
import annuaire from "~/assets/img/annuaire.webp?url";

const LINKS = linkOptions([
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "Partenaires ", to: "/partners" },
  { label: "Sources", to: "/sources" },
  { label: "FAQ", to: "/faq" },
]);

export function MainNav() {
  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center gap-3">
        <li>
          <Link to="/" className="flex items-center gap-2">
            <img src={annuaire} alt="Annuaire TIH" className="h-10 drop-shadow-lg" />
          </Link>
        </li>
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm font-light text-nowrap focus:outline-primary focus:outline-2  px-1.5 py-1 rounded-xs data-[status=active]:text-primary data-[status=active]:font-bold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
