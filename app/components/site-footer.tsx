import { Link } from "@tanstack/react-router";
import { Separator } from "~/components/ui/separator";
import img from "~/assets/img/FINDAJOB.jpg?url";
import logoTIHM from "~/assets/img/logoTIHM.png?url";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 md:px-8 md:py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <ul className="flex flex-col gap-2 text-xs list-disc list-inside">
            <li>
              Besoin d'aide ? Des questions ?{" "}
              <a href="mailto:annuairetih@gmail.com" className="underline">
                annuairetih@gmail.com
              </a>
            </li>
            <li>
              Rejoignez-nous sur{" "}
              <a
                href="https://www.linkedin.com/groups/13011531/"
                target="_blank"
                rel="noreferrer noopener"
                className="underline"
              >
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
            <div className="flex flex-col gap-2">
              <p className="text-xs font-light">Partenaires:</p>
              <div className="w-24">
                <img src={img} alt="logo" className="size-full object-contain" />
              </div>

              <div className="w-24">
                <a href="https://www.tihm.urssaf.fr/" target="_blank" rel="noopener noreferrer">
                  <img src={logoTIHM} alt="logo TIHM" className="size-full object-contain" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-light">Illustrations:</p>
              <a href="mailto:zelia.grvl@gmail.com" className="underline underline-offset-2">
                Zélia GOURVILLE
              </a>
            </div>
          </div>
        </div>

        <Separator />

        <p className="text-xs font-light">
          Si vous n'arrivez pas à accéder à un contenu ou à un service, et pour être orienté vers
          une alternative accessible ou obtenir le contenu sous une autre forme, vous pouvez
          contacter{" "}
          <a href="mailto:annuairetih@gmail.com" className="underline">
            annuairetih@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
