import { Link, linkOptions } from "@tanstack/react-router";

const LINKS = linkOptions([
  { label: "À propos", to: "/about" },
  { label: "Partenaires", to: "/partners" },
  { label: "Sources", to: "/sources" },
  { label: "FAQ", to: "/faq" },
]);

export function MainNav() {
  return (
    <nav className="hidden md:flex" aria-label="Navigation principale">
      <ul className="flex items-stretch gap-0 self-stretch">
        {LINKS.map((link) => (
          <li key={link.to} className="flex">
            <Link
              to={link.to}
              activeOptions={{ exact: true }}
              className="flex items-center px-5 text-nowrap text-sm font-extrabold uppercase tracking-tight transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[status=active]:text-primary lg:px-6"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
