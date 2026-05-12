import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "~/lib/seo";

export const Route = createFileRoute("/(public)/about")({
  head: () =>
    seo({
      title: "À propos",
      description:
        "Découvrez la mission de l'Annuaire TIH : rendre visibles les travailleurs indépendants handicapés et entreprises TIH.",
      path: "/about",
    }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <h2 className="mb-16 text-center text-2xl font-extrabold uppercase tracking-tight">
          À propos
        </h2>
        <div className="space-y-6 text-sm leading-snug">
          <p>
            <span className="font-bold">"ANNUAIRE TIH"</span> est un annuaire national référençant
            des entrepreneurs·ses ou des dirigeant·e·s de société qui disposent d'une reconnaissance
            de handicap. Notre mission est de promouvoir les freelances/travailleurs·ses
            indépendant·e·s en situation de handicap en France et DROM-COM.
          </p>
          <p>
            Le nombre de TIH en France serait estimé à plus de 70 000. Dans l'idée de regrouper ces
            talents afin d'augmenter leur visibilité, le groupe LinkedIn{" "}
            <a
              href="https://www.linkedin.com/groups/13011531/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              Réseautage Freelance/Travailleurs Indépendants Handicapés (TIH)
            </a>{" "}
            a été créé par <span className="font-bold">Freya</span> en avril 2024.
          </p>

          <p>
            Pour faciliter les échanges autour de leurs métiers, les partages de services, les
            réseaux et les opportunités, la suite logique a été de lancer un annuaire, qui a vu le
            jour en octobre 2024 et a regroupé plus de 40 entrepreneurs·ses en quelques mois.
            <span className="font-bold"> Sandrine</span> propose en début d'année 2025 un nouveau
            format en concevant bénévolement une première version de site webador, permettant un
            meilleur accès aux profils, un classement simplifié et une visibilité accrue des TIH.
          </p>

          <p>
            En MAI 2025, grâce à un{" "}
            <Link to="/partners" className="font-bold underline">
              financement collaboratif
            </Link>
            , la version actuelle voit le jour sous forme de site web indépendant et plus
            accessible.
          </p>
          <p>
            Nous croyons fermement que favoriser <span className="font-bold">la diversité</span>{" "}
            dans le monde du travail est crucial et que{" "}
            <span className="font-bold">l'inclusion</span> des TIH, entrepreneurs·ses productifs·ves
            et engagé·e·s, apporte performance et innovation.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl bg-primary p-10 text-primary-foreground">
          <p className="text-center text-sm">
            Un grand merci à tous·tes les participant·e·s et aux membres du groupe LinkedIn
            "Réseautage Freelance/Travailleurs Indépendants Handicapés (TIH)"
          </p>
        </div>
      </section>
    </main>
  );
}
