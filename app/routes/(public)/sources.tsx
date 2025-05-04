import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "radix-ui";

export const Route = createFileRoute("/(public)/sources")({
  component: RouteComponent,
});

const USEFUL_LINKS = [
  { label: "Groupe de réseautage LinkedIn", url: "https://www.linkedin.com/groups/13011531/" },
  {
    label: "Association partenaire",
    url: "https://www.linkedin.com/company/findajob-les-rencontres-handicap-sport-emploi/",
  },
  { label: "Agefiph", url: "https://www.agefiph.fr/" },
  { label: "Faire une demande MDPH", url: "https://mdphenligne.cnsa.fr/" },
  { label: "Cap Emploi", url: "https://www.capemploi.info/" },
  { label: "H'up entrepreneurs", url: "https://h-up.fr/" },
  { label: "Plateforme TIH-LEARNING", url: "https://bs.linklusion.fr/tih-learning.fr/" },
];

const DOCUMENTS = [
  {
    label: "GUIDE de l'OETH Obligation d'Emploi des Travailleurs Handicapés de l'URSSAFF",
    url: "https://www.urssaf.fr/files/live/sites/urssaffr/files/outils-documentation/guides/Guide-OETH.pdf",
  },
  {
    label:
      "Fiche explicative de l'AGEFIPH sur la déclaration des déductions sur la contribution OETH",
    url: "https://www.agefiph.fr/sites/default/files/medias/fichiers/2021-03/FICHE%204%20-%20CONTRATS%20EA%20ESAT%20TIH%20EPS2021.docx.pdf",
  },
  {
    label: "Publication au journal officiel définissant le modèle d'attestation de déductibilité",
    url: "https://www.legifrance.gouv.fr/download/pdf?id=qQZvjpD5KEWkBEm4pRiZisucBpgrpT_3e6KmHkSQ4Zw=",
  },
];

function RouteComponent() {
  return (
    <main className="px-4 py-6">
      <h1 className="sr-only">Sources</h1>
      <section className="max-w-6xl mx-auto pt-24">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-4xl font-bold tracking-tighter">Liens utiles</h2>
          <p className="text-muted-foreground text-md font-light leading-relaxed">
            Voici les liens utiles pour les entreprises et les associations.
          </p>
        </div>

        <ul className="list-disc list-inside flex flex-col gap-2">
          {USEFUL_LINKS.map((link) => (
            <li key={link.url}>
              <span className="font-bold">{link.label}: </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-light underline"
              >
                {link.url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Separator.Root className="my-16 h-px w-1/3 mx-auto bg-border" />

      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-4xl font-bold tracking-tighter">Documents</h2>
          <p className="text-muted-foreground text-md font-light leading-relaxed">
            Voici les documents utiles pour les entreprises et les associations.
          </p>
        </div>

        <div className="flex flex-col gap-4 items-center p-4 w-fit ">
          <ul className="list-disc list-inside">
            {DOCUMENTS.map((document) => (
              <li key={document.url}>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-light underline"
                >
                  {document.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
