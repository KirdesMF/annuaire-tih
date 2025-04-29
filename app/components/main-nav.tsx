import { Link, linkOptions } from "@tanstack/react-router";

const LINKS = linkOptions([
  { label: "Accueil", to: "/" },
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Sources", to: "/sources" },
  { label: "Contact", to: "/contact" },
]);

export function MainNav() {
  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center gap-4">
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm font-light text-nowrap"
              activeProps={{
                className: "data-[status=active]:text-primary data-[status=active]:font-bold",
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
