import { createFileRoute } from "@tanstack/react-router";
import { SquareArrowOutUpRight } from "lucide-react";
import banner from "~/assets/img/banniere.png?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/(public)/sources")({
  head: () =>
    seo({
      title: "Sources et liens utiles",
      description:
        "Ressources, documents et liens utiles sur le statut TIH, l'OETH, la RQTH et l'entrepreneuriat en situation de handicap.",
      path: "/sources",
    }),
  component: RouteComponent,
});

const USEFUL_LINKS = [
  {
    label: "Groupe de réseautage LinkedIn",
    url: "https://www.linkedin.com/groups/13011531/",
    description:
      "Rejoignez-nous si vous êtes Travailleur·se Indépendant·e et Handicapé·e ! Nous serions plus de 70 000 TIH à proposer nos services en France, regroupons nos talents!",
  },
  {
    label: "Association partenaire",
    url: "https://www.linkedin.com/company/findajob-les-rencontres-handicap-sport-emploi/",
    description:
      "FindaJob un dispositif de l'association les rencontres Handicap, Sport & Emploi » est un moment unique qui rassemble employeurs et personnes en situation de handicap dans le cadre d’un événement handisport ou de rencontres avec de grands sportifs en situation de handicap qui viennent partager leurs valeurs et la richesse de leurs expériences.",
  },
  {
    label: "Agefiph",
    url: "https://www.agefiph.fr/",
    description:
      "L’Agefiph propose des solutions pour l'emploi des personnes en situation de handicap.",
  },
  {
    label: "Faire une demande MDPH",
    url: "https://mdphenligne.cnsa.fr/",
    description:
      "La MDPH, c’est la Maison Départementale pour les Personnes Handicapées. Elle peut répondre aux besoins liés à votre handicap.",
  },
  {
    label: "Cap Emploi",
    url: "https://www.capemploi.info/",
    description:
      "Les missions des Cap emploi, à destination des personnes en situation de handicap et des employeurs, participent et contribuent au développement d’une société plus inclusive pour les personnes en situation de handicap.\n\nLes missions des Cap emploi s’inscrivent en complémentarité avec les autres acteurs de droit commun, les acteurs institutionnels et opérationnels au niveau national, régional et local.",
  },
  {
    label: "H’up entrepreneurs",
    url: "https://h-up.fr/",
    description:
      "H’up accompagne les entrepreneurs en situation de handicap avec une équipe de salariés et plus de 400 bénévoles pour le succès de leur entreprise.",
  },
  {
    label: "Plateforme TIH-LEARNING",
    url: "https://bs.linklusion.fr/tih-learning.fr/",
    description:
      "TIH-Learning, un programme d’information – conseil en ligne à la croisée des problématiques du handicap et de l’entrepreneuriat.",
  },
  {
    label: "Simulateur de déduction sur votre taxe AGEFIPH (par Next Impact Digital)",
    url: "https://www.next-impact.digital/avantage-oeth",
  },
];

const DOCUMENTS = [
  {
    label: "GUIDE de l'OETH Obligation d'Emploi des Travailleurs Handicapés de l'URSSAF",
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
        <h1 className="sr-only">Sources</h1>

        <section>
          <h2 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
            Liens utiles
          </h2>

          <ul className="space-y-12">
            {USEFUL_LINKS.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xl font-extrabold underline underline-offset-2"
                >
                  <span>{link.label}</span>
                  <SquareArrowOutUpRight className="size-4 shrink-0" aria-hidden="true" />
                </a>
                {link.description ? (
                  <div className="mt-6 space-y-4 text-sm leading-snug">
                    {link.description.split("\n\n").map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24">
          <h2 className="mb-12 text-center text-2xl font-extrabold uppercase tracking-tight">
            Documents
          </h2>

          <ul className="space-y-6 text-sm leading-snug">
            {DOCUMENTS.map((document) => (
              <li key={document.url}>
                <a
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 underline underline-offset-2"
                >
                  <span>{document.label}</span>
                  <SquareArrowOutUpRight className="size-3 shrink-0" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
