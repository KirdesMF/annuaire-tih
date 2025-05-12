import { createFileRoute } from "@tanstack/react-router";
import { cn } from "~/utils/cn";

export const Route = createFileRoute("/(public)/cgu")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="p-4">
      <div className="max-w-2xl mx-auto py-24">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">
          Conditions générales d'utilisation de annuaire-tih.fr
        </h1>

        <Paragraph>
          Annuaire-tih.fr est un site web fondé et géré bénévolement. Annuaire-tih.fr référencie
          gratuitement et publiquement les entreprises créées par des personnes en situation de
          handicap.
        </Paragraph>

        <Heading as="h2">Préconisations aux utilisateur·trices</Heading>

        <Paragraph>
          Ne transmettez que des données relatives à votre activité professionnelle.
        </Paragraph>
        <Paragraph>Ne divulguez aucune information pouvant vous porter préjudice.</Paragraph>
        <Paragraph>
          Vous pouvez à tout moment corriger, compléter ou supprimer vos informations via votre
          espace personnel ou en contactant{" "}
          <a href="mailto:annuairetih@gmail.com" className="text-blue-500 underline">
            annuairetih@gmail.com
          </a>
        </Paragraph>

        <Heading as="h2">Adresse mail</Heading>

        <Paragraph>
          L'adresse mail renseignée lors de la création du compte peut-être utilisée pour l'envoi
          des mails de communication et d'information en lien avec vos actions effectuées lors de
          l'utilisation du site annuaire-tih.fr (confirmation d'inscription, renouvellement de votre
          mot de passe... etc)
        </Paragraph>

        <Heading as="h2">Propriété intellectuelle</Heading>

        <Paragraph>
          Toute reproduction, représentation, exploitation de quelque nature que ce soit et à
          quelque fin que ce soit, de tout ou partie de annuaire-tih.fr constitue des actes de
          contrefaçon.
        </Paragraph>

        <Heading as="h2">
          Référencement et déréférencement des entreprises sur le site annuaire-tih.fr
        </Heading>

        <Paragraph>
          Peut être référencé sur annuaire-tih.fr, toute personne disposant d'un numéro de siret et
          déclarant être en situation de handicap, après avoir créé son espace personnel sur le
          site.
        </Paragraph>

        <figure className="mb-4">
          <figcaption className="font-bold mb-4 tracking-tighter">
            1. Je souhaite paraitre sur annuaire-tih.fr
          </figcaption>
          <ul className="list-disc list-outside ps-8 flex flex-col gap-2 text-sm">
            <li>
              Je créé mon espace personnel en cliquant en haut de page sur l'onglet "Se référencer"
            </li>
            <li>
              Une fois mon espace personnel créé, je peux ajouter jusqu'à{" "}
              <span className="font-bold">trois fiches d'entreprise</span>.
            </li>
            <li>
              Chaque fiche d'entreprise est soumise à modération et sera publiée une fois qu'elle
              aura été validée.
            </li>
            <li>Le délai pour la validation d'une fiche est de 7 jours maximum.</li>
          </ul>
        </figure>

        <figure className="mb-4">
          <figcaption className="font-bold mb-4 tracking-tighter">
            Le référencement sur le site annuaire-tih.fr concerne exclusivement les
            professionnel·e·s c'est-à-dire des entreprises pouvant fournir :
          </figcaption>

          <ul className="list-disc list-outside ps-8 flex flex-col gap-2 text-sm">
            <li>Une raison sociale</li>
            <li>Un numéro SIRET actif</li>
          </ul>
        </figure>

        <Paragraph className="font-bold">
          Chaque entrepreneur·se référencé·e déclare sur honneur être en situation de handicap et
          être en mesure de fournir un justificatif de reconnaissance de son handicap auprès de ses
          entreprises clientes lorsqu'il·elle coche "OUI" à la question "RQTH à jour" lors de la
          création de sa/ses fiche(s) entreprise.
        </Paragraph>

        <figure className="mb-4">
          <figcaption className="font-bold mb-4 tracking-tighter">
            2. Je ne souhaite plus paraître
          </figcaption>
          <ul className="list-disc list-outside ps-8 flex flex-col gap-2 text-sm">
            <li>
              Je peux supprimer chaque fiche entreprise à partir de mon espace personnel dans le
              menu "Mes entreprises".
            </li>
            <li>
              Je peux demander à ce que ma/mes fiche(s) entreprise soi(en)t mise(s) en pause et
              n'apparaisse(nt) plus temporairement sur annuaire-tih.fr , pour cela je contacte
              annuairetih@gmail.com
            </li>
            <li>
              Je peux supprimer mon compte depuis mon espace personnel dans le menu "Mes
              préférences". Cette action supprimera définitivement votre espace personnel ainsi que
              toute(s) fiche(s) d'entreprise créée(s). Vos données ne seront pas conservées.
            </li>
          </ul>
        </figure>

        <Heading as="h2">Critères de classement par défaut des fiches entreprises</Heading>
        <Paragraph>
          Les fiches entreprise sont affichées par défaut dans l'ordre alphabétique.
        </Paragraph>

        <Heading as="h2">Responsabilité</Heading>

        <Paragraph>
          Tout utilisateur·trice du site annuaire-tih.fr reconnaît que la responsabilité du
          fondateur ou du développeur du site annuaire-tih.fr ne saurait être retenue, de quelque
          manière que ce soit, et à quelque titre que ce soit, pour tous dommages directs (notamment
          immatériels) et/ou indirects, relatifs à l'utilisation du site annuaire-tih.fr (notamment
          contenu, accès, publication de ses données) par l'utilisateur·trice ou par un tiers via
          son espace personnel. L'utilisateur·trice demeure le/la seul(e) responsable à ce titre.
        </Paragraph>

        <Paragraph>
          L'utilisateur·trice est responsable des données qu'il/elle publie sur annuaire-tih.fr et
          l'utilisation qu'il/elle fait des informations mises à sa disposition et doit par
          conséquent veiller à être en possession de tous les éléments nécessaires à la prise d'une
          décision conforme à ses intérêts.
        </Paragraph>

        <Paragraph>
          Annuaire-tih.fr étant un site gratuit et géré bénévolement, le fondateur, le développeur,
          ou tout autre personne agissant bénévolement pour la modération ou la gestion du site ne
          peuvent-être tenus responsable pour une indisponibilité de ce dernier, pour les délais de
          réponse aux questions ou tout défaut de performance de tout ou partie du site
          annuaire-tih.fr
        </Paragraph>

        <Heading as="h2">Protection de la vie privée</Heading>

        <Paragraph>
          Toute personne ayant participé ou participant bénévolement à la gestion du site
          annuaire-tih.fr s'engage à assurer le meilleur niveau de protection des données
          personnelles des utilisateurs et à respecter le règlement général de la protection des
          données (RGPD), entré en application le 25 mai 2018.
        </Paragraph>

        <Paragraph>
          Les données qui peuvent être collectées via le site annuaire-tih.fr sont celles entrées
          par l'utilisateur du site dans les champs suivants :
        </Paragraph>

        <ul className="list-disc list-outside ps-8 flex flex-col gap-2 text-sm mb-4">
          <li>Nom, Prénom</li>
          <li>Adresse mail</li>
          <li>Nom de l'entreprise</li>
          <li>Siret</li>
          <li>Description de l'entreprise</li>
          <li>Nom de l'entrepreneur</li>
          <li>Sous-domaine de l'entreprise</li>
          <li>Périmètre d'intervention</li>
          <li>Numéro de téléphone</li>
          <li>Mode de travail</li>
          <li>Adresse de site web</li>
          <li>Liens vers réseaux sociaux</li>
          <li>Logo de l'entreprise</li>
          <li>Galerie d'images de l'entreprise</li>
        </ul>

        <Paragraph>
          Ces données ne sont récupérées que pour permettre la publication en ligne ou la mise à
          jour sur l'annuaire des TIH, dans l'intérêt de l'utilisateur.
        </Paragraph>

        <Paragraph>
          L'adresse mail peut servir pour l'envoi de messages de service (information, demande de
          confirmation d'une action sur le compte, répondre à une question de l'utilisateur ou suite
          à un changement de mot de passe par exemple).
        </Paragraph>

        <Paragraph>
          Aucune donnée n'est conservée lors de la suppression du compte de l'utilisateur.
        </Paragraph>

        <Paragraph>
          Les données peuvent être modifiées à tout moment via le compte ou par demande à{" "}
          <a href="mailto:annuairetih@gmail.com" className="text-blue-500 underline">
            annuairetih@gmail.com
          </a>
        </Paragraph>

        <Heading as="h2">Cookies</Heading>

        <Paragraph>
          Le site annuaire-tih.fr utilise des cookies pour optimiser l'expérience utilisateur.
        </Paragraph>

        <Paragraph>Les cookies sont utilisés pour :</Paragraph>

        <ul className="list-disc list-outside ps-8 flex flex-col gap-2 text-sm mb-4">
          <li>Préférence du thème (clair/sombre)</li>
          <li>Authentification (connexion à l'espace personnel)</li>
        </ul>

        <Heading as="h2">Autres informations</Heading>

        <Paragraph>
          Le site est hébergé sur{" "}
          <a
            href="https://www.cloudflare.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 underline"
          >
            Cloudflare
          </a>
          .
        </Paragraph>

        <Paragraph>
          Le nom de domaine est géré par{" "}
          <a
            href="https://www.hostinger.com/fr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 underline"
          >
            Hostinger
          </a>
        </Paragraph>

        <Paragraph>
          Pour mieux connaître vos droits vous pouvez également consulter le site de la Commission
          Nationale de l'Informatique et des Libertés à l'adresse :{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-500 underline"
          >
            www.cnil.fr
          </a>
        </Paragraph>
        <Heading as="h2">Signaler un problème</Heading>

        <Paragraph>
          Pour toute question ou préoccupation, veuillez contacter{" "}
          <a href="mailto:annuairetih@gmail.com" className="text-blue-500 underline">
            annuairetih@gmail.com
          </a>
        </Paragraph>
      </div>
    </main>
  );
}

function Heading({ children, as }: { children: React.ReactNode; as?: "h1" | "h2" | "h3" }) {
  const Component = as || "h2";
  return (
    <Component className="text-lg font-bold mb-4 tracking-tighter underline">{children}</Component>
  );
}

function Paragraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-foreground leading-relaxed mb-3", className)}>{children}</p>
  );
}
