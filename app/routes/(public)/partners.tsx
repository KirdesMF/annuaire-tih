import { createFileRoute } from "@tanstack/react-router";
import banner from "~/assets/img/banniere.png?url";
import findajob from "~/assets/img/FINDAJOB.jpg?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/(public)/partners")({
  head: () =>
    seo({
      title: "Partenaires",
      description:
        "Partenaires et remerciements de l'Annuaire TIH, projet dédié à la visibilité des entrepreneur·euses en situation de handicap.",
      path: "/partners",
    }),
  component: RouteComponent,
});

const PERSONS = [
  "Didier BEAL",
  "Yoann POMATA",
  "Jean-François JULLIEN",
  "Emma POUCLET MARTIN",
  "Sandrine VIGIER",
  "Fatima LOGHMARI",
  "Simone THIERO",
  "Solène NICOLAS",
  "Michel COLLIN",
  "Sylvie LE GUENNIC",
];

function RouteComponent() {
  return (
    <main className="bg-background text-foreground">
      <section className="pt-16 text-center md:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pb-10 md:pb-12">
          <img src={logo} alt="Annuaire TIH" className="mb-8 h-32 w-auto md:h-44" />
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Annuaire - TIH</h1>
          <p className="mt-5 text-2xl font-light md:text-4xl">
            Votre réseau de prestataires indépendants TIH*.
          </p>
        </div>

        <img
          src={banner}
          alt="Illustration Annuaire TIH"
          className="h-40 w-full object-cover object-center md:h-72"
        />
      </section>

      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <h1 className="sr-only">Partenaires et remerciements</h1>

        <section>
          <h2 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
            Remerciements
          </h2>
          <p className="text-sm leading-snug">
            Nous souhaitons remercier les partenaires qui ont soutenu{" "}
            <span className="font-bold">l'annuaire-tih.fr</span> en participant au financement
            collaboratif.
          </p>

          <ul className="mt-8 text-sm leading-snug">
            {PERSONS.map((person) => (
              <li key={person}>{person}</li>
            ))}
          </ul>
        </section>

        <section className="mt-24">
          <h2 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
            Partenaires
          </h2>
          <p className="text-sm leading-snug">
            L’association{" "}
            <span className="font-bold">« Les Rencontres Handicap Sport & Emploi »</span> promeut
            l’annuaire-tih.fr lors des évènements <span className="font-bold">FindaJob</span> et{" "}
            <span className="font-bold">Le Relais-Universel</span> !
          </p>

          <div className="mt-10 w-full max-w-md bg-card p-4">
            <img src={findajob} alt="FindaJob" className="h-auto w-full object-contain" />
          </div>
        </section>

        <section className="mt-24">
          <h2 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
            Graphisme et illustration
          </h2>
          <div className="space-y-6 text-sm leading-snug">
            <p>
              Toutes les illustrations ont été réalisées bénévolement par{" "}
              <a href="mailto:zelia.grvl@gmail.com" className="underline underline-offset-2">
                Zelia GOURVILLE
              </a>
              .
            </p>
            <p>
              La refonte graphique du site a été réalisée bénévolement par{" "}
              <a href="mailto:tracy.salame@gmail.com" className="underline underline-offset-2">
                Tracy SALAME
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
