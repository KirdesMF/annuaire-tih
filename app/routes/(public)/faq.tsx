import { createFileRoute } from "@tanstack/react-router";
import banner from "~/assets/img/banniere.png?url";
import logo from "~/assets/img/Logo vecto_png.png?url";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/(public)/faq")({
  head: () =>
    seo({
      title: "Foire aux questions",
      description:
        "Questions fréquentes sur le statut TIH, la RQTH, l'annuaire et les démarches pour les travailleurs indépendants handicapés.",
      path: "/faq",
    }),
  component: RouteComponent,
});

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

      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <h1 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
          Foires aux questions
        </h1>

        <Accordion defaultValue={["item-1"]} className="space-y-3">
          <AccordionItem value="item-1" className="border-0">
            <h2>
              <AccordionTrigger className="bg-primary px-4 py-4 text-start text-sm font-medium text-primary-foreground">
                <span>Qu'est ce qu'un·e travailleur·se indépendant·e handicapé·e (TIH) ?</span>
              </AccordionTrigger>
            </h2>
            <AccordionContent className="flex flex-col gap-4 px-8 py-8 text-sm leading-snug">
              <p>
                Le statut de Travailleur Indépendant Handicapé (TIH), statut reconnu dans la loi
                depuis 2015-2016 avec la loi dite Macron, concerne tous les entrepreneurs·ses en nom
                propre ou dirigeant·e·s de société disposant d'une reconnaissance de handicap. C'est
                un statut de fait, ne nécessitant pas d'agrément.
              </p>

              <p>
                Les auto-entrepreneurs·ses et autres travailleurs·ses non salarié·e·s (gérant·e·s de
                EIRL, EURL, SARL, SAS, SASU, professions libérales, artisan·e·s, commerçant·e·s)
                bénéficient automatiquement du statut de TIH lorsqu'ils sont reconnus comme
                Travailleurs Handicapés (Personne bénéficiant d'une RQTH).
              </p>

              <p>
                La demande d'une Reconnaissance de la Qualité de Travailleur·se Handicapé·e (RQTH)
                se fait auprès de votre MDPH (maison départementale des personnes handicapées).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-0">
            <h2>
              <AccordionTrigger className="bg-secondary px-4 py-4 text-start text-sm font-medium text-secondary-foreground">
                <span>Pourquoi un référencement des TIH ?</span>
              </AccordionTrigger>
            </h2>
            <AccordionContent className="flex flex-col gap-4 px-8 py-8 text-sm leading-snug">
              <p>
                Notre annuaire de référencement gratuit et public est conçu pour booster la
                visibilité et le réseau professionnel des TIH.
              </p>

              <figure>
                <figcaption className="font-bold">Les avantages:</figcaption>
                <ul className="list-disc list-outside ps-6">
                  <li>
                    Promotion des entrepreneur·e·s bénéficiant du statut TIH, statut aujourd'hui
                    encore méconnu.
                  </li>
                  <li>
                    Développement d'une communauté permettant le partage d'informations et
                    d'opportunités.
                  </li>
                  <li>
                    Collaborations direct avec des partenaires sensibilisés à l'importance et à
                    l'interêt d'inclure les personnes handicapées/en situation de handicap dans le
                    monde du travail.
                  </li>
                  <li>
                    L'annuaire représente un vivier de TIH couvrant des secteurs d'activité variés
                    et présents sur tout le territoire.
                  </li>
                </ul>
              </figure>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-0">
            <h2>
              <AccordionTrigger className="bg-secondary px-4 py-4 text-start text-sm font-medium text-secondary-foreground">
                <span>Quelles cibles pour cet annuaire TIH ?</span>
              </AccordionTrigger>
            </h2>
            <AccordionContent className="px-8 py-8 text-sm leading-snug">
              <p>
                Nous ciblons une large gamme d'entreprises engagées dans l'inclusion des
                travailleurs·ses handicapé·e·s, de tous secteurs d'activité, mais pas seulement: de
                nombreux TIH proposent leurs services aux particuliers également.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-0">
            <h2>
              <AccordionTrigger className="bg-secondary px-4 py-4 text-start text-sm font-medium text-secondary-foreground">
                <span>Sous-traiter avec un TIH permet-il de réduire la contribution OETH ?</span>
              </AccordionTrigger>
            </h2>
            <AccordionContent className="flex flex-col gap-4 px-8 py-8 text-sm leading-snug">
              <p>Sous-traiter avec un TIH c'est sous-traiter auprès du secteur protégé/adapté:</p>

              <p>
                L'entreprise qui emploie un TIH, en plus d'effectuer une démarche RSE, peut déduire
                de sa contribution brute AGEFIPH/FIPHFP chaque année 30% du coût total de la main
                d'œuvre réglé au TIH au cours de l'année (dans la limite de 50% ou de 75% de leur
                contribution totale). Cette contribution est obligatoire pour toutes les entreprises
                (de plus de 20 salariés pendant plus de 5 ans), à moins que plus de 6% de leur
                effectif soit reconnu comme travailleurs·ses handicapé·e·s.
              </p>

              <a
                href="https://www.agefiph.fr/sites/default/files/medias/fichiers/2021-03/FICHE%204%20-%20CONTRATS%20EA%20ESAT%20TIH%20EPS2021.docx.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Lien vers la fiche explicative de l'AGEFIPH sur la déclaration de ces déductions sur
                la contribution OETH
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-0">
            <h2>
              <AccordionTrigger className="bg-secondary px-4 py-4 text-start text-sm font-medium text-secondary-foreground">
                <span>
                  Quelles sont les démarches à effectuer par le TIH afin que l'entreprise cliente
                  puisse bénéficier d'une déduction ?
                </span>
              </AccordionTrigger>
            </h2>
            <AccordionContent className="flex flex-col gap-4 px-8 py-8 text-sm leading-snug">
              <p>
                Lors de l'emploi de vos services par une entreprise de plus de 20 salariés, vous
                devez leur fournir, une fois par an, et pour chaque entreprise cliente, une
                attestation de déductibilité.
              </p>

              <p>
                L'attestation devra comporter le montant total des factures acquittées l'année
                précédente, ainsi que le montant à en déduire (coûts de matières premières, des
                produits, des matériaux, de la sous-traitance, des consommations intermédiaires et
                des frais de vente et de commercialisation correspondants à ces factures).
              </p>

              <p>
                En tant que TIH, il vous appartient de vérifier votre validité RQTH auprès de la
                MDPH de votre département.
              </p>

              <a
                href="https://www.legifrance.gouv.fr/download/pdf?id=qQZvjpD5KEWkBEm4pRiZisucBpgrpT_3e6KmHkSQ4Zw="
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Lien vers l'arreté qui définit le modèle à utiliser.
              </a>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
