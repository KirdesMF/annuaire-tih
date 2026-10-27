import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, LoaderIcon, Trash2 } from "lucide-react";
import { Separator } from "radix-ui";
import { useRef, useState } from "react";
import { useToast } from "~/components/ui/toast";
import type { UserRole } from "~/db/schema/auth";
import type { CompanyStatus } from "~/db/schema/companies";
import { updateUserRoleFn } from "~/lib/api/admin/mutations/update-user-role";
import { deleteCompany } from "~/lib/api/companies/mutations/delete-company";
import { updateCompanyStatus } from "~/lib/api/companies/mutations/update-company-status";
import { companiesQuery } from "~/lib/api/companies/queries/get-companies";
import { getUsers, usersQuery } from "~/lib/api/users/queries/get-users";
import { createAccountContactsCsv } from "~/lib/csv";
import { COMPANY_STATUSES } from "~/utils/constantes";

export const Route = createFileRoute("/admin/dashboard")({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="min-h-svh grid place-items-center">
      <LoaderIcon className="size-24 animate-spin" />
    </div>
  ),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.prefetchQuery(companiesQuery()),
      context.queryClient.prefetchQuery(usersQuery),
    ]);
  },
});

function RouteComponent() {
  const { toast } = useToast();
  const context = Route.useRouteContext();
  const { data: companies } = useSuspenseQuery(companiesQuery());
  const { data: allUsers } = useSuspenseQuery(usersQuery);
  const { mutate: update } = useMutation({ mutationFn: useServerFn(updateCompanyStatus) });
  const { mutate: remove } = useMutation({ mutationFn: useServerFn(deleteCompany) });
  const { mutate: updateUserRole, isPending: isUpdatingUserRole } = useMutation({
    mutationFn: useServerFn(updateUserRoleFn),
  });

  const fetchAccounts = useServerFn(getUsers);
  const [exportScope, setExportScope] = useState<"all" | "users" | null>(null);
  const [isCopyingEmails, setIsCopyingEmails] = useState(false);

  async function onCopyEmails() {
    setIsCopyingEmails(true);
    try {
      const emails = [...new Set(allUsers.map((account) => account.email.trim()).filter(Boolean))];
      // Write directly from the click gesture so copying also works in WebKit.
      await navigator.clipboard.writeText(emails.join(", "));
      toast({
        status: "success",
        description: "Emails copiés. Collez-les dans le champ Cci de votre messagerie.",
        button: { label: "Fermer" },
      });
    } catch {
      toast({
        status: "error",
        description:
          "Impossible de copier les emails. Vérifiez les autorisations du presse-papiers.",
        button: { label: "Fermer" },
      });
    } finally {
      setIsCopyingEmails(false);
    }
  }

  async function onExportAccounts(scope: "all" | "users") {
    setExportScope(scope);
    try {
      // Re-check server authorization and fetch the current directory on every export.
      const accounts = await fetchAccounts();
      const contacts =
        scope === "all" ? accounts : accounts.filter((account) => account.role === "user");
      const csv = createAccountContactsCsv(contacts);
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      const suffix = scope === "all" ? "avec-admins" : "sans-admins";
      link.download = `annuaire-tih-inscrits-${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      toast({
        status: "error",
        description: "Impossible d'exporter les comptes inscrits. Veuillez réessayer.",
        button: { label: "Fermer" },
      });
    } finally {
      setExportScope(null);
    }
  }

  // keep track of the current user being updated
  const currentUser = useRef("");
  const currentCompany = useRef("");

  const admins = allUsers?.filter((user) => user.role === "admin");
  const users = allUsers?.filter((user) => user.role === "user");
  const pendingCompanies = companies?.filter((company) => company.status === "pending") ?? [];
  const activeCompanies = companies?.filter((company) => company.status === "active") ?? [];
  const rejectedCompanies = companies?.filter((company) => company.status === "rejected") ?? [];
  const companyGroups = [
    { status: "pending", label: "En attente", companies: pendingCompanies },
    { status: "active", label: "Acceptées", companies: activeCompanies },
    { status: "rejected", label: "Rejetées", companies: rejectedCompanies },
  ];
  const totalCompanies = companies?.length ?? 0;
  const totalUsers = users?.length;
  const totalAdmins = admins?.length;

  // TODO: Add confirmation dialog
  function onAction(companyId: string, action: CompanyStatus) {
    currentCompany.current = companyId;
    update(
      { data: { companyId, status: action } },
      {
        onSuccess: () => {
          toast({
            description: "Statut de l'entreprise mis à jour",
            button: { label: "Fermer" },
          });
          context.queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
      },
    );
  }

  // TODO: Add confirmation dialog
  function onDeleteCompany(companyId: string, companySlug: string) {
    remove(
      { data: { companyId, companySlug } },
      {
        onSuccess: () => {
          toast({
            description: "Entreprise supprimée avec succès",
            button: { label: "Fermer" },
          });
          context.queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
      },
    );
  }

  function onUpdateUserRole(userId: string, role: UserRole) {
    currentUser.current = userId;
    updateUserRole(
      { data: { userId, role } },
      {
        onSuccess: () => {
          toast({
            description: "Rôle de l'utilisateur mis à jour",
            button: { label: "Fermer" },
          });
          context.queryClient.invalidateQueries({ queryKey: ["users"] });
        },
      },
    );
  }

  return (
    <main>
      <div className="max-w-5xl mx-auto px-4 py-20 grid gap-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <section aria-labelledby="registered-accounts-heading" className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="registered-accounts-heading" className="text-lg font-bold">
              Comptes inscrits ({allUsers.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyEmails}
                disabled={isCopyingEmails || allUsers.length === 0}
                className="border border-border px-4 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Copy className="size-4" aria-hidden="true" />
                {isCopyingEmails ? "Copie en cours…" : "Copier tous les emails"}
              </button>
              {(["all", "users"] as const).map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => onExportAccounts(scope)}
                  disabled={
                    exportScope !== null ||
                    (scope === "all" ? allUsers.length === 0 : users.length === 0)
                  }
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportScope === scope ? (
                    <LoaderIcon className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="size-4" aria-hidden="true" />
                  )}
                  {exportScope === scope
                    ? "Export en cours…"
                    : scope === "all"
                      ? "CSV avec admins"
                      : "CSV sans admins"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            L'export contient uniquement le nom et l'email. « Sans admins » exclut les
            administrateurs et superadministrateurs. Pour un envoi groupé, collez les emails dans le
            champ Cci afin de ne pas divulguer les adresses aux destinataires.
          </p>
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              Afficher les noms et emails
            </summary>
            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Noms et emails de tous les comptes inscrits</caption>
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Nom
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((account) => (
                    <tr key={account.id} className="border-t border-border">
                      <td className="px-4 py-3">{account.name}</td>
                      <td className="px-4 py-3 break-all">{account.email}</td>
                    </tr>
                  ))}
                  {allUsers.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground">
                        Aucun compte inscrit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </details>
        </section>

        <Separator.Root className="my-4 h-px bg-border" />

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Entreprises ({totalCompanies})</h2>
          <p className="text-sm text-muted-foreground">À valider : {pendingCompanies.length}</p>
          {companyGroups.map((group) => (
            <details key={group.status}>
              <summary className="cursor-pointer text-sm font-medium">
                {group.label} ({group.companies.length})
              </summary>
              <div className="mt-4 grid gap-4">
                {group.companies.map((company) => (
                  <div
                    key={company.id}
                    className="bg-card text-card-foreground shadow-md rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h2 className="text-lg font-bold">
                        <Link to="/entreprises/$slug" params={{ slug: company.slug }}>
                          {company.name}
                        </Link>
                      </h2>
                      <p className="text-sm text-card-foreground">
                        {COMPANY_STATUSES[company.status]}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        name="action"
                        value="accept"
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={company.status === "active"}
                        onClick={() => onAction(company.id, "active")}
                      >
                        Accepter
                      </button>

                      <button
                        name="action"
                        value="reject"
                        type="button"
                        className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={company.status === "rejected"}
                        onClick={() => onAction(company.id, "rejected")}
                      >
                        Rejeter
                      </button>

                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={company.status === "pending"}
                        onClick={() => onAction(company.id, "pending")}
                      >
                        En attente
                      </button>

                      <button
                        type="button"
                        className="text-xs text-destructive border border-destructive px-2 py-1 rounded-sm transition-colors flex items-center gap-2"
                        onClick={() => onDeleteCompany(company.id, company.slug)}
                      >
                        <Trash2 className="size-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                {group.companies.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune entreprise.</p>
                )}
              </div>
            </details>
          ))}
        </div>

        <Separator.Root className="my-4 h-px bg-border" />

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Admins ({totalAdmins})</h2>
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              Afficher les administrateurs
            </summary>
            <div className="mt-4 grid gap-4">
              {admins?.map((user) => (
                <div
                  key={user.id}
                  className="bg-card text-card-foreground shadow-md rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold">{user.name}</p>
                    <p className="text-sm text-card-foreground">{user.email}</p>
                    <p className="text-sm text-card-foreground">Role: {user.role}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-secondary-foreground border border-secondary-foreground px-2 py-1 rounded-sm hover:bg-secondary transition-colors"
                      onClick={() => onUpdateUserRole(user.id, "user")}
                    >
                      Set as user
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>

        <Separator.Root className="my-4 h-px bg-border" />

        <div className="grid gap-4">
          <h2 className="text-lg font-bold">Users ({totalUsers})</h2>
          <details>
            <summary className="cursor-pointer text-sm font-medium">
              Afficher les utilisateurs
            </summary>
            <div className="mt-4 grid gap-4">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="bg-card text-card-foreground shadow-md rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold">{user.name}</p>
                    <p className="text-sm text-card-foreground">{user.email}</p>
                    <p className="text-sm text-card-foreground">Role: {user.role}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-xs text-secondary-foreground border border-secondary-foreground px-2 py-1 rounded-sm hover:bg-secondary transition-colors"
                      onClick={() => onUpdateUserRole(user.id, "admin")}
                    >
                      {isUpdatingUserRole &&
                      currentUser.current === user.id &&
                      user.role === "user" ? (
                        <LoaderIcon className="size-4 animate-spin" />
                      ) : (
                        "Set as admin"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
