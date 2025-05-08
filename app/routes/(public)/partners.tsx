import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "radix-ui";
import findajob from "~/assets/img/FINDAJOB.jpg?url";

export const Route = createFileRoute("/(public)/partners")({
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
    <main className="px-4 py-6">
      <div className="py-20 max-w-4xl mx-auto">
        <h1 className="sr-only">Partenaires et remerciements</h1>
        <section>
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-4xl font-bold tracking-tighter">Remerciements</h2>
            <p className="text-muted-foreground text-md font-light leading-relaxed">
              Nous souhaitons remercier les partenaires qui ont soutenu{" "}
              <span className="font-bold">l'annuaire-tih.fr</span> en participant au financement
              collaboratif.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-center p-4 w-fit ">
            <ul className="list-disc list-inside">
              {PERSONS.map((person) => (
                <li key={person}>{person}</li>
              ))}
            </ul>
          </div>
        </section>
        <Separator.Root className="my-16 h-px w-1/3 mx-auto bg-border" />
        <section>
          <div className="flex flex-col gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold tracking-tighter">Partenariats</h2>
              <p className="text-muted-foreground text-md font-light leading-relaxed">
                L'association{" "}
                <span className="font-bold">"Les Rencontres Handicap Sport & Emploi"</span> promeut
                l'annuaire-tih.fr lors des évènements <span className="font-bold">FindaJob</span> et{" "}
                <span className="font-bold">Le Relais-Universel</span> !
              </p>
            </div>
            <div className="border border-border rounded-sm w-1/2">
              <img
                src={findajob}
                alt="FindaJob"
                className="w-full h-full object-cover rounded-sm dark:brightness-85"
              />
            </div>
          </div>
        </section>
        <Separator.Root className="my-16 h-px w-1/3 mx-auto bg-border" />
        <section>
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-4xl font-bold tracking-tighter">Illustrations</h2>
            <p className="text-muted-foreground text-md font-light leading-relaxed">
              Toutes les illustrations ont été réalisées bénévolement par{" "}
              <a href="mailto:zelia.grvl@gmail.com" className="underline underline-offset-2">
                Zelia GOURVILLE
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
