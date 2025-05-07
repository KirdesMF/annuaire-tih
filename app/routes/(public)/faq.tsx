import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Accordion } from "radix-ui";

export const Route = createFileRoute("/(public)/faq")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="px-4 py-6 min-h-svh">
      <div className="max-w-4xl mx-auto pt-24">
        <h1 className="text-4xl font-bold tracking-tighter mb-12">Foire aux questions</h1>

        <Accordion.Root collapsible type="single" className="rounded-sm border border-border">
          <Accordion.Item value="item-1" className="border-b border-border">
            <Accordion.Header asChild>
              <h2>
                <Accordion.Trigger className="px-2 py-1.5 text-lg font-bold text-start flex items-center justify-between w-full group">
                  <span>Qu'est ce qu'un·e travailleur·se indépendant·e handicapé·e (TIH) ?</span>
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </h2>
            </Accordion.Header>
            <Accordion.Content className="px-3 py-2 space-y-2 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Le statut de Travailleur Indépendant Handicapé (TIH), statut reconnu dans la loi
                depuis 2015-2016 avec la loi dite Macron, concerne tous les entrepreneurs·ses en nom
                propre ou dirigeant·e·s de société disposant d'une reconnaissance de handicap. C'est
                un statut de fait, ne nécessitant pas d'agrément.
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Les auto-entrepreneurs·ses et autres travailleurs·ses non salarié·e·s (gérant·e·s de
                EIRL, EURL, SARL, SAS, SASU, professions libérales, artisan·e·s, commerçant·e·s)
                bénéficient automatiquement du statut de TIH lorsqu'ils sont reconnus comme
                Travailleurs Handicapés (Personne bénéficiant d'une RQTH).
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                La demande d'une Reconnaissance de la Qualité de Travailleur·se Handicapé·e (RQTH)
                se fait auprès de votre MDPH (maison départementale des personnes handicapées).
              </p>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-2" className="border-b border-border">
            <Accordion.Header asChild>
              <h2>
                <Accordion.Trigger className="px-2 py-1.5 text-lg font-bold text-start flex items-center justify-between w-full group">
                  <span>Pourquoi un référencement des tih ?</span>
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </h2>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-3 space-y-2 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Notre annuaire de référencement gratuit et public est conçu pour booster la
                visibilité et le réseau professionnel des TIH.
              </p>

              <figure>
                <figcaption className="text-md font-bold">Les avantages:</figcaption>
                <ul className="list-disc list-outside ps-6">
                  <li className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                    Promotion des entrepreneur·e·s bénéficiant du statut TIH, statut aujourd'hui
                    encore méconnu.
                  </li>
                  <li className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                    Développement d'une communauté permettant le partage d'informations et
                    d'opportunités.
                  </li>
                  <li className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                    Collaborations direct avec des partenaires sensibilisés à l'importance et à
                    l'interêt d'inclure les personnes handicapées/en situation de handicap dans le
                    monde du travail.
                  </li>
                  <li className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                    L'annuaire représente un vivier de TIH couvrant des secteurs d'activité variés
                    et présents sur tout le territoire.
                  </li>
                </ul>
              </figure>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-3" className="border-b border-border">
            <Accordion.Header asChild>
              <h2>
                <Accordion.Trigger className="px-2 py-1.5 text-lg font-bold text-start flex items-center justify-between w-full group">
                  <span>Quelles cibles pour cet annuaire tih ?</span>
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </h2>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-3 space-y-2 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Nous ciblons une large gamme d'entreprises engagées dans l'inclusion des
                travailleurs·ses handicapé·e·s, de tous secteurs d'activité, mais pas seulement: de
                nombreux TIH proposent leurs services aux particuliers également.
              </p>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-4" className="border-b border-border">
            <Accordion.Header asChild>
              <h2>
                <Accordion.Trigger className="px-2 py-1.5 text-lg font-bold text-start flex items-center justify-between w-full group">
                  <span>Sous-traiter avec un TIH permet-il de réduire la contribution OETH ?</span>
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </h2>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-3 space-y-2 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Sous-traiter avec un TIH c'est sous-traiter auprès du secteur protégé/adapté:
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
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
                className="text-blue-500 underline text-sm font-light"
              >
                Lien vers la fiche explicative de l'AGEFIPH sur la déclaration de ces déductions sur
                la contribution OETH
              </a>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-5">
            <Accordion.Header asChild>
              <h2>
                <Accordion.Trigger className="px-2 py-1.5 text-lg font-bold text-start flex items-center justify-between w-full group">
                  <span>
                    Quelles sont les démarches à effectuer par le TIH afin que l'entreprise cliente
                    puisse bénéficier d'une déduction ?
                  </span>
                  <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                </Accordion.Trigger>
              </h2>
            </Accordion.Header>
            <Accordion.Content className="px-2 pb-3 space-y-2 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                Lors de l'emploi de vos services par une entreprise de plus de 20 salariés, vous
                devez leur fournir, une fois par an, et pour chaque entreprise cliente, une
                attestation de déductibilité.
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed text-pretty">
                L'attestation devra comporter le montant total des factures acquittées l'année
                précédente, ainsi que le montant à en déduire (coûts de matières premières, des
                produits, des matériaux, de la sous-traitance, des consommations intermédiaires et
                des frais de vente et de commercialisation correspondants à ces factures).
              </p>

              <p className="text-muted-foreground text-md font-light">
                En tant que TIH, il vous appartient de vérifier votre validité RQTH auprès de la
                MDPH de votre département.
              </p>

              <a
                href="https://www.legifrance.gouv.fr/download/pdf?id=qQZvjpD5KEWkBEm4pRiZisucBpgrpT_3e6KmHkSQ4Zw="
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm font-light"
              >
                Lien vers l'arreté qui définit le modèle à utiliser.
              </a>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </main>
  );
}
