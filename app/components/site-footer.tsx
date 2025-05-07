import { Link } from "@tanstack/react-router";
import img from "~/assets/img/FINDAJOB.jpg?url";
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-accent text-accent-foreground mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex justify-between gap-4">
          <ul className="flex flex-col gap-2 text-xs list-disc">
            <li>
              Besoin d'aide ? Des questions ?{" "}
              <a href="mailto:contact@annuaire-tih.fr" className="underline">
                contact@annuaire-tih.fr
              </a>
            </li>
            <li>
              Rejoignez-nous sur{" "}
              <a href="https://www.linkedin.com/groups/13011531/" className="underline">
                Linkedin
              </a>
            </li>
            <li>
              <Link to="/sources" className="underline">
                Sources
              </Link>
            </li>
            <li>
              <Link to="/cgu" className="underline">
                Mentions légales - CGU
              </Link>
            </li>
            <li>
              <Link to="/faq" className="underline">
                FAQ
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-6 text-xs">
            <div className="space-y-2">
              <p className="text-xs font-light">Partenaire:</p>
              <div className="w-24">
                <img src={img} alt="logo" className="size-full object-contain" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-light">Illustrations:</p>
              <a href="mailto:contact@annuaire-tih.fr" className="underline underline-offset-2">
                Zélia GOURVILLE
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
