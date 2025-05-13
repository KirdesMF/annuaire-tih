import { Link } from "@tanstack/react-router";
import { Separator } from "radix-ui";
import img from "~/assets/img/FINDAJOB.jpg?url";
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-accent text-accent-foreground mt-auto">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex justify-between gap-4">
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
            <div className="space-y-2">
              <p className="text-xs font-light">Partenaire:</p>
              <div className="w-24">
                <img src={img} alt="logo" className="size-full object-contain" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-light">Illustrations:</p>
              <a href="mailto:zelia.grvl@gmail.com" className="underline underline-offset-2">
                Zélia GOURVILLE
              </a>
            </div>
          </div>
        </div>

        <Separator.Root className="my-8 h-px bg-border" />

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
