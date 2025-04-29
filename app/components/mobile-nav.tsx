import { Link, linkOptions } from "@tanstack/react-router";
import { useState } from "react";
import { MenuIcon } from "./icons/menu";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./ui/drawer";

const LINKS = linkOptions([
  { label: "Accueil", to: "/" },
  { label: "Qui sommes-nous ?", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Sources", to: "/sources" },
  { label: "Contact", to: "/contact" },
  { label: "Se référencer", to: "/sign-up" },
  { label: "Se connecter", to: "/sign-in" },
]);

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button type="button" className="md:hidden grid place-items-center cursor-pointer">
          <MenuIcon />
        </button>
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
                  className="text-sm font-light text-nowrap px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex w-full"
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
