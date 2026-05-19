import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowUpRight,
  Building2,
  Check,
  Clock3,
  LoaderIcon,
  Search,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useDeferredValue, useRef } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { isValidRole, type UserRole } from "~/db/schema/auth";
import { type Company, type CompanyStatus, isValidCompanyStatus } from "~/db/schema/companies";
import { updateUserRoleFn } from "~/lib/api/admin/mutations/update-user-role";
import { deleteCompany } from "~/lib/api/companies/mutations/delete-company";
import { updateCompanyStatus } from "~/lib/api/companies/mutations/update-company-status";
import { companiesQuery } from "~/lib/api/companies/queries/get-companies";
import { usersQuery } from "~/lib/api/users/queries/get-users";

export const Route = createFileRoute("/admin/dashboard")({
  validateSearch: (search) => ({
    view: isSearchScope(search.view) ? search.view : defaultDashboardSearch.view,
    q: typeof search.q === "string" ? search.q : defaultDashboardSearch.q,
    companyStatus: isCompanyStatusFilter(search.companyStatus)
      ? search.companyStatus
      : defaultDashboardSearch.companyStatus,
    userRole: isUserRoleFilter(search.userRole) ? search.userRole : defaultDashboardSearch.userRole,
  }),
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const role = context.user?.role;
    const isAdmin = isValidRole(role) && role === "admin";

    if (!context.user || !isAdmin) {
      throw redirect({ to: "/" });
    }
  },
  pendingComponent: () => (
    <div className="min-h-svh grid place-items-center">
      <LoaderIcon className="size-24 animate-spin" />
    </div>
  ),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.prefetchQuery(companiesQuery({ status: "all" })),
      context.queryClient.prefetchQuery(usersQuery),
    ]);
  },
});

type SearchScope = "all" | "companies" | "users";
type CompanyStatusFilter = "all" | CompanyStatus;
type UserRoleFilter = "all" | UserRole;
const defaultDashboardSearch = {
  view: "all" as SearchScope,
  q: "",
  companyStatus: "all" as CompanyStatusFilter,
  userRole: "all" as UserRoleFilter,
};

function isSearchScope(value: unknown): value is SearchScope {
  return value === "all" || value === "companies" || value === "users";
}

function isCompanyStatusFilter(value: unknown): value is CompanyStatusFilter {
  return value === "all" || (typeof value === "string" && isValidCompanyStatus(value));
}

function isUserRoleFilter(value: unknown): value is UserRoleFilter {
  return value === "all" || (typeof value === "string" && isValidRole(value));
}

function RouteComponent() {
  const { toast } = useToast();
  const context = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: companies = [] } = useSuspenseQuery(companiesQuery({ status: "all" }));
  const { data: allUsers = [] } = useSuspenseQuery(usersQuery);
  const deferredQuery = useDeferredValue(search.q);

  const { mutate: updateCompany, isPending: isUpdatingCompany } = useMutation({
    mutationFn: useServerFn(updateCompanyStatus),
  });
  const { mutate: removeCompany, isPending: isDeletingCompany } = useMutation({
    mutationFn: useServerFn(deleteCompany),
  });
  const { mutate: updateUserRole, isPending: isUpdatingUserRole } = useMutation({
    mutationFn: useServerFn(updateUserRoleFn),
  });

  const currentUser = useRef("");
  const currentCompany = useRef("");

  const query = deferredQuery.trim().toLowerCase();
  const usersById = new Map(allUsers.map((user) => [user.id, user]));
  const companiesByUserId = new Map<string, number>();

  for (const company of companies) {
    companiesByUserId.set(company.user_id, (companiesByUserId.get(company.user_id) ?? 0) + 1);
  }

  const companyMatches = companies.filter((company) => {
    if (search.companyStatus !== "all" && company.status !== search.companyStatus) return false;
    if (!query) return true;

    const owner = usersById.get(company.user_id);
    const searchable = [
      company.name,
      company.slug,
      company.siret,
      company.email,
      company.subdomain,
      company.business_owner,
      company.location,
      owner?.name,
      owner?.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);
  });

  const userMatches = allUsers.filter((user) => {
    if (search.userRole !== "all" && user.role !== search.userRole) return false;
    if (!query) return true;

    const searchable = [user.name, user.email, user.role].filter(Boolean).join(" ").toLowerCase();
    return searchable.includes(query);
  });

  const filteredCompanies = search.view === "users" ? [] : companyMatches;
  const filteredUsers = search.view === "companies" ? [] : userMatches;

  const pendingCompanies = filteredCompanies.filter((company) => company.status === "pending");
  const activeCompanies = companies.filter((company) => company.status === "active");
  const rejectedCompanies = companies.filter((company) => company.status === "rejected");
  const adminUsers = allUsers.filter((user) => user.role === "admin");
  const referencedUsers = allUsers.filter((user) => (companiesByUserId.get(user.id) ?? 0) > 0);
  const approvalRate = companies.length
    ? Math.round((activeCompanies.length / companies.length) * 100)
    : 0;

  function updateSearch(nextSearch: Partial<typeof search>, replace = false) {
    navigate({
      to: Route.to,
      search: (prev) => ({ ...prev, ...nextSearch }),
      replace,
    });
  }

  function onAction(companyId: string, action: CompanyStatus) {
    currentCompany.current = companyId;
    updateCompany(
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

  function onDeleteCompany(companyId: string, companySlug: string) {
    currentCompany.current = companyId;
    removeCompany(
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

  function onUpdateUserRole(userId: string, role: "admin" | "user") {
    currentUser.current = userId;
    updateUserRole(
      { data: { userId, role } },
      {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Rôle de l'utilisateur mis à jour",
            button: { label: "Fermer" },
          });
          context.queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => {
          toast({
            status: "error",
            description: error.message || "Impossible de mettre à jour le rôle de l'utilisateur",
            button: { label: "Fermer" },
          });
        },
      },
    );
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-background text-foreground">
      <div className="container px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-6">
          <section className="sticky top-20 z-20 rounded-sm border border-border bg-card p-5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid gap-2">
                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Administration
                </p>
                <div className="grid gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl text-foreground">
                    Dashboard de supervision
                  </h1>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    Suivez l'activite des comptes, priorisez les entreprises a moderer et pilotez la
                    qualite du repertoire depuis une seule vue.
                  </p>
                </div>
              </div>

              <div className="grid w-full gap-2 lg:max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search.q}
                    onChange={(event) => updateSearch({ q: event.target.value }, true)}
                    placeholder="Rechercher un utilisateur, un email, un nom d'entreprise, un slug, un SIRET..."
                    className="h-11 rounded-sm border border-border bg-card pl-9 text-sm shadow-none ring-0 placeholder:text-sm focus-visible:outline-ring"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    active={search.view === "all"}
                    onClick={() => updateSearch({ view: "all" })}
                    label={`Tout (${companyMatches.length + userMatches.length})`}
                  />
                  <ToggleChip
                    active={search.view === "companies"}
                    onClick={() => updateSearch({ view: "companies" })}
                    label={`Entreprises (${companyMatches.length})`}
                  />
                  <ToggleChip
                    active={search.view === "users"}
                    onClick={() => updateSearch({ view: "users" })}
                    label={`Utilisateurs (${userMatches.length})`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-px overflow-hidden rounded-sm border border-border bg-border/30 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              icon={<Building2 className="size-4" />}
              label="Entreprises"
              value={companies.length}
              hint={`${activeCompanies.length} actives, ${rejectedCompanies.length} rejetees`}
            />
            <MetricCard
              icon={<Clock3 className="size-4" />}
              label="A revoir"
              value={pendingCompanies.length}
              hint="Demandes en attente de moderation"
            />
            <MetricCard
              icon={<Users className="size-4" />}
              label="Utilisateurs"
              value={allUsers.length}
              hint={`${referencedUsers.length} avec au moins une entreprise`}
            />
            <MetricCard
              icon={<Shield className="size-4" />}
              label="Admins"
              value={adminUsers.length}
              hint="Comptes ayant acces a l'administration"
            />
            <MetricCard
              icon={<ArrowUpRight className="size-4" />}
              label="Taux d'approbation"
              value={`${approvalRate}%`}
              hint="Entreprises approuvees sur le total"
            />
          </section>

          {search.view !== "users" ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
              <section className="rounded-sm border border-border bg-card p-5">
                <SectionHeader
                  eyebrow="Priorite"
                  title="Moderation immediate"
                  subtitle="Les entreprises en attente remontent ici en premier pour accelerer le tri."
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  <FilterChip
                    active={search.companyStatus === "all"}
                    onClick={() => updateSearch({ companyStatus: "all" })}
                    label={`Tous (${companies.length})`}
                  />
                  <FilterChip
                    active={search.companyStatus === "pending"}
                    onClick={() => updateSearch({ companyStatus: "pending" })}
                    label={`En attente (${companies.filter((company) => company.status === "pending").length})`}
                  />
                  <FilterChip
                    active={search.companyStatus === "active"}
                    onClick={() => updateSearch({ companyStatus: "active" })}
                    label={`Actives (${activeCompanies.length})`}
                  />
                  <FilterChip
                    active={search.companyStatus === "rejected"}
                    onClick={() => updateSearch({ companyStatus: "rejected" })}
                    label={`Rejetees (${rejectedCompanies.length})`}
                  />
                </div>

                <div className="mt-5 grid gap-3">
                  {pendingCompanies.length ? (
                    pendingCompanies.slice(0, 6).map((company) => {
                      const owner = usersById.get(company.user_id);
                      const isWorking =
                        (isUpdatingCompany || isDeletingCompany) &&
                        currentCompany.current === company.id;

                      return (
                        <article
                          key={company.id}
                          className="rounded-sm border border-border bg-card p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="grid gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-sm font-semibold tracking-tight">
                                  <Link to="/entreprises/$slug" params={{ slug: company.slug }}>
                                    {company.name}
                                  </Link>
                                </h2>
                                <StatusPill status={company.status} />
                              </div>

                              <div className="grid gap-1 text-xs text-muted-foreground">
                                <p>SIRET: {company.siret}</p>
                                <p>
                                  Proprietaire: {owner?.name || "Inconnu"}
                                  {owner?.email ? ` • ${owner.email}` : ""}
                                </p>
                                <p>Soumise le {formatDate(company.created_at)}</p>
                              </div>
                            </div>

                            {isWorking ? (
                              <LoaderIcon className="mt-0.5 size-4 animate-spin text-muted-foreground" />
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <IconActionButton
                              label="Approuver"
                              onClick={() => onAction(company.id, "active")}
                              disabled={isWorking}
                              tone="solid"
                              icon={<Check className="size-3.5" />}
                            />
                            <IconActionButton
                              label="Rejeter"
                              onClick={() => onAction(company.id, "rejected")}
                              disabled={isWorking}
                              icon={<X className="size-3.5" />}
                            />
                            <IconActionButton
                              label="Supprimer"
                              onClick={() => onDeleteCompany(company.id, company.slug)}
                              disabled={isWorking}
                              tone="danger"
                              icon={<Trash2 className="size-3.5" />}
                            />
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <EmptyState
                      title="Aucune entreprise a moderer"
                      description="Les nouvelles soumissions ou les resultats de recherche apparaissent ici."
                    />
                  )}
                </div>
              </section>

              <section className="rounded-sm border border-border bg-card p-5">
                <SectionHeader
                  eyebrow="Annuaire"
                  title="Entreprises"
                  subtitle="Vue detaillee des fiches, avec recherche unifiee et commandes de moderation."
                />

                <div className="mt-5 overflow-hidden rounded-sm border border-border">
                  <div className="grid grid-cols-[minmax(0,2fr)_120px_150px_180px] gap-3 border-b border-border bg-muted px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    <span>Entreprise</span>
                    <span>Statut</span>
                    <span>Responsable</span>
                    <span>Actions</span>
                  </div>

                  <div className="divide-y divide-border">
                    {filteredCompanies.length ? (
                      filteredCompanies.map((company) => {
                        const owner = usersById.get(company.user_id);
                        const isWorking =
                          (isUpdatingCompany || isDeletingCompany) &&
                          currentCompany.current === company.id;

                        return (
                          <div
                            key={company.id}
                            className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_120px_150px_180px] md:items-center"
                          >
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <Link
                                  to="/entreprises/$slug"
                                  params={{ slug: company.slug }}
                                  className="text-sm font-medium tracking-tight underline-offset-4 hover:underline"
                                >
                                  {company.name}
                                </Link>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <span>{company.slug}</span>
                                <span> • </span>
                                <span>{company.siret}</span>
                                <span> • </span>
                                <span>{formatDate(company.created_at)}</span>
                              </div>
                            </div>

                            <div>
                              <StatusPill status={company.status} />
                            </div>

                            <div className="grid gap-0.5 text-xs text-muted-foreground">
                              <span>{owner?.name || "Inconnu"}</span>
                              <span>{owner?.email || company.email || "Aucun email"}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end">
                              {isWorking ? (
                                <span className="inline-flex h-8 items-center rounded-sm border border-border px-3 text-xs">
                                  <LoaderIcon className="size-3.5 animate-spin" />
                                </span>
                              ) : (
                                <>
                                  {company.status !== "active" ? (
                                    <IconActionButton
                                      label="Approuver"
                                      onClick={() => onAction(company.id, "active")}
                                      tone="solid"
                                      icon={<Check className="size-3.5" />}
                                    />
                                  ) : null}
                                  {company.status !== "pending" ? (
                                    <ActionButton
                                      label="En attente"
                                      onClick={() => onAction(company.id, "pending")}
                                    />
                                  ) : null}
                                  {company.status !== "rejected" ? (
                                    <IconActionButton
                                      label="Rejeter"
                                      onClick={() => onAction(company.id, "rejected")}
                                      icon={<X className="size-3.5" />}
                                    />
                                  ) : null}
                                  <IconActionButton
                                    label="Supprimer"
                                    onClick={() => onDeleteCompany(company.id, company.slug)}
                                    tone="danger"
                                    icon={<Trash2 className="size-3.5" />}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6">
                        <EmptyState
                          title="Aucun resultat cote entreprises"
                          description="Ajustez la recherche ou les filtres de statut pour retrouver une fiche."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {search.view !== "companies" ? (
            <section className="rounded-sm border border-border bg-card p-5">
              <SectionHeader
                eyebrow="Comptes"
                title="Utilisateurs"
                subtitle="Recherche par nom ou email, avec bascule rapide des roles d'administration."
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <FilterChip
                  active={search.userRole === "all"}
                  onClick={() => updateSearch({ userRole: "all" })}
                  label={`Tous (${allUsers.length})`}
                />
                <FilterChip
                  active={search.userRole === "admin"}
                  onClick={() => updateSearch({ userRole: "admin" })}
                  label={`Admins (${allUsers.filter((user) => user.role === "admin").length})`}
                />
                <FilterChip
                  active={search.userRole === "user"}
                  onClick={() => updateSearch({ userRole: "user" })}
                  label={`Users (${allUsers.filter((user) => user.role === "user").length})`}
                />
              </div>

              <div className="mt-5 overflow-hidden rounded-sm border border-border">
                <div className="grid grid-cols-[minmax(0,2fr)_110px_140px_170px] gap-3 border-b border-border bg-muted px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span>Utilisateur</span>
                  <span>Role</span>
                  <span>Entreprises</span>
                  <span>Action</span>
                </div>

                <div className="divide-y divide-border">
                  {filteredUsers.length ? (
                    filteredUsers.map((user) => {
                      const companyCount = companiesByUserId.get(user.id) ?? 0;
                      const isWorking = isUpdatingUserRole && currentUser.current === user.id;

                      return (
                        <div
                          key={user.id}
                          className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_110px_140px_170px] md:items-center"
                        >
                          <div className="grid gap-1">
                            <p className="text-sm font-medium tracking-tight">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>

                          <div>
                            <RolePill role={user.role} />
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {companyCount} {companyCount > 1 ? "entreprises" : "entreprise"}
                          </div>

                          <div className="flex justify-start md:justify-end">
                            {isWorking ? (
                              <span className="inline-flex h-8 items-center rounded-sm border border-border px-3 text-xs">
                                <LoaderIcon className="size-3.5 animate-spin" />
                              </span>
                            ) : user.role === "user" ? (
                              <ActionButton
                                label="Promouvoir admin"
                                onClick={() => onUpdateUserRole(user.id, "admin")}
                                tone="solid"
                              />
                            ) : user.role === "admin" ? (
                              <ActionButton
                                label="Retirer admin"
                                onClick={() => onUpdateUserRole(user.id, "user")}
                              />
                            ) : (
                              <span className="inline-flex h-8 items-center rounded-sm border border-border px-3 text-xs text-muted-foreground">
                                Role fixe
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6">
                      <EmptyState
                        title="Aucun resultat cote utilisateurs"
                        description="Essayez un autre nom, email ou filtre de role."
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="bg-card p-4">
      <div className="mb-6 inline-flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground">
        {icon}
      </div>
      <div className="grid gap-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
      <div className="grid gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center rounded-sm border px-3 text-xs transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/25",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center rounded-sm border px-3 text-xs transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-transparent text-muted-foreground hover:border-foreground/20",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: CompanyStatus }) {
  const shortLabels = {
    pending: "En attente",
    active: "Approuvee",
    rejected: "Rejetee",
  } as const;

  const styles = {
    pending: "border-border bg-foreground text-background",
    active: "border-border bg-muted text-foreground",
    rejected: "border-border bg-transparent text-muted-foreground",
  } as const;

  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-sm border px-2.5 text-[11px] uppercase tracking-[0.16em]",
        styles[status],
      ].join(" ")}
    >
      {shortLabels[status]}
    </span>
  );
}

function RolePill({ role }: { role: string }) {
  const isElevated = role === "admin";

  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-sm border px-2.5 text-[11px] uppercase tracking-[0.16em]",
        isElevated
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground",
      ].join(" ")}
    >
      {role}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  tone = "ghost",
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "solid" | "ghost" | "danger";
  icon?: React.ReactNode;
}) {
  const tones = {
    solid: "border-border bg-foreground text-background hover:bg-foreground/85",
    ghost: "border-border bg-transparent text-foreground hover:border-foreground/25",
    danger:
      "border-border bg-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-sm border px-3 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function IconActionButton({
  label,
  onClick,
  disabled,
  tone = "ghost",
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "solid" | "ghost" | "danger";
  icon: React.ReactNode;
}) {
  const tones = {
    solid: "border-border bg-foreground text-background hover:bg-foreground/85",
    ghost: "border-border bg-transparent text-foreground hover:border-foreground/25",
    danger:
      "border-border bg-transparent text-muted-foreground hover:border-foreground/25 hover:text-foreground",
  } as const;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={[
              "inline-flex size-8 items-center justify-center rounded-sm border transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              tones[tone],
            ].join(" ")}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="rounded-sm border border-border bg-card px-2 py-1 text-[11px] text-foreground shadow-none"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Empty className="rounded-sm border border-dashed border-border bg-card/50 p-5 text-left">
      <EmptyHeader className="items-start gap-1">
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="text-muted-foreground">{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function formatDate(value: Company["created_at"] | Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
