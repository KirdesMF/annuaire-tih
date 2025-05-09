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
      <ul className="flex items-center gap-1">
        <li className="shrink-0">
          <Link to="/" className="flex items-center justify-center">
            <img src={annuaire} alt="Annuaire TIH" className="w-10 shrink-0" />
          </Link>
        </li>
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm font-light text-nowrap focus:outline-primary focus:outline-2 px-1.5 py-1 rounded-xs data-[status=active]:text-primary data-[status=active]:font-bold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
