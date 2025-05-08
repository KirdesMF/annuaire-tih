import { Link, createFileRoute } from "@tanstack/react-router";
import { Separator } from "radix-ui";

export const Route = createFileRoute("/(public)/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="px-4 py-6">
      <div className="py-20">
        <h1 className="sr-only">A propos</h1>
        <section className="max-w-4xl mx-auto">
          <div className="flex flex-col mb-8">
            <h2 className="text-4xl font-bold tracking-tighter mb-8">À propos</h2>
            <div className="space-y-6">
              <p className="text-muted-foreground text-md font-light leading-relaxed">
                <span className="font-bold">"ANNUAIRE TIH"</span> est un annuaire national
                référençant des entrepreneurs·ses ou des dirigeant·e·s de société qui disposent
                d'une reconnaissance de handicap. Notre mission est de promouvoir les
                freelances/travailleurs·ses indépendant·e·s en situation de handicap en France et
                DROM-COM.
              </p>
              <p className="text-muted-foreground text-md font-light leading-relaxed">
                Le nombre de TIH en France serait estimé à plus de 70 000. Dans l'idée de regrouper
                ces talents afin d'augmenter leur visibilité, le groupe LinkedIn{" "}
                <a
                  href="https://www.linkedin.com/groups/13011531/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-blue-500"
                >
                  Réseautage Freelance/Travailleurs Indépendants Handicapés (TIH)
                </a>{" "}
                a été créé par <span className="font-bold">Freya</span> en avril 2024.
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed">
                Pour faciliter les échanges autour de leurs métiers, les partages de services, les
                réseaux et les opportunités, la suite logique a été de lancer un annuaire, qui a vu
                le jour en octobre 2024 et a regroupé plus de 40 entrepreneurs·ses en quelques mois.
                <span className="font-bold"> Sandrine</span> propose en début d'année 2025 un
                nouveau format en concevant bénévolement une première version de site webador,
                permettant un meilleur accès aux profils, un classement simplifié et une visibilité
                accrue des TIH.
              </p>

              <p className="text-muted-foreground text-md font-light leading-relaxed">
                En MAI 2025, grâce à un{" "}
                <Link to="/partners" className="font-bold underline text-blue-500">
                  financement collaboratif
                </Link>
                , la version actuelle voit le jour sous forme de site web indépendant et plus
                accessible.
              </p>
              <p className="text-muted-foreground text-md font-light leading-relaxed">
                Nous croyons fermement que favoriser <span className="font-bold">la diversité</span>{" "}
                dans le monde du travail est crucial et que{" "}
                <span className="font-bold">l'inclusion</span> des TIH, entrepreneurs·ses
                productifs·ves et engagé·e·s, apporte performance et innovation.
              </p>
            </div>
          </div>
        </section>
        <Separator.Root className="my-16 h-px w-1/3 mx-auto bg-border" />
        <div className="border border-border bg-card text-card-foreground rounded-sm max-w-2xl mx-auto p-6">
          <p className="text-md font-bold text-center">
            Un grand merci à tous·tes les participant·e·s et aux membres du groupe LinkedIn
            "Réseautage Freelance/Travailleurs Indépendants Handicapés (TIH)"
          </p>
        </div>
      </div>
    </main>
  );
}
