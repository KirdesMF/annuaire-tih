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
    <nav className="hidden md:flex" aria-label="Navigation principale">
      <ul className="flex items-center gap-1">
        <li className="shrink-0">
          <Link to="/" className="flex items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <img src={annuaire} alt="Annuaire TIH" className="size-10 shrink-0 rounded-md" />
          </Link>
        </li>
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="rounded-md px-2 py-1 text-nowrap text-sm font-light transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[status=active]:font-bold data-[status=active]:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
