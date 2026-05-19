import { Link, linkOptions } from "@tanstack/react-router";
import { AlignLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./ui/drawer";

const LINKS = linkOptions([
  { label: "Accueil", to: "/" },
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "Partenaires", to: "/partners" },
  { label: "Sources", to: "/sources" },
  { label: "FAQ", to: "/faq" },
  { label: "Se référencer", to: "/sign-up" },
  { label: "Se connecter", to: "/sign-in" },
]);

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="md:hidden">
          <AlignLeft data-icon="inline-start" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerTitle className="sr-only">Menu</DrawerTitle>
        <DrawerDescription className="sr-only">Navigation principale</DrawerDescription>
        <nav>
          <ul className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex w-full text-nowrap rounded-md px-4 py-2 text-sm font-light outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
